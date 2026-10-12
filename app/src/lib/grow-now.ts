// What to propagate now, from the plants somebody already has in the ground.
//
// The technique pages (`lib/planting.ts`) say when each way of making more
// plants works. A plant page says which ways work for that plant. This module
// joins the two with the planting log: of the natives *you* have, which are old
// enough to share, which are in their window right now, and which of those is
// worth your afternoon first.
//
// Three rules, in the order they're applied.
//
// **Old enough, at least.** A plant gives seed once it flowers and gives
// divisions once the clump has filled out. `READY_YEARS` holds those ages by
// growth form, read against the *floor* of its age from `lib/garden.ts`. A
// plant with no planting date is left out rather than assumed old: the log
// never claims growing time it can't prove. Trees, shrubs and vines are never
// prompted for seed: the USDA Woody Plant Seed Manual's tables put their first
// seed anywhere from 3 years (silky dogwood) to 40 (shagbark hickory), and
// 20 for white oak, so no age by form would be honest. See `GUIDE_REFS` in
// `lib/planting.ts` for every source this file leans on.
//
// **In its window.** Seed is ripe a little after the flowers finish. For a
// wildflower, grass or other soft-stemmed plant that's close enough to read
// off the bloom months — so the window is a *month*, and urgent, because ripe
// seed drops or gets eaten. A tree's or shrub's fruit can ripen half a year
// after it flowers (an oak's acorns), so woody seed falls back to the
// technique's season. Everything taken from the living plant uses the
// technique's season too.
//
// **Most use to wildlife first.** A second milkweed raises monarchs; a second
// ornamental grass mostly fills a gap. `growValue` ranks by the food-web
// measures the app already carries — a make-or-break tie, an essential
// (keystone) host, the caterpillar score — and only then by pollinators,
// birds and soil. A seed window that closes this month outranks a season-long
// one at the same value, because it's the one you can miss.
import type { Plant, PlantForm, Planting, PropagationMethod } from "../types";
import { stillToCome, yearsInGround } from "./garden";
import { SEED_BEARING } from "../data/seed-bearing";
import { seasonOfMonth, techniqueFor, type Season } from "./planting";
import type { Hemisphere } from "./hemisphere";
import { relianceOf, wildlifeForPlant } from "./wildlife";

/** What a technique family needs before the plant can spare it. */
type ReadyGroup = "seed" | "cutting" | "clump" | "runners" | "spores";

function groupOf(m: PropagationMethod): ReadyGroup {
  if (m.startsWith("seed-")) return "seed";
  if (m.startsWith("cuttings-") || m === "layering") return "cutting";
  if (m === "runners") return "runners";
  if (m === "spores") return "spores";
  return "clump"; // division, suckers, root cuttings
}

/**
 * Years in the ground before each family is worth trying, by growth form.
 *
 *  - Seed: an annual seeds in its first summer; a soft-stemmed perennial or
 *    grass is given two, and the page says a plant that hasn't flowered has no
 *    seed yet. Woody forms have no entry (see the top of this file).
 *  - Clumps: two years, the low end of the RHS's "most perennials benefit from
 *    division every two to three years".
 *  - Cuttings, runners: an established plant's spare shoots, from its second
 *    season. Our rule of thumb, and the page calls it one.
 *
 * `undefined` means the pairing isn't offered.
 */
const READY_YEARS: Record<ReadyGroup, Partial<Record<PlantForm, number>>> = {
  seed: { annual: 0, perennial: 2, grass: 2, groundcover: 2 },
  cutting: { perennial: 1, grass: 1, groundcover: 1, vine: 1, shrub: 1, tree: 1, fern: 1 },
  clump: { perennial: 2, grass: 2, groundcover: 2, fern: 2, vine: 2, shrub: 3, tree: 3 },
  runners: { perennial: 1, groundcover: 1, grass: 1, vine: 1, fern: 1, shrub: 2 },
  spores: { fern: 2 },
};

/** Trees, shrubs and vines: their seed waits on a per-species figure. */
const WOODY: ReadonlySet<PlantForm> = new Set(["tree", "shrub", "vine"]);

/**
 * Years in the ground before this method is offered for this plant. Woody seed
 * comes only from `SEED_BEARING` — the Woody Plant Seed Manual's minimum
 * seed-bearing age for that species — and is never offered without one.
 */
export function readyAt(plant: Pick<Plant, "form" | "latin">, m: PropagationMethod): number | undefined {
  const group = groupOf(m);
  if (group === "seed" && WOODY.has(plant.form)) return SEED_BEARING[plant.latin]?.years;
  return READY_YEARS[group][plant.form];
}

/** Soft-stemmed plants, whose seed ripens soon after the flowers fade. */
const HERBACEOUS: ReadonlySet<PlantForm> = new Set(["annual", "perennial", "grass", "groundcover", "fern"]);

/** Months (1–12) a plant's seed is ripe. A tree's or shrub's are the Woody
 *  Plant Seed Manual's printed ripening months. A soft-stemmed plant's are the last month of
 *  flowering and the two after it. Null when its ripening can't be read off
 *  the bloom — a woody plant, or no bloom on record. */
export function ripeMonths(plant: Pick<Plant, "form" | "bloom" | "latin">): number[] | null {
  // A tree's or shrub's own printed ripening months, where the manual has them.
  if (WOODY.has(plant.form)) return SEED_BEARING[plant.latin]?.ripens ?? null;
  if (!plant.bloom || !HERBACEOUS.has(plant.form)) return null;
  const end = plant.bloom.endMonth;
  return [0, 1, 2].map((k) => ((end - 1 + k) % 12) + 1);
}

/**
 * Seasons the work happens in, for a method without a ripening month to go by.
 * Seed is gathered when it falls — late summer and autumn for fresh-sown seed,
 * autumn for everything else — whatever season the technique page *sows* it
 * in. The rest are the technique's own window.
 */
function seasonsFor(m: PropagationMethod): readonly Season[] | "any" {
  if (m === "seed-warm") return ["summer", "fall"];
  if (m.startsWith("seed-")) return ["fall"];
  const tech = techniqueFor(m);
  return tech.anyTime ? "any" : tech.seasons;
}

/** Why making more of this plant matters, strongest reason only. */
export type GrowWhy =
  | { kind: "sole"; wildlifeId: string }
  | { kind: "keystone" }
  | { kind: "host" }
  | { kind: "pollinator" }
  | { kind: "bird" }
  | { kind: "soil" };

/** A plant's worth to wildlife if you had two of it, and the reason in front. */
export function growValue(plant: Plant, regionId: string | null): { score: number; why: GrowWhy } {
  const ties = regionId ? wildlifeForPlant(regionId, plant.id) : [];
  const sole = ties.find(({ link }) => relianceOf(link) === "sole");
  const s = plant.scores;
  const score =
    (sole ? 25 : 0) +
    (plant.keystone ? 25 : 0) +
    s.host * 0.3 +
    Math.max(s.pollinator, s.bird) * 0.15 +
    Math.max(s.stormwater, s.erosion) * 0.05 +
    // An annual comes back only from its own seed: miss it and it's gone.
    (plant.form === "annual" ? 10 : 0);

  let why: GrowWhy;
  if (sole) why = { kind: "sole", wildlifeId: sole.wildlife.id };
  else if (plant.keystone) why = { kind: "keystone" };
  else if (s.host >= Math.max(s.pollinator, s.bird) && s.host >= 40) why = { kind: "host" };
  else if (Math.max(s.pollinator, s.bird) >= Math.max(s.stormwater, s.erosion)) {
    why = { kind: s.pollinator >= s.bird ? "pollinator" : "bird" };
  } else why = { kind: "soil" };
  return { score, why };
}

/** Does something here eat this plant's seed or fruit? Then a seed task says
 *  to leave some standing: Audubon's "the seed heads of coneflowers,
 *  black-eyed Susans, and other native wildflowers provide a helpful food
 *  cache for birds". Collecting is a share, not a harvest. */
function birdFood(plant: Plant, regionId: string | null): boolean {
  if (!regionId) return false;
  return wildlifeForPlant(regionId, plant.id).some(({ link }) => link.support === "seeds" || link.support === "berries");
}

/** One thing to do with one plant. */
export interface GrowTask {
  plantId: string;
  /** The technique to link — the plant's own first choice that fits now. */
  method: PropagationMethod;
  /** "month": ripe seed, which won't wait. "season": a window of weeks. */
  window: "month" | "season";
  /** Whole years in the ground, at least. */
  years: number;
  score: number;
  why: GrowWhy;
  /** Seed that birds eat here: take some, leave the rest standing. */
  leaveSome: boolean;
}

export interface GrowPlan {
  /** In their window now, most useful first. */
  now: GrowTask[];
  /** Not now, but in the next three months. */
  next: GrowTask[];
  /** Kinds too young for any of their methods yet. */
  young: string[];
  /** Kinds with no planting date, left out rather than guessed. */
  undated: string[];
  /** Woody kinds that only grow from seed, which we don't guess the age of. */
  seedOnlyWoody: string[];
}

/** The oldest planting of each kind — a second batch doesn't make the first
 *  one younger. Null when none of its rows has a date. */
function oldestByPlant(plantings: Planting[], now: number): Map<string, number | null> {
  const out = new Map<string, number | null>();
  for (const p of plantings) {
    const prev = out.get(p.plantId) ?? null;
    if (!p.planted) {
      if (!out.has(p.plantId)) out.set(p.plantId, null);
      continue;
    }
    if (stillToCome(p.planted, now)) {
      if (!out.has(p.plantId)) out.set(p.plantId, null);
      continue;
    }
    const years = yearsInGround(p.planted, now);
    out.set(p.plantId, prev == null ? years : Math.max(prev, years));
  }
  return out;
}

/** Is the plant in flower in this month (1–12)? A bloom can wrap new year. */
export function inBloom(plant: Pick<Plant, "bloom">, month: number): boolean {
  if (!plant.bloom) return false;
  const { startMonth: a, endMonth: b } = plant.bloom;
  return a <= b ? month >= a && month <= b : month >= a || month <= b;
}

/**
 * The plant's best method for `month`: old enough and in its window. Ripe
 * seed wins over a season-long task, because it's the one that won't wait;
 * otherwise the plant's own order (easiest first) decides. A clump is never
 * split while it flowers — spring bloomers divide in autumn, autumn bloomers
 * in spring.
 */
function taskAt(
  plant: Plant,
  years: number,
  month: number,
  hemisphere: Hemisphere
): Pick<GrowTask, "method" | "window"> | null {
  const season = seasonOfMonth(month - 1, hemisphere);
  let fallback: Pick<GrowTask, "method" | "window"> | null = null;
  for (const method of plant.propagation.methods) {
    const need = readyAt(plant, method);
    if (need == null || years < need) continue;
    if (method.startsWith("seed-")) {
      const ripe = ripeMonths(plant);
      if (ripe) {
        if (ripe.includes(month)) return { method, window: "month" };
        continue;
      }
    }
    if (groupOf(method) === "clump" && inBloom(plant, month)) continue;
    const seasons = seasonsFor(method);
    if (!fallback && (seasons === "any" || seasons.includes(season))) fallback = { method, window: "season" };
  }
  return fallback;
}

/** Most useful first; at the same value, the window you could miss first. */
export const compareTasks = (a: GrowTask, b: GrowTask): number =>
  b.score + (b.window === "month" ? 15 : 0) - (a.score + (a.window === "month" ? 15 : 0)) ||
  a.plantId.localeCompare(b.plantId);

/**
 * The plan for one spot's log. `plantOf` resolves ids the way the spot page
 * already does; an id it can't resolve is skipped, never guessed at.
 */
export function growPlan(
  plantings: Planting[],
  plantOf: (id: string) => Plant | undefined,
  regionId: string | null,
  hemisphere: Hemisphere,
  now: number = Date.now()
): GrowPlan {
  const plan: GrowPlan = { now: [], next: [], young: [], undated: [], seedOnlyWoody: [] };
  const month = new Date(now).getMonth() + 1;
  // Three months on lands in the next season, whatever this one is.
  const later = ((month + 2) % 12) + 1;
  for (const [plantId, age] of oldestByPlant(plantings, now)) {
    const plant = plantOf(plantId);
    if (!plant) continue;
    if (age == null) {
      plan.undated.push(plantId);
      continue;
    }
    const years = Math.floor(age);
    // Nothing offered at any age: a woody plant whose only way is seed.
    if (plant.propagation.methods.every((m) => readyAt(plant, m) == null)) {
      plan.seedOnlyWoody.push(plantId);
      continue;
    }
    const ready = plant.propagation.methods.some((m) => {
      const need = readyAt(plant, m);
      return need != null && age >= need;
    });
    if (!ready) {
      plan.young.push(plantId);
      continue;
    }
    const { score, why } = growValue(plant, regionId);
    const fedOn = birdFood(plant, regionId);
    const task = (t: Pick<GrowTask, "method" | "window">): GrowTask => ({
      plantId, years, score, why, ...t,
      leaveSome: fedOn && t.method.startsWith("seed-"),
    });
    const current = taskAt(plant, age, month, hemisphere);
    if (current) {
      plan.now.push(task(current));
      continue;
    }
    // A plant that will be old enough by then counts too: it's the same
    // planting, three months on.
    const upcoming = taskAt(plant, age + 0.25, later, hemisphere);
    if (upcoming) plan.next.push(task(upcoming));
  }
  plan.now.sort(compareTasks);
  plan.next.sort(compareTasks);
  return plan;
}
