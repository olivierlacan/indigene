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
import { REGION as FRANCE_ATLANTIC, SEED_RAW as FRANCE_ATLANTIC_SEED } from "./plants.france-atlantic";
import { REGION as FRANCE_CONTINENTAL, SEED_RAW as FRANCE_CONTINENTAL_SEED } from "./plants.france-continental";
import { REGION as FRANCE_MEDITERRANEAN, SEED_RAW as FRANCE_MEDITERRANEAN_SEED } from "./plants.france-mediterranean";
import { REGION as FRANCE_ALPINE, SEED_RAW as FRANCE_ALPINE_SEED } from "./plants.france-alpine";

export const REGIONS: RegionDef[] = [
  { meta: MID_ATLANTIC, seed: MID_ATLANTIC_SEED },
  { meta: PNW, seed: PNW_SEED },
  { meta: FLORIDA_CENTRAL, seed: FLORIDA_CENTRAL_SEED },
  { meta: FLORIDA_SOUTH, seed: FLORIDA_SOUTH_SEED },
  // Metropolitan France, complete: all four of its EEA biogeographical regions.
  // Unlike the US regions, these four have *overlapping* coverage boxes — no set
  // of rectangles separates the oceanic west from the Mediterranean south, or
  // the Alps from the continental east — so selection leans on the live EEA
  // region code, with the tightest box as the offline tiebreak. See
  // `regionsForCoords` below and docs/france-localization-plan.md.
  { meta: FRANCE_ATLANTIC, seed: FRANCE_ATLANTIC_SEED },
  { meta: FRANCE_CONTINENTAL, seed: FRANCE_CONTINENTAL_SEED },
  { meta: FRANCE_MEDITERRANEAN, seed: FRANCE_MEDITERRANEAN_SEED },
  { meta: FRANCE_ALPINE, seed: FRANCE_ALPINE_SEED },
];

/**
 * Every region whose coverage box contains this point, **smallest box first**.
 *
 * Boxes used to be required not to overlap, which stopped being possible the
 * moment France got four regions: the EEA biogeographical regions interlock
 * (the Mediterranean coast reaches north past Montpellier while the Atlantic
 * zone reaches south to the Pyrenean foot, and the Alps sit inside the
 * Continental east), and no set of rectangles separates them. So a point can
 * now be in several boxes, and `regionForSite` uses the live ecoregion lookup
 * to pick between them. Smallest-box-first is the tiebreak when there's no live
 * lookup to ask (offline, or outside a provider's coverage): the tighter box is
 * the more specific claim, so a Marseille point offline gets the Mediterranean
 * list rather than the much larger Atlantic one.
 */
export function regionsForCoords(lat: number, lon: number): RegionDef[] {
  return REGIONS.filter(({ meta: { bounds: b } }) =>
    lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon
  ).sort((a, b) => boxArea(a) - boxArea(b));
}

/** Degrees² — a comparison key for "which box is the more specific claim", not
 *  a real area (no cos(lat) term); it only ever compares boxes over one point. */
function boxArea({ meta: { bounds: b } }: RegionDef): number {
  return (b.maxLat - b.minLat) * (b.maxLon - b.minLon);
}

/**
 * The most specific region whose coverage box contains this point, or null if
 * none does. Coarse by design (see RegionBounds) — a point outside every box
 * means "we don't have a plant list for here yet", which the app says plainly
 * rather than guessing with the wrong region's plants.
 */
export function regionForCoords(lat: number, lon: number): RegionDef | null {
  return regionsForCoords(lat, lon)[0] ?? null;
}
