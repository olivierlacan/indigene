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
import { fmtList, fmtNumber, t } from "./i18n";
import { commonName, regionName } from "./names";
import { temperature } from "./units";

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
    const where = fmtList(entries.map((e) => regionName(e.region.meta)));
    return {
      level: "unsuitable",
      headline: t("verdict.notNative"),
      reasons: [
        spotRegion
          ? t("verdict.notNativeHere", { region: regionName(spotRegion.meta), where })
          : t("verdict.notCovered", { where }),
        t("verdict.notNativeWhy"),
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
  // Common parlance first — "how cold winters get" — with the zone label in
  // parentheses as the term plant tags use, never leading.
  // The temperature itself goes through `units.ts`, so a reader who measures in
  // Celsius is told about their winter in Celsius — the zone label stays USDA
  // either way, because that's the scale the number is defined on.
  const winterCold =
    site?.zoneMinTempF != null
      ? t("verdict.winterNights", { temp: temperature(site.zoneMinTempF), zone: zone ?? "" })
      : t("verdict.winterCold", { zone: zone ?? "" });
  if (zoneNum != null && Number.isFinite(zoneNum)) {
    if (zoneNum < plant.zones.min) {
      return {
        level: "unsuitable",
        headline: t("verdict.tooCold"),
        reasons: [
          t("verdict.tooColdWhy", {
            name: commonName(plant),
            winter: winterCold,
            zone: fmtNumber(plant.zones.min),
          }),
        ],
        entry,
        fit: null,
      };
    }
    if (zoneNum > plant.zones.max) {
      return {
        level: "unsuitable",
        headline: t("verdict.tooWarm"),
        reasons: [
          t("verdict.tooWarmWhy", {
            name: commonName(plant),
            winter: winterCold,
            zone: fmtNumber(plant.zones.max),
          }),
        ],
        entry,
        fit: null,
      };
    }
    reasons.push(t("verdict.hardyEnough", { winter: winterCold }));
  } else {
    reasons.push(t("verdict.winterUnknown"));
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
    reasons.push(t("verdict.sunMissingCapped"));
  } else if (!sun) {
    reasons.push(t("verdict.sunMissing"));
  }
  const headline = t(`verdict.${level}` as const);
  return { level, headline, reasons, entry, fit };
}
