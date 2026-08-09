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

/**
 * How one observation is named, in whichever of iNaturalist's two ways the
 * gardener had to hand: the number in its address bar (`384926161`), or the
 * UUID its own page offers a copy button for
 * (`776ee855-bf3d-4030-8c45-4c8424b03a56`).
 *
 * Both are kept as text, exactly as given. Canonicalizing a UUID to its number
 * would mean a network call before anything could be saved — so a link pasted
 * on a phone with no signal would fail to save at all, which is precisely the
 * moment somebody is standing in the garden doing this.
 */
export type ObservationRef = string;

/** True for the UUID form. The two forms are fetched differently — see
 *  `fetchObservation` — and this is the one place that tells them apart. */
export function isUuid(ref: ObservationRef): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(ref);
}

/** Where a reader goes to see the observation itself. Given a resolved
 *  observation, pass its number: that is the address iNaturalist's own pages
 *  link to, and the one a person can read and recognise. */
export function observationUrl(ref: ObservationRef | number): string {
  return `https://www.inaturalist.org/observations/${ref}`;
}

/**
 * Read an observation's name out of whatever the gardener pasted.
 *
 * iNaturalist hands out two of them and this takes either, because which one
 * you have depends only on which button you happened to press. The address bar
 * gives a link with a number in it; the observation's own page has a copy
 * button that gives a UUID and nothing else. Someone who has copied a UUID has
 * no easy way to find the number, so refusing it would send them back to the
 * site to hunt for a different string that means the same thing.
 *
 * Every reasonable shape of both is accepted: a bare number, a bare UUID, and
 * any link containing either — the address bar is rarely tidy, and may carry a
 * locale prefix (`/es/observations/…`), a query string or a trailing slash.
 * Anything else returns null and the field says so, rather than storing a
 * reference that names nothing.
 */
export function parseObservationRef(input: string): ObservationRef | null {
  const raw = input.trim().toLowerCase();
  if (!raw) return null;
  const uuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.exec(raw)?.[0];
  if (uuid) return uuid;
  const digits = /^\d+$/.test(raw) ? raw : /\/observations\/(\d+)/.exec(raw)?.[1];
  if (!digits) return null;
  const id = Number(digits);
  return Number.isSafeInteger(id) && id > 0 ? String(id) : null;
}

/**
 * Fetch one observation and trim it the same way every other iNaturalist
 * response is trimmed (`summarizeObservations`) — so a linked sighting renders
 * with the same card, the same licence check and the same credit as the ones on
 * a plant's page.
 *
 * The two forms take two different endpoints, because iNaturalist's
 * `/observations/<id>` answers 422 to a UUID rather than resolving it. A UUID
 * goes to the search endpoint's own `uuid=` filter instead, which returns the
 * same one-row `results` array — so the trim, the cache and everything
 * downstream can't tell the two apart.
 *
 * Returns null when the observation doesn't exist, was deleted, or carries no
 * licensed photo: all three mean "there's nothing we may show", and the log
 * falls back to a plain link. Rejects only on network/HTTP failure, so a caller
 * can tell "no signal" from "nothing to show".
 */
export async function fetchObservation(
  ref: ObservationRef,
  signal?: AbortSignal
): Promise<ObservationSummary | null> {
  const url = isUuid(ref)
    ? `${API_BASE}?uuid=${encodeURIComponent(ref)}`
    : `${API_BASE}/${encodeURIComponent(ref)}`;
  const res = await fetch(url, { signal });
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
  ref: ObservationRef,
  now: number = Date.now()
): Promise<ObservationSummary | null> {
  const key = `obs:${ref}`;
  const cached = await getCachedObservations(key).catch(() => undefined);
  if (cached && now - cached.capturedAt <= CACHE_TTL_MS) return cached.observations[0] ?? null;
  try {
    const observation = await fetchObservation(ref);
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
