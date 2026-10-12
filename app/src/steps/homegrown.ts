// "Homegrown National Park" (route `#/homegrown`) — the idea Indigene is built
// on, and who built it.
//
// Doug Tallamy's argument: lawn feeds almost nothing, there is a lot of it, and
// if homeowners gave half of it back to native plants the yards together would
// be a park. Indigene is the "what do I plant in this corner?" half of that
// idea, and this page says so, then shows where the app acts on it — the
// ranking that leads with caterpillars, the "Essential" badge that is Tallamy's
// keystone plants under a plainer name.
//
// The last section is the author's own, in the first person: the yard that
// made the problem obvious, twice. A sibling of `#/native` in shape.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";

const HNP_URL = "https://homegrownnationalpark.org/";

/** The evidence, in reading order. Names and URLs stay untranslated, as on
 *  `#/native`; `what` is the dictionary key. */
const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Homegrown National Park", url: HNP_URL, what: "homegrown.src.hnp" },
  { name: "Tallamy 2020 — Nature's Best Hope (Timber Press)", url: "https://www.hachettebookgroup.com/titles/douglas-w-tallamy/natures-best-hope/9781604699005/", what: "homegrown.src.book" },
  { name: "Milesi et al. 2005 — Environmental Management", url: "https://doi.org/10.1007/s00267-004-0316-2", what: "homegrown.src.lawn" },
  { name: "Narango, Tallamy & Marra 2018 — PNAS", url: "https://doi.org/10.1073/pnas.1809259115", what: "homegrown.src.chickadee" },
  { name: "Narango, Tallamy & Shropshire 2020 — Nature Communications", url: "https://doi.org/10.1038/s41467-020-19565-4", what: "homegrown.src.keystone" },
];

const p = (key: TKey): HTMLElement => el("p", {}, t(key));

export function renderHomegrown(main: HTMLElement): void {
  clear(main);
  document.title = t("homegrown.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("homegrown.title")),
      el("p", { class: "step-lede" }, t("homegrown.lede")),

      el("h3", {}, t("homegrown.ideaTitle")),
      p("homegrown.idea1"),
      el("p", {}, tx("homegrown.idea2", {
        map: el("a", { href: HNP_URL, target: "_blank", rel: "noopener" }, t("homegrown.mapLink")),
      })),

      el("h3", {}, t("homegrown.birdsTitle")),
      p("homegrown.birds1"),

      el("h3", {}, t("homegrown.appTitle")),
      el("ul", {}, [
        el("li", {}, t("homegrown.app1")),
        el("li", {}, tx("homegrown.app2", { link: el("a", { href: "#/traits/essential" }, t("homegrown.app2Link")) })),
        el("li", {}, tx("homegrown.app3", { link: el("a", { href: "#/sources" }, t("homegrown.app3Link")) })),
        el("li", {}, tx("homegrown.app4", {
          ireland: el("a", { href: "#/regions/ireland" }, t("homegrown.app4Ireland")),
          nz: el("a", { href: "#/regions/nz-auckland" }, t("homegrown.app4Nz")),
          japan: el("a", { href: "#/regions/kanto" }, t("homegrown.app4Japan")),
        })),
      ]),

      el("h3", {}, t("homegrown.authorTitle")),
      p("homegrown.author1"),
      p("homegrown.author2"),
      el("p", { class: "sureness-from" }, t("homegrown.authorSign")),

      el("h3", {}, t("homegrown.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
