// The query layer over the native-alternatives dataset. The data
// (`data/alternatives.ts`) stores the ties in the natural authoring direction —
// ornamental → the natives that stand in for it — because that's the direction
// a reader arrives in ("I want a lawn / a hedge / a butterfly plant; what native
// does that?") and the direction each row is audited in.
//
// It resolves plant ids through the same `loadPlants` path the rest of the app
// uses, so a swap pointing at a plant no roster carries is dropped rather than
// rendered as a broken row (guarded here, and surfaced in dev by
// `auditAlternatives`).
import type { AlternativeLink, Ornamental, Plant } from "../types";
import type { RegionDef } from "../data/region";
import { REGIONS, loadPlants } from "./plants";
import { ALTERNATIVES, ORNAMENTALS } from "../data/alternatives";

const ornamentalById = new Map(ORNAMENTALS.map((o) => [o.id, o]));
const ornamentalByLatin = new Map(ORNAMENTALS.map((o) => [o.latin.trim().toLowerCase(), o]));

/** The catalog entry for an id, or undefined if it isn't one we know. */
export function getOrnamental(id: string): Ornamental | undefined {
  return ornamentalById.get(id);
}

/** The ornamental for a scientific name — how the look-alike layer finds the
 *  swap for an impostor people plant on purpose (a butterfly bush, a Norway
 *  maple), so its page can point to "grow a native instead". */
export function getOrnamentalByLatin(latin: string): Ornamental | undefined {
  return ornamentalByLatin.get(latin.trim().toLowerCase());
}

/** One native that stands in for an ornamental, resolved to plant + tie. */
export interface NativeForOrnamental {
  region: RegionDef;
  plant: Plant;
  link: AlternativeLink;
}

/**
 * Every native that stands in for this ornamental, across all regions. This is
 * why the ornamental gets a page of its own rather than living inside each
 * plant's: Bermuda grass is replaced by different natives in the Mid-Atlantic
 * and in Florida, and describing it twice would be describing it twice. Swaps
 * pointing at a plant the roster doesn't carry are skipped.
 */
export async function nativesForOrnamental(ornamentalId: string): Promise<NativeForOrnamental[]> {
  const out: NativeForOrnamental[] = [];
  for (const region of REGIONS) {
    const links = ALTERNATIVES[region.meta.id]?.[ornamentalId];
    if (!links?.length) continue;
    const plants = await loadPlants(region);
    for (const link of links) {
      const plant = plants.find((p) => p.id === link.plantId);
      if (plant) out.push({ region, plant, link });
    }
  }
  return out;
}

/** One ornamental a plant is offered as a native alternative to — the inverse
 *  of `nativesForOrnamental`, and the shape the plant's own page reads. */
export interface OrnamentalForPlant {
  ornamental: Ornamental;
  link: AlternativeLink;
}

/**
 * The ornamentals a specific native stands in for, in one region — for the
 * compact "grow it instead of" line on its profile page. Keyed by region
 * because a plant on two rosters may replace different ornamentals in each.
 */
export function ornamentalsForPlant(regionId: string, plantId: string): OrnamentalForPlant[] {
  const byOrnamental = ALTERNATIVES[regionId];
  if (!byOrnamental) return [];
  const out: OrnamentalForPlant[] = [];
  for (const [ornamentalId, links] of Object.entries(byOrnamental)) {
    const link = links.find((l) => l.plantId === plantId);
    if (!link) continue;
    const ornamental = ornamentalById.get(ornamentalId);
    if (ornamental) out.push({ ornamental, link });
  }
  return out;
}

/** One row of the browse index: an ornamental plus the natives it can be
 *  swapped for and where. */
export interface AlternativeIndexRow {
  ornamental: Ornamental;
  /** The natives it can be replaced with, in the app's usual region order. */
  natives: NativeForOrnamental[];
  /** Region ids it turns up in — for the "where does this matter" chips. */
  regionIds: string[];
}

/**
 * The ornamentals that at least one region ties to a native — by id, straight
 * from the tie table.
 *
 * The router asks this on every navigation (is `#/alternatives/<x>` a real
 * page?) and the prerenderer asks it for the page list. Neither needs a plant,
 * and neither can afford to wait on downloads to answer.
 */
export function mappedOrnamentalIds(regionId?: string): Set<string> {
  const out = new Set<string>();
  for (const [id, byOrnamental] of Object.entries(ALTERNATIVES)) {
    if (regionId && id !== regionId) continue;
    for (const ornamentalId of Object.keys(byOrnamental)) out.add(ornamentalId);
  }
  return out;
}

/** The whole index computed once — the joins walk every region's roster for
 *  every ornamental, and the answer can't change at runtime. */
let indexCache: AlternativeIndexRow[] | null = null;

/**
 * The browse index: every catalog ornamental at least one mapped native stands
 * in for. One with no swaps yet is left out rather than shown as an empty dead
 * end — the same rule the look-alike and wildlife indexes follow.
 *
 * Pass a region id to narrow it to the ornamentals that matter there.
 */
export async function alternativeIndex(regionId?: string): Promise<AlternativeIndexRow[]> {
  if (!indexCache) {
    indexCache = [];
    for (const ornamental of ORNAMENTALS) {
      const natives = await nativesForOrnamental(ornamental.id);
      if (!natives.length) continue;
      const regionIds = [...new Set(natives.map((n) => n.region.meta.id))];
      indexCache.push({ ornamental, natives, regionIds });
    }
  }
  return regionId
    ? indexCache
        .filter((r) => r.regionIds.includes(regionId))
        .map((r) => ({ ...r, natives: r.natives.filter((n) => n.region.meta.id === regionId) }))
    : indexCache;
}

/** Total ornamentals with at least one mapped native — for the index lede. */
export function mappedOrnamentalCount(): number {
  return mappedOrnamentalIds().size;
}

/** How many ornamentals a region has swaps for — used to decide whether a
 *  region has anything to say on the subject yet. */
export function alternativeCountForRegion(regionId: string): number {
  return Object.keys(ALTERNATIVES[regionId] ?? {}).length;
}

/**
 * Where to go and look at the ornamental: iNaturalist's own taxon search, by
 * scientific name — the same choice `inatSearchUrl` in `lib/lookalikes.ts`
 * makes, and for the same reason (a name search follows synonymy and can't rot
 * into the wrong species the way a hand-copied id can).
 */
export function inatSearchUrl(latin: string): string {
  return `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(latin)}`;
}

/**
 * Dev-only integrity check, in the same spirit as `auditLookalikes`: every
 * plant id referenced in ALTERNATIVES must exist in its region's roster, every
 * ornamental id must be in the catalog, every swap must cite a source, and
 * every edge must fill in *both* sides — a one-sided edge ("the native needs no
 * water") is half a sentence without what the ornamental needs instead.
 */
export async function auditAlternatives(): Promise<string[]> {
  const problems: string[] = [];
  const catalogIds = new Set<string>();
  const latinSeen = new Map<string, string>();
  for (const o of ORNAMENTALS) {
    if (catalogIds.has(o.id)) problems.push(`ornamental id "${o.id}" appears twice in the catalog`);
    catalogIds.add(o.id);
    const latin = o.latin.trim().toLowerCase();
    const prev = latinSeen.get(latin);
    if (prev) problems.push(`ornamental "${o.id}" repeats the latin name of "${prev}" (${o.latin})`);
    else latinSeen.set(latin, o.id);
    if (!o.originBasis.trim()) problems.push(`ornamental "${o.id}" has no source for where it's from`);
    if (!o.role.trim()) problems.push(`ornamental "${o.id}" has no role — say what it's planted for`);
  }
  const regionById = new Map(REGIONS.map((r) => [r.meta.id, r]));
  for (const [regionId, byOrnamental] of Object.entries(ALTERNATIVES)) {
    const region = regionById.get(regionId);
    if (!region) {
      problems.push(`ALTERNATIVES references unknown region "${regionId}"`);
      continue;
    }
    const roster = await loadPlants(region);
    const ids = new Set(roster.map((p) => p.id));
    for (const [ornamentalId, links] of Object.entries(byOrnamental)) {
      if (!ornamentalById.has(ornamentalId)) {
        problems.push(`${regionId}: unknown ornamental "${ornamentalId}"`);
      }
      const seen = new Set<string>();
      for (const link of links) {
        if (!ids.has(link.plantId)) problems.push(`${regionId}/${ornamentalId}: no plant "${link.plantId}" in roster`);
        // Two swaps from one ornamental to one native print the same card twice.
        if (seen.has(link.plantId)) {
          problems.push(`${regionId}/${ornamentalId}: duplicate swap to "${link.plantId}"`);
        }
        seen.add(link.plantId);
        if (!link.basis.trim()) problems.push(`${regionId}/${ornamentalId}: swap to "${link.plantId}" has no source`);
        if (!link.why.trim()) problems.push(`${regionId}/${ornamentalId}: swap to "${link.plantId}" has no reason`);
        for (const edge of link.edges) {
          if (!edge.native.trim() || !edge.ornamental.trim()) {
            problems.push(`${regionId}/${ornamentalId}: swap to "${link.plantId}" has a one-sided ${edge.axis} edge`);
          }
        }
      }
    }
  }
  return problems;
}

if (import.meta.env.DEV) {
  void auditAlternatives().then((problems) => {
    if (problems.length) {
      console.warn("[alternatives] ALTERNATIVES integrity problems:\n" + problems.join("\n"));
    }
  });
}
