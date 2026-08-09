// france-continental: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.france-continental.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "france-continental",
  name: "Continental France",
  short: "Continental France",
  reference: "Dijon, Nancy & Strasbourg",
  zones: "≈6b–8a",
  note: "Native status is asserted for the Continental biogeographical region of metropolitan France — the centre and east, with colder winters and hotter summers than the Atlantic coast. The oceanic west, the Mediterranean south and the Alps are different floras with their own lists; treat these recommendations as untested there. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, continental-temperate relatives of each plant.",
  extent: "The centre and east: Burgundy, Franche-Comté, Lorraine, Alsace and the Rhône valley — east of Paris, west of the Rhine, north of Provence and below the Alps.",
  // Coarse box over the continental centre and east: Burgundy, Franche-Comté,
  // Lorraine, Alsace and the Rhône valley. It overlaps the Atlantic France box
  // west of ~5° E and the Alpine box in the south-east; online the EEA region
  // code decides, and offline the tighter box wins (see regions.ts). Its
  // western edge stops short of Paris, which is Atlantic.
  bounds: { minLat: 45.0, maxLat: 49.5, minLon: 3.0, maxLon: 8.3 },
  // EEA biogeographical region this list represents.
  ecoregion: { provider: "eea-biogeo", codes: ["continental"] },
  // Sessile oak: the tree the eastern woodlands are built on, and the single
  // biggest food source on the list by a wide margin.
  featuredPlantId: "quercus-petraea",
  featuredHostLepCount: 401,
};
