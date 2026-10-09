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
}

/** Keyed by the catalog's Latin name exactly as written in the plant rows. */
export const SEED_BEARING: Record<string, SeedBearing> = {
  "Acer macrophyllum": { printed: "10", years: 10, where: "Acer, table 2" },
  "Acer rubrum": { printed: "4", years: 4, where: "Acer, table 2" },
  "Acer saccharum": { printed: "22", years: 22, where: "Acer, table 2" },
  "Aesculus californica": { printed: "5", years: 5, where: "Aesculus, table 3" },
  "Alnus rubra": { printed: "3–4", years: 4, where: "Alnus, table 3" },
  "Betula papyrifera": { printed: "15", years: 15, where: "Betula, table 3" },
  "Cornus florida": { printed: "6", years: 6, where: "Cornus, table 3" },
  "Cornus nuttallii": { printed: "10", years: 10, where: "Cornus, table 3" },
  "Fagus grandifolia": { printed: "40", years: 40, where: "Fagus, table 3" },
  "Fraxinus latifolia": { printed: "30", years: 30, where: "Fraxinus, table 3" },
  "Ilex vomitoria": { printed: "4–7", years: 7, where: "Ilex, table 3" },
  "Juglans californica": { printed: "5–8", years: 8, where: "Juglans, table 3" },
  "Picea sitchensis": { printed: "20", years: 20, where: "Picea, table 2" },
  "Pinus contorta": { printed: "4–8", years: 8, where: "Pinus, table 2 (var. contorta, shore pine)" },
  "Pinus coulteri": { printed: "8–20", years: 20, where: "Pinus, table 2" },
  "Pinus palustris": { printed: "20", years: 20, where: "Pinus, table 2" },
  "Pinus ponderosa": { printed: "16–20", years: 20, where: "Pinus, table 2 (var. ponderosa)" },
  "Pinus strobus": { printed: "5–10", years: 10, where: "Pinus, table 2" },
  "Pinus torreyana": { printed: "12–18", years: 18, where: "Pinus, table 2" },
  "Populus trichocarpa": { printed: "10", years: 10, where: "Populus, table 2 (as P. balsamifera ssp. trichocarpa)" },
  "Prunus ilicifolia": { printed: "3", years: 3, where: "Prunus, table 3" },
  "Prunus serotina": { printed: "5", years: 5, where: "Prunus, table 3" },
  "Pseudotsuga menziesii": { printed: "7–10", years: 10, where: "Pseudotsuga, table 3 (var. menziesii)" },
  "Quercus agrifolia": { printed: "15", years: 15, where: "Quercus, table 2" },
  "Quercus alba": { printed: "20", years: 20, where: "Quercus, table 2" },
  "Quercus rubra": { printed: "25", years: 25, where: "Quercus, table 2" },
  "Tsuga canadensis": { printed: "20–30", years: 30, where: "Tsuga, table 3" },
  "Tsuga heterophylla": { printed: "20–30", years: 30, where: "Tsuga, table 3" },
  "Viburnum dentatum": { printed: "3–4", years: 4, where: "Viburnum, table 3" },
  "Viburnum lentago": { printed: "8", years: 8, where: "Viburnum, table 3" },
};
