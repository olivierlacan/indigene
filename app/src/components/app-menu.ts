// The header's menu — the ⚙️ button and the panel it drops down.
//
// It started life as a Saved-locations menu: saved spots used to be a third
// top-level nav tab, and on a phone that pushed the header past its width. It
// still holds those, but it is now the app's general menu, because it is the
// only spare surface in a header measured to the pixel (see the ≤500px rules in
// styles.css — title + four items with ~25 px of slack at 360 px). Anything
// that should be reachable from every page without owning a tab belongs here.
// Today that's two things:
//
//   1. Your saved spots, as a quick jump back without leaving for the full
//      Saved page (which stays, for managing and deleting).
//   2. Language and units, one row each — the settings most likely to be
//      wanted by someone who can't read the page they're looking at, and
//      therefore the ones worst served by living only at the bottom of it.
//
// The icon follows the contents: a bookmark promised saved spots and nothing
// else, so it became a gear as soon as the panel held two unlike things.
//
// A plain button + panel (not <details>) so there's no UA disclosure marker to
// fight and we control open/close: refresh on open, close on outside-click, on
// Escape, on selection, and on navigation (the router calls closeAppMenu).
import { el } from "../ui";
import { listSpots } from "../db";
import { openSavedSpot } from "../state";
import { t } from "../lib/i18n";
import { langLabel, unitsLabel } from "./chrome";

const MAX_IN_MENU = 6;

let btn: HTMLButtonElement | null = null;
let panel: HTMLElement | null = null;

export function initAppMenu(): void {
  btn = document.querySelector<HTMLButtonElement>("#app-menu .nav-menu-btn");
  panel = document.getElementById("app-menu-panel");
  if (!btn || !panel) return;

  btn.addEventListener("click", () => {
    isOpen() ? closeAppMenu() : openMenu();
  });

  // Click outside the menu closes it.
  document.addEventListener("click", (e) => {
    const menu = document.getElementById("app-menu");
    if (isOpen() && menu && !menu.contains(e.target as Node)) closeAppMenu();
  });

  // Escape closes and returns focus to the button.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      closeAppMenu();
      btn?.focus();
    }
  });
}

function isOpen(): boolean {
  return btn?.getAttribute("aria-expanded") === "true";
}

function openMenu(): void {
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "true");
  panel.hidden = false;
  void populate(panel);
}

/** Close the menu if it's open — also called by the router on every navigation. */
export function closeAppMenu(): void {
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "false");
  panel.hidden = true;
}

/**
 * The language and units rows at the foot of the panel — two of them, matching
 * the footer, because they are two settings and not one "locale". A single
 * "English · Imperial" line invites exactly the assumption the app spends a
 * whole comment block in `prefs-controls.ts` refusing to make.
 *
 * Each shows its current *value* rather than the word "Settings", for the
 * reader these rows are really for: someone looking at a page in a language
 * they don't read recognises "English" as the thing to press long before they
 * parse a label they can't read either. The icon carries the other half of the
 * meaning, and the accessible name spells out both.
 */
function prefRow(
  href: string,
  icon: string,
  value: string,
  setting: string,
  divide: boolean
): HTMLElement {
  return el(
    "a",
    {
      href,
      role: "menuitem",
      class: divide ? "nav-menu-pref nav-menu-divide" : "nav-menu-pref",
      "aria-label": `${setting}: ${value}`,
    },
    [el("span", { class: "nav-menu-pref-icon", "aria-hidden": "true" }, icon), value]
  );
}

/** Whatever the saved-spots lookup produced, then the two prefs rows — which
 *  are in the panel in every state, including while the database is still
 *  answering. Only the first carries the rule that divides them from above. */
function fill(target: HTMLElement, ...saved: Node[]): void {
  target.replaceChildren(
    ...saved,
    prefRow("#/settings/language", "🌐", langLabel(), t("settings.language"), true),
    prefRow("#/settings/units", "📏", unitsLabel(), t("settings.units"), false)
  );
}

async function populate(target: HTMLElement): Promise<void> {
  fill(target, el("p", { class: "nav-menu-status" }, t("savedMenu.loading")));
  const spots = await listSpots().catch(() => null);
  if (target.hidden) return; // closed again before the load finished

  if (spots === null) {
    // Storage answered with an error or not at all (db.open has a watchdog,
    // so this settles within a couple of seconds either way). Leave a way
    // back in: retrying re-opens the database from scratch.
    fill(
      target,
      el("p", { class: "nav-menu-status" }, t("savedMenu.error")),
      el("button", {
        type: "button",
        role: "menuitem",
        class: "nav-menu-all",
        onClick: () => void populate(target),
      }, t("savedMenu.retry")),
    );
    return;
  }
  if (!spots.length) {
    fill(
      target,
      el("p", { class: "nav-menu-status" }, t("savedMenu.empty")),
      el("a", { href: "#/location", role: "menuitem", class: "nav-menu-all" }, t("savedMenu.findSpot")),
    );
    return;
  }

  const items = spots.slice(0, MAX_IN_MENU).map((s) =>
    el("button", {
      type: "button",
      role: "menuitem",
      class: "nav-menu-item",
      onClick: () => {
        closeAppMenu();
        openSavedSpot(s);
      },
    }, [
      el("span", { class: "nav-menu-item-label" }, s.label),
      el("span", { class: "nav-menu-item-sub" }, `${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}`),
    ])
  );

  // The heading earns its place only here: with spots above it and a language
  // row below, the panel holds two unlike things and has to say which is which.
  // The empty and error states already name themselves in a sentence.
  fill(
    target,
    el("p", { class: "nav-menu-heading" }, t("nav.savedLocations")),
    ...items,
    el("a", { href: "#/saved", role: "menuitem", class: "nav-menu-all" },
      spots.length > MAX_IN_MENU ? t("savedMenu.seeAll", { n: spots.length }) : t("savedMenu.manage")),
  );
}
