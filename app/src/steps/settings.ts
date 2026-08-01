// Settings: how the app reads, and what it remembers.
//
// Two halves, in that order. **How it reads** — language and units, two
// independent choices (see the note in `prefs-controls.ts` for why they're two
// cards and not one). **What it remembers** — the last spot, the starting
// region, the ranking goal, and when you last read the release notes, each
// spelled out with the button that undoes it (`components/memory-controls.ts`).
//
// The second half is what lets the flow stay quiet. A step that reuses a
// remembered answer says so in one line and points here; the full account of
// what's stored lives on this page, once, instead of being re-read in a garden
// every visit.
//
// Every card is addressable — `#/settings/language`, `#/settings/units`,
// `#/settings/spot`, `#/settings/region`, `#/settings/goal`,
// `#/settings/whatsnew` — so a link can land on the thing it names instead of
// dropping the reader at the top of the page to hunt for it.
import { el, clear } from "../ui";
import { t } from "../lib/i18n";
import { languageCard, unitsCard } from "../components/prefs-controls";
import {
  lastSpotCard,
  rankingGoalCard,
  startingRegionCard,
  whatsNewCard,
} from "../components/memory-controls";
import { stickyReady } from "../lib/sticky";
import { prefsReady } from "../state";

/** The cards a `#/settings/<param>` link can ask for, by their route word. */
const CARD_IDS: Record<string, string> = {
  language: "settings-language",
  units: "settings-units",
  spot: "settings-spot",
  region: "settings-region",
  goal: "settings-goal",
  whatsnew: "settings-whatsnew",
};

export async function renderSettings(main: HTMLElement, param?: string): Promise<void> {
  // Four of the six cards report what's stored on this device, and the two
  // background reads that fill them (the spot and the ranking weights) are
  // separate. Wait for both: a settings screen that says "nothing remembered"
  // or names the wrong goal because it drew a few milliseconds early is worse
  // than a beat of delay. Both are bounded by the db module's open watchdog.
  // The fourth card needs no wait at all — it reads localStorage, which answers
  // at once (see `lib/visits.ts`).
  await Promise.all([stickyReady(), prefsReady()]);
  clear(main);
  const cards: Record<string, HTMLElement> = {
    language: languageCard(),
    units: unitsCard(),
    spot: lastSpotCard(),
    region: startingRegionCard(),
    goal: rankingGoalCard(),
    whatsnew: whatsNewCard(),
  };
  for (const [key, card] of Object.entries(cards)) card.id = CARD_IDS[key];

  main.append(
    el("h2", { class: "step-title" }, t("settings.title")),
    el("p", { class: "step-lede" }, t("settings.lede")),
    el("h3", { class: "settings-group" }, t("settings.readingTitle")),
    cards.language,
    cards.units,
    el("h3", { class: "settings-group" }, t("settings.memoryTitle")),
    el("p", { class: "step-lede" }, t("settings.memoryLede")),
    cards.spot,
    cards.region,
    cards.goal,
    cards.whatsnew,
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
