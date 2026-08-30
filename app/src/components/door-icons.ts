// Two glyphs for the "ways in" callouts on the plants index (see steps/plants
// .ts): one for identifying a plant you're unsure about, one for making more of
// one you have. Same flat 48×48 idiom as the plant silhouettes and the sun
// glyphs, drawn in `currentColor` so the tinted slot they sit in colours them
// (brand green on `--brand-bg`). Decorative — the callout carries the words.

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
