// The angle a candidate photo is guessed to show (`scripts/_photo-angle.mjs`),
// which files it on the review page. The guess is only shown when it clears a
// floor, and a tie goes to the whole plant.
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { fit, suggest } from "../../scripts/_photo-angle.mjs";

const scores = (s: Partial<Record<"habit" | "leaf" | "flower" | "fruit", number>>) => ({
  habit: 0, leaf: 0, flower: 0, fruit: 0, ...s,
});

describe("suggest", () => {
  it("picks the best angle", () => expect(suggest(scores({ habit: 0.5, leaf: 0.7 }))).toBe("leaf"));
  it("gives a tie to the whole plant", () => expect(suggest(scores({ habit: 0.6, leaf: 0.6 }))).toBe("habit"));
  it("says nothing below the floor", () => {
    expect(suggest(scores({ habit: 0.45, leaf: 0.3 }))).toBeNull();
  });
});

describe("fit", () => {
  it("scores a failed measurement as nothing", () => {
    expect(fit({ error: "decode" })).toEqual({ habit: 0, leaf: 0, flower: 0, fruit: 0 });
  });
  it("lets a flowering annotation carry the flower angle over the floor", () => {
    const m = { centreDetail: 1, edgeDetail: 1 };
    expect(fit(m, "flowering").flower).toBeGreaterThanOrEqual(0.55);
    expect(fit(m).flower).toBe(0);
  });
});
