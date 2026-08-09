// "Seldom recorded around here" — one line saying whether this plant is still
// ordinary in the neighbourhood or nearly gone from it.
//
// It costs nothing to show. The counts behind it are taken for a spot's whole
// roster in a single request (`lib/prominence.ts`) and kept for a week, so the
// line usually appears the moment a plant page opens, out of the device, with
// no network call of its own and no photographs downloaded to get it.
//
// Three rules about the words. It names the ground it counted — the line turns
// up unasked now, and "around here" has to mean somewhere. The verdict never
// appears without the number it came from, so a reader who knows their patch
// can overrule us. And the caveat is not fine print to be dropped when space is
// tight: a record counts somebody noticing a plant, which is a different thing
// from the plant being there.
import { el } from "../ui";
import { type Rarity } from "../lib/rarity";
import { t, fmtNumber } from "../lib/i18n";
import { distance } from "../lib/units";

/**
 * The verdict, the count it rests on, and what a count can't tell you.
 *
 * `place` names the spot the circle was drawn around — a saved spot's own
 * label, or the town the reader typed. Left out, the line says "your spot",
 * which is what the app knows when the coordinates came from the flow.
 */
export function rarityLine(r: Rarity, place?: string): HTMLElement {
  const key = `rarity.${r.level}` as const;
  const where = distance(r.radiusKm);
  return el("div", { class: `note rarity-note rarity-${r.level}` }, [
    el("p", { class: "rarity-where" }, place ? t("rarity.around", { place }) : t("rarity.aroundSpot")),
    el("p", { class: "rarity-verdict" }, t(key, { count: fmtNumber(r.count), radius: where })),
    el("p", { class: "rarity-caveat" }, t("rarity.caveat")),
  ]);
}
