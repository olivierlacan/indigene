// The no-location entrance: the regions and featured-plants cards that used to
// live on the homepage, for people who'd rather browse than share where they
// are. The automatic flow stays one tap away at the bottom.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS } from "../lib/plants";
import { featuredSummary } from "../lib/explore";
import { zoneChip } from "../components/zone-chip";
import { ISSUES_URL } from "../lib/plain";
import { t, tn, tx } from "../lib/i18n";
import { commonName, regionName, regionReference } from "../lib/names";

export function renderBrowse(main: HTMLElement): void {
  clear(main);
  document.title = t("browse.docTitle");

  main.append(
    el("h2", { class: "step-title" }, t("browse.title")),
    el("p", { class: "step-lede" }, t("browse.lede")),
    el("div", { class: "card" }, [
      el("h3", {}, tn("browse.regionsTitle", REGIONS.length)),
      el("p", {}, t("browse.regionsLede")),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => el("li", { style: "margin-bottom:0.3rem" }, [
          el("a", { href: `#/regions/${r.meta.id}`, style: "font-weight:650" }, regionName(r.meta)),
          ` — ${regionReference(r.meta)} `,
          zoneChip(r.meta),
        ]))
      ),
      el("p", { style: "margin:0" },
        tx("browse.outside", {
          link: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("browse.outsideLink")),
        })
      ),
    ]),
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("h3", {}, t("browse.plantTitle")),
      el("p", {}, t("browse.plantLede")),
      el("ul", { style: "margin:0.4rem 0 0.6rem;padding-left:1.2rem" },
        REGIONS.map((r) => {
          const p = featuredSummary(r);
          if (!p) return null;
          return el("li", { style: "margin-bottom:0.35rem" }, [
            el("a", { href: `#/plants/${p.id}`, style: "font-weight:650" }, commonName(p)),
            " — ",
            el("a", { href: `#/regions/${r.meta.id}` }, regionName(r.meta)),
          ]);
        })
      ),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("regions") }, t("browse.exploreBtn")),
    ]),
    // The third way in: not a plant or a place, but a thing to do this weekend.
    // It's the only entrance that answers "what's the right season for this?",
    // which is the question a gardener has standing over a plant they already own.
    el("div", { class: "card", style: "margin-top:1rem" }, [
      el("h3", {}, t("planting.title")),
      el("p", {}, t("planting.lede")),
      el("button", { class: "btn btn-secondary btn-block", onClick: () => navigate("planting") }, t("planting.allTechniques")),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("browse.startFromSpot")),
    ])
  );
}
