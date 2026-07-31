// Renders one ranked plant, as a card in the list of picks for a spot.
//
// It used to be the whole plant: the stat grid, the to-scale drawing, all seven
// score bars, the care notes, the confidence and its citation — twenty-five
// times over, so reaching the tenth plant meant scrolling past nine essays. And
// the card was a dead end: everything it could ever say, it said right there,
// because there was nowhere to go.
//
// Now there is. Every card is a door to the plant's own page — the whole card,
// via a link stretched over it — so this one only has to carry what you need in
// order to decide whether to open it:
//
//   - who it is (name, badges),
//   - whether it suits this spot, and why, in plain words,
//   - what it looks like grown up, in one line,
//   - what it gives, in one line,
//   - and its wildlife value, with the two components *your* goals weighted
//     most heavily — the tie between the ranking and the choice you made.
//
// Everything cut from here is on the plant page, one tap away, in full.
import type { Ranked } from "../lib/ranking";
import type { Plant, Weights } from "../types";
import { el } from "../ui";
import { SCORE_KEYS, scoreLabel, bloomSentence } from "../lib/plain";
import { keystoneIcon } from "./keystone-icon";
import { t, fmtNumber, fmtList } from "../lib/i18n";
import { length } from "../lib/units";
import { nameLines } from "../lib/names";
import { highlight } from "./filter-field";
import { prose } from "../lib/prose";

/** A component has to be worth something on its own before we call the plant
 *  "strongest for" it — a weighted 12 out of 100 is not a selling point. */
const STRENGTH_FLOOR = 45;

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
  // The name is the link, and CSS stretches it over the whole card (see
  // `.plant-pick`), so the card is one big target with one accessible name
  // rather than a grid of things to aim at. Nothing else in the card is
  // interactive, which is what makes that safe.
  //
  // It ends in the same green chevron a section heading wears (see
  // `components/section-link.ts`) — the app's one mark for "this leads
  // somewhere", drawn at rest because a phone has no hover. Its own element
  // rather than a `::after`, because the link's `::after` is the overlay that
  // stretches it across the card.
  const head = el("div", { class: "plant-head" }, [
    el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(p.form)]),
    el("div", {}, [
      el("h3", { class: "plant-name" }, [
        el("a", { class: "plant-pick-link", href: `#/plants/${p.id}` }, [
          ...highlight(names.title, nq),
          el("span", { class: "pick-chevron", "aria-hidden": "true" }),
        ]),
      ]),
      el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" },
        highlight(names.sub, nq)),
      badges,
    ]),
  ]);

  // Site-match summary — the reason this plant is at this height in the list.
  const matchWord = t(`match.${r.match}` as const);
  const match = el("div", { class: `note ${r.match === "good" ? "info" : r.match === "ok" ? "warn" : "danger"}` }, [
    el("strong", {}, matchWord),
    el("ul", { style: "margin:0.4rem 0 0; padding-left:1.1rem;" }, r.reasons.map((why) => el("li", {}, why))),
  ]);

  // Grown-up size and bloom in one line, in place of the stat grid, the
  // to-scale drawing and the bloom paragraph. All three are on the plant page.
  const meta = el("p", { class: "pick-meta" }, [
    t("card.sizeShort", { height: length(p.matureHeightFt), spread: length(p.matureSpreadFt) }),
    " ",
    bloomSentence(p.bloom),
  ]);

  // Wildlife value, and what earned it *under this reader's goals*. Weighting
  // butterflies heavily and then being shown a bar chart of all seven scores
  // never said which of them put this plant here; naming the top two does.
  const strengths = strongestFor(p, weights);
  const value = el("p", { class: "pick-value" }, [
    el("strong", {}, t("card.ecoValue", { score: fmtNumber(r.ecoScore) })),
    ...(strengths.length ? [" ", t("card.strongFor", { list: fmtList(strengths) })] : []),
  ]);

  return el("article", { class: "plant plant-pick" }, [
    head,
    match,
    meta,
    el("p", { class: "pick-gives" }, prose(p, "givesNote")),
    value,
  ]);
}

/**
 * The two components that contributed most to this plant's rank — score times
 * weight, so a thing the reader turned off can never be named, and a thing they
 * turned up gets named the moment the plant is actually good at it.
 */
function strongestFor(p: Plant, weights: Weights): string[] {
  return SCORE_KEYS.map((key) => ({
    key,
    value: p.scores[key],
    weight: weights[key],
  }))
    .filter((c) => c.weight > 0 && c.value >= STRENGTH_FLOOR)
    .sort((a, b) => b.value * b.weight - a.value * a.weight)
    .slice(0, 2)
    .map((c) => `${scoreLabel(c.key).icon} ${scoreLabel(c.key).name}`);
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
