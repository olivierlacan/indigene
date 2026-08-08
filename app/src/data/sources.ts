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
  // Authorities cited by the look-alike layer (`data/lookalikes.ts`): the
  // extension services, herbaria and weed boards that publish the "how to tell
  // these two apart" and "what this plant does here" pages we lean on.
  { name: "Penn State Extension", url: "https://extension.psu.edu/" },
  { name: "Ohio State Extension", url: "https://extension.osu.edu/" },
  { name: "Oregon State University", url: "https://landscapeplants.oregonstate.edu/" },
  { name: "Missouri Botanical Garden", url: "https://www.missouribotanicalgarden.org/plantfinder/plantfindersearch.aspx" },
  { name: "Morton Arboretum", url: "https://mortonarb.org/plant-and-protect/trees-and-plants/" },
  { name: "Burke Herbarium (University of Washington)", url: "https://burkeherbarium.org/imagecollection/" },
  { name: "Invasive Plant Atlas", url: "https://www.invasiveplantatlas.org/" },
  { name: "Washington State Noxious Weed Control Board", url: "https://www.nwcb.wa.gov/" },
  { name: "King County Noxious Weeds", url: "https://kingcounty.gov/" },
  { name: "Oregon Dept. of Agriculture", url: "https://www.oregon.gov/oda/programs/weeds/" },
  { name: "Washington Poison Center", url: "https://www.wapc.org/" },
  { name: "Maryland DNR", url: "https://dnr.maryland.gov/" },
  { name: "Florida Invasive Species Council", url: "https://floridainvasives.org/" },
  { name: "CABI Compendium", url: "https://www.cabidigitallibrary.org/product/qi" },
  { name: "Bugwood", url: "https://www.invasive.org/" },
  { name: "ASPCA Animal Poison Control", url: "https://www.aspca.org/pet-care/animal-poison-control" },
  // European authorities, cited by the France rows. The Gaytán matrix is the
  // source of every European host count, so it links to the paper itself.
  { name: "Gaytán et al. 2026 European matrix", url: "https://doi.org/10.1002/ece3.73004" },
  { name: "Tela Botanica", url: "https://www.tela-botanica.org/" },
  { name: "INPN", url: "https://inpn.mnhn.fr/" },
  { name: "RHS Plants for Pollinators", url: "https://www.rhs.org.uk/wildlife/plants-for-pollinators" },
  { name: "Butterfly Conservation", url: "https://butterfly-conservation.org/" },
  { name: "Woodland Trust", url: "https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/" },
  { name: "Buglife", url: "https://www.buglife.org.uk/" },
  { name: "Plantlife", url: "https://www.plantlife.org.uk/" },
  { name: "RHS", url: "https://www.rhs.org.uk/" },
  // European authorities for the look-alike layer: France's invasive-species
  // resource centre, the plant-health organisation whose lists the EU acts on,
  // the national forestry office, and the Mediterranean conservatory.
  { name: "OFB Centre de ressources EEE", url: "https://especes-exotiques-envahissantes.fr/" },
  { name: "EPPO", url: "https://gd.eppo.int/" },
  { name: "ONF", url: "https://www.onf.fr/" },
  { name: "Conservatoire botanique national méditerranéen", url: "https://www.cbnmed.fr/" },
  // The interaction aggregator behind the ties found by
  // `app/scripts/wildlife-candidates.mjs`. Only GloBI itself is linked: each
  // tie's basis also names the *contributed dataset* the records came from
  // (trophiCH, EuPPollNet, HOSTS…), and those stay as prose, the same way the
  // European butterfly foodplant checklist already does — a reader who wants
  // the dataset searches the name, and we don't ship a wall of DOIs we could
  // not check from this build environment.
  { name: "Global Biotic Interactions", url: "https://www.globalbioticinteractions.org/" },
  { name: "GloBI", url: "https://www.globalbioticinteractions.org/" },
  // Where the occurrence counts in a plant's basis come from — "Occurrence
  // records in this region's box: 6,819 (GBIF)". A reader who wants to know
  // what a record is can go and look.
  { name: "Global Biodiversity Information Facility", url: "https://www.gbif.org/" },
  { name: "GBIF", url: "https://www.gbif.org/" },
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
