// Reading the pavement-pioneer table — `data/pioneers.ts`, and the one place
// that decides what order a region's pioneers come out in.
//
// Ordering is here rather than in the data file on purpose. The data file is a
// set of claims a non-programmer can audit row by row; the *ranking* is a
// judgement the app makes, and it should be one rule applied everywhere rather
// than an editorial order that drifts between eleven regions.
//
// The rule: **the most kinds of abuse first.** A plant documented to take
// compaction, rubble, salt and heat is the one to reach for when you don't yet
// know which of those the bad patch actually is, so it belongs at the top. Ties
// break on the name the reader sees, in their own collation — so the order is
// stable, explainable, and never depends on which region you came from.
import type { PioneerEntry, PioneerPressure, Plant } from "../types";
import { PIONEERS, PRESSURE_ORDER } from "../data/pioneers";
import { commonName } from "./names";
import { getLang } from "./i18n";

/** One region's pioneer row for one plant, or undefined if it isn't one here. */
export function pioneerFor(regionId: string, plantId: string): PioneerEntry | undefined {
  return PIONEERS[regionId]?.[plantId];
}

/** Is this plant on this region's pioneer list? */
export function isPioneer(regionId: string, plantId: string): boolean {
  return pioneerFor(regionId, plantId) !== undefined;
}

/**
 * How many pioneers a region has, without loading its plant list.
 *
 * The region cards and the roster's stat tiles ask this about regions the
 * reader isn't in, and a count that cost a plant-list download would undo the
 * whole reason those lists are split per region (see `data/regions.ts`).
 */
export function pioneerCountForRegion(regionId: string): number {
  return Object.keys(PIONEERS[regionId] ?? {}).length;
}

/** A plant paired with its pioneer row. */
export interface PioneerPick {
  plant: Plant;
  entry: PioneerEntry;
}

/**
 * This region's pioneers out of a loaded roster, toughest first.
 *
 * Driven by the roster rather than by the table's own keys, so a row naming a
 * plant the region no longer carries simply doesn't appear — the page can't
 * show a heading over a plant it has no card for.
 */
export function pioneersForRegion(regionId: string, plants: Plant[]): PioneerPick[] {
  const picks: PioneerPick[] = [];
  for (const plant of plants) {
    const entry = pioneerFor(regionId, plant.id);
    if (entry) picks.push({ plant, entry });
  }
  const lang = getLang();
  return picks.sort(
    (a, b) =>
      b.entry.pressures.length - a.entry.pressures.length ||
      commonName(a.plant).localeCompare(commonName(b.plant), lang)
  );
}

/**
 * A row's pressures in the table's own display order, so two plants that take
 * the same four things list them the same way. The data file orders each row by
 * what's most telling about *that* plant, which is the right thing for an
 * auditor reading one line and the wrong thing for a reader scanning a column.
 */
export function orderedPressures(entry: PioneerEntry): PioneerPressure[] {
  const have = new Set(entry.pressures);
  return PRESSURE_ORDER.filter((p) => have.has(p));
}

/** Every pressure any of these picks takes, in display order — the legend for
 *  a page that shows a set of them together. */
export function pressuresPresent(picks: PioneerPick[]): PioneerPressure[] {
  const have = new Set<PioneerPressure>();
  for (const { entry } of picks) for (const p of entry.pressures) have.add(p);
  return PRESSURE_ORDER.filter((p) => have.has(p));
}
