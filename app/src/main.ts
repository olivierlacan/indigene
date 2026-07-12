import "./styles.css";
import { loadPrefs } from "./state";
import { renderWelcome } from "./steps/welcome";
import { renderLocation } from "./steps/location";
import { renderSun } from "./steps/sun";
import { renderScan } from "./steps/skyscan";
import { renderConfirm } from "./steps/confirm";
import { renderResults } from "./steps/results";
import { renderSaved } from "./steps/saved";

type StepFn = (main: HTMLElement) => void | (() => void) | Promise<void>;

const STEPS: Record<string, { fn: StepFn; label: string; inFlow: boolean }> = {
  "": { fn: renderWelcome, label: "Start", inFlow: false },
  location: { fn: renderLocation, label: "Location", inFlow: true },
  sun: { fn: renderSun, label: "Sun", inFlow: true },
  scan: { fn: renderScan, label: "Sun", inFlow: true },
  confirm: { fn: renderConfirm, label: "Soil", inFlow: true },
  results: { fn: renderResults, label: "Plants", inFlow: true },
  saved: { fn: renderSaved, label: "Saved", inFlow: false },
};

const FLOW = ["location", "sun", "confirm", "results"];

const main = document.getElementById("main") as HTMLElement;
const stepsList = document.getElementById("steps") as HTMLOListElement;
let cleanup: (() => void) | null = null;

function currentStep(): string {
  const hash = location.hash.replace(/^#\/?/, "");
  return hash in STEPS ? hash : "";
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

async function route(): Promise<void> {
  const step = currentStep();
  if (cleanup) { cleanup(); cleanup = null; }
  renderStepRail(step);
  const result = STEPS[step].fn(main);
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
  await loadPrefs().catch(() => {});
  updateOnline();
  await route();
  // Register the hand-written service worker for offline + installability.
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }
}

boot();
