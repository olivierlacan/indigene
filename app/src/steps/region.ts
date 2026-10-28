// A region's full roster (#/regions/<id>) and its per-category pages
// (#/regions/<id>/trees, …/shrubs, …). The explore page leads with one
// showcase plant per region; these are the "show me everything" answers
// behind it — every native in the region's seed list, each row linking to
// the plant's page. Category pages are shareable straight-to-the-point URLs
// ("the trees of the PNW") and let you jump to the same category in another
// region without going back through the roster.
import { FORM_ORDER } from "../lib/forms";
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import { formCountForRegion } from "../lib/registry";
import type { RegionDef } from "../lib/plants";
import { filterField, highlight, norm } from "../components/filter-field";
import type { FilterRow, FilterSection } from "../components/filter-field";
import { silhouetteFor } from "../components/plant-card";
import { plantThumb } from "../components/plant-thumb";
import { readingSection } from "../components/reading-list";
import { societiesSection } from "../components/societies-section";
import { sectionHeading } from "../components/section-link";
import { keystoneIcon } from "../components/keystone-icon";
import { regionStatGrid } from "../components/region-stats";
import { wildlifeRegionGroups } from "../components/wildlife-chips";
import { wildlifeIndex } from "../lib/wildlife";
import { pioneerFor, pioneersForRegion } from "../lib/pioneers";
import { pioneerCard, pressureFooter } from "../components/pioneer-card";
import { PIONEER_ICON, CONCRETE_BOTANY_URL } from "../data/pioneers";
import { regionRefLine, zoneChip } from "../components/zone-chip";
import { regionBoundaryCard } from "../components/region-boundary";
import type { PioneerEntry, Plant, PlantForm } from "../types";
import { t, tn, tx, fmtNumber, getLang } from "../lib/i18n";
import { commonName, nameLines, regionName, regionNote, regionReference, localNameCoverage } from "../lib/names";
import { flagRow } from "../components/flags";
import { reportRosterUntranslated, reportUntranslated } from "../components/wip-banner";
import { mostWantedSection } from "../components/most-wanted";
import { mappedLookalikeIds } from "../lib/lookalikes";
import { alternativeCountForRegion } from "../lib/alternatives";
import { pioneersUntranslated } from "../lib/prose";
import { addressParam } from "../lib/routes";
import { rosterQuery, rosterView, sortRoster, ROSTER_KEYS } from "../lib/roster-sort";
import { passesFilters, traitsOf } from "../lib/filter-traits";
import { door } from "../components/plant-door";
import { lookalikeIcon, alternativeIcon } from "../components/door-icons";
import { rosterControls, caterpillarLede, countTag } from "../components/roster-controls";
import { isCrossChecked } from "../data/cross-checks";
import { SOURCES_ROUTE } from "../lib/plain";
import { regionGrowth } from "../components/growth-chart";
import { conservationFooter } from "../components/conservation-note";
import { AT_RISK, atRiskFirst, threatLevel } from "../lib/conservation";

/** The category headings. A function, not a record: a record built at import
 *  time would be stuck in whichever language loaded first. */
const formLabel = (f: PlantForm): string => t(`form.${f}` as const);
/** URL slug for each form — plural, human, stable ("…/regions/pnw/trees"). */
const FORM_SLUGS: Record<PlantForm, string> = {
  tree: "trees",
  shrub: "shrubs",
  perennial: "perennials",
  annual: "annuals",
  grass: "grasses",
  vine: "vines",
  groundcover: "groundcovers",
  fern: "ferns",
};
const SLUG_TO_FORM = new Map<string, PlantForm>(
  FORM_ORDER.map((f) => [FORM_SLUGS[f], f])
);

/**
 * The one sub-page of a roster that isn't a plant form: this region's natives
 * that take a beating (`data/pioneers.ts`). English in the address like every
 * other route, and checked before the form slugs so it can't be read as a
 * mistyped category.
 */
const PIONEERS_SLUG = "pioneers";

export async function renderRegion(main: HTMLElement, param?: string): Promise<void> {
  clear(main);
  const [id, catSlug] = (param ?? "").split("/");
  const region = REGIONS.find((r) => r.meta.id === id);
  if (!region) {
    await renderNotFound(main, t("region.noSuchRegion"));
    return;
  }
  const form = catSlug && catSlug !== PIONEERS_SLUG ? SLUG_TO_FORM.get(catSlug) : undefined;
  if (catSlug && catSlug !== PIONEERS_SLUG && !form) {
    await renderNotFound(main, t("region.noSuchCategory", { slug: catSlug }), region);
    return;
  }

  const plants = await loadPlants(region);

  if (catSlug === PIONEERS_SLUG) {
    renderPioneers(main, region, plants);
    return;
  }

  if (form) {
    renderCategory(main, region, plants, form);
    return;
  }

  document.title = t("region.docTitle", { region: regionName(region.meta) });
  reportRosterUntranslated(plants, region.meta.id);

  // The controls, read from the address so any view can be shared: the
  // order, whether the list is grouped by kind of plant, and what narrows it —
  // the pioneers, and the spot flow's filters (see `lib/roster-sort.ts`).
  const view = rosterView(new URLSearchParams(
    ROSTER_KEYS.flatMap((k) => {
      const v = addressParam(k, location.hash, location.search);
      return v === null ? [] : [[k, v]];
    })
  ));
  const pioneerIds = new Set(pioneersForRegion(region.meta.id, plants).map((pick) => pick.plant.id));
  // How threatened each plant is here: its global rank, and this region's
  // state rank (`lib/conservation.ts`).
  const threat = (p: Plant): number => threatLevel(p.id, region.meta.id);
  const atRiskCount = plants.filter((p) => threat(p) >= AT_RISK).length;
  const sorted = sortRoster(
    plants.filter((p) => (!view.pioneers || pioneerIds.has(p.id)) && passesFilters(traitsOf(p), view.filters)),
    view.sort, commonName, getLang()
  );
  // Filtered to the plants at risk, the most threatened come first.
  const shown = view.atRisk ? atRiskFirst(sorted, threat) : sorted;
  const rowOf = (p: Plant): FilterRow => filterRow(p, region.meta.id, {
    caterpillars: view.sort === "caterpillars",
    // Filtered to the pioneers, each row says what it copes with.
    pioneer: view.pioneers ? pioneerFor(region.meta.id, p.id) : undefined,
    // Filtered to the plants at risk, each says how much.
    atRisk: view.atRisk,
  });
  const allRows: FilterRow[] = [];
  const sections: FilterSection[] = [];
  const groups = view.grouped
    ? FORM_ORDER.map((f) => {
        const inForm = shown.filter((p) => p.form === f);
        if (!inForm.length) return null;
        const rows = inForm.map(rowOf);
        const node = el("section", {}, [
          sectionHeading(categoryHref(region, f), formIcon(f, 24), formLabel(f), fmtNumber(inForm.length)),
          el("div", { class: "card-grid" }, rows.map((r) => r.node)),
        ]);
        allRows.push(...rows);
        sections.push({ node, rows });
        return node;
      }).filter((g): g is HTMLElement => g !== null)
    : [(() => {
        const rows = shown.map(rowOf);
        allRows.push(...rows);
        return el("div", { class: "card-grid" }, rows.map((r) => r.node));
      })()];
  // What the order means, said once above the list rather than on every row.
  if (view.sort === "caterpillars") groups.unshift(caterpillarLede());
  // Said once above the list, not on every row: the order, and what to do
  // with a rare plant — buy it, never dig it.
  if (view.atRisk) groups.unshift(el("p", { class: "obs-section-lede" }, t("region.atRiskLede")));
  if (!shown.length) groups.push(el("div", { class: "note warn" }, t("roster.noneFiltered")));

  main.append(
    // Everything above the roster is one block — the name, the stats, the map
    // and the controls that sort the list. It stacks on a phone; on a wider
    // screen the map takes a column of its own down the right and the rest
    // runs beside it, so the map no longer sits alone with the window empty
    // beside it (see `.region-top` in styles.css).
    el("div", { class: "region-top" }, [
      // The flags lead the name, as on the Regions index cards.
      el("h2", { class: "step-title" }, [flagRow(region.meta.countries), regionName(region.meta)]),
      // The place in the sentence, the hardiness range as its own badge beside
      // it. This is where the zone belongs: the reader has picked their region
      // and is now asking what grows in it. The Explore cards, where they were
      // still choosing a place, name the place only.
      regionRefLine(region.meta, "region-ref"),
      el("p", { class: "step-lede" },
        t("region.lede", { reference: regionReference(region.meta) })),
      // The stats, the caveat and the map: three answers to "what is this
      // region and does it include me?", asked before the roster.
      regionStatGrid(region, plants),
      el("p", { class: "region-head-note" }, regionNote(region.meta)),
      // Said before the map and the roster: how far to trust "native here"
      // is a question about the whole list, not one plant.
      ...[crossCheckWarning(region)].filter((n): n is HTMLElement => n !== null),
      regionBoundaryCard(region.meta),
      // Which of these plants we can't name in the reader's language. (The
      // *writing* we haven't translated is the page-top banner's job, reported
      // below.) `main.append` is the DOM's, so an absent note has to vanish from
      // the argument list rather than pass through as null.
      ...[namingNote(plants)].filter((n): n is HTMLElement => n !== null),
      plantFilterField(allRows, sections),
      rosterControls(view, (to) => `#/regions/${region.meta.id}${rosterQuery(to)}`, pioneerIds.size, undefined, atRiskCount),
      // The plant types, only once the reader has asked to see the list by
      // type: a phone screen of seven chips above every roster was a menu
      // most readers scrolled past to reach the plants.
      ...(view.grouped ? [categoryChips(region, plants, null)] : []),
    ]),
    ...groups,
    // And what to pull. The roster answers "what belongs here"; this answers
    // the question a person clearing a corner asks next — which of the plants
    // that *don't* belong to go after first, and how to know one. Ranked by the
    // region's own authority and by how often each has been recorded wild (see
    // `lib/invasives.ts`), one row per plant.
    ...mostWantedSection(region),
    ...otherPlantsDoors(region),
    // And who eats them. A roster is half the answer to "what lives here" —
    // the plants are the other half's food — and the two were a page apart:
    // the animals had their own index and this page never named one.
    //
    // Folded into the five groups rather than listed, because forty names under
    // seventy plants is a second roster nobody scrolled here for. The heading
    // opens the region's own wildlife index, where they get the full cards.
    // Counted from the tie table, so this costs no extra download (see
    // `wildlifeIndex`) — the page still fetches exactly one region's plants.
    // The short list for bad ground, before the animals: somebody reading a
    // roster with a particular awful corner in mind is asking a planting
    // question, and the wildlife below is the reward for solving it.
    ...pioneersSection(region, plants),
    ...wildlifeSection(region),
    // And who to ask. The roster says what belongs here; this says who else
    // already knows, which is the question a reader asks after their first
    // six plants go in. Last on the page because that is when it comes up.
    ...societiesSection(region.meta.id),
    // And what to read. The societies are people to meet; these are the
    // books and channels those people point to. Three rows, and the heading
    // opens the region's whole list.
    ...readingSection(region.meta.id),
    // And how the list got here: when its plants and animals arrived.
    ...regionGrowth(region.meta.id),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("regions") }, t("region.featured")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ])
  );
}

/**
 * A region whose native status rests on Kew alone says so. The bar is on
 * `#/sources`; which regions clear it is `data/cross-checks.ts`.
 */
function crossCheckWarning(region: RegionDef): HTMLElement | null {
  if (isCrossChecked(region.meta.id)) return null;
  return el("p", { class: "note warn cross-check-warn" }, [
    el("strong", {}, t("region.crossCheckWarn")),
    " ",
    el("a", { href: SOURCES_ROUTE }, t("region.crossCheckLink")),
  ]);
}

/**
 * The pages about the plants that aren't this region's natives — the ones
 * mistaken for them, and the ones to swap out. Below the roster, beside the
 * worst invasives, because they answer a different question from "what grows
 * here": the list above is natives only. Absent for a region with neither.
 */
function otherPlantsDoors(region: RegionDef): HTMLElement[] {
  const id = region.meta.id;
  const doors = [
    ...(mappedLookalikeIds(id).size
      ? [door(`#/lookalikes/in/${id}`, lookalikeIcon(24), t("plants.door.lookalikes"), t("plants.door.lookalikesHint"))]
      : []),
    ...(alternativeCountForRegion(id)
      ? [door(`#/alternatives/in/${id}`, alternativeIcon(24), t("plants.door.alternatives"), t("plants.door.alternativesHint"))]
      : []),
  ];
  return doors.length ? [el("div", { class: "plant-doors", style: "margin-top:1rem" }, doors)] : [];
}

/** The animals this region's plants are documented to support, as the wildlife
 *  index's own five groups. Empty — and absent — for a region with no ties yet
 *  rather than a heading over nothing. */
function wildlifeSection(region: RegionDef): HTMLElement[] {
  const rows = wildlifeIndex(region.meta.id);
  if (!rows.length) return [];
  return [
    el("section", { style: "margin-top:1.5rem" }, [
      sectionHeading(
        `#/wildlife/in/${region.meta.id}`,
        "🦋",
        t("region.wildlifeTitle"),
        fmtNumber(rows.length)
      ),
      el("p", { class: "obs-section-lede" }, t("region.wildlifeLede")),
      wildlifeRegionGroups(rows, `region-wildlife-${region.meta.id}`),
    ]),
  ];
}

/**
 * The teaser for this region's pavement pioneers: the plants, and the chips
 * saying what each one takes. No notes here — the sentence explaining *why* is
 * what the heading's own page is for, and printing it twice is a paragraph
 * somebody translates and maintains in two places.
 *
 * Absent, not empty, for a region with no rows yet.
 */
function pioneersSection(region: RegionDef, plants: Plant[]): HTMLElement[] {
  const picks = pioneersForRegion(region.meta.id, plants);
  if (!picks.length) return [];
  return [
    el("section", { style: "margin-top:1.5rem" }, [
      sectionHeading(
        pioneersHref(region),
        PIONEER_ICON,
        t("pioneers.title"),
        fmtNumber(picks.length)
      ),
      el("p", { class: "obs-section-lede" }, t("pioneers.sectionLede")),
      el("div", { class: "card-grid" }, picks.map((pick) => pioneerCard(pick, region.meta.id))),
    ]),
  ];
}

/** The pioneers page: the same list with the sentence and the source that back
 *  each row, plus the credit for the nickname. */
function renderPioneers(main: HTMLElement, region: RegionDef, plants: Plant[]): void {
  const picks = pioneersForRegion(region.meta.id, plants);
  document.title = t("pioneers.docTitle", { region: regionName(region.meta) });
  // Two separate bodies of writing on this page: the plants' own paragraphs and
  // the sentence each pioneer row carries. The banner is a flag rather than an
  // inventory (the first report wins), so the more specific one goes first.
  if (pioneersUntranslated(picks.map((p) => p.plant), region.meta.id)) {
    reportUntranslated(t("wip.pioneers"));
  }
  reportRosterUntranslated(picks.map((p) => p.plant), region.meta.id);

  main.append(
    el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.9rem;color:var(--ink-soft)" }, [
      "📍 ",
      el("a", { href: `#/regions/${region.meta.id}` }, regionName(region.meta)),
    ]),
    el("h2", { class: "step-title" }, t("pioneers.title")),
    picks.length
      ? el("p", { class: "step-lede" }, [
          tn("pioneers.count", picks.length, {
            n: fmtNumber(picks.length),
            reference: regionReference(region.meta),
          }),
          " ",
          zoneChip(region.meta),
        ])
      : el("p", { class: "step-lede" }, t("pioneers.empty", { region: regionName(region.meta) })),
    el("p", { class: "note info" }, t("pioneers.what")),
    categoryChips(region, plants, null, true),
    el("div", { class: "card-grid" },
      picks.map((pick) => pioneerCard(pick, region.meta.id, { full: true }))),
    // The book is a real link, placed by the translator rather than by this
    // code: `tx` lets French put the title where the sentence wants it.
    el("p", { class: "pioneers-credit" }, tx("pioneers.credit", {
      book: el("a", {
        href: CONCRETE_BOTANY_URL,
        target: "_blank",
        rel: "noopener",
      }, el("cite", {}, t("pioneers.creditBook"))),
    })),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate(`regions/${region.meta.id}`) }, t("region.allOfRegion")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ])
  );
}

/**
 * Said once per roster: how many of these plants we can name in the reader's
 * language. A page where two thirds of the headings are Latin needs to explain
 * itself — the alternative (inventing French names for Florida natives) is the
 * one thing we won't do.
 */
function namingNote(plants: Plant[]): HTMLElement | null {
  const { named, total } = localNameCoverage(plants);
  if (named === total) return null;
  return el("p", { class: "note info", style: "margin:0.4rem 0 0.8rem" },
    t("names.partlyNamed", { named: fmtNumber(named), total: fmtNumber(total) }));
}

// One category of one region — a straight-to-the-point shareable page, with a
// switcher to the same category in every other region that has one.
function renderCategory(
  main: HTMLElement,
  region: RegionDef,
  plants: Plant[],
  form: PlantForm
): void {
  const inForm = sortedByCommon(plants, form);
  const label = formLabel(form);
  document.title = t("region.categoryDocTitle", { label, region: regionName(region.meta) });
  reportRosterUntranslated(inForm, region.meta.id);

  // The same category elsewhere — only regions that actually have one.
  // Counted from the registry, not from the other regions' lists: this is a
  // row of buttons about eight regions, and fetching eight plant lists to
  // number them would undo the whole point of splitting them up.
  const elsewhere = REGIONS.filter(
    (r) => r.meta.id !== region.meta.id && formCountForRegion(r.meta.id, form) > 0
  );
  const switcher = elsewhere.length
    ? el("div", { class: "card", style: "margin-top:1rem" }, [
        el("p", { style: "margin:0 0 0.4rem;font-weight:650" }, t("region.elsewhere", { label })),
        el("div", { style: "display:flex;flex-wrap:wrap;gap:0.4rem" },
          elsewhere.map((r) =>
            el("a", {
              class: "btn btn-secondary",
              style: "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.7rem;font-size:0.9rem;text-decoration:none",
              href: categoryHref(r, form),
            }, `${regionName(r.meta)} (${fmtNumber(formCountForRegion(r.meta.id, form))})`)
          )
        ),
      ])
    : null;

  const rows = inForm.map((p) => filterRow(p, region.meta.id));

  main.append(
    el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.9rem;color:var(--ink-soft)" }, [
      "📍 ",
      el("a", { href: `#/regions/${region.meta.id}` }, regionName(region.meta)),
    ]),
    el("h2", { class: "step-title" }, label),
    inForm.length
      ? el("p", { class: "step-lede" }, [
          tn("region.categoryCount", inForm.length, {
            n: fmtNumber(inForm.length),
            reference: regionReference(region.meta),
          }),
          " ",
          zoneChip(region.meta),
          t("region.tapAny"),
        ])
      : el("p", { class: "step-lede" },
          t("region.emptyCategory", { region: regionName(region.meta), label: label.toLowerCase() })),
    ...(rows.length > 1 ? [plantFilterField(rows, [])] : []),
    categoryChips(region, plants, form),
    el("div", { class: "card-grid" }, rows.map((r) => r.node)),
    ...(switcher ? [switcher] : []),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate(`regions/${region.meta.id}`) }, t("region.allOfRegion")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ])
  );
}

/**
 * Chip nav across a region's kinds of plant; `current` marks the active one.
 * Kinds only: the roster's sort and filters are `viewControls`, and the pages
 * about plants that aren't natives sit below the roster.
 *
 * "All" leads the row on any page that isn't the whole roster — a category,
 * or the pioneers, which cut across every kind.
 */
function categoryChips(
  region: RegionDef,
  plants: Plant[],
  current: PlantForm | null,
  showAll = current !== null
): HTMLElement {
  const chips: HTMLElement[] = [];
  if (showAll) {
    chips.push(el("a", {
      class: "btn btn-secondary",
      style: chipStyle,
      href: `#/regions/${region.meta.id}`,
    }, t("region.allChip", { n: fmtNumber(plants.length) })));
  }
  for (const f of FORM_ORDER) {
    const count = plants.filter((p) => p.form === f).length;
    if (!count) continue;
    chips.push(el("a", {
      class: "btn btn-secondary",
      style: chipStyle,
      href: categoryHref(region, f),
      "aria-current": f === current ? "page" : undefined,
    }, [formIcon(f), ` ${formLabel(f)} (${fmtNumber(count)})`]));
  }
  return el("nav", { "aria-label": t("region.categoriesNav"), style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0 0.8rem" }, chips);
}

// `gap:0.3rem` overrides .btn's roomy 0.5rem so a chip's icon hugs its label.
const chipStyle = "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.6rem;font-size:0.9rem;text-decoration:none;gap:0.3rem";

/** A category's silhouette at chip/heading size — same drawing as the rows.
 *  A heading's type is half again the size of a chip's, so its glyph is too:
 *  one size for both left the heading wearing a speck of green beside words
 *  twice its height. */
export function formIcon(f: PlantForm, size = 17): SVGSVGElement {
  const svg = silhouetteFor(f, size);
  svg.setAttribute("aria-hidden", "true");
  svg.style.verticalAlign = "-0.18em";
  return svg;
}

export function categoryHref(region: RegionDef, form: PlantForm): string {
  return `#/regions/${region.meta.id}/${FORM_SLUGS[form]}`;
}

function pioneersHref(region: RegionDef): string {
  return `#/regions/${region.meta.id}/${PIONEERS_SLUG}`;
}

/** Alphabetical by the name the reader actually sees, in their own collation:
 *  "Épicéa" files under E in French, not after Z. */
function sortedByCommon(plants: Plant[], form: PlantForm): Plant[] {
  return plants
    .filter((p) => p.form === form)
    .sort((a, b) => commonName(a).localeCompare(commonName(b), getLang()));
}

// ---- In-page filtering: type a name, the list narrows as you type ----
// The field itself — and the underlining of what you typed — is shared with the
// wildlife index and, through `highlight`, with the search page. See
// components/filter-field.ts.

// The haystack carries the English name too, not only the displayed one: a
// French reader who knows a plant as "red maple" should still find it.
function filterRow(p: Plant, regionId: string, opts: RowOptions = {}): FilterRow {
  const { node, mark } = plantRow(p, regionId, opts);
  return { hay: norm(`${commonName(p)} ${p.common} ${p.latin}`), node, mark };
}

function plantFilterField(rows: FilterRow[], sections: FilterSection[]): HTMLElement {
  return filterField(rows, sections, {
    label: t("region.filterAria"),
    placeholder: t("region.filterPlaceholder"),
    // Plural-aware: French agrees the verb and the noun with how many matched.
    count: (shown, total, q) =>
      tn("region.filterCount", shown, { shown: fmtNumber(shown), total: fmtNumber(total), q }),
    fallback: (q) => [
      t("region.filterNone"),
      el("a", { href: `#/plants?q=${encodeURIComponent(q)}` }, t("region.filterSearchAll")),
      t("region.filterNoneRest"),
    ],
  });
}

// A compact, scannable row: enough to recognize the plant and want to tap it,
// with the full story living on the plant's own page. `mark` re-draws the two
// name lines with the filter query underlined, exactly as a search result does
// — the row says which word kept it on screen.
interface RowOptions {
  /** Show the caterpillar count as a tag on the card's corner — the figure
   *  the list is sorted by, so a scan can see why a plant ranks there. */
  caterpillars?: boolean;
  /** This region's pioneer row for the plant: shown as the card's footer. */
  pioneer?: PioneerEntry;
  /** Show the plant's conservation rank as the card's footer — only on a list
   *  the reader filtered to the plants at risk, which says once above it to
   *  buy them from a nursery (see `components/conservation-note.ts`). */
  atRisk?: boolean;
}

export function plantRow(p: Plant, regionId: string, opts: RowOptions = {}): { node: HTMLElement; mark: (nq: string) => void } {
  const names = nameLines(p);
  const title = el("span", {});
  const sub = el("div", { class: "plant-latin", style: "font-size:0.85rem" });
  const node = el("a", {
    href: `#/plants/${p.id}`,
    class: "card",
    // Wraps only to put a pioneer's footer on a line of its own.
    style: "position:relative;display:flex;flex-wrap:wrap;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;padding:var(--list-card-pad)",
  }, [
    // This region's photograph, not just any region's: a live oak in Florida
    // and the same species in Maryland are not the same-looking tree, and the
    // roster you're reading is one region's.
    plantThumb(p.id, p.form, { regionId, attrs: { style: "flex:0 0 auto" } }),
    el("div", { style: "flex:1 1 0;min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        title,
        // A word joiner keeps the star from wrapping onto a line alone.
        p.keystone ? "\u2060" : null,
        p.keystone
          ? el("span", {
              title: t("explore.keystoneTitle"),
              role: "img",
              "aria-label": t("explore.keystoneLabel"),
              class: "name-mark",
            }, [keystoneIcon(13)])
          : null,
      ]),
      sub,
    ]),
    opts.pioneer ? pressureFooter({ entry: opts.pioneer }, { interactive: false }) : null,
    opts.atRisk ? conservationFooter(p.id, regionId) : null,
    // Absent for a plant not counted yet.
    opts.caterpillars && p.hostLepCount !== null
      ? countTag(p.hostLepCount)
      : null,
  ]);
  const mark = (nq: string): void => {
    title.replaceChildren(...highlight(names.title, nq));
    sub.replaceChildren(...highlight(names.sub, nq));
  };
  mark("");
  return { node, mark };
}

async function renderNotFound(main: HTMLElement, why: string, region?: RegionDef): Promise<void> {
  main.append(
    el("h2", { class: "step-title" }, t("region.nothingHere")),
    el("p", { class: "step-lede" }, why),
    ...(region ? [categoryChips(region, await loadPlants(region), null)] : []),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, t("region.browseNatives")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );
}
