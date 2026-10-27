// How the wildlife index is read: the same three controls as a plant list
// (`lib/roster-sort.ts`), each kept in the address so a view can be shared.
//
//   - sort: by name, or most plants first — the 🌱 figure every card carries,
//     how many natives in Indigene support the animal. It counts the ties we
//     have mapped, not every plant the animal uses, and the page says so.
//   - grouped: one list by default, or under a heading per animal type.
//   - sole: only the animals with a plant that is their only option.
//   - atRisk: only the animals ranked vulnerable or worse, most threatened
//     first (`lib/conservation.ts`). Both filters share `only=`: `only=sole,at-risk`.
import type { WildlifeIndexRow } from "./wildlife";

export type WildlifeSort = "name" | "plants";

export interface WildlifeView {
  sort: WildlifeSort;
  grouped: boolean;
  sole: boolean;
  atRisk: boolean;
}

const only = (query: URLSearchParams): Set<string> => new Set((query.get("only") ?? "").split(","));

/** Read the view from a query string; anything unknown is the default. */
export function wildlifeView(query: URLSearchParams): WildlifeView {
  return {
    sort: query.get("sort") === "plants" ? "plants" : "name",
    grouped: query.get("group") === "type",
    sole: only(query).has("sole"),
    atRisk: only(query).has("at-risk"),
  };
}

/** The query string for a view, "" for the default one. */
export function wildlifeQuery(view: WildlifeView): string {
  const q = new URLSearchParams();
  if (view.sort === "plants") q.set("sort", "plants");
  if (view.grouped) q.set("group", "type");
  const only = [view.sole && "sole", view.atRisk && "at-risk"].filter(Boolean);
  if (only.length) q.set("only", only.join(","));
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
