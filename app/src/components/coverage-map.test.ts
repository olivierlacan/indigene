// The map page's promises: every region is on it under a named continent, and
// no name runs off its picture or onto another name.
import { describe, it, expect } from "vitest";
import { placeLabels } from "./coverage-map";
import { COVERAGE_MAPS } from "../data/coverage-map";
import { CONTINENT_NAMES } from "../steps/map";
import { REGIONS } from "../data/regions";

describe("coverage map", () => {
  it("names every region — a new one needs `npm run maps:coverage`", () => {
    const named = COVERAGE_MAPS.flatMap((m) => m.labels.map((l) => l.id)).sort();
    expect(named).toEqual(REGIONS.map((r) => r.meta.id).sort());
  });

  it("gives every continent a heading", () => {
    for (const m of COVERAGE_MAPS.slice(1)) expect(CONTINENT_NAMES[m.id], m.id).toBeTruthy();
  });

  it("takes the preferred side when it is free", () => {
    const [spot] = placeLabels(300, 200, [{ x: 100, y: 100, w: 60, h: 14, side: "left" }]);
    expect(spot.left + 60).toBeLessThan(100);
  });

  it("moves a name that would run off the edge", () => {
    const [spot] = placeLabels(300, 200, [{ x: 290, y: 100, w: 80, h: 14, side: "right" }]);
    expect(spot.left + 80).toBeLessThanOrEqual(300);
    expect(spot.left).toBeGreaterThanOrEqual(0);
  });

  it("keeps two neighbours' names apart", () => {
    const labels = [
      // Dots far enough apart that neither touches the other's name, names
      // close enough that the second would land on the first.
      { x: 100, y: 100, w: 80, h: 14, side: "right" as const },
      { x: 100, y: 112, w: 80, h: 14, side: "right" as const },
    ];
    const [a, b] = placeLabels(300, 200, labels);
    const apart = a.left + 80 <= b.left || b.left + 80 <= a.left || a.top + 14 <= b.top || b.top + 14 <= a.top;
    expect(apart).toBe(true);
  });
});
