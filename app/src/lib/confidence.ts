// How sure we are of a plant's figures — worked out, not typed.
//
// The level used to be a word each region's author picked row by row, with no
// rule behind it, and the rows showed it: the same "genus, NWF/Tallamy" citation
// was high in one list and medium in the next, and 150 rows rated high called
// their own caterpillar count an estimate. Now a row records *where its count
// came from* (`hostCountFrom`), and the level follows from that and from the
// citation itself. Two people given the same row get the same answer.
//
// The caterpillar count is the axis because it is the figure that varies most
// between rows and the one the ranking leans on hardest. The 0–100 scores are
// our judgment on every plant alike, so they can't tell one row from another.
//
// The rule, firmest first:
//
//   counted    a dataset counted it for this region   → high
//   published  a published genus count, used as is   → medium
//   estimated  our figure, usually carried over from  → medium
//              another region or a relative
//   rough      flagged rough by the row itself        → low
//   none       no source for the count at all         → low
//
// Then two caps, which only ever lower it:
//
//   - a row whose `basis` names no source for native status is low;
//   - `confidenceLowered` sets it lower for a reason the row gives in words
//     ("Confidence medium: Irish plants are a prostrate form…").
//
// What the reader sees of this is `#/confidence` (steps/confidence.ts).
import type { Confidence, HostCountFrom } from "../types";

const FROM_LEVEL: Record<HostCountFrom, Confidence> = {
  counted: "high",
  published: "medium",
  estimated: "medium",
  rough: "low",
  none: "low",
};

const ORDER: Confidence[] = ["low", "medium", "high"];
const lower = (a: Confidence, b: Confidence): Confidence =>
  ORDER.indexOf(a) <= ORDER.indexOf(b) ? a : b;

/**
 * The native-status references a `basis` can cite. A name on this list means
 * the row says *who* calls the plant native here; a row that names none of them
 * is asking to be believed, and is rated low until it cites one.
 */
const NATIVE_REFERENCES = [
  /native status/i,
  /\bendemic\b/i,
  /\bWCVP\b/,
  /\bKew\b/,
  /\bUSDA PLANTS\b/,
  /\bJepson\b/,
  /\bCalflora\b/,
  /\bOregonFlora\b/,
  /\bMichigan Flora\b/,
  /\bAtlas of Florida\b/,
  /\bBDTFX\b/,
  /\bINPN\b/,
  /\bWildflower Center\b/,
];

export function citesNativeStatus(basis: string): boolean {
  return NATIVE_REFERENCES.some((re) => re.test(basis));
}

/** The sentence a lowered row must carry, so the reason is on the page. */
export const LOWERED_REASON = /\bConfidence (?:is )?(medium|low)\b/;

export interface ConfidenceEvidence {
  hostCountFrom: HostCountFrom;
  basis: string;
  confidenceLowered?: "medium" | "low";
}

export function confidenceFor(p: ConfidenceEvidence): Confidence {
  let level = FROM_LEVEL[p.hostCountFrom];
  if (!citesNativeStatus(p.basis)) level = "low";
  if (p.confidenceLowered) level = lower(level, p.confidenceLowered);
  return level;
}
