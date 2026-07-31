// The cache-and-fetch layer for wildlife sightings — the "see it near you" layer
// on an animal's page, mirroring `nearby.ts` for plants but for one animal at a
// time.
//
// It is the same shape as the plant path — one taxon, one area, one request,
// cached for a week — and shares its `loadSightings` and its cache-key helpers,
// so the two can't drift apart. One difference: **two calls on a cache miss,
// not one.** The plant registry stores a reconciled numeric iNaturalist id; the
// wildlife catalog stores only the scientific name. So we first resolve name →
// taxon id (`resolveTaxon`, which follows iNaturalist's synonymy and fails
// safe), then fetch the sightings by that id. Both happen behind the cache, so a
// fresh cache hit touches the network zero times.
//
// Freshness is the same as plants: sightings accrete slowly and we're showing
// "here's roughly what this looks like near you", not a live feed, so the shared
// 7-day TTL is fine. The cache lives in the same IndexedDB store, keyed by
// `wildlife:<animalId>:<area>` so it never collides with the plant layer's keys.
import {
  fetchNearbyObservations,
  fetchRegionObservations,
  resolveTaxon,
  boundsCenter,
  DEFAULT_RADIUS_KM,
  type Bounds,
  type ObservationSummary,
} from "./inaturalist";
import { cacheKey, regionCacheKey, loadSightings } from "./nearby";
import type { SightingResult } from "./nearby";
import type { InatScope } from "../types";

export type { SightingResult };

// Resolve the animal's name to a taxon id, then fetch by that id. A name that
// won't resolve yields an empty list (not the wrong creature) — see `resolveTaxon`.
async function fetchNearAnimal(
  scope: InatScope,
  lat: number,
  lon: number,
  radiusKm: number,
): Promise<ObservationSummary[]> {
  const id = await resolveTaxon(scope.name, scope.iconic);
  if (id == null) return [];
  return fetchNearbyObservations({
    lat,
    lon,
    radiusKm,
    iconicTaxa: scope.iconic,
    taxonIds: [String(id)],
  });
}

async function fetchRegionAnimal(scope: InatScope, bounds: Bounds): Promise<ObservationSummary[]> {
  const id = await resolveTaxon(scope.name, scope.iconic);
  if (id == null) return [];
  return fetchRegionObservations({ bounds, iconicTaxa: scope.iconic, taxonIds: [String(id)] });
}

/**
 * One animal's research-grade, photographed sightings near a spot, fetching from
 * iNaturalist only if there's no fresh cached list for this animal + cell.
 * Rejects only on a genuine fetch's network failure; a cache hit never touches
 * the network. `now` is injectable for testing and defaults to the current time.
 */
export async function wildlifeSightingsNear(
  scope: InatScope,
  animalId: string,
  lat: number,
  lon: number,
  now: number = Date.now(),
): Promise<SightingResult> {
  const radiusKm = DEFAULT_RADIUS_KM;
  const key = `wildlife:${animalId}:${cacheKey(lat, lon, radiusKm)}`;
  return loadSightings(key, { lat, lon }, () => fetchNearAnimal(scope, lat, lon, radiusKm), now);
}

/**
 * One animal's sightings inside a region's box ("where is it found in this
 * ecoregion, even if you're not there"). Cached once per animal + region id.
 * Same fetch-once-then-serve-from-cache contract as `wildlifeSightingsNear`.
 */
export async function wildlifeSightingsInRegion(
  scope: InatScope,
  animalId: string,
  regionId: string,
  bounds: Bounds,
  now: number = Date.now(),
): Promise<SightingResult> {
  const key = `wildlife:${animalId}:${regionCacheKey(regionId)}`;
  return loadSightings(key, boundsCenter(bounds), () => fetchRegionAnimal(scope, bounds), now);
}
