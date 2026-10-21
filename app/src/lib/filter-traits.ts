// The spot flow's filters — no watering, deer, thorns, pets, spreaders and the
// two size caps — as one predicate, so the ranked picks, a region's roster and
// the plant catalog all narrow a list by the same rules.
//
// It reads a small shape rather than a whole `Plant`, because the catalog has
// no region's plant list to hand: it reads the same few facts from the
// registry instead (`traits`, merged across regions by build-registry.mjs).
import type { Plant } from "../types";

/** The facts the filters read, and nothing else. */
export interface FilterTraits {
  deerResistant: boolean;
  /** Thorns or stinging hairs: "no thorns" is a question about touching it. */
  thorny: boolean;
  petToxic: boolean;
  aggressive: boolean;
  /** Establishes and persists with no watering after planting. */
  noWater: boolean;
  /** Honest eventual size, in feet. */
  heightFt: number;
  spreadFt: number;
}

/** The filters a reader can switch on; a size cap of null means no limit. */
export interface TraitFilters {
  requireNoWater: boolean;
  requireDeerResistant: boolean;
  excludeThorny: boolean;
  excludePetToxic: boolean;
  excludeAggressive: boolean;
  maxHeightFt: number | null;
  maxSpreadFt: number | null;
}

export const NO_TRAIT_FILTERS: TraitFilters = {
  requireNoWater: false,
  requireDeerResistant: false,
  excludeThorny: false,
  excludePetToxic: false,
  excludeAggressive: false,
  maxHeightFt: null,
  maxSpreadFt: null,
};

export function traitsOf(p: Plant): FilterTraits {
  return {
    deerResistant: p.filters.deerResistant,
    thorny: p.filters.thorny || Boolean(p.filters.stinging),
    petToxic: p.filters.petToxic,
    aggressive: p.filters.aggressive,
    noWater: p.noWaterEstablish,
    heightFt: p.matureHeightFt,
    spreadFt: p.matureSpreadFt,
  };
}

export function passesFilters(t: FilterTraits, f: TraitFilters): boolean {
  if (f.requireNoWater && !t.noWater) return false;
  if (f.requireDeerResistant && !t.deerResistant) return false;
  if (f.excludeThorny && t.thorny) return false;
  if (f.excludePetToxic && t.petToxic) return false;
  if (f.excludeAggressive && t.aggressive) return false;
  if (f.maxHeightFt != null && t.heightFt > f.maxHeightFt) return false;
  if (f.maxSpreadFt != null && t.spreadFt > f.maxSpreadFt) return false;
  return true;
}

/** How many filters are on — each checkbox, and each size cap. */
export function filterCount(f: TraitFilters): number {
  return [f.requireNoWater, f.requireDeerResistant, f.excludeThorny, f.excludePetToxic, f.excludeAggressive]
    .filter(Boolean).length + (f.maxHeightFt != null ? 1 : 0) + (f.maxSpreadFt != null ? 1 : 0);
}

/**
 * One taxon's traits across every region that lists it, read the cautious way
 * round: it only counts as deer-proof or water-free if every list says so, and
 * as thorny, toxic or a spreader if any does; the size is the largest. A list
 * filtered for pets should never show a plant one region warns about.
 */
export function mergeTraits(a: FilterTraits, b: FilterTraits): FilterTraits {
  return {
    deerResistant: a.deerResistant && b.deerResistant,
    thorny: a.thorny || b.thorny,
    petToxic: a.petToxic || b.petToxic,
    aggressive: a.aggressive || b.aggressive,
    noWater: a.noWater && b.noWater,
    heightFt: Math.max(a.heightFt, b.heightFt),
    spreadFt: Math.max(a.spreadFt, b.spreadFt),
  };
}
