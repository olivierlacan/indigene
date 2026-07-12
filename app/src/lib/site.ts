// Pulls what we can know about a spot from its coordinates. Every source is
// best-effort: a failure degrades to null rather than blocking the flow, and
// the confirm screen lets the user correct anything. Soil especially is always
// presented as "the map says…", never as measured fact (see honesty rules).
import type { SiteData } from "../types";

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
  const [soil, elev, climate] = await Promise.all([
    fetchSoil(lat, lon).catch(() => null),
    fetchElevationSlope(lat, lon).catch(() => null),
    fetchClimate(lat, lon).catch(() => null),
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
    ecoregion: ecoregionGuess(lat, lon),
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

// --- Elevation & slope: USGS 3DEP point query, with a small cross for slope ---
async function fetchElevationSlope(
  lat: number,
  lon: number
): Promise<{ elevationFt: number | null; slopeDeg: number | null }> {
  const d = 0.0003; // ~33 m
  const points = [
    [lat, lon],
    [lat + d, lon],
    [lat - d, lon],
    [lat, lon + d],
    [lat, lon - d],
  ];
  const results = await Promise.allSettled(
    points.map(([la, lo]) => epqs(la, lo))
  );
  const val = (i: number): number | null =>
    results[i].status === "fulfilled"
      ? (results[i] as PromiseFulfilledResult<number | null>).value
      : null;
  const center = val(0);
  const n = val(1),
    s = val(2),
    e = val(3),
    w = val(4);
  let slopeDeg: number | null = null;
  if (n != null && s != null && e != null && w != null) {
    const spanM = 2 * d * 111320; // deg latitude → metres
    const dz = Math.hypot(n - s, e - w);
    slopeDeg = round1((Math.atan2(dz, spanM) * 180) / Math.PI);
  }
  return { elevationFt: center != null ? Math.round(center) : null, slopeDeg };
}

async function epqs(lat: number, lon: number): Promise<number | null> {
  const url = `https://epqs.nationalmap.gov/v1/json?x=${lon}&y=${lat}&units=Feet&wkid=4326&includeDate=false`;
  const data = await fetchJson(url);
  const v = data?.value ?? data?.elevation;
  const num = typeof v === "string" ? parseFloat(v) : v;
  return typeof num === "number" && !Number.isNaN(num) ? num : null;
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

// Coarse ecoregion label. A real EPA Level III/IV lookup is a Phase-2 item; for
// now we assert only the broad region a point plausibly falls in, matched to the
// areas we carry plant lists for, and always mark it "(broad)".
function ecoregionGuess(lat: number, lon: number): string | null {
  if (lat >= 42 && lat <= 49 && lon >= -124.9 && lon <= -120.5) {
    return "Marine West Coast Forest (broad)";
  }
  if (lat >= 24 && lat <= 49 && lon >= -100 && lon <= -66) {
    return "Eastern Temperate Forest (broad)";
  }
  return null;
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}
function clampInt(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.round(x)));
}
