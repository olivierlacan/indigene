import { describe, it, expect } from "vitest";
import { sortWildlife, wildlifeQuery, wildlifeView } from "./wildlife-view";
import type { WildlifeIndexRow } from "./wildlife";

const row = (id: string, plantCount: number): WildlifeIndexRow =>
  ({ wildlife: { id, common: id }, plantCount, regionIds: [], sole: false }) as unknown as WildlifeIndexRow;

describe("sortWildlife", () => {
  const order = (rows: WildlifeIndexRow[], sort: "name" | "plants"): string[] =>
    sortWildlife(rows, sort, (r) => r.wildlife.common, "en").map((r) => r.wildlife.id);

  it("puts the animal most plants support first, ties by name", () => {
    expect(order([row("wren", 2), row("bee", 9), row("ant", 2)], "plants")).toEqual(["bee", "ant", "wren"]);
  });

  it("sorts by name otherwise", () => {
    expect(order([row("wren", 2), row("bee", 9), row("ant", 2)], "name")).toEqual(["ant", "bee", "wren"]);
  });
});

describe("wildlifeView", () => {
  it("reads the default from an empty address, and writes it back as nothing", () => {
    const view = wildlifeView(new URLSearchParams(""));
    expect(view).toEqual({ sort: "name", grouped: false, sole: false, atRisk: false });
    expect(wildlifeQuery(view)).toBe("");
  });

  it("round-trips every control", () => {
    for (const sole of [true, false])
      for (const atRisk of [true, false]) {
        const view = { sort: "plants", grouped: true, sole, atRisk } as const;
        expect(wildlifeView(new URLSearchParams(wildlifeQuery(view)))).toEqual(view);
      }
  });

  it("ignores values it doesn't know", () => {
    expect(wildlifeView(new URLSearchParams("sort=size&group=x&only=pioneers")))
      .toEqual({ sort: "name", grouped: false, sole: false, atRisk: false });
  });
});
