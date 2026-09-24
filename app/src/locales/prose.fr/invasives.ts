// The most-wanted invasives — `data/invasives.ts`.
//
// Each plant's three marks, keyed on its scientific name. Eleven more are not
// here: tree of heaven, holly, ivy, cherry laurel and the rest already have an
// entry in another file — as an impostor, an ornamental or a native — and a
// taxon lives in exactly one file (see `index.ts`), so their marks sit beside
// their other paragraphs there.
import type { ProseTable } from "../../lib/prose";

export const INVASIVES_FR: ProseTable = {
  "Schinus terebinthifolia": {
    marks: [
      { feature: "Odeur", text: "Froissées, les feuilles sentent le poivre et la térébenthine." },
      { feature: "Feuilles", text: "Folioles par paires, sur un pétiole souvent rouge." },
      { feature: "Baies", text: "Des grappes rouge vif tout l'hiver." },
    ],
  },
  "Elaeagnus umbellata": {
    marks: [
      { feature: "Feuilles", text: "Argentées dessous, comme saupoudrées de paillettes de métal." },
      { feature: "Baies", text: "Petites, rouges et piquetées d'argent, en automne." },
      { feature: "Fleurs", text: "De petites trompettes crème au parfum sucré, au printemps." },
    ],
  },
  "Lonicera morrowii": {
    marks: [
      { feature: "Rameaux", text: "Cassez-en un : le centre est creux. Celui d'un chèvrefeuille indigène est plein." },
      { feature: "Feuilles", text: "Douces et duveteuses, par paires, parmi les premières vertes au printemps." },
      { feature: "Baies", text: "Rouges, par paires, en été." },
    ],
  },
  "Spartium junceum": {
    marks: [
      { feature: "Tiges", text: "Rondes, lisses, comme des joncs, presque sans feuilles." },
      { feature: "Fleurs", text: "De grandes fleurs jaunes en papillon, très parfumées, du printemps à l'été." },
      { feature: "Taille", text: "Plus haut qu'une personne, et plus haut que le genêt à balais." },
    ],
  },
  "Genista monspessulana": {
    marks: [
      { feature: "Feuilles", text: "Des tiges feuillées, chaque feuille à trois petites folioles poilues." },
      { feature: "Fleurs", text: "Des fleurs jaunes en papillon, en petits bouquets sur de courts rameaux." },
      { feature: "Gousses", text: "Courtes et couvertes de poils argentés." },
    ],
  },
  "Urena lobata": {
    marks: [
      { feature: "Feuilles", text: "En forme de feuille d'érable, douces et poilues." },
      { feature: "Fleurs", text: "Petites et roses, comme un minuscule hibiscus." },
      { feature: "Fruits", text: "De petits fruits accrochants qui s'agrippent aux chaussettes et aux poils." },
    ],
  },
  "Ardisia elliptica": {
    marks: [
      { feature: "Baies", text: "Rouges, puis d'un noir luisant, comme les boutons d'une vieille bottine." },
      { feature: "Feuilles", text: "Épaisses et coriaces ; les jeunes feuilles sortent roses." },
      { feature: "Fleurs", text: "Des étoiles rose pâle en bouquets sous les feuilles." },
    ],
  },
  "Ludwigia peruviana": {
    marks: [
      { feature: "Fleurs", text: "Grandes, jaune vif, à quatre pétales ronds." },
      { feature: "Feuilles", text: "Poilues, en forme de lance." },
      { feature: "Où", text: "Les pieds dans l'eau, au bord des lacs, des fossés et des marais." },
    ],
  },
  "Agave americana": {
    marks: [
      { feature: "Feuilles", text: "Immenses, charnues et gris-bleu, terminées par une épine et bordées de crochets." },
      { feature: "Fleur", text: "Un seul mât plus haut qu'une maison, après bien des années — puis la plante meurt." },
      { feature: "Rejets", text: "Entourée de jeunes rosettes nées de ses racines." },
    ],
  },
  "Alliaria petiolata": {
    marks: [
      { feature: "Odeur", text: "Froissez une feuille : elle sent l'ail." },
      { feature: "Feuilles", text: "En rein et crénelées au pied ; triangulaires et dentées le long de la tige." },
      { feature: "Fleurs", text: "Petites, blanches, quatre pétales en croix, au printemps." },
    ],
  },
  "Reynoutria japonica": {
    marks: [
      { feature: "Tiges", text: "Des cannes creuses et articulées comme du bambou, tachetées de pourpre." },
      { feature: "Feuilles", text: "En forme de bouclier à base droite, en zigzag le long de la tige." },
      { feature: "Fleurs", text: "Des panaches de minuscules fleurs crème à la fin de l'été." },
    ],
  },
  "Centaurea stoebe": {
    marks: [
      { feature: "Capitules", text: "Rose-pourpre, comme ceux d'un chardon, mais sans piquants." },
      { feature: "Bractées", text: "Les écailles sous chaque fleur ont la pointe noire — ce sont les « taches »." },
      { feature: "Feuilles", text: "Gris-vert, découpées en lobes étroits." },
    ],
  },
  "Centaurea solstitialis": {
    marks: [
      { feature: "Capitules", text: "Jaunes, entourés de longues épines raides en étoile." },
      { feature: "Tiges", text: "Gris-vert, cotonneuses, bordées de fines ailes." },
      { feature: "Quand", text: "En fleur dans les prairies sèches au cœur de l'été, quand presque rien d'autre ne fleurit." },
    ],
  },
  "Geranium robertianum": {
    marks: [
      { feature: "Odeur", text: "Froissées, les feuilles sentent mauvais, comme le caoutchouc brûlé." },
      { feature: "Feuilles", text: "Découpées comme de la dentelle, souvent teintées de rouge." },
      { feature: "Fleurs", text: "Petites, roses, à cinq pétales, puis un long fruit en forme de bec." },
    ],
  },
  "Jacobaea vulgaris": {
    marks: [
      { feature: "Fleurs", text: "Des bouquets plats de petites marguerites jaunes." },
      { feature: "Feuilles", text: "Déchiquetées, profondément découpées." },
      { feature: "Chenilles", text: "Souvent rayées de jaune et de noir : des écailles du séneçon, introduites pour la manger." },
    ],
  },
  "Oncosiphon pilulifer": {
    marks: [
      { feature: "Fleurs", text: "Des boutons jaunes sans pétales, comme de petites billes." },
      { feature: "Odeur", text: "Frôlée, elle sent fort, comme la térébenthine." },
      { feature: "Feuilles", text: "Finement découpées, comme de la dentelle." },
    ],
  },
  "Impatiens glandulifera": {
    marks: [
      { feature: "Fleurs", text: "Roses, en forme de casque." },
      { feature: "Tiges", text: "Épaisses, creuses, rougeâtres et cassantes, plus hautes qu'une personne." },
      { feature: "Gousses", text: "Elles éclatent au toucher et projettent les graines." },
    ],
  },
  "Senecio inaequidens": {
    marks: [
      { feature: "Fleurs", text: "Des marguerites jaunes de l'été jusqu'aux gelées." },
      { feature: "Feuilles", text: "Étroites, presque comme des brins d'herbe." },
      { feature: "Où", text: "Bords de routes, voies ferrées, vignes et friches ensoleillées." },
    ],
  },
  "Phytolacca americana": {
    marks: [
      { feature: "Tiges", text: "Épaisses, lisses et rouge magenta." },
      { feature: "Baies", text: "Des grappes pendantes de baies noir-pourpre luisantes. Toxiques." },
      { feature: "Feuilles", text: "Grandes, lisses et ovales." },
    ],
  },
  "Gunnera tinctoria": {
    marks: [
      { feature: "Feuilles", text: "Énormes, comme de la rhubarbe, plus larges qu'un parapluie." },
      { feature: "Pétioles", text: "Épais et couverts d'épines molles." },
      { feature: "Fleurs", text: "Un cône de minuscules fleurs, comme un goupillon." },
    ],
  },
  "Arundo donax": {
    marks: [
      { feature: "Tiges", text: "Des cannes épaisses comme du bambou, bien plus hautes qu'une personne." },
      { feature: "Feuilles", text: "Larges, gris-vert, embrassant la canne jusqu'en haut." },
      { feature: "Plumets", text: "De grands plumets duveteux à la fin de l'été." },
    ],
  },
  "Cortaderia selloana": {
    marks: [
      { feature: "Plumets", text: "Hauts, argentés ou roses, portés bien au-dessus de la touffe." },
      { feature: "Feuilles", text: "Longues et retombantes, aux bords qui coupent la peau." },
      { feature: "Touffe", text: "Une fontaine dense plus large que vos bras écartés." },
    ],
  },
  "Celastrus orbiculatus": {
    marks: [
      { feature: "Baies", text: "Des enveloppes jaunes s'ouvrent sur des baies rouge orangé, tout le long de la tige." },
      { feature: "Feuilles", text: "Rondes, luisantes et finement dentées." },
      { feature: "Tiges", text: "Elles s'enroulent autour des arbres jusqu'à les étrangler." },
    ],
  },
  "Abrus precatorius": {
    marks: [
      { feature: "Graines", text: "Écarlates et luisantes, avec une tache noire. Mortelles si on les croque." },
      { feature: "Feuilles", text: "Composées, à nombreuses petites folioles par paires." },
      { feature: "Tiges", text: "Fines, s'enroulant sur les arbustes." },
    ],
  },
  "Dioscorea bulbifera": {
    marks: [
      { feature: "Bulbilles", text: "Des boules comme des pommes de terre, pendues à la liane." },
      { feature: "Feuilles", text: "Grandes, en cœur, aux nervures courbes." },
      { feature: "Tiges", text: "Elles s'enroulent jusqu'à la cime des arbres." },
    ],
  },
  "Carpobrotus edulis": {
    marks: [
      { feature: "Feuilles", text: "Épaisses, charnues et à trois faces, comme des doigts." },
      { feature: "Fleurs", text: "Grandes, jaunes ou roses, à nombreux pétales étroits." },
      { feature: "Port", text: "D'épais tapis sur les dunes et les falaises, rougissant au soleil." },
    ],
  },
  "Securigera varia": {
    marks: [
      { feature: "Fleurs", text: "Des fleurs roses et blanches en papillon, en couronne ronde sur une longue tige." },
      { feature: "Feuilles", text: "Nombreuses petites folioles par paires, sans vrilles." },
      { feature: "Port", text: "Des tapis étalés sur les talus des routes et les dunes." },
    ],
  },
  "Oxalis pes-caprae": {
    marks: [
      { feature: "Fleurs", text: "Des clochettes jaune vif, en hiver et au printemps." },
      { feature: "Feuilles", text: "Comme du trèfle : trois folioles en cœur, souvent tachées." },
      { feature: "Quand", text: "Elle tapisse le sol, puis disparaît sous terre dès l'été." },
    ],
  },
  "Nephrolepis cordifolia": {
    marks: [
      { feature: "Racines", text: "De petits tubercules ronds sur les racines, comme des perles." },
      { feature: "Frondes", text: "Dressées et étroites, à nombreuses petites folioles." },
      { feature: "Port", text: "Des colonies denses qui s'étendent par des stolons filiformes." },
    ],
  },
};
