// The French Alps — montane and subalpine ground, roughly 600–2,000 m,
// referenced on Grenoble, Annecy and Briançon.
//
// Six taxa here are also on the Atlantic list and are written there under their
// plain key; all six say something different at altitude — the rowan is a hedge
// tree in the west and the highest broadleaf on the slope here — so each appears
// again at the bottom under a region-qualified key (`"Latin@france-alpine"`).
// See `./index.ts`.
import type { ProseTable } from "../../lib/prose";

export const FRANCE_ALPINE: ProseTable = {
  // -------------------------------------------------------------------------
  // Les Alpes françaises — arbres.
  // -------------------------------------------------------------------------
  "Picea abies": {
    nativeNote:
      "L'épicéa sombre des étages montagnard et subalpin — l'arbre qui fait la forêt alpine classique, indigène à partir de 800 m environ.",
    careNote:
      "Il veut un sol frais et humide, et de l'altitude : planté bas et au sec il est en souffrance, et c'est d'un épicéa en souffrance que se nourrissent les pullulations de scolytes — la raison pour laquelle tant d'épicéas des Alpes ont bruni ces derniers étés chauds. Plantez-le au-dessus de sa ligne de confort, pas en dessous, et donnez-lui de la vraie place ; ses racines superficielles font qu'un sujet isolé peut être renversé par le vent.",
    givesNote:
      "La graine d'épicéa est toute l'économie hivernale du bec-croisé — un oiseau dont le bec est croisé à la pointe précisément pour ouvrir ces cônes — ainsi que des tarins, des mésanges noires et des cassenoix. Ses branches basses et denses sont là où tétras lyre et grands tétras s'abritent sous la neige, et son houppier est le lieu de nidification des chouettes de la montagne.",
    propagationNote:
      "Récoltez les cônes à l'automne, à maturité, et séchez-les au chaud jusqu'à ce qu'ils s'ouvrent, puis secouez-en la graine ailée. Quelques semaines de froid humide au réfrigérateur égalisent la germination. Semez peu profond et gardez les jeunes plants à l'ombre leur premier été.",
    supportNotes: {
      "conifer-seed-finches":
        "Le bec croisé du bec-croisé est un outil pour un seul travail — ouvrir un cône d'épicéa — et tarins et mésanges noires prennent ce qu'il laisse tomber.",
      "black-grouse":
        "Les branches basses chargées de neige des vieux épicéas sont là où tétras lyre et grands tétras passent l'hiver de montagne.",
    },
    lookalikeNotes: {
      "pseudotsuga-menziesii": {
        why: "Deux grands conifères sombres dans les mêmes vallées — l'un est là depuis les glaces, l'autre a été planté pour son bois.",
        tells: [
          { feature: "Cônes", native: "Longs et lisses, pendants, tombant au sol entiers.", lookalike: "Pendants aussi — mais avec une languette papyracée à trois pointes qui dépasse sous chaque écaille, comme l'arrière-train d'une souris." },
          { feature: "Aiguilles", native: "Raides et à quatre faces : roulez-en une entre le pouce et l'index, elle tourne.", lookalike: "Plates et souples : elle ne roule pas." },
          { feature: "Froissez une aiguille", native: "Résineuse.", lookalike: "Sucrée, de citron ou de mandarine." },
          { feature: "Là où une aiguille est tombée", native: "Elle laisse une minuscule cheville : un vieux rameau est rugueux au toucher.", lookalike: "Elle laisse une cicatrice ovale lisse : le rameau reste lisse." },
        ],
      },
    },
  },
  "Larix decidua": {
    nativeNote:
      "Le seul conifère d'ici à perdre ses aiguilles — indigène des Alpes intérieures, plus sèches, et l'arbre emblématique du Briançonnais et du Queyras.",
    careNote:
      "Il lui faut le plein soleil — il ne tolère absolument pas l'ombre — et en échange il encaisse le froid, le vent, l'avalanche et les sols maigres et pierreux qui viendraient à bout d'un épicéa. Il est rapide, pour un arbre de montagne. Sa grande qualité au jardin est que son houppier ouvert laisse passer la lumière : l'herbe et les fleurs poussent sous un mélèze comme elles ne le feront jamais sous un épicéa.",
    givesNote:
      "Un arbre à chenilles bien utilisé — dont la tordeuse du mélèze, dont la population culmine dans toutes les Alpes tous les huit ou neuf ans, célèbre pour faire orangir des vallées entières et nourrir chaque fois une explosion d'oiseaux. Sa graine nourrit becs-croisés et tarins, et le sol aéré d'une mélézaie porte la flore la plus riche de la forêt de montagne.",
    propagationNote:
      "Ramassez les petits cônes à l'automne, séchez-les jusqu'à ce qu'ils s'ouvrent et secouez-en la graine. Un mois environ de froid humide avant un semis de printemps donne un peuplement régulier. Une bonne part de la graine est vide chaque année : semez largement.",
    supportNotes: {
      "conifer-seed-finches":
        "La graine de mélèze nourrit becs-croisés et tarins, et ses poussées de chenilles nourrissent une explosion d'oiseaux tous les huit ou neuf ans.",
    },
  },
  "Pinus cembra": {
    nativeNote:
      "Le pin de la limite des arbres elle-même, indigène des Alpes intérieures entre 1 500 et 2 500 m environ — souvent le dernier arbre debout avant l'alpage.",
    careNote:
      "Très lent — c'est un arbre qui se mesure en siècles, et un pied planté aujourd'hui restera un arbuste une décennie — mais c'est l'arbre le plus résistant des Alpes, debout dans le vent, la glace et l'avalanche là où rien d'autre ne tient. Il lui faut de l'altitude et du froid ; dans un jardin de plaine chaud, il va mal.",
    givesNote:
      "Ses graines sans aile sont trop lourdes pour être emportées où que ce soit : l'arbre n'a donc qu'un seul partenaire, le cassenoix moucheté, qui en enterre des dizaines de milliers chaque automne et en oublie assez pour planter la forêt suivante. Cette relation — un oiseau et un arbre qui ne peuvent se passer l'un de l'autre — est toute l'histoire de la limite des arbres alpine.",
    propagationNote:
      "Récoltez les cônes avant les cassenoix, au début de l'automne, et extrayez-en les grosses graines sans aile. Il leur faut une longue période froide et humide — trois mois au moins, souvent deux hivers — semez-les donc en pot laissé dehors et protégez-le des mulots, qui les veulent tout autant que les oiseaux.",
    supportNotes: {
      "spotted-nutcracker":
        "Les graines du pin cembro n'ont pas d'aile et ne peuvent voyager seules ; le cassenoix en enterre des dizaines de milliers chaque automne, et celles qu'il oublie deviennent la forêt suivante. Aucune des deux espèces ne se débrouille sans l'autre.",
    },
  },
  "Acer pseudoplatanus": {
    supportNotes: {
      "bumble-bees":
        "Le sycomore fleurit en mai, à une altitude où il n'y a presque rien d'autre de sorti, et un seul vieil arbre peut porter les reines de bourdon de toute une vallée pendant la semaine où elles en ont le plus besoin.",
    },
    nativeNote:
      "Indigène des montagnes d'Europe centrale, Alpes comprises — un arbre des bois et des pâturages montagnards frais et humides, souvent autour des vieux bâtiments de ferme.",
    careNote:
      "Le grand feuillu le plus résistant de la montagne — il encaisse le vent, le sel, le froid, l'exposition et les sols pauvres, ce qui explique qu'on l'ait planté pendant des siècles pour abriter les fermes d'altitude. Il se ressème abondamment, attendez-vous donc à arracher des semis, et il devient très grand : c'est un arbre de pré ou de limite plutôt que de petit jardin.",
    givesNote:
      "Ses grappes de fleurs vertes pendantes en avril sont une source de nectar précoce de premier ordre en altitude, quand peu de choses sont ouvertes et que les reines de bourdons fondent leurs colonies. Un bon compte de chenilles, et les vieux sycomores des pâturages de montagne deviennent ces arbres creux, moussus et couverts de lichens où vivent chouettes, rougequeues et chauves-souris.",
    propagationNote:
      "Récoltez les samares appariées à l'automne, quand elles brunissent, et donnez-leur environ trois mois dans du sable humide au réfrigérateur avant de semer — ou laissez un pot dehors tout l'hiver. Honnêtement, la source la plus facile reste les centaines de semis qui apparaissent sous n'importe quel arbre mûr.",
  },

  // -------------------------------------------------------------------------
  // Les Alpes françaises — arbustes.
  // -------------------------------------------------------------------------
  "Vaccinium vitis-idaea": {
    supportNotes: {
      "black-grouse":
        "L'airelle rouge garde ses feuilles et ses fruits tout l'hiver sous la neige, et c'est pour cela qu'un tétras-lyre trouve encore à manger en février.",
      "emperor-moth":
        "Les chenilles du petit paon de nuit broutent ses petites feuilles coriaces à côté de celles de la myrtille.",
      "green-hairstreak":
        "L'une des fleurs où descend l'argus vert quand l'airelle est en fleur en juin.",
    },
    nativeNote:
      "Un tapis persistant de l'étage subalpin, sur sol acide parmi la myrtille, le rhododendron ferrugineux et les vieux épicéas.",
    careNote:
      "Les mêmes exigences que la myrtille — acide, riche en humus, frais, sans calcaire — mais elle garde ses petites feuilles luisantes tout l'hiver, ce qui en fait le meilleur couvre-sol persistant des deux. Très lente à s'étendre. Plantez-en plusieurs serrés et paillez à l'écorce le temps qu'ils se rejoignent.",
    givesNote:
      "Elle fleurit souvent deux fois, au début de l'été puis à nouveau au cœur de l'été, nourrissant les bourdons d'altitude les deux fois, et ses baies rouges acidulées tiennent jusqu'en hiver pour les grives, les merles à plastron, les tétras et les martres, quand les myrtilles sont passées depuis longtemps. Un couvert persistant sur terrain acide où peu d'autres choses poussent.",
    propagationNote:
      "Soulevez au printemps un morceau enraciné de tige rampante et mettez-le en pot dans un mélange acide de type terre de bruyère. Les pousses en voie d'aoûtement prises en fin d'été s'enracinent aussi sous abri, lentement, dans un mélange de sable et de tourbe.",
  },
  "Rhododendron ferrugineum": {
    supportNotes: {
      "bumble-bees":
        "Les fleurs du rhododendron ferrugineux sont des tubes profonds : la plupart de ce qui les visite n'atteint pas le fond. Un bourdon à longue langue, si — et un versant d'alpenrose en juillet leur appartient presque entièrement.",
    },
    nativeNote:
      "La rose des Alpes — le persistant bas qui rougit des pentes subalpines entières en juillet, sur les sols acides au-dessus de 1 500 m environ.",
    careNote:
      "La plante la plus difficile à contenter de cette liste en dessous de son altitude d'origine : il lui faut un sol acide, un air frais et humide, et une longue couverture de neige qui la protège l'hiver — exactement ce qu'un jardin de vallée chaude ne peut pas lui donner. Extrêmement lente, extrêmement longévive. Toutes ses parties sont toxiques, et le miel qui en est fait peut l'être aussi.",
    givesNote:
      "En juillet, une pente de rhododendron ferrugineux est l'un des grands spectacles à bourdons d'Europe — les fleurs sont façonnées pour les bourdons à longue langue et ils les travaillent par centaines. Ses fourrés bas et denses sont l'abri où tétras lyre et lièvres variables passent l'hiver, et elle tient le sol sur des pentes trop raides pour tout le reste.",
    propagationNote:
      "Très lent par les deux voies. Prélevez des pousses en voie d'aoûtement en fin d'été et faites-les raciner sous abri dans un mélange de sable et de tourbe sans calcaire, en comptant attendre près d'un an. Les branches basses couchées au sol s'enracinent d'elles-mêmes et se détachent ensuite.",
  },
  "Alnus alnobetula": {
    nativeNote:
      "L'aulne bas et dense des couloirs d'avalanche, des ravins humides et de la broussaille de la limite des arbres, dans toutes les Alpes. Longtemps connu sous le nom d'Alnus viridis.",
    careNote:
      "Il est construit pour être écrasé : les avalanches couchent ses tiges souples vers l'aval sous la neige et il se redresse en juin, ce qui explique qu'il possède les couloirs d'avalanche. Au jardin, cela veut dire un écran rapide, dense et impossible à tuer pour un talus frais — et quelque chose qui s'étend : donnez-lui de la place, loin d'un massif.",
    givesNote:
      "Un arbuste à chenilles majeur, et comme tous les aulnes il fabrique son propre azote : il enrichit donc discrètement la terre maigre de montagne pour tout ce qu'on plantera après lui. Ses petits chatons ligneux gardent une graine que sizerins et tarins prennent tout l'hiver, et le fourré impénétrable est un couvert de nidification sur des pentes découvertes.",
    propagationNote:
      "Récoltez les petits cônes ligneux à l'automne dès qu'ils commencent à s'ouvrir, séchez-les dans un sac et secouez-en la graine ; elle lève au printemps sans aucun traitement. Ses tiges basses et couchées s'enracinent aussi là où elles reposent sous la neige : une marcotte enracinée se détache simplement.",
    supportNotes: {
      "conifer-seed-finches":
        "Les petits chatons ligneux de l'aulne vert gardent une graine que sizerins et tarins travaillent tout l'hiver.",
    },
  },
  "Juniperus communis": {
    nativeNote:
      "Des buissons dressés des pâturages montagnards à la forme alpine aplatie, collée au sol, au-dessus de la limite des arbres, dans toutes les Alpes.",
    careNote:
      "Lent, piquant et quasi indestructible une fois en place — froid, vent, sécheresse, calcaire ou acide, il prend tout et vit des siècles. Il supporte mal la transplantation : plantez-le petit. Les pieds mâles et femelles sont séparés : il vous en faut des deux pour avoir des baies.",
    givesNote:
      "Une plante à chenilles bien utilisée pour un conifère, et ses galbules bleu-noir — trois ans à mûrir — sont une nourriture d'hiver pour les merles à plastron, les grives draines, les grives litornes et les tétras lyre. Son intérieur piquant est l'un des rares endroits où un petit oiseau puisse nicher en sécurité sur une pente de montagne découverte, et un genévrier abrite souvent un semis d'arbre assez longtemps pour qu'il s'en sorte.",
    propagationNote:
      "La graine de genévrier est l'une des plus lentes qui soient — une période chaude puis une longue période froide, et souvent deux ou trois hivers avant que quoi que ce soit n'apparaisse — semez-la donc en pot dehors et oubliez-la. Les boutures de pousses en voie d'aoûtement prises à l'automne sont plus fiables, quoique lentes elles aussi.",
    supportNotes: {
      "winter-thrushes":
        "Les galbules bleu-noir du genévrier — trois ans à mûrir — nourrissent merles à plastron, grives draines et grives litornes, et ses épines en font l'un des rares sites de nidification sûrs d'une pente découverte.",
    },
  },

  // -------------------------------------------------------------------------
  // Les Alpes françaises — vivaces, graminées et couvre-sols.
  // -------------------------------------------------------------------------
  "Anthyllis vulneraria": {
    nativeNote:
      "Une légumineuse aux feuilles soyeuses des pâturages alpins pierreux, des bords d'éboulis et des pelouses calcaires de toutes les Alpes.",
    careNote:
      "Elle veut exactement ce que la montagne lui donne : du soleil, du gravier, du calcaire et aucune concurrence. Dans une terre de jardin elle est éphémère et s'affale ; dans un lit de gravier ou sur un talus pierreux elle prospère et se ressème. Ne la nourrissez jamais.",
    givesNote:
      "La seule plante nourricière de l'azuré minime, l'un des plus petits papillons d'Europe, dont les jeunes mangent les graines à l'intérieur d'un unique capitule et ne peuvent vivre nulle part ailleurs. Ses capitules jaunes et laineux nourrissent aussi les bourdons et un ensemble d'abeilles solitaires, et, étant une légumineuse, elle remet de l'azote dans la terre la plus maigre.",
    propagationNote:
      "À tégument dur comme les autres légumineuses : entaillez ou faites tremper la graine, puis semez-la en terre graveleuse à l'automne. Elle a une racine pivotante et se déplace mal : semez-la sur place plutôt que de la transplanter.",
    supportNotes: {
      "small-blue":
        "Le plus petit papillon d'Europe vit à l'état de chenille à l'intérieur des capitules d'anthyllide, en mangeant les graines en formation, et ne peut utiliser aucune autre plante.",
    },
  },
  "Helianthemum nummularium": {
    nativeNote:
      "Un tapis bas à souche ligneuse des pelouses calcaires ensoleillées et des pentes rocheuses, des vallées aux hauts pâturages.",
    careNote:
      "Plein soleil, drainage franc, calcaire et pauvreté — un talus de gravier, un dessus de mur sec ou l'avant d'un massif pierreux. Taillez-le légèrement après la floraison pour le garder dense, mais n'entamez jamais le vieux bois nu. Il ne tolère pas les pieds mouillés en hiver.",
    givesNote:
      "Des fleurs jaune vif à bouquet d'étamines libres dans lesquelles les abeilles se roulent, s'ouvrant en relais pendant des semaines. C'est aussi la plante nourricière de plusieurs azurés de la montagne et de la thécla de la ronce — l'une de ces plantes dont l'importance est entièrement invisible jusqu'au moment où l'on sait quels papillons disparaissent sans elle.",
    propagationNote:
      "Les extrémités de pousses tendres non fleuries prélevées au début de l'été s'enracinent vite dans un terreau graveleux. La graine récoltée dans les capsules sèches se sème fraîche à l'automne dans un mélange graveleux laissé dehors pour l'hiver.",
    supportNotes: {
      "common-blue":
        "L'hélianthème est l'une des plantes sur lesquelles les azurés de montagne et la thécla de la ronce élèvent leurs chenilles.",
    },
  },
  "Gentiana lutea": {
    supportNotes: {
      "bumble-bees":
        "Une gentiane jaune dépasse la prairie autour d'elle et fleurit en verticilles étagés le long de la tige, si bien qu'un bourdon peut remonter longtemps le long d'un seul pied.",
    },
    nativeNote:
      "La grande gentiane jaune des pâturages subalpins des Alpes — la racine qui parfume les apéritifs amers de la région.",
    careNote:
      "Une plante à planter une fois et à ne jamais déplacer : il lui faut une dizaine d'années pour fleurir depuis la graine, elle en vit cinquante ou plus, et elle envoie une racine à un mètre de profondeur qui ne se transplante pas. Elle veut une terre de montagne profonde, fraîche et humide, au soleil. L'arrachage des racines sauvages est réglementé dans plusieurs départements français — achetez du plant de pépinière, et n'en prélevez jamais dans un pâturage.",
    givesNote:
      "Des couronnes de fleurs jaunes étoilées sur une hampe d'un mètre cinquante, travaillées par les bourdons à une altitude où les grandes fleurs sont rares, et une plante si longévive qu'un seul pied survit à la plupart des jardiniers. Sa liste de chenilles est courte mais comprend un papillon de nuit qui se nourrit à l'intérieur des capsules et nulle part ailleurs.",
    propagationNote:
      "Semez la graine fine à la surface d'un terreau graveleux humide à l'automne et laissez le pot dehors tout l'hiver — il lui faut une période franchement froide et humide et de la lumière pour germer, et elle prendra son temps. Puis soyez patient : plusieurs années pour un pied de quelque taille, et une décennie pour une fleur.",
  },
  "Trollius europaeus": {
    supportNotes: {
      "bumble-bees":
        "Un trolle ne s'ouvre jamais vraiment — les pétales se referment par-dessus en lanterne, et un insecte doit se glisser par l'interstice. Les bourdons sont parmi les rares assez gros pour s'en donner la peine.",
    },
    nativeNote:
      "Le globe jaune citron des prairies de fauche humides de montagne et des bords de ruisseau des Alpes.",
    careNote:
      "Il veut de l'humidité : une terre qui reste fraîche tout l'été, au soleil ou à l'ombre légère, ce qui au jardin veut dire en général un bord d'étang ou un coin bas et humide. Il supporte mal de sécher et supporte mal d'être divisé souvent. Comme les autres plantes de la famille des renoncules, il est toxique si on l'avale.",
    givesNote:
      "La fleur ne s'ouvre jamais — elle reste un globe jaune fermé — et c'est tout l'intérêt : un groupe de petites mouches y passe toute sa vie adulte, s'y accouple et y pond, et la pollinise en échange tandis que leurs larves mangent une partie des graines. Qu'une plante et un insecte dépendent complètement l'un de l'autre est le genre de chose dont une prairie humide de montagne est pleine.",
    propagationNote:
      "Semez la graine fraîche à l'automne en pot laissé dehors — il lui faut un vrai hiver, et une graine conservée germe mal. Les touffes installées se divisent au début du printemps, mais elles boudent un an après.",
  },
  "Dryas octopetala": {
    supportNotes: {
      "mason-bees":
        "La dryade tourne sa coupe blanche pour suivre le soleil, et ce creux tiède est là où les abeilles solitaires d'altitude passent une matinée froide.",
    },
    nativeNote:
      "Un tapis alpin persistant des éboulis calcaires, des crêtes et des graviers stabilisés, surtout au-dessus de la limite des arbres dans les Alpes.",
    careNote:
      "Une vraie alpine, c'est-à-dire qu'elle veut du soleil, du calcaire, du gravier, du froid et un drainage franc — et qu'elle déteste un air chaud, humide et immobile plus qu'elle ne déteste le gel. Un lit de gravier surélevé ou le dessus d'un mur sec lui convient ; une terre lourde la tue. Lente, puis un large tapis plat.",
    givesNote:
      "Des fleurs blanches à huit pétales qui suivent le soleil et font office de petits réflecteurs paraboliques, si bien que mouches et abeilles alpines s'y installent autant pour la chaleur que pour le pollen — l'une des solutions élégantes au fait d'être un insecte en altitude. Puis des plumets de graines argentés et vrillés, et un tapis persistant qui épingle un éboulis mouvant. Parente des rosacées fixatrices d'azote, elle en apporte aussi au gravier brut de la montagne.",
    propagationNote:
      "Les pousses en voie d'aoûtement prises en fin d'été s'enracinent sous abri dans un mélange graveleux et calcaire. La graine se sème fraîche en surface à l'automne dans un pot graveleux laissé dehors — il lui faut de la lumière et un hiver rude.",
  },
  "Thymus serpyllum": {
    nativeNote:
      "Le serpolet rampant des pelouses alpines sèches, des bords de chemin et des pâturages pierreux de toutes les Alpes.",
    careNote:
      "Du soleil, du gravier et de la pauvreté ; il poussera dans les joints d'une allée et se laissera marcher dessus. Rien ne le tue plus vite qu'une terre riche et humide. Taillez-le après la floraison s'il s'échevèle, et il s'enracinera de nouveau partout où une tige touche le sol.",
    givesNote:
      "Un tapis rose qui bourdonne. C'est l'une des meilleures plantes à nectar en altitude et une solide plante à chenilles, mais son lien le plus extraordinaire est avec l'azuré du serpolet : la chenille se nourrit de fleurs de thym quelques semaines, puis tombe au sol, est emportée dans une fourmilière de fourmis rouges parce qu'elle sent et sonne comme une larve de fourmi, et passe l'hiver à manger le couvain de ses hôtes. Pas de serpolet, et pas de fourmis, veut dire pas d'azuré du serpolet.",
    propagationNote:
      "Le plus facile de tous : arrachez un morceau enraciné au bord d'un tapis au printemps et plantez-le. Les extrémités de pousses tendres s'enracinent en quinze jours dans un terreau graveleux, et toute tige couchée au sol s'est déjà enracinée.",
    supportNotes: {
      "large-blue":
        "La chenille de l'azuré du serpolet mange des fleurs de thym quelques semaines, puis doit être adoptée par une colonie de fourmis rouges pour survivre à l'hiver — le papillon a donc besoin du serpolet *et* de la bonne fourmi, et il a disparu partout où l'un des deux a disparu.",
      "bumble-bees":
        "L'un des meilleurs tapis à nectar en altitude, et il fleurit tout au long du court été de montagne.",
    },
  },
  "Festuca nigrescens": {
    nativeNote:
      "Une fétuque en touffe à feuilles fines des pâturages montagnards et subalpins — une bonne part du gazon vert et ras d'une prairie alpine, c'est cette graminée.",
    careNote:
      "L'alternative indigène à une pelouse en altitude : fine, dense, résistante à la sécheresse et heureuse sur terrain pauvre, elle ne demande jamais ni engrais ni arrosage. Fauchez-la une ou deux fois par an, et tard — une prairie coupée en septembre, pas une pelouse tondue chaque semaine — et les fleurs du pâturage montent à travers elle.",
    givesNote:
      "Le groupe de plantes le plus utilisé de toute cette liste après les arbres. L'extraordinaire distribution de papillons bruns des Alpes — les moirés, les agrestes, les demi-deuils, les hespéries de montagne — ne mangent rien d'autre que des graminées comme celle-ci à l'état de chenille, et hivernent au fond des touffes. Sa graine nourrit fringilles et bruants, et ses racines tiennent la terre maigre de montagne contre la fonte.",
    propagationNote:
      "Égrenez les épis mûrs en fin d'été et semez-les directement sur une terre ratissée — aucun froid nécessaire, et elle lève sans peine. Les touffes installées se déterrent aussi et se séparent au printemps.",
    supportNotes: {
      "grass-skippers":
        "La distribution de papillons bruns des Alpes — moirés, agrestes, demi-deuils — ne mange rien d'autre que des graminées comme celle-ci, et hiverne à l'intérieur des touffes.",
    },
  },

  // -------------------------------------------------------------------------
  // Les taxa partagés avec la France atlantique dont la fiche dit autre chose
  // ici. La clé simple (dans `france-atlantic.ts`) porte la version atlantique ;
  // celles-ci, qualifiées par la région, portent la version alpine.
  // -------------------------------------------------------------------------
  "Betula pendula@france-alpine": {
    nativeNote:
      "Un pionnier des clairières montagnardes, des éboulis et des vieux pâturages de toutes les Alpes, sur les sols acides et pauvres.",
    careNote:
      "Rapide, bon marché, peu exigeant et de courte vie pour un arbre — soixante à quatre-vingts ans — ce qui en fait le bon premier arbre sur un terrain nu ou pauvre, avec une ombre légère à travers laquelle d'autres choses peuvent pousser. Il se ressème largement. Son pollen de printemps est un déclencheur fréquent de rhume des foins.",
    givesNote:
      "Après les chênes et les saules, le bouleau est le plus grand arbre à chenilles d'Europe, et à cette altitude c'est le plus grand, point — plus de trois cents espèces de papillons de jour et de nuit, ce qui explique qu'une boulaie soit si bruyante de fauvettes et de mésanges en mai. Sa graine nourrit sizerins et tarins tout l'hiver.",
    propagationNote:
      "Récoltez les chatons en forme de petits cônes en fin d'été, juste au moment où ils commencent à s'effriter, et émiettez-les à la surface d'un terreau humide — la graine de bouleau est fine comme de la poussière et a besoin de lumière, ne la couvrez donc pas. Elle lève en quelques semaines.",
    supportNotes: {
      "emperor-moth":
        "Le bouleau est l'un des arbres à chenilles du petit paon de nuit — la grosse larve verte à points roses et noirs mange à découvert sur les feuilles tout l'été.",
      "conifer-seed-finches":
        "Les chatons du bouleau s'effritent tout l'hiver en une graine si fine que seuls les petits fringilles s'en donnent la peine — tarins et sizerins se pendent la tête en bas au bout des rameaux pour l'atteindre.",
    },
  },
  "Salix caprea@france-alpine": {
    nativeNote:
      "Le saule marsault, indigène des vallées jusque dans l'étage subalpin — la première chose à coloniser un glissement de terrain ou une clairière.",
    careNote:
      "Il pousse à peu près n'importe où et vite, ce qui est sa qualité sur un talus brut et son défaut dans un petit jardin — il se ressème partout et vit peu. Rabattez-le sévèrement tous les quelques hivers et il repart plus épais. Les pieds mâles portent les gros chatons dorés ; les femelles, les argentés.",
    givesNote:
      "Les deux choses dont un printemps de montagne a le plus besoin. Ses chatons s'ouvrent en mars, avant tout le reste, et sont le repas pour lequel sortent les reines de bourdons, les premières abeilles et les papillons hivernants — un saule en fleur par une journée douce de mars est la plante la plus bruyante de la vallée. Et avec plus de trois cents espèces de chenilles, il est, avec le bouleau, l'ossature de tout le réseau alimentaire d'ici.",
    propagationNote:
      "Les saules sont les ligneux les plus faciles qui soient : coupez en hiver une tige nue grosse comme un crayon, enfoncez-en les deux tiers en terre humide, et elle s'enracine. Fait inhabituel chez un saule, le marsault s'enracine moins volontiers que la plupart : prenez-en plusieurs. Sa graine n'est viable que quelques jours, les boutures sont donc la voie raisonnable.",
    supportNotes: {
      "mourning-cloak":
        "Les feuilles de saule nourrissent les chenilles noires épineuses du morio, qui vivent en groupe sur une même branche jusqu'à être presque adultes.",
      "purple-emperor":
        "Le grand mars changeant pond sur les saules, et c'est le marsault qu'il choisit le plus souvent. Sa chenille passe l'hiver aplatie contre un rameau, exactement de la couleur de l'écorce, et reverdit avec les feuilles.",
      "bumble-bees":
        "Une reine de bourdon sort d'hibernation sans aucune réserve et doit fonder une colonie entière toute seule ; pour cela il lui faut du pollen — des protéines pour les premières larves — et pas seulement du sucre. Les chatons de marsault en sont la première vraie provision de l'année.",
    },
  },
  "Sorbus aucuparia@france-alpine": {
    nativeNote:
      "Le sorbier des oiseleurs, indigène jusqu'à la limite des arbres dans les Alpes et souvent le feuillu le plus haut de la pente.",
    careNote:
      "Le bon arbre le plus facile pour un jardin de montagne : assez petit pour une parcelle normale, indifférent au froid, au vent et aux sols acides, et prompt à s'installer. Il est de courte vie pour un arbre — quatre-vingts ans environ — et il supporte mal les terrains chauds et secs : c'est donc une plante de montagne plutôt que de fond de vallée.",
    givesNote:
      "Son nom français veut dire « le sorbier des oiseleurs », parce qu'on se servait de ses baies pour appâter les pièges à oiseaux, et cela vous dit tout : aucun autre arbre de montagne ne nourrit les oiseaux comme lui. Grives litornes, mauvis, merles à plastron, merles, draines et jaseurs dépouillent un sorbier en quelques jours. Ajoutez-y une lourde floraison crème pour les abeilles et un solide compte de chenilles.",
    propagationNote:
      "Écrasez les baies mûres à l'automne, rincez la graine de toute pulpe — la pulpe la retient — et donnez-lui environ trois mois de froid humide avant de semer au printemps, ou semez-la simplement en pot dehors pour l'hiver.",
    supportNotes: {
      "winter-thrushes":
        "Son nom français dit « le sorbier des oiseleurs » — aucun arbre de montagne n'attire les grives litornes, les mauvis et les merles à plastron comme un sorbier en fruits.",
    },
  },
  "Calluna vulgaris@france-alpine": {
    nativeNote:
      "La bruyère des pentes acides montagnardes et subalpines, des clairières et des vieux pâturages de toutes les Alpes.",
    careNote:
      "Sol acide, plein soleil, terrain pauvre et aucun engrais — c'est une plante des lieux affamés, et une bonne terre la gâche. Taillez-la légèrement chaque printemps, en n'entamant que la pousse de l'année précédente, pour l'empêcher de se dégarnir et de devenir ligneuse au centre. Elle vit une vingtaine d'années et se ressème.",
    givesNote:
      "La grande plante à nectar de fin d'été de la montagne : quand les prés ont été fauchés et que les fleurs ont disparu, une pente de callune en août est violette et rugit de bourdons, d'abeilles domestiques et de papillons. Elle porte aussi une longue liste de chenilles, et son tapis dense abrite lézards, poussins de tétras et d'innombrables insectes tout l'hiver.",
    propagationNote:
      "Prélevez des extrémités de pousses en voie d'aoûtement en fin d'été et faites-les raciner sous abri dans un mélange sableux sans calcaire. Plus simple encore : butez du terreau acide sur la base d'un vieux pied au printemps ; les tiges enterrées s'enracinent et se détachent en nouveaux plants un an plus tard.",
    supportNotes: {
      "bumble-bees":
        "Quand les prés ont été fauchés et que les fleurs ont disparu, une pente de callune en août est la dernière grande source de nectar de l'année de montagne.",
    },
  },
  "Vaccinium myrtillus@france-alpine": {
    nativeNote:
      "L'arbuste bas qui tapisse le sol des forêts d'épicéas et de mélèzes et les pentes subalpines au-dessus, dans toutes les Alpes.",
    careNote:
      "Elle est exigeante et cela vaut la peine : une terre acide avec du vrai terreau de feuilles ou de l'écorce dedans, des racines fraîches, la mi-ombre, et jamais de chaux ni de fumier. Elle s'étend lentement par des coulants souterrains en un tapis bas, et met des années à le faire — mais une fois installée, elle est là pour des décennies et ne demande rien.",
    givesNote:
      "La plus grande source de nourriture parmi les arbustes de montagne : plus de deux cents espèces de chenilles, des clochettes roses que les bourdons travaillent en mai, et une récolte de baies en août qui nourrit tétras lyre, grands tétras, grives, renards, martres et ours — tout le premier été d'un poussin de tétras lyre, ce sont des insectes prélevés sur la myrtille. Et il vous reste le solde.",
    propagationNote:
      "Soulevez au début du printemps un morceau enraciné de coulant et mettez-le en pot dans un mélange acide et tourbeux — la voie sûre. Par semis : écrasez des baies mûres, rincez la graine et pressez-la à la surface d'un terreau humide sans calcaire sans la recouvrir ; il lui faut de la lumière et du froid, laissez donc le pot dehors pour l'hiver.",
    supportNotes: {
      "black-grouse":
        "La myrtille est tout le monde du tétras lyre : les insectes qu'on y prélève nourrissent les poussins, les baies et les feuilles nourrissent les adultes, et ses fourrés bas sont là où ils s'abritent sous la neige.",
      "bumble-bees":
        "Des clochettes roses en mai, à une altitude où le nectar précoce est rare.",
      "winter-thrushes":
        "La récolte de baies d'août nourrit merles à plastron, grives et merles — et renards, martres et ours.",
    },
  },
  "Lotus corniculatus@france-alpine": {
    nativeNote:
      "La petite légumineuse jaune des pâturages alpins, des bords de route et des gazons ras, des vallées jusque bien au-dessus de la limite des arbres.",
    careNote:
      "Semez-la dans un terrain maigre, pauvre et ensoleillé et fauchez une seule fois, tard, en septembre. Elle fabrique son propre azote, ne la nourrissez donc jamais, et elle disparaît de tout ce qui est riche, ombragé ou tondu court. En montagne, elle poussera dans le gravier et au bord d'une piste.",
    givesNote:
      "La plante à papillons la plus importante des Alpes, sans concurrente. Les azurés — et les Alpes comptent plus d'espèces d'azurés que partout ailleurs en Europe — avec les hespéries, les zygènes et les soucis, y élèvent leurs chenilles, plusieurs d'entre eux sur presque rien d'autre. Les bourdons travaillent les fleurs de mai à septembre.",
    propagationNote:
      "Le tégument est dur : entaillez-le au papier de verre ou faites-le tremper une nuit dans de l'eau tiède, puis semez directement sur une terre nue griffée à l'automne ou au printemps. Elle supporte mal d'être mise en pot puis déplacée : semez-la là où vous la voulez.",
    supportNotes: {
      "common-blue":
        "Les Alpes comptent plus d'espèces d'azurés que partout ailleurs en Europe, et le lotier est ce sur quoi la plupart d'entre eux grandissent.",
      "six-spot-burnet":
        "Les chenilles de zygène tirent des composés cyanurés du lotier et les gardent à vie.",
    },
  },
};
