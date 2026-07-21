import "./styles.css";
import { loadPrefs } from "./state";
import { renderWelcome } from "./steps/welcome";
import { renderLocation } from "./steps/location";
import { renderSun } from "./steps/sun";
import { renderScan } from "./steps/skyscan";
import { renderConfirm } from "./steps/confirm";
import { renderResults } from "./steps/results";
import { renderSaved } from "./steps/saved";
import { renderExplore } from "./steps/explore";
import { renderPlant } from "./steps/plant";
import { renderRegion } from "./steps/region";
import { renderWildlifeIndex, renderWildlife } from "./steps/wildlife";

type StepFn = (main: HTMLElement, param?: string) => void | (() => void) | Promise<void>;

const STEPS: Record<string, { fn: StepFn; label: string; inFlow: boolean }> = {
  "": { fn: renderWelcome, label: "Start", inFlow: false },
  location: { fn: renderLocation, label: "Spot", inFlow: true },
  sun: { fn: renderSun, label: "Sun", inFlow: true },
  scan: { fn: renderScan, label: "Sun", inFlow: true },
  confirm: { fn: renderConfirm, label: "Soil", inFlow: true },
  results: { fn: renderResults, label: "Plants", inFlow: true },
  saved: { fn: renderSaved, label: "Saved", inFlow: false },
  plants: { fn: renderExplore, label: "Explore", inFlow: false },
  regions: { fn: renderExplore, label: "Explore", inFlow: false },
  wildlife: { fn: renderWildlifeIndex, label: "Wildlife", inFlow: false },
};

const FLOW = ["location", "sun", "confirm", "results"];

const main = document.getElementById("main") as HTMLElement;
const stepsList = document.getElementById("steps") as HTMLOListElement;
let cleanup: (() => void) | null = null;

/** Step keys that carry a param, e.g. `#/plants/<slug>`, `#/wildlife/<id>`. */
const PARAM_STEPS = new Set(["plants", "regions", "wildlife"]);

/** The active route: a step key, plus a param for the `<step>/<id>` pages. */
function currentRoute(): { step: string; param?: string } {
  const hash = location.hash.replace(/^#\/?/, "");
  const [head, ...rest] = hash.split("/");
  if (PARAM_STEPS.has(head) && rest.length) {
    return { step: head, param: decodeURIComponent(rest.join("/")) };
  }
  return { step: head in STEPS ? head : "" };
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
    li.append(dot, document.createTextNode(STEPS[key].label));
    stepsList.append(li);
  });
  (document.querySelector(".steps") as HTMLElement).style.display = idx >= 0 ? "block" : "none";
}

/** Which header nav link, if any, a step belongs to. Flow steps map to none. */
const SECTION_OF: Record<string, string> = {
  plants: "explore",
  regions: "explore",
  wildlife: "wildlife",
  saved: "saved",
};

function updateSiteNav(step: string): void {
  const section = SECTION_OF[step];
  document.querySelectorAll<HTMLAnchorElement>(".site-nav a").forEach((a) => {
    if (a.dataset.section === section) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

const BASE_TITLE = document.title;

async function route(): Promise<void> {
  const { step, param } = currentRoute();
  if (cleanup) { cleanup(); cleanup = null; }
  document.title = BASE_TITLE; // plant pages set their own; everything else resets
  renderStepRail(step);
  updateSiteNav(step);
  const fn = param
    ? step === "plants"
      ? renderPlant
      : step === "wildlife"
        ? renderWildlife
        : renderRegion
    : STEPS[step].fn;
  const result = fn(main, param);
  if (typeof result === "function") cleanup = result;
  else if (result instanceof Promise) {
    const r = await result;
    if (typeof r === "function") cleanup = r;
  }
  main.focus();
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);

// Offline indicator.
const badge = document.getElementById("offline-badge") as HTMLButtonElement;
function updateOnline(): void {
  badge.hidden = navigator.onLine;
}
window.addEventListener("online", updateOnline);
window.addEventListener("offline", updateOnline);

async function boot(): Promise<void> {
  normalizePathRoute();
  await loadPrefs().catch(() => {});
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
