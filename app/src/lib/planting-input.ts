// What the planting form's year, month, day and count fields mean, as plain
// functions of the strings the fields hold — so every value a person can type
// is tested, not just the ones the browser's `min`/`max` suggest. A number
// field's limits are hints: typing "99999" or "-3" still submits.
import type { PlantedDate } from "../types";

/** The planted date the three fields describe, or null when the year isn't one. */
export function readPlanted(year: string, month: string, day: string, maxYear: number): PlantedDate | null {
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > maxYear) return null;
  const m = Number(month);
  if (!month || !Number.isInteger(m) || m < 1 || m > 12) return { year: y };
  const d = Number(day);
  // Day 31 in a 30-day month is a date nobody planted on: keep the month.
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (!day || !Number.isInteger(d) || d < 1 || d > last) return { year: y, month: m };
  return { year: y, month: m, day: d };
}

/** How many were planted: a whole number from 1 to 999, 1 when unreadable. */
export function readCount(value: string): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.max(1, Math.min(999, n)) : 1;
}
