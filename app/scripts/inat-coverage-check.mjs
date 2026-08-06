// Measure what a "see it growing near you" lookup actually returns.
//
//   node scripts/inat-coverage-check.mjs [regionId] [lat] [lon]
//   node scripts/inat-coverage-check.mjs pnw 48.42 -123.4
//
// Why this exists: the lookup used to ask one region-wide question — the 100
// most recent research-grade observations of *every* native in the region — and
// let each plant find itself in the answer. That shares a 100-row page across
// ~40 taxa ordered by recency, so in a well-observed area the page spans a few
// days and most of the region's plants are simply absent from it. The page then
// told the reader nobody had ever photographed one.
//
// This script runs both shapes against the live API and prints the difference:
// how many of the region's natives the old shared query left with zero rows, and
// how many observations each of those actually has nearby. Run it before and
// after touching the query — it is the evidence that the answer changed.
//
// It talks to api.inaturalist.org directly (no key needed) and paces itself well
// under iNaturalist's published limits.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("inat:check");

const HERE = dirname(fileURLToPath(import.meta.url));
const REGISTRY = resolve(HERE, "../public/registry/native-plant-registry.json");
const API = "https://api.inaturalist.org/v1/observations";

/** iNaturalist asks for under 60 requests a minute; one a second is polite. */
const PACE_MS = 1100;
const RADIUS_KM = 50;

const [regionId = "pnw", lat = "48.42", lon = "-123.4"] = process.argv.slice(2);

const raw = JSON.parse(readFileSync(REGISTRY, "utf8"));
const entries = (raw.entries ?? raw).filter(
  (e) => e.regions?.includes(regionId) && e.identifiers?.inat,
);
if (!entries.length) {
  console.error(`No registry entries with an iNaturalist id for region "${regionId}".`);
  process.exit(1);
}
const ids = entries.map((e) => e.identifiers.inat);
const nameOf = new Map(entries.map((e) => [e.identifiers.inat, e.scientificName ?? e.acceptedName]));

const base = {
  iconic_taxa: "Plantae",
  quality_grade: "research",
  photos: "true",
  lat,
  lng: lon,
  radius: String(RADIUS_KM),
};

async function ask(params) {
  const url = `${API}?${new URLSearchParams({ ...base, ...params })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(`region ${regionId} · ${ids.length} natives with an iNaturalist id · ${lat},${lon} · ${RADIUS_KM} km\n`);

// ---- The old shape: one page shared across every native in the region --------
const shared = await ask({
  taxon_id: ids.join(","),
  per_page: "100",
  order_by: "observed_on",
  order: "desc",
});

const present = new Map();
let belowSpecies = 0;
for (const r of shared.results) {
  const id = String(r.taxon?.id);
  present.set(id, (present.get(id) ?? 0) + 1);
  // A subspecies or variety: iNaturalist's taxon_id filter matches descendants,
  // and the old exact-id join dropped every one of these after it had already
  // taken a slot in the page.
  if (!nameOf.has(id)) belowSpecies++;
}
const dates = shared.results.map((r) => r.observed_on).filter(Boolean).sort();

console.log("one region-wide request (the old shape)");
console.log(`  rows returned          ${shared.results.length} of ${shared.total_results} matching`);
console.log(`  dates covered          ${dates[0]} … ${dates.at(-1)}`);
console.log(`  natives represented    ${[...present.keys()].filter((id) => nameOf.has(id)).length} of ${ids.length}`);
console.log(`  rows below species     ${belowSpecies} (dropped by the exact-id join)\n`);

// ---- The new shape: ask about one plant, the way a plant page does -----------
const starved = ids.filter((id) => !present.has(id));
console.log(`asking per taxon for the ${starved.length} the shared page missed:\n`);

let recovered = 0;
for (const id of starved) {
  const one = await ask({ taxon_id: id, per_page: "1" });
  if (one.total_results > 0) recovered++;
  console.log(`  ${String(one.total_results).padStart(6)} nearby   ${nameOf.get(id)}`);
  await sleep(PACE_MS);
}

console.log(
  `\n${recovered} of ${starved.length} were reported as "nobody has photographed one here yet" ` +
  `while iNaturalist had sightings all along.`,
);
