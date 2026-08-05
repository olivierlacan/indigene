// The Pacific Northwest west of the Cascades, referenced on the Portland–Seattle
// lowlands. The largest roster in the catalog, at 58 plants.
//
// Red osier dogwood is also on the Mid-Atlantic list and appears here under a
// region-qualified key (`"Cornus sericea@pnw"`), because the two rows say
// different things — a wet meadow in Pennsylvania and a west-side streambank are
// not the same story.
//
// Several of the butterflies here have no French name (see `taxa.fr.ts`), so a
// paragraph names them with the scientific name, exactly as the heading above it
// will. See `./index.ts`.
import type { ProseTable } from "../../lib/prose";

export const PNW: ProseTable = {
  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — arbres.
  // -------------------------------------------------------------------------
  "Quercus garryana": {
    nativeNote:
      "Le chêne emblématique des prairies et des savanes à chênes du versant ouest, de la Colombie-Britannique à la Californie.",
    careNote:
      "Lent mais extraordinairement longévif et à l'épreuve de la sécheresse une fois installé — sa racine pivotante le rend autonome mais difficile à transplanter : plantez-en un petit et laissez-le. L'habitat menacé de chênaie-prairie de l'Ouest dépend de lui.",
    givesNote:
      "L'arbre le plus précieux qui soit pour la faune du versant ouest : des centaines d'espèces de chenilles, des glands pour les geais, les pics et les mammifères, et l'ossature de la savane à chêne de Garry.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chênes blancs germent dès l'automne, sans aucun froid, et ne doivent jamais sécher. À cause de la racine pivotante, démarrez-le en pot haut ou semez-le directement là où il vivra.",
    supportNotes: {
      "propertius-duskywing":
        "Le chêne de Garry est la seule plante nourricière de l'Erynnis propertius — pas de chêne, pas de papillon.",
      "acorn-birds":
        "Ses glands nourrissent les pics glandivores, les geais et les pigeons à queue barrée dans le pays des chênes de l'Ouest.",
      "acorn-mammals":
        "Les glands sont une nourriture d'automne pour les écureuils, les cerfs et d'autres mammifères.",
    },
  },
  "Pseudotsuga menziesii": {
    // Both kinds of writing under the one key, which is what `lib/prose.ts`
    // expects: the Douglas-fir is native *here* and an impostor in the French
    // Alps, where it is a plantation tree. The plant fields serve this page; the
    // `origin`/`blurb` pair serves `#/lookalikes/pseudotsuga-menziesii`.
    origin:
      "Indigène de l'ouest de l'Amérique du Nord — il figure sur notre propre liste du Nord-Ouest Pacifique.",
    blurb:
      "Planté dans les moyennes montagnes françaises depuis les années 1800 pour son bois droit et rapide, c'est aujourd'hui l'un des arbres de plantation les plus répandus du pays. Chez lui en Oregon, il pousse avec toute une forêt qui a évolué à ses côtés ; dans une vallée alpine, c'est une culture, et le sol sous un peuplement dense est silencieux.",
    nativeNote:
      "Le conifère dominant des forêts du versant ouest et l'emblème forestier de la région.",
    careNote:
      "Il devient franchement énorme — donnez-lui de la vraie place, loin des bâtiments et des lignes. Rapide, robuste et résistant à la sécheresse une fois installé.",
    givesNote:
      "Ses graines nourrissent becs-croisés, tarins et mésanges ; son houppier dense abrite chouettes et passereaux ; et peu d'arbres stockent plus de carbone.",
    propagationNote:
      "Récoltez les cônes à maturité, quand ils brunissent en fin d'été, puis séchez-les dans un sac en papier jusqu'à ce qu'ils s'ouvrent et secouez-en la graine ailée. Un mois environ de froid humide au réfrigérateur avant un semis de printemps donne un peuplement de jeunes plants plus régulier.",
    supportNotes: {
      "conifer-seed-finches":
        "Les becs-croisés d'Amérique sont liés au sapin de Douglas ici plus étroitement qu'à aucun autre arbre — des populations entières ont leur propre taille de bec et leur propre cri de vol pour ses cônes, et une bande travaillant la cime d'un gros douglas est un son du Nord-Ouest Pacifique.",
    },
  },
  "Thuja plicata": {
    nativeNote:
      "Conifère de fondation des forêts humides du versant ouest ; culturellement central pour les peuples de la côte nord-ouest.",
    careNote:
      "Il veut une humidité régulière et tolère l'ombre et les sols détrempés — parfait pour un emplacement frais et mi-ombragé, mais il souffrira et « jaunira » dans un site chaud et sec. Les cerfs broutent les jeunes plants.",
    givesNote:
      "Un abri persistant toute l'année pour les oiseaux, un écran dense, un énorme stockage de carbone, et des racines qui tiennent ensemble un terrain détrempé.",
    propagationNote:
      "Cueillez les petits cônes à maturité, quand ils brunissent à l'automne, et séchez-les jusqu'à ce qu'ils libèrent leur graine. Quelques semaines de froid humide avant le semis l'aident à lever plus régulièrement, quoique celui-ci germe assez volontiers.",
    supportNotes: {
      "conifer-seed-finches":
        "Les petits cônes du thuya sont un travail de précision pour les tarins et les autres petits fringilles, et l'arbre leur donne aussi l'autre moitié de ce qu'il leur faut : un couvert persistant dense où passer un hiver pluvieux.",
    },
  },
  "Acer macrophyllum": {
    nativeNote:
      "Le grand érable indigène des forêts de basse altitude et des vallées de cours d'eau du versant ouest.",
    careNote:
      "Grand et rapide ; donnez-lui de la place. Ses branches moussues deviennent avec le temps des jardins suspendus à elles seules.",
    givesNote:
      "Ses fleurs précoces nourrissent les premières abeilles du printemps, ses samares nourrissent oiseaux et rongeurs, et il héberge de nombreuses chenilles tout en se drapant de mousse et de polypode réglisse.",
    propagationNote:
      "Récoltez les samares ailées une fois mûres à l'automne. Semez-les dehors aussitôt et laissez le temps faire le travail, ou donnez-leur deux mois de froid humide au réfrigérateur pour qu'elles lèvent au printemps.",
    supportNotes: {
      "western-tiger-swallowtail":
        "L'érable à grandes feuilles est parmi les arbres que les chenilles du Papilio rutulus utilisent.",
      "mason-bees":
        "Ses lourdes grappes de fleurs précoces nourrissent les abeilles fraîchement émergées avant que la plupart des plantes ne fleurissent.",
    },
  },
  "Populus trichocarpa": {
    nativeNote:
      "Pionnier rapide des rives, le long des rivières et des plaines inondables du versant ouest.",
    careNote:
      "Très rapide et très grand, avec des racines avides et chercheuses — tenez-le bien à l'écart des canalisations, des fondations et des pavages, et seulement là où un grand arbre de ripisylve a sa place. Il veut un terrain frais.",
    givesNote:
      "L'un des principaux hôtes à chenilles de l'Ouest — de la nourriture pour les parulines et les viréos — plus des bourgeons printaniers au parfum de baume et des racines qui cuirassent une berge.",
    propagationNote:
      "L'arbre le plus facile d'ici à démarrer : coupez en fin d'hiver des rameaux dormants gros comme un crayon et enfoncez-les en terre humide, ils s'enracinent tout seuls. La graine cotonneuse ne vit que quelques jours : si vous passez par elle, répandez-la sur de la vase à l'instant où elle est lâchée.",
    supportNotes: {
      "western-tiger-swallowtail":
        "Le peuplier de l'Ouest est un arbre nourricier de prédilection pour le Papilio rutulus.",
    },
  },
  "Arbutus menziesii": {
    nativeNote:
      "Arbre feuillu persistant des falaises sèches et ensoleillées et des pentes rocheuses du versant ouest.",
    careNote:
      "Réputé capricieux à l'installation : plantez-en un petit dans un sol très drainant, au soleil, et ne l'arrosez jamais en été — ce sont l'irrigation et le dérangement qui tuent les arbousiers. Ne touchez pas aux racines.",
    givesNote:
      "Une écorce couleur cannelle qui s'exfolie, des fleurs en urne pour les abeilles, et des baies rouge-orangé dont dépendent les pigeons à queue barrée, les merles d'Amérique et les jaseurs.",
    propagationNote:
      "Prélevez la graine des baies mûres d'automne, rincez-en toute la pulpe, et donnez-lui environ deux mois de froid humide. Il supporte mal qu'on dérange ses racines : démarrez-le en pot profond ou semez-le directement là où il poussera, et déplacez-le le moins possible.",
    supportNotes: {
      "acorn-birds":
        "Les baies d'arbousier sont une nourriture d'automne et d'hiver emblématique du pigeon à queue barrée, et elles sont prélevées par les merles d'Amérique et les jaseurs.",
      "mason-bees":
        "Ses fleurs printanières en urne nourrissent les bourdons et d'autres abeilles indigènes.",
    },
  },
  "Amelanchier alnifolia": {
    nativeNote:
      "Petit arbre ou grand arbuste indigène des lisières, des clairières et des pentes du versant ouest.",
    careNote:
      "Adaptable et résistant à la sécheresse une fois installé, au soleil ou à mi-ombre. Cerfs et oiseaux l'adorent tous les deux : protégez les jeunes plants.",
    givesNote:
      "Des fleurs blanches précoces pour les abeilles qui émergent, de douces baies bleues — les « saskatoons » — adorées des oiseaux et des gens, et un feuillage d'automne flamboyant.",
    propagationNote:
      "Dégagez la graine des baies mûres d'été et donnez-lui un long hiver froid et humide — cela peut être lent et tout ne lèvera pas au premier printemps, ne renoncez donc pas au pot. Plus simple encore : déterrez les rejets enracinés qu'il pousse autour de sa base et replantez-les.",
    supportNotes: {
      "cedar-waxwing":
        "Les amélanches sont un fruit d'été de premier ordre pour les jaseurs et de nombreux passereaux de l'Ouest.",
      "berry-songbirds":
        "Merles d'Amérique, grives et gros-becs prennent tous les baies sucrées.",
    },
  },
  "Salix scouleriana": {
    nativeNote:
      "Le saule commun des hauteurs, dans les bois et les lisières du versant ouest — fait rare, il tolère un terrain plus sec que la plupart des saules.",
    careNote:
      "Rapide et formant fourré — excellent pour tenir une pente ou une lisière humide, mais donnez-lui de la place. Ses chatons très précoces sont une première nourriture essentielle ; il supporte mieux le sec que les autres saules.",
    givesNote:
      "Une clé de voûte : les saules hébergent plus de chenilles que presque tout le reste ici, nourrissant les oiseaux au nid, et leurs chatons les plus précoces alimentent les reines de bourdons et les osmies quand rien d'autre ne fleurit.",
    propagationNote:
      "Comme les autres saules, il s'enracine presque sans effort à partir de boutures dormantes d'hiver enfoncées en terre humide. Sa graine cotonneuse ne vit que quelques jours : si vous la récoltez, semez-la immédiatement sur un terrain mouillé.",
    supportNotes: {
      "western-tiger-swallowtail":
        "Les saules sont une plante nourricière principale du Papilio rutulus.",
      "mason-bees":
        "Les chatons de saule sont l'une des sources de pollen les plus précoces et les plus riches pour les osmies et les andrènes de printemps.",
    },
  },
  "Alnus rubra": {
    nativeNote:
      "Le feuillu pionnier des berges, des clairières et des coupes du versant ouest, du sud-est de l'Alaska au nord de la Californie.",
    careNote:
      "L'ombre indigène la plus rapide qu'on puisse obtenir sur un site frais, et le seul arbre local qui fabrique son propre azote — il nourrit le sol pour tout ce qu'on plantera après lui. Deux réserves honnêtes : il se ressème partout, et il est de courte vie pour un arbre (60 à 80 ans) — plantez-le donc comme culture d'accompagnement plutôt que comme pièce maîtresse.",
    givesNote:
      "L'un des principaux arbres à chenilles de la région, et ses petits chatons ligneux gardent une graine que les tarins des pins et les chardonnerets dépouillent tout l'hiver. Ses racines tricotent vite une berge et tirent l'azote de l'air vers le sol.",
    propagationNote:
      "Cueillez les petits cônes ligneux à l'automne dès qu'ils commencent à s'ouvrir, séchez-les à l'intérieur dans un sac en papier et secouez-en la graine ailée. Elle lèvera d'un semis de printemps sans aucun traitement, quoiqu'un mois de froid humide au réfrigérateur rende le peuplement plus régulier. Semez épais — une bonne part de la graine est vide.",
    supportNotes: {
      "american-goldfinch":
        "Les petits chatons ligneux de l'aulne gardent une graine que les chardonnerets et les tarins des pins dépouillent tout l'hiver.",
    },
  },
  "Prunus emarginata": {
    nativeNote:
      "Le cerisier sauvage commun des lisières boisées, des bords de route et des clairières en reconstitution du versant ouest.",
    careNote:
      "Peu exigeant et rapide sur presque tout terrain bien drainé, et il drageonne en fourré si on le laisse — ce qui est une qualité au fond d'une parcelle et une gêne dans un petit massif. Ses feuilles et ses noyaux contiennent des composés cyanurés : c'est un arbre à tenir à l'écart d'un pré à chevaux (chiens et chats de jardin ne courent pas de vrai risque, mais autant le dire).",
    givesNote:
      "Après les chênes et les saules, les cerisiers sont les arbres à chenilles les plus productifs de l'Ouest — des centaines d'espèces de papillons de jour et de nuit, c'est-à-dire de quoi nourrir une nichée de mésanges. Une floraison blanche printanière pour les abeilles précoces, puis des fruits rouges amers que les pigeons à queue barrée, les merles d'Amérique et les jaseurs mangent, même si nous ne le pouvons pas.",
    propagationNote:
      "Écrasez les fruits mûrs à l'automne, lavez la pulpe des noyaux, et donnez-leur environ trois mois de froid humide au réfrigérateur avant de semer au printemps — la pulpe elle-même retient la germination, elle doit donc partir. Plus facile encore : soulevez en fin d'hiver l'un des drageons enracinés qu'il pousse autour de lui.",
    supportNotes: {
      "western-tiger-swallowtail":
        "Les cerisiers sauvages sont parmi les principaux arbres nourriciers du Papilio rutulus.",
      "pale-swallowtail":
        "Le cerisier amer est l'une des plantes nourricières du Papilio eurymedon, avec l'holodisque et les céanothes.",
      "berry-songbirds":
        "Les petites cerises amères — non comestibles pour nous — sont prélevées par les merles d'Amérique, les grives et les pigeons à queue barrée.",
    },
  },
  "Acer circinatum": {
    nativeNote:
      "L'érable de sous-bois des forêts du versant ouest, s'arquant sous les sapins de Douglas de la Colombie-Britannique au nord de la Californie.",
    careNote:
      "Le seul arbre indigène qui veuille vraiment un emplacement ombragé — sous les conifères ou au nord d'une maison, il devient une chose sculpturale à plusieurs troncs. En plein soleil d'après-midi il grille, à moins que la terre ne reste fraîche. Arrosez-le ses deux premiers étés ; ensuite il se débrouille.",
    givesNote:
      "Toute la valeur en chenilles d'un érable dans un arbre qui tient dans un petit jardin, plus la plus belle couleur d'automne indigène de la région — écarlate et orange à l'ombre — et des samares que gros-becs et fringilles travaillent.",
    propagationNote:
      "Récoltez les samares appariées à l'automne, quand elles brunissent, et donnez-leur environ trois mois dans un sachet de sable humide au réfrigérateur avant de semer — la graine d'érable a besoin de ce passage froid et humide pour se réveiller. Ses branches basses s'enracinent aussi au contact du sol : vous pouvez en fixer une et la détacher un an plus tard.",
    supportNotes: {
      "western-tiger-swallowtail":
        "Les érables sont des arbres nourriciers du Papilio rutulus, et l'érable circiné est celui qui tient dans un petit jardin.",
    },
    lookalikeNotes: {
      "acer-palmatum": {
        why: "Deux petits érables à feuilles très découpées qui s'embrasent à l'automne — le japonais dans la plupart des jardins, l'indigène dans la plupart des bois.",
        tells: [
          { feature: "Forme de la feuille", native: "Presque un cercle, à sept ou neuf lobes peu profonds et base en cœur.", lookalike: "Une étoile, à cinq à neuf lobes découpés profondément, souvent presque jusqu'au centre." },
          { feature: "Fleurs", native: "De petites fleurs pendantes à pétales blancs et sépales rouge-pourpre foncé, en avril.", lookalike: "De minuscules fleurs rougeâtres, faciles à manquer." },
          { feature: "Port", native: "Il s'étale et s'incline, plusieurs tiges depuis le sol, se marcottant là où une branche touche la terre.", lookalike: "Une seule charpente nette en vase, en général maintenue ainsi par la taille." },
          { feature: "Où il est", native: "Sauvage, à l'ombre sous les conifères.", lookalike: "Planté, dans un jardin." },
        ],
      },
    },
  },
  "Tsuga heterophylla": {
    nativeNote:
      "Le conifère de climax tolérant à l'ombre du Nord-Ouest maritime, et l'arbre emblème de l'État de Washington.",
    careNote:
      "Le seul grand conifère qui poussera *à* l'ombre : c'est ainsi qu'on remet une forêt sous des arbres existants. Il a des racines superficielles et aucune tolérance à la sécheresse — sur une parcelle sèche et exposée il souffrira là où le douglas hausse les épaules. Donnez-lui un emplacement frais et abrité et arrosez-le ses premiers étés.",
    givesNote:
      "Ses minuscules cônes nourrissent becs-croisés, tarins et mésanges tout l'hiver ; son houppier plumeux et retombant est un couvert de nidification pour les petits passereaux ; et peu de choses sur le versant ouest stockent plus de carbone ou tiennent mieux la terre d'une pente sous une averse.",
    propagationNote:
      "Ramassez les petits cônes au début de l'automne, juste quand ils brunissent, séchez-les jusqu'à ouverture et secouez-en la graine. Quelques semaines de froid humide au réfrigérateur améliorent la régularité de la levée. Semez à la surface d'une terre humide et tourbeuse et gardez-la à l'ombre — les jeunes plants sont minuscules et sèchent en une après-midi.",
    supportNotes: {
      "conifer-seed-finches":
        "Les cônes de pruche font à peine deux centimètres et demi : ce sont donc les petits fringilles qui en tirent le plus — les tarins des pins travaillent les extrémités de branches retombantes tout l'hiver, les mésanges suivant derrière.",
    },
  },
  "Fraxinus latifolia": {
    nativeNote:
      "L'arbre emblématique des terrains humides de la vallée de la Willamette et des basses terres du Puget — plaines inondables, dépressions et mares saisonnières.",
    careNote:
      "Il encaisse ce que presque rien d'autre n'encaisse : un terrain sous l'eau tout l'hiver et cuit dur en août. Plantez-le dans le coin humide du jardin, pas dans le bon massif. Une chose à savoir avant de vous engager : l'agrile du frêne a atteint l'Oregon en 2022, et il tue les frênes. Le frêne de l'Oregon vaut toujours d'être planté en terrain humide, là où il appartient, et il y a un risque réel qu'il ait besoin d'aide ; le service forestier de l'État publie des recommandations à jour.",
    givesNote:
      "Un arbre à chenilles majeur, et ses samares nourrissent fringilles, gros-becs et canards branchus. Sur une plaine inondable, il fait le travail qu'aucun arbuste ne peut faire : absorber l'eau d'hiver et tenir la berge en même temps.",
    propagationNote:
      "Cueillez les grappes pendantes de samares à l'automne, une fois sèches et papyracées. La graine de frêne est têtue : il lui faut une période chaude suivie de trois mois de froid humide, la voie la plus simple est donc de semer dehors en pot à l'automne et de laisser tout un hiver faire le travail — une partie attendra tout de même le second printemps.",
    supportNotes: {
      "western-tiger-swallowtail":
        "Le frêne de l'Oregon est l'un des arbres nourriciers du Papilio rutulus, aux côtés des saules et des peupliers avec lesquels il pousse sur une plaine inondable.",
      "american-goldfinch":
        "Le frêne garde ses samares papyracées en grappes jusqu'au cœur de l'hiver, et chardonnerets, tarins et gros-becs les travaillent sur les branches nues.",
    },
  },
  "Cornus nuttallii": {
    nativeNote:
      "Le cornouiller à fleurs de l'Ouest — un arbre de lisière de la Colombie-Britannique à la Californie, et l'emblème floral de la Colombie-Britannique.",
    careNote:
      "Le plus beau arbre indigène de cette liste et le plus difficile : il veut une lumière tamisée, des racines fraîches sous un paillis de feuilles mortes, un bon drainage et aucun arrosage d'été *au pied du tronc*, et il supporte mal d'être déplacé. L'anthracnose du cornouiller, une maladie fongique, frappe les arbres en souffrance à l'ombre humide — un emplacement aéré avec du soleil du matin est la meilleure défense. Plantez-en un petit et soyez patient.",
    givesNote:
      "De grandes bractées blanches printanières qui éclairent une lisière boisée (et souvent une seconde floraison à l'automne), un solide hôte à chenilles, et des grappes de fruits écarlates que pigeons à queue barrée, merles d'Amérique, jaseurs et gros-becs vident en quelques jours.",
    propagationNote:
      "Débarrassez les fruits écarlates de leur pulpe dès qu'ils sont mûrs — elle retient la graine — puis donnez à la graine environ trois mois de froid humide au réfrigérateur avant de semer au printemps. Les extrémités de pousses tendres prises au début de l'été s'enracinent aussi sous abri, ce qui est la voie la plus sûre si vous voulez la copie d'un arbre qui vous plaît.",
    supportNotes: {
      "cedar-waxwing":
        "Les grappes de fruits écarlates sont vidées par les jaseurs et les pigeons à queue barrée au début de l'automne.",
      "berry-songbirds":
        "Merles d'Amérique, grives et gros-becs se nourrissent abondamment des fruits du cornouiller de Nuttall.",
    },
  },
  "Crataegus douglasii": {
    nativeNote:
      "L'aubépine indigène des lisières de prairies humides, des fonds de vallée et des vieilles lignes de clôture du versant ouest, de la Colombie-Britannique au nord de la Californie.",
    careNote:
      "Un petit arbre raide et large, aux épines de deux centimètres et demi — plantez-le là où personne n'a à se faufiler, et il ne vous demandera rien d'autre. Il est le plus heureux sur un terrain qui reste frais jusqu'en été, y compris un coin qui s'inonde en hiver, et l'argile ne le dérange pas. Lent : achetez-le petit et laissez-lui son temps ; si vous voulez le fourré qu'il fait à l'état sauvage, laissez les drageons.",
    givesNote:
      "Les aubépines sont l'un des plus grands arbres à chenilles de l'Ouest et nous n'en avions aucune sur cette liste — une mésange qui travaille une aubépine récolte les jeunes de centaines d'espèces. Sa floraison blanche de mai est lourde de petites abeilles et de mouches indigènes, ses cenelles sombres tiennent jusqu'en hiver pour les jaseurs, les merles d'Amérique et les gélinottes, et son houppier épineux est l'un des endroits les plus sûrs où un passereau puisse bâtir un nid.",
    propagationNote:
      "La graine d'aubépine est réputée têtue : dégagez les noyaux des cenelles mûres d'automne et semez-les en pot laissé dehors, puis préparez-vous à attendre deux hivers avant que quoi que ce soit ne paraisse — une période chaude suivie d'une période froide est ce qui les débloque, et une seule saison n'y suffit presque jamais. Beaucoup plus rapide : soulevez un drageon enraciné au bord d'un pied installé en fin d'hiver.",
    supportNotes: {
      "cedar-waxwing":
        "Les cenelles sombres tiennent bien après les feuilles : une aubépine noire nourrit encore jaseurs et merles d'Amérique aux semaines où les fruits d'été ont disparu depuis longtemps.",
      "berry-songbirds":
        "Les épines sont tout l'intérêt : un fourré d'aubépines est l'un des rares endroits où un petit oiseau puisse bâtir sans qu'un chat, un geai ou une corneille puisse facilement suivre.",
      "mason-bees":
        "Sa lourde floraison de mai, plate et ouverte, nourrit osmies et andrènes au plus fort de la saison d'approvisionnement des nids.",
    },
  },
  "Betula papyrifera": {
    nativeNote:
      "Le bouleau à écorce blanche des basses terres du Puget, du bas Fraser et du nord-ouest de Washington — la variété propre au versant ouest, parfois notée var. commutata ou subcordata.",
    careNote:
      "Le bouleau veut un enracinement frais et humide, et il vous dira quand il ne l'a pas : un arbre cuit sur une pelouse exposée au sud s'affaiblit, et l'agrile du bouleau achève les bouleaux affaiblis. Donnez-lui donc le côté nord ou est, paillez large, arrosez-le ses premiers étés, et ne le plantez jamais dans l'emplacement chaud et sec que vous espériez lui voir décorer. Il est franchement plus heureux autour du Puget Sound que dans un mois d'août de la Willamette, et il n'est pas longévif ici — soixante bonnes années, pas deux cents. Ses chatons printaniers lâchent un pollen porté par le vent, bon à savoir si le bouleau vous fait éternuer.",
    givesNote:
      "Le bouleau est l'un des cinq premiers arbres à chenilles du continent et cette liste n'en comptait aucun — c'est-à-dire que tout un étage de papillons de nuit, et les parulines et les mésanges qui les mangent, n'avait rien ici pour grandir. Ses petits chatons en forme de cônes s'effritent en une graine que les tarins des pins et les sizerins travaillent tout l'hiver, ses branches mortes deviennent des loges de pics et de mésanges, et son écorce blanche éclaire un mois de février gris.",
    propagationNote:
      "Cueillez les chatons mûrs en fin d'été, avant qu'ils ne s'effritent, et émiettez-les sur un pot de terreau humide — la graine est fine comme de la poussière et a besoin de lumière : pressez-la et laissez-la découverte. Quelques semaines de froid humide (ou un pot laissé dehors tout l'hiver) la font lever plus régulièrement. Semez bien plus que nécessaire ; une bonne part de la graine de bouleau est vide.",
    supportNotes: {
      "conifer-seed-finches":
        "Les chatons de bouleau s'effritent tout l'hiver en une graine si fine que seuls les petits fringilles s'en donnent la peine — tarins des pins et sizerins se pendent la tête en bas au bout des rameaux pour l'atteindre, en général en une seule bande bruyante.",
      "mourning-cloak":
        "Le bouleau est l'un des rares arbres sur lesquels un morio pondra, et il pond en anneau autour d'un rameau, si bien que les chenilles se nourrissent en une foule noire et épineuse. Le papillon qui en sort est celui qui vole en février, après avoir passé l'hiver derrière une écorce décollée.",
    },
  },
  "Malus fusca": {
    nativeNote:
      "Le seul pommier indigène de l'Ouest — un petit arbre des marécages, des bords de marée, des bois humides et des marges d'estuaire du versant ouest, de l'Alaska au nord de la Californie.",
    careNote:
      "C'est l'arbre du coin humide : il accepte un terrain sous l'eau tout l'hiver, et il se moque même des embruns salés d'un bord de marée, ce que presque rien d'autre sur cette liste ne fait. Ses courts rameaux latéraux s'affûtent en épines : gardez-le à l'écart d'un passage. Dans un printemps humide, les feuilles se tavellent et tombent tôt — c'est la tavelure du pommier, cela paraît plus grave que ce n'est, et ramasser les feuilles tombées est tout le traitement. Il penche et se fourche en une silhouette tordue à plusieurs troncs ; c'est la plante, pas un défaut.",
    givesNote:
      "Pommiers et pommiers sauvages sont parmi les arbres à chenilles les plus productifs du pays, et celui-ci fait ce travail les pieds dans l'eau. Des nuages de fleurs blanc-rosé nourrissent osmies et reines de bourdons en avril ; puis de petites pommes acides, du jaune au rouge, qui tiennent bien après les feuilles et nourrissent jaseurs, gros-becs, merles d'Amérique, renards et ours à travers les premiers grands froids. Elles sont comestibles pour les gens aussi, une fois que le gel les a bletties.",
    propagationNote:
      "Écrasez les petites pommes une fois blettes à l'automne, lavez-en les pépins, et donnez-leur environ trois mois de froid humide au réfrigérateur avant de semer au printemps — ou semez-les dehors à l'automne dans un pot à l'épreuve des mulots et laissez l'hiver s'en charger. Les branches basses qui reposent sur un terrain humide s'enracinent au contact : vous pouvez en fixer une et la détacher un an plus tard.",
    supportNotes: {
      "mason-bees":
        "La floraison du pommier sauvage est ce pour quoi les arboriculteurs louent des osmies — une foule de fleurs blanc-rosé en avril, arrivant exactement quand les abeilles émergent.",
      "cedar-waxwing":
        "Les petites pommes acides blettissent au lieu de tomber, et les jaseurs les travaillent à travers les premiers grands froids.",
      "berry-songbirds":
        "Merles d'Amérique, gros-becs et grives prennent les fruits ; renards et ours nettoient ce qui tombe.",
    },
  },

  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — arbustes.
  // -------------------------------------------------------------------------
  "Berberis aquifolium": {
    nativeNote:
      "Arbuste persistant des bois et des lisières du versant ouest ; la fleur emblème de l'État de l'Oregon.",
    careNote:
      "Robuste, persistant et à l'épreuve de la sécheresse une fois installé, au soleil comme à l'ombre. Ses feuilles en forme de houx sont piquantes — placez-le à l'écart des passages. Parfois noté Mahonia aquifolium.",
    givesNote:
      "Ses fleurs jaunes parfumées de fin d'hiver sont l'une des premières sources de nectar pour les abeilles ; ses baies bleues nourrissent merles d'Amérique et jaseurs ; ses feuilles luisantes persistantes donnent de la structure toute l'année.",
    propagationNote:
      "Écrasez les baies bleues mûres, rincez la graine, et donnez-lui un hiver froid et humide. Il s'étend aussi par des drageons souterrains qu'on peut déterrer et déplacer, et les boutures de pousses en voie d'aoûtement prises en fin d'été s'enracinent.",
    supportNotes: {
      "mason-bees":
        "Ses fleurs jaune vif de fin d'hiver sont parmi les toutes premières nourritures à abeilles de l'année.",
      "cedar-waxwing":
        "Ses baies bleues en « grappes » nourrissent jaseurs, merles d'Amérique et tohis.",
    },
    lookalikeNotes: {
      "ilex-aquifolium": {
        why: "Deux persistants luisants aux feuilles épineuses en forme de houx — et le second mot du nom latin de l'un est le nom de l'autre.",
        tells: [
          { feature: "La feuille", native: "Une feuille composée : cinq à neuf folioles épineuses rangées le long d'un même pétiole.", lookalike: "Une seule feuille épineuse à la fois, épaisse et ondulée." },
          { feature: "Baies", native: "Bleu-violet pruineux, en grappes comme de minuscules raisins.", lookalike: "Rouge vif — et seulement sur les pieds femelles." },
          { feature: "Fleurs", native: "Des bouquets jaunes éclatants au début du printemps, par la journée la plus grise de l'année.", lookalike: "Petites, blanches et faciles à manquer." },
          { feature: "Sous l'écorce", native: "Grattez une tige : le bois est d'un jaune vif.", lookalike: "Pâle." },
        ],
      },
    },
  },
  "Ribes sanguineum": {
    nativeNote:
      "Arbuste caduc des bois et des clairières du versant ouest ; une floraison printanière emblématique du Nord-Ouest.",
    careNote:
      "Facile, rapide et résistant à la sécheresse une fois installé, du soleil à la mi-ombre. Il entre en dormance estivale sur les sites secs — c'est normal, ce n'est pas la mort.",
    givesNote:
      "Ses grappes de fleurs roses s'ouvrent exactement au retour des colibris roux au printemps, les nourrissant ainsi que les abeilles précoces ; ses baies nourrissent ensuite les passereaux.",
    propagationNote:
      "De loin le plus facile : des boutures ligneuses dormantes prises en fin d'automne ou en hiver, qui s'enracinent volontiers en terre humide. Le semis marche aussi, mais il faudra dégager la graine des baies et lui donner d'abord un hiver froid et humide.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs rouges de printemps s'ouvrent juste au passage migratoire des colibris roux — un appariement célèbre et parfaitement synchronisé.",
      "mason-bees":
        "Une source précoce de nectar et de pollen pour les osmies et les reines de bourdons qui émergent.",
    },
  },
  "Holodiscus discolor": {
    nativeNote:
      "Arbuste caduc arqué des bois, des falaises et des talus de route du versant ouest.",
    careNote:
      "Extrêmement robuste et à l'épreuve de la sécheresse une fois installé — un choix de premier ordre pour un talus chaud et sec, au soleil ou à mi-ombre. Ses panicules séchées persistent tout l'hiver.",
    givesNote:
      "Ses gerbes de fleurs crème écumeuses grouillent d'abeilles indigènes et de papillons au cœur de l'été ; ses rameaux denses abritent et nourrissent les oiseaux ; ses racines profondes tiennent une pente.",
    propagationNote:
      "La graine est fine comme de la poussière : répandez-la en surface sans l'enterrer, et donnez-lui un hiver froid et humide — la levée peut être têtue et inégale. Les boutures de pousses d'été en voie d'aoûtement sont l'autre voie courante.",
    supportNotes: {
      "pale-swallowtail":
        "L'holodisque est une plante nourricière classique du Papilio eurymedon (et du Limenitis lorquini).",
      "bumble-bees":
        "Ses panicules crème écumeuses sont couvertes d'abeilles au début de l'été.",
    },
  },
  "Symphoricarpos albus": {
    nativeNote:
      "Arbuste caduc formant fourré dans les bois et les lisières du versant ouest.",
    careNote:
      "Quasi indestructible — il prend le soleil comme l'ombre profonde, l'humide comme le sec, et drageonne en fourré : servez-vous-en pour garnir ou tenir un terrain plutôt que comme sujet net. Ses baies blanches sont légèrement toxiques pour les personnes et les animaux domestiques si on les mange.",
    givesNote:
      "Ses fleurs d'été nourrissent colibris et abeilles ; ses baies blanches d'hiver nourrissent colins, gélinottes et merles d'Amérique ; et ses racines tricotent un talus difficile.",
    propagationNote:
      "De loin le plus facile est de déterrer les drageons enracinés par lesquels il s'étend, ou de prendre des boutures ligneuses dormantes en hiver. La graine est lente et têtue, demandant souvent deux hivers avant de lever, et la plupart des gens s'en passent.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses petites fleurs roses en clochettes sont une source de nectar estivale pour les colibris ; ses baies blanches persistent pour les oiseaux d'hiver.",
    },
  },
  "Rosa nutkana": {
    nativeNote:
      "Rosier sauvage indigène des lisières, des prairies et des rivages du versant ouest.",
    careNote:
      "Robuste, adaptable et résistant à la sécheresse une fois installé ; il drageonne en fourré. Épineux — idéal en haie à faune ou en barrière, moins au bord d'un passage.",
    givesNote:
      "Ses grandes roses simples et roses nourrissent bourdons et autres abeilles indigènes ; ses cynorrhodons nourrissent oiseaux et petits mammifères jusqu'en hiver ; et le fourré offre un couvert de nidification.",
    propagationNote:
      "Le plus simple est de déterrer les drageons enracinés qu'il pousse autour de lui, ou de prendre des boutures ligneuses dormantes en hiver. Le semis à partir des cynorrhodons est lent : nettoyez la graine, donnez-lui un long hiver froid et humide, et prenez patience devant une levée irrégulière.",
    supportNotes: {
      "bumble-bees":
        "Un rosier sauvage est une coupe simple et ouverte avec le pollen à portée de main : une abeille peut réellement s'en servir — ce qu'un rosier de jardin double, pour un insecte, n'est pas.",
      "berry-songbirds":
        "Ses gros cynorrhodons tiennent tout l'hiver pour les merles d'Amérique, les tohis et les gélinottes, et le fourré épineux est un couvert de nidification profond.",
    },
  },
  "Gaultheria shallon": {
    nativeNote:
      "Arbuste de sous-bois persistant qui tapisse les forêts du versant ouest, surtout près de la côte.",
    careNote:
      "Il veut un sol acide et de l'ombre à mi-ombre — idéal pour l'ombre sèche sous les conifères, où il s'étend lentement en un fourré persistant. Un peu de patience et d'eau l'été le mettent en route ; ensuite il est autonome.",
    givesNote:
      "Ses fleurs en urne nourrissent colibris et abeilles, ses baies bleu-noir comestibles nourrissent oiseaux et gens, et le fourré persistant offre un couvert toute l'année sur un terrain ombragé difficile.",
    propagationNote:
      "Prélevez des boutures de pousses en voie d'aoûtement en été, ou déterrez les marcottes enracinées et les pousses rampantes qu'il forme au sol. La graine est minuscule — pressez-la à la surface d'un mélange acide, gardez-la humide, et attendez-vous à des résultats lents et inégaux.",
    supportNotes: {
      "berry-songbirds":
        "Les baies sombres de la gaulthérie sont mangées par les merles d'Amérique, les grives et les gélinottes — et ses fleurs nourrissent les abeilles.",
    },
  },
  "Rubus spectabilis": {
    nativeNote:
      "La ronce à fruits formant fourré des bois frais et des bords de cours d'eau du versant ouest, de la côte de l'Alaska au nord de la Californie.",
    careNote:
      "Elle s'étend par coulants souterrains en un fourré, ce qui est exactement ce que vous voulez le long d'un ruisseau ou au fond d'un grand jardin et exactement ce que vous ne voulez pas dans un petit massif. Ses aiguillons sont mous — plus soie qu'épine. Coupez chaque hiver un tiers des vieilles cannes à la base pour la garder productive.",
    givesNote:
      "Ses fleurs magenta s'ouvrent en mars, avant presque tout le reste, et les colibris roux calent leur arrivée sur elles. Puis une lourde récolte de baies orange à rouge pour les grives, les tangaras et les merles d'Amérique, et un hôte à chenilles parmi les meilleurs arbustes de l'Ouest. Le fouillis lui-même est un couvert de nidification.",
    propagationNote:
      "Le plus facile de tous : en fin d'hiver, déterrez l'une des pousses enracinées qu'elle envoie au bord de la touffe, détachez-la à la bêche, et déplacez-la. Des morceaux nus de canne de l'an passé, enfoncés en terre humide en hiver, s'enracinent aussi volontiers.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs magenta s'ouvrent en mars, et les colibris roux calent leur arrivée vers le nord sur elles.",
      "berry-songbirds":
        "Une lourde récolte précoce de baies orange à rouge pour les grives, les tangaras et les merles d'Amérique.",
    },
    lookalikeNotes: {
      "rubus-armeniacus": {
        why: "Deux ronces dans les mêmes lisières fraîches, toutes deux à cannes arquées et épineuses et à baies qu'on voudrait cueillir.",
        tells: [
          { feature: "Cannes", native: "Grêles, rondes et brunes, à fins aiguillons mous qu'on peut empoigner à travers.", lookalike: "Épaisses comme un pouce, à section pentagonale, à épines crochues et à base large." },
          { feature: "Feuilles", native: "Trois folioles, vertes des deux côtés.", lookalike: "En général cinq folioles sur les grosses cannes, blanc de craie au revers." },
          { feature: "Fleurs et fruits", native: "Fleurs magenta en mars ; baies molles saumon à rouge dès juin.", lookalike: "Fleurs blanc-rosé en juin ; baies noires en août." },
          { feature: "Ce qu'elle fait ensuite", native: "Elle fait un fourré ouvert à travers lequel d'autres plantes poussent.", lookalike: "Elle s'enracine partout où une pointe de canne touche terre, jusqu'à ce qu'il ne reste rien d'autre." },
        ],
      },
    },
  },
  "Sambucus racemosa": {
    nativeNote:
      "Arbuste rapide au bois tendre des clairières fraîches, des bords de cours d'eau et des ouvertures forestières du versant ouest.",
    careNote:
      "Il pousse comme une mauvaise herbe sur un terrain frais et en a l'air dès août : mettez-le là où l'exubérance compte plus que la propreté. Rabattez-le sévèrement — même au ras du sol — tous les quelques hivers et il repart mieux. Les baies crues, ainsi que les feuilles, les tiges et les racines, rendent les personnes et les animaux malades ; c'est une plante à oiseaux, pas une plante à confiture (contrairement à son cousin à baies bleues).",
    givesNote:
      "L'un des tout meilleurs arbustes à oiseaux du Nord-Ouest : une avalanche de baies écarlates en juin que pigeons à queue barrée, tangaras, gros-becs, grives et jaseurs dépouillent en quelques jours. Ses corymbes crème nourrissent d'abord une large foule de petites abeilles et de mouches indigènes.",
    propagationNote:
      "Prenez en hiver des morceaux de tige dormante et nue, gros comme un crayon, et enfoncez-les aux deux tiers en terre humide — la plupart prennent. Par semis c'est plus lent : nettoyez la pulpe, puis donnez une période chaude suivie de trois mois de froid humide, ce qu'un semis d'automne dehors fait pour vous.",
    supportNotes: {
      "cedar-waxwing":
        "L'avalanche de baies écarlates de juin est dépouillée par les jaseurs et les pigeons à queue barrée en quelques jours.",
      "berry-songbirds":
        "Tangaras, gros-becs et grives se pressent tous dans un sureau rouge en fruits.",
    },
  },
  "Vaccinium ovatum": {
    nativeNote:
      "L'airelle persistante et luisante du sous-bois des forêts côtières et des caps, de la Colombie-Britannique au centre de la Californie.",
    careNote:
      "Elle exige un sol acide bien pourvu en terreau de feuilles ou en écorce et un drainage qui ne stagne jamais — un massif paillé sous les conifères est son idée du paradis. Lente les premières années, et elle veut de l'eau ces étés-là ; ensuite elle est robuste, accepte l'ombre et ne demande aucune taille. Le plein soleil convient sur la côte, la mi-ombre à l'intérieur.",
    givesNote:
      "Airelles et myrtilliers sont parmi les arbustes à chenilles les plus productifs qui soient, et celui-ci reste vert tout l'hiver comme couvert. Ses fleurs roses en urne nourrissent bourdons et osmies au printemps ; ses baies noires, tardives et sucrées, nourrissent grives, tohis et gélinottes (et vous) jusqu'à l'automne.",
    propagationNote:
      "Prélevez les pousses de l'année en fin d'été, une fois aoûtées mais avant qu'elles ne durcissent, et faites-les raciner sous abri dans un mélange de sable et de tourbe — c'est lent mais fiable. Par semis, écrasez des baies mûres, rincez la graine, et pressez-la à la surface d'un terreau acide humide sans la recouvrir ; il lui faut de la lumière pour lever.",
    supportNotes: {
      "mason-bees":
        "Les fleurs d'airelle se pollinisent par vibration — ce sont les osmies, les andrènes et les bourdons qui font réellement le fruit.",
      "berry-songbirds":
        "Ses baies noires tardives nourrissent grives, tohis et gélinottes bien avant dans l'automne.",
    },
  },
  "Physocarpus capitatus": {
    nativeNote:
      "Arbuste de bord de cours d'eau et de fourré humide du versant ouest, nommé pour son écorce qui s'exfolie en couches multiples.",
    careNote:
      "À peu près aussi facile qu'un arbuste indigène puisse l'être : il prend les crues d'hiver, la sécheresse d'été une fois installé, l'argile et la taille sévère sans se plaindre. Donnez-lui de la place — il s'arque large — et supprimez les vieilles tiges à la base plutôt que de tondre le dessus.",
    givesNote:
      "Ses dômes de fleurs blanches denses du début de l'été sont durement travaillés par les abeilles, les guêpes et les syrphes indigènes ; ses têtes de graines sèchent en brun-rouge et tiennent tout l'hiver. Là où il gagne vraiment sa place, c'est dans un jardin de pluie ou sur un talus — son système racinaire est un filet qui tient la terre à travers une tempête.",
    propagationNote:
      "Des boutures dormantes et nues prises en hiver et enfoncées en terre humide s'enracinent facilement. Le semis est tout aussi simple : récoltez les follicules secs et papyracés à l'automne, émiettez-les, et semez la graine en surface dans un pot laissé dehors tout l'hiver.",
    supportNotes: {
      "bumble-bees":
        "Ses dômes de fleurs blanches denses du début de l'été sont durement travaillés par les bourdons et d'autres abeilles indigènes.",
    },
  },
  "Lonicera involucrata": {
    nativeNote:
      "Chèvrefeuille arbustif des fourrés frais, des berges et des broussailles littorales du versant ouest.",
    careNote:
      "Franchement facile sur tout terrain frais, y compris l'extrémité détrempée d'un jardin de pluie, et il encaisse le vent salé sur la côte. Il peut s'effiler — supprimez quelques-unes des plus vieilles tiges en fin d'hiver et il se regarnit.",
    givesNote:
      "Ses fleurs jaunes en tube, par paires d'avril à juillet, sont un bar à colibris de longue durée, portées dans des bractées qui rougissent à l'écarlate à mesure que les deux baies noires mûrissent — un signal qui attire grives, tangaras et jaseurs. Pas une plante à manger pour un humain ; celles-là sont pour les oiseaux.",
    propagationNote:
      "Les pousses de l'année, prises en fin d'été à mesure qu'elles s'aoûtent, s'enracinent bien sous abri. Par semis, débarrassez les baies noires de leur pulpe et donnez à la graine environ trois mois de froid humide avant de semer au printemps.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs jaunes en tube par paires courent d'avril à juillet — une plante à nectar à colibris de longue saison.",
      "berry-songbirds":
        "Ses bractées écarlates signalent les deux baies noires aux grives, aux tangaras et aux jaseurs.",
    },
  },
  "Corylus cornuta": {
    nativeNote:
      "Le noisetier indigène des lisières boisées et des clairières du versant ouest — la variété d'ici est l'occidentale californica.",
    careNote:
      "Un arbuste peu exigeant à plusieurs troncs pour une lisière boisée ou une haie libre, heureux à mi-ombre et dans les étés secs une fois en place. Il drageonne doucement en cépée ; supprimez les plus vieilles tiges au ras du sol tous les quelques hivers. Ses chatons de janvier lâchent un pollen porté par le vent, à noter si le noisetier vous fait éternuer.",
    givesNote:
      "Un solide hôte à chenilles, et les noisettes — dans leur long involucre en bec — sont le trophée d'automne des geais de Steller, des pigeons à queue barrée, des écureuils et des tamias, qui y arrivent presque toujours avant vous. Ses chatons pendants sont le premier signe du printemps sur le versant ouest, souvent dès janvier.",
    propagationNote:
      "Ramassez les noisettes au début de l'automne avant les geais, et donnez-leur environ quatre mois de froid humide avant un semis de printemps — ou semez-les simplement dehors dans un pot à l'épreuve des rongeurs et laissez l'hiver s'en charger. Les branches basses fixées au sol s'enracinent aussi et se détachent l'année suivante.",
    supportNotes: {
      "acorn-mammals":
        "Les noisettes sont des calories d'automne pour les écureuils et les tamias, qui y arrivent d'ordinaire les premiers.",
      "acorn-birds":
        "Geais de Steller et pigeons à queue barrée prennent les noisettes — et les geais en enterrent plus qu'ils n'en mangent.",
    },
  },
  "Oemleria cerasiformis": {
    nativeNote:
      "Le premier arbuste à feuiller et à fleurir sur le versant ouest — lisières boisées, bords de route et forêts secondaires de la Colombie-Britannique au centre de la Californie.",
    careNote:
      "Peu exigeant à mi-ombre sur un terrain ordinaire, et il accepte l'été sec une fois en place. Deux choses à savoir avant d'acheter. C'est une chose drageonnante, dressée et plutôt lâche — plantez-le en lisière boisée ou dans une haie, pas en sujet de pelouse. Et les fleurs mâles et femelles sont sur des pieds séparés : si vous voulez des fruits, il vous en faut au moins un de chaque ; les pépinières les étiquettent rarement, achetez-en donc trois et laissez faire les probabilités. Dès juillet il a l'air fatigué et perd quelques feuilles — c'est normal pour un arbuste qui a démarré en février.",
    givesNote:
      "C'est la plante qui met fin à l'hiver ici. Ses clochettes pendantes vert-blanc, à la légère odeur de concombre, s'ouvrent en février — des semaines avant tout le reste de cette liste — et cette date est tout l'intérêt. Une reine de bourdon qui sort de terre au premier jour doux a brûlé sa graisse d'hiver et a des jours, pas des semaines, pour trouver du sucre avant de pouvoir fonder un nid ; l'Oemleria, avec le noisetier, est ce qu'elle trouve. Osmies et premiers syrphes le travaillent aussi. Son petit fruit en forme de prune mûrit bleu-noir en juin pour les merles d'Amérique, les jaseurs, les renards et les coyotes, en général avant qu'une personne ait pu en goûter un.",
    propagationNote:
      "Le plus facile est de soulever en fin d'hiver l'un des drageons enracinés autour de la base d'une touffe installée. Les boutures nues d'hiver enfoncées en terre humide prennent aussi. Par semis, débarrassez le fruit mûr de juin de sa pulpe aussitôt — il ne doit pas sécher — et donnez aux noyaux environ trois mois de froid humide avant un semis de printemps.",
    supportNotes: {
      "bumble-bees":
        "Une reine de bourdon sort de terre au premier jour doux de février avec sa graisse d'hiver presque épuisée, et elle a des jours — pas des semaines — pour trouver du sucre avant de pouvoir fonder un nid. L'Oemleria est ce qui est ouvert. Ce seul fait est toute la raison de la présence de cette plante sur la liste.",
      "mason-bees":
        "Osmies et andrènes travaillent aussi les clochettes pendantes, avec les premiers syrphes — la nourriture la plus précoce de la région pour les abeilles solitaires, hormis le noisetier.",
      "berry-songbirds":
        "De petites prunes bleu-noir mûrissent en juin pour les merles d'Amérique, les jaseurs et les tohis, en général avant qu'une personne ait pu en goûter une.",
    },
  },
  "Spiraea douglasii": {
    nativeNote:
      "L'arbuste aux plumets roses des prairies humides, des rives de lac, des fossés et de l'extrémité détrempée de chaque vieux pâturage du versant ouest.",
    careNote:
      "Si vous avez construit un jardin de pluie et ne savez pas quoi mettre dans le fond humide, c'est la réponse — elle accepte des semaines d'eau stagnante en hiver puis l'août sec qui suit. Le hic est dans son autre nom : elle court à la racine et se densifie en un fourré serré, ce qui est exactement ce que vous voulez le long d'un fossé ou d'un bord d'étang et exactement ce que vous ne voulez pas dans un massif d'un mètre. Donnez-lui de la place, ou passez la bêche autour chaque printemps. Coupez un tiers des plus vieilles tiges au ras du sol en fin d'hiver et elle fleurit plus fort.",
    givesNote:
      "Ses épis duveteux rose fuchsia se dressent en juillet et août — la portion la plus chaude et la plus maigre de l'année en nectar — et ils sont travaillés toute la journée par les bourdons, les petites abeilles indigènes, les syrphes et les papillons. Ses têtes de graines sèchent en rouille et gardent leur forme tout l'hiver, et sous la terre son matelas de racines est l'une des meilleures choses à planter pour ralentir une averse et tenir un talus humide en place.",
    propagationNote:
      "La voie la plus simple, de loin, est de trancher un morceau enraciné au bord coureur d'une touffe au début du printemps et de le replanter. Les extrémités de pousses vertes tendres prises au début de l'été s'enracinent volontiers dans un mélange humide. La graine est fine comme de la poussière — pressez-la à la surface d'un terreau mouillé à l'automne, ne la couvrez pas, et laissez le pot dehors.",
    supportNotes: {
      "bumble-bees":
        "Les épis rose fuchsia se dressent en juillet et août — la portion la plus maigre de l'année en nectar ici — et les bourdons les travaillent dès le petit jour.",
    },
  },

  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — vivaces.
  // -------------------------------------------------------------------------
  "Camassia quamash": {
    nativeNote:
      "Fleur sauvage à bulbe des prairies humides et des prés du versant ouest ; un aliment de base des peuples du Nord-Ouest.",
    careNote:
      "Elle adore un terrain humide en hiver et au printemps et sec en été — exactement le régime du versant ouest. Elle entre en dormance complète au milieu de l'été : ne bêchez pas là où elle disparaît. Elle se naturalise en nappes au fil des années.",
    givesNote:
      "Des draps de fleurs bleues printanières nourrissent les reines de bourdons et les osmies, et elle recrée l'habitat de prairie humide en voie de disparition qui nourrissait autrefois à la fois les gens et les pollinisateurs.",
    propagationNote:
      "Semez la graine nettoyée à l'automne et laissez-la prendre le froid de l'hiver, mais soyez patient — les bulbes mettent plusieurs années à atteindre la taille de floraison. Plus rapide : soulevez les touffes en dormance en été et séparez délicatement les petits caïeux.",
    supportNotes: {
      "bumble-bees":
        "Les épis bleus printaniers du camas sont une source majeure de nectar et de pollen précoces dans les prairies de l'Ouest.",
      "mason-bees":
        "Il fleurit pendant la fenêtre de nidification des abeilles solitaires, dans l'habitat de chênaie-prairie.",
    },
    lookalikeNotes: {
      "toxicoscordion-venenosum": {
        why: "Ils poussent dans les mêmes prés humides de printemps, à partir de bulbes qui se ressemblent, avec les mêmes feuilles graminiformes — et l'un des deux est mortel.",
        tells: [
          { feature: "Couleur de la fleur", native: "Des étoiles bleu-violet profond.", lookalike: "Blanc crème à verdâtre, avec une glande verte à la base de chaque pétale." },
          { feature: "L'épi", native: "Haut et ouvert, s'ouvrant du bas vers le haut.", lookalike: "Plus court, plus étroit et serré, près du sommet de la tige." },
          { feature: "Hors floraison", native: "Impossible à distinguer avec certitude du camas mortel. Marquez l'endroit où les fleurs bleues étaient et ne vous fiez à rien d'autre.", lookalike: "Impossible à distinguer avec certitude non plus — et toutes ses parties sont toxiques, le bulbe surtout." },
          { feature: "Pourquoi cela compte", native: "Une plante alimentaire de base des peuples du Nord-Ouest depuis des milliers d'années, et une clé de voûte des prés.", lookalike: "Il a empoisonné du bétail et des personnes. Il est indigène ici aussi — simplement, ce n'est pas le bon." },
        ],
      },
    },
  },
  "Achillea millefolium": {
    nativeNote:
      "Indigène (sous sa forme sauvage) dans les prés, les prairies et les bords de route du versant ouest.",
    careNote:
      "À peu près aussi robuste qu'une plante puisse l'être — elle prospère sur un sol chaud, sec et pauvre et s'étend pour occuper l'espace. Cherchez la forme blanche sauvage, pas les cultivars colorés, pour la plus grande valeur faunistique.",
    givesNote:
      "Ses corymbes plats sont une piste d'atterrissage pour une énorme gamme de petites abeilles indigènes, de syrphes, de guêpes et de papillons tout l'été, sur une plante qui survit à l'abandon total.",
    propagationNote:
      "La graine est minuscule et a besoin de lumière : répandez-la en surface et couvrez-la à peine. Plus facile encore, soulevez et séparez les touffes au printemps ou à l'automne — elle se divise sans se plaindre et se réenracine vite.",
    supportNotes: {
      "bumble-bees":
        "Ses corymbes plats sont une piste d'atterrissage commode travaillée par de nombreuses petites abeilles indigènes et insectes auxiliaires.",
    },
  },
  "Aquilegia formosa": {
    nativeNote:
      "Fleur sauvage indigène des lisières boisées, des suintements et des clairières du versant ouest.",
    careNote:
      "Facile à l'ombre tamisée ou à mi-soleil avec une humidité moyenne. Chaque pied vit peu, mais elle se ressème pour persister. Donnez-lui un peu d'eau l'été dans un emplacement ensoleillé.",
    givesNote:
      "Ses lanternes penchées rouge et jaune fleurissent juste au moment où les colibris roux nichent, et attirent aussi les bourdons à longue langue.",
    propagationNote:
      "Semez la graine fine en surface, à la lumière, et un hiver froid et humide — ou simplement un semis dehors à l'automne — l'aide à se réveiller. Une fois que vous avez un pied, elle se ressème discrètement : laissez quelques têtes mûrir et se répandre.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses éperons penchés rouge et jaune sont une fleur à colibris, accordée à leur arrivée de printemps.",
    },
  },
  "Penstemon serrulatus": {
    nativeNote:
      "Penstémon indigène des prés frais, des bords de cours d'eau et des bois clairs du versant ouest.",
    careNote:
      "L'un des penstémons indigènes les plus faciles sur le versant ouest, plus humide — contrairement à ses cousins des pays secs, il accepte l'humidité ordinaire d'un jardin. Rabattez-le après la floraison pour une éventuelle seconde poussée.",
    givesNote:
      "Ses bouquets de tubes bleu-violet sont un aimant à bourdons, ses principaux pollinisateurs, ainsi qu'à d'autres abeilles indigènes.",
    propagationNote:
      "Donnez à la petite graine un hiver froid et humide avant qu'elle ne lève. Vous pouvez aussi prendre des boutures tendres sur les pousses neuves au début de l'été, ou soulever et séparer les touffes installées au printemps.",
    supportNotes: {
      "bumble-bees":
        "Ses fleurs tubulaires bleu-violet sont fortement travaillées par les bourdons.",
      "annas-rufous-hummingbird":
        "Visité aussi par les colibris, qui sondent les fleurs les plus profondes.",
    },
  },
  "Eriophyllum lanatum": {
    nativeNote:
      "Fleur sauvage aux feuilles argentées des falaises, des prairies et des bords de route secs et ensoleillés du versant ouest.",
    careNote:
      "Elle veut le plein soleil et un drainage franc et supporte mal les sols riches et humides — un bouche-trou bas et à l'épreuve de la sécheresse, parfait pour un talus chaud ou une rocaille. Aucune eau une fois installée.",
    givesNote:
      "Un feuillage argenté et laineux surmonté de marguerites dorées qui nourrissent les abeilles indigènes et les papillons au début de l'été, sur le terrain le plus pauvre et le plus sec.",
    propagationNote:
      "Répandez la graine en surface pour qu'elle reçoive de la lumière, et un passage froid et humide aide à la déclencher. Les boutures tendres du début de l'été s'enracinent bien aussi. Elle vit peu mais se ressème : laissez tomber un peu de graine pour l'entretenir.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Une floraison d'astéracée de l'Ouest qui fait vivre les abeilles spécialistes du pollen d'astéracées de la région.",
    },
  },
  "Asclepias speciosa": {
    nativeNote:
      "L'asclépiade commune de l'Ouest — indigène des terrains ouverts et ensoleillés de la vallée de la Willamette, du corridor du Columbia et vers l'est jusque dans l'intérieur.",
    careNote:
      "Donnez-lui le plein soleil et un terrain pauvre et bien drainé, puis laissez-la tranquille — elle s'étend par coulants souterrains et sortira à un mètre de là où vous l'avez plantée : une bande de prairie ou une bande de trottoir lui convient mieux qu'un massif net. Sa sève laiteuse est irritante et la plante est toxique si on l'avale, ce qui est précisément pourquoi les chenilles de monarque peuvent la manger et presque rien d'autre ne peut.",
    givesNote:
      "La seule chose qu'une chenille de monarque puisse manger, et la population de monarques de la côte Ouest a suffisamment chuté pour que chaque carré compte. Ses lourds dômes de fleurs roses sont aussi l'une des sources de nectar les plus riches du plein été pour les bourdons, et sa bourre de graines garnit les nids de chardonnerets et de colibris.",
    propagationNote:
      "Ouvrez les gousses sèches à l'automne avant qu'elles n'éclatent et détachez la graine de la bourre. Il lui faut environ un mois de froid humide au réfrigérateur — ou un semis d'automne dehors — avant de lever au printemps. De courts morceaux de la racine coureuse, prélevés au début du printemps, deviennent aussi de nouveaux pieds.",
    supportNotes: {
      monarch:
        "L'asclépiade commune de l'Ouest, et la seule chose qu'une chenille de monarque puisse manger — la population de monarques de l'Ouest a suffisamment chuté pour que chaque carré compte.",
      "bumble-bees":
        "Ses lourds dômes de fleurs roses sont l'une des sources de nectar les plus riches du plein été pour les bourdons.",
    },
  },
  "Solidago lepida": {
    nativeNote:
      "La verge d'or du Canada du versant ouest, des prés, des fossés et des terrains ouverts ; les flores plus anciennes la traitent comme Solidago canadensis var. salebrosa.",
    careNote:
      "Assez robuste pour un bord de route, et elle se comporte comme telle — courant à la racine en une large plaque. Plantez-la là où elle peut le faire, ou passez la bêche autour chaque printemps. Laissez les tiges debout tout l'hiver : les abeilles nichent dans les creuses. Et l'accusation de rhume des foins est une erreur d'identité — le pollen de verge d'or est lourd et porté par les insectes ; l'ambroisie, qui fleurit au même moment, est la coupable.",
    givesNote:
      "Parmi les plantes les plus précieuses de toute cette liste. Les verges d'or hébergent plus d'espèces de chenilles qu'aucun autre groupe de vivaces indigènes, et la floraison de fin d'été est le plus grand événement à nectar et à pollen de l'année pour les bourdons, les abeilles solitaires et les papillons migrateurs qui font leurs réserves. Sa graine porte les chardonnerets jusqu'en hiver.",
    propagationNote:
      "La voie facile est de déterrer une touffe au début du printemps et de la séparer en morceaux enracinés — elle se défait dans les mains. Par semis, semez les têtes cotonneuses à la surface d'un terreau humide à l'automne et laissez le pot dehors ; la graine est fine et a besoin de lumière, ne l'enterrez pas.",
    supportNotes: {
      "sunflower-specialist-bees":
        "La verge d'or est la plante classique de fin de saison pour les abeilles qui ne peuvent utiliser que le pollen d'astéracées.",
      "bumble-bees":
        "La floraison de fin d'été est le plus grand événement à nectar de l'année pour les reines de bourdons qui s'engraissent pour l'hiver.",
      "american-goldfinch":
        "Les têtes de graines laissées debout portent les chardonnerets tout l'hiver.",
    },
  },
  "Symphyotrichum subspicatum": {
    nativeNote:
      "L'aster bleu commun des prés, des talus de fossé, des falaises littorales et des bancs de rivière du versant ouest.",
    careNote:
      "Peu exigeant jusqu'à l'envahissement : il court à la racine et se ressème, donnez-lui donc une prairie, un bord de fossé ou un grand massif libre plutôt qu'un massif que vous voulez voir rester en place. Le rabattre de moitié début juin le rend plus touffu et l'empêche de s'affaler. Laissez les tiges debout tout l'hiver pour les insectes qui y sont.",
    givesNote:
      "Les asters sont l'autre moitié du duo de fin de saison avec la verge d'or, et à eux deux ils portent le réseau alimentaire d'août jusqu'aux gelées — l'un des meilleurs hôtes à chenilles parmi les vivaces, et le dernier gros repas de nectar avant l'hiver pour les reines de bourdons et les papillons migrateurs.",
    propagationNote:
      "Déterrez et séparez la touffe au début du printemps — chaque morceau muni de racines poussera. La graine peut être semée à la surface d'un terreau humide à l'automne et laissée dehors pour l'hiver ; pressez-la mais ne la couvrez pas.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Asters et verges d'or sont ce dont dépendent les abeilles spécialistes du pollen d'astéracées pour finir la saison.",
      "bumble-bees":
        "Le dernier gros repas avant les gelées pour les bourdons et les papillons migrateurs.",
    },
  },
  "Lupinus polyphyllus": {
    nativeNote:
      "Le grand lupin des prés humides du versant ouest — le parent sauvage des lupins Russell de jardin.",
    careNote:
      "Il veut du soleil et une terre qui reste fraîche jusqu'au début de l'été — il boude dans un massif chaud et sec. Comme les autres légumineuses il fabrique son propre azote : ne le nourrissez pas. Les pieds ne vivent pas longtemps ; laissez quelques gousses mûrir et il se remplace. Les graines sont toxiques si on en avale en quantité.",
    givesNote:
      "Des épis bleus que les bourdons travaillent toute la journée, et la plante nourricière d'un groupe de petits azurés — dont le Glaucopsyche lygdamus — dont les chenilles mangent du lupin et sont soignées par des fourmis pour les gouttes sucrées qu'elles exsudent. Ses racines laissent la terre plus riche qu'elles ne l'ont trouvée.",
    propagationNote:
      "Récoltez les gousses juste au moment où elles noircissent, avant qu'elles ne se vrillent et projettent la graine. Le tégument est dur : entaillez chaque graine à la lime ou frottez-la au papier de verre — ou faites-la tremper une nuit dans de l'eau tiède — puis semez. Il supporte mal d'être déterré et déplacé : semez-le là où vous le voulez.",
    supportNotes: {
      "bumble-bees":
        "Des épis bleus que les bourdons travaillent toute la journée — les fleurs de lupin ne s'ouvrent que pour un insecte assez lourd pour en déclencher le ressort.",
    },
  },
  "Anaphalis margaritacea": {
    nativeNote:
      "Vivace aux feuilles argentées des terrains secs, ouverts et pauvres du versant ouest — bords de route, clairières et bancs de gravier.",
    careNote:
      "L'une des rares bonnes plantes pour le pire emplacement que vous ayez — du gravier, un talus chaud, une bande de trottoir — où elle n'a besoin d'aucune eau. Dans une bonne terre de jardin elle s'affale et court. Elle s'étend à la racine ; un coup de bêche autour au printemps est tout l'entretien.",
    givesNote:
      "La plante nourricière des chenilles de la vanesse de Virginie, dont les jeunes s'enveloppent dans les feuilles argentées et la soie. Ses bouquets de fleurs blanches papyracées nourrissent les petites abeilles indigènes tard dans la saison, puis sèchent sur la tige — l'« immortelle » de son nom — en gardant leur forme tout l'hiver.",
    propagationNote:
      "Divisez une touffe au printemps — elle se défait facilement et chaque morceau enraciné prend. La graine est fine comme de la poussière : pressez-la à la surface d'un terreau humide sans la couvrir, et gardez-la à la lumière.",
    supportNotes: {
      "american-lady":
        "L'anaphale est une plante nourricière principale de la vanesse de Virginie, dont les jeunes s'enveloppent dans les feuilles laineuses et la soie.",
    },
  },
  "Viola adunca": {
    nativeNote:
      "La petite violette bleue des prairies, des dunes littorales, des ouvertures de prés et des gazons maigres du versant ouest, de la Colombie-Britannique à la Californie.",
    careNote:
      "Une toute petite plante qui n'a besoin que d'une chose : un terrain ouvert, bas et non fertilisé où des voisins plus hauts ne peuvent pas se refermer sur elle — le bord maigre d'un sentier, une bande de prairie graveleuse, un carré de pelouse que vous cessez de nourrir. Elle traverse l'hiver et le printemps humides et se tait dans la sécheresse d'été, ce qui est le régime du versant ouest : ne l'arrosez donc pas et ne la paillez pas épais. Si vous la gardez dans l'herbe, retenez la tondeuse jusqu'en juillet pour que la graine puisse mûrir. Elle se plante toute seule : les capsules mûres projettent la graine à plus d'un mètre, et elle fait aussi, au ras du sol, des boutons autogames qui ne s'ouvrent jamais, si bien qu'un carré s'épaissit même après un mauvais printemps.",
    givesNote:
      "C'est la carte la plus forte du jeu de la région, et la liste ne l'avait pas. Chaque grand nacré d'ici — l'Argynnis hydaspe, l'A. zerene, l'A. cybele, et l'A. zerene hippolyta du littoral, inscrit sur la liste fédérale des espèces menacées — peut élever ses chenilles sur les violettes et sur absolument rien d'autre. Les femelles pondent en fin d'été, sur un sol sec, à côté de violettes déjà flétries ; les chenilles éclosent, ne mangent rien, passent tout l'hiver ainsi, et vont chercher des feuilles de violette au printemps suivant. Il ne suffit donc pas qu'une violette fleurisse une fois : il faut que le carré soit encore là en avril. Plantez-en une nappe et vous faites la seule chose dont ces papillons ne peuvent pas se passer. Les fleurs elles-mêmes nourrissent tôt les petites abeilles solitaires, et les fourmis emportent la graine et la plantent pour vous.",
    propagationNote:
      "Attrapez la graine avant que les capsules ne se vrillent et ne la projettent — elles mûrissent vite au début de l'été — puis semez-la en pot laissé dehors pour l'hiver, ou directement sur une terre nue ratissée à l'automne ; il lui faut un passage froid et humide avant de lever. Une touffe installée peut aussi être démêlée au début du printemps, chaque souche enracinée continuant comme un pied à part.",
    supportNotes: {
      "greater-fritillaries":
        "Les violettes sont la seule chose qu'une chenille de grand nacré puisse manger — l'Argynnis hydaspe, l'A. zerene, l'A. cybele, et l'A. zerene hippolyta menacé du littoral. Et leur façon d'utiliser la plante est assez inhabituelle pour changer la manière de jardiner pour eux : la femelle pond en fin d'été sur un sol sec, à côté de violettes déjà flétries — elle ne choisit donc pas une plante en feuilles, elle choisit un endroit où elle a déjà trouvé des violettes. La chenille éclôt, ne mange rien, et passe tout l'hiver dans la litière — puis va chercher des feuilles de violette au printemps suivant. Il ne suffit donc pas que le carré fleurisse une fois. Il doit être encore là en avril, sur le même mètre carré.",
      "mason-bees":
        "Les petites fleurs pourpres de printemps sont peu profondes et s'ouvrent tôt, ce qui convient aux petites abeilles solitaires sorties avant la floraison de la plupart des arbustes.",
    },
  },

  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — graminées, grimpantes, couvre-sols et fougères.
  // -------------------------------------------------------------------------
  "Festuca roemeri": {
    nativeNote:
      "Graminée indigène en touffe et ossature des prairies et des savanes à chênes du versant ouest.",
    careNote:
      "Une graminée en touffe indigène nette et à l'épreuve de la sécheresse, pour le soleil — la matrice dans laquelle planter des fleurs sauvages pour une vraie prairie du versant ouest. Ni tonte, ni arrosage, ni engrais une fois installée.",
    givesNote:
      "Ses touffes vert-bleu quasi persistantes hébergent des hespéries, abritent les abeilles nichant au sol et les oiseaux, et tiennent ensemble la terre sèche de la prairie — la charpente vivante d'une savane à chênes restaurée.",
    propagationNote:
      "Semez la graine à l'automne ou au printemps — cette graminée de saison fraîche demande peu ou pas de froid et lève volontiers sur une terre nue. Les touffes installées se déterrent aussi et se séparent en éclats plus petits.",
    supportNotes: {
      "grass-skippers":
        "La fétuque de Roemer est une graminée de prairie que les papillons mangeurs d'herbe utilisent, dans le même habitat de chênaie-prairie dont l'Erynnis propertius a besoin.",
    },
  },
  "Elymus glaucus": {
    nativeNote:
      "La graminée en touffe indigène à tout faire des prairies, des savanes à chênes et des lisières boisées du versant ouest.",
    careNote:
      "La graminée indigène la plus facile à installer ici — elle germe vite et tient un terrain nu dès sa première saison, ce qui explique que les équipes de restauration s'en emparent. Elle est de courte vie pour une graminée en touffe mais se ressème pour rester. Rabattez-la en fin d'hiver, avant la sortie des nouvelles feuilles.",
    givesNote:
      "De la nourriture à chenilles pour les hespéries et les satyres qui ne mangent que des graminées, et ses touffes sont là où ils passent l'hiver — une pelouse tondue ne leur laisse nulle part. Ses épis nourrissent bruants et juncos, et ses racines fibreuses profondes sont ce qui empêche réellement une pente de s'en aller.",
    propagationNote:
      "À peu près la graine la moins capricieuse de cette liste : égrenez les épis mûrs en été et semez-les directement sur une terre ratissée à l'automne — aucun froid, aucun nettoyage nécessaire. Les touffes installées se déterrent aussi et se séparent au début du printemps.",
    supportNotes: {
      "grass-skippers":
        "Une graminée en touffe indigène est à la fois la nourriture des chenilles et l'abri d'hiver des hespéries et des satyres — une pelouse ne leur donne ni l'un ni l'autre.",
    },
  },
  "Carex obnupta": {
    nativeNote:
      "La laîche dominante des terrains humides du versant ouest — bras morts, fossés, bords de marais à marée, bois humides et mares saisonnières, de la Colombie-Britannique à la Californie.",
    careNote:
      "La plante que tout jardin de pluie et tout point bas détrempé du versant ouest attend. Elle se tient dans l'eau d'hiver des mois durant, puis tient bon à travers un août sans pluie, et elle reste verte toute l'année. Elle court à la racine en une large colonie : donnez-lui donc toute la zone humide plutôt qu'une touffe nette, et placez-la là où ses longues feuilles arquées — assez coupantes pour entailler un doigt qu'on ferait glisser dessus — ne barrent pas un passage. Peignez les feuilles mortes aux doigts ou au râteau en fin d'hiver ; c'est là tout l'entretien.",
    givesNote:
      "Les laîches sont ce que mangent les petits papillons bruns — plusieurs hespéries et satyres ne grandissent que sur des laîches et des graminées, et ils hivernent au fond de la touffe, ce qu'un bord tondu ne leur donne jamais. Bruants chanteurs, troglodytes et parulines masquées nichent et se cachent dans les touffes debout, la sauvagine et les bruants prennent la graine, et sous tout cela son matelas racinaire est le meilleur filtre de cette liste : l'eau sort d'un peuplement de cette laîche plus propre et plus lente qu'elle n'y est entrée.",
    propagationNote:
      "La division est la voie fiable : soulevez une touffe au début du printemps, coupez-la en morceaux enracinés de la taille d'un poing à la bêche ou à un vieux couteau à pain, et replantez-les aussitôt dans la vase — ils ne doivent pas sécher entre l'arrachage et la plantation. Le semis marche aussi si vous égrenez les épis bruns mûrs en été et les semez en pot posé dans une soucoupe d'eau tout l'hiver.",
    supportNotes: {
      "grass-skippers":
        "Plusieurs des petites hespéries et satyres bruns grandissent sur des laîches plutôt que sur des graminées, et ils passent l'hiver à l'état de chenille au fond de la touffe. Un bord tondu ne leur donne ni la nourriture ni l'endroit où passer le froid.",
    },
  },
  "Juncus patens": {
    nativeNote:
      "Jonc indigène des suintements, des bords de fossé, des prés frais et des noues de bord de route, de Washington vers le sud jusqu'en Californie.",
    careNote:
      "Une fontaine nette et dressée de tiges raides bleu-gris qui reste en place au lieu de courir — ce qui en fait la seule plante de terrain humide d'ici qu'on puisse utiliser dans un petit jardin de pluie soigné ou près d'une descente d'eau sans le regretter. Il veut l'humidité d'hiver et acceptera un été sec une fois installé, quoiqu'il ait meilleure allure avec un arrosage de temps en temps. Persistant : ne le coupez pas au ras du sol. Retirez simplement les tiges brunes aux doigts en fin d'hiver, comme on peignerait un chien.",
    givesNote:
      "Les joncs sont un couvert plus qu'une nourriture, et le couvert est précisément ce dont un petit jardin humide n'a aucun : grenouilles, carabes et insectes en hivernage passent le froid à l'intérieur de la touffe, juncos et bruants prélèvent la minuscule graine sur les tiges, et le bouchon racinaire dense tient le bord d'une noue tandis que l'eau passe devant. Une poignée de papillons de nuit se nourrit bien de joncs, ce n'est donc pas rien sur ce plan non plus.",
    propagationNote:
      "Soulevez une touffe au printemps et séparez-la, à la main ou au couteau, en morceaux enracinés, puis replantez-les aussitôt en terrain mouillé. Par semis, secouez les têtes brunes mûres au-dessus d'un pot de terreau détrempé à l'automne et laissez-le découvert dehors — la graine est minuscule, a besoin de lumière, et germe le mieux sur une vase qui ne sèche jamais.",
  },
  "Lonicera ciliosa": {
    nativeNote:
      "Chèvrefeuille grimpant indigène des lisières boisées et des fourrés du versant ouest — pas la sorte envahissante.",
    careNote:
      "Une grimpante indigène bien élevée — rien à voir avec les chèvrefeuilles de l'Himalaya ou du Japon envahissants. Donnez-lui un treillage, une clôture ou un arbuste où s'enrouler, les racines à l'ombre et la tête au soleil.",
    givesNote:
      "Ses verticilles de trompettes orange nourrissent les colibris et les baies rouges qui suivent nourrissent les passereaux ; un remplaçant indigène aux lianes ornementales agressives.",
    propagationNote:
      "Prélevez des boutures de pousses en voie d'aoûtement en été, ou fixez une tige basse au sol pour qu'elle s'enracine au point de contact. La graine tirée des baies demande un nettoyage puis un hiver froid et humide avant de lever.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs en trompette orange en font l'une des meilleures lianes à colibris indigènes de l'Ouest.",
    },
  },
  "Rubus ursinus": {
    nativeNote:
      "La seule mûre véritablement indigène du versant ouest — rampant à travers les clairières, les lisières, les brûlis et les bords de route, de la Colombie-Britannique à la Californie.",
    careNote:
      "Il vaut la peine d'être clair sur laquelle des mûres c'est, parce que presque toutes les ronces qu'on maudit ici sont l'autre. Celle-ci a des cannes grêles, rondes en section, pas plus épaisses qu'un lacet, des aiguillons droits et fins, et trois folioles ; la ronce d'Arménie a des cannes arquées grosses comme un pouce, à côtes, des épines crochues comme une griffe de chat, et cinq folioles sur les cannes principales. L'indigène court à plat sur le sol au lieu de s'entasser en muraille. Elle vagabonde tout de même — donnez-lui un talus, une ligne de clôture ou la lisière broussailleuse d'un fourré plutôt qu'un massif, coupez chaque hiver à la base les cannes qui ont fructifié, et relevez les pointes avant qu'elles ne s'enracinent là où vous n'en voulez pas.",
    givesNote:
      "Les ronces sont parmi les toutes premières plantes à chenilles de l'Ouest, et celle-ci est l'indigène : elle paie donc cela plein tarif là où l'envahisseur arménien n'en paie presque rien. Ses fleurs blanches sont couvertes de bourdons et de petites abeilles solitaires au printemps. Puis les mûres — petites, sombres, pleines de pépins, et meilleures que tout ce qu'on peut acheter — pour les tohis, les grives, les geais, les renards et les coyotes, avec le fouillis bas et épineux qui donne aux oiseaux nichant au sol et aux lapins un endroit où se cacher.",
    propagationNote:
      "Elle le fait pour vous : partout où une pointe de canne touche une terre nue elle s'enracine et fait un nouveau pied. En fin d'été, fixez donc une pointe, et au printemps détachez-la avec ses propres racines et déplacez-la. Des morceaux nus de canne enfoncés en terre humide en hiver prennent aussi.",
    supportNotes: {
      "bumble-bees":
        "Ses fleurs blanches de printemps sont ouvertes, peu profondes et partout à la fois, ce qui fait de cette mûre rampante l'un des plus gros repas faciles de l'année, aussi bien pour les bourdons que pour les petites abeilles indigènes.",
      "berry-songbirds":
        "Tohis, grives et geais prennent les petites mûres sombres, et le fouillis bas et épineux dessous est là où un oiseau nichant au sol peut réellement s'en sortir.",
    },
  },
  "Clematis ligusticifolia": {
    nativeNote:
      "Grimpante indigène des bancs de rivière, des fourrés riverains et des vieilles lignes de clôture du versant ouest, et la seule clématite indigène de la région.",
    careNote:
      "Une grande grimpante forte et rapide — elle ensevelira un petit arbuste : donnez-lui une clôture, une tonnelle, un arbre mort ou un talus qu'elle ne peut pas tuer, et taillez-la sévèrement en fin d'hiver. Elle grimpe en vrillant ses pétioles autour des choses plutôt qu'en collant aux murs. Les fleurs mâles et femelles sont sur des pieds séparés : seuls certains font les têtes de graines soyeuses. Sa sève irrite la peau et la bouche, et la plante est toxique à l'ingestion : à tenir à l'écart d'un animal au pâturage. Une chose de plus à vérifier à l'achat : la clématite des haies (Clematis vitalba), introduite, est un envahisseur sérieux ici et se ressemble — les folioles de l'indigène sont grossièrement dentées ou trilobées, celles de l'envahisseur surtout à bord lisse ou à peine dentées, et les vieilles tiges de l'envahisseur deviennent cordées et grosses comme un poignet.",
    givesNote:
      "Sa valeur, c'est la date. Ses fleurs crème écumeuses s'ouvrent en juillet et continuent jusqu'en septembre, dans la longue portion chaude qui suit la fin des arbustes et précède le départ des asters — et les petites abeilles indigènes, les guêpes, les syrphes et les coléoptères s'y jettent. Ensuite elle s'argente de plumets de graines plumeux, que colibris, mésanges buissonnières et parulines démontent pour garnir leurs nids, et le fouillis lui-même devient un couvert de nidification épais dans une haie.",
    propagationNote:
      "Prélevez les pousses de l'année au milieu de l'été, une fois aoûtées, et faites-les raciner sous abri ; ou fixez simplement une tige basse sur la terre et détachez-la une fois enracinée. Par semis, arrachez les graines plumeuses à l'automne et semez-les en pot laissé dehors — il leur faut un hiver froid et humide, et elles peuvent être lentes et inégales.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Après la floraison, elle s'argente de plumets de graines plumeux, et les colibris les arrachent pour garnir l'intérieur d'un nid de la taille d'une noix. Mésanges buissonnières et parulines en prennent aussi. C'est la plante rare qui vaut plus à un oiseau après ses fleurs que pendant.",
    },
  },
  "Fragaria chiloensis": {
    nativeNote:
      "Fraisier indigène aux feuilles luisantes des falaises littorales et des ouvertures sableuses du versant ouest.",
    careNote:
      "Il court par stolons pour tisser un tapis robuste, luisant, résistant à la sécheresse et au sel, au soleil — une excellente alternative au gazon ou une couverture de talus. Il supporte un peu de piétinement.",
    givesNote:
      "Des fleurs blanches printanières pour les abeilles, de petites fraises sucrées pour les oiseaux et les gens, et un couvre-sol quasi persistant qui héberge de nombreuses chenilles et tient un sol sableux.",
    propagationNote:
      "La chose la plus facile de toute cette liste : il émet des stolons qui enracinent de petits plants en voyageant. Coupez simplement un plant enraciné et mettez-le en pot, ou plantez-le là où vous en voulez plus.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches printanières au ras du sol, s'ouvrant avec les premières abeilles solitaires et faciles à travailler pour une petite.",
      "berry-songbirds":
        "De petites fraises rouge foncé en été pour les tohis, les merles d'Amérique et les bruants — et pour qui arrive le premier.",
    },
  },
  "Arctostaphylos uva-ursi": {
    nativeNote:
      "Le manzanita en tapis des terrains secs, ensoleillés et pauvres — falaises littorales, épandages de gravier et bois clairs du versant ouest.",
    careNote:
      "La réponse indigène à un talus chaud et sec où rien ne veut pousser — mais seulement si le drainage est franc et la terre acide et maigre. Il supporte mal les sols riches, l'irrigation d'été et l'ombre, et il est lent à se refermer : plantez serré et paillez à l'écorce ou au gravier le temps qu'il garnisse. Une fois en place, il ne vous demande rien pendant des décennies.",
    givesNote:
      "Un couvert persistant qui tient une pente à travers l'hiver le plus pluvieux, des fleurs roses en clochettes au tout début du printemps pour les reines de bourdons et les osmies qui émergent, et des baies rouges qui restent sur la plante jusqu'en hiver pour les gélinottes, les merles d'Amérique et les tohis, quand il ne reste presque rien.",
    propagationNote:
      "Prélevez les pousses de l'année en fin d'été, une fois aoûtées, et faites-les raciner sous abri dans un mélange graveleux et tourbeux — patience requise, elles mettent des mois. Plus simple encore : les tiges rampantes s'enracinent au contact du sol, fixez-en une et détachez-la l'année suivante.",
    supportNotes: {
      "mason-bees":
        "Ses fleurs roses en clochettes du tout début du printemps nourrissent les reines de bourdons et les osmies qui émergent, avant que grand-chose d'autre ne soit ouvert.",
      "berry-songbirds":
        "Ses baies rouges tiennent jusqu'en hiver pour les gélinottes, les merles d'Amérique et les tohis, quand il ne reste presque rien.",
    },
  },
  "Polystichum munitum": {
    nativeNote:
      "La fougère persistante dominante des sols forestiers du versant ouest.",
    careNote:
      "L'ossature persistante fiable de l'ombre du versant ouest, du frais au surprenamment sec une fois installée. Coupez les vieilles frondes en fin d'hiver, avant que les nouvelles ne se déroulent.",
    givesNote:
      "Elle reste verte tout l'hiver, ses grandes frondes retenant la litière de feuilles et ralentissant l'érosion sur une pente ombragée, et offrant un couvert aux salamandres et à la petite faune. Les fougères nourrissent très peu de chenilles — retenue pour le couvert à l'ombre et contre l'érosion, pas pour sa valeur alimentaire.",
    propagationNote:
      "On peut l'élever à partir des spores qui mûrissent au revers des frondes, mais c'est lent et délicat. Bien plus facile : déterrez une touffe installée au printemps et fendez la souche en morceaux, chacun avec des racines et des frondes.",
  },
  "Struthiopteris spicant": {
    nativeNote:
      "La fougère persistante des forêts fraîches et ombragées du versant ouest — souvent sur du bois en décomposition et des berges. Longtemps connue sous le nom de Blechnum spicant.",
    careNote:
      "Plus difficile que le polystic à épées sur l'humidité : elle veut une vraie ombre, un sol acide bien pourvu en bois décomposé ou en terreau de feuilles, et une terre qui ne sèche jamais complètement en août. Réussissez cela et c'est une beauté — une rosette plate de frondes couchées avec des frondes fertiles étroites et dressées sortant du milieu.",
    givesNote:
      "Un couvert et un abri verts tout l'hiver sur un sol forestier ombragé, tenant la terre d'un talus frais et donnant aux amphibiens et à la petite faune un endroit où être. Comme toutes les fougères elle ne nourrit presque aucune chenille — elle gagne sa place comme habitat et contre l'érosion, pas comme nourriture.",
    propagationNote:
      "Les frondes dressées du milieu portent les spores ; attrapez-les en posant une fronde mûre sur du papier une nuit, puis semez la poussière sur un terreau stérile humide dans un pot couvert et attendez — des mois, pas des semaines. Une touffe installée peut aussi être divisée au printemps, quoiqu'elle boude une saison après.",
  },
  "Sedum oreganum": {
    nativeNote:
      "Orpin indigène aux feuilles charnues des affleurements rocheux, des corniches de falaise, des graviers et des falaises littorales du versant ouest, de l'Alaska au nord de la Californie.",
    careNote:
      "Fait pour l'endroit dont rien d'autre ne veut : un bord d'allée de gravier, un dessus de mur, une bande de caillasse brûlante à côté de l'entrée, un toit végétalisé, un creux de rocher. Il stocke sa propre eau dans ces feuilles gonflées en bonbons : la façon de le tuer est donc la gentillesse — une terre riche, un paillis, de l'ombre ou un arroseur. Donnez-lui du gravier, du soleil, et rien d'autre. Il se referme lentement en un tapis qui bronze au rouge là où le soleil frappe le plus fort, et toute rosette qui se casse et tombe sur la terre s'enracine tout simplement.",
    givesNote:
      "Petit, et porteur d'une histoire hors de proportion avec lui : les chenilles du Callophrys mossii, un petit papillon gris-brun qui vole au tout début du printemps, mangent des orpins indigènes et à peu près rien d'autre, et les apollons des pentes plus hautes l'utilisent aussi. Au cœur de l'été, ses fleurs jaunes étoilées sont un bar à nectar pour les petites abeilles solitaires, sur un terrain si pauvre que rien d'autre n'offre quoi que ce soit. Il fait aussi un vrai travail en tenant une terre maigre sur une paroi rocheuse nue où toute plante à racines plus profondes glisserait simplement.",
    propagationNote:
      "La plante la plus facile à copier de toute cette liste : cassez une rosette ou un court morceau de tige, posez-le sur du gravier humide, et il s'enracine en quelques semaines — sans recouvrement, sans hormone, sans façon. Diviser un tapis au printemps marche pareil. La graine est fine comme de la poussière et a besoin de lumière : pressez-la à la surface d'un mélange graveleux et ne l'enterrez jamais.",
    supportNotes: {
      "mosses-elfin":
        "Les chenilles du Callophrys mossii mangent des orpins indigènes et rien d'autre, et elles mangent les fleurs et les graines en formation plutôt que les feuilles charnues. C'est un papillon de rocher — un mur, un affleurement, un toit de gravier — et c'est donc l'une des rares plantes qui transforment un terrain franchement hostile en habitat.",
    },
  },
  "Eriogonum umbellatum": {
    nativeNote:
      "Sarrasin sauvage indigène en tapis des ouvertures sèches, rocheuses et ensoleillées — falaises de la gorge du Columbia, pentes des Cascades et des Klamath, et pelouses sommitales du versant ouest.",
    careNote:
      "Plein soleil et drainage franc, puis laissez-le entièrement tranquille — ni engrais, ni eau d'été, ni paillis sur la souche. C'est un tapis ligneux bas de petites feuilles, vertes dessus et feutrées de blanc dessous, qui pousse de courtes hampes de petites ombelles jaunes. Les fleurs vieillissent en passant du crème à un cuivre rouillé et restent sur la plante des semaines après, ce qui est la moitié de la raison de le cultiver. Il boude et pourrit dans une argile lourde et humide ; sur un talus graveleux ou une rocaille il dure des années.",
    givesNote:
      "Les sarrasins sauvages indigènes sont les plantes à nectar à tout faire des terrains secs de l'Ouest — peu de choses sur un sol pauvre sont plus animées de petites abeilles indigènes, de guêpes et de coléoptères au plus fort de l'été. Ils sont aussi la nourriture des chenilles de toute une série de petits papillons, les azurés et les théclas que presque personne ne remarque, et pour plusieurs d'entre eux le sarrasin est la seule plante sur laquelle ils pondront. Juncos et autres petits oiseaux en prélèvent la graine à l'automne.",
    propagationNote:
      "Égrenez les têtes de graines sèches en fin d'été et semez-les dans un pot de terreau graveleux laissé dehors pour l'hiver ; c'est un passage froid et humide qui les réveille. Les boutures des pousses de l'année, prises en fin d'été une fois aoûtées et enracinées dans du gravier pur, sont l'autre voie. Il a une racine pivotante profonde et supporte mal d'être déplacé : plantez-le petit et mettez-le là où il restera.",
    supportNotes: {
      "buckwheat-butterflies":
        "Les sarrasins sauvages portent tout un cortège de petits papillons que presque personne ne remarque — les azurés et les théclas verts — et plusieurs d'entre eux ne pondront que sur du sarrasin. Un carré sur un talus chaud et pauvre fait plus pour eux qu'un massif de fleurs à nectar.",
      "bumble-bees":
        "Ses ombelles plates, du crème à la rouille, courent tout au long de la portion la plus sèche de l'été, quand une pente sèche n'a presque rien d'autre d'ouvert.",
    },
  },
  "Adiantum aleuticum": {
    nativeNote:
      "La capillaire à tiges noires des suintements, des zones d'embrun de cascade et des berges ombragées du versant ouest, de l'Alaska à la Californie.",
    careNote:
      "La plus belle fougère d'ici et la moins indulgente : des tiges noires et fines portant un éventail plat de folioles vert pâle qui frémissent au moindre souffle. Elle veut ce qu'une corniche de cascade lui donne — de l'ombre profonde, une terre qui ne sèche jamais complètement en août, et un air qui ne cuit pas. Un mur nord avec une descente d'eau à côté, ou le bord ombragé d'un bassin, en est assez proche. Une demi-journée de soleil d'après-midi ou un seul août oublié et elle se recroqueville. Elle disparaît complètement en hiver : marquez son emplacement, et paillez-la au terreau de feuilles plutôt qu'à l'écorce.",
    givesNote:
      "Soyons honnêtes sur celle-ci : les fougères ne nourrissent presque aucune chenille, et elle est ici pour ce qu'elle fait plutôt que pour ce qu'elle nourrit. Elle tient une terre ombragée et fraîche sur un talus qui, sinon, s'en irait, garde le sol dessous frais et humide pour les salamandres, les coléoptères et la petite vie que les oiseaux chassent, et elle fait d'un coin sombre et difficile un endroit où l'on a envie de se tenir.",
    propagationNote:
      "Le plus simple est de soulever une touffe au début du printemps, juste au moment où les nouvelles frondes sont enroulées en crosses à la surface, et de couper la souche rampante en morceaux portant chacun un point de croissance. Replantez-les peu profond dans une terre humide et feuillue. Les spores, sous les bords enroulés des frondes, poussent aussi, semées sur un terreau stérile humide dans un pot couvert, mais il faut près d'un an avant que quoi que ce soit ressemble à une fougère.",
  },
  "Woodwardia fimbriata": {
    nativeNote:
      "La plus grande fougère du versant ouest — suintements, ravins forestiers humides et berges, de la Colombie-Britannique vers le sud à travers les chaînes côtières et les Klamath.",
    careNote:
      "Pas une plante de petit massif : une seule fronde atteint deux à trois mètres sur un site humide, s'arquant hors d'une souche massive — donnez-lui la place que vous donneriez à un arbuste. Ce sur quoi elle n'admet aucun compromis, c'est l'eau à la racine toute l'année — un suintement, un bord d'étang, le pied humide d'un talus exposé au nord, l'extrémité de trop-plein d'un jardin de pluie — avec de l'ombre ou de la mi-ombre au-dessus. Elle garde ses frondes dans les hivers doux et paraît malmenée après une forte gelée ; coupez les abîmées à la base en fin d'hiver et elle repart plus grande. Lente les trois premières années, puis soudain architecturale.",
    givesNote:
      "La même réserve honnête que pour les autres fougères : presque rien ne la mange. Ce qu'elle donne, c'est de la structure et de l'abri à une échelle qu'aucune autre plante d'ombre d'ici n'offre — un espace frais, humide et perpétuellement ombragé en dessous, où vivent salamandres, grenouilles, carabes et insectes en hivernage, où chassent les troglodytes, et où la terre d'un talus humide reste en place à travers un hiver de pluie. Dans un jardin de pluie ombragé, c'est la plante qui fait que l'extrémité humide a l'air voulue.",
    propagationNote:
      "Les rangées de sporanges en chaîne le long des nervures, au revers des frondes, lui donnent son nom ; posez une fronde mûre sur du papier une nuit pour en recueillir la poussière, puis semez-la sur un terreau stérile humide dans un pot couvert et comptez attendre de longs mois. Les vieilles grosses souches se fendent au début du printemps à la scie, chaque morceau gardant des racines et un point de croissance, mais elles boudent une saison après.",
  },

  // -------------------------------------------------------------------------
  // Le taxon partagé avec le Mid-Atlantic : la clé simple y porte la version
  // du Mid-Atlantic, celle-ci porte la version du versant ouest.
  // -------------------------------------------------------------------------
  "Cornus sericea@pnw": {
    nativeNote:
      "Arbuste indigène des berges, des prés humides et des fossés du versant ouest.",
    careNote:
      "Il s'étend par coulants souterrains en un fourré — excellent pour un point bas détrempé ou une berge qui s'érode, mais donnez-lui de la place. Coupez chaque année un tiers des plus vieilles tiges pour la couleur d'hiver la plus vive.",
    givesNote:
      "Des tiges d'hiver rouge éclatant, des fleurs blanches pour les pollinisateurs, des baies blanches pour les oiseaux migrateurs, et l'une des meilleures plantes pour stabiliser un terrain humide en train de s'éroder.",
    propagationNote:
      "À peu près aussi simple qu'une plantation puisse l'être — enfoncez des boutures ligneuses dormantes en terre humide en hiver et elles s'enracinent. Les branches basses qui touchent le sol s'enracinent aussi d'elles-mêmes, et vous pouvez les détacher et les déplacer.",
    supportNotes: {
      "cedar-waxwing":
        "Ses baies blanches de fin d'été sont un fruit riche en graisses qui arrive exactement quand les passereaux commencent à descendre vers le sud — une bande de jaseurs peut vider un fourré en une après-midi.",
      "berry-songbirds":
        "Merles d'Amérique, grives et pics flamboyants se nourrissent tous des fruits du cornouiller stolonifère, et le fourré lui-même est un couvert de nidification sur une lisière humide où peu de choses poussent.",
    },
  },
};
