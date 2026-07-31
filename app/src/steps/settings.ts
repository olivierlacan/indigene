// Language & units.
//
// **This screen is deliberately a shell.** A fuller settings screen is being
// built separately; the two controls it hosts live in
// `components/prefs-controls.ts` so that screen can import them and this file
// can be deleted in one line. What must not disappear with it is the *pair* —
// language and units are two independent choices (see the note in
// `prefs-controls.ts` for why), and they need to stay reachable.
//
// It takes an optional param — `#/settings/language`, `#/settings/units` — so
// the footer's two links can land on the thing each one names instead of both
// dropping the reader at the top of the same page to hunt for the difference.
import { el, clear } from "../ui";
import { t } from "../lib/i18n";
import { languageCard, unitsCard } from "../components/prefs-controls";

/** The cards a `#/settings/<param>` link can ask for, by their route word. */
const CARD_IDS: Record<string, string> = {
  language: "settings-language",
  units: "settings-units",
};

export function renderSettings(main: HTMLElement, param?: string): void {
  clear(main);
  const language = languageCard();
  const units = unitsCard();
  language.id = CARD_IDS.language;
  units.id = CARD_IDS.units;

  main.append(
    el("h2", { class: "step-title" }, t("settings.title")),
    el("p", { class: "step-lede" }, t("settings.lede")),
    language,
    units,
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el(
        "button",
        { class: "btn btn-primary btn-block", onClick: () => history.back() },
        t("settings.done")
      ),
    ])
  );

  revealCard(param);
}

/**
 * Bring the asked-for card into view.
 *
 * Deferred by one frame on purpose: the router lands every page at the top and
 * moves focus into `#main` (`landAtTop`) *after* this function returns, so
 * scrolling now would simply be undone. One `requestAnimationFrame` puts us
 * after that, which is late enough to stick and early enough that nobody sees
 * the page move.
 *
 * An unknown param — a typo, an old link — is not an error worth a message:
 * `#/settings/whatever` is still the settings page, and it just opens at the
 * top like `#/settings` does.
 */
function revealCard(param?: string): void {
  const id = param ? CARD_IDS[param] : undefined;
  if (!id) return;
  requestAnimationFrame(() => {
    const card = document.getElementById(id);
    if (!card) return;
    // Only move the page if the card isn't already all there. The language card
    // is the first thing on this screen, so `#/settings/language` would
    // otherwise scroll the page's own title off the top to "reveal" something
    // the reader could already see.
    const box = card.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) card.scrollIntoView({ block: "start" });
    // Focus follows the scroll so a keyboard or screen-reader user arrives
    // where a sighted one is looking, and the next Tab lands in this card.
    card.setAttribute("tabindex", "-1");
    card.focus({ preventScroll: true });
  });
}
