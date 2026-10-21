// The picks on the Kill your lawn page (`steps/lawn.ts`): for one region, a
// few easy natives in each layer a lawn can give way to.
//
// "Easy" is the establishment score every plant row already carries — how
// readily it takes hold — with the caterpillar count to break a tie, so of two
// equally easy shrubs the one that feeds more comes first. Nothing here is
// hand-picked per region: a region that gains a plant gains it here too.
//
// Five layers, because a lawn swapped for ground cover alone is a smaller
// lawn. Evergreens are picked first and kept out of the shrubs and trees, so
// no plant shows twice.
import type { Plant } from "../types";
import { EVERGREEN } from "../data/evergreen";

export type LawnLayer = "ground" | "flowers" | "shrubs" | "trees" | "evergreens";

export const LAWN_LAYERS: readonly LawnLayer[] = ["ground", "flowers", "shrubs", "trees", "evergreens"];

/** How many plants each layer shows. The roster has the rest. */
export const PER_LAYER = 3;

/** Low enough to take the lawn's place: ground covers, and sedges and ferns
 *  that stay under knee height. */
const LOW_FT = 1.5;

function inLayer(p: Plant, layer: LawnLayer): boolean {
  switch (layer) {
    case "ground":
      return p.form === "groundcover" || ((p.form === "grass" || p.form === "fern") && p.matureHeightFt <= LOW_FT);
    case "flowers":
      return p.form === "perennial";
    case "shrubs":
      return p.form === "shrub";
    case "trees":
      return p.form === "tree";
    case "evergreens":
      return EVERGREEN.has(p.id) && p.form !== "vine";
  }
}

/** Nothing that pricks or stings where people will walk and kids will play. */
const gentle = (p: Plant): boolean => !p.filters.thorny && !p.filters.stinging;

const easiest = (a: Plant, b: Plant): number =>
  b.scores.establishment - a.scores.establishment ||
  (b.hostLepCount ?? 0) - (a.hostLepCount ?? 0) ||
  a.id.localeCompare(b.id);

/**
 * A region's picks, layer by layer. A spreader is welcome on the ground — that
 * is what covering ground means — but kept out of the beds above it while a
 * well-behaved plant is there to take its place. A layer the region has
 * nothing for comes back empty, and the page leaves it out.
 */
export function lawnPicks(plants: readonly Plant[]): Record<LawnLayer, Plant[]> {
  const used = new Set<string>();
  const pick = (layer: LawnLayer): Plant[] => {
    const pool = plants.filter((p) => inLayer(p, layer) && gentle(p) && !used.has(p.id)).sort(easiest);
    const tame = layer === "ground" ? pool : pool.filter((p) => !p.filters.aggressive);
    const chosen = [...tame, ...pool.filter((p) => !tame.includes(p))].slice(0, PER_LAYER);
    for (const p of chosen) used.add(p.id);
    return chosen;
  };
  // Evergreens first, so the shrubs and trees rows don't take them.
  const evergreens = pick("evergreens");
  return { ground: pick("ground"), flowers: pick("flowers"), shrubs: pick("shrubs"), trees: pick("trees"), evergreens };
}
