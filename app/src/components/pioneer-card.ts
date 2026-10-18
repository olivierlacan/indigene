// A pavement pioneer's card: the plant, the abuse it takes, and — where
// there's room for it — the sentence saying where it actually does that.
//
// Two shapes, one function, because they are the same card at two depths:
//
//   - **compact** on a region's roster, where the section is a teaser and the
//     chips are the whole message ("this one takes salt and compaction");
//   - **full** on the region's own pioneers page, where the reader followed a
//     link asking *why*, and gets the note. Its source is on the plant's page.
//
// The card is NOT wrapped in an `<a>`. The pressure chips are real `<button>`s
// that open the term dialog (see `components/term-dialog.ts`), and a button
// inside a link is neither tappable as one nor valid as the other — so the
// plant's name carries the link and the rest of the card is plain.
import { el } from "../ui";
import { plantThumb } from "./plant-thumb";
import { termTag } from "./term-dialog";
import { keystoneIcon } from "./keystone-icon";
import { pressureLabel } from "../lib/plain";
import { pressureIcon } from "./pressure-icon";
import type { PioneerEntry, PioneerPressure } from "../types";
import { orderedPressures } from "../lib/pioneers";
import type { PioneerPick } from "../lib/pioneers";
import { pioneerNote } from "../lib/prose";
import { nameLines } from "../lib/names";
import { t } from "../lib/i18n";

/** A pressure's words with its drawn glyph (`pressure-icon.ts`) — the glyph
 *  wins over the emoji wherever a chip or its dialog draws one. */
const pressureInfo = (p: PioneerPressure) => ({ ...pressureLabel(p), glyph: () => pressureIcon(p) });

/** The chips for one row, in the vocabulary's own display order, each word
 *  spelled out — the plant's own page. */
export function pressureTags(pick: PioneerPick): HTMLElement[] {
  return orderedPressures(pick.entry).map((p) => termTag(pressureInfo(p), "pressure"));
}

/**
 * The same chips as a card's footer, for a list: a hairline, "Copes with",
 * then the glyphs bare — the words are a hover away, and a tap opens the
 * explanation. `interactive: false` draws them as labelled pictures instead,
 * for a card that is itself a link (a button can't live inside one). Only the
 * pressures are read, so the catalog can pass a plant's across every region.
 */
export function pressureFooter(pick: { entry: Pick<PioneerEntry, "pressures"> }, opts: { interactive?: boolean } = {}): HTMLElement {
  const interactive = opts.interactive ?? true;
  const glyphs = orderedPressures(pick.entry).map((p) => {
    const info = pressureInfo(p);
    return interactive
      ? termTag(info, "bare", { iconOnly: true })
      : el("span", { class: "pressure-glyph", role: "img", "aria-label": info.term, title: info.term }, [info.glyph()]);
  });
  return el("div", { class: "pressure-footer" }, [
    el("span", { class: "pressure-footer-label" }, t("pioneers.copesWith")),
    el("span", { class: "pressure-footer-glyphs" }, glyphs),
  ]);
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
          // A word joiner keeps the star from wrapping onto a line alone.
          plant.keystone ? "\u2060" : null,
          plant.keystone
            ? el("span", {
                title: t("explore.keystoneTitle"),
                role: "img",
                "aria-label": t("explore.keystoneLabel"),
                class: "name-mark",
              }, [keystoneIcon(13)])
            : null,
        ]),
        el("div", { class: "plant-latin", style: "font-size:0.85rem" }, names.sub),
      ]),
    ]),
    ...(opts.full
      ? [
          // The note, not its source: the source sits under the same note on
          // the plant's page, one tap away — printed on every card it was the
          // same three floras eight times over.
          el("p", { class: "pioneer-note" }, pioneerNote(plant.latin, entry.note, regionId)),
        ]
      : []),
    pressureFooter(pick),
  ]);
}
