// Shared rendering for an iNaturalist sighting — used by both the plant page's
// "See it growing near you" and the wildlife page's "See it near you". A sighting
// looks the same whether it's of a plant or an animal: a strip of small square
// photos over a one-line credit that links back to the observer's record, with
// the section-wide iNaturalist credit below. Keeping it here means the two layers
// can't drift apart, and the credit/licence handling stays in one place.
import { el } from "../ui";
import { t } from "../lib/i18n";
import { openObservationLightbox } from "./lightbox";
import { whereWhen } from "../lib/inaturalist";
import type { ObservationSummary } from "../lib/inaturalist";

const INAT = "https://www.inaturalist.org";

/** Thumbnails shown per sighting. Three fills exactly one row on a phone, so a
 *  card never ends in a ragged half-row; anything beyond them is reachable —
 *  the lightbox pages through every photo of every sighting on screen, and the
 *  last thumbnail wears a "+2" badge to say so. */
const THUMBS_PER_CARD = 3;

/**
 * One sighting as a card: its licence-bearing photos as tappable thumbnails over
 * an observer credit that links to the original record. `label` is the plain
 * name to fall back to when the sighting has no scientific name of its own (the
 * plant's or animal's common name), and is what the lightbox is titled with.
 * Tapping a thumbnail opens the in-app lightbox rather than redirecting away,
 * on this photo of this sighting — but able to page on through `group`, every
 * sighting the section is showing.
 */
function observationCard(
  o: ObservationSummary,
  label: string,
  group: ObservationSummary[],
  obsIndex: number,
): HTMLElement {
  const photos = o.photos.slice(0, THUMBS_PER_CARD);
  const hidden = o.photos.length - photos.length;
  const thumbs = el("div", { class: "obs-thumbs" },
    photos.map((ph, i) => {
      // The badge rides the last thumbnail, where the row runs out of room.
      const more = hidden > 0 && i === photos.length - 1 ? hidden : 0;
      const btn = el("button", {
        type: "button",
        class: "obs-thumb",
        title: `${ph.attribution} — tap to enlarge`,
        "aria-label": `Enlarge photo ${i + 1} of ${o.taxonName ?? label} by ${o.observer}`
          + (more ? `, and see ${more} more from this sighting` : ""),
        onClick: () => openObservationLightbox(group, { observation: obsIndex, photo: i }, label, btn),
      }, [
        el("img", {
          src: ph.thumbUrl,
          loading: "lazy",
          alt: `${o.taxonName ?? label} photographed by ${o.observer}`,
          width: 112,
          height: 112,
        }),
        more ? el("span", { class: "obs-thumb-more", "aria-hidden": "true" }, `+${more}`) : null,
      ]);
      return btn;
    }),
  );
  // The observation's own credit line: observer + where/when + a link to the
  // record. Photo-level licences are shown on hover (the title above) and on the
  // section-wide credit; here we keep the card scannable.
  const credit = el("p", { class: "obs-credit" }, [
    el("a", { href: `${INAT}/observations/${o.id}`, target: "_blank", rel: "noopener" },
      `© ${o.observer}`),
    whereWhen(o) ? ` · ${whereWhen(o)}` : "",
  ]);
  return el("figure", { class: "obs-card" }, [thumbs, credit]);
}

/**
 * Every sighting a section found, as a stack of cards — and as *one* photo reel.
 * Building the list here (rather than mapping `observationCard` at each call
 * site) is what lets a thumbnail hand the lightbox the whole set: open on the
 * photo that was tapped, then page on through the other observers' photos
 * instead of stopping at the edge of one card.
 */
export function observationList(observations: ObservationSummary[], label: string): HTMLElement {
  return el("div", { class: "obs-list" },
    observations.map((o, i) => observationCard(o, label, observations, i)));
}

/** The section-wide credit + freshness note: iNaturalist named and linked, the
 *  per-observer licence acknowledged, and the "your browser called them, not us"
 *  transparency line. `fromCache` flips only the "fetched now vs. from cache" clause. */
export function freshnessLine(fromCache: boolean): HTMLElement {
  return el("p", { class: "obs-attribution" }, [
    t("obs.creditLead"),
    el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
    t("obs.creditMid"),
    t(fromCache ? "obs.fromCache" : "obs.fetchedNow"),
    t("obs.creditEnd"),
  ]);
}
