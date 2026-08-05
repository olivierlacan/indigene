// A card heading that is also that card's address.
//
// A plant's page is long — six cards on a phone, five screenfuls of scrolling —
// and until now the only address it had was the whole of it. Someone answering
// "how do I grow more of these?" could send the page and then have to say
// "scroll down a bit", which is the internet's oldest small unkindness.
//
// The link is a fragment on the page's own canonical path —
// `…/plants/<slug>#nearby` — so the address that names one card is still the
// address of a real prerendered file, and pasting it anywhere shows the plant's
// own share card. See `plantSectionHref` in lib/routes.ts. This draws the mark
// that hands it over.
//
// The `#` is drawn at rest, not on hover — the same reasoning as
// `components/section-link.ts`. A phone has no hover, and a link nobody can see
// is a link nobody has. It sits at the reader's-eye edge of the heading in the
// quiet ink, and takes the brand colour when a pointer or the keyboard reaches
// it.
//
// Nothing here handles the click: `steps/plant.ts` listens for these on the page
// and answers in place (scroll only if needed, flash the card, copy the link),
// because a full re-render to move the page a few hundred pixels would throw
// away the hero photograph and every loaded thumbnail below it.
import { el } from "../ui";

/**
 * @param text The heading itself, emoji and all.
 * @param href The section's own address — the fragment `#<section>`.
 * @param label The link's accessible name; it says what activating it does,
 *   because "#" says nothing at all.
 */
export function anchoredHeading(text: string, href: string, label: string): HTMLElement {
  return el("h3", { class: "card-head" }, [
    el("span", { class: "card-head-text" }, text),
    el("a", { class: "anchor-link", href, "aria-label": label, title: label }, [
      el("span", { "aria-hidden": "true" }, "#"),
    ]),
  ]);
}
