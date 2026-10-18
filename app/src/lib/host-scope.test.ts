import { describe, it, expect } from "vitest";
import { genusOf, hostCountIsGenus } from "./host-scope";

const row = (basis: string, hostLepCount: number | null = 10) => ({ basis, hostLepCount });

describe("hostCountIsGenus", () => {
  it("reads a genus count from the host sentence", () => {
    expect(hostCountIsGenus(row("Native status/range: USDA PLANTS, E-Flora BC. Host count: willow genus, top western host (Tallamy/NWF)."))).toBe(true);
  });

  it("counts the Gaytán matrix as a genus count", () => {
    expect(hostCountIsGenus(row("Native status: BSBI. Host count: 120 Lepidoptera on native willows in oceanic-temperate Europe — Gaytán et al. 2026."))).toBe(true);
  });

  it("does not take a genus named elsewhere in the basis", () => {
    expect(hostCountIsGenus(row("Native status/range: the only member of its genus here. Host count: rough — few caterpillars are recorded on it."))).toBe(false);
  });

  it("does not take 'no published count for the genus'", () => {
    expect(hostCountIsGenus(row("Host count: rough — a few grass skippers; no published count for the genus."))).toBe(false);
  });

  it("says nothing for a plant not counted", () => {
    expect(hostCountIsGenus(row("Host count: oak genus, NWF/Tallamy.", null))).toBe(false);
  });
});

describe("genusOf", () => {
  it("takes the first word of the binomial", () => {
    expect(genusOf("Salix scouleriana")).toBe("Salix");
  });
});
