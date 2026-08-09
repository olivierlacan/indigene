// Runnable audit of the generated registry (the repo's no-test-runner pattern).
// Confirms the registry covers every catalog plant, stays self-consistent, and
// that plant-first lookups resolve as intended.
//
//   npm run registry:check
//
// Plain JS + Vite's ssrLoadModule (via _load-ts.mjs) so it runs on any Node
// version without native TypeScript support.
import { openLoader } from "./_load-ts.mjs";
import { withSeeds } from "./_regions.mjs";

const loader = await openLoader();
const { REGISTRY } = await loader.load("/src/data/registry.ts");
const { buildIndex, resolveName, entryForPlant, deepLinks, auditRegistry } = await loader.load(
  "/src/lib/registry-core.ts",
);
// Same source of truth the app and the builder use, so the audit can never be
// checking a smaller catalog than the one that shipped.
const coverage = [];
const { REGIONS: REGIONS_RAW } = await loader.load("/src/data/regions.ts");
const REGIONS = await withSeeds(REGIONS_RAW);
for (const { meta, seed } of REGIONS) {
  for (const p of seed) coverage.push({ regionId: meta.id, plantId: p.id, scientificName: p.latin });
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

// --- iNaturalist coverage, per region ----------------------------------------
// Reported, not enforced: a region can legitimately ship its plant list before
// the reconcile job has run. But a missing taxon id is not cosmetic — it's the
// join between a plant page and the real sightings on it, so "See it growing
// near you" quietly has nothing to show for every taxon counted here. Printed
// per region because that's how the gap actually appears: a whole new region
// lands unreconciled at once. Close it with the reconcile workflow (or
// `npm run reconcile -- --missing inat`).
const inatGaps = new Map(); // regionId → scientificName[]
for (const e of REGISTRY) {
  if (e.identifiers?.inat) continue;
  for (const r of e.regions) inatGaps.set(r, [...(inatGaps.get(r) ?? []), e.scientificName]);
}
const totalByRegion = new Map();
for (const e of REGISTRY) for (const r of e.regions) totalByRegion.set(r, (totalByRegion.get(r) ?? 0) + 1);
const missingInat = REGISTRY.filter((x) => !x.identifiers?.inat).length;
console.log(`\niNaturalist taxon ids: ${REGISTRY.length - missingInat}/${REGISTRY.length} present.`);
for (const [regionId, total] of [...totalByRegion].sort()) {
  const gaps = inatGaps.get(regionId)?.length ?? 0;
  console.log(`  ${regionId.padEnd(22)} ${total - gaps}/${total}${gaps ? `  — missing: ${inatGaps.get(regionId).join(", ")}` : ""}`);
}
console.log(""); // blank line closes the block — CI lifts it out by that boundary

// --- Deep links: fallback vs record behavior ---------------------------------
// Tested on synthetic entries, not a real taxon, so these don't depend on
// whether reconciliation has filled a given plant's ids yet (a reconciled plant
// gets record links, an unreconciled one gets name searches — both are correct).
const bare = deepLinks({ scientificName: "Testus planta", identifiers: {} });
check("deepLinks: gbif falls back to a name search when no key", bare.gbif.includes("Testus%20planta"), bare.gbif);
check("deepLinks: powo is null without an IPNI id", bare.powo === null, bare.powo);
check("deepLinks: usda is null without a symbol", bare.usda === null, bare.usda);
check("deepLinks: inaturalist falls back to a name search without an inat id", bare.inaturalist.includes("/taxa/search?q=Testus%20planta"), bare.inaturalist);

const rich = deepLinks({ scientificName: "Testus planta", identifiers: { ipni: "77123-1", gbif: "12345", usda: "TEPL", inat: "48662" } });
check("deepLinks: gbif is a record link when a key is present", rich.gbif === "https://www.gbif.org/species/12345", rich.gbif);
check("deepLinks: powo derives from the IPNI id", (rich.powo ?? "").includes("ipni.org:names:77123-1"), rich.powo);
check("deepLinks: usda is a profile link when a symbol is present", rich.usda === "https://plants.usda.gov/plant-profile/TEPL", rich.usda);
check("deepLinks: inaturalist is a direct taxon link when an inat id is present", rich.inaturalist === "https://www.inaturalist.org/taxa/48662", rich.inaturalist);

// --- Identity invariants ------------------------------------------------------
check("indigene ids are unique", new Set(REGISTRY.map(local)).size === REGISTRY.length);
check("scientific names are unique", new Set(REGISTRY.map((x) => x.scientificName.toLowerCase())).size === REGISTRY.length);
check("every entry lists ≥1 region", REGISTRY.every((x) => x.regions.length >= 1));

// --- Region cards can describe a region without loading it --------------------
// The explore grid prints each region's star, its caterpillar count and its
// keystone tally for nine regions at once, from the registry and the region's
// own description — never from the plant lists, which are separate downloads
// (see `data/regions.ts`). These are the invariants that keeps honest.
for (const { meta, seed } of REGIONS) {
  const star = seed.find((p) => p.id === meta.featuredPlantId);
  check(`${meta.id}: the featured plant is on the region's list`, Boolean(star), meta.featuredPlantId);
  if (!star) continue;
  check(
    `${meta.id}: featuredHostLepCount matches the plant list`,
    meta.featuredHostLepCount === star.hostLepCount,
    `meta ${meta.featuredHostLepCount} vs list ${star.hostLepCount}`
  );
  const listed = REGISTRY.filter((e) => e.regions.includes(meta.id));
  check(`${meta.id}: registry holds every plant on the list`, listed.length === seed.length,
    `registry ${listed.length} vs list ${seed.length}`);
  check(
    `${meta.id}: registry keystone flags match the list`,
    listed.filter((e) => e.keystone).length === seed.filter((p) => p.keystone).length,
    `registry ${listed.filter((e) => e.keystone).length} vs list ${seed.filter((p) => p.keystone).length}`
  );
}

console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}  (${REGISTRY.length} taxa)`);
process.exit(failures === 0 ? 0 : 1);
