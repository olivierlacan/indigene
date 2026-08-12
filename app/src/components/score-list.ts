// The seven ecosystem benefits as a folding list of bars — one row per benefit,
// each with its fixed icon, its value, and a plain-words gloss folded away until
// asked for.
//
// Shared by the two pages that show the same seven numbers about different
// things: one plant (its own scores) and one saved spot (the average across
// what's planted there). Extracted so a benefit is drawn, named and glossed in
// exactly one place — the icons and the words already live once, in `plain.ts`,
// and the markup should too.
//
// All seven glosses open at once made the tallest card on a plant's page: seven
// headings, seven bars and roughly twenty lines of explanation, so the numbers —
// the part you came for — had to be hunted out of a wall of prose. Folded, it's
// a scannable table of seven rows, and the sentence is one hover or one tap
// away.
//
// Three ways in, because a screen is one of three things:
//   - a pointer: hovering a row opens its gloss, no click needed (CSS only);
//   - a finger: the row is a real button, and a tap opens it — the chevron is
//     drawn at rest so there is something to aim at;
//   - a keyboard: focus opens it, and Enter latches it open.
import { el } from "../ui";
import { scoreLabel, type ScoreKey } from "../lib/plain";
import { fmtNumber } from "../lib/i18n";

export interface ScoreRow {
  key: ScoreKey;
  /** 0–100. */
  value: number;
  /** Appended after the value — the host row's species count, for instance. */
  sub?: string;
}

/**
 * @param idBase Prefix for each row's gloss id, so two lists on one page can't
 *   claim the same `aria-controls` target.
 * @param expanded Start with every gloss open — what a link straight to this
 *   card means, since asking for the ecosystem section is asking for the detail
 *   in it.
 */
export function scoreList(rows: ScoreRow[], idBase: string, expanded = false): HTMLElement {
  return el(
    "ul",
    { class: "score-list score-list-folding" },
    rows.map((row) => {
      const label = scoreLabel(row.key);
      const whyId = `${idBase}-why-${row.key}`;
      const toggle = el("button", {
        type: "button",
        class: "score-toggle",
        "aria-expanded": expanded ? "true" : "false",
        "aria-controls": whyId,
        onClick: () => {
          const open = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-expanded", open ? "false" : "true");
        },
      }, [
        el("div", { class: "score-head" }, [
          el("span", { class: "score-name" }, [
            el("span", { "aria-hidden": "true" }, `${label.icon} `),
            label.name,
          ]),
          el("span", { class: "score-value" }, `${fmtNumber(row.value)}${row.sub ? ` · ${row.sub}` : ""}`),
          el("span", { class: "score-chevron", "aria-hidden": "true" }, "›"),
        ]),
        el("div", { class: "score-bar" }, [el("span", { style: `width:${row.value}%` })]),
      ]);
      return el("li", { class: "score-item" }, [
        toggle,
        el("div", { class: "score-why", id: whyId }, [el("p", { class: "score-why-text" }, label.plain)]),
      ]);
    })
  );
}
