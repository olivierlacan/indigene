// scotland-lowlands: the region's own description — where it is, what it's
// called, and which ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.scotland-lowlands.ts` so that list
// can be a chunk of its own, fetched only when somebody looks at this region's
// plants. `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "scotland-lowlands",
  name: "Scottish Lowlands",
  short: "Scottish Lowlands",
  reference: "Glasgow, Edinburgh & Dundee",
  zones: "≈8a–9a",
  note: "Every plant here is recorded as native in this region's own 10 km squares by the BSBI's Plant Atlas 2020, not just somewhere in Britain. That is why Scots pine is missing: in the lowlands it is planted, and its native pinewoods are Highland. Host-insect figures are counted from the open European Lepidoptera–plant matrix (Gaytán et al. 2026) for native, oceanic-temperate relatives of each plant.",
  extent: "From the Highland line south to the Solway and the English border, and from the Ayrshire and Galloway coast east to the Lothians, Fife and the Tay.",
  countries: ["GB-SCT"],
  // Coarse box over lowland Scotland: the Mull of Galloway (~54.63° N) north to
  // the Tay and the foot of the Highlands at ~56.6° N, and from the Rhins of
  // Galloway (~-5.15° E) east to St Abbs Head and Berwick (~-2.0° E).
  //
  // **Three edges are compromises, named here so they are decisions on the
  // record and not surprises.**
  //  - *The Highland line runs diagonally* — from Helensburgh (56.0° N) to
  //    Stonehaven (57.0° N) — so a box that reaches Dundee and Perth also takes
  //    in the Trossachs and the north shore of Loch Lomond. Those get a lowland
  //    list. Aberdeen sits north of the line on a narrow coastal strip no box
  //    can reach without pulling in the Cairngorms; it waits for a north-east
  //    region.
  //  - *The English border runs diagonally too*, from the Solway to Berwick, so
  //    Carlisle and the north of Northumberland fall inside the box. The flora
  //    there is the same as the Borders', which makes the answer defensible; a
  //    northern England list would take them back.
  //  - *The west edge stops at -5.2° E*, short of Kintyre and Arran's west
  //    coast. Kintyre already falls in Ireland's box (see `region.ireland.ts`),
  //    and the two boxes are kept from overlapping.
  bounds: { minLat: 54.6, maxLat: 56.6, minLon: -5.2, maxLon: -2.0 },
  // EEA biogeographical region. All of Britain is Atlantic, the same code
  // Ireland and Atlantic France claim — the code can't tell the three apart,
  // and the boxes, which don't overlap, do.
  ecoregion: [{ provider: "eea-biogeo", codes: ["atlantic"] }],
  // Bird cherry: a tree of Scottish burnsides, far commoner here than further
  // south, small enough for a garden, with scented May blossom and a genus
  // that feeds over 300 kinds of caterpillar.
  featuredPlantId: "prunus-padus",
  featuredHostLepCount: 318,
};
