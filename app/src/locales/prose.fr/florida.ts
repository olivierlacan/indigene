// Florida — both lists in one file, because the two regions share nine taxa and
// keeping a live oak's two paragraphs side by side is how you notice they say
// different things.
//
// North & central Florida holds the plain keys; south Florida and the Keys hold
// its own twelve taxa plus a region-qualified entry (`"Latin@florida-south"`) for
// each of the nine it shares. Red maple and butterfly weed belong to the
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
      "Donnez-lui de la vraie place — sa couronne s'étale bien plus large que haute, et un chêne de Virginie adulte est un voisin pour la vie. Ferme au vent et à l'épreuve de la sécheresse une fois installé ; l'un des arbres d'ombre les plus résistants aux ouragans.",
    givesNote:
      "Le meilleur arbre pour la faune de Floride : des centaines d'espèces de chenilles, des glands pour les geais, les pics, les dindons sauvages et les écureuils, un abri persistant, et des branches qui deviennent des jardins de fougère de résurrection, de broméliacées et de mousse espagnole.",
    propagationNote:
      "Ramassez les glands frais à l'automne et semez-les aussitôt — un gland de chêne de Virginie veut germer immédiatement et n'a aucun besoin de passer par le froid. Mettez-les dans l'eau et jetez ceux qui flottent, gardez ceux qui coulent, et ne les laissez jamais sécher. Il descend tôt une racine pivotante profonde : démarrez-le là où il restera.",
    supportNotes: {
      "acorn-birds":
        "Les glands du chêne de Virginie nourrissent geais, dindons sauvages, pics et canards hivernants.",
      "acorn-mammals":
        "Un arbre à glands de première importance pour les écureuils, les chevreuils et d'autres mammifères.",
    },
  },
  "Pinus palustris": {
    nativeNote:
      "Le pin clé de voûte des collines sableuses et des flatwoods à pin des marais — ces pinèdes plates du bas pays — un milieu menacé qui couvrait autrefois une grande partie de la Floride.",
    careNote:
      "Il passe ses premières années au ras du sol, en « stade herbe », avant de partir en flèche — c'est normal, ce n'est pas un plant rabougri. Il veut un sol sableux, bien drainé, et le plein soleil ; il est adapté au feu. Très résistant à la sécheresse et au vent une fois installé.",
    givesNote:
      "La fondation de l'écosystème à pin des marais : des graines et un couvert pour les oiseaux et les tortues gaufrées, des centaines de chenilles sur les pins, et un houppier ouvert et ensoleillé qui laisse prospérer un couvre-sol d'une grande diversité en dessous.",
    propagationNote:
      "Récoltez la graine des cônes mûrs à l'automne et semez-la fraîche la même saison — elle lève rapidement et n'a besoin d'aucun froid. La graine ne se conserve pas : ne la laissez pas sécher au fond d'un tiroir tout l'hiver.",
  },
  "Taxodium distichum": {
    nativeNote:
      "Le conifère à feuilles caduques classique des marécages, des berges et des bords d'étang de Floride.",
    careNote:
      "La réponse à un emplacement humide, inondable ou au bord d'un étang — il prospère les pieds dans l'eau et y pousse des « genoux » — mais il se porte aussi très bien dans un jardin ordinaire une fois installé. Il demande un peu d'eau le temps de démarrer sur un site sec.",
    givesNote:
      "Un superbe arbre pour les eaux de pluie et les berges : il absorbe les crues, tient un sol détrempé, abrite les échassiers et les anhingas, et vit des siècles.",
    propagationNote:
      "Ramassez les cônes ronds à l'automne et émiettez-les pour libérer la graine. Semez-la fraîche sur une terre mouillée ou dans la vase — un bon trempage préalable aide — et maintenez-la constamment humide. Aucun passage au froid n'est nécessaire.",
  },
  "Magnolia grandiflora": {
    nativeNote:
      "Le feuillu persistant des hammocks et des coteaux du nord et du centre de la Floride.",
    careNote:
      "Persistant et résistant à la sécheresse une fois installé. Il perd des feuilles toute l'année : il est donc plus heureux avec la place de garder sa jupe de branches basses que remonté au-dessus d'une pelouse.",
    givesNote:
      "D'énormes fleurs au parfum de citron pollinisées par les coléoptères et les abeilles, des graines rouges que mangent oiseaux et écureuils, et un couvert persistant dense avec des sites de nidification.",
    propagationNote:
      "Quand les cônes s'ouvrent à l'automne, prélevez les graines et frottez-en l'enveloppe rouge charnue (un trempage la ramollit) — cette enveloppe empêche la germination. Semez frais et ne laissez jamais sécher ; un court passage frais et humide pendant l'hiver les aide à se réveiller au printemps.",
  },
  "Sabal palmetto": {
    nativeNote:
      "L'arbre emblème de l'État de Floride ; indigène partout, des hammocks aux bords de marais littoraux.",
    careNote:
      "Quasi indestructible — il encaisse le sel, la sécheresse, les crues, les sols sableux comme lourds, et du plein soleil à la mi-ombre, et c'est l'un des arbres les plus résistants aux ouragans qui soient. Lent à prendre de la hauteur de tronc. Laissez en place les vieilles bases de feuilles, les « bottes », pour la faune.",
    givesNote:
      "Ses panicules de fleurs d'été grouillent d'abeilles ; ses fruits noirs nourrissent merles d'Amérique, moqueurs, ratons laveurs et bien d'autres ; et sa couronne et son tronc couvert de bottes abritent chauves-souris, grenouilles et oiseaux nicheurs.",
    propagationNote:
      "Le Sabal palmetto ne se multiplie que par semis — un palmier ne se divise pas et ne se bouture pas. Récoltez les fruits noirs à maturité, pressez et lavez la pulpe pour dégager la graine, et semez-la fraîche, au chaud et à l'humide. Soyez patient : il est lent à lever et lent à pousser.",
    lookalikeNotes: {
      "washingtonia-robusta": {
        why: "Deux palmiers en éventail dans la même rue — et le grand mince de la carte postale n'est pas l'arbre emblème de la Floride.",
        tells: [
          { feature: "L'éventail", native: "Le pétiole se prolonge dans l'éventail et le courbe : la feuille se plie comme un taco.", lookalike: "Le pétiole s'arrête là où l'éventail commence ; la feuille est plate." },
          { feature: "Filaments", native: "De fins filaments pendent entre les segments de la feuille.", lookalike: "Aucun filament." },
          { feature: "Bord du pétiole", native: "Lisse — sans dents.", lookalike: "Bordé d'épines orange recourbées." },
          { feature: "Tronc", native: "Épais et gris, portant souvent encore les vieilles bases de feuilles croisées.", lookalike: "Mince, très haut et droit, en général avec une jupe de palmes brunes mortes." },
        ],
      },
    },
  },
  "Chionanthus virginicus": {
    nativeNote:
      "Petit arbre indigène à floraison des lisières boisées du nord et du centre de la Floride.",
    careNote:
      "Un petit arbre facile pour une exposition mi-ombragée et une humidité moyenne — une bonne alternative indigène aux ornementaux exotiques. Un peu d'eau pendant les périodes sèches le temps qu'il s'installe.",
    givesNote:
      "Des nuages de fleurs blanches parfumées, en fines franges, au printemps pour les abeilles ; les pieds femelles portent des fruits bleus que les oiseaux dépouillent rapidement.",
    propagationNote:
      "Celui-là met votre patience à l'épreuve. Débarrassez les fruits bleus de leur pulpe et semez la graine, mais attendez-vous à ce qu'elle attende deux saisons — il lui faut une période chaude puis une période fraîche avant que la racine et la tige ne viennent, ce qui peut prendre un an et demi ou plus. Semez et oubliez, et ne renoncez pas trop tôt.",
  },

  // -------------------------------------------------------------------------
  // Floride du Nord et du Centre — arbustes.
  // -------------------------------------------------------------------------
  "Serenoa repens": {
    nativeNote:
      "Le palmier de sous-bois qui définit le scrub — cette broussaille sableuse basse — les flatwoods et les lisières de hammock de Floride : l'une des plantes les plus importantes de l'État pour la faune.",
    careNote:
      "À peu près aussi robuste qu'une plante de Floride peut l'être — à l'épreuve de la sécheresse, du feu, du sel et des ouragans, extrêmement longévif, et heureux au soleil comme à l'ombre. Très lent, et difficile à transplanter une fois installé : partez d'un petit plant et choisissez sa place pour de bon. Les pétioles portent de fines dents (d'où le « saw » de son nom anglais).",
    givesNote:
      "L'une des meilleures plantes de Floride pour la faune : ses fleurs précoces sont une source de nectar de premier ordre (le fameux miel de palmetto), ses fruits nourrissent ours, tortues gaufrées, oiseaux et bien d'autres, et ses touffes denses abritent d'innombrables petits animaux.",
    propagationNote:
      "Le Serenoa repens ne se multiplie que par semis — il ne se divise pas et ne se bouture pas. Lavez la pulpe des fruits mûrs et semez la graine fraîche et au chaud. Sachez qu'il est réputé lent : des mois pour lever et des années pour faire une plante, alors achetez-en un petit si vous ne pouvez pas attendre.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits d'automne du Serenoa repens sont mangés par de nombreux oiseaux ; ses fleurs de printemps sont une source de nectar et de miel légendaire.",
      "gopher-tortoise":
        "Le scrub à Serenoa repens est l'habitat central de la tortue gaufrée, et les baies font partie de son régime.",
    },
  },
  "Callicarpa americana": {
    nativeNote:
      "Arbuste indigène commun des lisières boisées et des clairières de Floride.",
    careNote:
      "Rapide, facile et résistant à la sécheresse, au soleil ou à mi-ombre ; il se ressème souvent alentour. Rabattez-le sévèrement en fin d'hiver pour une silhouette plus pleine.",
    givesNote:
      "Des fleurs d'été pour les pollinisateurs, puis les spectaculaires grappes de baies magenta que moqueurs, cardinaux et des dizaines d'oiseaux (et les ratons laveurs) dévorent à l'automne.",
    propagationNote:
      "À peu près aussi facile qu'une indigène puisse l'être. Écrasez les baies magenta mûres, rincez-en les graines, et semez-les au chaud — elles ne demandent presque rien. Ou coupez au printemps ou en été quelques pousses vertes tendres : elles s'enracinent vite.",
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
      "Indigène (var. patens) des lisières de hammock du centre et du sud de la Floride — achetez la vraie indigène, pas les formes exotiques « dwarf » ou « compact ».",
    careNote:
      "Elle aime la chaleur, le soleil et un sol sec à moyen, et fleurit presque toute l'année dans les zones sans gel. Au nord de la zone 9b environ, elle disparaît au gel et repart des racines — traitez-la là comme une grande vivace. Exigez la vraie espèce indigène.",
    givesNote:
      "Une usine à nectar sans arrêt : ses fleurs tubulaires rouge-orangé nourrissent les colibris, les Heliconius charithonia, les Agraulis vanillae et les coliades du printemps à l'automne, et ses baies sombres nourrissent les oiseaux.",
    propagationNote:
      "La voie la plus simple est la bouture — coupez pendant les mois chauds une pousse tendre ou tout juste aoûtée et elle s'enracine volontiers. Vous pouvez aussi presser la graine des baies sombres mûres et la semer au chaud. Prenez vos boutures sur un pied dont vous savez qu'il est la vraie indigène, pas un « dwarf firebush » de pépinière.",
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
          { feature: "Port", native: "Grande et lâche — elle veut devenir un petit arbre.", lookalike: "Basse, dense et nette ; souvent étiquetée « dwarf firebush »." },
          { feature: "Ce qu'elle apporte", native: "La plante sur laquelle sont recensés les Heliconius charithonia, le sphinx Xylophanes pluto et les colibris de Floride.", lookalike: "Du nectar — mais pas ces observations." },
        ],
      },
    },
  },
  "Ilex vomitoria": {
    nativeNote:
      "Un houx indigène adaptable des bois, des lisières et des stations littorales de Floride.",
    careNote:
      "Extrêmement robuste — il prend le soleil comme l'ombre, l'humide comme le sec, le sel et les sols pauvres — et il se taille bien en haie indigène. Seuls les pieds femelles fructifient : prévoyez-en un. (Ses feuilles sont la seule source indigène de caféine d'Amérique du Nord, infusée sous le nom de « yaupon ».)",
    givesNote:
      "Des fleurs printanières pour les abeilles, puis de lourdes récoltes de baies rouges translucides dont jaseurs d'Amérique, merles d'Amérique, moqueurs et merlebleus se nourrissent tout l'hiver ; un couvert dense pour nicher.",
    propagationNote:
      "Les boutures sont de loin la voie la plus facile — prélevez des pousses en voie d'aoûtement en fin d'été et faites-les raciner : vous saurez ainsi si vous avez une femelle porteuse de baies. Le semis marche aussi mais il est très lent, restant souvent un an ou plus avant de lever. N'oubliez pas qu'il faut un mâle à proximité pour qu'une femelle fructifie.",
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
      "Adaptable et facile du soleil à la mi-ombre ; quasi persistante en Floride, elle se taille bien en haie ou en petit arbre. Elle tolère un terrain frais.",
    givesNote:
      "Une poussée de minuscules fleurs blanches très tôt dans l'année nourrit les abeilles et les papillons qui émergent, ses fruits nourrissent les oiseaux, et elle héberge de nombreuses chenilles.",
    propagationNote:
      "Le plus facile par bouture — prélevez au début de l'été une pousse tout juste aoûtée et faites-la raciner. Le semis est possible à partir des fruits noirs nettoyés mais il est lent et capricieux : la plupart des jardiniers s'en tiennent aux boutures.",
    supportNotes: {
      "berry-songbirds":
        "Ses petites drupes sombres nourrissent les passereaux ; ses fleurs précoces nourrissent les pollinisateurs.",
    },
  },
  "Myrcianthes fragrans": {
    nativeNote:
      "Arbuste persistant aromatique des hammocks et des bois littoraux du centre et du sud de la Floride.",
    careNote:
      "Un persistant robuste, tolérant au sel et à la sécheresse, pour le soleil ou la mi-ombre — excellent en sujet isolé, en haie ou en petit arbre à plusieurs troncs. Sensible au gel : c'est une plante du centre et du sud de la Floride. Écorce cannelle qui s'exfolie et feuillage parfumé.",
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
      "Fleur sauvage indigène des lisières de hammock et des sols remaniés de Floride ; elle fleurit presque toute l'année.",
    careNote:
      "Facile, résistante à la sécheresse et se ressemant seule — une vivace de courte vie qui s'entretient par la graine : laissez-en donc quelques-unes monter. Rabattez les pieds dégingandés pour les rafraîchir. Du soleil à l'ombre légère.",
    givesNote:
      "Ses fleurs rouges, presque toute l'année, nourrissent les colibris et les papillons et sont une préférée des bourdons ; une valeur sûre en nectar, sans souci.",
    propagationNote:
      "L'une des fleurs sauvages les plus simples à cultiver — répandez la graine sur une terre chaude et elle lève sans peine, puis se ressème dans tout le jardin dès qu'elle est heureuse. Une pousse tendre coupée et plantée en terre s'enracine aussi en un rien de temps.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "Ses fleurs tubulaires écarlates fleurissent presque toute l'année en Floride — un carburant à colibris fiable.",
    },
  },
  "Coreopsis leavenworthii": {
    nativeNote:
      "Un coréopsis à tendance endémique de Floride, des flatwoods frais, des fossés et des bords de route ; les Coreopsis sont la fleur emblème de l'État.",
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
      "L'une des meilleures plantes à nectar d'automne de Floride : ses épis pourpres sont couverts de papillons (dont les monarques en migration) et d'abeilles indigènes, et les fringilles prennent la graine.",
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
      "Elle prospère sur un terrain chaud, sec et sableux en plein soleil. Vivace de courte vie qui se ressème pour persister ; donnez-lui une bonne circulation d'air. Ce sont ses bractées roses étagées qui font le spectacle, pas les petites fleurs.",
    givesNote:
      "Une plante à pollinisateurs exceptionnelle — ses fleurs mouchetées inhabituelles et ses bractées roses attirent une gamme énorme d'abeilles indigènes, de guêpes et de papillons sur un sol pauvre et sec où presque rien d'autre ne fleurit.",
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
      "Robuste, à l'épreuve du sel et de la sécheresse, et la plus heureuse en plein soleil sur un sol bien drainé — elle ne demande ni eau, ni tonte, ni engrais une fois installée. Rabattez-la une fois en fin d'hiver.",
    givesNote:
      "Des nuages aériens de panicules roses à l'automne, des graines et un couvert pour les petits oiseaux, et des racines denses qui tiennent un sol sableux ou en train de s'éroder ; elle abrite les abeilles nichant au sol et héberge des hespéries.",
    propagationNote:
      "Une graminée de saison chaude — semez la graine sur une terre chaude au printemps ou en été et elle lève sans aucun froid. Le moyen le plus rapide d'en avoir plus est de déterrer une touffe installée au printemps et de la séparer en éclats enracinés.",
  },
  "Tripsacum dactyloides": {
    nativeNote:
      "Grande graminée indigène en touffe des bords de marais, des fossés et des prairies humides de Floride.",
    careNote:
      "Une grosse touffe arquée et quasi persistante qui accepte le soleil ou la mi-ombre et un sol humide ou moyen — excellente au bord d'un étang, d'un fossé ou dans un jardin de pluie. Donnez-lui de la place ; rabattez-la en fin d'hiver.",
    givesNote:
      "Une robuste plante de couverture et d'anti-érosion : elle cuirasse les bords humides qui s'érodent, abrite et nourrit les oiseaux et la petite faune, et héberge des hespéries.",
    propagationNote:
      "Encore une graminée de saison chaude — semez la grosse graine sur une terre chaude au printemps et elle germe sans froid. Comme elle fait de très grosses touffes, diviser un pied installé au printemps est la voie rapide et fiable pour en avoir plus.",
  },
  "Passiflora incarnata": {
    nativeNote:
      "Liane indigène grimpante et rampante des champs, des bords de clôture et des sols remaniés de Floride.",
    careNote:
      "Vigoureuse et rapide — donnez-lui une clôture, un treillage ou de la place où courir, et attendez-vous à ce qu'elle file et drageonne depuis les racines (supprimez les rejets). Elle disparaît en hiver au nord de l'État et repart. Robuste et résistante à la sécheresse.",
    givesNote:
      "La plante nourricière de l'Agraulis vanillae et de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia ; ses fleurs pourpres extraordinaires nourrissent les xylocopes et les bourdons, et son fruit, le « maypop », nourrit la faune.",
    propagationNote:
      "La graine dure lève bien mieux si vous entaillez ou grattez le tégument et la faites tremper une nuit avant de semer au chaud. Plus simple encore : cette liane court sous terre et fait surgir de nouveaux rejets enracinés à côté — déterrez-en un et déplacez-le. Les boutures tendres prennent aussi pendant les mois chauds.",
    supportNotes: {
      "gulf-fritillary":
        "La passiflore est la plante nourricière de l'Agraulis vanillae.",
      "zebra-longwing":
        "La liane hôte du papillon emblème de la Floride, l'Heliconius charithonia.",
    },
  },
  "Mimosa strigillosa": {
    nativeNote:
      "Couvre-sol indigène bas des bords de route, des champs et des terrains ouverts de Floride — une alternative indigène au gazon.",
    careNote:
      "Un tapis vivant robuste, rapide et à l'épreuve de la sécheresse pour le plein soleil, qui supporte un piétinement léger et ne demande presque aucune tonte — un excellent remplacement de pelouse. Il s'étend vigoureusement par stolons : donnez-lui de la place ou une bordure. Ses feuilles se replient quand on les touche.",
    givesNote:
      "Il fixe son propre azote, retient le sol contre l'érosion, et se couvre de fleurs roses en pompons qui nourrissent les abeilles et hébergent les petites coliades et les hespéries — une pelouse qui travaille vraiment pour la faune.",
    propagationNote:
      "Étant une légumineuse, sa graine a un tégument dur — entaillez-la ou grattez-la et faites-la tremper une nuit avant de semer au chaud, elle lèvera bien mieux. Plus simple encore : ce tapis s'étend par des stolons qui s'enracinent en chemin, vous pouvez donc soulever et mettre en pot les morceaux enracinés.",
  },
  "Helianthus debilis": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses de Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés, secs : il lui faut le plein soleil et un drainage franc, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le rafraîchir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les fringilles, et son tapis rampant tient la dune et les sols sableux contre l'érosion ; il héberge la belle-dame et d'autres chenilles.",
    propagationNote:
      "Enfantin de semis — pressez la graine sur une terre chaude et sableuse sans l'enterrer, puisqu'elle veut de la lumière, et elle se ressèmera librement ensuite. Les boutures de pousses tendres s'enracinent aussi vite si vous voulez un carré immédiat.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Un vrai tournesol — une source de pollen clé de voûte pour les abeilles spécialistes des astéracées.",
      "gopher-tortoise":
        "Une plante basse des terrains ouverts et sableux que les tortues gaufrées broutent et où elles creusent.",
    },
  },

  // -------------------------------------------------------------------------
  // Les taxa dont la clé simple appartient à la liste du Mid-Atlantic : ici,
  // leur fiche floridienne.
  // -------------------------------------------------------------------------
  "Acer rubrum@florida-central": {
    nativeNote:
      "Indigène dans toute la Floride, dans les marécages, les plaines inondables et les bois frais — l'érable le plus répandu de l'État.",
    careNote:
      "Rapide et adaptable ; il adore les terrains frais et tolère les pieds mouillés, ce qui en fait l'arbre idéal d'un point bas et humide. Arrosez-le le temps qu'il s'installe sur un site plus sec.",
    givesNote:
      "Ses fleurs rouges s'ouvrent au cœur de l'hiver floridien — le premier nectar et le premier pollen de l'année — ses graines nourrissent les oiseaux, et il héberge des centaines de chenilles.",
    propagationNote:
      "Ses petites graines ailées en « hélicoptère » mûrissent au printemps — attrapez-les quand elles brunissent et semez-les aussitôt. L'érable rouge est le facile : sa graine de printemps lève en quelques jours dans une terre chaude, sans aucun froid nécessaire.",
  },
  "Asclepias tuberosa@florida-central": {
    nativeNote:
      "Asclépiade indigène des collines sableuses bien drainées et des bords de route de Floride — une alternative indigène à l'asclépiade tropicale exotique vendue en magasin.",
    careNote:
      "Elle veut le plein soleil et un drainage franc (une terre sableuse) et supporte mal les pieds mouillés comme d'être déplacée — une racine pivotante profonde la met à l'épreuve de la sécheresse mais la rend définitive : plantez-la pour qu'elle reste. Lente à sortir au printemps. Sa sève est toxique si on l'avale. Préférez-la à l'asclépiade tropicale exotique, qui perturbe la migration des monarques en Floride.",
    givesNote:
      "Une plante nourricière des chenilles du monarque et du Danaus gilippus, et un aimant pour tous les papillons et toutes les abeilles indigènes, sur un pied net et bien élevé.",
    propagationNote:
      "Partez de la graine — sa racine pivotante profonde supporte mal d'être déterrée ou divisée, n'essayez donc pas de la diviser. Semez à l'automne, ou donnez à la graine quelques semaines de froid humide au réfrigérateur avant un semis de printemps, et plantez les jeunes plants là où ils resteront pour de bon.",
    supportNotes: {
      monarch:
        "Une asclépiade et une plante hôte du monarque ; la Floride se trouve sur la voie de migration et d'hivernage du monarque.",
      "queen-butterfly":
        "Les asclépiades sont aussi la seule nourriture des chenilles du cousin du monarque, le Danaus gilippus.",
    },
    lookalikeNotes: {
      "asclepias-curassavica": {
        why: "Toutes deux sont des asclépiades orange vendues pour les monarques — mais dans un hiver floridien, une seule des deux disparaît.",
        tells: [
          { feature: "Couleur de la fleur", native: "Un orange uni, parfois tirant sur le jaune.", lookalike: "Deux tons : des pétales extérieurs rouges autour d'une couronne jaune-orangé." },
          { feature: "Cassez une tige", native: "Une sève claire et aqueuse — la seule asclépiade qui ne saigne pas blanc.", lookalike: "Un latex blanc épais." },
          { feature: "En hiver", native: "Elle disparaît au ras du sol et se repose.", lookalike: "Elle ne s'arrête jamais. Les spores du parasite OE s'accumulent sur des feuilles qui ne tombent jamais, et les monarques restent se reproduire au lieu de migrer." },
          { feature: "Si vous l'avez déjà", native: "Rien à faire.", lookalike: "Rabattez-la au sol chaque automne, ou remplacez-la par une asclépiade indigène." },
        ],
      },
    },
  },

  // -------------------------------------------------------------------------
  // Floride du Sud et les Keys — les espèces qui n'appartiennent qu'ici.
  // -------------------------------------------------------------------------
  "Bursera simaruba": {
    nativeNote:
      "L'arbre emblématique des hammocks du sud de la Floride, à l'écorce rouge qui pèle (l'« arbre du touriste »).",
    careNote:
      "Rapide, tolérant à la sécheresse et au sel, et réputé ferme au vent — il perd des branches plutôt que de basculer dans les tempêtes, et même de grosses branches coupées s'enracinent en poteaux de clôture vivants. Strictement hors gel (zone 10+) ; une forte gelée le tue en partie.",
    givesNote:
      "Des fruits rouges que les oiseaux migrateurs et sédentaires dépouillent rapidement, l'ombre du hammock et une résistance aux ouragans, et le rôle de plante nourricière de l'Eunica monima.",
    propagationNote:
      "C'est le fameux arbre à « clôture vivante » : coupez une branche de bonne taille, même grosse comme un bras, plantez-la debout en terre pendant la saison chaude, et elle s'enracine en un arbre entier — la façon la plus facile d'en avoir un. Vous pouvez aussi débarrasser les fruits mûrs de leur pulpe et semer la graine fraîche et au chaud.",
  },
  "Coccoloba uvifera": {
    nativeNote:
      "Arbre-arbuste littoral emblématique des plages et des dunes du sud de la Floride.",
    careNote:
      "Fait pour le littoral le plus rude — battu de sel, sableux, ensoleillé — et suprêmement tolérant au sel et à la sécheresse. Sensible au gel (zone 10+). Taillez-le en arbre ou gardez-le en écran ; notez qu'il est protégé par la réglementation sur les dunes littorales dans beaucoup d'endroits.",
    givesNote:
      "De grandes feuilles rondes et coriaces qui cuirassent une dune contre l'érosion, des fruits pourpres en grappes de raisin pour les oiseaux (et pour la gelée), et du nectar pour les abeilles.",
    propagationNote:
      "Cueillez les « raisins » pourpres mûrs, pressez et lavez la pulpe autour de l'unique graine intérieure, et semez-la fraîche et au chaud sans la laisser sécher. Le raisinier est dioïque — pieds mâles et femelles séparés — si vous voulez des fruits il vous faudra donc une femelle (et un mâle à proximité pour la polliniser).",
    supportNotes: {
      "berry-songbirds":
        "Les fruits pourpres mûrs du raisinier sont mangés par les moqueurs et d'autres oiseaux du littoral (et par les gens).",
    },
  },
  "Coccoloba diversifolia": {
    nativeNote:
      "Arbre dressé des hammocks du sud de la Floride et des Keys — le cousin de l'intérieur du raisinier bord de mer.",
    careNote:
      "Un persistant net, tolérant au sel et à la sécheresse, pour l'ombre ou l'alignement de rue une fois installé. Zones sans gel seulement (zone 10+). Les pieds femelles portent les fruits.",
    givesNote:
      "Des fruits rouge-pourpre sombre dont se nourrissent les pigeons, les moqueurs et d'autres oiseaux, plus un couvert de hammock persistant et dense et une écorce lisse et marbrée.",
    propagationNote:
      "Récoltez les fruits rouge-pourpre sombre sur un pied femelle, lavez la pulpe autour de la graine, et semez-la fraîche et au chaud — ne la laissez pas sécher d'abord. Comme son cousin le raisinier, il a des pieds mâles et femelles séparés : seules les femelles fructifient.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits sombres du Coccoloba diversifolia sont l'un des favoris du pigeon à couronne blanche et des autres oiseaux frugivores.",
    },
  },
  "Conocarpus erectus": {
    nativeNote:
      "Arbre littoral des rivages du sud de la Floride, compagnon des palétuviers.",
    careNote:
      "Exceptionnellement tolérant au sel, à la sécheresse et au vent — un choix de premier ordre pour un emplacement littoral difficile, en arbre, en haie ou en écran. Hors gel (zone 10+). (Le « buttonwood argenté » exotique est une variété de cette espèce ; c'est la forme sauvage verte qui a la plus grande valeur pour la faune.)",
    givesNote:
      "Des capitules en boutons et un couvert dense pour les oiseaux et les pollinisateurs du littoral, avec des racines qui cuirassent un rivage contre l'érosion.",
    propagationNote:
      "Récoltez les petits capitules en bouton à maturité, émiettez-les, et semez la graine fraîche et au chaud. Vous pouvez aussi faire raciner des boutures semi-ligneuses — des morceaux de tige qui commencent tout juste à s'aoûter — prises pendant la saison chaude de croissance.",
  },
  "Morella cerifera": {
    nativeNote:
      "Petit arbre ou grand arbuste rapide et adaptable, indigène dans toute la Floride, sud compris.",
    careNote:
      "Très rapide et robuste — il prend le soleil comme l'ombre, l'humide comme le sec, le sel et les sols pauvres — idéal pour un écran rapide ou pour combler un emplacement difficile. Il drageonne ; il fixe son propre azote. Les pieds femelles portent les baies cireuses.",
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
  "Chrysobalanus icaco": {
    nativeNote:
      "Arbuste persistant des côtes, des pinèdes sur roche calcaire et des bords humides du sud de la Floride.",
    careNote:
      "Un persistant robuste, tolérant au sel et à la sécheresse, qui accepte un terrain humide ou sec et se taille en excellente haie indigène. Hors gel (zone 10+). Cherchez des formes sauvages locales plutôt que le cultivar commercial « Red Tip ».",
    givesNote:
      "Un couvert persistant luisant et un habitat de nidification, de petites fleurs blanches pour les pollinisateurs, et des fruits comestibles en forme de prunes que les oiseaux et les gens apprécient.",
    propagationNote:
      "Prélevez la graine des fruits mûrs en forme de prune, rincez-la, et semez-la fraîche et au chaud avant qu'elle ne sèche. Il s'enracine aussi de boutures semi-ligneuses en saison chaude, et les branches basses se marcottent — fixez-en une au sol et elle s'enracine toute seule.",
    supportNotes: {
      "berry-songbirds":
        "Les fruits de l'icaquier nourrissent oiseaux et mammifères tout le long du littoral subtropical.",
    },
  },
  "Psychotria nervosa": {
    nativeNote:
      "Arbuste de sous-bois aux feuilles luisantes des hammocks du sud de la Floride.",
    careNote:
      "L'arbuste indigène de référence pour l'ombre — ses feuilles aux nervures profondes, comme laquées, éclairent un sous-bois de hammock. Sensible au gel : protégez-le d'un coup de froid. Un peu d'eau en période sèche ; le soleil décolore ses feuilles.",
    givesNote:
      "Des fleurs blanches pour les papillons et les abeilles indigènes, puis des baies rouges dont se nourrissent les moqueurs, les cardinaux et les parulines, tout cela à l'ombre sèche où presque rien d'autre ne prospère.",
    propagationNote:
      "Pressez la graine des fruits rouges mûrs, lavez-en la pulpe, et semez-la fraîche et au chaud — elle perd vite sa vie si on la laisse sécher. Le Psychotria nervosa s'enracine aussi volontiers de boutures de pousses tendres ou tout juste aoûtées prises pendant les mois chauds.",
    supportNotes: {
      "berry-songbirds":
        "Les baies rouges du Psychotria nervosa sont prélevées par les moqueurs, les cardinaux et les moqueurs chats ; ses fleurs nourrissent les papillons.",
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
  "Sophora tomentosa var. truncata": {
    nativeNote:
      "Arbuste littoral du sud de la Floride — plantez la variété indigène de Floride, truncata, et non la forme exotique duveteuse.",
    careNote:
      "Un arbuste littoral à l'épreuve du sel et de la sécheresse, pour le plein soleil, qui fleurit une grande partie de l'année ; il fixe son propre azote. Hors gel (zone 10+). Choisissez la var. truncata indigène, à feuilles lisses ; les graines sont toxiques si on les avale.",
    givesNote:
      "Des chaînes pendantes de fleurs jaunes en pois nourrissent les colibris et les abeilles presque toute l'année, et il héberge le Leptotes cassius et d'autres papillons.",
    propagationNote:
      "Comme chez la plupart des légumineuses, la graine a un tégument dur : entaillez-la ou grattez-la et faites-la tremper une nuit avant de semer au chaud — cela laisse entrer l'eau et la met en route. Récoltez la graine mûre dans les gousses en chapelet ; rappelez-vous qu'elle est toxique, tenez-la donc à l'écart des enfants et des animaux.",
  },
  "Zamia integrifolia": {
    nativeNote:
      "La seule cycadée indigène de Floride, des pinèdes et des hammocks — et la seule plante hôte de l'Eumaeus atala.",
    careNote:
      "Extrêmement robuste, lente et longévive — elle prend le soleil ou l'ombre, la sécheresse, le sel et les sols calcaires pauvres une fois installée. D'aspect de fougère mais c'est une cycadée ; toutes ses parties sont toxiques si on les avale. Elle est au mieux dans le sud de la Floride, son aire d'origine.",
    givesNote:
      "La seule plante nourricière des chenilles du rare Eumaeus atala — planter cette Zamia a ramené ce papillon du bord de l'extinction locale — plus un arbuste-couvre-sol persistant, architectural et à l'épreuve de la sécheresse.",
    propagationNote:
      "La Zamia est une cycadée qui ne se cultive que par semis — pas de bouture, pas de division. Elle a des pieds mâles et femelles séparés, et seules les femelles pollinisées font les gros cônes de graines orange. Avec des gants (la graine est toxique), retirez l'enveloppe charnue, faites tremper ou grattez légèrement la graine, et semez-la fraîche et au chaud. C'est très lent : ne perdez pas courage.",
    supportNotes: {
      atala:
        "Cette Zamia est la seule plante nourricière des chenilles de l'Eumaeus atala — la planter est ce qui a ramené ce papillon du bord de l'extinction dans le sud de la Floride.",
    },
    lookalikeNotes: {
      "cycas-revoluta": {
        why: "Deux cycadées à la même rosette raide, d'allure de palmier — et le cycas du Japon est dans un jardin de devant sur deux en Floride.",
        tells: [
          { feature: "Folioles", native: "Plates et à bord souple, arrondies ou légèrement échancrées au bout ; on peut y passer la main.", lookalike: "Raides, enroulées sur les bords et acérées comme des aiguilles au bout — elles font saigner." },
          { feature: "Où est la tige", native: "Sous terre : les feuilles sortent directement du sol.", lookalike: "Au-dessus du sol : un tronc brun hirsute qui s'épaissit avec les années." },
          { feature: "Cônes", native: "Un petit cône brun velouté, bas parmi les feuilles.", lookalike: "Un gros cône, ou un grand dôme laineux, posé au centre." },
          { feature: "Pourquoi cela compte", native: "La seule nourriture des chenilles de l'Eumaeus atala.", lookalike: "Toxique pour les personnes et les animaux ; ses graines sont une cause fréquente d'empoisonnement mortel chez le chien." },
        ],
      },
    },
  },
  "Stachytarpheta jamaicensis": {
    nativeNote:
      "Indigène basse et rampante des terrains littoraux et remaniés du sud de la Floride — plantez l'indigène, pas les sosies dressés envahissants.",
    careNote:
      "Un couvre-sol rampant robuste, tolérant à la sécheresse et au sel, pour le plein soleil, qui fleurit toute l'année. Exigez l'indigène rampante Stachytarpheta jamaicensis — les porterweeds plus hauts, à tiges raides, vendus en magasin sont exotiques et peuvent devenir envahissants.",
    givesNote:
      "L'une des meilleures plantes à nectar pour papillons du sud de la Floride — ses épis de fleurs bleues attirent une foule constante de papillons, d'hespéries et d'abeilles — et une plante hôte du Junonia zonalis.",
    propagationNote:
      "Les boutures de tiges tendres s'enracinent vite dans un mélange humide, ce qui est le moyen le plus sûr d'obtenir la vraie indigène rampante plutôt qu'un sosie de magasin. Elle pousse aussi facilement de semis au chaud et se ressème dans le jardin dès qu'elle est heureuse.",
    supportNotes: {
      "white-peacock":
        "La Stachytarpheta jamaicensis est une plante nourricière des chenilles de l'Anartia jatrophae.",
      "zebra-longwing":
        "Ses longs épis de fleurs bleues sont une source de nectar de premier ordre pour les Heliconius et bien d'autres papillons.",
    },
    lookalikeNotes: {
      "stachytarpheta-cayennensis": {
        why: "Les deux portent l'étiquette « porterweed », et les deux portent les mêmes petites fleurs bleues qui montent le long d'un épi.",
        tells: [
          { feature: "Port", native: "Rampe au sol, hauteur de genou au plus.", lookalike: "Se tient dressée, hauteur de poitrine ou plus." },
          { feature: "Couleur des fleurs", native: "Bleu ciel pâle à lavande.", lookalike: "Bleu-violet profond." },
          { feature: "Tiges", native: "Doucement velues, souvent rougeâtres, s'enracinant au contact du sol.", lookalike: "Lisses, et ligneuses à la base." },
          { feature: "Feuilles", native: "Arrondies, épaisses, à dents émoussées.", lookalike: "Étroites, minces et vivement dentées — la « feuille d'ortie » de son nom anglais." },
        ],
      },
    },
  },
  "Rivina humilis": {
    nativeNote:
      "Indigène amie de l'ombre des hammocks et des lisières ombragées du sud de la Floride.",
    careNote:
      "Un bouche-trou facile pour l'ombre sèche, où peu d'autres choses fructifient ; elle fleurit et fructifie presque toute l'année et se ressème librement, alors éclaircissez-la. Ses baies vives sont toxiques pour les personnes si on les avale.",
    givesNote:
      "Des grappes de baies rouges que moqueurs, moqueurs chats et autres passereaux travaillent toute l'année, sur un couvre-sol bas d'ombre aux petites fleurs rose-blanc pour les pollinisateurs.",
    propagationNote:
      "Écrasez les baies rouges mûres pour en tirer la graine, rincez, et semez au chaud — elle lève facilement. En réalité elle se ressème si librement à l'ombre que vous arracherez plus souvent des semis en trop que vous n'en élèverez. N'oubliez pas que les baies sont toxiques pour les personnes.",
  },
  "Passiflora suberosa": {
    nativeNote:
      "Une petite passiflore indigène délicate des hammocks et des lisières du sud de la Floride — meilleure plante hôte ici que la grande Passiflora incarnata.",
    careNote:
      "Une grimpante modeste et facile pour un treillage, une clôture ou un arbuste à traverser — bien moins galopante que la Passiflora incarnata, même si elle se ressème encore. Elle prend le soleil ou la mi-ombre ; résistante à la sécheresse une fois installée.",
    givesNote:
      "La plante nourricière des chenilles de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia et de l'Agraulis vanillae ; ses petites baies sombres nourrissent aussi les oiseaux.",
    propagationNote:
      "Pressez la graine des baies sombres mûres et semez-la au chaud ; elle lève volontiers et se ressème dans le jardin. Les boutures de tiges tendres s'enracinent facilement, et la liane émet aussi des rejets qu'on peut déterrer et déplacer — il est donc rarement difficile d'en avoir plus.",
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
      "Donnez-lui de la vraie place — sa couronne s'étale bien plus large que haute. Ferme au sel et au vent, et l'un des arbres d'ombre les plus résistants aux ouragans que vous puissiez planter dans le Sud.",
    givesNote:
      "Le meilleur arbre pour la faune, même ici : des centaines d'espèces de chenilles, des glands pour les geais et les écureuils, un abri persistant, et des branches qui hébergent broméliacées, orchidées et fougère de résurrection.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et semez-les aussitôt — le chêne de Virginie est un chêne blanc : ils germent tout de suite et n'ont jamais besoin de passer par le froid. Mettez-les dans un seau d'eau et jetez ceux qui flottent, gardez humides ceux qui coulent (ne les laissez jamais sécher), et plantez là où l'arbre restera, car la racine pivotante profonde supporte mal d'être déplacée.",
    supportNotes: {
      "acorn-birds":
        "Les glands du chêne de Virginie nourrissent geais, pics et canards dans le sud de la Floride aussi.",
      "acorn-mammals":
        "Des glands pour les écureuils et d'autres mammifères.",
    },
  },
  "Sabal palmetto@florida-south": {
    nativeNote:
      "L'arbre emblème de l'État de Floride ; indigène partout, des hammocks au littoral du Sud et aux Keys.",
    careNote:
      "Quasi indestructible — sel, sécheresse, crue, sols sableux ou calcaires, soleil ou mi-ombre — et parmi les arbres les plus résistants aux ouragans qui soient. Lent à prendre de la hauteur de tronc. Laissez en place les vieilles « bottes » de feuilles pour la faune.",
    givesNote:
      "Ses panicules de fleurs d'été grouillent d'abeilles ; ses fruits nourrissent de nombreux oiseaux et mammifères ; et sa couronne et ses bottes abritent chauves-souris, rainettes et oiseaux nicheurs.",
    propagationNote:
      "Le Sabal palmetto ne se cultive que par semis — on ne peut ni le diviser ni le bouturer. Récoltez les fruits noirs mûrs, débarrassez les graines rondes de leur pulpe, et semez-les fraîches dans une terre chaude et humide. Soyez patient : la levée et la croissance sont lentes, et il faut des années pour former un tronc.",
    lookalikeNotes: {
      "washingtonia-robusta": {
        why: "Deux palmiers en éventail dans la même rue — et le grand mince de la carte postale n'est pas l'arbre emblème de la Floride.",
        tells: [
          { feature: "L'éventail", native: "Le pétiole se prolonge dans l'éventail et le courbe : la feuille se plie comme un taco.", lookalike: "Le pétiole s'arrête là où l'éventail commence ; la feuille est plate." },
          { feature: "Filaments", native: "De fins filaments pendent entre les segments de la feuille.", lookalike: "Aucun filament." },
          { feature: "Bord du pétiole", native: "Lisse — sans dents.", lookalike: "Bordé d'épines orange recourbées." },
          { feature: "Tronc", native: "Épais et gris, portant souvent encore les vieilles bases de feuilles croisées.", lookalike: "Mince, très haut et droit, en général avec une jupe de palmes brunes mortes." },
        ],
      },
    },
  },
  "Serenoa repens@florida-south": {
    nativeNote:
      "Le palmier de sous-bois qui définit les pinèdes et le scrub de Floride, vers le sud jusque dans les Keys — l'une des plantes les plus importantes de l'État pour la faune.",
    careNote:
      "À peu près aussi robuste qu'une plante de Floride peut l'être — à l'épreuve de la sécheresse, du feu, du sel et des ouragans, extrêmement longévif, au soleil comme à l'ombre. Très lent et difficile à transplanter : partez petit et choisissez sa place pour de bon. Les pétioles portent de fines dents.",
    givesNote:
      "L'une des meilleures plantes de Floride pour la faune : ses fleurs sont une source de nectar de premier ordre (le miel de palmetto), ses fruits nourrissent de nombreux animaux, et ses touffes abritent d'innombrables petites créatures et pollinisateurs.",
    propagationNote:
      "Le Serenoa repens ne se cultive que par semis — il ne se divise pas et ne se bouture pas. Débarrassez les fruits mûrs de leur pulpe et semez la graine fraîche et au chaud. Attendez-vous à une longue attente : la levée est irrégulière et les jeunes plants poussent extrêmement lentement, alors partez petit et soyez patient.",
  },
  "Hamelia patens@florida-south": {
    nativeNote:
      "L'arbuste à papillons et à colibris classique du sud de la Floride — achetez la vraie indigène, pas les formes exotiques « dwarf » ou « compact ».",
    careNote:
      "Elle adore la chaleur et le soleil et fleurit toute l'année dans le sud de la Floride sans gel — aucun rabattage ici. Résistante à la sécheresse une fois installée. Exigez la vraie espèce indigène (Hamelia patens var. patens).",
    givesNote:
      "Une usine à nectar sans arrêt : ses tubes rouge-orangé nourrissent les colibris, les Heliconius charithonia, les Agraulis vanillae et les coliades toute l'année, et ses baies sombres nourrissent les moqueurs et les moqueurs chats.",
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
          { feature: "Port", native: "Grande et lâche — elle veut devenir un petit arbre.", lookalike: "Basse, dense et nette ; souvent étiquetée « dwarf firebush »." },
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
      "Dégagez la graine des baies rouge-orangé mûres et semez-la fraîche et au chaud sans la laisser sécher. C'est un peu lent mais fiable par semis ; les boutures semi-ligneuses prises en saison chaude sont une autre voie.",
    supportNotes: {
      "berry-songbirds":
        "Les baies de la Myrcianthes fragrans sont l'une des préférées des moqueurs et des autres passereaux.",
    },
  },
  "Salvia coccinea@florida-south": {
    nativeNote:
      "Fleur sauvage indigène de toute la Floride, qui fleurit presque toute l'année dans le Sud sans gel.",
    careNote:
      "Facile, résistante à la sécheresse et se ressemant seule — une vivace de courte vie qui s'entretient par la graine : laissez-en donc quelques-unes monter. Rabattez les pieds dégingandés. Du soleil à l'ombre légère.",
    givesNote:
      "Ses fleurs rouges, presque toute l'année, nourrissent les colibris et les papillons et sont une préférée des bourdons ; une valeur sûre en nectar, sans souci.",
    propagationNote:
      "La plus facile de toutes — semez la petite graine au chaud et elle lève vite, et les pieds installés se ressèment : laissez simplement quelques épis grener et vous en aurez toujours. Vous pouvez aussi enraciner des boutures de tiges tendres si vous voulez la copie d'un pied particulier.",
    supportNotes: {
      "ruby-throated-hummingbird":
        "La sauge écarlate fleurit presque toute l'année dans le sud de la Floride — un carburant à colibris constant.",
    },
  },
  "Muhlenbergia capillaris@florida-south": {
    nativeNote:
      "Graminée indigène en touffe de toute la Floride, célèbre pour sa brume rose d'automne.",
    careNote:
      "Robuste, à l'épreuve du sel et de la sécheresse, en plein soleil sur un sol bien drainé — ni eau, ni tonte, ni engrais une fois installée. Rabattez-la une fois en fin d'hiver.",
    givesNote:
      "Des nuages de panicules roses à l'automne, des graines et un couvert pour les petits oiseaux, des racines denses qui tiennent un sol sableux ou en train de s'éroder, et un abri pour les abeilles nichant au sol ; elle héberge des hespéries.",
    propagationNote:
      "C'est une graminée de saison chaude : semez la graine cotonneuse à la surface d'une terre chaude au printemps ou en été plutôt qu'en terre froide. Le plus simple pour en avoir plus est de déterrer une touffe installée au printemps et de la fendre en morceaux, chacun avec des racines, puis de les replanter.",
  },
  "Tripsacum dactyloides@florida-south": {
    nativeNote:
      "Grande graminée indigène en touffe des bords de marais, des fossés et des terrains frais du sud de la Floride.",
    careNote:
      "Une grosse touffe arquée et quasi persistante qui accepte le soleil ou la mi-ombre et un sol humide ou moyen — excellente au bord d'un étang, d'une noue ou dans un jardin de pluie. Donnez-lui de la place ; rabattez-la en fin d'hiver.",
    givesNote:
      "Une robuste plante de couverture et d'anti-érosion qui cuirasse les bords humides qui s'érodent, abrite et nourrit les oiseaux et la petite faune, et héberge des hespéries.",
    propagationNote:
      "Semez la grosse graine dure dans une terre chaude au printemps — elle germe inégalement, ne comptez donc pas voir lever chacune. Bien plus facile : divisez une touffe mûre au printemps, fendez-la à la bêche en morceaux enracinés et replantez. Laissez de la place aux éclats, car ils s'étoffent en grosses touffes.",
  },
  "Helianthus debilis@florida-south": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses du sud de la Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés : il lui faut le plein soleil et un drainage franc, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le rafraîchir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les oiseaux, et son tapis rampant tient la dune et les sols sableux contre l'érosion.",
    propagationNote:
      "Récoltez la graine sèche sur les capitules fanés et répandez-la à la surface d'une terre chaude et sableuse, en la pressant mais en la couvrant à peine, car elle germe mieux avec un peu de lumière. Elle se ressème généreusement une fois installée, et les boutures tendres s'enracinent facilement aussi.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Le pollen de l'Helianthus debilis fait vivre les abeilles spécialistes des astéracées le long du littoral.",
    },
  },
};
