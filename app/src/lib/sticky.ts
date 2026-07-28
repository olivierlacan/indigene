// Sticky preferences: the answers a person gives over and over — where they
// stand, how sunny the spot is, how wet it stays — remembered on this device
// so the next visit starts where the last one ended. Two house rules keep the
// magic honest:
//
// 1. Recall is always disclosed. A screen that pre-answers a question from a
//    remembered preference says so in place (see components/remembered.ts),
//    with the way to change it right there.
// 2. Everything is reviewable in one place — the Preferences page
//    (#/preferences) lists what's remembered and can forget any of it.
//
// Storage is the same IndexedDB key/value store as the ranking weights: local
// to the device, never sent anywhere. Loading follows the app's no-blocking
// rule (see boot in main.ts): reads come from an in-memory cache filled in
// the background, and a slow or failing IndexedDB just means nothing is
// remembered this visit.
import { kvGet, kvSet } from "../db";
import type { MoistureBand } from "../types";

export type SunBucket = "full" | "half" | "shade";

/** In-sentence wording for the sun step's quick-pick answers. */
export const SUN_BUCKET_WORDS: Record<SunBucket, string> = {
  full: "sunny most of the day",
  half: "sun for about half the day",
  shade: "mostly shady",
};

export interface Sticky {
  /** The last spot confirmed on the location step. */
  location?: {
    mode: "gps" | "zip" | "region";
    lat?: number;
    lon?: number;
    /** Set on the hand-picked-region path instead of coordinates. */
    regionId?: string;
    savedAt: number;
  };
  /** The last quick-pick sun answer (scans are per-spot, never remembered). */
  sun?: {
    bucket: SunBucket;
    deciduous: boolean;
    savedAt: number;
  };
  /** The last answer to "how wet does this spot stay?". */
  moisture?: {
    band: MoistureBand;
    savedAt: number;
  };
}

const KEY = "sticky";

let cache: Sticky = {};
let ready: Promise<void> | null = null;

/** The remembered preferences (empty until loadSticky settles). */
export function sticky(): Sticky {
  return cache;
}

export function loadSticky(): Promise<void> {
  ready = kvGet<Sticky>(KEY)
    .then((v) => { cache = v ?? {}; })
    .catch(() => {});
  return ready;
}

/**
 * Settles once the background load has (never rejects). Steps whose initial
 * UI depends on a remembered answer await this before rendering — otherwise
 * a render racing the load (e.g. a reload that lands straight on a step)
 * silently comes up empty. The db module's own open watchdog bounds the
 * wait: a stalled IndexedDB settles this within ~2 s with nothing remembered.
 */
export function stickyReady(): Promise<void> {
  return ready ?? Promise.resolve();
}

/** Merge in newly-remembered preferences and persist in the background. */
export function rememberSticky(patch: Partial<Sticky>): void {
  cache = { ...cache, ...patch };
  void kvSet(KEY, cache).catch(() => {});
}

export function forgetSticky(key: keyof Sticky): void {
  delete cache[key];
  void kvSet(KEY, cache).catch(() => {});
}

export function forgetAllSticky(): void {
  cache = {};
  void kvSet(KEY, cache).catch(() => {});
}
