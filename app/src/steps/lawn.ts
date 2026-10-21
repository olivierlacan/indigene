// "Kill your lawn" (route `#/kill-your-lawn`, `#/kill-your-lawn/<region>`) —
// the Halloween post, and a guide that outlives the holiday.
//
// The joke carries one sentence: a lawn is a zombie, green and feeding almost
// nothing, and it drinks. The decorations stay — only the lights go on a
// timer, for the birds migrating overhead. Then the page gets to work: how to bury a lawn under
// cardboard (sheet mulching, after UC and Oregon State Extension), how to do it
// a bed at a time, and what to plant, layer by layer, for the reader's region.
//
// The picks come from `lib/lawn.ts`: the easiest-to-establish natives in each
// layer, from the region's own list. Ground cover is one layer of five on
// purpose — a lawn swapped for ground cover alone is a smaller lawn — and the
// evergreens get a row of their own for winter.
//
// It is also a post (`data/posts.ts`, with `route`), so it shows in the posts
// index with its date, but lives at the top level: people will be sent here in
// April too.
import { el, clear } from "../ui";
import { knownRegion, navigate } from "../state";
import { t, tx, fmtNumber } from "../lib/i18n";
import type { TKey } from "../locales/en";
import { pageArt } from "../components/page-art";
import { REGIONS, loadPlants } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { regionName } from "../lib/names";
import { regionSwitch } from "../components/region-list";
import { LAWN_LAYERS, lawnPicks } from "../lib/lawn";
import type { LawnLayer } from "../lib/lawn";
import { plantRow, categoryHref, formIcon } from "./region";
import { postWhenLine } from "./posts";
import { POSTS } from "../data/posts";
import type { Plant, PlantForm } from "../types";

/** The evidence, in the order the page leans on it. Names are the pages' own
 *  titles and stay untranslated; `what` is the dictionary key. */
//
// Checked 21 October 2026: each page was opened and the words quoted beside
// its row found in it.
const SOURCES: { name: string; url: string; what: TKey }[] = [
  // Turf covers "three times larger than any irrigated crop" in the US.
  { name: "Milesi et al. 2005 — Environmental Management", url: "https://doi.org/10.1007/s00267-004-0316-2", what: "lawn.src.milesi" },
  // Outdoor use "accounts for nearly 8 billion gallons of water each day,
  // mainly for landscape irrigation"; "The average U.S. household uses more
  // water outdoors than for showering and washing clothes combined."
  { name: "U.S. EPA WaterSense — Outdoor water use", url: "https://www.epa.gov/watersense/outdoor", what: "lawn.src.watersense" },
  // Overwatering "carries away fertilizers"; native plants "reduce the amount
  // of fertilizer needed".
  { name: "U.S. EPA — Nutrient pollution: what you can do in your yard", url: "https://www.epa.gov/nutrientpollution/what-you-can-do-your-yard", what: "lawn.src.epa" },
  // "Birds can get entangled in the fake webs, and so can any small animals
  // that are not strong enough to break free."
  { name: "Forest Preserve District of Will County — Fake spider webs are nightmares for wildlife", url: "https://reconnectwithnature.org/News-Events/The-Buzz/Fake-Spider-Webs-Are-Nightmares-For-Wildlife", what: "lawn.src.webs" },
  // "Many of these webs you'll find are made out of a polyester-like
  // material, which is a petroleum-based product."
  { name: "City of Hayward — Eco-Friendly Halloween", url: "https://hayward-ca.gov/discover/news/sep24/eco-friendly-halloween", what: "lawn.src.hayward" },
  // "These and other birds migrate mostly at night, using the moon and stars
  // to navigate"; "artificial lights at night can disorient and distract
  // birds"; "Turn off exterior decorative lighting from 11pm to 6am now
  // through November 30."
  { name: "Audubon North Carolina — Turn off lights at night to reduce risk for migrating birds", url: "https://www.audubon.org/north-carolina/press-room/turn-lights-night-reduce-risk-migrating-birds", what: "lawn.src.audubon" },
  // "Mow the lawn short as your mower will go and leave the grass on the
  // lawn"; overlap "each edge by 6 inches"; wood chips "3 inches" (4–6 on
  // warm-season lawns); "Green-in-winter lawns take 1 to 3 months.
  // Brown-in-winter and patchy lawns will take at least 3 to 8 months";
  // "Planting should only take place after the lawn has died."
  { name: "UC Cooperative Extension Sacramento — Garden Notes 161: Lawn removal methods", url: "https://oc4h.ucanr.edu/sites/default/files/2016-03/215045.pdf", what: "lawn.src.uc" },
  // "plain-brown corrugated variety, not shiny, glossy, or printed"; "remove
  // any tape or staples"; "Holes can be cut into the cardboard to install new
  // plants"; "Lasagna composting may not smother these weeds" (blackberry,
  // bindweed, morning glory, quackgrass).
  { name: "Oregon State University Extension — Sheet mulching and lasagna composting with cardboard", url: "https://extension.oregonstate.edu/gardening/techniques/sheet-mulch-lasagna-composting", what: "lawn.src.osu" },
  // "cues to care" that provide "a cultural context for ecological function".
  { name: "Nassauer 1995 — Messy ecosystems, orderly frames (Landscape Journal)", url: "https://doi.org/10.3368/lj.14.2.161", what: "lawn.src.nassauer" },
  // Yards with >70% native plant biomass let chickadees breed sustainably.
  { name: "Narango, Tallamy & Marra 2018 — PNAS", url: "https://doi.org/10.1073/pnas.1809259115", what: "lawn.src.narango" },
];

/** Each layer's form on a region roster, for its "see them all" link. The
 *  evergreens cut across forms and have no roster page of their own. */
const LAYER_FORM: Partial<Record<LawnLayer, PlantForm>> = {
  ground: "groundcover",
  flowers: "perennial",
  shrubs: "shrub",
  trees: "tree",
};

const p = (key: TKey): HTMLElement => el("p", {}, t(key));
const lk = (layer: LawnLayer, field: string): TKey => `lawn.layer.${layer}.${field}` as TKey;

/** One layer: what it's for, its picks, and the way to the rest. */
function layerSection(region: RegionDef, layer: LawnLayer, picks: ReturnType<typeof lawnPicks>, all: Plant[]): HTMLElement | null {
  const plants = picks[layer];
  if (!plants.length) return null;
  const form = LAYER_FORM[layer];
  const total = form ? all.filter((x) => x.form === form).length : 0;
  return el("section", { class: "lawn-layer" }, [
    el("h4", {}, [form ? formIcon(form, 20) : null, form ? " " : null, t(lk(layer, "title"))]),
    el("p", { class: "sureness-from" }, t(lk(layer, "why"))),
    el("div", { class: "card-grid" }, plants.map((pl) => plantRow(pl, region.meta.id).node)),
    form && total > plants.length
      ? el("p", { class: "more-link" }, el("a", { href: categoryHref(region, form) },
          t(lk(layer, "all"), { n: fmtNumber(total), region: regionName(region.meta) })))
      : null,
  ]);
}

export async function renderLawn(main: HTMLElement, param?: string): Promise<void> {
  clear(main);
  document.title = t("posts.halloween2026.docTitle");
  const post = POSTS.find((x) => x.key === "halloween2026")!;

  // The region in the address wins; then the reader's own; else they pick.
  const regionId = param ?? knownRegion();
  const region = REGIONS.find((r) => r.meta.id === regionId) ?? null;
  const plants = region ? await loadPlants(region) : [];
  const picks = lawnPicks(plants);

  const options = REGIONS.map((r) => ({
    name: regionName(r.meta),
    href: `#/kill-your-lawn/${r.meta.id}`,
    current: r.meta.id === region?.meta.id,
  }));
  // With a region, a switch to another one. Without, every region as a chip:
  // the switch would show the first region as if it were already picked.
  const switcher = region
    ? regionSwitch(t("lawn.otherRegion"), options)
    : el("div", { class: "region-switch" }, [
        el("span", { class: "region-switch-lede" }, t("lawn.pickRegion")),
        ...options.map((o) => el("a", { class: "region-chip", href: o.href }, o.name)),
      ]);

  main.append(
    el("article", { class: "privacy-page" }, [
      pageArt("killYourLawn"),
      el("h2", { class: "step-title" }, t("posts.halloween2026.title")),
      postWhenLine(post),
      el("p", { class: "step-lede" }, t("posts.halloween2026.lede")),

      el("h3", {}, t("lawn.zombieTitle")),
      p("lawn.zombie1"),
      p("lawn.zombie2"),
      el("p", {}, tx("lawn.zombie3", {
        homegrown: el("a", { href: "#/homegrown" }, t("lawn.zombie3Link")),
      })),

      el("h3", {}, t("lawn.lightsTitle")),
      p("lawn.lights"),

      el("h3", {}, t("lawn.mulchTitle")),
      p("lawn.mulchLede"),
      el("ol", {}, (["lawn.mulch1", "lawn.mulch2", "lawn.mulch3", "lawn.mulch4", "lawn.mulch5"] as TKey[])
        .map((k) => el("li", {}, t(k)))),
      el("p", { class: "note warn" }, [
        el("strong", {}, t("lawn.mulchWarnTitle")),
        ...tx("lawn.mulchWarn", { removing: el("a", { href: "#/removing" }, t("lawn.mulchWarnLink")) }),
      ]),

      el("h3", {}, t("lawn.slowTitle")),
      el("ul", {}, [
        el("li", {}, t("lawn.slow1")),
        el("li", {}, t("lawn.slow2")),
        el("li", {}, t("lawn.slow3")),
      ]),

      el("h3", { id: "picks" }, region
        ? t("lawn.picksTitle", { region: regionName(region.meta) })
        : t("lawn.picksTitleNone")),
      el("p", {}, t("lawn.picksLede")),
      switcher,
      ...(region
        ? LAWN_LAYERS.map((l) => layerSection(region, l, picks, plants))
            .filter((s): s is HTMLElement => s !== null)
        : []),

      el("h3", {}, t("lawn.sourcesTitle")),
      el("ul", { class: "who-list" }, SOURCES.map(({ name, url, what }) =>
        el("li", {}, [
          el("a", { href: url, target: "_blank", rel: "noopener" }, el("strong", {}, name)),
          el("span", { class: "sureness-from" }, ` — ${t(what)}`),
        ])
      )),

      el("div", { class: "btn-row", style: "margin-top:1.5rem" }, [
        el("button", { class: "btn btn-secondary", onClick: () => navigate("posts") }, t("posts.allPosts")),
        el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("privacy.findPlants")),
      ]),
    ]),
  );
  // A region link is a page change, but the reader asked for the picks: land
  // on them, not back at the drawing.
  if (param && region && location.hash) {
    main.querySelector("#picks")?.scrollIntoView();
  }
}
