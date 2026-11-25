import { describe, it, expect } from "vitest";
import { rankPlants, hiddenEssentials, DEFAULT_WEIGHTS, NO_FILTERS } from "./ranking";
import { REGIONS, loadPlants } from "./plants";
import type { SunEstimate } from "../types";

const sun = (hours: number): SunEstimate =>
  ({ hours, low: hours - 1, high: hours + 1, label: "", deciduousAdjusted: false, source: "manual" });

async function pnw() {
  return loadPlants(REGIONS.find((r) => r.meta.id === "pnw")!);
}

describe("hiddenEssentials", () => {
  it("is empty with no filters on", async () => {
    const plants = await pnw();
    const ctx = { site: null, sun: sun(7), weights: DEFAULT_WEIGHTS, filters: NO_FILTERS };
    expect(hiddenEssentials(plants, ctx, rankPlants(plants, ctx))).toEqual([]);
  });

  it("names the essential plants a filter hid, and only those", async () => {
    const plants = await pnw();
    const ctx = { site: null, sun: sun(7), weights: DEFAULT_WEIGHTS, filters: { ...NO_FILTERS, maxHeightFt: 6 } };
    const shown = rankPlants(plants, ctx);
    const hidden = hiddenEssentials(plants, ctx, shown);
    expect(hidden.length).toBeGreaterThan(0);
    for (const r of hidden) {
      expect(r.plant.keystone).toBe(true);
      expect(r.plant.matureHeightFt).toBeGreaterThan(6);
      expect(r.match).not.toBe("poor");
      expect(shown.some((s) => s.plant.id === r.plant.id)).toBe(false);
    }
    // Every essential plant the filter removed and that suits the spot is named.
    const suits = rankPlants(plants, { ...ctx, filters: NO_FILTERS })
      .filter((r) => r.plant.keystone && r.match !== "poor" && r.plant.matureHeightFt > 6);
    expect(hidden.map((r) => r.plant.id).sort()).toEqual(suits.map((r) => r.plant.id).sort());
  });

  it("leaves out an essential plant that wouldn't suit the spot anyway", async () => {
    const plants = await pnw();
    const ctx = { site: null, sun: sun(1), weights: DEFAULT_WEIGHTS, filters: { ...NO_FILTERS, hiddenForms: ["tree" as const] } };
    const hidden = hiddenEssentials(plants, ctx, rankPlants(plants, ctx));
    const poor = rankPlants(plants, { ...ctx, filters: NO_FILTERS }).filter((r) => r.plant.keystone && r.match === "poor");
    expect(poor.length).toBeGreaterThan(0);
    for (const r of poor) expect(hidden.some((h) => h.plant.id === r.plant.id)).toBe(false);
  });
});
