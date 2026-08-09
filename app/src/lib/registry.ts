// The registry, bound to the bundled data for app use. Import from here in the
// app; `registry-core.ts` holds the pure logic (and is what the Node scripts
// use). Resolving a name to a taxon is the plant-first primitive the rest of the
// availability/discoverability work builds on.

import { REGISTRY } from "../data/registry";
import { REGIONS } from "../data/regions";
import * as core from "./registry-core";

export { deepLinks, normalizeName } from "./registry-core";
export type { RegistryIndex, ResolveResult, AuditResult, CoverageItem } from "./registry-core";
export { REGISTRY };

/** The name/id index over the whole registry, built once. */
export const registryIndex = core.buildIndex(REGISTRY);

/** Resolve a free-text name (common or scientific) to one taxon, or ambiguous/
 *  none/cultivar. The primary lookup the app calls. */
export function resolve(name: string): core.ResolveResult {
  return core.resolveName(registryIndex, name);
}

/** Get the registry entry for a catalog plant, by its id (== identifiers.indigene). */
export function entryForPlant(plantId: string): import("../types").RegistryEntry | undefined {
  return core.entryForPlant(registryIndex, plantId);
}

/** The entry for an iNaturalist taxon id, or undefined when it isn't one of our
 *  catalog natives — used to keep nearby observations to plants we can vouch for. */
export function entryByInatId(inatId: string): import("../types").RegistryEntry | undefined {
  return core.entryByInatId(registryIndex, inatId);
}

/** iNaturalist taxon ids native to any of the given regions. */
export function inatIdsForRegions(regionIds: readonly string[]): string[] {
  return core.inatIdsForRegions(registryIndex, regionIds);
}

/** Get an entry by its `primaryId` CURIE (e.g. "ipni:77123-1"). */
export function entryByPrimaryId(curie: string): import("../types").RegistryEntry | undefined {
  return core.entryByPrimaryId(registryIndex, curie);
}

// Dev-time integrity net, mirroring the wildlife audit: verify the registry
// still covers every catalog plant and stays self-consistent. Prod builds strip
// this branch.
if (import.meta.env.DEV) {
  // Every region's list, fetched on purpose: this is the one place that *wants*
  // all nine, and it only runs in development. In a production build the whole
  // branch is dropped, so it can't quietly pull the lists into the download.
  void Promise.all(
    REGIONS.map(async (r) =>
      (await r.load()).map((p) => ({ regionId: r.meta.id, plantId: p.id, scientificName: p.latin })),
    ),
  ).then((perRegion) => audit(perRegion.flat()));
}

function audit(coverage: { regionId: string; plantId: string; scientificName: string }[]): void {
  const { issues, ambiguousAliases, unreconciled } = core.auditRegistry(REGISTRY, coverage);
  if (issues.length) console.warn(`[registry audit] ${issues.length} issue(s):\n  ` + issues.join("\n  "));
  if (ambiguousAliases.length)
    console.info(
      "[registry audit] ambiguous aliases (resolve() returns 'ambiguous'): " +
        ambiguousAliases.map((a) => a.alias).join(", "),
    );
  if (unreconciled.length)
    console.info(`[registry audit] ${unreconciled.length} taxa await external ids — run \`npm run reconcile\``);
}

// ---------------------------------------------------------------------------
// Counting a region without downloading it.
//
// A region's plant list is a separate fetch now (see `data/regions.ts`), and
// the pages that merely *describe* regions — the explore grid, the browse index
// — would otherwise pull all nine lists to print two numbers per card. They
// don't have to: the registry is a projection of exactly those lists and is
// already here. Every count below is the same number the list itself would give.
// ---------------------------------------------------------------------------

/** How many plants a region's list holds. */
export function plantCountForRegion(regionId: string): number {
  return REGISTRY.filter((e) => e.regions.includes(regionId)).length;
}

/** How many of them are keystone taxa — the few that carry most of the
 *  caterpillars, which is the figure a region card leads with. */
export function keystoneCountForRegion(regionId: string): number {
  return REGISTRY.filter((e) => e.keystone && e.regions.includes(regionId)).length;
}

/** How many plants of one growth form a region's list holds — the figure the
 *  region page's "same category elsewhere" buttons carry, for eight regions it
 *  is deliberately not downloading. */
export function formCountForRegion(regionId: string, form: import("../types").PlantForm): number {
  return REGISTRY.filter((e) => e.form === form && e.regions.includes(regionId)).length;
}

/** Every region's rows added up. A taxon native to two regions is on two lists
 *  and counts twice — this is "rows across the catalog", which is what the
 *  explore page has always said. */
export function totalPlantRows(): number {
  return REGISTRY.reduce((n, e) => n + e.regions.length, 0);
}

/** Enough of a plant to name it, draw its silhouette and link to it — what a
 *  card shows before anybody has opened the plant itself. */
export interface PlantSummary {
  id: string;
  common: string;
  latin: string;
  form: import("../types").PlantForm;
  keystone: boolean;
}

/** The name and form of one catalog plant, for a card that has to show a plant
 *  without loading its region's list. `null` when the registry doesn't know it. */
export function plantSummary(plantId: string): PlantSummary | null {
  const e = entryForPlant(plantId);
  if (!e) return null;
  return {
    id: plantId,
    common: e.commonNames[0] ?? e.scientificName,
    latin: e.scientificName,
    form: e.form,
    keystone: e.keystone,
  };
}
