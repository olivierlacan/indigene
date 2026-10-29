// Kew keeps one spelling of a genitive epithet; we may have written the other
// (`genitiveVariant()` in scripts/_wcvp.mjs).
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { genitiveVariant, wcvpStatus } from "../../scripts/_wcvp.mjs";

describe("genitiveVariant", () => {
  it("swaps -ii for -i and back", () => {
    expect(genitiveVariant("Andropogon gerardii")).toBe("Andropogon gerardi");
    expect(genitiveVariant("Andropogon gerardi")).toBe("Andropogon gerardii");
  });
  it("leaves an epithet without the ending alone", () => {
    expect(genitiveVariant("Quercus alba")).toBeNull();
  });
  it("leaves infraspecific names alone", () => {
    expect(genitiveVariant("Sambucus nigra subsp. caerulea")).toBeNull();
  });
});

// What Kew's distribution rows say about one place (`wcvpStatus()`): a row
// with no establishment means is Kew saying native, and no row is absence.
describe("wcvpStatus", () => {
  const rows = [
    { locationId: "TDWG:IRE" },
    { locationId: "TDWG:GRB", establishmentMeans: "introduced" },
  ];
  const at = (id: string) => (r: { locationId: string }) => r.locationId === id;
  it("reads a bare row as native", () => expect(wcvpStatus(rows, at("TDWG:IRE"))).toBe("NATIVE"));
  it("upper-cases what Kew wrote", () => expect(wcvpStatus(rows, at("TDWG:GRB"))).toBe("INTRODUCED"));
  it("reads no row as absent", () => expect(wcvpStatus(rows, at("TDWG:FRA"))).toBe("ABSENT"));
});
