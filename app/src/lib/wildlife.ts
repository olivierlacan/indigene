// The query layer over the wildlife dataset. The data (`data/wildlife.ts`)
// stores ties in the natural authoring direction — plant → the animals it
// supports — because that's how a row is audited. This module inverts and joins
// them so the app can answer either question:
//
//   - "Which plants support this animal?"  (the browse-by-wildlife pages)
//   - "Which animals does this plant support?"  (the plant profile)
//
// It resolves plant ids to real Plant objects through the same `loadPlants`
// path the rest of the app uses, so a wildlife page can never show a plant the
// region roster doesn't — and a tie pointing at an unknown id is dropped, not
// rendered as a broken row (guarded, and surfaced in dev by `auditSupport`).
import type { Plant, SupportLink, Wildlife, WildlifeKind } from "../types";
import type { RegionDef } from "../data/region";
import { REGIONS, loadPlants } from "./plants";
import { SUPPORT, WILDLIFE } from "../data/wildlife";

const wildlifeById = new Map(WILDLIFE.map((w) => [w.id, w]));

/** The catalog entry for an id, or undefined if it isn't one we know. */
export function getWildlife(id: string): Wildlife | undefined {
  return wildlifeById.get(id);
}

/** Section order for the index — most-asked-for wildlife first. */
export const KIND_ORDER: WildlifeKind[] = ["butterfly", "moth", "bee", "bird", "mammal"];

/** A plant that supports a given animal, with the region it's in and the tie. */
export interface PlantSupport {
  region: RegionDef;
  plant: Plant;
  link: SupportLink;
}

const regionById = new Map(REGIONS.map((r) => [r.meta.id, r]));

/**
 * Every plant that supports one animal, across all regions. Grouping by region
 * is left to the caller (the detail page shows one region block at a time).
 * Ties whose plant id isn't in that region's roster are skipped defensively.
 */
export function plantsForWildlife(wildlifeId: string): PlantSupport[] {
  const out: PlantSupport[] = [];
  for (const [regionId, byPlant] of Object.entries(SUPPORT)) {
    const region = regionById.get(regionId);
    if (!region) continue;
    const plants = loadPlants(region);
    for (const [plantId, links] of Object.entries(byPlant)) {
      const link = links.find((l) => l.wildlifeId === wildlifeId);
      if (!link) continue;
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) continue;
      out.push({ region, plant, link });
    }
  }
  return out;
}

/** One animal a plant supports, resolved to the catalog entry + the tie. */
export interface WildlifeForPlant {
  wildlife: Wildlife;
  link: SupportLink;
}

/**
 * The animals a specific plant supports (for its profile page). Keyed by the
 * region the reader is viewing the plant in, so a species that appears in two
 * regions shows the ties authored for that region.
 */
export function wildlifeForPlant(regionId: string, plantId: string): WildlifeForPlant[] {
  const links = SUPPORT[regionId]?.[plantId] ?? [];
  const out: WildlifeForPlant[] = [];
  for (const link of links) {
    const wildlife = wildlifeById.get(link.wildlifeId);
    if (wildlife) out.push({ wildlife, link });
  }
  return out;
}

/** One row of the browse index: an animal plus how widely it's supported. */
export interface WildlifeIndexRow {
  wildlife: Wildlife;
  plantCount: number;
  regionIds: string[];
}

/**
 * The browse index: every catalog animal that at least one mapped plant
 * supports, with a count and the regions it's found in. Animals with no ties
 * yet are left out rather than shown as empty dead ends.
 */
export function wildlifeIndex(): WildlifeIndexRow[] {
  const rows: WildlifeIndexRow[] = [];
  for (const wildlife of WILDLIFE) {
    const supports = plantsForWildlife(wildlife.id);
    if (!supports.length) continue;
    const regionIds = [...new Set(supports.map((s) => s.region.meta.id))];
    rows.push({ wildlife, plantCount: supports.length, regionIds });
  }
  return rows;
}

/** Total distinct animals with at least one mapped plant — for the index lede. */
export function mappedWildlifeCount(): number {
  return wildlifeIndex().length;
}

/**
 * Dev-only integrity check: every plant id referenced in SUPPORT must exist in
 * its region's roster, and every wildlifeId must be in the catalog. Called once
 * at module load in dev so a typo in a tie is caught immediately, not silently
 * dropped. Costs nothing in production (tree-shaken via import.meta.env.DEV).
 */
export function auditSupport(): string[] {
  const problems: string[] = [];
  // The hard invariant: every listed animal must be native and cite where it's
  // native. The `native: true` literal type already blocks this at compile
  // time; this is the belt-and-suspenders runtime guarantee.
  for (const w of WILDLIFE) {
    if (w.native !== true) problems.push(`wildlife "${w.id}" is not marked native`);
    if (!w.nativeBasis?.trim()) problems.push(`wildlife "${w.id}" has no native-status source`);
  }
  for (const [regionId, byPlant] of Object.entries(SUPPORT)) {
    const region = regionById.get(regionId);
    if (!region) {
      problems.push(`SUPPORT references unknown region "${regionId}"`);
      continue;
    }
    const ids = new Set(loadPlants(region).map((p) => p.id));
    for (const [plantId, links] of Object.entries(byPlant)) {
      if (!ids.has(plantId)) {
        problems.push(`${regionId}: no plant "${plantId}" in roster`);
      }
      for (const link of links) {
        if (!wildlifeById.has(link.wildlifeId)) {
          problems.push(`${regionId}/${plantId}: unknown wildlife "${link.wildlifeId}"`);
        }
        // Every plant↔animal relationship must cite a reliable source — the
        // relationship is a claim, and claims here are checkable or they don't ship.
        if (!link.basis?.trim()) {
          problems.push(`${regionId}/${plantId}: tie to "${link.wildlifeId}" has no source`);
        }
      }
    }
  }
  return problems;
}

if (import.meta.env.DEV) {
  const problems = auditSupport();
  if (problems.length) {
    console.warn("[wildlife] SUPPORT integrity problems:\n" + problems.join("\n"));
  }
}
