// st-lawrence: the region's own description — where it is, what it's called, and
// which ecoregions it claims. Small, and needed on nearly every page.
//
// Kept apart from the plant list in `plants.st-lawrence.ts` so that list can be a
// chunk of its own, fetched only when somebody looks at this region's plants.
// `regions.ts` explains the split.
import type { RegionMeta } from "./region";

export const REGION: RegionMeta = {
  id: "st-lawrence",
  name: "St Lawrence Lowlands",
  short: "St Lawrence",
  reference: "Montréal, Québec City, Ottawa & Lake Champlain",
  // Canada first: Montréal, Québec City and Ottawa carry most of the people
  // here, and Burlington and Plattsburgh are the southern end of the same plain.
  countries: ["CA", "US"],
  zones: "4b–5b",
  note: "Native status is asserted for the St Lawrence plain and the Champlain valley, from VASCAN — Canada's own plant database — for Québec. The region crosses two national borders because the lowland does: Montréal, Ottawa, Burlington and Plattsburgh are one ecoregion, and the river is its middle rather than its edge. Away from the plain — up on the Canadian Shield, or east past the Townships — the growing season shortens and the flora changes; treat these recommendations as untested there.",
  extent: "The St Lawrence plain from Québec City upriver past Trois-Rivières, Montréal and Ottawa to Kingston, the Eastern Townships behind it, and the Champlain valley south to Burlington and Plattsburgh.",
  // Coarse box over the lowland on both sides of the border: from the Champlain
  // valley's southern end (44.2° N) to just past Québec City (47.2° N), and from
  // the eastern end of Lake Ontario (-76.6) east to the Beauce (-70.2).
  //
  // The box is what stops this region at Québec City rather than carrying it to
  // Rimouski, and at the Townships rather than up onto the Shield. Two of its
  // ecoregions run far past the ground this list is written for — 8.1.1 sweeps
  // west to Lake Ontario and south down the Hudson, and 5.3.1 runs east through
  // Maine to the Gulf — so the codes say *what kind of ground* and the box says
  // *how far*. Same arrangement the Pacific Northwest uses.
  bounds: { minLat: 44.2, maxLat: 47.2, minLon: -76.6, maxLon: -70.2 },
  // **Two classifications, because the border runs through the middle of this
  // one.** The EPA's ecoregions stop at the Canadian line, so they can describe
  // Burlington and Plattsburgh but not Montréal; the CEC's cover the continent
  // and describe the whole thing. Selection tests whichever one replied — see
  // `RegionMeta.ecoregion`.
  //
  // The CEC set, confirmed point by point against the live service:
  //   8.1.1  Eastern Great Lakes and Hudson Lowlands — **the reason this region
  //          exists in this shape.** Montréal, Québec City, Trois-Rivières,
  //          Granby and Saint-Hyacinthe are 8.1.1, and so are Ottawa, Kingston,
  //          Plattsburgh and Burlington. One unit, two countries.
  //   5.3.1  Northern Appalachians and Atlantic Maritime Highlands — the
  //          Townships behind the plain: Sherbrooke, Magog, and the Green
  //          Mountain foot at Montpelier.
  // Deliberately excluded, though they are next door: Algonquin/Southern
  // Laurentians (5.2.3, which is Gatineau, across the river from an Ottawa this
  // region does claim) and the Central Laurentians (5.1.3, Saguenay). Both are
  // Shield country with a shorter season and an acid, thin soil this list is not
  // written for.
  //
  // The EPA set is the same ground where the EPA is the service that answers:
  // Eastern Great Lakes Lowlands (83) is 8.1.1's American half, Northeastern
  // Highlands (58) is 5.3.1's.
  ecoregion: [
    { provider: "epa-omernik", codes: ["83", "58"] },
    { provider: "cec-na", codes: ["8.1.1", "5.3.1"] },
  ],
  // Sugar maple: the tree the whole valley is named for in spring, host to
  // hundreds of caterpillars, and the one every child here can already draw.
  featuredPlantId: "acer-saccharum",
  featuredHostLepCount: 285,
};
