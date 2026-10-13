// The drawing at the head of "Peoples and plants": a woven basket with camas
// and wild leek in it, harakeke rising behind and a fawn lily beside — plants
// the page lists, and the food, cord and cloth they were. Flat shapes in the
// app's own tokens (`.people-art` in styles.css), so it follows the theme.
// Decorative: the title and lede beside it carry the meaning.

const NS = "http://www.w3.org/2000/svg";

function node(tag: string, attrs: Record<string, string | number>): SVGElement {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  return n;
}

/** A blade from a base point to a tip, `w` wide at the base, bowed by `bend`. */
function blade(x0: number, y0: number, x1: number, y1: number, w: number, bend: number): string {
  const mx = (x0 + x1) / 2 + bend;
  const my = (y0 + y1) / 2;
  return `M${x0} ${y0}Q${mx - w} ${my} ${x1} ${y1}Q${mx + w} ${my} ${x0 + w} ${y0}Z`;
}

/** A six-pointed camas flower: two triangles, petals of a star. */
function star(cx: number, cy: number, r: number): string {
  const pts = (off: number) =>
    [0, 1, 2].map((i) => {
      const a = off + (i * 2 * Math.PI) / 3;
      return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    });
  const [a, b, c] = pts(-Math.PI / 2);
  const [d, e, f] = pts(Math.PI / 2);
  return `M${a}L${b}L${c}ZM${d}L${e}L${f}Z`;
}

export function peopleArt(): SVGSVGElement {
  const s = node("svg", {
    viewBox: "0 0 320 132",
    class: "people-art",
    "aria-hidden": "true",
    focusable: "false",
  }) as SVGSVGElement;

  s.append(node("rect", { class: "pa-ground", x: 0, y: 0, width: 320, height: 132, rx: 14 }));
  s.append(node("ellipse", { class: "pa-soil", cx: 160, cy: 126, rx: 150, ry: 9 }));

  // Harakeke behind the basket, fanning left: long stiff blades, one with its
  // flower stalk.
  const flax = [
    [70, 124, 22, 30, 5, -6],
    [76, 124, 44, 14, 5, -4],
    [82, 124, 74, 8, 5, 2],
    [88, 124, 108, 22, 5, 6],
    [92, 124, 128, 52, 4, 6],
    [66, 124, 14, 70, 4, -4],
  ];
  for (const [x0, y0, x1, y1, w, b] of flax) s.append(node("path", { class: "pa-leaf", d: blade(x0, y0, x1, y1, w, b) }));
  s.append(node("path", { class: "pa-stalk", d: "M80 124Q86 70 96 24" }));
  for (const [x, y] of [[96, 24], [92, 38], [89, 52]]) {
    s.append(node("path", { class: "pa-flax-flower", d: `M${x} ${y}q6 -2 9 -9q-7 1 -9 9z` }));
  }

  // Wild leek in the basket: broad flat leaves, leaning out.
  s.append(node("path", { class: "pa-leaf pa-leaf-soft", d: blade(146, 96, 118, 40, 9, -10) }));
  s.append(node("path", { class: "pa-leaf pa-leaf-soft", d: blade(152, 96, 150, 34, 9, -4) }));

  // Camas in the basket: three spikes of blue stars.
  const spikes: [number, number, number, number][] = [
    [168, 96, 178, 30],
    [178, 96, 200, 40],
    [186, 96, 222, 56],
  ];
  for (const [x0, y0, x1, y1] of spikes) {
    s.append(node("path", { class: "pa-stalk", d: `M${x0} ${y0}Q${(x0 + x1) / 2 - 4} ${(y0 + y1) / 2} ${x1} ${y1}` }));
    for (let i = 0; i < 4; i++) {
      const tt = i / 4;
      const x = x1 + (x0 - x1) * tt * 0.75;
      const y = y1 + (y0 - y1) * tt * 0.75;
      s.append(node("path", { class: "pa-camas", d: star(x, y, 6 - i * 0.4) }));
    }
  }

  // The basket: a woven body under a rim.
  s.append(node("path", { class: "pa-basket", d: "M112 94L122 124Q160 131 198 124L208 94Z" }));
  for (const y of [103, 112, 120]) {
    s.append(node("path", { class: "pa-weave", d: `M${115 + (y - 94) / 3} ${y}Q160 ${y + 5} ${205 - (y - 94) / 3} ${y}` }));
  }
  for (let x = 124; x <= 196; x += 12) {
    s.append(node("path", { class: "pa-weave", d: `M${x} 96L${x + (x - 160) / 12} 126` }));
  }
  s.append(node("ellipse", { class: "pa-rim", cx: 160, cy: 94, rx: 49, ry: 6 }));

  // White fawn lily, to the right: two mottled leaves and a nodding flower.
  s.append(node("path", { class: "pa-leaf", d: blade(252, 124, 226, 104, 8, -4) }));
  s.append(node("path", { class: "pa-leaf", d: blade(258, 124, 288, 106, 8, 4) }));
  s.append(node("path", { class: "pa-stalk", d: "M256 124Q254 70 270 50" }));
  s.append(node("path", { class: "pa-lily", d: "M270 50q-14 2 -20 18q10 -4 20 -18z" }));
  s.append(node("path", { class: "pa-lily", d: "M270 50q12 4 14 20q-9 -6 -14 -20z" }));
  s.append(node("path", { class: "pa-lily", d: "M270 50q-2 12 -6 24q-3 -14 6 -24z" }));

  return s;
}
