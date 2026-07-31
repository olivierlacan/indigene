// The cache-and-fetch layer over the iNaturalist client: **one taxon, one area,
// one request, then a week of IndexedDB.**
//
// A plant's page asks exactly one question — "is *this* plant growing near me?"
// — so that is the question we put to iNaturalist: `taxon_id=<this plant>`,
// bounded either by the spot's radius or by a region's coverage box. What comes
// back is trimmed (see `inaturalist.ts`), cached under a key naming that taxon
// and that area, and handed straight to the page.
//
// It used to ask a much wider question, and that was the bug. The old shape
// fetched the 100 most recent observations of *every* native in the region in
// one request, indexed them by taxon id, and let each plant look itself up. One
// request served every plant — but those 100 rows were shared across ~40 taxa
// and ordered by recency, so in a well-observed area they spanned only the last
// few days. Any plant nobody had happened to photograph that week came back with
// nothing, and the page said "no one has photographed and verified one here yet"
// about a plant with thousands of nearby sightings. Worse, iNaturalist's
// `taxon_id` filter matches *descendants*, so an observation identified as a
// subspecies or variety came back under the subspecies' own id, missed the
// exact-id lookup, and was dropped — silently, and after it had already eaten
// one of the 100 slots.
//
// Asking per taxon costs one request per plant page per week per area instead of
// one per region, and it answers the question that was actually asked. It also
// makes two guarantees free rather than enforced downstream: everything returned
// *is* the plant (or a subspecies of it), and nothing else can reach the cache.
//
// Two areas, one machinery:
//   - `plantSightingsNear` — a spot + radius, keyed by a ~11 km cell. "Near me."
//   - `plantSightingsInRegion` — a region's coverage box, keyed by region id.
//     Lets you look up sightings in an ecoregion even when you're not there.
//
// `wildlife-sightings.ts` is this same layer for animals and shares
// `loadSightings` below; the only difference there is that an animal's taxon id
// has to be resolved from its scientific name first.
//
// Freshness: sightings accrete slowly and we're showing "here's roughly what
// this looks like", not a live feed, so a week-old cache is fine.
import {
  fetchNearbyObservations,
  fetchRegionObservations,
  boundsCenter,
  DEFAULT_RADIUS_KM,
  type Bounds,
  type ObservationSummary,
} from "./inaturalist";
import {
  getCachedObservations,
  putCachedObservations,
  type CachedObservations,
} from "../db";

/** How long a cached list stays usable. */
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

export interface SightingResult {
  /** The taxon's sightings for the area — nearest-first for a spot,
   *  most-recent-first for a region (where there's no "you" to measure from). */
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

/**
 * The shared machinery, used by both this module and `wildlife-sightings.ts`:
 * return a fresh cached list if there is one, otherwise run `fetcher`, write the
 * trimmed list back, and hand it up. The write is best-effort — a full or
 * quota-limited IndexedDB shouldn't sink the feature, so we still return the
 * freshly fetched list.
 */
export async function loadSightings(
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

/**
 * One plant's research-grade, photographed sightings near a spot, fetching from
 * iNaturalist only if there's no fresh cached list for this plant + cell.
 * `inatId` is the taxon id as the registry stores it (`identifiers.inat`).
 * Rejects only on a genuine fetch's failure — an `InatError` carrying the HTTP
 * status, so the caller can tell "slow down" from "unreachable"; a cache hit
 * never touches the network. `now` is injectable for testing.
 */
export async function plantSightingsNear(
  inatId: string,
  lat: number,
  lon: number,
  now: number = Date.now(),
): Promise<SightingResult> {
  const radiusKm = DEFAULT_RADIUS_KM;
  return loadSightings(
    `plant:${inatId}:${cacheKey(lat, lon, radiusKm)}`,
    { lat, lon },
    () => fetchNearbyObservations({ lat, lon, radiusKm, taxonIds: [inatId] }),
    now,
  );
}

/**
 * One plant's sightings inside a region's coverage box ("show it to me in an
 * ecoregion it's native to, even though I'm not there"). Cached once per plant +
 * region id. Same fetch-once-then-serve-from-cache contract as the spot lookup.
 */
export async function plantSightingsInRegion(
  inatId: string,
  regionId: string,
  bounds: Bounds,
  now: number = Date.now(),
): Promise<SightingResult> {
  return loadSightings(
    `plant:${inatId}:${regionCacheKey(regionId)}`,
    boundsCenter(bounds),
    () => fetchRegionObservations({ bounds, taxonIds: [inatId] }),
    now,
  );
}
