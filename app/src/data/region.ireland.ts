// ireland: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.ireland.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "ireland",
  name: "Ireland",
  short: "Ireland",
  reference: "Dublin, Cork & Galway",
  zones: "≈8b–10a",
  note: "Native status is asserted for the island of Ireland — both the Republic and Northern Ireland — from Kew's World Checklist of Vascular Plants. Ireland's flora is smaller than Britain's or France's: the sea closed behind the retreating ice before many species arrived, so there is no native maple, lime or hornbeam here, and beech and sycamore are introductions however old they look. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, oceanic-temperate relatives of each plant.",
  extent: "The whole island, from Mizen Head and Cork north to Malin Head and the Antrim coast, and from the Atlantic cliffs of Kerry, Clare and Donegal east to Dublin and the Ards peninsula.",
  countries: ["IE"],
  // Coarse box over the island of Ireland: Mizen Head (~51.42° N) to Malin Head
  // (~55.38° N), and from the Kerry headlands (~-10.48° E) east to Burr Point in
  // Co. Down (~-5.43° E). The east edge at -5.37 is chosen to fall in the gap
  // between Ireland's easternmost point and St David's Head in Wales (-5.32), so
  // no Welsh spot lands in this box.
  //
  // **The box clips the Mull of Kintyre.** No rectangle around Ireland misses
  // that Scottish peninsula (roughly 55.30–55.50° N, -5.80 to -5.37° E), and the
  // EEA code can't separate them — Kintyre is Atlantic too. So a spot there gets
  // this list. It is oceanic Atlantic ground with a closely related flora, which
  // makes the answer defensible rather than right; it is the same "the lists
  // travel" question `docs/ecoregion-plan.md` §D raised when the Atlantic France
  // map turned out to reach into Belgium. Named here so it is a decision on the
  // record and not a surprise.
  bounds: { minLat: 51.3, maxLat: 55.5, minLon: -10.8, maxLon: -5.37 },
  // EEA biogeographical region this list represents. The whole island is
  // Atlantic, the same code Atlantic France claims — so online the code cannot
  // tell the two apart and the boxes do it, which they can: the two are 700 km
  // and one sea apart.
  ecoregion: [{ provider: "eea-biogeo", codes: ["atlantic"] }],
  // Rowan: the tree of Irish folklore, small enough for any garden, covered in
  // blossom for pollinators and then in berries the winter thrushes strip — and
  // it grows where almost nothing else will.
  featuredPlantId: "sorbus-aucuparia",
  featuredHostLepCount: 109,
};
