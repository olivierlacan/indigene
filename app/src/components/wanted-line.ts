// "Most wanted: Mid-Atlantic (#4) · Atlantic France (#4)" — the line on a swap
// or look-alike page that says the plant is on a region's most-wanted list, each
// region a link to the list. Its own file so those pages needn't import the
// region section (which imports them).
import { el } from "../ui";
import { wantedPlacesFor } from "../lib/invasives";
import { REGIONS } from "../lib/plants";
import { regionShort } from "../lib/names";
import { t, tx, fmtNumber } from "../lib/i18n";

/** The line, or null when the plant is on no list. */
export function wantedLine(latin: string): HTMLElement | null {
  const places = wantedPlacesFor(latin);
  if (!places.length) return null;
  const links = places.flatMap(({ regionId, rank }) => {
    const region = REGIONS.find((r) => r.meta.id === regionId);
    if (!region) return [];
    return [el("a", { href: `#/regions/${regionId}` },
      t("wanted.placeLink", { n: fmtNumber(rank), region: regionShort(region.meta) }))];
  });
  return el("p", { class: "note" },
    tx("wanted.onLists", { places: el("span", {}, links.flatMap((a, i) => (i ? [" · ", a] : [a]))) }));
}
