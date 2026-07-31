// iNaturalist observations — the "see it growing near you" layer.
//
// What this does: given a spot (the user's coordinates), ask iNaturalist for
// the closest *research-grade* plant observations that carry photos, so a plant
// we recommend can be shown as a real, mature specimen someone can go stand in
// front of — not just a to-scale drawing. Research grade means the community
// has confirmed the ID, so we're not showing a misidentified look-alike.
//
// Two deliberate design choices, both from the repo's data ethos:
//
//   1. **The browser calls iNaturalist directly — no proxy, no server.** The
//      whole product is a static PWA; adding a server-side fetch just to reach a
//      CORS-enabled, key-free public API would be the wrong trade. Calling from
//      the browser also means iNaturalist sees the *real* request: the user's
//      own IP and, in the `Referer` header the browser sets automatically, our
//      app's origin (e.g. `https://indigene.app/`). That is the clear,
//      honest "who is calling" signal iNaturalist asks API users to provide. We
//      can't set a custom `User-Agent` from `fetch` (browsers forbid it), so the
//      Referer *is* our identification — which is why we never route this through
//      a server that would replace it with a datacenter IP and a blank referrer.
//
//   2. **We fetch a nearby *list* once and index it, rather than hammering the
//      API per plant.** One request returns the ~100 closest plant observations
//      around the spot; we trim each down to only what we display (taxon id +
//      photo links + credit) and cache that in IndexedDB (see `db.ts`). Every
//      recommended plant then looks itself up in that cached index by its
//      iNaturalist taxon id — zero extra network calls. See `nearby.ts` for the
//      cache-and-index wrapper; this module is the pure client + trimmer.
//
// Attribution is not optional: iNaturalist content is contributor-owned. Each
// photo carries its own licence code and a ready-made credit string, and we keep
// only photos that carry an explicit licence (dropping "all rights reserved"),
// so anything we ever render can be shown with its credit intact.

const API_BASE = "https://api.inaturalist.org/v1/observations";
const TAXA_BASE = "https://api.inaturalist.org/v1/taxa";

/** Default search radius around the spot, in kilometres. */
export const DEFAULT_RADIUS_KM = 50;

import { monthName, t } from "./i18n";
import { distance, distanceFloor, distanceFloorKm } from "./units";

/** How many observations to pull in the single nearby request (API max is 200). */
export const DEFAULT_PER_PAGE = 100;

export interface NearbyQuery {
  lat: number;
  lon: number;
  /** Search radius in km. Default `DEFAULT_RADIUS_KM`. */
  radiusKm?: number;
  /** Max observations to request. Default `DEFAULT_PER_PAGE`, capped at 200. */
  perPage?: number;
  /** iNaturalist taxon ids to restrict the query to. We pass the taxa native to
   *  the user's region here, so iNaturalist only ever returns — and we only ever
   *  cache — plants we can vouch for as local natives. Omit for an unscoped
   *  "any plant" query (not used by the app; kept for the raw client). */
  taxonIds?: readonly string[];
  /** iNaturalist iconic taxon to scope the search to (e.g. "Plantae" for the
   *  plant layer, "Insecta"/"Aves"/… for the wildlife layer). Defaults to
   *  "Plantae" — the plant layer that first used this client. */
  iconicTaxa?: string;
}

/** A lat/lon bounding box — the coverage box of an Indigene region. Used to look
 *  up sightings *within a region* without being there, instead of a point + radius. */
export interface Bounds {
  swLat: number;
  swLon: number;
  neLat: number;
  neLon: number;
}

export interface RegionQuery {
  bounds: Bounds;
  /** Max observations to request. Default `DEFAULT_PER_PAGE`, capped at 200. */
  perPage?: number;
  /** Taxa to restrict to — the region's natives, same native-only guarantee. */
  taxonIds?: readonly string[];
  /** iNaturalist iconic taxon to scope to. Defaults to "Plantae". */
  iconicTaxa?: string;
}

/** The center of a bounding box — a representative point for the region, used
 *  only to label the lookup, never to compute a "distance from you". */
export function boundsCenter(b: Bounds): { lat: number; lon: number } {
  return { lat: (b.swLat + b.neLat) / 2, lon: (b.swLon + b.neLon) / 2 };
}

/** A single photo, trimmed to what we render and the credit we must show. */
export interface ObservationPhoto {
  /** iNaturalist photo id. */
  id: number;
  /** ~75px square — the thumbnail in the strip. */
  thumbUrl: string;
  /** ~500px — the mid view (and lightbox fallback on slow connections). */
  mediumUrl: string;
  /** ~1024px — the crisp view shown in the lightbox. */
  largeUrl: string;
  /** Licence code as iNaturalist reports it, e.g. "cc-by-nc" or "cc0". Photos
   *  with no licence ("all rights reserved") are dropped before we get here. */
  license: string;
  /** Ready-to-display credit, e.g. "(c) Jane Doe, some rights reserved (CC BY-NC)". */
  attribution: string;
}

/** One observation, trimmed to the fields the app actually uses. Everything
 *  else iNaturalist returns (identifications, comments, faves, project ties,
 *  observation fields…) is discarded before this ever reaches storage. */
export interface ObservationSummary {
  /** iNaturalist observation id — links to `/observations/<id>`. */
  id: number;
  /** iNaturalist taxon id — the join key back to our registry entries. */
  taxonId: number;
  /** Scientific name as iNaturalist recorded it (sanity + display). */
  taxonName: string | null;
  /** Observer login, for credit and their profile link. */
  observer: string;
  /** Coarse place text iNaturalist provides, e.g. "Portland, Oregon". */
  place: string | null;
  /** Observation coordinates. May be null when iNaturalist obscures a location
   *  (it does this for sensitive/threatened taxa) — we surface distance only
   *  when we actually have a point to measure from. */
  lat: number | null;
  lon: number | null;
  /** Great-circle km from the query spot, or null when the point is obscured. */
  distanceKm: number | null;
  /** ISO date the plant was observed, for "seen last June" context. */
  observedOn: string | null;
  /** Licence-bearing photos only; an observation with none is dropped. */
  photos: ObservationPhoto[];
}

/** "~3 km away · seen Jun 2023" — the honest context line for one sighting.
 *  Distance when we measured it (a "near me" lookup), otherwise the coarse place
 *  iNaturalist reports; then the month/year it was observed, when known. It
 *  lives here, beside the shape it describes, because both the sighting card and
 *  the lightbox print it — the lightbox needs it now that paging crosses from one
 *  sighting to the next and the reader has to see *where they've landed*.
 *
 *  Both halves follow the reader's own two settings: the words come from the
 *  language dictionary, the distance from the units picker — so a French reader
 *  who measures in miles gets "à ~2 miles · vue en juin 2023". */
export function whereWhen(o: ObservationSummary): string {
  const bits: string[] = [];
  if (o.distanceKm != null) {
    bits.push(
      o.distanceKm < distanceFloorKm()
        ? t("obs.veryClose", { distance: distanceFloor() })
        : t("obs.away", { distance: distance(o.distanceKm) })
    );
  } else if (o.place) {
    bits.push(o.place);
  }
  if (o.observedOn) {
    const [y, m] = o.observedOn.split("-");
    const mm = Number(m);
    bits.push(
      mm >= 1 && mm <= 12
        ? t("obs.seenOn", { month: monthName(mm, "short"), year: y })
        : t("obs.seenIn", { year: y })
    );
  }
  return bits.join(" · ");
}

// The filters every query shares, whatever the geography: one iconic taxon
// (plants for the plant layer, an animal class for the wildlife layer),
// community-verified IDs only, every result photographed, a modest page size,
// most-recent first, and the taxon scope when given. The trim
// (`summarizeObservations`) is what actually shrinks the payload we keep.
function commonParams(
  perPage: number | undefined,
  taxonIds: readonly string[] | undefined,
  iconicTaxa: string | undefined,
): URLSearchParams {
  const params = new URLSearchParams({
    iconic_taxa: iconicTaxa ?? "Plantae",
    quality_grade: "research",
    photos: "true",
    per_page: String(Math.min(perPage ?? DEFAULT_PER_PAGE, 200)),
    // For a point query we re-sort by our own computed distance afterwards; for
    // a region query there's no "you" to measure from, so this recency order is
    // the one the user actually sees. Either way a stale cache reads as current.
    order_by: "observed_on",
    order: "desc",
  });
  if (taxonIds && taxonIds.length) params.set("taxon_id", taxonIds.join(","));
  return params;
}

/**
 * Build a *point* request URL (spot + radius). Pure and exported so the query is
 * inspectable. `lat`/`lng`/`radius` bound it to the spot; `taxon_id` (when given)
 * restricts to those taxa so a non-native garden escape nearby is never returned.
 */
export function buildObservationsUrl(q: NearbyQuery): string {
  const params = commonParams(q.perPage, q.taxonIds, q.iconicTaxa);
  params.set("lat", String(q.lat));
  params.set("lng", String(q.lon));
  params.set("radius", String(q.radiusKm ?? DEFAULT_RADIUS_KM));
  return `${API_BASE}?${params.toString()}`;
}

/**
 * Build a *region* request URL bounded by a box (`nelat/nelng/swlat/swlng`) —
 * for looking up sightings inside a region without being there. Same native-taxa
 * scope, so it only ever returns plants that belong in that region.
 */
export function buildBoundsUrl(q: RegionQuery): string {
  const params = commonParams(q.perPage, q.taxonIds, q.iconicTaxa);
  params.set("swlat", String(q.bounds.swLat));
  params.set("swlng", String(q.bounds.swLon));
  params.set("nelat", String(q.bounds.neLat));
  params.set("nelng", String(q.bounds.neLon));
  return `${API_BASE}?${params.toString()}`;
}

/** Great-circle distance in kilometres between two lat/lon points. */
export function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

// iNaturalist photo URLs embed the size as the final path segment
// (…/photos/12345/square.jpg). Swap that token to ask for a different size.
const SIZE_TOKEN = /\/(square|small|medium|large|original)\.(\w+)(\?.*)?$/;
function photoUrlForSize(url: string, size: "square" | "medium" | "large"): string {
  return url.replace(SIZE_TOKEN, `/${size}.$2$3`);
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

// iNaturalist returns the observation point as `location: "lat,lon"` and also
// `geojson.coordinates: [lon, lat]`. Prefer geojson (typed), fall back to the
// string. Returns null when the location is obscured (both absent).
function pointOf(raw: any): { lat: number; lon: number } | null {
  const coords = raw?.geojson?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    const lon = num(coords[0]);
    const lat = num(coords[1]);
    if (lat != null && lon != null) return { lat, lon };
  }
  const loc = str(raw?.location);
  if (loc) {
    const [lat, lon] = loc.split(",").map((s) => num(Number(s)));
    if (lat != null && lon != null) return { lat, lon };
  }
  return null;
}

function trimPhotos(raw: any): ObservationPhoto[] {
  const photos: any[] = Array.isArray(raw?.photos) ? raw.photos : [];
  const out: ObservationPhoto[] = [];
  for (const p of photos) {
    const id = num(p?.id);
    const url = str(p?.url);
    const license = str(p?.license_code); // null ⇒ "all rights reserved"
    if (id == null || !url || !license) continue; // keep only reusable photos
    out.push({
      id,
      thumbUrl: photoUrlForSize(url, "square"),
      mediumUrl: photoUrlForSize(url, "medium"),
      largeUrl: photoUrlForSize(url, "large"),
      license,
      attribution: str(p?.attribution) ?? `© observer, ${license.toUpperCase()}`,
    });
  }
  return out;
}

/**
 * Trim a raw iNaturalist `results` array to `ObservationSummary[]`.
 *
 * `from` is the point to measure each sighting's distance against — the user's
 * spot in a "near me" lookup. Pass `null` for a region lookup (you're *not*
 * there, so "3 km away" would be meaningless): distances stay null and the list
 * keeps the API's most-recent-first order instead of sorting by distance.
 *
 * Observations with no licence-bearing photo, or no taxon id (the join key), are
 * dropped. With a point, nearest first; obscured-location results sort to the end.
 */
export function summarizeObservations(
  results: unknown,
  from: { lat: number; lon: number } | null,
): ObservationSummary[] {
  const rows: any[] = Array.isArray(results) ? results : [];
  const out: ObservationSummary[] = [];
  for (const r of rows) {
    const taxonId = num(r?.taxon?.id);
    if (taxonId == null) continue;
    const photos = trimPhotos(r);
    if (!photos.length) continue;
    const pt = pointOf(r);
    out.push({
      id: num(r?.id) ?? 0,
      taxonId,
      taxonName: str(r?.taxon?.name),
      observer: str(r?.user?.login) ?? "an iNaturalist observer",
      place: str(r?.place_guess),
      lat: pt?.lat ?? null,
      lon: pt?.lon ?? null,
      distanceKm: from && pt ? haversineKm(from.lat, from.lon, pt.lat, pt.lon) : null,
      observedOn: str(r?.observed_on),
      photos,
    });
  }
  // Region lookup (no `from`): keep the API's recency order untouched.
  if (!from) return out;
  return out.sort((a, b) => {
    if (a.distanceKm == null) return b.distanceKm == null ? 0 : 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });
}

/**
 * Fetch and trim the nearby research-grade observations for a spot — plants
 * (the plant layer) or one animal's sightings (the wildlife layer), depending
 * on how `q` is scoped. One network call; the returned array is already
 * trimmed, distance-tagged, and sorted nearest-first — ready to cache. Rejects
 * only on network/HTTP failure, so callers can distinguish "no signal" from
 * "nothing nearby" (an empty array). `signal` lets a caller time it out.
 */
export async function fetchNearbyObservations(
  q: NearbyQuery,
  signal?: AbortSignal,
): Promise<ObservationSummary[]> {
  const res = await fetch(buildObservationsUrl(q), { signal });
  if (!res.ok) throw new Error(`iNaturalist ${res.status}`);
  const data = await res.json();
  return summarizeObservations(data?.results, { lat: q.lat, lon: q.lon });
}

/**
 * Fetch and trim the research-grade observations inside a region's box — the
 * "look it up in a specific ecoregion even if you're not there" path. Same one
 * call, same trim; distances are left null (there's no "you" to measure from)
 * and the list stays most-recent-first.
 */
export async function fetchRegionObservations(
  q: RegionQuery,
  signal?: AbortSignal,
): Promise<ObservationSummary[]> {
  const res = await fetch(buildBoundsUrl(q), { signal });
  if (!res.ok) throw new Error(`iNaturalist ${res.status}`);
  const data = await res.json();
  return summarizeObservations(data?.results, null);
}

/** Index a trimmed list by iNaturalist taxon id, each bucket nearest-first
 *  (input order is preserved, so pass an already-sorted list). This is the
 *  join table the app uses: registry entry → `identifiers.inat` → observations. */
export function indexByTaxon(
  observations: ObservationSummary[],
): Map<number, ObservationSummary[]> {
  const index = new Map<number, ObservationSummary[]>();
  for (const o of observations) {
    const bucket = index.get(o.taxonId);
    if (bucket) bucket.push(o);
    else index.set(o.taxonId, [o]);
  }
  return index;
}

// ---------------------------------------------------------------------------
// Name → taxon id resolution (the wildlife layer).
//
// Plants carry a reconciled numeric iNaturalist id in the registry, so the plant
// layer queries observations directly by `taxon_id`. The wildlife catalog has no
// such reconciliation; it carries the animal's *scientific name* (already curated
// and sourced). We turn that name into a taxon id here, at request time, by
// asking iNaturalist's own taxa endpoint — which follows its synonymy, so a
// renamed taxon (e.g. the gulf fritillary, moved from Agraulis to Dione) still
// resolves. Resolving to an id and then querying `taxon_id` is deliberate: the
// observations endpoint's free-text `taxon_name` filter silently returns
// *everything* when a name doesn't match, which for us would mean showing random
// creatures as if they were the one asked for. Going through an id fails safe —
// an unresolvable name yields null, and the caller shows nothing.
// ---------------------------------------------------------------------------

/** Build the taxa-search URL for a scientific name, scoped to one iconic taxon
 *  so a cross-kingdom homonym can't win. Pure and exported for inspection. */
export function buildTaxaUrl(name: string, iconicTaxa: string): string {
  const params = new URLSearchParams({
    q: name,
    iconic_taxa: iconicTaxa,
    is_active: "true",
    per_page: "10",
  });
  return `${TAXA_BASE}?${params.toString()}`;
}

/**
 * Pick the taxon id that best matches a scientific name from a taxa-search
 * `results` array, or null if nothing plausible matches. Pure, so the choice is
 * testable without a network call. The preference order:
 *   1. an active taxon whose accepted name equals the query exactly,
 *   2. else an active taxon of the expected rank (a genus name → a genus; a
 *      binomial → a species), which is where a synonym search lands (the query
 *      name is a synonym, the accepted name differs),
 *   3. else the first active result.
 * The iconic-taxon filter was already applied in the query, so every candidate
 * here is in the right group of life.
 */
export function pickTaxon(results: unknown, name: string): number | null {
  const rows: any[] = Array.isArray(results) ? results : [];
  const active = rows.filter((r) => r?.is_active !== false && num(r?.id) != null);
  if (!active.length) return null;
  const want = name.trim().toLowerCase();
  const expectedRank = want.includes(" ") ? "species" : "genus";
  const exact = active.find((r) => str(r?.name)?.toLowerCase() === want);
  if (exact) return num(exact.id);
  const byRank = active.find((r) => str(r?.rank) === expectedRank);
  if (byRank) return num(byRank.id);
  return num(active[0].id);
}

/**
 * Resolve a scientific name to an iNaturalist taxon id, or null if it can't be
 * matched. One network call to the taxa endpoint; rejects only on network/HTTP
 * failure, so a caller can tell "no signal" from "no such taxon" (null).
 */
export async function resolveTaxon(
  name: string,
  iconicTaxa: string,
  signal?: AbortSignal,
): Promise<number | null> {
  const res = await fetch(buildTaxaUrl(name, iconicTaxa), { signal });
  if (!res.ok) throw new Error(`iNaturalist taxa ${res.status}`);
  const data = await res.json();
  return pickTaxon(data?.results, name);
}
