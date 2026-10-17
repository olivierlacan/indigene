// The Soil pH tile's word for a plant's range.
import { describe, it, expect } from "vitest";
import { phWord } from "./stat-card";

describe("phWord", () => {
  it("calls a range topping out at 6.5 acidic", () => {
    expect(phWord(4.5, 6.5)).toBe("acidic");
  });

  it("calls a range starting at 7 alkaline", () => {
    expect(phWord(7, 8.5)).toBe("alkaline");
  });

  it("keeps a range inside 6.5–7 around neutral", () => {
    expect(phWord(6.5, 7)).toBe("around neutral");
    expect(phWord(6, 7.5)).toBe("around neutral");
  });

  it("calls a range spanning both sides acidic to alkaline", () => {
    expect(phWord(5.5, 7.5)).toBe("acidic to alkaline");
  });
});
