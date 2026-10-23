import { describe, expect, it } from "vitest";
import { findKept } from "./kept-place";

describe("findKept", () => {
  it("finds a control by its own name, though its address changed", () => {
    // A tapped filter: before, it linked to "filter on"; after, the sort
    // segment links there and the filter links to "filter off".
    const after = [
      { keep: "view:0:0", href: "#/regions/chicago?pet=1", y: 900 },
      { keep: "view:2:3", href: "#/regions/chicago", y: 1300 },
    ];
    expect(findKept(after, { keep: "view:2:3", href: "#/regions/chicago?pet=1", y: 1300 })).toBe(1);
  });

  it("of two links to the same address, picks the one nearest the tap", () => {
    const after = [
      { href: "#/wildlife?group=type", y: 120 },
      { href: "#/wildlife?group=type", y: 560 },
    ];
    expect(findKept(after, { href: "#/wildlife?group=type", y: 540 })).toBe(1);
  });

  it("matches a plain link by address", () => {
    const after = [{ href: "#/plants/a", y: 0 }, { href: "#/plants/b", y: 900 }];
    expect(findKept(after, { href: "#/plants/b", y: 10 })).toBe(1);
  });

  it("says so when the tapped link is gone", () => {
    expect(findKept([{ href: "#/a", y: 0 }], { href: "#/b", y: 0 })).toBe(-1);
    expect(findKept([{ keep: "x", href: "#/b", y: 0 }], { keep: "y", href: "#/b", y: 0 })).toBe(-1);
  });
});
