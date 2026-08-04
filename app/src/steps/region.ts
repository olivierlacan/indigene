// A region's full roster (#/regions/<id>) and its per-category pages
// (#/regions/<id>/trees, …/shrubs, …). The explore page leads with one
// showcase plant per region; these are the "show me everything" answers
// behind it — every native in the region's seed list, each row linking to
// the plant's page. Category pages are shareable straight-to-the-point URLs
// ("the trees of the PNW") and let you jump to the same category in another
// region without going back through the roster.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS, loadPlants } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import { filterField, highlight, norm } from "../components/filter-field";
import type { FilterRow, FilterSection } from "../components/filter-field";
import { silhouetteFor } from "../components/plant-card";
import { plantThumb } from "../components/plant-thumb";
import { sectionHeading } from "../components/section-link";
import { keystoneIcon } from "../components/keystone-icon";
import { regionStatGrid } from "../components/region-stats";
import { regionRefLine, zoneChip } from "../components/zone-chip";
import type { Plant, PlantForm } from "../types";
import { t, tn, fmtNumber, getLang } from "../lib/i18n";
import { commonName, nameLines, regionName, regionNote, regionReference, localNameCoverage } from "../lib/names";
import { prose } from "../lib/prose";
import { reportRosterUntranslated } from "../components/wip-banner";

const FORM_ORDER: PlantForm[] = ["tree", "shrub", "perennial", "grass", "vine", "groundcover", "fern"];
/** The category headings. A function, not a record: a record built at import
 *  time would be stuck in whichever language loaded first. */
const formLabel = (f: PlantForm): string => t(`form.${f}` as const);
/** URL slug for each form — plural, human, stable ("…/regions/pnw/trees"). */
const FORM_SLUGS: Record<PlantForm, string> = {
  tree: "trees",
  shrub: "shrubs",
  perennial: "perennials",
  grass: "grasses",
  vine: "vines",
  groundcover: "groundcovers",
  fern: "ferns",
};
const SLUG_TO_FORM = new Map<string, PlantForm>(
  FORM_ORDER.map((f) => [FORM_SLUGS[f], f])
);

export function renderRegion(main: HTMLElement, param?: string): void {
  clear(main);
  const [id, catSlug] = (param ?? "").split("/");
  const region = REGIONS.find((r) => r.meta.id === id);
  if (!region) {
    renderNotFound(main, t("region.noSuchRegion"));
    return;
  }
  const form = catSlug ? SLUG_TO_FORM.get(catSlug) : undefined;
  if (catSlug && !form) {
    renderNotFound(main, t("region.noSuchCategory", { slug: catSlug }), region);
    return;
  }

  const plants = loadPlants(region);

  if (form) {
    renderCategory(main, region, plants, form);
    return;
  }

  document.title = t("region.docTitle", { region: regionName(region.meta) });
  reportRosterUntranslated(plants);

  const allRows: FilterRow[] = [];
  const sections: FilterSection[] = [];
  const groups = FORM_ORDER.map((f) => {
    const inForm = sortedByCommon(plants, f);
    if (!inForm.length) return null;
    const rows = inForm.map((p) => filterRow(p, region.meta.id));
    const node = el("section", {}, [
      sectionHeading(categoryHref(region, f), formIcon(f, 24), formLabel(f), fmtNumber(inForm.length)),
      el("div", { class: "card-grid" }, rows.map((r) => r.node)),
    ]);
    allRows.push(...rows);
    sections.push({ node, rows });
    return node;
  }).filter((g): g is HTMLElement => g !== null);

  main.append(
    el("h2", { class: "step-title" }, regionName(region.meta)),
    // The place in the sentence, the hardiness range as its own badge beside
    // it. This is where the zone belongs: the reader has picked their region
    // and is now asking what grows in it. The Explore cards, where they were
    // still choosing a place, name the place only.
    regionRefLine(region.meta, "region-ref"),
    el("p", { class: "step-lede" },
      t("region.lede", { reference: regionReference(region.meta) })),
    regionStatGrid(region, plants),
    el("p", { style: "font-size:0.9rem;color:var(--ink-soft)" }, regionNote(region.meta)),
    // Which of these plants we can't name in the reader's language. (The
    // *writing* we haven't translated is the page-top banner's job, reported
    // below.) `main.append` is the DOM's, so an absent note has to vanish from
    // the argument list rather than pass through as null.
    ...[namingNote(plants)].filter((n): n is HTMLElement => n !== null),
    plantFilterField(allRows, sections),
    categoryChips(region, plants, null),
    ...groups,
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("regions") }, t("region.featured")),
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
  reportRosterUntranslated(inForm);

  // The same category elsewhere — only regions that actually have one.
  const elsewhere = REGIONS.filter(
    (r) => r.meta.id !== region.meta.id && loadPlants(r).some((p) => p.form === form)
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
            }, `${regionName(r.meta)} (${fmtNumber(loadPlants(r).filter((p) => p.form === form).length)})`)
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

/** Chip nav across a region's categories; `current` marks the active one. */
function categoryChips(region: RegionDef, plants: Plant[], current: PlantForm | null): HTMLElement {
  const chips: HTMLElement[] = [];
  if (current) {
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
function formIcon(f: PlantForm, size = 17): SVGSVGElement {
  const svg = silhouetteFor(f, size);
  svg.setAttribute("aria-hidden", "true");
  svg.style.verticalAlign = "-0.18em";
  return svg;
}

function categoryHref(region: RegionDef, form: PlantForm): string {
  return `#/regions/${region.meta.id}/${FORM_SLUGS[form]}`;
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
function filterRow(p: Plant, regionId: string): FilterRow {
  const { node, mark } = plantRow(p, regionId);
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
function plantRow(p: Plant, regionId: string): { node: HTMLElement; mark: (nq: string) => void } {
  const names = nameLines(p);
  const title = el("span", {});
  const sub = el("div", { class: "plant-latin", style: "font-size:0.85rem" });
  const node = el("a", {
    href: `#/plants/${p.id}`,
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;padding:0.6rem 0.8rem;margin:0;height:100%",
  }, [
    // This region's photograph, not just any region's: a live oak in Florida
    // and the same species in Maryland are not the same-looking tree, and the
    // roster you're reading is one region's.
    plantThumb(p.id, p.form, { regionId, attrs: { style: "flex:0 0 auto" } }),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        title,
        p.keystone
          ? el("span", {
              title: t("explore.keystoneTitle"),
              role: "img",
              "aria-label": t("explore.keystoneLabel"),
              style: "margin-left:0.3rem;color:var(--brand)",
            }, [keystoneIcon(13)])
          : null,
      ]),
      sub,
      el("div", {
        style: "font-size:0.85rem;color:var(--ink-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis",
      }, prose(p, "givesNote")),
    ]),
  ]);
  const mark = (nq: string): void => {
    title.replaceChildren(...highlight(names.title, nq));
    sub.replaceChildren(...highlight(names.sub, nq));
  };
  mark("");
  return { node, mark };
}

function renderNotFound(main: HTMLElement, why: string, region?: RegionDef): void {
  main.append(
    el("h2", { class: "step-title" }, t("region.nothingHere")),
    el("p", { class: "step-lede" }, why),
    ...(region ? [categoryChips(region, loadPlants(region), null)] : []),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("plants") }, t("region.browseNatives")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("") }, t("browse.home")),
    ])
  );
}
