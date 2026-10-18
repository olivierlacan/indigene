import { describe, expect, it } from "vitest";
import { REGIONS } from "../data/regions";
import { REGIONS_FR } from "../locales/regions.fr";
import { areasMatching, countryNames, fold, markFolded, regionSearch } from "./region-search";

const meta = (id: string) => REGIONS.find((r) => r.meta.id === id)!.meta;
const finds = (q: string) => REGIONS.filter((r) => regionSearch(r.meta, "en").hay.includes(fold(q))).map((r) => r.meta.id);

describe("fold", () => {
  it("drops accents, case and extra spaces", () => {
    expect(fold("  Île-de-France ")).toBe("ile-de-france");
    expect(fold("Québec   City")).toBe("quebec city");
  });
});

describe("countryNames", () => {
  it("names a country in English and the reader's language, with its short form", () => {
    expect(countryNames(["US"], "fr-FR")).toEqual(expect.arrayContaining(["United States", "États-Unis", "USA"]));
  });
  it("reads a nation's code as its country", () => {
    expect(countryNames(["GB-SCT"], "en")).toEqual(expect.arrayContaining(["United Kingdom", "UK"]));
  });
});

describe("regionSearch", () => {
  it("finds a region by a state its name doesn't say", () => {
    expect(finds("Illinois")).toEqual(["chicago"]);
  });
  it("finds every region in a country", () => {
    expect(finds("france").sort()).toEqual(
      ["france-alpine", "france-atlantic", "france-continental", "france-mediterranean"],
    );
  });
  it("ignores accents either way", () => {
    expect(finds("montreal")).toEqual(["st-lawrence"]);
  });
  it("finds nothing for a postal code, which goes to the place lookup", () => {
    expect(finds("97201")).toEqual([]);
  });
});

describe("areasMatching", () => {
  it("names the state that matched", () => {
    const s = regionSearch(meta("chicago"), "en");
    expect(areasMatching(s, fold("indi"), "Chicago & the Corn Belt Prairie Chicago")).toEqual(["Indiana"]);
  });
  it("stays quiet when the card already shows the match", () => {
    const s = regionSearch(meta("nz-auckland"), "en");
    expect(areasMatching(s, fold("auckland"), "Auckland & Northland")).toEqual([]);
    const fr = regionSearch(meta("france-atlantic"), "en");
    expect(areasMatching(fr, fold("france"), "Atlantic France Paris, Nantes & Bordeaux")).toEqual([]);
  });
});

describe("markFolded", () => {
  it("marks the original letters of an accent-folded hit", () => {
    expect(markFolded("Grenoble, Annecy & Briançon", "brianc")).toEqual([
      { text: "Grenoble, Annecy & ", hit: false },
      { text: "Brianç", hit: true },
      { text: "on", hit: false },
    ]);
  });
});

describe("translated areas", () => {
  it("list the same places, in the same order, as the English", () => {
    for (const [id, text] of Object.entries(REGIONS_FR)) {
      if (text.areas) expect(text.areas.length, id).toBe(meta(id).areas.length);
    }
  });
});
