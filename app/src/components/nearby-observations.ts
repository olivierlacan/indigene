// "See it growing near you" — a section on a plant's page that shows real,
// research-grade iNaturalist photos of that species observed close to the user,
// so the to-scale drawing is backed by "here's an actual mature one three miles
// from here, go look at it."
//
// The whole exchange is explicit and credited:
//   - Nothing loads until the person asks (a tap that shares their location).
//   - A standing note says their *browser* is the one calling iNaturalist —
//     we don't proxy it — so it's clear whose request this is.
//   - iNaturalist is credited on the section, and every photo carries its own
//     observer + licence credit straight from the API.
import { el, clear } from "../ui";
import { entryForPlant } from "../lib/registry";
import { nearbyObservations, observationsForTaxon } from "../lib/nearby";
import type { NearbyResult } from "../lib/nearby";
import type { ObservationSummary } from "../lib/inaturalist";
import type { Plant } from "../types";

const INAT = "https://www.inaturalist.org";

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "~3 km away · seen Jun 2023" — the honest context line under a photo set. */
function whereWhen(o: ObservationSummary): string {
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
 * Build the section. It's self-contained: give it the plant and it wires up its
 * own "find near me" button, geolocation, fetch/cache call, and rendering.
 * Returns an element you can append to the plant page.
 */
export function nearbyObservationsSection(plant: Plant): HTMLElement {
  const inatId = entryForPlant(plant.id)?.identifiers.inat;

  const out = el("div", { "aria-live": "polite" });
  const findBtn = el("button", {
    class: "btn btn-primary btn-block",
    onClick: run,
  }, `📷 See ${plant.common.toLowerCase()} growing near me`) as HTMLButtonElement;

  async function run(): Promise<void> {
    if (!("geolocation" in navigator)) {
      showNote("This device can't share a location, so we can't look for nearby sightings.");
      return;
    }
    findBtn.disabled = true;
    findBtn.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => void load(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        findBtn.disabled = false;
        findBtn.textContent = `📷 See ${plant.common.toLowerCase()} growing near me`;
        showNote(
          err.code === err.PERMISSION_DENIED
            ? "Location denied — we only use it to find sightings near you, and only when you tap this."
            : "Couldn't get your location. Try again in a moment.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  }

  async function load(lat: number, lon: number): Promise<void> {
    findBtn.textContent = "Asking iNaturalist…";
    clear(out);
    try {
      const result = await nearbyObservations({ lat, lon });
      const mine = observationsForTaxon(result, inatId);
      render(result, mine);
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      findBtn.disabled = false;
      findBtn.textContent = "📷 Refresh nearby sightings";
    }
  }

  function render(result: NearbyResult, mine: ObservationSummary[]): void {
    clear(out);
    if (!mine.length) {
      // We got a nearby list but this species wasn't among the closest sightings.
      const note = inatId
        ? `No research-grade ${plant.common.toLowerCase()} sightings turned up among the ${result.observations.length} closest plant observations here. It may still grow nearby — it just hasn't been photographed and verified close by on iNaturalist.`
        : `We don't have an iNaturalist taxon id for ${plant.common} yet, so we can't match it to nearby sightings.`;
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, note));
      out.append(freshnessLine(result));
      return;
    }

    // Lead with the nearest observation's photos, then a couple more nearby
    // sightings — enough to show the plant, not a gallery to scroll forever.
    const shown = mine.slice(0, 4);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" }, [
        el("strong", {}, `Found ${mine.length} nearby `),
        `research-grade sighting${mine.length === 1 ? "" : "s"} — real ${plant.common.toLowerCase()} someone verified and photographed close to you:`,
      ]),
    );
    out.append(el("div", { class: "obs-list" }, shown.map(observationCard)));
    out.append(freshnessLine(result));
  }

  function observationCard(o: ObservationSummary): HTMLElement {
    const photos = o.photos.slice(0, 4);
    const thumbs = el("div", { class: "obs-thumbs" },
      photos.map((ph) =>
        el("a", {
          href: `${INAT}/photos/${ph.id}`,
          target: "_blank",
          rel: "noopener",
          class: "obs-thumb",
          title: ph.attribution,
        }, [
          el("img", {
            src: ph.thumbUrl,
            loading: "lazy",
            alt: `${o.taxonName ?? plant.common} photographed by ${o.observer}`,
            width: 76,
            height: 76,
          }),
        ]),
      ),
    );
    // The observation's own credit line: observer + where/when + a link to the
    // record. Photo-level licences are shown on hover (the title above) and on
    // the section-wide credit; here we keep the card scannable.
    const credit = el("p", { class: "obs-credit" }, [
      el("a", { href: `${INAT}/observations/${o.id}`, target: "_blank", rel: "noopener" },
        `© ${o.observer}`),
      whereWhen(o) ? ` · ${whereWhen(o)}` : "",
    ]);
    return el("figure", { class: "obs-card" }, [thumbs, credit]);
  }

  function freshnessLine(result: NearbyResult): HTMLElement {
    return el("p", { class: "obs-attribution" }, [
      "Sightings & photos from ",
      el("a", { href: INAT, target: "_blank", rel: "noopener" }, "iNaturalist"),
      ", each © its observer under the licence shown. ",
      result.fromCache
        ? "Loaded from this device's cache — "
        : "Fetched just now by your browser — ",
      "your browser calls iNaturalist directly, so they see your request, not ours.",
    ]);
  }

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, "See it growing near you"),
    el("p", { style: "margin:0.3rem 0 0.6rem" }, [
      `The drawing above is to scale, but nothing beats seeing a mature ${plant.common.toLowerCase()} in the ground. Share your location and we'll pull real, community-verified photos of ones growing near you — pulled live from iNaturalist by your own browser, credited to the people who took them.`,
    ]),
    findBtn,
    out,
  ]);
}
