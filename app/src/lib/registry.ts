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

/** Get an entry by its `primaryId` CURIE (e.g. "ipni:77123-1"). */
export function entryByPrimaryId(curie: string): import("../types").RegistryEntry | undefined {
  return core.entryByPrimaryId(registryIndex, curie);
}

// Dev-time integrity net, mirroring the wildlife audit: verify the registry
// still covers every catalog plant and stays self-consistent. Prod builds strip
// this branch.
if (import.meta.env.DEV) {
  const coverage = REGIONS.flatMap((r) =>
    r.seed.map((p) => ({ regionId: r.meta.id, plantId: p.id, scientificName: p.latin })),
  );
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
