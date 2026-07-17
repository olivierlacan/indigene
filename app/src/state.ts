// Central app state. Local-first: the working "draft" spot lives in memory and
// is only written to IndexedDB when the user saves. Weights and filters persist
// across sessions so the app remembers what a person cares about.
import type {
  HorizonMask,
  MoistureBand,
  SiteData,
  SunEstimate,
  Weights,
} from "./types";
import { DEFAULT_WEIGHTS, NO_FILTERS } from "./lib/ranking";
import type { ActiveFilters } from "./lib/ranking";
import { kvGet, kvSet } from "./db";

export interface Draft {
  lat: number | null;
  lon: number | null;
  site: SiteData | null;
  sun: SunEstimate | null;
  horizon: HorizonMask | null;
  deciduousOverhead: boolean;
  moistureOverride: MoistureBand | null;
  /**
   * Region id the user picked by hand ("I know my ecoregion") instead of
   * letting coordinates decide. When set with no coordinates, the flow runs
   * without any site lookup — sun and moisture come from the user, and the
   * results screen says the list was their choice. Cleared whenever the user
   * confirms a real location, which switches selection back to automatic.
   */
  regionOverride: string | null;
  editingId: string | null;
}

export const store: {
  draft: Draft;
  weights: Weights;
  filters: ActiveFilters;
} = {
  draft: {
    lat: null,
    lon: null,
    site: null,
    sun: null,
    horizon: null,
    deciduousOverhead: false,
    moistureOverride: null,
    regionOverride: null,
    editingId: null,
  },
  weights: { ...DEFAULT_WEIGHTS },
  filters: { ...NO_FILTERS },
};

export async function loadPrefs(): Promise<void> {
  const w = await kvGet<Weights>("weights");
  const f = await kvGet<ActiveFilters>("filters");
  if (w) store.weights = { ...DEFAULT_WEIGHTS, ...w };
  if (f) store.filters = { ...NO_FILTERS, ...f };
}

export async function persistPrefs(): Promise<void> {
  await kvSet("weights", store.weights);
  await kvSet("filters", store.filters);
}

// The site fetch only needs lat/lon, so we kick it off as soon as the user
// confirms their location and let it run in parallel with the sky scan.
let _sitePromise: Promise<SiteData> | null = null;
export function setSitePromise(p: Promise<SiteData> | null): void {
  _sitePromise = p;
}
export function getSitePromise(): Promise<SiteData> | null {
  return _sitePromise;
}

export function resetDraft(): void {
  _sitePromise = null;
  store.draft = {
    lat: null,
    lon: null,
    site: null,
    sun: null,
    horizon: null,
    deciduousOverhead: false,
    moistureOverride: null,
    regionOverride: null,
    editingId: null,
  };
}

export function navigate(step: string): void {
  location.hash = `#/${step}`;
}
