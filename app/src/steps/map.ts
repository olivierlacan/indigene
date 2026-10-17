// The map page: every region Indigene has a plant list for, on a map (issue
// #254). The regions page lists them; this one answers "is mine covered?" at
// a glance, without reading the list.
//
// The world comes first, in Equal Earth (every country at its true size, the
// projection the UN endorsed in 2026), as the overview. It names nothing: at
// phone width a continent is a few dozen pixels. Then one section per
// continent, each close enough that every region carries its name — and the
// name is the way into the region.
import { el, clear } from "../ui";
import { COVERAGE_MAPS } from "../data/coverage-map";
import { coverageFrame } from "../components/coverage-map";
import { REGIONS } from "../lib/plants";
import { ISSUES_URL } from "../lib/plain";
import { t, tx, fmtNumber } from "../lib/i18n";

/** Each continent's heading. A continent the generator draws but this table
 *  doesn't name fails the unit test before it ships nameless. */
export const CONTINENT_NAMES: Record<string, Parameters<typeof t>[0]> = {
  "north-america": "map.continent.north-america",
  europe: "map.continent.europe",
  asia: "map.continent.asia",
  oceania: "map.continent.oceania",
};

export function renderMap(main: HTMLElement): void {
  clear(main);
  document.title = t("map.docTitle");
  const [world, ...continents] = COVERAGE_MAPS;

  main.append(
    el("h2", { class: "step-title" }, t("map.title")),
    el("p", { class: "step-lede" }, t("map.lede", { n: fmtNumber(REGIONS.length) })),
    el("figure", { class: "coverage-world" }, [coverageFrame(world, t("map.worldAlt"))]),
    el("div", { class: "coverage-continents" }, continents.map((m) =>
      el("section", { class: "coverage-continent" }, [
        el("h3", {}, t(CONTINENT_NAMES[m.id])),
        // The names over the picture are the content; the picture itself
        // only places them, so it is decoration to a screen reader.
        coverageFrame(m, ""),
      ])
    )),
    el("p", { class: "more-link", style: "margin:1rem 0 0" }, [
      el("a", { href: "#/regions" }, t("map.asList")),
    ]),
    el("p", { class: "more-link", style: "margin:0.4rem 0 0" }, tx("explore.missing", {
      link: el("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, t("location.coverageAsk")),
    })),
  );
}
