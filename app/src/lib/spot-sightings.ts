// Who has actually been seen around a saved spot — the animals its plants can
// feed, photographed nearby on iNaturalist.
//
// A spot's page already says which animals its plants *can* feed (documented
// ties, `lib/spot-value.ts`). This asks the one question that makes that list
// feel real: are any of them around here? Two answers, from one taxon list:
//
//   - **counts**: how many verified sightings of each animal within
//     `SPOT_RADIUS_KM`, ever — a "seen nearby" badge on each animal.
//   - **recent**: the latest photographed sightings of any of them, since the
//     first thing in this spot went in (or the past year, when no date was
//     logged) — so the page can say "since you planted" and show them.
//
// Plus, with a linked account, the gardener's own sightings of the same animals
// in that window — asked for by username alone, with no place attached, and
// kept only when they fall within the radius of the spot.
//
// **It never claims the plants brought them.** A sighting nearby is a sighting
// nearby; the page says so in as many words.
//
// **Privacy.** A spot's coordinates are promised to stay on the device, so
// nothing here runs until the person asks (see `steps/spot.ts`), and what goes
// to iNaturalist is a point rounded to 0.01° — about a kilometre — never the
// spot itself. Distances are measured locally, from the real spot.
//
// One request per question, not one per animal: the taxon ids are pinned ahead
// of time (`data/wildlife-taxa.json`, `npm run wildlife:taxa`), so a garden
// feeding thirty animals still asks iNaturalist twice. iNaturalist's
// `taxon_id` matches descendants, so a sighting may come back as a subspecies
// (or, for a genus like *Bombus*, a species) — `animalFor` walks its ancestry
// back to the animal we asked about.
import TAXA from "../data/wildlife-taxa.json";
import { kvGet, kvSet } from "../db";
import { InatError, summarizeObservations, type ObservationSummary } from "./inaturalist";
import { CACHE_TTL_MS } from "./nearby";

const API = "https://api.inaturalist.org/v1/observations";

/** "Around here": close enough to be the same neighbourhood's wildlife, wide
 *  enough that a suburban garden has some sightings to show. */
export const SPOT_RADIUS_KM = 5;

/** What the request carries instead of the spot: about a kilometre. */
const STEP = 0.01;

/** Sightings asked for, and at most this many of one animal kept, so one
 *  well-photographed robin can't fill the whole gallery. */
const PER_PAGE = 60;
const PER_ANIMAL = 3;

const PINNED = TAXA as Record<string, number>;

/** The animal's pinned iNaturalist taxon id, when it has one. */
export function taxonFor(wildlifeId: string): number | undefined {
  return PINNED[wildlifeId];
}

/** The point sent to iNaturalist: the spot rounded to `STEP`. */
export function roundedPoint(lat: number, lon: number): { lat: number; lon: number } {
  const r = (n: number): number => Number((Math.round(n / STEP) * STEP).toFixed(2));
  return { lat: r(lat), lon: r(lon) };
}

/** taxon id → animal id, for the animals asked about. */
export function taxaFor(wildlifeIds: readonly string[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const id of wildlifeIds) {
    const taxon = taxonFor(id);
    if (taxon != null) map.set(taxon, id);
  }
  return map;
}

/** Which of our animals a returned taxon is: itself, or the nearest ancestor we
 *  asked about. Null when it's none of them. */
export function animalFor(taxon: unknown, taxa: Map<number, string>): string | null {
  const t = taxon as { id?: unknown; ancestor_ids?: unknown } | null;
  if (typeof t?.id === "number" && taxa.has(t.id)) return taxa.get(t.id)!;
  const ancestors = Array.isArray(t?.ancestor_ids) ? (t!.ancestor_ids as unknown[]) : [];
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const a = ancestors[i];
    if (typeof a === "number" && taxa.has(a)) return taxa.get(a)!;
  }
  return null;
}

interface Query {
  lat: number;
  lon: number;
  taxonIds: readonly number[];
  /** "YYYY-MM-DD": only sightings on or after it. */
  since?: string;
  /** Only this account's sightings, at any quality grade — and then no place is
   *  sent at all. */
  login?: string;
}

function params(q: Query): URLSearchParams {
  const out = new URLSearchParams({ taxon_id: q.taxonIds.join(",") });
  // A username and a place never travel together (the privacy page promises
  // it): the account's own sightings are asked for by name alone, and the ones
  // near the spot are picked out here, on the device.
  if (q.login) {
    out.set("user_login", q.login);
  } else {
    const p = roundedPoint(q.lat, q.lon);
    out.set("lat", String(p.lat));
    out.set("lng", String(p.lon));
    out.set("radius", String(SPOT_RADIUS_KM));
    out.set("quality_grade", "research");
  }
  if (q.since) out.set("d1", q.since);
  return out;
}

/** How many sightings of each taxon. Pure and exported so the request can be read. */
export function buildCountsUrl(q: Query): string {
  const p = params(q);
  p.set("per_page", "500");
  return `${API}/species_counts?${p}`;
}

/** The newest photographed sightings. Pure and exported for the same reason. */
export function buildRecentUrl(q: Query): string {
  const p = params(q);
  p.set("photos", "true");
  p.set("order_by", "observed_on");
  p.set("order", "desc");
  p.set("per_page", String(PER_PAGE));
  return `${API}?${p}`;
}

/** One sighting, and which of our animals it is. */
export interface SpotSighting extends ObservationSummary {
  wildlifeId: string;
}

export interface SpotSightings {
  /** Verified sightings within the radius, ever, by animal id. */
  counts: Record<string, number>;
  /** Newest first, at most `PER_ANIMAL` of any one animal. */
  recent: SpotSighting[];
  /** The linked account's own, newest first. Empty without one. */
  mine: SpotSighting[];
  capturedAt: number;
}

/** Fold a species-counts answer into counts per animal (a genus sums its species). */
export function foldCounts(results: unknown, taxa: Map<number, string>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of Array.isArray(results) ? results : []) {
    const id = animalFor(row?.taxon, taxa);
    const n = typeof row?.count === "number" ? row.count : 0;
    if (id && n > 0) counts[id] = (counts[id] ?? 0) + n;
  }
  return counts;
}

/** Trim an observations answer to tagged sightings, newest first, capped per animal. */
export function foldSightings(
  results: unknown,
  taxa: Map<number, string>,
  from: { lat: number; lon: number },
  perAnimal = PER_ANIMAL
): SpotSighting[] {
  const out: SpotSighting[] = [];
  const seen = new Map<string, number>();
  for (const row of Array.isArray(results) ? results : []) {
    const wildlifeId = animalFor(row?.taxon, taxa);
    if (!wildlifeId) continue;
    if ((seen.get(wildlifeId) ?? 0) >= perAnimal) continue;
    const [summary] = summarizeObservations([row], from);
    if (!summary) continue;
    seen.set(wildlifeId, (seen.get(wildlifeId) ?? 0) + 1);
    out.push({ ...summary, wildlifeId });
  }
  return out;
}

async function ask(url: string): Promise<unknown[]> {
  const res = await fetch(url);
  if (!res.ok) throw new InatError(res.status, "observations");
  const data = await res.json();
  return Array.isArray(data?.results) ? data.results : [];
}

/**
 * The answer for one spot, from a week-long cache when there is one. Rejects
 * only on a real fetch failure (an `InatError` for a busy server).
 */
export async function spotSightings(
  spot: { lat: number; lon: number },
  wildlifeIds: readonly string[],
  since: string | undefined,
  login: string | null,
  now: number = Date.now()
): Promise<SpotSightings> {
  const taxa = taxaFor(wildlifeIds);
  const taxonIds = [...taxa.keys()].sort((a, b) => a - b);
  if (!taxonIds.length) return { counts: {}, recent: [], mine: [], capturedAt: now };

  const p = roundedPoint(spot.lat, spot.lon);
  const key = `spot-sightings:${p.lat},${p.lon}:${since ?? ""}:${login ?? ""}:${taxonIds.join(",")}`;
  const hit = await kvGet<SpotSightings>(key).catch(() => undefined);
  if (hit && now - hit.capturedAt < CACHE_TTL_MS) return hit;

  const base = { lat: spot.lat, lon: spot.lon, taxonIds };
  const [countRows, recentRows, mineRows] = await Promise.all([
    ask(buildCountsUrl(base)),
    ask(buildRecentUrl({ ...base, since })),
    login ? ask(buildRecentUrl({ ...base, since, login })).catch(() => []) : Promise.resolve([]),
  ]);
  const result: SpotSightings = {
    counts: foldCounts(countRows, taxa),
    recent: foldSightings(recentRows, taxa, spot),
    mine: foldSightings(mineRows, taxa, spot, Infinity).filter(
      (o) => o.distanceKm != null && o.distanceKm <= SPOT_RADIUS_KM
    ),
    capturedAt: now,
  };
  await kvSet(key, result).catch(() => {});
  return result;
}

/** Whether the person has said yes to looking, for this spot. Remembered so the
 *  page fills itself in next time rather than asking again. */
export async function lookupAllowed(spotId: string): Promise<boolean> {
  return (await kvGet<boolean>(`spot-sightings-on:${spotId}`).catch(() => undefined)) === true;
}

export async function allowLookup(spotId: string): Promise<void> {
  await kvSet(`spot-sightings-on:${spotId}`, true).catch(() => {});
}
