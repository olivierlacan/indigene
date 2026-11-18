// "Your first planting day" (route `#/volunteer`, `#/volunteer/kit`) — what a
// volunteer needs to know before a native planting, so an organizer with
// forty people and four shovels can send one link instead of giving the talk.
//
// The page is the short version and four rows. Three of the guides are for
// any planter and live where a gardener would look (`#/planting/pots`,
// `#/planting/roots`, `#/removing/disposal`); only "What to bring" is the
// volunteer's own. `#/planting` links back here, so each page is the other's
// way on.
//
// It doesn't overrule the organizer: site rules win, and the page says so.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { t, tx } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { pageArt } from "../components/page-art";
import { GUIDES, guideAt, guideHref } from "../lib/howto";
import { guideRow, invasivesHref, renderGuide } from "./howto";

/** The order a volunteer needs them in: plant, weeds, roots, kit. */
const ORDER = ["pots", "disposal", "roots", "kit"];

function renderIndex(main: HTMLElement): void {
  clear(main);
  document.title = t("volunteer.docTitle");
  const short: TKey[] = ["volunteer.short1", "volunteer.short2", "volunteer.short3", "volunteer.short4", "volunteer.short5"];
  const guides = ORDER.map((slug) => GUIDES.find((g) => g.slug === slug)!);

  main.append(
    el("article", { class: "privacy-page" }, [
      pageArt("volunteer"),
      el("h2", { class: "step-title" }, t("volunteer.title")),
      el("p", { class: "step-lede" }, t("volunteer.lede")),

      el("div", { class: "note info lede-note" }, [
        el("strong", {}, t("privacy.shortVersion")),
        el("ul", {}, short.map((key) => el("li", {}, t(key)))),
      ]),

      el("h3", {}, t("volunteer.guidesTitle")),
      el("div", { class: "guide-rows" }, guides.map(guideRow)),
      el("p", {}, tx("volunteer.why2", {
        planting: el("a", { href: "#/planting" }, t("volunteer.why2Link")),
      })),

      el("h3", {}, t("volunteer.whyTitle")),
      el("p", {}, tx("volunteer.why1", {
        invasives: el("a", { href: invasivesHref() }, t("volunteer.why1Link")),
      })),

      el("h3", { id: "organizers" }, t("volunteer.orgTitle")),
      el("p", {}, t("volunteer.org1")),
      el("p", {}, tx("volunteer.org2", {
        removing: el("a", { href: "#/removing" }, t("volunteer.org2Link")),
      })),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("a", { class: "btn btn-primary", href: guideHref(guides[0]) }, t("volunteer.start")),
      ]),
    ]),
  );
}

function renderNotFound(main: HTMLElement, slug: string): void {
  clear(main);
  document.title = t("howto.notFoundTitle");
  main.append(
    el("h2", { class: "step-title" }, t("howto.notFoundTitle")),
    el("p", { class: "step-lede" }, t("howto.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("volunteer") }, t("volunteer.allGuides")),
    ]),
  );
}

export function renderVolunteer(main: HTMLElement, param?: string): void {
  if (!param) return renderIndex(main);
  const guide = guideAt("volunteer", param);
  return guide ? renderGuide(main, guide) : renderNotFound(main, param);
}
