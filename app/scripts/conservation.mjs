// What the people who assess these things say about the plant or animal in
// front of you — and only where it means something here.
//
//   npm run conservation             # refresh the whole table
//   npm run conservation -- --dry-run
//
// ## Why this is not "show the conservation status"
//
// 136 of our 368 subjects carry a status of concern *somewhere in the world*,
// and almost all of it is noise:
//
//   white oak        S1 in Nebraska      — while it is the Mid-Atlantic's best tree
//   field maple      CR in Sweden        — we ship it for France
//   common hawthorn  CR in Finland       — our own data calls it an impostor
//
// A species is rare at the edge of its range and common in the middle of it,
// and a rank is a fact about a *place*. Printing Nebraska's rank on a
// Pennsylvania page would be false in the way that matters: it would tell a
// gardener their commonest oak is nearly gone.
//
// So exactly two things are kept:
//
//   1. **A global assessment** — IUCN, or a NatureServe G-rank. That one is
//      about the species itself and travels with it. Six subjects have one.
//   2. **The rank in the one state or province a region mostly is** — found by
//      sampling its box, see below. Seven subjects have one.
//
// Everything else is dropped, and the file records which place and which
// authority said each thing that survived, because a rank with no place on it
// is not a fact.
//
// Needs open internet (iNaturalist), like the other harvests.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("conservation");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../src/data/conservation.json");
const HEROES = resolve(HERE, "../src/data/inat-heroes.json");
const INAT = "https://api.inaturalist.org/v1";
const UA =
  "IndigeneConservation/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";
const PACE_MS = 900;
const dryRun = process.argv.includes("--dry-run");

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { regionsForWildlife } = await loader.load("/src/lib/wildlife.ts");
await loader.close();

const heroes = JSON.parse(readFileSync(HEROES, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ask(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`iNaturalist ${res.status}`);
  return res.json();
}

/**
 * A rank worth telling a gardener about. NatureServe counts 1–3 as some degree
 * of trouble (critically imperiled, imperiled, vulnerable) and 4–5 as fine;
 * IUCN's three threatened categories are CR, EN and VU. A government calling
 * something endangered counts however it spells the rank.
 *
 * `S1S3` and `G3G4` are theirs, not typos: an assessor who can't choose between
 * two ranks publishes the span. The first number is the one to read for "is
 * this a concern", and the whole string is what gets printed.
 */
function ofConcern(entry) {
  const rank = String(entry.status ?? "").toLowerCase();
  const words = String(entry.status_name ?? "").toLowerCase();
  if (/^[gns][1-3]/.test(rank)) return true;
  if (["cr", "en", "vu"].includes(rank)) return true;
  return /endanger|threatened|imperil|critical/.test(words);
}

/** The subjects we can ask about: a plant with a reconciled taxon id, an animal
 *  whose name the photo harvest already resolved to one. */
const subjects = [
  ...REGISTRY.filter((e) => e.identifiers?.inat && e.identifiers?.indigene).map((e) => ({
    kind: "plant",
    id: e.identifiers.indigene,
    taxon: Number(e.identifiers.inat),
    regions: e.regions ?? [],
  })),
  ...WILDLIFE.filter((w) => heroes[w.id]?.taxonId).map((w) => ({
    kind: "animal",
    id: w.id,
    taxon: heroes[w.id].taxonId,
    regions: regionsForWildlife(w.id).map((r) => r.meta.id),
  })),
];

console.log(`${subjects.length} subjects · ${REGIONS.length} regions`);
if (dryRun) {
  console.log(`would ask iNaturalist for ${REGIONS.length} place lists + ` +
    `${Math.ceil(subjects.length / 30)} batches of 30 taxa`);
  process.exit(0);
}

// **One place per region: the state or province it mostly *is*.**
//
// The obvious version of this — every place the region's box touches — was
// tried and is wrong. The Mid-Atlantic's box reaches Vermont, New Hampshire and
// Ontario at its corners, so six of its thirteen rows came back ranked for
// states nobody using that list is standing in. "River birch is imperiled in
// New Hampshire" is true, and it is not an answer to a gardener in
// Philadelphia.
//
// So the box is sampled on a grid and the place that comes back most often
// wins. That is the state the list is *about*: Pennsylvania for the
// Mid-Atlantic, Oregon for the Pacific Northwest, Pays de la Loire for Atlantic
// France. The centre point alone would have done it for six of the nine, but
// three regions are coastal enough that their middle is open water — southern
// California's is a mile off Malibu.
const placesFor = new Map();
for (const region of REGIONS) {
  const b = region.meta.bounds;
  const tally = new Map();
  for (const fx of [0.25, 0.5, 0.75]) {
    for (const fy of [0.25, 0.5, 0.75]) {
      const lat = b.minLat + (b.maxLat - b.minLat) * fy;
      const lon = b.minLon + (b.maxLon - b.minLon) * fx;
      const d = 0.05;
      try {
        const j = await ask(
          `${INAT}/places/nearby?nelat=${lat + d}&nelng=${lon + d}&swlat=${lat - d}&swlng=${lon - d}&per_page=20`,
        );
        for (const p of (j?.results?.standard ?? []).filter((x) => x.admin_level === 10)) {
          tally.set(p.name, (tally.get(p.name) ?? 0) + 1);
        }
      } catch {
        /* one sample point at sea costs nothing */
      }
      await sleep(PACE_MS);
    }
  }
  const [best] = [...tally].sort((a, b2) => b2[1] - a[1]);
  if (best) placesFor.set(region.meta.id, best[0]);
  process.stdout.write(`\r  home place for ${placesFor.size}/${REGIONS.length} regions`);
}
console.log("");
for (const [id, place] of placesFor) console.log(`    ${id.padEnd(22)} ${place}`);

const byTaxon = new Map(subjects.map((s) => [s.taxon, s]));
const ids = [...byTaxon.keys()];
const table = {};
let asked = 0;
for (let i = 0; i < ids.length; i += 30) {
  const batch = ids.slice(i, i + 30);
  const j = await ask(`${INAT}/taxa/${batch.join(",")}`);
  for (const taxon of j?.results ?? []) {
    const subject = byTaxon.get(taxon.id);
    if (!subject) continue;
    const found = (taxon.conservation_statuses ?? []).filter(ofConcern);
    if (!found.length) continue;

    const row = {};
    // One global assessment, preferring IUCN — it is the name a reader is most
    // likely to have met, and NatureServe's G-rank is the same claim in a
    // notation only ecologists read.
    const globals = found.filter((c) => !c.place);
    const iucn = globals.find((c) => /iucn/i.test(c.authority ?? ""));
    const best = iucn ?? globals[0];
    if (best) {
      row.global = { rank: best.status, authority: best.authority ?? null };
    }
    // And the regional ones, kept per region so a page can print the rank for
    // the region it is showing and no other.
    for (const regionId of subject.regions) {
      const home = placesFor.get(regionId);
      if (!home) continue;
      // Only the region's own place. A country-level rank is deliberately not
      // accepted either: "rare in the United States" on a Florida page is
      // usually a Caribbean species whose range merely clips the country.
      const here = found.filter((c) => c.place?.name === home);
      if (!here.length) continue;
      const pick = here[0];
      row.regions ??= {};
      row.regions[regionId] = {
        rank: pick.status,
        authority: pick.authority ?? null,
        place: pick.place.display_name ?? pick.place.name,
      };
    }
    if (row.global || row.regions) table[subject.id] = row;
  }
  asked += batch.length;
  process.stdout.write(`\r  asked about ${asked}/${ids.length} subjects`);
  await sleep(PACE_MS);
}
console.log("");

const sorted = Object.fromEntries(Object.keys(table).sort().map((k) => [k, table[k]]));
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
const globals = Object.values(sorted).filter((r) => r.global).length;
const regional = Object.values(sorted).filter((r) => r.regions).length;
console.log(`\nwrote ${OUT.replace(resolve(HERE, "../.."), ".")}`);
console.log(`  ${Object.keys(sorted).length} subjects · ${globals} with a global assessment · ${regional} with one in a region we cover`);
