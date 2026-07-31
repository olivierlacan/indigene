// Renders one ranked plant. Every number is broken out and explained — the
// ecosystem score is never a black box, honesty flags are prominent, and the
// site-match reasoning is spelled out in plain words.
import type { Ranked } from "../lib/ranking";
import type { Plant, Weights } from "../types";
import { el } from "../ui";
import { drawSizeViz } from "./size-viz";
import { statGrid } from "./stat-card";
import { SCORE_KEYS, scoreLabel, bloomSentence, confidencePlain, growthPlain, moistureWord, SOURCES_ROUTE } from "../lib/plain";
import { citation } from "./citation";
import { keystoneIcon } from "./keystone-icon";
import { t, fmtNumber, fmtList } from "../lib/i18n";
import { length, humanHeightLabel } from "../lib/units";
import { nameLines, commonName } from "../lib/names";
import { highlight } from "./filter-field";
import { prose } from "../lib/prose";

/**
 * @param nq A normalized filter query to underline in the card's two name
 *   lines, the way a search result and a region roster row do ("" underlines
 *   nothing). The ranked list rebuilds its cards on every keystroke, so the
 *   query is a build-time argument rather than a handle to call back into.
 */
export function plantCard(r: Ranked, weights: Weights, nq = ""): HTMLElement {
  const p = r.plant;

  const badges = el("div", {}, [
    p.keystone
      ? el("span", { class: "badge keystone", title: t("badge.keystoneTitle") }, [keystoneIcon(), " " + t("badge.keystone")])
      : null,
    p.noWaterEstablish
      ? el("span", { class: "badge nowater", title: t("badge.noWaterTitle") }, t("badge.noWater"))
      : el("span", { class: "badge caution" }, t("badge.needsWater")),
    p.filters.petToxic ? el("span", { class: "badge caution" }, t("badge.petToxic")) : null,
    p.filters.thorny ? el("span", { class: "badge caution" }, t("badge.thorny")) : null,
    p.filters.aggressive ? el("span", { class: "badge caution" }, t("badge.aggressive")) : null,
    p.filters.deerResistant ? el("span", { class: "badge neutral" }, t("badge.deerResistant")) : null,
  ]);

  const names = nameLines(p);
  const head = el("div", { class: "plant-head" }, [
    el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
    el("div", {}, [
      el("h3", { class: "plant-name" }, highlight(names.title, nq)),
      el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" },
        highlight(names.sub, nq)),
      badges,
    ]),
  ]);

  // Site-match summary.
  const matchWord = t(`match.${r.match}` as const);
  const match = el("div", { class: `note ${r.match === "good" ? "info" : r.match === "ok" ? "warn" : "danger"}` }, [
    el("strong", {}, matchWord),
    el("ul", { style: "margin:0.4rem 0 0; padding-left:1.1rem;" }, r.reasons.map((why) => el("li", {}, why))),
  ]);

  // To-scale size viz.
  const canvas = el("canvas", { class: "size-viz", role: "img", "aria-label": sizeAria(p) });
  // Draw after it's in the DOM (needs clientWidth); scheduled via microtask.
  queueMicrotask(() => drawSizeViz(canvas, p));
  const sizeCaption = el("div", { class: "size-caption" }, [
    `${t("card.sizeCaption", {
      human: humanHeightLabel(),
      height: length(p.matureHeightFt),
      spread: length(p.matureSpreadFt),
    })} ${growthPlain(p)}`,
  ]);

  // Transparent score breakdown (weighted total shown, then each part). The
  // bars stay compact here — what each score means is spelled out once, on the
  // plant's own profile page, not repeated on all 25 cards.
  const scoreParts = SCORE_KEYS.map((key) => {
    const val = (p.scores as unknown as Record<string, number>)[key];
    const w = (weights as unknown as Record<string, number>)[key];
    const label = scoreLabel(key);
    return el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [
        el("span", {}, [
          el("span", { "aria-hidden": "true" }, `${label.icon} `),
          label.name + (w >= 4 ? ` ${t("card.weightedHigh")}` : ""),
        ]),
        el("span", {}, `${fmtNumber(val)}${key === "host" ? ` · ${t("card.hostSpecies", { n: fmtNumber(p.hostLepCount) })}` : ""}`),
      ]),
      el("div", { class: "score-bar" }, [el("span", { style: `width:${val}%` })]),
    ]);
  });

  const scores = el("div", {}, [
    el("p", { style: "font-weight:700;margin:0 0 0.2rem" }, t("card.whyRanks", { score: fmtNumber(r.ecoScore) })),
    el("ul", { class: "score-list" }, scoreParts),
  ]);

  const bloom = bloomSentence(p.bloom);

  const body = el("div", { class: "plant-body" }, [
    el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.gives")), prose(p, "givesNote")]),
    el("p", { class: "kv" }, [el("span", { class: "k" }, t("card.needs")), prose(p, "careNote")]),
    el("p", { class: "kv" }, [
      el("span", { class: "k" }, t("card.bloomMoisture")),
      `${bloom} ${t("card.prefersSoil", { bands: fmtList(p.moisture.map(moistureWord)) })}`,
    ]),
    scores,
    el("p", { class: "confidence" }, [
      el("strong", {}, t("card.confidence", { level: t(`confidence.word.${p.confidence}` as const) })),
      confidencePlain(p.confidence),
      " ",
      el("span", {}, [
        t("card.source"),
        ...citation(p.basis),
        " ",
        el("a", { href: SOURCES_ROUTE }, t("card.howSure")),
      ]),
    ]),
  ]);

  return el("article", { class: "plant" }, [head, match, statGrid(p), canvas, sizeCaption, body]);
}

function sizeAria(p: Plant): string {
  const parts = p.size.map((s) =>
    t("card.sizeAriaPart", { year: s.year, height: length(s.heightFt) })
  );
  return t("card.sizeAria", { name: commonName(p), parts: parts.join(", ") });
}

// A simple drawn silhouette so a card is meaningful offline with no photo.
// (Real photos are a Phase-2 addition — see the honesty notes.) Shared with
// the explore/plant pages so a species looks the same everywhere.
export function silhouetteFor(form: string, size = 40): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  const paths: Record<string, string> = {
    tree: "M24 6c6 0 10 5 10 10 0 5-4 9-9 9v11h-2V25c-5 0-9-4-9-9C14 11 18 6 24 6z",
    shrub: "M12 34c-3 0-6-3-6-7s3-6 6-6c0-4 4-8 12-8s12 4 12 8c3 0 6 2 6 6s-3 7-6 7z",
    perennial: "M24 6c2 5 6 6 8 5-1 4-4 6-6 6 3 1 7 0 9-2-1 5-6 8-11 8s-10-3-11-8c2 2 6 3 9 2-2 0-5-2-6-6 2 1 6 0 8-5z",
    grass: "M18 40c0-10-2-18-4-24m10 24c0-12 0-22 0-28m6 28c2-8 4-16 8-22",
    vine: "M24 42V8m0 6c-4 0-7 2-8 5m8 1c4 0 7 2 8 5m-8 3c-4 0-7 2-8 5",
    groundcover: "M6 34c4-6 10-6 14-2 3-4 9-5 14-1 4 3 6 3 8 3v6H6z",
    fern: "M24 42V10m0 6c-3-1-6-3-8-6m8 11c-3-1-6-3-8-6m8 11c3-1 6-3 8-6m-8 1c3-1 6-3 8-6",
  };
  const d = paths[form] ?? paths.perennial;
  const isStroke = form === "grass" || form === "vine" || form === "fern";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  const green = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#175e33";
  if (isStroke) {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", green);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
  } else {
    path.setAttribute("fill", green);
  }
  svg.append(path);
  return svg;
}
