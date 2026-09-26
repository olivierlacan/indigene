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
    removal: {
      steps: [
        "Arrachez les semis à la main, racine comprise.",
        "Abattez les plus grands et dessouchez ou broyez la souche : elle repart de la base.",
        "Portez des gants — la sève irrite la peau, comme celle de l'herbe à la puce, sa cousine — et ne la brûlez jamais.",
      ],
      dispose: "Mettez les baies en sac ; ne les compostez pas.",
    },
  },
  "Elaeagnus umbellata": {
    marks: [
      { feature: "Feuilles", text: "Argentées dessous, comme saupoudrées de paillettes de métal." },
      { feature: "Baies", text: "Petites, rouges et piquetées d'argent, en automne." },
      { feature: "Fleurs", text: "De petites trompettes crème au parfum sucré, au printemps." },
    ],
    removal: {
      steps: [
        "Arrachez les semis et les petits arbustes avec leur racine, idéalement avec un levier.",
        "Ne vous contentez pas de couper un grand sujet : il repart plus dense. Dessouchez le collet, ou coupez chaque nouvelle pousse jusqu'à ce qu'il abandonne.",
        "Agissez avant l'automne, avant que les oiseaux prennent les baies.",
      ],
      dispose: "Les branches à baies vont à la poubelle.",
    },
  },
  "Lonicera morrowii": {
    marks: [
      { feature: "Rameaux", text: "Cassez-en un : le centre est creux. Celui d'un chèvrefeuille indigène est plein." },
      { feature: "Feuilles", text: "Douces et duveteuses, par paires, parmi les premières vertes au printemps." },
      { feature: "Baies", text: "Rouges, par paires, en été." },
    ],
    removal: {
      steps: [
        "Soulevez les arbustes entiers : les racines sont superficielles et viennent bien en sol humide.",
        "Allez-y au début du printemps — il feuille avant les indigènes, on le repère facilement.",
        "Arrachez les semis qui suivent pendant quelques années.",
      ],
      dispose: "Les branches à baies vont à la poubelle.",
    },
  },
  "Spartium junceum": {
    marks: [
      { feature: "Tiges", text: "Rondes, lisses, comme des joncs, presque sans feuilles." },
      { feature: "Fleurs", text: "De grandes fleurs jaunes en papillon, très parfumées, du printemps à l'été." },
      { feature: "Taille", text: "Plus haut qu'une personne, et plus haut que le genêt à balais." },
    ],
    removal: {
      steps: [
        "Arrachez les petits pieds quand le sol est mouillé.",
        "Coupez les grands au ras du sol en saison sèche, et coupez les rejets.",
        "Arrachez les semis chaque année : les graines vivent longtemps dans le sol.",
      ],
      dispose: "Mettez en sac les pieds portant des gousses.",
    },
  },
  "Genista monspessulana": {
    marks: [
      { feature: "Feuilles", text: "Des tiges feuillées, chaque feuille à trois petites folioles poilues." },
      { feature: "Fleurs", text: "Des fleurs jaunes en papillon, en petits bouquets sur de courts rameaux." },
      { feature: "Gousses", text: "Courtes et couvertes de poils argentés." },
    ],
    removal: {
      steps: [
        "Arrachez les petits pieds quand le sol est mouillé, avec un levier pour les plus gros.",
        "Coupez les plus grands au ras du sol en saison sèche, et coupez les rejets.",
        "Arrachez les semis chaque année et couvrez le sol nu : les graines durent des décennies.",
      ],
      dispose: "Mettez en sac les pieds portant des gousses.",
    },
  },
  "Urena lobata": {
    marks: [
      { feature: "Feuilles", text: "En forme de feuille d'érable, douces et poilues." },
      { feature: "Fleurs", text: "Petites et roses, comme un minuscule hibiscus." },
      { feature: "Fruits", text: "De petits fruits accrochants qui s'agrippent aux chaussettes et aux poils." },
    ],
    removal: {
      steps: [
        "Arrachez-la avant que les fruits accrochants mûrissent ; les racines viennent facilement.",
        "Portez des manches longues : les fruits s'agrippent.",
        "Arrachez les semis qui suivent pendant une saison ou deux.",
      ],
      dispose: "Mettez les fruits en sac.",
    },
  },
  "Ardisia elliptica": {
    marks: [
      { feature: "Baies", text: "Rouges, puis d'un noir luisant, comme les boutons d'une vieille bottine." },
      { feature: "Feuilles", text: "Épaisses et coriaces ; les jeunes feuilles sortent roses." },
      { feature: "Fleurs", text: "Des étoiles rose pâle en bouquets sous les feuilles." },
    ],
    removal: {
      steps: [
        "Arrachez les semis et les petits pieds avec toute la racine.",
        "Coupez les plus grands et dessouchez : la souche repart.",
        "Cueillez d'abord les baies et mettez-les en sac, puis revenez chaque année.",
      ],
      dispose: "Mettez les baies en sac ; ne les compostez pas.",
    },
  },
  "Ludwigia peruviana": {
    marks: [
      { feature: "Fleurs", text: "Grandes, jaune vif, à quatre pétales ronds." },
      { feature: "Feuilles", text: "Poilues, en forme de lance." },
      { feature: "Où", text: "Les pieds dans l'eau, au bord des lacs, des fossés et des marais." },
    ],
    removal: {
      steps: [
        "Arrachez les jeunes pieds dans la vase, racines comprises.",
        "Dans les eaux publiques, il faut une autorisation — renseignez-vous auprès du service de l'État chargé des espèces envahissantes.",
        "Revenez pour les repousses : chaque morceau de tige peut s'enraciner.",
      ],
      dispose: "Mettez chaque fragment en sac ; n'en laissez aucun près de l'eau.",
    },
  },
  "Agave americana": {
    marks: [
      { feature: "Feuilles", text: "Immenses, charnues et gris-bleu, terminées par une épine et bordées de crochets." },
      { feature: "Fleur", text: "Un seul mât plus haut qu'une maison, après bien des années — puis la plante meurt." },
      { feature: "Rejets", text: "Entourée de jeunes rosettes nées de ses racines." },
    ],
    removal: {
      steps: [
        "Déterrez entiers les jeunes rejets.",
        "Coupez les grands pieds sous le cœur et déterrez la base : les racines oubliées repartent.",
        "Portez des gants épais et des lunettes : les épines piquent et la sève brûle.",
      ],
      dispose: "Laissez sécher les morceaux hors du sol, puis jetez-les à la poubelle.",
    },
  },
  "Alliaria petiolata": {
    marks: [
      { feature: "Odeur", text: "Froissez une feuille : elle sent l'ail." },
      { feature: "Feuilles", text: "En rein et crénelées au pied ; triangulaires et dentées le long de la tige." },
      { feature: "Fleurs", text: "Petites, blanches, quatre pétales en croix, au printemps." },
    ],
    removal: {
      steps: [
        "Arrachez-la au printemps, avant les graines, quand le sol est humide — avec le haut de la racine.",
        "Mettez en sac les pieds déjà en fleur : arrachés, ils peuvent encore mûrir leurs graines.",
        "Recommencez chaque printemps : les graines durent environ cinq ans.",
      ],
      dispose: "En sac ; ne compostez pas les pieds en fleur ou en graines.",
    },
  },
  "Reynoutria japonica": {
    marks: [
      { feature: "Tiges", text: "Des cannes creuses et articulées comme du bambou, tachetées de pourpre." },
      { feature: "Feuilles", text: "En forme de bouclier à base droite, en zigzag le long de la tige." },
      { feature: "Fleurs", text: "Des panaches de minuscules fleurs crème à la fin de l'été." },
    ],
    removal: {
      steps: [
        "Ne la bêchez pas, ne la débroussaillez pas, ne la tondez pas : un bout de racine gros comme un ongle fait une nouvelle plante.",
        "Coupez ou arrachez chaque tige au ras du sol toutes les quelques semaines pendant la saison, des années durant, pour épuiser les racines.",
        "Un grand massif est une affaire de professionnels.",
      ],
      dispose: "Ne la compostez ni ne la déposez jamais : faites sécher les tiges sur une bâche jusqu'à ce qu'elles meurent, puis jetez-les.",
    },
  },
  "Centaurea stoebe": {
    marks: [
      { feature: "Capitules", text: "Rose-pourpre, comme ceux d'un chardon, mais sans piquants." },
      { feature: "Bractées", text: "Les écailles sous chaque fleur ont la pointe noire — ce sont les « taches »." },
      { feature: "Feuilles", text: "Gris-vert, découpées en lobes étroits." },
    ],
    removal: {
      steps: [
        "Arrachez-la avant les graines, avec le haut de la racine pivotante.",
        "Portez des gants : la sève peut irriter la peau.",
        "Recommencez chaque année : les graines durent plusieurs années.",
      ],
      dispose: "Mettez en sac les pieds portant des capitules.",
    },
  },
  "Centaurea solstitialis": {
    marks: [
      { feature: "Capitules", text: "Jaunes, entourés de longues épines raides en étoile." },
      { feature: "Tiges", text: "Gris-vert, cotonneuses, bordées de fines ailes." },
      { feature: "Quand", text: "En fleur dans les prairies sèches au cœur de l'été, quand presque rien d'autre ne fleurit." },
    ],
    removal: {
      steps: [
        "Arrachez-la ou binez-la à la fin du printemps, avant les épines et les graines.",
        "Ou fauchez-la au début de la floraison, s'il ne reste aucune feuille verte sous la lame.",
        "Tenez trois ans : la plupart des graines sont alors épuisées.",
      ],
      dispose: "Mettez en sac les pieds portant des capitules.",
    },
  },
  "Geranium robertianum": {
    marks: [
      { feature: "Odeur", text: "Froissées, les feuilles sentent mauvais, comme le caoutchouc brûlé." },
      { feature: "Feuilles", text: "Découpées comme de la dentelle, souvent teintées de rouge." },
      { feature: "Fleurs", text: "Petites, roses, à cinq pétales, puis un long fruit en forme de bec." },
    ],
    removal: {
      steps: [
        "Arrachez-le : ses racines superficielles viennent facilement.",
        "Arrachez-le avant que les fruits projettent leurs graines.",
        "Recommencez pendant la saison, et chaque année ensuite.",
      ],
      dispose: "Mettez en sac les pieds portant des fruits.",
    },
  },
  "Jacobaea vulgaris": {
    marks: [
      { feature: "Fleurs", text: "Des bouquets plats de petites marguerites jaunes." },
      { feature: "Feuilles", text: "Déchiquetées, profondément découpées." },
      { feature: "Chenilles", text: "Souvent rayées de jaune et de noir : des écailles du séneçon, introduites pour la manger." },
    ],
    removal: {
      steps: [
        "Arrachez-le ou déterrez-le avec des gants, avec la souche, avant la floraison.",
        "Retirez tous les morceaux de racine : il repart de chacun.",
        "Tenez-le loin du foin et des pâtures : il empoisonne chevaux et bovins, même sec.",
      ],
      dispose: "En sac ; jamais là où des animaux pâturent.",
    },
  },
  "Oncosiphon pilulifer": {
    marks: [
      { feature: "Fleurs", text: "Des boutons jaunes sans pétales, comme de petites billes." },
      { feature: "Odeur", text: "Frôlée, elle sent fort, comme la térébenthine." },
      { feature: "Feuilles", text: "Finement découpées, comme de la dentelle." },
    ],
    removal: {
      steps: [
        "Arrachez les jeunes pieds avant la floraison, avec des gants.",
        "Mettez-les tout de suite en sac : arrachés, ils mûrissent encore leurs graines.",
        "Recommencez l'hiver et le printemps suivants.",
      ],
      dispose: "En sac ; ne la compostez pas.",
    },
  },
  "Impatiens glandulifera": {
    marks: [
      { feature: "Fleurs", text: "Roses, en forme de casque." },
      { feature: "Tiges", text: "Épaisses, creuses, rougeâtres et cassantes, plus hautes qu'une personne." },
      { feature: "Gousses", text: "Elles éclatent au toucher et projettent les graines." },
    ],
    removal: {
      steps: [
        "Arrachez-la avant la floraison : elle vient presque sans effort.",
        "Commencez en amont et descendez : les graines voyagent avec l'eau.",
        "Recommencez deux ou trois ans, jusqu'à épuisement des graines.",
      ],
      dispose: "Laissez les pieds arrachés en tas hors du sol humide, ou mettez en sac ceux en fleur.",
    },
  },
  "Senecio inaequidens": {
    marks: [
      { feature: "Fleurs", text: "Des marguerites jaunes de l'été jusqu'aux gelées." },
      { feature: "Feuilles", text: "Étroites, presque comme des brins d'herbe." },
      { feature: "Où", text: "Bords de routes, voies ferrées, vignes et friches ensoleillées." },
    ],
    removal: {
      steps: [
        "Arrachez-le avec des gants, avec la souche, avant les graines.",
        "Mettez en sac les pieds déjà en fleur.",
        "Revenez toute l'année : il fleurit du printemps aux gelées.",
      ],
      dispose: "En sac ; ne compostez pas les pieds en fleur.",
    },
  },
  "Phytolacca americana": {
    marks: [
      { feature: "Tiges", text: "Épaisses, lisses et rouge magenta." },
      { feature: "Baies", text: "Des grappes pendantes de baies noir-pourpre luisantes. Toxiques." },
      { feature: "Feuilles", text: "Grandes, lisses et ovales." },
    ],
    removal: {
      steps: [
        "Coupez d'abord les grappes de baies et mettez-les en sac.",
        "Déterrez toute l'épaisse racine pivotante : un morceau oublié repart.",
        "Portez des gants : toute la plante est toxique.",
      ],
      dispose: "Les baies en sac ; le reste à la poubelle.",
    },
  },
  "Gunnera tinctoria": {
    marks: [
      { feature: "Feuilles", text: "Énormes, comme de la rhubarbe, plus larges qu'un parapluie." },
      { feature: "Pétioles", text: "Épais et couverts d'épines molles." },
      { feature: "Fleurs", text: "Un cône de minuscules fleurs, comme un goupillon." },
    ],
    removal: {
      steps: [
        "Coupez les épis de fleurs avant les graines.",
        "Déterrez les petits pieds avec tout le rhizome — l'épaisse souche à la base.",
        "Une grosse touffe est une affaire de professionnels.",
      ],
      dispose: "Ne jetez pas les morceaux dans la nature : ils s'enracinent.",
    },
  },
  "Arundo donax": {
    marks: [
      { feature: "Tiges", text: "Des cannes épaisses comme du bambou, bien plus hautes qu'une personne." },
      { feature: "Feuilles", text: "Larges, gris-vert, embrassant la canne jusqu'en haut." },
      { feature: "Plumets", text: "De grands plumets duveteux à la fin de l'été." },
    ],
    removal: {
      steps: [
        "Déterrez les petites touffes avec tous les morceaux de rhizome.",
        "Un grand massif est une affaire de professionnels.",
        "Ne laissez jamais de cannes coupées près d'un cours d'eau : les morceaux s'enracinent dans l'eau.",
      ],
      dispose: "Faites sécher les cannes loin de l'eau, puis jetez-les.",
    },
  },
  "Cortaderia selloana": {
    marks: [
      { feature: "Plumets", text: "Hauts, argentés ou roses, portés bien au-dessus de la touffe." },
      { feature: "Feuilles", text: "Longues et retombantes, aux bords qui coupent la peau." },
      { feature: "Touffe", text: "Une fontaine dense plus large que vos bras écartés." },
    ],
    removal: {
      steps: [
        "Coupez les plumets et mettez-les en sac avant qu'ils s'ouvrent.",
        "Déterrez toute la touffe à la pioche : une touffe coupée repart.",
        "Portez des gants et des manches longues : les feuilles coupent.",
      ],
      dispose: "Les plumets en sac ; les feuilles à la poubelle.",
    },
  },
  "Celastrus orbiculatus": {
    marks: [
      { feature: "Baies", text: "Des enveloppes jaunes s'ouvrent sur des baies rouge orangé, tout le long de la tige." },
      { feature: "Feuilles", text: "Rondes, luisantes et finement dentées." },
      { feature: "Tiges", text: "Elles s'enroulent autour des arbres jusqu'à les étrangler." },
    ],
    removal: {
      steps: [
        "Coupez chaque liane au pied, puis arrachez les racines orange : elles repartent.",
        "Ne tirez pas les lianes d'un arbre : coupez-les et laissez-les mourir en place.",
        "Arrachez chaque année les semis que rapportent les oiseaux.",
      ],
      dispose: "Les lianes à baies vont à la poubelle.",
    },
  },
  "Abrus precatorius": {
    marks: [
      { feature: "Graines", text: "Écarlates et luisantes, avec une tache noire. Mortelles si on les croque." },
      { feature: "Feuilles", text: "Composées, à nombreuses petites folioles par paires." },
      { feature: "Tiges", text: "Fines, s'enroulant sur les arbustes." },
    ],
    removal: {
      steps: [
        "Arrachez les lianes en suivant chacune jusqu'à sa racine.",
        "Ramassez et mettez en sac chaque gousse — loin des enfants et des animaux.",
        "Portez des gants, et arrachez les semis pendant quelques années.",
      ],
      dispose: "Les graines en sac ; ne les compostez jamais.",
    },
  },
  "Dioscorea bulbifera": {
    marks: [
      { feature: "Bulbilles", text: "Des boules comme des pommes de terre, pendues à la liane." },
      { feature: "Feuilles", text: "Grandes, en cœur, aux nervures courbes." },
      { feature: "Tiges", text: "Elles s'enroulent jusqu'à la cime des arbres." },
    ],
    removal: {
      steps: [
        "Ramassez chaque bulbille : chacune fait une nouvelle liane.",
        "Arrachez les lianes et déterrez le tubercule.",
        "Recommencez chaque année ; la Floride a aussi lâché des coléoptères qui s'en nourrissent.",
      ],
      dispose: "Les bulbilles en sac ; ne les compostez jamais.",
    },
  },
  "Carpobrotus edulis": {
    marks: [
      { feature: "Feuilles", text: "Épaisses, charnues et à trois faces, comme des doigts." },
      { feature: "Fleurs", text: "Grandes, jaunes ou roses, à nombreux pétales étroits." },
      { feature: "Port", text: "D'épais tapis sur les dunes et les falaises, rougissant au soleil." },
    ],
    removal: {
      steps: [
        "Arrachez-la à la main, en enroulant le tapis.",
        "Ramassez chaque fragment : les morceaux s'enracinent.",
        "Replantez le sol nu en indigènes, sinon elle revient.",
      ],
      dispose: "En sac ; ne laissez aucun morceau sur le sable ou le sol.",
    },
  },
  "Securigera varia": {
    marks: [
      { feature: "Fleurs", text: "Des fleurs roses et blanches en papillon, en couronne ronde sur une longue tige." },
      { feature: "Feuilles", text: "Nombreuses petites folioles par paires, sans vrilles." },
      { feature: "Port", text: "Des tapis étalés sur les talus des routes et les dunes." },
    ],
    removal: {
      steps: [
        "Déterrez les petites taches, racines comprises.",
        "Coupez ou fauchez les grandes avant la floraison, plusieurs fois par an, plusieurs années durant.",
        "Ou étouffez une tache sous un carton épais ou une bâche pendant une saison.",
      ],
      dispose: "Mettez en sac les pieds portant des gousses.",
    },
  },
  "Oxalis pes-caprae": {
    marks: [
      { feature: "Fleurs", text: "Des clochettes jaune vif, en hiver et au printemps." },
      { feature: "Feuilles", text: "Comme du trèfle : trois folioles en cœur, souvent tachées." },
      { feature: "Quand", text: "Elle tapisse le sol, puis disparaît sous terre dès l'été." },
    ],
    removal: {
      steps: [
        "Déterrez les petits bulbes en hiver, quand elle est verte et facile à trouver.",
        "Arracher les feuilles laisse les bulbes : creusez profond.",
        "Couvrez les zones travaillées d'un épais paillis.",
      ],
      dispose: "Les bulbes en sac ; ne les compostez pas.",
    },
  },
  "Nephrolepis cordifolia": {
    marks: [
      { feature: "Racines", text: "De petits tubercules ronds sur les racines, comme des perles." },
      { feature: "Frondes", text: "Dressées et étroites, à nombreuses petites folioles." },
      { feature: "Port", text: "Des colonies denses qui s'étendent par des stolons filiformes." },
    ],
    removal: {
      steps: [
        "Déterrez toute la plante, avec ses tubercules ronds.",
        "Tamisez la terre : chaque tubercule oublié repart.",
        "Arrachez les repousses pendant une saison.",
      ],
      dispose: "En sac ; ne compostez pas les tubercules.",
    },
  },
};
