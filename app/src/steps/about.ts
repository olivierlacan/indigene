// The About page (route `#/about`) — what Indigene is for, and the beliefs that
// decided how it was built.
//
// It's the third of the three "how does this work" pages, and each answers a
// different question a thoughtful person actually asks:
//
//   #/privacy   — how do you treat *me*?
//   #/sources   — how much should I trust the *numbers*?
//   #/about     — why does this exist at all, and who is behind it?
//
// The stances below are not marketing: each one is a decision recorded in
// PROJECT_BRIEF.md that visibly shapes the app. "Sun has error bars" is why the
// estimate is shown as a range; "the soil map is coarse" is why the confirm
// screen offers a ribbon test instead of asserting your soil. Stating them here
// makes the app's behaviour legible rather than eccentric.
//
// ─────────────────────────────────────────────────────────────────────────────
// TODO(olivier): the personal section — who you are and what prompted this.
// Add `about.whoTitle` / `about.who` to `locales/en.ts` and `locales/fr.ts`,
// then uncomment the two lines marked below. It is deliberately absent rather
// than filled with a placeholder: a page that says "[your bio here]" in
// production is worse than a page that doesn't raise the subject yet.
// ─────────────────────────────────────────────────────────────────────────────
import { el, clear } from "../ui";
import { navigate } from "../state";
import { ISSUES_URL } from "../lib/plain";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";

const REPO_URL = "https://github.com/olivierlacan/indigene";
const MIT_URL = "https://github.com/olivierlacan/indigene/blob/main/LICENSE";

/** The honesty stances, as heading + explanation pairs. Each is a decision the
 *  app visibly acts on, not a value statement. */
const STANCES: { title: TKey; body: TKey }[] = [
  { title: "about.stance.plain", body: "about.stance.plainBody" },
  { title: "about.stance.uncertain", body: "about.stance.uncertainBody" },
  { title: "about.stance.sourced", body: "about.stance.sourcedBody" },
  { title: "about.stance.yours", body: "about.stance.yoursBody" },
  { title: "about.stance.portable", body: "about.stance.portableBody" },
  { title: "about.stance.offline", body: "about.stance.offlineBody" },
];

export function renderAbout(main: HTMLElement): void {
  clear(main);
  document.title = t("about.docTitle");

  main.append(
    el("article", { class: "privacy-page" }, [
      el("h2", { class: "step-title" }, t("about.title")),
      el("p", { class: "step-lede" }, t("about.lede")),

      el("h3", {}, t("about.whyTitle")),
      el("p", {}, t("about.why1")),
      // The emphasised word is a real <em>, not markdown asterisks in a string:
      // nothing renders those, and they'd show up literally on the page.
      el("p", {}, tx("about.why2", { here: el("em", {}, t("about.hereEm")) })),

      el("h3", {}, t("about.forTitle")),
      el("p", {}, t("about.forLede")),
      el("ul", {}, [
        el("li", {}, t("about.for1")),
        el("li", {}, t("about.for2")),
        el("li", {}, t("about.for3")),
      ]),
      el("p", {}, t("about.forEnd")),

      el("h3", {}, t("about.stancesTitle")),
      el("p", {}, t("about.stancesLede")),
      el("div", { class: "sureness-group" },
        STANCES.map(({ title, body }) =>
          el("div", { style: "margin-bottom:0.9rem" }, [
            el("p", { style: "margin:0 0 0.15rem;font-weight:700" }, t(title)),
            el("p", { style: "margin:0" }, t(body)),
          ])
        )
      ),

      // TODO(olivier): uncomment once the two keys exist (see the note above).
      // el("h3", {}, t("about.whoTitle")),
      // el("p", {}, t("about.who")),

      el("h3", {}, t("about.freeTitle")),
      el("p", {}, tx("about.free", {
        licence: el("a", { href: MIT_URL, target: "_blank", rel: "noopener" }, t("about.mit")),
      })),
      el("p", {}, t("about.freeMoney")),

      el("h3", {}, t("about.helpTitle")),
      el("p", {}, tx("about.help", {
        repo: el("a", { href: REPO_URL, target: "_blank", rel: "noopener" }, t("privacy.repoLink")),
        issue: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("sources.openIssue")),
      })),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("privacy.home")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
}
