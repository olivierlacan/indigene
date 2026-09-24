// Which half of the world, and what that does to the calendar.
//
// This module is three small functions, which is exactly why it is worth
// pinning: every one of them is an off-by-something waiting to happen, and the
// symptom — a Sydney reader told to sow in October *because it is spring in
// Oregon* — is the kind of wrong that looks fine in a diff.
import { describe, it, expect } from "vitest";
import type { RegionMeta } from "../data/region";
import { hemisphereOf, mirrorMonth, regionHemisphere } from "./hemisphere";

describe("hemisphereOf", () => {
  it("places real coordinates on the right side", () => {
    expect(hemisphereOf(45.52)).toBe("north"); // Portland
    expect(hemisphereOf(-33.87)).toBe("south"); // Sydney
    expect(hemisphereOf(-33.92)).toBe("south"); // Cape Town
  });

  it("counts the equator as north, as the module says it does", () => {
    // Arbitrary but documented, and it has to go somewhere.
    expect(hemisphereOf(0)).toBe("north");
    expect(hemisphereOf(-0.0001)).toBe("south");
  });
});

describe("regionHemisphere", () => {
  const meta = (minLat: number, maxLat: number) =>
    ({ bounds: { minLat, maxLat, minLon: 0, maxLon: 1 } }) as RegionMeta;

  it("reads the middle of the coverage box, not an edge", () => {
    expect(regionHemisphere(meta(42.0, 50.3))).toBe("north"); // the PNW's box
    expect(regionHemisphere(meta(-38.0, -33.0))).toBe("south");
  });

  it("does not let one edge crossing the equator flip the answer", () => {
    // A box from -2 to +10 is overwhelmingly northern, and the midpoint says so
    // where `minLat < 0` alone would not.
    expect(regionHemisphere(meta(-2, 10))).toBe("north");
    expect(regionHemisphere(meta(-10, 2))).toBe("south");
  });
});

describe("mirrorMonth", () => {
  it("moves a month half a year, in Date's 0–11 counting", () => {
    expect(mirrorMonth(0)).toBe(6); // January → July
    expect(mirrorMonth(3)).toBe(9); // April → October
  });

  it("wraps rather than running off the end of the year", () => {
    expect(mirrorMonth(6)).toBe(0); // July → January
    expect(mirrorMonth(11)).toBe(5); // December → June
  });

  it("is its own inverse, which is what makes it safe to apply once", () => {
    // If this ever stops holding, some page is mirroring twice and showing the
    // northern calendar again with extra steps.
    for (let m = 0; m < 12; m++) expect(mirrorMonth(mirrorMonth(m))).toBe(m);
  });
});
