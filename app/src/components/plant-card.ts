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
import { traitBadges } from "./trait-badges";
import { plantThumb } from "./plant-thumb";
import { t, fmtNumber, monthName } from "../lib/i18n";
import { length } from "../lib/units";
import { nameLines } from "../lib/names";
import { highlight } from "./filter-field";
import { prose, lead } from "../lib/prose";
import { FORM_GLYPHS, stemWidth } from "./plant-glyphs";
import { richText } from "./rich-text";

/** A component has to be worth something on its own before we call the plant
 *  "strongest for" it — a weighted 12 out of 100 is not a selling point. */
const STRENGTH_FLOOR = 45;

/**
 * @param nq A normalized filter query to underline in the card's two name
 *   lines, the way a search result and a region roster row do ("" underlines
 *   nothing). The ranked list rebuilds its cards on every keystroke, so the
 *   query is a build-time argument rather than a handle to call back into.
 * @param regionId The region whose roster this card came out of. A plant native
 *   to two regions has a different row — and a different translation — in each,
 *   so the card has to say which one it is showing (see `lib/prose.ts`).
 */
export function plantCard(r: Ranked, weights: Weights, nq = "", regionId?: string): HTMLElement {
  const p = r.plant;

  const badges = traitBadges(p, false, regionId);

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
    // The plant, where the ranked list previously drew a generic one of its
    // kind. This is the list a reader makes a decision from — nine shrubs
    // wearing the same shrub is the one place the drawing was least use.
    plantThumb(p.id, p.form, { regionId }),
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

  // The figures a scan needs, as icon chips: full size, flowering months, and
  // wildlife value. Everything else is on the plant's own page.
  const chip = (icon: string, text: string, title?: string): HTMLElement =>
    el("li", { title }, [el("span", { "aria-hidden": "true" }, icon), text]);
  const facts = el("ul", { class: "pick-facts" }, [
    chip("📏", t("card.factSize", { height: length(p.matureHeightFt), spread: length(p.matureSpreadFt) })),
    p.bloom
      ? chip("🌸", t("card.factBloom", { from: monthName(p.bloom.startMonth, "short"), to: monthName(p.bloom.endMonth, "short") }),
          bloomSentence(p.bloom))
      : chip("🍃", t("card.factFoliage")),
    chip("🦋", t("card.factWildlife", { score: fmtNumber(r.ecoScore) })),
  ]);

  // What earned that score *under this reader's goals*: the top two.
  const strengths = strongestFor(p, weights);
  // A footer band, set apart from the prose: a small label, then the two
  // reasons as chips you can take in at a glance.
  const value = strengths.length
    ? el("div", { class: "pick-value" }, [
        el("span", { class: "pick-value-k" }, t("card.strongFor")),
        ...strengths.map((s) => el("span", { class: "pick-value-chip" }, s)),
      ])
    : null;

  return el("article", { class: "plant plant-pick" }, [
    head,
    match,
    facts,
    // The opening of the plant's note, not a second copy of it (`lead()`).
    el("p", { class: "pick-gives" }, richText(lead(prose(p, "givesNote", regionId)))),
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
  svg.setAttribute("aria-hidden", "true"); // a stand-in drawing; the name beside it says what it is
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
