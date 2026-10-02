// kanto: the region's own description — where it is, what it's called, and
// which ecoregion it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.kanto.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "kanto",
  name: "Kantō Plain",
  short: "Kantō",
  reference: "Tokyo, Yokohama, Saitama & Chiba",
  countries: ["JP"],
  // Tokyo and the bay shore are 9a–9b; the inland plain at Kumagaya and
  // Utsunomiya drops to 8b. Zones are a translation in Japan, as in Europe —
  // the local convention is a prefectural climate division, not a USDA number —
  // so the range carries the "≈" the European regions use.
  zones: "≈8b–9b",
  note: "Native status is asserted for Japan as a whole, from Kew's World Checklist of Vascular Plants — the same grain Ireland and Auckland ship on, and coarser than this region. A plant native in Japan may belong to Kyushu or the mountains rather than to this plain, so each row says where on the Kantō it actually grows. Up in the Chichibu and Hakone hills, or over the rim into Gunma, the winters are colder and the flora changes.",
  extent: "The Kantō Plain, Japan's largest: Tokyo and Yokohama on the bay, east across Chiba and the Bōsō peninsula to Chōshi, north over Saitama and Tsukuba to Utsunomiya and Mito, and inland to the foot of the Chichibu hills.",
  // The plain, and not the mountains that ring it. North of 36.65 is Nikkō and
  // the Ashio range; west of 139.0 is the Chichibu massif and the Kōfu basin;
  // south of 34.9 is open sea past the Bōsō tip.
  bounds: { minLat: 34.9, maxLat: 36.65, minLon: 139.0, maxLon: 140.9 },
  // **One classification, and a coarse one.** RESOLVE is the only ecoregion
  // service that answers in Japan, and it is global: one level, 1:10,000,000.
  // Confirmed point by point against the live layer:
  //   682  Taiheiyo evergreen forests — the Pacific-facing lowland belt. Tokyo,
  //        Yokohama, Chiba, Saitama, Kumagaya, Tsukuba, Mito, Utsunomiya,
  //        Chōshi and the Bōsō peninsula are all 682.
  //
  // **682 is far bigger than this region, and that is the point of the box.**
  // The same code runs down the Pacific side of the country to Nagoya, Osaka,
  // Hiroshima, Fukuoka and Kagoshima — seven degrees of latitude and most of
  // Japan's population. A list written for the Kantō cannot speak for Kyushu,
  // so the code says *what kind of ground* and the box says *how far*. Same
  // arrangement the Pacific Northwest and the St Lawrence Lowlands use.
  //
  // Two honest edges, because a global layer at this scale cannot trace a
  // plain:
  //   - Maebashi and Takasaki sit on the plain but the layer calls them 683
  //     (Taiheiyo montane deciduous forests), so they are refused. Their
  //     winters really are colder than Tokyo's, so the refusal costs less than
  //     it looks like it should — but it is the layer's call, not ours.
  //   - Chichibu and Hakone are mountains the layer still calls 682. The box
  //     cannot exclude them without also dropping Odawara and the Tama hills,
  //     so a reader at 700 m in Hakone gets a lowland list. `note` says so.
  ecoregion: [{ provider: "resolve-2017", codes: ["682"] }],
  // Konara oak: the tree the satoyama coppice was built on, cut on a twenty-year
  // rotation for charcoal and mushroom logs for centuries, and the single
  // richest plant for caterpillars in the country.
  featuredPlantId: "quercus-serrata",
  featuredHostLepCount: 531,
};
