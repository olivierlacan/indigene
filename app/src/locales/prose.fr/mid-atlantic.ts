// The Mid-Atlantic / Northeast Piedmont, referenced on Pennsylvania.
//
// Three taxa here also appear on another list — red maple and butterfly weed in
// central Florida, red osier dogwood in the Pacific Northwest — and their rows
// differ there, so those regions carry a region-qualified entry of their own.
// The plain keys below are the Mid-Atlantic reading.
//
// A few of the insects have no French name (see `taxa.fr.ts`), so a paragraph
// names them the way the heading above it will: with the scientific name, not an
// invented vernacular. See `./index.ts`.
import type { ProseTable } from "../../lib/prose";

export const MID_ATLANTIC: ProseTable = {
  // -------------------------------------------------------------------------
  // Mid-Atlantic — arbres.
  // -------------------------------------------------------------------------
  "Quercus alba": {
    nativeNote:
      "Indigène dans tout l'est des États-Unis ; un arbre de fondation des bois de Pennsylvanie.",
    careNote:
      "Plantez-le petit et laissez-le tranquille — sa racine pivotante le rend difficile à transplanter mais très autonome une fois installé.",
    givesNote:
      "Les chênes hébergent plus d'espèces de chenilles qu'aucun autre genre d'arbre ici — des centaines — plus des glands pour des dizaines d'oiseaux et de mammifères, et des générations d'ombre.",
    propagationNote:
      "Ramassez les glands bien pleins à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent. Les glands de chêne blanc n'ont pas de dormance et meurent s'ils sèchent : semez-les donc tout de suite, à 3 à 5 cm de profondeur. La racine pousse dès l'automne, la tige sort au printemps.",
    supportNotes: {
      "acorn-birds":
        "Les glands doux du chêne blanc sont une nourriture de premier ordre pour les dindons sauvages, les canards branchus et les geais bleus, qui en font des réserves.",
      "acorn-mammals":
        "L'un des meilleurs arbres à glands qui soient — écureuils, cerfs de Virginie et ours s'engraissent sur la chute d'automne.",
      "luna-moth":
        "Parmi les centaines d'espèces de chenilles des chênes figurent les grands bombyx de la soie ; le chêne est un hôte fiable du papillon lune.",
    },
  },
  "Quercus rubra": {
    nativeNote: "Indigène dans tout le Nord-Est ; plus rapide que le chêne blanc.",
    careNote:
      "Il pousse nettement plus vite que le chêne blanc ; donnez-lui la place d'atteindre une grande taille adulte.",
    givesNote:
      "Des centaines d'espèces de chenilles et de lourdes récoltes de glands ; le moyen le plus rapide d'offrir au réseau trophique les bienfaits d'un chêne.",
    propagationNote:
      "Récoltez les glands tombés à l'automne et faites le test de flottaison, en jetant ceux qui flottent. Contrairement au chêne blanc, les glands de chêne rouge ont besoin d'un hiver froid et humide pour germer : semez-les dehors à l'automne, ou gardez-les un à trois mois dans un sachet humide au réfrigérateur avant un semis de printemps. Ne les laissez pas sécher.",
    supportNotes: {
      "acorn-birds":
        "Ses lourdes récoltes de glands nourrissent geais, dindons sauvages et pics tout l'automne et l'hiver.",
      "acorn-mammals":
        "Des glands fiables pour les écureuils, les cerfs de Virginie et d'autres mammifères.",
      "cecropia-moth":
        "Les chênes sont parmi les nombreux arbres dont les feuilles nourrissent les chenilles de l'Hyalophora cecropia et des autres grands bombyx de la soie.",
    },
  },
  "Acer rubrum": {
    nativeNote: "L'un des arbres indigènes les plus communs de l'est des États-Unis.",
    careNote:
      "Adaptable et rapide ; il tolère les sols gorgés d'eau. Ses feuilles flétries sont toxiques pour les chevaux — ce qui ne concerne pas la plupart des jardins.",
    givesNote:
      "Ses fleurs rouges précoces nourrissent les premières abeilles du printemps, ses graines nourrissent les oiseaux, et il héberge des centaines de chenilles.",
    propagationNote:
      "Les graines ailées de l'érable rouge mûrissent à la fin du printemps, bien plus tôt que chez la plupart des arbres. Attrapez-les quand elles brunissent et semez-les fraîches : la plupart lèvent en quelques jours, sans aucun froid. Les graines de certains arbres ont besoin d'un passage au froid et attendent le printemps suivant.",
    supportNotes: {
      "cecropia-moth":
        "Les érables sont un hôte de base des chenilles de l'Hyalophora cecropia.",
    },
    lookalikeNotes: {
      "acer-platanoides": {
        why: "Deux grands érables d'alignement à pousses neuves teintées de rouge et à samares appariées, plantés dans les mêmes rues pour les mêmes raisons.",
        tells: [
          { feature: "Cassez un pétiole", native: "Sève claire.", lookalike: "Une goutte de sève blanche laiteuse — aucun érable indigène d'ici ne fait cela." },
          { feature: "Feuille", native: "Grande comme une main au plus, trois lobes principaux à échancrures en V, bords dentés, blanchâtre au revers.", lookalike: "Plus large qu'une main, vert sombre, à pointes de lobes longuement étirées et échancrures en U." },
          { feature: "Graines", native: "Samares appariées pendues en V étroit, mûrissant au printemps.", lookalike: "Samares appariées écartées presque en ligne droite, mûrissant à l'automne." },
          { feature: "Automne", native: "Il passe à l'écarlate tôt — souvent le premier arbre de la rue à tourner.", lookalike: "Il passe au jaune ordinaire, et garde ses feuilles des semaines de plus." },
        ],
      },
    },
  },
  "Betula nigra": {
    nativeNote:
      "Indigène des plaines inondables et des berges de tout l'Est.",
    careNote:
      "Il adore les terrains frais — parfait pour un point bas détrempé, mais il demande de l'eau le temps de s'installer sur un site sec.",
    givesNote:
      "Une écorce couleur cannelle qui s'exfolie, des centaines d'espèces de chenilles, et des racines qui maintiennent une berge.",
    propagationNote:
      "La graine du bouleau noir mûrit à la fin du printemps, contrairement à la plupart des arbres — ramassez les petits cônes quand ils brunissent et laissez-les s'émietter dans un sac en papier. Semez la graine fraîche à la surface d'un terreau humide, sans la couvrir : à la lumière, elle n'a besoin d'aucun froid et lève en une quinzaine de jours.",
    supportNotes: {
      "luna-moth":
        "Le bouleau est un arbre de prédilection pour les chenilles du papillon lune.",
      "eastern-tiger-swallowtail":
        "Parmi les bouleaux et les autres arbres que les chenilles du Papilio glaucus acceptent.",
    },
  },
  "Prunus serotina": {
    nativeNote: "Arbre pionnier indigène de tout l'est des États-Unis.",
    careNote:
      "Il se ressème librement alentour : arrachez les semis indésirables. Ses feuilles flétries et ses noyaux sont toxiques pour le bétail et les animaux domestiques.",
    givesNote:
      "Juste après les chênes pour les chenilles ; des nuages de fleurs printanières et des fruits d'été pour des dizaines d'espèces d'oiseaux.",
    propagationNote:
      "Écrasez les fruits mûrs d'été et rincez la pulpe des noyaux. Les noyaux ont besoin d'un hiver froid et humide pour lever : semez-les dehors à l'automne, ou gardez-les environ quatre mois dans de la perlite humide au réfrigérateur avant un semis de printemps.",
    supportNotes: {
      "eastern-tiger-swallowtail":
        "Le cerisier tardif est l'un des principaux arbres nourriciers du Papilio glaucus.",
      "cecropia-moth":
        "Un hôte classique des chenilles de l'Hyalophora cecropia et des autres grands bombyx de la soie.",
      viceroy:
        "Outre les saules et les peupliers, les chenilles du vice-roi utilisent parfois les cerisiers.",
      "berry-songbirds":
        "Ses cerises d'été sont dévorées par des dizaines de passereaux, des grives aux moqueurs chats.",
    },
  },
  "Cercis canadensis": {
    supportNotes: {
      "eastern-carpenter-bee":
        "Les fleurs du gainier s'ouvrent avant les feuilles et sont faites pour être écartées par quelque chose de lourd. Le xylocope l'est assez — et là où on le laisse tranquille, il perce plutôt une fente à la base et boit par là.",
      "bumble-bees":
        "Un gainier en avril est l'un des premiers grands repas de l'année pour les reines qui viennent de sortir d'hibernation avec un nid à fonder.",
    },
    nativeNote: "Arbre de sous-bois indigène de l'est des États-Unis.",
    careNote:
      "Petit et robuste ; il se plaît à mi-ombre en lisière boisée ou en arbre de terrasse.",
    givesNote:
      "Ses fleurs rose vif s'ouvrent à même les branches au début du printemps, nourrissant les reines de bourdons quand peu de choses sont ouvertes.",
    propagationNote:
      "La graine du gainier a à la fois un tégument dur et imperméable et un embryon dormant : il lui faut donc deux traitements. Entaillez chaque graine à la lime ou au papier de verre (ou laissez-la tremper une nuit dans de l'eau chaude qui refroidit), puis gardez-la au froid et humide au réfrigérateur un à trois mois avant de semer.",
  },
  "Amelanchier canadensis": {
    nativeNote:
      "Petit arbre ou grand arbuste indigène de tout le Nord-Est.",
    careNote:
      "Décoratif en toute saison, et d'une taille commode. Un peu d'eau l'été de la première année est payant.",
    givesNote:
      "Des fleurs blanches précoces pour les abeilles, des baies de juin adorées des oiseaux (et des gens), et un feuillage d'automne flamboyant.",
    propagationNote:
      "Cueillez les baies de juin quand elles sont pourpre foncé, écrasez-les, et rincez les minuscules graines de toute pulpe. Il leur faut un hiver froid et humide : semez-les dehors aussitôt, ou gardez-les humides trois à quatre mois au réfrigérateur avant un semis de printemps. Soyez patient — beaucoup attendent le deuxième printemps.",
    supportNotes: {
      "cedar-waxwing":
        "Les amélanches du début de l'été sont une nourriture de premier ordre pour les jaseurs — une bande peut vider un arbre en une journée.",
      "berry-songbirds":
        "Merles d'Amérique, grives, moqueurs chats et cardinaux prennent tous les fruits sucrés de juin.",
      "mason-bees":
        "L'un des premiers arbustes-arbres à fleurir, nourrissant les abeilles solitaires précoces.",
    },
    lookalikeNotes: {
      "pyrus-calleryana": {
        why: "Deux petits arbres noyés de fleurs blanches dans la même semaine douce du début du printemps, souvent sur le même parking.",
        tells: [
          { feature: "Odeur", native: "Presque aucune — il faut y mettre le nez.", lookalike: "Une forte odeur aigre, de poisson, qu'on capte de l'autre côté de la route." },
          { feature: "Fleurs", native: "Cinq pétales étroits, en lanières, en une gerbe lâche et aérée, s'ouvrant en même temps que des feuilles neuves teintées de bronze.", lookalike: "Cinq pétales courts et ronds serrés en boules blanches denses, sur des rameaux nus avant toute feuille." },
          { feature: "Épines", native: "Aucune, jamais.", lookalike: "Les semis sauvages portent des épines raides ; les arbres de rue greffés non, mais leur descendance si." },
          { feature: "Fruits", native: "Des baies sucrées, du rouge au pourpre, en juin, que les oiseaux et les gens mangent.", lookalike: "Des billes brunes et dures de la taille d'un pois, qui tiennent jusqu'en hiver." },
        ],
      },
    },
  },
  "Cornus florida": {
    nativeNote:
      "Arbre de sous-bois indigène emblématique des forêts de l'Est.",
    careNote:
      "Il demande une ombre tamisée et une humidité régulière ; il souffre sur les sites chauds, secs et exposés. Arrosez en période sèche.",
    givesNote:
      "Des baies très riches en graisses que les oiseaux migrateurs recherchent, plus les fleurs printanières classiques.",
    propagationNote:
      "Débarrassez les baies rouge vif d'automne de leur pulpe et semez les noyaux dehors au début de l'automne ; les semis lèvent au printemps suivant. Pour un semis de printemps, gardez-les d'abord environ quatre mois au froid et humide. Les boutures de bois tendre s'enracinent aussi en été.",
    supportNotes: {
      "cedar-waxwing":
        "Ses drupes rouges d'automne, très riches en graisses, sont recherchées par les jaseurs et les passereaux migrateurs.",
      "berry-songbirds":
        "Le fruit du cornouiller est parmi les nourritures d'automne les plus riches pour les grives et les autres passereaux.",
    },
    lookalikeNotes: {
      "cornus-kousa": {
        why: "Tous deux portent quatre larges « pétales » blancs — en réalité des bractées — autour d'un petit nœud de vraies fleurs, et c'est l'asiatique que vendent la plupart des pépinières.",
        tells: [
          { feature: "Pointe des bractées", native: "Échancrée, comme si on y avait mordu, souvent avec une tache rouille à l'échancrure.", lookalike: "Étirée en une pointe nette." },
          { feature: "Quand il fleurit", native: "En avril, sur les branches nues, avant les feuilles.", lookalike: "Fin mai ou juin, bien après la sortie des feuilles." },
          { feature: "Fruits", native: "Un bouquet serré de baies rouges luisantes que les oiseaux dépouillent à l'automne.", lookalike: "Une unique boule rose-rouge comme une petite framboise, pendue sur son propre pédoncule." },
          { feature: "Écorce", native: "Craquelée en petits blocs carrés, comme une peau d'alligator.", lookalike: "Lisse, s'exfoliant en un patchwork de gris, de fauve et de brun." },
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  // Mid-Atlantic — arbustes.
  // -------------------------------------------------------------------------
  "Hamamelis virginiana": {
    supportNotes: {
      "cecropia-moth":
        "Les feuilles de l'hamamélis nourrissent les chenilles du plus grand papillon de nuit d'Amérique du Nord — un géant vert épais comme un pouce au moment de tisser son cocon.",
      "luna-moth":
        "Les chenilles du papillon lune l'acceptent aussi : il fait partie de la courte liste d'arbres qu'elles prennent.",
    },
    nativeNote:
      "Arbuste ou petit arbre de sous-bois indigène de tout l'Est.",
    careNote: "Un arbuste de lisière boisée accommodant, pour la mi-ombre.",
    givesNote:
      "Ses fleurs jaunes en rubans s'ouvrent en fin d'automne, quand rien d'autre ne fleurit, et nourrissent les papillons de nuit de fin de saison.",
    propagationNote:
      "La graine d'hamamélis est lente. Cueillez les capsules au début de l'automne, avant qu'elles s'ouvrent et la projettent, et semez dehors aussitôt : une partie lève au printemps suivant, beaucoup seulement le printemps d'après. Une voie plus simple est le marcottage — fixez une branche basse au sol à l'automne et détachez-la une fois enracinée.",
  },
  "Vaccinium corymbosum": {
    nativeNote:
      "Indigène de l'est des États-Unis ; l'ancêtre sauvage des myrtilles cultivées.",
    careNote:
      "Il lui faut un sol franchement acide — vérifiez le pH d'abord. Il ne prospérera pas en terrain calcaire, quoi que vous fassiez.",
    givesNote:
      "Un arbuste clé de voûte : des centaines de chenilles, des fleurs printanières pour les abeilles spécialistes, et des baies pour vous et les oiseaux.",
    propagationNote:
      "La voie fiable est la bouture : faites raciner des extrémités de pousses tendres au début de l'été, ou des rameaux nus et dormants en hiver. La graine n'a besoin d'aucun traitement — écrasez des baies mûres, rincez la pulpe et semez en surface, où la lumière l'aide à lever — mais les semis varient et exigent un sol acide.",
    supportNotes: {
      "mason-bees":
        "Les fleurs de myrtillier se pollinisent par vibration, si bien que les bourdons en sont les meilleurs pollinisateurs ; les osmies et les andrènes indigènes les butinent aussi.",
      "berry-songbirds":
        "Ses baies d'été nourrissent moqueurs chats, grives et bien d'autres oiseaux — si vous leur en laissez.",
    },
  },
  "Ilex verticillata": {
    nativeNote:
      "Houx caduc indigène des zones humides et des bois bas de l'Est.",
    careNote:
      "Il faut un pied mâle à proximité pour que la femelle fructifie — achetez-les par paire. Il tolère l'eau stagnante. Ses baies sont légèrement toxiques si un animal en mange.",
    givesNote:
      "Ses branches nues chargées de baies rouges éclairent le jardin d'hiver et nourrissent merles d'Amérique et jaseurs en fin d'hiver.",
    propagationNote:
      "Ce houx est soit mâle soit femelle : la graine ne se forme donc que sur une femelle ayant un mâle à proximité. La voie facile est la bouture : prélevez les pousses de l'année en fin d'été, à mesure qu'elles s'aoûtent. Le semis est une longue affaire — il lui faut du chaud puis du froid, et il ne lève d'ordinaire qu'au deuxième printemps.",
    supportNotes: {
      "cedar-waxwing":
        "Ses baies écarlates s'accrochent jusqu'au cœur de l'hiver, nourrissant jaseurs et merles d'Amérique quand il ne reste presque rien.",
      "berry-songbirds":
        "Un garde-manger qui tient tout l'hiver pour les merlebleus, les merles d'Amérique et les moqueurs.",
    },
  },
  "Cephalanthus occidentalis": {
    supportNotes: {
      "silver-spotted-skipper":
        "La fleur du céphalanthe est une pelote d'aiguilles de longs tubes blancs, et une hespérie peut y travailler une bonne minute sans bouger.",
      "red-admiral":
        "En juillet, un céphalanthe au bord d'un bassin porte plus de papillons à la fois que n'importe quoi d'autre dans un jardin humide.",
      "spicebush-swallowtail":
        "Les grands papillons à queues s'y nourrissent sans cesser de battre des ailes, faisant le tour de la sphère au fur et à mesure.",
      "bumble-bees":
        "Il fleurit dans le creux du milieu de l'été, quand le printemps est fini et que les verges d'or n'ont pas commencé.",
    },
    nativeNote:
      "Indigène des bords d'étang et des terrains humides de tout l'Est.",
    careNote:
      "La réponse à un emplacement qui reste humide ou même s'inonde. Pas pour un terrain sec.",
    givesNote:
      "Ses fleurs en pelotes d'épingles grouillent de papillons et d'abeilles ; les canards mangent ses graines. Une valeur sûre du jardin de pluie.",
    propagationNote:
      "Le céphalanthe se multiplie de bouture : rameaux nus et dormants en hiver, ou pousses de l'année en été, à mesure qu'elles s'aoûtent. La graine fraîche n'a besoin d'aucun traitement et lève volontiers sur un mélange humide.",
  },
  "Physocarpus opulifolius": {
    supportNotes: {
      "red-admiral":
        "Les petites ombelles bombées du physocarpe sortent en juin et sont travaillées en même temps par les papillons, les coléoptères et les petites abeilles.",
      "mason-bees":
        "Des fleurs ouvertes et peu profondes : une abeille solitaire à langue courte y accède aussi facilement qu'une à longue langue.",
    },
    nativeNote:
      "Indigène des berges et des pentes rocheuses de l'Est.",
    careNote:
      "Quasi indestructible — il prend le soleil ou la mi-ombre, l'humide ou le sec, et les sols pauvres. Idéal pour un talus difficile.",
    givesNote:
      "Une écorce qui s'exfolie pour l'intérêt hivernal, des fleurs blanches pour les abeilles, et des racines qui verrouillent une pente.",
    propagationNote:
      "Le physocarpe est facile de bouture. Faites raciner au début de l'été des extrémités de pousses vertes tendres dans un pot de mélange humide, ou enfoncez en fin d'automne des rameaux nus et dormants en terre. Les deux prennent volontiers et vous donnent des copies exactes du pied que vous avez.",
  },
  "Viburnum dentatum": {
    nativeNote:
      "Indigène des bois et des lisières de tout le Nord-Est.",
    careNote:
      "Une haie ou un écran adaptable et fiable. Plantez deux viornes dentées différentes pour une meilleure fructification.",
    givesNote:
      "Des corymbes blancs plats pour les pollinisateurs et des fruits bleu-noir qui alimentent la migration d'automne des oiseaux.",
    propagationNote:
      "La voie rapide est la bouture, au début de l'été, de pousses vertes tendres, enracinées sous brumisation ou sous abri. La graine est lente : il lui faut d'ordinaire une période chaude puis un hiver, et elle ne lève souvent qu'au deuxième printemps.",
    supportNotes: {
      "hummingbird-clearwing":
        "Les viornes sont une plante nourricière documentée du sphinx Hemaris thysbe.",
      "cedar-waxwing":
        "Ses fruits bleu-noir d'automne sont l'un des favoris des jaseurs et des grives.",
    },
    lookalikeNotes: {
      "lonicera-maackii": {
        why: "Deux arbustes de même hauteur à feuilles opposées et baies sombres, poussant côte à côte le long des mêmes lisières boisées.",
        tells: [
          { feature: "Cassez un rameau", native: "Une moelle blanche pleine à l'intérieur.", lookalike: "Creux — un tube brun bien net." },
          { feature: "Feuilles", native: "Grossièrement dentées sur tout le pourtour, avec des nervures droites courant vers chaque dent.", lookalike: "À bord lisse, effilées en une longue pointe étirée." },
          { feature: "Baies", native: "Bleu-noir, sur des pédoncules rouges.", lookalike: "Rouge translucide, par paires." },
          { feature: "Les saisons", native: "Il feuille avec le bois et perd ses feuilles avec lui.", lookalike: "Vert des semaines avant tout le reste au printemps et des semaines après à l'automne — le signe visible depuis une voiture." },
        ],
      },
    },
  },
  "Cornus sericea": {
    nativeNote: "Arbuste indigène des prés humides et des berges.",
    careNote:
      "Il s'étend par coulants souterrains en un fourré — excellent pour tenir un talus, mais donnez-lui de la place.",
    givesNote:
      "Des tiges d'hiver rouge éclatant, des baies pour les oiseaux, et l'une des meilleures plantes pour stabiliser un terrain humide en train de s'éroder.",
    propagationNote:
      "C'est l'un des arbustes les plus faciles à multiplier : des rameaux nus et dormants coupés en fin d'hiver s'enracinent même sans hormone, et des extrémités de pousses tendres s'enracinent au début de l'été. Vous pouvez aussi le marcotter — fixez une tige basse sur une terre humide et déterrez-la une fois enracinée.",
    supportNotes: {
      "cedar-waxwing":
        "Ses baies blanches d'automne sont avidement mangées par les jaseurs et les autres oiseaux frugivores.",
    },
  },
  "Ceanothus americanus": {
    supportNotes: {
      "bumble-bees":
        "Le céanothe d'Amérique fleurit dans la chaleur du début juillet, en écumes blanches que les abeilles repèrent de loin.",
      "mason-bees":
        "Son nectar est à découvert dans une minuscule coupe, et c'est pour cela qu'autant de petites abeilles et de guêpes solitaires peuvent s'en servir.",
    },
    nativeNote:
      "Indigène des prairies sèches, des clairières et des talus rocheux.",
    careNote:
      "Une racine pivotante profonde le rend extrêmement résistant à la sécheresse une fois installé, mais aussi difficile à déplacer — plantez-le là où il restera.",
    givesNote:
      "Il fixe son propre azote, prospère sur les sols secs les plus pauvres, et se couvre de pompons blancs couverts d'abeilles.",
    propagationNote:
      "La graine a un tégument dur : versez dessus de l'eau très chaude et laissez-la tremper une nuit pendant qu'elle refroidit, puis donnez-lui deux à trois mois de froid humide avant de semer. Les pousses vertes tendres s'enracinent aussi au début de l'été sous brumisation.",
  },
  "Corylus americana": {
    nativeNote:
      "Arbuste indigène formant fourré des lisières et des bois de l'Est.",
    careNote:
      "Il drageonne en fourré avec le temps — idéal pour une haie à faune, plus que pour un sujet net.",
    givesNote:
      "Des noix comestibles pour vous et la faune, des chatons précoces pour le premier pollen du printemps, et beaucoup de chenilles.",
    propagationNote:
      "Cueillez les noisettes quand le bord de l'involucre brunit, avant que les écureuils et les souris ne les prennent, et ne les laissez pas sécher. Il leur faut deux à six mois de froid humide : semez-les donc dehors à l'automne. Vous pouvez aussi déterrer une pousse enracinée du fourré qui s'étend et la replanter.",
    supportNotes: {
      "acorn-mammals":
        "Les noisettes sont recherchées par les écureuils, les tamias et les geais à l'automne.",
    },
  },

  // -------------------------------------------------------------------------
  // Mid-Atlantic — vivaces.
  // -------------------------------------------------------------------------
  "Asclepias tuberosa": {
    nativeNote:
      "Asclépiade indigène des prés secs de tout l'Est.",
    careNote:
      "Elle adore une terre pauvre, sèche et sableuse, et craint l'excès d'eau. Lente à apparaître au printemps — ne la déterrez pas en croyant qu'elle est morte. Sa sève est toxique si on l'avale.",
    givesNote:
      "Une plante nourricière des chenilles du monarque, visitée par de nombreux papillons, sur un pied net et peu envahissant.",
    propagationNote:
      "Le plus simple est la bouture de racine : à l'automne, coupez la racine pivotante profonde en morceaux de 5 cm et plantez-les debout dans une terre humide. Par semis, récoltez les graines brunes et plates à l'ouverture des gousses, avant que la soie ne les emporte, et donnez-leur un à deux mois de froid humide — un semis d'automne s'en charge.",
    supportNotes: {
      monarch:
        "Une asclépiade — l'une des seules plantes que les chenilles de monarque puissent manger, et un choix de ponte privilégié.",
      "bumble-bees":
        "Ses fleurs orange vif sont une grosse attraction à nectar pour les bourdons et bien d'autres pollinisateurs.",
    },
    lookalikeNotes: {
      "asclepias-curassavica": {
        why: "Deux asclépiades orange vendues côte à côte sur le même étal, toutes deux étiquetées pour les monarques — mais une seule des deux disparaît en hiver.",
        tells: [
          { feature: "Couleur de la fleur", native: "Un orange uni, parfois tirant sur le jaune.", lookalike: "Deux tons : des pétales extérieurs rouges autour d'une couronne jaune-orangé." },
          { feature: "Cassez une tige", native: "Une sève claire et aqueuse — la seule asclépiade qui ne saigne pas blanc.", lookalike: "Un latex blanc épais." },
          { feature: "Feuilles", native: "Étroites et velues, disposées alternativement le long d'une tige raide et velue.", lookalike: "Lisses et pointues, par paires opposées." },
          { feature: "En hiver", native: "Elle disparaît au ras du sol, et revient plus tard au printemps que presque tout — ne la déterrez pas.", lookalike: "Elle reste verte partout où l'hiver est doux, ce qui est précisément le problème." },
        ],
      },
      "buddleja-davidii": {
        why: "Un mot d'écart sur l'étiquette — « butterfly weed » et « butterfly bush » — et toutes deux vendues avec un papillon sur la fiche.",
        tells: [
          { feature: "Ce que c'est", native: "Une asclépiade : hauteur de genou, disparaissant au ras du sol chaque hiver.", lookalike: "Un grand arbuste arqué, hauteur de tête en une seule saison." },
          { feature: "Ce qu'elle nourrit", native: "Du nectar pour les adultes, et des feuilles que les chenilles de monarque peuvent vraiment manger.", lookalike: "Du nectar pour les adultes seulement — aucune chenille d'ici ne peut manger ses feuilles." },
          { feature: "Fleurs", native: "Des bouquets plats de petites étoiles orange.", lookalike: "De longs cônes de minuscules fleurs violettes, blanches ou roses." },
          { feature: "Où elle finit", native: "Dans sa touffe, là où vous l'avez plantée.", lookalike: "Dans les graviers de rivière — une plante nuisible classée en Oregon et dans l'État de Washington." },
        ],
      },
    },
  },
  "Asclepias incarnata": {
    nativeNote:
      "Asclépiade indigène des prés humides et des bords d'étang.",
    careNote:
      "Contrairement à la plupart des asclépiades, elle demande une humidité régulière — parfaite pour un jardin de pluie ou un point bas frais. Sa sève est toxique si on l'avale.",
    givesNote:
      "Une plante hôte du monarque qui attire aussi des nuées d'abeilles et de papillons à ses fleurs roses parfumées.",
    propagationNote:
      "Récoltez la graine dans les gousses ouvertes à l'automne et donnez-lui quelques semaines de froid humide (un semis d'automne s'en charge pour vous). Contrairement à sa cousine à racine pivotante, celle-ci accepte aussi la division — soulevez et séparez une touffe au printemps.",
    supportNotes: {
      monarch:
        "Une asclépiade des terrains frais, et une plante hôte et à nectar clé du monarque.",
      "bumble-bees":
        "Ses corymbes de fleurs roses parfumées sont riches en nectar pour les bourdons et les papillons.",
    },
    lookalikeNotes: {
      "asclepias-curassavica": {
        why: "Toutes deux sont des asclépiades vendues pour les monarques, et en pot à la pépinière elles se ressemblent beaucoup.",
        tells: [
          { feature: "Couleur de la fleur", native: "Rose tendre à mauve, en corymbes bombés.", lookalike: "Rouge et jaune, deux tons." },
          { feature: "Port", native: "Hauteur de poitrine et droite, debout dans un terrain humide.", lookalike: "Hauteur de hanche et lâche, à l'aise partout où il fait chaud." },
          { feature: "En hiver", native: "Elle disparaît au ras du sol aux premières gelées.", lookalike: "Elle reste verte partout où l'hiver est doux, et le parasite OE s'accumule sur les vieilles feuilles." },
          { feature: "Feuilles", native: "Longues et étroites, à nervure médiane pâle, par paires opposées.", lookalike: "Plus larges et plus minces, effilées aux deux bouts." },
        ],
      },
    },
  },
  "Echinacea purpurea": {
    nativeNote:
      "Indigène des prairies et des bois clairs ; largement indigène dans l'Est et le Midwest.",
    careNote:
      "Facile, de longue vie et résistante à la sécheresse. Laissez les capitules fanés sur pied tout l'hiver.",
    givesNote:
      "Des mois de floraison couverte de papillons, puis des capitules en graines qui nourrissent les chardonnerets jusqu'en hiver.",
    propagationNote:
      "Tordez les capitules secs et piquants à l'automne pour libérer la graine, qui germe mieux après deux mois de froid humide — le plus simple étant de semer dehors avant l'hiver. Les touffes se divisent aussi au printemps.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Une floraison d'astéracée dont le pollen nourrit les abeilles spécialistes qui ne peuvent en utiliser aucun autre.",
      "american-goldfinch":
        "Laissés sur pied, ses cônes fanés comptent parmi les garde-manger d'hiver préférés des chardonnerets.",
      "bumble-bees":
        "Une source de nectar d'été à longue floraison pour les bourdons et les papillons.",
    },
  },
  "Rudbeckia fulgida": {
    nativeNote:
      "Indigène des prés et des bois clairs de tout l'Est.",
    careNote:
      "Elle s'étend sans excès pour garnir un massif. À peu près aussi facile qu'une vivace indigène puisse l'être.",
    givesNote:
      "Un long spectacle doré de fin d'été pour les pollinisateurs et les fringilles, sur une plante qui se passe de tout soin.",
    propagationNote:
      "Secouez les petites graines des cônes secs à l'automne ; elles lèvent mieux après trois mois environ de froid humide : semez-les donc dehors à l'automne ou refroidissez-les au réfrigérateur avant le printemps. Les touffes se divisent facilement au printemps.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Une composée dont le pollen fait vivre les abeilles spécialistes des astéracées.",
      "american-goldfinch":
        "Les chardonnerets travaillent ses capitules sombres tout l'automne et l'hiver.",
    },
  },
  "Monarda fistulosa": {
    nativeNote:
      "Monarde indigène des prés secs et des bords de route.",
    careNote:
      "Elle s'étend à la racine pour former une colonie. Donnez-lui une bonne circulation d'air pour limiter l'oïdium sur les feuilles.",
    givesNote:
      "Des couronnes lavande animées d'abeilles, de papillons et de sphinx ; ses feuilles font une infusion parfumée.",
    propagationNote:
      "La plus facile de toutes est la division : cette monarde s'étend par des rhizomes, vous pouvez donc soulever une touffe au début du printemps et la séparer en morceaux enracinés. La graine lève volontiers sans froid — semez-la au printemps, ou dehors à l'automne.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses fleurs tubulaires lavande sont l'une des préférées des abeilles et des papillons ; les colibris y passent de temps en temps.",
      "hummingbird-clearwing":
        "Une fleur à nectar de premier ordre pour le sphinx Hemaris thysbe.",
      "bumble-bees":
        "Les bourdons à longue langue sont parmi ses visiteurs les plus assidus.",
    },
  },
  "Symphyotrichum novae-angliae": {
    nativeNote:
      "Aster indigène des prés frais de tout le Nord-Est.",
    careNote:
      "Pincez-le au début de l'été pour un pied plus touffu et moins avachi. Sans souci par ailleurs.",
    givesNote:
      "Une clé de voûte : il héberge plus de cent chenilles et ses fleurs pourpres tardives sont une dernière halte de ravitaillement essentielle pour les monarques en migration et les abeilles.",
    propagationNote:
      "La méthode la plus simple est de diviser une touffe installée au printemps, en détachant des tiges avec leurs racines. Récoltez la graine des têtes cotonneuses en fin d'automne ; un à trois mois de froid humide l'aident à lever, et un semis d'automne s'en charge.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Les asters font vivre tout un cortège d'abeilles spécialistes des asters ; celui-ci est l'un des meilleurs.",
      monarch:
        "Sa floraison pourpre tardive est un carburant d'automne essentiel pour les monarques qui descendent vers le sud.",
      "american-goldfinch":
        "Ses capitules en graines nourrissent les chardonnerets jusqu'en hiver.",
    },
  },
  "Solidago rugosa": {
    nativeNote:
      "Verge d'or indigène des prés de l'Est ; elle s'étend par ses racines en une plaque.",
    careNote:
      "La plante sauvage s'étend par ses racines en une plaque ; le cultivar 'Fireworks' est plus sage. Et non — la verge d'or ne provoque pas le rhume des foins (c'est l'ambroisie).",
    givesNote:
      "Une clé de voûte qui héberge plus de cent chenilles et couvre l'automne de pollen et de nectar au moment où les pollinisateurs en ont le plus besoin.",
    propagationNote:
      "Le plus facile est la division : en fin d'hiver, soulevez la touffe et séparez ses rosettes en morceaux enracinés — un pied adulte peut en donner des dizaines. La graine est souvent de faible qualité : semez-la serré, fraîche et en pleine terre.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Les verges d'or portent plus d'abeilles spécialistes du pollen que presque toute autre plante.",
      monarch:
        "Une source de nectar majeure en fin de saison pour les monarques en migration.",
    },
  },
  "Eutrochium purpureum": {
    nativeNote:
      "Indigène des prés frais et des bords de cours d'eau de l'Est.",
    careNote:
      "Haute et spectaculaire ; il lui faut un sol qui reste frais. Placez-la au fond d'un massif humide.",
    givesNote:
      "De gros dômes de fleurs mauves que les papillons couvrent en fin d'été, sur une plante d'une belle allure architecturale.",
    propagationNote:
      "Le plus facile est la division : soulevez la touffe quand elle entre en repos à l'automne ou quand les pousses apparaissent au printemps, et détachez des morceaux enracinés. La graine profite de trois mois de froid humide — un semis d'automne dehors s'en charge — mais la levée est d'ordinaire faible : semez serré.",
    supportNotes: {
      "hummingbird-clearwing":
        "Ses hautes inflorescences mauves sont un aimant pour les sphinx du genre Hemaris et les papillons.",
      "bumble-bees":
        "Ses gros corymbes bombés sont fortement travaillés par les bourdons.",
    },
    lookalikeNotes: {
      "lythrum-salicaria": {
        why: "Deux hautes fleurs mauve-pourpre des terrains frais, fleurissant au même moment au cœur de l'été.",
        tells: [
          { feature: "Inflorescence", native: "Un large nuage bombé de fleurs douces et duveteuses au sommet de la tige.", lookalike: "Un épi dressé et raide, bourré de fleurs magenta, chacune à six pétales froissés." },
          { feature: "Tige", native: "Ronde et creuse, en général tachée de pourpre ou pourpre aux nœuds.", lookalike: "À arêtes carrées et raide, devenant ligneuse à la base." },
          { feature: "Feuilles", native: "Par verticilles de trois à cinq autour de la tige, dentées.", lookalike: "Par paires opposées embrassant la tige, sans dents." },
          { feature: "Ce qui se passe ensuite", native: "Elle reste à peu près là où vous l'avez mise.", lookalike: "Un seul pied peut produire plus d'un million de graines ; un peuplement prend tout le marais." },
        ],
      },
    },
  },
  "Aquilegia canadensis": {
    nativeNote:
      "Indigène des bois rocheux et des corniches de tout l'Est.",
    careNote:
      "Heureuse à l'ombre sèche, où peu d'autres choses fleurissent. Chaque pied vit peu, mais elle se ressème pour rester.",
    givesNote:
      "Des lanternes penchées rouge et jaune qui arrivent juste au retour des colibris à gorge rubis au printemps.",
    propagationNote:
      "Récoltez les petites graines noires quand les capsules mûrissent au début de l'été. Répandez-les à la surface et tassez légèrement, tout de suite ou après trois à quatre semaines de froid humide. Les pieds adultes se divisent mal : le semis est la voie.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses éperons rouges penchés fleurissent au printemps exactement à l'arrivée des colibris à gorge rubis ; une fleur à colibris classique.",
    },
  },
  "Penstemon digitalis": {
    nativeNote:
      "Indigène des prés et des bois clairs de tout l'Est.",
    careNote:
      "Adaptable à presque tous les sols, humides ou secs. Ses rosettes persistantes tiennent le sol tout l'hiver.",
    givesNote:
      "Des fleurs blanches en clochettes pour les abeilles de printemps, puis des tiges de graines rouillées pour la structure hivernale. Très peu d'entretien.",
    propagationNote:
      "La division est le plus facile : soulevez et séparez les souches à l'automne ou au début du printemps. La graine mûrit à l'automne et germe mieux après un passage au froid humide et à la lumière — semez-la en surface, dehors, avant l'hiver.",
    supportNotes: {
      "bumble-bees":
        "Ses fleurs blanches tubulaires sont une forte source de nectar et de pollen de fin de printemps pour les bourdons.",
      "mason-bees":
        "Sa floraison recouvre la saison où les osmies et les andrènes solitaires approvisionnent leurs nids.",
    },
  },
  "Zizia aurea": {
    nativeNote:
      "Indigène des prés frais et des bois clairs de l'Est.",
    careNote:
      "Une floraison précoce accommodante, de la mi-ombre au soleil. Elle se ressème doucement.",
    givesNote:
      "Ses fleurs jaunes précoces nourrissent les petites abeilles indigènes, et c'est une plante hôte des chenilles du Papilio polyxenes.",
    propagationNote:
      "Récoltez la graine au début de l'été, à mesure que les fruits plats sèchent, et semez-la dehors à l'automne : il lui faut un hiver froid et humide, et elle lève mieux en sol frais. Les touffes peuvent aussi se diviser.",
    supportNotes: {
      "eastern-black-swallowtail":
        "Une apiacée indigène et une véritable plante nourricière des chenilles du Papilio polyxenes — pas seulement une halte à nectar.",
      "bumble-bees":
        "Ses ombelles jaunes plates et précoces sont une source de nectar accessible aux abeilles qui émergent au printemps.",
    },
  },
  "Baptisia australis": {
    nativeNote:
      "Indigène des berges et des bois clairs ; largement indigène dans l'Est.",
    careNote:
      "Lente les deux premières années, puis une racine pivotante profonde en fait pendant des décennies un point d'ancrage de la taille d'un arbuste, résistant à la sécheresse. Plantez-la là où elle restera.",
    givesNote:
      "Des épis de fleurs bleues en pois pour les bourdons, elle fixe son propre azote, et elle héberge l'hespérie Erynnis baptisiae, des coliades et le Callophrys irus.",
    propagationNote:
      "Entaillez d'abord chaque graine dure et ronde à la lime ou au papier de verre ; aucun froid n'est nécessaire. Semez à un centimètre de profondeur, dehors, à l'automne ou au printemps — les semis lèvent vite mais mettent jusqu'à trois ans à fleurir. La souche coriace peut aussi se diviser pendant le repos.",
    supportNotes: {
      "bumble-bees":
        "Ses grandes fleurs bleues en pois sont travaillées surtout par les bourdons assez forts pour en déclencher le ressort ; elle héberge aussi les chenilles de plusieurs coliades et hespéries.",
    },
  },
  "Lobelia cardinalis": {
    nativeNote:
      "Indigène des berges et des terrains humides de tout l'Est.",
    careNote:
      "Il lui faut une humidité constante — elle s'effondrera dans un emplacement sec. De courte vie mais elle se ressème en terrain frais.",
    givesNote:
      "Des épis rouges éclatants où viennent se nourrir les colibris ; un bon choix pour un coin humide et mi-ombragé.",
    propagationNote:
      "La graine est presque fine comme de la poussière : pressez-la à la surface d'un terreau humide sans la couvrir. Semez-la fraîche au chaud, ou passez-la d'abord un à trois mois au froid humide : les pépiniéristes font l'un ou l'autre.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses tubes rouges éclatants sont faits pour le bec d'un colibri et sont l'une de ses plantes à nectar indigènes les plus importantes.",
    },
  },
  "Geranium maculatum": {
    supportNotes: {
      "mason-bees":
        "Une andrène, Andrena distans, récolte le pollen du géranium sauvage et presque rien d'autre — elle vole les quelques semaines où il est en fleur, puis disparaît pour l'année.",
      "bumble-bees":
        "Une fleur précoce de lisière de bois, sortie quand les arbres sont encore nus et que la lumière atteint encore le sol.",
    },
    nativeNote:
      "Fleur sauvage de sous-bois indigène de tout l'Est.",
    careNote:
      "Un bouche-trou fiable pour l'ombre sous les arbres. Il forme lentement un coussin souple.",
    givesNote:
      "Des fleurs roses printanières pour les premières abeilles indigènes, suivies d'un couvre-sol net de feuilles en forme de feuille d'érable.",
    propagationNote:
      "Le plus facile est de diviser les rhizomes à l'automne ou au début du printemps — ils se ramifient souvent à angle droit, ce qui rend la séparation simple. La graine n'a besoin d'aucun traitement : récoltez les capsules quand elles foncent, laissez-les s'ouvrir dans un sac en papier, et semez dehors en fin d'automne ou au printemps.",
  },

  // -------------------------------------------------------------------------
  // Mid-Atlantic — graminées, grimpantes, couvre-sols et fougères.
  // -------------------------------------------------------------------------
  "Schizachyrium scoparium": {
    supportNotes: {
      "grass-skippers":
        "C'est sur le barbon à balais que grandissent les satyres et plusieurs hespéries, et les chenilles passent l'hiver au fond de la touffe. La raser à l'automne, c'est raser les papillons de l'été suivant.",
    },
    nativeNote:
      "Graminée indigène en touffe des prairies sèches et des landes rocailleuses de tout l'Est.",
    careNote:
      "Elle prospère sur un sol chaud, sec et pauvre où rien d'autre ne pousse. Ses racines plongent à plus d'un mètre cinquante.",
    givesNote:
      "Des feuilles vert-bleu en été qui passent à l'orange acajou en automne ; elle héberge des hespéries, abrite les oiseaux et verrouille les pentes sèches.",
    propagationNote:
      "Semez la graine cotonneuse dehors, de la fin de l'automne au début du printemps. En pot, quelques semaines de froid humide l'aident d'abord à lever. Les touffes installées se déterrent aussi et se séparent au printemps.",
    lookalikeNotes: {
      "miscanthus-sinensis": {
        why: "Deux graminées ornementales en touffe vendues pour le même massif, et toutes deux fauves et plumeuses à l'automne.",
        tells: [
          { feature: "Taille", native: "Hauteur de genou à de hanche, en une touffe de la taille d'une assiette.", lookalike: "Hauteur de tête, en une touffe qu'il faudrait deux bras pour entourer." },
          { feature: "La feuille", native: "Vert-bleu et unie, passant à l'orange cuivré à l'automne.", lookalike: "Verte avec une rayure blanc argenté au milieu de chaque feuille." },
          { feature: "Épis", native: "De petites houppes blanches dispersées le long des tiges, éclairées à contre-jour par un soleil bas.", lookalike: "Un grand plumet argenté en éventail porté au-dessus de la touffe." },
          { feature: "En hiver", native: "Elle reste rouge cuivré jusqu'au printemps, pleine de petits oiseaux.", lookalike: "Elle passe au paille, et sa graine s'envole dans les prés et les bords de route." },
        ],
      },
    },
  },
  "Panicum virgatum": {
    supportNotes: {
      "grass-skippers":
        "Le panic érigé élève l'hespérie du Delaware — un petit papillon orange dont la chenille vit dans un tube de limbe cousu de soie.",
    },
    nativeNote:
      "Graminée de prairie indigène de l'est et du centre des États-Unis.",
    careNote:
      "Elle prend à peu près tous les sols, du sec à l'humide. Ses racines profondes en font un choix de premier ordre pour un jardin de pluie ou une pente qui s'érode.",
    givesNote:
      "Un écran dressé de panicules aériennes que les oiseaux assaillent en hiver, avec des racines qui absorbent le ruissellement et tiennent le sol.",
    propagationNote:
      "Semez la graine sans traitement dehors à l'automne, ou gardez-la au froid humide deux semaines à un mois avant un semis de printemps, à un demi-centimètre de profondeur. Une touffe mûre se déterre aussi et se sépare en éclats enracinés au printemps.",
    lookalikeNotes: {
      "miscanthus-sinensis": {
        why: "Deux grandes graminées en touffe vendues sur le même étal pour le même office — la hauteur, le mouvement et la structure hivernale.",
        tells: [
          { feature: "La feuille", native: "Vert uni ou vert-bleu, sans rayure.", lookalike: "Une rayure blanc argenté au milieu de chaque feuille." },
          { feature: "Panicule", native: "Un nuage aérien rose-fauve à travers lequel on voit le ciel.", lookalike: "Un plumet argenté dense en éventail." },
          { feature: "La touffe", native: "Dressée et lâche, s'ouvrant au centre en vieillissant.", lookalike: "Serrée et lourde, restant fermée." },
          { feature: "Où va la graine", native: "Dans les bruants et les juncos, tout l'hiver.", lookalike: "Dans les prés, les bords de route et les terrains brûlés, où elle lève." },
        ],
      },
    },
  },
  "Andropogon gerardii": {
    supportNotes: {
      "grass-skippers":
        "Le grand barbon est la graminée nourricière de l'hespérie byssus — un papillon qui a suivi la prairie haute dans ce qu'il en reste.",
    },
    nativeNote:
      "La graminée emblématique de la prairie à hautes herbes, indigène jusqu'à l'Atlantique.",
    careNote:
      "Grande et affirmée, avec des racines atteignant plus de deux mètres cinquante. Au mieux là où une haute graminée a la place de faire de l'effet.",
    givesNote:
      "Des épis en patte de dindon et une couleur d'automne cuivrée ; des racines de premier ordre pour structurer le sol, stocker le carbone et arrêter l'érosion.",
    propagationNote:
      "Semez la graine dehors en fin d'hiver ou au début du printemps ; en pot, deux à quatre semaines de froid humide la mettent en route. Les grosses touffes se divisent aussi bien au printemps — déterrez-en une et séparez-la en morceaux enracinés.",
  },
  "Carex pensylvanica": {
    nativeNote:
      "Laîche indigène des bois secs ; une alternative indigène au gazon.",
    careNote:
      "Elle s'étend lentement en un tapis souple sans tonte, pour l'ombre sèche sous les arbres où le gazon ne pousse pas.",
    givesNote:
      "Un couvre-sol vert à texture fine qui héberge de nombreuses petites hespéries et ne demande ni tonte, ni arrosage, ni engrais.",
    propagationNote:
      "De loin le plus facile est la division : au printemps, soulevez une touffe adulte et séparez-la en petits morceaux ayant chacun des racines et des feuilles.",
  },
  "Parthenocissus quinquefolia": {
    supportNotes: {
      "cedar-waxwing":
        "Les baies bleu-noir de la vigne vierge restent accrochées à leurs pédoncules écarlates longtemps après la chute des feuilles, et une bande de jaseurs nettoie tout un mur en une après-midi.",
      "berry-songbirds":
        "Grives, moqueurs chats et pics les prennent aussi, tout l'automne et jusque dans l'hiver.",
    },
    nativeNote:
      "Liane grimpante indigène de tout l'est des États-Unis.",
    careNote:
      "Vigoureuse — excellente pour couvrir une clôture ou un talus, mais tenez-la à l'écart d'un bardage en bois et donnez-lui de la place. Ses baies sont toxiques pour les personnes et les animaux domestiques.",
    givesNote:
      "Une couleur d'automne écarlate, des baies très riches en graisses dont des dizaines d'oiseaux dépendent, et un rôle de plante nourricière pour de superbes sphinx.",
    propagationNote:
      "Les boutures s'enracinent volontiers : prélevez des longueurs de liane en été, ou des morceaux nus et dormants en hiver, et gardez-les humides. Le marcottage marche aussi — fixez une tige rampante au sol à l'automne et détachez-la une fois enracinée.",
    lookalikeNotes: {
      "hedera-helix": {
        why: "Toutes deux grimpent aux troncs et aux murs, et toutes deux se font appeler « le lierre de la maison ».",
        tells: [
          { feature: "Feuille", native: "Cinq folioles étalées en éventail depuis un même point, comme des doigts.", lookalike: "Une seule feuille sombre et luisante, lobée quand elle est jeune, simplement ovale sur les vieilles pousses fleuries." },
          { feature: "En hiver", native: "Nue — elle perd tout.", lookalike: "Persistante ; un tronc d'arbre vert en février, c'est du lierre." },
          { feature: "Comment elle tient", native: "Des coussinets collants au bout de vrilles enroulées — elle se pose sur l'écorce.", lookalike: "De courtes racines qui agrippent tout le long de la tige, s'insinuant dans l'écorce et le mortier." },
          { feature: "Automne", native: "Elle passe à l'écarlate avant presque tout, avec des baies bleu foncé sur des pédoncules rouge vif.", lookalike: "Aucune couleur d'automne ; des baies noires, et seulement en haut, sur les vieilles pousses." },
        ],
      },
    },
  },
  "Lonicera sempervirens": {
    nativeNote:
      "Chèvrefeuille grimpant indigène de l'Est — pas l'espèce envahissante.",
    careNote:
      "Une grimpante sage pour un treillage ou une boîte aux lettres — rien à voir avec le chèvrefeuille du Japon envahissant. Donnez-lui quelque chose où s'enrouler.",
    givesNote:
      "Ses trompettes corail fleurissent des mois durant en nourrissant les colibris ; ses baies rouges nourrissent ensuite les passereaux.",
    propagationNote:
      "Ce chèvrefeuille s'enracine facilement de bouture — prélevez des pousses de l'année de l'été à l'automne, ou des longueurs nues en hiver. Le marcottage d'une tige rampante marche aussi.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses fleurs tubulaires corail, sur une longue saison, en font l'une des meilleures lianes à colibris qui soient.",
    },
    lookalikeNotes: {
      "lonicera-japonica": {
        why: "Tous deux sont des chèvrefeuilles volubiles, et le japonais est sur tant de clôtures que les gens le prennent pour l'indigène sauvage.",
        tells: [
          { feature: "Fleurs", native: "De longues trompettes rouge corail à gorge orange, groupées à l'extrémité de la pousse, presque sans parfum.", lookalike: "Des fleurs par paires tout le long de la tige, blanches virant au jaune beurre, puissamment sucrées." },
          { feature: "Paire de feuilles du haut", native: "Soudées en un seul disque que la tige traverse de part en part.", lookalike: "Chaque feuille séparée, jusqu'en haut." },
          { feature: "Baies", native: "Rouge vif, en bouquet à l'extrémité de la pousse.", lookalike: "Noires et brillantes, par paires." },
          { feature: "En hiver", native: "Nu, ou presque.", lookalike: "Encore vert — une liane verte dans un bois sans feuilles en janvier, c'est presque toujours lui." },
        ],
      },
    },
  },
  "Fragaria virginiana": {
    supportNotes: {
      "berry-songbirds":
        "Les fraises sauvages sont minuscules et intensément sucrées, et merles d'Amérique et grives arrivent à presque toutes avant qui que ce soit d'autre.",
      "bumble-bees":
        "De petites fleurs blanches à cinq pétales, au ras du sol dès avril, parmi les premières qu'une reine de bourdon puisse atteindre.",
    },
    nativeNote:
      "Fraisier couvre-sol indigène de tout l'Est.",
    careNote:
      "Il court par stolons pour tisser vite un tapis vivant — parfait en alternative au gazon ou en bordure d'allée.",
    givesNote:
      "Des fleurs blanches printanières pour les abeilles, de minuscules fraises sucrées pour les oiseaux et les gens, et un couvre-sol bas qui héberge de nombreuses chenilles.",
    propagationNote:
      "La plante la plus simple à multiplier d'ici : elle émet des stolons qui font de petits plants sur leur longueur. Fixez-en un sur la terre (ou dans un petit pot) jusqu'à ce qu'il s'enracine, puis détachez-le du pied mère et déplacez-le. Vous pouvez aussi simplement soulever et séparer une plaque installée.",
  },
  "Packera aurea": {
    supportNotes: {
      "sunflower-specialist-bees":
        "Le séneçon doré est une fleur de la famille des astéracées en avril, des mois avant les asters et les verges d'or — ce qui en fait l'une des rares ressources précoces pour les abeilles qui ne savent utiliser que le pollen de cette famille.",
      "mason-bees":
        "Petites andrènes et osmies travaillent les capitules jaunes plats pendant qu'elles approvisionnent leurs nids de printemps.",
    },
    nativeNote:
      "Couvre-sol semi-persistant indigène des bois frais et des suintements.",
    careNote:
      "Il s'étend vite pour couvrir une ombre humide — servez-vous-en pour garnir un terrain humide et ombragé difficile, et éclaircissez-le là où il dépasse.",
    givesNote:
      "De gaies fleurs jaunes printanières portées au-dessus d'un tapis persistant qui étouffe les adventices à l'ombre.",
    propagationNote:
      "Le plus facile est la division — ce couvre-sol s'étend en tapis : soulevez au printemps une portion et séparez-la en morceaux enracinés à replanter. Par semis, donnez-lui environ six semaines de froid humide, puis de la chaleur.",
    lookalikeNotes: {
      "ficaria-verna": {
        why: "Tous deux tapissent un terrain frais de fleurs jaunes en avril, et tous deux s'étendent latéralement en une seule plaque compacte.",
        tells: [
          { feature: "La fleur", native: "Une marguerite : une couronne d'une douzaine de rayons jaunes autour d'un bouton jaune, plusieurs par tige, portée bien haut.", lookalike: "Une renoncule : 8 à 12 pétales étroits et brillants, posés bas sur les feuilles." },
          { feature: "Feuilles", native: "Arrondies et festonnées, souvent pourpres au revers, en rosette plate qui reste verte tout l'hiver.", lookalike: "En cœur et charnues sur un long pétiole, en tapis qui disparaît complètement avant juin." },
          { feature: "À la base", native: "Rien de particulier.", lookalike: "Des bulbilles pâles à l'aisselle des feuilles et des tubercules noueux en dessous — sa façon de voyager sur les bottes et dans les crues." },
          { feature: "Après la floraison", native: "Il garde ses feuilles et tient le sol toute l'année.", lookalike: "Disparu au milieu de l'été, laissant une terre nue que la pluie emporte." },
        ],
      },
    },
  },
  "Polystichum acrostichoides": {
    nativeNote:
      "Fougère persistante indigène des pentes boisées de l'Est.",
    careNote:
      "Persistante et peu exigeante à l'ombre sèche à moyenne. L'une des indigènes les plus faciles pour un coin ombragé en pente.",
    givesNote:
      "Elle reste verte tout l'hiver, ses frondes retenant les feuilles mortes et ralentissant l'érosion sur un talus boisé ; un abri pour la petite faune.",
    propagationNote:
      "De loin le plus facile est de déterrer une touffe installée et de fendre la souche en morceaux enracinés. Les fougères ne font pas de graines — elles poussent à partir de spores fines comme de la poussière au revers des frondes, qu'on peut semer sur un terreau stérile humide, mais cela prend deux ans environ.",
  },
};
