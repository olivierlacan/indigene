// "Seldom recorded around here" — one line under the sightings, saying whether
// this plant is still ordinary in the neighbourhood or nearly gone from it.
//
// It rides along with the sightings lookup rather than asking for anything of
// its own: the reader has already given a spot to see photos from near them, and
// the counts are taken in the same circle (see `lib/rarity.ts` for the two
// requests and how the reading is calibrated).
//
// Two rules about the words. The verdict never appears without the number it
// came from, so a reader who knows their patch can overrule us. And the caveat
// is not fine print to be dropped when space is tight: a record counts somebody
// noticing a plant, which is a different thing from the plant being there.
import { el } from "../ui";
import { rarityNear, type Rarity } from "../lib/rarity";
import { t, fmtNumber } from "../lib/i18n";
import { distance } from "../lib/units";

/** The verdict, the count it rests on, and what a count can't tell you. */
export function rarityLine(r: Rarity): HTMLElement {
  const key = `rarity.${r.level}` as const;
  const where = distance(r.radiusKm);
  return el("div", { class: `note rarity-note rarity-${r.level}` }, [
    el("p", { class: "rarity-verdict" }, t(key, { count: fmtNumber(r.count), radius: where })),
    el("p", { class: "rarity-caveat" }, t("rarity.caveat")),
  ]);
}

/**
 * Fill an element with that line once iNaturalist answers.
 *
 * Silent on failure, on purpose: this is a helpful aside on a page that already
 * did its job, and "we couldn't work out how common it is" is a sentence nobody
 * needs. The sightings above it report their own network trouble.
 */
export function mountRarity(
  host: HTMLElement,
  inatId: string,
  lat: number,
  lon: number,
  radiusKm: number
): void {
  void rarityNear(inatId, lat, lon, radiusKm)
    .then((r) => host.append(rarityLine(r)))
    .catch(() => {});
}
