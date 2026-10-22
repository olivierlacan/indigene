// Two promises a plant's warnings make: a nettle says it stings, and the
// "No thorns or stings" filter keeps it off the list. Plus the shape an annual's
// row must have, because the growth tile and size chart both read it.
import { describe, it, expect } from "vitest";
import { traitsFor, gardenChecks } from "./traits";
import { rankPlants, DEFAULT_WEIGHTS, NO_FILTERS } from "./ranking";
import { loadPlants } from "./plants";
import { REGIONS } from "../data/regions";
import type { Plant } from "../types";

const pnw = REGIONS.find((r) => r.meta.id === "pnw")!;

async function plant(id: string): Promise<Plant> {
  const p = (await loadPlants(pnw)).find((x) => x.id === id);
  if (!p) throw new Error(`no ${id} on the PNW list`);
  return p;
}

describe("stinging plants", () => {
  it("label a nettle 'Stings', not 'Thorny'", async () => {
    const ids = traitsFor(await plant("urtica-gracilis")).map((tr) => tr.id);
    expect(ids).toContain("stinging");
    expect(ids).not.toContain("thorny");
  });

  it("leave everything else unlabelled", async () => {
    const ids = traitsFor(await plant("rosa-gymnocarpa")).map((tr) => tr.id);
    expect(ids).not.toContain("stinging");
  });

  it("are kept off the list by the 'No thorns' filter", async () => {
    const plants = await loadPlants(pnw);
    const ctx = { site: null, sun: null, weights: DEFAULT_WEIGHTS };
    const shown = (filters: typeof NO_FILTERS) =>
      rankPlants(plants, { ...ctx, filters }).map((r) => r.plant.id);
    expect(shown(NO_FILTERS)).toContain("urtica-gracilis");
    expect(shown({ ...NO_FILTERS, excludeThorny: true })).not.toContain("urtica-gracilis");
  });
});

describe("annuals", () => {
  it("carry a single year-1 size, and nothing else does", async () => {
    for (const region of REGIONS) {
      for (const p of await loadPlants(region)) {
        if (p.form === "annual") {
          expect(p.size.map((s) => s.year), p.id).toEqual([1]);
        } else {
          expect(p.size.length, p.id).toBeGreaterThan(1);
        }
      }
    }
  });
});

describe("garden checks", () => {
  // The labels only speak up for a yes; the checks must answer the no too, or
  // a plant deer eat says nothing — the gap the checks exist to close.
  it("answer every filter, yes or no", async () => {
    const values = (await Promise.all(["urtica-gracilis", "rosa-gymnocarpa"].map(plant)))
      .map((p) => gardenChecks(p).map((c) => c.value));
    for (const v of values) expect(v).toHaveLength(5);
    expect(values[0]).toContain("check.thorns.stings");
    expect(values[1]).toContain("check.thorns.yes");
  });

  it("flag only the answers that call for care", async () => {
    const nettle = gardenChecks(await plant("urtica-gracilis"));
    expect(nettle.find((c) => c.label === "check.thorns")!.caution).toBe(true);
    expect(nettle.find((c) => c.label === "check.water")!.caution).toBe(false);
  });
});
