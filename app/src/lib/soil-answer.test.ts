import { describe, expect, it } from "vitest";
import { feelOf, isSoilFeel, moistureForFeel, soilAnswer } from "./soil-answer";
import { rankPlants, DEFAULT_WEIGHTS, NO_FILTERS } from "./ranking";
import { loadPlants } from "./plants";
import { REGIONS } from "../data/regions";
import type { SiteData } from "../types";

const mapSays = (texture: string) => ({ soil: { texture } }) as unknown as SiteData;

describe("soilAnswer", () => {
  it("keeps the reader's moisture answer", () => {
    expect(soilAnswer("wet", null)?.moisture).toBe("wet");
  });

  it("stores nothing when the reader kept the map's guess", () => {
    expect(soilAnswer(null, null)).toBeNull();
  });

  it("keeps the reader's soil feel over the map's texture", () => {
    expect(soilAnswer("mesic", mapSays("sandy loam"), "clay")?.texture).toBe("clay");
  });

  it("falls back to the map's texture when the reader didn't say", () => {
    expect(soilAnswer("mesic", mapSays("silt loam"))?.texture).toBe("silt loam");
  });
});

describe("feelOf", () => {
  it("reads a map class as the feel it comes closest to", () => {
    expect(feelOf("loamy sand")).toBe("sand");
    expect(feelOf("silty clay")).toBe("clay");
    expect(feelOf("silt loam")).toBe("loam");
  });

  it("leaves silt and missing readings unanswered", () => {
    expect(feelOf("silt")).toBeNull();
    expect(feelOf(null)).toBeNull();
  });
});

describe("isSoilFeel", () => {
  it("tells a reader's answer from a map class", () => {
    expect(isSoilFeel("clay")).toBe(true);
    expect(isSoilFeel("silty clay")).toBe(false);
  });
});

describe("moistureForFeel", () => {
  it("reads sand as dry, loam as evenly moist, clay as wet", () => {
    expect(moistureForFeel("sand")).toBe("dry");
    expect(moistureForFeel("loam")).toBe("mesic");
    expect(moistureForFeel("clay")).toBe("wet");
  });

  it("moves the ranked list: clay and sand put different plants first", async () => {
    const pnw = REGIONS.find((r) => r.meta.id === "pnw")!;
    const plants = await loadPlants(pnw);
    const top = (feel: "sand" | "clay") =>
      rankPlants(plants, { site: null, sun: null, weights: DEFAULT_WEIGHTS, filters: NO_FILTERS, moistureOverride: moistureForFeel(feel) })
        .slice(0, 10).map((r) => r.plant.id);
    expect(top("clay")).not.toEqual(top("sand"));
  });
});
