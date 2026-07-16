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
 *
 * The seed plant database is bundled into the app JS, so it is covered by the
 * shell cache and needs no special handling.
 */
const VERSION = "indigene-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;

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
];

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
