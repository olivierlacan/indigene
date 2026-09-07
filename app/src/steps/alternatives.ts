// Browse-by-ornamental: the "grow this instead" read on the catalog.
//
// The rest of the app starts from a plant you want. Look-alikes start from the
// plant you already have. This starts from the plant you were *about* to buy —
// the Bermuda-grass lawn, the barberry hedge, the butterfly bush — and answers
// the question the garden centre never does: what native does this same job,
// and does it hold up as well on water, disease and what it feeds?
//
//   #/alternatives             → every ornamental we've written a swap for.
//   #/alternatives/in/<region> → only the ones that matter in one region.
//   #/alternatives/<id>        → one ornamental: what it's planted for, where
//                                it's really from, and, for each native that
//                                stands in for it, the case side by side.
//
// **Why the ornamental gets the page, not the native.** An ornamental is
// shared: Bermuda grass is replaced by little bluestem in the Mid-Atlantic and
// by something else in Florida, and one native (little bluestem) stands in for
// several ornamentals. Giving every plant page its own copy would repeat the
// same shrub a dozen times. So a plant page keeps one compact line — the
// ornamentals it replaces, linked — and the whole comparison lives here.
import { el, clear } from "../ui";
import { REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import {
  getOrnamental,
  alternativeIndex,
  mappedOrnamentalCount,
  nativesForOrnamental,
  inatSearchUrl,
} from "../lib/alternatives";
import type { AlternativeIndexRow, NativeForOrnamental } from "../lib/alternatives";
import { nativeSomewhere, getLookalikeByLatin, invasiveRegionsFor } from "../lib/lookalikes";
import { filterField, highlight, norm } from "../components/filter-field";
import type { FilterRow } from "../components/filter-field";
import { citation } from "../components/citation";
import { silhouetteFor } from "../components/plant-card";
import { plantThumb, alternativeThumb } from "../components/plant-thumb";
import { heroFigure } from "../components/hero-figure";
import { alternativePhotoFor } from "../lib/hero-photo";
import type { Ornamental, AlternativeLink, SwapAxis } from "../types";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import { commonName, nameLines, regionName, regionShort } from "../lib/names";
import { alternativeBlurb, alternativeOrigin, alternativeRole, alternativeWhy, alternativeEdges, alternativesUntranslated } from "../lib/prose";
import { reportUntranslated } from "../components/wip-banner";

/** The route prefix that makes `#/alternatives/…` an index filtered to a region
 *  rather than one ornamental's page — the same device the look-alike and
 *  wildlife indexes use. It stays English in every language: a URL is an
 *  address. */
const REGION_PREFIX = "in/";

/** The region an `#/alternatives/in/<id>` route asks for, or null when the
 *  param isn't a region route at all. */
export function alternativeRegionParam(param?: string): string | null {
  if (!param?.startsWith(REGION_PREFIX)) return null;
  return param.slice(REGION_PREFIX.length).split("/")[0] || null;
}

/** The address of an index — the one place that knows the URL shape. */
const indexHref = (regionId: string | null): string =>
  regionId ? `#/alternatives/${REGION_PREFIX}${regionId}` : "#/alternatives";

/** The order the comparison rows read in: water first (the point of the whole
 *  feature), then disease, then what it feeds, then upkeep. */
const AXIS_ORDER: SwapAxis[] = ["water", "disease", "wildlife", "care"];

/** The short form of a name for cramped labels. */
const shortLabel = (name: string): string => name.replace(/\s*[([].*$/, "");

// ---------------------------------------------------------------------------
// #/alternatives and #/alternatives/in/<region> — the index
// ---------------------------------------------------------------------------

export async function renderAlternativeIndex(main: HTMLElement, region?: RegionDef): Promise<void> {
  clear(main);
  const rows = await alternativeIndex(region?.meta.id);
  // Counted once, here, so the region picker below doesn't ask again per region.
  const perRegion = new Map<string, number>();
  for (const row of await alternativeIndex()) {
    for (const id of row.regionIds) perRegion.set(id, (perRegion.get(id) ?? 0) + 1);
  }

  document.title = region
    ? t("alternatives.regionDocTitle", { region: regionName(region.meta) })
    : t("alternatives.indexDocTitle");

  // The swap writing is authored in English and translated after; a French page
  // mustn't quietly mix languages without saying so. Reported, not rendered —
  // main.ts puts the banner at the top, exactly as the wildlife index does.
  if (rows.some((r) => alternativesUntranslated(r.ornamental.latin, r.natives.map((n) => n.link)))) {
    reportUntranslated(t("wip.alternatives"));
  }

  main.append(
    el("h2", { class: "step-title" }, t("alternatives.indexTitle")),
    el("p", { class: "step-lede" },
      region
        ? t("alternatives.indexLedeRegion", { n: fmtNumber(rows.length), region: regionShort(region.meta) })
        : t("alternatives.indexLede", { n: fmtNumber(mappedOrnamentalCount()) })),
  );

  const cards = rows.map((r) => indexCard(r, region ?? null));
  main.append(
    regionFilter(region ?? null, perRegion),
    ...(cards.length > 1 ? [filterField(cards, [], {
      label: t("alternatives.filterAria"),
      placeholder: t("alternatives.filterPlaceholder"),
      count: (shown, total, q) =>
        tn("alternatives.filterCount", shown, { shown: fmtNumber(shown), total: fmtNumber(total), q }),
      // A name that isn't an ornamental we've written up is very often a native
      // plant — send them to the catalog rather than to a dead end.
      fallback: (q) => [
        t("alternatives.filterNone", { q }),
        el("a", { href: `#/plants?q=${encodeURIComponent(q)}` }, t("alternatives.filterSearchPlants")),
        t("alternatives.filterNoneRest"),
      ],
    })] : []),
    el("div", { class: "card-grid" }, cards.map((c) => c.node)),
    el("p", { class: "confidence", style: "margin-top:1rem" }, t("alternatives.coverageNote")),
  );
}

/** The region picker, in the shape the look-alike and wildlife indexes use: a
 *  real select, with a count on every option, and no option that leads nowhere. */
function regionFilter(active: RegionDef | null, perRegion: Map<string, number>): HTMLElement {
  const select = el("select", { id: "alternative-region" }, [
    el("option", { value: "", selected: !active },
      t("alternatives.regionFilterAll", { n: fmtNumber(mappedOrnamentalCount()) })),
    ...REGIONS.map((r) => ({ r, n: perRegion.get(r.meta.id) ?? 0 }))
      .filter(({ n }) => n)
      .map(({ r, n }) =>
        el("option", { value: r.meta.id, selected: r.meta.id === active?.meta.id },
          `${regionShort(r.meta)} (${fmtNumber(n)})`)),
  ]) as HTMLSelectElement;
  select.addEventListener("change", () => {
    location.hash = indexHref(select.value || null);
  });
  return el("div", { class: "field field-inline" }, [
    el("label", { for: "alternative-region" }, t("alternatives.regionFilterLabel")),
    select,
  ]);
}

/** An ornamental's card on the index. The line that earns its place is the last
 *  one: *what to grow instead*. That's what a reader scans the index for. */
function indexCard(row: AlternativeIndexRow, region: RegionDef | null): FilterRow {
  const names = nameLines(row.ornamental);
  // Deduped by plant: the unfiltered index flattens the natives across every
  // region, and one native can stand in for the same ornamental in two of them
  // (beach sunflower replaces a Bermuda lawn in both Florida regions). Listing
  // it twice reads as a mistake — the region filter is where the split lives.
  const seenNative = new Set<string>();
  const nativePlants = row.natives.filter((n) => {
    if (seenNative.has(n.plant.id)) return false;
    seenNative.add(n.plant.id);
    return true;
  });
  const natives = nativePlants.map((n) => commonName(n.plant));
  const title = el("span", {});
  const sub = names.sub ? el("em", {}) : null;
  const instead = el("span", {});

  const node = el("article", { class: "card lookalike-card" }, [
    alternativeThumb(row.ornamental.id, row.ornamental.form),
    el("div", { class: "lookalike-body" }, [
      el("div", { class: "lookalike-head" }, [
        el("h4", { style: "margin:0" }, [
          el("a", { href: `#/alternatives/${row.ornamental.id}` }, [title]),
        ]),
      ]),
      sub ? el("div", { class: "lookalike-latin" }, [sub]) : null,
      el("p", { class: "kv", style: "margin:0.35rem 0 0" }, [
        el("span", { class: "k" }, t("alternatives.role")),
        el("span", {}, alternativeRole(row.ornamental)),
      ]),
      el("p", { class: "kv", style: "margin:0.5rem 0 0" }, [
        el("span", { class: "k" }, region ? t("alternatives.growInsteadHere") : t("alternatives.growInstead")),
        instead,
      ]),
    ]),
  ]);

  const mark = (nq: string): void => {
    clear(title);
    title.append(...highlight(names.title, nq));
    if (sub) {
      clear(sub);
      sub.append(...highlight(names.sub, nq));
    }
    clear(instead);
    natives.forEach((n, i) => {
      if (i) instead.append(" · ");
      instead.append(...highlight(n, nq));
    });
  };
  mark("");

  return {
    // Findable by the ornamental's names *and* by the natives it's swapped for:
    // "little bluestem" is what a person remembers, not "Cynodon dactylon".
    hay: norm([names.title, row.ornamental.common, row.ornamental.latin, row.ornamental.role,
      ...natives, ...row.natives.map((n) => n.plant.latin)].join(" ")),
    node,
    mark,
  };
}

// ---------------------------------------------------------------------------
// #/alternatives/<id> — one ornamental
// ---------------------------------------------------------------------------

export async function renderAlternative(main: HTMLElement, param?: string): Promise<void> {
  // `#/alternatives/in/<region>` is the index narrowed, not an ornamental
  // called "in" — the router hands both shapes here and this is where they part.
  const regionId = alternativeRegionParam(param);
  if (regionId !== null) {
    return renderAlternativeIndex(main, REGIONS.find((r) => r.meta.id === regionId));
  }

  clear(main);
  const ornamental = param ? getOrnamental(param) : undefined;
  if (!ornamental) return renderNotFound(main, param ?? "");

  const natives = await nativesForOrnamental(ornamental.id);
  const names = nameLines(ornamental);
  const elsewhere = await nativeSomewhere(ornamental.latin);
  // If this ornamental is also on the look-alike list — a plant people mistake
  // for a native as well as buy on purpose (Norway maple, cherry laurel) — cross-
  // link the two, and lead with where it's actually invasive.
  const alsoLookalike = getLookalikeByLatin(ornamental.latin);
  const invasiveIn = alsoLookalike ? await invasiveRegionsFor(alsoLookalike.id) : [];
  const portrait = alternativePhotoFor(ornamental.id);
  document.title = t("alternatives.docTitle", { name: names.title });
  if (alternativesUntranslated(ornamental.latin, natives.map((n) => n.link))) {
    reportUntranslated(t("wip.alternatives"));
  }

  main.append(
    el("p", { class: "back-trail" }, [
      el("a", { href: "#/alternatives" }, t("alternatives.backToIndex")),
    ]),
    el("article", { class: "plant lookalike-profile" }, [
      el("div", { class: "plant-head" }, [
        portrait
          ? heroFigure(portrait, commonName(ornamental), ornamental.latin)
          : el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(ornamental.form)]),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, names.title),
          el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub),
        ]),
      ]),
      el("p", { class: "kv", style: "margin-top:0.75rem" }, [
        el("span", { class: "k" }, t("alternatives.role")),
        alternativeRole(ornamental),
      ]),
      el("p", { class: "kv", style: "margin-top:0.35rem" }, [
        el("span", { class: "k" }, t("alternatives.whereItsFrom")),
        alternativeOrigin(ornamental),
      ]),
      el("p", {}, alternativeBlurb(ornamental)),
      // Where it's a native of its own somewhere we cover (English ivy in
      // Atlantic France), say so and link to the page that recommends it —
      // "not from here" is a fact about a place, not a character judgement.
      elsewhere
        ? el("p", { class: "note" }, tx("alternative.nativeElsewhere", {
            link: el("a", { href: `#/plants/${elsewhere.plant.id}` },
              t("alternative.nativeElsewhereLink", { region: regionShort(elsewhere.region.meta) })),
          }))
        : null,
      alsoLookalike
        ? el("p", { class: "note" }, tx(
            invasiveIn.length ? "alternative.alsoLookalikeInvasive" : "alternative.alsoLookalike",
            { link: el("a", { href: `#/lookalikes/${alsoLookalike.id}` }, t("alternative.tellApartLink")) },
            invasiveIn.length ? { regions: invasiveIn.map((r) => regionShort(r.meta)).join(", ") } : undefined,
          ))
        : null,
      el("p", { class: "confidence" }, [
        el("span", {}, [
          t("alternatives.originSource"),
          ...citation(ornamental.originBasis),
          " ",
          el("a", { href: inatSearchUrl(ornamental.latin), target: "_blank", rel: "noopener" },
            t("alternative.seeOnInat")),
        ]),
      ]),
    ]),
    ...natives.map((n) => swapCard(ornamental, n)),
    el("p", { class: "confidence", style: "margin-top:1rem" }, t("alternatives.coverageNote")),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("a", { class: "btn btn-secondary", href: "#/alternatives" }, t("alternatives.more")),
      el("a", { class: "btn btn-secondary", href: "#/plants" }, t("alternatives.browseNatives")),
    ]),
  );
}

/** One native that stands in for this ornamental: which plant, in which region,
 *  why it fills the same job, and the water/disease/wildlife case side by side. */
function swapCard(ornamental: Ornamental, n: NativeForOrnamental): HTMLElement {
  const nativeName = commonName(n.plant);
  return el("section", { class: "card" }, [
    el("div", { class: "lookalike-head" }, [
      plantThumb(n.plant.id, n.plant.form, { regionId: n.region.meta.id }),
      el("div", {}, [
        el("h3", { style: "margin:0" }, t("alternatives.swapHeading", { name: nativeName })),
        el("p", { class: "score-why", style: "margin:0.2rem 0 0" }, [
          el("a", { href: `#/regions/${n.region.meta.id}` }, regionName(n.region.meta)),
        ]),
      ]),
    ]),
    el("p", { class: "kv", style: "margin:0.6rem 0 0.5rem" }, [
      el("span", { class: "k" }, t("alternatives.why")),
      alternativeWhy(ornamental.latin, n.link),
    ]),
    edgeTable(ornamental, nativeName, n.link),
    el("p", { class: "confidence", style: "margin-top:0.6rem" }, [
      el("span", {}, [t("alternatives.tellsSource"), ...citation(n.link.basis)]),
    ]),
    el("a", { class: "btn btn-secondary btn-block", style: "margin-top:0.6rem", href: `#/plants/${n.plant.id}` },
      t("alternatives.seeTheNative")),
  ]);
}

/**
 * The comparison itself: one block per trait, each naming both plants, native
 * first. Stacks on a phone and pairs up side by side once there's room —
 * exactly the look-alike `tellTable` shape, so the two features read the same.
 * Empty when a swap makes its whole case in the `why` and claims no edge.
 */
function edgeTable(ornamental: Ornamental, nativeName: string, link: AlternativeLink): HTMLElement | null {
  const edges = alternativeEdges(ornamental.latin, link);
  if (!edges.length) return null;
  const ordered = [...edges].sort((a, b) => AXIS_ORDER.indexOf(a.axis) - AXIS_ORDER.indexOf(b.axis));
  return el("div", { class: "tells" }, ordered.map((edge) =>
    el("div", { class: "tell" }, [
      el("div", { class: "tell-feature" }, t(`alternative.axis.${edge.axis}` as const)),
      el("div", { class: "tell-side is-native" }, [
        el("span", { class: "tell-who" }, shortLabel(nativeName)),
        el("span", {}, edge.native),
      ]),
      el("div", { class: "tell-side is-impostor" }, [
        el("span", { class: "tell-who" }, shortLabel(commonName(ornamental))),
        el("span", {}, edge.ornamental),
      ]),
    ])
  ));
}

function renderNotFound(main: HTMLElement, slug: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("alternatives.notFoundTitle")),
    el("p", { class: "step-lede" }, t("alternatives.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("a", { class: "btn btn-primary", href: "#/alternatives" }, t("alternatives.more")),
      el("a", { class: "btn btn-secondary", href: "#/" }, t("browse.home")),
    ]),
  );
}
