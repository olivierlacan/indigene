// "Before you pull a plant" (route `#/removing`) — whether a plant should go,
// when, how, and whose permission that takes.
//
// Each invasive's page already says *how* to remove it for good (`removal` in
// `data/invasives.ts`). What it couldn't say is the part that comes first, and
// that goes wrong in ways a spade can't fix: pulling a native look-alike,
// clearing a park bed that wasn't yours to clear, cutting a hedge with a nest
// in it, reaching for salt or diesel because the knotweed came back. So this
// page is the decision, once, and every removal section links to it.
//
// The heuristics are short on purpose and every one is sourced, the way the
// planting pages cite the RHS and the Woody Plant Seed Manual: a reader about
// to break a law or poison a stream deserves the agency's own page, not our
// paraphrase. The quotes behind each claim sit beside the SOURCES rows.
//
// Two things it refuses to be. A licence: on ground that isn't yours the answer
// is always "ask, or join the people who look after it", never "go in at
// dawn". And a scold: Joey Santore's point stands that a plant in a pavement
// crack is doing the ground a favour, and most plants from elsewhere are
// harmless. The page says when to leave a plant be as plainly as when to pull.
import { el, clear } from "../ui";
import { knownRegion, navigate } from "../state";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { mostWanted } from "../lib/invasives";
import { pioneerCountForRegion } from "../lib/pioneers";

/** The evidence, in the order the page leans on it. Names are the pages' own
 *  titles and stay untranslated; `what` is the dictionary key. */
//
// Checked 15 October 2026: every page below was fetched and the quote beside
// its row found in the page's own text. Claims we couldn't open a source for
// (city tree permits, French hedge dates, Irish hedge law, Japan's rules) are
// left off the page rather than cited from a search snippet.
const SOURCES: { name: string; url: string; what: TKey }[] = [
  // "Accurately identifying the tree so as not to confuse it with several
  // native look-alikes is imperative prior to any control measures being
  // implemented."
  { name: "Penn State Extension — Tree of Heaven: Native Look-alikes", url: "https://extension.psu.edu/tree-of-heaven-native-look-alikes", what: "removing.src.psuid" },
  // "When in doubt, take photos and share them with us or report them on
  // iNaturalist." Also: "hand pull or dig up the roots when the soil is
  // moist"; "Disturbed areas should be mulched and/or re-planted to prevent
  // spread".
  { name: "King County — Rough chervil", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/rough-chervil", what: "removing.src.chervil" },
  // "Most non-native or exotic species do not become invasive."
  { name: "Maryland DNR — What is an invasive species?", url: "https://dnr.maryland.gov/Invasives/pages/Invasive-Description.aspx", what: "removing.src.mddnr" },
  // Narango's yards were in "the outskirts of Washington, D.C."; chickadees
  // "could only sustain their population when at least 70 percent of plants
  // in a nesting area were native." (The paper itself, PNAS 2018, measured
  // plant biomass; doi.org was unreachable, so the article stands in.)
  { name: "Audubon — Yards With Non-Native Plants Create ‘Food Deserts’ for Bugs and Birds", url: "https://www.audubon.org/news/yards-non-native-plants-create-food-deserts-bugs-and-birds", what: "removing.src.audubon" },
  // "it is important to gain approval from the land owner or manager prior to
  // implementation".
  { name: "Cal-IPC — Weed Workers’ Handbook", url: "https://www.cal-ipc.org/docs/ip/management/wwh/pdf/19626.pdf", what: "removing.src.calipc" },
  // "Early interventions are more likely to be successful, while long-term
  // management typically have higher association costs."
  { name: "USDA National Invasive Species Information Center — Early Detection and Rapid Response", url: "https://www.invasivespeciesinfo.gov/subject/early-detection-and-rapid-response", what: "removing.src.nisic" },
  // "Early detection and control of an invasive species is a much more
  // efficient and effective management strategy than is waiting until an
  // infestation becomes a crisis."
  { name: "Virginia DCR — Invasive Alien Plant Species of Virginia: management", url: "https://www.dcr.virginia.gov/natural-heritage/document/mnginv.pdf", what: "removing.src.vadcr" },
  // "plants should be pulled before siliques are developed, as studies have
  // found that plants bearing siliques when pulled, even unripe ones, can
  // still develop viable seed."
  { name: "Penn State Extension — Garlic Mustard", url: "https://extension.psu.edu/garlic-mustard", what: "removing.src.psu" },
  // "When done repeatedly and often, cutting can deplete stored root reserves
  // of some perennial plants, eventually starving the plant, but this is
  // usually impractical."
  { name: "Penn State Extension — Integrated Forest Vegetation Management", url: "https://extension.psu.edu/integrated-forest-vegetation-management", what: "removing.src.psuifvm" },
  // "annual monitoring for the first 3-5 years, decreasing in frequency …
  // until the seed source has been exhausted".
  { name: "USDA Forest Service — Fremont-Winema Invasive Plant Treatment, Record of Decision", url: "https://www.fs.usda.gov/sites/nfs/files/legacy-media/fremont-winema/fre26win16.pdf", what: "removing.src.usfs" },
  // "Under the MBTA it is illegal to destroy a nest that has eggs or chicks in
  // it"; "destruction of their nests during or near the nesting season could
  // result in a significant level of take."
  { name: "U.S. Fish & Wildlife Service — Bird nests", url: "https://www.fws.gov/story/bird-nests", what: "removing.src.fws" },
  // "Landowners are required to completely eradicate Class A weeds"; "A County
  // Weed Board may require landowners to control a Class C weed".
  { name: "Washington State Noxious Weed Control Board — Washington's noxious weed laws", url: "https://www.nwcb.wa.gov/washingtons-noxious-weed-laws", what: "removing.src.nwcblaw" },
  // "Depuis le 1er janvier 2019, vous ne pouvez plus acheter, utiliser et
  // stocker des pesticides chimiques pour jardiner ou désherber. Issue de la
  // loi Labbé".
  { name: "Tela Botanica — Maison et jardin sans pesticides : interdiction et conseils", url: "https://www.tela-botanica.org/2019/01/maison-et-jardin-sans-pesticides-interdiction-et-conseils/", what: "removing.src.tela" },
  // Gunnera is "listed in the Third Schedule … making it an offence under
  // Regulation 49 … to plant, disperse, allow or cause to grow this plant".
  { name: "National Biodiversity Data Centre — Irish Vegetation Classification: IN1b", url: "https://biodiversityireland.ie/ivc-classification-explorer/in1/in1b/", what: "removing.src.nbdc" },
  // EU-listed species: "une série d'interdictions … (introduction, mise en
  // situation de se reproduire, de transport, de commercialisation,
  // d'utilisation, d'échange, de détention et de libération dans
  // l'environnement)".
  { name: "Centre de ressources EEE (OFB & UICN France) — Réglementation", url: "https://especes-exotiques-envahissantes.fr/base-documentaire/reglementation/", what: "removing.src.eee" },
  // "All plants on the NPPA are unwanted organisms under the Biosecurity Act
  // 1993. These plants cannot be sold, propagated or distributed in New
  // Zealand."
  { name: "New Zealand Plant Conservation Network — National Pest Plant Accord", url: "https://www.nzpcn.org.nz/threats/exotic-plants/pest-plant-accord/", what: "removing.src.nzpcn" },
  // "Using things like salt or diesel may kill some weeds, but then nothing
  // else will grow there!"
  { name: "Penn State Extension — Using Herbicides on Horse Farms", url: "https://extension.psu.edu/using-herbicides-on-horse-farms", what: "removing.src.psusalt" },
  // "Boron can permanently damage other plants, including turfgrasses, and it
  // persists in the soil."
  { name: "Penn State Extension — Dead Nettle, Henbit, and Ground Ivy", url: "https://extension.psu.edu/dead-nettle-henbit-and-ground-ivy-three-look-alike-weeds", what: "removing.src.psuborax" },
  // "It is a violation of Federal law to use this product in a manner
  // inconsistent with its labeling. In other words, the label is the law."
  { name: "U.S. EPA — Introduction to Pesticide Labels", url: "https://www.epa.gov/pesticide-labels/introduction-pesticide-labels", what: "removing.src.epa" },
  // "furanocoumarins – chemicals which make the skin very sensitive to
  // sunlight"; "The easiest and safest way to remove giant hogweed is to hire
  // a professional".
  { name: "RHS — Giant hogweed", url: "https://www.rhs.org.uk/weeds/giant-hogweed", what: "removing.src.rhshog" },
  // "Most home compost piles do not get hot enough to kill seeds or plants".
  { name: "Washington State Noxious Weed Control Board — Noxious weed disposal", url: "https://www.nwcb.wa.gov/pdfs/Noxious_weed_disposal_2012-1.pdf", what: "removing.src.nwcbdisp" },
  // "avoid tossing unwanted plants, soil, or clippings over fences, into
  // vacant lots, or into nearby woods. Invasive plants can easily take root
  // and spread".
  { name: "Penn State Extension — Small Actions, Big Impact: Five Ways to Help Stop Invasive Species", url: "https://extension.psu.edu/small-actions-big-impact-five-ways-to-help-stop-invasive-species", what: "removing.src.psudump" },
  // "All data is reviewed by verifiers prior to appearing on maps"; the
  // program covers "the entire US and Canada".
  { name: "EDDMapS (University of Georgia) — About", url: "https://www.eddmaps.org/about/", what: "removing.src.eddmaps" },
  // The NBDC's own "Submit A Sighting" link, from its home page.
  { name: "National Biodiversity Data Centre — Submit a sighting", url: "https://records.biodiversityireland.ie/", what: "removing.src.nbdcrecords" },
];

const p = (key: TKey): HTMLElement => el("p", {}, t(key));

/** A `<li>` whose first words are bold: the case, then what to do about it. */
const boldLead = (lead: TKey, rest: (Node | string)[] | string): HTMLElement =>
  el("li", {}, [el("strong", {}, t(lead)), " ", ...(typeof rest === "string" ? [rest] : rest)]);

export function renderRemoving(main: HTMLElement): void {
  clear(main);
  document.title = t("removing.docTitle");

  // Narrow the two region links to the reader's region when we know it: the
  // list to check is theirs, and so are the pioneers worth leaving.
  const region = knownRegion();
  const listHref = region && mostWanted(region).length ? `#/invasives/in/${region}` : "#/invasives";
  const pioneersHref = region && pioneerCountForRegion(region) ? `#/regions/${region}/pioneers` : null;

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("removing.title")),
      el("p", { class: "step-lede" }, t("removing.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, (["removing.short1", "removing.short2", "removing.short3", "removing.short4"] as TKey[])
          .map((k) => el("li", {}, t(k)))),
      ]),

      el("h3", {}, t("removing.idTitle")),
      el("p", {}, tx("removing.id1", {
        lookalikes: el("a", { href: "#/lookalikes" }, t("removing.id1Link")),
      })),

      el("h3", {}, t("removing.whetherTitle")),
      p("removing.whetherLede"),
      el("ul", {}, [
        boldLead("removing.caseInvasive", tx("removing.caseInvasiveRest", {
          list: el("a", { href: listHref }, t("removing.caseInvasiveLink")),
        })),
        boldLead("removing.caseHarmless", tx("removing.caseHarmlessRest", {
          swaps: el("a", { href: "#/alternatives" }, t("removing.caseHarmlessLink")),
        })),
        boldLead("removing.casePioneer", pioneersHref
          ? tx("removing.casePioneerRest", {
              pioneers: el("a", { href: pioneersHref }, t("removing.casePioneerLink")),
            })
          : t("removing.casePioneerPlain")),
      ]),

      el("h3", {}, t("removing.whoseTitle")),
      p("removing.whose1"),
      p("removing.whose2"),
      el("h4", {}, t("removing.rulesTitle")),
      el("ul", {}, (["us", "wa", "fr", "ie", "eu", "nz"] as const).map((k) =>
        boldLead(`removing.rule.${k}` as TKey, t(`removing.rule.${k}Rest` as TKey)))),
      el("p", { class: "confidence" }, t("removing.rulesNote")),

      el("h3", {}, t("removing.whenTitle")),
      el("ul", {}, (["removing.when1", "removing.when2", "removing.when3", "removing.when4", "removing.when5", "removing.when6"] as TKey[])
        .map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("removing.howTitle")),
      p("removing.how1"),
      el("p", { class: "note warn" }, [el("strong", {}, t("removing.neverTitle")), t("removing.never")]),
      p("removing.how2"),

      el("h3", {}, t("removing.afterTitle")),
      el("ul", {}, (["removing.after1", "removing.after2", "removing.after3"] as TKey[])
        .map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("removing.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("a", { class: "btn btn-secondary", href: listHref }, t("removing.toList")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
