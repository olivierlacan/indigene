// Which list a spot gets handed, and why.
//
// `docs/ecoregion-plan.md` asked for the other half of this under "Testing":
// *"assert the box fallback still selects correctly when `site.ecoregion` is
// null"*. That case is the one a reader hits offline, in airplane mode, or
// anywhere a service has no polygon — so it is the common path, not the edge.
//
// These run against the **real bundled region data**, not a fixture. That is
// deliberate: the rule and the data are one answer, and a fixture would let a
// region's codes drift out from under the rule that reads them. It does mean a
// region changing its declared codes can fail a test here, which is the point —
// the failure names the region and the code.
//
// What this does not do is ask a service anything. `npm run selection:check`
// stands in the same places with the *live* lookups; between them, this pins
// the rule and that pins the facts.
import { describe, it, expect } from "vitest";
import { regionForSite } from "./plants";
import type { EcoregionInfo, SiteData } from "../types";

/** A site whose only interesting property is which ecoregion came back. */
function siteWith(info: EcoregionInfo | null): SiteData {
  return { ecoregionInfo: info } as SiteData;
}

const epa = (code: string, name: string): EcoregionInfo => ({
  provider: "epa-omernik", code, name, hierarchy: [], detail: null,
});
const cec = (code: string, name: string): EcoregionInfo => ({
  provider: "cec-na", code, name, hierarchy: [], detail: null,
});
const eea = (code: string, name: string): EcoregionInfo => ({
  provider: "eea-biogeo", code, name, hierarchy: [], detail: null,
});

// Real coordinates, so a failure names a place rather than a number.
const VANCOUVER = [49.267, -123.165] as const;
const VICTORIA = [48.4284, -123.3656] as const;
const SEATTLE = [47.6062, -122.3321] as const;
const PORTLAND = [45.5152, -122.6784] as const;
const BEND = [44.0582, -121.3153] as const;
const MERRITT = [50.1113, -120.7862] as const;
const DUBLIN = [53.3498, -6.2603] as const;

describe("regionForSite — a live code refines the box", () => {
  it("matches a US point on the region's EPA codes", () => {
    expect(regionForSite(...SEATTLE, siteWith(epa("2", "Puget Lowland")))?.meta.id).toBe("pnw");
    expect(regionForSite(...PORTLAND, siteWith(epa("3", "Willamette Valley")))?.meta.id).toBe("pnw");
  });

  it("matches a Canadian point on the *same region's* CEC codes", () => {
    // The whole cross-border mechanism in one assertion: one region, two
    // classifications, and the answer tested against whichever one replied.
    expect(regionForSite(...VANCOUVER, siteWith(cec("7.1.7", "Strait of Georgia/Puget Lowland")))?.meta.id)
      .toBe("pnw");
    expect(regionForSite(...VICTORIA, siteWith(cec("7.1.7", "Strait of Georgia/Puget Lowland")))?.meta.id)
      .toBe("pnw");
  });

  it("refuses a point whose live code the region deliberately excludes", () => {
    // Bend is east of the crest and Merritt is the dry interior. Both sit
    // inside the coverage box and both must come back with no list — one
    // refused by the EPA's code, one by the CEC's. A region that answered here
    // would be recommending a maritime list for high desert.
    expect(regionForSite(...BEND, siteWith(epa("9", "Eastern Cascades Slopes and Foothills")))).toBeNull();
    expect(regionForSite(...MERRITT, siteWith(cec("10.1.1", "Thompson-Okanagan Plateau")))).toBeNull();
  });

  it("only compares codes from the provider that answered", () => {
    // `7.1.7` is a CEC code. Handed to the app as an EPA code it must not
    // match, or the two code spaces would bleed into each other — the EPA's
    // are bare numbers `1`–`84` and a collision is only a matter of time.
    expect(regionForSite(...VANCOUVER, siteWith(epa("7.1.7", "not a real EPA code")))).toBeNull();
  });
});

describe("regionForSite — the box decides when nothing else can", () => {
  it("still hands over the region when the lookup returned nothing", () => {
    // Offline, or a coastline point that hit no polygon. This is the case the
    // ecoregion plan asked to pin, and the one a reader meets most often.
    expect(regionForSite(...VANCOUVER, siteWith(null))?.meta.id).toBe("pnw");
    expect(regionForSite(...SEATTLE, siteWith(null))?.meta.id).toBe("pnw");
    expect(regionForSite(...DUBLIN, siteWith(null))?.meta.id).toBe("ireland");
  });

  it("behaves the same with no site at all", () => {
    expect(regionForSite(...VANCOUVER)?.meta.id).toBe("pnw");
    expect(regionForSite(...VANCOUVER, null)?.meta.id).toBe("pnw");
  });

  it("gives the box the benefit of the doubt where a code cannot", () => {
    // Bend without a live code *does* get the list: the box is all we have and
    // it says yes. Compare the refusal above — the difference between the two
    // is exactly what the live lookup buys, and why losing it silently (as the
    // router did for Vancouver) is worth a test of its own.
    expect(regionForSite(...BEND, siteWith(null))?.meta.id).toBe("pnw");
  });

  it("returns nothing for a place no region covers", () => {
    expect(regionForSite(21.03, 105.85, siteWith(null))).toBeNull(); // Hanoi
    expect(regionForSite(-33.87, 151.21, siteWith(null))).toBeNull(); // Sydney
  });
});

describe("regionForSite — Europe, where the codes are coarse", () => {
  it("separates two regions sharing one biogeographical code by their boxes", () => {
    // Ireland and Atlantic France are both `atlantic`, 700 km and one sea
    // apart. The code cannot tell them apart and is not asked to.
    expect(regionForSite(...DUBLIN, siteWith(eea("atlantic", "Atlantic")))?.meta.id).toBe("ireland");
    expect(regionForSite(48.8566, 2.3522, siteWith(eea("atlantic", "Atlantic")))?.meta.id)
      .toBe("france-atlantic");
  });

  it("refuses a French point whose code belongs to a different region", () => {
    // Marseille's own code is `mediterranean`; handed `alpine`, the
    // Mediterranean region must decline rather than answer anyway.
    expect(regionForSite(43.2965, 5.3698, siteWith(eea("alpine", "Alpine")))).toBeNull();
  });
});
