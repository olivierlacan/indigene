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
      "Le papillon emblème de la Floride — de longues ailes noires rayées de jaune pâle, dérivant lentement dans les endroits ombragés. Ses chenilles ne mangent que des passiflores ; les adultes ont ceci d'inhabituel qu'ils mangent du pollen, ce qui leur permet de vivre des mois.",
  },
  "Eumaeus atala": {
    blurb:
      "Un petit bijou — noir de velours moucheté de bleu irisé, avec un ventre écarlate — qu'on a cru éteint en Floride. Il est revenu avec sa seule plante hôte, la Zamia integrifolia. Planter cette Zamia, c'est reconstruire ce papillon au sens le plus littéral.",
  },
  "Anartia jatrophae": {
    blurb:
      "Un papillon pâle au vol bas des ouvertures ensoleillées et humides de Floride. Ses chenilles se nourrissent de Stachytarpheta et de bacopa.",
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
      "Un papillon orange et noir portant au revers deux gros ocelles bleus. Ses chenilles mangent les immortelles aux feuilles argentées et les antennaires, en s'enveloppant dans les feuilles laineuses et leur propre soie pour se cacher.",
  },
  "Vanessa atalanta": {
    blurb:
      "Des ailes noires barrées d'une bande écarlate, et une hardiesse inhabituelle — il se pose volontiers sur un bras. Ses chenilles vivent repliées à l'intérieur d'une feuille d'ortie cousue de soie, ce qui fait qu'un carré d'orties laissé debout dans un coin vaut bien plus qu'il n'en a l'air.",
  },
  "Epargyreus clarus": {
    blurb:
      "Une grande hespérie brune portant sous chaque aile postérieure une tache argentée qui lance des éclairs en vol. Elle se nourrit vite et souvent, et ses chenilles grandissent sur les légumineuses indigènes, à l'intérieur d'une feuille qu'elles replient sur elles-mêmes.",
  },
  "Papilio troilus": {
    blurb:
      "Un papillon à queues sombre, poudré de bleu-vert. Sa chenille est l'une des choses les plus étranges d'un jardin de l'est : vert vif, avec deux énormes faux yeux, cachée le jour dans une feuille qu'elle a roulée en tube.",
  },
  "Limenitis lorquini": {
    blurb:
      "Un papillon noir à bande blanche et bouts d'ailes orange, avec l'habitude de venir à votre rencontre — il chasse un oiseau, ou une personne, hors de son bout de berge, puis revient planer jusqu'au même rameau.",
  },
  "Papilio zelicaon": {
    blurb:
      "Le machaon jaune et noir des coteaux californiens, souvent vu à tourner tout en haut d'une colline — les mâles s'y rassemblent pour attendre les femelles. Ses chenilles mangent des plantes de la famille de la carotte et se dressent pour brandir une corne orange fourchue quand quelque chose les dérange.",
  },
  "#grass-skippers": {
    blurb:
      "Les petites hespéries orange qui filent à travers une prairie, et les satyres et tristans brun tendre qui y dérivent. Leurs chenilles ne mangent rien que de l'herbe, et elles passent l'hiver blotties au fond d'une graminée indigène en touffe — c'est pourquoi une pelouse tondue n'en a aucun.",
  },
  "Argynnis spp.": {
    blurb:
      "Les grands papillons orange des prés et des clairières de l'Ouest, au revers constellé d'argent — l'Argynnis hydaspe, l'A. zerene, l'A. cybele, et l'A. zerene hippolyta du littoral de l'Oregon, inscrit sur la liste fédérale des espèces menacées. Les livres plus anciens appellent tout le groupe Speyeria. Chacun d'eux grandit sur les violettes et sur rien d'autre, et il le fait dans un ordre étrange : la femelle pond en fin d'été sur un sol sec où les violettes se sont déjà ratatinées, la chenille éclôt, ne mange absolument rien, et dort tout l'hiver en attendant le retour des feuilles.",
  },
  "Callophrys mossii": {
    blurb:
      "Un petit papillon gris-brun, facile à dépasser sans le voir, qui vole aux premières semaines douces du printemps autour des affleurements rocheux, des talus de route et des falaises. Ses chenilles mangent les orpins indigènes et à peu près rien d'autre : il vit donc exactement là où vit l'orpin — une pellicule de terre sur du rocher — et nulle part entre les deux.",
  },
  "Icaricia, Callophrys & others": {
    blurb:
      "Les petits papillons des terrains chauds et secs — des azurés de la taille d'un ongle, et des théclas verts que la plupart des gens prennent pour des papillons de nuit s'ils les remarquent seulement. Toute une série d'entre eux élèvent leurs chenilles sur les sarrasins sauvages indigènes, et plusieurs ne pondront sur rien d'autre : c'est pourquoi un carré de sarrasin sur un talus pauvre et ensoleillé vaut plus pour eux qu'un massif entier de fleurs à nectar.",
  },
  "Nymphalis antiopa": {
    blurb:
      "Un papillon chocolat foncé bordé d'un crème déchiqueté, avec une ligne de taches bleues à l'intérieur de la bordure. C'est souvent le premier papillon que quiconque voie dans l'année ici, parce qu'il n'est allé nulle part — il passe l'hiver à l'état adulte, coincé derrière une écorce décollée ou au fond d'un tas de bois, et sort par une après-midi douce de fin d'hiver avant qu'une seule fleur ne soit ouverte. Ses chenilles se nourrissent en une foule noire et épineuse sur le saule, le peuplier et le bouleau.",
  },

  // -------------------------------------------------------------------------
  // Papillons de jour — Europe.
  // -------------------------------------------------------------------------
  "Gonepteryx rhamni": {
    blurb:
      "Le grand papillon jaune citron qui est, dans la plus grande partie de la France, le premier que chacun voie chaque année. Il passe l'hiver à l'état adulte — ailes fermées et exactement en forme de feuille, blotti dans du lierre ou du houx — et sort au premier jour doux de février, d'un éclat impossible contre une haie nue. Il vit plus longtemps que presque tout autre papillon d'Europe, près d'un an sur l'aile, et ses chenilles ne mangent que des nerpruns.",
  },
  "Gonepteryx cleopatra": {
    blurb:
      "La sœur méridionale du citron — le même jaune citron avec un éclat orange brûlé en travers de l'aile antérieure, et souvent la première chose à voler dans un mois de février du Midi, parce que les adultes dorment tout l'hiver et se réveillent au premier jour doux. Comme le citron, ses chenilles ne mangent que des nerpruns.",
  },
  "Favonius quercus": {
    blurb:
      "Un petit papillon qui vit toute sa vie à la cime d'un chêne. Il visite rarement une fleur — il boit plutôt le miellat collant que les pucerons laissent sur les feuilles — si bien que presque personne ne le remarque. Placez-vous sous un grand chêne par un soir calme de juillet et levez les yeux : les points qui vacillent autour du houppier, prenant le violet quand ils tournent, ce sont eux.",
  },
  "Apatura iris": {
    blurb:
      "Un grand papillon forestier dont les mâles brûlent d'un violet électrique sous un angle et deviennent brun uni sous le suivant, selon la façon dont la lumière frappe l'aile. Il passe ses journées à la cime des plus grands arbres et ignore complètement les fleurs, ne descendant que pour le sol humide, la sève qui suinte et des choses bien moins polies. Sa chenille est une chose verte, en forme de limace, avec deux cornes, qui passe l'hiver aplatie contre un rameau de saule marsault, exactement de la couleur de l'écorce.",
  },
  "Celastrina argiolus": {
    blurb:
      "Le papillon bleu argenté pâle qui vole haut autour d'une haie, d'un mur ou d'un if de cimetière en avril, des semaines avant tout autre azuré. Il a deux générations par an et chacune utilise une plante différente — celle de printemps pond sur le houx, celle d'été sur le lierre — c'est pourquoi c'est l'azuré qui réussit en ville.",
  },
  "Hamearis lucina": {
    blurb:
      "Un petit papillon damé d'orange et de brun qui ressemble à un nacré en miniature sans lui être apparenté — c'est le seul représentant européen d'une famille par ailleurs tropicale. Il a beaucoup reculé à mesure que les prairies étaient nettoyées et les taillis abandonnés, et il est exigeant : les femelles ne pondent que sur les primevères officinales et les primevères communes, et seulement sur des pieds installés dans le bon degré d'abri.",
  },
  "Charaxes jasius": {
    blurb:
      "Le plus grand papillon d'Europe et celui qui a l'air le plus tropical — brun à bordure orange, avec deux queues à chaque aile postérieure. Il vit dans le maquis méridional, se nourrit de fruits tombés plutôt que de fleurs, et ses chenilles ne mangent qu'une seule plante : l'arbousier.",
  },
  "Libythea celtis": {
    blurb:
      "Un petit papillon brun aux ailes découpées en échancrures vives et au long museau, si bien qu'un individu posé ressemble exactement à une feuille morte sur un rameau. C'est l'un des papillons les plus longévifs d'Europe — près d'un an à l'état adulte — et ses chenilles ne mangent que le micocoulier de Provence.",
  },
  "Polygonia c-album": {
    blurb:
      "Aux bords déchiquetés et orange, avec une petite virgule blanche au revers. Il passe l'hiver à l'état adulte serré contre un rameau, où le contour déchiré de l'aile en fait une feuille morte. Ses chenilles grandissent sur le houblon, l'ortie et l'orme.",
  },
  "Polyommatus icarus": {
    blurb:
      "Le petit papillon bleu-violet de toutes les prairies et de tous les bords de route de France — le mâle bleu vif, la femelle brune à taches orange. Ses chenilles mangent le lotier corniculé et ses parents, et les fourmis les gardent souvent pour les gouttes sucrées qu'elles exsudent.",
  },
  "Phengaris arion": {
    blurb:
      "Un papillon protégé à l'une des vies les plus étranges d'Europe. Sa chenille mange des fleurs de serpolet quelques semaines, puis tombe au sol et est emportée dans une fourmilière de fourmis rouges — elle sent et même sonne comme une larve de fourmi — où elle passe dix mois à manger le couvain de ses hôtes. Il lui faut le serpolet et la bonne fourmi, ou il ne lui faut rien du tout.",
  },
  "Cupido minimus": {
    blurb:
      "Le plus petit papillon d'Europe — une chose brun suie de la taille d'un ongle, saupoudrée de bleu. Ses chenilles vivent à l'intérieur des capitules d'anthyllide vulnéraire, en mangeant les graines en formation, et elles ne peuvent utiliser aucune autre plante.",
  },
  "Lycaena phlaeas": {
    blurb:
      "Un petit papillon de la couleur d'une pièce neuve — ailes antérieures orange bruni, bordées de brun sombre. Il choisit une pierre chaude ou une plaque de sentier nue et y revient tout l'après-midi, se lançant sur tout ce qui passe et se reposant au même endroit. Ses chenilles mangent les oseilles et les patiences et rien d'autre, ce qui explique qu'il appartienne aux coins en friche plutôt qu'aux massifs nets.",
  },
  "Satyrium w-album": {
    blurb:
      "Un petit papillon sombre portant un mince W blanc griffonné en travers du revers de l'aile, d'où son nom. Il passe sa vie à la cime d'un orme et descend si rarement — pour les fleurs de ronce et les chardons en juillet — que la plupart des gens qui en ont un au-dessus de la tête n'apprennent jamais qu'il est là. Il a chuté avec les ormes au passage de la graphiose, et il ne revient que là où les ormes reviennent.",
  },
  "Callophrys rubi": {
    blurb:
      "Le seul papillon vert d'Europe — et il ne vous montre jamais le dessus de ses ailes. Il se repose ailes fermées, et le revers est d'un vert feuille dur et vif qui le fait disparaître contre un arbuste à l'instant où il se pose. Cherchez en avril et en mai sur une lande ensoleillée ou un talus broussailleux : deux individus qui montent en spirale ensemble et retombent sur le même rameau, c'est en général ainsi qu'on en trouve un.",
  },
  "Plebejus argus": {
    blurb:
      "Un petit papillon bleu des landes ouvertes, nommé pour les minuscules paillettes métalliques le long du bord du revers de son aile. Toute sa vie passe par une fourmi : les fourmis noires trouvent la chenille, boivent le liquide sucré qu'elle exsude, et en retour la transportent, la gardent, et mènent souvent la chrysalide à terme dans leur propre nid. Il lui faut donc la callune, le sol nu et chaud où les fourmis nichent, et les fourmis elles-mêmes — perdez-en un seul et le papillon s'en va.",
  },
  "Melitaea cinxia": {
    blurb:
      "Un papillon damé d'orange et de noir des herbages chauds et en friche, au mieux près de la côte atlantique. Ses chenilles vivent en famille : elles éclosent ensemble sur le plantain lancéolé, tissent par-dessus une tente de soie commune, y passent l'hiver serrées les unes contre les autres, et aux premières journées franchement ensoleillées du printemps sortent se chauffer sur le dessus de la toile, en un nœud noir qu'on repère depuis le sentier.",
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
      "Le plus grand papillon de nuit indigène d'Amérique du Nord — un géant de la taille d'une main, barré de rouge. Ses chenilles s'engraissent sur les feuilles de cerisier, d'érable, de bouleau et d'autres arbres avant de filer un gros cocon papyracé pour l'hiver.",
  },
  "Hemaris thysbe": {
    blurb:
      "Un papillon de nuit trapu et diurne qui fait du surplace devant les fleurs exactement comme un minuscule colibri, si bien que presque personne ne devine que c'est un papillon de nuit. Ses chenilles se nourrissent de viornes et de chèvrefeuilles ; les adultes butinent le nectar des fleurs tubulaires.",
  },
  "Sphinx ligustri": {
    blurb:
      "Le plus grand papillon de nuit de France — barré de rose et de noir, grand comme une paume — qui vole au crépuscule et fait du surplace devant les fleurs parfumées sur des ailes trop rapides pour être vues. Sa chenille est tout aussi saisissante : une grosse chose vert vif, rayée de lilas, avec une corne au bout de la queue, engraissée sur les feuilles de troène.",
  },
  "Zygaena filipendulae": {
    blurb:
      "Un papillon de nuit diurne, bleu-noir luisant à six taches écarlates, qui dérive lentement au-dessus des prairies d'été parce qu'il n'a rien à craindre — il fabrique du cyanure à partir du lotier corniculé que mangent ses chenilles, et tout le monde le sait.",
  },
  "Laothoe populi": {
    blurb:
      "Le grand sphinx le plus commun de France, et le plus étrange à voir au repos : il tient ses ailes postérieures en avant des antérieures, si bien qu'un papillon posé sur un mur se lit comme une feuille morte grise que quelqu'un aurait mal remontée. L'adulte n'a pas de pièces buccales fonctionnelles et ne mange jamais rien — tout ce qu'il lui faut, il l'a pris à l'état de chenille, sur des feuilles de peuplier et de saule.",
  },
  "Deilephila elpenor": {
    blurb:
      "Rose et vert olive, comme une chose qui appartiendrait à un pays bien plus chaud, faisant du surplace devant un chèvrefeuille à la nuit tombée. C'est la chenille qui donne son nom, et qui vaut à ce papillon un bon nombre d'appels téléphoniques alarmés : une grosse chose gris-brun aussi longue qu'un doigt, avec un museau en trompe qu'elle rentre quand on la touche — ce qui gonfle quatre gros ocelles et la fait ressembler, brièvement et de façon très convaincante, à un petit serpent.",
  },
  "Macroglossum stellatarum": {
    blurb:
      "Le papillon de nuit que tout le monde a vu et que presque personne ne croit : une chose trapue gris et orange qui fait du surplace devant une fleur en plein jour, les ailes brouillées, en déroulant une trompe plus longue que son propre corps — et qui se fait signaler chaque été comme un bébé colibri. Il remonte la France au printemps, et il apprend un bon carré de fleurs assez bien pour y revenir à la même heure le lendemain.",
  },
  "Saturnia pavonia": {
    blurb:
      "Le bombyx de la lande — gris tendre et rose, avec un gros ocelle sur chacune de ses quatre ailes. Le mâle vole vite dans le soleil d'avril, en zigzaguant au ras de la callune sur des antennes plumeuses capables de capter l'odeur d'une femelle à un kilomètre ; elle, reste immobile toute la journée et ne vole que la nuit. La chenille vaut aussi d'être trouvée : vert vif, cerclée de noir et cloutée de verrues orange.",
  },

  // -------------------------------------------------------------------------
  // Abeilles.
  // -------------------------------------------------------------------------
  "Bombus spp.": {
    blurb:
      "Les grosses abeilles velues qui volent par temps froid et tôt dans l'année. Elles savent « polliniser par vibration » — secouer le pollen en frissonnant de leurs muscles de vol — dont certaines fleurs indigènes dépendent. Elles nichent dans le sol et dans les vieilles touffes d'herbe, et une succession de fleurs du printemps aux gelées nourrit une colonie.",
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
      "La grosse abeille au dos luisant, comme un bourdon avec une plaque chauve. Elle niche dans le bois mort plutôt que dans le sol, et elle est assez forte pour ouvrir des fleurs que la plupart des abeilles ne peuvent pas — ou, quand une fleur est trop profonde même pour elle, pour en percer la base et boire par ce trou.",
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
      "Les colibris de jardin de l'Ouest. Le colibri roux cale sa migration de printemps sur l'entrée en fleur des groseilliers et des ancolies indigènes : une fleur rouge précoce est donc du carburant qui arrive exactement quand il le faut.",
  },
  "Bombycilla cedrorum": {
    blurb:
      "Un oiseau élégant et sociable qui vit de fruits et vagabonde en bandes, dépouillant un amélanchier ou un cornouiller en une après-midi. Ce sont les arbustes à baies qui gardent leurs fruits jusqu'en hiver qui les retiennent dans les environs.",
  },
  "Sitta pusilla": {
    blurb:
      "Une toute petite sittelle grise et brune qui couine comme un canard en plastique et passe sa vie entière dans les pins du sud des États-Unis. C'est l'un des très rares oiseaux à se servir d'un outil : elle ramasse un éclat d'écorce et s'en sert de levier pour en décoller d'autres et atteindre les insectes en dessous.",
  },
  "Psaltriparus minimus": {
    blurb:
      "Un bout d'oiseau gris, à peine plus lourd que deux trombones, qui circule en bandes bavardes d'une vingtaine et retourne un arbuste de l'intérieur. Son nid est la chose la plus étrange d'un jardin californien : une chaussette suspendue de lichen et de soie d'araignée, longue de trente centimètres, que le couple met un mois à construire.",
  },
  "Spinus psaltria": {
    blurb:
      "Un tout petit fringille au dos noir et au ventre citron, qui vit presque uniquement de graines — y compris celles des sauges et des tournesols dont déborde une bordure de jardin sec. Laissez les têtes de graines fanées debout et il les trouvera.",
  },
  "Spinus tristis": {
    blurb:
      "Le « canari sauvage » jaune vif qui niche tard, en été, pour pouvoir nourrir ses jeunes des graines d'asters et d'échinacées indigènes. Laisser les têtes de graines debout tout l'automne et l'hiver, c'est son garde-manger d'hiver.",
  },
  "Setophaga coronata": {
    blurb:
      "La seule paruline capable de digérer les fruits cireux du myrte cirier, ce qui lui permet d'hiverner bien plus au nord — et dans tout le Sud-Est — que les autres parulines. Le Morella cerifera est la plante derrière ce tour de force (son ancien nom anglais était « myrtle warbler »).",
  },
  "#acorn-birds": {
    blurb:
      "Les mangeurs de glands. Les geais en particulier — geai bleu à l'est, geai buissonnier à l'ouest — emportent et enterrent bien plus de glands qu'ils n'en mangeront jamais, et ceux qu'ils oublient poussent : un geai n'est donc pas seulement nourri par un chêne, il plante le suivant.",
  },
  "#berry-songbirds": {
    blurb:
      "Les passereaux de tous les jours, qui élèvent leurs familles avec des insectes puis passent aux fruits — callicarpe, sureau, houx, photinie de Californie — pour s'engraisser et traverser les mois les plus maigres.",
  },
  "#winter-thrushes": {
    blurb:
      "Les grives qui arrivent du nord chaque automne et passent l'hiver à vagabonder en bandes, dépouillant une haie puis passant à la suivante. Une haie de cenelles, de cynorrhodons, de prunelles et de baies de sorbier est ce qui les porte — elles et les merles et draines sédentaires — de novembre à mars.",
  },
  "#blackcaps-warblers": {
    blurb:
      "De petits oiseaux insectivores qui passent aux fruits pour le voyage d'automne vers le sud — puis en vivent tout l'hiver, que ce soit le lierre et le houx d'une haie atlantique ou le lentisque et le myrte d'un coteau méditerranéen. Les baies huileuses sont le carburant, et elles valent qu'on se batte pour elles : une fauvette à tête noire tiendra un seul buisson en fruits contre tous les autres oiseaux pendant des semaines. De plus en plus d'entre elles sautent désormais la traversée maritime et passent tout l'hiver dans l'ouest de la France, précisément sur cette nourriture.",
  },
  "#conifer-seed-finches": {
    blurb:
      "Les fringilles qui vivent de graines d'arbres tout l'hiver. Le bec-croisé est le spécialiste — son bec se croise à la pointe, un outil pour ouvrir un cône fermé, et dans le Nord-Ouest Pacifique des populations entières ont leur propre taille de bec et leur propre cri pour le cône qu'elles travaillent. Tarins et sizerins prennent la graine plus fine de la pruche, du mélèze, de l'aulne et du bouleau, en général suspendus la tête en bas pour le faire.",
  },
  "Coccothraustes coccothraustes": {
    blurb:
      "Un fringille lourd et farouche, brun-orange chaud avec une bavette noire et un bec si gros qu'il a l'air d'une erreur. Ce n'en est pas une : la moitié de la tête de l'oiseau est le muscle qui l'actionne, et il peut mettre quelque chose comme cinquante kilos de pression sur un noyau de cerise et le fendre net pour l'amande à l'intérieur. Rien d'autre dans un jardin français ne sait faire cela. Il se nourrit haut dans la canopée et s'esquive avant qu'on le repère : ce qu'on trouve d'ordinaire, c'est la preuve — un semis de noyaux proprement coupés en deux sous l'arbre.",
  },
  "#goldfinches-linnets": {
    blurb:
      "Les petits fringilles qui vivent de la graine des fleurs sauvages — chardonnerets à face rouge et barre d'aile dorée, pendus la tête en bas à une tête de centaurée, linottes et verdiers passant en bandes gazouillantes. Ce qu'il leur faut, c'est de la graine laissée debout tout l'automne et l'hiver, précisément ce qu'un jardin nettoyé n'a pas : coupez tout en septembre et ils vont simplement ailleurs.",
  },
  "Garrulus glandarius": {
    blurb:
      "Le corvidé rose et gris avec une plage de bleu ciel barré sur l'aile, entendu criailler bien plus souvent qu'il n'est vu. Chaque automne, un geai transporte et enterre quelques milliers de glands, deux par deux et souvent à des centaines de mètres de l'arbre, et il ne revient jamais les chercher tous. C'est ainsi que les chênaies traversent les terrains découverts et gravissent les collines — l'oiseau ne vit pas seulement du chêne, il plante le suivant.",
  },
  "Nucifraga caryocatactes": {
    blurb:
      "Un corvidé sombre moucheté de blanc des forêts alpines d'altitude, avec un seul métier : chaque automne il enterre des dizaines de milliers de graines de pin cembro sur le flanc de la montagne, et celles qu'il oublie deviennent la forêt suivante. Les graines du pin n'ont pas d'ailes et ne peuvent voyager d'aucune autre façon — l'oiseau et l'arbre ne peuvent se passer l'un de l'autre.",
  },
  "Lyrurus tetrix": {
    blurb:
      "L'oiseau à queue en lyre de la limite des arbres alpine, dont les mâles se rassemblent à l'aube au printemps pour glousser et se provoquer sur le même carré de terrain que leurs ancêtres utilisaient. Il est en difficulté dans toutes les Alpes, et sa vie passe par une seule plante : la myrtille — des insectes qu'on y prélève pour les poussins, des baies et des feuilles pour les adultes, et ses fourrés bas où se cacher sous la neige.",
  },

  // -------------------------------------------------------------------------
  // Mammifères et reptiles.
  // -------------------------------------------------------------------------
  "#acorn-mammals": {
    blurb:
      "Les glands et les fruits charnus sont les calories d'automne qui portent écureuils, tamias, cerfs, renards et jusqu'aux ours noirs jusqu'en hiver. Un seul chêne ou cerisier sauvage adulte est une banque alimentaire pour tout le voisinage des mammifères.",
  },
  "Muscardinus avellanarius": {
    blurb:
      "Un petit grimpeur doré à queue touffue et aux énormes yeux noirs, qui dort plus de l'année qu'il n'est éveillé — six mois roulé dans un nid de la taille d'une balle de tennis, et une bonne partie de l'été aussi quand le temps se gâte. Il ne traverse presque jamais un terrain découvert : il lui faut donc des haies et des lisières reliées entre elles pour aller où que ce soit, et il s'engraisse à l'automne sur les noisettes. Vous n'en verrez probablement jamais un. Ce qu'on trouve, c'est la coquille qu'il a ouverte : un trou rond bien net, avec les marques de dents inclinées autour du bord comme un minuscule tour.",
  },
  "Gopherus polyphemus": {
    blurb:
      "Un fouisseur clé de voûte des hautes terres sèches de Floride, dont les longs terriers abritent des centaines d'autres espèces. Elle broute la végétation basse indigène — baies de Serenoa repens, Mimosa strigillosa, Helianthus debilis — dans les pinèdes sableuses et ouvertes dont elle a besoin.",
  },
};
