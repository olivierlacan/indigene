// "Among the worst in: Mid-Atlantic (#4) · Atlantic France (#4) — how to remove
// it." — the line on a swap or look-alike page that says the plant is on a
// region's worst-invasives list, each region a link to that list, and the end a
// link to the plant's own invasive page, where the removal steps are. Its own file so those pages needn't import the
// region section (which imports them).
import { el } from "../ui";
import { wantedPlacesFor, wantedRegionHref } from "../lib/invasives";
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
    return [el("a", { href: wantedRegionHref(regionId) },
      t("wanted.placeLink", { n: fmtNumber(rank), region: regionShort(region.meta) }))];
  });
  return el("p", { class: "note" },
    tx("wanted.onLists", {
      places: el("span", {}, links.flatMap((a, i) => (i ? [" · ", a] : [a]))),
      remove: el("a", { href: `#/invasives/${places[0].invasiveId}` }, t("wanted.removeLink")),
    }));
}
