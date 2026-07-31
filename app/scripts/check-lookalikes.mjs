// Check the look-alike ties in `app/src/data/lookalikes.ts` against the one
// body of evidence that records which plants people *actually* mix up:
// iNaturalist's misidentification history.
//
//   node app/scripts/check-lookalikes.mjs              # check every tie
//   node app/scripts/check-lookalikes.mjs --region pnw # one region
//   node app/scripts/check-lookalikes.mjs --suggest    # also list what we miss
//   node app/scripts/check-lookalikes.mjs --json       # machine-readable
//
// **Why this exists.** Every other number in this app has a source you can page
// through: host counts come from NWF/Tallamy and the Gaytán matrix, names from
// TAXREF and VASCAN, identity from IPNI. "These two plants get confused",
// though, is nobody's dataset. It's editorial content — extension bulletins,
// weed-board ID sheets, the "risque de confusion" section of a French EEE fact
// sheet — and every tie in the catalog is hand-authored from those, and cites
// them in its `basis`.
//
// That leaves one honest gap: an expert saying two plants are confusable is not
// the same as evidence that people confuse them. iNaturalist has exactly that
// evidence, as a by-product of how it works — when an observation's community
// ID moves from taxon A to taxon B, that's a recorded, counted mistake. The
// `identifications/similar_species` endpoint serves those counts per taxon.
//
// So this script asks, for every tie: does the community's own record of
// mistakes include this one? Three outcomes, and only the middle one is a
// problem worth acting on:
//
//   ✓ backed      — iNaturalist has recorded people making this exact mistake.
//   ? unrecorded  — no misidentifications recorded. NOT a failure: a garden
//                   plant nobody photographs in the wild (dwarf firebush,
//                   lavandin) produces no observations to be wrong about, and
//                   the expert source still stands. It stays a data point.
//   + missed      — a confusion iNaturalist records often and we say nothing
//                   about (only with `--suggest`). This is the useful half:
//                   the community finds the mix-ups an extension bulletin
//                   never got round to writing up.
//
// **It needs open internet, which the build sandbox does not have** —
// api.inaturalist.org refuses the agent egress. Same arrangement as
// `check-vernacular.mjs` and `reconcile.mjs`: run it locally, or on a runner.
// The snapshot it writes is committed, so a tie that quietly stops being
// corroborated shows up in a diff.
//
// Nothing here decides what ships. A tie earns its place by being sourced and
// useful; this is corroboration and a source of leads, not a gate.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "lookalikes");

const UA =
  "IndigeneLookalikeCheck/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

const TAXA_SEARCH = "https://api.inaturalist.org/v1/taxa";
const SIMILAR = "https://api.inaturalist.org/v1/identifications/similar_species";

/** Below this many recorded misidentifications, a "missed" confusion is noise —
 *  one person's slip, not a pattern worth writing a comparison table about. */
const SUGGEST_FLOOR = 15;

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const onlyRegion = flag("--region");
const suggest = args.includes("--suggest");
const asJson = args.includes("--json");

const loader = await openLoader();
const { LOOKALIKES, CONFUSIONS } = await loader.load("/src/data/lookalikes.ts");
const { REGIONS } = await loader.load("/src/data/regions.ts");

const lookalikeById = new Map(LOOKALIKES.map((l) => [l.id, l]));
const plantsByRegion = new Map(REGIONS.map((r) => [r.meta.id, r.seed]));

async function getJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** iNaturalist is polite about rate limits and we should be politer: one
 *  request a second, in a script that runs quarterly. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const taxonCache = new Map();

/** Resolve a scientific name to an iNaturalist taxon id — the same
 *  name-not-id resolution the app itself does at request time. */
async function taxonId(latin) {
  if (taxonCache.has(latin)) return taxonCache.get(latin);
  const data = await getJson(`${TAXA_SEARCH}?q=${encodeURIComponent(latin)}&is_active=true&per_page=5`);
  const exact = (data?.results ?? []).find(
    (t) => String(t.name).toLowerCase() === latin.toLowerCase().replace(/\s*×\s*/, " × ")
  );
  const id = exact?.id ?? data?.results?.[0]?.id ?? null;
  taxonCache.set(latin, id);
  await sleep(1000);
  return id;
}

const similarCache = new Map();

/** The taxa people have actually been recorded misidentifying this one as,
 *  with counts. Returns a Map of taxon id → { count, name }. */
async function similarSpecies(id) {
  if (similarCache.has(id)) return similarCache.get(id);
  const data = await getJson(`${SIMILAR}?taxon_id=${id}&per_page=100`);
  const out = new Map();
  for (const row of data?.results ?? []) {
    if (row?.taxon?.id) out.set(row.taxon.id, { count: row.count ?? 0, name: row.taxon.name });
  }
  similarCache.set(id, out);
  await sleep(1000);
  return out;
}

const report = { checkedAt: null, ties: 0, backed: [], unrecorded: [], unresolved: [], missed: [] };
let upstreamAnswers = 0;

for (const [regionId, byPlant] of Object.entries(CONFUSIONS)) {
  if (onlyRegion && regionId !== onlyRegion) continue;
  const roster = plantsByRegion.get(regionId) ?? [];
  for (const [plantId, links] of Object.entries(byPlant)) {
    const plant = roster.find((p) => p.id === plantId);
    if (!plant) continue; // the app's own audit already shouts about this
    const nativeId = await taxonId(plant.latin);
    if (nativeId) upstreamAnswers++;
    const similar = nativeId ? await similarSpecies(nativeId) : new Map();
    if (similar.size) upstreamAnswers++;

    for (const link of links) {
      report.ties++;
      const impostor = lookalikeById.get(link.lookalikeId);
      if (!impostor) continue;
      const impostorId = await taxonId(impostor.latin);
      const row = { region: regionId, plant: plant.latin, lookalike: impostor.latin };
      if (!nativeId || !impostorId) {
        report.unresolved.push(row);
        continue;
      }
      const hit = similar.get(impostorId);
      if (hit) report.backed.push({ ...row, misidentifications: hit.count });
      else report.unrecorded.push(row);
    }

    if (suggest) {
      // What the community confuses this plant with that we haven't written up.
      // Deliberately unfiltered by nativeness: a native mistaken for another
      // native is still a mix-up a reader can be helped with.
      const covered = new Set(
        links.map((l) => lookalikeById.get(l.lookalikeId)?.latin).filter(Boolean)
      );
      for (const [, v] of similar) {
        if (v.count >= SUGGEST_FLOOR && !covered.has(v.name) && v.name !== plant.latin) {
          report.missed.push({ region: regionId, plant: plant.latin, candidate: v.name, misidentifications: v.count });
        }
      }
    }
  }
}

// A run where nothing answered is a blocked network, not a verdict — and a
// snapshot of "0 backed, everything unrecorded" would read exactly like a
// catalog full of invented confusions. Refuse to write one, and say why.
if (report.ties > 0 && upstreamAnswers === 0) {
  console.error(
    "iNaturalist answered nothing at all — this is a blocked or offline network, not a\n" +
    "result. api.inaturalist.org refuses the build sandbox's egress; run this locally or\n" +
    "on a runner. Nothing was written."
  );
  await loader.close();
  process.exit(2);
}

report.checkedAt = new Date().toISOString().slice(0, 10);
report.missed.sort((a, b) => b.misidentifications - a.misidentifications);

mkdirSync(OUT_DIR, { recursive: true });
const outFile = join(OUT_DIR, "inaturalist-confusions.json");
writeFileSync(outFile, JSON.stringify(report, null, 2) + "\n");

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Checked ${report.ties} look-alike ties against iNaturalist misidentifications.`);
  console.log(`  ✓ recorded by the community:  ${report.backed.length}`);
  console.log(`  ? no misidentifications yet:  ${report.unrecorded.length}`);
  console.log(`  … taxon wouldn't resolve:     ${report.unresolved.length}`);
  for (const b of report.backed) {
    console.log(`    ✓ ${b.plant} ↔ ${b.lookalike} (${b.misidentifications}× in ${b.region})`);
  }
  for (const u of report.unrecorded) {
    console.log(`    ? ${u.plant} ↔ ${u.lookalike} (${u.region})`);
  }
  if (suggest) {
    console.log(`\n  + confusions we don't cover (≥${SUGGEST_FLOOR} recorded):`);
    for (const m of report.missed.slice(0, 40)) {
      console.log(`    + ${m.plant} ↔ ${m.candidate} (${m.misidentifications}×, ${m.region})`);
    }
  }
  console.log(`\nSnapshot written to ${outFile}`);
}

await loader.close();

// Nothing here is a failure. An unbacked tie is a plant nobody photographs, not
// a false claim — the expert source in its `basis` is what makes it true, and
// this script's job is to corroborate and to find leads, not to gate the build.
process.exit(0);
