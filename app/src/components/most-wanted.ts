// "Most-wanted invasives" — the section on a region's page that names the
// invasive plants worth pulling first there.
//
// A ranked list of rows, each a link to the plant's own page
// (`#/invasives/<id>`), where the marks, the ratings and the photographs live.
// The row carries what a scan needs — rank, picture, name, how hard it pushes,
// how often it's been seen — and nothing else. No folding: see "No folding
// boxes" in CLAUDE.md.
import { el } from "../ui";
import type { RegionDef } from "../lib/plants";
import { mostWanted, regionIsRated, sightingsAsOf, type WantedRow } from "../lib/invasives";
import { nameLines } from "../lib/names";
import { t, fmtNumber, fmtDate } from "../lib/i18n";
import { invasiveThumb } from "./plant-thumb";
import { cardStats } from "./card-stats";
import { sectionHeading } from "./section-link";
import { pressureBadge } from "../steps/lookalikes";

/** The section, or nothing for a region with no list yet. */
export function mostWantedSection(region: RegionDef): HTMLElement[] {
  const rows = mostWanted(region.meta.id);
  if (!rows.length) return [];
  return [
    el("section", { style: "margin-top:1.5rem" }, [
      sectionHeading("#/invasives", "🚩", t("wanted.title"), fmtNumber(rows.length)),
      el("p", { class: "obs-section-lede" },
        t(regionIsRated(region.meta.id) ? "wanted.lede" : "wanted.ledeUnrated")),
      wantedList(rows),
      el("p", { class: "confidence", style: "margin:0.6rem 0 0" },
        t("wanted.countsNote", { date: fmtDate(Date.parse(sightingsAsOf)) })),
    ]),
  ];
}

/** One region's list, as rows — shared by the region page and the index. */
export function wantedList(rows: WantedRow[]): HTMLElement {
  return el("ol", { class: "wanted-list" }, rows.map((r) => el("li", {}, [wantedRow(r)])));
}

/** A row: the name is the link, stretched over the whole card (the look-alike
 *  cards' trick), so the badge can stay a button of its own above it. */
function wantedRow(row: WantedRow): HTMLElement {
  const { invasive: inv, link } = row;
  const names = nameLines(inv);
  return el("article", { class: "card wanted-row" }, [
    el("span", { class: "wanted-rank", "aria-label": t("wanted.rankAria", { n: fmtNumber(row.rank) }) },
      fmtNumber(row.rank)),
    invasiveThumb(inv.id, inv.form, { attrs: { style: "flex:0 0 auto" } }),
    el("div", { class: "wanted-names" }, [
      el("h4", { class: "wanted-name" }, [el("a", { href: `#/invasives/${inv.id}` }, names.title)]),
      names.sub
        ? el("div", { class: names.subIsLatin ? "plant-latin wanted-sub" : "wanted-sub" }, names.sub)
        : null,
      el("div", { class: "wanted-meta" }, [
        row.level ? pressureBadge(row.level, link.listing) : null,
        row.sightings != null
          ? cardStats([{
              icon: "📷",
              value: fmtNumber(row.sightings),
              label: t("wanted.sightings", { n: fmtNumber(row.sightings) }),
            }])
          : null,
      ]),
    ]),
  ]);
}
