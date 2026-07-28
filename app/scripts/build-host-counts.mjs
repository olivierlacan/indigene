// Derive the European `hostLepCount` from the Gaytán et al. 2026 species-level
// European Lepidoptera–plant association matrix (Ecology & Evolution,
// doi:10.1002/ece3.73004; CC-BY 4.0). For every plant *genus* in our European
// region files it counts the distinct Lepidoptera species associated with that
// genus — the same quantity the US regions carry, so the log-normalization in
// `lib/plants.ts` (against the shared HOST_ANCHOR) keeps every region on one
// scale and US scores don't move.
//
//   node app/scripts/build-host-counts.mjs
//
// The raw matrix (~34 MB) lives git-ignored in data/sources/eu-lep-plant-matrix/
// (see that folder's README). This script streams it, writes a small, committed
// provenance table (host-counts.by-genus.json), and prints a per-plant
// current-vs-proposed table for human review. It does NOT edit the region files
// — applying the numbers is a reviewed step, because a few genera need judgment.
//
// ── STATUS: starter, run + verify locally with the data in hand ──
// This was authored without the CSV present (the build sandbox can't reach
// Zenodo). Two things to confirm against the real file before trusting output:
//   1. That the matrix records LARVAL-HOST (herbivory) associations, not adult
//      nectar — `hostLepCount` claims "caterpillars that eat this leaf." Read
//      zenodo-readme.md. If it mixes interaction types, filter to the host/larval
//      one (see ASSOC_TYPE_FILTER below).
//   2. The column/orientation auto-detect picked the right axes (it prints them).
import { createReadStream, existsSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MATRIX_DIR = join(REPO, "data", "sources", "eu-lep-plant-matrix");
const REGION_GLOB = join(REPO, "app", "src", "data"); // plants.*.ts
const OUT = join(MATRIX_DIR, "host-counts.by-genus.json");

// If the matrix distinguishes interaction types and you must keep only larval
// hosts, set this to a predicate on the type string; null = keep every row.
const ASSOC_TYPE_FILTER = null; // e.g. (t) => /larva|host|foodplant/i.test(t)

// A few genus aliases where our name and the matrix's may differ (extend as the
// real data shows — the script prints genera it saw but couldn't place).
const GENUS_ALIASES = new Map([
  ["Frangula", "Rhamnus"], // Frangula alnus is often filed under Rhamnus
  ["Mahonia", "Berberis"],
]);

// ── 1. Which genera do our European (EEA) region files actually need? ──
function europeanGenera() {
  const byGenus = new Map(); // genus -> [{id, region}]
  for (const file of readdirSync(REGION_GLOB).filter((f) => /^plants\..+\.ts$/.test(f))) {
    const text = readFileSync(join(REGION_GLOB, file), "utf8");
    if (!/provider:\s*["']eea-biogeo["']/.test(text)) continue; // European regions only
    const region = file.replace(/^plants\.|\.ts$/g, "");
    for (const m of text.matchAll(/id:\s*"([^"]+)"[\s\S]*?latin:\s*"([A-Z][a-z]+)\s+[a-z]/g)) {
      const [, id, genus] = m;
      if (!byGenus.has(genus)) byGenus.set(genus, []);
      byGenus.get(genus).push({ id, region });
    }
  }
  return byGenus;
}

// Normalize a plant name to its genus, applying aliases.
const generaKeys = (want) => new Set([...want.keys(), ...GENUS_ALIASES.keys()]);
function toGenus(name, wantSet) {
  const g = String(name).trim().split(/\s+/)[0];
  const canon = GENUS_ALIASES.get(g) ?? g;
  return wantSet.has(g) || wantSet.has(canon) ? canon : null;
}

function findMatrixCsv() {
  if (!existsSync(MATRIX_DIR)) throw new Error(`missing ${MATRIX_DIR}`);
  const csvs = readdirSync(MATRIX_DIR).filter((f) => f.toLowerCase().endsWith(".csv"));
  // Prefer the associations file by name, else the largest CSV.
  return (
    csvs.find((f) => /lepidoptera.*plant|associations/i.test(f)) ??
    csvs.sort((a, b) => a.length - b.length).at(-1)
  );
}

const splitCsv = (line) => line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
const truthy = (v) => v && v !== "0" && v !== "0.0" && !/^(na|null|false)$/i.test(v);

async function main() {
  const want = europeanGenera();
  const wantSet = generaKeys(want);
  if (!want.size) throw new Error("No EEA-region plant files found — nothing to count.");
  const csv = findMatrixCsv();
  if (!csv) throw new Error(`No CSV in ${MATRIX_DIR}. Put the Zenodo files there (see README).`);
  console.log(`matrix: ${csv}`);
  console.log(`genera wanted (${want.size}):`, [...want.keys()].sort().join(", "));

  const rl = createInterface({ input: createReadStream(join(MATRIX_DIR, csv)), crlfDelay: Infinity });
  let header = null, mode = null, plantAxis = null, lepIdx = null, plantIdx = null, typeIdx = null;
  const perGenus = new Map(); // genus -> Set(lepSpecies)
  const add = (genus, lep) => { if (!perGenus.has(genus)) perGenus.set(genus, new Set()); perGenus.get(genus).add(lep); };
  let n = 0;

  for await (const line of rl) {
    const cols = splitCsv(line);
    if (!header) {
      header = cols;
      // Orientation/format auto-detect. Wide 0/1 matrix has one taxon per row and
      // many taxa across the header; long edge-list has a few named columns.
      if (header.length > 50) {
        mode = "wide";
        const headerHits = header.filter((h) => toGenus(h, wantSet)).length;
        plantAxis = headerHits > 0 ? "cols" : "rows"; // our genera on the header → plants are columns
        console.log(`format: wide matrix, plants on ${plantAxis} (header genus hits: ${headerHits})`);
      } else {
        mode = "long";
        const find = (re) => header.findIndex((h) => re.test(h));
        plantIdx = find(/plant|host|foodplant/i);
        lepIdx = find(/lepidopter|moth|butterfl|species/i);
        typeIdx = find(/type|interaction|rel/i);
        console.log(`format: long, plantCol=${header[plantIdx]} lepCol=${header[lepIdx]} typeCol=${header[typeIdx] ?? "—"}`);
        if (plantIdx < 0 || lepIdx < 0) throw new Error("Long format: couldn't find plant/lep columns — set them by hand.");
      }
      continue;
    }
    n++;
    if (mode === "long") {
      if (ASSOC_TYPE_FILTER && typeIdx >= 0 && !ASSOC_TYPE_FILTER(cols[typeIdx])) continue;
      const genus = toGenus(cols[plantIdx], wantSet);
      if (genus) add(genus, cols[lepIdx]);
    } else if (plantAxis === "cols") {
      const lep = cols[0];
      for (let i = 1; i < cols.length; i++) if (truthy(cols[i])) {
        const genus = toGenus(header[i], wantSet);
        if (genus) add(genus, lep);
      }
    } else { // wide, plants on rows
      const genus = toGenus(cols[0], wantSet);
      if (genus) for (let i = 1; i < cols.length; i++) if (truthy(cols[i])) add(genus, header[i]);
    }
  }
  console.log(`scanned ${n} data rows`);

  // ── 3. Emit provenance JSON + a review table ──
  const table = {};
  for (const [genus, set] of [...perGenus].sort()) table[genus] = set.size;
  writeFileSync(OUT, JSON.stringify({
    generatedFrom: csv,
    source: "Gaytán et al. 2026, European Lepidoptera–Plant Associations (CC-BY 4.0, doi:10.1002/ece3.73004)",
    metric: "distinct Lepidoptera species associated per plant genus",
    hostAnchorNote: "hostLepCount is the raw count; lib/plants.ts log-normalizes it against the shared HOST_ANCHOR — do not pre-scale.",
    byGenus: table,
  }, null, 2));
  console.log(`\nwrote ${OUT}`);

  console.log("\n── proposed hostLepCount per plant (review before applying) ──");
  const currentCounts = new Map();
  for (const file of readdirSync(REGION_GLOB).filter((f) => /provider.*eea/.test(readFileSync(join(REGION_GLOB, f), "utf8")) && /^plants\./.test(f))) {
    const text = readFileSync(join(REGION_GLOB, file), "utf8");
    for (const m of text.matchAll(/id:\s*"([^"]+)"[\s\S]*?hostLepCount:\s*(\d+)/g)) currentCounts.set(m[1], Number(m[2]));
  }
  for (const [genus, rows] of [...want].sort()) {
    const proposed = table[genus];
    for (const { id, region } of rows) {
      const cur = currentCounts.get(id) ?? "?";
      const mark = proposed == null ? "  (no matrix data — keep estimate)" : "";
      console.log(`  ${region}/${id.padEnd(26)} ${genus.padEnd(14)} current ${String(cur).padStart(4)} → proposed ${String(proposed ?? "—").padStart(4)}${mark}`);
    }
  }
  const unplaced = [...perGenus.keys()].filter((g) => !want.has(g));
  if (unplaced.length) console.log("\nnote: counted genera not matched to a plant id (check aliases):", unplaced.join(", "));
}

main().catch((e) => { console.error("\nbuild-host-counts failed:", e.message); process.exit(1); });
