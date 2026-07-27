// The cache-and-index layer over the iNaturalist client.
//
// The rule the whole feature turns on: **hit the network at most once per area,
// then serve every plant from memory/IndexedDB.** A single request returns the
// closest research-grade plant observations around a spot; we trim it (see
// `inaturalist.ts`), store the trimmed list in IndexedDB keyed by a coarse
// geographic cell, and index it by taxon id. Any recommended plant then answers
// "is this growing near me?" by a map lookup — no further calls.
//
// Freshness: observations accrete slowly and we're showing "here's roughly what
// this looks like locally", not a live feed, so a week-old cache is fine. A spot
// within the same ~11 km cell reuses the entry; move to a new cell (or let the
// entry age out) and we fetch once more.
import {
  fetchNearbyPlantObservations,
  indexByTaxon,
  DEFAULT_RADIUS_KM,
  type NearbyQuery,
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

/** True when a cache record is missing or older than the TTL. */
function isStale(rec: CachedObservations | undefined, now: number): rec is undefined {
  return !rec || now - rec.capturedAt > CACHE_TTL_MS;
}

export interface NearbyResult {
  /** All nearby observations, nearest-first. */
  observations: ObservationSummary[];
  /** Indexed by iNaturalist taxon id for O(1) per-plant lookup. */
  byTaxon: Map<number, ObservationSummary[]>;
  /** The point the list is measured from. */
  from: { lat: number; lon: number };
  /** true when served from IndexedDB, false when just fetched from the network. */
  fromCache: boolean;
}

/**
 * Get the nearby observation index for a spot, fetching from iNaturalist only if
 * there's no fresh cached list for the area. Rejects only on network failure of
 * a genuine fetch; a cache hit never touches the network.
 *
 * `now` is injectable so the freshness logic is testable; it defaults to the
 * current time.
 */
export async function nearbyObservations(
  q: NearbyQuery,
  now: number = Date.now(),
): Promise<NearbyResult> {
  const radiusKm = q.radiusKm ?? DEFAULT_RADIUS_KM;
  const key = cacheKey(q.lat, q.lon, radiusKm);

  const cached = await getCachedObservations(key).catch(() => undefined);
  if (!isStale(cached, now)) {
    return {
      observations: cached.observations,
      byTaxon: indexByTaxon(cached.observations),
      from: cached.from,
      fromCache: true,
    };
  }

  const fetched = await fetchNearbyPlantObservations({ ...q, radiusKm });
  // Native-only guarantee: keep only observations whose taxon is one of our
  // catalog natives. The query is already scoped to the region's taxa, but this
  // makes it a property of the layer, not just the caller — nothing non-native
  // ever reaches the cache or the screen, even if a query is left unscoped.
  const observations = fetched.filter((o) => entryByInatId(String(o.taxonId)));
  // Best-effort write: a full/again quota-limited IndexedDB shouldn't sink the
  // feature — we still return the freshly fetched list.
  await putCachedObservations({
    key,
    capturedAt: now,
    from: { lat: q.lat, lon: q.lon },
    radiusKm,
    observations,
  }).catch(() => {});

  return {
    observations,
    byTaxon: indexByTaxon(observations),
    from: { lat: q.lat, lon: q.lon },
    fromCache: false,
  };
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
