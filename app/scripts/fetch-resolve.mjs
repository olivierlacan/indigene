// Download RESOLVE Ecoregions 2017 and turn it into GeoJSON we can use.
//
//   npm run resolve:fetch                  # download (once), extract, simplify
//   npm run resolve:fetch -- --tolerance 0.01   # coarser (degrees; default 0.005)
//
// RESOLVE (Dinerstein et al., BioScience 2017; CC BY 4.0) is the one ecoregion
// map that covers the whole world: 846 ecoregions, the successor to WWF's
// Terrestrial Ecoregions. `site.ts` asks Esri's hosted copy one point at a time,
// which is all the app needs. The build needs more — whole shapes, to draw a
// region's map and to find which ecoregions a new region's box touches — and
// asking the live layer for those is slow and ties every build to a service.
//
// So this fetches the publisher's own shapefile once (a 149 MB zip) and writes:
//
//   data/sources/resolve-ecoregions/Ecoregions2017.zip       raw, git-ignored
//   data/sources/resolve-ecoregions/ecoregions-2017.geojson  simplified, git-ignored
//   data/sources/resolve-ecoregions/index.json               committed
//
// The GeoJSON is simplified (Douglas–Peucker at ~500 m, coordinates to 4
// decimals) — far finer than any map we draw, a small fraction of the original.
// `index.json` is one line per ecoregion — id, name, biome, realm and bounding
// box — so a region file's ECO_IDs can be read and reviewed without the shapes.
//
// No dependencies, like `build-host-counts.mjs`: the zip is read with Node's own
// zlib, and the shapefile and its attribute table are simple enough formats to
// parse by hand. It throws rather than guessing on anything it doesn't expect.
import { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { inflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("resolve:fetch");

export const RESOLVE_ZIP_URL = "https://storage.googleapis.com/teow2016/Ecoregions2017.zip";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = join(REPO_ROOT, "data", "sources", "resolve-ecoregions");
const ZIP = join(DIR, "Ecoregions2017.zip");
const OUT_GEOJSON = join(DIR, "ecoregions-2017.geojson");
const OUT_INDEX = join(DIR, "index.json");

const argOf = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const TOLERANCE = Number(argOf("tolerance", "0.005"));
const round = (n) => Math.round(n * 1e4) / 1e4;

// ---------------------------------------------------------------- fetch ----

async function download() {
  mkdirSync(DIR, { recursive: true });
  if (existsSync(ZIP) && statSync(ZIP).size > 100e6) {
    console.log(`using ${ZIP} (${(statSync(ZIP).size / 1e6).toFixed(0)} MB)`);
    return;
  }
  console.log(`downloading ${RESOLVE_ZIP_URL} …`);
  const res = await fetch(RESOLVE_ZIP_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${RESOLVE_ZIP_URL}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(ZIP));
  console.log(`saved ${(statSync(ZIP).size / 1e6).toFixed(0)} MB`);
}

// ------------------------------------------------------------------ zip ----

/** Every file in a zip buffer, by name → a function that inflates it. */
function zipEntries(buf) {
  let end = buf.length - 22;
  while (end >= 0 && buf.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error("not a zip file (no end-of-central-directory record)");
  let pos = buf.readUInt32LE(end + 16);
  const count = buf.readUInt16LE(end + 10);
  const out = new Map();
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) throw new Error("corrupt zip central directory");
    const method = buf.readUInt16LE(pos + 10);
    const size = buf.readUInt32LE(pos + 20);
    const nameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);
    const localPos = buf.readUInt32LE(pos + 42);
    const name = buf.toString("utf8", pos + 46, pos + 46 + nameLen);
    out.set(name, () => {
      const start = localPos + 30 + buf.readUInt16LE(localPos + 26) + buf.readUInt16LE(localPos + 28);
      const data = buf.subarray(start, start + size);
      if (method === 0) return data;
      if (method === 8) return inflateRawSync(data);
      throw new Error(`unsupported zip compression method ${method} for ${name}`);
    });
    pos += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

function entry(entries, ext) {
  const name = [...entries.keys()].find((n) => n.toLowerCase().endsWith(ext) && !n.startsWith("__MACOSX"));
  if (!name) throw new Error(`no ${ext} in the zip (found: ${[...entries.keys()].join(", ")})`);
  return entries.get(name)();
}

// ------------------------------------------------------------------ dbf ----

/** dBASE III attribute table → array of plain objects, trimmed strings/numbers. */
function readDbf(buf) {
  const count = buf.readUInt32LE(4);
  const headerLen = buf.readUInt16LE(8);
  const recordLen = buf.readUInt16LE(10);
  const fields = [];
  for (let p = 32; buf[p] !== 0x0d; p += 32) {
    fields.push({
      name: buf.toString("latin1", p, p + 11).replace(/\0.*$/, ""),
      type: String.fromCharCode(buf[p + 11]),
      len: buf[p + 16],
    });
  }
  const rows = [];
  for (let r = 0; r < count; r++) {
    let p = headerLen + r * recordLen + 1; // skip the deletion flag
    const row = {};
    for (const f of fields) {
      // RESOLVE's names carry accents (Gran Chaco, Magellanic…); the file is UTF-8.
      const raw = buf.toString("utf8", p, p + f.len).trim();
      row[f.name] = f.type === "N" || f.type === "F" ? (raw === "" ? null : Number(raw)) : raw;
      p += f.len;
    }
    rows.push(row);
  }
  return rows;
}

// ------------------------------------------------------------------ shp ----

/** Polygon shapefile → one array of rings (each an array of [lon, lat]) per record. */
function readShp(buf) {
  if (buf.readInt32BE(0) !== 9994) throw new Error("not a shapefile");
  const shapes = [];
  let p = 100;
  while (p < buf.length) {
    const contentLen = buf.readInt32BE(p + 4) * 2;
    const c = p + 8;
    const type = buf.readInt32LE(c);
    if (type === 0) {
      shapes.push([]);
    } else if (type === 5 || type === 15 || type === 25) {
      const numParts = buf.readInt32LE(c + 36);
      const numPoints = buf.readInt32LE(c + 40);
      const partsAt = c + 44;
      const pointsAt = partsAt + 4 * numParts;
      const rings = [];
      for (let i = 0; i < numParts; i++) {
        const from = buf.readInt32LE(partsAt + 4 * i);
        const to = i + 1 < numParts ? buf.readInt32LE(partsAt + 4 * (i + 1)) : numPoints;
        const ring = [];
        for (let k = from; k < to; k++) {
          ring.push([buf.readDoubleLE(pointsAt + 16 * k), buf.readDoubleLE(pointsAt + 16 * k + 8)]);
        }
        rings.push(ring);
      }
      shapes.push(rings);
    } else {
      throw new Error(`unexpected shape type ${type} (want polygons)`);
    }
    p = c + contentLen;
  }
  return shapes;
}

// ------------------------------------------------------------- geometry ----

/** Douglas–Peucker, iterative. Keeps the ring closed. */
function simplify(ring, tol) {
  if (ring.length <= 4) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  const t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = ring[a];
    const [bx, by] = ring[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let worst = -1;
    let at = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = ring[i];
      let d2;
      if (len2 === 0) d2 = (px - ax) ** 2 + (py - ay) ** 2;
      else {
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
        d2 = (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2;
      }
      if (d2 > worst) { worst = d2; at = i; }
    }
    if (worst > t2) {
      keep[at] = 1;
      stack.push([a, at], [at, b]);
    }
  }
  return ring.filter((_, i) => keep[i]);
}

/** Shoelace; shapefile outer rings run clockwise (negative here), holes counter-clockwise. */
const signedArea = (ring) => {
  let s = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) s += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  return s / 2;
};

/** Rings → GeoJSON MultiPolygon coordinates: each clockwise ring starts a
 *  polygon, and the counter-clockwise rings after it are its holes (the order
 *  shapefiles are written in). Rings that simplify away are dropped. */
function toMultiPolygon(rings) {
  const polys = [];
  for (const raw of rings) {
    const ring = simplify(raw, TOLERANCE).map(([x, y]) => [round(x), round(y)]);
    if (ring.length < 4) continue;
    const outer = signedArea(ring) > 0; // clockwise in lon/lat, by this formula's sign
    if (outer || !polys.length) polys.push([ring]);
    else polys[polys.length - 1].push(ring);
  }
  return polys;
}

function bboxOf(polys) {
  let [w, s, e, n] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of polys) for (const [x, y] of poly[0]) {
    if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y;
  }
  return [round(w), round(s), round(e), round(n)];
}

// ----------------------------------------------------------------- main ----

await download();
const entries = zipEntries(readFileSync(ZIP));
console.log("reading the attribute table and shapes …");
const rows = readDbf(entry(entries, ".dbf"));
const shapes = readShp(entry(entries, ".shp"));
if (rows.length !== shapes.length) throw new Error(`dbf has ${rows.length} rows but shp ${shapes.length} shapes`);
for (const f of ["ECO_ID", "ECO_NAME", "BIOME_NAME", "REALM"]) {
  if (!(f in rows[0])) throw new Error(`attribute table lacks ${f} (has ${Object.keys(rows[0]).join(", ")})`);
}

const features = [];
const index = [];
let rawPoints = 0;
let keptPoints = 0;
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  rawPoints += shapes[i].reduce((a, ring) => a + ring.length, 0);
  const polys = toMultiPolygon(shapes[i]);
  if (!polys.length) continue;
  keptPoints += polys.flat().reduce((a, ring) => a + ring.length, 0);
  const props = { ECO_ID: r.ECO_ID, ECO_NAME: r.ECO_NAME, BIOME_NAME: r.BIOME_NAME, REALM: r.REALM };
  features.push({ type: "Feature", properties: props, geometry: { type: "MultiPolygon", coordinates: polys } });
  index.push({ id: r.ECO_ID, name: r.ECO_NAME, biome: r.BIOME_NAME, realm: r.REALM, bbox: bboxOf(polys) });
}
index.sort((a, b) => a.id - b.id);

writeFileSync(OUT_GEOJSON, JSON.stringify({ type: "FeatureCollection", features }));
writeFileSync(
  OUT_INDEX,
  JSON.stringify({
    source: "RESOLVE Ecoregions 2017 (Dinerstein et al. 2017, BioScience 67:534), CC BY 4.0",
    url: RESOLVE_ZIP_URL,
    note: "bbox is [west, south, east, north] of the simplified shape. ECO_ID 0 is the dataset's Rock and Ice filler.",
    ecoregions: index,
  }, null, 0).replace(/\{"id"/g, '\n  {"id"') + "\n",
);
console.log(
  `${features.length} ecoregions · ${rawPoints.toLocaleString()} → ${keptPoints.toLocaleString()} points at ${TOLERANCE}°\n` +
    `wrote ${OUT_GEOJSON} (${(statSync(OUT_GEOJSON).size / 1e6).toFixed(1)} MB)\n` +
    `wrote ${OUT_INDEX} (${(statSync(OUT_INDEX).size / 1e3).toFixed(0)} KB)`,
);
