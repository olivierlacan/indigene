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
// drawing.
import { el } from "../ui";
import { silhouetteFor } from "./plant-card";
import { heroPhotoFor } from "../lib/hero-photo";
import { loadPhoto, budget } from "../lib/photo";
import type { PlantForm } from "../types";

/** The slot's drawn width, matching `.plant-photo` in the stylesheet (4.5rem).
 *  Passed to the loader so it can ask iNaturalist for the smallest rendition
 *  that covers it — `square` on a laptop, `small` on a phone. */
const THUMB_PX = 72;

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
  opts: { regionId?: string; attrs?: Record<string, string> } = {},
): HTMLElement {
  const box = el("span", {
    class: "plant-photo",
    "aria-hidden": "true",
    ...opts.attrs,
  }, [silhouetteFor(form)]);

  // On a metered or 2G connection the drawing is the whole answer: a list of
  // decorative thumbnails is not what someone rationing their data came for.
  const pick = budget() === "essential" ? undefined : heroPhotoFor(plantId, opts.regionId);
  if (!pick) return box;

  const img = el("img", { class: "photo-fade", alt: "", width: 144, height: 144 });
  box.append(img);
  loadPhoto(img, pick.thumbUrl, THUMB_PX);
  return box;
}
