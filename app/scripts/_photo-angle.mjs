// Guess what a candidate photograph is a picture *of*: the whole plant, a leaf,
// a flower, or a fruit. Stage two-and-a-half of the hero-photo pipeline (see
// docs/hero-photos.md).
//
// ## Why guessing at all
//
// iNaturalist's photo pool for a given plant is mostly leaves. Anyone who has
// scrolled one knows the shape of it: forty close-ups of foliage, three
// flowering shots taken the same week in May, one picture of the whole shrub
// somebody took from a car. Ranking those by photographic quality — which is all
// `_photo-quality.mjs` does — produces a shortlist of ten excellent photographs
// of leaves, and a reviewer looking for the whole shrub has to read past all of
// them.
//
// So the shortlist is grouped instead of merely ranked, and this file decides
// which group a candidate lands in first.
//
// ## Two signals, and only one of them is trustworthy
//
// **The annotation is the real one.** iNaturalist carries community-curated
// annotations on observations, and one of the controlled terms is Plant
// Phenology: *Flowering*, *Fruiting*, *Flower Budding*, *No Evidence of
// Flowering*. That is a person — usually several — saying what the observation
// shows. The harvest asks for flowering and fruiting observations *as separate
// queries* (`term_id=12`), so a candidate that arrives that way is filed under
// flower or fruit on human authority, not ours.
//
// The one honest caveat: an annotation describes the **observation**, not each
// of its photographs. A fruiting observation often carries a habit shot and a
// leaf shot alongside the berries. So even here the reviewer is choosing, not
// confirming.
//
// **The pixels are the weak one.** No annotation exists for "this is the whole
// shrub" or "this is a leaf", so those two are guessed from colour statistics:
// sky in the top third, greenness in the middle, how much detail sits in the
// centre versus the edges. The reasoning is stated in `fit()` below, and it is
// exactly as crude as it sounds.
//
// Measured over one full harvest (6,755 plant candidates), the two buckets do at
// least separate: 94% of the photographs called habit have visible sky, the ones
// called leaf have essentially none, and only 1% of habit calls win by a hair.
// That says the signal discriminates rather than defaults. It does not say the
// call is right — nothing here knows whether the whole shrub is in the frame,
// and a scrubby hillside with the plant somewhere in it measures the same as a
// fine specimen shot.
//
// ## Which is why nothing here decides anything
//
// The output is an ordering and a suggested bucket, both visible in the review
// page as a little tag on each tile. Every candidate appears under every angle
// the reviewer can assign it to; the guess only decides what they see first. A
// wrong guess costs one scroll. That is the most a signal this weak has earned.

/** The angles a plant is photographed from — the same four the app shows, in
 *  the same order (`src/lib/plant-photos.ts`). */
export const ANGLES = ["habit", "leaf", "flower", "fruit"];

/** iNaturalist's controlled term for Plant Phenology, and the values we ask
 *  for. Numbers rather than names because that is what the API takes; they are
 *  stable ids, published in `/v1/controlled_terms`. */
export const PHENOLOGY = {
  term: 12,
  flowering: 13,
  fruiting: 14,
};

/** How the harvest labels a candidate that came back from a phenology query.
 *  Keyed by the value id so a query and its label can't drift apart. */
export const PHENOLOGY_LABEL = {
  [PHENOLOGY.flowering]: "flowering",
  [PHENOLOGY.fruiting]: "fruiting",
};

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * How well one photograph fits each angle, 0–1 apiece. `m` is a measurement
 * from `_photo-quality.mjs`; `phenology` is `"flowering"`, `"fruiting"`, or
 * null/undefined when the candidate came from the general query.
 *
 * These are not probabilities and they don't sum to one. They are the numbers
 * the review page sorts by.
 */
export function fit(m, phenology) {
  if (!m || m.error) return { habit: 0, leaf: 0, flower: 0, fruit: 0 };

  // Isolation, as in `combine()`: 1.0 means "as busy at the edges as in the
  // middle" — a scene — and 4+ means a subject standing clear of its
  // surroundings. A whole shrub in its habitat is a scene; a leaf is not.
  const isolation = clamp(
    Math.log2(Math.max(m.centreDetail, 1) / Math.max(m.edgeDetail, 1)) / 3,
  );
  const sky = m.sky ?? 0;
  const green = m.green ?? 0;
  const centreGreen = m.centreGreen ?? 0;
  const centreVivid = m.centreVivid ?? 0;
  const centreLight = m.centreLight ?? 0;
  // Taller than wide. Someone photographing a whole tree turns the phone.
  const upright = clamp((1 - (m.aspect ?? 1)) / 0.35);

  // The whole plant: sky above it, foliage across the frame rather than only in
  // the middle, and detail spread everywhere because half the picture is the
  // meadow it's standing in.
  const habit = clamp(
    0.45 * clamp(sky / 0.18) +
      0.25 * (1 - isolation) +
      0.2 * clamp((green - centreGreen + 0.15) / 0.3) +
      0.1 * upright,
  );

  // A leaf: green in the middle, a subject that stands clear of its background,
  // and no sky — a photograph taken from about a foot away.
  const leaf = clamp(
    (0.5 * clamp(centreGreen / 0.7) + 0.35 * isolation + 0.15 * clamp(1 - centreVivid / 0.15)) *
      (1 - clamp(sky / 0.12)),
  );

  // Flower and fruit both mean "something in the middle that isn't a leaf". The
  // pixels can't tell a blossom from a berry — a red camellia and a rose hip are
  // the same measurement — so the *annotation* separates them and the pixels
  // only say how confidently the frame is about that something.
  const notLeaf = clamp((centreVivid + centreLight * 0.7) / 0.25);
  const detailish = 0.6 * notLeaf + 0.4 * isolation;
  const flower = phenology === "flowering" ? clamp(0.55 + 0.45 * detailish) : 0.35 * notLeaf;
  const fruit = phenology === "fruiting" ? clamp(0.55 + 0.45 * detailish) : 0.25 * notLeaf;

  return {
    habit: round(habit),
    leaf: round(leaf),
    flower: round(flower),
    fruit: round(fruit),
  };
}

/** Below this, the guess isn't worth showing as a tag — the candidate is filed
 *  as unsorted and simply appears under every angle, ranked on quality. */
const MIN_CONFIDENCE = 0.45;

/**
 * The best-fitting angle, or null when nothing fits well enough to be worth
 * saying. A tie goes to the earlier angle in `ANGLES`, which puts the whole
 * plant first — the picture a reviewer is usually short of.
 */
export function suggest(scores) {
  let best = null;
  for (const angle of ANGLES) {
    if (scores[angle] > (best ? scores[best] : MIN_CONFIDENCE)) best = angle;
  }
  return best;
}

function round(v) {
  return Math.round(v * 100) / 100;
}
