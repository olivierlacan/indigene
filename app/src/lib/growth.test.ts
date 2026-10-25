import { describe, it, expect } from "vitest";
import { latestChange, pointAt, stepPaths } from "./growth";

describe("stepPaths", () => {
  it("holds each count flat until the next one, then runs on to the end", () => {
    const { line, area } = stepPaths([[0, 10], [50, 20]], 0, 100, 100, 10);
    expect(line).toBe("M0,5H50V0H100");
    expect(area).toBe("M0,5H50V0H100V10H0Z");
  });

  it("starts a list launched after the window opens at its launch, not at zero", () => {
    expect(stepPaths([[25, 4]], 0, 100, 100, 10).line).toBe("M25,0H100");
  });

  it("draws an empty count on the floor rather than dividing by zero", () => {
    expect(stepPaths([[0, 0], [10, 0]], 0, 10, 10, 10).line).toBe("M0,10H10V10H10");
  });
});

describe("pointAt", () => {
  it("shows the last change at or before the moment", () => {
    expect(pointAt([0, 10, 20], 15)).toBe(1);
    expect(pointAt([0, 10, 20], 20)).toBe(2);
    expect(pointAt([0, 10, 20], -5)).toBe(0);
  });
});

describe("latestChange", () => {
  it("is the difference the newest step made", () => {
    expect(latestChange([[1, 63, 23], [2, 77, 23]])).toEqual([2, [14, 0]]);
  });
  it("is nothing for a list that arrived in one go", () => {
    expect(latestChange([[1, 67, 21]])).toBeNull();
  });
});
