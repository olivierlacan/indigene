// Draws the seven plant-form glyphs and prints them as the table that
// `components/plant-card.ts` holds in `FORM_GLYPHS`. Run it, paste the output
// over that table:
//
//   node scripts/gen-form-glyphs.mjs
//
// The glyphs are a set, not seven separate drawings, so the rules that make
// them look like a set live here rather than in hand-tuned path strings:
//
//   - one 48x48 box, and inside it one optical box: x 7..41, y 7..40;
//   - every plant stands on the same ground line, y = 40;
//   - every glyph carries roughly the same amount of ink, so no chip in a row
//     of them looks bolder or fainter than its neighbours;
//   - masses are filled and stems are strokes, both at one weight — the old
//     set mixed solid shapes with 2-unit outlines, which is why a tree read as
//     a blob and a vine nearly vanished beside it;
//   - what distinguishes one form from another is its *shape*, not its size:
//     a tree is a crown on a bare trunk, a shrub a lobed dome with no trunk, a
//     groundcover a low fan wider than it is tall.
const r1 = (n) => Math.round(n * 10) / 10;
const P = (x, y) => `${r1(x)} ${r1(y)}`;
const rad = (d) => (d * Math.PI) / 180;

/** A closed lobed blob: `n` lobes, tips at `R`, valleys `depth` inside it.
 *  Reads as foliage rather than a circle, and degrades to a circle when the
 *  glyph is small enough that the lobes fall under a pixel. */
function scallop(cx, cy, R, depth, n, start = -90) {
  const pt = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const step = 360 / n;
  const tips = [], vals = [];
  for (let i = 0; i < n; i++) {
    tips.push(pt(R, start + i * step));
    vals.push(pt(R - depth, start + step / 2 + i * step));
  }
  let d = "M" + P(...vals[n - 1]);
  for (let i = 0; i < n; i++) {
    const a = vals[(i + n - 1) % n], b = vals[i], t = tips[i];
    // Pull the control point past the tip so the curve actually reaches it.
    const c = [2 * t[0] - (a[0] + b[0]) / 2, 2 * t[1] - (a[1] + b[1]) / 2];
    d += `Q${P(...c)} ${P(...b)}`;
  }
  return d + "Z";
}

/** A lobed dome: flat on the ground from x0 to x1, `n` lobes over the top. */
function dome(x0, x1, foot, top, depth, n) {
  const cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, ry = foot - top;
  const pt = (f, a) => [cx + rx * f * Math.cos(rad(a)), foot - ry * f * Math.sin(rad(a))];
  const tips = [], vals = [];
  for (let i = 0; i < n; i++) tips.push(pt(1, 180 - (i + 0.5) * (180 / n)));
  for (let i = 0; i <= n; i++) vals.push(pt(1 - depth / ry, 180 - i * (180 / n)));
  vals[0] = [x0, foot];
  vals[n] = [x1, foot];
  let d = "M" + P(x0, foot);
  for (let i = 0; i < n; i++) {
    const a = vals[i], b = vals[i + 1], t = tips[i];
    const c = [2 * t[0] - (a[0] + b[0]) / 2, 2 * t[1] - (a[1] + b[1]) / 2];
    d += `Q${P(...c)} ${P(...b)}`;
  }
  return d + "Z";
}

/** A leaf: rooted at (bx,by), pointing at `a` degrees (-90 is straight up),
 *  `len` long and `wid` across, coming to a point at the tip. */
function leaf(bx, by, a, len, wid) {
  const ux = Math.cos(rad(a)), uy = Math.sin(rad(a));
  const px = -uy, py = ux;
  const at = (along, across) => [bx + ux * len * along + px * across, by + uy * len * along + py * across];
  return `M${P(bx, by)}C${P(...at(0.25, wid))} ${P(...at(0.8, wid * 0.75))} ${P(...at(1, 0))}` +
    `C${P(...at(0.8, -wid * 0.75))} ${P(...at(0.25, -wid))} ${P(bx, by)}Z`;
}

/** A blade of grass: broad at the foot, curving to a point at the tip. */
function blade(bx, foot, tipx, tipy, w, bow = 0) {
  const mx = (bx + tipx) / 2 + bow, my = (foot + tipy) / 2;
  return `M${P(bx - w / 2, foot)}Q${P(mx - w * 0.35, my)} ${P(tipx, tipy)}Q${P(mx + w * 0.9, my)} ${P(bx + w / 2, foot)}Z`;
}

/** `stem: true` marks a part drawn as a stroke at the set's stem weight;
 *  everything else is a filled mass. */
const S = (d) => ({ d, stem: true });
const F = (d) => ({ d });

const GLYPHS = {
  // A lobed crown clear of the ground on a bare trunk.
  tree: [F(scallop(24, 19.4, 12.4, 2.3, 8)), S("M24 30.5v9.5")],
  // The same foliage, but sitting on the ground and wider than it is tall.
  shrub: [F(dome(8, 40, 40, 15, 4, 4))],
  // A five-petalled flower on a stem, with one leaf low down.
  perennial: [
    S("M24 25v15"),
    ...[0, 1, 2, 3, 4].map((i) => F(leaf(24, 17, -90 + i * 72, 10.2, 4))),
    F("M24 13.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 1 0 0-7.6Z"),
    F(leaf(23.5, 34, 196, 10, 3.4)),
  ],
  // A tuft: four blades splaying out of one point on the ground.
  grass: [
    F(blade(24, 40, 21, 9, 5, -1)),
    F(blade(24, 40, 32, 13, 4.6, 2)),
    F(blade(20, 40, 9, 18, 4.2, -2)),
    F(blade(28, 40, 39, 17, 4.2, 2)),
  ],
  // A shoot with two leaves, ending in the curled tendril that a climber
  // reaches for its support with — the one mark nothing else in the set has.
  vine: [
    S("M24 40V16.5c0-3.8 3.6-5.9 6-3.8 2.4 2 .8 5.6-2 4.4"),
    F(leaf(24, 35, -150, 14, 4.4)),
    F(leaf(24, 26, -30, 14, 4.4)),
  ],
  // A fan that hugs the ground and spreads sideways: no upright stem at all.
  groundcover: [
    F(leaf(24, 38, -163, 17, 4.2)),
    F(leaf(24, 38, -17, 17, 4.2)),
    F(leaf(24, 38, -125, 13, 4)),
    F(leaf(24, 38, -55, 13, 4)),
  ],
  // A frond: paired leaflets up a midrib, shortening toward the tip.
  fern: [
    S("M24 40V11"),
    ...[[34, 196, 13, 3.8], [26, 199, 11, 3.4], [19, 202, 8.5, 3], [13, 205, 6, 2.4]].flatMap(
      ([y, a, len, wid]) => [F(leaf(24, y, a, len, wid)), F(leaf(24, y, -180 - a, len, wid))]
    ),
  ],
};

const line = (part) => `    ${part.stem ? "S" : "F"}("${part.d}"),`;
console.log("const FORM_GLYPHS: Record<string, Mark[]> = {");
for (const [form, parts] of Object.entries(GLYPHS)) {
  console.log(`  ${form}: [`);
  for (const part of parts) console.log(line(part));
  console.log("  ],");
}
console.log("};");
