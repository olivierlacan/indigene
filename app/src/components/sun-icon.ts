// Small hand-drawn SVG glyphs for the three sun-exposure levels, in the same
// flat 48×48 idiom as the plant silhouettes: full sun is a whole sun, half-day
// sun is a sun on the horizon, and shade is a sun mostly hidden behind a
// canopy. Decorative only — the buttons carry the words.

const NS = "http://www.w3.org/2000/svg";
const GOLD = "#e2a516"; // reads as sunlight on both the light and dark themes

export type SunLevel = "full" | "half" | "shade";

export function sunIcon(level: SunLevel): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", "40");
  svg.setAttribute("height", "40");
  svg.setAttribute("aria-hidden", "true");

  const css = getComputedStyle(document.documentElement);
  const green = css.getPropertyValue("--brand").trim() || "#175e33";
  const soft = css.getPropertyValue("--ink-soft").trim() || "#3d3d34";

  const add = (tag: string, attrs: Record<string, string>): void => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    svg.append(n);
  };
  // Short rays around (cx, cy) at the given compass-style angles (degrees,
  // SVG orientation: 0 = right, 90 = down).
  const rays = (cx: number, cy: number, from: number, to: number, angles: number[]): void => {
    for (const a of angles) {
      const r = (a * Math.PI) / 180;
      add("line", {
        x1: (cx + from * Math.cos(r)).toFixed(1),
        y1: (cy + from * Math.sin(r)).toFixed(1),
        x2: (cx + to * Math.cos(r)).toFixed(1),
        y2: (cy + to * Math.sin(r)).toFixed(1),
        stroke: GOLD,
        "stroke-width": "3",
        "stroke-linecap": "round",
      });
    }
  };

  if (level === "full") {
    add("circle", { cx: "24", cy: "24", r: "9", fill: GOLD });
    rays(24, 24, 13, 18, [0, 45, 90, 135, 180, 225, 270, 315]);
  } else if (level === "half") {
    // A sun sitting on the horizon: half the day in light.
    add("path", { d: "M14 30a10 10 0 0 1 20 0z", fill: GOLD });
    rays(24, 30, 14, 19, [225, 270, 315]);
    add("line", {
      x1: "7", y1: "30", x2: "41", y2: "30",
      stroke: soft, "stroke-width": "3", "stroke-linecap": "round",
    });
  } else {
    // A sun mostly hidden behind a tree canopy (drawn over it).
    add("circle", { cx: "33", cy: "14", r: "7", fill: GOLD });
    rays(33, 14, 10, 14, [270, 315, 0, 45]);
    add("path", {
      // The plant-silhouette tree, nudged down-left so the canopy eclipses the sun.
      d: "M20 12c6 0 10 5 10 10 0 5-4 9-9 9v11h-2V31c-5 0-9-4-9-9 0-5 4-10 10-10z",
      fill: green,
    });
  }
  return svg;
}
