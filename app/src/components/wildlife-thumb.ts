// The slot an animal occupies — the emoji beside its name on the wildlife
// index, and the bigger one at the head of its own page.
//
// It has always held an emoji: 🦋 for every butterfly, 🐝 for every bee. Honest
// about the kind of creature and useless for recognition, which is exactly what
// the form drawings were for plants. Now, when someone has picked a photograph
// for the animal (`data/wildlife-photos.json`), the photograph fades in over it.
//
// **The emoji is the placeholder, and it is never removed.** It paints
// instantly, it is already the right size, and it says something true. So there
// is no grey box, no spinner, no layout shift, and nothing to do when the photo
// never arrives — offline, on a metered connection, or for the animals nobody
// has reviewed yet. The page looks exactly as it did; some rows just get better.
//
// **Decorative, and marked as such.** The row already names the animal; a
// photograph of it adds nothing for a screen reader and would only repeat the
// name. The slot stays `aria-hidden`, as it was when it held the emoji alone.
//
// The animal's own page gets the same treatment the plant profile does, and for
// the same reasons — `wildlifeHero` below, which is a credited, tappable
// photograph rather than a decorative slot. It borrows the plant hero's classes
// deliberately: an animal's page is already built out of `.plant`, `.plant-head`
// and `.plant-name` (see `steps/wildlife.ts`), because the two profiles are the
// same page with a different subject, and a second set of near-identical rules
// would be two places to keep one layout.
import { el } from "../ui";
import { wildlifePhotoFor, asObservation } from "../lib/hero-photo";
import { openObservationLightbox, licenseLabel } from "./lightbox";
import { loadPhoto, budget } from "../lib/photo";
import { t } from "../lib/i18n";
import { commonName } from "../lib/names";
import type { Wildlife } from "../types";

/**
 * The slot for one animal. `px` is the drawn width, so the loader can ask
 * iNaturalist for the smallest rendition that covers it; `regionId` picks the
 * region-specific photograph when there is one, exactly as a plant's does.
 *
 * `attrs` is merged onto the box so callers keep the layout hints they rely on.
 */
export function wildlifeThumb(
  wildlifeId: string,
  icon: string,
  opts: { px?: number; regionId?: string; attrs?: Record<string, string>; urgent?: boolean } = {},
): HTMLElement {
  const px = opts.px ?? 72;
  const box = el("span", {
    class: "wildlife-photo",
    "aria-hidden": "true",
    ...opts.attrs,
  }, [el("span", { class: "wildlife-photo-icon" }, icon)]);

  // On a metered or 2G connection the emoji is the whole answer: a list of
  // decorative thumbnails is not what someone rationing their data came for.
  const pick = budget() === "essential" ? undefined : wildlifePhotoFor(wildlifeId, opts.regionId);
  if (!pick) return box;

  // Only now does the slot become a square tile. An animal nobody has reviewed
  // keeps the bare emoji it always had, at the size it always was — so adding
  // this changed no page until the first photograph was chosen, and a list of
  // twelve animals doesn't hold twelve empty boxes open waiting for them.
  box.classList.add("has-photo");
  // The photograph's own average colour underneath it, so it fades up out of
  // its own greens and browns rather than out of the app's placeholder tint.
  if (pick.color) box.style.background = pick.color;
  const img = el("img", { class: "photo-fade", alt: "", width: 144, height: 144 });
  box.append(img);
  loadPhoto(img, pick.mediumUrl, px, opts.urgent ?? false);
  return box;
}

/** The animal hero's widest drawn size, matching `.plant-hero` in the
 *  stylesheet (`min(33vw, 9.5rem)`). */
const HERO_PX = 152;

/**
 * The chosen photograph at the head of an animal's page — or null when nobody
 * has picked one, in which case the emoji stays and the page is unchanged.
 *
 * Credited on the spot, in one line, with the licence and the original record a
 * tap away in the lightbox: `asObservation` reshapes the pick into the same
 * summary every other iNaturalist photo in the app is shown through, so an
 * animal's hero is credited in exactly the same words as a plant's and as a
 * sighting someone found near them.
 */
export function wildlifeHero(w: Wildlife, regionId?: string): HTMLElement | null {
  const pick = wildlifePhotoFor(w.id, regionId);
  if (!pick) return null;
  const name = commonName(w);
  const observation = asObservation(pick, w.latin ?? name);

  const btn = el("button", {
    type: "button",
    class: "plant-hero-shot",
    ...(pick.color ? { style: `background:${pick.color}` } : {}),
    "aria-label": t("hero.enlarge", { name }),
    onClick: () => openObservationLightbox([observation], { observation: 0, photo: 0 }, name, btn),
  }, [
    el("img", {
      class: "photo-fade",
      alt: t("obs.photoAlt", { name: w.latin ?? name, observer: pick.observer ?? "an iNaturalist observer" }),
      width: 180,
      height: 180,
    }),
  ]) as HTMLButtonElement;
  // The subject of the page, at the top of it: straight to the front of the
  // queue rather than waiting to be scrolled near.
  loadPhoto(btn.querySelector("img")!, pick.mediumUrl, HERO_PX, true);

  return el("figure", { class: "plant-hero" }, [
    btn,
    el("figcaption", {
      class: "plant-hero-credit",
      title: pick.attribution ?? `© ${pick.observer} · ${licenseLabel(pick.license)} · iNaturalist`,
    }, [
      el("a", {
        href: `https://www.inaturalist.org/observations/${pick.observationId}`,
        target: "_blank",
        rel: "noopener",
      }, `© ${pick.observer ?? "iNaturalist"}`),
    ]),
  ]);
}
