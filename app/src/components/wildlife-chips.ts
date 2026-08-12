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
import type { WildlifeKind } from "../types";
import type { TieSummary } from "../lib/wildlife";
import { el } from "../ui";
import { supportIcon } from "./support-icon";
import { supportLabel, wildlifeKindShort, WILDLIFE_KINDS } from "../lib/plain";
import { commonName } from "../lib/names";
import { t, fmtNumber } from "../lib/i18n";

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
    el("span", { "aria-hidden": "true" }, `${tie.wildlife.icon} `),
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
  const byKind = new Map<WildlifeKind, TieSummary[]>();
  for (const tie of ties) {
    const list = byKind.get(tie.wildlife.kind);
    if (list) list.push(tie);
    else byKind.set(tie.wildlife.kind, [tie]);
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
      wildlifeChips(group),
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
      el("span", { class: "wl-group-icon", "aria-hidden": "true" }, wildlifeKindShort(kind).icon),
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
