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
// Paging runs across *every sighting on screen*, not just the one that was
// tapped: a section that found four sightings of the same animal is one
// continuous reel of photos, so ← → carries on into the next observer's
// pictures instead of dead-ending after three. The credit block is rebuilt on
// every photo, so crossing that boundary re-credits the new observer, re-states
// their licence, re-points the "view original sighting" link, and says where and
// when that one was seen — nobody's photo is ever shown under somebody else's name.
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
  // Focus the close button so Escape/Enter work and focus is trapped-ish.
  (overlay.querySelector(".lb-close") as HTMLElement | null)?.focus();
}

function close(): void {
  if (!overlay) return;
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
  // Stash the mutable bits for paint() to find.
  (root as any)._parts = { img, caption, counter, prev, next };
  return root;
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
  caption.replaceChildren(
    el("p", { class: "lb-title" }, observation.taxonName ?? plantName),
    el("p", { class: "lb-credit" }, [
      ...tx(
        "lightbox.credit",
        {
          observer: el("a", { href: `${INAT}/people/${observation.observer}`, target: "_blank", rel: "noopener" }, observation.observer),
          site: el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
        },
        { licence: licenseLabel(photo.license) }
      ),
      seen ? el("span", { class: "lb-seen" }, seen) : null,
    ]),
    el("a", {
      class: "lb-source",
      href: `${INAT}/observations/${observation.id}`,
      target: "_blank",
      rel: "noopener",
    }, t("lightbox.viewOriginal")),
  );
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

// "cc-by-nc" → "CC BY-NC"; "cc0" → "CC0". Anything unexpected is upper-cased as-is.
function licenseLabel(code: string): string {
  if (code === "cc0") return "CC0";
  return code.toUpperCase().replace(/^CC-/, "CC ");
}
