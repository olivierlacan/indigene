// "You've already got somewhere this would go."
//
// Reading about a plant is the moment a reader is deciding whether they want
// it, and someone with saved spots has already told the app everything needed
// to answer — where the ground is, how sunny it gets, how wet it stays. The
// plant page used to ask for all of that again, from scratch, every time.
//
// So: check the plant against the spots this device already knows about, and
// say so when one of them suits. Nothing is asked and nothing is sent; it's the
// same arithmetic the ranked list does, run over spots that are already here.
//
// ## What it will and won't say
//
// Only the spots the plant *suits* are named. A plant that's wrong for every
// saved spot produces nothing at all — not a row of red crosses — because this
// is a nudge on a page someone is browsing, and a page that volunteers bad news
// about four gardens is a page people stop reading. The full, honest, negative
// answer is still one tap away in the same section: "Check your spot" gives a
// verdict for any spot, including a saved one that isn't listed here.
//
// The verdict comes from `assessSpot`, which is the same function the manual
// checker calls and reuses the ranked list's own gates and thresholds. That's
// deliberate: a plant can never look better here than it would in the results
// list for that same spot.
import { listSpots } from "../db";
import type { SavedSpot } from "../types";
import { assessSpot } from "./explore";
import type { PlantEntry, Suitability } from "./explore";

export interface SavedSpotFit {
  spot: SavedSpot;
  verdict: Suitability;
}

/**
 * The saved spots this plant suits, best first.
 *
 * Never rejects: a database that's slow, blocked or empty means the plant page
 * simply doesn't mention saved spots, which is what it did before this existed.
 */
export async function savedSpotsThatSuit(entries: PlantEntry[]): Promise<SavedSpotFit[]> {
  const spots = await listSpots().catch(() => [] as SavedSpot[]);
  const out: SavedSpotFit[] = [];
  for (const spot of spots) {
    const verdict = assessSpot(
      entries,
      spot.site,
      spot.lat,
      spot.lon,
      spot.sun,
      // A saved spot carries its own soil answer, given for that ground; the
      // ranked list honours it and so must this, or the two disagree about a
      // spot the reader described once.
      spot.soilOverride?.moisture ?? null,
      spot.regionOverride ?? null
    );
    if (verdict.level !== "unsuitable") out.push({ spot, verdict });
  }
  // "Ideal" ahead of "decent", then by fit within each — the strongest answer
  // is the one worth reading first, and `fit` is only null on the paths that
  // returned unsuitable, which are already gone.
  return out.sort(
    (a, b) =>
      Number(b.verdict.level === "ideal") - Number(a.verdict.level === "ideal") ||
      (b.verdict.fit ?? 0) - (a.verdict.fit ?? 0)
  );
}
