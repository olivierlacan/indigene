// French vernacular names, keyed on the scientific name.
//
// **These are looked up, not translated.** Every entry names the reference list
// it is asserted from (see `lib/names.ts` for what each source is and why it's
// the right authority for its part of the world):
//
//   - `taxref`   — TAXREF (INPN / MNHN), the French national reference for the
//                  flora and fauna of France. The authority for anything that
//                  actually grows or flies here.
//   - `vascan`   — Database of Vascular Plants of Canada. The authority for the
//                  North American plants TAXREF has no reason to list: a
//                  Pacific Northwest native is unknown to the French flora, but
//                  Québec has named it.
//   - `wikidata` — the crosswalk of last resort, for taxa neither list covers
//                  (the Caribbean and Florida species, and a few insects).
//   - `catalog`  — the handful of *informal groups* Indigene itself invented
//                  ("Jays, turkeys & woodpeckers"). Those are our own label, so
//                  translating them is honest; they're keyed on `#<slug>`.
//
// **A taxon with no established French name is deliberately absent.** Most of
// the Florida subtropicals and a good number of the North American insects have
// never been named in French, and making one up would be exactly the confident
// fabrication this app refuses to commit with a host count. An absent entry
// renders as the scientific name — see `nameLines()`.
//
// Verification: `npm run names:check` re-queries TAXREF, VASCAN and Wikidata and
// reports any row whose name the source doesn't confirm. It needs open internet
// (the build sandbox blocks these hosts), so it runs in CI —
// `.github/workflows/vernacular.yml` — the same arrangement `reconcile.mjs` uses.
import type { NameTable } from "../lib/names";

export const TAXA_FR: NameTable = {
  // ---------------------------------------------------------------------
  // Flore de France — TAXREF / BDTFX.
  // ---------------------------------------------------------------------
  "Acer campestre": { name: "Érable champêtre", src: "taxref" },
  "Acer monspessulanum": { name: "Érable de Montpellier", src: "taxref" },
  "Acer pseudoplatanus": { name: "Érable sycomore", src: "taxref" },
  "Alnus alnobetula": { name: "Aulne vert", src: "taxref" },
  "Alnus glutinosa": { name: "Aulne glutineux", src: "taxref" },
  "Anthyllis vulneraria": { name: "Anthyllide vulnéraire", src: "taxref" },
  "Arbutus unedo": { name: "Arbousier", src: "taxref" },
  "Betula pendula": { name: "Bouleau verruqueux", src: "taxref" },
  "Brachypodium pinnatum": { name: "Brachypode penné", src: "taxref" },
  "Brachypodium retusum": { name: "Brachypode rameux", src: "taxref" },
  "Calluna vulgaris": { name: "Callune", src: "taxref" },
  "Carpinus betulus": { name: "Charme commun", src: "taxref" },
  "Celtis australis": { name: "Micocoulier de Provence", src: "taxref" },
  "Centaurea scabiosa": { name: "Centaurée scabieuse", src: "taxref" },
  "Cistus albidus": { name: "Ciste cotonneux", src: "taxref" },
  "Clematis flammula": { name: "Clématite flammette", src: "taxref" },
  "Clematis vitalba": { name: "Clématite des haies", src: "taxref" },
  "Cornus mas": { name: "Cornouiller mâle", src: "taxref" },
  "Cornus sanguinea": { name: "Cornouiller sanguin", src: "taxref" },
  "Corylus avellana": { name: "Noisetier commun", src: "taxref" },
  "Crataegus laevigata": { name: "Aubépine à deux styles", src: "taxref" },
  "Crataegus monogyna": { name: "Aubépine à un style", src: "taxref" },
  "Deschampsia cespitosa": { name: "Canche cespiteuse", src: "taxref" },
  "Digitalis purpurea": { name: "Digitale pourpre", src: "taxref" },
  "Dorycnium pentaphyllum": { name: "Badasse", src: "taxref" },
  "Dryas octopetala": { name: "Dryade à huit pétales", src: "taxref" },
  "Dryopteris filix-mas": { name: "Fougère mâle", src: "taxref" },
  "Euonymus europaeus": { name: "Fusain d'Europe", src: "taxref" },
  "Euphorbia characias": { name: "Euphorbe des vallons", src: "taxref" },
  "Fagus sylvatica": { name: "Hêtre commun", src: "taxref" },
  "Festuca nigrescens": { name: "Fétuque noirâtre", src: "taxref" },
  "Fragaria vesca": { name: "Fraisier des bois", src: "taxref" },
  "Frangula alnus": { name: "Bourdaine", src: "taxref" },
  "Fraxinus ornus": { name: "Frêne à fleurs", src: "taxref" },
  "Gentiana lutea": { name: "Gentiane jaune", src: "taxref" },
  "Hedera helix": { name: "Lierre grimpant", src: "taxref" },
  "Helianthemum nummularium": { name: "Hélianthème nummulaire", src: "taxref" },
  "Helichrysum stoechas": { name: "Immortelle des dunes", src: "taxref" },
  "Humulus lupulus": { name: "Houblon", src: "taxref" },
  "Hyacinthoides non-scripta": { name: "Jacinthe des bois", src: "taxref" },
  "Ilex aquifolium": { name: "Houx", src: "taxref" },
  "Juniperus communis": { name: "Genévrier commun", src: "taxref" },
  "Juniperus oxycedrus": { name: "Genévrier cade", src: "taxref" },
  "Knautia arvensis": { name: "Knautie des champs", src: "taxref" },
  "Larix decidua": { name: "Mélèze d'Europe", src: "taxref" },
  "Lavandula angustifolia": { name: "Lavande vraie", src: "taxref" },
  "Ligustrum vulgare": { name: "Troène commun", src: "taxref" },
  "Lonicera periclymenum": { name: "Chèvrefeuille des bois", src: "taxref" },
  "Lotus corniculatus": { name: "Lotier corniculé", src: "taxref" },
  "Myrtus communis": { name: "Myrte commun", src: "taxref" },
  "Origanum vulgare": { name: "Origan commun", src: "taxref" },
  "Phillyrea angustifolia": { name: "Filaire à feuilles étroites", src: "taxref" },
  "Picea abies": { name: "Épicéa commun", src: "taxref" },
  "Pinus cembra": { name: "Pin cembro", src: "taxref" },
  "Pinus halepensis": { name: "Pin d'Alep", src: "taxref" },
  "Pinus sylvestris": { name: "Pin sylvestre", src: "taxref" },
  "Pistacia lentiscus": { name: "Lentisque", src: "taxref" },
  "Primula veris": { name: "Primevère officinale", src: "taxref" },
  "Prunus avium": { name: "Merisier", src: "taxref" },
  "Prunus mahaleb": { name: "Bois de Sainte-Lucie", src: "taxref" },
  "Prunus spinosa": { name: "Prunellier", src: "taxref" },
  "Quercus ilex": { name: "Chêne vert", src: "taxref" },
  "Quercus petraea": { name: "Chêne sessile", src: "taxref" },
  "Quercus pubescens": { name: "Chêne pubescent", src: "taxref" },
  "Quercus robur": { name: "Chêne pédonculé", src: "taxref" },
  "Rhamnus alaternus": { name: "Alaterne", src: "taxref" },
  "Rhododendron ferrugineum": { name: "Rhododendron ferrugineux", src: "taxref" },
  "Rosa canina": { name: "Églantier", src: "taxref" },
  "Salix caprea": { name: "Saule marsault", src: "taxref" },
  "Salvia pratensis": { name: "Sauge des prés", src: "taxref" },
  "Sambucus nigra": { name: "Sureau noir", src: "taxref" },
  "Sorbus aucuparia": { name: "Sorbier des oiseleurs", src: "taxref" },
  "Sorbus torminalis": { name: "Alisier torminal", src: "taxref" },
  "Succisa pratensis": { name: "Succise des prés", src: "taxref" },
  "Thymus serpyllum": { name: "Serpolet", src: "taxref" },
  "Thymus vulgaris": { name: "Thym commun", src: "taxref" },
  "Tilia cordata": { name: "Tilleul à petites feuilles", src: "taxref" },
  "Trollius europaeus": { name: "Trolle d'Europe", src: "taxref" },
  "Vaccinium myrtillus": { name: "Myrtille", src: "taxref" },
  "Vaccinium vitis-idaea": { name: "Airelle rouge", src: "taxref" },
  "Viburnum lantana": { name: "Viorne lantane", src: "taxref" },
  "Viburnum tinus": { name: "Laurier-tin", src: "taxref" },

  // Circumboreal species: on the French list *and* the North American one.
  // TAXREF wins, because it is the list a French reader's field guide follows.
  "Achillea millefolium": { name: "Achillée millefeuille", src: "taxref" },
  "Arctostaphylos uva-ursi": { name: "Busserole", src: "taxref" },

  // ---------------------------------------------------------------------
  // Flore nord-américaine — VASCAN (noms français normalisés du Canada).
  // ---------------------------------------------------------------------
  "Acer circinatum": { name: "Érable circiné", src: "vascan" },
  "Acer macrophyllum": { name: "Érable à grandes feuilles", src: "vascan" },
  "Acer rubrum": { name: "Érable rouge", src: "vascan" },
  "Alnus rubra": { name: "Aulne rouge", src: "vascan" },
  "Amelanchier alnifolia": { name: "Amélanchier à feuilles d'aulne", src: "vascan" },
  "Amelanchier canadensis": { name: "Amélanchier du Canada", src: "vascan" },
  "Anaphalis margaritacea": { name: "Anaphale marguerite", src: "vascan" },
  "Andropogon gerardii": { name: "Barbon de Gérard", src: "vascan" },
  "Aquilegia canadensis": { name: "Ancolie du Canada", src: "vascan" },
  "Aquilegia formosa": { name: "Ancolie élégante", src: "vascan" },
  "Arbutus menziesii": { name: "Arbousier de Menzies", src: "vascan" },
  "Asclepias incarnata": { name: "Asclépiade incarnate", src: "vascan" },
  "Asclepias speciosa": { name: "Asclépiade voyante", src: "vascan" },
  "Asclepias tuberosa": { name: "Asclépiade tubéreuse", src: "vascan" },
  "Berberis aquifolium": { name: "Mahonia à feuilles de houx", src: "vascan" },
  "Betula nigra": { name: "Bouleau noir", src: "vascan" },
  "Callicarpa americana": { name: "Callicarpe d'Amérique", src: "vascan" },
  "Camassia quamash": { name: "Camassie quamash", src: "vascan" },
  "Carex pensylvanica": { name: "Carex de Pennsylvanie", src: "vascan" },
  "Ceanothus americanus": { name: "Céanothe d'Amérique", src: "vascan" },
  "Cephalanthus occidentalis": { name: "Céphalanthe occidental", src: "vascan" },
  "Cercis canadensis": { name: "Gainier du Canada", src: "vascan" },
  "Chionanthus virginicus": { name: "Chionanthe de Virginie", src: "vascan" },
  "Cornus florida": { name: "Cornouiller fleuri", src: "vascan" },
  "Cornus nuttallii": { name: "Cornouiller de Nuttall", src: "vascan" },
  "Cornus sericea": { name: "Cornouiller stolonifère", src: "vascan" },
  "Corylus americana": { name: "Noisetier d'Amérique", src: "vascan" },
  "Corylus cornuta": { name: "Noisetier à long bec", src: "vascan" },
  "Echinacea purpurea": { name: "Échinacée pourpre", src: "vascan" },
  "Elymus glaucus": { name: "Élyme glauque", src: "vascan" },
  "Eutrochium purpureum": { name: "Eupatoire pourpre", src: "vascan" },
  "Fragaria chiloensis": { name: "Fraisier du Chili", src: "vascan" },
  "Fragaria virginiana": { name: "Fraisier de Virginie", src: "vascan" },
  "Fraxinus latifolia": { name: "Frêne de l'Oregon", src: "vascan" },
  "Gaultheria shallon": { name: "Gaulthérie shallon", src: "vascan" },
  "Geranium maculatum": { name: "Géranium maculé", src: "vascan" },
  "Hamamelis virginiana": { name: "Hamamélis de Virginie", src: "vascan" },
  "Holodiscus discolor": { name: "Holodisque discolore", src: "vascan" },
  "Ilex verticillata": { name: "Houx verticillé", src: "vascan" },
  "Lobelia cardinalis": { name: "Lobélie cardinale", src: "vascan" },
  "Lonicera ciliosa": { name: "Chèvrefeuille cilié", src: "vascan" },
  "Lonicera involucrata": { name: "Chèvrefeuille involucré", src: "vascan" },
  "Lonicera sempervirens": { name: "Chèvrefeuille toujours vert", src: "vascan" },
  "Lupinus polyphyllus": { name: "Lupin à folioles nombreuses", src: "vascan" },
  "Magnolia grandiflora": { name: "Magnolia à grandes fleurs", src: "vascan" },
  "Monarda fistulosa": { name: "Monarde fistuleuse", src: "vascan" },
  "Monarda punctata": { name: "Monarde ponctuée", src: "vascan" },
  "Muhlenbergia capillaris": { name: "Muhlenbergie capillaire", src: "vascan" },
  "Packera aurea": { name: "Séneçon doré", src: "vascan" },
  "Panicum virgatum": { name: "Panic érigé", src: "vascan" },
  "Parthenocissus quinquefolia": { name: "Vigne vierge à cinq folioles", src: "vascan" },
  "Passiflora incarnata": { name: "Passiflore officinale", src: "vascan" },
  "Penstemon digitalis": { name: "Penstémon digitale", src: "vascan" },
  "Physocarpus capitatus": { name: "Physocarpe capité", src: "vascan" },
  "Physocarpus opulifolius": { name: "Physocarpe à feuilles d'obier", src: "vascan" },
  "Pinus palustris": { name: "Pin des marais", src: "vascan" },
  "Polystichum acrostichoides": { name: "Polystic faux-acrostic", src: "vascan" },
  "Polystichum munitum": { name: "Polystic à épées", src: "vascan" },
  "Populus trichocarpa": { name: "Peuplier de l'Ouest", src: "vascan" },
  "Prunus emarginata": { name: "Cerisier amer", src: "vascan" },
  "Prunus serotina": { name: "Cerisier tardif", src: "vascan" },
  "Pseudotsuga menziesii": { name: "Sapin de Douglas", src: "vascan" },
  "Quercus alba": { name: "Chêne blanc", src: "vascan" },
  "Quercus garryana": { name: "Chêne de Garry", src: "vascan" },
  "Quercus rubra": { name: "Chêne rouge", src: "vascan" },
  "Quercus virginiana": { name: "Chêne de Virginie", src: "vascan" },
  "Ribes sanguineum": { name: "Groseillier sanguin", src: "vascan" },
  "Rosa nutkana": { name: "Rosier de Nootka", src: "vascan" },
  "Rubus spectabilis": { name: "Ronce remarquable", src: "vascan" },
  "Rudbeckia fulgida": { name: "Rudbeckie éclatante", src: "vascan" },
  "Salix scouleriana": { name: "Saule de Scouler", src: "vascan" },
  "Sambucus racemosa": { name: "Sureau rouge", src: "vascan" },
  "Schizachyrium scoparium": { name: "Barbon à balais", src: "vascan" },
  "Solidago lepida": { name: "Verge d'or élégante", src: "vascan" },
  "Solidago rugosa": { name: "Verge d'or rugueuse", src: "vascan" },
  "Struthiopteris spicant": { name: "Blechne en épi", src: "vascan" },
  "Symphoricarpos albus": { name: "Symphorine blanche", src: "vascan" },
  "Symphyotrichum novae-angliae": { name: "Aster de Nouvelle-Angleterre", src: "vascan" },
  "Taxodium distichum": { name: "Cyprès chauve", src: "vascan" },
  "Thuja plicata": { name: "Thuya géant", src: "vascan" },
  "Tripsacum dactyloides": { name: "Tripsaque dactyloïde", src: "vascan" },
  "Tsuga heterophylla": { name: "Pruche de l'Ouest", src: "vascan" },
  "Vaccinium corymbosum": { name: "Bleuet en corymbe", src: "vascan" },
  "Vaccinium ovatum": { name: "Airelle à feuilles ovales", src: "vascan" },
  "Viburnum dentatum": { name: "Viorne dentée", src: "vascan" },
  "Zizia aurea": { name: "Zizia doré", src: "vascan" },

  // Caribbean / Florida species with long-standing French names from the
  // French Antilles, where the same plants grow. Neither TAXREF (metropolitan
  // flora) nor VASCAN (Canada) is the right list, so these route through
  // Wikidata and want a second pair of eyes from a Caribbean flora.
  "Bursera simaruba": { name: "Gommier rouge", src: "wikidata" },
  "Chrysobalanus icaco": { name: "Icaquier", src: "wikidata" },
  "Coccoloba uvifera": { name: "Raisinier bord de mer", src: "wikidata" },
  "Conocarpus erectus": { name: "Palétuvier gris", src: "wikidata" },
  "Salvia coccinea": { name: "Sauge écarlate", src: "wikidata" },

  // ---------------------------------------------------------------------
  // Faune — TAXREF pour les espèces de France, Wikidata au-delà.
  // ---------------------------------------------------------------------
  "Gonepteryx cleopatra": { name: "Citron de Provence", src: "taxref" },
  "Charaxes jasius": { name: "Pacha à deux queues", src: "taxref" },
  "Libythea celtis": { name: "Libythée du micocoulier", src: "taxref" },
  "Polygonia c-album": { name: "Robert-le-Diable", src: "taxref" },
  "Polyommatus icarus": { name: "Azuré commun", src: "taxref" },
  "Phengaris arion": { name: "Azuré du serpolet", src: "taxref" },
  "Cupido minimus": { name: "Azuré minime", src: "taxref" },
  "Sphinx ligustri": { name: "Sphinx du troène", src: "taxref" },
  "Zygaena filipendulae": { name: "Zygène de la filipendule", src: "taxref" },
  "Nucifraga caryocatactes": { name: "Cassenoix moucheté", src: "taxref" },
  "Lyrurus tetrix": { name: "Tétras lyre", src: "taxref" },

  "Danaus plexippus": { name: "Monarque", src: "wikidata" },
  "Limenitis archippus": { name: "Vice-roi", src: "wikidata" },
  "Vanessa virginiensis": { name: "Vanesse de Virginie", src: "wikidata" },
  "Actias luna": { name: "Papillon lune", src: "wikidata" },
  "Archilochus colubris": { name: "Colibri à gorge rubis", src: "wikidata" },
  "Bombycilla cedrorum": { name: "Jaseur d'Amérique", src: "wikidata" },
  "Spinus tristis": { name: "Chardonneret jaune", src: "wikidata" },
  "Setophaga coronata": { name: "Paruline à croupion jaune", src: "wikidata" },
  "Gopherus polyphemus": { name: "Tortue gaufrée", src: "wikidata" },
  "Bombus spp.": { name: "Bourdons", src: "wikidata" },

  // ---------------------------------------------------------------------
  // Indigene's own informal groups (`#<slug>`). These are labels we wrote, not
  // taxa anyone has named, so translating them is the honest thing to do.
  // ---------------------------------------------------------------------
  "#grass-skippers": { name: "Hespéries et satyres", src: "catalog" },
  "#sunflower-specialist-bees": { name: "Abeilles spécialistes des astéracées", src: "catalog" },
  "#mason-bees": { name: "Osmies et andrènes", src: "catalog" },
  "#annas-rufous-hummingbird": { name: "Colibri d'Anna et colibri roux", src: "catalog" },
  "#acorn-birds": { name: "Geais, dindons et pics", src: "catalog" },
  "#berry-songbirds": { name: "Moqueurs, cardinaux et grives", src: "catalog" },
  "#winter-thrushes": { name: "Grives litornes, mauvis et merles", src: "catalog" },
  "#mediterranean-warblers": { name: "Fauvettes à tête noire et autres fauvettes", src: "catalog" },
  "#conifer-seed-finches": { name: "Becs-croisés, tarins et sizerins", src: "catalog" },
  "#acorn-mammals": { name: "Écureuils, chevreuils et autres mammifères", src: "catalog" },

  // ---------------------------------------------------------------------
  // Les sosies (`data/lookalikes.ts`) — les plantes qu'on prend pour une
  // indigène. Un imposteur est un taxon comme un autre : il a son nom dans
  // les mêmes référentiels, et la plupart de ceux-ci sont dans TAXREF pour
  // la simple raison qu'ils poussent en France, introduits ou non.
  // ---------------------------------------------------------------------
  "Acer negundo": { name: "Érable negundo", src: "taxref" },
  "Acer platanoides": { name: "Érable plane", src: "taxref" },
  "Ailanthus altissima": { name: "Ailante glanduleux", src: "taxref" },
  "Buddleja davidii": { name: "Arbre aux papillons", src: "taxref" },
  "Ficaria verna": { name: "Ficaire fausse-renoncule", src: "taxref" },
  "Lavandula × intermedia": { name: "Lavandin", src: "taxref" },
  "Lonicera japonica": { name: "Chèvrefeuille du Japon", src: "taxref" },
  "Lythrum salicaria": { name: "Salicaire commune", src: "taxref" },
  "Prunus laurocerasus": { name: "Laurier-cerise", src: "taxref" },
  // Pseudotsuga menziesii is already named above, as the Pacific Northwest
  // native it is — the same taxon, the same entry, whichever side of the
  // Atlantic the page is about.
  "Robinia pseudoacacia": { name: "Robinier faux-acacia", src: "taxref" },
  "Rubus armeniacus": { name: "Ronce d'Arménie", src: "taxref" },
  "Pyrus calleryana": { name: "Poirier de Callery", src: "vascan" },
};
