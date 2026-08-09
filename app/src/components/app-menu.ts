// The header's menu — the ⚙️ button and the panel it drops down.
//
// It started life as a Saved-locations menu: saved spots used to be a third
// top-level nav tab, and on a phone that pushed the header past its width. It
// is now the app's general menu, because it is the only spare surface in a
// header measured to the pixel (see the ≤500px rules in styles.css — title +
// four items with ~25 px of slack at 360 px). Anything that should be reachable
// from every page without owning a tab belongs here. Today that's four rows, in
// this order:
//
//   1. What's new, first, because it's the row that wears the "something landed
//      since you were last here" dot — and a menu you opened to check that
//      shouldn't make you read past two settings to find it.
//   2. Saved spots, as a way through to the Saved page.
//   3–4. Language and units, one row each — the settings most likely to be
//      wanted by someone who can't read the page they're looking at, and
//      therefore the ones worst served by living only at the bottom of it.
//
// ## Why the panel no longer lists the spots themselves
//
// It used to show up to six saved spots inline, each a button that reopened
// that spot. That made the menu the only asynchronous thing in the header: it
// had to open the database on every press, and therefore had to have a loading
// state, an error state with a retry, and an empty state — three screens' worth
// of behaviour, inside a dropdown, for a list the Saved page already shows
// better. A link costs one row and is right on the first frame.
//
// The reopen-a-spot gesture isn't lost, it moved: it lives on the Saved page,
// which is where managing and deleting already were, so there is one place that
// does all of it rather than a fast path that does some of it.
//
// The icon follows the contents: a bookmark promised saved spots and nothing
// else, so it became a gear as soon as the panel held two unlike things.
//
// A plain button + panel (not <details>) so there's no UA disclosure marker to
// fight and we control open/close: refresh on open, close on outside-click, on
// Escape, on selection, and on navigation (the router calls closeAppMenu).
import { el } from "../ui";
import { t } from "../lib/i18n";
import { langLabel, unitsLabel } from "./chrome";
import { hasUnseenRelease } from "../lib/visits";
import { isHomeScreenApp } from "../lib/standalone";
import { newDot } from "./new-dot";

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
  fill(panel);
}

/** Close the menu if it's open — also called by the router on every navigation. */
export function closeAppMenu(): void {
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "false");
  panel.hidden = true;
}

/**
 * One row of the panel: an icon, a label, and optionally the "there's something
 * new" dot.
 *
 * The two settings rows show their current *value* rather than the word
 * "Settings", for the reader they're really for: someone looking at a page in a
 * language they don't read recognises "English" as the thing to press long
 * before they parse a label they can't read either. The icon carries the other
 * half of the meaning, and `label` spells out both for the accessible name —
 * which is why a row whose visible text is already its own full name (What's
 * new, Saved spots) passes no `label` at all rather than repeating itself.
 */
function row(
  href: string,
  icon: string,
  text: string,
  { label, divide = false, dot = false }: { label?: string; divide?: boolean; dot?: boolean } = {}
): HTMLElement {
  return el(
    "a",
    {
      href,
      role: "menuitem",
      class: divide ? "nav-menu-pref nav-menu-divide" : "nav-menu-pref",
      ...(label ? { "aria-label": label } : {}),
    },
    [
      el("span", { class: "nav-menu-pref-icon", "aria-hidden": "true" }, icon),
      text,
      ...(dot ? [newDot()] : []),
    ]
  );
}

/**
 * The whole panel, drawn on every open so the dot and the two setting values
 * are current. Synchronous — nothing here waits on storage.
 *
 * What's new is a real path, not a hash route: the notes are their own page.
 * The base is read off the footer's existing link, which Vite has already
 * resolved, for the same reason `chrome.ts` does it — rebuilding it here would
 * get the base wrong on a project Pages site.
 */
function fill(target: HTMLElement): void {
  const notesHref =
    document
      .querySelector<HTMLAnchorElement>('#footer-text a[href$="release-notes/"]')
      ?.getAttribute("href") ?? "release-notes/";
  target.replaceChildren(
    row(notesHref, "✨", t("footer.releaseNotes"), { dot: hasUnseenRelease() }),
    row("#/saved", "🔖", t("nav.savedLocations")),
    // The accessible name is the whole phrase — "Language: English" — from the
    // dictionary rather than glued together here with a colon, because the
    // punctuation around a colon is a language's own business (French wants a
    // space before it). These are the same two keys the footer uses.
    row("#/settings/language", "🌐", langLabel(), {
      label: t("footer.languageIs", { value: langLabel() }),
      divide: true,
    }),
    row("#/settings/units", "📏", unitsLabel(), {
      label: t("footer.unitsIs", { value: unitsLabel() }),
    }),
    // Last, and only on a Home Screen app, where the browser's own reload
    // button isn't there to be reached for. The pull-down gesture
    // (components/pull-to-reload.ts) is the fast way to the same thing; this is
    // the way that asks nothing of your hands.
    ...(isHomeScreenApp() ? [reloadRow()] : [])
  );
}

/** Reload, as a button: it acts on the page you're on rather than going
 *  anywhere, so it isn't a link. */
function reloadRow(): HTMLElement {
  return el(
    "button",
    {
      type: "button",
      role: "menuitem",
      class: "nav-menu-pref nav-menu-divide",
      onClick: () => location.reload(),
    },
    [el("span", { class: "nav-menu-pref-icon", "aria-hidden": "true" }, "🔄"), t("nav.reload")]
  );
}
