// The ecoregion lookup, without the network.
//
// `docs/ecoregion-plan.md` asked for this under "Testing" — *"unit-test the
// L3-code→region mapping with a mocked ArcGIS response so CI stays offline and
// deterministic"* — and the parsers were split out of the fetches for exactly
// that reason and then never tested. This is that.
//
// The mocked payloads below are trimmed copies of what each service really
// returns; the field names are the ones `data/sources/*/probe.json` recorded
// against the live endpoints. A test here proves we read a reply correctly. It
// cannot prove the reply still looks like this — that is what the probes and
// `npm run selection:check` are for, and they need the network on purpose.
import { describe, it, expect } from "vitest";
import {
  inConus,
  inEurope,
  inNorthAmerica,
  inResolveCoverage,
  parseEcoregion,
  parseEcoregionCEC,
  parseEcoregionEEA,
  parseEcoregionResolve,
  zoneFromMinTemp,
} from "./site";

describe("parseEcoregion (EPA Omernik)", () => {
  it("reads the Level III code and name, which are what selection compares", () => {
    const info = parseEcoregion({
      features: [
        {
          attributes: {
            US_L3CODE: "3",
            US_L3NAME: "Willamette Valley",
            US_L4CODE: "3b",
            US_L4NAME: "Prairie Terraces",
            NA_L1NAME: "MARINE WEST COAST FOREST",
            NA_L2NAME: "MARINE WEST COAST FOREST",
          },
        },
      ],
    });
    expect(info).toMatchObject({
      provider: "epa-omernik",
      code: "3",
      name: "Willamette Valley",
    });
  });

  it("title-cases the Level I/II roll-ups, which arrive shouting", () => {
    const info = parseEcoregion({
      features: [
        {
          attributes: {
            US_L3CODE: "2",
            US_L3NAME: "Puget Lowland",
            NA_L1NAME: "MARINE WEST COAST FOREST",
          },
        },
      ],
    });
    expect(info?.hierarchy.some((h) => h === h.toUpperCase() && h.length > 3)).toBe(false);
  });

  it("treats a reply with no Level III as no answer, not as a partial one", () => {
    // A coastline point that intersects no polygon comes back like this, and
    // the caller has to see null so the coverage box can decide instead.
    expect(parseEcoregion({ features: [] })).toBeNull();
    expect(parseEcoregion({ features: [{ attributes: { US_L4CODE: "3b" } }] })).toBeNull();
    expect(parseEcoregion(null)).toBeNull();
  });
});

describe("parseEcoregionCEC", () => {
  it("reads the nested Level III code — a different code space from the EPA's", () => {
    const info = parseEcoregionCEC({
      features: [
        {
          attributes: {
            LEVEL3: "7.1.7",
            NameL3_En: "Strait of Georgia/Puget Lowland",
            NameL3_Fr: "Détroit de Georgia et basses terres de Puget",
            NameL1_En: "Marine West Coast Forest",
            NameL2_En: "Marine West Coast Forest",
          },
        },
      ],
    });
    expect(info).toMatchObject({
      provider: "cec-na",
      code: "7.1.7",
      name: "Strait of Georgia/Puget Lowland",
    });
  });

  it("returns null for a point with no polygon", () => {
    // Downtown Vancouver and Halifax harbour both do this at 1:10,000,000.
    expect(parseEcoregionCEC({ features: [] })).toBeNull();
    expect(parseEcoregionCEC({ features: [{ attributes: { NameL3_En: "Cascades" } }] })).toBeNull();
  });
});

describe("parseEcoregionEEA", () => {
  it("canonicalizes the service's spelling to the slug regions declare", () => {
    expect(parseEcoregionEEA({ features: [{ attributes: { short_name: "mediterranean" } }] }))
      .toMatchObject({ provider: "eea-biogeo", code: "mediterranean" });
  });

  it("finds the region even if the field it lives in is renamed", () => {
    // The fallback scan exists so a field rename degrades instead of breaking.
    expect(parseEcoregionEEA({ features: [{ attributes: { name: "Atlantic" } }] }))
      .toMatchObject({ code: "atlantic" });
  });

  it("returns null when nothing in the reply names a region", () => {
    expect(parseEcoregionEEA({ features: [{ attributes: { OBJECTID: 12 } }] })).toBeNull();
  });
});

describe("parseEcoregionResolve", () => {
  it("uses the numeric ECO_ID as the code, however the name is spelled", () => {
    expect(
      parseEcoregionResolve({
        features: [{ attributes: { ECO_ID: 194, ECO_NAME: "Sydney Basin", REALM: "Australasia" } }],
      }),
    ).toMatchObject({ provider: "resolve-2017", code: "194", name: "Sydney Basin" });
  });

  it("rejects ECO_ID 0, the dataset's rock-and-ice filler", () => {
    expect(
      parseEcoregionResolve({ features: [{ attributes: { ECO_ID: 0, ECO_NAME: "Rock and Ice" } }] }),
    ).toBeNull();
  });
});

describe("which service gets asked", () => {
  // **The bug this pins.** `inConus` is a rectangle, and its top-left corner
  // takes in southern British Columbia. That is not a mistake to fix here — a
  // rectangle is all a cheap pre-check can be — but it means the router cannot
  // treat "inside the box" as "the EPA will answer". It has to ask, and fall
  // through to the CEC on null. If this assertion ever flips, the fall-through
  // in `fetchEcoregion` looks redundant and somebody will delete it.
  it("puts Vancouver and Victoria inside the crude US rectangle", () => {
    expect(inConus(49.267, -123.165)).toBe(true); // Vancouver
    expect(inConus(48.4284, -123.3656)).toBe(true); // Victoria
  });

  it("covers the whole continent with the CEC's gate, including well past the border", () => {
    expect(inNorthAmerica(49.267, -123.165)).toBe(true); // Vancouver
    expect(inNorthAmerica(50.02, -125.24)).toBe(true); // Campbell River
    expect(inNorthAmerica(45.5152, -122.6784)).toBe(true); // Portland, still North America
    expect(inNorthAmerica(48.8566, 2.3522)).toBe(false); // Paris
  });

  it("keeps Europe and North America apart", () => {
    expect(inEurope(48.8566, 2.3522)).toBe(true); // Paris
    expect(inEurope(53.3498, -6.2603)).toBe(true); // Dublin
    expect(inEurope(45.5152, -122.6784)).toBe(false); // Portland
  });

  it("asks RESOLVE only south of the equator", () => {
    expect(inResolveCoverage(-33.87)).toBe(true); // Sydney
    expect(inResolveCoverage(49.267)).toBe(false); // Vancouver
    expect(inResolveCoverage(0.5)).toBe(false);
  });
});

describe("zoneFromMinTemp", () => {
  it("maps a minimum temperature to the USDA zone the region pages quote", () => {
    // USDA: 10°F per zone, split a/b at the midpoint. 8a is 10–15°F, 8b 15–20.
    expect(zoneFromMinTemp(12)).toBe("8a");
    expect(zoneFromMinTemp(16)).toBe("8b");
    expect(zoneFromMinTemp(20)).toBe("9a");
    expect(zoneFromMinTemp(0)).toBe("7a");
    expect(zoneFromMinTemp(5)).toBe("7b");
  });

  it("clamps the zone number to the 1–13 scale", () => {
    // Only the number is clamped — the a/b half keeps counting past the ends,
    // so an absurd input gives a real zone number with an arbitrary half. No
    // recorded extreme minimum comes near either end, so this is a note rather
    // than a defect; the contract worth holding is that the number stays on the
    // scale.
    expect(zoneFromMinTemp(-80)).toMatch(/^1[ab]$/);
    expect(zoneFromMinTemp(200)).toMatch(/^13[ab]$/);
    expect(zoneFromMinTemp(-60)).toBe("1a");
    expect(zoneFromMinTemp(65)).toBe("13b");
  });
});
