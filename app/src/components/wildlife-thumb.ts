// The slot an animal occupies — the emoji beside its name on the wildlife
// index, and the bigger one at the head of its own page.
//
// It holds the drawn kind glyph — a butterfly for every butterfly, a bee for
// every bee (`wildlife-glyphs.ts`, the counterpart to the plant form drawings).
// Honest about the kind of creature and useless for telling one butterfly from
// another, which is exactly what the form drawings are for plants. When someone
// has picked a photograph for the animal (`data/wildlife-photos.json`), the
// photograph fades in over it.
//
// **The glyph is the placeholder, and it is never removed.** It paints
// instantly, it is already the right size, and it says something true. So there
// is no grey box, no spinner, no layout shift, and nothing to do when the photo
// never arrives — offline, on a metered connection, or for the informal groups
// ("Jays, turkeys & woodpeckers") that are no one species and can never have
// one. The slot is the same square either way, so a list of a dozen animals
// starts every name at the same place whether or not the picture came.
//
// **Decorative, and marked as such.** The row already names the animal; a
// photograph of it adds nothing for a screen reader and would only repeat the
// name. The slot stays `aria-hidden`, as it was when it held the glyph alone.
//
// The animal's own page gets the same treatment the plant profile does, and for
// the same reasons — `wildlifeHero` below, which is a credited, tappable
// photograph rather than a decorative slot. It borrows the plant hero's classes
// deliberately: an animal's page is already built out of `.plant`, `.plant-head`
// and `.plant-name` (see `steps/wildlife.ts`), because the two profiles are the
// same page with a different subject, and a second set of near-identical rules
// would be two places to keep one layout.
import { el } from "../ui";
import { wildlifePhotoFor } from "../lib/hero-photo";
import { heroFigure } from "./hero-figure";
import { loadPhoto, budget } from "../lib/photo";
import { commonName } from "../lib/names";
import { WILDLIFE_GLYPHS, stemWidth, type WildlifeGlyphKey } from "./wildlife-glyphs";
import type { Wildlife } from "../types";

/**
 * The browser's copy of a wildlife glyph — the same table and stem rule the
 * card generator uses through `wildlifeGlyphMarkup`, built as real SVG here the
 * way `silhouetteFor` builds a plant's. Brand green unless a colour is given.
 */
export function wildlifeSilhouette(key: WildlifeGlyphKey, size = 40, color?: string): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  const green = color ?? (getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#175e33");
  for (const mark of WILDLIFE_GLYPHS[key] ?? WILDLIFE_GLYPHS.butterfly) {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", mark.d);
    if (mark.stem) {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", green);
      path.setAttribute("stroke-width", String(Math.round(stemWidth(size) * 100) / 100));
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
    } else {
      path.setAttribute("fill", green);
    }
    svg.append(path);
  }
  return svg;
}

/** The glyph at chip/heading size, aligned to sit on a line of text — the
 *  wildlife counterpart to `formIcon` in `steps/region.ts`. */
export function wildlifeIcon(key: WildlifeGlyphKey, size = 17): SVGSVGElement {
  const svg = wildlifeSilhouette(key, size);
  svg.style.verticalAlign = "-0.18em";
  return svg;
}

/**
 * The slot for one animal. `glyph` is the drawn kind silhouette that stands in
 * until — and under — a chosen photograph (resolve it with `glyphKeyFor`).
 * `px` is the drawn width, so the loader can ask iNaturalist for the smallest
 * rendition that covers it; `regionId` picks the region-specific photograph when
 * there is one, exactly as a plant's does.
 *
 * `attrs` is merged onto the box so callers keep the layout hints they rely on.
 */
export function wildlifeThumb(
  wildlifeId: string,
  glyph: WildlifeGlyphKey,
  opts: { px?: number; regionId?: string; attrs?: Record<string, string>; urgent?: boolean } = {},
): HTMLElement {
  const px = opts.px ?? 72;
  const box = el("span", {
    class: "wildlife-photo",
    "aria-hidden": "true",
    ...opts.attrs,
  }, [el("span", { class: "wildlife-photo-icon" }, [wildlifeSilhouette(glyph, 34)])]);

  // On a metered or 2G connection the glyph is the whole answer: a list of
  // decorative thumbnails is not what someone rationing their data came for.
  const pick = budget() === "essential" ? undefined : wildlifePhotoFor(wildlifeId, opts.regionId);
  if (!pick) return box;

  // The photograph's own average colour underneath it, so it fades up out of
  // its own greens and browns rather than out of the app's placeholder tint.
  if (pick.color) box.style.background = pick.color;
  const img = el("img", { class: "photo-fade", alt: "", width: 144, height: 144 });
  box.append(img);
  loadPhoto(img, pick.mediumUrl, px, opts.urgent ?? false);
  return box;
}

/**
 * The chosen photograph at the head of an animal's page — or null when nobody
 * has picked one, in which case the drawn kind glyph stays and the page is
 * unchanged.
 *
 * Credited on the spot and enlargeable, through the one figure a plant's page
 * and an impostor's page also use (`components/hero-figure.ts`) — so an animal's
 * hero is credited in exactly the same words as a plant's and as a sighting
 * somebody found near them.
 */
export function wildlifeHero(w: Wildlife, regionId?: string): HTMLElement | null {
  const pick = wildlifePhotoFor(w.id, regionId);
  return pick ? heroFigure(pick, commonName(w), w.latin ?? commonName(w)) : null;
}
