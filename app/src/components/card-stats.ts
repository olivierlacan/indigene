// The one-line "what this adds up to" row that sits at the **bottom** of a
// browse card — a region's card on Explore, a creature's card on Wildlife.
//
// Two rules, and they're the whole reason this is a shared component rather
// than markup repeated per page:
//
//  1. **Always at the bottom.** The blurbs above it are different lengths, so a
//     row that flows after the text lands somewhere different on every card and
//     the eye has to hunt for it. Pinned to the bottom (see `.card-stats`), it
//     is in the same place on every card in a row, and a column of cards reads
//     as a table.
//  2. **Icon and number only — the words live in the tooltip.** Spelling out
//     "44 natives · 6 keystones · 11 wildlife ties" wrapped onto two lines on a
//     phone, which cost a line of height on every card and made the row itself
//     ragged. `🌿 44` doesn't wrap. The meaning is still there for anyone who
//     wants it: a hover tooltip on a pointer, and the same sentence as the
//     accessible name for a screen reader.
import { el } from "../ui";

export interface CardStat {
  /** Emoji, or a factory for an inline SVG (the keystone arch). */
  icon: string | (() => Node);
  /** The figure itself — short, because the row must not wrap. */
  value: string;
  /** The full sentence: the tooltip on hover, and the accessible name. */
  label: string;
  /**
   * Makes this figure a real button rather than a hover tooltip: hovering
   * still shows `label`, but a tap opens whatever this does. For a figure a
   * phone user would otherwise have no way to read — there is no hover on a
   * touchscreen — or one with somewhere to go behind it (the wildlife card's
   * region count opens the list of regions, each a link).
   *
   * The button must not sit inside an `<a>`, so a card that uses one has to
   * stretch a link over itself instead of wrapping itself in one (see
   * `.wildlife-card`, `.region-card`).
   */
  onActivate?: () => void;
}

export function cardStats(stats: (CardStat | null)[]): HTMLElement {
  return el(
    "p",
    { class: "card-stats" },
    stats.filter((s): s is CardStat => s !== null).map((s) => {
      const parts = [
        el("span", { class: "card-stat-icon" }, [
          typeof s.icon === "string" ? document.createTextNode(s.icon) : s.icon(),
        ]),
        s.onActivate ? el("span", { class: "card-stat-tap" }, s.value) : document.createTextNode(s.value),
      ];
      if (!s.onActivate) {
        return el("span", { class: "card-stat", title: s.label, role: "img", "aria-label": s.label }, parts);
      }
      return el("button", {
        type: "button",
        class: "card-stat",
        title: s.label,
        "aria-haspopup": "dialog",
        "aria-label": s.label,
        onClick: (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          s.onActivate!();
        },
      }, parts);
    })
  );
}
