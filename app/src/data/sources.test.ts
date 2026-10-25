// A species-record link goes to a database that has the animal.
import { describe, it, expect } from "vitest";
import { speciesRecordUrl } from "./sources";
import { WILDLIFE } from "./wildlife";

const byId = (id: string) => WILDLIFE.find((w) => w.id === id)!;

describe("speciesRecordUrl", () => {
  it("links a North American butterfly to BAMONA", () => {
    expect(speciesRecordUrl(byId("monarch"))?.name).toBe("Butterflies and Moths of North America");
  });
  it("links an American bird to All About Birds", () => {
    expect(speciesRecordUrl(byId("cedar-waxwing"))?.name).toBe("Cornell Lab — All About Birds");
  });
  it("keeps the link for a North American animal that cites someone else", () => {
    expect(speciesRecordUrl(byId("karner-blue"))?.name).toBe("Butterflies and Moths of North America");
  });
  it("gives no link for an animal tied only outside North America", () => {
    expect(speciesRecordUrl(byId("great-purple-emperor"))).toBeNull();
    expect(speciesRecordUrl(byId("brimstone"))).toBeNull();
    expect(speciesRecordUrl(byId("tui"))).toBeNull();
  });
});
