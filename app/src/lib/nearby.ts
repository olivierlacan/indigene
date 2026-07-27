// The cache-and-index layer over the iNaturalist client.
//
// The rule the whole feature turns on: **hit the network at most once per area,
// then serve every plant from memory/IndexedDB.** A single request returns the
// research-grade plant observations for an area — either the ones closest to a
// spot, or the ones inside a whole region's box; we trim it (see
// `inaturalist.ts`), store the trimmed list in IndexedDB keyed by that area, and
// index it by taxon id. Any recommended plant then answers "is this growing
// here?" by a map lookup — no further calls.
//
// Two areas, one machinery:
//   - `nearbyObservations` — a spot + radius, keyed by a ~11 km cell. "Near me."
//   - `regionObservations` — a region's coverage box, keyed by region id. Lets
//     you look up sightings in a specific ecoregion even when you're not there.
//
// Freshness: observations accrete slowly and we're showing "here's roughly what
// this looks like", not a live feed, so a week-old cache is fine.
import {
  fetchNearbyPlantObservations,
  fetchRegionPlantObservations,
  boundsCenter,
  indexByTaxon,
  DEFAULT_RADIUS_KM,
  type NearbyQuery,
  type Bounds,
  type ObservationSummary,
} from "./inaturalist";
import { entryByInatId } from "./registry";
import {
  getCachedObservations,
  putCachedObservations,
  type CachedObservations,
} from "../db";

/** How long a cached nearby-list stays usable. */
export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Cell size for the cache key — ~0.1° ≈ 11 km, comfortably inside the 50 km
 *  search radius, so adjacent spots share one cached request. */
const CELL = 0.1;

/** The cache key for a spot: rounded coordinates + radius. Exported for clarity
 *  and so callers can reason about reuse. */
export function cacheKey(lat: number, lon: number, radiusKm: number): string {
  const cell = (n: number): string => (Math.round(n / CELL) * CELL).toFixed(1);
  return `${cell(lat)},${cell(lon)}@${radiusKm}`;
}

/** The cache key for a region lookup — one entry per region. */
export function regionCacheKey(regionId: string): string {
  return `region:${regionId}`;
}

/** True when a cache record is missing or older than the TTL. */
function isStale(rec: CachedObservations | undefined, now: number): rec is undefined {
  return !rec || now - rec.capturedAt > CACHE_TTL_MS;
}

export interface NearbyResult {
  /** All observations for the area — nearest-first for a spot, most-recent-first
   *  for a region (where there's no "you" to measure distance from). */
  observations: ObservationSummary[];
  /** Indexed by iNaturalist taxon id for O(1) per-plant lookup. */
  byTaxon: Map<number, ObservationSummary[]>;
  /** The point distances were measured from (the spot, or a region's box center). */
  from: { lat: number; lon: number };
  /** true when served from IndexedDB, false when just fetched from the network. */
  fromCache: boolean;
}

// Keep only observations whose taxon is one of our catalog natives. Queries are
// already scoped to the area's native taxa, but enforcing it here makes
// "natives only" a property of the layer — nothing non-native ever reaches the
// cache or the screen, even if a query is somehow left unscoped.
function nativesOnly(list: ObservationSummary[]): ObservationSummary[] {
  return list.filter((o) => entryByInatId(String(o.taxonId)));
}

// The shared machinery: return a fresh cached list if there is one, otherwise
// run `fetcher`, keep only natives, write the trimmed list back, and index it.
async function loadIndexed(
  record: Omit<CachedObservations, "capturedAt" | "observations">,
  fetcher: () => Promise<ObservationSummary[]>,
  now: number,
): Promise<NearbyResult> {
  const cached = await getCachedObservations(record.key).catch(() => undefined);
  if (!isStale(cached, now)) {
    return {
      observations: cached.observations,
      byTaxon: indexByTaxon(cached.observations),
      from: cached.from,
      fromCache: true,
    };
  }
  const observations = nativesOnly(await fetcher());
  // Best-effort write: a full or quota-limited IndexedDB shouldn't sink the
  // feature — we still return the freshly fetched list.
  await putCachedObservations({ ...record, capturedAt: now, observations }).catch(() => {});
  return {
    observations,
    byTaxon: indexByTaxon(observations),
    from: record.from,
    fromCache: false,
  };
}

/**
 * The observation index for a spot ("near me"), fetching from iNaturalist only
 * if there's no fresh cached list for the cell. Rejects only on a genuine
 * fetch's network failure; a cache hit never touches the network. `now` is
 * injectable for testing and defaults to the current time.
 */
export async function nearbyObservations(
  q: NearbyQuery,
  now: number = Date.now(),
): Promise<NearbyResult> {
  const radiusKm = q.radiusKm ?? DEFAULT_RADIUS_KM;
  return loadIndexed(
    { key: cacheKey(q.lat, q.lon, radiusKm), from: { lat: q.lat, lon: q.lon }, radiusKm },
    () => fetchNearbyPlantObservations({ ...q, radiusKm }),
    now,
  );
}

/**
 * The observation index for a whole region's box ("in this ecoregion, even if
 * you're not there"). Cached once per region id and scoped to that region's
 * native taxa. Same fetch-once-then-serve-from-cache contract as `nearbyObservations`.
 */
export async function regionObservations(
  regionId: string,
  bounds: Bounds,
  taxonIds: readonly string[],
  now: number = Date.now(),
): Promise<NearbyResult> {
  return loadIndexed(
    { key: regionCacheKey(regionId), from: boundsCenter(bounds), regionId },
    () => fetchRegionPlantObservations({ bounds, taxonIds }),
    now,
  );
}

/** The observations for one plant, by its iNaturalist taxon id (a string, as
 *  stored in the registry's `identifiers.inat`). Empty when none are nearby. */
export function observationsForTaxon(
  result: NearbyResult,
  inatId: string | undefined,
): ObservationSummary[] {
  if (!inatId) return [];
  const id = Number(inatId);
  if (!Number.isFinite(id)) return [];
  return result.byTaxon.get(id) ?? [];
}
