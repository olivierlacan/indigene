// "Natives next to the vegetables" (route `#/crops`) — the fourth of the
// "how does this work" pages, and the only one that answers an objection
// rather than a question:
//
//   #/privacy   — how do you treat *me*?
//   #/sources   — how much should I trust the *numbers*?
//   #/about     — why does this exist at all?
//   #/crops     — will the wildlife I invite eat my fruit and vegetables?
//
// That last one is the commonest reason somebody who likes the idea of native
// planting doesn't do it, and it is the one objection in the app that has a
// real literature behind it: farms have run this experiment, on commercial
// acreage, with the yield weighed at the end. So the page is built out of what
// they measured, and every figure on it names the study it came from — the same
// bargain `#/sources` strikes for the numbers in the catalog.
//
// It concedes the parts that are true (bird damage to soft fruit is real; the
// effect is an average, not a law) in a section of its own, high enough up to
// be found. A page that only argued one way would be an advert, and the reader
// this page is for has already heard the advert.
//
// The plant pages carry one line into here (`cropsLine` in steps/plant.ts),
// beside the look-alike warning and the native swap.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { statTiles, type Stat } from "../components/stat-card";
import { t } from "../lib/i18n";
import { length } from "../lib/units";
import type { TKey } from "../locales/en";

/**
 * The evidence behind every figure on this page, in reading order.
 *
 * `name` and `url` are not translated: an author list and a journal are proper
 * nouns, and a reader following one of these links lands on an English paper
 * whatever language the app is in. Only `what` — the few words saying what the
 * study measured — is a dictionary key.
 *
 * DOIs where the publisher issues one, because a DOI outlives a site redesign.
 */
const STUDIES: { name: string; url: string; what: TKey }[] = [
  {
    name: "Garibaldi et al. 2013 — Science",
    url: "https://doi.org/10.1126/science.1230200",
    what: "crops.src.garibaldi",
  },
  {
    name: "Klein et al. 2007 — Proceedings of the Royal Society B",
    url: "https://doi.org/10.1098/rspb.2006.3721",
    what: "crops.src.klein",
  },
  {
    name: "Blaauw & Isaacs 2014 — Journal of Applied Ecology",
    url: "https://doi.org/10.1111/1365-2664.12257",
    what: "crops.src.blaauw14",
  },
  {
    name: "Blaauw & Isaacs 2015 — Biological Control",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S1049964415300207",
    what: "crops.src.blaauw15",
  },
  {
    name: "Morandin, Long & Kremen 2014 — Agriculture, Ecosystems & Environment",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0167880914001662",
    what: "crops.src.morandin",
  },
  {
    name: "Albrecht et al. 2020 — Ecology Letters",
    url: "https://doi.org/10.1111/ele.13576",
    what: "crops.src.albrecht",
  },
  {
    name: "Forister et al. 2015 — PNAS",
    url: "https://doi.org/10.1073/pnas.1423042112",
    what: "crops.src.forister",
  },
  {
    name: "Monteagudo et al. 2023 — Pest Management Science",
    url: "https://doi.org/10.1002/ps.7421",
    what: "crops.src.monteagudo",
  },
  {
    name: "Díaz-Siefer et al. 2022 — Journal of Pest Science",
    url: "https://doi.org/10.1007/s10340-021-01438-4",
    what: "crops.src.diaz",
  },
  {
    name: "Mols & Visser 2007 — PLOS ONE",
    url: "https://doi.org/10.1371/journal.pone.0000202",
    what: "crops.src.mols",
  },
  {
    name: "Karp et al. 2018 — PNAS",
    url: "https://doi.org/10.1073/pnas.1800042115",
    what: "crops.src.karp",
  },
  {
    name: "CAST 2002 — Invasive Pest Species",
    url: "https://www.iatp.org/files/Invasive_Pest_Species_Impacts_on_Agricultural_.htm",
    what: "crops.src.cast",
  },
  {
    name: "Oregon State University Extension — EM 9286",
    url: "https://extension.oregonstate.edu/catalog/em-9286-nonlethal-bird-deterrent-strategies",
    what: "crops.src.osu",
  },
  {
    name: "USDA APHIS — European Starlings",
    url: "https://www.aphis.usda.gov/sites/default/files/European-Starlings-WDM-Technical-Series.pdf",
    what: "crops.src.aphis",
  },
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
      icon: "💰",
      label: t("crops.tile.payback.label"),
      value: t("crops.tile.payback.value"),
      sub: t("crops.tile.payback.sub"),
      explain: t("crops.tile.payback.explain"),
      source: "Blaauw & Isaacs 2014, Journal of Applied Ecology",
    },
  ];
}

/** A paragraph, straight from one key. The page is mostly these. */
const p = (key: TKey): HTMLElement => el("p", {}, t(key));

/** A `<li>` whose first few words are bold — the caveats, same shape as the
 *  sources page's assumption list. */
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

      el("h3", {}, t("crops.mouthTitle")),
      p("crops.mouth1"),

      el("h3", {}, t("crops.fussyTitle")),
      p("crops.fussy1"),
      p("crops.fussy2"),

      el("h3", {}, t("crops.farmsTitle")),
      p("crops.farms1"),
      // The study measured 100\u2013200 m; `length()` renders that in whichever
      // system the reader has chosen, like every other distance in the app.
      // 328 ft and 656 ft are those two figures, not rounder numbers in
      // disguise \u2014 they come back as "100 m" and "200 m" in metric.
      el("p", {}, t("crops.farms2", { near: length(328), far: length(656) })),
      p("crops.farms3"),

      el("h3", {}, t("crops.moreFruitTitle")),
      p("crops.moreFruit1"),
      p("crops.moreFruit2"),

      el("h3", {}, t("crops.birdsTitle")),
      p("crops.birds1"),
      p("crops.birds2"),
      p("crops.birds3"),

      // The concessions, in the middle of the page rather than buried at the
      // end: a reader who came here sceptical is owed them before the sources.
      el("h3", {}, t("crops.rightTitle")),
      el("p", {}, t("crops.rightLede")),
      el("ul", {}, [
        boldLead("crops.right1", "crops.right1Rest"),
        boldLead("crops.right2", "crops.right2Rest"),
        boldLead("crops.right3", "crops.right3Rest"),
        boldLead("crops.right4", "crops.right4Rest"),
      ]),

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
