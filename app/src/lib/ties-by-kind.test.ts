import { describe, expect, it } from "vitest";
import { SUPPORT_RANK, tiesByKind, wildlifeForPlant } from "./wildlife";

// Yaupon holly is on two region lists, and the songbirds use it differently in
// each: berries in Florida, cover in Texas. Both are true, so both show.
const YAUPON = [
  { regionId: "florida-central", plantId: "ilex-vomitoria" },
  { regionId: "central-texas", plantId: "ilex-vomitoria" },
];

describe("tiesByKind", () => {
  it("lists an animal under every way it uses the plant", () => {
    const groups = tiesByKind(YAUPON);
    const kindsFor = (id: string) => groups.filter((g) => g.ties.some((t) => t.wildlife.id === id)).map((g) => g.support);
    expect(kindsFor("berry-songbirds")).toEqual(["berries", "shelter"]);
  });

  it("orders the groups strongest first and never leaves one empty", () => {
    const groups = tiesByKind(YAUPON);
    const ranks = groups.map((g) => SUPPORT_RANK[g.support]);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(groups.every((g) => g.ties.length > 0)).toBe(true);
  });

  it("shows an animal once per kind, however many regions list it", () => {
    for (const { support, ties } of tiesByKind(YAUPON)) {
      const ids = ties.map((t) => t.wildlife.id);
      expect(new Set(ids).size, support).toBe(ids.length);
    }
  });

  it("puts a make-or-break tie first in its group", () => {
    // Coontie is the atala's only caterpillar food.
    const scope = [{ regionId: "florida-south", plantId: "zamia-integrifolia" }];
    expect(wildlifeForPlant("florida-south", "zamia-integrifolia").some((x) => x.link.reliance === "sole")).toBe(true);
    const host = tiesByKind(scope).find((g) => g.support === "host");
    expect(host?.ties[0].sole).toBe(true);
  });

  it("is empty for a plant with no ties", () => {
    expect(tiesByKind([{ regionId: "florida-central", plantId: "no-such-plant" }])).toEqual([]);
  });
});
