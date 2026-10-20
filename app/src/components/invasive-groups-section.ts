// "Local invasive plant groups" — under a region's list of invasives, the
// partnerships a reader can join, ask or report to. Same shape as the native
// plant groups on the region page (`societies-section.ts`): links off the site,
// so a plain title and a new tab, and nothing at all where we have none.
import { el } from "../ui";
import { sectionTitle } from "./section-link";
import { invasiveGroupsFor } from "../data/invasive-groups";
import { t } from "../lib/i18n";

export function invasiveGroupsSection(regionId: string): HTMLElement[] {
  const groups = invasiveGroupsFor(regionId);
  if (!groups.length) return [];
  return [
    el("section", { class: "societies", style: "margin-top:1.25rem" }, [
      sectionTitle("🤝", t("groups.title")),
      el("p", { class: "obs-section-lede" }, t("groups.lede")),
      el("ul", { class: "society-list" }, groups.map((g) =>
        el("li", { class: "society-row" }, [
          el("a", { href: g.url, target: "_blank", rel: "noopener", class: "society-name" }, g.name),
          el("span", { class: "society-what" }, t(`groups.what.${g.what}` as const)),
        ]))),
    ]),
  ];
}
