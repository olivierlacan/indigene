// The chosen photograph for a plant — the "hero" that replaces the to-scale
// drawing at the top of a plant page.
//
// The drawing is picked by the plant's *form*: every shrub gets the same shrub,
// every tree the same tree. It is honest about size and useless for
// recognition, which is the wrong trade for the first thing you see. A real
// photograph of the actual species is the right one — chosen by a person, from
// a machine-ranked shortlist, and committed to the repo. See
// `docs/hero-photos.md` for how a pick gets here.
//
// **Picks are keyed by region, and fall back across them.** A red maple in
// Florida doesn't look like a red maple in Maryland, so the data is per region
// — but reviewing 200 plants × their regions is a lot to ask before anything
// shows up. So a plant with a pick for *any* region gets a photo everywhere,
// and a region-specific pick simply overrides it where one exists. Reviewing
// can start with one photo per plant and improve, rather than being all or
// nothing.
//
// **Nothing is shown without its credit.** A pick carries the observer, the
// licence and iNaturalist's own attribution string from the moment it was
// harvested; `asObservation` reshapes it into the same `ObservationSummary` the
// nearby-sightings layer uses, so the lightbox credits a hero photo with
// exactly the same words, links and licence line as any other photo in the app.
// There is deliberately no second implementation of "how we credit a photo".
//
// **Animals have picks too, on the same terms.** `wildlife-photos.json` is the
// same table keyed by an animal's id instead of a plant's, harvested by the same
// script and chosen in the same review page — because "what does a hairstreak
// actually look like?" is the same question as "what does an alder buckthorn
// look like?", and an emoji answers it about as well as a generic shrub drawing
// did. Both files are read through `pickFrom` below, so there is one fallback
// rule and one credit path for every photograph the app has chosen.
import PICKS from "../data/hero-photos.json";
import WILDLIFE_PICKS from "../data/wildlife-photos.json";
import type { ObservationSummary } from "./inaturalist";

/** One chosen photograph, as `hero-photos.json` stores it — the shape the
 *  review page downloads (see `scripts/build-hero-review.mjs`). */
export interface HeroPhoto {
  photoId: number;
  observationId: number;
  observer: string | null;
  license: string;
  attribution: string | null;
  observedOn?: string | null;
  place?: string | null;
  taxonName?: string | null;
  thumbUrl: string;
  mediumUrl: string;
  largeUrl: string;
  /** The photograph's own average colour, `#rrggbb` — what the plant page's
   *  hero slot paints while the photograph is still coming down the wire, so it
   *  fades up out of its own colours instead of appearing in a green rectangle.
   *  Written by `scripts/hero-colors.mjs`, and optional: a pick that predates
   *  that script simply falls back to the app's placeholder green. */
  color?: string;
}

/** `subjectId → regionId → pick`. Empty until someone reviews a shortlist. */
export type PickTable = Record<string, Record<string, HeroPhoto>>;

const picks = PICKS as PickTable;
const wildlifePicks = WILDLIFE_PICKS as PickTable;

/** The one fallback rule, shared by every table of picks: the region being
 *  displayed if it has been reviewed, otherwise whichever region has. */
function pickFrom(table: PickTable, id: string, regionId?: string): HeroPhoto | undefined {
  const byRegion = table[id];
  if (!byRegion) return undefined;
  if (regionId && byRegion[regionId]) return byRegion[regionId];
  // Object key order is insertion order, which for a downloaded picks file is
  // the order they were reviewed in — as good a default as any, and stable.
  return Object.values(byRegion)[0];
}

/**
 * The photograph to show for a plant, preferring the region being displayed and
 * falling back to whichever region has been reviewed. `undefined` when nobody
 * has picked one yet — the caller keeps the drawing.
 */
export function heroPhotoFor(plantId: string, regionId?: string): HeroPhoto | undefined {
  return pickFrom(picks, plantId, regionId);
}

/**
 * The photograph to show for an animal — the same question, the same answer.
 *
 * The region here is the one whose wildlife list the reader is on
 * (`#/wildlife/in/<region>`), because a swallowtail in Florida and the same
 * genus on the Atlantic coast of France are not the same photograph. With no
 * region in hand, any reviewed one will do.
 */
export function wildlifePhotoFor(wildlifeId: string, regionId?: string): HeroPhoto | undefined {
  return pickFrom(wildlifePicks, wildlifeId, regionId);
}

/**
 * Reshape a pick into the observation summary the lightbox speaks, so a hero
 * photo opens with the same credit block, licence label and "view original
 * sighting" link as a nearby sighting. `fallbackName` is the plant's name, used
 * when the pick carries no scientific name of its own.
 *
 * There is no distance and no coordinate: a hero photo is "this is what the
 * species looks like", not "one grows here", and claiming otherwise would be a
 * different — and false — statement.
 */
export function asObservation(hero: HeroPhoto, fallbackName: string): ObservationSummary {
  return {
    id: hero.observationId,
    taxonId: 0, // unused: nothing joins on it, every lookup here is by plant
    taxonName: hero.taxonName ?? fallbackName,
    observer: hero.observer ?? "an iNaturalist observer",
    place: hero.place ?? null,
    lat: null,
    lon: null,
    distanceKm: null,
    observedOn: hero.observedOn ?? null,
    photos: [
      {
        id: hero.photoId,
        thumbUrl: hero.thumbUrl,
        mediumUrl: hero.mediumUrl,
        largeUrl: hero.largeUrl,
        license: hero.license,
        attribution: hero.attribution ?? `© ${hero.observer ?? "observer"}, ${hero.license.toUpperCase()}`,
      },
    ],
  };
}
