// Whether a plant's caterpillar count is its own or its genus's. Most counts
// are published per genus — Tallamy/NWF in the US, the Gaytán matrix in
// Europe — so every willow in a region reads the same number. The plant page
// says so beside the figure rather than letting it pass as a species count.
//
// Read from the row's `basis` ("… Host count: willow genus, top western host
// (Tallamy/NWF)."), because that sentence is where each row says what its
// number is. "No published count for the genus" names a genus and is not a
// genus count, so it doesn't qualify.
import type { Plant } from "../types";

/** The "Host count: …" sentence of a basis, or "" if it has none. */
function hostSentence(basis: string): string {
  const m = /Host count:([^]*?)(?:\.\s+[A-Z][a-z/ ]+:|\.?$)/.exec(basis);
  return m ? m[1] : "";
}

/** True when the plant's `hostLepCount` is a figure for its whole genus. */
export function hostCountIsGenus(p: Pick<Plant, "basis" | "hostLepCount">): boolean {
  if (p.hostLepCount === null) return false;
  const s = hostSentence(p.basis);
  if (/no published count/i.test(s)) return false;
  return /\bgenus\b/i.test(s) || /Gayt[aá]n/.test(s);
}

/** The genus a binomial belongs to: "Salix scouleriana" → "Salix". */
export function genusOf(latin: string): string {
  return latin.split(/\s+/)[0] ?? latin;
}
