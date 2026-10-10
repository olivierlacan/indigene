// A What's-new entry that names its section links that part of the app,
// unless it already links somewhere (`linkPrefix()` in scripts/guide-catalog.mjs).
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { linkPrefix } from "../../scripts/guide-catalog.mjs";

describe("linkPrefix", () => {
  it("links a known section name", () => {
    expect(linkPrefix("Regions: North Michigan is on the map.")).toBe(
      "[Regions](https://indigene.app/regions): North Michigan is on the map.",
    );
  });

  it("links each name in a multi-section prefix, by alias too", () => {
    expect(linkPrefix("Plants & Vegetables: a fourth card.")).toBe(
      "[Plants](https://indigene.app/plants) & [Vegetables](https://indigene.app/crops): a fourth card.",
    );
  });

  it("keeps a bold wrapper", () => {
    expect(linkPrefix("**Wildlife:** shorter.")).toBe(
      "**[Wildlife](https://indigene.app/wildlife):** shorter.",
    );
  });

  it("leaves an entry that already links alone", () => {
    const md = "Regions: [Ireland](https://indigene.app/regions/ireland) is on the map.";
    expect(linkPrefix(md)).toBe(md);
  });

  it("leaves a prefix that isn't a section name alone", () => {
    expect(linkPrefix("Note: Regions and more.")).toBe("Note: Regions and more.");
    expect(linkPrefix("Regions & Gnomes: hmm.")).toBe("Regions & Gnomes: hmm.");
  });
});
