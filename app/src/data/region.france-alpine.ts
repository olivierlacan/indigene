// france-alpine: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.france-alpine.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "france-alpine",
  name: "The French Alps",
  short: "The French Alps",
  reference: "Grenoble, Annecy & Briançon",
  zones: "≈4–7",
  note: "Native status is asserted for the Alpine biogeographical region of metropolitan France, and this list is tuned to the Alps specifically: montane and subalpine ground, roughly 600–2,000 m. The Pyrenees share the same EEA designation but are a distinct flora with their own endemics, and are deliberately outside this list's coverage rather than guessed at. Below the mountains, the Continental, Atlantic and Mediterranean lists apply. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, mountain-zone relatives of each plant.",
  extent: "The French Alps only — from the Vercors and the Écrins north to the Chablais, and east to the Italian border. Mountain ground, roughly 600 to 2,000 m up. The Pyrenees are not included.",
  // Coarse box over the French Alps only — from the Vercors and the Écrins
  // north to the Chablais, and from the Grésivaudan east to the Italian border.
  // The Pyrenees are deliberately excluded (see the note above). The box
  // overlaps the Continental one; online the EEA region code decides, and
  // offline the tighter box wins (see regions.ts).
  bounds: { minLat: 44.0, maxLat: 46.5, minLon: 5.3, maxLon: 7.8 },
  // EEA biogeographical region this list represents.
  ecoregion: { provider: "eea-biogeo", codes: ["alpine"] },
  // Bilberry: the low blue-berried shrub the whole subalpine forest floor is
  // made of, and by far the biggest food source among the mountain shrubs.
  featuredPlantId: "vaccinium-myrtillus",
  featuredHostLepCount: 227,
};
