// The lawn page's picks: easiest first, nothing twice, nothing that pricks,
// and a spreader only on the ground.
import { describe, it, expect } from "vitest";
import { lawnPicks, PER_LAYER } from "./lawn";
import type { Plant, PlantForm } from "../types";

let n = 0;
function plant(form: PlantForm, establishment: number, extra: Partial<Plant> & { aggressive?: boolean; thorny?: boolean } = {}): Plant {
  const { aggressive = false, thorny = false, ...rest } = extra;
  return {
    id: rest.id ?? `p${n++}`,
    form,
    matureHeightFt: 3,
    hostLepCount: 0,
    scores: { establishment },
    filters: { aggressive, thorny, deerResistant: false, allergenic: false, petToxic: false },
    ...rest,
  } as unknown as Plant;
}

describe("lawnPicks", () => {
  it("puts the easiest first and keeps each layer short", () => {
    const shrubs = [40, 90, 70, 80, 60].map((e) => plant("shrub", e));
    const picks = lawnPicks(shrubs);
    expect(picks.shrubs.map((p) => p.scores.establishment)).toEqual([90, 80, 70]);
    expect(picks.shrubs).toHaveLength(PER_LAYER);
  });

  it("shows an evergreen once, in the evergreens", () => {
    const pine = plant("tree", 99, { id: "pinus-strobus" });
    const oak = plant("tree", 50, { id: "quercus-alba" });
    const picks = lawnPicks([pine, oak]);
    expect(picks.evergreens).toEqual([pine]);
    expect(picks.trees).toEqual([oak]);
  });

  it("counts a low sedge as ground cover, a tall grass not", () => {
    const sedge = plant("grass", 80, { matureHeightFt: 0.8 });
    const bluestem = plant("grass", 90, { matureHeightFt: 3 });
    expect(lawnPicks([sedge, bluestem]).ground).toEqual([sedge]);
  });

  it("leaves out anything thorny", () => {
    const rose = plant("shrub", 99, { thorny: true });
    expect(lawnPicks([rose]).shrubs).toEqual([]);
  });

  it("lets a spreader cover ground, but not crowd a bed while a tamer plant is there", () => {
    const spreadingShrub = plant("shrub", 99, { aggressive: true });
    const tameShrub = plant("shrub", 50);
    expect(lawnPicks([spreadingShrub, tameShrub]).shrubs.slice(0, 1)).toEqual([tameShrub]);
    const strawberry = plant("groundcover", 99, { aggressive: true });
    const ginger = plant("groundcover", 50);
    expect(lawnPicks([strawberry, ginger]).ground[0]).toBe(strawberry);
  });
});
