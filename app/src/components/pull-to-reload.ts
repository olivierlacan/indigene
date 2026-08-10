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
// The gesture: at the very top of a page, drag down. The header appears to
// stretch — a green band grows out from under it, warming toward sunlight at
// its leading edge — and the bee leaves the logo to come and see what you're
// doing. Past a threshold it hovers and the words change; let go and the page
// reloads, let go short of it and the band closes back into the header.
//
// A drag is not something everyone can do, so it is not the only way: the
// header's gear menu carries a Reload row in the same situation
// (components/app-menu.ts).
import { el } from "../ui";
import { t } from "../lib/i18n";
import { isHomeScreenApp } from "../lib/standalone";

/** How far the band opens before letting go means "reload". */
const ARM = 48;
/** Where it stops following, however far the finger keeps going. */
const MAX_PULL = 88;
/** The band opens about half as far as the finger travels: a reload should take
 *  a deliberate drag, and the resistance is what a phone owner expects here. */
const DAMPING = 0.55;
/** Enough movement to tell down from sideways, and no more. The gesture takes
 *  the touch as early as it honestly can: every pixel it waits is a pixel of
 *  the browser's own bounce, which opens a pale gap above the header. */
const DEADZONE = 3;

let band: HTMLElement | null = null;
let bee: HTMLElement | null = null;
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
  // Turns the page's canvas green, so a bounce this gesture doesn't catch shows
  // more header rather than a pale gap (see the note in styles.css).
  document.documentElement.dataset.homeScreen = "";
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
    // gesture over, and taking half of it would mean a band opening beside a
    // page moving on its own.
    if (!e.cancelable) return stop();
    engaged = true;
    show();
  }

  // Ours now. Without this the page rubber-bands under the band and the two
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
  // A beat, so the band has a frame to say what's happening before the page
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

/** Let go of the gesture — the listeners, not the band. */
function stop(): void {
  tracking = false;
  engaged = false;
  document.removeEventListener("touchmove", onMove);
  document.removeEventListener("touchend", onEnd);
  document.removeEventListener("touchcancel", onCancel);
}

/** Close the band back into the header and leave nothing behind. */
function retract(): void {
  if (!band) return;
  pull = 0;
  band.classList.add("is-settling");
  paint();
  const done = band;
  settle = window.setTimeout(() => {
    done.hidden = true;
    done.classList.remove("is-settling");
  }, 260);
}

function show(): void {
  if (!band) build();
  if (!band || !bee) return;
  // A pull that starts while the last one is still closing: without this, the
  // old retract's timer arrives mid-gesture and hides a band that is at that
  // moment following a finger.
  window.clearTimeout(settle);
  // The band grows *from* the header, so where the header ends is where it has
  // to be pinned. Measured per gesture: the header wraps to two rows at large
  // text sizes, and the step rail comes and goes with the flow.
  const header = document.querySelector(".app-header");
  const top = header ? header.getBoundingClientRect().bottom : 0;
  band.style.setProperty("--pull-top", `${Math.round(top)}px`);
  band.classList.remove("is-settling");
  band.hidden = false;
  // Fly the bee in again. Removing the class isn't enough on its own — an
  // animation only restarts once the element has been laid out without it,
  // which is what reading `offsetWidth` forces.
  bee.classList.remove("is-arriving");
  void bee.offsetWidth;
  bee.classList.add("is-arriving");
}

function paint(): void {
  if (!band || !text) return;
  band.style.setProperty("--pull", `${Math.round(pull)}px`);
  const armed = pull >= ARM;
  band.classList.toggle("is-armed", armed && !reloading);
  band.classList.toggle("is-reloading", reloading);
  text.textContent = t(
    reloading ? "pullToReload.reloading" : armed ? "pullToReload.release" : "pullToReload.pull"
  );
}

function build(): void {
  bee = el("span", { class: "pull-reload-bee" }, "\u{1F41D}");
  text = el("span", { class: "pull-reload-label" });
  // Hidden from screen readers: it is the visible half of a drag, and a drag is
  // not how a reader using one navigates. Their way to the same thing is the
  // gear menu's Reload row, which needs no commentary from here.
  band = el("div", { class: "pull-reload", "aria-hidden": "true", hidden: true }, [
    el("div", { class: "pull-reload-inner" }, [bee, text]),
  ]);
  document.body.append(band);
}
