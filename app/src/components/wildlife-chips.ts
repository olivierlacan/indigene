// The named animals a set of plants brings in — as a row of chips, or (when
// there are enough of them to be a wall) folded into the browse index's own
// groups.
//
// Shared by the plant profile ("wildlife it brings in") and a saved spot's page
// ("what it can feed"), because both are answering the same question — *who
// actually turns up?* — and an answer that looks different in two places reads
// as two different claims.
//
// A star marks a plant the animal can't live without. The small glyph after the
// name says how the plant helps: raising its young, feeding an adult, berries,
// seed, cover.
import type { Wildlife, WildlifeKind } from "../types";
import type { TieSummary, WildlifeIndexRow } from "../lib/wildlife";
import { el } from "../ui";
import { supportIcon } from "./support-icon";
import { supportLabel, wildlifeKindShort, WILDLIFE_KINDS } from "../lib/plain";
import { commonName } from "../lib/names";
import { t, fmtNumber } from "../lib/i18n";
import { wildlifeIcon } from "./wildlife-thumb";
import { glyphKeyFor } from "./wildlife-glyphs";

/** One chip. Exported for the pages that need to lay them out themselves. */
export function wildlifeChip(tie: TieSummary): HTMLElement {
  const name = commonName(tie.wildlife);
  const support = supportLabel(tie.support);
  return el("a", {
    href: `#/wildlife/${tie.wildlife.id}`,
    class: "btn btn-secondary wl-chip",
    title: tie.sole ? t("plant.soleTie", { name }) : `${support.term} — ${support.plain}`,
  }, [
    tie.sole ? el("span", { "aria-hidden": "true" }, "⭐ ") : null,
    wildlifeIcon(glyphKeyFor(tie.wildlife.kind, tie.wildlife.inat?.iconic), 15),
    " ",
    name,
    el("span", { "aria-hidden": "true", class: "wl-chip-tie" }, [supportIcon(tie.support, 13)]),
  ]);
}

export function wildlifeChips(ties: TieSummary[]): HTMLElement {
  return el("div", { class: "wl-chips" }, ties.map(wildlifeChip));
}

/**
 * The same animals, folded into the five groups the wildlife index browses by
 * — butterflies, moths, bees, birds, mammals.
 *
 * A garden of a dozen kinds can document forty animals, and forty chips one
 * under another is a wall to scroll past rather than a picture of anything.
 * Five short pills fit two or three to a line, say how many of each at a
 * glance, and hold the names behind a tap for whoever wants them.
 *
 * One group open at a time, on purpose: opening a second is nearly always
 * "…and what's in that one", not "show me both", and an accordion keeps the
 * card the same height whichever pill you press.
 *
 * @param idBase Prefix for each panel's id, so two of these on one page can't
 *   claim the same `aria-controls` target.
 */
export function wildlifeGroups(ties: TieSummary[], idBase: string): HTMLElement {
  return kindGroups(ties.map((tie) => ({ wildlife: tie.wildlife, chip: wildlifeChip(tie) })), idBase);
}

/**
 * The same five pills for a whole *region* rather than for a set of plants: the
 * animals a region's roster feeds, on the region's own page.
 *
 * The chip carries a count instead of a support glyph, because "how the plant
 * helps" is a fact about one tie and this is forty of them — what a region can
 * say is *how many of its plants* each animal has to turn to.
 */
export function wildlifeRegionGroups(rows: WildlifeIndexRow[], idBase: string): HTMLElement {
  return kindGroups(
    rows.map((row) => ({
      wildlife: row.wildlife,
      chip: el("a", {
        href: `#/wildlife/${row.wildlife.id}`,
        class: "btn btn-secondary wl-chip",
        title: t("region.wildlifePlants", {
          n: fmtNumber(row.plantCount),
          name: commonName(row.wildlife),
        }),
      }, [
        wildlifeIcon(glyphKeyFor(row.wildlife.kind, row.wildlife.inat?.iconic), 15),
        " ",
        commonName(row.wildlife),
        el("span", { "aria-hidden": "true", class: "wl-chip-tie" }, fmtNumber(row.plantCount)),
      ]),
    })),
    idBase
  );
}

/** The accordion both of the above are: five pills, one open at a time, the
 *  chips behind them. Written once so a group of animals reads the same
 *  wherever it's counted from. */
function kindGroups(items: Array<{ wildlife: Wildlife; chip: HTMLElement }>, idBase: string): HTMLElement {
  const byKind = new Map<WildlifeKind, HTMLElement[]>();
  for (const item of items) {
    const list = byKind.get(item.wildlife.kind);
    if (list) list.push(item.chip);
    else byKind.set(item.wildlife.kind, [item.chip]);
  }

  const pills = el("div", { class: "wl-groups" });
  const panels = el("div", {});
  const open = new Map<WildlifeKind, () => void>();

  // In the index's own order, so a reader who browsed wildlife first meets the
  // groups in the sequence they already know.
  for (const kind of WILDLIFE_KINDS) {
    const group = byKind.get(kind);
    if (!group) continue;
    const panelId = `${idBase}-${kind}`;
    const panel = el("div", { class: "wl-group-panel", id: panelId, hidden: true }, [
      el("div", { class: "wl-chips" }, group),
    ]);
    const pill = el("button", {
      type: "button",
      class: "wl-group",
      "aria-expanded": "false",
      "aria-controls": panelId,
      onClick: () => {
        const wasOpen = pill.getAttribute("aria-expanded") === "true";
        for (const close of open.values()) close();
        if (!wasOpen) {
          pill.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      },
    }, [
      el("span", { class: "wl-group-icon", "aria-hidden": "true" }, [wildlifeIcon(kind, 18)]),
      el("span", { class: "wl-group-name" }, wildlifeKindShort(kind).title),
      el("span", { class: "wl-group-count" }, fmtNumber(group.length)),
    ]);
    open.set(kind, () => {
      pill.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    });
    pills.append(pill);
    panels.append(panel);
  }

  return el("div", {}, [pills, panels]);
}
