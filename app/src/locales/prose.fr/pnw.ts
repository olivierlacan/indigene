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
      "Lent mais extraordinairement longévif et résistant à la sécheresse une fois installé — sa racine pivotante le rend autonome mais difficile à transplanter : plantez-en un petit et laissez-le. L'habitat menacé de chênaie-prairie de l'Ouest dépend de lui.",
    givesNote:
      "Les chênes comptent parmi les arbres qui nourrissent le plus d'espèces de chenilles — des centaines — plus des glands pour les geais, les pics et les mammifères, et l'ossature de la savane à chêne de Garry.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chênes blancs germent dès l'automne, sans aucun froid, et ne doivent jamais sécher.",
    supportNotes: {
      "lorquins-admiral":
        "Un chêne dans une prairie à chêne de Garry est le poste d'observation d'un amiral de Lorquin, qui se laisse tomber de la branche pour chasser tout ce qui passe.",
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
      "Planté dans les moyennes montagnes françaises depuis les années 1800 pour son bois droit et rapide, c'est aujourd'hui l'un des arbres de plantation les plus répandus du pays. Chez lui en Oregon, il pousse avec toute une forêt qui a évolué à ses côtés ; dans une vallée alpine, c'est une culture, et le sol sous un peuplement dense est silencieux.",
    nativeNote:
      "Le conifère dominant des forêts du versant ouest et l'emblème forestier de la région.",
    careNote:
      "Il devient franchement énorme — donnez-lui de la vraie place, loin des bâtiments et des lignes. Rapide, robuste et résistant à la sécheresse une fois installé.",
    givesNote:
      "Ses graines nourrissent becs-croisés, tarins et mésanges ; son houppier dense abrite chouettes et passereaux ; et peu d'arbres stockent plus de carbone.",
    propagationNote:
      "Récoltez les cônes à maturité, quand ils brunissent en fin d'été, puis séchez-les dans un sac en papier jusqu'à ce qu'ils s'ouvrent et secouez-en la graine ailée. Un mois environ de froid humide au réfrigérateur avant un semis de printemps donne un peuplement de jeunes plants plus régulier.",
    supportNotes: {
      "ceanothus-silkmoth":
        "Le douglas fait partie des arbres que les chenilles du grand paon du céanothe acceptent — un papillon de nuit large comme une paume, sans bouche, qui vit toute sa vie adulte sur ce qu'il a mangé ici comme larve.",
      "conifer-seed-finches":
        "Les becs-croisés d'Amérique sont liés au sapin de Douglas ici plus étroitement qu'à aucun autre arbre — des populations entières ont leur propre taille de bec et leur propre cri de vol pour ses cônes, et une bande travaillant la cime d'un gros douglas est l'un des sons typiques du Nord-Ouest Pacifique.",
    },
  },
  "Thuja plicata": {
    nativeNote:
      "Conifère de fondation des forêts humides du versant ouest ; culturellement central pour les peuples de la côte nord-ouest.",
    careNote:
      "Il demande une humidité régulière et tolère l'ombre et les sols détrempés — parfait pour un emplacement frais et mi-ombragé, mais il souffrira et « jaunira » dans un site chaud et sec. Les cerfs broutent les jeunes plants.",
    givesNote:
      "Un abri persistant toute l'année pour les oiseaux, un écran dense, un énorme stockage de carbone, et des racines qui maintiennent un terrain détrempé.",
    propagationNote:
      "Cueillez les petits cônes à maturité, quand ils brunissent en fin d'été, et séchez-les jusqu'à ce qu'ils libèrent leur graine. Quelques semaines au froid et à l'humidité avant le semis l'aident à lever plus régulièrement, même si celle-ci germe assez volontiers.",
    supportNotes: {
      "conifer-seed-finches":
        "Les petits cônes du thuya sont un travail de précision pour les tarins et les autres petits fringilles, et l'arbre leur donne aussi l'autre moitié de ce qu'il leur faut : un couvert persistant dense où passer un hiver pluvieux.",
    },
  },
  "Acer macrophyllum": {
    nativeNote:
      "Le grand érable indigène des forêts de basse altitude et des vallées de cours d'eau du versant ouest.",
    careNote:
      "Grand et rapide ; donnez-lui de la place. Ses branches moussues deviennent avec le temps des jardins suspendus à elles seules.",
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
      "Très rapide et très grand, avec des racines avides et chercheuses — tenez-le bien à l'écart des canalisations, des fondations et des pavages, et seulement là où un grand arbre de ripisylve a sa place. Il lui faut un terrain frais.",
    givesNote:
      "L'une des principales plantes hôtes de chenilles de l'Ouest — de la nourriture pour les parulines et les viréos — plus des bourgeons printaniers au parfum de baume et des racines qui cuirassent une berge.",
    propagationNote:
      "L'arbre le plus facile d'ici à démarrer : coupez en hiver des rameaux dormants gros comme un crayon et enfoncez-les en terre humide ; ils s'enracinent sans peine. La graine cotonneuse ne vit que peu de temps : si vous passez par elle, répandez-la sur de la boue humide dès qu'elle tombe.",
    supportNotes: {
      "lorquins-admiral":
        "Le peuplier de l'Ouest est l'arbre nourricier de l'amiral de Lorquin. La jeune larve ressemble à une fiente d'oiseau et passe l'hiver roulée dans une feuille qu'elle a attachée au rameau pour ne pas tomber.",
      "western-tiger-swallowtail":
        "Le peuplier de l'Ouest est un arbre nourricier de prédilection pour le Papilio rutulus.",
    },
  },
  "Arbutus menziesii": {
    nativeNote:
      "Arbre feuillu persistant des falaises sèches et ensoleillées et des pentes rocheuses du versant ouest.",
    careNote:
      "Réputé capricieux à l'installation : plantez-en un petit dans un sol très drainant, au soleil, et ne l'arrosez jamais en été — ce sont l'irrigation et le dérangement qui tuent les arbousiers. Ne touchez pas aux racines.",
    givesNote:
      "Une écorce couleur cannelle qui s'exfolie, des fleurs en urne pour les abeilles, et des baies rouge-orangé dont dépendent les pigeons à queue barrée, les merles d'Amérique et les jaseurs.",
    propagationNote:
      "Prélevez la graine des baies mûres d'automne, rincez-en toute la pulpe, et donnez-lui cinq ou six semaines au froid et à l'humidité, au réfrigérateur — sans ce froid, presque rien ne germe.",
    supportNotes: {
      "ceanothus-silkmoth":
        "Les feuilles de l'arbousier de Menzies nourrissent les chenilles du grand paon du céanothe, ce qui est rare : très peu de choses mangent une feuille persistante aussi coriace.",
      "painted-lady":
        "Ses petites fleurs en urne sortent au printemps et sont travaillées par les papillons autant que par les abeilles.",
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
      "Adaptable et résistant à la sécheresse une fois installé, au soleil ou à mi-ombre. Cerfs et oiseaux l'adorent tous les deux : protégez les jeunes plants.",
    givesNote:
      "Des fleurs blanches précoces pour les abeilles qui émergent, de douces baies bleues — les « saskatoons » — adorées des oiseaux et des gens, et un feuillage d'automne flamboyant.",
    propagationNote:
      "Dégagez la graine des baies mûres d'été et donnez-lui un long hiver froid et humide — cela peut être lent et tout ne lèvera pas au premier printemps, ne renoncez donc pas au pot. Plus simple encore : déterrez les rejets enracinés qu'il pousse autour de sa base et replantez-les.",
    supportNotes: {
      "ceanothus-silkmoth":
        "L'amélanchier fait partie de la courte liste d'arbustes sur lesquels le grand paon du céanothe accepte de pondre.",
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
      "Rapide et formant fourré — excellent pour tenir une pente ou une lisière humide, mais donnez-lui de la place. Ses chatons très précoces sont une première nourriture essentielle ; il supporte mieux le sec que les autres saules.",
    givesNote:
      "Une clé de voûte : les saules hébergent plus de chenilles que presque tout le reste ici, nourrissant les oiseaux au nid, et leurs chatons les plus précoces alimentent les reines de bourdons et les osmies quand rien d'autre ne fleurit.",
    propagationNote:
      "Comme les autres saules, il s'enracine sans peine à partir de boutures dormantes d'hiver enfoncées en terre humide, et les pointes tendres de printemps s'enracinent plus vite encore. Sa graine duveteuse meurt en quelques jours ou quelques semaines : semez-la à la surface d'un sol mouillé dès la récolte.",
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
      "L'ombre indigène la plus rapide qu'on puisse obtenir sur un site frais, et l'un des rares arbres locaux qui fabriquent leur propre azote — il nourrit le sol pour tout ce qu'on plantera après lui. Deux réserves : il se ressème partout, et il est de courte vie pour un arbre (60 à 80 ans) — plantez-le donc comme essence d'accompagnement plutôt que comme pièce maîtresse.",
    givesNote:
      "L'un des principaux arbres nourriciers de chenilles de la région, et ses petits chatons ligneux gardent une graine que les tarins des pins et les chardonnerets dépouillent tout l'hiver. Ses racines tricotent vite une berge et tirent l'azote de l'air vers le sol.",
    propagationNote:
      "Cueillez les petits cônes ligneux à l'automne, quand ils se tordent facilement et que les écailles commencent à s'écarter, séchez-les à l'intérieur dans un sac en papier et secouez-en la graine ailée. Elle n'a besoin d'aucun froid : semez-la au printemps. Semez dru — une bonne part de la graine est vide.",
    supportNotes: {
      "ceanothus-silkmoth":
        "L'aulne rouge nourrit les chenilles du grand paon du céanothe en plus des fringilles qu'il nourrit l'hiver — le même arbre, deux repas entièrement différents.",
      "american-goldfinch":
        "Les petits chatons ligneux de l'aulne gardent une graine que les chardonnerets et les tarins des pins dépouillent tout l'hiver.",
    },
  },
  "Prunus emarginata": {
    nativeNote:
      "Le cerisier sauvage commun des lisières boisées, des bords de route et des clairières en reconstitution du versant ouest.",
    careNote:
      "Peu exigeant et rapide sur presque tout terrain bien drainé, et il drageonne en fourré si on le laisse — ce qui est une qualité au fond d'une parcelle et une gêne dans un petit massif. Ses feuilles et ses noyaux contiennent des composés cyanurés : c'est un arbre à tenir à l'écart d'un pré à chevaux (chiens et chats de jardin ne courent pas de vrai risque, mais autant le dire).",
    givesNote:
      "Après les chênes et les saules, les cerisiers sont les arbres nourriciers de chenilles les plus productifs de l'Ouest — des centaines d'espèces de papillons de jour et de nuit, c'est-à-dire de quoi nourrir une nichée de mésanges. Une floraison blanche printanière pour les abeilles précoces, puis des fruits rouges amers que les pigeons à queue barrée, les merles d'Amérique et les jaseurs mangent, même si nous ne le pouvons pas.",
    propagationNote:
      "Écrasez les fruits mûrs en fin d'été, lavez la pulpe des noyaux, et donnez-leur trois à quatre mois au froid et à l'humidité, au réfrigérateur, avant de semer au printemps. Plus facile encore : prélevez en fin d'hiver l'un des drageons enracinés qu'il émet autour de lui.",
    supportNotes: {
      "lorquins-admiral":
        "Le cerisier amer est l'autre arbre sur lequel l'amiral pond là où il n'y a ni saule ni peuplier.",
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
      "Le seul arbre indigène qui recherche vraiment un emplacement ombragé — sous les conifères ou au nord d'une maison, il devient une sculpture vivante à plusieurs troncs. En plein soleil d'après-midi il grille, à moins que la terre ne reste fraîche. Arrosez-le ses deux premiers étés ; ensuite il se débrouille.",
    givesNote:
      "Toute la valeur en chenilles d'un érable dans un arbre qui tient dans un petit jardin, plus la plus belle couleur d'automne indigène de la région — écarlate et orange à l'ombre — et des samares que gros-becs et fringilles travaillent.",
    propagationNote:
      "Récoltez les samares appariées en fin d'été, quand elles changent de couleur, avant qu'elles ne sèchent sur l'arbre. Semez-les dans un pot laissé dehors, ou gardez-les environ cinq mois dans de la tourbe humide au réfrigérateur — la graine préfère une alternance de chaud et de froid, et beaucoup attendent le deuxième printemps. Ses branches basses s'enracinent aussi là où elles touchent le sol : marcottez-en une et détachez-la un an plus tard.",
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
      "Le seul grand conifère qui poussera *à* l'ombre : c'est ainsi qu'on remet une forêt sous des arbres existants. Il a des racines superficielles et aucune tolérance à la sécheresse — sur une parcelle sèche et exposée il souffrira là où le douglas n'en a cure. Donnez-lui un emplacement frais et abrité et arrosez-le ses premiers étés.",
    givesNote:
      "Ses minuscules cônes nourrissent becs-croisés, tarins et mésanges tout l'hiver ; son houppier plumeux et retombant est un couvert de nidification pour les petits passereaux ; et peu de choses sur le versant ouest stockent plus de carbone ou tiennent mieux la terre d'une pente sous une averse.",
    propagationNote:
      "Ramassez les petits cônes au début de l'automne, juste quand ils brunissent, séchez-les jusqu'à ouverture et secouez-en la graine. Quelques semaines de froid humide au réfrigérateur améliorent la régularité de la levée. Semez à la surface d'une terre humide et tourbeuse et gardez-la à l'ombre — les jeunes plants sont minuscules et sèchent en une après-midi.",
    supportNotes: {
      "conifer-seed-finches":
        "Les cônes de pruche font à peine deux centimètres et demi : ce sont donc les petits fringilles qui en tirent le plus — les tarins des pins travaillent les extrémités de branches retombantes tout l'hiver, les mésanges suivant derrière.",
    },
  },
  "Fraxinus latifolia": {
    nativeNote:
      "L'arbre emblématique des terrains humides de la vallée de la Willamette et des basses terres du Puget — plaines inondables, dépressions et mares saisonnières.",
    careNote:
      "Il encaisse ce que presque rien d'autre n'encaisse : un terrain sous l'eau tout l'hiver et cuit dur en août. Plantez-le dans le coin humide du jardin, pas dans le bon massif. Une chose à savoir avant de vous engager : l'agrile du frêne a atteint l'Oregon en 2022, et il tue les frênes. Le frêne de l'Oregon vaut toujours d'être planté en terrain humide, là où il a sa place, et il y a un risque réel qu'il ait besoin d'aide ; le service forestier de l'État publie des recommandations à jour.",
    givesNote:
      "Un arbre nourricier majeur pour les chenilles, et ses samares nourrissent fringilles, gros-becs et canards branchus. Sur une plaine inondable, il fait le travail qu'aucun arbuste ne peut faire : absorber l'eau d'hiver et tenir la berge en même temps.",
    propagationNote:
      "Cueillez les grappes pendantes de samares en fin d'été ou à l'automne, une fois sèches et papyracées. Comme la plupart des frênes, elle a besoin du froid de l'hiver pour germer : le plus simple est de la semer en pot dehors à l'automne et de laisser faire la saison.",
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
      "Beau, et exigeant : il demande une lumière tamisée, des racines fraîches sous un paillis de feuilles mortes, un bon drainage et aucun arrosage d'été *au pied du tronc*, et il supporte mal d'être déplacé. L'anthracnose du cornouiller, une maladie fongique, frappe les arbres en souffrance à l'ombre humide — un emplacement aéré avec du soleil du matin est la meilleure défense. Plantez-en un petit et soyez patient.",
    givesNote:
      "De grandes bractées blanches printanières qui éclairent une lisière boisée (et souvent une seconde floraison à l'automne), une solide plante hôte de chenilles, et des grappes de fruits écarlates que pigeons à queue barrée, merles d'Amérique, jaseurs et gros-becs vident en quelques jours.",
    propagationNote:
      "Débarrassez les fruits écarlates de leur pulpe dès qu'ils sont mûrs — les pépiniéristes signalent qu'elle peut freiner la graine — puis donnez à la graine environ trois mois au froid et à l'humidité, au réfrigérateur, avant de semer au printemps.",
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
      "Un petit arbre raide et large, aux épines de deux centimètres et demi — plantez-le là où personne n'a à se faufiler, et il ne vous demandera rien d'autre. Il se plaît surtout sur un terrain qui reste frais jusqu'en été, y compris un coin qui s'inonde en hiver, et l'argile ne le dérange pas. Lent : achetez-le petit et laissez-lui son temps ; si vous voulez le fourré qu'il fait à l'état sauvage, laissez les drageons.",
    givesNote:
      "Les aubépines comptent parmi les principaux arbres nourriciers de chenilles de l'Ouest — une mésange qui travaille une aubépine récolte les jeunes de centaines d'espèces. Sa floraison blanche de mai est lourde de petites abeilles et de mouches indigènes, ses cenelles sombres tiennent jusqu'en hiver pour les jaseurs, les merles d'Amérique et les gélinottes, et son houppier épineux est l'un des endroits les plus sûrs où un passereau puisse bâtir un nid.",
    propagationNote:
      "La graine d'aubépine est têtue : le noyau dur la retient autant que la graine elle-même. Les pépiniéristes ramollissent les noyaux nettoyés à l'acide, puis leur donnent trois à quatre mois au froid et à l'humidité ; chez vous, semez-les dans un pot laissé dehors à l'automne et soyez patient. Bien plus rapide : prélevez en fin d'hiver un drageon enraciné au bord d'un sujet établi.",
    supportNotes: {
      "cedar-waxwing":
        "Les cenelles sombres tiennent bien après les feuilles : une aubépine noire nourrit encore jaseurs et merles d'Amérique aux semaines où les fruits d'été ont disparu depuis longtemps.",
      "berry-songbirds":
        "Les épines sont tout l'intérêt : un fourré d'aubépines est l'un des rares endroits où un petit oiseau puisse bâtir sans qu'un chat, un geai ou une corneille puisse facilement suivre.",
      "mason-bees":
        "Sa lourde floraison de mai, plate et ouverte, nourrit osmies et andrènes au plus fort de la saison d'approvisionnement des nids.",
    },
  },
  "Betula papyrifera": {
    nativeNote:
      "Le bouleau à écorce blanche des basses terres du Puget, du bas Fraser et du nord-ouest de Washington — la variété propre au versant ouest, parfois notée var. commutata ou subcordata.",
    careNote:
      "Le bouleau demande un enracinement frais et humide, et il vous dira quand il ne l'a pas : un arbre cuit sur une pelouse exposée au sud s'affaiblit, et l'agrile du bouleau achève les bouleaux affaiblis. Donnez-lui donc le côté nord ou est, paillez large, arrosez-le ses premiers étés, et ne le plantez jamais dans l'emplacement chaud et sec que vous espériez lui voir décorer. Il se plaît franchement mieux autour du Puget Sound que dans un mois d'août de la Willamette, et il n'est pas longévif ici — soixante bonnes années, pas deux cents. Ses chatons printaniers lâchent un pollen porté par le vent, bon à savoir si le bouleau vous fait éternuer.",
    givesNote:
      "Le bouleau est l'un des cinq premiers arbres nourriciers de chenilles du continent : il nourrit tout un étage de papillons de nuit, et les parulines et les mésanges qui les mangent. Ses petits chatons en forme de cônes s'effritent en une graine que les tarins des pins et les sizerins travaillent tout l'hiver, ses branches mortes deviennent des loges de pics et de mésanges, et son écorce blanche éclaire un mois de février gris.",
    propagationNote:
      "Cueillez les chatons mûrs en fin d'été ou au début de l'automne, tant qu'ils se tiennent encore, et émiettez-les sur un pot de terreau humide. Laissez la graine, fine comme de la poussière, en surface : la lumière l'aide à germer, et un mois ou deux au froid et à l'humidité (ou un pot laissé dehors l'hiver) régularise la levée.",
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
      "C'est l'arbre du coin humide : il accepte un terrain sous l'eau tout l'hiver, et il se moque même des embruns salés d'un bord de marée, ce que presque rien d'autre ici ne fait. Ses courts rameaux latéraux s'affûtent en épines : gardez-le à l'écart d'un passage. Dans un printemps humide, les feuilles se tavellent et tombent tôt — c'est la tavelure du pommier, cela paraît plus grave que ce n'est, et ramasser les feuilles tombées est tout le traitement. Il penche et se fourche en une silhouette tordue à plusieurs troncs ; c'est la plante, pas un défaut.",
    givesNote:
      "Pommiers et pommiers sauvages sont parmi les arbres nourriciers de chenilles les plus productifs du pays, et celui-ci fait ce travail les pieds dans l'eau. Des nuages de fleurs blanc-rosé nourrissent osmies et reines de bourdons en avril ; puis de petites pommes acides, du jaune au rouge, qui tiennent bien après les feuilles et nourrissent jaseurs, gros-becs, merles d'Amérique, renards et ours à travers les premiers grands froids. Elles sont comestibles pour les gens aussi, une fois que le gel les a bletties.",
    propagationNote:
      "Écrasez les petites pommes une fois blettes à l'automne, lavez-en les pépins, et donnez-leur environ trois mois au froid et à l'humidité, au réfrigérateur, avant de semer au printemps — ou semez-les dehors à l'automne dans un pot à l'abri des souris et laissez faire l'hiver.",
    supportNotes: {
      "mason-bees":
        "La floraison du pommier sauvage est ce pour quoi les arboriculteurs louent des osmies — une foule de fleurs blanc-rosé en avril, arrivant exactement quand les abeilles émergent.",
      "cedar-waxwing":
        "Les petites pommes acides blettissent au lieu de tomber, et les jaseurs les travaillent à travers les premiers grands froids.",
      "berry-songbirds":
        "Merles d'Amérique, gros-becs et grives prennent les fruits ; renards et ours nettoient ce qui tombe.",
    },
  },

  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — arbustes.
  // -------------------------------------------------------------------------
  "Berberis aquifolium": {
    nativeNote:
      "Arbuste persistant des bois et des lisières du versant ouest ; la fleur emblème de l'État de l'Oregon.",
    careNote:
      "Robuste, persistant et résistant à la sécheresse une fois installé, au soleil comme à l'ombre. Ses feuilles en forme de houx sont piquantes — placez-le à l'écart des passages. Parfois noté Mahonia aquifolium.",
    givesNote:
      "Ses fleurs jaunes parfumées de fin d'hiver sont l'une des premières sources de nectar pour les abeilles ; ses baies bleues nourrissent merles d'Amérique et jaseurs ; ses feuilles luisantes persistantes donnent de la structure toute l'année.",
    propagationNote:
      "Écrasez les baies bleues mûres et rincez la graine. Elle est lente : un seul hiver froid suffit rarement, et elle germe mieux après une période chaude entre deux froides ; semez-la donc dans un pot laissé dehors et donnez-lui du temps. Des boutures de pousses en voie d'aoûtement, prises en fin d'été, s'enracinent aussi.",
    supportNotes: {
      "mason-bees":
        "Ses fleurs jaune vif de fin d'hiver sont parmi les toutes premières nourritures à abeilles de l'année.",
      "cedar-waxwing":
        "Ses baies bleues en « grappes » nourrissent jaseurs, merles d'Amérique et tohis.",
    },
    lookalikeNotes: {
      "ilex-aquifolium": {
        why: "Deux persistants luisants aux feuilles épineuses en forme de houx — et le second mot du nom latin de l'un est le nom de l'autre.",
        tells: [
          { feature: "La feuille", native: "Une feuille composée : cinq à neuf folioles épineuses rangées le long d'un même pétiole.", lookalike: "Une seule feuille épineuse à la fois, épaisse et ondulée." },
          { feature: "Baies", native: "Bleu-violet pruineux, en grappes comme de minuscules raisins.", lookalike: "Rouge vif — et seulement sur les pieds femelles." },
          { feature: "Fleurs", native: "Des bouquets jaunes éclatants au début du printemps, par la journée la plus grise de l'année.", lookalike: "Petites, blanches et faciles à manquer." },
          { feature: "Sous l'écorce", native: "Grattez une tige : le bois est d'un jaune vif.", lookalike: "Pâle." },
        ],
      },
    },
  },
  "Ribes sanguineum": {
    nativeNote:
      "Arbuste caduc des bois et des clairières du versant ouest ; une floraison printanière emblématique du Nord-Ouest.",
    careNote:
      "Facile, rapide et résistant à la sécheresse une fois installé, du soleil à la mi-ombre. Il entre en dormance estivale sur les sites secs — c'est normal, ce n'est pas la mort.",
    givesNote:
      "Ses grappes de fleurs roses s'ouvrent exactement au retour des colibris roux au printemps, les nourrissant ainsi que les abeilles précoces ; ses baies nourrissent ensuite les passereaux.",
    propagationNote:
      "De loin le plus facile : des boutures ligneuses dormantes prises en fin d'automne ou en hiver, qui s'enracinent sans peine en terre humide. La graine marche aussi : dégagez-la des baies et semez-la dehors à l'automne, ou donnez-lui d'abord un passage au froid et à l'humidité.",
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
      "Extrêmement robuste et résistant à la sécheresse une fois installé — un choix de premier ordre pour un talus chaud et sec, au soleil ou à mi-ombre. Ses panicules séchées persistent tout l'hiver.",
    givesNote:
      "Ses gerbes de fleurs crème écumeuses grouillent d'abeilles indigènes et de papillons au cœur de l'été ; ses rameaux denses abritent et nourrissent les oiseaux ; ses racines profondes tiennent une pente.",
    propagationNote:
      "La graine demande 15 à 18 semaines de froid humide avant de germer : semez-la dans un pot laissé dehors l'hiver. Les boutures marchent aussi : des boutures ligneuses prises à l'automne ou en hiver, trempées dans une hormone de bouturage, réussissent mieux que les boutures tendres de printemps.",
    supportNotes: {
      "variable-checkerspot":
        "Les plumeaux crème du holodisque sont la halte nectarifère du damier variable pendant la partie sèche de l'été.",
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
      "Quasi indestructible — il prend le soleil comme l'ombre profonde, l'humide comme le sec, et drageonne en fourré : servez-vous-en pour garnir ou tenir un terrain plutôt que comme sujet net. Ses baies blanches sont légèrement toxiques pour les personnes et les animaux domestiques si on les mange.",
    givesNote:
      "Ses fleurs d'été nourrissent colibris et abeilles ; ses baies blanches d'hiver nourrissent colins, gélinottes et merles d'Amérique ; et ses racines tricotent un talus difficile.",
    propagationNote:
      "De loin le plus facile est de déterrer les drageons enracinés par lesquels il s'étend, ou d'enraciner des boutures dormantes en fin d'hiver ou au début du printemps. La graine est lente et têtue — elle veut une longue période chaude puis une longue période froide, souvent deux hivers dehors — si bien que la plupart des gens s'en passent.",
    supportNotes: {
      "variable-checkerspot":
        "La symphorine est l'un des rares arbustes que les chenilles du damier variable mangent, et elles se nourrissent en groupe à l'intérieur d'une toile tissée sur la pousse.",
      "yellow-rumped-warbler":
        "Les baies blanches tiennent tout l'hiver, et la paruline à croupion jaune est l'un des rares oiseaux à les prendre.",
      "annas-rufous-hummingbird":
        "Ses petites fleurs roses en clochettes sont une source de nectar estivale pour les colibris ; ses baies blanches persistent pour les oiseaux d'hiver.",
    },
  },
  "Rosa nutkana": {
    nativeNote:
      "Rosier sauvage indigène des lisières, des prairies et des rivages du versant ouest.",
    careNote:
      "Robuste, adaptable et résistant à la sécheresse une fois installé ; il drageonne en fourré. Épineux — idéal en haie à faune ou en barrière, moins au bord d'un passage.",
    givesNote:
      "Ses grandes roses simples et roses nourrissent bourdons et autres abeilles indigènes ; ses cynorrhodons nourrissent oiseaux et petits mammifères jusqu'en hiver ; et le fourré offre un couvert de nidification.",
    propagationNote:
      "Le plus simple est de déterrer les drageons enracinés qu'il pousse autour de lui. Partir des cynorhodons est lent : dégagez la graine, donnez-lui un long hiver froid et humide, et armez-vous de patience face à une levée irrégulière.",
    supportNotes: {
      "bumble-bees":
        "Un rosier sauvage est une coupe simple et ouverte avec le pollen à portée de main : une abeille peut vraiment s'en servir — ce qu'un rosier de jardin double, pour un insecte, n'est pas.",
      "berry-songbirds":
        "Ses gros cynorrhodons tiennent tout l'hiver pour les merles d'Amérique, les tohis et les gélinottes, et le fourré épineux est un couvert de nidification profond.",
    },
  },
  "Gaultheria shallon": {
    nativeNote:
      "Arbuste de sous-bois persistant qui tapisse les forêts du versant ouest, surtout près de la côte.",
    careNote:
      "Il demande un sol acide et de l'ombre à mi-ombre — idéal pour l'ombre sèche sous les conifères, où il s'étend lentement en un fourré persistant. Un peu de patience et d'eau l'été le mettent en route ; ensuite il est autonome.",
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
      "Ses fleurs magenta s'ouvrent en mars, avant presque tout le reste, et les colibris roux calent leur arrivée sur elles. Puis une lourde récolte de baies orange à rouge pour les grives, les tangaras et les merles d'Amérique, et l'un des meilleurs arbustes de l'Ouest comme plante hôte de chenilles. Le fouillis lui-même est un couvert de nidification.",
    propagationNote:
      "Le plus facile de tous : en fin d'hiver, déterrez l'une des pousses enracinées qu'elle envoie au bord de la touffe, détachez-la à la bêche, et déplacez-la. Des morceaux nus de canne de l'an passé, enfoncés en terre humide en hiver, s'enracinent aussi volontiers.",
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
          { feature: "Fleurs et fruits", native: "Fleurs magenta en mars ; baies molles saumon à rouge dès juin.", lookalike: "Fleurs blanc-rosé en juin ; baies noires en août." },
          { feature: "Ce qu'elle fait ensuite", native: "Elle fait un fourré ouvert à travers lequel d'autres plantes poussent.", lookalike: "Elle s'enracine partout où une pointe de canne touche terre, jusqu'à ce qu'il ne reste rien d'autre." },
        ],
      },
    },
  },
  "Sambucus racemosa": {
    nativeNote:
      "Arbuste rapide au bois tendre des clairières fraîches, des bords de cours d'eau et des ouvertures forestières du versant ouest.",
    careNote:
      "Il pousse comme une mauvaise herbe sur un terrain frais et en a l'air dès août : mettez-le là où l'exubérance compte plus que la propreté. Rabattez-le sévèrement — même au ras du sol — tous les quelques hivers et il repart mieux. Les baies crues, ainsi que les feuilles, les tiges et les racines, rendent les personnes et les animaux malades ; c'est une plante à oiseaux, pas une plante à confiture (contrairement à son cousin à baies bleues).",
    givesNote:
      "L'un des tout meilleurs arbustes à oiseaux du Nord-Ouest : une avalanche de baies écarlates en juin que pigeons à queue barrée, tangaras, gros-becs, grives et jaseurs dépouillent en quelques jours. Ses corymbes crème nourrissent d'abord une foule nombreuse de petites abeilles et de mouches indigènes.",
    propagationNote:
      "Prenez en fin d'automne ou en hiver des morceaux de tige dormante et nue, gros comme un crayon, et enfoncez-les en terre humide. Par la graine, c'est plus lent : retirez la pulpe, puis donnez-lui une période chaude suivie de trois mois au froid et à l'humidité — ce qu'un semis dehors en fin d'été fait pour vous.",
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
      "Elle exige un sol acide bien pourvu en terreau de feuilles ou en écorce et un drainage qui ne stagne jamais — un massif paillé sous les conifères est son idée du paradis. Lente les premières années, et elle demande de l'eau ces étés-là ; ensuite elle est robuste, accepte l'ombre et ne demande aucune taille. Le plein soleil convient sur la côte, la mi-ombre à l'intérieur.",
    givesNote:
      "Airelles et myrtilliers sont parmi les arbustes nourriciers de chenilles les plus productifs qui soient, et celui-ci reste vert tout l'hiver comme couvert. Ses fleurs roses en urne nourrissent bourdons et osmies au printemps ; ses baies noires, tardives et sucrées, nourrissent grives, tohis et gélinottes (et vous) jusqu'à l'automne.",
    propagationNote:
      "Prélevez des boutures de pousses bien aoûtées pendant la dormance, de la fin de l'automne au début du printemps, et faites-les raciner sous abri dans un mélange de sable et de tourbe. Par la graine, écrasez les baies mûres, rincez-en la graine et semez-la à peine couverte à l'automne — ou donnez-lui d'abord un à deux mois au froid et à l'humidité. Les semis poussent très lentement.",
    supportNotes: {
      "mason-bees":
        "Les fleurs d'airelle se pollinisent par vibration — ce sont les bourdons qui font vraiment le fruit, aidés des osmies et des andrènes.",
      "berry-songbirds":
        "Ses baies noires tardives nourrissent grives, tohis et gélinottes bien avant dans l'automne.",
    },
  },
  "Physocarpus capitatus": {
    nativeNote:
      "Arbuste de bord de cours d'eau et de fourré humide du versant ouest, nommé pour son écorce qui s'exfolie en couches multiples.",
    careNote:
      "À peu près aussi facile qu'un arbuste indigène puisse l'être : il prend les crues d'hiver, la sécheresse d'été une fois installé, l'argile et la taille sévère sans se plaindre. Donnez-lui de la place — il s'arque large — et supprimez les vieilles tiges à la base plutôt que de tondre le dessus.",
    givesNote:
      "Ses dômes de fleurs blanches denses du début de l'été sont durement travaillés par les abeilles, les guêpes et les syrphes indigènes ; ses fructifications sèchent en brun-rouge et tiennent tout l'hiver. Là où il gagne vraiment sa place, c'est dans un jardin de pluie ou sur un talus — son système racinaire est un filet qui tient la terre à travers une tempête.",
    propagationNote:
      "Des boutures dormantes et nues prises en hiver et enfoncées en terre humide s'enracinent facilement. La graine demande deux à quatre mois de froid humide : récoltez les gousses sèches et papyracées à l'automne, émiettez-les, et semez la graine dans un pot laissé dehors l'hiver.",
    supportNotes: {
      "variable-checkerspot":
        "Les corymbes blancs et plats du physocarpe sont un atterrissage facile pour un papillon, et les damiers s'en servent beaucoup en juin.",
      "bumble-bees":
        "Ses dômes de fleurs blanches denses du début de l'été sont durement travaillés par les bourdons et d'autres abeilles indigènes.",
    },
  },
  "Lonicera involucrata": {
    nativeNote:
      "Chèvrefeuille arbustif des fourrés frais, des berges et des broussailles littorales du versant ouest.",
    careNote:
      "Franchement facile sur tout terrain frais, y compris la partie la plus détrempée d'un jardin de pluie, et il encaisse le vent salé sur la côte. Il peut s'effiler — supprimez quelques-unes des plus vieilles tiges en fin d'hiver et il se regarnit.",
    givesNote:
      "Ses fleurs jaunes en tube, par paires d'avril à juillet, sont un bar à colibris de longue durée, portées dans des bractées qui rougissent à l'écarlate à mesure que les deux baies noires mûrissent — un signal qui attire grives, tangaras et jaseurs. Ces baies ne sont pas pour nous : elles sont pour les oiseaux.",
    propagationNote:
      "Les pousses de l'année, prises en fin d'été à mesure qu'elles s'aoûtent, s'enracinent bien sous abri. Par la graine, débarrassez les baies noires de leur pulpe et donnez à la graine un à trois mois au froid et à l'humidité avant de semer au printemps.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs jaunes en tube par paires s'échelonnent d'avril à juillet — une plante à nectar à colibris de longue saison.",
      "berry-songbirds":
        "Ses bractées écarlates signalent les deux baies noires aux grives, aux tangaras et aux jaseurs.",
    },
  },
  "Corylus cornuta": {
    nativeNote:
      "Le noisetier indigène des lisières boisées et des clairières du versant ouest — la variété d'ici est l'occidentale californica.",
    careNote:
      "Un arbuste peu exigeant à plusieurs troncs pour une lisière boisée ou une haie libre, à l'aise à mi-ombre et dans les étés secs une fois en place. Il drageonne doucement en cépée ; supprimez les plus vieilles tiges au ras du sol tous les quelques hivers. Ses chatons de janvier lâchent un pollen porté par le vent, à noter si le noisetier vous fait éternuer.",
    givesNote:
      "Une solide plante hôte de chenilles, et les noisettes — dans leur long involucre en bec — sont le trophée d'automne des geais de Steller, des pigeons à queue barrée, des écureuils et des tamias, qui y arrivent presque toujours avant vous. Ses chatons pendants sont le premier signe du printemps sur le versant ouest, souvent dès janvier.",
    propagationNote:
      "Ramassez les noisettes au début de l'automne avant les geais, sans les laisser sécher. Donnez-leur trois à six mois au froid et à l'humidité avant un semis de printemps — ou semez-les simplement dehors dans un pot à l'abri des rongeurs et laissez faire l'hiver. Il s'étend aussi par des rhizomes superficiels : un drageon enraciné au bord d'une touffe peut être déterré et déplacé.",
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
      "Peu exigeant à mi-ombre sur un terrain ordinaire, et il accepte l'été sec une fois en place. Deux choses à savoir avant d'acheter. C'est un arbuste drageonnant, dressée et plutôt lâche — plantez-le en lisière boisée ou dans une haie, pas en sujet de pelouse. Et les fleurs mâles et femelles sont sur des pieds séparés : si vous voulez des fruits, il vous en faut au moins un de chaque ; les pépinières les étiquettent rarement, achetez-en donc trois et laissez faire les probabilités. Dès juillet il a l'air fatigué et perd quelques feuilles — c'est normal pour un arbuste qui a démarré en février.",
    givesNote:
      "C'est la plante qui met fin à l'hiver ici. Ses clochettes pendantes vert-blanc, à la légère odeur de concombre, s'ouvrent en février — des semaines avant presque tout le reste — et cette date est tout l'intérêt. Une reine de bourdon qui sort de terre au premier jour doux a brûlé sa graisse d'hiver et a des jours, pas des semaines, pour trouver du sucre avant de pouvoir fonder un nid ; l'Oemleria, avec le noisetier, est ce qu'elle trouve. Osmies et premiers syrphes le travaillent aussi. Son petit fruit en forme de prune mûrit bleu-noir en juin pour les merles d'Amérique, les jaseurs, les renards et les coyotes, en général avant qu'une personne ait pu en goûter un.",
    propagationNote:
      "Le plus facile est de soulever en hiver l'un des drageons enracinés autour de la base d'une touffe établie. Des boutures nues prises au début de l'hiver reprennent aussi. Par la graine, débarrassez de leur pulpe les fruits mûrs du début de l'été et donnez aux noyaux deux à quatre mois au froid et à l'humidité avant un semis de printemps.",
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
      "L'arbuste aux plumets roses des prairies humides, des rives de lac, des fossés et de le coin détrempé de chaque vieux pâturage du versant ouest.",
    careNote:
      "Si vous avez construit un jardin de pluie et ne savez pas quoi mettre dans le fond humide, c'est la réponse — elle accepte des semaines d'eau stagnante en hiver puis l'août sec qui suit. Le hic : elle court à la racine et se densifie en un fourré serré, ce qui est exactement ce que vous voulez le long d'un fossé ou d'un bord d'étang et exactement ce que vous ne voulez pas dans un massif d'un mètre. Donnez-lui de la place, ou passez la bêche autour chaque printemps. Coupez un tiers des plus vieilles tiges au ras du sol en fin d'hiver et elle fleurit plus abondamment.",
    givesNote:
      "Ses épis duveteux rose fuchsia se dressent en juillet et août — la période la plus chaude et la plus pauvre en nectar de l'année — et ils sont travaillés toute la journée par les bourdons, les petites abeilles indigènes, les syrphes et les papillons. Ses fructifications sèchent en rouille et gardent leur forme tout l'hiver, et sous la terre son matelas de racines est l'une des meilleures choses à planter pour ralentir une averse et tenir un talus humide en place.",
    propagationNote:
      "La voie la plus simple, de loin, est de trancher au début du printemps un morceau enraciné au bord coureur d'une touffe et de le replanter. Les pointes vertes et tendres prises au printemps ou au début de l'été s'enracinent sans peine. La graine fraîche germe vite sans traitement ; celle qui a séché demande un à trois mois de froid, ou un semis d'automne dans un pot laissé dehors.",
    supportNotes: {
      "bumble-bees":
        "Les épis rose fuchsia se dressent en juillet et août — la période la plus pauvre en nectar de l'année ici — et les bourdons les travaillent dès le petit jour.",
    },
  },

  // -------------------------------------------------------------------------
  // Nord-Ouest Pacifique — vivaces.
  // -------------------------------------------------------------------------
  "Camassia quamash": {
    nativeNote:
      "Fleur sauvage à bulbe des prairies humides et des prés du versant ouest ; un aliment de base des peuples du Nord-Ouest.",
    careNote:
      "Elle adore un terrain humide en hiver et au printemps et sec en été — exactement le régime du versant ouest. Elle entre en dormance complète au milieu de l'été : ne bêchez pas là où elle disparaît. Elle se naturalise en nappes au fil des années.",
    givesNote:
      "Des nappes de fleurs bleues printanières nourrissent les reines de bourdons et les osmies, et elle recrée l'habitat de prairie humide en voie de disparition qui nourrissait autrefois à la fois les gens et les pollinisateurs.",
    propagationNote:
      "Semez la graine en pots dehors dès qu'elle est mûre et laissez l'hiver la refroidir. Plus rapide : soulevez des touffes en dormance et séparez délicatement les petits bulbes latéraux.",
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
      "Ses corymbes plats sont une piste d'atterrissage pour une grande diversité de petites abeilles indigènes, de syrphes, de guêpes et de papillons tout l'été, sur une plante qui survit à l'abandon total.",
    propagationNote:
      "La graine est minuscule et a besoin de lumière : répandez-la en surface et couvrez-la à peine. Plus facile encore, soulevez et séparez les touffes au printemps ou à l'automne — elle se divise sans se plaindre et se réenracine vite.",
    supportNotes: {
      "painted-lady":
        "L'achillée est une table à papillons : une assiette plate de minuscules fleurs, toutes accessibles d'un coup, et une belle-dame reste plusieurs minutes sur un seul capitule.",
      "variable-checkerspot":
        "L'une des plantes à nectar les plus souvent notées pour le damier variable dans toute son aire.",
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
      "Semez la graine dehors à l'automne ou au printemps. Une fois installée, elle se ressème volontiers : laissez mûrir et s'égrener quelques capsules. On peut aussi diviser les touffes.",
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
      "Prenez des boutures tendres au début de l'été ou semi-aoûtées au milieu de l'été, ou soulevez et divisez les touffes établies au printemps. La graine se sème en fin d'hiver ou au printemps.",
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
      "Elle demande le plein soleil et un sol parfaitement drainé, et supporte mal les sols riches et humides — un bouche-trou bas et résistant à la sécheresse, parfait pour un talus chaud ou une rocaille. Aucune eau une fois installée.",
    givesNote:
      "Un feuillage argenté et laineux surmonté de marguerites dorées qui nourrissent les abeilles indigènes et les papillons au début de l'été, sur le terrain le plus pauvre et le plus sec.",
    propagationNote:
      "Semez la graine dans un pot laissé dehors à l'automne, ou donnez-lui d'abord environ trois mois au froid et à l'humidité — sans ce froid, presque rien ne germe.",
    supportNotes: {
      "painted-lady":
        "L'ériophylle laineux fait partie des plantes sur lesquelles grandissent les chenilles de la belle-dame — elles vivent sous une tente de soie tendue sur les feuilles laineuses.",
      "sunflower-specialist-bees":
        "Une floraison d'astéracée de l'Ouest qui fait vivre les abeilles spécialistes du pollen d'astéracées de la région.",
    },
  },
  "Asclepias speciosa": {
    nativeNote:
      "L'asclépiade commune de l'Ouest — indigène des terrains ouverts et ensoleillés de la vallée de la Willamette, du corridor du Columbia et vers l'est jusque dans l'intérieur.",
    careNote:
      "Donnez-lui le plein soleil et un terrain pauvre et bien drainé, puis laissez-la tranquille — elle s'étend par coulants souterrains et sortira à un mètre de là où vous l'avez plantée : une bande de prairie ou une bande de trottoir lui convient mieux qu'un massif net. Sa sève laiteuse est irritante et la plante est toxique si on l'avale.",
    givesNote:
      "Les chenilles de monarque ne mangent que des asclépiades, et celle-ci est la plus commune du versant ouest. La population de monarques de la côte Ouest a suffisamment chuté pour que chaque pied compte. Ses lourds dômes de fleurs roses sont aussi l'une des sources de nectar les plus riches du plein été pour les bourdons, et sa bourre de graines garnit les nids de chardonnerets et de colibris.",
    propagationNote:
      "Ouvrez les gousses sèches à l'automne avant qu'elles n'éclatent et détachez la graine de la soie. La graine fraîche germe souvent sans aide, mais quelques mois au froid et à l'humidité — ou un semis d'automne dehors — la rendent plus fiable. Des morceaux de la racine traçante portant un bourgeon, prélevés pendant la dormance, donnent aussi de nouveaux plants.",
    supportNotes: {
      monarch:
        "L'asclépiade commune de l'Ouest, et les asclépiades sont tout ce qu'une chenille de monarque peut manger — la population de monarques de l'Ouest a suffisamment chuté pour que chaque pied compte.",
      "bumble-bees":
        "Ses lourds dômes de fleurs roses sont l'une des sources de nectar les plus riches du plein été pour les bourdons.",
    },
  },
  "Solidago lepida": {
    nativeNote:
      "La verge d'or du Canada du versant ouest, des prés, des fossés et des terrains ouverts ; les flores plus anciennes la traitent comme Solidago canadensis var. salebrosa.",
    careNote:
      "Assez robuste pour un bord de route, et elle se comporte comme telle — courant à la racine en une large plaque. Plantez-la là où elle peut le faire, ou passez la bêche autour chaque printemps. Laissez les tiges sur pied tout l'hiver : les abeilles nichent dans les creuses. Et l'accusation de rhume des foins est une erreur d'identité — le pollen de verge d'or est lourd et porté par les insectes ; l'ambroisie, qui fleurit au même moment, est la coupable.",
    givesNote:
      "Les verges d'or hébergent plus d'espèces de chenilles qu'aucun autre groupe de vivaces indigènes, et la floraison de fin d'été est la plus grande manne de nectar et de pollen de l'année pour les bourdons, les abeilles solitaires et les papillons migrateurs qui font leurs réserves. Sa graine porte les chardonnerets jusqu'en hiver.",
    propagationNote:
      "La graine est la voie facile : semez-la à la surface d'un terreau humide et gardez-la au chaud. La graine de verge d'or n'a pas besoin du froid de l'hiver et lève en une semaine environ.",
    supportNotes: {
      "sunflower-specialist-bees":
        "La verge d'or est la plante classique de fin de saison pour les abeilles qui ne peuvent utiliser que le pollen d'astéracées.",
      "bumble-bees":
        "La floraison de fin d'été est la plus grande manne de nectar de l'année pour les reines de bourdons qui s'engraissent pour l'hiver.",
      "american-goldfinch":
        "Les capitules laissés sur pied portent les chardonnerets tout l'hiver.",
    },
  },
  "Symphyotrichum subspicatum": {
    nativeNote:
      "L'aster bleu commun des prés, des talus de fossé, des falaises littorales et des bancs de rivière du versant ouest.",
    careNote:
      "Peu exigeant jusqu'à l'envahissement : il court à la racine et se ressème, donnez-lui donc une prairie, un bord de fossé ou un grand massif libre plutôt qu'un massif que vous voulez voir rester en place. Le rabattre de moitié début juin le rend plus touffu et l'empêche de s'affaler. Laissez les tiges sur pied tout l'hiver pour les insectes qui y sont.",
    givesNote:
      "Les asters sont l'autre moitié du duo de fin de saison avec la verge d'or, et à eux deux ils portent le réseau trophique d'août jusqu'aux gelées — l'une des meilleures plantes hôtes de chenilles parmi les vivaces, et le dernier gros repas de nectar avant l'hiver pour les reines de bourdons et les papillons migrateurs.",
    propagationNote:
      "La graine n'a besoin d'aucun traitement : semez-la en fin d'automne ou au début du printemps et couvrez-la à peine. On peut aussi diviser les touffes au début du printemps.",
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
      "Il demande du soleil et une terre qui reste fraîche jusqu'au début de l'été — il boude dans un massif chaud et sec. Comme les autres légumineuses il fabrique son propre azote : ne le nourrissez pas. Les pieds ne vivent pas longtemps ; laissez quelques gousses mûrir et il se remplace. Les graines sont toxiques si on en avale en quantité.",
    givesNote:
      "Des épis bleus que les bourdons travaillent toute la journée, et la plante nourricière d'un groupe de petits azurés — dont le Glaucopsyche lygdamus — dont les chenilles mangent du lupin et sont soignées par des fourmis pour les gouttes sucrées qu'elles exsudent. Ses racines laissent la terre plus riche qu'elles ne l'ont trouvée.",
    propagationNote:
      "Récoltez les gousses juste au moment où elles noircissent, avant qu'elles ne se vrillent et ne projettent la graine. Le tégument est dur : entaillez chaque graine à la lime ou frottez-la au papier de verre avant de semer — sinon la levée est irrégulière.",
    supportNotes: {
      "bumble-bees":
        "Des épis bleus que les bourdons travaillent toute la journée — les fleurs de lupin ne s'ouvrent que pour un insecte assez lourd pour en déclencher le ressort.",
    },
  },
  "Anaphalis margaritacea": {
    nativeNote:
      "Vivace aux feuilles argentées des terrains secs, ouverts et pauvres du versant ouest — bords de route, clairières et bancs de gravier.",
    careNote:
      "L'une des rares bonnes plantes pour le pire emplacement que vous ayez — du gravier, un talus chaud, une bande de trottoir — où elle n'a besoin d'aucune eau. Dans une bonne terre de jardin elle s'affale et court. Elle s'étend à la racine ; un coup de bêche autour au printemps est tout l'entretien.",
    givesNote:
      "La plante nourricière des chenilles de la vanesse de Virginie, dont les jeunes s'enveloppent dans les feuilles argentées et la soie. Ses bouquets de fleurs blanches papyracées nourrissent les petites abeilles indigènes tard dans la saison, puis sèchent sur la tige — l'« immortelle » de son nom — en gardant leur forme tout l'hiver.",
    propagationNote:
      "Divisez une touffe, ou semez la graine minuscule en fine couche à la surface — elle n'a besoin d'aucun traitement.",
    supportNotes: {
      "american-lady":
        "L'anaphale est une plante nourricière principale de la vanesse de Virginie, dont les jeunes s'enveloppent dans les feuilles laineuses et la soie.",
    },
  },
  "Viola adunca": {
    nativeNote:
      "La petite violette bleue des prairies, des dunes littorales, des ouvertures de prés et des gazons maigres du versant ouest, de la Colombie-Britannique à la Californie.",
    careNote:
      "Une toute petite plante qui n'a besoin que d'une chose : un terrain ouvert, bas et non fertilisé où des voisins plus hauts ne peuvent pas se refermer sur elle — le bord maigre d'un sentier, une bande de prairie graveleuse, un coin de pelouse que vous cessez de nourrir. Elle traverse l'hiver et le printemps humides et se tait dans la sécheresse d'été, ce qui est le régime du versant ouest : ne l'arrosez donc pas et ne la paillez pas épais. Si vous la gardez dans l'herbe, retenez la tondeuse jusqu'en juillet pour que la graine puisse mûrir. Elle se plante toute seule : les capsules mûres projettent la graine à plus d'un mètre, et elle fait aussi, au ras du sol, des boutons autogames qui ne s'ouvrent jamais, si bien qu'une colonie s'épaissit même après un mauvais printemps.",
    givesNote:
      "Chaque grand nacré d'ici — l'Argynnis hydaspe, l'A. zerene, l'A. cybele, et l'A. zerene hippolyta du littoral, inscrit sur la liste fédérale des espèces menacées — peut élever ses chenilles sur les violettes et sur absolument rien d'autre. Les femelles pondent en fin d'été, sur un sol sec, à côté de violettes déjà flétries ; les chenilles éclosent, ne mangent rien, passent tout l'hiver ainsi, et vont chercher des feuilles de violette au printemps suivant. Il ne suffit donc pas qu'une violette fleurisse une fois : il faut que la colonie soit encore là en avril. Plantez-en une nappe et vous faites la seule chose dont ces papillons ne peuvent pas se passer. Les fleurs elles-mêmes nourrissent tôt les petites abeilles solitaires, et les fourmis emportent la graine et la plantent pour vous.",
    propagationNote:
      "Attrapez la graine avant que les capsules ne se vrillent et ne la projettent — elles mûrissent vite au début de l'été — puis semez-la en pot laissé dehors pour l'hiver, ou directement sur une terre nue ratissée à l'automne ; il lui faut un passage froid et humide avant de lever. Une touffe installée peut aussi être démêlée au début du printemps, chaque souche enracinée continuant comme un pied à part.",
    supportNotes: {
      "greater-fritillaries":
        "Les violettes sont la seule chose qu'une chenille de grand nacré puisse manger — l'Argynnis hydaspe, l'A. zerene, l'A. cybele, et l'A. zerene hippolyta menacé du littoral. Et leur façon d'utiliser la plante est assez inhabituelle pour changer la manière de jardiner pour eux : la femelle pond en fin d'été sur un sol sec, à côté de violettes déjà flétries — elle ne choisit donc pas une plante en feuilles, elle choisit un endroit où elle a déjà trouvé des violettes. La chenille éclôt, ne mange rien, et passe tout l'hiver dans la litière — puis va chercher des feuilles de violette au printemps suivant. Il ne suffit donc pas que la colonie fleurisse une fois. Elle doit être encore là en avril, sur le même mètre carré.",
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
      "Une graminée en touffe indigène nette et résistante à la sécheresse, pour le soleil — la trame dans laquelle planter des fleurs sauvages pour une vraie prairie du versant ouest. Ni tonte, ni arrosage, ni engrais une fois installée.",
    givesNote:
      "Ses touffes vert-bleu quasi persistantes hébergent des hespéries, abritent les abeilles nichant au sol et les oiseaux, et maintiennent la terre sèche de la prairie — la charpente vivante d'une savane à chênes restaurée.",
    propagationNote:
      "Semez la graine à l'automne ou au printemps ; cette graminée en touffe de saison fraîche ne demande au plus qu'un bref passage au froid.",
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
      "De quoi nourrir les chenilles des hespéries et les satyres qui ne mangent que des graminées, et ses touffes sont là où ils passent l'hiver — une pelouse tondue ne leur laisse nulle part. Ses épis nourrissent bruants et juncos, et ses racines fibreuses profondes sont ce qui empêche vraiment une pente de s'en aller.",
    propagationNote:
      "À peu près la graine la moins capricieuse de toutes : égrenez les épis mûrs en fin d'été, quand les fleurons deviennent papyracés, et semez-les sur une terre ratissée à l'automne — la graine de plaine n'a besoin d'aucun froid.",
    supportNotes: {
      "grass-skippers":
        "Une graminée en touffe indigène est à la fois la nourriture des chenilles et l'abri d'hiver des hespéries et des satyres — une pelouse ne leur donne ni l'un ni l'autre.",
    },
  },
  "Carex obnupta": {
    nativeNote:
      "La laîche dominante des terrains humides du versant ouest — bras morts, fossés, bords de marais à marée, bois humides et mares saisonnières, de la Colombie-Britannique à la Californie.",
    careNote:
      "La plante que tout jardin de pluie et tout point bas détrempé du versant ouest attend. Elle se tient dans l'eau d'hiver des mois durant, puis tient bon à travers un août sans pluie, et elle reste verte toute l'année. Elle court à la racine en une large colonie : donnez-lui donc toute la zone humide plutôt qu'une touffe nette, et placez-la là où ses longues feuilles arquées — assez coupantes pour entailler un doigt qu'on ferait glisser dessus — ne barrent pas un passage. Peignez les feuilles mortes aux doigts ou au râteau en fin d'hiver ; c'est là tout l'entretien.",
    givesNote:
      "Les laîches sont ce que mangent les petits papillons bruns — plusieurs hespéries et satyres ne grandissent que sur des laîches et des graminées, et ils hivernent au fond de la touffe, ce qu'un bord tondu ne leur donne jamais. Bruants chanteurs, troglodytes et parulines masquées nichent et se cachent dans les touffes sur pied, la sauvagine et les bruants prennent la graine, et sous tout cela son matelas racinaire est le meilleur filtre de toutes les plantes d'ici : l'eau sort d'un peuplement de cette laîche plus propre et plus lente qu'elle n'y est entrée.",
    propagationNote:
      "La division est la voie fiable : soulevez une touffe au début du printemps, coupez-la en morceaux enracinés de la taille d'un poing à la bêche ou à un vieux couteau à pain, et replantez-les aussitôt dans la vase — ils ne doivent pas sécher entre l'arrachage et la plantation. Le semis marche aussi si vous égrenez les épis bruns mûrs en été et les semez en pot posé dans une soucoupe d'eau tout l'hiver.",
    supportNotes: {
      "grass-skippers":
        "Plusieurs des petites hespéries et satyres bruns grandissent sur des laîches plutôt que sur des graminées, et ils passent l'hiver à l'état de chenille au fond de la touffe. Un bord tondu ne leur donne ni la nourriture ni l'endroit où passer le froid.",
    },
  },
  "Juncus patens": {
    nativeNote:
      "Jonc indigène des suintements, des bords de fossé, des prés frais et des noues de bord de route, de Washington vers le sud jusqu'en Californie.",
    careNote:
      "Une fontaine nette et dressée de tiges raides bleu-gris qui reste en place au lieu de courir — ce qui en fait la seule plante de terrain humide d'ici qu'on puisse utiliser dans un petit jardin de pluie soigné ou près d'une descente de gouttière sans le regretter. Il lui faut l'humidité d'hiver et acceptera un été sec une fois installé, quoiqu'il ait meilleure allure avec un arrosage de temps en temps. Persistant : ne le coupez pas au ras du sol. Retirez simplement les tiges brunes aux doigts en fin d'hiver, comme on peignerait un chien.",
    givesNote:
      "Les joncs sont un couvert plus qu'une nourriture, et le couvert est précisément ce dont un petit jardin humide n'a aucun : grenouilles, carabes et insectes en hivernage passent le froid à l'intérieur de la touffe, juncos et bruants prélèvent la minuscule graine sur les tiges, et le bouchon racinaire dense tient le bord d'une noue tandis que l'eau passe devant. Une poignée de papillons de nuit se nourrit bien de joncs, ce n'est donc pas rien sur ce plan non plus.",
    propagationNote:
      "Récoltez les inflorescences brunes en été et semez la graine minuscule à peine couverte sur un terreau humide ; elle n'a besoin d'aucun autre traitement et lève en un mois environ.",
  },
  "Lonicera ciliosa": {
    nativeNote:
      "Chèvrefeuille grimpant indigène des lisières boisées et des fourrés du versant ouest — pas l'espèce envahissante.",
    careNote:
      "Une grimpante indigène sage — rien à voir avec les chèvrefeuilles de l'Himalaya ou du Japon envahissants. Donnez-lui un treillage, une clôture ou un arbuste où s'enrouler, les racines à l'ombre et la tête au soleil.",
    givesNote:
      "Ses verticilles de trompettes orange nourrissent les colibris et les baies rouges qui suivent nourrissent les passereaux ; un remplaçant indigène des lianes ornementales envahissantes.",
    propagationNote:
      "Prélevez des boutures de pousses en voie d'aoûtement en été, ou fixez une tige basse au sol pour qu'elle s'enracine là où elle le touche.",
    supportNotes: {
      "annas-rufous-hummingbird":
        "Ses fleurs en trompette orange en font l'une des meilleures lianes à colibris indigènes de l'Ouest.",
    },
  },
  "Rubus ursinus": {
    nativeNote:
      "La seule mûre véritablement indigène du versant ouest — rampant à travers les clairières, les lisières, les brûlis et les bords de route, de la Colombie-Britannique à la Californie.",
    careNote:
      "Presque toutes les ronces qu'on maudit ici sont l'autre espèce. Celle-ci a des cannes grêles, rondes en section, pas plus épaisses qu'un lacet, des aiguillons droits et fins, et trois folioles ; la ronce d'Arménie a des cannes arquées grosses comme un pouce, à côtes, des épines crochues comme une griffe de chat, et cinq folioles sur les cannes principales. L'indigène court à plat sur le sol au lieu de s'entasser en muraille. Elle vagabonde tout de même — donnez-lui un talus, une ligne de clôture ou la lisière broussailleuse d'un fourré plutôt qu'un massif, coupez chaque hiver à la base les cannes qui ont fructifié, et relevez les pointes avant qu'elles ne s'enracinent là où vous n'en voulez pas.",
    givesNote:
      "Les ronces sont parmi les toutes premières plantes nourricières de chenilles de l'Ouest, et celle-ci est l'indigène : elle joue donc pleinement ce rôle, là où la ronce d'Arménie n'apporte presque rien. Ses fleurs blanches sont couvertes de bourdons et de petites abeilles solitaires au printemps. Puis les mûres — petites, sombres, pleines de pépins, et meilleures que tout ce qu'on peut acheter — pour les tohis, les grives, les geais, les renards et les coyotes, avec le fouillis bas et épineux qui donne aux oiseaux nichant au sol et aux lapins un endroit où se cacher.",
    propagationNote:
      "Elle le fait pour vous : comme chez la plupart des ronces, une pointe de canne qui touche une terre nue s'enracine et donne un nouveau plant. En fin d'été, fixez une pointe au sol, et au printemps détachez-la avec ses racines et déplacez-la.",
    supportNotes: {
      "bumble-bees":
        "Ses fleurs blanches de printemps sont ouvertes, peu profondes et partout à la fois, ce qui fait de cette mûre rampante l'un des plus gros repas faciles de l'année, aussi bien pour les bourdons que pour les petites abeilles indigènes.",
      "berry-songbirds":
        "Tohis, grives et geais prennent les petites mûres sombres, et le fouillis bas et épineux dessous est là où un oiseau nichant au sol peut vraiment s'en sortir.",
    },
  },
  "Clematis ligusticifolia": {
    nativeNote:
      "Grimpante indigène des bancs de rivière, des fourrés riverains et des vieilles lignes de clôture du versant ouest, et la seule clématite indigène de la région.",
    careNote:
      "Une grande grimpante forte et rapide — elle ensevelira un petit arbuste : donnez-lui une clôture, une tonnelle, un arbre mort ou un talus qu'elle ne peut pas tuer, et taillez-la sévèrement en fin d'hiver. Elle grimpe en vrillant ses pétioles autour des choses plutôt qu'en collant aux murs. Les fleurs mâles et femelles sont sur des pieds séparés : seuls certains font les plumets de graines soyeux. Sa sève irrite la peau et la bouche, et la plante est toxique à l'ingestion : à tenir à l'écart d'un animal au pâturage. Une chose de plus à vérifier à l'achat : la clématite des haies (Clematis vitalba), introduite, est très envahissante ici et lui ressemble — les folioles de l'indigène sont grossièrement dentées ou trilobées, celles de l'introduite surtout à bord lisse ou à peine dentées, et les vieilles tiges de l'introduite deviennent cordées et grosses comme un poignet.",
    givesNote:
      "Sa valeur, c'est la date. Ses fleurs crème écumeuses s'ouvrent en juillet et continuent jusqu'en septembre, dans la longue période chaude qui suit la fin des arbustes et précède le départ des asters — et les petites abeilles indigènes, les guêpes, les syrphes et les coléoptères s'y jettent. Ensuite elle s'argente de plumets de graines plumeux, que colibris, mésanges buissonnières et parulines démontent pour garnir leurs nids, et le fouillis lui-même devient un couvert de nidification épais dans une haie.",
    propagationNote:
      "Les boutures tendres portant un bourgeon sont la voie préférée et s'enracinent en deux à trois semaines sous abri. Les tiges basses se marcottent aussi là où elles touchent un sol paillé. La graine n'a pas besoin d'un long froid : faites-la tremper deux jours dans l'eau, puis semez.",
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
      "La multiplication la plus facile qui soit : il émet des stolons qui enracinent de petits plants en voyageant. Coupez simplement un plant enraciné et mettez-le en pot, ou plantez-le là où vous en voulez plus.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches printanières au ras du sol, s'ouvrant avec les premières abeilles solitaires et faciles à travailler pour une petite.",
      "berry-songbirds":
        "De petites fraises rouge foncé en été pour les tohis, les merles d'Amérique et les bruants — et pour qui arrive le premier.",
    },
  },
  "Arctostaphylos uva-ursi": {
    nativeNote:
      "La busserole tapisse les terrains secs, ensoleillés et pauvres — falaises littorales, épandages de gravier et bois clairs du versant ouest.",
    careNote:
      "La réponse indigène à un talus chaud et sec où rien ne veut pousser — mais seulement si le sol est parfaitement drainé, acide et maigre. Elle supporte mal les sols riches, l'irrigation d'été et l'ombre, et elle est lente à se refermer : plantez serré et paillez à l'écorce ou au gravier le temps qu'elle garnisse. Une fois en place, elle ne vous demande rien pendant des décennies.",
    givesNote:
      "Un couvert persistant qui tient une pente à travers l'hiver le plus pluvieux, des fleurs roses en clochettes au tout début du printemps pour les reines de bourdons et les osmies qui émergent, et des baies rouges qui restent sur la plante jusqu'en hiver pour les gélinottes, les merles d'Amérique et les tohis, quand il ne reste presque rien.",
    propagationNote:
      "Prélevez les pousses de l'année en fin d'été ou à l'automne, une fois aoûtées, et faites-les raciner sous abri dans un mélange graveleux et tourbeux — il faut de la patience. Plus simple encore : les tiges rampantes s'enracinent là où elles touchent le sol ; fixez-en une et détachez-la l'année suivante.",
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
      "L'ossature persistante fiable de l'ombre du versant ouest, du frais au étonnamment sec une fois installée. Coupez les vieilles frondes en fin d'hiver, avant que les nouvelles ne se déroulent.",
    givesNote:
      "Elle reste verte tout l'hiver, ses grandes frondes retenant la litière de feuilles et ralentissant l'érosion sur une pente ombragée, et offrant un couvert aux salamandres et à la petite faune. Les fougères nourrissent très peu de chenilles — retenue pour le couvert à l'ombre et contre l'érosion, pas pour sa valeur alimentaire.",
    propagationNote:
      "Élevez-le à partir des spores qui mûrissent au revers des frondes en été : semez-les sur un terreau stérile et humide, sous couvert hermétique et à l'ombre. C'est lent — environ deux ans jusqu'à un plant en pot.",
  },
  "Struthiopteris spicant": {
    nativeNote:
      "La fougère persistante des forêts fraîches et ombragées du versant ouest — souvent sur du bois en décomposition et des berges. Longtemps connue sous le nom de Blechnum spicant.",
    careNote:
      "Plus difficile que le polystic à épées sur l'humidité : elle demande une vraie ombre, un sol acide bien pourvu en bois décomposé ou en terreau de feuilles, et une terre qui ne sèche jamais complètement en août. Si vous y parvenez, c'est une merveille — une rosette plate de frondes couchées avec des frondes fertiles étroites et dressées sortant du milieu.",
    givesNote:
      "Un couvert et un abri verts tout l'hiver sur un sol forestier ombragé, tenant la terre d'un talus frais et donnant aux amphibiens et à la petite faune un refuge. Comme toutes les fougères elle ne nourrit presque aucune chenille — elle gagne sa place comme habitat et contre l'érosion, pas comme nourriture.",
    propagationNote:
      "Les frondes dressées du milieu portent les spores : entre le milieu et la fin de l'été, posez-en une mûre sur du papier pour recueillir la poussière, puis semez-la sur un terreau stérile et humide dans un pot fermé, et attendez — des mois, pas des semaines. On peut aussi diviser une touffe établie au printemps.",
  },
  "Sedum oreganum": {
    nativeNote:
      "Orpin indigène aux feuilles charnues des affleurements rocheux, des corniches de falaise, des graviers et des falaises littorales du versant ouest, de l'Alaska au nord de la Californie.",
    careNote:
      "Fait pour l'endroit dont rien d'autre ne veut : un bord d'allée de gravier, un dessus de mur, une bande de caillasse brûlante à côté de l'entrée, un toit végétalisé, un creux de rocher. Il stocke sa propre eau dans ces feuilles gonflées en bonbons : c'est donc l'excès de soins qui le tue — une terre riche, un paillis, de l'ombre ou un arroseur. Donnez-lui du gravier, du soleil, et rien d'autre. Il se referme lentement en un tapis qui bronze au rouge là où le soleil frappe le plus fort, et toute rosette qui se casse et tombe sur la terre s'enracine tout simplement.",
    givesNote:
      "Petit, et porteur d'une histoire hors de proportion avec lui : les chenilles du Callophrys mossii, un petit papillon gris-brun qui vole au tout début du printemps, mangent des orpins indigènes et à peu près rien d'autre, et les apollons des pentes plus hautes l'utilisent aussi. Au cœur de l'été, ses fleurs jaunes étoilées sont un bar à nectar pour les petites abeilles solitaires, sur un terrain si pauvre que rien d'autre n'offre quoi que ce soit. Il fait aussi un vrai travail en tenant une terre maigre sur une paroi rocheuse nue où toute plante à racines plus profondes glisserait simplement.",
    propagationNote:
      "L'une des plantes les plus faciles à multiplier : au début de l'été, prélevez une courte pousse sans fleur et posez-la sur du gravier humide, où elle s'enracine vite. Diviser un tapis marche aussi.",
    supportNotes: {
      "mosses-elfin":
        "Les chenilles du Callophrys mossii mangent des orpins indigènes et rien d'autre, et elles mangent les fleurs et les graines en formation plutôt que les feuilles charnues. C'est un papillon de rocher — un mur, un affleurement, un toit de gravier — et c'est donc l'une des rares plantes qui transforment un terrain franchement hostile en habitat.",
    },
  },
  "Eriogonum umbellatum": {
    nativeNote:
      "Sarrasin sauvage indigène en tapis des ouvertures sèches, rocheuses et ensoleillées — falaises de la gorge du Columbia, pentes des Cascades et des Klamath, et pelouses sommitales du versant ouest.",
    careNote:
      "Plein soleil et sol parfaitement drainé, puis laissez-le entièrement tranquille — ni engrais, ni eau d'été, ni paillis sur la souche. C'est un tapis ligneux bas de petites feuilles, vertes dessus et feutrées de blanc dessous, qui pousse de courtes hampes de petites ombelles jaunes. Les fleurs vieillissent en passant du crème à un cuivre rouillé et restent sur la plante des semaines après, ce qui est la moitié de la raison de le cultiver. Il boude et pourrit dans une argile lourde et humide ; sur un talus graveleux ou une rocaille il dure des années.",
    givesNote:
      "Les sarrasins sauvages indigènes sont les plantes à nectar à tout faire des terrains secs de l'Ouest — peu de choses sur un sol pauvre sont plus animées de petites abeilles indigènes, de guêpes et de coléoptères au plus fort de l'été. Ils sont aussi la nourriture des chenilles de toute une série de petits papillons, les azurés et les théclas que presque personne ne remarque, et pour plusieurs d'entre eux le sarrasin est la seule plante sur laquelle ils pondront. Juncos et autres petits oiseaux en prélèvent la graine à l'automne.",
    propagationNote:
      "Égrenez les inflorescences sèches en fin d'été et semez-les dans un pot de terreau graveleux. Elle peut germer sans aide, mais un hiver dehors (ou deux à trois mois au réfrigérateur) améliore la levée. La graine perd sa vitalité en quelques années : semez-la fraîche.",
    supportNotes: {
      "buckwheat-butterflies":
        "Les sarrasins sauvages portent tout un cortège de petits papillons que presque personne ne remarque — les azurés et les théclas verts — et plusieurs d'entre eux ne pondront que sur du sarrasin. Une colonie sur un talus chaud et pauvre fait plus pour eux qu'un massif de fleurs à nectar.",
      "bumble-bees":
        "Ses ombelles plates, du crème à la rouille, s'échelonnent sur toute la période la plus sèche de l'été, quand une pente sèche n'a presque rien d'autre d'ouvert.",
    },
  },
  "Adiantum aleuticum": {
    nativeNote:
      "La capillaire à tiges noires des suintements, des zones d'embrun de cascade et des berges ombragées du versant ouest, de l'Alaska à la Californie.",
    careNote:
      "La plus belle fougère d'ici et la moins indulgente : des tiges noires et fines portant un éventail plat de folioles vert pâle qui frémissent au moindre souffle. Il lui faut ce qu'offre une corniche de cascade — de l'ombre profonde, une terre qui ne sèche jamais complètement en août, et un air qui ne cuit pas. Un mur nord avec une descente de gouttière à côté, ou le bord ombragé d'un bassin, en est assez proche. Une demi-journée de soleil d'après-midi ou un seul août oublié et elle se recroqueville. Elle disparaît complètement en hiver : marquez son emplacement, et paillez-la au terreau de feuilles plutôt qu'à l'écorce.",
    givesNote:
      "Soyons francs : les fougères ne nourrissent presque aucune chenille, et elle est ici pour ce qu'elle fait plutôt que pour ce qu'elle nourrit. Elle tient une terre ombragée et fraîche sur un talus qui, sinon, s'en irait, garde le sol dessous frais et humide pour les salamandres, les coléoptères et la petite vie que les oiseaux chassent, et elle fait d'un coin sombre et difficile un endroit où l'on a envie de se tenir.",
    propagationNote:
      "Élevez-le à partir des spores : récoltez les frondes en fin d'été, quand les enveloppes des spores se soulèvent, laissez tomber les spores sur du papier, et semez-les sur de la tourbe fine, humide et stérile, dans un bac fermé. Elles germent en deux semaines environ, mais il faut des mois avant que quoi que ce soit ressemble à une fougère.",
  },
  "Woodwardia fimbriata": {
    nativeNote:
      "La plus grande fougère du versant ouest — suintements, ravins forestiers humides et berges, de la Colombie-Britannique vers le sud à travers les chaînes côtières et les Klamath.",
    careNote:
      "Pas une plante de petit massif : une seule fronde atteint deux à trois mètres sur un site humide, s'arquant hors d'une souche massive — donnez-lui la place que vous donneriez à un arbuste. Ce sur quoi elle n'admet aucun compromis, c'est l'eau à la racine toute l'année — un suintement, un bord d'étang, le pied humide d'un talus exposé au nord, le trop-plein d'un jardin de pluie — avec de l'ombre ou de la mi-ombre au-dessus. Elle garde ses frondes dans les hivers doux et paraît malmenée après une forte gelée ; coupez les abîmées à la base en fin d'hiver et elle repart plus grande. Lente les trois premières années, puis soudain architecturale.",
    givesNote:
      "La même réserve que pour les autres fougères : presque rien ne la mange. Ce qu'elle donne, c'est de la structure et de l'abri à une échelle qu'aucune autre plante d'ombre d'ici n'offre — un espace frais, humide et perpétuellement ombragé en dessous, où vivent salamandres, grenouilles, carabes et insectes en hivernage, où chassent les troglodytes, et où la terre d'un talus humide reste en place à travers un hiver de pluie. Dans un jardin de pluie ombragé, c'est la plante qui fait que la partie humide a l'air voulue.",
    propagationNote:
      "Les rangées de sporanges en chaîne le long des nervures, au revers des frondes, lui donnent son nom. Posez une fronde mûre sur du papier pendant une nuit pour recueillir la poussière, puis semez-la sur un terreau stérile et humide dans un pot fermé, et attendez-vous à patienter de longs mois. Les vieilles souches peuvent aussi être divisées.",
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
