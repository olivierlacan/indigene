// Pulls what we can know about a spot from its coordinates. Every source is
// best-effort: a failure degrades to null rather than blocking the flow, and
// the confirm screen lets the user correct anything. Soil especially is always
// presented as "the map says…", never as measured fact (see honesty rules).
import type { EcoregionInfo, SiteData } from "../types";

const TIMEOUT_MS = 12000;

async function fetchJson(url: string, opts: RequestInit = {}): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSite(lat: number, lon: number): Promise<SiteData> {
  const [soil, elev, climate, eco] = await Promise.all([
    fetchSoil(lat, lon).catch(() => null),
    fetchElevationSlope(lat, lon).catch(() => null),
    fetchClimate(lat, lon).catch(() => null),
    fetchEcoregion(lat, lon).catch(() => null),
  ]);

  return {
    lat,
    lon,
    elevationFt: elev?.elevationFt ?? null,
    slopeDeg: elev?.slopeDeg ?? null,
    zone: climate?.zone ?? null,
    zoneMinTempF: climate?.minTempF ?? null,
    annualRainIn: climate?.annualRainIn ?? null,
    soil: soil ?? {
      texture: null,
      drainage: null,
      phEstimate: null,
      source: "unavailable",
      confidence: "unknown",
    },
    ecoregion: ecoregionLabel(eco, lat, lon),
    ecoregionInfo: eco,
    fromCache: false,
  };
}

// --- Soil: ISRIC SoilGrids (global, CORS-enabled). Coarse by nature. ---
async function fetchSoil(lat: number, lon: number): Promise<SiteData["soil"]> {
  const url =
    `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${lat}&lon=${lon}` +
    `&property=sand&property=silt&property=clay&property=phh2o&depth=0-5cm&value=mean`;
  const data = await fetchJson(url);
  const layers: any[] = data?.properties?.layers ?? [];
  const mean = (name: string): number | null => {
    const layer = layers.find((l) => l.name === name);
    const v = layer?.depths?.[0]?.values?.mean;
    const factor = layer?.unit_measure?.d_factor ?? 1;
    return v == null ? null : v / factor;
  };
  const sand = mean("sand");
  const silt = mean("silt");
  const clay = mean("clay");
  const ph = mean("phh2o");
  const texture =
    sand != null && silt != null && clay != null
      ? textureClass(sand, silt, clay)
      : null;
  return {
    texture,
    drainage: texture ? drainageFor(texture) : null,
    phEstimate: ph != null ? round1(ph) : null,
    source: "ISRIC SoilGrids (250 m grid)",
    confidence: "coarse",
  };
}

// USDA soil texture triangle → class name. Inputs are percentages.
export function textureClass(sand: number, silt: number, clay: number): string {
  const total = sand + silt + clay || 1;
  const s = (sand / total) * 100;
  const si = (silt / total) * 100;
  const c = (clay / total) * 100;
  if (c >= 40 && si < 40 && s <= 45) return "clay";
  if (c >= 35 && s >= 45) return "sandy clay";
  if (c >= 40 && si >= 40) return "silty clay";
  if (c >= 27 && s <= 20) return "silty clay loam";
  if (c >= 27 && s > 20 && s <= 45) return "clay loam";
  if (c >= 20 && c < 35 && s > 45 && si < 28) return "sandy clay loam";
  if (si >= 80 && c < 12) return "silt";
  if (si >= 50 && c < 27) return "silt loam";
  if (s >= 85) return "sand";
  if (s >= 70) return "loamy sand";
  if (c < 20 && s >= 43 && si < 50) return "sandy loam";
  return "loam";
}

function drainageFor(texture: string): string {
  if (/sand/.test(texture)) return "drains fast (well drained)";
  if (/clay/.test(texture)) return "drains slowly (can stay wet)";
  return "moderate drainage";
}

// --- Elevation & slope: a small cross of points, differenced for slope. ---
// USGS 3DEP (EPQS) is the best source but conterminous-US only, so outside it
// we fall back to Open-Meteo's global elevation API. Both return heights in feet
// here (Open-Meteo is converted from metres), so the slope math is identical.
async function fetchElevationSlope(
  lat: number,
  lon: number
): Promise<{ elevationFt: number | null; slopeDeg: number | null }> {
  const d = 0.0003; // ~33 m
  const points: [number, number][] = [
    [lat, lon],
    [lat + d, lon],
    [lat - d, lon],
    [lat, lon + d],
    [lat, lon - d],
  ];
  const heights = inConus(lat, lon)
    ? await epqsCross(points)
    : await openMeteoElevCross(points);
  const [center, n, s, e, w] = heights;
  let slopeDeg: number | null = null;
  if (n != null && s != null && e != null && w != null) {
    const spanM = 2 * d * 111320; // deg latitude → metres
    const dz = Math.hypot(n - s, e - w);
    slopeDeg = round1((Math.atan2(dz, spanM) * 180) / Math.PI);
  }
  return { elevationFt: center != null ? Math.round(center) : null, slopeDeg };
}

// USGS EPQS, one query per point (US only). Feet.
async function epqsCross(points: [number, number][]): Promise<(number | null)[]> {
  const results = await Promise.allSettled(points.map(([la, lo]) => epqs(la, lo)));
  return results.map((r) => (r.status === "fulfilled" ? r.value : null));
}

async function epqs(lat: number, lon: number): Promise<number | null> {
  const url = `https://epqs.nationalmap.gov/v1/json?x=${lon}&y=${lat}&units=Feet&wkid=4326&includeDate=false`;
  const data = await fetchJson(url);
  const v = data?.value ?? data?.elevation;
  const num = typeof v === "string" ? parseFloat(v) : v;
  return typeof num === "number" && !Number.isNaN(num) ? num : null;
}

// Open-Meteo elevation (global, keyless): all five points in one call. Returns
// metres, converted to feet so the shared slope math is unit-consistent.
const M_TO_FT = 3.28084;
async function openMeteoElevCross(points: [number, number][]): Promise<(number | null)[]> {
  const lats = points.map((p) => p[0]).join(",");
  const lons = points.map((p) => p[1]).join(",");
  try {
    const data = await fetchJson(
      `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lons}`
    );
    const arr: unknown[] = Array.isArray(data?.elevation) ? data.elevation : [];
    return points.map((_, i) => (typeof arr[i] === "number" ? (arr[i] as number) * M_TO_FT : null));
  } catch {
    return points.map(() => null);
  }
}

// --- Climate normals → hardiness zone + annual rainfall (Open-Meteo, no key) ---
async function fetchClimate(
  lat: number,
  lon: number
): Promise<{ zone: string; minTempF: number; annualRainIn: number } | null> {
  const url =
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
    `&start_date=2021-01-01&end_date=2024-12-31` +
    `&daily=temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`;
  const data = await fetchJson(url);
  const days: string[] = data?.daily?.time ?? [];
  const tmin: number[] = data?.daily?.temperature_2m_min ?? [];
  const precip: number[] = data?.daily?.precipitation_sum ?? [];
  if (!days.length) return null;

  const yearMin: Record<string, number> = {};
  const yearRain: Record<string, number> = {};
  days.forEach((day, i) => {
    const y = day.slice(0, 4);
    if (typeof tmin[i] === "number")
      yearMin[y] = Math.min(yearMin[y] ?? Infinity, tmin[i]);
    if (typeof precip[i] === "number")
      yearRain[y] = (yearRain[y] ?? 0) + precip[i];
  });
  const mins = Object.values(yearMin).filter(Number.isFinite);
  const rains = Object.values(yearRain).filter(Number.isFinite);
  if (!mins.length) return null;
  const avgMin = mins.reduce((a, b) => a + b, 0) / mins.length;
  const annualRainIn = rains.length
    ? Math.round(rains.reduce((a, b) => a + b, 0) / rains.length)
    : 0;
  return { zone: zoneFromMinTemp(avgMin), minTempF: Math.round(avgMin), annualRainIn };
}

// Average annual extreme-minimum temperature → USDA hardiness zone, the same
// definition USDA uses. 10°F per zone, split a/b at the midpoint.
export function zoneFromMinTemp(tF: number): string {
  const n = Math.floor((tF + 60) / 10) + 1;
  const within = tF + 60 - (n - 1) * 10;
  const half = within < 5 ? "a" : "b";
  return `${clampInt(n, 1, 13)}${half}`;
}

// --- Ecoregion: a real, provider-tagged classification via ArcGIS point query.
// Two public services, picked by where the point is: US EPA (Omernik) for the
// conterminous US (public domain), and EEA Biogeographical Regions of Europe for
// Europe (CC-BY 4.0). Both are best-effort — on any failure (offline, CORS, a
// coastline point that hits no polygon, outside coverage) we fall back to the
// coarse box guess below, and region *selection* still works from the box alone.
// See docs/ecoregion-plan.md and docs/france-localization-plan.md.
async function fetchEcoregion(
  lat: number,
  lon: number
): Promise<EcoregionInfo | null> {
  if (inEurope(lat, lon)) return fetchEcoregionEEA(lat, lon);
  if (inConus(lat, lon)) return fetchEcoregionEPA(lat, lon);
  return null;
}

// Rough coverage boxes that pick which service to ask (and, for elevation, which
// height source). They only route the request — the polygon query is what's
// authoritative; a miss falls back to the box guess.
export function inConus(lat: number, lon: number): boolean {
  return lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66;
}
export function inEurope(lat: number, lon: number): boolean {
  return lat >= 34 && lat <= 72 && lon >= -25 && lon <= 45;
}

// EPA Omernik: one point-in-polygon query on the Level IV layer returns the full
// Level I–IV hierarchy in one call.
const EPA_ECOREGION_QUERY_URL =
  "https://gispub.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer/7/query";

async function fetchEcoregionEPA(lat: number, lon: number): Promise<EcoregionInfo | null> {
  const url =
    `${EPA_ECOREGION_QUERY_URL}?geometry=${lon},${lat}&geometryType=esriGeometryPoint` +
    `&inSR=4326&spatialRel=esriSpatialRelIntersects` +
    `&outFields=US_L4CODE,US_L4NAME,US_L3CODE,US_L3NAME,NA_L2NAME,NA_L1NAME` +
    `&returnGeometry=false&f=json`;
  const data = await fetchJson(url);
  return parseEcoregion(data);
}

// Pure parser for the EPA ArcGIS response, split out so it can be tested without
// the network. Requires at least a Level III name+code; anything less is treated
// as no result. The Level I/II roll-ups arrive in ALL CAPS, so we title-case
// them for display; the US Level III/IV names are already title case.
export function parseEcoregion(data: any): EcoregionInfo | null {
  const attrs = data?.features?.[0]?.attributes;
  if (!attrs) return null;
  const name = str(attrs.US_L3NAME);
  const code = str(attrs.US_L3CODE);
  if (!name || !code) return null;
  const l4Code = str(attrs.US_L4CODE);
  const l4Name = str(attrs.US_L4NAME);
  return {
    provider: "epa-omernik",
    code,
    name,
    hierarchy: [toTitle(str(attrs.NA_L1NAME)), toTitle(str(attrs.NA_L2NAME))].filter(
      (s): s is string => !!s
    ),
    detail: l4Code && l4Name ? { code: l4Code, name: l4Name } : null,
  };
}

// EEA Biogeographical Regions of Europe (2016), served from the EEA ArcGIS host.
// The layer is a single flat set of large regions (Atlantic, Continental,
// Alpine, Mediterranean…). We ask for all fields and scan them, because the
// exact field name for the region varies by service version — the values are
// distinctive enough to recognize by name. (Field id / layer number to be
// confirmed against the live service in a browser, like the EPA path was.)
const EEA_ECOREGION_QUERY_URL =
  "https://bio.discomap.eea.europa.eu/arcgis/rest/services/BioRegions/BiogeographicalRegions_WM/MapServer/0/query";

async function fetchEcoregionEEA(lat: number, lon: number): Promise<EcoregionInfo | null> {
  const url =
    `${EEA_ECOREGION_QUERY_URL}?geometry=${lon},${lat}&geometryType=esriGeometryPoint` +
    `&inSR=4326&spatialRel=esriSpatialRelIntersects` +
    `&outFields=*&returnGeometry=false&f=json`;
  const data = await fetchJson(url);
  return parseEcoregionEEA(data);
}

// The eleven EEA biogeographical regions, canonicalized from whatever spelling
// the service returns to a stable slug (the selection code) and a clean name.
const EEA_REGIONS: { slug: string; name: string; match: RegExp }[] = [
  { slug: "alpine", name: "Alpine", match: /alpine/ },
  { slug: "atlantic", name: "Atlantic", match: /atlantic/ },
  { slug: "black-sea", name: "Black Sea", match: /black\s*sea/ },
  { slug: "boreal", name: "Boreal", match: /boreal/ },
  { slug: "continental", name: "Continental", match: /continental/ },
  { slug: "mediterranean", name: "Mediterranean", match: /mediterran/ },
  { slug: "pannonian", name: "Pannonian", match: /pannonian/ },
  { slug: "steppic", name: "Steppic", match: /steppic/ },
  { slug: "arctic", name: "Arctic", match: /arctic/ },
  { slug: "anatolian", name: "Anatolian", match: /anatolian/ },
  { slug: "macaronesia", name: "Macaronesia", match: /macaronesia/ },
];

// Pure parser for the EEA response — scans attribute values for a recognizable
// region name, so it survives field-name differences between service versions.
export function parseEcoregionEEA(data: any): EcoregionInfo | null {
  const attrs = data?.features?.[0]?.attributes;
  if (!attrs) return null;
  for (const v of Object.values(attrs)) {
    const s = str(typeof v === "string" ? v : v == null ? null : String(v));
    if (!s) continue;
    const low = s.toLowerCase();
    const hit = EEA_REGIONS.find((r) => r.match.test(low));
    if (hit) {
      return { provider: "eea-biogeo", code: hit.slug, name: hit.name, hierarchy: [], detail: null };
    }
  }
  return null;
}

// Display label: the real region name plus which classification it came from,
// or the coarse box guess when the live lookup failed.
export function ecoregionLabel(
  info: EcoregionInfo | null,
  lat: number,
  lon: number
): string | null {
  if (info) {
    const suffix =
      info.provider === "eea-biogeo" ? "EEA biogeographical region" : "EPA Level III ecoregion";
    return `${info.name} (${suffix})`;
  }
  return ecoregionGuess(lat, lon);
}

// Coarse fallback used only when the live lookup fails. Asserts just the broad
// region a point plausibly falls in, matched to the areas we carry plant lists
// for, and always marked "(broad)".
function ecoregionGuess(lat: number, lon: number): string | null {
  if (lat >= 42 && lat <= 49 && lon >= -124.9 && lon <= -120.5) {
    return "Marine West Coast Forest (broad)";
  }
  if (lat >= 24.4 && lat < 27.2 && lon >= -82.5 && lon <= -79.9) {
    return "Southern Florida Coastal Plain (broad)";
  }
  if (lat >= 27.2 && lat <= 31 && lon >= -87.7 && lon <= -79.8) {
    return "Southern Coastal Plain (broad)";
  }
  if (lat >= 24 && lat <= 49 && lon >= -100 && lon <= -66) {
    return "Eastern Temperate Forest (broad)";
  }
  // Metropolitan France, coarse: the Mediterranean south vs the Atlantic
  // west/north. Offline label only — selection still uses the box + live code.
  if (inEurope(lat, lon)) {
    if (lat <= 44.2 && lon >= 2.5 && lon <= 10.0) return "Mediterranean (broad)";
    if (lat >= 42.5 && lat <= 51.6 && lon >= -5.5 && lon <= 8.5) return "Atlantic (broad)";
  }
  return null;
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return v == null ? null : String(v).trim() || null;
  const t = v.trim();
  return t.length ? t : null;
}

function toTitle(s: string | null): string | null {
  if (!s) return null;
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}
function clampInt(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.round(x)));
}
