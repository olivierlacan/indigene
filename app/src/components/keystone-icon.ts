// The keystone ("essential plant") mark: a five-point star. It used to be a
// stone arch with its keystone lit — the metaphor drawn literally — but at
// text size the arch read as a squiggle, and a mark that has to be decoded
// conveys nothing. A star says "this one stands out" at a glance; the word
// "Essential" and its explanation stay in the tooltip and the trait badge.
//
// Drawn, not the ⭐ emoji: that gold star already means "Vital" on wildlife
// ties (`lib/plain.ts`), so this one is monochrome in `currentColor` — brand
// green beside a name, white on a badge.

const NS = "http://www.w3.org/2000/svg";

export function keystoneIcon(size = 15): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "keystone-icon");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M12 1.8l3.1 6.4 7 1-5.1 4.9 1.2 7L12 17.8l-6.2 3.3 1.2-7L1.9 9.2l7-1z");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}
