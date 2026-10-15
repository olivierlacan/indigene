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
const SOURCES: { name: string; url: string; what: TKey }[] = [];

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
      el("ul", {}, (["removing.when1", "removing.when2", "removing.when3", "removing.when4"] as TKey[])
        .map((k) => el("li", {}, t(k)))),

      el("h3", {}, t("removing.howTitle")),
      el("p", {}, tx("removing.how1", {
        invasives: el("a", { href: "#/invasives" }, t("removing.how1Link")),
      })),
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
