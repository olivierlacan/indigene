// Central app state. Local-first: the working "draft" spot lives in memory and
// is only written to IndexedDB when the user saves. Weights and filters persist
// across sessions so the app remembers what a person cares about.
import type {
  HorizonMask,
  MoistureBand,
  SavedSpot,
  SiteData,
  SunEstimate,
  Weights,
} from "./types";
import { DEFAULT_WEIGHTS, NO_FILTERS } from "./lib/ranking";
import type { ActiveFilters } from "./lib/ranking";
import { kvGet, kvSet } from "./db";
import { rememberSpot } from "./lib/sticky";

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
  /**
   * Which of this spot's answers came back from the device's memory rather
   * than from the reader this visit. Recall is never silent: the step showing
   * a recalled answer says so in one line (see `lib/sticky.ts`), and the flag
   * clears the moment the reader answers for themselves.
   */
  recalled: { sun: boolean; moisture: boolean };
}

/** A blank draft. A function rather than a constant to spread, because
 *  `recalled` is a nested object: a shallow copy of a shared literal would hand
 *  every draft the *same* one to mutate. */
function emptyDraft(): Draft {
  return {
    lat: null,
    lon: null,
    site: null,
    sun: null,
    horizon: null,
    deciduousOverhead: false,
    moistureOverride: null,
    regionOverride: null,
    editingId: null,
    recalled: { sun: false, moisture: false },
  };
}

export const store: {
  draft: Draft;
  weights: Weights;
  filters: ActiveFilters;
} = {
  draft: emptyDraft(),
  weights: { ...DEFAULT_WEIGHTS },
  filters: { ...NO_FILTERS },
};

/**
 * The way back to the ranked plant list.
 *
 * A list you can't return to is a list you daren't leave, and the plant list is
 * now something people step off constantly — onto a plant's own page, or back
 * to the goals step to re-rank. So leaving it leaves a trail: `open` means a
 * page should offer the way back, and `scrollY` is where the list was, so
 * coming back from plant number twelve doesn't land at plant number one.
 *
 * It's deliberately narrow. The trail is laid only when the list is left for a
 * page that leads back to it, and it's swept the moment the reader goes
 * anywhere else — an offer to "return to your plants" three pages later is a
 * guess about intent, not a memory of one.
 */
export const resultsTrail: { open: boolean; scrollY: number | null } = {
  open: false,
  scrollY: null,
};

/** Called as the plant list is left, with the route being opened. */
export function leaveResults(dest: string, scrollY: number): void {
  const toPlant = dest.startsWith("#/plants/");
  const toGoals = dest.startsWith("#/priorities");
  resultsTrail.open = toPlant || toGoals;
  // Only a plant page restores the scroll: coming back from the goals step, the
  // ranking itself may have changed, and a remembered position would put the
  // reader in the middle of a list that no longer means what it did.
  resultsTrail.scrollY = toPlant ? scrollY : null;
}

/** Called as a page that offered the way back is left, with the route being
 *  opened: the trail survives only if it was the one taken. */
export function keepTrail(dest: string): void {
  if (dest.startsWith("#/results")) return;
  resultsTrail.open = false;
  resultsTrail.scrollY = null;
}

let prefsLoaded: Promise<void> | null = null;

export function loadPrefs(): Promise<void> {
  prefsLoaded = (async () => {
    const w = await kvGet<Weights>("weights");
    const f = await kvGet<ActiveFilters>("filters");
    if (w) store.weights = { ...DEFAULT_WEIGHTS, ...w };
    if (f) store.filters = { ...NO_FILTERS, ...f };
  })().catch(() => {});
  return prefsLoaded;
}

/**
 * Settles once the background prefs read has (and never rejects).
 *
 * Ranking doesn't need this — the plant list is drawn long after boot, with
 * whatever the weights are by then. A screen that *reports* the stored goal
 * does: rendering before the read lands would tell someone their goal is the
 * default when it isn't, which is worse than the beat of delay. Bounded by the
 * db module's own open watchdog.
 */
export function prefsReady(): Promise<void> {
  return prefsLoaded ?? Promise.resolve();
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
  // A new spot means the old list is gone; nothing leads back to it.
  resultsTrail.open = false;
  resultsTrail.scrollY = null;
  store.draft = emptyDraft();
}

/**
 * Put the working spot into the device's memory — coordinates (or the
 * hand-picked region) *together with* the sun and soil answers given for them.
 *
 * Called whenever one of those answers settles, and always as a whole spot, so
 * what comes back next visit can only ever be this ground's own readings. A
 * draft with neither coordinates nor a region isn't a spot yet and isn't kept.
 */
export function rememberDraftSpot(): void {
  const d = store.draft;
  if (d.lat == null && !d.regionOverride) return;
  rememberSpot({
    lat: d.lat,
    lon: d.lon,
    regionId: d.regionOverride,
    sun: d.sun,
    horizon: d.horizon,
    deciduousOverhead: d.deciduousOverhead,
    moisture: d.moistureOverride,
  });
}

export function navigate(step: string): void {
  location.hash = `#/${step}`;
}

/**
 * Load a saved spot back into the working draft and jump to its plant list —
 * the "Open" action, shared by the Saved page and the header's Saved menu so
 * both reload a spot identically.
 */
export function openSavedSpot(s: SavedSpot): void {
  store.draft = {
    lat: s.lat,
    lon: s.lon,
    site: s.site,
    sun: s.sun,
    horizon: s.horizon,
    deciduousOverhead: s.deciduousOverhead ?? false,
    moistureOverride: s.soilOverride?.moisture ?? null,
    regionOverride: s.regionOverride ?? null,
    editingId: s.id,
    // A saved spot's readings are its own, given by name and on purpose —
    // nothing here was recalled behind anyone's back.
    recalled: { sun: false, moisture: false },
  };
  store.weights = { ...s.weights };
  // Opening a saved spot makes it the spot you're working on, so it's also the
  // one the next visit starts from.
  rememberDraftSpot();
  navigate("results");
}
