// The pavement-pioneer table's three standing promises.
//
// The data is a side table keyed by region id and plant id (`data/pioneers.ts`),
// which is the shape that keeps it auditable — and the shape where a typo is
// invisible: a misspelt plant id, or a row filed under a region's *file* name
// rather than its id, simply never appears. Both happened while this landed
// ("florida" is the file; "florida-central" is the region), and neither broke a
// build, so the check belongs here rather than in a reviewer's head.
import { describe, expect, it } from "vitest";
import { PIONEERS, PRESSURE_ORDER, PRESSURE_ICON } from "../data/pioneers";
import { pioneersForRegion, pioneerCountForRegion, orderedPressures } from "./pioneers";
import { traitsFor } from "./traits";
import { REGIONS, loadPlants } from "./plants";

describe("the pioneer table", () => {
  it("names only plants that are really on that region's list", async () => {
    const strays: string[] = [];
    for (const region of REGIONS) {
      const ids = new Set((await loadPlants(region)).map((p) => p.id));
      for (const plantId of Object.keys(PIONEERS[region.meta.id] ?? {})) {
        if (!ids.has(plantId)) strays.push(`${region.meta.id}/${plantId}`);
      }
    }
    expect(strays).toEqual([]);
  });

  it("is keyed by region id, not by anything that merely looks like one", () => {
    const known = new Set(REGIONS.map((r) => r.meta.id));
    expect(Object.keys(PIONEERS).filter((id) => !known.has(id))).toEqual([]);
  });

  it("gives every covered region a list, so no roster shows an empty heading", () => {
    const bare = REGIONS.map((r) => r.meta.id).filter((id) => pioneerCountForRegion(id) === 0);
    expect(bare).toEqual([]);
  });

  it("claims at least one pressure per row, from the vocabulary, without repeats", () => {
    const bad: string[] = [];
    for (const [regionId, rows] of Object.entries(PIONEERS)) {
      for (const [plantId, entry] of Object.entries(rows)) {
        const where = `${regionId}/${plantId}`;
        if (!entry.pressures.length) bad.push(`${where}: none`);
        if (new Set(entry.pressures).size !== entry.pressures.length) bad.push(`${where}: repeated`);
        for (const p of entry.pressures) {
          if (!PRESSURE_ORDER.includes(p)) bad.push(`${where}: unknown ${p}`);
        }
        if (!entry.note.trim() || !entry.basis.trim()) bad.push(`${where}: no prose`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("gives every pressure an icon, and shows them in one order everywhere", () => {
    expect(Object.keys(PRESSURE_ICON).sort()).toEqual([...PRESSURE_ORDER].sort());
    // `orderedPressures` exists so two plants that take the same four things
    // list them the same way, whatever order their rows were written in.
    const entry = { pressures: ["disturbance", "compaction"], note: "x", basis: "y" } as const;
    expect(orderedPressures({ ...entry, pressures: ["disturbance", "compaction"] }))
      .toEqual(orderedPressures({ ...entry, pressures: ["compaction", "disturbance"] }));
  });
});

describe("a region's pioneers", () => {
  it("come out toughest first", async () => {
    const region = REGIONS.find((r) => r.meta.id === "mid-atlantic")!;
    const picks = pioneersForRegion(region.meta.id, await loadPlants(region));
    const counts = picks.map((p) => p.entry.pressures.length);
    expect(picks.length).toBeGreaterThan(0);
    expect([...counts].sort((a, b) => b - a)).toEqual(counts);
  });

  it("are the region's own, never another region's", async () => {
    // Little bluestem is a pioneer in the Mid-Atlantic and not on the Florida
    // list at all; the Florida page must not inherit the claim.
    const mid = REGIONS.find((r) => r.meta.id === "mid-atlantic")!;
    const fl = REGIONS.find((r) => r.meta.id === "florida-central")!;
    const idsIn = async (r: typeof mid) =>
      pioneersForRegion(r.meta.id, await loadPlants(r)).map((p) => p.plant.id);
    expect(await idsIn(mid)).toContain("schizachyrium-scoparium");
    expect(await idsIn(fl)).not.toContain("schizachyrium-scoparium");
  });
});

describe("the Pavement pioneer label", () => {
  it("is only worn on a roster that documents it", async () => {
    const mid = REGIONS.find((r) => r.meta.id === "mid-atlantic")!;
    // Black cherry is on both the Mid-Atlantic and north Michigan lists and is
    // a pioneer on both; red maple is on both and is a pioneer on neither.
    const cherry = (await loadPlants(mid)).find((p) => p.id === "prunus-serotina")!;
    const maple = (await loadPlants(mid)).find((p) => p.id === "acer-rubrum")!;
    const ids = (p: typeof cherry, regionId?: string) => traitsFor(p, regionId).map((tr) => tr.id);
    expect(ids(cherry, "mid-atlantic")).toContain("pioneer");
    expect(ids(maple, "mid-atlantic")).not.toContain("pioneer");
    // A caller that doesn't know its region never gets the label: a card must
    // not promise toughness we only documented somewhere else.
    expect(ids(cherry)).not.toContain("pioneer");
  });
});
