// The parts of the page that live in `index.html` rather than in a step: the
// skip link, the offline badge, the nav labels, the footer, and the footer's
// language/units summary.
//
// They're static markup on purpose — they must show even if a render throws —
// so they ship in English and are re-stamped from the dictionary on boot and
// again on every language or units change. The HTML is the fallback, not the
// source of truth.
import { el } from "../ui";
import { t, tx, getLang, LANGUAGES } from "../lib/i18n";
import { getUnits } from "../lib/units";

/** Fill everything outside `#main` with the active language's words. */
export function renderChrome(): void {
  document.title = t("app.title");

  const skip = document.getElementById("skip-link");
  if (skip) skip.textContent = t("app.skipToContent");

  const badge = document.getElementById("offline-badge");
  if (badge) badge.textContent = t("app.offline");

  const nav = document.getElementById("site-nav");
  nav?.setAttribute("aria-label", t("nav.sections"));
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((elm) => {
    // Only keys we know are stamped; an unknown one is left as authored so a
    // stale attribute degrades to English rather than to an empty element.
    const key = elm.dataset.i18n;
    if (key) elm.textContent = t(key as Parameters<typeof t>[0]);
  });

  const menuBtn = document.querySelector<HTMLElement>("#app-menu .nav-menu-btn");
  menuBtn?.setAttribute("aria-label", t("nav.menu"));
  document.getElementById("app-menu-panel")?.setAttribute("aria-label", t("nav.menu"));
  document.getElementById("steps-rail")?.setAttribute("aria-label", t("steps.progress"));

  // Keep the share card's locale honest for anything that renders the page
  // before reading it. The static value in index.html is what a crawler that
  // doesn't run JS gets; this is for the ones that do.
  document
    .querySelector('meta[property="og:locale"]')
    ?.setAttribute("content", getLang());

  renderFooter();
}

function renderFooter(): void {
  const p = document.getElementById("footer-text");
  if (p) {
    // The release-notes link is a real path, not a hash route, and Vite has
    // already substituted %BASE_URL% into the markup — so read the href off
    // the existing anchor rather than rebuilding it and getting the base wrong.
    const existingNotes = p.querySelector<HTMLAnchorElement>('a[href$="release-notes/"]');
    p.replaceChildren(
      ...tx("footer.text", {
        sources: el("a", { href: "#/sources" }, t("footer.sources")),
        about: el("a", { href: "#/about" }, t("footer.about")),
        releaseNotes: el(
          "a",
          { href: existingNotes?.getAttribute("href") ?? "release-notes/" },
          t("footer.releaseNotes")
        ),
        privacy: el("a", { href: "#/privacy" }, t("footer.privacy")),
      })
    );
  }

  // Two links, two labels. The visible text is the *value* ("Français"), and
  // the accessible name adds the setting it belongs to ("Langue : Français") —
  // sighted readers get the icon for that half, and a screen reader shouldn't
  // have to guess what a bare "Français" at the end of a page is offering.
  stampPref("prefs-lang", "prefs-lang-link", langLabel(), t("settings.language"));
  stampPref("prefs-units", "prefs-units-link", unitsLabel(), t("settings.units"));
}

function stampPref(textId: string, linkId: string, value: string, setting: string): void {
  const span = document.getElementById(textId);
  if (span) span.textContent = value;
  document.getElementById(linkId)?.setAttribute("aria-label", `${setting}: ${value}`);
}

/** "Français" — the active language, in its own name. */
export function langLabel(): string {
  return LANGUAGES.find((l) => l.code === getLang())?.endonym ?? getLang();
}

/** "Métrique" — the active unit system, in the active language. */
export function unitsLabel(): string {
  return t(getUnits() === "metric" ? "settings.units.metric" : "settings.units.imperial");
}
