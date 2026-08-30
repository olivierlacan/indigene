// "Somebody has assessed this one, and it isn't doing well."
//
// One quiet line, on the eleven pages that have anything to say. Deliberately
// not a badge: a red pill reading ENDANGERED beside a plant we are recommending
// is an invitation to go and find one, and the wild population is exactly what
// such a rank exists to protect. So it is a sentence, and it ends by saying what
// to do instead.
//
// Kept short on purpose. The rank is printed as published (`S2`, `G3G4`, `EN`)
// beside its plain meaning — the code is what a reader can search for, the words
// are what they can understand. Everything a rank *is* — who publishes it, how
// the letters and numbers read, why it only appears where it means something —
// lives once at /guide/conservation, which the last link points to, rather than
// on every page that carries a rank. See `lib/conservation.ts` for the scoping.
import { el } from "../ui";
import { conservationFor, placeInWords, rankInWords, type Assessment } from "../lib/conservation";
import { t } from "../lib/i18n";

// The one page that explains what a rank means, built by `scripts/build-guide.mjs`.
// A real path (like the footer's), so the base Vite resolved is honoured.
const GUIDE_HREF = `${import.meta.env.BASE_URL}guide/conservation/`;

/** The rank in plain words with the code beside it — "imperiled (S2)" — or just
 *  the code where we have no wording for it. */
function said(a: Assessment): string {
  const words = rankInWords(a.rank);
  return words ? t("conservation.rank", { words, rank: a.rank }) : a.rank;
}

/** First letter upper-cased, for a status that opens its sentence. The rank
 *  words are stored lower-case so they also read mid-sentence. */
const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * The note for a plant or an animal, or null when nothing has been assessed —
 * which is the usual case, and why every caller can append the result blindly.
 *
 * `regionId` is the region the page is showing: a rank belongs to a place, and
 * the only regional one that may appear here is the one for this region's own
 * state or province.
 *
 * `kind` decides the advice, and it is not a detail: "buy it from a nursery" is
 * the answer for a rare plant and nonsense for a rare tortoise. What an animal
 * needs from a reader of this app is the planting.
 */
export function conservationNote(
  subjectId: string,
  regionId?: string,
  kind: "plant" | "animal" = "plant",
): HTMLElement | null {
  const { global, here } = conservationFor(subjectId, regionId);
  if (!global && !here) return null;

  const lines: (string | Node)[] = [];
  // "Vulnerable (G3) worldwide." — the status leads, capitalised.
  if (global) {
    lines.push(el("strong", {}, t("conservation.globally", { status: cap(said(global)) })));
  }
  // "In Florida, vulnerable to apparently secure (S3S4)." — the place leads, so
  // the status stays lower-case whether this stands alone or follows the global.
  if (here) {
    if (lines.length) lines.push(" ");
    lines.push(el("strong", {}, t("conservation.here", { place: placeInWords(here.place ?? ""), status: said(here) })));
  }
  // The action — said every time, because the fact above is the reason somebody
  // might do the wrong thing with it. Differs by kind.
  const advice = kind === "animal" ? "conservation.plantForIt" : "conservation.buyNursery";
  lines.push(" ", el("span", { class: "conservation-buy" }, t(advice)));
  // Where the ranks and their authorities are explained, once for every page.
  lines.push(" ", el("a", { class: "conservation-more", href: GUIDE_HREF }, t("conservation.learnMore")));

  return el("p", { class: "note conservation-note" }, lines);
}
