// "Essential plants" (route `#/plants/essential`, `#/plants/essential/<region>`)
// — the few natives that feed most of the caterpillars, and why Indigene puts
// them first.
//
// Ecologists call these keystone plants. The app's label is "Essential",
// because the arch metaphor asks the reader to have looked closely at an arch;
// this page is the one place that word is set out in full, with the picture we
// use instead: a load-bearing wall. Every "Essential" badge, tile and dialog
// leads here.
//
// The study behind the label is careful to call these plants necessary, not
// sufficient, and so is the page: a mix of natives with essential ones in it
// (Narango, Tallamy & Shropshire 2020, Discussion and Fig. 3).
//
// Shaped like `#/kill-your-lawn`: a short why, then the reader's region's list
// (their own region when the app knows it, a chip row when it doesn't), sorted
// by caterpillar count.
import { el, clear } from "../ui";
import { knownRegion, navigate } from "../state";
import { t, tx, getLang } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { REGIONS, loadPlants } from "../lib/plants";
import { regionName, commonName } from "../lib/names";
import { regionSwitch } from "../components/region-list";
import { statTiles } from "../components/stat-card";
import { byCaterpillars } from "../lib/roster-sort";
import { plantRow } from "./region";
import { pageArt, figureArt } from "../components/page-art";
import { ESSENTIAL_SEGMENT } from "../lib/routes";

export const ESSENTIAL_ROUTE = `#/plants/${ESSENTIAL_SEGMENT}`;

/** The region a `plants/essential/<region>` param names, or null for the page
 *  alone. `undefined` when the param isn't this page at all. */
export function essentialParam(param: string): string | null | undefined {
  if (param === ESSENTIAL_SEGMENT) return null;
  const prefix = `${ESSENTIAL_SEGMENT}/`;
  return param.startsWith(prefix) ? param.slice(prefix.length) : undefined;
}

const SOURCES: { name: string; url: string; what: TKey }[] = [
  { name: "Narango, Tallamy & Shropshire 2020 — Nature Communications", url: "https://doi.org/10.1038/s41467-020-19565-4", what: "homegrown.src.keystone" },
  { name: "Paine 1969 — The American Naturalist", url: "https://doi.org/10.1086/282586", what: "essential.src.paine" },
  { name: "Tallamy 2020 — Nature's Best Hope (Timber Press)", url: "https://www.hachettebookgroup.com/titles/douglas-w-tallamy/natures-best-hope/9781604699005/", what: "homegrown.src.book" },
];

const p = (key: TKey): HTMLElement => el("p", {}, t(key));

export async function renderEssential(main: HTMLElement, regionParam: string | null): Promise<void> {
  clear(main);
  document.title = t("essential.docTitle");

  // The region in the address wins; then the reader's own; else they pick.
  const regionId = regionParam ?? knownRegion();
  const region = REGIONS.find((r) => r.meta.id === regionId) ?? null;
  const plants = region
    ? byCaterpillars((await loadPlants(region)).filter((x) => x.keystone), commonName, getLang())
    : [];

  const options = REGIONS.map((r) => ({
    name: regionName(r.meta),
    href: `${ESSENTIAL_ROUTE}/${r.meta.id}`,
    current: r.meta.id === region?.meta.id,
  }));
  const switcher = region
    ? regionSwitch(t("lawn.otherRegion"), options)
    : el("div", { class: "region-switch" }, [
        el("span", { class: "region-switch-lede" }, t("lawn.pickRegion")),
        ...options.map((o) => el("a", { class: "region-chip", href: o.href }, o.name)),
      ]);

  main.append(
    el("article", { class: "privacy-page" }, [
      pageArt("essential"),
      el("h2", { class: "step-title" }, t("essential.title")),
      el("p", { class: "step-lede" }, t("essential.lede")),

      statTiles([
        { icon: "🌳", label: t("essential.tileGenera"), value: "14%", sub: t("essential.tileGeneraSub"), explain: t("essential.figures") },
        { icon: "🐛", label: t("essential.tileCaterpillars"), value: "90%", sub: t("essential.tileCaterpillarsSub"), explain: t("essential.figures") },
      ], t("essential.tilesLabel")),

      el("h3", {}, t("essential.wallTitle")),
      p("essential.wall"),
      el("p", {}, tx("essential.birds", {
        link: el("a", { href: "#/homegrown" }, t("essential.birdsLink")),
      })),

      // Necessary, not sufficient: the study's own conclusion, so the page
      // never reads as "plant only these".
      el("h3", {}, t("essential.mixTitle")),
      p("essential.mix1"),
      p("essential.mix2"),

      el("h3", {}, t("essential.wordTitle")),
      p("essential.word"),
      figureArt("keystone", t("essential.figKeystone")),
      p("essential.word2"),

      el("h3", { id: "list" }, region
        ? t("essential.listTitle", { region: regionName(region.meta) })
        : t("essential.listTitleNone")),
      region ? el("p", {}, t("essential.listLede")) : null,
      switcher,
      region
        ? el("div", { class: "card-grid" }, plants.map((pl) => plantRow(pl, region.meta.id).node))
        : null,

      el("h3", {}, t("homegrown.sourcesTitle")),
      el("p", {}, t("essential.figures")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("essential.allPlants")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
  if (regionParam && region && location.hash) {
    main.querySelector("#list")?.scrollIntoView();
  }
}
