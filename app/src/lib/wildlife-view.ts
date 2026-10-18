// How the wildlife index is read: the same three controls as a plant list
// (`lib/roster-sort.ts`), each kept in the address so a view can be shared.
//
//   - sort: by name, or most plants first — the 🌱 figure every card carries,
//     how many natives in Indigene support the animal. It counts the ties we
//     have mapped, not every plant the animal uses, and the page says so.
//   - grouped: one list by default, or under a heading per animal type.
//   - sole: only the animals with a plant that is their only option.
import type { WildlifeIndexRow } from "./wildlife";

export type WildlifeSort = "name" | "plants";

export interface WildlifeView {
  sort: WildlifeSort;
  grouped: boolean;
  sole: boolean;
}

/** Read the view from a query string; anything unknown is the default. */
export function wildlifeView(query: URLSearchParams): WildlifeView {
  return {
    sort: query.get("sort") === "plants" ? "plants" : "name",
    grouped: query.get("group") === "type",
    sole: query.get("only") === "sole",
  };
}

/** The query string for a view, "" for the default one. */
export function wildlifeQuery(view: WildlifeView): string {
  const q = new URLSearchParams();
  if (view.sort === "plants") q.set("sort", "plants");
  if (view.grouped) q.set("group", "type");
  if (view.sole) q.set("only", "sole");
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** A view's animals in its order: most plants first breaks ties by name. */
export function sortWildlife(
  rows: WildlifeIndexRow[], sort: WildlifeSort, name: (r: WildlifeIndexRow) => string, lang: string,
): WildlifeIndexRow[] {
  const byName = (a: WildlifeIndexRow, b: WildlifeIndexRow): number => name(a).localeCompare(name(b), lang);
  return rows.slice().sort(sort === "plants" ? (a, b) => b.plantCount - a.plantCount || byName(a, b) : byName);
}
