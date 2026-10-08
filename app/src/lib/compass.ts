// Which way a nudge went, as one of eight compass points.
//
// "Nudged 75 m" alone doesn't say where the pin went; "nudged 75 m northeast"
// does. Eight points, not sixteen: "north-northeast" is precision nobody
// standing in a garden can use.

export type CompassPoint = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const POINTS: CompassPoint[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

/** The compass point nearest the bearing of an offset (metres north, east). */
export function compassPoint(north: number, east: number): CompassPoint {
  const bearing = (Math.atan2(east, north) * 180) / Math.PI; // 0 = north, 90 = east
  return POINTS[(Math.round(bearing / 45) + 8) % 8];
}
