// Generates the PWA icon set, the favicons *and* the vector copies of the mark,
// with no image dependencies: we render the "seedling" mark into a raw RGBA
// buffer and hand-encode a PNG (zlib is built in), then pack the small sizes
// into an .ico.
// Run: node scripts/gen-icons.mjs
//
// The mark is the same at every size, but not at the same proportions. A
// rounded-square plate that reads as an app icon at 192px spends a fifth of a
// 16px favicon on empty corners, so the small sizes tighten the radius and
// scale the seedling up to fill the room that buys back. See SMALL below.
//
// This script is the *only* place the mark's geometry lives. It rasterises the
// icons from MARK below, and writes the same numbers out as vectors to
// `public/favicon.svg` (what modern browsers actually use, and what
// scripts/gen-og-image.mjs inlines into the share card) and into the block
// between the `mark:` markers in `public/404.html`. The .ico is the fallback
// for browsers that only ever ask for /favicon.ico. Change MARK, re-run, and
// every copy moves together — there is nothing to keep in sync by hand.
import { deflateSync } from "node:zlib";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const outDir = join(publicDir, "icons");
mkdirSync(outDir, { recursive: true });

const BRAND = [31, 107, 59]; // #1f6b3b
const LEAF = [167, 224, 181]; // #a7e0b5
const STEM = [122, 194, 140]; // #7ac28c
const hex = (c) => "#" + c.map((n) => n.toString(16).padStart(2, "0")).join("");

// --- The mark ---------------------------------------------------------------
// A seedling: two leaves on a curved stem, drawn in the 0..100 box that is also
// favicon.svg's viewBox. Three things do the work of making it read as a plant
// rather than an ornament — the leaves come to a point, they meet the stem at
// different heights, and each one curves. An earlier version had two identical
// round-tipped ellipses stuck symmetrically on a straight bar, and symmetry at
// that scale reads as anatomy, not botany.
const MARK = {
  // A cubic Bézier, stroked with round caps: the stem leans and straightens
  // the way a seedling's does.
  stem: { p: [[50, 86], [50, 74], [47, 66], [50, 56]], width: 6.5 },
  // Each leaf is the lens where two circular arcs from base to tip overlap.
  // `w1` is how far the arc bulges to one side of the base→tip line and `w2`
  // how far to the other; making them unequal is what curves the leaf instead
  // of leaving it a symmetrical almond.
  leaves: [
    { base: [50, 56], tip: [76, 27], w1: 11, w2: 4.5 }, // upper, sweeping right
    { base: [50, 65], tip: [23, 41], w1: 4.5, w2: 10.5 }, // lower, sweeping left
  ],
};

// The two arcs of a leaf, as circles. `w1` bulges toward +n and `w2` toward -n,
// where n is base→tip turned a quarter turn clockwise on screen (y grows down).
// A chord of length L with sagitta w sits on a circle of radius
// (L²/4 + w²) / 2w, whose centre is w - R away from the chord's midpoint.
function leafCircles({ base, tip, w1, w2 }) {
  const dx = tip[0] - base[0], dy = tip[1] - base[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const mx = (base[0] + tip[0]) / 2, my = (base[1] + tip[1]) / 2;
  return [w1, w2].map((w, i) => {
    const side = i === 0 ? 1 : -1;
    const R = (len * len / 4 + w * w) / (2 * w);
    return { cx: mx - side * (R - w) * nx, cy: my - side * (R - w) * ny, R, w, len };
  });
}

// Signed-distance helpers, all in the normalized 0..1 space the rasteriser
// works in — hence the /100 on every coordinate out of MARK.
//
// A leaf is the intersection of its two discs, so the larger of the two
// disc distances is negative exactly inside the leaf and grows as you leave it.
function leafDist(px, py, circles) {
  let d = -Infinity;
  for (const { cx, cy, R } of circles) {
    d = Math.max(d, Math.hypot(px - cx / 100, py - cy / 100) - R / 100);
  }
  return d;
}

// Distance to the stem: the Bézier is flattened to a polyline once, then it is
// just point-to-segment. Round caps and joins fall out of that for free.
function bezierPoints([p0, p1, p2, p3], steps = 64) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    pts.push([
      (a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0]) / 100,
      (a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]) / 100,
    ]);
  }
  return pts;
}

function polylineDist(px, py, pts) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const vx = bx - ax, vy = by - ay;
    const t = Math.min(1, Math.max(0, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
    best = Math.min(best, Math.hypot(px - ax - t * vx, py - ay - t * vy));
  }
  return best;
}

const STEM_PTS = bezierPoints(MARK.stem.p);
const LEAF_CIRCLES = MARK.leaves.map(leafCircles);

function render(size, { padding = 0, radius = 0.22, scale = 1 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const inset = padding * size;
  const r = size * radius; // corner radius for the rounded-square plate
  // One device pixel, in the normalized space — the width of the edge ramp, so
  // the mark is anti-aliased by the same amount however small the icon is.
  const ramp = 1 / ((size - 2 * inset) * scale);
  const cover = (d) => Math.min(1, Math.max(0, 0.5 - d / ramp));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Normalized coordinates inside the (optionally padded) plate, then
      // zoomed about the centre so the mark can fill a tighter plate. The +0.5
      // samples the centre of the pixel rather than its top-left corner.
      const nx = 0.5 + ((x + 0.5 - inset) / (size - 2 * inset) - 0.5) / scale;
      const ny = 0.5 + ((y + 0.5 - inset) / (size - 2 * inset) - 0.5) / scale;

      // Rounded-square plate mask with anti-aliasing.
      const plate = roundedRectAlpha(x, y, inset, inset, size - inset, size - inset, r);
      if (plate <= 0) {
        buf[i + 3] = 0;
        continue;
      }

      // Paint back to front: plate, then stem, then the leaves over its top.
      // A stroke of width w is everything within w/2 of the centreline — and
      // /200 rather than /100 because the half-width is in MARK's 0..100 box.
      const stem = polylineDist(nx, ny, STEM_PTS) - MARK.stem.width / 200;
      const leaves = Math.min(...LEAF_CIRCLES.map((c) => leafDist(nx, ny, c)));
      let col = mix(BRAND, STEM, cover(stem));
      col = mix(col, LEAF, cover(leaves));

      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = Math.round(255 * plate);
    }
  }
  return buf;
}

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function roundedRectAlpha(x, y, x0, y0, x1, y1, r) {
  // Coverage 0..1 for a rounded rectangle.
  //
  // `cx`/`cy` clamp the point into the inner rectangle, so for anything that
  // isn't in a corner they land on the point itself and the distance is 0 —
  // which is why the straight edges fall out of the `d <= r - 1` case for
  // free. Only corner pixels get a non-zero distance, measured from that
  // corner's arc centre.
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  const inside = x >= x0 && x <= x1 && y >= y0 && y <= y1;
  if (!inside) return 0;
  const dx = x - cx, dy = y - cy;
  const d = Math.hypot(dx, dy);
  if (d <= r - 1) return 1;
  // Beyond the arc: outside the plate. This used to return 1 as "interior
  // straight edges" — but those never reach here (see above), so the only
  // pixels it caught were the corners it was supposed to cut, and the plate
  // rendered square with a faint ghost arc where the ramp below ran.
  if (d >= r + 1) return 0;
  return Math.max(0, Math.min(1, (r - d + 1) / 2)); // 2px anti-aliased ramp
}

// --- PNG encoding ---
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}
function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // no filter
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- ICO packing ---
// An .ico is a tiny directory followed by its images. Since Vista those images
// may be PNGs verbatim, which is what every browser that still asks for
// /favicon.ico supports — so this is a header plus the PNGs we already encode.
function encodeIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, png } of images) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size; // 0 means 256
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0; // palette size (0 = not paletted)
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += png.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

// The PWA icons: the full plate, generous corners, mark at its designed size.
for (const [name, size, opts] of [
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["icon-maskable-512.png", 512, { padding: 0.14 }],
  ["apple-touch-icon.png", 180, {}],
]) {
  const png = encodePng(size, render(size, opts));
  writeFileSync(join(outDir, name), png);
  console.log("wrote", `icons/${name}`, png.length, "bytes");
}

// The favicons: a tab strip is 16 CSS pixels tall and the mark has to survive
// it. Tighter corners and a 1.12× seedling keep it legible rather than pretty.
// 1.12 is as far as the zoom goes before the stem's round cap — the lowest
// point of the mark, at y=89 of 100 — starts grazing the bottom of the plate.
const SMALL = { radius: 0.16, scale: 1.12 };
const icoImages = [];
for (const size of [16, 32, 48]) {
  const png = encodePng(size, render(size, SMALL));
  writeFileSync(join(outDir, `favicon-${size}.png`), png);
  icoImages.push({ size, png });
  console.log("wrote", `icons/favicon-${size}.png`, png.length, "bytes");
}

// Browsers that never read our <link> tags still request /favicon.ico from the
// site root, so it lives there rather than under icons/.
const ico = encodeIco(icoImages);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log("wrote", "favicon.ico", ico.length, "bytes");

// --- The same mark, as vectors ----------------------------------------------
// A leaf's outline is its two arcs, base → tip and back again. The sweep flag
// says which way round the circle to travel: the arc we want is the one that
// passes through the bulge, and the sign of the cross product of the two
// endpoints about the centre tells us whether that is the increasing-angle
// direction. Coming back along the second arc reverses it. The arc only
// exceeds a half-circle if the leaf is fatter than it is long, which none of
// ours are, but the flag is computed rather than assumed.
function leafSvgPath(leaf) {
  const [a1, a2] = leafCircles(leaf);
  const { base, tip } = leaf;
  const flags = ({ cx, cy, R, w, len }) => ({
    r: R.toFixed(2),
    sweep: (base[0] - cx) * (tip[1] - cy) - (base[1] - cy) * (tip[0] - cx) > 0 ? 1 : 0,
    large: w > len / 2 ? 1 : 0,
  });
  const f1 = flags(a1), f2 = flags(a2);
  return (
    `M ${base[0]} ${base[1]}` +
    ` A ${f1.r} ${f1.r} 0 ${f1.large} ${f1.sweep} ${tip[0]} ${tip[1]}` +
    ` A ${f2.r} ${f2.r} 0 ${f2.large} ${1 - f2.sweep} ${base[0]} ${base[1]} Z`
  );
}

const stemD = `M ${MARK.stem.p[0].join(" ")} C ${MARK.stem.p.slice(1).map((q) => q.join(" ")).join(", ")}`;
const markBody = [
  `<rect width="100" height="100" rx="22" fill="${hex(BRAND)}" />`,
  `<path d="${stemD}" fill="none" stroke="${hex(STEM)}" stroke-width="${MARK.stem.width}" stroke-linecap="round" />`,
  ...MARK.leaves.map((l) => `<path d="${leafSvgPath(l)}" fill="${hex(LEAF)}" />`),
];

const svg = `<!--
  Generated by scripts/gen-icons.mjs from the MARK geometry there — the same
  seedling as the PWA icons, as vectors. Don't edit this by hand: re-run the
  script. This is the favicon modern browsers pick when it's offered, and the
  mark scripts/gen-og-image.mjs inlines into the social share card.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Indigene">
${markBody.map((line) => "  " + line).join("\n")}
</svg>
`;
writeFileSync(join(publicDir, "favicon.svg"), svg);
console.log("wrote", "favicon.svg", svg.length, "bytes");

// The 404 page is a standalone document that can't import anything, so it
// carries its own copy of the mark between these markers.
const notFoundPath = join(publicDir, "404.html");
const notFound = readFileSync(notFoundPath, "utf8");
const markers = /(<!-- mark:start -->)[\s\S]*?(<!-- mark:end -->)/;
if (!markers.test(notFound)) {
  throw new Error("404.html is missing its <!-- mark:start --> / <!-- mark:end --> markers");
}
const inline =
  `$1\n      <svg class="mark" viewBox="0 0 100 100" role="img" aria-label="Indigene">\n` +
  markBody.map((line) => "        " + line).join("\n") +
  `\n      </svg>\n      $2`;
writeFileSync(notFoundPath, notFound.replace(markers, inline));
console.log("wrote", "404.html (mark block)");
