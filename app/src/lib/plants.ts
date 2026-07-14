// Loads a region's seed dataset and derives the one score we compute rather than
// author by hand: the caterpillar/moth host value. We store the RAW Lepidoptera
// host-species count in the data (honest, checkable) and normalize it here on a
// log scale, because the difference between 5 and 50 host species matters far
// more than the difference between 450 and 500.
import type { EcoScores, Plant, SiteData } from "../types";
import type { RawPlant, RegionDef } from "../data/region";
import { REGIONS, regionForCoords } from "../data/regions";

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

// Built plant lists are cached per region id so we only derive scores once.
const cache = new Map<string, Plant[]>();

export function loadPlants(region: RegionDef): Plant[] {
  const cached = cache.get(region.meta.id);
  if (cached) return cached;
  const built = region.seed.map(build);
  cache.set(region.meta.id, built);
  return built;
}

/**
 * Which covered region a spot falls in, or null if we have no list for it.
 *
 * The coarse bounding box picks the candidate region (boxes never overlap).
 * Then, *if* a live EPA lookup gave us the spot's Level III ecoregion and the
 * region declares which ecoregions it covers, the code must match too — this is
 * what makes a point in the box but the wrong ecoregion (e.g. east of the
 * Cascade crest) fall through to "no list" instead of getting a poorly-fitting
 * one. With no live ecoregion (offline, or outside the conterminous US) the box
 * alone decides, exactly as before, so nothing regresses without a signal.
 */
export function regionForSite(
  lat: number,
  lon: number,
  site?: SiteData | null
): RegionDef | null {
  const boxed = regionForCoords(lat, lon);
  if (!boxed) return null;
  const codes = boxed.meta.ecoregionsL3;
  const l3 = site?.ecoregionInfo?.l3Code ?? null;
  if (l3 && codes && codes.length) {
    return codes.includes(l3) ? boxed : null;
  }
  return boxed;
}

export { REGIONS };
export type { RegionDef };
