// The registry's resolver and its outbound links.
//
// `docs/native-plant-registry.md` describes this module as *"pure logic, data-
// free, runs in browser and Node"* — which is exactly the shape a unit test
// wants, and the reason the tests here build their own three-entry index
// instead of loading the real one. `npm run registry:check` audits the real
// 420-taxon registry; this pins the rules that audit relies on.
//
// The resolver's job is to be *careful*: a wrong match here sends a reader to
// the wrong plant's page on Kew or iNaturalist, under our name. So the cases
// below are mostly about it declining — an ambiguous alias, a cultivar, a name
// nobody has.
import { describe, it, expect } from "vitest";
import type { RegistryEntry } from "../types";
import { buildIndex, deepLinks, normalizeName, resolveName } from "./registry-core";

// `RegistryEntry.aliases` is documented as *already* normalized — lowercased
// and single-spaced — because `scripts/build-registry.mjs` writes it that way
// and `buildIndex` indexes it verbatim. A fixture that ignores that would test
// a registry we never build, so this builds the aliases the same way the
// generator does, from the display names.
function entry(
  partial: Partial<RegistryEntry> & { scientificName: string },
): RegistryEntry {
  const commonNames = partial.commonNames ?? [];
  return {
    primaryId: null,
    family: "Fagaceae",
    form: "tree",
    rank: "species",
    keystone: false,
    cultivarOf: null,
    regions: [],
    commonNames,
    aliases: [...commonNames, partial.scientificName].map(normalizeName),
    identifiers: {},
    ...partial,
    scientificName: partial.scientificName,
  } as RegistryEntry;
}

const GARRY = entry({
  scientificName: "Quercus garryana",
  commonNames: ["Oregon White Oak", "Garry Oak"],
  identifiers: { ipni: "295829-1", gbif: "2879737", inat: "54835" },
});
const SITKA = entry({ scientificName: "Picea sitchensis", commonNames: ["Sitka Spruce"] });
// Two plants that really do share a common name, which is why the resolver has
// an "ambiguous" answer at all.
const MAY_A = entry({ scientificName: "Crataegus monogyna", commonNames: ["Mayflower"] });
const MAY_B = entry({ scientificName: "Epigaea repens", commonNames: ["Mayflower"] });

const index = buildIndex([GARRY, SITKA, MAY_A, MAY_B]);

describe("normalizeName", () => {
  it("ignores the differences a person's typing introduces", () => {
    expect(normalizeName("  Quercus   garryana ")).toBe("quercus garryana");
    expect(normalizeName("QUERCUS GARRYANA")).toBe("quercus garryana");
  });
});

describe("buildIndex", () => {
  it("indexes aliases verbatim, trusting the generator to have normalized them", () => {
    // Stated in `RegistryEntry.aliases` and worth pinning: the index does not
    // normalize on the way in, only on the way out. An override file that adds
    // a capitalized alias by hand would therefore be unreachable — a real
    // failure mode, and one this assertion makes visible.
    const mixed = entry({ scientificName: "Alnus rubra" });
    mixed.aliases = ["Red Alder"];
    const idx = buildIndex([mixed]);
    expect(resolveName(idx, "Red Alder").kind).toBe("none");
    expect(resolveName(idx, "Alnus rubra").kind).toBe("match");
  });
});

describe("resolveName", () => {
  it("matches a scientific name exactly, however it was typed", () => {
    const r = resolveName(index, "  quercus   GARRYANA ");
    expect(r).toMatchObject({ kind: "match" });
    expect(r.kind === "match" && r.entry.scientificName).toBe("Quercus garryana");
  });

  it("matches a common name through the alias index", () => {
    const r = resolveName(index, "Oregon White Oak");
    expect(r.kind === "match" && r.entry.scientificName).toBe("Quercus garryana");
  });

  it("refuses to guess when one common name means two plants", () => {
    // Hawthorn and trailing arbutus are both "Mayflower". Picking either would
    // be a fabricated answer; the caller is told there are two.
    const r = resolveName(index, "mayflower");
    expect(r.kind).toBe("ambiguous");
    expect(r.kind === "ambiguous" && r.entries).toHaveLength(2);
  });

  it("refuses a cultivar rather than passing it off as the species", () => {
    // A named cultivar is not the straight species and must not inherit its
    // native status — the guard that keeps 'Dwarf Garry Oak' out.
    expect(resolveName(index, "Quercus garryana 'Fastigiata'").kind).toBe("cultivar");
    expect(resolveName(index, "Dwarf Sitka Spruce").kind).toBe("cultivar");
    expect(resolveName(index, "Picea sitchensis hybrid").kind).toBe("cultivar");
  });

  it("says so plainly when it has never heard of the name", () => {
    expect(resolveName(index, "Quercus alba").kind).toBe("none");
    expect(resolveName(index, "").kind).toBe("none");
  });
});

describe("deepLinks", () => {
  it("links to the record when the identifier is reconciled", () => {
    const links = deepLinks(GARRY);
    expect(links.ipni).toBe("https://www.ipni.org/n/295829-1");
    expect(links.gbif).toBe("https://www.gbif.org/species/2879737");
    expect(links.inaturalist).toBe("https://www.inaturalist.org/taxa/54835");
  });

  it("derives the Kew link from the IPNI id rather than storing it twice", () => {
    expect(deepLinks(GARRY).powo).toContain("urn:lsid:ipni.org:names:295829-1");
  });

  it("falls back to a name search so a link works before reconciliation", () => {
    // The interim state is the normal one for a freshly added plant.
    const links = deepLinks(SITKA);
    expect(links.gbif).toBe("https://www.gbif.org/species/search?q=Picea%20sitchensis");
    expect(links.inaturalist).toContain("taxa/search?q=Picea%20sitchensis");
  });

  it("offers no link at all where a search would be a dead end", () => {
    const links = deepLinks(SITKA);
    expect(links.ipni).toBeNull();
    expect(links.powo).toBeNull();
    expect(links.usda).toBeNull();
  });
});
