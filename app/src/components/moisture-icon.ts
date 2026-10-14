// Small hand-drawn SVG glyphs for the three moisture bands, in the same flat
// 48×48 idiom as the sun glyphs (sun-icon.ts): a drop filled to how wet the
// ground stays, a sliver for dry, half for evenly moist, full over a puddle
// for wet. Decorative only — the buttons carry the words.
import type { MoistureBand } from "../types";

const NS = "http://www.w3.org/2000/svg";
const BLUE = "#4a90c8"; // reads as water on both the light and dark themes

// The drop: point at the top, round at the bottom (y 5 → 38).
const DROP = "M24 5c0 0-11 13-11 22a11 11 0 0 0 22 0c0-9-11-22-11-22z";

export function moistureIcon(band: MoistureBand): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
  svg.setAttribute("aria-hidden", "true");

  const add = (tag: string, attrs: Record<string, string>, parent: Element = svg): Element => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.append(n);
    return n;
  };

  // The fill level is the answer: a sliver of water for dry, half for evenly
  // moist, full (and a puddle under it) for wet. Read at text size, a level
  // carries better than a cracked-ground line, which looked like a stand.
  const level = band === "dry" ? 29 : band === "mesic" ? 21 : 0;
  if (band === "wet") {
    add("path", { d: DROP, fill: BLUE });
    add("ellipse", { cx: "24", cy: "44", rx: "15", ry: "2.5", fill: BLUE, opacity: "0.55" });
  } else {
    const id = `moisture-clip-${band}`;
    const clip = add("clipPath", { id }, add("defs", {}));
    add("path", { d: DROP }, clip);
    add("rect", { x: "10", y: String(level), width: "28", height: String(40 - level), fill: BLUE, "clip-path": `url(#${id})` });
  }
  add("path", { d: DROP, fill: "none", stroke: BLUE, "stroke-width": "3.5", "stroke-linejoin": "round" });
  return svg;
}
