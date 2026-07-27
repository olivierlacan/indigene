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
import { entryForPlant, inatIdsForRegions } from "../lib/registry";
import { regionForSite, REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { nearbyObservations, observationsForTaxon } from "../lib/nearby";
import type { NearbyResult } from "../lib/nearby";
import type { ObservationSummary } from "../lib/inaturalist";
import { openObservationLightbox } from "./lightbox";
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
  const entry = entryForPlant(plant.id);
  const inatId = entry?.identifiers.inat;
  // The regions our own data says this plant is native to.
  const nativeRegionIds = entry?.regions ?? [];

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
    clear(out);
    // Only showcase where our own data vouches for the plant. Resolve the spot
    // to an Indigene region (the same coordinate box the app uses, refined by
    // EPA ecoregion when a site reading is available). Two honest gates:
    //   1. Outside every region we cover → we have no native list, so we don't
    //      present anything as a "local native".
    //   2. Inside a region, but our data doesn't list this plant as native there
    //      → we won't showcase it near you, even if iNaturalist has a (likely
    //      planted or escaped) sighting. That would contradict the whole point.
    const region = regionForSite(lat, lon);
    if (!region) {
      resetButton();
      showNote("You're outside the regions Indigene has native-plant data for, so we can't vouch for what's truly native at your spot — and we won't dress up nearby sightings as local natives. The sun, soil and climate readings still work everywhere.");
      return;
    }
    if (!inatId) {
      resetButton();
      showNote(`We don't have an iNaturalist taxon id for ${plant.common} yet, so we can't match it to verified sightings.`);
      return;
    }
    if (!nativeRegionIds.includes(region.meta.id)) {
      resetButton();
      showNote(nativeElsewhereNote(region));
      return;
    }

    findBtn.textContent = "Asking iNaturalist…";
    try {
      // Scope the query to this region's natives, so iNaturalist only returns —
      // and we only cache — plants that belong here.
      const taxonIds = inatIdsForRegions([region.meta.id]);
      const result = await nearbyObservations({ lat, lon, taxonIds });
      const mine = observationsForTaxon(result, inatId);
      render(result, mine, region);
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      findBtn.disabled = false;
      findBtn.textContent = "📷 Refresh nearby sightings";
    }
  }

  function render(result: NearbyResult, mine: ObservationSummary[], region: RegionDef): void {
    clear(out);
    if (!mine.length) {
      // Native here by our data — just not photographed-and-verified close by yet.
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        `${plant.common} is native to ${region.meta.name}, but no one has photographed and verified one close to you on iNaturalist yet. It's still worth planting — the local showcase just isn't there to point you to.`));
      out.append(freshnessLine(result));
      return;
    }

    // Lead with the nearest observation's photos, then a couple more nearby
    // sightings — enough to show the plant, not a gallery to scroll forever.
    const shown = mine.slice(0, 4);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" }, [
        el("strong", {}, `Found ${mine.length} nearby `),
        `research-grade sighting${mine.length === 1 ? "" : "s"} — real ${plant.common.toLowerCase()}, native to ${region.meta.name}, that someone verified and photographed close to you:`,
      ]),
    );
    out.append(el("div", { class: "obs-list" }, shown.map(observationCard)));
    out.append(freshnessLine(result));
  }

  // "Our data lists this as native to Florida, not the Pacific Northwest…"
  function nativeElsewhereNote(region: RegionDef): string {
    const names = nativeRegionIds
      .map((id) => REGIONS.find((r) => r.meta.id === id)?.meta.name)
      .filter(Boolean)
      .join(" and ");
    const belongs = names ? `native to ${names}` : "native to another region";
    return `Our data lists ${plant.common} as ${belongs}, not ${region.meta.name}. It may turn up on iNaturalist near you as a planted or escaped specimen, but we won't showcase it as a local native where it doesn't belong — that's the opposite of what Indigene is for.`;
  }

  function resetButton(): void {
    findBtn.disabled = false;
    findBtn.textContent = `📷 See ${plant.common.toLowerCase()} growing near me`;
  }

  function observationCard(o: ObservationSummary): HTMLElement {
    const photos = o.photos.slice(0, 4);
    const thumbs = el("div", { class: "obs-thumbs" },
      photos.map((ph, i) => {
        // A button, not a link: tapping opens the photo in the in-app lightbox
        // (which itself links back to the sighting) rather than redirecting.
        const btn = el("button", {
          type: "button",
          class: "obs-thumb",
          title: `${ph.attribution} — tap to enlarge`,
          "aria-label": `Enlarge photo ${i + 1} of ${o.taxonName ?? plant.common} by ${o.observer}`,
          onClick: () => openObservationLightbox(o, i, plant.common, btn),
        }, [
          el("img", {
            src: ph.thumbUrl,
            loading: "lazy",
            alt: `${o.taxonName ?? plant.common} photographed by ${o.observer}`,
            width: 76,
            height: 76,
          }),
        ]);
        return btn;
      }),
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
