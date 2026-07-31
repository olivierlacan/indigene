/*
 * Hand-written service worker. No Workbox, no generated precache manifest —
 * the caching rules are meant to be readable and predictable.
 *
 * Strategy:
 *   - App shell + built assets: stale-while-revalidate (instant, self-healing).
 *   - Navigations: serve the cached shell so the app boots offline.
 *   - Site-data API calls (soil, elevation, climate): network-first, but every
 *     successful response is cached so a spot you looked up once works forever
 *     offline. This is the promise the product makes: "every result cached".
 *   - iNaturalist photos: cache-first, and kept. A photo's URL names one photo
 *     at one size forever (`…/photos/<id>/medium.jpg`), so there is nothing to
 *     revalidate — once you have it, it is the answer. Re-opening a plant page
 *     you already looked up shows its sightings instantly and offline, instead
 *     of re-downloading a screenful of JPEGs. Bounded, because they're the
 *     largest thing we keep: oldest out past PHOTO_CACHE_LIMIT.
 *
 * The seed plant database is bundled into the app JS, so it is covered by the
 * shell cache and needs no special handling.
 */
const VERSION = "indigene-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;
const PHOTO_CACHE = `${VERSION}-photos`;

// The app may be served from a subpath (e.g. GitHub Pages /<repo>/). This
// worker always sits at the app root, so derive the base from its own URL.
const BASE = new URL("./", self.location.href).pathname;

const SHELL_ASSETS = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icons/icon-192.png`,
  `${BASE}icons/icon-512.png`,
];

// Hosts whose GET responses we cache for offline reuse of a looked-up spot.
const DATA_HOSTS = [
  "rest.isric.org",
  "epqs.nationalmap.gov",
  "api.open-meteo.com",
  "archive-api.open-meteo.com",
  "geocoding-api.open-meteo.com",
  "nominatim.openstreetmap.org",
];

// Where iNaturalist serves observation photos from. The open-data bucket holds
// the CC-licensed ones (everything we display); `static.inaturalist.org` is the
// older path some photos still resolve through.
const PHOTO_HOSTS = ["inaturalist-open-data.s3.amazonaws.com", "static.inaturalist.org"];

/** How many photo files to keep. A thumbnail is a few KB and a lightbox-sized
 *  one a few hundred, so ~40 MB worst case — generous for the feature, and far
 *  from the quota a phone will give a PWA. Past it, the oldest go first. */
const PHOTO_CACHE_LIMIT = 240;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL_ASSETS))
      .catch(() => {}) // a missing asset must not block install
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Navigations: shell-first so the app opens with no network.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(`${BASE}index.html`).then((r) => r || caches.match(BASE))
      )
    );
    return;
  }

  // Looked-up site data: network-first, fall back to cache.
  if (DATA_HOSTS.includes(url.hostname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // iNaturalist photos: cache-first. Immutable by URL, so a hit is final.
  if (PHOTO_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Same-origin app assets: stale-while-revalidate.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(
      JSON.stringify({ error: "offline", cached: false }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Cache-first, for responses that can never change. On a hit we never touch the
 * network; on a miss we fetch, store, and trim. A failed fetch is returned as it
 * is (not swallowed) so the <img> falls back to its alt text.
 *
 * **Asked for with CORS, deliberately.** An `<img>` requests no-cors, and a
 * no-cors cross-origin response is *opaque*: unreadable, and — the part that
 * bites — quota-padded. Chromium charges roughly 7 MB against the origin quota
 * for each opaque entry regardless of its real size, so a couple of hundred
 * thumbnails exhausts the quota and every later `put` starts throwing. Since
 * iNaturalist's photo bucket answers with `Access-Control-Allow-Origin: *`, we
 * re-issue the request in cors mode and store the real, unpadded response. A
 * host that doesn't allow CORS falls back to the opaque one, which still works
 * — just expensively, which is what the quota guard below is for.
 */
async function cacheFirst(request) {
  const cache = await caches.open(PHOTO_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  let res;
  try {
    res = await fetch(new Request(request.url, { mode: "cors", credentials: "omit" }));
    if (!res.ok) throw new Error(`photo ${res.status}`);
  } catch {
    res = await fetch(request); // no CORS (or a real failure) — take what we get
  }
  if (res.ok || res.type === "opaque") await store(cache, request, res.clone());
  return res;
}

/**
 * Put one entry in, keeping the cache inside both of its budgets: our own entry
 * count, and the browser's storage quota. A quota rejection is not an error
 * worth surfacing — the photo still displays, it just isn't kept — but it *is*
 * worth reacting to, so we drop the oldest quarter and try once more. Without
 * that, a cache that fills once stays full and never accepts another photo.
 */
async function store(cache, request, response) {
  try {
    await cache.put(request, response);
  } catch {
    await trimCache(cache, Math.floor(PHOTO_CACHE_LIMIT * 0.75));
    try {
      await cache.put(request, response);
    } catch {
      return; // still no room: show it, don't keep it
    }
  }
  await trimCache(cache, PHOTO_CACHE_LIMIT);
}

/** Keep a cache under `limit` entries, dropping the oldest first. `keys()`
 *  returns them in insertion order, so the front of the list is the oldest. */
async function trimCache(cache, limit) {
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(keys.slice(0, keys.length - limit).map((k) => cache.delete(k)));
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(SHELL_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}
