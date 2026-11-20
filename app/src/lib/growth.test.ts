// The growth charts on each region's page (`scripts/_growth.mjs`). They are
// counted from the data files' history, read as text with regexes — so the
// regexes are pinned against today's files, where the answer is known, and the
// summary against small histories, where it can be worked out by hand.
import { describe, expect, it } from "vitest";
import { SUPPORT } from "../data/wildlife";
import WILDLIFE_SRC from "../data/wildlife.ts?raw";
// @ts-expect-error — a plain .mjs build script, no type declarations.
import { plantIds, summarise, wildlifeByRegion } from "../../scripts/_growth.mjs";

const sources = import.meta.glob<string>("../data/plants.*.ts", { query: "?raw", import: "default", eager: true });
const modules = import.meta.glob<{ SEED_RAW: { id: string }[] }>("../data/plants.*.ts", { eager: true });

describe("plantIds", () => {
  it.each(Object.keys(sources))("finds every row of %s", (path) => {
    expect(plantIds(sources[path])).toEqual(modules[path].SEED_RAW.map((p) => p.id));
  });
});

describe("wildlifeByRegion", () => {
  it("finds every animal SUPPORT ties to each region", () => {
    const parsed = wildlifeByRegion(WILDLIFE_SRC);
    for (const [region, byPlant] of Object.entries(SUPPORT)) {
      const want = new Set(Object.values(byPlant).flat().map((l) => l.wildlifeId));
      expect([...(parsed.get(region) ?? [])].sort(), region).toEqual([...want].sort());
    }
    expect([...parsed.keys()].sort()).toEqual(Object.keys(SUPPORT).sort());
  });
});

describe("summarise", () => {
  const snap = (at: string, plants: Record<string, string[]>, wildlife: Record<string, string[]> = {}) => ({
    at,
    plants: new Map(Object.entries(plants)),
    wildlife: new Map(Object.entries(wildlife).map(([k, v]) => [k, new Set(v)])),
  });

  it("keeps one step a day, the day's last", () => {
    const { regions } = summarise([
      snap("2026-01-01T09:00Z", { pnw: ["a"] }),
      snap("2026-01-01T17:00Z", { pnw: ["a", "b"] }),
      snap("2026-01-02T09:00Z", { pnw: ["a", "b", "c"] }),
    ]);
    expect(regions.pnw).toEqual([
      ["2026-01-01T17:00Z", 2, 0],
      ["2026-01-02T09:00Z", 3, 0],
    ]);
  });
  it("skips a snapshot where nothing moved", () => {
    const { all } = summarise([
      snap("2026-01-01T09:00Z", { pnw: ["a"] }, { pnw: ["owl"] }),
      snap("2026-01-05T09:00Z", { pnw: ["a"] }, { pnw: ["owl"] }),
    ]);
    expect(all).toEqual([["2026-01-01T09:00Z", 1, 1, 1]]);
  });
  it("forgets a region that has left the app", () => {
    const { regions, all } = summarise([
      snap("2026-01-01T09:00Z", { pnw: ["a"], gone: ["x", "y"] }),
      snap("2026-01-02T09:00Z", { pnw: ["a", "b"] }),
    ]);
    expect(regions.gone).toBeUndefined();
    expect(all[0]).toEqual(["2026-01-01T09:00Z", 1, 0, 1]);
  });
  it("dates each row by its first appearance, and drops rows since removed", () => {
    const { added } = summarise([
      snap("2026-01-01T09:00Z", { pnw: ["a", "old"] }),
      snap("2026-01-02T09:00Z", { pnw: ["a", "b"] }),
    ]);
    expect(added.plants.pnw).toEqual({ a: "2026-01-01T09:00Z", b: "2026-01-02T09:00Z" });
  });
});
