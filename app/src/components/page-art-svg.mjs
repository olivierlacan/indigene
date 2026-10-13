// The drawings at the head of the pages off the main path — Reading, What's
// new, the Guide, Privacy, Sources, About, the Native page — in the manner of
// the basket on "Peoples and plants" (`people-art.ts`): flat shapes on a soft
// green card, coloured by classes so they follow the theme.
//
// Plain JavaScript returning markup, not DOM, because two of these pages
// aren't the app: What's new and the Guide are written out by
// `scripts/build-release-notes.mjs` and `scripts/build-guide.mjs`, which import
// this file directly. The app's styles live in `styles.css` (`.page-art`); the
// two static pages carry a copy of them (`PAGE_ART_CSS` below).
//
// Every drawing is decorative: the title and lede under it carry the meaning,
// so each is `aria-hidden` and says nothing to a screen reader.

const W = 320;
const H = 132;
const BASE = 124; // where stems meet the ground

const f = (n) => Number(n.toFixed(1));

/** A shape with one of the palette's classes (`pa-<cls>`). */
const pa = (cls) => cls.split(" ").map((c) => `pa-${c}`).join(" ");
const path = (cls, d) => `<path class="${pa(cls)}" d="${d}"/>`;
const circle = (cls, cx, cy, r) => `<circle class="${pa(cls)}" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"/>`;
const ellipse = (cls, cx, cy, rx, ry, rot = 0) =>
  `<ellipse class="${pa(cls)}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"${
    rot ? ` transform="rotate(${f(rot)} ${f(cx)} ${f(cy)})"` : ""
  }/>`;
const rect = (cls, x, y, w, h, rx = 0, rot = 0) =>
  `<rect class="${pa(cls)}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}"${
    rot ? ` transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})"` : ""
  }/>`;

/** A blade from a base point to a tip, `w` wide at the base, bowed by `bend`. */
function blade(x0, y0, x1, y1, w, bend) {
  const mx = (x0 + x1) / 2 + bend;
  const my = (y0 + y1) / 2;
  return `M${f(x0)} ${f(y0)}Q${f(mx - w)} ${f(my)} ${f(x1)} ${f(y1)}Q${f(mx + w)} ${f(my)} ${f(x0 + w)} ${f(y0)}Z`;
}

/** A leaf from base to tip, `w` wide at its middle. */
function leaf(x0, y0, x1, y1, w) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * w;
  const ny = (dx / len) * w;
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  return `M${f(x0)} ${f(y0)}Q${f(mx + nx)} ${f(my + ny)} ${f(x1)} ${f(y1)}Q${f(mx - nx)} ${f(my - ny)} ${f(x0)} ${f(y0)}Z`;
}

/** A stem: a quadratic curve, stroked. */
const stem = (x0, y0, cx, cy, x1, y1, cls = "stalk") =>
  path(cls, `M${f(x0)} ${f(y0)}Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}`);

/** A point and its direction along a quadratic curve. */
function along(x0, y0, cx, cy, x1, y1, t) {
  const u = 1 - t;
  return {
    x: u * u * x0 + 2 * u * t * cx + t * t * x1,
    y: u * u * y0 + 2 * u * t * cy + t * t * y1,
    dx: 2 * u * (cx - x0) + 2 * t * (x1 - cx),
    dy: 2 * u * (cy - y0) + 2 * t * (y1 - cy),
  };
}

/** A fern frond: a curved rachis with leaflets either side, shrinking to the tip. */
function frond(x0, y0, cx, cy, x1, y1, n, len, cls = "leaf") {
  let out = stem(x0, y0, cx, cy, x1, y1);
  for (let i = 1; i <= n; i++) {
    const t = 0.12 + (i / n) * 0.84;
    const p = along(x0, y0, cx, cy, x1, y1, t);
    const d = Math.hypot(p.dx, p.dy) || 1;
    const l = len * (1 - t * 0.75);
    for (const side of [-1, 1]) {
      // Perpendicular to the rachis, swept a little toward the tip.
      const ex = p.x + ((-p.dy / d) * side * 0.9 + (p.dx / d) * 0.45) * l;
      const ey = p.y + ((p.dx / d) * side * 0.9 + (p.dy / d) * 0.45) * l;
      out += path(cls, leaf(p.x, p.y, ex, ey, l * 0.22));
    }
  }
  return out;
}

/** Petals in a ring: `n` ellipses around a centre, from angle `a0` to `a1`. */
function petals(cx, cy, n, len, w, cls, a0 = 0, a1 = 360) {
  const full = a1 - a0 >= 360;
  let out = "";
  for (let i = 0; i < n; i++) {
    const a = a0 + ((a1 - a0) * i) / (full ? n : n - 1);
    const r = (a * Math.PI) / 180;
    out += ellipse(cls, cx + Math.cos(r) * len * 0.55, cy + Math.sin(r) * len * 0.55, len / 2, w / 2, a);
  }
  return out;
}

/** A coneflower: a stem, petals hanging from a raised cone. */
function coneflower(x0, x1, y1, bend = 0) {
  return (
    stem(x0, BASE, (x0 + x1) / 2 + bend, (BASE + y1) / 2, x1, y1) +
    path("leaf", leaf(x0 + (x1 - x0) * 0.3, BASE - (BASE - y1) * 0.35, x0 + (x1 - x0) * 0.3 - 18, BASE - (BASE - y1) * 0.55, 4)) +
    petals(x1, y1 + 1, 7, 15, 5, "pink", 15, 165) +
    ellipse("cone", x1, y1 - 1, 6.5, 5.5)
  );
}

/** A four-pointed sparkle. */
function sparkle(cx, cy, r) {
  const q = r * 0.28;
  return path(
    "gold",
    `M${f(cx)} ${f(cy - r)}Q${f(cx + q)} ${f(cy - q)} ${f(cx + r)} ${f(cy)}Q${f(cx + q)} ${f(cy + q)} ${f(cx)} ${f(cy + r)}Q${f(cx - q)} ${f(cy + q)} ${f(cx - r)} ${f(cy)}Q${f(cx - q)} ${f(cy - q)} ${f(cx)} ${f(cy - r)}Z`
  );
}

/** A clump of grass blades fanning from one point. */
function grass(x, n, h, spread, cls = "leaf") {
  let out = "";
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const dx = (t - 0.5) * spread;
    out += path(cls, blade(x - 2 + i * 1.2, BASE, x + dx, BASE - h * (0.75 + 0.25 * Math.sin(t * Math.PI)), 2.4, dx * 0.3));
  }
  return out;
}

/** Lines of writing on a page: short ink strokes. */
function lines(x, y, widths, gap = 4.5) {
  return widths.map((w, i) => path("ink", `M${f(x)} ${f(y + i * gap)}h${f(w)}`)).join("");
}

// --- The scenes ---------------------------------------------------------------

/** Further reading: a stack of books, open on top with a pressed leaf, a fern
 *  and goldenrod either side. */
function reading() {
  let s = "";
  // Goldenrod, arching left: a stalk with plumes of gold along its upper half.
  s += stem(64, BASE, 70, 70, 34, 34);
  for (let i = 0; i < 9; i++) {
    const p = along(64, BASE, 70, 70, 34, 34, 0.45 + i * 0.065);
    s += circle("gold", p.x - 4, p.y - 3, 3.4 - i * 0.12);
    s += circle("gold", p.x + 2, p.y - 5, 3 - i * 0.12);
  }
  s += path("leaf", leaf(65, 104, 44, 92, 4));
  s += path("leaf", leaf(66, 92, 86, 80, 3.5));

  // The fern, right.
  s += frond(262, BASE, 250, 70, 284, 26, 9, 18);

  // The stack: two closed books and an open one.
  s += rect("wood", 98, 111, 124, 13, 2);
  s += path("band", "M110 111v13M210 111v13");
  s += rect("leaf", 106, 99, 110, 12, 2);
  s += path("band", "M118 99v12M204 99v12");
  s += path("wood", "M102 96Q132 93 160 99Q188 93 218 96L218 100Q188 97 160 103Q132 97 102 100Z");
  s += path("paper", "M160 98Q134 91 106 95L106 84Q134 80 160 88Z");
  s += path("paper", "M160 98Q186 91 214 95L214 84Q186 80 160 88Z");
  s += lines(114, 87, [36, 32, 38], 3.6);
  // A pressed oak leaf on the right-hand page.
  s += path("red", "M174 92Q172 86 178 85Q178 81 183 82Q185 78 190 80Q194 78 196 82Q202 82 200 87Q205 89 200 92Q190 95 174 92Z");
  s += path("vein", "M175 91Q188 88 200 86");
  return s;
}

/** What's new: new growth — sprouts getting taller, a fern unrolling, sparkles. */
function whatsNew() {
  let s = "";
  // Three seedlings, each a little further along.
  const sprouts = [
    [40, 14, 6],
    [72, 26, 8],
    [108, 42, 10],
  ];
  for (const [x, h, l] of sprouts) {
    s += stem(x, BASE, x - 2, BASE - h / 2, x, BASE - h);
    s += path("leaf", leaf(x, BASE - h, x - l * 1.4, BASE - h - l * 0.7, l * 0.45));
    s += path("leaf", leaf(x, BASE - h, x + l * 1.4, BASE - h - l * 0.9, l * 0.45));
  }

  // A fiddlehead: a stem rising into a spiral that hasn't unrolled yet.
  const fiddle = (x0, x1, top, r0, turns) => {
    const cx = x1 + r0;
    const cy = top;
    let d = `M${x0} ${BASE}Q${f(x0 - 8)} ${f((BASE + top) / 2)} ${f(x1)} ${f(top)}`;
    const steps = 40;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const a = Math.PI + t * turns * 2 * Math.PI;
      const r = r0 * (1 - t * 0.85);
      d += `L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
    }
    return path("frond", d);
  };
  s += fiddle(186, 182, 56, 20, 1.3);
  s += fiddle(238, 236, 86, 11, 1.25);
  // An open frond behind them, for scale.
  s += frond(272, BASE, 266, 80, 296, 40, 7, 13);

  s += sparkle(234, 30, 9);
  s += sparkle(258, 52, 5);
  s += sparkle(150, 36, 6);
  return s;
}

/** The guide: a signpost at a fork in the path, flowers and grass around it. */
function guide() {
  let s = "";
  // The path, winding back.
  s += path("soil", "M128 126Q170 118 196 108Q226 96 262 92Q232 102 214 112Q192 124 196 126Z");
  // Grass to the right, coneflowers to the left.
  s += grass(272, 7, 42, 40);
  s += grass(296, 5, 30, 26);
  s += coneflower(54, 44, 52, -6);
  s += coneflower(80, 92, 66, 6);
  s += coneflower(34, 22, 76, -4);

  // The post, its two arms, and a small cap.
  s += rect("wood", 156, 30, 8, 94, 2);
  s += path("wood", "M164 38H214L224 47L214 56H164Z");
  s += path("wood", "M156 62H108L98 71L108 80H156Z");
  s += path("band", "M172 47h36M114 71h34");
  s += path("wood", "M152 30L160 22L168 30Z");
  return s;
}

/** Privacy: a nest of eggs tucked into a shrub, under its leaves. */
function privacy() {
  let s = "";
  // The shrub, a mass of rounded leaf. Faded as one group, so the circles
  // don't show where they overlap.
  s += `<g class="pa-soft">`;
  for (const [cx, cy, r] of [
    [118, 82, 30],
    [202, 82, 30],
    [138, 54, 28],
    [182, 52, 28],
    [160, 40, 26],
    [160, 74, 36],
  ]) s += circle("leaf", cx, cy, r);
  s += `</g>`;
  s += circle("red", 124, 60, 3.4);
  s += circle("red", 130, 66, 3);
  s += circle("red", 200, 64, 3.4);
  s += circle("red", 194, 70, 3);
  // The branch fork that holds it.
  s += path("branch", "M160 124L160 108M160 112L140 100M160 112L180 100");
  // The nest, and three eggs in it.
  s += ellipse("egg", 148, 92, 7, 9, -14);
  s += ellipse("egg", 160, 90, 7, 9.5);
  s += ellipse("egg", 172, 92, 7, 9, 14);
  s += path("wood", "M128 94Q160 100 192 94Q190 112 160 113Q130 112 128 94Z");
  for (const y of [100, 106]) s += path("band", `M${132 + (y - 94) / 2} ${y}Q160 ${y + 5} ${188 - (y - 94) / 2} ${y}`);
  // Leaves leaning over it.
  s += path("leaf", leaf(208, 78, 178, 88, 6));
  s += path("leaf", leaf(110, 76, 140, 86, 6));
  // Grass at its foot.
  s += grass(92, 5, 22, 22);
  s += grass(232, 5, 24, 22);
  return s;
}

/** Sources: a herbarium sheet with its pressed plant and label, and a hand lens. */
function sources() {
  let s = "";
  s += `<g transform="rotate(-4 146 68)">`;
  s += rect("paper", 96, 12, 100, 112, 3);
  // The pressed plant: a stem, paired leaves, a few small flowers.
  s += path("stalk", "M132 112Q128 80 140 30");
  for (const [y, l] of [
    [96, 16],
    [78, 14],
    [60, 11],
  ]) {
    const x = 131 + (112 - y) * 0.12;
    s += path("leaf", leaf(x, y, x - l, y - l * 0.55, l * 0.3));
    s += path("leaf", leaf(x, y, x + l, y - l * 0.75, l * 0.3));
  }
  for (const [x, y] of [
    [140, 30],
    [134, 40],
    [146, 42],
  ]) s += petals(x, y, 5, 6, 3.4, "violet") + circle("gold", x, y, 1.6);
  // Tape strips, and the label in the corner.
  s += rect("tape", 124, 100, 16, 5, 1, -20);
  s += rect("tape", 130, 66, 14, 5, 1, 24);
  s += rect("label", 152, 98, 38, 22, 2);
  s += lines(157, 105, [26, 20, 24], 4.6);
  s += `</g>`;

  // The hand lens over a leaf.
  s += path("handle", "M234 92L262 120");
  s += circle("lens", 222, 80, 20);
  // Clover, left.
  for (const [x, h] of [
    [56, 30],
    [74, 22],
  ]) {
    s += stem(x, BASE, x - 3, BASE - h / 2, x, BASE - h);
    for (const a of [-90, 30, 150]) {
      const r = (a * Math.PI) / 180;
      s += circle("leaf", x + Math.cos(r) * 5, BASE - h + Math.sin(r) * 5, 5);
    }
  }
  s += grass(282, 6, 30, 28);
  return s;
}

/** About: what the app is for — the sun where you stand, the plants native to
 *  it, and what comes to them. */
function about() {
  let s = "";
  // The sun.
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 * Math.PI) / 180;
    s += path("ray", `M${f(268 + Math.cos(a) * 21)} ${f(32 + Math.sin(a) * 21)}L${f(268 + Math.cos(a) * 29)} ${f(32 + Math.sin(a) * 29)}`);
  }
  s += circle("gold", 268, 32, 16);
  // Little bluestem, coneflowers, a milkweed.
  s += grass(42, 8, 56, 40, "grass");
  s += coneflower(96, 88, 50, -4);
  s += coneflower(118, 126, 64, 4);
  // Milkweed: a broad-leaved stem and a dome of small pink flowers.
  s += stem(184, BASE, 180, 90, 186, 58);
  for (const [y, side] of [
    [104, -1],
    [92, 1],
    [80, -1],
  ]) s += path("leaf", leaf(183, y, 183 + side * 22, y - 6, 6));
  for (let i = 0; i < 9; i++) {
    const a = Math.PI + (i * Math.PI) / 8;
    s += circle("pink", 186 + Math.cos(a) * 10, 56 + Math.sin(a) * 8, 3.2);
  }
  s += circle("pink", 186, 50, 3.2);
  s += grass(240, 6, 34, 30, "grass");
  // A monarch, on its way in.
  s += `<g transform="rotate(-18 226 62)">`;
  s += path("orange", "M226 62Q210 44 204 52Q202 62 226 64Z");
  s += path("orange", "M226 62Q242 44 248 52Q250 62 226 64Z");
  s += path("orange", "M226 64Q212 70 214 78Q220 80 226 66Z");
  s += path("orange", "M226 64Q240 70 238 78Q232 80 226 66Z");
  s += path("vein dark", "M226 62L208 52M226 62L244 52M226 64L216 76M226 64L236 76");
  s += ellipse("body", 226, 64, 1.8, 7);
  s += `</g>`;
  return s;
}

/** Native: a plant and its roots, cut away underground, with a bee at the flower
 *  — the plant and what evolved with it. */
function native() {
  let s = "";
  const G = 74; // the ground line
  s += path("earth", `M0 ${G}H${W}V${H - 14}A14 14 0 0 1 ${W - 14} ${H}H14A14 14 0 0 1 0 ${H - 14}Z`);
  // Roots: a central tap and its branches, drawn finer as they go.
  s += path("root", `M160 ${G}Q158 100 162 126`);
  for (const [x0, y0, cx, cy, x1, y1] of [
    [160, 82, 136, 86, 116, 106],
    [160, 82, 184, 88, 204, 104],
    [160, 94, 140, 104, 128, 124],
    [161, 96, 182, 106, 196, 124],
    [128, 96, 110, 98, 96, 112],
    [192, 96, 214, 96, 228, 110],
  ]) s += path("root fine", `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`);
  // Neighbours' roots, further off.
  s += path("root fine", `M60 ${G}Q58 92 52 108M60 84Q70 92 74 104`);
  s += path("root fine", `M264 ${G}Q266 90 274 104M264 82Q252 90 250 100`);

  // Above ground: a bergamot, its lilac head, and a bee.
  s += stem(160, G, 156, 46, 160, 22);
  for (const [y, side] of [
    [62, -1],
    [50, 1],
    [40, -1],
  ]) s += path("leaf", leaf(159, y, 159 + side * 18, y - 5, 4.5));
  s += petals(160, 20, 10, 12, 3.2, "violet", 180, 360);
  s += circle("violet", 160, 21, 5);
  // Grass and a seedling either side.
  s += path("leaf", blade(56, G, 46, 44, 2.4, -2)) + path("leaf", blade(60, G, 64, 40, 2.4, 2)) + path("leaf", blade(62, G, 76, 50, 2.4, 3));
  s += path("leaf", blade(262, G, 252, 48, 2.4, -2)) + path("leaf", blade(266, G, 272, 42, 2.4, 2)) + path("leaf", blade(268, G, 284, 54, 2.4, 3));
  // The bee.
  s += ellipse("wing", 202, 22, 6, 3.5, -30);
  s += ellipse("wing", 208, 21, 6, 3.5, 30);
  s += ellipse("gold", 205, 30, 8, 5.5, -12);
  s += path("stripe", "M202 25.5l-1.5 9M207 25l-1.5 9.5");
  s += circle("body", 213, 28.5, 3.2);
  return s;
}

const SCENES = { reading, whatsNew, guide, privacy, sources, about, native };

/** The names a page can ask for. */
export const PAGE_ART_NAMES = Object.keys(SCENES);

/** One page's drawing, as SVG markup. Static: no input reaches it. */
export function pageArtSvg(name) {
  const scene = SCENES[name];
  if (!scene) throw new Error(`No drawing called "${name}"`);
  const soil = name === "native" ? "" : ellipse("soil", 160, 126, 150, 9);
  return `<svg class="page-art" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">${rect(
    "ground",
    0,
    0,
    W,
    H,
    14
  )}${soil}${scene()}</svg>`;
}

// The rules both copies share. Colours come from the `--pa-*` properties, set
// per theme, and from the page's own --brand tokens.
export const PAGE_ART_RULES = `
.page-art .pa-ground { fill: var(--brand-bg); }
.page-art .pa-soil { fill: var(--line); opacity: 0.6; }
.page-art .pa-leaf { fill: var(--brand); }
.page-art .pa-soft { opacity: 0.7; }
.page-art .pa-grass { fill: var(--brand); opacity: 0.6; }
.page-art .pa-stalk { fill: none; stroke: var(--brand); stroke-width: 2.2; stroke-linecap: round; }
.page-art .pa-frond { fill: none; stroke: var(--brand); stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; }
.page-art .pa-wood, .page-art .pa-cone { fill: var(--pa-wood); }
.page-art .pa-band { fill: none; stroke: var(--pa-bg); stroke-width: 1.4; opacity: 0.55; }
.page-art .pa-branch { fill: none; stroke: var(--pa-wood); stroke-width: 4; stroke-linecap: round; }
.page-art .pa-handle { fill: none; stroke: var(--pa-wood); stroke-width: 7; stroke-linecap: round; }
.page-art .pa-lens { fill: var(--pa-paper); fill-opacity: 0.35; stroke: var(--pa-wood); stroke-width: 5; }
.page-art .pa-root { fill: none; stroke: var(--pa-wood); stroke-width: 3; stroke-linecap: round; }
.page-art .pa-fine { stroke-width: 1.6; }
.page-art .pa-earth { fill: var(--pa-earth); }
.page-art .pa-paper, .page-art .pa-label { fill: var(--pa-paper); stroke: var(--pa-edge); stroke-width: 1; }
.page-art .pa-tape { fill: #e3d7a8; opacity: 0.85; }
.page-art .pa-ink { fill: none; stroke: var(--pa-edge); stroke-width: 1.2; stroke-linecap: round; }
.page-art .pa-vein { fill: none; stroke: var(--pa-paper); stroke-width: 0.9; opacity: 0.8; }
.page-art .pa-dark, .page-art .pa-stripe { fill: none; stroke: var(--pa-dark); stroke-width: 1.2; opacity: 1; }
.page-art .pa-stripe { stroke-width: 1.8; }
.page-art .pa-body { fill: var(--pa-dark); }
.page-art .pa-wing { fill: var(--pa-paper); opacity: 0.75; }
.page-art .pa-ray { fill: none; stroke: var(--pa-gold); stroke-width: 3; stroke-linecap: round; }
.page-art .pa-gold { fill: var(--pa-gold); }
.page-art .pa-pink { fill: var(--pa-pink); }
.page-art .pa-violet { fill: var(--pa-violet); }
.page-art .pa-red { fill: var(--pa-red); }
.page-art .pa-orange { fill: var(--pa-orange); }
.page-art .pa-egg { fill: var(--pa-egg); }
`;

/** The `--pa-*` colours, light then dark. */
export const PAGE_ART_LIGHT =
  "--pa-wood: #7c430f; --pa-edge: #837e6b; --pa-paper: #fffdf4; --pa-gold: #d9a21b; --pa-pink: #c2557f; --pa-violet: #8a5bb8; --pa-red: #b8322a; --pa-orange: #e07b1a; --pa-egg: #9fd0dc; --pa-dark: #2b2118; --pa-earth: #d6c7a4; --pa-bg: #f7f5ef;";
export const PAGE_ART_DARK =
  "--pa-wood: #e2a86a; --pa-edge: #727b5f; --pa-paper: #e8e2cc; --pa-gold: #f0c75a; --pa-pink: #e891b4; --pa-violet: #c4a0ec; --pa-red: #e46a5e; --pa-orange: #f0a050; --pa-egg: #8cc4d2; --pa-dark: #241c14; --pa-earth: #3a3226; --pa-bg: #14160f;";

/**
 * All of it, for the two pages built outside the app. The app's copy is in
 * `styles.css` under "Page drawings", with the theme setting's overrides too;
 * `page-art.test.ts` holds the two alike. The static pages follow the system's
 * light or dark only, so this copy needs just the one dark block.
 */
export const PAGE_ART_CSS = `
.page-art { display: block; width: 100%; height: auto; max-width: 26rem; margin: 0 auto 0.9rem; }
.page-art { ${PAGE_ART_LIGHT} }
@media (prefers-color-scheme: dark) { .page-art { ${PAGE_ART_DARK} } }
${PAGE_ART_RULES}`;
