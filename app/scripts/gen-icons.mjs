// Generates the PWA icon set with no image dependencies: we render a simple
// "sprout" mark into a raw RGBA buffer and hand-encode a PNG (zlib is built in).
// Run: node scripts/gen-icons.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
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

function render(size, { padding = 0 } = {}) {
  const buf = Buffer.alloc(size * size * 4);
  const inset = padding * size;
  const r = size * 0.22; // corner radius for the rounded-square plate
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // Normalized coordinates inside the (optionally padded) plate.
      const nx = (x - inset) / (size - 2 * inset);
      const ny = (y - inset) / (size - 2 * inset);

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
  // Distance to a rounded rectangle; returns coverage 0..1.
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  const inside = x >= x0 && x <= x1 && y >= y0 && y <= y1;
  if (!inside) return 0;
  const dx = x - cx, dy = y - cy;
  const d = Math.hypot(dx, dy);
  if (d <= r - 1) return 1;
  if (d >= r + 1) return 1; // interior straight edges
  return Math.max(0, Math.min(1, r - d + 1));
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

for (const [name, size, opts] of [
  ["icon-192.png", 192, {}],
  ["icon-512.png", 512, {}],
  ["icon-maskable-512.png", 512, { padding: 0.14 }],
  ["apple-touch-icon.png", 180, {}],
]) {
  const png = encodePng(size, render(size, opts));
  writeFileSync(join(outDir, name), png);
  console.log("wrote", name, png.length, "bytes");
}
