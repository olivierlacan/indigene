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

const before = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")).regions : {};
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

writeFileSync(
  OUT,
  JSON.stringify(
    {
      note: "Shipped plants that name no animal, and why. Rewritten by `npm run wildlife:gaps`; held by wildlife-gaps.test.ts.",
      regions: after,
    },
    null,
    2,
  ) + "\n",
);
const total = Object.values(after).reduce((n, g) => n + Object.keys(g).length, 0);
console.log(`${total} plants name no animal (${added} newly listed, ${filled} filled since the last run).`);
for (const [id, g] of Object.entries(after)) {
  const n = Object.keys(g).length;
  if (n) console.log(`  ${id.padEnd(22)} ${n}`);
}
