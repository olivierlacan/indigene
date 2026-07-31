import { el, clear, toast } from "../ui";
import { navigate, store, persistPrefs } from "../state";
import { loadPlants, regionForSite, REGIONS } from "../lib/plants";
import { zoneChip } from "../components/zone-chip";
import { rankPlants, siteMoisture } from "../lib/ranking";
import type { Weights } from "../types";
import { plantCard } from "../components/plant-card";
import { whyThis } from "../components/learn";
import { privacyNote } from "../components/privacy-link";
import {
  SCORE_KEYS,
  scoreLabel,
  sunLabel,
  ISSUES_URL,
  ZONE_INFO_URL,
  MOISTURE_INFO_URL,
  moistureWord,
} from "../lib/plain";
import { saveSpot } from "../db";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { maxHeightChoices, maxSpreadChoices, temperature } from "../lib/units";
import { commonName, regionName, regionReference } from "../lib/names";
import { filterBox, norm } from "../components/filter-field";
import type { Plant } from "../types";

const WEIGHT_KEYS: (keyof Weights)[] = [...SCORE_KEYS];

// The preset *weights* are a product decision and don't vary by language; only
// the button's name does, so each preset carries its dictionary key.
const PRESETS: { key: TKey; weights: Weights }[] = [
  { key: "preset.balanced", weights: { host: 3, pollinator: 3, bird: 3, stormwater: 2, erosion: 2, carbon: 1, establishment: 3 } },
  { key: "preset.butterflies", weights: { host: 5, pollinator: 5, bird: 3, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { key: "preset.birds", weights: { host: 4, pollinator: 2, bird: 5, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { key: "preset.erosion", weights: { host: 1, pollinator: 1, bird: 1, stormwater: 4, erosion: 5, carbon: 2, establishment: 4 } },
  { key: "preset.rain", weights: { host: 1, pollinator: 2, bird: 1, stormwater: 5, erosion: 3, carbon: 2, establishment: 3 } },
  { key: "preset.easiest", weights: { host: 2, pollinator: 2, bird: 2, stormwater: 1, erosion: 1, carbon: 1, establishment: 5 } },
];

export function renderResults(main: HTMLElement): void {
  clear(main);
  const hasCoords = store.draft.lat != null && store.draft.lon != null;
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");

  // Pick the plant list from the spot's coordinates, refined by its real EPA
  // ecoregion when we have one — unless the user picked a region by hand, in
  // which case their choice wins and the tag below says so. Outside every
  // covered region we have no honest recommendations to give, so we say so
  // plainly rather than showing another region's plants.
  const chosen = store.draft.regionOverride
    ? REGIONS.find((r) => r.meta.id === store.draft.regionOverride) ?? null
    : null;
  const region = chosen ?? (hasCoords
    ? regionForSite(store.draft.lat!, store.draft.lon!, store.draft.site)
    : null);
  if (!region) {
    renderNoRegion(main);
    return;
  }

  const plants = loadPlants(region);
  const name = regionName(region.meta);
  // The site summary sits outside the list so the filter field can live between
  // the two — and so typing doesn't rebuild the field the reader is typing in.
  const summaryEl = el("p", { "aria-live": "polite", style: "margin:0.5rem 0 1rem;font-weight:650" });
  const listEl = el("div", { "aria-live": "polite" });

  // The standing name filter, normalized for matching and kept as typed for
  // quoting back in the line under the field.
  let nameQuery = "";
  let typedQuery = "";

  function rerender(): void {
    const ranked = rankPlants(plants, {
      site: store.draft.site,
      sun: store.draft.sun,
      weights: store.weights,
      filters: store.filters,
      moistureOverride: store.draft.moistureOverride,
    });
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
    shown.forEach((r) => listEl.append(plantCard(r, store.weights, nameQuery)));
    if (hits.length > shown.length) {
      listEl.append(el("p", { style: "text-align:center;color:var(--ink-soft)" },
        t("results.showingTop", { n: fmtNumber(shown.length) })));
    }
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
      el("a", { href: `#/search/${encodeURIComponent(typedQuery)}` }, t("results.filterSearchAll")),
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

  // --- Sliders ---
  const sliderRows = WEIGHT_KEYS.map((key) => {
    const label = scoreLabel(key);
    const valSpan = el("span", {}, fmtNumber(store.weights[key]));
    const input = el("input", {
      type: "range", min: "0", max: "5", step: "1", value: String(store.weights[key]),
      "aria-label": t("results.sliderAria", { name: label.name }),
      onInput: (e) => {
        store.weights[key] = Number((e.target as HTMLInputElement).value);
        valSpan.textContent = fmtNumber(store.weights[key]);
        persistPrefs();
        rerender();
      },
    }) as HTMLInputElement;
    return { input, row: el("div", { class: "weight-row" }, [
      el("div", { class: "weight-head" }, [
        el("span", {}, [el("span", { "aria-hidden": "true" }, `${label.icon} `), label.name]),
        valSpan,
      ]),
      input,
    ]) };
  });

  function applyWeights(w: Weights): void {
    store.weights = { ...w };
    sliderRows.forEach(({ input }, i) => {
      const k = WEIGHT_KEYS[i];
      input.value = String(w[k]);
      (input.previousElementSibling?.lastElementChild as HTMLElement).textContent = fmtNumber(w[k]);
    });
    persistPrefs();
    rerender();
  }

  const presetRow = el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.6rem" },
    PRESETS.map((p) => el("button", {
      class: "btn btn-secondary",
      style: "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.7rem;font-size:0.9rem",
      onClick: () => { applyWeights(p.weights); toast(t("results.resorted", { name: t(p.key) })); },
    }, t(p.key)))
  );

  // The re-sort panel opens tall on a phone, so it closes three ways: the
  // summary, a Done button at the bottom, and the chevron makes state obvious.
  const weightsPanel = el("details", { open: false }, [
    el("summary", {}, t("results.weightsSummary")),
    presetRow,
    ...sliderRows.map((s) => s.row),
    el("button", {
      class: "btn btn-primary btn-block",
      style: "margin:0.25rem 0 0.5rem",
      onClick: () => { (weightsPanel as HTMLDetailsElement).open = false; },
    }, t("results.done")),
  ]);
  const weights = el("div", { class: "weights" }, [weightsPanel]);

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
    whyThis(t("results.whyTitle"), t("results.why")),
    el("div", { class: "result-controls" }, [weights, filters]),
    summaryEl,
    nameFilter.node,
    listEl,
    // After the plants, like every other step in the flow puts its buttons
    // after the thing the step is for. These used to sit above the list, which
    // asked the reader to step over a dead end — a way back to the soil
    // question, and an offer to save a spot they hadn't seen the plants for —
    // before reaching the one thing they came for.
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("confirm") }, t("results.back")),
      // A saved spot IS a coordinate — with a hand-picked region there's no
      // spot to save, so the button honestly isn't there.
      ...(hasCoords ? [el("button", { class: "btn btn-primary", onClick: doSave }, t("results.save"))] : []),
    ]),
    ...(hasCoords ? [privacyNote(t("results.privacy"))] : [])
  );

  rerender();

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

  function defaultLabel(): string {
    return t("results.defaultLabel", {
      lat: store.draft.lat!.toFixed(4),
      lon: store.draft.lon!.toFixed(4),
    });
  }
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
