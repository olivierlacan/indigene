// The plant-first path through the app. The main flow starts from a spot and
// ranks plants for it; this module supports the reverse: start from one plant
// (a showcase pick or a shared link) and ask whether a spot suits it.
//
// The verdict deliberately reuses the same fit math as the ranking
// (`computeFit`) and the same hard gates (region coverage, winter hardiness),
// so a plant never gets a rosier answer on its own page than it would get in
// the ranked list for the same spot.
import type { MoistureBand, Plant, SiteData, SunEstimate } from "../types";
import type { RegionDef } from "../data/region";
import { REGIONS, loadPlants, regionForSite } from "./plants";
import { computeFit, siteMoisture } from "./ranking";
import { zoneFromMinTemp } from "./site";

export interface PlantEntry {
  plant: Plant;
  region: RegionDef;
}

/**
 * The region's showcase plant. Every region declares an editorial pick; the
 * fallback (highest host-count keystone, then highest host-count overall)
 * only exists so a future region without a pick still shows something honest.
 */
export function featuredPlant(region: RegionDef): Plant {
  const plants = loadPlants(region);
  const picked = plants.find((p) => p.id === region.meta.featuredPlantId);
  if (picked) return picked;
  const byHost = [...plants].sort((a, b) => b.hostLepCount - a.hostLepCount);
  return byHost.find((p) => p.keystone) ?? byHost[0];
}

/**
 * All regions that carry this plant id. A species can be native to more than
 * one covered region (live oak spans both Florida lists), and its row differs
 * per region — native notes and sizes are tuned locally — so the caller picks
 * which entry to show (usually the one matching the reader's location).
 */
export function findPlant(slug: string): PlantEntry[] {
  const out: PlantEntry[] = [];
  for (const region of REGIONS) {
    const plant = loadPlants(region).find((p) => p.id === slug);
    if (plant) out.push({ plant, region });
  }
  return out;
}

/**
 * The canonical share URL for a plant: a real path, not a hash, so it reads
 * as a stable link ("…/plants/quercus-alba"). GitHub Pages serves 404.html
 * for it, which bounces into the hash route (see main.ts).
 */
export function plantShareUrl(slug: string): string {
  return `${location.origin}${import.meta.env.BASE_URL}plants/${encodeURIComponent(slug)}`;
}

/** The three-level answer to "can I plant this here?". */
export type SuitabilityLevel = "ideal" | "decent" | "unsuitable";

export interface Suitability {
  level: SuitabilityLevel;
  headline: string;
  reasons: string[];
  /** The regional entry the verdict was computed against, when native here. */
  entry: PlantEntry | null;
  fit: number | null; // 0-1 site fit, null when the plant isn't native here
}

/**
 * Judge a spot for one plant. Order of the gates matters and mirrors the
 * ranked flow: native coverage first (we never call a spot "ideal" for a
 * plant we can't honestly say belongs there), winter hardiness second (a
 * freeze kill is not a gradient), then the graded site fit.
 */
export function assessSpot(
  entries: PlantEntry[],
  site: SiteData | null,
  lat: number,
  lon: number,
  sun: SunEstimate | null,
  moistureOverride?: MoistureBand | null
): Suitability {
  const spotRegion = regionForSite(lat, lon, site);
  const entry = spotRegion
    ? entries.find((e) => e.region.meta.id === spotRegion.meta.id) ?? null
    : null;

  if (!entry) {
    const where = entries.map((e) => e.region.meta.name).join(" and ");
    return {
      level: "unsuitable",
      headline: "Not known native at this spot",
      reasons: [
        spotRegion
          ? `This plant isn't in the ${spotRegion.meta.name} list — our data says it's native to ${where}.`
          : `This spot is outside the regions Indigene covers so far (this plant's data is for ${where}), so we can't honestly vouch for it here.`,
        "Planting it anyway wouldn't feed local wildlife the way a true local native would — that's the whole point of choosing natives.",
      ],
      entry: null,
      fit: null,
    };
  }

  const plant = entry.plant;
  const reasons: string[] = [];

  // Winter hardiness is a hard gate, same as in rankPlants.
  const zone = site?.zone ?? (site?.zoneMinTempF != null ? zoneFromMinTemp(site.zoneMinTempF) : null);
  const zoneNum = zone ? parseInt(zone, 10) : null;
  if (zoneNum != null && Number.isFinite(zoneNum)) {
    if (zoneNum < plant.zones.min) {
      return {
        level: "unsuitable",
        headline: "Winters here are too cold for it",
        reasons: [
          `This spot is USDA zone ${zone}, and ${plant.common} is only hardy down to zone ${plant.zones.min}. A normal winter would kill it.`,
        ],
        entry,
        fit: null,
      };
    }
    if (zoneNum > plant.zones.max) {
      return {
        level: "unsuitable",
        headline: "Winters here aren't cold enough for it",
        reasons: [
          `This spot is USDA zone ${zone}, warmer than ${plant.common} can handle (it needs zone ${plant.zones.max} or colder to get the winter rest it expects).`,
        ],
        entry,
        fit: null,
      };
    }
    reasons.push(`Hardy through this spot's winters (zone ${zone}).`);
  } else {
    reasons.push("Couldn't confirm the winter-cold zone here — the rest of the verdict assumes it's fine.");
  }

  const moisture = siteMoisture(site, moistureOverride);
  const { fit, reasons: fitReasons } = computeFit(plant, site, sun, moisture);
  reasons.push(...fitReasons);

  // Same thresholds as the ranked list's good/ok/poor bands.
  let level: SuitabilityLevel = fit >= 0.8 ? "ideal" : fit >= 0.55 ? "decent" : "unsuitable";
  // Sun is half the fit and we know nothing about it — "ideal" would be a
  // promise we can't back. Cap at decent and say what would firm it up.
  if (!sun && level === "ideal") {
    level = "decent";
    reasons.push("We don't know this spot's sun yet — pick a sun level above and this can become a full verdict.");
  } else if (!sun) {
    reasons.push("No sun reading for this spot yet — tell us the sun above and the verdict sharpens.");
  }
  const headline =
    level === "ideal"
      ? "Ideal planting spot"
      : level === "decent"
        ? "Decent spot — it'll grow, with caveats"
        : "This spot would fight it the whole way";
  return { level, headline, reasons, entry, fit };
}
