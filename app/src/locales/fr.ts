// Français.
//
// Typed against `Dict` (derived from `en.ts`), so this file cannot compile with
// a key missing or invented — a half-translated screen is a build error, not a
// surprise on someone's phone.
//
// The register matches the English: plain, warm, addressed to a beginner who
// may be seventy and has never heard the word "keystone". Vouvoiement
// throughout — it's the register a public-service tool speaks in French, and
// it never sounds cold when the sentences are this direct. Where English glosses
// a term of art in parentheses, French does the same rather than importing the
// English word.
//
// Typography is French: « » for quotes and a narrow no-break space before the
// double punctuation marks (: ; ! ?) and inside guillemets.
import type { Dict } from "./en";

export const fr: Dict = {
  // ---------------------------------------------------------------------
  // Unités. "pi"/"po" are the French abbreviations for foot and inch — a
  // reader who picks imperial in French still reads French.
  // ---------------------------------------------------------------------
  "units.ft": "pi",
  "units.inches": "pouces",
  "units.m": "m",
  "units.cm": "cm",
  "units.mm": "mm",

  // ---------------------------------------------------------------------
  // Habillage de l'application.
  // ---------------------------------------------------------------------
  "app.title": "Indigene — les plantes indigènes de l'endroit exact où vous êtes",
  "app.name": "Indigene",
  "app.skipToContent": "Aller au contenu principal",
  "app.offline": "Hors ligne — données enregistrées",
  "nav.sections": "Rubriques",
  "nav.explore": "Explorer",
  "nav.search": "Rechercher",
  "nav.wildlife": "Faune",
  "nav.menu": "Menu",
  "nav.savedLocations": "Lieux enregistrés",
  "nav.settings": "Réglages",
  "nav.languageAndUnits": "Langue et unités",
  "footer.text":
    "Libre (licence MIT), bâti sur des données scientifiques publiques — {sources}, et à quel point nous en sommes sûrs. {about}. {releaseNotes}. {privacy}.",
  "footer.about": "À propos",
  "footer.sources": "d'où viennent nos chiffres",
  "footer.releaseNotes": "Voir les nouveautés",
  "footer.privacy": "Vie privée et sécurité",
  // L'espace avant le deux-points est une fine insécable (U+202F) : c'est la
  // règle française, et elle empêche aussi le deux-points de passer seul à la
  // ligne suivante.
  "footer.languageIs": "Langue : {value}",
  "footer.unitsIs": "Unités : {value}",
  "steps.progress": "Progression",
  "steps.start": "Début",
  "steps.spot": "Lieu",
  "steps.sun": "Soleil",
  "steps.soil": "Sol",
  "steps.plants": "Plantes",
  "steps.saved": "Lieux",
  "steps.browse": "Parcourir",
  "steps.explore": "Explorer",
  "steps.search": "Recherche",
  "steps.wildlife": "Faune",
  "steps.privacy": "Vie privée",
  "steps.sources": "Sources",
  "steps.about": "À propos",
  "steps.settings": "Réglages",

  // ---------------------------------------------------------------------
  // Réglages.
  // ---------------------------------------------------------------------
  "settings.title": "Réglages",
  "settings.lede":
    "Deux choix indépendants : la langue dans laquelle vous lisez, et les unités dans lesquelles vous mesurez. Toutes les combinaisons sont possibles.",
  "settings.language": "Langue",
  "settings.languageHelp":
    "Change tous les mots de l'application. Les noms de plantes et d'animaux suivent aussi, chaque fois qu'une liste nationale nous donne le nom dans votre langue.",
  "settings.units": "Unités",
  "settings.unitsHelp":
    "Les hauteurs, la pluie et le froid de l'hiver. Indépendant de la langue : vous pouvez lire en français et mesurer en pieds si c'est ce qu'utilise votre pépiniériste.",
  "settings.units.auto": "Comme mon appareil",
  "settings.units.metric": "Métrique",
  "settings.units.imperial": "Impérial",
  "settings.units.autoSub": "Ce qu'utilise la région de votre téléphone — {resolved} en ce moment.",
  "settings.units.metricSub": "Mètres, centimètres, millimètres de pluie, °C.",
  "settings.units.imperialSub": "Pieds, pouces, pouces de pluie, °F.",
  "settings.namesNote":
    "Les noms de plantes et d'animaux viennent de la liste nationale de référence de chaque pays, pas d'une traduction automatique — {link}.",
  "settings.namesNoteLink": "voir d'où vient chaque nom",
  "settings.done": "Terminé",

  // ---------------------------------------------------------------------
  // Accueil.
  // ---------------------------------------------------------------------
  "welcome.title": "Faites revenir les oiseaux et les papillons, ici et maintenant.",
  "welcome.lede1":
    "La plupart des jardins sont verts mais sans vie : des pelouses, des arbustes et des fleurs dont la faune d'ici ne peut pas se nourrir, et qui réclament pourtant arrosage, pesticides et engrais sans arrêt.",
  "welcome.lede2":
    "Les plantes indigènes, elles, ont évolué pour nourrir et abriter les oiseaux, les abeilles et les papillons. Indigene vous aide à leur rendre l'écosystème dont ils ont désespérément besoin.",
  "welcome.noAccount": "Pas de compte, aucun pistage. ",
  "welcome.noAccountRest": "Tout reste dans votre navigateur, et tout fonctionne hors ligne.",
  "welcome.start": "Commencer là où je suis",
  "welcome.ratherNot": "Vous préférez ne pas partager votre position ? {link}.",
  "welcome.ratherNotLink": "Parcourez plutôt les régions et les plantes",
  "welcome.whyTitle": "Pourquoi des plantes indigènes ?",
  "welcome.why1":
    "La plupart des chenilles ne peuvent manger que les plantes avec lesquelles elles ont évolué, et presque tous les oiseaux du jardin élèvent leurs petits avec des chenilles. Pas de plantes indigènes, pas de chenilles, pas d'oisillons.",
  "welcome.why2": "Plantez une indigène, et la chaîne alimentaire repart dès la même saison.",
  "welcome.savedTitle": "Vos lieux enregistrés",
  "welcome.openSaved.one": "Ouvrir le lieu enregistré ({n})",
  "welcome.openSaved.other": "Ouvrir les lieux enregistrés ({n})",

  // ---------------------------------------------------------------------
  // Menu « Lieux » de l'en-tête.
  // ---------------------------------------------------------------------
  "savedMenu.loading": "Chargement…",
  "savedMenu.error": "Impossible d'ouvrir vos lieux. Fermer les autres onglets Indigene peut aider.",
  "savedMenu.retry": "Réessayer",
  "savedMenu.empty": "Aucun lieu enregistré pour l'instant.",
  "savedMenu.findSpot": "📍 Trouver un lieu à enregistrer",
  "savedMenu.seeAll": "Voir les {n} lieux →",
  "savedMenu.manage": "Gérer mes lieux →",

  // ---------------------------------------------------------------------
  // Parcourir.
  // ---------------------------------------------------------------------
  "browse.title": "Parcourir les régions et les plantes indigènes",
  "browse.lede": "Pas besoin de position : partez plutôt d'une région ou d'une plante remarquable.",
  "browse.regionsTitle.one": "Pour l'instant, une seule région est couverte",
  "browse.regionsTitle.other": "Les régions couvertes jusqu'ici",
  "browse.regionsLede":
    "Les recommandations sont réglées région par région — choisissez celle qui correspond à l'endroit où vous planterez :",
  "browse.outside":
    "Ailleurs, les mesures de soleil et de sol fonctionnent toujours — il manque seulement la liste de plantes. Vous voulez la vôtre ? {link}.",
  "browse.outsideLink": "Proposez votre région sur GitHub",
  "browse.plantTitle": "Ou partez d'une plante",
  "browse.plantLede":
    "Faites connaissance avec une indigène remarquable de chaque région, puis voyez si elle se plairait chez vous :",
  "browse.exploreBtn": "🌿 Explorer les indigènes",
  "browse.home": "Accueil",
  "browse.startFromSpot": "Partir plutôt d'un lieu",

  // ---------------------------------------------------------------------
  // Lieux enregistrés.
  // ---------------------------------------------------------------------
  "saved.title": "Vos lieux enregistrés",
  "saved.empty":
    "Rien d'enregistré pour l'instant. Trouvez un lieu et touchez « Enregistrer ce lieu » pour le garder ici, sur votre téléphone.",
  "saved.find": "Trouver un lieu",
  "saved.sunUnknown": "Soleil non mesuré",
  "saved.open": "Ouvrir",
  "saved.deleteLabel": "Supprimer {label}",
  "saved.confirmDelete": "Supprimer « {label} » ? C'est définitif.",
  "saved.deleted": "Supprimé.",
  "saved.privacy":
    "Ces lieux ne vivent que sur cet appareil — ils n'en sortent jamais, et nous ne pouvons pas les voir",
  "saved.findAnother": "Trouver un autre lieu",

  // ---------------------------------------------------------------------
  // Explorer.
  // ---------------------------------------------------------------------
  "explore.title": "À la rencontre des indigènes",
  "explore.lede":
    "{plants} plantes indigènes réparties sur les {regions} régions couvertes jusqu'ici. Ouvrez celle où vous vivez pour voir toute sa liste — ou touchez la plante en couverture d'une carte pour faire sa connaissance.",
  "explore.byWildlife": "Ou parcourir par animal → ",
  "explore.byWildlifeSub":
    "partez du monarque, du colibri ou de la tortue que vous espérez voir, et trouvez les plantes qui le font vivre.",
  "explore.starring": "En vedette",
  "explore.keystoneTitle": "Plante clé de voûte — elle fait vivre bien plus d'animaux que la moyenne",
  "explore.keystoneLabel": "Plante clé de voûte",
  "explore.caterpillarSpecies": "{n} espèces de chenilles",
  "explore.statPlants": "{n} plantes indigènes sur la liste d'Indigene pour {region}",
  "explore.statKeystone.one": "{n} plante clé de voûte — celles sur lesquelles tout le réseau alimentaire s'appuie",
  "explore.statKeystone.other": "{n} plantes clés de voûte — celles sur lesquelles tout le réseau alimentaire s'appuie",
  "explore.statWildlife": "{n} espèces animales dont le lien avec ces plantes est documenté",

  // ---------------------------------------------------------------------
  // Localisation (étape 1).
  // ---------------------------------------------------------------------
  "location.title": "Où vous tenez-vous ?",
  "location.lede":
    "Récupérez votre position, puis vérifiez la carte : si le repère n'est pas là où vous êtes vraiment, faites-le glisser ou touchez le bon endroit.",
  "location.whyTitle": "Pourquoi l'endroit exact compte-t-il ?",
  "location.why":
    "« Indigène » veut toujours dire indigène de quelque part. Vos coordonnées décident quelle liste régionale s'applique et vont chercher le sol, le climat et l'écorégion de cet endroit précis — la même espèce peut être une clé de voûte dans une région et une étrangère dans la suivante.",
  "location.use": "📍 Utiliser ma position",
  "location.update": "📍 Actualiser ma position",
  "location.locating": "Localisation…",
  "location.none": "Pas encore de position.",
  "location.privacy":
    "Votre position ne sert qu'à trouver ce qui pousse ici, uniquement quand vous le demandez, et ne quitte jamais votre appareil autrement que sous forme de requêtes anonymes",
  "location.mapLabel":
    "Carte. Le repère reste au centre. Faites glisser ou touchez pour amener votre lieu dessous, ou utilisez les flèches du clavier pour l'ajuster — maintenez Maj pour de plus grands pas.",
  "location.osmAttribution": "© les contributeurs d'OpenStreetMap",
  "location.gpsFix": "point GPS",
  "location.accuracy": " · précision GPS ±{m} m",
  "location.nudged": " · déplacé de {m} m",
  "location.noGeolocation": "Cet appareil ne peut pas partager sa position — essayez la recherche par commune.",
  "location.denied": "Position refusée — essayez la recherche par commune.",
  "location.noFix": "Impossible d'obtenir un point — réessayez, ou passez à la recherche par commune.",
  "location.searchTitle": "Pas de GPS ? Cherchez votre commune",
  "location.searchLabel": "Votre commune, ville ou code postal",
  "location.searchPlaceholder": "ex. Nantes, ou 44000",
  "location.search": "Rechercher",
  "location.searching": "Recherche…",
  "location.searchNoResults":
    "Nom introuvable. Essayez la commune et la région ensemble — « Saint-Denis Réunion » par exemple — ou le code postal qui figure sur votre courrier.",
  "location.searchOffline":
    "La recherche de lieux a besoin d'une connexion et nous n'avons pas pu l'atteindre. Si le GPS fonctionne, revenez à votre position — ou choisissez votre région à la main.",
  "location.pinSet": "Repère placé au centre de {place}. ",
  "location.pinSetRest":
    "C'est suffisant pour choisir votre région, votre climat et votre liste de plantes — et l'estimation du soleil viendra de vous à l'étape suivante, pas de la carte. Seules les lectures de sol et de pente tiennent à l'endroit exact : si vous êtes loin du centre, faites glisser le repère à peu près sur votre terrain.",
  "location.pinSetUncovered":
    "Repère placé au centre de {place} — mais nous n'avons pas encore de liste de plantes pour cette zone.",
  "location.noListHere": "Nous n'avons pas encore de liste de plantes pour cette zone.",
  "location.coverage":
    "Les listes d'Indigene sont réglées région par région, et ce lieu est en dehors de toutes — nous n'aurions donc rien d'honnête à vous recommander ici. Les mesures de soleil et de sol fonctionnent toujours. En attendant, vous pouvez :",
  "location.coverageBrowse": "Parcourir les plantes indigènes des régions couvertes",
  "location.coverageBrowseRest": " pour voir le genre de recommandations qu'Indigene donne.",
  "location.coverageAsk": "Demander votre région sur GitHub",
  "location.coverageAskRest":
    " — ouvrez un ticket avec votre code postal ou votre commune. Ou ajoutez la région vous-même : c'est un fichier de données plus deux lignes de registre.",
  "location.regionTitle": "🗺️ Choisissez votre région",
  "location.regionLede":
    "Si vous savez déjà dans laquelle de nos régions — ou dans quelle écorégion — vous vous trouvez, vous pouvez sauter la carte. À savoir : sans point sur la carte, nous ne pouvons pas consulter votre sol, votre pluviométrie ni le froid de vos hivers. Vous répondrez donc vous-même aux questions de soleil et d'humidité, et la liste s'appuiera sur ce que vous nous direz.",
  "location.regionShowAll": "Ce n'est pas celle-ci ? Afficher toutes les régions",
  "location.switchFromGps": "Vous ne voulez pas utiliser votre position ? {a} ou {b}.",
  "location.switchFromOther": "Vous avez changé d'avis ? {a} ou {b}.",
  "location.switchZip": "cherchez votre commune",
  "location.switchGps": "utilisez le GPS",
  "location.switchRegion": "choisissez une région",
  "location.pickFirst": "Choisissez d'abord une région.",
  "location.usingList": "Liste {region} retenue — votre choix.",
  "location.back": "Retour",
  "location.next": "Suite : mesurer le soleil →",

  // ---------------------------------------------------------------------
  // Soleil (étape 2).
  // ---------------------------------------------------------------------
  "sun.title": "Combien de soleil ce lieu reçoit-il ?",
  "sun.ledeWithScan": "Choisissez ce qui s'en rapproche le plus — le balayage du ciel, plus bas, peut l'affiner.",
  "sun.lede": "Choisissez ce qui s'en rapproche le plus.",
  "sun.whyTitle": "Pourquoi commencer par le soleil ?",
  "sun.why":
    "Le nombre d'heures de soleil direct décide de ce qui poussera mieux que tout ce que vous pourriez mesurer d'autre. Et l'ombre n'est pas un défaut : il existe une indigène pour chaque niveau de lumière, des fleurs de prairie aux fougères de sous-bois. La lumière décide seulement lesquelles.",
  "sun.full": "Ensoleillé la plus grande partie du jour",
  "sun.fullSub": "Six heures de soleil direct ou plus — pelouse dégagée, côté sud, pas de grand arbre à proximité.",
  "sun.half": "Du soleil environ la moitié du jour",
  "sun.halfSub":
    "Quelques heures de soleil direct, de l'ombre le reste du temps — près d'un bâtiment ou sous des arbres épars.",
  "sun.shade": "Plutôt ombragé",
  "sun.shadeSub": "Peu de soleil direct — sous les arbres, au nord, ou encadré par des murs.",
  "sun.thisSpotGets": "Ce lieu reçoit ",
  "sun.bestGuess": "Estimation : {hours} heures, sans doute entre {low} et {high}.",
  "sun.fromScan": "Mesuré à partir de votre balayage du ciel.",
  "sun.fromPickWithScan": "D'après votre choix rapide — balayez le ciel ci-dessous pour une estimation plus fine.",
  "sun.fromPick": "D'après votre choix rapide.",
  "sun.next": "Suite : vérifier le sol et le climat →",
  "sun.deciduous": "🍂 Des arbres au-dessus qui perdent leurs feuilles ?",
  "sun.deciduousSub":
    "Les branches nues rendent le printemps et l'automne bien plus lumineux — nous en tiendrons compte.",
  "sun.scanTitle": "📷 Balayer le ciel pour affiner l'estimation",
  "sun.scanLede":
    "Pointez votre téléphone vers l'horizon et tournez lentement sur vous-même, un tour complet. Nous relèverons la hauteur des arbres et des toits, et calculerons les vraies heures de soleil de cet endroit précis. Il faut l'accès à la caméra et aux capteurs de mouvement — vous pouvez tout à fait passer cette étape.",
  "sun.scanStart": "Démarrer le balayage",
  "sun.back": "Retour",

  // ---------------------------------------------------------------------
  // Balayage du ciel (étape 2b).
  // ---------------------------------------------------------------------
  "scan.title": "Balayez votre ciel",
  "scan.lede":
    "Levez votre téléphone et visez, avec la croix, le sommet des arbres, des toits ou des clôtures autour de vous. Tournez lentement sur un tour complet en gardant la croix sur l'horizon. Nous en déduirons le soleil que ce lieu reçoit vraiment.",
  "scan.permissionNote":
    "Nécessite la caméra et les capteurs de mouvement. Tout reste sur votre téléphone — aucune vidéo n'est enregistrée ni envoyée nulle part.",
  "scan.enable": "Autoriser caméra et mouvement",
  "scan.skip": "Passer — je prends le choix rapide",
  "scan.hud": "Visez l'horizon et tournez lentement…",
  "scan.turnFirst": "Faites d'abord un tour complet…",
  "scan.keepTurning": "Continuez à tourner… {pct} %",
  "scan.use": "Utiliser ce balayage →",
  "scan.cancel": "Annuler le balayage",
  "scan.reading": "Face au {dir} ({deg}°) · horizon à {up}° · {pct} % du tour balayé",
  "scan.compassWarn":
    "À savoir : la boussole de ce téléphone est déduite des capteurs de mouvement et peut dériver. Si l'estimation vous paraît fausse, prenez plutôt le choix rapide.",
  "scan.updated": "Estimation du soleil mise à jour d'après votre balayage.",
  "scan.noCameraTitle": "La caméra n'est pas disponible",
  "scan.noCamera":
    "Nous n'avons pas pu ouvrir la caméra — elle est peut-être bloquée, ou ce navigateur ne l'autorise pas. Ce n'est pas grave du tout : le choix rapide fait tout aussi bien l'affaire pour la plupart des lieux.",
  "scan.noMotionTitle": "Les capteurs de mouvement ne sont pas disponibles",
  "scan.noMotion":
    "Votre caméra fonctionne, mais ce téléphone ne partage pas sa boussole, donc nous ne pouvons pas mesurer les angles du soleil de façon fiable. Plutôt que de deviner, prenez le choix rapide — vous connaissez ce lieu mieux qu'un capteur hésitant.",
  "scan.useQuickPick": "Prendre plutôt le choix rapide",
  "compass.N": "N",
  "compass.NE": "NE",
  "compass.E": "E",
  "compass.SE": "SE",
  "compass.S": "S",
  "compass.SW": "SO",
  "compass.W": "O",
  "compass.NW": "NO",

  // ---------------------------------------------------------------------
  // Confirmation (étape 3).
  // ---------------------------------------------------------------------
  "confirm.title": "Voici ce que nous pensons de ce lieu",
  "confirm.loading": " Recherche du sol, de l'altitude et du climat…",
  "confirm.sun": "Soleil : ",
  "confirm.sunRange": "(environ {low} à {high} heures ; {source}).",
  "confirm.sunFromScan": "mesuré par balayage",
  "confirm.sunFromPick": "votre choix rapide",
  "confirm.changeSun": "Modifier l'estimation du soleil",
  "confirm.noSiteOnline":
    "Nous n'avons pas pu joindre les services de sol et de climat (pas de réseau, ou ils sont en panne). Vous pouvez quand même obtenir des recommandations : indiquez simplement l'humidité ci-dessous d'après ce que vous voyez, et nous laisserons de côté ce que nous n'avons pas pu consulter.",
  "confirm.noSiteManual":
    "Vous avez choisi votre région vous-même : il n'y a donc pas de point sur la carte d'où tirer le sol, la pluie ou le froid de l'hiver. Ce n'est pas grave — indiquez l'humidité ci-dessous d'après ce que vous voyez, et le classement s'appuiera sur vos réponses de soleil et d'humidité.",
  "confirm.climateTitle": "Climat et terrain",
  "confirm.winterCold": "Froid hivernal",
  "confirm.zoneMapLink": "Voir la carte des zones USDA →",
  "confirm.rainfall": "Pluie",
  "confirm.rainfallValue": "Environ {amount} de pluie par an.",
  "confirm.elevation": "Altitude et pente",
  "confirm.elevationValue": "{height} d'altitude{slope}.",
  "confirm.elevationSlope": ", sur {slope}",
  "confirm.region": "Région",
  "confirm.localArea": "Secteur local",
  "confirm.localAreaValue": "{name} (niveau IV de l'EPA, plus fin).",
  "confirm.soilTitle": "Le sol (d'après la carte — à vérifier)",
  "confirm.soilSays": "La carte des sols indique",
  "confirm.soilNone":
    "Nous n'avons pas de relevé de sol ici — le test de soixante secondes ci-dessous vous dira ce que vous avez.",
  "confirm.acidity": "Acidité",
  "confirm.soilCoarse": "La carte des sols est grossière. ",
  "confirm.soilCoarseRest":
    "Elle peut couvrir plusieurs hectares et ignorer que la bande le long de votre allée est de l'argile tassée. Faites le test de soixante secondes ci-dessous et faites davantage confiance à ce que vous trouvez qu'à la carte.",
  "confirm.moistureTitle": "Ce lieu reste-t-il humide ?",
  "confirm.moistureLede":
    "C'est la correction la plus utile que vous puissiez apporter. Choisissez ce qui correspond après une grosse pluie.",
  "confirm.moistureWhyTitle": "Pourquoi ne pas simplement amender le sol ?",
  "confirm.moistureWhy":
    "Les indigènes sont déjà adaptées au sol que vous avez : le sable sec, l'argile lourde, les creux détrempés ont chacun leurs spécialistes. L'astuce est de choisir la plante qui convient au sol, pas de charrier des amendements pour convenir à la plante. Répondez honnêtement et les bonnes remonteront d'elles-mêmes.",
  "confirm.dry": "Sec",
  "confirm.mesic": "Frais, jamais détrempé",
  "confirm.wet": "Humide",
  "confirm.deciduous":
    "Des arbres au-dessus qui perdent leurs feuilles en hiver (le lieu devient plus lumineux au printemps et à l'automne).",
  "confirm.back": "Retour",
  "confirm.next": "Voir mes plantes →",
  "confirm.kvLabel": "{k} : ",
  "confirm.ribbonTitle": "🤲 Le test de sol en soixante secondes",
  "confirm.ribbon1": "Prenez une petite poignée de terre et humidifiez-la : humide, mais sans qu'elle dégoutte.",
  "confirm.ribbon2":
    "Serrez et pétrissez-la en boule. Si elle ne tient pas du tout et qu'elle crisse, c'est du sable → choisissez « Sec » ci-dessus.",
  "confirm.ribbon3": "Écrasez-la entre le pouce et l'index pour en faire un ruban plat.",
  "confirm.ribbon4":
    "Un ruban court qui casse vite et paraît doux = limon → « Frais ». Un ruban long, souple et collant = argile → souvent « Humide ».",
  "confirm.ribbonNote":
    "Ce que vous avez dans la main l'emporte sur la carte. Réglez l'humidité ci-dessous en conséquence.",

  // ---------------------------------------------------------------------
  // Vocabulaire en mots simples (lib/plain.ts).
  // ---------------------------------------------------------------------
  "moisture.word.dry": "sec",
  "moisture.word.mesic": "frais",
  "moisture.word.wet": "humide",
  "sun.label.full": "plein soleil",
  "sun.label.partSun": "soleil une bonne partie du jour",
  "sun.label.partShade": "mi-ombre",
  "sun.label.fullShade": "ombre complète",
  "sun.gloss.full": "du soleil direct la plus grande partie du jour",
  "sun.gloss.partSun": "du soleil une bonne partie de la journée, de l'ombre le reste",
  "sun.gloss.partShade": "quelques heures de soleil direct, de l'ombre le reste",
  "sun.gloss.fullShade": "peu ou pas de soleil direct",
  "sun.plain.one": "environ {n} heure de soleil direct par jour — c'est {label} ({gloss})",
  "sun.plain.other": "environ {n} heures de soleil direct par jour — c'est {label} ({gloss})",
  "moisture.plain.dry":
    "sec — l'eau file vite et la terre reste sèche, comme sur un talus sableux ou sous un débord de toit",
  "moisture.plain.mesic":
    "frais — humide après la pluie mais jamais détrempé ; la situation moyenne, celle de la plupart des jardins",
  "moisture.plain.wet": "humide — la terre reste mouillée, l'eau stagne après la pluie ou s'accumule dans un creux",
  "zone.unknown": "Nous n'avons pas pu établir la rigueur de vos hivers.",
  "zone.coldWithTemp": "Vos nuits d'hiver les plus froides descendent jusqu'à environ {temp}",
  "zone.coldNoTemp": "Voici la rigueur de vos hivers",
  "zone.plain":
    "{cold} — les étiquettes de pépinière appellent cela « zone USDA {zone} ». Une plante est dite « rustique » ici si elle survit à ce froid.",
  "ph.unknown": "Acidité du sol inconnue.",
  "ph.acidic": "pH {v} — sol acide (pensez aux myrtilles, aux bois de pins)",
  "ph.neutral": "pH {v} — proche du neutre, ce qui convient à la plupart des plantes",
  "ph.alkaline": "pH {v} — sol calcaire, alcalin",
  "texture.unknown": "Texture du sol inconnue.",
  "texture.sand": "{t} — granuleux, l'eau file, sèche vite",
  "texture.clay": "{t} — lourd et collant quand il est mouillé, retient l'eau, peut rester détrempé",
  "texture.loam": "{t} — le mélange « idéal » de sable, de limon et d'argile, celui que presque tout aime",
  "texture.silt": "{t} — doux et farineux à sec, retient bien l'humidité",
  "slope.flat": "un terrain quasiment plat",
  "slope.gentle": "une pente douce",
  "slope.noticeable": "une pente marquée — l'érosion peut poser problème ici",
  "slope.steep": "une forte pente — retenir la terre compte énormément ici",

  "score.host.name": "Nourrit les futurs papillons",
  "score.host.plain":
    "Combien de sortes de chenilles peuvent manger cette plante. Les chenilles sont la nourriture avec laquelle grandissent les oisillons : c'est donc la meilleure mesure, à elle seule, de la vie qu'une plante fait vivre.",
  "score.pollinator.name": "Nourrit abeilles et papillons",
  "score.pollinator.plain":
    "Le nectar et le pollen pour les abeilles et les papillons adultes, et la durée de la floraison.",
  "score.bird.name": "Nourrit et abrite les oiseaux",
  "score.bird.plain": "Des baies, des graines et des endroits où nicher — plus les chenilles qu'elle élève.",
  "score.stormwater.name": "Absorbe la pluie",
  "score.stormwater.plain": "Des racines profondes qui font pénétrer l'eau de pluie au lieu de la laisser ruisseler.",
  "score.erosion.name": "Retient la terre",
  "score.erosion.plain": "Des racines qui agrippent le talus et l'empêchent de partir avec l'eau.",
  "score.carbon.name": "Stocke du carbone",
  "score.carbon.plain":
    "Du carbone tiré de l'air et rangé dans le bois et les racines. Honnêtement modeste à l'échelle d'un jardin — nous le comptons, sans promettre de miracle.",
  "score.establishment.name": "Se débrouille seule",
  "score.establishment.plain": "Ses chances de s'en sortir sans arrosage ni soins une fois plantée.",

  "wildlifeKind.butterfly.title": "Papillons de jour",
  "wildlifeKind.butterfly.blurb":
    "Choisissez un papillon pour voir quelles indigènes élèvent ses chenilles ou nourrissent les adultes.",
  "wildlifeKind.moth.title": "Papillons de nuit",
  "wildlifeKind.moth.blurb":
    "L'équipe de nuit — y compris les grands paons et sphinx, dont les chenilles sont la nourriture de choix des oisillons.",
  "wildlifeKind.bee.title": "Abeilles et autres pollinisateurs",
  "wildlifeKind.bee.blurb":
    "Les abeilles sauvages, dont beaucoup ne peuvent élever leurs larves que sur une seule famille de fleurs.",
  "wildlifeKind.bird.title": "Oiseaux",
  "wildlifeKind.bird.blurb":
    "Les baies, les graines, le nectar et les chenilles qui expliquent la présence des oiseaux que vous aimeriez voir.",
  "wildlifeKind.mammal.title": "Mammifères et autres",
  "wildlifeKind.mammal.blurb": "Glands et fruits pour les voisins à quatre pattes — et un reptile ou deux.",

  "support.host.term": "Nourricière",
  "support.host.plain":
    "Une plante nourricière (dite aussi « plante-hôte ») : les chenilles mangent ses feuilles et y grandissent. C'est le lien le plus fort — c'est de là que vient la génération suivante de papillons, et les chenilles sont ce dont presque tous les oisillons sont nourris.",
  "support.nectar.term": "Nectar",
  "support.nectar.plain":
    "Du nectar et du pollen pour les insectes adultes — de la nourriture pour les grands, pas une nurserie pour leurs petits.",
  "support.berries.term": "Baies",
  "support.berries.plain":
    "Des baies ou des fruits que mangent oiseaux et mammifères, surtout à l'automne et en hiver.",
  "support.seeds.term": "Graines",
  "support.seeds.plain":
    "Des graines ou des fruits secs que mangent oiseaux et mammifères — souvent ce qui reste debout une fois les fleurs fanées.",
  "support.shelter.term": "Abri",
  "support.shelter.plain": "Un couvert où nicher, brouter, se percher ou passer la mauvaise saison.",

  "reliance.sole.term": "Indispensable",
  "reliance.sole.plain":
    "Cette plante est la seule option de l'animal — un lien obligatoire, sans remplaçante. Elle disparaît d'ici, l'animal disparaît avec elle. Ce sont les relations vitales (le monarque a besoin d'asclépiade ; l'atala a besoin de zamia).",
  "reliance.narrow.term": "Spécialiste",
  "reliance.narrow.plain":
    "Une relation de spécialiste : l'animal ne peut utiliser qu'un petit groupe de plantes, et celle-ci en fait partie. Important, avec seulement quelques solutions de repli.",
  "reliance.broad.term": "Parmi d'autres",
  "reliance.broad.plain":
    "Utile, mais l'animal se sert de beaucoup de plantes — un coup de pouce, sans être vital à lui seul. Ces liens-là ne portent pas d'étiquette : une plante sans étiquette signifie donc que l'animal a d'autres options.",

  "prop.seed-direct.name": "Semer la graine telle quelle (semis direct)",
  "prop.seed-direct.plain":
    "Le cas facile : nettoyez la graine, puis semez-la à une profondeur d'environ sa propre largeur, en pot ou sur une planche de terre nette, et gardez humide. Aucune astuce nécessaire.",
  "prop.seed-cold-moist.name": "Faire passer un hiver froid et humide à la graine (stratification à froid)",
  "prop.seed-cold-moist.plain":
    "Beaucoup de graines indigènes ne se réveillent qu'après avoir senti un vrai hiver : on lui en fabrique donc un. Mélangez la graine à une poignée de sable humide ou à un essuie-tout mouillé, fermez le tout dans un sachet étiqueté et laissez au réfrigérateur le nombre de semaines indiqué — puis semez. Ou oubliez le réfrigérateur : semez en pot dehors à l'automne et laissez le vrai hiver faire le travail.",
  "prop.seed-double-dormant.name": "Prévoir deux hivers d'attente (double dormance)",
  "prop.seed-double-dormant.plain":
    "Les têtues : la racine sort après un hiver, mais la tige feuillée en attend un second. Semez en pot dehors, gardez-le à l'ombre et à l'abri, ne renoncez pas si rien ne sort le premier printemps, et prenez patience — le vert apparaît en général la deuxième année.",
  "prop.seed-scarify.name": "Entailler ou râper le tégument dur (scarification)",
  "prop.seed-scarify.plain":
    "Certaines graines (celles de la famille des pois surtout) sont enfermées dans une coque imperméable qu'il faut entamer avant que l'eau puisse entrer. Frottez chaque graine quelques coups sur du papier de verre fin, ou entaillez la coque au couteau, jusqu'à apercevoir la couleur plus claire de l'intérieur — puis trempez une nuit et semez. On râpe avec soin, on n'écrase pas.",
  "prop.seed-surface-light.name": "Presser les graines fines en surface — il leur faut la lumière (semis en surface)",
  "prop.seed-surface-light.plain":
    "Des graines fines comme de la poussière, qui doivent voir le jour pour germer : ne les enterrez pas. Répandez-les sur une terre humide, tassez-les pour qu'elles adhèrent, et ne les recouvrez pas. Empêchez la surface de sécher en brumisant ou en couvrant d'un plastique transparent jusqu'à la levée.",
  "prop.seed-warm.name": "Semer frais et tenir au chaud (aucun froid nécessaire)",
  "prop.seed-warm.plain":
    "Le cas des climats doux : pas besoin de froid hivernal. Semez la graine fraîche et nettoyée, tenez-la au chaud et à l'humide — elle lève en général en quelques semaines. La fraîcheur compte : beaucoup de ces graines perdent leur pouvoir germinatif si elles sèchent et attendent.",
  "prop.cuttings-softwood.name": "Bouturer une pousse tendre (bouture herbacée)",
  "prop.cuttings-softwood.plain":
    "À la fin du printemps ou au début de l'été, coupez un morceau long comme la main de pousse tendre et souple, ôtez les feuilles du bas et enfoncez l'extrémité coupée dans un terreau humide ou de la perlite. Gardez humide et à l'abri du soleil dur (un sac ou une bouteille transparente sur le pot aide bien) jusqu'à l'enracinement, en quelques semaines.",
  "prop.cuttings-semi-hardwood.name": "Bouturer une pousse qui durcit (bouture semi-aoûtée)",
  "prop.cuttings-semi-hardwood.plain":
    "Au milieu ou à la fin de l'été, prélevez un morceau long comme la main sur une pousse de l'année qui commence à raidir et à devenir ligneuse à la base. Ôtez les feuilles du bas, plantez l'extrémité coupée dans un mélange humide et gardez une ambiance humide. Plus lente à raciner que la bouture tendre, mais plus solide — parfaite pour beaucoup d'arbustes et de persistants à feuilles larges.",
  "prop.cuttings-hardwood.name": "Bouturer un rameau nu d'hiver (bouture ligneuse)",
  "prop.cuttings-hardwood.plain":
    "La bouture la plus simple qui soit pour les saules, les cornouillers et leurs semblables : pendant que la plante est nue et au repos, coupez des morceaux gros comme un crayon et longs comme l'avant-bras, enfoncez-en la moitié inférieure en pleine terre humide ou en pot, et attendez. Beaucoup s'enracinent d'ici au printemps sans le moindre soin.",
  "prop.division.name": "Diviser la touffe (division)",
  "prop.division.plain":
    "Pour les vivaces et les graminées en touffe : au début du printemps ou à l'automne, déterrez la plante entière, puis séparez ou coupez la souche en plusieurs éclats, chacun avec ses propres racines et quelques pousses. Replantez aussitôt à la même profondeur et arrosez. Cela rajeunit au passage une touffe fatiguée et creuse au centre.",
  "prop.layering.name": "Enraciner une branche encore attachée (marcottage)",
  "prop.layering.plain":
    "Une astuce presque infaillible : courbez une branche basse et souple jusqu'au sol, griffez l'écorce à l'endroit du contact, maintenez-la avec une pierre ou un crochet, et buttez de terre par-dessus. Elle s'enracine là pendant que la plante mère la maintient en vie ; une saison ou deux plus tard, coupez et déterrez votre nouvelle plante.",
  "prop.root-cuttings.name": "Multiplier par morceaux de racine (bouture de racine)",
  "prop.root-cuttings.plain":
    "Pour les plantes qui repartent volontiers de leurs racines : à la fin de l'automne ou en hiver, déterrez et coupez des morceaux de racine gros comme un crayon et longs comme un doigt, couchez-les à plat dans une caissette de mélange humide sous une fine couche de terre, et tenez au chaud. De nouvelles pousses sortent des morceaux enterrés.",
  "prop.suckers.name": "Prélever les rejets qu'elle pousse autour d'elle (drageons)",
  "prop.suckers.plain":
    "Les plantes qui forment des fourrés émettent de nouvelles pousses enracinées à quelque distance du tronc. Au début du printemps, tranchez à la bêche entre le rejet et la plante mère, soulevez le rejet avec ses racines et replantez-le. Des plantes gratuites, et la touffe s'en trouve nettoyée.",
  "prop.runners.name": "Mettre en pot les bébés portés par les stolons (stolons)",
  "prop.runners.plain":
    "Les fraisiers et autres rampantes émettent des tiges horizontales qui enracinent de petits plants le long du chemin. Dès qu'un plant a ses propres racines, coupez le stolon qui le relie à la mère, déterrez-le et déplacez-le — ou fixez-le d'abord dans un petit pot, puis coupez.",
  "prop.spores.name": "Semer la poussière du dos des frondes (spores)",
  "prop.spores.plain":
    "Les fougères ne font pas de graines — elles répandent des spores fines comme de la poussière depuis les taches brunes sous les frondes mûres. Plus lent et plus délicat, mais faisable : posez une fronde mûre sur du papier une journée pour recueillir la poussière brune, répandez-la à la surface d'un mélange stérile humide, couvrez d'un plastique transparent et gardez clair et humide. Un film vert apparaît d'abord, puis de minuscules fougères au fil des mois. La plupart des jardiniers trouvent bien plus facile de diviser une touffe existante.",

  "growth.quick": "Vite installée : comptez à peu près sa taille définitive en trois ans.",
  "growth.steady": "Une croissance régulière : proche de sa taille adulte à {year} ans.",
  "growth.slowish":
    "Elle prend son temps : environ {frac} de sa hauteur définitive à {year} ans, et elle s'étoffe encore des années après.",
  "growth.slow":
    "Lente et de longue vie : environ {now} à {year} ans, en route vers {mature} — on la plante autant pour la génération suivante que pour soi.",
  "frac.threeQuarters": "les trois quarts",
  "frac.twoThirds": "les deux tiers",
  "frac.half": "la moitié",
  "confidence.high": "Nous sommes assez sûrs de celle-ci — les chiffres viennent de données bien établies.",
  "confidence.medium": "Raisonnablement confiants, mais certains chiffres sont estimés d'après des espèces proches.",
  "confidence.low": "Estimation grossière — à prendre comme un point de départ, pas comme une vérité.",
  // ---------------------------------------------------------------------
  // Noms des espèces.
  // ---------------------------------------------------------------------
  "names.englishName": "Nom anglais : {name}",
  "names.untranslated":
    "Une partie de la description de cette plante est encore en anglais — nous traduisons les textes région par région, et nous n'en sommes pas encore à celle-ci.",
  "names.partlyNamed":
    "{named} de ces {total} plantes portent un nom dans votre langue, tiré d'une liste nationale de référence ; les autres affichent leur nom scientifique, parce qu'en inventer un serait pire que de n'en donner aucun.",

  // Le dessin des tailles.
  "sizeViz.you": "Vous",
  "sizeViz.year": "An {n}",

  // ---------------------------------------------------------------------
  // Fiche de plante.
  // ---------------------------------------------------------------------
  "badge.keystone": "Plante clé de voûte",
  "badge.keystoneTitle":
    "Une plante clé de voûte fait vivre bien plus d'animaux que la moyenne — la perdre défait tout le réseau alimentaire local.",
  "badge.noWater": "Survit sans arrosage",
  "badge.noWaterTitle":
    "Devrait s'installer et survivre sans aucun arrosage après la plantation, lors d'une année normale.",
  "badge.needsWater": "A besoin d'eau pour s'installer",
  "badge.petToxic": "Toxique si on l'avale",
  "badge.thorny": "Épineuse",
  "badge.aggressive": "S'étale — laissez-lui de la place",
  "badge.deerResistant": "Les chevreuils l'évitent en général",
  "match.good": "Bon choix pour ce lieu",
  "match.ok": "Envisageable ici",
  "match.poor": "Mauvais choix — voici pourquoi",
  "card.sizeCaption":
    "Dessinée à l'échelle, à côté d'une personne de {human}. Atteint à terme environ {height} de haut et {spread} de large.",
  "card.weightedHigh": "★ (vous y accordez beaucoup d'importance)",
  "card.hostSpecies": "{n} espèces",
  "card.whyRanks": "🦋 Pourquoi ce rang — valeur écologique {score}/100",
  "card.bloomRange": "Fleurit de {from} à {to} ({color}).",
  "card.foliage": "Cultivée pour son feuillage, pas pour ses fleurs.",
  "card.gives": "Ce qu'elle apporte, à vous et à la faune : ",
  "card.needs": "Ce qu'elle attend de vous : ",
  "card.bloomMoisture": "Floraison et humidité : ",
  "card.prefersSoil": "Préfère un sol {bands}.",
  "card.confidence": "Confiance : {level}. ",
  "card.source": "Source : ",
  "card.howSure": "À quel point en sommes-nous sûrs ? →",
  "card.sizeAria": "Taille de {name} au fil du temps — {parts}.",
  "card.sizeAriaPart": "an {year} : {height} de haut",
  "confidence.word.high": "élevée",
  "confidence.word.medium": "moyenne",
  "confidence.word.low": "faible",

  // ---------------------------------------------------------------------
  // Couleurs de floraison.
  // ---------------------------------------------------------------------
  "color.blue": "bleu",
  "color.blue-purple": "bleu-violet",
  "color.blue-violet": "bleu violacé",
  "color.brown": "brun",
  "color.coral-red": "rouge corail",
  "color.cream": "crème",
  "color.cream-pink": "crème et rose",
  "color.creamy-white": "blanc crème",
  "color.green": "vert",
  "color.greenish": "verdâtre",
  "color.greenish-white": "blanc verdâtre",
  "color.greenish-yellow": "jaune verdâtre",
  "color.lavender": "lavande",
  "color.mauve": "mauve",
  "color.orange": "orange",
  "color.orange-red": "rouge orangé",
  "color.orange-tan": "orange fauve",
  "color.pink": "rose",
  "color.pink-lavender": "rose lavande",
  "color.pink-purple": "rose violacé",
  "color.pink-red": "rose rouge",
  "color.pink-white": "rose et blanc",
  "color.pink-yellow": "rose et jaune",
  "color.purple": "violet",
  "color.purple-brown": "violet brun",
  "color.purple-tan": "violet fauve",
  "color.red": "rouge",
  "color.red-yellow": "rouge et jaune",
  "color.silvery": "argenté",
  "color.tan": "fauve",
  "color.white": "blanc",
  "color.white-pink": "blanc et rose",
  "color.yellow": "jaune",

  // ---------------------------------------------------------------------
  // Résultats.
  // ---------------------------------------------------------------------
  "results.title": "Les plantes pour ce lieu",
  "results.regionTag": "📍 {region}",
  "results.regionTagPick": "📍 {region} — votre choix, pas une mesure faite depuis une position",
  "results.whyTitle": "Comment ce classement fonctionne-t-il ?",
  "results.why":
    "La valeur de chaque plante pour la faune — chenilles hébergées, pollinisateurs et oiseaux nourris, pluie absorbée — est mise en balance avec sa capacité à s'accommoder du soleil, de l'humidité et du froid hivernal de ce lieu. Rien n'est une boîte noire : le détail du score de chaque plante figure sur sa fiche.",
  "results.count":
    "{n} plantes indigènes {fit} — dont {good} conviennent bien ou passablement. Les meilleures d'abord.",
  "results.fitClimate": "s'accommodent du climat de ce lieu",
  "results.fitList": "figurent sur la liste de cette région",
  "results.noneFiltered":
    "Aucune plante de la liste {region} ne passe tous vos filtres. Essayez d'en relâcher un — les limites de taille sont le coupable habituel.",
  "results.noneHardy":
    "Aucune plante de la liste {region} n'est rustique à la température hivernale de ce lieu.",
  "results.showingTop":
    "Nous en montrons {n}. Ajustez les curseurs ci-dessus pour faire remonter les autres.",
  "results.sliderAria": "Importance de : {name}",
  "results.weightsSummary": "⚖️ Qu'est-ce qui compte le plus ?",
  "results.done": "Terminé — montrer les plantes",
  "results.resorted": "Reclassé selon : {name}",
  "results.matchedTo": "Établi pour : ",
  "results.sunSummary": "{label} (~{hours} h de soleil)",
  "results.mesicSoil": "sol frais et jamais détrempé ({link} dans les guides)",
  "results.mesicTerm": "« mésique »",
  "results.soilBand": "sol {word}",
  "results.wintersTo": "hivers descendant jusqu'à environ {temp} ({link})",
  "results.zoneLink": "zone USDA {zone}",
  "results.nativeAll": ". Tout ce qui suit est indigène de cette région{hardy}.",
  "results.andHardy": " et résiste à vos hivers",
  "results.back": "Retour",
  "results.save": "💾 Enregistrer ce lieu",
  "results.savePrompt": "Donnez un nom à ce lieu (par exemple « la bande le long de l'allée »)",
  "results.defaultLabel": "Lieu à {lat}, {lon}",
  "results.saved": "Enregistré sur cet appareil.",
  "results.privacy":
    "Un lieu enregistré ne quitte pas cet appareil — il n'atteint aucun serveur, parce qu'il n'y en a pas",
  "preset.balanced": "Équilibré",
  "preset.butterflies": "Papillons",
  "preset.birds": "Oiseaux",
  "preset.erosion": "Retenir la terre",
  "preset.rain": "Absorber la pluie",
  "preset.easiest": "Les plus faciles",
  "filter.summary": "🔍 Filtres",
  "filter.noWater": "🌾 Survit sans aucun arrosage (mode guérilla)",
  "filter.deer": "🦌 Les chevreuils l'évitent en général",
  "filter.thorns": "🚫 Sans épines",
  "filter.petSafe": "🐕 Sans danger pour les animaux",
  "filter.aggressive": "✋ Pas d'envahissantes",
  "filter.size.lead": "Ne dépasse pas",
  "filter.height.tail": "de haut",
  "filter.spread.tail": "de large",
  "filter.height.aria": "Hauteur maximale acceptée",
  "filter.spread.aria": "Largeur maximale acceptée",
  "noRegion.title": "Pas encore de liste de plantes pour cette zone",
  "noRegion.lede":
    "Indigene a mesuré le soleil, le sol et le climat de ce lieu, mais ses recommandations restent réglées région par région — et ce lieu est en dehors des zones couvertes jusqu'ici. Vous montrer les plantes d'une autre région serait malhonnête, donc nous ne le faisons pas.",
  "noRegion.whatTitle": "Ce que vous pouvez faire malgré tout",
  "noRegion.browse": "Parcourir le catalogue complet",
  "noRegion.browseRest":
    " des régions couvertes — comme exemples du genre de recommandations qu'Indigene donne, et non comme des plantes pour ce lieu.",
  "noRegion.ask": "Demander votre région sur GitHub",
  "noRegion.askRest":
    " — ouvrez un ticket avec votre code postal ou votre commune, pour que nous sachions où grandir ensuite. Ou ajoutez la région vous-même : c'est un fichier de données plus deux lignes de registre, et les contributions sont les bienvenues.",
  "noRegion.regionsTitle": "Les régions couvertes jusqu'ici",
  "noRegion.regionsLede":
    "Si vous savez que votre zone correspond en réalité à l'une d'elles — vous êtes juste de l'autre côté d'une limite, par exemple — vous pouvez utiliser sa liste. Nous la marquerons comme votre choix, et ses plantes seront à considérer comme non vérifiées pour votre zone exacte.",
  "noRegion.pickDifferent": "Choisir un autre lieu",

  // ---------------------------------------------------------------------
  // Les tuiles « en un coup d'œil ».
  // ---------------------------------------------------------------------
  "stat.glance": "{name} en un coup d'œil",
  "stat.tileAria": "{label} : {value}{sub}. Touchez pour savoir ce que cela veut dire.",
  "stat.dialogSource": "Source : ",
  "stat.howSourced": "Comment chaque chiffre est sourcé →",
  "stat.gotIt": "J'ai compris",
  "stat.sun.label": "Soleil",
  "stat.sun.value": "{min} à {max} h/jour",
  "stat.sun.range": "de {lo} à {hi}",
  "stat.sun.explain":
    "La plage d'heures de soleil direct par jour que cette plante accepte. Le soleil est le premier facteur de réussite — et comme il existe une indigène pour chaque niveau de lumière, le but est de coller aux heures que votre lieu reçoit vraiment, pas de lutter contre elles.",
  "stat.moisture.label": "Humidité",
  "stat.moisture.sub": "sols acceptés",
  "stat.moisture.explain":
    "À quel point le sol reste humide après la pluie — pas la fréquence de vos arrosages. Les indigènes se spécialisent : une plante de talus sec pourrit dans un creux humide, et une plante de bord de marais grille sur du sable. Collez à l'humidité que votre lieu a déjà et vous remplacez tout un calendrier d'arrosage par rien du tout. (Les guides appellent « mésique » un sol frais et jamais détrempé.)",
  "stat.moisture.more": "En savoir plus sur les types d'humidité →",
  "stat.moistureWord.dry": "Sec",
  "stat.moistureWord.mesic": "Frais",
  "stat.moistureWord.wet": "Humide",
  "stat.zones.label": "Zones de rusticité",
  "stat.zones.sub": "froid hivernal USDA",
  "stat.zones.explain":
    "Les zones USDA découpent la nuit la plus froide de l'hiver par pas de {step}. Si votre zone tombe dans la plage de cette plante, un hiver normal ne la tuera pas — et une plante indigène de chez vous se situe presque toujours confortablement dans sa zone d'origine. Ni voile, ni paillage d'urgence.",
  "stat.zones.more": "Trouver votre zone sur la carte USDA →",
  "stat.ph.label": "pH du sol",
  "stat.ph.explain":
    "L'acidité ou l'alcalinité du sol — 7 est neutre, en dessous c'est acide, au-dessus c'est calcaire. Les indigènes ont évolué avec la roche et la litière du coin : une plante indigène d'à côté se querelle rarement avec le pH de votre sol. Choisissez ce qui convient et vous n'achèterez jamais d'amendement.",
  "ph.word.acidic": "acide",
  "ph.word.alkaline": "calcaire",
  "ph.word.acidicToAlkaline": "d'acide à calcaire",
  "ph.word.neutral": "proche du neutre",
  "stat.size.label": "Taille adulte",
  "stat.size.sub": "hauteur × largeur, à terme",
  "stat.size.explain":
    "La taille finale honnête, d'après nos sources citées — souvent bien plus grande que ne l'avoue une étiquette de pépinière. Donnez à une indigène la place de son gabarit adulte dès le premier jour et vous n'aurez jamais à la tailler pour la mater ; le dessin ci-dessous montre le rythme, année par année.",
  "stat.year.label": "An {n}",
  "stat.year.value": "{height} de haut",
  "stat.year.explain":
    "Le rythme vient de la croissance observée sur le terrain aux années 1, 3, 5 et 10 dans les sources citées pour cette plante — pas de l'optimisme des étiquettes. Le lieu, l'eau et la chance le font varier.",
  "pace.quick": "atteint vite sa taille",
  "pace.steady": "croissance régulière",
  "pace.slow": "lente et de longue vie",
  "stat.host.label": "Chenilles hébergées",
  "stat.host.value": "{n} espèces",
  "stat.host.subKeystone": "plante clé de voûte",
  "stat.host.subValue": "valeur pour le réseau alimentaire",
  "stat.host.explain":
    "Combien d'espèces de papillons peuvent élever leurs chenilles sur cette plante. Les chenilles sont ce dont presque tous les oisillons sont nourris : c'est donc la meilleure mesure, à elle seule, de la vie qu'une plante fait vivre — et c'est exactement là que les plantes exotiques frôlent le zéro.",
  "stat.host.explainKeystone":
    "Celle-ci est une clé de voûte : elle héberge bien plus d'espèces que la moyenne, et les réseaux alimentaires locaux s'appuient sur elle.",
  "stat.bloom.label": "Floraison",
  "stat.bloom.explain":
    "Le moment où elle fleurit. Les périodes de floraison des indigènes sont calées sur les pollinisateurs du coin — certaines abeilles n'émergent que pour ces semaines-là. Plantez quelques indigènes aux floraisons décalées et il y a du nectar du début du printemps aux gelées.",
  "stat.foliage.value": "Feuillage",
  "stat.foliage.sub": "cultivée pour ses feuilles, pas ses fleurs",
  "stat.foliage.explain":
    "Celle-ci se cultive pour son feuillage et sa silhouette plutôt que pour ses fleurs — et cela vaut tout autant pour la faune. Les feuilles nourrissent les chenilles, les tiges abritent les insectes qui passent l'hiver, et le couvert compte toute l'année d'une façon que le nectar seul ne peut pas offrir.",

  // ---------------------------------------------------------------------
  // Fiche détaillée d'une plante.
  // ---------------------------------------------------------------------
  "plant.docTitle": "{name} ({latin}) — Indigene",
  "plant.more": "← D'autres indigènes",
  "plant.sizeAria": "Taille de {name} au fil du temps",
  "plant.nativeTo": "📍 Indigène de : ",
  "plant.whyBelongs": "Pourquoi elle est chez elle ici : ",
  "plant.share": "Partager cette plante",
  "plant.shareShort": "Partager",
  "plant.shareTitle": "{name} — Indigene",
  "plant.shareText":
    "{name} ({latin}) — une plante indigène qui mérite d'être connue. Voyez si votre coin lui convient :",
  "plant.linkCopied": "Lien copié — collez-le où vous voulez.",
  "plant.ecosystemTitle": "🦋 Ce qu'elle fait pour l'écosystème",
  "plant.wildlifeItBrings": "La faune qu'elle attire : ",
  "plant.soleTie": "Cette plante est la seule option de {name} — un lien vital.",
  "plant.propagationTitle": "🪴 Comment en faire plus",
  "plant.forThisPlant": "Pour cette plante : ",
  "plant.howToSource": "Source du mode d'emploi : ",
  "plant.usfsLink": "Native Plant Network (USFS) →",
  "plant.checkSpotTitle": "Envie de la planter ? Vérifiez votre coin",
  "plant.checkSpotLede":
    "Placez-vous là où vous la planteriez (ou cherchez votre commune ci-dessous) et Indigene confronte le sol, le climat et la région à ce dont cette plante a besoin — indigène de {region} et au-delà, il faut encore qu'elle se plaise à votre endroit exact.",
  "plant.checkPrivacy":
    "Utilisée uniquement pour vérifier ce lieu, uniquement quand vous le demandez — votre position ne quitte jamais votre appareil autrement que sous forme de requêtes anonymes",
  "plant.checkLocation": "📍 Vérifier ma position",
  "plant.noSpot": "Aucun lieu choisi pour l'instant.",
  "plant.checkingSpot": "{where} — vérification du sol et du climat…",
  "plant.near": "Près de {place}",
  "plant.sunQuestion": "Combien de soleil ce coin reçoit-il ?",
  "plant.sunUnsure": "Je ne sais pas",
  "plant.sunFull": "☀️ Ensoleillé presque tout le jour",
  "plant.sunHalf": "⛅ Du soleil la moitié du jour",
  "plant.sunShade": "🌳 Surtout à l'ombre",
  "plant.noGpsSearch": "🔎 Pas de GPS ? Cherchez votre commune",
  "plant.noGeolocation": "Cet appareil ne peut pas partager sa position — cherchez votre commune ci-dessous.",
  "plant.denied": "Position refusée — cherchez plutôt votre commune ci-dessous.",
  "plant.noFix": "Impossible d'obtenir un point — réessayez, ou cherchez votre commune ci-dessous.",
  "plant.searchOffline":
    "La recherche de lieux a besoin d'une connexion et nous n'avons pas pu l'atteindre. Si le GPS fonctionne, utilisez le bouton de position ci-dessus.",
  "plant.seeEverything": "Voir tout ce qui prospère à cet endroit →",
  "plant.notFoundTitle": "Nous ne connaissons pas encore cette plante",
  "plant.notFoundLede":
    "Rien dans les listes régionales d'Indigene ne correspond à « {slug} ». Ces listes sont délibérément constituées à la main — chaque entrée est vérifiée pour son statut d'indigène et pour l'honnêteté de ses chiffres — elles grandissent donc avec prudence.",
  "plant.notFoundBrowse": "Parcourir les indigènes que nous connaissons",
  "ref.title": "🔎 La chercher ailleurs",
  "ref.lede":
    "Retrouvez {name} dans les bases botaniques et naturalistes — la même plante, reliée par un identifiant commun pour tomber sur la bonne fiche.",
  "ref.powo": "Kew — nom accepté et aire d'indigénat",
  "ref.ipni": "la référence nomenclaturale",
  "ref.wfo": "fiche taxonomique mondiale",
  "ref.gbif": "où sa présence a été enregistrée",
  "ref.usda": "statut d'indigène et répartition aux États-Unis",
  "ref.itis": "taxonomie nord-américaine",
  "ref.inaturalist": "photos et observations à proximité",
  "ref.wikidata": "renvois croisés et Wikipédia",
  "ref.identity": "Identité : ",
  "ref.identityRest": " — un identifiant mondial et pérenne (résoluble sur identifiers.org).",

  // ---------------------------------------------------------------------
  // Faune.
  // ---------------------------------------------------------------------
  "wildlife.coverageNote":
    "Voici les liens avec la faune les mieux documentés que nous ayons cartographiés jusqu'ici — pas tous les insectes qu'une plante fait vivre. Un seul chêne héberge les chenilles de centaines d'espèces de papillons ; ici nous nommons celles pour lesquelles il vaut la peine de choisir une plante. Chaque lien indique sa source, et la liste grandit aussi prudemment que celles des plantes. Les régions que nous citons pour un animal sont celles où nous avons cartographié des plantes qui le font vivre ; son aire de répartition va souvent bien au-delà.",
  "wildlife.indexDocTitle": "Parcourir les plantes indigènes par la faune qu'elles font vivre — Indigene",
  "wildlife.indexTitle": "Parcourir par animal",
  "wildlife.indexLede":
    "Choisissez l'insecte ou l'animal que vous aimeriez voir chez vous, et découvrez quelles plantes indigènes le font vivre — et comment. {n} espèces cartographiées jusqu'ici.",
  "wildlife.allNative": "🌿 Chaque animal listé ici est lui-même indigène. ",
  "wildlife.allNativeRest":
    "C'est tout l'intérêt — une plante indigène qui nourrit une faune indigène — et l'abeille domestique, introduite, est donc écartée. Plutôt qu'une étiquette « indigène » sur chaque fiche, le chiffre 📍 compte les régions où nous avons cartographié l'espèce — ouvrez-le pour leurs noms.",
  "wildlife.browsePlants": "← Parcourir plutôt les plantes",
  "wildlife.browsePlantsShort": "Parcourir les plantes",
  "wildlife.startFromSpot": "Partir d'un lieu",
  "wildlife.supportedBy.one": "{n} plante indigène d'Indigene fait vivre {animal}",
  "wildlife.supportedBy.other": "{n} plantes indigènes d'Indigene font vivre {animal}",
  "wildlife.supportedByInRegion.one": "{n} plante indigène de la liste {region} d'Indigene fait vivre {animal}",
  "wildlife.supportedByInRegion.other": "{n} plantes indigènes de la liste {region} d'Indigene font vivre {animal}",
  "wildlife.inRegions": "Indigène dans {n} des régions d'Indigene : {regions}. Ouvrez pour les liens.",
  "wildlife.inRegionsTitle": "Indigène dans {n} régions",
  "wildlife.inRegionsBody":
    "Indigene cartographie des plantes indigènes qui font vivre {animal} dans {n} de ses listes régionales. Ouvrez-en une pour voir toutes les espèces que ces plantes font vivre.",
  "wildlife.nativeTo": "📍 Indigène dans",
  "wildlife.regionPillTitle": "{region} — toute la faune que ses plantes indigènes font vivre",
  "wildlife.docTitle": "Les plantes indigènes qui font vivre {animal} — Indigene",
  "wildlife.allWildlife": "← Toute la faune",
  "wildlife.aNativeAnimal": "Un animal indigène. ",
  "wildlife.ofThemHosts.one": ", dont {n} comme plante nourricière de ses chenilles — le lien le plus fort.",
  "wildlife.ofThemHosts.other": ", dont {n} comme plantes nourricières de ses chenilles — le lien le plus fort.",
  "wildlife.cantLiveWithout.one": "⭐ Il ne peut pas vivre sans cette plante. ",
  "wildlife.cantLiveWithout.other": "⭐ Il ne peut pas vivre sans ces plantes. ",
  "wildlife.onlyOption.one": "C'est sa seule option — retirez-la et {animal} n'a plus nulle part où aller.",
  "wildlife.onlyOption.other":
    "{n} d'entre elles sont sa seule option — retirez-les et {animal} n'a plus nulle part où aller.",
  "wildlife.speciesRecord": "Voir la fiche de l'espèce : ",
  "wildlife.fullProfile": "{name} — fiche complète",
  "wildlife.allSources": "Toutes les sources et licences →",
  "wildlife.rankForSpot": "Les classer pour mon lieu",
  "wildlife.notFoundTitle": "Nous ne suivons pas encore cette espèce",
  "wildlife.notFoundLede":
    "Rien dans la liste faunistique d'Indigene ne correspond à « {id} ». La liste est constituée à la main — chaque lien est vérifié et sourcé — elle grandit donc avec prudence.",
  "wildlife.notFoundBrowse": "Parcourir les espèces que nous suivons",
  "wildlife.groupDocTitle": "Plantes indigènes pour les {group} — Indigene",
  "wildlife.groupLede": "{n} recensés à ce jour. {blurb}",
  // Pas de {group} ici : l'accord en genre change d'un groupe à l'autre, et
  // « aucun animal dans ce groupe » se lit aussi bien pour tous.
  "wildlife.emptyGroup":
    "Nous n'avons encore recensé aucun animal dans ce groupe — chaque lien est vérifié et sourcé avant d'être publié, la liste grandit donc prudemment.",
  "wildlife.allChip": "Tout ({n})",
  "wildlife.groupsNav": "Groupes d'animaux",
  "wildlife.filterAria": "Filtrer cette liste par nom d'animal",
  "wildlife.filterPlaceholder": "Filtrer par nom…",
  "wildlife.filterCount.one": "{shown} animal sur {total} correspond à « {q} ».",
  "wildlife.filterCount.other": "{shown} animaux sur {total} correspondent à « {q} ».",
  "wildlife.filterNoneGroup": "Aucun résultat parmi les {group} pour « {q} » — ",
  "wildlife.filterSeeAll": "voir toute la faune",
  "wildlife.filterNoneIndex": "Aucun animal recensé ne correspond à « {q} » — ",
  "wildlife.filterSearchPlants": "chercher parmi les plantes",
  "wildlife.filterNoneRest": ".",
  // La coupe par région — l'autre axe, à côté des chips de groupe.
  "wildlife.regionDocTitle": "La faune que font vivre les plantes indigènes de {region} — Indigene",
  "wildlife.groupInRegionDocTitle": "{group} de {region} — Indigene",
  "wildlife.indexLedeRegion":
    "{n} espèces que font vivre les plantes indigènes de la liste {region} d'Indigene. Choisissez-en une pour voir lesquelles de ces plantes élèvent ses petits ou la nourrissent — et comment.",
  "wildlife.groupInRegionLede": "{n} sur la liste {region} d'Indigene. {blurb}",
  "wildlife.regionFilterLabel": "Afficher la faune de",
  "wildlife.regionFilterAll": "Toutes les régions ({n})",
  "wildlife.allWildlifePlain": "Toute la faune",
  "wildlife.noSuchRegionTitle": "Ce n'est pas une région que nous couvrons",
  "wildlife.noSuchRegionLede":
    "Rien dans Indigene ne correspond à la région « {id} ». Choisissez plutôt l'une de celles-ci :",

  // ---------------------------------------------------------------------
  // Listes régionales.
  // ---------------------------------------------------------------------
  "form.tree": "Arbres",
  "form.shrub": "Arbustes",
  "form.perennial": "Vivaces et fleurs sauvages",
  "form.grass": "Graminées et laîches",
  "form.vine": "Grimpantes",
  "form.groundcover": "Couvre-sols",
  "form.fern": "Fougères",
  "region.docTitle": "Les indigènes de {region} — Indigene",
  "region.categoryDocTitle": "{label} indigènes de {region} — Indigene",
  "region.lede":
    "Toutes les indigènes que nous connaissons pour {reference} — touchez une plante pour sa fiche complète.",
  "region.noSuchRegion": "Ce lien ne correspond à aucune région couverte par Indigene.",
  "region.noSuchCategory":
    "« {slug} » n'est pas une catégorie de plantes que nous connaissons — essayez l'un des groupes ci-dessous.",
  "region.featured": "← Les indigènes en vedette",
  "region.elsewhere": "{label} dans une autre région :",
  "region.categoryCount.one": "{n} plante indigène pour {reference}",
  "region.categoryCount.other": "{n} plantes indigènes pour {reference}",
  "region.tapAny": " — touchez-en une pour sa fiche complète.",
  "region.emptyCategory":
    "Notre liste {region} ne comporte pas encore de {label} — les listes sont constituées à la main et grandissent prudemment. Essayez une autre catégorie, ou la même catégorie dans une région ci-dessous.",
  "region.allOfRegion": "← Toutes les indigènes de cette région",
  "region.allChip": "Tout ({n})",
  "region.categoriesNav": "Catégories de plantes",
  "region.filterAria": "Filtrer cette liste par nom de plante",
  "region.filterPlaceholder": "Filtrer par nom…",
  "region.filterCount.one": "{shown} plante sur {total} correspond à « {q} ».",
  "region.filterCount.other": "{shown} plantes sur {total} correspondent à « {q} ».",
  "region.filterNone": "Rien ici ne correspond — ",
  "region.filterSearchAll": "chercher dans toutes les régions",
  "region.filterNoneRest": ".",
  "region.nothingHere": "Il n'y a rien à cette adresse",
  "region.browseNatives": "Parcourir les indigènes",
  "regionStat.plants.label": "Plantes indigènes",
  "regionStat.plants.sub": "choisies pour cette région",
  "regionStat.plants.explain":
    "Les plantes de la liste constituée à la main pour cette région, chacune vérifiée comme indigène d'ici d'après les sources citées sur sa fiche. C'est une sélection de départ qui grandit prudemment — pas un inventaire de tout ce qui pousse ici.",
  "regionStat.hosts.label": "Chenilles hébergées",
  "regionStat.hosts.value": "jusqu'à {n}",
  "regionStat.hosts.sub": "espèces sur {plant} à elle seule",
  "regionStat.hosts.explain":
    "Combien d'espèces de papillons peuvent élever leurs chenilles sur une seule plante — {plant} arrive en tête de cette liste avec {n}. Les chenilles sont ce dont presque tous les oisillons sont nourris : c'est donc la meilleure mesure, à elle seule, de la vie qu'une plantation fait vivre. (Les comptes se recoupent d'une plante à l'autre : nous ne les additionnons pas.)",
  "regionStat.wildlife.label": "Liens avec la faune",
  "regionStat.wildlife.sub": "espèces documentées",
  "regionStat.wildlife.explain":
    "{n} sortes de papillons, d'abeilles, d'oiseaux et de mammifères dont le lien avec au moins une plante de cette liste est documenté et citable — chacune comptée une fois, qu'il s'agisse d'une seule espèce comme le monarque ou d'un groupe familier comme les geais amateurs de glands. Ce sont les relations remarquables et nommables : le total réel est bien plus grand, un seul chêne nourrit plus d'espèces que personne ne saurait énumérer.",
  "regionStat.wildlife.more": "Parcourir les plantes par la faune qu'elles font vivre →",
  "regionStat.keystone.label": "Plantes clés de voûte",
  "regionStat.keystone.sub": "les réseaux alimentaires s'appuient dessus",
  "regionStat.keystone.explain":
    "{n} des plantes de cette région sont des clés de voûte — comme la pierre au sommet d'une arche, chacune fait vivre bien plus d'animaux que la moyenne, et en perdre une déferait un réseau alimentaire bien plus grand qu'elle.",

  // ---------------------------------------------------------------------
  // Recherche.
  // ---------------------------------------------------------------------
  "search.title": "Rechercher une plante indigène",
  "search.lede":
    "Tapez le nom d'une plante — courant ou scientifique — et ouvrez sa fiche. La recherche interroge le registre des plantes indigènes d'Indigene : un nom s'y résout exactement comme partout ailleurs dans l'application.",
  "search.label": "Nom de la plante",
  "search.placeholder": "ex. chêne, asclépiade ou Quercus",
  "search.matchCount": "{n} plantes indigènes sur {total} correspondent à « {q} ».",
  "search.idle": "Cherchez parmi {total} plantes indigènes réparties sur {regions} régions.",
  "search.alsoCalled": "Aussi appelée « ",
  "search.alsoCalledEnd": " »",
  "search.noneLead":
    "Aucune plante des listes d'Indigene ne correspond à « {q} ». Les listes sont constituées région par région, elles grandissent donc prudemment — ",
  "search.noneLink": "parcourez les indigènes que nous connaissons",
  "search.noneEnd": ".",
  "search.browseInstead": "Parcourir plutôt",

  // ---------------------------------------------------------------------
  // Vie privée et sécurité.
  // ---------------------------------------------------------------------
  "privacy.docTitle": "Vie privée et sécurité — Indigene",
  "privacy.title": "Vie privée et sécurité",
  "privacy.lede":
    "Indigene est conçu pour être sûr et respectueux envers toutes les personnes qui l'utilisent — les enfants compris. Voici toute l'histoire, en mots simples : ce que nous demandons, ce que nous ne faisons jamais, et où va vraiment ce que vous partagez.",
  "privacy.shortVersion": "En bref. ",
  "privacy.short1": "Pas de compte, pas d'inscription, pas de mot de passe — rien qui vous identifie.",
  "privacy.short2":
    "Pas de publicité. Pas de pistage. Aucune statistique qui observe ce que vous touchez. Rien vous concernant n'est vendu ni partagé.",
  "privacy.short3":
    "Vos lieux enregistrés restent sur votre appareil. Il n'y a aucun serveur Indigene où ils pourraient aller.",
  "privacy.short4":
    "Vous n'êtes jamais obligé de partager votre position exacte — un code postal ou une commune suffit partout.",
  "privacy.short5": "C'est un logiciel libre : n'importe qui peut lire exactement ce qu'il fait.",
  "privacy.locationTitle": "Votre position : seulement quand vous le demandez",
  "privacy.location1":
    "Indigene ne demande votre position que lorsque vous touchez un bouton pour cela — afin de déterminer votre région, de consulter votre sol, votre climat et votre ensoleillement, et de trouver de vraies observations de plantes et d'animaux à proximité. Il ne lit jamais votre position en arrière-plan, ni quand l'application est fermée.",
  "privacy.location2":
    "Et vous n'êtes jamais tenu de la partager. Partout où l'application peut utiliser une position, vous pouvez à la place saisir un {zip}, ou simplement choisir votre région dans une liste. Partager sa position précise est toujours un choix, jamais le prix à payer pour utiliser Indigene.",
  "privacy.zipOrTown": "code postal ou une commune",
  "privacy.location3":
    "Quand vous partagez un lieu, votre appareil envoie cette coordonnée directement aux services scientifiques publics qui répondent à chaque question — et nulle part ailleurs. Il n'y a pas de serveur Indigene au milieu qui tiendrait le journal de vos déplacements, parce qu'il n'y a pas de serveur Indigene du tout. Toute l'application tourne dans votre navigateur.",
  "privacy.whereTitle": "Où va votre position, et pour quoi faire",
  "privacy.whereLede":
    "Pour que vous voyiez exactement ce qui se passe : quand une recherche a besoin de votre lieu, votre navigateur s'adresse directement à ces services publics. Chacun ne voit que cette recherche-là, n'obtient ni nom ni compte (il n'y en a pas), et applique sa propre politique de confidentialité à cette requête.",
  "privacy.svc.sentWrap": "(on lui envoie {sent}).",
  "privacy.svc.inat.for": "des photos de plantes et d'animaux observés à proximité",
  "privacy.svc.inat.sent": "une coordonnée ou une zone de carte, plus l'espèce recherchée",
  "privacy.svc.meteo.for":
    "votre climat — la pluie et la rigueur des hivers ; et la conversion d'un code postal ou d'une commune en un point sur la carte",
  "privacy.svc.meteo.sent": "une coordonnée, ou le nom de lieu que vous avez saisi",
  "privacy.svc.osm.for": "le nom de la commune la plus proche (affiché à la place des chiffres bruts), et l'image de la carte",
  "privacy.svc.osm.sent": "une coordonnée",
  "privacy.svc.soil.for": "le type de votre sol et son acidité",
  "privacy.svc.soil.sent": "une coordonnée",
  "privacy.svc.usgs.for": "votre altitude et votre pente",
  "privacy.svc.usgs.sent": "une coordonnée",
  "privacy.svc.epa.for": "le nom de votre écorégion",
  "privacy.svc.epa.sent": "une coordonnée",
  "privacy.whereFooter":
    "Ce sont des institutions publiques reconnues — universités, agences gouvernementales et une communauté naturaliste à but non lucratif — pas des publicitaires. À dessein, aucune de ces recherches n'a besoin de votre adresse : une commune, un code postal ou une grille grossière suffisent à la science. La liste technique complète, avec liens et licences, est dans {link}.",
  "privacy.dataSourcesLink": "notre document public sur les sources de données",
  "privacy.savedTitle": "Les lieux enregistrés restent sur votre appareil",
  "privacy.saveButton": "Enregistrer ce lieu",
  "privacy.saved":
    "Quand vous touchez {save}, il est conservé dans le stockage propre à votre navigateur, sur cet appareil uniquement. Il ne quitte jamais votre appareil, n'atteint aucun serveur (il n'y en a pas), et nous ne pouvons jamais le voir. Il est à vous : ouvrez ou supprimez un lieu enregistré quand vous voulez depuis le menu « Lieux », et effacer les données de ce site dans votre navigateur les efface définitivement.",
  "privacy.noAccountTitle": "Pas de compte, pas de pistage, pas de publicité",
  "privacy.noAccount1": "Pas d'inscription, pas d'adresse e-mail, pas de mot de passe — nous ne demandons jamais qui vous êtes.",
  "privacy.noAccount2":
    "Pas de publicité, et rien de vendu ni partagé. Nous ne détenons de toute façon aucune donnée sur vous à vendre.",
  "privacy.noAccount3":
    "Pas de statistiques ni de cookies de pistage qui suivraient ce que vous faites. Les seules choses stockées sont vos lieux enregistrés et quelques réglages — sur votre appareil, pour vous.",
  "privacy.childrenTitle": "Fait pour tout le monde, enfants compris",
  "privacy.children1":
    "Des mots simples du début à la fin — chaque terme de jardinage ou de science est expliqué dans des mots sur lesquels on peut agir.",
  "privacy.children2": "Rien à acheter. Aucun achat ni paiement d'aucune sorte dans l'application.",
  "privacy.children3":
    "Pas de messagerie, de commentaires ni de fonctions sociales — personne ne peut donc contacter qui que ce soit via Indigene.",
  "privacy.children4": "Nous ne recueillons aucune information personnelle, de personne, à aucun âge.",
  "privacy.children5":
    "Les photos sont des observations communautaires de qualité recherche issues d'iNaturalist — des images vérifiées de plantes et d'animaux — toujours affichées avec le crédit de la personne qui les a prises. Les liens sortants mènent à des organismes scientifiques et naturalistes de confiance.",
  "privacy.openTitle": "Vous n'êtes pas obligé de nous croire sur parole",
  "privacy.open":
    "Indigene est un logiciel libre sous licence MIT. Toute l'application — chaque ligne, et chaque requête réseau qu'elle peut faire — est publique. Si vous voulez vérifier quoi que ce soit sur cette page, vous pouvez lire le code vous-même : {link}.",
  "privacy.repoLink": "Indigene sur GitHub",
  "privacy.questionsTitle": "Des questions, des inquiétudes",
  "privacy.questions":
    "Si quelque chose ici n'est pas clair, ou si vous pensez que nous pouvons mieux faire en matière de sécurité ou de vie privée, dites-le-nous — {link}. Comme l'application est libre, le code reste toujours le dernier mot, honnête, sur ce qu'elle fait.",
  "privacy.issueLink": "ouvrez un ticket sur GitHub",
  "privacy.home": "← Accueil",
  "privacy.findPlants": "Trouver des plantes pour mon lieu",

  // ---------------------------------------------------------------------
  // D'où viennent nos chiffres.
  // ---------------------------------------------------------------------
  "sources.docTitle": "D'où viennent nos chiffres — Indigene",
  "sources.title": "D'où viennent nos chiffres",
  "sources.lede":
    "Indigene vous montre des chiffres — combien de chenilles un arbre nourrit, quelle taille il atteint, à quel point il retient un talus. Certains sont comptés dans des données scientifiques ouvertes. D'autres relèvent de notre meilleur jugement. Cette page vous dit lesquels sont lesquels, et où nous parierions nous être trompés.",
  "sources.short1":
    "Rien ici n'est inventé. Chaque chiffre a une source, et chaque plante affiche les siennes sur sa fiche.",
  "sources.short2":
    "Certains chiffres sont comptés dans de vraies bases de données. D'autres sont des estimations prudentes — nous le disons honnêtement.",
  "sources.short3": "Nos listes de plantes sont des listes de départ, pas la flore complète d'un territoire.",
  "sources.short4":
    "Nous préférons sincèrement être corrigés que crus. Si un chiffre vous paraît faux, il l'est peut-être.",
  "sources.everyNumberTitle": "Chaque chiffre, et notre degré de certitude",
  "sources.everyNumberLede":
    "Chaque chiffre de l'application nous parvient de l'une de trois façons, et elles ne se valent pas. Les voici regroupés par façon, la plus solide d'abord.",
  "sources.counted": "Compté",
  "sources.countedMeaning":
    "Quelqu'un l'a dénombré dans un jeu de données publié, et nous l'avons relevé. Le type de chiffre le plus solide ici.",
  "sources.calculated": "Calculé",
  "sources.calculatedMeaning":
    "Personne n'a publié ce chiffre pour votre lieu : l'application le déduit de mesures, avec une méthode publiée par quelqu'un d'autre. Le même calcul à chaque fois — vous pourriez le refaire sur papier et retrouver le nôtre.",
  "sources.estimated": "Estimé",
  "sources.estimatedMeaning":
    "Quelqu'un chez nous a pesé les indices et choisi un chiffre. Utile, et le plus fragile de tous — ce sont ceux à mettre en doute en premier.",
  "sources.fig.host": "Nombre de chenilles hébergées",
  "sources.fig.hostFrom":
    "— en Europe, d'après la matrice lépidoptères–plantes de Gaytán 2026 ; aux États-Unis, d'après les chiffres Tallamy / National Wildlife Federation.",
  "sources.fig.native": "Indigène ou non",
  "sources.fig.nativeFrom":
    "— d'après les référentiels botaniques nationaux : USDA PLANTS aux États-Unis, Tela Botanica et l'INPN en France, plus les flores régionales.",
  "sources.fig.ecoregion": "Votre écorégion",
  "sources.fig.ecoregionFrom":
    "— la carte des écorégions de l'EPA américaine, ou celle de l'Agence européenne pour l'environnement, interrogée sur votre point exact.",
  "sources.fig.soil": "Votre sol et son acidité",
  "sources.fig.soilFrom":
    "— d'après SoilGrids, une carte mondiale des sols. Grossière : elle décrit un carré de 250 mètres, pas votre massif.",
  "sources.fig.climate": "Pluie et froid hivernal",
  "sources.fig.climateFrom": "— d'après les relevés météo d'Open-Meteo pour votre secteur.",
  "sources.fig.elevation": "Altitude et pente",
  "sources.fig.elevationFrom": "— d'après les données d'altitude nationales pour votre point.",
  "sources.fig.ties": "Quelle faune une plante nourrit",
  "sources.fig.tiesFrom1":
    "— chaque association plante-animal cite une source, et l'application refuse d'en afficher une qui n'en a pas. À quel point l'animal ",
  "sources.fig.tiesEm": "dépend",
  "sources.fig.tiesFrom2": " de cette plante, en revanche, relève de notre lecture de ces sources.",
  "sources.fig.sun": "Heures de soleil",
  "sources.fig.sunFrom":
    "— votre appareil calcule la course du soleil au-dessus de votre lieu tout au long de l'année, avec la méthode standard de la NOAA. Aucune requête, aucun réseau.",
  "sources.fig.zone": "Zone de rusticité",
  "sources.fig.zoneFrom":
    "— d'après les minimales hivernales relevées chez vous, avec la définition publiée des zones USDA, plutôt qu'en lisant une carte officielle.",
  "sources.fig.size": "La taille qu'elle atteint, et à quelle vitesse",
  "sources.fig.sizeFrom":
    "— la croissance typique sur un terrain moyen, d'après les flores et les références forestières. Les vraies plantes varient énormément.",
  "sources.fig.scores": "Les six notes sur 100",
  "sources.fig.scoresFrom":
    "— pollinisateurs, oiseaux, absorption de la pluie, maintien du sol, stockage du carbone, facilité d'installation. Éclairées par les sources citées sur chaque fiche, mais ce sont des jugements que nous avons portés, sur une échelle que nous avons inventée.",
  "sources.assumptionsTitle": "Les hypothèses derrière ces chiffres",
  "sources.assumptionsLede":
    "Chacun des chiffres ci-dessus repose sur une décision que nous avons prise. Voici celles qui pèseraient le plus lourd si nous nous étions trompés :",
  "sources.assume1": "Nous comptons les chenilles par groupe de plantes apparentées, pas par espèce exacte. ",
  "sources.assume1Rest":
    "Le compte affiché pour le chêne pédonculé est en réalité celui des chênes en général. Nous procédons ainsi parce que les jeux de données américain et européen ne sont comparables qu'à ce niveau — mais cela signifie qu'une espèce qui héberge moins d'insectes que ses proches paraît meilleure qu'elle ne l'est.",
  "sources.assume2": "Pour les comptes européens, nous ne retenons que les espèces proches qui poussent spontanément dans votre zone. ",
  "sources.assume2Rest":
    "Le chèvrefeuille indigène est ainsi crédité de 57 espèces de papillons, et non des 111 qu'on obtiendrait en incluant les chèvrefeuilles de jardin introduits. La fiche de chaque plante le signale quand les deux chiffres diffèrent.",
  "sources.assume3": "Les comptes européens sont européens, pas français. ",
  "sources.assume3Rest":
    "Le jeu de données enregistre quels insectes utilisent une plante quelque part en Europe. Un insecte compté pour votre jardin ne vit peut-être pas près de chez vous.",
  "sources.assume4": "Votre région est plus grande que votre jardin. ",
  "sources.assume4Rest":
    "Une région peut ici couvrir un tiers d'un pays. C'est la bonne échelle pour choisir une liste de plantes, et beaucoup trop grossière pour décrire votre pente, votre ombre et votre drainage — c'est pourquoi l'application vous les demande directement.",
  "sources.assume5": "Nos listes de plantes sont des listes de départ. ",
  "sources.assume5Rest":
    "Vingt à quarante plantes choisies pour être fiables, trouvables et réellement utiles à la faune — jamais toutes les plantes indigènes d'une région. Une plante absente d'une liste n'est pas une plante que nous déconseillons.",
  "sources.challengeTitle": "Ce que nous contesterions en premier",
  "sources.challengeLede":
    "Si vous vouliez trouver une erreur ici, voici où nous vous dirions de regarder — à peu près par ordre de probabilité que nous ayons tort :",
  "sources.chal1": "Les six notes sur 100. ",
  "sources.chal1Rest":
    "Les chiffres les plus fragiles de l'application, et de loin. Aucun jeu de données ne dit qu'un arbuste vaut 78 pour la lutte contre l'érosion ; cela vient de nous, de notre lecture des sources et de notre jugement. Si vous connaissez bien une plante et qu'une note vous paraît fausse, vous avez sans doute raison.",
  "sources.chal2": "Compter par groupe apparenté plutôt que par espèce. ",
  "sources.chal2Rest":
    "C'est défendable, et nous le défendrions — mais c'est bel et bien une approximation, et elle flatte les membres les plus faibles d'un groupe fort.",
  "sources.chal3": "Les régions ne sont pas également bien sourcées. ",
  "sources.chal3Rest":
    "Certaines listes reposent sur des décennies de travail botanique régional ; les plus récentes sont plus minces. La note de confiance de chaque plante est notre lecture honnête de cela, plante par plante.",
  "sources.chal4": "Les comptes de chenilles américains reposent sur un terrain moins sûr que les européens. ",
  "sources.chal4Rest":
    "Les chiffres européens viennent d'un jeu de données sous licence ouverte que nous pouvons vous indiquer et recalculer de zéro. Les chiffres américains viennent de travaux publiés dont la base n'a pas de licence ouverte — ils sont donc plus difficiles à vérifier que nous ne le voudrions.",
  "sources.chal5": "Les données du lieu sont plus grossières qu'elles n'en ont l'air. ",
  "sources.chal5Rest":
    "Un sol issu d'un carré de 250 mètres, et une zone de rusticité que nous calculons plutôt que de la lire, paraissent tous deux précis à l'écran. Faites davantage confiance à vos yeux et à vos mains.",
  "sources.tellUsTitle": "Comment nous dire que nous avons tort",
  "sources.tellUs":
    "Faites-le, s'il vous plaît. Toute l'application est libre : rien ici ne doit être pris sur parole — vous pouvez lire les fichiers de données, le script de comptage et chaque ligne qui transforme un chiffre en recommandation : {repo}. Si quelque chose vous paraît faux, {issue} — une correction accompagnée d'une source est la chose la plus utile qu'on puisse nous envoyer.",
  "sources.openIssue": "ouvrez un ticket",
  "sources.fullList":
    "Pour la liste technique complète de chaque jeu de données, de qui le publie et de ce que sa licence permet, voyez {doc}. Les comptes de chenilles européens viennent de {matrix}, publié en accès libre sous licence CC-BY 4.0 — vous pouvez télécharger les mêmes données que nous et vérifier nos calculs.",
  "sources.dataDoc": "notre document sur les sources de données",

  // D'où viennent les *noms* des plantes et des animaux.
  "names.sourcesTitle": "D'où viennent les noms de plantes et d'animaux",
  "names.sourcesLede":
    "Le nom d'une plante dans votre langue n'est pas la traduction de son nom anglais : c'est le nom que lui ont donné les gens qui vivent avec elle, consigné dans un référentiel national. Nous allons donc le chercher, au lieu de le traduire :",
  "names.src.taxref":
    "le référentiel national français de la flore et de la faune de France. L'autorité pour tout ce qui pousse ou vole ici.",
  "names.src.bdtfx":
    "la flore de France métropolitaine, avec les noms vernaculaires que les botanistes français emploient réellement.",
  "names.src.vascan":
    "les noms français normalisés des plantes nord-américaines — la lacune que le référentiel français ne peut pas combler, une indigène du Nord-Ouest Pacifique lui étant inconnue.",
  "names.src.wikidata": "le recoupement de dernier recours, pour les espèces qu'aucun référentiel national ne couvre.",
  "names.sourcesGap":
    "Quand aucun référentiel n'a de nom, nous affichons le nom scientifique. Beaucoup d'indigènes nord-américaines n'ont tout simplement jamais reçu de nom français, et en inventer un serait exactement l'invention assurée que nous refusons de commettre avec un nombre de chenilles.",

  // ---------------------------------------------------------------------
  // Composants partagés.
  // ---------------------------------------------------------------------
  "privacy.howHandled": "Comment vos données sont traitées",
  "term.tapToLearn": "{term}. Touchez pour savoir ce que cela veut dire.",
  "zoneChip.approx":
    "En gros, zones de rusticité USDA {range} — l'échelle américaine est ici une traduction, pas la convention locale : prenez-la comme un repère du froid hivernal.",
  "zoneChip.exact": "Zones de rusticité USDA {range} — le froid hivernal sur lequel la liste de cette région est réglée.",
  "prompt.noGeolocation": "Cet appareil ne peut pas partager de position — saisissez plutôt un code postal ou une commune ci-dessous.",
  "prompt.getting": "Récupération de votre position…",
  "prompt.denied": "Position refusée — ce n'est pas grave ; saisissez un code postal ou une commune ci-dessous.",
  "prompt.noFix": "Impossible d'obtenir votre position. Réessayez, ou saisissez un code postal ou une commune ci-dessous.",
  "prompt.placeholder": "ex. 44000, ou Nantes",
  "prompt.notFound":
    "Ce code postal ou ce lieu est introuvable. Essayez une commune proche avec sa région — « Saint-Denis Réunion » par exemple — ou un code postal complet.",
  "prompt.offline":
    "La recherche de lieux a besoin d'une connexion et nous n'avons pas pu l'atteindre. Si votre appareil a un GPS, utilisez le bouton de position ci-dessus.",
  "prompt.or": "ou",
  "prompt.label": "Saisissez un code postal ou une commune",
  "prompt.privacy":
    "Quel que soit votre choix, cela ne sert qu'à cette recherche et ne quitte jamais votre appareil, sinon sous forme de requête anonyme à iNaturalist",
  "obs.creditLead": "Observations et photos issues d'",
  "obs.creditMid": ", chacune © son observateur, sous la licence indiquée. ",
  "obs.fromCache": "Chargées depuis le cache de cet appareil — ",
  "obs.fetchedNow": "Récupérées à l'instant par votre navigateur — ",
  "obs.creditEnd": "c'est votre navigateur qui appelle iNaturalist directement : ils voient votre requête, pas la nôtre.",
  "lightbox.prev": "Photo précédente",
  "lightbox.next": "Photo suivante",
  "lightbox.close": "Fermer",
  "lightbox.viewer": "Visionneuse de photos",
  "lightbox.viewOriginal": "Voir l'observation d'origine ↗",
  "lightbox.sightingOf": "observation {i} sur {n}",
  "nearby.useMyLocation": "Utiliser ma position",
  "nearby.asking": "Interrogation d'iNaturalist…",
  "nearby.unreachable":
    "Nous n'avons pas pu joindre iNaturalist à l'instant. L'appel part directement de votre navigateur : une connexion capricieuse ou une requête bloquée suffit à l'interrompre — réessayez plus tard.",
  "nearby.nearPlace": "près de {place}",
  "nearby.closeToYou": "près de chez vous",
  "nearby.found": "Nous en avons trouvé {n} : ",
  "nearby.foundNear": "Nous en avons trouvé {n} à proximité : ",
  "nearby.seeItGrowing": "La voir pousser près de chez vous",
  "nearby.seeItGrowingLede":
    "Le dessin ci-dessus est à l'échelle, mais rien ne remplace la vue d'un {name} adulte en pleine terre. Partagez votre position ou saisissez un code postal, et nous irons chercher de vraies photos, vérifiées par la communauté, de sujets qui poussent près de là — ou consultez-la dans une région dont elle est indigène, même si vous n'y êtes pas. Dans les deux cas les photos viennent en direct d'iNaturalist, appelé par votre propre navigateur, et créditées à celles et ceux qui les ont prises.",
  "nearby.outsideYou":
    "Vous êtes en dehors des régions pour lesquelles Indigene a des données sur les plantes indigènes : nous ne pouvons donc pas garantir ce qui y est vraiment indigène — et nous ne ferons pas passer des observations voisines pour des indigènes locales. Les mesures de soleil, de sol et de climat fonctionnent partout.",
  "nearby.outsidePlace":
    "{place} est en dehors des régions pour lesquelles Indigene a des données sur les plantes indigènes : nous ne pouvons donc pas garantir ce qui y est vraiment indigène — et nous ne ferons pas passer des observations voisines pour des indigènes locales. Les mesures de soleil, de sol et de climat fonctionnent partout.",
  "nearby.noTaxonId":
    "Nous n'avons pas encore d'identifiant iNaturalist pour {name} : impossible donc de la relier à des observations vérifiées.",
  "nearby.noneNear":
    "{name} est indigène de {region}, mais personne n'en a encore photographié ni fait valider une {where} sur iNaturalist. Elle vaut quand même la peine d'être plantée — c'est seulement la vitrine locale qui manque.",
  "nearby.noneInRegion":
    "Aucune observation de qualité recherche de {name} avec photos n'a encore été enregistrée en {region} sur iNaturalist. Elle y est bien indigène — la communauté n'en a simplement pas encore saisi.",
  "nearby.foundNearRest.one":
    "observation de qualité recherche — un vrai {name}, indigène de {region}, que quelqu'un a vérifié et photographié {where} :",
  "nearby.foundNearRest.other":
    "observations de qualité recherche — de vrais {name}, indigènes de {region}, que des gens ont vérifiés et photographiés {where} :",
  "nearby.foundRest.one":
    "observation de qualité recherche de {name} en {region} — vérifiée et photographiée par la communauté iNaturalist (vous n'avez pas besoin d'y être) :",
  "nearby.foundRest.other":
    "observations de qualité recherche de {name} en {region} — vérifiées et photographiées par la communauté iNaturalist (vous n'avez pas besoin d'y être) :",
  "nearby.notThereNative": "Vous n'y êtes pas ? Cherchez-la là où elle est indigène :",
  "nearby.nativeToList": "indigène de {list}",
  "nearby.nativeToOther": "indigène d'une autre région",
  "nearby.nativeElsewhere":
    "Nos données donnent {name} comme {belongs}, et non de {region}. Elle peut apparaître sur iNaturalist là-bas comme sujet planté ou échappé de culture, mais nous ne la présenterons pas comme une indigène locale là où elle n'a pas sa place — ce serait le contraire de ce à quoi Indigene sert.",
  "wlNearby.seeItNear": "Le voir près de chez vous",
  "wlNearby.seeItNearLede":
    "Rien ne remplace la vue d'un vrai {name}. Partagez votre position ou saisissez un code postal, et nous irons chercher des photos iNaturalist vérifiées par la communauté, prises près de là — ou consultez-le dans une région où il est présent, même si vous n'y êtes pas. Dans les deux cas les photos viennent en direct d'iNaturalist, appelé par votre propre navigateur, et créditées à celles et ceux qui les ont prises.",
  "wlNearby.outsideYou":
    "Vous êtes en dehors des régions couvertes par Indigene : nous ne pouvons donc pas faire de recherche à proximité. Vous pouvez tout de même le chercher dans une région où il est présent, ci-dessous.",
  "wlNearby.outsidePlace":
    "{place} est en dehors des régions couvertes par Indigene : nous ne pouvons donc pas y faire de recherche à proximité. Vous pouvez tout de même le chercher dans une région où il est présent, ci-dessous.",
  "wlNearby.noneNear":
    "Personne n'a encore photographié ni fait valider un {name} {where} sur iNaturalist — cela veut seulement dire que la communauté n'en a pas saisi ici, pas qu'il est absent.",
  "wlNearby.noneInRegion":
    "Aucune observation de qualité recherche de {name} avec photos n'a encore été enregistrée en {region} sur iNaturalist — la communauté n'en a simplement pas encore saisi.",
  "wlNearby.foundNearRest.one":
    "observation de qualité recherche — un vrai {name} que quelqu'un a vérifié et photographié {where} :",
  "wlNearby.foundNearRest.other":
    "observations de qualité recherche — de vrais {name} que des gens ont vérifiés et photographiés {where} :",
  "wlNearby.foundRest.one":
    "observation de qualité recherche de {name} en {region} — vérifiée et photographiée par la communauté iNaturalist (vous n'avez pas besoin d'y être) :",
  "wlNearby.foundRest.other":
    "observations de qualité recherche de {name} en {region} — vérifiées et photographiées par la communauté iNaturalist (vous n'avez pas besoin d'y être) :",
  "wlNearby.notThereFound": "Vous n'y êtes pas ? Cherchez-le là où il est présent :",

  // ---------------------------------------------------------------------
  // Écorégions.
  // ---------------------------------------------------------------------
  "ecoregion.suffixEea": "région biogéographique, AEE",
  "ecoregion.suffixEpa": "écorégion EPA de niveau III",
  "ecoregion.eea.alpine": "Alpine",
  "ecoregion.eea.atlantic": "Atlantique",
  "ecoregion.eea.black-sea": "Mer Noire",
  "ecoregion.eea.boreal": "Boréale",
  "ecoregion.eea.continental": "Continentale",
  "ecoregion.eea.mediterranean": "Méditerranéenne",
  "ecoregion.eea.pannonian": "Pannonienne",
  "ecoregion.eea.steppic": "Steppique",
  "ecoregion.eea.arctic": "Arctique",
  "ecoregion.eea.anatolian": "Anatolienne",
  "ecoregion.eea.macaronesia": "Macaronésienne",
  "ecoregion.broad.marineWest": "Forêt maritime de la côte ouest (approximatif)",
  "ecoregion.broad.southFlorida": "Plaine côtière du sud de la Floride (approximatif)",
  "ecoregion.broad.southernCoastal": "Plaine côtière du Sud (approximatif)",
  "ecoregion.broad.easternTemperate": "Forêt tempérée de l'Est (approximatif)",
  "ecoregion.broad.mediterranean": "Méditerranéenne (approximatif)",
  "ecoregion.broad.atlantic": "Atlantique (approximatif)",

  // ---------------------------------------------------------------------
  // À propos.
  // ---------------------------------------------------------------------
  "about.docTitle": "À propos d'Indigene",
  "about.title": "À propos d'Indigene",
  "about.lede":
    "Un indigène est natif d'un lieu. Cette application mesure le soleil là où vous vous tenez, consulte le sol et le climat de ces coordonnées précises, et vous rend les plantes qui appartiennent à cet endroit — avec des mots simples d'un bout à l'autre.",
  "about.hereEm": "ici",
  "about.whyTitle": "Pourquoi cela existe",
  "about.why1":
    "La plupart des jardins sont verts et presque sans vie. Les pelouses, les arbustes et les fleurs venus d'autres continents ont belle allure et ne nourrissent presque rien : les chenilles dont sont nourris presque tous les oisillons ne peuvent manger que les plantes avec lesquelles elles ont évolué. Pas de plantes indigènes, pas de chenilles, pas d'oisillons — et cette soustraction silencieuse se produit à l'échelle de pays entiers, un jardin bien tenu à la fois.",
  "about.why2":
    "Le remède est étonnamment peu coûteux et étonnamment rapide. Plantez une seule indigène et la chaîne alimentaire redémarre dès la même saison. Ce qui manquait, ce n'était pas la bonne volonté : c'était une réponse claire à « qu'est-ce que je plante {here}, dans ce coin précis de mon jardin ? », qui n'exige pas de parler déjà la langue des catalogues de pépinière. C'est cette réponse qu'Indigene essaie d'être.",
  "about.forTitle": "Pour qui c'est fait",
  "about.forLede": "L'application est faite, délibérément, pour des gens qui ne sont pas des spécialistes :",
  "about.for1":
    "Les débutants, qui n'ont jamais entendu « mi-ombre » ni « espèce clé de voûte » et ne devraient pas avoir à les apprendre avant d'obtenir une réponse utile.",
  "about.for2":
    "Les jardiniers de guérilla, qui n'ont qu'une seule occasion et aucun suivi, et à qui il faut dire franchement ce qui survivra tout seul.",
  "about.for3":
    "Les jardiniers plus âgés qui découvrent les indigènes, et qui méritent qu'on leur dise « voici ce que cette plante vous apporte » plutôt qu'on leur fasse la leçon.",
  "about.forEnd":
    "C'est pourquoi elle s'utilise d'une seule main, dehors, les mains sales et avec une mauvaise connexion — et pourquoi chaque terme de jardinage est expliqué sur place, à chaque fois, au lieu d'être supposé connu.",
  "about.stancesTitle": "Ce qu'elle refuse de faire",
  "about.stancesLede":
    "Ce ne sont pas des valeurs affichées au mur : chacune est une décision que vous pouvez voir l'application appliquer, et la raison pour laquelle elle se comporte ainsi.",
  "about.stance.plain": "Elle n'emploie jamais un terme qu'elle n'a pas expliqué.",
  "about.stance.plainBody":
    "Les mots courants passent devant, le terme technique suit entre parenthèses — « des hivers descendant jusqu'à −12 °C environ (zone USDA 8a) », jamais l'inverse. Si un mot vous envoie chercher ailleurs, c'est un échec.",
  "about.stance.uncertain": "Elle vous montre ses marges d'erreur.",
  "about.stance.uncertainBody":
    "L'estimation du soleil est une fourchette, pas une décimale, parce que les capteurs mentent et que la réponse honnête est une plage. Le relevé de sol est toujours présenté comme « la carte dit ceci — voici un test de soixante secondes pour vérifier si c'est vrai là où vous êtes », parce qu'un carré de carte des sols est plus grand que votre jardin entier. Sur place, vous en savez plus que la carte, et l'application est faite pour vous laisser la contredire.",
  "about.stance.sourced": "Chaque chiffre doit pouvoir être rattaché à quelqu'un d'autre.",
  "about.stance.sourcedBody":
    "Chaque plante porte ses sources et une note de confiance en mots simples, et quand un chiffre relève de notre jugement plutôt que d'un comptage, la page des sources le dit et nomme ceux que nous contesterions en premier. Rien n'est inventé pour combler un trou — une plante sans nom français affiche son nom scientifique plutôt qu'une invention plausible.",
  "about.stance.yours": "Elle n'attend rien de vous.",
  "about.stance.yoursBody":
    "Pas de compte, pas d'inscription, pas de publicité, pas de statistiques, rien de vendu. Les lieux enregistrés restent dans votre navigateur, sur votre appareil, parce qu'il n'existe aucun serveur où les envoyer. Il n'y a rien à acheter, et aucun moyen pour un inconnu de vous contacter par ce biais.",
  "about.stance.offline": "Elle fonctionne là où sont les jardins.",
  "about.stance.offlineBody":
    "Conçue pour marcher hors ligne et pour s'installer sur l'écran d'accueil, parce que le fond d'un jardin est précisément l'endroit où le réseau disparaît. Tout sauf les consultations en direct continue de fonctionner sans aucune connexion.",
  "about.freeTitle": "Libre, et libre de réemploi",
  "about.free":
    "Indigene est un logiciel libre sous {licence}. C'est un choix délibéré face à une licence plus restrictive : c'est un outil d'intérêt public bâti sur de la science publique, et un conservatoire, une chambre d'agriculture, une commune ou une autre application doivent pouvoir le reprendre, l'adapter et le faire tourner sans demander la permission à personne.",
  "about.mit": "licence MIT",
  "about.freeMoney":
    "Il n'y a pas d'entreprise derrière et rien n'est monétisé. C'est aussi pour cela que l'application est un petit téléchargement qui tourne dans votre navigateur, plutôt qu'un service que quelqu'un devrait continuer de payer.",
  "about.helpTitle": "Aidez à l'améliorer",
  "about.help":
    "La chose la plus utile que vous puissiez envoyer, c'est une correction accompagnée d'une source. Tout — les données sur les plantes, les scripts, chaque ligne qui transforme un chiffre en recommandation — est public sur {repo}, et si quelque chose vous paraît faux, vous pouvez {issue}. Demander la couverture de votre propre région est tout aussi bienvenu : c'est ainsi que la carte s'agrandit.",

};
