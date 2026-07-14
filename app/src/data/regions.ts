// The region registry. This is the one place that knows the full set of regions
// Indigene covers. Adding a region is: write a `plants.<id>.ts` data file, then
// add two lines here. Everything downstream (which plant list to load, what the
// welcome screen advertises, whether a spot is covered) reads from this list, so
// nothing else has to change.
import type { RegionDef } from "./region";
import { REGION as MID_ATLANTIC, SEED_RAW as MID_ATLANTIC_SEED } from "./plants.mid-atlantic";
import { REGION as PNW, SEED_RAW as PNW_SEED } from "./plants.pnw";
import { REGION as FLORIDA_CENTRAL, SEED_RAW as FLORIDA_CENTRAL_SEED } from "./plants.florida";
import { REGION as FLORIDA_SOUTH, SEED_RAW as FLORIDA_SOUTH_SEED } from "./plants.florida-south";

export const REGIONS: RegionDef[] = [
  { meta: MID_ATLANTIC, seed: MID_ATLANTIC_SEED },
  { meta: PNW, seed: PNW_SEED },
  { meta: FLORIDA_CENTRAL, seed: FLORIDA_CENTRAL_SEED },
  { meta: FLORIDA_SOUTH, seed: FLORIDA_SOUTH_SEED },
];

/**
 * The region whose coverage box contains this point, or null if none does.
 * Coarse by design (see RegionBounds) — a point outside every box means "we
 * don't have a plant list for here yet", which the app says plainly rather than
 * guessing with the wrong region's plants.
 */
export function regionForCoords(lat: number, lon: number): RegionDef | null {
  return (
    REGIONS.find(({ meta: { bounds: b } }) =>
      lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon
    ) ?? null
  );
}
