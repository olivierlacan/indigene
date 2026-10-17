// A dot of the flower's colour, beside the word for it.
//
// Decoration in the strict sense: `aria-hidden`, because the word next to it
// already says "pink", and a split dot for a two-tone flower, because
// "pink-white" is a flower that is both and not a flower that is salmon. The
// colours are the theme's `--flower-<hue>` tokens (`lib/flower-color.ts`).
import { el } from "../ui";
import { flowerHues } from "../lib/flower-color";

export function flowerSwatch(color: string | null | undefined): HTMLElement | null {
  const hues = flowerHues(color);
  if (!hues) return null;
  const [a, b] = hues;
  return el("span", {
    class: b ? "flower-swatch flower-swatch-split" : "flower-swatch",
    "aria-hidden": "true",
    style: `--swatch-a: var(--flower-${a}); --swatch-b: var(--flower-${b ?? a})`,
  });
}
