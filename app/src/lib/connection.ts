// Are we online — and has the reader asked to pretend we aren't?
//
// Offline is a real mode of this app (the far end of a garden is where the
// signal goes), so it gets two things: a header that looks different for as
// long as it lasts, and a switch in Settings to try it without hunting for
// airplane mode. The switch is honest about what it does: every cross-origin
// request (the EPA, iNaturalist, GBIF, the town search, map tiles fetched by
// script) fails exactly as it would with no signal. Same-origin files still
// load — offline, the service worker hands those over from its cache anyway.
//
// Like the spooky theme (`lib/halloween.ts`), the verdict is stamped on
// `<html>` as `data-offline` by a script in `index.html`, so the first paint
// already has the offline header. Everything else reads it back from here.

export const OFFLINE_KEY = "indigene:offline";

/** Has the reader turned on "pretend offline" in Settings? */
export function forcedOffline(): boolean {
  try {
    return localStorage.getItem(OFFLINE_KEY) === "on";
  } catch {
    return false;
  }
}

/** Use this, not `navigator.onLine`: false when the device is offline *or*
 *  the reader has switched offline on. */
export function isOnline(): boolean {
  return navigator.onLine && !forcedOffline();
}

const listeners = new Set<() => void>();

/** Call `fn` whenever `isOnline()` may have changed. Returns the way to stop. */
export function onConnectionChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function changed(): void {
  document.documentElement.toggleAttribute("data-offline", !isOnline());
  for (const fn of listeners) fn();
}

/** Turn "pretend offline" on or off, remember it, and update at once. */
export function setForcedOffline(on: boolean): void {
  try {
    if (on) localStorage.setItem(OFFLINE_KEY, "on");
    else localStorage.removeItem(OFFLINE_KEY);
  } catch {
    /* no storage: the choice can't be kept, so it can't be turned on either */
  }
  changed();
}

/**
 * Should `fetch` refuse this request because we're pretending to be offline?
 * Only cross-origin ones: the app's own files come from the service worker's
 * cache when the signal is really gone, so they keep loading here too.
 */
export function blockedWhileForced(url: string, origin = location.origin): boolean {
  try {
    return new URL(url, origin).origin !== origin;
  } catch {
    return false;
  }
}

/** Wire it all up once, on boot: the device's own online/offline events, and
 *  a `fetch` that fails the way no signal fails while the switch is on. */
export function initConnection(): void {
  window.addEventListener("online", changed);
  window.addEventListener("offline", changed);
  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (forcedOffline() && blockedWhileForced(url)) {
      return Promise.reject(new TypeError("Offline (switched on in Settings)"));
    }
    return realFetch(input, init);
  };
  changed();
}
