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
  /**
   * Every animal in this catalog must itself be native to the regions Indigene
   * covers — the whole point is a native plant feeding a native animal, not a
   * native plant that happens to also suit an introduced species (the honey bee
   * is the classic one we leave out). This is a hard invariant: the field exists
   * so the guarantee is explicit in the data, shown in the UI, and enforced by
   * the dev audit, which refuses to let a non-native be listed. A citable source
   * for the native status lives in `nativeBasis`.
   */
  native: true;
  /** Where the animal is native and a dependable source saying so. */
  nativeBasis: string;
}

/**
 * How a plant supports an animal — the honest distinction between raising its
 * young (a larval host, the strongest tie) and feeding or sheltering the adult.
 * Each key is glossed in plain words wherever it's shown (see `plain.ts`).
 */
export type SupportKind = "host" | "nectar" | "berries" | "seeds" | "shelter";

/**
 * How strongly the animal depends on THIS plant (or the plant group it stands
 * in for). `support` says *how* the plant helps; this says *how much it matters*
 * — the difference between a make-or-break tie and a nice-to-have.
 *
 *  - "sole"   The animal's only option: an obligate host with no substitute —
 *             a monarch on milkweed, an atala on coontie. Lose it locally and
 *             you lose the animal. The headline conservation ties.
 *  - "narrow" A specialist restricted to a small group this plant belongs to
 *             (sunflower-family specialist bees; a butterfly tied to one plant
 *             family). Important, with only a few alternatives.
 *  - "broad"  One of many the animal uses — valuable, but not make-or-break.
 *
 * Optional, defaulting to "broad" (see `relianceOf`): most ties — adult nectar,
 * fruit, seed — are generalist, and defaulting to the weaker claim means we
 * never overstate a dependence we didn't explicitly vouch for.
 */
export type SupportReliance = "sole" | "narrow" | "broad";

/**
 * One plant→animal tie: which animal, how the plant supports it, how much the
 * animal depends on it, why, and where the claim comes from. Lives in the region
 * support map in `data/wildlife.ts`.
 */
export interface SupportLink {
  wildlifeId: string;
  support: SupportKind;
  /** How much the animal depends on this plant. Omit for the "broad" default. */
  reliance?: SupportReliance;
  /** Plant-specific, plain-language why/how. */
  note: string;
  /** A dependable, citable source for this relationship. */
  basis: string;
}

// ---------------------------------------------------------------------------
// Registry: the canonical identity layer.
//
// The plant lists answer "what should I plant here". The registry answers a
// narrower, load-bearing question the rest of the system leans on: "is this the
// same plant?" — across our own regions, across a nursery's messy product
// names, and across other apps. It is deliberately an *identity* projection
// (names, aliases, external keys), not a second copy of the eco-data: one entry
// per taxon, keyed on a stable id, so a lookup resolves to exactly one thing.
//
// It is entirely client-side static data (like the plant lists and like tzdata
// or the GBIF backbone dump — reference data ships as a file, not a service),
// generated from the catalog by `scripts/build-registry.mjs` and kept in sync by
// `scripts/check-registry.mjs`. The identity anchor is an external, globally-
// recognized identifier (IPNI, via POWO/WCVP) carried as a CURIE in `primaryId`,
// with a bag of cross-reference identifiers alongside it. Those external ids are
// reconciled in by `scripts/reconcile.mjs` (writing `data/registry.overrides.json`);
// until then only our own `indigene` id and the accepted name are known, and
// `primaryId` is null. See `docs/nursery-availability-protocol.md` for why
// identity is the foundation of availability and discoverability.
// ---------------------------------------------------------------------------

/** Resolution of a registry entry. Most are species; genus nodes let a buyer
 *  ask for "a milkweed" as well as a specific one. */
export type TaxonRank = "species" | "genus";

/**
 * Identifier namespaces we carry. Every value is a bare accession within its
 * scheme (e.g. `ipni` → "77123-1"); `primaryId` is the CURIE form (`ipni:77123-1`).
 * `indigene` is our own catalog id — namespaced like every external one, so the
 * registry never pretends a local slug is the identity. The external schemes are
 * filled by reconciliation; `powo` is derived from `ipni` and needs no storage.
 */
export type IdScheme =
  | "ipni" // International Plant Names Index — the anchor authority
  | "wfo" // World Flora Online — alternate persistent taxon id / anchor fallback
  | "gbif" // GBIF backbone usageKey — occurrences/iNaturalist (unstable; xref only)
  | "usda" // USDA PLANTS Symbol — US native status/distribution
  | "itis" // ITIS TSN — North American taxonomy, public domain
  | "inat" // iNaturalist taxon id — direct link to the species page (photos, sightings)
  | "wikidata" // Wikidata QID — the crosswalk hub used to populate the rest
  | "indigene"; // our own catalog id (the registry↔catalog join key)

/** Schemes that can anchor `primaryId`, in priority order — persistent, global,
 *  never-reused ids only (GBIF is deliberately excluded: its keys can shift). */
export const ANCHOR_SCHEMES = ["ipni", "wfo"] as const;

export interface RegistryEntry {
  /** The identity anchor as a CURIE (`scheme:accession`, e.g. "ipni:77123-1"),
   *  self-describing and resolvable (identifiers.org). Null until reconciled —
   *  never a local slug masquerading as the identity. */
  primaryId: string | null;
  /** Accepted binomial — human-readable display; may be re-interpreted as
   *  taxonomy revises, which is exactly why it is not the key. */
  scientificName: string;
  family: string;
  form: PlantForm;
  rank: TaxonRank;
  /** Cross-reference identifiers by scheme, each a bare accession. Always carries
   *  `indigene` (our catalog id); external schemes are filled by reconciliation. */
  identifiers: Partial<Record<IdScheme, string>>;
  /** Display names, primary first (e.g. ["Oregon White Oak", "Garry Oak"]). */
  commonNames: string[];
  /** Normalized (lowercased, single-spaced) strings that resolve to this entry —
   *  every common name plus the scientific name. The name index is built from
   *  these; a string two entries share is flagged ambiguous, never guessed. */
  aliases: string[];
  /** If this is a cultivar/hybrid node, the `indigene` id of the straight species
   *  it derives from — so "Dwarf Firebush" is a distinct node pointing at "Firebush". */
  cultivarOf: string | null;
  /** Indigene region ids whose lists include this taxon (a taxon native to two
   *  regions is one entry, listed in both). */
  regions: string[];
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
