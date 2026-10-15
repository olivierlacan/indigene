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
// Checked October 2026. Four pages were opened and read for the quote beside
// them (EPA, NISIC, USFWS, Penn State). The rest of the hosts were unreachable
// from the container this was written in, so their quotes come from search
// excerpts of the page and are marked "(excerpt)": re-open one before leaning
// harder on it.
const SOURCES: { name: string; url: string; what: TKey }[] = [
  // (excerpt) "proper plant identification is the first step to invasive plant
  // control … consult Ask Extension or contact your local county Extension office."
  { name: "University of Maryland Extension — Removing Invasive Plants and Planting Natives in Maryland", url: "https://extension.umd.edu/resource/removing-invasive-plants-and-planting-natives-maryland", what: "removing.src.umd" },
  // (excerpt) "most exotic species do not become invasive in either natural
  // ecosystems or agricultural settings".
  { name: "Maryland DNR — What is an invasive species?", url: "https://dnr.maryland.gov/Invasives/pages/Invasive-Description.aspx", what: "removing.src.mddnr" },
  // (excerpt) yards below the threshold had "lower reproductive success and
  // unsustainable population growth" than those with ">70% native plant biomass".
  { name: "Narango, Tallamy & Marra 2018 — Nonnative plants reduce population growth of an insectivorous bird (PNAS)", url: "https://doi.org/10.1073/pnas.1809259115", what: "removing.src.narango" },
  // (excerpt) "Please do not remove buffelgrass or other invasive plants in the
  // park if you are not an official volunteer".
  { name: "Saguaro National Park (NPS) — How You Can Help", url: "https://www.nps.gov/sagu/learn/nature/how-you-can-help.htm", what: "removing.src.nps" },
  // (excerpt) "Do not remove plants from parks without prior approval from NYC
  // Parks staff."
  { name: "City Parks Foundation & NYC Parks — Weeds and Invasive Plants", url: "https://cityparksfoundation.org/wp-content/uploads/2024/01/Weeds-Invasive-Plants_11.9.23.pdf", what: "removing.src.nycparks" },
  // (read) "Early interventions are more likely to be successful, while
  // long-term management typically have higher association costs."
  { name: "USDA National Invasive Species Information Center — Early Detection and Rapid Response", url: "https://www.invasivespeciesinfo.gov/subject/early-detection-and-rapid-response", what: "removing.src.nisic" },
  // (read) "plants should be pulled before siliques are developed, as studies
  // have found that plants bearing siliques when pulled, even unripe ones, can
  // still develop viable seed."
  { name: "Penn State Extension — Garlic Mustard", url: "https://extension.psu.edu/garlic-mustard", what: "removing.src.psu" },
  // (excerpt) pull when the soil is damp, not soggy.
  { name: "UC Marin Master Gardeners — Weeds & Invasive Plants", url: "https://ucanr.edu/sites/marinmg/PROBLEMS/WEEDS_-_INVASIVE_PLANTS/", what: "removing.src.marin" },
  // (excerpt) "repeated cutting is required to prevent replenishment of
  // reserves." About a native shrub; the root physiology is the general point.
  { name: "NDSU Extension — Mechanical Management of Western Snowberry", url: "https://ndsu.edu/agriculture/sites/default/files/2022-10/Mechanical_Mgmt_of_Western_Snowberry.pdf", what: "removing.src.ndsu" },
  // (excerpt) "three to five years of active management and monitoring are
  // typical to ensure effective control and depletion of seed reserves";
  // "It is fairly easy to snuff out a small population of invasive plants".
  { name: "UNH Extension — Mechanical Control of Terrestrial Invasive Plants", url: "https://extension.unh.edu/resource/mechanical-control-terrestrial-invasives-plants", what: "removing.src.unh" },
  // (read) "Under the MBTA it is illegal to destroy a nest that has eggs or
  // chicks in it".
  { name: "U.S. Fish & Wildlife Service — Bird nests", url: "https://www.fws.gov/story/bird-nests", what: "removing.src.fws" },
  // (excerpt) "the duty of every owner of land to control and prevent the
  // spread of noxious weeds within and from the owner's property".
  { name: "RCW 17.10.140 — Washington State Legislature", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=17.10.140", what: "removing.src.rcw" },
  // (excerpt) permits "may be required to remove trees on private property."
  { name: "City of Portland — Do I need a permit to remove trees on private property?", url: "https://www.portland.gov/ppd/tree-permits/removal-and-replanting-permits/do-i-need-permit-remove-trees-private-property", what: "removing.src.portland" },
  // (excerpt) "interdit depuis le 1er Janvier 2019 aux particuliers d'acheter,
  // d'utiliser et de stocker des produits phytopharmaceutiques de synthèse".
  { name: "DRAAF Occitanie — Extension de la loi Labbé", url: "https://draaf.occitanie.agriculture.gouv.fr/extension-de-la-loi-labbe-a6470.html", what: "removing.src.labbe" },
  // (excerpt) OFB asks communities, professionals and individuals not to trim
  // hedges from 15 March to 31 July. A recommendation; the binding rule binds
  // farmers only, which is why the page says "asks".
  { name: "Office français de la biodiversité — Période de nidification : préconisations pour la taille des haies (2022)", url: "https://pays-de-la-loire.chambres-agriculture.fr/fileadmin/user_upload/Pays_de_la_Loire/022_Inst-Pays-de-la-loire/Actus-agendas/2022/Fichiers/20220414_periode_nidification_oiseaux_OFB_preconisation_taille_haies.pdf", what: "removing.src.ofb" },
  // (excerpt) Regulation 49(2) of S.I. 477/2011; doing nothing "could be
  // considered an offence by 'allowing' the plant to be dispersed or spread."
  { name: "National Biodiversity Data Centre (invasives.ie) — Japanese Knotweed FAQ", url: "https://invasives.ie/app/uploads/2024/04/JapaneseKnotweed_FAQ_Apr2024_V1.5.pdf", what: "removing.src.knotweed" },
  // (excerpt) "the cutting, grubbing, burning or other destruction of
  // 'vegetation growing in any hedge or ditch' between 1st March and 31st
  // August is prohibited."
  { name: "NPWS — Restrictions on Cutting Hedgerows and Burning", url: "https://www.npws.ie/node/5568", what: "removing.src.npws" },
  // (excerpt) "Nor may they be kept, bred, transported to, from or within the
  // EU, sold, grown or released into the environment."
  { name: "EUR-Lex — Protecting biodiversity from invasive alien species (Regulation 1143/2014)", url: "https://eur-lex.europa.eu/legal-content/EN/LSU/?uri=CELEX:32014R1143", what: "removing.src.eu" },
  // (excerpt) Accord plants are unwanted organisms under the Biosecurity Act
  // 1993 and may not be sold, propagated or distributed.
  { name: "Ministry for Primary Industries (NZ) — Overview of the pest plant accord", url: "https://www.biosecurity.govt.nz/NPPA", what: "removing.src.nppa" },
  // (excerpt) specified invasive alien species may not be kept or transported
  // alive ("生きた個体の…保管・運搬…原則禁止").
  { name: "Ministry of the Environment, Japan — Invasive Alien Species Act", url: "https://www.env.go.jp/en/nature/as.html", what: "removing.src.japan" },
  // (excerpt) "袋などに入れ、枯死させたのちに処分する" — bag it, let it die,
  // then dispose of it.
  { name: "大阪府 — オオキンケイギク (Osaka Prefecture)", url: "https://www.pref.osaka.lg.jp/documents/1337/ookinkeigiku-seiiku.pdf", what: "removing.src.osaka" },
  // (excerpt) salt "destroys the soil structure and is mobile"; borax "does
  // not break down."
  { name: "University of Illinois Extension — Homemade herbicide considerations", url: "https://extension.illinois.edu/blogs/ilriverhort/2018-04-08-homemade-herbicide-considerations-michelle-wiesbrook", what: "removing.src.illinois" },
  // (excerpt) "Désherbant fait maison : ne jamais mélanger javel et vinaigre";
  // use only products marked « Emploi autorisé au jardin ».
  { name: "ANSES — Désherbant fait maison : ne jamais mélanger javel et vinaigre", url: "https://www.anses.fr/fr/content/desherbant-fait-maison-ne-jamais-melanger-javel-et-vinaigre", what: "removing.src.anses" },
  // (read) "It is a violation of Federal law to use this product in a manner
  // inconsistent with its labeling." In other words, the label is the law.
  { name: "U.S. EPA — Introduction to Pesticide Labels", url: "https://www.epa.gov/pesticide-labels/introduction-pesticide-labels", what: "removing.src.epa" },
  // (excerpt) sap plus sunlight causes "severe burns, blistering, painful
  // sores"; "seek advice from professional plant control specialists."
  { name: "New York State Department of Health — Giant Hogweed", url: "https://www.health.ny.gov/environmental/outdoors/hogweed/giant_hogweed.htm", what: "removing.src.hogweed" },
  // (excerpt) most home compost "cannot kill the seeds or plant parts."
  { name: "UNH Extension — Methods for Disposing Non-Native Invasive Plants", url: "https://extension.unh.edu/resource/methods-disposing-non-native-invasive-plants", what: "removing.src.compost" },
  // (excerpt) "Careless disposal of garden waste… into lay-bys, ditches,
  // streams and ponds, increases the chances of these plants spreading".
  { name: "Environment Agency — Managing invasive non-native plants", url: "https://www.nonnativespecies.org/assets/Managing_invasive_non-native_plants_-_Environment_Agency_2010-2.PDF", what: "removing.src.dumping" },
  // (excerpt) "Plant native plants or seeds, or put down a layer of mulch …
  // Otherwise, invasive plants will find their way back into the bare spaces."
  { name: "University of Arizona — Best Practices for Controlling Invasive Plants in the Home Landscape", url: "https://azinvasiveplants.arizona.edu/resources/best-practices", what: "removing.src.arizona" },
  { name: "EDDMapS (University of Georgia)", url: "https://www.eddmaps.org/", what: "removing.src.eddmaps" },
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
      el("ul", {}, (["us", "wa", "fr", "ie", "eu", "nz", "jp"] as const).map((k) =>
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
