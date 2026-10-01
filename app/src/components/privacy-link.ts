// A tiny shared link to the Privacy & safety page (`steps/privacy.ts`, route
// `#/privacy`). Used wherever the app does something a thoughtful person — or a
// parent — might pause over: asking for location, saving a spot. Keeping the
// route and the wording here means every one of those reassurances points at the
// same page and reads the same way.
import { el } from "../ui";
import { t } from "../lib/i18n";

/** The in-app route for the Privacy & safety page. */
export const PRIVACY_ROUTE = "#/privacy";

/** The page's linkable sections, by the word that addresses them —
 *  `#/privacy/lookups` opens it at "Who your browser talks to". The page owns
 *  the word → heading mapping (`steps/privacy.ts`); this type is the contract. */
export type PrivacySection =
  | "location"
  | "lookups"
  | "saved"
  | "log"
  | "inat"
  | "whatsnew"
  | "counting"
  | "film"
  | "children";

/** The route for one section of the page, or the page itself. */
export function privacyRoute(section?: PrivacySection): string {
  return section ? `${PRIVACY_ROUTE}/${section}` : PRIVACY_ROUTE;
}

/**
 * A quiet, one-line reassurance with a lock glyph and a link to the full page —
 * meant to sit right under the control it's about (a location button, a save
 * button). `lead` is the plain-words promise; the link carries the details.
 */
export function privacyNote(
  lead: string,
  linkText = t("privacy.howHandled"),
  /** Open the page at the section that answers *this* control's question,
   *  rather than at the top of a long document. */
  section?: PrivacySection
): HTMLElement {
  return el("p", { class: "privacy-note" }, [
    el("span", { "aria-hidden": "true" }, "🔒 "),
    `${lead} `,
    el("a", { href: privacyRoute(section) }, linkText),
    ".",
  ]);
}
