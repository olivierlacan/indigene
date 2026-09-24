// The query layer over the most-wanted dataset (`data/invasives.ts`): each
// region's list, ranked, and the way back from a plant to the lists it's on.
//
// **The ranking, written once.** A region's list is ordered by:
//
//   1. The rating its own authority gave the plant — `transforms` before
//      `spreads` before `patchy`, the risk judged by the people who survey that
//      ground. An unrated plant sorts after the rated ones, because "nobody has
//      scored it here" is an absence of knowledge, not a finding that it's mild
//      (the same rule `tieOrder` follows for the look-alikes).
//   2. How often it has been recorded wild inside the region's box on
//      iNaturalist (`invasive-counts.json`) — the evidence of spread.
//
// Nothing here downloads a plant list: the region page that shows this already
// has its own, and the swap and look-alike pages that link back only need the
// tie table. `npm run chunks:check` keeps it that way.
import type { Invasive, MarkPart, PressureLevel, RemovalMethod, WantedLink } from "../types";
import { INVASIVES, MOST_WANTED } from "../data/invasives";
import COUNTS from "../data/invasive-counts.json";
import { PRESSURE_RANK, pressureOf } from "./lookalikes";

const invasiveById = new Map(INVASIVES.map((i) => [i.id, i]));
const counts = COUNTS.counts as Record<string, Record<string, number>>;

/**
 * One small picture per kind of removal step, the way each propagation
 * technique has one (`TECHNIQUES` in `lib/planting.ts`). Decorative: the step's
 * words carry the meaning, and the method's name is the icon's tooltip. A
 * `Record` over the union, so a new method can't ship without its icon.
 */
export const REMOVAL_ICONS: Record<RemovalMethod, string> = {
  pull: "✋",
  dig: "⛏️",
  cut: "✂️",
  girdle: "🪓",
  cover: "📦",
  bag: "🛍️",
  repeat: "🔁",
  timing: "📅",
  gear: "🧤",
  avoid: "🚫",
  pro: "👷",
  replant: "🌱",
  water: "💧",
};

/** One picture per part of the plant a recognition mark is about — the same
 *  idea as `REMOVAL_ICONS`, for "How to spot it". Decorative: the heading's
 *  own word says the same thing. */
export const MARK_ICONS: Record<MarkPart, string> = {
  leaf: "🍃",
  flower: "🌸",
  stem: "🎋",
  thorn: "🌵",
  fruit: "🫐",
  root: "🥕",
  smell: "👃",
  shape: "📏",
  where: "📍",
  when: "📅",
  wildlife: "🐛",
};

/** The disposal line's icon — every plant has one, so it isn't a method. */
export const DISPOSE_ICON = "🗑️";

/** The day the sighting counts were taken, `YYYY-MM-DD`. */
export const sightingsAsOf: string = COUNTS.asOf;

export function getInvasive(id: string): Invasive | undefined {
  return invasiveById.get(id);
}

/** One place on a region's list. */
export interface WantedRow {
  /** 1-based, after ranking. */
  rank: number;
  invasive: Invasive;
  link: WantedLink;
  /** The authority's rating, read as a pressure level; null when unrated or
   *  when all it has is a weed law (see `pressureOf`). */
  level: PressureLevel | null;
  /** Wild iNaturalist records in the region's box, or null if never counted. */
  sightings: number | null;
}

/** A region's most-wanted list, worst first. Empty for a region with none. */
export function mostWanted(regionId: string): WantedRow[] {
  const rows = (MOST_WANTED[regionId] ?? []).flatMap((link) => {
    const invasive = invasiveById.get(link.invasiveId);
    if (!invasive) return [];
    return [{
      rank: 0,
      invasive,
      link,
      level: pressureOf(link),
      sightings: counts[regionId]?.[link.invasiveId] ?? null,
    }];
  });
  rows.sort((a, b) =>
    (a.level ? PRESSURE_RANK[a.level] : 3) - (b.level ? PRESSURE_RANK[b.level] : 3) ||
    (b.sightings ?? -1) - (a.sightings ?? -1)
  );
  rows.forEach((r, i) => (r.rank = i + 1));
  return rows;
}

/** Whether any authority rated this region's list — which decides whether the
 *  page can say "ranked by rating, then sightings" or only "by sightings". */
export function regionIsRated(regionId: string): boolean {
  return (MOST_WANTED[regionId] ?? []).some((l) => pressureOf(l) !== null);
}

/** Every invasive on at least one region's list — the pages that exist. */
export function mappedInvasiveIds(): Set<string> {
  const out = new Set<string>();
  for (const links of Object.values(MOST_WANTED)) for (const l of links) out.add(l.invasiveId);
  return out;
}

/** This plant's row on every list it's on, in the app's region order. */
export function wantedRowsFor(invasiveId: string): { regionId: string; row: WantedRow }[] {
  const out: { regionId: string; row: WantedRow }[] = [];
  for (const regionId of Object.keys(MOST_WANTED)) {
    const row = mostWanted(regionId).find((r) => r.invasive.id === invasiveId);
    if (row) out.push({ regionId, row });
  }
  return out;
}

/** Where a plant stands on each list it's on, for the swap and look-alike
 *  pages to link back: "#2 most wanted in the Mid-Atlantic". Matched on the
 *  scientific name, which is what the three catalogs share. */
export function wantedPlacesFor(latin: string): { regionId: string; rank: number }[] {
  const key = latin.trim().toLowerCase();
  const inv = INVASIVES.find((i) => i.latin.toLowerCase() === key);
  if (!inv) return [];
  return wantedRowsFor(inv.id).map(({ regionId, row }) => ({ regionId, rank: row.rank }));
}

/**
 * Dev-only integrity check, like `auditLookalikes`: every tie names a catalog
 * plant and cites a source, every plant has three marks with both halves
 * filled in, and every tie has a sighting count — a missing count would drop a
 * plant to the bottom of its list without anybody deciding it should go there.
 */
export function auditInvasives(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const inv of INVASIVES) {
    if (seen.has(inv.id)) problems.push(`invasive id "${inv.id}" appears twice`);
    seen.add(inv.id);
    if (inv.marks.length !== 3) problems.push(`${inv.id}: ${inv.marks.length} marks, want 3`);
    const { steps, dispose, basis } = inv.removal;
    if (!steps.length || steps.length > 3) problems.push(`${inv.id}: ${steps.length} removal steps, want 1–3`);
    if (!dispose.trim() || !basis.trim()) problems.push(`${inv.id}: removal needs a disposal line and a source`);
    for (const m of inv.marks) {
      if (!m.feature.trim() || !m.text.trim()) problems.push(`${inv.id}: a mark with an empty half`);
    }
  }
  for (const [regionId, links] of Object.entries(MOST_WANTED)) {
    const ids = new Set<string>();
    for (const link of links) {
      if (!invasiveById.has(link.invasiveId)) problems.push(`${regionId}: unknown invasive "${link.invasiveId}"`);
      if (ids.has(link.invasiveId)) problems.push(`${regionId}: "${link.invasiveId}" listed twice`);
      ids.add(link.invasiveId);
      if (!link.basis.trim()) problems.push(`${regionId}/${link.invasiveId}: no source`);
      if (counts[regionId]?.[link.invasiveId] == null) {
        problems.push(`${regionId}/${link.invasiveId}: no sighting count — run npm run invasives:count`);
      }
    }
  }
  return problems;
}

if (import.meta.env.DEV) {
  const problems = auditInvasives();
  if (problems.length) console.warn("[invasives] MOST_WANTED integrity problems:\n" + problems.join("\n"));
}
