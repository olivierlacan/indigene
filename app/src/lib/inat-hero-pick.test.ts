// The iNaturalist hero tier takes the photo a taxon page opens with, or nothing
// (`scripts/_inat-hero-pick.mjs`). These pin "or nothing": a reusable photo
// further down the gallery must never stand in for an unusable chosen one.
import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs helper shared with the scripts, no types
import { choose } from "../../scripts/_inat-hero-pick.mjs";

const photo = (id: number, license_code: string | null) => ({
  id,
  license_code,
  url: `https://inaturalist-open-data.s3.amazonaws.com/photos/${id}/medium.jpg`,
  attribution: `(c) someone`,
  attribution_name: "someone",
});

describe("choose", () => {
  it("takes the chosen photo when it can be republished", () => {
    const pick = choose({ id: 1, default_photo: photo(10, "cc-by"), taxon_photos: [] });
    expect(pick.photoId).toBe(10);
    expect(pick.url).toMatch(/\/10\/square\.jpg$/);
  });

  it("refuses rather than reaching down the gallery", () => {
    // Persimmon, as iNaturalist served it: two all-rights-reserved photos, then
    // a CC BY-SA close-up of seeds.
    const taxon = {
      id: 83435,
      default_photo: photo(92868365, null),
      taxon_photos: [photo(92868365, null), photo(54140118, null), photo(269017054, "cc-by-sa")].map((p) => ({ photo: p })),
    };
    const pick = choose(taxon);
    expect(pick.photoId).toBeUndefined();
    expect(pick.refused).toMatch(/92868365/);
  });

  it("refuses a taxon with no chosen photo at all", () => {
    expect(choose({ id: 2, taxon_photos: [{ photo: photo(5, "cc0") }] }).refused).toBeDefined();
  });
});
