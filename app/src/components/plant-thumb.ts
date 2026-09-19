// The square slot a plant occupies in a list — on the plants index, on a
// region's roster, and on the starring-plant strip of a region card.
//
// It has always held the form drawing: one shrub for every shrub, one tree for
// every tree. Honest about shape, useless for recognition. Now, when someone has
// picked a photograph for the plant (`data/hero-photos.json`), the photograph
// fades in over the drawing.
//
// **The drawing is the placeholder, and it is never removed.** It paints
// instantly, it is already the right size and colour, and it says something true
// about the plant. So there is no grey box, no spinner, no layout shift, and
// nothing to do when the photo never arrives — offline, on a metered
// connection, or for the plants nobody has reviewed yet. The list looks exactly
// as it did; some rows just get better.
//
// **Decorative, and marked as such.** The row already names the plant twice; a
// photograph of it adds nothing for a screen reader and would only repeat the
// name a third time. The slot stays `aria-hidden`, as it was when it held the
// drawing — unless it is the way somewhere, as a link (`href`) or as the way to
// see the photograph full size (`enlarge`). Then it is a control, it is named,
// and it is reachable from the keyboard.
import { el } from "../ui";
import { silhouetteFor } from "./plant-card";
import {
  heroPhotoFor,
  lookalikePhotoFor,
  alternativePhotoFor,
  asObservation,
  type HeroPhoto,
} from "../lib/hero-photo";
import { loadPhoto, budget } from "../lib/photo";
import { openObservationLightbox } from "./lightbox";
import { t } from "../lib/i18n";
import type { PlantForm } from "../types";

/** The slot's drawn width, matching `.plant-photo` in the stylesheet (4.5rem).
 *  Passed to the loader so it can ask iNaturalist for the smallest rendition
 *  that covers it — `square` on a laptop, `small` on a phone. */
const THUMB_PX = 72;

/** What a slot needs to know to open the photo full size: the name the
 *  lightbox puts at the top, and the binomial its alt text and credit fall
 *  back to. Passing it is what turns the slot from decoration into a control —
 *  see `thumb` below. */
export interface Enlargeable {
  name: string;
  latin: string;
}

/**
 * The slot for one plant. `regionId` picks the region-specific photograph when
 * there is one, exactly as the plant page does — a live oak in Florida and the
 * same species in Maryland are different-looking trees.
 *
 * `attrs` is merged onto the box so callers can keep the flex hints their
 * layouts already rely on.
 */
export function plantThumb(
  plantId: string,
  form: PlantForm,
  opts: {
    regionId?: string;
    attrs?: Record<string, string>;
    href?: string;
    label?: string;
    enlarge?: Enlargeable;
  } = {},
): HTMLElement {
  // On a metered or 2G connection the drawing is the whole answer: a list of
  // decorative thumbnails is not what someone rationing their data came for.
  const pick = budget() === "essential" ? undefined : heroPhotoFor(plantId, opts.regionId);
  return thumb(form, pick, opts);
}

/**
 * The same slot for an impostor, on the look-alikes index and at the head of
 * its own page. Its photograph is always iNaturalist's own — nobody shortlists
 * a Callery pear — and it matters more here than in a list of natives: the
 * index is scanned by somebody trying to work out which of these is the tree in
 * their own street.
 */
export function lookalikeThumb(
  lookalikeId: string,
  form: PlantForm,
  opts: { attrs?: Record<string, string> } = {},
): HTMLElement {
  const pick = budget() === "essential" ? undefined : lookalikePhotoFor(lookalikeId);
  return thumb(form, pick, opts);
}

/**
 * The same slot for an ornamental, on the native-swaps index and at the head of
 * its own page — iNaturalist's own photograph of the plant a native replaces.
 */
export function alternativeThumb(
  ornamentalId: string,
  form: PlantForm,
  opts: { attrs?: Record<string, string> } = {},
): HTMLElement {
  const pick = budget() === "essential" ? undefined : alternativePhotoFor(ornamentalId);
  return thumb(form, pick, opts);
}

/**
 * The slot itself. Decorative and `aria-hidden` by default — the row names the
 * plant twice already — except where the slot is *itself* the way in: an
 * animal's list of plants makes the picture a link, and a link with nothing
 * readable in it is a link a screen reader has to call "unlabelled". `label` is
 * what it says there.
 */
function thumb(
  form: PlantForm,
  pick: HeroPhoto | undefined,
  opts: { attrs?: Record<string, string>; href?: string; label?: string; enlarge?: Enlargeable },
): HTMLElement {
  // A slot with a photograph behind it and an `enlarge` name is a control: it
  // opens the same lightbox the hero photo at the top of a page opens, with the
  // same credit, licence and link back to iNaturalist. Without a photograph
  // there is nothing to enlarge, so the slot stays the decoration it was —
  // a button that opens a drawing of a generic shrub is a promise we'd break.
  if (opts.enlarge && pick) return zoomThumb(form, pick, opts.enlarge, opts.attrs);

  const box = opts.href
    ? el("a", {
        class: "plant-photo",
        href: opts.href,
        ...(opts.label ? { "aria-label": opts.label } : {}),
        ...opts.attrs,
      }, [silhouetteFor(form)])
    : el("span", {
        class: "plant-photo",
        "aria-hidden": "true",
        ...opts.attrs,
      }, [silhouetteFor(form)]);
  if (!pick) return box;

  const img = el("img", { class: "photo-fade", alt: "", width: 144, height: 144 });
  box.append(img);
  loadPhoto(img, pick.thumbUrl, THUMB_PX);
  return box;
}

/**
 * The slot as a button. Every other photograph in the app opens this way, and
 * the reason to give a list thumbnail the same power is that 72 px of plant is
 * not a look at a plant — it is a hint that there is one to look at.
 */
function zoomThumb(
  form: PlantForm,
  pick: HeroPhoto,
  enlarge: Enlargeable,
  attrs: Record<string, string> | undefined,
): HTMLElement {
  const observation = asObservation(pick, enlarge.latin);
  const btn = el("button", {
    type: "button",
    class: "plant-photo plant-photo-zoom",
    "aria-label": t("hero.enlarge", { name: enlarge.name }),
    // The photograph's own average colour under the drawing, as the hero slot
    // does it, so the square is never a flat green rectangle waiting.
    ...(pick.color ? { style: `background:${pick.color}` } : {}),
    ...attrs,
    onClick: () =>
      openObservationLightbox([observation], { observation: 0, photo: 0 }, enlarge.name, btn),
  }, [silhouetteFor(form)]) as HTMLButtonElement;

  const img = el("img", { class: "photo-fade", alt: "", width: 144, height: 144 });
  btn.append(img);
  loadPhoto(img, pick.thumbUrl, THUMB_PX);
  return btn;
}
