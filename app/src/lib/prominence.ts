// One request, every plant's tally.
//
// "How common is this plant around here?" is a question the reader asks of
// forty plants, not one — they are choosing between the natives on a list for
// their own spot. Asked plant by plant (`rarityNear`), that is forty requests
// to iNaturalist for forty numbers, each arriving a beat after the page it
// belongs to.
//
// iNaturalist will answer all forty at once. `observations/species_counts`
// takes the same circle and the same filters as a count request and returns one
// row per taxon, so the whole roster of a region costs a single call — around
// 10 KB on the wire for seventy plants, against seventy round trips. The rows
// land in the very cache entries `rarity.ts` reads (`countKey`), so nothing
// downstream has to know a batch happened: a plant page simply finds its number
// already there.
//
// **Counts are not photographs.** This is the cheap half of the iNaturalist
// layer and it stays cheap: a count carries no photo, no observer, no
// coordinate — just how many records exist. The photographs are the expensive
// half (a hundred sightings' worth of JSON, ~190 KB), and they are still
// fetched only when somebody asks to see them, by `nearby.ts`. Splitting the
// two is what lets the app say "seldom recorded around here" the moment a page
// opens without downloading a gallery nobody looked at.
//
// A subspecies caveat, so the two halves agree: iNaturalist's `taxon_id` filter
// matches descendants, so a single count for a species includes records
// identified as its varieties. `species_counts` reports those under their own
// row, so `tallyByTaxon` adds a row into every taxon we asked about that sits
// above it — which reproduces the single-count number exactly.
import { InatError } from "./inaturalist";
import { cacheKey } from "./nearby";
import { areaTotal, cachedCount, countKey, storeCount } from "./rarity";

const SPECIES_COUNTS = "https://api.inaturalist.org/v1/observations/species_counts";

/** Taxa per request. Seventy is the biggest roster the app has today and fits
 *  comfortably in a URL; the cap is here so a region that grows past it splits
 *  into two calls instead of building an address a proxy might truncate. */
const MAX_TAXA = 100;

/** Rows per response. The API's ceiling, and far above any roster — a request
 *  for 100 taxa can't come back paginated. */
const PER_PAGE = 500;

/**
 * The batch request URL: the same circle and the same filters a single count
 * uses, asked of every taxon at once. Pure and exported so the query is
 * inspectable, like every other call in the app.
 */
export function buildSpeciesCountsUrl(
  lat: number,
  lon: number,
  radiusKm: number,
  taxonIds: readonly string[]
): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lon),
    radius: String(radiusKm),
    iconic_taxa: "Plantae",
    quality_grade: "research",
    per_page: String(PER_PAGE),
    taxon_id: taxonIds.join(","),
  });
  return `${SPECIES_COUNTS}?${params.toString()}`;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * Turn a `species_counts` `results` array into a count for each taxon asked
 * about. Every requested id gets an entry: a taxon nobody has recorded in the
 * circle simply doesn't come back, and zero is the honest answer for it — as
 * informative here as a large number, since "nobody has recorded this within 30
 * miles" is a verdict of its own.
 *
 * A row is added to each requested taxon it belongs to — itself, or any
 * ancestor we asked about — which is how a variety's records reach the species
 * that contains it. Pure, so the arithmetic is testable without a network call.
 */
export function tallyByTaxon(
  results: unknown,
  wanted: readonly string[]
): Map<string, number> {
  const out = new Map<string, number>(wanted.map((id) => [id, 0]));
  const rows: any[] = Array.isArray(results) ? results : [];
  for (const row of rows) {
    const count = num(row?.count);
    if (count == null) continue;
    const taxon = row?.taxon;
    const ancestry: unknown[] = Array.isArray(taxon?.ancestor_ids) ? taxon.ancestor_ids : [];
    // A Set because `ancestor_ids` includes the taxon itself: without it, a row
    // matching a requested id both ways would be counted twice.
    const hits = new Set<string>();
    for (const id of [taxon?.id, ...ancestry]) {
      const key = num(id) != null ? String(id) : null;
      if (key != null && out.has(key)) hits.add(key);
    }
    for (const key of hits) out.set(key, (out.get(key) ?? 0) + count);
  }
  return out;
}

/** Split a list into chunks of at most `size`. */
function chunk<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function fetchTally(
  lat: number,
  lon: number,
  radiusKm: number,
  taxonIds: readonly string[],
  signal?: AbortSignal
): Promise<Map<string, number>> {
  const res = await fetch(buildSpeciesCountsUrl(lat, lon, radiusKm, taxonIds), { signal });
  if (!res.ok) throw new InatError(res.status, "species_counts");
  const data = await res.json();
  return tallyByTaxon(data?.results, taxonIds);
}

/**
 * Fill the count cache for a whole roster around a spot.
 *
 * Asks iNaturalist only about the taxa whose counts aren't already here and
 * fresh, and not at all when they all are — so a second plant page, a second
 * visit inside the week, or another spot in the same ~11 km cell costs nothing.
 * The area yardstick is fetched alongside (its own tiny request), because a
 * count means nothing without it.
 *
 * Resolves either way: this warms a cache, and a page that ends up without a
 * number simply doesn't print the line. `now` is injectable for testing.
 */
export async function warmProminence(
  taxonIds: readonly string[],
  lat: number,
  lon: number,
  radiusKm: number,
  now: number = Date.now()
): Promise<void> {
  const area = cacheKey(lat, lon, radiusKm);
  const unique = [...new Set(taxonIds)].filter(Boolean);
  const known = await Promise.all(
    unique.map((id) => cachedCount(countKey(id, area), now).then((c) => (c == null ? id : null)))
  );
  const missing = known.filter((id): id is string => id != null);

  await Promise.all([
    // The yardstick has its own cache entry and its own week; asking for it
    // here is what makes the reading complete for every plant in one go.
    areaTotal(lat, lon, radiusKm, now).catch(() => undefined),
    ...chunk(missing, MAX_TAXA).map(async (ids) => {
      const tally = await fetchTally(lat, lon, radiusKm, ids).catch(() => null);
      if (!tally) return;
      await Promise.all([...tally].map(([id, count]) => storeCount(countKey(id, area), count, now)));
    }),
  ]);
}
