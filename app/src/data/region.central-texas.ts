// central-texas: the region's own description — where it is, what it's called,
// and which ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.central-texas.ts` so that list can
// be a chunk of its own, fetched only when somebody looks at this region's
// plants. `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "central-texas",
  name: "Central Texas",
  short: "Central Texas",
  reference: "Austin, San Antonio & Dallas–Fort Worth",
  // 2023 USDA map: Dallas–Fort Worth and the northern Cross Timbers are 8a,
  // Austin and the Hill Country 8b, San Antonio 9a.
  zones: "8a–9a",
  note: "Native here means native to the limestone Hill Country and the black-clay prairies east of it: hot, droughty summers, alkaline soil that is often caliche or heavy clay, and a lot of deer. The sandy post-oak country to the east, the brush country south of San Antonio and the Gulf coast at Houston each want a list of their own.",
  extent: "From the Red River south through Dallas–Fort Worth, Waco and Austin to San Antonio, and west across the Hill Country to about Junction and Uvalde.",
  countries: ["US"],
  // Coarse box over the three ecoregions below, cut to Texas's own part of
  // them: the Red River (~33.9° N) to just south of San Antonio, and from the
  // western Edwards Plateau (~100° W) to the Blackland's eastern edge near
  // Paris and Corsicana (~95.5° W). The codes do the real carving inside it.
  bounds: { minLat: 29.0, maxLat: 34.0, minLon: -100.0, maxLon: -95.5 },
  // The three EPA Level III ecoregions this list is tuned to, which share one
  // garden problem — alkaline ground, either limestone or calcareous clay —
  // and most of their flora:
  //   30  Edwards Plateau — the limestone Hill Country west of Austin and
  //       San Antonio: thin, rocky, caliche soil over limestone.
  //   32  Texas Blackland Prairies — the deep, shrink-swell black clay that
  //       Dallas, Waco, Austin's east side and San Antonio's north side sit on.
  //   29  Cross Timbers — Fort Worth's Grand Prairie limestone and the oak
  //       belts either side of it. Its two sandy bands (Eastern and Western
  //       Cross Timbers) are post-oak and blackjack country; the rows that
  //       take acid sand say so, and post oak and blackjack oak are on the list.
  //
  // Deliberately *not* claimed, though the box reaches them:
  //   33  East Central Texas Plains — the post-oak savanna on acid sand
  //       (Bastrop, College Station). Its yaupon, farkleberry and loblolly
  //       ground wants a list of its own rather than a corner of this one.
  //   31  South Texas Plains — the brush country south of San Antonio.
  //   34  Western Gulf Coastal Plain — Houston and the coast.
  //   27  Central Great Plains — the Rolling Plains past Wichita Falls.
  // A spot there gets an honest "no list yet" when the EPA answers; offline,
  // the box still decides.
  ecoregion: [
    {
      provider: "epa-omernik",
      codes: ["30", "32", "29"],
    },
  ],
  // Escarpment live oak: the evergreen oak of the Hill Country and every old
  // Austin street — a keystone that feeds hundreds of caterpillar species.
  featuredPlantId: "quercus-fusiformis",
  featuredHostLepCount: 511,
};
