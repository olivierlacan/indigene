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
  reference: "West of the crest, Portland–Seattle–Vancouver",
  zones: "8a–9a",
  note: "Native status is asserted for the maritime Pacific Northwest, west of the crest: Oregon and Washington west of the Cascades, and British Columbia's south coast west of the Coast Mountains. It crosses the border because the lowland from Tacoma to Campbell River is one ecoregion. East of the crest is a drier, different flora — treat these recommendations as untested there.",
  extent: "From the Oregon–California line north to Campbell River, taking in the Willamette Valley, Puget Sound, the Fraser Valley and the east side of Vancouver Island — and inland only as far as the crest of the Cascades and the Coast Mountains.",
  // Coarse box over the maritime Northwest on both sides of the border: from the
  // Oregon–California line (42° N) to just past Campbell River (50.3° N), and
  // from the outer coast (-125.6) inland to roughly the Cascade crest (-120.5).
  //
  // The box is what stops this region at Campbell River rather than Prince
  // Rupert. Two of its ecoregions — the Coast Mountains (7.1.6) and the
  // hypermaritime outer coast (7.1.5) — run on up the coast to Alaska, and the
  // list is not tuned to that country; the codes say *what kind of ground*, the
  // box says *how far*. Same arrangement the Florida pair uses.
  bounds: { minLat: 42.0, maxLat: 50.3, minLon: -125.6, maxLon: -120.5 },
  // **Two classifications, because no single one covers this region.** The EPA's
  // ecoregions stop dead at the Canadian border, so the northern half of a
  // genuinely continuous lowland would have nothing to be refined by. The CEC's
  // North American ecoregions cover both countries and are what answers north of
  // the line. Selection tests whichever one replied — see `RegionMeta.ecoregion`.
  //
  // The EPA set (US half), unchanged: Coast Range (1), Puget Lowland (2),
  // Willamette Valley (3), Cascades (4), Klamath Mountains (78). Deliberately
  // excludes Eastern Cascades Slopes and Foothills (9), so Bend correctly gets
  // no list.
  //
  // The CEC set, confirmed point by point against the live service — see
  // data/sources/cec-ecoregions/README.md. It is deliberately the **whole**
  // region, not just the Canadian part: the CEC is the one authority here that
  // sees all of North America, so it is the only set that can describe this
  // region's ground end to end — which is what the boundary map is drawn from,
  // and what answers a coastal point in Washington the EPA's polygons miss.
  //   7.1.7  Strait of Georgia/Puget Lowland — **the reason this region crosses
  //          the border.** It is one unit and the CEC has named it after both
  //          ends: Tacoma, Seattle and Bellingham are 7.1.7, and so are
  //          Victoria, Vancouver, Surrey, Abbotsford, the Sunshine Coast and
  //          east Vancouver Island up to Campbell River.
  //   7.1.6  Pacific and Nass Ranges — the Coast Mountains behind Vancouver.
  //   7.1.5  Coastal Western Hemlock–Sitka Spruce Forests — the wet outer coast.
  // And the American half, each one the CEC's name for a code already above:
  //   7.1.8  Coastal Range          = EPA 1   (and the Olympics)
  //   7.1.9  Willamette Valley      = EPA 3
  //   6.2.5  North Cascades         = EPA 4, north of Snoqualmie
  //   6.2.7  Cascades               = EPA 4, south of it
  //   6.2.11 Klamath Mountains      = EPA 78
  // Deliberately excluded, though the box's east edge reaches them: Eastern
  // Cascades Slopes and Foothills (6.2.8, Bend), Columbia Plateau (10.1.2,
  // Yakima) and Thompson-Okanagan Plateau (10.1.1, Merritt) — the dry interior
  // on both sides of the border, the same call EPA 9 gets on the American side.
  ecoregion: [
    { provider: "epa-omernik", codes: ["1", "2", "3", "4", "78"] },
    { provider: "cec-na", codes: ["7.1.5", "7.1.6", "7.1.7", "7.1.8", "7.1.9", "6.2.5", "6.2.7", "6.2.11"] },
  ],
  // Red-flowering Currant: blooms when the first hummingbirds arrive — the
  // region's most charismatic case for planting native.
  featuredPlantId: "ribes-sanguineum",
  featuredHostLepCount: 40,
};
