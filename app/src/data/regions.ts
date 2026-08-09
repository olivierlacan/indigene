// The region registry. This is the one place that knows the full set of regions
// Indigene covers. Adding a region is: write a `region.<id>.ts` description and
// a `plants.<id>.ts` list, then add two lines here. Everything downstream (which
// plant list to load, what the welcome screen advertises, whether a spot is
// covered) reads from this list, so nothing else has to change.
//
// **Each region's plants are a separate download.** The descriptions below are
// imported the ordinary way — they're small, and the app needs all of them at
// once to work out which region a spot is in. The plant lists are reached
// through `import()` instead, so the bundler gives each one a file of its own
// and the browser fetches only the region somebody is actually gardening in.
// That is why the two live in separate modules: a static import of the
// description would drag its plant list along with it, and there would be
// nothing left to split.
//
// The saving is not small — all nine lists together are about a third of the
// app's download, and a reader wants one of them. `loadPlants` in
// `lib/plants.ts` is the front door; it caches, so a list is fetched once.
import type { RegionDef } from "./region";
import { REGION as MID_ATLANTIC } from "./region.mid-atlantic";
import { REGION as PNW } from "./region.pnw";
import { REGION as CA_SOUTH_COAST } from "./region.ca-south-coast";
import { REGION as FLORIDA_CENTRAL } from "./region.florida";
import { REGION as FLORIDA_SOUTH } from "./region.florida-south";
import { REGION as FRANCE_ATLANTIC } from "./region.france-atlantic";
import { REGION as FRANCE_CONTINENTAL } from "./region.france-continental";
import { REGION as FRANCE_MEDITERRANEAN } from "./region.france-mediterranean";
import { REGION as FRANCE_ALPINE } from "./region.france-alpine";

export const REGIONS: RegionDef[] = [
  { meta: MID_ATLANTIC, load: () => import("./plants.mid-atlantic").then((m) => m.SEED_RAW) },
  { meta: PNW, load: () => import("./plants.pnw").then((m) => m.SEED_RAW) },
  // The West Coast, continued southward — see docs/west-coast-plan.md for the
  // rest of the carve (central and north coast California, the Central Valley,
  // the Sierra, eastern Oregon, and the deserts last).
  { meta: CA_SOUTH_COAST, load: () => import("./plants.ca-south-coast").then((m) => m.SEED_RAW) },
  { meta: FLORIDA_CENTRAL, load: () => import("./plants.florida").then((m) => m.SEED_RAW) },
  { meta: FLORIDA_SOUTH, load: () => import("./plants.florida-south").then((m) => m.SEED_RAW) },
  // Metropolitan France, complete: all four of its EEA biogeographical regions.
  // Unlike the US regions, these four have *overlapping* coverage boxes — no set
  // of rectangles separates the oceanic west from the Mediterranean south, or
  // the Alps from the continental east — so selection leans on the live EEA
  // region code, with the tightest box as the offline tiebreak. See
  // `regionsForCoords` below and docs/france-localization-plan.md.
  { meta: FRANCE_ATLANTIC, load: () => import("./plants.france-atlantic").then((m) => m.SEED_RAW) },
  { meta: FRANCE_CONTINENTAL, load: () => import("./plants.france-continental").then((m) => m.SEED_RAW) },
  { meta: FRANCE_MEDITERRANEAN, load: () => import("./plants.france-mediterranean").then((m) => m.SEED_RAW) },
  { meta: FRANCE_ALPINE, load: () => import("./plants.france-alpine").then((m) => m.SEED_RAW) },
];

/**
 * Every region whose coverage box contains this point, **smallest box first**.
 *
 * Boxes used to be required not to overlap, which stopped being possible the
 * moment France got four regions: the EEA biogeographical regions interlock
 * (the Mediterranean coast reaches north past Montpellier while the Atlantic
 * zone reaches south to the Pyrenean foot, and the Alps sit inside the
 * Continental east), and no set of rectangles separates them. So a point can
 * now be in several boxes, and `regionForSite` uses the live ecoregion lookup
 * to pick between them. Smallest-box-first is the tiebreak when there's no live
 * lookup to ask (offline, or outside a provider's coverage): the tighter box is
 * the more specific claim, so a Marseille point offline gets the Mediterranean
 * list rather than the much larger Atlantic one.
 */
export function regionsForCoords(lat: number, lon: number): RegionDef[] {
  return REGIONS.filter(({ meta: { bounds: b } }) =>
    lat >= b.minLat && lat <= b.maxLat && lon >= b.minLon && lon <= b.maxLon
  ).sort((a, b) => boxArea(a) - boxArea(b));
}

/** Degrees² — a comparison key for "which box is the more specific claim", not
 *  a real area (no cos(lat) term); it only ever compares boxes over one point. */
function boxArea({ meta: { bounds: b } }: RegionDef): number {
  return (b.maxLat - b.minLat) * (b.maxLon - b.minLon);
}

/**
 * The most specific region whose coverage box contains this point, or null if
 * none does. Coarse by design (see RegionBounds) — a point outside every box
 * means "we don't have a plant list for here yet", which the app says plainly
 * rather than guessing with the wrong region's plants.
 */
export function regionForCoords(lat: number, lon: number): RegionDef | null {
  return regionsForCoords(lat, lon)[0] ?? null;
}
