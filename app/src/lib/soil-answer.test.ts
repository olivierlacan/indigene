import { describe, expect, it } from "vitest";
import { soilAnswer } from "./soil-answer";

describe("soilAnswer", () => {
  it("keeps the reader's moisture answer", () => {
    expect(soilAnswer("wet", null)?.moisture).toBe("wet");
  });

  it("stores nothing when the reader kept the map's guess", () => {
    expect(soilAnswer(null, null)).toBeNull();
  });
});
