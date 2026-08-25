// The names behind the ecoregion codes our regions cite.
//
// A region's `ecoregion.codes` are the machine's half of the boundary: "1", "2",
// "3", "4", "78" is exactly what the app compares a live EPA lookup against
// (see `data/region.ts`), and exactly what nobody can read. This table is the
// other half — the name each of those numbered polygons carries on the EPA's
// own map, so a region page can say "Coast Range, Puget Lowland, Willamette
// Valley, Cascades and Klamath Mountains" and a reader can find those names on
// the map we link to.
//
// Only the codes our regions actually claim are listed; an unknown code falls
// back to showing the number, which is still findable on the atlas. Level III
// names are American place names and are never translated — the same rule
// `lib/site.ts` follows for a live lookup's label. The EEA's eleven
// biogeographical regions *do* translate, and their names live in the locale
// files under `ecoregion.eea.<slug>`.
//
// Source: US EPA / Omernik Level III ecoregions of the conterminous United
// States, the same classification the live service returns (`lib/site.ts`) and
// the maps we link to (`EPA_ECOREGION_MAP_URL`). See docs/ecoregion-plan.md for
// which region claims which code, and why.

/** EPA (Omernik) Level III code → the name on the atlas. */
export const EPA_L3_NAMES: Record<string, string> = {
  "1": "Coast Range",
  "2": "Puget Lowland",
  "3": "Willamette Valley",
  "4": "Cascades",
  "45": "Piedmont",
  "50": "Northern Lakes and Forests",
  "51": "North Central Hardwood Forests",
  "58": "Northeastern Highlands",
  "59": "Northeastern Coastal Zone",
  "60": "Northern Allegheny Plateau",
  "61": "Erie Drift Plain",
  "62": "North Central Appalachians",
  "63": "Middle Atlantic Coastal Plain",
  "64": "Northern Piedmont",
  "65": "Southeastern Plains",
  "66": "Blue Ridge",
  "67": "Ridge and Valley",
  "69": "Central Appalachians",
  "70": "Western Allegheny Plateau",
  "75": "Southern Coastal Plain",
  "76": "Southern Florida Coastal Plain",
  "78": "Klamath Mountains",
  "83": "Eastern Great Lakes Lowlands",
  "84": "Atlantic Coastal Pine Barrens",
};
