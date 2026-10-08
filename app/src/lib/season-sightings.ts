// Which animals turn up near a spot in this season, and which natives would
// feed them — the "plant next" half of a spot's season plan.
//
// The question is narrower than the sightings card's (`lib/spot-sightings.ts`).
// That one asks about the animals your plants *already* feed. This one asks
// about every animal the region's list feeds, seen within `SPOT_RADIUS_KM` in
// the months of the current season, any year — so a garden with no milkweed
// still hears that monarchs come through here in September.
//
// Same request shape, same privacy: one species-counts call for every animal
// at once, from a point rounded to about a kilometre, and only when the person
// taps to look. An answer already on the device is shown without asking, and
// kept a month (`SEASON_TTL_MS`), so a spot costs iNaturalist at most one call
// per season-month window, not one per visit. The months travel as `month=9,10,11`, which says nothing about the spot.
//
// **Can, not will.** A plant that feeds an animal seen nearby is a good bet,
// not a promise. The page says "seen near here", never "will come".
import { kvGet, kvSet } from "../db";
import type { Plant } from "../types";
import { SUPPORT } from "../data/wildlife";
import { InatError } from "./inaturalist";
import { mirrorMonth, type Hemisphere } from "./hemisphere";
import type { Season } from "./planting";
import { relianceOf, wildlifeForPlant } from "./wildlife";
import { buildCountsUrl, foldCounts, roundedPoint, taxaFor } from "./spot-sightings";

/** Every animal a region's list has a tie to — the ones worth looking for. */
export function regionAnimals(regionId: string): string[] {
  const ids = new Set<string>();
  for (const links of Object.values(SUPPORT[regionId] ?? {})) {
    for (const l of links) ids.add(l.wildlifeId);
  }
  return [...ids].sort();
}

/** A season's months, 1–12, on the spot's side of the equator. */
export function seasonMonths(season: Season, hemisphere: Hemisphere): number[] {
  const north: Record<Season, number[]> = {
    winter: [12, 1, 2],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    fall: [9, 10, 11],
  };
  return north[season].map((m) => (hemisphere === "south" ? mirrorMonth(m - 1) + 1 : m));
}

/** The counts request, scoped to a season's months. Pure, so it can be read. */
export function buildSeasonUrl(q: { lat: number; lon: number; taxonIds: readonly number[]; months: number[] }): string {
  const url = new URL(buildCountsUrl(q));
  url.searchParams.set("month", q.months.join(","));
  return url.toString();
}

export interface SeasonSightings {
  /** Verified sightings within the radius in these months, any year. */
  counts: Record<string, number>;
  capturedAt: number;
}

/**
 * How long a season's answer is kept. A month, not the week the sightings card
 * uses: these are counts over every past year, so a few weeks of new photos
 * barely move them, and each refresh is a call to iNaturalist we don't need.
 */
export const SEASON_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function cacheKey(spot: { lat: number; lon: number }, taxonIds: number[], months: number[]): string {
  const p = roundedPoint(spot.lat, spot.lon);
  return `season-sightings:${p.lat},${p.lon}:${months.join(",")}:${taxonIds.join(",")}`;
}

function taxonIdsFor(wildlifeIds: readonly string[]): { taxa: Map<number, string>; taxonIds: number[] } {
  const taxa = taxaFor(wildlifeIds);
  return { taxa, taxonIds: [...taxa.keys()].sort((a, b) => a - b) };
}

/** The answer already on the device, when it's fresh — never a request. */
export async function cachedSeasonSightings(
  spot: { lat: number; lon: number },
  wildlifeIds: readonly string[],
  months: number[],
  now: number = Date.now()
): Promise<SeasonSightings | undefined> {
  const { taxonIds } = taxonIdsFor(wildlifeIds);
  if (!taxonIds.length) return undefined;
  const hit = await kvGet<SeasonSightings>(cacheKey(spot, taxonIds, months)).catch(() => undefined);
  return hit && now - hit.capturedAt < SEASON_TTL_MS ? hit : undefined;
}

/** One spot's answer: the device's copy when it's fresh, otherwise one request.
 *  Rejects only on a real fetch failure. */
export async function seasonSightings(
  spot: { lat: number; lon: number },
  wildlifeIds: readonly string[],
  months: number[],
  now: number = Date.now()
): Promise<SeasonSightings> {
  const { taxa, taxonIds } = taxonIdsFor(wildlifeIds);
  if (!taxonIds.length) return { counts: {}, capturedAt: now };
  const hit = await cachedSeasonSightings(spot, wildlifeIds, months, now);
  if (hit) return hit;

  const res = await fetch(buildSeasonUrl({ lat: spot.lat, lon: spot.lon, taxonIds, months }));
  if (!res.ok) throw new InatError(res.status, "observations");
  const data = await res.json();
  const result: SeasonSightings = {
    counts: foldCounts(Array.isArray(data?.results) ? data.results : [], taxa),
    capturedAt: now,
  };
  await kvSet(cacheKey(spot, taxonIds, months), result).catch(() => {});
  return result;
}

/** One native worth adding, and the seen-nearby animals it would feed. */
export interface AddPick {
  plant: Plant;
  /** Animal ids, strongest tie first. */
  animals: string[];
  /** One of them can't do without this plant. */
  sole: boolean;
  score: number;
}

/** A tie's weight: raising young beats feeding adults, and a make-or-break
 *  tie beats both. */
function weight(support: string, reliance: string): number {
  return (reliance === "sole" ? 3 : reliance === "narrow" ? 2 : 1) + (support === "host" ? 1 : 0);
}

/** Does the spot's sun suit the plant? An hour's slack either way, because a
 *  sun reading is an estimate and so is a plant's range. Unknown sun fits. */
export function sunFits(plant: Pick<Plant, "sun">, hours: number | null): boolean {
  if (hours == null) return true;
  return hours >= plant.sun.minHours - 1 && hours <= plant.sun.maxHours + 1;
}

/**
 * Natives from the region's list that aren't planted here yet, ranked by how
 * much they'd do for the animals seen nearby this season. Each animal's
 * sightings count once toward a plant (a plant that feeds three seen animals
 * beats one that feeds one), and a plant feeding nothing seen is left out.
 */
export function plantsToAdd(
  roster: Plant[],
  regionId: string,
  planted: ReadonlySet<string>,
  seen: Record<string, number>,
  sunHours: number | null
): AddPick[] {
  const out: AddPick[] = [];
  for (const plant of roster) {
    if (planted.has(plant.id) || !sunFits(plant, sunHours)) continue;
    const ties = wildlifeForPlant(regionId, plant.id)
      .filter(({ wildlife }) => (seen[wildlife.id] ?? 0) > 0)
      .map(({ wildlife, link }) => ({
        id: wildlife.id,
        w: weight(link.support, relianceOf(link)),
        sole: relianceOf(link) === "sole",
      }))
      .sort((a, b) => b.w - a.w || (seen[b.id] ?? 0) - (seen[a.id] ?? 0));
    if (!ties.length) continue;
    out.push({
      plant,
      animals: ties.map((t) => t.id),
      sole: ties.some((t) => t.sole),
      score: ties.reduce((n, t) => n + t.w, 0),
    });
  }
  return out.sort((a, b) => b.score - a.score || a.plant.id.localeCompare(b.plant.id));
}
