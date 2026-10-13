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
import { plantThumb } from "../components/plant-thumb";
import { sectionTitle } from "../components/section-link";
import { peopleArt } from "../components/people-art";
import { CONTACT, postWhen } from "./posts";
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

/** A plant as a card, the way a region's roster shows one: its photograph (or
 *  its drawing, until someone picks one), its name, its binomial. */
function plantCard(id: string): HTMLElement | null {
  const entry = entryForPlant(id);
  if (!entry) return null;
  return el("a", { href: `#/plants/${id}`, class: "card people-plant" }, [
    plantThumb(id, entry.form, { attrs: { style: "flex:0 0 auto" } }),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, commonName({ common: entry.commonNames[0], latin: entry.scientificName })),
      el("div", { class: "plant-latin", style: "font-size:0.85rem" }, entry.scientificName),
    ]),
  ]);
}

/** A link off the site, as a reading row: a mark in the gutter, the name, and
 *  one line on what it is. */
function linkRow(icon: string, link: HTMLElement, what: string | null): HTMLElement {
  return el("li", { class: "reading-row" }, [
    el("span", { class: "reading-kind", "aria-hidden": "true" }, icon),
    el("div", { class: "reading-body" }, [link, what ? el("span", { class: "reading-by" }, what) : null]),
  ]);
}

const out = (url: string, label: Node | string): HTMLElement =>
  el("a", { href: url, target: "_blank", rel: "noopener" }, label);

export function renderPeople(main: HTMLElement): void {
  clear(main);
  document.title = t("people.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      peopleArt(),
      el("h2", { class: "step-title" }, t("people.title")),
      el("p", { class: "step-lede" }, t("people.lede")),

      el("section", { style: "margin-top:1.25rem" }, [
        sectionTitle("🌱", t("people.plantsTitle")),
        el("p", {}, t("people.plantsLede")),
        el("div", { class: "card-grid" }, PLANTS_WITH_HISTORY.map(plantCard)),
      ]),

      el("section", { style: "margin-top:1.5rem" }, [
        sectionTitle("📅", t("people.postsTitle")),
        el("ul", { class: "reading-list" }, POSTS.map((p) =>
          linkRow("📅", el("a", { href: `#/posts/${p.slug}`, class: "reading-title" }, t(`posts.${p.key}.title` as TKey)),
            postWhen(p))
        )),
      ]),

      el("section", { style: "margin-top:1.5rem" }, [
        sectionTitle("📚", t("people.sourcesTitle")),
        el("p", {}, t("people.sourcesLede")),
        el("ul", { class: "reading-list" }, SOURCES.map(({ name, url, what }) =>
          linkRow("🌐", el("a", { href: url, target: "_blank", rel: "noopener", class: "reading-title" }, name), t(what))
        )),
      ]),

      el("p", {}, tx("people.contact", { email: el("a", { href: `mailto:${CONTACT}` }, CONTACT) })),

      sectionTitle("🗺️", t("people.landTitle")),
      el("p", {}, tx("people.land", { nativeLand: out("https://native-land.ca/", "Native Land Digital") })),

      sectionTitle("✍️", t("people.howTitle")),
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
