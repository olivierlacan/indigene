// A list's Sort / Group / Filter panel, with the pieces a plant list adds to
// it: the line explaining the caterpillar order and the count tag on each card.
// Shared by a region's roster (steps/region.ts), the plant catalog
// (steps/plants.ts) and the wildlife index (steps/wildlife.ts), so every list
// slices the same way and looks it.
import { el } from "../ui";
import { t, fmtNumber } from "../lib/i18n";
import type { RosterView } from "../lib/roster-sort";
import { PIONEER_ICON } from "../data/pioneers";
import { supportIcon } from "./support-icon";
import { openTermDialog } from "./term-dialog";
import { infoIcon } from "./guide-link";

/** One option of a segmented control: the view it leads to, whether it's the
 *  one showing, and its words. */
export interface Segment<V> {
  to: V;
  on: boolean;
  label: (string | Node)[];
}

/** One row of the panel: a segmented control (one option always on), or a
 *  checkbox-style toggle (on narrows the list, off shows it all). */
export type PanelRow<V> =
  | { label: string; segments: Segment<V>[] }
  | { label: string; toggle: { to: V; on: boolean; label: string } };

/**
 * A list's view panel: one quiet box, a row per control, each drawn as what it
 * is so Sort, Group and Filter can't be mistaken for one another.
 *
 * Links rather than buttons, so every view has an address to share. `onPick`,
 * when given, takes the click instead of following the link — for a page that
 * redraws in place rather than routing.
 */
export function viewPanel<V>(
  rows: PanelRow<V>[],
  href: (to: V) => string,
  onPick?: (to: V) => void,
): HTMLElement {
  const link = (to: V, attrs: Record<string, string | undefined>, label: (string | Node)[]): HTMLElement =>
    el("a", {
      ...attrs,
      href: href(to),
      onClick: onPick
        ? (ev: Event) => {
            const e = ev as MouseEvent;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            onPick(to);
          }
        : undefined,
    }, label);
  return el("nav", { "aria-label": t("region.viewNav"), class: "roster-controls" }, rows.map((r) =>
    el("div", { class: "roster-control" }, [
      el("span", { class: "roster-control-label" }, r.label),
      "segments" in r
        ? el("div", { class: "segmented" }, r.segments.map((sg) =>
            link(sg.to, { class: "segment", "aria-current": sg.on ? "page" : undefined }, sg.label)))
        : link(r.toggle.to, { class: "filter-toggle", role: "switch", "aria-checked": String(r.toggle.on) }, [
            el("span", { class: "filter-box", "aria-hidden": "true" }, r.toggle.on ? "✓" : ""),
            r.toggle.label,
          ]),
    ])));
}

/** A plant list's panel: A–Z or most caterpillars, grouped by plant type or
 *  not, and the pioneers only (no Filter row when there are none). */
export function rosterControls(
  view: RosterView,
  href: (to: RosterView) => string,
  pioneers: number,
  onPick?: (to: RosterView) => void,
): HTMLElement {
  const rows: PanelRow<RosterView>[] = [
    { label: t("region.sortLabel"), segments: [
      { to: { ...view, sort: "name" }, on: view.sort === "name", label: [t("region.sortName")] },
      { to: { ...view, sort: "caterpillars" }, on: view.sort === "caterpillars",
        label: [supportIcon("host", 15), t("region.sortCaterpillars")] },
    ] },
    { label: t("region.groupLabel"), segments: [
      { to: { ...view, grouped: false }, on: !view.grouped, label: [t("region.groupNone")] },
      { to: { ...view, grouped: true }, on: view.grouped, label: [t("region.groupByKind")] },
    ] },
  ];
  if (pioneers) {
    rows.push({ label: t("region.filterLabel"), toggle: {
      to: { ...view, pioneers: !view.pioneers },
      on: view.pioneers,
      label: `${PIONEER_ICON} ${t("region.pioneersOnly", { n: fmtNumber(pioneers) })}`,
    } });
  }
  return viewPanel(rows, href, onPick);
}

/** What the caterpillar order means, said once above the list rather than on
 *  every row. */
export function caterpillarLede(): HTMLElement {
  return el("p", { class: "obs-section-lede" }, [t("region.sortCaterpillarsLede"), " ", caterpillarWhy()]);
}

/**
 * "Most caterpillars" reads as a warning to anyone who has had a cabbage eaten:
 * the ⓘ answers that in place, with its two sources. Herbivory, not a
 * partnership — the claim is only that a native rarely loses much, and that
 * what it loses feeds the birds.
 */
function caterpillarWhy(): HTMLElement {
  const source = (href: string, label: string): HTMLElement =>
    el("a", { href, target: "_blank", rel: "noopener" }, label);
  return el("button", {
    type: "button",
    class: "inline-why",
    "aria-haspopup": "dialog",
    onClick: () => openTermDialog({
      icon: "",
      glyph: () => supportIcon("host", 18),
      term: t("region.caterpillarWhyTitle"),
      plain: t("region.caterpillarWhy"),
      extra: [el("p", { class: "pioneer-basis", style: "margin:0 0 0.9rem" }, [
        el("span", { class: "pioneer-basis-label" }, t("pioneers.basis")),
        " ",
        source("https://pmc.ncbi.nlm.nih.gov/articles/PMC4071545/", "Turcotte et al. 2014, Proc. R. Soc. B"),
        "; ",
        source("https://www.northcoastjournal.com/life-outdoors/gardening-for-caterpillars-25446452/", "Douglas Tallamy"),
        ".",
      ])],
    }),
  }, [infoIcon(), el("span", {}, t("region.caterpillarWhyTitle"))]);
}

/**
 * The figure the list is sorted by, as a tag pinned over the card's
 * bottom-right edge: out of the name's way, and lined up down the list so the
 * eye can run down the numbers. Spelled out for screen readers and on hover.
 * The card needs `position: relative`.
 */
export function countTag(n: number): HTMLElement {
  const label = t("explore.caterpillarSpecies", { n: fmtNumber(n) });
  return el("span", { class: "count-tag", role: "img", title: label, "aria-label": label },
    [supportIcon("host", 14), fmtNumber(n)]);
}
