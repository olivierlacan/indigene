// Loads the seed dataset and derives the one score we compute rather than
// author by hand: the caterpillar/moth host value. We store the RAW Lepidoptera
// host-species count in the data (honest, checkable) and normalize it here on a
// log scale, because the difference between 5 and 50 host species matters far
// more than the difference between 450 and 500.
import type { EcoScores, Plant } from "../types";
import { REGION, SEED_RAW } from "../data/plants.mid-atlantic";
import type { RawPlant } from "../data/plants.mid-atlantic";

// Highest genus count in our region (oaks, ~500) anchors the top of the scale.
const HOST_ANCHOR = 520;

export function hostScore(count: number): number {
  const s = Math.log10(1 + count) / Math.log10(1 + HOST_ANCHOR);
  return Math.round(Math.min(100, Math.max(0, s * 100)));
}

function build(raw: RawPlant): Plant {
  const scores: EcoScores = { ...raw.scores, host: hostScore(raw.hostLepCount) };
  return { ...raw, scores };
}

let cache: Plant[] | null = null;

export function loadPlants(): Plant[] {
  if (!cache) cache = SEED_RAW.map(build);
  return cache;
}

export { REGION };
