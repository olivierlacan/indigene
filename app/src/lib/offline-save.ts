// Keeping a region's plant thumbnails on the device — the browser half. Which
// photos may be kept and how fast they may come is decided in
// `lib/offline-photos.ts`, where iNaturalist's own guidance is quoted.
//
// **Only from a tap.** Nothing here runs on boot, on a timer or from the worker:
// `keepPhotos` is called by the Settings card's button and nowhere else.
//
// **A cache of its own.** The kept files go in `SAVED_PHOTO_CACHE`, which the
// service worker reads first for any photo but never trims. So the browsing
// cache's 600-file limit can't evict a kept photo, and a kept region doesn't
// crowd out the photos the reader collects by browsing. Like the photo cache,
// its name is not tied to a release, so it survives every update. Removing is
// deleting that one cache.
//
// **The file as iNaturalist serves it.** The response is stored as it came:
// no resizing, no re-encoding. The rendition is the one the plant lists ask
// for on this screen (`renditionFor`), so offline they find exactly it.
import { REGIONS, loadPlants, regionForSite } from "./plants";
import type { RegionDef } from "../data/region";
import { knownRegion, knownSpot } from "../state";
import { defaultRegion, stickyReady } from "./sticky";
import { heroPhotoFor } from "./hero-photo";
import { renditionFor } from "./photo";
import { THUMB_PX } from "../components/plant-thumb";
import { estimateBytes, keepable, nextStep, type Outcome } from "./offline-photos";

/** Must match `SAVED_PHOTO_CACHE` in `public/sw.js`. */
export const SAVED_PHOTO_CACHE = "indigene-v1-saved-photos";
/** The browsing cache, read so a photo already on the device is copied, not
 *  fetched again. Must match `PHOTO_CACHE` in `public/sw.js`. */
const PHOTO_CACHE = "indigene-v1-photos";
/** When a stop lets us ask again, in localStorage. */
const HOLD_KEY = "indigene.photoHold";

/** The region this device gardens in: its spot's, else the one picked by
 *  hand, else the starting region from Settings. */
export async function ownRegion(): Promise<RegionDef | undefined> {
  await stickyReady();
  const spot = knownSpot();
  if (spot) return regionForSite(spot.lat, spot.lon) ?? undefined;
  const id = knownRegion() ?? defaultRegion();
  return REGIONS.find((r) => r.meta.id === id);
}

export interface KeepPlan {
  region: RegionDef;
  /** Every photo the region's list may keep. */
  urls: string[];
  /** Of those, the ones not kept yet. */
  missing: string[];
  /** Photos left out because of their licence or host. */
  skipped: number;
  /** Estimated bytes still to fetch. */
  bytes: number;
}

/** What keeping `region`'s thumbnails would take, from what is already kept. */
export async function planKeep(region: RegionDef): Promise<KeepPlan> {
  const plants = await loadPlants(region);
  const photos = plants.flatMap((p) => {
    const hero = heroPhotoFor(p.id, region.meta.id);
    return hero ? [{ url: renditionFor(hero.thumbUrl, THUMB_PX), license: hero.license }] : [];
  });
  const { keep, skipped } = keepable(photos);
  const urls = keep.map((p) => p.url);
  const have = await keptUrls();
  const missing = urls.filter((u) => !have.has(u));
  return { region, urls, missing, skipped, bytes: estimateBytes(missing) };
}

async function keptUrls(): Promise<Set<string>> {
  if (!("caches" in self)) return new Set();
  const cache = await caches.open(SAVED_PHOTO_CACHE);
  return new Set((await cache.keys()).map((r) => r.url));
}

/** Must match `KEEP_HEADER` in `public/sw.js`. */
const KEEP_HEADER = "x-indigene-keep";

/** When the next run may start, or 0 if it may start now. */
export function holdUntil(): number {
  try {
    const until = Number(localStorage.getItem(HOLD_KEY) ?? 0);
    return until > Date.now() ? until : 0;
  } catch {
    return 0;
  }
}

function hold(until: number): void {
  try {
    localStorage.setItem(HOLD_KEY, String(until));
  } catch {
    /* not kept: the next tap simply tries again */
  }
}

export type KeepResult = "done" | "stopped" | "refused" | "failing" | "full";

/**
 * Fetch what `plan` is missing, one at a time, and prune what the list no
 * longer has. `onProgress` hears each photo kept. Stops on `signal`, on a
 * refusal or repeated failures (holding for a day), or when storage is full.
 */
export async function keepPhotos(
  plan: KeepPlan,
  onProgress: (done: number, total: number) => void,
  signal: AbortSignal,
): Promise<KeepResult> {
  const saved = await caches.open(SAVED_PHOTO_CACHE);
  const browsing = await caches.open(PHOTO_CACHE);

  // Photos for plants that left the list, or for a region this device no
  // longer gardens in, go first.
  const want = new Set(plan.urls);
  for (const req of await saved.keys()) if (!want.has(req.url)) await saved.delete(req);

  let done = plan.urls.length - plan.missing.length;
  let failures = 0;
  for (const url of plan.missing) {
    if (signal.aborted) return "stopped";

    // Already on the device from browsing: copy it, no network.
    const hit = await browsing.match(url);
    if (hit && hit.ok && hit.type !== "opaque") {
      if (!(await put(saved, url, hit))) return "full";
      onProgress(++done, plan.urls.length);
      continue;
    }

    let outcome: Outcome;
    try {
      // The header tells the worker this one is ours to keep, so it doesn't
      // file a second copy in the browsing cache. The worker sends on a request
      // without it; with no worker there is no second copy to avoid, and no
      // header either, so nothing unusual ever reaches the bucket.
      const headers: Record<string, string> = navigator.serviceWorker?.controller ? { [KEEP_HEADER]: "1" } : {};
      const res = await fetch(url, { mode: "cors", credentials: "omit", headers });
      if (res.ok) {
        if (!(await put(saved, url, res))) return "full";
        onProgress(++done, plan.urls.length);
        outcome = { kind: "ok" };
      } else {
        const retry = Number(res.headers.get("Retry-After"));
        outcome = { kind: "status", status: res.status, retryAfterS: Number.isFinite(retry) ? retry : undefined };
      }
    } catch {
      outcome = { kind: "network" };
    }

    const step = nextStep(failures, outcome, Date.now());
    if (step.action === "stop") {
      hold(step.resumeAt);
      return step.reason;
    }
    failures = step.failures;
    await wait(step.waitMs, signal);
  }
  return "done";
}

async function put(cache: Cache, url: string, res: Response): Promise<boolean> {
  try {
    await cache.put(url, res);
    return true;
  } catch {
    return false; // over quota: keep what fitted
  }
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
  });
}

/** Remove every kept photo. The hold, if any, stays. */
export async function forgetPhotos(): Promise<void> {
  if ("caches" in self) await caches.delete(SAVED_PHOTO_CACHE);
}
