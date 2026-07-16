import { el, clear } from "../ui";
import { navigate, store, getSitePromise } from "../state";
import type { MoistureBand } from "../types";
import {
  zonePlain,
  phPlain,
  texturePlain,
  slopePlain,
  moisturePlain,
  sunPlain,
} from "../lib/plain";
import { whyThis } from "../components/learn";

// Step 3+4+5: confirm the site. Site data is coarse — soil map units cover
// acres — so everything is shown as "the map says…", with a 60-second ribbon
// test the person can do to overrule it, because standing there they know more
// than the map does.
export async function renderConfirm(main: HTMLElement): Promise<void> {
  clear(main);
  if (store.draft.lat == null) return void navigate("location");

  main.append(el("h2", { class: "step-title" }, "Here's what we think about this spot"));
  const loading = el("p", { class: "coords" }, [el("span", { class: "spinner", style: "border-color:rgba(0,0,0,0.2);border-top-color:var(--brand);display:inline-block;vertical-align:middle" }), " Looking up soil, elevation, and climate…"]);
  main.append(loading);

  const promise = getSitePromise();
  if (promise) {
    try { await promise; } catch { /* fall through with whatever we have */ }
  }
  loading.remove();

  const site = store.draft.site;
  const sun = store.draft.sun;

  // Sun summary.
  if (sun) {
    main.append(el("div", { class: "note info" }, [
      el("strong", {}, "Sun: "),
      `${sunPlain(sun.hours)} `,
      el("span", { style: "opacity:0.85" }, `(roughly ${sun.low}–${sun.high} hours; ${sun.source === "scan" ? "measured by scan" : "your quick pick"}).`),
      el("button", { class: "btn btn-ghost", style: "display:block;margin-top:0.3rem;padding-left:0", onClick: () => navigate("sun") }, "Change the sun estimate"),
    ]));
  }

  if (!site) {
    main.append(el("div", { class: "note warn" }, "We couldn't reach the soil/climate services (no signal, or they're down). You can still get recommendations — just set the moisture below from what you can see, and we'll skip the parts we couldn't look up."));
  }

  // What we looked up, in plain words.
  const rows: (HTMLElement | null)[] = [];
  if (site) {
    rows.push(kv("Winter cold", zonePlain(site.zone, site.zoneMinTempF)));
    rows.push(site.annualRainIn != null ? kv("Rainfall", `About ${site.annualRainIn} inches of rain a year.`) : null);
    rows.push(site.elevationFt != null ? kv("Elevation & slope", `${site.elevationFt} ft up${site.slopeDeg != null ? `, on ${slopePlain(site.slopeDeg)}` : ""}.`) : null);
    rows.push(site.ecoregion ? kv("Region", `${site.ecoregion}.`) : null);
    rows.push(site.ecoregionInfo?.l4Name ? kv("Local area", `${site.ecoregionInfo.l4Name} (finer EPA Level IV).`) : null);
  }
  if (rows.some(Boolean)) {
    main.append(el("div", { class: "card" }, [el("h3", {}, "Climate & land"), ...rows.filter(Boolean) as HTMLElement[]]));
  }

  // Soil — always framed as coarse, with the ribbon test to override.
  const soilCard = el("div", { class: "card" }, [
    el("h3", {}, "Soil (from the map — worth checking)"),
    site && site.soil.texture
      ? kv("The soil map says", `${texturePlain(site.soil.texture)}. ${site.soil.drainage ?? ""}`)
      : el("p", {}, "We couldn't get a soil reading for this point."),
    site && site.soil.phEstimate != null ? kv("Acidity", phPlain(site.soil.phEstimate)) : null,
    el("div", { class: "note warn" }, [
      el("strong", {}, "The soil map is coarse. "),
      "It can cover several acres and won't know that the strip by your driveway is packed clay fill. Do the 60-second check below and trust what you find over the map.",
    ]),
    ribbonTest(),
  ].filter(Boolean) as (HTMLElement)[]);
  main.append(soilCard);

  // Moisture override — the most important correction for plant fit.
  const current: MoistureBand = store.draft.moistureOverride ?? guessMoisture(site?.soil.drainage ?? "");
  const moistureButtons: HTMLButtonElement[] = [];
  const bands: MoistureBand[] = ["dry", "mesic", "wet"];
  const moistureCard = el("div", { class: "card" }, [
    el("h3", {}, "How wet does this spot stay?"),
    el("p", {}, "This is the single most useful thing you can correct. Pick what matches after a heavy rain."),
    whyThis("Why not just improve the soil?", [
      "Natives are already adapted to the soil you have — dry sand, heavy clay, soggy hollows all have their specialists. ",
      "The trick is picking a plant to fit the soil, not hauling in amendments to fit the plant. Answer honestly and the right ones rise to the top.",
    ]),
    ...bands.map((b) => {
      const btn = el("button", {
        class: "choice",
        "aria-pressed": b === current ? "true" : "false",
        onClick: () => {
          store.draft.moistureOverride = b;
          moistureButtons.forEach((mb, i) => mb.setAttribute("aria-pressed", bands[i] === b ? "true" : "false"));
        },
      }, [
        el("span", { class: "choice-title" }, b === "dry" ? "Dry" : b === "mesic" ? "Evenly moist" : "Wet"),
        el("span", { class: "choice-sub" }, moisturePlain(b)),
      ]) as HTMLButtonElement;
      moistureButtons.push(btn);
      return btn;
    }),
  ]);
  store.draft.moistureOverride = current; // lock in the default so ranking uses it
  main.append(moistureCard);

  // Deciduous overhead (affects sun seasonally) — repeated here for correction.
  const decid = el("input", { type: "checkbox", id: "decid2", checked: store.draft.deciduousOverhead, onChange: (e) => { store.draft.deciduousOverhead = (e.target as HTMLInputElement).checked; } }) as HTMLInputElement;
  main.append(el("div", { class: "card" }, [
    el("label", { for: "decid2", style: "display:flex;gap:0.6rem;align-items:flex-start;font-weight:600" }, [
      decid,
      el("span", {}, "Trees overhead that drop their leaves in winter (makes the spot sunnier in spring/fall)."),
    ]),
  ]));

  main.append(el("div", { class: "btn-row" }, [
    el("button", { class: "btn btn-secondary", onClick: () => navigate("sun") }, "Back"),
    el("button", { class: "btn btn-primary", onClick: () => navigate("results") }, "See my plants →"),
  ]));
}

function kv(k: string, v: string): HTMLElement {
  return el("p", { class: "kv" }, [el("span", { class: "k" }, k + ": "), v]);
}

function guessMoisture(drainage: string): MoistureBand {
  if (/fast|well/.test(drainage)) return "dry";
  if (/slow|wet/.test(drainage)) return "wet";
  return "mesic";
}

function ribbonTest(): HTMLElement {
  return el("details", {}, [
    el("summary", { style: "min-height:3rem;display:flex;align-items:center;font-weight:700;cursor:pointer" }, "The 60-second soil check →"),
    el("ol", { style: "padding-left:1.2rem;line-height:1.6" }, [
      el("li", {}, "Grab a small handful of soil and dampen it so it's moist but not dripping."),
      el("li", {}, "Squeeze and knead it into a ball. If it won't hold together at all and feels gritty, it's sandy → choose Dry above."),
      el("li", {}, "Press it out between your thumb and finger into a flat ribbon."),
      el("li", {}, "A short ribbon that breaks quickly and feels smooth = loam/silt → Evenly moist. A long, bendy, sticky ribbon = clay → often stays Wet."),
    ]),
    el("p", { style: "font-size:0.9rem;color:var(--ink-soft)" }, "Whatever you find in your hand beats the map. Set the moisture below to match it."),
  ]);
}
