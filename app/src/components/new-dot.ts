// The small green dot that says "something has landed since you were last
// here" — beside *What's new* in the header's ⚙️ menu, and beside the same
// words in the footer.
//
// Both are ways into one destination, and both clear together: they read the
// same memory (`lib/visits.ts`), and it's the What's new page — not either of
// them — that marks the releases seen.
//
// ## Not on the gear
//
// The obvious place for a badge is the gear itself, so it can be seen without
// opening anything. It was there and it's been taken off: on a header filled
// with brand green, a mark on a 16–18px emoji reads as a smudge on the header
// rather than a badge on a control, whether it's tucked into a corner or
// centred on the hub. The cost is real — nothing now says "something's new"
// until you open the menu or reach the footer — and it was the right trade
// anyway, because a badge nobody can parse isn't a signal, it's noise on every
// screen in the app.
//
// The dot is never the only thing carrying the meaning. It's a colour and a
// shape, so it says nothing to a screen reader and nothing to a reader who
// can't tell green from grey: every dot ships with the words beside it,
// visually hidden and read aloud as part of the link's own name.
import { el } from "../ui";
import { t } from "../lib/i18n";

/**
 * A dot plus its explanation, for placing inside a link or a row of text.
 *
 * The words are in the DOM rather than an `aria-label` so they're part of the
 * link's own accessible name — "See what's new, new since your last visit" —
 * which is what a screen-reader user hears when tabbing through the footer.
 */
export function newDot(): HTMLElement {
  return el("span", { class: "new-dot-wrap" }, [
    el("span", { class: "new-dot", "aria-hidden": "true" }),
    el("span", { class: "sr-only" }, t("whatsNew.sinceLastVisit")),
  ]);
}
