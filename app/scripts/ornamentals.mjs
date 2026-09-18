// The garden census: which non-native plants people in each region actually
// grow, ranked most-planted first, minus the ones we already answer.
//
//   node app/scripts/ornamentals.mjs                 # every region
//   node app/scripts/ornamentals.mjs --region pnw    # one
//   node app/scripts/ornamentals.mjs --top 40        # how deep to go
//   node app/scripts/ornamentals.mjs --json          # machine-readable
//
// **The gap this fills.** `swaps:coverage` asks the question from the native
// side — *which of our plants has nobody written a swap story for?* — and that
// is the right question once you have decided which ornamentals to cover. It
// cannot tell you what you are *missing*, because a St. Augustine lawn that has
// no row in `alternatives.ts` is invisible to a report built by walking
// `alternatives.ts`. You cannot find an absence by reading the list it is
// absent from.
//
// **Where the ranking comes from.** iNaturalist records whether an observation
// is of a wild organism or a planted one, and a *captive/cultivated* plant
// observation is, almost by definition, a garden plant. Ask for those inside a
// region's box, grouped by species and sorted by count, and the answer is a
// census of what people grow there — in the order they grow it. Nobody
// publishes that table; this is the nearest honest thing to it, and the counts
// are checkable by anyone with the same URL.
//
// **It ranks by how often a plant is photographed, not how often it is planted**
// — those differ, and in knowable ways. A street tree in a walkable city is
// photographed more than the same tree on a rural verge; a lawn is barely
// photographed at all, because nobody points a phone at turf. So a turf grass
// ranking low here is not evidence that turf is rare, and the report says so
// rather than letting a reader forget it. Treat the order as a strong hint and
// the presence of a taxon as the real signal.
//
// **Nothing here writes a row.** Like `candidates.mjs` and
// `wildlife-candidates.mjs`, this proposes and a person disposes: an ornamental
// row carries a `role`, a weakness a native beats, and a cited swap, none of
// which an observation count knows anything about. See DATA_SOURCES.md,
// "The five jobs" — this is a finder, and a finder decides nothing.
//
// **It needs open internet**, which the local build sandbox does not have.
// Same arrangement as `lookalikes:check`: run it on a laptop or a runner. The
// snapshot it writes is committed, so the queue can be read without running it.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";
import { withSeeds } from "./_regions.mjs";

requireProxyAwareFetch("ornamentals");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "ornamentals");

const UA =
  "IndigeneOrnamentals/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const onlyRegion = arg("--region", null);
const top = Number(arg("--top", 30));
const json = process.argv.includes("--json");

/**
 * The cultivated plants observed in a box, commonest first.
 *
 * `captive=true` is the whole query. It is worth being precise about what it
 * selects: iNaturalist asks every observer whether the organism is wild, and
 * marks the ones that aren't — a planted street tree, a nursery shrub, a potted
 * thing on a balcony. Those observations are *casual* grade and are excluded
 * from the defaults, which is why a `quality_grade=research` anywhere in this
 * query silently returns nothing at all.
 */
async function cultivated(bounds, perPage = 200) {
  const params = new URLSearchParams({
    captive: "true",
    iconic_taxa: "Plantae",
    hrank: "species", // a genus-level ID doesn't name a plant anyone can buy
    swlat: String(bounds.minLat),
    swlng: String(bounds.minLon),
    nelat: String(bounds.maxLat),
    nelng: String(bounds.maxLon),
    per_page: String(perPage),
  });
  const res = await fetch(
    `https://api.inaturalist.org/v1/observations/species_counts?${params}`,
    { headers: { "user-agent": UA } }
  );
  if (!res.ok) throw new Error(`iNaturalist answered ${res.status}`);
  const body = await res.json();
  if (!body.results?.length) {
    // An empty answer is a broken query, not an empty world — see the note on
    // quality_grade above. Fail loudly rather than reporting "nothing to do".
    throw new Error("iNaturalist returned no cultivated plants for this box — check the query");
  }
  return body.results.map((r) => ({
    latin: r.taxon.name,
    common: r.taxon.preferred_common_name ?? null,
    count: r.count,
    taxonId: r.taxon.id,
  }));
}

const norm = (s) => s.trim().toLowerCase();

const loader = await openLoader();
let report;
try {
  const [{ REGIONS }, { ORNAMENTALS }, { LOOKALIKES }] = await Promise.all([
    loader.load("/src/data/regions.ts"),
    loader.load("/src/data/alternatives.ts"),
    loader.load("/src/data/lookalikes.ts"),
  ]);

  // Everything we already have an answer for, by scientific name. A plant we
  // cover as an impostor counts: its page already tells the reader what it is.
  const answered = new Set([
    ...ORNAMENTALS.map((o) => norm(o.latin)),
    ...LOOKALIKES.map((l) => norm(l.latin)),
  ]);

  // Every region's roster, so a candidate can be told apart from a plant that is
  // native *somewhere we cover*. That distinction is the one this whole app
  // turns on, and it splits the queue three ways:
  //
  //   - native on this region's own list → not a candidate at all. Somebody
  //     growing it is doing the thing the app asked them to do.
  //   - native on another region's list → still a candidate, and an easy one to
  //     write honestly: coast redwood in a Seattle garden is a fine tree in the
  //     wrong place, not a menace, and its page already exists to link to.
  //   - on nobody's list → the plain exotic, and the usual case.
  const allRegions = await withSeeds(REGIONS);
  const nativeWhere = new Map();
  for (const r of allRegions) {
    for (const p of r.seed) {
      const k = norm(p.latin);
      if (!nativeWhere.has(k)) nativeWhere.set(k, []);
      nativeWhere.get(k).push(r.meta.id);
    }
  }

  const regions = allRegions.filter((r) => !onlyRegion || r.meta.id === onlyRegion);
  if (!regions.length) throw new Error(`no region "${onlyRegion}"`);

  report = [];
  for (const region of regions) {
    const ourNatives = new Set(region.seed.map((p) => norm(p.latin)));
    const rows = (await cultivated(region.meta.bounds))
      .filter((r) => !ourNatives.has(norm(r.latin)) && !answered.has(norm(r.latin)))
      .slice(0, top)
      .map((r) => ({ ...r, nativeOn: nativeWhere.get(norm(r.latin)) ?? [] }));
    report.push({ region: region.meta.id, name: region.meta.name, rows });
    // iNaturalist asks for one request per second from unauthenticated callers.
    await new Promise((r) => setTimeout(r, 1100));
  }
} finally {
  await loader.close();
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "cultivated.json"),
  JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), report }, null, 2) + "\n"
);

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const { name, rows } of report) {
    console.log(`\n${"─".repeat(72)}\n${name}`);
    console.log(`  ${rows.length} commonly-grown plants with no row of their own yet\n`);
    for (const r of rows) {
      const home = r.nativeOn.length ? `  ← native on our ${r.nativeOn.join(", ")} list` : "";
      console.log(
        `  ${String(r.count).padStart(6)}  ${r.latin.padEnd(32)} ${(r.common ?? "").padEnd(26)}${home}`
      );
    }
  }
  console.log(
    `\nCounts are observations of *planted* specimens, so they rank how often a ` +
      `plant is\nphotographed, not how often it is planted — turf and bedding are ` +
      `undercounted.\nNothing here is a row until somebody writes one.`
  );
}
