// A photo lightbox for iNaturalist sightings.
//
// Tapping a thumbnail opens the photo *in place* — a full-screen overlay — so a
// person can see the plant large without being thrown out to inaturalist.org
// and losing their place in Indigene. But we never pretend the photo is ours:
// every view carries, visibly,
//   - the observer's credit (the person who took it) + its licence,
//   - a credit to iNaturalist itself, and
//   - an always-present link back to the *original sighting* on iNaturalist,
// so a tap-through to the source is one click away and the source is named.
//
// Three ways to page, all landing in the same place: the ‹ › buttons, the ← →
// keys, and a swipe across the photo. The swipe exists so a thumb never has to
// hunt for a small round button at the edge of a picture.
//
// Paging runs across *every sighting on screen*, not just the one that was
// tapped: a section that found four sightings of the same animal is one
// continuous reel of photos, so ← → carries on into the next observer's
// pictures instead of dead-ending after three. The credit block is rebuilt on
// every photo, so crossing that boundary re-credits the new observer, re-states
// their licence, re-points the "view original sighting" link, and says where and
// when that one was seen — nobody's photo is ever shown under somebody else's name.
//
// Opening the lightbox also starts warming the rest of the reel: once the first
// photo is on screen, the full-size version of every other photo in the set is
// fetched one at a time, in paging order, at low priority. Paging is then
// instant instead of a fresh several-hundred-KB download per tap — the reader
// walks a gallery rather than waiting on one. Serial and low-priority on
// purpose: it must never compete with the photo someone is looking at, and a
// phone on cell data shouldn't have twelve JPEGs in flight at once. The service
// worker keeps whatever this pulls, so a second visit costs nothing.
//
// One overlay is reused across opens (a module singleton). Escape / backdrop /
// the close button all dismiss it; body scroll is locked while it's open and
// focus is restored to the thumbnail on close.
import { el } from "../ui";
import { t, tx, fmtNumber } from "../lib/i18n";
import { whereWhen } from "../lib/inaturalist";
import type { ObservationPhoto, ObservationSummary } from "../lib/inaturalist";

const INAT = "https://www.inaturalist.org";

/** One photo in the flattened reel, carrying the sighting it came from so the
 *  credit shown beneath it is always that photo's own. */
interface Frame {
  photo: ObservationPhoto;
  observation: ObservationSummary;
  /** Position of the sighting among those on screen, for "sighting 2 of 4". */
  obsIndex: number;
}

/** Where to open: the tapped thumbnail's sighting and which of its photos. */
export interface LightboxStart {
  observation: number;
  photo: number;
}

interface LightboxState {
  frames: Frame[];
  index: number;
  /** How many sightings the reel spans — 1 hides the "sighting n of m" note. */
  observations: number;
  plantName: string;
  returnFocus: HTMLElement | null;
}

let overlay: HTMLElement | null = null;
let state: LightboxState | null = null;
// Undoes a drag in progress (see attachSwipe). Closing mid-drag — Escape, say,
// or the dismiss the drag itself asked for — must not leave the reused overlay
// tilted or half-transparent for the next photo someone taps.
let resetDrag: (() => void) | null = null;
// Bumped whenever the reel changes (a new open, or a close); the warming loop
// compares against it between photos and stops rather than pulling images for a
// set nobody is looking at any more.
let reelToken = 0;
// Bumped on every paint; an in-flight decode from a previous photo compares
// against it and quietly drops out, so fast paging can't paint a stale photo.
let paintToken = 0;

/**
 * Open the lightbox on one photo, able to page through every photo of every
 * sighting in `observations` — the whole set the section is showing, in the
 * order it shows them. `start` names the tapped thumbnail (which sighting, which
 * of its photos); the reel includes photos the card had no room for.
 */
export function openObservationLightbox(
  observations: ObservationSummary[],
  start: LightboxStart,
  plantName: string,
  returnFocus?: HTMLElement | null,
): void {
  const frames: Frame[] = [];
  let index = 0;
  observations.forEach((observation, obsIndex) => {
    observation.photos.forEach((photo, photoIndex) => {
      if (obsIndex === start.observation && photoIndex === start.photo) index = frames.length;
      frames.push({ photo, observation, obsIndex });
    });
  });
  if (!frames.length) return;
  state = {
    frames,
    index,
    observations: observations.length,
    plantName,
    returnFocus: returnFocus ?? null,
  };
  if (!overlay) overlay = buildOverlay();
  document.body.append(overlay);
  document.body.style.overflow = "hidden"; // no scrolling the page behind it
  document.addEventListener("keydown", onKey);
  paint();
  void warmReel(++reelToken, frames, index);
  // Focus the close button so Escape/Enter work and focus is trapped-ish.
  (overlay.querySelector(".lb-close") as HTMLElement | null)?.focus();
}

function close(): void {
  if (!overlay) return;
  resetDrag?.();
  reelToken++; // stops any warming still walking the reel
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
  overlay.remove();
  state?.returnFocus?.focus?.();
  state = null;
}

function step(delta: number): void {
  if (!state) return;
  const n = state.frames.length;
  state.index = (state.index + delta + n) % n;
  paint();
}

function onKey(e: KeyboardEvent): void {
  if (e.key === "Escape") close();
  else if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
}

// The persistent shell; `paint()` fills the parts that change per photo.
function buildOverlay(): HTMLElement {
  const img = el("img", { class: "lb-img", alt: "" }) as HTMLImageElement;
  const caption = el("div", { class: "lb-caption" });
  const counter = el("span", { class: "lb-counter" });

  const prev = el("button", { class: "lb-nav lb-prev", "aria-label": t("lightbox.prev"), onClick: () => step(-1) }, "‹");
  const next = el("button", { class: "lb-nav lb-next", "aria-label": t("lightbox.next"), onClick: () => step(1) }, "›");
  const closeBtn = el("button", { class: "lb-close", "aria-label": t("lightbox.close"), onClick: close }, "✕");

  const stage = el("div", { class: "lb-stage" }, [prev, img, next]);
  const panel = el("div", {
    class: "lb-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": t("lightbox.viewer"),
    // Clicks inside the panel must not fall through to the backdrop's close.
    onClick: (e: Event) => e.stopPropagation(),
  }, [closeBtn, stage, el("div", { class: "lb-foot" }, [caption, counter])]);

  const root = el("div", { class: "lb-overlay", onClick: close }, [panel]);
  attachSwipe(stage, img, panel, root);
  // Stash the mutable bits for paint() to find.
  (root as any)._parts = { img, caption, counter, prev, next };
  return root;
}

// Dragging the photo does one of two things, decided by the first few pixels of
// travel and then held for the rest of the gesture:
//
//   sideways — pages the reel, landing on exactly what the ‹ › buttons would
//     have done: left for the next photo, right for the previous, wrapping at
//     the ends the same way, because it calls the same `step`. The photo follows
//     the finger at a fraction of the distance, then snaps back or settles on
//     the new photo.
//   downwards — puts the viewer away, exactly as ✕ / Escape / the backdrop do.
//     The whole panel rides down with the finger and the backdrop thins out as
//     it goes, so a half-hearted drag shows you what it would do and returns the
//     photo when you let go. Dragging *up* only rubber-bands: there's nothing up
//     there, and a gesture that goes nowhere shouldn't pretend otherwise.
//
// Only touch and pen count. A mouse drag on a picture already means something
// else (select, drag the image out), and a desktop has the buttons, Escape and
// the arrow keys, so we leave it alone.
const SWIPE_MIN = 48; // px a deliberate sideways drag must cover to page…
const FLICK_MIN = 20; // …or less, for a flick…
const FLICK_MS = 300; // …that was this quick.
const DISMISS_MIN = 110; // px a downward drag must cover to close…
const DISMISS_FLICK = 45; // …or less, for a quick flick down.
const INTENT_MIN = 8; // px before a drag is called sideways or downwards
const FOLLOW = 0.35; // how much of a sideways drag the photo travels
const UP_FOLLOW = 0.2; // …and of an upward one, which is going nowhere
const FADE_OVER = 420; // px of downward travel that thins the backdrop right out
const BACKDROP = 0.86; // the backdrop's resting alpha — .lb-overlay's own…
const BACKDROP_MIN = 0.3; // …and how far a long drag down thins it

function attachSwipe(
  stage: HTMLElement,
  img: HTMLImageElement,
  panel: HTMLElement,
  root: HTMLElement,
): void {
  let startX = 0;
  let startY = 0;
  let startedAt = 0;
  let tracking = false;
  let axis: "" | "x" | "y" = "";

  // Back to a photo sitting still in an opaque viewer. Called on release, on
  // cancel, and before closing — the overlay is one reused element, so a
  // transform left behind would greet the next photo someone taps.
  const reset = (): void => {
    tracking = false;
    axis = "";
    img.classList.remove("lb-img-dragging");
    panel.classList.remove("lb-panel-dragging");
    img.style.transform = "";
    panel.style.transform = "";
    root.style.backgroundColor = "";
  };
  resetDrag = reset;

  stage.addEventListener("pointerdown", (e: PointerEvent) => {
    if (e.pointerType === "mouse" || !e.isPrimary) return;
    if (!state) return;
    tracking = true;
    axis = "";
    startX = e.clientX;
    startY = e.clientY;
    startedAt = e.timeStamp;
  });

  stage.addEventListener("pointermove", (e: PointerEvent) => {
    if (!tracking || !state) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < INTENT_MIN) return;
      // A reel of one photo pages nowhere — same reason the buttons are hidden —
      // so a sideways drag there is left as nothing rather than a dead wobble.
      if (Math.abs(dx) > Math.abs(dy)) {
        if (state.frames.length < 2) { reset(); return; }
        axis = "x";
        img.classList.add("lb-img-dragging");
      } else {
        axis = "y";
        panel.classList.add("lb-panel-dragging");
      }
      // Now that this is plainly a drag and not a tap on ‹ › or ✕, follow the
      // finger even if it leaves the photo — releasing off the edge still counts.
      stage.setPointerCapture?.(e.pointerId);
    }
    if (axis === "x") {
      img.style.transform = `translateX(${dx * FOLLOW}px)`;
    } else {
      const travel = dy > 0 ? dy : dy * UP_FOLLOW;
      panel.style.transform = `translateY(${travel}px)`;
      // Only the backdrop thins as the viewer falls away — the page underneath
      // comes back gradually instead of all at once at the end. The photo keeps
      // its own opacity: a picture you can see through looks broken, not moving.
      const shade = BACKDROP - (BACKDROP - BACKDROP_MIN) * Math.min(Math.max(travel, 0) / FADE_OVER, 1);
      root.style.backgroundColor = `rgba(0, 0, 0, ${shade.toFixed(3)})`;
    }
  });

  stage.addEventListener("pointerup", (e: PointerEvent) => {
    if (!tracking) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const quick = e.timeStamp - startedAt < FLICK_MS;
    const wasAxis = axis;
    reset();
    if (wasAxis === "x") {
      if (Math.abs(dx) >= SWIPE_MIN || (quick && Math.abs(dx) >= FLICK_MIN)) step(dx < 0 ? 1 : -1);
    } else if (wasAxis === "y") {
      if (dy >= DISMISS_MIN || (quick && dy >= DISMISS_FLICK)) close();
    }
  });

  stage.addEventListener("pointercancel", reset);
}

function paint(): void {
  if (!overlay || !state) return;
  const { img, caption, counter, prev, next } = (overlay as any)._parts as {
    img: HTMLImageElement; caption: HTMLElement; counter: HTMLElement; prev: HTMLElement; next: HTMLElement;
  };
  const { frames, index, plantName } = state;
  const { photo, observation, obsIndex } = frames[index];

  showPhoto(img, photo.largeUrl || photo.mediumUrl);
  img.alt = t("obs.photoAlt", {
    name: observation.taxonName ?? plantName,
    observer: observation.observer,
  });

  const many = frames.length > 1;
  prev.hidden = !many;
  next.hidden = !many;
  // Two counts, because the reel spans sightings: where this photo sits in the
  // whole set, and which sighting it belongs to.
  const counts: (string | Node)[] = [];
  if (many) counts.push(`${fmtNumber(index + 1)} / ${fmtNumber(frames.length)}`);
  if (state.observations > 1) {
    counts.push(el("span", { class: "lb-counter-obs" },
      t("lightbox.sightingOf", { i: fmtNumber(obsIndex + 1), n: fmtNumber(state.observations) })));
  }
  counter.replaceChildren(...counts);

  // The credit block: author + licence, where and when it was seen, and the link
  // back to the original sighting. Rebuilt each paint so all of it tracks the
  // photo — paging into the next observer's photos re-credits them.
  const seen = whereWhen(observation);
  // A species photograph from iNaturalist's own taxon gallery has no sighting
  // behind it: its credit names the photographer as iNaturalist states them —
  // which may be someone who never had an account — so there is no profile to
  // link, and "original" means the photo's page rather than a record.
  const taxonPhoto = observation.taxonPhoto === true;
  caption.replaceChildren(
    el("p", { class: "lb-title" }, observation.taxonName ?? plantName),
    el("p", { class: "lb-credit" }, [
      ...tx(
        "lightbox.credit",
        {
          observer: taxonPhoto
            ? el("span", {}, observation.observer)
            : el("a", { href: `${INAT}/people/${observation.observer}`, target: "_blank", rel: "noopener" }, observation.observer),
          site: el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
        },
        { licence: licenseLabel(photo.license) }
      ),
      seen ? el("span", { class: "lb-seen" }, seen) : null,
    ]),
    el("a", {
      class: "lb-source",
      href: taxonPhoto ? `${INAT}/photos/${photo.id}` : `${INAT}/observations/${observation.id}`,
      target: "_blank",
      rel: "noopener",
    }, t(taxonPhoto ? "lightbox.viewPhoto" : "lightbox.viewOriginal")),
  );
}

/**
 * Fetch the full-size version of every other photo in the reel, one at a time,
 * starting with the one the reader will most likely ask for next (the one after
 * the photo they opened) and wrapping around.
 *
 * Deliberately unhurried: each image is awaited before the next begins, and each
 * is marked low priority so the browser lets the on-screen photo and anything
 * the page still needs go first. Failures are ignored — this is an optimisation,
 * and `showPhoto` will try the URL properly if the reader actually gets there.
 * `token` is the guard: it goes stale the moment the lightbox closes or reopens
 * on a different set, and the loop notices between photos and stops.
 */
async function warmReel(token: number, frames: Frame[], from: number): Promise<void> {
  const n = frames.length;
  for (let step = 1; step < n; step++) {
    if (token !== reelToken) return;
    const { photo } = frames[(from + step) % n];
    const url = photo.largeUrl || photo.mediumUrl;
    const img = new Image();
    img.fetchPriority = "low";
    img.src = url;
    await img.decode().catch(() => {});
  }
}

// Swap the stage to a new photo without the browser's progressive-JPEG jitter:
// fetch and decode the image *off-screen* first, then show the finished frame
// with a short fade. While it decodes, the stage keeps its size (the panel is
// full-height) and shows a quiet pulsing placeholder instead of a half-painted
// image. If decode() fails (unsupported, or a flaky fetch) we still set the
// src — the browser retries in place and the alt text stands in.
function showPhoto(img: HTMLImageElement, url: string): void {
  const token = ++paintToken;
  const stage = img.parentElement;
  img.classList.remove("lb-img-ready");
  stage?.classList.add("lb-loading");
  const pre = new Image();
  pre.src = url;
  pre.decode().catch(() => {}).then(() => {
    if (token !== paintToken || !overlay?.isConnected) return; // stale or closed
    img.src = url;
    stage?.classList.remove("lb-loading");
    // Two frames so the opacity transition runs even for a cached image.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token === paintToken) img.classList.add("lb-img-ready");
    }));
  });
}

/** "cc-by-nc" → "CC BY-NC"; "cc0" → "CC0". Anything unexpected is upper-cased
 *  as-is. Exported because the plant page's hero credit prints the same label,
 *  and two spellings of a licence is one too many. */
export function licenseLabel(code: string): string {
  if (code === "cc0") return "CC0";
  return code.toUpperCase().replace(/^CC-/, "CC ");
}
