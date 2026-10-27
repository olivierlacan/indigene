import { describe, expect, it } from "vitest";
import { rankSeverity } from "./conservation";

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
