// Reconcile the registry's external identifiers. For each taxon we resolve the
// bag of persistent, globally-recognized ids and write them into
// data/registry.overrides.json; `npm run registry:build` then bakes them into
// the registry and derives each entry's `primaryId` (the IPNI CURIE anchor).
//
//   npm run reconcile              # all taxa, write overrides
//   npm run reconcile -- --dry-run # print, don't write
//   npm run reconcile -- --name "Quercus garryana"   # one taxon (sanity check)
//   npm run reconcile -- --limit 5
//
// Needs network (Wikidata + GBIF). It CANNOT run in the build sandbox, whose
// egress is blocked — run it locally or, preferably, via .github/workflows/
// reconcile.yml (GitHub runners have open internet), which opens a PR with the
// result. Plain JS + Vite loader so it runs on any Node.
//
// Method (the "Wikidata hub, verify the load-bearing ones" approach):
//   1. One SPARQL query maps each scientific name → its Wikidata item and, in a
//      single hit, IPNI / WFO / GBIF / USDA / ITIS ids.
//   2. The GBIF usageKey is re-fetched from GBIF's own match API (authoritative
//      for that key, which can drift), overriding whatever Wikidata had.
//   3. IPNI is the anchor; POWO links derive from it, so no separate POWO id is
//      stored.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const UA =
  "IndigeneRegistryReconcile/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";
const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";
const GBIF_MATCH = "https://api.gbif.org/v1/species/match";

// Wikidata property ids for each identifier scheme. If a scheme ever stops
// resolving, verify its P-number here (Wikidata property pages) — these are the
// single point to correct.
const PROPS = {
  ipni: "P961", // IPNI plant ID
  wfo: "P7715", // World Flora Online ID
  gbif: "P846", // GBIF taxon ID (re-verified against GBIF below)
  usda: "P1772", // USDA PLANTS ID
  itis: "P815", // ITIS TSN
  inat: "P3151", // iNaturalist taxon ID (for a direct species-page link)
};

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes("--dry-run");
const onlyName = flag("--name");
const limit = flag("--limit") ? Number(flag("--limit")) : undefined;

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
await loader.close();

let names = REGISTRY.map((e) => e.scientificName);
if (onlyName) names = names.filter((n) => n.toLowerCase() === onlyName.toLowerCase());
if (limit) names = names.slice(0, limit);
if (!names.length) {
  console.error("No taxa to reconcile.");
  process.exit(1);
}
console.log(`Reconciling ${names.length} taxa …`);

// --- 1) Wikidata: one query for the whole bag --------------------------------
function sparqlFor(batch) {
  const values = batch.map((n) => `"${n.replace(/"/g, '\\"')}"`).join(" ");
  const vars = Object.keys(PROPS).map((k) => `?${k}`).join(" ");
  const opt = Object.entries(PROPS)
    .map(([k, p]) => `  OPTIONAL { ?item wdt:${p} ?${k}. }`)
    .join("\n");
  return `SELECT ?item ?taxonName ${vars} WHERE {
  VALUES ?taxonName { ${values} }
  ?item wdt:P225 ?taxonName .
${opt}
}`;
}

async function queryWikidata(batch) {
  const res = await fetch(WIKIDATA_SPARQL, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      Accept: "application/sparql-results+json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ query: sparqlFor(batch) }),
  });
  if (!res.ok) throw new Error(`Wikidata SPARQL ${res.status} ${res.statusText}`);
  const json = await res.json();
  const out = new Map(); // scientificName → { wikidata, ipni, wfo, gbif, usda, itis }
  for (const b of json.results.bindings) {
    const name = b.taxonName?.value;
    if (!name) continue;
    const rec = out.get(name) ?? {};
    if (b.item?.value) rec.wikidata = b.item.value.split("/").pop();
    for (const k of Object.keys(PROPS)) if (b[k]?.value && rec[k] == null) rec[k] = b[k].value;
    out.set(name, rec);
  }
  return out;
}

// Wikidata handles ~one big query fine; keep batches modest anyway.
const wd = new Map();
for (let i = 0; i < names.length; i += 60) {
  const batch = names.slice(i, i + 60);
  try {
    for (const [k, v] of await queryWikidata(batch)) wd.set(k, v);
  } catch (e) {
    console.warn(`  Wikidata batch ${i}-${i + batch.length} failed: ${e.message}`);
  }
}

// --- 2) GBIF: authoritative usageKey per name --------------------------------
async function gbifKey(name) {
  try {
    const res = await fetch(`${GBIF_MATCH}?name=${encodeURIComponent(name)}&strict=false`, {
      headers: { "User-Agent": UA },
    });
    if (!res.ok) return undefined;
    const j = await res.json();
    return j && j.matchType && j.matchType !== "NONE" && j.usageKey ? String(j.usageKey) : undefined;
  } catch {
    return undefined;
  }
}

// --- 3) Merge into overrides -------------------------------------------------
const overridesPath = fileURLToPath(new URL("../src/data/registry.overrides.json", import.meta.url));
const overrides = JSON.parse(readFileSync(overridesPath, "utf8"));

let resolved = 0;
const unresolved = [];
for (const name of names) {
  const rec = wd.get(name) ?? {};
  const gbif = (await gbifKey(name)) ?? rec.gbif; // GBIF's own key wins; fall back to Wikidata's
  const ids = {};
  for (const k of ["ipni", "wfo", "usda", "itis", "inat"]) if (rec[k]) ids[k] = String(rec[k]);
  if (gbif) ids.gbif = String(gbif);
  if (rec.wikidata) ids.wikidata = rec.wikidata;

  if (!ids.ipni && !ids.wfo) {
    unresolved.push(name); // no anchor found — leave it for a human
    continue;
  }
  resolved++;
  const existing = overrides[name] ?? {};
  overrides[name] = { ...existing, identifiers: { ...(existing.identifiers ?? {}), ...ids } };
  console.log(`  ${name.padEnd(30)} ipni:${ids.ipni ?? "-"} wfo:${ids.wfo ?? "-"} gbif:${ids.gbif ?? "-"} usda:${ids.usda ?? "-"}`);
}

console.log(`\nResolved ${resolved}/${names.length} (anchor found). Unresolved: ${unresolved.length}`);
if (unresolved.length) console.log("  " + unresolved.join("\n  "));

if (dryRun) {
  console.log("\n--dry-run: overrides not written.");
} else {
  writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + "\n");
  console.log(`\nWrote ${overridesPath}. Now run: npm run registry:build && npm run registry:check`);
}
