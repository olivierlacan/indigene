// How a region's roster is read: three controls that combine, each kept in
// the address so a view can be shared.
//
//   - sort: by name, or most caterpillar species first. The host count is the
//     one wildlife figure every plant row carries with a cited source and a
//     confidence level, so it is the one a list can honestly be ranked by. The
//     named-wildlife ties are not: they are a short, hand-picked set of
//     recognizable animals per plant, and ranking by how many we wrote down
//     would rank our writing, not the plant.
//   - grouped: one list by default, for a reader who doesn't care yet what
//     type of plant it is, or under a heading per plant type (trees, shrubs…).
//   - pioneers: only the natives that take a beating (`data/pioneers.ts`).
//   - filters: the spot flow's own — no watering, deer, thorns, pets,
//     spreaders and the two size caps (`lib/filter-traits.ts`).
import type { Plant } from "../types";
import { NO_TRAIT_FILTERS } from "./filter-traits";
import type { TraitFilters } from "./filter-traits";

export type RosterSort = "name" | "caterpillars";

export interface RosterView {
  sort: RosterSort;
  grouped: boolean;
  pioneers: boolean;
  filters: TraitFilters;
}

/** Each on/off filter's word in the address: `?filter=pet-safe,deer`. */
const FILTER_SLUGS = [
  ["requireNoWater", "no-water"],
  ["requireDeerResistant", "deer"],
  ["excludeThorny", "no-thorns"],
  ["excludePetToxic", "pet-safe"],
  ["excludeAggressive", "no-spreaders"],
] as const;

/** The address keys a view reads, for a page that collects its own. */
export const ROSTER_KEYS = ["sort", "group", "only", "filter", "max-height", "max-spread"];

/** A size cap from the address, in feet; anything that isn't a positive
 *  number is no cap. */
function feet(v: string | null): number | null {
  const n = v === null ? NaN : Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Read the view from a query string; anything unknown is the default. */
export function rosterView(query: URLSearchParams): RosterView {
  return {
    sort: query.get("sort") === "caterpillars" ? "caterpillars" : "name",
    grouped: query.get("group") === "type",
    pioneers: query.get("only") === "pioneers",
    filters: (() => {
      const on = new Set((query.get("filter") ?? "").split(","));
      const f: TraitFilters = { ...NO_TRAIT_FILTERS };
      for (const [key, slug] of FILTER_SLUGS) f[key] = on.has(slug);
      f.maxHeightFt = feet(query.get("max-height"));
      f.maxSpreadFt = feet(query.get("max-spread"));
      return f;
    })(),
  };
}

/** The query string for a view, "" for the default one — so the plain roster
 *  keeps its plain address. */
export function rosterQuery(view: RosterView): string {
  const q = new URLSearchParams();
  if (view.sort === "caterpillars") q.set("sort", "caterpillars");
  if (view.grouped) q.set("group", "type");
  if (view.pioneers) q.set("only", "pioneers");
  const on = FILTER_SLUGS.filter(([key]) => view.filters[key]).map(([, slug]) => slug);
  if (on.length) q.set("filter", on.join(","));
  // Feet, like the saved preference; a metric rung is a long decimal, so it's
  // rounded — the controls snap it back to the nearest rung.
  if (view.filters.maxHeightFt != null) q.set("max-height", String(Math.round(view.filters.maxHeightFt * 100) / 100));
  if (view.filters.maxSpreadFt != null) q.set("max-spread", String(Math.round(view.filters.maxSpreadFt * 100) / 100));
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** A view's plants in its order. */
export function sortRoster(plants: Plant[], sort: RosterSort, name: (p: Plant) => string, lang: string): Plant[] {
  if (sort === "caterpillars") return byCaterpillars(plants, name, lang);
  return plants.slice().sort((a, b) => name(a).localeCompare(name(b), lang));
}

/**
 * Most caterpillar species first; a keystone breaks a tie, then the name.
 * A plant not counted yet (`null`) goes last — never treated as 0, which
 * would claim nothing eats it and slot it among the plants that truly host
 * few.
 */
export function byCaterpillars<T extends Pick<Plant, "hostLepCount" | "keystone">>(
  plants: T[], name: (p: T) => string, lang: string,
): T[] {
  const count = (p: T): number => p.hostLepCount ?? -1;
  return plants.slice().sort((a, b) =>
    count(b) - count(a) ||
    Number(b.keystone) - Number(a.keystone) ||
    name(a).localeCompare(name(b), lang));
}
