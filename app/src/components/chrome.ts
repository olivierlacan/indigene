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
import { hasUnseenRelease } from "../lib/visits";
import { newDot } from "./new-dot";

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
        // The dot rides inside the link, so the words it carries become part of
        // the link's own accessible name rather than a separate stop.
        releaseNotes: el(
          "a",
          { href: existingNotes?.getAttribute("href") ?? "release-notes/" },
          hasUnseenRelease()
            ? [t("footer.releaseNotes"), newDot()]
            : [t("footer.releaseNotes")]
        ),
        privacy: el("a", { href: "#/privacy" }, t("footer.privacy")),
      })
    );
  }

  // Two links, each naming its setting as well as its value: "Language:
  // English", not a bare "English" that leaves you to work out what it's
  // offering. The footer has the room the header's menu doesn't, and this is
  // where a reader arrives *looking* for a setting rather than recognising a
  // familiar word in passing. Said in full, the visible text is also the
  // accessible name, so there's no aria-label to keep in sync.
  const lang = document.getElementById("prefs-lang");
  if (lang) lang.textContent = t("footer.languageIs", { value: langLabel() });
  const units = document.getElementById("prefs-units");
  if (units) units.textContent = t("footer.unitsIs", { value: unitsLabel() });
}

/** "Français" — the active language, in its own name. */
export function langLabel(): string {
  return LANGUAGES.find((l) => l.code === getLang())?.endonym ?? getLang();
}

/** "Métrique" — the active unit system, in the active language. */
export function unitsLabel(): string {
  return t(getUnits() === "metric" ? "settings.units.metric" : "settings.units.imperial");
}
