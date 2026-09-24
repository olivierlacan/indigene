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
  note: "Native status is asserted for the maritime, west-of-the-crest Pacific Northwest — Oregon and Washington west of the Cascades, and British Columbia's south coast west of the Coast Mountains. East of the crest is a drier, different flora; treat these recommendations as untested there. This region crosses the Canada–US border on purpose: the lowland from Tacoma to Campbell River is one ecoregion, and the plants have never observed the line. A handful of rows are the Oregon end of the list and do not reach British Columbia — each says so.",
  extent: "From the Oregon–California line north to Campbell River and the Strait of Georgia, taking in the Willamette Valley, Puget Sound, the Fraser Valley, the Sunshine Coast and the east side of Vancouver Island — and inland only as far as the crest of the Cascades and the Coast Mountains.",
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
  // The CEC set (the half the EPA can't see), confirmed by point query against
  // the live service — see data/sources/cec-ecoregions/README.md:
  //   7.1.7  Strait of Georgia/Puget Lowland — **the reason this region now
  //          crosses the border.** It is one unit and the CEC has named it after
  //          both ends: Tacoma, Seattle and Bellingham are 7.1.7, and so are
  //          Victoria, Vancouver, Surrey, Abbotsford, the Sunshine Coast and
  //          east Vancouver Island up to Campbell River.
  //   7.1.6  Pacific and Nass Ranges — the Coast Mountains behind Vancouver, the
  //          northern counterpart of the Cascades this list already claims.
  //   7.1.5  Coastal Western Hemlock–Sitka Spruce Forests — the wet outer coast,
  //          the counterpart of the Coast Range (EPA 1).
  // Deliberately excluded, though the box's north-east corner reaches them:
  // Thompson-Okanagan Plateau (10.1.1, Merritt and Lillooet) and Columbia
  // Plateau (10.1.2), the dry interior — exactly the call that excludes EPA 9 on
  // the American side, and for the same reason.
  ecoregion: [
    { provider: "epa-omernik", codes: ["1", "2", "3", "4", "78"] },
    { provider: "cec-na", codes: ["7.1.7", "7.1.6", "7.1.5"] },
  ],
  // Red-flowering Currant: blooms when the first hummingbirds arrive — the
  // region's most charismatic case for planting native.
  featuredPlantId: "ribes-sanguineum",
  featuredHostLepCount: 40,
};
