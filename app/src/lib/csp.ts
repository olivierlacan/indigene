// The Content-Security-Policy every page of the app ships with.
//
// Indigene's privacy promise is a list: the Privacy page names each service the
// browser talks to, and what it's told. Until this file that list was a
// description. This makes it a rule the browser enforces. A request to any host
// not named here is refused before it leaves the device, so even a script that
// somehow got into the page — a bad dependency, an injection we missed — has
// nowhere to send what it finds.
//
// So the two lists change together. A new lookup service means a row on the
// Privacy page (`SERVICES` in `src/steps/privacy.ts`) and a host here, in the
// same commit; forget this half and the lookup simply fails in the browser,
// which is the safe direction to be wrong in.
//
// The policy is delivered as a <meta> tag because GitHub Pages can't send
// headers. Two directives only work as headers and are absent for that reason:
// `frame-ancestors`, so another site can still frame the app (it can't read
// into the frame, but it could dress it up to steer a tap), and `report-uri`,
// which we wouldn't want anyway — a report is a request to a server we don't
// have, about a reader we don't want to know about.
//
// The inline scripts' hashes are worked out at build time (`withCsp`, called
// by the Vite config for the app and by `scripts/prerender.mjs` for 404.html),
// from the scripts as they were actually built — so editing one can never
// leave a stale hash behind. `npm run csp:check` loads the built
// app in a browser and fails on any refusal.
//
// Nothing in the app imports this: it only runs at build time.

/** Where lookups go: the services on the Privacy page, plus the page count. */
export const CONNECT_HOSTS: readonly string[] = [
  "https://api.inaturalist.org", // photos, sightings, how common a plant is
  "https://api.open-meteo.com", // elevation fallback
  "https://archive-api.open-meteo.com", // rainfall and winter cold
  "https://geocoding-api.open-meteo.com", // a postal code or town, to a point
  "https://nominatim.openstreetmap.org", // the nearest town's name
  "https://rest.isric.org", // soil
  "https://epqs.nationalmap.gov", // elevation and slope (USGS)
  "https://gispub.epa.gov", // ecoregion, North America (US EPA)
  "https://bio.discomap.eea.europa.eu", // biogeographical region, Europe (EEA)
  "https://services.arcgis.com", // ecoregion, south of the equator (RESOLVE, hosted by Esri)
  "https://cdn.usefathom.com", // the page count (lib/analytics.ts)
];

/** Where pictures come from: iNaturalist's photo hosts and the map tiles. */
export const IMG_HOSTS: readonly string[] = [
  "https://inaturalist-open-data.s3.amazonaws.com",
  "https://static.inaturalist.org",
  "https://tile.openstreetmap.org",
  "https://cdn.usefathom.com",
];

/** The one outside script: the page count, and only when it's allowed to load
 *  at all (`startAnalytics`). */
export const SCRIPT_HOSTS: readonly string[] = ["https://cdn.usefathom.com"];

/**
 * The policy, given the hashes (`sha256-…`) of the page's inline scripts.
 *
 * `style-src` allows inline styles because the app sets `style` attributes as
 * it draws (`el(…, { style })`). Styles can't run code or make a request past
 * `img-src`, so that opening can restyle a page but can't read or send it.
 */
export function contentSecurityPolicy(scriptHashes: readonly string[] = []): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...scriptHashes.map((h) => `'${h}'`), ...SCRIPT_HOSTS],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...IMG_HOSTS],
    "connect-src": ["'self'", ...CONNECT_HOSTS],
    "font-src": ["'self'"],
    "worker-src": ["'self'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
  };
  return Object.entries(directives)
    .map(([name, sources]) => `${name} ${sources.join(" ")}`)
    .join("; ");
}

/**
 * A built page with its policy stamped in, hashing whichever inline scripts it
 * carries, replacing any policy it already has. The tag goes straight after `<meta charset>`, because a policy only
 * covers what comes after it in the document.
 *
 * Web Crypto rather than Node's, so this runs in the Vite config and in the
 * prerender's module loader alike without either needing Node's types.
 */
export async function withCsp(html: string): Promise<string> {
  const charset = /<meta charset="utf-8"\s*\/?>/i;
  if (!charset.test(html)) throw new Error("csp: page has no <meta charset> to put the policy after");
  // Re-stamping replaces rather than stacks: a prerender run twice over the
  // same dist/ must not leave two policies (the browser would enforce both).
  html = html.replace(/\n?[ \t]*<meta http-equiv="Content-Security-Policy"[^>]*>/g, "");
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const hashes = await Promise.all(inline.map(sha256));
  const tag = `<meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(hashes)}" />`;
  return html.replace(charset, (m) => `${m}\n    ${tag}`);
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;
}
