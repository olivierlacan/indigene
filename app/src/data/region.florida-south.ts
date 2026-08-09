// florida-south: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.florida-south.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "florida-south",
  name: "South Florida",
  short: "South Florida",
  reference: "Greater Miami, the Everglades & the Keys",
  zones: "10a–11a",
  note: "Native status is asserted for subtropical south Florida and the Keys, south of roughly Lake Okeechobee. Many species here are frost-tender and belong only in this region; north & central Florida has its own list.",
  extent: "From about Lake Okeechobee south through the Everglades, the Miami–Naples coasts and the whole chain of the Keys.",
  // South Florida: from the Keys (~24.4° N) up to the ~27.2° N seam. Abuts —
  // never overlaps — the north & central Florida box.
  bounds: { minLat: 24.4, maxLat: 27.2, minLon: -82.5, maxLon: -79.9 },
  // Southern Florida Coastal Plain (76, the Everglades, pine rocklands and
  // Keys) plus the subtropical end of Southern Coastal Plain (75). Box-gated to
  // the peninsula's south. Ecoregion 76 is the seam that separates this list
  // from the temperate north & central one.
  ecoregion: { provider: "epa-omernik", codes: ["75", "76"] },
  // Gumbo Limbo: the signature tree of South Florida hammocks — instantly
  // recognizable by its peeling copper bark.
  featuredPlantId: "bursera-simaruba",
  featuredHostLepCount: 4,
};
