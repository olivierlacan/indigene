// "Says who, and when?" — the check behind the words "native here".
//
// A plant row has always carried `basis`, the authority it was written from,
// and the page has always printed it. That is the right citation and it has one
// weakness: it is a sentence somebody typed. It cannot go out of date visibly,
// and a reader has no way to tell whether anybody has looked since.
//
// `npm run native:check` re-asks Kew's World Checklist about every row in a
// region and commits the answer with a date; `npm run native-evidence` reduces
// those to the table imported here. So the page can say *checked against a
// named authority, on a date* — and, where the checklist disagrees, say that
// instead of quietly showing agreement.
//
// **The table stores only the disagreements.** 592 rows, 12 of which WCVP does
// not confirm. A verdict per plant would be ~18 KB of a file that is 98% one
// value. A plant in a checked region that is absent from `unconfirmed` came
// back native — same information, a twentieth of the size. See
// `scripts/build-native-evidence.mjs`.
//
// **A disagreement is not a correction.** Kew is a world checklist and a
// regional flora is not; where they differ the row still ships and the page
// shows both, which is the call `data/sources/wcvp/README.md` already records
// for Ireland's Lusitanian element. Nothing here filters or ranks a plant.
import TABLE from "../data/native-evidence.json";
import { getLang } from "./i18n";

/** Why the checklist didn't confirm a row — each has its own sentence. */
export type Unconfirmed = "introduced" | "absent" | "unmatched" | "inconclusive";

export interface NativeEvidence {
  /** The place the check was about, in the reader's language — "Michigan",
   *  "la Californie". Which places were asked about is a property of the check,
   *  so both wordings ship with the data rather than sitting in `locales/`. */
  area: string;
  /** True when that place is wider than the region, so the check is a floor
   *  rather than a verdict: TDWG has one area for all of California. */
  coarse: boolean;
  /** ISO date the region was last re-asked. */
  checked: string;
  /** Null when the checklist confirmed it, otherwise why it didn't. */
  unconfirmed: Unconfirmed | null;
}

const REGIONS = TABLE.regions as Record<
  string,
  {
    area: Record<string, string>;
    coarse: boolean;
    checked: string;
    rows: number;
    unconfirmed: Record<string, string>;
  }
>;

export const NATIVE_EVIDENCE_SOURCE = TABLE.source;
export const NATIVE_EVIDENCE_URL = TABLE.url;

/**
 * What the checklist said about this plant, in this region — or null where the
 * region has never been checked, which is the honest answer and not "confirmed".
 */
export function nativeEvidence(plantId: string, regionId: string | undefined): NativeEvidence | null {
  if (!regionId) return null;
  const region = REGIONS[regionId];
  if (!region) return null;
  const reason = region.unconfirmed[plantId];
  return {
    area: region.area[getLang()] ?? region.area.en,
    coarse: region.coarse,
    checked: region.checked,
    unconfirmed: (reason as Unconfirmed) ?? null,
  };
}
