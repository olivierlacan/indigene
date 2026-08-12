// The chosen photograph at the head of a page, with its credit under it.
//
// Three pages open with one — a plant's, an animal's, and an impostor's — and
// they are the same object in every respect: a square button that opens the
// lightbox, the photograph's own colour underneath while it loads, and the
// photographer's name on one line beneath, linked to where the picture came
// from. This file is that object, once, because three copies of "how we show
// and credit a hero photo" is three places for the credit to drift.
//
// The credit is deliberately thin here: a name and a link. The licence, the
// place, the date and the full attribution string are one tap away in the
// lightbox, which is also the only implementation of *those* — see
// `asObservation` in `lib/hero-photo.ts`.
import { el } from "../ui";
import { asObservation, heroSourceUrl, type HeroPhoto } from "../lib/hero-photo";
import { loadPhoto } from "../lib/photo";
import { openObservationLightbox, licenseLabel } from "./lightbox";
import { t } from "../lib/i18n";

/** The hero's widest drawn size, matching `.plant-hero` in the stylesheet
 *  (`min(33vw, 9.5rem)`). The loader turns it, plus the screen's pixel density,
 *  into which of iNaturalist's five renditions to ask for. */
const HERO_PX = 152;

/**
 * `name` is what the reader calls it (the lightbox title, the enlarge label);
 * `latin` is the scientific name, used for the alt text and as the fallback
 * when the photograph carries no name of its own.
 */
export function heroFigure(pick: HeroPhoto, name: string, latin: string): HTMLElement {
  const observation = asObservation(pick, latin);
  const btn = el("button", {
    type: "button",
    class: "plant-hero-shot",
    // The photograph's own average colour, so the slot is never a green
    // rectangle waiting to be filled — the picture fades up out of its own
    // mossy green, or winter grey, or goldenrod yellow. Picks harvested
    // before `hero:colors` existed have none, and keep the stylesheet's.
    ...(pick.color ? { style: `background:${pick.color}` } : {}),
    "aria-label": t("hero.enlarge", { name }),
    onClick: () => openObservationLightbox([observation], { observation: 0, photo: 0 }, name, btn),
  }, [
    el("img", {
      // No `src`: `loadPhoto` sets it, having chosen the rendition that
      // actually covers this slot on this screen. A 3× phone still gets the
      // 500 px file; a laptop gets the 240 px one, which is a third of the
      // bytes for a picture nobody could tell apart. The large rendition is
      // for the lightbox, and `original` is for nowhere.
      class: "photo-fade",
      alt: t("obs.photoAlt", { name: latin, observer: pick.observer ?? "an iNaturalist observer" }),
      // Square, and said up front, so the head row doesn't reflow when it lands.
      width: 180,
      height: 180,
    }),
  ]) as HTMLButtonElement;
  // Urgent: this is the picture the page is about, at the top of it, so it
  // skips the wait-until-nearly-visible step every other photo goes through
  // and goes to the front of the queue.
  loadPhoto(btn.querySelector("img")!, pick.mediumUrl, HERO_PX, true);

  return el("figure", { class: "plant-hero" }, [
    btn,
    // One line, the observer's name, ellipsised if it's long — with the full
    // credit on the element itself for a pointer, and stated in full in the
    // lightbox for everyone.
    el("figcaption", {
      class: "plant-hero-credit",
      title: pick.attribution ?? `© ${pick.observer} · ${licenseLabel(pick.license)} · iNaturalist`,
    }, [
      el("a", { href: heroSourceUrl(pick), target: "_blank", rel: "noopener" },
        `© ${pick.observer ?? "iNaturalist"}`),
    ]),
  ]);
}
