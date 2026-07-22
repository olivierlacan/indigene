// Runnable audit of the generated registry (the repo's no-test-runner pattern).
// Confirms the registry covers every catalog plant, stays self-consistent, and
// that plant-first lookups resolve as intended.
//
//   npm run registry:check
//
// Plain JS + Vite's ssrLoadModule (via _load-ts.mjs) so it runs on any Node
// version without native TypeScript support.
import { openLoader } from "./_load-ts.mjs";

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { buildIndex, resolveName, entryById, deepLinks, auditRegistry } = await loader.load(
  "/src/lib/registry-core.ts",
);
const coverage = [];
for (const id of ["mid-atlantic", "pnw", "florida", "florida-south"]) {
  const { REGION, SEED_RAW } = await loader.load(`/src/data/plants.${id}.ts`);
  for (const p of SEED_RAW) coverage.push({ regionId: REGION.id, plantId: p.id, scientificName: p.latin });
}
await loader.close();

const index = buildIndex(REGISTRY);
let failures = 0;
function check(label, cond, detail) {
  if (!cond) failures++;
  console.log(`${cond ? "  ok" : "FAIL"}  ${label}${cond ? "" : `  → ${JSON.stringify(detail)}`}`);
}

// --- Coverage + self-consistency (the audit) ---------------------------------
const audit = auditRegistry(REGISTRY, coverage);
check(`every catalog plant (${coverage.length} rows) has a matching entry`, audit.issues.length === 0, audit.issues.slice(0, 5));
check("registry has entries", REGISTRY.length > 0, REGISTRY.length);
check("dedup: fewer entries than catalog rows (cross-region taxa merged)", REGISTRY.length < coverage.length, {
  entries: REGISTRY.length,
  rows: coverage.length,
});

// --- Plant-first lookups ------------------------------------------------------
const bySci = resolveName(index, "Quercus garryana");
check("resolve by scientific name → match", bySci.kind === "match" && bySci.entry.id === "quercus-garryana", bySci);

const byCommon = resolveName(index, "Garry Oak");
check("resolve by common alias → same taxon", byCommon.kind === "match" && byCommon.entry.id === "quercus-garryana", byCommon);

const casey = resolveName(index, "  garry   OAK ");
check("resolve is case/space-insensitive", casey.kind === "match" && casey.entry.id === "quercus-garryana", casey);

check("resolve cultivar query → refused (not a straight-species match)", resolveName(index, "Quercus garryana 'Fastigiata'").kind === "cultivar");
check("resolve unknown → none", resolveName(index, "Totally Made Up Plant").kind === "none");

check("entryById round-trips", entryById(index, "quercus-garryana")?.scientificName === "Quercus garryana");

// --- Ambiguity is surfaced, not guessed --------------------------------------
check(
  "ambiguous aliases (if any) each resolve to 'ambiguous'",
  audit.ambiguousAliases.every((a) => {
    const r = resolveName(index, a.alias);
    return r.kind === "ambiguous" && r.entries.length === a.ids.length;
  }),
  audit.ambiguousAliases,
);
console.log(`     (ambiguous aliases found: ${audit.ambiguousAliases.length})`);

// --- Deep links usable today --------------------------------------------------
const e = entryById(index, "quercus-garryana");
const links = deepLinks(e);
check("gbif deep link falls back to a name search when key is null", links.gbif.includes("Quercus%20garryana"));
check("powo link is a name search", links.powo.startsWith("https://powo.science.kew.org"));
check("usdaPlants link is null until a symbol is reconciled", links.usdaPlants === null);

// --- Identity invariants ------------------------------------------------------
check("ids are unique", new Set(REGISTRY.map((x) => x.id)).size === REGISTRY.length);
check("scientific names are unique", new Set(REGISTRY.map((x) => x.scientificName.toLowerCase())).size === REGISTRY.length);
check("every entry lists ≥1 region", REGISTRY.every((x) => x.regions.length >= 1));

console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}  (${REGISTRY.length} taxa)`);
process.exit(failures === 0 ? 0 : 1);
