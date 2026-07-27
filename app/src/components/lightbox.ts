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
// One overlay is reused across opens (a module singleton). Escape / backdrop /
// the close button all dismiss it; ← → page through a sighting's photos; body
// scroll is locked while it's open and focus is restored to the thumbnail on
// close.
import { el } from "../ui";
import type { ObservationSummary } from "../lib/inaturalist";

const INAT = "https://www.inaturalist.org";

interface LightboxState {
  photos: ObservationSummary["photos"];
  index: number;
  observation: ObservationSummary;
  plantName: string;
  returnFocus: HTMLElement | null;
}

let overlay: HTMLElement | null = null;
let state: LightboxState | null = null;

/** Open the lightbox on one photo of a sighting, able to page through the rest. */
export function openObservationLightbox(
  observation: ObservationSummary,
  startIndex: number,
  plantName: string,
  returnFocus?: HTMLElement | null,
): void {
  if (!observation.photos.length) return;
  state = {
    photos: observation.photos,
    index: Math.max(0, Math.min(startIndex, observation.photos.length - 1)),
    observation,
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
  const n = state.photos.length;
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

  const prev = el("button", { class: "lb-nav lb-prev", "aria-label": "Previous photo", onClick: () => step(-1) }, "‹");
  const next = el("button", { class: "lb-nav lb-next", "aria-label": "Next photo", onClick: () => step(1) }, "›");
  const closeBtn = el("button", { class: "lb-close", "aria-label": "Close", onClick: close }, "✕");

  const stage = el("div", { class: "lb-stage" }, [prev, img, next]);
  const panel = el("div", {
    class: "lb-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Photo viewer",
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
  const { photos, index, observation, plantName } = state;
  const photo = photos[index];

  img.src = photo.largeUrl || photo.mediumUrl;
  img.alt = `${observation.taxonName ?? plantName}, photographed by ${observation.observer}`;

  const many = photos.length > 1;
  prev.hidden = !many;
  next.hidden = !many;
  counter.textContent = many ? `${index + 1} / ${photos.length}` : "";

  // The credit block: author + licence, iNaturalist, and the link back to the
  // original sighting. Rebuilt each paint so the licence tracks the photo.
  caption.replaceChildren(
    el("p", { class: "lb-title" }, observation.taxonName ?? plantName),
    el("p", { class: "lb-credit" }, [
      "Photo © ",
      el("a", { href: `${INAT}/people/${observation.observer}`, target: "_blank", rel: "noopener" }, observation.observer),
      ` · ${licenseLabel(photo.license)} · via `,
      el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
    ]),
    el("a", {
      class: "lb-source btn btn-secondary",
      href: `${INAT}/observations/${observation.id}`,
      target: "_blank",
      rel: "noopener",
    }, "View original sighting on iNaturalist ↗"),
  );
}

// "cc-by-nc" → "CC BY-NC"; "cc0" → "CC0". Anything unexpected is upper-cased as-is.
function licenseLabel(code: string): string {
  if (code === "cc0") return "CC0";
  return code.toUpperCase().replace(/^CC-/, "CC ");
}
