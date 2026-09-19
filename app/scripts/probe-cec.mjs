// Probe for an ecoregion lookup that works **north of the 49th parallel** — the
// one thing standing between us and a Canadian region.
//
//   npm run probe:cec
//
// `fetchEcoregion` in `src/lib/site.ts` asks the EPA for a point in the
// conterminous US and the EEA for a point in Europe. A point in Vancouver or
// Montréal gets neither: the EPA service returns no polygon anywhere in Canada
// (measured — see data/sources/vascan/README.md). Without a third provider a
// Canadian region would select on its bounding box alone, which is what every
// shipped region stopped doing when `docs/ecoregion-plan.md` Phase B landed. So
// this is a gate, not a nice-to-have, and it is the first thing to answer.
//
// The candidate is the **CEC North American Terrestrial Ecoregions** — the same
// Omernik lineage the EPA layers come from, extended across Canada, the US and
// Mexico by the Commission for Environmental Cooperation. It is the right shape
// for us for one specific reason: British Columbia's coast and the Puget Lowland
// are *one* ecological unit that our data currently splits at a political line,
// and so are the Québec Appalachians and northern New England. A classification
// that stops at the border cannot say that; this one can.
//
// **Its codes are not our codes.** CEC Level III is numbered `5.2.1`-style
// (`NA_L3CODE`), not the US `1`–`84` (`US_L3CODE`) that `RegionMeta.ecoregion`
// carries today. Whatever this probe finds, a Canadian region means a third
// `EcoregionProvider` with its own code space — not new codes in the EPA one.
// The EPA layer already returns `NA_L1NAME`/`NA_L2NAME`, so the two sides can be
// lined up by hand while that is designed.
//
// This script is **discovery-first**: it does not assume a host, a layer id or a
// field name, because none of those have been confirmed. It walks a list of
// candidate service roots, looks for a layer carrying a recognisable ecoregion
// field, and point-queries it at known places on both sides of the border — the
// same shape as `probe-eea.mjs`, which was written for a service the sandbox
// could not reach either.
//
// Writes data/sources/cec-ecoregions/probe.json. If every candidate fails from an
// unblocked machine, that is a real finding and worth committing: it makes the
// case for the fallback in `docs/region-queue.md` (bundle simplified polygons for
// the two Canadian boxes and do point-in-polygon on-device, the scoped version of
// the offline work `docs/ecoregion-plan.md` §3 deferred).
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { requireProxyAwareFetch, proxyConfigured } from "./_net.mjs";

requireProxyAwareFetch("probe:cec");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "cec-ecoregions");
const OUT_FILE = join(OUT_DIR, "probe.json");

// Candidate ArcGIS service roots, best-known first. None is confirmed; the probe
// reports which (if any) answers, so the winner can be pinned in `site.ts`.
const CANDIDATES = [
  "https://gis.cec.org/arcgis/rest/services/Atlas/Ecoregions/MapServer",
  "https://gis.cec.org/arcgis/rest/services",
  "https://maps-cartes.services.geo.ca/server_serveur/rest/services",
];

// A field name that looks like a North American ecoregion code or name.
const FIELD_RE = /^(NA_L[123](CODE|NAME)|NAME_L[123]|ECO_?(CODE|NAME)|LEVEL[123])/i;

// Known points either side of the border, chosen so a working service has to
// answer for both. The two pairs are the ones a Canadian region would live on.
const POINTS = [
  { name: "Vancouver, BC", lat: 49.2827, lon: -123.1207, expect: "Pacific maritime / Coast Range" },
  { name: "Victoria, BC", lat: 48.4284, lon: -123.3656, expect: "Pacific maritime / Puget-Georgia" },
  { name: "Seattle, WA", lat: 47.6062, lon: -122.3321, expect: "same unit as Victoria" },
  { name: "Montréal, QC", lat: 45.5019, lon: -73.5674, expect: "Mixed wood plains / St Lawrence lowlands" },
  { name: "Québec City, QC", lat: 46.8139, lon: -71.208, expect: "Mixed wood plains" },
  { name: "Portland, ME", lat: 43.6591, lon: -70.2568, expect: "same unit as the Québec Appalachians" },
];

async function json(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Find layers on a MapServer/FeatureServer whose fields look like ecoregions. */
async function ecoregionLayers(base) {
  const meta = await json(`${base}?f=json`);
  const layers = meta.layers ?? [];
  const found = [];
  for (const l of layers) {
    if (l.type && !/polygon/i.test(l.geometryType ?? "polygon")) continue;
    try {
      const detail = await json(`${base}/${l.id}?f=json`);
      const fields = (detail.fields ?? []).map((f) => f.name);
      const eco = fields.filter((f) => FIELD_RE.test(f));
      if (eco.length) found.push({ id: l.id, name: l.name, ecoregionFields: eco, allFields: fields });
    } catch {
      /* a layer we can't read is not a candidate */
    }
  }
  return { serviceName: meta.mapName ?? meta.serviceDescription ?? null, layers: found };
}

async function pointQuery(base, layerId, fields, lat, lon) {
  const url =
    `${base}/${layerId}/query?geometry=${lon},${lat}&geometryType=esriGeometryPoint` +
    `&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=${encodeURIComponent(fields.join(","))}` +
    `&returnGeometry=false&f=json`;
  const data = await json(url);
  return data?.features?.[0]?.attributes ?? null;
}

async function main() {
  const report = {
    question: "Can a point in Canada be resolved to an ecoregion by a live point query?",
    ranAt: new Date().toISOString(),
    behindProxy: proxyConfigured(),
    candidates: [],
    resolved: null,
    verdict: null,
  };

  for (const base of CANDIDATES) {
    const entry = { base, reachable: false };
    console.log(`\n=== ${base}`);
    try {
      const { serviceName, layers } = await ecoregionLayers(base);
      entry.reachable = true;
      entry.serviceName = serviceName;
      entry.layers = layers;
      console.log(`  reachable — ${layers.length} layer(s) with an ecoregion-looking field`);
      for (const l of layers) console.log(`    [${l.id}] ${l.name}: ${l.ecoregionFields.join(", ")}`);

      const layer = layers.find((l) => l.ecoregionFields.some((f) => /L3/i.test(f))) ?? layers[0];
      if (layer) {
        entry.probes = [];
        for (const p of POINTS) {
          let attrs = null;
          let error = null;
          try {
            attrs = await pointQuery(base, layer.id, layer.ecoregionFields, p.lat, p.lon);
          } catch (e) {
            error = e.message;
          }
          entry.probes.push({ ...p, layer: layer.id, attrs, error });
          console.log(`    ${p.name.padEnd(18)} → ${attrs ? JSON.stringify(attrs) : error ?? "no polygon"}`);
        }
        const canadianHits = entry.probes.filter(
          (x) => /BC|QC/.test(x.name) && x.attrs
        ).length;
        if (canadianHits >= 2) report.resolved = { base, layer: layer.id, fields: layer.ecoregionFields };
      }
    } catch (e) {
      entry.error = e.message;
      console.log(`  unreachable: ${e.message}`);
    }
    report.candidates.push(entry);
    if (report.resolved) break;
  }

  // A host that refuses the TCP connect outright is a *local egress* answer, not
  // an answer about the service. Saying so is the difference between "CEC can't
  // do this" and "we couldn't ask" — and only the first one is a finding.
  const allBlocked = report.candidates.every((c) => !c.reachable);
  report.verdict = report.resolved
    ? "resolved"
    : allBlocked && report.behindProxy
      ? "unanswered — every candidate host refused the connection from this machine's proxy, so the question was never put to the service. Re-run from an unblocked network."
      : "no — a reachable service returned no polygon for a Canadian point";

  console.log("\n=== CONCLUSION ===");
  if (report.resolved) {
    console.log(`  A Canadian point resolves. Pin this in src/lib/site.ts:`);
    console.log(`    base:   ${report.resolved.base}`);
    console.log(`    layer:  ${report.resolved.layer}`);
    console.log(`    fields: ${report.resolved.fields.join(", ")}`);
    console.log(`  Next: check CORS from a browser — the app calls this client-side.`);
  } else if (allBlocked && report.behindProxy) {
    console.log("  UNANSWERED. Every candidate host refused the connection from this");
    console.log("  machine — that is this network's egress policy, not the service's");
    console.log("  answer. Nothing was learned about CEC. Re-run from an unblocked");
    console.log("  network before concluding anything (probe-eea.mjs was in exactly");
    console.log("  this position, and the service turned out to be fine).");
  } else {
    console.log("  No reachable candidate returned a polygon for a Canadian point.");
    console.log("  That is the answer docs/region-queue.md's gate 1 asks for: take the");
    console.log("  bundled-polygon fallback, or hold the Canadian regions.");
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT_FILE} — commit it either way.`);
}

main().catch((e) => {
  console.error("\nProbe failed:", e.message);
  process.exit(1);
});
