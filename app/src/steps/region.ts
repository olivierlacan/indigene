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
import { silhouetteFor } from "../components/plant-card";
import { keystoneIcon } from "../components/keystone-icon";
import { regionStatGrid } from "../components/region-stats";
import { regionRefLine, zoneChip } from "../components/zone-chip";
import type { Plant, PlantForm } from "../types";
import { t, tn, fmtNumber, getLang } from "../lib/i18n";
import { commonName, nameLines, regionName, regionNote, regionReference, localNameCoverage } from "../lib/names";
import { prose } from "../lib/prose";

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

  const allRows: FilterRow[] = [];
  const sections: FilterSection[] = [];
  const groups = FORM_ORDER.map((f) => {
    const inForm = sortedByCommon(plants, f);
    if (!inForm.length) return null;
    const rows = inForm.map(filterRow);
    const node = el("section", {}, [
      el("h3", { style: "margin:1.1rem 0 0.4rem" }, [
        el("a", { href: categoryHref(region, f), style: "color:inherit" }, [
          formIcon(f),
          ` ${formLabel(f)} (${fmtNumber(inForm.length)})`,
        ]),
      ]),
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
    ...(namingNote(plants) ? [namingNote(plants) as HTMLElement] : []),
    filterField(allRows, sections),
    categoryChips(region, plants, null),
    ...groups,
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("region.featured")),
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

  const rows = inForm.map(filterRow);

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
    ...(rows.length > 1 ? [filterField(rows, [])] : []),
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

/** A category's silhouette at chip/heading size — same drawing as the rows. */
function formIcon(f: PlantForm): SVGSVGElement {
  const svg = silhouetteFor(f, 17);
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
// This filters the rows already on the page (no routing, no registry lookup) so
// nobody has to reach for Ctrl+F or bounce out to the search page just to find
// one plant in a 40-row roster.

const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

interface FilterRow {
  /** Everything a match can hit: common + scientific name, normalized. */
  hay: string;
  node: HTMLElement;
}

/** A form group on the roster page — hidden whole when no row in it matches. */
interface FilterSection {
  node: HTMLElement;
  rows: FilterRow[];
}

// The haystack carries the English name too, not only the displayed one: a
// French reader who knows a plant as "red maple" should still find it.
function filterRow(p: Plant): FilterRow {
  return { hay: norm(`${commonName(p)} ${p.common} ${p.latin}`), node: plantRow(p) };
}

function filterField(rows: FilterRow[], sections: FilterSection[]): HTMLElement {
  const input = el("input", {
    type: "search",
    "aria-label": t("region.filterAria"),
    placeholder: t("region.filterPlaceholder"),
    autocomplete: "off",
    autocapitalize: "none",
    spellcheck: false,
    // Full width on a phone, but a text field the width of a laptop is a
    // target with nothing in it — cap it once the page goes wide.
    style: "width:100%;max-width:24rem",
  }) as HTMLInputElement;
  const status = el("p", { role: "status", class: "coords", style: "margin:0.35rem 0 0" });

  const apply = (): void => {
    const nq = norm(input.value);
    let shown = 0;
    for (const r of rows) {
      const hit = !nq || r.hay.includes(nq);
      // Rows carry an inline display:flex, so toggle that rather than [hidden].
      r.node.style.display = hit ? "flex" : "none";
      if (hit) shown++;
    }
    for (const s of sections) {
      s.node.style.display = s.rows.some((r) => r.node.style.display !== "none") ? "" : "none";
    }
    clear(status);
    if (!nq) return;
    if (shown) {
      status.append(t("region.filterCount", { shown: fmtNumber(shown), total: fmtNumber(rows.length) }));
    } else {
      status.append(
        t("region.filterNone"),
        el("a", { href: `#/search/${encodeURIComponent(input.value.trim())}` }, t("region.filterSearchAll")),
        t("region.filterNoneRest")
      );
    }
  };
  input.addEventListener("input", apply);

  return el("div", { style: "margin:0 0 0.6rem" }, [input, status]);
}

// A compact, scannable row: enough to recognize the plant and want to tap it,
// with the full story living on the plant's own page.
function plantRow(p: Plant): HTMLElement {
  const names = nameLines(p);
  return el("a", {
    href: `#/plants/${p.id}`,
    class: "card",
    style: "display:flex;gap:0.7rem;align-items:center;text-decoration:none;color:inherit;padding:0.6rem 0.8rem;margin:0;height:100%",
  }, [
    el("div", { class: "plant-photo", "aria-hidden": "true", style: "flex:0 0 auto" }, [silhouetteFor(p.form)]),
    el("div", { style: "min-width:0" }, [
      el("div", { style: "font-weight:700" }, [
        names.title,
        p.keystone
          ? el("span", {
              title: t("explore.keystoneTitle"),
              role: "img",
              "aria-label": t("explore.keystoneLabel"),
              style: "margin-left:0.3rem;color:var(--brand)",
            }, [keystoneIcon(13)])
          : null,
      ]),
      el("div", { class: "plant-latin", style: "font-size:0.85rem" }, names.sub),
      el("div", {
        style: "font-size:0.85rem;color:var(--ink-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis",
      }, prose(p, "givesNote")),
    ]),
  ]);
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
