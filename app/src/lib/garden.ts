// The planting log: what you actually put in the ground, and what it should be
// doing by now.
//
// Every other layer of the app is about a plant you *might* plant. This one is
// about the ones you did. It answers two questions the rest of the app can't:
//
//   1. **How many have I got in?** A tally per spot, so a garden being built one
//      weekend at a time reads as progress rather than as a vague feeling.
//   2. **Is it doing all right?** A plant's row carries measured field growth at
//      years 1, 3, 5 and 10 (`Plant.size`, sourced in its `basis`). Knowing when
//      it went in turns that table into an expectation for *this* plant, today:
//      "about knee-high by now, and half as wide again."
//
// Two honesty rules run through the whole file.
//
// **Never claim growing time we can't prove.** A date given as a year alone is
// counted from the *end* of that year, and a month alone from the end of that
// month — or from today, if the window it names is still open. "Planted in
// 2024" therefore means "in the ground at least since new year", never "since
// January", so an expectation is always the modest reading and a plant that
// beats it is doing well rather than failing a target we invented.
//
// **An expectation is not a verdict.** The size table is field growth in the
// conditions the source measured; a first summer of drought, a browsing deer or
// a pot-bound root ball all beat it. The words this file produces say "should be
// roughly", and the first year says the honest thing instead: nothing visible
// happens above ground while a native is putting its roots down.
import type { PlantedDate, Planting, SizeSnapshot } from "../types";
import { langTag, t, tn } from "./i18n";
import { length } from "./units";

/** A new planting's id. Same generator idea as a saved spot's. */
export function plantingId(): string {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return "planting-" + Math.abs(Date.now() ^ (performance.now() * 1000)).toString(36);
}

/** Today, as the date field starts out: the common case is planting a thing and
 *  logging it the same evening. */
export function today(now: number = Date.now()): PlantedDate {
  const d = new Date(now);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

/**
 * The date in the reader's own convention — "12 May 2024", "May 2024", "2024".
 *
 * Built with `Intl` rather than a sentence assembled from parts, because the order of
 * day and month is the language's business, not ours. A year on its own is just
 * the number: no locale writes a bare year differently, and `fmtNumber` would
 * put a thousands separator in it.
 */
export function plantedLabel(d: PlantedDate): string {
  if (d.month && d.day) {
    return new Intl.DateTimeFormat(langTag(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d.year, d.month - 1, d.day));
  }
  if (d.month) {
    return new Intl.DateTimeFormat(langTag(), { month: "long", year: "numeric" }).format(
      new Date(d.year, d.month - 1, 1)
    );
  }
  return String(d.year);
}

/** The window a partial date actually names: "May 2024" is a month wide, "2024"
 *  a year. Everything else here reads the window rather than a point. */
export function plantedRange(d: PlantedDate): { start: number; end: number } {
  if (d.month && d.day) {
    return {
      start: new Date(d.year, d.month - 1, d.day).getTime(),
      end: new Date(d.year, d.month - 1, d.day, 23, 59, 59).getTime(),
    };
  }
  if (d.month) {
    return {
      start: new Date(d.year, d.month - 1, 1).getTime(),
      // Day 0 of the next month is the last day of this one.
      end: new Date(d.year, d.month, 0, 23, 59, 59).getTime(),
    };
  }
  return {
    start: new Date(d.year, 0, 1).getTime(),
    end: new Date(d.year, 11, 31, 23, 59, 59).getTime(),
  };
}

/**
 * The instant to count from — the latest the plant could have gone in, but
 * never later than today.
 *
 * The *latest*, deliberately: it makes every age below a floor. A plant is at
 * least this old, so the growth it's measured against is the least we can
 * expect of it, and a vague date can never flatter a struggling plant into
 * looking on schedule.
 *
 * "Never later than today" is what keeps that rule from turning silly inside
 * the current period. Someone who plants a shrub this spring and writes down
 * only "2026" has not planted it in the future — the window they named
 * contains today — so the count starts now and the plant reads as just
 * planted. Only a window that hasn't begun at all is genuinely still to come.
 */
export function plantedSince(d: PlantedDate, now: number = Date.now()): number {
  const { start, end } = plantedRange(d);
  return now < start ? end : Math.min(end, now);
}

/** True when the date names a window that hasn't started — something logged
 *  before it goes in, which is a plan rather than a planting. */
export function stillToCome(d: PlantedDate, now: number = Date.now()): boolean {
  return now < plantedRange(d).start;
}

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

/** Years in the ground, at least — fractional, never negative. */
export function yearsInGround(d: PlantedDate, now: number = Date.now()): number {
  return Math.max(0, (now - plantedSince(d, now)) / YEAR_MS);
}

/**
 * "Three years in the ground" / "Seven months in the ground" / "Just planted".
 *
 * Months up to two years, because that's the span where a month is the unit a
 * gardener thinks in; whole years after that, because "thirty-eight months"
 * is a number nobody converts in their head. A date in the future — someone
 * logging what they're about to plant this weekend — says so rather than
 * counting backwards from zero.
 */
export function timeInGround(d: PlantedDate, now: number = Date.now()): string {
  if (stillToCome(d, now)) return t("log.notYet");
  const years = yearsInGround(d, now);
  if (years < 1 / 12) return t("log.justPlanted");
  if (years < 2) return tn("log.months", Math.floor(years * 12));
  return tn("log.years", Math.floor(years));
}

/**
 * What the plant should be by now, in feet — interpolated between the measured
 * snapshots, held flat past the last one.
 *
 * Linear between two measured years is a simplification and a defensible one:
 * the snapshots are close enough together (1, 3, 5, 10) that the curve between
 * any two is nearly straight, and the alternative is inventing a growth model
 * the sources don't support. Below the first snapshot we return null rather
 * than scaling down from year one — see `growthNote`, which says the true thing
 * about a first year instead of guessing a number.
 */
export function expectedSize(
  size: SizeSnapshot[],
  years: number
): { heightFt: number; spreadFt: number } | null {
  const table = [...size].sort((a, b) => a.year - b.year);
  if (!table.length) return null;
  const first = table[0];
  const last = table[table.length - 1];
  if (years < first.year) return null;
  if (years >= last.year) return { heightFt: last.heightFt, spreadFt: last.spreadFt };
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (years >= a.year && years <= b.year) {
      const f = (years - a.year) / (b.year - a.year);
      return {
        heightFt: a.heightFt + (b.heightFt - a.heightFt) * f,
        spreadFt: a.spreadFt + (b.spreadFt - a.spreadFt) * f,
      };
    }
  }
  return { heightFt: last.heightFt, spreadFt: last.spreadFt };
}

/**
 * The one line under a logged plant: what it should look like by now, or —
 * inside the first year — what it's doing instead of looking like anything.
 *
 * The first-year sentence is not filler. It is the single most useful thing the
 * app can say to somebody standing over a native that has sat there all summer
 * doing nothing: that is what the first year is for, and pulling it up to
 * replace it is the mistake this line exists to prevent.
 */
export function growthNote(size: SizeSnapshot[], d: PlantedDate | null, now: number = Date.now()): string | null {
  if (!d || stillToCome(d, now)) return null;
  const years = yearsInGround(d, now);
  const expected = expectedSize(size, years);
  if (!expected) return t("log.firstYear");
  return t("log.expect", {
    height: length(expected.heightFt),
    spread: length(expected.spreadFt),
  });
}

/** How the spot's tally reads: how many plants are in, and how many kinds. */
export interface Tally {
  /** Every individual plant logged (a row of six milkweeds counts six). */
  plants: number;
  /** Distinct catalog entries — how varied the planting is. */
  kinds: number;
}

export function tally(plantings: Planting[]): Tally {
  return {
    plants: plantings.reduce((n, p) => n + Math.max(1, p.count), 0),
    kinds: new Set(plantings.map((p) => p.plantId)).size,
  };
}
