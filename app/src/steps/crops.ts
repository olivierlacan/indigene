// "Will native plants bring pests to my yard?" (route `#/crops`) — the fourth
// of the "how does this work" pages, and the only one that answers an
// objection rather than a question:
//
//   #/privacy   — how do you treat *me*?
//   #/sources   — how much should I trust the *numbers*?
//   #/about     — why does this exist at all?
//   #/crops     — will the wildlife I invite eat my fruit and vegetables?
//
// That last one is the commonest reason somebody who likes the idea of native
// planting doesn't do it, and it is the one objection in the app with a real
// literature behind it: farms have run this on commercial acreage and weighed
// the crop. So every figure here names the study it came from — the same
// bargain `#/sources` strikes for the numbers in the catalog.
//
// Two rules shaped the page, and both are about being quotable:
//
//  1. **It argues the other side as well.** A reader takes this into an
//     argument with a neighbour, and the neighbour will have heard of
//     cedar-apple rust. The counter-evidence section names the cases where a
//     native really is the wrong plant next to a particular crop, and the
//     ledger figure (`ledgerFigure`) splits the most over-quotable claim on the
//     page into what the evidence shows and what it doesn't. Nobody should be
//     able to catch a reader of this page out with a fact we left off it.
//  2. **It is drawn, not recited.** Four figures rather than four more
//     paragraphs of citation (components/crops-figures.ts). What this page
//     argues is *which animal does what*, and that is a picture.
//
// The plant pages carry one line into here (`cropsLine` in steps/plant.ts).
import { el, clear } from "../ui";
import { navigate } from "../state";
import { statTiles, type Stat } from "../components/stat-card";
import { feedsFigure, chainFigure, fatFigure, ledgerFigure } from "../components/crops-figures";
import { t } from "../lib/i18n";
import { length, distanceFloor } from "../lib/units";
import type { TKey } from "../locales/en";

/**
 * The evidence behind every figure on this page, in reading order — the
 * supporting work first, then the studies that complicate it.
 *
 * `name` and `url` are not translated: an author list and a journal are proper
 * nouns, and a reader following one of these links lands on an English paper
 * whatever language the app is in. Only `what` — the few words saying what the
 * study measured — is a dictionary key.
 *
 * DOIs where the publisher issues one, because a DOI outlives a site redesign.
 * Where a paper's authors could not be confirmed, it is listed by its title
 * rather than an attribution we'd be guessing at.
 */
const STUDIES: { name: string; url: string; what: TKey }[] = [
  { name: "Garibaldi et al. 2013 — Science", url: "https://doi.org/10.1126/science.1230200", what: "crops.src.garibaldi" },
  { name: "Klein et al. 2007 — Proceedings of the Royal Society B", url: "https://doi.org/10.1098/rspb.2006.3721", what: "crops.src.klein" },
  { name: "Blaauw & Isaacs 2014 — Journal of Applied Ecology", url: "https://doi.org/10.1111/1365-2664.12257", what: "crops.src.blaauw14" },
  { name: "Blaauw & Isaacs 2015 — Biological Control", url: "https://www.sciencedirect.com/science/article/abs/pii/S1049964415300207", what: "crops.src.blaauw15" },
  { name: "Morandin, Long & Kremen 2014 — Agriculture, Ecosystems & Environment", url: "https://www.sciencedirect.com/science/article/abs/pii/S0167880914001662", what: "crops.src.morandin" },
  { name: "Albrecht et al. 2020 — Ecology Letters", url: "https://doi.org/10.1111/ele.13576", what: "crops.src.albrecht" },
  { name: "Forister et al. 2015 — PNAS", url: "https://doi.org/10.1073/pnas.1423042112", what: "crops.src.forister" },
  { name: "Narango, Tallamy & Marra 2018 — PNAS", url: "https://doi.org/10.1073/pnas.1809259115", what: "crops.src.narango" },
  { name: "Monteagudo et al. 2023 — Pest Management Science", url: "https://doi.org/10.1002/ps.7421", what: "crops.src.monteagudo" },
  { name: "Díaz-Siefer et al. 2022 — Journal of Pest Science", url: "https://doi.org/10.1007/s10340-021-01438-4", what: "crops.src.diaz" },
  { name: "Mols & Visser 2007 — PLOS ONE", url: "https://doi.org/10.1371/journal.pone.0000202", what: "crops.src.mols" },
  { name: "Smith, DeSando & Pagano 2013 — Northeastern Naturalist", url: "https://www.jstor.org/stable/24243865", what: "crops.src.smith" },
  { name: "Lindell et al. 2016 — Crop Protection", url: "https://www.sciencedirect.com/science/article/abs/pii/S0261219416302113", what: "crops.src.lindell" },
  { name: "Bahlai et al. 2007 — Environmental Entomology", url: "https://academic.oup.com/ee/article/36/5/998/408885", what: "crops.src.bahlai" },
  { name: "Williams & Ward 2010 — Environmental Entomology", url: "https://pubmed.ncbi.nlm.nih.gov/22182557/", what: "crops.src.williams" },
  { name: "Penn State Extension — Spotted Lanternfly Management Guide", url: "https://extension.psu.edu/spotted-lanternfly-management-guide", what: "crops.src.psu" },
  { name: "CAST 2002 — Invasive Pest Species", url: "https://www.iatp.org/files/Invasive_Pest_Species_Impacts_on_Agricultural_.htm", what: "crops.src.cast" },
  { name: "Oregon State University Extension — EM 9286", url: "https://extension.oregonstate.edu/catalog/em-9286-nonlethal-bird-deterrent-strategies", what: "crops.src.osu" },
  { name: "USDA APHIS — European Starlings", url: "https://www.aphis.usda.gov/sites/default/files/European-Starlings-WDM-Technical-Series.pdf", what: "crops.src.aphis" },
  // --- and the work that argues the other way -----------------------------
  { name: "Karp et al. 2018 — PNAS", url: "https://doi.org/10.1073/pnas.1800042115", what: "crops.src.karp" },
  { name: "Frank et al. 2019 — PeerJ", url: "https://doi.org/10.7717/peerj.6531", what: "crops.src.frank" },
  { name: "Davis et al. 2011 — Nature", url: "https://doi.org/10.1038/474153a", what: "crops.src.davis" },
  { name: "Scientific Reports 2024 — plant composition in crop margins", url: "https://www.nature.com/articles/s41598-024-63985-x", what: "crops.src.margins" },
  { name: "University of Minnesota Extension — cedar-apple rust", url: "https://extension.umn.edu/plant-diseases/cedar-apple-rust", what: "crops.src.rust" },
  { name: "UC IPM — Lygus bug in strawberry", url: "https://ipm.ucanr.edu/agriculture/strawberry/lygus-bug/", what: "crops.src.lygus" },
];

/**
 * The four figures worth scanning, as tiles rather than a paragraph — a number
 * belongs in a tile (see CLAUDE.md). Each tap opens the study behind it, which
 * is the only reason a reader should believe any of them.
 */
function figures(): Stat[] {
  return [
    {
      icon: "🐝",
      label: t("crops.tile.set.label"),
      value: t("crops.tile.set.value"),
      sub: t("crops.tile.set.sub"),
      explain: t("crops.tile.set.explain"),
      source: "Garibaldi et al. 2013, Science",
    },
    {
      icon: "🐞",
      label: t("crops.tile.control.label"),
      value: t("crops.tile.control.value"),
      sub: t("crops.tile.control.sub"),
      explain: t("crops.tile.control.explain"),
      source: "Albrecht et al. 2020, Ecology Letters",
    },
    {
      icon: "🐦",
      label: t("crops.tile.damage.label"),
      value: t("crops.tile.damage.value"),
      sub: t("crops.tile.damage.sub"),
      explain: t("crops.tile.damage.explain"),
      source: "Mols & Visser 2007, PLOS ONE",
    },
    {
      icon: "🪳",
      label: t("crops.tile.ticks.label"),
      value: t("crops.tile.ticks.value"),
      sub: t("crops.tile.ticks.sub"),
      explain: t("crops.tile.ticks.explain"),
      source: "Williams & Ward 2010, Environmental Entomology",
    },
  ];
}

/** A paragraph, straight from one key. The page is mostly these. */
const p = (key: TKey): HTMLElement => el("p", {}, t(key));

/** A `<li>` whose first few words are bold — the counter-evidence list, same
 *  shape as the sources page's "what we'd challenge first" ranking. */
const boldLead = (lead: TKey, rest: TKey): HTMLElement =>
  el("li", {}, [el("strong", {}, t(lead)), t(rest)]);

export function renderCrops(main: HTMLElement): void {
  clear(main);
  document.title = t("crops.docTitle");

  main.append(
    el("article", { class: "privacy-page crops-page" }, [
      el("h2", { class: "step-title" }, t("crops.title")),
      el("p", { class: "step-lede" }, t("crops.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, (["crops.short1", "crops.short2", "crops.short3", "crops.short4"] as TKey[])
          .map((k) => el("li", {}, t(k)))),
      ]),

      statTiles(figures(), t("crops.tilesLabel")),

      // --- what a flower border actually feeds ---------------------------
      el("h3", {}, t("crops.feedsTitle")),
      p("crops.feeds1"),
      feedsFigure(),

      el("h3", {}, t("crops.fussyTitle")),
      p("crops.fussy1"),
      p("crops.fussy2"),

      // --- what the farms found ------------------------------------------
      el("h3", {}, t("crops.farmsTitle")),
      p("crops.farms1"),
      // The study measured 100–200 m; `length()` renders that in whichever
      // system the reader has chosen, like every other distance in the app.
      // 328 ft and 656 ft are those two figures, not rounder numbers in
      // disguise — they come back as "100 m" and "200 m" in metric.
      el("p", {}, t("crops.farms2", { near: length(328), far: length(656) })),
      p("crops.farms3"),

      el("h3", {}, t("crops.moreFruitTitle")),
      p("crops.moreFruit1"),
      p("crops.moreFruit2"),

      el("h3", {}, t("crops.birdsTitle")),
      p("crops.birds1"),
      p("crops.birds2"),

      // --- the part that goes further than "no harm" ----------------------
      el("h3", {}, t("crops.takeAwayTitle")),
      p("crops.takeAway1"),
      chainFigure(),
      p("crops.takeAway2"),
      p("crops.takeAway3"),

      // --- the claim most likely to be over-quoted ------------------------
      el("h3", {}, t("crops.redirectTitle")),
      p("crops.redirect1"),
      fatFigure(),
      p("crops.redirect2"),
      ledgerFigure(),
      p("crops.redirect3"),

      // --- and the other side --------------------------------------------
      el("h3", {}, t("crops.counterTitle")),
      el("p", {}, t("crops.counterLede")),
      el("div", { class: "counter" }, [
        el("ol", {}, [
          boldLead("crops.counter1", "crops.counter1Rest"),
          boldLead("crops.counter2", "crops.counter2Rest"),
          // The one counter-point carrying a distance. `distanceFloor()` is
          // "1 mile" or "1 km" by the reader's own setting; the source figure
          // is itself a rule of thumb ("usually within a mile"), which is why
          // the sentence says "or so" rather than pretending to the metre.
          el("li", {}, [
            el("strong", {}, t("crops.counter3")),
            t("crops.counter3Rest", { distance: distanceFloor() }),
          ]),
          boldLead("crops.counter4", "crops.counter4Rest"),
          boldLead("crops.counter5", "crops.counter5Rest"),
          boldLead("crops.counter6", "crops.counter6Rest"),
        ]),
      ]),
      p("crops.counterEnd"),

      el("h3", {}, t("crops.sourcesTitle")),
      el("p", {}, t("crops.sourcesLede")),
      el("ul", { class: "who-list" }, STUDIES.map(({ name, url, what }) =>
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
