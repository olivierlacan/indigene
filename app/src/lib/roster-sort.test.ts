import { describe, it, expect } from "vitest";
import { byCaterpillars, rosterSort } from "./roster-sort";
import type { Plant } from "../types";

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

describe("rosterSort", () => {
  it("reads only the values it knows", () => {
    expect(rosterSort("caterpillars")).toBe("caterpillars");
    expect(rosterSort(null)).toBe("category");
    expect(rosterSort("wildlife")).toBe("category");
  });
});
