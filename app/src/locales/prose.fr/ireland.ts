// Ireland — the whole island, Republic and Northern Ireland, referenced on
// Dublin, Cork and Galway. Translated from `plants.ireland.ts`.
//
// See `./index.ts` for how the overlay works and what the translation
// conventions are. Names in Irish (fearnóg, fraochán…) stay as written: they
// are names, not curiosities.
import type { ProseTable } from "../../lib/prose";

export const IRELAND: ProseTable = {
  "Quercus petraea": {
    nativeNote:
      "Le chêne des forêts de l'ouest de l'Irlande — Killarney, Glengarriff, les vallons du Wicklow — et l'arbre qui porte le plus de vie de tous ici.",
    careNote:
      "Lent, puis là pour des siècles. Une racine pivotante profonde le rend autonome une fois installé, mais très difficile à déplacer : plantez-en un petit — un semis de deux ans vaut mieux qu'un arbre tuteuré — et laissez-lui de la place, bien à l'écart de la maison.",
    givesNote:
      "Parmi les arbres les plus riches de l'île pour la faune : des centaines d'espèces de chenilles, et donc les mésanges, fauvettes et grimpereaux qui en nourrissent leurs nichées, des glands pour les geais et les mulots, et un tronc qui finit par porter son propre jardin de mousses et de fougères.",
    propagationNote:
      "Ramassez les glands à leur chute en octobre et plongez-les dans l'eau — jetez ceux qui flottent et semez aussitôt les autres. Les glands germent le même automne, sans aucun froid, et ne doivent jamais sécher. À cause de la racine pivotante, semez en pot profond ou directement à l'emplacement de l'arbre.",
    supportNotes: {
      "purple-hairstreak":
        "Les chenilles de la thécla du chêne mangent du chêne et rien d'autre. Tout le papillon se joue dans la canopée — les œufs sur les bourgeons, les chenilles dans les feuilles qui s'ouvrent, les adultes tournant autour du houppier un soir de juillet — si bien qu'un vieux chêne dans une haie irlandaise abrite le plus souvent une colonie que personne, en dessous, n'a jamais remarquée.",
      "eurasian-jay":
        "Un geai enterre quelques milliers de glands chaque automne et en oublie assez pour être la principale raison pour laquelle les chênaies avancent. Plantez un chêne ; les geais planteront le reste du bois.",
    },
  },
  "Quercus robur": {
    nativeNote:
      "Le chêne des plaines irlandaises et des sols plus lourds du centre, où le chêne sessile lui cède la place.",
    careNote:
      "Accepte des terrains plus humides et plus lourds que le chêne sessile et supporte un engorgement hivernal qui tuerait la plupart des arbres. Pour le reste, mêmes règles : plantez petit, plantez une fois, et laissez-le tranquille.",
    givesNote:
      "Tout ce que donne le chêne sessile, sur un sol trop humide pour lui — et les glands au long pédoncule qui donnent son nom à l'arbre sont ceux que les geais emportent et enterrent, et c'est ainsi que les chênaies avancent.",
    propagationNote:
      "Comme pour le chêne sessile — faites flotter les glands, semez frais en automne ceux qui coulent, ne les laissez jamais sécher. Ses glands sont portés par de longs pédoncules, le moyen le plus simple de savoir sous quel chêne vous les avez ramassés.",
    supportNotes: {
      "purple-hairstreak":
        "L'un ou l'autre chêne indigène fait l'affaire — la thécla cherche des feuilles de chêne, pas une espèce de chêne en particulier.",
      "eurasian-jay":
        "Les glands à long pédoncule de ce chêne sont ceux qu'on trouve le plus souvent plantés dans une pelouse, lâchés par un geai pressé.",
    },
  },
  "Betula pubescens": {
    pioneerNote:
      "Apparaît tout seul sur la tourbière exploitée, au fond des carrières et sur les chantiers — graine légère, sol nu, et aucune aide nécessaire.",
    nativeNote:
      "Le bouleau de l'Irlande — celui des bords de tourbière, de la tourbe exploitée et des coteaux humides, là où le bouleau verruqueux est rare et le plus souvent planté.",
    careNote:
      "Rapide, léger et de vie courte pour un arbre — soixante ou quatre-vingts ans, pas six cents. Il accepte les sols acides, tourbeux et détrempés dont rien d'autre ne veut. Son houppier clair permet de jardiner dessous, ce qui n'est pas le cas de la plupart des arbres de cette taille.",
    givesNote:
      "Second seulement au chêne et au saule pour les chenilles ici, et ses graines font tenir sizerins et tarins tout l'hiver. Ses racines nourrissent toute une communauté de champignons : un vieux bouleau est généralement le meilleur coin à champignons d'un jardin.",
    propagationNote:
      "En automne, les chatons se défont en graines ailées, comme une fine balle. Éparpillez-les sur un sol nu et humide ou à la surface d'une caissette sans les couvrir — elles ont besoin de lumière pour germer. Les graines fraîches valent bien mieux que les graines conservées.",
    supportNotes: {
      "conifer-seed-finches":
        "Les chatons de bouleau s'émiettent tout l'hiver en graines si fines que seuls les petits fringilles s'en donnent la peine — tarins et sizerins se suspendent tête en bas le long des rameaux extérieurs, d'ordinaire en une seule bande bruyante.",
      "emperor-moth":
        "Les chenilles du petit paon de nuit — dodues, vertes, cerclées de noir et constellées de verrues orange — mangent le bouleau aussi volontiers que la callune, et comptent parmi les trouvailles les plus saisissantes sur un jeune arbre en bord de tourbière en juillet.",
    },
  },
  "Alnus glutinosa": {
    nativeNote:
      "L'arbre des berges de rivières, des bords de lacs et des creux humides d'Irlande — fearnóg, celui qui tient une berge.",
    careNote:
      "Plantez-le dans le coin le plus humide que vous ayez — il supporte d'avoir le pied dans l'eau, ce que presque rien d'autre ne fait. Il fixe son propre azote : il ne demande aucun engrais et améliore un sol pauvre pour tout ce que vous plantez près de lui.",
    givesNote:
      "Tient une berge de ruisseau mieux que tout autre arbre ici, boit l'eau qu'un jardin détrempé n'arrive pas à évacuer, et ses petits cônes ligneux nourrissent tarins et sizerins tout l'hiver. Des chatons en février, quand rien d'autre n'offre de pollen.",
    propagationNote:
      "Récoltez les petits cônes en automne, faites-les sécher à l'intérieur jusqu'à ce qu'ils s'ouvrent et secouez-en les graines. Un hiver dehors dans un pot de terreau humide suffit à leur donner le froid nécessaire. Des rameaux dormants plantés en hiver dans un sol mouillé s'enracinent facilement aussi.",
    supportNotes: {
      "conifer-seed-finches":
        "Les petits cônes ligneux de l'aulne gardent leurs graines tout l'hiver, et tarins et sizerins les fouillent tête en bas en bandes jacassantes — le spectacle classique de janvier le long d'une rivière irlandaise.",
    },
  },
  "Salix caprea": {
    nativeNote:
      "Le saule à chatons des haies et des fourrés humides d'Irlande — le premier vrai pollen de l'année, en mars, quand sortent les reines de bourdons.",
    careNote:
      "Pousse presque partout où c'est humide, et vite. Rabattez-le sévèrement tous les quelques ans si vous voulez qu'il reste un grand arbuste plutôt qu'un petit arbre — il le supporte de bon cœur et repart plus touffu.",
    givesNote:
      "La plante la plus importante du printemps irlandais : ses chatons sont la première grande source de pollen et de nectar de l'année, et les reines de bourdons qui sortent d'hibernation en dépendent. Ensuite, il nourrit plus de chenilles que tout autre arbre, sauf le chêne.",
    propagationNote:
      "Coupez en hiver des rameaux dormants de la grosseur d'un crayon, enfoncez-en les deux tiers dans un sol humide, et passez votre chemin — les saules s'enracinent sur bois nu plus sûrement que presque tout au jardin. La graine ne reste viable que quelques jours : les boutures sont la voie raisonnable.",
    supportNotes: {
      "bumble-bees":
        "Une reine de bourdon sort d'hibernation en mars sans aucune réserve et doit fonder seule toute une colonie — pour cela il lui faut du pollen, des protéines pour les premières larves, pas seulement du sucre. Les chatons du saule sont sa première vraie source dans l'année irlandaise : voilà pourquoi on entend un sally en fleur depuis l'autre bout du jardin.",
      "poplar-hawk-moth":
        "Le sphinx du peuplier pond sur les saules aussi souvent que sur les peupliers. Sa chenille, épaisse comme un pouce, vert pomme, porte une corne gris-bleu au bout de l'abdomen, et se repose la tête relevée dans une pose de sphinx — d'où le nom de toute la famille.",
    },
  },
  "Populus tremula": {
    nativeNote:
      "Rare et dispersé en Irlande aujourd'hui — sur les pentes rocheuses, les îles des lacs et les vieilles lisières — et reconnaissable entre tous à la façon dont chaque feuille bouge.",
    careNote:
      "Il drageonne — c'est ainsi que vit le tremble, en clone qui s'étend plutôt qu'en arbres isolés — alors laissez-lui de la place loin des allées et des massifs, ou préparez-vous à tondre les drageons. Il veut de la lumière ; à l'ombre, il ne pousse pas.",
    givesNote:
      "Parmi les tout meilleurs arbres pour les chenilles ici, et assez rare en Irlande pour qu'en planter un soit une vraie contribution. Le bruit de ses feuilles dans le vent est la raison pour laquelle on le plante de toute façon.",
    propagationNote:
      "De loin le plus simple : prélever en hiver un drageon enraciné sur un arbre où vous en avez la permission. Les boutures de racines — des morceaux longs comme un doigt couchés dans une caissette de terreau graveleux en fin d'hiver — marchent aussi. La graine vit peu et mûrit rarement bien en Irlande.",
    supportNotes: {
      "poplar-hawk-moth":
        "Le tremble est l'arbre qui donne son nom au papillon. L'adulte se repose les ailes postérieures avancées au-delà des antérieures, ce qu'aucun autre papillon de nuit ne fait ici, et ressemble ainsi exactement à une touffe de feuilles mortes.",
    },
  },
  "Prunus avium": {
    nativeNote:
      "Indigène dans les bois et les vieilles haies d'Irlande, et le plus bel arbre à fleurs que le pays possède en propre.",
    careNote:
      "Drageonne à partir des racines : gardez-le hors d'une petite pelouse. Ne taillez qu'en été si vous y êtes obligé — les cerisiers saignent et attrapent des maladies par les coupes d'hiver. Il veut un sol drainant ; il n'aime pas un hiver détrempé.",
    givesNote:
      "Une semaine de floraison blanche que toutes les abeilles du voisinage trouvent, puis des fruits que les merles, les grives et les grives draines dépouillent avant que vous ayez pu y jeter un œil. L'un des trois premiers genres ici pour les chenilles.",
    propagationNote:
      "Nettoyez de leur chair les noyaux mûrs en juillet et semez-les directement dans un pot laissé dehors — il leur faut un hiver froid complet, parfois deux, avant de lever. Des drageons enracinés prélevés en hiver vont plus vite si vous avez accès à un arbre.",
    supportNotes: {
      "winter-thrushes":
        "Merles et grives draines dépouillent un merisier en juillet, des semaines avant que quiconque y ait posé une échelle.",
      "mason-bees":
        "Une fleur de merisier ouverte et peu profonde est une fleur que les abeilles solitaires peuvent vraiment utiliser — une osmie rousse atteint le nectar d'une fleur qu'un bourdon devrait forcer.",
    },
  },
  "Prunus padus": {
    nativeNote:
      "Un arbre du nord et de l'ouest en Irlande — bois humides et bords de rivières, plus commun dans le nord et autour des lacs calcaires.",
    careNote:
      "Plus à l'aise à l'ombre et dans l'humidité que le merisier, ce qui en fait le cerisier d'un coin exposé au nord ou détrempé. C'est l'hôte habituel de l'hyponomeute du merisier à grappes, dont les chenilles peuvent envelopper tout un arbre de soie en mai — c'est impressionnant, l'arbre refait ses feuilles en juillet, et mieux vaut le laisser faire.",
    givesNote:
      "De longues grappes pendantes de fleurs blanches au parfum d'amande en mai, puis de petites cerises noires que prennent merles et grives. Il porte la même énorme liste de chenilles que les autres cerisiers, sur un sol trop humide et trop ombragé pour eux.",
    propagationNote:
      "Nettoyez les noyaux des fruits mûrs en fin d'été et semez-les aussitôt dans un pot laissé dehors pour l'hiver. Il drageonne volontiers : un morceau enraciné prélevé en hiver est la voie rapide.",
    supportNotes: {
      "winter-thrushes":
        "De petites cerises noires et amères en août, que merles et grives prennent une fois les fruits plus doux épuisés.",
    },
  },
  "Sorbus aucuparia": {
    nativeNote:
      "Caorthann — l'arbre du folklore irlandais, planté devant les portes contre le malheur, et celui qui monte le plus haut sur une montagne d'Irlande.",
    careNote:
      "À peu près l'arbre indigène le plus accommodant qui soit : sol acide maigre, vent, exposition, altitude, petit jardin — il accepte tout et garde une taille raisonnable. Il lui faut du soleil sur le houppier pour bien fructifier ; à l'ombre il survit, mais boude.",
    givesNote:
      "Des corymbes plats de fleurs crème pour les syrphes et les abeilles en mai, puis des baies écarlates en août que les grives draines défendent et que les grives mauvis et litornes dépouillent à leur arrivée de Scandinavie en octobre. Le meilleur petit arbre ici pour un jardin de ville.",
    propagationNote:
      "Écrasez des baies mûres dans l'eau en automne, rincez la pulpe — la chair elle-même empêche la graine de germer — et semez les graines propres dans un pot laissé dehors tout l'hiver. La plupart lèvent au premier printemps ; quelques-unes attendent le second.",
    supportNotes: {
      "winter-thrushes":
        "Un sorbier en fruits est l'arbre le plus bruyant de l'automne irlandais : grives mauvis et litornes y fondent tout droit au sortir de la traversée depuis la Scandinavie et peuvent le dénuder en deux jours. Une grive draine essaiera d'en défendre un contre toute la bande, et perdra.",
      "mason-bees":
        "Des corymbes plats et ouverts de fleurs crème en mai — une piste d'atterrissage plutôt qu'un tube, exactement ce qu'il faut aux abeilles solitaires à langue courte et aux syrphes.",
    },
  },
  "Taxus baccata": {
    nativeNote:
      "Indigène et ancien ici — Reenadinna, à Killarney, est la plus grande forêt d'ifs d'Europe — et l'ombre persistante la plus sombre que l'Irlande possède en propre.",
    careNote:
      "Le seul arbre indigène qui prospère à l'ombre profonde et sèche, y compris sous d'autres arbres et contre un mur exposé au nord. Lent — une trentaine de centimètres par an au mieux — et pratiquement immortel. **Toutes ses parties, sauf la chair rouge de la baie, sont gravement toxiques pour les humains, les chiens, les chevaux et les bovins** : réfléchissez bien avant de le planter là où pâturent des enfants ou des animaux.",
    givesNote:
      "Un couvert persistant et des sites de nid dans un pays qui manque des deux, et des baies que merles et grives draines mangent tout l'hiver. Se taille en haie mieux que tout autre et repart du vieux bois nu, ce que presque aucun autre conifère ne fait.",
    propagationNote:
      "Le bouturage est la voie pratique : arrachez en fin d'été des pousses latérales avec un talon et enracinez-les sous châssis froid — il leur faut un an, mais elles reprennent bien. La graine demande deux hivers dehors avant de bouger, si bien que peu de gens s'y essaient.",
    supportNotes: {
      "winter-thrushes":
        "La chair rouge autour de la graine d'if est la seule partie de l'arbre qui ne soit pas toxique, et merles et grives draines la mangent tout l'hiver, rejetant la graine intacte. L'arbre et l'oiseau ont bien réglé leur arrangement.",
    },
  },
  "Ilex aquifolium": {
    nativeNote:
      "Cuileann — le sous-étage persistant de toutes les chênaies d'Irlande, et ici un véritable arbre plutôt que l'arbuste qu'il reste plus au nord.",
    careNote:
      "Pousse à l'ombre sèche où peu d'autres plantes viennent, et supporte la taille. Fleurs mâles et femelles sont sur des pieds distincts : il faut un pied femelle pour les baies et un mâle quelque part dans le voisinage — il y en a souvent déjà un. Lent à démarrer, puis régulier.",
    givesNote:
      "Des baies d'hiver pour les grives, les merles et les grives mauvis quand il ne reste plus rien, un couvert persistant dense pour nicher et dormir, et la plante nourricière de l'azuré des nerpruns — dont la génération de printemps pond sur le houx et celle d'été passe au lierre.",
    propagationNote:
      "Prélevez en fin d'été des pousses de l'année aoûtées avec un talon et enracinez-les sous châssis ombragé. Le semis marche, mais met la patience à l'épreuve — la graine attend deux ou trois hivers avant de germer, et seulement si elle vient de baies bien mûres.",
    supportNotes: {
      "holly-blue":
        "La génération de printemps de l'azuré des nerpruns pond sur les boutons floraux du houx, et les chenilles mangent les baies en formation ; la génération d'été passe ensuite au lierre. Un jardin qui a les deux garde le papillon toute l'année, et c'est pourquoi il est l'un des rares papillons irlandais vraiment de jardin.",
      "winter-thrushes":
        "Le houx garde ses baies plus longtemps que tout le reste de la haie, et une grive draine défendra un seul buisson contre tous les autres oiseaux pendant les semaines les plus dures de l'année.",
    },
  },
  "Malus sylvestris": {
    nativeNote:
      "Le vrai pommier sauvage des haies et des lisières d'Irlande — plus petit, plus épineux et plus acide que les pommiers de verger qui se sont partout croisés avec lui.",
    careNote:
      "Il veut le plein soleil et un drainage correct. Achetez-le auprès d'une source capable de dire qu'il s'agit de la vraie espèce sauvage et non d'un pommier d'ornement — presque tous les « pommiers sauvages » des haies d'Irlande sont des semis de pommiers de verger, et la question vaut d'être posée.",
    givesNote:
      "L'un des meilleurs arbres de l'île pour les pollinisateurs — une fleur ouverte et peu profonde que les abeilles solitaires à langue courte peuvent vraiment utiliser — et des fruits qui restent accrochés jusqu'en hiver pour les merles, les grives litornes et, au sol, les blaireaux et les renards.",
    propagationNote:
      "Semez les pépins nettoyés de fruits mûrs dans un pot laissé dehors pendant l'hiver. Attention : les semis d'un arbre proche de vergers sont généralement hybrides — pour la vraie espèce, marcotter une branche basse d'un arbre sauvage connu est la voie honnête.",
    supportNotes: {
      "mason-bees":
        "La fleur de pommier est la fleur classique de l'osmie rousse — une seule abeille en visite plusieurs centaines dans la matinée et pollinise bien plus efficacement qu'une abeille domestique faisant la même tournée.",
      "winter-thrushes":
        "Les pommes sauvages restent accrochées après la chute des feuilles et ramollissent aux premières gelées, exactement quand les grives litornes en veulent.",
    },
  },
  "Corylus avellana": {
    nativeNote:
      "Coll — la plante forestière la plus irlandaise qui soit. Les fourrés de noisetiers sur le calcaire du Burren forment un habitat qu'on ne trouve presque nulle part ailleurs en Europe.",
    careNote:
      "Supporte une vraie ombre, supporte le calcaire, supporte d'être rabattu au ras du sol tous les sept ou huit ans et repart avec une poignée de perches droites — c'est le recépage, et le noisetier est conduit ainsi ici depuis des milliers d'années. Les noisettes demandent un peu de soleil et un second noisetier à proximité.",
    givesNote:
      "Des chatons en queue d'agneau en janvier, le premier pollen de l'année pour les bourdons précoces, et des noisettes en automne pour les écureuils roux, les geais et les mulots. Multicaule et dense, c'est le meilleur arbuste de nidification ici.",
    propagationNote:
      "Fixez au sol une pousse basse en automne, entaillez-en le dessous et sevrez-la enracinée un an plus tard — le noisetier se marcotte presque tout seul. Pour le semis, semez des noisettes fraîches en automne dans un pot protégé des souris, qui sinon les trouveront toutes.",
    supportNotes: {
      "mason-bees":
        "Le noisetier est pollinisé par le vent et n'a besoin d'aucun insecte, mais ses chatons en queue d'agneau libèrent leur pollen en janvier et février, et les toutes premières abeilles solitaires le récoltent quand même — le premier filet de l'année, avant que les saules ne s'ouvrent.",
      "eurasian-jay":
        "Les geais emportent et enterrent les noisettes aussi bien que les glands. Le muscardin n'est pas indigène en Irlande — une petite population introduite est apparue en 2010 — si bien que, dans une haie irlandaise, ce sont les geais, les mulots et les écureuils roux que nourrissent les noisettes.",
    },
  },
  "Crataegus monogyna": {
    nativeNote:
      "Sceach gheal — la haie de l'Irlande rurale, et l'aubépine solitaire au milieu d'un champ que personne ne veut abattre.",
    careNote:
      "Pousse sur n'importe quoi et résiste à tout le vent, le sel et la taille qu'on voudra — c'est pourquoi c'est ici la plante de haie. Taillez en fin d'hiver, après que les oiseaux ont mangé les cenelles et avant qu'ils ne nichent. Plantez un jeune plant à racines nues en hiver ; il coûte une fraction du prix et s'installe mieux.",
    givesNote:
      "Une écume de fleurs en mai que butinent toutes les abeilles, tous les syrphes et tous les coléoptères de la paroisse, deux cents espèces de chenilles, un couvert épineux et dense qui protège un nid des chats et des corneilles, et des cenelles rouges qui font tenir grives mauvis et litornes tout l'hiver.",
    propagationNote:
      "Les cenelles sont lentes : retirez la chair, semez en automne dans un pot laissé dehors, et n'attendez rien avant le second printemps. La plupart des gens plantent plutôt des jeunes plants à racines nues en hiver, ce qui est bon marché et raisonnable.",
    supportNotes: {
      "winter-thrushes":
        "Une haie chargée de cenelles est ce qui fait tenir grives litornes et mauvis pendant un hiver irlandais — elles arrivent en bandes et dépouillent une haie après l'autre.",
      "bumble-bees":
        "L'écume de mai de l'aubépine est ici le plus grand événement nectarifère de l'année de la haie, et il est terminé en deux semaines.",
    },
  },
  "Prunus spinosa": {
    nativeNote:
      "Draighean — la moitié noire et épineuse de la haie irlandaise, qui fleurit sur le bois nu avant la moindre feuille.",
    careNote:
      "Il drageonne, et pour de bon — un prunellier laissé à lui-même s'avance dans une pelouse ou une prairie et en fait un roncier. C'est exactement ce qu'on veut dans une haie de limite et exactement ce qu'on ne veut pas dans une plate-bande : mettez-le en bordure et coupez les drageons indésirables.",
    givesNote:
      "Des fleurs blanches en mars sur des rameaux noirs, des semaines avant tout le reste, quand les premières abeilles sont aux abois. La même liste de quelque trois cents chenilles que les cerisiers, le couvert de nidification le plus épineux de l'île, et des prunelles pour les oiseaux — ou pour le gin.",
    propagationNote:
      "Prélevez en hiver un drageon enraciné — la plante en produit sans cesse et ne regrettera pas celui-là. La graine doit être débarrassée de sa chair et passer deux hivers dehors : presque personne ne part des prunelles.",
    supportNotes: {
      "mason-bees":
        "Le prunellier fleurit sur le bois noir et nu en mars, avant ses propres feuilles et avant presque tout le reste — un repas précoce pour les abeilles solitaires tout juste sorties de terre.",
      "winter-thrushes":
        "Les prunelles restent accrochées longtemps après la disparition des autres fruits, exactement quand les grives d'hiver en ont besoin.",
      "emperor-moth":
        "Loin de la tourbière, le prunellier est l'une des principales plantes nourricières des chenilles du petit paon de nuit : une haie épineuse et un talus de callune nourrissent le même papillon spectaculaire.",
    },
  },
  "Calluna vulgaris": {
    nativeNote:
      "Fraoch — la plante qui teint de pourpre les tourbières et les flancs de montagne d'Irlande en août, et celle sur laquelle reposent la plupart des hautes terres du pays.",
    careNote:
      "Il lui faut un sol acide et le plein soleil, sans compromis sur l'un ni l'autre — sur calcaire elle jaunit et meurt, et aucun engrais n'y change rien. Taillez légèrement après la floraison pour la garder dense ; ne coupez jamais dans le vieux bois nu, qui ne repart pas.",
    givesNote:
      "La grande source de nectar de fin d'été ici, quand les fleurs des prairies sont passées — abeilles domestiques, bourdons et des dizaines d'abeilles solitaires la butinent, et le miel de bruyère en est le fruit. Plus d'une centaine d'espèces de chenilles, et un couvert d'hiver pour les oiseaux qui nichent au sol.",
    propagationNote:
      "Arrachez en fin d'été de courtes pousses latérales avec un talon et enracinez-les dans un mélange graveleux sans calcaire — la callune s'enracine facilement mais pourrit dans un terreau riche. Des branches basses fixées au sol se marcottent d'elles-mêmes en une saison.",
    supportNotes: {
      "emperor-moth":
        "La callune est la plante du petit paon de nuit sur les tourbières et les montagnes d'Irlande. Le mâle vole de jour en avril, vite et bas au-dessus de la callune, suivant l'odeur de la femelle depuis plus d'un kilomètre — le seul grand papillon de nuit volant de jour que la plupart des gens verront ici.",
      "bumble-bees":
        "Quand les prairies sont fauchées et les fleurs de haie passées, une colline de callune en août est la dernière grande source de nectar de l'année irlandaise. Le miel de bruyère vient de ces trois semaines.",
      "green-hairstreak":
        "Les chenilles de la thècle de la ronce mangent la callune, l'ajonc, le genêt à balais et la myrtille — toute la lande, en somme. L'adulte est le seul papillon vert d'Irlande, et il referme ses ailes et disparaît dès qu'il se pose.",
    },
  },
  "Erica cinerea": {
    nativeNote:
      "La bruyère des talus secs, des landes rocheuses et des épaulements les plus secs d'une tourbière irlandaise — d'un magenta plus vif que la callune, et plus précoce.",
    careNote:
      "La sèche de la famille — elle veut un talus acide très drainant en plein soleil et pourrit dans le sol humide qu'aime sa cousine, la bruyère à quatre angles. Tondez-la après la floraison, jamais dans le bois nu.",
    givesNote:
      "S'ouvre en juin, un mois avant la callune, et comble le creux entre les fleurs du printemps et la callune d'août — quelques semaines vraiment importantes pour les bourdons. Sa fleur en clochette convient particulièrement aux abeilles à langue longue.",
    propagationNote:
      "De courtes pousses latérales avec un talon en fin d'été, dans un terreau graveleux sans calcaire, sous châssis ombragé. Gardez-les juste humides — les boutures de bruyère se noient plus souvent qu'elles ne sèchent.",
    supportNotes: {
      "bumble-bees":
        "La bruyère cendrée s'ouvre en juin, un mois avant la callune, et fait le pont entre les fleurs de la haie et la callune d'août — quelques semaines vraiment importantes pour les colonies de bourdons à leur pleine taille.",
    },
  },
  "Erica tetralix": {
    nativeNote:
      "La bruyère des sols mouillés — tourbière de couverture, bords tremblants et landes détrempées — aux feuilles grises et douces groupées par quatre et aux clochettes rose pâle en bouquet penché.",
    careNote:
      "La réponse à un coin acide, ensoleillé et mouillé en permanence — un recoin marécageux, le bas d'un jardin, le bord d'une mare. Il lui faut cette humidité ; sur un talus sec, c'est la bruyère cendrée qu'il vous faut. Le calcaire la tue.",
    givesNote:
      "Un nectar durable tout au long de la fin d'été, sur un sol trop mouillé pour presque tout autre arbuste à fleurs, et une favorite du fadet des tourbières et des autres papillons des tourbières. Son feuillage gris et doux vaut à lui seul d'être planté.",
    propagationNote:
      "Des pousses latérales avec un talon en fin d'été, dans un mélange humide, sans calcaire et sans tourbe. Les pieds installés se marcottent en s'étalant : on peut souvent simplement détacher et déplacer des morceaux enracinés.",
    supportNotes: {
      "bumble-bees":
        "La bruyère des sols mouillés, et donc la source de nectar sur la tourbière de couverture, là où rien d'autre ne fleurit du tout.",
    },
  },
  "Vaccinium myrtillus": {
    nativeNote:
      "Fraochán — cueillie sur les collines d'Irlande le dernier dimanche de juillet depuis que l'on compte, et le sous-étage de toutes les chênaies acides d'ici.",
    careNote:
      "Sol acide, sans exception, et elle est plus heureuse à l'ombre légère sous un bouleau ou un chêne qu'à découvert. Lente à s'installer, puis elle s'étend discrètement sous terre. Ne lui donnez pas d'engrais et ne chaulez pas.",
    givesNote:
      "De loin la plus grande source de nourriture parmi les arbustes bas d'ici — 227 espèces de chenilles — plus des fleurs précoces en clochette pour les bourdons et des baies que mange tout le monde, des merles aux martres. Et vous pouvez en manger aussi.",
    propagationNote:
      "Soulevez et divisez une touffe étalée au début du printemps — elle voyage par des tiges souterraines, si bien que les morceaux enracinés se détachent facilement. Les boutures marchent dans un mélange graveleux sans calcaire, mais lentement.",
    supportNotes: {
      "green-hairstreak":
        "La myrtille est l'une des principales plantes nourricières des chenilles de la thècle de la ronce sur les collines d'Irlande — cherchez le papillon au soleil sur une feuille de myrtille aux premiers jours chauds de mai.",
      "bumble-bees":
        "Les petites clochettes roses de la myrtille s'ouvrent en avril, assez tôt pour compter, et sont faites pour qu'un bourdon s'y suspende et y plonge vers le haut.",
    },
  },
  "Rubus fruticosus agg.": {
    nativeNote:
      "Dris — ce qui remplit les haies de chaque petit chemin d'Irlande, et un agrégat de dizaines de micro-espèces indigènes étroitement apparentées plutôt qu'une seule plante.",
    careNote:
      "Ne la plantez pas dans un petit jardin en comptant la maîtriser — la ronce s'enracine partout où le bout d'une tige touche le sol et traverse une plate-bande en une saison. Plantez-la là où vous voulez une limite infranchissable, supprimez un tiers des tiges chaque hiver, et laissez-la faire.",
    givesNote:
      "Peut-être la plante la plus précieuse d'une haie irlandaise : des mois de fleurs que syrphes, bourdons et papillons butinent sans relâche, 186 espèces de chenilles, des mûres pour les oiseaux, les renards et les blaireaux, et un couvert épineux où nichent troglodytes et rouges-gorges.",
    propagationNote:
      "Enterrez le bout d'une tige arquée en fin d'été et ce sera une plante enracinée au printemps — c'est ainsi que la ronce se propage d'elle-même. Personne n'a besoin de beaucoup s'y appliquer.",
    supportNotes: {
      "blackcaps-warblers":
        "Les mûres de fin d'été sont du carburant de migration : fauvettes à tête noire, fauvettes grisettes et fauvettes des jardins s'entassent dans une ronce en fruits et ne mangent guère autre chose tant qu'elle dure.",
      "red-admiral":
        "Une ronce ensoleillée en septembre, c'est là qu'on trouve les vulcains — ils se nourrissent des fruits blets autant que des fleurs, et c'est le dernier grand repas avant de partir vers le sud ou de tenter de passer l'hiver.",
      "green-hairstreak":
        "La ronce figure sur la longue liste des plantes nourricières de la thècle de la ronce, ce qui explique en partie qu'on la trouve sur les talus de haie aussi bien que sur la lande ouverte.",
      "silver-washed-fritillary":
        "La ronce d'une allée ensoleillée est la fleur préférée du tabac d'Espagne ; en juillet, plusieurs se partagent souvent le même buisson.",
    },
  },
  "Rosa canina": {
    nativeNote:
      "La rose sauvage des haies d'Irlande — rose pâle, légèrement parfumée, qui s'élance en arc à travers l'aubépine en juin.",
    careNote:
      "Il veut du soleil et un appui — une haie, une clôture, un mur. Taillez en hiver s'il déborde, même s'il vaut bien mieux le laisser s'arquer. Il ne demande rien d'autre.",
    givesNote:
      "Une fleur simple et ouverte, pleine de pollen, que les abeilles solitaires et les syrphes peuvent vraiment atteindre — ce que les roses doubles des jardins ne peuvent offrir — puis des cynorhodons qui tiennent sur l'arbuste jusqu'en janvier pour les grives, les grives mauvis et les grives litornes.",
    propagationNote:
      "Des boutures dormantes de la grosseur d'un crayon, enfoncées en automne dans une tranchée abritée, s'enracinent bien. Les cynorhodons sont lents — nettoyez les graines et accordez-leur deux hivers dehors avant de perdre espoir.",
    supportNotes: {
      "winter-thrushes":
        "Les cynorhodons tiennent sur l'arbuste jusqu'en janvier, longtemps après la disparition des cenelles et des prunelles — le réservoir de secours d'une haie irlandaise.",
      "mason-bees":
        "Une rose simple et ouverte est pleine de pollen accessible, exactement ce qu'une rose double de jardin n'est pas. Les abeilles solitaires s'y roulent.",
    },
  },
  "Rosa spinosissima": {
    pioneerNote:
      "Le rosier très épineux pousse dans les fissures des dalles calcaires et dans le sable nu des dunes, bas et épineux face au vent de l'Atlantique.",
    nativeNote:
      "Le rosier bas et férocement épineux des dunes d'Irlande et du calcaire du Burren — des fleurs blanc crème en mai et des cynorhodons noirs, ce qu'aucun autre rosier d'ici ne possède.",
    careNote:
      "Le rosier du sable, du gravier, du calcaire et du vent salé — c'est une plante de dunes et de dalles, qui ne vous saura aucun gré d'un sol riche ou d'un abri. Il drageonne régulièrement en un fourré bas, ce qui est tout l'intérêt sur un talus et une gêne dans une plate-bande.",
    givesNote:
      "Le plus précoce des rosiers indigènes, et l'une des très rares plantes qui tiennent un talus sableux ou une pente sèche jonchée de pierres. Ses cynorhodons noirs sont inhabituels, et les oiseaux les prennent tard.",
    propagationNote:
      "Prélevez en hiver un drageon enraciné — il en fait beaucoup. Les boutures dormantes s'enracinent bien en sol sableux.",
    supportNotes: {
      "winter-thrushes":
        "Le rosier très épineux est ici le seul rosier aux cynorhodons noirs plutôt que rouges, et les grives les prennent tard — après ceux de l'églantier sur la même dune.",
    },
  },
  "Salix cinerea": {
    nativeNote:
      "Le saule des fourrés humides, des bords de fossés et de la tourbière exploitée d'Irlande — le saule le plus commun de l'île, et celui que désigne d'ordinaire le « sally garden ».",
    careNote:
      "Donnez-lui le sol le plus mouillé que vous ayez et gardez-le loin des canalisations et des fondations — les racines de saule trouvent l'eau et ne prennent pas de gants. Recépez-le tous les quelques ans pour le garder buissonnant et productif.",
    givesNote:
      "La même énorme liste de chenilles que le saule marsault, sur un sol sous l'eau la moitié de l'année, plus des chatons en mars pour les reines de bourdons qui sortent d'hibernation. Il assèche un coin détrempé plus vite que n'importe quel ouvrage.",
    propagationNote:
      "Coupez des rameaux dormants en hiver et enfoncez-les dans un sol mouillé. C'est toute la méthode ; le saule fait le reste.",
    supportNotes: {
      "bumble-bees":
        "Le saule cendré est le saule le plus commun du pays : dans la plus grande partie de l'Irlande, c'est *cette* plante qui assure le pollen de mars plutôt que son grand cousin.",
    },
  },
  "Frangula alnus": {
    nativeNote:
      "Rare et localisée en Irlande — bois humides, bords de tourbières et saulaies de bas-marais, surtout dans le centre — et la raison même de la présence du citron ici.",
    careNote:
      "Elle veut un sol humide, acide à neutre, et un peu d'abri — un bord de mare ou le côté humide d'une haie. Ses baies sont purgatives et mieux vaut les tenir hors de portée des jeunes enfants. Pour le reste, elle n'a besoin de rien.",
    givesNote:
      "**Le citron pond sur elle et presque rien d'autre.** Le citron d'Irlande s'étend vers l'ouest et c'est la bourdaine qu'il suit : un pied au jardin est une contribution réelle et précise, pas une bonne action générale. Des baies pour les fauvettes à tête noire et les grives, en plus.",
    propagationNote:
      "Retirez la chair des baies noires mûres en automne et semez dans un pot laissé dehors pour l'hiver. Les boutures semi-aoûtées de fin d'été s'enracinent correctement sous châssis ombragé.",
    supportNotes: {
      "brimstone":
        "Les nerpruns sont la seule chose que puisse manger une chenille de citron, et la bourdaine est celui des sols humides et acides d'Irlande. Le citron s'étend vers l'ouest à travers l'Irlande depuis des décennies et c'est cet arbuste qu'il suit — un seul pied est donc une contribution précise et traçable, pas une bonne action générale. L'adulte hiberne dans le lierre et c'est d'ordinaire le premier papillon du printemps irlandais.",
    },
  },
  "Euonymus europaeus": {
    nativeNote:
      "Un arbuste de haie et de lisière du pays calcaire irlandais, invisible onze mois sur douze puis stupéfiant en octobre.",
    careNote:
      "Facile en sol calcaire, à l'aise à mi-ombre, et il n'a besoin de rien. Ses fruits sont toxiques pour les humains et les animaux de compagnie : c'est un arbuste pour le fond d'une haie plutôt que pour le bord d'un bac à sable.",
    givesNote:
      "De petites fleurs vertes que syrphes et abeilles solitaires butinent assidûment en mai — elles attirent bien plus les insectes qu'elles n'en ont l'air — puis, en octobre, des capsules d'un rose criard qui s'ouvrent sur des graines orange. Rouges-gorges et merles les mangent ; l'hyponomeute du fusain aussi, dont les chenilles enveloppent l'arbuste de soie, ce dont il se remet.",
    propagationNote:
      "Retirez la chair orange des graines en automne et semez dans un pot laissé dehors — il leur faut un hiver froid, souvent deux. Les boutures semi-aoûtées en été vont plus vite.",
    supportNotes: {
      "winter-thrushes":
        "Des capsules d'un rose criard s'ouvrent en octobre sur des graines orange, et rouges-gorges et merles les prennent aussitôt.",
    },
  },
  "Viburnum opulus": {
    nativeNote:
      "Indigène des bois humides, des saulaies de bas-marais et des haies mouillées d'Irlande — et l'un des rares arbustes indigènes aux vraies couleurs d'automne.",
    careNote:
      "Accepte un sol humide, même brièvement engorgé, et la mi-ombre — ce qui en fait l'une des indigènes les plus utiles pour un coin difficile. Achetez l'espèce sauvage, pas la forme boule-de-neige 'Roseum', stérile, qui ne nourrit rien.",
    givesNote:
      "Une couronne de grandes fleurs stériles voyantes autour d'un centre de minuscules fleurs fertiles — les voyantes font la publicité et les petites sont le repas, que syrphes et coléoptères trouvent en nombre. Puis des baies rouges translucides que prennent bouvreuils et jaseurs, et un beau feuillage d'automne rouge.",
    propagationNote:
      "Les boutures semi-aoûtées de fin d'été s'enracinent bien sous châssis ombragé. Le semis demande deux hivers — une période chaude puis une froide — si bien que les boutures sont la voie raisonnable.",
    supportNotes: {
      "blackcaps-warblers":
        "Des baies rouges translucides qui restent tard — bouvreuils et fauvettes à tête noire les prennent une fois les fruits plus doux épuisés.",
    },
  },
  "Ulex europaeus": {
    pioneerNote:
      "L'ajonc fabrique son propre azote : une tranchée de voie ferrée ou un talus de sous-sol acide et pauvre lui conviennent — et il y fleurit en février.",
    nativeNote:
      "Aiteann — le jaune de chaque cap, de chaque talus de voie ferrée et de chaque colline d'Irlande, en fleur à un moment ou un autre de chaque saison.",
    careNote:
      "Pousse sur le sol le plus pauvre, le plus sec et le plus exposé que vous ayez et fixe son propre azote : ne lui donnez jamais d'engrais. Deux vraies mises en garde : il se ressème vigoureusement, et le vieil ajonc sec brûle violemment — gardez-le loin des bâtiments et rabattez-le sévèrement tous les quelques ans pour qu'il garde des pousses jeunes.",
    givesNote:
      "En fleur quand rien d'autre ne l'est. Un bourdon de sortie par une douce journée de janvier en Irlande est presque à coup sûr sur un ajonc, et ce pollen au parfum de noix de coco est ce qui fait tenir les reines précoces. Un couvert épineux et dense où nichent tariers pâtres, linottes mélodieuses et fauvettes grisettes, et un talus tenu pour de bon.",
    propagationNote:
      "Les gousses éclatent en été et projettent leurs graines dures. Entaillez chaque graine avec une lame ou frottez-la au papier de verre, faites tremper une nuit, et semez — sans traitement, elle peut attendre des décennies. À vrai dire, l'ajonc arrive généralement sans qu'on le lui demande.",
    supportNotes: {
      "bumble-bees":
        "Un bourdon de sortie par une douce journée de janvier en Irlande est presque à coup sûr sur un ajonc. Rien d'autre n'est ouvert, et ce pollen au parfum de noix de coco est ce qui mène une reine précoce jusqu'aux saules.",
      "green-hairstreak":
        "L'ajonc est l'une des principales plantes nourricières des chenilles de la thècle de la ronce, et un talus d'ajonc en mai est le meilleur endroit du pays pour en chercher une.",
    },
  },
  "Myrica gale": {
    nativeNote:
      "Raideog — l'arbuste de la tourbière de couverture et des landes humides d'Irlande, et la raison pour laquelle une promenade dans le Connemara sent ce qu'elle sent.",
    careNote:
      "Il lui faut un sol mouillé, acide et tourbeux, au soleil — un bord de mare, un jardin de tourbière, le bas humide d'un champ. Il fixe son propre azote : un sol pauvre est un atout. Il ne pousse ni sur calcaire ni au sec.",
    givesNote:
      "Ses feuilles résineuses parfument tout un jardin après la pluie et servent ici contre les moucherons depuis des siècles. Une vraie plante nourricière spécialiste des tourbières, qui retient et filtre l'eau sur un sol qui serait sinon de la tourbe nue.",
    propagationNote:
      "Il se marcotte de lui-même là où les branches touchent le sol mouillé : on peut souvent détacher des morceaux enracinés au printemps. Les boutures semi-aoûtées s'enracinent dans un mélange humide, sans calcaire et sans tourbe.",
    supportNotes: {
      "emperor-moth":
        "La myrique baumier est l'une des plantes de tourbière du petit paon de nuit, à côté de la callune avec laquelle elle partage le terrain.",
    },
  },
  "Juniperus communis": {
    nativeNote:
      "Indigène et en déclin en Irlande — sur les dalles du Burren, les montagnes de l'ouest et les falaises marines, le plus souvent en tapis bas et étalé plutôt qu'en buisson.",
    careNote:
      "Il veut un drainage parfait, le plein soleil et l'exposition — c'est une plante de rocher et de sol mince, qui se noie dans une plate-bande riche et humide. Lent. Pieds mâles et femelles sont distincts : il faut les deux pour les baies. Le genévrier irlandais est en vrai déclin : un pied planté compte.",
    givesNote:
      "Un abri persistant sur un sol trop mince et trop exposé pour toute autre plante, et des baies — trois ans à mûrir — que prennent merles à plastron, grives et grives draines. Une cinquantaine d'espèces de chenilles, ce qui est beaucoup pour un conifère.",
    propagationNote:
      "Des boutures à talon de la pousse de l'année en automne, dans un mélange graveleux sous châssis froid — lent mais fiable. Les pieds rampants se marcottent là où ils touchent le sol, la source la plus facile d'un morceau enraciné.",
    supportNotes: {
      "winter-thrushes":
        "Les cônes du genévrier mettent trois ans à mûrir, puis nourrissent merles à plastron, grives draines et grives litornes, et ses piquants offrent l'un des très rares sites de nid sûrs sur une colline découverte d'Irlande.",
    },
  },
  "Sambucus nigra": {
    nativeNote:
      "Trom — dans chaque haie, chaque fossé et chaque coin de cour de ferme d'Irlande, et chargé de plus de folklore que toute autre plante d'ici, sauf l'aubépine.",
    careNote:
      "Pousse partout, vite, surtout sur sol riche ou remué, et se ressème dans chaque gouttière et chaque mur que vous possédez. Rabattez-le sévèrement en hiver quand bon vous semble — il repart de la souche. Les baies crues et toutes les parties vertes sont toxiques ; les baies cuites ne le sont pas.",
    givesNote:
      "Des ombelles de fleurs crème en juin que les syrphes couvrent, puis des baies noires en août dont fauvettes à tête noire, autres fauvettes et étourneaux font le plein avant de migrer. Très peu de chenilles en comparaison, mais pour les oiseaux c'est l'un des meilleurs arbustes de la haie.",
    propagationNote:
      "Les boutures de bois sec dormant en hiver s'enracinent presque aussi facilement que le saule. Ou ne faites rien : les oiseaux vous en planteront un d'ici un an ou deux.",
    supportNotes: {
      "blackcaps-warblers":
        "La récolte de baies de sureau d'août est ce qui permet aux fauvettes à tête noire et aux fauvettes des jardins de prendre du poids avant de partir vers le sud — un sureau en fruits les retient deux semaines.",
    },
  },
  "Cytisus scoparius": {
    nativeNote:
      "Indigène sur les talus sableux, les tranchées de voie ferrée et les pentes acides et sèches d'Irlande — sans épines, contrairement à l'ajonc, et d'un jaune plus vif et plus franc en mai.",
    careNote:
      "Sol pauvre, sec, acide et ensoleillé — engrais et arrosage abrègent sa vie, déjà courte, une quinzaine d'années. Il se ressème volontiers : coupez les gousses si vos voisins ont un sol sableux. Il déteste être déplacé : plantez-le petit.",
    givesNote:
      "Plus d'une centaine d'espèces de chenilles, ce qui est remarquable pour un arbuste de cette taille, et une fleur explosive qui s'ouvre d'un coup sous un bourdon en visite et le saupoudre de pollen — ça vaut la peine de s'arrêter pour regarder. Fixe son propre azote sur un sol qui n'en a pas.",
    propagationNote:
      "Récoltez les gousses avant qu'elles n'éclatent en été, entaillez ou poncez les graines dures, faites tremper une nuit et semez. Semez dans le pot d'où il sera planté — le genêt supporte mal qu'on dérange ses racines, à tous les stades.",
    supportNotes: {
      "green-hairstreak":
        "Le genêt à balais rejoint l'ajonc, la callune et la myrtille sur la liste de la thècle de la ronce — plantez-en deux, n'importe lesquels, et vous aurez fait une lande dont le papillon peut se servir.",
      "bumble-bees":
        "La fleur est un piège tendu à une abeille lourde : son poids déclenche la carène, les étamines se redressent et lui plaquent du pollen sur le dos. Un insecte trop léger n'obtient rien et ne donne rien.",
    },
  },
  "Succisa pratensis": {
    nativeNote:
      "Indigène dans toutes les prairies humides, les tourbières exploitées et les bords de route d'Irlande — des pelotes à épingles bleues en fin d'été, sur un sol trop humide et trop pauvre pour l'agriculture.",
    careNote:
      "Elle veut un sol humide, non amendé, peu fertile, et le plein soleil à l'ombre légère. Elle sera étouffée dans une plate-bande riche : donnez-lui un coin humide et sauvage ou un carré de prairie fauché une fois par an en septembre, après la montée en graines.",
    givesNote:
      "**Le damier de la succise pond sur elle et rien d'autre.** Ce papillon est le seul insecte légalement protégé d'Irlande, et il est en difficulté dans toute l'Europe. En plus, elle fleurit de juillet à octobre, quand presque rien d'autre ne fleurit, et fait tenir bourdons et syrphes tout l'automne.",
    propagationNote:
      "Récoltez les têtes de graines rondes en automne et semez frais dans des caissettes laissées dehors — un hiver froid améliore nettement la germination. Les touffes installées se divisent au printemps.",
    supportNotes: {
      "marsh-fritillary":
        "Voici toute l'histoire du seul insecte protégé d'Irlande. Une femelle de damier de la succise pond toute sa ponte sous une seule feuille de succise ; les chenilles éclosent ensemble, tissent une tente de soie sur la plante et passent l'hiver dedans, blotties en un amas noir. Aux premiers jours chauds du printemps, elles sortent se chauffer en paquet sur la toile, et c'est ainsi qu'on les trouve. Pas de succise, pas de damier — et la plante ne se maintient que sur un sol humide ni fertilisé ni fauché en été, ce qui explique que le papillon ait disparu avec les prairies.",
      "bumble-bees":
        "Elle fleurit de juillet à octobre, quand presque tout le reste a fini, c'est-à-dire exactement quand une colonie de bourdons produit les reines de l'année suivante et a besoin de plus de nourriture qu'à aucun autre moment de l'année.",
    },
  },
  "Digitalis purpurea": {
    nativeNote:
      "Lus mór — dans chaque fossé, chaque clairière et chaque talus de route d'Irlande, et la première plante à apparaître là où un bois a été abattu.",
    careNote:
      "C'est une bisannuelle — des feuilles la première année, un épi la seconde, puis elle meurt — alors laissez-la se ressemer, sinon vous n'en aurez plus. Plus heureuse à mi-ombre sur sol acide, c'est-à-dire dans la plus grande partie de l'Irlande. **Toutes ses parties sont gravement toxiques** ; tenez-la loin des endroits où jouent enfants et animaux.",
    givesNote:
      "Faite sur mesure pour les bourdons : un long tube dans lequel une reine peut entrer tout entière, tacheté pour la guider, qui s'ouvre de bas en haut pendant des semaines. Observez un pied dix minutes en juin et vous verrez la plupart des espèces de bourdons de l'île.",
    propagationNote:
      "Secouez les épis mûrs au-dessus d'un sol nu en automne — la graine est fine comme de la poussière et a besoin de lumière, ne la couvrez donc pas. Une fois que vous avez des digitales, vous les avez pour toujours.",
    supportNotes: {
      "bumble-bees":
        "Une digitale est faite pour un seul animal. Sa gorge tachetée est une piste d'atterrissage et un mode d'emploi, et le tube est si profond que seul un bourdon à langue longue en atteint le fond. Regardez-en un entrer tout entier et ressortir à reculons, le dos poudré de pollen.",
    },
  },

  "Primula vulgaris": {
    nativeNote:
      "Sabhaircín — dans les fossés, sur les talus boisés et au bord des routes ombragées d'Irlande dès février, et l'un des signes les plus sûrs que l'année a tourné.",
    careNote:
      "Elle veut de l'ombre l'été et de la lumière l'hiver, exactement ce que lui offre le talus d'une haie caduque. Tenez-la loin des sols chauds et secs. Divisez une touffe après la floraison tous les deux ou trois ans : elle s'étoffera au lieu de s'éteindre.",
    givesNote:
      "En fleur dès février, elle est l'une des très rares sources de nectar quand les premières reines de bourdons et le citron sortent d'hibernation. Elle existe sous deux formes de fleur — longistyle et brévistyle —, l'exemple même de Darwin d'une plante qui oblige les insectes à la pollinisation croisée.",
    propagationNote:
      "Soulevez une touffe et séparez-la juste après la floraison, en replantant aussitôt les éclats. La graine se sème fraîche en été et passe un hiver froid dehors ; conservée, elle germe mal.",
    supportNotes: {
      brimstone:
        "Un citron qui sort d'hibernation en mars ne trouve presque rien d'ouvert. Les primevères d'un talus de fossé sont l'une des rares choses dont il puisse se nourrir avant les floraisons des arbres.",
      "mason-bees":
        "La primevère fleurit dès février sur un talus irlandais abrité, des semaines avant la plupart de l'Europe, et les premières abeilles solitaires de l'année la butinent.",
    },
  },
  "Hyacinthoides non-scripta": {
    nativeNote:
      "Coinnle corra — la jacinthe des bois indigène des chênaies et des coudraies d'Irlande, penchée d'un seul côté, d'un bleu profond et très parfumée.",
    careNote:
      "Plantez les bulbes à l'automne sous une ombre caduque, puis laissez-les entièrement tranquilles — il faut des années pour former un tapis et un seul coup de bêche maladroit pour le perdre. **N'achetez que chez un pépiniériste capable de garantir des bulbes cultivés, de souche indigène irlandaise ou britannique** : les bulbes arrachés dans la nature sont illégaux, et la jacinthe d'Espagne, en s'hybridant, fait disparaître l'indigène.",
    givesNote:
      "Du nectar précoce à l'ombre du bois, quand la canopée est encore ouverte, pour les bourdons, les syrphes et les citrons. Et un bois de jacinthes irlandais fin avril est l'une des raisons pour lesquelles on plante un jardin.",
    propagationNote:
      "Soulevez et divisez les touffes trop serrées au moment où les feuilles fanent, en juin. Le semis marche et met quatre ou cinq ans à fleurir — c'est la réponse honnête à la lenteur des tapis de jacinthes.",
    supportNotes: {
      "mason-bees":
        "Les jacinthes fleurissent dans les semaines entre le réchauffement du sol et la fermeture de la canopée — exactement quand les abeilles solitaires de printemps garnissent leurs nids. Les andrènes les butinent toute la matinée.",
    },
  },
  "Filipendula ulmaria": {
    nativeNote:
      "Airgead luachra — dans chaque fossé humide, chaque berge et chaque prairie mouillée d'Irlande, et l'odeur d'un soir d'été irlandais.",
    careNote:
      "Donnez-lui un sol humide et elle ne demande rien d'autre ; dans un massif sec, elle grille dès juillet. Dans de bonnes conditions, elle s'étend régulièrement par la racine — ce qu'on veut sur une berge de ruisseau, pas dans un petit massif.",
    givesNote:
      "Des écumes de fleurs crème que couvrent syrphes, téléphores et abeilles à langue courte — elle offre du pollen plutôt que du nectar, ce qui convient précisément à ces insectes. L'acide salicylique qu'elle contient a donné le mot « aspirine », par son ancien nom, Spiraea.",
    propagationNote:
      "Divisez une touffe à l'automne ou en début de printemps — elle se divise aussi facilement que n'importe quelle vivace d'ici. Semée fraîche à l'automne et laissée dehors, la graine germe bien au printemps.",
    supportNotes: {
      "mason-bees":
        "La reine-des-prés offre du pollen et pas une goutte de nectar, ce qui semble un mauvais marché jusqu'à ce qu'on regarde les syrphes et les abeilles à langue courte dessus — c'est précisément le pollen qu'ils sont venus chercher.",
    },
  },
  "Lythrum salicaria": {
    nativeNote:
      "Indigène au bord des rivières, des canaux et des lacs d'Irlande — de hauts épis magenta les pieds dans l'eau en juillet.",
    careNote:
      "Elle veut un endroit ensoleillé, humide ou mouillé en permanence — un bord de mare, un fossé, un jardin de pluie. Indigène et sage ici ; elle est en revanche une invasive sérieuse en Amérique du Nord, ce qui en dit long sur le déplacement des plantes, mais n'est pas une raison de s'en passer chez soi.",
    givesNote:
      "L'une des meilleures plantes à nectar de longue saison d'Irlande — trois mois de fleurs butinées aussi bien par les bourdons, les abeilles domestiques, les syrphes que les papillons. Elle a trois formes de fleur différentes qui ne peuvent se polliniser qu'entre elles : un massif réussit mieux qu'un pied isolé.",
    propagationNote:
      "Divisez les touffes installées au printemps. La graine est minuscule — pressez-la à la surface d'un terreau mouillé sans la couvrir — et germe sans peine à la chaleur.",
    supportNotes: {
      "bumble-bees":
        "Trois mois de floraison en sol mouillé, butinée par les bourdons du bas de l'épi vers le haut — l'une des plantes à nectar les plus durables qu'un bord de mare irlandais puisse porter.",
    },
  },
  "Caltha palustris": {
    nativeNote:
      "Lus buí Bealtaine — dans les prairies mouillées, les fossés et les marais d'Irlande, la première grande éclaboussure d'or fin mars.",
    careNote:
      "Il veut les pieds dans l'eau — eaux peu profondes d'une mare, creux marécageux, fossé — et ne survivra pas à un massif sec en été. Pour le reste, aucune exigence. La sève irrite la peau et toutes les parties sont toxiques si on les mange.",
    givesNote:
      "De grandes coupes d'or ouvertes fin mars, exactement quand les reines de bourdons, les premières abeilles solitaires et les syrphes émergent sans presque rien à butiner. Dans un jardin humide, c'est la fleur utile la plus précoce qui soit.",
    propagationNote:
      "Divisez les touffes juste après la floraison et replantez aussitôt dans la vase. La graine fraîche semée sur de la vase en été germe vite ; sèche, elle ne germe presque pas.",
    supportNotes: {
      "mason-bees":
        "De grandes coupes d'or ouvertes fin mars, exactement quand les premières andrènes émergent et n'ont pour ainsi dire rien d'autre à butiner.",
    },
  },
  "Centaurea nigra": {
    nativeNote:
      "Le dur bouton pourpre des bords de route et des vieilles prairies de fauche d'Irlande, en fleur dès juillet quand l'herbe a passé.",
    careNote:
      "Plein soleil et sol pauvre. Dans un massif fertile, elle s'affale ; sur un accotement maigre ou un coin de prairie fauché une fois en septembre, elle est superbe. Laissez les têtes de graines debout l'hiver.",
    givesNote:
      "En tête de toutes les enquêtes irlandaises sur les pollinisateurs pour le nectar — bourdons, abeilles domestiques, papillons et papillons de nuit diurnes la butinent tous, et elle tient jusqu'en septembre. Puis les chardonnerets démontent les têtes de graines tout l'automne.",
    propagationNote:
      "Semez la graine sur sol nu à l'automne — elle ne demande aucun traitement. Les touffes se divisent facilement au printemps.",
    supportNotes: {
      "bumble-bees":
        "La centaurée noire figure en tête de toutes les enquêtes irlandaises sur le nectar, et elle tient jusqu'en septembre, quand les fleurs d'été ont passé.",
      "goldfinches-linnets":
        "Laissez les têtes fanées debout et les chardonnerets les démontent tout l'automne, accrochés de côté aux tiges.",
      "painted-lady":
        "Une année à belles-dames — quand des millions arrivent d'Afrique du Nord en un seul été —, ce sont la centaurée et les chardons qui les nourrissent dans les prairies irlandaises.",
      "dark-green-fritillary":
        "C'est sur la centaurée qu'un grand nacré se pose assez longtemps pour qu'on le voie ; le reste du temps, ce n'est qu'un éclair orange.",
    },
  },
  "Lotus corniculatus": {
    nativeNote:
      "Crobh éin — de petites fleurs de pois jaunes et orange dans les prairies, les dunes et le lapiaz d'Irlande tout l'été.",
    careNote:
      "Soleil et sol pauvre, bien drainé. Il fixe son propre azote, ne le nourrissez donc jamais, et il déteste la concurrence d'une herbe grasse — c'est sur une pelouse maigre et affamée laissée sans tonte qu'il prospère.",
    givesNote:
      "**La plante nourricière de l'azuré commun**, et de la zygène de la filipendule — le papillon de nuit diurne aux taches écarlates des dunes irlandaises en juillet. Plus d'une centaine d'espèces de chenilles en tout, des mois de nectar, et il pousse dans la fente d'une allée.",
    propagationNote:
      "La graine a une enveloppe dure : frottez-la entre deux papiers de verre ou faites-la tremper une nuit avant de la semer au printemps. Semez en sol maigre et désherbé, pas dans un lit de semis riche.",
    supportNotes: {
      "common-blue":
        "Le lotier corniculé est la plante à chenilles de l'azuré commun, et le papillon n'est commun que là où la plante l'est. Il lui faut le lotier dans un gazon ras, maigre et jamais fertilisé — autrement dit une pelouse que personne n'a nourrie, et un accotement que personne n'a traité.",
      "six-spot-burnet":
        "La zygène de la filipendule est le papillon de nuit diurne vert métallique à taches écarlates des dunes irlandaises en juillet, et ses chenilles mangent le lotier corniculé et rien d'autre. Elle tire de la plante des composés cyanurés et les garde — c'est ce qu'annoncent les taches rouges.",
    },
  },
  "Rumex acetosa": {
    nativeNote:
      "Samhadh — le voile roux sur une prairie irlandaise en juin, et la feuille acidulée au goût de citron que les enfants ont toujours mâchée.",
    careNote:
      "Elle pousse dans n'importe quel sol ordinaire au soleil et ne demande rien. Pollinisée par le vent, ses fleurs sont pour les chenilles plutôt que pour les abeilles, et son pollen est allergisant. Coupez-la après la grenaison si vous ne la voulez pas partout.",
    givesNote:
      "L'une des plus grandes plantes à chenilles d'ici — 192 espèces — et **la plante nourricière du cuivré commun**, le petit papillon orange étincelant des bords de route et des dunes d'Irlande. Des graines pour les fringilles à l'automne.",
    propagationNote:
      "Répandez la graine sur sol nu à l'automne ou au printemps — rien d'autre n'est nécessaire. Les touffes se divisent facilement.",
    supportNotes: {
      "small-copper":
        "Le cuivré commun pond sur les oseilles et les patiences. C'est le petit papillon orange étincelant des bords de route, des dunes et des sols nus ensoleillés d'Irlande, et il est farouchement territorial pour une bête de la taille d'un ongle — un mâle chasse tout ce qui traverse son coin, oiseaux compris.",
      "goldfinches-linnets":
        "Si on les laisse debout, les têtes de graines rousses nourrissent linottes et chardonnerets tout l'automne.",
    },
  },
  "Urtica dioica": {
    nativeNote:
      "Neantóg — sur chaque coin de terre irlandais riche, remué et bien fumé, et la plus importante plante à papillons du pays.",
    careNote:
      "Oui, vraiment. Mettez-la là où on peut la contenir — derrière un abri, dans un seau enterré, au fond d'une haie — car elle s'étend vigoureusement par la racine. Elle veut un sol riche et humide au **soleil** : un carré d'orties à l'ombre ne sert à rien aux papillons. Coupez-en la moitié en juin pour offrir des pousses fraîches à la seconde génération.",
    givesNote:
      "**Les chenilles du paon-du-jour, de la petite tortue, du vulcain et du Robert-le-diable mangent toutes l'ortie et presque rien d'autre.** Quatre des papillons les plus susceptibles de visiter un jardin irlandais sortent de la plante que la plupart des jardiniers arrachent. Rien d'autre ici ne rapporte autant de papillons pour si peu d'effort.",
    propagationNote:
      "Au printemps, gants aux mains, soulevez un éclat enraciné et plantez-le là où vous pourrez le surveiller. Ne semez pas de graines dans un jardin ouvert sans y avoir sérieusement réfléchi.",
    supportNotes: {
      "peacock-butterfly":
        "Les chenilles du paon-du-jour mangent l'ortie et rien d'autre. Elles éclosent par lots d'une centaine ou plus, vivent ensemble sous une toile de soie commune au bout des pousses, et sont d'un noir de jais piqueté de blanc, hérissées d'épines — une masse d'entre elles sur un carré d'orties ne se confond avec rien. Le papillon passe ensuite l'hiver à l'état adulte dans un abri ou un arbre creux et ressort en mars.",
      "red-admiral":
        "Les chenilles du vulcain ne mangent elles aussi que l'ortie, mais elles vivent seules plutôt qu'en tas, chacune repliant une feuille sur elle-même et la cousant de soie.",
      comma:
        "Le Robert-le-diable est un nouveau venu en Irlande — signalé ici pour la première fois en 2000, il gagne maintenant le nord — et l'ortie est l'une des principales plantes sur lesquelles il pond. Sa chenille se déguise en fiente d'oiseau, blanche sur noir, une ruse assez bonne pour valoir qu'on la cherche.",
      "small-tortoiseshell":
        "Les chenilles de la petite tortue ne mangent que des orties et vivent ensemble dans une toile de soie sur les jeunes pousses, en plein soleil.",
    },
  },
  "Anemone nemorosa": {
    nativeNote:
      "Nead coille — l'étoile blanche qui nappe le sol d'un vieux bois irlandais en avril, et l'un des signes les plus sûrs qu'un bois est vraiment ancien.",
    careNote:
      "Plantez les petits rhizomes bruns à l'automne sous une ombre caduque et soyez patient — elle progresse d'à peine deux mètres en un siècle, c'est pourquoi elle signale un bois ancien. Elle disparaît entièrement au milieu de l'été : marquez son emplacement.",
    givesNote:
      "Des fleurs blanches ouvertes pendant les quelques semaines où la canopée est encore nue et où sortent les premiers syrphes et les premières abeilles solitaires. Elle offre du pollen plutôt que du nectar, exactement ce que récoltent ces abeilles précoces.",
    propagationNote:
      "Soulevez et cassez les fins rhizomes quand les feuilles jaunissent au début de l'été, et replantez aussitôt — ils ne doivent pas sécher. La graine est rarement viable, et plus lente encore.",
    supportNotes: {
      "mason-bees":
        "L'anémone des bois offre du pollen plutôt que du nectar, et c'est bien du pollen que récolte une abeille solitaire précoce — des protéines pour garnir une cellule de nid, pas du sucre pour elle-même.",
    },
  },
  "Allium ursinum": {
    nativeNote:
      "Creamh — en tapis dans les bois humides, sur les berges et dans les fossés ombragés d'Irlande, et qui sent l'ail à cinquante pas en mai.",
    careNote:
      "La réponse à l'ombre humide, profonde et désespérante — sous une haie, contre un mur au nord, le long d'un ruisseau ombragé. Il occupera entièrement ce terrain, une qualité là et un problème dans un massif. Les feuilles sont comestibles pour l'homme, mais toutes ses parties sont toxiques pour les chiens et les chats. Si vous en cueillez, vérifiez que chaque feuille sent l'ail : le muguet et le gouet tacheté lui ressemblent et sont toxiques.",
    givesNote:
      "Du blanc plein pendant des semaines là où presque rien d'autre ne pousse, et l'une des meilleures sources de nectar précoce pour les syrphes, les abeilles solitaires et les bourdons à l'ombre des bois. Un couvre-sol assez dense pour ne laisser aucune terre nue sur un talus.",
    propagationNote:
      "Semez la graine verte et fraîche en été là où vous la voulez, ou soulevez des touffes « en vert » juste après la floraison. La graine sèche est bien moins fiable.",
    supportNotes: {
      "mason-bees":
        "Des hectares de blanc en ombre profonde en mai, et l'une des rares bonnes sources de nectar des bois irlandais une fois la canopée refermée.",
    },
  },
  "Teucrium scorodonia": {
    nativeNote:
      "Sur les talus secs, les murs, les lisières acides et les pentes rocheuses d'Irlande — des feuilles à la texture de sauge et des fleurs verdâtres à une seule lèvre que les abeilles prennent au sérieux.",
    careNote:
      "L'une des très rares bonnes réponses à l'**ombre sèche** — le côté nord d'un mur, sous une haie sur talus, la lèvre sèche d'un fossé. Elle veut un sol acide et très drainant, et n'aime ni l'arrosage ni l'engrais.",
    givesNote:
      "Elle fleurit en fin d'été, quand les ressources du printemps sont épuisées, sur un sol où presque rien d'autre ne fleurit, et les bourdons à langue longue la butinent avec ardeur. Son feuillage gris-vert ridé va bien avec la callune et l'ajonc.",
    propagationNote:
      "Elle trace par la racine, si bien que les éclats enracinés se soulèvent facilement au printemps. Semée sur un terreau graveleux à l'automne, la graine germe bien.",
    supportNotes: {
      "bumble-bees":
        "La germandrée scorodoine fleurit en fin d'été sur des talus secs et ombragés où presque rien d'autre n'est en fleur, et c'est pour cela que les bourdons à langue longue la butinent avec ardeur.",
    },
  },
  "Silene dioica": {
    nativeNote:
      "Sur les talus de haies, les lisières et les bords de route ombragés d'Irlande d'avril à l'automne — rose profond, et l'une des indigènes à la plus longue floraison qui soient.",
    careNote:
      "Facile à mi-ombre en sol ordinaire — un pied de haie, un talus exposé au nord, la bordure ombragée d'une pelouse. Pieds mâles et femelles sont séparés : plantez-en quelques-uns si vous voulez des graines. Rabattez-le en juillet et il refleurit jusqu'en octobre.",
    givesNote:
      "Sept mois de floraison, chose rare chez une indigène, et 74 espèces de chenilles derrière. Les bourdons à langue longue et les papillons de nuit diurnes butinent ses fleurs.",
    propagationNote:
      "Semez la graine sur sol nu à l'automne ; elle ne demande aucun traitement et se ressème ensuite librement. Les touffes se divisent facilement au printemps.",
    supportNotes: {
      "bumble-bees":
        "Sept mois de fleurs sur un talus de haie, d'avril à octobre — très peu de vivaces indigènes tiennent aussi longtemps, et les bourdons le trouvent aux deux bouts de la saison.",
    },
  },
  "Geranium sanguineum": {
    nativeNote:
      "Le géranium magenta du lapiaz du Burren et des dunes de l'ouest — l'un des spectacles d'un mois de juin irlandais.",
    careNote:
      "Il veut du soleil et un drainage parfait en sol calcaire ou neutre — un massif de gravier, un haut de mur, un talus sec et ensoleillé. C'est une plante du calcaire, qui boude en argile lourde et humide. Pour le reste, la vivace la moins exigeante d'ici.",
    givesNote:
      "Trois mois de grandes fleurs ouvertes que bourdons et abeilles solitaires butinent sans relâche, sur un sol trop sec et caillouteux pour la plupart des plantes. De belles couleurs rouges d'automne dans le feuillage, chose rare chez une vivace.",
    propagationNote:
      "Divisez la souche ligneuse en début de printemps — la division la plus facile d'ici. La graine demande un hiver froid dehors et germe de façon irrégulière.",
    supportNotes: {
      "bumble-bees":
        "De grandes fleurs magenta ouvertes sur le calcaire sec tout le milieu de l'été — dans le Burren, c'est l'une des principales plantes à nectar sur la roche nue.",
    },
  },
  "Taraxacum officinale": {
    nativeNote:
      "Caisearbhán — indigène, partout, et la plante à laquelle plus de jardiniers irlandais ont déclaré la guerre qu'à aucune autre.",
    careNote:
      "Personne ne le plante et personne n'en a besoin. La seule décision est de le laisser ou non, et les arguments pour le laisser sont solides : arrêtez de tondre en avril et laissez fleurir la pelouse. Il s'étend vigoureusement et repart d'un morceau de racine pivotante cassé : si vous le voulez hors d'un massif, déterrez toute la racine.",
    givesNote:
      "Fin mars et en avril, un jardin irlandais n'a presque rien d'autre d'ouvert, et les reines de bourdons, les abeilles solitaires et les syrphes qui sortent de l'hiver doivent manger. Une pelouse pleine de pissenlits à ce moment-là fait plus pour les pollinisateurs que la plupart des massifs plantés en toute une année. Ensuite, 142 espèces de chenilles, et des chardonnerets sur les têtes de graines.",
    propagationNote:
      "Il vous trouvera. Si vous en voulez vraiment davantage, un court morceau de racine pivotante couché dans du terreau donne une nouvelle plante — c'est aussi pourquoi en arracher un mal en fait deux.",
    pioneerNote:
      "La plante de la fente du trottoir. Une racine pivotante qui traverse le sol tassé, et le premier vrai pollen de l'année pour quantité d'insectes.",
    supportNotes: {
      "bumble-bees":
        "La chose la plus utile d'un jardin irlandais en avril, et celle que la plupart des gens essaient de tuer. Une reine de bourdon qui fonde une colonie ce mois-là a des pissenlits ou elle n'a rien.",
      "mason-bees":
        "Un disque plat et ouvert, bourré de pollen, au ras du sol, dans les semaines où émergent les abeilles solitaires — il n'existe pas de meilleure forme pour elles.",
      "goldfinches-linnets":
        "Les chardonnerets démontent les aigrettes du pissenlit graine par graine, en vol stationnaire devant elles comme de minuscules perroquets.",
    },
  },
  "Festuca rubra": {
    nativeNote:
      "La graminée fine indigène des dunes, des hauts de falaise, des vieilles pelouses et du machair d'Irlande — l'ossature de la plupart des prairies non amendées d'ici.",
    careNote:
      "Elle supporte le sel, le sable, la sécheresse, la pauvreté du sol et le piétinement, c'est pourquoi elle entre dans tous les mélanges à gazon vendus ici. Laissée sans tonte d'avril à septembre, elle fleurit et nourrit ; tondue ras, c'est simplement une pelouse robuste. Les deux sont utiles.",
    givesNote:
      "186 espèces de chenilles — les graminées portent les myrtils, tristans, tircis et mégères dont la plupart des gens ignorent qu'ils sont nourris à l'herbe. Elle tient aussi un talus sableux mieux que presque tout le reste.",
    propagationNote:
      "Semez sur sol nu ratissé au printemps ou à l'automne. Les touffes installées se divisent facilement.",
    pioneerNote:
      "La graminée fine des accotements salés et des digues, assez tolérante aux deux pour être un classique des mélanges du littoral et des bords de route.",
    supportNotes: {
      "grass-skippers":
        "La troupe des papillons bruns d'Irlande — myrtil, tristan, tircis, mégère — ne mange que des graminées comme celle-ci, et passe l'hiver en petites chenilles au cœur de la touffe. Voilà la vraie raison pour laquelle une pelouse tondue ras n'a pas de papillons.",
    },
  },
  "Molinia caerulea": {
    nativeNote:
      "La graminée en touradons des tourbières de couverture, des landes humides et des suintements d'Irlande — elle dore les collines de l'ouest en novembre, puis devient paille.",
    careNote:
      "Elle veut un sol mouillé, acide et dégagé, en plein soleil. Elle disparaît complètement l'hiver — la plante entière, tiges florales comprises, s'en va et s'envole —, c'est donc une plante de structure d'été et d'automne, pas une persistante.",
    givesNote:
      "Les touradons sont l'endroit où hivernent les insectes de la tourbière et où nichent pipits farlouses et alouettes des champs, et elle retient l'eau sur un sol d'où elle ruissellerait sinon. Sa couleur d'automne est la plus belle de toutes les graminées d'ici.",
    propagationNote:
      "Divisez les touradons à la fin du printemps, une fois la pousse repartie — une division d'automne pourrit souvent pendant l'hiver. La graine semée fraîche dehors germe après le froid.",
    supportNotes: {
      "grass-skippers":
        "La molinie bleue est la graminée à papillons propre à la tourbière, et le fadet des tourbières — un spécialiste des tourbières en net déclin — est l'un des papillons bruns qui dépendent de prairies humides en touradons comme celle-ci.",
    },
  },
  "Deschampsia cespitosa": {
    nativeNote:
      "Le gros touradon sombre des champs mouillés, des pâtures à joncs et des allées forestières humides d'Irlande, surmonté d'un nuage de fleurs en juillet.",
    careNote:
      "L'une des très rares bonnes graminées pour l'**ombre humide** — un coin mouillé sous les arbres, le côté nord d'un jardin humide. Touradon persistant : retirez les pousses de l'an passé au râteau en début de printemps plutôt que de le tondre.",
    givesNote:
      "Une soixantaine d'espèces de chenilles et le meilleur abri d'ici pour les petits mammifères et les insectes qui hivernent — un vieux touradon est un habitat entier. Le voile de fleurs de juillet accroche la lumière rasante, et c'est pour lui qu'on la plante dans les jardins partout.",
    propagationNote:
      "Divisez le touradon au printemps à la bêche — il est coriace, filandreux et indulgent. La graine semée sur sol nu humide germe sans peine, et elle se ressème.",
    supportNotes: {
      "grass-skippers":
        "Un vieux touradon de canche est un habitat d'hiver entier — chenilles mangeuses d'herbe, araignées et coléoptères y attendent tous la fin de la mauvaise saison.",
    },
  },
  "Anthoxanthum odoratum": {
    nativeNote:
      "La première graminée à fleurir dans une prairie irlandaise, en avril — et celle qui donne au foin son odeur.",
    careNote:
      "Une graminée de prairie plutôt que de massif : semez-la en sol maigre jamais fertilisé et fauchez une fois en fin d'été. Elle est basse et peu concurrentielle, exactement ce qui la rend idéale pour un coin de fleurs sauvages où le ray-grass étoufferait tout.",
    givesNote:
      "Elle fleurit en avril, des semaines avant les autres graminées : les insectes mangeurs de pollen et les chenilles mangeuses d'herbe prennent ainsi un départ précoce. La coumarine qui donne au foin son odeur de foin vient de cette seule plante.",
    propagationNote:
      "Semez sur sol nu ratissé à l'automne — elle entre dans la plupart des mélanges de prairie indigène vendus ici. Les petites touffes se divisent au printemps.",
  },
  "Poa trivialis": {
    nativeNote:
      "Indigène dans les prairies humides, les fossés et les herbages ombragés d'Irlande — souple, étalé, et l'une des graminées les plus communes de l'île.",
    careNote:
      "Une graminée de sol humide et de mi-ombre, ce qui est inhabituel — la plupart des graminées de prairie veulent soleil et drainage. Il court en surface par stolons et tisse vite un talus humide. Dans une pelouse, il est simplement déjà là.",
    givesNote:
      "173 espèces de chenilles, juste après les fétuques parmi les graminées d'ici — les myrtils, tristans et tircis qui flottent dans un jardin irlandais en juillet ont tous grandi sur une herbe comme celle-ci. Laissé sans tonte, il abrite aussi les insectes qui hivernent au pied d'une touffe.",
    propagationNote:
      "Semez sur sol humide ratissé au printemps ou à l'automne. Il s'enracine à chaque nœud où un stolon touche la terre : un éclat enraciné se déplace en toute saison.",
    supportNotes: {
      "grass-skippers":
        "La graminée de sol humide et de mi-ombre de la même histoire — c'est pourquoi les tircis, papillons de l'ombre tachetée des haies, apparaissent là où pousse cette herbe, et pas là où pousse la fétuque.",
    },
  },
  "Hedera helix": {
    nativeNote:
      "Eidhneán — sur chaque arbre, chaque mur et chaque fossé d'Irlande, et la dernière chose en fleur avant que l'hiver ne ferme tout.",
    careNote:
      "La meilleure plante d'ici pour l'**ombre sèche et profonde**, et il grimpe sur tout. Il ne parasite pas un arbre sain, mais son poids peut abattre un arbre malade, et il trouve les failles des vieux mortiers — tenez-le donc loin des murs qui s'effritent et éclaircissez-le dans les petits arbres. Ses baies sont toxiques pour l'homme et les animaux de compagnie.",
    givesNote:
      "Deux cadeaux que rien d'autre ne fait, tous deux au mauvais bout de l'année : **du nectar en octobre**, quand vulcains, Robert-le-diable, dernières reines de guêpes et syrphes sont aux abois, et **des baies en février**, quand merles et pigeons ramiers ont tout dépouillé ailleurs. S'y ajoutent un couvert de nidification persistant et la plante nourricière de la génération d'été de l'azuré des nerpruns.",
    propagationNote:
      "Toute tige rampante posée sur le sol s'enracine en une saison. Les boutures de pousses de l'année aoûtées s'enracinent sans histoire sous châssis ombragé. Prélevez-les sur la forme adulte, buissonnante et florifère si vous voulez une plante qui fleurisse.",
    pioneerNote:
      "Il escalade un mur nu depuis une fente à son pied, dans l'ombre sèche où rien d'autre ne pousse, et fleurit en octobre quand presque rien d'autre ne fleurit.",
    supportNotes: {
      "red-admiral":
        "Le lierre fleurit en octobre, quand un vulcain qui tente de passer l'hiver irlandais ou de partir vers le sud n'a absolument rien d'autre. Un mur couvert de lierre au soleil d'automne est l'endroit le plus animé du jardin, et ce sont surtout des insectes qu'on ne s'attendait plus à voir voler.",
      "holly-blue":
        "La génération d'été de l'azuré des nerpruns pond sur le lierre, après avoir passé le printemps sur le houx. Les deux plantes dans un même jardin vous donnent le papillon deux fois par an.",
      "winter-thrushes":
        "Les baies de lierre mûrissent en février, le mois le plus affamé, quand cenelles et cynorhodons ont disparu depuis longtemps. Merles et pigeons ramiers en vivent.",
      comma:
        "Les Robert-le-diable se gavent aux fleurs de lierre avant d'hiverner à l'état adulte sur un rameau, où leur silhouette déchiquetée passe tout l'hiver pour une feuille morte.",
    },
  },
  "Lonicera periclymenum": {
    nativeNote:
      "Féithleann — il s'enroule dans le sens des aiguilles d'une montre le long des haies et des lisières d'Irlande, et parfume tout un chemin creux à la nuit tombée en juillet.",
    careNote:
      "Les pieds à l'ombre, la tête au soleil — le conseil classique, et il est juste. Donnez-lui une haie, un treillage ou un vieil arbre à escalader, et gardez la racine au frais. Ses tiges volubiles peuvent étrangler un jeune plant grêle : tenez-le loin des jeunes arbres.",
    givesNote:
      "Fait pour les papillons de nuit : ses fleurs sont pâles pour se voir au crépuscule, s'ouvrent le soir, et leur parfum porte loin — c'est aux grands sphinx de la vigne et aux autres grands sphinx qu'il s'adresse. Puis des baies rouges pour les fauvettes et les grives.",
    propagationNote:
      "Les boutures semi-aoûtées de fin d'été s'enracinent facilement sous châssis ombragé. Ou marcottez une tige basse en terre et relevez-la enracinée l'automne suivant.",
    supportNotes: {
      "hummingbird-hawk-moth":
        "Le chèvrefeuille est pâle pour se voir au crépuscule, s'ouvre le soir et répand son parfum à plusieurs mètres — tout cela s'adresse aux papillons de nuit à longue trompe. Un moro-sphinx en vol stationnaire devant ses fleurs à neuf heures un soir de juillet, c'est ce pour quoi il a été conçu.",
      "blackcaps-warblers":
        "Des grappes de baies rouges à l'automne que fauvettes et grives prennent au passage en partant vers le sud.",
    },
  },
  "Vicia cracca": {
    nativeNote:
      "Elle grimpe dans les talus de haies et les herbages rudes d'Irlande, avec des épis unilatéraux de fleurs de pois bleu violacé tout l'été.",
    careNote:
      "Elle grimpe par ses vrilles : donnez-lui un pied de haie, une clôture ou un talus herbeux rude où se hisser. Elle fixe son propre azote : ne la nourrissez jamais. Elle n'a pas besoin de treillage et y aurait l'air déplacé.",
    givesNote:
      "L'une des meilleures plantes à nectar des enquêtes irlandaises sur les pollinisateurs — les bourdons à langue longue la butinent tout l'été — et 78 espèces de chenilles. En Irlande, les vesces sont aussi les plantes où pond la piéride cryptique, notre propre papillon reconnu depuis peu.",
    propagationNote:
      "Graine à enveloppe dure : frottez-la au papier de verre ou faites-la tremper une nuit, puis semez au printemps. Elle trace aussi par la racine, et les éclats se soulèvent facilement.",
    supportNotes: {
      "bumble-bees":
        "La vesce cracca figure en tête des classements irlandais pour le nectar — ses épis violets unilatéraux sont butinés par les bourdons à langue longue tout l'été.",
      "cryptic-wood-white":
        "Les vesces comptent parmi la poignée de plantes sur lesquelles pond la piéride cryptique. Elle vole mollement le long d'un talus de haie plutôt qu'à travers un champ : une bande de vesces dans l'herbe rude est un corridor autant qu'un repas.",
    },
  },
  "Lathyrus pratensis": {
    nativeNote:
      "Le pois jaune des bords de route et des prairies de fauche d'Irlande, qui se hisse dans l'herbe par ses vrilles dès juin.",
    careNote:
      "Une plante de prairie et de bord de route, pas de massif — semez-la dans l'herbe rude où elle peut grimper, et fauchez une fois en fin d'été, après la grenaison. Elle fixe l'azote : un sol pauvre lui convient.",
    givesNote:
      "**La principale plante nourricière de la piéride cryptique**, un papillon reconnu comme espèce à part entière seulement en 2011 et qui, dans nos îles, ne vit qu'en Irlande. Les bourdons à langue longue prennent son nectar tout l'été.",
    propagationNote:
      "Entaillez ou faites tremper la graine dure avant de la semer au printemps. Une fois installée, elle trace par la racine, et les éclats enracinés se déplacent facilement.",
    supportNotes: {
      "cryptic-wood-white":
        "La gesse des prés est la principale plante à chenilles d'un papillon qui n'existe, en Grande-Bretagne et en Irlande, qu'ici — et qui n'était même pas reconnu comme espèce à part entière avant 2011. Il vit sur les bords de route, les talus de voies ferrées et les herbages humides et rudes, précisément les endroits qu'on nettoie. Laisser une bande sans fauche jusqu'en septembre, c'est toute l'intervention.",
      "bumble-bees":
        "Une fleur de pois jaune demande une abeille assez lourde pour l'ouvrir : c'est une nourriture de bourdon plutôt qu'une fleur utile à un syrphe.",
    },
  },
  "Fragaria vesca": {
    nativeNote:
      "Sú talún fiáin — sur les lisières, les pelouses calcaires et les vieux murs d'Irlande, avec des fruits d'une fraction de la taille d'une fraise du commerce et bien plus de goût.",
    careNote:
      "Il supporte la mi-ombre et s'étend par stolons en un tapis bas et dense — bien sous une haie, en bordure d'allée ou au premier plan d'un massif ombragé. Arrachez les stolons dont vous ne voulez pas ; il est facile à contenir.",
    givesNote:
      "Des fleurs blanches ouvertes pour les abeilles solitaires et les syrphes tout le printemps, puis de minuscules baies intenses que merles, rougegorges et, à vrai dire, le premier arrivé emporteront. Un bon couvre-sol contre les mauvaises herbes sur une bande difficile à mi-ombre.",
    propagationNote:
      "Rempotez les plantules des stolons à tout moment de l'été — elles sont déjà enracinées et cela prend une minute. La graine est minuscule et a besoin de lumière : pressez-la en surface sans la couvrir.",
    supportNotes: {
      "mason-bees":
        "Des fleurs blanches ouvertes dès avril à hauteur de cheville — un atterrissage facile pour les andrènes qui butinent un talus ensoleillé.",
      "blackcaps-warblers":
        "De minuscules baies intenses que rougegorges et fauvettes à tête noire trouvent bien avant quiconque muni d'un bol.",
    },
  },
  "Galium verum": {
    nativeNote:
      "Boladh cnis — une écume de minuscules fleurs jaunes au parfum de miel sur les dunes, les eskers et les pelouses calcaires sèches d'Irlande en juillet.",
    careNote:
      "Un sol sec, ensoleillé, pauvre, de préférence calcaire — un talus, un jardin de gravier, une pelouse maigre. Il s'étend par la racine en un tapis bas et ne tolère pas l'humidité hivernale. Rabattez-le à l'automne une fois les graines tombées.",
    givesNote:
      "127 espèces de chenilles, et celles qui comptent ici sont les **sphinx** : les chenilles du grand et du petit sphinx de la vigne se nourrissent de gaillets, et elles comptent parmi les insectes les plus gros et les plus saisissants qu'un jardin irlandais produise. Le parfum de miel un soir de chaleur est l'autre raison de le planter.",
    propagationNote:
      "Soulevez au printemps des éclats enracinés des tiges rampantes. La graine semée fraîche dehors à l'automne germe après le froid de l'hiver.",
    supportNotes: {
      "elephant-hawk-moth":
        "Les chenilles du grand sphinx de la vigne se nourrissent de gaillets et d'épilobes. La chenille a la taille d'un doigt, gris-brun, avec quatre ocelles qu'elle gonfle quand on l'inquiète, jusqu'à ce que l'avant ressemble à un petit serpent — la chose la plus saisissante qu'un jardin irlandais produise. L'adulte, rose et olive, butine le chèvrefeuille à la nuit tombée.",
      "hummingbird-hawk-moth":
        "Le moro-sphinx pond lui aussi sur les gaillets. Il arrive en Irlande en migrateur venu du sud, butine en vol stationnaire en plein jour avec un bourdonnement audible, et il est signalé chaque été à BirdWatch Ireland par des gens certains d'avoir vu un colibri.",
    },
  },
  "Plantago lanceolata": {
    nativeNote:
      "Slánlus — dans chaque pelouse, chaque accotement et chaque champ d'Irlande, et l'une des plantes que la plupart des gens ont arrachées sans savoir ce qu'elle nourrit.",
    careNote:
      "Vous l'avez presque à coup sûr déjà. Le seul « soin » qui vaille d'être cité est de ne pas la traiter et de laisser une bande de pelouse sans tonte dès avril — la recommandation la plus simple de l'All-Ireland Pollinator Plan, et cette plante est l'une de celles qu'elle vise.",
    givesNote:
      "170 espèces de chenilles, surtout des papillons de nuit, et des épis de graines que chardonnerets et linottes dépouillent à l'automne.",
    propagationNote:
      "Répandez la graine sur sol nu ou maigre en toute saison ; elle ne demande rien. Les rosettes se soulèvent et se déplacent facilement.",
    pioneerNote:
      "Elle pousse à plat au milieu d'un sentier piétiné et droite sur ses bords. L'une des rares plantes qui se portent vraiment mieux d'être piétinées.",
    supportNotes: {
      "goldfinches-linnets":
        "Linottes et chardonnerets dépouillent les épis de graines de la fin de l'été à l'automne. Laissez une bande de pelouse sans tonte dès avril : c'est l'une des plantes qui vous en récompensent.",
    },
  },
  "Trifolium repens": {
    nativeNote:
      "Seamair bhán — dans chaque pelouse et chaque pâture d'Irlande, et la plante le plus souvent représentée comme le shamrock.",
    careNote:
      "Il est déjà dans votre pelouse. Remontez la tondeuse et tondez toutes les six semaines au lieu de toutes les deux semaines, et il fleurira — ce seul changement est le geste pour les pollinisateurs le plus efficace qu'un jardin irlandais puisse faire, et il demande moins de travail, pas plus. Il fixe l'azote : l'herbe autour reverdit aussi.",
    givesNote:
      "Parmi les toutes meilleures plantes à nectar relevées dans les enquêtes irlandaises sur les pollinisateurs, et il est là, sous la tondeuse. 105 espèces de chenilles, et les trèfles sont les plantes où pond le souci quand il arrive du sud lors d'un bel été.",
    propagationNote:
      "Répandez la graine dans une pelouse clairsemée au printemps ou à l'automne, ou tondez simplement moins sévèrement. Les stolons enracinés se soulèvent et se déplacent en toute saison.",
    supportNotes: {
      "bumble-bees":
        "Parmi les plantes à nectar les mieux classées des enquêtes irlandaises, et il est déjà dans la pelouse. Remontez la lame et tondez toutes les six semaines au lieu de toutes les deux semaines, et il fleurit — la chose la moins chère et la moins fatigante que vous puissiez faire pour les abeilles.",
    },
  },
  "Thymus praecox": {
    nativeNote:
      "Tím chreige — des tapis pourpres et plats dans les fissures du lapiaz du Burren, sur les falaises marines et sur le sable des dunes, qui libèrent leur parfum quand on marche dessus.",
    careNote:
      "Il veut le plein soleil et le drainage le plus parfait possible — gravier, haut de mur, joints de dallage, talus exposé au sud. Il ne survit pas à un hiver humide en sol lourd, et c'est ainsi que la plupart des gens le tuent.",
    givesNote:
      "L'une des sources de nectar les plus denses au mètre carré que vous puissiez planter — un tapis de thym en juillet s'entend. Partout en Europe, le serpolet est la plante dont dépend tout l'extraordinaire cycle de vie de l'azuré du serpolet, et ici il porte 85 espèces de chenilles et toutes les abeilles à langue courte du coin.",
    propagationNote:
      "Le tapis s'enracine à mesure qu'il rampe : un éclat enraciné soulevé au printemps, et tout est fait. Les boutures tendres de début d'été s'enracinent en terreau graveleux en une semaine ou deux.",
    supportNotes: {
      "bumble-bees":
        "Un tapis de thym en juillet s'entend à un mètre ou deux. Au mètre carré, c'est l'une des sources de nectar les plus denses que vous puissiez planter.",
      "mason-bees":
        "De courts tubes au ras du sol, exactement ce que peuvent atteindre les petites abeilles solitaires du calcaire sec et du sable des dunes.",
    },
  },
  "Dryopteris filix-mas": {
    nativeNote:
      "La grande fougère en volant de badminton des fossés, des talus boisés et des murs ombragés d'Irlande — la fougère la plus commune du pays, et la plus coriace.",
    careNote:
      "La seule fougère qui tolère vraiment l'**ombre sèche** — sous une haie, contre un mur au nord, à l'abri de la pluie d'un bâtiment. Coupez les frondes de l'an passé en fin d'hiver, avant que les nouvelles ne se déroulent. Elle ne demande rien d'autre, jamais.",
    givesNote:
      "Du couvert et un abri humide au ras du sol pour les grenouilles, les tritons, les coléoptères et les insectes qui hivernent, dans l'ombre sèche ingrate où presque rien d'autre ne pousse. Les fougères nourrissent peu de chenilles — c'est honnête, et vrai de toutes —, mais l'habitat qu'elles créent vaut la place.",
    propagationNote:
      "Divisez une souche installée à la bêche en début de printemps. Pour les spores, tenez une fronde mûre au-dessus d'un papier jusqu'à ce que la poussière tombe, puis semez-la sur un terreau stérile humide sous verre et attendez des mois — gratifiant, et pas rapide.",
  },
  "Osmunda regalis": {
    nativeNote:
      "Le géant des fougères irlandaises — dans les tourbières de l'ouest, au bord des lacs et dans les bois mouillés, surtout dans le Kerry, le Connemara et le Donegal, où elle atteint la hauteur d'épaule.",
    careNote:
      "Elle veut un sol acide mouillé en permanence et une ombre légère — un bord de mare, un jardin de tourbière, un fossé mouillé. En sol sec, elle reste petite et finit par abandonner. Lente à s'installer, puis énorme et très longévive : donnez-lui la place dès maintenant.",
    givesNote:
      "Le meilleur couvert d'ici pour les grenouilles, les tritons et les invertébrés des sols humides, et une vraie plante de structure au bord d'une mare. « Royale » tient à sa taille : une vieille touffe dépasse un homme.",
    propagationNote:
      "Les spores sont vertes et ne restent viables que quelques jours : semez-les dès leur chute sur un terreau stérile humide sous verre. Une souche installée peut se diviser en début de printemps, même si elle n'aime pas ça.",
  },
  "Struthiopteris spicant": {
    nativeNote:
      "Sur les talus acides, dans les bois tourbeux et au bord des ruisseaux de montagne d'Irlande — persistant, avec deux sortes de frondes bien différentes sur la même plante.",
    careNote:
      "Un sol acide, humide et ombragé — il ne pousse ni sur le calcaire ni au sec. Persistant, il tient le coin d'ombre tout l'hiver, quand la fougère mâle a passé. Laissez les vieilles frondes jusqu'au printemps.",
    givesNote:
      "Un couvre-sol et un abri toute l'année à l'ombre humide, et l'une des très rares indigènes persistantes pour une plantation de lisière forestière acide. Les frondes fertiles étroites et dressées qui jaillissent de la rosette plate valent le coup d'œil.",
    propagationNote:
      "Semez les spores mûres sur un terreau stérile humide sous verre. Les plantes adultes forment des rejets qu'on peut détacher délicatement au printemps.",
  },
  "Asplenium scolopendrium": {
    nativeNote:
      "Dans les fissures du lapiaz du Burren, dans les fossés ombragés d'Irlande et sur les vieux murs calcaires — des frondes entières en lanière, luisantes et persistantes.",
    careNote:
      "Une plante du calcaire : elle veut de l'ombre, de l'humidité et de la chaux, ce qui en fait la fougère idéale pour un mur ombragé, une courette de sous-sol au nord ou le pied d'un vieux mur maçonné. Persistante. Taillez les frondes abîmées au printemps.",
    givesNote:
      "Un couvert d'ombre persistant et un abri pour les invertébrés du sol là où il n'y a pour ainsi dire pas de terre — fentes de mur, joints de dallage, côté sombre d'une marche. Elle pousse là où rien d'autre ici ne peut placer une racine.",
    propagationNote:
      "Les spores forment de nettes lignes brunes sous la fronde ; semez-les fraîches sur un terreau stérile humide sous verre. Elle se ressème toute seule dans le mortier humide, sans la moindre aide.",
    pioneerNote:
      "Elle vit dans le mortier d'un mur ombragé, d'un puits ou d'une courette de sous-sol — de la chaux humide, presque pas de terre, et verte tout l'hiver.",
  },
  "Polystichum setiferum": {
    nativeNote:
      "Dans les bois et les talus de haies humides et ombragés d'Irlande, surtout dans le sud et l'ouest doux — souple, finement découpé, et persistant tout l'hiver irlandais.",
    careNote:
      "De l'ombre et de l'humidité, et il est remarquablement tolérant pour tout le reste — une fois installé, il accepte un sol plus sec que la plupart des fougères. Persistant : laissez les frondes l'hiver et coupez-les en mars.",
    givesNote:
      "Un couvre-sol et un abri tout l'hiver à l'ombre, dans les mois où un jardin a le moins à offrir. Le climat doux et humide de l'Irlande lui convient mieux que presque partout ailleurs : il y devient deux fois plus grand qu'à l'intérieur des terres en Europe.",
    propagationNote:
      "Cette fougère forme de minuscules plantules le long de la nervure des frondes — fixez une fronde adulte sur un terreau humide et elles s'enracinent toutes seules, la multiplication de fougère la plus facile qui soit. Les souches se divisent aussi au printemps.",
  },
  "Betula pendula": {
    supportNotes: {
      "conifer-seed-finches":
        "Le bouleau verruqueux est plus rare en Irlande que le bouleau pubescent, mais ses chatons nourrissent les mêmes bandes hivernales de tarins et de sizerins, suspendus la tête en bas le long des rameaux.",
    },
  },
  "Salix pentandra": {
    supportNotes: {
      "poplar-hawk-moth":
        "Les chenilles du sphinx du peuplier mangent les saules autant que les peupliers et le tremble : un saule à cinq étamines dans un creux humide fait l'affaire.",
      "bumble-bees":
        "Le saule à cinq étamines fleurit tard, en mai et juin, feuilles déjà sorties : de quoi nourrir les abeilles quand les autres saules ont fini depuis longtemps.",
    },
  },
  "Salix aurita": {
    supportNotes: {
      "mason-bees":
        "Andrena clarkella, une andrène, ne récolte que du pollen de saule et sort en mars pour les premiers chatons. Un saule à oreillettes sur une lande humide lui convient très bien.",
      "poplar-hawk-moth":
        "Encore un saule sur la liste du sphinx du peuplier. Les grosses chenilles vertes, une corne au bout du corps, se plaquent le long d'un rameau et sont difficiles à repérer.",
    },
  },
  "Rubus idaeus": {
    supportNotes: {
      "bumble-bees":
        "Les fleurs du framboisier pendent vers le bas, ce qui convient aux bourdons : ils s'y accrochent par-dessous pour boire. Un massif sauvage bourdonne tout le mois de juin.",
      "blackcaps-warblers":
        "Rouges-gorges et fauvettes à tête noire prennent les fruits en juillet et en août, et les cannes sont assez denses pour y nicher.",
    },
  },
  "Iris pseudacorus": {
    supportNotes: {
      "bumble-bees":
        "Chaque fleur offre trois pistes d'atterrissage marquées de guides à nectar. Un bourdon se glisse sous le style pour boire et ressort couvert de pollen.",
    },
  },
  "Viola riviniana": {
    supportNotes: {
      "dark-green-fritillary":
        "La violette de Rivinus est la principale plante-hôte du grand nacré, qui pond sur les violettes des prairies rudes, des dunes et des coteaux ouverts.",
      "silver-washed-fritillary":
        "Le tabac d'Espagne pond sur l'écorce juste au-dessus des violettes, et les minuscules chenilles descendent les rejoindre au printemps. Des violettes en lisière de bois : c'est ce qu'il lui faut.",
    },
  },
  "Cardamine pratensis": {
    supportNotes: {
      "orange-tip":
        "L'aurore pond un seul œuf sur la tige d'une fleur, et la chenille mange les siliques à mesure qu'elles se forment. Ne fauchez pas le coin humide avant juillet, et le papillon reste.",
    },
  },
  "Silene flos-cuculi": {
    supportNotes: {
      "bumble-bees":
        "Le nectar est au fond d'un tube étroit : la fleur de coucou nourrit les bourdons à longue langue et les papillons d'une prairie humide en juin.",
    },
  },
  "Knautia arvensis": {
    supportNotes: {
      "bumble-bees":
        "Chaque tête en pelote compte des dizaines de petites fleurs, si bien qu'une abeille peut se nourrir longtemps sans voler. Les bourdons la visitent de juillet à septembre.",
    },
  },
  "Primula veris": {
    supportNotes: {
      "bumble-bees":
        "Le nectar est au fond du tube : la primevère officinale nourrit en avril les reines de bourdons à longue langue tout juste sorties d'hibernation.",
    },
  },
  "Geum rivale": {
    supportNotes: {
      "bumble-bees":
        "Les clochettes penchées pendent tête en bas, une forme qui convient aux bourdons, qui s'y accrochent par-dessous pour boire.",
    },
  },
  "Potentilla erecta": {
    supportNotes: {
      "mason-bees":
        "Andrena tarsata ne récolte le pollen que de la potentille tormentille, ou presque. Elle est devenue rare et vit là où la tormentille fleurit encore, dans les prairies et les landes non fertilisées.",
    },
  },
};
