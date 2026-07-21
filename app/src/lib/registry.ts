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

/** Look up an entry by its stable id (== the catalog's plant id). */
export function lookupId(id: string): import("../types").RegistryEntry | undefined {
  return core.entryById(registryIndex, id);
}

// Dev-time integrity net, mirroring the wildlife audit: verify the registry
// still covers every catalog plant and stays self-consistent. Prod builds strip
// this branch.
if (import.meta.env.DEV) {
  const coverage = REGIONS.flatMap((r) =>
    r.seed.map((p) => ({ regionId: r.meta.id, plantId: p.id, scientificName: p.latin })),
  );
  const { issues, ambiguousAliases } = core.auditRegistry(REGISTRY, coverage);
  if (issues.length) console.warn(`[registry audit] ${issues.length} issue(s):\n  ` + issues.join("\n  "));
  if (ambiguousAliases.length)
    console.info(
      "[registry audit] ambiguous aliases (resolve() returns 'ambiguous'): " +
        ambiguousAliases.map((a) => a.alias).join(", "),
    );
}
