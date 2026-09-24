// Probe the live RESOLVE Ecoregions 2017 service — the ecoregion lookup for
// every region south of the equator.
//
//   npm run probe:resolve
//
// `fetchEcoregion` in `src/lib/site.ts` asks the EPA inside the conterminous US
// and the EEA inside Europe. Neither reaches Sydney, Auckland, Cape Town or
// Buenos Aires, so a southern region would select on its bounding box alone —
// what every shipped region stopped doing when `docs/ecoregion-plan.md` Phase B
// landed. RESOLVE (Dinerstein et al., BioScience 2017; CC BY 4.0) is global,
// one flat level of 846 ecoregions, and Esri hosts it as a public feature
// service. `site.ts` and `build-region-maps.mjs` both point at that service.
//
// What has **not** been confirmed, because the build sandbox's egress refuses
// services.arcgis.com: the layer id (0), the field names (ECO_ID, ECO_NAME,
// BIOME_NAME, REALM — the published dataset's), whether browsers may call it
// (CORS), and which ECO_ID each southern city lands in. This asks all four and
// writes data/sources/resolve-ecoregions/probe.json. The ECO_IDs it records are
// what the first southern regions' `ecoregion.codes` are copied from.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch, proxyConfigured } from "./_net.mjs";

requireProxyAwareFetch("probe:resolve");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "resolve-ecoregions");
const OUT_FILE = join(OUT_DIR, "probe.json");

const SERVICE =
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Resolve_Ecoregions/FeatureServer";
const LAYER = 0;
const EXPECTED_FIELDS = ["ECO_ID", "ECO_NAME", "BIOME_NAME", "REALM"];

// Two or three cities per first region (docs/southern-hemisphere-plan.md),
// chosen to fix its edges — plus two controls where the answer should change,
// so a service that returns one polygon for everything is caught.
const POINTS = [
  { region: "Sydney Basin", name: "Sydney, NSW", lat: -33.8688, lon: 151.2093 },
  { region: "Sydney Basin", name: "Blue Mountains, NSW", lat: -33.7125, lon: 150.3119 },
  { region: "Sydney Basin", name: "Wollongong, NSW", lat: -34.4278, lon: 150.8931 },
  { region: "Auckland & Northland", name: "Auckland", lat: -36.8485, lon: 174.7633 },
  { region: "Auckland & Northland", name: "Whangārei", lat: -35.7251, lon: 174.3237 },
  { region: "Auckland & Northland", name: "Hamilton", lat: -37.787, lon: 175.2793 },
  { region: "Cape fynbos lowlands", name: "Cape Town", lat: -33.9249, lon: 18.4241 },
  { region: "Cape fynbos lowlands", name: "Stellenbosch", lat: -33.9321, lon: 18.8602 },
  { region: "(control: Albany thicket, not fynbos)", name: "Port Elizabeth", lat: -33.9608, lon: 25.6022 },
  { region: "Buenos Aires pampas", name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
  { region: "Buenos Aires pampas", name: "La Plata", lat: -34.9205, lon: -57.9536 },
  { region: "(control: Uruguayan savanna?)", name: "Montevideo", lat: -34.9011, lon: -56.1645 },
];

async function get(url, headers = {}) {
  const res = await fetch(url, { headers: { accept: "application/json", ...headers } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { body: await res.json(), headers: res.headers };
}

async function main() {
  const report = {
    question: "Does the hosted RESOLVE Ecoregions 2017 layer answer a point query south of the equator, from a browser?",
    service: SERVICE,
    ranAt: new Date().toISOString(),
    behindProxy: proxyConfigured(),
    reachable: false,
    fields: null,
    missingFields: null,
    cors: null,
    points: [],
    verdict: null,
  };

  try {
    const { body } = await get(`${SERVICE}/${LAYER}?f=json`);
    report.reachable = true;
    report.layerName = body.name ?? null;
    report.copyright = body.copyrightText ?? null;
    report.fields = (body.fields ?? []).map((f) => f.name);
    const upper = new Set(report.fields.map((f) => f.toUpperCase()));
    report.missingFields = EXPECTED_FIELDS.filter((f) => !upper.has(f));
    console.log(`layer ${LAYER}: ${report.layerName} — fields ${report.fields.join(", ")}`);
    if (report.missingFields.length) console.log(`  MISSING: ${report.missingFields.join(", ")}`);
  } catch (e) {
    report.error = e.message;
    console.log(`unreachable: ${e.message}`);
  }

  if (report.reachable) {
    for (const p of POINTS) {
      const url =
        `${SERVICE}/${LAYER}/query?geometry=${p.lon},${p.lat}&geometryType=esriGeometryPoint` +
        `&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
      let attrs = null;
      let error = null;
      try {
        const { body, headers } = await get(url, { origin: "https://indigene.app" });
        attrs = body?.features?.[0]?.attributes ?? null;
        report.cors ??= headers.get("access-control-allow-origin");
      } catch (e) {
        error = e.message;
      }
      const pick = attrs && Object.fromEntries(
        Object.entries(attrs).filter(([k]) => EXPECTED_FIELDS.includes(k.toUpperCase()))
      );
      report.points.push({ ...p, attrs: pick, error });
      console.log(`  ${p.name.padEnd(22)} → ${pick ? JSON.stringify(pick) : error ?? "no polygon"}`);
    }
  }

  const answered = report.points.filter((p) => p.attrs).length;
  report.verdict = !report.reachable
    ? report.behindProxy
      ? "unanswered — the proxy refused services.arcgis.com, so the question never reached the service. Re-run from an unblocked network."
      : "unreachable — the service did not answer."
    : report.missingFields?.length
      ? `reachable, but the layer lacks ${report.missingFields.join(", ")} — parseEcoregionResolve in site.ts needs the real names.`
      : !report.cors
        ? "answers, but sent no Access-Control-Allow-Origin — a browser can't call it; bundle polygons instead."
        : answered === POINTS.length
          ? "resolved — copy each region's ECO_IDs into its region file."
          : `partly resolved — ${answered} of ${POINTS.length} points hit a polygon.`;
  console.log(`\nverdict: ${report.verdict}`);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2) + "\n");
  console.log(`wrote ${OUT_FILE}`);
}

main();
