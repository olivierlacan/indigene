import { describe, it, expect } from "vitest";
import { passesFilters, mergeTraits, filterCount, NO_TRAIT_FILTERS } from "./filter-traits";
import type { FilterTraits } from "./filter-traits";

const plain: FilterTraits = {
  deerResistant: true, thorny: false, petToxic: false, aggressive: false, noWater: true, heightFt: 6, spreadFt: 4,
};

describe("passesFilters", () => {
  it("lets everything through with no filter on", () => {
    expect(passesFilters({ ...plain, petToxic: true, thorny: true, deerResistant: false }, NO_TRAIT_FILTERS)).toBe(true);
  });

  it("drops a plant on each filter it fails", () => {
    const f = NO_TRAIT_FILTERS;
    expect(passesFilters({ ...plain, petToxic: true }, { ...f, excludePetToxic: true })).toBe(false);
    expect(passesFilters({ ...plain, thorny: true }, { ...f, excludeThorny: true })).toBe(false);
    expect(passesFilters({ ...plain, aggressive: true }, { ...f, excludeAggressive: true })).toBe(false);
    expect(passesFilters({ ...plain, deerResistant: false }, { ...f, requireDeerResistant: true })).toBe(false);
    expect(passesFilters({ ...plain, noWater: false }, { ...f, requireNoWater: true })).toBe(false);
    expect(passesFilters(plain, { ...f, maxHeightFt: 5 })).toBe(false);
    expect(passesFilters(plain, { ...f, maxSpreadFt: 3 })).toBe(false);
  });

  it("keeps a plant exactly at a size cap", () => {
    expect(passesFilters(plain, { ...NO_TRAIT_FILTERS, maxHeightFt: 6, maxSpreadFt: 4 })).toBe(true);
  });
});

describe("mergeTraits", () => {
  it("takes the cautious reading when two regions disagree", () => {
    const other: FilterTraits = { ...plain, deerResistant: false, petToxic: true, noWater: false, heightFt: 10, spreadFt: 2 };
    expect(mergeTraits(plain, other)).toEqual({
      deerResistant: false, thorny: false, petToxic: true, aggressive: false, noWater: false, heightFt: 10, spreadFt: 4,
    });
  });
});

describe("filterCount", () => {
  it("counts each checkbox and each size cap", () => {
    expect(filterCount(NO_TRAIT_FILTERS)).toBe(0);
    expect(filterCount({ ...NO_TRAIT_FILTERS, excludePetToxic: true, maxSpreadFt: 6 })).toBe(2);
  });
});
