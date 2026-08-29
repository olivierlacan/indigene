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
  // The row of other pages. Guide and What's new are real paths, not hash
  // routes, and Vite has already substituted %BASE_URL% into the static markup
  // — so read those hrefs back off the existing anchors rather than rebuilding
  // them and getting the base wrong. About and Privacy are hash routes.
  const nav = document.getElementById("footer-nav");
  if (nav) {
    const hrefOf = (suffix: string, fallback: string) =>
      nav.querySelector<HTMLAnchorElement>(`a[href$="${suffix}"]`)?.getAttribute("href") ?? fallback;
    const sep = () => el("span", { class: "footer-nav-sep", "aria-hidden": "true" }, "·");
    nav.replaceChildren(
      el("a", { href: hrefOf("guide/", "guide/") }, t("footer.guide")),
      sep(),
      // The dot rides inside the link, so the words it carries become part of
      // the link's own accessible name rather than a separate stop.
      el(
        "a",
        { href: hrefOf("release-notes/", "release-notes/") },
        hasUnseenRelease() ? [t("footer.releaseNotes"), newDot()] : [t("footer.releaseNotes")]
      ),
      sep(),
      el("a", { href: "#/about" }, t("footer.about")),
      sep(),
      el("a", { href: "#/privacy" }, t("footer.privacy"))
    );
  }

  const p = document.getElementById("footer-text");
  if (p) {
    p.replaceChildren(
      ...tx("footer.text", {
        sources: el("a", { href: "#/sources" }, t("footer.sources")),
      })
    );
  }

  // Two pills, each naming its setting as well as its value: "Language:
  // English", not a bare "English" that leaves you to work out what it's
  // offering. The footer has the room the header's menu doesn't, and this is
  // where a reader arrives *looking* for a setting rather than recognising a
  // familiar word in passing. Said in full, the visible text is also the
  // accessible name, so there's no aria-label to keep in sync.
  setPref(document.getElementById("prefs-lang"), t("footer.languageIs", { value: langLabel() }), langLabel());
  setPref(document.getElementById("prefs-units"), t("footer.unitsIs", { value: unitsLabel() }), unitsLabel());
}

/**
 * "Language: **English**" — the phrase as its language writes it, with the
 * value picked out so it can be coloured as the setting rather than as prose
 * (see `.footer-prefs`). Split from the rendered phrase rather than assembled
 * here, because the punctuation around a colon belongs to the language (French
 * puts a space before it) and only the dictionary knows it.
 */
function setPref(node: HTMLElement | null, phrase: string, value: string): void {
  if (!node) return;
  const at = phrase.lastIndexOf(value);
  if (at === -1) {
    node.textContent = phrase;
    return;
  }
  node.replaceChildren(
    phrase.slice(0, at),
    el("span", { class: "pref-v" }, value),
    phrase.slice(at + value.length)
  );
}

/** "Français" — the active language, in its own name. */
export function langLabel(): string {
  return LANGUAGES.find((l) => l.code === getLang())?.endonym ?? getLang();
}

/** "Métrique" — the active unit system, in the active language. */
export function unitsLabel(): string {
  return t(getUnits() === "metric" ? "settings.units.metric" : "settings.units.imperial");
}
