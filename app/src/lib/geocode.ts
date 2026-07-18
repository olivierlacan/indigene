// Place search: town / ZIP / postal code → coordinates, via the Open-Meteo
// geocoding API (GeoNames-backed). Chosen to match the app's other lookups:
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
 */
export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  const url =
    `${GEOCODE_URL}?name=${encodeURIComponent(query.trim())}` +
    `&count=6&language=en&format=json`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
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
  } finally {
    clearTimeout(timer);
  }
}

// Reverse geocoding (coordinates → nearest town) for *display only* — no
// verdict or lookup depends on it. Open-Meteo has no reverse endpoint, so
// this uses BigDataCloud's free client-side reverse geocoder (no key, CORS,
// explicitly offered for browser use). Best-effort: on any failure callers
// fall back to showing coordinates.
const REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

/** "Seattle, Washington" for a coordinate, or null when it can't be resolved. */
export async function nearestPlaceName(lat: number, lon: number): Promise<string | null> {
  const url = `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const d = await res.json();
    const town = str(d?.city) ?? str(d?.locality);
    const state = str(d?.principalSubdivision);
    if (town && state) return `${town}, ${state}`;
    return town ?? state;
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
