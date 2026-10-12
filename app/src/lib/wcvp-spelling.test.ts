// Kew keeps one spelling of a genitive epithet; we may have written the other
// (`genitiveVariant()` in scripts/_wcvp.mjs).
import { describe, expect, it } from "vitest";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { genitiveVariant } from "../../scripts/_wcvp.mjs";

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
