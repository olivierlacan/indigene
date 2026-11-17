// "Plant these first": the short list above a spot's plant list.
//
// Doug Tallamy's advice for a new native garden comes in an order: first one
// of each plant group that feeds the most caterpillars (the essential, or
// keystone, plants), then more of whichever does well, then swap out the rest.
// The ranked list alone gets the first step wrong. A region with four willows
// can put them side by side near the top, and a second willow mostly feeds the
// caterpillars the first one already does. A cherry or an alder feeds new ones.
//
// So the picks walk the ranking the reader already chose, and take its best
// plant from each genus, essential plants first. Nothing is re-scored here:
// the order inside each pass is the list's own, so the reader's goals, filters
// and site still decide which willow it is.
import type { Ranked } from "./ranking";
import { genusOf } from "./host-scope";

/** How many picks the card shows. A weekend's shopping, not a second list. */
export const FIRST_PICKS = 4;

/**
 * The first plants to buy, from a ranked list: one per genus, essential plants
 * before the rest, poor fits never. Fewer come back when the list has fewer
 * genera to offer; an empty list gives no picks.
 */
export function firstPicks(ranked: readonly Ranked[], n = FIRST_PICKS): Ranked[] {
  return pickByGenus(ranked, n, new Set(), false);
}

/**
 * For a garden already started: the essential plants it has no relative of
 * yet. A genus counts as here once any of its plants is, whichever species,
 * because a second willow feeds mostly the same caterpillars as the first.
 * Essentials only; an empty answer means every essential genus that suits the
 * spot is already in it.
 */
export function missingEssentials(ranked: readonly Ranked[], plantedLatins: Iterable<string>, n = FIRST_PICKS): Ranked[] {
  return pickByGenus(ranked, n, new Set([...plantedLatins].map(genusOf)), true);
}

function pickByGenus(ranked: readonly Ranked[], n: number, have: ReadonlySet<string>, essentialOnly: boolean): Ranked[] {
  const fits = ranked.filter((r) => r.match !== "poor");
  const genera = new Set<string>(have);
  const picks: Ranked[] = [];
  const take = (pool: readonly Ranked[]): void => {
    for (const r of pool) {
      if (picks.length >= n) return;
      const g = genusOf(r.plant.latin);
      if (genera.has(g)) continue;
      genera.add(g);
      picks.push(r);
    }
  };
  take(fits.filter((r) => r.plant.keystone));
  if (!essentialOnly) take(fits);
  return picks;
}

/** The three answers to "how much room?", as a cap on mature spread in feet.
 *  `null` is no cap. Read against the size filter's own ladder, so a choice
 *  here is that filter set to a rung, and the two never disagree. */
export type Room = "small" | "medium" | "large";
export const ROOMS: readonly Room[] = ["small", "medium", "large"];

/** Target spreads: a small yard fits a shrub or a narrow tree, a medium one a
 *  tree the width of a house front, a large one anything. */
const ROOM_FT: Record<Room, number | null> = { small: 15, medium: 25, large: null };

/** The rung of `ladder` a room sets the spread cap to. */
export function roomCap(room: Room, ladder: readonly { ft: number }[]): number | null {
  const target = ROOM_FT[room];
  if (target == null) return null;
  return ladder.reduce((best, c) =>
    Math.abs(c.ft - target) < Math.abs(best - target) ? c.ft : best, ladder[0].ft);
}

/** Which room a stored spread cap is, if it is one; a cap set by hand to some
 *  other rung is none of them. */
export function roomOf(cap: number | null, ladder: readonly { ft: number }[]): Room | null {
  return ROOMS.find((r) => roomCap(r, ladder) === cap) ?? null;
}
