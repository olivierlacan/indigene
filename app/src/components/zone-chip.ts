// The USDA hardiness range as a small chip, shown beside the place a region's
// numbers are tuned to — on the pages where the zone is the answer to
// something. Not on Explore: a grid of region cards is a "where are you?"
// question, and a column of hardiness badges beside it answered a question
// nobody had asked yet.
//
// It used to ride inside the reference string as a parenthetical —
// "Pennsylvania (USDA zones 6b–7a)" — which made the line longer, buried the
// one part of it that is a standard, scannable value, and read as an aside.
// Split out, the place is a place and the zone is a badge, the way every seed
// packet and nursery tag already presents it.
//
// European regions carry a "≈" in `zones`, because USDA zones are a
// translation there rather than the local convention; the tooltip says so
// rather than leaving the squiggle to be guessed at.
import type { RegionMeta } from "../data/region";
import { el } from "../ui";
import { t } from "../lib/i18n";
import { regionReference } from "../lib/names";

export function zoneChip(meta: RegionMeta): HTMLElement {
  const approx = meta.zones.startsWith("≈");
  const range = approx ? meta.zones.slice(1) : meta.zones;
  const label = approx
    ? t("zoneChip.approx", { range })
    : t("zoneChip.exact", { range });
  return el("span", { class: "zone-chip", title: label, role: "img", "aria-label": label }, [
    // "USDA" is the name of the scale, not a word — it stays put in every
    // language, the way "°C" does.
    el("span", { class: "zone-chip-k" }, "USDA"),
    meta.zones,
  ]);
}

/** "Pennsylvania │ USDA 6b–7a" — the place, then the badge. */
export function regionRefLine(meta: RegionMeta, className: string): HTMLElement {
  return el("p", { class: className }, [
    el("span", { class: "zone-place" }, regionReference(meta)),
    zoneChip(meta),
  ]);
}
