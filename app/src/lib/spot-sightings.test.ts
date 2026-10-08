import { describe, expect, it } from "vitest";
import {
  animalFor,
  buildCountsUrl,
  buildRecentUrl,
  foldCounts,
  foldSightings,
  roundedPoint,
  taxaFor,
  taxonFor,
} from "./spot-sightings";

const taxa = new Map([
  [52775, "bumble-bees"], // a genus: Bombus
  [48662, "monarch"], // a species
]);

const photo = {
  id: 1,
  url: "https://inaturalist-open-data.s3.amazonaws.com/photos/1/square.jpg",
  license_code: "cc-by",
  attribution: "(c) someone, some rights reserved (CC BY)",
};

function row(id: number, taxon: { id: number; ancestor_ids?: number[] }, at: [number, number] = [47.68, -122.35]) {
  return {
    id,
    taxon,
    user: { login: "someone" },
    geojson: { coordinates: [at[1], at[0]] },
    observed_on: "2026-06-01",
    photos: [photo],
  };
}

describe("roundedPoint", () => {
  it("sends about a kilometre, never the spot", () => {
    expect(roundedPoint(47.68314, -122.35112)).toEqual({ lat: 47.68, lon: -122.35 });
    expect(roundedPoint(47.6851, -122.3549)).toEqual({ lat: 47.69, lon: -122.35 });
  });
});

describe("animalFor", () => {
  it("matches the taxon asked about", () => {
    expect(animalFor({ id: 48662 }, taxa)).toBe("monarch");
  });
  it("walks back to a genus asked about", () => {
    expect(animalFor({ id: 121519, ancestor_ids: [48460, 1, 47158, 52775, 121519] }, taxa)).toBe("bumble-bees");
  });
  it("is null for anything else", () => {
    expect(animalFor({ id: 6930, ancestor_ids: [48460, 1, 3, 6930] }, taxa)).toBeNull();
    expect(animalFor(null, taxa)).toBeNull();
  });
});

describe("the requests", () => {
  const q = { lat: 47.68314, lon: -122.35112, taxonIds: [48662, 52775] };
  it("carry the rounded point and the taxa, nothing finer", () => {
    const url = new URL(buildRecentUrl({ ...q, since: "2024-03-01" }));
    expect(url.searchParams.get("lat")).toBe("47.68");
    expect(url.searchParams.get("lng")).toBe("-122.35");
    expect(url.searchParams.get("taxon_id")).toBe("48662,52775");
    expect(url.searchParams.get("d1")).toBe("2024-03-01");
    expect(url.searchParams.get("quality_grade")).toBe("research");
    expect(url.toString()).not.toContain("47.683");
  });
  it("never send a place with a username", () => {
    const url = new URL(buildRecentUrl({ ...q, login: "gardener" }));
    expect(url.searchParams.get("user_login")).toBe("gardener");
    expect(url.searchParams.has("lat")).toBe(false);
    expect(url.searchParams.has("lng")).toBe(false);
  });
  it("count by species", () => {
    expect(buildCountsUrl(q)).toContain("/observations/species_counts?");
  });
});

describe("folding answers", () => {
  it("sums a genus's species into one animal", () => {
    const counts = foldCounts(
      [
        { count: 5, taxon: { id: 1, ancestor_ids: [52775, 1] } },
        { count: 2, taxon: { id: 2, ancestor_ids: [52775, 2] } },
        { count: 9, taxon: { id: 48662 } },
        { count: 4, taxon: { id: 6930 } },
      ],
      taxa
    );
    expect(counts).toEqual({ "bumble-bees": 7, monarch: 9 });
  });
  it("keeps a few of each animal, tagged", () => {
    const rows = [1, 2, 3, 4].map((i) => row(i, { id: 48662 })).concat(row(5, { id: 9, ancestor_ids: [52775, 9] }));
    const out = foldSightings(rows, taxa, { lat: 47.68, lon: -122.35 }, 2);
    expect(out.map((o) => [o.id, o.wildlifeId])).toEqual([
      [1, "monarch"],
      [2, "monarch"],
      [5, "bumble-bees"],
    ]);
  });
});

describe("the pinned taxa", () => {
  it("cover the catalog's best-known animals", () => {
    expect(taxonFor("monarch")).toBe(48662);
    expect(taxaFor(["monarch", "not-an-animal"]).size).toBe(1);
  });
});
