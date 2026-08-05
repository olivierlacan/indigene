// A plant's photographs *by angle* — the whole plant, its leaves, its flowers,
// its fruit — as chosen by a person from a machine-ranked shortlist. The hero
// picks (`hero-photo.ts`) answer "what does this look like?" with one picture;
// this answers "what am I actually looking at in my hand?", which is a different
// question and usually four different photographs.
//
// **Why a separate file from the heroes.** One pick is about 600 bytes of URLs
// and credit, and the hero table is 200 of them — already the biggest single
// piece of data in the bundle. Four angles per plant per region would be several
// times that, downloaded by everyone, to serve one page almost nobody opens on
// any given visit. So the angles live in their own JSON, imported dynamically:
// the chunk is fetched the first time someone opens a plant's photo page and
// never otherwise. The heroes stay in the main bundle, because every list in the
// app draws them.
//
// (If that chunk ever grows past a hundred kilobytes or so, the next split is by
// region — a reader in Florida has no use for the Alps' close-ups. It isn't
// worth the complexity while the table is small.)
//
// **Angles fall back across regions independently**, the way heroes do: a leaf
// close-up picked for the Mid-Atlantic is still a true picture of the species'
// leaf in Florida, and showing it beats showing nothing. A region-specific pick
// wins where one exists.
import type { HeroPhoto } from "./hero-photo";

/**
 * The angles a plant is photographed from, in the order they're shown.
 *
 * Deliberately four, and deliberately these four: they are what a person
 * standing in front of a shrub actually compares against — its shape from a few
 * steps back, then the three details that identify it. Bark is the obvious
 * fifth and is left out for now rather than asked for and left empty.
 */
export const PHOTO_ANGLES = ["habit", "leaf", "flower", "fruit"] as const;

export type PhotoAngle = (typeof PHOTO_ANGLES)[number];

/** The picks for one plant in one region. Every angle is optional — most plants
 *  will have some and not others for a long time, and a missing one is simply a
 *  section that isn't there. */
export type AngleSet = Partial<Record<PhotoAngle, HeroPhoto>>;

/** `plantId → regionId → angles`. Ships as `{}`; grows as reviews land. */
export type AngleTable = Record<string, Record<string, AngleSet>>;

let loaded: AngleTable | null = null;
let inFlight: Promise<AngleTable> | null = null;

/**
 * Fetch the angle table, once. Every later call gets the same object without a
 * second request — the chunk is immutable and the reader may open several plants'
 * photo pages in one sitting.
 *
 * A failure here is not an error state worth showing: the photo page still has
 * the plant's hero and the live iNaturalist gallery, which is the majority of
 * what it's for. So the promise resolves to an empty table rather than rejecting.
 */
export function loadAnglePicks(): Promise<AngleTable> {
  if (loaded) return Promise.resolve(loaded);
  inFlight ??= import("../data/plant-photos.json")
    .then((mod) => (loaded = (mod.default ?? {}) as AngleTable))
    .catch(() => (loaded = {}));
  return inFlight;
}

/**
 * One plant's angles, preferring `regionId` and falling back per angle to
 * whichever region has that one. `table` is what `loadAnglePicks` resolved to,
 * passed in rather than reached for so this stays a pure function the page can
 * call while rendering.
 */
export function anglesFor(table: AngleTable, plantId: string, regionId?: string): AngleSet {
  const byRegion = table[plantId];
  if (!byRegion) return {};
  const out: AngleSet = {};
  for (const angle of PHOTO_ANGLES) {
    const here = regionId ? byRegion[regionId]?.[angle] : undefined;
    // Insertion order is review order — stable, and as good a default as any.
    out[angle] = here ?? Object.values(byRegion).find((set) => set[angle])?.[angle];
  }
  return out;
}

/** How many angles a set actually carries — the page's "is there anything here
 *  yet?" test, and the count it reports. */
export function angleCount(set: AngleSet): number {
  return PHOTO_ANGLES.filter((a) => set[a]).length;
}
