// What a planting log adds up to: the ecosystem benefits the plants in one spot
// are documented to give, and the animals they're documented to feed.
//
// Every number here is already in the app — each plant carries seven eco scores
// (`Plant.scores`, sourced in its `basis`) and the plant→animal ties live in
// `data/wildlife.ts`. This module does one thing to them: reads them for the
// plants somebody actually put in the ground, so a garden has a shape rather
// than a list.
//
// **What this is not.** It is not a measurement of a garden. A score is what
// that plant does where it was measured, not what your plant is doing in your
// soil in its second dry summer — and a documented tie says the animal *can*
// use the plant, not that it has found yours. The page says so in as many
// words; this file's job is to make sure the arithmetic under that sentence is
// as modest as the sentence is.
//
// Two rules keep it modest:
//
// **Average, never total.** The scores are 0–100 comparisons between plants,
// not amounts of anything. Adding them would make a hedge of twenty ordinary
// shrubs beat three oaks, which is not what the numbers mean. So each benefit
// is the mean across the plants in the ground — six milkweeds counting six,
// because six of them really are six plants' worth of nectar.
//
// **An animal counts once.** A garden with three oaks and a cherry doesn't feed
// four times the wildlife; it feeds the union of what they feed. Ties fold by
// animal, keeping the strongest one (see `bestTies`).
import type { Plant, Planting } from "../types";
import type { ScoreKey } from "./plain";
import { SCORE_KEYS } from "./plain";
import { entryForPlant } from "./registry";
import { bestTies, type TieScope, type TieSummary } from "./wildlife";

/**
 * Whose ties belong to a plant logged at a spot in `spotRegionId` — the spot's
 * own region when that region's list carries the plant, every region that
 * carries it otherwise (a plant logged from a list the reader browsed to, or a
 * spot with no covered region of its own).
 *
 * Read from the registry, which already lists every taxon's regions, so this
 * costs no download: the saved-spots list can count a garden's wildlife without
 * fetching a single plant list, and it counts it by exactly the same rule the
 * spot's own page does.
 */
export function tieRegions(plantId: string, spotRegionId: string | null): string[] {
  const regions = entryForPlant(plantId)?.regions ?? [];
  if (spotRegionId && regions.includes(spotRegionId)) return [spotRegionId];
  return regions;
}

function scopesFor(plantIds: Iterable<string>, spotRegionId: string | null): TieScope[] {
  const scopes: TieScope[] = [];
  for (const plantId of plantIds) {
    for (const regionId of tieRegions(plantId, spotRegionId)) scopes.push({ regionId, plantId });
  }
  return scopes;
}

/** How many named animals a log's plants support — the figure a saved-spot row
 *  shows, and the same one that spot's page shows in its tiles. */
export function spotWildlifeCount(plantIds: Iterable<string>, spotRegionId: string | null): number {
  return bestTies(scopesFor(new Set(plantIds), spotRegionId)).length;
}

export interface SpotValue {
  /** Individual plants the averages are over — the honest denominator. */
  plants: number;
  /** Distinct catalog entries behind them. */
  kinds: number;
  /** Mean of each benefit across those plants, 0–100, in `SCORE_KEYS` order. */
  services: { key: ScoreKey; value: number }[];
  /** Animals the logged plants support, make-or-break ties first. */
  wildlife: TieSummary[];
  /** Kinds that raise caterpillars — the food-web measure the app ranks on. */
  hostKinds: number;
}

/**
 * The picture, from a spot's log. Plantings whose plant we can't resolve are
 * skipped rather than counted as zero: an unknown plant is a gap in what we
 * know, not a plant that does nothing.
 */
export function spotValue(
  plantings: Planting[],
  plantOf: (plantId: string) => Plant | undefined,
  spotRegionId: string | null
): SpotValue | null {
  const rows = plantings
    .map((p) => ({ count: Math.max(1, p.count), plant: plantOf(p.plantId) }))
    .filter((r): r is { count: number; plant: Plant } => Boolean(r.plant));
  if (!rows.length) return null;

  const total = rows.reduce((n, r) => n + r.count, 0);
  const services = SCORE_KEYS.map((key) => ({
    key,
    value: Math.round(rows.reduce((sum, r) => sum + r.plant.scores[key] * r.count, 0) / total),
  }));

  // Deduped by plant id, because the log holds one row per planting: a second
  // batch of the same shrub is more plants, not another kind, and its ties are
  // the same ties.
  const kinds = new Map<string, Plant>();
  for (const r of rows) kinds.set(r.plant.id, r.plant);

  return {
    plants: total,
    kinds: kinds.size,
    services,
    wildlife: bestTies(scopesFor(kinds.keys(), spotRegionId)),
    hostKinds: [...kinds.values()].filter((p) => p.hostLepCount > 0).length,
  };
}
