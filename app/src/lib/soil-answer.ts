// The reader's answer to "How wet does this spot stay?", as a saved spot keeps it.
//
// A saved spot used to store `soilOverride: null` whatever the reader said, so
// reopening it fell back to the soil map's guess: a spot described as wet came
// back ranked as evenly moist. `openSavedSpot()` and `saved-fit.ts` both read
// the moisture back; this is the one place that writes it.
import type { MoistureBand, SavedSpot, SiteData } from "../types";

export function soilAnswer(
  moisture: MoistureBand | null,
  site: SiteData | null,
): SavedSpot["soilOverride"] {
  if (!moisture) return null;
  // `texture` is required by the stored shape (and the backup reader); the map's
  // texture is the best we have, since the reader was only asked about wetness.
  return { texture: site?.soil.texture || "unknown", moisture };
}
