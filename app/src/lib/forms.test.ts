import { describe, it, expect } from "vitest";
import { FORM_ORDER, isPlantForm } from "./forms";
import { rankPlants, DEFAULT_WEIGHTS, NO_FILTERS } from "./ranking";
import { loadPlants } from "./plants";
import { REGIONS } from "../data/regions";

const pnw = REGIONS.find((r) => r.meta.id === "pnw")!;
const ctx = { site: null, sun: null, weights: DEFAULT_WEIGHTS };

describe("type chips on the plant list", () => {
  it("keep every switched-off form off the list, and only those", async () => {
    const plants = await loadPlants(pnw);
    const shown = rankPlants(plants, { ...ctx, filters: { ...NO_FILTERS, hiddenForms: ["tree", "shrub"] } });
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.some((r) => r.plant.form === "tree" || r.plant.form === "shrub")).toBe(false);
    const others = plants.filter((p) => p.form !== "tree" && p.form !== "shrub").length;
    expect(shown.length).toBe(others);
  });

  it("show everything when none is switched off, as prefs saved before them do", async () => {
    const plants = await loadPlants(pnw);
    const { hiddenForms: _, ...older } = NO_FILTERS;
    const filters = older as typeof NO_FILTERS;
    expect(rankPlants(plants, { ...ctx, filters }).length).toBe(plants.length);
  });
});

describe("isPlantForm", () => {
  it("accepts the forms and nothing else", () => {
    expect(FORM_ORDER.every(isPlantForm)).toBe(true);
    expect(isPlantForm("bush")).toBe(false);
    expect(isPlantForm(3)).toBe(false);
  });
});
