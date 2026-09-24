// Bringing a gardener's own iNaturalist sightings into Indigene.
//
// The linked account (`lib/inat-account.ts`) is asked for its recent plant
// observations, and each one is sorted against the *spot's own region*:
//
//   - **A native on this region's list** is offered as something planted here.
//     Any quality grade counts. A garden plant is marked cultivated on
//     iNaturalist, which caps it at "casual" for good, so asking for community
//     agreement would throw away nearly every one. The cost of a wrong name is
//     a wrong size estimate, and the gardener ticks each one themselves.
//   - **An invasive on this region's list** is offered as something to deal
//     with — but only when it's research grade (other people agree on the
//     species) and wild. A wrong "invasive" gets a healthy plant pulled out,
//     so that verdict waits for someone other than the gardener.
//
// iNaturalist decides only whether a name can be trusted; *native* and
// *invasive* come from the catalog's list for the region, never from
// iNaturalist's own labels. That's what keeps black locust a native in the
// Mid-Atlantic and an invasive in France.
//
// **What's asked for.** One request per page of results, naming the fields it
// wants (the v2 API takes a list), and none of them is a location: not the
// point, not the obscured box, not the place name. Indigene doesn't need to
// know where a sighting was to file it — the gardener picks the spot.
import { InatError, licensedPhotos, type ObservationPhoto } from "./inaturalist";
import { isValidLogin } from "./inat-account";
import { entryByInatId, normalizeName, registryIndex } from "./registry";
import { mostWanted } from "./invasives";
import { inatTaxonIdFor } from "./hero-photo";
import { lookalikesForPlant, type LookalikeForPlant } from "./lookalikes";
import type { RegionDef } from "./plants";
import type { Invasive, Plant, PlantedDate, Planting, SavedSpot } from "../types";

const API = "https://api.inaturalist.org/v2/observations";

/** How far back "recent" reaches: a year, so a whole season's planting fits. */
export const LOOKBACK_DAYS = 365;

/** Up to 200 a page, and at most this many pages. A gardener posting more than
 *  600 plants a year is rare, and the page says when the list was cut short. */
const PER_PAGE = 200;
const MAX_PAGES = 3;

/** The pause between pages. iNaturalist asks API clients to stay around one
 *  request a second; a free service run by a nonprofit is owed that much. */
export const PAGE_GAP_MS = 1000;

/** Exactly what's asked for — and so exactly what iNaturalist is asked. */
const FIELDS = [
  "id",
  "uuid",
  "observed_on",
  "quality_grade",
  "captive",
  "taxon.id",
  "taxon.name",
  "taxon.rank",
  "photos.id",
  "photos.url",
  "photos.license_code",
  "photos.attribution",
].join(",");

/** One of the gardener's sightings, trimmed to what the import uses. */
export interface OwnSighting {
  id: number;
  uuid: string | null;
  taxonId: number;
  /** Scientific name as iNaturalist has it identified now. */
  taxonName: string;
  /** "YYYY-MM-DD", when the observation carries a date. */
  observedOn: string | null;
  /** Other people agree on the species (iNaturalist's "research grade"). */
  confirmed: boolean;
  /** Marked planted or captive — true for most garden plants. */
  cultivated: boolean;
  /** A licensed photo to show beside it, when there is one. */
  photo: ObservationPhoto | null;
}

export interface OwnSightings {
  sightings: OwnSighting[];
  /** More than `MAX_PAGES` pages existed and the rest weren't fetched. */
  truncated: boolean;
}

/** The request for one page. Exported so the one thing sent can be read. */
export function buildOwnSightingsUrl(login: string, page: number, now: number = Date.now()): string {
  if (!isValidLogin(login)) throw new Error("not an iNaturalist username");
  const since = new Date(now - LOOKBACK_DAYS * 86_400_000).toISOString().slice(0, 10);
  const params = new URLSearchParams({
    user_login: login,
    iconic_taxa: "Plantae",
    d1: since,
    order_by: "observed_on",
    order: "desc",
    per_page: String(PER_PAGE),
    page: String(page),
    fields: FIELDS,
  });
  return `${API}?${params}`;
}

/** Does iNaturalist know this username? One tiny request, answering yes, no,
 *  or throwing on no signal / a busy server so the card can tell them apart. */
export async function loginExists(login: string, signal?: AbortSignal): Promise<boolean> {
  const params = new URLSearchParams({ user_login: login, per_page: "0", fields: "id" });
  const res = await fetch(`${API}?${params}`, { signal });
  if (res.status === 422) return false; // "Unknown user_id"
  if (!res.ok) throw new InatError(res.status, "observations");
  return true;
}

/** Fetch the gardener's recent plant sightings, newest first — one page at a
 *  time, `PAGE_GAP_MS` apart. `net` stands in for the network in the checks. */
export async function fetchOwnSightings(
  login: string,
  signal?: AbortSignal,
  net: { fetch: typeof fetch; wait: (ms: number) => Promise<void> } = {
    fetch: (...args) => fetch(...args),
    wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  }
): Promise<OwnSightings> {
  const sightings: OwnSighting[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    if (page > 1) await net.wait(PAGE_GAP_MS);
    const res = await net.fetch(buildOwnSightingsUrl(login, page), { signal });
    if (!res.ok) throw new InatError(res.status, "observations");
    const data = await res.json();
    const results: unknown[] = Array.isArray(data?.results) ? data.results : [];
    sightings.push(...trimOwnSightings(results));
    const total = Number(data?.total_results) || 0;
    if (page * PER_PAGE >= total || results.length < PER_PAGE) return { sightings, truncated: false };
  }
  return { sightings, truncated: true };
}

/** Keep the rows with an identified species and an id; drop the rest. */
export function trimOwnSightings(results: unknown[]): OwnSighting[] {
  const out: OwnSighting[] = [];
  for (const r of results as any[]) {
    const id = Number(r?.id);
    const taxonId = Number(r?.taxon?.id);
    const taxonName = typeof r?.taxon?.name === "string" ? r.taxon.name : null;
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(taxonId) || !taxonName) continue;
    const observedOn = typeof r?.observed_on === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.observed_on) ? r.observed_on : null;
    const uuid = typeof r?.uuid === "string" && /^[0-9a-f-]{36}$/.test(r.uuid) ? r.uuid : null;
    out.push({
      id,
      uuid,
      taxonId,
      taxonName,
      observedOn,
      confirmed: r?.quality_grade === "research",
      cultivated: r?.captive === true,
      photo: licensedPhotos(r)[0] ?? null,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Sorting sightings against a region's lists.
// ---------------------------------------------------------------------------

/** A native on the region's list that the gardener has photographed. */
export interface NativeMatch {
  sighting: OwnSighting;
  plant: Plant;
  /** Already linked to a row in this spot's log — shown, but not offered. */
  inLog: boolean;
  /** Invasive look-alikes in this region: the one case where a wrong name
   *  matters, because the gardener may be growing the impostor. */
  lookalikes: LookalikeForPlant[];
}

/** An invasive on the region's list that the gardener has photographed. */
export interface InvasiveMatch {
  sighting: OwnSighting;
  invasive: Invasive;
  /** Already on this spot's list — shown, but not offered. */
  onList: boolean;
}

export interface Sorted {
  natives: NativeMatch[];
  /** Research grade and wild: safe to act on. */
  invasives: InvasiveMatch[];
  /** On the list but not confirmed by anyone else yet, or marked planted. */
  unconfirmed: InvasiveMatch[];
}

/**
 * Sort sightings into the three groups the import page shows, for one spot.
 *
 * Each species appears once per group — the newest sighting of it — because
 * the question is "did you plant this", not "how often did you photograph it".
 */
export function sortSightings(
  sightings: OwnSighting[],
  region: RegionDef,
  roster: Plant[],
  spot: SavedSpot,
  plantings: Planting[]
): Sorted {
  const nativeIds = new Set(roster.map((p) => p.id));
  const byId = new Map(roster.map((p) => [p.id, p]));
  const linked = new Set(plantings.flatMap((p) => p.observations));
  const onList = new Set((spot.invasives ?? []).map((i) => i.invasiveId));

  // The region's invasives, by taxon id and by name. A plant that is native
  // here is never one of them, whatever another region's list says.
  const wanted = mostWanted(region.meta.id).map((r) => r.invasive).filter((i) => !nativeIds.has(i.id));
  const invasiveByTaxon = new Map<number, Invasive>();
  const invasiveByName = new Map<string, Invasive>();
  for (const inv of wanted) {
    const taxon = inatTaxonIdFor("invasive", inv.id);
    if (taxon) invasiveByTaxon.set(taxon, inv);
    invasiveByName.set(normalizeName(inv.latin), inv);
  }

  const out: Sorted = { natives: [], invasives: [], unconfirmed: [] };
  const seen = new Set<string>();
  for (const s of sightings) {
    const plantId = nativePlantId(s, nativeIds);
    if (plantId) {
      if (seen.has(`n:${plantId}`)) continue;
      seen.add(`n:${plantId}`);
      out.natives.push({
        sighting: s,
        plant: byId.get(plantId)!,
        inLog: linked.has(String(s.id)) || (s.uuid !== null && linked.has(s.uuid)),
        lookalikes: lookalikesForPlant(region.meta.id, plantId).filter((l) => l.link.status === "invasive"),
      });
      continue;
    }
    const invasive = invasiveByTaxon.get(s.taxonId) ?? invasiveByName.get(normalizeName(s.taxonName));
    if (!invasive || seen.has(`i:${invasive.id}`)) continue;
    seen.add(`i:${invasive.id}`);
    const match = { sighting: s, invasive, onList: onList.has(invasive.id) };
    if (s.confirmed && !s.cultivated) out.invasives.push(match);
    else out.unconfirmed.push(match);
  }
  return out;
}

/** The catalog plant a sighting is of, if it's a native on this roster: by
 *  iNaturalist taxon id first, then by exact scientific name. */
function nativePlantId(s: OwnSighting, nativeIds: Set<string>): string | null {
  const byTaxon = entryByInatId(String(s.taxonId))?.identifiers.indigene;
  if (byTaxon && nativeIds.has(byTaxon)) return byTaxon;
  // The scientific name only — never a common name, which can belong to a
  // different plant in another country.
  const id = registryIndex.bySci.get(normalizeName(s.taxonName))?.identifiers.indigene;
  return id && nativeIds.has(id) ? id : null;
}

/** When the sighting was taken, as a planting date: the plant was in the
 *  ground *by* then, which is the modest reading `lib/garden.ts` wants. */
export function plantedBy(s: OwnSighting): PlantedDate | null {
  if (!s.observedOn) return null;
  const [year, month, day] = s.observedOn.split("-").map(Number);
  return { year, month, day };
}
