// Shared rendering for iNaturalist sightings — used by both the plant page's
// "See it growing near you" and the wildlife page's "See it near you".
//
// **The results are a gallery, not a stack of cards.** Every licence-bearing
// photo the section found becomes one square tile in a single grid, in the order
// the sightings came back (nearest first when we measured from a spot). The old
// shape gave each sighting its own bordered card with a credit line under it,
// which meant a sighting with one photo — the common case — spent a whole row on
// one thumbnail and a line of small grey text. Four of those filled the screen
// with chrome and showed four pictures.
//
// The credit didn't go anywhere; it moved to where someone is actually looking
// at the photo. Tapping a tile opens the lightbox, which names the observer,
// states the licence, says where and when it was seen, and links to the original
// sighting — for that photo, rebuilt as you page. The section-wide credit line
// below the grid names iNaturalist and says every photo is its observer's, so
// nothing is ever shown unattributed even before a tap.
//
// The tiles themselves carry no text. A hover caption was tried and removed: a
// 90 px square has no room for "under 1 km away · seen June 2023", so it
// clipped mid-word and spilled past the tile, and it was invisible on the
// phones this app is built for. Metadata belongs in the lightbox, at a size
// where it can be read.
import { el } from "../ui";
import { fmtNumber, t } from "../lib/i18n";
import { openObservationLightbox } from "./lightbox";
import type { ObservationPhoto, ObservationSummary } from "../lib/inaturalist";

const INAT = "https://www.inaturalist.org";

/** Tiles shown before the grid stops and the last one wears a "+N" badge. Twelve
 *  is four rows on a phone (three to a row) — a gallery you take in at a glance,
 *  not one you scroll. Everything past it is still reachable: the lightbox pages
 *  through every photo of every sighting the section found. */
const MAX_TILES = 12;

/** One photo of one sighting, flattened out of the nested shape so the grid can
 *  lay photos out without caring which sighting they came from — while keeping
 *  the coordinates the lightbox needs to open on exactly this one. */
interface Tile {
  photo: ObservationPhoto;
  observation: ObservationSummary;
  obsIndex: number;
  photoIndex: number;
}

function flatten(observations: ObservationSummary[]): Tile[] {
  const tiles: Tile[] = [];
  observations.forEach((observation, obsIndex) => {
    observation.photos.forEach((photo, photoIndex) => {
      tiles.push({ photo, observation, obsIndex, photoIndex });
    });
  });
  return tiles;
}

/**
 * Every photo the section found, as one gallery of square thumbnails. `label` is
 * the plain name to fall back to when a sighting carries no scientific name of
 * its own (the plant's or animal's common name), and is what the lightbox is
 * titled with. Tapping a tile opens the in-app lightbox rather than redirecting
 * away — on that photo, and able to page on through the whole set.
 */
export function observationList(observations: ObservationSummary[], label: string): HTMLElement {
  const tiles = flatten(observations);
  const shown = tiles.slice(0, MAX_TILES);
  const hidden = tiles.length - shown.length;

  return el("div", { class: "obs-gallery" },
    shown.map((tile, i) => {
      const { photo, observation: o } = tile;
      // The badge rides the last tile, where the grid runs out of room.
      const more = hidden > 0 && i === shown.length - 1 ? hidden : 0;
      const btn = el("button", {
        type: "button",
        class: "obs-tile",
        // The native tooltip carries the full credit for a mouse user who
        // hovers without clicking. It's the browser's own, so it's legible and
        // positioned to fit — which a caption painted inside a 90 px tile
        // wasn't.
        title: t("obs.tapToEnlarge", { attribution: photo.attribution }),
        "aria-label":
          t("obs.enlarge", {
            i: fmtNumber(i + 1),
            name: o.taxonName ?? label,
            observer: o.observer,
          }) + (more ? t("obs.enlargeMore", { n: fmtNumber(more) }) : ""),
        onClick: () =>
          openObservationLightbox(
            observations,
            { observation: tile.obsIndex, photo: tile.photoIndex },
            label,
            btn,
          ),
      }, [
        el("img", {
          src: photo.thumbUrl,
          loading: "lazy",
          alt: t("obs.photoAlt", { name: o.taxonName ?? label, observer: o.observer }),
          width: 112,
          height: 112,
        }),
        more ? el("span", { class: "obs-tile-more", "aria-hidden": "true" }, `+${more}`) : null,
      ]);
      return btn;
    }),
  );
}

/** The section-wide credit + freshness note: iNaturalist named and linked, the
 *  per-observer licence acknowledged with a pointer to where it's spelled out
 *  (the lightbox), and the "your browser called them, not us" transparency line.
 *  `fromCache` flips only the "fetched now vs. from cache" clause. */
export function freshnessLine(fromCache: boolean): HTMLElement {
  return el("p", { class: "obs-attribution" }, [
    t("obs.creditLead"),
    el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
    t("obs.creditMid"),
    t(fromCache ? "obs.fromCache" : "obs.fetchedNow"),
    t("obs.creditEnd"),
  ]);
}
