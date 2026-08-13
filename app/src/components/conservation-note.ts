// "Somebody has assessed this one, and it isn't doing well."
//
// One line, on the eleven pages that have anything to say. Deliberately not a
// badge: a red pill reading ENDANGERED beside a plant we are recommending is an
// invitation to go and find one, and the wild population is exactly what such a
// rank exists to protect. So it is a sentence, it names who says so, and it ends
// by saying where to get the plant instead.
//
// The rank is printed as published (`S2`, `G3G4`, `EN`) next to its plain
// meaning, because the code is what a reader can search for and check, and the
// words are what they can understand without looking anything up. See
// `lib/conservation.ts` for why only two kinds of assessment reach this at all.
import { el } from "../ui";
import { conservationFor, placeInWords, rankInWords, type Assessment } from "../lib/conservation";
import { t } from "../lib/i18n";

/** The rank in plain words with the code beside it — "imperiled (S2)" — or just
 *  the code where we have no wording for it. */
function said(a: Assessment): string {
  const words = rankInWords(a.rank);
  return words ? t("conservation.rank", { words, rank: a.rank }) : a.rank;
}

/**
 * The note for a plant or an animal, or null when nothing has been assessed —
 * which is the usual case, and why every caller can append the result blindly.
 *
 * `regionId` is the region the page is showing: a rank belongs to a place, and
 * the only regional one that may appear here is the one for this region's own
 * state or province.
 *
 * `kind` decides the last sentence, and it is not a detail: "buy it from a
 * nursery" is the answer for a rare plant and nonsense for a rare tortoise.
 * What an animal needs from a reader of this app is the planting.
 */
export function conservationNote(
  subjectId: string,
  regionId?: string,
  kind: "plant" | "animal" = "plant",
): HTMLElement | null {
  const { global, here } = conservationFor(subjectId, regionId);
  if (!global && !here) return null;

  const lines: (string | Node)[] = [];
  if (global) {
    lines.push(el("strong", {}, t("conservation.globally", { status: said(global) })));
    if (global.authority) lines.push(` ${t("conservation.by", { authority: global.authority })}`);
  }
  if (here) {
    if (lines.length) lines.push(" ");
    lines.push(el("strong", {}, t("conservation.here", { status: said(here), place: placeInWords(here.place ?? "") })));
    if (here.authority) lines.push(` ${t("conservation.by", { authority: here.authority })}`);
  }
  // Said every time, because the fact above is the reason somebody might do the
  // wrong thing with it.
  const advice = kind === "animal" ? "conservation.plantForIt" : "conservation.buyNursery";
  lines.push(" ", el("span", { class: "conservation-buy" }, t(advice)));

  return el("p", { class: "note conservation-note" }, lines);
}
