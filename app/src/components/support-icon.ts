// Monochrome SVG glyphs for the tie chips — the support kinds (Host, Nectar,
// Berries, Seeds, Shelter) and the two notable dependence strengths (Essential,
// Specialist). Single-color, drawn with `currentColor`, so they read as a clean
// white glyph on the chip's colored pill (and inherit the ink color in the
// dialog title) — the site's keystone-badge idiom, not multicolor emoji.
import type { SupportKind, SupportReliance } from "../types";

const NS = "http://www.w3.org/2000/svg";

function svg(size: number): SVGSVGElement {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("width", String(size));
  s.setAttribute("height", String(size));
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("class", "tie-glyph");
  return s;
}

function add(parent: SVGElement, tag: string, attrs: Record<string, string>): void {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  // Default to a filled currentColor shape unless the caller strokes it instead.
  if (!("fill" in attrs) && !("stroke" in attrs)) n.setAttribute("fill", "currentColor");
  parent.append(n);
}

/** The glyph for a support kind, filled in currentColor. */
export function supportIcon(kind: SupportKind, size = 14): SVGSVGElement {
  const s = svg(size);
  switch (kind) {
    case "host": {
      // A caterpillar: a chain of body segments with a head and two antennae.
      add(s, "circle", { cx: "6", cy: "15", r: "3.1" });
      add(s, "circle", { cx: "10.3", cy: "15", r: "3.3" });
      add(s, "circle", { cx: "14.6", cy: "14.6", r: "3.5" });
      add(s, "circle", { cx: "18.6", cy: "13.6", r: "3.7" }); // head
      add(s, "path", { d: "M17.5 10.4l-1.4-2.6M20 10.2l1.2-2.7", stroke: "currentColor", "stroke-width": "1.4", "stroke-linecap": "round", fill: "none" });
      break;
    }
    case "nectar": {
      // A simple flower: six petals around a center.
      const cx = 12, cy = 12, R = 5.2;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        add(s, "circle", { cx: (cx + R * Math.cos(a)).toFixed(1), cy: (cy + R * Math.sin(a)).toFixed(1), r: "3" });
      }
      add(s, "circle", { cx: "12", cy: "12", r: "2.9", fill: "currentColor", opacity: "0.55" });
      break;
    }
    case "berries": {
      // A little cluster: two berries below, one above, on a short stem.
      add(s, "path", { d: "M12 8.5V5.5M12 6c2.2 0 3.4-1.2 3.6-2.6", stroke: "currentColor", "stroke-width": "1.4", "stroke-linecap": "round", fill: "none" });
      add(s, "circle", { cx: "12", cy: "10.5", r: "3.2" });
      add(s, "circle", { cx: "8.7", cy: "16", r: "3.3" });
      add(s, "circle", { cx: "15.3", cy: "16", r: "3.3" });
      break;
    }
    case "seeds": {
      // An acorn: a rounded cap over the nut, with a tiny stem.
      add(s, "rect", { x: "11.2", y: "3", width: "1.6", height: "3", rx: "0.8" });
      add(s, "path", { d: "M5.5 10c0-3.4 2.9-5.5 6.5-5.5S18.5 6.6 18.5 10z" }); // cap
      add(s, "path", { d: "M6.5 10.4h11V13c0 3.6-2.3 6.6-5.5 6.6S6.5 16.6 6.5 13z" }); // nut
      break;
    }
    case "shelter": {
      // A house/roof silhouette — cover to shelter in.
      add(s, "path", { d: "M12 3.4l8.4 6.5a1 1 0 0 1 .4.8V20a1 1 0 0 1-1 1h-4.4v-5.6H8.6V21H4.2a1 1 0 0 1-1-1v-9.3a1 1 0 0 1 .4-.8z" });
      break;
    }
  }
  return s;
}

/** The glyph for a notable dependence strength; null for the generalist default. */
export function relianceIcon(reliance: SupportReliance, size = 14): SVGSVGElement | null {
  if (reliance === "broad") return null;
  const s = svg(size);
  if (reliance === "sole") {
    // A five-point star — the make-or-break tie.
    add(s, "path", { d: "M12 2.2l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16l-5.5 2.9 1.2-6.1L3.2 8.6l6.1-.8z" });
  } else {
    // A target/bullseye — a specialist, narrowed in on a few plants.
    add(s, "circle", { cx: "12", cy: "12", r: "8.3", fill: "none", stroke: "currentColor", "stroke-width": "2" });
    add(s, "circle", { cx: "12", cy: "12", r: "4.4", fill: "none", stroke: "currentColor", "stroke-width": "2" });
    add(s, "circle", { cx: "12", cy: "12", r: "1.7" });
  }
  return s;
}
