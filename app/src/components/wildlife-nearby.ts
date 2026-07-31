// "See it near you" — a section on an animal's page that shows real,
// research-grade iNaturalist sightings of that species observed close to the
// user (or inside a region it's found in), so the catalog blurb is backed by
// "here's an actual one, photographed 6 km from here, last August."
//
// It's the wildlife twin of the plant page's "See it growing near you"
// (`nearby-observations.ts`) and keeps the same promises: nothing loads until
// the person asks and gives a spot; the request goes straight from their browser
// to iNaturalist (never proxied through us); iNaturalist is credited on the
// section and every photo carries its observer + licence.
//
// "Near you" is set two equally-weighted ways (see `location-prompt.ts`): share
// the device's location, or type a ZIP code / town. Either resolves to a
// coordinate we hand to the same lookup, so someone who won't (or can't) share
// precise location is not a second-class case.
//
// The one structural difference from the plant twin is honesty about scope: the
// plant version refuses to showcase a plant where our data doesn't call it a
// local native. An animal is simply native (guaranteed by the catalog), so here
// we only gate on the spot being somewhere Indigene covers, and offer "look it
// up where it's found" for the regions our data ties it to.
import { el, clear } from "../ui";
import { regionForSite } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { regionsForWildlife } from "../lib/wildlife";
import { wildlifeSightingsNear, wildlifeSightingsInRegion } from "../lib/wildlife-sightings";
import type { SightingResult } from "../lib/wildlife-sightings";
import { isBusy } from "../lib/inaturalist";
import type { Bounds } from "../lib/inaturalist";
import { observationList, freshnessLine } from "./observation-ui";
import { locationPrompt } from "./location-prompt";
import type { InatScope, Wildlife } from "../types";
import { t, tn, fmtNumber } from "../lib/i18n";
import { commonName, regionName, regionShort } from "../lib/names";

/** "Where are we looking?" — near a chosen spot, or inside a named region's box. */
type Mode = "near" | "region";

/**
 * Build the section for an animal, or return null when there's nothing to show:
 * informal groups (e.g. "Jays, turkeys & woodpeckers") carry no iNaturalist
 * scope, so — exactly as they get no single species-record link — they get no
 * "see it near you" lookup. When it does build, the section wires up its own
 * location prompt, fetch/cache call, and rendering.
 */
export function wildlifeNearbySection(w: Wildlife): HTMLElement | null {
  const maybeScope = w.inat;
  if (!maybeScope) return null;
  // Pin to a non-optional type so the closures below (which don't inherit the
  // guard's control-flow narrowing) still see a defined scope.
  const scope: InatScope = maybeScope;

  const out = el("div", { "aria-live": "polite" });

  const prompt = locationPrompt({
    idBase: `wl-${w.id}`,
    gpsLabel: t("nearby.useMyLocation"),
    onResolve: (lat, lon, label) => void loadNear(lat, lon, label),
  });

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }
  function showBusy(): void {
    clear(out);
    out.append(el("p", { class: "note", style: "margin-top:0.6rem" }, t("nearby.asking")));
  }

  async function loadNear(lat: number, lon: number, label?: string): Promise<void> {
    // Only do a "near me" lookup where Indigene actually operates — the same
    // covered-region gate the rest of the app uses. Outside it we have no local
    // footing, so we point the user at looking it up in a region it's found in.
    const region = regionForSite(lat, lon);
    if (!region) {
      showNote(label ? t("wlNearby.outsidePlace", { place: label }) : t("wlNearby.outsideYou"));
      return;
    }
    showBusy();
    try {
      const result = await wildlifeSightingsNear(scope, w.id, lat, lon);
      renderResults(result, "near", region, label);
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    }
  }

  // "Look it up in a region it's found in" — no spot needed. Query iNaturalist
  // inside that region's coverage box for this one animal.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = t("nearby.asking");
    showBusy();
    try {
      const result = await wildlifeSightingsInRegion(scope, w.id, region.meta.id, toBounds(region));
      renderResults(result, "region", region);
    } catch (err) {
      showNote(t(isBusy(err) ? "nearby.busy" : "nearby.unreachable"));
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function renderResults(result: SightingResult, mode: Mode, region: RegionDef, label?: string): void {
    clear(out);
    const name = commonName(w);
    const where = label ? t("nearby.nearPlace", { place: label }) : t("nearby.closeToYou");
    const sightings = result.observations;
    if (!sightings.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? t("wlNearby.noneNear", { name, where })
          : t("wlNearby.noneInRegion", { name, region: regionName(region.meta) })));
      out.append(freshnessLine(result.fromCache));
      return;
    }

    // Eight sightings' worth of photos feed the gallery, which caps itself at a
    // dozen tiles — enough variety that the grid isn't four shots of one bird.
    const shown = sightings.slice(0, 8);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" },
        mode === "near"
          ? [el("strong", {}, t("nearby.found", { n: fmtNumber(sightings.length) })),
             tn("wlNearby.foundNearRest", sightings.length, { name, where })]
          : [el("strong", {}, t("nearby.found", { n: fmtNumber(sightings.length) })),
             tn("wlNearby.foundRest", sightings.length, { name, region: regionName(region.meta) })],
      ),
    );
    out.append(observationList(shown, name));
    out.append(freshnessLine(result.fromCache));
  }

  // The regions our data ties this animal to, as tappable "look it up there"
  // buttons. Null when there are none (the spot path still works).
  function regionButtons(): HTMLElement | null {
    const regions = regionsForWildlife(w.id);
    if (!regions.length) return null;
    // Same thrift as the plant twin: one region needs no name (the line above
    // said it), several need only the short form to tell them apart.
    const many = regions.length > 1;
    return el("div", { class: "obs-elsewhere" }, [
      el("p", { class: "obs-elsewhere-lede" }, t("wlNearby.notThereFound")),
      el("div", { class: "obs-elsewhere-row" },
        regions.map((r) => {
          const btn = el("button", {
            type: "button",
            class: "btn btn-secondary btn-compact",
            onClick: () => void loadRegion(r, btn),
          }, `🗺️ ${many ? regionShort(r.meta) : t("wlNearby.whereFound")}`) as HTMLButtonElement;
          return btn;
        }),
      ),
    ]);
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, t("wlNearby.seeItNear")),
    el("p", { class: "obs-section-lede" }, t("wlNearby.seeItNearLede", { name: commonName(w) })),
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
