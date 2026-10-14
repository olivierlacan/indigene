// Small hand-drawn SVG glyphs for the three moisture bands, in the same flat
// 48×48 idiom as the sun glyphs (sun-icon.ts): an empty drop over cracked
// ground for dry, a half-full drop for evenly moist, a full drop over a puddle
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

  const soft = getComputedStyle(document.documentElement).getPropertyValue("--ink-soft").trim() || "#3d3d34";
  const add = (tag: string, attrs: Record<string, string>, parent: Element = svg): Element => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.append(n);
    return n;
  };

  if (band === "mesic") {
    // The lower half of the drop filled, clipped to the drop's own outline.
    const id = "moisture-half-clip";
    const clip = add("clipPath", { id }, add("defs", {}));
    add("path", { d: DROP }, clip);
    add("rect", { x: "10", y: "26", width: "28", height: "14", fill: BLUE, "clip-path": `url(#${id})` });
  } else if (band === "wet") {
    add("path", { d: DROP, fill: BLUE });
    add("ellipse", { cx: "24", cy: "43.5", rx: "15", ry: "2.5", fill: BLUE, opacity: "0.55" });
  } else {
    // Dry: the ground below cracks.
    add("path", {
      d: "M8 43.5h11l2.5-3 2.5 3h16", fill: "none", stroke: soft,
      "stroke-width": "2.5", "stroke-linecap": "round", "stroke-linejoin": "round",
    });
  }
  add("path", { d: DROP, fill: "none", stroke: BLUE, "stroke-width": "3", "stroke-linejoin": "round" });
  return svg;
}
