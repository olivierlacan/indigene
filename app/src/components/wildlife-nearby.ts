// "See it near you" — a section on an animal's page that shows real,
// research-grade iNaturalist sightings of that species observed close to the
// user (or inside a region it's found in), so the catalog blurb is backed by
// "here's an actual one, photographed 6 km from here, last August."
//
// It's the wildlife twin of the plant page's "See it growing near you"
// (`nearby-observations.ts`) and keeps the same promises: nothing loads until
// the person asks and shares their location; the request goes straight from
// their browser to iNaturalist (never proxied through us); iNaturalist is
// credited on the section and every photo carries its observer + licence.
//
// The one structural difference from the plant twin is honesty about scope: the
// plant version refuses to showcase a plant where our data doesn't call it a
// local native. An animal is simply native (guaranteed by the catalog), so here
// we only gate on being somewhere Indigene covers, and offer "look it up where
// it's found" for the regions our data ties it to.
import { el, clear } from "../ui";
import { regionForSite } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { regionsForWildlife } from "../lib/wildlife";
import { wildlifeSightingsNear, wildlifeSightingsInRegion } from "../lib/wildlife-sightings";
import type { SightingResult } from "../lib/wildlife-sightings";
import type { Bounds, ObservationSummary } from "../lib/inaturalist";
import { observationCard, freshnessLine } from "./observation-ui";
import type { InatScope, Wildlife } from "../types";

/** "Where are we looking?" — near the user, or inside a named region's box. */
type Mode = "near" | "region";

/**
 * Build the section for an animal, or return null when there's nothing to show:
 * informal groups (e.g. "Jays, turkeys & woodpeckers") carry no iNaturalist
 * scope, so — exactly as they get no single species-record link — they get no
 * "see it near you" lookup. When it does build, the section wires up its own
 * geolocation, fetch/cache call, and rendering.
 */
export function wildlifeNearbySection(w: Wildlife): HTMLElement | null {
  const maybeScope = w.inat;
  if (!maybeScope) return null;
  // Pin to a non-optional type so the hoisted async closures below (which don't
  // inherit the guard's control-flow narrowing) still see a defined scope.
  const scope: InatScope = maybeScope;

  const out = el("div", { "aria-live": "polite" });
  const findBtn = el("button", {
    class: "btn btn-primary btn-block",
    onClick: run,
  }, "📷 See it near me") as HTMLButtonElement;

  function resetButton(): void {
    findBtn.disabled = false;
    findBtn.textContent = "📷 See it near me";
  }

  async function run(): Promise<void> {
    if (!("geolocation" in navigator)) {
      showNote("This device can't share a location, so we can't look for nearby sightings. You can still look it up in a region below.");
      return;
    }
    findBtn.disabled = true;
    findBtn.textContent = "Getting your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => void load(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        resetButton();
        showNote(
          err.code === err.PERMISSION_DENIED
            ? "Location denied — we only use it to find sightings near you, and only when you tap this. You can still look it up in a region below."
            : "Couldn't get your location. Try again in a moment.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  }

  async function load(lat: number, lon: number): Promise<void> {
    clear(out);
    // Only do a "near me" lookup where Indigene actually operates — the same
    // covered-region gate the rest of the app uses. Outside it we have no local
    // footing, so we point the user at looking it up in a region it's found in.
    const region = regionForSite(lat, lon);
    if (!region) {
      resetButton();
      showNote("You're outside the regions Indigene covers, so we can't do a nearby lookup here. You can still look it up in a region where it's found, below.");
      return;
    }

    findBtn.textContent = "Asking iNaturalist…";
    try {
      const result = await wildlifeSightingsNear(scope, w.id, lat, lon);
      renderResults(result, "near", region);
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      findBtn.disabled = false;
      findBtn.textContent = "📷 Refresh nearby sightings";
    }
  }

  // "Look it up in a region it's found in" — no current location needed. Query
  // iNaturalist inside that region's coverage box for this one animal.
  async function loadRegion(region: RegionDef, btn: HTMLButtonElement): Promise<void> {
    clear(out);
    const label = btn.textContent ?? "";
    btn.disabled = true;
    btn.textContent = "Asking iNaturalist…";
    try {
      const result = await wildlifeSightingsInRegion(scope, w.id, region.meta.id, toBounds(region));
      renderResults(result, "region", region);
    } catch {
      showNote("We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function renderResults(result: SightingResult, mode: Mode, region: RegionDef): void {
    clear(out);
    const name = w.common.toLowerCase();
    const sightings = result.observations;
    if (!sightings.length) {
      out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" },
        mode === "near"
          ? `No one has photographed and verified a ${name} close to you on iNaturalist yet — that just means the community hasn't logged one here, not that it's absent.`
          : `No research-grade ${name} sightings with photos have been logged in ${region.meta.name} on iNaturalist yet — the community just hasn't captured one.`));
      out.append(freshnessLine(result.fromCache));
      return;
    }

    // Enough to show the animal, not a gallery to scroll forever.
    const shown = sightings.slice(0, 4);
    out.append(
      el("p", { style: "margin:0.6rem 0 0.4rem" },
        mode === "near"
          ? [el("strong", {}, `Found ${sightings.length} nearby `),
             `research-grade sighting${sightings.length === 1 ? "" : "s"} — a real ${name} someone verified and photographed close to you:`]
          : [el("strong", {}, `Found ${sightings.length} `),
             `research-grade sighting${sightings.length === 1 ? "" : "s"} of ${name} in ${region.meta.name} — verified and photographed by the iNaturalist community (you don't have to be there):`],
      ),
    );
    out.append(el("div", { class: "obs-list" }, shown.map((o: ObservationSummary) => observationCard(o, w.common))));
    out.append(freshnessLine(result.fromCache));
  }

  // The regions our data ties this animal to, as tappable "look it up there"
  // buttons. Null when there are none (the near-me path still works).
  function regionButtons(): HTMLElement | null {
    const regions = regionsForWildlife(w.id);
    if (!regions.length) return null;
    return el("div", { style: "margin-top:0.8rem" }, [
      el("p", { style: "margin:0 0 0.4rem;font-weight:650" }, "Not there right now? Look it up where it's found:"),
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

  function showNote(msg: string): void {
    clear(out);
    out.append(el("p", { class: "note warn", style: "margin-top:0.6rem" }, msg));
  }

  return el("section", { class: "card", style: "margin-top:1rem" }, [
    el("h3", { style: "margin-top:0" }, "See it near you"),
    el("p", { style: "margin:0.3rem 0 0.6rem" }, [
      `Nothing beats seeing a real ${w.common.toLowerCase()}. Share your location and we'll pull community-verified iNaturalist photos of ones spotted near you — or look it up in a region where it's found, even if you're not there. Either way the photos come live from iNaturalist, called by your own browser and credited to the people who took them.`,
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
