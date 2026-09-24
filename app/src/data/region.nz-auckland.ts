// nz-auckland: the region's own description — where it is, what it's called,
// and how a spot is placed in it. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.nz-auckland.ts` so that list can be
// a chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "nz-auckland",
  name: "Auckland & Northland",
  short: "Auckland & Northland",
  reference: "Auckland",
  zones: "≈9b–10b",
  note: "Native status is from Kew's World Checklist of Vascular Plants, and every plant here grows wild north of the Waikato. Caterpillar counts are from Plant-SyNZ, Manaaki Whenua – Landcare Research's record of which insects breed on which native plants.",
  extent: "From Cape Reinga south through Northland to Auckland, the Hauraki Gulf islands and the Coromandel Peninsula, stopping short of Hamilton and the Waikato.",
  // Coarse box over the northern North Island: Cape Reinga and the Three Kings
  // (~-34.1°) south to the Firth of Thames and the base of the Coromandel at
  // Waihi (~-37.45°), and from the Tasman coast (~172.0° E) east past the
  // Coromandel and Great Barrier (~176.0° E). Hamilton (-37.79°) and Tauranga
  // (-37.69°) fall outside it, on purpose — the Waikato and the Bay of Plenty
  // want their own lists.
  //
  // The box is the coarse claim; the RESOLVE code below refines it. Every
  // point on land inside the box is in ecoregion 173 — so is Hamilton, just
  // outside it, which is why the box's south edge, not the ecoregion, is what
  // hands the Waikato to a list of its own one day.
  bounds: { minLat: -37.45, maxLat: -34.1, minLon: 172.0, maxLon: 176.0 },
  // RESOLVE Ecoregions 2017, ECO_ID 173: Northland temperate kauri forests.
  // Confirmed live (`npm run probe:resolve`) for Auckland, Whangārei and
  // Hamilton, and against the local shapes for the rest of the box.
  ecoregion: { provider: "resolve-2017", codes: ["173"] },
  // Pōhutukawa: the New Zealand Christmas tree, crimson on every Auckland
  // cliff in December, and the tūī's summer larder.
  featuredPlantId: "metrosideros-excelsa",
  featuredHostLepCount: 17,
};
