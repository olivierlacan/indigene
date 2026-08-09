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
 * An iNaturalist "iconic taxon" — the coarse kingdom/class bucket iNaturalist
 * filters by. We carry it explicitly (rather than deriving it from `kind`)
 * because the two don't always line up: the gopher tortoise browses under
 * "Mammals & others" but is a reptile, so its iconic taxon is `Reptilia`.
 */
export type IconicTaxon = "Insecta" | "Aves" | "Mammalia" | "Reptilia";

/**
 * How to find this animal on iNaturalist for the "see it near you" sighting
 * lookup. We store the animal's *scientific name*, not a numeric taxon id: the
 * name is already curated and sourced in the catalog, and we resolve it to a
 * taxon id at request time (see `lib/inaturalist.ts` → `resolveTaxon`). That
 * resolution follows iNaturalist's own synonymy, so a renamed taxon still finds
 * its sightings, and it fails safe — an unresolvable name shows nothing rather
 * than the wrong creature. Some catalog entries are informal groups ("Jays,
 * turkeys & woodpeckers", two hummingbirds in one card) with no single taxon;
 * those omit this and simply don't offer the lookup, exactly as they get no
 * single species-record link today.
 */
export interface InatScope {
  /** The scientific name to resolve — a species binomial ("Danaus plexippus")
   *  or a genus ("Bombus", for all bumble bees). */
  name: string;
  /** The iconic taxon that disambiguates the name across kingdoms and scopes
   *  the sighting query to the right group of life. */
  iconic: IconicTaxon;
}

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
  /** How to look this animal up in iNaturalist's sightings (see `InatScope`).
   *  Omitted for informal groups that don't map to a single taxon — they get no
   *  "see it near you" lookup, the same way they get no single species record. */
  inat?: InatScope;
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
// Look-alikes: the "that isn't the one" layer.
//
// Every other layer in the app answers "what should I plant". This one answers
// the question that comes right after someone decides to: **is the thing in
// front of me actually it?** A garden centre sells Callery pear beside
// serviceberry, a hedge of cherry laurel reads as holly at a glance, and half
// the "butterfly plants" on a bench are not the plant the butterfly needs. A
// person acting in good faith plants the wrong thing, and nothing in the app
// would have caught it.
//
// Same two-part shape as the wildlife layer, for the same reason:
//
//   1. LOOKALIKES — the catalog. Each impostor described once, in plain words:
//      what it is, where it's really from, and why it keeps getting mistaken
//      for something else. A Callery pear is a Callery pear in every region.
//
//   2. CONFUSIONS — the ties, keyed by region → native plant id → links. Keyed
//      by region because *the same plant is not the same story in two places*:
//      common ivy is a listed invasive in North America and an ordinary native
//      woodland climber in Atlantic France, where it's on our own roster. A
//      catalog-level "invasive" flag would have to lie in one of those places,
//      which is why `status` lives on the tie.
//
// Honesty stance, as everywhere else:
//   - This is NOT "non-native plants we disapprove of". A tie earns its place
//     only when the two plants are genuinely mixed up by real people, and the
//     entry has to say *how to tell them apart* — a list of villains with no
//     tells is a scold, not a tool.
//   - "Impostor" is about the confusion, not about the plant's character.
//     Douglas-fir planted in the Alps is a magnificent tree in the wrong
//     hemisphere; Japanese maple is not invasive anywhere near us. The status
//     word says which is which instead of tarring them all.
//   - Every tie carries a `basis`, and every tell is something a person can
//     actually check standing in front of the plant — a smell, a thorn, a leaf
//     stalk that bleeds white — not a botanical key they'd need a lens for.
// ---------------------------------------------------------------------------

/**
 * What this plant is *in the region the tie is authored for* — the honest
 * middle ground between "native" and "not native", because those two words
 * hide the distinction that actually matters to a gardener.
 *
 *  - "invasive"   Introduced here AND spreading into wild places on its own,
 *                 at a cost. The ones worth going out of your way to avoid.
 *  - "introduced" Brought here and planted; not known to spread on its own.
 *                 Not a villain — just not the plant the local food web knows.
 *  - "native"     Grows here wild, same as the plant it's confused with. The
 *                 confusion still matters (a deadly bulb next to an edible one,
 *                 a host plant next to one nothing eats).
 */
export type LookalikeStatus = "invasive" | "introduced" | "native";

/**
 * One impostor, described once. `latin` is what makes it findable: the app has
 * no registry entry for a plant it doesn't recommend, so the iNaturalist link
 * is built from the scientific name the same way the registry falls back to a
 * name search for an unreconciled native.
 */
export interface Lookalike {
  id: string; // stable slug, e.g. "pyrus-calleryana"
  common: string; // "Callery pear (Bradford pear)"
  latin: string; // "Pyrus calleryana"
  /** Growth habit, for the same drawn silhouette a plant card gets. It carries
   *  real information in this layer: half of "is that my serviceberry?" is
   *  whether the thing in front of you is a tree, a shrub or a vine. */
  form: PlantForm;
  /** Where it's really from, in plain words: "Native to China and Vietnam." */
  origin: string;
  /** What it is and why it keeps turning up where it shouldn't. */
  blurb: string;
  /** A dependable, citable source for the origin and the spread. */
  originBasis: string;
}

/**
 * One checkable difference between the native and its impostor. Read as a
 * sentence: **Flowers** — the native does this, the impostor does that. Both
 * sides are always filled in: "the native has X" is only useful next to what
 * the other one has instead.
 */
export interface TellApart {
  /** What you're looking at: "Flowers", "Leaf stalk", "Smell", "Berries". */
  feature: string;
  /** What the native shows. */
  native: string;
  /** What the impostor shows. */
  lookalike: string;
}

/** One native→impostor tie, keyed under the native in the region confusion map. */
export interface LookalikeLink {
  lookalikeId: string;
  /** What the impostor is **in this region** (see `LookalikeStatus`). */
  status: LookalikeStatus;
  /** Why these two get mixed up, in one plain sentence. */
  why: string;
  /** How to tell them apart, most decisive tell first. */
  tells: TellApart[];
  /** A dependable, citable source for the confusion and the tells. */
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

/**
 * One region's iNaturalist record counts, taken once and shipped with the app
 * (`scripts/build-region-counts.mjs` writes them; `data/region-counts.ts` holds
 * them).
 *
 * The same arithmetic as the spot reading in `lib/rarity.ts` — this plant's
 * share of every plant record in the same area — but the area is the region's
 * whole coverage box rather than a circle around somebody. That makes it a
 * coarser answer to a *different* question, so it is only ever shown where
 * there is no spot to ask about, with copy that names the region.
 */
export interface RegionCounts {
  regionId: string;
  /** ISO date the counts were taken, printed so a reader can judge their age. */
  capturedAt: string;
  /** Research-grade records of every plant in the box — the yardstick. */
  total: number;
  /** iNaturalist taxon id → research-grade records of it in the box. A native
   *  with no records at all is present with a count of zero, which is a real
   *  answer rather than a gap. */
  counts: Record<string, number>;
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

/** Which ecoregion classification answered the lookup. Each covers a different
 *  part of the world, so the app picks one by coordinates and both fall back to
 *  the coarse box offline:
 *   - "epa-omernik": US EPA (Omernik) ecoregions — conterminous US, public domain.
 *   - "eea-biogeo":  EEA Biogeographical Regions of Europe — CC-BY 4.0. Coarse
 *     (Atlantic, Continental, Alpine, Mediterranean…), one flat level. */
export type EcoregionProvider = "epa-omernik" | "eea-biogeo";

/**
 * A real ecoregion from a live lookup, normalized across providers so the rest
 * of the app never hard-codes one country's scheme. `code` is the selection key
 * (Omernik Level III code, or the EEA region slug); `name` is what we show.
 * Public-domain (EPA) or CC-BY (EEA) — either way safe to query, cache, display.
 */
export interface EcoregionInfo {
  /** Which classification answered — decides the label suffix and the codes a
   *  region declares to refine selection. */
  provider: EcoregionProvider;
  /** Selection key. Omernik Level III code ("3"); EEA region slug ("atlantic"). */
  code: string;
  /** Display name. "Willamette Valley"; "Atlantic". */
  name: string;
  /** Broad→specific roll-ups shown above `code` (Omernik Level I/II names).
   *  Empty for EEA, which is a single flat level. */
  hierarchy: string[];
  /** A finer local subdivision when the provider has one (Omernik Level IV).
   *  null for EEA. Display only — never used for selection. */
  detail: { code: string; name: string } | null;
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

/**
 * When a plant went into the ground, to whatever precision the person actually
 * remembers.
 *
 * Most people don't know the day. They know "last spring", or "the year we
 * moved in". A single `Date` would force a lie — a day nobody chose, printed
 * back as if it were recorded fact — so the month and the day are optional and
 * the app only ever shows what was given. The reading is deliberately
 * conservative wherever it feeds an expectation: a year on its own is read as
 * the *end* of that year, so "planted in 2024" never claims more growing time
 * than it can prove (see `plantedSince` in `lib/plantings.ts`).
 */
export interface PlantedDate {
  year: number;
  /** 1–12, when known. */
  month?: number;
  /** 1–31, when known. Never set without a month. */
  day?: number;
}

/**
 * One entry in a spot's planting log: something you planted, where, and when.
 *
 * It's a *record*, not a recommendation — the app's other layers say what a
 * spot should have; this one says what it does have, in the gardener's own
 * account. Like every saved spot it lives in IndexedDB on the device and has
 * nowhere else to go.
 *
 * Progress pictures are the one thing it deliberately doesn't hold. Photos are
 * megabytes each, and a browser can evict a database it decides is too big —
 * losing three years of a garden's record to a storage sweep would be the
 * cruellest possible failure. So a planting carries *references* to
 * iNaturalist observations instead: the picture stays where the gardener
 * already put it, and this log holds the thread back to it (see
 * `lib/observation-link.ts`).
 */
export interface Planting {
  id: string;
  /** The saved spot this went into. */
  spotId: string;
  /** Catalog slug of the plant (`Plant.id`). */
  plantId: string;
  /** How many of it went in. At least 1. */
  count: number;
  /** When, to whatever precision was given — null when it wasn't given at all. */
  planted: PlantedDate | null;
  /**
   * iNaturalist observations tied to this planting, in the order they were
   * linked. Each is whichever name the gardener had — the number out of a link,
   * or the UUID the site's copy button gives — kept as text exactly as given
   * (`ObservationRef` in `lib/observation-link.ts`).
   */
  observations: string[];
  /** The gardener's own words about it, when they wrote any. */
  note?: string;
  createdAt: number;
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
