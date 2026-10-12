// "Peoples and plants" (route `#/people`) — the peoples who named, ate, wove
// and tended the plants Indigene lists, and where to read their own accounts.
//
// The page points, it doesn't retell: plant pages that carry a history, the
// dated posts, and sources the nations publish themselves. It deliberately has
// no "whose land is each region" table. Homelands overlap and are contested,
// and every list we have rests partly on sources we couldn't read in full
// (docs/outreach/indigenous-plant-history-sources.md), so the page sends the
// reader to Native Land Digital and to the nation's own account instead.
//
// The rules under "How we write about it" are the ones that research followed,
// stated for readers. Keep the two saying the same thing.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, tx } from "../lib/i18n";
import { commonName } from "../lib/names";
import { entryForPlant } from "../lib/registry";
import { POSTS } from "../data/posts";
import { CONTACT } from "./posts";
import type { TKey } from "../locales/en";

/** Plant pages whose own text says who ate, wove or tended the plant. Grow
 *  this as the plant-history work lands; a plant goes here only once its page
 *  names the people and the source. */
const PLANTS_WITH_HISTORY = [
  "camassia-quamash",
  "erythronium-oregonum",
  "allium-tricoccum",
  "corynocarpus-laevigatus",
  "podocarpus-totara",
  "phormium-tenax",
  "arthropodium-cirratum",
];

/** Published by the nations themselves, or made with them. Names are proper
 *  nouns and stay untranslated; `what` is the dictionary key. */
const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Myaamia Center", url: "https://mc.miamioh.edu/", what: "people.src.myaamia" },
  { name: "Great Lakes Indian Fish & Wildlife Commission", url: "https://glifwc.org/", what: "people.src.glifwc" },
  { name: "Ojibwe People's Dictionary", url: "https://ojibwe.lib.umn.edu/", what: "people.src.opd" },
  { name: "Lenape Talking Dictionary", url: "https://www.talk-lenape.org/", what: "people.src.lenape" },
  { name: "Seminole Tribe of Florida", url: "https://www.semtribe.com/culture", what: "people.src.seminole" },
  { name: "Amah Mutsun Land Trust", url: "https://www.amahmutsun.org/", what: "people.src.amah" },
  { name: "Te Haumanu Taiao", url: "https://tiakitamakimakaurau.nz/protect-and-restore-our-environment/te-haumanu-taiao-restoring-natural-environment", what: "people.src.haumanu" },
];

function plantRow(id: string): HTMLElement {
  const entry = entryForPlant(id);
  const name = entry ? commonName({ common: entry.commonNames[0], latin: entry.scientificName }) : id;
  return el("li", {}, el("a", { href: `#/plants/${id}` }, el("strong", {}, name)));
}

const out = (url: string, label: Node | string): HTMLElement =>
  el("a", { href: url, target: "_blank", rel: "noopener" }, label);

export function renderPeople(main: HTMLElement): void {
  clear(main);
  document.title = t("people.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("people.title")),
      el("p", { class: "step-lede" }, t("people.lede")),

      el("h3", {}, t("people.plantsTitle")),
      el("p", {}, t("people.plantsLede")),
      el("ul", { class: "who-list" }, PLANTS_WITH_HISTORY.map(plantRow)),

      el("h3", {}, t("people.postsTitle")),
      el("ul", { class: "who-list" }, POSTS.map((p) =>
        el("li", {}, el("a", { href: `#/posts/${p.slug}` }, el("strong", {}, t(`posts.${p.key}.title` as TKey))))
      )),

      el("h3", {}, t("people.sourcesTitle")),
      el("p", {}, t("people.sourcesLede")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          out(url, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("p", {}, tx("people.contact", { email: el("a", { href: `mailto:${CONTACT}` }, CONTACT) })),

      el("h3", {}, t("people.landTitle")),
      el("p", {}, tx("people.land", { nativeLand: out("https://native-land.ca/", "Native Land Digital") })),

      el("h3", {}, t("people.howTitle")),
      el("ul", {}, (["people.how1", "people.how2", "people.how3", "people.how4"] as TKey[])
        .map((k) => el("li", {}, t(k)))),
      el("p", { class: "more-link" }, el("a", { href: "#/native" }, t("people.nativeLink"))),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
