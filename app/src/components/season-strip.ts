// The year as four cells, with a window lit up and today's season ringed —
// drawn beside a propagation technique (`#/planting`) and beside an invasive's
// removal steps, so "when to sow" and "when to pull" read the same way.
//
// Decorative on purpose: `aria-hidden`, because the words beside it always say
// the same thing, and a screen reader reading "Spring Summer Autumn Winter"
// with no way to convey which are shaded would be noise, not the answer.
import { el } from "../ui";
import { readerHemisphere } from "../state";
import { currentSeason, SEASONS } from "../lib/planting";
import type { Season } from "../lib/planting";
import { t } from "../lib/i18n";

export function seasonStrip(seasons: readonly Season[], anyTime = false): HTMLElement {
  const now = currentSeason(readerHemisphere());
  return el("ol", { class: "season-strip", "aria-hidden": "true" },
    SEASONS.map((s) => {
      const on = anyTime || seasons.includes(s);
      return el("li", {
        class: `season-cell${on ? " is-on" : ""}${s === now ? " is-now" : ""}`,
      }, t(`planting.season.${s}` as const));
    })
  );
}
