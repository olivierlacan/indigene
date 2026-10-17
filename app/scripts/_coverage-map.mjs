// The map page (`#/map`): every region at once, the answer to "do you cover
// me?" that used to take reading seventeen names (issue #254).
//
// Built by `build-region-maps.mjs` on a full run, from the same coverage shapes
// it draws each region with, so the two can't disagree.
//
// **The projection is Equal Earth**, the one the UN General Assembly endorsed in
// September 2026: every country at its true size, so Africa stops looking like
// Greenland. It is centred on 150°E, its authors' own Asia-Pacific variant,
// rather than on Greenwich — Europe is one place among several, not the middle
// of the world. The cut falls in the Atlantic, where no region is.
//
// At phone width the whole world is about 360 pixels across, and North America
// — ten of the regions — is fifty of them. No set of labels fits that. So the
// world map shows *where*, a glowing dot per region and no names, and each
// continent with a region in it gets a map of its own below, close enough
// that every region has room for its name.
//
// The names themselves are not in the pictures. They are HTML links laid over
// them (`components/coverage-map.ts`), so they translate, and each one opens its
// region. This module writes the pictures and the table of where each name goes
// (`src/data/coverage-map.ts`).
//
// Land: Natural Earth (public domain) — 1:110m for the world, 1:50m for the
// continents. Country borders are drawn, faintly, as a reference and nothing more.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { geoEqualEarth, geoPath } from "d3-geo";

const NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson";
const UA = "Mozilla/5.0 (indigene region maps; +https://github.com/olivierlacan/indigene)";

const WIDTH = 640;
/** Where the world is centred. See the header: the Pacific, not Greenwich. */
const CENTRE_LON = 150;

/** The map page's sections, one per continent with a region in it, each drawn
 *  close enough that every region has room for its name. A region belongs to
 *  the continent its box's centre falls in; a region in none fails the build. */
const CONTINENTS = [
  { id: "north-america", box: { minLon: -126, maxLon: -66, minLat: 24, maxLat: 50.5 } },
  // North to the Moray Firth, so the Scottish Lowlands sit inside the frame.
  { id: "europe", box: { minLon: -11, maxLon: 10.5, minLat: 41.2, maxLat: 57.8 } },
  { id: "asia", box: { minLon: 125, maxLon: 147, minLat: 31, maxLat: 41.5 } },
  // The North Island only: the region is its northern tip, and the whole of
  // New Zealand would be a tall picture of mostly somewhere else.
  { id: "oceania", box: { minLon: 166, maxLon: 182, minLat: -41.8, maxLat: -34 } },
];

/**
 * Where each region's name goes: the point its dot marks (inside the shading)
 * and which side of the dot the name sits on. Chosen by hand, like the cities
 * on each region's own map — a name goes where there is water or empty land to
 * hold it, and the longest of the French names was the one checked at 360 px.
 *
 * A region missing here fails the build: a dot with no name is a region nobody
 * can find.
 */
const LABELS = {
  pnw: { lon: -122.6, lat: 46.6, side: "right" },
  "ca-central-coast": { lon: -121.4, lat: 37.4, side: "left" },
  "ca-south-coast": { lon: -117.6, lat: 34.0, side: "left" },
  "central-texas": { lon: -97.6, lat: 31.0, side: "below" },
  chicago: { lon: -88.6, lat: 41.0, side: "left" },
  "north-michigan": { lon: -85.0, lat: 44.6, side: "above" },
  "st-lawrence": { lon: -73.4, lat: 45.7, side: "right" },
  "mid-atlantic": { lon: -76.6, lat: 40.0, side: "right" },
  "florida-central": { lon: -82.0, lat: 29.6, side: "right" },
  "florida-south": { lon: -80.9, lat: 26.2, side: "right" },
  ireland: { lon: -8.0, lat: 53.3, side: "left" },
  "scotland-lowlands": { lon: -3.8, lat: 55.7, side: "right" },
  "france-atlantic": { lon: -0.6, lat: 47.4, side: "left" },
  "france-continental": { lon: 4.6, lat: 48.2, side: "right" },
  "france-alpine": { lon: 6.4, lat: 45.3, side: "right" },
  "france-mediterranean": { lon: 4.2, lat: 43.7, side: "below" },
  kanto: { lon: 139.8, lat: 36.0, side: "right" },
  "nz-auckland": { lon: 174.6, lat: -36.6, side: "right" },
};

/** Same tokens as the region maps' stylesheet (`build-region-maps.mjs`), plus
 *  an ocean, since a world map without one is land floating on the page. Three
 *  greens, so regions that touch — the four Frances — read as four. */
const STYLE = `
  .sea { fill: #e9eef0; }
  .land { fill: #e6e2d5; stroke: #d3cdbd; stroke-width: 0.8; stroke-linejoin: round; }
  .glow { fill: #175e33; fill-opacity: 0.2; }
  .cover { fill: #175e33; fill-opacity: 0.55; fill-rule: evenodd; }
  .cover.t1 { fill-opacity: 0.4; }
  .cover.t2 { fill-opacity: 0.7; }
  .pin { fill: #14140f; stroke: #f7f5ef; stroke-width: 2.5; }
  @media (prefers-color-scheme: dark) {
    .sea { fill: #1b2025; }
    .land { fill: #2e3325; stroke: #3d4532; }
    .glow { fill: #7ec894; fill-opacity: 0.22; }
    .cover { fill: #7ec894; fill-opacity: 0.5; }
    .cover.t1 { fill-opacity: 0.36; }
    .cover.t2 { fill-opacity: 0.66; }
    .pin { fill: #f2f1e8; stroke: #14160f; }
  }`;

async function geojson(name) {
  const res = await fetch(`${NE}/${name}.geojson`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for Natural Earth ${name}`);
  return (await res.json()).features;
}

/** d3 reads a polygon's winding as which side is inside — on a sphere either
 *  side could be — and wants outer rings clockwise. GeoJSON writes them the
 *  other way round, and a country drawn inside-out is the whole planet minus
 *  that country. So every ring is rewound: outer clockwise, holes not. */
function rewind(feature) {
  const signed = (ring) => {
    let a = 0;
    for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    return a;
  };
  const fix = (rings) => rings.map((r, i) => ((signed(r) > 0) === (i === 0) ? [...r].reverse() : r));
  const g = feature.geometry;
  if (!g) return feature;
  const coordinates =
    g.type === "Polygon" ? fix(g.coordinates) :
    g.type === "MultiPolygon" ? g.coordinates.map(fix) : g.coordinates;
  return { ...feature, geometry: { ...g, coordinates } };
}

/** A path context that writes SVG `d` and skips any point within `step` user
 *  units of the last — at world scale most of a coastline's vertices land in
 *  the same pixel, and this is most of the file size. */
function pathWriter(step = 0.9) {
  let d = "";
  let last = null;
  let open = 0;
  const r = (n) => Math.round(n * 10) / 10;
  return {
    moveTo(x, y) { d += `M${r(x)} ${r(y)}`; last = [x, y]; open = 1; },
    lineTo(x, y) {
      if (Math.hypot(x - last[0], y - last[1]) < step) return;
      d += `L${r(x)} ${r(y)}`; last = [x, y]; open++;
    },
    closePath() { d += "Z"; },
    arc() {},
    result() { const out = d; d = ""; return out; },
  };
}

/** Coverage rings (plain lon/lat, already clipped to their region's box) are
 *  projected point by point rather than handed to d3 as polygons: they're
 *  small, nowhere near the cut, and this way their winding can't matter. */
function coverPath(rings, project, minSize) {
  const w = pathWriter();
  for (const ring of rings) {
    const pts = ring.map(project);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    if (Math.max(...xs) - Math.min(...xs) < minSize && Math.max(...ys) - Math.min(...ys) < minSize) continue;
    w.moveTo(...pts[0]);
    for (const p of pts.slice(1)) w.lineTo(...p);
    w.closePath();
  }
  return w.result();
}

/** Three tones, given out so no two regions whose boxes touch share one. */
function tones(regions) {
  const near = (a, b) =>
    a.minLon <= b.maxLon + 0.3 && b.minLon <= a.maxLon + 0.3 &&
    a.minLat <= b.maxLat + 0.3 && b.minLat <= a.maxLat + 0.3;
  const out = {};
  for (const r of regions) {
    const used = new Set(regions.filter((o) => o.id in out && near(o.bounds, r.bounds)).map((o) => out[o.id]));
    out[r.id] = [0, 1, 2].find((t) => !used.has(t)) ?? 0;
  }
  return out;
}

const pct = (n, of) => Math.round((n / of) * 10000) / 100;

function svg({ w, h, title, layers }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
<title>${title}</title>
<desc>Equal Earth projection. Land: Natural Earth (public domain). Coverage: each region's own map.</desc>
<style>${STYLE}
</style>
${layers.filter(Boolean).join("\n")}
</svg>
`;
}

/**
 * @param {{ id: string, bounds: object, cover: number[][][] }[]} regions
 * @param {string} outDir  public/maps
 * @param {string} dataFile  src/data/coverage-map.ts
 */
export async function buildCoverageMaps(regions, outDir, dataFile) {
  for (const r of regions) {
    const lon = (r.bounds.minLon + r.bounds.maxLon) / 2;
    const lat = (r.bounds.minLat + r.bounds.maxLat) / 2;
    const { box: b } = CONTINENTS.find(({ box }) => lon >= box.minLon && lon <= box.maxLon && lat >= box.minLat && lat <= box.maxLat) ?? { box: null };
    if (!b) {
      throw new Error(`${r.id}: no continent on the map covers it — add one to CONTINENTS in scripts/_coverage-map.mjs.`);
    }
    if (!LABELS[r.id]) {
      throw new Error(`${r.id}: the coverage map needs a place for its name — add it to LABELS in scripts/_coverage-map.mjs.`);
    }
  }
  const tone = tones(regions.map((r) => ({ id: r.id, bounds: r.bounds })));
  const continentOf = (r) => {
    const lon = (r.bounds.minLon + r.bounds.maxLon) / 2;
    const lat = (r.bounds.minLat + r.bounds.maxLat) / 2;
    return CONTINENTS.find(({ box }) => lon >= box.minLon && lon <= box.maxLon && lat >= box.minLat && lat <= box.maxLat)?.id ?? null;
  };
  const [world110, world50] = await Promise.all([
    geojson("ne_110m_admin_0_countries"),
    geojson("ne_50m_admin_0_countries"),
  ]);
  const table = {};
  const sizes = [];

  // ---- the world ----
  {
    const sphere = { type: "Sphere" };
    const proj = geoEqualEarth().rotate([-CENTRE_LON, 0]).fitWidth(WIDTH, sphere);
    const [[, y0], [, y1]] = geoPath(proj).bounds(sphere);
    const h = Math.round(y1 - y0);
    proj.translate([proj.translate()[0], proj.translate()[1] - y0]);
    const ctx = pathWriter(0.9);
    const path = geoPath(proj, ctx);
    path(sphere);
    const sea = ctx.result();
    const land = world110.map(rewind).map((f) => (path(f), ctx.result())).join("");
    const glows = regions.map((r) => {
      const [x, y] = proj([LABELS[r.id].lon, LABELS[r.id].lat]);
      return `<circle class="glow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13"/>`;
    });
    const covers = regions.map((r) =>
      `<path class="cover t${tone[r.id]}" d="${coverPath(r.cover, proj, 0.4)}"/>`);
    // Every region is named in its continent's section below, so the world
    // only shows where: a glow per region, no names.
    writeFileSync(join(outDir, "coverage-world.svg"), svg({
      w: WIDTH, h, title: "Where Indigene has plant lists",
      layers: [`<path class="sea" d="${sea}"/>`, `<path class="land" d="${land}"/>`, ...glows, ...covers],
    }));
    table.world = {
      w: WIDTH, h,
      labels: [],
    };
    sizes.push(["coverage-world", h]);
  }

  // ---- the continents ----
  for (const inset of CONTINENTS) {
    const { box } = inset;
    const mine = regions.filter((r) => continentOf(r) === inset.id);
    if (!mine.length) continue;
    // Centred on the inset's own middle, so its meridians barely lean.
    const corners = {
      type: "MultiPoint",
      coordinates: [
        [box.minLon, box.minLat], [box.maxLon, box.minLat],
        [box.minLon, box.maxLat], [box.maxLon, box.maxLat],
        [(box.minLon + box.maxLon) / 2, box.maxLat], [(box.minLon + box.maxLon) / 2, box.minLat],
      ],
    };
    const proj = geoEqualEarth().rotate([-(box.minLon + box.maxLon) / 2, 0]).fitWidth(WIDTH, corners);
    const [[, y0], [, y1]] = geoPath(proj).bounds(corners);
    const h = Math.round(y1 - y0);
    proj.translate([proj.translate()[0], proj.translate()[1] - y0]).clipExtent([[0, 0], [WIDTH, h]]);
    const ctx = pathWriter(0.7);
    const path = geoPath(proj, ctx);
    const land = world50.map(rewind).map((f) => (path(f), ctx.result())).join("");
    const covers = mine.map((r) => `<path class="cover t${tone[r.id]}" d="${coverPath(r.cover, proj, 0.6)}"/>`);
    const pins = mine.map((r) => {
      const [x, y] = proj([LABELS[r.id].lon, LABELS[r.id].lat]);
      // The glow keeps a small region (Kantō, a few pixels across) findable.
      return `<circle class="glow" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14"/>` +
        `<circle class="pin" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`;
    });
    writeFileSync(join(outDir, `coverage-${inset.id}.svg`), svg({
      w: WIDTH, h, title: "Where Indigene has plant lists",
      layers: [`<rect class="sea" width="${WIDTH}" height="${h}"/>`, `<path class="land" d="${land}"/>`, ...covers, ...pins],
    }));
    table[inset.id] = {
      w: WIDTH, h,
      labels: mine.map((r) => {
        const [x, y] = proj([LABELS[r.id].lon, LABELS[r.id].lat]);
        return { id: r.id, x: pct(x, WIDTH), y: pct(y, h), side: LABELS[r.id].side };
      }),
    };
    sizes.push([`coverage-${inset.id}`, h]);
  }

  const order = ["world", ...CONTINENTS.map((i) => i.id)].filter((k) => table[k]);
  const body = order.map((k) => {
    const m = table[k];
    const labels = m.labels.map((l) => `      { id: "${l.id}", x: ${l.x}, y: ${l.y}, side: "${l.side}" },`).join("\n");
    return `  {\n    id: "${k}",\n    w: ${m.w},\n    h: ${m.h},\n    labels: [\n${labels}\n    ],\n  },`;
  }).join("\n");
  writeFileSync(dataFile,
`// GENERATED by scripts/_coverage-map.mjs (via npm run maps:build) — do not edit by hand.
//
// The coverage maps (public/maps/coverage-<id>.svg) and where each region's
// name sits on them, as a percentage of the picture — the names are HTML laid
// over the image, so they translate and link.
export type LabelSide = "left" | "right" | "above" | "below";
export interface CoverageMap {
  id: string;
  w: number;
  h: number;
  labels: { id: string; x: number; y: number; side: LabelSide }[];
}
export const COVERAGE_MAPS: CoverageMap[] = [
${body}
];
`);
  return sizes;
}

