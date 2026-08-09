// florida: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.florida.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "florida-central",
  name: "North & Central Florida",
  short: "North & Central Florida",
  reference: "The panhandle, Jacksonville & Orlando",
  zones: "8b–9b",
  note: "Native status is asserted for the panhandle and warm-temperate peninsula, roughly from the Georgia line down to Lake Okeechobee. The subtropical south and the Keys have their own list. Where a plant is really a north- or south-Florida species, its hardiness zones and notes say so.",
  extent: "North to the Georgia line, west along the panhandle to Pensacola, and south to about Lake Okeechobee, where the subtropical south begins.",
  // North & central Florida: from the ~27.2° N seam (roughly Lake Okeechobee,
  // the base of the subtropical zone) up to the Georgia line (~31° N), west to
  // the panhandle. The box abuts — never overlaps — the south-Florida box.
  bounds: { minLat: 27.2, maxLat: 31.0, minLon: -87.7, maxLon: -79.8 },
  // The two temperate EPA Level III ecoregions here: Southeastern Plains (65,
  // panhandle/north interior) and Southern Coastal Plain (75, the peninsula).
  // Box-gated so it never claims the parts of 65/75 that reach into GA/AL.
  ecoregion: { provider: "epa-omernik", codes: ["65", "75"] },
  // American Beautyberry: unmistakable purple fruit, easy in a yard, and a
  // bird buffet — the friendliest door into Florida natives.
  featuredPlantId: "callicarpa-americana",
  featuredHostLepCount: 40,
};
