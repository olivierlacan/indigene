// Line icons for the plant list's two controls — the goal it's ranked for, and
// its filters. They replace the ⚖️ and 🔍 emoji, which every phone draws at its
// own size and baseline, so the two rows never lined up. Drawn in
// `currentColor` on a 20×20 grid; decorative, since the words carry the meaning.
const NS = "http://www.w3.org/2000/svg";

function icon(draw: (add: (tag: string, a: Record<string, string>) => void) => void): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  for (const [k, v] of Object.entries({
    viewBox: "0 0 20 20", "aria-hidden": "true", class: "control-icon",
    fill: "none", stroke: "currentColor", "stroke-width": "1.7",
    "stroke-linecap": "round", "stroke-linejoin": "round",
  })) svg.setAttribute(k, v);
  draw((tag, a) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(a)) n.setAttribute(k, v);
    svg.append(n);
  });
  return svg;
}

/** A target: what the list is aiming for. */
export const goalIcon = (): SVGSVGElement =>
  icon((add) => {
    add("circle", { cx: "10", cy: "10", r: "7.6" });
    add("circle", { cx: "10", cy: "10", r: "4.2" });
    add("circle", { cx: "10", cy: "10", r: "1.1", fill: "currentColor", stroke: "none" });
  });

/** A funnel: what's let through. */
export const filterIcon = (): SVGSVGElement =>
  icon((add) => {
    add("path", { d: "M3 4.2h14l-5.4 6.4v4.9l-3.2 1.7v-6.6z" });
  });

/** The row's affordance: › goes somewhere, ⌄ opens in place (and flips). */
export const chevronIcon = (dir: "right" | "down"): SVGSVGElement => {
  const svg = icon((add) => {
    add("path", { d: dir === "right" ? "M7.5 4.5 13 10l-5.5 5.5" : "M4.5 7.5 10 13l5.5-5.5" });
  });
  svg.setAttribute("class", "control-chevron");
  return svg;
};

/** A small clock: "when". */
export const clockIcon = (): SVGSVGElement => {
  const svg = icon((add) => {
    add("circle", { cx: "10", cy: "10", r: "7.6" });
    add("path", { d: "M10 5.8V10l2.8 1.8" });
  });
  svg.setAttribute("class", "clock-icon");
  return svg;
};
