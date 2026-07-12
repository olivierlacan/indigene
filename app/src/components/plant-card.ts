// Renders one ranked plant. Every number is broken out and explained — the
// ecosystem score is never a black box, honesty flags are prominent, and the
// site-match reasoning is spelled out in plain words.
import type { Ranked } from "../lib/ranking";
import type { Weights } from "../types";
import { el } from "../ui";
import { drawSizeViz } from "./size-viz";
import { scoreLabels, confidencePlain } from "../lib/plain";

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function plantCard(r: Ranked, weights: Weights): HTMLElement {
  const p = r.plant;

  const badges = el("div", {}, [
    p.keystone
      ? el("span", { class: "badge keystone", title: "A keystone plant supports far more wildlife than most — losing it would unravel the local food web." }, "★ Keystone plant")
      : null,
    p.noWaterEstablish
      ? el("span", { class: "badge nowater", title: "Expected to establish and survive with no watering after planting, in an average year." }, "Survives with no watering")
      : el("span", { class: "badge caution" }, "Needs water to establish"),
    p.filters.petToxic ? el("span", { class: "badge caution" }, "Toxic if eaten") : null,
    p.filters.thorny ? el("span", { class: "badge caution" }, "Thorny") : null,
    p.filters.aggressive ? el("span", { class: "badge caution" }, "Spreads — give it room") : null,
    p.filters.deerResistant ? el("span", { class: "badge neutral" }, "Deer tend to leave it alone") : null,
  ]);

  const head = el("div", { class: "plant-head" }, [
    el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
    el("div", {}, [
      el("h3", { class: "plant-name" }, p.common),
      el("div", { class: "plant-latin" }, p.latin),
      badges,
    ]),
  ]);

  // Site-match summary.
  const matchWord = r.match === "good" ? "Good match for this spot" : r.match === "ok" ? "Workable here" : "Poor match — here's why";
  const match = el("div", { class: `note ${r.match === "good" ? "info" : r.match === "ok" ? "warn" : "danger"}` }, [
    el("strong", {}, matchWord),
    el("ul", { style: "margin:0.4rem 0 0; padding-left:1.1rem;" }, r.reasons.map((why) => el("li", {}, why))),
  ]);

  // To-scale size viz.
  const canvas = el("canvas", { class: "size-viz", role: "img", "aria-label": sizeAria(p) });
  // Draw after it's in the DOM (needs clientWidth); scheduled via microtask.
  queueMicrotask(() => drawSizeViz(canvas, p));
  const sizeCaption = el("div", { class: "size-caption" }, [
    `Drawn to scale beside a 5′6″ person. Eventually reaches about ${fmtSize(p.matureHeightFt)} tall and ${fmtSize(p.matureSpreadFt)} wide.`,
  ]);

  // Transparent score breakdown (weighted total shown, then each part).
  const scoreParts = (Object.keys(scoreLabels) as (keyof typeof scoreLabels)[]).map((key) => {
    const val = (p.scores as unknown as Record<string, number>)[key];
    const w = (weights as unknown as Record<string, number>)[key];
    const label = scoreLabels[key];
    return el("li", { class: "score-item" }, [
      el("div", { class: "score-head" }, [
        el("span", {}, label.name + (w >= 4 ? " ★ (you're weighting this high)" : "")),
        el("span", {}, `${val}${key === "host" ? ` · ${p.hostLepCount} species` : ""}`),
      ]),
      el("div", { class: "score-bar" }, [el("span", { style: `width:${val}%` })]),
      el("p", { class: "score-why" }, label.plain),
    ]);
  });

  const scores = el("details", {}, [
    el("summary", { style: "cursor:pointer;font-weight:700;min-height:3rem;display:flex;align-items:center;" }, [
      `Why it ranks here — eco value ${r.ecoScore}/100 (tap to open)`,
    ]),
    el("ul", { class: "score-list" }, scoreParts),
  ]);

  const bloom = p.bloom
    ? `Blooms ${monthNames[p.bloom.startMonth]}–${monthNames[p.bloom.endMonth]} (${p.bloom.color}).`
    : "Grown for foliage, not flowers.";

  const body = el("div", { class: "plant-body" }, [
    el("p", { class: "kv" }, [el("span", { class: "k" }, "What it does for you & wildlife: "), p.givesNote]),
    el("p", { class: "kv" }, [el("span", { class: "k" }, "What it needs from you: "), p.careNote]),
    el("p", { class: "kv" }, [el("span", { class: "k" }, "Bloom & moisture: "), `${bloom} Prefers soil that's ${p.moisture.map(moistureShort).join(" or ")}.`]),
    scores,
    el("p", { class: "confidence" }, [
      el("strong", {}, `Confidence: ${p.confidence}. `),
      confidencePlain(p.confidence),
      " ",
      el("span", { style: "opacity:0.8" }, `Source: ${p.basis}`),
    ]),
  ]);

  return el("article", { class: "plant" }, [head, match, canvas, sizeCaption, body]);
}

function moistureShort(b: string): string {
  return b === "dry" ? "dry" : b === "wet" ? "wet" : "evenly moist";
}

function fmtSize(ft: number): string {
  if (ft < 1) return `${Math.round(ft * 12)} inches`;
  return `${ft % 1 === 0 ? ft : ft.toFixed(1)} ft`;
}

function sizeAria(p: { size: { year: number; heightFt: number; spreadFt: number }[]; common: string }): string {
  const parts = p.size.map((s) => `year ${s.year}: ${fmtSize(s.heightFt)} tall`);
  return `Size of ${p.common} over time — ${parts.join(", ")}.`;
}

// A simple drawn silhouette so a card is meaningful offline with no photo.
// (Real photos are a Phase-2 addition — see the honesty notes.)
function silhouetteFor(form: string): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
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
