// The ranking is the heart of the app and must never be a black box. A plant's
// position comes from two transparent parts:
//   1. Eco value — a weighted blend of the component scores, using weights the
//      user controls ("I mostly care about butterflies").
//   2. Site fit  — how well the plant's needs match THIS spot's sun, moisture,
//      pH and hardiness. A great plant in the wrong place ranks low, and we say
//      so plainly rather than hiding it.
import type {
  MoistureBand,
  Plant,
  SiteData,
  SunEstimate,
  Weights,
} from "../types";
import { zoneFromMinTemp } from "./site";
import { moistureWord } from "./plain";

export const DEFAULT_WEIGHTS: Weights = {
  host: 5, // caterpillar/moth host value is the strongest food-web proxy
  pollinator: 4,
  bird: 3,
  stormwater: 2,
  erosion: 2,
  carbon: 1,
  establishment: 3,
};

export interface ActiveFilters {
  requireDeerResistant: boolean;
  excludeThorny: boolean;
  excludePetToxic: boolean;
  excludeAggressive: boolean;
  requireNoWater: boolean; // guerrilla mode: survives with zero aftercare
  /** Mature-size ceilings in feet; null means no limit. Judged against the
   *  plant's honest eventual size, not a young nursery specimen. */
  maxHeightFt: number | null;
  maxSpreadFt: number | null;
}

export const NO_FILTERS: ActiveFilters = {
  requireDeerResistant: false,
  excludeThorny: false,
  excludePetToxic: false,
  excludeAggressive: false,
  requireNoWater: false,
  maxHeightFt: null,
  maxSpreadFt: null,
};

export interface Ranked {
  plant: Plant;
  ecoScore: number; // 0-100 weighted eco value
  fit: number; // 0-1 site fit
  score: number; // final ranking score
  match: "good" | "ok" | "poor";
  reasons: string[]; // plain-language why it fits or doesn't
}

export function ecoScore(plant: Plant, weights: Weights): number {
  const s = plant.scores;
  const parts: [number, number][] = [
    [s.host, weights.host],
    [s.pollinator, weights.pollinator],
    [s.bird, weights.bird],
    [s.stormwater, weights.stormwater],
    [s.erosion, weights.erosion],
    [s.carbon, weights.carbon],
    [s.establishment, weights.establishment],
  ];
  const wsum = parts.reduce((a, [, w]) => a + w, 0) || 1;
  const total = parts.reduce((a, [v, w]) => a + v * w, 0);
  return Math.round(total / wsum);
}

/** Which moisture band this spot most likely is, from soil + any user override. */
export function siteMoisture(
  site: SiteData | null,
  override?: MoistureBand | null
): MoistureBand {
  if (override) return override;
  const drainage = site?.soil.drainage ?? "";
  if (/fast|well/.test(drainage)) return "dry";
  if (/slow|wet/.test(drainage)) return "wet";
  return "mesic";
}

function siteZoneNumber(site: SiteData | null): number | null {
  if (!site) return null;
  const zone = site.zone ?? (site.zoneMinTempF != null ? zoneFromMinTemp(site.zoneMinTempF) : null);
  if (!zone) return null;
  const n = parseInt(zone, 10);
  return Number.isFinite(n) ? n : null;
}

export function computeFit(
  plant: Plant,
  site: SiteData | null,
  sun: SunEstimate | null,
  moisture: MoistureBand
): { fit: number; reasons: string[] } {
  const reasons: string[] = [];

  // Sun.
  let sunFit = 1;
  if (sun) {
    const h = sun.hours;
    if (h < plant.sun.minHours) {
      sunFit = clamp01(1 - (plant.sun.minHours - h) / 4);
      reasons.push(
        `Wants more sun than this spot gets (needs ~${plant.sun.minHours}+ hours, spot gets ~${h}).`
      );
    } else if (h > plant.sun.maxHours) {
      sunFit = clamp01(1 - (h - plant.sun.maxHours) / 5);
      reasons.push(
        `Prefers more shade than this spot offers — may scorch in full sun.`
      );
    } else {
      reasons.push(`Sun is a good match (${sunLabelShort(h)}).`);
    }
  }

  // Moisture.
  const order: MoistureBand[] = ["dry", "mesic", "wet"];
  const mi = order.indexOf(moisture);
  const accepts = plant.moisture.map((b) => order.indexOf(b));
  const dist = Math.min(...accepts.map((a) => Math.abs(a - mi)));
  let moistFit = dist === 0 ? 1 : dist === 1 ? 0.6 : 0.3;
  if (dist === 0) reasons.push(`Handles the moisture here (${moistureWord(moisture)} soil).`);
  else reasons.push(`Moisture is ${dist === 1 ? "a bit" : "quite"} off — this spot's soil is ${moistureWord(moisture)}, and it prefers ${plant.moisture.map(moistureWord).join(" or ")}.`);

  // pH.
  let phFit = 1;
  const ph = site?.soil.phEstimate ?? null;
  if (ph != null) {
    if (ph >= plant.ph.min && ph <= plant.ph.max) phFit = 1;
    else if (ph >= plant.ph.min - 0.5 && ph <= plant.ph.max + 0.5) phFit = 0.8;
    else {
      phFit = 0.55;
      reasons.push(`Soil acidity is outside its comfort zone (map estimate).`);
    }
  }

  const fit = clamp01(sunFit * 0.5 + moistFit * 0.35 + phFit * 0.15);
  return { fit, reasons };
}

export function rankPlants(
  plants: Plant[],
  ctx: {
    site: SiteData | null;
    sun: SunEstimate | null;
    weights: Weights;
    filters: ActiveFilters;
    moistureOverride?: MoistureBand | null;
  }
): Ranked[] {
  const moisture = siteMoisture(ctx.site, ctx.moistureOverride);
  const zoneNum = siteZoneNumber(ctx.site);

  const out: Ranked[] = [];
  for (const plant of plants) {
    // Hard filters — reasons the plant should not even appear.
    if (zoneNum != null && (zoneNum < plant.zones.min || zoneNum > plant.zones.max)) {
      continue; // not winter-hardy (or needs more cold) here
    }
    if (ctx.filters.requireDeerResistant && !plant.filters.deerResistant) continue;
    if (ctx.filters.excludeThorny && plant.filters.thorny) continue;
    if (ctx.filters.excludePetToxic && plant.filters.petToxic) continue;
    if (ctx.filters.excludeAggressive && plant.filters.aggressive) continue;
    if (ctx.filters.requireNoWater && !plant.noWaterEstablish) continue;
    if (ctx.filters.maxHeightFt != null && plant.matureHeightFt > ctx.filters.maxHeightFt) continue;
    if (ctx.filters.maxSpreadFt != null && plant.matureSpreadFt > ctx.filters.maxSpreadFt) continue;

    const eco = ecoScore(plant, ctx.weights);
    const { fit, reasons } = computeFit(plant, ctx.site, ctx.sun, moisture);
    const score = eco * (0.35 + 0.65 * fit); // fit strongly modulates, never zeroes
    const match: Ranked["match"] = fit >= 0.8 ? "good" : fit >= 0.55 ? "ok" : "poor";
    out.push({ plant, ecoScore: eco, fit, score, match, reasons });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
function sunLabelShort(h: number): string {
  if (h >= 6) return "full sun";
  if (h >= 4) return "part sun";
  if (h >= 2) return "part shade";
  return "shade";
}
