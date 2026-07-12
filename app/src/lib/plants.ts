// Loads a region's seed dataset and derives the one score we compute rather than
// author by hand: the caterpillar/moth host value. We store the RAW Lepidoptera
// host-species count in the data (honest, checkable) and normalize it here on a
// log scale, because the difference between 5 and 50 host species matters far
// more than the difference between 450 and 500.
import type { EcoScores, Plant } from "../types";
import type { RawPlant, RegionDef } from "../data/region";
import { REGIONS, regionForCoords } from "../data/regions";

// A single, shared anchor for the top of the host scale (oaks/willows/poplars,
// ~500 Lepidoptera species) so host scores are comparable across regions.
const HOST_ANCHOR = 520;

export function hostScore(count: number): number {
  const s = Math.log10(1 + count) / Math.log10(1 + HOST_ANCHOR);
  return Math.round(Math.min(100, Math.max(0, s * 100)));
}

function build(raw: RawPlant): Plant {
  const scores: EcoScores = { ...raw.scores, host: hostScore(raw.hostLepCount) };
  return { ...raw, scores };
}

// Built plant lists are cached per region id so we only derive scores once.
const cache = new Map<string, Plant[]>();

export function loadPlants(region: RegionDef): Plant[] {
  const cached = cache.get(region.meta.id);
  if (cached) return cached;
  const built = region.seed.map(build);
  cache.set(region.meta.id, built);
  return built;
}

/** Which covered region a spot falls in, or null if we have no list for it. */
export function regionForSite(lat: number, lon: number): RegionDef | null {
  return regionForCoords(lat, lon);
}

export { REGIONS };
export type { RegionDef };
