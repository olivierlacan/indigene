// The drawings at the head of the pages off the main path — Reading, What's
// new, the Guide, Privacy, Sources, About, the Native page, Homegrown, Kill your lawn, the Halloween post — in the manner of
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

/** Privacy: a garden gate in a low hedge, latched, with the garden behind it. */
function privacy() {
  let s = "";
  // The garden inside, showing over the hedge and between the pickets.
  s += coneflower(60, 52, 50, -4);
  s += coneflower(92, 100, 60, 4);
  s += stem(222, BASE, 228, 80, 216, 48);
  for (let i = 0; i < 6; i++) {
    const q = along(222, BASE, 228, 80, 216, 48, 0.55 + i * 0.09);
    s += circle("gold", q.x - 3, q.y - 2, 3.2 - i * 0.2);
    s += circle("gold", q.x + 3, q.y - 3, 3 - i * 0.2);
  }
  s += coneflower(258, 266, 56, 4);
  s += coneflower(160, 164, 62, 2);
  // The hedge, either side of the gate: solid, so the garden stands behind it.
  for (const [x0, x1] of [
    [16, 134],
    [186, 304],
  ]) {
    s += rect("leaf", x0, 94, x1 - x0, 33, 4);
    for (let x = x0 + 9; x < x1 - 4; x += 17) s += circle("leaf", x, 95, 10);
  }
  // The gate: two posts with caps, rails, pointed pickets, and its latch.
  for (const x of [134, 178]) {
    s += rect("wood", x, 74, 8, 50, 1);
    s += path("wood", `M${x - 1} 75L${x + 4} 69L${x + 9} 75Z`);
  }
  s += rect("wood", 142, 86, 36, 4, 1);
  s += rect("wood", 142, 110, 36, 4, 1);
  for (let x = 145; x < 176; x += 8) s += path("wood", `M${x} 122V84L${x + 2.5} 80L${x + 5} 84V122Z`);
  s += circle("gold", 174, 99, 2.6);
  // The path up to it.
  s += path("soil", "M144 124H176Q196 128 204 132H116Q124 128 144 124Z");
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

/** Homegrown National Park: a house whose lawn gives way to meadow, and an
 *  oak where a chickadee has a caterpillar for its young. */
function homegrown() {
  let s = "";
  // The house.
  s += rect("paper", 22, 84, 52, 40, 1);
  s += path("wood", "M14 87L48 60L82 87Z");
  s += rect("wood", 52, 102, 11, 22, 1);
  s += rect("egg", 30, 94, 13, 11, 1);
  // What's left of the lawn: a short, flat strip.
  s += rect("grass", 74, 118, 54, 6, 1);
  // The meadow that replaced the rest.
  s += grass(136, 6, 30, 26);
  s += coneflower(150, 144, 64, -4);
  s += coneflower(170, 178, 78, 4);
  s += stem(198, BASE, 204, 80, 192, 58);
  for (let i = 0; i < 6; i++) {
    const q = along(198, BASE, 204, 80, 192, 58, 0.55 + i * 0.09);
    s += circle("gold", q.x - 3, q.y - 2, 3 - i * 0.2);
    s += circle("gold", q.x + 3, q.y - 3, 2.8 - i * 0.2);
  }
  s += grass(212, 5, 24, 20);
  // The oak: a broad crown faded as one, the trunk and limbs over it.
  s += `<g class="pa-soft">`;
  for (const [cx, cy, r] of [
    [262, 44, 30],
    [236, 52, 20],
    [290, 50, 22],
    [248, 30, 18],
    [278, 28, 18],
  ]) s += circle("leaf", cx, cy, r);
  s += `</g>`;
  s += path("wood", "M256 124Q260 96 258 70L266 70Q264 96 270 124Z");
  s += path("branch", "M261 92Q246 84 230 82M262 80Q280 70 290 64");
  // The chickadee on the low limb, a caterpillar in its beak.
  s += ellipse("paper", 234, 74, 8, 6.5, -10);
  s += ellipse("grey", 238, 73, 6, 3.6, -20);
  s += circle("body", 227, 67, 4.6);
  s += circle("paper", 226, 68.5, 2.4);
  s += path("grey", "M242 75L252 79L243 78Z");
  for (let i = 0; i < 4; i++) s += circle("leaf", 220 - i * 2.6, 69 + i * 1.6, 1.7);
  return s;
}

/** The Halloween post: Halloween night. On the left the lawn, shorn flat and all
 *  one plant, with its headstone and a jack-o'-lantern; on the right what
 *  replaced it — goldenrod, asters, a pine for winter, and a real spider on
 *  a real web. A moon and two bats overhead. */
function halloween() {
  let s = "";
  // The moon: a gold disc with the card's own colour biting a crescent out.
  s += circle("gold", 34, 30, 15);
  s += circle("ground", 41, 25, 13);
  s += sparkle(70, 18, 4);
  s += sparkle(142, 30, 3);
  // Two bats, small and round-eared.
  const bat = (x, y, k) =>
    path("wood", `M${f(x)} ${f(y)}Q${f(x - 5 * k)} ${f(y - 6 * k)} ${f(x - 13 * k)} ${f(y - 3 * k)}Q${f(x - 10 * k)} ${f(y)} ${f(x - 11 * k)} ${f(y + 3 * k)}Q${f(x - 6 * k)} ${f(y + 1 * k)} ${f(x)} ${f(y + 4 * k)}Q${f(x + 6 * k)} ${f(y + 1 * k)} ${f(x + 11 * k)} ${f(y + 3 * k)}Q${f(x + 10 * k)} ${f(y)} ${f(x + 13 * k)} ${f(y - 3 * k)}Q${f(x + 5 * k)} ${f(y - 6 * k)} ${f(x)} ${f(y)}Z`) +
    circle("wood", x, y + 0.5 * k, 2.6 * k) +
    path("wood", `M${f(x - 2.4 * k)} ${f(y - 1 * k)}l${f(0.6 * k)} ${f(-3 * k)}l${f(1.2 * k)} ${f(2.2 * k)}ZM${f(x + 2.4 * k)} ${f(y - 1 * k)}l${f(-0.6 * k)} ${f(-3 * k)}l${f(-1.2 * k)} ${f(2.2 * k)}Z`);
  s += bat(92, 26, 1);
  s += bat(118, 44, 0.7);

  // The lawn: a flat green slab, every blade the same height.
  s += rect("grass", 10, 112, 150, 12, 2);
  for (let x = 13; x < 158; x += 4.2) s += path("leaf", blade(x, 113, x + 0.6, 107, 1.2, 0));
  // Its headstone, a little crooked.
  s += path("paper", "M42 113V90Q42 78 56 78Q70 78 70 90V113Z");
  s += path("ink", "M49 91h14M51 97h10");
  // The jack-o'-lantern: ribbed, a stem, a face cut from the card's colour.
  s += ellipse("orange", 112, 101, 13, 11);
  s += ellipse("orange", 103, 102, 8, 10);
  s += ellipse("orange", 121, 102, 8, 10);
  s += path("band", "M107 92Q104 101 107 111M117 92Q120 101 117 111");
  s += path("stalk", "M112 91Q112 85 116 83");
  s += path("ground", "M104 97l4 -4l3 4ZM113 97l4 -4l3 4Z");
  s += path("ground", "M103 103Q112 111 121 103L118 104L116 102L114 105L111 102L109 105L106 102Z");

  // What replaced it: a pine, goldenrod, asters, grass, all heights at once.
  s += rect("wood", 285, 100, 6, 24, 1);
  for (const [y, w] of [[104, 24], [86, 19], [70, 14], [56, 9]]) {
    s += path("leaf", `M${288 - w} ${y}L288 ${y - 22}L${288 + w} ${y}Z`);
  }
  s += stem(196, BASE, 204, 80, 188, 46);
  for (let i = 0; i < 7; i++) {
    const q = along(196, BASE, 204, 80, 188, 46, 0.5 + i * 0.08);
    s += circle("gold", q.x - 3.5, q.y - 2, 3.2 - i * 0.2);
    s += circle("gold", q.x + 3, q.y - 3.5, 3 - i * 0.2);
  }
  s += path("leaf", leaf(198, 104, 214, 96, 3.5));
  s += path("leaf", leaf(197, 94, 182, 86, 3.5));
  for (const [x, y, h] of [[234, 62, 0], [252, 74, 6], [222, 80, -4]]) {
    s += stem(x + h, BASE, x + h / 2, (BASE + y) / 2, x, y);
    s += petals(x, y, 12, 9, 2.6, "violet");
    s += circle("gold", x, y, 2.6);
  }
  s += grass(176, 6, 30, 24);
  s += grass(266, 5, 26, 20);
  // A real web between the goldenrod and the asters, every strand tied to a
  // plant, and its spider at the hub.
  const hub = [212, 60];
  for (const [x, y] of [[191, 48], [196, 62], [200, 74], [232, 62], [229, 72], [222, 79]]) {
    s += path("ink", `M${hub[0]} ${hub[1]}L${x} ${y}`);
  }
  s += path("ink", "M191 48L232 62");
  for (const r of [4, 8, 12]) s += circle("thread", hub[0], hub[1], r);
  s += path("root fine", "M210 59l-4 -2M210 61l-4 2M214 59l4 -2M214 61l4 2");
  s += ellipse("wood", 212, 61, 2.6, 3.2);
  s += circle("wood", 212, 57, 1.8);
  return s;
}

/** Kill your lawn: a flat strip of lawn on the left, part of it already
 *  buried under cardboard and chips with a seedling planted through; on the
 *  right what replaces it, every layer at once — ground cover, coneflowers,
 *  a berried shrub and an oak — under the sun. */
function killYourLawn() {
  let s = "";
  // The sun.
  for (let i = 0; i < 10; i++) {
    const a = (i * 36 * Math.PI) / 180;
    s += path("ray", `M${f(40 + Math.cos(a) * 19)} ${f(30 + Math.sin(a) * 19)}L${f(40 + Math.cos(a) * 26)} ${f(30 + Math.sin(a) * 26)}`);
  }
  s += circle("gold", 40, 30, 14);
  // The lawn: one plant, one height.
  s += rect("grass", 10, 112, 76, 12, 2);
  for (let x = 13; x < 84; x += 4.2) s += path("leaf", blade(x, 113, x + 0.6, 107, 1.2, 0));
  // The buried part: cardboard, then a mound of wood chips over it.
  s += rect("paper", 86, 114, 72, 6, 1);
  s += path("wood", "M84 118Q122 100 160 118Z");
  for (const [x, y] of [[98, 114], [108, 110], [118, 108], [128, 109], [140, 112], [150, 115], [112, 115], [134, 115], [122, 113]]) {
    s += ellipse("earth", x, y, 2.6, 1.2, (x * 7) % 40 - 20);
  }
  // A seedling planted through it.
  s += stem(122, 108, 121, 100, 122, 92);
  s += path("leaf", leaf(122, 94, 112, 88, 3.4));
  s += path("leaf", leaf(122, 92, 132, 85, 3.4));

  // What replaces it: ground cover, flowers, a shrub, an oak.
  for (const x of [170, 182, 194]) {
    s += path("leaf", leaf(x, BASE, x - 7, BASE - 7, 3));
    s += path("leaf", leaf(x, BASE, x + 7, BASE - 8, 3));
  }
  s += coneflower(186, 180, 70, -4);
  s += coneflower(198, 206, 82, 4);
  // The shrub: a mound of leaves with berries.
  s += `<g class="pa-soft">`;
  for (const [cx, cy, r] of [[232, 108, 16], [220, 112, 11], [246, 112, 11], [232, 96, 11]]) s += circle("leaf", cx, cy, r);
  s += `</g>`;
  for (const [x, y] of [[226, 100], [238, 104], [230, 110], [244, 98], [220, 108]]) s += circle("red", x, y, 2.2);
  // The oak: a crown faded as one, the trunk over it.
  s += `<g class="pa-soft">`;
  for (const [cx, cy, r] of [[284, 44, 24], [266, 52, 16], [302, 52, 16], [276, 30, 15], [296, 30, 14]]) s += circle("leaf", cx, cy, r);
  s += `</g>`;
  s += path("wood", "M279 124Q283 96 281 66L289 66Q287 96 293 124Z");
  s += path("branch", "M284 88Q272 80 262 78M286 80Q298 72 306 66");
  return s;
}


/** Your first planting day: a willow over the water's edge, a row of potted
 *  natives waiting, a bucket, and a spade standing in the ground. */
function volunteer() {
  let s = "";
  // The willow: trunk, then fronds hanging from the crown.
  s += path("wood", "M36 124Q42 92 38 62L48 62Q46 92 54 124Z");
  for (const [x, len, bend] of [[14, 52, -4], [24, 62, -2], [34, 50, 0], [46, 58, 2], [58, 64, 3], [70, 50, 5]]) {
    s += stem(42, 44, x, 36, x + bend, 44 + len);
  }
  s += `<g class="pa-soft">`;
  for (const [cx, cy, r] of [[42, 40, 18], [24, 46, 12], [62, 46, 12]]) s += circle("leaf", cx, cy, r);
  s += `</g>`;
  // Pots waiting their turn.
  for (const x of [104, 134, 164]) {
    s += path("wood", `M${x - 10} 106H${x + 10}L${x + 7} 124H${x - 7}Z`);
    s += stem(x, 106, x - 1, 98, x, 88);
    s += path("leaf", leaf(x, 96, x - 10, 88, 3.4)) + path("leaf", leaf(x, 93, x + 10, 84, 3.4));
  }
  // The bucket.
  s += path("ink", "M192 100Q208 78 224 100");
  s += path("paper", "M191 99H225L221 124H195Z");
  s += path("water", "M193 105H223L220 122H196Z");
  // The spade, standing in the ground.
  s += path("grey", "M250 104H268V122Q259 128 250 122Z");
  s += path("handle", "M259 104V58");
  s += path("handle", "M250 56H268");
  // One already planted, chips around it.
  s += stem(296, 124, 295, 108, 296, 92);
  s += path("leaf", leaf(296, 106, 284, 98, 3.6)) + path("leaf", leaf(296, 100, 309, 92, 3.6)) + path("leaf", leaf(296, 94, 296, 82, 3));
  for (const x of [280, 287, 305, 312]) s += ellipse("wood", x, 123, 3.4, 1.5, (x * 7) % 40 - 20);
  return s;
}

// --- Squares ----------------------------------------------------------------
// Small square drawings that sit beside a section of a page, on the same card
// and palette as the banners above. 64×64; each says what its heading says.

const SQ = 64;

/** "A lawn is a zombie": a hand clawing up out of a shorn lawn, a drop of the
 *  water it drinks beside it. */
function sqZombie() {
  let s = "";
  s += circle("gold", 50, 13, 6);
  s += circle("ground", 53, 11, 5);
  // The hand: a palm, four fingers crooked at the tips, a thumb.
  s += path("slime", "M22 52V36Q22 32 26 31L38 31Q42 32 42 36V52Z");
  for (const [x, top, lean] of [[23.5, 18, -2], [28.5, 14, -1], [33.5, 15, 1], [38.5, 20, 2]]) {
    s += path("slime", `M${x - 2} 33V${top + 3}Q${x - 2} ${top} ${x + lean} ${top - 1}Q${x + 2.5} ${top} ${x + 2} ${top + 3}V33Z`);
  }
  s += path("slime", "M41 40Q47 36 49 30Q51 28 52 31Q51 38 42 46Z");
  s += path("dark", "M27 40l3 2M33 44l3 -1");
  // The water it drinks.
  s += path("egg", "M12 30Q8 36 8 39Q8 43 12 43Q16 43 16 39Q16 36 12 30Z");
  // The lawn, every blade the same height.
  s += rect("grass", 0, 50, SQ, 14, 0);
  for (let x = 2; x < SQ; x += 4) s += path("leaf", blade(x, 51, x + 0.5, 45, 1.1, 0));
  return s;
}

/** "Lights and inflatables on a timer": an inflatable ghost on its lawn, a
 *  timer at 11, and a bird going over by the stars. */
function sqLights() {
  let s = "";
  s += sparkle(10, 10, 2.5);
  s += sparkle(26, 6, 2);
  s += sparkle(56, 22, 2);
  // A bird, flying on by.
  s += path("wood", "M34 14Q38 10 42 14Q46 10 50 14Q46 12 42 16Q38 12 34 14Z");
  // The ghost: a round head, a hem, two eyes and a mouth.
  s += path("paper", "M10 56V34Q10 22 22 22Q34 22 34 34V56L30 52L26 56L22 52L18 56L14 52Z");
  s += circle("body", 18, 34, 2);
  s += circle("body", 26, 34, 2);
  s += ellipse("body", 22, 41, 2, 2.6);
  // The timer: a clock face at 11.
  s += circle("paper", 48, 42, 10);
  s += path("ink", "M48 42V35M48 42L44.5 38");
  s += circle("orange", 48, 42, 1.4);
  s += rect("grass", 0, 56, SQ, 8, 0);
  return s;
}

/** "Bury it this fall": the lawn's headstone, cardboard under a mound of
 *  chips, and the first seedling through. */
function sqBury() {
  let s = "";
  s += path("paper", "M8 46V26Q8 16 18 16Q28 16 28 26V46Z");
  s += path("ink", "M13 26h10M15 31h6");
  s += rect("paper", 4, 50, 56, 4, 1);
  s += path("wood", "M2 58Q32 38 62 58Z");
  for (const [x, y] of [[20, 53], [28, 50], [38, 49], [46, 52], [32, 55], [52, 56], [14, 56]]) {
    s += ellipse("earth", x, y, 2.2, 1, (x * 7) % 40 - 20);
  }
  s += stem(40, 50, 39, 42, 40, 34);
  s += path("leaf", leaf(40, 37, 32, 31, 3));
  s += path("leaf", leaf(40, 35, 49, 29, 3));
  return s;
}

/** "Sources": a stack of books and a candle to read them by. */
function sqSources() {
  let s = "";
  s += rect("violet", 8, 46, 34, 8, 1.5);
  s += rect("orange", 11, 38, 30, 8, 1.5);
  s += rect("red", 6, 30, 32, 8, 1.5);
  s += path("vein", "M10 34h24M14 42h22M11 50h26");
  // The candle, its drip, and the flame.
  s += rect("paper", 46, 34, 8, 20, 1);
  s += path("paper", "M46 37Q44 41 46 43Z");
  s += path("gold", "M50 22Q46 28 50 32Q54 28 50 22Z");
  s += path("ink", "M50 32V34");
  s += rect("wood", 0, 54, SQ, 10, 0);
  return s;
}


/** "Getting a potted plant into the ground": a seedling in its pot. */
function sqPot() {
  let s = "";
  s += path("wood", "M18 34H46L42 58H22Z");
  s += rect("wood", 15, 30, 34, 6, 2);
  s += stem(32, 30, 31, 22, 32, 12);
  s += path("leaf", leaf(32, 20, 20, 12, 4)) + path("leaf", leaf(32, 17, 45, 8, 4));
  return s;
}

/** "Invasives you pull": a tied bag. */
function sqBag() {
  let s = "";
  s += path("body", "M20 58Q8 36 26 22L32 14L38 22Q56 36 44 58Z");
  s += path("dark", "M32 14L25 5M32 14L39 5");
  s += path("leaf", leaf(40, 22, 54, 12, 5));
  return s;
}

/** "Digging among roots": a spade through a root. */
function sqSpade() {
  let s = "";
  s += rect("earth", 0, 40, SQ, 24);
  s += path("branch", "M4 54Q14 50 22 52M42 52Q52 50 60 55");
  s += path("grey", "M22 36H42V56Q32 62 22 56Z");
  s += path("handle", "M32 36V10");
  s += path("handle", "M24 9H40");
  return s;
}

/** "What to bring": a glove. */
function sqGlove() {
  let s = "";
  s += path("orange", "M16 58V34Q16 28 21 28V16Q24 11 27 16V26H30V12Q33 7 36 12V26H39V17Q42 13 45 18V40L52 32Q57 30 57 36L47 50V58Z");
  s += path("ink", "M16 51H47");
  return s;
}

const SQUARES = { zombie: sqZombie, lights: sqLights, bury: sqBury, sources: sqSources, pot: sqPot, bag: sqBag, spade: sqSpade, glove: sqGlove };

/** The names a section can ask for. */
export const SQUARE_NAMES = Object.keys(SQUARES);

/** One square drawing, as SVG markup. Static: no input reaches it. */
export function squareArtSvg(name) {
  const scene = SQUARES[name];
  if (!scene) throw new Error(`No square called "${name}"`);
  // Clipped to the card's rounded corners, so a lawn drawn edge to edge
  // doesn't poke out at the bottom. One id per drawing, unique on the page.
  const id = `square-${name}`;
  return `<svg class="page-art square-art" viewBox="0 0 ${SQ} ${SQ}" aria-hidden="true" focusable="false"><clipPath id="${id}"><rect width="${SQ}" height="${SQ}" rx="10"/></clipPath><g clip-path="url(#${id})">${rect(
    "ground",
    0,
    0,
    SQ,
    SQ,
    10
  )}${scene()}</g></svg>`;
}


// --- Figures ------------------------------------------------------------------
// The how-to drawings on the planting-day guides (`steps/volunteer.ts`). Unlike
// the banners these carry meaning, so each is an image with a label (the
// caller's caption) rather than hidden. No words inside: the caption under the
// figure says it, in the reader's language. 320×150, clipped to the card.

const FW = 320;
const FH = 150;

/** An arrow from left to right, `len` long. */
const arrow = (x, y, len = 34) => path("arrow", `M${f(x)} ${f(y)}h${f(len)}m-8 -7l8 7l-8 7`);
/** A tick and a cross, for "do" and "don't". */
const tick = (x, y, s = 1) => path("yes", `M${f(x - 7 * s)} ${f(y)}l${f(5 * s)} ${f(5 * s)}l${f(9 * s)} ${f(-11 * s)}`);
const cross = (x, y, r = 7) => path("no", `M${f(x - r)} ${f(y - r)}L${f(x + r)} ${f(y + r)}M${f(x + r)} ${f(y - r)}L${f(x - r)} ${f(y + r)}`);
/** A young plant: a stem with pairs of leaves, from the crown up. */
function sprig(x, y0, y1, n = 2, w = 3.6, reach = 13) {
  let s = stem(x, y0, x - 1, (y0 + y1) / 2, x, y1);
  for (let i = 0; i < n; i++) {
    const y = y1 + ((y0 - y1) * (i + 0.4)) / (n + 0.6);
    s += path("leaf", leaf(x, y + 4, x - reach, y - 4, w));
    s += path("leaf", leaf(x, y + 2, x + reach, y - 6, w));
  }
  return s + path("leaf", leaf(x, y1 + 2, x, y1 - 10, w * 0.8));
}
/** Wood chips scattered along a line. */
function chips(x0, x1, y, skip = null) {
  let s = "";
  for (let x = x0, i = 0; x <= x1; x += 7, i++) {
    if (skip && x > skip[0] && x < skip[1]) continue;
    s += ellipse("wood", x, y - (i % 3), 3.6, 1.6, (i * 37) % 40 - 20);
  }
  return s;
}
/** A root from a point to a point, sagging by `bow`. */
const rootTo = (x0, y0, x1, y1, bow = 0, cls = "root") =>
  path(cls, `M${f(x0)} ${f(y0)}Q${f((x0 + x1) / 2 + bow)} ${f((y0 + y1) / 2 + Math.abs(bow) * 0.4)} ${f(x1)} ${f(y1)}`);

/** Root-bound: the pot's shape with roots circling it, then the same plant
 *  with the roots teased out straight. */
function figRootbound() {
  let s = "";
  // Out of the pot, still pot-shaped: roots going round and round.
  s += path("earth", "M38 62H112L102 130H48Z");
  for (const y of [72, 84, 96, 108, 120]) {
    const inset = ((y - 62) / 68) * 10;
    s += rootTo(40 + inset, y, 110 - inset, y + 2, 0, y % 24 ? "root" : "root fine");
    s += path("root fine", `M${f(44 + inset)} ${y - 5}Q75 ${y + 6} ${f(106 - inset)} ${y - 6}`);
  }
  s += sprig(75, 62, 26);
  s += cross(75, 142, 5);
  s += arrow(136, 92, 40);
  // Loosened: most of the pot soil gone, roots pointing out and down.
  s += ellipse("earth", 240, 72, 17, 10);
  for (const [x, y, bow] of [[188, 108, -6], [198, 126, -8], [216, 136, -4], [234, 140, -1], [250, 140, 1], [266, 134, 5], [284, 124, 8], [294, 106, 6]]) {
    s += rootTo(240, 70, x, y, bow, x % 3 ? "root" : "root fine");
  }
  s += sprig(240, 64, 26);
  s += tick(240, 146, 0.7);
  return s;
}

/** Washing the pot soil off in a bucket of water. */
function figBucket() {
  let s = "";
  // The empty pot, tipped over.
  s += path("wood", "M34 132L26 96L62 88L66 132Z");
  s += ellipse("earth", 60, 134, 14, 4);
  // The bucket and its water.
  s += path("ink", "M108 64Q160 14 212 64");
  s += path("paper", "M106 62H214L202 136H118Z");
  s += path("water", "M110 78H210L201 134H119Z");
  // Pot soil drifting off the roots.
  for (const [x, y] of [[134, 122], [148, 128], [176, 126], [188, 118], [128, 108], [192, 104], [162, 130]]) s += ellipse("earth", x, y, 4, 2, (x * 5) % 30);
  // The plant, roots in the water.
  for (const [x, y, bow] of [[138, 112, -5], [148, 120, -3], [158, 124, 0], [168, 122, 2], [180, 114, 5]]) s += rootTo(160, 80, x, y, bow);
  s += sprig(160, 80, 30, 3);
  // Kept wet until planted: drops off to the side.
  for (const [x, y] of [[244, 70], [258, 92], [240, 110]]) s += path("water", `M${x} ${y}q-6 9 0 12q6 -3 0 -12Z`);
  return s;
}

/** The hole in section: wide, no deeper than the roots, a firm mound in the
 *  middle, roots draped over it, the crown level with the ground. */
function figMound() {
  let s = "";
  s += rect("earth", 0, 72, FW, FH - 72);
  // The hole, filled back with the soil that came out of it.
  s += path("loose", "M62 72L92 126H228L258 72Z");
  // The mound, and the roots over it.
  s += path("wood soft", "M112 126L160 80L208 126Z");
  for (const [x, y, bow] of [[100, 112, -4], [116, 122, -2], [204, 122, 2], [220, 112, 4], [84, 96, -6], [236, 96, 6]]) s += rootTo(160, 74, x, y, bow);
  s += rootTo(160, 74, 138, 104, 0, "root fine") + rootTo(160, 74, 182, 104, 0, "root fine");
  // Ground level, marked across the hole: the crown sits on it.
  s += path("level", "M40 72H280");
  s += sprig(160, 72, 22, 3);
  // Wood chips on top, kept clear of the stem.
  s += chips(34, 286, 70, [146, 174]);
  return s;
}

/** Knotweed goes in a bag for the trash, never the compost. */
function figBag() {
  let s = "";
  // A knotweed cane: jointed, zigzag, with broad leaves.
  const joints = [[52, 132], [46, 108], [56, 84], [48, 60], [58, 38]];
  for (let i = 0; i < joints.length - 1; i++) {
    const [x0, y0] = joints[i];
    const [x1, y1] = joints[i + 1];
    s += path("frond", `M${x0} ${y0}L${x1} ${y1}`);
    const side = i % 2 ? 1 : -1;
    s += path("leaf", leaf(x1, y1, x1 + side * 26, y1 - 8, 11));
    s += circle("red", x1, y1, 2.4);
  }
  // A cut piece on the ground still counts.
  s += path("frond", "M76 136L98 132");
  s += circle("red", 87, 134, 2.2);
  s += arrow(112, 92, 36);
  // The bag, tied.
  s += path("body", "M168 134Q150 96 176 74L186 62L196 74Q222 96 204 134Z");
  s += path("dark", "M186 62L176 48M186 62L196 48");
  s += path("band", "M178 70H194");
  s += tick(186, 146, 0.7);
  // The compost heap, crossed out.
  s += rect("wood", 250, 84, 52, 46, 2);
  s += path("band", "M250 98H302M250 112H302");
  s += path("leaf", leaf(262, 84, 276, 74, 4)) + path("leaf", leaf(284, 84, 296, 76, 4));
  s += cross(276, 104, 28);
  return s;
}

/** Roots by thickness, to scale with each other: pencil, thumb, wrist. */
function figRootSizes() {
  let s = "";
  const root = (cx, cy, r) => circle("wood", cx, cy, r) + (r > 6 ? `<circle class="pa-band" cx="${cx}" cy="${cy}" r="${f(r * 0.55)}"/>` : "");
  // A pencil lying under the first, for scale.
  s += root(56, 70, 3.5);
  s += rect("orange", 30, 96, 44, 7, 1) + path("paper", "M74 96L84 99.5L74 103Z");
  s += tick(56, 132);
  s += root(152, 70, 12.5);
  s += path("caution", "M152 120V134M152 140V141");
  s += root(256, 70, 27);
  s += cross(256, 132);
  return s;
}

/** A spade driven straight down through a root: a foot on the tread, the
 *  handle rocked to open the cut. */
function figSpade() {
  let s = "";
  s += rect("earth", 0, 88, FW, FH - 88);
  // The root, cut where the blade went through.
  s += path("branch", "M24 118Q90 110 150 116") + path("branch", "M180 117Q240 112 300 120");
  s += rootTo(70, 114, 60, 136, 0, "root fine") + rootTo(236, 114, 250, 138, 0, "root fine");
  // The spade: blade down, shaft up, a grip on top.
  s += path("grey", "M150 84H180V128Q165 138 150 128Z");
  s += path("handle", "M165 84V26");
  s += path("handle", "M153 24H177");
  // A boot on the tread.
  s += path("body", "M180 84V44H196V70Q214 72 216 84Z");
  // Rock the handle.
  s += path("arrow", "M128 30Q165 4 202 30m-10 -1l10 1l1 -10");
  s += path("arrow", "M128 30l10 -1m-10 1l-1 -10");
  return s;
}

/** Old landscape fabric under the mulch: cut it, fold it back, take it out. */
function figFabric() {
  let s = "";
  s += rect("earth", 0, 78, FW, FH - 78);
  // The fabric, cut and peeled back either side of the planting spot.
  s += path("stripe", "M0 78H104Q122 60 100 50") + path("stripe", "M320 78H216Q198 60 220 50");
  s += chips(8, 96, 74) + chips(226, 312, 74);
  // Roots that had matted on top of it.
  s += path("root fine", "M20 82Q50 86 96 81M228 81Q270 86 306 82");
  // The plant, in real soil.
  for (const [x, y, bow] of [[132, 112, -4], [146, 124, -2], [174, 124, 2], [188, 112, 4]]) s += rootTo(160, 82, x, y, bow);
  s += sprig(160, 80, 34, 2);
  // The knife that cut it.
  s += path("grey", "M262 26L273 24L279 66L271 70Z");
  s += path("handle", "M266 22L263 6");
  return s;
}

/** What to bring: a rain jacket, gloves, boots, a soil knife, water, a towel. */
function figKit() {
  let s = "";
  s += rect("soil", 0, 132, FW, 18);
  // Rain jacket.
  s += path("gold", "M14 132V78Q14 62 30 58L38 48Q48 40 58 48L66 58Q82 62 82 78V132H68V92H28V132Z");
  s += path("gold", "M28 92H68V132H28Z");
  s += path("ink", "M48 60V130");
  // Gloves.
  s += path("orange", "M100 132V96Q100 88 106 88V72Q110 66 114 72V84H118V68Q122 62 126 68V84H130V74Q134 70 137 76V104L146 94Q152 92 152 99L140 118V132Z");
  s += path("ink", "M100 122H140");
  // Boots.
  s += path("body", "M166 132V70H186V108Q206 110 210 124V132Z");
  s += path("band", "M166 126H210");
  // Soil knife.
  s += path("grey", "M226 60Q232 46 238 60V104H226Z");
  s += path("handle", "M232 108V128");
  // Water bottle.
  s += rect("egg", 254, 78, 20, 54, 5);
  s += rect("grey", 259, 68, 10, 10, 2);
  // Towel.
  s += rect("paper", 284, 106, 28, 26, 3);
  s += path("ink", "M284 114H312M284 122H312");
  return s;
}

const FIGURES = { rootbound: figRootbound, bucket: figBucket, mound: figMound, bag: figBag, rootSizes: figRootSizes, spade: figSpade, fabric: figFabric, kit: figKit };

/** The names a guide can ask for. */
export const FIGURE_NAMES = Object.keys(FIGURES);

const escAttr = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** One how-to figure, as SVG markup, labelled with what it shows. */
export function figureArtSvg(name, label) {
  const scene = FIGURES[name];
  if (!scene) throw new Error(`No figure called "${name}"`);
  const id = `figure-${name}`;
  return `<svg class="page-art figure-art" viewBox="0 0 ${FW} ${FH}" role="img" aria-label="${escAttr(label)}" focusable="false"><clipPath id="${id}"><rect width="${FW}" height="${FH}" rx="14"/></clipPath><g clip-path="url(#${id})">${rect(
    "ground",
    0,
    0,
    FW,
    FH,
    14
  )}${scene()}</g></svg>`;
}

const SCENES = { reading, whatsNew, guide, privacy, sources, about, native, homegrown, killYourLawn, halloween, volunteer };

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
.page-art .pa-slime { fill: var(--pa-slime); stroke: var(--pa-dark); stroke-width: 1; stroke-linejoin: round; }
.page-art .pa-grey { fill: var(--pa-edge); }
.page-art .pa-wing { fill: var(--pa-paper); opacity: 0.75; }
.page-art .pa-ray { fill: none; stroke: var(--pa-gold); stroke-width: 3; stroke-linecap: round; }
.page-art .pa-gold { fill: var(--pa-gold); }
.page-art .pa-pink { fill: var(--pa-pink); }
.page-art .pa-violet { fill: var(--pa-violet); }
.page-art .pa-red { fill: var(--pa-red); }
.page-art .pa-orange { fill: var(--pa-orange); }
.page-art .pa-egg { fill: var(--pa-egg); }
.page-art .pa-thread { fill: none; stroke: var(--pa-edge); stroke-width: 0.8; }
.page-art .pa-water { fill: var(--pa-egg); opacity: 0.85; }
.page-art .pa-loose { fill: var(--pa-bg); opacity: 0.6; }
.page-art .pa-level { fill: none; stroke: var(--pa-edge); stroke-width: 1.4; stroke-dasharray: 5 4; }
.page-art .pa-arrow { fill: none; stroke: var(--pa-edge); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.page-art .pa-yes { fill: none; stroke: var(--brand); stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round; }
.page-art .pa-no { fill: none; stroke: var(--pa-red); stroke-width: 3.4; stroke-linecap: round; }
.page-art .pa-caution { fill: none; stroke: var(--pa-gold); stroke-width: 3.4; stroke-linecap: round; }
`;

/** The `--pa-*` colours, light then dark. */
export const PAGE_ART_LIGHT =
  "--pa-wood: #7c430f; --pa-edge: #837e6b; --pa-paper: #fffdf4; --pa-gold: #d9a21b; --pa-pink: #c2557f; --pa-violet: #8a5bb8; --pa-red: #b8322a; --pa-orange: #e07b1a; --pa-egg: #9fd0dc; --pa-dark: #2b2118; --pa-earth: #d6c7a4; --pa-bg: #f7f5ef; --pa-slime: #b4c39a;";
export const PAGE_ART_DARK =
  "--pa-wood: #e2a86a; --pa-edge: #727b5f; --pa-paper: #e8e2cc; --pa-gold: #f0c75a; --pa-pink: #e891b4; --pa-violet: #c4a0ec; --pa-red: #e46a5e; --pa-orange: #f0a050; --pa-egg: #8cc4d2; --pa-dark: #241c14; --pa-earth: #3a3226; --pa-bg: #14160f; --pa-slime: #bfd0a2;";

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
