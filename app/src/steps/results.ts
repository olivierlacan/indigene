import { el, clear, toast } from "../ui";
import { navigate, store, persistPrefs } from "../state";
import { loadPlants } from "../lib/plants";
import { rankPlants, siteMoisture } from "../lib/ranking";
import type { Weights } from "../types";
import { plantCard } from "../components/plant-card";
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
  if (store.draft.lat == null) return void navigate("location");

  const plants = loadPlants();
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
    listEl.append(
      el("p", { style: "margin:0.5rem 0 1rem;font-weight:650" }, `${ranked.length} native plants fit this spot's climate — ${goodCount} are a good or workable match. Best matches first.`)
    );
    if (!ranked.length) {
      listEl.append(el("div", { class: "note warn" }, "No plants in this region's seed list are hardy at this spot's winter temperature. This dataset only covers the Mid-Atlantic / Northeast for now."));
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

  const weights = el("div", { class: "weights" }, [
    el("details", { open: false }, [
      el("summary", {}, "⚖️ What matters most to you? (re-sort the list)"),
      el("p", { style: "font-size:0.9rem;color:var(--ink-soft)" }, "Pick a quick preset, or drag the sliders. The list re-sorts instantly."),
      presetRow,
      ...sliderRows.map((s) => s.row),
    ]),
  ]);

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
    el("p", { class: "step-lede" }, conditions),
    el("div", { class: "result-controls" }, [weights, filters]),
    el("div", { class: "btn-row", style: "margin-top:0" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("confirm") }, "Back"),
      el("button", { class: "btn btn-primary", onClick: doSave }, "💾 Save this spot"),
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
    return `Matched to: ${parts.join(" · ")}. Everything below is native to this region and hardy through your winters.`;
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
