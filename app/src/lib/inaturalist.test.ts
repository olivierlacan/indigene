// Which iNaturalist taxon ids the registry reconcile keeps from Wikidata. The
// cases are the four stale ids a reconcile run once wrote unchecked.
import { describe, it, expect } from "vitest";
import { inatIdHolds } from "./inaturalist";

describe("inatIdHolds", () => {
  it("keeps an active species for a binomial", () => {
    expect(inatIdHolds({ id: 63512, name: "Acer palmatum", rank: "species", is_active: true }, "Acer palmatum")).toBe(true);
  });

  it("drops a taxon iNaturalist has retired", () => {
    expect(inatIdHolds({ id: 511156, name: "Aster microcephalus", rank: "species", is_active: false }, "Aster microcephalus")).toBe(false);
  });

  it("drops a variety where the name asks for a species", () => {
    const row = { id: 437712, name: "Lilium speciosum rubrum", rank: "variety", is_active: true };
    expect(inatIdHolds(row, "Lilium speciosum")).toBe(false);
  });

  it("keeps an active species filed under another accepted name", () => {
    const row = { id: 1, name: "Symphyotrichum novae-angliae", rank: "species", is_active: true };
    expect(inatIdHolds(row, "Aster novae-angliae")).toBe(true);
  });

  it("drops a missing or malformed record", () => {
    expect(inatIdHolds(undefined, "Acer palmatum")).toBe(false);
    expect(inatIdHolds({ name: "Acer palmatum", rank: "species" }, "Acer palmatum")).toBe(false);
  });
});
