// Counting visits — the smallest honest answer to "is anyone out there?".
//
// Indigene has no server, so there are no server logs to read: until this file,
// there was no way to know whether the app had ten readers or ten thousand. That
// question is worth answering, and it is *not* worth answering by learning
// anything about the people who visit. So the whole of what leaves the browser
// is: a page was opened, and which page. No cookie, no stored identifier, no
// account, nothing that joins two visits together or follows anyone to another
// site.
//
// The service is Fathom Analytics, chosen because it is cookieless by design and
// keeps no profile of a visitor. But the guarantees a reader actually gets are
// the ones enforced *here*, in code they can read, rather than the ones promised
// by a third party:
//
//   - **Nothing is sent unless the app is the real, published site.** A local
//     build, a preview, a checkout on someone's laptop never contacts anyone
//     (`LIVE_HOST`). That keeps development out of the numbers, but more to the
//     point it means running this code yourself doesn't quietly report you.
//   - **The address is scrubbed before it's sent.** A route can carry what
//     somebody typed — `#/plants?q=butterfly weed` is the plants index holding a
//     search — and that is their words, not a page name. The query string is
//     dropped and only the page's own address goes (`pageAddress`).
//   - **Do Not Track and Global Privacy Control are honoured.** Both are a
//     reader saying plainly that they don't want to be counted, and the answer
//     to that is to not count them, not to note the preference and carry on.
//   - **The opt-out is a real one.** Turning it off in Settings doesn't ask the
//     service to ignore you — it means the script is never fetched, so the
//     request is never made at all. That is the only kind of opt-out that can be
//     verified from outside.
//
// The Privacy page says all of this in plain words (`privacy.count*`), and
// `components/memory-controls.ts` carries the switch. If you change what's sent
// here, change that page in the same commit: it is a description of this file,
// and a description that has drifted is worse than none.

/** The Fathom site this build reports to. Public by nature — it ships in the
 *  page on the live site and identifies the *site*, never a visitor. */
const SITE_ID = "CLPFDYDN";

const SCRIPT_SRC = "https://cdn.usefathom.com/script.js";

/**
 * The one host that reports. Anything else — localhost, a preview deploy, a
 * fork on someone's own domain — stays silent.
 *
 * This is deliberately an exact match rather than a "not localhost" test. The
 * failure mode of getting it wrong should be *no data*, which is merely
 * disappointing, rather than a stranger's fork reporting its readers into this
 * account, which would be a small betrayal of both of them.
 */
const LIVE_HOST = "indigene.app";

/** Where the opt-out lives. Same browser, same shape, same rules as everything
 *  else this app remembers (`lib/visits.ts`) — and read before any request. */
export const STORAGE_KEY = "indigene.analytics";

/** The stored value that means "don't count me". Absence means counted: this is
 *  an opt-out, because a count nobody is in is not a count. */
const OFF = "off";

/**
 * Has this reader asked not to be counted — by the switch in Settings, or by
 * the browser-wide signals that say the same thing?
 *
 * Do Not Track is widely ignored by the industry and is therefore, in practice,
 * a request that only gets honoured by people who mean it. Global Privacy
 * Control is its successor and carries legal weight in some places. Neither is
 * ambiguous about what it's asking for, so both are read as the switch being
 * off, and the reader can still see and change the switch in Settings.
 */
export function analyticsEnabled(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string };
  if (nav.globalPrivacyControl === true) return false;
  if (nav.doNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) !== OFF;
  } catch {
    // Private browsing or a blocked store. Counted, like any reader whose
    // browser we can't ask — the alternative is treating a storage failure as
    // consent to nothing, which loses the one number this exists for.
    return true;
  }
}

/**
 * The switch's own position, ignoring the browser-wide signals.
 *
 * Settings needs this as well as `analyticsEnabled()`, because the two can
 * disagree: a reader whose browser sends Do Not Track isn't counted no matter
 * what the switch says, and a switch that silently flips itself to match would
 * be lying about a choice they made.
 */
export function countingChosen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== OFF;
  } catch {
    return true;
  }
}

/** True when a browser-wide signal is doing the refusing, so Settings can say
 *  so rather than showing a switch that appears to be on and isn't. */
export function refusedByBrowser(): boolean {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; doNotTrack?: string };
  return (
    nav.globalPrivacyControl === true ||
    nav.doNotTrack === "1" ||
    (window as { doNotTrack?: string }).doNotTrack === "1"
  );
}

/**
 * Turn counting on or off. Takes effect from the next page load — the script,
 * once fetched, is fetched — which the Settings card says out loud rather than
 * pretending the switch is instant.
 */
export function setAnalyticsEnabled(on: boolean): void {
  try {
    if (on) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, OFF);
  } catch {
    /* nothing to do — see the note in analyticsEnabled() */
  }
}

/** Throw the choice away, like every other Forget button on the Settings page. */
export function forgetAnalyticsChoice(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}

/** What the counting service is told about a page — the address, and nothing
 *  attached to it. Exported so the Privacy page's claim can be checked against
 *  the function that makes it, and so a test could. */
export function pageAddress(): string {
  // Only the two halves that name a page: the path (a canonical URL like
  // /plants/quercus-alba, written by scripts/prerender.mjs) and the hash route
  // (#/results, for the flow steps that have no file). Never `location.search`,
  // and never the hash's own query string — both carry what the reader typed.
  const hash = location.hash.startsWith("#/") ? location.hash.split("?")[0] : "";
  return `${location.origin}${location.pathname}${hash}`;
}

interface Fathom {
  trackPageview?: (opts?: { url?: string; referrer?: string }) => void;
}

/** Views that happened before the script finished loading. The first one always
 *  does — the router draws the opening page long before a deferred third-party
 *  script arrives — so without this the most-visited page in the app would be
 *  missing from its own numbers. */
let pending: string[] = [];
let ready = false;
let started = false;

function fathom(): Fathom | undefined {
  return (window as { fathom?: Fathom }).fathom;
}

function send(url: string): void {
  // Defensive on purpose: this is a third-party global that may be absent
  // because the reader blocks trackers, because the network is down, or because
  // the app is offline. None of those is an error — they're just no count.
  try {
    fathom()?.trackPageview?.({ url });
  } catch {
    /* a counting failure must never be a page failure */
  }
}

/**
 * Load the counting script, if this reader and this build are ones that count.
 *
 * Called once, at boot. Everything that would stop a request happens before the
 * element is created, so "opted out" and "not the live site" mean the browser
 * makes no connection to anyone — not a blocked request, no request.
 */
export function startAnalytics(): void {
  if (started) return;
  started = true;
  if (location.hostname !== LIVE_HOST) return;
  if (!analyticsEnabled()) return;

  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.defer = true;
  script.dataset.site = SITE_ID;
  // The app is a single page: the script's own automatic tracking would see one
  // pageview per *load*, then either miss every navigation after it or, in its
  // SPA modes, count the address twice — this router changes the hash and then
  // rewrites it to the canonical path (`syncAddressBar`), which looks like two
  // navigations to anything watching from outside. The router knows exactly
  // when a page settles and what it settled on, so it says so itself, once.
  script.dataset.auto = "false";
  script.addEventListener("load", () => {
    ready = true;
    for (const url of pending) send(url);
    pending = [];
  });
  document.head.append(script);
}

/**
 * A page finished drawing. Called by the router at the end of every route, once
 * the address bar holds the page's canonical address.
 *
 * Silent unless `startAnalytics` actually loaded the script, so every guard
 * above holds for the whole session rather than only for the first page.
 */
export function trackPageview(): void {
  if (!started || location.hostname !== LIVE_HOST || !analyticsEnabled()) return;
  const url = pageAddress();
  if (ready) send(url);
  else if (pending.length < 20) pending.push(url); // a bounded queue; a reader
  // who navigates twenty times before a deferred script lands is not a reader
  // whose twenty-first page view is worth holding memory for.
}
