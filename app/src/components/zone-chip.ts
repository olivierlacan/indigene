// The USDA hardiness range as a small chip, shown beside the place a region's
// numbers are tuned to.
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

export function zoneChip(meta: RegionMeta): HTMLElement {
  const approx = meta.zones.startsWith("≈");
  const range = approx ? meta.zones.slice(1) : meta.zones;
  const label = approx
    ? `Roughly USDA hardiness zones ${range} — the American scale is a translation here, not the local convention, so treat it as a guide to winter cold.`
    : `USDA hardiness zones ${range} — the winter cold this region's plant list is tuned to.`;
  return el("span", { class: "zone-chip", title: label, role: "img", "aria-label": label }, [
    el("span", { class: "zone-chip-k" }, "USDA"),
    meta.zones,
  ]);
}

/** "Pennsylvania │ USDA 6b–7a" — the place, then the badge. */
export function regionRefLine(meta: RegionMeta, className: string): HTMLElement {
  return el("p", { class: className }, [
    el("span", { class: "zone-place" }, meta.reference),
    zoneChip(meta),
  ]);
}
