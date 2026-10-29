// `npm run taxref:extract` — reduce the official TAXREF download to the rows
// this app names, so the French-name check can read the national reference
// offline, from the file the Muséum publishes, rather than from a mirror.
//
//   npm run taxref:extract                      # finds data/sources/taxref/TAXREFv*.txt
//   npm run taxref:extract -- --fetch           # download the zip first (60 MB)
//   npm run taxref:extract -- --file path/to/TAXREFv18.txt
//
// ## Where the table comes from
//
// TAXREF is published as a zipped tab-separated table (about 700,000 rows, a
// third of a gigabyte unpacked). Its home at inpn.mnhn.fr sits behind a
// browser challenge that refuses scripts, but since the MNHN's 2025 outage
// PatriNat serves the same zip from a plain asset host, and `--fetch` takes it
// from there (`TAXREF_ZIP` below). If that address ever stops answering, a
// browser can still download it from the INPN page and drop the `.txt` into
// `data/sources/taxref/`, which is git-ignored. Same arrangement either way as
// the Gaytán matrix (`eu-lep-plant-matrix/`): the big file stays out of the
// repo, and this script commits the small, reviewable part the app depends on.
//
// ## What it writes
//
// `data/sources/taxref/extract.json`: for every scientific name the app shows
// (plants, animals, impostors, invasives), the TAXREF row it resolves to — its
// CD_NOM, the accepted CD_REF, the accepted name, the rank, and the French
// names TAXREF gives the accepted taxon, in TAXREF's order (the first is the
// one the référentiel leads with). A few hundred rows. `check-vernacular.mjs`
// prefers this file when it exists and falls back to GBIF's copy of TAXREF
// when it doesn't, saying which in the snapshot's health block.
//
// Columns are found by header name, never by position: TAXREF has added
// columns between versions and will again. A header without CD_NOM, CD_REF,
// LB_NOM, RANG or NOM_VERN is refused with the headers it did find.
import { createReadStream, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { basename, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";
import { requireProxyAwareFetch } from "./_net.mjs";

const DIR = fileURLToPath(new URL("../../data/sources/taxref/", import.meta.url));
const OUT = join(DIR, "extract.json");

/** The current release, as PatriNat serves it. Listed on
 *  https://www.patrinat.fr/fr/page-temporaire-de-telechargement-des-referentiels-de-donnees-lies-linpn-7353
 *  — bump the file name when a new TAXREF version is published. */
const TAXREF_ZIP = "https://assets.patrinat.fr/files/referentiel/TAXREF_v18_2025.zip";

const args = process.argv.slice(2);
const fileArg = args[args.indexOf("--file") + 1];
const findTable = () =>
  readdirSync(DIR).filter((f) => /^TAXREFv[\d.]+\.txt$/i.test(f)).sort().map((f) => join(DIR, f)).pop();

if (args.includes("--fetch")) {
  requireProxyAwareFetch("taxref:extract -- --fetch");
  mkdirSync(DIR, { recursive: true });
  const zip = join(DIR, basename(TAXREF_ZIP));
  console.log(`Fetching ${TAXREF_ZIP} …`);
  const res = await fetch(TAXREF_ZIP, { headers: { "User-Agent": "IndigeneTaxrefExtract/0.1 (https://github.com/olivierlacan/indigene)" } });
  if (!res.ok) {
    console.error(`download failed: HTTP ${res.status}. Download it in a browser instead and put TAXREFv<N>.txt in ${DIR}.`);
    process.exit(2);
  }
  writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  // Only the main table: the zip also carries 350 MB of links and changes.
  execFileSync("unzip", ["-o", "-q", zip, "TAXREFv*.txt", "-d", DIR]);
  console.log(`Unpacked ${findTable()}`);
}

const file = args.includes("--file") && fileArg ? fileArg : findTable();
if (!file || !existsSync(file)) {
  console.error(
    "No TAXREF table found. Run with --fetch, or download the current version from\n" +
      "  https://inpn.mnhn.fr/telechargement/referentielEspece/referentielTaxo\n" +
      "in a browser (the site challenges scripts), unzip it, and put\n" +
      "TAXREFv<N>.txt in data/sources/taxref/ — or pass --file <path>.",
  );
  process.exit(2);
}
const version = (basename(file).match(/v([\d.]+)\.txt$/i) ?? [])[1] ?? "unknown";

// Every scientific name the app can show — the same set `check-vernacular.mjs`
// asks about, built the same way.
const loader = await openLoader();
const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(REGIONS_RAW);
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { LOOKALIKES } = await loader.load("/src/data/lookalikes.ts");
const { INVASIVES } = await loader.load("/src/data/invasives.ts");
await loader.close();
const wanted = new Set();
for (const r of REGIONS) for (const p of r.seed) wanted.add(p.latin);
for (const w of WILDLIFE ?? []) {
  if (w.latin) wanted.add(w.latin);
  // A group's member species, which the wildlife native check asks about.
  for (const m of w.members ?? []) wanted.add(m);
}
for (const l of LOOKALIKES ?? []) wanted.add(l.latin);
for (const i of INVASIVES ?? []) wanted.add(i.latin);

// TAXREF writes "subsp." and "var." the way we do, and an aggregate like
// "Rubus fruticosus agg." is not a TAXREF name at all; ask for the binomial
// in that one case and record what was asked.
const askedName = (latin) => latin.replace(/\s+agg\.$/, "").trim();
const byAsked = new Map([...wanted].map((l) => [askedName(l), l]));

console.log(`TAXREF v${version}: ${file}`);
console.log(`Looking for ${wanted.size} names the app shows.\n`);

// One pass over the whole table. Rows whose LB_NOM we want are kept, and so is
// every row some kept row's CD_REF points at (the accepted taxon, where ours is
// a synonym) — but we only learn the latter as we go, so the accepted rows are
// collected in a second, cheap pass over the lines we remembered.
let header = null;
let col = null;
const hits = new Map(); // LB_NOM → row
const refs = new Map(); // CD_NOM → row, for every row (small fields only)
let rows = 0;
const rl = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
for await (const line of rl) {
  if (!header) {
    header = line.replace(/^\uFEFF/, "").split("\t").map((h) => h.replace(/^"|"$/g, ""));
    const need = ["CD_NOM", "CD_REF", "LB_NOM", "RANG", "NOM_VERN"];
    col = Object.fromEntries(need.map((n) => [n, header.indexOf(n)]));
    // Status in metropolitan France — optional, so an older table still reads.
    col.FR = header.indexOf("FR");
    const missing = need.filter((n) => col[n] < 0);
    if (missing.length) {
      console.error(`Not a TAXREF table I can read: missing ${missing.join(", ")}.\nHeaders found: ${header.join(", ")}`);
      process.exit(2);
    }
    continue;
  }
  if (!line) continue;
  rows++;
  // Strings are double-quoted in the table ("Quercus robur"), numbers are not.
  const f = line.split("\t").map((v) => (v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v));
  const cdNom = f[col.CD_NOM];
  const slim = { cdNom, cdRef: f[col.CD_REF], name: f[col.LB_NOM], rank: f[col.RANG], vern: f[col.NOM_VERN] ?? "", fr: col.FR >= 0 ? f[col.FR] : "" };
  refs.set(cdNom, slim);
  if (byAsked.has(slim.name)) {
    // Prefer the accepted row when a name appears more than once (TAXREF
    // carries homonyms under different authors; the accepted one is the
    // référentiel's meaning of the name).
    const prev = hits.get(slim.name);
    if (!prev || (slim.cdNom === slim.cdRef && prev.cdNom !== prev.cdRef)) hits.set(slim.name, slim);
  }
}

const extract = {};
let found = 0;
let viaSynonym = 0;
for (const [asked, latin] of byAsked) {
  const row = hits.get(asked);
  if (!row) continue;
  const accepted = refs.get(row.cdRef) ?? row;
  if (accepted !== row) viaSynonym++;
  found++;
  extract[latin] = {
    asked: asked === latin ? undefined : asked,
    cdNom: Number(row.cdNom),
    cdRef: Number(row.cdRef),
    accepted: accepted.name,
    rank: accepted.rank,
    // TAXREF lists several names in one cell, its own first.
    french: accepted.vern ? accepted.vern.split(",").map((s) => s.trim()).filter(Boolean) : [],
    // TAXREF's biogeographic status in metropolitan France, on the accepted
    // taxon: P present (native), E endemic, S subendemic, C cryptogenic,
    // I introduced, J introduced invasive, M introduced but not established
    // (cultivated or domestic), B occasional, D doubtful, A absent, W/X extinct… The wildlife native check reads it (`_fauna.mjs`).
    fr: accepted.fr || undefined,
  };
}

writeFileSync(
  OUT,
  JSON.stringify(
    {
      source: "TAXREF — Référentiel taxonomique national (INPN / MNHN)",
      version,
      file: basename(file),
      license: "Licence Ouverte / Etalab",
      extractedAt: new Date().toISOString().slice(0, 10),
      rowsInTable: rows,
      method:
        "LB_NOM matched exactly to each scientific name the app shows; the accepted row (CD_REF) supplies the French names, in TAXREF's own order, and its status in metropolitan France (FR). Only the names the app shows are kept.",
      taxa: Object.fromEntries(Object.entries(extract).sort(([a], [b]) => a.localeCompare(b))),
    },
    null,
    2,
  ) + "\n",
);

const withFrench = Object.values(extract).filter((t) => t.french.length).length;
console.log(`${rows.toLocaleString()} rows read; ${found} of ${wanted.size} names found (${viaSynonym} via a synonym), ${withFrench} with a French name.`);
console.log(`Wrote ${OUT} — commit it.`);
