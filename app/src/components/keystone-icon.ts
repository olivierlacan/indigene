// The keystone marker: a stone arch with its keystone lit up — the ecology
// metaphor drawn literally. Ecologists call a plant "keystone" because, like
// the wedge at the crown of an arch, removing it collapses a structure far
// bigger than itself. Inline SVG at text size, colored via currentColor so it
// reads on badges (white on green) and in running text alike.

const NS = "http://www.w3.org/2000/svg";

export function keystoneIcon(size = 15): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "keystone-icon");
  const add = (d: string, opacity?: string): void => {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "currentColor");
    if (opacity) path.setAttribute("opacity", opacity);
    svg.append(path);
  };
  // The arch's flanks, subdued…
  add("M3 21v-6a9.5 9.5 0 0 1 4.6-8.1l1.7 2.8A6.3 6.3 0 0 0 6.2 15v6Z", "0.5");
  add("M21 21v-6a9.5 9.5 0 0 0-4.6-8.1l-1.7 2.8a6.3 6.3 0 0 1 3.1 5.3v6Z", "0.5");
  // …and the keystone itself at full strength: wider at the top, holding it all.
  add("M8.5 2.8h7l-1.6 6.8h-3.8Z");
  return svg;
}
