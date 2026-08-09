// mid-atlantic: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.mid-atlantic.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "mid-atlantic",
  name: "Mid-Atlantic / Northeast Piedmont",
  short: "Mid-Atlantic",
  reference: "Pennsylvania",
  zones: "6b–7a",
  note: "Native here means native to this region specifically. Outside it, treat these picks as untested.",
  extent: "North to southern New England, south to central Virginia, and from the Atlantic coast west to the Appalachian ridges.",
  // Coarse box over the Piedmont/Northeast the seed list is tuned to: roughly
  // Virginia up through southern New England, west to the Appalachians.
  bounds: { minLat: 36.5, maxLat: 45.5, minLon: -83.5, maxLon: -71.0 },
  // The eastern-forest EPA Level III ecoregions this list is actually tuned to,
  // ranked by how much of the box each one covers: Northeastern Highlands (58),
  // Ridge and Valley (67), Western Allegheny Plateau (70), Central Appalachians
  // (69), Northern Allegheny Plateau (60), Eastern Great Lakes Lowlands (83),
  // Northeastern Coastal Zone (59), Piedmont (45), Erie Drift Plain (61),
  // Northern Piedmont (64), North Central Appalachians (62), Middle Atlantic
  // Coastal Plain (63), Southeastern Plains (65), Atlantic Coastal Pine Barrens
  // (84), Blue Ridge (66).
  //
  // 65 is on the list because that is where Washington and Richmond actually
  // fall — the coastal plain runs north into Virginia, and dropping it would
  // leave the capital with no list at all. It's box-gated, so this region never
  // claims the Georgia and Alabama end of 65, which north Florida's list does.
  //
  // Deliberately *not* claimed, though the box overlaps them: Eastern Corn Belt
  // Plains (55, Columbus), Southern Michigan/Northern Indiana Drift Plains (56),
  // Huron/Erie Lake Plains (57, Toledo), Northern Lakes and Forests (50, the
  // Adirondack and northern New England edge) and Interior Plateau (71). Those
  // are a midwestern or boreal flora this Pennsylvania-tuned list has no
  // business asserting, so a spot there now gets an honest "no list yet" when
  // we can ask the EPA — offline, the box still decides.
  //
  // Ordered biggest-share-first, not numerically: the region page names the
  // first few and counts the rest, so the ones a reader is most likely to be
  // standing in should come first.
  ecoregion: {
    provider: "epa-omernik",
    codes: ["58", "67", "70", "69", "60", "83", "59", "45", "61", "64", "62", "63", "65", "84", "66"],
  },
  // White Oak: the East's single most consequential wildlife plant, and the
  // clearest possible introduction to what "keystone" means.
  featuredPlantId: "quercus-alba",
  featuredHostLepCount: 511,
};
