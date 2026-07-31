import "./styles.css";
import { loadPrefs } from "./state";
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
import { wildlifeKindRoute } from "./lib/wildlife";
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

type StepFn = (main: HTMLElement, param?: string) => void | (() => void) | Promise<void>;

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
  privacy: { fn: renderPrivacy, labelKey: "steps.privacy", inFlow: false },
  sources: { fn: renderSources, labelKey: "steps.sources", inFlow: false },
  settings: { fn: renderSettings, labelKey: "steps.settings", inFlow: false },
  about: { fn: renderAbout, labelKey: "steps.about", inFlow: false },
};

/**
 * Who renders `<step>/<param>`, when a step has one. Separate from `STEPS`
 * because these are different screens, not the same screen with an argument:
 * `#/plants` is the catalog and `#/plants/<slug>` is one plant's profile.
 * `settings` is the exception that proves it — same screen either way, so it
 * appears in both maps and simply reads the param (see steps/settings.ts).
 */
const PARAM_RENDERERS: Record<string, StepFn> = {
  plants: renderPlant,
  regions: renderRegion,
  wildlife: renderWildlife,
  settings: renderSettings,
};

const FLOW = ["location", "sun", "confirm", "priorities", "results"];

const main = document.getElementById("main") as HTMLElement;
const stepsList = document.getElementById("steps") as HTMLOListElement;
let cleanup: (() => void) | null = null;

/** Step keys that carry a param, e.g. `#/plants/<slug>`, `#/wildlife/<id>`.
 *  `settings` takes one too — `#/settings/units` opens the page at that card,
 *  which is what makes the footer's two links land in two different places. */
const PARAM_STEPS = new Set(["plants", "regions", "wildlife", "settings"]);

/** The active route: a step key, plus a param for the `<step>/<id>` pages. */
function currentRoute(): { step: string; param?: string } {
  // A hash query string (`#/plants?q=oak`) is the page's *state*, not its
  // identity — the plants index reads its own `?q=` — so it never takes part
  // in matching a route.
  const hash = location.hash.replace(/^#\/?/, "").split("?")[0];
  const [head, ...rest] = hash.split("/");
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

/**
 * Canonical plant URLs are real paths (…/plants/<slug>) so they read well and
 * share cleanly, but the app routes on the hash. Online, GitHub Pages serves
 * 404.html for those paths and it redirects here; offline, the service worker
 * answers the navigation with the cached shell directly. Either way, fold any
 * path beyond the app base into the equivalent hash route on boot.
 */
function normalizePathRoute(): void {
  const base = import.meta.env.BASE_URL;
  const extra = location.pathname.startsWith(base)
    ? location.pathname.slice(base.length)
    : "";
  if (extra && !location.hash) {
    history.replaceState(null, "", base + "#/" + extra.replace(/\/+$/, ""));
  }
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
 * Everything else stays at the reading measure (`--maxw`, 34rem): a plant
 * profile or an animal's page is prose, and prose set 1,000px wide is harder
 * to read, not easier. But the browse indexes are grids of self-contained
 * cards, and on a laptop a single 34rem column of them is a phone layout
 * pretending to be a desktop one — a screenful of empty margin either side and
 * five times the scrolling. Those widen, and their card grids reflow into
 * columns (see `.card-grid`): Explore's region cards, the region rosters, the
 * plants index, and the wildlife index.
 */
const WIDE_STEPS = new Set(["plants", "regions", "wildlife"]);

function updateLayout(step: string, param?: string): void {
  // Only the parameter-less index of each: `#/plants/<slug>` is a profile and
  // `#/wildlife/<id>` is an animal's story, both of which want the narrow
  // measure. The exceptions are all card lists: `#/regions/<id>` is a roster,
  // and both slices of the wildlife index — `#/wildlife/<group>`
  // ("…/butterflies") and `#/wildlife/in/<region>` — are grids of cards.
  const wide =
    WIDE_STEPS.has(step) &&
    (!param ||
      step === "regions" ||
      (step === "wildlife" && (!!wildlifeKindRoute(param) || wildlifeRegionParam(param) !== null)));
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
  if (cleanup) { cleanup(); cleanup = null; }
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

window.addEventListener("hashchange", route);

/**
 * A header link pointing at the section you're already in is a same-URL
 * navigation: no `hashchange` fires, `route()` never runs, and the tap does
 * nothing at all — so tapping "Wildlife" halfway down the wildlife index just
 * ignores you. Treat that click as what it plainly means: take me back to the
 * top of this page.
 */
document.querySelector(".site-nav")?.addEventListener("click", (e) => {
  const link = (e.target as Element | null)?.closest("a[href^='#']");
  if (!link) return;
  if (link.getAttribute("href") !== location.hash) return;
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
  normalizePathRoute();
  // `?lang=fr` has already been read (i18n picks it up as it loads); this takes
  // it back out of the address bar. It has to happen before the first route(),
  // because 404.html hands us the path form as `#/plants/<slug>?lang=fr` and
  // that query would otherwise be read as part of the slug.
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
