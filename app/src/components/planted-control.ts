// "I planted one" — the way from a plant's page into a spot's planting log.
//
// The log lives on the spot's own page (`steps/spot.ts`), and that is the right
// home for it: it's a record of one piece of ground. But the moment somebody
// wants to write an entry is the moment they're looking at the plant — fresh
// from the nursery, phone in one hand. So the button lives here and hands over,
// carrying the plant with it as `?add=<slug>`, and the spot page opens with the
// plant already chosen and only the date left to answer.
//
// It appears only for someone who has saved a spot. A person with no spots has
// nowhere to log anything yet, and the section this sits in is already the one
// that offers to find them one — a second button saying the same thing in
// different words would be noise.
import { el, clear } from "../ui";
import { listSpots } from "../db";
import type { SavedSpot } from "../types";
import { t } from "../lib/i18n";

/** The spot page, opened with this plant already picked in the add form. */
function addHref(spot: SavedSpot, plantId: string): string {
  return `#/saved/${encodeURIComponent(spot.id)}?add=${encodeURIComponent(plantId)}`;
}

/**
 * An element that fills itself in once the device's spots are read — empty
 * forever if there are none, and never a spinner: this is an offer beside the
 * page's own content, not something anybody is waiting for.
 */
export function plantedControl(plantId: string): HTMLElement {
  const host = el("div", { class: "planted-control" });

  void listSpots()
    .then((spots) => {
      if (!spots.length) return;
      // One spot is not a choice — go straight there. Several is, and the
      // choice is "which bit of ground", which only the labels can answer.
      const button = el("button", {
        class: "btn btn-secondary btn-block",
        onClick: () => {
          if (spots.length === 1) {
            location.hash = addHref(spots[0], plantId);
            return;
          }
          clear(host);
          host.append(
            el("p", { class: "planted-lede" }, t("planted.whichSpot")),
            ...spots.map((s) =>
              el("a", { class: "choice", href: addHref(s, plantId) }, [
                el("span", { class: "choice-title" }, s.label),
              ])
            )
          );
        },
      }, t("planted.button"));
      host.append(button);
    })
    .catch(() => {});

  return host;
}
