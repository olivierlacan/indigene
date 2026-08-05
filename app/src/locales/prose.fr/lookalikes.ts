// The impostors — `data/lookalikes.ts`.
//
// A look-alike is a taxon like any other, so it is keyed on its scientific name
// with the two paragraphs that describe it: where it is really from (`origin`)
// and what it does (`blurb`). The *tells* — why the two get mixed up, and how to
// tell them apart — belong to the page they appear on, so they live under the
// native plant, in that plant's region file.
//
// These are not regional, which is why they are together here: the same Norway
// maple is cited by the Mid-Atlantic and the Pacific Northwest, and cherry laurel
// by three of the four French lists.
//
// **Three impostors are not here.** Douglas-fir, holly and common ivy are each
// native in one region we cover and an impostor in another, and `lib/prose.ts`
// gives a taxon exactly one key — so their `origin` and `blurb` live beside
// their plant paragraphs, in `pnw.ts` and `france-atlantic.ts`. Splitting them
// would mean two entries under one key, and one silently overwriting the other.
import type { ProseTable } from "../../lib/prose";

export const LOOKALIKES_FR: ProseTable = {
  // -------------------------------------------------------------------------
  // Europe.
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
  "Acer negundo": {
    origin: "Indigène d'Amérique du Nord ; planté en Europe depuis les années 1600.",
    blurb:
      "L'érable qui n'en a pas l'air — sa feuille est découpée en folioles séparées. Le long des rivières françaises, il forme maintenant des bois entiers de jeunes sujets, poussant vite, cassant facilement, et prenant le terrain que les saules et les peupliers de la berge devraient tenir.",
  },
  "Ailanthus altissima": {
    origin:
      "Indigène de Chine ; planté à travers l'Europe et l'Amérique du Nord depuis les années 1700.",
    blurb:
      "L'arbre qui sort de chaque fissure de trottoir et de chaque ballast de voie ferrée. Il pousse absurdement vite, casse à la première tempête, libère une substance qui étouffe les plantes autour de lui, et renvoie une forêt de drageons depuis les racines quand on le coupe. En Amérique du Nord, c'est aussi l'hôte préféré de la cicadelle tachetée.",
  },
  "Ficaria verna": {
    origin: "Indigène d'Europe et d'Asie occidentale.",
    blurb:
      "Une renoncule jaune luisante qui tapisse les terrains frais au début du printemps et disparaît avant juin — laissant une terre nue, facilement emportée, là où les fleurs de printemps se trouvaient. Elle voyage sous forme de minuscules bulbilles qui montent sur les bottes, les pneus et les eaux de crue.",
  },
  "Lythrum salicaria": {
    origin: "Indigène d'Europe et d'Asie.",
    blurb:
      "De hauts épis magenta le long des fossés et des bords de marais, et franchement beaux. Un seul pied peut produire plus d'un million de graines en une saison, et un peuplement transforme une zone humide variée en une seule culture que très peu d'insectes indigènes savent utiliser.",
  },
  "Lavandula × intermedia": {
    origin:
      "Un hybride de lavande vraie et de lavande aspic — une plante faite par les humains, multipliée par bouturage et plantée en rangs.",
    blurb:
      "La lavande des photographies : de gros coussins ronds en longues lignes violettes sur les plateaux de Provence. Il rend plusieurs fois l'huile de la lavande vraie, ce qui explique qu'on le cultive — mais c'est un hybride stérile des champs, pas une plante sauvage du coteau.",
  },

  // -------------------------------------------------------------------------
  // Amérique du Nord.
  // -------------------------------------------------------------------------
  "Pyrus calleryana": {
    origin:
      "Indigène de Chine et du Viêt Nam ; planté dans toute l'Amérique du Nord à partir des années 1960 comme arbre d'alignement net et robuste.",
    blurb:
      "L'arbre qui blanchit des rues américaines entières dans la première semaine douce du printemps. On l'a vendu comme une plante incapable de grener — puis les différentes variétés ont commencé à se croiser entre elles. Leurs semis sont épineux, rapides et denses, et ils remplissent aujourd'hui les vieux champs, les bords de route et les lisières de tout l'Est. Plusieurs États en ont interdit la vente.",
  },
  "Cornus kousa": {
    origin: "Indigène du Japon, de Corée et de Chine.",
    blurb:
      "Le cornouiller que la plupart des pépinières tiennent, parce qu'il se moque de la maladie fongique qui embarrasse l'indigène. C'est un bel arbre de jardin et personne n'y voit une menace — ce n'est simplement pas l'arbre avec lequel les chenilles locales, et les oiseaux qui en ont besoin, ont grandi.",
  },
  "Acer platanoides": {
    origin: "Indigène d'Europe continentale et d'Asie occidentale.",
    blurb:
      "Planté par millions comme arbre d'alignement après que la graphiose a vidé les avenues, et se ressemant aujourd'hui dans les bois de l'Est. Son ombre est si dense et ses racines si superficielles que le sol sous un sujet adulte est en général nu. Plusieurs États en ont interdit la vente.",
  },
  "Acer palmatum": {
    origin: "Indigène du Japon, de Corée et de Chine.",
    blurb:
      "Le petit érable finement découpé de mille jardins de devant. Il n'est pas envahissant et ne fait rien de mal — ce n'est simplement pas l'érable qui pousse dans ces bois, et les deux se confondent dans les deux sens.",
  },
  "Lonicera maackii": {
    origin: "Indigène du nord-est de l'Asie.",
    blurb:
      "L'arbuste qui feuille le premier au printemps et reste vert le plus longtemps à l'automne — ce qui est exactement la façon de prendre un sous-bois. Les oiseaux mangent bien ses baies rouges, mais c'est la malbouffe des bois : beaucoup moins de graisses qu'une baie indigène, à la saison où un oiseau en a le plus besoin.",
  },
  "Buddleja davidii": {
    origin: "Indigène du centre de la Chine.",
    blurb:
      "Vendu comme *la* plante à papillons, et les papillons adultes y boivent réellement. Mais aucune chenille d'ici ne peut manger ses feuilles : il nourrit donc les visiteurs et n'en élève aucun. Le long des rivières du Nord-Ouest Pacifique, il se ressème dans les bancs de gravier assez densément pour être classé plante nuisible en Oregon comme dans l'État de Washington.",
  },
  "Asclepias curassavica": {
    origin: "Indigène des régions tropicales d'Amérique centrale et du Sud.",
    blurb:
      "L'asclépiade rouge et orange vendue comme plante à monarques. C'en est vraiment une — mais là où les hivers sont doux elle ne disparaît jamais, si bien que le parasite OE s'accumule sur des feuilles qui ne tombent jamais, et les monarques qui devraient voler vers le Mexique restent s'y reproduire à la place.",
  },
  "Miscanthus sinensis": {
    origin: "Indigène d'Asie de l'Est.",
    blurb:
      "La grande graminée ornementale en fontaine, à plumets argentés, en vente dans toutes les jardineries. Sa graine est portée par le vent dans les prés, les bords de route et les terrains brûlés, et ses touffes mortes restées debout propagent bien le feu.",
  },
  "Rubus armeniacus": {
    origin:
      "Indigène d'Arménie et du nord de l'Iran, malgré le nom qu'on lui a donné.",
    blurb:
      "La ronce qui a mangé le Nord-Ouest Pacifique : des cannes grosses comme un pouce, s'arquant par-dessus tout et s'enracinant là où les pointes touchent terre. Le fruit est franchement bon. Ce qu'il y a sous le fourré, c'est de la terre nue et de vieilles cannes.",
  },
  "Toxicoscordion venenosum": {
    origin:
      "Indigène du Nord-Ouest Pacifique — il appartient à ces prés exactement autant que le camas.",
    blurb:
      "Un lis des mêmes prés humides de printemps, avec les mêmes feuilles graminiformes et un bulbe qui ressemble à un bulbe de camas. Son nom dit ce qu'il veut dire : toutes ses parties sont toxiques, et il a tué du bétail comme des personnes. Hors floraison, il n'existe aucun moyen sûr de distinguer les bulbes.",
  },

  // -------------------------------------------------------------------------
  // Floride.
  // -------------------------------------------------------------------------
  "Washingtonia robusta": {
    origin: "Indigène de Basse-Californie et du Sonora, dans le nord-ouest du Mexique.",
    blurb:
      "Le palmier très haut et très mince des cartes postales de Miami et de Los Angeles. Dans le sud de la Floride, il se ressème dans les hammocks et le long des berges de canaux, et c'est le palmier le plus souvent acheté par quelqu'un qui voulait acheter un Sabal palmetto.",
  },
  "Ardisia crenata": {
    origin: "Indigène d'Asie de l'Est.",
    blurb:
      "Un vieil arbuste de devant-de-porte aux baies rouge laqué que les oiseaux emportent dans les hammocks et les bois de plaine inondable. Les semis lèvent dessous si densément qu'ils tapissent le sol — ce qui a transformé une plante de jardin bien élevée en l'une des envahissantes classées de Floride.",
  },
  "Callicarpa dichotoma": {
    origin: "Indigène d'Asie de l'Est.",
    blurb:
      "Le callicarpe net et arqué vendu pour ses fruits lilas. Il se tient bien dans un jardin et ne fait aucun mal — il porte simplement une fraction des fruits de notre propre callicarpe, sur une plante deux fois plus petite.",
  },
  "Hamelia patens var. glabra": {
    origin:
      "Une variété d'Amérique centrale et du Sud de la même espèce que le firebush de Floride — venue d'une aire entière située sur un autre continent.",
    blurb:
      "Vendue partout sous le nom de « firebush » ou de « dwarf firebush » parce qu'elle reste compacte et fleurit jeune. Ses fleurs sont plus courtes et plus pâles que celles de la plante floridienne, et ce n'est pas la plante sur laquelle ont été faites les observations de colibris, d'Heliconius charithonia et de sphinx.",
  },
  "Cycas revoluta": {
    origin:
      "Indigène du sud du Japon. Pas un palmier du tout — une cycadée, comme la Zamia integrifolia.",
    blurb:
      "Vendu par milliers dans toute la Floride comme plante de fondation robuste et architecturale. Toutes ses parties sont toxiques et ses graines gravement : c'est l'une des causes les plus fréquentes d'empoisonnement végétal mortel chez le chien.",
  },
  "Stachytarpheta cayennensis": {
    origin: "Indigène de l'Amérique tropicale, mais pas de Floride.",
    blurb:
      "Ce que la plupart des pépinières veulent dire quand l'étiquette annonce « porterweed ». C'est une bonne plante à nectar en soi, mais elle se tient haute, se ressème alentour, et elle a largement chassé du commerce la porterweed bleue rampante propre à la Floride.",
  },
};
