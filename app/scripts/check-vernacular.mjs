// Verify (and gap-fill) the localized vernacular names in
// `app/src/locales/taxa.<lang>.ts` against the reference lists they claim to
// come from.
//
//   node app/scripts/check-vernacular.mjs                 # verify everything
//   node app/scripts/check-vernacular.mjs --lang fr       # one language
//   node app/scripts/check-vernacular.mjs --missing       # only report gaps
//   node app/scripts/check-vernacular.mjs --name "Quercus robur"
//   node app/scripts/check-vernacular.mjs --json          # machine-readable
//
// **Why this exists.** A plant's name in another language is not a translation —
// it's a lookup in that country's own reference list. The table is hand-seeded
// from those lists (they're the sort of reference a botanist reads, not an API
// you can page through cheaply), and this script is what keeps the claim
// honest: it re-asks each authority and reports every row the source doesn't
// confirm, plus every taxon that has a name upstream but no row here.
//
// **It needs open internet, which the build sandbox does not have** — TAXREF,
// VASCAN and Wikidata all refuse the agent egress. Same situation as
// `reconcile.mjs`: run it locally, or let `.github/workflows/vernacular.yml`
// run it on a GitHub runner and open a PR with the result. The snapshot it
// writes to `data/sources/vernacular-names/` is committed, so upstream drift
// shows up in a diff instead of going unnoticed.
//
// Authorities, in the order a name is trusted:
//   1. TAXREF (INPN/MNHN)  — flora *and* fauna of France. `frenchVernacularName`.
//   2. Tela Botanica BDTFX — French flora vernacular names (cross-check).
//   3. VASCAN (Canadensys) — French names for North American plants.
//   4. Wikidata            — `P1843` (taxon common name) + the `fr` label.
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { openLoader } from "./_load-ts.mjs";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(REPO_ROOT, "data", "sources", "vernacular-names");

const UA =
  "IndigeneVernacularCheck/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

const TAXREF_SEARCH = "https://taxref.mnhn.fr/api/taxa/search";
const VASCAN_SEARCH = "https://data.canadensys.net/vascan/api/0.1/search.json";
const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const lang = flag("--lang") ?? "fr";
const onlyName = flag("--name");
const missingOnly = args.includes("--missing");
const asJson = args.includes("--json");

const loader = await openLoader();

/** The table under test, plus every taxon the app can display. */
const table = (await loader.load(`/src/locales/taxa.${lang}.ts`))[`TAXA_${lang.toUpperCase()}`];
const { REGIONS } = await loader.load("/src/data/regions.ts");
const { WILDLIFE } = await loader.load("/src/data/wildlife.ts");
const { LOOKALIKES } = await loader.load("/src/data/lookalikes.ts");

/** Every scientific name the app shows, deduped — plants, animals, impostors.
 *  The look-alikes count: they are named on a plant's page exactly as the plant
 *  is, so a French reader is owed the same "looked up, never invented" name. */
function allTaxa() {
  const seen = new Map();
  for (const r of REGIONS) {
    for (const p of r.seed) {
      if (!seen.has(p.latin)) seen.set(p.latin, { latin: p.latin, kind: "plant", common: p.common });
    }
  }
  for (const w of WILDLIFE ?? []) {
    const key = w.latin ?? `#${w.id}`;
    if (!seen.has(key)) seen.set(key, { latin: key, kind: "animal", common: w.common });
  }
  for (const l of LOOKALIKES ?? []) {
    if (!seen.has(l.latin)) seen.set(l.latin, { latin: l.latin, kind: "lookalike", common: l.common });
  }
  return [...seen.values()].filter((t) => !onlyName || t.latin === onlyName);
}

async function getJson(url, headers = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json", ...headers },
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

/** TAXREF: the French national reference. Authoritative for French taxa. */
async function fromTaxref(latin) {
  const url = `${TAXREF_SEARCH}?scientificNames=${encodeURIComponent(latin)}&page=1&size=1`;
  const data = await getJson(url);
  const hit = data?._embedded?.taxa?.[0];
  const name = hit?.frenchVernacularName;
  // TAXREF returns several names separated by commas; the first is the one the
  // référentiel leads with, which is what a field guide prints.
  return name ? String(name).split(",")[0].trim() : null;
}

/** VASCAN: standard French names for North American vascular plants. */
async function fromVascan(latin) {
  const data = await getJson(`${VASCAN_SEARCH}?q=${encodeURIComponent(latin)}`);
  const matches = data?.results?.[0]?.matches?.[0]?.vernacularNames ?? [];
  const fr = matches.find((v) => v.language === "fr" && v.status === "accepted")
    ?? matches.find((v) => v.language === "fr");
  return fr?.vernacularName ?? null;
}

/** Wikidata: the `fr` label and P1843 (taxon common name), as a last resort. */
async function fromWikidata(latin) {
  const query = `
    SELECT ?label ?common WHERE {
      ?item wdt:P225 "${latin.replace(/"/g, "")}" .
      OPTIONAL { ?item rdfs:label ?label . FILTER(LANG(?label) = "fr") }
      OPTIONAL { ?item wdt:P1843 ?common . FILTER(LANG(?common) = "fr") }
    } LIMIT 1`;
  const url = `${WIKIDATA_SPARQL}?format=json&query=${encodeURIComponent(query)}`;
  const data = await getJson(url);
  const row = data?.results?.bindings?.[0];
  return row?.common?.value ?? row?.label?.value ?? null;
}

const LOOKUPS = { taxref: fromTaxref, vascan: fromVascan, wikidata: fromWikidata };

/** Loose comparison: accents, case, hyphens and articles shouldn't count as a
 *  mismatch — "Chêne pédonculé" and "chene pedoncule" are the same name. */
function same(a, b) {
  const norm = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[-'’]/g, " ").replace(/\s+/g, " ").trim();
  return norm(a) === norm(b);
}

const report = { lang, checked: 0, confirmed: [], mismatched: [], unconfirmed: [], missing: [] };
/** How many upstream answers we got at all. Zero means the network is blocked,
 *  not that every list is silent — see the guard before the snapshot is written. */
let upstreamAnswers = 0;

for (const taxon of allTaxa()) {
  // Informal groups (`#slug`) are Indigene's own labels, not taxa — nobody
  // upstream has a name for "Jays, turkeys & woodpeckers", and that's fine.
  if (taxon.latin.startsWith("#")) continue;
  const row = table[taxon.latin];
  report.checked++;

  // Ask every authority, not just the one the row claims: a row sourced from
  // Wikidata that TAXREF also knows should be *promoted* to TAXREF, and a gap
  // is only a real gap when nobody has a name.
  const found = {};
  for (const [src, fn] of Object.entries(LOOKUPS)) {
    const hit = await fn(taxon.latin);
    if (hit) {
      found[src] = hit;
      upstreamAnswers++;
    }
  }
  const any = Object.entries(found)[0];

  if (!row) {
    if (any) report.missing.push({ latin: taxon.latin, suggested: found, english: taxon.common });
    continue;
  }
  if (missingOnly) continue;

  const upstream = found[row.src];
  if (upstream && same(upstream, row.name)) {
    report.confirmed.push({ latin: taxon.latin, name: row.name, src: row.src });
  } else if (upstream) {
    report.mismatched.push({ latin: taxon.latin, ours: row.name, theirs: upstream, src: row.src });
  } else {
    // The claimed source has nothing. Say whether anyone else does — that's the
    // difference between "wrong source tag" and "we may have made this up".
    report.unconfirmed.push({ latin: taxon.latin, ours: row.name, src: row.src, elsewhere: found });
  }
  void any;
}

// A run where *nothing* answered is a blocked network, not a verdict — and
// writing "0 confirmed, 0 disagreements" would look exactly like a clean bill
// of health in the committed snapshot. Refuse to write one, and say why.
if (report.checked > 0 && upstreamAnswers === 0) {
  console.error(
    "No reference list answered a single lookup — this is a blocked or offline network,\n" +
    "not a result. TAXREF, VASCAN and Wikidata all refuse the build sandbox's egress;\n" +
    "run this locally or via .github/workflows/vernacular.yml. Nothing was written."
  );
  await loader.close();
  process.exit(2);
}

mkdirSync(OUT_DIR, { recursive: true });
const outFile = join(OUT_DIR, `${lang}.json`);
writeFileSync(outFile, JSON.stringify(report, null, 2) + "\n");

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Checked ${report.checked} taxa for "${lang}".`);
  console.log(`  ✓ confirmed by their own source: ${report.confirmed.length}`);
  console.log(`  ≠ disagree with their source:    ${report.mismatched.length}`);
  console.log(`  ? source had nothing to say:     ${report.unconfirmed.length}`);
  console.log(`  + upstream has a name we lack:   ${report.missing.length}`);
  for (const m of report.mismatched) {
    console.log(`    ≠ ${m.latin}: ours "${m.ours}" vs ${m.src} "${m.theirs}"`);
  }
  for (const u of report.unconfirmed) {
    const other = Object.keys(u.elsewhere).join(", ") || "nobody";
    console.log(`    ? ${u.latin}: "${u.ours}" tagged ${u.src}; found by: ${other}`);
  }
  for (const g of report.missing.slice(0, 40)) {
    console.log(`    + ${g.latin} (${g.english}) → ${JSON.stringify(g.suggested)}`);
  }
  console.log(`\nSnapshot written to ${outFile}`);
}

await loader.close();

// A disagreement is a real problem — the app is asserting a name the authority
// doesn't back. Gaps are not: plenty of taxa have no French name, and we show
// the scientific name for those on purpose.
process.exit(report.mismatched.length ? 1 : 0);
