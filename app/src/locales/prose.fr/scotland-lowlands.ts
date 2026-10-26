// The Scottish Lowlands — Glasgow, Edinburgh and Dundee. Translated from
// `plants.scotland-lowlands.ts`.
//
// See `./index.ts` for how the overlay works and what the translation
// conventions are. Scottish Gaelic and Scots names (caorann, gean, blaeberry…)
// stay as written.
import type { ProseTable } from "../../lib/prose";

export const SCOTLAND_LOWLANDS: ProseTable = {
  "Quercus petraea": {
    nativeNote:
      "Darach en gaélique — le chêne des chênaies de l'ouest de l'Écosse, du Loch Lomond à Galloway en descendant la vallée de la Clyde.",
    careNote:
      "Lent au départ et très longévif. Plantez-en un petit — un semis de deux ans s'installe mieux qu'un gros arbre tuteuré — et laissez-lui de la place, bien loin de la maison.",
    givesNote:
      "Il nourrit plus de chenilles que tout autre arbre ici, et donc les mésanges et les fauvettes qui en élèvent leurs nichées. Les geais emportent et enterrent les glands.",
    propagationNote:
      "Ramassez les glands à leur chute en octobre, faites-les flotter dans l'eau et semez aussitôt ceux qui coulent. Ils germent le même automne et ne doivent jamais sécher. Semez profond, ou à l'emplacement définitif, à cause de la racine pivotante.",
    supportNotes: {
      "purple-hairstreak":
        "Ses chenilles ne mangent que du chêne, et les adultes passent leur vie dans la canopée. Les colonies écossaises sont surtout dans les chênaies de l'ouest.",
      "eurasian-jay":
        "Un geai enterre des milliers de glands chaque automne et en oublie assez pour planter le bois suivant.",
    },
  },
  "Quercus robur": {
    nativeNote:
      "Le chêne des basses terres de l'est et des sols plus lourds — le Fife, les Lothians et les vallées des Borders.",
    careNote:
      "Il accepte une argile plus humide et plus lourde que le chêne sessile, même gorgée d'eau l'hiver. Pour le reste, c'est pareil : plantez petit, plantez une fois, laissez-le tranquille.",
    givesNote:
      "Tout ce que donne le chêne sessile, sur un sol trop humide pour lui. Les glands pendent au bout de longs pédoncules : c'est la façon simple de distinguer les deux.",
    propagationNote:
      "Comme pour le chêne sessile : faites flotter les glands, semez frais à l'automne ceux qui coulent, ne les laissez jamais sécher.",
    supportNotes: {
      "purple-hairstreak":
        "L'un ou l'autre chêne indigène fera l'affaire : la thécla cherche des feuilles de chêne, pas une espèce précise.",
      "eurasian-jay":
        "Ce sont ces glands à long pédoncule que les geais emportent et enterrent.",
    },
  },
  "Betula pendula": {
    nativeNote:
      "Beithe en gaélique — le bouleau à écorce blanche des sols plus secs et sableux de toutes les basses terres.",
    careNote:
      "Rapide et au houppier léger, si bien qu'on peut jardiner dessous. Il vit soixante à quatre-vingt-dix ans. Il veut du soleil et un sol drainant.",
    givesNote:
      "Seuls le chêne et le saule le dépassent pour les chenilles. Sizerins et tarins dépouillent ses graines tout l'hiver, et ses racines nourrissent les champignons dont naît l'amanite tue-mouches.",
    propagationNote:
      "À l'automne, les chatons se défont en une graine semblable à de la menue balle. Répandez-la sur une terre nue et humide ou à la surface d'une caissette, sans la couvrir : il lui faut la lumière pour germer.",
    pioneerNote:
      "L'arbre qui a fait des terrils de schiste nus du West Lothian une boulaie, sans que personne ne le plante. Un tas de gravats ou un terrain déblayé lui fait la même offre.",
    supportNotes: {
      "conifer-seed-finches":
        "Tarins et sizerins se suspendent la tête en bas aux chatons tout l'hiver.",
      "black-grouse":
        "C'est dans les fourrés de bouleaux en lisière de lande que le tétras lyre mange les bourgeons l'hiver. Les Southern Uplands abritent certains de ses derniers bastions de basse altitude.",
    },
  },
  "Betula pubescens": {
    nativeNote:
      "Le bouleau des sols humides, des bords de tourbière et des ruisseaux de colline, là où le bouleau verruqueux renonce.",
    careNote:
      "Il accepte les sols acides, tourbeux et gorgés d'eau dont rien d'autre ne veut. Rapide et d'assez courte vie.",
    givesNote:
      "Les mêmes chenilles et les mêmes fringilles granivores que le bouleau verruqueux, sur les sols humides où celui-ci ne pousse pas.",
    propagationNote:
      "Comme pour le bouleau verruqueux : répandez la graine fraîche en surface sans la couvrir.",
    supportNotes: {
      "conifer-seed-finches":
        "Les mêmes bandes hivernales de fringilles que sur le bouleau verruqueux, sur les sols plus humides.",
      "emperor-moth":
        "Les chenilles du petit paon de nuit mangent le bouleau aussi bien que la callune.",
    },
  },
  "Alnus glutinosa": {
    nativeNote:
      "Feàrna en gaélique — l'arbre de chaque berge, de chaque bord de loch et de chaque creux humide des basses terres.",
    careNote:
      "Plantez-le dans votre coin le plus humide ; il supporte d'avoir les pieds dans l'eau. Il fixe son propre azote et n'a donc besoin d'aucun apport.",
    givesNote:
      "Il tient la berge d'un ruisseau mieux que tout le reste. Ses petits cônes nourrissent tarins et sizerins tout l'hiver.",
    propagationNote:
      "Récoltez les cônes en fin d'automne, quand ils s'ouvrent, secouez-en la graine et semez dehors en hiver, ou après un mois au réfrigérateur.",
    supportNotes: {
      "conifer-seed-finches":
        "Tarins et sizerins fouillent les petits cônes le long des rivières des basses terres en janvier.",
    },
  },
  "Sorbus aucuparia": {
    nativeNote:
      "Caorann en gaélique — planté près des portes écossaises pour porter chance, et indigène sur les collines, dans les glens et les landes de toutes les basses terres.",
    careNote:
      "Assez petit pour tout jardin et assez robuste pour le vent, les sols pauvres et le froid. Il lui faut du soleil pour bien fructifier.",
    givesNote:
      "Des fleurs pour les abeilles au début de l'été, puis des baies que merles, grives draines et, l'hiver venu, grives mauvis et litornes dépouillent dès octobre.",
    propagationNote:
      "Écrasez les baies mûres, rincez la pulpe et semez la graine dehors à l'automne pour que l'hiver la refroidisse. Attendez-vous à la voir lever au deuxième printemps aussi souvent qu'au premier.",
    supportNotes: {
      "mason-bees":
        "Des corymbes plats de fleurs ouvertes, à la portée des abeilles solitaires à langue courte.",
      "winter-thrushes":
        "Grives mauvis et litornes arrivant de Scandinavie peuvent dépouiller un sorbier en deux jours.",
    },
  },
  "Prunus padus": {
    nativeNote:
      "Hagberry en scots — un arbre des bords de ruisseau et des berges boisées, bien plus fréquent en Écosse que dans le sud.",
    careNote:
      "À l'aise en sol humide et à mi-ombre, là où la plupart des arbres à fleurs boudent. Il reste de taille modeste.",
    givesNote:
      "Des grappes pendantes de fleurs parfumées en mai, puis de petites cerises noires que les oiseaux nettoient en juillet. La famille des Prunus nourrit ici plus de 300 espèces de chenilles.",
    propagationNote:
      "Débarrassez les noyaux des fruits mûrs et semez-les dehors à l'automne ; il leur faut le froid d'un hiver. Les rejets se déterrent et se déplacent en hiver.",
    supportNotes: {
      "winter-thrushes":
        "Merles et grives prennent les petites cerises noires en fin d'été.",
    },
  },
  "Prunus avium": {
    nativeNote:
      "Gean est son nom scots — un arbre de lisière des vallées des basses terres, illuminé de blanc début mai.",
    careNote:
      "Il lui faut un sol profond et drainant, et du soleil. Il devient grand : il convient à un grand jardin ou à une bordure de champ.",
    givesNote:
      "L'une des premières grandes floraisons pour les reines de bourdons, puis des cerises pour les merles et les grives en juillet. Des feuilles rouges à l'automne.",
    propagationNote:
      "Nettoyez les noyaux et semez-les dehors à l'automne ; beaucoup attendent un second hiver pour germer. Les drageons se transplantent facilement.",
    supportNotes: {
      "winter-thrushes":
        "Merles et grives draines dépouillent un merisier en juillet.",
    },
  },
  "Populus tremula": {
    nativeNote:
      "Critheann en gaélique, « celui qui tremble » — dispersé en bosquets clonaux sur les talus et les bords de ruisseau des basses terres.",
    careNote:
      "Il drageonne en bosquet : il lui faut de l'espace, ou une bordure tondue pour l'arrêter. Il donne rarement des graines en Écosse ; multipliez-le par un drageon.",
    givesNote:
      "Il nourrit plus de 250 espèces de chenilles, et son bois mort tendre est recherché par des coléoptères et des syrphes rares.",
    propagationNote:
      "Déterrez un drageon enraciné en hiver, ou couchez des tronçons de racine gros comme un crayon dans une caissette de terreau en fin d'hiver, et gardez-les humides.",
    supportNotes: {
      "poplar-hawk-moth":
        "Le tremble est l'une des principales plantes nourricières du sphinx du peuplier.",
    },
  },
  "Salix caprea": {
    nativeNote:
      "Seileach en gaélique, pour tous les saules — le saule à chatons des lisières, des carrières et des friches.",
    careNote:
      "Il pousse presque partout, et vite. Contrairement à la plupart des saules, il se plaît aussi en sol sec. Rabattez-le sévèrement tous les quelques ans pour le garder petit.",
    givesNote:
      "Les chatons mâles sont le premier grand repas de l'année pour les reines de bourdons. Les saules nourrissent ici plus d'espèces de chenilles que tout autre arbre, le chêne excepté.",
    propagationNote:
      "Le saule marsault est le seul saule qui s'enracine mal de bouture : faites-en beaucoup, ou semez la graine cotonneuse le jour même de sa chute, en mai.",
    pioneerNote:
      "Il se sème en un an ou deux dans les vieilles carrières, les dents creuses et les bords de parkings, puis fleurit pour les premières abeilles du printemps.",
    supportNotes: {
      "bumble-bees":
        "Les chatons de saule sont la première grande réserve de pollen des reines de bourdons, en mars.",
      "poplar-hawk-moth":
        "Le sphinx du peuplier pond sur les saules aussi souvent que sur les peupliers.",
    },
  },
  "Ilex aquifolium": {
    nativeNote:
      "Cuileann en gaélique — un arbre de sous-étage des chênaies des basses terres, plus fréquent dans le sud-ouest doux.",
    careNote:
      "Il pousse à l'ombre profonde, et lentement. Seuls les pieds femelles portent des baies, et seulement avec un mâle à proximité : plantez-en plus d'un.",
    givesNote:
      "Un abri persistant pour les oiseaux au dortoir tout l'hiver, et des baies que les grives mangent une fois les sorbiers épuisés. Les chenilles de l'azuré des nerpruns se nourrissent de ses fleurs.",
    propagationNote:
      "Les boutures semi-aoûtées de fin d'été sont le plus rapide et vous disent le sexe de l'arbre. La graine met deux hivers à germer.",
    supportNotes: {
      "holly-blue":
        "Les chenilles de printemps de l'azuré des nerpruns mangent les fleurs et les baies du houx. Le papillon s'est répandu dans le Central Belt ces dernières années.",
      "winter-thrushes":
        "Les grives se rabattent sur les baies de houx une fois les sorbiers nus.",
    },
  },
  "Corylus avellana": {
    nativeNote:
      "Calltainn en gaélique — l'arbuste le plus commun des bois et des bords de ruisseau des basses terres, souvent conduit en taillis.",
    careNote:
      "Il accepte l'ombre et presque tous les sols. Recépez-le au ras du sol tous les sept ans environ, il repart plus touffu.",
    givesNote:
      "Des chatons en janvier, le premier pollen de l'année. Des noisettes pour les écureuils roux, les mulots et les geais.",
    propagationNote:
      "Marcottez une tige basse en l'agrafant au sol : elle s'enracine en un an. Ou semez des noisettes fraîches à l'automne, à l'abri des souris.",
    supportNotes: {
      "eurasian-jay":
        "Les geais cachent les noisettes comme les glands.",
    },
  },
  "Crataegus monogyna": {
    nativeNote:
      "Sgitheach en gaélique — la haie des fermes des basses terres, et un arbuste sauvage des talus et des coteaux.",
    careNote:
      "Robuste, insensible au vent, aussi heureux taillé en haie que laissé en petit arbre. Plantez des scions à racines nues en hiver.",
    givesNote:
      "Des fleurs de mai pour les abeilles, des cenelles pour les grives et les fringilles tout l'hiver, et un couvert épineux pour les nids. Il nourrit 200 espèces de chenilles.",
    propagationNote:
      "Les cenelles mettent deux hivers à germer : écrasez-les, rincez-les et semez-les dehors à l'automne, puis attendez. Acheter des scions est bien plus rapide.",
    supportNotes: {
      "winter-thrushes":
        "Les cenelles nourrissent grives mauvis, litornes et merles jusque tard dans l'hiver.",
      "bumble-bees":
        "Des fleurs sur chaque haie en mai, au moment où les ouvrières se multiplient.",
    },
  },
  "Prunus spinosa": {
    nativeNote:
      "Draighionn en gaélique — des fourrés épineux denses sur les talus et les bords de champ des basses terres.",
    careNote:
      "Il drageonne vers l'extérieur en fourré : donnez-lui une ligne de haie ou une bordure que vous pouvez tondre. Très épineux.",
    givesNote:
      "Des fleurs blanches sur les rameaux nus en avril, une nourriture précoce pour les abeilles. Un couvert de nidification que peu de prédateurs atteignent, et des prunelles à l'automne.",
    propagationNote:
      "Déterrez des drageons enracinés en hiver. Les noyaux de prunelle semés à l'automne mettent souvent deux hivers.",
    supportNotes: {
      "mason-bees":
        "Des fleurs ouvertes en avril, quand les andrènes viennent de sortir.",
      "emperor-moth":
        "Les chenilles du petit paon de nuit mangent aussi le prunellier.",
      "winter-thrushes":
        "Les prunelles laissées sur le buisson nourrissent les grives après une gelée.",
    },
  },
  "Sambucus nigra": {
    nativeNote:
      "Droman en gaélique, bourtree en scots — un arbuste des haies, des lisières et des vieux corps de ferme.",
    careNote:
      "Il pousse vite presque partout et se ressème là où les oiseaux lâchent les baies. Rabattez-le sévèrement en hiver pour le contenir.",
    givesNote:
      "Des corymbes plats pour les syrphes en juin, puis des baies que les oiseaux dépouillent en septembre.",
    propagationNote:
      "Enfoncez en terre des rameaux d'hiver gros comme un crayon ; presque tous s'enracinent.",
    supportNotes: {
      "blackcaps-warblers":
        "Fauvettes à tête noire et autres fauvettes s'engraissent de baies de sureau avant de migrer.",
    },
  },
  "Viburnum opulus": {
    nativeNote:
      "Un arbuste des bois humides, des marais et des bords de ruisseau, dispersé dans toutes les basses terres.",
    careNote:
      "Il aime un sol humide et riche et un peu d'ombre. Non taillé, il fructifie mieux.",
    givesNote:
      "Des fleurs blanches en dentelle pour les syrphes, des baies rouges luisantes que bouvreuils et grives prennent l'hiver, et des feuilles rouges à l'automne.",
    propagationNote:
      "Les boutures herbacées ou semi-aoûtées d'été s'enracinent bien. La graine demande du chaud puis du froid et peut mettre deux ans.",
    supportNotes: {
      "blackcaps-warblers":
        "Les oiseaux prennent les baies rouges tard, une fois les fruits plus sucrés partis.",
    },
  },
  "Salix cinerea": {
    nativeNote:
      "Le fourré de saules des prés humides, des bords de tourbière et des fossés de toutes les basses terres.",
    careNote:
      "Pour le sol le plus humide que vous ayez. Il s'étend là où il se plaît : rabattez-le tous les quelques ans.",
    givesNote:
      "Des chatons précoces pour les reines de bourdons et des centaines d'espèces de chenilles, qui nourrissent les fauvettes qui nichent dedans.",
    propagationNote:
      "Enfoncez un bâton en hiver dans un sol humide et il s'enracine. C'est tout.",
    supportNotes: {
      "bumble-bees":
        "Le saule le plus commun en sol humide, qui assure le même pollen de mars que le saule marsault.",
    },
  },
  "Juniperus communis": {
    nativeNote:
      "Aiteann en gaélique — un arbuste des pâtures d'altitude et des landes des Borders et des Southern Uplands, aujourd'hui en net déclin.",
    careNote:
      "Il veut le plein soleil, un sol pauvre et drainant, et aucune concurrence. Lent. Plantez un mâle et une femelle pour avoir des baies.",
    givesNote:
      "Un abri persistant et des baies que les grives prennent l'hiver. Le planter aide un arbuste que Plantlife classe en déclin en Écosse.",
    propagationNote:
      "La graine est lente et souvent vide. Les boutures semi-aoûtées de début d'automne, gardées sous châssis froid, sont la méthode sûre.",
    supportNotes: {
      "winter-thrushes":
        "Les grives et d'autres oiseaux prennent les baies bleu-noir l'hiver.",
    },
  },
  "Rosa spinosissima": {
    nativeNote:
      "Le rosier bas des dunes et des pelouses littorales, du Solway à la Tay.",
    careNote:
      "Il supporte le vent salé, le sable et la sécheresse. Il drageonne en un fourré bas, parfait sur un talus et gênant dans un massif.",
    givesNote:
      "Des fleurs crème pour les abeilles, puis des cynorhodons presque noirs pour les oiseaux. Il fixe le sable et les talus raides.",
    propagationNote:
      "Déterrez un drageon enraciné en hiver. Les boutures ligneuses prennent aussi.",
    supportNotes: {
      "winter-thrushes":
        "Ses cynorhodons noirs sont pris tard, une fois ceux de l'églantier partis.",
    },
  },
  "Rosa canina": {
    nativeNote:
      "Le rosier sauvage aux tiges arquées des haies et des fourrés des basses terres.",
    careNote:
      "Il grimpe à travers une haie ou par-dessus une clôture. Épineux ; laissez-lui de la place.",
    givesNote:
      "Des fleurs rose pâle pour les abeilles en juin, puis des cynorhodons rouges qui nourrissent les oiseaux jusque tard dans l'hiver.",
    propagationNote:
      "Les boutures ligneuses de fin d'automne s'enracinent avant le printemps. La graine des cynorhodons met deux hivers.",
    supportNotes: {
      "winter-thrushes":
        "Les cynorhodons restent sur le buisson jusqu'à la nouvelle année.",
    },
  },
  "Cytisus scoparius": {
    nativeNote:
      "Bealaidh en gaélique — l'or des talus de voie ferrée, des carrières et des collines incultes des basses terres en mai.",
    careNote:
      "Pour un sol chaud, sec et pauvre. De courte vie (une dizaine d'années) et il se ressème volontiers. Ne taillez pas dans le vieux bois.",
    givesNote:
      "Les bourdons travaillent ses fleurs en mai, et il fixe l'azote dans les sols pauvres.",
    propagationNote:
      "Versez de l'eau chaude sur la graine et laissez-la tremper une nuit, puis semez. Semez en place ; il déteste être déplacé.",
    pioneerNote:
      "Le genêt à balais fixe son propre azote : c'est ainsi qu'il couvre les tranchées de voie ferrée, les déblais de carrière et les talus d'autoroute là où la terre végétale a disparu.",
    supportNotes: {
      "green-hairstreak":
        "Les chenilles de la thècle de la ronce mangent aussi le genêt.",
      "bumble-bees":
        "Les bourdons forcent les fleurs à s'ouvrir et en ressortent poudrés de pollen.",
    },
  },
  "Calluna vulgaris": {
    nativeNote:
      "Fraoch en gaélique — la plante qui fait virer au pourpre les Pentlands, les Campsies et les Southern Uplands en août.",
    careNote:
      "Il lui faut un sol acide, le plein soleil et aucun apport. Coupez les vieilles fleurs au printemps pour la garder touffue.",
    givesNote:
      "Un afflux de nectar en fin d'été pour les abeilles domestiques et les bourdons, et la nourriture de plus d'une centaine d'espèces de chenilles de papillons de nuit, dont le petit paon de nuit.",
    propagationNote:
      "De courtes boutures des pousses de l'année, en fin d'été, s'enracinent dans un mélange acide et graveleux. Ou buttez la base d'un vieux pied et les tiges s'enracineront dans la terre.",
    supportNotes: {
      "emperor-moth":
        "La principale plante nourricière du petit paon de nuit sur les landes écossaises.",
      "green-hairstreak":
        "Les chenilles de la thècle de la ronce mangent la callune en lisière de lande.",
      "bumble-bees":
        "La callune d'août est le dernier grand afflux de nectar pour les bourdons des landes.",
      "black-grouse":
        "Le tétras lyre niche dans la haute callune et se nourrit de ses pousses.",
    },
  },
  "Erica cinerea": {
    nativeNote:
      "La bruyère pourpre foncé des buttes et des rochers les plus secs des landes des basses terres, qui fleurit avant la callune.",
    careNote:
      "Elle veut un sol sec, acide et ensoleillé ; elle pourrit en sol humide. Plantez-la à côté de la callune pour allonger la floraison.",
    givesNote:
      "Du nectar dès juillet, un mois avant la callune, quand les abeilles des landes en ont besoin.",
    propagationNote:
      "Comme pour la callune : de courtes boutures d'été dans un mélange acide et graveleux.",
    supportNotes: {
      "bumble-bees":
        "Elle fleurit un mois avant la callune et comble le creux pour les abeilles des landes.",
    },
  },
  "Vaccinium myrtillus": {
    nativeNote:
      "Blaeberry en scots, bilberry plus au sud — l'arbuste bas qui pousse sous le bouleau et le chêne en sol acide, et partout sur les landes.",
    careNote:
      "Il lui faut un sol acide et riche en humus, et un peu d'ombre. Lent à s'installer ; plantez des plants en godet, pas des graines.",
    givesNote:
      "Des fleurs précoces pour les bourdons, des baies pour les oiseaux et les gens en juillet, et la nourriture de plus de 200 espèces de chenilles.",
    propagationNote:
      "Soulevez et divisez une touffe au début du printemps, en gardant beaucoup de racines sur chaque éclat.",
    supportNotes: {
      "green-hairstreak":
        "La thècle de la ronce pond sur la myrtille aussi bien que sur la callune.",
      "bumble-bees":
        "Des fleurs précoces pour les reines de bourdons en sol acide.",
      "black-grouse":
        "Les pousses et les baies de myrtille sont un aliment de base du tétras lyre, et ses chenilles nourrissent les poussins.",
    },
  },
  "Myrica gale": {
    nativeNote:
      "Roid en gaélique — l'arbuste parfumé des tourbières et des landes humides des basses terres, jadis employé contre les moucherons.",
    careNote:
      "Seulement pour un sol humide, acide et tourbeux : un jardin de tourbière ou le bord d'une mare. Il fixe son propre azote.",
    givesNote:
      "Un couvert dense et résineux en bordure des sols humides, et la nourriture de chenilles de papillons de nuit qui ne mangent guère autre chose.",
    propagationNote:
      "Marcottez une tige basse en l'agrafant dans la tourbe humide ; elle s'enracine en une saison.",
    supportNotes: {
      "emperor-moth":
        "Les chenilles du petit paon de nuit mangent la myrique baumier sur les landes humides.",
    },
  },
  "Lonicera periclymenum": {
    nativeNote:
      "Iadh-shlat en gaélique — il s'enroule dans les haies et les lisières partout dans les basses terres.",
    careNote:
      "Donnez-lui une clôture, une haie ou un arbre où grimper. Racines à l'ombre, fleurs au soleil.",
    givesNote:
      "Parfumé au crépuscule pour les papillons de nuit, que les chauves-souris chassent ensuite. Des baies pour les oiseaux à l'automne.",
    propagationNote:
      "Agrafez au sol une tige rampante, elle s'enracine en quelques mois.",
    supportNotes: {
      "blackcaps-warblers":
        "Les baies rouges nourrissent fauvettes et grives à l'automne.",
    },
  },
  "Hedera helix": {
    nativeNote:
      "Eidheann en gaélique — il grimpe aux arbres, aux murs et aux ruines de toutes les basses terres.",
    careNote:
      "Il pousse à l'ombre profonde et grimpe à tout. Un mur sain ne craint rien ; tenez-le loin des gouttières et des vieux mortiers tendres.",
    givesNote:
      "Le dernier grand nectar de l'année en octobre, des baies pour les oiseaux en fin d'hiver et des dortoirs persistants.",
    propagationNote:
      "Toute tige portant des racines aériennes s'enracine en terre humide.",
    pioneerNote:
      "Il escalade le mur arrière d'un vieil immeuble depuis une fissure à son pied, à l'ombre sèche où rien d'autre ne pousse, et fleurit en octobre.",
    supportNotes: {
      "holly-blue":
        "La seconde génération de l'azuré des nerpruns pond sur les boutons floraux du lierre en fin d'été.",
      "red-admiral":
        "Les fleurs de lierre d'octobre sont le dernier grand repas de l'année du vulcain.",
      "winter-thrushes":
        "Mûres en fin d'hiver, quand il reste peu d'autres fruits.",
    },
  },
  "Digitalis purpurea": {
    nativeNote:
      "Lus nam ban-sìth en gaélique, « la plante des femmes-fées » — en lisière des bois, sur les terrains dégagés et les talus acides.",
    careNote:
      "Elle fleurit la deuxième année, puis meurt en général. Laissez-la grainer et elle se maintient seule. Toutes ses parties sont toxiques.",
    givesNote:
      "Faite pour les bourdons : ils entrent tout entiers dans les clochettes.",
    propagationNote:
      "Secouez la graine, fine comme de la poussière, à la surface en fin d'été, sans la couvrir.",
    supportNotes: {
      "bumble-bees":
        "Faite pour les bourdons : ils entrent tout entiers dans les clochettes.",
    },
  },
  "Succisa pratensis": {
    nativeNote:
      "Dans les prés humides, les landes humides et les bords de route de toutes les basses terres.",
    careNote:
      "Elle aime un sol humide non fertilisé et une fauche tardive. Lente par semis ; les plants en mottes vont plus vite.",
    givesNote:
      "Du nectar tardif jusqu'en octobre. La seule nourriture de la chenille du damier de la succise, un papillon qui se maintient encore dans le sud-ouest de l'Écosse.",
    propagationNote:
      "Semez la graine fraîche dehors à l'automne pour que l'hiver la refroidisse.",
    supportNotes: {
      "marsh-fritillary":
        "Les chenilles du damier de la succise ne mangent que la succise des prés. Les colonies écossaises sont dans le sud-ouest, en Dumfries and Galloway et en Argyll.",
      "bumble-bees":
        "Du nectar tardif jusqu'en octobre.",
    },
  },
  "Centaurea nigra": {
    nativeNote:
      "Hardheads en scots — dans chaque prairie non amendée, chaque bord de route et chaque talus de voie ferrée.",
    careNote:
      "Facile dans toute prairie ensoleillée. Fauchez en fin d'été, après la montée en graines.",
    givesNote:
      "L'une des meilleures plantes à nectar de fin d'été pour les bourdons et les papillons. Les chardonnerets prennent ses graines.",
    propagationNote:
      "Semez au printemps ou à l'automne ; elle lève sans peine.",
    supportNotes: {
      "bumble-bees":
        "L'une des meilleures fleurs à bourdons de fin d'été.",
      "goldfinches-linnets":
        "Les chardonnerets picorent la graine dans les capitules secs à l'automne.",
      "painted-lady":
        "Les belles-dames arrivant du sud butinent la centaurée en été.",
    },
  },
  "Knautia arvensis": {
    nativeNote:
      "Sur les talus secs, les bords de route et les bordures de champ, surtout dans l'est : le Fife, les Lothians et les Borders.",
    careNote:
      "Elle veut du soleil et un sol drainant, calcaire ou neutre. Une racine pivotante profonde la rend insensible à la sécheresse.",
    givesNote:
      "Des pelotes à épingles lilas qu'abeilles, syrphes et papillons se disputent tout l'été.",
    propagationNote:
      "Semez dehors à l'automne ou au printemps.",
    supportNotes: {
      "bumble-bees":
        "Chaque tête en pelote compte des dizaines de petites fleurs, si bien qu'une abeille peut se nourrir longtemps sans voler.",
    },
  },
  "Leucanthemum vulgare": {
    nativeNote:
      "Dans les prés, les bords de route et les prairies nouvelles de toutes les basses terres, souvent la première à fleurir sur un talus neuf.",
    careNote:
      "Rapide et facile par semis en sol pauvre. Elle s'efface quand l'herbe s'épaissit, sauf si la prairie est fauchée et ratissée chaque année.",
    givesNote:
      "Des fleurs ouvertes pour les syrphes, les coléoptères et les petites abeilles au début de l'été.",
    propagationNote:
      "Répandez la graine sur sol nu à l'automne ou au printemps.",
  },
  "Geranium sylvaticum": {
    nativeNote:
      "Une fleur du nord — dans les prés de fauche, au bord des ruisseaux et des routes des Borders et des Southern Uplands.",
    careNote:
      "À l'aise à mi-ombre en sol frais et fertile. Rabattez-le après la floraison pour un feuillage neuf.",
    givesNote:
      "Des fleurs violettes en juin que bourdons et abeilles solitaires visitent sans relâche.",
    propagationNote:
      "Divisez les touffes au printemps. La graine semée fraîche en fin d'été lève le printemps suivant.",
    supportNotes: {
      "bumble-bees":
        "Le géranium des bois remplit en juin les prés de fauche d'altitude et les bords de route, et les bourdons en visitent tout le massif.",
    },
  },
  "Geranium sanguineum": {
    nativeNote:
      "Sur les falaises maritimes, les dunes et les buttes rocheuses, surtout le long des côtes du Forth et de la Tay.",
    careNote:
      "Pour les endroits ensoleillés, secs et bien drainés, comme une rocaille ou un haut de mur. Insensible à la sécheresse une fois installé.",
    givesNote:
      "Des fleurs magenta tout l'été pour les abeilles, sur un sol trop sec pour la plupart des plantes.",
    propagationNote:
      "Divisez au printemps, ou semez la graine fraîche dehors.",
    supportNotes: {
      "bumble-bees":
        "Les abeilles visitent les fleurs ouvertes tout l'été.",
    },
  },
  "Primula vulgaris": {
    nativeNote:
      "Sòbhrach en gaélique — sur les talus boisés, les bords de ruisseau et les bords de route ombragés.",
    careNote:
      "Elle aime l'ombre tamisée et un sol qui ne sèche pas : sous une haie ou un arbuste caduc.",
    givesNote:
      "Du nectar pour les premières reines de bourdons et les premiers papillons sortis d'hibernation.",
    propagationNote:
      "Divisez les touffes juste après la floraison. Semez la graine fraîche en été.",
    supportNotes: {
      "mason-bees":
        "Du nectar précoce pour les premières abeilles solitaires du printemps.",
    },
  },
  "Primula veris": {
    nativeNote:
      "Sur les talus calcaires ensoleillés et les pelouses littorales, surtout dans l'est de la région.",
    careNote:
      "Pour une herbe rase et ensoleillée, sans engrais. Attendez qu'elle ait grainé, au début de l'été, pour tondre.",
    givesNote:
      "Du nectar de printemps pour les bourdons à langue longue, sur une herbe rase et sèche.",
    propagationNote:
      "Semez la graine fraîche dehors en fin d'été ; il lui faut le froid de l'hiver.",
    supportNotes: {
      "bumble-bees":
        "Le nectar est au fond du tube : la primevère officinale nourrit les reines de bourdons à longue langue tout juste sorties d'hibernation.",
    },
  },
  "Filipendula ulmaria": {
    nativeNote:
      "Elle borde d'une écume crème chaque fossé, chaque ruisseau et chaque pré humide des basses terres en juillet.",
    careNote:
      "Pour un sol humide : un bord de mare, un fossé ou un jardin de pluie. Elle s'étend régulièrement, sans être envahissante.",
    givesNote:
      "Un pollen abondant et un parfum lourd pour les syrphes, les coléoptères et les abeilles, et un couvert dense pour les grenouilles.",
    propagationNote:
      "Divisez au printemps. La graine semée dehors à l'automne lève l'année suivante.",
    supportNotes: {
      "mason-bees":
        "La reine-des-prés offre du pollen et pas de nectar, et c'est justement ce que viennent chercher les abeilles à langue courte et les syrphes.",
    },
  },
  "Iris pseudacorus": {
    nativeNote:
      "Seileasdair en gaélique — dans les prés humides, les bords de loch et les fossés de toutes les basses terres.",
    careNote:
      "Il pousse en eau peu profonde ou en sol humide et s'étend par d'épais rhizomes. Dans une petite mare, gardez-le en panier.",
    givesNote:
      "Les bourdons à langue longue travaillent ses fleurs, et ses massifs abritent gallinules poules-d'eau et canetons.",
    propagationNote:
      "Après la floraison, coupez un morceau de rhizome portant des feuilles et replantez-le.",
    supportNotes: {
      "bumble-bees":
        "Chaque fleur offre trois pistes d'atterrissage marquées de guides à nectar. Un bourdon se glisse sous le style et ressort couvert de pollen.",
    },
  },
  "Caltha palustris": {
    nativeNote:
      "Lus buidhe Bealltainn en gaélique, « la plante jaune du premier mai » — dans les bois humides, les suintements et les bords de ruisseau.",
    careNote:
      "Il lui faut une boue qui ne sèche jamais : un bord de mare ou un creux marécageux.",
    givesNote:
      "De grandes coupes jaunes de pollen et de nectar pour les premières abeilles et les syrphes en mars.",
    propagationNote:
      "Divisez les touffes après la floraison. Semez la graine fraîche sur un terreau détrempé.",
    supportNotes: {
      "mason-bees":
        "De grandes coupes dorées et ouvertes au début du printemps, quand les premières andrènes sortent et n'ont presque rien d'autre à butiner.",
    },
  },
  "Valeriana officinalis": {
    nativeNote:
      "Dans les prés humides, les bords de ruisseau et les fossés de toutes les basses terres.",
    careNote:
      "Haute et aérienne ; elle aime un sol frais, au soleil ou à mi-ombre. Elle se ressème un peu.",
    givesNote:
      "Des têtes rose pâle parfumées que syrphes, abeilles et papillons visitent tout l'été.",
    propagationNote:
      "Divisez au printemps, ou pressez la graine à la surface d'un terreau humide.",
  },
  "Geum rivale": {
    nativeNote:
      "Une plante du nord des prés humides, des bois humides et des bords de ruisseau, commune dans toute l'Écosse.",
    careNote:
      "Pour un sol humide à mi-ombre, près d'une mare ou sous des arbustes.",
    givesNote:
      "Des clochettes penchées où les bourdons se suspendent pour atteindre le nectar.",
    propagationNote:
      "Divisez au printemps ou à l'automne.",
    supportNotes: {
      "bumble-bees":
        "Les clochettes penchées pendent tête en bas, une forme qui convient aux bourdons, qui s'y accrochent par-dessous pour boire.",
    },
  },
  "Achillea millefolium": {
    nativeNote:
      "Dans les pelouses, les bords de route, les dunes et les pâtures, partout dans les basses terres.",
    careNote:
      "Insensible à la sécheresse, elle s'étend doucement par stolons. Tondez autour et elle fleurit bas dans une pelouse.",
    givesNote:
      "Des corymbes plats où syrphes et petites guêpes se nourrissent des mois durant.",
    propagationNote:
      "Détachez un stolon enraciné au printemps. La graine a besoin de lumière : pressez-la en surface.",
    pioneerNote:
      "Elle supporte d'être piétinée et tondue, c'est pourquoi on la trouve dans presque chaque pelouse et chaque bord de route, et elle fleurit quand même.",
  },
  "Campanula rotundifolia": {
    nativeNote:
      "La « bluebell » de l'Écosse, sur les talus secs, les dunes et les pelouses de colline. La plante des bois que l'Angleterre appelle « bluebell » est une autre espèce, la jacinthe des bois.",
    careNote:
      "Elle veut un sol mince, sec et pauvre, sans concurrence d'une herbe drue. Ravissante dans une fente de mur ou en bordure d'allée gravillonnée.",
    givesNote:
      "Petites abeilles et syrphes rampent dans les clochettes pour se nourrir, et s'y abritent les nuits froides.",
    propagationNote:
      "Pressez la graine, fine comme de la poussière, sur un terreau graveleux au printemps et gardez-le humide.",
    supportNotes: {
      "bumble-bees":
        "Les petits bourdons grimpent jusqu'au fond des clochettes pendantes pour atteindre le nectar.",
    },
  },
  "Hyacinthoides non-scripta": {
    nativeNote:
      "Elle tapisse en mai les chênaies et les boulaies des basses terres et les pentes à fougère aigle. Beaucoup d'Écossais l'appellent « wild hyacinth » et réservent « bluebell » à la campanule à feuilles rondes.",
    careNote:
      "Plantez les bulbes à l'automne sous des arbres ou des arbustes caducs. Achetez-les en pépinière, jamais prélevés dans la nature, et évitez la jacinthe d'Espagne, qui s'hybride avec elle.",
    givesNote:
      "Du nectar pour les reines de bourdons au printemps, avant que la canopée ne se ferme.",
    propagationNote:
      "Semez la graine mûre dehors en été ; elle fleurit au bout de cinq ans environ. Les touffes se divisent une fois les feuilles fanées.",
    supportNotes: {
      "bumble-bees":
        "Les reines de bourdons butinent les bois de jacinthes en mai. Celles à langue courte percent souvent la base de la clochette pour voler le nectar.",
    },
  },
  "Armeria maritima": {
    nativeNote:
      "Tonn a' chladaich en gaélique — en coussins sur les falaises maritimes et les prés salés tout autour du Forth, de la Clyde et du Solway.",
    careNote:
      "Pour le soleil, le vent, le sel et un drainage parfait : une rocaille, un haut de mur ou un jardin de gravier. Elle pourrit dans l'argile humide.",
    givesNote:
      "Des pompons roses pour les abeilles et les papillons dès mai, sur le sol le plus exposé du jardin.",
    propagationNote:
      "Divisez le coussin au printemps, ou semez la graine dans un mélange graveleux.",
    pioneerNote:
      "Elle pousse dans les fissures des digues et sur les sols salés : un bord de route salé l'hiver ou le joint entre deux dalles lui convient.",
    supportNotes: {
      "bumble-bees":
        "Des coussins roses sur les falaises et les prés salés, en fleur pendant des mois ; les bourdons les butinent tout le long de la côte.",
    },
  },
  "Silene dioica": {
    nativeNote:
      "En lisière des bois, sur les talus de haie et les falaises maritimes de toutes les basses terres.",
    careNote:
      "Facile à mi-ombre en sol ordinaire. Elle se ressème doucement.",
    givesNote:
      "Une longue saison de fleurs roses pour les bourdons et les papillons, et des graines pour les fringilles.",
    propagationNote:
      "Semez dehors au printemps ou à l'automne.",
    supportNotes: {
      "bumble-bees":
        "Une longue saison de fleurs pour les bourdons.",
    },
  },
  "Teucrium scorodonia": {
    nativeNote:
      "Sur les talus secs et acides, les lisières et les pentes rocheuses de toutes les basses terres.",
    careNote:
      "Pour l'ombre sèche et les sols pauvres, où peu d'autres plantes fleurissent.",
    givesNote:
      "Des épis pâles que les bourdons travaillent sans relâche en fin d'été.",
    propagationNote:
      "Divisez au printemps, ou semez à l'automne.",
    supportNotes: {
      "bumble-bees":
        "Les bourdons travaillent ses épis pâles en fin d'été.",
    },
  },
  "Trollius europaeus": {
    nativeNote:
      "Une fleur du nord des prés de fauche humides et des bords de ruisseau, dans les Borders, le Dumfriesshire et les Southern Uplands.",
    careNote:
      "Il veut un sol frais et humide qui ne sèche jamais. Lent à s'installer, puis longévif.",
    givesNote:
      "Des globes jaunes fermés où de minuscules mouches Chiastocheta se glissent pour polliniser, en pondant au passage.",
    propagationNote:
      "Semez la graine fraîche dehors en fin d'été ; la vieille graine est lente. Divisez au début du printemps.",
    supportNotes: {
      "bumble-bees":
        "Le trolle ne s'ouvre jamais tout à fait : un insecte doit forcer le passage par le haut. Ses principaux partenaires sont de minuscules mouches ; les bourdons y entrent aussi.",
    },
  },
  "Cirsium heterophyllum": {
    nativeNote:
      "Un chardon sans épines du nord, des prés humides, des bords de route et des bords de ruisseau, bien plus commun en Écosse que dans le sud.",
    careNote:
      "Pas de piquants, contrairement à la plupart des chardons. Il s'étend lentement par stolons en sol frais.",
    givesNote:
      "De gros capitules pourpres où se nourrissent bourdons et papillons, puis des graines pour les chardonnerets.",
    propagationNote:
      "Soulevez un stolon enraciné au printemps.",
    supportNotes: {
      "bumble-bees":
        "De grosses têtes pourpres dans les prés d'altitude en juillet, butinées par les bourdons pendant des semaines.",
      "goldfinches-linnets":
        "Laissez les têtes debout, et les chardonnerets en tirent les graines duveteuses jusqu'à la fin de l'été.",
      "dark-green-fritillary":
        "C'est sur les chardons qu'un grand nacré se pose assez longtemps pour qu'on le voie ; le reste du temps, ce n'est qu'un éclair orange.",
    },
  },
  "Rhinanthus minor": {
    nativeNote:
      "Dans les prés de fauche et les vieilles prairies de toutes les basses terres.",
    careNote:
      "Il se nourrit sur les racines des graminées et les affaiblit, ce qui laisse entrer les fleurs sauvages. Semez la graine fraîche à l'automne sur un gazon griffé ; il lui faut le froid de l'hiver.",
    givesNote:
      "Le moyen le plus rapide de changer une pelouse en prairie, et les bourdons visitent ses fleurs.",
    propagationNote:
      "La graine ne se garde qu'un an. Semez-la fraîche entre août et novembre.",
    supportNotes: {
      "bumble-bees":
        "La fleur en capuchon du rhinanthe ne s'ouvre qu'à une abeille assez forte pour la forcer : des bourdons, surtout.",
    },
  },
  "Lotus corniculatus": {
    nativeNote:
      "Dans l'herbe rase, les bords de route, les dunes et les pelouses, partout dans les basses terres.",
    careNote:
      "Il pousse en sol pauvre et sec et supporte la tonte. Laissez pousser un coin de pelouse et il apparaît.",
    givesNote:
      "La plante nourricière de l'azuré commun et de la zygène de la filipendule, et une favorite des bourdons.",
    propagationNote:
      "Frottez la graine entre deux papiers de verre avant de la semer au printemps.",
    supportNotes: {
      "common-blue":
        "La principale plante nourricière de l'azuré commun en Écosse.",
      "six-spot-burnet":
        "Les chenilles de la zygène de la filipendule le mangent sur les dunes et les bords de route.",
    },
  },
  "Thymus praecox": {
    nativeNote:
      "Sur les talus secs, les rochers, les dunes et les pelouses rases de colline de toutes les basses terres.",
    careNote:
      "Pour le soleil et un drainage parfait : entre des dalles, sur un haut de mur ou dans du gravier.",
    givesNote:
      "Un tapis bas bourdonnant d'abeilles tout l'été.",
    propagationNote:
      "Les tiges s'enracinent là où elles touchent le sol ; coupez un morceau enraciné et replantez-le.",
    pioneerNote:
      "Il vit sur la roche nue et les sols minces des collines : un haut de mur ensoleillé ou les joints d'une terrasse sont chez lui.",
    supportNotes: {
      "bumble-bees":
        "Un tapis bas de nectar que les abeilles travaillent tout l'été.",
    },
  },
  "Fragaria vesca": {
    nativeNote:
      "Sur les talus boisés, les voies de garage et les vieux murs de toutes les basses terres.",
    careNote:
      "Il s'étend par stolons en tapis sous les arbustes ou le long d'une allée. Il supporte un peu d'ombre.",
    givesNote:
      "De petites fraises sucrées pour les merles et les gens, et des fleurs pour les petites abeilles.",
    propagationNote:
      "Agrafez le plantule d'un stolon dans un pot de terreau ; détachez-le une fois enraciné.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches ouvertes dès avril, à hauteur de cheville : un atterrissage facile pour les andrènes d'un talus ensoleillé.",
      "blackcaps-warblers":
        "De minuscules fraises intenses, que rouges-gorges et fauvettes à tête noire trouvent bien avant quiconque avec un bol.",
    },
  },
  "Deschampsia cespitosa": {
    nativeNote:
      "Dans les pâtures humides, les bois humides et les bords de ruisseau de toutes les basses terres.",
    careNote:
      "Elle forme de grosses touffes en sol humide, au soleil ou à l'ombre. Peignez les feuilles mortes au printemps.",
    givesNote:
      "Des nuages d'inflorescences, des graines pour les fringilles, et des touffes où coléoptères et araignées passent l'hiver.",
    propagationNote:
      "Divisez les touffes au printemps.",
    supportNotes: {
      "grass-skippers":
        "Le tristan pond sur des graminées grossières comme la canche cespiteuse, dans les coins humides et ombragés, et ses chenilles se nourrissent pendant les nuits douces de l'hiver.",
    },
  },
  "Avenella flexuosa": {
    nativeNote:
      "En sol sec et acide dans les boulaies et les chênaies, les landes et les bruyères de toutes les basses terres.",
    careNote:
      "Une graminée fine et basse pour l'ombre sèche en sol acide, là où le gazon renonce.",
    givesNote:
      "Des épis chatoyants pourpre-bronze en été, et la nourriture des chenilles des papillons qui mangent les graminées.",
    propagationNote:
      "Divisez les touffes au printemps.",
  },
  "Luzula sylvatica": {
    nativeNote:
      "Elle tapisse le sol des chênaies et des boulaies des basses terres et des gorges ombragées des ruisseaux.",
    careNote:
      "Persistante et dense ; elle couvre un talus ombragé et étouffe les mauvaises herbes. Elle pousse à l'ombre la plus profonde.",
    givesNote:
      "Un couvert toute l'année pour les carabes et les petits mammifères sous les arbres.",
    propagationNote:
      "Divisez les touffes au printemps ou à l'automne.",
  },
  "Dryopteris filix-mas": {
    nativeNote:
      "Dans les bois, sur les talus de haie et les murs ombragés, partout dans les basses terres.",
    careNote:
      "La fougère la plus facile qui soit : ombre sèche, ombre humide, sous les arbres.",
    givesNote:
      "Un abri pour les grenouilles, les coléoptères et les troglodytes toute l'année.",
    propagationNote:
      "Divisez une vieille souche au printemps.",
  },
  "Struthiopteris spicant": {
    nativeNote:
      "Sur les talus acides des chênaies et des boulaies, et au bord des ruisseaux des landes.",
    careNote:
      "Persistante ; elle veut un sol acide et une ombre qui ne sèche pas.",
    givesNote:
      "Un couvert luisant toute l'année sur les talus acides ombragés.",
    propagationNote:
      "Semez les spores mûres sur un terreau stérile, sous verre. Les vieilles touffes se divisent.",
  },
  "Polystichum aculeatum": {
    nativeNote:
      "Sur les berges ombragées et rocheuses des ruisseaux et dans les bois calcaires, le polystic du nord.",
    careNote:
      "Persistant et robuste ; bien sur un mur ou un talus ombragé un peu calcaire.",
    givesNote:
      "Un couvert sombre et luisant toute l'année, à l'ombre.",
    propagationNote:
      "Semez les spores, ou divisez une vieille souche.",
  },
  "Salix pentandra": {
    supportNotes: {
      "poplar-hawk-moth":
        "Les chenilles du sphinx du peuplier mangent les saules autant que les peupliers et le tremble : un saule à cinq étamines au bord d'un ruisseau fait l'affaire.",
      "bumble-bees":
        "Le saule à cinq étamines fleurit tard, en mai et juin, feuilles sorties : de quoi nourrir les abeilles quand les autres saules ont fini.",
    },
  },
  "Salix aurita": {
    supportNotes: {
      "mason-bees":
        "Andrena clarkella, une andrène, ne récolte que du pollen de saule et sort en mars pour les premiers chatons.",
      "poplar-hawk-moth":
        "Encore un saule sur la liste du sphinx du peuplier. Les grosses chenilles vertes se plaquent le long d'un rameau et sont difficiles à repérer.",
    },
  },
  "Erica tetralix": {
    supportNotes: {
      "bumble-bees":
        "La bruyère des sols mouillés, en fleur dès juin sur la tourbière et la lande humide, là où presque rien d'autre ne fleurit.",
    },
  },
  "Rubus idaeus": {
    supportNotes: {
      "bumble-bees":
        "Les fleurs du framboisier pendent vers le bas, ce qui convient aux bourdons : ils s'y accrochent par-dessous pour boire.",
      "blackcaps-warblers":
        "Rouges-gorges et fauvettes à tête noire prennent les fruits à la fin de l'été, et les cannes sont assez denses pour y nicher.",
    },
  },
  "Vicia cracca": {
    supportNotes: {
      "bumble-bees":
        "Les bourdons à longue langue visitent tout l'été ses épis violets, fleuris d'un seul côté.",
    },
  },
  "Lathyrus pratensis": {
    supportNotes: {
      "bumble-bees":
        "Une fleur de pois jaune demande une abeille assez lourde pour l'ouvrir : c'est une nourriture de bourdons.",
    },
  },
  "Anemone nemorosa": {
    supportNotes: {
      "mason-bees":
        "L'anémone des bois offre du pollen plutôt que du nectar, et c'est le pollen qu'une abeille solitaire précoce récolte pour son nid.",
    },
  },
  "Allium ursinum": {
    supportNotes: {
      "mason-bees":
        "Des nappes blanches dans les bois ombragés en mai, l'une des rares bonnes fleurs du sous-bois une fois la canopée refermée.",
    },
  },
  "Viola riviniana": {
    supportNotes: {
      "small-pearl-bordered-fritillary":
        "La violette de Rivinus est la principale plante-hôte du petit collier argenté, dans les prairies humides, les fougeraies et les clairières.",
      "dark-green-fritillary":
        "Le grand nacré pond lui aussi sur les violettes, sur un terrain plus sec et plus ouvert : coteaux herbeux et dunes.",
    },
  },
  "Cardamine pratensis": {
    supportNotes: {
      "orange-tip":
        "L'aurore pond un seul œuf sur la tige d'une fleur, et la chenille mange les siliques. Elle s'est répandue dans toute l'Écosse ces dernières décennies.",
    },
  },
  "Silene flos-cuculi": {
    supportNotes: {
      "bumble-bees":
        "Le nectar est au fond d'un tube étroit : la fleur de coucou nourrit les bourdons à longue langue et les papillons.",
    },
  },
  "Galium verum": {
    supportNotes: {
      "elephant-hawk-moth":
        "Les chenilles du grand sphinx de la vigne mangent les gaillets et les épilobes. Inquiétée, la chenille, grosse comme un doigt, gonfle quatre ocelles et prend l'air d'un petit serpent.",
      "hummingbird-hawk-moth":
        "Le moro-sphinx pond lui aussi sur les gaillets. Il arrive du sud jusqu'en Écosse les étés chauds et fait du vol stationnaire devant les fleurs en plein jour.",
    },
  },
  "Ajuga reptans": {
    supportNotes: {
      "small-pearl-bordered-fritillary":
        "La bugle rampante fleurit au moment où sort le petit collier argenté, et c'est l'une de ses fleurs préférées dans une clairière.",
      "bumble-bees":
        "Des épis bleus à l'ombre humide en mai, butinés par les reines de bourdons.",
    },
  },
  "Potentilla erecta": {
    supportNotes: {
      "mason-bees":
        "Andrena tarsata ne récolte le pollen que de la potentille tormentille, ou presque. Elle est devenue rare et vit là où la tormentille fleurit encore, dans les prairies et les landes non fertilisées.",
    },
  },
  "Prunella vulgaris": {
    supportNotes: {
      "bumble-bees":
        "Des têtes violettes basses dans l'herbe rase tout l'été, butinées par les bourdons même là où la pelouse est tondue.",
    },
  },
  "Festuca rubra": {
    supportNotes: {
      "grass-skippers":
        "Le myrtil et le fadet commun pondent sur les graminées fines comme la fétuque rouge, et les chenilles passent l'hiver au pied de la touffe. Tondez tout ras et elles n'ont plus où aller.",
    },
  },
  "Molinia caerulea": {
    supportNotes: {
      "scotch-argus":
        "En Écosse, les chenilles du moiré sylvicole se nourrissent de molinie bleue et de presque rien d'autre : une haute touffe non fauchée sur sol humide, c'est tout leur habitat.",
    },
  },
};
