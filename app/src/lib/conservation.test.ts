import { describe, expect, it, vi } from "vitest";
import { atRiskFirst, placeInWords, rankSeverity, threatLevel } from "./conservation";
import { setLang } from "./i18n";

describe("rankSeverity", () => {
  it("reads the IUCN codes", () => {
    expect(rankSeverity("CR")).toEqual({ low: 5, high: 5 });
    expect(rankSeverity("en")).toEqual({ low: 4, high: 4 });
    expect(rankSeverity("LC")).toEqual({ low: 1, high: 1 });
  });
  it("keeps a NatureServe span a span", () => {
    expect(rankSeverity("G3G4")).toEqual({ low: 2, high: 3 });
    expect(rankSeverity("S1")).toEqual({ low: 5, high: 5 });
  });
  it("ignores a migratory qualifier", () => {
    expect(rankSeverity("S3B")).toEqual({ low: 3, high: 3 });
  });
  it("refuses what it can't read", () => {
    expect(rankSeverity("SNR")).toBeNull();
    expect(rankSeverity("ST")).toBeNull();
  });
});

describe("threatLevel", () => {
  it("reads a global rank anywhere", () => {
    expect(threatLevel("gopher-tortoise")).toBe(5); // CR
    expect(threatLevel("gopher-tortoise", "kanto")).toBe(5);
  });
  it("reads a state rank only on its own region's pages", () => {
    expect(threatLevel("karner-blue", "north-michigan")).toBe(4); // S2
    expect(threatLevel("karner-blue", "chicago")).toBe(0);
    expect(threatLevel("karner-blue")).toBe(0);
  });
  it("takes the worse of global and local, and a span's worse end", () => {
    expect(threatLevel("zamia-integrifolia", "florida-south")).toBe(3); // G3, S3S4
  });
  it("is 0 for anything unassessed", () => {
    expect(threatLevel("monarch")).toBe(0);
  });
});

describe("atRiskFirst", () => {
  const level: Record<string, number> = { a: 3, b: 5, c: 0, d: 2, e: 5 };
  it("keeps vulnerable or worse, worst first, and the incoming order between equals", () => {
    expect(atRiskFirst(["a", "b", "c", "d", "e"], (x) => level[x])).toEqual(["b", "e", "a"]);
  });
});

describe("placeInWords", () => {
  // setLang sets the page's lang attribute; there is no page here.
  vi.stubGlobal("document", { documentElement: {} });
  it("finds an accented place's entry", () => {
    setLang("en");
    expect(placeInWords("Québec, CA")).toBe("Québec");
  });
  it("gives French its preposition", () => {
    setLang("fr");
    expect(placeInWords("Québec, CA")).toBe("au Québec");
    expect(placeInWords("Florida, US")).toBe("en Floride");
    setLang("en");
  });
  it("prints a place it has no entry for as published", () => {
    expect(placeInWords("Nevada, US")).toBe("Nevada, US");
  });
});
