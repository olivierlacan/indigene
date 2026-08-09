// pnw: the region's own description — where it is, what it's called, and which
// ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.pnw.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "pnw",
  name: "Pacific Northwest",
  short: "Pacific Northwest",
  reference: "West of the Cascades, Portland–Seattle lowlands",
  zones: "8a–9a",
  note: "Native status is asserted for the maritime, west-of-the-Cascades Pacific Northwest. East of the Cascade crest is a drier, different flora — treat these recommendations as untested there.",
  extent: "North to the Canadian border, south to the Oregon–California line, and from the Pacific coast inland only as far as the crest of the Cascades — the wet, west-facing side of the mountains.",
  // Coarse box over western Oregon and Washington, from the Oregon–California
  // line (42° N) to the Canadian border (49° N), and from the coast inland to
  // roughly the Cascade crest. East of ~-120.5 is high desert, a different
  // flora — noted in `note` and left for a future region.
  bounds: { minLat: 42.0, maxLat: 49.0, minLon: -124.9, maxLon: -120.5 },
  // West-of-the-Cascades EPA Level III ecoregions: Coast Range (1), Puget
  // Lowland (2), Willamette Valley (3), Cascades (4), Klamath Mountains (78).
  // Deliberately excludes Eastern Cascades Slopes and Foothills (9) and the
  // interior dry ecoregions, so a point in the box but east of the crest (e.g.
  // Bend, in ecoregion 9) correctly gets no PNW list rather than a bad one.
  ecoregion: { provider: "epa-omernik", codes: ["1", "2", "3", "4", "78"] },
  // Red-flowering Currant: blooms when the first hummingbirds arrive — the
  // region's most charismatic case for planting native.
  featuredPlantId: "ribes-sanguineum",
  featuredHostLepCount: 40,
};
