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
const { buildIndex, resolveName, entryForPlant, deepLinks, auditRegistry } = await loader.load(
  "/src/lib/registry-core.ts",
);
const coverage = [];
for (const id of ["mid-atlantic", "pnw", "florida", "florida-south"]) {
  const { REGION, SEED_RAW } = await loader.load(`/src/data/plants.${id}.ts`);
  for (const p of SEED_RAW) coverage.push({ regionId: REGION.id, plantId: p.id, scientificName: p.latin });
}
await loader.close();

const index = buildIndex(REGISTRY);
const local = (r) => r?.identifiers?.indigene;
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
check("resolve by scientific name → match", bySci.kind === "match" && local(bySci.entry) === "quercus-garryana", bySci);

const byCommon = resolveName(index, "Garry Oak");
check("resolve by common alias → same taxon", byCommon.kind === "match" && local(byCommon.entry) === "quercus-garryana", byCommon);

const casey = resolveName(index, "  garry   OAK ");
check("resolve is case/space-insensitive", casey.kind === "match" && local(casey.entry) === "quercus-garryana", casey);

check("resolve cultivar query → refused (not a straight-species match)", resolveName(index, "Quercus garryana 'Fastigiata'").kind === "cultivar");
check("resolve unknown → none", resolveName(index, "Totally Made Up Plant").kind === "none");

check("entryForPlant round-trips (catalog id → entry)", entryForPlant(index, "quercus-garryana")?.scientificName === "Quercus garryana");

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

// --- Identity: honest external anchor, not a local slug in disguise ----------
check("every entry carries its indigene (catalog) id", REGISTRY.every((x) => !!local(x)));
check("primaryId is a CURIE when set, null otherwise", REGISTRY.every((x) => x.primaryId === null || /^[a-z]+:.+/.test(x.primaryId)));
check("unreconciled taxa are reported (interim state before `npm run reconcile`)", audit.unreconciled.length === REGISTRY.filter((x) => !x.primaryId).length);
console.log(`     (unreconciled: ${audit.unreconciled.length}/${REGISTRY.length} — awaiting external ids)`);

// --- Deep links: fallback vs record behavior ---------------------------------
// Tested on synthetic entries, not a real taxon, so these don't depend on
// whether reconciliation has filled a given plant's ids yet (a reconciled plant
// gets record links, an unreconciled one gets name searches — both are correct).
const bare = deepLinks({ scientificName: "Testus planta", identifiers: {} });
check("deepLinks: gbif falls back to a name search when no key", bare.gbif.includes("Testus%20planta"), bare.gbif);
check("deepLinks: powo is null without an IPNI id", bare.powo === null, bare.powo);
check("deepLinks: usda is null without a symbol", bare.usda === null, bare.usda);
check("deepLinks: inaturalist name-search link always present", bare.inaturalist.startsWith("https://www.inaturalist.org"), bare.inaturalist);

const rich = deepLinks({ scientificName: "Testus planta", identifiers: { ipni: "77123-1", gbif: "12345", usda: "TEPL" } });
check("deepLinks: gbif is a record link when a key is present", rich.gbif === "https://www.gbif.org/species/12345", rich.gbif);
check("deepLinks: powo derives from the IPNI id", (rich.powo ?? "").includes("ipni.org:names:77123-1"), rich.powo);
check("deepLinks: usda is a profile link when a symbol is present", rich.usda === "https://plants.usda.gov/plant-profile/TEPL", rich.usda);

// --- Identity invariants ------------------------------------------------------
check("indigene ids are unique", new Set(REGISTRY.map(local)).size === REGISTRY.length);
check("scientific names are unique", new Set(REGISTRY.map((x) => x.scientificName.toLowerCase())).size === REGISTRY.length);
check("every entry lists ≥1 region", REGISTRY.every((x) => x.regions.length >= 1));

console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}  (${REGISTRY.length} taxa)`);
process.exit(failures === 0 ? 0 : 1);
