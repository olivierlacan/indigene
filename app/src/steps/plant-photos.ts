// A plant's photographs, at #/plants/<slug>/photos (canonically
// …/plants/<slug>/photos).
//
// The profile page has room for exactly one photograph, and one photograph
// answers one question: "roughly, what is this?" Standing in front of a shrub
// with a leaf in your hand, the questions are different and there are three of
// them — is this the right leaf, the right flower, the right fruit? A single
// hero can't answer those, and a wall of a hundred iNaturalist thumbnails
// answers them badly: most of any species' photo pool is close-ups of leaves,
// so hunting for one clear picture of the whole plant means scrolling past
// forty of them.
//
// So this page is two halves, in this order:
//
//   1. **The chosen photographs**, one per angle — the whole plant, its leaves,
//      its flowers, its fruit — picked by a person from a shortlist (see
//      docs/hero-photos.md). Few, labelled, and stable: the same picture every
//      time, so it can be compared against.
//   2. **"See it growing near you"**, the same live iNaturalist lookup the
//      profile carries. Many, current, and local: not "what does the species
//      look like" but "what does one look like three miles from here, in this
//      month". The two halves are complementary, which is why the page has both
//      rather than choosing.
//
// Every photograph on it is credited where it is shown, and tapping any of them
// opens the app's one lightbox, with the observer, the licence and a link to the
// original record — there is no second way of crediting a photo in this codebase.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { findPlant } from "../lib/explore";
import { activeEntry } from "../lib/plant-view";
import { heroPhotoFor, asObservation } from "../lib/hero-photo";
import type { HeroPhoto } from "../lib/hero-photo";
import { loadAnglePicks, anglesFor, PHOTO_ANGLES } from "../lib/plant-photos";
import type { PhotoAngle } from "../lib/plant-photos";
import { loadPhoto } from "../lib/photo";
import { openObservationLightbox, licenseLabel } from "../components/lightbox";
import { nearbyObservationsSection } from "../components/nearby-observations";
import { PHOTOS_SEGMENT } from "../lib/routes";
import { t, fmtList, fmtNumber } from "../lib/i18n";
import { commonName } from "../lib/names";
import type { Plant } from "../types";

/** The segment that means "this plant's photographs" rather than a section of
 *  its profile. It lives in `lib/routes.ts` — the prerenderer and the route
 *  check read it from there, and neither can import this file. */
export const PHOTOS_ROUTE = PHOTOS_SEGMENT;

/** The address of a plant's photo page, keeping the region the reader is
 *  reading in — the close-ups follow the figures, the same way the hero does. */
export function photosHref(plantId: string, regionId?: string): string {
  const base = `#/plants/${encodeURIComponent(plantId)}/${PHOTOS_ROUTE}`;
  return regionId ? `${base}?region=${encodeURIComponent(regionId)}` : base;
}

/** The tile order, and the emoji each angle wears. `portrait` is not an angle —
 *  it is the profile's own hero, which was chosen before the angles existed and
 *  is a real photograph of the plant either way. It leads, because it is the
 *  picture the reader has just come from. */
const ANGLE_ICONS: Record<PhotoAngle | "portrait", string> = {
  portrait: "🖼️",
  habit: "🌳",
  leaf: "🍃",
  flower: "🌸",
  fruit: "🫐",
};

/** One tile's drawn width — the gallery is two columns on a phone (see
 *  `.photo-angles`), so about half the content column. The loader turns it,
 *  plus the screen's pixel density, into which iNaturalist rendition to ask
 *  for: `medium` on a 3× phone, `small` on a laptop. */
const TILE_PX = 158;

/** A photograph on this page, with the angle it was chosen for. */
interface Shot {
  angle: PhotoAngle | "portrait";
  pick: HeroPhoto;
}

export async function renderPlantPhotos(main: HTMLElement, slug: string): Promise<void> {
  clear(main);
  const entries = await findPlant(slug);
  if (!entries.length) {
    renderNotFound(main, slug);
    return;
  }
  const { plant, region } = activeEntry(entries);
  const name = commonName(plant);
  document.title = t("photos.docTitle", { name });

  // The way back to the plant, at the top where an escape hatch belongs. This
  // page is always a detour from a profile — nothing else links to it.
  const back = el("p", { class: "back-trail" }, [
    el("a", { href: `#/plants/${encodeURIComponent(plant.id)}?region=${encodeURIComponent(region.meta.id)}` },
      t("photos.backToPlant")),
  ]);

  const gallery = el("div", { class: "photo-angles" });
  // What has been chosen so far, in tile order — the lightbox's reel, rebuilt
  // as tiles arrive so paging through it matches what's on screen.
  const shots: Shot[] = [];
  const missingNote = el("p", { class: "obs-attribution photos-missing" });

  const portrait = heroPhotoFor(plant.id, region.meta.id);
  if (portrait) addShot(gallery, shots, { angle: "portrait", pick: portrait }, plant);

  main.append(
    back,
    el("h2", { class: "step-title" }, t("photos.title", { name })),
    el("p", { class: "step-lede" }, t("photos.lede")),
    el("section", { class: "card" }, [
      el("h3", { style: "margin-top:0" }, t("photos.chosenTitle")),
      el("p", { class: "obs-section-lede" }, t("photos.chosenLede")),
      gallery,
      missingNote,
    ]),
    // The live half. Identical to the profile's, wired to the same taxon — a
    // reader who came here from the profile without using it there gets a
    // second, better-placed chance at it.
    nearbyObservationsSection(plant),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("a", { class: "btn btn-primary", href: `#/plants/${encodeURIComponent(plant.id)}` }, t("photos.backToPlantShort")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("plant.more")),
    ]),
  );

  // The angle picks are a chunk of their own, fetched only by this page (see
  // `lib/plant-photos.ts`). It lands in a frame or two off the service worker's
  // cache, so the tiles simply appear after the portrait rather than the page
  // waiting on them.
  void loadAnglePicks().then((table) => {
    const set = anglesFor(table, plant.id, region.meta.id);
    for (const angle of PHOTO_ANGLES) {
      const pick = set[angle];
      // The hero is very often also the best whole-plant shot, and showing one
      // photograph twice under two labels looks like a bug rather than a
      // catalogue.
      if (!pick || shots.some((s) => s.pick.photoId === pick.photoId)) continue;
      addShot(gallery, shots, { angle, pick }, plant);
    }
    describeGaps(missingNote, gallery, shots, name);
  });
}

/**
 * Add one photograph to the gallery.
 *
 * The tile is a button, not a link: it opens the app's lightbox on this
 * photograph with every other one on the page in the reel behind it, so a reader
 * can swipe from the flower to the fruit without going back to the grid. The
 * label says which angle it was chosen for and the credit rides underneath it,
 * because a photograph and its credit are never separated in this codebase.
 */
function addShot(gallery: HTMLElement, shots: Shot[], shot: Shot, plant: Plant): void {
  shots.push(shot);
  const { pick, angle } = shot;
  const name = commonName(plant);
  const at = shots.length - 1;

  const btn = el("button", {
    type: "button",
    class: "photo-angle-shot",
    // The photograph's own average colour while it comes down the wire, so the
    // tile fades up out of its own greens rather than out of an empty box.
    ...(pick.color ? { style: `background:${pick.color}` } : {}),
    "aria-label": t("photos.enlarge", { angle: t(`photos.angle.${angle}` as const), name }),
    onClick: () =>
      openObservationLightbox(
        shots.map((s) => asObservation(s.pick, plant.latin)),
        { observation: at, photo: 0 },
        name,
        btn,
      ),
  }, [
    el("img", {
      class: "photo-fade",
      alt: t("photos.shotAlt", { angle: t(`photos.angle.${angle}` as const), name: plant.latin }),
      width: 344,
      height: 344,
    }),
  ]) as HTMLButtonElement;
  loadPhoto(btn.querySelector("img")!, pick.mediumUrl, TILE_PX, true);

  gallery.append(
    el("figure", { class: "photo-angle" }, [
      btn,
      el("figcaption", {}, [
        el("span", { class: "photo-angle-label" }, [
          el("span", { "aria-hidden": "true" }, `${ANGLE_ICONS[angle]} `),
          t(`photos.angle.${angle}` as const),
        ]),
        el("span", {
          class: "photo-angle-credit",
          title: pick.attribution ?? `© ${pick.observer} · ${licenseLabel(pick.license)} · iNaturalist`,
        }, [
          el("a", {
            href: `https://www.inaturalist.org/observations/${pick.observationId}`,
            target: "_blank",
            rel: "noopener",
          }, `© ${pick.observer ?? "iNaturalist"}`),
        ]),
      ]),
    ]),
  );
}

/**
 * Say what isn't here yet, by name.
 *
 * Choosing these photographs is a person's job and it happens plant by plant, so
 * for a long time most plants will have some angles and not others. Naming the
 * missing ones is more useful than leaving four silent gaps: it tells a reader
 * that the flower shot is coming rather than that this plant has no flowers, and
 * it points at the live gallery below, which very often does have one today.
 */
function describeGaps(note: HTMLElement, gallery: HTMLElement, shots: Shot[], name: string): void {
  clear(note);
  if (!shots.length) {
    gallery.append(el("p", { class: "note warn", style: "margin:0" }, t("photos.noneYet", { name })));
    return;
  }
  const missing = PHOTO_ANGLES.filter((angle) => !shots.some((s) => s.angle === angle));
  note.textContent = missing.length
    ? t("photos.someMissing", {
        n: fmtNumber(shots.length),
        angles: fmtList(missing.map((a) => t(`photos.angleGap.${a}` as const))),
      })
    : t("photos.allChosen", { n: fmtNumber(shots.length) });
}

function renderNotFound(main: HTMLElement, slug: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("plant.notFoundTitle")),
    el("p", { class: "step-lede" }, t("plant.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, t("plant.notFoundBrowse")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ]),
  );
}
