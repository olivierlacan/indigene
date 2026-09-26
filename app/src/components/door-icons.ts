// Five glyphs for the "ways in" callouts on the plants index (see steps/plants
// .ts): one for identifying a plant you're unsure about, one for the native to
// grow in a common ornamental's place, one for whether that planting costs you
// the harvest, one for making more of a plant you have, and one for the
// invasives worth pulling first.
// Same flat 48×48 idiom as the plant silhouettes and the sun glyphs, drawn in
// `currentColor` so the tinted slot they sit in colours them (brand green on
// `--brand-bg`). Decorative — the callout carries the words.

const NS = "http://www.w3.org/2000/svg";

function svg(size: number): SVGSVGElement {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 48 48");
  s.setAttribute("width", String(size));
  s.setAttribute("height", String(size));
  s.setAttribute("aria-hidden", "true");
  return s;
}

/** Two leaves of the same shape, side by side — one filled, one a hollow copy:
 *  the "is this the native, or the look-alike sold in its place?" way in. The
 *  matching outline is the point — a search glyph said "look up", not "these two
 *  resemble each other". */
export function lookalikeIcon(size = 30): SVGSVGElement {
  const s = svg(size);
  // One leaf grown from its base at the origin up to a tip 30 units above, so
  // both copies can share it under a translate/rotate. Sized to fill the slot
  // the way the sprout does, and mirrored into a matched pair.
  const LEAF = "M0 0C-8-7-8-22 0-30 8-22 8-7 0 0Z";
  const back = document.createElementNS(NS, "path"); // the look-alike, hollow
  back.setAttribute("d", LEAF);
  back.setAttribute("transform", "translate(19 41) rotate(-17)");
  back.setAttribute("fill", "none");
  back.setAttribute("stroke", "currentColor");
  back.setAttribute("stroke-width", "3");
  back.setAttribute("stroke-linejoin", "round");
  const front = document.createElementNS(NS, "path"); // the native, solid
  front.setAttribute("d", LEAF);
  front.setAttribute("transform", "translate(29 41) rotate(17)");
  front.setAttribute("fill", "currentColor");
  s.append(back, front);
  return s;
}

/** A native leaf swapped in for what's there: the "grow this instead of a
 *  common ornamental" way in. Two curved arrows circle a solid leaf — the
 *  "replace with" gesture around the plant you'd put in its place. The circling
 *  arrows are the point: the look-alike glyph's matched leaves say "these two
 *  resemble each other", where this says "put this one in the other's place". */
export function alternativeIcon(size = 30): SVGSVGElement {
  const s = svg(size);
  // Two short arcs on opposite sides of the centre, each ending in an arrowhead,
  // so together they read as the circular "swap / replace" glyph. Centre (24,24),
  // radius 17; the leaf sits inside them.
  const arc = (d: string): SVGPathElement => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "3");
    p.setAttribute("stroke-linecap", "round");
    return p;
  };
  // Top arc sweeping left-to-right over the crown, and a bottom arc sweeping
  // right-to-left under the base — a broken ring turning clockwise.
  const top = arc("M9 20 A17 17 0 0 1 36 12");
  const bottom = arc("M39 28 A17 17 0 0 1 12 36");
  const head = (d: string): SVGPathElement => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "currentColor");
    return p;
  };
  const topHead = head("M36 12 L28 11 L33 18 Z"); // arrowhead at the top arc's end
  const bottomHead = head("M12 36 L20 37 L15 30 Z"); // arrowhead at the bottom arc's end
  const leaf = document.createElementNS(NS, "path");
  leaf.setAttribute("d", "M0 0C-6-5-6-16 0-22 6-16 6-5 0 0Z");
  leaf.setAttribute("transform", "translate(24 35)");
  leaf.setAttribute("fill", "currentColor");
  s.append(top, bottom, topHead, bottomHead, leaf);
  return s;
}

/** A sprout lifted clear of the ground, roots and all, under an upward arrow:
 *  the "which ones do I pull?" way in to each region's worst invasives. The
 *  roots are the point — a bare leaf said "plant", roots out of the soil say
 *  "pulled". */
export function invasiveIcon(size = 30): SVGSVGElement {
  const s = svg(size);
  const stroke = (d: string): SVGPathElement => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "3");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    return p;
  };
  const leaf = document.createElementNS(NS, "path");
  leaf.setAttribute("d", "M0 0C-8-7-8-22 0-30 8-22 8-7 0 0Z");
  leaf.setAttribute("transform", "translate(18 32)");
  leaf.setAttribute("fill", "currentColor");
  // Roots fanning down from the base, and the soil line left behind below.
  const roots = stroke("M18 32v6M18 34l-5 5M18 34l5 5");
  const soil = stroke("M5 44h26");
  // The arrow beside it, pointing up and away from the soil.
  const arrow = stroke("M39 40V6M32 13l7-7 7 7");
  s.append(leaf, roots, soil, arrow);
  return s;
}

/** One plant, and a smaller new one off the same root: the "already have one,
 *  want another?" way in. A single sprout said "growth"; a parent with an
 *  offshoot says "make more" — which is what the card is for. */
export function propagateIcon(size = 30): SVGSVGElement {
  const s = svg(size);
  // A sprout drawn in its own coordinates — base at the origin, growing straight
  // up — so it can be placed and scaled twice: the parent full size, the new
  // plantlet smaller. Stem stroked, two teardrop leaves at the crown, in the
  // same idiom as the drawn perennial.
  const sprout = (transform: string): SVGGElement => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", transform);
    const stem = document.createElementNS(NS, "path");
    stem.setAttribute("d", "M0 0V-19");
    stem.setAttribute("fill", "none");
    stem.setAttribute("stroke", "currentColor");
    stem.setAttribute("stroke-width", "3.6");
    stem.setAttribute("stroke-linecap", "round");
    const leaves = document.createElementNS(NS, "path");
    leaves.setAttribute(
      "d",
      "M0 -15C0 -21-6 -25-12 -24-12 -18-6 -13 0 -15ZM0 -17C0 -23 6 -27 12 -26 12 -20 6 -15 0 -17Z",
    );
    leaves.setAttribute("fill", "currentColor");
    g.append(stem, leaves);
    return g;
  };
  // The runner joining them at the ground — the offshoot is *from* the parent.
  const runner = document.createElementNS(NS, "path");
  runner.setAttribute("d", "M16 41Q25 45 33 41");
  runner.setAttribute("fill", "none");
  runner.setAttribute("stroke", "currentColor");
  runner.setAttribute("stroke-width", "3.6");
  runner.setAttribute("stroke-linecap", "round");
  s.append(runner, sprout("translate(16 41)"), sprout("translate(33 41) scale(0.6)"));
  return s;
}

/** A carrot: the "will planting this cost me the vegetables?" way in.
 *
 *  The other three glyphs draw a *relationship* — two leaves that resemble each
 *  other, a leaf being swapped in, a parent with an offshoot — and the first go
 *  at this one tried the same, a native flowering beside a vegetable on shared
 *  ground. At the 30px these are actually drawn at, the pair turned to mush:
 *  the bloom read as a pin and the root as a tuft of grass. One bold shape
 *  survives the size, and the carrot is the only thing in the set that isn't a
 *  leaf, so it is also the one you can tell apart at a glance. It matches the
 *  🥕 the plant pages use for the same door.
 */
export function cropsIcon(size = 30): SVGSVGElement {
  const s = svg(size);
  // The root: a softly domed shoulder tapering to a tip, filled. Drawn wide —
  // a narrow triangle is a spike, and the shoulder is what makes it a carrot.
  const root = document.createElementNS(NS, "path");
  root.setAttribute("d", "M13 18Q24 12 35 18L24 42Z");
  root.setAttribute("fill", "currentColor");
  // Three fronds off the shoulder, stroked in the same weight as the sprouts.
  const frond = (d: string): SVGPathElement => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "3.4");
    p.setAttribute("stroke-linecap", "round");
    return p;
  };
  s.append(root, frond("M24 15V6"), frond("M19 16L13 8"), frond("M29 16L35 8"));
  return s;
}
