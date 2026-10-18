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
import type { Plant } from "../types";

export type RosterSort = "name" | "caterpillars";

export interface RosterView {
  sort: RosterSort;
  grouped: boolean;
  pioneers: boolean;
}

/** Read the view from a query string; anything unknown is the default. */
export function rosterView(query: URLSearchParams): RosterView {
  return {
    sort: query.get("sort") === "caterpillars" ? "caterpillars" : "name",
    grouped: query.get("group") === "type",
    pioneers: query.get("only") === "pioneers",
  };
}

/** The query string for a view, "" for the default one — so the plain roster
 *  keeps its plain address. */
export function rosterQuery(view: RosterView): string {
  const q = new URLSearchParams();
  if (view.sort === "caterpillars") q.set("sort", "caterpillars");
  if (view.grouped) q.set("group", "type");
  if (view.pioneers) q.set("only", "pioneers");
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
export function byCaterpillars(plants: Plant[], name: (p: Plant) => string, lang: string): Plant[] {
  const count = (p: Plant): number => p.hostLepCount ?? -1;
  return plants.slice().sort((a, b) =>
    count(b) - count(a) ||
    Number(b.keystone) - Number(a.keystone) ||
    name(a).localeCompare(name(b), lang));
}
