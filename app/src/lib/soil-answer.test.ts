import { describe, expect, it } from "vitest";
import { feelOf, isSoilFeel, soilAnswer } from "./soil-answer";
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
