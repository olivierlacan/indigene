// Which planted natives might have drawn an animal in — the line under a
// gardener's own sighting. Read from the real tie table, so a tie that moves
// fails here.
import { describe, expect, it } from "vitest";
import { plantsHelping } from "./spot-value";

describe("plantsHelping", () => {
  it("names the plant a monarch can't do without, as a host", () => {
    const out = plantsHelping("monarch", ["cercis-canadensis", "asclepias-tuberosa"], "mid-atlantic");
    expect(out).toEqual([{ plantId: "asclepias-tuberosa", support: "host", sole: true }]);
  });
  it("puts a host before a nectar stop, whatever order they were logged in", () => {
    const out = plantsHelping("hummingbird-clearwing", ["monarda-fistulosa", "viburnum-dentatum"], "mid-atlantic");
    expect(out.map((h) => [h.plantId, h.support])).toEqual([
      ["viburnum-dentatum", "host"],
      ["monarda-fistulosa", "nectar"],
    ]);
  });
  it("is empty for a plant that does nothing for the animal", () => {
    expect(plantsHelping("cedar-waxwing", ["asclepias-tuberosa"], "mid-atlantic")).toEqual([]);
  });
});
