// france-mediterranean: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.france-mediterranean.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "france-mediterranean",
  name: "Mediterranean France",
  short: "Mediterranean France",
  reference: "Marseille, Montpellier & Nice",
  zones: "≈8b–10a",
  note: "Native status is asserted for the Mediterranean biogeographical region of metropolitan France — the hot, dry south and Corsica. The oceanic west, the Continental east and the Alps are different floras with their own lists; treat these recommendations as untested there. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, Mediterranean-zone relatives of each plant.",
  extent: "The southern coast and the country behind it, from the Spanish border east to Menton on the Italian one — plus the whole of Corsica.",
  // Coarse box over the French Mediterranean: the coast and its hinterland from
  // the Spanish border eastward to Menton, plus Corsica. It deliberately
  // overlaps the Atlantic France box around Montpellier and Narbonne, because
  // no rectangle separates the two zones there — online the EEA region code
  // decides between them, and offline the tighter box wins (see regions.ts).
  bounds: { minLat: 41.3, maxLat: 44.3, minLon: 2.4, maxLon: 9.6 },
  // EEA biogeographical region this list represents.
  ecoregion: { provider: "eea-biogeo", codes: ["mediterranean"] },
  // Holm oak: the evergreen oak the whole southern landscape is built on, and
  // by a long way the biggest single food source on this list.
  featuredPlantId: "quercus-ilex",
  featuredHostLepCount: 399,
};
