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
import { entryForPlant } from "../lib/registry";
import { regionForSite, REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { plantSightingsNear, plantSightingsInRegion } from "../lib/nearby";
import type { SightingResult } from "../lib/nearby";
import { isBusy } from "../lib/inaturalist";
import type { Bounds } from "../lib/inaturalist";
import { observationList, freshnessLine } from "./observation-ui";
import { locationPrompt } from "./location-prompt";
import { anchoredHeading } from "./anchor-head";
import { plantSectionHref } from "../lib/routes";
import { t, tn, fmtNumber } from "../lib/i18n";
import { commonName, regionName, regionShort } from "../lib/names";
import { fmtList } from "../lib/i18n";
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
    gpsLabel: t("nearby.useMyLocation"),
    onResolve: (lat, lon, label) => void load(lat, lon, label),
  });

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }
  function showBusy(): void {
    clear(out);
    out.append(el("p", { class: "note", style: "margin-top:0.6rem" }, t("nearby.asking")));
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
      showNote(label ? t("nearby.outsidePlace", { place: label }) : t("nearby.outsideYou"));
      return;
    }
    if (!inatId) {
      showNote(t("nearby.noTaxonId", { name: commonName(plant) }));
      return;
    }
    if (!nativeRegionIds.includes(region.meta.id)) {
      showNote(nativeElsewhereNote(region));
      return;
    }

    showBusy();
    try {
      // One question, one taxon: "is *this* plant growing near here?" Everything
      // that comes back is this plant or a subspecies of it, which is what makes
      // the native-only promise hold without a filter — and the two gates above
      // already refused to look anywhere our data doesn't vouch for it.
      const result = await plantSightingsNear(inatId, lat, lon);
      renderResults(result, region, "near", label);
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    }
  }

  // "Look it up in a region it's native to" — no spot needed. Query iNaturalist
  // inside that region's coverage box, scoped to its native taxa.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    if (!inatId) {
      showNote(t("nearby.noTaxonId", { name: commonName(plant) }));
      return;
    }
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = t("nearby.asking");
    showBusy();
    try {
      const result = await plantSightingsInRegion(inatId, region.meta.id, toBounds(region));
      renderResults(result, region, "region");
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function renderResults(result: SightingResult, region: RegionDef, mode: Mode, label?: string): void {
    clear(out);
    const mine = result.observations;
    const where = label ? t("nearby.nearPlace", { place: label }) : t("nearby.closeToYou");
    const name = commonName(plant);
    if (!mine.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? t("nearby.noneNear", { name, region: regionName(region.meta), where })
          : t("nearby.noneInRegion", { name, region: regionName(region.meta) })));
      out.append(freshnessLine(result.fromCache));
      return;
    }

    // Eight sightings' worth of photos feed the gallery, which caps itself at a
    // dozen tiles — enough variety that the grid isn't four shots of one bush.
    const shown = mine.slice(0, 8);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" },
        mode === "near"
          ? [el("strong", {}, t("nearby.foundNear", { n: fmtNumber(mine.length) })),
             tn("nearby.foundNearRest", mine.length, { name, region: regionName(region.meta), where })]
          : [el("strong", {}, t("nearby.found", { n: fmtNumber(mine.length) })),
             tn("nearby.foundRest", mine.length, { name, region: regionName(region.meta) })],
      ),
    );
    out.append(observationList(shown, name));
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
    // The label leans on the line above it. With one native region there is
    // nothing to choose between, so the button says what it does and skips the
    // name entirely; with several it needs to tell them apart, and the short
    // form does that without the parenthetical qualifier that made the full name
    // wrap ("Pacific Northwest", not "Pacific Northwest (west of the Cascades)").
    const many = regions.length > 1;
    return el("div", { class: "obs-elsewhere" }, [
      el("p", { class: "obs-elsewhere-lede" }, t("nearby.notThereNative")),
      el("div", { class: "obs-elsewhere-row" },
        regions.map((r) => {
          const btn = el("button", {
            type: "button",
            class: "btn btn-secondary btn-compact",
            onClick: () => void loadRegion(r, btn),
          }, `🗺️ ${many ? regionShort(r.meta) : t("nearby.whereNative")}`) as HTMLButtonElement;
          return btn;
        }),
      ),
    ]);
  }

  // "Our data lists this as native to Florida, not the Pacific Northwest…"
  function nativeElsewhereNote(region: RegionDef): string {
    const names = nativeRegionIds
      .map((id) => REGIONS.find((r) => r.meta.id === id))
      .filter((r): r is RegionDef => Boolean(r))
      .map((r) => regionName(r.meta));
    const belongs = names.length
      ? t("nearby.nativeToList", { list: fmtList(names) })
      : t("nearby.nativeToOther");
    return t("nearby.nativeElsewhere", {
      name: commonName(plant),
      belongs,
      region: regionName(region.meta),
    });
  }

  // No top margin of its own: the card above already carries a bottom one, and
  // in the plant page's laptop columns (where margins don't collapse) a second
  // one would open a gap twice the size of every other.
  // `sec-nearby` and the heading's `#` mark: this card is one of the plant
  // page's linkable sections like any other (see `steps/plant.ts`), so someone
  // can send "here's what it looks like where you live" straight to it.
  return el("section", { class: "card plant-section", id: "sec-nearby" }, [
    // No plant name in the heading — the page is already about this plant, and
    // interpolating one would change the heading's width per species.
    anchoredHeading(
      t("nearby.seeItGrowing"),
      plantSectionHref("nearby"),
      t("plant.sectionLink")
    ),
    el("p", { class: "obs-section-lede" }, t("nearby.seeItGrowingLede", { name: commonName(plant) })),
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
