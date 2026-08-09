// The query layer over the wildlife dataset. The data (`data/wildlife.ts`)
// stores ties in the natural authoring direction — plant → the animals it
// supports — because that's how a row is audited. This module inverts and joins
// them so the app can answer either question:
//
//   - "Which plants support this animal?"  (the browse-by-wildlife pages)
//   - "Which animals does this plant support?"  (the plant profile)
//
// It resolves plant ids to real Plant objects through the same `loadPlants`
// path the rest of the app uses, so a wildlife page can never show a plant the
// region roster doesn't — and a tie pointing at an unknown id is dropped, not
// rendered as a broken row (guarded, and surfaced in dev by `auditSupport`).
import type { Plant, SupportLink, SupportReliance, Wildlife, WildlifeKind } from "../types";
import type { RegionDef } from "../data/region";
import { REGIONS, loadPlants } from "./plants";
import { SUPPORT, WILDLIFE } from "../data/wildlife";

/** A tie's dependence strength, applying the documented "broad" default. */
export function relianceOf(link: SupportLink): SupportReliance {
  return link.reliance ?? "broad";
}

const wildlifeById = new Map(WILDLIFE.map((w) => [w.id, w]));

/** The catalog entry for an id, or undefined if it isn't one we know. */
export function getWildlife(id: string): Wildlife | undefined {
  return wildlifeById.get(id);
}

/** Section order for the index — most-asked-for wildlife first. */
export const KIND_ORDER: WildlifeKind[] = ["butterfly", "moth", "bee", "bird", "mammal"];

/** URL slug for each kind — plural, human, stable ("…/wildlife/butterflies"). */
export const KIND_SLUGS: Record<WildlifeKind, string> = {
  butterfly: "butterflies",
  moth: "moths",
  bee: "bees",
  bird: "birds",
  mammal: "mammals",
};
const slugToKind = new Map<string, WildlifeKind>(
  KIND_ORDER.map((k) => [KIND_SLUGS[k], k])
);

/**
 * The kind index a `#/wildlife/<param>` route means, if any — so the router and
 * the page agree on which of the two shapes an address is. An animal's id
 * always wins: `#/wildlife/monarch` is the monarch, and only a param that is
 * no animal's id can be read as a group ("all the butterflies").
 */
export function wildlifeKindRoute(param: string): WildlifeKind | undefined {
  if (wildlifeById.has(param)) return undefined;
  return slugToKind.get(param);
}

/** A plant that supports a given animal, with the region it's in and the tie. */
export interface PlantSupport {
  region: RegionDef;
  plant: Plant;
  link: SupportLink;
}

const regionById = new Map(REGIONS.map((r) => [r.meta.id, r]));

/**
 * Every plant that supports one animal, across all regions. Grouping by region
 * is left to the caller (the detail page shows one region block at a time).
 * Ties whose plant id isn't in that region's roster are skipped defensively.
 */
export async function plantsForWildlife(wildlifeId: string): Promise<PlantSupport[]> {
  const out: PlantSupport[] = [];
  // Only the regions that actually tie a plant to this animal are fetched — an
  // animal is usually a story about one or two regions, not all nine.
  for (const [regionId, byPlant] of Object.entries(SUPPORT)) {
    const region = regionById.get(regionId);
    if (!region) continue;
    const ties = Object.values(byPlant).some((links) =>
      links.some((l) => l.wildlifeId === wildlifeId)
    );
    if (!ties) continue;
    const plants = await loadPlants(region);
    for (const [plantId, links] of Object.entries(byPlant)) {
      const link = links.find((l) => l.wildlifeId === wildlifeId);
      if (!link) continue;
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) continue;
      out.push({ region, plant, link });
    }
  }
  return out;
}

/** One animal a plant supports, resolved to the catalog entry + the tie. */
export interface WildlifeForPlant {
  wildlife: Wildlife;
  link: SupportLink;
}

/**
 * The animals a specific plant supports (for its profile page). Keyed by the
 * region the reader is viewing the plant in, so a species that appears in two
 * regions shows the ties authored for that region.
 */
export function wildlifeForPlant(regionId: string, plantId: string): WildlifeForPlant[] {
  const links = SUPPORT[regionId]?.[plantId] ?? [];
  const out: WildlifeForPlant[] = [];
  for (const link of links) {
    const wildlife = wildlifeById.get(link.wildlifeId);
    if (wildlife) out.push({ wildlife, link });
  }
  return out;
}

/** The regions Indigene documents this animal in — i.e. the regions whose plant
 *  lists carry at least one tie to it — in the app's usual region order. Used to
 *  offer "look it up where it's found" buttons on the wildlife page, the same way
 *  a plant offers its native regions. */
export function regionsForWildlife(wildlifeId: string): RegionDef[] {
  // Read straight off the tie table rather than through the resolved plants:
  // the question is which regions mention this animal, and the table answers it
  // without fetching a single plant list.
  const ids = new Set(
    Object.entries(SUPPORT)
      .filter(([, byPlant]) =>
        Object.values(byPlant).some((links) => links.some((l) => l.wildlifeId === wildlifeId))
      )
      .map(([regionId]) => regionId)
  );
  return REGIONS.filter((r) => ids.has(r.meta.id));
}

/** One row of the browse index: an animal plus how widely it's supported. */
export interface WildlifeIndexRow {
  wildlife: Wildlife;
  /** Supporting plants **within the scope asked for** — every region, or the
   *  one the index was filtered to. */
  plantCount: number;
  /** Every region whose roster carries a plant supporting it, in the app's
   *  usual order — the animal's regions, regardless of any filter, so a card
   *  can say where it lives rather than just how many places. */
  regionIds: string[];
}

/** The whole index computed once: the joins below walk every region's roster
 *  for every animal, and the answer can't change at runtime. */
interface IndexEntry {
  wildlife: Wildlife;
  total: number;
  byRegion: Map<string, number>;
}
let entryCache: IndexEntry[] | null = null;

// Counted from the tie table, not from resolved plants: the browse index needs
// *how many* plants support each animal in each region, which is a count of
// ties. Going through the plants would have meant downloading all nine region
// lists to draw an index of animals. `auditSupport` is what makes the two the
// same number — it fails in development if a tie names a plant no roster has.
function indexEntries(): IndexEntry[] {
  if (entryCache) return entryCache;
  const entries: IndexEntry[] = [];
  for (const wildlife of WILDLIFE) {
    const byRegion = new Map<string, number>();
    let total = 0;
    for (const [regionId, byPlant] of Object.entries(SUPPORT)) {
      if (!regionById.has(regionId)) continue;
      for (const links of Object.values(byPlant)) {
        if (!links.some((l) => l.wildlifeId === wildlife.id)) continue;
        byRegion.set(regionId, (byRegion.get(regionId) ?? 0) + 1);
        total++;
      }
    }
    if (!total) continue;
    entries.push({ wildlife, total, byRegion });
  }
  entryCache = entries;
  return entries;
}

/**
 * The browse index: every catalog animal that at least one mapped plant
 * supports, with a count and the regions it's found in. Animals with no ties
 * yet are left out rather than shown as empty dead ends.
 *
 * Pass a region id to narrow it to the animals that region's plants support —
 * the `#/wildlife/in/<region>` view. The count then means "plants **on that
 * region's list** that support it", because a figure counting five regions'
 * plants under a heading naming one would be a lie.
 */
export function wildlifeIndex(regionId?: string): WildlifeIndexRow[] {
  return indexEntries()
    .filter((e) => !regionId || e.byRegion.has(regionId))
    .map((e) => ({
      wildlife: e.wildlife,
      plantCount: regionId ? (e.byRegion.get(regionId) ?? 0) : e.total,
      regionIds: REGIONS.filter((r) => e.byRegion.has(r.meta.id)).map((r) => r.meta.id),
    }));
}

/** Total distinct animals with at least one mapped plant — for the index lede. */
export function mappedWildlifeCount(): number {
  return indexEntries().length;
}

let countCache: Map<string, number> | null = null;

/** How many animals each region's plants support — the wildlife index's region
 *  filter, and the region stat tiles. A region absent from the map has nothing
 *  mapped yet, which is why the filter can leave it out instead of offering a
 *  choice that leads to an empty list. */
export function wildlifeCountsByRegion(): Map<string, number> {
  if (countCache) return countCache;
  const counts = new Map<string, number>();
  for (const e of indexEntries()) {
    for (const id of e.byRegion.keys()) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  countCache = counts;
  return counts;
}

/**
 * Distinct catalog animals with at least one documented tie to a plant in this
 * region's roster — the region page's "wildlife these plants support" figure,
 * and the same number the region filter on the wildlife index shows, because
 * both read it off the one index. Same defensive joins as everywhere else: a
 * tie pointing at a plant the roster doesn't carry, or an animal the catalog
 * doesn't know, counts for nothing.
 */
export function wildlifeCountForRegion(regionId: string): number {
  return wildlifeCountsByRegion().get(regionId) ?? 0;
}

/**
 * Dev-only integrity check: every plant id referenced in SUPPORT must exist in
 * its region's roster, and every wildlifeId must be in the catalog. Called once
 * at module load in dev so a typo in a tie is caught immediately, not silently
 * dropped. Costs nothing in production (tree-shaken via import.meta.env.DEV).
 */
export async function auditSupport(): Promise<string[]> {
  const problems: string[] = [];
  // The hard invariant: every listed animal must be native and cite where it's
  // native. The `native: true` literal type already blocks this at compile
  // time; this is the belt-and-suspenders runtime guarantee.
  const catalogIds = new Set<string>();
  const latinSeen = new Map<string, string>();
  for (const w of WILDLIFE) {
    if (w.native !== true) problems.push(`wildlife "${w.id}" is not marked native`);
    if (!w.nativeBasis?.trim()) problems.push(`wildlife "${w.id}" has no native-status source`);
    // The region stat tiles count catalog entries once each, so the same
    // animal listed twice — under a repeated id (the Map above would silently
    // keep only one) or the same binomial under two ids — would double count.
    if (catalogIds.has(w.id)) problems.push(`wildlife id "${w.id}" appears twice in the catalog`);
    catalogIds.add(w.id);
    const latin = w.latin?.trim().toLowerCase();
    if (latin) {
      const prev = latinSeen.get(latin);
      if (prev) problems.push(`wildlife "${w.id}" repeats the latin name of "${prev}" (${w.latin})`);
      else latinSeen.set(latin, w.id);
    }
  }
  for (const [regionId, byPlant] of Object.entries(SUPPORT)) {
    const region = regionById.get(regionId);
    if (!region) {
      problems.push(`SUPPORT references unknown region "${regionId}"`);
      continue;
    }
    const roster = await loadPlants(region);
    const ids = new Set(roster.map((p) => p.id));
    // A plant id repeated in a seed list would inflate every roster-derived
    // figure (plant count, keystone count) and show the plant twice.
    if (ids.size !== roster.length) {
      const seen = new Set<string>();
      for (const p of roster) {
        if (seen.has(p.id)) problems.push(`${regionId}: plant "${p.id}" appears twice in the roster`);
        seen.add(p.id);
      }
    }
    for (const [plantId, links] of Object.entries(byPlant)) {
      if (!ids.has(plantId)) {
        problems.push(`${regionId}: no plant "${plantId}" in roster`);
      }
      const tied = new Set<string>();
      for (const link of links) {
        if (!wildlifeById.has(link.wildlifeId)) {
          problems.push(`${regionId}/${plantId}: unknown wildlife "${link.wildlifeId}"`);
        }
        // Two ties from one plant to one animal is authoring noise: the plant
        // page would show the animal twice (counts already dedupe via Sets).
        if (tied.has(link.wildlifeId)) {
          problems.push(`${regionId}/${plantId}: duplicate tie to "${link.wildlifeId}"`);
        }
        tied.add(link.wildlifeId);
        // Every plant↔animal relationship must cite a reliable source — the
        // relationship is a claim, and claims here are checkable or they don't ship.
        if (!link.basis?.trim()) {
          problems.push(`${regionId}/${plantId}: tie to "${link.wildlifeId}" has no source`);
        }
      }
    }
  }
  return problems;
}

if (import.meta.env.DEV) {
  void auditSupport().then((problems) => {
    if (problems.length) {
      console.warn("[wildlife] SUPPORT integrity problems:\n" + problems.join("\n"));
    }
  });
}
