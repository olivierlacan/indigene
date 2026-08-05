// Continental France — the centre and east, referenced on Dijon, Nancy and
// Strasbourg: colder winters and hotter summers than the Atlantic coast, and a
// limestone flora the oceanic west doesn't have.
//
// Five taxa on this list are also on the Atlantic one and are written there
// under their plain key. Four of those five say something genuinely different
// here — hornbeam is a hedge in the west and the chêne-charme forest of Lorraine
// in the east — so they appear again at the bottom under a region-qualified key
// (`"Latin@france-continental"`). See `./index.ts`.
import type { ProseTable } from "../../lib/prose";

export const FRANCE_CONTINENTAL: ProseTable = {
  // -------------------------------------------------------------------------
  // France continentale — arbres.
  // -------------------------------------------------------------------------
  "Quercus petraea": {
    nativeNote:
      "Le chêne dominant des forêts de l'est de la France — les grandes chênaies de Tronçais, le piémont vosgien et la Bourgogne, c'est largement cet arbre.",
    careNote:
      "Lent, puis là pour des siècles — un chêne planté maintenant est pour un arrière-petit-enfant. Il préfère une pente un peu plus sèche et mieux drainée que le chêne pédonculé de l'ouest atlantique, et accepte volontiers un sol acide. Sa racine pivotante profonde le met à l'épreuve de la sécheresse mais le rend difficile à déplacer : plantez-en un petit et laissez-lui de la place.",
    givesNote:
      "L'arbre le plus précieux de l'est de la France, sans concurrent : plus de quatre cents espèces de chenilles, c'est-à-dire de quoi remplir chaque printemps un nid de mésanges et de sittelles. Puis des glands pour les geais, les pigeons ramiers, les pics, les écureuils et les sangliers, et l'ombre profonde et le bois mort où vivent les coléoptères et les chauves-souris de toute une forêt.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chêne germent dès l'automne, sans passage au froid, et ne doivent jamais sécher. À cause de la racine pivotante, démarrez-le en pot haut, ou semez-le là où il vivra.",
  },
  "Acer campestre": {
    nativeNote:
      "L'érable des haies de l'est et du centre de la France, sur les terres agricoles calcaires et les lisières.",
    careNote:
      "Le peu exigeant : craie, argile, sécheresse, vent, ombre et taille lui conviennent tous. Il reste de taille modérée, ce qui en fait l'érable d'un jardin normal, et il entre dans une haie mixte aussi volontiers que le charme.",
    givesNote:
      "Ses fleurs verdâtres précoces sont une vraie source de nectar en avril, avant que la plupart des arbres s'en soucient, et un bon compte de chenilles suit sur les feuilles. Il passe au jaune beurre pur à l'automne, et ses samares ailées nourrissent les fringilles.",
    propagationNote:
      "Récoltez les samares appariées à l'automne, quand elles brunissent, et donnez-leur environ trois mois dans du sable humide au réfrigérateur — ou semez-les dehors en pot et laissez l'hiver leur donner le froid.",
    lookalikeNotes: {
      "acer-negundo": {
        why: "Deux érables des haies et des berges — mais un seul des deux a une feuille en forme de feuille d'érable.",
        tells: [
          { feature: "Feuille", native: "Une seule feuille à cinq lobes arrondis et émoussés ; cassez le pétiole, il pleure un lait blanc.", lookalike: "Une feuille divisée en trois à cinq folioles séparées, grossièrement dentées, celle du bout souvent à trois pointes." },
          { feature: "Rameaux", native: "Souvent garnis de crêtes liégeuses sur les pousses plus âgées.", lookalike: "Lisses, verts à violets, sous une pruine cireuse qu'on efface au pouce." },
          { feature: "Graines", native: "Samares appariées écartées presque en ligne droite.", lookalike: "Samares appariées en V étroit, pendues en longues grappes." },
          { feature: "Où il pousse", native: "Dans les haies et les lisières, surtout sur terrain calcaire.", lookalike: "En fourrés jeunes et denses sur les graviers de rivière et les talus remaniés." },
        ],
      },
    },
  },
  "Sorbus torminalis": {
    nativeNote:
      "Un arbre dispersé dans les vieilles chênaies-charmaies sur calcaire du centre et de l'est de la France — un indicateur de forêt ancienne.",
    careNote:
      "Lent, peu commun, et qui vaut l'attente : un bel arbre à feuilles d'érable qui encaisse la sécheresse et le calcaire une fois installé, et devient cramoisi profond à l'automne. Il drageonne doucement, ce qui est sa façon habituelle de s'étendre à l'état sauvage. Donnez-lui une lisière ensoleillée plutôt que l'ombre profonde.",
    givesNote:
      "Un solide arbre à chenilles, avec de lourds corymbes blancs pour les abeilles en mai puis des fruits bruns mouchetés — les alises, dont on faisait autrefois une boisson à la campagne — que grives, merles et draines prélèvent en quantité tout l'automne.",
    propagationNote:
      "Débarrassez les fruits de leur pulpe et semez aussitôt en pot dehors — il lui faut en général une période chaude puis une longue période froide, si bien qu'une bonne part attendra le second printemps. Bien plus facile : soulevez l'un des drageons enracinés qu'un arbre mûr envoie.",
  },
  "Pinus sylvestris": {
    nativeNote:
      "Indigène sur les calcaires secs et les terrains sableux de l'est de la France — le Jura, le piémont vosgien et les côtes bourguignonnes.",
    careNote:
      "Il veut le plein soleil et ne poussera pas à l'ombre, mais au-delà de cela il est indifférent — sable, craie, sécheresse, froid, vent. Rapide ses premières décennies, puis il s'installe dans la silhouette à cime plate et écorce orangée qui fait qu'un vieux pin valait la peine d'être planté.",
    givesNote:
      "La graine de pin est l'aliment d'hiver de base des becs-croisés, des tarins, des mésanges noires et des sittelles, et le houppier ouvert d'un pin mûr est là où nichent buses, milans et hiboux. Une liste de chenilles honorable, et l'écorce orange qui s'exfolie est un terrain de chasse pour les grimpereaux.",
    propagationNote:
      "Récoltez des cônes fermés en hiver et gardez-les dans un endroit chaud et sec jusqu'à ce qu'ils s'ouvrent, puis secouez-en la graine ailée. Elle germe librement au printemps sans aucun froid — semez en pots profonds et gardez-les en pleine lumière.",
    supportNotes: {
      "conifer-seed-finches":
        "La graine de pin est l'aliment d'hiver de base des becs-croisés et des tarins — le bec du bec-croisé est un outil construit pour exactement ce cône.",
    },
  },

  // -------------------------------------------------------------------------
  // France continentale — arbustes.
  // -------------------------------------------------------------------------
  "Crataegus laevigata": {
    nativeNote:
      "L'aubépine des bois de l'est de la France — plus à son aise à l'ombre des vieilles forêts et des haies que sa cousine des champs ouverts.",
    careNote:
      "Aussi robuste et indulgente que le sont les aubépines — argile, calcaire, ombre, vent, taille sévère. Les épines sont tout l'intérêt : c'est ce qui fait d'une haie d'aubépine une forteresse pour les oiseaux nicheurs. Taillez-la en fin d'hiver, jamais pendant les mois de nidification.",
    givesNote:
      "Après le chêne, et de très loin, l'arbuste à chenilles le plus productif de la région. Sa lourde floraison de mai nourrit une foule énorme d'abeilles, de syrphes et de coléoptères, et ses cenelles rouges tiennent jusqu'en hiver pour les grives litornes, mauvis, draines et merles. Et puis il y a la haie elle-même, assez épineuse pour qu'un chat ne puisse pas suivre un oiseau nicheur à l'intérieur.",
    propagationNote:
      "La graine d'aubépine est lente exprès : débarrassez les cenelles de leur chair et semez-les dehors aussitôt, en vous attendant à voir lever l'essentiel au second printemps plutôt qu'au premier. Les boutures ligneuses prises en hiver sont le raccourci.",
    supportNotes: {
      "winter-thrushes":
        "Les cenelles rouges tiennent jusque dans les grands froids pour les grives litornes, mauvis et les merles.",
      "bumble-bees":
        "Sa lourde floraison de mai nourrit d'un coup bourdons, abeilles solitaires, syrphes et coléoptères.",
    },
  },
  "Prunus mahaleb": {
    nativeNote:
      "Un petit cerisier sauvage au parfum sucré des pentes calcaires sèches et des broussailles de Bourgogne, du piémont jurassien et de la vallée du Rhône.",
    careNote:
      "Peut-être le feuillu le plus à l'épreuve de la sécheresse de cette liste — il pousse dans le caillasse calcaire nue et ne demande jamais d'eau. Il drageonne et se ressème librement : donnez-lui un talus ou une haie plutôt qu'un massif. Feuilles et noyaux contiennent des composés cyanurés ; c'est une plante à tenir hors d'un pré à chevaux.",
    givesNote:
      "Les cerisiers sont le deuxième grand genre à chenilles après les chênes, et celui-ci est celui qui poussera sur un calcaire sec. Sa floraison blanche parfumée nourrit les abeilles en avril, et les petits fruits noirs amers sont prélevés par les fauvettes à tête noire, les grives, les merles et les fauvettes qui s'engraissent pour la migration.",
    propagationNote:
      "Débarrassez les noyaux mûrs de leur chair en fin d'été et donnez-leur environ trois mois de froid humide avant de semer au printemps. Plus facile encore : soulevez en fin d'hiver l'un des drageons enracinés qu'il pousse autour de lui.",
    supportNotes: {
      "blackcaps-warblers":
        "De petites cerises noires amères en fin d'été, prélevées par les fauvettes à tête noire et les autres fauvettes qui s'engraissent pour le voyage vers le sud.",
    },
  },
  "Cornus mas": {
    nativeNote:
      "Un arbuste des lisières et des haies sur calcaire chaud de l'est et du sud-est de la France.",
    careNote:
      "Lent mais définitivement facile : calcaire, sécheresse, ombre, taille. Il fait une excellente haie libre et ne demande aucune taille du tout si vous avez la place. Plantez-en deux si vous voulez une vraie récolte de fruits.",
    givesNote:
      "Il fleurit en février, sur le bois nu — une brume de petits bouquets jaunes au moment où sortent les premières reines de bourdons et où il n'y a rien d'autre pour elles. Puis des cornouilles rouges luisantes en fin d'été pour les merles, les grives et les fauvettes à tête noire (et pour la confiture, si vous arrivez le premier).",
    propagationNote:
      "Débarrassez les fruits mûrs de leur pulpe et semez aussitôt dehors — les noyaux sont durs et la plupart ne lèveront qu'au second printemps. Le marcottage d'une branche basse est plus rapide et certain.",
  },
  "Viburnum lantana": {
    nativeNote:
      "Un arbuste des haies, des broussailles et des lisières sur calcaire sec, dans tout l'est et le centre de la France.",
    careNote:
      "Construite pour le calcaire sec : des feuilles grises, molles et feutrées qui limitent la perte d'eau, et une indifférence complète à la sécheresse une fois installée. Facile en haie mixte, sans aucune taille nécessaire, et elle accepte pas mal d'ombre. Ses baies rendent les gens malades si on les mange : celle-là est pour les oiseaux seulement.",
    givesNote:
      "Ses corymbes crème plats nourrissent abeilles, syrphes et coléoptères en mai, puis le fruit fait quelque chose d'inhabituel et d'utile : il mûrit irrégulièrement, si bien qu'un seul bouquet porte à la fois des baies vertes, rouges et noires et continue de nourrir fauvettes, grives et fauvettes à tête noire plusieurs semaines de suite au lieu d'une.",
    propagationNote:
      "La graine de viorne est réputée pour ses deux temps — elle fait une racine la première année et une pousse seulement après le second hiver — semez-la donc fraîche dehors et laissez-la tranquille deux ans. Les boutures d'été en voie d'aoûtement sont bien plus rapides.",
  },
  "Ligustrum vulgare": {
    nativeNote:
      "Le troène indigène des haies, des broussailles et des lisières sur calcaire de tout l'est et le centre de la France.",
    careNote:
      "L'indigène à planter au lieu du troène du Japon ou du laurier-cerise des haies de lotissement — même métier, même tolérance à l'ombre, à la sécheresse, au calcaire et à la taille, mais celui-là est d'ici. Laissez-le fleurir plutôt que de le tondre à plat deux fois par an, sinon vous perdez tout ce pour quoi il est bon. Les baies noires sont toxiques pour les personnes et les animaux domestiques.",
    givesNote:
      "La plante nourricière du sphinx du troène, le plus grand papillon de nuit de France — un insecte grand comme une paume, rayé de rose et de noir, dont l'énorme chenille verte grandit sur ces feuilles. Ses lourds corymbes parfumés de juin nourrissent abeilles, papillons de nuit et papillons de jour, et ses baies noires font passer l'hiver aux grives et aux fauvettes à tête noire.",
    propagationNote:
      "Des boutures nues prises en hiver et enfoncées dans une terre humide s'enracinent presque à coup sûr — c'est l'un des ligneux les plus faciles qui soient. Par semis, débarrassez la graine de sa pulpe et donnez-lui trois mois de froid humide.",
    supportNotes: {
      "privet-hawk-moth":
        "Le troène sauvage est la plante nourricière classique du plus grand papillon de nuit de France — l'énorme chenille verte, rayée de lilas, grandit sur ces feuilles.",
      "winter-thrushes":
        "Les baies noires font passer l'hiver aux grives et aux fauvettes à tête noire.",
    },
  },
  "Euonymus europaeus": {
    nativeNote:
      "Un arbuste de haie et de lisière du pays calcaire, dans tout l'est et le centre de la France.",
    careNote:
      "Facile dans toute terre correcte, calcaire ou argileuse, au soleil ou à mi-ombre, et il ne demande aucune taille. À savoir avant de le planter : toutes ses parties sont toxiques si on les avale — le fruit vif en particulier, et il est assez vif pour tenter un enfant — c'est donc un arbuste pour le fond d'une haie plutôt que le bord d'une aire de jeux.",
    givesNote:
      "Son spectacle d'automne n'a pas d'égal chez les arbustes indigènes : des capsules rose choquant qui s'ouvrent pour laisser pendre des graines orange au bout d'un fil, prélevées par les rougegorges et les fauvettes à tête noire, au-dessus de feuilles devenues écarlates. Il porte aussi une grosse population de pucerons en début d'été, ce qui sonne comme un problème et est en réalité ce qui nourrit les mésanges bleues, les coccinelles et les larves de syrphes.",
    propagationNote:
      "Débarrassez la graine de sa chair orange — mettez des gants — et semez aussitôt dehors ; attendez-vous à ce qu'une bonne part attende le second printemps. Les boutures d'été en voie d'aoûtement s'enracinent volontiers et sont bien plus rapides.",
  },
  "Rosa canina": {
    nativeNote:
      "Le rosier sauvage des haies, des talus et des broussailles, partout dans l'est et le centre de la France.",
    careNote:
      "Il poussera n'importe où et s'arque loin, s'accrochant à tout ce qui se trouve à côté — une haie ou un talus, pas un massif. Rabattez-le sévèrement en fin d'hiver s'il prend le dessus. Pas de traitement, pas d'engrais, pas de souci de maladie des taches noires : c'est le rosier à partir duquel tous les capricieux ont été obtenus.",
    givesNote:
      "Des fleurs simples ouvertes, c'est-à-dire qu'une abeille peut réellement atteindre le pollen — contrairement à un rosier de jardin double, qui pour un insecte n'est que du décor. Un solide compte de chenilles, et les cynorrhodons sont ce dont vivent grives mauvis, litornes, merles et mulots en décembre. Le fourré épineux est un couvert de nidification de premier choix.",
    propagationNote:
      "Les cynorrhodons demandent de la patience : nettoyez la graine, semez-la dehors à l'automne, et attendez-vous à en voir l'essentiel au second printemps. Les boutures ligneuses prises en hiver sont la voie rapide et s'enracinent bien.",
    supportNotes: {
      "winter-thrushes":
        "Les cynorrhodons sont la nourriture de décembre des grives litornes, mauvis et des merles, quand la haie n'a plus rien d'autre.",
    },
  },

  // -------------------------------------------------------------------------
  // France continentale — vivaces, graminées et grimpantes.
  // -------------------------------------------------------------------------
  "Origanum vulgare": {
    nativeNote:
      "L'herbe à fleurs roses des talus calcaires secs, des bords de sentier et des pelouses sèches de tout l'est et le centre de la France.",
    careNote:
      "Du soleil et du drainage, et il se débrouille seul ; il s'étend doucement à la racine et se ressème, ce qui sur un talus sec est exactement ce que vous voulez. Laissez les tiges florales debout tout l'hiver pour les insectes qui s'y abritent, et coupez-les en mars.",
    givesNote:
      "Si vous ne plantez qu'une seule plante à nectar pour les papillons dans l'est de la France, plantez celle-ci : en fin d'été, un carré d'origan porte plus de papillons à la fois que quoi que ce soit d'autre dans la prairie — nacrés, azurés, hespéries, citrons — plus les bourdons et les papillons de nuit diurnes, et une solide liste de chenilles bien à lui.",
    propagationNote:
      "Divisez une touffe au printemps — la méthode la plus simple, et elle marche toujours. La graine est très fine : pressez-la à la surface d'un terreau graveleux et laissez-la découverte, à la lumière.",
    supportNotes: {
      "bumble-bees":
        "En fin d'été, un carré d'origan porte plus de papillons et d'abeilles à la fois que quoi que ce soit d'autre dans une pelouse calcaire.",
    },
  },
  "Centaurea scabiosa": {
    nativeNote:
      "Une vivace à racine profonde des pelouses calcaires, des bords de route et des talus de voie ferrée de tout l'est et le centre de la France.",
    careNote:
      "Une racine pivotante d'un mètre de profondeur la met à l'épreuve de la sécheresse et lui donne une longue vie — et signifie aussi qu'elle supporte mal d'être déplacée une fois installée : semez-la ou plantez-la petite, là où vous la voulez. Elle veut un terrain pauvre, ensoleillé, bien drainé ; une terre riche la fait s'affaler.",
    givesNote:
      "De gros capitules pourpres rayonnants, par intermittence de juin à septembre, avec un puits de nectar exceptionnellement profond — c'est pourquoi les insectes à longue langue y vont : bourdons, grands nacrés, demi-deuils, zygènes. Chardonnerets et linottes prennent ensuite la graine tout l'automne, et elle héberge une longue liste de chenilles.",
    propagationNote:
      "Récoltez les capitules secs à l'automne et frottez-en la graine. Elle lève sans peine d'un semis d'automne dehors ; un semis de printemps réussit mieux après un mois de froid humide au réfrigérateur.",
    supportNotes: {
      "bumble-bees":
        "Un puits de nectar profond que seuls les insectes à longue langue peuvent atteindre — bourdons, grands nacrés et zygènes.",
    },
  },
  "Salvia pratensis": {
    nativeNote:
      "La haute sauge bleue des prairies et des bords de route sur calcaire, de la Bourgogne à la Lorraine et à la vallée du Rhône.",
    careNote:
      "Plein soleil, drainage franc et sol pauvre ; une rosette de feuilles gaufrées passe l'hiver et lance ses épis en mai. Rabattez les tiges fanées et elle refleurit souvent en fin d'été. Elle se ressème poliment dans le gravier et les gazons maigres.",
    givesNote:
      "Ses fleurs ont un levier à l'intérieur : une abeille qui s'y enfonce déclenche une étamine articulée qui lui tamponne le dos de pollen, un dispositif construit pour les bourdons et l'une des choses les plus élégantes d'une prairie française. Abeilles à longue langue, papillons de jour et papillons de nuit diurnes la travaillent des semaines durant, et elle porte une bonne liste de chenilles.",
    propagationNote:
      "Semez la graine fraîche à l'automne en pot laissé dehors — elle germe facilement. Les touffes installées se divisent au début du printemps, mais la racine pivotante fait que les vieux pieds se déplacent mal.",
  },
  "Knautia arvensis": {
    nativeNote:
      "La pelote d'épingles lilas des prairies de fauche, des bords de route et des talus secs de tout l'est et le centre de la France.",
    careNote:
      "Elle veut du soleil et du drainage, et rien d'autre ; une racine profonde la porte à travers le mois d'août le plus sec. C'est une plante de prairie de fauche : sa place est dans une herbe haute coupée une fois par an en fin d'été, et non dans une pelouse tondue ou un massif fertilisé.",
    givesNote:
      "Des pelotes d'épingles lilas plates de juin à septembre, sur lesquelles les papillons se posent sans arrêt — demi-deuils, nacrés, hespéries — et une plante dont une andrène spécialiste dépend pour son pollen et qu'elle ne trouve nulle part ailleurs. Sa liste de chenilles est courte, mais elle nourrit les proches parents du damier de la succise, et sa graine nourrit les fringilles.",
    propagationNote:
      "Récoltez les capitules secs en fin d'été et semez la graine aussitôt en pot dehors ou sur une terre nue — elle germe bien sans aucun traitement particulier. Les touffes se divisent aussi au début du printemps.",
  },
  "Brachypodium pinnatum": {
    nativeNote:
      "La graminée en touffe vert pâle des pelouses calcaires et des lisières de tout l'est et le centre de la France.",
    careNote:
      "Avertissement honnête d'abord : sur une pelouse calcaire non pâturée, cette graminée prend le dessus et étouffe les fleurs, ce qui est l'un des vrais problèmes de conservation de l'est de la France. Au jardin, cela veut dire qu'elle a sa place sur un talus sec que vous voulez couvert, et non dans une prairie fleurie — et qu'elle demande à être fauchée ou pâturée pour rester tenue.",
    givesNote:
      "Elle est malgré tout l'une des graminées les plus utilisées du réseau alimentaire de la région : les satyres, les hespéries et les demi-deuils qui font bouger une prairie en juin mangent celle-ci et hivernent au fond de ses touffes. Là où un jardin a la place d'un coin d'herbe en friche, c'est elle qui l'habite.",
    propagationNote:
      "Soulevez une touffe à l'automne ou au début du printemps et séparez-la en morceaux enracinés. Une graine semée directement sur une terre ratissée à l'automne prend aussi, mais c'est plus lent que la division.",
    supportNotes: {
      "grass-skippers":
        "Les satyres, les hespéries et les demi-deuils qui font bouger une pelouse calcaire en juin mangent cette graminée, et ils hivernent au fond de ses touffes.",
    },
  },
  "Clematis vitalba": {
    nativeNote:
      "La clématite sauvage qui drape les haies et les lisières sur calcaire de tout l'est et le centre de la France, en têtes argentées tout l'hiver.",
    careNote:
      "Vigoureuse jusqu'à la brutalité : elle étouffera un petit arbre en une décennie, plantez-la donc sur une grande haie, un mur ou un fil, et taillez-la sévèrement chaque hiver. C'est la mauvaise plante pour un petit jardin et la bonne pour une limite que vous voulez faire disparaître. Sa sève irrite la peau.",
    givesNote:
      "Des fleurs crème tardives quand la haie a fini, travaillées par les abeilles, les syrphes et les papillons de nuit, puis les têtes de graines plumeuses — la barbe de vieillard — qui accrochent la lumière tout l'hiver et garnissent les nids d'oiseaux au printemps. Elle héberge un ensemble de papillons de nuit spécialistes, et son fouillis dense est là où troglodytes et accenteurs s'abritent d'un coup de froid.",
    propagationNote:
      "Fixez une longue pousse dans la terre au printemps et détachez-la un an plus tard, une fois enracinée — simple et certain. Les boutures d'été en voie d'aoûtement s'enracinent sous abri. La graine germe aussi, sur deux hivers dehors.",
  },

  // -------------------------------------------------------------------------
  // Les taxa partagés avec la France atlantique dont la fiche dit autre chose
  // ici. La clé simple (dans `france-atlantic.ts`) porte la version atlantique ;
  // celles-ci, qualifiées par la région, portent la version continentale.
  // -------------------------------------------------------------------------
  "Fagus sylvatica@france-continental": {
    nativeNote:
      "L'arbre-cathédrale des forêts de l'est et du nord-est de la France, des Vosges et du Jura aux plateaux bourguignons.",
    careNote:
      "Il veut une terre qui reste régulièrement fraîche et bien drainée, et c'est le grand arbre le moins résistant à la sécheresse d'ici — les étés chauds de la dernière décennie ont durement touché le hêtre dans tout l'est de la France, si bien que sur une station sèche exposée au sud, un chêne est désormais le pari le plus sage. Ses racines superficielles et son ombre dense font que presque rien ne pousse dessous. Taillé en haie, il garde ses feuilles cuivrées tout l'hiver.",
    givesNote:
      "La faîne est une nourriture d'automne majeure pour les pinsons du Nord, les pinsons des arbres, les sittelles, les mulots, les blaireaux et les sangliers, et un hêtre mûr est un immeuble de trous et de fentes pour les pics, les mésanges et les chauves-souris. Sa liste de chenilles est honorable plutôt qu'énorme.",
    propagationNote:
      "Récoltez les faînes triangulaires dans leur cupule hérissée à l'automne — la plupart des années beaucoup sont vides, ramassez donc largement et faites le test de flottaison. Il leur faut environ trois mois de froid humide, qu'un semis d'automne en pot laissé dehors fournit gratuitement.",
  },
  "Carpinus betulus@france-continental": {
    nativeNote:
      "L'autre moitié de la chênaie de l'est — la classique forêt de chêne-charme de Lorraine, de Bourgogne et d'Alsace.",
    careNote:
      "Le grand arbre le plus indulgent de cette liste : argile lourde, humidité saisonnière, ombre, taille sévère — il prend tout. C'est pourquoi il fait la meilleure haie indigène de l'est de la France, gardant ses feuilles brunes tout l'hiver pour faire écran. Laissé libre, il devient un bel arbre au tronc cannelé.",
    givesNote:
      "Il héberge toute une gamme de chenilles, nourrit gros-becs et mésanges avec ses samares, et — taillé en haie — offre un couvert de nidification dense toute l'année ainsi qu'un brise-vent.",
    propagationNote:
      "Récoltez les graines ailées à l'automne et semez-les aussitôt dehors — prises bien mûres il leur faut un hiver, mais si elles ont séché elles peuvent bouder deux ans. De la patience et un pot dehors sont tout ce qu'elles demandent.",
    supportNotes: {
      hawfinch:
        "La graine de charme est ce qui fait passer l'hiver européen aux gros-becs, plus que celle d'aucun autre arbre. Les petites noix côtelées tiennent dans une aile papyracée à trois pointes et restent sur les rameaux longtemps après que les feuilles ont bruni, et les oiseaux les travaillent jusqu'en mars.",
    },
  },
  "Tilia cordata@france-continental": {
    nativeNote:
      "Un indigène des forêts de l'est de la France et l'arbre d'innombrables places de village — celui dont les fleurs donnent le tilleul.",
    careNote:
      "De longue vie, tolérant à l'argile et à l'air des villes, il répond à la taille sévère mieux qu'aucun autre grand arbre indigène — c'est pourquoi les villages français les taillent en têtards depuis des siècles. Les pucerons du tilleul font pleuvoir du miellat au cœur de l'été : ce n'est pas l'arbre sous lequel garer une voiture.",
    givesNote:
      "Fin juin, un tilleul en fleur s'entend de l'autre bout du jardin : c'est l'un des plus grands arbres à nectar d'Europe, qui nourrit abeilles, syrphes et papillons de nuit pendant quinze jours. Un bon compte de chenilles aussi, et les vieux tilleuls se creusent en quelques-uns des meilleurs gîtes à chauves-souris et à chouettes qui soient.",
    propagationNote:
      "La graine de tilleul est réputée lente — le tégument et l'embryon la retiennent tous deux, si bien que les fruits récoltés attendent souvent deux hivers. Semez-les frais et encore un peu verts, en pot dehors. Beaucoup plus rapide : marcottez une pousse basse, ou déterrez l'un des rejets qu'un vieil arbre pousse à son pied.",
    supportNotes: {
      "bumble-bees":
        "Un tilleul en fleur à la fin juin s'entend de l'autre côté du jardin. Il arrive au moment le plus creux de l'année, et pendant quinze jours c'est le plus gros repas disponible pour les bourdons à des kilomètres.",
    },
  },
  "Humulus lupulus@france-continental": {
    nativeNote:
      "Indigène dans les haies fraîches, les fourrés de bord de rivière et les lisières de tout l'est de la France — et la culture qui a fait le pays brassicole alsacien.",
    careNote:
      "Il disparaît jusqu'au sol chaque hiver et regrimpe six mètres avant août, ce qui en fait l'écran indigène le plus rapide que vous puissiez planter — sur une clôture, une arche ou un mur laid. Il court à la racine : contenez-le ou donnez-lui de la place. Le houblon est toxique pour les chiens ; c'est le pied femelle qui porte les cônes.",
    givesNote:
      "La plante nourricière du robert-le-diable — celui aux bords d'ailes déchiquetés, qui passe l'hiver à l'état adulte en ressemblant exactement à une feuille morte — et de plusieurs beaux papillons de nuit. Ses cônes de fin d'été nourrissent et abritent des insectes, et son rideau dense de feuilles est un couvert de nidification et de dortoir sur un mur nu.",
    propagationNote:
      "Au début du printemps, creusez au bord d'une touffe et coupez un morceau de la racine charnue coureuse portant un bourgeon — c'est ainsi que les houblonniers ont toujours fait, et c'est quasi certain. Les boutures de pousses tendres au début de l'été s'enracinent aussi.",
    supportNotes: {
      comma:
        "Le houblon est l'une des plantes nourricières du robert-le-diable, avec l'ortie et l'orme.",
    },
  },
  "Lotus corniculatus@france-continental": {
    nativeNote:
      "La petite légumineuse jaune des pelouses calcaires, des bords de route et des gazons ras, partout en France.",
    careNote:
      "Semez-la dans un terrain maigre, pauvre et ensoleillé — c'est l'une des rares bonnes choses qu'on puisse faire d'un bord de route tassé ou d'un talus de sous-sol — puis fauchez une seule fois, tard, en septembre. Elle fabrique son propre azote, ne la nourrissez donc jamais, et elle disparaît de tout ce qui est riche ou ombragé.",
    givesNote:
      "À poids égal, la plante à papillons la plus importante de France. Les azurés, les hespéries, les zygènes et les soucis y élèvent leurs chenilles, plusieurs d'entre eux sur presque rien d'autre, et sa longue saison de petites fleurs jaunes nourrit les bourdons de mai à septembre. Quand une prairie a perdu ses papillons, c'est en général cela qu'elle a perdu.",
    propagationNote:
      "Le tégument est dur, comme chez la plupart des légumineuses : entaillez-le au papier de verre ou faites-le tremper une nuit dans de l'eau tiède, puis semez directement sur une terre nue griffée à l'automne ou au début du printemps. Elle supporte mal d'être mise en pot puis déplacée : semez-la là où vous la voulez.",
    supportNotes: {
      "common-blue":
        "Le lotier corniculé est la principale plante nourricière de l'azuré commun — et les fourmis montent souvent la garde au-dessus des chenilles pour les gouttes sucrées qu'elles exsudent.",
      "six-spot-burnet":
        "Les chenilles de la zygène tirent des composés cyanurés des feuilles de lotier et les gardent — c'est pourquoi l'adulte peut se permettre de voler lentement, en écarlate et noir.",
      "bumble-bees":
        "Une longue saison de petites fleurs jaunes, de mai à septembre, travaillée sans arrêt par les bourdons.",
    },
  },
};
