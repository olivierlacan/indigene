// Shared rendering for an iNaturalist sighting — used by both the plant page's
// "See it growing near you" and the wildlife page's "See it near you". A sighting
// looks the same whether it's of a plant or an animal: a strip of small square
// photos over a one-line credit that links back to the observer's record, with
// the section-wide iNaturalist credit below. Keeping it here means the two layers
// can't drift apart, and the credit/licence handling stays in one place.
import { el } from "../ui";
import { openObservationLightbox } from "./lightbox";
import type { ObservationSummary } from "../lib/inaturalist";

const INAT = "https://www.inaturalist.org";
const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "~3 km away · seen Jun 2023" — the honest context line under a photo set.
 *  Distance when we measured it (a "near me" lookup), otherwise the coarse place
 *  iNaturalist reports; then the month/year it was observed, when known. */
export function whereWhen(o: ObservationSummary): string {
  const bits: string[] = [];
  if (o.distanceKm != null) {
    bits.push(o.distanceKm < 1 ? "under 1 km away" : `~${Math.round(o.distanceKm)} km away`);
  } else if (o.place) {
    bits.push(o.place);
  }
  if (o.observedOn) {
    const [y, m] = o.observedOn.split("-");
    const mm = Number(m);
    bits.push(`seen ${mm >= 1 && mm <= 12 ? monthNames[mm] + " " : ""}${y}`);
  }
  return bits.join(" · ");
}

/**
 * One sighting as a card: its licence-bearing photos as tappable thumbnails over
 * an observer credit that links to the original record. `label` is the plain
 * name to fall back to when the sighting has no scientific name of its own (the
 * plant's or animal's common name), and is what the lightbox is titled with.
 * Tapping a thumbnail opens the in-app lightbox rather than redirecting away.
 */
export function observationCard(o: ObservationSummary, label: string): HTMLElement {
  const photos = o.photos.slice(0, 4);
  const thumbs = el("div", { class: "obs-thumbs" },
    photos.map((ph, i) => {
      const btn = el("button", {
        type: "button",
        class: "obs-thumb",
        title: `${ph.attribution} — tap to enlarge`,
        "aria-label": `Enlarge photo ${i + 1} of ${o.taxonName ?? label} by ${o.observer}`,
        onClick: () => openObservationLightbox(o, i, label, btn),
      }, [
        el("img", {
          src: ph.thumbUrl,
          loading: "lazy",
          alt: `${o.taxonName ?? label} photographed by ${o.observer}`,
          width: 76,
          height: 76,
        }),
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

/** The section-wide credit + freshness note: iNaturalist named and linked, the
 *  per-observer licence acknowledged, and the "your browser called them, not us"
 *  transparency line. `fromCache` flips only the "fetched now vs. from cache" clause. */
export function freshnessLine(fromCache: boolean): HTMLElement {
  return el("p", { class: "obs-attribution" }, [
    "Sightings & photos from ",
    el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
    ", each © its observer under the licence shown. ",
    fromCache
      ? "Loaded from this device's cache — "
      : "Fetched just now by your browser — ",
    "your browser calls iNaturalist directly, so they see your request, not ours.",
  ]);
}
