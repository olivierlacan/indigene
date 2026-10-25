import { describe, it, expect } from "vitest";
import { latestChange, pointAt, spreadLabels, stepPaths } from "./growth";

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

describe("stepPaths with a shared peak", () => {
  it("draws a smaller count lower, so two lines on one chart compare", () => {
    expect(stepPaths([[0, 25]], 0, 100, 100, 10, 100).line).toBe("M0,7.5H100");
  });
});

describe("spreadLabels", () => {
  it("leaves labels beside their lines when they have room", () => {
    expect(spreadLabels([100, 20], 100, 0.2)).toEqual([0, 0.8]);
  });
  it("pushes close labels apart, keeping them inside the box", () => {
    const [a, b] = spreadLabels([10, 8], 100, 0.25);
    expect(b - a).toBeCloseTo(0.25);
    expect(b).toBeLessThanOrEqual(1);
  });
  it("pushes close labels apart near the top too, without leaving the box", () => {
    const [a, b] = spreadLabels([100, 98], 100, 0.25);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(b - a).toBeCloseTo(0.25);
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
