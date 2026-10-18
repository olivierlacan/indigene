// Florida — both lists in one file, because the two regions share nine taxa and
// keeping a live oak's two paragraphs side by side is how you notice they say
// different things.
//
// North & central Florida holds the plain keys; every south Florida and Keys
// entry is region-qualified (`"Latin@florida-south"`), whether or not the north
// lists the plant too. Red maple and butterfly weed belong to the
// Mid-Atlantic list first, so their Florida rows are qualified too.
//
// **Most of these have no French name**, and this file does not invent one: a
// paragraph names the plant the way `nameLines()` does, with its scientific name,
// exactly as the heading above it will. Three Florida habitat words have no
// French equivalent either — *hammock*, *flatwoods*, *scrub* — so each is used as
// the local term and explained in place the first time it does real work in a
// paragraph. See `./index.ts`.
import type { ProseTable } from "../../lib/prose";

export const FLORIDA: ProseTable = {
  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — arbres.
  // -------------------------------------------------------------------------
  "Quercus virginiana": {
    nativeNote:
      "Le chêne persistant à large couronne emblématique des hammocks de Floride — ces îlots de forêt dense et humide — et des vieilles avenues.",
    careNote:
      "Donnez-lui de la vraie place — sa couronne s'étale bien plus large que haute, et un chêne de Virginie adulte est un voisin pour la vie. Résistant au vent et à la sécheresse une fois installé ; l'un des arbres d'ombre les plus résistants aux ouragans.",
    givesNote:
      "Les chênes hébergent plus d'espèces de chenilles qu'aucun autre genre d'arbre ici — des centaines — plus des glands pour les geais, les pics, les dindons sauvages et les écureuils, un abri persistant, et des branches qui deviennent des jardins de fougère de résurrection, de broméliacées et de mousse espagnole.",
    propagationNote:
      "Ramassez les glands frais à l'automne et semez-les aussitôt — un gland de chêne de Virginie germe aussitôt et n'a aucun besoin de passer par le froid. Mettez-les dans l'eau et jetez ceux qui flottent, gardez ceux qui coulent, et ne les laissez jamais sécher. Il descend tôt une racine pivotante profonde : démarrez-le là où il restera.",
    supportNotes: {
      "acorn-birds":
        "Les glands du chêne de Virginie nourrissent geais, dindons sauvages, pics et canards hivernants.",
      "acorn-mammals":
        "Un arbre à glands de première importance pour les écureuils, les cerfs de Virginie et d'autres mammifères.",
    },
  },
  "Pinus palustris": {
    supportNotes: {
      "brown-headed-nuthatch":
        "La sittelle à tête brune vit dans le pin des marais et presque nulle part ailleurs — elle fouille l'écorce à la recherche d'insectes et creuse son nid dans un chicot mort. Laissez le bois mort sur pied et vous gardez l'oiseau.",
      "acorn-birds":
        "Les dindons sauvages travaillent le sol sous les pins pour la graine tombée, et les pics travaillent les troncs au-dessus.",
    },
    nativeNote:
      "Le pin clé de voûte des collines sableuses et des flatwoods à pin des marais — ces pinèdes plates du bas pays — un milieu menacé qui couvrait autrefois une grande partie de la Floride.",
    careNote:
      "Il passe ses premières années au ras du sol, en « stade herbe », avant de partir en flèche — c'est normal, ce n'est pas un plant rabougri. Il demande un sol sableux, bien drainé, et le plein soleil ; il est adapté au feu. Très résistant à la sécheresse et au vent une fois installé.",
    givesNote:
      "La fondation de l'écosystème à pin des marais : des graines et un couvert pour les oiseaux et les tortues gaufrées, des centaines de chenilles sur les pins, et un houppier ouvert et ensoleillé qui laisse prospérer un couvre-sol d'une grande diversité en dessous.",
    propagationNote:
      "Récoltez la graine des cônes mûrs à l'automne et semez-la fraîche la même saison — elle lève rapidement et n'a besoin d'aucun froid. La graine ne se conserve pas : ne la laissez pas sécher au fond d'un tiroir tout l'hiver.",
  },
  "Taxodium distichum": {
    supportNotes: {
      "cecropia-moth":
        "Le cyprès chauve fait partie des arbres que les chenilles du grand paon d'Amérique acceptent — un choix curieux pour un grand bombyx, et un choix documenté.",
    },
    nativeNote:
      "Le conifère à feuilles caduques classique des marécages, des berges et des bords d'étang de Floride.",
    careNote:
      "La réponse à un emplacement humide, inondable ou au bord d'un étang — il prospère les pieds dans l'eau et y pousse des « genoux » — mais il se porte aussi très bien dans un jardin ordinaire une fois installé. Il demande un peu d'eau le temps de démarrer sur un site sec.",
    givesNote:
      "Un superbe arbre pour les eaux de pluie et les berges : il absorbe les crues, tient un sol détrempé, abrite les échassiers et les anhingas, et vit des siècles.",
    propagationNote:
      "Ramassez les cônes ronds à l'automne et émiettez-les pour libérer la graine. Semez-la fraîche sur une terre mouillée ou dans la vase — un bon trempage préalable aide — et maintenez-la constamment humide. Aucun passage au froid n'est nécessaire.",
  },
  "Magnolia grandiflora": {
    supportNotes: {
      "eastern-carpenter-bee":
        "Une fleur de magnolia est une conception très ancienne — pas de guides de nectar, pas de piste d'atterrissage, juste une coupe de pollen. Une fleur ancienne faite pour les coléoptères ; les xylocopes viennent aussi pour le pollen.",
      "acorn-mammals":
        "Le cône s'ouvre à l'automne pour suspendre ses graines écarlates au bout de fils, et les écureuils gris et fauves viennent les chercher.",
    },
    nativeNote:
      "Le feuillu persistant des hammocks et des coteaux du nord et du centre de la Floride.",
    careNote:
      "Persistant et résistant à la sécheresse une fois installé. Il perd des feuilles toute l'année : il se plaît donc davantage avec sa jupe de branches basses qu'avec la couronne relevée au-dessus d'une pelouse.",
    givesNote:
      "D'énormes fleurs au parfum de citron pollinisées par les coléoptères et les abeilles, des graines rouges que mangent oiseaux et écureuils, et un couvert persistant dense avec des sites de nidification.",
    propagationNote:
      "Quand les cônes s'ouvrent à l'automne, prélevez les graines et frottez-en l'enveloppe rouge charnue (un trempage la ramollit) — cette enveloppe empêche la germination. Semez frais et ne laissez jamais sécher ; un court passage frais et humide pendant l'hiver les aide à se réveiller au printemps.",
  },
  "Sabal palmetto": {
    supportNotes: {
      "berry-songbirds":
        "Un palmier de Floride en fruit est une mangeoire de la taille d'un arbre — merles d'Amérique, moqueurs chats, moqueurs polyglottes et viréos prennent les drupes noires pendant des semaines.",
      "cedar-waxwing":
        "Les bandes de jaseurs se posent dans un palmier en fruit et vident l'équivalent d'une palme de drupes en quelques minutes.",
      "acorn-mammals":
        "Ratons laveurs, cerfs et ours noirs prennent tous le fruit du palmier, ce qui explique qu'un hammock à sabals nourrisse autant de monde à la fois.",
    },
    nativeNote:
      "L'arbre emblème de l'État de Floride ; indigène partout, des hammocks aux bords de marais littoraux.",
    careNote:
      "Quasi indestructible — il encaisse le sel, la sécheresse, les crues, les sols sableux comme lourds, et du plein soleil à la mi-ombre, et c'est l'un des arbres les plus résistants aux ouragans qui soient. Lent à prendre de la hauteur de tronc. Laissez en place les vieilles bases de feuilles, les « bottes », pour la faune.",
    givesNote:
      "Ses panicules de fleurs d'été grouillent d'abeilles ; ses fruits noirs nourrissent merles d'Amérique, moqueurs, ratons laveurs et bien d'autres ; et sa couronne et son tronc couvert de bottes abritent chauves-souris, grenouilles et oiseaux nicheurs.",
    propagationNote:
      "Le Sabal palmetto ne se multiplie que par semis — un palmier ne se divise pas et ne se bouture pas. Récoltez les fruits noirs à maturité, pressez et lavez la pulpe pour dégager la graine, et semez-la fraîche, au chaud et à l'humide. Soyez patient : il est lent à lever et lent à pousser.",
    lookalikeNotes: {
      "washingtonia-robusta": {
        why: "Deux palmiers en éventail dans la même rue — et le grand mince de la carte postale n'est pas l'arbre emblème de la Floride.",
        tells: [
          { feature: "L'éventail", native: "Le pétiole se prolonge dans l'éventail et le courbe : la feuille se plie comme un taco.", lookalike: "Le pétiole s'arrête là où l'éventail commence ; la feuille est plate." },
          { feature: "Filaments", native: "De fins filaments pendent entre les segments de la feuille.", lookalike: "Aucun filament." },
          { feature: "Bord du pétiole", native: "Lisse — sans dents.", lookalike: "Bordé d'épines orange recourbées." },
          { feature: "Tronc", native: "Épais et gris, portant souvent encore les vieilles bases de feuilles croisées.", lookalike: "Mince, très haut et droit, en général avec une jupe de palmes brunes mortes." },
        ],
      },
    },
  },
  "Chionanthus virginicus": {
    supportNotes: {
      "cecropia-moth":
        "L'arbre à frange nourrit les chenilles des grands sphinx et bombyx indigènes — dont le sphinx ondulé, dont la larve a exactement la couleur de la feuille sous laquelle elle se tient.",
    },
    nativeNote:
      "Petit arbre indigène à floraison des lisières boisées du nord et du centre de la Floride.",
    careNote:
      "Un petit arbre facile pour une exposition mi-ombragée et une humidité moyenne — une bonne alternative indigène aux plantes ornementales exotiques. Un peu d'eau pendant les périodes sèches le temps qu'il s'installe.",
    givesNote:
      "Des nuages de fleurs blanches parfumées, en fines franges, au printemps pour les abeilles ; les pieds femelles portent des fruits bleus que les oiseaux dépouillent rapidement.",
    propagationNote:
      "Celui-là met votre patience à l'épreuve. Débarrassez les fruits bleus de leur pulpe et semez la graine, mais attendez-vous à ce qu'elle attende deux saisons — il lui faut une période chaude puis une période fraîche avant que la racine et la tige ne viennent, ce qui peut prendre un an et demi ou plus. Semez et oubliez, et ne renoncez pas trop tôt.",
  },

  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — arbustes.
  // -------------------------------------------------------------------------
  "Serenoa repens": {
    nativeNote:
      "Le palmier de sous-bois qui définit le scrub — cette broussaille sableuse basse — les flatwoods et les lisières de hammock de Floride : l'une des plantes les plus importantes de l'État pour la faune.",
    careNote:
      "À peu près aussi robuste qu'une plante de Floride peut l'être — résistant à la sécheresse, au feu, au sel et aux ouragans, extrêmement longévif, et à l'aise au soleil comme à l'ombre. Très lent, et difficile à transplanter une fois installé : partez d'un petit plant et choisissez sa place pour de bon. Les pétioles portent de fines dents (d'où le « saw » de son nom anglais).",
    givesNote:
      "L'une des meilleures plantes de Floride pour la faune : ses fleurs précoces sont une source de nectar de premier ordre (le fameux miel de palmetto), ses fruits nourrissent ours, tortues gaufrées, oiseaux et bien d'autres, et ses touffes denses abritent d'innombrables petits animaux.",
    propagationNote:
      "Le Serenoa repens ne se multiplie que par semis — il ne se divise pas et ne se bouture pas. Lavez la pulpe des fruits mûrs et semez la graine fraîche et au chaud. Sachez qu'il est réputé lent : des mois pour lever et des années pour faire une plante, alors achetez-en un petit si vous ne pouvez pas attendre.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits d'automne du Serenoa repens sont mangés par de nombreux oiseaux ; ses fleurs de printemps sont une source de nectar et de miel légendaire.",
      "gopher-tortoise":
        "Le scrub à Serenoa repens est l'habitat central de la tortue gaufrée, et les baies font partie de son régime.",
    },
  },
  "Callicarpa americana": {
    nativeNote:
      "Arbuste indigène commun des lisières boisées et des clairières de Floride.",
    careNote:
      "Rapide, facile et résistant à la sécheresse, au soleil ou à mi-ombre ; il se ressème souvent alentour. Rabattez-le sévèrement en fin d'hiver pour une silhouette plus pleine.",
    givesNote:
      "Des fleurs d'été pour les pollinisateurs, puis les grappes de baies magenta que moqueurs, cardinaux et des dizaines d'oiseaux (et les ratons laveurs) dévorent à l'automne.",
    propagationNote:
      "À peu près aussi facile qu'une indigène puisse l'être. Écrasez les baies magenta mûres, rincez-en les graines, et semez-les au chaud — elles ne demandent presque rien. Ou coupez au printemps ou en été quelques pousses vertes tendres : elles s'enracinent vite.",
    supportNotes: {
      "berry-songbirds":
        "Les grappes magenta du callicarpe sont dévorées par les moqueurs, les cardinaux et les grives à l'automne.",
    },
    lookalikeNotes: {
      "callicarpa-dichotoma": {
        why: "Deux callicarpes vendus sous le même nom, portant tous deux des fruits violets vifs à l'automne.",
        tells: [
          { feature: "Où sont les fruits", native: "Serrés en gros anneaux qui embrassent la tige à chaque paire de feuilles.", lookalike: "En petits bouquets lâches portés à l'écart de la tige sur de courts pédoncules." },
          { feature: "Couleur des fruits", native: "Magenta profond.", lookalike: "Lilas à violet." },
          { feature: "Taille", native: "Hauteur de tête, s'arquant largement.", lookalike: "Hauteur de hanche, et bien net." },
          { feature: "Feuilles", native: "Grandes, molles, feutrées au revers, grossièrement dentées.", lookalike: "Plus petites, plus minces, lisses, dentées seulement au-dessus du milieu." },
        ],
      },
    },
  },
  "Hamelia patens": {
    nativeNote:
      "Indigène (var. patens) des lisières de hammock du centre et du sud de la Floride — achetez la vraie indigène, pas les formes exotiques « dwarf » ou « compact ».",
    careNote:
      "Elle aime la chaleur, le soleil et un sol sec à moyen, et fleurit presque toute l'année dans les zones sans gel. Au nord de la zone 9b environ, elle disparaît au gel et repart des racines — traitez-la là comme une grande vivace. Exigez la vraie espèce indigène.",
    givesNote:
      "Ses fleurs tubulaires rouge-orangé nourrissent les colibris, les Heliconius charithonia, les Agraulis vanillae et les coliades du printemps à l'automne, et ses baies sombres nourrissent les oiseaux.",
    propagationNote:
      "La voie la plus simple est la bouture — coupez pendant les mois chauds une pousse tendre ou tout juste aoûtée et elle s'enracine volontiers. Vous pouvez aussi presser la graine des baies sombres mûres et la semer au chaud. Prenez vos boutures sur un pied dont vous savez qu'il est la vraie indigène, pas un « dwarf firebush » de pépinière.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Les tubes rouge-orangé de la Hamelia patens sont un aimant à colibris et à papillons toute la saison.",
      "zebra-longwing":
        "Une grosse source de nectar pour les Heliconius charithonia et les Agraulis vanillae.",
    },
    lookalikeNotes: {
      "hamelia-patens-glabra": {
        why: "Vendues sous le même nom — firebush — sur le même étal, et la compacte fleurit plus jeune en pot.",
        tells: [
          { feature: "Fleurs", native: "De longs tubes étroits, rouge-orangé sur toute leur longueur, en bouquets unilatéraux.", lookalike: "Des tubes plus courts et plus larges, jaune-orangé à rouge pâle." },
          { feature: "Feuilles et tiges", native: "Doucement velues, en général par verticilles de trois, à pétioles rouges et pousses neuves rouges.", lookalike: "Lisses et luisantes, en général par paires, à pétioles verts." },
          { feature: "Port", native: "Grande et lâche — elle tend à devenir un petit arbre.", lookalike: "Basse, dense et nette ; souvent étiquetée « dwarf firebush »." },
          { feature: "Ce qu'elle apporte", native: "La plante sur laquelle sont recensés les Heliconius charithonia, le sphinx Xylophanes pluto et les colibris de Floride.", lookalike: "Du nectar — mais pas ces observations." },
        ],
      },
    },
  },
  "Ilex vomitoria": {
    nativeNote:
      "Un houx indigène adaptable des bois, des lisières et des stations littorales de Floride.",
    careNote:
      "Extrêmement robuste — il prend le soleil comme l'ombre, l'humide comme le sec, le sel et les sols pauvres — et il se taille bien en haie indigène. Seuls les pieds femelles fructifient : prévoyez-en un. (Ses feuilles sont la seule source indigène de caféine d'Amérique du Nord, infusée sous le nom de « yaupon ».)",
    givesNote:
      "Des fleurs printanières pour les abeilles, puis de lourdes récoltes de baies rouges translucides dont jaseurs d'Amérique, merles d'Amérique, moqueurs et merlebleus se nourrissent tout l'hiver ; un couvert dense pour nicher.",
    propagationNote:
      "Les boutures sont de loin la voie la plus facile — prélevez des pousses en voie d'aoûtement en fin d'été et faites-les raciner : vous saurez ainsi si vous avez une femelle porteuse de baies. Le semis marche aussi mais il est très lent, restant souvent un an ou plus avant de lever. N'oubliez pas qu'il faut un mâle à proximité pour qu'une femelle fructifie.",
    supportNotes: {
      "berry-songbirds":
        "Les baies rouges translucides de l'Ilex vomitoria persistent jusqu'en hiver pour les moqueurs, les merles d'Amérique et les jaseurs.",
      "cedar-waxwing":
        "Ses fruits qui tiennent tout l'hiver attirent les bandes errantes de jaseurs.",
    },
  },
  "Viburnum obovatum": {
    nativeNote:
      "Une viorne indigène des bords de cours d'eau, des hammocks et des flatwoods de Floride.",
    careNote:
      "Adaptable et facile du soleil à la mi-ombre ; quasi persistante en Floride, elle se taille bien en haie ou en petit arbre. Elle tolère un terrain frais.",
    givesNote:
      "Une poussée de minuscules fleurs blanches très tôt dans l'année nourrit les abeilles et les papillons qui émergent, ses fruits nourrissent les oiseaux, et elle héberge de nombreuses chenilles.",
    propagationNote:
      "Le plus facile par bouture — prélevez au début de l'été une pousse tout juste aoûtée et faites-la raciner. Le semis est possible à partir des fruits noirs nettoyés mais il est lent et capricieux : la plupart des jardiniers s'en tiennent aux boutures.",
    supportNotes: {
      "berry-songbirds":
        "Ses petites drupes sombres nourrissent les passereaux ; ses fleurs précoces nourrissent les pollinisateurs.",
    },
  },
  "Myrcianthes fragrans": {
    nativeNote:
      "Arbuste persistant aromatique des hammocks et des bois littoraux du centre et du sud de la Floride.",
    careNote:
      "Un persistant robuste, tolérant au sel et à la sécheresse, pour le soleil ou la mi-ombre — excellent en sujet isolé, en haie ou en petit arbre à plusieurs troncs. Sensible au gel : c'est une plante du centre et du sud de la Floride. Écorce cannelle qui s'exfolie et feuillage parfumé.",
    givesNote:
      "Des fleurs blanches parfumées pour les pollinisateurs et des baies rouge-orangé qu'adorent les moqueurs, les moqueurs chats et d'autres passereaux, sur un beau persistant qui donne de la structure toute l'année.",
    propagationNote:
      "Cueillez les fruits rouge-orangé mûrs, débarrassez la graine de sa pulpe, et semez-la fraîche et au chaud — elle ne se conserve pas, ne la laissez donc pas sécher. Les boutures aoûtées prises pendant la saison chaude s'enracinent aussi.",
    supportNotes: {
      "berry-songbirds":
        "Les baies orange-rouge de la Myrcianthes fragrans sont l'une des préférées des moqueurs et des autres frugivores.",
    },
  },

  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — vivaces, graminées, grimpantes, couvre-sols.
  // -------------------------------------------------------------------------
  "Salvia coccinea": {
    nativeNote:
      "Fleur sauvage indigène des lisières de hammock et des sols remaniés de Floride ; elle fleurit presque toute l'année.",
    careNote:
      "Facile, résistante à la sécheresse et se ressemant seule — une vivace de courte vie qui s'entretient par la graine : laissez-en donc quelques-unes monter. Rabattez les pieds dégarnis pour les faire repartir. Du soleil à l'ombre légère.",
    givesNote:
      "Ses fleurs rouges, presque toute l'année, nourrissent les colibris et les papillons et comptent parmi les préférées des bourdons ; une valeur sûre en nectar, sans souci.",
    propagationNote:
      "L'une des fleurs sauvages les plus simples à cultiver — répandez la graine sur une terre chaude et elle lève sans peine, puis se ressème dans tout le jardin dès qu'elle se plaît. Une pousse tendre coupée et plantée en terre s'enracine aussi en un rien de temps.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses fleurs tubulaires écarlates fleurissent presque toute l'année en Floride — une ressource sûre pour les colibris.",
    },
  },
  "Coreopsis leavenworthii": {
    nativeNote:
      "Un coréopsis quasi endémique de Floride, des flatwoods frais, des fossés et des bords de route ; les Coreopsis sont la fleur emblème de l'État.",
    careNote:
      "Une vivace de courte vie qu'il vaut mieux traiter comme une fleur sauvage qui se ressème — laissez-la grener et elle continuera dans un emplacement ensoleillé, frais à moyen. Idéale pour une prairie ou une plantation de fossé.",
    givesNote:
      "De gaies marguerites jaunes sur une longue saison nourrissent les petites abeilles indigènes, les syrphes et les papillons, puis les fringilles prennent la graine. La fleur sauvage floridienne par excellence.",
    propagationNote:
      "Cultivez-la de semis — elle vit peu, laissez-la donc se ressemer pour la garder d'année en année. Pressez la graine fine à la surface du sol sans l'enterrer, puisqu'il lui faut de la lumière pour lever, et tenez-la au chaud et à l'humide.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Le groupe de la fleur emblème de la Floride — son pollen nourrit les abeilles spécialistes des astéracées.",
      "american-goldfinch":
        "Les chardonnerets jaunes hivernants prennent ses petites graines.",
    },
  },
  "Liatris gracilis": {
    nativeNote:
      "Un liatris indigène des collines sableuses, des flatwoods et des bords de route secs de Floride.",
    careNote:
      "Il adore le plein soleil et une terre sèche et sableuse, et ne demande aucune eau une fois installé — parfait pour un emplacement chaud et pauvre. Ses baguettes pourpres s'ouvrent du haut vers le bas à l'automne.",
    givesNote:
      "L'une des meilleures plantes à nectar d'automne de Floride : ses épis pourpres sont couverts de papillons (dont les monarques en migration) et d'abeilles indigènes, et les fringilles prennent la graine.",
    propagationNote:
      "Cultivez-le de semis à l'automne, ou donnez à la graine quelques semaines de froid humide au réfrigérateur avant de semer — cette avance améliore la levée. Les pieds installés font de petits cormes souterrains qu'on peut soulever et séparer en fin d'hiver.",
    supportNotes: {
      monarch:
        "Les épis pourpres de liatris sont un nectar d'automne de premier ordre pour les monarques en migration.",
      "sunflower-specialist-bees":
        "Une floraison d'astéracée qui fait vivre les abeilles spécialistes.",
    },
  },
  "Monarda punctata": {
    nativeNote:
      "Une monarde indigène des collines sableuses, des dunes et des terrains secs remaniés de Floride.",
    careNote:
      "Elle prospère sur un terrain chaud, sec et sableux en plein soleil. Vivace de courte vie qui se ressème pour persister ; donnez-lui une bonne circulation d'air. Ce sont ses bractées roses étagées qui font le spectacle, pas les petites fleurs.",
    givesNote:
      "Une plante à pollinisateurs exceptionnelle — ses fleurs mouchetées inhabituelles et ses bractées roses attirent une grande diversité d'abeilles indigènes, de guêpes et de papillons sur un sol pauvre et sec où presque rien d'autre ne fleurit.",
    propagationNote:
      "Facile de semis — pressez la graine minuscule sur une terre chaude sans la couvrir, puisqu'il lui faut de la lumière, et elle se ressèmera pour revenir. Vous pouvez aussi diviser une touffe installée au printemps pour en faire plus.",
    supportNotes: {
      "bumble-bees":
        "La monarde ponctuée est l'une des toutes meilleures plantes à nectar pour les abeilles et les guêpes du Sud-Est américain.",
    },
  },
  "Muhlenbergia capillaris": {
    nativeNote:
      "Graminée indigène en touffe des flatwoods, des prairies et des stations littorales de Floride, célèbre pour sa brume rose d'automne.",
    careNote:
      "Robuste, résistante au sel et à la sécheresse, et au mieux en plein soleil sur un sol bien drainé — elle ne demande ni eau, ni tonte, ni engrais une fois installée. Rabattez-la une fois en fin d'hiver.",
    givesNote:
      "Des nuages aériens de panicules roses à l'automne, des graines et un couvert pour les petits oiseaux, et des racines denses qui tiennent un sol sableux ou en train de s'éroder ; elle abrite les abeilles nichant au sol et héberge des hespéries.",
    propagationNote:
      "Une graminée de saison chaude — semez la graine sur une terre chaude au printemps ou en été et elle lève sans aucun froid. Le moyen le plus rapide d'en avoir plus est de déterrer une touffe installée au printemps et de la séparer en éclats enracinés.",
  },
  "Tripsacum dactyloides": {
    supportNotes: {
      "grass-skippers":
        "Le tripsaque élève l'hespérie byssus — une grande hespérie orange dont la chenille vit dans un tube de limbe fermé par de la soie.",
      "bumble-bees":
        "Les graminées nourrissent rarement les abeilles, mais les grosses anthères pendantes du tripsaque sont travaillées par les bourdons pour leur pollen.",
    },
    nativeNote:
      "Grande graminée indigène en touffe des bords de marais, des fossés et des prairies humides de Floride.",
    careNote:
      "Une grosse touffe arquée et quasi persistante qui accepte le soleil ou la mi-ombre et un sol humide ou moyen — excellente au bord d'un étang, d'un fossé ou dans un jardin de pluie. Donnez-lui de la place ; rabattez-la en fin d'hiver.",
    givesNote:
      "Une robuste plante de couverture et d'anti-érosion : elle cuirasse les bords humides qui s'érodent, abrite et nourrit les oiseaux et la petite faune, et héberge des hespéries.",
    propagationNote:
      "Encore une graminée de saison chaude — semez la grosse graine sur une terre chaude au printemps et elle germe sans froid. Comme elle fait de très grosses touffes, diviser un pied installé au printemps est la voie rapide et fiable pour en avoir plus.",
  },
  "Passiflora incarnata": {
    nativeNote:
      "Liane indigène grimpante et rampante des champs, des bords de clôture et des sols remaniés de Floride.",
    careNote:
      "Vigoureuse et rapide — donnez-lui une clôture, un treillage ou de la place où courir, et attendez-vous à ce qu'elle file et drageonne depuis les racines (supprimez les rejets). Elle disparaît en hiver au nord de l'État et repart. Robuste et résistante à la sécheresse.",
    givesNote:
      "La plante nourricière de l'Agraulis vanillae et de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia ; ses fleurs pourpres extraordinaires nourrissent les xylocopes et les bourdons, et son fruit, le « maypop », nourrit la faune.",
    propagationNote:
      "La graine dure lève bien mieux si vous entaillez ou grattez le tégument et la faites tremper une nuit avant de semer au chaud. Plus simple encore : cette liane court sous terre et fait surgir de nouveaux rejets enracinés à côté — déterrez-en un et déplacez-le. Les boutures tendres prennent aussi pendant les mois chauds.",
    supportNotes: {
      "gulf-fritillary":
        "La passiflore est la plante nourricière de l'Agraulis vanillae.",
      "zebra-longwing":
        "La liane hôte du papillon emblème de la Floride, l'Heliconius charithonia.",
    },
  },
  "Mimosa strigillosa": {
    supportNotes: {
      "bumble-bees":
        "Les houppes roses de la mimosa rampante restent à plat dans une pelouse où l'on marche, et les bourdons les travaillent tout l'été entre deux tontes.",
      "grass-skippers":
        "Hespéries fauves et petites piérides jaunes y descendent sans arrêt — c'est l'une des rares plantes à nectar qui survit au piétinement.",
    },
    nativeNote:
      "Couvre-sol indigène bas des bords de route, des champs et des terrains ouverts de Floride — une alternative indigène au gazon.",
    careNote:
      "Un tapis vivant robuste, rapide et résistant à la sécheresse pour le plein soleil, qui supporte un piétinement léger et ne demande presque aucune tonte — un excellent remplacement de pelouse. Il s'étend vigoureusement par stolons : donnez-lui de la place ou une bordure. Ses feuilles se replient quand on les touche.",
    givesNote:
      "Il fixe son propre azote, retient le sol contre l'érosion, et se couvre de fleurs roses en pompons qui nourrissent les abeilles et hébergent les petites coliades et les hespéries — une pelouse vraiment utile à la faune.",
    propagationNote:
      "Étant une légumineuse, sa graine a un tégument dur — entaillez-la ou grattez-la et faites-la tremper une nuit avant de semer au chaud, elle lèvera bien mieux. Plus simple encore : ce tapis s'étend par des stolons qui s'enracinent en chemin, vous pouvez donc soulever et mettre en pot les morceaux enracinés.",
  },
  "Helianthus debilis": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses de Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés, secs : il lui faut le plein soleil et un sol parfaitement drainé, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le faire repartir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les fringilles, et son tapis rampant tient la dune et les sols sableux contre l'érosion ; il héberge la belle-dame et d'autres chenilles.",
    propagationNote:
      "Enfantin de semis — pressez la graine sur une terre chaude et sableuse sans l'enterrer, puisqu'il lui faut de la lumière, et elle se ressèmera librement ensuite. Les boutures de pousses tendres s'enracinent aussi vite si vous voulez un tapis tout de suite.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Un vrai tournesol — une source de pollen clé de voûte pour les abeilles spécialistes des astéracées.",
      "gopher-tortoise":
        "Une plante basse des terrains ouverts et sableux que les tortues gaufrées broutent et où elles creusent.",
    },
  },

  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — le deuxième lot, choisi parmi les plantes
  // que l'Audubon et le Wildflower Center recommandent tous deux.
  // -------------------------------------------------------------------------
  "Diospyros virginiana": {
    nativeNote:
      "Indigène dans toute la Floride, dans les friches, les collines sableuses et les lisières de hammock.",
    careNote:
      "Robuste en sol sableux et pauvre, et insensible à la sécheresse une fois enraciné. Les arbres sont mâles ou femelles et seules les femelles fructifient : plantez-en plusieurs. Laissé libre, il drageonne en petit bosquet.",
    givesNote:
      "Ses fruits orange s'adoucissent après les premières nuits fraîches et nourrissent renards, ratons laveurs, opossums et oiseaux. Ses feuilles élèvent le papillon lune et des dizaines d'autres chenilles.",
    propagationNote:
      "Pressez les graines de fruits bien mous, lavez la pulpe et semez dehors à l'automne : l'hiver fera le froid. Il descend vite une longue racine pivotante, alors prenez un pot profond ou semez-le à sa place définitive. Un drageon enraciné prélevé près d'un arbre femelle la reproduit, fruits compris.",
    supportNotes: {
      "luna-moth":
        "Dans le Sud profond, le plaqueminier est l'un des principaux arbres du papillon lune, qui s'y sert davantage du plaqueminier et du copalme que des bouleaux qu'il prend plus au nord.",
      "acorn-mammals":
        "Les plaquemines mûres tombent à la fin de l'automne et sont emportées par les renards, ratons laveurs, opossums, cerfs et ours noirs.",
    },
  },
  "Celtis laevigata": {
    nativeNote:
      "Le micocoulier des plaines inondables et des hammocks de Floride, indigène dans presque tout l'État.",
    careNote:
      "Rapide, robuste et peu exigeant — sec ou humide, acide ou calcaire, en ville ou au marais. Donnez-lui de la place : il devient un grand arbre d'ombre à l'écorce grise, lisse et verruqueuse.",
    givesNote:
      "Ses baies sucrées rouge orangé restent sur l'arbre jusqu'en hiver pour les moqueurs, les merles et les jaseurs. Ses feuilles élèvent trois papillons qui ne vivent que sur les micocouliers.",
    propagationNote:
      "Cueillez les baies à l'automne, faites-les tremper et frottez la mince chair, puis semez dehors : l'hiver fera le froid. Les semis lèvent au printemps et poussent vite.",
    supportNotes: {
      "berry-songbirds":
        "Les petites baies sucrées tiennent jusqu'en hiver, quand moqueurs, merles et pics viennent les chercher.",
      "cedar-waxwing":
        "Les bandes de jaseurs en hivernage dépouillent le micocoulier comme les houx et les genévriers.",
    },
  },
  "Magnolia virginiana": {
    nativeNote:
      "Indigène des flatwoods humides, des baies boisées et des bords de marécage dans toute la Floride.",
    careNote:
      "Fait pour un coin humide et acide où la plupart des arbres dépérissent : il supporte les pieds dans l'eau et la mi-ombre. Presque persistant ici, ses feuilles montrent leur revers argenté au vent.",
    givesNote:
      "Des fleurs blanches au parfum citronné tout le printemps, et des graines rouges pour les oiseaux à l'automne. Ses feuilles élèvent le grand porte-queue tigré et un bombyx qui porte son nom.",
    propagationNote:
      "Récoltez les cônes quand ils s'ouvrent à l'automne, frottez l'enveloppe rouge des graines et ne les laissez jamais sécher. Semez dehors, ou gardez-les trois mois au frais et humides au réfrigérateur. Une branche basse fixée au sol humide s'enracine d'elle-même.",
    supportNotes: {
      "eastern-tiger-swallowtail":
        "Le magnolia de Virginie est l'un des arbres du grand porte-queue tigré, et en Floride l'un des plus utilisés.",
    },
  },
  "Vaccinium arboreum": {
    nativeNote:
      "Un petit arbre indigène des collines sableuses, du scrub et des bois secs de Floride.",
    careNote:
      "Il demande un sol sableux, acide et drainé, et rien d'autre — l'un des rares arbres heureux dans le scrub sec. Lent à démarrer, il déteste être déplacé : plantez-le petit. L'écorce s'exfolie en rouge cannelle avec l'âge.",
    givesNote:
      "Des nuées de clochettes blanches pour les abeilles indigènes au printemps, et des baies noires pour les oiseaux jusqu'en hiver. Comme tous les myrtilliers, il nourrit un très grand nombre de chenilles.",
    propagationNote:
      "Écrasez des baies mûres, rincez les minuscules graines et semez-les en surface sur un terreau acide et humide. La germination est lente et irrégulière : semez large. Les boutures tendres de printemps s'enracinent avec de la patience.",
    supportNotes: {
      "mason-bees":
        "Les abeilles indigènes butinent les petites clochettes blanches au printemps, dont des spécialistes des myrtilliers.",
      "berry-songbirds":
        "Les baies noires mûrissent à l'automne et tiennent jusqu'en hiver pour les grives, les moqueurs et les merlebleus.",
    },
  },
  "Juniperus virginiana": {
    nativeNote:
      "La forme côtière du genévrier de Virginie, indigène sur les côtes, les falaises fluviales et le calcaire de Floride.",
    careNote:
      "Insensible au sel, au vent et à la sécheresse une fois installé : un bon écran persistant près de la côte. Il lui faut le plein soleil ; à l'ombre, il se dégarnit.",
    givesNote:
      "Un couvert persistant et dense où les oiseaux nichent et dorment, et des cônes bleus en forme de baie que les jaseurs dépouillent en hiver. C'est la seule nourriture des chenilles du porte-queue des genévriers.",
    propagationNote:
      "La graine est lente : il lui faut une période chaude puis un hiver, et elle met souvent un an et demi à lever. Les boutures de pointes prises en hiver s'enracinent plus sûrement. Seuls les arbres femelles portent les cônes bleus.",
    supportNotes: {
      "juniper-hairstreak":
        "En Floride, le porte-queue des genévriers élève ses chenilles sur le genévrier de Virginie et sur rien d'autre.",
      "cedar-waxwing":
        "Le jaseur d'Amérique, « cedar waxwing » en anglais, tient son nom de cet arbre : les bandes en dépouillent les cônes bleus en hiver.",
      "yellow-rumped-warbler":
        "Les parulines à croupion jaune en hivernage prennent ses cônes avec les baies du myrique cirier.",
    },
  },
  "Morella cerifera": {
    nativeNote:
      "Indigène dans chaque comté de Floride, des flatwoods humides aux dunes.",
    careNote:
      "Rapide et presque impossible à tuer — soleil ou ombre, sec ou humide, sel et sable. L'écran indigène le plus rapide qui soit. Il drageonne : laissez-lui de la place ou arrachez les rejets. Seuls les pieds femelles portent des baies.",
    givesNote:
      "Des baies bleues cireuses dont vivent tout l'hiver les parulines à croupion jaune et les hirondelles bicolores, et un couvert dense pour les oiseaux nicheurs.",
    propagationNote:
      "Frottez la cire de la graine et semez-la au chaud. Il s'enracine aussi par boutures semi-aoûtées, et les drageons enracinés au pied se déterrent et se replantent.",
    supportNotes: {
      "yellow-rumped-warbler":
        "La paruline à croupion jaune digère la cire de ces baies, ce que peu d'oiseaux savent faire, et c'est ce qui la porte à travers l'hiver floridien.",
      "berry-songbirds":
        "Les hirondelles bicolores, les merlebleus et les moqueurs chats prennent aussi les baies cireuses.",
    },
  },
  "Erythrina herbacea": {
    nativeNote:
      "Indigène dans les hammocks, les collines sableuses et les bois côtiers de toute la Floride.",
    careNote:
      "Un gel sévère le rabat au sol et il repart de sa grosse racine. Ses tiges sont piquantes et ses graines rouges toxiques : tenez-le loin des jeux des jeunes enfants.",
    givesNote:
      "Des épis de fleurs tubulaires écarlates au printemps, au moment où les colibris remontent vers le nord.",
    propagationNote:
      "L'enveloppe de la graine est dure : entaillez-la à la lime ou faites tremper les graines une nuit dans l'eau chaude, puis semez au chaud. Portez des gants, les graines sont toxiques. Les boutures de tiges sans feuilles prises en hiver s'enracinent aussi.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "L'Erythrina herbacea fleurit au printemps quand les colibris à gorge rubis remontent, et ses longs tubes rouges sont faits pour leur bec.",
    },
  },
  "Rhus copallinum": {
    nativeNote:
      "Indigène des collines sableuses, des friches et des flatwoods à pins de toute la Floride.",
    careNote:
      "Il drageonne en colonie — parfait pour tenir un talus sec, pas pour un massif soigné. Il rougit à l'automne, chose rare si loin au sud. Ce n'est pas le sumac à vernis, une plante des marais aux baies blanches.",
    givesNote:
      "Ses fleurs d'été bourdonnent d'abeilles et de guêpes. Ses grappes de fruits rouges tiennent tout l'hiver pour les merlebleus, les moqueurs et les colins quand il ne reste presque rien d'autre.",
    propagationNote:
      "Le plus simple : des tronçons de racine gros comme un crayon, prélevés en fin d'hiver et couchés dans un sol humide. La graine a une enveloppe dure : versez de l'eau chaude dessus et laissez-la tremper avant de semer.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits du sumac sont un recours d'hiver pour les merlebleus, les moqueurs et les grives quand les baies plus riches sont finies.",
      "mason-bees":
        "Ses petites fleurs d'été sont butinées par de nombreuses abeilles et guêpes indigènes.",
    },
  },
  "Helianthus angustifolius": {
    nativeNote:
      "Indigène des flatwoods humides, des fossés et des bords de marais dans toute la Floride.",
    careNote:
      "Il s'étend en grande touffe en sol frais. Rabattez-le de moitié au début de l'été pour qu'il tienne debout à l'automne au lieu de verser. Il survit aux périodes sèches mais il est plus beau au frais.",
    givesNote:
      "Un mur jaune en octobre et en novembre, quand les abeilles et les papillons migrateurs ont le plus besoin de carburant. Des abeilles spécialistes des tournesols dépendent de son pollen, et les oiseaux prennent ses graines.",
    propagationNote:
      "Déterrez et divisez la touffe en fin d'hiver, ou bouturez des pointes tendres au printemps. La graine marche aussi, semée dehors à l'automne.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Un vrai tournesol, et tardif — une source de pollen pour les abeilles spécialistes en fin de saison.",
      monarch:
        "Sa floraison d'octobre nourrit les monarques qui descendent vers le sud à travers la Floride.",
    },
  },
  "Gelsemium sempervirens": {
    nativeNote:
      "Indigène dans les bois, les hammocks et les haies du nord et du centre de la Floride.",
    careNote:
      "Persistant et facile sur une clôture, un treillage ou une boîte aux lettres. Il grimpe en s'enroulant et n'abîme donc pas un mur. Toute la plante est toxique : évitez-la là où des enfants ou des animaux mâchonnent les plantes.",
    givesNote:
      "Des trompettes jaunes parfumées en janvier et février, la première grande floraison de l'année pour les abeilles indigènes précoces.",
    propagationNote:
      "Bouturez en été des pousses de l'année quand elles se raffermissent. Plus simple encore : fixez une longue tige au sol et sevrez-la une fois enracinée.",
    supportNotes: {
      "mason-bees":
        "L'une des premières fleurs de l'année, butinée par les abeilles indigènes précoces.",
    },
  },
  "Bignonia capreolata": {
    nativeNote:
      "Indigène dans les hammocks et les bois de plaine inondable du nord et du centre de la Floride.",
    careNote:
      "Elle grimpe par des vrilles à ventouses et escalade un mur ou un tronc sans aide. Vigoureuse : donnez-lui un grand support. Persistante, elle vire au pourpre par temps froid.",
    givesNote:
      "Des trompettes rouge orangé au début du printemps, juste à l'arrivée des colibris à gorge rubis.",
    propagationNote:
      "Les boutures semi-aoûtées d'été s'enracinent bien, et les tiges fixées au sol s'enracinent là où elles le touchent. Les graines plates et ailées se sèment facilement au printemps, sans traitement.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses trompettes rouge orangé s'ouvrent à l'arrivée des premiers colibris à gorge rubis au printemps.",
    },
  },

  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — le troisième lot : les premières fougères,
  // et les graminées et grimpantes qui manquaient. Indigènes selon l'Atlas of
  // Florida Plants et décrites par la FNPS.
  // -------------------------------------------------------------------------
  "Aristida stricta": {
    nativeNote:
      "La graminée en touffes qui tapisse les flatwoods à pin des marais — ces pinèdes plates du bas pays — et les collines sableuses de Floride, entretenues par le feu.",
    careNote:
      "Plantez des mottes en plein soleil sur sable sec et arrosez-les tout le premier été ; ensuite, elle ne demande rien. Lente à s'étoffer, et difficile à trouver en vente.",
    givesNote:
      "De fines touffes vertes qui rendent au sol sous les pins l'allure des flatwoods, et un couvert pour les oiseaux qui nichent au sol, comme le bruant des pinèdes.",
    propagationNote:
      "On la cultive à partir de mottes, car ses graines sauvages ne sont bonnes qu'après un feu en pleine saison de croissance. Divisez une touffe installée au printemps si vous en avez une.",
  },
  "Eragrostis spectabilis": {
    nativeNote:
      "Indigène sur les sols sableux et secs, les bords de route et les pinèdes ouvertes du nord et du centre de la Floride.",
    careNote:
      "Plein soleil et sol pauvre et sec lui conviennent le mieux ; un sol riche ou l'ombre la font s'affaisser. Rabattez-la en fin d'hiver. Elle se ressème un peu, jamais loin.",
    givesNote:
      "Un nuage bas d'épillets pourpre rougeâtre en fin d'été, puis des graines pour les bruants et d'autres petits oiseaux.",
    propagationNote:
      "Éparpillez les graines sur un sol nu au printemps et tassez-les. Les touffes se divisent facilement au printemps.",
  },
  "Sorghastrum secundum": {
    nativeNote:
      "Indigène dans les collines sableuses, les flatwoods et les prairies sèches du nord et du centre de la Floride, où elle fleurit après le feu.",
    careNote:
      "Plein soleil sur sable bien drainé. Les feuilles restent basses ; les tiges florales jaillissent à l'automne. Rabattez en fin d'hiver.",
    givesNote:
      "De hauts plumets bronze doré à l'automne, chaque épillet penché du même côté, et des graines pour les oiseaux jusqu'en hiver.",
    propagationNote:
      "Semez sur sol nu au printemps, ou divisez une touffe au printemps.",
  },
  "Juncus effusus": {
    nativeNote:
      "Indigène dans les marais, les fossés et au bord des mares dans toute la Floride.",
    careNote:
      "Il veut les pieds dans l'eau : un jardin de pluie, une berge de mare, un creux détrempé. Persistant, il n'a jamais besoin d'être taillé.",
    givesNote:
      "Des tiges vertes serrées qui absorbent le ruissellement et tiennent les berges boueuses, avec un abri pour les grenouilles et les oiseaux nicheurs.",
    propagationNote:
      "Tranchez une touffe en morceaux au printemps. Ses graines, fines comme de la poussière, ont besoin de lumière : pressez-les sur un sol mouillé et gardez-le mouillé.",
  },
  "Wisteria frutescens": {
    nativeNote:
      "Indigène le long des rivières, en bordure des marécages et dans les bois humides du nord et du centre de la Floride.",
    careNote:
      "Donnez-lui une clôture ou une tonnelle solide au soleil. Bien plus sage que les glycines asiatiques : elle fleurit jeune, après la feuillaison, et n'étouffe pas les arbres. Ses graines sont toxiques.",
    givesNote:
      "Des grappes lavande au printemps pour les bourdons et les xylocopes, et des feuilles pour les chenilles de deux hespéries américaines.",
    propagationNote:
      "Fixez une tige basse au sol et elle s'enracine en une saison. Les boutures herbacées s'enracinent au début de l'été. Les semis peuvent mettre des années à fleurir.",
    supportNotes: {
      "silver-spotted-skipper":
        "L'une des légumineuses que mangent ses chenilles, qui replient une foliole en abri pour s'y nourrir.",
    },
  },
  "Campsis radicans": {
    nativeNote:
      "Indigène dans les bois, les haies et les plaines inondables du nord et du centre de la Floride.",
    careNote:
      "Il lui faut un poteau ou un mur solide, et de la place : elle grimpe par des racines-crampons et drageonne à plusieurs mètres. Arrachez les drageons dès qu'ils paraissent. Portez des gants ; la sève irrite certaines peaux.",
    givesNote:
      "De grandes trompettes orange tout l'été, faites pour les colibris à gorge rubis, qui les visitent plus que presque toute autre fleur.",
    propagationNote:
      "Déterrez un drageon enraciné au printemps ; elle en a beaucoup. Les graines ailées germent aussi facilement.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "De longues trompettes orange ouvertes tout l'été, taillées pour le bec d'un colibri.",
    },
  },
  "Osmundastrum cinnamomeum": {
    nativeNote:
      "Indigène dans les marécages, les flatwoods humides et les berges suintantes du nord et du centre de la Floride.",
    careNote:
      "De l'ombre et un sol qui ne sèche jamais : un coin humide, un bord de mare, un creux sous les arbres. Elle reste en touffe nette et ne s'étale pas.",
    givesNote:
      "De grandes frondes en vase, avec des tiges sporifères couleur cannelle au printemps, et un abri pour les grenouilles et les salamandres. Les colibris tapissent leur nid de son duvet.",
    propagationNote:
      "Coupez une vieille souche en fin d'hiver, en gardant des racines sur chaque morceau. Ses spores vertes meurent en quelques jours : semez-les fraîches sur un terreau humide, sous couvercle.",
  },
  "Thelypteris kunthii": {
    nativeNote:
      "Indigène dans les hammocks — ces îlots de forêt dense et humide —, sur les berges des ruisseaux et dans les bois frais du nord et du centre de la Floride.",
    careNote:
      "La fougère la plus facile de Floride : de l'ombre, une terre de jardin ordinaire, et à boire par temps sec. Elle s'étend par ses rhizomes en une large nappe souple.",
    givesNote:
      "Des frondes vert pâle qui couvrent le sol à l'ombre, là où le gazon refuse de pousser, et un abri pour les lézards, les crapauds et les carabes.",
    propagationNote:
      "Arrachez et divisez une nappe au printemps ; chaque morceau avec des racines reprend. Elle lève aussi toute seule de ses spores, à l'ombre humide.",
  },
  "Woodwardia areolata": {
    nativeNote:
      "Indigène dans les marécages, les tourbières et les bois humides et acides du nord et du centre de la Floride.",
    careNote:
      "Ombre profonde et sol acide qui reste mouillé. Elle disparaît l'hiver et s'étend lentement par ses rhizomes en un tapis bas et lustré.",
    givesNote:
      "Des frondes brillantes pour le coin le plus mouillé et le plus ombragé du jardin, avec un abri pour les grenouilles et les petites bêtes dont elles se nourrissent.",
    propagationNote:
      "Coupez un tronçon de rhizome portant quelques frondes et replantez-le en sol mouillé.",
  },
  "Telmatoblechnum serrulatum": {
    nativeNote:
      "Indigène dans les marécages, les prairies humides et les fossés du centre de la Floride et plus au sud.",
    careNote:
      "Elle supporte plus de soleil que la plupart des fougères si ses racines restent mouillées : un jardin de pluie, un fossé, une berge de mare. Elle s'étend par stolons en un massif.",
    givesNote:
      "Des frondes dressées et dentées qui tiennent le sol mouillé et filtrent le ruissellement, avec un abri pour les grenouilles. Les jeunes frondes s'ouvrent rose bronze.",
    propagationNote:
      "Déterrez au printemps un morceau de stolon avec frondes et racines, et plantez-le en sol mouillé.",
  },

  "Quercus geminata": {
    nativeNote:
      "Indigène dans le scrub, les dunes et les crêtes de sable sec de Floride.",
    careNote:
      "Le chêne de Virginie des sables profonds et secs, là où son grand cousin peine. Plein soleil, aucun arrosage une fois enraciné, et il tient au vent sur la côte. Il reste un petit arbre ou un fourré dense.",
    givesNote:
      "Des glands pour le geai à gorge blanche de Floride, les dindons sauvages et les écureuils, et les centaines de chenilles que nourrit tout chêne.",
    propagationNote:
      "Semez les glands frais à l'automne, là où l'arbre restera. Gardez ceux qui coulent dans l'eau, et ne les laissez jamais sécher.",
    supportNotes: {
      "acorn-birds":
        "Ce chêne est l'un de ceux dont vit le geai à gorge blanche de Floride : il enterre des milliers de glands chaque automne et plante ainsi le fourré suivant.",
      "acorn-mammals":
        "Cerfs, ratons laveurs et écureuils ramassent les glands tombés dans le sable.",
    },
  },
  "Quercus laevis": {
    nativeNote:
      "Le chêne des collines sableuses à pin des marais, indigène du Panhandle jusqu'au centre de la Floride.",
    careNote:
      "Pour le sable le plus sec et le plus pauvre, en plein soleil. L'été, ses feuilles se tournent de profil face au soleil ; à l'automne, elles rougissent. Il accompagne naturellement le pin des marais.",
    givesNote:
      "Des glands pour les dindons sauvages, les cerfs, les geais et les écureuils fauves, des cavités pour les pics, et des chenilles par centaines.",
    propagationNote:
      "Ramassez les glands à l'automne, gardez ceux qui coulent, et semez-les aussitôt dehors pour que l'hiver leur donne le froid.",
    supportNotes: {
      "acorn-birds":
        "Dindons sauvages et geais se nourrissent de ses glands sous les pins des marais.",
      "acorn-mammals":
        "Un aliment de base pour l'écureuil fauve des collines sableuses et pour les cerfs à l'automne.",
    },
  },
  "Pinus elliottii": {
    nativeNote:
      "Le pin des flatwoods de Floride — ces pinèdes plates au sol sableux et humide — indigène dans tout l'État.",
    careNote:
      "Rapide et robuste : il accepte le sol mouillé des flatwoods qui noie le pin des marais, et le sable sec aussi. Plein soleil. Plantez-le loin de la maison, car il monte haut.",
    givesNote:
      "Des graines pour les sittelles, les pics et les écureuils, des sites de nid pour les buses, et de quoi nourrir des centaines de chenilles.",
    propagationNote:
      "Cueillez les cônes quand ils passent du vert au brun au début de l'automne et laissez-les s'ouvrir au chaud et au sec. Semez la graine fraîche, à peine couverte.",
    supportNotes: {
      "brown-headed-nuthatch":
        "La sittelle à tête brune fouille son écorce en quête d'insectes et niche dans ses chicots morts.",
    },
  },
  "Liquidambar styraciflua": {
    nativeNote:
      "Indigène dans les bois frais et les plaines inondables, du Panhandle jusqu'au centre de la Floride.",
    careNote:
      "Rapide, et l'un des rares arbres d'ici aux vraies couleurs d'automne. Ses boules de graines épineuses tombent tout l'hiver : tenez-le loin d'une allée ou d'une terrasse. Arrosez-le pendant son premier été.",
    givesNote:
      "Le papillon lune y élève ses chenilles, et chardonnerets et mésanges picorent en hiver les graines de ses boules épineuses.",
    propagationNote:
      "Cueillez les boules vert-brun à l'automne avant qu'elles s'ouvrent, faites-les sécher à l'intérieur et secouez-en la graine. Un mois au réfrigérateur dans du sable humide accélère la levée.",
    supportNotes: {
      "luna-moth":
        "Le copalme est l'un des principaux arbres à chenilles du papillon lune dans le Sud profond.",
      "american-goldfinch":
        "Les chardonnerets en hivernage tirent les minuscules graines des boules épineuses.",
    },
  },
  "Sambucus canadensis": {
    nativeNote:
      "Indigène dans les fossés humides, les bords de marécage et les clairières de toute la Floride.",
    careNote:
      "Il pousse vite dans tout coin frais et ensoleillé et drageonne en fourré. Rabattez les vieilles tiges au sol en hiver pour le contenir. Feuilles, tiges et baies crues sont toxiques.",
    givesNote:
      "De larges ombelles blanches pour les abeilles et les mouches, puis des baies noir pourpré que des dizaines d'oiseaux dévorent en quelques jours.",
    propagationNote:
      "Enfoncez en hiver dans un sol humide des tiges grosses comme un crayon, deux bourgeons sous terre : la plupart s'enracinent. Les rejets enracinés prélevés au bord d'une touffe vont plus vite encore.",
    supportNotes: {
      "berry-songbirds":
        "Moqueurs, moqueurs chats, cardinaux et merlebleus vident les grappes à mesure qu'elles mûrissent.",
      "cedar-waxwing":
        "Une bande de jaseurs s'abat et vide un arbuste en une après-midi.",
    },
  },
  "Baccharis halimifolia": {
    nativeNote:
      "Indigène dans toute la Floride, au bord des marais, dans les fossés et les friches, y compris en sol salé près de la côte.",
    careNote:
      "Il supporte les embruns, les inondations et la sécheresse. Fleurs mâles et femelles sont sur des pieds séparés ; les femelles se couvrent à l'automne de graines duveteuses blanc argenté et se ressèment volontiers. Toxique pour le bétail.",
    givesNote:
      "L'une des dernières grandes sources de nectar de l'année, visitée par les monarques en migration, les guêpes et les abeilles, et un abri pour les oiseaux au bord d'un marais salé.",
    propagationNote:
      "Posez les graines duveteuses sur un sol humide à la fin de l'automne, sans les couvrir. Les boutures tendres d'été s'enracinent facilement.",
    supportNotes: {
      monarch:
        "Il fleurit à l'automne, au moment où les monarques traversent la Floride vers le sud.",
      "gulf-fritillary":
        "L'Agraulis vanillae butine ses fleurs tardives quand la saison des passiflores s'achève.",
    },
  },
  "Vaccinium myrsinites": {
    nativeNote:
      "Un myrtillier bas et persistant des flatwoods, des collines sableuses et du scrub de Floride.",
    careNote:
      "Un arbuste couvre-sol à hauteur de genou pour un sable acide, au soleil ou sous l'ombre légère des pins. Il s'étend lentement par tiges souterraines. N'ajoutez ni chaux ni terre riche.",
    givesNote:
      "Des clochettes d'hiver pour les premières abeilles, puis de petites baies bleues pour les oiseaux, les tortues-boîtes et les tortues gaufrées. Comme tout myrtillier, il nourrit un très grand nombre de chenilles.",
    propagationNote:
      "Prélevez en hiver un morceau enraciné au bord d'une plaque et replantez-le aussitôt. Les graines de baies écrasées lèvent lentement sur un terreau acide humide.",
    supportNotes: {
      "gopher-tortoise":
        "Les tortues gaufrées mangent les baies basses dans les collines sableuses et les flatwoods qu'elles partagent avec lui.",
      "berry-songbirds":
        "Moqueurs, moqueurs roux et tohis prennent les petites baies au printemps.",
    },
  },
  "Lyonia lucida": {
    nativeNote:
      "Indigène dans les flatwoods humides, les marécages à magnolias et les bords d'étang de Floride.",
    careNote:
      "Il veut un sol acide qui reste frais, au soleil ou à mi-ombre. Des feuilles persistantes et luisantes toute l'année. Toutes ses parties sont toxiques si on les avale.",
    givesNote:
      "Des grappes de clochettes roses en fin d'hiver et au printemps, parmi les premières fleurs pour les bourdons dans les flatwoods, et un couvert persistant dense.",
    propagationNote:
      "Enracinez des pousses d'été raffermies dans un terreau acide humide. La graine est fine comme de la poussière : répandez-la en surface et gardez-la humide.",
    supportNotes: {
      "bumble-bees":
        "Ses clochettes s'ouvrent en fin d'hiver, quand les reines de bourdon ont besoin de nourriture et que presque rien d'autre ne fleurit.",
    },
  },
  "Eriogonum tomentosum": {
    nativeNote:
      "Indigène dans les collines sableuses et les pinèdes sèches du nord et du centre de la Floride.",
    careNote:
      "Il lui faut un sable profond et sec en plein soleil ; une terre riche ou humide le fait pourrir. Une rosette plate de feuilles duveteuses lance des tiges ramifiées à la fin de l'été. Il déteste être déplacé.",
    givesNote:
      "Des têtes fleuries de fin d'été qui grouillent de guêpes, d'abeilles et de petits papillons, à un moment où peu d'autres plantes fleurissent sur la colline sableuse.",
    propagationNote:
      "Semez la graine mûre à l'automne, là où il poussera, dans du sable nu. Il a une racine pivotante profonde : ne le transplantez pas.",
  },
  "Pontederia cordata": {
    nativeNote:
      "Indigène dans les étangs peu profonds, les marais et les cours d'eau lents de toute la Floride.",
    careNote:
      "Pour un bord d'étang, un bassin de rétention ou la partie la plus mouillée d'un jardin de pluie, jusqu'à trente centimètres d'eau. Elle s'étend par de grosses racines en un massif. Plein soleil pour fleurir.",
    givesNote:
      "Des épis bleus pour les abeilles et les papillons du printemps à l'automne, des graines pour les canards, et de l'ombre et un abri pour les grenouilles et les petits poissons.",
    propagationNote:
      "Coupez une touffe au printemps en morceaux portant un bourgeon et des racines, et enfoncez-les dans la vase ou dans un pot immergé.",
    supportNotes: {
      "bumble-bees":
        "Les bourdons visitent ses épis bleus au bord de l'eau du printemps à l'automne.",
      "white-peacock":
        "L'Anartia jatrophae butine ses épis pendant toute la saison chaude.",
    },
  },
  "Euthamia caroliniana": {
    nativeNote:
      "Indigène dans toute la Floride, dans les flatwoods, les prairies humides, les fossés et les friches.",
    careNote:
      "Une parente des verges d'or aux feuilles fines comme de l'herbe. Elle s'étend par ses racines en une plaque : donnez-lui une prairie ou un coin plutôt qu'un massif soigné. Son pollen est porté par les insectes, pas par le vent : elle ne donne pas le rhume des foins.",
    givesNote:
      "Des fleurs jaunes en corymbes plats à l'automne, couvertes d'abeilles, de guêpes et de papillons en migration, et des graines pour les bruants en hiver.",
    propagationNote:
      "Déterrez et divisez une plaque en hiver ou au printemps. Ou répandez la graine duveteuse sur un sol nu à l'automne, sans la couvrir.",
    supportNotes: {
      monarch:
        "Du nectar d'automne pour les monarques qui descendent vers le sud à travers la Floride.",
      "white-peacock":
        "L'Anartia jatrophae se presse sur ses corymbes jaunes à l'automne.",
    },
  },
  "Vitis rotundifolia": {
    nativeNote:
      "La vigne sauvage de Floride, indigène dans les bois, les hammocks et les haies de tout l'État.",
    careNote:
      "Donnez-lui une clôture solide, une tonnelle ou un treillage au soleil, sinon elle grimpera dans l'arbre le plus proche. Les vignes sauvages ne fructifient que sur les pieds femelles ; les variétés de pépinière fructifient seules. Le raisin est toxique pour les chiens.",
    givesNote:
      "Des raisins à peau épaisse à la fin de l'été pour les oiseaux, les renards, les ratons laveurs et les ours, et des feuilles pour de grandes chenilles de sphinx.",
    propagationNote:
      "Couchez une tige au sol : elle s'enracine en une saison. Les boutures de bois sec reprennent mal ; les boutures tendres d'été sous brumisation réussissent mieux.",
    supportNotes: {
      "berry-songbirds":
        "Moqueurs, moqueurs roux et moqueurs chats mangent les raisins qui éclatent sur la vigne.",
      "acorn-mammals":
        "Renards, ratons laveurs, opossums, cerfs et ours noirs se nourrissent des raisins tombés.",
    },
  },

  // -------------------------------------------------------------------------
  // Les taxa dont la clé simple appartient à la liste du Mid-Atlantic : ici,
  // leur fiche floridienne.
  // -------------------------------------------------------------------------
  "Parthenocissus quinquefolia@florida-central": {
    nativeNote:
      "Indigène dans les bois et les hammocks de toute la Floride.",
    careNote:
      "Elle pousse en ombre profonde comme en plein soleil et couvre vite une clôture, un mur ou un talus nu. Tenez-la à l'écart d'un bardage en bois. Cinq folioles, pas les trois de l'herbe à puce. Ses baies sont toxiques pour les personnes et les animaux.",
    givesNote:
      "Des baies bleu-noir sur des pédoncules rouges à l'automne pour de nombreux oiseaux, et des feuilles pour les chenilles de sphinx.",
    propagationNote:
      "Enracinez dans un sol frais des pousses tendres d'été ou des tronçons de liane en hiver. Les tiges qui touchent le sol s'enracinent seules : coupez-les et soulevez-les.",
    supportNotes: {
      "berry-songbirds":
        "Grives, moqueurs et pics prennent les baies tout l'automne et l'hiver.",
    },
  },
  "Phyla nodiflora@florida-central": {
    nativeNote:
      "Indigène dans toute la Floride, dans les pelouses, les bords de route et les creux humides.",
    careNote:
      "Une alternative au gazon qui supporte la tonte, le piétinement, les inondations et la sécheresse, et reste verte dans la chaleur floridienne. Elle s'étend vite par stolons : tenez-la hors des massifs.",
    givesNote:
      "De minuscules fleurs presque toute l'année pour les petites abeilles et les papillons, et la nourriture des chenilles du Phyciodes phaon, de l'Anartia jatrophae et du Junonia coenia.",
    propagationNote:
      "Chaque stolon s'enracine là où il touche le sol : coupez un morceau enraciné et replantez-le, en toute saison.",
    supportNotes: {
      "phaon-crescent":
        "La verveine du pays est la nourriture des chenilles du Phyciodes phaon : laissez un coin sans tonte et il le trouvera.",
      "white-peacock":
        "L'une des plantes à chenilles de l'Anartia jatrophae en Floride.",
    },
  },
  "Acer rubrum@florida-central": {
    nativeNote:
      "Indigène dans toute la Floride, dans les marécages, les plaines inondables et les bois frais — l'érable le plus répandu de l'État.",
    careNote:
      "Rapide et adaptable ; il adore les terrains frais et tolère les sols gorgés d'eau, ce qui en fait l'arbre idéal d'un point bas et humide. Arrosez-le le temps qu'il s'installe sur un site plus sec.",
    givesNote:
      "Ses fleurs rouges s'ouvrent au cœur de l'hiver floridien — le premier nectar et le premier pollen de l'année — ses graines nourrissent les oiseaux, et il héberge des centaines de chenilles.",
    propagationNote:
      "Ses petites graines ailées en « hélicoptère » mûrissent au printemps — attrapez-les quand elles brunissent et semez-les aussitôt. L'érable rouge est le plus facile : sa graine de printemps lève en quelques jours dans une terre chaude, sans aucun froid nécessaire.",
  },
  "Asclepias tuberosa@florida-central": {
    nativeNote:
      "Asclépiade indigène des collines sableuses bien drainées et des bords de route de Floride — une alternative indigène à l'asclépiade tropicale exotique vendue en jardinerie.",
    careNote:
      "Elle demande le plein soleil et un sol parfaitement drainé (une terre sableuse), et craint l'excès d'eau comme d'être déplacée — une racine pivotante profonde la rend résistante à la sécheresse mais impossible à déplacer : plantez-la pour qu'elle reste. Lente à sortir au printemps. Sa sève est toxique si on l'avale. Préférez-la à l'asclépiade tropicale exotique, qui perturbe la migration des monarques en Floride.",
    givesNote:
      "Une plante nourricière des chenilles du monarque et du Danaus gilippus, visitée par de nombreux papillons et abeilles indigènes, sur un pied net et peu envahissant.",
    propagationNote:
      "Partez de la graine — sa racine pivotante profonde supporte mal d'être déterrée ou divisée, n'essayez donc pas de la diviser. Semez à l'automne, ou donnez à la graine quelques semaines de froid humide au réfrigérateur avant un semis de printemps, et plantez les jeunes plants là où ils resteront pour de bon.",
    supportNotes: {
      monarch:
        "Une asclépiade et une plante hôte du monarque ; la Floride se trouve sur la voie de migration et d'hivernage du monarque.",
      "queen-butterfly":
        "Les asclépiades sont aussi la seule nourriture des chenilles du cousin du monarque, le Danaus gilippus.",
    },
    lookalikeNotes: {
      "asclepias-curassavica": {
        why: "Toutes deux sont des asclépiades orange vendues pour les monarques — mais dans un hiver floridien, une seule des deux disparaît.",
        tells: [
          { feature: "Couleur de la fleur", native: "Un orange uni, parfois tirant sur le jaune.", lookalike: "Deux tons : des pétales extérieurs rouges autour d'une couronne jaune-orangé." },
          { feature: "Cassez une tige", native: "Une sève claire et aqueuse — la seule asclépiade qui ne saigne pas blanc.", lookalike: "Un latex blanc épais." },
          { feature: "En hiver", native: "Elle disparaît au ras du sol et se repose.", lookalike: "Elle ne s'arrête jamais. Les spores du parasite OE s'accumulent sur des feuilles qui ne tombent jamais, et les monarques restent se reproduire au lieu de migrer." },
          { feature: "Si vous l'avez déjà", native: "Rien à faire.", lookalike: "Rabattez-la au sol chaque automne, ou remplacez-la par une asclépiade indigène." },
        ],
      },
    },
  },
  "Cephalanthus occidentalis@florida-central": {
    nativeNote:
      "Indigène des bords d'étang, des marécages et des fossés dans toute la Floride.",
    careNote:
      "Pour un coin qui reste mouillé ou qui inonde — un bord d'étang, un fossé, le point bas d'un jardin de pluie. Pas pour un sol sec.",
    givesNote:
      "Ses fleurs blanches en pelote d'épingles grouillent de papillons et d'abeilles tout au long de l'été floridien, et les canards mangent ses graines.",
    propagationNote:
      "Il s'enracine très volontiers. En hiver, enfoncez dans un sol mouillé des rameaux sans feuilles gros comme un crayon, ou bouturez des pointes vertes et tendres au début de l'été. Gardez-les mouillés le temps qu'ils s'enracinent, ce qui convient à cet amoureux de l'eau.",
    supportNotes: {
      "spicebush-swallowtail":
        "Les grands porte-queue s'y nourrissent en battant encore des ailes, en faisant le tour de la sphère.",
      "bumble-bees":
        "Il fleurit pendant les mois les plus chauds, quand presque rien d'autre ne fleurit au bord de l'étang.",
    },
  },
  "Lobelia cardinalis@florida-central": {
    nativeNote:
      "Indigène des berges de ruisseau, des sources et des fossés humides du nord et du centre de la Floride.",
    careNote:
      "Il lui faut une humidité constante — un bord d'étang, un ruisseau de source, un jardin de pluie. Elle s'effondre dans un coin sec. De courte vie, mais elle se ressème en sol frais.",
    givesNote:
      "Des hampes rouges où les colibris se nourrissent à la fin de l'été et à l'automne, au passage des migrateurs.",
    propagationNote:
      "La graine est presque une poussière : répandez-la sur un sol humide sans la couvrir, car elle a besoin de lumière pour germer. Les tiges qui retombent sur un sol mouillé s'enracinent, et ces morceaux enracinés se soulèvent et se déplacent.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses tubes rouge vif sont faits pour le bec d'un colibri, et c'est l'une de ses plantes nectarifères indigènes les plus importantes.",
    },
  },
  "Rudbeckia hirta@florida-central": {
    nativeNote:
      "Indigène dans toute la Floride, dans les collines sableuses, les flatwoods et les bords de route.",
    careNote:
      "De courte vie, mais elle se ressème abondamment : une touffe se maintient d'elle-même. Elle supporte la chaleur et le sable ; dans l'humidité floridienne, donnez-lui plein soleil et de l'air.",
    givesNote:
      "Des mois de marguerites dorées pour les abeilles et les papillons, puis des têtes de graines que les chardonnerets picorent en hiver.",
    propagationNote:
      "L'une des plus faciles : répandez à l'automne la graine des cônes secs sur un sol nu. Une fois installée, ses semis spontanés la gardent au jardin.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Une fleur de la famille des tournesols dont le pollen nourrit des abeilles spécialistes.",
      "american-goldfinch":
        "Les chardonnerets en hivernage picorent les graines dans les cônes secs.",
    },
  },
  "Lonicera sempervirens@florida-central": {
    nativeNote:
      "Indigène dans les hammocks et les bois jusqu'au centre de la Floride — pas l'espèce envahissante.",
    careNote:
      "Ici une grimpante persistante et sage, rien à voir avec le chèvrefeuille du Japon envahissant. Donnez-lui un support où s'enrouler : plus de soleil, plus de fleurs.",
    givesNote:
      "Des trompettes corail pendant des mois, qui nourrissent les colibris pendant la migration de printemps. Viennent ensuite des baies rouges pour les passereaux.",
    propagationNote:
      "Il s'enracine facilement : prenez en été des morceaux de pousses de l'année quand ils se raffermissent, ou des tiges sans feuilles en hiver, et enracinez-les dans un terreau humide.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses fleurs tubulaires corail, sur une longue saison, en font l'une des meilleures grimpantes à colibris qui soient.",
      "hummingbird-clearwing":
        "Le chèvrefeuille est une plante hôte documentée du sphinx colibri, Hemaris thysbe.",
    },
  },

  // -------------------------------------------------------------------------
  // Floride du Sud et les Keys — les espèces qui n'appartiennent qu'ici.
  // -------------------------------------------------------------------------
  "Bursera simaruba@florida-south": {
    supportNotes: {
      "berry-songbirds":
        "Le gommier rouge fructifie en fin d'hiver, exactement quand les tyrans et les viréos migrateurs passent et qu'il n'y a presque rien d'autre de mûr.",
      "atala":
        "Les atalas viennent à ses petites fleurs verdâtres — la zamie élève leurs chenilles, mais les adultes doivent manger aussi.",
    },
    nativeNote:
      "L'arbre emblématique des hammocks du sud de la Floride, à l'écorce rouge qui pèle (l'« arbre du touriste »).",
    careNote:
      "Rapide, tolérant à la sécheresse et au sel, et réputé résistant au vent — il perd des branches plutôt que de basculer dans les tempêtes, et même de grosses branches coupées s'enracinent en poteaux de clôture vivants. Strictement hors gel (zone 10+) ; une forte gelée le tue en partie.",
    givesNote:
      "Des fruits rouges que les oiseaux migrateurs et sédentaires dépouillent rapidement, l'ombre du hammock et une résistance aux ouragans, et le rôle de plante nourricière de l'Eunica monima.",
    propagationNote:
      "C'est le fameux arbre à « clôture vivante » : coupez une branche de bonne taille, même grosse comme un bras, plantez-la debout en terre pendant la saison chaude, et elle s'enracine en un arbre entier — la façon la plus facile d'en avoir un. Vous pouvez aussi débarrasser les fruits mûrs de leur pulpe et semer la graine fraîche et au chaud.",
  },
  "Coccoloba uvifera@florida-south": {
    nativeNote:
      "Arbre-arbuste littoral emblématique des plages et des dunes du sud de la Floride.",
    careNote:
      "Fait pour le littoral le plus rude — battu de sel, sableux, ensoleillé — et extrêmement tolérant au sel et à la sécheresse. Sensible au gel (zone 10+). Taillez-le en arbre ou gardez-le en écran ; notez qu'il est protégé par la réglementation sur les dunes littorales dans beaucoup d'endroits.",
    givesNote:
      "De grandes feuilles rondes et coriaces qui cuirassent une dune contre l'érosion, des fruits pourpres en grappes de raisin pour les oiseaux (et pour la gelée), et du nectar pour les abeilles.",
    propagationNote:
      "Cueillez les « raisins » pourpres mûrs, pressez et lavez la pulpe autour de l'unique graine intérieure, et semez-la fraîche et au chaud sans la laisser sécher. Le raisinier est dioïque — pieds mâles et femelles séparés — si vous voulez des fruits il vous faudra donc une femelle (et un mâle à proximité pour la polliniser).",
    supportNotes: {
      "berry-songbirds":
        "Les fruits pourpres mûrs du raisinier sont mangés par les moqueurs et d'autres oiseaux du littoral (et par les gens).",
    },
  },
  "Coccoloba diversifolia@florida-south": {
    nativeNote:
      "Arbre dressé des hammocks du sud de la Floride et des Keys — le cousin de l'intérieur du raisinier bord de mer.",
    careNote:
      "Un persistant net, tolérant au sel et à la sécheresse, pour l'ombre ou l'alignement de rue une fois installé. Zones sans gel seulement (zone 10+). Les pieds femelles portent les fruits.",
    givesNote:
      "Des fruits rouge-pourpre sombre dont se nourrissent les pigeons, les moqueurs et d'autres oiseaux, plus un couvert de hammock persistant et dense et une écorce lisse et marbrée.",
    propagationNote:
      "Récoltez les fruits rouge-pourpre sombre sur un pied femelle, lavez la pulpe autour de la graine, et semez-la fraîche et au chaud — ne la laissez pas sécher d'abord. Comme son cousin le raisinier, il a des pieds mâles et femelles séparés : seules les femelles fructifient.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits sombres du Coccoloba diversifolia sont l'un des favoris du pigeon à couronne blanche et des autres oiseaux frugivores.",
    },
  },
  "Conocarpus erectus@florida-south": {
    supportNotes: {
      "grass-skippers":
        "Les petites fleurs en cône du palétuvier gris sont travaillées par les hespéries de la mangrove et des hammocks et par les grands papillons-dagues — les papillons de la frange côtière.",
      "berry-songbirds":
        "Les passerins nonpareils prennent les capitules en graines, et le houppier dense et tolérant au sel est un couvert de nidification là où presque rien ne pousse.",
    },
    nativeNote:
      "Arbre littoral des rivages du sud de la Floride, compagnon des palétuviers.",
    careNote:
      "Exceptionnellement tolérant au sel, à la sécheresse et au vent — un choix de premier ordre pour un emplacement littoral difficile, en arbre, en haie ou en écran. Hors gel (zone 10+). (La forme argentée, var. sericeus, est indigène ici aussi ; la forme verte est la plus commune à l'état sauvage.)",
    givesNote:
      "Des capitules en boutons et un couvert dense pour les oiseaux et les pollinisateurs du littoral, avec des racines qui cuirassent un rivage contre l'érosion.",
    propagationNote:
      "Récoltez les petits capitules en bouton à maturité, émiettez-les, et semez la graine fraîche et au chaud. Vous pouvez aussi faire raciner des boutures semi-ligneuses — des morceaux de tige qui commencent tout juste à s'aoûter — prises pendant la saison chaude de croissance.",
  },
  "Morella cerifera@florida-south": {
    nativeNote:
      "Petit arbre ou grand arbuste rapide et adaptable, indigène dans toute la Floride, sud compris.",
    careNote:
      "Très rapide et robuste — il prend le soleil comme l'ombre, l'humide comme le sec, le sel et les sols pauvres — idéal pour un écran rapide ou pour combler un emplacement difficile. Il drageonne ; il fixe son propre azote. Les pieds femelles portent les baies cireuses.",
    givesNote:
      "Des baies bleues cireuses dont dépendent en hiver les parulines à croupion jaune et bien d'autres oiseaux, un couvert de nidification dense, et le rôle de plante hôte du Calycopis cecrops.",
    propagationNote:
      "Le Morella cerifera a des pieds mâles et femelles séparés, et seules les femelles portent les baies bleues cireuses. Frottez l'enduit cireux de la graine et semez au chaud. Il s'enracine aussi de boutures semi-ligneuses, et vous pouvez déterrer les rejets enracinés qu'il fait autour de sa base pour les replanter.",
    supportNotes: {
      "yellow-rumped-warbler":
        "Les baies cireuses du Morella cerifera sont la nourriture qui permet aux parulines à croupion jaune d'hiverner dans tout le Sud.",
      "berry-songbirds":
        "Ses fruits nourrissent aussi les hirondelles bicolores, les moqueurs chats et d'autres oiseaux hivernants.",
    },
  },
  "Chrysobalanus icaco@florida-south": {
    nativeNote:
      "Arbuste persistant des côtes, des pinèdes sur roche calcaire et des bords humides du sud de la Floride.",
    careNote:
      "Un persistant robuste, tolérant au sel et à la sécheresse, qui accepte un terrain humide ou sec et se taille en excellente haie indigène. Hors gel (zone 10+). Cherchez des formes sauvages locales plutôt que le cultivar commercial « Red Tip ».",
    givesNote:
      "Un couvert persistant luisant et un habitat de nidification, de petites fleurs blanches pour les pollinisateurs, et des fruits comestibles en forme de prunes que les oiseaux et les gens apprécient.",
    propagationNote:
      "Prélevez la graine des fruits mûrs en forme de prune, rincez-la, et semez-la fraîche et au chaud avant qu'elle ne sèche. Il s'enracine aussi de boutures semi-ligneuses en saison chaude, et les branches basses se marcottent — fixez-en une au sol et elle s'enracine toute seule.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits de l'icaquier nourrissent oiseaux et mammifères tout le long du littoral subtropical.",
    },
  },
  "Psychotria nervosa@florida-south": {
    nativeNote:
      "Arbuste de sous-bois aux feuilles luisantes des hammocks du sud de la Floride.",
    careNote:
      "L'arbuste indigène de référence pour l'ombre — ses feuilles aux nervures profondes, comme laquées, éclairent un sous-bois de hammock. Sensible au gel : protégez-le d'un coup de froid. Un peu d'eau en période sèche ; le soleil décolore ses feuilles.",
    givesNote:
      "Des fleurs blanches pour les papillons et les abeilles indigènes, puis des baies rouges dont se nourrissent les moqueurs, les cardinaux et les parulines, tout cela à l'ombre sèche où presque rien d'autre ne prospère.",
    propagationNote:
      "Pressez la graine des fruits rouges mûrs, lavez-en la pulpe, et semez-la fraîche et au chaud — elle perd vite sa faculté germinative si on la laisse sécher. Le Psychotria nervosa s'enracine aussi volontiers de boutures de pousses tendres ou tout juste aoûtées prises pendant les mois chauds.",
    supportNotes: {
      "berry-songbirds":
        "Les baies rouges du Psychotria nervosa sont prélevées par les moqueurs, les cardinaux et les moqueurs chats ; ses fleurs nourrissent les papillons.",
    },
    lookalikeNotes: {
      "ardisia-crenata": {
        why: "Deux arbustes d'ombre de même taille, à feuilles luisantes et baies rouges, souvent dans le même hammock.",
        tells: [
          { feature: "Surface de la feuille", native: "Profondément gaufrée — les nervures sont enfoncées, si bien que toute la feuille paraît ondulée.", lookalike: "Lisse et plate, à bords ondulés et festonnés." },
          { feature: "Baies", native: "Rouge terne, en petit bouquet à l'extrémité de la pousse, disparues dès que les oiseaux les trouvent.", lookalike: "Écarlate laqué éclatant, en lourdes grappes pendantes qui tiennent des mois." },
          { feature: "Sous la plante", native: "De la litière de feuilles ordinaire.", lookalike: "Un tapis de semis — le signe le plus sûr de tous." },
          { feature: "Fleurs", native: "De petits bouquets blancs à l'extrémité des pousses.", lookalike: "De petites fleurs rose-blanc sur des pédoncules pendants." },
        ],
      },
    },
  },
  "Sophora tomentosa var. truncata@florida-south": {
    supportNotes: {
      "bumble-bees":
        "Les fleurs jaunes en papilionacée du sophora doivent être forcées, et sur une dune littorale les insectes assez lourds pour le faire sont surtout les bourdons.",
    },
    nativeNote:
      "Arbuste littoral du sud de la Floride — plantez la variété indigène de Floride, truncata, et non la forme exotique duveteuse.",
    careNote:
      "Un arbuste littoral résistant au sel et à la sécheresse, pour le plein soleil, qui fleurit une grande partie de l'année ; il fixe son propre azote. Hors gel (zone 10+). Choisissez la var. truncata indigène, à feuilles lisses ; les graines sont toxiques si on les avale.",
    givesNote:
      "Des chaînes pendantes de fleurs jaunes en pois nourrissent les colibris et les abeilles presque toute l'année, et il héberge le Leptotes cassius et d'autres papillons.",
    propagationNote:
      "Comme chez la plupart des légumineuses, la graine a un tégument dur : entaillez-la ou grattez-la et faites-la tremper une nuit avant de semer au chaud — cela laisse entrer l'eau et la met en route. Récoltez la graine mûre dans les gousses en chapelet ; rappelez-vous qu'elle est toxique, tenez-la donc à l'écart des enfants et des animaux.",
  },
  "Zamia integrifolia": {
    nativeNote:
      "La seule cycadée indigène de Floride, des pinèdes et des hammocks — et la seule plante hôte indigène de l'Eumaeus atala.",
    careNote:
      "Extrêmement robuste, lente et longévive — elle prend le soleil ou l'ombre, la sécheresse, le sel et les sols calcaires pauvres une fois installée. D'aspect de fougère mais c'est une cycadée ; toutes ses parties sont toxiques si on les avale. Elle est au mieux dans le sud de la Floride, son aire d'origine.",
    givesNote:
      "La seule plante nourricière indigène des chenilles du rare Eumaeus atala (qui mangent aussi des cycadées importées comme le cycas du Japon) — planter cette Zamia a ramené ce papillon du bord de l'extinction locale — plus un arbuste-couvre-sol persistant, architectural et résistant à la sécheresse.",
    propagationNote:
      "La Zamia est une cycadée qui ne se cultive que par semis — pas de bouture, pas de division. Elle a des pieds mâles et femelles séparés, et seules les femelles pollinisées font les gros cônes de graines orange. Avec des gants (la graine est toxique), retirez l'enveloppe charnue, faites tremper ou grattez légèrement la graine, et semez-la fraîche et au chaud. C'est très lent : ne perdez pas courage.",
    supportNotes: {
      atala:
        "Cette Zamia est la seule plante nourricière indigène des chenilles de l'Eumaeus atala — la planter est ce qui a ramené ce papillon du bord de l'extinction dans le sud de la Floride.",
    },
  },
  // The look-alike tie is South Florida's alone; the paragraphs above are
  // central Florida's, so the southern row shows its own English for those.
  "Zamia integrifolia@florida-south": {
    lookalikeNotes: {
      "cycas-revoluta": {
        why: "Deux cycadées à la même rosette raide, d'allure de palmier — et le cycas du Japon pousse devant une maison sur deux en Floride.",
        tells: [
          { feature: "Folioles", native: "Plates et à bord souple, arrondies ou légèrement échancrées au bout ; on peut y passer la main.", lookalike: "Raides, enroulées sur les bords et acérées comme des aiguilles au bout — elles font saigner." },
          { feature: "Où est la tige", native: "Sous terre : les feuilles sortent directement du sol.", lookalike: "Au-dessus du sol : un tronc brun hirsute qui s'épaissit avec les années." },
          { feature: "Cônes", native: "Un petit cône brun velouté, bas parmi les feuilles.", lookalike: "Un gros cône, ou un grand dôme laineux, posé au centre." },
          { feature: "Pourquoi cela compte", native: "La seule nourriture indigène des chenilles de l'Eumaeus atala.", lookalike: "Toxique pour les personnes et les animaux ; ses graines sont une cause fréquente d'empoisonnement mortel chez le chien." },
        ],
      },
    },
  },
  "Stachytarpheta jamaicensis@florida-south": {
    nativeNote:
      "Indigène basse et rampante des terrains littoraux et remaniés du sud de la Floride — plantez l'indigène, pas les sosies dressés envahissants.",
    careNote:
      "Un couvre-sol rampant robuste, tolérant à la sécheresse et au sel, pour le plein soleil, qui fleurit toute l'année. Exigez l'indigène rampante Stachytarpheta jamaicensis — les Stachytarpheta plus hauts, à tiges raides, vendus en jardinerie sont exotiques et peuvent devenir envahissants.",
    givesNote:
      "L'une des meilleures plantes à nectar pour papillons du sud de la Floride — ses épis de fleurs bleues attirent une foule constante de papillons, d'hespéries et d'abeilles — et une plante hôte du Junonia zonalis.",
    propagationNote:
      "Les boutures de tiges tendres s'enracinent vite dans un mélange humide, ce qui est le moyen le plus sûr d'obtenir la vraie indigène rampante plutôt qu'un sosie de jardinerie. Elle pousse aussi facilement de semis au chaud et se ressème dans le jardin dès qu'elle se plaît.",
    supportNotes: {
      "white-peacock":
        "La Stachytarpheta jamaicensis est une plante nourricière des chenilles de l'Anartia jatrophae.",
      "zebra-longwing":
        "Ses longs épis de fleurs bleues sont une source de nectar de premier ordre pour les Heliconius et bien d'autres papillons.",
    },
    lookalikeNotes: {
      "stachytarpheta-cayennensis": {
        why: "Les deux portent l'étiquette « porterweed », et les deux portent les mêmes petites fleurs bleues qui montent le long d'un épi.",
        tells: [
          { feature: "Port", native: "Rampe au sol, hauteur de genou au plus.", lookalike: "Se tient dressée, hauteur de poitrine ou plus." },
          { feature: "Couleur des fleurs", native: "Bleu ciel pâle à lavande.", lookalike: "Bleu-violet profond." },
          { feature: "Tiges", native: "Doucement velues, souvent rougeâtres, s'enracinant au contact du sol.", lookalike: "Lisses, et ligneuses à la base." },
          { feature: "Feuilles", native: "Arrondies, épaisses, à dents émoussées.", lookalike: "Étroites, minces et vivement dentées — la « feuille d'ortie » de son nom anglais." },
        ],
      },
    },
  },
  "Rivina humilis@florida-south": {
    supportNotes: {
      "berry-songbirds":
        "Les baies rouges translucides de la rivine restent sur la tige des mois durant, et les cardinaux rouges remontent une grappe entière à l'ombre d'un hammock.",
      "white-peacock":
        "Ses minuscules fleurs blanches sont ouvertes toute l'année, ce qu'il faut à un papillon qui vole en janvier.",
    },
    nativeNote:
      "Indigène amie de l'ombre des hammocks et des lisières ombragées du sud de la Floride.",
    careNote:
      "Un bouche-trou facile pour l'ombre sèche, où peu d'autres choses fructifient ; elle fleurit et fructifie presque toute l'année et se ressème librement, alors éclaircissez-la. Ses baies vives sont toxiques pour les personnes si on les avale.",
    givesNote:
      "Des grappes de baies rouges que moqueurs, moqueurs chats et autres passereaux travaillent toute l'année, sur un couvre-sol bas d'ombre aux petites fleurs rose-blanc pour les pollinisateurs.",
    propagationNote:
      "Écrasez les baies rouges mûres pour en tirer la graine, rincez, et semez au chaud — elle lève facilement. En réalité elle se ressème si librement à l'ombre que vous arracherez plus souvent des semis en trop que vous n'en élèverez. N'oubliez pas que les baies sont toxiques pour les personnes.",
  },
  "Passiflora suberosa@florida-south": {
    nativeNote:
      "Une petite passiflore indigène délicate des hammocks et des lisières du sud de la Floride — meilleure plante hôte ici que la grande Passiflora incarnata.",
    careNote:
      "Une grimpante modeste et facile pour un treillage, une clôture ou un arbuste à traverser — bien moins galopante que la Passiflora incarnata, même si elle se ressème encore. Elle prend le soleil ou la mi-ombre ; résistante à la sécheresse une fois installée.",
    givesNote:
      "La plante nourricière des chenilles de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia et de l'Agraulis vanillae ; ses petites baies sombres nourrissent aussi les oiseaux.",
    propagationNote:
      "Pressez la graine des baies sombres mûres et semez-la au chaud ; elle lève volontiers et se ressème dans le jardin. Les boutures de tiges tendres s'enracinent facilement, et la liane émet aussi des rejets qu'on peut déterrer et déplacer — il est donc rarement difficile d'en avoir plus.",
    supportNotes: {
      "zebra-longwing":
        "La Passiflora suberosa est une plante hôte de prédilection pour l'Heliconius charithonia.",
      "gulf-fritillary":
        "Une plante nourricière de l'Agraulis vanillae également.",
    },
  },

  // -------------------------------------------------------------------------
  // Les neuf taxa partagés avec la Floride du Nord et du Centre : la clé simple
  // ci-dessus porte la version du centre, celles-ci la version du Sud.
  // -------------------------------------------------------------------------
  "Quercus virginiana@florida-south": {
    nativeNote:
      "Le grand chêne persistant à large couronne, indigène sur toute la longueur de la Floride jusque dans le sud subtropical.",
    careNote:
      "Donnez-lui de la vraie place — sa couronne s'étale bien plus large que haute. Résistant au sel et au vent, et l'un des arbres d'ombre les plus résistants aux ouragans que vous puissiez planter dans le Sud.",
    givesNote:
      "L'un des meilleurs arbres pour la faune, même ici : des centaines d'espèces de chenilles, des glands pour les geais et les écureuils, un abri persistant, et des branches qui hébergent broméliacées, orchidées et fougère de résurrection.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et semez-les aussitôt — le chêne de Virginie est un chêne blanc : ils germent tout de suite et n'ont jamais besoin de passer par le froid. Mettez-les dans un seau d'eau et jetez ceux qui flottent, gardez humides ceux qui coulent (ne les laissez jamais sécher), et plantez là où l'arbre restera, car la racine pivotante profonde supporte mal d'être déplacée.",
    supportNotes: {
      "acorn-birds":
        "Les glands du chêne de Virginie nourrissent geais, pics et canards dans le sud de la Floride aussi.",
      "acorn-mammals":
        "Des glands pour les écureuils et d'autres mammifères.",
    },
  },
  "Sabal palmetto@florida-south": {
    supportNotes: {
      "berry-songbirds":
        "Un sabal en fruit nourrit d'un coup moqueurs chats, moqueurs polyglottes, merles d'Amérique et viréos, et cela dure des semaines.",
      "acorn-mammals":
        "Les ratons laveurs grimpent pour le fruit et les cerfs prennent ce qui tombe — un seul palmier voit passer beaucoup de monde.",
    },
    nativeNote:
      "L'arbre emblème de l'État de Floride ; indigène partout, des hammocks au littoral du Sud et aux Keys.",
    careNote:
      "Quasi indestructible — sel, sécheresse, crue, sols sableux ou calcaires, soleil ou mi-ombre — et parmi les arbres les plus résistants aux ouragans qui soient. Lent à prendre de la hauteur de tronc. Laissez en place les vieilles « bottes » de feuilles pour la faune.",
    givesNote:
      "Ses panicules de fleurs d'été grouillent d'abeilles ; ses fruits nourrissent de nombreux oiseaux et mammifères ; et sa couronne et ses bottes abritent chauves-souris, rainettes et oiseaux nicheurs.",
    propagationNote:
      "Le Sabal palmetto ne se cultive que par semis — on ne peut ni le diviser ni le bouturer. Récoltez les fruits noirs mûrs, débarrassez les graines rondes de leur pulpe, et semez-les fraîches dans une terre chaude et humide. Soyez patient : la levée et la croissance sont lentes, et il faut des années pour former un tronc.",
    lookalikeNotes: {
      "washingtonia-robusta": {
        why: "Deux palmiers en éventail dans la même rue — et le grand mince de la carte postale n'est pas l'arbre emblème de la Floride.",
        tells: [
          { feature: "L'éventail", native: "Le pétiole se prolonge dans l'éventail et le courbe : la feuille se plie comme un taco.", lookalike: "Le pétiole s'arrête là où l'éventail commence ; la feuille est plate." },
          { feature: "Filaments", native: "De fins filaments pendent entre les segments de la feuille.", lookalike: "Aucun filament." },
          { feature: "Bord du pétiole", native: "Lisse — sans dents.", lookalike: "Bordé d'épines orange recourbées." },
          { feature: "Tronc", native: "Épais et gris, portant souvent encore les vieilles bases de feuilles croisées.", lookalike: "Mince, très haut et droit, en général avec une jupe de palmes brunes mortes." },
        ],
      },
    },
  },
  "Serenoa repens@florida-south": {
    supportNotes: {
      "grass-skippers":
        "Les chenilles de l'hespérie du palmier nain ne mangent que le palmier de Floride, et rien d'autre, dans une section de palme enroulée. Arrachez le palmier nain d'une lande et le papillon s'en va avec.",
      "mason-bees":
        "Un palmier nain en fleur est l'une des plantes les plus visitées de Floride — des dizaines d'espèces d'abeilles solitaires indigènes y ont été relevées, dont plusieurs ne se trouvent guère ailleurs.",
      "berry-songbirds":
        "Le fruit noir de l'automne nourrit tour à tour merles d'Amérique, moqueurs, ratons laveurs, renards et ours.",
    },
    nativeNote:
      "Le palmier de sous-bois qui définit les pinèdes et le scrub de Floride, vers le sud jusque dans les Keys — l'une des plantes les plus importantes de l'État pour la faune.",
    careNote:
      "À peu près aussi robuste qu'une plante de Floride peut l'être — résistant à la sécheresse, au feu, au sel et aux ouragans, extrêmement longévif, au soleil comme à l'ombre. Très lent et difficile à transplanter : commencez par un petit plant et choisissez sa place pour de bon. Les pétioles portent de fines dents.",
    givesNote:
      "L'une des meilleures plantes de Floride pour la faune : ses fleurs sont une source de nectar de premier ordre (le miel de palmetto), ses fruits nourrissent de nombreux animaux, et ses touffes abritent d'innombrables petites créatures et pollinisateurs.",
    propagationNote:
      "Le Serenoa repens ne se cultive que par semis — il ne se divise pas et ne se bouture pas. Débarrassez les fruits mûrs de leur pulpe et semez la graine fraîche et au chaud. Attendez-vous à une longue attente : la levée est irrégulière et les jeunes plants poussent extrêmement lentement, alors commencez par un petit plant et soyez patient.",
  },
  "Hamelia patens@florida-south": {
    nativeNote:
      "L'arbuste à papillons et à colibris classique du sud de la Floride — achetez la vraie indigène, pas les formes exotiques « dwarf » ou « compact ».",
    careNote:
      "Elle adore la chaleur et le soleil et fleurit toute l'année dans le sud de la Floride sans gel — aucun rabattage ici. Résistante à la sécheresse une fois installée. Exigez la vraie espèce indigène (Hamelia patens var. patens).",
    givesNote:
      "Ses tubes rouge-orangé nourrissent les colibris, les Heliconius charithonia, les Agraulis vanillae et les coliades toute l'année, et ses baies sombres nourrissent les moqueurs et les moqueurs chats.",
    propagationNote:
      "La Hamelia patens est l'une des indigènes les plus faciles à enraciner — coupez une pousse tendre ou à peine aoûtée, effeuillez-en la base, et plantez-la dans un terreau humide. Vous pouvez aussi presser la graine des baies sombres mûres et la semer au chaud.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "La Hamelia patens est un arbuste à nectar de premier ordre pour les colibris et les papillons sous les tropiques.",
      "zebra-longwing":
        "Sa floraison rouge-orangé continue nourrit les Heliconius charithonia et les Agraulis vanillae.",
    },
    lookalikeNotes: {
      "hamelia-patens-glabra": {
        why: "Vendues sous le même nom — firebush — sur le même étal, et la compacte fleurit plus jeune en pot.",
        tells: [
          { feature: "Fleurs", native: "De longs tubes étroits, rouge-orangé sur toute leur longueur, en bouquets unilatéraux.", lookalike: "Des tubes plus courts et plus larges, jaune-orangé à rouge pâle." },
          { feature: "Feuilles et tiges", native: "Doucement velues, en général par verticilles de trois, à pétioles rouges et pousses neuves rouges.", lookalike: "Lisses et luisantes, en général par paires, à pétioles verts." },
          { feature: "Port", native: "Grande et lâche — elle tend à devenir un petit arbre.", lookalike: "Basse, dense et nette ; souvent étiquetée « dwarf firebush »." },
          { feature: "Ce qu'elle apporte", native: "La plante sur laquelle sont recensés les Heliconius charithonia, le sphinx Xylophanes pluto et les colibris de Floride.", lookalike: "Du nectar — mais pas ces observations." },
        ],
      },
    },
  },
  "Myrcianthes fragrans@florida-south": {
    nativeNote:
      "Persistant aromatique des hammocks et des bois littoraux du sud de la Floride.",
    careNote:
      "Un persistant robuste, tolérant au sel et à la sécheresse, pour le soleil ou la mi-ombre — superbe en sujet isolé, en haie ou en petit arbre à plusieurs troncs, avec une écorce cannelle qui s'exfolie et un feuillage parfumé.",
    givesNote:
      "Des fleurs blanches parfumées pour les pollinisateurs et des baies rouge-orangé qu'adorent les moqueurs, les moqueurs chats et d'autres passereaux, sur un beau persistant en toute saison.",
    propagationNote:
      "Dégagez la graine des baies rouge-orangé mûres et semez-la fraîche et au chaud sans la laisser sécher. C'est un peu lent mais fiable par semis ; les boutures semi-ligneuses prises en saison chaude sont une autre voie.",
    supportNotes: {
      "berry-songbirds":
        "Les baies de la Myrcianthes fragrans sont l'une des préférées des moqueurs et des autres passereaux.",
    },
  },
  "Salvia coccinea@florida-south": {
    nativeNote:
      "Fleur sauvage indigène de toute la Floride, qui fleurit presque toute l'année dans le Sud sans gel.",
    careNote:
      "Facile, résistante à la sécheresse et se ressemant seule — une vivace de courte vie qui s'entretient par la graine : laissez-en donc quelques-unes monter. Rabattez les pieds dégarnis. Du soleil à l'ombre légère.",
    givesNote:
      "Ses fleurs rouges, presque toute l'année, nourrissent les colibris et les papillons et comptent parmi les préférées des bourdons ; une valeur sûre en nectar, sans souci.",
    propagationNote:
      "La plus facile de toutes — semez la petite graine au chaud et elle lève vite, et les pieds installés se ressèment : laissez simplement quelques épis grener et vous en aurez toujours. Vous pouvez aussi enraciner des boutures de tiges tendres si vous voulez la copie d'un pied particulier.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "La sauge écarlate fleurit presque toute l'année dans le sud de la Floride — une ressource constante pour les colibris.",
    },
  },
  "Muhlenbergia capillaris@florida-south": {
    nativeNote:
      "Graminée indigène en touffe de toute la Floride, célèbre pour sa brume rose d'automne.",
    careNote:
      "Robuste, résistante au sel et à la sécheresse, en plein soleil sur un sol bien drainé — ni eau, ni tonte, ni engrais une fois installée. Rabattez-la une fois en fin d'hiver.",
    givesNote:
      "Des nuages de panicules roses à l'automne, des graines et un couvert pour les petits oiseaux, des racines denses qui tiennent un sol sableux ou en train de s'éroder, et un abri pour les abeilles nichant au sol ; elle héberge des hespéries.",
    propagationNote:
      "C'est une graminée de saison chaude : semez la graine cotonneuse à la surface d'une terre chaude au printemps ou en été plutôt qu'en terre froide. Le plus simple pour en avoir plus est de déterrer une touffe installée au printemps et de la fendre en morceaux, chacun avec des racines, puis de les replanter.",
  },
  "Tripsacum dactyloides@florida-south": {
    supportNotes: {
      "grass-skippers":
        "C'est le tripsaque que mangent les chenilles de l'hespérie byssus, roulées dans une de ses feuilles.",
    },
    nativeNote:
      "Grande graminée indigène en touffe des bords de marais, des fossés et des terrains frais du sud de la Floride.",
    careNote:
      "Une grosse touffe arquée et quasi persistante qui accepte le soleil ou la mi-ombre et un sol humide ou moyen — excellente au bord d'un étang, d'une noue ou dans un jardin de pluie. Donnez-lui de la place ; rabattez-la en fin d'hiver.",
    givesNote:
      "Une robuste plante de couverture et d'anti-érosion qui cuirasse les bords humides qui s'érodent, abrite et nourrit les oiseaux et la petite faune, et héberge des hespéries.",
    propagationNote:
      "Semez la grosse graine dure dans une terre chaude au printemps — elle germe inégalement, ne comptez donc pas voir lever chacune. Bien plus facile : divisez une touffe mûre au printemps, fendez-la à la bêche en morceaux enracinés et replantez. Laissez de la place aux éclats, car ils s'étoffent en grosses touffes.",
  },
  "Helianthus debilis@florida-south": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses du sud de la Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés : il lui faut le plein soleil et un sol parfaitement drainé, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le faire repartir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les oiseaux, et son tapis rampant tient la dune et les sols sableux contre l'érosion.",
    propagationNote:
      "Récoltez la graine sèche sur les capitules fanés et répandez-la à la surface d'une terre chaude et sableuse, en la pressant mais en la couvrant à peine, car elle germe mieux avec un peu de lumière. Elle se ressème généreusement une fois installée, et les boutures tendres s'enracinent facilement aussi.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Le pollen de l'Helianthus debilis fait vivre les abeilles spécialistes des astéracées le long du littoral.",
    },
  },
  // -------------------------------------------------------------------------
  // Sud de la Floride — ajouts : fougères, graminées, lianes, vivaces.
  // -------------------------------------------------------------------------
  "Acrostichum danaeifolium@florida-south": {
    nativeNote:
      "La plus grande fougère d'Amérique du Nord, indigène dans les marais d'eau douce et saumâtre, en bordure des mangroves et sur les berges des canaux du sud de la Floride.",
    careNote:
      "Un sol mouillé, au soleil ou à l'ombre : une mare, une rive de lac, une noue qui garde l'eau. Elle supporte un peu de sel. Elle devient énorme : donnez-lui la place qu'il faudrait à un arbuste.",
    givesNote:
      "D'immenses frondes coriaces qui tiennent une berge et ralentissent le ruissellement, avec un abri pour les échassiers, les grenouilles et les petits poissons au bord de l'eau.",
    propagationNote:
      "Tranchez à la bêche un morceau en bordure d'une vieille touffe, en gardant des racines, et plantez-le en sol mouillé. Les spores de l'extrémité rousse des frondes peuvent se semer sur un terreau humide, sous couvercle.",
  },
  "Nephrolepis exaltata@florida-south": {
    nativeNote:
      "Indigène dans les hammocks — ces îlots de forêt dense et humide — et les marécages du sud de la Floride, au sol, sur les rochers et dans les gaines des palmiers Sabal palmetto.",
    careNote:
      "De l'ombre et une terre ordinaire ; une fois enracinée, elle passe la saison sèche. Achetez l'indigène : Nephrolepis cordifolia porte de petits tubercules ronds sur ses stolons, et Nephrolepis brownii a des pétioles velus. Celle-ci n'a ni l'un ni l'autre.",
    givesNote:
      "Des frondes vertes et arquées pour le sol à l'ombre, et un abri pour les anolis et les rainettes.",
    propagationNote:
      "Rempotez les petits plants qui se forment le long de ses stolons, ou divisez une touffe pendant la saison des pluies. Partez d'un pied dont vous êtes sûr qu'il est indigène.",
  },
  "Thelypteris kunthii@florida-south": {
    nativeNote:
      "Indigène dans les hammocks, les bandes de cyprès chauves et les bois frais, jusqu'au comté de Miami-Dade.",
    careNote:
      "De l'ombre et une terre ordinaire, calcaire comprise. Arrosez-la pendant la saison sèche, de l'hiver au printemps ; sans gel, elle reste verte toute l'année. Elle s'étend par ses rhizomes en une large nappe souple.",
    givesNote:
      "Des frondes vert pâle qui couvrent le sol à l'ombre, là où le gazon refuse de pousser, et un abri pour les anolis, les crapauds et les carabes.",
    propagationNote:
      "Arrachez et divisez une nappe au début de la saison des pluies ; chaque morceau avec des racines reprend. Elle lève aussi toute seule de ses spores, à l'ombre humide.",
  },
  "Telmatoblechnum serrulatum@florida-south": {
    nativeNote:
      "Indigène dans tous les Everglades et le Big Cypress, dans les dômes de cyprès, les prairies humides, les bords de marais et les fossés.",
    careNote:
      "Elle supporte presque le plein soleil si ses racines restent mouillées : un jardin de pluie, une noue, une berge de mare. Les frondes peuvent brunir lors d'un printemps sec et revenir avec les pluies. Elle s'étend par stolons en un massif.",
    givesNote:
      "Des frondes dressées et dentées qui tiennent le sol mouillé et filtrent le ruissellement, avec un abri pour les grenouilles. Les jeunes frondes s'ouvrent rose bronze.",
    propagationNote:
      "Déterrez au début de la saison des pluies un morceau de stolon avec frondes et racines, et plantez-le en sol mouillé.",
  },
  "Osmunda spectabilis@florida-south": {
    nativeNote:
      "Indigène dans les bandes de cyprès chauves, les marécages et les hammocks humides, jusqu'au Big Cypress, mais pas dans les Keys.",
    careNote:
      "De l'ombre et un sol qui ne sèche jamais, même en saison sèche : une berge de mare ou un creux sous les arbres. Lente à s'installer, puis longévive, en touffe nette.",
    givesNote:
      "De larges frondes souples, terminées par des grappes de spores rousses, et un couvert frais et humide pour les grenouilles au bord de l'eau.",
    propagationNote:
      "Divisez une vieille souche au début de la saison des pluies, en gardant des racines sur chaque morceau. Ses spores vertes meurent en quelques jours : semez-les fraîches sur un terreau humide, sous couvercle.",
  },
  "Spartina bakeri@florida-south": {
    nativeNote:
      "Indigène dans les prairies humides, les bords de marais et les rives de lacs, du lac Okeechobee vers le sud.",
    careNote:
      "Une grande fontaine de feuilles fines pour le soleil et un sol humide ou moyen. Elle encaisse aussi bien l'inondation que la saison sèche. Pas besoin de la rabattre.",
    givesNote:
      "Une touffe dense qui tient la berge d'une noue ou d'une mare et abrite les lapins des marais et les oiseaux qui nichent au sol.",
    propagationNote:
      "Sa graine lève rarement : divisez plutôt. Tranchez une touffe à la bêche en morceaux enracinés au début de la saison des pluies, et replantez.",
  },
  "Uniola paniculata@florida-south": {
    nativeNote:
      "La graminée qui bâtit les dunes des plages de Floride, indigène sur les deux côtes et dans les Keys.",
    careNote:
      "Plein soleil, sable nu et embruns. Arrosez les mottes jusqu'à ce qu'elles s'enracinent. Uniola paniculata est protégée par la loi en Floride dans la nature : achetez des plants de pépinière, et ne l'arrachez ni ne la cueillez jamais.",
    givesNote:
      "Des racines et des stolons qui piègent le sable soufflé et bâtissent la dune, et des épis qui nourrissent les oiseaux et les souris des plages.",
    propagationNote:
      "Partez de mottes de pépinière. Une touffe plantée émet des stolons qu'on peut détacher au printemps. La graine de vos propres pieds se sème fraîche dans un sable chaud et humide.",
  },
  "Tripsacum floridanum@florida-south": {
    nativeNote:
      "Un petit cousin de Tripsacum dactyloides, indigène dans les pinèdes sur roche calcaire et les prairies de marne du sud de la Floride.",
    careNote:
      "Du soleil et un sol calcaire ou sableux, sec ou mouillé selon la saison. Ses feuilles étroites forment une touffe nette là où Tripsacum dactyloides serait trop grand.",
    givesNote:
      "Une touffe soignée qui tient un sol mince et rocheux, avec des graines et un couvert pour les oiseaux qui vivent au sol.",
    propagationNote:
      "Divisez une touffe en morceaux enracinés au début de la saison des pluies. La graine dure peut se semer en terre chaude, mais seule une partie lèvera.",
  },
  "Andropogon glomeratus@florida-south": {
    nativeNote:
      "Indigène dans les flatwoods humides — ces pinèdes plates et basses sur sable —, les bords de marais et les fossés de tout le sud de la Floride.",
    careNote:
      "Plein soleil et sol frais à mouillé : une noue, un jardin de pluie, un fossé. Rabattez-le en fin d'hiver, une fois les plumets tombés. Il se ressème sur la terre nue et humide alentour.",
    givesNote:
      "Des plumets argentés et duveteux de l'automne à l'hiver, au-dessus de feuilles cuivrées, des graines pour les bruants, et de quoi nourrir les chenilles des hespéries.",
    propagationNote:
      "Éparpillez la graine duveteuse sur une terre nue et humide au printemps, et tassez-la. Les touffes se divisent facilement au début de la saison des pluies.",
    supportNotes: {
      "grass-skippers":
        "Les Andropogon nourrissent les chenilles de plusieurs hespéries, qui se cachent dans des feuilles roulées et passent l'hiver au cœur de la touffe.",
    },
  },
  "Eragrostis elliottii@florida-south": {
    nativeNote:
      "Indigène dans les flatwoods de pins, les dunes littorales et les clairières sableuses de tout le sud de la Floride.",
    careNote:
      "Du soleil et un sol sableux ; elle supporte les embruns. De courte vie, mais elle se ressème : un massif se renouvelle tout seul. Rabattez-la en fin d'hiver.",
    givesNote:
      "Des feuilles gris-bleu sous des nuages légers d'épillets argentés, puis des graines pour les colombes et les bruants.",
    propagationNote:
      "Éparpillez la graine sur un sol sableux nu au printemps, et tassez-la. Les jeunes touffes se divisent facilement.",
  },
  "Ipomoea pes-caprae@florida-south": {
    nativeNote:
      "La liane pionnière des plages du sud de la Floride, qui court sur le sable nu juste au-dessus de la laisse de mer.",
    careNote:
      "Donnez-lui du sable ouvert, ensoleillé, et de la place pour courir — elle rampe plutôt qu'elle ne grimpe, et s'enracine en avançant. Elle se moque des embruns, de la sécheresse et des submersions. Coupez les tiges qui débordent sur les allées.",
    givesNote:
      "Des ipomées rose-pourpre qui s'ouvrent chaque matin pour les abeilles indigènes, et de longues tiges rampantes qui s'enracinent et sont souvent la première chose à tenir une dune.",
    propagationNote:
      "Coupez un morceau de tige déjà enraciné à un nœud et replantez-le dans le sable — de loin le plus facile. La graine dure germe une fois le tégument entaillé ou poncé et la graine trempée une nuit.",
  },
  "Canavalia rosea@florida-south": {
    nativeNote:
      "Un haricot rampant des plages et des bords de dune du sud de la Floride, souvent emmêlé avec l'Ipomoea pes-caprae.",
    careNote:
      "Il lui faut le plein soleil et un sable meuble ; laissez-le courir sur une dune ou monter sur une clôture basse. Insensible au sel et à la sécheresse. Les graines crues sont toxiques pour les gens et les animaux.",
    givesNote:
      "Des fleurs de pois rose vif toute l'année pour les xylocopes et les abeilles coupeuses de feuilles, et des tiges rampantes qui retiennent le sable de la dune. Légumineuse, il enrichit aussi le sable pauvre.",
    propagationNote:
      "Entaillez ou poncez le tégument dur, faites tremper la graine une nuit, et semez-la dans du sable chaud — elle lève en une quinzaine de jours. Un morceau de tige avec un nœud peut aussi s'enraciner.",
    supportNotes: {
      "eastern-carpenter-bee":
        "Les xylocopes sont assez lourds pour forcer ses fleurs de pois, et ce sont ses principaux visiteurs sur la dune.",
    },
  },
  "Jacquemontia pentanthos@florida-south": {
    nativeNote:
      "Une petite liane rare des pine rocklands — pinèdes sur dalle calcaire — et des lisières de hammock littoral, à Miami-Dade et dans les Keys.",
    careNote:
      "Une liane volubile légère pour une clôture, un treillage ou un arbuste clair au soleil ; elle n'étouffe pas son support. Elle veut un drainage parfait et accepte le calcaire et les embruns. Menacée en Floride : achetez-la en pépinière, ne la prélevez jamais.",
    givesNote:
      "Des bouquets de fleurs bleu ciel de l'automne au printemps pour les petites abeilles indigènes et les papillons, quand peu d'autres lianes fleurissent.",
    propagationNote:
      "Récoltez la graine quand les capsules papyracées sèchent, entaillez-la ou faites-la tremper, et semez au chaud. Les boutures de pointes tendres s'enracinent aussi. Ne prélevez graines et boutures que sur des plantes de jardin — les pieds sauvages sont protégés.",
  },
  "Centrosema virginianum@florida-south": {
    nativeNote:
      "Un pois sauvage grêle des pinèdes, des flatwoods sableux — ces pinèdes plates du bas pays — et des lisières de hammock du sud de la Floride.",
    careNote:
      "Une liane volubile délicate : laissez-la grimper sur une clôture basse, un arbuste ou de hautes herbes, au soleil ou à mi-ombre légère. Résistante à la sécheresse, à l'aise sur sable pauvre ou sur roche.",
    givesNote:
      "De grandes fleurs de pois lavande pour les abeilles et les papillons, et des feuilles pour les chenilles de l'Urbanus proteus.",
    propagationNote:
      "Cueillez les longues gousses plates quand elles brunissent, avant qu'elles ne se tordent en projetant la graine. Entaillez ou poncez le tégument, faites tremper une nuit, et semez au chaud.",
  },
  "Pentalinon luteum@florida-south": {
    nativeNote:
      "Une liane volubile des lisières de hammock littoral, des pinèdes et des bords de mangrove du sud de la Floride et des Keys.",
    careNote:
      "Palissez-la sur une clôture ou un treillage, ou laissez-la s'étaler en dôme. Tolérante au sel et à la sécheresse une fois installée ; sensible au gel. Le latex est toxique — portez des gants pour la tailler.",
    givesNote:
      "De grandes trompettes jaune vif une bonne partie de l'année, travaillées par les abeilles à longue langue, et des feuilles pour les chenilles de la Syntomeida epilais.",
    propagationNote:
      "Les boutures aoûtées d'été s'enracinent bien dans un mélange léger et humide. Une tige couchée au sol s'enracine aussi. La graine à aigrette soyeuse des longues gousses par paires se sème fraîche et au chaud.",
  },
  "Echites umbellatus@florida-south": {
    nativeNote:
      "Une liane volubile des hammocks littoraux, des pinèdes et des bords de mangrove du sud de la Floride et des Keys.",
    careNote:
      "Elle pousse sur un gros tubercule : elle traverse la sécheresse et repart après une taille sévère ou une gelée. Donnez-lui une clôture ou un arbuste où s'enrouler. Le latex est toxique.",
    givesNote:
      "Des trompettes blanches parfumées pour les papillons de nuit au crépuscule, et des feuilles qui sont la nourriture indigène des chenilles de la Syntomeida epilais.",
    propagationNote:
      "Semez fraîche et au chaud la graine à aigrette soyeuse des longues gousses par paires. Les boutures de tiges aoûtées s'enracinent en été.",
  },
  "Vitis rotundifolia@florida-south": {
    nativeNote:
      "La vigne sauvage des hammocks et des pinèdes du sud de la Floride — ici surtout sa forme à petits fruits, la vigne de Munson.",
    careNote:
      "Donnez-lui une clôture solide ou une tonnelle au soleil, sinon elle grimpera dans l'arbre le plus proche. Elle accepte le calcaire et le sable d'ici. Seuls les pieds femelles fructifient. Le raisin est toxique pour les chiens.",
    givesNote:
      "De petits raisins sombres en été pour les moqueurs, les moqueurs chats, les ratons laveurs et les renards, et des feuilles pour de grandes chenilles de sphinx.",
    propagationNote:
      "Couchez une tige au sol : elle s'enracine en une saison. Les boutures de bois sec reprennent mal ; les boutures tendres d'été sous brumisation réussissent mieux. La graine semée fraîche, sortie de raisins mûrs, lève ici sans passer par le froid.",
    supportNotes: {
      "berry-songbirds":
        "Moqueurs, moqueurs roux et moqueurs chats mangent les raisins qui éclatent sur la vigne.",
      "acorn-mammals":
        "Renards, ratons laveurs, opossums et cerfs se nourrissent des raisins tombés.",
    },
  },
  "Symphyotrichum carolinianum@florida-south": {
    nativeNote:
      "Un aster sarmenteux des bords de marécage, de marais et de canal du sud de la Floride, qui s'appuie sur les arbustes au-dessus du sol humide.",
    careNote:
      "Un aster ligneux et étalé qui s'appuie sur tout ce qui l'entoure : donnez-lui une clôture, un arbuste ou un bord d'étang où grimper, au soleil. Il aime le sol humide. Rabattez-le sévèrement après la floraison pour qu'il reste fourni.",
    givesNote:
      "Les asters sont un groupe clé de voûte, plantes hôtes de nombreuses chenilles. Ici ses fleurs roses parfumées s'ouvrent en hiver, quand monarques, Danaus gilippus et abeilles trouvent peu d'autre chose.",
    propagationNote:
      "Les boutures de pointes tendres s'enracinent vite dans un mélange humide. Les longues tiges qui touchent le sol s'enracinent souvent seules — détachez-les et déplacez-les. La graine est rare et lève de façon irrégulière.",
    supportNotes: {
      "monarch":
        "Il fleurit ici en hiver, quand les monarques sédentaires de Floride n'ont presque rien d'autre à butiner.",
      "queen-butterfly":
        "Les Danaus gilippus se pressent sur ses fleurs parfumées pendant toute la saison sèche.",
    },
  },
  "Phyla nodiflora@florida-south": {
    nativeNote:
      "Indigène dans tout le sud de la Floride et les Keys, au bord des marais, sur les replats côtiers et dans les vieilles pelouses.",
    careNote:
      "Une alternative au gazon qui supporte la tonte, le piétinement, les inondations d'été, la sécheresse de la saison sèche et un peu de sel. Elle s'étend vite par stolons : tenez-la hors des massifs.",
    givesNote:
      "De minuscules fleurs tous les mois de l'année pour les petites abeilles et les papillons, et la nourriture des chenilles du Phyciodes phaon et de l'Anartia jatrophae.",
    propagationNote:
      "Chaque stolon s'enracine là où il touche le sol : coupez un morceau enraciné et replantez-le, en toute saison.",
    supportNotes: {
      "phaon-crescent":
        "La verveine du pays est la nourriture des chenilles du Phyciodes phaon : laissez un coin sans tonte et il le trouvera.",
      "white-peacock":
        "L'une des plantes à chenilles de l'Anartia jatrophae, et elle fleurit chaque mois où le papillon vole ici.",
    },
  },
  "Ernodea littoralis@florida-south": {
    nativeNote:
      "Indigène rampante des dunes, du cordon littoral et des pinèdes sur roche calcaire du sud de la Floride, jusque dans les Keys.",
    careNote:
      "Un couvre-sol arbustif bas et bombé pour le plein soleil, sur sable ou calcaire — à l'épreuve du sel et de la sécheresse. Craint le gel (zone 10+). Pourrit en sol humide ou riche.",
    givesNote:
      "De petites trompettes rosées pour les papillons et les abeilles une bonne partie de l'année, des baies dorées pour les oiseaux, et des tiges qui s'enracinent en rampant et tiennent la dune.",
    propagationNote:
      "Bouturez des extrémités de tiges aoûtées dans un mélange sableux pendant la saison chaude. Les tiges rampantes s'enracinent souvent là où elles touchent le sable : coupez-les et soulevez-les. Les graines des baies dorées mûres se sèment fraîches et au chaud, mais c'est lent.",
  },
  "Sesuvium portulacastrum@florida-south": {
    nativeNote:
      "Plante grasse indigène des plages, des étendues salées et des lisières de mangrove du sud de la Floride.",
    careNote:
      "Un tapis charnu pour l'endroit le plus salé que vous ayez — embruns, inondations de marée, sable nu. Plein soleil. Il ne supporte ni le piétinement ni l'ombre.",
    givesNote:
      "De petites étoiles roses presque toute l'année pour les petites abeilles, et un tapis vivant qui lie le sable de plage là où peu d'autres plantes s'enracinent.",
    propagationNote:
      "Posez un morceau de tige sur du sable humide et il s'enracine en quelques jours — de loin la méthode la plus simple. La minuscule graine lève à la surface d'un sable chaud et humide.",
  },
  "Mimosa strigillosa@florida-south": {
    nativeNote:
      "Couvre-sol indigène bas des pinèdes, des champs et des bords de route, jusque dans le bas de la péninsule.",
    careNote:
      "Un tapis vivant résistant à la sécheresse pour le plein soleil, qui supporte un piétinement léger. Il se plaît surtout sur le sable ; un sol calcaire mince et rocheux lui convient moins. Il s'étend vite par stolons : donnez-lui une bordure.",
    givesNote:
      "Des pompons roses du printemps à l'automne pour les abeilles et les hespéries, de l'azote fixé dans un sol pauvre, et une pelouse qui nourrit les chenilles de la petite coliade.",
    propagationNote:
      "Les stolons s'enracinent en chemin : soulevez un morceau enraciné et mettez-le en pot. La graine a un tégument dur : entaillez-la et faites-la tremper une nuit avant de semer au chaud.",
    supportNotes: {
      "grass-skippers":
        "Les hespéries fauves y descendent sans arrêt — l'une des rares plantes à nectar qui survit au piétinement.",
    },
  },
  "Pontederia cordata@florida-south": {
    nativeNote:
      "Indigène dans les marais et les sloughs des Everglades — ces chenaux d'eau lente du marais — et au bord des canaux et des étangs du sud de la Floride.",
    careNote:
      "Pour un étang, une berge de canal ou une noue humide, jusqu'à trente centimètres d'eau. Elle survit à la baisse des eaux de la saison sèche, mais fleurit mieux gardée dans l'eau. Elle s'étend par de grosses racines en un massif.",
    givesNote:
      "Des épis bleus pour les abeilles et les papillons la plus grande partie de l'année, des graines pour les canards, et un abri pour les grenouilles et les petits poissons.",
    propagationNote:
      "Coupez une touffe en morceaux portant un bourgeon et des racines, et enfoncez-les dans la vase ou dans un pot immergé. Ici, n'importe quel mois chaud convient.",
    supportNotes: {
      "white-peacock":
        "L'Anartia jatrophae butine ses épis la plus grande partie de l'année le long des canaux du sud de la Floride.",
    },
  },
  "Sagittaria lancifolia@florida-south": {
    nativeNote:
      "Indigène dans les marais, les sloughs et les marécages à cyprès chauves des Everglades et au bord des canaux, jusqu'en eau saumâtre.",
    careNote:
      "Pour l'eau peu profonde ou la vase d'un étang, d'un canal ou du creux d'un jardin de pluie, au soleil ou à mi-ombre. Elle s'étend par rhizomes en un massif : laissez-lui de la place.",
    givesNote:
      "De hauts épis de fleurs blanches à trois pétales pour les abeilles, des graines pour les canards et les oiseaux des marais, et des racines qui tiennent une berge boueuse.",
    propagationNote:
      "Détachez un morceau enraciné de la touffe et plantez-le dans la vase ou dans un pot immergé. La graine semée sur de la vase mouillée par temps chaud lève aussi, mais la division va plus vite.",
  },
  "Crinum americanum@florida-south": {
    nativeNote:
      "Indigène dans les marais des Everglades, les marécages à cyprès chauves et les lisières humides de hammock — ces îlots de forêt dense — dans tout le sud de la Floride.",
    careNote:
      "Pour un sol mouillé ou une eau peu profonde, au soleil ou à mi-ombre ; il pousse aussi dans un massif ordinaire si on l'arrose. Il forme lentement une touffe à partir de ses bulbes. Toutes ses parties sont toxiques si on les avale.",
    givesNote:
      "Des fleurs blanches parfumées, en araignée, qui s'ouvrent au crépuscule pour les sphinx, et la nourriture des chenilles de la Xanthopastis, la « noctuelle espagnole ».",
    propagationNote:
      "Soulevez une touffe et détachez les bulbes latéraux avec leurs racines. Les grosses graines charnues germent d'elles-mêmes : pressez-les fraîches sur un sol humide, sans les enterrer. Portez des gants ; les bulbes sont toxiques.",
  },
  "Coreopsis leavenworthii@florida-south": {
    nativeNote:
      "Le coréopsis propre à la Floride, sauvage dans les prairies humides, les pinèdes, les fossés et les bords de route du sud de la Floride ; les Coreopsis sont la fleur emblème de l'État.",
    careNote:
      "Elle vit peu : traitez-la comme une fleur sauvage qui se ressème — laissez-la grener dans un coin ensoleillé, frais à moyen, et elle continue. Ici, elle fleurit tous les mois, surtout au printemps.",
    givesNote:
      "Des marguerites jaunes presque toute l'année nourrissent les petites abeilles indigènes, les syrphes et les papillons, et les oiseaux granivores prennent la graine.",
    propagationNote:
      "Cultivez-la de semis et laissez-la se ressemer pour la garder. Pressez la graine fine à la surface du sol sans l'enterrer, puisqu'il lui faut de la lumière pour lever, et tenez-la humide. Dans le sud sans gel, on peut semer en tout mois, mais l'automne et l'hiver sont le plus faciles.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Le groupe de la fleur emblème de la Floride — son pollen nourrit les abeilles spécialistes des astéracées, ici presque toute l'année.",
    },
  },
  "Asclepias incarnata@florida-south": {
    nativeNote:
      "Asclépiade indigène des marais, des prairies humides et des bords de fossé du sud de la Floride.",
    careNote:
      "Elle demande une humidité régulière — bord d'étang, jardin de pluie ou point bas humide — et ne supporte pas un été sec. Souvent de courte vie dans le sud : laissez-la grener. Sa sève est toxique si on l'avale. Plantez-la à la place de l'asclépiade tropicale, qui n'est pas indigène.",
    givesNote:
      "Une plante hôte des chenilles du monarque et du Danaus gilippus, son cousin, dont les fleurs roses parfumées attirent abeilles et papillons tout au long des mois chauds.",
    propagationNote:
      "Récoltez la graine dans les gousses ouvertes et donnez-lui quelques semaines de froid humide au réfrigérateur avant de semer, puisqu'un hiver du sud de la Floride ne s'en charge pas. Elle accepte aussi la division : soulevez et séparez une touffe au départ de la nouvelle pousse.",
    supportNotes: {
      monarch:
        "Une asclépiade des sols humides, plante hôte du monarque ; dans le sud de la Floride, des monarques se reproduisent toute l'année.",
      "queen-butterfly":
        "Les chenilles du Danaus gilippus, le cousin du monarque, ne mangent elles aussi que des asclépiades.",
    },
  },
  "Solidago stricta@florida-south": {
    nativeNote:
      "Verge d'or élancée des pinèdes humides, des flatwoods — ces plaines de pins clairsemés sur sol sableux et plat — des bords de marais et des dépressions littorales du sud de la Floride.",
    careNote:
      "Une verge d'or étroite et dressée : une rosette plate presque toute l'année, puis une haute baguette jaune à l'automne. Elle prend un sol humide ou moyen et un peu de sel, et ne s'étend que lentement. Elle ne donne pas le rhume des foins — c'est l'ambroisie.",
    givesNote:
      "Une espèce clé : les verges d'or nourrissent plus d'une centaine d'espèces de chenilles, et leurs fleurs d'automne nourrissent abeilles, guêpes et papillons quand presque rien d'autre ne fleurit.",
    propagationNote:
      "Le plus simple est la division : soulevez une touffe en fin d'hiver et détachez des rosettes enracinées. De semis, récoltez les têtes duveteuses au début de l'hiver et éparpillez la graine à la surface d'un sol humide.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Les verges d'or portent plus d'abeilles spécialistes de leur pollen que presque toute autre plante.",
      monarch:
        "Un nectar d'automne de premier ordre pour les monarques qui passent l'hiver dans le sud de la Floride.",
    },
  },
  "Ruellia caroliniensis@florida-south": {
    nativeNote:
      "Petite fleur sauvage des pinèdes, des lisières de hammock — ces îlots de forêt dense — et des bois clairs du sud de la Floride.",
    careNote:
      "Petite et facile, au soleil ou à mi-ombre, elle fleurit tous les mois et se ressème avec modération. Ne la confondez pas avec le Ruellia simplex, plus haut, qui lui ressemble et envahit les zones humides.",
    givesNote:
      "Des trompettes lavande pour les abeilles et les petits papillons, et un feuillage qui nourrit les chenilles du Junonia coenia, du Siproeta stelenes et de l'Anartia jatrophae.",
    propagationNote:
      "Elle se sème toute seule : les capsules mûres éclatent et projettent la graine autour de la plante, il suffit d'empoter les semis. Vous pouvez aussi semer la graine au chaud, diviser une touffe ou bouturer une tige tendre.",
    supportNotes: {
      "white-peacock":
        "Le Ruellia caroliniensis est l'une des plantes hôtes de l'Anartia jatrophae.",
    },
  },
  "Liatris gracilis@florida-south": {
    nativeNote:
      "Un liatris indigène des pinèdes sur roche calcaire, des flatwoods et des clairières sableuses sèches du sud de la Floride.",
    careNote:
      "Plein soleil et drainage parfait — sable ou calcaire — et aucune eau une fois installé ; il pourrit en sol riche et humide. Ses baguettes pourpres s'ouvrent du haut vers le bas à l'automne, un peu plus tard que dans le nord.",
    givesNote:
      "Une plante à nectar d'automne de premier ordre : ses épis se couvrent de papillons, dont les monarques qui passent l'hiver ici, et d'abeilles indigènes.",
    propagationNote:
      "Semez à l'automne, après quelques semaines de froid humide au réfrigérateur, ce qui améliore la levée. Les pieds installés font de petits cormes souterrains qu'on peut soulever et séparer en hiver.",
    supportNotes: {
      monarch:
        "Ses épis pourpres sont un nectar d'automne de premier ordre pour les monarques qui hivernent dans le sud de la Floride.",
      "sunflower-specialist-bees":
        "Une fleur d'astéracée qui nourrit les abeilles spécialistes.",
    },
  },
  "Melanthera nivea@florida-south": {
    nativeNote:
      "Fleur sauvage commune des pinèdes, des lisières de hammock et des terrains ensoleillés remués du sud de la Floride.",
    careNote:
      "Facile et rapide au soleil ou à mi-ombre, sur sable ou calcaire, avec des tiges carrées et des fleurs blanches en boutons tous les mois. Elle devient lâche et penche : rabattez-la sévèrement une ou deux fois par an.",
    givesNote:
      "L'une des plantes à nectar les plus fréquentées par les papillons du sud de la Floride — hespéries, thècles, coliades et Heliconius s'y succèdent — et une source régulière de pollen pour les abeilles indigènes.",
    propagationNote:
      "Les boutures de tiges tendres s'enracinent vite en terreau humide, et les tiges qui se couchent s'enracinent souvent là où elles touchent le sol. Elle vient aussi facilement de semis au chaud, et se ressème un peu.",
    supportNotes: {
      "zebra-longwing":
        "Ses fleurs blanches, ouvertes toute l'année, sont parmi les nectars favoris de l'Heliconius charithonia.",
    },
  },
};
