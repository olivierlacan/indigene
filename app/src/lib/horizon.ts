// Builds a horizon mask from the sky scan: as the user turns 360° aiming the
// crosshair at the top of whatever blocks the sky (trees, roofs, fences), we
// record the elevation angle per compass bearing. Sensors are noisy, so we
// average repeated samples per bin, smooth circularly, and interpolate gaps.
import type { HorizonMask } from "../types";

const BINS = 72; // one sample every 5°
const STEP = 360 / BINS;

export class HorizonRecorder {
  private sum = new Float64Array(BINS);
  private count = new Uint16Array(BINS);

  /** Record the obstruction-top elevation currently aimed at `bearing`. */
  sample(bearing: number, elevation: number): void {
    if (!Number.isFinite(bearing) || !Number.isFinite(elevation)) return;
    const b = mod(Math.round(bearing / STEP), BINS);
    // Elevation of a skyline can't be below the horizon or absurdly high.
    const e = clamp(elevation, 0, 80);
    this.sum[b] += e;
    this.count[b] += 1;
  }

  /** Fraction of the full circle that has at least one sample. */
  coverage(): number {
    let filled = 0;
    for (let i = 0; i < BINS; i++) if (this.count[i] > 0) filled++;
    return filled / BINS;
  }

  reset(): void {
    this.sum.fill(0);
    this.count.fill(0);
  }

  /** Produce the smoothed, gap-filled mask. */
  build(): HorizonMask {
    const raw = new Array<number | null>(BINS);
    for (let i = 0; i < BINS; i++) {
      raw[i] = this.count[i] > 0 ? this.sum[i] / this.count[i] : null;
    }
    const filled = interpolateCircular(raw);
    const smoothed = smoothCircular(filled, 2);
    return { angles: smoothed, source: "scan" };
  }
}

/** Fill nulls by walking to the nearest recorded bin on each side. */
function interpolateCircular(vals: (number | null)[]): number[] {
  const n = vals.length;
  const anyReal = vals.some((v) => v != null);
  if (!anyReal) return new Array(n).fill(0);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    if (vals[i] != null) {
      out[i] = vals[i] as number;
      continue;
    }
    let l = 1,
      r = 1;
    while (vals[mod(i - l, n)] == null && l < n) l++;
    while (vals[mod(i + r, n)] == null && r < n) r++;
    const lv = vals[mod(i - l, n)] as number;
    const rv = vals[mod(i + r, n)] as number;
    out[i] = (lv * r + rv * l) / (l + r);
  }
  return out;
}

/** Circular moving average with the given half-window. */
function smoothCircular(vals: number[], half: number): number[] {
  const n = vals.length;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let k = -half; k <= half; k++) s += vals[mod(i + k, n)];
    out[i] = s / (2 * half + 1);
  }
  return out;
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}
function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
