// Keeping a region's plant thumbnails on the device, for the plant lists to
// show offline — the pure half: which photos may be kept, and how fast they may
// be fetched. The browser half (the loop, the cache) is `lib/offline-save.ts`;
// the Settings card is `components/offline-photos-controls.ts`.
//
// ## What iNaturalist asks, and what we do about it
//
// Read 2026-10-25 at https://www.inaturalist.org/pages/api+recommended+practices
// (fetched as `…/api+recommended+practices.json`; the HTML page refused us):
//
//   "Please keep requests to about 1 per second, and around 10k API requests a
//    day" … "Requests exceeding this limit might be throttled, and will return
//    an HTTP 429 exception “Too Many Requests”" … "Please add delays into your
//    code to keep under these limits, and especially if you’re getting 429
//    errors" … "Downloading over 5 GB of media per hour or 24 GB of media per
//    day may result in a permanent block"
//
// And at https://api.inaturalist.org/v1/docs/ (the API's own description, same
// day):
//
//   "Photos in the `inaturalist-open-data` domain are shared under open
//    licenses. … Photos in the `static.inaturalist.org` domain do not have
//    open licenses."
//
// So: no API calls at all — every address is already in our data. One photo
// at a time, a full second after the last one finished (slower than "about 1
// per second"). The first 429, 403 or 5xx stops the run, as do a few failures
// in a row, and nothing is fetched again for a day. A region's thumbnails are
// a few hundred files and some megabytes, far inside the media limits. Only
// the open-data bucket, and only the five CC licences we display.
//
// The guidance also suggests a custom User-Agent; a browser won't let a page
// set one, so the requests carry the browser's own.

/** The licences a kept photo may carry: the ones `inat-heroes.json` and
 *  `hero-photos.json` hold, and that allow copying for non-commercial use with
 *  credit. No ND licence is listed, though keeping a byte-for-byte copy would
 *  not make a derivative anyway. */
export const KEEPABLE_LICENSES = ["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"] as const;

/** The one host whose photos are openly licensed (see above). */
export const OPEN_DATA_HOST = "inaturalist-open-data.s3.amazonaws.com";

export interface PhotoToKeep {
  url: string;
  license: string | null | undefined;
}

/**
 * Split a list into the photos we may keep and a count of the rest. A photo is
 * kept only when its stored licence is one of `KEEPABLE_LICENSES` and its file
 * sits in the open-data bucket. Anything else — another licence, no licence,
 * another host — is skipped and counted. Duplicates (two plants sharing one
 * photo) are kept once.
 */
export function keepable<T extends PhotoToKeep>(photos: T[]): { keep: T[]; skipped: number } {
  const keep: T[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const p of photos) {
    const license = (p.license ?? "").toLowerCase();
    let host = "";
    try {
      host = new URL(p.url).hostname;
    } catch {
      /* not a URL: skipped below */
    }
    if (!(KEEPABLE_LICENSES as readonly string[]).includes(license) || host !== OPEN_DATA_HOST) {
      skipped++;
      continue;
    }
    if (seen.has(p.url)) continue;
    seen.add(p.url);
    keep.push(p);
  }
  return { keep, skipped };
}

/** The pacing. A second between photos, three failures in a row ends the run,
 *  and a stop holds for a day. */
export const PACE = {
  gapMs: 1000,
  maxFailures: 3,
  holdMs: 24 * 60 * 60 * 1000,
} as const;

/** How one fetch went. `status` is the HTTP status; `network` is a fetch that
 *  never got an answer. `retryAfterS` is the server's Retry-After, if any. */
export type Outcome =
  | { kind: "ok" }
  | { kind: "status"; status: number; retryAfterS?: number }
  | { kind: "network" };

export type Step =
  | { action: "next"; waitMs: number; failures: number }
  | { action: "stop"; reason: "refused" | "failing"; resumeAt: number };

/**
 * What to do after one fetch. A refusal (429, 403, any 5xx) stops at once;
 * any other failure (a 404, a dropped connection) counts towards
 * `PACE.maxFailures` in a row, and a success resets the count. A stop holds
 * for `PACE.holdMs`, or longer if the server's Retry-After asks for longer.
 */
export function nextStep(failures: number, outcome: Outcome, now: number): Step {
  if (outcome.kind === "ok") return { action: "next", waitMs: PACE.gapMs, failures: 0 };
  if (outcome.kind === "status" && refuses(outcome.status)) {
    const asked = (outcome.retryAfterS ?? 0) * 1000;
    return { action: "stop", reason: "refused", resumeAt: now + Math.max(PACE.holdMs, asked) };
  }
  const n = failures + 1;
  if (n >= PACE.maxFailures) return { action: "stop", reason: "failing", resumeAt: now + PACE.holdMs };
  return { action: "next", waitMs: PACE.gapMs, failures: n };
}

/** The statuses that mean "stop asking": throttled, forbidden, or a server in
 *  trouble. */
export function refuses(status: number): boolean {
  return status === 429 || status === 403 || status >= 500;
}

/** Typical bytes for each thumbnail rendition, measured on real picks
 *  (`lib/photo.ts`). An estimate, and labelled as one wherever it is shown. */
const TYPICAL_BYTES: Record<string, number> = { square: 7_600, small: 38_000 };

/** Roughly how many bytes a list of thumbnail URLs will take. */
export function estimateBytes(urls: string[]): number {
  let total = 0;
  for (const url of urls) {
    const size = /\/(square|small)\.\w+$/.exec(url)?.[1] ?? "small";
    total += TYPICAL_BYTES[size];
  }
  return total;
}
