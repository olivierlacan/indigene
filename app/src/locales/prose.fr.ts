// French translations of the catalog's prose, keyed on scientific name.
//
// This is an **overlay** (see `lib/prose.ts`): anything absent falls back to the
// English the row was authored in, and the app says so on the page rather than
// mixing two languages silently. That's what makes it safe to fill in over time
// instead of blocking a French edition on ~33,000 words of botanical writing.
//
// **Priority is by reader, not by alphabet.** Atlantic France comes first,
// because those are the plants a French speaker standing near Nantes or Bordeaux
// is actually handed. The other three French regions follow, then the North
// American rosters — a French reader browsing Florida is a real but secondary
// case, and until then those pages show their English paragraphs under an
// honest notice.
//
// Translation, not paraphrase, with two deliberate exceptions:
//
//  - **Measurements go metric in the words too.** The English "4–6 inch
//    cutting" has already been rewritten upstream as a body-scale comparison
//    (a hand's length), so nothing here needs converting — but where a
//    paragraph names a distance, it names it the way a French gardener would.
//  - **Species names use their TAXREF name**, the same one `taxa.fr.ts` shows,
//    so a paragraph and the heading above it never call the same plant two
//    different things.
import type { ProseTable } from "../lib/prose";

export const PROSE_FR: ProseTable = {
  // -------------------------------------------------------------------------
  // France atlantique — arbres.
  // -------------------------------------------------------------------------
  "Quercus robur": {
    nativeNote:
      "Le feuillu dominant des forêts de la France atlantique et la clé de voûte de son réseau alimentaire, de la Normandie aux Landes.",
    careNote:
      "Lent mais extraordinairement durable — un chêne planté aujourd'hui est pour le siècle prochain. Sa racine pivotante profonde le rend autonome et à l'épreuve de la sécheresse une fois installé, mais difficile à déplacer : plantez-en un petit et laissez-lui de la place, loin des bâtiments.",
    givesNote:
      "L'arbre le plus précieux qui soit pour la faune française : des centaines d'espèces de chenilles (et donc les oiseaux qui en nourrissent leurs petits), des glands pour les geais, les pics et les mammifères, et des siècles d'ombre et de carbone.",
    propagationNote:
      "Ramassez les glands à leur chute en automne et faites-les flotter dans l'eau — jetez ceux qui remontent, semez aussitôt ceux qui coulent. Les glands de chêne germent dès l'automne, sans passage au froid, et ne doivent jamais sécher. À cause de la racine pivotante, démarrez-le en pot haut, ou semez-le là où il vivra.",
  },
  "Betula pendula": {
    nativeNote:
      "Un pionnier rapide, au houppier léger, des landes, clairières et sols sableux pauvres de France.",
    careNote:
      "Rapide, aérien et peu exigeant — il prospère sur les sables les plus pauvres et ne donne qu'une ombre légère, si bien que d'autres plantes vivent volontiers dessous. Ses racines sont superficielles : gardez-le un peu à l'écart des canalisations.",
    givesNote:
      "L'une des toutes premières plantes nourricières de chenilles d'Europe — de quoi nourrir mésanges, fauvettes et sizerins — plus des graines pour les tarins et les pinsons, et une écorce blanche éclatante tout l'hiver.",
    propagationNote:
      "Récoltez les chatons mûrs à la fin de l'été, quand ils s'effritent, et répandez la graine, fine comme de la poussière, à la surface d'une terre humide — il lui faut la lumière, ne l'enterrez pas. Semée à l'automne et laissée dehors pour l'hiver, elle lève sans difficulté au printemps.",
  },
  "Salix caprea": {
    nativeNote:
      "Le saule des bois frais, des lisières et des friches de France — et, fait rare chez les saules, il accepte un sol plus sec.",
    careNote:
      "Rapide et formant fourré — parfait pour tenir une lisière ou un talus humide, mais laissez-lui de la place. Ses chatons argentés puis dorés de fin d'hiver sont une nourriture de première importance ; il supporte mieux les terrains ordinaires que les autres saules.",
    givesNote:
      "Une clé de voûte : les saules hébergent plus de chenilles que presque tout le reste ici, de quoi nourrir les oiseaux au nid, et leurs chatons précoces sont une bouée de sauvetage pour les reines de bourdons et les premières abeilles, quand presque rien d'autre n'est en fleur.",
    propagationNote:
      "Le plus facile qui soit : coupez en fin d'hiver des rameaux nus gros comme un crayon et enfoncez-les en terre humide, ils s'enracinent tout seuls. (Le saule marsault s'enracine un peu moins volontiers que ses cousins : prenez-en quelques-uns de plus.) Sa graine cotonneuse ne vit que quelques jours ; si vous passez par elle, semez-la aussitôt sur de la vase.",
  },
  "Prunus avium": {
    nativeNote:
      "Le cerisier sauvage des forêts de France, ancêtre de la cerise de verger, fréquent sur les sols riches.",
    careNote:
      "Rapide et lumineux — des nuages de fleurs blanches en avril et un feuillage d'automne flamboyant. Il drageonne un peu et devient grand : donnez-lui de l'espace ; il se plaît sur tout sol correct et non gorgé d'eau.",
    givesNote:
      "Sa floraison précoce nourrit les abeilles qui émergent, ses cerises d'été nourrissent merles, grives et mammifères, et — comme tous les Prunus — il élève une grande part des papillons de nuit indigènes et de leurs chenilles.",
    propagationNote:
      "Débarrassez les cerises mûres de leur chair et faites passer aux noyaux un long hiver froid et humide avant qu'ils ne lèvent — un semis dehors à l'automne s'en charge pour vous. Plus simple encore : déterrez et replantez les rejets enracinés qu'il pousse autour du tronc.",
  },
  "Sorbus aucuparia": {
    nativeNote:
      "Un arbre indigène élancé et rustique des montagnes, des landes et des lisières de France.",
    careNote:
      "Petit, net et robuste — il encaisse le froid, le vent et les sols acides pauvres, ne donne qu'une ombre légère et tient dans un jardin modeste. Peu exigeant une fois installé.",
    givesNote:
      "Des corymbes crème pour les abeilles et les syrphes au printemps, puis de lourdes grappes de baies orange vif que grives mauvis, litornes, merles et jaseurs dépouillent tout l'automne.",
    propagationNote:
      "Écrasez les baies mûres, rincez bien la graine et faites-lui passer un hiver froid et humide (un semis dehors à l'automne convient très bien). La levée peut être irrégulière : gardez le pot un second printemps avant de renoncer.",
    lookalikeNotes: {
      "robinia-pseudoacacia": {
        why: "Tous deux portent une feuille découpée en de nombreuses folioles sur un même pétiole, et tous deux poussent sur les mêmes friches et bords de route.",
        tells: [
          { feature: "Folioles", native: "Dentées sur tout leur pourtour, comme une petite lame de scie.", lookalike: "À bord lisse et ovale, avec une minuscule échancrure au bout." },
          { feature: "Épines", native: "Aucune.", lookalike: "Deux courtes épines raides à la base de chaque feuille, sur les jeunes pousses." },
          { feature: "Fleurs", native: "Des corymbes crème de multitudes de petites fleurs, en mai.", lookalike: "Des grappes pendantes de fleurs blanches en forme de pois, très parfumées, fin mai." },
          { feature: "Fruits", native: "Des grappes de baies orange vif que les grives dépouillent à l'automne.", lookalike: "Des gousses brunes et plates qui claquent dans les branches tout l'hiver." },
        ],
      },
    },
  },
  "Carpinus betulus": {
    nativeNote:
      "Un arbre forestier dense et patient du nord et de l'ouest de la France, et la haie taillée classique des jardins français.",
    careNote:
      "Il supporte l'ombre, l'argile et la taille sévère — en arbre libre il forme un grand houppier en dôme, mais il est surtout précieux en haie, qui garde ses feuilles mortes cuivrées tout l'hiver et fait écran et abri. Les chevreuils le laissent tranquille.",
    givesNote:
      "Il héberge toute une gamme de chenilles, nourrit gros-becs et mésanges avec ses samares, et — taillé en haie — offre un couvert de nidification dense toute l'année ainsi qu'un brise-vent.",
    propagationNote:
      "Récoltez les graines ailées à l'automne et semez-les aussitôt dehors — prises bien mûres il leur faut un hiver, mais si elles ont séché elles peuvent bouder deux ans. De la patience et un pot dehors sont tout ce qu'elles demandent.",
  },
  "Alnus glutinosa": {
    nativeNote:
      "L'arbre des bords de rivière, des bois humides et des plaines inondables de France, qui s'enracine sans peine là où le sol est trop mouillé pour tout le reste.",
    careNote:
      "La réponse à un coin humide et difficile : il prospère en terrain gorgé d'eau et fixe même son propre azote, enrichissant les sols pauvres et humides. Rapide ; laissez de la place à un grand arbre de berge, à l'écart des canalisations.",
    givesNote:
      "Ses racines cuirassent une berge contre l'érosion, ses chatons de fin d'hiver nourrissent les premières abeilles, ses petits fruits en forme de cônes nourrissent tarins et sizerins, et il héberge de nombreux papillons de nuit — une zone humide entière dans un seul arbre.",
    propagationNote:
      "Récoltez les petits cônes ligneux à l'automne, séchez-les jusqu'à ce qu'ils libèrent leurs graines, et semez en surface sur une terre humide — il lui faut lumière et humidité, pas de froid. Des boutures ligneuses enfoncées en sol mouillé prennent aussi.",
  },

  // -------------------------------------------------------------------------
  // France atlantique — arbustes.
  // -------------------------------------------------------------------------
  "Crataegus monogyna": {
    nativeNote:
      "L'arbuste qui fait l'ossature du bocage atlantique — ces haies vives qui recousent la campagne française.",
    careNote:
      "Quasi indestructible — il encaisse le vent, l'argile, la sécheresse et la taille sévère, et forme une haie épineuse impénétrable, la meilleure structure pour la faune que vous puissiez planter. Placez les épines à l'écart des passages.",
    givesNote:
      "Son écume de fleurs de mai nourrit une foule d'abeilles, de syrphes et de coléoptères ; ses cenelles d'automne nourrissent grives, merles et migrateurs hivernants ; et son fourré épineux dense héberge de nombreuses chenilles et abrite les oiseaux nicheurs.",
    propagationNote:
      "Les cenelles sont têtues : nettoyez la graine et comptez deux hivers dehors avant la levée — semez en pot et prenez patience. Bien plus rapide pour une haie : achetez ou prélevez des plants à racines nues en hiver.",
  },
  "Prunus spinosa": {
    nativeNote:
      "Le compagnon épineux de l'aubépine dans les haies de toute la France atlantique — ses prunelles parfument le patxaran et le gin de prunelle.",
    careNote:
      "Il fleurit sur le bois noir et nu avant les feuilles, en mars — la première floraison de la haie. Il drageonne librement en fourré épineux : laissez-lui de la place ou une ligne de haie où courir ; robuste et à l'épreuve de la sécheresse.",
    givesNote:
      "Ses fleurs très précoces nourrissent les premières abeilles quand rien d'autre n'est ouvert ; comme tous les Prunus c'est une grande plante nourricière de chenilles (la thécla du prunier en dépend) ; et les prunelles nourrissent les oiseaux comme les gens.",
    propagationNote:
      "De loin le plus simple : soulevez en hiver les drageons enracinés qu'il produit et replantez-les. Par les fruits c'est lent — nettoyez les noyaux des prunelles mûres et comptez jusqu'à deux hivers dehors avant la levée.",
  },
  "Corylus avellana": {
    nativeNote:
      "L'arbuste de sous-bois à cépée des forêts françaises, taillé en taillis depuis des siècles pour ses baguettes droites et ses noisettes.",
    careNote:
      "Facile, tolérant à l'ombre et de longue vie — il accepte un sol ordinaire et le recépage sévère, repartant de la souche pendant des siècles. Coupez chaque hiver quelques-unes des plus vieilles tiges au ras du sol pour le garder jeune et productif.",
    givesNote:
      "Ses chatons jaunes pendants — les « queues d'agneau » — sont l'une des toutes premières sources de pollen de l'année, ses feuilles hébergent de nombreux papillons de nuit, et ses noisettes d'automne nourrissent muscardins, écureuils, geais et sittelles.",
    propagationNote:
      "Semez les noisettes entières et mûres à l'automne, à l'abri des mulots, et laissez-leur un hiver froid ; elles lèvent au printemps suivant. Plus simple encore : couchez une tige basse au sol pour l'enraciner (marcottage), ou soulevez les rejets qu'il fait à la base.",
  },
  "Ilex aquifolium": {
    nativeNote:
      "Le persistant indigène des bois et des haies de la France atlantique — luisant, piquant, reconnaissable entre tous en hiver.",
    careNote:
      "Lent mais très tolérant à l'ombre et de longue vie — un superbe persistant dense pour un coin ombragé ou une haie taillée. Il faut un pied femelle (et un mâle à proximité) pour avoir des baies ; celles-ci sont toxiques pour les personnes et les animaux domestiques.",
    givesNote:
      "Ses petites fleurs printanières nourrissent les abeilles, ses baies d'hiver sont une nourriture tardive essentielle pour grives et merles, son couvert dense et piquant abrite les oiseaux au dortoir et au nid toute l'année, et c'est la principale plante nourricière de l'azuré des nerpruns.",
    propagationNote:
      "Par les baies c'est très lent — la graine nettoyée peut demander deux ou trois hivers dehors avant de lever. La plupart des gens prélèvent plutôt des boutures semi-aoûtées à la fin de l'été, qui s'enracinent lentement mais sûrement sous châssis ombragé.",
    lookalikeNotes: {
      "prunus-laurocerasus": {
        why: "Deux persistants luisants employés pour la même haie — et le laurier-palme est ce dont la plupart des haies de jardin sont faites aujourd'hui.",
        tells: [
          { feature: "Bord de la feuille", native: "Dur et ondulé, armé de piquants (les feuilles hautes en perdent souvent).", lookalike: "Plat et coriace, finement denté ou lisse — jamais piquant." },
          { feature: "Taille de la feuille", native: "À peu près la longueur d'un pouce.", lookalike: "À peu près la longueur d'une main." },
          { feature: "Froissez une feuille", native: "Pas d'odeur particulière.", lookalike: "Une odeur vive d'amande amère — c'est du cyanure." },
          { feature: "Fruits", native: "Des baies écarlates en hiver, sur les pieds femelles.", lookalike: "Des cerises noires en fin d'été, le long d'épis dressés." },
        ],
      },
    },
  },
  "Cornus sanguinea": {
    nativeNote:
      "Un arbuste de haie et de lisière de la France atlantique, dont les rameaux nus rougissent comme du sang en hiver.",
    careNote:
      "Robuste et adaptable, surtout sur sol calcaire ou frais ; il drageonne en fourré, alors utilisez-le pour garnir une haie ou un talus. Coupez chaque hiver un tiers des plus vieilles tiges pour obtenir les rameaux les plus rouges.",
    givesNote:
      "Ses corymbes crème nourrissent abeilles et syrphes, ses baies noires nourrissent les oiseaux d'automne, ses tiges rouges éclairent l'hiver, et le fourré abrite la faune et retient un talus.",
    propagationNote:
      "Enfoncez en hiver des boutures ligneuses dans une terre humide : la plupart prendront. Les tiges basses qui touchent le sol s'enracinent aussi d'elles-mêmes — coupez-les et déplacez-les.",
  },
  "Sambucus nigra": {
    nativeNote:
      "L'arbuste rapide et parfumé des haies et des friches de France, qui donne à la fois la fleur et la baie de sureau.",
    careNote:
      "Très rapide et indulgent, il prospère sur les sols riches, remaniés ou frais — rabattez-le sévèrement quand il s'effile, il repart. Les feuilles, l'écorce et les baies vertes crues sont toxiques ; ce sont les fleurs et les baies mûres cuites qui se consomment.",
    givesNote:
      "Ses grands plateaux de fleurs de début d'été nourrissent syrphes et abeilles, ses baies noir pourpre sont une nourriture d'automne majeure pour fauvettes, fauvettes à tête noire et grives qui font leurs réserves avant la migration, et il fabrique vite un couvert dense.",
    propagationNote:
      "À peu près aussi simple qu'une plantation puisse l'être — enfoncez en hiver des boutures ligneuses en terre, ou faites raciner des pousses tendres d'été en pot. Les deux prennent vite.",
  },
  "Frangula alnus": {
    nativeNote:
      "Un arbuste discret des bois humides, des tourbières et des landes de France — et, sans bruit, l'un des plus importants pour les papillons.",
    careNote:
      "Il veut une terre fraîche, acide à neutre, et accepte la mi-ombre — idéal pour une lisière humide ou un bord d'étang. Peu spectaculaire mais bien élevé ; les baies sont toxiques pour les personnes.",
    givesNote:
      "La principale plante nourricière du citron — plantez-la et vous verrez peut-être arriver au jardin ce grand papillon jaune du printemps — avec en prime de petites fleurs pour les abeilles et des baies qui virent du rouge au noir pour les oiseaux.",
    propagationNote:
      "Nettoyez la graine des baies mûres et faites-lui passer un hiver froid et humide dehors. Les boutures semi-aoûtées d'été sont l'autre voie ; les deux sont régulières plutôt que rapides.",
  },

  // -------------------------------------------------------------------------
  // France atlantique — vivaces, grimpantes, couvre-sols et fougères.
  // -------------------------------------------------------------------------
  "Hyacinthoides non-scripta": {
    nativeNote:
      "La jacinthe des bois atlantique, dont les nappes printanières tapissent les forêts océaniques françaises — une espèce presque confinée à la façade atlantique de l'Europe.",
    careNote:
      "Elle veut l'ombre fraîche et riche en humus des feuillus, où elle fleurit avant que la canopée ne se ferme puis disparaît pour l'été — ne bêchez pas là où elle s'efface. Plantez la vraie indigène, pas la jacinthe d'Espagne, plus grossière, qui l'efface par hybridation ; les bulbes sont toxiques si on les avale.",
    givesNote:
      "Ses clochettes bleues penchées nourrissent bourdons à longue langue, anthophores et premiers papillons juste à leur émergence, et recréent la forêt-à-jacinthes atlantique en voie de disparition, l'un des spectacles printaniers emblématiques de l'Europe.",
    propagationNote:
      "Le plus facile est de soulever et diviser les touffes trop denses au moment où les feuilles jaunissent, au début de l'été, en replantant les bulbes aussitôt. Par semis c'est lent — semez la graine mûre dehors à l'automne et comptez plusieurs années avant la floraison. N'utilisez jamais que des bulbes de culture : arracher des jacinthes sauvages est illégal.",
  },
  "Digitalis purpurea": {
    nativeNote:
      "Les hautes hampes pourpres des clairières, des landes et des talus acides de France — une vivace de courte vie qui se ressème toute seule.",
    careNote:
      "Facile au soleil ou à mi-ombre sur la plupart des sols, surtout acides. Elle fleurit la deuxième année puis meurt généralement, mais se ressème abondamment : laissez une hampe monter en graine et elle ne vous quittera plus vraiment. Toutes ses parties sont toxiques si on les avale — c'est la source du médicament cardiaque digitaline.",
    givesNote:
      "Ses hautes fleurs en tube sont un aimant à bourdons — on peut regarder les gros bourdons grimper carrément à l'intérieur de chaque doigtier — et elle se ressème pour garnir sans le moindre effort les clairières et les sols remaniés.",
    propagationNote:
      "La graine est fine comme de la poussière et a besoin de lumière : répandez-la à la surface d'une terre nue et humide en été ou en automne, sans la couvrir. Semée là où elle doit pousser, elle ne demande rien d'autre — laissez simplement une hampe monter en graine chaque année pour entretenir la colonie.",
  },
  "Primula veris": {
    nativeNote:
      "Les bouquets jaunes penchés des prairies, des talus et des pelouses ouvertes de France au printemps.",
    careNote:
      "Elle veut un emplacement dégagé, du soleil à la mi-ombre, sur une prairie ordinaire ou calcaire qui n'est pas fauchée avant le milieu de l'été — parfaite pour une mini-prairie ou un talus tondu tard. De longue vie une fois installée, et elle se ressème doucement.",
    givesNote:
      "Ses bouquets de fleurs jaunes parfumées nourrissent au printemps les bourdons à longue langue, l'anthophore plumeuse et les premiers papillons, et c'est une plante nourricière de la rare Lucine, là où elle subsiste.",
    propagationNote:
      "Semez de la graine fraîche à l'automne et laissez-la dehors pour le froid dont elle a besoin ; une graine vieille et sèche germe mal. Les touffes installées peuvent aussi être soulevées et divisées juste après la floraison.",
  },
  "Succisa pratensis": {
    nativeNote:
      "Une fleur de fin d'été des prairies humides, des marais herbeux et des layons forestiers de France.",
    careNote:
      "Elle veut un sol qui reste frais, au soleil ou à mi-ombre — toute désignée pour une prairie humide, un bord d'étang ou un jardin de pluie. Lente à s'étoffer, mais durable et fiable une fois installée.",
    givesNote:
      "Ses capitules bleu poudré sont une source de nectar de premier ordre en fin d'été, quand les prairies sèchent, et la plante est la plante nourricière indispensable du rare damier de la succise.",
    propagationNote:
      "Semez de la graine fraîche à l'automne et laissez-lui sentir le froid dehors. Les plants installés se divisent avec précaution au printemps, mais ils supportent mal d'être dérangés : faites des éclats généreux.",
  },
  "Deschampsia cespitosa": {
    nativeNote:
      "Une graminée indigène en touffe des prairies humides, des layons forestiers et des terres lourdes de France.",
    careNote:
      "Une touffe persistante qui accepte les sols frais, lourds et même ombragés où beaucoup de graminées échouent — une excellente graminée de fond dans laquelle planter des fleurs de prairie. Peignez les feuilles mortes en fin d'hiver ; aucun engrais nécessaire.",
    givesNote:
      "Ses nuages de fleurs argentées accrochent la lumière du plein été jusqu'en hiver, ses touffes hébergent les chenilles de plusieurs satyres et hespéries indigènes, abritent carabes et petite faune, et retiennent les sols frais.",
    propagationNote:
      "Semez la graine à la surface d'une terre nue au printemps ou à l'automne — elle lève sans peine, avec peu ou pas de froid préalable. Les touffes installées se déterrent aussi et se séparent en éclats.",
  },
  "Lonicera periclymenum": {
    nativeNote:
      "Le chèvrefeuille grimpant indigène des bois et des haies de la France atlantique — son parfum du soir, c'est l'odeur même d'une haie en été.",
    careNote:
      "Une grimpante indigène bien élevée — rien à voir avec les chèvrefeuilles de jardin envahissants. Donnez-lui une haie, un treillage ou un arbre où s'enrouler, les pieds à l'ombre fraîche et la tête au soleil ; les baies sont toxiques pour les personnes.",
    givesNote:
      "Ses tubes parfumés du soir sont faits pour les papillons de nuit à longue trompe (et nourrissent les bourdons ainsi que le moro-sphinx, actif de jour), c'est la plante nourricière du petit sylvain, et ses baies rouges d'automne nourrissent fauvettes et grives.",
    propagationNote:
      "Prélevez des boutures semi-aoûtées en été, ou couchez une tige basse sur la terre pour qu'elle s'enracine au point de contact. La graine tirée des baies demande un nettoyage puis un hiver froid et humide avant de lever.",
    lookalikeNotes: {
      "lonicera-japonica": {
        why: "Deux chèvrefeuilles volubiles, aux fleurs crème virant au jaune et au même parfum sucré du soir.",
        tells: [
          { feature: "Où sont les fleurs", native: "Toutes réunies en une tête à l'extrémité de la pousse.", lookalike: "Par paires à l'aisselle des feuilles, tout le long de la tige." },
          { feature: "Couleur des fleurs", native: "Crème à l'intérieur, lavées de rouge pourpre à l'extérieur.", lookalike: "Blanches virant au jaune beurre, sans aucun rouge." },
          { feature: "Fruits", native: "Une grappe serrée de baies rouges.", lookalike: "Des baies noires, par deux." },
          { feature: "En hiver", native: "Nue, ou presque.", lookalike: "Encore feuillée." },
        ],
      },
    },
  },
  "Hedera helix": {
    nativeNote:
      "La grimpante et le couvre-sol persistants indigènes des bois, des murs et des haies de France — les plus généreux exactement quand l'année est la plus pauvre.",
    careNote:
      "Presque impossible à tuer, au soleil comme à l'ombre profonde — il grimpe aux murs et aux arbres (il s'accroche, il n'est pas parasite) et couvre les sols nus. Vigoureux : tenez-le à l'écart des gouttières et des ardoises, et hors des petits massifs ; les baies sont toxiques pour les personnes.",
    givesNote:
      "Ses fleurs d'automne, uniques en leur genre, sont le dernier grand comptoir à nectar de l'année — elles nourrissent les abeilles tardives, les syrphes, les guêpes et la collète du lierre quand plus rien ne fleurit — puis ses baies noires d'hiver nourrissent merles, grives et pigeons ramiers, et son couvert persistant abrite oiseaux au dortoir, insectes et azuré des nerpruns.",
    propagationNote:
      "Le plus facile qui soit : coupez en fin d'été un morceau de pousse juvénile non grimpante et enfoncez-le dans une terre humide ou un pot, il s'enracine sans façon. Les tiges qui rampent au sol s'enracinent en chemin : vous pouvez soulever et déplacer les morceaux enracinés à tout moment.",
  },
  "Fragaria vesca": {
    nativeNote:
      "La minuscule fraise des bois des lisières, des talus et des clairières de France — plus sucrée, quoique plus petite, que n'importe quelle fraise du commerce.",
    careNote:
      "Elle court par stolons pour tisser un tapis bas et solide, au soleil ou à mi-ombre — un couvre-sol facile sous des arbustes ou en bordure d'allée. Elle accepte un sol ordinaire et un peu de piétinement ; elle s'étale, alors laissez-lui de la place pour voyager.",
    givesNote:
      "Ses fleurs blanches printanières nourrissent les premières abeilles et les syrphes, ses petites fraises rouges nourrissent oiseaux, petits mammifères et promeneurs, et son tapis héberge des chenilles et retient un talus.",
    propagationNote:
      "Le plus simple de tous : elle émet des stolons qui enracinent de petits plants en chemin — coupez un plant enraciné et déplacez-le là où vous en voulez d'autres. Les touffes trop denses se soulèvent et se divisent aussi.",
  },
  "Dryopteris filix-mas": {
    nativeNote:
      "La fougère robuste en volant de dentelle des sous-bois, des talus ombragés et des vieux murs de France.",
    careNote:
      "L'ossature verte fiable d'un coin ombragé et frais où presque rien ne pousse — elle accepte l'ombre profonde et les sols ordinaires à humides, et reste quasi persistante dans les hivers doux de la façade atlantique. Coupez les vieilles frondes en fin d'hiver, avant que les nouvelles ne se déroulent.",
    givesNote:
      "Ses grandes frondes arquées offrent un couvert toute l'année et retiennent la litière de feuilles sur une pente ombragée, abritant grenouilles, coléoptères et autre petite faune. Les fougères nourrissent très peu de chenilles — celle-ci est retenue pour sa structure à l'ombre et sa lutte contre l'érosion, pas pour sa valeur alimentaire.",
    propagationNote:
      "On peut l'élever à partir des spores qui mûrissent au dos des frondes, mais c'est lent et délicat. Bien plus facile : déterrez une touffe installée au printemps et séparez la souche en éclats, chacun avec des racines et quelques frondes.",
  },

  // -------------------------------------------------------------------------
  // Les sosies (`data/lookalikes.ts`) que croisent les pages ci-dessus. Une
  // plante imposteur est un taxon comme un autre : elle est rangée ici sous son
  // nom scientifique, avec les deux paragraphes qui la décrivent. Les
  // différences à repérer, elles, appartiennent à la page où elles s'affichent
  // et vivent dans l'entrée de la plante indigène concernée.
  // -------------------------------------------------------------------------
  "Robinia pseudoacacia": {
    origin:
      "Indigène des Appalaches, en Amérique du Nord ; planté en Europe depuis les années 1600.",
    blurb:
      "En France on l'appelle « acacia », il donne le miel du même nom, et c'est l'un des arbres exotiques envahissants les plus répandus d'Europe. Chaque racine coupée renvoie des rejets, et l'azote que ses racines apportent aux sols pauvres change la terre elle-même : ce sont les orties et les ronces qui suivent, et non la prairie qui était là.",
  },
  "Prunus laurocerasus": {
    origin: "Indigène des Balkans, de Turquie et des rivages de la mer Noire.",
    blurb:
      "La haie persistante par défaut de la moitié de l'Europe. Les oiseaux emportent ses fruits noirs jusque dans les bois, où il forme un sous-étage sombre et dense que rien ne traverse. Froissées ou broyées, ses feuilles dégagent du cyanure — raison pour laquelle ses déchets de taille ne doivent jamais approcher un animal.",
  },
  "Lonicera japonica": {
    origin: "Indigène d'Asie de l'Est.",
    blurb:
      "La liane au parfum sucré dont les enfants arrachent les fleurs pour en goûter la goutte de nectar. Elle garde ses feuilles l'hiver, s'enroule assez serré pour étrangler ce qu'elle escalade et recouvre des sous-bois entiers — l'une des lianes envahissantes les plus répandues de l'est des États-Unis, et en progression dans l'ouest de l'Europe.",
  },
};
