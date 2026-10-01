// How sure we are of a plant's figures, as three bars rather than a sentence.
//
// It used to be a paragraph on every plant page — "Confidence: medium.
// Reasonably confident, but some numbers are estimated…" — the same three
// sentences repeated across six hundred pages. Now the page shows the level and
// links to `#/confidence`, where each level is explained once.
import { el } from "../ui";
import { t } from "../lib/i18n";
import type { Plant } from "../types";

export type Confidence = Plant["confidence"];

/** Where the levels are explained. */
export const CONFIDENCE_ROUTE = "#/confidence";

const FILLED: Record<Confidence, number> = { low: 1, medium: 2, high: 3 };

/**
 * Three bars, `n` of them filled, and the level's word beside them. The bars
 * are decoration; the word is what a screen reader reads.
 */
export function confidenceMeter(level: Confidence): HTMLElement {
  const n = FILLED[level];
  return el("span", { class: `confidence-meter confidence-${level}` }, [
    el("span", { class: "confidence-bars", "aria-hidden": "true" },
      [1, 2, 3].map((i) => el("span", { class: i <= n ? "on" : "" }))),
    el("strong", { class: "confidence-word" }, t(`confidence.word.${level}` as const)),
  ]);
}
