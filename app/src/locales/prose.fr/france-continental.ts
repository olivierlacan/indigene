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
    supportNotes: {
      "eurasian-jay":
        "Le geai emporte les glands un par un dans sa gorge et les enterre isolément dans toute la forêt — des milliers par automne. Ceux qu'il ne revient jamais chercher, c'est ainsi qu'une chênaie remonte la pente.",
      "hazel-dormouse":
        "C'est grâce aux glands que le muscardin fait ses réserves d'hiver en octobre, dans les derniers jours avant de se rouler en boule pour sept mois de sommeil.",
    },
    nativeNote:
      "Le chêne dominant des forêts de l'est de la France — les grandes chênaies de Tronçais, le piémont vosgien et la Bourgogne, c'est largement cet arbre.",
    careNote:
      "Lent, puis là pour des siècles — un chêne planté maintenant est pour un arrière-petit-enfant. Il préfère une pente un peu plus sèche et mieux drainée que le chêne pédonculé de l'ouest atlantique, et accepte volontiers un sol acide. Sa racine pivotante profonde le rend résistant à la sécheresse mais difficile à déplacer : plantez-en un petit et laissez-lui de la place.",
    givesNote:
      "L'un des arbres les plus précieux de l'est de la France : plus de quatre cents espèces de chenilles, c'est-à-dire de quoi remplir chaque printemps un nid de mésanges et de sittelles. Puis des glands pour les geais, les pigeons ramiers, les pics, les écureuils et les sangliers, et l'ombre profonde et le bois mort où vivent les coléoptères et les chauves-souris de toute une forêt.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chêne germent dès l'automne, sans passage au froid, et ne doivent jamais sécher.",
  },
  "Acer campestre": {
    supportNotes: {
      "holly-blue":
        "Les petites fleurs verdâtres de l'érable champêtre s'ouvrent avant presque tout le reste de la haie, et les premiers azurés des nerpruns d'avril les visitent.",
      "hawfinch":
        "Les samares ailées sont une graine d'hiver, et le gros-bec les ouvre là où un pinson renonce.",
    },
    nativeNote:
      "L'érable des haies de l'est et du centre de la France, sur les terres agricoles calcaires et les lisières.",
    careNote:
      "Le peu exigeant : craie, argile, sécheresse, vent, ombre et taille lui conviennent tous. Il reste de taille modérée, ce qui en fait l'érable d'un jardin ordinaire, et il entre dans une haie mixte aussi volontiers que le charme.",
    givesNote:
      "Ses fleurs verdâtres précoces sont une vraie source de nectar en avril, avant que la plupart des arbres ne fleurissent, et bon nombre de chenilles suivent sur les feuilles. Il passe au jaune beurre pur à l'automne, et ses samares ailées nourrissent les fringilles.",
    propagationNote:
      "Semez les samares à l'automne en pot laissé dehors, et soyez patient : beaucoup attendent le second printemps. Les boutures tendres prises au début de l'été vont plus vite.",
    lookalikeNotes: {
      "acer-negundo": {
        why: "Deux érables des haies et des berges — mais un seul des deux a une feuille en forme de feuille d'érable.",
        tells: [
          { feature: "Feuille", native: "Une seule feuille à cinq lobes arrondis et émoussés ; cassez le pétiole, il pleure un lait blanc.", lookalike: "Une feuille divisée en trois à cinq folioles séparées, grossièrement dentées, celle du bout souvent à trois pointes." },
          { feature: "Rameaux", native: "Souvent garnis de crêtes liégeuses sur les pousses plus âgées.", lookalike: "Lisses, verts à violets, sous une pruine cireuse qu'on efface au pouce." },
          { feature: "Graines", native: "Samares appariées écartées presque en ligne droite.", lookalike: "Samares appariées en V étroit, pendues en longues grappes." },
          { feature: "Où il pousse", native: "Dans les haies et les lisières, surtout sur terrain calcaire.", lookalike: "En fourrés jeunes et denses sur les graviers de rivière et les talus remaniés." },
        ],
      },
    },
  },
  "Sorbus torminalis": {
    supportNotes: {
      "winter-thrushes":
        "Les alises restent dures et acides jusqu'aux premières gelées qui les blettissent — le moment exact où les grives musiciennes et les merles les veulent.",
      "hawfinch":
        "Le gros-bec extrait les pépins des fruits tombés, noyau compris.",
    },
    nativeNote:
      "Un arbre dispersé dans les vieilles chênaies-charmaies sur calcaire du centre et de l'est de la France — un indicateur de forêt ancienne.",
    careNote:
      "Lent, peu commun, et qui mérite qu'on l'attende : un bel arbre à feuilles d'érable qui encaisse la sécheresse et le calcaire une fois installé, et devient cramoisi profond à l'automne. Il drageonne doucement, ce qui est sa façon habituelle de s'étendre à l'état sauvage. Donnez-lui une lisière ensoleillée plutôt que l'ombre profonde.",
    givesNote:
      "Un solide arbre à chenilles, avec de lourds corymbes blancs pour les abeilles en mai puis des fruits bruns mouchetés — les alises, dont on faisait autrefois une boisson à la campagne — que grives, merles et draines prélèvent en quantité tout l'automne.",
    propagationNote:
      "Débarrassez les fruits de leur pulpe et semez aussitôt en pot dehors : la graine a besoin d'un long froid d'hiver, parfois précédé d'une période chaude. Les boutures tendres s'enracinent aussi.",
  },
  "Pinus sylvestris": {
    nativeNote:
      "Indigène sur les calcaires secs et les terrains sableux de l'est de la France — le Jura, le piémont vosgien et les côtes bourguignonnes.",
    careNote:
      "Il veut le plein soleil et ne poussera pas à l'ombre, mais au-delà de cela il est indifférent — sable, craie, sécheresse, froid, vent. Rapide ses premières décennies, puis il s'installe dans la silhouette à cime plate et écorce orangée qui fait qu'un vieux pin valait la peine d'être planté.",
    givesNote:
      "La graine de pin est l'aliment d'hiver de base des becs-croisés, des tarins, des mésanges noires et des sittelles, et le houppier ouvert d'un pin mûr est là où nichent buses, milans et hiboux. Une liste de chenilles honorable, et l'écorce orange qui s'exfolie est un terrain de chasse pour les grimpereaux.",
    propagationNote:
      "Récoltez des cônes fermés en hiver et gardez-les dans un endroit chaud et sec jusqu'à ce qu'ils s'ouvrent, puis secouez-en la graine ailée. Elle germe facilement au printemps sans aucun froid.",
    supportNotes: {
      "conifer-seed-finches":
        "La graine de pin est l'aliment d'hiver de base des becs-croisés et des tarins — le bec du bec-croisé est un outil fait pour exactement ce cône.",
    },
  },

  // -------------------------------------------------------------------------
  // France continentale — arbustes.
  // -------------------------------------------------------------------------
  "Crataegus laevigata": {
    nativeNote:
      "L'aubépine des bois de l'est de la France — plus à son aise à l'ombre des vieilles forêts et des haies que sa cousine des champs ouverts.",
    careNote:
      "Aussi robuste et accommodante que le sont les aubépines — argile, calcaire, ombre, vent, taille sévère. Les épines sont tout l'intérêt : c'est ce qui fait d'une haie d'aubépine une forteresse pour les oiseaux nicheurs. Taillez-la en fin d'hiver, jamais pendant les mois de nidification.",
    givesNote:
      "Après le chêne, et de très loin, l'arbuste à chenilles le plus productif de la région. Sa lourde floraison de mai nourrit une foule énorme d'abeilles, de syrphes et de coléoptères, et ses cenelles rouges tiennent jusqu'en hiver pour les grives litornes, mauvis, draines et merles. Et puis il y a la haie elle-même, assez épineuse pour qu'un chat ne puisse pas suivre un oiseau nicheur à l'intérieur.",
    propagationNote:
      "La graine d'aubépine est lente exprès : débarrassez les cenelles de leur chair, semez-les dehors au début de l'automne, et attendez-vous à voir lever l'essentiel au second printemps, voire plus tard. Les boutures s'enracinent rarement.",
    supportNotes: {
      "winter-thrushes":
        "Les cenelles rouges tiennent jusque dans les grands froids pour les grives litornes, mauvis et les merles.",
      "bumble-bees":
        "Sa lourde floraison de mai nourrit d'un coup bourdons, abeilles solitaires, syrphes et coléoptères.",
    },
  },
  "Prunus mahaleb": {
    pioneerNote:
      "Il sort des murs calcaires et des gravats de carrière dans tout l'est de la France — semé par un oiseau dans un joint de mortier, puis fleurissant là pendant des décennies.",
    nativeNote:
      "Un petit cerisier sauvage au parfum sucré des pentes calcaires sèches et des broussailles de Bourgogne, du piémont jurassien et de la vallée du Rhône.",
    careNote:
      "Peut-être le feuillu le plus résistant à la sécheresse d'ici — il pousse dans la caillasse calcaire nue et ne demande jamais d'eau. Il drageonne et se ressème abondamment : donnez-lui un talus ou une haie plutôt qu'un massif. Feuilles et noyaux contiennent des composés cyanurés ; c'est une plante à tenir hors d'un pré à chevaux.",
    givesNote:
      "Les cerisiers sont un grand genre à chenilles, et celui-ci est celui qui poussera sur un calcaire sec. Sa floraison blanche parfumée nourrit les abeilles en avril, et les petits fruits noirs amers sont prélevés par les fauvettes à tête noire, les grives, les merles et les fauvettes qui s'engraissent pour la migration.",
    propagationNote:
      "Débarrassez les noyaux mûrs de leur chair en fin d'été et donnez-leur environ trois mois de froid humide avant de semer au printemps — ou semez-les à l'automne en pot dehors. Les boutures tendres s'enracinent au début de l'été, sur chaleur de fond.",
    supportNotes: {
      "blackcaps-warblers":
        "De petites cerises noires amères en fin d'été, prélevées par les fauvettes à tête noire et les autres fauvettes qui s'engraissent pour le voyage vers le sud.",
    },
  },
  "Cornus mas": {
    supportNotes: {
      "winter-thrushes":
        "Les cornouilles tombent écarlates et acidulées en août, et merles et grives les ramassent au sol sous l'arbuste.",
    },
    nativeNote:
      "Un arbuste des lisières et des haies sur calcaire chaud de l'est et du sud-est de la France.",
    careNote:
      "Lent mais vraiment facile : calcaire, sécheresse, ombre, taille. Il fait une excellente haie libre et ne demande aucune taille du tout si vous avez la place. Plantez-en deux si vous voulez une vraie récolte de fruits.",
    givesNote:
      "Il fleurit en février, sur le bois nu — une brume de petits bouquets jaunes au moment où sortent les premières reines de bourdons et où il n'y a rien d'autre pour elles. Puis des cornouilles rouges luisantes en fin d'été pour les merles, les grives et les fauvettes à tête noire (et pour la confiture, si vous arrivez le premier).",
    propagationNote:
      "Débarrassez les fruits mûrs de leur pulpe et semez aussitôt dehors — les noyaux sont durs et la plupart ne lèveront qu'au second printemps. Les boutures vont plus vite : semi-aoûtées en été ou ligneuses en hiver.",
  },
  "Viburnum lantana": {
    supportNotes: {
      "winter-thrushes":
        "Les baies mûrissent irrégulièrement — rouges et noires dans la même grappe — si bien qu'un merle revient au même buisson pendant des semaines au lieu de le vider en un jour.",
    },
    nativeNote:
      "Un arbuste des haies, des broussailles et des lisières sur calcaire sec, dans tout l'est et le centre de la France.",
    careNote:
      "Taillée pour le calcaire sec : des feuilles grises, molles et feutrées qui limitent la perte d'eau, et une indifférence complète à la sécheresse une fois installée. Facile en haie mixte, sans aucune taille nécessaire, et elle accepte pas mal d'ombre. Ses baies sont toxiques pour nous : celle-là est pour les oiseaux seulement.",
    givesNote:
      "Ses corymbes crème plats nourrissent abeilles, syrphes et coléoptères en mai, puis le fruit fait quelque chose d'inhabituel et d'utile : il mûrit irrégulièrement, si bien qu'un seul bouquet porte à la fois des baies vertes, rouges et noires et continue de nourrir fauvettes, grives et fauvettes à tête noire plusieurs semaines de suite au lieu d'une.",
    propagationNote:
      "Semez la graine fraîche dehors avant la mi-automne : elle fait une racine à la chaleur, puis une pousse après l'hiver. Les boutures tendres d'été vont plus vite.",
  },
  "Ligustrum vulgare": {
    nativeNote:
      "Le troène indigène des haies, des broussailles et des lisières sur calcaire de tout l'est et le centre de la France.",
    careNote:
      "L'indigène à planter au lieu du troène du Japon ou du laurier-cerise des haies de lotissement — même métier, même tolérance à l'ombre, à la sécheresse, au calcaire et à la taille, mais celui-là est d'ici. Laissez-le fleurir plutôt que de le tondre à plat deux fois par an, sinon vous perdez tout ce pour quoi il est bon. Les baies noires sont toxiques pour les personnes et les animaux domestiques.",
    givesNote:
      "La plante nourricière du sphinx du troène, l'un des plus grands sphinx de France — un insecte grand comme une paume, rayé de rose et de noir, dont l'énorme chenille verte grandit sur ces feuilles. Ses lourds corymbes parfumés de juin nourrissent abeilles, papillons de nuit et papillons de jour, et ses baies noires font passer l'hiver aux grives et aux fauvettes à tête noire.",
    propagationNote:
      "Des boutures nues prises en hiver et enfoncées dans une terre humide s'enracinent facilement — c'est l'un des ligneux les plus faciles qui soient. Par semis, débarrassez la graine de sa pulpe et semez-la fraîche à l'automne ; une graine stockée demande d'abord un à deux mois de froid humide.",
    supportNotes: {
      "privet-hawk-moth":
        "Le troène sauvage est la plante nourricière classique de l'un des plus grands sphinx de France — l'énorme chenille verte, rayée de lilas, grandit sur ces feuilles.",
      "winter-thrushes":
        "Les baies noires font passer l'hiver aux grives et aux fauvettes à tête noire.",
    },
  },
  "Euonymus europaeus": {
    supportNotes: {
      "winter-thrushes":
        "Les capsules rose vif du fusain s'ouvrent en octobre sur des graines orange. Elles sont toxiques pour nous et partent vite chez les rouges-gorges et les merles, qui emportent la graine et la déposent ailleurs.",
      "hazel-dormouse":
        "Le muscardin prend aussi les fruits du fusain, en circulant la nuit le long des branches fines.",
    },
    nativeNote:
      "Un arbuste de haie et de lisière du pays calcaire, dans tout l'est et le centre de la France.",
    careNote:
      "Facile dans toute terre correcte, calcaire ou argileuse, au soleil ou à mi-ombre, et il ne demande aucune taille. Toutes ses parties sont toxiques si on les avale — le fruit vif en particulier, et il est assez vif pour tenter un enfant — c'est donc un arbuste pour le fond d'une haie plutôt que le bord d'une aire de jeux.",
    givesNote:
      "Son spectacle d'automne n'a pas d'égal chez les arbustes indigènes : des capsules rose vif qui s'ouvrent pour laisser pendre des graines orange au bout d'un fil, prélevées par les rougegorges et les fauvettes à tête noire, au-dessus de feuilles devenues écarlates. Il porte aussi une grosse population de pucerons en début d'été, ce qui a l'air d'un problème et est en réalité ce qui nourrit les mésanges bleues, les coccinelles et les larves de syrphes.",
    propagationNote:
      "Débarrassez la graine de sa chair orange — mettez des gants — et semez aussitôt dehors ; attendez-vous à ce qu'une bonne part attende le second printemps. Les boutures d'été en voie d'aoûtement s'enracinent volontiers et sont bien plus rapides.",
  },
  "Rosa canina": {
    nativeNote:
      "Le rosier sauvage des haies, des talus et des broussailles, partout dans l'est et le centre de la France.",
    careNote:
      "Il poussera n'importe où et s'arque loin, s'accrochant à tout ce qui se trouve à côté — une haie ou un talus, pas un massif. Rabattez-le sévèrement en fin d'hiver s'il prend le dessus. Pas de traitement, pas d'engrais, pas de souci de maladie des taches noires : c'est le rosier à partir duquel tous les capricieux ont été obtenus.",
    givesNote:
      "Des fleurs simples ouvertes, c'est-à-dire qu'une abeille peut réellement atteindre le pollen — contrairement à un rosier de jardin double, qui pour un insecte n'est que du décor. Bon nombre de chenilles, et les cynorrhodons sont ce dont vivent grives mauvis, litornes, merles et mulots en décembre. Le fourré épineux est un couvert de nidification de premier choix.",
    propagationNote:
      "Les cynorrhodons demandent de la patience : nettoyez la graine, semez-la dehors à l'automne, et attendez-vous à en voir l'essentiel au second printemps. Les boutures ligneuses prises en hiver sont la voie rapide et s'enracinent bien.",
    supportNotes: {
      "winter-thrushes":
        "Les cynorrhodons sont la nourriture de décembre des grives litornes, mauvis et des merles, quand la haie n'a plus rien d'autre.",
    },
  },

  // -------------------------------------------------------------------------
  // France continentale — vivaces, graminées et grimpantes.
  // -------------------------------------------------------------------------
  "Origanum vulgare": {
    pioneerNote:
      "Un talus sec et calcaire ou un dessus de mur, c'est là qu'il est le plus heureux ; et en août c'est ce qu'il y a de plus fréquenté du jardin, abeilles et papillons mêlés.",
    nativeNote:
      "L'herbe à fleurs roses des talus calcaires secs, des bords de sentier et des pelouses sèches de tout l'est et le centre de la France.",
    careNote:
      "Du soleil et du drainage, et il se débrouille seul ; il s'étend doucement à la racine et se ressème, ce qui sur un talus sec est exactement ce que vous voulez. Laissez les tiges florales sur pied tout l'hiver pour les insectes qui s'y abritent, et coupez-les en mars.",
    givesNote:
      "Si vous ne plantez qu'une seule plante à nectar pour les papillons dans l'est de la France, plantez celle-ci : en fin d'été, un massif d'origan porte plus de papillons à la fois que quoi que ce soit d'autre dans la prairie — nacrés, azurés, hespéries, citrons — plus les bourdons et les papillons de nuit diurnes, et une solide liste de chenilles bien à lui.",
    propagationNote:
      "Divisez une touffe au printemps ou à l'automne — la méthode la plus simple. La graine est minuscule et ne demande aucun traitement : pressez-la à la surface d'un terreau graveleux.",
    supportNotes: {
      "bumble-bees":
        "En fin d'été, un massif d'origan porte plus de papillons et d'abeilles à la fois que quoi que ce soit d'autre dans une pelouse calcaire.",
    },
  },
  "Centaurea scabiosa": {
    nativeNote:
      "Une vivace à racine profonde des pelouses calcaires, des bords de route et des talus de voie ferrée de tout l'est et le centre de la France.",
    careNote:
      "Une racine pivotante d'un mètre de profondeur la rend résistante à la sécheresse et lui donne une longue vie — et signifie aussi qu'elle supporte mal d'être déplacée une fois installée : semez-la ou plantez-la petite, là où vous la voulez. Elle veut un terrain pauvre, ensoleillé, bien drainé ; une terre riche la fait s'affaler.",
    givesNote:
      "De gros capitules pourpres rayonnants, par intermittence de juin à septembre, avec un puits de nectar exceptionnellement profond — c'est pourquoi les insectes à longue langue y vont : bourdons, grands nacrés, demi-deuils, zygènes. Chardonnerets et linottes prennent ensuite la graine tout l'automne, et elle héberge une longue liste de chenilles.",
    propagationNote:
      "Récoltez les capitules secs à l'automne et frottez-en la graine. Semez-la au printemps, sans aucun traitement. Les touffes se divisent aussi au printemps ou à l'automne.",
    supportNotes: {
      "painted-lady":
        "Les grands papillons butinent les capitules de centaurée plusieurs minutes d'affilée — belles-dames, nacrés et demi-deuils d'une prairie sèche.",
      "six-spot-burnet":
        "Les zygènes diurnes à points rouges s'y rassemblent en nombre, plusieurs par capitule, en pleine chaleur de l'après-midi.",
      "goldfinches-linnets":
        "Laissez les capitules secs sur pied et les chardonnerets les démontent tout l'automne.",
      "bumble-bees":
        "Un puits de nectar profond que seuls les insectes à longue langue peuvent atteindre — bourdons, grands nacrés et zygènes.",
    },
  },
  "Salvia pratensis": {
    supportNotes: {
      "bumble-bees":
        "La fleur de la sauge des prés est un levier. Un bourdon qui pousse pour atteindre le nectar bascule un bras caché qui tamponne du pollen sur son dos — le mécanisme est calibré pour un insecte de ce poids, et peu d'autres arrivent à l'actionner.",
      "hummingbird-hawk-moth":
        "Le moro-sphinx boit en vol stationnaire par l'avant de la fleur sans jamais déclencher le levier — tout le nectar, rien du travail.",
    },
    nativeNote:
      "La haute sauge bleue des prairies et des bords de route sur calcaire, de la Bourgogne à la Lorraine et à la vallée du Rhône.",
    careNote:
      "Plein soleil, drainage franc et sol pauvre ; une rosette de feuilles gaufrées passe l'hiver et lance ses épis en mai. Rabattez les tiges fanées et elle refleurit souvent en fin d'été. Elle se ressème sans excès dans le gravier et les gazons maigres.",
    givesNote:
      "Ses fleurs ont un levier à l'intérieur : une abeille qui s'y enfonce déclenche une étamine articulée qui lui tamponne le dos de pollen, un dispositif conçu pour les bourdons et l'une des choses les plus élégantes d'une prairie française. Abeilles à longue langue, papillons de jour et papillons de nuit diurnes la butinent des semaines durant, et elle porte une bonne liste de chenilles.",
    propagationNote:
      "Semez la graine au printemps en pot dehors — elle germe facilement, sans aucun traitement.",
  },
  "Knautia arvensis": {
    supportNotes: {
      "mason-bees":
        "Une andrène, Andrena hattorfiana, récolte le pollen de la knautie et presque rien d'autre — on la reconnaît en vol à la charge gris-lilas sur ses pattes.",
      "bumble-bees":
        "Un capitule serré de fleurons veut dire qu'une abeille peut se nourrir longtemps sans avoir à voler, et c'est pour cela que la knautie est si butinée en août.",
      "glanville-fritillary":
        "L'une des fleurs préférées des mélitées pour refaire le plein dans une prairie sèche.",
    },
    nativeNote:
      "La pelote d'épingles lilas des prairies de fauche, des bords de route et des talus secs de tout l'est et le centre de la France.",
    careNote:
      "Elle veut du soleil et du drainage, et rien d'autre ; une racine profonde la porte à travers le mois d'août le plus sec. C'est une plante de prairie de fauche : sa place est dans une herbe haute coupée une fois par an en fin d'été, et non dans une pelouse tondue ou un massif fertilisé.",
    givesNote:
      "Des pelotes d'épingles lilas plates de juin à septembre, sur lesquelles les papillons se posent sans arrêt — demi-deuils, nacrés, hespéries — et une plante dont une andrène spécialiste dépend pour son pollen et qu'elle ne trouve nulle part ailleurs. Sa liste de chenilles est courte, mais elle nourrit les proches parents du damier de la succise, et sa graine nourrit les fringilles.",
    propagationNote:
      "Semez la graine au printemps en pot dehors, ou prélevez au printemps des pousses à la base de la touffe pour les bouturer.",
  },
  "Brachypodium pinnatum": {
    nativeNote:
      "La graminée en touffe vert pâle des pelouses calcaires et des lisières de tout l'est et le centre de la France.",
    careNote:
      "Une mise en garde d'abord : sur une pelouse calcaire non pâturée, cette graminée prend le dessus et étouffe les fleurs, ce qui est l'un des vrais problèmes de conservation de l'est de la France. Au jardin, cela veut dire qu'elle a sa place sur un talus sec que vous voulez couvert, et non dans une prairie fleurie — et qu'elle demande à être fauchée ou pâturée pour rester tenue.",
    givesNote:
      "Elle est malgré tout l'une des graminées les plus utilisées du réseau trophique de la région : les satyres, les hespéries et les demi-deuils qui font bouger une prairie en juin mangent celle-ci et hivernent au fond de ses touffes. Là où un jardin a la place d'un coin d'herbe en friche, c'est elle qui l'habite.",
    propagationNote:
      "Semez la graine sur une terre ratissée ; elle germe facilement, sans aucun traitement.",
    supportNotes: {
      "grass-skippers":
        "Les satyres, les hespéries et les demi-deuils qui font bouger une pelouse calcaire en juin mangent cette graminée, et ils hivernent au fond de ses touffes.",
    },
  },
  "Clematis vitalba": {
    pioneerNote:
      "Elle recouvre un grillage, un talus de voie ferrée ou un tas de pierres calcaires en une saison. Vigoureuse jusqu'à l'excès : donnez-lui quelque chose que vous voulez cacher.",
    supportNotes: {
      "mason-bees":
        "La clématite fleurit tard et garde son nectar à découvert, si bien que les petites abeilles solitaires encore en vol en septembre l'atteignent toutes.",
      "bumble-bees":
        "Des haies entières fleurissent d'un coup, ce qui vaut beaucoup dans les semaines maigres avant l'ouverture du lierre.",
    },
    nativeNote:
      "La clématite sauvage qui drape les haies et les lisières sur calcaire de tout l'est et le centre de la France, en têtes argentées tout l'hiver.",
    careNote:
      "Vigoureuse jusqu'à la brutalité : elle étouffera un petit arbre en une décennie, plantez-la donc sur une grande haie, un mur ou un fil, et taillez-la sévèrement chaque hiver. C'est la mauvaise plante pour un petit jardin et la bonne pour une limite que vous voulez faire disparaître. Sa sève irrite la peau.",
    givesNote:
      "Des fleurs crème tardives quand la haie a fini de fleurir, butinées par les abeilles, les syrphes et les papillons de nuit, puis les plumets de graines — la barbe de vieillard — qui accrochent la lumière tout l'hiver et garnissent les nids d'oiseaux au printemps. Elle héberge un ensemble de papillons de nuit spécialistes, et son fouillis dense est là où troglodytes et accenteurs s'abritent d'un coup de froid.",
    propagationNote:
      "Fixez une longue pousse dans la terre en fin d'hiver ou au début du printemps et détachez-la une fois enracinée. Les boutures tendres au printemps et semi-aoûtées au début de l'été s'enracinent sous abri. La graine semée dehors à l'automne peut mettre un an à lever.",
  },

  // -------------------------------------------------------------------------
  // Les taxa partagés avec la France atlantique dont la fiche dit autre chose
  // ici. La clé simple (dans `france-atlantic.ts`) porte la version atlantique ;
  // celles-ci, qualifiées par la région, portent la version continentale.
  // -------------------------------------------------------------------------
  "Fagus sylvatica@france-continental": {
    supportNotes: {
      "hawfinch":
        "Le bec du gros-bec se referme avec assez de force pour casser un noyau de cerise. La faîne est un travail facile à côté, et une année de forte faînée remplit la hêtraie de gros-becs.",
      "hazel-dormouse":
        "La faîne est riche en huile et elle tombe exactement dans les semaines où le muscardin doit doubler de poids.",
      "eurasian-jay":
        "Le geai enterre les faînes comme il enterre les glands — et plante la génération suivante des deux en oubliant où.",
    },
    nativeNote:
      "L'arbre-cathédrale des forêts de l'est et du nord-est de la France, des Vosges et du Jura aux plateaux bourguignons.",
    careNote:
      "Il veut une terre qui reste régulièrement fraîche et bien drainée, et c'est le grand arbre le moins résistant à la sécheresse d'ici — les étés chauds de la dernière décennie ont durement touché le hêtre dans tout l'est de la France, si bien que sur une station sèche exposée au sud, un chêne est désormais le pari le plus sage. Ses racines superficielles et son ombre dense font que presque rien ne pousse dessous. Taillé en haie, il garde ses feuilles cuivrées tout l'hiver.",
    givesNote:
      "La faîne est une nourriture d'automne majeure pour les pinsons du Nord, les pinsons des arbres, les sittelles, les mulots, les blaireaux et les sangliers, et un hêtre mûr est un immeuble de trous et de fentes pour les pics, les mésanges et les chauves-souris. Sa liste de chenilles est honorable plutôt qu'énorme.",
    propagationNote:
      "Récoltez les faînes triangulaires dans leur cupule hérissée à l'automne — les bonnes faînées ne reviennent que tous les quelques ans, profitez-en. Il leur faut trois à quatre mois de froid humide, qu'un semis d'automne en pot laissé dehors fournit gratuitement.",
  },
  "Carpinus betulus@france-continental": {
    nativeNote:
      "L'autre moitié de la chênaie de l'est — la classique forêt de chêne-charme de Lorraine, de Bourgogne et d'Alsace.",
    careNote:
      "Le grand arbre le plus accommodant d'ici : argile lourde, humidité saisonnière, ombre, taille sévère — il prend tout. C'est pourquoi il fait la meilleure haie indigène de l'est de la France, gardant ses feuilles brunes tout l'hiver pour faire écran. Laissé libre, il devient un bel arbre au tronc cannelé.",
    givesNote:
      "Il héberge toute une gamme de chenilles, nourrit gros-becs et mésanges avec ses samares, et — taillé en haie — offre un couvert de nidification dense toute l'année ainsi qu'un brise-vent.",
    propagationNote:
      "Récoltez les graines ailées à l'automne et semez-les aussitôt dehors — prises bien mûres il leur faut un hiver, mais si elles ont séché elles peuvent bouder deux ans. De la patience et un pot dehors sont tout ce qu'elles demandent.",
    supportNotes: {
      "eurasian-jay":
        "Encore une graine que le geai met en réserve pour l'hiver et oublie à moitié.",
      hawfinch:
        "La graine de charme est ce qui fait passer l'hiver européen aux gros-becs, plus que celle d'aucun autre arbre. Les petites noix côtelées tiennent dans une aile papyracée à trois pointes et restent sur les rameaux longtemps après que les feuilles ont bruni, et les oiseaux les picorent jusqu'en mars.",
    },
  },
  "Tilia cordata@france-continental": {
    nativeNote:
      "Un indigène des forêts de l'est de la France et l'arbre d'innombrables places de village — celui dont les fleurs donnent le tilleul.",
    careNote:
      "De longue vie, tolérant à l'argile et à l'air des villes, il répond à la taille sévère mieux qu'aucun autre grand arbre indigène — c'est pourquoi les villages français les taillent en têtards depuis des siècles. Les pucerons du tilleul font pleuvoir du miellat au cœur de l'été : ce n'est pas l'arbre sous lequel garer une voiture.",
    givesNote:
      "Fin juin, un tilleul en fleur s'entend de l'autre bout du jardin : c'est l'un des plus grands arbres à nectar d'Europe, qui nourrit abeilles, syrphes et papillons de nuit pendant quinze jours. Bon nombre de chenilles aussi, et les vieux tilleuls se creusent en quelques-uns des meilleurs gîtes à chauves-souris et à chouettes qui soient.",
    propagationNote:
      "La graine de tilleul est réputée lente — le tégument et l'embryon la retiennent tous deux, si bien qu'une bonne part attend la deuxième année. Cueillez les fruits quand ils passent du vert au gris-brun et semez-les aussitôt en pot dehors. Beaucoup plus rapide : marcottez une pousse basse.",
    supportNotes: {
      "hummingbird-hawk-moth":
        "Le tilleul livre l'essentiel de son nectar vers le soir, l'heure où le moro-sphinx arrive et se tient en vol devant les fleurs.",
      "eurasian-jay":
        "Sa graine n'intéresse pas grand monde, mais son houppier dense d'été est un site de nid classique pour le geai.",
      "bumble-bees":
        "Un tilleul en fleur à la fin juin s'entend de l'autre côté du jardin. Il arrive au moment le plus creux de l'année, et pendant quinze jours c'est le plus gros repas disponible pour les bourdons à des kilomètres.",
    },
  },
  "Humulus lupulus@france-continental": {
    nativeNote:
      "Indigène dans les haies fraîches, les fourrés de bord de rivière et les lisières de tout l'est de la France — et la culture qui a fait le pays brassicole alsacien.",
    careNote:
      "Il disparaît jusqu'au sol chaque hiver et regrimpe six mètres avant août, ce qui en fait l'écran indigène le plus rapide que vous puissiez planter — sur une clôture, une arche ou un mur laid. Il trace : contenez-le ou donnez-lui de la place. Le houblon est toxique pour les chiens ; c'est le pied femelle qui porte les cônes.",
    givesNote:
      "La plante nourricière du robert-le-diable — celui aux bords d'ailes déchiquetés, qui passe l'hiver à l'état adulte en ressemblant exactement à une feuille morte — et de plusieurs beaux papillons de nuit. Ses cônes de fin d'été nourrissent et abritent des insectes, et son rideau dense de feuilles est un couvert de nidification et de dortoir sur un mur nu.",
    propagationNote:
      "Bouturez des pousses tendres à la fin du printemps, ou des pousses plus fermes en été ; les deux s'enracinent.",
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
      "Le tégument est dur, comme chez la plupart des légumineuses : entaillez-le au papier de verre ou faites-le tremper une nuit dans de l'eau tiède, puis semez directement sur une terre nue griffée à l'automne ou au début du printemps.",
    supportNotes: {
      "common-blue":
        "Le lotier corniculé est la principale plante nourricière de l'azuré commun — et les fourmis montent souvent la garde au-dessus des chenilles pour les gouttes sucrées qu'elles exsudent.",
      "six-spot-burnet":
        "Les chenilles de la zygène tirent des composés cyanurés des feuilles de lotier et les gardent — c'est pourquoi l'adulte peut se permettre de voler lentement, en écarlate et noir.",
      "bumble-bees":
        "Une longue saison de petites fleurs jaunes, de mai à septembre, butinée sans arrêt par les bourdons.",
    },
  },
  // -------------------------------------------------------------------------
  // France continentale — le sol de la hêtraie : laîche d'ombre et fougère dure.
  // -------------------------------------------------------------------------
  "Carex sylvatica": {
    supportNotes: {
      "grass-skippers":
        "Les laîches nourrissent une longue liste de petits papillons bruns et de papillons de nuit, et une touffe de laîche à l'ombre est là où ils passent l'année.",
    },
    nativeNote:
      "La laîche souple et arquée des sous-bois frais et ombragés de l'est, qui sort en mai de minces épis verts pendants, comme une plante qui aurait renoncé à se faire remarquer.",
    careNote:
      "La plante de l'ombre humide sous les arbres, là où le gazon ne se referme pas et où presque tout boude. Elle veut de l'ombre et un sol qui ne sèche pas ; dans un massif ensoleillé elle grille. Plantez-la en nappes espacées d'une trentaine de centimètres et elle fait un tapis vert de sous-bois en trois ans. Rabattez-la en fin d'hiver, avant que la nouvelle pousse ne monte.",
    givesNote:
      "Les laîches sont les plantes-hôtes d'un nombre surprenant de petits papillons bruns et de papillons de nuit, et une touffe de laîche à l'ombre est là où ils passent l'année. Les touradons et la litière en dessous sont un abri humide pour les coléoptères, les araignées et les amphibiens pendant les mois où tout le reste sèche.",
    propagationNote:
      "Divisez une touffe établie au printemps et replantez les éclats aussitôt, en les gardant humides le premier été. Elle se ressème aussi seule dans une ombre qui lui convient.",
  },
  "Polystichum aculeatum": {
    nativeNote:
      "Une fougère sombre, dure et luisante des talus ombragés et des bois calcaires de l'est — des frondes rétrécies aux deux bouts, vertes et rigides tout l'hiver.",
    careNote:
      "La plus résistante des trois : une fois installée, elle accepte l'ombre réellement sèche — le sol sous un hêtre ou le pied d'un mur nord — et n'y demande aucun arrosage d'été. Plantez le collet dégagé pour qu'il ne pourrisse pas, sur une pente si vous en avez une. Persistante et lente. Ne coupez que les frondes affaissées, en fin d'hiver.",
    givesNote:
      "Une fougère dure et persistante à l'ombre sèche fait le travail que rien d'autre ne fera : elle tient un talus qui autrement se ravinerait, et garde un coin de sol frais et abrité à travers la sécheresse d'été comme à travers l'hiver. C'est dans cet abri que vivent réellement les coléoptères, les araignées et les amphibiens d'un jardin. Très peu d'insectes mangent les fougères.",
    propagationNote:
      "Semez les spores mûres sur un terreau stérilisé humide, sous couvercle, au frais et à mi-ombre, et soyez patient. Les rhizomes se divisent au printemps.",
  },

  // -------------------------------------------------------------------------
  // Les autres taxa que cette région partage avec d'autres listes, écrits
  // d'après la fiche continentale — chacune est complète pour cette région.
  // -------------------------------------------------------------------------
  "Salix caprea@france-continental": {
    pioneerNote:
      "Il démarre sur les déblais de carrière et les remblais de bord de route en deux ou trois saisons, et s'enracine d'une bouture enfoncée directement dans la terre.",
    nativeNote:
      "Le saule qui s'installe tout seul dans chaque trouée humide, chaque lisière et chaque coin abandonné de l'est de la France — celui dont les bourgeons argentés s'ouvrent en chatons jaunes en mars.",
    careNote:
      "Contrairement à la plupart des saules, il n'exige pas un sol mouillé — une terre de jardin ordinaire lui convient, d'où sa facilité à coloniser. Il vit peu, pousse vite et supporte la coupe sévère : recépez-le jusqu'à la souche tous les cinq ou six ans et vous gardez une plante de la taille d'un arbuste, avec la même valeur. Les pieds mâles et femelles sont distincts ; ce sont les mâles qui portent les chatons jaunes que tout le monde veut.",
    givesNote:
      "L'une des plus grandes plantes à chenilles de la région — quelque 385 espèces de papillons de jour et de nuit —, il nourrit donc les oiseaux au nid mieux que n'importe quelle plante d'ornement. Et ses chatons de mars sont le premier vrai pollen de l'année, celui que les reines de bourdons cherchent en sortant d'hibernation.",
    propagationNote:
      "En hiver, enfoncez aux deux tiers dans une terre humide des boutures nues grosses comme un crayon, ou prélevez des pointes tendres au début de l'été. La graine ne reste vivante que quelques semaines.",
    supportNotes: {
      "purple-emperor":
        "Le grand mars changeant pond sur le saule marsault et rien d'autre. Les mâles passent leur vie au sommet des grands arbres et ne descendent que pour le sol humide — le papillon a donc besoin du saule dans le bois, pas du chêne que tout le monde plante pour lui.",
      "poplar-hawk-moth":
        "La grosse chenille verte à corne émoussée mange les saules et les peupliers ; le jour, l'adulte se pose ailes postérieures poussées en avant, avec l'air d'un tas de feuilles mortes.",
      "mourning-cloak":
        "Les chenilles du morio mangent en groupe sur le saule, en une masse noire et épineuse, et le papillon passe l'hiver à l'état adulte : c'est le premier grand papillon du printemps dans l'est.",
      "mason-bees":
        "Les chatons de mars sont le premier vrai pollen de l'année, ouverts exactement quand les abeilles solitaires sortent de leurs tubes.",
      "bumble-bees":
        "Un saule marsault en fleur en mars, c'est là que vont les reines de bourdons tout juste réveillées, et si tôt elles n'y ont guère de concurrence.",
    },
  },
  "Betula pendula@france-continental": {
    pioneerNote:
      "Il se ressème dans le ballast des voies ferrées, les gravières et le béton fendu d'une cour, et c'est souvent le premier arbre d'un terrain que personne n'a planté.",
    nativeNote:
      "Le pionnier à écorce blanche des sols sableux, acides et pauvres de tout l'est — le premier arbre dans une clairière, et celui qui héberge le plus de chenilles après le saule et le chêne.",
    careNote:
      "Facile, rapide et de vie plutôt courte — soixante à quatre-vingts ans, pas des siècles. Il aime les sols acides et pauvres et le plein soleil, et n'aime pas la craie lourde. Ses racines sont superficielles et gourmandes : ne comptez pas sur un massif planté dessous ; plantez plutôt les bouleaux en groupe dans une herbe haute, c'est aussi là qu'ils sont le plus beaux. Son pollen d'avril est une cause sérieuse de rhume des foins.",
    givesNote:
      "Plus de trois cents espèces de chenilles dans cette région, et c'est ce chiffre-là qui compte : une nichée de mésanges bleues en mange des milliers. La graine des petits chatons nourrit tarins et sizerins tout l'hiver, et l'écorce qui pèle abrite des insectes que les grimpereaux fouillent toute l'année.",
    propagationNote:
      "Cueillez les chatons en fin d'été, tant qu'ils tiennent encore, et séchez-les jusqu'à ce qu'ils s'effritent. Éparpillez la graine, fine comme de la poussière, sur une terre nue et humide, et appuyez sans l'enterrer — la lumière aide la germination. Il se ressème si bien qu'il est souvent plus simple de déplacer un semis.",
    supportNotes: {
      "emperor-moth":
        "Les chenilles du petit paon de nuit mangent le bouleau, parmi une courte liste d'arbustes et d'arbres ; le mâle porte de faux yeux sur les quatre ailes et vole de jour en avril, cherchant les femelles à l'odeur.",
      "mourning-cloak":
        "Le bouleau est l'autre arbre du morio, et un groupe de bouleaux sur un terrain en friche est l'endroit où vous avez le plus de chances d'en croiser un.",
      "conifer-seed-finches":
        "Tarins et sizerins se pendent en bandes aux chatons tout l'hiver pour en extraire une graine à peine plus lourde que le vent.",
    },
  },
  "Populus tremula@france-continental": {
    nativeNote:
      "L'arbre qu'on entend avant de le voir — ses pétioles aplatis font cliqueter tout le houppier au moindre vent, sur les lisières et dans les clairières humides de tout l'est.",
    careNote:
      "Une chose à prévoir : il drageonne, et fort, si bien qu'un seul tremble devient en vingt ans un bosquet de clones. Sur un terrain en friche ou une limite, c'est le but ; dans un petit jardin, c'est une erreur, et tondre les rejets est le seul moyen pratique de les contenir. Rapide, robuste, et content sur un sol trop humide ou trop pauvre pour la plupart des arbres.",
    givesNote:
      "258 espèces de chenilles, c'est-à-dire de la nourriture pour les oiseaux à la saison où elle compte. Ses chatons sont un pollen précoce, son fourré de drageons un abri, et les vieux trembles pourrissent de l'intérieur d'une façon dont profitent les pics, puis les chouettes et les chauves-souris — c'est pourquoi un bosquet de trembles abrite plus de vie que sa taille ne le laisse penser.",
    propagationNote:
      "Déterrez un drageon enraciné en hiver — l'arbre vous les offre. De courts morceaux de racine couchés dans une caissette de terreau à la fin de l'hiver bourgeonnent aussi sans peine. La graine ne vit que quelques jours et ne sert presque jamais.",
    supportNotes: {
      "poplar-hawk-moth":
        "Le tremble est l'un des principaux arbres du sphinx du peuplier ; les chenilles y vivent tout l'été et se nymphosent dans le sol au pied de l'arbre.",
      "purple-emperor":
        "Le tremble est le deuxième arbre du grand mars changeant après le saule marsault, et c'est dans un bouquet de trembles que se tient toute la colonie.",
    },
  },
  "Alnus glutinosa@france-continental": {
    nativeNote:
      "L'arbre des berges, des bois humides et des sources de tout l'est — sombre, droit, les pieds dans l'eau là où aucun autre ligneux ne tient.",
    careNote:
      "Un sol mouillé, ou rien. Avec cela, l'aulne est rapide, robuste et discrètement généreux : il fixe son propre azote grâce à des bactéries logées dans ses racines et nourrit ce qu'on plante avec lui. Il perd des rameaux et de petits cônes toute l'année : tenez-le loin d'une terrasse. Achetez-le à une source de confiance — une maladie des racines, propagée par les plants de pépinière, a tué des aulnes le long des rivières de toute l'Europe.",
    givesNote:
      "Ses chatons de février sont parmi les tout premiers pollens de l'année, et la graine de ses petits cônes ligneux est ce pour quoi tarins et sizerins se suspendent tête en bas tout l'hiver. Ses racines tiennent une berge et ombragent assez l'eau pour garder un ruisseau frais — l'essentiel de ce dont un petit ruisseau a besoin.",
    propagationNote:
      "Récoltez les cônes à l'automne, séchez-les jusqu'à ce qu'ils s'ouvrent et pressez la graine ailée sur une terre mouillée — elle a besoin de lumière, ne la couvrez donc pas, et ne laissez jamais le pot sécher.",
    supportNotes: {
      "conifer-seed-finches":
        "Un bois d'aulnes humide en janvier, c'est un bois de tarins : des bandes qui décortiquent les petits cônes tête en bas, en criant sans arrêt.",
      "goldfinches-linnets":
        "Les chardonnerets prennent la même graine aux côtés des tarins, et les deux reviennent aux mêmes arbres jour après jour.",
    },
  },
  "Corylus avellana@france-continental": {
    nativeNote:
      "L'arbuste de sous-bois de chaque bois et de chaque vieille haie de l'est, et la plante qui ouvre l'année — des chatons jaunes pendants en janvier, quand le bois est encore nu.",
    careNote:
      "Soleil ou mi-ombre, tout sol correct, et le traitement traditionnel est le meilleur : coupez au ras du sol quelques-unes des plus vieilles tiges chaque hiver, ou toute la cépée tous les sept ans environ. C'est le recépage, ce qu'on fait au noisetier depuis plusieurs milliers d'années, et il le garde jeune indéfiniment. Les écureuils prendront les noisettes encore vertes, bien avant vous.",
    givesNote:
      "Des chatons en janvier, ce qui sous ce climat est la première nourriture de l'année pour tout ce qui vole par un après-midi doux, et sur les mêmes rameaux de minuscules fleurs femelles pourpres qu'il faut chercher. Une grande plante à chenilles au printemps, des noisettes à l'automne pour les geais, les pics, les mulots et les muscardins, et une cépée recépée qui reste un couvert de nidification épais tant que vous continuez à la couper.",
    propagationNote:
      "À l'automne, fixez une tige basse sous deux ou trois centimètres de terre et détachez-la un an plus tard — c'est ainsi qu'une cépée de noisetier s'étend d'elle-même. Par graines, semez les noisettes à l'automne dans un pot enterré dehors sous un grillage, sinon les mulots le videront.",
    supportNotes: {
      "hazel-dormouse":
        "Le muscardin tire son nom de cette plante en anglais, en allemand et en latin, et c'est sur les noisettes qu'il engraisse avant d'hiberner. Une noisette ouverte par un muscardin porte un trou rond et lisse, avec des marques de dents inclinées autour du bord — le moyen de savoir qu'il est là.",
      "eurasian-jay":
        "Le geai emporte les noisettes et les enterre une à une, et celles qu'il oublie sont la façon dont un noisetier se plante ailleurs.",
      "mason-bees":
        "Les chatons de janvier sont le tout premier pollen de l'année dans l'est, par un après-midi doux où presque rien ne vole.",
    },
  },
  "Rubus fruticosus agg.@france-continental": {
    nativeNote:
      "Non pas une espèce mais un essaim de centaines, que les botanistes traitent comme un groupe — la ronce de chaque talus de haie, de chaque lisière et de chaque coin laissé à l'abandon dans l'est de la France.",
    careNote:
      "La plante la plus utile à la faune que la plupart des jardins possèdent déjà et ne cessent d'arracher. Elle s'enracine partout où la pointe d'une tige touche le sol : donnez-lui une limite que vous acceptez de lui céder — un talus, le pied d'une haie, le fond d'un coin en friche. Coupez à la base chaque hiver les tiges qui ont fructifié, et elle reste productive et praticable au lieu de devenir un buisson impénétrable.",
    givesNote:
      "Presque rien ici ne fait plus. Des mois de fleurs butinées par les bourdons, les abeilles solitaires, les syrphes et plus d'espèces de papillons qu'aucune autre plante de la région ; des mûres dès août pour les fauvettes, les grives, les renards et les blaireaux ; un fourré épineux qui est le couvert de nidification le plus sûr qu'un petit oiseau puisse trouver ; et des tiges mortes où nichent les abeilles solitaires.",
    propagationNote:
      "Elle fait le travail : trouvez en hiver une pointe de tige enracinée, coupez-la et déplacez-la. Les boutures nues d'hiver s'enracinent aussi. La graine, c'est une saison perdue.",
    supportNotes: {
      "bumble-bees":
        "Des mois de fleurs ouvertes, et une ronce en juillet porte à la fois plus d'insectes que n'importe quoi d'autre au jardin — bourdons, abeilles solitaires, syrphes et coléoptères.",
      "green-hairstreak":
        "Le papillon vert le plus commun d'Europe pond sur la ronce parmi les autres arbustes des terrains vagues, et se pose ailes fermées sur un talus ensoleillé, exactement semblable à une feuille.",
      "hazel-dormouse":
        "Les muscardins parcourent les ronces pour les fruits en fin d'été et se déplacent le long des tiges : une haie avec des ronces est un couloir, une haie taillée est un mur.",
      "blackcaps-warblers":
        "Les mûres sont ce qui fait prendre du poids à une fauvette avant son départ vers le sud, et le fourré épineux est l'endroit où elle a niché en juin.",
      "winter-thrushes":
        "Litornes et mauvis nettoient ce qui reste de fruits à leur arrivée du nord en octobre.",
    },
  },
  "Calluna vulgaris@france-continental": {
    nativeNote:
      "La lande basse et pourpre des sables acides et des pinèdes claires de tout l'est — les landes des Vosges, la Sologne, les terres pauvres que personne n'a jamais labourées.",
    careNote:
      "Le sol acide n'est pas négociable — sur la craie ou dans un jardin chaulé elle jaunit et meurt, et aucun engrais n'y change rien. Plein soleil, sol sableux et pauvre, aucun engrais du tout. Tondez-la légèrement juste après la floraison pour la garder dense ; laissée à elle-même, elle s'ouvre et se dégarnit au centre au bout de cinq ou six ans. C'est ce que le feu et le pâturage empêchaient sur une vraie lande.",
    givesNote:
      "Elle fleurit de juillet jusqu'en octobre, et c'est tout l'intérêt : la fin de l'été et le début de l'automne sont un creux, au moment où les abeilles cherchent à faire leurs réserves pour l'hiver, et c'est la callune qui leur fait passer ce cap. Abeilles domestiques, bourdons et toute une série d'abeilles solitaires la butinent, et elle nourrit en plus une longue liste de chenilles de papillons de nuit — les papillons de nuit des landes sont ceux de la callune.",
    propagationNote:
      "Prélevez en fin d'été des pointes de pousses semi-aoûtées et enracinez-les dans un mélange tourbeux, graveleux et sans calcaire. Les branches basses se marcottent aussi là où elles touchent un sol acide — fixez-en une au sol et séparez-la un an plus tard.",
    supportNotes: {
      "silver-studded-blue":
        "L'azuré de l'Ajonc vit dans les landes et nulle part ailleurs, pond sur la callune, et ses chenilles sont soignées sous terre par des fourmis qui les traient pour leur sucre — perdez la lande et vous perdez tout l'arrangement.",
      "emperor-moth":
        "Le petit paon de nuit est avant tout un insecte des landes, et c'est d'ordinaire sur la callune qu'on trouve ses chenilles vertes cerclées de noir.",
      "bumble-bees":
        "La callune fleurit de juillet à octobre, précisément le creux où une colonie de bourdons tente d'élever les reines de l'année suivante, quand tout le reste a fini.",
    },
  },
  "Deschampsia cespitosa@france-continental": {
    nativeNote:
      "La grosse touffe sombre des prairies humides, des layons forestiers mouillés et des terres lourdes de tout l'est, qui lance en juin une brume de tiges fleuries où s'accroche chaque soleil bas.",
    careNote:
      "Il lui faut un sol qui reste frais — argile lourde, coin bas, bord de mare — et elle accepte la mi-ombre, ce que la plupart des graminées de cette taille refusent. Ses touffes sont persistantes : il reste quelque chose l'hiver. En fin d'hiver, peignez les feuilles mortes d'une main gantée plutôt que de la couper ; les tiges fleuries peuvent rester debout jusque-là.",
    givesNote:
      "Les graminées portent bien plus de chenilles que les jardiniers ne le pensent, et les myrtils, les tristans et les hespéries d'un pré humide grandissent sur des touffes comme celle-ci. Une grosse touffe est aussi un petit monde à elle seule — là où carabes, araignées et insectes en hivernage attendent la fin du froid, et où un troglodyte ou un campagnol circule à couvert.",
    propagationNote:
      "Divisez une touffe à la bêche au début du printemps. La graine est fine et a besoin de lumière — répandez-la sur une terre nue et humide et appuyez sans la couvrir.",
    supportNotes: {
      "grass-skippers":
        "Myrtils, tristans et hespéries élèvent tous leurs chenilles sur des touffes de graminées comme celle-ci, chaque chenille cachée dans une feuille qu'elle a cousue derrière elle.",
    },
  },
  "Hedera helix@france-continental": {
    pioneerNote:
      "La seule réponse à un mur nu exposé au nord et à l'ombre sèche sous une haie ; il part d'une fissure et fleurit tard, pour les insectes d'automne.",
    nativeNote:
      "Indigène ici et partout dans l'est — sur le tronc des vieux chênes, par-dessus les murs de jardin, le long du pied ombragé de chaque haie — et la dernière plante de toute la région encore en fleur en novembre.",
    careNote:
      "Donnez-lui un mur, une clôture ou une souche, et coupez-le de tout ce dont vous voulez garder la forme. Il s'accroche par des crampons semblables à des racines qui marquent l'enduit : mettez-le sur de la pierre ou sur un support qui ne craint rien. Et une correction utile, car elle fait arracher du lierre des arbres chaque année : **le lierre n'est pas un parasite et n'étrangle pas un arbre en bonne santé** — il grimpe et s'accroche, rien de plus. Il ne fleurit qu'une fois devenu adulte et buissonnant en hauteur : ne le tondez donc pas tous les ans, ou vous perdez la partie qui compte.",
    givesNote:
      "La plante d'automne la plus précieuse d'Europe. Ses fleurs s'ouvrent en octobre et novembre, quand tout le reste a fini, et nourrissent syrphes, guêpes, vulcains et citrons tardifs, et la collète du lierre — une abeille solitaire dont toute l'année est bâtie autour de cette seule plante. Puis des baies noires en fin d'hiver pour les fauvettes à tête noire, les grives et les pigeons ramiers, et un couvert persistant où les oiseaux nichent et dorment toute l'année.",
    propagationNote:
      "Les pousses semi-aoûtées s'enracinent sans peine en fin d'été dans un mélange graveleux, à l'ombre. Une bouture prise sur la partie adulte et buissonnante donne un arbuste qui fleurit bien plutôt qu'une grimpante — un choix à faire exprès.",
    supportNotes: {
      "mason-bees":
        "La collète du lierre est une abeille des sables dont toute l'année est réglée sur cette plante : elle sort en septembre quand le lierre s'ouvre et a fini quand les fleurs ont fini. Rien d'autre qui lui convienne n'est ouvert à ce moment-là.",
      "holly-blue":
        "L'azuré des nerpruns alterne entre deux plantes au fil de ses deux générations annuelles — le houx au printemps, les boutons du lierre en fin d'été. Un jardin qui veut garder le papillon a besoin des deux.",
      "red-admiral":
        "Les vulcains se pressent sur les fleurs de lierre en octobre, et ce sont souvent les derniers papillons que l'on voit avant l'hiver.",
      "winter-thrushes":
        "Les baies de lierre mûrissent en fin d'hiver, longtemps après que tout le reste a disparu, et c'est ce qui permet aux grives et aux pigeons ramiers de passer février.",
      "blackcaps-warblers":
        "Les fauvettes à tête noire qui restent désormais l'hiver au lieu de partir vers le sud dépendent beaucoup de cette récolte tardive.",
    },
  },
  "Plantago lanceolata@france-continental": {
    pioneerNote:
      "Il tient le sol tassé et fauché d'un accotement ou d'un bord de cour, et il y nourrit les chenilles de plusieurs mélitées.",
    nativeNote:
      "La rosette nervurée de chaque chemin, chaque pelouse et chaque prairie de l'est — si ordinaire que personne ne la plante exprès, et l'une des plantes les plus mangées par les chenilles en Europe.",
    careNote:
      "Il pousse dans n'importe quoi, supporte la tonte et le piétinement, et se ressème un peu partout : sa place est dans l'herbe haute et en bord d'allée, pas dans un massif. La façon honnête de l'avoir est de cesser de l'arracher et de laisser une tache s'installer dans la pelouse. Son pollen est porté par le vent : il donne le rhume des foins à certaines personnes.",
    givesNote:
      "Ce sont les chenilles qui comptent : le plantain en nourrit une longue liste, et dans cette région cela inclut la mélitée du Plantain et la mélitée du mélampyre, dont les jeunes passent l'hiver serrés ensemble dans une toile de soie sur ces feuilles. Chardonnerets et linottes dépouillent les épis de graines à partir de la fin de l'été.",
    propagationNote:
      "Répandez la graine sur une terre nue à l'automne et tassez-la du pied. Les touffes se divisent à tout moment de la saison fraîche.",
    supportNotes: {
      "glanville-fritillary":
        "La mélitée du Plantain pond ses œufs en un seul lot sur le plantain lancéolé, et les chenilles passent tout l'hiver ensemble dans une toile de soie tissée sur la plante — c'est pourquoi une fauche d'automne emporte toute la nichée.",
      "goldfinches-linnets":
        "Chardonnerets et linottes dépouillent les épis de graines à partir de la fin de l'été, une tête après l'autre le long d'un bord de chemin.",
    },
  },
  "Galium verum@france-continental": {
    nativeNote:
      "L'écume jaune et basse des pelouses sèches, des talus de route et des vieilles emprises de voie ferrée de tout l'est — au parfum de miel au soleil, et sentant le foin frais une fois coupée.",
    careNote:
      "Terrain pauvre et sec, plein soleil ; il court par la racine à travers l'herbe, exactement ce qu'il doit faire dans une prairie ou sur un talus sec, et exactement ce qu'il ne doit pas faire dans un massif bien tenu. Rabattez-le après la floraison. On en bourrait vraiment les matelas, et il sent vraiment le foin en séchant.",
    givesNote:
      "C'est là que grandit le moro-sphinx : ce papillon de nuit qui vole de jour et qu'on prend pour un minuscule colibri devant les fleurs pond sur le gaillet, tout comme le grand sphinx de la vigne, dont l'énorme chenille grise à faux yeux s'y montre en fin d'été. Les fleurs nourrissent pendant des mois les petites abeilles, les syrphes et les coléoptères.",
    propagationNote:
      "Déterrez un morceau enraciné de la tige rampante pendant la saison fraîche. La graine semée fraîche à l'automne sur un sol graveleux lève au cours de l'hiver.",
    supportNotes: {
      "hummingbird-hawk-moth":
        "Le papillon de nuit qui vole de jour et que tout le monde prend pour un minuscule colibri pond sur le gaillet — une tache dans l'herbe haute fait donc d'un visiteur un résident.",
      "elephant-hawk-moth":
        "La chenille grise du grand sphinx de la vigne, avec les faux yeux qu'elle gonfle quand on l'inquiète, mange le gaillet et l'épilobe en fin d'été.",
    },
  },
  "Fragaria vesca@france-continental": {
    nativeNote:
      "La petite fraise des bois des lisières, des talus et des vieux murs de tout l'est — elle court partout sur des fils rouges, et vaut qu'on s'arrête en juin.",
    careNote:
      "Mi-ombre et un sol qui ne cuit pas — le pied d'une haie, sous un arbuste, le côté ombragé d'une allée. Elle s'étend par stolons en un tapis bas et dense qui tient les mauvaises herbes à distance, et elle ira plus loin que prévu, ce qui sous une haie est une qualité. Tondez-la en fin d'hiver pour la rajeunir. Le fruit est petit, intense, et à lui seul vaut qu'on la cultive.",
    givesNote:
      "Des fleurs blanches et ouvertes tout au long d'un long printemps pour les petites abeilles solitaires et les syrphes, à qui les fleurs plus profondes ne servent à rien, puis des fruits que prennent oiseaux, mulots et muscardins. Au jardin, c'est le tapis lui-même qui compte : un couvert au ras du sol, là où vivent coléoptères, araignées et insectes en hivernage.",
    propagationNote:
      "La plante le fait pour vous : pendant la saison fraîche, détachez les petits plants enracinés au bout des stolons et coupez le fil. La graine marche aussi, plus lentement.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches ouvertes tout au long d'un long printemps, assez peu profondes pour les plus petites abeilles solitaires et les syrphes — ce que ne sont pas les fleurs profondes des jardins.",
      "hazel-dormouse":
        "Le muscardin prend les fraises des bois là où les stolons atteignent le pied d'une haie, avec tout ce qui est tendre et sucré dans un été de haie.",
      "blackcaps-warblers":
        "Fauvettes, rougegorges et merles prennent tous ce fruit à même la strate basse, l'une des rares récoltes à leur niveau.",
    },
  },
  "Dryopteris filix-mas@france-continental": {
    nativeNote:
      "La grande fougère la plus commune des bois, des talus de haie et des murs ombragés de l'est — un volant net de frondes, et l'une des plantes sauvages de France les plus faciles à cultiver exprès.",
    careNote:
      "De l'ombre et un sol qui garde un peu d'humidité, et ensuite elle est à peu près aussi increvable qu'une fougère peut l'être — une fois installée, elle supporte même l'ombre sèche sous un hêtre, ce que très peu de plantes acceptent. Coupez à la base les frondes de l'an passé en fin d'hiver, juste avant que les nouvelles se déroulent. Toxique si on la mange, ce qui compte dans un jardin avec un chien qui mâchonne.",
    givesNote:
      "Les fougères ne nourrissent presque aucune chenille, et il serait malhonnête de prétendre le contraire. Ce que celle-ci apporte, c'est de la structure et de l'abri là où un jardin n'a d'habitude ni l'un ni l'autre : la souche tient un talus ombragé, les frondes gardent le sol humide tout l'été, et c'est là que coléoptères, araignées, crapauds et tritons passent les mois secs.",
    propagationNote:
      "Divisez une vieille souche au printemps, en gardant sur chaque morceau plusieurs frondes et une poignée de racines. Par les spores, laissez un jour un morceau de fronde mûre dans une enveloppe de papier, répandez la poussière tombée sur un terreau stérilisé humide, sous couvercle, et gardez-le au frais et à mi-ombre pendant des mois.",
  },
  "Asplenium scolopendrium@france-continental": {
    pioneerNote:
      "Elle pousse dans le vieux mortier à l'ombre — un joint de mur, un puits, le côté ombragé d'un pont — et garde ses frondes en lanières tout l'hiver.",
    nativeNote:
      "La fougère qui ne ressemble à aucune fougère — des frondes entières, luisantes, en forme de lanière, sur le calcaire ombragé, les parois de puits et le pied humide des haies de tout l'est.",
    careNote:
      "Ombre profonde, du calcaire dans le sol, et de l'humidité — le côté nord d'un mur, un coin ombragé près d'un drain, le fond d'un puits. Elle est persistante et garde donc un coin sombre vert tout l'hiver, et elle ne veut rien des conditions acides que la fougère mâle tolère. Ne la laissez pas sécher pendant ses deux premiers étés. Ne coupez que les frondes vraiment brunies.",
    givesNote:
      "Un couvert persistant dans le coin le plus sombre et le plus humide d'un jardin — le seul endroit où rien d'autre ne pousse et où s'abrite pourtant une vie étonnante. Coléoptères, cloportes, araignées, crapauds et tritons profitent tous du dessous humide d'une touffe de fougère, et elle tient le sol d'un talus ombragé sous les pluies d'hiver. Comme toute fougère, elle nourrit directement très peu d'insectes.",
    propagationNote:
      "Les spores se sèment sur un terreau stérilisé humide, sous couvercle, au frais et à mi-ombre — d'abord une pellicule verte, des fougères des mois plus tard. Les vieilles souches se divisent au printemps.",
  },
};
