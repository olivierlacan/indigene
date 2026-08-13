// "Is this one in trouble?" — the assessed answer, from the people who assess it.
//
// Not to be confused with `lib/rarity.ts`, which counts how often a plant is
// *recorded* near a spot and says out loud that it is a record of attention
// rather than a census. This is the other kind of claim: a rank published by
// NatureServe, the IUCN or a government, for a named place, which we print
// verbatim and attribute.
//
// **A rank is a fact about a place, and it does not travel.** White oak is S1 in
// Nebraska and the best tree in the Mid-Atlantic; field maple is critically
// endangered in Sweden and ordinary in France. 136 of our 368 subjects carry a
// worrying rank *somewhere*, and printing that somewhere on a page about here
// would tell a gardener their commonest oak is nearly gone. So
// `scripts/conservation.mjs` keeps only two things: a global assessment, which
// is about the species itself, and the rank in the one state or province each
// region actually is. Eleven subjects have either.
//
// **Which is why nothing here is a badge.** A red pill saying "ENDANGERED" on a
// plant we recommend planting is an invitation to go and find one. The copy
// says the rank, says who says so, and ends by saying what to do instead — buy
// it, for a plant; plant for it, for an animal.
import TABLE from "../data/conservation.json";
import { t, tOptional } from "./i18n";
import type { TKey } from "../locales/en";

/** One assessment: the rank as published, who published it, and — for a
 *  regional one — the place it is about. */
export interface Assessment {
  rank: string;
  authority: string | null;
  place?: string;
}

interface Row {
  global?: Assessment;
  regions?: Record<string, Assessment>;
}

const table = TABLE as Record<string, Row>;

/**
 * What may be said about this subject on a page showing `regionId`: the global
 * assessment if it has one, and the rank for that region's own place. Both are
 * optional and usually absent — most plants worth planting are doing fine.
 */
export function conservationFor(
  subjectId: string,
  regionId?: string,
): { global?: Assessment; here?: Assessment } {
  const row = table[subjectId];
  if (!row) return {};
  const here = regionId ? row.regions?.[regionId] : undefined;
  return { global: row.global, here };
}

/** True when anything at all is known — for the callers that only want to know
 *  whether to draw a block. */
export function hasConservation(subjectId: string, regionId?: string): boolean {
  const { global, here } = conservationFor(subjectId, regionId);
  return Boolean(global || here);
}

/**
 * NatureServe's ranks in words a gardener can read.
 *
 * `G3`, `S2`, `N1` — the letter is the scale (global, national, subnational)
 * and the digit is the finding. `S3S4` is not a typo: an assessor who cannot
 * choose between two ranks publishes the span, and the honest rendering is the
 * span, not its worse end. IUCN's codes are their own three-letter set.
 *
 * Returns null for anything unrecognised, and the caller then prints the raw
 * rank on its own — better a code the reader can search for than a guess.
 */
const IUCN = ["CR", "EN", "VU", "NT", "LC"];

/**
 * The place as the reader's language names it — "En Floride", not "En Florida,
 * US". The names come from iNaturalist, so they arrive in English; only a
 * region's own state or province can appear here, which is why a handful of
 * dictionary entries covers it. Anything we have no entry for is printed as
 * published, which is right: a place name we haven't translated is better than
 * a place name we guessed.
 */
export function placeInWords(place: string): string {
  const slug = place.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  return tOptional(`conservation.place.${slug}`) ?? place;
}

export function rankInWords(rank: string): string | null {
  const clean = rank.trim().toUpperCase();
  if (IUCN.includes(clean)) return t(`conservation.words.${clean}` as TKey);
  // Strip the qualifiers that follow a rank for migratory animals — `S3B` is
  // the breeding population's rank, and "breeding" is a distinction this app
  // has nowhere to put.
  const digits = clean.replace(/[^GNS1-5]/g, "").match(/[1-5]/g);
  if (!digits?.length) return null;
  const words = [...new Set(digits.map((d) => t(`conservation.words.${d}` as TKey)))];
  if (words.length === 1) return words[0];
  return t("conservation.span", { from: words[0], to: words[words.length - 1] });
}
