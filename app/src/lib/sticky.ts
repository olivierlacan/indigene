// What this device remembers between visits.
//
// Two things, and deliberately only two:
//
//   - **The last spot**, whole. Where it was, *and its own* sun and soil
//     answers. Sun and soil are properties of a patch of ground, not of a
//     person: "sunny most of the day" is true of the corner by the fence and
//     says nothing about the next garden. So they are never remembered on
//     their own — they ride along with the coordinates they were given for,
//     and they come back only when the same ground comes back
//     (`rememberedSpotFor`). Move the pin somewhere else and the questions are
//     asked again, because they genuinely have different answers there.
//   - **A default region**, which is a *setting* rather than a memory: the
//     reader goes to Settings and says "start me in this plant list". Nothing
//     in the flow ever sets it behind their back, which is what lets the
//     location step mention it in a single line and point at the setting,
//     instead of explaining a piece of magic nobody asked for.
//
// The ranking goal is remembered too, but it was already: it lives in the
// `weights` key that `state.ts` persists on every slider move. It's listed on
// the Settings page beside these so all three are reviewable in one place.
//
// Storage is the same on-device IndexedDB key/value store as the weights —
// local to this device, never sent anywhere. Loading follows the app's
// no-blocking rule (see `boot` in main.ts): reads come from an in-memory cache
// filled in the background, and a slow or failing IndexedDB simply means
// nothing is remembered this visit.
import { kvGet, kvSet } from "../db";
import type { HorizonMask, MoistureBand, SunEstimate } from "../types";

/**
 * A spot, as remembered: where it is, plus the answers that belong to it.
 *
 * Site data (soil, climate, elevation) is *not* kept. It's looked up from the
 * coordinates in a second and can improve between visits; a cached copy would
 * only be a staler version of something free.
 */
export interface StickySpot {
  lat: number | null;
  lon: number | null;
  /** Set instead of coordinates when the reader picked a region by hand. */
  regionId: string | null;
  sun: SunEstimate | null;
  horizon: HorizonMask | null;
  deciduousOverhead: boolean;
  moisture: MoistureBand | null;
  savedAt: number;
}

export interface Sticky {
  spot?: StickySpot;
  /** Region id the reader chose in Settings as their starting point. */
  defaultRegion?: string;
}

const KEY = "sticky";

/**
 * How far the pin may move and still be "the same spot", in metres.
 *
 * Generous on purpose. Two GPS fixes taken from the same doorstep routinely
 * land tens of metres apart, and every reading this gates is coarser than that
 * anyway: the soil grid is ~250 m across and the sun answer describes a corner
 * of a garden by eye. Being strict here wouldn't protect anyone — it would just
 * re-ask two questions whose answers hadn't changed.
 */
const SAME_SPOT_M = 150;

let cache: Sticky = {};
let ready: Promise<void> | null = null;

/** What's remembered right now (empty until the background load settles). */
export function sticky(): Sticky {
  return cache;
}

export function loadSticky(): Promise<void> {
  ready = kvGet<Sticky>(KEY)
    .then((v) => {
      cache = v ?? {};
    })
    .catch(() => {});
  return ready;
}

/**
 * Settles once the background load has (and never rejects). A step whose first
 * paint depends on something remembered awaits this — otherwise a reload that
 * lands straight on that step races the read and silently comes up blank. The
 * db module's own open watchdog bounds the wait, so a stalled IndexedDB settles
 * this within ~2 s with nothing remembered rather than hanging the page.
 */
export function stickyReady(): Promise<void> {
  return ready ?? Promise.resolve();
}

function persist(): void {
  void kvSet(KEY, cache).catch(() => {});
}

/**
 * Remember this spot, wholesale.
 *
 * Always a full replacement rather than a merge, and that's the point: the
 * remembered sun and moisture can never end up describing coordinates other
 * than the ones stored beside them.
 */
export function rememberSpot(spot: Omit<StickySpot, "savedAt">): void {
  cache = { ...cache, spot: { ...spot, savedAt: Date.now() } };
  persist();
}

export function forgetSpot(): void {
  delete cache.spot;
  persist();
}

/** Metres between two points — flat-earth maths, which is exact enough at the
 *  scale of "is this the same garden?". */
function metresBetween(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const dLat = (aLat - bLat) * 111320;
  const dLon = (aLon - bLon) * 111320 * Math.cos((aLat * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
}

/**
 * The remembered readings for this spot — or `null` when the reader is
 * somewhere else, which is the whole guard that keeps sun and soil per-spot.
 *
 * Pass coordinates for a map point, or a region id for the hand-picked path.
 */
export function rememberedSpotFor(
  at: { lat: number; lon: number } | { regionId: string }
): StickySpot | null {
  const spot = cache.spot;
  if (!spot) return null;
  if ("regionId" in at) {
    return spot.regionId === at.regionId ? spot : null;
  }
  if (spot.lat == null || spot.lon == null) return null;
  return metresBetween(spot.lat, spot.lon, at.lat, at.lon) <= SAME_SPOT_M ? spot : null;
}

/** The region the reader set as their starting point, if they set one. */
export function defaultRegion(): string | null {
  return cache.defaultRegion ?? null;
}

/** Set (or, with `null`, clear) the starting region. */
export function setDefaultRegion(id: string | null): void {
  if (id) cache = { ...cache, defaultRegion: id };
  else delete cache.defaultRegion;
  persist();
}
