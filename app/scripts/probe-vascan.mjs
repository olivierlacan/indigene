// Probe VASCAN — the Database of Vascular Plants of Canada — for the two claims a
// Canadian region would need it to hold, and write the answers down.
//
//   npm run probe:vascan
//
// `DATA_SOURCES.md` already judged VASCAN once and **refused** it: its *noms
// français normalisés* are Canadian French, and the French edition is fr-FR, so
// it was the right list in the wrong place. That refusal was about one claim.
// This probe puts two different ones to it, the ones a British Columbia or
// Québec list would rest on:
//
//   Q1. **"Native here" per province.** Does VASCAN give an establishment means
//       per province for the plants we already ship — the Canadian equivalent of
//       USDA PLANTS' state-level status? And if so, how much of each candidate
//       province's list is *already written*, in rows that already carry sizes,
//       scores, care notes, wildlife ties and photographs?
//   Q2. **A name for the rows fr-FR can't source.** `taxa.fr.ts` shows 87 names
//       marked `pending` — mostly North American plants no fr-FR reference list
//       covers. How many of them does VASCAN name, and on how many does it
//       disagree with what we display? A disagreement is the fr-FR/fr-CA split
//       showing up as data, which is the case for a separate table rather than a
//       reason to distrust either one.
//
// What this probe deliberately does **not** answer: whether a Canadian point can
// be resolved to an ecoregion at all. The EPA service is conterminous-US only
// (`probe-cec.mjs` is the one that asks that question), and without an answer
// there a Canadian region would select on its bounding box alone — a step down
// from every region we ship. That gate comes first; this one sizes the prize.
//
// ## Why the archive and not the API
//
// The obvious approach — one `search.json` call per plant — is wrong, and
// quietly so. **VASCAN records distribution on the taxon that has it**, which
// for a species with named varieties is the *variety*, not the species. So
// `?q=Pseudotsuga menziesii` returns an accepted species with an empty
// `distribution`, and a naive probe concludes Douglas-fir is not native to
// British Columbia. It reported exactly that before this was caught.
//
// So we read the Darwin Core Archive instead and roll each species up over its
// own infraspecific taxa. It is also one download rather than 375 requests.
// (The API has a second trap worth knowing: repeated `q=` parameters are joined
// into one comma-separated search term rather than treated as a batch, so a
// "batched" call quietly returns one result for a nonsense name.)
//
// Writes data/sources/vascan/probe.json (committed — see that folder's README).
// The archive itself is git-ignored.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { requireProxyAwareFetch } from "./_net.mjs";
import { openVascan, PROVINCE_NAMES } from "./_vascan.mjs";

requireProxyAwareFetch("probe:vascan");

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA_DIR = join(REPO_ROOT, "app", "src", "data");
const LOCALE_FILE = join(REPO_ROOT, "app", "src", "locales", "taxa.fr.ts");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "vascan");
const OUT_FILE = join(OUT_DIR, "probe.json");
const ARCHIVE_URL = "https://data.canadensys.net/ipt/archive.do?r=vascan";
const ARCHIVE_DIR = join(OUT_DIR, "dwca");

// The provinces worth asking about: the candidate regions' ground, plus enough
// neighbours to show how far a list would travel.
const PROVINCES = ["BC", "QC", "ON", "NB", "NS", "PE", "AB", "MB", "SK"];

/** Download and unpack the Darwin Core Archive unless it's already here. */
async function ensureArchive() {
  if (existsSync(join(ARCHIVE_DIR, "taxon.txt"))) {
    console.log("Using the archive already in data/sources/vascan/dwca/.");
    return;
  }
  console.log(`Fetching ${ARCHIVE_URL} …`);
  const res = await fetch(ARCHIVE_URL);
  if (!res.ok) throw new Error(`archive download failed: HTTP ${res.status}`);
  const zip = join(OUT_DIR, "vascan-dwca.zip");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  mkdirSync(ARCHIVE_DIR, { recursive: true });
  execFileSync("unzip", ["-o", "-q", zip, "-d", ARCHIVE_DIR]);
  console.log("Unpacked.");
}

/** A Darwin Core star-file: tab-separated, one header row, no quoting. */
function readDwc(file) {
  const lines = readFileSync(join(ARCHIVE_DIR, file), "utf8").split("\n");
  const cols = lines[0].split("\t");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const parts = lines[i].split("\t");
    const row = {};
    for (let c = 0; c < cols.length; c++) row[cols[c]] = parts[c] ?? "";
    rows.push(row);
  }
  return rows;
}

/** Every `latin:` in a region's plant list, in file order. */
function latinNames(file) {
  const src = readFileSync(join(DATA_DIR, file), "utf8");
  return [...src.matchAll(/^\s*latin:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

/** The fr-FR rows that have no fr-FR source yet. */
function pendingFrenchRows() {
  const src = readFileSync(LOCALE_FILE, "utf8");
  return [...src.matchAll(/"([^"]+)":\s*\{\s*name:\s*"([^"]+)",\s*src:\s*"pending"\s*\}/g)]
    .map((m) => ({ taxon: m[1], shown: m[2] }))
    .filter((r) => !r.taxon.startsWith("#")); // our own informal group labels
}

async function main() {
  await ensureArchive();

  // Name resolution and the roll-up over varieties and synonyms live in
  // `_vascan.mjs`, shared with `check-vascan.mjs`. They used to be written out
  // twice, and the two copies disagreed: this one had Sitka spruce not native
  // to British Columbia.
  const vascan = openVascan();

  const taxa = readDwc("taxon.txt");
  const vernRows = readDwc("vernacularname.txt");
  const frByTaxon = new Map();
  for (const v of vernRows) {
    if (v.language.toLowerCase() !== "fr") continue;
    const cur = frByTaxon.get(v.id);
    if (!cur || (/^true$/i.test(v.isPreferredName) && !/^true$/i.test(cur.isPreferredName))) frByTaxon.set(v.id, v);
  }

  // --- resolve our catalog against it ------------------------------------
  const files = readdirSync(DATA_DIR).filter((f) => /^plants\..+\.ts$/.test(f));
  const byList = {};
  const catalog = new Set();
  for (const f of files) {
    const id = f.replace(/^plants\.|\.ts$/g, "");
    byList[id] = latinNames(f);
    byList[id].forEach((n) => catalog.add(n));
  }
  const names = [...catalog].sort();
  console.log(`Catalog: ${names.length} distinct plants across ${files.length} lists.`);

  const resolved = {};
  const notInVascan = [];
  for (const n of names) {
    const provs = vascan.provinces(n);
    if (!provs) { notInVascan.push(n); continue; }
    resolved[n] = {
      nativeProvinces: [...provs].filter(([, means]) => means === "native").map(([p]) => p).sort(),
      frenchName:
        (vascan.taxonIdsFor(n) ?? []).map((t) => frByTaxon.get(t)).find(Boolean)
          ?.vernacularName ?? null,
    };
  }

  // `locality` is the province's full name; map to the codes we report on.
  const CODE = PROVINCE_NAMES;
  const nativeIn = (n, code) => !!resolved[n]?.nativeProvinces.includes(CODE[code]);

  const provinces = {};
  for (const code of PROVINCES) {
    const hits = names.filter((n) => nativeIn(n, code));
    provinces[code] = { province: CODE[code], nativeInCatalog: hits.length, plants: hits };
  }
  const perList = {};
  for (const [id, list] of Object.entries(byList)) {
    perList[id] = { rows: list.length };
    for (const code of PROVINCES) perList[id][code] = list.filter((n) => nativeIn(n, code)).length;
  }

  console.log("\nQ1 — plants already in the catalog that VASCAN records as native:");
  for (const code of PROVINCES) {
    console.log(`  ${code.padEnd(4)} ${String(provinces[code].nativeInCatalog).padStart(3)} of ${names.length}`);
  }
  console.log(`  (${notInVascan.length} catalog plants have no VASCAN entry at all — non-Canadian flora.)`);
  console.log("\n  by source list:");
  for (const [id, r] of Object.entries(perList)) {
    console.log(`    ${id.padEnd(22)} (${String(r.rows).padStart(3)} rows)  ` +
      PROVINCES.map((c) => `${c} ${String(r[c]).padStart(3)}`).join("  "));
  }

  // --- Q2: fr-CA names for the rows fr-FR can't source --------------------
  const pending = pendingFrenchRows();
  const naming = { named: 0, differs: [], unnamed: [] };
  for (const row of pending) {
    const fr =
      (vascan.taxonIdsFor(row.taxon) ?? []).map((t) => frByTaxon.get(t)).find(Boolean)
        ?.vernacularName ?? null;
    if (!fr) { naming.unnamed.push(row.taxon); continue; }
    naming.named++;
    if (fr.toLowerCase() !== row.shown.toLowerCase()) {
      naming.differs.push({ taxon: row.taxon, shown: row.shown, vascan: fr });
    }
  }
  console.log(`\nQ2 — of ${pending.length} fr-FR rows marked \`pending\`, VASCAN names ${naming.named}.`);
  console.log(`  identical to what we display: ${naming.named - naming.differs.length}`);
  console.log(`  different (the fr-FR / fr-CA split): ${naming.differs.length}`);
  console.log(`  no French name in VASCAN either: ${naming.unnamed.length}`);

  const report = {
    source: "VASCAN — Database of Vascular Plants of Canada (Canadensys)",
    license: "CC BY 4.0",
    archive: ARCHIVE_URL,
    method:
      "Darwin Core Archive, not the search API: VASCAN records distribution on the taxon that has it, " +
      "so a species with named varieties carries an empty distribution and its varieties carry the real one. " +
      "Each catalog binomial is resolved to its accepted taxon and rolled up over its infraspecific taxa and synonyms.",
    ranAt: new Date().toISOString(),
    catalogSize: names.length,
    notInVascan,
    q1_nativeStatusByProvince: provinces,
    q1_bySourceList: perList,
    q2_frenchNames: {
      pendingRows: pending.length,
      named: naming.named,
      identical: naming.named - naming.differs.length,
      differs: naming.differs,
      unnamed: naming.unnamed,
    },
  };
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT_FILE} — commit it.`);
}

main().catch((e) => {
  console.error("\nProbe failed:", e.message);
  process.exit(1);
});
