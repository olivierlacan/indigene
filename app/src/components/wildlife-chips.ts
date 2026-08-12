// The named animals a set of plants brings in, as a wrapping row of chips —
// each one a link to that creature's page, where every other native that
// supports it is listed.
//
// Shared by the plant profile ("wildlife it brings in") and a saved spot's page
// ("what's already here can feed these"), because both are answering the same
// question — *who actually turns up?* — and an answer that looks different in
// two places reads as two different claims.
//
// A star marks a plant the animal can't live without. The small glyph after the
// name says how the plant helps: raising its young, feeding an adult, berries,
// seed, cover.
import type { TieSummary } from "../lib/wildlife";
import { el } from "../ui";
import { supportIcon } from "./support-icon";
import { supportLabel } from "../lib/plain";
import { commonName } from "../lib/names";
import { t } from "../lib/i18n";

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
