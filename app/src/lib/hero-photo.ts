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
//
// **And under both, iNaturalist's own answer.** Reviewing 380 subjects is a lot
// of sittings, and until somebody sits down the plant keeps a drawing of a
// generic shrub. So `inat-heroes.json` holds the photograph iNaturalist's own
// taxon page opens with — one per species, no region, chosen by their curators
// rather than by us (`scripts/inat-heroes.mjs`). It is the floor, not the
// ceiling: a reviewed pick wins wherever one exists, so a subject that goes
// through review stops reading from it.
import PICKS from "../data/hero-photos.json";
import WILDLIFE_PICKS from "../data/wildlife-photos.json";
import TAXON_PHOTOS from "../data/inat-heroes.json";
import type { ObservationSummary } from "./inaturalist";

/** One chosen photograph, as `hero-photos.json` stores it — the shape the
 *  review page downloads (see `scripts/build-hero-review.mjs`). */
export interface HeroPhoto {
  photoId: number;
  /** The sighting the photograph came from. Absent for iNaturalist's own taxon
   *  photograph, which is filed under the species rather than under a sighting
   *  — the credit then links to the photo's own page instead. */
  observationId?: number;
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

/**
 * iNaturalist's own photograph for a species, as `inat-heroes.json` stores it —
 * `subjectId → photo`, with no region, because their taxon page shows one
 * picture wherever you are.
 *
 * Only the `square` address is stored: the other renditions are the same URL
 * with the size swapped, and three copies of a 90-character address is 30 KB of
 * everybody's download to say the same thing three times.
 */
interface TaxonPhoto {
  taxonId: number;
  photoId: number;
  url: string;
  observer: string | null;
  license: string;
  attribution: string | null;
  color?: string;
}

const picks = PICKS as PickTable;
const wildlifePicks = WILDLIFE_PICKS as PickTable;
const taxonPhotos = TAXON_PHOTOS as Record<string, TaxonPhoto>;

/** iNaturalist serves every rendition at the same address with the size
 *  swapped, which is what lets the stored record carry one URL. */
const sized = (url: string, size: string) =>
  url.replace(/\/(square|small|medium|large|original)\.(\w+)$/i, `/${size}.$2`);

function asHero(photo: TaxonPhoto): HeroPhoto {
  return {
    photoId: photo.photoId,
    observer: photo.observer,
    license: photo.license,
    attribution: photo.attribution,
    thumbUrl: photo.url,
    mediumUrl: sized(photo.url, "medium"),
    largeUrl: sized(photo.url, "large"),
    color: photo.color,
  };
}

/** The one fallback rule, shared by every table of picks: the region being
 *  displayed if it has been reviewed, otherwise whichever region has —
 *  and under both, the photograph iNaturalist shows for the species. */
function pickFrom(table: PickTable, id: string, regionId?: string): HeroPhoto | undefined {
  const byRegion = table[id];
  if (!byRegion) return taxonPhotos[id] ? asHero(taxonPhotos[id]) : undefined;
  if (regionId && byRegion[regionId]) return byRegion[regionId];
  // Object key order is insertion order, which for a downloaded picks file is
  // the order they were reviewed in — as good a default as any, and stable.
  return Object.values(byRegion)[0];
}

/**
 * Where the credit under a hero photograph points. A reviewed pick came from a
 * sighting somebody recorded, so it goes there; iNaturalist's taxon photograph
 * has no sighting behind it and goes to the photo's own page, which carries the
 * same licence and the same photographer.
 */
export function heroSourceUrl(hero: HeroPhoto): string {
  return hero.observationId
    ? `https://www.inaturalist.org/observations/${hero.observationId}`
    : `https://www.inaturalist.org/photos/${hero.photoId}`;
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
    id: hero.observationId ?? 0,
    // iNaturalist's taxon photograph is filed under the species, not under a
    // sighting: there is no record to link to, no observer login behind the
    // name, and no where-and-when. The lightbox is told once, here, and adjusts
    // all three — rather than each of them guessing from a missing field.
    taxonPhoto: hero.observationId ? undefined : true,
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
