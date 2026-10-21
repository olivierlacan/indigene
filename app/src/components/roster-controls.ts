// A list's Sort / Group / Filter panel, with the pieces a plant list adds to
// it: the line explaining the caterpillar order and the count tag on each card.
// The Filter row carries the spot flow's own filters too (no watering, deer,
// thorns, pets, spreaders, size), so a list narrows the way the picks do.
// Shared by a region's roster (steps/region.ts), the plant catalog
// (steps/plants.ts) and the wildlife index (steps/wildlife.ts), so every list
// slices the same way and looks it.
import { el } from "../ui";
import { t, fmtNumber } from "../lib/i18n";
import type { RosterView } from "../lib/roster-sort";
import { PIONEER_ICON } from "../data/pioneers";
import { supportIcon } from "./support-icon";
import { openTermDialog } from "./term-dialog";
import { infoIcon, quietLink } from "./guide-link";
import { maxHeightChoices, maxSpreadChoices, nearestRung } from "../lib/units";
import type { TraitFilters } from "../lib/filter-traits";

/** One option of a segmented control: the view it leads to, whether it's the
 *  one showing, and its words. */
export interface Segment<V> {
  to: V;
  on: boolean;
  label: (string | Node)[];
}

/** An on/off filter: on narrows the list, off shows it all. */
export interface Toggle<V> {
  to: V;
  on: boolean;
  label: string;
}

/** A size cap: a toggle, then the threshold to pick and the word after it
 *  ("Stays under [3 m] tall"). The threshold is only live while it's on. */
export interface CapToggle<V> extends Toggle<V> {
  aria: string;
  tail: string;
  options: { to: V; label: string; selected: boolean }[];
}

/** One row of the panel: a segmented control (one option always on), or a
 *  stack of checkbox-style toggles, with whatever follows them (a link). */
export type PanelRow<V> =
  | { label: string; segments: Segment<V>[] }
  | { label: string; toggle: Toggle<V> }
  | { label: string; toggles: (Toggle<V> | CapToggle<V>)[]; after?: Node };

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
  const toggle = (tg: Toggle<V>): HTMLElement =>
    link(tg.to, { class: "filter-toggle", role: "switch", "aria-checked": String(tg.on) }, [
      el("span", { class: "filter-box", "aria-hidden": "true" }, tg.on ? "✓" : ""),
      tg.label,
    ]);
  // A cap's threshold is a select, not links: seven rungs of links would be a
  // second list. Picking one goes where its link would have.
  const cap = (c: CapToggle<V>): HTMLElement => {
    const select = el("select", {
      class: "filter-cap",
      "aria-label": c.aria,
      disabled: !c.on,
      onChange: () => {
        const to = c.options[select.selectedIndex].to;
        if (onPick) onPick(to);
        else location.href = href(to);
      },
    }, c.options.map((o) => el("option", { selected: o.selected }, o.label))) as HTMLSelectElement;
    return el("span", { class: "filter-cap-row" }, [toggle(c), select, c.tail]);
  };
  return el("nav", { "aria-label": t("region.viewNav"), class: "roster-controls" }, rows.map((r) =>
    "toggles" in r
      ? el("div", { class: "roster-control roster-control-stack" }, [
          el("span", { class: "roster-control-label" }, r.label),
          ...r.toggles.map((tg) => ("options" in tg ? cap(tg) : toggle(tg))),
          r.after ?? null,
        ])
      : el("div", { class: "roster-control" }, [
          el("span", { class: "roster-control-label" }, r.label),
          "segments" in r
            ? el("div", { class: "segmented" }, r.segments.map((sg) =>
                link(sg.to, { class: "segment", "aria-current": sg.on ? "page" : undefined }, sg.label)))
            : toggle(r.toggle),
        ])));
}

/** A plant list's panel: A–Z or most caterpillars, grouped by plant type or
 *  not, and the Filter row — the spot flow's filters, then the pioneers when
 *  the list has any. */
export function rosterControls(
  view: RosterView,
  href: (to: RosterView) => string,
  pioneers: number,
  onPick?: (to: RosterView) => void,
): HTMLElement {
  const f = view.filters;
  const withF = (patch: Partial<TraitFilters>): RosterView => ({ ...view, filters: { ...f, ...patch } });
  const flag = (key: "requireNoWater" | "requireDeerResistant" | "excludeThorny" | "excludePetToxic" | "excludeAggressive",
    label: string): Toggle<RosterView> => ({ to: withF({ [key]: !f[key] }), on: f[key], label });
  // Off, a cap switches on at the ladder's second rung, as the spot flow does;
  // on, the select shows the rung nearest the address's value.
  const capOf = (key: "maxHeightFt" | "maxSpreadFt", choices: { ft: number; label: string }[],
    icon: string, tail: string, aria: string): CapToggle<RosterView> => {
    const at = f[key] == null ? choices[1].ft : nearestRung(choices, f[key]!);
    return {
      to: withF({ [key]: f[key] == null ? at : null }),
      on: f[key] != null,
      label: `${icon} ${t("filter.size.lead")}`,
      tail,
      aria,
      options: choices.map((c) => ({ to: withF({ [key]: c.ft }), label: c.label, selected: c.ft === at })),
    };
  };
  const filters: (Toggle<RosterView> | CapToggle<RosterView>)[] = [
    flag("requireNoWater", t("filter.noWater")),
    flag("requireDeerResistant", t("filter.deer")),
    flag("excludeThorny", t("filter.thorns")),
    flag("excludePetToxic", t("filter.petSafe")),
    flag("excludeAggressive", t("filter.aggressive")),
    capOf("maxHeightFt", maxHeightChoices(), "📏", t("filter.height.tail"), t("filter.height.aria")),
    capOf("maxSpreadFt", maxSpreadChoices(), "↔️", t("filter.spread.tail"), t("filter.spread.aria")),
  ];
  if (pioneers) {
    filters.push({
      to: { ...view, pioneers: !view.pioneers },
      on: view.pioneers,
      label: `${PIONEER_ICON} ${t("region.pioneersOnly", { n: fmtNumber(pioneers) })}`,
    });
  }
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
    { label: t("region.filterLabel"), toggles: filters,
      after: quietLink("info", "#/traits", t("results.filtersMeaning"), "margin:0.3rem 0 0.1rem") },
  ];
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
