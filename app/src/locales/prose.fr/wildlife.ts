// The animals — `data/wildlife.ts`.
//
// One blurb per animal: the "what it is and why it matters" paragraph the
// wildlife cards and the animal pages show. Not regional, which is why they are
// together here — the pool is one, and every region draws from it.
//
// **Keyed the way `lib/prose.ts` looks them up**: on `latin` when the row has
// one, and on `#<id>` for the handful of informal groups Indigene named itself
// ("Jays, turkeys & woodpeckers"). Three rows carry a *pseudo*-latin — a list of
// genera rather than a binomial (`Osmia, Andrena spp.`) — and those key on that
// string, because that is what `keyFor()` in `lib/names.ts` prefers too.
//
// Fifteen of these animals have no French name in `taxa.fr.ts`, so the card above
// the blurb shows their scientific name and the blurb says nothing different. We
// don't coin vernaculars: see the note at the top of `taxa.fr.ts`.
import type { ProseTable } from "../../lib/prose";

export const WILDLIFE_FR: ProseTable = {
  // -------------------------------------------------------------------------
  // Papillons de jour — Amérique du Nord.
  // -------------------------------------------------------------------------
  "Danaus plexippus": {
    blurb:
      "Le célèbre migrateur orange et noir. Ses chenilles ne peuvent manger qu'une seule chose — l'asclépiade — si bien que pas d'asclépiade veut dire pas de monarques, un point c'est tout. Les adultes refont aussi le plein sur de nombreuses fleurs d'automne pendant leur long trajet vers le sud.",
  },
  "Danaus gilippus": {
    blurb:
      "Le cousin méridional du monarque, d'un acajou profond, commun toute l'année en Floride. Comme le monarque, ses chenilles ne se nourrissent que d'asclépiades.",
  },
  "Papilio polyxenes": {
    blurb:
      "Un grand papillon sombre à queues dont les chenilles mangent des plantes de la famille de la carotte — y compris le zizia doré indigène, et pas seulement le persil du jardin.",
  },
  "Papilio glaucus": {
    blurb:
      "Le grand papillon à queues jaune et noir des jardins de l'est. Ses chenilles grandissent sur les feuilles de plusieurs arbres indigènes, surtout le cerisier sauvage et le bouleau.",
  },
  "Limenitis archippus": {
    blurb:
      "Le sosie du monarque — mais ses chenilles grandissent sur les saules, les peupliers et les cerisiers, et passent l'hiver roulées dans une feuille qu'elles attachent au rameau.",
  },
  "Agraulis vanillae": {
    blurb:
      "Un papillon orange éclatant au revers des ailes constellé d'argent. Ses chenilles ne se nourrissent que de lianes de passiflore.",
  },
  "Heliconius charithonia": {
    blurb:
      "Le papillon emblème de la Floride — de longues ailes noires rayées de jaune pâle, flottant lentement dans les coins ombragés. Ses chenilles ne mangent que des passiflores ; les adultes ont ceci d'inhabituel qu'ils mangent du pollen, ce qui leur permet de vivre des mois.",
  },
  "Eumaeus atala": {
    blurb:
      "Un petit bijou — noir de velours moucheté de bleu irisé, avec un ventre écarlate — qu'on a cru éteint en Floride. Il est revenu avec sa seule plante hôte indigène, la Zamia integrifolia. Planter cette Zamia, c'est reconstruire ce papillon au sens le plus littéral.",
  },
  "Anartia jatrophae": {
    blurb:
      "Un papillon pâle au vol bas des clairières ensoleillées et humides de Floride. Ses chenilles se nourrissent de Stachytarpheta et de bacopa.",
  },
  "Papilio rutulus": {
    blurb:
      "Le grand papillon à queues jaune des jardins et des bords de cours d'eau de l'Ouest, de la Colombie-Britannique à San Diego. Ses chenilles se nourrissent des feuilles de saules, de peupliers, de platanes et de l'érable à grandes feuilles.",
  },
  "Papilio eurymedon": {
    blurb:
      "Un papillon à queues crème et noir des pentes plus sèches de l'Ouest. Ses chenilles grandissent sur l'holodisque et les céanothes.",
  },
  "Erynnis propertius": {
    blurb:
      "Une petite hespérie brune du pays des chênes de l'Ouest — les prairies à chêne de Garry au nord, les boisements de chêne vert de Californie au sud. Ses chenilles ne mangent que du chêne, et elle s'efface à mesure que ces habitats s'effacent.",
  },
  "Vanessa virginiensis": {
    blurb:
      "Un papillon orange et noir portant au revers deux gros ocelles bleus. Ses chenilles mangent les immortelles et les antennaires, en se cachant dans les feuilles laineuses et leur propre soie.",
  },
  "Vanessa atalanta": {
    blurb:
      "Des ailes noires barrées d'une bande écarlate, et une hardiesse inhabituelle — il se pose volontiers sur un bras. Ses chenilles vivent repliées à l'intérieur d'une feuille d'ortie cousue de soie, ce qui fait qu'un coin d'orties laissé sur pied vaut bien plus qu'il n'en a l'air.",
  },
  "Epargyreus clarus": {
    blurb:
      "Une grande hespérie brune portant sous chaque aile postérieure une tache argentée qui lance des éclairs en vol. Elle se nourrit vite et souvent, et ses chenilles grandissent sur les légumineuses indigènes, à l'intérieur d'une feuille qu'elles replient sur elles-mêmes.",
  },
  "Papilio troilus": {
    blurb:
      "Un papillon à queues sombre, poudré de bleu-vert, chez lui partout où poussent le benjoin et le sassafras. Sa chenille est l'une des choses les plus étranges d'un jardin de l'est : vert vif, avec deux énormes faux yeux, cachée le jour dans une feuille qu'elle a roulée en tube.",
  },
  "Limenitis lorquini": {
    blurb:
      "Un papillon noir à bande blanche et bouts d'ailes orange, avec l'habitude de venir à votre rencontre. Il chasse un oiseau, ou une personne, hors de son bout de berge, puis revient planer jusqu'au même rameau.",
  },
  "Papilio zelicaon": {
    blurb:
      "Le machaon jaune et noir des coteaux californiens, qu'on voit souvent tournoyer au sommet d'une colline — les mâles s'y rassemblent pour attendre les femelles. Ses chenilles mangent des plantes de la famille de la carotte et se dressent pour brandir une corne orange fourchue quand quelque chose les dérange.",
  },
  "#grass-skippers": {
    blurb:
      "Les petites hespéries orange qui filent à travers une prairie, et les satyres et tristans brun tendre qui y volent mollement. Leurs chenilles mangent des graminées et des laîches, et elles passent l'hiver blotties au fond d'une graminée indigène en touffe.",
  },
  "Argynnis spp.": {
    blurb:
      "Les grands papillons orange des prés de l'Ouest, au revers constellé d'argent. Chacun grandit sur les violettes et sur rien d'autre — et la femelle pond en fin d'été, sur un sol sec où les violettes ont déjà disparu, pour des chenilles qui dorment tout l'hiver avant de manger.",
  },
  "Callophrys mossii": {
    blurb:
      "Un petit papillon gris-brun, facile à dépasser sans le voir, qui vole aux premières semaines douces du printemps autour des affleurements rocheux, des talus de route et des falaises. Ses chenilles mangent les orpins indigènes et à peu près rien d'autre : il vit donc exactement là où vit l'orpin — une pellicule de terre sur du rocher — et nulle part entre les deux.",
  },
  "Icaricia, Callophrys & others": {
    blurb:
      "Les petits papillons des terrains chauds et secs — des azurés grands comme un ongle, et des théclas verts qu'on prend pour des papillons de nuit. Toute une série d'entre eux élèvent leurs chenilles sur les sarrasins sauvages indigènes, plusieurs sur rien d'autre : quelques pieds sur un talus pauvre et ensoleillé valent donc plus qu'un massif de fleurs à nectar.",
  },
  "Nymphalis antiopa": {
    blurb:
      "Un papillon chocolat foncé bordé d'un crème déchiqueté, avec une ligne de taches bleues à l'intérieur de la bordure. C'est souvent le premier papillon de l'année ici, parce qu'il n'est allé nulle part : il passe l'hiver adulte derrière une écorce décollée et sort avant qu'une seule fleur ne soit ouverte. Ses chenilles se nourrissent de saule, de peuplier et de bouleau.",
  },

  // -------------------------------------------------------------------------
  // Papillons de jour — Europe.
  // -------------------------------------------------------------------------
  "Anthocharis cardamines": {
    blurb:
      "Le mâle porte des bouts d'ailes orange vif et ne se confond avec rien ; la femelle n'en a pas et se fait prendre pour une piéride tout le printemps. Tous deux se posent ailes fermées, et le revers marbré de vert les efface contre un capitule — précisément là où la femelle est en train de pondre.",
  },
  "Gonepteryx rhamni": {
    blurb:
      "Le grand papillon jaune citron qui est, dans la plus grande partie de la France, le premier que chacun voie chaque année. Il passe l'hiver adulte — ailes fermées et exactement en forme de feuille, blotti dans du lierre ou du houx — et ses chenilles ne mangent que des nerpruns.",
  },
  "Gonepteryx cleopatra": {
    blurb:
      "La sœur méridionale du citron — le même jaune citron, avec un éclat orangé en travers de l'aile antérieure. Souvent la première chose à voler dans un février du Midi, parce que les adultes dorment tout l'hiver. Comme le citron, ses chenilles ne mangent que des nerpruns.",
  },
  "Favonius quercus": {
    blurb:
      "Un petit papillon qui vit toute sa vie à la cime d'un chêne. Il boit le miellat que les pucerons laissent sur les feuilles plutôt que de visiter les fleurs, si bien que presque personne ne le remarque — levez les yeux sous un grand chêne par un soir calme de juillet.",
  },
  "Apatura iris": {
    blurb:
      "Un grand papillon forestier dont les mâles brûlent d'un violet électrique sous un angle et sont brun uni sous le suivant. Il passe ses journées à la cime des plus grands arbres et ignore complètement les fleurs, ne descendant que pour le sol humide et la sève qui suinte. Sa chenille passe l'hiver aplatie contre un rameau de saule marsault, exactement de la couleur de l'écorce.",
  },
  "Celastrina argiolus": {
    blurb:
      "Le papillon bleu argenté pâle qui vole haut autour d'une haie ou d'un mur en avril, des semaines avant tout autre azuré. Ses deux générations utilisent des plantes différentes — le houx au printemps, le lierre en été — c'est pourquoi il réussit en ville.",
  },
  "Hamearis lucina": {
    blurb:
      "Un petit papillon damé d'orange et de brun qui ressemble à un nacré en miniature sans en être un — c'est le seul représentant européen d'une famille par ailleurs tropicale. Il a reculé à mesure que les prairies étaient nettoyées, et il est exigeant : les femelles ne pondent que sur les primevères.",
  },
  "Charaxes jasius": {
    blurb:
      "Le plus grand papillon d'Europe et celui qui a l'air le plus tropical — brun à bordure orange, avec deux queues à chaque aile postérieure. Il vit dans le maquis méridional, se nourrit de fruits tombés plutôt que de fleurs, et ses chenilles ne mangent qu'une seule plante : l'arbousier.",
  },
  "Libythea celtis": {
    blurb:
      "Un petit papillon brun aux ailes découpées en échancrures vives et au long museau, si bien qu'un individu posé ressemble exactement à une feuille morte sur un rameau. C'est l'un des papillons les plus longévifs d'Europe — près d'un an à l'état adulte — et ses chenilles ne mangent que le micocoulier de Provence.",
  },
  "Polygonia c-album": {
    blurb:
      "Aux bords déchiquetés et orange, avec une petite virgule blanche au revers. Il passe l'hiver adulte sur un rameau, où sa découpe déchirée en fait une feuille morte. Ses chenilles grandissent sur le houblon, l'ortie et l'orme.",
  },
  "Polyommatus icarus": {
    blurb:
      "Le petit papillon bleu-violet de toutes les prairies et de tous les bords de route de France — le mâle bleu vif, la femelle brune à taches orange. Ses chenilles mangent le lotier corniculé et ses parents, et les fourmis les gardent souvent pour les gouttes sucrées qu'elles exsudent.",
  },
  "Phengaris arion": {
    blurb:
      "Un papillon protégé à l'une des vies les plus étranges d'Europe. Sa chenille mange du serpolet quelques semaines, puis tombe au sol et est emportée dans une fourmilière de fourmis rouges, où elle passe dix mois à manger le couvain de ses hôtes.",
  },
  "Cupido minimus": {
    blurb:
      "L'un des plus petits papillons d'Europe — brun suie, de la taille d'un ongle, saupoudré de bleu. Ses chenilles vivent à l'intérieur des capitules d'anthyllide vulnéraire, en mangeant les graines en formation, et en Grande-Bretagne et en Irlande elles n'utilisent aucune autre plante.",
  },
  "Lycaena phlaeas": {
    blurb:
      "Un petit papillon de la couleur d'une pièce neuve — ailes antérieures orange bruni, bordées de brun sombre. Il choisit une pierre chaude et y revient tout l'après-midi, se lançant sur tout ce qui passe. Ses chenilles mangent les oseilles et les patiences : il appartient aux coins en friche plutôt qu'aux massifs nets.",
  },
  "Satyrium w-album": {
    blurb:
      "Un petit papillon sombre portant un mince W blanc griffonné en travers du revers de l'aile, d'où son nom. Il vit à la cime d'un orme et descend si rarement que la plupart des gens n'apprennent jamais qu'il est là. Il a chuté avec les ormes, et il ne revient que là où ils reviennent.",
  },
  "Callophrys rubi": {
    blurb:
      "Le papillon vert le plus commun d'Europe — et il ne vous montre jamais le dessus de ses ailes. Il se repose ailes fermées, et le revers vert feuille vif le fait disparaître contre un arbuste à l'instant où il se pose. Cherchez sur une lande ensoleillée en avril.",
  },
  "Plebejus argus": {
    blurb:
      "Un petit papillon bleu des landes ouvertes, nommé pour les minuscules paillettes métalliques de son revers d'aile. Toute sa vie passe par une fourmi : les fourmis noires boivent le liquide sucré que la chenille exsude et, en retour, la transportent et la gardent. Il lui faut donc la callune, les fourmis, et le sol nu et chaud où elles nichent.",
  },
  "Melitaea cinxia": {
    blurb:
      "Un papillon damé d'orange et de noir des herbages chauds et en friche, au mieux près de la côte atlantique. Ses chenilles vivent en famille : elles éclosent ensemble sur le plantain lancéolé, tissent une tente de soie commune et y passent l'hiver serrées les unes contre les autres.",
  },

  // -------------------------------------------------------------------------
  // Papillons de nuit.
  // -------------------------------------------------------------------------
  "Actias luna": {
    blurb:
      "Le géant vert pâle à longues queues qui semble trop beau pour être vrai. Les adultes ne mangent jamais — ils vivent une semaine environ sur les réserves que la chenille a accumulées en mangeant des feuilles d'arbres comme le bouleau, le noyer et le caryer.",
  },
  "Hyalophora cecropia": {
    blurb:
      "Le plus grand papillon de nuit indigène d'Amérique du Nord — un géant de la taille d'une main, barré de rouge. Ses chenilles s'engraissent sur le cerisier, l'érable et le bouleau avant de filer un cocon papyracé pour l'hiver.",
  },
  "Hemaris thysbe": {
    blurb:
      "Un papillon de nuit trapu et diurne qui fait du surplace devant les fleurs exactement comme un minuscule colibri, si bien que presque personne ne devine que c'est un papillon de nuit. Ses chenilles se nourrissent de viornes et de chèvrefeuilles ; les adultes butinent le nectar des fleurs tubulaires.",
  },
  "Sphinx ligustri": {
    blurb:
      "L'un des plus grands sphinx de France — barré de rose et de noir, grand comme une paume — qui vole au crépuscule et fait du surplace devant les fleurs parfumées. Sa chenille est tout aussi saisissante : énorme, vert vif, rayée de lilas, avec une corne au bout de la queue, nourrie de troène.",
  },
  "Zygaena filipendulae": {
    blurb:
      "Un papillon de nuit diurne, bleu-noir luisant à six taches écarlates, qui vole mollement au-dessus des prairies d'été. Il n'a rien à craindre : il fabrique du cyanure à partir du lotier corniculé que mangent ses chenilles, et tout le monde le sait.",
  },
  "Laothoe populi": {
    blurb:
      "Le grand sphinx le plus commun de France, et le plus étrange au repos : il tient ses ailes postérieures en avant des antérieures. Posé sur un mur, il se lit comme une feuille morte grise mal remontée. L'adulte ne mange jamais : tout ce qu'il lui faut, il l'a pris chenille, sur des feuilles de peuplier et de saule.",
  },
  "Deilephila elpenor": {
    blurb:
      "Rose et vert olive, comme venu d'un pays bien plus chaud, en surplace devant un chèvrefeuille à la nuit tombée. C'est la chenille qui lui donne son nom : grosse, gris-brun, aussi longue qu'un doigt, avec un museau en trompe qu'elle rentre quand on la touche — ce qui gonfle quatre ocelles et en fait un petit serpent.",
  },
  "Macroglossum stellatarum": {
    blurb:
      "Le papillon que tout le monde a vu et que presque personne ne croit : il butine en plein jour, en surplace, et se fait signaler chaque été comme un bébé colibri. Sa trompe est plus longue que son corps, et il revient sur un beau massif de fleurs à la même heure le lendemain.",
  },
  "Saturnia pavonia": {
    blurb:
      "Le bombyx de la lande — gris tendre et rose, avec un gros ocelle sur chacune de ses quatre ailes. Le mâle vole vite dans le soleil d'avril sur des antennes plumeuses qui captent l'odeur d'une femelle à un kilomètre ; elle ne vole que la nuit.",
  },

  // -------------------------------------------------------------------------
  // Abeilles.
  // -------------------------------------------------------------------------
  "Bombus spp.": {
    blurb:
      "Les grosses abeilles velues qui volent par temps froid et tôt dans l'année. Elles secouent le pollen en frissonnant de leurs muscles de vol, ce dont certaines fleurs indigènes dépendent. Elles nichent dans le sol et dans les vieilles touffes d'herbe, et une succession de fleurs du printemps aux gelées nourrit une colonie.",
  },
  "Andrena, Melissodes & others": {
    blurb:
      "Des dizaines d'abeilles indigènes ne récoltent leur pollen que sur la famille des astéracées — asters, échinacées, verges d'or, tournesols. Si ces plantes disparaissent d'un jardin, ces abeilles n'ont plus rien d'autre pour élever leurs jeunes, quel que soit le nombre d'autres fleurs en fleur.",
  },
  "Osmia, Andrena spp.": {
    blurb:
      "Des abeilles solitaires douces et très précoces — d'excellentes pollinisatrices d'arbres fruitiers — qui émergent quand les premiers arbustes indigènes fleurissent. Une fleur précoce comme le groseillier sanguin ou le saule est une bouée de sauvetage la semaine où elles se réveillent.",
  },
  "Xylocopa virginica": {
    blurb:
      "La grosse abeille au dos luisant, comme un bourdon avec une plaque chauve. Elle niche dans le bois mort plutôt que dans le sol, et elle est assez forte pour ouvrir des fleurs que la plupart des abeilles ne peuvent pas — ou pour en percer la base quand l'une est trop profonde même pour elle.",
  },

  // -------------------------------------------------------------------------
  // Oiseaux.
  // -------------------------------------------------------------------------
  "Archilochus colubris": {
    blurb:
      "Le seul colibri nicheur de l'Est, attiré par les fleurs tubulaires rouges et orange qu'il peut atteindre et que la plupart des insectes ne peuvent pas. Une succession de ces floraisons, du printemps à l'automne, alimente à la fois la nidification et la longue migration.",
  },
  "Calypte anna, Selasphorus rufus": {
    blurb:
      "Les colibris de jardin de l'Ouest. Le colibri roux cale sa migration sur l'entrée en fleur des groseilliers indigènes : une fleur rouge précoce est du carburant qui arrive quand il le faut.",
  },
  "Bombycilla cedrorum": {
    blurb:
      "Un oiseau élégant et sociable qui vit de fruits et vagabonde en bandes, dépouillant un amélanchier ou un cornouiller en une après-midi. Ce sont les arbustes à baies qui gardent leurs fruits jusqu'en hiver qui les retiennent dans les environs.",
  },
  "Sitta pusilla": {
    blurb:
      "Une toute petite sittelle grise et brune qui couine comme un canard en plastique et passe sa vie entière dans les pins du sud des États-Unis. C'est l'un des très rares oiseaux à se servir d'un outil : elle ramasse un éclat d'écorce et s'en sert de levier pour en décoller d'autres et atteindre les insectes en dessous.",
  },
  "Psaltriparus minimus": {
    blurb:
      "Un bout d'oiseau gris, à peu près aussi lourd que cinq trombones, qui circule en bandes bavardes d'une vingtaine et retourne un arbuste de l'intérieur. Son nid est une chaussette suspendue de lichen et de soie d'araignée, longue de trente centimètres, que le couple met un mois à construire.",
  },
  "Spinus psaltria": {
    blurb:
      "Un tout petit fringille au dos noir et au ventre citron, qui vit presque uniquement de graines — y compris celles des sauges et des tournesols dont déborde une bordure de jardin sec. Laissez les fleurs fanées sur pied et il trouvera leurs graines.",
  },
  "Spinus tristis": {
    blurb:
      "Le « canari sauvage » jaune vif qui niche tard, en été, pour pouvoir nourrir ses jeunes des graines d'asters et d'échinacées indigènes. Laisser les fleurs fanées sur pied tout l'automne et l'hiver, c'est remplir son garde-manger d'hiver.",
  },
  "Setophaga coronata": {
    blurb:
      "La seule paruline capable de digérer les fruits cireux du myrte cirier, ce qui lui permet d'hiverner bien plus au nord — et dans tout le Sud-Est — que les autres parulines. Le Morella cerifera est la plante derrière ce tour de force (son ancien nom anglais était « myrtle warbler »).",
  },
  "#acorn-birds": {
    blurb:
      "Les mangeurs de glands, les geais avant tout : geai bleu à l'est, geai buissonnier à l'ouest. Un geai enterre bien plus de glands qu'il n'en mangera jamais, et ceux qu'il oublie poussent — il ne vit donc pas seulement du chêne, il plante le suivant.",
  },
  "#berry-songbirds": {
    blurb:
      "Les passereaux communs, qui élèvent leurs familles avec des insectes puis passent aux fruits — callicarpe, sureau, houx, photinie de Californie — pour s'engraisser et traverser les mois les plus maigres.",
  },
  "#winter-thrushes": {
    blurb:
      "Les grives qui arrivent du nord chaque automne et passent l'hiver à vagabonder en bandes, dépouillant une haie puis passant à la suivante. Une haie de cenelles, de cynorrhodons, de prunelles et de baies de sorbier est ce qui les porte — elles et les merles et draines sédentaires — de novembre à mars.",
  },
  "#blackcaps-warblers": {
    blurb:
      "De petits oiseaux insectivores qui passent aux fruits pour le voyage d'automne vers le sud, puis en vivent tout l'hiver. C'est le lierre et le houx d'une haie atlantique, le lentisque et le myrte d'un coteau méditerranéen — et une fauvette à tête noire défendra un buisson en fruits contre tous les autres oiseaux pendant des semaines.",
  },
  "#conifer-seed-finches": {
    blurb:
      "Les fringilles qui vivent de graines d'arbres tout l'hiver — becs-croisés, tarins et sizerins. Le bec-croisé est le spécialiste : son bec se croise à la pointe, un outil pour ouvrir un cône fermé. Les autres prennent la graine plus fine de la pruche, de l'aulne et du bouleau.",
  },
  "Coccothraustes coccothraustes": {
    blurb:
      "Un fringille lourd et farouche, au bec si gros qu'il a l'air d'une erreur. Ce n'en est pas une : la moitié de la tête de l'oiseau est le muscle qui l'actionne, et il fend net un noyau de cerise pour l'amande. Ce qu'on trouve d'ordinaire, c'est un semis de noyaux coupés en deux sous l'arbre.",
  },
  "#goldfinches-linnets": {
    blurb:
      "Les petits fringilles qui vivent de la graine des fleurs sauvages — chardonnerets pendus la tête en bas à une tête de centaurée, linottes et verdiers passant en bandes gazouillantes. Ce qu'il leur faut, c'est de la graine laissée sur pied tout l'hiver : coupez tout en septembre et ils vont ailleurs.",
  },
  "Euphydryas aurinia": {
    blurb:
      "Un petit papillon en damier éclatant, orange, crème et brun, des prairies humides non amendées, et le seul insecte protégé par la loi en Irlande. Ses chenilles éclosent ensemble sur la succise des prés, tissent une tente de soie sur la plante et y passent l'hiver, blotties en un amas noir.",
  },
  "Leptidea juvernica": {
    blurb:
      "Une petite piéride blanche au vol faible, qui longe les talus et les bords de route plutôt que de les traverser. Elle n'est reconnue comme espèce à part entière que depuis 2011 et, en Grande-Bretagne et en Irlande, ne vit qu'en Irlande — ce qui en fait ce que l'île a de plus proche d'un papillon à elle.",
  },
  "Aglais io": {
    blurb:
      "Quatre grands ocelles bleu et noir sur une aile rouge profond, et un revers presque noir qui le fait disparaître dès qu'il se referme. Il hiverne adulte dans les remises et les arbres creux, et siffle en frottant ses ailes si on le dérange. Ses chenilles mangent de l'ortie, et rien d'autre.",
  },
  "Garrulus glandarius": {
    blurb:
      "Le corvidé rose et gris avec une plage de bleu ciel barré sur l'aile, entendu criailler bien plus souvent qu'il n'est vu. Chaque automne, un geai enterre quelques milliers de glands, souvent à des centaines de mètres de l'arbre, et ne revient jamais les chercher tous — c'est ainsi que les chênaies gravissent les collines.",
  },
  "Nucifraga caryocatactes": {
    blurb:
      "Un corvidé sombre moucheté de blanc des forêts alpines d'altitude, avec un seul métier. Chaque automne il enterre des dizaines de milliers de graines de pin cembro sur le flanc de la montagne, et celles qu'il oublie deviennent la forêt suivante — les graines n'ont pas d'ailes et ne peuvent voyager autrement.",
  },
  "Lyrurus tetrix": {
    blurb:
      "L'oiseau à queue en lyre de la limite des arbres alpine, dont les mâles se rassemblent à l'aube au printemps pour glousser et se provoquer sur le terrain qu'utilisaient leurs ancêtres. Il est en difficulté dans toutes les Alpes, et sa vie passe par une seule plante : la myrtille.",
  },

  // -------------------------------------------------------------------------
  // Mammifères et reptiles.
  // -------------------------------------------------------------------------
  "#acorn-mammals": {
    blurb:
      "Les glands et les fruits charnus sont les calories d'automne qui portent écureuils, tamias, cerfs, renards et jusqu'aux ours noirs jusqu'en hiver. Un seul chêne ou cerisier sauvage adulte est un garde-manger pour tous les mammifères du voisinage.",
  },
  "Muscardinus avellanarius": {
    blurb:
      "Un petit grimpeur doré à queue touffue et aux énormes yeux noirs, qui dort plus de l'année qu'il n'est éveillé. Il ne traverse presque jamais un terrain découvert : il lui faut des haies et des lisières reliées entre elles, et il se gave de noisettes. Ce qu'on trouve, c'est la coquille qu'il a ouverte : un trou rond bien net.",
  },
  "Gopherus polyphemus": {
    blurb:
      "Un fouisseur clé de voûte des hautes terres sèches de Floride, dont les longs terriers abritent des centaines d'autres espèces. Elle broute la végétation basse indigène — baies de Serenoa repens, Mimosa strigillosa, Helianthus debilis — dans les pinèdes sableuses et ouvertes dont elle a besoin.",
  },

  // -------------------------------------------------------------------------
  // La plaine du Kantō.
  // -------------------------------------------------------------------------
  "Sasakia charonda": {
    blurb:
      "Le papillon national du Japon, un grand planeur dont les mâles jettent des reflets violets au soleil. Ses chenilles ne mangent que les feuilles du micocoulier, et passent l'hiver dans la litière au pied de l'arbre.",
  },
  "Byasa alcinous": {
    blurb:
      "Un papillon à queues noir, au corps taché de rouge, qui vole lentement et ne se cache pas. Ses chenilles mangent l'aristoloche et en gardent le poison, si bien que les oiseaux apprennent à laisser les adultes tranquilles.",
  },
  "Neptis sappho": {
    blurb:
      "Un petit papillon noir et blanc qui longe les lisières en quelques battements et un long plané. Ses chenilles grandissent sur des arbustes et des lianes de la famille du pois, comme la glycine et le lespédèze.",
  },
  "Antheraea yamamai": {
    blurb:
      "Un grand bombyx jaune-brun, avec une fenêtre transparente dans chaque aile. Ses chenilles mangent le chêne et le châtaignier et filent un cocon vert, autrefois récolté pour une soie rare, vert pâle.",
  },
  "Rhodinia fugax": {
    blurb:
      "Un bombyx d'automne dont la chenille couine quand on la touche. Elle mange les feuilles du chêne, du châtaignier et du cerisier, puis suspend à un rameau un cocon vert vif.",
  },
  "Japonica, Favonius & others": {
    blurb:
      "De petites thècles aux couleurs de bijou qui vivent dans la cime des chênes et volent au crépuscule au début de l'été. Leurs chenilles ne mangent que les bourgeons et les feuilles du chêne : un bosquet de chênes konara en abrite toute une série.",
  },
  "Mycalesis gotama": {
    blurb:
      "Un papillon brun orné d'une rangée d'ocelles, qui reste dans l'herbe ombragée des lisières. Ses chenilles mangent des graminées, dont l'herbe à éventail japonaise.",
  },

  // -------------------------------------------------------------------------
  // Auckland.
  // -------------------------------------------------------------------------
  "Declana floccosa": {
    blurb:
      "Un papillon de nuit gris, si semblable à un lichen qu'il disparaît sur l'écorce d'un arbre indigène. Ses chenilles mangent les feuilles de nombreux arbres et arbustes, et ressemblent pendant ce temps à une brindille ou à une fiente d'oiseau.",
  },
  "Adelpha californica": {
    blurb:
      "Un grand papillon sombre barré de blanc, avec une tache orange au bout de chaque aile, qui plane haut autour des chênes à feuillage persistant. Ses chenilles ne mangent que des feuilles de chêne, surtout de ces chênes toujours verts, et ressemblent à de minuscules dragons verts.",
  },
  "Erynnis tristis": {
    blurb:
      "Une hespérie brun sombre à frange blanche éclatante sur les ailes postérieures, qui vole autour des chênes presque toute l'année en Californie. Ses chenilles mangent des feuilles de chêne, à l'abri d'une feuille repliée qu'elles cousent de soie.",
  },
  "Apodemia virgulti": {
    blurb:
      "Un petit papillon en damier orange, noir et blanc qui se pose ailes ouvertes sur l'ériogone de Californie. Ses chenilles mangent les feuilles d'ériogone et se cachent le jour dans un abri de soie au pied de la plante.",
  },
  "Asterocampa clyton": {
    blurb:
      "Un cousin orange chaud du papillon du micocoulier, dont les chenilles ne mangent elles aussi que du micocoulier. Elles éclosent en grappes et se nourrissent côte à côte, puis passent l'hiver, encore petites, enroulées dans une feuille morte.",
  },
  "Erynnis horatius": {
    blurb:
      "Une hespérie brun sombre qui s'éloigne rarement des chênes, dont ses chenilles mangent les feuilles. Elle vole du début du printemps à l'automne et s'arrête souvent au soleil, les ailes à plat.",
  },
  "Chlosyne lacinia": {
    blurb:
      "Un petit papillon noir barré d'une large bande orange ou crème, commun dans les étés texans. Ses chenilles se nourrissent en groupe sur les tournesols et leurs proches.",
  },
  "Hemiargus ceraunus": {
    blurb:
      "Un minuscule papillon bleu des terrains secs et ensoleillés du Texas et de la Floride. Ses chenilles mangent les boutons floraux et les jeunes gousses de plantes de la famille du pois, du prosopis au Chamaecrista fasciculata.",
  },
  "Calycopis cecrops": {
    blurb:
      "Un petit thécla gris marqué d'une bande rouge orangé sous chaque aile, commun dans les bois et les jardins du Sud. Ses chenilles rampent dans les feuilles tombées sous les sumacs et le Morella cerifera et les mangent sur place — laissez donc la litière.",
  },
  "Callophrys henrici": {
    blurb:
      "Un petit papillon brun du début du printemps, l'un des premiers à voler. Ses chenilles mangent les fleurs et les jeunes fruits du gainier du Canada et, dans le Hill Country, du Diospyros texana et de l'Ungnadia speciosa.",
  },
  "Phaeostrymon alcestis": {
    blurb:
      "Un petit thécla gris-brun dont les chenilles ne mangent que le Sapindus drummondii. Là où il n'y a pas de Sapindus, il n'y a pas de Phaeostrymon alcestis.",
  },
  "Thessalia theona": {
    blurb:
      "Un petit papillon en damier orange et crème des broussailles sèches du Texas. Ses chenilles mangent le Leucophyllum frutescens et les castilléjas, et il vole par vagues après les pluies d'été, juste quand le Leucophyllum fleurit.",
  },
  "Eurytides marcellus": {
    blurb:
      "Un pâle papillon à queues rayé de noir et de blanc, aux longues queues en lame d'épée. Ses chenilles ne mangent que des asiminiers, si bien qu'il vit là où poussent les asiminiers.",
  },
  "Papilio palamedes": {
    blurb:
      "Un grand papillon sombre à queues des marais du Sud, barré d'une bande jaune. Ses chenilles se nourrissent de Persea borbonia et de ses proches, et les adultes se pressent sur le céphalanthe et la pontédérie pour le nectar.",
  },
  "Automeris io": {
    blurb:
      "Un bombyx jaune qui dévoile deux grands ocelles sur ses ailes postérieures quand on le dérange. Ses chenilles vertes et épineuses piquent, et elles mangent les feuilles de nombreux arbres, dont l'érable rouge et les saules.",
  },
  "Habropoda laboriosa": {
    blurb:
      "Une abeille indigène rapide et velue qui récolte son pollen presque uniquement sur les fleurs de myrtilliers. Elle fait vibrer les fleurs pour en libérer le pollen au début du printemps et ne vit que quelques semaines, calées sur la floraison.",
  },
  "Phoebis sennae": {
    blurb:
      "Un grand papillon jaune citron vif qui file haut et vite à travers les jardins de Floride toute l'année. Ses chenilles mangent les sénés et le Chamaecrista fasciculata, et deviennent jaunes ou vertes selon les fleurs ou les feuilles qu'elles mangent.",
  },
  "Urbanus proteus": {
    blurb:
      "Une hespérie brune au dos bleu-vert chatoyant, munie de deux longues queues. Ses chenilles replient en abri les feuilles de haricots sauvages et de Centrosema virginianum, et s'en nourrissent à l'intérieur.",
  },
  "Junonia coenia": {
    blurb:
      "Un papillon brun portant de grands ocelles sur chaque aile, souvent vu au soleil sur la terre nue. Ses chenilles mangent des plantes basses comme les ruellias et les plantains.",
  },
  "Xanthopastis regnatrix": {
    blurb:
      "Un papillon de nuit aux ailes roses et noires piquetées d'or, comme une robe de flamenco. Ses chenilles noires annelées de jaune mangent les feuilles des Crinum et des Hymenocallis indigènes.",
  },
  "Syntomeida epilais": {
    blurb:
      "Un papillon de nuit d'un bleu-noir métallique à points blancs, au corps taché de rouge, qui vole de jour comme une guêpe. Ses chenilles mangeaient l'Echites umbellatus indigène bien avant l'arrivée du laurier-rose.",
  },
  "Sciurus vulgaris": {
    blurb:
      "L'écureuil d'Europe, roux à presque noir, aux oreilles ornées de pinceaux en hiver. Il vit de graines d'arbres : il dépouille un cône de pin ou d'épicéa écaille par écaille jusqu'au trognon, et enterre des noisettes qu'il oublie en partie — plantant des arbres au passage.",
  },
  "Sphinx pinastri": {
    blurb:
      "Un grand sphinx gris cendré des forêts de conifères, strié de noir, qui se pose le jour à plat contre l'écorce d'un pin et y disparaît presque. Sa chenille, rayée de vert et de blanc comme une aiguille de pin, se nourrit de pin, d'épicéa et de mélèze.",
  },
  "Aglia tau": {
    blurb:
      "Un papillon de la famille des saturnies, fauve orangé, avec un T blanc dans un ocelle bleu-noir sur chaque aile. Les mâles filent à travers les hêtraies par les matins d'avril à la recherche des femelles, qui attendent sur les troncs. Les chenilles mangent surtout du hêtre.",
  },
  "Parnassius apollo": {
    blurb:
      "Un grand papillon blanc des pentes ensoleillées des Alpes, aux ailes marquées de noir et de taches rouges cerclées de noir. Il est protégé dans toute l'Europe, et ses chenilles ne mangent que des orpins et des joubarbes poussant sur la roche chaude et les éboulis.",
  },
  "Hyles hippophaes": {
    blurb:
      "Un sphinx rare, olive et rose, des bancs de graviers des rivières alpines où pousse l'argousier. Sa chenille mange de l'argousier et rien d'autre : le papillon ne vit donc que là où une rivière déborde encore, remue ses graviers et laisse l'arbuste s'installer.",
  },
  "#coal-crested-tits": {
    blurb:
      "Les petites mésanges des forêts de conifères de montagne — la mésange noire à la nuque blanche, la mésange huppée à la huppe pointue noire et blanche. Elles vivent toute l'année dans les houppiers, cueillant les insectes parmi les aiguilles et cachant des graines de conifères dans les fentes de l'écorce pour l'hiver.",
  },
  "Limenitis camilla": {
    blurb:
      "Un papillon noir des bois, barré d'une large bande blanche sur chaque aile, qui plane dans la lumière tachetée presque sans battre des ailes. Ses chenilles mangent le chèvrefeuille qui pousse à l'ombre, et passent l'hiver roulées dans une seule feuille attachée à la tige.",
  },
  "Thecla betulae": {
    blurb:
      "Un papillon brun et orangé des haies de prunellier, qui vole à la fin de l'été et se laisse rarement voir. Le plus facile à trouver, c'est son œuf : un minuscule point blanc à la fourche d'un rameau de prunellier, qui attend là tout l'hiver.",
  },
  "Aporia crataegi": {
    blurb:
      "Un grand papillon blanc aux ailes dessinées de fines nervures noires, comme du papier calque. Ses chenilles passent l'hiver ensemble dans une tente de soie sur l'aubépine ou le prunellier, et les adultes se rassemblent sur les chardons et la terre humide en juin.",
  },
  "Lysandra coridon": {
    blurb:
      "Un papillon d'un bleu pâle et laiteux, des pelouses rases sur craie et calcaire, parfois par centaines sur un même coteau. Ses chenilles mangent l'hippocrépide en ombelle et rien d'autre, et des fourmis s'en occupent toute la nuit pour les gouttes sucrées qu'elles produisent.",
  },
  "Melanargia galathea": {
    blurb:
      "Un papillon en damier noir et blanc des hautes herbes d'été, et malgré son allure un cousin des satyres bruns. Ses chenilles mangent des graminées, et les adultes se nourrissent sur des fleurs violettes — centaurées, scabieuses, chardons.",
  },
  "Andrena hattorfiana": {
    blurb:
      "Une grande abeille solitaire qui n'élève ses petits qu'avec du pollen de scabieuse. La femelle porte souvent une poussière de pollen rose, et certaines ont l'abdomen rouge. Pas de scabieuse dans le pré, pas d'abeille.",
  },
  "Argynnis aglaja": {
    blurb:
      "Un grand papillon orange et rapide des coteaux ouverts, des dunes et des prairies rudes. Dessous, ses ailes postérieures sont lavées de vert et tachées d'argent. Ses chenilles mangent des violettes, et les adultes se posent surtout sur les chardons et la centaurée.",
  },
  "Argynnis paphia": {
    blurb:
      "Un grand papillon orange des allées forestières ensoleillées, qui plane d'une fleur de ronce à l'autre en juillet. Son revers est lavé de traînées vert argenté. La femelle pond sur l'écorce d'un arbre près des violettes, et les chenilles descendent les rejoindre au printemps.",
  },
  "Aglais urticae": {
    blurb:
      "Un papillon orange vif bordé de taches bleues, souvent le premier dehors par une chaude journée de printemps. Il passe l'hiver à l'état adulte dans les remises et les maisons, et ses chenilles ne mangent que des orties.",
  },
  "#winter-moths": {
    blurb:
      "De petits papillons de nuit qui volent pendant les mois les plus froids du Japon, quand peu d'oiseaux ou de chauves-souris chassent. Les femelles n'ont pas d'ailes utiles et grimpent le long du tronc pour pondre ; les chenilles éclosent avec les feuilles du printemps.",
  },
  "Hypomecis punctinalis": {
    blurb:
      "Un papillon de nuit gris-brun au dessin d'écorce, qui passe la journée plaqué contre un tronc. Ses chenilles arpenteuses mangent les feuilles de nombreux feuillus, du chêne et de l'érable au zelkova.",
  },
  "Colotois pennaria": {
    blurb:
      "Un papillon de nuit brun orangé de la fin de l'automne, dont les mâles ont des antennes en plumes et viennent aux fenêtres éclairées par les nuits froides. Ses chenilles ressemblent à des brindilles et mangent au printemps les feuilles de l'érable, du chêne et de la viorne.",
  },
  "Neozephyrus japonicus": {
    blurb:
      "Une petite thècle dont les mâles brillent d'un vert métallique, qui vit partout où poussent les aulnes dans les bois humides de plaine. Ses chenilles mangent les feuilles de l'aulne, et c'est le papillon emblème de la préfecture de Saitama.",
  },
  "Argyreus hyperbius": {
    blurb:
      "Un nacré orange dont la femelle a le bout des ailes noir, traversé d'une bande blanche. Ses chenilles ne mangent que des violettes, et il a gagné le Kantō à mesure que les hivers se sont adoucis.",
  },
  "Graphium sarpedon": {
    blurb:
      "Un papillon noir et rapide, traversé d'une bande de taches turquoise vif sur chaque aile : un papilionidé sans queues. Ses chenilles mangent le camphrier et d'autres arbres de la famille du laurier, si bien que les arbres d'alignement l'élèvent en plein Tokyo.",
  },
  "Zosterops japonicus": {
    blurb:
      "Un petit passereau vert olive à l'œil cerclé d'un anneau blanc vif, commun dans les parcs et les jardins japonais. En hiver, il boit le nectar des camélias et des fleurs de prunier, dont il transporte le pollen, et le reste de l'année il mange des baies.",
  },
  "Hypsipetes amaurotis": {
    blurb:
      "Un oiseau gris et bruyant à longue queue, avec une tache marron sur chaque joue, chez lui dans toutes les villes du Japon. Il mange des fruits et du nectar toute l'année, et disperse les graines de nombreux arbres indigènes.",
  },
  "Yponomeuta spp.": {
    blurb:
      "De petits papillons de nuit blancs ponctués de noir comme une fourrure d'hermine, dont les chenilles vivent ensemble sous des toiles de soie communes. Une toile peut envelopper tout un fusain au début de l'été ; l'arbuste refait ses feuilles ensuite.",
  },
  "Actias spp.": {
    blurb:
      "De grands papillons de soie vert pâle, aux ailes postérieures prolongées de longues queues. Leurs chenilles mangent le cerisier, l'aulne, le châtaignier et le chêne, et les adultes vivent environ une semaine sans se nourrir.",
  },
  "Limenitis arthemis": {
    blurb:
      "Un papillon forestier noir bleuté de l'est de l'Amérique du Nord, proche parent du vice-roi. Au sud, il imite le Battus philenor, au goût amer ; au nord, il porte une large bande blanche. Ses chenilles, déguisées en fientes d'oiseau, mangent les feuilles de cerisier, de bouleau et de peuplier.",
  },
  "Celastrina spp.": {
    blurb:
      "De petits papillons bleu ciel, parmi les premiers à voler au printemps, souvent avant les feuilles. Leurs chenilles mangent les boutons floraux des cornouillers et des viornes, et des fourmis les soignent pour les gouttes sucrées qu'elles sécrètent.",
  },
  "Callophrys niphon": {
    blurb:
      "Un petit papillon brun, au motif d'écorce de pin, qui vole en avril et en mai. Ses chenilles ne mangent que les jeunes aiguilles des pins : un bosquet de jeunes pins peut abriter une colonie que personne ne remarque.",
  },
  "Satyrium calanus": {
    blurb:
      "Un petit papillon brun foncé, à fines queues et à bandes liserées de blanc, posé sur les feuilles ensoleillées en lisière des chênaies au début de l'été. Ses chenilles mangent les jeunes feuilles des chênes, des caryers et des noyers.",
  },
  "Euphydryas phaeton": {
    blurb:
      "Un papillon noir, orange et blanc des prairies humides, nommé d'après les couleurs des armoiries de Lord Baltimore. Ses chenilles grandissent ensemble dans des toiles de soie sur les Chelone, puis passent l'hiver dans la litière juste en dessous.",
  },
  "Setophaga kirtlandii": {
    blurb:
      "Un passereau gris et jaune qui niche au sol sous de jeunes pins gris, surtout dans le nord de la péninsule inférieure du Michigan. Tombé à moins de 200 mâles chanteurs, il s'est rétabli grâce aux plantations et aux brûlages de pins gris, et a quitté la liste des espèces menacées en 2019.",
  },
  "Nyctemera annulata": {
    blurb:
      "Un papillon de nuit noir et blanc, au corps annelé d'orange, qui vole de jour et qu'on ne trouve qu'en Nouvelle-Zélande. Ses chenilles velues mangent les séneçons et leurs proches parents.",
  },
  "#nz-leafrollers": {
    blurb:
      "De petits papillons de nuit bruns dont les chenilles roulent une feuille en tube de soie et se nourrissent à l'intérieur. De nombreuses plantes indigènes les nourrissent, des hebes aux fougères arborescentes, et les chenilles nourrissent à leur tour les oiseaux insectivores.",
  },
  "Ischalis": {
    blurb:
      "Des papillons de nuit qu'on ne trouve qu'en Nouvelle-Zélande, dont les chenilles arpenteuses mangent les frondes des fougères, fougères arborescentes comprises. Un coin d'ombre plein de fougères leur sert de foyer.",
  },
  "Neophasia menapia": {
    blurb:
      "Un papillon blanc aux ailes bordées de noir qui vit haut dans les conifères et tournoie autour des cimes à la fin de l'été. Ses chenilles mangent des aiguilles — de pin surtout, mais aussi de douglas et de sapin de Vancouver — puis descendent au bout d'un fil de soie pour se nymphoser.",
  },
  "Tamiasciurus douglasii": {
    blurb:
      "Un petit écureuil brun-roux et bruyant des forêts de conifères du Nord-Ouest, qui houspille quiconque approche de son arbre. Il coupe des cônes verts tout l'automne, les entrepose en tas humides et vit de leurs graines tout l'hiver.",
  },
  "Antheraea polyphemus": {
    blurb:
      "Un énorme bombyx fauve portant sur chaque aile postérieure un ocelle transparent, qu'il dévoile à tout ce qui le dérange. Ses chenilles grossissent, vertes et dodues, sur le chêne, l'érable, le saule et le bouleau ; l'adulte n'a pas de bouche fonctionnelle et vit environ une semaine.",
  },
  "Nymphalis californica": {
    blurb:
      "Un papillon orange taché de noir aux bordures sombres, célèbre pour ses années d'abondance, quand des nuées franchissent les cols de montagne. Ses chenilles mangent les céanothes et presque rien d'autre, et les adultes passent l'hiver blottis sous une écorce ou dans une fente de rocher.",
  },
  "Vanessa annabella": {
    blurb:
      "Un papillon orange et noir, petit cousin occidental de la belle-dame, qui reste sur place au lieu de migrer. Ses chenilles mangent des mauves — sidalcées, mauves arbustives — à l'abri d'une petite tente de soie et de feuilles.",
  },
  "Strymon melinus": {
    blurb:
      "Un petit papillon gris-bleu, avec de fines queues et une tache orange sur chaque aile postérieure. Il frotte ses queues l'une contre l'autre pour qu'un oiseau frappe une fausse tête, et ses chenilles mangent les fleurs et les graines de nombreuses plantes, surtout des mauves et des légumineuses.",
  },
  "Hyles lineata": {
    blurb:
      "Un sphinx rapide et massif, une bande rose sur chaque aile postérieure, qu'on voit souvent au crépuscule planer devant les fleurs comme un colibri. Ses grosses chenilles mangent des épilobes, des onagres et bien d'autres plantes.",
  },
  "Boloria selene": {
    blurb:
      "Un petit papillon orange des prairies humides et fleuries, des pentes à fougère aigle et des clairières, qui vole au ras du sol en juin. Ses chenilles mangent des violettes. Il reste répandu en Écosse, alors qu'il décline vite plus au sud.",
  },
  "Erebia aethiops": {
    blurb:
      "Un papillon brun chocolat foncé aux ocelles cerclés d'orange, qui vole en août au-dessus des hautes herbes humides. En Grande-Bretagne, il ne vit presque qu'en Écosse. Ses chenilles mangent la molinie bleue, et les adultes ne volent qu'au soleil.",
  },
  "Satyrium titus": {
    blurb:
      "Un petit papillon brun, sans queues, avec une rangée de taches rouge corail sous chaque aile postérieure. Ses chenilles mangent les cerisiers et pruniers sauvages, la nuit, et les adultes se pressent sur les fleurs d'asclépiade en juillet.",
  },
};
