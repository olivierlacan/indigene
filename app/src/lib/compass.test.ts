import { describe, it, expect } from "vitest";
import { compassPoint } from "./compass";

describe("compassPoint", () => {
  it("names the four cardinal directions", () => {
    expect(compassPoint(10, 0)).toBe("n");
    expect(compassPoint(0, 10)).toBe("e");
    expect(compassPoint(-10, 0)).toBe("s");
    expect(compassPoint(0, -10)).toBe("w");
  });

  it("names the diagonals", () => {
    expect(compassPoint(10, 10)).toBe("ne");
    expect(compassPoint(-10, 10)).toBe("se");
    expect(compassPoint(-10, -10)).toBe("sw");
    expect(compassPoint(10, -10)).toBe("nw");
  });

  it("rounds to the nearest point, not the next one round", () => {
    expect(compassPoint(100, 30)).toBe("n"); // ~17° east of north
    expect(compassPoint(100, 50)).toBe("ne"); // ~27°
    expect(compassPoint(-100, -30)).toBe("s"); // just past due south
    expect(compassPoint(100, -30)).toBe("n"); // just west of north wraps back
  });
});
