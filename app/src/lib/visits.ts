// What the device remembers about *when you last looked* — the one memory that
// answers "has anything happened since I was here?".
//
// Three values, and deliberately only three:
//
//   - **The newest release you've actually seen listed** on the What's new
//     page. Not "the newest release that existed when you visited" — seen. A
//     dot that clears itself because you happened to open the app is a dot that
//     means nothing, so only the page that shows you the notes marks them read.
//   - **When the previous visit began**, so the What's new page can say what's
//     landed since, rather than asking you to remember your own history.
//   - **When this visit began**, which is what lets the previous one stay put:
//     a reload, or a trip to the notes and back, is the same visit and must not
//     quietly redefine "since last time" as "since a minute ago".
//
// ## Why this one lives in localStorage
//
// Everything else the app remembers is in IndexedDB (`db.ts`, and see
// `lib/sticky.ts`). This isn't, because it is the only memory read by two
// different documents: the app, and the standalone What's new page that
// `scripts/build-release-notes.mjs` compiles. That page is a single static file
// with no bundle behind it, and it has to decide which releases to mark
// *before* it paints — an async IndexedDB read would show every release
// unmarked and then flick, and it would mean shipping a copy of the database
// layer into a page whose whole point is that it has none. localStorage is
// synchronous, same-origin, and about twenty bytes here.
//
// The compiled page therefore carries a small mirror of the reading and writing
// below. Both sides share this file's key and shape; the page's copy is marked
// as a mirror at its definition, and neither side may change the shape alone.
//
// Nothing here is an identifier, and nothing is sent anywhere: it is a version
// string and two clock readings, in this browser, describing this browser. The
// Privacy page says so in the same words (`privacy.whatsNew*`), and Settings
// shows it with a button that throws it away.
import { version as PACKAGE_VERSION } from "../../package.json";

/**
 * The release this build of the app *is* — the version in `package.json`,
 * which CLAUDE.md's release rules bump in the same commit that cuts the
 * changelog heading. `build-release-notes.mjs` fails the build if the two ever
 * disagree, so this is the newest release the reader could possibly have.
 *
 * Trailing `.0` comes off so the app talks in the same numbers the changelog
 * and the What's new page do: `0.19.0` is displayed and stored as `0.19`. A
 * real patch release (`0.19.1`) keeps its third part.
 */
export const LATEST_RELEASE: string = PACKAGE_VERSION.replace(/\.0$/, "");

/** What's kept, verbatim, under `STORAGE_KEY`. */
export interface Visits {
  /** Newest release seen listed on the What's new page. */
  seenVersion?: string;
  /** When the previous visit began (epoch ms). */
  lastVisitAt?: number;
  /** When the current visit began (epoch ms). */
  visitAt?: number;
}

/** Shared with the What's new page's mirrored copy — change both or neither. */
export const STORAGE_KEY = "indigene.visits";

/**
 * How long a gap makes it a new visit rather than the same one continuing.
 *
 * Half an hour, because the two things a reader does constantly are reload and
 * step out to the What's new page and back. Both are separate page loads and
 * neither is a new visit in any sense a person would recognise; treating them
 * as one would make "since your last visit" mean "since you clicked", which is
 * a sentence about nothing.
 */
const VISIT_GAP_MS = 30 * 60 * 1000;

function read(): Visits {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const v: unknown = raw ? JSON.parse(raw) : null;
    return v && typeof v === "object" ? (v as Visits) : {};
  } catch {
    // Private browsing, a disabled store, or something that isn't JSON. No
    // memory is a working state here: no dot, no highlights, nothing breaks.
    return {};
  }
}

function write(v: Visits): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* storage full or blocked — the feature simply doesn't remember */
  }
}

/** Everything remembered about visits, for the Settings card that lists it. */
export function visits(): Visits {
  return read();
}

/**
 * Compare two release numbers the way people read them: part by part, as
 * numbers. String order would put `0.9` after `0.19`, which is exactly the
 * comparison this feature is built on.
 *
 * Missing parts count as zero, so `0.19` and `0.19.0` are the same release —
 * which is what lets the app (whose number comes from `package.json`) and the
 * page (whose numbers come from the changelog) agree without either converting.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (Number.isNaN(x) || Number.isNaN(y)) return 0; // unreadable: no dot
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

/**
 * Start-of-visit bookkeeping. Called once on boot.
 *
 * A reader arriving for the first time is marked as having seen the current
 * release. This is the one judgement call in the feature and it's deliberate:
 * "new since your last visit" is meaningless to someone who has never visited,
 * and greeting them with a dot and nineteen highlighted releases would teach
 * them, in one screen, that the dot doesn't mean anything. They get a dot when
 * something genuinely lands after today.
 */
export function noteVisit(): void {
  const v = read();
  const now = Date.now();
  if (v.seenVersion === undefined) {
    write({ seenVersion: LATEST_RELEASE, lastVisitAt: now, visitAt: now });
    return;
  }
  // A visit that resumes within the gap keeps the previous visit's timestamp,
  // so "since your last visit" survives a reload.
  const isNewVisit = v.visitAt === undefined || now - v.visitAt > VISIT_GAP_MS;
  write({
    ...v,
    lastVisitAt: isNewVisit ? (v.visitAt ?? v.lastVisitAt ?? now) : v.lastVisitAt,
    visitAt: isNewVisit ? now : (v.visitAt ?? now),
  });
}

/** True when a release has landed that this reader hasn't seen listed. */
export function hasUnseenRelease(): boolean {
  const seen = read().seenVersion;
  if (!seen) return false; // first visit hasn't been recorded yet — no dot
  return compareVersions(LATEST_RELEASE, seen) > 0;
}

/** Throw the whole record away, from the Settings card that lists it. */
export function forgetVisits(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do — see write() */
  }
}
