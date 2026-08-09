// Pull down from the top of a page to reload it — on the one platform that
// otherwise can't.
//
// An iOS Home Screen app runs with no address bar and no toolbar, so there is
// no reload button and no pull-to-refresh: if a page is stale or a render went
// wrong, the only way out is to kill the app from the switcher. Safari has the
// gesture; the installed app doesn't inherit it. So we draw it ourselves, and
// only there — `lib/standalone.ts` says where — because everywhere else the
// browser already does this better than we can.
//
// The gesture: at the very top of a page, drag down. A pill slides out from
// behind the header and follows your finger at about half speed; past a
// threshold it flips its arrow and says it's ready. Let go and the page
// reloads; let go short of it and the pill goes back where it came from.
//
// A drag is not something everyone can do, so it is not the only way: the
// header's gear menu carries a Reload row in the same situation
// (components/app-menu.ts).
import { el } from "../ui";
import { t } from "../lib/i18n";
import { isHomeScreenApp } from "../lib/standalone";

/** How far the pill travels before letting go means "reload". */
const ARM = 48;
/** Where the pill stops following, however far the finger keeps going. */
const MAX_PULL = 88;
/** The pill moves about half as far as the finger: a reload should take a
 *  deliberate drag, and the resistance is what a phone owner expects here. */
const DAMPING = 0.55;
/** Under this much movement a touch is still a tap, or the start of a sideways
 *  swipe — nothing to take over yet. */
const DEADZONE = 6;

let pill: HTMLElement | null = null;
let icon: HTMLElement | null = null;
let text: HTMLElement | null = null;

let startX = 0;
let startY = 0;
let pull = 0;
let tracking = false;
let engaged = false;
let reloading = false;
let settle: number | undefined;

/** Wire up the gesture, if this is a device that needs it. */
export function initPullToReload(): void {
  if (!isHomeScreenApp()) return;
  document.addEventListener("touchstart", onStart, { passive: true });
}

/**
 * A touch begins. Cheap checks only — this runs on every tap in the app, and
 * the expensive one (a non-passive move listener, which makes the browser wait
 * on us before it scrolls) is attached only once a gesture looks plausible.
 */
function onStart(e: TouchEvent): void {
  if (reloading || e.touches.length !== 1) return;
  if (window.scrollY > 0) return; // the gesture belongs to the top of the page
  if (!canPullFrom(e.target)) return;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  pull = 0;
  tracking = true;
  engaged = false;
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onEnd);
  document.addEventListener("touchcancel", onCancel);
}

/**
 * Would a pull starting here mean "reload", or does it belong to something else
 * on the page?
 *
 * The lightbox locks the page behind it and runs its own swipe, and it says so
 * by pinning `body`'s overflow (components/lightbox.ts). Anything else with its
 * own scrollbar — a scrolled list inside the page — gets its scroll back rather
 * than having it read as a page-level pull; an element that can't scroll reports
 * a `scrollTop` of 0, so this costs one property read per ancestor.
 */
function canPullFrom(target: EventTarget | null): boolean {
  if (document.body.style.overflow === "hidden") return false;
  let node = target instanceof Element ? target : null;
  while (node && node !== document.body) {
    if (node.scrollTop > 0) return false;
    node = node.parentElement;
  }
  return true;
}

function onMove(e: TouchEvent): void {
  if (!tracking) return;
  const touch = e.touches[0];
  const dy = touch.clientY - startY;
  const dx = touch.clientX - startX;

  if (!engaged) {
    // Direction lock, decided once: a sideways drag is a carousel's or a
    // gallery's, and an upward one is an ordinary scroll. Either way we're out,
    // and the page keeps the gesture — we haven't prevented anything yet.
    if (Math.abs(dx) > Math.abs(dy) || dy < DEADZONE) {
      if (Math.abs(dx) > DEADZONE || dy < -DEADZONE) stop();
      return;
    }
    if (window.scrollY > 0) return stop();
    // Already committed to a scroll or a bounce: the browser won't hand this
    // gesture over, and taking half of it would mean a pill moving beside a
    // page moving on its own.
    if (!e.cancelable) return stop();
    engaged = true;
    show();
  }

  // Ours now. Without this the page rubber-bands under the pill and the two
  // move at different speeds.
  e.preventDefault();
  pull = Math.min(MAX_PULL, Math.max(0, dy * DAMPING));
  paint();
}

function onEnd(): void {
  if (!tracking) return;
  const armed = engaged && pull >= ARM;
  stop();
  if (!armed) return retract();

  reloading = true;
  pull = ARM;
  paint();
  // A beat, so the pill has a frame to say what's happening before the page
  // goes away. The reload itself is the plain one a toolbar button does: the
  // service worker answers navigations from the network first (`public/sw.js`),
  // so this really does fetch the current app rather than re-serving the copy
  // that was already on screen.
  window.setTimeout(() => location.reload(), 220);
}

function onCancel(): void {
  stop();
  retract();
}

/** Let go of the gesture — the listeners, not the pill. */
function stop(): void {
  tracking = false;
  engaged = false;
  document.removeEventListener("touchmove", onMove);
  document.removeEventListener("touchend", onEnd);
  document.removeEventListener("touchcancel", onCancel);
}

/** Slide the pill back behind the header and leave nothing behind. */
function retract(): void {
  if (!pill) return;
  pull = 0;
  pill.classList.add("is-settling");
  paint();
  const done = pill;
  settle = window.setTimeout(() => {
    done.hidden = true;
    done.classList.remove("is-settling");
  }, 260);
}

function show(): void {
  if (!pill) build();
  if (!pill) return;
  // A pull that starts while the last one is still sliding home: without this,
  // the old retract's timer arrives mid-gesture and hides a pill that is at
  // that moment following a finger.
  window.clearTimeout(settle);
  // The pill starts hidden *behind* the header, so where the header ends is
  // where it has to be pinned. Measured per gesture: the header wraps to two
  // rows at large text sizes, and the step rail comes and goes with the flow.
  const header = document.querySelector(".app-header");
  const top = header ? header.getBoundingClientRect().bottom : 0;
  pill.style.setProperty("--pull-top", `${Math.round(top)}px`);
  pill.classList.remove("is-settling");
  pill.hidden = false;
}

function paint(): void {
  if (!pill || !icon || !text) return;
  pill.style.setProperty("--pull", `${Math.round(pull)}px`);
  const armed = pull >= ARM;
  pill.classList.toggle("is-armed", armed && !reloading);
  pill.classList.toggle("is-reloading", reloading);
  icon.className = reloading ? "spinner" : "pull-reload-icon";
  icon.textContent = reloading ? "" : "↓";
  text.textContent = t(
    reloading ? "pullToReload.reloading" : armed ? "pullToReload.release" : "pullToReload.pull"
  );
}

function build(): void {
  icon = el("span", { class: "pull-reload-icon" }, "↓");
  text = el("span", { class: "pull-reload-label" });
  // Hidden from screen readers: it is the visible half of a drag, and a drag is
  // not how a reader using one navigates. Their way to the same thing is the
  // gear menu's Reload row, which needs no commentary from here.
  pill = el("div", { class: "pull-reload", "aria-hidden": "true", hidden: true }, [icon, text]);
  document.body.append(pill);
}
