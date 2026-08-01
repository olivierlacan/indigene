// The Privacy & safety page (route `#/privacy`). One plain-language place that
// says, honestly and in full, how Indigene treats the people who use it —
// written to be reassuring and legible to everyone, including kids and the
// grandparents who might be looking over their shoulder.
//
// It documents real behavior, not aspiration: no account, no tracking, saved
// spots that never leave the device, location used only on an explicit tap, and
// the exact list of public science services the browser talks to directly. The
// app links here from every point that might give a thoughtful person pause
// (see `components/privacy-link.ts`).
//
// The page is built from a list of dictionary keys rather than inline prose, so
// a translator meets the document as a document — one ordered run of paragraphs
// in `locales/*` — instead of hunting sentences out of DOM-building code.
//
// It takes an optional param — `#/privacy/lookups`, `#/privacy/location` — so a
// control elsewhere in the app can link to the section that answers the question
// it raises, instead of restating the answer beside itself. Same idea, and the
// same reveal, as `#/settings/<card>`.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { DATA_SOURCES_URL, ISSUES_URL } from "../lib/plain";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";

const REPO_URL = "https://github.com/olivierlacan/indigene";

/** The sections a `#/privacy/<param>` link can ask for, by their route word.
 *  The words are the `PrivacySection` union in `components/privacy-link.ts`. */
const SECTION_IDS: Record<string, string> = {
  location: "privacy-location",
  lookups: "privacy-lookups",
  saved: "privacy-saved",
  whatsnew: "privacy-whats-new",
  children: "privacy-children",
};

/** The public services a lookup can reach, and what each one is told. Their
 *  *names* are proper nouns and never translate; the two descriptions do. */
const SERVICES: { name: string; forWhat: TKey; sent: TKey }[] = [
  { name: "iNaturalist", forWhat: "privacy.svc.inat.for", sent: "privacy.svc.inat.sent" },
  { name: "Open-Meteo", forWhat: "privacy.svc.meteo.for", sent: "privacy.svc.meteo.sent" },
  { name: "OpenStreetMap", forWhat: "privacy.svc.osm.for", sent: "privacy.svc.osm.sent" },
  { name: "SoilGrids (ISRIC)", forWhat: "privacy.svc.soil.for", sent: "privacy.svc.soil.sent" },
  { name: "USGS", forWhat: "privacy.svc.usgs.for", sent: "privacy.svc.usgs.sent" },
  { name: "US EPA", forWhat: "privacy.svc.epa.for", sent: "privacy.svc.epa.sent" },
];

/** One "who your browser talks to" row: the service, what it's for, what's sent. */
function service(name: string, forWhat: string, sent: string): HTMLElement {
  return el("li", {}, [
    el("strong", {}, name),
    ` — ${forWhat} `,
    el("span", { style: "color:var(--ink-soft)" }, t("privacy.svc.sentWrap", { sent })),
  ]);
}

const bullets = (keys: TKey[]): HTMLElement =>
  el("ul", {}, keys.map((k) => el("li", {}, t(k))));

export function renderPrivacy(main: HTMLElement, param?: string): void {
  clear(main);
  document.title = t("privacy.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("privacy.title")),
      el("p", { class: "step-lede" }, t("privacy.lede")),

      // The short version, up top, for anyone who won't read the rest.
      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        bullets(["privacy.short1", "privacy.short2", "privacy.short3", "privacy.short4", "privacy.short5"]),
      ]),

      el("h3", { id: "privacy-location" }, t("privacy.locationTitle")),
      el("p", {}, t("privacy.location1")),
      el("p", {}, tx("privacy.location2", { zip: el("strong", {}, t("privacy.zipOrTown")) })),
      el("p", {}, t("privacy.location3")),

      el("h3", { id: "privacy-lookups" }, t("privacy.whereTitle")),
      el("p", {}, t("privacy.whereLede")),
      el("ul", { class: "who-list" }, SERVICES.map((s) => service(s.name, t(s.forWhat), t(s.sent)))),
      el("p", {}, tx("privacy.whereFooter", {
        link: el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("privacy.dataSourcesLink")),
      })),

      el("h3", { id: "privacy-saved" }, t("privacy.savedTitle")),
      el("p", {}, tx("privacy.saved", { save: el("strong", {}, t("privacy.saveButton")) })),

      // The green dot is the app volunteering that it knows something about
      // your history, so it gets its own section rather than a line inside
      // another one. Said in full: the three values, where they live, what
      // they can't do, and the way to erase them.
      el("h3", { id: "privacy-whats-new" }, t("privacy.whatsNewTitle")),
      el("p", {}, t("privacy.whatsNew1")),
      bullets(["privacy.whatsNew2", "privacy.whatsNew3", "privacy.whatsNew4"]),
      el("p", {}, tx("privacy.whatsNew5", {
        settings: el("a", { href: "#/settings/whatsnew" }, t("privacy.whatsNewSettingsLink")),
      })),

      el("h3", {}, t("privacy.noAccountTitle")),
      bullets(["privacy.noAccount1", "privacy.noAccount2", "privacy.noAccount3"]),

      el("h3", { id: "privacy-children" }, t("privacy.childrenTitle")),
      bullets([
        "privacy.children1",
        "privacy.children2",
        "privacy.children3",
        "privacy.children4",
        "privacy.children5",
      ]),

      el("h3", {}, t("privacy.openTitle")),
      el("p", {}, tx("privacy.open", {
        link: el("a", { href: REPO_URL, target: "_blank", rel: "noopener" }, t("privacy.repoLink")),
      })),

      el("h3", {}, t("privacy.questionsTitle")),
      el("p", {}, tx("privacy.questions", {
        link: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("privacy.issueLink")),
      })),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );

  revealSection(param);
}

/**
 * Open the page at the section a link asked for. Mirrors `#/settings/<card>`:
 * scroll only if the heading isn't already on screen, then move focus there so a
 * keyboard or screen-reader user arrives where a sighted one is looking.
 *
 * An unknown param — a typo, an old link — is not an error worth a message:
 * `#/privacy/whatever` is still the privacy page, opened at the top.
 */
function revealSection(param?: string): void {
  const id = param ? SECTION_IDS[param] : undefined;
  if (!id) return;
  requestAnimationFrame(() => {
    const heading = document.getElementById(id);
    if (!heading) return;
    const box = heading.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) heading.scrollIntoView({ block: "start" });
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  });
}
