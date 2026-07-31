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
import { FORM_GLYPHS, stemWidth } from "./plant-glyphs";

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

/** The browser's copy of the drawing. The geometry, and the rules that keep the
 *  seven forms looking like one set, live in `plant-glyphs.ts`. */
export function silhouetteFor(form: string, size = 40): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  const green = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#175e33";
  for (const mark of FORM_GLYPHS[form] ?? FORM_GLYPHS.perennial) {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", mark.d);
    if (mark.stem) {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", green);
      path.setAttribute("stroke-width", String(Math.round(stemWidth(size) * 100) / 100));
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
    } else {
      path.setAttribute("fill", green);
    }
    svg.append(path);
  }
  return svg;
}
