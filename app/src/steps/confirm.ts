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
  ZONE_INFO_URL,
} from "../lib/plain";
import { whyThis } from "../components/learn";
import { t, fmtNumber } from "../lib/i18n";
import { elevation, rainfall } from "../lib/units";

// Step 3+4+5: confirm the site. Site data is coarse — soil map units cover
// acres — so everything is shown as "the map says…", with a 60-second ribbon
// test the person can do to overrule it, because standing there they know more
// than the map does.
export async function renderConfirm(main: HTMLElement): Promise<void> {
  clear(main);
  const hasCoords = store.draft.lat != null;
  if (!hasCoords && !store.draft.regionOverride) return void navigate("location");

  main.append(el("h2", { class: "step-title" }, t("confirm.title")));
  if (hasCoords) {
    const loading = el("p", { class: "coords" }, [el("span", { class: "spinner", style: "border-top-color:var(--brand);display:inline-block;vertical-align:middle" }), t("confirm.loading")]);
    main.append(loading);
    const promise = getSitePromise();
    if (promise) {
      try { await promise; } catch { /* fall through with whatever we have */ }
    }
    loading.remove();
  }

  const site = store.draft.site;
  const sun = store.draft.sun;

  // Sun summary.
  if (sun) {
    main.append(el("div", { class: "note info" }, [
      el("strong", {}, t("confirm.sun")),
      `${sunPlain(sun.hours)} `,
      t("confirm.sunRange", {
        low: fmtNumber(sun.low),
        high: fmtNumber(sun.high),
        source: t(sun.source === "scan" ? "confirm.sunFromScan" : "confirm.sunFromPick"),
      }),
      el("button", { class: "btn btn-ghost", style: "display:block;margin-top:0.3rem;padding-left:0", onClick: () => navigate("sun") }, t("confirm.changeSun")),
    ]));
  }

  if (!site) {
    main.append(el("div", { class: "note warn" },
      t(hasCoords ? "confirm.noSiteOnline" : "confirm.noSiteManual")));
  }

  // What we looked up, in plain words.
  const rows: (HTMLElement | null)[] = [];
  if (site) {
    rows.push(kv(t("confirm.winterCold"), [
      zonePlain(site.zone, site.zoneMinTempF),
      ...(site.zone ? [" ", el("a", { href: ZONE_INFO_URL, target: "_blank", rel: "noopener" }, t("confirm.zoneMapLink"))] : []),
    ]));
    rows.push(site.annualRainIn != null
      ? kv(t("confirm.rainfall"), t("confirm.rainfallValue", { amount: rainfall(site.annualRainIn) }))
      : null);
    rows.push(site.elevationFt != null
      ? kv(t("confirm.elevation"), t("confirm.elevationValue", {
          height: elevation(site.elevationFt),
          slope: site.slopeDeg != null ? t("confirm.elevationSlope", { slope: slopePlain(site.slopeDeg) }) : "",
        }))
      : null);
    rows.push(site.ecoregion ? kv(t("confirm.region"), `${site.ecoregion}.`) : null);
    // Only some providers have a finer local subdivision (EPA Level IV); the EEA
    // biogeographical regions are a single flat level, so this row is skipped.
    const detail = site.ecoregionInfo?.detail;
    rows.push(detail ? kv(t("confirm.localArea"), t("confirm.localAreaValue", { name: detail.name })) : null);
  }
  if (rows.some(Boolean)) {
    main.append(el("div", { class: "card" }, [el("h3", {}, t("confirm.climateTitle")), ...rows.filter(Boolean) as HTMLElement[]]));
  }

  // Soil — always framed as coarse, with the ribbon test to override.
  const soilCard = el("div", { class: "card" }, [
    el("h3", {}, t("confirm.soilTitle")),
    site && site.soil.texture
      ? kv(t("confirm.soilSays"), `${texturePlain(site.soil.texture)}. ${site.soil.drainage ?? ""}`)
      : el("p", {}, t("confirm.soilNone")),
    site && site.soil.phEstimate != null ? kv(t("confirm.acidity"), phPlain(site.soil.phEstimate)) : null,
    el("div", { class: "note warn" }, [
      el("strong", {}, t("confirm.soilCoarse")),
      t("confirm.soilCoarseRest"),
    ]),
    ribbonTest(),
  ].filter(Boolean) as (HTMLElement)[]);
  main.append(soilCard);

  // Moisture override — the most important correction for plant fit.
  const current: MoistureBand = store.draft.moistureOverride ?? guessMoisture(site?.soil.drainage ?? "");
  const moistureButtons: HTMLButtonElement[] = [];
  const bands: MoistureBand[] = ["dry", "mesic", "wet"];
  const moistureCard = el("div", { class: "card" }, [
    el("h3", {}, t("confirm.moistureTitle")),
    el("p", {}, t("confirm.moistureLede")),
    whyThis(t("confirm.moistureWhyTitle"), t("confirm.moistureWhy")),
    ...bands.map((b) => {
      const btn = el("button", {
        class: "choice",
        "aria-pressed": b === current ? "true" : "false",
        onClick: () => {
          store.draft.moistureOverride = b;
          moistureButtons.forEach((mb, i) => mb.setAttribute("aria-pressed", bands[i] === b ? "true" : "false"));
        },
      }, [
        el("span", { class: "choice-title" }, t(`confirm.${b}` as const)),
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
      el("span", {}, t("confirm.deciduous")),
    ]),
  ]));

  main.append(el("div", { class: "btn-row" }, [
    el("button", { class: "btn btn-secondary", onClick: () => navigate("sun") }, t("confirm.back")),
    el("button", { class: "btn btn-primary", onClick: () => navigate("priorities") }, t("confirm.next")),
  ]));
}

function kv(k: string, v: string | (string | Node)[]): HTMLElement {
    // The colon is part of the label rather than the template, because French
  // sets a narrow no-break space before it and English sets none.
  return el("p", { class: "kv" }, [el("span", { class: "k" }, t("confirm.kvLabel", { k })), ...(Array.isArray(v) ? v : [v])]);
}

function guessMoisture(drainage: string): MoistureBand {
  if (/fast|well/.test(drainage)) return "dry";
  if (/slow|wet/.test(drainage)) return "wet";
  return "mesic";
}

function ribbonTest(): HTMLElement {
  return el("div", {}, [
    el("p", { style: "font-weight:700;margin:0.8rem 0 0.3rem" }, t("confirm.ribbonTitle")),
    el("ol", { style: "padding-left:1.2rem;line-height:1.6" }, [
      el("li", {}, t("confirm.ribbon1")),
      el("li", {}, t("confirm.ribbon2")),
      el("li", {}, t("confirm.ribbon3")),
      el("li", {}, t("confirm.ribbon4")),
    ]),
    el("p", { style: "font-size:0.9rem;color:var(--ink-soft)" }, t("confirm.ribbonNote")),
  ]);
}
