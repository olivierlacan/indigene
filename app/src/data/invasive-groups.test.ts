import { describe, expect, it } from "vitest";
import { INVASIVE_GROUPS } from "./invasive-groups";
import { MOST_WANTED } from "./invasives";

describe("invasive groups", () => {
  it("only lists regions that have an invasives list to show them under", () => {
    for (const regionId of Object.keys(INVASIVE_GROUPS)) {
      expect(MOST_WANTED[regionId], regionId).toBeDefined();
    }
  });

  it("keeps each region to three https links", () => {
    for (const [regionId, groups] of Object.entries(INVASIVE_GROUPS)) {
      expect(groups.length, regionId).toBeGreaterThan(0);
      expect(groups.length, regionId).toBeLessThanOrEqual(3);
      for (const g of groups) expect(g.url, g.name).toMatch(/^https:\/\//);
    }
  });

  it("names no group the way the app's style rule forbids", () => {
    for (const g of Object.values(INVASIVE_GROUPS).flat()) {
      expect(g.name, g.name).not.toMatch(/invader|alien|villain|exotic/i);
    }
  });
});
