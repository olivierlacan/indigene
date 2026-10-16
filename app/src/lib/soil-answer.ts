// The reader's answers about their soil, as a saved spot keeps them.
//
// A saved spot used to store `soilOverride: null` whatever the reader said, so
// reopening it fell back to the soil map's guess: a spot described as wet came
// back ranked as evenly moist. `openSavedSpot()` and `saved-fit.ts` both read
// the moisture back; this is the one place that writes it.
//
// Texture works the same way. Soil maps are coarse (a ~250 m grid), and a
// reader whose hands say clay where the map says sandy loam had no way to say
// so (Show HN, #251). Their answer is one of three feels a person can tell
// apart by rubbing a pinch of damp soil, not the map's twelve classes.
import type { MoistureBand, SavedSpot, SiteData } from "../types";

/** What a pinch of damp soil feels like: gritty, crumbly, or sticky. */
export type SoilFeel = "sand" | "loam" | "clay";
export const SOIL_FEELS: readonly SoilFeel[] = ["sand", "loam", "clay"];

export function isSoilFeel(v: unknown): v is SoilFeel {
  return typeof v === "string" && (SOIL_FEELS as readonly string[]).includes(v);
}

/**
 * The feel a soil map's texture class comes closest to, or null when it sits
 * between them. Same order as `texturePlain`: "sandy clay" is clay to the
 * hand, and silt on its own is neither gritty nor sticky.
 */
export function feelOf(texture: string | null | undefined): SoilFeel | null {
  if (!texture) return null;
  const s = texture.toLowerCase();
  if (s.includes("sand")) return "sand";
  if (s.includes("clay")) return "clay";
  if (s.includes("loam")) return "loam";
  return null;
}

/**
 * The wetness a soil type stands for when nobody has said how wet the spot
 * stays: sand drains fast, clay holds water. It feeds the moisture fit every
 * plant is ranked on, so a soil answer moves the list instead of sitting
 * beside it. A reader's own wetness answer always wins over it.
 */
export function moistureForFeel(feel: SoilFeel): MoistureBand {
  return feel === "sand" ? "dry" : feel === "clay" ? "wet" : "mesic";
}

export function soilAnswer(
  moisture: MoistureBand | null,
  site: SiteData | null,
  feel: SoilFeel | null = null,
): SavedSpot["soilOverride"] {
  if (!moisture) return null;
  // `texture` is required by the stored shape (and the backup reader). The
  // reader's own feel wins; otherwise the map's class is the best we have.
  return { texture: feel ?? (site?.soil.texture || "unknown"), moisture };
}
