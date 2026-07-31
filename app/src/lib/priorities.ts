// What a person wants this spot to *do* — the ranking's weights, and the plain
// words that make them legible.
//
// The weights themselves are a product decision and don't vary by language, so
// each preset carries dictionary keys rather than words: a name for the button
// and a sub-line saying what it turns up and what it turns down. That sub-line
// is the whole point of the file. A slider labelled "3" answers nothing; "we
// count caterpillars above everything else, because that's what feeds the most
// life" answers the question people actually arrive with — *why is this list in
// this order?*
import type { Weights } from "../types";
import type { TKey } from "../locales/en";
import { DEFAULT_WEIGHTS } from "./ranking";
import { SCORE_KEYS } from "./plain";
import { t } from "./i18n";

export interface Preset {
  key: TKey;
  /** One line on what this goal favours — shown under the name, always. */
  subKey: TKey;
  weights: Weights;
}

/** The named goals, in the order they're offered. The first one is the app's
 *  default ranking (see `DEFAULT_WEIGHTS`) — named and explained rather than
 *  left as an unlabelled starting position nobody chose. */
export const PRESETS: Preset[] = [
  { key: "preset.default", subKey: "preset.default.sub", weights: { ...DEFAULT_WEIGHTS } },
  { key: "preset.balanced", subKey: "preset.balanced.sub", weights: { host: 3, pollinator: 3, bird: 3, stormwater: 2, erosion: 2, carbon: 1, establishment: 3 } },
  { key: "preset.butterflies", subKey: "preset.butterflies.sub", weights: { host: 5, pollinator: 5, bird: 3, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { key: "preset.birds", subKey: "preset.birds.sub", weights: { host: 4, pollinator: 2, bird: 5, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 } },
  { key: "preset.erosion", subKey: "preset.erosion.sub", weights: { host: 1, pollinator: 1, bird: 1, stormwater: 4, erosion: 5, carbon: 2, establishment: 4 } },
  { key: "preset.rain", subKey: "preset.rain.sub", weights: { host: 1, pollinator: 2, bird: 1, stormwater: 5, erosion: 3, carbon: 2, establishment: 3 } },
  { key: "preset.easiest", subKey: "preset.easiest.sub", weights: { host: 2, pollinator: 2, bird: 2, stormwater: 1, erosion: 1, carbon: 1, establishment: 5 } },
];

/** The preset these weights *are*, if any — so a goal stays visibly chosen and
 *  the plant list can name what it was ranked for. */
export function matchingPreset(w: Weights): Preset | null {
  return PRESETS.find((p) => SCORE_KEYS.every((k) => p.weights[k] === w[k])) ?? null;
}

/** What to call the current ranking: the goal's name, or "your own mix" once
 *  someone has moved a slider away from every preset. */
export function priorityName(w: Weights): string {
  const preset = matchingPreset(w);
  return preset ? t(preset.key) : t("priorities.custom");
}

/** A weight as a word. "3" is a number on a scale nobody was shown; "counts
 *  normally" is an answer. Used beside every slider and as its `aria-valuetext`,
 *  so the value is spoken the same way it's read. */
export function weightWord(n: number): string {
  const step = Math.min(5, Math.max(0, Math.round(n)));
  return t(`weight.word.${step}` as TKey);
}
