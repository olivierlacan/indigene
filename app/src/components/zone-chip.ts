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
import type { EcoregionInfo } from "../types";

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

/**
 * The same capsule for one spot's own figures — its hardiness zone ("USDA 8b")
 * or its ecoregion ("EPA 2") — linking to the guide that explains both scales
 * and where each number comes from. Quiet on purpose: the plain words around
 * it carry the meaning; the code is for whoever wants to look it up.
 */
export function scaleChip(scale: string, value: string, label: string, href: string): HTMLElement {
  return el("a", { class: "zone-chip zone-chip-link", href, title: label, "aria-label": label }, [
    el("span", { class: "zone-chip-k" }, scale),
    value,
  ]);
}

const SCALE_NAME: Record<EcoregionInfo["provider"], string> = {
  "epa-omernik": "EPA",
  "cec-na": "CEC",
  "eea-biogeo": "EEA",
  "resolve-2017": "RESOLVE",
};

/** "EPA 2", or for Europe's named (not numbered) regions, "EEA Atlantic". */
export function ecoregionChip(info: EcoregionInfo, href: string): HTMLElement {
  const scale = SCALE_NAME[info.provider];
  const value = info.provider === "eea-biogeo" ? info.name : info.code;
  return scaleChip(scale, value, t("zoneChip.ecoregion", { scale, code: info.code, name: info.name }), href);
}
