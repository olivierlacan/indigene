// Every country a region claims has a flag to draw.
//
// **This failure is silent.** `flagSvg` returns null for a code it does not
// know, `flagRow` returns null when nothing drew, and a region page renders
// perfectly well without a flag — so the only way to notice is to look at the
// regions list and see one row plainer than the others.
//
// It happened: the Kantō Plain shipped with `countries: ["JP"]` and no JP
// drawing, and nothing in the build, the tests or the checks said a word. This
// is the same class as `lib/csp.test.ts` — two lists that have to agree, where
// disagreeing costs nothing visible at the time.
import { describe, it, expect } from "vitest";
import { FLAG_CODES } from "./flags";
import { REGIONS } from "../data/regions";

describe("the flags cover the regions", () => {
  it("draws a flag for every country a region reaches", () => {
    for (const region of REGIONS) {
      for (const code of region.meta.countries) {
        expect(
          FLAG_CODES,
          `${region.meta.id} reaches ${code}, which flags.ts has no drawing for — ` +
            `its row would show no flag at all, with nothing to say why`,
        ).toContain(code);
      }
    }
  });

  it("gives every region at least one country", () => {
    // A region with an empty list draws no flags and trips nothing above.
    for (const region of REGIONS) {
      expect(region.meta.countries.length, `${region.meta.id} claims no country`).toBeGreaterThan(0);
    }
  });
});
