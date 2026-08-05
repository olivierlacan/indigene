// Browse-by-wildlife: the food-web read on the catalog. The rest of the app
// starts from a plant or a spot; this starts from the animal you're hoping to
// bring in — "show me the natives that raise monarchs / feed hummingbirds /
// bring back the atala" — and lists the plants that support it, region by
// region, saying honestly how each one helps (raises its young vs. feeds it).
//
// The index narrows two ways, and they compose — a group is *what*, a region is
// *where*, and either can be fixed without giving up the other:
//   #/wildlife                     → everything, grouped into butterflies /
//                                    moths / bees / birds / mammals.
//   #/wildlife/<group>             → one group ("…/butterflies") — the
//                                    shareable answer to "just show me the moths".
//   #/wildlife/in/<region>         → only what one region's native plants support.
//   #/wildlife/in/<region>/<group> → both at once.
//   #/wildlife/<id>                → one animal: what it is, then the plants that
//                                    support it by region, each linking to its
//                                    profile. An animal's id always wins the route.
//
// Every index shape carries the same type-to-narrow filter the region rosters
// have, underlining what you typed exactly as the search page does.
import { el, clear } from "../ui";
import { navigate } from "../state";
import { REGIONS } from "../lib/plants";
import type { RegionDef } from "../lib/plants";
import {
  KIND_ORDER,
  KIND_SLUGS,
  getWildlife,
  plantsForWildlife,
  relianceOf,
  wildlifeIndex,
  wildlifeCountsByRegion,
  mappedWildlifeCount,
  wildlifeKindRoute,
} from "../lib/wildlife";
import type { PlantSupport, WildlifeIndexRow } from "../lib/wildlife";
import { filterField, highlight, norm } from "../components/filter-field";
import type { FilterRow, FilterSection } from "../components/filter-field";
import type { WildlifeKind } from "../types";
import { relianceLabel, supportLabel, wildlifeKindLabel, DATA_SOURCES_URL } from "../lib/plain";
import { speciesRecordUrl } from "../data/sources";
import { citation } from "../components/citation";
import { termTag, openTermDialog } from "../components/term-dialog";
import { supportIcon, relianceIcon } from "../components/support-icon";
import { silhouetteFor } from "../components/plant-card";
import { sectionHeading } from "../components/section-link";
import { keystoneIcon } from "../components/keystone-icon";
import { wildlifeNearbySection } from "../components/wildlife-nearby";
import { wildlifeThumb, wildlifeHero } from "../components/wildlife-thumb";
import { cardStats } from "../components/card-stats";
import type { SupportLink } from "../types";
import { t, tn, fmtNumber, fmtList, getLang } from "../lib/i18n";
import { commonName, nameLines, regionName, regionShort } from "../lib/names";
import { wildlifeBlurb, supportNote, wildlifeUntranslated } from "../lib/prose";
import { reportUntranslated } from "../components/wip-banner";

// Shared honesty note: this is the notable, mapped wildlife — never a claim to
// be the whole food web. Shown on both the index and every animal's page. A
// function, not a constant: a constant would be frozen in whatever language
// was active when this module first loaded.
const coverageNote = (): string => t("wildlife.coverageNote");

/** The route prefix that makes `#/wildlife/…` an index filtered to a region
 *  rather than one animal's page — "in" reads as the sentence does ("wildlife
 *  in the Pacific Northwest") and can never collide with a creature id. It
 *  stays English in every language: a URL is an address, not copy. */
const REGION_PREFIX = "in/";

/** What a `#/wildlife/in/…` route asks for: a region, and optionally a group
 *  within it. Null when the param isn't a region route at all. */
export interface WildlifeRegionRoute {
  regionId: string;
  /** The slug as typed — resolved to a kind (or rejected) by the renderer. */
  groupSlug?: string;
}

export function wildlifeRegionParam(param?: string): WildlifeRegionRoute | null {
  if (!param?.startsWith(REGION_PREFIX)) return null;
  const [regionId, groupSlug] = param.slice(REGION_PREFIX.length).split("/");
  return regionId ? { regionId, groupSlug } : null;
}

/** The address of an index: region and group are independent, and either can
 *  be absent. This is the one place that knows the URL shape. */
function indexHref(regionId: string | null, kind: WildlifeKind | null): string {
  const group = kind ? KIND_SLUGS[kind] : "";
  if (!regionId) return group ? `#/wildlife/${group}` : "#/wildlife";
  return `#/wildlife/${REGION_PREFIX}${regionId}${group ? `/${group}` : ""}`;
}

/** Which slice of the catalog an index page is showing. Both are optional and
 *  they compose: all of it, one group, one region, or one group in one region. */
export interface IndexView {
  kind?: WildlifeKind;
  region?: RegionDef;
}

// ---- #/wildlife, #/wildlife/<group>, #/wildlife/in/<region>[/<group>] ----
// One renderer for all of them. They differ in the heading and which cards are
// on the page; the two filters, the chips and the coverage note are the same
// page furniture throughout.
export function renderWildlifeIndex(main: HTMLElement, view: IndexView = {}): void {
  clear(main);
  const { kind, region } = view;

  // Scoped to the region first: a card's plant count has to mean "plants on
  // *this* region's list", and the group counts on the chips have to match the
  // cards under them.
  const all = wildlifeIndex(region?.meta.id);
  const rows = kind ? all.filter((r) => r.wildlife.kind === kind) : all;
  const label = kind ? wildlifeKindLabel(kind) : null;

  document.title = label
    ? region
      ? t("wildlife.groupInRegionDocTitle", { group: label.title, region: regionName(region.meta) })
      : t("wildlife.groupDocTitle", { group: label.title })
    : region
      ? t("wildlife.regionDocTitle", { region: regionName(region.meta) })
      : t("wildlife.indexDocTitle");

  // The animals' own writing hasn't been translated yet (see lib/prose): report
  // it, and main.ts banners it at the top rather than letting the page mix two
  // languages in silence.
  if (wildlifeUntranslated(rows.map((r) => r.wildlife))) reportUntranslated(t("wip.wildlife"));

  // The line above the heading says what you've already narrowed to, and is the
  // way back out of it: the region page for a region, the whole catalog for a
  // group.
  if (region) {
    main.append(
      el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        "📍 ",
        el("a", { href: `#/regions/${region.meta.id}` }, regionName(region.meta)),
      ]),
    );
  } else if (label) {
    main.append(
      el("p", { class: "region-tag", style: "margin:0 0 0.3rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        el("a", { href: "#/wildlife" }, t("wildlife.allWildlife")),
      ]),
    );
  }

  if (label) {
    main.append(
      el("h2", { class: "step-title" }, [
        el("span", { "aria-hidden": "true" }, `${label.icon} `),
        label.title,
      ]),
      el("p", { class: "step-lede" },
        region
          ? t("wildlife.groupInRegionLede", {
              n: fmtNumber(rows.length),
              region: regionShort(region.meta),
              blurb: label.blurb,
            })
          : t("wildlife.groupLede", { n: fmtNumber(rows.length), blurb: label.blurb })),
    );
  } else {
    main.append(
      el("h2", { class: "step-title" }, t("wildlife.indexTitle")),
      el("p", { class: "step-lede" },
        region
          ? t("wildlife.indexLedeRegion", { n: fmtNumber(rows.length), region: regionShort(region.meta) })
          : t("wildlife.indexLede", { n: fmtNumber(all.length) })),
    );
    if (!region) {
      main.append(
        el("p", { class: "note info", style: "margin-top:0" }, [
          el("strong", {}, t("wildlife.allNative")),
          t("wildlife.allNativeRest"),
        ]),
      );
    }
  }

  const filterRows: FilterRow[] = [];
  const sections: FilterSection[] = [];
  const groups: HTMLElement[] = [];

  if (kind) {
    const cards = rows.map((r) => wildlifeCard(r, region ?? null));
    filterRows.push(...cards);
    // One column on a phone, columns on anything wider — the creature cards
    // are self-contained, so a laptop should show a group at a glance rather
    // than one card per screenful.
    groups.push(
      cards.length
        ? el("div", { class: "card-grid" }, cards.map((c) => c.node))
        : el("p", { class: "note warn" },
            t("wildlife.emptyGroup", { group: label?.title.toLowerCase() ?? "" })),
    );
  } else {
    for (const k of KIND_ORDER) {
      const inKind = rows.filter((r) => r.wildlife.kind === k);
      if (!inKind.length) continue;
      const kindLabel = wildlifeKindLabel(k);
      const cards = inKind.map((r) => wildlifeCard(r, region ?? null));
      const node = el("section", {}, [
        sectionHeading(
          indexHref(region?.meta.id ?? null, k),
          kindLabel.icon,
          kindLabel.title,
          fmtNumber(inKind.length)
        ),
        el("p", { style: "margin:0 0 0.6rem;font-size:0.9rem;color:var(--ink-soft)" }, kindLabel.blurb),
        el("div", { class: "card-grid" }, cards.map((c) => c.node)),
      ]);
      filterRows.push(...cards);
      sections.push({ node, rows: cards });
      groups.push(node);
    }
  }

  main.append(
    // Where, then by name, then what: the region picker cuts the widest, so it
    // reads first and the chips below it already show that region's counts.
    // "Every region" has to count what leaving the region behind would show —
    // the whole catalog, or the whole of this group — not what's on screen now.
    regionFilter(view, kind ? wildlifeIndex().filter((r) => r.wildlife.kind === kind).length : mappedWildlifeCount()),
    // A filter over a single card is furniture, not help.
    ...(filterRows.length > 1 ? [filterField(filterRows, sections, {
      label: t("wildlife.filterAria"),
      placeholder: t("wildlife.filterPlaceholder"),
      count: (shown, total, q) =>
        tn("wildlife.filterCount", shown, { shown: fmtNumber(shown), total: fmtNumber(total), q }),
      // On a group's page the obvious next move is the rest of the catalog; on
      // the whole catalog it's the plants — a name that isn't an animal we've
      // mapped is quite often a plant.
      fallback: (q) =>
        label
          ? [
              t("wildlife.filterNoneGroup", { group: label.title.toLowerCase(), q }),
              el("a", { href: indexHref(region?.meta.id ?? null, null) }, t("wildlife.filterSeeAll")),
              t("wildlife.filterNoneRest"),
            ]
          : [
              t("wildlife.filterNoneIndex", { q }),
              el("a", { href: `#/plants?q=${encodeURIComponent(q)}` }, t("wildlife.filterSearchPlants")),
              t("wildlife.filterNoneRest"),
            ],
    })] : []),
    kindChips(all, kind ?? null, region ?? null),
    ...groups,
    el("p", { class: "note", style: "margin-top:1.25rem" }, coverageNote()),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      kind || region
        ? el("a", { class: "btn btn-secondary", href: "#/wildlife" }, t("wildlife.allWildlife"))
        : el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("wildlife.browsePlants")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.startFromSpot")),
    ]),
  );
}

/** Chip nav across the wildlife groups; `current` marks the active one. The
 *  region travels with them — narrowing by group inside a region keeps the
 *  region, and the counts are that region's. */
function kindChips(
  rows: WildlifeIndexRow[],
  current: WildlifeKind | null,
  region: RegionDef | null
): HTMLElement {
  const chips: HTMLElement[] = [];
  if (current) {
    chips.push(el("a", { class: "btn btn-secondary", style: chipStyle, href: indexHref(region?.meta.id ?? null, null) },
      t("wildlife.allChip", { n: fmtNumber(rows.length) })));
  }
  for (const k of KIND_ORDER) {
    const count = rows.filter((r) => r.wildlife.kind === k).length;
    if (!count) continue;
    const label = wildlifeKindLabel(k);
    chips.push(el("a", {
      class: "btn btn-secondary",
      style: chipStyle,
      href: indexHref(region?.meta.id ?? null, k),
      "aria-current": k === current ? "page" : undefined,
    }, [
      el("span", { "aria-hidden": "true" }, label.icon),
      ` ${label.title} (${fmtNumber(count)})`,
    ]));
  }
  return el("nav", { "aria-label": t("wildlife.groupsNav"), style: "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0 0.8rem" }, chips);
}

/**
 * The region filter. A picker rather than a row of chips: nine regions as
 * tappable chips is six rows of controls before the first creature on a phone,
 * and the list only grows as Indigene adds regions — where five groups fit a
 * chip row exactly. Changing it navigates, so a filtered list is still a
 * shareable URL with a working Back button, and it keeps whichever group
 * you're in: "the butterflies" and "the Pacific Northwest" are different
 * questions and neither should cancel the other.
 */
function regionFilter(view: IndexView, totalHere: number): HTMLElement {
  const counts = regionCounts(view.kind ?? null);
  const select = el("select", { id: "wildlife-region" }, [
    el("option", { value: "", selected: !view.region }, t("wildlife.regionFilterAll", { n: fmtNumber(totalHere) })),
    // A region with nothing mapped in this group is left out: an option
    // leading to an empty list is a dead end, not a filter.
    ...REGIONS.filter((r) => counts.get(r.meta.id)).map((r) =>
      el(
        "option",
        { value: r.meta.id, selected: r.meta.id === view.region?.meta.id },
        `${regionShort(r.meta)} (${fmtNumber(counts.get(r.meta.id) ?? 0)})`
      )
    ),
  ]) as HTMLSelectElement;
  select.addEventListener("change", () => {
    location.hash = indexHref(select.value || null, view.kind ?? null);
  });
  return el("div", { class: "field field-inline" }, [
    el("label", { for: "wildlife-region" }, t("wildlife.regionFilterLabel")),
    select,
  ]);
}

/** How many animals each region has *in this group* — so the number on an
 *  option matches the page that option leads to. */
function regionCounts(kind: WildlifeKind | null): Map<string, number> {
  if (!kind) return wildlifeCountsByRegion();
  const counts = new Map<string, number>();
  for (const row of wildlifeIndex()) {
    if (row.wildlife.kind !== kind) continue;
    for (const id of row.regionIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

// `gap:0.3rem` overrides .btn's roomy 0.5rem so a chip's icon hugs its label.
const chipStyle = "flex:0 1 auto;min-height:2.4rem;padding:0.4rem 0.6rem;font-size:0.9rem;text-decoration:none;gap:0.3rem";

// A creature's card on the index. The blurbs are different lengths, so the
// reach figures are pinned to the bottom of the card (`.card-stats`) rather
// than left to flow after the text — in a grid that means every card's numbers
// sit on the same line, and the eye reads down a column instead of hunting.
// `mark` re-draws the names with the filter query underlined, the way a search
// result does.
function wildlifeCard(row: WildlifeIndexRow, region: RegionDef | null): FilterRow {
  const { wildlife: w, plantCount } = row;
  const names = nameLines(w);
  const regions = row.regionIds
    .map((id) => REGIONS.find((r) => r.meta.id === id))
    .filter((r): r is RegionDef => r !== undefined);
  const title = el("span", {});
  const sub = names.sub
    ? el("span", { class: "plant-latin", style: "font-weight:400;font-size:0.82rem" })
    : null;
  const node = el("article", { class: "card wildlife-card" }, [
    // The emoji, with the animal's chosen photograph fading in over it where
    // one has been picked — the same arrangement the plant lists use, and for
    // the same reason: the row is never empty and never jumps.
    wildlifeThumb(w.id, w.icon, {
      px: 56,
      regionId: region?.meta.id,
      attrs: { class: "wildlife-photo wildlife-card-icon" },
    }),
    el("div", { class: "wildlife-card-text" }, [
      el("h4", { class: "wildlife-card-name" }, [
        el("a", { href: `#/wildlife/${w.id}` }, [title]),
        sub,
      ]),
      el("p", { class: "wildlife-card-blurb" }, wildlifeBlurb(w)),
      cardStats([
        {
          icon: "🌱",
          value: fmtNumber(plantCount),
          label: region
            ? tn("wildlife.supportedByInRegion", plantCount, {
                n: fmtNumber(plantCount),
                region: regionName(region.meta),
                animal: names.title,
              })
            : tn("wildlife.supportedBy", plantCount, { n: fmtNumber(plantCount), animal: names.title }),
        },
        // The reach across regions, and only when there's a spread worth
        // reporting. This is what used to be a "🌿 native" tag: true of every
        // animal here, and so worth nothing on any of them. One region is the
        // same non-fact, so it shows nothing; two or more is news, and the
        // figure opens the list of them, each a link.
        //
        // A pin, not a leaf: 📍 is this app's mark for a *place* (a region
        // heading, a region card, the tag above a filtered list), and 🌿 is
        // its mark for nativeness — which is exactly the claim this figure
        // stopped making.
        regions.length > 1
          ? {
              icon: "📍",
              value: fmtNumber(regions.length),
              label: t("wildlife.inRegions", {
                n: fmtNumber(regions.length),
                regions: fmtList(regions.map((r) => regionShort(r.meta))),
              }),
              onActivate: () => openRegionsDialog(names.title, regions),
            }
          : null,
      ]),
    ]),
  ]);
  const mark = (nq: string): void => {
    title.replaceChildren(...highlight(names.title, nq));
    if (sub) sub.replaceChildren(" · ", ...highlight(names.sub, nq));
  };
  mark("");
  // Findable by every name, not only the displayed one: a French reader who
  // knows the animal as "monarch" should still land on it.
  return { hay: norm(`${names.title} ${names.sub} ${w.common} ${w.latin ?? ""}`), node, mark };
}

/** The regions figure's tap target: the names in full, each linking to that
 *  region's wildlife. The hover tooltip already names them for a pointer; this
 *  is how a phone reads them at all, and how either gets somewhere from them. */
function openRegionsDialog(animal: string, regions: RegionDef[]): void {
  openTermDialog({
    icon: "📍",
    term: t("wildlife.inRegionsTitle", { n: fmtNumber(regions.length) }),
    plain: t("wildlife.inRegionsBody", { animal, n: fmtNumber(regions.length) }),
    extra: [
      el("ul", { class: "term-dialog-links" }, regions.map((r) =>
        el("li", {}, [el("a", { href: indexHref(r.meta.id, null) }, regionName(r.meta))])
      )),
    ],
  });
}

/** "📍 Native to <region> · <region>" — an animal's regions as pills, each a
 *  link to that region's wildlife. The animal's own page has the room to name
 *  them; the index cards carry the count instead (see `wildlifeCard`). */
function regionPills(regions: RegionDef[]): HTMLElement {
  return el("span", { class: "region-pills" }, [
    el("span", { class: "region-pills-k" }, t("wildlife.nativeTo")),
    ...regions.map((r) =>
      el("a", {
        class: "region-pill",
        href: indexHref(r.meta.id, null),
        title: t("wildlife.regionPillTitle", { region: regionName(r.meta) }),
      }, regionShort(r.meta))
    ),
  ]);
}

// ---- #/wildlife/<id> — one animal ----
export function renderWildlife(main: HTMLElement, param?: string): void {
  clear(main);

  // "in/<region>[/<group>]" is an index, not an animal — and it's checked on
  // the whole param, before the split below, because `in` is nobody's id.
  const route = wildlifeRegionParam(param);
  if (route) {
    const region = REGIONS.find((r) => r.meta.id === route.regionId);
    if (!region) {
      renderUnknownRegion(main, route.regionId);
      return;
    }
    const kind = route.groupSlug ? wildlifeKindRoute(route.groupSlug) : undefined;
    if (route.groupSlug && !kind) {
      renderNotFound(main, param ?? "");
      return;
    }
    renderWildlifeIndex(main, { region, kind });
    return;
  }

  const id = (param ?? "").split("/")[0];
  const w = getWildlife(id);
  if (!w) {
    // Not an animal — it may still be a group ("…/butterflies").
    const kind = wildlifeKindRoute(id);
    if (kind) {
      renderWildlifeIndex(main, { kind });
      return;
    }
    renderNotFound(main, id);
    return;
  }
  document.title = t("wildlife.docTitle", { animal: commonName(w) });
  if (wildlifeUntranslated([w])) reportUntranslated(t("wip.wildlife"));

  const supports = plantsForWildlife(w.id);
  const label = wildlifeKindLabel(w.kind);
  const names = nameLines(w);

  // Group the supporting plants by region, in the app's usual region order.
  const byRegion = REGIONS.map((r) => ({
    region: r,
    items: supports.filter((s) => s.region.meta.id === r.meta.id),
  })).filter((g) => g.items.length);

  const plantCount = supports.length;
  const hosts = supports.filter((s) => s.link.support === "host").length;
  const soleCount = supports.filter((s) => relianceOf(s.link) === "sole").length;

  // The chosen photograph, if there is one. Keyed to the first region this
  // animal is documented in, which is the one whose plants the page leads with
  // — a swallowtail on the Atlantic coast is not the same picture as its cousin
  // in Florida.
  const hero = wildlifeHero(w, byRegion[0]?.region.meta.id);

  main.append(
    el("article", { class: "plant plant-animal" }, [
      el("p", { class: "region-tag", style: "margin:0 0 0.4rem;font-size:0.9rem;color:var(--ink-soft)" }, [
        el("a", { href: "#/wildlife" }, t("wildlife.allWildlife")),
        "  ·  ",
        el("a", { href: `#/wildlife/${KIND_SLUGS[w.kind]}` }, `${label.icon} ${label.title}`),
      ]),
      // Who it is on the left, what we know about it on the right — but only on
      // a laptop. Both wrappers are `display: contents` below that breakpoint,
      // so on a phone this is the single stack it has always been. (The same
      // pair a plant's page uses; see "Profile pages on a laptop".)
      el("div", { class: "plant-cols" }, [
        el("div", { class: "plant-col" }, [
          // The photograph where one has been chosen, the emoji where none has
          // — the same two layouts a plant's profile has, and the same reason
          // for the float: a name, a binomial and a row of region pills are
          // shorter than a photograph is tall, and a flex column would leave
          // that difference blank.
          el("div", { class: hero ? "plant-head plant-head-photo" : "plant-head" }, [
            hero ?? el("div", { "aria-hidden": "true", style: "font-size:2.4rem;line-height:1;flex:0 0 auto" }, w.icon),
            el("div", {}, [
              el("h2", { class: "plant-name", style: "margin:0" }, names.title),
              names.sub ? el("div", { class: names.subIsLatin ? "plant-latin" : "plant-latin plant-foreign" }, names.sub) : null,
              // Not a "Native animal" badge: every animal in the catalog is one,
              // and the sourced sentence below says so properly. What's worth a
              // glance here is *where* — each region a tap away from the rest of
              // the wildlife it shares a list with.
              regionPills(byRegion.map((g) => g.region)),
            ]),
          ]),
          // The .plant card has no padding of its own (media can run full-bleed),
          // so all the loose text lives in a .plant-body to get the usual
          // gutters. It's in two halves here: what this animal *is* stays with
          // its name, and everything we can vouch for goes in the column
          // opposite. `-lead` and `-rest` between them add up to exactly one
          // .plant-body's padding, so the phone stack is unchanged.
          el("div", { class: "plant-body plant-body-lead" }, [
            el("p", { style: "margin:0" }, wildlifeBlurb(w)),
          ]),
        ]),
        el("div", { class: "plant-col" }, [
          el("div", { class: "plant-body plant-body-rest" }, [
            // The native-status guarantee, sourced (authority names linked) — a native
            // plant should be feeding a native animal, and we say where that comes from.
            el("p", { class: "confidence wildlife-vouch" }, [
              el("span", { "aria-hidden": "true" }, "🌿 "),
              el("strong", {}, t("wildlife.aNativeAnimal")),
              ...citation(w.nativeBasis),
            ]),
            speciesLink(w),
            el("p", { style: "margin:0.4rem 0 0;font-weight:650" }, [
              tn("wildlife.supportedBy", plantCount, { n: fmtNumber(plantCount), animal: names.title }),
              hosts ? tn("wildlife.ofThemHosts", hosts, { n: fmtNumber(hosts) }) : ".",
            ]),
            soleCount
              ? el("p", { class: "note info", style: "margin:0.5rem 0 0" }, [
                  el("strong", {}, tn("wildlife.cantLiveWithout", soleCount)),
                  tn("wildlife.onlyOption", soleCount, { n: fmtNumber(soleCount), animal: names.title }),
                ])
              : null,
          ]),
        ]),
      ]),
    ]),
  );

  // "See it near you" — real iNaturalist sightings of this animal near the user
  // (or in a region it's found in). Null for informal groups with no single taxon.
  const nearby = wildlifeNearbySection(w);
  if (nearby) main.append(nearby);

  for (const group of byRegion) {
    main.append(
      el("section", {}, [
        sectionHeading(`#/regions/${group.region.meta.id}`, "📍", regionName(group.region.meta)),
        // A grid, not a stack: one column at phone width, as many as fit on a
        // laptop (see `.wildlife-supports`). An animal with a dozen plants was
        // a dozen full-width rows down the middle of a desktop window.
        el("div", { class: "wildlife-supports" },
          group.items
            .slice()
            .sort(sortByStrength)
            .map((s) => supportRow(s)),
        ),
      ]),
    );
  }

  main.append(
    el("p", { class: "note", style: "margin-top:1.25rem" }, coverageNote()),
    el("p", { class: "confidence", style: "margin-top:0.5rem" }, [
      el("a", { href: DATA_SOURCES_URL, target: "_blank", rel: "noopener" }, t("wildlife.allSources")),
    ]),
    el("div", { class: "btn-row", style: "margin-top:1rem" }, [
      el("button", { class: "btn btn-secondary", onClick: () => navigate("wildlife") }, t("wildlife.allWildlife")),
      el("button", { class: "btn btn-primary", onClick: () => navigate("location") }, t("wildlife.rankForSpot")),
    ]),
  );
}

// Strongest dependence first: sole > narrow > broad, then host over other
// support kinds, then alphabetical — so the make-or-break plants lead.
const RELIANCE_RANK = { sole: 0, narrow: 1, broad: 2 } as const;
function sortByStrength(a: PlantSupport, b: PlantSupport): number {
  const ar = RELIANCE_RANK[relianceOf(a.link)];
  const br = RELIANCE_RANK[relianceOf(b.link)];
  if (ar !== br) return ar - br;
  const ah = a.link.support === "host" ? 0 : 1;
  const bh = b.link.support === "host" ? 0 : 1;
  if (ah !== bh) return ah - bh;
  // Sorted by the name the reader actually sees, in their own collation —
  // "Épicéa" files under E in French, not after Z.
  return commonName(a.plant).localeCompare(commonName(b.plant), getLang());
}

// A plant row on an animal's page. The card is a plain div (not a link) so the
// tie chips can be real buttons; the plant name is the link to its profile.
function supportRow(s: PlantSupport): HTMLElement {
  const p = s.plant;
  const names = nameLines(p);
  return el("div", { class: "card support-row" }, [
    el("a", {
      href: `#/plants/${p.id}`,
      class: "plant-photo",
      "aria-label": t("wildlife.fullProfile", { name: names.title }),
      style: "flex:0 0 auto",
    }, [silhouetteFor(p.form)]),
    el("div", { class: "support-row-text" }, [
      el("div", { style: "font-weight:700" }, [
        el("a", { href: `#/plants/${p.id}`, style: "color:inherit" }, names.title),
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
      el("div", { style: "display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.35rem" }, tieTags(s.link)),
      el("div", { style: "font-size:0.85rem;color:var(--ink-soft);margin-top:0.3rem" }, supportNote(p.latin, s.link, s.region.meta.id)),
      // Every relationship shows its source, with authority names linked out.
      el("div", { style: "font-size:0.75rem;color:var(--ink-soft);opacity:0.85;margin-top:0.2rem" }, [
        el("span", { "aria-hidden": "true" }, "🔎 "),
        t("card.source"),
        ...citation(s.link.basis),
      ]),
    ]),
  ]);
}

// A deep link to the animal's own record where a stable scheme exists (BAMONA
// for insects, All About Birds for single birds). Null for groups/multi-species.
function speciesLink(w: Parameters<typeof speciesRecordUrl>[0]): HTMLElement | null {
  const rec = speciesRecordUrl(w);
  if (!rec) return null;
  return el("p", { style: "margin:0.3rem 0 0;font-size:0.9rem" }, [
    el("span", { "aria-hidden": "true" }, "🔗 "),
    t("wildlife.speciesRecord"),
    el("a", { href: rec.url, target: "_blank", rel: "noopener", class: "src-link" }, `${rec.name} →`),
  ]);
}

// The tie as one-word, tap-to-explain chips with monochrome glyphs: the role
// ("Host", "Nectar") always, then a strength chip only when it's notable —
// "Essential" (make-or-break) or "Specialist". A generalist tie shows no
// strength chip, so an unmarked plant reads as "one of many" without clutter.
// Each chip carries its own pill color (see the `.tag-*` rules).
function tieTags(link: SupportLink): HTMLElement[] {
  const kind = link.support;
  const role = { ...supportLabel(kind), glyph: () => supportIcon(kind) };
  const tags = [termTag(role, kind)];
  const r = relianceOf(link);
  if (r !== "broad") {
    const strength = { ...relianceLabel(r), glyph: () => relianceIcon(r) as SVGElement };
    tags.push(termTag(strength, r));
  }
  return tags;
}

/** A `#/wildlife/in/<something>` that isn't a region we cover. */
function renderUnknownRegion(main: HTMLElement, id: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("wildlife.noSuchRegionTitle")),
    el("p", { class: "step-lede" }, t("wildlife.noSuchRegionLede", { id })),
    regionFilter({}, mappedWildlifeCount()),
    el("div", { class: "btn-row" }, [
      el("a", { class: "btn btn-primary", href: "#/wildlife" }, t("wildlife.allWildlifePlain")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("wildlife.browsePlantsShort")),
    ]),
  );
}

function renderNotFound(main: HTMLElement, id: string): void {
  main.append(
    el("h2", { class: "step-title" }, t("wildlife.notFoundTitle")),
    el("p", { class: "step-lede" }, t("wildlife.notFoundLede", { id })),
    el("div", { class: "btn-row" }, [
      el("button", { class: "btn btn-primary", onClick: () => navigate("wildlife") }, t("wildlife.notFoundBrowse")),
      el("button", { class: "btn btn-secondary", onClick: () => navigate("plants") }, t("wildlife.browsePlantsShort")),
    ]),
  );
}
