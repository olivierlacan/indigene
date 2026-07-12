// Shared types for a *region*: a seed plant list plus the metadata that says
// where that list applies. Regions are how Indigene grows past its first area —
// adding a new one is adding a data file and registering it, nothing more (see
// `regions.ts`). The rest of the app never hard-codes a region; it asks which
// region a spot falls in and loads that list.
import type { EcoScores, Plant } from "../types";

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
  /** The reference locale/zones the numbers are tuned to. */
  reference: string;
  /** Plain-language caveat about what "native here" means for this region. */
  note: string;
  /**
   * Coarse coverage box. Deliberately a bounding box, not a real ecoregion
   * polygon — it matches the app's other coarse-but-honest signals (soil,
   * ecoregion). A spot inside the box gets this region's plant list; outside
   * every region's box, the app says it has no list yet rather than guessing.
   */
  bounds: RegionBounds;
}

export interface RegionDef {
  meta: RegionMeta;
  seed: RawPlant[];
}
