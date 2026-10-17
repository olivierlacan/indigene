// A region's plants stay on its own side of a border. Each row is a real
// place: the region it should get, or none. The point of the French rows is
// the box: Atlantic France's has to take in Brighton to take in Dunkirk.
import { describe, it, expect } from "vitest";
import { regionsForCoords } from "../data/regions";
import { onForeignLand } from "./borders";

const ids = (lat: number, lon: number) => regionsForCoords(lat, lon).map((r) => r.meta.id);

describe("borders", () => {
  it.each([
    // [place, a region it must not get, lat, lon]
    ["Brighton", "france-atlantic", 50.82, -0.14],
    ["just off Brighton seafront, outside every drawn coast", "france-atlantic", 50.805, -0.14],
    ["Plymouth", "france-atlantic", 50.37, -4.14],
    ["Brussels", "france-atlantic", 50.85, 4.35],
    ["Tournai", "france-atlantic", 50.61, 3.39],
    ["San Sebastián", "france-atlantic", 43.32, -1.98],
    ["Kehl, across the Rhine from Strasbourg", "france-continental", 48.57, 7.82],
    ["Basel", "france-continental", 47.56, 7.59],
    ["Geneva", "france-alpine", 46.2, 6.14],
    ["Turin", "france-alpine", 45.07, 7.69],
    ["Tijuana", "ca-south-coast", 32.52, -117.04],
  ])("%s is not offered %s", (_, region, lat, lon) => {
    expect(ids(lat, lon)).not.toContain(region);
  });

  it.each([
    ["Dunkirk", "france-atlantic", 51.03, 2.38],
    ["Calais beach", "france-atlantic", 50.97, 1.85],
    ["Rennes", "france-atlantic", 48.11, -1.68],
    ["Hendaye, on the Spanish border", "france-atlantic", 43.36, -1.77],
    ["Strasbourg, on the Rhine", "france-continental", 48.58, 7.75],
    ["Annemasse, next to Geneva", "france-alpine", 46.19, 6.24],
    ["Menton, next to Italy", "france-mediterranean", 43.78, 7.5],
    ["Belfast", "ireland", 54.6, -5.93],
    ["San Diego", "ca-south-coast", 32.72, -117.16],
  ])("%s still gets %s", (_, region, lat, lon) => {
    expect(ids(lat, lon)).toContain(region);
  });

  it("leaves a region with no foreign land in its box alone", () => {
    expect(onForeignLand("central-texas", 30.27, -97.74)).toBe(false);
  });
});
