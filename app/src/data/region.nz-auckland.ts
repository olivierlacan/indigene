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
  note: "Native status is asserted for New Zealand's North Island from Kew's World Checklist of Vascular Plants, and every plant here grows wild north of the Waikato. Caterpillar counts aren't in yet: no published count for New Zealand plants is one we can cite, so each plant is ranked on its other strengths until one is.",
  extent: "From Cape Reinga south through Northland to Auckland, the Hauraki Gulf islands and the Coromandel Peninsula, stopping short of Hamilton and the Waikato.",
  // Coarse box over the northern North Island: Cape Reinga and the Three Kings
  // (~-34.1°) south to the Firth of Thames and the base of the Coromandel at
  // Waihi (~-37.45°), and from the Tasman coast (~172.0° E) east past the
  // Coromandel and Great Barrier (~176.0° E). Hamilton (-37.79°) and Tauranga
  // (-37.69°) fall outside it, on purpose — the Waikato and the Bay of Plenty
  // want their own lists.
  //
  // **Box only, for now.** South of the equator the ecoregion comes from
  // RESOLVE (`resolve-2017`), whose hosted layer hasn't been confirmed from the
  // build sandbox yet (`npm run probe:resolve`). That is safe here in a way it
  // would not be in Canada: the box has sea on three sides and no other
  // region's box anywhere near it, so there is no neighbour's list for a point
  // to fall into by mistake. Add `ecoregion` with the probe's ECO_IDs when it
  // answers.
  bounds: { minLat: -37.45, maxLat: -34.1, minLon: 172.0, maxLon: 176.0 },
  // Pōhutukawa: the New Zealand Christmas tree, crimson on every Auckland
  // cliff in December, and the tūī's summer larder. Its caterpillar count is
  // not in yet — see `note` — so the figure below is null, never 0.
  featuredPlantId: "metrosideros-excelsa",
  featuredHostLepCount: null,
};
