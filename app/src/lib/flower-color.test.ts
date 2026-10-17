// Every colour word a shipped row uses has a swatch — and only a word the
// table knows does, so a new spelling is a decision rather than a blank.
import { describe, it, expect } from "vitest";
import { flowerHues, FLOWER_HUES } from "./flower-color";
import { REGIONS } from "../data/regions";

describe("flowerHues", () => {
  it("maps one word to one hue and a two-word colour to two", () => {
    expect(flowerHues("white")).toEqual(["white"]);
    expect(flowerHues("pink-white")).toEqual(["pink", "white"]);
    expect(flowerHues("blue to pink")).toEqual(["blue", "pink"]);
  });

  it("gives no swatch for 'none' or a word it doesn't know", () => {
    expect(flowerHues("none")).toBeNull();
    expect(flowerHues("chartreuse")).toBeNull();
    expect(flowerHues(null)).toBeNull();
  });

  it("names only hues the stylesheet has a token for", () => {
    for (const word of ["yellow-catkin", "copper-gold", "gray-purple"]) {
      for (const hue of flowerHues(word) ?? []) expect(FLOWER_HUES).toContain(hue);
    }
  });
});

describe("every shipped bloom colour has a swatch", async () => {
  const lists = await Promise.all(REGIONS.map(async (r) => ({ id: r.meta.id, rows: await r.load() })));
  for (const { id, rows } of lists) {
    it(`${id}: no row's colour word is unknown to the swatch table`, () => {
      const unknown = rows
        .filter((p) => p.bloom && p.bloom.color !== "none" && !flowerHues(p.bloom.color))
        .map((p) => `${p.id}: "${p.bloom!.color}"`);
      expect(unknown).toEqual([]);
    });
  }
});
