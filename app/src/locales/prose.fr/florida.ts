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
      "Récoltez la graine des cônes mûrs à l'automne. La graine fraîche n'a besoin d'aucun froid et lève sans peine. Attendez-vous à un début lent : un jeune pin des marais reste des années en touffe d'herbe avant de s'élancer.",
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
      "Ramassez les cônes ronds à l'automne, laissez-les sécher et cassez-les pour libérer la graine. Elle lève mieux après une période froide, que les hivers doux de Floride ne donnent pas toujours : faites-la tremper dans l'eau au réfrigérateur jusqu'à trois mois, puis semez au printemps et gardez le semis mouillé.",
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
      "Quand les cônes s'ouvrent, en fin d'été ou à l'automne, prélevez les graines et frottez-en l'enveloppe rouge. Gardez-les humides — elles meurent si elles sèchent. Il leur faut au moins deux mois de froid humide : en Floride, mettez-les au réfrigérateur dans de la mousse humide, puis semez au printemps. Les boutures semi-ligneuses prises en été s'enracinent aussi.",
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
      "Récoltez les fruits noirs mûrs, lavez la pulpe autour de la graine et semez-la vite, avant qu'elle ne sèche. Elle n'a besoin d'aucun froid mais elle est lente : une graine non traitée peut mettre trois ou quatre mois à lever.",
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
      "Dégagez la graine des fruits mûrs bleu-noir — laissée dans le fruit, elle ne lève pas — et semez-la fraîche dès que les nuits restent chaudes. C'est lent : des mois pour lever et des années pour faire un pied de jardin. Les pépinières le multiplient surtout à partir de morceaux de ses tiges rampantes.",
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
      "Écrasez les baies violettes mûres dans l'eau à l'automne : la bonne graine coule et la pulpe flotte. Semez la graine à l'automne, à peine couverte, et elle lève au printemps. Les boutures de pousses vertes tendres prises en été s'enracinent bien.",
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
      "Pressez la graine des baies sombres mûres et semez-la au chaud ; elle lève volontiers. Les pieds drageonnent souvent, et l'on peut déterrer et déplacer les drageons enracinés. Partez de la vraie indigène, pas de la Hamelia « naine » des jardineries, qui n'est pas indigène.",
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
      "Les boutures sont la voie la plus facile : faites raciner des pousses en voie d'aoûtement prises à l'automne, et vous saurez si vous avez une femelle porteuse de baies. Le semis est très lent et met souvent deux ou trois ans à lever. Une femelle a besoin d'un mâle à proximité pour fructifier.",
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
      "Multipliez-le par boutures de pousses vertes tendres. Le semis est lent : le tégument dur doit être gratté, et la graine peut encore mettre plusieurs années à lever.",
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
      "Facile de semis : débarrassez de leur pulpe les fruits rouge-orangé mûrs et semez la graine. Les pieds drageonnent aussi, et l'on peut déterrer et déplacer les drageons enracinés.",
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
      "Facile de semis, et elle se ressème librement. Pour récolter la graine, enfilez un petit sachet sur les épis quand ils fanent.",
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
      "Cultivez-la de semis, ou divisez les rosettes de feuilles à sa base. Elle se ressème volontiers.",
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
      "Cultivez-le de semis à l'automne. La graine non traitée a levé entièrement lors d'essais au frais et à l'humide : elle n'a besoin d'aucun traitement particulier.",
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
      "Semez la graine non traitée à l'automne, ou mettez-la au froid humide au réfrigérateur environ trois mois et semez-la au printemps, à peine couverte. Les boutures de têtes de tiges prises de mai à août s'enracinent en un mois environ.",
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
      "Peignez la graine des épis roses quand ils fanent, en fin d'automne. Elle lève bien au chaud sans aucun froid, et la plante se ressème.",
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
      "La graine dort dans une enveloppe dure. Semez-la en pleine terre en fin d'automne ou en hiver, ou gardez-la au froid et mouillée au réfrigérateur 6 à 10 semaines avant de semer au printemps, sans la laisser sécher. Même ainsi, elle lève lentement et inégalement.",
  },
  "Passiflora incarnata": {
    nativeNote:
      "Liane indigène grimpante et rampante des champs, des bords de clôture et des sols remaniés de Floride.",
    careNote:
      "Vigoureuse et rapide — donnez-lui une clôture, un treillage ou de la place où courir, et attendez-vous à ce qu'elle file et drageonne depuis les racines (supprimez les rejets). Elle disparaît en hiver au nord de l'État et repart. Robuste et résistante à la sécheresse.",
    givesNote:
      "La plante nourricière de l'Agraulis vanillae et de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia ; ses fleurs pourpres extraordinaires nourrissent les xylocopes et les bourdons, et son fruit, le « maypop », nourrit la faune.",
    propagationNote:
      "Récoltez les fruits à l'automne quand ils se rident, lavez la gelée autour de la graine brune et semez-la directement au jardin. Les boutures de tiges prises au début du printemps s'enracinent aussi, et l'on peut déterrer et déplacer les drageons qui sortent autour d'un pied.",
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
      "Entaillez ou poncez le tégument dur de la graine avant de semer — sans cela, elle lève mal. Plus simple encore : ce tapis s'étend par des stolons qui s'enracinent en chemin, et vous pouvez soulever les morceaux enracinés et les rempoter.",
  },
  "Helianthus debilis": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses de Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés, secs : il lui faut le plein soleil et un sol parfaitement drainé, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le faire repartir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les fringilles, et son tapis rampant tient la dune et les sols sableux contre l'érosion ; il héberge la belle-dame et d'autres chenilles.",
    propagationNote:
      "Récoltez la graine sur les capitules fanés et semez-la ; la graine non traitée lève bien, et la plante se ressème librement. Les boutures s'enracinent aussi.",
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
      "Rapide et adaptable ; il adore les terrains frais et tolère les sols gorgés d'eau, ce qui en fait l'arbre idéal d'un point bas et humide. Arrosez-le le temps qu'il s'installe sur un site plus sec.",
    givesNote:
      "Ses fleurs rouges s'ouvrent au cœur de l'hiver floridien — le premier nectar et le premier pollen de l'année — ses graines nourrissent les oiseaux, et il héberge des centaines de chenilles.",
    propagationNote:
      "Ses petites graines ailées en « hélicoptère » mûrissent au printemps — attrapez-les quand elles brunissent et semez-les aussitôt. Une bonne part lève dès l'été sans aucun froid, mais la graine de certains arbres attend l'année suivante.",
  },
  "Asclepias tuberosa@florida-central": {
    nativeNote:
      "Asclépiade indigène des collines sableuses bien drainées et des bords de route de Floride — une alternative indigène à l'asclépiade tropicale exotique vendue en jardinerie.",
    careNote:
      "Elle demande le plein soleil et un sol parfaitement drainé (une terre sableuse), et craint l'excès d'eau comme d'être déplacée — une racine pivotante profonde la rend résistante à la sécheresse mais impossible à déplacer : plantez-la pour qu'elle reste. Lente à sortir au printemps. Sa sève est toxique si on l'avale. Préférez-la à l'asclépiade tropicale exotique, qui perturbe la migration des monarques en Floride.",
    givesNote:
      "Une plante nourricière des chenilles du monarque et du Danaus gilippus, visitée par de nombreux papillons et abeilles indigènes, sur un pied net et peu envahissant.",
    propagationNote:
      "Récoltez la graine quand les gousses mûrissent, avant qu'elles ne s'ouvrent. Mettez-la au froid humide au réfrigérateur environ trois mois avant un semis de printemps, ou semez-la en pleine terre à l'automne. Des tronçons de la grosse racine repartent aussi : coupez-les à l'automne, quand la plante est en repos, chacun avec un bourgeon.",
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
      "Une branche coupée et plantée en terre peut s'enraciner en un nouvel arbre. Les arbres issus de semis prennent pourtant une meilleure forme : débarrassez de leur pulpe les fruits mûrs et semez la graine.",
  },
  "Coccoloba uvifera@florida-south": {
    nativeNote:
      "Arbre-arbuste littoral emblématique des plages et des dunes du sud de la Floride.",
    careNote:
      "Fait pour le littoral le plus rude — battu de sel, sableux, ensoleillé — et extrêmement tolérant au sel et à la sécheresse. Sensible au gel (zone 10+). Taillez-le en arbre ou gardez-le en écran ; notez qu'il est protégé par la réglementation sur les dunes littorales dans beaucoup d'endroits.",
    givesNote:
      "De grandes feuilles rondes et coriaces qui cuirassent une dune contre l'érosion, des fruits pourpres en grappes de raisin pour les oiseaux (et pour la gelée), et du nectar pour les abeilles.",
    propagationNote:
      "Pressez et lavez la pulpe autour de l'unique graine de chaque « raisin » pourpre mûr, et semez-la. Le raisinier a des pieds mâles et femelles séparés : pour avoir des fruits, il faut une femelle avec un mâle à proximité. Les branches basses se marcottent aussi.",
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
      "Lavez la pulpe autour de la graine des fruits rouge-pourpre sombre mûrs et semez-la. Comme son cousin le raisinier, il a des pieds mâles et femelles séparés : seules les femelles fructifient, et seulement avec un mâle à proximité.",
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
      "Émiettez les capitules en bouton mûrs et semez la graine ; elle lève sans aucun traitement. Les boutures s'enracinent aussi.",
  },
  "Morella cerifera@florida-south": {
    nativeNote:
      "Petit arbre ou grand arbuste rapide et adaptable, indigène dans toute la Floride, sud compris.",
    careNote:
      "Très rapide et robuste — il prend le soleil comme l'ombre, l'humide comme le sec, le sel et les sols pauvres — idéal pour un écran rapide ou pour combler un emplacement difficile. Il drageonne ; il fixe son propre azote. Les pieds femelles portent les baies cireuses.",
    givesNote:
      "Des baies bleues cireuses dont dépendent en hiver les parulines à croupion jaune et bien d'autres oiseaux, un couvert de nidification dense, et le rôle de plante hôte du Calycopis cecrops.",
    propagationNote:
      "Le Morella cerifera a des pieds mâles et femelles séparés, et seules les femelles portent les baies cireuses. Frottez ou faites tremper la graine pour ôter la cire, puis mettez-la au froid humide au réfrigérateur deux ou trois mois avant de semer — cireuse ou non refroidie, elle lève mal. Les boutures d'été s'enracinent bien, et l'on peut déterrer et déplacer les drageons enracinés.",
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
      "Prélevez la graine des fruits mûrs en forme de prune, rincez-la et semez-la. Les boutures ligneuses s'enracinent aussi.",
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
      "Pressez la graine des fruits rouges mûrs, lavez-en la pulpe et semez-la au chaud. Soyez patient : elle peut mettre quelques mois à lever. Une fois installé, il se ressème.",
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
      "Récoltez la graine mûre dans les gousses en chapelet. Entailler le tégument dur accélère la levée ; non traitée, la graine peut mettre des mois.",
  },
  "Zamia integrifolia": {
    nativeNote:
      "La seule cycadée indigène de Floride, des pinèdes et des hammocks — et la seule plante hôte indigène de l'Eumaeus atala.",
    careNote:
      "Extrêmement robuste, lente et longévive — elle prend le soleil ou l'ombre, la sécheresse, le sel et les sols calcaires pauvres une fois installée. D'aspect de fougère mais c'est une cycadée ; toutes ses parties sont toxiques si on les avale. Elle est au mieux dans le sud de la Floride, son aire d'origine.",
    givesNote:
      "La seule plante nourricière indigène des chenilles du rare Eumaeus atala (qui mangent aussi des cycadées importées comme le cycas du Japon) — planter cette Zamia a ramené ce papillon du bord de l'extinction locale — plus un arbuste-couvre-sol persistant, architectural et résistant à la sécheresse.",
    propagationNote:
      "La Zamia se multiplie par semis ou par division des racines. Cônes mâles et femelles naissent sur des pieds séparés, et seules les femelles pollinisées font la graine orange, mûre en hiver. Avec des gants (graines, feuilles et racines sont toxiques), ôtez l'enveloppe charnue, qui freine la germination, puis entaillez ou fêlez la coque dure et semez. Une graine non traitée peut mettre 6 à 12 mois à lever.",
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
      "Multipliez-la par semis — la graine lève volontiers sans traitement — ou par boutures. Partez de la vraie indigène, qui court au ras du sol ; la Stachytarpheta urticifolia dressée que vendent bien des jardineries vient d'Asie tropicale.",
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
      "Cueillez les baies quand elles sont rouges et dodues et semez la graine ; elle lève bien, même si les semis poussent lentement. Les boutures s'enracinent aussi, et la plante se ressème.",
  },
  "Passiflora suberosa@florida-south": {
    nativeNote:
      "Une petite passiflore indigène délicate des hammocks et des lisières du sud de la Floride — meilleure plante hôte ici que la grande Passiflora incarnata.",
    careNote:
      "Une grimpante modeste et facile pour un treillage, une clôture ou un arbuste à traverser — bien moins galopante que la Passiflora incarnata, même si elle se ressème encore. Elle prend le soleil ou la mi-ombre ; résistante à la sécheresse une fois installée.",
    givesNote:
      "La plante nourricière des chenilles de l'Heliconius charithonia — le papillon emblème de la Floride — ainsi que du Dryas iulia et de l'Agraulis vanillae ; ses petites baies sombres nourrissent aussi les oiseaux.",
    propagationNote:
      "Pressez la graine des baies sombres mûres et semez-la, mais attendez-vous à une levée lente. Diviser les racines d'un pied installé est la voie la plus rapide.",
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
      "Ramassez les glands à leur chute en automne et semez-les aussitôt — le chêne de Virginie est un chêne blanc : ils germent tout de suite et n'ont jamais besoin de passer par le froid. Mettez-les dans un seau d'eau et jetez ceux qui flottent, gardez humides ceux qui coulent (ne les laissez jamais sécher), et plantez là où l'arbre restera ou dans un pot profond, car il descend une longue racine pivotante.",
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
      "Récoltez les fruits noirs mûrs, lavez la pulpe autour de la graine et semez-la vite, avant qu'elle ne sèche. Elle n'a besoin d'aucun froid mais elle est lente : une graine non traitée peut mettre trois ou quatre mois à lever.",
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
      "Dégagez la graine des fruits mûrs bleu-noir — laissée dans le fruit, elle ne lève pas — et semez-la fraîche dès que les nuits restent chaudes. C'est lent : des mois pour lever et des années pour faire un pied de jardin. Les pépinières le multiplient surtout à partir de morceaux de ses tiges rampantes.",
  },
  "Hamelia patens@florida-south": {
    nativeNote:
      "L'arbuste à papillons et à colibris classique du sud de la Floride — achetez la vraie indigène, pas les formes exotiques « dwarf » ou « compact ».",
    careNote:
      "Elle adore la chaleur et le soleil et fleurit toute l'année dans le sud de la Floride sans gel — aucun rabattage ici. Résistante à la sécheresse une fois installée. Exigez la vraie espèce indigène (Hamelia patens var. patens).",
    givesNote:
      "Ses tubes rouge-orangé nourrissent les colibris, les Heliconius charithonia, les Agraulis vanillae et les coliades toute l'année, et ses baies sombres nourrissent les moqueurs et les moqueurs chats.",
    propagationNote:
      "Pressez la graine des baies sombres mûres et semez-la au chaud ; elle lève volontiers. Les pieds drageonnent souvent, et l'on peut déterrer et déplacer les drageons enracinés. Partez de la vraie indigène, pas de la Hamelia « naine » des jardineries, qui n'est pas indigène.",
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
      "Facile de semis : débarrassez de leur pulpe les fruits rouge-orangé mûrs et semez la graine. Les pieds drageonnent aussi, et l'on peut déterrer et déplacer les drageons enracinés.",
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
      "Facile de semis, et elle se ressème librement. Pour récolter la graine, enfilez un petit sachet sur les épis quand ils fanent.",
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
      "Peignez la graine des épis roses quand ils fanent, en fin d'automne. Elle lève bien au chaud sans aucun froid, et la plante se ressème.",
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
      "La graine dort dans une enveloppe dure. Semez-la en pleine terre en fin d'automne ou en hiver, ou gardez-la au froid et mouillée au réfrigérateur 6 à 10 semaines avant de semer au printemps, sans la laisser sécher. Même ainsi, elle lève lentement et inégalement.",
  },
  "Helianthus debilis@florida-south": {
    nativeNote:
      "Tournesol indigène rampant des dunes, des plages et des ouvertures sableuses du sud de la Floride.",
    careNote:
      "Fait pour les emplacements les plus rudes — ensoleillés, sableux, salés : il lui faut le plein soleil et un sol parfaitement drainé, et il pourrit dans une terre riche ou humide. Un couvre-sol de courte vie qui se ressème librement et se renouvelle par la graine ; taillez-le pour le faire repartir.",
    givesNote:
      "Ses marguerites jaunes, presque toute l'année, nourrissent les abeilles indigènes et les papillons, ses graines nourrissent les oiseaux, et son tapis rampant tient la dune et les sols sableux contre l'érosion.",
    propagationNote:
      "Récoltez la graine sur les capitules fanés et semez-la ; la graine non traitée lève bien, et la plante se ressème librement. Les boutures s'enracinent aussi.",
    supportNotes: {
      "sunflower-specialist-bees":
        "Le pollen de l'Helianthus debilis fait vivre les abeilles spécialistes des astéracées le long du littoral.",
    },
  },
};
