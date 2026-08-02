// `npm run coverage` — print what each region's plant list is missing.
//
// This is docs/coverage-plan.md §1 turned into a script, which that document
// asked for and deliberately left unbuilt. It changes nothing: it reads the
// shipped data and reports, so "what should this region add next?" stops being
// a question someone answers from memory.
//
// It reports five things per region, in the order they matter:
//
//   1. Forms       — tree/shrub/perennial/grass/vine/groundcover/fern. A
//                    gardener who needs a groundcover is not served by trees.
//   2. Site types  — moisture × sun. A spot with no candidates is the one
//                    failure the app cannot talk its way out of.
//   3. Bloom       — months with something in flower. Nectar gaps starve
//                    pollinators, and they fall in the months lists are thinnest.
//   4. Host genera — the genera that carry the food web. For the French
//                    regions this is a real join against the committed Gaytán
//                    counts (data/sources/eu-lep-plant-matrix/host-counts.json),
//                    so "we're missing Populus" is a fact, not an opinion. For
//                    the US regions we ship no equivalent machine-readable
//                    table, and the script says so rather than pretending.
//   5. Wildlife    — the named-animal layer in `data/wildlife.ts`. Which plants
//                    have no animal attached, worst (highest host count) first,
//                    and which animals already in the catalog this region could
//                    be using but isn't.
//
// Usage:
//   npm run coverage                      every region, one block each
//   npm run coverage -- --region pnw      one region
//   npm run coverage -- --top 40          how deep to look down the host-genus
//                                         ranking (default 30)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const HOST_COUNTS = fileURLToPath(
  new URL("../../data/sources/eu-lep-plant-matrix/host-counts.json", import.meta.url),
);

// Same join as build-host-counts.mjs: our regions are EEA biogeographical
// regions, the matrix uses its own ecosystem zones.
const ZONE_FOR_EEA_REGION = {
  atlantic: "Oceanic temperate",
  continental: "Continental temperate",
  alpine: "Mountain",
  mediterranean: "Mediterranean",
};

const FORMS = ["tree", "shrub", "perennial", "grass", "vine", "groundcover", "fern"];
const MOISTURE = ["dry", "mesic", "wet"];
// Sun bands as the app files them: a plant belongs to a band if its accepted
// range overlaps it. Deliberately generous — we are looking for holes, and an
// over-strict reading would invent them.
const SUN_BANDS = [
  ["shade", (p) => p.sun.minHours <= 3],
  ["part", (p) => p.sun.minHours <= 6 && p.sun.maxHours >= 3],
  ["sun", (p) => p.sun.maxHours >= 6],
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The bars from docs/coverage-plan.md §1. Not laws — the point of printing the
// number beside the bar is that a reader can disagree with the bar.
const FORM_FLOOR = 3; // every form wants at least this many options
const SITE_FLOOR = 3; // every moisture × sun cell wants at least this many
const BLOOM_FLOOR = 2; // every growing-season month wants this many in flower
// The plan says "~Feb–Oct locally", and the "~" is doing real work: February is
// mud in Brittany and snow at 1,800 m. The window is printed with the shortfall
// so a reader can discount the months that don't apply to their region.
const SEASON = [2, 10];

const argOf = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? fallback : process.argv[i + 1];
};
const only = argOf("region", null);
const TOP = Number(argOf("top", 30));

const loader = await openLoader();
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { WILDLIFE, SUPPORT } = await loader.load("/src/data/wildlife.ts");
await loader.close();

const hostCounts = JSON.parse(readFileSync(HOST_COUNTS, "utf8"));
const wildlifeById = new Map(WILDLIFE.map((w) => [w.id, w]));

const regions = REGIONS.filter((r) => !only || r.meta.id === only);
if (!regions.length) {
  console.error(`\ncoverage: no region "${only}". Known: ${REGIONS.map((r) => r.meta.id).join(", ")}\n`);
  process.exit(1);
}

const pad = (s, n) => String(s).padEnd(n);
const num = (s, n) => String(s).padStart(n);
const flag = (n, floor) => (n < floor ? " ←" : "");

for (const { meta, seed } of regions) {
  console.log(`\n${"─".repeat(72)}\n${meta.name} — ${seed.length} plants\n`);

  // Every row the region is short of a floor, summed at the end. A floor is not
  // a target — clearing it means the list has stopped failing anyone outright,
  // not that it is finished.
  let short = 0;

  // ---- 1. Forms ----
  console.log("  forms");
  for (const form of FORMS) {
    const n = seed.filter((p) => p.form === form).length;
    short += Math.max(0, FORM_FLOOR - n);
    console.log(`    ${pad(form, 13)}${num(n, 3)}${flag(n, FORM_FLOOR)}`);
  }

  // ---- 2. Site types ----
  console.log("\n  site types (moisture × sun)");
  console.log(`    ${pad("", 8)}${SUN_BANDS.map(([n]) => num(n, 7)).join("")}`);
  // A cell short by k is not k *new* plants — one wet-shade fern fills a cell in
  // three rows at once. The worst single cell is the honest floor, so take the
  // deepest hole rather than the sum.
  let deepestCell = 0;
  for (const m of MOISTURE) {
    const cells = SUN_BANDS.map(([, fits]) => seed.filter((p) => p.moisture.includes(m) && fits(p)).length);
    deepestCell = Math.max(deepestCell, ...cells.map((n) => Math.max(0, SITE_FLOOR - n)));
    console.log(
      `    ${pad(m, 8)}${cells.map((n) => num(`${n}${n < SITE_FLOOR ? "←" : ""}`, 7)).join("")}`,
    );
  }
  short += deepestCell;

  // ---- 3. Bloom calendar ----
  const inFlower = Array(13).fill(0);
  for (const p of seed) {
    if (!p.bloom) continue;
    for (let m = p.bloom.startMonth; ; m = (m % 12) + 1) {
      inFlower[m]++;
      if (m === p.bloom.endMonth) break;
    }
  }
  console.log("\n  in flower, by month");
  console.log(`    ${MONTHS.map((m) => num(m.slice(0, 3), 5)).join("")}`);
  console.log(`    ${inFlower.slice(1).map((n) => num(`${n}${n < BLOOM_FLOOR ? "←" : ""}`, 5)).join("")}`);
  for (let m = SEASON[0]; m <= SEASON[1]; m++) short += Math.max(0, BLOOM_FLOOR - inFlower[m]);

  // ---- 4. Host genera ----
  const zone = (meta.ecoregion?.codes ?? []).map((c) => ZONE_FOR_EEA_REGION[c]).find(Boolean);
  const have = new Set(seed.map((p) => p.latin.split(/\s+/)[0]));
  console.log("");
  if (zone) {
    // Every genus with at least one native member in this zone, ranked by the
    // number of Lepidoptera species recorded on it. This is the ranking
    // coverage-plan §2 step 1 asks us to work down.
    const ranked = Object.entries(hostCounts.genera)
      .map(([genus, v]) => ({ genus, ...(v.zones[zone] ?? {}) }))
      .filter((r) => r.members > 0)
      .sort((a, b) => b.count - a.count);
    const top = ranked.slice(0, TOP);
    const missing = top.filter((r) => !have.has(r.genus));
    const sum = (rows) => rows.reduce((a, r) => a + r.count, 0);
    console.log(
      `  host genera — ${zone} zone, Gaytán et al. 2026 (${ranked.length} genera with a native member)`,
    );
    console.log(
      `    we ship ${top.length - missing.length} of the top ${TOP}` +
        ` — ${Math.round(((sum(top) - sum(missing)) / sum(top)) * 100)}% of their caterpillar records`,
    );
    if (missing.length) {
      console.log(`\n    missing, biggest first (lep species / native members in zone):`);
      for (const r of missing) console.log(`      ${pad(r.genus, 16)}${num(r.count, 5)}${num(r.members, 6)}`);
    }
  } else {
    // Honest gap, not an omission: NWF/Tallamy publish no openly-licensed
    // genus table we can bundle the way the Gaytán matrix let us for Europe,
    // so a US region's ranking can only be its own rows. See coverage-plan §3.
    console.log("  host genera — no bundled source for this region; showing our own rows only");
    const ranked = [...seed].sort((a, b) => b.hostLepCount - a.hostLepCount).slice(0, 10);
    for (const p of ranked) {
      console.log(`      ${pad(p.latin.split(/\s+/)[0], 16)}${num(p.hostLepCount, 5)}  ${p.keystone ? "keystone" : ""}`);
    }
  }

  // ---- 5. Wildlife ties ----
  const ties = SUPPORT[meta.id] ?? {};
  const links = Object.values(ties).flat();
  const used = new Set(links.map((l) => l.wildlifeId));
  const hosts = links.filter((l) => l.support === "host").length;
  const untied = seed.filter((p) => !ties[p.id]?.length).sort((a, b) => b.hostLepCount - a.hostLepCount);
  console.log(
    `\n  wildlife — ${links.length} ties (${hosts} of them larval hosts),` +
      ` ${seed.length - untied.length}/${seed.length} plants, ${used.size} animals`,
  );
  if (untied.length) {
    console.log("    plants with no animal named, highest host count first:");
    for (const p of untied) console.log(`      ${num(p.hostLepCount, 5)}  ${p.id}`);
  }
  // An animal is "reachable" here if some *other* region already ties it to a
  // plant this region also ships — the cheapest ties available, needing no new
  // plant row and no new catalog entry.
  const elsewhere = new Map();
  for (const [rid, byPlant] of Object.entries(SUPPORT)) {
    if (rid === meta.id) continue;
    for (const [plantId, ls] of Object.entries(byPlant)) {
      if (!seed.some((p) => p.id === plantId)) continue;
      for (const l of ls) if (!used.has(l.wildlifeId)) {
        if (!elsewhere.has(l.wildlifeId)) elsewhere.set(l.wildlifeId, new Set());
        elsewhere.get(l.wildlifeId).add(plantId);
      }
    }
  }
  if (elsewhere.size) {
    console.log("    animals another region already ties to a plant we ship:");
    for (const [id, plants] of elsewhere) {
      console.log(`      ${pad(wildlifeById.get(id)?.common ?? id, 26)}${[...plants].join(", ")}`);
    }
  }

  console.log(
    `\n  short of §1's floors by ${short} plant rows` +
      ` (forms ≥${FORM_FLOOR}, every site cell ≥${SITE_FLOOR},` +
      ` ≥${BLOOM_FLOOR} in flower ${MONTHS[SEASON[0] - 1]}–${MONTHS[SEASON[1] - 1]}).`,
  );
  console.log(`  ${untied.length} of its ${seed.length} plants name no animal at all.`);
}
console.log("");
