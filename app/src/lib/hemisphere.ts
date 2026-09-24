// Which half of the world a place is in — the one fact that flips the calendar.
//
// Every region Indigene shipped first was north of the equator, so "spring" was
// March to May and the growing season was April to October without anybody
// having to say so. South of the equator both are six months out. Anything
// that turns a month into a season, or samples "the growing season", asks here
// first rather than assuming.
//
// Deliberately nothing but latitude: no i18n, no DOM, so the prerenderer and the
// sun-hours maths can both import it.
import type { RegionMeta } from "../data/region";

export type Hemisphere = "north" | "south";

/** The equator itself counts as north — it has to go somewhere, and no region
 *  we could draw straddles it. */
export function hemisphereOf(lat: number): Hemisphere {
  return lat < 0 ? "south" : "north";
}

/** A region's hemisphere, read off the middle of its coverage box. */
export function regionHemisphere(meta: RegionMeta): Hemisphere {
  return hemisphereOf((meta.bounds.minLat + meta.bounds.maxLat) / 2);
}

/** The same point in the year on the other side of the equator: a month index
 *  (0-11, as `Date` counts them) moved six months on. */
export function mirrorMonth(month: number): number {
  return (month + 6) % 12;
}
