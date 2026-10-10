// A pavement pioneer's card: the plant, the abuse it takes, and — where
// there's room for it — the sentence saying where it actually does that.
//
// Two shapes, one function, because they are the same card at two depths:
//
//   - **compact** on a region's roster, where the section is a teaser and the
//     chips are the whole message ("this one takes salt and compaction");
//   - **full** on the region's own pioneers page, where the reader followed a
//     link asking *why*, and gets the note and its source.
//
// The card is NOT wrapped in an `<a>`. The pressure chips are real `<button>`s
// that open the term dialog (see `components/term-dialog.ts`), and a button
// inside a link is neither tappable as one nor valid as the other — so the
// plant's name carries the link and the rest of the card is plain.
import { el } from "../ui";
import { plantThumb } from "./plant-thumb";
import { termTag } from "./term-dialog";
import { citation } from "./citation";
import { keystoneIcon } from "./keystone-icon";
import { pressureLabel } from "../lib/plain";
import { orderedPressures } from "../lib/pioneers";
import type { PioneerPick } from "../lib/pioneers";
import { pioneerNote } from "../lib/prose";
import { nameLines } from "../lib/names";
import { t } from "../lib/i18n";

/** The chips for one row, in the vocabulary's own display order. */
export function pressureTags(pick: PioneerPick): HTMLElement[] {
  return orderedPressures(pick.entry).map((p) => termTag(pressureLabel(p), "pressure"));
}

export function pioneerCard(
  pick: PioneerPick,
  regionId: string,
  opts: { full?: boolean } = {}
): HTMLElement {
  const { plant, entry } = pick;
  const names = nameLines(plant);
  return el("article", { class: `card pioneer-card${opts.full ? " pioneer-card-full" : ""}` }, [
    el("div", { class: "pioneer-head" }, [
      plantThumb(plant.id, plant.form, { regionId, attrs: { style: "flex:0 0 auto" } }),
      el("div", { style: "min-width:0" }, [
        el("div", { class: "pioneer-name" }, [
          el("a", { href: `#/plants/${plant.id}` }, names.title),
          plant.keystone
            ? el("span", {
                title: t("explore.keystoneTitle"),
                role: "img",
                "aria-label": t("explore.keystoneLabel"),
                style: "margin-left:0.3rem;color:var(--brand)",
              }, [keystoneIcon(13)])
            : null,
        ]),
        el("div", { class: "plant-latin", style: "font-size:0.85rem" }, names.sub),
      ]),
    ]),
    el("div", { class: "pioneer-tags" }, pressureTags(pick)),
    ...(opts.full
      ? [
          el("p", { class: "pioneer-note" }, pioneerNote(plant.latin, entry.note, regionId)),
          el("p", { class: "pioneer-basis" }, [
            el("span", { class: "pioneer-basis-label" }, t("pioneers.basis")),
            " ",
            ...citation(entry.basis),
          ]),
        ]
      : []),
  ]);
}
