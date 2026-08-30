// `npm run swaps:coverage` — read the native-alternatives layer the way it
// should be grown: from our own roster outward.
//
// The catalogue of natives is the asset. Each one we recommend fills a garden
// job — a shade tree, a hedge, a groundcover, a lawn grass, a nectar plant —
// and for most of those jobs there is a ubiquitous non-native that a gardener
// reaches for by default. So the honest way to grow `data/alternatives.ts` is
// *native-first*: walk the plants we already catalogue, and for each one ask
// "what does this replace?", rather than hunting up ornamentals to disapprove
// of and hoping we have a match.
//
// This script turns that into a checklist. Per region it reports:
//
//   1. Coverage   — how many of the region's natives already carry at least one
//                   "grow me instead of X" tie, as a fraction and a bar.
//   2. The gap    — the natives that carry none yet, grouped by form and sorted
//                   by ecological value (keystones and big caterpillar hosts
//                   first), because those are the plants whose swap story is
//                   worth the most. This is the authoring queue.
//
// It changes nothing — it reads the shipped data and reports. Pair it with
// `npm run coverage` (which asks the wider "what should this region add?"): this
// one asks the narrower "of what we already have, what still can't tell a
// gardener what it replaces?".
//
// Usage:
//   npm run swaps:coverage                    every region, one block each
//   npm run swaps:coverage -- --region pnw    one region
//   npm run swaps:coverage -- --covered       also list the natives already done
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const args = process.argv.slice(2);
const only = args.includes("--region") ? args[args.indexOf("--region") + 1] : null;
const showCovered = args.includes("--covered");

const loader = await openLoader();
const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(REGIONS_RAW);
const { ALTERNATIVES, ORNAMENTALS } = await loader.load("/src/data/alternatives.ts");
await loader.close();

const ornamentalById = new Map(ORNAMENTALS.map((o) => [o.id, o]));

const regions = REGIONS.filter((r) => !only || r.meta.id === only);
if (!regions.length) {
  console.error(`\nswaps:coverage: no region "${only}". Known: ${REGIONS.map((r) => r.meta.id).join(", ")}\n`);
  process.exit(1);
}

const FORMS = ["tree", "shrub", "perennial", "grass", "vine", "groundcover", "fern"];
const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);

/** A rough "how much is this native's swap story worth" rank, so the authoring
 *  queue leads with the plants that carry the most life: a keystone or a big
 *  caterpillar host earns its "grow me instead" line before a minor perennial.
 *  Read straight off the row — the same fields the app ranks on. */
function value(p) {
  return (
    (p.keystone ? 10000 : 0) +
    (p.hostLepCount ?? 0) * 10 +
    (p.scores?.bird ?? 0) +
    (p.scores?.pollinator ?? 0)
  );
}

/** For a native with no tie yet: what does it replace, in one word? Its form is
 *  the honest hint at the garden job, so the queue can be read by niche. */
function bar(done, total, width = 24) {
  const filled = total ? Math.round((done / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
}

let grandTotal = 0;
let grandDone = 0;

for (const { meta, seed } of regions) {
  const ties = ALTERNATIVES[meta.id] ?? {};
  // Every native this region names as a swap target, and the ornamentals it
  // stands in for — the inverse of the tie table, keyed by native id.
  const replacesByPlant = new Map();
  for (const [ornamentalId, links] of Object.entries(ties)) {
    for (const link of links) {
      if (!replacesByPlant.has(link.plantId)) replacesByPlant.set(link.plantId, []);
      const o = ornamentalById.get(ornamentalId);
      replacesByPlant.get(link.plantId).push(o ? o.common : ornamentalId);
    }
  }

  const covered = seed.filter((p) => replacesByPlant.has(p.id));
  const uncovered = seed.filter((p) => !replacesByPlant.has(p.id));
  grandTotal += seed.length;
  grandDone += covered.length;

  const pct = seed.length ? Math.round((covered.length / seed.length) * 100) : 0;
  console.log(`\n${"─".repeat(72)}`);
  console.log(`${meta.name}`);
  console.log(`  ${bar(covered.length, seed.length)}  ${covered.length}/${seed.length} natives carry a swap story (${pct}%), from ${Object.keys(ties).length} ornamentals\n`);

  if (showCovered && covered.length) {
    console.log("  already done — native → what it replaces");
    for (const p of covered.sort((a, b) => value(b) - value(a))) {
      console.log(`    ${pad(p.common, 30)} ← ${replacesByPlant.get(p.id).join(", ")}`);
    }
    console.log("");
  }

  // The queue: the natives with no swap story yet, by form, best-first. These
  // are the plants to write a "grow me instead of …" line for next.
  console.log("  no swap story yet (authoring queue, highest-value first)");
  for (const form of FORMS) {
    const rows = uncovered.filter((p) => p.form === form).sort((a, b) => value(b) - value(a));
    if (!rows.length) continue;
    const names = rows.map((p) => (p.keystone ? `${p.common}★` : p.common));
    console.log(`    ${pad(form, 12)} ${num(rows.length, 2)}  ${names.join(" · ")}`);
  }
}

if (regions.length > 1) {
  const pct = grandTotal ? Math.round((grandDone / grandTotal) * 100) : 0;
  console.log(`\n${"═".repeat(72)}`);
  console.log(`all regions  ${bar(grandDone, grandTotal)}  ${grandDone}/${grandTotal} natives carry a swap story (${pct}%)`);
  console.log(`★ = keystone — a plant that carries most of an area's caterpillars; write these first.\n`);
}
