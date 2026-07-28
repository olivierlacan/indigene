// Probe the live EEA Biogeographical Regions ArcGIS service to confirm the two
// things the build sandbox couldn't (its egress 403s the EEA host): the polygon
// *layer id*, and the *field name* that holds the region (Atlantic / Continental
// / Alpine / Mediterranean). Runs anywhere with Node 18+ (built-in fetch), no
// dependencies:
//
//   node app/scripts/probe-eea.mjs
//
// It prints a summary and writes the provenance snapshot to
// data/sources/eea-biogeographical-regions/probe.json (committed — see that
// folder's README). Paste the summary (or the json) back and the parser in
// app/src/lib/site.ts gets pinned to the real layer + field, and the "confirm
// in-browser" caveat comes off.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Resolve the output path from this script's location, so it lands in the right
// place regardless of the working directory it's launched from.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "eea-biogeographical-regions");
const OUT_FILE = join(OUT_DIR, "probe.json");

const BASE =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer";

// Known points, one per French biogeographical region, plus a couple of edges.
// geometry is sent as "<lon>,<lat>" (the order the app uses).
const POINTS = [
  { name: "Paris", lat: 48.8566, lon: 2.3522, expect: "Atlantic" },
  { name: "Bordeaux", lat: 44.8378, lon: -0.5792, expect: "Atlantic" },
  { name: "Strasbourg", lat: 48.5734, lon: 7.7521, expect: "Continental" },
  { name: "Lyon", lat: 45.764, lon: 4.8357, expect: "Continental" },
  { name: "Marseille", lat: 43.2965, lon: 5.3698, expect: "Mediterranean" },
  { name: "Ajaccio (Corsica)", lat: 41.9192, lon: 8.7386, expect: "Mediterranean" },
  { name: "Chamonix (Alps)", lat: 45.9237, lon: 6.8694, expect: "Alpine" },
  { name: "Gavarnie (Pyrenees)", lat: 42.7357, lon: 0.0089, expect: "Alpine" },
];

// The eleven region names we canonicalize to (used to auto-detect the field).
const REGION_RES = [
  /alpine/i, /atlantic/i, /black\s*sea/i, /boreal/i, /continental/i,
  /mediterran/i, /pannonian/i, /steppic/i, /arctic/i, /anatolian/i, /macaronesia/i,
];

const UA =
  "Mozilla/5.0 (indigene ecoregion probe; +https://github.com/olivierlacan/indigene)";

async function getJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function queryUrl(layer, lat, lon) {
  return (
    `${BASE}/${layer}/query?geometry=${lon},${lat}&geometryType=esriGeometryPoint` +
    `&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`
  );
}

// Which attribute key (if any) holds a recognizable region name.
function detectRegionField(attrs) {
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (typeof v !== "string" && typeof v !== "number") continue;
    const s = String(v);
    if (REGION_RES.some((re) => re.test(s))) return { field: k, value: s };
  }
  return null;
}

async function main() {
  const report = {
    source: "EEA Biogeographical Regions of Europe (2016)",
    license: "CC-BY 4.0 (European Environment Agency)",
    base: BASE,
    ranAt: new Date().toISOString(),
    layers: [],
    probes: [],
  };

  // 1) Layer list.
  console.log("→ Fetching layer list…");
  const root = await getJson(`${BASE}?f=json`);
  const layers = (root.layers ?? []).map((l) => ({
    id: l.id, name: l.name, geometryType: l.geometryType,
  }));
  report.layers = layers;
  console.log("\nLayers:");
  for (const l of layers) console.log(`  [${l.id}] ${l.name}  (${l.geometryType ?? "?"})`);

  // Candidate polygon layers to probe (prefer polygon geometry; else try all).
  const polygonIds = layers
    .filter((l) => !l.geometryType || /Polygon/i.test(l.geometryType))
    .map((l) => l.id);
  const tryIds = polygonIds.length ? polygonIds : layers.map((l) => l.id);

  // 2) Probe each point against candidate layers; stop at the first that answers
  //    with a recognizable region name.
  console.log("\n→ Probing French points…\n");
  for (const p of POINTS) {
    let hit = null;
    for (const layer of tryIds) {
      try {
        const data = await getJson(queryUrl(layer, p.lat, p.lon));
        const attrs = data?.features?.[0]?.attributes;
        const det = detectRegionField(attrs);
        if (det) { hit = { layer, ...det, attrs }; break; }
        if (!hit && attrs) hit = { layer, field: null, value: null, attrs }; // feature but no name match
      } catch (e) {
        // try next layer
      }
    }
    const line = hit
      ? `${p.name.padEnd(20)} expect ${p.expect.padEnd(14)} → layer ${hit.layer}, ${
          hit.field ? `${hit.field}="${hit.value}"` : "no region-name field matched (see attrs)"
        }`
      : `${p.name.padEnd(20)} expect ${p.expect.padEnd(14)} → no feature / all layers failed`;
    console.log("  " + line);
    report.probes.push({ ...p, result: hit });
  }

  // 3) Conclusion.
  const field = report.probes.map((x) => x.result?.field).find(Boolean);
  const layer = report.probes.map((x) => x.result?.layer).find((v) => v != null);
  report.detectedLayer = layer ?? null;
  report.detectedField = field ?? null;
  console.log("\n=== CONCLUSION ===");
  console.log(`  Polygon layer: ${layer ?? "UNRESOLVED — check the layer list above"}`);
  console.log(`  Region field:  ${field ?? "UNRESOLVED — paste one probe's attrs below"}`);
  if (report.probes[0]?.result?.attrs) {
    console.log("\n  Full attributes for the first point (for reference):");
    console.log("  " + JSON.stringify(report.probes[0].result.attrs));
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT_FILE} — commit it, or paste the CONCLUSION block back.`);
}

main().catch((e) => {
  console.error("\nProbe failed:", e.message);
  console.error(
    "If this is a network/403 from your machine too, the service may be down or " +
      "moved — grab the layer list in a browser instead:\n  " + BASE + "?f=json"
  );
  process.exit(1);
});
