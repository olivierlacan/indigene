// "See it growing near you" — a section on a plant's page that shows real,
// research-grade iNaturalist photos of that species observed close to the user,
// so the to-scale drawing is backed by "here's an actual mature one three miles
// from here, go look at it."
//
// The whole exchange is explicit and credited:
//   - Nothing loads until the person asks and gives a spot — by sharing their
//     location or typing a ZIP code / town (see `location-prompt.ts`); the two
//     are equally weighted, so declining precise location isn't a dead end.
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
import { observationList, freshnessLine } from "./observation-ui";
import { locationPrompt } from "./location-prompt";
import type { Plant } from "../types";

/** "Where are we looking?" — near a chosen spot, or inside a named region's box. */
type Mode = "near" | "region";

/**
 * Build the section. It's self-contained: give it the plant and it wires up its
 * own location prompt, fetch/cache call, and rendering. Returns an element you
 * can append to the plant page.
 */
export function nearbyObservationsSection(plant: Plant): HTMLElement {
  const entry = entryForPlant(plant.id);
  const inatId = entry?.identifiers.inat;
  // The regions our own data says this plant is native to.
  const nativeRegionIds = entry?.regions ?? [];

  const out = el("div", { "aria-live": "polite" });

  const prompt = locationPrompt({
    idBase: `plant-${plant.id}`,
    gpsLabel: "Use my location",
    onResolve: (lat, lon, label) => void load(lat, lon, label),
  });

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }
  function showBusy(): void {
    clear(out);
    out.append(el("p", { class: "note", style: "margin-top:0.6rem" }, "Asking iNaturalist…"));
  }

  async function load(lat: number, lon: number, label?: string): Promise<void> {
    // Only showcase where our own data vouches for the plant. Resolve the spot
    // to an Indigene region (the same coordinate box the app uses, refined by
    // EPA ecoregion when a site reading is available). Two honest gates:
    //   1. Outside every region we cover → we have no native list, so we don't
    //      present anything as a "local native".
    //   2. Inside a region, but our data doesn't list this plant as native there
    //      → we won't showcase it near there, even if iNaturalist has a (likely
    //      planted or escaped) sighting. That would contradict the whole point.
    const region = regionForSite(lat, lon);
    if (!region) {
      showNote(`${label ? `${label} is` : "You're"} outside the regions Indigene has native-plant data for, so we can't vouch for what's truly native there — and we won't dress up nearby sightings as local natives. The sun, soil and climate readings still work everywhere.`);
      return;
    }
    if (!inatId) {
      showNote(`We don't have an iNaturalist taxon id for ${plant.common} yet, so we can't match it to verified sightings.`);
      return;
    }
    if (!nativeRegionIds.includes(region.meta.id)) {
      showNote(nativeElsewhereNote(region));
      return;
    }

    showBusy();
    try {
      // Scope the query to this region's natives, so iNaturalist only returns —
      // and we only cache — plants that belong here.
      const taxonIds = inatIdsForRegions([region.meta.id]);
      const result = await nearbyObservations({ lat, lon, taxonIds });
      const mine = observationsForTaxon(result, inatId);
      renderResults(result, mine, region, "near", label);
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    }
  }

  // "Look it up in a region it's native to" — no spot needed. Query iNaturalist
  // inside that region's coverage box, scoped to its native taxa.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    if (!inatId) {
      showNote(`We don't have an iNaturalist taxon id for ${plant.common} yet, so we can't match it to verified sightings.`);
      return;
    }
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = "Asking iNaturalist…";
    showBusy();
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

  function renderResults(result: NearbyResult, mine: ObservationSummary[], region: RegionDef, mode: Mode, label?: string): void {
    clear(out);
    const where = label ? `near ${label}` : "close to you";
    if (!mine.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? `${plant.common} is native to ${region.meta.name}, but no one has photographed and verified one ${where} on iNaturalist yet. It's still worth planting — the local showcase just isn't there to point you to.`
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
             `research-grade sighting${mine.length === 1 ? "" : "s"} — real ${plant.common.toLowerCase()}, native to ${region.meta.name}, that someone verified and photographed ${where}:`]
          : [el("strong", {}, `Found ${mine.length} `),
             `research-grade sighting${mine.length === 1 ? "" : "s"} of ${plant.common.toLowerCase()} in ${region.meta.name} — verified and photographed by the iNaturalist community (you don't have to be there):`],
      ),
    );
    out.append(observationList(shown, plant.common));
    out.append(freshnessLine(result.fromCache));
  }

  // The plant's native regions, as tappable "look it up there" buttons. Empty
  // when the plant has no iNaturalist id (nothing to match) — the spot path
  // reports that case on lookup.
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
    return `Our data lists ${plant.common} as ${belongs}, not ${region.meta.name}. It may turn up on iNaturalist there as a planted or escaped specimen, but we won't showcase it as a local native where it doesn't belong — that's the opposite of what Indigene is for.`;
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, "See it growing near you"),
    el("p", { style: "margin:0.3rem 0 0.6rem" }, [
      `The drawing above is to scale, but nothing beats seeing a mature ${plant.common.toLowerCase()} in the ground. Share your location or enter a ZIP code and we'll pull real, community-verified photos of ones growing near there — or look it up in a region it's native to, even if you're not there. Either way the photos come live from iNaturalist, called by your own browser and credited to the people who took them.`,
    ]),
    prompt,
    regionButtons(),
    out,
  ]);
}

/** A region's coverage box → the iNaturalist bounding-box shape. */
function toBounds(region: RegionDef): Bounds {
  const b = region.meta.bounds;
  return { swLat: b.minLat, swLon: b.minLon, neLat: b.maxLat, neLon: b.maxLon };
}
