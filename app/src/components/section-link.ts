// A section heading that is also the door into that section's own page: a
// roster's category ("Grasses & sedges"), a wildlife group ("Butterflies"), a
// region on an animal's page.
//
// It used to be a bare `<a>` inside the `<h3>`, which meant the browser's
// default underline — a heavy rule running under the leading icon and the
// trailing "(7)", starting before the words and ending after a bracket, on
// every heading down the page. The mark is now a chevron pointing the way the
// tap goes, in the brand green, with the count as a quiet pill instead of a
// parenthetical. It's drawn at rest, not on hover: a phone has no hover, and
// the affordance is the whole point.
//
// See `.section-head` / `.section-link` in styles.css.
import { el } from "../ui";

/**
 * @param icon Drawn beside the label — a silhouette SVG or an emoji. Decorative
 *   either way; the label carries the meaning.
 * @param count Already formatted for the reader's locale (`fmtNumber`), or
 *   omitted where the section has nothing to count.
 */
export function sectionHeading(
  href: string,
  icon: Node | string | null,
  label: string,
  count?: string
): HTMLElement {
  return el("h3", { class: "section-head" }, [
    el("a", { class: "section-link", href }, [
      icon ? el("span", { class: "section-link-icon", "aria-hidden": "true" }, [icon]) : null,
      el("span", { class: "section-link-label" }, label),
      count != null ? el("span", { class: "section-count" }, count) : null,
    ]),
  ]);
}
