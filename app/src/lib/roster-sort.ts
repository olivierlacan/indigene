// The order a region's roster can be read in besides by category: most
// caterpillar species first. The host count is the one wildlife figure every
// plant row carries with a cited source and a confidence level, so it is the
// one a list can honestly be ranked by. The named-wildlife ties are not: they
// are a short, hand-picked set of recognizable animals per plant, and ranking
// by how many we wrote down would rank our writing, not the plant.
import type { Plant } from "../types";

/** How a roster is ordered — the `?sort=` value, absent for the default. */
export type RosterSort = "category" | "caterpillars";

/** Read a `?sort=` value; anything unknown is the default. */
export function rosterSort(param: string | null): RosterSort {
  return param === "caterpillars" ? "caterpillars" : "category";
}

/**
 * Most caterpillar species first; a keystone breaks a tie, then the name.
 * A plant not counted yet (`null`) goes last — never treated as 0, which
 * would claim nothing eats it and slot it among the plants that truly host
 * few.
 */
export function byCaterpillars(plants: Plant[], name: (p: Plant) => string, lang: string): Plant[] {
  const count = (p: Plant): number => p.hostLepCount ?? -1;
  return plants.slice().sort((a, b) =>
    count(b) - count(a) ||
    Number(b.keystone) - Number(a.keystone) ||
    name(a).localeCompare(name(b), lang));
}
