// Browse-by-impostor: the "that isn't the one" read on the catalog.
//
// The rest of the app starts from a plant you want. This starts from the plant
// you already have, or the one on the nursery bench with a tempting label — and
// answers whether it's the thing you think it is.
//
//   #/lookalikes             → every impostor we've written up, as cards.
//   #/lookalikes/in/<region> → only the ones that matter in one region.
//   #/lookalikes/<id>        → one impostor: what it is, where it's really
//                              from, and, for each native it stands in for,
//                              the checkable differences side by side.
//
// **Why the impostor gets the page, not the plant.** An impostor is shared: the
// same cherry laurel is confused with holly in Atlantic France and with
// laurustinus around the Mediterranean, and the same tropical milkweed turns up
// under three different natives in two countries. Giving every plant page its
// own copy would describe the same shrub a dozen times and bury the plant's own
// story under it. So a plant page keeps one compact line — the impostors named
// and linked — and the whole comparison lives here.
import { el, clear } from "../ui";
import { REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import {
  getLookalike,
  lookalikeIndex,
  mappedLookalikeCount,
  nativesForLookalike,
  nativeSomewhere,
  inatSearchUrl,
} from "../lib/lookalikes";
import type { LookalikeIndexRow, NativeForLookalike } from "../lib/lookalikes";
import { filterField, highlight, norm } from "../components/filter-field";
import type { FilterRow } from "../components/filter-field";
import { citation } from "../components/citation";
import { silhouetteFor } from "../components/plant-card";
import type { Lookalike, LookalikeLink, LookalikeStatus } from "../types";
import { t, tn, tx, fmtNumber } from "../lib/i18n";
import { commonName, nameLines, regionName, regionShort } from "../lib/names";
import { lookalikeBlurb, lookalikeOrigin, lookalikeWhy, lookalikeTells } from "../lib/prose";

/** The route prefix that makes `#/lookalikes/…` an index filtered to a region
 *  rather than one impostor's page. Same device, and the same reasoning, as the
 *  wildlife index's: "in" reads as the sentence does and can never collide with
 *  a catalog id. It stays English in every language — a URL is an address. */
const REGION_PREFIX = "in/";

/** The region an `#/lookalikes/in/<id>` route asks for, or null when the param
 *  isn't a region route at all. */
export function lookalikeRegionParam(param?: string): string | null {
  if (!param?.startsWith(REGION_PREFIX)) return null;
  return param.slice(REGION_PREFIX.length).split("/")[0] || null;
}

/** The address of an index — the one place that knows the URL shape. */
const indexHref = (regionId: string | null): string =>
  regionId ? `#/lookalikes/${REGION_PREFIX}${regionId}` : "#/lookalikes";

/** The badge class each status wears. Invasive is the app's caution red,
 *  introduced its amber, a native look-alike simply neutral — the whole point
 *  of having three words is that they are not the same accusation. */
const STATUS_CLASS: Record<LookalikeStatus, string> = {
  invasive: "caution",
  introduced: "nowater",
  native: "neutral",
};

export function statusBadge(status: LookalikeStatus): HTMLElement {
  return el("span", {
    class: `badge ${STATUS_CLASS[status]}`,
    title: t(`lookalike.statusPlain.${status}` as const),
  }, t(`lookalike.status.${status}` as const));
}

/** The short form of a name for the cramped side-by-side labels: "Cabbage Palm
 *  (Sabal Palm)" is a fine heading and a terrible column header. */
const shortLabel = (name: string): string => name.replace(/\s*[([].*$/, "");

/**
 * The comparison itself: one block per difference, each naming both plants.
 * Stacks on a phone and pairs up side by side once there's room — a
 * three-column table at 360 px is four words to a line.
 */
export function tellTable(plantLatin: string, nativeName: string, lookalikeName: string, link: LookalikeLink, regionId?: string): HTMLElement {
  return el("div", { class: "tells" }, lookalikeTells(plantLatin, link, regionId).map((tell) =>
    el("div", { class: "tell" }, [
      el("div", { class: "tell-feature" }, tell.feature),
      el("div", { class: "tell-side is-native" }, [
        el("span", { class: "tell-who" }, shortLabel(nativeName)),
        el("span", {}, tell.native),
      ]),
      el("div", { class: "tell-side is-impostor" }, [
        el("span", { class: "tell-who" }, shortLabel(lookalikeName)),
        el("span", {}, tell.lookalike),
      ]),
    ])
  ));
}

// ---------------------------------------------------------------------------
// #/lookalikes and #/lookalikes/in/<region> — the index
// ---------------------------------------------------------------------------

export async function renderLookalikeIndex(main: HTMLElement, region?: RegionDef): Promise<void> {
  clear(main);
  const rows = await lookalikeIndex(region?.meta.id);
  // Counted once, here, so the region picker below doesn't ask again per region.
  const perRegion = new Map<string, number>();
  for (const row of await lookalikeIndex()) {
    for (const id of row.regionIds) perRegion.set(id, (perRegion.get(id) ?? 0) + 1);
  }

  document.title = region
    ? t("lookalikes.regionDocTitle", { region: regionName(region.meta) })
    : t("lookalikes.indexDocTitle");

  main.append(
    el("h2", { class: "step-title" }, t("lookalikes.indexTitle")),
    el("p", { class: "step-lede" },
      region
        ? t("lookalikes.indexLedeRegion", { n: fmtNumber(rows.length), region: regionShort(region.meta) })
        : t("lookalikes.indexLede", { n: fmtNumber(mappedLookalikeCount()) })),
    // Not every impostor is a villain, and the index is where that has to be
    // said once — otherwise a page of red badges reads as a blacklist.
    el("p", { class: "note info", style: "margin-top:0" }, [
      el("strong", {}, t("lookalikes.notAllVillains")),
      t("lookalikes.notAllVillainsRest"),
    ]),
  );

  const cards = rows.map((r) => indexCard(r, region ?? null));
  main.append(
    regionFilter(region ?? null, perRegion),
    ...(cards.length > 1 ? [filterField(cards, [], {
      label: t("lookalikes.filterAria"),
      placeholder: t("lookalikes.filterPlaceholder"),
      count: (shown, total, q) =>
        tn("lookalikes.filterCount", shown, { shown: fmtNumber(shown), total: fmtNumber(total), q }),
      // A name that isn't an impostor we've written up is very often a plant —
      // send them to the catalog rather than to a dead end.
      fallback: (q) => [
        t("lookalikes.filterNone", { q }),
        el("a", { href: `#/plants?q=${encodeURIComponent(q)}` }, t("lookalikes.filterSearchPlants")),
        t("lookalikes.filterNoneRest"),
      ],
    })] : []),
    el("div", { class: "card-grid" }, cards.map((c) => c.node)),
    el("p", { class: "confidence", style: "margin-top:1rem" }, t("lookalike.coverageNote")),
  );
}

/** The region picker, in the shape the wildlife index established: a real
 *  select, with a count on every option, and no option that leads nowhere. */
function regionFilter(active: RegionDef | null, perRegion: Map<string, number>): HTMLElement {
  const select = el("select", { id: "lookalike-region" }, [
    el("option", { value: "", selected: !active },
      t("lookalikes.regionFilterAll", { n: fmtNumber(mappedLookalikeCount()) })),
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
    el("label", { for: "lookalike-region" }, t("lookalikes.regionFilterLabel")),
    select,
  ]);
}

/** An impostor's card on the index. The line that earns its place is the last
 *  one: *what it's mistaken for*. That's what a reader scans the index for —
 *  "which of my plants is this one about?" */
function indexCard(row: LookalikeIndexRow, region: RegionDef | null): FilterRow {
  const names = nameLines(row.lookalike);
  const natives = row.natives.map((n) => commonName(n.plant));
  const title = el("span", {});
  const sub = names.sub ? el("em", {}) : null;
  const mistaken = el("span", {});

  const node = el("article", { class: "card lookalike-card" }, [
    el("div", { class: "lookalike-head" }, [
      el("h4", { style: "margin:0" }, [
        el("a", { href: `#/lookalikes/${row.lookalike.id}` }, [title]),
      ]),
      statusBadge(row.worstStatus),
    ]),
    sub ? el("div", { class: "lookalike-latin" }, [sub]) : null,
    el("p", { class: "score-why", style: "margin:0.35rem 0 0" }, lookalikeOrigin(row.lookalike)),
    el("p", { class: "kv", style: "margin:0.5rem 0 0" }, [
      el("span", { class: "k" }, region ? t("lookalikes.mistakenForHere") : t("lookalikes.mistakenFor")),
      mistaken,
    ]),
  ]);

  const mark = (nq: string): void => {
    clear(title);
    title.append(...highlight(names.title, nq));
    if (sub) {
      clear(sub);
      sub.append(...highlight(names.sub, nq));
    }
    clear(mistaken);
    natives.forEach((n, i) => {
      if (i) mistaken.append(" · ");
      mistaken.append(...highlight(n, nq));
    });
  };
  mark("");

  return {
    // Findable by any of the impostor's names *and* by the natives it stands in
    // for: "serviceberry" is what a person remembers, not "Pyrus calleryana".
    hay: norm([names.title, row.lookalike.common, row.lookalike.latin, ...natives,
      ...row.natives.map((n) => n.plant.latin)].join(" ")),
    node,
    mark,
  };
}

// ---------------------------------------------------------------------------
// #/lookalikes/<id> — one impostor
// ---------------------------------------------------------------------------

export async function renderLookalike(main: HTMLElement, param?: string): Promise<void> {
  // `#/lookalikes/in/<region>` is the index narrowed, not an impostor called
  // "in" — the router hands both shapes here and this is where they part.
  const regionId = lookalikeRegionParam(param);
  if (regionId !== null) {
    return renderLookalikeIndex(main, REGIONS.find((r) => r.meta.id === regionId));
  }

  clear(main);
  const lookalike = param ? getLookalike(param) : undefined;
  if (!lookalike) return renderNotFound(main, param ?? "");

  const natives = await nativesForLookalike(lookalike.id);
  const names = nameLines(lookalike);
  const elsewhere = await nativeSomewhere(lookalike.latin);
  document.title = t("lookalikes.docTitle", { name: names.title });

  main.append(
    el("p", { class: "back-trail" }, [
      el("a", { href: "#/lookalikes" }, t("lookalikes.backToIndex")),
    ]),
    el("article", { class: "plant" }, [
      el("div", { class: "plant-head" }, [
        el("div", { class: "plant-photo", "aria-hidden": "true" }, [silhouetteFor(lookalike.form)]),
        el("div", {}, [
          el("h2", { class: "plant-name", style: "margin:0" }, names.title),
          el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub),
          // One badge per distinct status across the regions it appears in: a
          // plant can be invasive in one place and merely planted in another,
          // and flattening that to a single word would be false in one of them.
          el("div", {}, [...new Set(natives.map((n) => n.link.status))].map(statusBadge)),
        ]),
      ]),
      el("p", { class: "kv", style: "margin-top:0.75rem" }, [
        el("span", { class: "k" }, t("lookalikes.whereItsFrom")),
        lookalikeOrigin(lookalike),
      ]),
      el("p", {}, lookalikeBlurb(lookalike)),
      // Where it's a native of its own, say so, and link to the page that says
      // why it's worth planting there. "Not from here" is the whole claim.
      elsewhere
        ? el("p", { class: "note" }, tx("lookalike.nativeElsewhere", {
            link: el("a", { href: `#/plants/${elsewhere.plant.id}` },
              t("lookalike.nativeElsewhereLink", { region: regionShort(elsewhere.region.meta) })),
          }))
        : null,
      el("p", { class: "confidence" }, [
        el("span", {}, [
          t("lookalikes.originSource"),
          ...citation(lookalike.originBasis),
          " ",
          el("a", { href: inatSearchUrl(lookalike.latin), target: "_blank", rel: "noopener" },
            t("lookalike.seeOnInat")),
        ]),
      ]),
    ]),
    ...natives.map((n) => comparisonCard(lookalike, n)),
    el("p", { class: "confidence", style: "margin-top:1rem" }, t("lookalike.coverageNote")),
    el("div", { class: "btn-row", style: "margin-top:1.25rem" }, [
      el("a", { class: "btn btn-secondary", href: "#/lookalikes" }, t("lookalikes.more")),
      el("a", { class: "btn btn-secondary", href: "#/plants" }, t("lookalikes.browseNatives")),
    ]),
  );
}

/** One native this impostor stands in for: which plant, in which region, why
 *  they're mixed up, and the side-by-side tells. */
function comparisonCard(lookalike: Lookalike, n: NativeForLookalike): HTMLElement {
  const nativeName = commonName(n.plant);
  return el("section", { class: "card" }, [
    el("div", { class: "lookalike-head" }, [
      el("h3", { style: "margin:0" }, t("lookalikes.mistakenForHeading", { name: nativeName })),
      statusBadge(n.link.status),
    ]),
    el("p", { class: "score-why", style: "margin:0.2rem 0 0.6rem" }, [
      el("a", { href: `#/regions/${n.region.meta.id}` }, regionName(n.region.meta)),
    ]),
    el("p", { class: "kv", style: "margin:0 0 0.5rem" }, [
      el("span", { class: "k" }, t("lookalike.whyMixedUp")),
      lookalikeWhy(n.plant.latin, n.link, n.region.meta.id),
    ]),
    tellTable(n.plant.latin, nativeName, commonName(lookalike), n.link, n.region.meta.id),
    el("p", { class: "confidence", style: "margin-top:0.6rem" }, [
      el("span", {}, [t("lookalike.tellsSource"), ...citation(n.link.basis)]),
    ]),
    // No plant name in the label: it changes width per plant and the heading
    // right above already says which one this card is about.
    el("a", { class: "btn btn-secondary btn-block", style: "margin-top:0.6rem", href: `#/plants/${n.plant.id}` },
      t("lookalikes.seeTheNative")),
  ]);
}

function renderNotFound(main: HTMLElement, slug: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("lookalikes.notFoundTitle")),
    el("p", { class: "step-lede" }, t("lookalikes.notFoundLede", { slug })),
    el("div", { class: "btn-row" }, [
      el("a", { class: "btn btn-primary", href: "#/lookalikes" }, t("lookalikes.more")),
      el("a", { class: "btn btn-secondary", href: "#/" }, t("browse.home")),
    ]),
  );
}
