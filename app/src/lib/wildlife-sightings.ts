// The cache-and-fetch layer for wildlife sightings — the "see it near you" layer
// on an animal's page, mirroring `nearby.ts` for plants but for one animal at a
// time.
//
// Where the plant layer fetches *all* the region's natives in one request and
// then serves every plant from that shared index, the wildlife layer is
// per-animal: each animal has its own page, so we fetch and cache one animal's
// sightings for one area. Two differences from the plant path follow from that:
//
//   1. **Two calls on a cache miss, not one.** The plant registry stores a
//      reconciled numeric iNaturalist id; the wildlife catalog stores only the
//      scientific name. So we first resolve name → taxon id (`resolveTaxon`,
//      which follows iNaturalist's synonymy and fails safe), then fetch the
//      sightings by that id. Both happen behind the cache, so a fresh cache hit
//      touches the network zero times.
//   2. **No native-taxa filter.** The plant path keeps only catalog natives; the
//      wildlife query is already pinned to exactly one taxon (the animal we
//      asked for), so there is nothing else it could return.
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
import { cacheKey, regionCacheKey, CACHE_TTL_MS } from "./nearby";
import {
  getCachedObservations,
  putCachedObservations,
  type CachedObservations,
} from "../db";
import type { InatScope } from "../types";

export interface SightingResult {
  /** The animal's sightings for the area — nearest-first for a spot, most-recent
   *  first for a region (where there's no "you" to measure distance from). */
  observations: ObservationSummary[];
  /** The point distances were measured from (the spot, or a region's box center). */
  from: { lat: number; lon: number };
  /** true when served from IndexedDB, false when just fetched from the network. */
  fromCache: boolean;
}

/** True when a cache record is missing or older than the TTL. */
function isStale(rec: CachedObservations | undefined, now: number): rec is undefined {
  return !rec || now - rec.capturedAt > CACHE_TTL_MS;
}

// Shared machinery: return a fresh cached list if there is one, otherwise run
// `fetcher`, write the trimmed list back, and hand it up. Best-effort write — a
// full or quota-limited IndexedDB shouldn't sink the feature.
async function loadSightings(
  key: string,
  from: { lat: number; lon: number },
  fetcher: () => Promise<ObservationSummary[]>,
  now: number,
): Promise<SightingResult> {
  const cached = await getCachedObservations(key).catch(() => undefined);
  if (!isStale(cached, now)) {
    return { observations: cached.observations, from: cached.from, fromCache: true };
  }
  const observations = await fetcher();
  await putCachedObservations({ key, from, capturedAt: now, observations }).catch(() => {});
  return { observations, from, fromCache: false };
}

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
