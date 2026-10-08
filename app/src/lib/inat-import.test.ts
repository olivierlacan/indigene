// Matching the gardener's own sightings against a spot's log — the rules that
// keep one photo from turning into two rows. Run against the real Pacific
// Northwest list, so a plant's id drifting from the registry fails here too.
import { describe, it, expect, beforeAll } from "vitest";
import { REGIONS } from "../data/regions";
import { loadPlants } from "./plants";
import { nativeSightings, sortSightings, type OwnSighting } from "./inat-import";
import type { Plant, Planting, SavedSpot } from "../types";

const pnw = REGIONS.find((r) => r.meta.id === "pnw")!;
let roster: Plant[];
beforeAll(async () => { roster = await loadPlants(pnw); });

/** A sighting matched by scientific name (the taxon id is deliberately unknown). */
function seen(id: number, taxonName: string, observedOn = "2026-05-14"): OwnSighting {
  return { id, uuid: null, taxonId: 900_000_000 + id, taxonName, observedOn, confirmed: false, cultivated: true, photo: null };
}
function row(plantId: string, observations: string[] = []): Planting {
  return { id: `p-${plantId}`, spotId: "s1", plantId, count: 1, planted: null, observations, createdAt: 0 };
}
const spot = { id: "s1", label: "Back yard" } as SavedSpot;

describe("nativeSightings", () => {
  it("pairs each unlinked sighting of a native with its plant, repeats included", () => {
    const out = nativeSightings(
      [seen(1, "Salix lasiandra"), seen(2, "Salix lasiandra"), seen(3, "Taraxacum officinale"), seen(4, "Salix lasiandra")],
      roster,
      ["4"]
    );
    expect(out.map((m) => [m.sighting.id, m.plant.id])).toEqual([
      [1, "salix-lasiandra"],
      [2, "salix-lasiandra"],
    ]);
  });
});

describe("sortSightings", () => {
  it("points a new sighting of a plant already in the log at that row", () => {
    const existing = row("salix-lasiandra");
    const { natives } = sortSightings([seen(1, "Salix lasiandra")], pnw, roster, spot, [existing]);
    expect(natives[0].planting).toBe(existing);
    expect(natives[0].inLog).toBe(false);
  });

  it("says which other spot a sighting is already linked to", () => {
    const { natives } = sortSightings(
      [seen(1, "Salix lasiandra"), seen(2, "Quercus garryana")],
      pnw, roster, spot, [], new Map([["1", "Front yard"]])
    );
    expect(natives.map((m) => [m.plant.id, m.linkedElsewhere, m.planting])).toEqual([
      ["salix-lasiandra", "Front yard", null],
      ["quercus-garryana", null, null],
    ]);
  });
});
