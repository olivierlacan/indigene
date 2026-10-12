// chicago: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.chicago.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "chicago",
  name: "Chicago & the Corn Belt Prairie",
  short: "Chicago Prairie",
  reference: "Chicago",
  zones: "6a–6b",
  note: "Native here means native to the tallgrass prairie and oak savanna of northern and central Illinois. The forested Corn Belt east of Lafayette and the river valleys around Peoria have their own flora, not yet listed.",
  extent: "From the Wisconsin line and the Lake Michigan shore south through Joliet, Champaign and Springfield, and from Rockford east to the Indiana dunes.",
  countries: ["US"],
  // Coarse box around Central Corn Belt Plains (54) as the EPA draws it: from
  // Kenosha and the Wisconsin line south past Springfield, and from the
  // Mississippi's edge near the Quad Cities east to Lafayette. It touches no
  // other region's box — Mid-Atlantic stops at -83.5, Northern Michigan starts
  // at 44° N.
  bounds: { minLat: 39.1, maxLat: 42.9, minLon: -90.6, maxLon: -86.2 },
  // One EPA Level III ecoregion: Central Corn Belt Plains (54), the old
  // tallgrass prairie with oak groves along its rivers — Chicago, Joliet,
  // Rockford, Champaign, Bloomington-Normal, Springfield.
  //
  // Box-gated, so a spot inside the box but outside 54 gets an honest "no list
  // yet" when we can ask the EPA: Peoria and Danville on the Interior River
  // Valleys and Hills (72), Milwaukee's till plains (53), the Quad Cities on
  // the Western Corn Belt (47), and Lafayette on the Eastern Corn Belt (55).
  //
  // 55 (Indianapolis, Columbus, Dayton) is deliberately *not* claimed, though
  // it is the gap the Mid-Atlantic list leaves. It was beech-maple forest, not
  // prairie: the forest trees here would serve it, but this list's prairie
  // forbs — compass plant, pale purple coneflower — are rare or not native
  // there. One list can't honestly be both; 55 wants a woodland list of its own.
  ecoregion: [
    {
      provider: "epa-omernik",
      codes: ["54"],
    },
    // The same unit in the CEC's numbering, for when the EPA is down and the CEC
    // answers instead: 8.2.3 Central Corn Belt Plains. Peoria is 8.3.2,
    // Lafayette 8.2.4. Inside the US the CEC's Level III is the EPA's,
    // renumbered, so this set refuses the same neighbours. Its lines are drawn
    // at 1:10,000,000, so near an edge a point can land either side; a 0.25°
    // grid over this box found no disagreement (2026-10-12).
    { provider: "cec-na", standIn: true, codes: ["8.2.3"] },
  ],
  // Bur Oak: the oak that stood alone in the tallgrass, its corky bark built to
  // shrug off prairie fire — the savanna tree, and a keystone that feeds
  // hundreds of caterpillars.
  featuredPlantId: "quercus-macrocarpa",
  featuredHostLepCount: 511,
};
