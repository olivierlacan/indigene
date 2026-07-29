// Generates the PWA icon set *and* the favicons with no image dependencies: we
// render a simple "sprout" mark into a raw RGBA buffer and hand-encode a PNG
// (zlib is built in), then pack the small sizes into an .ico.
// Run: node scripts/gen-icons.mjs
//
// The mark is the same at every size, but not at the same proportions. A
// rounded-square plate that reads as an app icon at 192px spends a fifth of a
// 16px favicon on empty corners, so the small sizes tighten the radius and
// scale the sprout up to fill the room that buys back. See SIZES below.
//
// `favicon.svg` is written by hand next to this script's output (public/) and
// draws the same geometry as vectors — it's what modern browsers actually use;
// the .ico is the fallback for the ones that only ever ask for /favicon.ico.
// If you change the mark here, change the SVG to match and re-check them
// side by side.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const outDir = join(publicDir, "icons");
mkdirSync(outDir, { recursive: true });

const BRAND = [31, 107, 59]; // #1f6b3b
const LEAF = [167, 224, 181]; // #a7e0b5
const STEM = [122, 194, 140];

function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// Signed-distance helpers, all in a normalized 0..1 space.
function ellipseDist(px, py, cx, cy, rx, ry, rot) {
  const dx = px - cx, dy = py - cy;
  const c = Math.cos(rot), s = Math.sin(rot);
  const x = (dx * c + dy * s) / rx;
  const y = (-dx * s + dy * c) / ry;
  return Math.hypot(x, y) - 1;
}

function render(size, { padding = 0, radius = 0.22, scale = 1 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const inset = padding * size;
  const r = size * radius; // corner radius for the rounded-square plate
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Normalized coordinates inside the (optionally padded) plate, then
      // zoomed about the centre so the mark can fill a tighter plate.
      const nx = 0.5 + ((x - inset) / (size - 2 * inset) - 0.5) / scale;
      const ny = 0.5 + ((y - inset) / (size - 2 * inset) - 0.5) / scale;

      // Rounded-square plate mask with anti-aliasing.
      const plate = roundedRectAlpha(x, y, inset, inset, size - inset, size - inset, r);
      if (plate <= 0) {
        buf[i + 3] = 0;
        continue;
      }

      let col = BRAND;

      // Stem.
      const stem = Math.abs(nx - 0.5) < 0.03 && ny > 0.42 && ny < 0.82;
      // Two leaves as rotated ellipses.
      const leafL = ellipseDist(nx, ny, 0.36, 0.44, 0.17, 0.085, -0.7);
      const leafR = ellipseDist(nx, ny, 0.64, 0.44, 0.17, 0.085, 0.7);

      if (stem) col = STEM;
      if (leafL < 0 || leafR < 0) col = LEAF;

      // Soft edge on leaves.
      const edge = Math.min(leafL, leafR);
      if (edge >= 0 && edge < 0.02) col = mix(col === LEAF ? LEAF : BRAND, LEAF, 1 - edge / 0.02);

      const a = Math.round(255 * plate);
      buf[i] = col[0];
      buf[i + 1] = col[1];
      buf[i + 2] = col[2];
      buf[i + 3] = a;
    }
  }
  return buf;
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
// it. Tighter corners and a 1.18× sprout keep it legible rather than pretty.
const SMALL = { radius: 0.16, scale: 1.18 };
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
