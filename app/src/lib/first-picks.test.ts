// "Plant these first": one per genus, essential plants first, in the list's
// own order, and never a poor fit.
import { describe, it, expect } from "vitest";
import { firstPicks, missingEssentials, roomCap, roomOf, FIRST_PICKS } from "./first-picks";
import type { Ranked } from "./ranking";
import type { Plant } from "../types";

function r(latin: string, keystone: boolean, match: Ranked["match"] = "good"): Ranked {
  const plant = { id: latin.toLowerCase().replace(/\s+/g, "-"), latin, keystone } as unknown as Plant;
  return { plant, ecoScore: 0, fit: 1, score: 0, match, reasons: [] };
}
const latins = (rs: Ranked[]) => rs.map((x) => x.plant.latin);

describe("firstPicks", () => {
  it("takes one plant per genus, the first the list ranks", () => {
    const list = [
      r("Salix scouleriana", true),
      r("Salix sitchensis", true),
      r("Salix hookeriana", true),
      r("Prunus emarginata", true),
      r("Acer circinatum", true),
    ];
    expect(latins(firstPicks(list))).toEqual(["Salix scouleriana", "Prunus emarginata", "Acer circinatum"]);
  });

  it("puts essential plants ahead of better-ranked ordinary ones", () => {
    const list = [r("Mahonia aquifolium", false), r("Quercus garryana", true), r("Gaultheria shallon", false)];
    expect(latins(firstPicks(list))[0]).toBe("Quercus garryana");
  });

  it("fills with other plants, still one per genus, when essentials run out", () => {
    const list = [
      r("Salix scouleriana", true),
      r("Salix sitchensis", false),
      r("Ribes sanguineum", false),
      r("Ribes lacustre", false),
      r("Holodiscus discolor", false),
      r("Rosa nutkana", false),
    ];
    expect(latins(firstPicks(list))).toEqual(["Salix scouleriana", "Ribes sanguineum", "Holodiscus discolor", "Rosa nutkana"]);
  });

  it("never picks a poor fit, and stops at the limit", () => {
    const list = [r("Quercus garryana", true, "poor"), ...["A a", "B b", "C c", "D d", "E e"].map((l) => r(l, true, "ok"))];
    const picks = firstPicks(list);
    expect(picks).toHaveLength(FIRST_PICKS);
    expect(latins(picks)).not.toContain("Quercus garryana");
  });

  it("gives nothing for an empty list", () => {
    expect(firstPicks([])).toEqual([]);
  });
});

describe("missingEssentials", () => {
  const list = [
    r("Salix scouleriana", true),
    r("Prunus emarginata", true),
    r("Mahonia aquifolium", false),
    r("Acer circinatum", true),
  ];

  it("skips a genus already planted, whichever species it was", () => {
    expect(latins(missingEssentials(list, ["Salix sitchensis"]))).toEqual(["Prunus emarginata", "Acer circinatum"]);
  });

  it("offers essentials only, and nothing once they are all here", () => {
    expect(latins(missingEssentials(list, []))).not.toContain("Mahonia aquifolium");
    expect(missingEssentials(list, ["Salix lasiandra", "Prunus virginiana", "Acer macrophyllum"])).toEqual([]);
  });
});

describe("rooms", () => {
  const feet = [3, 6, 10, 15, 25, 40, 60].map((ft) => ({ ft }));
  const metres = [1, 2, 3, 5, 8, 12, 20].map((m) => ({ ft: m * 3.28084 }));

  it("sets the spread cap to a rung of the filter's own ladder", () => {
    expect(roomCap("small", feet)).toBe(15);
    expect(roomCap("medium", feet)).toBe(25);
    expect(roomCap("large", feet)).toBeNull();
    expect(roomCap("small", metres)).toBeCloseTo(5 * 3.28084);
    expect(roomCap("medium", metres)).toBeCloseTo(8 * 3.28084);
  });

  it("reads a cap back as its room, and a hand-set cap as none", () => {
    expect(roomOf(15, feet)).toBe("small");
    expect(roomOf(null, feet)).toBe("large");
    expect(roomOf(6, feet)).toBeNull();
  });
});
