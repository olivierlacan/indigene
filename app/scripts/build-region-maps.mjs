// Draw each region's boundary as a small map, once, at build time.
//
//   node scripts/build-region-maps.mjs [regionId…]      (npm run maps:build)
//
// Why a script and not a runtime map. A reader on a region page wants to see
// how far the region reaches, and no paragraph does that job as well as a
// picture. The obvious build — Leaflet plus OpenStreetMap tiles — costs a
// runtime dependency, a third-party request per page view (with the privacy
// paperwork that implies), and nothing to look at offline. The boundaries,
// meanwhile, never move: EPA Level III ecoregions are a 2011 dataset, the EEA's
// biogeographical regions a 2016 one. So we fetch the polygons **here**,
// simplify and clip them, and commit one small self-contained SVG per region
// (`public/maps/<id>.svg`). The app just shows an <img>: no dependency, no
// third-party call, works offline through the service worker, and the file is
// diffable in review.
//
// What each map shows, in the order it's drawn:
//
//   - **Land**, for orientation: Natural Earth's countries, plus — in the US —
//     state lines from the ecoregion service's own layer.
//   - **The coverage**, filled in brand green: this region's ecoregion polygons
//     *clipped to its coverage box*, which is exactly the rule the app applies
//     (`regionForSite` = inside the box AND in one of these ecoregions). A
//     region that declares no ecoregion codes gets its box drawn as the box it
//     is, dashed, rather than a shape it isn't — every shipped region traces
//     real ecoregion lines today, but the honest fallback stays for the next
//     region added.
//   - **A handful of cities**, so the shape is somewhere rather than something.
//
// Colors come from an internal stylesheet with a `prefers-color-scheme` query,
// which an SVG referenced by <img> still honors — and since the app itself
// themes off that same query and has no manual override, the map follows the
// page. Everything is same-origin and static; nothing here runs in the browser.
//
// Sources (both public sector, both already used live by `lib/site.ts`):
//   - US EPA / Omernik Level III ecoregions + state lines — US Government
//     public domain.
//   - EEA Biogeographical Regions of Europe (2016) — CC BY 4.0, © European
//     Environment Agency; administrative boundaries © EuroGeographics.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import { withSeeds } from "./_regions.mjs";

requireProxyAwareFetch("maps:build");

const APP_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(APP_ROOT, "public", "maps");

const EPA_BASE =
  "https://gispub.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer";
/** Layer 11: Level III ecoregion polygons. Layer 0: state polygons. */
const EPA_L3_LAYER = 11;
const EPA_STATES_LAYER = 0;
const EEA_LAYER =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer/0";
/** Country outlines for the European maps. The EEA layer alone would draw
 *  France as an unlabelled blob of biogeographical regions — recognizable as a
 *  coastline, useless as a place. Natural Earth 1:50m is the standard
 *  public-domain answer, and it's fetched here, at build time, only. */
const NATURAL_EARTH_COUNTRIES =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";

const UA = "Mozilla/5.0 (indigene region maps; +https://github.com/olivierlacan/indigene)";

/**
 * The places that tell you where you are.
 *
 * A shaded shape on a coastline is only an answer if you can find yourself on
 * it, so each map carries a handful of cities — enough to fix north, south and
 * the inland edge, and no more, because labels crowd fast at phone size. Some
 * are deliberately *outside* the shading (Bend behind the Cascade crest,
 * Orlando north of the south-Florida line): the edge is the question being
 * asked, and a town on the wrong side of it answers that better than a town in
 * the middle. Anything outside a map's frame is dropped, so an over-generous
 * list is harmless.
 *
 * Names are place names, and place names don't translate (the rule `lib/site.ts`
 * already follows for Level III names) — "Marseille" reads the same in both
 * languages this app speaks. Coordinates are town centres to two decimals,
 * which is a few hundred metres: far finer than a dot at this scale.
 */
const LANDMARKS = {
  pnw: [
    { name: "Vancouver", lat: 49.28, lon: -123.12 },
    { name: "Seattle", lat: 47.61, lon: -122.33 },
    { name: "Spokane", lat: 47.66, lon: -117.43 },
    { name: "Portland", lat: 45.52, lon: -122.68 },
    { name: "Bend", lat: 44.06, lon: -121.31 },
    { name: "Eugene", lat: 44.05, lon: -123.09 },
    { name: "Medford", lat: 42.33, lon: -122.87 },
  ],
  "ca-south-coast": [
    { name: "Santa Barbara", lat: 34.42, lon: -119.7 },
    { name: "Los Angeles", lat: 34.05, lon: -118.24 },
    { name: "Riverside", lat: 33.95, lon: -117.4 },
    { name: "Palm Springs", lat: 33.83, lon: -116.55 },
    { name: "San Diego", lat: 32.72, lon: -117.16 },
  ],
  "mid-atlantic": [
    { name: "Boston", lat: 42.36, lon: -71.06 },
    { name: "Pittsburgh", lat: 40.44, lon: -79.996 },
    { name: "New York", lat: 40.71, lon: -74.01 },
    { name: "Philadelphia", lat: 39.95, lon: -75.17 },
    { name: "Washington", lat: 38.9, lon: -77.04 },
    { name: "Richmond", lat: 37.54, lon: -77.44 },
  ],
  "florida-central": [
    { name: "Pensacola", lat: 30.42, lon: -87.22 },
    { name: "Tallahassee", lat: 30.44, lon: -84.28 },
    { name: "Jacksonville", lat: 30.33, lon: -81.66 },
    { name: "Orlando", lat: 28.54, lon: -81.38 },
    { name: "Tampa", lat: 27.95, lon: -82.46 },
  ],
  "florida-south": [
    { name: "Orlando", lat: 28.54, lon: -81.38 },
    { name: "Fort Myers", lat: 26.64, lon: -81.87 },
    { name: "West Palm Beach", lat: 26.71, lon: -80.05 },
    { name: "Miami", lat: 25.77, lon: -80.19 },
    { name: "Key West", lat: 24.56, lon: -81.78 },
  ],
  "france-atlantic": [
    { name: "Lille", lat: 50.63, lon: 3.06 },
    { name: "Paris", lat: 48.86, lon: 2.35 },
    { name: "Rennes", lat: 48.11, lon: -1.68 },
    { name: "Nantes", lat: 47.22, lon: -1.55 },
    { name: "Bordeaux", lat: 44.84, lon: -0.58 },
  ],
  "france-continental": [
    { name: "Nancy", lat: 48.69, lon: 6.18 },
    { name: "Strasbourg", lat: 48.57, lon: 7.75 },
    { name: "Dijon", lat: 47.32, lon: 5.04 },
    { name: "Lyon", lat: 45.76, lon: 4.84 },
    { name: "Genève", lat: 46.2, lon: 6.14 },
  ],
  "france-mediterranean": [
    { name: "Marseille", lat: 43.3, lon: 5.37 },
    { name: "Nice", lat: 43.7, lon: 7.27 },
    { name: "Montpellier", lat: 43.61, lon: 3.88 },
    { name: "Perpignan", lat: 42.7, lon: 2.9 },
    { name: "Ajaccio", lat: 41.92, lon: 8.74 },
  ],
  "france-alpine": [
    { name: "Genève", lat: 46.2, lon: 6.14 },
    { name: "Annecy", lat: 45.9, lon: 6.13 },
    { name: "Chamonix", lat: 45.92, lon: 6.87 },
    { name: "Grenoble", lat: 45.19, lon: 5.72 },
    { name: "Briançon", lat: 44.9, lon: 6.64 },
  ],
};

/** Drawing size in user units. The page shows it at about a third of this, so
 *  the geometry stays crisp on a 3× phone screen without carrying more decimal
 *  places than a phone can resolve. */
const WIDTH = 640;
/** How much land to show around the region, as a share of its own span. Enough
 *  to place it (the coast, the next state along), not so much that the region
 *  becomes a speck. */
const PAD = 0.35;
/** Degrees of padding at minimum, for the small regions (South Florida). */
const MIN_PAD = 1.2;
/** How tall or wide the finished picture may get, as height ÷ width. A region
 *  is whatever shape it is — the PNW's strip of coast is nearly three times
 *  taller than it is wide — but a card on a phone can't be, so the view widens
 *  (or heightens) until it fits between these. Extra view is extra context, not
 *  a lie about the region: the shaded shape is unchanged either way. */
const MAX_ASPECT = 1.2;
const MIN_ASPECT = 0.55;

async function getJson(url, params) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${url}?${q}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = await res.json();
  if (data.error) throw new Error(`service error: ${JSON.stringify(data.error)}`);
  return data;
}

/** One ArcGIS layer query, asking for GeoJSON in plain lat/lon. The server does
 *  the simplifying (`maxAllowableOffset`, in degrees) — far cheaper than pulling
 *  full-resolution coastlines down and thinning them here. */
function queryGeoJson(layerUrl, { where, box, offset, outFields }) {
  return getJson(`${layerUrl}/query`, {
    where: where ?? "1=1",
    outFields: outFields ?? "*",
    geometry: `${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`,
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    returnGeometry: "true",
    outSR: "4326",
    maxAllowableOffset: String(offset),
    geometryPrecision: "4",
    f: "geojson",
  });
}

// ---- geometry -------------------------------------------------------------

/** Every ring of a (Multi)Polygon feature, outer and holes alike. Holes are
 *  kept as their own subpaths and drawn with `fill-rule: evenodd`, which is all
 *  a hole needs to be a hole. */
function ringsOf(geometry) {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

/** Sutherland–Hodgman against one edge of the clip box. Valid here because the
 *  clip shape is a rectangle, and so convex. */
function clipEdge(ring, inside, intersect) {
  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const cur = ring[i];
    const prev = ring[(i + ring.length - 1) % ring.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn) {
      if (!prevIn) out.push(intersect(prev, cur));
      out.push(cur);
    } else if (prevIn) {
      out.push(intersect(prev, cur));
    }
  }
  return out;
}

/** A ring clipped to a lat/lon box. Returns [] when nothing survives. */
function clipRing(ring, box) {
  const lerpLon = (a, b, lon) => [lon, a[1] + ((b[1] - a[1]) * (lon - a[0])) / (b[0] - a[0])];
  const lerpLat = (a, b, lat) => [a[0] + ((b[0] - a[0]) * (lat - a[1])) / (b[1] - a[1]), lat];
  let r = ring;
  r = clipEdge(r, (p) => p[0] >= box.minLon, (a, b) => lerpLon(a, b, box.minLon));
  if (!r.length) return r;
  r = clipEdge(r, (p) => p[0] <= box.maxLon, (a, b) => lerpLon(a, b, box.maxLon));
  if (!r.length) return r;
  r = clipEdge(r, (p) => p[1] >= box.minLat, (a, b) => lerpLat(a, b, box.minLat));
  if (!r.length) return r;
  return clipEdge(r, (p) => p[1] <= box.maxLat, (a, b) => lerpLat(a, b, box.maxLat));
}

/** Shoelace area in square degrees — used only to drop slivers too small to
 *  see, so an approximation in degrees is exactly the right unit. */
function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

/** Web Mercator's y, so shapes keep the proportions people know from maps.
 *  Scaled back into degree-sized units, since x stays in plain degrees of
 *  longitude and the two have to share one scale factor. */
const mercY = (lat) => (180 / Math.PI) * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
/** Back the other way, for growing a view by a number of drawn units. */
const invMercY = (y) => (360 / Math.PI) * Math.atan(Math.exp((y * Math.PI) / 180)) - 90;

/** Projector from lat/lon into the SVG's user space for a given view box. */
function projector(view) {
  const x0 = view.minLon;
  const y0 = mercY(view.maxLat);
  const scale = WIDTH / (view.maxLon - view.minLon);
  const height = (y0 - mercY(view.minLat)) * scale;
  const project = ([lon, lat]) => [(lon - x0) * scale, (y0 - mercY(lat)) * scale];
  return { project, height };
}

/** Rings → one `d` attribute, rounded to a tenth of a user unit (well under a
 *  device pixel at the size this is shown) and stripped of points that round to
 *  where the last one already was.
 *
 *  **Corners are rounded.** The polygons arrive already simplified by the map
 *  service, at a tolerance of about three user units — which is a visible
 *  zigzag at the size these are drawn, and made every coastline look like it had
 *  been cut with pinking shears. Rather than ask for more vertices (the file is
 *  committed, and the Mid-Atlantic is 160 rings), each corner is rounded by
 *  drawing the ring as quadratic curves that pass through the *midpoints* of the
 *  segments, using each original vertex as the control point. The curve stays
 *  within half a segment of the original line, which at this tolerance is under
 *  two pixels, and the shape reads as a coastline instead of a saw.
 *
 *  Collinear runs are emitted as straight lines instead, which matters for
 *  honesty as much as for file size: where a ring follows the coverage box —
 *  southern California's eastern edge is a meridian, not a landform — it has to
 *  stay the straight line it actually is. */
const COLLINEAR = 0.35; // user units of sag below which three points are "straight"
/** How close to the map's own edge counts as *on* it. Rings are clipped to the
 *  view, so a coastline that runs off the picture gets square corners on the
 *  frame — and rounding those turned the whole map into a lozenge with the land
 *  curling away from its corners. A vertex on the frame is a cut, not a
 *  landform, and never gets curved. */
const FRAME = 0.6;

function pathData(rings, project, frame) {
  const parts = [];
  const r1 = (n) => Math.round(n * 10) / 10;
  for (const ring of rings) {
    // Project first, drop consecutive duplicates, and drop the repeated closing
    // point — the curve closes the ring itself.
    const pts = [];
    for (const point of ring) {
      const [x, y] = project(point);
      const p = [r1(x), r1(y)];
      const last = pts[pts.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
    }
    while (pts.length > 1) {
      const a = pts[0];
      const b = pts[pts.length - 1];
      if (a[0] === b[0] && a[1] === b[1]) pts.pop();
      else break;
    }
    if (pts.length < 3) continue;

    const mid = (a, b) => [r1((a[0] + b[0]) / 2), r1((a[1] + b[1]) / 2)];
    // Perpendicular distance of the corner from the chord between its
    // neighbours' midpoints: how much curve this vertex would actually add.
    const sag = (prev, cur, next) => {
      const m0 = mid(prev, cur);
      const m1 = mid(cur, next);
      const dx = m1[0] - m0[0];
      const dy = m1[1] - m0[1];
      const len = Math.hypot(dx, dy);
      if (!len) return 0;
      return Math.abs((cur[0] - m0[0]) * dy - (cur[1] - m0[1]) * dx) / len;
    };

    const n = pts.length;
    let d = `M${mid(pts[n - 1], pts[0]).join(" ")}`;
    for (let i = 0; i < n; i++) {
      const cur = pts[i];
      const prev = pts[(i - 1 + n) % n];
      const next = pts[(i + 1) % n];
      const end = mid(cur, next);
      const onFrame =
        frame &&
        (cur[0] <= FRAME || cur[0] >= frame.w - FRAME ||
         cur[1] <= FRAME || cur[1] >= frame.h - FRAME);
      d += onFrame || sag(prev, cur, next) < COLLINEAR
        ? `L${cur.join(" ")}L${end.join(" ")}`
        : `Q${cur.join(" ")} ${end.join(" ")}`;
    }
    parts.push(`${d}Z`);
  }
  return parts.join("");
}

/** Features → clipped, de-sliverred rings, ready to project. */
function ringsIn(features, box, minArea) {
  const out = [];
  for (const f of features) {
    for (const ring of ringsOf(f.geometry)) {
      const clipped = clipRing(ring, box);
      if (clipped.length > 2 && ringArea(clipped) >= minArea) out.push(clipped);
    }
  }
  return out;
}

const rect = (box) => [[
  [box.minLon, box.minLat], [box.maxLon, box.minLat],
  [box.maxLon, box.maxLat], [box.minLon, box.maxLat],
]];

// ---- the drawing ----------------------------------------------------------

/** The palette, as an internal stylesheet. Values are the app's own tokens from
 *  `styles.css` — copied rather than referenced because an <img> can't see the
 *  page's variables, and the media query is what keeps the two in step. */
const STYLE = `
  .land { fill: #e6e2d5; stroke: #bdb6a3; stroke-width: 1.2; stroke-linejoin: round; }
  .admin { fill: none; stroke: #cfcabb; stroke-width: 1; stroke-linejoin: round; }
  /* **No stroke, on purpose.** A region is often a dozen Level III ecoregions,
     drawn as one path with a subpath each, so any stroke outlines every
     *internal* seam as boldly as the region's own edge — the Mid-Atlantic, at
     fifteen of them, read as a shattered windscreen. And those seams answer no
     question a reader has: the caption already names the ecoregions in words,
     and which of them a garden sits in changes nothing about what to plant. The
     region is one shape, so it is drawn as one shape. Because every ring is a
     subpath of a single path, fill-opacity composites once for the whole
     union - touching polygons leave no seam at all. */
  .cover { fill: #175e33; fill-opacity: 0.45; }
  .cover-box { fill: #175e33; fill-opacity: 0.26; stroke: #0d3d20; stroke-width: 2;
               stroke-dasharray: 9 7; stroke-linejoin: round; }
  .pin { fill: #14140f; stroke: #f7f5ef; stroke-width: 2.5; }
  .pin-label { font: 600 23px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
               fill: #14140f; stroke: #f7f5ef; stroke-width: 5; paint-order: stroke;
               stroke-linejoin: round; dominant-baseline: central; }
  @media (prefers-color-scheme: dark) {
    .land { fill: #2e3325; stroke: #545d43; }
    .admin { stroke: #434b36; }
    .cover { fill: #7ec894; fill-opacity: 0.42; }
    .cover-box { fill: #7ec894; fill-opacity: 0.22; stroke: #b9e6c6; }
    .pin { fill: #f2f1e8; stroke: #14160f; }
    .pin-label { fill: #f2f1e8; stroke: #14160f; }
  }`;

/** Label metrics, close enough to lay out with: at this weight and size a
 *  character averages a bit over half the font size, which is all the accuracy
 *  a collision test needs. */
const LABEL_SIZE = 23;
const labelWidth = (text) => text.length * LABEL_SIZE * 0.56;

const overlaps = (a, b) =>
  a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;

/**
 * Cities as dots with names, laid out so no two names touch.
 *
 * Each label gets four candidate positions — right of the dot, left of it,
 * above, below — and takes the first that clears every label already placed and
 * stays inside the frame. A name with nowhere to go loses its label and keeps
 * its dot: a dot with no name is a town you can't identify, but two names on
 * top of each other are two towns nobody can read. Order matters, so the lists
 * above are written most-recognizable first.
 */
function landmarks(places, project, height) {
  const dots = places.map((p) => project([p.lon, p.lat]));
  const out = [];
  // Every dot is an obstacle from the start, so a name can't be laid across a
  // neighbouring town's marker — which reads as one place with a broken label.
  // A label may still sit beside its *own* dot, so that one is skipped.
  const taken = [];
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const [x, y] = dots[i];
    const others = dots
      .filter((_, j) => j !== i)
      .map(([dx, dy]) => ({ x1: dx - 7, x2: dx + 7, y1: dy - 7, y2: dy + 7 }));
    const w = labelWidth(place.name);
    const candidates = [
      { x1: x + 11, x2: x + 11 + w, anchor: "start", dx: 11, dy: 0 },
      { x1: x - 11 - w, x2: x - 11, anchor: "end", dx: -11, dy: 0 },
      { x1: x - w / 2, x2: x + w / 2, anchor: "middle", dx: 0, dy: -19 },
      { x1: x - w / 2, x2: x + w / 2, anchor: "middle", dx: 0, dy: 19 },
    ];
    const cx = Math.round(x * 10) / 10;
    const cy = Math.round(y * 10) / 10;
    out.push(`<circle class="pin" cx="${cx}" cy="${cy}" r="5"/>`);
    const fit = candidates.find((c) => {
      const box = { x1: c.x1 - 3, x2: c.x2 + 3, y1: y + c.dy - 13, y2: y + c.dy + 13 };
      if (box.x1 < 2 || box.x2 > WIDTH - 2 || box.y1 < 2 || box.y2 > height - 2) return false;
      return !taken.some((t) => overlaps(box, t)) && !others.some((t) => overlaps(box, t));
    });
    if (!fit) continue;
    taken.push({ x1: fit.x1 - 3, x2: fit.x2 + 3, y1: y + fit.dy - 13, y2: y + fit.dy + 13 });
    const tx = Math.round((x + fit.dx) * 10) / 10;
    const ty = Math.round((y + fit.dy) * 10) / 10;
    out.push(
      `<text class="pin-label" x="${tx}" y="${ty}" text-anchor="${fit.anchor}">` +
      `${escape(place.name)}</text>`
    );
  }
  return out;
}

function svgFor({ view, land, admin, cover, places, boxOnly, credit }) {
  const { project, height } = projector(view);
  const h = Math.round(height);
  // The picture's own edges, so a vertex sitting on one is understood as a cut
  // through the geometry rather than a corner of it (see pathData/FRAME).
  const frame = { w: WIDTH, h };
  const inView = places.filter((p) =>
    p.lon >= view.minLon && p.lon <= view.maxLon && p.lat >= view.minLat && p.lat <= view.maxLat
  );
  const layers = [
    `<path class="land" fill-rule="evenodd" d="${pathData(land, project, frame)}"/>`,
    ...(admin?.length ? [`<path class="admin" d="${pathData(admin, project, frame)}"/>`] : []),
    `<path class="${boxOnly ? "cover-box" : "cover"}" fill-rule="evenodd" d="${pathData(cover, project, frame)}"/>`,
    ...landmarks(inView, project, h),
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${h}" width="${WIDTH}" height="${h}" role="img">
<title>${credit.title}</title>
<desc>${credit.desc}</desc>
<style>${STYLE}
</style>
${layers.join("\n")}
</svg>
`;
}

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---- per region -----------------------------------------------------------

function viewFor(bounds) {
  const padLon = Math.max((bounds.maxLon - bounds.minLon) * PAD, MIN_PAD);
  const padLat = Math.max((bounds.maxLat - bounds.minLat) * PAD, MIN_PAD);
  const view = {
    minLon: bounds.minLon - padLon,
    maxLon: bounds.maxLon + padLon,
    minLat: bounds.minLat - padLat,
    maxLat: bounds.maxLat + padLat,
  };
  // Grow the shorter side until the picture is a shape a card can hold.
  const lonSpan = view.maxLon - view.minLon;
  const mercSpan = mercY(view.maxLat) - mercY(view.minLat);
  const aspect = mercSpan / lonSpan;
  if (aspect > MAX_ASPECT) {
    const grow = (mercSpan / MAX_ASPECT - lonSpan) / 2;
    view.minLon -= grow;
    view.maxLon += grow;
  } else if (aspect < MIN_ASPECT) {
    const grow = (lonSpan * MIN_ASPECT - mercSpan) / 2;
    view.minLat = invMercY(mercY(view.minLat) - grow);
    view.maxLat = invMercY(mercY(view.maxLat) + grow);
  }
  return view;
}

/** Natural Earth's countries, fetched once and shared by the European maps.
 *  Three megabytes for the world, which is fine for a script that runs by hand
 *  and ships nothing but the handful of outlines that survive clipping. */
let countriesPromise = null;
function countries() {
  countriesPromise ??= fetch(NATURAL_EARTH_COUNTRIES, { headers: { "User-Agent": UA } })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} for Natural Earth countries`);
      return res.json();
    })
    .then((data) => data.features);
  return countriesPromise;
}

async function buildRegion(meta) {
  const view = viewFor(meta.bounds);
  // One simplification tolerance for the whole map, tied to how much ground it
  // covers: about a third of a user unit, i.e. under a pixel as displayed.
  const offset = (view.maxLon - view.minLon) / (WIDTH / 3);
  // Slivers below a fifth of a squared tolerance are specks; dropping them is
  // most of the file-size win on a coastline full of islands.
  const minArea = (offset * offset) / 5;
  const eea = meta.ecoregion?.provider === "eea-biogeo";

  // Countries are the land everywhere: without them a US map stops dead at the
  // Canadian border, and the empty half of the picture reads as ocean.
  const land = ringsIn(await countries(), view, minArea);
  let admin = null;
  let cover;
  if (eea) {
    const all = await queryGeoJson(EEA_LAYER, { box: view, offset, outFields: "short_name" });
    const mine = all.features.filter((f) =>
      meta.ecoregion.codes.includes(String(f.properties.short_name ?? "").toLowerCase())
    );
    if (!mine.length) throw new Error(`${meta.id}: no EEA polygon matched ${meta.ecoregion.codes}`);
    cover = ringsIn(mine, meta.bounds, minArea);
  } else {
    // State lines, from the ecoregion service's own layer — drawn as lines over
    // the land, since in the US "which state is that?" is how people place a
    // shape. Their clipped edges all fall on the view's rectangle, so they
    // read as the map's frame rather than as invented borders.
    const states = await queryGeoJson(`${EPA_BASE}/${EPA_STATES_LAYER}`, {
      box: view, offset, outFields: "STATE_NAME",
    });
    admin = ringsIn(states.features, view, minArea);
    if (meta.ecoregion) {
      const codes = meta.ecoregion.codes.map((c) => `'${c}'`).join(",");
      const mine = await queryGeoJson(`${EPA_BASE}/${EPA_L3_LAYER}`, {
        where: `US_L3CODE IN (${codes})`, box: view, offset, outFields: "US_L3CODE",
      });
      if (!mine.features.length) throw new Error(`${meta.id}: no EPA polygon for ${codes}`);
      cover = ringsIn(mine.features, meta.bounds, minArea);
    } else {
      // No declared ecoregions: the coverage really is the rectangle, and the
      // map says so with a dashed edge rather than implying traced lines.
      cover = rect(meta.bounds);
    }
  }

  const source = eea
    ? "EEA Biogeographical Regions of Europe (2016), CC BY 4.0 © European Environment Agency"
    : "US EPA Level III Ecoregions of the Conterminous United States (2011), public domain";
  const svg = svgFor({
    view, land, admin, cover,
    places: LANDMARKS[meta.id] ?? [],
    boxOnly: !meta.ecoregion,
    credit: {
      title: escape(`Where the ${meta.name} region reaches`),
      desc: escape(`${meta.extent} Boundary data: ${source}.`),
    },
  });
  const file = join(OUT_DIR, `${meta.id}.svg`);
  writeFileSync(file, svg);
  const { height } = projector(view);
  return {
    id: meta.id,
    bytes: svg.length,
    rings: land.length + (admin?.length ?? 0) + cover.length,
    size: { w: WIDTH, h: Math.round(height) },
  };
}

/** The shapes' aspect ratios, as a module the app can import. The page needs
 *  them before the image loads — an <img> with no known ratio reserves no room
 *  and the roster jumps down the moment the map arrives. */
function writeSizes(sizes) {
  const rows = sizes.map(({ id, size }) => `  "${id}": { w: ${size.w}, h: ${size.h} },`);
  writeFileSync(join(APP_ROOT, "src", "data", "region-maps.ts"),
`// GENERATED by scripts/build-region-maps.mjs — do not edit by hand.
// Regenerate (needs network, hits the EPA and EEA map services): npm run maps:build
//
// The drawn size of each region's map (public/maps/<id>.svg), so the page can
// reserve exactly the right box for it and nothing shifts when the file lands.
export const REGION_MAP_SIZES: Record<string, { w: number; h: number }> = {
${rows.join("\n")}
};
`);
}

// ---- main -----------------------------------------------------------------

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const loader = await openLoader();
try {
  const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
  const REGIONS = await withSeeds(REGIONS_RAW);
  mkdirSync(OUT_DIR, { recursive: true });
  const wanted = REGIONS.filter((r) => !only.length || only.includes(r.meta.id));
  if (!wanted.length) throw new Error(`no region matched ${only.join(", ")}`);
  const sizes = [];
  for (const { meta } of wanted) {
    const built = await buildRegion(meta);
    sizes.push(built);
    console.log(
      `map: ${built.id} → public/maps/${built.id}.svg ` +
      `(${(built.bytes / 1024).toFixed(1)} KB, ${built.rings} rings, ${built.size.w}×${built.size.h})`
    );
  }
  // Only a full run knows every region's size; a single-region rebuild leaves
  // the generated module alone rather than truncating it to one entry.
  if (!only.length) writeSizes(sizes);
  else console.log("(partial run — src/data/region-maps.ts left as it was)");
} finally {
  await loader.close();
}
