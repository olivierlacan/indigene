// ca-south-coast: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.ca-south-coast.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "ca-south-coast",
  name: "Southern California",
  short: "Southern California",
  reference: "Coast, valleys & foothills of Los Angeles–San Diego",
  zones: "9b–10b",
  note: "Native status is asserted for cismontane southern California — the coast, the inland valleys and the foothills west of the mountain crest, from about Santa Barbara to the Mexican border. Over the crest the Mojave and Colorado deserts are a different flora with different rules, and the high country of the Transverse and Peninsular ranges is colder than this list assumes; treat these recommendations as untested in both.",
  extent: "From Santa Barbara south to the Mexican border, and from the Pacific inland as far as the mountain crest — the Transverse and Peninsular ranges — and no further. Palm Springs and the desert beyond it are on the other side of that line.",
  // Coarse box over cismontane southern California. The east edge (-116.6) is
  // the crest of the Transverse and Peninsular ranges, drawn deliberately west
  // of Palm Springs so that a desert spot gets *no* list rather than a chaparral
  // list, even offline where there's no ecoregion code to fall through on. The
  // north edge (35.2) stops below San Luis Obispo, which belongs to the Central
  // Coast list still to be written.
  bounds: { minLat: 32.5, maxLat: 35.2, minLon: -120.8, maxLon: -116.6 },
  // EPA Level III ecoregions of cismontane southern California: Central
  // California Foothills and Coastal Mountains (6), Southern California
  // Mountains (8), Southern California/Northern Baja Coast (85). Deliberately
  // excludes Mojave Basin and Range (14) and Sonoran Basin and Range (81), so a
  // point in the box but over the crest correctly falls through.
  ecoregion: { provider: "epa-omernik", codes: ["6", "8", "85"] },
  // Cleveland sage: you smell it before you reach it, it is covered in bees and
  // hummingbirds, and it asks for nothing all summer — the region's argument in
  // one plant.
  featuredPlantId: "salvia-clevelandii",
  featuredHostLepCount: 8,
};
