// The working spot, resolved once.
//
// Two screens now rank the same draft — the goals step and the plant list —
// and they must agree to the plant about what "here" means. Anything that
// answers "which region is this spot in?" or "what does the ranking say right
// now?" lives here so the preview a person tunes and the list they land on are
// the same computation, not two lookalikes that can drift apart.
import { store } from "../state";
import { REGIONS, regionForSite, loadPlants } from "./plants";
import type { RegionDef } from "./plants";
import { rankPlants } from "./ranking";
import type { Ranked } from "./ranking";
import type { Plant } from "../types";

export interface DraftRegion {
  region: RegionDef | null;
  /** True when the reader named the region themselves rather than having it
   *  measured from coordinates — the plant list says so when they did. */
  chosen: boolean;
  hasCoords: boolean;
}

/** Which region's roster this draft gets: the reader's hand-picked one if they
 *  made one, otherwise whatever their coordinates fall in. `null` means we have
 *  no honest list for this spot and shouldn't fake one. */
export function draftRegion(): DraftRegion {
  const hasCoords = store.draft.lat != null && store.draft.lon != null;
  const chosen = store.draft.regionOverride
    ? REGIONS.find((r) => r.meta.id === store.draft.regionOverride) ?? null
    : null;
  const region = chosen ?? (hasCoords
    ? regionForSite(store.draft.lat!, store.draft.lon!, store.draft.site)
    : null);
  return { region, chosen: !!chosen, hasCoords };
}

/** Every plant in a region, ranked for this draft with the reader's current
 *  goals and filters. */
export function rankDraft(plants: Plant[]): Ranked[] {
  return rankPlants(plants, {
    site: store.draft.site,
    sun: store.draft.sun,
    weights: store.weights,
    filters: store.filters,
    moistureOverride: store.draft.moistureOverride,
  });
}

/** The roster to rank, for a region — fetched the first time (see `loadPlants`). */
export function draftPlants(region: RegionDef): Promise<Plant[]> {
  return loadPlants(region);
}

/**
 * A short string naming *which question* is being ranked — the region plus the
 * spot's own readings. The recompute line uses it to tell "the answer changed"
 * apart from "you asked about somewhere else", which is not a change at all.
 */
export function draftContext(region: RegionDef): string {
  const d = store.draft;
  const at = d.lat != null && d.lon != null ? `${d.lat.toFixed(3)},${d.lon.toFixed(3)}` : "picked";
  return [region.meta.id, at, d.sun?.hours ?? "?", d.moistureOverride ?? "?", d.site?.zone ?? "?"].join("|");
}
