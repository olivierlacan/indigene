// A plant list's Sort / Group / Filter panel, with the pieces that go with it:
// the line explaining the caterpillar order and the count tag on each card.
// Shared by a region's roster (steps/region.ts) and the catalog
// (steps/plants.ts), so the two lists slice the same way and look it.
import { el } from "../ui";
import { t, fmtNumber } from "../lib/i18n";
import type { RosterView } from "../lib/roster-sort";
import { PIONEER_ICON } from "../data/pioneers";
import { supportIcon } from "./support-icon";
import { openTermDialog } from "./term-dialog";
import { infoIcon } from "./guide-link";

/**
 * Three ways to slice the list, one row each, each drawn as what it is so they
 * can't be mistaken for one another —
 *
 *   - **Sort** and **Group** are segmented: one of their options is always on,
 *     and picking another moves the highlight.
 *   - **Filter** is a checkbox-style toggle: on narrows the list, off shows it
 *     all, and its box says which. Absent when there are no pioneers.
 *
 * Links rather than buttons, so every view has an address to share. `onPick`,
 * when given, takes the click instead of following the link — for a page that
 * redraws in place rather than routing.
 */
export function rosterControls(
  view: RosterView,
  href: (to: RosterView) => string,
  pioneers: number,
  onPick?: (to: RosterView) => void,
): HTMLElement {
  const link = (to: RosterView, attrs: Record<string, string | undefined>, label: (string | Node)[]): HTMLElement =>
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
  const segment = (to: RosterView, on: boolean, label: (string | Node)[]): HTMLElement =>
    link(to, { class: "segment", "aria-current": on ? "page" : undefined }, label);
  const row = (word: string, control: HTMLElement): HTMLElement =>
    el("div", { class: "roster-control" }, [el("span", { class: "roster-control-label" }, word), control]);
  const rows = [
    row(t("region.sortLabel"), el("div", { class: "segmented" }, [
      segment({ ...view, sort: "name" }, view.sort === "name", [t("region.sortName")]),
      segment({ ...view, sort: "caterpillars" }, view.sort === "caterpillars",
        [supportIcon("host", 15), t("region.sortCaterpillars")]),
    ])),
    row(t("region.groupLabel"), el("div", { class: "segmented" }, [
      segment({ ...view, grouped: false }, !view.grouped, [t("region.groupNone")]),
      segment({ ...view, grouped: true }, view.grouped, [t("region.groupByKind")]),
    ])),
  ];
  if (pioneers) {
    rows.push(row(t("region.filterLabel"),
      link({ ...view, pioneers: !view.pioneers }, {
        class: "filter-toggle",
        role: "switch",
        "aria-checked": String(view.pioneers),
      }, [
        el("span", { class: "filter-box", "aria-hidden": "true" }, view.pioneers ? "✓" : ""),
        `${PIONEER_ICON} ${t("region.pioneersOnly", { n: fmtNumber(pioneers) })}`,
      ])));
  }
  return el("nav", { "aria-label": t("region.viewNav"), class: "roster-controls" }, rows);
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
