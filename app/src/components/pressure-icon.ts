// Drawn glyphs for the seven pressures a pavement pioneer copes with. Emoji
// didn't hold up at footer size — a salt shaker and a tractor read as clip art,
// and "Bare ground" as farming — so each is a plain line drawing of the
// condition itself, in `currentColor` like the support glyphs
// (`support-icon.ts`): the same ink as the words around it, in both themes.
import type { PioneerPressure } from "../types";

const NS = "http://www.w3.org/2000/svg";

/** Every path is a stroke unless it says otherwise: one weight across the set. */
function add(parent: SVGElement, tag: string, attrs: Record<string, string>): void {
  const n = document.createElementNS(NS, tag);
  n.setAttribute("fill", "none");
  n.setAttribute("stroke", "currentColor");
  n.setAttribute("stroke-width", "1.8");
  n.setAttribute("stroke-linecap", "round");
  n.setAttribute("stroke-linejoin", "round");
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent.append(n);
}

const solid = { fill: "currentColor", stroke: "none" };

export function pressureIcon(p: PioneerPressure, size = 20): SVGSVGElement {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("width", String(size));
  s.setAttribute("height", String(size));
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("class", "pressure-icon");
  switch (p) {
    case "compaction":
      // A weight pressing down on ground packed into tight layers.
      add(s, "path", { d: "M12 3v7M8.5 7 12 10.5 15.5 7" });
      add(s, "path", { d: "M3 14h18M5 17.5h14M7 21h10" });
      break;
    case "poor-soil":
      // Rubble: three angular stones in a heap.
      add(s, "path", { d: "M3 20l2.5-5 4 -.5 2 5.5z" });
      add(s, "path", { d: "M10.5 20l3-7.5 4.5 1.5 2.5 6z" });
      add(s, "path", { d: "M7 14.5l1.5-4.5 4 .5" });
      add(s, "path", { d: "M2 20h20" });
      break;
    case "crevice":
      // A paving slab split by a crack, with a shoot coming up through it.
      add(s, "path", { d: "M2 15h20M2 21h20" });
      add(s, "path", { d: "M12 21l-1.2-2.2 1.6-1.5-.9-2.3" });
      add(s, "path", { d: "M11.5 15V9" });
      add(s, "path", { d: "M11.5 11c-2.6 0-4-1.5-4-3.6 2.4 0 4 1.3 4 3.6zM11.5 9.5c0-2.4 1.5-3.8 3.8-3.8 0 2.3-1.4 3.8-3.8 3.8z" });
      break;
    case "salt":
      // Salt crystals — little cubes — scattered over the ground.
      add(s, "rect", { x: "4", y: "13", width: "4.5", height: "4.5", rx: "0.6", transform: "rotate(-12 6.25 15.25)" });
      add(s, "rect", { x: "10.5", y: "8.5", width: "4", height: "4", rx: "0.6", transform: "rotate(14 12.5 10.5)" });
      add(s, "rect", { x: "15", y: "14", width: "4.5", height: "4.5", rx: "0.6", transform: "rotate(8 17.25 16.25)" });
      add(s, "circle", { cx: "7", cy: "6", r: "1", ...solid });
      add(s, "circle", { cx: "18", cy: "8", r: "1", ...solid });
      add(s, "path", { d: "M2 21h20" });
      break;
    case "reflected-heat":
      // Sun overhead, heat rising off the pavement in waves.
      add(s, "circle", { cx: "12", cy: "6", r: "2.6" });
      add(s, "path", { d: "M12 1.2v.9M7.2 6h-.9M17.7 6h-.9M8.6 2.6l.6.6M15.4 2.6l-.6.6" });
      add(s, "path", { d: "M7 18c1-1.2 0-2.3 1-3.5M12 18c1-1.2 0-2.3 1-3.5M17 18c1-1.2 0-2.3 1-3.5" });
      add(s, "path", { d: "M2 21h20" });
      break;
    case "drought":
      // A water drop, struck through: nobody comes with the hose.
      add(s, "path", { d: "M12 3.5c3 3.8 5 6.7 5 9.3a5 5 0 0 1-10 0c0-2.6 2-5.5 5-9.3z" });
      add(s, "path", { d: "M4 4l16 16" });
      break;
    case "disturbance":
      // Ground scraped bare: a spade in turned earth, clods thrown up.
      add(s, "path", { d: "M15 3l3 3M16.5 4.5l-6 6" });
      add(s, "path", { d: "M10.5 10.5l-3.2.6-1.6 3.6 2.5 2.5 3.6-1.6.6-3.2z" });
      add(s, "path", { d: "M2 21h20" });
      add(s, "circle", { cx: "15", cy: "17.5", r: "1.1", ...solid });
      add(s, "circle", { cx: "18.5", cy: "15.5", r: "0.9", ...solid });
      add(s, "circle", { cx: "4", cy: "18.5", r: "0.9", ...solid });
      break;
  }
  return s;
}
