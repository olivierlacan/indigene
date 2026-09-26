// The order list photos load in: whatever is on screen first, then whatever is
// closest to it. `distanceFromView` is the measure the queue ranks by.
import { describe, it, expect } from "vitest";
import { distanceFromView } from "./photo";

describe("distanceFromView", () => {
  const screen = 800;

  it("is zero for a slot on screen, even partly", () => {
    expect(distanceFromView(100, 172, screen)).toBe(0);
    expect(distanceFromView(-40, 32, screen)).toBe(0);
    expect(distanceFromView(780, 852, screen)).toBe(0);
  });

  it("measures a slot below the screen from the bottom edge", () => {
    expect(distanceFromView(900, 972, screen)).toBe(100);
  });

  it("measures a slot above the screen from the top edge", () => {
    expect(distanceFromView(-372, -300, screen)).toBe(300);
  });

  it("ranks a row just past the fold ahead of one scrolled far behind", () => {
    const below = distanceFromView(850, 922, screen);
    const behind = distanceFromView(-2000, -1928, screen);
    expect(below).toBeLessThan(behind);
  });
});
