// Source links for the wildlife layer. Two jobs:
//
//   1. SOURCE_LINKS — turn the authority names that appear in a `basis` /
//      `nativeBasis` string into links to that authority's canonical page, so a
//      citation is clickable, not just prose. Keyed by the exact name used in
//      the strings; the renderer (`components/citation.ts`) linkifies matches
//      and leaves everything else as text. Longest names must win over their
//      own prefixes ("Cornell Lab of Ornithology" over "Cornell Lab"), which
//      the renderer handles by trying longer names first.
//
//   2. speciesRecordUrl — a *deep* link to the animal's own record, built from
//      its name where a deterministic, stable URL scheme exists: BAMONA for
//      butterflies & moths (from the Latin binomial) and Cornell's All About
//      Birds for single-species birds (from the common name). Groups and
//      multi-species entries return null — there's no single record to point at.
//
// URLs here are authority landing pages and the two well-established species
// schemes; they were not machine-verified from this build environment (its
// egress policy blocks outbound web hosts), so treat a specific species path as
// best-effort — each site returns a searchable 404 if a slug ever drifts.
import type { Wildlife } from "../types";

export interface SourceSite {
  name: string;
  url: string;
}

// Authority name (as written in basis prose) → its canonical page.
export const SOURCE_LINKS: SourceSite[] = [
  { name: "Butterflies and Moths of North America", url: "https://www.butterfliesandmoths.org/" },
  { name: "BAMONA", url: "https://www.butterfliesandmoths.org/" },
  { name: "Cornell Lab of Ornithology", url: "https://www.allaboutbirds.org/" },
  { name: "Cornell Lab", url: "https://www.allaboutbirds.org/" },
  { name: "Xerces Society", url: "https://www.xerces.org/" },
  { name: "Xerces", url: "https://www.xerces.org/" },
  { name: "NWF Native Plant Finder", url: "https://www.nwf.org/NativePlantFinder" },
  { name: "LBJ Wildflower Center", url: "https://www.wildflower.org/" },
  { name: "Wildflower Center", url: "https://www.wildflower.org/" },
  { name: "Audubon", url: "https://www.audubon.org/bird-guide" },
  { name: "UF/IFAS", url: "https://gardeningsolutions.ifas.ufl.edu/" },
  { name: "Florida Native Plant Society", url: "https://www.fnps.org/" },
  { name: "Florida Museum of Natural History", url: "https://www.floridamuseum.ufl.edu/" },
  { name: "USDA Silvics of North America", url: "https://research.fs.usda.gov/" },
  { name: "Silvics of North America", url: "https://research.fs.usda.gov/" },
  { name: "USDA PLANTS", url: "https://plants.usda.gov/" },
  { name: "Monarch Joint Venture", url: "https://monarchjointventure.org/" },
  { name: "USGS Native Bee Inventory", url: "https://www.usgs.gov/labs/native-bee-inventory-and-monitoring-lab" },
  { name: "Fowler & Droege", url: "https://jarrodfowler.com/specialist_bees.html" },
  { name: "IUCN Red List", url: "https://www.iucnredlist.org/" },
  { name: "Smithsonian", url: "https://naturalhistory.si.edu/" },
  { name: "USFWS", url: "https://www.fws.gov/" },
  { name: "WSU Extension", url: "https://extension.wsu.edu/" },
];

const BAMONA_SPECIES = "https://www.butterfliesandmoths.org/species/";
const ALL_ABOUT_BIRDS = "https://www.allaboutbirds.org/guide/";

const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * A deep link to the animal's own record, or null when there isn't a single one
 * (a group like "Jays, turkeys & woodpeckers", or two species in one entry).
 *
 *  - Butterflies & moths → BAMONA `/species/Genus-species`, from the binomial.
 *  - Single birds        → All About Birds `/guide/Common_Name`, from the name.
 */
export function speciesRecordUrl(w: Wildlife): SourceSite | null {
  const latin = w.latin?.trim();
  if ((w.kind === "butterfly" || w.kind === "moth") && latin && !latin.includes(",")) {
    const parts = latin.split(/\s+/);
    // A clean two-word binomial only (skip anything with "spp." or extra terms).
    if (parts.length === 2 && /^[A-Z][a-z]+$/.test(parts[0]) && /^[a-z-]+$/.test(parts[1])) {
      return { name: "Butterflies and Moths of North America", url: BAMONA_SPECIES + parts.join("-") };
    }
    return null;
  }
  if (w.kind === "bird" && latin && !latin.includes(",")) {
    // All About Birds keys on the common name: words title-cased, spaces → "_",
    // hyphens kept (e.g. "Ruby-throated hummingbird" → "Ruby-throated_Hummingbird").
    const slug = w.common.split(/\s+/).map(capitalize).join("_");
    return { name: "Cornell Lab — All About Birds", url: ALL_ABOUT_BIRDS + slug };
  }
  return null;
}
