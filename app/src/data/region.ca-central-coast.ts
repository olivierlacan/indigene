// ca-central-coast: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.ca-central-coast.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "ca-central-coast",
  name: "Central California Coast",
  short: "Central Coast",
  reference: "San Francisco Bay, the coast ranges & the Salinas Valley",
  zones: "9a–10a",
  note: "Native status is asserted for the central California coast ranges and the valleys between them — Sonoma and Marin south through the Bay Area to Big Sur, and inland to the Diablo and Gabilan crest. Over that crest the floor of the Central Valley is hotter and its own list is still to be written; north of the Russian River the redwood coast is wetter and belongs with a northern list. Treat these recommendations as untested in both.",
  extent: "From the Sonoma and Marin hills south past San Francisco Bay to Big Sur, and inland across the Santa Cruz Mountains, the Diablo Range and the Salinas Valley as far as the crest that ends at the Central Valley — the valley floor itself is on the other side of that line.",
  // Coarse box over the central California coast ranges. The east edge (-120.4)
  // is the crest above the San Joaquin Valley; the north edge (38.9) stops below
  // Ukiah, and the south edge (35.0) below San Luis Obispo, where the southern
  // California list picks up. The box overlaps its neighbours at both ends —
  // that is normal here and the ecoregion code resolves it (see `regions.ts`).
  bounds: { minLat: 35.0, maxLat: 38.9, minLon: -123.6, maxLon: -120.4 },
  // One EPA Level III ecoregion: Central California Foothills and Coastal
  // Mountains (6). Deliberately narrow. It excludes Central California Valley
  // (7), so a Modesto or Los Banos point inside the box correctly falls through
  // rather than being handed a coastal list, and it excludes Coast Range (1),
  // so the Sonoma coast north of the Russian River waits for the north-coast
  // list instead of getting a Bay Area one.
  ecoregion: { provider: "epa-omernik", codes: ["6"] },
  // Blueblossom: the week the coast ranges turn blue, on a shrub that carries
  // more caterpillars than anything else its size and fixes its own nitrogen.
  featuredPlantId: "ceanothus-thyrsiflorus",
  featuredHostLepCount: 55,
};
