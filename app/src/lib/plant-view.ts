// Which of a plant's regional rows a page is showing, and how a page reads its
// own state out of the address.
//
// Extracted from `steps/plant.ts` when the photo page (`steps/plant-photos.ts`)
// needed the same answer: a plant native to more than one region has a different
// row per region, and its two pages must not disagree about which one is on
// screen. A photo page showing the Alps' close-ups beside a profile pinned to
// the Atlantic coast would be two answers to one question.
import { store } from "../state";
import { regionForSite } from "./plants";
import type { PlantEntry } from "./explore";

/**
 * Which of a plant's regional rows to show.
 *
 * A plant native to more than one region has a *different row per region* — and
 * they differ in load-bearing ways, not decoration: butterfly weed is hardy in
 * zones 3–9 in the Mid-Atlantic and 8–10 in Florida, goat willow's mature height
 * and even its French common name change between the Atlantic coast and the
 * Alps.
 *
 * This used to be `entries[0]`, which is whichever region happens to sit
 * earliest in the REGIONS array — so a Floridian who tapped butterfly weed in
 * their own Florida results list was shown the Mid-Atlantic's hardiness and the
 * Mid-Atlantic's description of it. In order of trust:
 *
 *   1. `?region=` in the address — a link that deliberately pinned one.
 *   2. The reader's own region: the one they picked by hand, or the one their
 *      spot resolves to (the same call the suitability check makes, so the page
 *      and the verdict on it can never disagree about where "here" is).
 *   3. The first row, which is all we can honestly do knowing nothing.
 */
export function activeEntry(entries: PlantEntry[]): PlantEntry {
  const pinned = hashParam("region");
  const byPin = pinned && entries.find((e) => e.region.meta.id === pinned);
  if (byPin) return byPin;

  const { regionOverride, lat, lon, site } = store.draft;
  if (regionOverride) {
    const chosen = entries.find((e) => e.region.meta.id === regionOverride);
    if (chosen) return chosen;
  }
  if (lat != null && lon != null) {
    const here = regionForSite(lat, lon, site);
    const mine = here && entries.find((e) => e.region.meta.id === here.meta.id);
    if (mine) return mine;
  }
  return entries[0];
}

/** One value out of the hash's query string (`#/plants/x?region=pnw`). The hash
 *  query is a page's *state*, not its identity — the router strips it before
 *  matching a route, so a page that wants it reads it here. */
export function hashParam(name: string): string | null {
  const at = location.hash.indexOf("?");
  if (at < 0) return null;
  return new URLSearchParams(location.hash.slice(at + 1)).get(name);
}
