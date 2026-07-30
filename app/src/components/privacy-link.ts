// A tiny shared link to the Privacy & safety page (`steps/privacy.ts`, route
// `#/privacy`). Used wherever the app does something a thoughtful person — or a
// parent — might pause over: asking for location, saving a spot. Keeping the
// route and the wording here means every one of those reassurances points at the
// same page and reads the same way.
import { el } from "../ui";
import { t } from "../lib/i18n";

/** The in-app route for the Privacy & safety page. */
export const PRIVACY_ROUTE = "#/privacy";

/**
 * A quiet, one-line reassurance with a lock glyph and a link to the full page —
 * meant to sit right under the control it's about (a location button, a save
 * button). `lead` is the plain-words promise; the link carries the details.
 */
export function privacyNote(lead: string, linkText = t("privacy.howHandled")): HTMLElement {
  return el("p", { class: "privacy-note" }, [
    el("span", { "aria-hidden": "true" }, "🔒 "),
    `${lead} `,
    el("a", { href: PRIVACY_ROUTE }, linkText),
    ".",
  ]);
}
