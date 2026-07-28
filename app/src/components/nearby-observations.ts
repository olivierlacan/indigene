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
import { nearbyObservations, regionObservations, observationsForTaxon } from "../lib/nearby";
import type { NearbyResult } from "../lib/nearby";
import type { Bounds, ObservationSummary } from "../lib/inaturalist";
import { observationCard, freshnessLine } from "./observation-ui";
import type { Plant } from "../types";

/** "Where are we looking?" — near the user, or inside a named region's box. */
type Mode = "near" | "region";

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
  }, "📷 See it growing near me") as HTMLButtonElement;

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
        findBtn.textContent = "📷 See it growing near me";
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
      renderResults(result, mine, region, "near");
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      findBtn.disabled = false;
      findBtn.textContent = "📷 Refresh nearby sightings";
    }
  }

  // "Look it up in a region it's native to" — no current location needed. Query
  // iNaturalist inside that region's coverage box, scoped to its native taxa.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    clear(out);
    if (!inatId) {
      showNote(`We don't have an iNaturalist taxon id for ${plant.common} yet, so we can't match it to verified sightings.`);
      return;
    }
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = "Asking iNaturalist…";
    try {
      const taxonIds = inatIdsForRegions([region.meta.id]);
      const result = await regionObservations(region.meta.id, toBounds(region), taxonIds);
      const mine = observationsForTaxon(result, inatId);
      renderResults(result, mine, region, "region");
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function renderResults(result: NearbyResult, mine: ObservationSummary[], region: RegionDef, mode: Mode): void {
    clear(out);
    if (!mine.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? `${plant.common} is native to ${region.meta.name}, but no one has photographed and verified one close to you on iNaturalist yet. It's still worth planting — the local showcase just isn't there to point you to.`
          : `No research-grade ${plant.common.toLowerCase()} sightings with photos have been logged in ${region.meta.name} on iNaturalist yet. It's native there — the community just hasn't captured one.`));
      out.append(freshnessLine(result.fromCache));
      return;
    }

    // Enough to show the plant, not a gallery to scroll forever.
    const shown = mine.slice(0, 4);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" },
        mode === "near"
          ? [el("strong", {}, `Found ${mine.length} nearby `),
             `research-grade sighting${mine.length === 1 ? "" : "s"} — real ${plant.common.toLowerCase()}, native to ${region.meta.name}, that someone verified and photographed close to you:`]
          : [el("strong", {}, `Found ${mine.length} `),
             `research-grade sighting${mine.length === 1 ? "" : "s"} of ${plant.common.toLowerCase()} in ${region.meta.name} — verified and photographed by the iNaturalist community (you don't have to be there):`],
      ),
    );
    out.append(el("div", { class: "obs-list" }, shown.map((o) => observationCard(o, plant.common))));
    out.append(freshnessLine(result.fromCache));
  }

  // The plant's native regions, as tappable "look it up there" buttons. Empty
  // when the plant has no iNaturalist id (nothing to match) — the near-me path
  // reports that case on tap.
  function regionButtons(): HTMLElement | null {
    if (!inatId) return null;
    const regions = nativeRegionIds
      .map((id) => REGIONS.find((r) => r.meta.id === id))
      .filter((r): r is RegionDef => Boolean(r));
    if (!regions.length) return null;
    return el("div", { style: "margin-top:0.8rem" }, [
      el("p", { style: "margin:0 0 0.4rem;font-weight:650" }, "Not there right now? Look it up where it's native:"),
      el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem" },
        regions.map((r) => {
          const btn = el("button", {
            type: "button",
            class: "btn btn-secondary",
            style: "flex:1 1 auto;min-height:2.6rem;padding:0.4rem 0.7rem;font-size:0.9rem",
            onClick: () => void loadRegion(r, btn),
          }, `🗺️ ${r.meta.name}`) as HTMLButtonElement;
          return btn;
        }),
      ),
    ]);
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
    findBtn.textContent = "📷 See it growing near me";
  }

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, "See it growing near you"),
    el("p", { style: "margin:0.3rem 0 0.6rem" }, [
      `The drawing above is to scale, but nothing beats seeing a mature ${plant.common.toLowerCase()} in the ground. Share your location and we'll pull real, community-verified photos of ones growing near you — or look it up in a region it's native to, even if you're not there. Either way the photos come live from iNaturalist, called by your own browser and credited to the people who took them.`,
    ]),
    findBtn,
    regionButtons(),
    out,
  ]);
}

/** A region's coverage box → the iNaturalist bounding-box shape. */
function toBounds(region: RegionDef): Bounds {
  const b = region.meta.bounds;
  return { swLat: b.minLat, swLon: b.minLon, neLat: b.maxLat, neLon: b.maxLon };
}
