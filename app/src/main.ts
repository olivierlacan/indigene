import "./styles.css";
import { loadPrefs } from "./state";
import { loadSticky } from "./lib/sticky";
import { renderWelcome } from "./steps/welcome";
import { renderLocation } from "./steps/location";
import { renderSun } from "./steps/sun";
import { renderScan } from "./steps/skyscan";
import { renderConfirm } from "./steps/confirm";
import { renderPriorities } from "./steps/priorities";
import { renderResults } from "./steps/results";
import { renderSaved } from "./steps/saved";
import { renderExplore } from "./steps/explore";
import { renderBrowse } from "./steps/browse";
import { renderPlants } from "./steps/plants";
import { renderPlant } from "./steps/plant";
import { renderRegion } from "./steps/region";
import { renderWildlifeIndex, renderWildlife, wildlifeRegionParam } from "./steps/wildlife";
import { wildlifeKindRoute, getWildlife } from "./lib/wildlife";
import { renderLookalikeIndex, renderLookalike, lookalikeRegionParam } from "./steps/lookalikes";
import { getLookalike } from "./lib/lookalikes";
import { findPlant } from "./lib/explore";
import { REGIONS } from "./lib/plants";
import { renderPrivacy } from "./steps/privacy";
import { renderSources } from "./steps/sources";
import { renderSettings } from "./steps/settings";
import { renderAbout } from "./steps/about";
import { initAppMenu, closeAppMenu } from "./components/app-menu";
import { closeTermDialog } from "./components/term-dialog";
import { applyDocumentLang, consumeLangParam, onLangChange, t } from "./lib/i18n";
import type { TKey } from "./locales/en";
import { onUnitsChange } from "./lib/units";
import { renderChrome } from "./components/chrome";
import { mountUntranslatedBanner, resetUntranslated } from "./components/wip-banner";

// A step may render synchronously, hand back a cleanup function, or do both
// after an await — the router already unwraps all three (see `route`), and a
// step that waits on stored preferences before its first paint needs the
// combination.
type StepFn = (
  main: HTMLElement,
  param?: string
) => void | (() => void) | Promise<void | (() => void)>;

// `labelKey` rather than `label`: the rail is redrawn on every navigation and
// on every language change, so the words have to be looked up at render time.
// A string captured here would be frozen in whatever language happened to be
// active when this module first ran.
const STEPS: Record<string, { fn: StepFn; labelKey: TKey; inFlow: boolean }> = {
  "": { fn: renderWelcome, labelKey: "steps.start", inFlow: false },
  location: { fn: renderLocation, labelKey: "steps.spot", inFlow: true },
  sun: { fn: renderSun, labelKey: "steps.sun", inFlow: true },
  scan: { fn: renderScan, labelKey: "steps.sun", inFlow: true },
  confirm: { fn: renderConfirm, labelKey: "steps.soil", inFlow: true },
  priorities: { fn: renderPriorities, labelKey: "steps.goals", inFlow: true },
  results: { fn: renderResults, labelKey: "steps.plants", inFlow: true },
  saved: { fn: renderSaved, labelKey: "steps.saved", inFlow: false },
  browse: { fn: renderBrowse, labelKey: "steps.browse", inFlow: false },
  plants: { fn: renderPlants, labelKey: "steps.plants", inFlow: false },
  regions: { fn: renderExplore, labelKey: "steps.explore", inFlow: false },
  // The index takes a wildlife *kind*, not a route param — `#/wildlife` alone
  // is the whole catalog; the grouped pages come through `renderWildlife`.
  wildlife: { fn: (m) => renderWildlifeIndex(m), labelKey: "steps.wildlife", inFlow: false },
  // The impostors. `#/lookalikes` alone is the whole index; a param is either
  // one impostor or `in/<region>`, and `renderLookalike` tells them apart.
  lookalikes: { fn: (m) => renderLookalikeIndex(m), labelKey: "steps.lookalikes", inFlow: false },
  privacy: { fn: renderPrivacy, labelKey: "steps.privacy", inFlow: false },
  sources: { fn: renderSources, labelKey: "steps.sources", inFlow: false },
  settings: { fn: renderSettings, labelKey: "steps.settings", inFlow: false },
  about: { fn: renderAbout, labelKey: "steps.about", inFlow: false },
};

/**
 * Who renders `<step>/<param>`, when a step has one. Separate from `STEPS`
 * because these are different screens, not the same screen with an argument:
 * `#/plants` is the catalog and `#/plants/<slug>` is one plant's profile.
 * `settings` and `privacy` are the exceptions that prove it — same screen either
 * way, so each appears in both maps and simply reads the param to open itself at
 * the card (steps/settings.ts) or section (steps/privacy.ts) that was asked for.
 */
const PARAM_RENDERERS: Record<string, StepFn> = {
  plants: renderPlant,
  regions: renderRegion,
  wildlife: renderWildlife,
  lookalikes: renderLookalike,
  settings: renderSettings,
  privacy: renderPrivacy,
};

const FLOW = ["location", "sun", "confirm", "priorities", "results"];

const main = document.getElementById("main") as HTMLElement;
const stepsList = document.getElementById("steps") as HTMLOListElement;
let cleanup: (() => void) | null = null;

/** Step keys that carry a param, e.g. `#/plants/<slug>`, `#/wildlife/<id>`.
 *  `settings` takes one too — `#/settings/units` opens the page at that card,
 *  which is what makes the footer's two links land in two different places —
 *  and so does `privacy`, so a control can link to the section that answers the
 *  question it raises (`#/privacy/lookups`). */
const PARAM_STEPS = new Set(["plants", "regions", "wildlife", "lookalikes", "settings", "privacy"]);

/** Whatever sits beyond the app base in the address bar, e.g. `plants/ilex-opaca`
 *  for `…/plants/ilex-opaca/`. Pages serves the directory index, so the trailing
 *  slash is the browser's, not ours; the canonical form has none. */
function pathRoute(): string {
  const base = import.meta.env.BASE_URL;
  if (!location.pathname.startsWith(base)) return "";
  return location.pathname.slice(base.length).replace(/\/+$/, "");
}

/** The active route: a step key, plus a param for the `<step>/<id>` pages. */
function currentRoute(): { step: string; param?: string } {
  // A hash query string (`#/plants?q=oak`) is the page's *state*, not its
  // identity — the plants index reads its own `?q=` — so it never takes part
  // in matching a route.
  //
  // With no hash at all, the path *is* the route: a canonical URL
  // (…/plants/ilex-opaca) is a real prerendered file, and it stays in the
  // address bar rather than being folded into the hash form. `location.hash`
  // rather than the parsed route decides which side to read, because `#/` is a
  // hash that means home — and on a page opened by its path, folding an empty
  // hash route back onto the path would re-render the page you just left.
  const raw = location.hash ? location.hash.replace(/^#\/?/, "").split("?")[0] : pathRoute();
  const [head, ...rest] = raw.split("/");
  if (PARAM_STEPS.has(head) && rest.length) {
    return { step: head, param: decodeURIComponent(rest.join("/")) };
  }
  return { step: head in STEPS ? head : "" };
}

/**
 * Old addresses, folded into the ones they became — quietly, before the router
 * ever sees them, so a bookmark or a shared link lands on the real page rather
 * than on "we couldn't find that".
 *
 * `#/search` was the plants index back when the page was called Search; it is
 * now `#/plants`, and `#/search/<query>` is `#/plants?q=<query>` (a query
 * string, because `#/plants/<slug>` already means one plant's profile).
 */
function canonicalizeRoute(): void {
  const hash = location.hash.replace(/^#\/?/, "");
  const m = /^search(?:\/([^?]*))?(?:$|\?)/.exec(hash);
  if (!m) return;
  const q = m[1] ? decodeURIComponent(m[1]).trim() : "";
  history.replaceState(null, "", `#/plants${q ? `?q=${encodeURIComponent(q)}` : ""}`);
}

/** The index pages `scripts/prerender.mjs` writes a file for. `settings` is
 *  absent on purpose — it's the one screen with no address worth sending. */
const PRERENDERED_INDEXES = new Set([
  "plants", "regions", "browse", "wildlife", "lookalikes", "privacy", "sources", "about",
]);

/**
 * The canonical address of a route, when it has one: the real path that
 * `scripts/prerender.mjs` wrote a file for, or null.
 *
 * Only those pages can be previewed. An unfurler — Slack, iMessage, Facebook —
 * is a plain HTTP fetch, and a `#…` fragment is *never sent to a server*: ask
 * for `…/#/plants/asclepias-tuberosa` and the server is asked for `/`, so the
 * card that comes back describes the site, whatever the link led to. The path
 * form is a real document with the plant's own title and words in its head.
 *
 * Everything else is deliberately absent. The flow steps have no file (they
 * mean nothing without the draft held in memory), and neither do the
 * sub-routes — `#/wildlife/in/<region>`, `#/settings/units`,
 * `#/privacy/lookups` — which are a filter or a scroll position on a page
 * rather than a page. Null leaves those in the hash form, which is right:
 * it's the only address that reloads them.
 */
function canonicalPath(step: string, param?: string): string | null {
  if (!param) return PRERENDERED_INDEXES.has(step) ? step : null;
  const at = (id: string): string => `${step}/${encodeURIComponent(id)}`;
  switch (step) {
    case "plants":
      return findPlant(param).length ? at(param) : null;
    case "regions":
      return REGIONS.some((r) => r.meta.id === param) ? at(param) : null;
    // Both an animal (`…/wildlife/monarch`) and a group (`…/wildlife/bees`).
    case "wildlife":
      return getWildlife(param) || wildlifeKindRoute(param) ? at(param) : null;
    case "lookalikes":
      return getLookalike(param) ? at(param) : null;
    default:
      return null;
  }
}

/**
 * Put the address bar on the canonical address of the page being shown.
 *
 * This is not tidiness, it's the share card. The Share control already hands
 * out the path form (`plantShareUrl`), but most people copy the address bar —
 * or use the browser's own share sheet, which copies it for them. While the app
 * rewrote every path it was handed into `…/#/plants/<slug>`, *opening* a good
 * link was enough to destroy it: the recipient's address bar then held the one
 * form that cannot preview, and anything re-shared from there showed the
 * generic site card instead of the plant. Now both forms agree, and the URL you
 * copy is the URL that unfurls.
 *
 * A page's `?q=` state rides along in the search string once the hash is gone,
 * which is where `…/plants?q=oak` reads it from (steps/plants.ts) — but only
 * for as long as that page is on screen. A query written into the hash is part
 * of the link being followed and is always honoured; a query already sitting in
 * the search string is the *previous* page's, because a browser keeps the
 * search when only the hash changes. Carrying that one across a route change is
 * how the plants index's search leaked onto the plant it opened, leaving
 * `…/plants/asclepias-tuberosa?q=butterfly%20weed` in the address bar.
 */
let syncedRoute: string | null = null;
function syncAddressBar(step: string, param?: string): void {
  const base = import.meta.env.BASE_URL;
  const path = canonicalPath(step, param);
  const key = param ? `${step}/${param}` : step;
  // The first sync of a page load has no previous route, so its search string
  // is the address that was asked for, not residue.
  const ownsSearch = syncedRoute === null || syncedRoute === key;
  syncedRoute = key;

  const at = location.hash.indexOf("?");
  const query = at >= 0 ? location.hash.slice(at) : ownsSearch ? location.search : "";
  const want = path === null ? `${base}${query}${location.hash}` : `${base}${path}${query}`;
  if (location.pathname + location.search + location.hash !== want) {
    history.replaceState(history.state, "", want);
  }
  routedHref = location.href;
}

function renderStepRail(active: string): void {
  const activeFlowKey = active === "scan" ? "sun" : active;
  const idx = FLOW.indexOf(activeFlowKey);
  stepsList.replaceChildren();
  FLOW.forEach((key, i) => {
    const state = i < idx ? "done" : i === idx ? "current" : "todo";
    const li = document.createElement("li");
    li.dataset.state = state;
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = state === "done" ? "✓" : String(i + 1);
    li.append(dot, document.createTextNode(t(STEPS[key].labelKey)));
    stepsList.append(li);
  });
  (document.querySelector(".steps") as HTMLElement).style.display = idx >= 0 ? "block" : "none";
}

/** Which header nav link, if any, a step belongs to. Flow steps map to none.
 *  Saved and Settings both mark the gear: it's the menu that leads to each. */
const SECTION_OF: Record<string, string> = {
  browse: "regions",
  regions: "regions",
  plants: "plants",
  lookalikes: "plants",
  wildlife: "wildlife",
  saved: "menu",
  settings: "menu",
};

function sectionOf(step: string): string | undefined {
  return SECTION_OF[step];
}

/**
 * The pages that are a *list of independent cards* rather than a document.
 *
 * Everything else stays at the reading measure (`--maxw`, 34rem): prose set
 * 1,000px wide is harder to read, not easier. But the browse indexes are grids
 * of self-contained cards, and on a laptop a single 34rem column of them is a
 * phone layout pretending to be a desktop one — a screenful of empty margin
 * either side and five times the scrolling. Those widen, and their card grids
 * reflow into columns (see `.card-grid`): Explore's region cards, the region
 * rosters, the plants index, and the wildlife index. The two profile pages
 * widen differently — see `updateLayout`.
 */
const WIDE_STEPS = new Set(["plants", "regions", "wildlife", "lookalikes"]);

function updateLayout(step: string, param?: string): void {
  // Two of the documents — a plant's page and an animal's — get a mode of their
  // own. Neither is a card list, but they're *long*, and on a laptop they ran to
  // several screenfuls of narrow ribbon with the window empty either side. They
  // widen too, and lay their own pieces out in columns so no sentence is set any
  // wider than it is now (see "Profile pages on a laptop" in styles.css). Only
  // past the laptop breakpoint, which is why the widening itself lives in the
  // stylesheet rather than here.
  //
  // An impostor's page (`#/lookalikes/<id>`) is not in that club: it's a short
  // comparison, and it keeps the reading measure.
  const plantProfile = step === "plants" && !!param;
  const animalProfile =
    step === "wildlife" && !!param && !wildlifeKindRoute(param) && wildlifeRegionParam(param) === null;
  if (plantProfile || animalProfile) {
    document.body.dataset.layout = "profile";
    return;
  }
  // Of what's left, only the parameter-less index of each widens, plus the card
  // lists that take a param: `#/regions/<id>` is a roster, both slices of the
  // wildlife index — `#/wildlife/<group>` ("…/butterflies") and
  // `#/wildlife/in/<region>` — are grids of cards, and so is
  // `#/lookalikes/in/<region>`.
  const wide =
    WIDE_STEPS.has(step) &&
    (!param ||
      step === "regions" ||
      (step === "wildlife" && (!!wildlifeKindRoute(param) || wildlifeRegionParam(param) !== null)) ||
      (step === "lookalikes" && lookalikeRegionParam(param) !== null));
  document.body.dataset.layout = wide ? "wide" : "narrow";
}

function updateSiteNav(step: string): void {
  const section = sectionOf(step);
  // Both the plain links and the app-menu button carry data-section.
  document.querySelectorAll<HTMLElement>(".site-nav [data-section]").forEach((elm) => {
    if (elm.dataset.section === section) elm.setAttribute("aria-current", "page");
    else elm.removeAttribute("aria-current");
  });
}

async function route(): Promise<void> {
  canonicalizeRoute();
  const { step, param } = currentRoute();
  // Before `syncAddressBar` — the trail helpers read `location.hash` to see
  // where the reader is heading, and canonicalizing takes the hash away.
  if (cleanup) { cleanup(); cleanup = null; }
  syncAddressBar(step, param);
  closeAppMenu(); // a navigation always dismisses an open header menu
  closeTermDialog(); // …and any explain-this dialog, which would float above the new page
  resetUntranslated(); // whatever the last page admitted to isn't this page's
  document.title = t("app.title"); // plant pages set their own; everything else resets
  renderStepRail(step);
  updateSiteNav(step);
  updateLayout(step, param);
  const fn = param ? PARAM_RENDERERS[step] ?? STEPS[step].fn : STEPS[step].fn;
  const result = fn(main, param);
  if (typeof result === "function") cleanup = result;
  else if (result instanceof Promise) {
    const r = await result;
    if (typeof r === "function") cleanup = r;
  }
  // Mounted here rather than by the step: one banner per page, always the first
  // thing under the header, wherever in its own layout the step happened to
  // notice the gap (see components/wip-banner.ts).
  mountUntranslatedBanner(main);
  landAtTop();
}

/**
 * Put a freshly rendered page at its top, and move focus into it.
 *
 * The order and the `preventScroll` are the whole point. Focusing an element
 * scrolls it into view, and `#main` starts just below the sticky header — so a
 * bare `main.focus()` measurably parks the document 61px down (the header's
 * height) instead of at the top. A `scrollTo(0, 0)` *after* it hides that on
 * Chromium, where the focus scroll is synchronous, but it's a race we don't
 * need to be in: engines are free to defer focus scrolling to the next
 * rendering opportunity, which lands it after the reset and leaves the page
 * nudged down. Scrolling first and taking the scroll out of the focus call
 * removes the race rather than winning it.
 */
function landAtTop(): void {
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}

/**
 * A navigation happened — from a link, from `location.hash =`, or from the back
 * and forward buttons.
 *
 * Both events, because neither covers everything. A link or a programmatic hash
 * assignment fires `hashchange` alone. But a back or forward step between two
 * addresses that differ by *path* — which two canonical URLs now do — changes
 * no hash at all, so it fires `popstate` alone: without it, going back from the
 * wildlife index to the plant you came from moved the address bar and left the
 * old page on screen.
 *
 * A hash traversal fires both, so `routedHref` guards against drawing the same
 * page twice. `syncAddressBar` updates it as well, because it rewrites the
 * address mid-route and the second event of a pair arrives after that.
 */
let routedHref = "";
function onNavigation(): void {
  if (location.href === routedHref) return;
  routedHref = location.href;
  void route();
}
window.addEventListener("hashchange", onNavigation);
window.addEventListener("popstate", onNavigation);

/**
 * A header link pointing at the section you're already in is a same-URL
 * navigation: no `hashchange` fires, `route()` never runs, and the tap does
 * nothing at all — so tapping "Wildlife" halfway down the wildlife index just
 * ignores you. Treat that click as what it plainly means: take me back to the
 * top of this page.
 *
 * The link is `#/wildlife` and the page you're on may be showing `/wildlife`,
 * so "already here" is checked against both forms — otherwise tapping the
 * section you're in on a page opened by its canonical path would push the hash
 * form back into the address bar and redraw the page to say so.
 */
document.querySelector(".site-nav")?.addEventListener("click", (e) => {
  const link = (e.target as Element | null)?.closest("a[href^='#']");
  if (!link) return;
  const href = link.getAttribute("href");
  if (href !== location.hash && href !== `#/${pathRoute()}`) return;
  e.preventDefault();
  landAtTop();
});

// Offline indicator.
const badge = document.getElementById("offline-badge") as HTMLButtonElement;
function updateOnline(): void {
  badge.hidden = navigator.onLine;
}
window.addEventListener("online", updateOnline);
window.addEventListener("offline", updateOnline);

/**
 * Re-render everything after a language or units switch.
 *
 * A reload would be simpler and is wrong: the working draft (your coordinates,
 * your sun estimate, the moisture you just corrected) lives in memory, and
 * throwing it away because someone changed a setting mid-flow would be a
 * cruel way to answer "show me this in French". Re-running the current route
 * redraws every word and every measurement while the draft stays put.
 */
function rerenderAll(): void {
  applyDocumentLang();
  renderChrome();
  void route();
}

async function boot(): Promise<void> {
  // `?lang=fr` has already been read (i18n picks it up as it loads); this takes
  // it back out of the address bar. It has to happen before the first route(),
  // because 404.html hands an address it bounced to the hash side of the URL —
  // `#/wildlife/in/pnw?lang=fr` — and that query would otherwise be read as
  // part of the route.
  consumeLangParam();
  applyDocumentLang();
  renderChrome();
  onLangChange(rerenderAll);
  onUnitsChange(rerenderAll);
  // Prefs only tune ranking weights and filters, so the first paint never
  // waits on them — not even briefly: IndexedDB can stall outright (Safari's
  // first-open bug), and a blank page with a spinner is strictly worse than
  // the page. They load in the background and apply from the next render on;
  // a fresh page can't be showing ranked results yet anyway (the results
  // step needs a confirmed spot, which a reload clears).
  void loadPrefs().catch(() => {});
  // Same background read for what this device remembers — the last spot and
  // the starting region. Started here, before the first route, so the one
  // screen whose opening state depends on it (the location step, which awaits
  // `stickyReady`) almost never actually waits.
  void loadSticky().catch(() => {});
  initAppMenu();
  updateOnline();
  await route();
  // Register the hand-written service worker for offline + installability.
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {});
  }
}

boot();
