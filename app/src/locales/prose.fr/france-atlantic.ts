// Atlantic France — the mild, rainy west and north, referenced on Nantes,
// Bordeaux and Paris. This was the first region translated, and deliberately so:
// these are the plants a French speaker standing in France is most often handed.
//
// See `./index.ts` for how the overlay works and what the translation
// conventions are. Six taxa here are shared with another French region and are
// written once, in this file, with their other region's wildlife ties included.
import type { ProseTable } from "../../lib/prose";

export const FRANCE_ATLANTIC: ProseTable = {
  // -------------------------------------------------------------------------
  // France atlantique — arbres.
  // -------------------------------------------------------------------------
  "Quercus robur": {
    nativeNote:
      "Le feuillu dominant des forêts de la France atlantique et la clé de voûte de son réseau alimentaire, de la Normandie aux Landes.",
    careNote:
      "Lent mais extraordinairement durable — un chêne planté aujourd'hui est pour le siècle prochain. Sa racine pivotante profonde le rend autonome et à l'épreuve de la sécheresse une fois installé, mais difficile à déplacer : plantez-en un petit et laissez-lui de la place, loin des bâtiments.",
    givesNote:
      "L'arbre le plus précieux qui soit pour la faune française : des centaines d'espèces de chenilles (et donc les oiseaux qui en nourrissent leurs petits), des glands pour les geais, les pics et les mammifères, et des siècles d'ombre et de carbone.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chêne germent dès l'automne, sans passage au froid, et ne doivent jamais sécher. À cause de la racine pivotante, démarrez-le en pot haut, ou semez-le là où il vivra.",
    supportNotes: {
      "purple-hairstreak":
        "Les chenilles de la thécla du chêne ne mangent que du chêne, rien d'autre. Tout le papillon se joue là-haut dans la canopée — les œufs sur les bourgeons, les chenilles sur les feuilles neuves, les adultes tournant autour du houppier — si bien qu'un vieux chêne dans une haie abrite une colonie que personne, en bas, ne remarque jamais.",
      "eurasian-jay":
        "Un geai emporte et enterre quelques milliers de glands chaque automne et en oublie assez pour être la principale raison de l'avancée des chênaies. Plantez un chêne, les geais planteront les autres.",
    },
  },
  "Betula pendula": {
    nativeNote:
      "Un pionnier rapide, au houppier léger, des landes, clairières et sols sableux pauvres de France.",
    careNote:
      "Rapide, aérien et peu exigeant — il prospère sur les sables les plus pauvres et ne donne qu'une ombre légère, si bien que d'autres plantes vivent volontiers dessous. Ses racines sont superficielles : gardez-le un peu à l'écart des canalisations.",
    givesNote:
      "L'une des toutes premières plantes nourricières de chenilles d'Europe — de quoi nourrir mésanges, fauvettes et sizerins — plus des graines pour les tarins et les pinsons, et une écorce blanche éclatante tout l'hiver.",
    propagationNote:
      "Récoltez les chatons mûrs à la fin de l'été, quand ils s'effritent, et répandez la graine, fine comme de la poussière, à la surface d'une terre humide — il lui faut la lumière, ne l'enterrez pas. Semée à l'automne et laissée dehors pour l'hiver, elle lève sans difficulté au printemps.",
    supportNotes: {
      "conifer-seed-finches":
        "Les chatons du bouleau s'effritent tout l'hiver en une graine si fine que seuls les petits fringilles s'en donnent la peine — tarins et sizerins se pendent la tête en bas au bout des rameaux pour l'atteindre, en général en une seule bande bruyante.",
    },
  },
  "Salix caprea": {
    nativeNote:
      "Le saule des bois frais, des lisières et des friches de France — et, fait rare chez les saules, il accepte un sol plus sec.",
    careNote:
      "Rapide et formant fourré — parfait pour tenir une lisière ou un talus humide, mais laissez-lui de la place. Ses chatons argentés puis dorés de fin d'hiver sont une nourriture de première importance ; il supporte mieux les terrains ordinaires que les autres saules.",
    givesNote:
      "Une clé de voûte : les saules hébergent plus de chenilles que presque tout le reste ici, de quoi nourrir les oiseaux au nid, et leurs chatons précoces sont une bouée de sauvetage pour les reines de bourdons et les premières abeilles, quand presque rien d'autre n'est en fleur.",
    propagationNote:
      "Le plus facile qui soit : coupez en fin d'hiver des rameaux nus gros comme un crayon et enfoncez-les en terre humide, ils s'enracinent tout seuls. (Le saule marsault s'enracine un peu moins volontiers que ses cousins : prenez-en quelques-uns de plus.) Sa graine cotonneuse ne vit que quelques jours ; si vous passez par elle, semez-la aussitôt sur de la vase.",
    supportNotes: {
      "purple-emperor":
        "Le grand mars changeant pond sur les saules, et c'est le marsault qu'il choisit le plus souvent. Sa chenille passe l'hiver aplatie contre un rameau, exactement de la couleur de l'écorce, et reverdit avec les feuilles.",
      "bumble-bees":
        "Une reine de bourdon sort d'hibernation en février sans aucune réserve et doit fonder une colonie entière toute seule ; pour cela il lui faut du pollen — des protéines pour les premières larves — et pas seulement du sucre. Les chatons de marsault en sont la première vraie provision de l'année, et c'est pourquoi un saule en fleur en fin d'hiver s'entend de l'autre bout du jardin.",
    },
  },
  "Prunus avium": {
    nativeNote:
      "Le cerisier sauvage des forêts de France, ancêtre de la cerise de verger, fréquent sur les sols riches.",
    careNote:
      "Rapide et lumineux — des nuages de fleurs blanches en avril et un feuillage d'automne flamboyant. Il drageonne un peu et devient grand : donnez-lui de l'espace ; il se plaît sur tout sol correct et non gorgé d'eau.",
    givesNote:
      "Sa floraison précoce nourrit les abeilles qui émergent, ses cerises d'été nourrissent merles, grives et mammifères, et — comme tous les Prunus — il élève une grande part des papillons de nuit indigènes et de leurs chenilles.",
    propagationNote:
      "Débarrassez les cerises mûres de leur chair et faites passer aux noyaux un long hiver froid et humide avant qu'ils ne lèvent — un semis dehors à l'automne s'en charge pour vous. Plus simple encore : déterrez et replantez les rejets enracinés qu'il pousse autour du tronc.",
    supportNotes: {
      hawfinch:
        "Tout le monde mange la chair d'une merise et laisse tomber le noyau. Le gros-bec fait l'inverse : il avale le fruit pour le noyau, le fend d'un bec capable de mettre cinquante kilos sur la soudure, et mange l'amande. Un merisier en juillet est l'endroit classique pour en trouver un — ou plutôt pour trouver, sous l'arbre, les noyaux coupés en deux qu'il a laissés en partant.",
      "mason-bees":
        "La floraison du merisier s'ouvre en avril d'un seul grand coup blanc, en fleurs largement ouvertes et peu profondes — exactement ce qu'une osmie ou une andrène tout juste émergée sait exploiter.",
    },
  },
  "Sorbus aucuparia": {
    nativeNote:
      "Un arbre indigène élancé et rustique des montagnes, des landes et des lisières de France.",
    careNote:
      "Petit, net et robuste — il encaisse le froid, le vent et les sols acides pauvres, ne donne qu'une ombre légère et tient dans un jardin modeste. Peu exigeant une fois installé.",
    givesNote:
      "Des corymbes crème pour les abeilles et les syrphes au printemps, puis de lourdes grappes de baies orange vif que grives mauvis, litornes, merles et jaseurs dépouillent tout l'automne.",
    propagationNote:
      "Écrasez les baies mûres, rincez bien la graine et faites-lui passer un hiver froid et humide (un semis dehors à l'automne convient très bien). La levée peut être irrégulière : gardez le pot un second printemps avant de renoncer.",
    supportNotes: {
      "winter-thrushes":
        "Un sorbier en fruits est l'arbre le plus bruyant de l'automne français — grives mauvis et litornes descendent droit dedans en sortant de la migration et peuvent le dépouiller en deux jours.",
    },
    lookalikeNotes: {
      "robinia-pseudoacacia": {
        why: "Tous deux portent une feuille découpée en de nombreuses folioles sur un même pétiole, et tous deux poussent sur les mêmes friches et bords de route.",
        tells: [
          { feature: "Folioles", native: "Dentées sur tout leur pourtour, comme une petite lame de scie.", lookalike: "À bord lisse et ovale, avec une minuscule échancrure au bout." },
          { feature: "Épines", native: "Aucune.", lookalike: "Deux courtes épines raides à la base de chaque feuille, sur les jeunes pousses." },
          { feature: "Fleurs", native: "Des corymbes crème de multitudes de petites fleurs, en mai.", lookalike: "Des grappes pendantes de fleurs blanches en forme de pois, très parfumées, fin mai." },
          { feature: "Fruits", native: "Des grappes de baies orange vif que les grives dépouillent à l'automne.", lookalike: "Des gousses brunes et plates qui claquent dans les branches tout l'hiver." },
        ],
      },
    },
  },
  "Carpinus betulus": {
    nativeNote:
      "Un arbre forestier dense et patient du nord et de l'ouest de la France, et la haie taillée classique des jardins français.",
    careNote:
      "Il supporte l'ombre, l'argile et la taille sévère — en arbre libre il forme un grand houppier en dôme, mais il est surtout précieux en haie, qui garde ses feuilles mortes cuivrées tout l'hiver et fait écran et abri. Les chevreuils le laissent tranquille.",
    givesNote:
      "Il héberge toute une gamme de chenilles, nourrit gros-becs et mésanges avec ses samares, et — taillé en haie — offre un couvert de nidification dense toute l'année ainsi qu'un brise-vent.",
    propagationNote:
      "Récoltez les graines ailées à l'automne et semez-les aussitôt dehors — prises bien mûres il leur faut un hiver, mais si elles ont séché elles peuvent bouder deux ans. De la patience et un pot dehors sont tout ce qu'elles demandent.",
    supportNotes: {
      hawfinch:
        "La graine de charme est ce qui fait passer l'hiver européen aux gros-becs, plus que celle d'aucun autre arbre. Les petites noix côtelées tiennent dans une aile papyracée à trois pointes et restent sur les rameaux longtemps après que les feuilles ont bruni et se sont accrochées, et les oiseaux les travaillent jusqu'en mars.",
    },
  },
  "Alnus glutinosa": {
    nativeNote:
      "L'arbre des bords de rivière, des bois humides et des plaines inondables de France, qui s'enracine sans peine là où le sol est trop mouillé pour tout le reste.",
    careNote:
      "La réponse à un coin humide et difficile : il prospère en terrain gorgé d'eau et fixe même son propre azote, enrichissant les sols pauvres et humides. Rapide ; laissez de la place à un grand arbre de berge, à l'écart des canalisations.",
    givesNote:
      "Ses racines cuirassent une berge contre l'érosion, ses chatons de fin d'hiver nourrissent les premières abeilles, ses petits fruits en forme de cônes nourrissent tarins et sizerins, et il héberge de nombreux papillons de nuit — une zone humide entière dans un seul arbre.",
    propagationNote:
      "Récoltez les petits cônes ligneux à l'automne, séchez-les jusqu'à ce qu'ils libèrent leurs graines, et semez en surface sur une terre humide — il lui faut lumière et humidité, pas de froid. Des boutures ligneuses enfoncées en sol mouillé prennent aussi.",
    supportNotes: {
      "conifer-seed-finches":
        "Les petits cônes ligneux de l'aulne gardent leur graine tout l'hiver, et tarins et sizerins les travaillent suspendus la tête en bas en bandes jacassantes — l'image classique d'un mois de janvier au bord d'une rivière française.",
    },
  },
  "Populus tremula": {
    nativeNote:
      "Le peuplier bruissant des landes, des lisières et des creux humides de France — l'arbre dont les feuilles bougent quand rien d'autre ne bouge.",
    careNote:
      "Rapide, bon marché et généreux — et il drageonne. De nouvelles pousses sortent à plusieurs mètres du tronc, à travers une pelouse ou un massif : c'est ainsi qu'un tremble devient un bosquet. Plantez-le là où c'est bienvenu (une limite, un coin en friche, un talus à tenir) et tondez les rejets ailleurs ; ce n'est pas un arbre pour une petite cour pavée.",
    givesNote:
      "Après les chênes et les saules, c'est le plus grand arbre à chenilles de France — bien plus de deux cents espèces de papillons de nuit, dont le sphinx du peuplier, autrement dit de quoi nourrir toutes les nichées de mésanges et de fauvettes à la ronde. Ses chatons précoces donnent du pollen au moment le plus maigre de l'année, et ses pétioles aplatis font frissonner tout le houppier au moindre souffle que rien d'autre ne remarque.",
    propagationNote:
      "De loin le plus facile : déterrez un drageon enraciné en hiver et replantez-le. De courts morceaux de racine, gros comme un doigt, couchés au début du printemps dans un pot de terreau sableux, poussent aussi. La graine cotonneuse est un mauvais pari — elle ne vit que quelques jours, il faut donc l'attraper à la fin du printemps et la semer aussitôt sur de la vase.",
    supportNotes: {
      "poplar-hawk-moth":
        "Le tremble et les autres peupliers, avec les saules, sont ce sur quoi grandit le sphinx du peuplier. C'est le grand sphinx que les gens trouvent vraiment — sur un mur près d'une lampe d'entrée en juin, posé de cette façon bizarre, ailes postérieures poussées en avant — et chacun d'eux a mangé des feuilles de peuplier pour arriver là.",
      "mason-bees":
        "Le tremble est pollinisé par le vent et ne demande rien à un insecte, mais il lâche une quantité énorme de pollen en mars et les abeilles solitaires précoces le récoltent quand même — un repas gratuit au moment du printemps où il n'y a presque rien d'autre.",
    },
  },
  "Fagus sylvatica": {
    nativeNote:
      "Le grand arbre au tronc gris des hêtraies normandes et picardes — Brotonne, Lyons, Eu — et des hauts talus de hêtre taillé du Perche.",
    careNote:
      "Le nord et l'ouest doux et humides, c'est le pays du hêtre : sur une terre qui reste régulièrement fraîche et bien drainée, il devient le plus grand arbre d'ici. Mais c'est le moins résistant à la sécheresse de tous, racines superficielles et aucune réserve — les étés chauds de la dernière décennie ont tué des hêtres net plus au sud. Alors sur du sable sec, une mince couche de craie ou une exposition plein sud brûlante, plantez un chêne à la place. Presque rien ne pousse à son ombre. Taillé en haie, il garde ses feuilles cuivrées tout l'hiver.",
    givesNote:
      "La faîne est une nourriture d'automne majeure pour les pinsons du Nord, les pinsons des arbres, les sittelles, les mulots, les blaireaux et les sangliers, et un vieux hêtre se creuse en immeuble de trous et de fentes pour les pics, les mésanges et les chauves-souris. Sa liste de chenilles est honorable plutôt qu'énorme.",
    propagationNote:
      "Récoltez les faînes triangulaires dans leur cupule hérissée à l'automne — la plupart des années beaucoup sont vides, ramassez donc largement et faites le test de flottaison. Il leur faut environ trois mois de froid humide, qu'un semis d'automne en pot laissé dehors fournit gratuitement.",
    supportNotes: {
      hawfinch:
        "La faîne est la nourriture d'hiver de base du gros-bec, et lors d'une bonne année à faînes les oiseaux se rassemblent à la cime des hêtres en nombres qu'on ne leur voit jamais autrement — puis disparaissent au printemps.",
    },
  },
  "Tilia cordata": {
    nativeNote:
      "Dispersé à l'état sauvage dans les bois atlantiques et planté sur une place de village sur deux — le tilleul dont les fleurs donnent l'infusion du même nom.",
    careNote:
      "De longue vie, tolérant à l'argile et à l'air des villes, il supporte la taille sévère mieux qu'aucun autre grand arbre indigène — c'est pourquoi les villages français les taillent en têtards depuis des siècles, et pourquoi on peut le maintenir à la bonne dimension. Les pucerons du tilleul font pleuvoir du miellat au cœur de l'été : ce n'est pas l'arbre sous lequel garer une voiture.",
    givesNote:
      "Fin juin, un tilleul en fleur s'entend de l'autre bout du jardin : c'est l'un des plus grands arbres à nectar d'Europe, qui nourrit abeilles, syrphes et papillons de nuit pendant quinze jours, dans le mois creux entre la floraison des haies et les fleurs de fin d'été. Un bon compte de chenilles aussi, et les vieux tilleuls se creusent en quelques-uns des meilleurs gîtes à chauves-souris et à chouettes qui soient.",
    propagationNote:
      "La graine de tilleul est réputée lente — le tégument et l'embryon la retiennent tous deux, si bien que les fruits récoltés attendent souvent deux hivers. Semez-les frais et encore un peu verts, en pot laissé dehors. Beaucoup plus rapide : marcottez une pousse basse, ou déterrez l'un des rejets qu'un vieil arbre pousse à son pied.",
    supportNotes: {
      "bumble-bees":
        "Un tilleul en fleur à la fin juin s'entend de l'autre côté du jardin. Il arrive au moment le plus creux de l'année — la floraison des haies terminée, les fleurs tardives pas commencées — et pendant quinze jours c'est le plus gros repas disponible pour les bourdons à des kilomètres.",
    },
  },
  "Ulmus glabra": {
    nativeNote:
      "L'orme indigène des bords de ruisseau, des bois humides et des talus de haie de France — celui qui se ressème au lieu de s'étendre par drageons.",
    careNote:
      "Disons d'abord le plus dur : la graphiose. Un champignon transporté par un petit scolyte a tué la plupart des grands ormes d'Europe depuis les années 1970, et il est toujours là. Le scolyte ne peut se reproduire que dans une écorce d'au moins une largeur de main d'épaisseur, si bien qu'un orme est en général tranquille tant qu'il est jeune et meurt d'ordinaire entre quinze et vingt-cinq ans, une fois assez gros pour en valoir la peine. Ce n'est pas une raison de le laisser de côté, mais cela décide de la façon de le planter : en haie ou en cépée recépée tous les quelques années, il garde une écorce mince et peut vivre indéfiniment, et même un arbre qui meurt à vingt ans aura nourri chenilles et papillons pendant deux décennies. N'en faites simplement pas l'arbre sur lequel vous comptez pour de l'ombre en 2060.",
    givesNote:
      "L'orme est la seule nourriture de la thécla de l'Orme, un petit papillon qui a chuté avec son arbre et vit haut dans le houppier, plus une bonne centaine d'espèces de papillons de nuit. Ses samares papyracées mûrissent en avril, des semaines avant que quoi que ce soit d'autre ne grène, et bouvreuils et verdiers les dépouillent ; ses fleurs s'ouvrent en février, l'une des toutes premières sources de pollen de l'année.",
    propagationNote:
      "Fait rare chez nos arbres, la graine d'orme mûrit au printemps et non à l'automne, et elle n'attend pas : cueillez les samares en avril ou mai, encore un peu vertes, semez-les aussitôt à peine recouvertes, tenez-les au chaud et à l'humide, et elles lèvent en quinze jours sans aucun passage au froid. Une branche basse couchée en terre s'enracine également.",
    supportNotes: {
      "white-letter-hairstreak":
        "L'orme est la seule chose que mangent les chenilles de ce papillon, et il pond sur les boutons floraux, haut dans le houppier : une colonie peut donc tenir au-dessus d'une haie pendant des années sans que personne, en dessous, s'en aperçoive. Elle a chuté avec les ormes et revient avec eux — c'est l'argument honnête pour en planter un tout en sachant que la maladie court toujours.",
      comma:
        "L'orme est l'une des plantes nourricières du robert-le-diable, avec le houblon et l'ortie — ce papillon aux ailes déchiquetées qui passe l'hiver serré contre un rameau, exactement semblable à une feuille morte.",
    },
  },
  "Pyrus pyraster": {
    nativeNote:
      "Le poirier sauvage épineux des haies atlantiques et des vieux talus de bocage — ancêtre du poirier de verger, et un arbre devant lequel presque tout le monde passe sans le voir.",
    careNote:
      "Lent, étroit et très robuste — une fois ses racines profondes en place, il se moque de la sécheresse et des terrains pauvres, et il tient dans une ligne de haie là où un merisier ou un tilleul ne tiendrait pas. Ses courts rameaux latéraux finissent en véritables épines : gardez-le à l'écart d'un passage. Les petites poires dures sont pierreuses et acides, à ne pas manger. Achetez un vrai poirier sauvage chez un pépiniériste de plants de haie plutôt qu'un cultivar fruitier, et vérifiez qu'il n'a pas été greffé sur un porte-greffe.",
    givesNote:
      "Une floraison blanche en avril, quinze jours avant l'aubépine, qui nourrit les abeilles au moment du printemps où les premiers arbres sont passés. Plus d'une centaine d'espèces de chenilles utilisent les poiriers sauvages, les petits fruits durs blettissent après les premières gelées et nourrissent grives, blaireaux, sangliers et mulots, et un vieux poirier se creuse tôt, ce qui en fait un arbre à cavités bien avant qu'un chêne ne le devienne.",
    propagationNote:
      "Prélevez les pépins de fruits ramassés après les premières gelées, débarrassez-les de la moindre parcelle de chair, et semez-les dehors à l'automne pour l'hiver froid et humide qu'il leur faut. Les pépinières greffent normalement les poiriers ; par semis vous obtenez un vrai arbre sauvage, mais attendez-vous à ce qu'il soit lent et reste un an sans bouger.",
    supportNotes: {
      "mason-bees":
        "Le poirier sauvage fleurit début avril, une bonne quinzaine avant l'aubépine, et comble le creux qui suit la fin du prunellier — précisément le moment où les abeilles solitaires approvisionnent leurs nids.",
      "winter-thrushes":
        "Les petites poires sont dures comme pierre et immangeables jusqu'à ce que le gel les blettisse, et c'est tout l'intérêt : elles deviennent bonnes en décembre, quand la haie n'a plus rien, et grives et merles descendent au sol pour elles.",
    },
  },

  // -------------------------------------------------------------------------
  // France atlantique — arbustes.
  // -------------------------------------------------------------------------
  "Crataegus monogyna": {
    nativeNote:
      "L'arbuste qui fait l'ossature du bocage atlantique — ces haies vives qui recousent la campagne française.",
    careNote:
      "Quasi indestructible — il encaisse le vent, l'argile, la sécheresse et la taille sévère, et forme une haie épineuse impénétrable, la meilleure structure pour la faune que vous puissiez planter. Placez les épines à l'écart des passages.",
    givesNote:
      "Son écume de fleurs de mai nourrit une foule d'abeilles, de syrphes et de coléoptères ; ses cenelles d'automne nourrissent grives, merles et migrateurs hivernants ; et son fourré épineux dense héberge de nombreuses chenilles et abrite les oiseaux nicheurs.",
    propagationNote:
      "Les cenelles sont têtues : nettoyez la graine et comptez deux hivers dehors avant la levée — semez en pot et prenez patience. Bien plus rapide pour une haie : achetez ou prélevez des plants à racines nues en hiver.",
    supportNotes: {
      "winter-thrushes":
        "Une haie d'aubépines est ce qui fait passer l'hiver français aux grives litornes et mauvis — elles arrivent en bandes et dépouillent une haie après l'autre.",
      "bumble-bees":
        "L'écume de fleurs d'aubépine en mai est l'un des plus gros événements à nectar de l'année d'une haie.",
    },
  },
  "Prunus spinosa": {
    nativeNote:
      "Le compagnon épineux de l'aubépine dans les haies de toute la France atlantique — ses prunelles parfument le patxaran et le gin de prunelle.",
    careNote:
      "Il fleurit sur le bois noir et nu avant les feuilles, en mars — la première floraison de la haie. Il drageonne librement en fourré épineux : laissez-lui de la place ou une ligne de haie où courir ; robuste et à l'épreuve de la sécheresse.",
    givesNote:
      "Ses fleurs très précoces nourrissent les premières abeilles quand rien d'autre n'est ouvert ; comme tous les Prunus c'est une grande plante nourricière de chenilles (la thécla du prunier en dépend) ; et les prunelles nourrissent les oiseaux comme les gens.",
    propagationNote:
      "De loin le plus simple : soulevez en hiver les drageons enracinés qu'il produit et replantez-les. Par les fruits c'est lent — nettoyez les noyaux des prunelles mûres et comptez jusqu'à deux hivers dehors avant la levée.",
    supportNotes: {
      "winter-thrushes":
        "Les prunelles tiennent longtemps après que les autres fruits ont disparu — exactement quand les grives hivernantes en ont besoin.",
      "mason-bees":
        "Le prunellier fleurit sur le bois nu en mars, avant ses propres feuilles : un repas précoce pour les abeilles solitaires qui viennent d'émerger.",
    },
  },
  "Corylus avellana": {
    nativeNote:
      "L'arbuste de sous-bois à cépée des forêts françaises, taillé en taillis depuis des siècles pour ses baguettes droites et ses noisettes.",
    careNote:
      "Facile, tolérant à l'ombre et de longue vie — il accepte un sol ordinaire et le recépage sévère, repartant de la souche pendant des siècles. Coupez chaque hiver quelques-unes des plus vieilles tiges au ras du sol pour le garder jeune et productif.",
    givesNote:
      "Ses chatons jaunes pendants — les « queues d'agneau » — sont l'une des toutes premières sources de pollen de l'année, ses feuilles hébergent de nombreux papillons de nuit, et ses noisettes d'automne nourrissent muscardins, écureuils, geais et sittelles.",
    propagationNote:
      "Semez les noisettes entières et mûres à l'automne, à l'abri des mulots, et laissez-leur un hiver froid ; elles lèvent au printemps suivant. Plus simple encore : couchez une tige basse au sol pour l'enraciner (marcottage), ou soulevez les rejets qu'il fait à la base.",
    supportNotes: {
      "hazel-dormouse":
        "Un muscardin doit à peu près doubler son poids avant de dormir six mois, et c'est sur les noisettes qu'il le fait. Il ouvre chacune d'un trou rond bien net, marques de dents inclinées autour du bord — souvent la seule preuve qu'on ait jamais que des muscardins vivent dans une haie.",
      "mason-bees":
        "Le noisetier est pollinisé par le vent et n'a besoin d'aucun insecte, mais ses chatons en queue d'agneau lâchent leur pollen en janvier et février et les premières abeilles solitaires le récoltent quand même — en général le premier pollen de l'année, un filet avant l'ouverture des saules.",
    },
  },
  "Ilex aquifolium": {
    // Native here, impostor in the Pacific Northwest — so this one key carries
    // both kinds of writing, as `lib/prose.ts` expects. The plant fields serve
    // this page; `origin`/`blurb` serve `#/lookalikes/ilex-aquifolium`.
    origin:
      "Indigène de l'Europe de l'Ouest et de l'Afrique du Nord — y compris la France atlantique, où il figure sur notre propre liste d'indigènes.",
    blurb:
      "Le houx de Noël. Les oiseaux emportent ses baies loin dans les forêts du Nord-Ouest Pacifique, où il fait ce que peu de plantes savent faire : pousser régulièrement à l'ombre profonde des conifères, puis tenir ce terrain pendant des décennies. Là où il *est* indigène, c'est un élément ordinaire et précieux du bois.",
    nativeNote:
      "Le persistant indigène des bois et des haies de la France atlantique — luisant, piquant, reconnaissable entre tous en hiver.",
    careNote:
      "Lent mais très tolérant à l'ombre et de longue vie — un superbe persistant dense pour un coin ombragé ou une haie taillée. Il faut un pied femelle (et un mâle à proximité) pour avoir des baies ; celles-ci sont toxiques pour les personnes et les animaux domestiques.",
    givesNote:
      "Ses petites fleurs printanières nourrissent les abeilles, ses baies d'hiver sont une nourriture tardive essentielle pour grives et merles, son couvert dense et piquant abrite les oiseaux au dortoir et au nid toute l'année, et c'est la principale plante nourricière de l'azuré des nerpruns.",
    propagationNote:
      "Par les baies c'est très lent — la graine nettoyée peut demander deux ou trois hivers dehors avant de lever. La plupart des gens prélèvent plutôt des boutures semi-aoûtées à la fin de l'été, qui s'enracinent lentement mais sûrement sous châssis ombragé.",
    supportNotes: {
      "holly-blue":
        "La génération de printemps de l'azuré des nerpruns pond sur les boutons floraux du houx, et les chenilles mangent les baies en formation. La génération d'été passe ensuite au lierre : un jardin qui a les deux plantes garde le papillon toute la saison.",
      "winter-thrushes":
        "Le houx garde ses baies plus longtemps que tout le reste de la haie, et une grive draine défendra un seul buisson contre tous les autres oiseaux pendant les semaines les plus dures de l'hiver.",
    },
    lookalikeNotes: {
      "prunus-laurocerasus": {
        why: "Deux persistants luisants employés pour la même haie — et le laurier-palme est ce dont la plupart des haies de jardin sont faites aujourd'hui.",
        tells: [
          { feature: "Bord de la feuille", native: "Dur et ondulé, armé de piquants (les feuilles hautes en perdent souvent).", lookalike: "Plat et coriace, finement denté ou lisse — jamais piquant." },
          { feature: "Taille de la feuille", native: "À peu près la longueur d'un pouce.", lookalike: "À peu près la longueur d'une main." },
          { feature: "Froissez une feuille", native: "Pas d'odeur particulière.", lookalike: "Une odeur vive d'amande amère — c'est du cyanure." },
          { feature: "Fruits", native: "Des baies écarlates en hiver, sur les pieds femelles.", lookalike: "Des cerises noires en fin d'été, le long d'épis dressés." },
        ],
      },
    },
  },
  "Cornus sanguinea": {
    nativeNote:
      "Un arbuste de haie et de lisière de la France atlantique, dont les rameaux nus rougissent comme du sang en hiver.",
    careNote:
      "Robuste et adaptable, surtout sur sol calcaire ou frais ; il drageonne en fourré, alors utilisez-le pour garnir une haie ou un talus. Coupez chaque hiver un tiers des plus vieilles tiges pour obtenir les rameaux les plus rouges.",
    givesNote:
      "Ses corymbes crème nourrissent abeilles et syrphes, ses baies noires nourrissent les oiseaux d'automne, ses tiges rouges éclairent l'hiver, et le fourré abrite la faune et retient un talus.",
    propagationNote:
      "Enfoncez en hiver des boutures ligneuses dans une terre humide : la plupart prendront. Les tiges basses qui touchent le sol s'enracinent aussi d'elles-mêmes — coupez-les et déplacez-les.",
    supportNotes: {
      "blackcaps-warblers":
        "Les baies de cornouiller sont petites, noires et très huileuses — le genre de fruit gras qui fait prendre du poids à une fauvette — et elles mûrissent en septembre, exactement quand les oiseaux commencent à descendre vers le sud.",
    },
  },
  "Sambucus nigra": {
    nativeNote:
      "L'arbuste rapide et parfumé des haies et des friches de France, qui donne à la fois la fleur et la baie de sureau.",
    careNote:
      "Très rapide et indulgent, il prospère sur les sols riches, remaniés ou frais — rabattez-le sévèrement quand il s'effile, il repart. Les feuilles, l'écorce et les baies vertes crues sont toxiques ; ce sont les fleurs et les baies mûres cuites qui se consomment.",
    givesNote:
      "Ses grands plateaux de fleurs de début d'été nourrissent syrphes et abeilles, ses baies noir pourpre sont une nourriture d'automne majeure pour fauvettes, fauvettes à tête noire et grives qui font leurs réserves avant la migration, et il fabrique vite un couvert dense.",
    propagationNote:
      "À peu près aussi simple qu'une plantation puisse l'être — enfoncez en hiver des boutures ligneuses en terre, ou faites raciner des pousses tendres d'été en pot. Les deux prennent vite.",
    supportNotes: {
      "blackcaps-warblers":
        "La récolte de baies de sureau à la fin de l'été est du carburant de migration : fauvettes à tête noire, fauvettes des jardins et fauvettes grisettes se jettent sur un sureau en fruits et ne mangent presque rien d'autre tant qu'il dure.",
    },
  },
  "Frangula alnus": {
    nativeNote:
      "Un arbuste discret des bois humides, des tourbières et des landes de France — et, sans bruit, l'un des plus importants pour les papillons.",
    careNote:
      "Il veut une terre fraîche, acide à neutre, et accepte la mi-ombre — idéal pour une lisière humide ou un bord d'étang. Peu spectaculaire mais bien élevé ; les baies sont toxiques pour les personnes.",
    givesNote:
      "La principale plante nourricière du citron — plantez-la et vous verrez peut-être arriver au jardin ce grand papillon jaune du printemps — avec en prime de petites fleurs pour les abeilles et des baies qui virent du rouge au noir pour les oiseaux.",
    propagationNote:
      "Nettoyez la graine des baies mûres et faites-lui passer un hiver froid et humide dehors. Les boutures semi-aoûtées d'été sont l'autre voie ; les deux sont régulières plutôt que rapides.",
    supportNotes: {
      brimstone:
        "Les nerpruns sont la seule chose qu'une chenille de citron puisse manger, et la bourdaine est le nerprun des terres atlantiques fraîches et acides. Une femelle en quête trouvera un seul petit buisson dans toute une haie — un unique arbuste met donc vraiment le premier papillon du printemps dans un jardin.",
    },
  },
  "Calluna vulgaris": {
    nativeNote:
      "La bruyère des landes atlantiques — le violet des landes bretonnes, des Landes de Gascogne et des coteaux littoraux de Normandie à la fin de l'été.",
    careNote:
      "Terre acide, sableuse, ensoleillée et affamée — c'est toute la recette, et un sol riche ou une poignée de chaux la tue. Si votre terre est calcaire, elle ne s'installera jamais : cultivez-la alors en bac surélevé ou en large pot de terreau sans calcaire plutôt que de lutter contre le sol. Taillez-la légèrement chaque printemps, en n'entamant que la pousse tendre de l'an passé, sinon elle se dégarnit et devient ligneuse au centre. Elle vit une vingtaine d'années et se ressème doucement.",
    givesNote:
      "Le grand comptoir à nectar du mois d'août. Quand les prés sont fauchés et que les fleurs des haies sont passées depuis longtemps, un tapis de callune bourdonne de bourdons, d'abeilles domestiques, d'abeilles solitaires et de papillons — c'est de cette plante que vient le miel de bruyère. Elle élève bien plus d'une centaine d'espèces de chenilles, dont le petit paon de nuit et l'azuré de l'Ajonc, et son tapis dense abrite lézards, araignées et insectes en hivernage.",
    propagationNote:
      "Prélevez des extrémités de pousses en voie d'aoûtement à la fin de l'été et faites-les raciner sous abri dans un mélange sableux sans calcaire. Plus simple encore : butez du terreau acide sur la base d'un vieux pied au printemps ; les tiges enterrées s'enracinent et se détachent en nouveaux plants un an plus tard.",
    supportNotes: {
      "silver-studded-blue":
        "La callune est la plante de ce papillon, et les fourmis noires en sont l'autre moitié : elles trouvent la chenille, se nourrissent du liquide sucré qu'elle exsude et la gardent en échange, emportant souvent la chrysalide dans leur propre nid. C'est pourquoi il veut de la jeune bruyère, avec du sol nu et chaud entre les pieds, et non un tapis refermé.",
      "emperor-moth":
        "Les chenilles du petit paon de nuit grandissent sur la callune, et les mâles chassent les femelles au ras du tapis par les après-midi ensoleillés d'avril — un papillon brun-orangé rapide et zigzaguant, volant de jour, que presque tout le monde prend pour un papillon de jour.",
      "bumble-bees":
        "Quand les prés sont fauchés et les fleurs de haies passées depuis longtemps, une pente de callune en août est la dernière grande source de nectar de l'année — c'est de cette plante que vient le miel de bruyère.",
    },
  },
  "Vaccinium myrtillus": {
    nativeNote:
      "L'arbuste à baies hauteur de genou qui tapisse les chênaies et boulaies acides et les vieilles landes de l'ouest atlantique — bien plus vieux qu'il n'y paraît.",
    careNote:
      "Exigeante, et cela vaut la peine : une terre acide avec du vrai terreau de feuilles ou de l'écorce compostée dedans, des racines fraîches et ombragées, une lumière tamisée, et jamais de chaux ni de fumier. Elle s'étend vers l'extérieur par des coulants souterrains en un tapis bas, et met des années à le faire — mais une fois installée, elle est là pour des décennies et ne demande rien. Arrosez-la ses deux premiers étés ; ensuite, laissez-la tranquille.",
    givesNote:
      "À poids égal, la plus grande plante nourricière de cette liste après les arbres : plus de deux cents espèces de chenilles, dont la thécla de la ronce parmi celles que vous pourriez réellement voir. Ses clochettes roses nourrissent les bourdons en avril, et ses baies de juillet nourrissent merles, grives, muscardins et renards — et vous, si vous arrivez le premier.",
    propagationNote:
      "Soulevez au début du printemps un morceau enraciné de coulant et mettez-le en pot dans un mélange acide de type terre de bruyère sans tourbe — c'est la voie sûre. Par semis : écrasez des baies mûres, rincez la graine et pressez-la à la surface d'un terreau humide sans calcaire sans la recouvrir ; il lui faut de la lumière et un hiver froid, laissez donc le pot dehors.",
    supportNotes: {
      "green-hairstreak":
        "La myrtille est l'une des plantes nourricières de la thécla de la ronce, et sur les landes et les bois clairs atlantiques c'est souvent la principale.",
      "bumble-bees":
        "De petites clochettes roses en avril, pendues bouche en bas, si bien que rien n'y entre sinon une abeille prête à se tenir la tête à l'envers.",
      "winter-thrushes":
        "La récolte de baies de juillet nourrit merles, grives et merles à plastron — et muscardins et renards, si vous n'y êtes pas arrivé avant.",
    },
  },
  "Rubus fruticosus agg.": {
    nativeNote:
      "La mûre sauvage de toutes les haies, lisières et friches de France — non pas une espèce mais un essaim de centaines d'espèces quasi identiques, ce que veut dire le « agg. ».",
    careNote:
      "Plantez-la en sachant ce que vous faites. Une ronce lance près de deux mètres de tige neuve par an, s'enracine partout où une pointe touche le sol, et les oiseaux en sèment la graine un peu partout — dans un petit jardin, elle peut prendre un massif en trois étés, et l'arracher ensuite est un travail franchement pénible. Donnez-lui donc une limite que vous êtes prêt à rabattre sévèrement chaque hiver : le fond d'une haie, un talus, le coin le plus éloigné. Gardez-la à l'écart des passages, mettez des gants, et coupez chaque année les tiges qui ont fructifié. Si cela vous paraît plus d'engagement que vous n'en voulez, une mûre cultivée sans épines est bien plus docile — elle nourrit moins, mais elle nourrit, et elle reste où vous l'avez mise.",
    givesNote:
      "Elle fait quatre métiers à la fois, et aucun n'est petit : des mois de fleurs, en plein dans le creux d'août et septembre quand les prés ont séché, pour les bourdons, les abeilles domestiques, les syrphes et les papillons ; des mûres pour les merles, les fauvettes à tête noire, les renards, les muscardins et vous ; près de deux cents espèces de chenilles ; et un fourré épineux qui est l'un des endroits les plus sûrs où un oiseau puisse nicher ou un hérisson passer l'hiver. Dans la plupart des jardins français, c'est déjà la plante la plus utilisée par la faune sur la parcelle.",
    propagationNote:
      "Vous n'aurez presque jamais besoin d'essayer, mais sa propre méthode est le marcottage par la pointe : couchez en fin d'été une tige arquée, enterrez ses derniers centimètres, et au printemps cette pointe est un plant enraciné que vous pouvez détacher et déplacer. Les drageons enracinés et les boutures ligneuses d'hiver prennent tout aussi facilement.",
    supportNotes: {
      "bumble-bees":
        "La ronce fleurit tout au long d'août et de septembre, quand les prés ont séché et que la floraison des haies n'est plus qu'un souvenir. Un talus de ronces en fleur est, à ce moment de l'année, la chose la plus animée d'un jardin français.",
      "blackcaps-warblers":
        "Les mûres mûrissent quelques-unes à la fois, sur des semaines, plutôt que toutes d'un coup — exactement ce dont a besoin une fauvette qui prend sa graisse de migration : un approvisionnement, pas une orgie.",
      "hazel-dormouse":
        "Un muscardin mange les fleurs de ronce en été et les mûres en automne, et il se sert du fourré comme d'une route : il ne traverse pas le terrain découvert, si bien qu'une lisière de ronces qui longe une haie est sa seule façon d'aller où que ce soit.",
    },
  },
  "Cytisus scoparius": {
    nativeNote:
      "L'arbuste d'or des landes atlantiques, des talus sableux et des tranchées de voie ferrée — un mois de mai breton, c'est en grande partie lui et l'ajonc.",
    careNote:
      "Pauvre, sableux, acide, ensoleillé et sec : c'est exactement ce qu'il faut — il fabrique son propre azote, et une bonne terre ne fait qu'abréger sa vie. Il est de nature éphémère, dix à quinze ans, et il ne repart pas du vieux bois nu : ne taillez donc que les pousses vertes de l'année après la floraison, et prévoyez de le remplacer en son temps. Il se ressème, si bien qu'un remplaçant est en général déjà debout à côté. Les graines sont toxiques si on les avale.",
    givesNote:
      "Les bourdons déclenchent les fleurs : posez-vous sur l'une d'elles et les étamines jaillissent en giflant le dos de l'abeille de pollen — cela vaut de s'accroupir pour regarder. Il élève plus d'une centaine d'espèces de chenilles, ses gousses noires éclatent audiblement par les après-midi chauds de juillet et projettent de la graine pour les fringilles, et sa masse verte dense sert de couvert de nidification aux fauvettes grisettes, aux linottes et aux tariers pâtres.",
    propagationNote:
      "Le tégument est dur comme celui d'un pois : entaillez-le au papier de verre ou versez dessus de l'eau à peine bouillie et laissez tremper une nuit, puis semez en terre graveleuse à l'automne ou au printemps. Il fait une racine pivotante et supporte mal d'être déplacé : semez-le là où il doit vivre plutôt que de le rempoter.",
    supportNotes: {
      "green-hairstreak":
        "Le genêt à balais est l'une des principales plantes nourricières de la thécla de la ronce, avec l'ajonc, le genêt des teinturiers et la myrtille — le seul papillon vert d'Europe, et un papillon qu'on trouve en observant un talus broussailleux ensoleillé plutôt qu'un massif de fleurs.",
      "bumble-bees":
        "Les fleurs de genêt sont à ressort et restent fermées jusqu'à ce que quelque chose d'assez lourd s'y pose : un bourdon déclenche le cliquet, les étamines jaillissent et lui giflent le dos de pollen, et la fleur a fini son travail. Cela vaut de s'accroupir une fois pour regarder.",
      "goldfinches-linnets":
        "Les gousses noires s'ouvrent d'un claquement audible par un après-midi chaud de juillet et projettent la graine à un ou deux mètres — et les linottes, qui adorent un talus de genêts, la cherchent au sol comme dans les buissons.",
    },
  },
  "Genista tinctoria": {
    nativeNote:
      "Un arbuste bas et raide à fleurs jaunes des vieilles prairies de fauche, des lisières de landes et des herbages maigres de toute la France atlantique.",
    careNote:
      "Il veut ce qu'une vieille prairie de fauche lui donnait : plein soleil, terrain pauvre et non fertilisé, pas de voisins vigoureux. Lent à démarrer et facilement étouffé par les grosses graminées : plantez-le dans un gazon maigre ou sur un talus ensoleillé, tenez l'herbe coupée autour de lui ses premières années, et ne le nourrissez jamais. Une fois en place, il est de longue vie et ne demande absolument rien.",
    givesNote:
      "Son nom dit la vérité toute simple : c'est la plante qui a teint les tissus en jaune dans toute l'Europe, et par-dessus le pastel elle donnait le vert. Pour la faune, c'est une fleur de légumineuse assez raide pour que seul un bourdon puisse l'ouvrir, l'hôte de bien plus d'une centaine d'espèces de chenilles, et un fixateur d'azote qui nourrit discrètement la terre maigre où il se tient.",
    propagationNote:
      "Graine à tégument dur, comme toutes les légumineuses : entaillez-la ou faites-la tremper une nuit, puis semez en terreau graveleux à l'automne. Les pousses en voie d'aoûtement prélevées en fin d'été s'enracinent sous abri, lentement. Il a une racine pivotante et supporte mal d'être déplacé : plantez-le jeune et laissez-le.",
    supportNotes: {
      "green-hairstreak":
        "Le genêt des teinturiers est l'une des légumineuses arbustives sur lesquelles pond la thécla de la ronce, dans la même broussaille ensoleillée que le genêt à balais et l'ajonc.",
      "bumble-bees":
        "Encore une fleur de légumineuse à ressort, trop raide pour qu'une petite abeille l'ouvre — il faut le poids d'un bourdon pour la déclencher.",
    },
  },
  "Rosa arvensis": {
    nativeNote:
      "Le rosier blanc rampant des lisières et des haies ombragées de la France atlantique — il fleurit un mois après l'églantier et, contrairement à lui, accepte l'ombre.",
    careNote:
      "Il grimpe plus qu'il ne se tient : de longues tiges arquées qui s'appuient dans une haie, une clôture ou un grand arbuste et s'enracinent au contact du sol. Donnez-lui quelque chose où se coucher, et raccourcissez-le sévèrement en fin d'hiver s'il va plus loin que vous ne le voulez. C'est le seul rosier indigène qui fleurisse correctement à mi-ombre, ce qui en fait le rosier d'une haie exposée au nord ou d'une lisière boisée.",
    givesNote:
      "Des fleurs simples grandes ouvertes, pollen à portée de tous — une abeille peut vraiment s'en servir, contrairement à un rosier de jardin double, qui pour un insecte n'est que du décor. Plus d'une centaine d'espèces de chenilles utilisent les rosiers sauvages, les cynorrhodons nourrissent grives mauvis, litornes, merles et mulots jusqu'en décembre, et le fourré épineux est là où merles et accenteurs bâtissent, bien au fond.",
    propagationNote:
      "Des boutures ligneuses enfoncées en terre humide en hiver s'enracinent bien et sont de loin la voie la plus rapide. Les tiges rampantes se marcottent d'elles-mêmes au contact du sol : détachez un morceau enraciné et déplacez-le. Par les cynorrhodons c'est lent — nettoyez la graine, semez dehors à l'automne, et attendez-vous à en voir l'essentiel au second printemps.",
    supportNotes: {
      "bumble-bees":
        "Un rosier sauvage simple est une coupe ouverte avec le pollen posé à portée de main, si bien qu'une abeille peut réellement s'en servir. Un rosier de jardin double a perdu cela par sélection — pour un insecte, ce n'est que du paysage.",
      "winter-thrushes":
        "Les cynorrhodons tiennent jusqu'en décembre pour les grives litornes, mauvis et merles, au moment de l'hiver où la haie a été dépouillée de tout ce qui est plus tendre.",
    },
  },

  // -------------------------------------------------------------------------
  // France atlantique — vivaces, graminées, grimpantes, couvre-sols et fougères.
  // -------------------------------------------------------------------------
  "Hyacinthoides non-scripta": {
    nativeNote:
      "La jacinthe des bois atlantique, dont les nappes printanières tapissent les forêts océaniques françaises — une espèce presque confinée à la façade atlantique de l'Europe.",
    careNote:
      "Elle veut l'ombre fraîche et riche en humus des feuillus, où elle fleurit avant que la canopée ne se ferme puis disparaît pour l'été — ne bêchez pas là où elle s'efface. Plantez la vraie indigène, pas la jacinthe d'Espagne, plus grossière, qui l'efface par hybridation ; les bulbes sont toxiques si on les avale.",
    givesNote:
      "Ses clochettes bleues penchées nourrissent bourdons à longue langue, anthophores et premiers papillons juste à leur émergence, et recréent la forêt-à-jacinthes atlantique en voie de disparition, l'un des spectacles printaniers emblématiques de l'Europe.",
    propagationNote:
      "Le plus facile est de soulever et diviser les touffes trop denses au moment où les feuilles jaunissent, au début de l'été, en replantant les bulbes aussitôt. Par semis c'est lent — semez la graine mûre dehors à l'automne et comptez plusieurs années avant la floraison. N'utilisez jamais que des bulbes de culture : arracher des jacinthes sauvages est illégal.",
    supportNotes: {
      "mason-bees":
        "Les jacinthes des bois fleurissent dans les quelques semaines qui séparent le réchauffement du sol de la fermeture de la canopée — exactement quand les abeilles solitaires de printemps garnissent leurs nids. Les andrènes les travaillent toute la matinée, et l'anthophore plumeuse, brune et velue, fait du surplace devant chaque clochette pour en atteindre le fond.",
    },
  },
  "Digitalis purpurea": {
    nativeNote:
      "Les hautes hampes pourpres des clairières, des landes et des talus acides de France — une vivace de courte vie qui se ressème toute seule.",
    careNote:
      "Facile au soleil ou à mi-ombre sur la plupart des sols, surtout acides. Elle fleurit la deuxième année puis meurt généralement, mais se ressème abondamment : laissez une hampe monter en graine et elle ne vous quittera plus vraiment. Toutes ses parties sont toxiques si on les avale — c'est la source du médicament cardiaque digitaline.",
    givesNote:
      "Ses hautes fleurs en tube sont un aimant à bourdons — on peut regarder les gros bourdons grimper carrément à l'intérieur de chaque doigtier — et elle se ressème pour garnir sans le moindre effort les clairières et les sols remaniés.",
    propagationNote:
      "La graine est fine comme de la poussière et a besoin de lumière : répandez-la à la surface d'une terre nue et humide en été ou en automne, sans la couvrir. Semée là où elle doit pousser, elle ne demande rien d'autre — laissez simplement une hampe monter en graine chaque année pour entretenir la colonie.",
    supportNotes: {
      "bumble-bees":
        "Une digitale est construite pour un seul animal : la gorge tachetée est une piste d'atterrissage et un mode d'emploi, et le tube est assez profond pour que seul un bourdon à longue langue en atteigne le fond. Regardez-en un grimper tout à l'intérieur et ressortir en marche arrière, saupoudré de pollen.",
    },
  },
  "Primula veris": {
    nativeNote:
      "Les bouquets jaunes penchés des prairies, des talus et des pelouses ouvertes de France au printemps.",
    careNote:
      "Elle veut un emplacement dégagé, du soleil à la mi-ombre, sur une prairie ordinaire ou calcaire qui n'est pas fauchée avant le milieu de l'été — parfaite pour une mini-prairie ou un talus tondu tard. De longue vie une fois installée, et elle se ressème doucement.",
    givesNote:
      "Ses bouquets de fleurs jaunes parfumées nourrissent au printemps les bourdons à longue langue, l'anthophore plumeuse et les premiers papillons, et c'est une plante nourricière de la rare Lucine, là où elle subsiste.",
    propagationNote:
      "Semez de la graine fraîche à l'automne et laissez-la dehors pour le froid dont elle a besoin ; une graine vieille et sèche germe mal. Les touffes installées peuvent aussi être soulevées et divisées juste après la floraison.",
    supportNotes: {
      "duke-of-burgundy":
        "La Lucine ne pond que sur les primevères officinales et les primevères communes — et seulement sur des pieds installés dans le bon degré d'abri, blottis dans une herbe plus haute ou en lisière de broussaille, plutôt qu'en plein gazon ras. Avoir la plante compte ; le moment où vous fauchez autour compte tout autant.",
    },
  },
  "Succisa pratensis": {
    nativeNote:
      "Une fleur de fin d'été des prairies humides, des marais herbeux et des layons forestiers de France.",
    careNote:
      "Elle veut un sol qui reste frais, au soleil ou à mi-ombre — toute désignée pour une prairie humide, un bord d'étang ou un jardin de pluie. Lente à s'étoffer, mais durable et fiable une fois installée.",
    givesNote:
      "Ses capitules bleu poudré sont une source de nectar de premier ordre en fin d'été, quand les prairies sèchent, et la plante est la plante nourricière indispensable du rare damier de la succise.",
    propagationNote:
      "Semez de la graine fraîche à l'automne et laissez-lui sentir le froid dehors. Les plants installés se divisent avec précaution au printemps, mais ils supportent mal d'être dérangés : faites des éclats généreux.",
    supportNotes: {
      "bumble-bees":
        "La succise fleurit en fin d'été, quand la prairie est par ailleurs terminée — un dernier gros repas pour les bourdons et les papillons.",
    },
  },
  "Centaurea nigra": {
    nativeNote:
      "La fleur pourpre en tête de chardon des prairies de fauche, des bords de route et des talus littoraux atlantiques — chez elle sur les terrains acides et neutres où sa cousine des calcaires ne pousse pas.",
    careNote:
      "Terrain pauvre, ensoleillé, non fertilisé — elle est heureuse sur un talus de sous-sol et s'affale dans un massif riche. La seule chose qui compte vraiment, c'est le moment où vous coupez. Laissez-la debout et elle continue d'ouvrir de nouveaux capitules jusqu'en octobre ; coupez la parcelle en fin d'automne ou, mieux, en février, pour que les têtes de graines nourrissent les oiseaux tout l'hiver. Couper en août enlève précisément les fleurs qui manquent à l'année.",
    givesNote:
      "La dernière grande plante à nectar encore debout. Longtemps après la fauche de la prairie et la fin des ronces, la centaurée continue — l'un des puits de nectar les plus profonds de toute la flore française, travaillé par les bourdons, les abeilles domestiques, les syrphes, les myrtils et les grands nacrés du milieu de l'été jusqu'aux premières vraies gelées. Chardonnerets et linottes démontent ensuite les têtes de graines tout l'automne.",
    propagationNote:
      "Récoltez les capitules secs à l'automne et frottez la graine entre vos mains pour la libérer. Semée directement sur une terre nue griffée à l'automne, elle lève sans peine ; pour un semis de printemps, donnez-lui d'abord un mois dans un sachet de sable humide au réfrigérateur.",
    supportNotes: {
      "bumble-bees":
        "L'un des puits de nectar les plus profonds de toute la flore française, et il continue longtemps après la fauche de la prairie et la fin des ronces — bourdons, myrtils et grands nacrés le travaillent tous jusqu'à l'automne.",
      "goldfinches-linnets":
        "Une tête de centaurée montée en graine est ce qu'un chardonneret préfère dans le jardin — ils s'y pendent la tête en bas et la démontent tout l'automne. Coupez les tiges en septembre et vous avez jeté la nourriture de l'hiver.",
    },
  },
  "Lotus corniculatus": {
    nativeNote:
      "La petite légumineuse jaune des pelouses dunaires atlantiques, des hauts de falaise, des bords de route et des gazons ras — l'une des fleurs sauvages les plus communes de France, et l'une des plus importantes.",
    careNote:
      "Semez-la dans un terrain maigre, pauvre et ensoleillé — c'est l'une des rares choses véritablement bonnes qu'on puisse faire d'un bord de route tassé ou d'un talus de sous-sol de chantier — puis fauchez une seule fois, tard, en septembre. Elle fabrique son propre azote, ne la nourrissez donc jamais, et elle disparaît de tout ce qui est riche, ombragé ou tondu court.",
    givesNote:
      "À poids égal, la plante à papillons la plus importante de France. L'azuré commun, les hespéries, la zygène de la filipendule et les soucis y élèvent leurs chenilles, plusieurs d'entre eux sur presque rien d'autre, et sa longue saison de petites fleurs jaune et orange nourrit les bourdons de mai à septembre. Quand une prairie a perdu ses papillons, c'est en général cela qu'elle a perdu.",
    propagationNote:
      "Le tégument est dur, comme chez la plupart des légumineuses : entaillez-le au papier de verre ou faites-le tremper une nuit dans de l'eau tiède, puis semez directement sur une terre nue griffée à l'automne ou au début du printemps. Elle supporte mal d'être mise en pot puis déplacée : semez-la là où vous la voulez.",
    supportNotes: {
      "common-blue":
        "Le lotier corniculé est la principale plante nourricière de l'azuré commun — et les fourmis montent souvent la garde au-dessus des chenilles, les protégeant pour les gouttes sucrées qu'elles exsudent. Quand une prairie a perdu ses azurés, c'est en général cela qu'elle a perdu.",
      "six-spot-burnet":
        "Les chenilles de la zygène tirent des composés cyanurés des feuilles de lotier et les gardent à vie — c'est pourquoi l'adulte peut se permettre de voler lentement en plein jour, en écarlate et noir, et pourquoi rien ne le mange.",
      "bumble-bees":
        "Une longue saison de petites fleurs jaune et orange, de mai jusqu'en septembre, travaillée sans arrêt par les bourdons.",
    },
  },
  "Trifolium pratense": {
    nativeNote:
      "Le trèfle sauvage des prairies, des bords de route et des lisières de champ de France — indigène ici bien avant que quiconque ait songé à le semer comme fourrage.",
    careNote:
      "La façon la plus simple d'y venir est de cesser de travailler contre lui : tondez la pelouse plus haut et moins souvent, arrêtez engrais et désherbants, et le trèfle revient tout seul. En partant d'un sol nu, semez au printemps ou à l'automne. Il fixe son propre azote, ce qui verdit gratuitement l'herbe autour de lui, et chaque pied est assez éphémère : laissez donc quelques têtes monter en graine chaque année.",
    givesNote:
      "L'aliment de base d'un bourdon à longue langue : le tube de la fleur est trop profond pour qu'une abeille domestique le vide, si bien que le trèfle des prés et les gros bourdons se tiennent mutuellement depuis très longtemps. Ses feuilles nourrissent les chenilles du souci et d'une centaine d'autres espèces, et, comme toute légumineuse, il remet de l'azote dans une terre fatiguée au lieu d'en prendre.",
    propagationNote:
      "Une graine fraîche semée sur une terre griffée au printemps ou au début de l'automne germe vite et n'a besoin d'aucun froid. Une graine plus vieille et plus dure fait mieux si vous la frottez d'abord entre deux feuilles de papier de verre. Il se divise mal — semez-le plutôt que de le déplacer.",
    supportNotes: {
      "bumble-bees":
        "Le tube floral du trèfle des prés est trop profond pour qu'une abeille domestique le vide : le nectar du fond appartient donc aux bourdons à longue langue — le bourdon des jardins et le bourdon des champs — ce qui est une des raisons pour lesquelles ces espèces et cette plante ont décliné ensemble.",
    },
  },
  "Rumex acetosa": {
    nativeNote:
      "L'oseille au goût de citron des prairies de fauche, des bords de route et des herbages frais de France — la cousine sauvage de l'herbe de cuisine, et la plante qui rougit un pré en juin.",
    careNote:
      "Une terre de prairie ordinaire et fraîche et une fauche tardive, c'est tout — l'oseille est l'une des premières choses qui reviennent quand une pelouse cesse d'être tondue chaque semaine. Ses fleurs sont pollinisées par le vent et lâchent donc des nuages de pollen en juin : s'il y a un rhume des foins dans la maison, tenez la parcelle loin des fenêtres ouvertes. Les jeunes feuilles sont franchement citronnées et bonnes en salade ou en soupe, mais comme les épinards elles sont riches en acide oxalique : mangez-en peu.",
    givesNote:
      "C'est la plante du cuivré commun — le petit papillon orange vif qui patrouille les allées et les coins en friche pond sur l'oseille et ses chenilles ne mangent rien d'autre ici. À elles deux, les oseilles et les patiences nourrissent près de deux cents espèces de chenilles, plus que la plupart des arbres, et les fringilles prélèvent les épis de graines rouillés jusqu'au cœur de l'hiver.",
    propagationNote:
      "Semez la graine mûre sur une terre nue griffée à l'automne ou au printemps — elle ne demande aucun traitement particulier et lève rapidement. Les touffes installées peuvent aussi être déterrées au début du printemps et séparées en morceaux enracinés.",
    supportNotes: {
      "small-copper":
        "Le cuivré commun pond sur les oseilles et les patiences, et ses chenilles ne mangent rien d'autre. Elles se nourrissent au revers d'une feuille et la broutent jusqu'à une fenêtre translucide au lieu de la percer : le dégât ressemble à une tache pâle, pas à un trou — c'est ce qu'il faut chercher sur un pied dans un coin en friche en juin.",
      "goldfinches-linnets":
        "Les épis de graines rouillés tiennent bien jusqu'en hiver, et les fringilles les démontent debout sur la tige.",
    },
  },
  "Artemisia vulgaris": {
    nativeNote:
      "La haute plante gris-vert des bords de route, des berges et des friches de France — quelconque à regarder, et l'une des plantes à chenilles les plus fréquentées qui soient.",
    careNote:
      "Honnêtement d'abord : c'est une plante de terrain vague. Elle court à la racine, se ressème fort, et son pollen de fin d'été est un déclencheur sérieux de rhume des foins — l'armoise est l'une des principales causes du rhume des foins d'août en France. Mettez-la dans une bande de limite, sur un talus ou dans le coin en friche que vous ne jardinez pas vraiment, coupez les tiges florales début août si quelqu'un dans la maison en souffre, et tenez-la hors d'un petit massif, où c'est elle qui gagnera.",
    givesNote:
      "Personne ne plante l'armoise pour les fleurs : elles sont ternes, pollinisées par le vent, et ne nourrissent aucune abeille. Ce qu'elle nourrit, ce sont les chenilles — plus de cent trente espèces, dont plusieurs petits papillons de nuit qui ne vivent presque que d'elle — et ses tiges mortes creuses sont là où abeilles solitaires, coccinelles et chrysopes passent l'hiver, ce qui est la raison de les laisser debout jusqu'au printemps. Chardonnerets et linottes prennent la graine.",
    propagationNote:
      "De loin le plus simple : tranchez un morceau enraciné au bord d'une touffe au début du printemps et replantez-le — il prendra sans se plaindre. La graine est fine comme de la poussière et a besoin de lumière : si vous semez, répandez-la à la surface d'une terre nue humide à l'automne et laissez-la découverte.",
    supportNotes: {
      "mason-bees":
        "Les fleurs de l'armoise ne nourrissent personne — elles sont pollinisées par le vent, et la fiche le dit. Ce qu'elle donne, ce sont les tiges mortes : creuses, debout, et pleines de petites abeilles solitaires, de coccinelles et de chrysopes qui y passent l'hiver. C'est tout l'argument pour les laisser jusqu'au printemps au lieu de faire le ménage en octobre.",
      "goldfinches-linnets":
        "Chardonnerets et linottes prélèvent la graine fine sur les tiges restées debout tout l'hiver.",
    },
  },
  "Festuca rubra": {
    nativeNote:
      "La fétuque indigène à feuilles fines des prairies, des dunes, des hauts de falaise et des bords de route de France — et la graminée de presque tous les sachets de gazon vendus dans le pays.",
    careNote:
      "C'est le changement le plus facile de toute cette liste, parce que la plante est probablement déjà dans votre pelouse : il lui suffit qu'on la laisse pousser. Fauchez une parcelle une fois en juillet et une fois en septembre au lieu de tous les quinze jours, cessez de l'arroser et de la nourrir, et elle fleurira, grènera et tiendra un talus sec ou une pente sableuse sans aucune aide. Elle s'étend doucement, si bien qu'une place nue se referme d'elle-même.",
    givesNote:
      "L'herbe est ce que mangent réellement la plupart des papillons bruns de France. Le myrtil, l'amaryllis, le tristan, le demi-deuil et les hespéries élèvent tous leurs chenilles sur des graminées fines comme celle-ci et passent l'hiver au fond des touffes — une pelouse tondue tous les quinze jours n'en nourrit aucun, une pelouse laissée fleurir les nourrit tous. La graine nourrit ensuite fringilles et bruants, et les racines tricotent ensemble le sable et la terre maigre.",
    propagationNote:
      "Égrenez les épis mûrs au milieu de l'été et semez-les directement sur une terre ratissée — aucun froid nécessaire, et elle lève sans peine, à l'automne comme au printemps. Les touffes installées peuvent aussi être déterrées et séparées en morceaux enracinés.",
    supportNotes: {
      "grass-skippers":
        "Le myrtil, l'amaryllis, le tristan, le demi-deuil et les hespéries n'ont mangé que de l'herbe toute leur vie de chenille, et ce sont des graminées fines comme celle-ci qu'ils choisissent. Ils passent aussi l'hiver au fond de la touffe — une pelouse tondue tous les quinze jours n'en nourrit aucun, une pelouse laissée fleurir les nourrit tous.",
      "goldfinches-linnets":
        "Laissée fleurir et grener, une pelouse de fétuque nourrit fringilles et bruants en fin d'été — le même carré de terrain, deux métiers, pour le prix de ne pas le tondre.",
    },
  },
  "Poa nemoralis": {
    nativeNote:
      "La graminée souple et penchée des sous-bois et des talus de haie ombragés de France — la seule qui soit véritablement heureuse à l'ombre sèche sous les arbres.",
    careNote:
      "Semez-la exactement là où l'herbe est censée échouer — sous une haie, sous de vieux arbres, le long d'un talus exposé au nord — puis laissez-la haute. Elle est éphémère mais se ressème régulièrement, ne demande aucun engrais, et couvrira le sol nu et poussiéreux sous un arbre où un gazon ordinaire a renoncé. Une fauche en fin d'été suffit largement.",
    givesNote:
      "Elle porte la moitié ombragée du réseau alimentaire des graminées : le tristan et le tircis — le papillon brun qui patrouille les taches de soleil le long d'un chemin forestier — pondent sur des graminées d'ombre comme celle-ci, et leurs chenilles se nourrissent la nuit, au ras des brins. Là où l'ombre d'un jardin n'est aujourd'hui que de la terre nue, elle en fait un couvert d'hiver pour les coléoptères, les araignées et les chenilles en hivernage.",
    propagationNote:
      "Répandez la graine mûre sur une terre nue ratissée à l'automne, là où vous la voulez ; elle n'a besoin d'aucun froid et germe à l'ombre, ce qui est tout son intérêt. Les touffes peuvent aussi être soulevées et divisées au printemps.",
    supportNotes: {
      "grass-skippers":
        "C'est la moitié ombragée du réseau alimentaire des graminées. Le tristan et le tircis — le papillon brun qui patrouille les taches de soleil le long d'un chemin forestier — pondent sur des graminées comme celle-ci, et leurs chenilles se nourrissent la nuit au ras des brins. Une ombre qui n'est aujourd'hui que de la terre nue ne leur offre rien du tout.",
    },
  },
  "Deschampsia cespitosa": {
    nativeNote:
      "Une graminée indigène en touffe des prairies humides, des layons forestiers et des terres lourdes de France.",
    careNote:
      "Une touffe persistante qui accepte les sols frais, lourds et même ombragés où beaucoup de graminées échouent — une excellente graminée de fond dans laquelle planter des fleurs de prairie. Peignez les feuilles mortes en fin d'hiver ; aucun engrais nécessaire.",
    givesNote:
      "Ses nuages de fleurs argentées accrochent la lumière du plein été jusqu'en hiver, ses touffes hébergent les chenilles de plusieurs satyres et hespéries indigènes, abritent carabes et petite faune, et retiennent les sols frais.",
    propagationNote:
      "Semez la graine à la surface d'une terre nue au printemps ou à l'automne — elle lève sans peine, avec peu ou pas de froid préalable. Les touffes installées se déterrent aussi et se séparent en éclats.",
    supportNotes: {
      "grass-skippers":
        "Les satyres et les hespéries qui s'envolent de l'herbe quand vous traversez une prairie humide française n'ont mangé que de l'herbe toute leur vie, et ils passent l'hiver à l'état de chenille au fond d'une touffe comme celle-ci. Une pelouse tondue ne leur offre ni la nourriture ni l'abri.",
    },
  },
  "Lonicera periclymenum": {
    nativeNote:
      "Le chèvrefeuille grimpant indigène des bois et des haies de la France atlantique — son parfum du soir, c'est l'odeur même d'une haie en été.",
    careNote:
      "Une grimpante indigène bien élevée — rien à voir avec les chèvrefeuilles de jardin envahissants. Donnez-lui une haie, un treillage ou un arbre où s'enrouler, les pieds à l'ombre fraîche et la tête au soleil ; les baies sont toxiques pour les personnes.",
    givesNote:
      "Ses tubes parfumés du soir sont faits pour les papillons de nuit à longue trompe (et nourrissent les bourdons ainsi que le moro-sphinx, actif de jour), c'est la plante nourricière du petit sylvain, et ses baies rouges d'automne nourrissent fauvettes et grives.",
    propagationNote:
      "Prélevez des boutures semi-aoûtées en été, ou couchez une tige basse sur la terre pour qu'elle s'enracine au point de contact. La graine tirée des baies demande un nettoyage puis un hiver froid et humide avant de lever.",
    supportNotes: {
      "privet-hawk-moth":
        "Le chèvrefeuille s'ouvre au crépuscule et déverse son parfum pour un seul public : les sphinx à longue trompe qui viennent faire du surplace devant lui à la nuit tombée.",
    },
    lookalikeNotes: {
      "lonicera-japonica": {
        why: "Deux chèvrefeuilles volubiles, aux fleurs crème virant au jaune et au même parfum sucré du soir.",
        tells: [
          { feature: "Où sont les fleurs", native: "Toutes réunies en une tête à l'extrémité de la pousse.", lookalike: "Par paires à l'aisselle des feuilles, tout le long de la tige." },
          { feature: "Couleur des fleurs", native: "Crème à l'intérieur, lavées de rouge pourpre à l'extérieur.", lookalike: "Blanches virant au jaune beurre, sans aucun rouge." },
          { feature: "Fruits", native: "Une grappe serrée de baies rouges.", lookalike: "Des baies noires, par deux." },
          { feature: "En hiver", native: "Nue, ou presque.", lookalike: "Encore feuillée." },
        ],
      },
    },
  },
  "Hedera helix": {
    // Native here, impostor in the Mid-Atlantic — one key, both kinds of
    // writing (see `lib/prose.ts`). `origin`/`blurb` serve the look-alike page.
    origin:
      "Indigène d'Europe, d'Asie occidentale et d'Afrique du Nord — y compris la France atlantique, où il figure sur notre propre liste d'indigènes.",
    blurb:
      "Persistant, à l'épreuve de l'ombre, et vendu partout comme couvre-sol. Loin de chez lui, il grimpe dans les houppiers, y ajoutant du poids et de la prise au vent jusqu'à ce qu'une tempête emporte la branche, et il ombrage le sol forestier jusqu'à la terre nue. Là où il *est* indigène, c'est un élément ordinaire du bois — et l'une des dernières sources de nectar de l'automne.",
    nativeNote:
      "La grimpante et le couvre-sol persistants indigènes des bois, des murs et des haies de France — les plus généreux exactement quand l'année est la plus pauvre.",
    careNote:
      "Presque impossible à tuer, au soleil comme à l'ombre profonde — il grimpe aux murs et aux arbres (il s'accroche, il n'est pas parasite) et couvre les sols nus. Vigoureux : tenez-le à l'écart des gouttières et des ardoises, et hors des petits massifs ; les baies sont toxiques pour les personnes.",
    givesNote:
      "Ses fleurs d'automne, uniques en leur genre, sont le dernier grand comptoir à nectar de l'année — elles nourrissent les abeilles tardives, les syrphes, les guêpes et la collète du lierre quand plus rien ne fleurit — puis ses baies noires d'hiver nourrissent merles, grives et pigeons ramiers, et son couvert persistant abrite oiseaux au dortoir, insectes et azuré des nerpruns.",
    propagationNote:
      "Le plus facile qui soit : coupez en fin d'été un morceau de pousse juvénile non grimpante et enfoncez-le dans une terre humide ou un pot, il s'enracine sans façon. Les tiges qui rampent au sol s'enracinent en chemin : vous pouvez soulever et déplacer les morceaux enracinés à tout moment.",
    supportNotes: {
      "holly-blue":
        "La génération d'été de l'azuré des nerpruns pond sur les boutons floraux du lierre — la même plante dont les fleurs d'octobre nourrissent les adultes et dont le fouillis persistant les abrite. Le lierre est la moitié de la raison pour laquelle c'est l'azuré qui prospère en ville.",
      "blackcaps-warblers":
        "Les baies de lierre mûrissent en fin d'hiver, au moment le plus maigre de l'année, et fauvettes à tête noire et rougegorges en vivent.",
      "bumble-bees":
        "Le lierre fleurit en octobre, dernier nectar de l'année, et un mur de lierre en fleur bourdonne d'abeilles et de papillons tardifs.",
    },
  },
  "Humulus lupulus": {
    nativeNote:
      "Indigène dans les haies fraîches, les fourrés de bord de rivière et les lisières de l'ouest de la France, s'enroulant sur tout ce qu'il peut atteindre.",
    careNote:
      "Il disparaît jusqu'au sol chaque hiver et regrimpe six mètres avant août, ce qui en fait l'écran indigène le plus rapide que vous puissiez planter — sur une clôture, une arche, ou des fils le long d'un mur laid. Il court à la racine : donnez-lui de la place ou une limite. Le houblon est toxique pour les chiens ; c'est le pied femelle qui porte les cônes papyracés.",
    givesNote:
      "La plante nourricière du robert-le-diable — celui aux bords d'ailes déchiquetés, qui passe l'hiver à l'état adulte en ressemblant exactement à une feuille morte — ainsi que de plusieurs beaux papillons de nuit. Ses cônes de fin d'été abritent des insectes, et son rideau dense de feuilles transforme un mur nu en couvert de nidification et de dortoir en une seule saison.",
    propagationNote:
      "Au début du printemps, creusez au bord d'une touffe et coupez un morceau de la racine charnue coureuse portant un bourgeon — c'est ainsi que les houblonniers ont toujours fait, et c'est quasi certain. Les boutures de pousses tendres prises au début de l'été s'enracinent aussi.",
    supportNotes: {
      comma:
        "Le houblon est la plante nourricière classique du robert-le-diable, avec l'ortie et l'orme. La chenille est éclaboussée de blanc sur le dos, si bien que sur une feuille elle se lit comme une fiente d'oiseau — bien plus utile pour elle que d'être verte.",
    },
  },
  "Galium verum": {
    nativeNote:
      "L'écume jaune au parfum de miel des dunes, des talus secs et des vieilles prairies de France — la plus épaisse de toutes sur le sable atlantique.",
    careNote:
      "Terrain pauvre, très bien drainé, ensoleillé, et pas d'engrais — un talus sableux, une bordure de gravier, le haut d'un mur. Il court sous terre en un tapis bas, ce qui est ce que vous voulez sur un talus et pas du tout dans un petit massif : donnez-lui un bord où courir et repoussez-le là où il dépasse. Séché, toute la plante sent le foin coupé, raison pour laquelle on en bourrait autrefois les matelas.",
    givesNote:
      "La plante des sphinx : le grand sphinx de la vigne et le moro-sphinx, actif de jour, élèvent tous deux leurs chenilles sur les gaillets, avec une centaine d'autres papillons de nuit. Ses minuscules fleurs jaunes viennent au cœur de l'été et tiennent jusqu'en septembre, nourrissant les petites abeilles solitaires, les syrphes et les coléoptères dont les pièces buccales sont trop courtes pour quoi que ce soit de profond, et son tapis tient un talus sec sous une averse.",
    propagationNote:
      "De loin le plus facile : tranchez un morceau enraciné au bord d'un tapis à l'automne ou au début du printemps et replantez-le — il le remarque à peine. Par semis, semez à l'automne et laissez le pot dehors pour le froid qu'il demande.",
    supportNotes: {
      "elephant-hawk-moth":
        "Les gaillets sont la principale plante nourricière du grand sphinx de la vigne, avec les épilobes. Ce qu'on trouve, c'est la chenille, pas le papillon : une chose gris-brun de la longueur d'un doigt qui rentre son museau quand on la touche et gonfle quatre ocelles, et qui fait un serpent assez convaincant pour faire reculer un adulte.",
      "hummingbird-hawk-moth":
        "Le moro-sphinx — celui qui vole de jour et que les gens signalent comme un bébé colibri — élève aussi ses chenilles sur les gaillets. Cultiver le gaillet jaune, c'est obtenir l'animal entier, et pas seulement un adulte de passage en route vers le nord.",
    },
  },
  "Plantago lanceolata": {
    nativeNote:
      "Le plantain aux feuilles nervurées de toutes les prairies, tous les bords de chemin et toutes les pelouses de France — si ordinaire que presque personne ne le regarde deux fois.",
    careNote:
      "Vous l'avez presque certainement déjà : le travail n'est donc pas de le planter mais de le laisser. Cessez de désherber la pelouse, tondez haut et rarement, et il revient tout seul — il encaisse le piétinement, la sécheresse et les terrains pauvres bien mieux que l'herbe autour de lui, et ses rosettes plates tiennent le sol là où rien d'autre ne tient. En partant d'une terre nue, répandez de la graine à l'automne et il est levé en quelques semaines. Son pollen est porté par le vent et peut gêner les personnes sujettes au rhume des foins au début de l'été.",
    givesNote:
      "La plante des mélitées. La mélitée du Plantain et la mélitée du mélampyre pondent sur le plantain lancéolé, et de très nombreux papillons de nuit le mangent aussi — à elles toutes, les espèces de plantain nourrissent cent soixante-dix espèces de chenilles, plus que la plupart des arbres n'y parviennent. Les abeilles récoltent le pollen sec de ses petites baguettes de tambour brunes d'avril jusqu'en octobre, et les chardonnerets dépouillent les épis de graines.",
    propagationNote:
      "Frottez la graine mûre des épis en fin d'été et répandez-la sur une terre nue griffée ou dans un gazon clairsemé ; aucun froid, aucun recouvrement, et elle lève en quinze jours. Les grosses rosettes peuvent aussi être déterrées et divisées.",
    supportNotes: {
      "glanville-fritillary":
        "Le plantain lancéolé est ce sur quoi pond la mélitée du Plantain, et elle pond toute la ponte au même endroit : les chenilles éclosent ensemble, tissent une tente de soie par-dessus la plante et y passent l'hiver serrées les unes contre les autres. Aux premiers jours doux du printemps, elles sortent et se chauffent au soleil sur le dessus de la toile, en un nœud noir — la façon la plus simple dont on les trouve jamais.",
      "goldfinches-linnets":
        "Les petites têtes brunes en baguette de tambour se remplissent de graine à partir du milieu de l'été, et chardonnerets et linottes les dépouillent — à condition qu'elles soient encore debout, ce qu'elles ne sont jamais dans une pelouse tondue tous les quinze jours.",
    },
  },
  "Fragaria vesca": {
    nativeNote:
      "La minuscule fraise des bois des lisières, des talus et des clairières de France — plus sucrée, quoique plus petite, que n'importe quelle fraise du commerce.",
    careNote:
      "Elle court par stolons pour tisser un tapis bas et solide, au soleil ou à mi-ombre — un couvre-sol facile sous des arbustes ou en bordure d'allée. Elle accepte un sol ordinaire et un peu de piétinement ; elle s'étale, alors laissez-lui de la place pour voyager.",
    givesNote:
      "Ses fleurs blanches printanières nourrissent les premières abeilles et les syrphes, ses petites fraises rouges nourrissent oiseaux, petits mammifères et promeneurs, et son tapis héberge des chenilles et retient un talus.",
    propagationNote:
      "Le plus simple de tous : elle émet des stolons qui enracinent de petits plants en chemin — coupez un plant enraciné et déplacez-le là où vous en voulez d'autres. Les touffes trop denses se soulèvent et se divisent aussi.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches ouvertes, portées juste au-dessus du sol à partir d'avril — assez peu profondes pour que les plus petites andrènes puissent les travailler, ce que la plupart des fleurs de printemps ne sont pas.",
    },
  },
  "Dryopteris filix-mas": {
    nativeNote:
      "La fougère robuste en volant de dentelle des sous-bois, des talus ombragés et des vieux murs de France.",
    careNote:
      "L'ossature verte fiable d'un coin ombragé et frais où presque rien ne pousse — elle accepte l'ombre profonde et les sols ordinaires à humides, et reste quasi persistante dans les hivers doux de la façade atlantique. Coupez les vieilles frondes en fin d'hiver, avant que les nouvelles ne se déroulent.",
    givesNote:
      "Ses grandes frondes arquées offrent un couvert toute l'année et retiennent la litière de feuilles sur une pente ombragée, abritant grenouilles, coléoptères et autre petite faune. Les fougères nourrissent très peu de chenilles — celle-ci est retenue pour sa structure à l'ombre et sa lutte contre l'érosion, pas pour sa valeur alimentaire.",
    propagationNote:
      "On peut l'élever à partir des spores qui mûrissent au dos des frondes, mais c'est lent et délicat. Bien plus facile : déterrez une touffe installée au printemps et séparez la souche en éclats, chacun avec des racines et quelques frondes.",
  },
  "Asplenium scolopendrium": {
    nativeNote:
      "La fougère luisante en lanières des talus ombragés, des vieux murs, des puits et des chemins creux de France — persistante, et impossible à confondre avec une autre fougère.",
    careNote:
      "Ombre profonde, humidité constante, et du calcaire plutôt que de l'acide — ce qui en fait l'une des très rares bonnes plantes pour le côté nord et froid d'une maison, un mur de pierre à l'ombre ou la bande sombre le long d'une descente d'eau, et elle poussera droit dans un vieux mortier. Tenez-la hors du soleil et du vent desséchant. Ses frondes non découpées restent vertes tout l'hiver ; coupez les fatiguées en mars, au moment où les nouvelles se déroulent en crosses.",
    givesNote:
      "Son métier ici est l'abri, pas la nourriture. Des frondes persistantes maintiennent le couvert et l'air humide dans un coin sombre tout l'hiver, là où grenouilles, crapauds, carabes et insectes en hivernage peuvent échapper au gel. Les fougères nourrissent très peu de chenilles et celle-ci est honnête là-dessus — deux espèces, et pas une seule fleur — elle gagne donc sa place par la structure et parce qu'elle occupe un coin dont rien d'autre ne veut.",
    propagationNote:
      "Soulevez une touffe installée au début du printemps et coupez la souche en morceaux, chacun avec des racines et deux ou trois frondes. Par les spores c'est lent et minutieux mais tout à fait possible : secouez les bandes brunes mûres du revers d'une fronde sur un terreau stérile humide, couvrez le pot d'un couvercle transparent, et attendez des mois à l'ombre.",
  },
  "Polystichum setiferum": {
    nativeNote:
      "Une fougère souple, en dentelle, presque persistante, des sous-bois et des talus de haie ombragés atlantiques — la plus fréquente précisément dans l'ouest doux et pluvieux que couvre cette liste.",
    careNote:
      "La fougère la plus indulgente pour une ombre qui sèche en été — sous une haie, au pied d'un mur nord, entre des arbustes — à condition qu'elle démarre dans une terre où l'on a incorporé du terreau de feuilles et qu'elle soit arrosée ses deux premiers étés. Plantez la souche au niveau du sol, jamais enterrée. Peignez ou coupez les vieilles frondes en fin d'hiver, avant que les nouvelles ne se déroulent.",
    givesNote:
      "De la structure verte toute l'année dans le coin difficile, et des frondes qui piègent les feuilles mortes en exactement la litière humide où grenouilles, coléoptères et araignées passent l'hiver. Son tour de main mérite d'être connu : de petits plantules poussent le long de la nervure d'une fronde âgée, si bien qu'un pied en devient une douzaine pour rien. Comme nourriture, c'est presque un blanc — une seule espèce de chenille — et elle est ici pour le couvert, pas pour le réseau alimentaire.",
    propagationNote:
      "La voie facile, et légèrement magique : en fin d'été, choisissez une vieille fronde portant de petites plantules le long de sa nervure, couchez-la à plat sur un plateau de terreau humide et fixez-la ; chaque plantule s'enracine en une nouvelle fougère avant le printemps. Sinon, divisez une grosse souche au début du printemps, ou élevez-la de spores avec patience.",
  },
};
