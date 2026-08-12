// The query layer over the look-alike dataset. The data (`data/lookalikes.ts`)
// stores ties in the natural authoring direction — native plant → the impostors
// it gets mistaken for — because that's the direction a row is audited in, and
// the direction the plant page reads them.
//
// It resolves plant ids through the same `loadPlants` path the rest of the app
// uses, so a tie pointing at a plant no roster carries is dropped rather than
// rendered as a broken row (guarded here, and surfaced in dev by
// `auditLookalikes`).
import type { Lookalike, LookalikeLink, LookalikeStatus, Plant } from "../types";
import type { RegionDef } from "../data/region";
import { REGIONS, loadPlants } from "./plants";
import { CONFUSIONS, LOOKALIKES } from "../data/lookalikes";
import { REGISTRY } from "../data/registry";

const lookalikeById = new Map(LOOKALIKES.map((l) => [l.id, l]));

/** The catalog entry for an id, or undefined if it isn't one we know. */
export function getLookalike(id: string): Lookalike | undefined {
  return lookalikeById.get(id);
}

/** One impostor a plant is mistaken for, resolved to the catalog entry + tie. */
export interface LookalikeForPlant {
  lookalike: Lookalike;
  link: LookalikeLink;
}

/**
 * The impostors a specific plant is confused with, for its profile page. Keyed
 * by the region the reader is viewing the plant in: a species on two rosters
 * has two stories, and the impostor's status is one of the things that differs
 * (Mexican fan palm is merely planted in central Florida and invasive in the
 * south).
 */
export function lookalikesForPlant(regionId: string, plantId: string): LookalikeForPlant[] {
  const links = CONFUSIONS[regionId]?.[plantId] ?? [];
  const out: LookalikeForPlant[] = [];
  for (const link of links) {
    const lookalike = lookalikeById.get(link.lookalikeId);
    if (lookalike) out.push({ lookalike, link });
  }
  return out;
}

/** A native an impostor is mistaken for, with the region and the tie. The
 *  inverse of `lookalikesForPlant`, and the shape the impostor's own page is
 *  built from — one impostor, every plant it stands in for. */
export interface NativeForLookalike {
  region: RegionDef;
  plant: Plant;
  link: LookalikeLink;
}

/**
 * Every native this impostor gets mistaken for, across all regions. This is why
 * the impostor has a page of its own rather than living inside each plant's:
 * cherry laurel is confused with holly in Atlantic France and with laurustinus
 * around the Mediterranean, and describing it twice would be describing it
 * twice. Ties pointing at a plant the roster doesn't carry are skipped.
 */
export async function nativesForLookalike(lookalikeId: string): Promise<NativeForLookalike[]> {
  const out: NativeForLookalike[] = [];
  for (const region of REGIONS) {
    const byPlant = CONFUSIONS[region.meta.id];
    if (!byPlant) continue;
    // Skip a region before fetching its list when nothing there is confused
    // with this impostor — most regions, for most impostors.
    const ties = Object.values(byPlant).some((links) =>
      links.some((l) => l.lookalikeId === lookalikeId)
    );
    if (!ties) continue;
    const plants = await loadPlants(region);
    for (const [plantId, links] of Object.entries(byPlant)) {
      const link = links.find((l) => l.lookalikeId === lookalikeId);
      if (!link) continue;
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) continue;
      out.push({ region, plant, link });
    }
  }
  return out;
}

/** One row of the browse index: an impostor plus how far its reach goes. */
export interface LookalikeIndexRow {
  lookalike: Lookalike;
  /** The natives it's mistaken for, in the app's usual region order. */
  natives: NativeForLookalike[];
  /** Region ids it turns up in — for the "where does this matter" chips. */
  regionIds: string[];
  /** The strongest status any region gives it, so a card can lead with the
   *  serious case: invasive somewhere beats merely introduced everywhere. */
  worstStatus: LookalikeStatus;
}

const STATUS_RANK: Record<LookalikeStatus, number> = { invasive: 0, introduced: 1, native: 2 };

/** One status an impostor holds, and the regions that give it. */
export interface StatusRegions {
  status: LookalikeStatus;
  regions: RegionDef[];
}

/**
 * Where an impostor is what, grouped by status — the answer to "invasive
 * *where*?".
 *
 * The status is a property of a plant **in a place**, never of the plant: a
 * Douglas-fir is a planted curiosity in the French Alps and one of the Pacific
 * Northwest's great trees, and death camas is as native to a Cascade meadow as
 * the camas beside it. So nothing outside a region may print a status word on
 * its own, and this is what everything that shows one reads instead. Ordered
 * invasive → introduced → native, so the serious case leads.
 *
 * A region resolves to one status even where it carries several ties: two
 * natives confused with the same impostor in the same place cannot make it two
 * different things, and if the data ever disagreed the stronger claim is the
 * safer one to show.
 */
export function statusRegions(natives: NativeForLookalike[]): StatusRegions[] {
  const byRegion = new Map<string, { region: RegionDef; status: LookalikeStatus }>();
  for (const n of natives) {
    const seen = byRegion.get(n.region.meta.id);
    if (!seen || STATUS_RANK[n.link.status] < STATUS_RANK[seen.status]) {
      byRegion.set(n.region.meta.id, { region: n.region, status: n.link.status });
    }
  }
  const out: StatusRegions[] = [];
  for (const status of ["invasive", "introduced", "native"] as const) {
    const regions = [...byRegion.values()].filter((r) => r.status === status).map((r) => r.region);
    if (regions.length) out.push({ status, regions });
  }
  return out;
}

/** The whole index computed once — the joins walk every region's roster for
 *  every impostor, and the answer can't change at runtime. */
let indexCache: LookalikeIndexRow[] | null = null;

/**
 * The browse index: every catalog impostor at least one mapped native is
 * confused with. An impostor with no ties yet is left out rather than shown as
 * an empty dead end — the same rule the wildlife index follows.
 *
 * Pass a region id to narrow it to the impostors that matter there.
 */
/**
 * The impostors that at least one region ties to a native — by id, straight
 * from the tie table.
 *
 * The router asks this on every navigation (is `#/lookalikes/<x>` a real page?)
 * and the prerenderer asks it for the page list. Neither needs a plant, and
 * neither can afford to wait on nine downloads to answer.
 */
export function mappedLookalikeIds(regionId?: string): Set<string> {
  const out = new Set<string>();
  for (const [id, byPlant] of Object.entries(CONFUSIONS)) {
    if (regionId && id !== regionId) continue;
    for (const links of Object.values(byPlant)) {
      for (const link of links) out.add(link.lookalikeId);
    }
  }
  return out;
}

export async function lookalikeIndex(regionId?: string): Promise<LookalikeIndexRow[]> {
  if (!indexCache) {
    indexCache = [];
    for (const lookalike of LOOKALIKES) {
      const natives = await nativesForLookalike(lookalike.id);
      if (!natives.length) continue;
      const regionIds = [...new Set(natives.map((n) => n.region.meta.id))];
      const worstStatus = natives
        .map((n) => n.link.status)
        .sort((a, b) => STATUS_RANK[a] - STATUS_RANK[b])[0];
      indexCache.push({ lookalike, natives, regionIds, worstStatus });
    }
  }
  return regionId
    ? indexCache
        .filter((r) => r.regionIds.includes(regionId))
        .map((r) => ({ ...r, natives: r.natives.filter((n) => n.region.meta.id === regionId) }))
    : indexCache;
}

/** Total impostors with at least one mapped native — for the index lede. */
export function mappedLookalikeCount(): number {
  return mappedLookalikeIds().size;
}

/**
 * The other side of an honest impostor list: some of these plants are natives
 * *somewhere we cover*. Common ivy and English holly are on the Atlantic France
 * roster; Douglas-fir is one of the Pacific Northwest's great trees. Saying so
 * — and linking to the page where it's recommended — is the difference between
 * "this plant is bad" and "this plant is not from here", which is the only
 * claim the data actually supports.
 *
 * Matched on the scientific name, because that's the identity both sides carry.
 */
export async function nativeSomewhere(
  latin: string
): Promise<{ region: RegionDef; plant: Plant } | null> {
  // The registry knows which regions carry a scientific name, so this asks one
  // region for its list instead of walking all nine until it finds a match.
  const entry = REGISTRY.find((e) => e.scientificName === latin);
  const search = entry
    ? REGIONS.filter((r) => entry.regions.includes(r.meta.id))
    : [];
  for (const region of search) {
    const plant = (await loadPlants(region)).find((p) => p.latin === latin);
    if (plant) return { region, plant };
  }
  return null;
}

/**
 * Where to go and look at the impostor: iNaturalist's own taxon search, by
 * scientific name. Deliberately the *name* rather than a stored numeric taxon
 * id — the same choice the registry makes for an unreconciled native, and the
 * same one `resolveTaxon` makes for the sightings lookup. A name search follows
 * iNaturalist's synonymy and can't rot into pointing at the wrong species,
 * which a hand-copied id eventually can.
 */
export function inatSearchUrl(latin: string): string {
  return `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(latin)}`;
}

/** How many native plants in a region have at least one impostor mapped —
 *  used to decide whether a region has anything to say on the subject yet. */
export function lookalikeCountForRegion(regionId: string): number {
  return Object.keys(CONFUSIONS[regionId] ?? {}).length;
}

/**
 * Dev-only integrity check, in the same spirit as `auditSupport`: every plant
 * id referenced in CONFUSIONS must exist in its region's roster, every
 * lookalikeId must be in the catalog, every tie must cite a source, and every
 * tell must fill in *both* sides — a tell that describes only the native is
 * half a sentence, and the reader is the one left holding it.
 */
export async function auditLookalikes(): Promise<string[]> {
  const problems: string[] = [];
  const catalogIds = new Set<string>();
  const latinSeen = new Map<string, string>();
  for (const l of LOOKALIKES) {
    if (catalogIds.has(l.id)) problems.push(`lookalike id "${l.id}" appears twice in the catalog`);
    catalogIds.add(l.id);
    const latin = l.latin.trim().toLowerCase();
    const prev = latinSeen.get(latin);
    if (prev) problems.push(`lookalike "${l.id}" repeats the latin name of "${prev}" (${l.latin})`);
    else latinSeen.set(latin, l.id);
    if (!l.originBasis.trim()) problems.push(`lookalike "${l.id}" has no source for where it's from`);
  }
  const regionById = new Map(REGIONS.map((r) => [r.meta.id, r]));
  for (const [regionId, byPlant] of Object.entries(CONFUSIONS)) {
    const region = regionById.get(regionId);
    if (!region) {
      problems.push(`CONFUSIONS references unknown region "${regionId}"`);
      continue;
    }
    const roster = await loadPlants(region);
    const ids = new Set(roster.map((p) => p.id));
    for (const [plantId, links] of Object.entries(byPlant)) {
      if (!ids.has(plantId)) problems.push(`${regionId}: no plant "${plantId}" in roster`);
      const tied = new Set<string>();
      for (const link of links) {
        const known = lookalikeById.get(link.lookalikeId);
        if (!known) problems.push(`${regionId}/${plantId}: unknown lookalike "${link.lookalikeId}"`);
        // Two ties from one plant to one impostor would print the same block
        // twice on the page.
        if (tied.has(link.lookalikeId)) {
          problems.push(`${regionId}/${plantId}: duplicate tie to "${link.lookalikeId}"`);
        }
        tied.add(link.lookalikeId);
        if (!link.basis.trim()) {
          problems.push(`${regionId}/${plantId}: tie to "${link.lookalikeId}" has no source`);
        }
        if (!link.tells.length) {
          problems.push(`${regionId}/${plantId}: tie to "${link.lookalikeId}" has no tells — name a difference or drop the tie`);
        }
        for (const tell of link.tells) {
          if (!tell.feature.trim() || !tell.native.trim() || !tell.lookalike.trim()) {
            problems.push(`${regionId}/${plantId}: tie to "${link.lookalikeId}" has a one-sided tell ("${tell.feature}")`);
          }
        }
        // The contradiction that matters: calling a plant introduced or
        // invasive in the very region whose native roster recommends it. (The
        // reverse is fine — meadow death camas is native to the Pacific
        // Northwest and will never be on a list of plants to put in a garden.)
        if (known && link.status !== "native" && roster.some((p) => p.latin === known.latin)) {
          problems.push(`${regionId}/${plantId}: "${link.lookalikeId}" is marked ${link.status} in a region whose own roster lists it as native`);
        }
      }
    }
  }
  return problems;
}

if (import.meta.env.DEV) {
  void auditLookalikes().then((problems) => {
    if (problems.length) {
      console.warn("[lookalikes] CONFUSIONS integrity problems:\n" + problems.join("\n"));
    }
  });
}
