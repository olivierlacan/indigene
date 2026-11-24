import { describe, it, expect } from "vitest";
import { addressParam, canonicalPath, parseRoute, shareablePaths } from "./routes";
import { techniqueBySlug } from "./planting";
import { GUIDES } from "./howto";

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

// Addresses that are already out in the world: on every plant page's "How to
// grow more", in the release notes, in links people have sent. The Planting
// page has been rearranged around them once and will be again; these must
// never move. Written out, not read from the catalog, so renaming a slug
// there fails here.
describe("planting addresses that must keep working", () => {
  const TECHNIQUES = [
    "direct-sowing", "fresh-sowing", "cold-stratification", "scarification", "surface-sowing",
    "double-dormancy", "division", "softwood-cuttings", "semi-hardwood-cuttings", "hardwood-cuttings",
    "layering", "suckers", "runners", "root-cuttings", "spores",
  ];

  it("keeps the index and every technique where it was", () => {
    expect(canonicalPath("planting")).toBe("planting");
    for (const slug of TECHNIQUES) {
      expect(canonicalPath("planting", slug), slug).toBe(`planting/${slug}`);
      expect(shareablePaths()).toContain(`planting/${slug}`);
      expect(parseRoute(`planting/${slug}`)).toEqual({ step: "planting", param: slug });
    }
  });

  it("lets no how-to guide take a technique's address", () => {
    for (const guide of GUIDES) {
      if (guide.home === "planting") expect(techniqueBySlug(guide.slug), guide.slug).toBeNull();
    }
  });

  it("keeps the pages the Planting page now gathers", () => {
    for (const path of ["removing", "kill-your-lawn", "volunteer"]) expect(canonicalPath(path)).toBe(path);
  });
});

// `plants/essential` shares the plants namespace with every plant's slug, so a
// plant named "essential" would make the page unreachable.
describe("the essential-plants page", () => {
  it("has an address, alone and at a region", () => {
    expect(canonicalPath("plants", "essential")).toBe("plants/essential");
    expect(canonicalPath("plants", "essential/pnw")).toBe("plants/essential/pnw");
    expect(shareablePaths()).toContain("plants/essential");
    expect(shareablePaths()).toContain("plants/essential/pnw");
  });

  it("refuses a region that doesn't exist", () => {
    expect(canonicalPath("plants", "essential/atlantis")).toBeNull();
  });

  it("is not a plant's slug", () => {
    const plantPaths = shareablePaths().filter((p) => /^plants\/[^/]+$/.test(p));
    expect(plantPaths.filter((p) => p === "plants/essential")).toHaveLength(1);
  });
});
