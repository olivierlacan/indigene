// Is this spot on someone else's land? The check that keeps a region's plants
// on its own side of a border.
//
// A region is matched by its coverage box and its ecoregion code, and neither
// knows where one country ends. Atlantic France's box reaches 51.2°N, for
// Dunkirk; Brighton is at 50.8°N, and the EEA calls southern England
// "Atlantic" too. So Brighton was offered French plants.
//
// The answer is the outlines themselves (`data/region-borders.ts`, written by
// `scripts/build-region-borders.mjs` with the same rule the region maps are
// trimmed by, from finer outlines): a spot on the region's own land is the region's; a spot on
// another country's is not; and a spot on neither — a pin on Brighton beach,
// in the gap between Natural Earth's coastline and the real one — goes to the
// nearer coast. All offline, with nothing asked of anyone: a dropped pin has
// coordinates and no country, and looking one up would mean sending every pin
// to a geocoder.
import { REGION_BORDERS } from "../data/region-borders";

/** Degrees around foreign land within which a spot is checked at all. Must
 *  match NEAR in scripts/build-region-borders.mjs, which keeps only that much
 *  of the region's own land. */
const NEAR = 0.15;

/** A ring as flat [lon, lat, lon, lat, …] — half the brackets of pairs. */
type Ring = number[];

/** Even–odd: inside an odd number of rings is inside. */
function inside(lon: number, lat: number, rings: Ring[]): boolean {
  let hit = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
      const xi = ring[i], yi = ring[i + 1];
      const xj = ring[j], yj = ring[j + 1];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
}

/** Distance to the nearest edge, in degrees of latitude (longitude scaled by
 *  cos(lat), so a degree east is as long as it really is). */
function distance(lon: number, lat: number, rings: Ring[]): number {
  const k = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
      const ax = (ring[j] - lon) * k;
      const ay = ring[j + 1] - lat;
      const bx = (ring[i] - lon) * k;
      const by = ring[i + 1] - lat;
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
      best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
    }
  }
  return best;
}

/** True when this spot is another country's, as far as this region is
 *  concerned — so the region's plants are not for it. */
export function onForeignLand(regionId: string, lat: number, lon: number): boolean {
  const borders = REGION_BORDERS[regionId];
  if (!borders) return false;
  // Inside first: Brussels is deep in Belgium, far from any edge of it.
  if (inside(lon, lat, borders.foreign)) return true;
  const toForeign = distance(lon, lat, borders.foreign);
  if (toForeign > NEAR) return false;
  if (inside(lon, lat, borders.own)) return false;
  // On neither outline: the sea, or the gap where Natural Earth's coast and
  // the real one disagree. The nearer coast has it.
  return toForeign < distance(lon, lat, borders.own);
}
