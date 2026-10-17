// Write the border data that keeps a region's plants on its own side of a
// border: for each region whose box takes in another country's land, that land
// and the region's own, simplified, as `src/data/region-borders.ts`.
//
//   node scripts/build-region-borders.mjs        (npm run borders:build)
//   node scripts/build-region-borders.mjs --check
//
// `regionsForCoords` (`src/data/regions.ts`) asks `lib/borders.ts` whether a
// spot is on foreign land before it offers a region. Brighton is inside
// Atlantic France's box and inside the EEA's Atlantic zone, and is not France.
//
// Most regions' boxes hold no one else's land — a box over Texas is all Texas —
// and get no entry at all, so they cost nothing. The rest carry both sides:
// a spot on land is whichever country's land it is on, and a spot in the gap
// between Natural Earth's coastline and the real one (a pin on Brighton beach)
// goes to the nearer coast, the same rule the region maps draw by.
//
// Natural Earth 1:10m, public domain; fetched here only (13 MB). Not the 1:50m
// the region maps draw with: at 1:50m the French–Italian border runs west of
// Menton, which put the town in Italy. A drawing can be that coarse; a match
// can't. Simplified to about 500 m along borders and 2 km along coasts.
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import polygonClipping from "polygon-clipping";
import { landIn, boxPolygon } from "./_borders.mjs";

requireProxyAwareFetch("borders:build");

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(APP_ROOT, "src", "data", "region-borders.ts");
const NE_COUNTRIES =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson";
/** Simplification, in degrees. A land border is where a short distance
 *  decides a town (Menton is 3 km from Italy), so it keeps detail to about
 *  500 m. A coast can be coarser, about 2 km: a spot in the slop between the
 *  drawn coast and the real one goes to the nearer coast anyway
 *  (`lib/borders.ts`). Together about 10 KB gzipped. */
const BORDER_TOLERANCE = 0.005;
const COAST_TOLERANCE = 0.02;
/** Degrees around foreign land within which a spot is checked at all, and so
 *  how much of the region's own land is kept to check it against. Must match
 *  NEAR in lib/borders.ts. */
const NEAR = 0.15;

/** Douglas–Peucker on one closed ring. */
function simplify(ring, tol) {
  if (ring.length <= 2) return ring;
  const keep = new Uint8Array(ring.length);
  keep[0] = keep[ring.length - 1] = 1;
  const stack = [[0, ring.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [x1, y1] = ring[a];
    const [x2, y2] = ring[b];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    let far = -1;
    let best = tol;
    for (let i = a + 1; i < b; i++) {
      const [x, y] = ring[i];
      const d = len ? Math.abs((x - x1) * dy - (y - y1) * dx) / len : Math.hypot(x - x1, y - y1);
      if (d > best) { best = d; far = i; }
    }
    if (far >= 0) {
      keep[far] = 1;
      stack.push([a, far], [far, b]);
    }
  }
  return ring.filter((_, i) => keep[i]);
}

/** Every vertex two countries share — Natural Earth draws a land border with
 *  the same points on both sides, so a shared vertex is a border vertex. */
function borderVertices(features) {
  const seen = new Map();
  for (const f of features) {
    const code = f.properties.ISO_A2_EH;
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const ring of poly) for (const [x, y] of ring) {
      const k = `${x},${y}`;
      const was = seen.get(k);
      seen.set(k, was === undefined ? code : was === code ? code : "*");
    }
  }
  const out = new Set();
  for (const [k, v] of seen) if (v === "*") out.add(k);
  return out;
}

/** One ring, simplified in runs: border runs finely, coast runs coarsely,
 *  each run keeping its two ends so the runs still meet. */
function simplifyRing(ring, border) {
  const isBorder = ring.map(([x, y]) => border.has(`${x},${y}`));
  const out = [];
  let start = 0;
  for (let i = 1; i <= ring.length; i++) {
    if (i === ring.length || isBorder[i] !== isBorder[start]) {
      const end = Math.min(i, ring.length - 1);
      const run = ring.slice(start, end + 1);
      const tol = isBorder[start] ? BORDER_TOLERANCE : COAST_TOLERANCE;
      const kept = simplify(run, tol);
      out.push(...(out.length ? kept.slice(1) : kept));
      start = end;
      if (end === ring.length - 1) break;
    }
  }
  return out;
}

/** MultiPolygon → flat list of rounded, simplified rings (even–odd inside). */
function rings(multi) {
  const out = [];
  for (const poly of multi) {
    for (const ring of poly) {
      const r = simplifyRing(ring, BORDER).map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);
      if (r.length >= 4) out.push(r.slice(0, -1)); // drop the repeated closing point
    }
  }
  return out;
}

const fmt = (rs) => `[${rs.map((r) => `[${r.map(([x, y]) => `${x},${y}`).join(",")}]`).join(",")}]`;

const check = process.argv.includes("--check");
const res = await fetch(NE_COUNTRIES, { headers: { "User-Agent": "indigene borders (+https://github.com/olivierlacan/indigene)" } });
if (!res.ok) throw new Error(`HTTP ${res.status} for Natural Earth countries`);
const features = (await res.json()).features;
const BORDER = borderVertices(features);

const loader = await openLoader();
let body;
try {
  const { REGIONS } = await loader.load("/src/data/regions.ts");
  const rows = [];
  for (const { meta } of REGIONS) {
    const { own, foreign } = landIn(meta, features);
    const f = rings(foreign);
    if (!f.length) continue;
    // The region's own land matters only near someone else's: far from any
    // foreign land a spot is simply kept. So only the own land within NEAR of
    // the foreign land is written — Chesapeake Bay's every inlet answers no
    // question about the Canadian border.
    const near = foreign.flatMap((poly) => {
      const xs = poly[0].map((p) => p[0]);
      const ys = poly[0].map((p) => p[1]);
      return polygonClipping.intersection(own, boxPolygon({
        minLon: Math.min(...xs), maxLon: Math.max(...xs), minLat: Math.min(...ys), maxLat: Math.max(...ys),
      }, NEAR));
    });
    const o = rings(near.length ? polygonClipping.union(...near.map((p) => [p])) : []);
    const points = [...o, ...f].reduce((n, r) => n + r.length, 0);
    console.log(`borders: ${meta.id} — ${f.length} foreign ring(s), ${points} points`);
    rows.push(`  "${meta.id}": {\n    own: ${fmt(o)},\n    foreign: ${fmt(f)},\n  },`);
  }
  body = `// GENERATED by scripts/build-region-borders.mjs — do not edit by hand.
// Regenerate (needs network, fetches Natural Earth): npm run borders:build
//
// For each region whose coverage box takes in another country's land: the
// other land inside its box, and the region's own land near it, as rings
// (even–odd) of flat [lon, lat, lon, lat, …] pairs, simplified to about a
// kilometre. Read by lib/borders.ts.
// Natural Earth 1:50m admin-0 countries, public domain.
export const REGION_BORDERS: Record<string, { own: number[][]; foreign: number[][] }> = {
${rows.join("\n")}
};
`;
} finally {
  await loader.close();
}

if (check) {
  const current = readFileSync(OUT, "utf8");
  if (current !== body) {
    console.error("borders: src/data/region-borders.ts is stale — run npm run borders:build");
    process.exit(1);
  }
  console.log("borders: up to date");
} else {
  writeFileSync(OUT, body);
  console.log(`borders: wrote ${(body.length / 1024).toFixed(1)} KB → src/data/region-borders.ts`);
}
