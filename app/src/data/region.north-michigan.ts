// north-michigan: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.north-michigan.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "north-michigan",
  name: "Northern Lower Michigan",
  short: "Northern Michigan",
  reference: "Petoskey & Little Traverse Bay",
  zones: "5b–6a",
  note: "Native here means native to the northern Lower Peninsula specifically — its cool, often lime-rich northern-hardwood and pine country, moderated by the Great Lakes. The boreal Upper Peninsula and the warmer southern Lower Peninsula each have their own flora, not yet listed.",
  extent: "The tip of the Lower Peninsula: from the Straits of Mackinac south through Traverse City and Petoskey to about Cadillac, between the Lake Michigan and Lake Huron shores.",
  // Coarse box over the northern Lower Peninsula the seed list is tuned to:
  // roughly Cadillac/Manistee north to the Straits, shore to shore. Its east
  // edge (~-83.3) laps a sliver of the Mid-Atlantic box's far-northwest corner
  // (which reaches lat 45.5 at lon -83.5); that overlap resolves correctly
  // anyway — this box is much smaller, so it wins the offline tiebreak, and
  // online the ecoregion code decides (50/51 here, none of them Mid-Atlantic's).
  bounds: { minLat: 44.0, maxLat: 45.9, minLon: -86.7, maxLon: -83.3 },
  // The two EPA Level III ecoregions this northern-hardwoods list is tuned to,
  // ranked by how much of the box each one covers: Northern Lakes and Forests
  // (50) fills the interior north; North Central Hardwood Forests (51) is the
  // Lake Michigan-moderated northwest shore — the Manistee–Leelanau band that
  // Petoskey, Charlevoix and Traverse City sit in.
  //
  // Box-gated, so this list never claims 50/51 where they run on into Wisconsin
  // or Minnesota. Deliberately *not* claimed, though the box's southern edge
  // grazes them: Southern Michigan/Northern Indiana Drift Plains (56) and
  // Huron/Erie Lake Plains (57), the warmer southern-Lower-Michigan flora, and
  // the boreal north of 50 in the Upper Peninsula. A spot in those now gets an
  // honest "no list yet" when we can ask the EPA; offline the box still decides.
  ecoregion: {
    provider: "epa-omernik",
    codes: ["50", "51"],
  },
  // Eastern White Pine: Michigan's state tree and the giant that defined the
  // North — a keystone conifer that still towers over these woods and feeds
  // hundreds of caterpillars.
  featuredPlantId: "pinus-strobus",
  featuredHostLepCount: 203,
};
