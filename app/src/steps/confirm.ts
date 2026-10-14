import { el, clear } from "../ui";
import { navigate, store, getSitePromise, rememberDraftSpot } from "../state";
import type { MoistureBand } from "../types";
import {
  phPlain,
  texturePlain,
  slopePlain,
  sunPlain,
} from "../lib/plain";
import { whyThis } from "../components/learn";
import { moistureIcon } from "../components/moisture-icon";
import { scaleChip, ecoregionChip } from "../components/zone-chip";
import { guideHref, quietLink } from "../components/guide-link";
import { temperature } from "../lib/units";
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

  // What we looked up, as icon rows: the icon is the answer at a glance (the
  // same ❄️ and 🌧️ the plant pages' figures use), the words the detail.
  const rows: (HTMLElement | null)[] = [];
  if (site) {
    const zoneChip = site.zone
      ? scaleChip("USDA", site.zone, t("zoneChip.zone", { zone: site.zone }), guideHref("regions", "zones"))
      : null;
    rows.push(fact("❄️", t("confirm.winterCold"),
      !zoneChip ? [t("zone.unknown")]
        : site.zoneMinTempF != null ? [t("confirm.winterValue", { temp: temperature(site.zoneMinTempF) }), " ", zoneChip]
        : [zoneChip]));
    rows.push(site.annualRainIn != null
      ? fact("🌧️", t("confirm.rainfall"), t("confirm.rainfallValue", { amount: rainfall(site.annualRainIn) }))
      : null);
    rows.push(site.elevationFt != null
      ? fact("⛰️", t("confirm.elevation"), t("confirm.elevationValue", {
          height: elevation(site.elevationFt),
          slope: site.slopeDeg != null ? t("confirm.elevationSlope", { slope: slopePlain(site.slopeDeg) }) : "",
        }))
      : null);
    rows.push(site.ecoregion ? fact("🗺️", t("confirm.region"), site.ecoregionInfo
      ? [site.ecoregionInfo.name, " ", ecoregionChip(site.ecoregionInfo, guideHref("regions", "zones"))]
      : site.ecoregion) : null);
    // Only some providers have a finer local subdivision (EPA Level IV); the EEA
    // biogeographical regions are a single flat level, so this row is skipped.
    const detail = site.ecoregionInfo?.detail;
    rows.push(detail ? fact("📍", t("confirm.localArea"), t("confirm.localAreaValue", { name: detail.name })) : null);
  }
  if (rows.some(Boolean)) {
    main.append(el("div", { class: "card" }, [el("h3", {}, t("confirm.climateTitle")), ...rows.filter(Boolean) as HTMLElement[]]));
  }

  // Soil: what the map says, and one line on why your hands know better. The
  // 60-second check itself lives in the guide, a tap away for whoever wants it.
  const soilCard = el("div", { class: "card" }, [
    el("h3", {}, t("confirm.soilTitle")),
    site && site.soil.texture
      ? fact("🤲", t("confirm.texture"), texturePlain(site.soil.texture))
      : el("p", {}, t("confirm.soilNone")),
    site && site.soil.phEstimate != null ? fact("🧪", t("confirm.acidity"), phPlain(site.soil.phEstimate)) : null,
    el("p", { class: "fact-note" }, t("confirm.soilCoarse")),
    quietLink("info", guideHref("find", "soil"), t("confirm.soilCheckLink")),
  ].filter(Boolean) as (HTMLElement)[]);
  main.append(soilCard);

  // Moisture override — the most important correction for plant fit.
  const mapGuess = guessMoisture(site?.soil.drainage ?? "");
  const current: MoistureBand = store.draft.moistureOverride ?? mapGuess;
  // Only worth saying when the memory is actually what's on screen. A
  // remembered answer that agrees with the map changed nothing — claiming
  // credit for it would be noise, and (since the guess gets locked into the
  // same field below) sometimes a claim about an answer nobody gave.
  const recalledMoisture = store.draft.recalled.moisture && current !== mapGuess;
  const moistureButtons: HTMLButtonElement[] = [];
  const bands: MoistureBand[] = ["dry", "mesic", "wet"];
  // Says so when the answer already showing is this spot's own, from a previous
  // visit — one line, with the three buttons that change it right below it.
  // An empty array, not an empty string: `.memory-note:empty` is what collapses
  // the line away, and a zero-length text node is still a child.
  const moistureNote = el("p", { class: "memory-note" },
    recalledMoisture ? [t("confirm.moistureRemembered")] : []);
  const moistureCard = el("div", { class: "card" }, [
    el("h3", {}, t("confirm.moistureTitle")),
    el("p", {}, t("confirm.moistureLede")),
    whyThis(t("confirm.moistureWhyTitle"), t("confirm.moistureWhy")),
    moistureNote,
    ...bands.map((b) => {
      const btn = el("button", {
        class: "choice choice-with-glyph",
        "aria-pressed": b === current ? "true" : "false",
        onClick: () => {
          store.draft.moistureOverride = b;
          store.draft.recalled.moisture = false;
          clear(moistureNote);
          moistureButtons.forEach((mb, i) => mb.setAttribute("aria-pressed", bands[i] === b ? "true" : "false"));
          rememberDraftSpot();
        },
      }, [
        el("span", { class: "choice-glyph", "aria-hidden": "true" }, [moistureIcon(b)]),
        el("span", {}, [
          el("span", { class: "choice-title" }, t(`confirm.${b}` as const)),
          el("span", { class: "choice-sub" }, t(`moisture.short.${b}` as const)),
        ]),
      ]) as HTMLButtonElement;
      moistureButtons.push(btn);
      return btn;
    }),
  ]);
  store.draft.moistureOverride = current; // lock in the default so ranking uses it
  main.append(moistureCard);

  // Deciduous overhead (affects sun seasonally) — repeated here for correction.
  const decid = el("input", { type: "checkbox", id: "decid2", checked: store.draft.deciduousOverhead, onChange: (e) => {
    store.draft.deciduousOverhead = (e.target as HTMLInputElement).checked;
    rememberDraftSpot();
  } }) as HTMLInputElement;
  main.append(el("div", { class: "card" }, [
    // Same words as the sun step's own checkbox: it's the same question.
    el("label", { for: "decid2", class: "check-row" }, [
      decid,
      el("span", {}, [
        el("span", { class: "check-title" }, t("sun.deciduous")),
        el("span", { class: "check-sub" }, t("sun.deciduousSub")),
      ]),
    ]),
  ]));

  main.append(el("div", { class: "btn-row" }, [
    el("button", { class: "btn btn-secondary", onClick: () => navigate("sun") }, t("confirm.back")),
    el("button", { class: "btn btn-primary", onClick: () => { rememberDraftSpot(); navigate("priorities"); } }, t("confirm.next")),
  ]));
}

/** One looked-up fact: its icon, a small label, and the value in words. */
function fact(icon: string, label: string, value: string | (string | Node)[]): HTMLElement {
  return el("div", { class: "fact" }, [
    el("span", { class: "fact-icon", "aria-hidden": "true" }, icon),
    el("p", {}, [el("span", { class: "fact-label" }, label), el("span", { class: "fact-value" }, Array.isArray(value) ? value : [value])]),
  ]);
}

function guessMoisture(drainage: string): MoistureBand {
  if (/fast|well/.test(drainage)) return "dry";
  if (/slow|wet/.test(drainage)) return "wet";
  return "mesic";
}
