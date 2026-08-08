// Tying an iNaturalist observation to something you planted — the app's answer
// to "can I keep progress photos?"
//
// The honest answer to that question is no, not here. A season of phone photos
// is tens of megabytes; browser storage is a quota the browser may reclaim
// without asking, and losing three years of a garden's record to a storage
// sweep is the worst failure this app could have. So the picture stays where
// the gardener already put it, and the log keeps the thread back to it: one
// number per observation, and nothing else.
//
// That trade turns out to be the better feature, for a reason particular to
// this app. Anyone who posts plants from home has good cause to obscure their
// observations — iNaturalist blurs the point to a ~20 km box, which is exactly
// what you want strangers to see. But the blur is also all *you* get back, and
// "somewhere in this county" is no use for remembering which corner of the
// garden a plant went into. Indigene already knows the precise spot, and knows
// it in the one place that can't leak: this device. Linking the two gives the
// gardener a private record with real precision, while the public observation
// stays as blurred as they set it. Nothing is uploaded, nothing is changed, and
// iNaturalist is never told the two are connected.
import { InatError, summarizeObservations, type ObservationSummary } from "./inaturalist";
import { CACHE_TTL_MS } from "./nearby";
import { getCachedObservations, putCachedObservations } from "../db";

const API_BASE = "https://api.inaturalist.org/v1/observations";

/** Where a reader goes to see the observation itself. */
export function observationUrl(id: number): string {
  return `https://www.inaturalist.org/observations/${id}`;
}

/**
 * Read an observation id out of whatever the gardener pasted.
 *
 * People paste the address bar, and the address bar is rarely the tidy form:
 * it may carry a locale prefix (`/es/observations/…`), a query string, a
 * trailing slash, or be the bare number they read off the page. All of those
 * are the same answer, so all of them are accepted; anything else returns null
 * and the field says so rather than storing a number that means nothing.
 */
export function parseObservationRef(input: string): number | null {
  const raw = input.trim();
  if (!raw) return null;
  const bare = /^\d+$/.test(raw) ? raw : /\/observations\/(\d+)/.exec(raw)?.[1];
  const id = bare ? Number(bare) : NaN;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Fetch one observation by id and trim it the same way every other iNaturalist
 * response is trimmed (`summarizeObservations`) — so a linked sighting renders
 * with the same card, the same licence check and the same credit as the ones on
 * a plant's page.
 *
 * Returns null when the observation doesn't exist, was deleted, or carries no
 * licensed photo: all three mean "there's nothing we may show", and the log
 * falls back to a plain link. Rejects only on network/HTTP failure, so a caller
 * can tell "no signal" from "nothing to show".
 */
export async function fetchObservation(
  id: number,
  signal?: AbortSignal
): Promise<ObservationSummary | null> {
  const res = await fetch(`${API_BASE}/${id}`, { signal });
  if (res.status === 404) return null;
  if (!res.ok) throw new InatError(res.status, "observation");
  const data = await res.json();
  // No `from`: an observation the gardener linked by hand isn't the answer to a
  // "what's near me" question, and a distance from anywhere would be noise.
  return summarizeObservations(data?.results, null)[0] ?? null;
}

/**
 * The same fetch, through the observation cache — one request per linked
 * observation per week, and **the cached copy is kept as the offline answer**.
 *
 * A planting log is read on a phone standing in a garden, which is exactly
 * where the signal isn't. So a failed fetch falls back to whatever was stored
 * last time rather than blanking a picture the device already has; only a link
 * that has never once loaded reports the failure. A deleted or unshowable
 * observation caches as an empty record, so "there's nothing to show here" is
 * learned once rather than re-asked every time the page is opened.
 */
export async function linkedObservation(
  id: number,
  now: number = Date.now()
): Promise<ObservationSummary | null> {
  const key = `obs:${id}`;
  const cached = await getCachedObservations(key).catch(() => undefined);
  if (cached && now - cached.capturedAt <= CACHE_TTL_MS) return cached.observations[0] ?? null;
  try {
    const observation = await fetchObservation(id);
    await putCachedObservations({
      key,
      capturedAt: now,
      observations: observation ? [observation] : [],
    }).catch(() => {});
    return observation;
  } catch (err) {
    if (cached) return cached.observations[0] ?? null;
    throw err;
  }
}
