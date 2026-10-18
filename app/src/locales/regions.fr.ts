// French names and caveats for the regions themselves.
//
// A region's `name`, `reference` and `note` are authored in English in its
// `plants.<id>.ts` file, beside the data they describe. Translating them there
// would put two languages in a data file; keeping them here means the catalog
// stays single-language and a locale is one file to review.
//
// Entries are **optional** on purpose: adding a region shouldn't fail the build
// in every language before anyone has had a chance to translate it. A region
// with no entry falls back to its English metadata, which is legible to a
// French reader (a place name is a place name) rather than blank.
//
// One thing that is deliberately *not* translated: `zones`. The USDA hardiness
// range is a number range on an American scale, and the European regions
// already flag it with "≈" and explain in the chip's tooltip that it's a
// translation of the local convention rather than the convention itself.
export interface RegionText {
  name?: string;
  /** The short form (`RegionMeta.short`) — what fits on a pill or in a picker
   *  where the full name's qualifier would wrap. Same rule as the English one:
   *  drop a parenthetical, never widen the claim. */
  short?: string;
  reference?: string;
  note?: string;
  /** Where the region reaches, in landmarks (`RegionMeta.extent`) — the
   *  sentence that answers "does this include me?" without a map. */
  extent?: string;
  /** The states and provinces (`RegionMeta.areas`), in the same order. */
  areas?: string[];
}

export const REGIONS_FR: Record<string, RegionText> = {
  "mid-atlantic": {
    name: "Mid-Atlantic / piémont du Nord-Est",
    short: "Mid-Atlantic",
    reference: "Pennsylvanie",
    note: "Le statut d'indigène est établi pour le Piémont et les forêts du Nord-Est américain. Ailleurs, considérez ces choix comme non vérifiés.",
    extent: "Au nord jusqu'au sud de la Nouvelle-Angleterre, au sud jusqu'au centre de la Virginie, et de la côte atlantique vers l'ouest jusqu'aux crêtes des Appalaches.",
    areas: ["Pennsylvanie", "New Jersey", "Delaware", "Maryland", "Virginie", "État de New York", "Connecticut", "Rhode Island", "Massachusetts"],
  },
  pnw: {
    name: "Nord-Ouest Pacifique",
    short: "Nord-Ouest Pacifique",
    reference: "À l'ouest des Cascades, basses terres de Portland et Seattle",
    note: "Le statut d'indigène est établi pour le Nord-Ouest Pacifique maritime, à l'ouest de la chaîne des Cascades. À l'est de la crête, la flore est différente et plus sèche — considérez ces recommandations comme non vérifiées là-bas.",
    extent: "Au nord jusqu'à la frontière canadienne, au sud jusqu'à la limite Oregon–Californie, et de la côte Pacifique vers l'intérieur jusqu'à la crête des Cascades seulement — le versant ouest, celui qui reçoit la pluie.",
    areas: ["Oregon", "État de Washington", "Colombie-Britannique"],
  },
  "ca-south-coast": {
    name: "Californie du Sud",
    short: "Californie du Sud",
    reference: "Côte, vallées et contreforts de Los Angeles à San Diego",
    note: "Le statut d'indigène est établi pour la Californie du Sud cismontane — la côte, les vallées intérieures et les contreforts à l'ouest de la crête des montagnes, en gros de Santa Barbara à la frontière mexicaine. De l'autre côté de la crête, les déserts Mojave et du Colorado forment une flore différente, et la haute montagne est plus froide que ce que ces choix supposent ; considérez ces recommandations comme non vérifiées dans les deux cas.",
    extent: "De Santa Barbara au sud jusqu'à la frontière mexicaine, et du Pacifique vers l'intérieur jusqu'à la crête des montagnes — les chaînes Transverses et Péninsulaires — et pas au-delà. Palm Springs et le désert qui suit sont de l'autre côté de cette ligne.",
    areas: ["Californie"],
  },
  "florida-central": {
    name: "Floride du Nord et du Centre",
    short: "Floride nord et centre",
    reference: "La panhandle, Jacksonville et Orlando",
    note: "Le statut d'indigène est établi pour la façade nord et la péninsule tempérée chaude, en gros de la frontière de Géorgie jusqu'au lac Okeechobee. Le sud subtropical et les Keys ont leur propre liste. Quand une plante est en réalité une espèce du nord ou du sud de la Floride, ses zones de rusticité et ses notes le disent.",
    extent: "Au nord jusqu'à la frontière de la Géorgie, à l'ouest tout le long de la façade jusqu'à Pensacola, et au sud jusqu'au lac Okeechobee environ, où commence le sud subtropical.",
    areas: ["Floride"],
  },
  "florida-south": {
    name: "Sud de la Floride",
    short: "Sud de la Floride",
    reference: "Grand Miami, les Everglades et les Keys",
    note: "Le statut d'indigène est établi pour le sud subtropical de la Floride et les Keys, au sud du lac Okeechobee environ. Beaucoup d'espèces d'ici craignent le gel et n'ont leur place que dans cette région ; le nord et le centre de la Floride ont leur propre liste.",
    extent: "Du lac Okeechobee environ vers le sud : les Everglades, les côtes de Miami et de Naples, et toute la chaîne des Keys.",
    areas: ["Floride"],
  },
  "france-atlantic": {
    name: "France atlantique",
    short: "France atlantique",
    reference: "Paris, Nantes et Bordeaux",
    note: "Le statut d'indigène est établi pour la région biogéographique atlantique (océanique) de France métropolitaine — l'ouest et le nord, doux et pluvieux. Le sud méditerranéen, les Alpes et les Pyrénées, et l'est continental plus sec sont des flores différentes, avec leurs propres listes ; considérez ces recommandations comme non vérifiées là-bas. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de climat océanique tempéré.",
    extent: "L'ouest et le nord doux et pluvieux : du pied des Pyrénées au nord jusqu'à la Manche et à la frontière belge, et de la côte atlantique vers l'intérieur, en passant par Paris, jusqu'au Rhône environ.",
    areas: ["Bretagne", "Normandie", "Île-de-France", "Pays de la Loire", "Centre-Val de Loire", "Nouvelle-Aquitaine", "Hauts-de-France"],
  },
  "france-continental": {
    name: "France continentale",
    short: "France continentale",
    reference: "Dijon, Nancy et Strasbourg",
    note: "Le statut d'indigène est établi pour la région biogéographique continentale de France métropolitaine — le centre et l'est, aux hivers plus froids et aux étés plus chauds que la côte atlantique. L'ouest océanique, le sud méditerranéen et les Alpes sont des flores différentes, avec leurs propres listes ; considérez ces recommandations comme non vérifiées là-bas. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de climat continental tempéré.",
    extent: "Le centre et l'est : Bourgogne, Franche-Comté, Lorraine, Alsace et vallée du Rhône — à l'est de Paris, à l'ouest du Rhin, au nord de la Provence et en dessous des Alpes.",
    areas: ["Bourgogne", "Franche-Comté", "Grand Est", "Alsace", "Lorraine"],
  },
  "france-mediterranean": {
    name: "France méditerranéenne",
    short: "France méditerranéenne",
    reference: "Marseille, Montpellier et Nice",
    note: "Le statut d'indigène est établi pour la région biogéographique méditerranéenne de France métropolitaine — le sud chaud et sec, et la Corse. L'ouest océanique, l'est continental et les Alpes sont des flores différentes, avec leurs propres listes ; considérez ces recommandations comme non vérifiées là-bas. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de zone méditerranéenne.",
    extent: "La côte du sud et son arrière-pays, de la frontière espagnole jusqu'à Menton à la frontière italienne — et toute la Corse.",
    areas: ["Provence", "Côte d'Azur", "Occitanie", "Corse"],
  },
  "france-alpine": {
    name: "Les Alpes françaises",
    short: "Les Alpes françaises",
    reference: "Grenoble, Annecy et Briançon",
    note: "Le statut d'indigène est établi pour la région biogéographique alpine de France métropolitaine, et les plantes proposées ici sont choisies pour les Alpes en particulier : étages montagnard et subalpin, entre 600 et 2 000 m environ. Les Pyrénées relèvent de la même désignation européenne mais forment une flore distincte, avec ses propres endémiques ; elles sont délibérément laissées de côté plutôt que devinées. Plus bas, ce sont les régions continentale, atlantique et méditerranéenne qui s'appliquent. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de l'étage montagnard.",
    extent: "Les Alpes françaises uniquement — du Vercors et des Écrins au nord jusqu'au Chablais, et à l'est jusqu'à la frontière italienne. Terrain de montagne, entre 600 et 2 000 m environ. Les Pyrénées n'en font pas partie.",
    areas: ["Savoie", "Haute-Savoie", "Isère", "Hautes-Alpes"],
  },
  ireland: {
    name: "Irlande",
    short: "Irlande",
    reference: "Dublin, Cork et Galway",
    note: "Le statut d'indigène est établi pour l'île d'Irlande — la République comme l'Irlande du Nord — d'après la World Checklist of Vascular Plants de Kew. La flore irlandaise est plus pauvre que celles de la Grande-Bretagne ou de la France : la mer s'est refermée derrière les glaces en retrait avant l'arrivée de nombreuses espèces, si bien qu'il n'y a ici ni érable, ni tilleul, ni charme indigène, et que le hêtre et l'érable sycomore sont des introductions, si vieux qu'ils paraissent. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de climat océanique tempéré.",
    extent: "Toute l'île, de Mizen Head et Cork au sud jusqu'à Malin Head et la côte d'Antrim au nord, et des falaises atlantiques du Kerry, du Clare et du Donegal à l'ouest jusqu'à Dublin et la péninsule d'Ards à l'est.",
    areas: ["Irlande du Nord"],
  },
  "scotland-lowlands": {
    name: "Basses-Terres d'Écosse",
    short: "Basses-Terres d'Écosse",
    reference: "Glasgow, Édimbourg et Dundee",
    note: "Chaque plante de cette liste est notée indigène dans les propres carrés de 10 km de la région par le Plant Atlas 2020 de la BSBI, pas seulement quelque part en Grande-Bretagne. C'est pourquoi le pin sylvestre en est absent : dans les Basses-Terres, il est planté, et ses pinèdes indigènes sont dans les Highlands. Les chiffres d'insectes hôtes sont comptés à partir de la matrice européenne ouverte des associations lépidoptères–plantes (Gaytán et al. 2026), pour les espèces proches, indigènes et de climat océanique tempéré.",
    extent: "De la ligne des Highlands au nord jusqu'au Solway et à la frontière anglaise au sud, et des côtes de l'Ayrshire et du Galloway à l'ouest jusqu'aux Lothians, au Fife et à la Tay à l'est.",
    areas: ["Écosse"],
  },
  "st-lawrence": {
    areas: ["Québec", "Ontario", "Vermont", "État de New York"],
  },
  "ca-central-coast": {
    areas: ["Californie"],
  },
};
