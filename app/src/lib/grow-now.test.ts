// The season plan's rules, read against the real Mid-Atlantic rows: which
// plants are old enough, which are in their window, and which comes first.
import { describe, expect, it } from "vitest";
import { growPlan, readyAt, ripeMonths } from "./grow-now";
import { plantsToAdd, seasonMonths, buildSeasonUrl } from "./season-sightings";
import { REGIONS, loadPlants } from "./plants";
import type { Plant, Planting, PlantedDate } from "../types";

const region = REGIONS.find((r) => r.meta.id === "mid-atlantic")!;
const roster = await loadPlants(region);
const byId = new Map(roster.map((p) => [p.id, p]));
const plantOf = (id: string): Plant | undefined => byId.get(id);

const row = (plantId: string, planted: PlantedDate | null): Planting => ({
  id: plantId,
  spotId: "s",
  plantId,
  count: 1,
  planted,
  observations: [],
  createdAt: 0,
});

/** 8 October 2026, mid-autumn in the north. */
const OCTOBER = new Date(2026, 9, 8).getTime();
const APRIL = new Date(2026, 3, 8).getTime();

describe("growPlan", () => {
  it("puts ripe butterfly-weed seed first in October: the monarch's only host", () => {
    const plan = growPlan(
      [row("rudbeckia-fulgida", { year: 2022 }), row("asclepias-tuberosa", { year: 2023, month: 5 })],
      plantOf, "mid-atlantic", "north", OCTOBER
    );
    expect(plan.now.map((t) => [t.plantId, t.method, t.window])).toEqual([
      ["asclepias-tuberosa", "seed-cold-moist", "month"],
      ["rudbeckia-fulgida", "seed-cold-moist", "month"],
    ]);
    expect(plan.now[0].why).toEqual({ kind: "sole", wildlifeId: "monarch" });
  });

  it("never guesses when an oak bears acorns, however old, and leaves an undated plant out", () => {
    // The USDA Woody Plant Seed Manual puts white oak's first acorns at 20
    // years; a rule by growth form would have prompted this one at five.
    const plan = growPlan(
      [row("quercus-alba", { year: 2015 }), row("monarda-fistulosa", null)],
      plantOf, "mid-atlantic", "north", OCTOBER
    );
    expect(plan.now).toEqual([]);
    expect(plan.young).toEqual([]);
    expect(plan.seedOnlyWoody).toEqual(["quercus-alba"]);
    expect(plan.undated).toEqual(["monarda-fistulosa"]);
  });

  it("asks to leave black-eyed Susan seed for the birds, not butterfly weed's", () => {
    const plan = growPlan(
      [row("rudbeckia-fulgida", { year: 2022 }), row("asclepias-tuberosa", { year: 2022 })],
      plantOf, "mid-atlantic", "north", OCTOBER
    );
    const leave = Object.fromEntries(plan.now.map((t) => [t.plantId, t.leaveSome]));
    expect(leave).toEqual({ "rudbeckia-fulgida": true, "asclepias-tuberosa": false });
  });

  it("divides black-eyed Susan in spring, when its seed isn't ripe", () => {
    const plan = growPlan([row("rudbeckia-fulgida", { year: 2022 })], plantOf, "mid-atlantic", "north", APRIL);
    expect(plan.now.map((t) => t.method)).toEqual(["division"]);
  });

  it("collects a flowering aster's seed in autumn rather than splitting it", () => {
    const plan = growPlan([row("symphyotrichum-novae-angliae", { year: 2022 })], plantOf, "mid-atlantic", "north", OCTOBER);
    expect(plan.now.map((t) => [t.method, t.window])).toEqual([["seed-cold-moist", "month"]]);
  });

  it("counts a second, newer batch from the oldest one", () => {
    const plan = growPlan(
      [row("asclepias-tuberosa", { year: 2026, month: 5 }), row("asclepias-tuberosa", { year: 2022 })],
      plantOf, "mid-atlantic", "north", OCTOBER
    );
    expect(plan.now.map((t) => [t.plantId, t.years])).toEqual([["asclepias-tuberosa", 3]]);
  });

  it("is a planting still to come, not a young plant", () => {
    const plan = growPlan([row("asclepias-tuberosa", { year: 2027 })], plantOf, "mid-atlantic", "north", OCTOBER);
    expect(plan.undated).toEqual(["asclepias-tuberosa"]);
  });
});

describe("readyAt and ripeMonths", () => {
  it("never offers to divide an annual", () => {
    expect(readyAt("annual", "division")).toBeUndefined();
  });
  it("reads a soft plant's ripe seed off its last flowering month, across new year", () => {
    expect(ripeMonths({ form: "perennial", bloom: { startMonth: 10, endMonth: 11, color: "" } })).toEqual([11, 12, 1]);
  });
  it("doesn't guess a tree's ripening from its flowers", () => {
    expect(ripeMonths(byId.get("quercus-alba")!)).toBeNull();
  });
});

describe("seasonMonths", () => {
  it("mirrors autumn south of the equator", () => {
    expect(seasonMonths("fall", "north")).toEqual([9, 10, 11]);
    expect(seasonMonths("fall", "south")).toEqual([3, 4, 5]);
  });
  it("sends the months and a rounded point, not the spot", () => {
    const url = new URL(buildSeasonUrl({ lat: 39.95234, lon: -75.16521, taxonIds: [1, 2], months: [9, 10, 11] }));
    expect(url.searchParams.get("month")).toBe("9,10,11");
    expect(url.searchParams.get("lat")).toBe("39.95");
  });
});

describe("plantsToAdd", () => {
  it("offers a milkweed when monarchs are seen and none is planted", () => {
    const picks = plantsToAdd(roster, "mid-atlantic", new Set(), { monarch: 12 }, null);
    expect(picks.length).toBeGreaterThan(0);
    expect(picks[0].plant.id).toMatch(/^asclepias-/);
    expect(picks[0].sole).toBe(true);
  });
  it("skips what's planted, and what nothing seen eats", () => {
    const planted = new Set(roster.filter((p) => p.id.startsWith("asclepias-")).map((p) => p.id));
    const picks = plantsToAdd(roster, "mid-atlantic", planted, { monarch: 12 }, null);
    expect(picks.some((p) => p.plant.id.startsWith("asclepias-"))).toBe(false);
    expect(plantsToAdd(roster, "mid-atlantic", new Set(), {}, null)).toEqual([]);
  });
  it("leaves out a sun-lover for a shady spot", () => {
    const picks = plantsToAdd(roster, "mid-atlantic", new Set(), { monarch: 12 }, 1);
    expect(picks.every((p) => p.plant.sun.minHours <= 2)).toBe(true);
  });
});
