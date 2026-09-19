// The four drawn pieces on "Will native plants bring pests to my yard?"
// (`steps/crops.ts`). Everything here is HTML and CSS rather than SVG, for one
// reason: the words are translated. SVG `<text>` does not wrap, so a French
// label 40% longer than its English original runs off the edge of the drawing
// and there is nothing the layout can do about it. Laid out as boxes and chips,
// each figure reflows — and it still reads as a diagram rather than a
// paragraph, which is the whole point of putting it here.
//
// Styles live under `.crops-page` in styles.css.
import { el } from "../ui";
import { t } from "../lib/i18n";
import type { TKey } from "../locales/en";

/** The shared wrapper: the drawing, then the line that says what it shows. */
function figure(cls: string, body: Node[], caption: TKey): HTMLElement {
  return el("figure", { class: `crops-fig ${cls}` }, [
    ...body,
    el("figcaption", {}, t(caption)),
  ]);
}

/**
 * Figure 1 — what a flower border actually feeds.
 *
 * The objection treats "wildlife" as one animal. This splits it into the three
 * crowds a native planting really brings and says what each of them does when
 * it reaches your vegetable bed: two help, and the third cannot get there.
 */
export function feedsFigure(): HTMLElement {
  const row = (icon: string, who: TKey, eats: TKey, out: TKey, tone: "good" | "none") =>
    el("li", { class: `feeds-row feeds-${tone}` }, [
      el("span", { class: "feeds-icon", "aria-hidden": "true" }, icon),
      el("div", { class: "feeds-what" }, [
        el("b", {}, t(who)),
        el("p", {}, t(eats)),
      ]),
      el("span", { class: "feeds-out" }, t(out)),
    ]);

  return figure("crops-fig-feeds", [
    el("ul", { class: "feeds" }, [
      row("🐝", "crops.fig.feeds.pollWho", "crops.fig.feeds.pollEats", "crops.fig.feeds.pollOut", "good"),
      row("🐞", "crops.fig.feeds.enemyWho", "crops.fig.feeds.enemyEats", "crops.fig.feeds.enemyOut", "good"),
      row("🐛", "crops.fig.feeds.leafWho", "crops.fig.feeds.leafEats", "crops.fig.feeds.leafOut", "none"),
    ]),
  ], "crops.fig.feeds.caption");
}

/**
 * Figure 2 — the chain runs through the invasive plant.
 *
 * Three real chains, each with a garden plant at one end and something that
 * costs you at the other. The first link is the one you can cut, which is the
 * argument this figure exists to make: the pest reservoir in a yard is usually
 * a plant somebody bought, not a plant that belongs here.
 */
export function chainFigure(): HTMLElement {
  // Each arrow lives *inside* the group holding the chip it points at, so the
  // two wrap together. Laid out as siblings, a phone-width line break could
  // leave an arrow stranded at the end of a line pointing at nothing.
  const next = (cls: string, label: TKey) =>
    el("span", { class: "chain-next" }, [
      el("span", { class: "chain-arrow", "aria-hidden": "true" }, "→"),
      el("span", { class: `chain-link ${cls}` }, t(label)),
    ]);

  const chain = (plant: TKey, pest: TKey, cost: TKey) =>
    el("li", { class: "chain" }, [
      el("span", { class: "chain-link chain-from" }, t(plant)),
      next("chain-pest", pest),
      next("chain-cost", cost),
    ]);

  return figure("crops-fig-chain", [
    el("p", { class: "chain-lede" }, [
      el("span", { class: "chain-cut", "aria-hidden": "true" }, "✂"),
      t("crops.fig.chain.cut"),
    ]),
    el("ul", { class: "chains" }, [
      chain("crops.fig.chain.ailanthus", "crops.fig.chain.lanternfly", "crops.fig.chain.grapes"),
      chain("crops.fig.chain.buckthorn", "crops.fig.chain.aphid", "crops.fig.chain.beans"),
      chain("crops.fig.chain.barberry", "crops.fig.chain.ticks", "crops.fig.chain.you"),
    ]),
  ], "crops.fig.chain.caption");
}

/**
 * Figure 3 — fat in the fruit.
 *
 * Two bars on one 0–50% scale, because the gap is the finding: the fruit of a
 * native shrub runs 6–48% fat, and the fruit of the invasive shrubs planted
 * for the same look runs under 1%. A bird fuelling a migration is after the
 * fat, which is why, offered both, it empties the native first.
 *
 * The bars are positioned as percentages of the same axis, so the drawing is
 * to scale rather than illustrative — the sliver really is a sliver.
 */
export function fatFigure(): HTMLElement {
  const MAX = 50; // the axis, in % fat
  const bar = (label: TKey, from: number, to: number, tone: string, value: TKey) =>
    el("li", { class: "fat-row" }, [
      el("span", { class: "fat-label" }, t(label)),
      el("span", { class: "fat-track" }, [
        el("span", {
          class: `fat-bar fat-${tone}`,
          style: `margin-left:${(from / MAX) * 100}%;width:${((to - from) / MAX) * 100}%`,
        }),
      ]),
      el("span", { class: "fat-value" }, t(value)),
    ]);

  return figure("crops-fig-fat", [
    el("ul", { class: "fat" }, [
      bar("crops.fig.fat.native", 6, 48, "good", "crops.fig.fat.nativeValue"),
      bar("crops.fig.fat.invasive", 0, 1, "bad", "crops.fig.fat.invasiveValue"),
    ]),
    el("p", { class: "fat-axis", "aria-hidden": "true" }, [
      el("span", {}, "0%"),
      el("span", {}, "25%"),
      el("span", {}, "50%"),
    ]),
  ], "crops.fig.fat.caption");
}

/**
 * Figure 4 — the ledger, for the claim this page is most likely to be
 * over-quoted on: that a native hedge draws birds off your fruit.
 *
 * Two columns, because the honest answer has two halves and printing only the
 * left one is how a good argument becomes a bad one. Someone who reads this
 * page and repeats the left column in an argument should already know what the
 * other person is about to say.
 */
export function ledgerFigure(): HTMLElement {
  const col = (cls: string, mark: string, head: TKey, items: TKey[]) =>
    el("div", { class: `ledger-col ledger-${cls}` }, [
      el("h4", {}, [el("span", { "aria-hidden": "true" }, `${mark} `), t(head)]),
      el("ul", {}, items.map((k) => el("li", {}, t(k)))),
    ]);

  return figure("crops-fig-ledger", [
    el("div", { class: "ledger" }, [
      col("yes", "✓", "crops.fig.ledger.yesHead", [
        "crops.fig.ledger.yes1",
        "crops.fig.ledger.yes2",
        "crops.fig.ledger.yes3",
      ]),
      col("no", "✗", "crops.fig.ledger.noHead", [
        "crops.fig.ledger.no1",
        "crops.fig.ledger.no2",
        "crops.fig.ledger.no3",
      ]),
    ]),
  ], "crops.fig.ledger.caption");
}
