// The "most wanted" dataset — the worst invasive plants in each region, and the
// marks that tell you one is in front of you.
//
// Two parts, both auditable in this one file the way a plant row is:
//
//   1. INVASIVES — the catalog. Each plant described once, by three things a
//      person can check without a lens: a smell, a hollow stem, a berry that
//      turns black. Japanese knotweed is the same plant in Virginia and in
//      Burgundy, so the catalog is shared.
//
//   2. MOST_WANTED — the ties, keyed by region id. Each says what this region's
//      own authority makes of the plant, in the same `LookalikeListing` shape
//      the look-alikes use, under the same two rules: a weed class is not a
//      severity, and no rank where nobody ranked.
//
// **Which plants, and in what order, is not a matter of taste.** Each region's
// five are the species its authority rates highest, taken in order of how often
// they have been recorded wild inside the region's box on iNaturalist:
//
//   - Mid-Atlantic      Virginia Natural Heritage, High
//   - California        Cal-IPC, High
//   - Florida           FISC, Category I (in that zone)
//   - Mediterranean     the INVMED conservatories, PACA « Majeure »
//   - Continental       the Grand Est conservatories, « implantée »
//   - Pacific Northwest Washington's weed board — a regulation, so no rank
//
// Where no body has rated the ground in a form we can check — northern
// Michigan, Atlantic and Alpine France, Ireland — the five are plants the local
// authorities name as invasive, again taken by sightings, and the page says the
// order is sightings alone. Beech and sycamore turn up high in the French and
// Irish counts and are left out: native in France, and nobody's target in
// Ireland.
//
// The counts live in `invasive-counts.json` (`npm run invasives:count`), and
// `lib/invasives.ts` does the ranking at runtime, so a refreshed count can
// reorder a list without anybody editing this file. `npm run listings:check`
// asks each authority whether it still says what we print, here as for the
// look-alikes.
//
// And what doesn't belong: a tone of panic. Several of these are loved garden
// plants — butterfly bush, cherry laurel, pampas grass — and the swap pages say
// what to grow instead without scolding anybody for having one.
import type { Invasive, LookalikeListing, WantedLink } from "../types";

// ---- The catalog: each invasive described once, by how to know it ----
export const INVASIVES: Invasive[] = [
  // ---------------- Trees ----------------
  {
    id: "ailanthus-altissima",
    common: "Tree of heaven",
    latin: "Ailanthus altissima",
    form: "tree",
    marks: [
      { feature: "Smell", text: "Crushed leaves smell rank, like burnt peanut butter." },
      { feature: "Leaves", text: "Very long, with many leaflets, each with a notch and a bump near its base." },
      { feature: "Seeds", text: "Papery, twisted wings in big hanging clusters." },
    ],
  },
  {
    id: "robinia-pseudoacacia",
    common: "Black locust",
    latin: "Robinia pseudoacacia",
    form: "tree",
    marks: [
      { feature: "Thorns", text: "A pair of sharp thorns where each leaf meets the twig." },
      { feature: "Leaves", text: "Feathery, with small rounded leaflets in pairs." },
      { feature: "Flowers", text: "Hanging clusters of white, scented pea-flowers in late spring." },
    ],
  },
  {
    id: "ilex-aquifolium",
    common: "English holly",
    latin: "Ilex aquifolium",
    form: "tree",
    marks: [
      { feature: "Leaves", text: "Thick, glossy and dark, with wavy, spiny edges." },
      { feature: "Berries", text: "Red, in winter, on the female trees." },
      { feature: "Where", text: "Seedlings in the shade of a wood, far from any garden." },
    ],
  },
  {
    id: "schinus-terebinthifolia",
    common: "Brazilian pepper",
    latin: "Schinus terebinthifolia",
    form: "tree",
    marks: [
      { feature: "Smell", text: "Crushed leaves smell of pepper and turpentine." },
      { feature: "Leaves", text: "Leaflets in pairs, on a stalk that's often red." },
      { feature: "Berries", text: "Bright red clusters through the winter." },
    ],
  },
  // ---------------- Shrubs ----------------
  {
    id: "elaeagnus-umbellata",
    common: "Autumn olive",
    latin: "Elaeagnus umbellata",
    form: "shrub",
    marks: [
      { feature: "Leaves", text: "Silvery underneath, as if dusted with metal flakes." },
      { feature: "Berries", text: "Small, red and speckled with silver, in autumn." },
      { feature: "Flowers", text: "Creamy, sweet-scented little trumpets in spring." },
    ],
  },
  {
    id: "lonicera-morrowii",
    common: "Morrow's honeysuckle",
    latin: "Lonicera morrowii",
    form: "shrub",
    marks: [
      { feature: "Twigs", text: "Snap one: the middle is hollow. A native honeysuckle's is solid." },
      { feature: "Leaves", text: "Soft and downy, in pairs, and among the first green in spring." },
      { feature: "Berries", text: "Red, in pairs, in summer." },
    ],
  },
  {
    id: "cytisus-scoparius",
    common: "Scotch broom",
    latin: "Cytisus scoparius",
    form: "shrub",
    marks: [
      { feature: "Stems", text: "Green, ridged and nearly leafless — the plant looks like a broom." },
      { feature: "Flowers", text: "Bright yellow pea-flowers all along the stems in spring." },
      { feature: "Pods", text: "Flat, turning black, and snapping open with a click in summer." },
    ],
  },
  {
    id: "spartium-junceum",
    common: "Spanish broom",
    latin: "Spartium junceum",
    form: "shrub",
    marks: [
      { feature: "Stems", text: "Round, smooth and rush-like, with hardly a leaf." },
      { feature: "Flowers", text: "Large yellow pea-flowers, sweetly scented, spring into summer." },
      { feature: "Size", text: "Taller than a person, and taller than Scotch broom." },
    ],
  },
  {
    id: "genista-monspessulana",
    common: "French broom",
    latin: "Genista monspessulana",
    form: "shrub",
    marks: [
      { feature: "Leaves", text: "Leafy stems, each leaf split into three small, hairy leaflets." },
      { feature: "Flowers", text: "Yellow pea-flowers in small clusters on short side shoots." },
      { feature: "Pods", text: "Short and covered in silvery hairs." },
    ],
  },
  {
    id: "rubus-armeniacus",
    common: "Himalayan blackberry",
    latin: "Rubus armeniacus",
    form: "shrub",
    marks: [
      { feature: "Canes", text: "Thick, ridged and arching, with big hooked thorns." },
      { feature: "Leaves", text: "Usually five leaflets, whitish underneath." },
      { feature: "Fruit", text: "Large, sweet blackberries in late summer." },
    ],
  },
  {
    id: "urena-lobata",
    common: "Caesarweed",
    latin: "Urena lobata",
    form: "shrub",
    marks: [
      { feature: "Leaves", text: "Maple-shaped, soft and hairy." },
      { feature: "Flowers", text: "Small pink flowers, like a tiny hibiscus." },
      { feature: "Burs", text: "Little burs that cling to socks and fur." },
    ],
  },
  {
    id: "ardisia-crenata",
    common: "Coral ardisia",
    latin: "Ardisia crenata",
    form: "shrub",
    marks: [
      { feature: "Berries", text: "Bright red clusters hanging below the leaves, all year." },
      { feature: "Leaves", text: "Dark and glossy, with small bumps along a wavy edge." },
      { feature: "Where", text: "Knee-high carpets on the shady floor of a wood." },
    ],
  },
  {
    id: "ardisia-elliptica",
    common: "Shoebutton ardisia",
    latin: "Ardisia elliptica",
    form: "shrub",
    marks: [
      { feature: "Berries", text: "Red, then glossy black, like the buttons on an old boot." },
      { feature: "Leaves", text: "Thick and leathery; new leaves come out pink." },
      { feature: "Flowers", text: "Pale pink stars in clusters under the leaves." },
    ],
  },
  {
    id: "ludwigia-peruviana",
    common: "Peruvian primrose-willow",
    latin: "Ludwigia peruviana",
    form: "shrub",
    marks: [
      { feature: "Flowers", text: "Big, bright yellow, with four round petals." },
      { feature: "Leaves", text: "Hairy and lance-shaped." },
      { feature: "Where", text: "Standing in water at lake edges, ditches and marshes." },
    ],
  },
  {
    id: "agave-americana",
    common: "Century plant",
    latin: "Agave americana",
    form: "shrub",
    marks: [
      { feature: "Leaves", text: "Huge, fleshy and blue-grey, tipped with a spine and edged with hooks." },
      { feature: "Flower", text: "One mast taller than a house, after many years — then the plant dies." },
      { feature: "Offsets", text: "Ringed by young rosettes rising from its roots." },
    ],
  },
  {
    id: "buddleja-davidii",
    common: "Butterfly bush",
    latin: "Buddleja davidii",
    form: "shrub",
    marks: [
      { feature: "Flowers", text: "Long cones of purple or white, honey-scented flowers." },
      { feature: "Leaves", text: "Long and pointed, felted white underneath." },
      { feature: "Where", text: "Old walls, railway ballast, gravel and riverbanks." },
    ],
  },
  {
    id: "prunus-laurocerasus",
    common: "Cherry laurel",
    latin: "Prunus laurocerasus",
    form: "shrub",
    marks: [
      { feature: "Smell", text: "Crushed leaves smell of almonds — that's cyanide." },
      { feature: "Leaves", text: "Big, glossy and bright green." },
      { feature: "Flowers", text: "Upright candles of small white flowers in spring." },
    ],
  },
  {
    id: "rhododendron-ponticum",
    common: "Rhododendron",
    latin: "Rhododendron ponticum",
    form: "shrub",
    marks: [
      { feature: "Leaves", text: "Leathery, dark and evergreen, paler underneath." },
      { feature: "Flowers", text: "Big mauve trusses in early summer." },
      { feature: "Where", text: "Dense thickets under oak woods, with bare ground beneath." },
    ],
  },
  // ---------------- Perennials ----------------
  {
    id: "alliaria-petiolata",
    common: "Garlic mustard",
    latin: "Alliaria petiolata",
    form: "perennial",
    marks: [
      { feature: "Smell", text: "Crush a leaf: it smells of garlic." },
      { feature: "Leaves", text: "Kidney-shaped and scalloped low down; triangular and toothed up the stem." },
      { feature: "Flowers", text: "Small, white, four petals in a cross, in spring." },
    ],
  },
  {
    id: "reynoutria-japonica",
    common: "Japanese knotweed",
    latin: "Reynoutria japonica",
    form: "perennial",
    marks: [
      { feature: "Stems", text: "Hollow, jointed canes like bamboo, speckled purple." },
      { feature: "Leaves", text: "Shield-shaped with a flat base, zigzagging up the stem." },
      { feature: "Flowers", text: "Sprays of tiny cream flowers in late summer." },
    ],
  },
  {
    id: "lythrum-salicaria",
    common: "Purple loosestrife",
    latin: "Lythrum salicaria",
    form: "perennial",
    marks: [
      { feature: "Flowers", text: "Tall spikes of magenta flowers with crinkled petals." },
      { feature: "Stems", text: "Square, and woody at the base." },
      { feature: "Where", text: "Wet ground: ditches, marsh edges, lake shores." },
    ],
  },
  {
    id: "centaurea-stoebe",
    common: "Spotted knapweed",
    latin: "Centaurea stoebe",
    form: "perennial",
    marks: [
      { feature: "Flower heads", text: "Pink-purple, like a thistle's, but with no prickles." },
      { feature: "Bracts", text: "The scales under each flower are black-tipped — the “spots”." },
      { feature: "Leaves", text: "Grey-green, cut into narrow lobes." },
    ],
  },
  {
    id: "centaurea-solstitialis",
    common: "Yellow star-thistle",
    latin: "Centaurea solstitialis",
    form: "perennial",
    marks: [
      { feature: "Flower heads", text: "Yellow, ringed by long stiff spines like a star." },
      { feature: "Stems", text: "Grey-green, cottony, with thin wings along them." },
      { feature: "When", text: "Flowering in dry grassland in high summer, when little else does." },
    ],
  },
  {
    id: "geranium-robertianum",
    common: "Herb Robert",
    latin: "Geranium robertianum",
    form: "perennial",
    marks: [
      { feature: "Smell", text: "Crushed leaves smell bad, like burnt rubber." },
      { feature: "Leaves", text: "Lacy and deeply cut, often flushed red." },
      { feature: "Flowers", text: "Small, pink, five petals, then a long beak-shaped pod." },
    ],
  },
  {
    id: "jacobaea-vulgaris",
    common: "Tansy ragwort",
    latin: "Jacobaea vulgaris",
    form: "perennial",
    marks: [
      { feature: "Flowers", text: "Flat-topped clusters of small yellow daisies." },
      { feature: "Leaves", text: "Ragged and deeply cut." },
      { feature: "Caterpillars", text: "Often striped yellow and black: cinnabar moths, brought in to eat it." },
    ],
  },
  {
    id: "oncosiphon-pilulifer",
    common: "Stinknet",
    latin: "Oncosiphon pilulifer",
    form: "perennial",
    marks: [
      { feature: "Flowers", text: "Yellow buttons, no petals, like little balls." },
      { feature: "Smell", text: "Brush it and it smells sharp, like turpentine." },
      { feature: "Leaves", text: "Finely cut and lacy." },
    ],
  },
  {
    id: "impatiens-glandulifera",
    common: "Himalayan balsam",
    latin: "Impatiens glandulifera",
    form: "perennial",
    marks: [
      { feature: "Flowers", text: "Pink, shaped like a policeman's helmet." },
      { feature: "Stems", text: "Thick, hollow, reddish and brittle, taller than a person." },
      { feature: "Pods", text: "Burst open when touched, flinging the seeds." },
    ],
  },
  {
    id: "senecio-inaequidens",
    common: "Narrow-leaved ragwort",
    latin: "Senecio inaequidens",
    form: "perennial",
    marks: [
      { feature: "Flowers", text: "Yellow daisies from summer until the frosts." },
      { feature: "Leaves", text: "Narrow, almost like grass blades." },
      { feature: "Where", text: "Roadsides, railways, vineyards and sunny waste ground." },
    ],
  },
  {
    id: "phytolacca-americana",
    common: "American pokeweed",
    latin: "Phytolacca americana",
    form: "perennial",
    marks: [
      { feature: "Stems", text: "Thick, smooth and magenta-red." },
      { feature: "Berries", text: "Drooping clusters of shiny purple-black berries. Poisonous." },
      { feature: "Leaves", text: "Big, smooth and oval." },
    ],
  },
  {
    id: "gunnera-tinctoria",
    common: "Chilean rhubarb",
    latin: "Gunnera tinctoria",
    form: "perennial",
    marks: [
      { feature: "Leaves", text: "Enormous, like rhubarb, wider than an umbrella." },
      { feature: "Stalks", text: "Thick and covered in soft spines." },
      { feature: "Flowers", text: "A cone of tiny flowers like a bottle brush." },
    ],
  },
  // ---------------- Grasses ----------------
  {
    id: "arundo-donax",
    common: "Giant reed",
    latin: "Arundo donax",
    form: "grass",
    marks: [
      { feature: "Stems", text: "Thick canes like bamboo, far taller than a person." },
      { feature: "Leaves", text: "Broad, grey-green blades hugging the cane all the way up." },
      { feature: "Plumes", text: "Big feathery plumes in late summer." },
    ],
  },
  {
    id: "cortaderia-selloana",
    common: "Pampas grass",
    latin: "Cortaderia selloana",
    form: "grass",
    marks: [
      { feature: "Plumes", text: "Tall, silvery or pink, held high over the clump." },
      { feature: "Leaves", text: "Long and arching, with edges that cut bare skin." },
      { feature: "Clump", text: "A dense fountain wider than your arm span." },
    ],
  },
  // ---------------- Vines ----------------
  {
    id: "celastrus-orbiculatus",
    common: "Oriental bittersweet",
    latin: "Celastrus orbiculatus",
    form: "vine",
    marks: [
      { feature: "Berries", text: "Yellow husks open on orange-red berries, all along the stem." },
      { feature: "Leaves", text: "Round, glossy and finely toothed." },
      { feature: "Stems", text: "Twining around trees tightly enough to strangle them." },
    ],
  },
  {
    id: "hedera-helix",
    common: "English ivy",
    latin: "Hedera helix",
    form: "vine",
    marks: [
      { feature: "Leaves", text: "Evergreen, lobed on climbing stems, plain ovals on flowering ones." },
      { feature: "Stems", text: "Hairy rootlets glue it to bark and walls." },
      { feature: "Berries", text: "Round clusters of black berries in late winter." },
    ],
  },
  {
    id: "abrus-precatorius",
    common: "Rosary pea",
    latin: "Abrus precatorius",
    form: "vine",
    marks: [
      { feature: "Seeds", text: "Glossy scarlet with a black spot. Deadly if chewed." },
      { feature: "Leaves", text: "Feathery, with many small leaflets in pairs." },
      { feature: "Stems", text: "Thin and twining over shrubs." },
    ],
  },
  {
    id: "dioscorea-bulbifera",
    common: "Air potato",
    latin: "Dioscorea bulbifera",
    form: "vine",
    marks: [
      { feature: "Bulbils", text: "Potato-like lumps hanging from the vine." },
      { feature: "Leaves", text: "Big and heart-shaped, with curved veins." },
      { feature: "Stems", text: "Twining right up to the tops of trees." },
    ],
  },
  // ---------------- Groundcovers ----------------
  {
    id: "carpobrotus-edulis",
    common: "Ice plant (Hottentot fig)",
    latin: "Carpobrotus edulis",
    form: "groundcover",
    marks: [
      { feature: "Leaves", text: "Fat, fleshy and three-sided, like fingers." },
      { feature: "Flowers", text: "Big, yellow or pink, with many narrow petals." },
      { feature: "Habit", text: "Thick mats over dunes and cliffs, reddening in the sun." },
    ],
  },
  {
    id: "securigera-varia",
    common: "Crown vetch",
    latin: "Securigera varia",
    form: "groundcover",
    marks: [
      { feature: "Flowers", text: "Pink-and-white pea-flowers in a round crown on a long stalk." },
      { feature: "Leaves", text: "Many small leaflets in pairs, with no tendrils." },
      { feature: "Habit", text: "Sprawling mats over roadside banks and dunes." },
    ],
  },
  {
    id: "oxalis-pes-caprae",
    common: "Bermuda buttercup",
    latin: "Oxalis pes-caprae",
    form: "groundcover",
    marks: [
      { feature: "Flowers", text: "Bright yellow bells, in winter and spring." },
      { feature: "Leaves", text: "Like clover: three heart-shaped leaflets, often spotted." },
      { feature: "When", text: "Carpets the ground, then vanishes underground by summer." },
    ],
  },
  // ---------------- Ferns ----------------
  {
    id: "nephrolepis-cordifolia",
    common: "Tuberous sword fern",
    latin: "Nephrolepis cordifolia",
    form: "fern",
    marks: [
      { feature: "Roots", text: "Small round tubers on the roots, like beads." },
      { feature: "Fronds", text: "Upright and narrow, with many small leaflets." },
      { feature: "Habit", text: "Dense colonies spreading on wiry runners." },
    ],
  },
];

// ---- Who says so: each authority's listing, written once ----
// A listing means the same thing for every species that carries it, so it is a
// constant rather than a copy per row — the look-alikes' rule that two species
// in one class can't be given two accounts of it.

const VIRGINIA_HIGH: LookalikeListing = {
  kind: "impact",
  level: "transforms",
  by: "Virginia Natural Heritage",
  as: "High",
  url: "https://www.dcr.virginia.gov/natural-heritage/invsppdflist",
};
const CALIPC_HIGH: LookalikeListing = {
  kind: "impact",
  level: "transforms",
  by: "the California Invasive Plant Council",
  as: "High",
  url: "https://www.cal-ipc.org/plants/inventory/",
};
const FISC_I: LookalikeListing = {
  kind: "impact",
  level: "transforms",
  by: "the Florida Invasive Species Council",
  as: "Category I",
  url: "https://www.floridainvasives.org/plant-list/",
};
const INVMED_MAJEURE: LookalikeListing = {
  kind: "impact",
  level: "transforms",
  by: "the Mediterranean botanical conservatories",
  as: "Majeure",
  url: "https://invmed.fr/src/listes/index.php?idma=20",
};
const GRAND_EST_IMPLANTEE: LookalikeListing = {
  kind: "impact",
  level: "transforms",
  by: "the Grand Est botanical conservatories",
  as: "Plante Exotique Envahissante implantée",
  url: "https://especes-exotiques-envahissantes.fr/wp-content/uploads/2023/07/20200402_plfcbnne_cba_cbnbp_liste-categorisee-des-eee-du-grand-est_vff.pdf",
};
/** Washington's classes are one per species page, so the URL is per row. */
const waClass = (klass: "B" | "C", slug: string): LookalikeListing => ({
  kind: "regulation",
  by: "the Washington State Noxious Weed Control Board",
  as: `Class ${klass} noxious weed`,
  means: klass === "B" ? "waClassB" : "waClassC",
  url: `https://www.nwcb.wa.gov/weeds/${slug}`,
});

const VA = "Virginia Natural Heritage, Invasive Plant Species of Virginia (2024).";
const CAL = "California Invasive Plant Council, Cal-IPC Inventory.";
const FL = "Florida Invasive Species Council, 2023 plant list (zones C and S).";
const MI = "Michigan Natural Features Inventory, Invasive Species Best Control Practices; Midwest Invasive Species Information Network.";
const WA = "Washington State Noxious Weed Control Board.";
const PACA = "INVMED — CBN Méditerranéen & CBN Alpin, liste des EVEE de Provence-Alpes-Côte d'Azur.";
const GE = "CBN Nord-Est, CBA & CBN Bassin parisien, liste catégorisée des EEE du Grand Est (2020).";
const FR_ATL = "CBN de Brest, liste des plantes vasculaires invasives de Bretagne; OFB Centre de ressources EEE.";
const FR_ALP = "CBN Alpin, espèces végétales exotiques envahissantes des Alpes; OFB Centre de ressources EEE.";
const IE = "National Biodiversity Data Centre, invasive species of Ireland; Invasive Species Ireland.";

// ---- The ties: each region's list, in any order — `lib/invasives.ts` ranks it ----
export const MOST_WANTED: Record<string, WantedLink[]> = {
  "mid-atlantic": [
    { invasiveId: "alliaria-petiolata", listing: VIRGINIA_HIGH, basis: VA },
    { invasiveId: "celastrus-orbiculatus", listing: VIRGINIA_HIGH, basis: VA },
    { invasiveId: "elaeagnus-umbellata", listing: VIRGINIA_HIGH, basis: VA },
    { invasiveId: "reynoutria-japonica", listing: VIRGINIA_HIGH, basis: VA },
    { invasiveId: "lythrum-salicaria", listing: VIRGINIA_HIGH, basis: VA },
  ],
  "north-michigan": [
    { invasiveId: "centaurea-stoebe", basis: MI },
    { invasiveId: "elaeagnus-umbellata", basis: MI },
    { invasiveId: "securigera-varia", basis: MI },
    { invasiveId: "lythrum-salicaria", basis: MI },
    { invasiveId: "lonicera-morrowii", basis: MI },
  ],
  pnw: [
    { invasiveId: "cytisus-scoparius", listing: waClass("B", "scotch-broom"), basis: WA },
    { invasiveId: "geranium-robertianum", listing: waClass("B", "herb-robert"), basis: WA },
    { invasiveId: "ilex-aquifolium", listing: waClass("C", "english-holly"), basis: WA },
    { invasiveId: "hedera-helix", listing: waClass("C", "english-ivy"), basis: WA },
    { invasiveId: "jacobaea-vulgaris", listing: waClass("B", "tansy-ragwort"), basis: WA },
  ],
  "ca-south-coast": [
    { invasiveId: "spartium-junceum", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "carpobrotus-edulis", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "oncosiphon-pilulifer", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "arundo-donax", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "cortaderia-selloana", listing: CALIPC_HIGH, basis: CAL },
  ],
  "ca-central-coast": [
    { invasiveId: "genista-monspessulana", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "rubus-armeniacus", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "centaurea-solstitialis", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "carpobrotus-edulis", listing: CALIPC_HIGH, basis: CAL },
    { invasiveId: "hedera-helix", listing: CALIPC_HIGH, basis: CAL },
  ],
  "florida-central": [
    { invasiveId: "schinus-terebinthifolia", listing: FISC_I, basis: FL },
    { invasiveId: "urena-lobata", listing: FISC_I, basis: FL },
    { invasiveId: "ardisia-crenata", listing: FISC_I, basis: FL },
    { invasiveId: "nephrolepis-cordifolia", listing: FISC_I, basis: FL },
    { invasiveId: "ludwigia-peruviana", listing: FISC_I, basis: FL },
  ],
  "florida-south": [
    { invasiveId: "schinus-terebinthifolia", listing: FISC_I, basis: FL },
    { invasiveId: "urena-lobata", listing: FISC_I, basis: FL },
    { invasiveId: "abrus-precatorius", listing: FISC_I, basis: FL },
    { invasiveId: "dioscorea-bulbifera", listing: FISC_I, basis: FL },
    { invasiveId: "ardisia-elliptica", listing: FISC_I, basis: FL },
  ],
  "france-atlantic": [
    { invasiveId: "buddleja-davidii", basis: FR_ATL },
    { invasiveId: "robinia-pseudoacacia", basis: FR_ATL },
    { invasiveId: "prunus-laurocerasus", basis: FR_ATL },
    { invasiveId: "reynoutria-japonica", basis: FR_ATL },
    { invasiveId: "senecio-inaequidens", basis: FR_ATL },
  ],
  "france-continental": [
    { invasiveId: "robinia-pseudoacacia", listing: GRAND_EST_IMPLANTEE, basis: GE },
    { invasiveId: "ailanthus-altissima", listing: GRAND_EST_IMPLANTEE, basis: GE },
    { invasiveId: "impatiens-glandulifera", listing: GRAND_EST_IMPLANTEE, basis: GE },
    { invasiveId: "buddleja-davidii", listing: GRAND_EST_IMPLANTEE, basis: GE },
    { invasiveId: "reynoutria-japonica", listing: GRAND_EST_IMPLANTEE, basis: GE },
  ],
  "france-mediterranean": [
    { invasiveId: "agave-americana", listing: INVMED_MAJEURE, basis: PACA },
    { invasiveId: "robinia-pseudoacacia", listing: INVMED_MAJEURE, basis: PACA },
    { invasiveId: "ailanthus-altissima", listing: INVMED_MAJEURE, basis: PACA },
    { invasiveId: "oxalis-pes-caprae", listing: INVMED_MAJEURE, basis: PACA },
    { invasiveId: "carpobrotus-edulis", listing: INVMED_MAJEURE, basis: PACA },
  ],
  "france-alpine": [
    { invasiveId: "buddleja-davidii", basis: FR_ALP },
    { invasiveId: "phytolacca-americana", basis: FR_ALP },
    { invasiveId: "robinia-pseudoacacia", basis: FR_ALP },
    { invasiveId: "ailanthus-altissima", basis: FR_ALP },
    { invasiveId: "reynoutria-japonica", basis: FR_ALP },
  ],
  ireland: [
    { invasiveId: "buddleja-davidii", basis: IE },
    { invasiveId: "rhododendron-ponticum", basis: IE },
    { invasiveId: "prunus-laurocerasus", basis: IE },
    { invasiveId: "impatiens-glandulifera", basis: IE },
    { invasiveId: "gunnera-tinctoria", basis: IE },
  ],
};
