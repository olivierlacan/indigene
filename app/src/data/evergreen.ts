// Which of the app's plants keep their leaves through winter.
//
// The Kill your lawn page (`steps/lawn.ts`) gives every region an evergreens
// row: the plants that stay green, keep cover for birds and hold seed or berries
// when everything else has gone to sticks. Nothing else in a plant row says
// whether it's evergreen, so this is that one fact, kept apart.
//
// Leaf habit is a textbook fact and the same in every flora; we list a plant
// only when it is plainly evergreen across its range. Left out on purpose: the
// half-evergreen ones (sweetbay magnolia in the north, lady fern, male fern,
// redwood sorrel), and the deciduous conifers (larch, bald cypress). A plant
// missing from here is not shown as deciduous anywhere; it just doesn't make
// the evergreens row.
export const EVERGREEN: ReadonlySet<string> = new Set([
  // Ferns that stay green all winter.
  "acrostichum-danaeifolium", "asplenium-bulbiferum", "asplenium-ceterach", "asplenium-scolopendrium",
  "asplenium-trichomanes", "blechnum-novae-zelandiae", "cyathea-dealbata", "cyathea-medullaris",
  "dicksonia-squarrosa", "dryopteris-arguta", "dryopteris-erythrosora", "nephrolepis-exaltata",
  "polypodium-glycyrrhiza", "polystichum-acrostichoides", "polystichum-aculeatum", "polystichum-lonchitis",
  "polystichum-munitum", "polystichum-setiferum", "struthiopteris-spicant",
  // Ground covers.
  "arctostaphylos-uva-ursi", "ardisia-japonica", "asarum-caudatum", "dichondra-repens", "disphyma-australe",
  "dryas-octopetala", "ernodea-littoralis", "fragaria-chiloensis", "linnaea-borealis", "ophiopogon-japonicus",
  "pachysandra-terminalis", "saxifraga-stolonifera", "selliera-radicans", "sesuvium-portulacastrum",
  "thymus-praecox", "thymus-serpyllum",
  // Shrubs.
  "arbutus-unedo", "arctostaphylos-columbiana", "arctostaphylos-glauca", "arctostaphylos-manzanita",
  "aucuba-japonica", "baccharis-pilularis", "berberis-aquifolium", "berberis-nervosa", "berberis-trifoliolata",
  "calluna-vulgaris", "camellia-japonica", "ceanothus-crassifolius", "ceanothus-thyrsiflorus",
  "chrysobalanus-icaco", "cistus-albidus", "coprosma-repens", "coprosma-robusta", "dermatophyllum-secundiflorum",
  "diplacus-aurantiacus", "erica-carnea", "erica-cinerea", "erica-tetralix", "eriogonum-fasciculatum",
  "eurya-japonica", "frangula-californica", "garrya-elliptica", "gaultheria-shallon", "ilex-aquifolium",
  "ilex-vomitoria", "juniperus-communis", "juniperus-oxycedrus", "leptospermum-scoparium",
  "leucophyllum-frutescens", "lyonia-lucida", "malosma-laurina", "morella-californica", "myoporum-laetum",
  "myrcianthes-fragrans", "myrtus-communis", "paxistima-myrsinites", "phillyrea-angustifolia", "pieris-japonica",
  "piper-excelsum", "pistacia-lentiscus", "pittosporum-crassifolium", "pittosporum-tenuifolium",
  "pomaderris-kumeraho", "prunus-ilicifolia", "pseudopanax-lessonii", "psychotria-nervosa", "rhamnus-alaternus",
  "rhododendron-ferrugineum", "rhododendron-indicum", "rhododendron-macrophyllum", "rhus-integrifolia",
  "rhus-virens", "salvia-rosmarinus", "serenoa-repens", "ulex-europaeus", "vaccinium-myrsinites",
  "vaccinium-ovatum", "vaccinium-vitis-idaea", "veronica-stricta", "viburnum-obovatum", "viburnum-tinus",
  "zamia-integrifolia",
  // Trees, conifers first.
  "hesperocyparis-forbesii", "hesperocyparis-sargentii", "juniperus-californica", "juniperus-virginiana",
  "picea-abies", "picea-sitchensis", "pinus-cembra", "pinus-contorta", "pinus-coulteri", "pinus-elliottii",
  "pinus-halepensis", "pinus-palustris", "pinus-ponderosa", "pinus-strobus", "pinus-sylvestris",
  "pinus-torreyana", "pseudotsuga-menziesii", "sequoia-sempervirens", "taxus-baccata", "taxus-brevifolia",
  "thuja-occidentalis", "thuja-plicata", "tsuga-canadensis", "tsuga-heterophylla",
  "agathis-australis", "dacrycarpus-dacrydioides", "podocarpus-totara",
  "alectryon-excelsus", "arbutus-menziesii", "castanopsis-sieboldii", "coccoloba-diversifolia",
  "coccoloba-uvifera", "conocarpus-erectus", "cordyline-australis", "corynocarpus-laevigatus",
  "dysoxylum-spectabile", "hoheria-populnea", "knightia-excelsa", "kunzea-robusta", "machilus-thunbergii",
  "magnolia-grandiflora", "melicytus-ramiflorus", "metrosideros-excelsa", "morella-cerifera",
  "quercus-agrifolia", "quercus-fusiformis", "quercus-geminata", "quercus-glauca", "quercus-ilex",
  "quercus-myrsinifolia", "quercus-virginiana", "sabal-palmetto", "umbellularia-californica", "vitex-lucens",
]);
