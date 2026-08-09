// france-atlantic: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.france-atlantic.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "france-atlantic",
  name: "Atlantic France",
  short: "Atlantic France",
  reference: "Paris, Nantes & Bordeaux",
  zones: "≈8a–9a",
  note: "Native status is asserted for the Atlantic (oceanic) biogeographical region of metropolitan France — the mild, rainy west and north. The Mediterranean south, the Alps and Pyrenees, and the drier Continental east are different floras and are planned as their own regions; treat these recommendations as untested there. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, oceanic-temperate relatives of each plant.",
  extent: "The mild, rainy west and north: from the foot of the Pyrenees north to the Channel and the Belgian border, and from the Atlantic coast inland past Paris to about the Rhône.",
  // Coarse box over the Atlantic-influenced west & north of metropolitan France,
  // from the Pyrenean foot (~43° N) to the Channel/Belgian border (~51.2° N),
  // and from the Atlantic coast (~-5.2° E) inland to roughly the Rhône/eastern
  // edge (~5° E). The Mediterranean far south and Corsica are excluded; when
  // online, the EEA region code refines within the box, so a Mediterranean or
  // Alpine point that still falls inside it correctly gets no Atlantic list.
  bounds: { minLat: 43.2, maxLat: 51.2, minLon: -5.2, maxLon: 5.0 },
  // EEA biogeographical region this list represents. Online, a spot must resolve
  // to the Atlantic region to get this list; offline, the box alone decides.
  ecoregion: { provider: "eea-biogeo", codes: ["atlantic"] },
  // Hawthorn: the signature hedgerow shrub of the Atlantic bocage — a froth of
  // May blossom for pollinators, red haws for winter birds, and one of the top
  // host plants. The friendliest, most recognizable door into French natives.
  featuredPlantId: "crataegus-monogyna",
  featuredHostLepCount: 200,
};
