// `npm run wildlife:gaps` — rewrite the ledger of plants that name no animal.
//
// Plants grew from about 400 to 1,425 while the wildlife layer stood still,
// and nothing said so: a plant could ship with no tie and no test minded. The
// ledger (`src/data/wildlife-gaps.json`) makes that a decision instead of an
// accident. Every shipped plant with no tie is listed under its region, with
// one of two reasons:
//
//   unresearched   nobody has looked yet — the default for a plant added here
//   none-found     somebody ran `npm run wildlife` (and the regional host
//                  sources) and found no tie worth shipping
//
// `wildlife-gaps.test.ts` fails a pull request that ships an untied plant the
// ledger doesn't list, or keeps listing one that now has a tie. This script
// fixes both: new gaps are added as `unresearched`, filled ones removed, and
// every reason already written is kept.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const OUT = fileURLToPath(new URL("../src/data/wildlife-gaps.json", import.meta.url));

const loader = await openLoader();
const { SUPPORT } = await loader.load("/src/data/wildlife.ts");
const { REGIONS } = await loader.load("/src/data/regions.ts");
const regions = await withSeeds(REGIONS);
await loader.close();

// Read back as plant → reason, whichever shape the file was written in.
const before = {};
if (existsSync(OUT)) {
  for (const [id, g] of Object.entries(JSON.parse(readFileSync(OUT, "utf8")).regions)) {
    before[id] = {};
    for (const [k, v] of Object.entries(g)) {
      if (Array.isArray(v)) for (const plant of v) before[id][plant] = k;
      else before[id][k] = v;
    }
  }
}
const after = {};
let added = 0;
let filled = 0;
for (const r of regions) {
  const ties = SUPPORT[r.meta.id] ?? {};
  const was = before[r.meta.id] ?? {};
  const gaps = {};
  for (const p of r.seed) {
    if ((ties[p.id] ?? []).length) continue;
    gaps[p.id] = was[p.id] ?? "unresearched";
    if (!was[p.id]) added++;
  }
  filled += Object.keys(was).filter((id) => !gaps[id]).length;
  after[r.meta.id] = gaps;
}

// One line per region and reason: a list of plant ids. The ledger holds
// hundreds of plants, and an object per plant made it a 600-line file.
const byReason = Object.fromEntries(
  Object.entries(after).map(([id, gaps]) => {
    const grouped = {};
    for (const [plant, why] of Object.entries(gaps)) (grouped[why] ??= []).push(plant);
    return [id, grouped];
  }),
);
const lines = Object.entries(byReason).map(([id, g]) => `    ${JSON.stringify(id)}: ${JSON.stringify(g)}`);
writeFileSync(
  OUT,
  `{\n  "note": "Shipped plants that name no animal, by reason. Rewritten by \`npm run wildlife:gaps\`; held by wildlife-gaps.test.ts.",\n  "regions": {\n${lines.join(",\n")}\n  }\n}\n`,
);
const total = Object.values(after).reduce((n, g) => n + Object.keys(g).length, 0);
console.log(`${total} plants name no animal (${added} newly listed, ${filled} filled since the last run).`);
for (const [id, g] of Object.entries(after)) {
  const n = Object.keys(g).length;
  if (n) console.log(`  ${id.padEnd(22)} ${n}`);
}
