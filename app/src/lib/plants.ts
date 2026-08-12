// Loads a region's seed dataset and derives the one score we compute rather than
// author by hand: the caterpillar/moth host value. We store the RAW Lepidoptera
// host-species count in the data (honest, checkable) and normalize it here on a
// log scale, because the difference between 5 and 50 host species matters far
// more than the difference between 450 and 500.
import type { EcoScores, Plant, SavedSpot, SiteData } from "../types";
import type { RawPlant, RegionDef } from "../data/region";
import { REGIONS, regionsForCoords } from "../data/regions";

// A single, shared anchor for the top of the host scale (oaks/willows/poplars,
// ~500 Lepidoptera species) so host scores are comparable across regions.
const HOST_ANCHOR = 520;

export function hostScore(count: number): number {
  const s = Math.log10(1 + count) / Math.log10(1 + HOST_ANCHOR);
  return Math.round(Math.min(100, Math.max(0, s * 100)));
}

function build(raw: RawPlant): Plant {
  const scores: EcoScores = { ...raw.scores, host: hostScore(raw.hostLepCount) };
  return { ...raw, scores };
}

// Built plant lists are cached per region id so we only derive scores once —
// and, now that the list arrives over the network, so we only fetch once. The
// cache holds the in-flight promise rather than the finished array: two pages
// asking at the same moment (the ranked list and the plant page behind it)
// would otherwise each start their own download of the same file.
const cache = new Map<string, Promise<Plant[]>>();

/**
 * One region's plants, fetching the region's list the first time.
 *
 * Async because each region's list is a separate download (see `data/regions.ts`
 * — a reader gets the region they garden in, not all nine). After the first
 * call it resolves from memory, and the service worker keeps the file, so it
 * survives a reload and works offline.
 */
export function loadPlants(region: RegionDef): Promise<Plant[]> {
  const cached = cache.get(region.meta.id);
  if (cached) return cached;
  const built = region.load().then((seed) => seed.map(build));
  // A failed fetch must not be remembered as the answer: drop it so a later
  // call (back online, or just a retry) can try again.
  built.catch(() => cache.delete(region.meta.id));
  cache.set(region.meta.id, built);
  return built;
}

/** The plants already in memory for a region, or null if none have been
 *  fetched. For the few places that can show something useful straight away and
 *  fill in the rest when the list lands. */
export function loadedPlants(region: RegionDef): Promise<Plant[]> | null {
  return cache.get(region.meta.id) ?? null;
}

/**
 * Which covered region a spot falls in, or null if we have no list for it.
 *
 * The coarse bounding boxes give the candidates — possibly several, since the
 * French regions' boxes overlap (see `regionsForCoords`). Then, *if* a live
 * lookup gave us the spot's ecoregion, it decides between them: a candidate
 * that declares ecoregions in the same classification must actually contain the
 * spot's code. That is what makes a point in the box but the wrong ecoregion
 * (east of the Cascade crest; a Mediterranean point inside the Atlantic box)
 * fall through to the right list, or to "no list", instead of getting a
 * poorly-fitting one.
 *
 * With no live ecoregion (offline, or outside a provider's coverage) the boxes
 * alone decide and the tightest one wins, so nothing regresses without a
 * signal. Regions that declare no ecoregion at all (the Mid-Atlantic) are pure
 * box claims: they can't be confirmed by a code, so they only stand in when no
 * declaring candidate matched.
 */
export function regionForSite(
  lat: number,
  lon: number,
  site?: SiteData | null
): RegionDef | null {
  const candidates = regionsForCoords(lat, lon);
  if (!candidates.length) return null;
  const info = site?.ecoregionInfo ?? null;
  if (info) {
    // Only regions classified by the *same* provider can be tested — an
    // Omernik code never gets checked against an EEA region set.
    const comparable = candidates.filter(
      (r) => r.meta.ecoregion?.provider === info.provider && r.meta.ecoregion.codes.length
    );
    const matched = comparable.find((r) => r.meta.ecoregion!.codes.includes(info.code));
    if (matched) return matched;
    // A comparable candidate that failed is a real "not here" answer, so we
    // don't quietly fall back to it; but a box-only region was never in that
    // conversation and still stands.
    if (comparable.length) {
      return candidates.find((r) => !r.meta.ecoregion?.codes.length) ?? null;
    }
  }
  return candidates[0];
}

/** The region a saved spot's plants come from — the reader's own pick first,
 *  the coordinates otherwise, exactly as everywhere else in the app. Shared so
 *  the spot's page and the saved list can't answer it two different ways. */
export function regionForSpot(spot: SavedSpot): RegionDef | null {
  const picked = spot.regionOverride
    ? REGIONS.find((r) => r.meta.id === spot.regionOverride) ?? null
    : null;
  return picked ?? regionForSite(spot.lat, spot.lon, spot.site);
}

export { REGIONS };
export type { RegionDef };
