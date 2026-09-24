// Count how often each most-wanted invasive has been recorded in each region.
//
//   npm run invasives:count            # refresh every count
//   npm run invasives:count -- --dry   # print, write nothing
//
// **Why a count at all.** A region's most-wanted list is ranked on two things
// (see `lib/invasives.ts`): how hard the plant pushes, which is the local
// authority's rating, and how far it has actually got, which is this. The
// rating is a judgement of risk; the count is the evidence of spread, and it is
// what orders plants the authority rated the same — and the whole list where
// nobody rated anything.
//
// **What is counted.** iNaturalist observations of the taxon, descendants
// included, that are *verifiable* (photographed, dated, located) and *not
// captive* — so a pampas grass somebody photographed in their own front garden
// doesn't count, and one seeding into a canyon does. Inside the region's box
// (`meta.bounds`), the same box the rest of the app queries, which is why the
// page says "in this region's box" rather than "in this region": a box is wider
// than the region it holds, and a number that claimed otherwise would be ours,
// not iNaturalist's.
//
// It is a count of people noticing, not a census of plants. A roadside weed in
// a busy suburb is recorded more than the same weed in a far canyon. That is
// the honest limit of the figure, and it is why the rating comes first.
//
// **The taxon id** comes from `inat-invasives.json` — the table that chose each
// plant's photograph (`npm run hero:inat -- --kind invasives`) — so the count,
// the photo and the page's live sightings all ask about the same taxon. A plant
// with no row there is resolved by name, with the app's own `pickTaxon`.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("invasives:count");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../src/data/invasive-counts.json");
const PHOTOS = resolve(HERE, "../src/data/inat-invasives.json");
const API = "https://api.inaturalist.org/v1/observations";
const UA =
  "IndigeneInvasiveCounts/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";
/** Comfortably under iNaturalist's published 60 requests a minute. */
const PACE_MS = 1100;
const dry = process.argv.includes("--dry");

const loader = await openLoader();
const { INVASIVES, MOST_WANTED } = await loader.load("/src/data/invasives.ts");
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { buildTaxaUrl, pickTaxon } = await loader.load("/src/lib/inaturalist.ts");
await loader.close();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function askJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`iNaturalist ${res.status} — ${url}`);
  return res.json();
}

const photos = JSON.parse(readFileSync(PHOTOS, "utf8"));
const byId = new Map(INVASIVES.map((i) => [i.id, i]));
const taxonOf = new Map();
async function taxonFor(id) {
  if (taxonOf.has(id)) return taxonOf.get(id);
  let taxon = photos[id]?.taxonId;
  if (!taxon) {
    const inv = byId.get(id);
    taxon = pickTaxon((await askJson(buildTaxaUrl(inv.latin, "Plantae")))?.results, inv.latin);
    await sleep(PACE_MS);
  }
  taxonOf.set(id, taxon ?? null);
  return taxon ?? null;
}

const counts = {};
const problems = [];
for (const region of REGIONS) {
  const links = MOST_WANTED[region.meta.id];
  if (!links?.length) continue;
  const b = region.meta.bounds;
  counts[region.meta.id] = {};
  for (const link of links) {
    const taxon = await taxonFor(link.invasiveId);
    if (!taxon) {
      problems.push(`${region.meta.id}/${link.invasiveId}: no iNaturalist taxon`);
      continue;
    }
    const params = new URLSearchParams({
      taxon_id: String(taxon),
      verifiable: "true",
      captive: "false",
      swlat: String(b.minLat),
      swlng: String(b.minLon),
      nelat: String(b.maxLat),
      nelng: String(b.maxLon),
      per_page: "0",
    });
    try {
      const n = (await askJson(`${API}?${params}`))?.total_results;
      if (typeof n !== "number") throw new Error("no total_results");
      counts[region.meta.id][link.invasiveId] = n;
      console.log(`${region.meta.id.padEnd(22)} ${link.invasiveId.padEnd(26)} ${n}`);
    } catch (err) {
      problems.push(`${region.meta.id}/${link.invasiveId}: ${err.message}`);
    }
    await sleep(PACE_MS);
  }
}

if (problems.length) {
  // A missing count would silently drop a plant to the bottom of its list, so
  // a partial run writes nothing.
  console.error(`\n${problems.length} problems — nothing written:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
const out = { asOf: new Date().toISOString().slice(0, 10), counts };
if (dry) console.log("\n--dry: nothing written.");
else {
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`\nwrote src/data/invasive-counts.json (as of ${out.asOf})`);
}
