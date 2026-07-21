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

/**
 * How to make more of a plant you already have — from seed you save, or from
 * the living plant itself. A small controlled vocabulary so every method is
 * explained in exactly one place (`plain.ts`) and can't be described two
 * different ways across 100+ rows. Each key is glossed in plain words wherever
 * it's shown; the rule is the same as everywhere else in the app — never a
 * gardening term without the plain-language "what you actually do" beside it.
 */
export type PropagationMethod =
  // ---- from seed ----
  | "seed-direct" // sow the cleaned seed with no special treatment
  | "seed-cold-moist" // seed needs a cold, damp spell (winter) before it sprouts
  | "seed-double-dormant" // seed needs two seasons / warm-then-cold before it sprouts
  | "seed-scarify" // hard seed coat must be nicked or worn down first
  | "seed-surface-light" // tiny seed, pressed on the surface; needs light to sprout
  | "seed-warm" // sow fresh and keep warm; no chilling, sprouts quickly
  // ---- from the living plant ----
  | "cuttings-softwood" // rooted from soft, green, still-growing shoot tips
  | "cuttings-semi-hardwood" // rooted from this year's shoots as they firm up
  | "cuttings-hardwood" // rooted from leafless dormant twigs cut in winter
  | "division" // dig the clump and pull/cut it into rooted pieces
  | "layering" // root a low branch while it's still attached to the parent
  | "root-cuttings" // grow new plants from short pieces of root
  | "suckers" // dig up the rooted shoots a plant throws up around itself
  | "runners" // pot up the baby plants on runners/stolons
  | "spores"; // ferns: sow the dust-fine spores from the frond backs

export interface Propagation {
  /** Methods that work for this plant, easiest/most reliable first. */
  methods: PropagationMethod[];
  /** Plant-specific, plain-language how-to — timing, seed cleaning, quirks. */
  note: string;
  /** Where the method comes from — a dependable, citable propagation source. */
  basis: string;
}

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

  /** How to reproduce it — save seed, or take from the plant you've got. */
  propagation: Propagation;

  photoUrl?: string; // optional; card degrades to a drawn silhouette offline
}

export type MoistureBand = "dry" | "mesic" | "wet";

// ---------------------------------------------------------------------------
// Wildlife: the "who does this feed" layer.
//
// The eco-scores above answer "how much life does this plant support" as a
// number. This layer answers the question a gardener actually asks — "will it
// bring *monarchs*? *hummingbirds*?" — by naming the specific, recognizable
// insects and animals a plant supports. It's deliberately not the raw host
// tally (an oak feeds hundreds of moth species); it's the notable, nameable,
// well-documented relationships worth browsing by.
//
// The catalog (the animals themselves) lives once in `data/wildlife.ts`; the
// per-region plant→animal ties live beside it in the same file, so the whole
// "what supports what" claim is auditable in one place, the way a plant row is.
// ---------------------------------------------------------------------------

/** Broad group a supported animal belongs to — drives the browse index's
 *  sections and the icon shown. Small and plain on purpose. */
export type WildlifeKind = "butterfly" | "moth" | "bee" | "bird" | "mammal";

/**
 * A specific insect or animal that native plants support. Defined once, in the
 * shared catalog, so "Monarch butterfly" is described in exactly one place and
 * every plant that supports it points at the same entry.
 */
export interface Wildlife {
  id: string; // stable slug, e.g. "monarch"
  common: string; // "Monarch butterfly"
  latin?: string; // "Danaus plexippus" — omitted for informal groups
  kind: WildlifeKind;
  icon: string; // emoji — the app's icon idiom
  /** Plain words: what it is and why bringing it in matters. */
  blurb: string;
}

/**
 * How a plant supports an animal — the honest distinction between raising its
 * young (a larval host, the strongest tie) and feeding or sheltering the adult.
 * Each key is glossed in plain words wherever it's shown (see `plain.ts`).
 */
export type SupportKind = "host" | "nectar" | "berries" | "seeds" | "shelter";

/**
 * One plant→animal tie: which animal, how the plant supports it, why, and where
 * the claim comes from. Lives in the region support map in `data/wildlife.ts`.
 */
export interface SupportLink {
  wildlifeId: string;
  support: SupportKind;
  /** Plant-specific, plain-language why/how. */
  note: string;
  /** A dependable, citable source for this relationship. */
  basis: string;
}

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
  /** Region id the user picked by hand for this spot (e.g. just over a boundary). */
  regionOverride?: string | null;
  weights: Weights;
}
