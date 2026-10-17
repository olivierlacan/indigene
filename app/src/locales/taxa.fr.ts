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
  // Ireland and lowland Scotland — every one of these grows wild in France too.
  "Petasites albus": { name: "Pétasite blanc", src: "taxref" },
  "Petasites japonicus": { name: "Pétasite du Japon", src: "taxref" },
  "Armeria maritima": { name: "Armérie maritime", src: "taxref" },
  "Avenella flexuosa": { name: "Canche flexueuse", src: "taxref" },
  "Cirsium heterophyllum": { name: "Cirse hétérophylle", src: "taxref" },
  "Geranium sylvaticum": { name: "Géranium des bois", src: "taxref" },
  "Geum rivale": { name: "Benoîte des ruisseaux", src: "taxref" },
  "Leucanthemum vulgare": { name: "Marguerite commune", src: "taxref" },
  "Luzula sylvatica": { name: "Luzule des bois", src: "taxref" },
  "Rhinanthus minor": { name: "Petit rhinanthe", src: "taxref" },
  "Valeriana officinalis": { name: "Valériane officinale", src: "taxref" },
  "Acer campestre": { name: "Érable champêtre", src: "taxref" },
  "Acer monspessulanum": { name: "Érable de Montpellier", src: "taxref" },
  "Acer pseudoplatanus": { name: "Érable sycomore", src: "taxref" },
  "Adiantum capillus-veneris": { name: "Capillaire de Montpellier", src: "taxref" },
  "Agave americana": { name: "Agave d'Amérique", src: "taxref" },
  "Alliaria petiolata": { name: "Alliaire", src: "taxref" },
  "Alnus alnobetula": { name: "Aulne vert", src: "taxref" },
  "Alnus glutinosa": { name: "Aulne glutineux", src: "taxref" },
  "Anthyllis vulneraria": { name: "Anthyllide vulnéraire", src: "taxref" },
  "Arbutus unedo": { name: "Arbousier", src: "wikidata" },
  "Artemisia alba": { name: "Armoise blanche", src: "taxref" },
  "Artemisia vulgaris": { name: "Armoise commune", src: "taxref" },
  "Arum italicum": { name: "Gouet d'Italie", src: "taxref" },
  "Arundo donax": { name: "Canne de Provence", src: "taxref" },
  "Asplenium ceterach": { name: "Doradille cétérac", src: "taxref" },
  "Asplenium scolopendrium": { name: "Scolopendre officinale", src: "taxref" },
  "Asplenium trichomanes": { name: "Capillaire des murailles", src: "taxref" },
  "Asplenium viride": { name: "Doradille verte", src: "taxref" },
  "Betula pendula": { name: "Bouleau verruqueux", src: "taxref" },
  "Brachypodium pinnatum": { name: "Brachypode penné", src: "taxref" },
  "Brachypodium retusum": { name: "Brachypode rameux", src: "taxref" },
  "Calluna vulgaris": { name: "Callune", src: "taxref" },
  "Cardamine pratensis": { name: "Cardamine des prés", src: "taxref" },
  "Carex flacca": { name: "Laîche glauque", src: "taxref" },
  "Carex sempervirens": { name: "Laîche toujours verte", src: "taxref" },
  "Carex sylvatica": { name: "Laîche des bois", src: "taxref" },
  "Carpinus betulus": { name: "Charme commun", src: "taxref" },
  "Carpobrotus edulis": { name: "Griffe de sorcière", src: "taxref" },
  "Celtis australis": { name: "Micocoulier de Provence", src: "taxref" },
  "Centaurea nigra": { name: "Centaurée noire", src: "taxref" },
  "Centaurea scabiosa": { name: "Centaurée scabieuse", src: "taxref" },
  "Cistus albidus": { name: "Ciste cotonneux", src: "taxref" },
  "Clematis alpina": { name: "Clématite des Alpes", src: "taxref" },
  "Clematis flammula": { name: "Clématite flammette", src: "taxref" },
  "Clematis vitalba": { name: "Clématite des haies", src: "taxref" },
  "Colchicum autumnale": { name: "Colchique d'automne", src: "taxref" },
  "Cornus mas": { name: "Cornouiller mâle", src: "taxref" },
  "Cornus sanguinea": { name: "Cornouiller sanguin", src: "taxref" },
  "Cortaderia selloana": { name: "Herbe de la pampa", src: "taxref" },
  "Corylus avellana": { name: "Noisetier commun", src: "taxref" },
  "Crataegus laevigata": { name: "Aubépine à deux styles", src: "taxref" },
  "Crataegus monogyna": { name: "Aubépine à un style", src: "taxref" },
  "Cytisus scoparius": { name: "Genêt à balais", src: "taxref" },
  "Cytisus villosus": { name: "Cytise velu", src: "taxref" },
  "Daphne mezereum": { name: "Bois-joli", src: "taxref" },
  "Deschampsia cespitosa": { name: "Canche cespiteuse", src: "taxref" },
  "Digitalis purpurea": { name: "Digitale pourpre", src: "taxref" },
  "Dorycnium pentaphyllum": { name: "Badasse", src: "taxref" },
  "Dryas octopetala": { name: "Dryade à huit pétales", src: "taxref" },
  "Dryopteris filix-mas": { name: "Fougère mâle", src: "taxref" },
  "Erica carnea": { name: "Bruyère des neiges", src: "taxref" },
  "Euonymus europaeus": { name: "Fusain d'Europe", src: "taxref" },
  "Euphorbia characias": { name: "Euphorbe des vallons", src: "taxref" },
  "Fagus sylvatica": { name: "Hêtre commun", src: "taxref" },
  "Festuca nigrescens": { name: "Fétuque noirâtre", src: "taxref" },
  "Festuca ovina": { name: "Fétuque des moutons", src: "taxref" },
  "Festuca rubra": { name: "Fétuque rouge", src: "taxref" },
  "Fragaria vesca": { name: "Fraisier des bois", src: "taxref" },
  "Frangula alnus": { name: "Bourdaine", src: "taxref" },
  "Fraxinus ornus": { name: "Frêne à fleurs", src: "taxref" },
  "Galium verum": { name: "Gaillet jaune", src: "taxref" },
  "Genista monspessulana": { name: "Genêt de Montpellier", src: "taxref" },
  "Genista scorpius": { name: "Genêt épineux", src: "taxref" },
  "Genista tinctoria": { name: "Genêt des teinturiers", src: "taxref" },
  "Gentiana lutea": { name: "Gentiane jaune", src: "taxref" },
  "Geranium robertianum": { name: "Géranium herbe-à-Robert", src: "taxref" },
  "Hedera helix": { name: "Lierre grimpant", src: "taxref" },
  "Helianthemum nummularium": { name: "Hélianthème nummulaire", src: "taxref" },
  "Helichrysum stoechas": { name: "Immortelle des dunes", src: "taxref" },
  "Humulus lupulus": { name: "Houblon", src: "taxref" },
  "Hyacinthoides non-scripta": { name: "Jacinthe des bois", src: "taxref" },
  "Ilex aquifolium": { name: "Houx", src: "taxref" },
  "Impatiens glandulifera": { name: "Balsamine de l'Himalaya", src: "taxref" },
  "Jacobaea vulgaris": { name: "Séneçon jacobée", src: "taxref" },
  "Juniperus communis": { name: "Genévrier commun", src: "taxref" },
  "Juniperus oxycedrus": { name: "Genévrier oxycèdre", src: "taxref" },
  "Knautia arvensis": { name: "Knautie des champs", src: "taxref" },
  "Larix decidua": { name: "Mélèze d'Europe", src: "taxref" },
  "Lavandula angustifolia": { name: "Lavande vraie", src: "taxref" },
  "Ligustrum vulgare": { name: "Troène commun", src: "taxref" },
  "Lonicera implexa": { name: "Chèvrefeuille des Baléares", src: "taxref" },
  "Lonicera periclymenum": { name: "Chèvrefeuille des bois", src: "taxref" },
  "Lotus corniculatus": { name: "Lotier corniculé", src: "taxref" },
  "Myrtus communis": { name: "Myrte commun", src: "taxref" },
  "Origanum vulgare": { name: "Origan commun", src: "taxref" },
  "Oxalis pes-caprae": { name: "Oxalis pied-de-chèvre", src: "taxref" },
  "Phillyrea angustifolia": { name: "Filaire à feuilles étroites", src: "wikidata" },
  "Phytolacca americana": { name: "Raisin d'Amérique", src: "taxref" },
  "Picea abies": { name: "Épicéa commun", src: "taxref" },
  "Pinus cembra": { name: "Pin cembro", src: "taxref" },
  "Pinus halepensis": { name: "Pin d'Alep", src: "taxref" },
  "Pinus sylvestris": { name: "Pin sylvestre", src: "taxref" },
  "Pistacia lentiscus": { name: "Lentisque", src: "taxref" },
  "Plantago lanceolata": { name: "Plantain lancéolé", src: "taxref" },
  "Poa nemoralis": { name: "Pâturin des bois", src: "taxref" },
  "Polystichum aculeatum": { name: "Polystic à aiguillons", src: "taxref" },
  "Polystichum lonchitis": { name: "Polystic en fer de lance", src: "taxref" },
  "Polystichum setiferum": { name: "Polystic à soies", src: "taxref" },
  "Populus nigra": { name: "Peuplier noir", src: "taxref" },
  "Populus tremula": { name: "Peuplier tremble", src: "taxref" },
  "Primula veris": { name: "Primevère officinale", src: "taxref" },
  "Prunus avium": { name: "Prunier merisier", src: "taxref" },
  "Prunus mahaleb": { name: "Bois de Sainte-Lucie", src: "taxref" },
  "Prunus padus": { name: "Merisier à grappes", src: "taxref" },
  "Prunus spinosa": { name: "Prunellier", src: "taxref" },
  "Pyrus pyraster": { name: "Poirier sauvage", src: "taxref" },
  "Pyrus spinosa": { name: "Poirier à feuilles d'amandier", src: "taxref" },
  "Quercus ilex": { name: "Chêne vert", src: "taxref" },
  "Quercus petraea": { name: "Chêne sessile", src: "taxref" },
  "Quercus pubescens": { name: "Chêne pubescent", src: "taxref" },
  "Quercus robur": { name: "Chêne pédonculé", src: "taxref" },
  "Reynoutria japonica": { name: "Renouée du Japon", src: "taxref" },
  "Reynoutria × bohemica": { name: "Renouée de Bohême", src: "taxref" },
  "Iris pseudacorus": { name: "Iris faux acore", src: "taxref" },
  "Rhamnus alaternus": { name: "Alaterne", src: "taxref" },
  "Rhododendron ferrugineum": { name: "Rhododendron ferrugineux", src: "taxref" },
  "Rosa arvensis": { name: "Rosier des champs", src: "taxref" },
  "Rosa canina": { name: "Églantier", src: "taxref" },
  "Rosa pendulina": { name: "Rosier des Alpes", src: "taxref" },
  "Rosa sempervirens": { name: "Églantier sempervirent", src: "bdtfx" },
  "Rubus fruticosus agg.": { name: "Ronce commune", src: "taxref" },
  "Rubus idaeus": { name: "Framboisier", src: "taxref" },
  "Rubus ulmifolius": { name: "Ronce à feuilles d'orme", src: "taxref" },
  "Rumex acetosa": { name: "Oseille des prés", src: "taxref" },
  "Rumex acetosella": { name: "Petite Oseille", src: "taxref" },
  "Salix alba": { name: "Saule blanc", src: "taxref" },
  "Salix caprea": { name: "Saule marsault", src: "taxref" },
  "Salvia pratensis": { name: "Sauge des prés", src: "taxref" },
  "Salvia rosmarinus": { name: "Romarin", src: "taxref" },
  "Sambucus nigra": { name: "Sureau noir", src: "taxref" },
  "Scabiosa columbaria": { name: "Scabieuse colombaire", src: "taxref" },
  "Senecio inaequidens": { name: "Séneçon du Cap", src: "taxref" },
  "Sesleria caerulea": { name: "Seslérie bleue", src: "taxref" },
  "Sorbus aucuparia": { name: "Sorbier des oiseleurs", src: "taxref" },
  "Sorbus domestica": { name: "Cormier", src: "taxref" },
  "Sorbus torminalis": { name: "Alisier torminal", src: "wikidata" },
  "Spartium junceum": { name: "Genêt d'Espagne", src: "taxref" },
  "Succisa pratensis": { name: "Succise des prés", src: "taxref" },
  "Thymus serpyllum": { name: "Thym serpolet", src: "taxref" },
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
  "Arctostaphylos uva-ursi": { name: "Busserole", src: "wikidata" },

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
  "Acer macrophyllum": { name: "Érable à grandes feuilles", src: "wikidata" },
  "Acer rubrum": { name: "Érable rouge", src: "taxref" },
  "Alnus rubra": { name: "Aulne rouge", src: "taxref" },
  "Amelanchier alnifolia": { name: "Amélanchier à feuilles d'aulne", src: "wikidata" },
  "Amelanchier canadensis": { name: "Amélanchier du Canada", src: "taxref" },
  "Anaphalis margaritacea": { name: "Anaphale marguerite", src: "taxref" },
  "Andropogon gerardii": { name: "Barbon de Gérard", src: "pending" },
  "Aquilegia canadensis": { name: "Ancolie du Canada", src: "pending" },
  "Aquilegia formosa": { name: "Ancolie élégante", src: "pending" },
  "Arbutus menziesii": { name: "Arbousier de Menzies", src: "pending" },
  "Asclepias incarnata": { name: "Asclépiade incarnate", src: "pending" },
  "Asclepias speciosa": { name: "Asclépiade voyante", src: "pending" },
  "Asclepias tuberosa": { name: "Asclépiade tubéreuse", src: "pending" },
  "Berberis aquifolium": { name: "Mahonia à feuilles de houx", src: "taxref" },
  "Betula nigra": { name: "Bouleau noir", src: "wikidata" },
  "Callicarpa americana": { name: "Callicarpe d'Amérique", src: "wikidata" },
  "Camassia quamash": { name: "Camassie quamash", src: "pending" },
  "Carex pensylvanica": { name: "Carex de Pennsylvanie", src: "pending" },
  "Ceanothus americanus": { name: "Céanothe d'Amérique", src: "taxref" },
  "Cephalanthus occidentalis": { name: "Céphalanthe occidental", src: "pending" },
  "Cercis canadensis": { name: "Gainier du Canada", src: "taxref" },
  "Chionanthus virginicus": { name: "Chionanthe de Virginie", src: "pending" },
  "Cornus florida": { name: "Cornouiller fleuri", src: "taxref" },
  "Cornus nuttallii": { name: "Cornouiller de Nuttall", src: "pending" },
  "Cornus sericea": { name: "Cornouiller stolonifère", src: "taxref" },
  "Corylus americana": { name: "Noisetier d'Amérique", src: "pending" },
  "Corylus cornuta": { name: "Noisetier à long bec", src: "wikidata" },
  "Echinacea purpurea": { name: "Échinacée pourpre", src: "taxref" },
  "Elymus glaucus": { name: "Élyme glauque", src: "pending" },
  "Eutrochium purpureum": { name: "Eupatoire pourpre", src: "pending" },
  "Fragaria chiloensis": { name: "Fraisier du Chili", src: "taxref" },
  "Fragaria virginiana": { name: "Fraisier de Virginie", src: "taxref" },
  "Fraxinus latifolia": { name: "Frêne de l'Oregon", src: "wikidata" },
  "Gaultheria shallon": { name: "Gaulthérie shallon", src: "taxref" },
  "Geranium maculatum": { name: "Géranium maculé", src: "pending" },
  "Hamamelis virginiana": { name: "Hamamélis de Virginie", src: "taxref" },
  "Holodiscus discolor": { name: "Holodisque discolore", src: "taxref" },
  "Ilex verticillata": { name: "Houx verticillé", src: "pending" },
  "Lobelia cardinalis": { name: "Lobélie cardinale", src: "pending" },
  "Lonicera ciliosa": { name: "Chèvrefeuille cilié", src: "pending" },
  "Lonicera involucrata": { name: "Chèvrefeuille involucré", src: "wikidata" },
  "Lonicera sempervirens": { name: "Chèvrefeuille toujours vert", src: "taxref" },
  "Lupinus polyphyllus": { name: "Lupin à folioles nombreuses", src: "taxref" },
  "Magnolia grandiflora": { name: "Magnolia à grandes fleurs", src: "taxref" },
  "Monarda fistulosa": { name: "Monarde fistuleuse", src: "taxref" },
  "Monarda punctata": { name: "Monarde ponctuée", src: "taxref" },
  "Muhlenbergia capillaris": { name: "Muhlenbergie capillaire", src: "pending" },
  "Packera aurea": { name: "Séneçon doré", src: "pending" },
  "Panicum virgatum": { name: "Panic érigé", src: "pending" },
  "Parthenocissus quinquefolia": { name: "Vigne vierge à cinq folioles", src: "pending" },
  "Passiflora incarnata": { name: "Passiflore officinale", src: "pending" },
  "Penstemon digitalis": { name: "Penstémon digitale", src: "pending" },
  "Physocarpus capitatus": { name: "Physocarpe capité", src: "pending" },
  "Physocarpus opulifolius": { name: "Physocarpe à feuilles d'obier", src: "taxref" },
  "Pinus palustris": { name: "Pin des marais", src: "taxref" },
  "Polystichum acrostichoides": { name: "Polystic faux-acrostic", src: "pending" },
  "Polystichum munitum": { name: "Polystic à épées", src: "taxref" },
  "Populus trichocarpa": { name: "Peuplier de l'Ouest", src: "pending" },
  "Prunus emarginata": { name: "Cerisier amer", src: "pending" },
  "Prunus serotina": { name: "Cerisier tardif", src: "taxref" },
  "Pseudotsuga menziesii": { name: "Sapin de Douglas", src: "taxref" },
  "Quercus alba": { name: "Chêne blanc", src: "taxref" },
  "Quercus garryana": { name: "Chêne de Garry", src: "wikidata" },
  "Quercus rubra": { name: "Chêne rouge", src: "taxref" },
  "Quercus virginiana": { name: "Chêne de Virginie", src: "pending" },
  "Ribes sanguineum": { name: "Groseillier sanguin", src: "taxref" },
  "Rosa nutkana": { name: "Rosier de Nootka", src: "pending" },
  "Rubus spectabilis": { name: "Ronce remarquable", src: "wikidata" },
  "Rudbeckia fulgida": { name: "Rudbeckie éclatante", src: "pending" },
  "Salix scouleriana": { name: "Saule de Scouler", src: "pending" },
  "Sambucus racemosa": { name: "Sureau rouge", src: "taxref" },
  "Schizachyrium scoparium": { name: "Barbon à balais", src: "pending" },
  "Solidago lepida": { name: "Verge d'or élégante", src: "pending" },
  "Solidago rugosa": { name: "Verge d'or rugueuse", src: "pending" },
  "Struthiopteris spicant": { name: "Blechne en épi", src: "taxref" },
  "Symphoricarpos albus": { name: "Symphorine blanche", src: "taxref" },
  "Symphyotrichum novae-angliae": { name: "Aster de Nouvelle-Angleterre", src: "taxref" },
  "Taxodium distichum": { name: "Cyprès chauve", src: "taxref" },
  "Thuja plicata": { name: "Thuya géant", src: "taxref" },
  "Tripsacum dactyloides": { name: "Tripsaque dactyloïde", src: "pending" },
  "Tsuga heterophylla": { name: "Pruche de l'Ouest", src: "taxref" },
  "Vaccinium corymbosum": { name: "Bleuet en corymbe", src: "taxref" },
  "Vaccinium ovatum": { name: "Airelle à feuilles ovales", src: "pending" },
  "Viburnum dentatum": { name: "Viorne dentée", src: "pending" },
  "Zizia aurea": { name: "Zizia doré", src: "pending" },

  // Caribbean / Florida species with long-standing French names from the
  // French Antilles, where the same plants grow — and which are French soil,
  // so TAXREF's outre-mer coverage is the list to promote these to once the
  // check can confirm them. They route through Wikidata meanwhile, and still
  // want a second pair of eyes from a Caribbean flora.
  "Bursera simaruba": { name: "Gommier rouge", src: "pending" },
  "Chrysobalanus icaco": { name: "Icaquier", src: "taxref" },
  "Coccoloba uvifera": { name: "Raisinier bord de mer", src: "pending" },
  "Conocarpus erectus": { name: "Palétuvier gris", src: "pending" },
  "Salvia coccinea": { name: "Sauge écarlate", src: "taxref" },

  // ---------------------------------------------------------------------
  // Faune — TAXREF pour les espèces de France, Wikidata au-delà.
  // ---------------------------------------------------------------------
  "Gonepteryx cleopatra": { name: "Citron de Provence", src: "taxref" },
  "Charaxes jasius": { name: "Pacha à deux queues", src: "taxref" },
  "Libythea celtis": { name: "Libythée du micocoulier", src: "taxref" },
  "Polygonia c-album": { name: "Robert-le-Diable", src: "taxref" },
  "Polyommatus icarus": { name: "Azuré commun", src: "wikidata" },
  "Phengaris arion": { name: "Azuré du serpolet", src: "taxref" },
  "Cupido minimus": { name: "Argus frêle", src: "taxref" },
  "Sphinx ligustri": { name: "Sphinx du troène", src: "taxref" },
  "Zygaena filipendulae": { name: "Zygène de la filipendule", src: "taxref" },
  "Gonepteryx rhamni": { name: "Citron", src: "taxref" },
  "Anthocharis cardamines": { name: "Aurore", src: "taxref" },
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
  "Coccothraustes coccothraustes": { name: "Grosbec casse-noyaux", src: "taxref" },
  "Muscardinus avellanarius": { name: "Muscardin", src: "taxref" },

  "Danaus plexippus": { name: "Monarque", src: "wikidata" },
  "Limenitis archippus": { name: "Vice-roi", src: "wikidata" },
  "Vanessa virginiensis": { name: "Vanesse des perlières", src: "wikidata" },
  "Actias luna": { name: "Papillon lune", src: "wikidata" },
  "Archilochus colubris": { name: "Colibri à gorge rubis", src: "wikidata" },
  "Bombycilla cedrorum": { name: "Jaseur d'Amérique", src: "wikidata" },
  "Spinus tristis": { name: "Chardonneret jaune", src: "wikidata" },
  "Setophaga coronata": { name: "Paruline à croupion jaune", src: "taxref" },
  "Gopherus polyphemus": { name: "Tortue gaufrée", src: "wikidata" },
  "Bombus spp.": { name: "Bourdons", src: "pending" },

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
  "Ficaria verna": { name: "Ficaire fausse-renoncule", src: "wikidata" },
  "Lavandula × intermedia": { name: "Lavandin", src: "pending" },
  "Lonicera japonica": { name: "Chèvrefeuille du Japon", src: "taxref" },
  "Lythrum salicaria": { name: "Salicaire commune", src: "taxref" },
  "Prunus laurocerasus": { name: "Laurier-cerise", src: "taxref" },
  // Pseudotsuga menziesii is already named above, as the Pacific Northwest
  // native it is — the same taxon, the same entry, whichever side of the
  // Atlantic the page is about.
  "Robinia pseudoacacia": { name: "Robinier faux-acacia", src: "taxref" },
  "Rubus armeniacus": { name: "Ronce d'Arménie", src: "taxref" },
  "Pyrus calleryana": { name: "Poirier de Callery", src: "pending" },
  // ---------------------------------------------------------------------
  // Names the reference lists give for taxa this table showed in Latin until
  // the verification run of 2026-10-17 (the "upstream has a name we lack"
  // section of data/sources/vernacular-names/fr.json). Each row is tagged to
  // the list that gave the name, TAXREF first, then Tela Botanica, then
  // Wikidata, and `npm run names:check` verifies it like any other. Five
  // Wikidata labels were left out rather than shown: three Latin synonyms, a
  // typo and a Dutch description. The Māori names (kauri, mānuka, pōhutukawa,
  // rewarewa, kohekohe) are what a French reader calls those trees too.
  // ---------------------------------------------------------------------
  "Abrus precatorius": { name: "Cascavelle", src: "taxref" }, // Rosary pea
  "Acer palmatum": { name: "Érable palmé", src: "taxref" }, // Japanese Maple
  "Acer saccharum": { name: "Érable à sucre", src: "wikidata" }, // Sugar Maple
  "Adiantum pedatum": { name: "Adiante du Canada", src: "wikidata" }, // Maidenhair Fern
  "Aesculus californica": { name: "Pavier de Californie", src: "wikidata" }, // California Buckeye
  "Agathis australis": { name: "Kauri", src: "wikidata" }, // Kauri
  "Aglais io": { name: "Paon-du-jour", src: "taxref" }, // Peacock butterfly
  "Akebia quinata": { name: "Akébie à cinq feuilles", src: "taxref" }, // Akebi Chocolate Vine
  "Allium ursinum": { name: "Ail des ours", src: "taxref" }, // Wild Garlic (Ramsons)
  "Alnus japonica": { name: "Aulne du Japon", src: "taxref" }, // Japanese Alder
  "Alnus rhombifolia": { name: "Aulne de la sierra", src: "wikidata" }, // White Alder
  "Amelanchier laevis": { name: "Amélanchier de Lamark", src: "bdtfx" }, // Allegheny Serviceberry
  "Anemone nemorosa": { name: "Anémone des bois", src: "taxref" }, // Wood Anemone
  "Anthoxanthum odoratum": { name: "Flouve odorante", src: "taxref" }, // Sweet Vernal-grass
  "Archilochus alexandri": { name: "Colibri à gorge noire", src: "wikidata" }, // Black-chinned hummingbird
  "Ardisia crenata": { name: "Ardisie crénelée", src: "taxref" }, // Coral ardisia (coral berry)
  "Ardisia elliptica": { name: "Ardisie elliptique", src: "taxref" }, // Shoebutton ardisia
  "Aruncus dioicus": { name: "Spirée barbe-de-bouc", src: "taxref" }, // Goat's Beard
  "Asarum canadense": { name: "Asaret du Canada", src: "wikidata" }, // Wild Ginger
  "Asclepias curassavica": { name: "Herbe à gendarme", src: "taxref" }, // Tropical milkweed
  "Asclepias syriaca": { name: "Asclépiade de Syrie", src: "taxref" }, // Common Milkweed
  "Asterocampa celtis": { name: "Papillon du micocoulier", src: "wikidata" }, // Hackberry emperor
  "Aucuba japonica": { name: "Aucuba du Japon", src: "taxref" }, // Aoki Spotted Laurel
  "Baptisia australis": { name: "Baptisia austral", src: "taxref" }, // Blue Wild Indigo
  "Betula papyrifera": { name: "Bouleau à papier", src: "taxref" }, // Paper Birch
  "Betula pubescens": { name: "Bouleau pubescent", src: "taxref" }, // Downy Birch
  "Callipepla californica": { name: "Colin de Californie", src: "taxref" }, // California quail
  "Callophrys gryneus": { name: "Porte-queue verdâtre", src: "wikidata" }, // Juniper & cypress hairstreaks
  "Caltha palustris": { name: "Populage des marais", src: "taxref" }, // Marsh Marigold
  "Camellia japonica": { name: "Camélia du Japon", src: "taxref" }, // Yabu-tsubaki Camellia
  "Campanula rotundifolia": { name: "Campanule à feuilles rondes", src: "taxref" }, // Harebell
  "Carex obnupta": { name: "Carex voilé", src: "wikidata" }, // Slough Sedge
  "Carya illinoinensis": { name: "Carya de l'Illinois", src: "taxref" }, // Pecan
  "Carya ovata": { name: "Caryer ovale", src: "taxref" }, // Shagbark Hickory
  "Castanea crenata": { name: "Châtaignier crénelé", src: "taxref" }, // Japanese Chestnut
  "Ceanothus thyrsiflorus": { name: "Céanothe à fleurs en thyrse", src: "taxref" }, // Blueblossom
  "Celastrus orbiculatus": { name: "Célastre", src: "bdtfx" }, // Asian bittersweet
  "Celastrus scandens": { name: "Bourreau des arbres", src: "bdtfx" }, // American Bittersweet
  "Celtis occidentalis": { name: "Micocoulier d'Occident", src: "taxref" }, // Hackberry
  "Centaurea solstitialis": { name: "Centaurée du solstice", src: "taxref" }, // Yellow star-thistle
  "Centaurea stoebe": { name: "Centaurée du Rhin", src: "taxref" }, // Spotted knapweed
  "Chamaenerion angustifolium": { name: "Épilobe à feuilles étroites", src: "taxref" }, // Fireweed
  "Clematis lasiantha": { name: "Clématite flammette", src: "taxref" }, // Chaparral Clematis (Pipestem)
  "Cordyline australis": { name: "Cordyline australe", src: "taxref" }, // Tī Kōuka
  "Cornus canadensis": { name: "Cornouiller du Canada", src: "taxref" }, // Bunchberry
  "Cornus kousa": { name: "Cornouiller du Japon", src: "wikidata" }, // Yamaboshi Dogwood
  "Cycas revoluta": { name: "Sagoutier", src: "taxref" }, // Sago palm
  "Dianthus superbus": { name: "Œillet superbe", src: "taxref" }, // Kawaranadeshiko Pink
  "Dicentra formosa": { name: "Dicentra gracieux", src: "taxref" }, // Pacific Bleeding Heart
  "Dichondra repens": { name: "Dichondra rampant", src: "taxref" }, // Mercury Bay Weed
  "Diervilla lonicera": { name: "Diervilla chèvrefeuille", src: "taxref" }, // Northern Bush Honeysuckle
  "Dioscorea bulbifera": { name: "Patate en l'air", src: "taxref" }, // Air potato
  "Diospyros virginiana": { name: "Plaqueminier de Virginie", src: "taxref" }, // Common Persimmon
  "Dipsacus laciniatus": { name: "Cardère laciniée", src: "taxref" }, // Cut-leaved teasel
  "Dryopteris erythrosora": { name: "Dryoptéride à sores rouges", src: "taxref" }, // Benishida Autumn Fern
  "Dysoxylum spectabile": { name: "Kohekohe", src: "wikidata" }, // Kohekohe
  "Elaeagnus umbellata": { name: "Chalef en ombelle", src: "taxref" }, // Autumn olive
  "Erica cinerea": { name: "Bruyère cendrée", src: "taxref" }, // Bell Heather
  "Erica tetralix": { name: "Bruyère à quatre angles", src: "taxref" }, // Cross-leaved Heath
  "Erigeron glaucus": { name: "Érigéron glauque", src: "taxref" }, // Seaside Daisy
  "Eriophyllum lanatum": { name: "Ériophylle laineux", src: "taxref" }, // Oregon Sunshine
  "Eryngium yuccifolium": { name: "Panicaut à feuilles de yucca", src: "taxref" }, // Rattlesnake Master
  "Eschscholzia californica": { name: "Pavot de Californie", src: "taxref" }, // California Poppy
  "Euphydryas aurinia": { name: "Damier de la Succise", src: "taxref" }, // Marsh fritillary
  "Fagus grandifolia": { name: "Hêtre à grandes feuilles", src: "wikidata" }, // American Beech
  "Filipendula ulmaria": { name: "Reine-des-prés", src: "taxref" }, // Meadowsweet
  "Geranium sanguineum": { name: "Géranium sanguin", src: "taxref" }, // Bloody Cranesbill
  "Geum macrophyllum": { name: "Benoîte à grandes feuilles", src: "bdtfx" }, // Large-leaved Avens
  "Gunnera tinctoria": { name: "Gunnéra des teinturiers", src: "taxref" }, // Chilean rhubarb
  "Helianthus debilis": { name: "Hélianthe débile", src: "taxref" }, // Beach / Dune Sunflower
  "Helianthus maximiliani": { name: "Hélianthe de Maximilian", src: "taxref" }, // Maximilian Sunflower
  "Hemiphaga novaeseelandiae": { name: "Carpophage de Nouvelle-Zélande", src: "wikidata" }, // Kererū
  "Heracleum mantegazzianum": { name: "Berce du Caucase", src: "taxref" }, // Giant hogweed
  "Heracleum maximum": { name: "Berce laineuse", src: "wikidata" }, // Cow Parsnip
  "Hesperocyparis forbesii": { name: "Cyprès de Forbes", src: "taxref" }, // Tecate Cypress
  "Hesperocyparis sargentii": { name: "Cyprès de Sargent", src: "taxref" }, // Sargent Cypress
  "Hydrangea macrophylla": { name: "Hydrangelle hortensia", src: "taxref" }, // Ajisai Hydrangea
  "Icaricia icarioides": { name: "Bleu de Boisduval", src: "wikidata" }, // Lupine blues
  "Iris ensata": { name: "Iris à feuilles en épées", src: "taxref" }, // Hanashōbu Iris
  "Juniperus virginiana": { name: "Genévrier de Virginie", src: "taxref" }, // Southern Red Cedar
  "Knightia excelsa": { name: "Rewarewa", src: "wikidata" }, // Rewarewa
  "Lantana camara": { name: "Lantana", src: "taxref" }, // Common lantana
  "Lathyrus pratensis": { name: "Gesse des prés", src: "taxref" }, // Meadow Vetchling
  "Leptidea juvernica": { name: "Piéride irlandaise", src: "taxref" }, // Cryptic wood white
  "Leptospermum scoparium": { name: "Manuka", src: "wikidata" }, // Mānuka
  "Lespedeza bicolor": { name: "Bosklaver", src: "bdtfx" }, // Yama-hagi
  "Libytheana carinenta": { name: "Papillon longs-palpes", src: "wikidata" }, // American snout
  "Ligustrum lucidum": { name: "Troène luisant", src: "taxref" }, // Glossy privet
  "Lilium columbianum": { name: "Lys de Colombie", src: "wikidata" }, // Columbia Lily (Tiger Lily)
  "Lilium speciosum": { name: "Lis remarquable", src: "taxref" }, // Kanokoyuri Lily
  "Linnaea borealis": { name: "Linnée boréale", src: "taxref" }, // Twinflower
  "Lobelia siphilitica": { name: "Lobélie syphilitique", src: "taxref" }, // Great Blue Lobelia
  "Lonicera maackii": { name: "Chèvrefeuille de Maack", src: "taxref" }, // Amur honeysuckle (bush honeysuckle)
  "Lupinus perennis": { name: "Lupin vivace", src: "taxref" }, // Wild Lupine
  "Lysichiton americanus": { name: "Lysichiton d'Amérique", src: "taxref" }, // Western Skunk Cabbage
  "Magnolia kobus": { name: "Magnolia de Kobé", src: "taxref" }, // Kobushi Magnolia
  "Magnolia virginiana": { name: "Magnolia de Virginie", src: "taxref" }, // Sweetbay Magnolia
  "Malus sylvestris": { name: "Pommier sylvestre", src: "taxref" }, // Crab Apple
  "Matteuccia struthiopteris": { name: "Matteuccia struthioptéride", src: "taxref" }, // Ostrich Fern
  "Melia azedarach": { name: "Margousier azédarach", src: "taxref" }, // Chinaberry
  "Metrosideros excelsa": { name: "Pohutukawa", src: "wikidata" }, // Pōhutukawa
  "Microlaena stipoides": { name: "Microlène faux-stipe", src: "taxref" }, // Pātītī
  "Miscanthus sinensis": { name: "Miscanthus de Chine", src: "taxref" }, // Susuki Silver Grass
  "Molinia caerulea": { name: "Molinie bleue", src: "taxref" }, // Purple Moor-grass
  "Muehlenbeckia complexa": { name: "Muehlenbeckia complexe", src: "taxref" }, // Pōhuehue
  "Myoporum laetum": { name: "Myoporum plaisant", src: "taxref" }, // Ngaio
  "Myrcianthes fragrans": { name: "Bois d'Inde Batârd", src: "taxref" }, // Simpson's Stopper
  "Myrica gale": { name: "Myrique baumier", src: "taxref" }, // Bog Myrtle
  "Nandina domestica": { name: "Nandine domestique", src: "taxref" }, // Nandina (heavenly bamboo)
  "Nephrolepis cordifolia": { name: "Néphrolépide à feuilles cordées", src: "taxref" }, // Tuberous sword fern
  "Oenothera speciosa": { name: "Onagre remarquable", src: "taxref" }, // Pink Evening Primrose
  "Onoclea sensibilis": { name: "Onoclée sensible", src: "taxref" }, // Sensitive Fern
  "Ophiopogon japonicus": { name: "Muguet du Japon", src: "bdtfx" }, // Ryū-no-hige Mondo Grass
  "Osmunda regalis": { name: "Osmonde royale", src: "taxref" }, // Royal Fern
  "Pachysandra terminalis": { name: "Pachysandra terminal", src: "taxref" }, // Fukkisō Japanese Spurge
  "Papilio glaucus": { name: "Papillon glauque", src: "wikidata" }, // Eastern tiger swallowtail
  "Papilio polyxenes": { name: "Papillon du céleri", src: "wikidata" }, // Black swallowtail
  "Papilio zelicaon": { name: "Papillon de l'anise", src: "wikidata" }, // Anise swallowtail
  "Parthenocissus tricuspidata": { name: "Vigne-vierge à trois pointes", src: "taxref" }, // Tsuta Boston Ivy
  "Passiflora suberosa": { name: "Passiflore à fruit violet", src: "taxref" }, // Corkystem Passionflower
  "Patagioenas fasciata": { name: "Pigeon à queue barrée", src: "wikidata" }, // Band-tailed pigeon
  "Phormium tenax": { name: "Phormium tenace", src: "taxref" }, // Harakeke
  "Phyla nodiflora": { name: "Verveine du pays", src: "taxref" }, // Frogfruit
  "Picea sitchensis": { name: "Épicéa de Sitka", src: "taxref" }, // Sitka Spruce
  "Pieris japonica": { name: "Piéris du Japon", src: "taxref" }, // Asebi
  "Pinus contorta": { name: "Pin tordu", src: "taxref" }, // Shore Pine
  "Pinus coulteri": { name: "Pin de Coulter", src: "taxref" }, // Coulter Pine
  "Pinus ponderosa": { name: "Pin ponderosa", src: "taxref" }, // Ponderosa Pine
  "Pinus strobus": { name: "Pin Weymouth", src: "taxref" }, // Eastern White Pine
  "Pittosporum crassifolium": { name: "Pittosporum à feuilles épaisses", src: "taxref" }, // Karo
  "Platanus occidentalis": { name: "Platane d’Occident", src: "taxref" }, // American Sycamore
  "Poa trivialis": { name: "Pâturin commun", src: "taxref" }, // Rough Meadow-grass
  "Poecile rufescens": { name: "Mésange à dos marron", src: "wikidata" }, // Chestnut-backed chickadee
  "Polioptila californica": { name: "Gobemoucheron de Californie", src: "wikidata" }, // California gnatcatcher
  "Populus tremuloides": { name: "Peuplier faux-tremble", src: "wikidata" }, // Quaking Aspen
  "Primula vulgaris": { name: "Primevère commune", src: "taxref" }, // Primrose
  "Prosthemadera novaeseelandiae": { name: "Méliphage tui", src: "wikidata" }, // Tūī
  "Psaltriparus minimus": { name: "Orite buissonnière", src: "wikidata" }, // Bushtit
  "Psychotria nervosa": { name: "Psycotre nerveuse", src: "wikidata" }, // Wild Coffee
  "Pyracantha angustifolia": { name: "Pyracantha à feuilles étroites", src: "taxref" }, // Firethorn (pyracantha)
  "Quercus agrifolia": { name: "Chêne d'Auzende", src: "taxref" }, // Coast Live Oak
  "Quercus glauca": { name: "Chêne bleu", src: "taxref" }, // Arakashi Oak
  "Quercus macrocarpa": { name: "Chêne à gros fruits", src: "wikidata" }, // Bur Oak
  "Quercus shumardii": { name: "Chêne de Shumard", src: "wikidata" }, // Shumard Oak
  "Rapistrum rugosum": { name: "Rapistre rugueux", src: "taxref" }, // Bastard cabbage
  "Ratibida pinnata": { name: "Ratibida penné", src: "taxref" }, // Yellow Coneflower
  "Rhamnus cathartica": { name: "Nerprun purgatif", src: "taxref" }, // Common buckthorn
  "Rhododendron indicum": { name: "Rhododendron des Indes", src: "taxref" }, // Satsuki Azalea
  "Rhododendron ponticum": { name: "Rhododendron du Pont", src: "taxref" }, // Pontic rhododendron
  "Rhus glabra": { name: "Sumac glabre", src: "taxref" }, // Smooth Sumac
  "Ribes speciosum": { name: "Groseillier à fleur de fuchsia", src: "taxref" }, // Fuchsia-flowered Gooseberry
  "Rivina humilis": { name: "Rivine humble", src: "taxref" }, // Rougeplant (Bloodberry)
  "Rosa multiflora": { name: "Rosier multiflore", src: "taxref" }, // Noibara Rose
  "Rosa setigera": { name: "Églantier de la Prairie", src: "bdtfx" }, // Prairie Rose
  "Rosa spinosissima": { name: "Rosier très épineux", src: "taxref" }, // Burnet Rose
  "Rudbeckia hirta": { name: "Rudbeckie hérissée", src: "taxref" }, // Black-eyed Susan
  "Sabal palmetto": { name: "Palmier sabal", src: "taxref" }, // Cabbage Palm (Sabal Palm)
  "Salix cinerea": { name: "Saule cendré", src: "taxref" }, // Gray Willow (Sally)
  "Salix discolor": { name: "Saule discolore", src: "wikidata" }, // Pussy Willow
  "Salix nigra": { name: "Saule noir", src: "wikidata" }, // Black Willow
  "Salvia farinacea": { name: "Sauge farineuse", src: "taxref" }, // Mealy Blue Sage
  "Sanguisorba officinalis": { name: "Sanguisorbe officinale", src: "taxref" }, // Waremokō Burnet
  "Sasa veitchii": { name: "Sasa de Veitch", src: "taxref" }, // Kumazasa Dwarf Bamboo
  "Saxifraga stolonifera": { name: "Saxifrage stolonifère", src: "taxref" }, // Yukinoshita Strawberry Saxifrage
  "Schinus terebinthifolia": { name: "Schinus à feuilles de térébinthe", src: "taxref" }, // Brazilian pepper
  "Securigera varia": { name: "Coronille variée", src: "taxref" }, // Crown vetch
  "Sequoia sempervirens": { name: "Séquoia toujours vert", src: "taxref" }, // Coast Redwood
  "Silene dioica": { name: "Silène dioïque", src: "taxref" }, // Red Campion
  "Sitta pusilla": { name: "Sittelle à tête brune", src: "wikidata" }, // Brown-headed nuthatch
  "Sorghum halepense": { name: "Sorgho d'Alep", src: "taxref" }, // Johnsongrass
  "Spinus psaltria": { name: "Chardonneret mineur", src: "wikidata" }, // Lesser goldfinch
  "Spiraea douglasii": { name: "Spirée de Douglas", src: "taxref" }, // Douglas Spirea (Hardhack)
  "Stachytarpheta cayennensis": { name: "Herbe bleue", src: "taxref" }, // Nettleleaf porterweed
  "Stachytarpheta jamaicensis": { name: "Épi bleu", src: "taxref" }, // Blue Porterweed
  "Styrax japonicus": { name: "Styrax du Japon", src: "wikidata" }, // Egonoki Snowbell
  "Symphyotrichum laeve": { name: "Symphyotriche lisse", src: "taxref" }, // Smooth Blue Aster
  "Taraxacum officinale": { name: "Pissenlit officinal", src: "taxref" }, // Dandelion
  "Taxus baccata": { name: "If à baies", src: "taxref" }, // Yew
  "Taxus brevifolia": { name: "If à feuilles courtes", src: "taxref" }, // Pacific Yew
  "Tellima grandiflora": { name: "Tellima à grandes fleurs", src: "taxref" }, // Fringecup
  "Teucrium scorodonia": { name: "Germandrée scorodoine", src: "taxref" }, // Wood Sage
  "Thuja occidentalis": { name: "Thuya d'Occident", src: "taxref" }, // Northern White Cedar
  "Thymus praecox": { name: "Thym précoce", src: "taxref" }, // Wild Thyme
  "Tilia americana": { name: "Tilleul d'Amérique", src: "taxref" }, // American Basswood
  "Trifolium repens": { name: "Trèfle rampant", src: "taxref" }, // White Clover
  "Tsuga canadensis": { name: "Tsuga du Canada", src: "taxref" }, // Eastern Hemlock
  "Ulex europaeus": { name: "Ajonc d'Europe", src: "taxref" }, // Gorse (Furze)
  "Umbellularia californica": { name: "Umbellularia de Californie", src: "taxref" }, // California Bay (Bay Laurel)
  "Urena lobata": { name: "Hérisson rouge", src: "taxref" }, // Caesarweed
  "Urtica dioica": { name: "Ortie dioïque", src: "taxref" }, // Common Nettle
  "Vanessa atalanta": { name: "Vulcain", src: "taxref" }, // Red admiral
  "Vanessa cardui": { name: "Vanesse des Chardons", src: "taxref" }, // Painted lady
  "Viburnum opulus": { name: "Viorne obier", src: "taxref" }, // Guelder Rose
  "Vicia cracca": { name: "Vesce cracca", src: "taxref" }, // Tufted Vetch
  "Viola glabella": { name: "Violette glabre", src: "wikidata" }, // Stream Violet
  "Vitis riparia": { name: "Vigne des rives", src: "taxref" }, // Riverbank Grape
  "Washingtonia robusta": { name: "Washingtonia filifère", src: "taxref" }, // Mexican fan palm
  "Wisteria floribunda": { name: "Glycine très fleurie", src: "taxref" }, // Noda-fuji Wisteria
  "Zelkova serrata": { name: "Orme du Japon", src: "bdtfx" }, // Keyaki
  "Zerene eurydice": { name: "Papillon de Californie", src: "wikidata" }, // California dogface butterfly
  "Zosterops lateralis": { name: "Zosterops à dos gris", src: "taxref" }, // Tauhou (silvereye)
};
