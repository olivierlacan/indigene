import { describe, it, expect } from "vitest";
import { addressParam } from "./routes";

describe("addressParam", () => {
  it("reads the query a link wrote into the hash", () => {
    expect(addressParam("region", "#/plants/x?region=pnw", "")).toBe("pnw");
  });

  it("reads the search string once the page is on its canonical path", () => {
    expect(addressParam("region", "", "?region=pnw")).toBe("pnw");
    expect(addressParam("region", "#spot", "?region=pnw")).toBe("pnw");
  });

  it("ignores a leftover search string while the hash is the route", () => {
    expect(addressParam("add", "#/saved/abc", "?add=oak")).toBeNull();
  });
});
