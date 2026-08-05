// Vernacular names in **French of France (fr-FR)**, keyed on the scientific
// name. The locale is the point, not a detail: see `LOCALE` in `lib/i18n.ts`.
//
// **These are looked up, not translated.** Every entry names the reference list
// it is asserted from (see `lib/names.ts` for what each source is and why it's
// the right authority for its part of the world):
//
//   - `taxref`   — TAXREF (INPN / MNHN), the French national reference for the
//                  flora and fauna of France. The authority for anything that
//                  actually grows or flies here.
//   - `bdtfx`    — Tela Botanica's flora of metropolitan France, the names
//                  French botanists actually use.
//   - `wikidata` — the crosswalk of last resort, for taxa neither list covers
//                  (the Caribbean and Florida species, and a few insects).
//   - `catalog`  — the handful of *informal groups* Indigene itself invented
//                  ("Jays, turkeys & woodpeckers"). Those are our own label, so
//                  translating them is honest; they're keyed on `#<slug>`.
//   - `pending`  — displayed, but not yet backed by a source that speaks
//                  fr-FR. See the North American section below for how a whole
//                  block of rows ended up there.
//
// **VASCAN is not on that list.** It was, and the type now forbids it: its
// French is Canadian French, and this table is French of France.
//
// **A taxon with no established French name is deliberately absent.** Most of
// the Florida subtropicals and a good number of the North American insects have
// never been named in French, and making one up would be exactly the confident
// fabrication this app refuses to commit with a host count. An absent entry
// renders as the scientific name — see `nameLines()`.
//
// Verification: `npm run names:check` re-queries the fr-FR authorities (TAXREF,
// Tela Botanica, Wikidata) and reports any row whose name the source doesn't
// confirm, plus a source to promote each `pending` row to. It needs open
// internet (the build sandbox blocks these hosts), so it runs in CI —
// `.github/workflows/vernacular.yml` — the same arrangement `reconcile.mjs` uses.
import type { FrenchSource, NameTable } from "../lib/names";

export const TAXA_FR: NameTable<FrenchSource> = {
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
  "Artemisia vulgaris": { name: "Armoise commune", src: "taxref" },
  "Asplenium scolopendrium": { name: "Scolopendre officinale", src: "taxref" },
  "Betula pendula": { name: "Bouleau verruqueux", src: "taxref" },
  "Brachypodium pinnatum": { name: "Brachypode penné", src: "taxref" },
  "Brachypodium retusum": { name: "Brachypode rameux", src: "taxref" },
  "Calluna vulgaris": { name: "Callune", src: "taxref" },
  "Carpinus betulus": { name: "Charme commun", src: "taxref" },
  "Celtis australis": { name: "Micocoulier de Provence", src: "taxref" },
  "Centaurea nigra": { name: "Centaurée noire", src: "taxref" },
  "Centaurea scabiosa": { name: "Centaurée scabieuse", src: "taxref" },
  "Cistus albidus": { name: "Ciste cotonneux", src: "taxref" },
  "Clematis flammula": { name: "Clématite flammette", src: "taxref" },
  "Clematis vitalba": { name: "Clématite des haies", src: "taxref" },
  "Cornus mas": { name: "Cornouiller mâle", src: "taxref" },
  "Cornus sanguinea": { name: "Cornouiller sanguin", src: "taxref" },
  "Corylus avellana": { name: "Noisetier commun", src: "taxref" },
  "Crataegus laevigata": { name: "Aubépine à deux styles", src: "taxref" },
  "Crataegus monogyna": { name: "Aubépine à un style", src: "taxref" },
  "Cytisus scoparius": { name: "Genêt à balais", src: "taxref" },
  "Deschampsia cespitosa": { name: "Canche cespiteuse", src: "taxref" },
  "Digitalis purpurea": { name: "Digitale pourpre", src: "taxref" },
  "Dorycnium pentaphyllum": { name: "Badasse", src: "taxref" },
  "Dryas octopetala": { name: "Dryade à huit pétales", src: "taxref" },
  "Dryopteris filix-mas": { name: "Fougère mâle", src: "taxref" },
  "Euonymus europaeus": { name: "Fusain d'Europe", src: "taxref" },
  "Euphorbia characias": { name: "Euphorbe des vallons", src: "taxref" },
  "Fagus sylvatica": { name: "Hêtre commun", src: "taxref" },
  "Festuca nigrescens": { name: "Fétuque noirâtre", src: "taxref" },
  "Festuca rubra": { name: "Fétuque rouge", src: "taxref" },
  "Fragaria vesca": { name: "Fraisier des bois", src: "taxref" },
  "Frangula alnus": { name: "Bourdaine", src: "taxref" },
  "Fraxinus ornus": { name: "Frêne à fleurs", src: "taxref" },
  "Galium verum": { name: "Gaillet jaune", src: "taxref" },
  "Genista tinctoria": { name: "Genêt des teinturiers", src: "taxref" },
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
  "Plantago lanceolata": { name: "Plantain lancéolé", src: "taxref" },
  "Poa nemoralis": { name: "Pâturin des bois", src: "taxref" },
  "Polystichum setiferum": { name: "Polystic à soies", src: "taxref" },
  "Populus tremula": { name: "Peuplier tremble", src: "taxref" },
  "Primula veris": { name: "Primevère officinale", src: "taxref" },
  "Prunus avium": { name: "Merisier", src: "taxref" },
  "Prunus mahaleb": { name: "Bois de Sainte-Lucie", src: "taxref" },
  "Prunus spinosa": { name: "Prunellier", src: "taxref" },
  "Pyrus pyraster": { name: "Poirier sauvage", src: "taxref" },
  "Quercus ilex": { name: "Chêne vert", src: "taxref" },
  "Quercus petraea": { name: "Chêne sessile", src: "taxref" },
  "Quercus pubescens": { name: "Chêne pubescent", src: "taxref" },
  "Quercus robur": { name: "Chêne pédonculé", src: "taxref" },
  "Rhamnus alaternus": { name: "Alaterne", src: "taxref" },
  "Rhododendron ferrugineum": { name: "Rhododendron ferrugineux", src: "taxref" },
  "Rosa arvensis": { name: "Rosier des champs", src: "taxref" },
  "Rosa canina": { name: "Églantier", src: "taxref" },
  "Rubus fruticosus agg.": { name: "Ronce commune", src: "taxref" },
  "Rumex acetosa": { name: "Oseille des prés", src: "taxref" },
  "Salix caprea": { name: "Saule marsault", src: "taxref" },
  "Salvia pratensis": { name: "Sauge des prés", src: "taxref" },
  "Sambucus nigra": { name: "Sureau noir", src: "taxref" },
  "Sorbus aucuparia": { name: "Sorbier des oiseleurs", src: "taxref" },
  "Sorbus torminalis": { name: "Alisier torminal", src: "taxref" },
  "Succisa pratensis": { name: "Succise des prés", src: "taxref" },
  "Thymus serpyllum": { name: "Serpolet", src: "taxref" },
  "Thymus vulgaris": { name: "Thym commun", src: "taxref" },
  "Tilia cordata": { name: "Tilleul à petites feuilles", src: "taxref" },
  "Trifolium pratense": { name: "Trèfle des prés", src: "taxref" },
  "Trollius europaeus": { name: "Trolle d'Europe", src: "taxref" },
  "Ulmus glabra": { name: "Orme des montagnes", src: "taxref" },
  "Vaccinium myrtillus": { name: "Myrtille", src: "taxref" },
  "Vaccinium vitis-idaea": { name: "Airelle rouge", src: "taxref" },
  "Viburnum lantana": { name: "Viorne lantane", src: "taxref" },
  "Viburnum tinus": { name: "Laurier-tin", src: "taxref" },

  // Circumboreal species: on the French list *and* the North American one.
  // TAXREF wins, because it is the list a French reader's field guide follows.
  "Achillea millefolium": { name: "Achillée millefeuille", src: "taxref" },
  "Arctostaphylos uva-ursi": { name: "Busserole", src: "taxref" },

  // ---------------------------------------------------------------------
  // Flore nord-américaine — en attente d'une source française de France.
  //
  // These rows were seeded from VASCAN, the Canadian list, on the reasoning
  // that a Pacific Northwest native is unknown to the French flora but Québec
  // has named it. The reasoning was half right: Québec *has* named it — in
  // Québécois. "Bleuet" is a blueberry in Montréal and a cornflower in Paris;
  // "pruche" is a hemlock nobody in France calls a pruche; VASCAN's standard
  // name for *Pseudotsuga menziesii* is "douglas de Menzies" where every French
  // nursery says "sapin de Douglas". So the table had begun drifting away from
  // its own cited source, one hand-corrected row at a time, and the quarterly
  // check was reading that drift as *our* error.
  //
  // The names stay — most are exactly what a French reader would say, and
  // showing 87 plants in Latin overnight would be a worse answer than showing
  // them a name we're still sourcing. What's gone is the false claim about
  // where they came from. `npm run names:check` now asks the fr-FR lists about
  // each one and proposes the source to promote it to; a row nobody in France
  // has a name for should end up deleted, not relabelled.
  // ---------------------------------------------------------------------
  "Acer circinatum": { name: "Érable circiné", src: "pending" },
  "Acer macrophyllum": { name: "Érable à grandes feuilles", src: "pending" },
  "Acer rubrum": { name: "Érable rouge", src: "pending" },
  "Alnus rubra": { name: "Aulne rouge", src: "pending" },
  "Amelanchier alnifolia": { name: "Amélanchier à feuilles d'aulne", src: "pending" },
  "Amelanchier canadensis": { name: "Amélanchier du Canada", src: "pending" },
  "Anaphalis margaritacea": { name: "Anaphale marguerite", src: "pending" },
  "Andropogon gerardii": { name: "Barbon de Gérard", src: "pending" },
  "Aquilegia canadensis": { name: "Ancolie du Canada", src: "pending" },
  "Aquilegia formosa": { name: "Ancolie élégante", src: "pending" },
  "Arbutus menziesii": { name: "Arbousier de Menzies", src: "pending" },
  "Asclepias incarnata": { name: "Asclépiade incarnate", src: "pending" },
  "Asclepias speciosa": { name: "Asclépiade voyante", src: "pending" },
  "Asclepias tuberosa": { name: "Asclépiade tubéreuse", src: "pending" },
  "Berberis aquifolium": { name: "Mahonia à feuilles de houx", src: "pending" },
  "Betula nigra": { name: "Bouleau noir", src: "pending" },
  "Callicarpa americana": { name: "Callicarpe d'Amérique", src: "pending" },
  "Camassia quamash": { name: "Camassie quamash", src: "pending" },
  "Carex pensylvanica": { name: "Carex de Pennsylvanie", src: "pending" },
  "Ceanothus americanus": { name: "Céanothe d'Amérique", src: "pending" },
  "Cephalanthus occidentalis": { name: "Céphalanthe occidental", src: "pending" },
  "Cercis canadensis": { name: "Gainier du Canada", src: "pending" },
  "Chionanthus virginicus": { name: "Chionanthe de Virginie", src: "pending" },
  "Cornus florida": { name: "Cornouiller fleuri", src: "pending" },
  "Cornus nuttallii": { name: "Cornouiller de Nuttall", src: "pending" },
  "Cornus sericea": { name: "Cornouiller stolonifère", src: "pending" },
  "Corylus americana": { name: "Noisetier d'Amérique", src: "pending" },
  "Corylus cornuta": { name: "Noisetier à long bec", src: "pending" },
  "Echinacea purpurea": { name: "Échinacée pourpre", src: "pending" },
  "Elymus glaucus": { name: "Élyme glauque", src: "pending" },
  "Eutrochium purpureum": { name: "Eupatoire pourpre", src: "pending" },
  "Fragaria chiloensis": { name: "Fraisier du Chili", src: "pending" },
  "Fragaria virginiana": { name: "Fraisier de Virginie", src: "pending" },
  "Fraxinus latifolia": { name: "Frêne de l'Oregon", src: "pending" },
  "Gaultheria shallon": { name: "Gaulthérie shallon", src: "pending" },
  "Geranium maculatum": { name: "Géranium maculé", src: "pending" },
  "Hamamelis virginiana": { name: "Hamamélis de Virginie", src: "pending" },
  "Holodiscus discolor": { name: "Holodisque discolore", src: "pending" },
  "Ilex verticillata": { name: "Houx verticillé", src: "pending" },
  "Lobelia cardinalis": { name: "Lobélie cardinale", src: "pending" },
  "Lonicera ciliosa": { name: "Chèvrefeuille cilié", src: "pending" },
  "Lonicera involucrata": { name: "Chèvrefeuille involucré", src: "pending" },
  "Lonicera sempervirens": { name: "Chèvrefeuille toujours vert", src: "pending" },
  "Lupinus polyphyllus": { name: "Lupin à folioles nombreuses", src: "pending" },
  "Magnolia grandiflora": { name: "Magnolia à grandes fleurs", src: "pending" },
  "Monarda fistulosa": { name: "Monarde fistuleuse", src: "pending" },
  "Monarda punctata": { name: "Monarde ponctuée", src: "pending" },
  "Muhlenbergia capillaris": { name: "Muhlenbergie capillaire", src: "pending" },
  "Packera aurea": { name: "Séneçon doré", src: "pending" },
  "Panicum virgatum": { name: "Panic érigé", src: "pending" },
  "Parthenocissus quinquefolia": { name: "Vigne vierge à cinq folioles", src: "pending" },
  "Passiflora incarnata": { name: "Passiflore officinale", src: "pending" },
  "Penstemon digitalis": { name: "Penstémon digitale", src: "pending" },
  "Physocarpus capitatus": { name: "Physocarpe capité", src: "pending" },
  "Physocarpus opulifolius": { name: "Physocarpe à feuilles d'obier", src: "pending" },
  "Pinus palustris": { name: "Pin des marais", src: "pending" },
  "Polystichum acrostichoides": { name: "Polystic faux-acrostic", src: "pending" },
  "Polystichum munitum": { name: "Polystic à épées", src: "pending" },
  "Populus trichocarpa": { name: "Peuplier de l'Ouest", src: "pending" },
  "Prunus emarginata": { name: "Cerisier amer", src: "pending" },
  "Prunus serotina": { name: "Cerisier tardif", src: "pending" },
  "Pseudotsuga menziesii": { name: "Sapin de Douglas", src: "pending" },
  "Quercus alba": { name: "Chêne blanc", src: "pending" },
  "Quercus garryana": { name: "Chêne de Garry", src: "pending" },
  "Quercus rubra": { name: "Chêne rouge", src: "pending" },
  "Quercus virginiana": { name: "Chêne de Virginie", src: "pending" },
  "Ribes sanguineum": { name: "Groseillier sanguin", src: "pending" },
  "Rosa nutkana": { name: "Rosier de Nootka", src: "pending" },
  "Rubus spectabilis": { name: "Ronce remarquable", src: "pending" },
  "Rudbeckia fulgida": { name: "Rudbeckie éclatante", src: "pending" },
  "Salix scouleriana": { name: "Saule de Scouler", src: "pending" },
  "Sambucus racemosa": { name: "Sureau rouge", src: "pending" },
  "Schizachyrium scoparium": { name: "Barbon à balais", src: "pending" },
  "Solidago lepida": { name: "Verge d'or élégante", src: "pending" },
  "Solidago rugosa": { name: "Verge d'or rugueuse", src: "pending" },
  "Struthiopteris spicant": { name: "Blechne en épi", src: "pending" },
  "Symphoricarpos albus": { name: "Symphorine blanche", src: "pending" },
  "Symphyotrichum novae-angliae": { name: "Aster de Nouvelle-Angleterre", src: "pending" },
  "Taxodium distichum": { name: "Cyprès chauve", src: "pending" },
  "Thuja plicata": { name: "Thuya géant", src: "pending" },
  "Tripsacum dactyloides": { name: "Tripsaque dactyloïde", src: "pending" },
  "Tsuga heterophylla": { name: "Pruche de l'Ouest", src: "pending" },
  "Vaccinium corymbosum": { name: "Bleuet en corymbe", src: "pending" },
  "Vaccinium ovatum": { name: "Airelle à feuilles ovales", src: "pending" },
  "Viburnum dentatum": { name: "Viorne dentée", src: "pending" },
  "Zizia aurea": { name: "Zizia doré", src: "pending" },

  // Caribbean / Florida species with long-standing French names from the
  // French Antilles, where the same plants grow — and which are French soil,
  // so TAXREF's outre-mer coverage is the list to promote these to once the
  // check can confirm them. They route through Wikidata meanwhile, and still
  // want a second pair of eyes from a Caribbean flora.
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
  "Gonepteryx rhamni": { name: "Citron", src: "taxref" },
  "Favonius quercus": { name: "Thécla du chêne", src: "taxref" },
  "Apatura iris": { name: "Grand mars changeant", src: "taxref" },
  "Celastrina argiolus": { name: "Azuré des nerpruns", src: "taxref" },
  "Hamearis lucina": { name: "Lucine", src: "taxref" },
  "Lycaena phlaeas": { name: "Cuivré commun", src: "taxref" },
  "Satyrium w-album": { name: "Thécla de l'Orme", src: "taxref" },
  "Callophrys rubi": { name: "Thécla de la ronce", src: "taxref" },
  "Plebejus argus": { name: "Azuré de l'Ajonc", src: "taxref" },
  "Melitaea cinxia": { name: "Mélitée du Plantain", src: "taxref" },
  "Laothoe populi": { name: "Sphinx du peuplier", src: "taxref" },
  "Deilephila elpenor": { name: "Grand sphinx de la vigne", src: "taxref" },
  "Macroglossum stellatarum": { name: "Moro-sphinx", src: "taxref" },
  "Saturnia pavonia": { name: "Petit paon de nuit", src: "taxref" },
  // Holarctic: the catalog entry is written for the Pacific Northwest, but the
  // butterfly is the same animal a French reader knows as the Morio, and this
  // table keys on the scientific name. Naming it is a lookup, not a claim about
  // which plants it uses here.
  "Nymphalis antiopa": { name: "Morio", src: "taxref" },
  "Nucifraga caryocatactes": { name: "Cassenoix moucheté", src: "taxref" },
  "Lyrurus tetrix": { name: "Tétras lyre", src: "taxref" },
  "Garrulus glandarius": { name: "Geai des chênes", src: "taxref" },
  "Coccothraustes coccothraustes": { name: "Gros-bec casse-noyaux", src: "taxref" },
  "Muscardinus avellanarius": { name: "Muscardin", src: "taxref" },

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
  // Indigene's own informal groups. These are labels we wrote, not taxa anyone
  // has named, so translating them is the honest thing to do.
  //
  // **Key them the way `keyFor()` reads them**, which is `latin` first and the
  // `#<slug>` only as a fallback. Most of these groups have no `latin` at all
  // and so key on the slug — but three of them carry a *pseudo*-latin in
  // `data/wildlife.ts`: a list of genera rather than a binomial. Those three
  // must be keyed on that exact string, or the name here is never read and a
  // French reader gets "Osmia, Andrena spp." on the card. (They were, once.)
  // ---------------------------------------------------------------------
  "#grass-skippers": { name: "Hespéries et satyres", src: "catalog" },
  "Andrena, Melissodes & others": { name: "Abeilles spécialistes des astéracées", src: "catalog" },
  "Osmia, Andrena spp.": { name: "Osmies et andrènes", src: "catalog" },
  "Calypte anna, Selasphorus rufus": { name: "Colibri d'Anna et colibri roux", src: "catalog" },
  "#acorn-birds": { name: "Geais, dindons et pics", src: "catalog" },
  "#berry-songbirds": { name: "Moqueurs, cardinaux et grives", src: "catalog" },
  "#winter-thrushes": { name: "Grives litornes, mauvis et merles", src: "catalog" },
  "#blackcaps-warblers": { name: "Fauvettes à tête noire et autres fauvettes", src: "catalog" },
  "#goldfinches-linnets": { name: "Chardonnerets et linottes", src: "catalog" },
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
  "Pyrus calleryana": { name: "Poirier de Callery", src: "pending" },
};
