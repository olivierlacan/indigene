// Solar geometry, computed locally so the app works with no network.
// This is a compact port of NOAA's solar-position algorithm. We compute the
// sun's altitude and azimuth, then integrate how many minutes of the day the
// sun clears the scanned horizon, averaged across the growing season.
import type { HorizonMask, SunEstimate } from "../types";
import { sunLabel } from "./plain";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export interface SunPos {
  /** Degrees above the horizon (negative = below). */
  altitude: number;
  /** Degrees clockwise from true north (0=N, 90=E, 180=S, 270=W). */
  azimuth: number;
}

/** Sun position for a UTC instant at a given lat/lon. */
export function sunPosition(date: Date, latDeg: number, lonDeg: number): SunPos {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;

  const L0 = mod360(280.46646 + T * (36000.76983 + T * 0.0003032));
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const Mr = M * D2R;
  const C =
    Math.sin(Mr) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * Mr) * (0.019993 - 0.000101 * T) +
    Math.sin(3 * Mr) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(omega * D2R);
  const epsilon0 =
    23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const epsilon = epsilon0 + 0.00256 * Math.cos(omega * D2R);

  const decl =
    Math.asin(Math.sin(epsilon * D2R) * Math.sin(appLong * D2R)) * R2D;

  const y = Math.tan((epsilon / 2) * D2R) ** 2;
  const eqTime =
    4 *
    R2D *
    (y * Math.sin(2 * L0 * D2R) -
      2 * e * Math.sin(Mr) +
      4 * e * y * Math.sin(Mr) * Math.cos(2 * L0 * D2R) -
      0.5 * y * y * Math.sin(4 * L0 * D2R) -
      1.25 * e * e * Math.sin(2 * Mr));

  const utcMinutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60;
  const trueSolarTime = mod(utcMinutes + eqTime + 4 * lonDeg, 1440);
  let hourAngle = trueSolarTime / 4 - 180;
  if (hourAngle < -180) hourAngle += 360;

  const latR = latDeg * D2R;
  const declR = decl * D2R;
  const haR = hourAngle * D2R;
  const cosZen =
    Math.sin(latR) * Math.sin(declR) +
    Math.cos(latR) * Math.cos(declR) * Math.cos(haR);
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZen)));
  const altitude = 90 - zenith * R2D;

  let az: number;
  const denom = Math.cos(latR) * Math.sin(zenith);
  if (Math.abs(denom) < 1e-8) {
    az = altitude > 0 ? 180 : 0;
  } else {
    const cosAz =
      (Math.sin(declR) - Math.sin(latR) * Math.cos(zenith)) / denom;
    const a = Math.acos(Math.min(1, Math.max(-1, cosAz))) * R2D;
    az = hourAngle > 0 ? 360 - a : a;
  }
  return { altitude, azimuth: mod(az, 360) };
}

/** Horizon elevation angle (deg) at a compass bearing, linearly interpolated. */
export function horizonAngleAt(mask: HorizonMask, azimuth: number): number {
  const n = mask.angles.length;
  if (n === 0) return 0;
  const step = 360 / n;
  const idx = mod(azimuth, 360) / step;
  const i0 = Math.floor(idx) % n;
  const i1 = (i0 + 1) % n;
  const f = idx - Math.floor(idx);
  return mask.angles[i0] * (1 - f) + mask.angles[i1] * f;
}

/**
 * Average direct-sun hours per day across the growing season, at this exact
 * spot, given the horizon mask. Returns an estimate with an honest error band
 * derived from ±5° of sensor/scan uncertainty.
 */
export function estimateSunHours(opts: {
  lat: number;
  lon: number;
  mask: HorizonMask;
  deciduousOverhead: boolean;
  source: SunEstimate["source"];
}): SunEstimate {
  const { lat, lon, mask, deciduousOverhead, source } = opts;

  // Midpoints of the growing season, plus the shoulder months where a
  // deciduous canopy overhead is bare and lets more light through.
  const sampleDays: { month: number; day: number; leafOff: boolean }[] = [
    { month: 4, day: 15, leafOff: true }, // April — many trees not leafed out
    { month: 5, day: 15, leafOff: false },
    { month: 6, day: 15, leafOff: false },
    { month: 7, day: 15, leafOff: false },
    { month: 8, day: 15, leafOff: false },
    { month: 9, day: 15, leafOff: false },
    { month: 10, day: 15, leafOff: true }, // October — leaves dropping
  ];

  const central = averageHours(0);
  const optimistic = averageHours(-5); // horizon 5° lower than scanned
  const pessimistic = averageHours(5); // horizon 5° higher

  const label = sunLabel(central);
  return {
    hours: round1(central),
    low: round1(Math.min(optimistic, pessimistic)),
    high: round1(Math.max(optimistic, pessimistic)),
    label,
    deciduousAdjusted: deciduousOverhead,
    source,
  };

  function averageHours(biasDeg: number): number {
    let total = 0;
    for (const s of sampleDays) {
      total += dayHours(s, biasDeg);
    }
    return total / sampleDays.length;
  }

  function dayHours(
    s: { month: number; day: number; leafOff: boolean },
    biasDeg: number
  ): number {
    // When the canopy is deciduous and bare, relax the mask. We can't perfectly
    // separate tree from building in the scan, so this is a documented
    // approximation, applied only to the shoulder months.
    const relax = deciduousOverhead && s.leafOff ? 0.5 : 1;
    const stepMin = 6;
    let sunnyMin = 0;
    for (let m = 0; m < 1440; m += stepMin) {
      const d = new Date(
        Date.UTC(2025, s.month - 1, s.day, Math.floor(m / 60), m % 60)
      );
      const p = sunPosition(d, lat, lon);
      if (p.altitude <= 0) continue;
      const h = horizonAngleAt(mask, p.azimuth) * relax + biasDeg;
      if (p.altitude > Math.max(0, h)) sunnyMin += stepMin;
    }
    return sunnyMin / 60;
  }
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}
function mod360(a: number): number {
  return mod(a, 360);
}
function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

/** A flat horizon (no obstructions). */
export function flatMask(): HorizonMask {
  return { angles: new Array(72).fill(0), source: "manual" };
}

/**
 * The manual fallback. The user picks how the spot feels rather than scanning,
 * so we map their choice straight to a plain hours estimate with a wide, honest
 * band. Horticultural convention: "full sun" means 6+ hours of direct sun.
 */
export function manualSunEstimate(
  bucket: "full" | "half" | "shade"
): SunEstimate {
  const table = {
    full: { hours: 8, low: 6, high: 12 },
    half: { hours: 4, low: 3, high: 6 },
    shade: { hours: 1.5, low: 0, high: 3 },
  } as const;
  const t = table[bucket];
  return {
    hours: t.hours,
    low: t.low,
    high: t.high,
    label: sunLabel(t.hours),
    deciduousAdjusted: false,
    source: "manual",
  };
}
