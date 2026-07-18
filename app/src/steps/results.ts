import { el, clear, toast } from "../ui";
import { navigate, store, persistPrefs } from "../state";
import { loadPlants, regionForSite, REGIONS } from "../lib/plants";
import { rankPlants, siteMoisture } from "../lib/ranking";
import type { Weights } from "../types";
import { plantCard } from "../components/plant-card";
import { whyThis } from "../components/learn";
import { scoreLabels } from "../lib/plain";
import { saveSpot } from "../db";

const WEIGHT_KEYS: (keyof Weights)[] = ["host", "pollinator", "bird", "stormwater", "erosion", "carbon", "establishment"];

const PRESETS: { name: string; weights: Weights }[] = [
  { name: "Balanced", weights: { host: 3, pollinator: 3, bird: 3, stormwater: 2, erosion: 2, carbon: 1, establishment: 3 } },
  { name: "Butterflies & moths", weights: { host: 5, pollinator: 5, bird: 3, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { name: "Birds", weights: { host: 4, pollinator: 2, bird: 5, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { name: "Stop erosion", weights: { host: 1, pollinator: 1, bird: 1, stormwater: 4, erosion: 5, carbon: 2, establishment: 4 } },
  { name: "Soak up rain", weights: { host: 1, pollinator: 2, bird: 1, stormwater: 5, erosion: 3, carbon: 2, establishment: 3 } },
  { name: "Easiest to grow", weights: { host: 2, pollinator: 2, bird: 2, stormwater: 1, erosion: 1, carbon: 1, establishment: 5 } },
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
  const regionName = region.meta.name;
  const listEl = el("div", { "aria-live": "polite" });

  function rerender(): void {
    const ranked = rankPlants(plants, {
      site: store.draft.site,
      sun: store.draft.sun,
      weights: store.weights,
      filters: store.filters,
      moistureOverride: store.draft.moistureOverride,
    });
    clear(listEl);
    const shown = ranked.slice(0, 25);
    const goodCount = ranked.filter((r) => r.match !== "poor").length;
    // Only claim a climate check when a looked-up zone actually filtered the
    // list; on the hand-picked-region path nothing was checked against winter.
    const fitClause = store.draft.site?.zone
      ? "fit this spot's climate"
      : "are in this region's list";
    listEl.append(
      el("p", { style: "margin:0.5rem 0 1rem;font-weight:650" }, `${ranked.length} native plants ${fitClause} — ${goodCount} are a good or workable match. Best matches first.`)
    );
    if (!ranked.length) {
      listEl.append(el("div", { class: "note warn" }, `No plants in the ${regionName} seed list are hardy at this spot's winter temperature.`));
    }
    shown.forEach((r) => listEl.append(plantCard(r, store.weights)));
    if (ranked.length > shown.length) {
      listEl.append(el("p", { style: "text-align:center;color:var(--ink-soft)" }, `Showing the top ${shown.length}. Adjust the sliders above to resurface the rest.`));
    }
  }

  // --- Sliders ---
  const sliderRows = WEIGHT_KEYS.map((key) => {
    const label = scoreLabels[key];
    const valSpan = el("span", {}, String(store.weights[key]));
    const input = el("input", {
      type: "range", min: "0", max: "5", step: "1", value: String(store.weights[key]),
      "aria-label": `Importance of: ${label.name}`,
      onInput: (e) => {
        store.weights[key] = Number((e.target as HTMLInputElement).value);
        valSpan.textContent = String(store.weights[key]);
        persistPrefs();
        rerender();
      },
    }) as HTMLInputElement;
    return { input, row: el("div", { class: "weight-row" }, [
      el("div", { class: "weight-head" }, [el("span", {}, label.name), valSpan]),
      input,
    ]) };
  });

  function applyWeights(w: Weights): void {
    store.weights = { ...w };
    sliderRows.forEach(({ input }, i) => {
      const k = WEIGHT_KEYS[i];
      input.value = String(w[k]);
      (input.previousElementSibling?.lastElementChild as HTMLElement).textContent = String(w[k]);
    });
    persistPrefs();
    rerender();
  }

  const presetRow = el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.6rem" },
    PRESETS.map((p) => el("button", { class: "btn btn-secondary", style: "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.7rem;font-size:0.9rem", onClick: () => { applyWeights(p.weights); toast(`Re-sorted for: ${p.name}`); } }, p.name))
  );

  // The re-sort panel opens tall on a phone, so it closes three ways: the
  // summary, a Done button at the bottom, and the chevron makes state obvious.
  const weightsPanel = el("details", { open: false }, [
    el("summary", {}, "⚖️ What matters most?"),
    presetRow,
    ...sliderRows.map((s) => s.row),
    el("button", {
      class: "btn btn-primary btn-block",
      style: "margin:0.25rem 0 0.5rem",
      onClick: () => { (weightsPanel as HTMLDetailsElement).open = false; },
    }, "Done — show the plants"),
  ]);
  const weights = el("div", { class: "weights" }, [weightsPanel]);

  // --- Filters (incl. guerrilla mode) ---
  const filterDefs: { key: keyof typeof store.filters; label: string }[] = [
    { key: "requireNoWater", label: "🌾 Survives with zero watering (guerrilla mode)" },
    { key: "requireDeerResistant", label: "🦌 Deer tend to leave it alone" },
    { key: "excludeThorny", label: "🚫 No thorns" },
    { key: "excludePetToxic", label: "🐕 Safe around pets" },
    { key: "excludeAggressive", label: "✋ No aggressive spreaders" },
  ];
  const filters = el("details", { class: "weights", style: "margin-top:0.5rem" }, [
    el("summary", {}, "🔍 Filters"),
    el("div", { style: "margin-top:0.5rem" }, filterDefs.map((f) =>
      el("label", { style: "display:flex;gap:0.6rem;align-items:center;min-height:3rem;font-weight:500" }, [
        el("input", { type: "checkbox", checked: store.filters[f.key], onChange: (e) => { store.filters[f.key] = (e.target as HTMLInputElement).checked; persistPrefs(); rerender(); } }),
        f.label,
      ])
    )),
  ]);

  const conditions = summarize();

  main.append(
    el("h2", { class: "step-title" }, "Plants for this spot"),
    el("p", { class: "region-tag", style: "margin:0 0 0.5rem;font-size:0.9rem;color:var(--ink-soft)" },
      chosen ? `📍 ${region.meta.name} — your pick, not measured from a location` : `📍 ${region.meta.name}`),
    el("p", { class: "step-lede" }, conditions),
    whyThis("How does this ranking work?", [
      "Each plant's wildlife value — caterpillars hosted, pollinators and birds fed, rain soaked up — is weighed against how well it fits this spot's sun, moisture, and winter cold. ",
      "Nothing is a black box: open any plant's score to see every number and where it came from.",
    ]),
    el("div", { class: "result-controls" }, [weights, filters]),
    el("div", { class: "btn-row", style: "margin-top:0" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("confirm") }, "Back"),
      // A saved spot IS a coordinate — with a hand-picked region there's no
      // spot to save, so the button honestly isn't there.
      ...(hasCoords ? [el("button", { class: "btn btn-primary", onClick: doSave }, "💾 Save this spot")] : []),
    ]),
    listEl
  );

  rerender();

  function summarize(): string {
    const sun = store.draft.sun;
    const m = siteMoisture(store.draft.site, store.draft.moistureOverride);
    const zone = store.draft.site?.zone;
    const parts = [
      sun ? `${sun.label} (~${sun.hours}h sun)` : null,
      `${m === "dry" ? "dry" : m === "wet" ? "wet" : "evenly moist"} soil`,
      zone ? `zone ${zone}` : null,
    ].filter(Boolean);
    // Only claim winter-hardiness when we actually know the winter — with no
    // looked-up zone (hand-picked region, or the lookup failed) we don't.
    const hardy = zone ? " and hardy through your winters" : "";
    return `Matched to: ${parts.join(" · ")}. Everything below is native to this region${hardy}.`;
  }

  async function doSave(): Promise<void> {
    const label = prompt("Name this spot (e.g. \"front strip by driveway\")", defaultLabel());
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
    toast("Saved to this device.");
  }

  function defaultLabel(): string {
    return `Spot at ${store.draft.lat!.toFixed(4)}, ${store.draft.lon!.toFixed(4)}`;
  }
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
    el("h2", { class: "step-title" }, "No plant list for this area yet"),
    el("p", { class: "step-lede" }, [
      "Indigene measured the sun, soil and climate for this spot, but its plant recommendations are still tuned region by region — and this spot is outside the areas covered so far. ",
      "Showing you another region's plants would be dishonest, so we don't.",
    ]),
    el("div", { class: "card" }, [
      el("h3", {}, "Regions covered so far"),
      el("p", {}, "If you know your area actually matches one of these — say, you're just over a boundary — you can use its list. We'll mark it as your pick, and its plants should be treated as untested for your exact area."),
      ...REGIONS.map((r) =>
        el("button", {
          class: "choice",
          onClick: () => {
            store.draft.regionOverride = r.meta.id;
            renderResults(main);
          },
        }, [
          el("span", { class: "choice-title" }, r.meta.name),
          el("span", { class: "choice-sub" }, r.meta.reference),
        ])
      ),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("location") }, "Pick a different spot"),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, "Home"),
    ])
  );
}
