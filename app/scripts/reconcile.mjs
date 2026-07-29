// Reconcile the registry's external identifiers. For each taxon we resolve the
// bag of persistent, globally-recognized ids and write them into
// data/registry.overrides.json; `npm run registry:build` then bakes them into
// the registry and derives each entry's `primaryId` (the IPNI CURIE anchor).
//
//   npm run reconcile              # all taxa, write overrides
//   npm run reconcile -- --dry-run # print, don't write
//   npm run reconcile -- --name "Quercus garryana"   # one taxon (sanity check)
//   npm run reconcile -- --limit 5
//   npm run reconcile -- --missing inat   # only taxa that still lack an inat id
//
// Needs network (Wikidata + GBIF + iNaturalist). It CANNOT run in the build
// sandbox, whose egress is blocked — run it locally or, preferably, via
// .github/workflows/reconcile.yml (GitHub runners have open internet), which
// opens a PR with the result. Plain JS + Vite loader so it runs on any Node.
//
// Method (the "Wikidata hub, verify the load-bearing ones" approach):
//   1. One SPARQL query maps each scientific name → its Wikidata item and, in a
//      single hit, IPNI / WFO / GBIF / USDA / ITIS / iNaturalist ids.
//   2. The GBIF usageKey is re-fetched from GBIF's own match API (authoritative
//      for that key, which can drift), overriding whatever Wikidata had.
//   3. Any taxon Wikidata has no iNaturalist id for (P3151 is contributed by
//      hand, so its coverage is patchy — a good few of our natives are missing
//      it) is asked of iNaturalist directly. That id is load-bearing: it's the
//      join between a plant page and the real nearby sightings on it, so a gap
//      means "See it growing near you" silently has nothing to show.
//   4. IPNI is the anchor; POWO links derive from it, so no separate POWO id is
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
const missingScheme = flag("--missing"); // e.g. "inat" — only taxa lacking that id

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
// The app's own iNaturalist client: one implementation of "scientific name →
// taxon id", already used at runtime by the wildlife layer, so the ids this
// script writes are chosen by exactly the rules the app would have applied.
const { buildTaxaUrl, pickTaxon } = await loader.load("/src/lib/inaturalist.ts");
await loader.close();

let entries = REGISTRY;
if (missingScheme) entries = entries.filter((e) => !e.identifiers?.[missingScheme]);
let names = entries.map((e) => e.scientificName);
if (onlyName) names = names.filter((n) => n.toLowerCase() === onlyName.toLowerCase());
if (limit) names = names.slice(0, limit);
if (!names.length) {
  // With --missing, an empty list is the good outcome (the gap is closed), not
  // an error — the CI gap-fill job runs on a schedule and must stay green.
  if (missingScheme) {
    console.log(`Nothing to do: every taxon already has a "${missingScheme}" id.`);
    process.exit(0);
  }
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

// --- 3) iNaturalist: ask it directly for the taxon ids Wikidata didn't have ---
// P3151 is contributed by hand, so Wikidata's coverage of it is patchy while
// iNaturalist's own taxonomy knows every one of these plants. Same call and
// same choice-of-match the app makes at runtime (buildTaxaUrl + pickTaxon,
// scoped to Plantae so a cross-kingdom homonym can't win), so a name that
// iNaturalist only knows as a synonym still lands on the accepted taxon.
//
// iNaturalist asks for well under 100 requests a minute and a real User-Agent;
// one call a second, sequentially, sits comfortably inside that.
const INAT_PAUSE_MS = 1100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Returns { id, matchedName, exact } so the run's log says which taxon it
// landed on, not just a bare number. `exact: false` means iNaturalist filed our
// name as a synonym of something else — usually right (it follows its own
// synonymy), occasionally a judgement call, and always worth a reviewer's eye.
async function inatTaxon(name) {
  const res = await fetch(buildTaxaUrl(name, "Plantae"), { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`iNaturalist taxa ${res.status}`);
  const json = await res.json();
  const id = pickTaxon(json?.results, name);
  if (id == null) return undefined;
  const row = (Array.isArray(json?.results) ? json.results : []).find((r) => r?.id === id);
  const matchedName = typeof row?.name === "string" ? row.name : "";
  return { id: String(id), matchedName, exact: matchedName.toLowerCase() === name.toLowerCase() };
}

const inatFallback = new Map(); // scientificName → id, for names Wikidata missed
const inatSynonyms = []; // matches iNaturalist filed under a different accepted name
const inatWanted = names.filter((n) => !(wd.get(n) ?? {}).inat);
if (inatWanted.length) {
  console.log(`\nAsking iNaturalist for ${inatWanted.length} taxon id(s) Wikidata didn't have …`);
  for (const [i, name] of inatWanted.entries()) {
    if (i) await sleep(INAT_PAUSE_MS);
    try {
      const hit = await inatTaxon(name);
      if (!hit) {
        console.warn(`  no iNaturalist match: ${name}`);
        continue;
      }
      inatFallback.set(name, hit.id);
      if (!hit.exact) inatSynonyms.push(`${name} → ${hit.matchedName || "?"} (${hit.id})`);
    } catch (e) {
      console.warn(`  iNaturalist lookup failed for ${name}: ${e.message}`);
    }
  }
  console.log(`  matched ${inatFallback.size}/${inatWanted.length}`);
  if (inatSynonyms.length) {
    console.log(`  ${inatSynonyms.length} matched under a different accepted name — check these:`);
    console.log("    " + inatSynonyms.join("\n    "));
  }
}

// --- 4) Merge into overrides -------------------------------------------------
const overridesPath = fileURLToPath(new URL("../src/data/registry.overrides.json", import.meta.url));
const overrides = JSON.parse(readFileSync(overridesPath, "utf8"));

let resolved = 0;
const noAnchor = [];
const empty = [];
for (const name of names) {
  const rec = wd.get(name) ?? {};
  const gbif = (await gbifKey(name)) ?? rec.gbif; // GBIF's own key wins; fall back to Wikidata's
  const ids = {};
  for (const k of ["ipni", "wfo", "usda", "itis", "inat"]) if (rec[k]) ids[k] = String(rec[k]);
  if (gbif) ids.gbif = String(gbif);
  if (rec.wikidata) ids.wikidata = rec.wikidata;
  if (!ids.inat && inatFallback.has(name)) ids.inat = inatFallback.get(name);

  // Write whatever we did find, even without an IPNI/WFO anchor. The anchor
  // decides `primaryId`, not whether the rest of the bag is worth keeping: a
  // taxon iNaturalist knows and IPNI doesn't still deserves its sightings link.
  if (!Object.keys(ids).length) {
    empty.push(name); // nothing at all — leave it for a human
    continue;
  }
  if (!ids.ipni && !ids.wfo) noAnchor.push(name);
  else resolved++;
  const existing = overrides[name] ?? {};
  overrides[name] = { ...existing, identifiers: { ...(existing.identifiers ?? {}), ...ids } };
  console.log(`  ${name.padEnd(30)} ipni:${ids.ipni ?? "-"} wfo:${ids.wfo ?? "-"} gbif:${ids.gbif ?? "-"} usda:${ids.usda ?? "-"} inat:${ids.inat ?? "-"}`);
}

console.log(`\nResolved ${resolved}/${names.length} (anchor found).`);
if (noAnchor.length) {
  console.log(`Ids written but no IPNI/WFO anchor: ${noAnchor.length}`);
  console.log("  " + noAnchor.join("\n  "));
}
if (empty.length) {
  console.log(`No identifiers found at all: ${empty.length}`);
  console.log("  " + empty.join("\n  "));
}

if (dryRun) {
  console.log("\n--dry-run: overrides not written.");
} else {
  writeFileSync(overridesPath, JSON.stringify(overrides, null, 2) + "\n");
  console.log(`\nWrote ${overridesPath}. Now run: npm run registry:build && npm run registry:check`);
}

// --- 5) Optional markdown summary --------------------------------------------
// `--summary <path>` writes what the run did in a form the reconcile workflow
// drops straight into its PR body, so a reviewer sees the shape of the change
// (and what still needs a human) without reading a 3,000-line JSON diff.
const summaryPath = flag("--summary");
if (summaryPath) {
  const list = (items) => items.map((n) => `- ${n}`).join("\n");
  const md = [
    `Reconciled **${names.length}** taxa — ${resolved} with an IPNI/WFO anchor.`,
    "",
    `- iNaturalist taxon ids newly resolved: **${inatFallback.size}** (of ${inatWanted.length} Wikidata had none for)`,
    `- Identifiers written without an IPNI/WFO anchor: **${noAnchor.length}**`,
    `- Taxa still with no identifiers at all: **${empty.length}**`,
    ...(inatSynonyms.length
      ? [
          "",
          `<details><summary>Matched under a different accepted name (${inatSynonyms.length}) — worth a look</summary>`,
          "",
          list(inatSynonyms),
          "",
          "</details>",
        ]
      : []),
    ...(empty.length
      ? ["", `<details><summary>No identifiers found (${empty.length})</summary>`, "", list(empty), "", "</details>"]
      : []),
    "",
  ].join("\n");
  writeFileSync(summaryPath, md);
  console.log(`Wrote summary to ${summaryPath}`);
}
