import { describe, expect, it } from "vitest";
import { auditInvasives, rowsInSeason } from "./invasives";
import type { WantedRow } from "./invasives";
import type { Invasive, RemovalWindow } from "../types";

function row(id: string, window?: RemovalWindow): WantedRow {
  const invasive: Invasive = {
    id,
    common: id,
    latin: id,
    form: "perennial",
    marks: [],
    removal: { steps: [], dispose: "", basis: "", window },
  };
  return { rank: 1, invasive, link: { invasiveId: id, basis: "" }, level: null, sightings: null };
}

const source = { name: "A page", url: "https://example.org/" };

describe("rowsInSeason", () => {
  it("keeps only plants whose window includes the season, in list order", () => {
    const rows = [
      row("a", { seasons: ["spring", "summer"], cue: "before it flowers", source }),
      row("b", { seasons: ["fall"], cue: "after leaf fall", source }),
      row("c", { seasons: ["spring"], cue: "as it bolts", source }),
    ];
    expect(rowsInSeason(rows, "spring").map((r) => r.invasive.id)).toEqual(["a", "c"]);
    expect(rowsInSeason(rows, "winter")).toEqual([]);
  });

  it("lists an any-time plant in every season", () => {
    const rows = [row("ivy", { seasons: [], anyTime: true, cue: "any time", source })];
    expect(rowsInSeason(rows, "winter").map((r) => r.invasive.id)).toEqual(["ivy"]);
  });

  it("never guesses a window for a plant with none", () => {
    expect(rowsInSeason([row("unsourced")], "spring")).toEqual([]);
  });
});

describe("auditInvasives", () => {
  it("finds the catalog sound, removal windows included", () => {
    expect(auditInvasives()).toEqual([]);
  });
});
