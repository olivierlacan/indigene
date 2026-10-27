import { describe, it, expect } from "vitest";
import { byCaterpillars, rosterQuery, rosterView } from "./roster-sort";
import type { Plant } from "../types";
import { NO_TRAIT_FILTERS as filters } from "./filter-traits";

const plant = (id: string, hostLepCount: number | null, keystone = false): Plant =>
  ({ id, common: id, hostLepCount, keystone }) as Plant;

describe("byCaterpillars", () => {
  const order = (ps: Plant[]): string[] => byCaterpillars(ps, (p) => p.common, "en").map((p) => p.id);

  it("puts the most caterpillar species first", () => {
    expect(order([plant("aster", 100), plant("oak", 500), plant("fern", 2)])).toEqual(["oak", "aster", "fern"]);
  });

  it("puts a plant not counted yet after one counted at 0", () => {
    expect(order([plant("uncounted", null), plant("zero", 0), plant("some", 3)])).toEqual(["some", "zero", "uncounted"]);
  });

  it("breaks a tie with the keystone, then the name", () => {
    expect(order([plant("b", 10), plant("c", 10, true), plant("a", 10)])).toEqual(["c", "a", "b"]);
  });

  it("leaves the list it was given alone", () => {
    const ps = [plant("a", 1), plant("b", 2)];
    order(ps);
    expect(ps.map((p) => p.id)).toEqual(["a", "b"]);
  });
});

describe("rosterView", () => {
  const view = (q: string) => rosterView(new URLSearchParams(q));

  it("defaults to one list, by name, unfiltered", () => {
    expect(view("")).toEqual({ sort: "name", grouped: false, pioneers: false, atRisk: false, filters });
    expect(view("sort=wildlife&group=maybe&only=trees")).toEqual({ sort: "name", grouped: false, pioneers: false, atRisk: false, filters });
  });

  it("reads every control", () => {
    expect(view("sort=caterpillars&group=type&only=pioneers")).toEqual({ sort: "caterpillars", grouped: true, pioneers: true, atRisk: false, filters });
    expect(view("only=at-risk,pioneers")).toEqual({ sort: "name", grouped: false, pioneers: true, atRisk: true, filters });
  });

  it("writes the default view as no query at all", () => {
    expect(rosterQuery({ sort: "name", grouped: false, pioneers: false, atRisk: false, filters })).toBe("");
  });

  it("round-trips every combination", () => {
    for (const sort of ["name", "caterpillars"] as const)
      for (const grouped of [true, false])
        for (const pioneers of [true, false])
          for (const atRisk of [true, false]) {
            const v = { sort, grouped, pioneers, atRisk, filters };
            expect(view(rosterQuery(v).slice(1))).toEqual(v);
          }
  });

  it("reads and writes the spot filters", () => {
    const v = view("filter=pet-safe,deer,bogus&max-height=9.84&max-spread=-2");
    expect(v.filters).toEqual({ ...filters, excludePetToxic: true, requireDeerResistant: true, maxHeightFt: 9.84 });
    expect(rosterQuery(v)).toBe("?filter=deer%2Cpet-safe&max-height=9.84");
    expect(view(rosterQuery(v).slice(1))).toEqual(v);
  });
});
