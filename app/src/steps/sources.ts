// The "Where our numbers come from" page (route `#/sources`). The companion to
// Privacy & safety: that page says how we treat *you*, this one says how much to
// trust the *numbers*.
//
// Its job is not to reassure. Indigene puts confident-looking figures in front of
// people — "391 caterpillar species", "24 m tall", a 0–100 score — and some of
// those are counted from open datasets while others are our own judgment. A
// reader deserves to know which is which, and where we're most likely wrong. So
// this page ends by naming the weakest numbers in the app and asking to be
// corrected, rather than waiting to be caught.
//
// It also answers the question that follows "where did this come from?" —
// *why believe that place?* The four tests a source has to pass, and the fact
// that a person, not a dataset, writes every row. The developer-facing version
// of the same policy is `DATA_SOURCES.md` § "How a source gets in".
//
// Since localization it also answers a second "how do you know that?": where the
// *names* come from. A French reader seeing "Chêne pédonculé" where an English
// one sees "Pedunculate Oak" is owed the same accounting as a host count — so
// the national reference lists behind every vernacular name are listed here too.
//
// Written for the same audience as the rest of the app — including kids and
// grandparents — so: plain words, no jargon left unexplained, and the honest
// caveat stated rather than buried.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { DATA_SOURCES_URL, ISSUES_URL } from "../lib/plain";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { NAME_SOURCE_INFO } from "../lib/names";
import type { ReferenceList } from "../lib/names";

const REPO_URL = "https://github.com/olivierlacan/indigene";
const MATRIX_DOI = "https://doi.org/10.1002/ece3.73004";

type Sureness = "counted" | "calculated" | "estimated";

/**
 * One "where this number comes from" row: what the number is, and who it came
 * from. How sure we are isn't repeated per row — it's the heading the row sits
 * under, so the reader learns each meaning once instead of decoding a badge
 * eleven times.
 */
function figure(name: string, ...from: (string | Node)[]): HTMLElement {
  return el("li", {}, [
    el("strong", {}, name),
    el("span", { class: "sureness-from" }, [" ", ...from]),
  ]);
}

/** The common shape: a bolded label from one key, its explanation from another. */
const figureKeys = (name: TKey, from: TKey): HTMLElement => figure(t(name), t(from));

/**
 * A group of figures that are all sure in the same way. The heading carries the
 * kind, the line under it says what the kind means in plain words, and the
 * groups run firmest first — counted, then calculated, then estimated — so the
 * order itself is the ranking.
 */
function surenessGroup(kind: Sureness, heading: string, meaning: string, rows: HTMLElement[]): HTMLElement {
  return el("section", { class: `sureness-group sureness-${kind}` }, [
    el("h4", {}, heading),
    el("p", { class: "sureness-meaning" }, meaning),
    el("ul", { class: "who-list" }, rows),
  ]);
}

/** A `<li>` whose first sentence is bold — the "assumption" and "challenge" lists. */
const boldLead = (lead: TKey, rest: TKey): HTMLElement =>
  el("li", {}, [el("strong", {}, t(lead)), t(rest)]);

/** The reference lists behind every plant and animal name, in reading order.
 *  All three speak the French this app is written in — French of France. The
 *  Canadian list used to sit in the middle of them; see `lib/names.ts`. */
const NAME_SOURCES: { src: ReferenceList; what: TKey }[] = [
  { src: "taxref", what: "names.src.taxref" },
  { src: "bdtfx", what: "names.src.bdtfx" },
  { src: "wikidata", what: "names.src.wikidata" },
];

export function renderSources(main: HTMLElement): void {
  clear(main);
  document.title = t("sources.docTitle");

  main.append(
    el("article", { class: "privacy-page sources-page" }, [
      el("h2", { class: "step-title" }, t("sources.title")),
      el("p", { class: "step-lede" }, t("sources.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, (["sources.short1", "sources.short2", "sources.short3", "sources.short4", "sources.short5"] as TKey[])
          .map((k) => el("li", {}, t(k)))),
      ]),

      el("h3", {}, t("sources.everyNumberTitle")),
      el("p", {}, t("sources.everyNumberLede")),

      surenessGroup("counted", t("sources.counted"), t("sources.countedMeaning"), [
        figureKeys("sources.fig.host", "sources.fig.hostFrom"),
        figureKeys("sources.fig.native", "sources.fig.nativeFrom"),
        figureKeys("sources.fig.ecoregion", "sources.fig.ecoregionFrom"),
        figureKeys("sources.fig.soil", "sources.fig.soilFrom"),
        figureKeys("sources.fig.climate", "sources.fig.climateFrom"),
        figureKeys("sources.fig.elevation", "sources.fig.elevationFrom"),
        // The one row whose sentence has an emphasis inside it, so it can't be
        // a plain two-key row: "how *much* an animal depends on it is ours".
        figure(t("sources.fig.ties"),
          t("sources.fig.tiesFrom1"),
          el("em", {}, t("sources.fig.tiesEm")),
          t("sources.fig.tiesFrom2")),
      ]),

      surenessGroup("calculated", t("sources.calculated"), t("sources.calculatedMeaning"), [
        figureKeys("sources.fig.sun", "sources.fig.sunFrom"),
        figureKeys("sources.fig.zone", "sources.fig.zoneFrom"),
      ]),

      surenessGroup("estimated", t("sources.estimated"), t("sources.estimatedMeaning"), [
        figureKeys("sources.fig.size", "sources.fig.sizeFrom"),
        figureKeys("sources.fig.scores", "sources.fig.scoresFrom"),
      ]),

      // The question the section above provokes: fine, but why believe *those*
      // places? Answered before the names, so the name lists below read as an
      // instance of the policy rather than a separate courtesy.
      el("h3", {}, t("sources.trustTitle")),
      el("p", {}, t("sources.trustLede")),
      el("ul", {}, [
        boldLead("sources.trust1", "sources.trust1Rest"),
        boldLead("sources.trust2", "sources.trust2Rest"),
        boldLead("sources.trust3", "sources.trust3Rest"),
        boldLead("sources.trust4", "sources.trust4Rest"),
      ]),
      el("p", {}, t("sources.trustCall")),
      el("p", {}, t("sources.trustRefused")),

      // Names are a claim like any other, so they get the same accounting.
      el("h3", {}, t("names.sourcesTitle")),
      el("p", {}, t("names.sourcesLede")),
      // *Whose* French, before the lists — otherwise the reader has no way to
      // tell why a Canadian list isn't among them.
      el("p", {}, t("names.sourcesLocale")),
      el("ul", { class: "who-list" }, NAME_SOURCES.map(({ src, what }) =>
        el("li", {}, [
          el("a", { href: NAME_SOURCE_INFO[src].url, target: "_blank", rel: "noopener" },
            el("strong", {}, NAME_SOURCE_INFO[src].label)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),
      el("p", {}, t("names.sourcesGap")),
      el("p", {}, t("names.sourcesPending")),

      el("h3", {}, t("sources.assumptionsTitle")),
      el("p", {}, t("sources.assumptionsLede")),
      el("ul", {}, [
        boldLead("sources.assume1", "sources.assume1Rest"),
        boldLead("sources.assume2", "sources.assume2Rest"),
        boldLead("sources.assume3", "sources.assume3Rest"),
        boldLead("sources.assume4", "sources.assume4Rest"),
        boldLead("sources.assume5", "sources.assume5Rest"),
      ]),

      el("h3", {}, t("sources.challengeTitle")),
      el("p", {}, t("sources.challengeLede")),
      el("ol", {}, [
        boldLead("sources.chal1", "sources.chal1Rest"),
        boldLead("sources.chal2", "sources.chal2Rest"),
        boldLead("sources.chal3", "sources.chal3Rest"),
        boldLead("sources.chal4", "sources.chal4Rest"),
        boldLead("sources.chal5", "sources.chal5Rest"),
      ]),

      el("h3", {}, t("sources.tellUsTitle")),
      el("p", {}, tx("sources.tellUs", {
        repo: el("a", { href: REPO_URL, target: "_blank", rel: "noopener" }, t("privacy.repoLink")),
        issue: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("sources.openIssue")),
      })),
      el("p", {}, tx("sources.fullList", {
        doc: el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("sources.dataDoc")),
        matrix: el("a", { href: MATRIX_DOI, target: "_blank", rel: "noopener" }, "Gaytán et al. 2026"),
      })),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
