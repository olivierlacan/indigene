// Minimum seed-bearing age, per species, from the USDA Woody Plant Seed Manual
// (Agriculture Handbook 727, 2008) — each genus chapter's table. A tree or shrub
// gets a seed-collecting reminder only when its chapter prints a figure for it;
// a blanket guess told gardeners to collect white oak acorns 15 years early.
export interface SeedBearing {
  /** The table's figure as printed: "20", "8–10". */
  printed: string;
  /** Years used by the app: the upper end of a range, so a reminder never comes early. */
  years: number;
  /** Where it is: the chapter and table, e.g. "Quercus, table 2". */
  where: string;
  /** Calendar months (1–12) in the printed fruit or cone ripening range, inclusive. */
  ripens?: number[];
  /** The ripening text as printed; several rows (areas) are joined with "; ". */
  ripensPrinted?: string;
  /** Where the ripening figure is: chapter, table, and column if not "fruit ripening". */
  ripensWhere?: string;
}

/** Keyed by the catalog's Latin name exactly as written in the plant rows. */
export const SEED_BEARING: Record<string, SeedBearing> = {
  "Acer macrophyllum": { printed: "10", years: 10, where: "Acer, table 2", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Acer, table 3" },
  "Acer rubrum": { printed: "4", years: 4, where: "Acer, table 2", ripens: [4, 5, 6], ripensPrinted: "Apr–June", ripensWhere: "Acer, table 3" },
  "Acer saccharum": { printed: "22", years: 22, where: "Acer, table 2", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Acer, table 3" },
  "Aesculus californica": { printed: "5", years: 5, where: "Aesculus, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Aesculus, table 2" },
  "Alnus rubra": { printed: "3–4", years: 4, where: "Alnus, table 3", ripens: [8, 9, 10], ripensPrinted: "Aug–Oct", ripensWhere: "Alnus, table 2" },
  "Betula papyrifera": { printed: "15", years: 15, where: "Betula, table 3", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Betula, table 2" },
  "Cornus florida": { printed: "6", years: 6, where: "Cornus, table 3", ripens: [9, 10], ripensPrinted: "Sept (N US)–Oct (S US)", ripensWhere: "Cornus, table 2" },
  "Cornus nuttallii": { printed: "10", years: 10, where: "Cornus, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Cornus, table 2" },
  "Fagus grandifolia": { printed: "40", years: 40, where: "Fagus, table 3", ripens: [9, 10, 11], ripensPrinted: "Sept–Nov", ripensWhere: "Fagus, table 2" },
  "Fraxinus latifolia": { printed: "30", years: 30, where: "Fraxinus, table 3", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Fraxinus, table 2" },
  "Ilex vomitoria": { printed: "4–7", years: 7, where: "Ilex, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Ilex, table 2" },
  "Juglans californica": { printed: "5–8", years: 8, where: "Juglans, table 3" },
  "Picea sitchensis": { printed: "20", years: 20, where: "Picea, table 2", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Picea, table 2 (cone ripening)" },
  "Pinus contorta": { printed: "4–8", years: 8, where: "Pinus, table 2 (var. contorta, shore pine)", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Pinus, table 3 (cone ripening, var. contorta)" },
  "Pinus coulteri": { printed: "8–20", years: 20, where: "Pinus, table 2", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Pinus, table 3 (cone ripening)" },
  "Pinus palustris": { printed: "20", years: 20, where: "Pinus, table 2", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Pinus, table 3 (cone ripening)" },
  "Pinus ponderosa": { printed: "16–20", years: 20, where: "Pinus, table 2 (var. ponderosa)", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Pinus, table 3 (cone ripening, var. ponderosa)" },
  "Pinus strobus": { printed: "5–10", years: 10, where: "Pinus, table 2", ripens: [8, 9], ripensPrinted: "Aug–Sept", ripensWhere: "Pinus, table 3 (cone ripening)" },
  "Pinus torreyana": { printed: "12–18", years: 18, where: "Pinus, table 2", ripens: [6, 7], ripensPrinted: "Jun–Jul*", ripensWhere: "Pinus, table 3 (cone ripening; * cones and seeds mature in the third year)" },
  "Populus trichocarpa": { printed: "10", years: 10, where: "Populus, table 2 (as P. balsamifera ssp. trichocarpa)", ripens: [5, 6, 7], ripensPrinted: "Late May–mid-July", ripensWhere: "Populus, table 3 (seed ripening & dispersal, one column)" },
  "Prunus ilicifolia": { printed: "3", years: 3, where: "Prunus, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct*", ripensWhere: "Prunus, table 2 (* collecting dates)" },
  "Prunus serotina": { printed: "5", years: 5, where: "Prunus, table 3", ripens: [6, 7, 8, 9], ripensPrinted: "June–July; Late Aug–Sept; June–Sept.", ripensWhere: "Prunus, table 2 (three rows)" },
  "Pseudotsuga menziesii": { printed: "7–10", years: 10, where: "Pseudotsuga, table 3 (var. menziesii)", ripens: [8], ripensPrinted: "Aug; Aug; August", ripensWhere: "Pseudotsuga, table 2 (cone ripening, var. menziesii)" },
  "Quercus agrifolia": { printed: "15", years: 15, where: "Quercus, table 2" },
  "Quercus alba": { printed: "20", years: 20, where: "Quercus, table 2" },
  "Quercus rubra": { printed: "25", years: 25, where: "Quercus, table 2" },
  "Tsuga canadensis": { printed: "20–30", years: 30, where: "Tsuga, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct", ripensWhere: "Tsuga, table 4" },
  "Tsuga heterophylla": { printed: "20–30", years: 30, where: "Tsuga, table 3", ripens: [8, 9, 10], ripensPrinted: "Sept–Oct; Sept 15; Sept–Oct; Aug", ripensWhere: "Tsuga, table 4 (four areas)" },
  "Viburnum dentatum": { printed: "3–4", years: 4, where: "Viburnum, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct (midrange)", ripensWhere: "Viburnum, table 2" },
  "Viburnum lentago": { printed: "8", years: 8, where: "Viburnum, table 3", ripens: [9, 10], ripensPrinted: "Sept–Oct (midrange)", ripensWhere: "Viburnum, table 2" },
};
