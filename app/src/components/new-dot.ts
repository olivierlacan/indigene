// The small green dot that says "something has landed since you were last
// here" — on the header's gear, on the What's new row inside its menu, and on
// the footer's link to the same page.
//
// It appears in three places because they are three ways into one destination,
// and a dot on only one of them is a dot most people never see: the gear is on
// every screen and carries it without opening anything, the menu row is what
// you actually press, and the footer is where a reader who has scrolled to the
// end goes looking. All three clear together, because they read the same
// memory (`lib/visits.ts`) and it's the What's new page — not any of these —
// that marks the releases seen.
//
// The dot is never the only thing carrying the meaning. It's a colour and a
// shape, so it says nothing to a screen reader and nothing to a reader who
// can't tell green from grey: every dot ships with words beside it. On the two
// text rows the words are visually hidden and read aloud; on the gear, whose
// whole label is already "Menu", they go into the accessible name.
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

/**
 * Put the dot on the header's gear, or take it off.
 *
 * The gear is a fixed-width control in a header measured to the pixel (see the
 * ≤500px rules in styles.css), so the dot is positioned over it rather than
 * added to its flow — a badge that reflowed the header on the day a release
 * shipped would be a layout bug that only appears sometimes, which is the worst
 * kind. The button keeps its own label and gains a second sentence.
 */
export function markMenuButton(button: HTMLElement, unseen: boolean): void {
  button.classList.toggle("has-new", unseen);
  button.setAttribute(
    "aria-label",
    unseen ? `${t("nav.menu")}, ${t("whatsNew.sinceLastVisit")}` : t("nav.menu")
  );
}
