/*
 * Hand-written service worker. No Workbox — the caching rules are meant to be
 * readable and predictable. A small post-build script
 * (scripts/inject-sw-precache.mjs) fills the two placeholders below with this
 * deploy's exact file list and a build id; the logic here is still the whole
 * story.
 *
 * Strategy:
 *   - The shell (index.html AND its hashed CSS/JS) is precached atomically at
 *     install, in a cache versioned per build. This is what keeps a
 *     backgrounded tab styled: iOS evicts and re-fetches resources on resume,
 *     and a deploy in the meantime purges the old hashed files from the
 *     server — so the copy in the cache is the only reliable one.
 *   - No skipWaiting/clients.claim: a new worker waits until every tab from
 *     the old deploy is gone, so caches are never yanked out from under a
 *     running page.
 *   - Navigations: network-first (fresh HTML whenever online), and successful
 *     responses refresh the cached shell so offline boot tracks reality.
 *   - Site-data API calls (soil, elevation, climate, geocoding): network-first,
 *     every success cached, in a cache whose name NEVER changes across builds —
 *     "a spot you looked up once works forever offline" survives deploys.
 *
 * The seed plant database is bundled into the app JS, so it is covered by the
 * shell precache and needs no special handling.
 */

// Filled in by scripts/inject-sw-precache.mjs after `vite build`. In dev the
// placeholders survive (the app only registers the worker in production
// builds) and the worker degrades to runtime caching only.
const BUILD_ID = "%BUILD_ID%";
const PRECACHE_RAW = "%PRECACHE%";

const BUILD = BUILD_ID.startsWith("%") ? "dev" : BUILD_ID;
const PRECACHED = Array.isArray(PRECACHE_RAW) ? PRECACHE_RAW : [];

const SHELL_CACHE = `indigene-shell-${BUILD}`;
// Deliberately the same name the first release used, and never versioned:
// deploys must not throw away people's looked-up spots.
const DATA_CACHE = "indigene-v1-data";

// The app may be served from a subpath (e.g. GitHub Pages /<repo>/). This
// worker always sits at the app root, so derive the base from its own URL.
const BASE = new URL("./", self.location.href).pathname;

const SHELL_ASSETS = [BASE, ...PRECACHED.map((p) => BASE + p)];

// Hosts whose GET responses we cache for offline reuse of a looked-up spot.
const DATA_HOSTS = [
  "rest.isric.org",
  "epqs.nationalmap.gov",
  "api.open-meteo.com",
  "archive-api.open-meteo.com",
  "geocoding-api.open-meteo.com",
  "nominatim.openstreetmap.org",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL_ASSETS))
      .catch(() => {}) // a failed fetch must not block install; runtime caching self-heals
  );
});

self.addEventListener("activate", (event) => {
  // By the time this runs, no page from an older deploy exists (no
  // skipWaiting), so dropping the old shell caches is safe. The data cache is
  // kept by name, always.
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== DATA_CACHE)
            .map((k) => caches.delete(k))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Navigations: fresh HTML when online (and refresh the cached shell with
  // it); the cached shell when not.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(`${BASE}index.html`, copy));
          }
          return res;
        })
        .catch(() =>
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

  // Same-origin app assets: cache-first. Hashed filenames are immutable, and
  // the un-hashed few (icons, manifest) are precached fresh with every build.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
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

async function cacheFirst(request) {
  // Global match (not just this build's cache) is deliberate forgiveness: in
  // any transition window, an older cache generation may still hold the file.
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) {
    const copy = res.clone();
    caches.open(SHELL_CACHE).then((c) => c.put(request, copy));
  }
  return res;
}
