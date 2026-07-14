// Shared domain types. Kept in one place so the data schema and the code that
// consumes it can't drift apart.

export type PlantForm =
  | "tree"
  | "shrub"
  | "perennial"
  | "grass"
  | "vine"
  | "groundcover"
  | "fern";

export interface SizeSnapshot {
  /** Years since planting. */
  year: number;
  /** Height in feet at that age. */
  heightFt: number;
  /** Widest spread/footprint in feet at that age. */
  spreadFt: number;
}

export interface EcoScores {
  /** Normalized 0-100 for ranking. */
  host: number;
  pollinator: number;
  bird: number;
  stormwater: number;
  erosion: number;
  carbon: number;
  establishment: number;
}

export interface Plant {
  id: string;
  common: string;
  latin: string;
  family: string;
  form: PlantForm;

  /** County/ecoregion-level native note — "native *here*", not to a continent. */
  nativeNote: string;

  /** Growing conditions this plant tolerates. */
  sun: { minHours: number; maxHours: number }; // direct sun hours/day it accepts
  moisture: MoistureBand[]; // which of dry..wet it will take
  ph: { min: number; max: number };
  zones: { min: number; max: number }; // USDA hardiness (whole numbers)

  size: SizeSnapshot[]; // ordered by year: 1, 3, 5, 10
  matureHeightFt: number; // honest eventual ceiling
  matureSpreadFt: number;

  scores: EcoScores;
  /** Raw Lepidoptera host-species count behind the host score (for honesty). */
  hostLepCount: number;
  keystone: boolean;

  bloom: { startMonth: number; endMonth: number; color: string } | null;

  filters: {
    deerResistant: boolean;
    thorny: boolean;
    allergenic: boolean;
    petToxic: boolean;
    aggressive: boolean;
  };

  /** Will it establish and persist with zero supplemental water after planting? */
  noWaterEstablish: boolean;
  careNote: string; // "what it needs from you"
  givesNote: string; // "what it does for you"

  confidence: "high" | "medium" | "low";
  basis: string; // where the numbers come from

  photoUrl?: string; // optional; card degrades to a drawn silhouette offline
}

export type MoistureBand = "dry" | "mesic" | "wet";

export interface HorizonMask {
  /** 72 samples, one per 5° of compass bearing, each an elevation angle (deg). */
  angles: number[];
  /** How the mask was produced. */
  source: "scan" | "manual" | "none";
}

export interface SunEstimate {
  /** Average direct-sun hours/day across the growing season. */
  hours: number;
  /** Honest error band. */
  low: number;
  high: number;
  /** Plain-language bucket, e.g. "part shade". */
  label: string;
  /** Whether deciduous leaf-off was accounted for. */
  deciduousAdjusted: boolean;
  source: "scan" | "manual" | "override";
}

/**
 * A real EPA (Omernik) ecoregion, from the live lookup. Public-domain data.
 * Level III is the useful resolution for plant regions; Level IV is the finer
 * local subdivision, shown as detail. Level I/II are the broad North American
 * roll-ups, kept for future use (e.g. region selection).
 */
export interface EcoregionInfo {
  l1Name: string | null; // North America Level I, e.g. "Marine West Coast Forest"
  l2Name: string | null; // North America Level II
  l3Code: string; // US Level III code, e.g. "3"
  l3Name: string; // US Level III name, e.g. "Willamette Valley"
  l4Code: string | null; // US Level IV code, e.g. "3a"
  l4Name: string | null; // US Level IV name
}

export interface SiteData {
  lat: number;
  lon: number;
  elevationFt: number | null;
  slopeDeg: number | null;
  zone: string | null; // e.g. "7a"
  zoneMinTempF: number | null;
  annualRainIn: number | null;
  soil: {
    texture: string | null; // e.g. "silt loam"
    drainage: string | null;
    phEstimate: number | null;
    source: string; // which dataset answered
    confidence: "mapped" | "coarse" | "unknown";
  };
  /** Plain display label for the region (real EPA name, or a coarse box guess). */
  ecoregion: string | null;
  /** Structured EPA ecoregion when the live lookup succeeded; null on fallback. */
  ecoregionInfo?: EcoregionInfo | null;
  /** True when values came from cache/offline fallback rather than live fetch. */
  fromCache: boolean;
}

export interface Weights {
  host: number;
  pollinator: number;
  bird: number;
  stormwater: number;
  erosion: number;
  carbon: number;
  establishment: number;
}

export interface SavedSpot {
  id: string;
  createdAt: number;
  label: string;
  lat: number;
  lon: number;
  site: SiteData | null;
  sun: SunEstimate | null;
  horizon: HorizonMask | null;
  soilOverride?: { texture: string; moisture: MoistureBand } | null;
  deciduousOverhead?: boolean;
  weights: Weights;
}
