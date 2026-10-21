import { scaleChip, ecoregionChip } from "../components/zone-chip";
import { moistureIcon } from "../components/moisture-icon";
import { sunIcon } from "../components/sun-icon";
import { statTiles } from "../components/stat-card";
import { goalIcon, filterIcon, chevronIcon } from "../components/control-icons";
import { soilAnswer } from "../lib/soil-answer";
import { guideLink, guideHref, quietLink } from "../components/guide-link";
import { el, clear, toast } from "../ui";
import { mostWanted, wantedRegionHref } from "../lib/invasives";
import { navigate, store, persistPrefs, resultsTrail, leaveResults } from "../state";
import { REGIONS } from "../lib/plants";
import { zoneChip } from "../components/zone-chip";
import { siteMoisture } from "../lib/ranking";
import { draftRegion, draftPlants, rankDraft, draftContext } from "../lib/draft";
import { priorityName, matchingPreset } from "../lib/priorities";
import { plantCard, silhouetteFor } from "../components/plant-card";
import { FORM_ORDER } from "../lib/forms";
import { reportRosterUntranslated } from "../components/wip-banner";
import { recompute } from "../components/recompute";
import { privacyRoute } from "../components/privacy-link";
import {
  sunLabel,
  ISSUES_URL,
  moistureWord,
} from "../lib/plain";
import { getSpot, saveSpot } from "../db";
import { townFor } from "../lib/places";
import { t, tn, tx, fmtNumber, fmtList } from "../lib/i18n";
import { maxHeightChoices, maxSpreadChoices, nearestRung, temperature } from "../lib/units";
import { commonName, regionName, regionReference } from "../lib/names";
import { filterBox, norm } from "../components/filter-field";
import { filterCount } from "../lib/filter-traits";
import type { Plant, PlantForm } from "../types";

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
  const summaryEl = el("div", { "aria-live": "polite", class: "result-tally" });
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

  // Cards drawn so far: 25 at a time, the next 25 on request, ranked the same.
  const PAGE = 25;
  let limit = PAGE;

  function rerender(): void {
    const ranked = rankDraft(plants);
    // The typed name narrows the *ranked* list, not just the cards on screen:
    // only the top 25 are ever drawn, so hiding drawn cards would quietly lose
    // the oak sitting at rank 30. The names searched are the same three a
    // region roster matches on — displayed, English, and botanical.
    // Without a name typed, the list ends at the last plant that suits the
    // spot: paging on into poor matches is how a list fills up with plants
    // nobody should buy. Typing a name still finds any of them, on purpose.
    const suits = ranked.filter((r) => r.match !== "poor");
    const hits = nameQuery
      ? ranked.filter((r) => nameHay(r.plant).includes(nameQuery))
      : suits;
    const leftOut = nameQuery ? 0 : ranked.length - suits.length;
    // Said here rather than on the keystroke, because a slider or a filter can
    // change what a standing query matches without anyone typing a thing.
    nameFilter.say(matchLine(hits.length, ranked.length));

    clear(listEl);
    const shown = hits.slice(0, limit);
    const goodCount = ranked.filter((r) => r.match !== "poor").length;
    // Only claim a climate check when a looked-up zone actually filtered the
    // list; on the hand-picked-region path nothing was checked against winter.
    // Always the whole roster's tally: it describes the spot, not the typing.
    // Two figures, not a sentence: how many natives are in play, and how many
    // suit the spot. The order of the list says "best first" on its own.
    summaryEl.replaceChildren(statTiles([
      {
        icon: "🌿", label: t("results.tallyNatives"), value: fmtNumber(ranked.length),
        explain: store.draft.site?.zone ? t("results.tallyNativesClimate") : t("results.tallyNativesList"),
      },
      {
        icon: "🌱", label: t("results.tallyGood"), value: fmtNumber(goodCount),
        explain: t("results.tallyGoodExplain"),
      },
    ], t("results.tallyLabel"), { figures: true }));
    if (!ranked.length) {
      // Blame the right culprit: with any filter set, it's almost certainly the
      // filters that emptied the list, not the climate.
      const f = store.filters;
      const anyFilter = filterCount(f) > 0;
      listEl.append(el("div", { class: "note warn" },
        anyFilter ? t("results.noneFiltered", { region: name }) : t("results.noneHardy", { region: name })));
    }
    shown.forEach((r) => listEl.append(plantCard(r, store.weights, nameQuery, regionId)));
    if (hits.length > shown.length) {
      const next = Math.min(PAGE, hits.length - shown.length);
      listEl.append(el("div", { class: "show-more" }, [
        el("p", {}, t("results.showingTop", { n: fmtNumber(shown.length), total: fmtNumber(hits.length) })),
        el("button", {
          class: "btn btn-secondary",
          type: "button",
          onClick: () => { limit += PAGE; rerender(); },
        }, t("results.showMore", { n: fmtNumber(next) })),
      ]));
    }
    if (hits.length <= shown.length && leftOut > 0) {
      listEl.append(el("p", { class: "list-end" }, t("results.poorLeftOut", { n: fmtNumber(leftOut) })));
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
  // The whole row is the control: no "Change" word to wrap the goal's name.
  const rankedFor = el("button", {
    class: "control-row",
    type: "button",
    "aria-label": `${t("results.goalLabel")}: ${priorityName(store.weights)}. ${t("results.changeGoalAria")}`,
    onClick: () => navigate("priorities"),
  }, [
    // The chosen goal's own icon, as on the goals step; a mix of your own has
    // none, so it gets the plain target.
    matchingPreset(store.weights)
      ? el("span", { class: "control-icon control-icon-emoji", "aria-hidden": "true" }, matchingPreset(store.weights)!.icon)
      : goalIcon(),
    el("span", { class: "control-text" }, [
      el("span", { class: "control-label" }, t("results.goalLabel")),
      el("span", { class: "control-value" }, priorityName(store.weights)),
    ]),
    chevronIcon("right"),
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
    const selectedFt = stored == null ? s.choices[1].ft : nearestRung(s.choices, stored);
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
    return el("label", { class: "filter-check" }, [
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
  const filters = el("details", { class: "weights" }, [
    el("summary", { class: "control-row" }, [
      filterIcon(),
      el("span", { class: "control-text" }, [
        el("span", { class: "control-label" }, t("filter.summary")),
        // What they're for while none is on; once some are, how many — so a
        // closed panel still says the list is narrowed.
        el("span", { class: "control-value" }, filterCount(store.filters)
          ? t("filter.activeCount", { n: filterCount(store.filters) })
          : t("filter.hint")),
      ]),
      chevronIcon("down"),
    ]),
    el("div", { class: "filter-grid" }, [
      ...filterDefs.map((f) =>
        el("label", { class: "filter-check" }, [
          el("input", { type: "checkbox", checked: store.filters[f.key], onChange: (e) => { store.filters[f.key] = (e.target as HTMLInputElement).checked; persistPrefs(); rerender(); } }),
          f.label,
        ])
      ),
      ...sizeRows,
    ]),
    quietLink("info", "#/traits", t("results.filtersMeaning"), "margin:0.4rem 0 0.2rem"),
  ]);

  // --- Plant types, on or off, right under the name search: both narrow the
  // list below them. Out in the open rather than in the panel
  // above: "no trees, I have no room" is the first thing many readers want
  // and the panel is easy to miss (Show HN, #255). On means shown; the list
  // keeps at least one type on, because an empty list answers nothing.
  //
  // Icons only, on one row of equal squares: eight labelled chips either wrap
  // to four lines or scroll sideways, and a chip scrolled out of view is a
  // filter nobody finds. The silhouettes are the ones every plant card and
  // region heading wears; the line under the row names what's hidden, in words.
  //
  // Annuals share the flower drawing (there is no annual glyph), so one
  // Flowers toggle covers both: two identical squares would ask the reader to
  // tell apart what the page draws the same.
  const chipFor = (f: PlantForm): PlantForm => (f === "annual" ? "perennial" : f);
  const formsHere = FORM_ORDER.filter((f) => plants.some((p) => chipFor(p.form) === f));
  const formsOf = (chip: PlantForm): PlantForm[] => FORM_ORDER.filter((f) => chipFor(f) === chip);
  const isHidden = (chip: PlantForm) => formsOf(chip).every((f) => store.filters.hiddenForms.includes(f));
  const typeButtons: HTMLButtonElement[] = [];
  const typeCaption = el("p", { class: "type-caption", "aria-live": "polite" });
  // Shift turns a click into "only this type", and on the type that already
  // stands alone, "all but this one". Each square names which while Shift is
  // held (a class on the root, below), so the reader sees it before clicking.
  watchShift();
  const typeModes: HTMLElement[] = [];
  const onlyShown = (chip: PlantForm) =>
    !isHidden(chip) && formsHere.every((x) => x === chip || isHidden(x));
  const pressTypes = () => {
    typeButtons.forEach((b, i) => b.setAttribute("aria-pressed", isHidden(formsHere[i]) ? "false" : "true"));
    typeModes.forEach((m, i) => { m.textContent = t(onlyShown(formsHere[i]) ? "filter.typesExcept" : "filter.typesOnly"); });
    const hidden = formsHere.filter(isHidden);
    typeCaption.textContent = hidden.length
      ? t("filter.typesHiding", { types: fmtList(hidden.map((f) => t(`form.chip.${f}` as const))) })
      : t("filter.typesAll");
  };
  const typeChips = formsHere.length > 1
    ? el("div", {}, [el("div", {
        class: "type-chips",
        role: "group",
        "aria-label": t("filter.typesLabel"),
        style: `grid-template-columns:repeat(${formsHere.length},1fr)`,
      },
        formsHere.map((f) => {
          const icon = silhouetteFor(f, 24);
          icon.setAttribute("aria-hidden", "true");
          const mode = el("span", { class: "type-mode", "aria-hidden": "true" });
          typeModes.push(mode);
          const press = (solo: boolean) => {
            const hidden = store.filters.hiddenForms;
            const mine = formsOf(f);
            const others = formsHere.filter((x) => x !== f).flatMap(formsOf);
            const next = solo
              ? (onlyShown(f) ? mine : others)
              : isHidden(f)
              ? hidden.filter((x) => !mine.includes(x))
              : [...hidden.filter((x) => !mine.includes(x)), ...mine];
            if (formsHere.every((x) => formsOf(x).every((m) => next.includes(m)))) {
              toast(t("filter.typesKeepOne"));
              return;
            }
            store.filters.hiddenForms = next;
            pressTypes();
            persistPrefs();
            rerender();
          };
          // A phone has no Shift: holding a square does the same. Its label
          // shows once the hold outlasts a tap, and the click that ends the
          // hold is swallowed so it doesn't toggle the square straight back.
          let holdTimer = 0;
          let held = false;
          const release = () => { clearTimeout(holdTimer); btn.classList.remove("holding"); };
          const btn = el("button", {
            class: "btn btn-secondary",
            type: "button",
            "aria-label": t(`form.chip.${f}` as const),
            title: t(`form.chip.${f}` as const),
            onPointerdown: (ev: Event) => {
              const e = ev as PointerEvent;
              if (e.pointerType === "mouse") return;
              held = false;
              btn.classList.add("holding");
              holdTimer = window.setTimeout(() => {
                held = true;
                btn.classList.remove("holding");
                navigator.vibrate?.(15);
                press(true);
              }, 500);
            },
            onPointerup: release,
            onPointercancel: release,
            onPointerleave: release,
            onContextmenu: (e: Event) => e.preventDefault(),
            onClick: (e: Event) => {
              if (held) { held = false; return; }
              press((e as MouseEvent).shiftKey);
            },
          }, [icon, mode]) as HTMLButtonElement;
          typeButtons.push(btn);
          return btn;
        })), typeCaption])
    : null;
  pressTypes();

  const conditions = summarize();

  main.append(
    el("h2", { class: "step-title" }, t("results.title")),
    el("p", { class: "region-tag", style: "margin:0 0 0.5rem;font-size:0.9rem;color:var(--ink-soft)" },
      // The region links its whole roster: the list below is only its best fits.
      [...tx(chosen ? "results.regionTagPick" : "results.regionTag",
        { region: el("a", { href: `#/regions/${region.meta.id}` }, name) }),
       // The ecoregion that chose this list, as a quiet code beside its name.
       ...(store.draft.site?.ecoregionInfo
        ? [" ", ecoregionChip(store.draft.site.ecoregionInfo, guideHref("regions", "zones"))] : [])]),
    conditions,
    el("div", { class: "result-controls" }, [rankedFor, filters]),
    guideLink("ranking", t("guide.ranking"), undefined, "margin:0.5rem 0 0"),
    summaryEl,
    rc.node,
    nameFilter.node,
    ...(typeChips ? [typeChips] : []),
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
    ...(hasCoords ? [quietLink("lock", privacyRoute("saved"), t("results.privacyLink"), "margin:0.6rem 0 0")] : []),
    // The rest of the region, for a reader who has their list: what it feeds,
    // and what to pull.
    el("p", { class: "more-link", style: "margin-top:1rem" }, tx(
      mostWanted(region.meta.id).length ? "results.alsoHere" : "results.alsoHereWildlife",
      {
        wildlife: el("a", { href: `#/wildlife/in/${region.meta.id}` }, t("nav.wildlife")),
        invasives: el("a", { href: wantedRegionHref(region.meta.id) }, t("plants.door.invasives")),
      },
    )),
  );

  rerender();

  // Back where you left it. After the router's own scroll-to-top, hence the
  // frame's wait: the cards are on the page by then, so there's a page tall
  // enough to scroll.
  if (restoreTo) requestAnimationFrame(() => window.scrollTo(0, restoreTo));

  // Common parlance first, the technical term in parentheses with a link —
  // "zone 8b" and "mesic" are never shown bare (see the plain-language rule).
  // The spot's conditions as a row of icon + words — the sun step's own sun
  // drawing, the soil step's drop, and the ❄️ the plant pages' figure tiles use — so each reads
  // back as the answer the reader gave. Plain text, not buttons: the controls
  // below are what you tap.
  function summarize(): HTMLElement {
    const site = store.draft.site;
    const sun = store.draft.sun;
    const zone = site?.zone;
    const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
    const item = (icon: Node | string, words: (string | Node)[]): HTMLElement =>
      el("li", {}, [el("span", { class: "condition-icon", "aria-hidden": "true" }, [icon]), el("span", {}, words)]);

    const items: HTMLElement[] = [];
    // Recomputed from the hours rather than read off `sun.label`: that label
    // was written when the estimate was made, possibly in another language and
    // possibly several sessions ago (it rides along in saved spots).
    if (sun) {
      const level = sun.hours >= 6 ? "full" : sun.hours >= 2 ? "half" : "shade";
      items.push(item(sunIcon(level), [t("results.condSun", { label: cap(sunLabel(sun.hours)), hours: fmtNumber(sun.hours) })]));
    }
    const m = siteMoisture(site, store.draft.moistureOverride);
    items.push(item(moistureIcon(m), [cap(t("results.soilBand", { word: moistureWord(m) }))]));
    if (zone) {
      const chip = scaleChip("USDA", zone, t("zoneChip.zone", { zone }), guideHref("regions", "zones"));
      items.push(item("❄️", site?.zoneMinTempF != null
        ? [t("results.condWinter", { temp: temperature(site.zoneMinTempF) }), " ", chip]
        : [chip]));
    }
    return el("div", { class: "conditions" }, [
      // No "everything below is native" line: the app lists nothing else, and
      // the zone tag already says the winter was checked.
      el("ul", { class: "condition-list", "aria-label": t("results.condLabel") }, items),
    ]);
  }

  async function doSave(): Promise<void> {
    // Re-saving an open saved spot keeps what this page doesn't own — its
    // name as the default, its invasives list, when it was first saved.
    const prev = store.draft.editingId ? await getSpot(store.draft.editingId).catch(() => undefined) : undefined;
    const label = prompt(t("results.savePrompt"), prev?.label ?? defaultLabel());
    if (label == null) return;
    const id = store.draft.editingId ?? cryptoId();
    await saveSpot({
      ...prev,
      id,
      createdAt: prev?.createdAt ?? Date.now(),
      label: label.trim() || defaultLabel(),
      lat: store.draft.lat!,
      lon: store.draft.lon!,
      site: store.draft.site,
      sun: store.draft.sun,
      horizon: store.draft.horizon,
      soilOverride: soilAnswer(store.draft.moistureOverride, store.draft.site),
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

// Shift held anywhere marks the root, so the type squares can say what a
// click would do. Installed once; losing focus counts as letting go.
let shiftWatched = false;
function watchShift(): void {
  if (shiftWatched) return;
  shiftWatched = true;
  const root = document.documentElement;
  const set = (on: boolean) => root.classList.toggle("shift-held", on);
  document.addEventListener("keydown", (e) => { if (e.key === "Shift") set(true); });
  document.addEventListener("keyup", (e) => { if (e.key === "Shift") set(false); });
  window.addEventListener("blur", () => set(false));
}
