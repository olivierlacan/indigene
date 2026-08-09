// "Is this plant still around here, or has it nearly gone?"
//
// A gardener choosing between two good natives has no way to tell which one the
// neighbourhood is short of. Both are native, both feed things, both suit the
// spot — and one of them may have three records within thirty miles while the
// other has three thousand. Planting the scarce one puts back something the
// area has actually lost. That is the gap this answers.
//
// ## How it's measured, and what the number is *not*
//
// Two counts from iNaturalist, both bounded by the same circle around the spot:
//
//   - how many research-grade records exist of **this plant**, and
//   - how many exist of **all plants**, as the yardstick.
//
// The second one is the whole point. A raw count can't be read on its own: 40
// records is a well-known plant in a quiet rural county and a rarity in central
// London, because the two places differ enormously in how many people are out
// there recording anything. Dividing by the area's total plant records cancels
// most of that out, and what's left — this plant's share of everything anyone
// recorded here — is comparable between places.
//
// **It is a record of attention, not a census.** Nobody photographs the grass;
// everybody photographs the orchid. A plant can be scarce in the data because
// it is genuinely scarce, because it is dull, because it flowers for a week in
// April, or because it grows where people don't walk. The UI that shows this
// says so in one line, every time, and the number itself is always printed
// beside the verdict so a reader can disagree with our reading of it.
//
// Both requests ask for `per_page=0` — iNaturalist returns the count and no
// rows at all, a few dozen bytes. The area yardstick is fetched once per area
// and reused by every plant asked about there. Both are cached for a week in
// the same key/value store the app's preferences live in.
//
// The per-plant count normally doesn't cost a request at all: `prominence.ts`
// fills these same cache entries for a whole region's roster in one call, so
// the fetch below is the fallback for a plant that batch didn't cover. Neither
// count ever carries a photo — the photographs are a separate, much larger
// request that only happens when somebody asks to see them (`nearby.ts`).
import { InatError } from "./inaturalist";
import { kvGet, kvSet } from "../db";
import { cacheKey, CACHE_TTL_MS } from "./nearby";

const API_BASE = "https://api.inaturalist.org/v1/observations";

/**
 * How this plant stands against everything else recorded around here.
 *
 *  - "none"       Nobody has recorded it in this circle at all.
 *  - "scarce"     Recorded, but barely — the ones worth putting back.
 *  - "occasional" Recorded here and there, the ordinary middle.
 *  - "common"     One of the plants people record most around here.
 */
export type RarityLevel = "none" | "scarce" | "occasional" | "common";

export interface Rarity {
  level: RarityLevel;
  /** Research-grade records of this plant inside the circle. */
  count: number;
  /** Research-grade records of every plant inside it — the yardstick. */
  total: number;
  /** The circle the two counts were taken in. */
  radiusKm: number;
}

/**
 * Share-of-all-plant-records thresholds, with a small-count floor.
 *
 * Calibrated against a well-recorded area (50 km around Philadelphia, ~385,000
 * plant records): white oak and butterfly weed — plants you meet on any walk —
 * sit at ~0.25%; New England aster at ~0.10%; blue false indigo, which is
 * genuinely uncommon in the wild there, at ~0.02%. So a quarter of a percent
 * is "you see this everywhere" and a fiftieth of one is "you don't".
 *
 * The floor is what keeps the reading honest in a thinly recorded place: under
 * five records the share is arithmetic on noise, and a single enthusiast's
 * afternoon could move it a whole band.
 */
const COMMON_SHARE = 0.002;
const OCCASIONAL_SHARE = 0.0003;
const MIN_COUNT = 5;

export function rarityLevel(count: number, total: number): RarityLevel {
  if (count <= 0) return "none";
  if (count < MIN_COUNT || total <= 0) return "scarce";
  const share = count / total;
  if (share >= COMMON_SHARE) return "common";
  if (share >= OCCASIONAL_SHARE) return "occasional";
  return "scarce";
}

/** A count request: the circle, optionally narrowed to one taxon. `per_page=0`
 *  asks iNaturalist for the tally and none of the rows. Pure and exported so
 *  the query is inspectable, like every other call in the app. */
export function buildCountUrl(
  lat: number,
  lon: number,
  radiusKm: number,
  taxonId?: string
): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lon),
    radius: String(radiusKm),
    iconic_taxa: "Plantae",
    quality_grade: "research",
    per_page: "0",
  });
  if (taxonId) params.set("taxon_id", taxonId);
  return `${API_BASE}?${params.toString()}`;
}

async function fetchCount(url: string, signal?: AbortSignal): Promise<number> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new InatError(res.status, "observations");
  const data = await res.json();
  const n = data?.total_results;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

interface CachedCount {
  capturedAt: number;
  count: number;
}

/** Where one count lives: a taxon id, or `all` for the area's yardstick, inside
 *  the area the two were taken in. Shared with `prominence.ts`, which fills the
 *  same entries in bulk — one name for the key so the two can't drift apart. */
export function countKey(what: string, area: string): string {
  return `count:${what}:${area}`;
}

/** A count from the cache, or undefined when it's missing or past the TTL.
 *  Never touches the network — the read a page does before deciding whether it
 *  has anything to ask for. */
export async function cachedCount(key: string, now: number): Promise<number | undefined> {
  const hit = await kvGet<CachedCount>(key).catch(() => undefined);
  return hit && now - hit.capturedAt <= CACHE_TTL_MS ? hit.count : undefined;
}

/** Write one count back. Best-effort: a full or blocked IndexedDB costs us the
 *  saved request next time, nothing more. */
export async function storeCount(key: string, count: number, now: number): Promise<void> {
  await kvSet<CachedCount>(key, { capturedAt: now, count }).catch(() => {});
}

/** One count, cached for a week under its own key. */
async function countCached(key: string, url: string, now: number): Promise<number> {
  const hit = await cachedCount(key, now);
  if (hit != null) return hit;
  const count = await fetchCount(url);
  await storeCount(key, count, now);
  return count;
}

/** The area's yardstick: research-grade records of *every* plant in the circle.
 *  One request per area, reused by every plant asked about there. */
export function areaTotal(
  lat: number,
  lon: number,
  radiusKm: number,
  now: number = Date.now()
): Promise<number> {
  const area = cacheKey(lat, lon, radiusKm);
  return countCached(countKey("all", area), buildCountUrl(lat, lon, radiusKm), now);
}

/**
 * How common this plant is around a spot. `inatId` is the taxon id the registry
 * carries (`identifiers.inat`).
 *
 * Two cached counts, keyed on the same ~11 km cell the sightings cache uses, so
 * asking about a second plant in the same neighbourhood costs one request, not
 * two. Rejects only when a genuine fetch fails, so the caller can stay quiet
 * about it — a missing answer here should never look like an alarming one.
 */
export async function rarityNear(
  inatId: string,
  lat: number,
  lon: number,
  radiusKm: number,
  now: number = Date.now()
): Promise<Rarity> {
  const area = cacheKey(lat, lon, radiusKm);
  const [count, total] = await Promise.all([
    countCached(countKey(inatId, area), buildCountUrl(lat, lon, radiusKm, inatId), now),
    areaTotal(lat, lon, radiusKm, now),
  ]);
  return { level: rarityLevel(count, total), count, total, radiusKm };
}

/**
 * The same reading, but only if both counts are already here — otherwise null,
 * and nothing is asked of iNaturalist.
 *
 * This is the ordinary path now that a spot's whole roster is counted in one
 * call (`prominence.ts`): a plant page opened from a list the reader has
 * already set a spot for answers "how common is this around here?" out of the
 * device, with no network at all.
 */
export async function rarityCached(
  inatId: string,
  lat: number,
  lon: number,
  radiusKm: number,
  now: number = Date.now()
): Promise<Rarity | null> {
  const area = cacheKey(lat, lon, radiusKm);
  const [count, total] = await Promise.all([
    cachedCount(countKey(inatId, area), now),
    cachedCount(countKey("all", area), now),
  ]);
  if (count == null || total == null) return null;
  return { level: rarityLevel(count, total), count, total, radiusKm };
}
