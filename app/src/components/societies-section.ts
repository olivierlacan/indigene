// "Now go and meet somebody" — the rung after the roster.
//
// The app answers *what belongs in this corner* well and has never answered the
// question that follows it. Somebody plants six natives, likes it, and has
// nowhere obvious to go next. The groups listed here are that next step: plant
// sales, walks, and people who know this region's flora better than a list can.
//
// It sits last on the region page on purpose. A reader arrives wanting plants;
// they leave, if we have done the job, wanting company.
//
// No count in the heading and no page of its own, so `sectionTitle` rather than
// `sectionHeading` — these are links off the site, and a chevron would promise
// an Indigene page that does not exist. Each link opens in a new tab for the
// same reason: it is somebody else's house.
import { el } from "../ui";
import { sectionTitle } from "./section-link";
import { societiesFor } from "../data/societies";
import { t } from "../lib/i18n";

/** The groups for a region, or nothing at all where we have researched none —
 *  a heading over an empty list is worse than no heading. */
export function societiesSection(regionId: string): HTMLElement[] {
  const groups = societiesFor(regionId);
  if (!groups.length) return [];
  return [
    el("section", { class: "societies", style: "margin-top:1.5rem" }, [
      sectionTitle("🤝", t("society.title")),
      el("p", { class: "obs-section-lede" }, t("society.lede")),
      el(
        "ul",
        { class: "society-list" },
        groups.map((s) =>
          el("li", { class: "society-row" }, [
            el(
              "a",
              { href: s.url, target: "_blank", rel: "noopener", class: "society-name" },
              s.name,
            ),
            el("span", { class: "society-what" }, t(`society.what.${s.what}` as const)),
          ]),
        ),
      ),
    ]),
  ];
}
