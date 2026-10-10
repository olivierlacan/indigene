// Place search: town / ZIP / postal code → coordinates, via the Open-Meteo
// geocoding API (GeoNames-backed), with postal codes going to Nominatim first
// (see `searchPlaces`). Chosen to match the app's other lookups:
// no API key, CORS-enabled from a static PWA, CC BY 4.0 data, and the same
// provider we already trust for climate normals. It resolves towns and postal
// codes — not street addresses — which is exactly the precision the rest of
// the pipeline has: soil grids, climate normals, and ecoregions are all far
// coarser than a street address anyway. The user drags the pin the last block.
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const TIMEOUT_MS = 12000;

export interface GeoPlace {
  /** Place name, e.g. "State College". */
  name: string;
  /** State / province / region, when known. */
  admin1: string | null;
  country: string | null;
  countryCode: string | null;
  lat: number;
  lon: number;
}

/** One line for a result button: "State College, Pennsylvania (United States)". */
export function placeLabel(p: GeoPlace): string {
  const where = [p.admin1, p.countryCode === "US" ? null : p.country]
    .filter(Boolean)
    .join(" — ");
  return where ? `${p.name}, ${where}` : p.name;
}

/**
 * Search for a place. Resolves to matches (possibly empty); rejects only on
 * network failure, so callers can tell "no such place" from "no signal".
 *
 * Postal codes aren't unique worldwide: 33812 is Lakeland, Florida and a
 * village in Asturias. Open-Meteo matched only the Spanish one — its GeoNames
 * index is missing many US ZIPs — and listed every village sharing the code.
 * So a query shaped like a postal code asks Nominatim's postal-code search,
 * which answers once per country, and falls back to Open-Meteo. Either way the
 * reader's own country comes first (`rankPlaces`).
 */
export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  const q = query.trim();
  let places: GeoPlace[] = [];
  if (isPostalQuery(q)) {
    // Best-effort: on failure or no match, Open-Meteo still gets its turn.
    places = await searchPostalCode(q).catch(() => []);
  }
  if (!places.length) places = await searchOpenMeteo(q);
  return rankPlaces(places, readerCountry(), -new Date().getTimezoneOffset());
}

async function searchOpenMeteo(q: string): Promise<GeoPlace[]> {
  const url =
    `${GEOCODE_URL}?name=${encodeURIComponent(q)}` +
    `&count=6&language=en&format=json`;
  const data = await getJson(url);
  const results: any[] = Array.isArray(data?.results) ? data.results : [];
  return results
    .filter((r) => typeof r?.latitude === "number" && typeof r?.longitude === "number")
    .map((r) => ({
      name: str(r.name) ?? "(unnamed place)",
      admin1: str(r.admin1),
      country: str(r.country),
      countryCode: str(r.country_code)?.toUpperCase() ?? null,
      lat: r.latitude,
      lon: r.longitude,
    }));
}

// Nominatim's structured postal-code search: one centroid per country that
// uses the code. One request per explicit search, never autocomplete — within
// the Nominatim usage policy, like `nearestPlaceName` below.
const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

async function searchPostalCode(q: string): Promise<GeoPlace[]> {
  const url =
    `${SEARCH_URL}?postalcode=${encodeURIComponent(q)}` +
    `&format=jsonv2&addressdetails=1&limit=10&accept-language=en`;
  return parsePostalResults(await getJson(url));
}

/** Nominatim postal-code results → places, named by their town or county. */
export function parsePostalResults(data: unknown): GeoPlace[] {
  const rows: any[] = Array.isArray(data) ? data : [];
  return rows.flatMap((r) => {
    const lat = Number(r?.lat);
    const lon = Number(r?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return [];
    const a = r?.address ?? {};
    const town =
      str(a.city) ?? str(a.town) ?? str(a.village) ?? str(a.suburb) ??
      str(a.hamlet) ?? str(a.municipality) ?? str(a.county);
    return [{
      name: town ?? str(a.postcode) ?? str(r?.name) ?? "(unnamed place)",
      admin1: str(a.state) ?? str(a.region),
      country: str(a.country),
      countryCode: str(a.country_code)?.toUpperCase() ?? null,
      lat,
      lon,
    }];
  });
}

/** Short, has a digit, only letters, digits, spaces and dashes: "33812",
 *  "SW1A 1AA", "H2X 1Y4", "75-011". A town name almost never fits. */
export function isPostalQuery(q: string): boolean {
  const t = q.trim();
  return t.length >= 3 && t.length <= 10 && /\d/.test(t) && /^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(t);
}

/** The country in the reader's browser language ("en-US" → "US"), if any. */
export function readerCountry(
  tags: readonly string[] = typeof navigator === "undefined"
    ? []
    : navigator.languages?.length ? navigator.languages : [navigator.language],
): string | null {
  for (const tag of tags) {
    const region = tag?.split("-").slice(1).find((p) => /^[A-Za-z]{2}$/.test(p));
    if (region) return region.toUpperCase();
  }
  return null;
}

/**
 * The reader's own country first, then the rest by how close they sit to the
 * reader's time zone (an hour is 15° of longitude). Both are read on the
 * device; nothing is looked up. Stable, so equal places keep the service's order.
 */
export function rankPlaces(
  places: GeoPlace[],
  country: string | null,
  utcOffsetMinutes: number,
): GeoPlace[] {
  const lonGuess = utcOffsetMinutes / 4;
  const away = (p: GeoPlace) => {
    const d = Math.abs(p.lon - lonGuess) % 360;
    return Math.min(d, 360 - d);
  };
  const home = (p: GeoPlace) => (country && p.countryCode === country ? 0 : 1);
  return places
    .map((p, i) => ({ p, i }))
    .sort((x, y) => home(x.p) - home(y.p) || away(x.p) - away(y.p) || x.i - y.i)
    .map(({ p }) => p);
}

async function getJson(url: string): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Reverse geocoding (coordinates → nearest town) for *display only* — no
// verdict or lookup depends on it. Open-Meteo's geocoder has no reverse
// endpoint, so this uses OSM's Nominatim — no new provider: the app already
// depends on (and credits) OpenStreetMap for its map tiles. Usage sits well
// within the Nominatim policy: one request per explicit user action, never
// polling or autocomplete. Best-effort: on any failure callers fall back to
// showing coordinates.
const REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

/** "Seattle, Washington" for a coordinate, or null when it can't be resolved. */
export async function nearestPlaceName(lat: number, lon: number): Promise<string | null> {
  // zoom=10 asks for city/town granularity — street addresses would be more
  // precision than anything downstream has.
  const url = `${REVERSE_URL}?lat=${lat}&lon=${lon}&format=jsonv2&zoom=10&accept-language=en`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const d = await res.json();
    const a = d?.address ?? {};
    const town =
      str(a.city) ?? str(a.town) ?? str(a.village) ?? str(a.hamlet) ??
      str(a.municipality) ?? str(a.county);
    const state = str(a.state) ?? str(a.region);
    if (town && state) return `${town}, ${state}`;
    return town ?? state ?? str(d?.name);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}
