// What a planting log adds up to: the animals the plants in one spot are
// documented to feed.
//
// The ties already exist, in `data/wildlife.ts` — plant → animal, one cited
// source each. This module does one thing to them: reads them for the plants
// somebody actually put in the ground, so a garden has a shape rather than a
// list.
//
// **Why there is no score here.** Each plant also carries seven eco-values, and
// the obvious move is to average them across a log and draw seven bars. We
// don't. Those values are estimates on a 0–100 comparison scale, not amounts of
// anything, and averaging estimates produces a confident-looking figure with
// nothing underneath it — "77 for pollinators" reads as a measurement of *this
// garden*, which is not something anyone has. A tie is different in kind: it is
// a specific documented claim about a specific plant and a specific animal, and
// it survives being counted.
//
// Two rules keep even the counting modest:
//
// **An animal counts once.** A garden with three oaks and a cherry doesn't feed
// four times the wildlife; it feeds the union of what they feed. Ties fold by
// animal, keeping the strongest one (see `bestTies`).
//
// **Can, not does.** A tie says the animal is able to use the plant. Whether it
// has found this particular garden is not ours to claim, and the page says so.
import type { Plant, Planting } from "../types";
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

/** How many named animals a log's plants can feed — the figure a saved-spot row
 *  shows, and the same one that spot's page shows in its tiles. */
export function spotWildlifeCount(plantIds: Iterable<string>, spotRegionId: string | null): number {
  return bestTies(scopesFor(new Set(plantIds), spotRegionId)).length;
}

export interface SpotValue {
  /** Animals the logged plants can feed, make-or-break ties first. */
  wildlife: TieSummary[];
  /** Kinds that raise caterpillars — the food-web measure the app ranks on. */
  hostKinds: number;
}

/**
 * The picture, from a spot's log. Plantings whose plant we can't resolve are
 * skipped: an unknown plant is a gap in what we know, not a plant that feeds
 * nothing.
 */
export function spotValue(
  plantings: Planting[],
  plantOf: (plantId: string) => Plant | undefined,
  spotRegionId: string | null
): SpotValue | null {
  // Deduped by plant id, because the log holds one row per planting: a second
  // batch of the same shrub is more plants, not another kind, and its ties are
  // the same ties.
  const kinds = new Map<string, Plant>();
  for (const p of plantings) {
    const plant = plantOf(p.plantId);
    if (plant) kinds.set(plant.id, plant);
  }
  if (!kinds.size) return null;
  return {
    wildlife: bestTies(scopesFor(kinds.keys(), spotRegionId)),
    hostKinds: [...kinds.values()].filter((p) => p.hostLepCount > 0).length,
  };
}
