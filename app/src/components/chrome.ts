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

  const savedBtn = document.querySelector<HTMLElement>("#saved-menu .nav-menu-btn");
  savedBtn?.setAttribute("aria-label", t("nav.savedLocations"));
  document.getElementById("saved-menu-panel")?.setAttribute("aria-label", t("nav.savedLocations"));
  document.getElementById("steps-rail")?.setAttribute("aria-label", t("steps.progress"));

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
        releaseNotes: el(
          "a",
          { href: existingNotes?.getAttribute("href") ?? "release-notes/" },
          t("footer.releaseNotes")
        ),
        privacy: el("a", { href: "#/privacy" }, t("footer.privacy")),
      })
    );
  }

  const summary = document.getElementById("prefs-summary");
  if (summary) summary.textContent = prefsSummary();
  document
    .getElementById("prefs-link")
    ?.setAttribute("aria-label", `${t("settings.title")}: ${prefsSummary()}`);
}

/** "Français · Métrique" — the two active choices, in the active language. */
export function prefsSummary(): string {
  const lang = LANGUAGES.find((l) => l.code === getLang())?.endonym ?? getLang();
  const units = t(getUnits() === "metric" ? "settings.units.metric" : "settings.units.imperial");
  return `${lang} · ${units}`;
}
