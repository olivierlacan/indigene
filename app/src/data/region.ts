// Shared types for a *region*: a seed plant list plus the metadata that says
// where that list applies. Regions are how Indigene grows past its first area —
// adding a new one is adding a data file and registering it, nothing more (see
// `regions.ts`). The rest of the app never hard-codes a region; it asks which
// region a spot falls in and loads that list.
import type { EcoScores, EcoregionProvider, Plant } from "../types";

// A seed row omits the one score we compute rather than author by hand — the
// caterpillar/moth host value, derived in `lib/plants.ts` from a raw, citable
// Lepidoptera host-species count.
export type RawPlant = Omit<Plant, "scores"> & {
  scores: Omit<EcoScores, "host">;
};

/** Coarse lat/lon box used to decide whether a spot is inside this region. */
export interface RegionBounds {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export interface RegionMeta {
  /** Stable id, e.g. "pnw". Used as the plant-list cache key. */
  id: string;
  /** Human name shown in the UI, e.g. "Pacific Northwest (west of the Cascades)". */
  name: string;
  /**
   * The same place in as few words as stay true — "Pacific Northwest",
   * "South Florida". For chips, pills and filter rows, where the full name's
   * qualifier ("west of the Cascades") is the part that wraps to a second line
   * on a phone. It must still name the region unambiguously: shorten by
   * dropping a parenthetical, never by widening the claim. Pages that *are*
   * about the region (its roster, its card) keep the full `name`.
   *
   * English, like `name` — a reader's own language comes from
   * `locales/regions.<lang>.ts` via `regionShort()`, never from here.
   */
  short: string;
  /**
   * The reference *place* the numbers are tuned to — "Pennsylvania",
   * "Greater Miami & the Keys". Just the place: the hardiness range used to
   * ride along in a parenthetical here, which made every line longer and
   * buried the one part of it that is a standard, scannable value. That now
   * lives in `zones` and is shown as its own chip.
   */
  reference: string;
  /**
   * The USDA hardiness range the list is tuned to, as a bare range ready to
   * follow the word "USDA" — "6b–7a", "10a–11a". European regions prefix a
   * "≈" because USDA zones are a translation there, not the local convention:
   * "≈8a–9a".
   */
  zones: string;
  /** Plain-language caveat about what "native here" means for this region. */
  note: string;
  /**
   * How far this region reaches, said the way you'd say it out loud — "from
   * the Oregon–California line north to the Canadian border, and from the
   * coast east to the crest of the Cascades".
   *
   * Someone reading a roster has a fair question the plant list can't answer:
   * *does this include me?* The coverage box below answers it in degrees, the
   * ecoregion codes answer it in classification jargon, and neither is a
   * sentence anyone can picture. So every region names its own edges in
   * landmarks — coasts, mountain crests, state lines, lakes.
   *
   * English, like `name` and `note`; a reader's own language comes from
   * `locales/regions.<lang>.ts`.
   */
  extent: string;
  /**
   * Coarse coverage box. Deliberately a bounding box, not a real ecoregion
   * polygon — it matches the app's other coarse-but-honest signals (soil,
   * ecoregion). A spot inside the box gets this region's plant list; outside
   * every region's box, the app says it has no list yet rather than guessing.
   */
  bounds: RegionBounds;

  /**
   * The one plant this region leads with when someone is browsing plants rather
   * than checking a spot — its showcase pick on the explore page. An editorial
   * choice (charismatic, plantable, tells the region's story), not a computed
   * one.
   *
   * Required, and that is the point: a region card names its star without
   * loading the region's plant list, so there is nowhere to compute a stand-in
   * from. Declaring the pick costs one line; computing it would cost the reader
   * a download of every region on the page.
   */
  featuredPlantId: string;

  /**
   * How many caterpillar species the pick above feeds, here.
   *
   * The same number as the plant's own row, repeated because the explore grid
   * prints it for nine regions at once and must not fetch nine plant lists to
   * do it. It is a *regional* figure — a birch feeds 327 species in the Alps
   * and 306 on the Atlantic coast — so it can't be read off a per-taxon index
   * the way the plant and keystone counts are. `npm run registry:check` fails
   * if this and the plant list ever disagree.
   */
  featuredHostLepCount: number;

  /**
   * The real ecoregions this seed list represents, tagged with the provider that
   * classifies them (EPA Omernik codes for US regions, EEA biogeographical-region
   * slugs for European ones). When present AND a live lookup of the same provider
   * gave us the spot's code, selection *refines within the box*: the point must be
   * both inside `bounds` and in one of these ecoregions. This is what lets a point
   * just east of the Cascade crest — same box, different ecoregion — correctly
   * fall through, and likewise a Mediterranean point inside a broad France box.
   * Omitted → the box alone decides (and offline, the box always decides, since
   * there's no live code). Always a refinement of `bounds`, never a replacement:
   * some ecoregions span several regions' turf (Omernik 75, Southern Coastal
   * Plain; EEA Atlantic across several countries), so the box still prevents one
   * list bleeding into a neighbor's.
   */
  ecoregion?: { provider: EcoregionProvider; codes: string[] };
}

/**
 * A region: its description, and the way to its plants.
 *
 * `meta` is here, in the app's first download — it's what decides which region
 * a spot falls in, and what names a region anywhere it's mentioned. The plant
 * list is not: `load()` fetches it, and each region's list is a file of its own,
 * so a reader downloads the one region they're gardening in rather than all
 * nine. See `regions.ts`, and `loadPlants` in `lib/plants.ts` for the caching.
 */
export interface RegionDef {
  meta: RegionMeta;
  load: () => Promise<RawPlant[]>;
}
