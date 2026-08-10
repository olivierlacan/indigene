import { el, clear, toast } from "../ui";
import { navigate, store, persistPrefs, resultsTrail, leaveResults } from "../state";
import { REGIONS } from "../lib/plants";
import { zoneChip } from "../components/zone-chip";
import { siteMoisture } from "../lib/ranking";
import { draftRegion, draftPlants, rankDraft, draftContext } from "../lib/draft";
import { priorityName } from "../lib/priorities";
import { plantCard } from "../components/plant-card";
import { reportRosterUntranslated } from "../components/wip-banner";
import { recompute } from "../components/recompute";
import { privacyNote } from "../components/privacy-link";
import {
  sunLabel,
  ISSUES_URL,
  ZONE_INFO_URL,
  MOISTURE_INFO_URL,
  moistureWord,
} from "../lib/plain";
import { saveSpot } from "../db";
import { townFor } from "../lib/places";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import { maxHeightChoices, maxSpreadChoices, temperature } from "../lib/units";
import { commonName, regionName, regionReference } from "../lib/names";
import { filterBox, norm } from "../components/filter-field";
import type { Plant } from "../types";

/** How deep a slice of the ranking the recompute line compares — the same
 *  window the goals step previews, so the two pages report on the same thing. */
const COMPARE_DEPTH = 25;

export async function renderResults(main: HTMLElement): Promise<(() => void) | void> {
  clear(main);
  const { region, chosen, hasCoords } = draftRegion();
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");

  // The plant list comes from the spot's coordinates, refined by its real EPA
  // ecoregion when we have one — unless the user picked a region by hand, in
  // which case their choice wins and the tag below says so. Outside every
  // covered region we have no honest recommendations to give, so we say so
  // plainly rather than showing another region's plants.
  if (!region) {
    renderNoRegion(main);
    return;
  }

  const plants = await draftPlants(region);
  // Captured rather than read inside `rerender`: the narrowing above doesn't
  // survive into a closure, and every card needs to say which region's row —
  // and so which region's translation — it is showing.
  const regionId = region.meta.id;
  const name = regionName(region.meta);
  const context = draftContext(region);
  const rc = recompute("list");

  // Coming back from a plant's page lands where you left off, not at the top of
  // a list you'd already scrolled halfway down. Read (and cleared) before the
  // first render; restored after it, so the cards exist to scroll past.
  const restoreTo = resultsTrail.scrollY;
  resultsTrail.open = false;
  resultsTrail.scrollY = null;
  // The site summary sits outside the list so the filter field can live between
  // the two — and so typing doesn't rebuild the field the reader is typing in.
  const summaryEl = el("p", { "aria-live": "polite", style: "margin:0.5rem 0 1rem;font-weight:650" });
  const listEl = el("div", { "aria-live": "polite" });

  // Where the list was when a card was tapped — read at the tap, not at
  // teardown. A hash navigation that matches no element on the page makes the
  // browser jump to the top *before* `hashchange` fires, so by the time the
  // step is torn down `window.scrollY` is already somebody else's number.
  let tappedAt = 0;
  listEl.addEventListener("click", (e) => {
    if ((e.target as Element | null)?.closest("a.plant-pick-link")) tappedAt = window.scrollY;
  });

  // The standing name filter, normalized for matching and kept as typed for
  // quoting back in the line under the field.
  let nameQuery = "";
  let typedQuery = "";
  // Landing on the list is not a recompute. A ranking that *did* change on the
  // way here still says so — but "the order didn't change" is only worth saying
  // to someone who just tried to change it.
  let firstPaint = true;

  // Every card here prints two paragraphs of catalog prose. Reported against the
  // region's whole list rather than the filtered slice on screen: the gap is a
  // fact about the region, and a banner that blinked in and out as a slider or
  // the name filter moved would read as a glitch rather than as an honest caveat.
  reportRosterUntranslated(plants, regionId);

  function rerender(): void {
    const ranked = rankDraft(plants);
    // The typed name narrows the *ranked* list, not just the cards on screen:
    // only the top 25 are ever drawn, so hiding drawn cards would quietly lose
    // the oak sitting at rank 30. The names searched are the same three a
    // region roster matches on — displayed, English, and botanical.
    const hits = nameQuery
      ? ranked.filter((r) => nameHay(r.plant).includes(nameQuery))
      : ranked;
    // Said here rather than on the keystroke, because a slider or a filter can
    // change what a standing query matches without anyone typing a thing.
    nameFilter.say(matchLine(hits.length, ranked.length));

    clear(listEl);
    const shown = hits.slice(0, 25);
    const goodCount = ranked.filter((r) => r.match !== "poor").length;
    // Only claim a climate check when a looked-up zone actually filtered the
    // list; on the hand-picked-region path nothing was checked against winter.
    const fitClause = store.draft.site?.zone ? t("results.fitClimate") : t("results.fitList");
    // Always the whole roster's tally: it describes the spot, not the typing.
    summaryEl.replaceChildren(t("results.count", {
      n: fmtNumber(ranked.length),
      fit: fitClause,
      good: fmtNumber(goodCount),
    }));
    if (!ranked.length) {
      // Blame the right culprit: with any filter set, it's almost certainly the
      // filters that emptied the list, not the climate.
      const f = store.filters;
      const anyFilter = f.requireNoWater || f.requireDeerResistant || f.excludeThorny || f.excludePetToxic || f.excludeAggressive || f.maxHeightFt != null || f.maxSpreadFt != null;
      listEl.append(el("div", { class: "note warn" },
        anyFilter ? t("results.noneFiltered", { region: name }) : t("results.noneHardy", { region: name })));
    }
    shown.forEach((r) => listEl.append(plantCard(r, store.weights, nameQuery, regionId)));
    if (hits.length > shown.length) {
      listEl.append(el("p", { style: "text-align:center;color:var(--ink-soft)" },
        t("results.showingTop", { n: fmtNumber(shown.length) })));
    }
    // What the recompute changed — measured on the ranking itself, never on the
    // typing, so a name filter doesn't get reported as a re-rank. Compared
    // against the list as *this page* last showed it, which is what lets it say
    // "black cherry now leads" when you come back from changing a goal.
    rc.report(context, ranked.slice(0, COMPARE_DEPTH)
      .map((r) => ({ id: r.plant.id, name: commonName(r.plant) })), ranked.length, firstPaint);
    firstPaint = false;
  }

  /** The line under the field: nothing typed says nothing. */
  function matchLine(shown: number, total: number): (string | Node)[] {
    if (!nameQuery) return [];
    // Plural-aware: French agrees the verb and the noun with how many matched.
    if (shown) {
      return [tn("results.filterCount", shown,
        { shown: fmtNumber(shown), total: fmtNumber(total), q: typedQuery })];
    }
    return [
      t("results.filterNone"),
      el("a", { href: `#/plants?q=${encodeURIComponent(typedQuery)}` }, t("results.filterSearchAll")),
      t("results.filterNoneRest"),
    ];
  }

  const nameFilter = filterBox({
    label: t("results.filterAria"),
    placeholder: t("results.filterPlaceholder"),
    onInput(nq, typed) {
      nameQuery = nq;
      typedQuery = typed;
      rerender();
    },
  });

  // --- What this list was ranked for ---
  // The sliders used to live here, inside a closed panel, which meant the order
  // of the list was decided by settings nobody had been shown. They're a step
  // of their own now (steps/priorities.ts); what stays behind is the answer to
  // "why this order?" — named, and one tap from being changed.
  const rankedFor = el("div", { class: "ranked-for" }, [
    el("p", {}, [
      el("span", { "aria-hidden": "true" }, "⚖️ "),
      t("results.rankedFor"),
      el("strong", {}, priorityName(store.weights)),
    ]),
    el("button", {
      class: "btn btn-secondary",
      "aria-label": t("results.changeGoalAria"),
      onClick: () => navigate("priorities"),
    }, t("results.changeGoal")),
  ]);

  // --- Filters (incl. guerrilla mode) ---
  type BoolFilterKey = "requireNoWater" | "requireDeerResistant" | "excludeThorny" | "excludePetToxic" | "excludeAggressive";
  const filterDefs: { key: BoolFilterKey; label: string }[] = [
    { key: "requireNoWater", label: t("filter.noWater") },
    { key: "requireDeerResistant", label: t("filter.deer") },
    { key: "excludeThorny", label: t("filter.thorns") },
    { key: "excludePetToxic", label: t("filter.petSafe") },
    { key: "excludeAggressive", label: t("filter.aggressive") },
  ];
  // Size caps for tight spots — under a window, beside a walkway, a small bed.
  // Same checkbox rows as the filters above; the checkbox is the on/off, the
  // little select is only the threshold. Judged against the plant's honest
  // eventual size (matureHeightFt/SpreadFt), not the polite nursery-tag
  // numbers, because the ceiling is what you live with.
  //
  // The stored value stays in feet, but the ladder offered is round numbers in
  // the reader's *own* units (see `maxHeightChoices`) — a filter labelled
  // "1.8 m" reads as a bug even though it's exactly 6 ft.
  const sizeDefs: {
    key: "maxHeightFt" | "maxSpreadFt";
    icon: string;
    lead: string;
    tail: string;
    aria: string;
    choices: { ft: number; label: string }[];
  }[] = [
    { key: "maxHeightFt", icon: "📏", lead: t("filter.size.lead"), tail: t("filter.height.tail"), aria: t("filter.height.aria"), choices: maxHeightChoices() },
    { key: "maxSpreadFt", icon: "↔️", lead: t("filter.size.lead"), tail: t("filter.spread.tail"), aria: t("filter.spread.aria"), choices: maxSpreadChoices() },
  ];
  const sizeRows = sizeDefs.map((s) => {
    // Keep whatever was stored selected even after a units switch moved the
    // ladder: pick the nearest rung rather than silently resetting the filter.
    const stored = store.filters[s.key];
    const selectedFt = stored == null ? s.choices[1].ft : nearest(s.choices, stored);
    const select = el("select", {
      style: "width:auto;flex:0 0 auto;min-height:2.4rem;padding:0.25rem 0.5rem;font-size:0.95rem",
      "aria-label": s.aria,
      disabled: stored == null,
      onChange: () => {
        if (store.filters[s.key] != null) {
          store.filters[s.key] = Number(select.value);
          persistPrefs();
          rerender();
        }
      },
    }, s.choices.map((c) =>
      el("option", { value: String(c.ft), selected: c.ft === selectedFt }, c.label)
    )) as HTMLSelectElement;
    return el("label", { style: "display:flex;gap:0.6rem;align-items:center;min-height:3rem;font-weight:500" }, [
      el("input", { type: "checkbox", checked: stored != null, onChange: (e) => {
        store.filters[s.key] = (e.target as HTMLInputElement).checked ? Number(select.value) : null;
        select.disabled = store.filters[s.key] == null;
        persistPrefs();
        rerender();
      } }),
      `${s.icon} ${s.lead}`,
      select,
      s.tail,
    ]);
  });
  const filters = el("details", { class: "weights", style: "margin-top:0.5rem" }, [
    el("summary", {}, t("filter.summary")),
    el("div", { style: "margin-top:0.5rem" }, [
      ...filterDefs.map((f) =>
        el("label", { style: "display:flex;gap:0.6rem;align-items:center;min-height:3rem;font-weight:500" }, [
          el("input", { type: "checkbox", checked: store.filters[f.key], onChange: (e) => { store.filters[f.key] = (e.target as HTMLInputElement).checked; persistPrefs(); rerender(); } }),
          f.label,
        ])
      ),
      ...sizeRows,
    ]),
  ]);

  const conditions = summarize();

  main.append(
    el("h2", { class: "step-title" }, t("results.title")),
    el("p", { class: "region-tag", style: "margin:0 0 0.5rem;font-size:0.9rem;color:var(--ink-soft)" },
      chosen ? t("results.regionTagPick", { region: name }) : t("results.regionTag", { region: name })),
    el("p", { class: "step-lede" }, conditions),
    el("div", { class: "result-controls" }, [rankedFor, filters]),
    summaryEl,
    rc.node,
    nameFilter.node,
    listEl,
    // After the plants, like every other step in the flow puts its buttons
    // after the thing the step is for. These used to sit above the list, which
    // asked the reader to step over a dead end — a way back to the soil
    // question, and an offer to save a spot they hadn't seen the plants for —
    // before reaching the one thing they came for.
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("priorities") }, t("results.back")),
      // A saved spot IS a coordinate — with a hand-picked region there's no
      // spot to save, so the button honestly isn't there.
      ...(hasCoords ? [el("button", { class: "btn btn-primary", onClick: doSave }, t("results.save"))] : []),
    ]),
    ...(hasCoords ? [privacyNote(t("results.privacy"))] : [])
  );

  rerender();

  // Back where you left it. After the router's own scroll-to-top, hence the
  // frame's wait: the cards are on the page by then, so there's a page tall
  // enough to scroll.
  if (restoreTo) requestAnimationFrame(() => window.scrollTo(0, restoreTo));

  // Common parlance first, the technical term in parentheses with a link —
  // "zone 8b" and "mesic" are never shown bare (see the plain-language rule).
  function summarize(): (string | Node)[] {
    const link = (href: string, text: string): HTMLElement =>
      el("a", { href, target: "_blank", rel: "noopener" }, text);
    const sun = store.draft.sun;
    const m = siteMoisture(store.draft.site, store.draft.moistureOverride);
    const site = store.draft.site;
    const zone = site?.zone;

    const parts: (string | Node)[][] = [];
    // Recomputed from the hours rather than read off `sun.label`: that label
    // was written when the estimate was made, possibly in another language and
    // possibly several sessions ago (it rides along in saved spots).
    if (sun) parts.push([t("results.sunSummary", { label: sunLabel(sun.hours), hours: fmtNumber(sun.hours) })]);
    parts.push(
      m === "mesic"
        ? tx("results.mesicSoil", { link: link(MOISTURE_INFO_URL, t("results.mesicTerm")) })
        : [t("results.soilBand", { word: moistureWord(m) })]
    );
    if (zone) {
      const zoneLink = link(ZONE_INFO_URL, t("results.zoneLink", { zone }));
      parts.push(
        site?.zoneMinTempF != null
          ? tx("results.wintersTo", { link: zoneLink }, { temp: temperature(site.zoneMinTempF) })
          : [zoneLink]
      );
    }

    const out: (string | Node)[] = [t("results.matchedTo")];
    parts.forEach((p, i) => { if (i) out.push(" · "); out.push(...p); });
    // Only claim winter-hardiness when we actually know the winter — with no
    // looked-up zone (hand-picked region, or the lookup failed) we don't.
    out.push(t("results.nativeAll", { hardy: zone ? t("results.andHardy") : "" }));
    return out;
  }

  async function doSave(): Promise<void> {
    const label = prompt(t("results.savePrompt"), defaultLabel());
    if (label == null) return;
    const id = store.draft.editingId ?? cryptoId();
    await saveSpot({
      id,
      createdAt: Date.now(),
      label: label.trim() || defaultLabel(),
      lat: store.draft.lat!,
      lon: store.draft.lon!,
      site: store.draft.site,
      sun: store.draft.sun,
      horizon: store.draft.horizon,
      soilOverride: null,
      deciduousOverhead: store.draft.deciduousOverhead,
      regionOverride: store.draft.regionOverride,
      weights: { ...store.weights },
    });
    store.draft.editingId = id;
    toast(t("results.saved"));
  }

  // The name offered in the "what shall we call this?" box. A town beats two
  // numbers by a mile as an opening suggestion — "Radnor, Pennsylvania" is
  // something you can accept and edit, "Spot at 40.0379, -75.3557" is something
  // you have to replace. Falls back to the numbers when no town is known.
  function defaultLabel(): string {
    const town = townFor(store.draft.lat!, store.draft.lon!);
    if (town) return town;
    return t("results.defaultLabel", {
      lat: store.draft.lat!.toFixed(4),
      lon: store.draft.lon!.toFixed(4),
    });
  }

  // Stepping off the list — onto a plant's page, or back to the goals — leaves
  // a trail those pages can offer as the way back, with the scroll position
  // that makes it a *return* rather than a fresh arrival.
  return () => leaveResults(location.hash, tappedAt);
}

// Carries the English name too, not only the displayed one: a French reader who
// knows a plant as "red maple" should still find it. Same three names the region
// rosters match on.
function nameHay(p: Plant): string {
  return norm(`${commonName(p)} ${p.common} ${p.latin}`);
}

/** The rung of the ladder closest to a stored value, in feet. */
function nearest(choices: { ft: number }[], value: number): number {
  return choices.reduce((best, c) =>
    Math.abs(c.ft - value) < Math.abs(best - value) ? c.ft : best, choices[0].ft);
}

function cryptoId(): string {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return "spot-" + Math.abs(Date.now() ^ (performance.now() * 1000)).toString(36);
}

// Shown when the spot is outside every region we have a plant list for. The
// sun/soil/climate readings still worked — we just won't fake a plant list.
// We won't *guess* another region's plants, but a person who knows their area
// straddles one of our lists can choose it — their call, plainly labelled.
function renderNoRegion(main: HTMLElement): void {
  main.append(
    el("h2", { class: "step-title" }, t("noRegion.title")),
    el("p", { class: "step-lede" }, t("noRegion.lede")),
    el("div", { class: "card" }, [
      el("h3", {}, t("noRegion.whatTitle")),
      el("ul", { style: "margin:0.5rem 0 0;padding-left:1.2rem" }, [
        el("li", { style: "margin-bottom:0.4rem" }, [
          el("a", { href: "#/plants", style: "font-weight:650" }, t("noRegion.browse")),
          t("noRegion.browseRest"),
        ]),
        el("li", {}, [
          el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener", style: "font-weight:650" }, t("noRegion.ask")),
          t("noRegion.askRest"),
        ]),
      ]),
    ]),
    el("div", { class: "card" }, [
      el("h3", {}, t("noRegion.regionsTitle")),
      el("p", {}, t("noRegion.regionsLede")),
      ...REGIONS.map((r) =>
        el("button", {
          class: "choice",
          onClick: () => {
            store.draft.regionOverride = r.meta.id;
            renderResults(main);
          },
        }, [
          el("span", { class: "choice-title" }, regionName(r.meta)),
          el("span", { class: "choice-sub" }, [regionReference(r.meta), " ", zoneChip(r.meta)]),
        ])
      ),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("location") }, t("noRegion.pickDifferent")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );
}
