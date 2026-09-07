// The "grow this instead" dataset — the common non-native ornamentals people
// buy and plant, and the natives on our lists that do the same job at least as
// well, on the traits that decide whether a swap is worth making: water,
// disease, and what it feeds.
//
// Two parts, both auditable in this one file the way a plant row is:
//
//   1. ORNAMENTALS — the catalog. Each commonly-planted non-native described
//      once: what it's planted *for* (`role`), where it's really from, and the
//      weakness a native beats. Bermuda grass is Bermuda grass everywhere, so
//      the catalog is shared; only the swaps differ by region.
//
//   2. ALTERNATIVES — the ties, keyed by region id, then by *ornamental* id,
//      then a list of the natives that stand in for it there. Keyed by region
//      because the right swap is a local question: the lawn grass that shrugs
//      off a Mid-Atlantic summer is not the one for a Florida one, and the
//      cherry-laurel hedge that wants replacing meets holly in Brittany, mastic
//      on the Riviera and evergreen huckleberry in Oregon.
//
// What earns a row here:
//   - Real people really plant the ornamental for a real garden job — a lawn, a
//     hedge, a shade tree, a "butterfly plant" — and a native genuinely does
//     that job. "A wildflower meadow instead of a lawn" is an honest answer for
//     a border, not for the strip a child plays football on, and the `why` says
//     which.
//   - There is something you can *point to* on water, disease or wildlife where
//     the native equals or beats the ornamental. Where it doesn't, we don't
//     claim it — the edge is simply left off. A citable source stands behind
//     the swap.
//
// And what doesn't: a tone of moral panic. Butterfly bush is a lovely shrub and
// a real nectar bar; the honest case for a native beside it is that it feeds
// the caterpillars too, not that the gardener sinned. The point is a better
// choice, freely made — not a scold.
//
// A note on "not from here": several of these are natives *somewhere we cover*
// — English holly and cherry laurel in Atlantic France, garden lupine in the
// Pacific Northwest. The page says so and links to where we recommend them; the
// claim is "wrong for this place", never "bad plant". (`nativeSomewhere` in
// lib/lookalikes.ts finds those, matched on scientific name.)
//
// Sources leaned on throughout (full licensing in DATA_SOURCES.md):
//   - US extension: Penn State, Rutgers NJAES, UF/IFAS, WSU, Oregon State
//   - Botanic gardens: Missouri Botanical Garden, Morton Arboretum, RHS
//   - Native-plant & habitat groups: Lady Bird Johnson Wildflower Center,
//     Xerces Society, Mt. Cuba Center, California Native Plant Society
//   - Weed authorities: Cal-IPC, WA/King County Noxious Weed boards, FLEPPC,
//     the OFB Centre de ressources EEE and INPN (France)
//   - Connecticut Agricultural Experiment Station (the barberry–tick work)
//
// The native side is not editorial: `noWaterEstablish`, `moisture` and the
// eco-scores on each plant row are where the water and wildlife edges come
// from. Disease and the "what it's planted for" framing are editorial, cited.
import type { AlternativeLink, Ornamental } from "../types";

// ---- The catalog: the ornamentals themselves, described once ----
export const ORNAMENTALS: Ornamental[] = [
  // ---------------- Lawn, grasses & groundcover ----------------
  {
    id: "cynodon-dactylon",
    common: "Bermuda grass",
    latin: "Cynodon dactylon",
    form: "grass",
    role: "Lawn / turf",
    origin: "Native to the warm grasslands of Africa and Eurasia; the South's default warm-season lawn.",
    blurb:
      "The green that comes out of a hose. It makes a tough, fine lawn in full sun — but only while it's watered and fed, browns off the moment the heat comes or the tap stops, and runs by the yard into every bed it can reach. Its roots are shallow, so the ground under it sheds water instead of drinking it.",
    originBasis: "USDA PLANTS; Missouri Botanical Garden.",
  },
  {
    id: "pennisetum-setaceum",
    common: "Fountain grass",
    latin: "Pennisetum setaceum",
    form: "grass",
    role: "Ornamental grass",
    origin: "Native to North Africa, the Middle East and southwest Asia.",
    blurb:
      "The arching bottlebrush grass in a thousand parking-lot planters. It seeds itself into dry hillsides by the roadside, and a stand of it is fuel — it carries fire into places that never used to burn.",
    originBasis: "California Invasive Plant Council (Cal-IPC).",
  },
  {
    id: "cortaderia-selloana",
    common: "Pampas grass",
    latin: "Cortaderia selloana",
    form: "grass",
    role: "Big screening grass",
    origin: "Native to South America.",
    blurb:
      "The giant silver plume. One plant throws millions of seeds on the wind, the leaf edges cut like a saw, and it has run down whole coastlines and road cuttings. A lot of screen for a lot of trouble.",
    originBasis: "Cal-IPC; OFB Centre de ressources EEE.",
  },
  {
    id: "carpobrotus-edulis",
    common: "Ice plant (Hottentot fig)",
    latin: "Carpobrotus edulis",
    form: "groundcover",
    role: "Coastal bank / groundcover",
    origin: "Native to South Africa.",
    blurb:
      "The fat, fleshy mat sold to hold a slope. It does cover ground — then smothers everything under it, and its shallow, heavy mat actually loosens the sand it was meant to bind. It has blanketed dunes from California to the Riviera.",
    originBasis: "Cal-IPC; Conservatoire du littoral.",
  },
  {
    id: "hedera-helix",
    common: "English ivy",
    latin: "Hedera helix",
    form: "vine",
    role: "Evergreen groundcover / wall cover",
    origin: "Native to Europe and western Asia; planted for dry shade nothing else will fill.",
    blurb:
      "The evergreen carpet for the difficult corner. It does cover dry shade — and then it doesn't stop, smothering the ground flora and climbing whatever it reaches, trees included, until the weight and the shade bring them down. It feeds almost nothing here.",
    originBasis: "Penn State Extension; Missouri Botanical Garden.",
  },
  // ---------------- Shrubs ----------------
  {
    id: "berberis-thunbergii",
    common: "Japanese barberry",
    latin: "Berberis thunbergii",
    form: "shrub",
    role: "Thorny hedge / colour shrub",
    origin: "Native to Japan; sold for its red or gold leaves and its animal-proof thorns.",
    blurb:
      "A neat, thorny, deer-proof shrub in every foundation planting — and a seed factory for the woods behind it. Its low, dense, humid canopy is the microclimate black-legged (deer) ticks thrive in, and barberry thickets carry markedly more Lyme-infected ticks than woods without it.",
    originBasis: "Penn State Extension; Connecticut Agricultural Experiment Station.",
  },
  {
    id: "buddleja-davidii",
    common: "Butterfly bush",
    latin: "Buddleja davidii",
    form: "shrub",
    role: "Nectar shrub for a sunny border",
    origin: "Native to China; sold, by the name, as the plant that brings butterflies.",
    blurb:
      "It does bring butterflies — its summer spikes are a genuine nectar bar. But nectar is the easy half: not one native caterpillar can eat its leaves, so it feeds the adults and raises none of the next generation. It's a diner, not a nursery, and it seeds itself into open ground besides.",
    originBasis: "Xerces Society; Mt. Cuba Center.",
  },
  {
    id: "euonymus-alatus",
    common: "Burning bush",
    latin: "Euonymus alatus",
    form: "shrub",
    role: "Autumn-colour hedge shrub",
    origin: "Native to northeast Asia.",
    blurb:
      "Planted for one week of fluorescent red in autumn. Birds carry its seed into the woods, where it grows into dense shade-casting thickets that crowd the wildflowers out. Several states have banned its sale.",
    originBasis: "Penn State Extension; Missouri Botanical Garden.",
  },
  {
    id: "nandina-domestica",
    common: "Heavenly bamboo (Nandina)",
    latin: "Nandina domestica",
    form: "shrub",
    role: "Berrying foundation shrub",
    origin: "Native to eastern Asia and India.",
    blurb:
      "An airy evergreen hung with red winter berries — berries that hold cyanide, and that have killed whole flocks of cedar waxwings, the birds that swallow them by the handful. It seeds into woodland across the Southeast.",
    originBasis: "UF/IFAS; U.S. Fish & Wildlife Service.",
  },
  {
    id: "hibiscus-rosa-sinensis",
    common: "Tropical hibiscus",
    latin: "Hibiscus rosa-sinensis",
    form: "shrub",
    role: "Evergreen flowering hedge",
    origin: "A long-cultivated tropical Asian plant, known only in gardens.",
    blurb:
      "South Florida's default hedge: big showy bloom the year round, and almost nothing native eats its leaves or shelters in it. A wall of flowers the local food web walks straight past.",
    originBasis: "UF/IFAS.",
  },
  {
    id: "nerium-oleander",
    common: "Oleander",
    latin: "Nerium oleander",
    form: "shrub",
    role: "Evergreen screening shrub",
    origin: "Native to the Mediterranean and southwest Asia.",
    blurb:
      "The tough, drought-proof shrub down every freeway median. It asks for nothing and gives nothing back — and it is one of the most poisonous plants sold, in every part, leaf, flower and smoke.",
    originBasis: "Missouri Botanical Garden.",
  },
  {
    id: "ilex-aquifolium",
    common: "English holly",
    latin: "Ilex aquifolium",
    form: "shrub",
    role: "Evergreen berrying shrub / hedge",
    origin: "Native to Europe, North Africa and western Asia.",
    blurb:
      "The classic prickly evergreen with red berries. In the Pacific Northwest the birds that eat those berries carry it deep into the forest, where it grows into dense, shade-tolerant thickets under the firs.",
    originBasis: "Washington State Noxious Weed Control Board; King County.",
  },
  {
    id: "prunus-laurocerasus",
    common: "Cherry laurel (English laurel)",
    latin: "Prunus laurocerasus",
    form: "shrub",
    role: "Evergreen privacy hedge",
    origin: "Native to southeast Europe and southwest Asia.",
    blurb:
      "The default fast evergreen wall — glossy, thirsty, and seeding itself into woodland from Oregon to western Europe as birds drop its stones. Its crushed leaves smell of almonds because they give off cyanide, and it's prone to the shot-hole fungus that riddles it with holes.",
    originBasis: "Oregon State University; RHS.",
  },
  {
    id: "rhododendron-ponticum",
    common: "Pontic rhododendron",
    latin: "Rhododendron ponticum",
    form: "shrub",
    role: "Evergreen flowering screen",
    origin: "Native to the Iberian Peninsula and the Black Sea region.",
    blurb:
      "Sold for its wall of purple spring flower, and one of the great invaders of the Atlantic west: it forms shade so dense and leaf litter so toxic that nothing grows beneath it, and its nectar is poisonous to honeybees.",
    originBasis: "RHS; INPN.",
  },
  {
    id: "cotoneaster-horizontalis",
    common: "Wall cotoneaster",
    latin: "Cotoneaster horizontalis",
    form: "shrub",
    role: "Berrying rockery / wall shrub",
    origin: "Native to China.",
    blurb:
      "The neat herringbone shrub for a low wall, hung with red berries. Birds carry those berries into limestone hills and screes, where it is now a listed invader of exactly the thin, open ground its rarest wildflowers need.",
    originBasis: "RHS; INPN.",
  },
  {
    id: "cycas-revoluta",
    common: "Sago palm",
    latin: "Cycas revoluta",
    form: "shrub",
    role: "Architectural evergreen",
    origin: "Native to southern Japan; not a palm at all, but an ancient cycad.",
    blurb:
      "The stiff, glossy rosette in a thousand Florida front yards. It looks the part and asks for nothing — but it feeds nothing native, and every part of it is poisonous enough to kill a dog that chews a seed.",
    originBasis: "UF/IFAS; ASPCA.",
  },
  // ---------------- Perennials ----------------
  {
    id: "chrysanthemum-morifolium",
    common: "Garden mum",
    latin: "Chrysanthemum × morifolium",
    form: "perennial",
    role: "Autumn colour perennial",
    origin: "A long-cultivated East Asian plant, known only in gardens.",
    blurb:
      "The tray of instant autumn colour outside every supermarket in September. Most are bred so tightly for bloom that they offer little nectar and set no seed — a mound of colour the bees and birds pass straight over, planted and binned in a season.",
    originBasis: "Missouri Botanical Garden; Mt. Cuba Center.",
  },
  {
    id: "ruellia-simplex",
    common: "Mexican petunia",
    latin: "Ruellia simplex",
    form: "perennial",
    role: "Flowering perennial",
    origin: "Native to Mexico and the Caribbean.",
    blurb:
      "Sold for its tireless purple bloom, and almost impossible to be rid of once in: it seeds and runs into every damp margin, and a dug clump grows back from a scrap of root.",
    originBasis: "UF/IFAS.",
  },
  {
    id: "lupinus-polyphyllus",
    common: "Garden lupine (Russell lupine)",
    latin: "Lupinus polyphyllus",
    form: "perennial",
    role: "Cottage-border perennial",
    origin: "Native to western North America.",
    blurb:
      "The tall lupin spikes of a cottage border — escaped into the hay-meadows of the European mountains, where the trouble is exactly what a garden prizes: its roots enrich the soil, and a mountain meadow's wildflowers depend on that soil staying poor.",
    originBasis: "INPN; Norwegian Biodiversity Information Centre.",
  },
  // ---------------- Trees ----------------
  {
    id: "acer-platanoides",
    common: "Norway maple",
    latin: "Acer platanoides",
    form: "tree",
    role: "Fast street / shade tree",
    origin: "Native to continental Europe and western Asia; planted by the million after Dutch elm disease.",
    blurb:
      "The fast, tidy shade tree that filled the avenues — and then seeded into the woods. Its shade is so dense and its roots so greedy and shallow that the ground beneath a mature one is bare, and it's prone to girdling roots and verticillium wilt as it ages.",
    originBasis: "Penn State Extension; Morton Arboretum.",
  },
  {
    id: "pyrus-calleryana",
    common: "Callery pear (Bradford pear)",
    latin: "Pyrus calleryana",
    form: "tree",
    role: "Spring-flowering ornamental tree",
    origin: "Native to China and Vietnam; sold from the 1960s as a tidy, quick street tree.",
    blurb:
      "The tree that turns whole streets white for one week in spring — and splits apart in the first real storm, its branches too crowded to hold. The varieties cross and their thorny seedlings fill old fields and verges; several states have now banned its sale.",
    originBasis: "Penn State Extension; Missouri Botanical Garden.",
  },
  {
    id: "cupaniopsis-anacardioides",
    common: "Carrotwood",
    latin: "Cupaniopsis anacardioides",
    form: "tree",
    role: "Fast shade / street tree",
    origin: "Native to eastern Australia.",
    blurb:
      "A neat, quick, salt-tough shade tree sold up and down Florida — and a bird-spread invader of hammocks, dunes and mangrove edges. It's now illegal to sell in the state.",
    originBasis: "UF/IFAS; FLEPPC.",
  },
  {
    id: "cupressocyparis-leylandii",
    common: "Leyland cypress",
    latin: "Cupressus × leylandii",
    form: "tree",
    role: "Instant privacy hedge",
    origin: "A garden hybrid, known only in cultivation.",
    blurb:
      "The instant evergreen wall. It never stops growing, browns out from the inside where it's cut, and gives a garden a dark, dead-bottomed edge — a lot of height, fast, that shelters and feeds almost nothing.",
    originBasis: "RHS.",
  },
  {
    id: "platanus-x-hispanica",
    common: "London plane",
    latin: "Platanus × hispanica",
    form: "tree",
    role: "Big street / park shade tree",
    origin: "A garden hybrid, planted along city streets the world over.",
    blurb:
      "The mottled-bark giant that lines the avenues. It takes pavement and pollution and gives real shade — but it feeds little here, drops itchy bristles and a heavy pollen that's a notable allergen, and comes down with anthracnose year after year.",
    originBasis: "RHS; Morton Arboretum.",
  },
  {
    id: "prunus-serrulata",
    common: "Japanese flowering cherry",
    latin: "Prunus serrulata",
    form: "tree",
    role: "Spring-blossom ornamental tree",
    origin: "Native to Japan, Korea and China; the cherry of the blossom festivals.",
    blurb:
      "A fortnight of pink froth in spring, and then a tree that gives very little else — short-lived, prone to canker and rot, and host to almost none of the caterpillars our songbirds raise their young on.",
    originBasis: "Missouri Botanical Garden; Morton Arboretum.",
  },
  {
    id: "salix-babylonica",
    common: "Weeping willow",
    latin: "Salix babylonica",
    form: "tree",
    role: "Waterside / lawn specimen tree",
    origin: "Native to northern China; planted beside water the world over.",
    blurb:
      "The trailing green curtain by the pond. It grows fast and reads as romantic — then its greedy roots find every drain and pipe, its brittle limbs shed in storms, and it's usually rotten at heart inside forty years.",
    originBasis: "Missouri Botanical Garden; RHS.",
  },
  {
    id: "betula-pendula-ornamental",
    common: "European weeping birch",
    latin: "Betula pendula",
    form: "tree",
    role: "White-barked specimen tree",
    origin: "Native across Europe and northern Asia; a favourite white-stemmed lawn tree.",
    blurb:
      "The graceful white-barked birch sold for a lawn centrepiece across North America. Away from its cool European home it's a magnet for the bronze birch borer, which kills these trees young from the top down.",
    originBasis: "Morton Arboretum; U.S. Forest Service.",
  },
  {
    id: "picea-pungens",
    common: "Colorado blue spruce",
    latin: "Picea pungens",
    form: "tree",
    role: "Specimen evergreen",
    origin: "Native to the central Rocky Mountains; planted far outside it for its blue colour.",
    blurb:
      "The steel-blue specimen conifer on a thousand lawns. In the humid East and Midwest it's living in the wrong climate, and it's increasingly failing there to needlecast and canker — a striking tree that browns out and dies back from the bottom.",
    originBasis: "Morton Arboretum; Missouri Botanical Garden.",
  },
  // ---------------- More grasses, groundcovers, perennials, shrubs & trees ----------------
  {
    id: "miscanthus-sinensis",
    common: "Chinese silvergrass (maiden grass)",
    latin: "Miscanthus sinensis",
    form: "grass",
    role: "Big ornamental grass",
    origin: "Native to eastern Asia; the tall feather-plumed grass of a thousand borders.",
    blurb:
      "The fountain of arching blades and silver autumn plumes sold as a easy-care centrepiece. It seeds itself into old fields and roadsides — several states now list it — and carries fire the way its native-grass look-alikes don't.",
    originBasis: "Missouri Botanical Garden; USDA.",
  },
  {
    id: "vinca-minor",
    common: "Common periwinkle",
    latin: "Vinca minor",
    form: "groundcover",
    role: "Evergreen shade groundcover",
    origin: "Native to central and southern Europe.",
    blurb:
      "The glossy evergreen mat with little blue pinwheels, sold for dry shade under trees. It does cover the ground — then creeps out of the bed and into the woods, where it smothers the spring wildflowers and feeds next to nothing.",
    originBasis: "Missouri Botanical Garden; USDA.",
  },
  {
    id: "pachysandra-terminalis",
    common: "Japanese pachysandra",
    latin: "Pachysandra terminalis",
    form: "groundcover",
    role: "Evergreen shade carpet",
    origin: "Native to Japan; the default green carpet under a shade tree.",
    blurb:
      "A uniform ankle-high evergreen carpet, planted by the flat under maples and along foundations. It's a monoculture by design — nothing native eats it, nothing nests in it — and it spreads by runner into the woodland beyond.",
    originBasis: "Missouri Botanical Garden.",
  },
  {
    id: "rosa-hybrids",
    common: "Hybrid tea & landscape roses",
    latin: "Rosa hybrids",
    form: "shrub",
    role: "Flowering / bedding rose",
    origin: "Garden hybrids, bred over centuries for the flower.",
    blurb:
      "The bedding rose bought for the bloom, and the bloom is most of what it gives: thirsty, prone to black spot and needing the spray that goes with it, and — where the flower is fully double — packed so tight that a bee can't reach the middle.",
    originBasis: "Missouri Botanical Garden; RHS.",
  },
  {
    id: "ligustrum-sinense",
    common: "Chinese privet",
    latin: "Ligustrum sinense",
    form: "shrub",
    role: "Fast evergreen hedge",
    origin: "Native to China; the cheap fast hedge of the American South.",
    blurb:
      "A quick, dense, semi-evergreen hedge — and one of the Southeast's worst invaders, its berries carried by birds into every fencerow and floodplain until it crowds the understorey out. Its heavy bloom is a common allergen besides.",
    originBasis: "UF/IFAS; USDA.",
  },
  {
    id: "hemerocallis-fulva",
    common: "Daylily",
    latin: "Hemerocallis fulva",
    form: "perennial",
    role: "Sunny border perennial",
    origin: "Native to Asia; the orange 'ditch lily' naturalised along roadsides everywhere.",
    blurb:
      "Tough, cheap, and everywhere — each flower lasts a day and the plant asks nothing of you. It asks nothing and gives about as much back: little nectar a native bee can use, no caterpillars, and the common orange one runs into dense sterile clumps that shoulder everything else aside.",
    originBasis: "Missouri Botanical Garden; Mt. Cuba Center.",
  },
  {
    id: "hosta",
    common: "Hosta (plantain lily)",
    latin: "Hosta",
    form: "perennial",
    role: "Shade foliage clump",
    origin: "Native to East Asia; the shade garden's default leafy mound.",
    blurb:
      "The go-to clump of bold leaves for a shady spot — and the slugs' favourite dinner, so it often ends the summer in holes. Nothing native raises its young on it; it's greenery, and greenery only.",
    originBasis: "Missouri Botanical Garden.",
  },
  {
    id: "iris-pseudacorus",
    common: "Yellow flag iris",
    latin: "Iris pseudacorus",
    form: "perennial",
    role: "Pond / rain-garden perennial",
    origin: "Native to Europe and North Africa; sold for the water's edge.",
    blurb:
      "The tall yellow iris of the pond margin. Away from home it takes a wet edge over entirely — a dense mat of rhizomes that shoulders out every other marsh plant and is toxic to graze — and it's banned for sale in a growing list of states.",
    originBasis: "USDA; Missouri Botanical Garden.",
  },
  {
    id: "syagrus-romanzoffiana",
    common: "Queen palm",
    latin: "Syagrus romanzoffiana",
    form: "tree",
    role: "Feather-palm street tree",
    origin: "Native to South America; the fast feather palm on every Florida street.",
    blurb:
      "The quick, glossy, feather-leaved palm sold for instant tropics. It's shallow-rooted and forever hungry — chronically short of manganese and potassium in Florida sand — and it feeds little next to the native palm it so often replaced.",
    originBasis: "UF/IFAS.",
  },
];

// ---- The ties: region → ornamental id → the natives that stand in for it ----
//
// Read a line as a sentence: in `mid-atlantic`, for `cynodon-dactylon` (Bermuda
// grass), grow `schizachyrium-scoparium` (little bluestem) instead, "because …",
// and here is how the two compare on water, disease and wildlife.
export const ALTERNATIVES: Record<string, Record<string, AlternativeLink[]>> = {
  "mid-atlantic": {
    "hemerocallis-fulva": [
      {
        plantId: "rudbeckia-fulgida",
        why: "For a mound of easy, cheerful summer colour, black-eyed Susan gives it for weeks on end — and unlike the daylily it's mobbed by bees and finches and raises native caterpillars besides.",
        edges: [
          { axis: "wildlife", native: "Nectar and pollen for a crowd of bees and butterflies; seed for finches; a host for several moths.", ornamental: "Little a native bee can use, and no caterpillars." },
          { axis: "care", native: "A tough perennial that seeds itself around gently.", ornamental: "Fine, but it feeds the garden nothing while it does it." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "echinacea-purpurea",
        why: "For a bold, long-blooming clump, purple coneflower stands all summer, feeds butterflies through it, and holds seed heads the goldfinches ride into winter.",
        edges: [
          { axis: "water", native: "Deep-rooted and drought-tough once established.", ornamental: "Thirstier, and gives little back for the water." },
          { axis: "wildlife", native: "A top butterfly nectar plant; winter seed for finches.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
    "hosta": [
      {
        plantId: "geranium-maculatum",
        why: "For a leafy mound in the shade, wild geranium spreads a soft green clump lit by pink spring flowers — the foliage hostas are grown for, plus a bloom the bees actually want.",
        edges: [
          { axis: "wildlife", native: "Early nectar for native bees; a host for several moths.", ornamental: "Nothing native eats it." },
          { axis: "care", native: "Quietly fills its space and asks for nothing.", ornamental: "The slugs' favourite — often in holes by August." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "polystichum-acrostichoides",
        why: "For bold evergreen texture in dry shade, Christmas fern holds its dark fronds right through winter where the hosta has died back to bare ground.",
        edges: [
          { axis: "care", native: "Evergreen and slug-proof; shrugs off dry shade.", ornamental: "Chewed by slugs and gone by winter." },
          { axis: "wildlife", native: "Cover for salamanders, insects and ground-nesting bees.", ornamental: "Little native value." },
        ],
        basis: "Mt. Cuba Center; USDA NRCS.",
      },
    ],
    "vinca-minor": [
      {
        plantId: "packera-aurea",
        why: "For a spreading evergreen carpet in shade, golden groundsel knits the same weed-smothering mat — then throws up a haze of gold spring daisies, and stays in the bed instead of invading the woods.",
        edges: [
          { axis: "wildlife", native: "Early nectar for small native bees and flies.", ornamental: "Feeds next to nothing, and smothers the spring wildflowers where it escapes." },
          { axis: "care", native: "A vigorous native groundcover that holds shade and slopes.", ornamental: "Creeps into the woods and is hard to be rid of." },
        ],
        basis: "Mt. Cuba Center; USDA NRCS.",
      },
      {
        plantId: "fragaria-virginiana",
        why: "For a low green mat in sun to part shade, wild strawberry runs into cover as fast as periwinkle, flowers white in spring, and hands out small sweet berries.",
        edges: [
          { axis: "wildlife", native: "Feeds pollinators in spring, then birds, mammals and people; a host for several butterflies.", ornamental: "Little to no wildlife value." },
          { axis: "care", native: "Drought-tough once knit together.", ornamental: "An escapee that smothers the ground flora." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
    ],
    "pachysandra-terminalis": [
      {
        plantId: "polystichum-acrostichoides",
        why: "For an evergreen carpet under trees, a colony of Christmas fern gives the same year-round green — living texture instead of a monoculture, and cover for the small life of the leaf litter.",
        edges: [
          { axis: "wildlife", native: "Shelters salamanders, insects and ground-nesting bees.", ornamental: "A monoculture nothing native uses." },
          { axis: "care", native: "Evergreen, slug-proof and undemanding in dry shade.", ornamental: "Spreads by runner into the woodland beyond the bed." },
        ],
        basis: "Mt. Cuba Center; USDA NRCS.",
      },
      {
        plantId: "packera-aurea",
        why: "For a fast evergreen groundcover in moist shade, golden groundsel covers ground as thoroughly as pachysandra and lights up in spring with gold daisies the bees work.",
        edges: [
          { axis: "wildlife", native: "Early nectar for small native bees and flies.", ornamental: "Feeds nothing native." },
          { axis: "care", native: "A tough native mat for shade and slopes.", ornamental: "Creeps into the woods; a green blank." },
        ],
        basis: "Mt. Cuba Center; USDA NRCS.",
      },
    ],
    "miscanthus-sinensis": [
      {
        plantId: "panicum-virgatum",
        why: "For an upright fountain of a grass with airy autumn seed heads, switchgrass gives the same height and movement — a native of the same meadows, that won't seed down the roadside or carry fire the way the maiden grass does.",
        edges: [
          { axis: "wildlife", native: "Seed for winter birds; cover for ground life; a host for several skippers.", ornamental: "Feeds little native, and seeds into wild grassland." },
          { axis: "water", native: "Deep-rooted and thoroughly drought-proof once established.", ornamental: "Tough too — which is how it escapes." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "andropogon-gerardii",
        why: "For real stature, big bluestem stands head-high with bronze 'turkey-foot' seed heads — the tallgrass-prairie giant, in place of an Asian grass that jumps the garden fence.",
        edges: [
          { axis: "wildlife", native: "Seed and cover for birds; a host for several skippers.", ornamental: "Little native value; a listed invader in several states." },
          { axis: "water", native: "Thoroughly drought-proof once its deep roots are down.", ornamental: "Drought-tough, and fire-carrying where it escapes." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
    ],
    "iris-pseudacorus": [
      {
        plantId: "lobelia-cardinalis",
        why: "For a jolt of colour at the water's edge, cardinal flower sends up spikes of pure scarlet the hummingbirds cross the garden for — where the yellow flag only chokes the margin into a single-species mat.",
        edges: [
          { axis: "wildlife", native: "A hummingbird magnet, and nectar for swallowtails.", ornamental: "Feeds little, and its rhizome mat crowds every other marsh plant out." },
          { axis: "care", native: "A well-behaved clump for a pond edge or rain garden.", ornamental: "A banned invader of wetlands across a growing list of states." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "asclepias-incarnata",
        why: "For height and bloom in a damp spot, swamp milkweed carries flat pink flower heads humming with pollinators — and, being a milkweed, feeds monarch caterpillars the flag iris can't.",
        edges: [
          { axis: "wildlife", native: "A monarch host, and nectar for a crowd of butterflies and bees.", ornamental: "A wildlife dead end that takes the wetland over." },
          { axis: "care", native: "A clumping native that stays where you plant it.", ornamental: "Invasive and toxic to grazing animals." },
        ],
        basis: "Xerces Society; Monarch Joint Venture.",
      },
    ],
    "cynodon-dactylon": [
      {
        plantId: "schizachyrium-scoparium",
        why: "For a lawn you look at more than you walk on, a meadow of little bluestem holds a sunny slope with no hose and no mower, and turns copper all winter.",
        edges: [
          { axis: "water", native: "None once established — roots plunge five feet and it stays blue-green through a drought.", ornamental: "Browns off in summer heat without regular irrigation." },
          { axis: "disease", native: "A native bunchgrass with no turf diseases to speak of.", ornamental: "Prone to spring dead spot, dollar spot and other turf diseases when stressed." },
          { axis: "wildlife", native: "Hosts skipper butterflies and shelters ground-nesting birds through winter.", ornamental: "Feeds nothing native; a green surface and no more." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "carex-pensylvanica",
        why: "For the part you do walk on, in sun to part shade, Pennsylvania sedge makes a soft, fine, ankle-high lawn you can mow a few times a year or leave to flop.",
        edges: [
          { axis: "water", native: "Drought-tough once knit together; no summer watering.", ornamental: "Needs watering to stay green in the heat." },
          { axis: "wildlife", native: "A larval host for several skippers and cover for small ground life.", ornamental: "Feeds nothing native." },
        ],
        basis: "Mt. Cuba Center; Lady Bird Johnson Wildflower Center.",
      },
    ],
    "hedera-helix": [
      {
        plantId: "parthenocissus-quinquefolia",
        why: "For a wall or a bank, Virginia creeper does exactly ivy's job — climbs by itself, covers fast — then blazes scarlet in autumn and drops berries the birds strip.",
        edges: [
          { axis: "water", native: "Establishes and holds a dry bank with no supplemental water.", ornamental: "Tolerant of dry shade, but offers nothing back." },
          { axis: "wildlife", native: "Host to several sphinx moths; its berries feed dozens of bird species.", ornamental: "Smothers the ground flora and feeds almost nothing here." },
        ],
        basis: "Missouri Botanical Garden; Xerces Society.",
      },
      {
        plantId: "fragaria-virginiana",
        why: "For a flat patch of open ground, wild strawberry runs into a low green mat, flowers white in spring, and hands out small sweet berries — a groundcover that gives instead of only spreading.",
        edges: [
          { axis: "water", native: "Drought-tough once it has knit together.", ornamental: "Holds dry shade but crowds out everything else." },
          { axis: "wildlife", native: "Feeds pollinators in spring and birds, mammals and people in summer.", ornamental: "Little to no wildlife value here." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Rutgers NJAES.",
      },
    ],
    "berberis-thunbergii": [
      {
        plantId: "physocarpus-opulifolius",
        why: "For a tough, deer-tolerant hedge with coloured leaves, ninebark gives you the gold and burgundy the barberry cultivars sell — as a full-size native shrub, thorns and tick-thickets not included.",
        edges: [
          { axis: "water", native: "Drought-proof once set; takes poor soil and neglect.", ornamental: "Undemanding too — but that toughness is the problem, not the point." },
          { axis: "disease", native: "An open, airy shrub with no association with tick-borne disease.", ornamental: "Its dense low canopy shelters more Lyme-infected ticks than woods without it." },
          { axis: "wildlife", native: "Feeds specialist bees and hosts native moths; spent flower heads feed birds.", ornamental: "Little native wildlife value." },
        ],
        basis: "Penn State Extension; Connecticut Agricultural Experiment Station.",
      },
      {
        plantId: "ceanothus-americanus",
        why: "For a low, mounded shrub in a hot dry spot, New Jersey tea holds barberry's size and place and covers itself in white flowers alive with bees.",
        edges: [
          { axis: "water", native: "Deep-rooted and thoroughly drought-proof; thrives on poor, dry ground.", ornamental: "Tolerates dry soil but earns its keep by nothing." },
          { axis: "wildlife", native: "A pollinator magnet and larval host to spring azure and other butterflies.", ornamental: "Feeds nothing native." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
    ],
    "buddleja-davidii": [
      {
        plantId: "asclepias-tuberosa",
        why: "If the point was butterflies, butterfly weed is the plant that was actually named for the job: blazing orange nectar the adults mob — and the milkweed a monarch caterpillar has to have.",
        edges: [
          { axis: "water", native: "A deep taproot makes it thoroughly drought-proof; it wants dry, poor soil.", ornamental: "Drought-tolerant too, once established." },
          { axis: "wildlife", native: "Feeds adult butterflies *and* raises the next brood — a monarch host, not just a nectar stop.", ornamental: "A nectar bar only: not one native caterpillar can eat its leaves." },
        ],
        basis: "Xerces Society; Monarch Joint Venture.",
      },
      {
        plantId: "monarda-fistulosa",
        why: "For the same long summer show of nectar in a sunny border, wild bergamot throws up a haze of lavender heads that bees, butterflies and hummingbirds work all day.",
        edges: [
          { axis: "water", native: "Drought-tough once established; takes lean, dry soil.", ornamental: "Drought-tolerant, but deadhead it or it seeds around." },
          { axis: "wildlife", native: "Nectar for a long roll-call of pollinators, and a larval host for several moths.", ornamental: "Feeds the adults; hosts no native caterpillars." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "cephalanthus-occidentalis",
        why: "For a damp corner, buttonbush is the butterfly magnet to plant: its white pincushion flowers are smothered in bees and butterflies all summer, and it feeds the caterpillars and waterbirds the butterfly bush never could.",
        edges: [
          { axis: "wildlife", native: "A top summer nectar shrub; a host for several sphinx moths; seed for ducks and shorebirds.", ornamental: "Nectar for adults only; raises no native caterpillars." },
          { axis: "care", native: "A native of wet ground that thrives where it's too damp for most.", ornamental: "Seeds itself into open ground." },
        ],
        basis: "Xerces Society; Lady Bird Johnson Wildflower Center.",
      },
    ],
    "acer-platanoides": [
      {
        plantId: "acer-rubrum",
        why: "Red maple is the native the Norway maple was standing in for all along: the same quick shade and clean shape, with scarlet autumn colour and a food web underneath instead of bare ground.",
        edges: [
          { axis: "water", native: "Establishes and holds with no supplemental water once rooted.", ornamental: "Tough too — but its greed and shade are the cost." },
          { axis: "disease", native: "Broadly trouble-free; no milky sap, no bare circle of dead ground beneath it.", ornamental: "Prone to girdling roots and verticillium wilt with age." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species — the birds' summer larder.", ornamental: "Casts shade so dense the ground beneath it is usually bare." },
        ],
        basis: "Penn State Extension; Morton Arboretum.",
      },
    ],
    "pyrus-calleryana": [
      {
        plantId: "amelanchier-canadensis",
        why: "For that week of white spring blossom, serviceberry gives it — earlier, in an airy spray — then June berries the birds and you both eat, and a tree whose branches actually hold together.",
        edges: [
          { axis: "disease", native: "Sound branch structure; no habit of splitting apart in storms.", ornamental: "Weak, crowded branching that shears off in the first real wind; fire-blight prone." },
          { axis: "wildlife", native: "Sweet berries feed dozens of bird species; a larval host for many moths.", ornamental: "Hard little pellets of low value, and thorny invasive seedlings." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden.",
      },
      {
        plantId: "cornus-florida",
        why: "For the same small flowering tree in dappled shade, flowering dogwood carries broad white spring bracts, glossy red autumn berries and a tidy layered shape — none of it prone to snapping.",
        edges: [
          { axis: "disease", native: "Structurally sound; no storm-splitting habit.", ornamental: "Notorious for shearing apart as it matures; fire-blight prone." },
          { axis: "wildlife", native: "Red autumn berries stripped by migrating birds; hosts spring azure and many moths.", ornamental: "Little wildlife value, and it spreads." },
        ],
        basis: "Missouri Botanical Garden; Penn State Extension.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-alba",
        why: "For a great shade tree on a street or a big lawn, a white oak is the one to reach past the plane for: the same broad canopy and clean trunk, with five centuries of life and the richest food web of any tree here.",
        edges: [
          { axis: "wildlife", native: "Feeds over 500 caterpillar species — the single most important tree for songbirds; acorns feed dozens more.", ornamental: "Feeds almost nothing native." },
          { axis: "disease", native: "Sound and famously long-lived.", ornamental: "Anthracnose year after year; a heavy allergenic pollen." },
        ],
        basis: "Penn State Extension; Morton Arboretum.",
      },
      {
        plantId: "quercus-rubra",
        why: "For faster shade than a white oak, red oak grows quickly to a broad street-tree crown, turns russet-red in fall, and carries the same vast community of life.",
        edges: [
          { axis: "wildlife", native: "Over 500 caterpillar species; acorns for jays, woodpeckers and mammals.", ornamental: "Feeds almost nothing native." },
          { axis: "disease", native: "Long-lived and sound in the ground it belongs in.", ornamental: "Recurring anthracnose; itchy bristles and heavy pollen." },
        ],
        basis: "Penn State Extension; Morton Arboretum.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-serotina",
        why: "For spring blossom that actually feeds a garden, black cherry hangs out its own white flower, then dark fruit the birds strip — and lives for a century where the ornamental cherry is spent in twenty years.",
        edges: [
          { axis: "wildlife", native: "Hosts over 300 caterpillar species; its fruit feeds dozens of birds.", ornamental: "Nectar aside, it raises almost none of the next generation of insects." },
          { axis: "disease", native: "Tough and long-lived.", ornamental: "Short-lived and prone to canker, rot and borers." },
        ],
        basis: "Penn State Extension; Morton Arboretum.",
      },
    ],
    "betula-pendula-ornamental": [
      {
        plantId: "betula-nigra",
        why: "For the same white-barked grace on a lawn, river birch peels in sheets of cinnamon and cream — and unlike the European birch it simply shrugs off the borer that kills them.",
        edges: [
          { axis: "disease", native: "Resistant to the bronze birch borer that dooms the ornamental one here.", ornamental: "Killed young, top-down, by the borer away from its cool home." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; its seed feeds finches through winter.", ornamental: "Feeds little native." },
        ],
        basis: "Morton Arboretum; U.S. Forest Service.",
      },
    ],
    "euonymus-alatus": [
      {
        plantId: "vaccinium-corymbosum",
        why: "If it was the autumn scarlet you wanted, highbush blueberry burns just as red — and gives you white spring bells, a crop of berries, and a shrub that feeds the woods instead of seeding into them.",
        edges: [
          { axis: "wildlife", native: "Hosts over 200 caterpillar species; flowers feed bees, berries feed birds and people.", ornamental: "Bird-spread into the woods; feeds little of value." },
          { axis: "disease", native: "A well-behaved native of acid soils.", ornamental: "A shade-casting thicket-former banned in several states." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden.",
      },
      {
        plantId: "ilex-verticillata",
        why: "For winter fire, winterberry holds a blaze of scarlet berries on bare stems long after the burning bush has dropped its one week of leaf colour.",
        edges: [
          { axis: "wildlife", native: "Berries feed robins, waxwings and more deep into winter.", ornamental: "Seeds into the woods; feeds little of value." },
        ],
        basis: "Missouri Botanical Garden; Penn State Extension.",
      },
    ],
    "chrysanthemum-morifolium": [
      {
        plantId: "symphyotrichum-novae-angliae",
        why: "For the same mound of autumn colour that actually feeds something, New England aster covers itself in purple daisies right when the pollinators need a last meal before winter.",
        edges: [
          { axis: "wildlife", native: "A top late-season nectar source; a larval host for the pearl crescent and over 100 moths.", ornamental: "Bred so tightly for bloom it offers little nectar and sets no seed." },
          { axis: "care", native: "A perennial that returns and spreads on its own.", ornamental: "Planted and binned in a single season." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "solidago-rugosa",
        why: "For a haze of gold in the same autumn slot, wrinkleleaf goldenrod lights up and hums with bees — the nectar bar the mums only look like.",
        edges: [
          { axis: "wildlife", native: "One of the very best late nectar and pollen plants; hosts over 100 caterpillar species.", ornamental: "Little nectar, no seed, no host value." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
  },

  "north-michigan": {
    "hemerocallis-fulva": [
      {
        plantId: "rudbeckia-hirta",
        why: "For easy summer gold in a border, black-eyed Susan blooms for weeks and pulls in bees and finches — where the daylily gives a day of colour and the pollinators nothing.",
        edges: [
          { axis: "wildlife", native: "Nectar for bees and butterflies; seed for goldfinches; a host for several moths.", ornamental: "Little a native bee can use, and no caterpillars." },
          { axis: "water", native: "Drought-tough once established.", ornamental: "Thirstier, and feeds the garden nothing." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "monarda-fistulosa",
        why: "For a long-blooming clump alive with life, wild bergamot throws up lavender heads worked all day by bees, butterflies and hummingbirds.",
        edges: [
          { axis: "wildlife", native: "Nectar for a long roll-call of pollinators; a host for several moths.", ornamental: "Feeds almost nothing native." },
          { axis: "water", native: "Drought-tough once established; takes lean soil.", ornamental: "Runs into sterile clumps and gives little back." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
    "hosta": [
      {
        plantId: "matteuccia-struthiopteris",
        why: "For a big bold clump in moist shade, ostrich fern unfurls shuttlecocks of fresh green four feet high — far more presence than a hosta, and none of the slug holes.",
        edges: [
          { axis: "care", native: "Vigorous and slug-proof; spreads into a lush colony.", ornamental: "Chewed ragged by slugs by midsummer." },
          { axis: "wildlife", native: "Cover for the small life of the shade; its fiddleheads a spring food.", ornamental: "Nothing native eats it." },
        ],
        basis: "USDA NRCS; Lady Bird Johnson Wildflower Center.",
      },
      {
        plantId: "aquilegia-canadensis",
        why: "For a lighter touch in part shade, wild columbine dangles red-and-gold lanterns in spring that the returning hummingbirds head straight for.",
        edges: [
          { axis: "wildlife", native: "Early nectar for hummingbirds and long-tongued bees; a host for the columbine duskywing.", ornamental: "Feeds nothing native." },
          { axis: "care", native: "Self-sows gently into the shade and asks for nothing.", ornamental: "A slug target that gives the garden no life." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
    "vinca-minor": [
      {
        plantId: "cornus-canadensis",
        why: "For an evergreen carpet in cool shade, bunchberry lays down a neat mat topped with white spring 'flowers' and red autumn berries — a dogwood shrunk to ankle height, and a native of these very woods.",
        edges: [
          { axis: "wildlife", native: "Its explosive flowers feed native bees; its berries feed birds.", ornamental: "Feeds next to nothing, and smothers the woodland flowers where it escapes." },
          { axis: "care", native: "A slow, well-behaved native groundcover for acid shade.", ornamental: "An escapee that's hard to be rid of." },
        ],
        basis: "USDA NRCS; Lady Bird Johnson Wildflower Center.",
      },
      {
        plantId: "arctostaphylos-uva-ursi",
        why: "For a tough evergreen mat in sun or a dry bank, bearberry trails glossy leaves, pink spring bells and red berries where periwinkle would never hold.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; thrives on poor, sandy, exposed ground.", ornamental: "Wants moist shade, and invades it." },
          { axis: "wildlife", native: "Early flowers feed queen bumblebees; berries feed birds and bears.", ornamental: "Little wildlife value." },
        ],
        basis: "USDA NRCS; Xerces Society.",
      },
    ],
    "pachysandra-terminalis": [
      {
        plantId: "polystichum-acrostichoides",
        why: "For an evergreen carpet under trees, a colony of Christmas fern holds its dark fronds all winter — living texture in place of a monoculture, and shelter for the leaf-litter's small life.",
        edges: [
          { axis: "wildlife", native: "Cover for salamanders, insects and ground-nesting bees.", ornamental: "A monoculture nothing native uses." },
          { axis: "care", native: "Evergreen, slug-proof and undemanding in dry shade.", ornamental: "Runs by stolon into the woodland beyond." },
        ],
        basis: "Mt. Cuba Center; USDA NRCS.",
      },
      {
        plantId: "fragaria-virginiana",
        why: "For a low green mat in sun to part shade, wild strawberry covers ground fast, flowers white in spring and gives up small sweet berries — a groundcover that feeds instead of only spreading.",
        edges: [
          { axis: "wildlife", native: "Feeds pollinators, then birds and mammals; a host for several butterflies.", ornamental: "Little to no wildlife value." },
          { axis: "care", native: "Drought-tough once knit together.", ornamental: "A green blank that creeps into the woods." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
    ],
    "miscanthus-sinensis": [
      {
        plantId: "schizachyrium-scoparium",
        why: "For a fine-textured clumping grass that colours in fall, little bluestem turns copper and stands all winter — a prairie native that won't seed itself down the roadside the way maiden grass does.",
        edges: [
          { axis: "water", native: "None once established; roots plunge five feet.", ornamental: "Tough too — which is how it escapes into wild grassland." },
          { axis: "wildlife", native: "Hosts skipper butterflies; shelters ground-nesting birds through winter.", ornamental: "Feeds little native, and carries fire where it invades." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "carex-pensylvanica",
        why: "For a soft, fine, low fountain in shade, Pennsylvania sedge makes a flowing carpet — the movement people want from an ornamental grass, on a native that belongs in the North Woods.",
        edges: [
          { axis: "wildlife", native: "A larval host for several skippers; cover for small ground life.", ornamental: "Feeds nothing native." },
          { axis: "care", native: "Drought-tough once knit together; mow it once a year or never.", ornamental: "A big clump that seeds itself around." },
        ],
        basis: "Mt. Cuba Center; Lady Bird Johnson Wildflower Center.",
      },
    ],
    "iris-pseudacorus": [
      {
        plantId: "lobelia-cardinalis",
        why: "For scarlet at the water's edge, cardinal flower sends up spikes of pure red the hummingbirds cross the garden for — where the yellow flag only chokes the margin into a single-species mat.",
        edges: [
          { axis: "wildlife", native: "A hummingbird magnet and swallowtail nectar.", ornamental: "Feeds little, and its rhizomes crowd every other marsh plant out." },
          { axis: "care", native: "A well-behaved clump for a pond edge or rain garden.", ornamental: "A banned wetland invader in a growing list of states." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "eutrochium-maculatum",
        why: "For stately height in a damp spot, spotted Joe-Pye weed lifts dusky-pink flower heads to head height, alive with butterflies through late summer.",
        edges: [
          { axis: "wildlife", native: "One of the great late-summer nectar plants for butterflies and bees; a host for several moths.", ornamental: "A wildlife dead end that takes the wet edge over." },
          { axis: "care", native: "A clumping native of wet meadows that stays put.", ornamental: "Invasive, and toxic to grazing animals." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
    "acer-platanoides": [
      {
        plantId: "acer-saccharum",
        why: "Sugar maple is the shade tree the Norway maple imitates — the same dense crown and clean trunk, with the real fire of a Northern autumn and a living food web underneath.",
        edges: [
          { axis: "water", native: "Deep-rooted and self-reliant once established.", ornamental: "Shallow greedy roots that bare the ground beneath it." },
          { axis: "disease", native: "Long-lived and broadly sound in cool country.", ornamental: "Prone to girdling roots and verticillium wilt with age." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; its seed and sap feed more.", ornamental: "Casts shade so dense little grows below it." },
        ],
        basis: "Morton Arboretum; Penn State Extension.",
      },
      {
        plantId: "acer-rubrum",
        why: "For quicker shade, red maple gives it — the same clean crown and scarlet fall — and feeds the food web the Norway maple starves.",
        edges: [
          { axis: "disease", native: "Broadly trouble-free; no bare circle of dead ground beneath it.", ornamental: "Girdling roots and verticillium wilt with age." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species.", ornamental: "Shade so dense the ground beneath it is bare." },
        ],
        basis: "Morton Arboretum; Penn State Extension.",
      },
    ],
    "pyrus-calleryana": [
      {
        plantId: "amelanchier-laevis",
        why: "For the week of white spring blossom, Allegheny serviceberry gives it early, then sweet June berries the birds strip and glowing autumn colour — on a tree whose branches don't shear off in a storm.",
        edges: [
          { axis: "disease", native: "Sound branching; no habit of splitting apart.", ornamental: "Weak crowded branches that break in wind; fire-blight prone." },
          { axis: "wildlife", native: "Berries feed dozens of bird species; a host for many moths and butterflies.", ornamental: "Hard low-value fruit, and thorny invasive seedlings." },
        ],
        basis: "Morton Arboretum; Penn State Extension.",
      },
    ],
    "euonymus-alatus": [
      {
        plantId: "ilex-verticillata",
        why: "If it was the autumn fire you wanted, winterberry gives red twice over — and holds a blaze of scarlet berries into the snow that the burning bush can't match.",
        edges: [
          { axis: "wildlife", native: "Berries feed robins, waxwings and more deep into winter.", ornamental: "Seeds spread into the woods; feeds little of value." },
          { axis: "disease", native: "A trouble-free native wetland-edge shrub.", ornamental: "A shade-casting thicket-former banned in several states." },
        ],
        basis: "Missouri Botanical Garden; Penn State Extension.",
      },
      {
        plantId: "physocarpus-opulifolius",
        why: "For dry ground and full sun, ninebark carries burgundy and gold leaves right through the season — the colour the burning bush only manages for a week.",
        edges: [
          { axis: "water", native: "Drought-proof once set; takes poor soil and neglect.", ornamental: "Undemanding, and spreads from where it's planted." },
          { axis: "wildlife", native: "Feeds specialist bees and native moths; seed heads feed birds.", ornamental: "Little native wildlife value." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Morton Arboretum.",
      },
      {
        plantId: "vaccinium-angustifolium",
        why: "For a low, tidy shrub that burns scarlet in fall, lowbush blueberry does it — and hands you a crop of sweet berries the burning bush never could.",
        edges: [
          { axis: "wildlife", native: "Flowers feed early bees; berries feed birds, bears and people; a heavy caterpillar host.", ornamental: "Bird-spread into the woods; feeds little of value." },
        ],
        basis: "Morton Arboretum; USDA NRCS.",
      },
    ],
    "berberis-thunbergii": [
      {
        plantId: "physocarpus-opulifolius",
        why: "For a tough coloured-leaf hedge, ninebark gives the gold and burgundy of the barberry cultivars as a full native shrub — thorns and tick-thickets not included.",
        edges: [
          { axis: "disease", native: "An open, airy shrub with no association with tick-borne disease.", ornamental: "Its dense low canopy shelters more Lyme-infected ticks than woods without it." },
          { axis: "wildlife", native: "Feeds specialist bees and native moths.", ornamental: "Little native wildlife value; seeds into the woods." },
        ],
        basis: "Connecticut Agricultural Experiment Station; Morton Arboretum.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-rubra",
        why: "For a big street or lawn shade tree, red oak grows fast to a broad crown, turns russet in fall, and carries the richest food web of any tree in the North Woods.",
        edges: [
          { axis: "wildlife", native: "Feeds over 500 caterpillar species; acorns feed jays, turkeys and mammals.", ornamental: "Feeds almost nothing native." },
          { axis: "disease", native: "Long-lived and sound.", ornamental: "Recurring anthracnose; a heavy allergenic pollen." },
        ],
        basis: "Morton Arboretum; Penn State Extension.",
      },
    ],
    "salix-babylonica": [
      {
        plantId: "salix-discolor",
        why: "For a fast, graceful native by water, pussy willow throws out the silver catkins of late winter that feed the first bees of the year — where the weeping willow only finds your drains.",
        edges: [
          { axis: "wildlife", native: "Hosts nearly 400 caterpillar species; its catkins are a vital first pollen source.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A resilient native of wet ground.", ornamental: "Greedy roots that wreck drains; brittle, short-lived and rot-prone." },
        ],
        basis: "Morton Arboretum; Xerces Society.",
      },
      {
        plantId: "populus-tremuloides",
        why: "For a shimmering fast tree with movement and light, quaking aspen trembles at the least breeze and turns pure gold in fall — a keystone of the North Woods, not a liability by the pond.",
        edges: [
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; buds and bark feed grouse, hare and more.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A tough pioneer of cold country.", ornamental: "Brittle, drain-seeking and rotten at heart within forty years." },
        ],
        basis: "Morton Arboretum; U.S. Forest Service.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-serotina",
        why: "For spring blossom that feeds the whole wood, black cherry hangs white flower then dark fruit the birds strip — and lives for a century where the ornamental cherry is spent in twenty years.",
        edges: [
          { axis: "wildlife", native: "Hosts over 300 caterpillar species; its fruit feeds dozens of birds.", ornamental: "Raises almost none of the next generation of insects." },
          { axis: "disease", native: "Tough and long-lived.", ornamental: "Short-lived and prone to canker, rot and borers." },
        ],
        basis: "Morton Arboretum; Penn State Extension.",
      },
    ],
    "betula-pendula-ornamental": [
      {
        plantId: "betula-papyrifera",
        why: "For a white-barked birch on a Northern lawn, paper birch is the real thing — chalk-white peeling bark and gold fall colour, on a native that stands up to the borer far better than the European tree.",
        edges: [
          { axis: "disease", native: "Northern-hardy and far more borer-resistant in its own climate.", ornamental: "Killed young, top-down, by the bronze birch borer here." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; its seed feeds redpolls and siskins.", ornamental: "Feeds little native." },
        ],
        basis: "Morton Arboretum; U.S. Forest Service.",
      },
    ],
    "picea-pungens": [
      {
        plantId: "pinus-strobus",
        why: "For a big, soft, fast specimen evergreen, eastern white pine gives blue-green needles and real presence — a Northern native at home in the climate, where the blue spruce increasingly is not.",
        edges: [
          { axis: "disease", native: "Adapted to the region and broadly healthy in it.", ornamental: "Failing to needlecast and canker outside its dry mountain home." },
          { axis: "wildlife", native: "Hosts over 200 caterpillar species; its seed feeds crossbills, chickadees and more.", ornamental: "Feeds little native." },
        ],
        basis: "Morton Arboretum; Missouri Botanical Garden.",
      },
    ],
    "chrysanthemum-morifolium": [
      {
        plantId: "symphyotrichum-novae-angliae",
        why: "For the same mound of autumn colour that actually feeds something, New England aster covers itself in purple daisies just when the pollinators need a last meal.",
        edges: [
          { axis: "wildlife", native: "A top late nectar source; a larval host for the pearl crescent and many moths.", ornamental: "Little nectar, no seed, no host value." },
          { axis: "care", native: "A perennial that returns and spreads on its own.", ornamental: "Planted and binned in a single season." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "solidago-speciosa",
        why: "For a spire of gold in the same slot, showy goldenrod stands tall and hums with bees — the nectar bar the mums only look like.",
        edges: [
          { axis: "wildlife", native: "One of the best late nectar and pollen plants; hosts over 100 caterpillar species.", ornamental: "Little nectar, no seed, no host value." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
      {
        plantId: "symphyotrichum-laeve",
        why: "For clouds of blue rather than purple, smooth blue aster gives the same late daisies on tidy arching stems, alive with bees and butterflies.",
        edges: [
          { axis: "wildlife", native: "Late nectar for pollinators; a host for the pearl crescent and other butterflies.", ornamental: "Feeds almost nothing." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
  },

  "pnw": {
    "hemerocallis-fulva": [
      {
        plantId: "aquilegia-formosa",
        why: "For easy summer colour in sun or part shade, western columbine dangles scarlet-and-gold lanterns the returning hummingbirds head straight for — where the daylily gives a day of bloom and the pollinators nothing.",
        edges: [
          { axis: "wildlife", native: "Nectar for hummingbirds and long-tongued bees; a host for the columbine duskywing.", ornamental: "Little a native can use." },
          { axis: "care", native: "Self-sows gently and asks for nothing.", ornamental: "Runs into sterile clumps that give the garden no life." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "eriophyllum-lanatum",
        why: "For a mound of gold in a hot dry border, Oregon sunshine covers itself in daisies through the summer and hums with native bees — on a fraction of the daylily's water.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; wants poor, dry, sunny ground.", ornamental: "Thirstier, and feeds nothing back." },
          { axis: "wildlife", native: "A favourite of native bees and butterflies; a host for painted ladies.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "hosta": [
      {
        plantId: "dicentra-formosa",
        why: "For soft ferny foliage and a long bloom in shade, Pacific bleeding heart spreads a blue-green carpet hung with pink lockets from spring into summer — far more than a hosta gives, and none of the slug holes.",
        edges: [
          { axis: "wildlife", native: "Nectar for early bumblebees; the sole host of Clodius parnassian butterflies.", ornamental: "Nothing native eats it." },
          { axis: "care", native: "Spreads into a lush shade colony on its own.", ornamental: "Chewed ragged by slugs by midsummer." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "polystichum-munitum",
        why: "For bold evergreen structure in dry shade, western sword fern stands in dark two-foot fronds all year where the hosta dies back to bare ground.",
        edges: [
          { axis: "care", native: "Evergreen, slug-proof and famously tough in dry shade.", ornamental: "A slug magnet, gone by winter." },
          { axis: "wildlife", native: "Cover for the small life of the forest floor.", ornamental: "Little native value." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
    ],
    "vinca-minor": [
      {
        plantId: "linnaea-borealis",
        why: "For a fine evergreen carpet in cool shade, twinflower threads a delicate mat hung with paired pink bells — a woodland native that belongs under the firs where periwinkle only invades.",
        edges: [
          { axis: "wildlife", native: "Its fragrant twin flowers feed small native bees.", ornamental: "Feeds next to nothing, and smothers the ground flora it escapes into." },
          { axis: "care", native: "A slow, well-behaved native of the forest floor.", ornamental: "An escapee that's hard to remove from the woods." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
      {
        plantId: "maianthemum-dilatatum",
        why: "For a lush groundcover in moist shade, false lily-of-the-valley lays down glossy heart-shaped leaves and white spring spikes — a fast native carpet in place of an escaping one.",
        edges: [
          { axis: "wildlife", native: "Flowers feed small pollinators; berries feed birds.", ornamental: "Little native value; invades the woodland understorey." },
          { axis: "care", native: "Spreads readily into shade cover and stays in the woods where it belongs.", ornamental: "Creeps out of the bed and into the forest." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
    ],
    "miscanthus-sinensis": [
      {
        plantId: "deschampsia-cespitosa",
        why: "For a fine airy fountain of a grass, tufted hairgrass throws up a golden summer haze of flower — the movement people plant maiden grass for, on a Northwest native that stays put.",
        edges: [
          { axis: "wildlife", native: "Cover and seed for birds; a host for several skippers and satyrs.", ornamental: "Feeds little native, and seeds into wild grassland." },
          { axis: "care", native: "A tough, adaptable native of sun or part shade, wet or dry.", ornamental: "Escapes the garden and carries fire." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "festuca-roemeri",
        why: "For a smaller blue-green tuft, Roemer's fescue makes a neat drought-proof clump — the fine grass of the Northwest prairie, in place of an Asian one that jumps the fence.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Tough too — which is how it invades." },
          { axis: "wildlife", native: "A larval host for several prairie butterflies; cover for ground life.", ornamental: "Little native value." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "rosa-hybrids": [
      {
        plantId: "rosa-nutkana",
        why: "For a shrub rose with a real scent, Nootka rose gives big single pink flowers the bees can actually get into, then scarlet hips the birds take — and it never needs the spray a hybrid tea does.",
        edges: [
          { axis: "disease", native: "A tough native that shrugs off the black spot and mildew that plague garden roses.", ornamental: "Prone to black spot and mildew; often kept going only by spraying." },
          { axis: "wildlife", native: "Open flowers feed native bees; hips feed birds; a host for many moths.", ornamental: "Double blooms lock pollinators out; little wildlife value." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "prunus-laurocerasus": [
      {
        plantId: "vaccinium-ovatum",
        why: "For a glossy evergreen hedge you clip, evergreen huckleberry gives the same dark polished leaves — plus bronze new growth, white bells and late berries, on a shrub that doesn't seed into the woods.",
        edges: [
          { axis: "disease", native: "Clean, slow and long-lived in shade.", ornamental: "Riddled by the shot-hole fungus; leaves give off cyanide." },
          { axis: "wildlife", native: "Flowers feed bees; the berries feed birds and people alike.", ornamental: "Bird-spread into forest; feeds little of value." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
      {
        plantId: "holodiscus-discolor",
        why: "For a fast screen rather than a clipped wall, oceanspray shoots up to hedge height and drips with cream summer plumes, then holds tan seed-heads through winter.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established; wants no summer water.", ornamental: "Thirsty — it wilts and browns in a dry Northwest summer." },
          { axis: "wildlife", native: "A larval host for many moths and butterflies; a bee magnet in bloom.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "ilex-aquifolium": [
      {
        plantId: "berberis-aquifolium",
        why: "For a spiny, glossy evergreen with berries, tall Oregon grape is the native holly-in-all-but-name: holly-like leaves, yellow spring flowers, and blue fruit the birds take.",
        edges: [
          { axis: "water", native: "Drought-proof once established; takes sun or dry shade.", ornamental: "Tolerant too — and spreads far into the forest from a garden." },
          { axis: "wildlife", native: "Early flowers feed queen bumblebees; berries feed birds.", ornamental: "Berries feed birds, which is exactly how it invades." },
        ],
        basis: "Oregon State University; WA Noxious Weed Control Board.",
      },
      {
        plantId: "gaultheria-shallon",
        why: "For evergreen cover under trees, salal makes a lush, leathery, knee-high thicket with pink bells and edible berries — the Northwest's own understorey, not an escapee from it.",
        edges: [
          { axis: "wildlife", native: "Flowers feed hummingbirds and bees; berries feed birds, mammals and people.", ornamental: "Bird-spread into native forest, where it shades out the ground flora." },
          { axis: "care", native: "Left alone, it simply fills its space.", ornamental: "Needs pulling from the woods it escapes into." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
    ],
    "hedera-helix": [
      {
        plantId: "gaultheria-shallon",
        why: "For the evergreen carpet ivy is bought for, salal covers shade with leathery green — and stays where you put it instead of climbing and killing the trees.",
        edges: [
          { axis: "wildlife", native: "Nectar for hummingbirds and bees; berries for birds and people.", ornamental: "Smothers the ground and hauls down trees; feeds little here." },
          { axis: "disease", native: "A trouble-free native understorey shrub.", ornamental: "A reservoir for bacterial leaf scorch that infects native trees." },
        ],
        basis: "Oregon State University; Washington Native Plant Society.",
      },
      {
        plantId: "arctostaphylos-uva-ursi",
        why: "For a sunny bank or a wall-top, kinnikinnick lays down a tight evergreen mat with pink bells and red berries — ivy's job, on ground ivy would never take.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; thrives on hot, poor, dry ground.", ornamental: "Prefers moist shade and won't hold a dry sunny bank." },
          { axis: "wildlife", native: "Early flowers feed bees; berries feed birds and bears.", ornamental: "Little wildlife value here." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "buddleja-davidii": [
      {
        plantId: "ribes-sanguineum",
        why: "For an early, showy shrub alive with pollinators, red-flowering currant hangs out its pink spring racemes just as the hummingbirds arrive back — and doesn't seed down the nearest riverbar the way butterfly bush does.",
        edges: [
          { axis: "water", native: "Drought-proof once established; a dry-summer native.", ornamental: "Thirsty, and invades gravelly river bars where it out-competes willows." },
          { axis: "wildlife", native: "Feeds returning hummingbirds and native bees; a larval host besides.", ornamental: "Nectar for adults only; raises no native caterpillars." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "holodiscus-discolor",
        why: "For the same froth of summer nectar on a big sunny shrub, oceanspray drips cream plumes the bees and butterflies swarm — a Northwest native that stays put.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Thirsty, and a listed invader of Northwest river bars." },
          { axis: "wildlife", native: "A larval host for many moths and butterflies as well as a nectar source.", ornamental: "Feeds the adults; hosts no native caterpillars." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-garryana",
        why: "For a great, spreading shade tree, Oregon white oak is the Northwest's own — a slow, magnificent, century-spanning tree whose vanishing savanna carries more life than almost any habitat here.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established; a dry-summer native.", ornamental: "A thirsty street tree." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; its acorns and oak habitat feed a whole community.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "Oregon State University; Morton Arboretum.",
      },
    ],
    "salix-babylonica": [
      {
        plantId: "salix-scouleriana",
        why: "For a fast native willow away from water too, Scouler's willow takes drier ground than most, throws early catkins for the first bees, and feeds a huge web of life.",
        edges: [
          { axis: "wildlife", native: "Hosts around 300 caterpillar species; its catkins are a vital first pollen source.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A tough, adaptable native.", ornamental: "Greedy roots that wreck drains; brittle and short-lived." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "populus-trichocarpa",
        why: "For a tall, fast tree by water, black cottonwood shoots up into a fragrant giant whose spring balsam scents the whole valley — a keystone of Northwest rivers, not a threat to the plumbing.",
        edges: [
          { axis: "wildlife", native: "Hosts around 300 caterpillar species; a pillar of riverside life.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A vigorous native of wet ground.", ornamental: "Drain-seeking, brittle and rotten at heart within decades." },
        ],
        basis: "Oregon State University; U.S. Forest Service.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-emarginata",
        why: "For spring blossom that feeds the wood, bitter cherry hangs clusters of white flower then small red fruit the birds strip — a Northwest native that raises the caterpillars the ornamental cherry can't.",
        edges: [
          { axis: "wildlife", native: "Hosts around 200 caterpillar species; its fruit feeds many birds.", ornamental: "Raises almost none of the next generation of insects." },
          { axis: "water", native: "Drought-tough once established.", ornamental: "Short-lived and prone to canker and rot." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
    "betula-pendula-ornamental": [
      {
        plantId: "betula-papyrifera",
        why: "For white bark on a lawn, paper birch is the native version — chalk-white and peeling, hardier, and far better able to shrug off the borer that kills the European birch here.",
        edges: [
          { axis: "disease", native: "More resistant to the bronze birch borer in its own climate.", ornamental: "Killed young, top-down, by the borer." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species; its seed feeds finches.", ornamental: "Feeds little native." },
        ],
        basis: "Oregon State University; U.S. Forest Service.",
      },
    ],
    "picea-pungens": [
      {
        plantId: "pinus-ponderosa",
        why: "For a big specimen conifer that belongs here, ponderosa pine gives real stature, warm bark that smells of vanilla in the sun, and drought-hardiness the blue spruce can't match east of the mountains.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; a dry-country native.", ornamental: "Struggles and fails to canker and needlecast outside its range." },
          { axis: "wildlife", native: "Hosts around 200 caterpillar species; its seed feeds birds and squirrels.", ornamental: "Feeds little native." },
        ],
        basis: "Oregon State University; Morton Arboretum.",
      },
    ],
    "chrysanthemum-morifolium": [
      {
        plantId: "symphyotrichum-subspicatum",
        why: "For a mound of autumn colour that feeds the last pollinators, Douglas aster covers itself in violet daisies right when little else is flowering.",
        edges: [
          { axis: "wildlife", native: "A key late nectar source; a larval host for several butterflies.", ornamental: "Bred for bloom; little nectar and no seed." },
          { axis: "care", native: "A perennial that returns each year.", ornamental: "Planted and binned in a single season." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
      {
        plantId: "solidago-lepida",
        why: "For gold in the same slot, western goldenrod stands in a haze of bees — the nectar bar the mums only resemble.",
        edges: [
          { axis: "wildlife", native: "One of the best late nectar and pollen plants; a caterpillar host besides.", ornamental: "Little nectar, no seed, no host value." },
        ],
        basis: "Oregon State University; Xerces Society.",
      },
    ],
  },

  "ca-south-coast": {
    "hemerocallis-fulva": [
      {
        plantId: "epilobium-canum",
        why: "For a blaze of late colour in a hot dry border, California fuchsia throws scarlet trumpets just as the hummingbirds fuel up for migration — and asks for none of the water a daylily wants.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; wants poor, dry ground and full sun.", ornamental: "Thirsty in a dry climate, and gives nothing back." },
          { axis: "wildlife", native: "A crucial late-season nectar plant for hummingbirds and bees.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
      {
        plantId: "penstemon-spectabilis",
        why: "For tall, showy spikes in a sunny bed, showy penstemon lifts electric blue-purple flowers alive with bees and hummingbirds — on a fraction of the daylily's water.",
        edges: [
          { axis: "water", native: "Drought-proof once established; a chaparral native.", ornamental: "Thirstier, and a wildlife blank." },
          { axis: "wildlife", native: "Nectar for native bees and hummingbirds; a host for the variable checkerspot.", ornamental: "Feeds little native." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "hosta": [
      {
        plantId: "heuchera-maxima",
        why: "For a bold leafy clump in shade, island alum root is the native coral-bells hostas only imitate — big scalloped evergreen leaves and airy sprays of tiny flowers the bees and hummingbirds work.",
        edges: [
          { axis: "water", native: "Drought-tolerant in shade once established; evergreen year-round.", ornamental: "Thirsty, dies back in winter, and feeds nothing." },
          { axis: "wildlife", native: "Its flower sprays feed native bees and hummingbirds.", ornamental: "Nothing native eats it." },
        ],
        basis: "California Native Plant Society.",
      },
      {
        plantId: "dryopteris-arguta",
        why: "For evergreen texture in dry shade, coastal wood fern holds its fronds through the Californian summer where a hosta would need constant water just to stand up.",
        edges: [
          { axis: "water", native: "Summer-drought-tolerant in shade — rare and valuable in California.", ornamental: "Needs steady water and still collapses in heat." },
          { axis: "wildlife", native: "Cover for the small life of the shaded garden floor.", ornamental: "Little native value." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "vinca-minor": [
      {
        plantId: "symphoricarpos-mollis",
        why: "For a spreading groundcover in dry shade, creeping snowberry knits a low native mat with pink summer bells and white winter berries — cover that belongs in these hills, where periwinkle escapes into them.",
        edges: [
          { axis: "water", native: "Drought-tolerant in shade once established.", ornamental: "Wants moisture, and invades the woodland it escapes into." },
          { axis: "wildlife", native: "Flowers feed native bees; berries feed birds.", ornamental: "Feeds next to nothing native." },
        ],
        basis: "California Native Plant Society.",
      },
      {
        plantId: "fragaria-vesca",
        why: "For a soft green carpet in part shade, woodland strawberry runs into cover as fast as periwinkle, flowers white in spring, and hands out tiny sweet berries.",
        edges: [
          { axis: "wildlife", native: "Feeds pollinators, then birds and mammals; a host for several butterflies.", ornamental: "Little to no wildlife value." },
          { axis: "care", native: "A well-behaved native mat for dappled shade.", ornamental: "An escapee that smothers the ground flora." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
    ],
    "rosa-hybrids": [
      {
        plantId: "rosa-californica",
        why: "For a fragrant shrub rose, California wild rose gives big single pink flowers the bees can reach, scarlet hips the birds strip, and thicket cover for nesting — none of it needing the spray a hybrid tea lives on.",
        edges: [
          { axis: "disease", native: "A tough native that shrugs off the black spot and mildew of garden roses.", ornamental: "Prone to black spot and mildew; kept going by spraying." },
          { axis: "wildlife", native: "Open flowers feed native bees; hips feed birds; a host for many moths and butterflies.", ornamental: "Double blooms shut pollinators out; little wildlife value." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
    ],
    "carpobrotus-edulis": [
      {
        plantId: "eriogonum-parvifolium",
        why: "For holding a coastal bank, seacliff buckwheat does the real job ice plant only pretends to — deep roots that bind sand, and cushions of cream flower right through the dry season.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; a true coastal-bluff native.", ornamental: "Needs no water either — but its heavy shallow mat slips off the slope it's meant to hold." },
          { axis: "wildlife", native: "The one host plant of the endangered El Segundo blue butterfly, and a bee magnet.", ornamental: "Smothers the dune flora those insects depend on." },
        ],
        basis: "California Native Plant Society; Cal-IPC.",
      },
      {
        plantId: "baccharis-pilularis",
        why: "For a fast, tough green bank cover, the prostrate form of coyote brush knits into a dense evergreen mat that takes drought, salt wind and neglect — and actually holds the soil.",
        edges: [
          { axis: "water", native: "Bone-dry-tolerant once established; needs no summer water.", ornamental: "Also unwatered, but a fire-carrying, soil-loosening blanket." },
          { axis: "wildlife", native: "One of the most important late-season nectar plants on the coast for bees and butterflies.", ornamental: "A monoculture that feeds almost nothing native." },
        ],
        basis: "California Native Plant Society; Cal-IPC.",
      },
    ],
    "cynodon-dactylon": [
      {
        plantId: "carex-praegracilis",
        why: "For a real lawn you can walk on and mow low, clustered field sedge makes a soft green turf on a fraction of the water — the native lawn California actually has.",
        edges: [
          { axis: "water", native: "Once established, a fraction of a turf lawn's water through the dry season.", ornamental: "Browns without steady summer irrigation." },
          { axis: "wildlife", native: "Shelters ground-dwelling insects and small life a clipped lawn can't.", ornamental: "Feeds nothing native." },
        ],
        basis: "California Native Plant Society; Lady Bird Johnson Wildflower Center.",
      },
      {
        plantId: "muhlenbergia-rigens",
        why: "For a lawn you look at rather than play on, a sweep of deergrass makes a fountain of green that needs no hose and holds its shape all year.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once rooted; deep-rooted and self-reliant.", ornamental: "A thirsty lawn that browns off in the heat." },
          { axis: "wildlife", native: "Cover and seed for birds; a larval host for several skippers.", ornamental: "A green surface and nothing more." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
    ],
    "pennisetum-setaceum": [
      {
        plantId: "muhlenbergia-rigens",
        why: "For an architectural fountain of a grass, deergrass gives the same arching form at the same size — a Californian native that won't seed into the hills or carry fire down them.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Drought-tough too — and that toughness is what lets it invade and burn." },
          { axis: "wildlife", native: "A larval host for skippers; cover and seed for birds.", ornamental: "Feeds nothing native, and fuels wildfire." },
        ],
        basis: "California Native Plant Society; Cal-IPC.",
      },
      {
        plantId: "stipa-pulchra",
        why: "For a lighter, meadowy grass, purple needlegrass — the state grass — throws up shimmering purple flower-heads in spring and lives for a century.",
        edges: [
          { axis: "water", native: "Deep-rooted and thoroughly drought-proof; California's own bunchgrass.", ornamental: "Fire-carrying and invasive on dry ground." },
          { axis: "wildlife", native: "Larval host for skippers; seed for birds and small mammals.", ornamental: "Little native value." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "cortaderia-selloana": [
      {
        plantId: "muhlenbergia-rigens",
        why: "For a big single specimen grass, deergrass gives the same green fountain at head height — without the saw-edged leaves, the millions of seeds, or the coastline it has swallowed.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Drought-tough, and one of the coast's worst invaders." },
          { axis: "wildlife", native: "A larval host for skippers; cover and seed for birds.", ornamental: "Feeds little native, and its leaves cut." },
        ],
        basis: "California Native Plant Society; Cal-IPC.",
      },
      {
        plantId: "leymus-condensatus",
        why: "For real height and a blue-grey screen, giant wild rye stands as tall as pampas grass — a bold clumping native that holds a slope instead of taking a hillside.",
        edges: [
          { axis: "water", native: "Deep-rooted and drought-proof; takes sun or part shade.", ornamental: "Invasive and seed-heavy on the same dry ground." },
          { axis: "wildlife", native: "Cover for birds and small animals; larval host for skippers.", ornamental: "Little native value." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "nerium-oleander": [
      {
        plantId: "heteromeles-arbutifolia",
        why: "For a big evergreen screen, toyon gives glossy leaves, cream summer flower and the sheets of red winter berry that named Hollywood — everything oleander offers, plus a Christmas display and no poison to children.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Drought-tough too — but poisonous in every part." },
          { axis: "wildlife", native: "Flowers feed butterflies and bees; berries feed cedar waxwings, robins and mockingbirds.", ornamental: "Feeds nothing native, and its nectar and leaves are toxic." },
        ],
        basis: "California Native Plant Society.",
      },
      {
        plantId: "malosma-laurina",
        why: "For a fast, tall, evergreen wall, laurel sumac shoots up into a dense rounded screen with aromatic leaves — the chaparral's own quick cover for a big gap.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; a bone-dry chaparral native.", ornamental: "Drought-tough, and poisonous." },
          { axis: "wildlife", native: "Flowers feed many bees and butterflies; fruit feeds birds.", ornamental: "Feeds nothing native." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-agrifolia",
        why: "For a great evergreen shade tree, coast live oak is the one Southern California grew up under — a broad, dark, century-spanning canopy that anchors more life than any other local tree.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established; a true dry-summer native.", ornamental: "A thirsty street tree in a dry climate." },
          { axis: "wildlife", native: "Hosts around 200 caterpillar species; its acorns fed people and feed wildlife still.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "California Native Plant Society; Morton Arboretum.",
      },
    ],
    "salix-babylonica": [
      {
        plantId: "salix-lasiolepis",
        why: "For a fast native by a pond or a swale, arroyo willow throws early catkins for the first bees and holds a streambank together — where the weeping willow only finds the drains.",
        edges: [
          { axis: "wildlife", native: "Hosts over 200 caterpillar species; a vital early pollen source.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A tough native of California creeks.", ornamental: "Greedy roots that wreck pipes; brittle and short-lived." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
      {
        plantId: "populus-fremontii",
        why: "For a big fast shade tree by water, Fremont cottonwood is the giant of California's rivers — quick, cooling, and the backbone of the wildlife that follows the water.",
        edges: [
          { axis: "wildlife", native: "Hosts around 200 caterpillar species; a pillar of riverside life.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A vigorous native of wet ground.", ornamental: "Drain-seeking, brittle and short-lived." },
        ],
        basis: "California Native Plant Society; U.S. Forest Service.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-ilicifolia",
        why: "For evergreen structure with spring flower, hollyleaf cherry gives glossy holly-like leaves, cream blossom and dark fruit — a chaparral native that flowers and feeds where the ornamental cherry only flowers.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Thirsty, short-lived and disease-prone here." },
          { axis: "wildlife", native: "Flowers feed pollinators; fruit feeds birds and mammals; a caterpillar host.", ornamental: "Raises almost no native insects." },
        ],
        basis: "California Native Plant Society.",
      },
    ],
    "chrysanthemum-morifolium": [
      {
        plantId: "symphyotrichum-chilense",
        why: "For a mound of autumn daisies that actually feeds something, Pacific aster spreads into a haze of lavender bloom the late pollinators work.",
        edges: [
          { axis: "wildlife", native: "A late nectar source for bees and butterflies; a caterpillar host.", ornamental: "Bred for bloom; little nectar and no seed." },
          { axis: "care", native: "A perennial that returns and spreads.", ornamental: "Planted and binned in a season." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
      {
        plantId: "solidago-velutina-californica",
        why: "For gold in the same slot, California goldenrod stands alive with bees — the nectar bar the mums only look like.",
        edges: [
          { axis: "water", native: "Drought-tough once established.", ornamental: "A thirsty annual thrown away each year." },
          { axis: "wildlife", native: "A top late nectar and pollen plant; a caterpillar host besides.", ornamental: "Little nectar, no seed, no host value." },
        ],
        basis: "California Native Plant Society; Xerces Society.",
      },
    ],
  },

  "florida-central": {
    "hemerocallis-fulva": [
      {
        plantId: "coreopsis-leavenworthii",
        why: "For easy, tireless yellow in a sunny bed, Leavenworth's tickseed — Florida's state wildflower — blooms nearly year-round and reseeds itself, feeding bees and butterflies the daylily can't.",
        edges: [
          { axis: "wildlife", native: "Nectar for bees and butterflies; seed for small birds.", ornamental: "Little a native can use; no caterpillars." },
          { axis: "care", native: "A self-sowing native that thrives on neglect.", ornamental: "Runs into sterile clumps and gives nothing back." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "liatris-gracilis",
        why: "For a vertical accent in a dry border, slender blazing star sends up wands of purple every fall that butterflies and bees swarm.",
        edges: [
          { axis: "water", native: "Drought-proof once established; thrives on dry sand.", ornamental: "Thirstier, and a wildlife blank." },
          { axis: "wildlife", native: "A magnet for butterflies and bees; seed for birds.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "UF/IFAS; Xerces Society.",
      },
    ],
    "miscanthus-sinensis": [
      {
        plantId: "muhlenbergia-capillaris",
        why: "For a fine grass that turns to a cloud of colour, pink muhly grass fogs rose-pink each autumn — the drama people buy maiden grass for, on a Florida native that won't seed into the scrub.",
        edges: [
          { axis: "wildlife", native: "Cover and seed for birds; a host for several skippers.", ornamental: "Feeds little native, and escapes into wild ground." },
          { axis: "water", native: "Thoroughly drought- and salt-proof once established.", ornamental: "Tough too — which is how it invades." },
        ],
        basis: "UF/IFAS; Xerces Society.",
      },
      {
        plantId: "tripsacum-dactyloides",
        why: "For a big architectural clump, Fakahatchee grass throws up arching four-foot fountains of green — a bold native of the same wet-to-dry ground, in place of an Asian grass gone wild.",
        edges: [
          { axis: "wildlife", native: "A larval host for skippers and the tiny 'grass-eating' satyrs; cover for birds.", ornamental: "Little native value; a listed invader." },
          { axis: "care", native: "Tough and adaptable from wet to dry, sun to part shade.", ornamental: "Seeds itself around the garden and beyond." },
        ],
        basis: "UF/IFAS; Xerces Society.",
      },
    ],
    "syagrus-romanzoffiana": [
      {
        plantId: "sabal-palmetto",
        why: "For a feather of a palm on a street or a lawn, the cabbage palm — Florida's state tree — is the native the queen palm stands in for: hurricane-firm, salt- and drought-proof, and it feeds a whole community.",
        edges: [
          { axis: "wildlife", native: "Its flowers feed clouds of bees; its fruit feeds birds and mammals; its boots shelter ferns and wildlife.", ornamental: "Feeds little native." },
          { axis: "disease", native: "Tough and self-sufficient in Florida sand.", ornamental: "Chronically short of manganese and potassium; prone to lethal bronzing and trunk-snapping deficiency." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "ligustrum-sinense": [
      {
        plantId: "ilex-vomitoria",
        why: "For a fast evergreen hedge you clip, yaupon holly gives the same dense wall — glossy small leaves, red winter berries the birds eat — as a Florida native that won't seed into every fencerow.",
        edges: [
          { axis: "wildlife", native: "Flowers feed bees; berries feed many birds through winter.", ornamental: "A bird-spread invader that crowds the understorey out; little on offer." },
          { axis: "care", native: "Drought- and salt-proof; takes hard clipping.", ornamental: "One of the Southeast's worst invaders, and a heavy allergen in bloom." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "viburnum-obovatum",
        why: "For a small-leaved evergreen screen that flowers, Walter's viburnum foams with white spring bloom and feeds a crowd — a tidy native in place of a hedge that jumps the fence.",
        edges: [
          { axis: "wildlife", native: "Early nectar for bees and butterflies; berries for birds.", ornamental: "Little native value, and invasive." },
          { axis: "care", native: "Drought-proof once established; clips to a formal hedge.", ornamental: "Seeds into floodplains and fencerows across the region." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "cynodon-dactylon": [
      {
        plantId: "mimosa-strigillosa",
        why: "For a real walk-on lawn, sunshine mimosa makes a tough, flat, mow-able green mat dotted with pink powderpuff flowers — a Florida native that takes foot traffic and needs no feeding.",
        edges: [
          { axis: "water", native: "Deep-rooted and drought-proof once established.", ornamental: "Browns without steady irrigation and feeding." },
          { axis: "wildlife", native: "A larval host for several sulphur and skipper butterflies; flowers feed bees.", ornamental: "Feeds nothing native." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "helianthus-debilis",
        why: "For a sunny bank instead of a lawn, beach sunflower spreads into a low carpet that flowers gold every day of the year in the Florida sun.",
        edges: [
          { axis: "water", native: "Thoroughly drought- and salt-proof once established.", ornamental: "A thirsty lawn that browns in the heat." },
          { axis: "wildlife", native: "A constant nectar source for bees and butterflies; seed for birds.", ornamental: "Feeds nothing native." },
        ],
        basis: "UF/IFAS.",
      },
    ],
    "pyrus-calleryana": [
      {
        plantId: "chionanthus-virginicus",
        why: "For clouds of white spring flower on a small tree, fringetree drips fragrant lacy blossom — then blue fruit the birds take — on a native that never splits apart the way a Bradford pear does.",
        edges: [
          { axis: "disease", native: "Sound, slow and structurally safe.", ornamental: "Weak crowded branches that shear off in storms." },
          { axis: "wildlife", native: "Fruit feeds birds; a larval host for sphinx moths.", ornamental: "Low-value fruit and thorny invasive seedlings." },
        ],
        basis: "UF/IFAS; Missouri Botanical Garden.",
      },
      {
        plantId: "viburnum-obovatum",
        why: "For a smaller flowering tree or clipped screen, Walter's viburnum foams with tiny white spring flowers and feeds a crowd — and holds together in a Florida storm.",
        edges: [
          { axis: "water", native: "Drought-proof once established; takes sun or shade.", ornamental: "Weak-wooded and storm-prone." },
          { axis: "wildlife", native: "Early nectar for bees and butterflies; berries for birds.", ornamental: "Little wildlife value, and invasive." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "nandina-domestica": [
      {
        plantId: "ilex-vomitoria",
        why: "For an evergreen hung with red winter berries, yaupon holly gives exactly that — glossy leaves, clip-able to a hedge, and berries the birds can actually eat without being poisoned.",
        edges: [
          { axis: "disease", native: "Berries safe and sought-after by wildlife.", ornamental: "Berries hold cyanide and have killed flocks of cedar waxwings." },
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Drought-tough, and invasive across the Southeast." },
          { axis: "wildlife", native: "Flowers feed bees; berries feed many birds through winter.", ornamental: "Berries poison the birds that eat them; leaves feed nothing." },
        ],
        basis: "UF/IFAS; U.S. Fish & Wildlife Service.",
      },
      {
        plantId: "callicarpa-americana",
        why: "For a shrub with a knockout autumn berry, American beautyberry rings its stems with electric-magenta fruit the birds strip — a wildlife feast where nandina's berries are a hazard.",
        edges: [
          { axis: "disease", native: "Fruit safe and heavily eaten.", ornamental: "Cyanide berries lethal to some birds." },
          { axis: "wildlife", native: "Flowers feed pollinators; berries feed dozens of bird species and mammals.", ornamental: "Poisons birds; a Southeastern invader." },
        ],
        basis: "UF/IFAS; U.S. Fish & Wildlife Service.",
      },
    ],
    "ruellia-simplex": [
      {
        plantId: "salvia-coccinea",
        why: "For tireless colour that actually feeds something, tropical sage throws up scarlet spikes all year that hummingbirds and butterflies work — and it's an easy self-sower you can pull, not a runner you can't.",
        edges: [
          { axis: "water", native: "Drought-tough once established.", ornamental: "Runs and seeds into every damp margin, impossible to remove." },
          { axis: "wildlife", native: "A hummingbird and butterfly favourite; a larval host besides.", ornamental: "Little native value." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "monarda-punctata",
        why: "For a strange and beautiful long bloom, spotted beebalm stacks tiers of spotted flower and pink bracts that are one of the great native nectar sources — and it stays where you sow it.",
        edges: [
          { axis: "water", native: "Drought-proof; thrives on dry sandy ground.", ornamental: "An unstoppable spreader in wet ground." },
          { axis: "wildlife", native: "One of the busiest nectar plants there is for bees and wasps.", ornamental: "Little native value." },
        ],
        basis: "UF/IFAS; Xerces Society.",
      },
    ],
    "cupaniopsis-anacardioides": [
      {
        plantId: "quercus-virginiana",
        why: "For a great, spreading shade tree, Southern live oak is the tree the fast carrotwood was standing in for — a broad, evergreen, storm-firm canopy that outlives the house and feeds a whole community.",
        edges: [
          { axis: "wildlife", native: "Hosts over 400 caterpillar species; its acorns feed jays, turkeys and mammals.", ornamental: "A bird-spread invader, now banned in Florida; feeds little native." },
          { axis: "water", native: "Thoroughly drought- and salt-proof; famously wind-firm.", ornamental: "Tough too — which is exactly how it invades." },
        ],
        basis: "UF/IFAS; Morton Arboretum.",
      },
      {
        plantId: "acer-rubrum",
        why: "For quicker shade with autumn colour, red maple grows fast in the damp ground carrotwood likes, turns red in the Florida winter, and feeds the food web the carrotwood starves.",
        edges: [
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species — the songbirds' larder.", ornamental: "An invasive of hammocks and mangrove edges." },
          { axis: "disease", native: "A trouble-free native of wet and dry ground alike.", ornamental: "Banned for sale in the state." },
        ],
        basis: "UF/IFAS; FLEPPC.",
      },
    ],
  },

  "florida-south": {
    "miscanthus-sinensis": [
      {
        plantId: "tripsacum-dactyloides",
        why: "For a big architectural clump of grass, Fakahatchee grass arches into four-foot green fountains — a bold South Florida native for the same job, in place of an Asian grass that seeds into wild ground.",
        edges: [
          { axis: "wildlife", native: "A larval host for skippers and satyrs; cover and seed for birds.", ornamental: "Feeds little native; a listed invader." },
          { axis: "care", native: "Tough from wet to dry, sun to part shade.", ornamental: "Seeds itself around and beyond the garden." },
        ],
        basis: "UF/IFAS; Xerces Society.",
      },
    ],
    "syagrus-romanzoffiana": [
      {
        plantId: "sabal-palmetto",
        why: "For a feather palm on a street or lawn, the cabbage palm — Florida's state tree — does the queen palm's job and outlasts it: hurricane-firm, salt- and drought-proof, and the backbone of coastal wildlife.",
        edges: [
          { axis: "wildlife", native: "Flowers feed clouds of bees; fruit feeds birds and mammals; its crown shelters a whole community.", ornamental: "Feeds little native." },
          { axis: "disease", native: "Self-sufficient in Florida sand.", ornamental: "Chronically deficient in manganese and potassium, and prone to lethal bronzing." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "ligustrum-sinense": [
      {
        plantId: "morella-cerifera",
        why: "For a fast evergreen privacy hedge, wax myrtle shoots up into a soft aromatic screen in a season — the native that does Chinese privet's job, feeds the winter birds its waxy berries, and doesn't invade the woods.",
        edges: [
          { axis: "wildlife", native: "Its berries are winter fuel for yellow-rumped warblers and more; dense cover for nesting.", ornamental: "A bird-spread invader that shades the understorey out." },
          { axis: "care", native: "Fast, salt- and drought-proof, and clips to a hedge.", ornamental: "One of the Southeast's worst invaders; a heavy allergen." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "myrcianthes-fragrans",
        why: "For a slower, glossy, formal evergreen, Simpson's stopper clips to a fragrant hedge with fine leaves, white flowers and orange berries — a South Florida native that earns its place all year.",
        edges: [
          { axis: "wildlife", native: "Flowers feed pollinators; berries feed mockingbirds and other birds.", ornamental: "Little native value; invasive." },
          { axis: "care", native: "Drought-proof once established; takes sun or shade.", ornamental: "Seeds into every fencerow and floodplain." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "cynodon-dactylon": [
      {
        plantId: "helianthus-debilis",
        why: "For a sunny bank instead of a lawn, beach sunflower spreads into a low carpet that flowers gold every day of the year and shrugs off salt and drought.",
        edges: [
          { axis: "water", native: "Thoroughly drought- and salt-proof once established.", ornamental: "A thirsty lawn that browns in the heat." },
          { axis: "wildlife", native: "A year-round nectar source for bees and butterflies; seed for birds.", ornamental: "Feeds nothing native." },
        ],
        basis: "UF/IFAS.",
      },
      {
        plantId: "muhlenbergia-capillaris",
        why: "For a lawn you look at rather than mow, drifts of pink muhly grass turn to a rose-pink cloud each autumn and need no water once in.",
        edges: [
          { axis: "water", native: "Thoroughly drought- and salt-proof once established.", ornamental: "Browns without steady irrigation." },
          { axis: "wildlife", native: "Cover and seed for birds; larval host for skippers.", ornamental: "A green surface and no more." },
        ],
        basis: "UF/IFAS.",
      },
    ],
    "hibiscus-rosa-sinensis": [
      {
        plantId: "chrysobalanus-icaco",
        why: "For a glossy evergreen hedge, cocoplum clips into a dense green wall with coppery new growth — and hands out white-to-purple plums the birds and you both eat.",
        edges: [
          { axis: "water", native: "Drought- and salt-proof once established.", ornamental: "Thirstier, and pest-prone in a South Florida hedge." },
          { axis: "wildlife", native: "Flowers feed pollinators; fruit feeds birds, mammals and people.", ornamental: "Almost nothing native uses it." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
      {
        plantId: "myrcianthes-fragrans",
        why: "For a fragrant evergreen screen, Simpson's stopper carries glossy leaves, peeling bark, sweet white flowers and orange berries — a South Florida native that earns its place all year.",
        edges: [
          { axis: "water", native: "Drought-proof once established; takes sun or shade.", ornamental: "Needs more water and care to look its best." },
          { axis: "wildlife", native: "Flowers feed pollinators; berries feed mockingbirds and other birds.", ornamental: "Little native value." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "nandina-domestica": [
      {
        plantId: "psychotria-nervosa",
        why: "For a lush evergreen in shade, wild coffee gives deeply-grooved glossy leaves and red berries the birds relish — the shade shrub nandina imitates, without the poison.",
        edges: [
          { axis: "disease", native: "Berries safe and sought-after by wildlife.", ornamental: "Berries hold cyanide, lethal to some birds." },
          { axis: "wildlife", native: "Flowers feed butterflies and bees; berries feed many birds.", ornamental: "Poisons the birds that eat it." },
        ],
        basis: "UF/IFAS; U.S. Fish & Wildlife Service.",
      },
      {
        plantId: "myrcianthes-fragrans",
        why: "For a berrying evergreen in more sun, Simpson's stopper carries the winter red fruit nandina is grown for — as a fragrant native the birds can safely eat.",
        edges: [
          { axis: "disease", native: "Berries safe and heavily eaten.", ornamental: "Cyanide berries dangerous to birds." },
          { axis: "wildlife", native: "Flowers feed pollinators; berries feed mockingbirds and more.", ornamental: "A Southeastern invader that feeds nothing safely." },
        ],
        basis: "UF/IFAS; U.S. Fish & Wildlife Service.",
      },
    ],
    "cupaniopsis-anacardioides": [
      {
        plantId: "bursera-simaruba",
        why: "For a fast, salt-tough shade tree, gumbo limbo grows quickly into a broad canopy with beautiful peeling copper bark — the native that does carrotwood's job and is one of the toughest trees in a hurricane.",
        edges: [
          { axis: "water", native: "Drought- and salt-proof; famously wind-firm.", ornamental: "Tough too — and a bird-spread invader now banned in Florida." },
          { axis: "wildlife", native: "Flowers feed pollinators; fruit feeds migrating birds.", ornamental: "Invades hammocks and mangrove edges; low native value." },
        ],
        basis: "UF/IFAS; FLEPPC.",
      },
      {
        plantId: "coccoloba-diversifolia",
        why: "For a neat evergreen shade tree, pigeon plum gives dense year-round canopy and dark fruit the birds mob — carrotwood's tidiness, on a native of the same hammocks it invades.",
        edges: [
          { axis: "water", native: "Drought- and salt-proof once established.", ornamental: "Salt-tough, and illegal to sell in Florida." },
          { axis: "wildlife", native: "Fruit feeds pigeons, mockingbirds and other birds.", ornamental: "Displaces the native trees birds depend on." },
        ],
        basis: "UF/IFAS; FLEPPC.",
      },
      {
        plantId: "quercus-virginiana",
        why: "For the biggest shade of all, Southern live oak spreads a broad evergreen canopy that outlasts the house — the great native tree the fast carrotwood only stands in for.",
        edges: [
          { axis: "wildlife", native: "Hosts over 400 caterpillar species; its acorns feed a whole community.", ornamental: "A banned, bird-spread invader of hammocks and mangroves." },
          { axis: "water", native: "Drought- and salt-proof, and famously wind-firm.", ornamental: "Tough — which is how it invades." },
        ],
        basis: "UF/IFAS; Morton Arboretum.",
      },
    ],
    "cycas-revoluta": [
      {
        plantId: "zamia-integrifolia",
        why: "For the same stiff, glossy, prehistoric rosette, coontie is the real thing — Florida's own native cycad, and the one and only plant the rare atala butterfly can raise its young on.",
        edges: [
          { axis: "wildlife", native: "The sole host of the atala butterfly, brought back from the brink of extinction with it.", ornamental: "Feeds nothing native." },
          { axis: "disease", native: "A tough, trouble-free native.", ornamental: "Poisonous enough to kill a dog, and a magnet for cycad scale." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
  },

  "france-atlantic": {
    "hosta": [
      {
        plantId: "dryopteris-filix-mas",
        why: "For a big bold clump in shade, male fern unfurls tall arching fronds that hold half the winter — far more presence than a hosta, and none of the slug holes.",
        edges: [
          { axis: "care", native: "Vigorous, near-evergreen and slug-proof in dry shade.", ornamental: "Chewed ragged by slugs by midsummer." },
          { axis: "wildlife", native: "Cover for the small life of the shaded garden.", ornamental: "Nothing native eats it." },
        ],
        basis: "RHS; INPN.",
      },
      {
        plantId: "asplenium-scolopendrium",
        why: "For glossy evergreen strap-leaves that light a dark corner, hart's-tongue fern holds its shine all year where a hosta dies back to bare earth.",
        edges: [
          { axis: "care", native: "Evergreen, slug-proof and happy in deep shade.", ornamental: "A slug target, gone by winter." },
          { axis: "wildlife", native: "Shelter for the small life of walls and shade.", ornamental: "Little native value." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "miscanthus-sinensis": [
      {
        plantId: "deschampsia-cespitosa",
        why: "For a fine airy fountain of a grass, tufted hair-grass throws up a golden summer haze — the movement people plant maiden grass for, on a native that belongs in the meadow rather than escaping into it.",
        edges: [
          { axis: "wildlife", native: "Cover and seed for birds; a host for several meadow butterflies.", ornamental: "Feeds little native, and self-seeds into wild ground." },
          { axis: "care", native: "Tough and adaptable in sun or part shade, wet or dry.", ornamental: "A big clump that seeds itself around." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "rosa-hybrids": [
      {
        plantId: "rosa-arvensis",
        why: "For a scrambling shrub rose with scent, field rose gives loose white single flowers the bees dive into, then red hips for the birds — a hedgerow native that never needs the spray a hybrid tea lives on.",
        edges: [
          { axis: "disease", native: "A tough native that shrugs off the black spot and mildew of garden roses.", ornamental: "Prone to black spot and mildew; kept going by spraying." },
          { axis: "wildlife", native: "Open flowers feed bees; hips feed winter birds; a host for many moths.", ornamental: "Double blooms shut pollinators out; little wildlife value." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "prunus-laurocerasus": [
      {
        plantId: "ilex-aquifolium",
        why: "For a dense evergreen hedge, native holly gives the same glossy year-round wall — clip-able, wildlife-rich, and here it belongs, where the cherry laurel is an escapee heading for the woods.",
        edges: [
          { axis: "disease", native: "Clean and long-lived.", ornamental: "Riddled by shot-hole fungus; its leaves give off cyanide." },
          { axis: "wildlife", native: "Late berries feed thrushes and blackbirds; the holly blue butterfly lays on it.", ornamental: "Bird-spread into woodland, where it shades out the ground flora." },
        ],
        basis: "RHS; INPN.",
      },
      {
        plantId: "corylus-avellana",
        why: "For a fast, informal screen you can lay or coppice, hazel makes a soft green wall in a season, drips catkins in late winter, and drops nuts for the whole wood.",
        edges: [
          { axis: "water", native: "Undemanding and self-reliant once established.", ornamental: "Thirsty, and seeding into the woods beyond the garden." },
          { axis: "wildlife", native: "Its catkins feed early bees; its nuts feed dormice, squirrels and jays.", ornamental: "Feeds little native, and invades." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "rhododendron-ponticum": [
      {
        plantId: "ilex-aquifolium",
        why: "For an evergreen screen that flowers and feeds, native holly gives a dense, glossy, wildlife-rich wall — where pontic rhododendron poisons the ground beneath it and the bees above it.",
        edges: [
          { axis: "disease", native: "Leaves a living understorey beneath it.", ornamental: "Toxic leaf-litter and shade leave bare ground; its nectar poisons honeybees." },
          { axis: "wildlife", native: "Berries feed winter thrushes; host to the holly blue butterfly.", ornamental: "One of the Atlantic west's worst invaders; a wildlife desert beneath." },
        ],
        basis: "RHS; INPN.",
      },
      {
        plantId: "crataegus-monogyna",
        why: "For a flowering screen, hawthorn foams white in May and glows with red haws in autumn — the classic wildlife hedge, where rhododendron gives one show and takes the wood.",
        edges: [
          { axis: "water", native: "Thoroughly self-reliant once established.", ornamental: "A shade-casting invader that leaves poisoned ground." },
          { axis: "wildlife", native: "Feeds hundreds of insect species; its haws feed winter birds.", ornamental: "Feeds almost nothing, and its nectar is toxic to bees." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "buddleja-davidii": [
      {
        plantId: "crataegus-monogyna",
        why: "For a big shrub humming with pollinators, hawthorn's May blossom is a nectar bar the length of a hedge — and unlike butterfly bush it raises the caterpillars too, then feeds the birds its haws.",
        edges: [
          { axis: "water", native: "Self-reliant once established.", ornamental: "Seeds itself onto walls, waste ground and railway ballast." },
          { axis: "wildlife", native: "Nectar for many insects, a larval host for hundreds of moths, haws for winter birds.", ornamental: "Nectar for adults only; raises no native caterpillars." },
        ],
        basis: "RHS; Xerces Society.",
      },
      {
        plantId: "sambucus-nigra",
        why: "For a fast, frothy, flower-and-berry shrub, elder throws plates of cream summer bloom the pollinators cover, then black berries the birds strip — and you can use both.",
        edges: [
          { axis: "water", native: "Fast and undemanding once established.", ornamental: "A self-seeding coloniser of open ground." },
          { axis: "wildlife", native: "Nectar and pollen for insects; berries for two dozen bird species.", ornamental: "Feeds the adults; hosts no native caterpillars." },
        ],
        basis: "RHS; INPN.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-robur",
        why: "For a great park or avenue tree, pedunculate oak is the one to plant past the plane: the slow, vast, thousand-year tree that carries more wildlife than any other in Europe.",
        edges: [
          { axis: "wildlife", native: "Hosts around 400 caterpillar species — the richest food web of any tree here; acorns feed jays and mammals.", ornamental: "Feeds almost nothing native." },
          { axis: "disease", native: "Famously long-lived and sound.", ornamental: "Recurring anthracnose; a heavy, allergenic pollen." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "salix-babylonica": [
      {
        plantId: "salix-caprea",
        why: "For a fast native by water, goat willow throws out the silver 'pussy willow' catkins of late winter that feed the first bees — where the weeping willow only finds the drains.",
        edges: [
          { axis: "wildlife", native: "Hosts around 370 caterpillar species; its early catkins are a vital first pollen source.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A tough, adaptable native.", ornamental: "Greedy roots that wreck drains; brittle and short-lived." },
        ],
        basis: "INPN; RHS.",
      },
      {
        plantId: "populus-tremula",
        why: "For a tall tree with light and movement, aspen shimmers at the least breeze and turns gold in autumn — a keystone of European woods, not a liability by the pond.",
        edges: [
          { axis: "wildlife", native: "Hosts around 260 caterpillar species; a pillar of woodland life.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A vigorous native pioneer.", ornamental: "Drain-seeking, brittle and rotten at heart within decades." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-avium",
        why: "For spring blossom that feeds the wood, wild cherry hangs clouds of white flower then dark fruit the birds strip — and grows into a real tree where the ornamental cherry is spent in twenty years.",
        edges: [
          { axis: "wildlife", native: "Hosts around 300 caterpillar species; its fruit feeds birds and mammals.", ornamental: "Raises almost none of the next generation of insects." },
          { axis: "disease", native: "A vigorous, long-lived native.", ornamental: "Short-lived and prone to canker and rot." },
        ],
        basis: "INPN; RHS.",
      },
      {
        plantId: "prunus-spinosa",
        why: "For blossom on a smaller, tougher scale, blackthorn foams white on bare black twigs in earliest spring, then hangs sloes into winter — the hedgerow tree the ornamental cherry only imitates.",
        edges: [
          { axis: "wildlife", native: "Hosts around 300 caterpillar species; blossom for early bees, sloes for winter birds.", ornamental: "Raises almost no native insects." },
          { axis: "water", native: "Thoroughly self-reliant once established.", ornamental: "Short-lived and disease-prone." },
        ],
        basis: "INPN; RHS.",
      },
    ],
  },

  "france-continental": {
    "miscanthus-sinensis": [
      {
        plantId: "brachypodium-pinnatum",
        why: "For a soft, fine, drought-proof grass on dry limestone ground, tor-grass makes a flowing tuft — the movement of an ornamental grass, on a native of the local dry meadows that won't seed itself into wild ground.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; a grass of thin, dry, chalky soil.", ornamental: "Tough too — which is how it escapes the garden." },
          { axis: "wildlife", native: "A larval host for several meadow butterflies; cover for ground life.", ornamental: "Feeds little native." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "rosa-hybrids": [
      {
        plantId: "rosa-canina",
        why: "For a big fragrant shrub rose, dog rose arches into a thicket of pale single flowers the bees can reach, then scarlet hips for the birds and the kitchen — with none of the black-spot spraying a hybrid tea needs.",
        edges: [
          { axis: "disease", native: "A tough native that shrugs off the diseases of garden roses.", ornamental: "Prone to black spot and mildew; kept going by spraying." },
          { axis: "wildlife", native: "Open flowers feed bees; hips feed winter birds; a host for many moths.", ornamental: "Double blooms shut pollinators out; little wildlife value." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "prunus-laurocerasus": [
      {
        plantId: "ligustrum-vulgare",
        why: "For a clipped semi-evergreen hedge, native wild privet holds its leaves through a mild winter, foams with scented cream flower, and berries for the birds — the country hedge cherry laurel replaced.",
        edges: [
          { axis: "disease", native: "Tough, clean and easily clipped.", ornamental: "Prone to shot-hole fungus; its leaves give off cyanide." },
          { axis: "wildlife", native: "Flowers feed bees and the privet hawk-moth; black berries feed winter birds.", ornamental: "Bird-spread into woodland; feeds little native." },
        ],
        basis: "INPN; RHS.",
      },
      {
        plantId: "cornus-mas",
        why: "For an informal flowering screen, Cornelian cherry lights up bare February with yellow flower, then hangs red edible fruit — a hedge with three seasons where laurel gives green and little else.",
        edges: [
          { axis: "water", native: "Undemanding and drought-tolerant once established.", ornamental: "Thirsty, and seeding beyond the garden." },
          { axis: "wildlife", native: "Its late-winter flowers feed the first bees; its fruit feeds birds and people.", ornamental: "Feeds little native." },
        ],
        basis: "INPN; Missouri Botanical Garden.",
      },
    ],
    "cupressocyparis-leylandii": [
      {
        plantId: "carpinus-betulus",
        why: "For a formal green wall, hornbeam is the classic clipped hedge of the region — dense to the ground, holding coppery leaves right through winter, and a whole woodland's worth of life where Leyland cypress is a dead green screen.",
        edges: [
          { axis: "care", native: "One clip a year and it holds its shape and its winter leaves.", ornamental: "Never stops; browns from the inside where it's cut and won't regrow." },
          { axis: "wildlife", native: "A larval host for many moths; its seed feeds finches.", ornamental: "Shelters and feeds almost nothing." },
        ],
        basis: "RHS; INPN.",
      },
      {
        plantId: "ligustrum-vulgare",
        why: "For a lower clipped hedge, native wild privet makes a fast, dense, semi-evergreen wall that flowers and berries — the hedge, not the dark cypress wall that gives nothing back.",
        edges: [
          { axis: "water", native: "Drought-tolerant and self-reliant once established.", ornamental: "Shallow-rooted and prone to drying out in a dry summer." },
          { axis: "wildlife", native: "Flowers feed bees and hawk-moths; berries feed winter birds.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "buddleja-davidii": [
      {
        plantId: "origanum-vulgare",
        why: "For a haze of summer nectar in a hot dry border, wild marjoram is one of the very best plants there is for butterflies and bees — and a kitchen herb, where butterfly bush is a nectar bar and nothing else.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; wants poor, dry, sunny ground.", ornamental: "Drought-tolerant, but self-seeds into waste ground." },
          { axis: "wildlife", native: "One of the top nectar plants for butterflies and bees, and a larval host besides.", ornamental: "Nectar for adults only; raises no native caterpillars." },
        ],
        basis: "INPN; Xerces Society.",
      },
      {
        plantId: "viburnum-lantana",
        why: "For a big shrub of flower and berry, wayfaring tree carries flat cream flower-heads the pollinators cover, then berries that ripen red to black for the birds.",
        edges: [
          { axis: "water", native: "Drought-tolerant once established; a shrub of dry limestone country.", ornamental: "A self-seeding coloniser of open ground." },
          { axis: "wildlife", native: "Nectar for insects; a larval host for several moths; berries for birds.", ornamental: "Hosts no native caterpillars." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-petraea",
        why: "For a great avenue or park tree, sessile oak is the one to plant past the plane: a vast, long-lived native that carries the richest food web of any tree in the region.",
        edges: [
          { axis: "wildlife", native: "Hosts around 400 caterpillar species; its acorns feed jays, boar and mammals.", ornamental: "Feeds almost nothing native." },
          { axis: "disease", native: "Famously long-lived and sound.", ornamental: "Recurring anthracnose; a heavy, allergenic pollen." },
        ],
        basis: "INPN; RHS.",
      },
    ],
    "prunus-serrulata": [
      {
        plantId: "prunus-mahaleb",
        why: "For fragrant spring blossom on a small tree, St Lucie cherry drips scented white flower then dark fruit the birds take — a tough limestone native where the ornamental cherry is thirsty and short-lived.",
        edges: [
          { axis: "wildlife", native: "Hosts over 300 caterpillar species; blossom for bees, fruit for birds.", ornamental: "Raises almost no native insects." },
          { axis: "water", native: "Thoroughly drought-tolerant once established.", ornamental: "Short-lived and disease-prone." },
        ],
        basis: "INPN; RHS.",
      },
      {
        plantId: "crataegus-laevigata",
        why: "For blossom on a hedge scale, midland hawthorn foams white in May then reddens with haws — the wildlife tree the ornamental cherry only looks like.",
        edges: [
          { axis: "wildlife", native: "Hosts around 200 caterpillar species; nectar for many insects, haws for winter birds.", ornamental: "Raises almost no native insects." },
          { axis: "water", native: "Self-reliant once established.", ornamental: "Short-lived and prone to canker." },
        ],
        basis: "INPN; RHS.",
      },
    ],
  },

  "france-mediterranean": {
    "miscanthus-sinensis": [
      {
        plantId: "brachypodium-retusum",
        why: "For a fine drought-proof grass in a hot dry garden, Mediterranean false brome makes a low tufted sward that greens with the first rain — a garrigue native for the ornamental-grass look, that never wants the water maiden grass does.",
        edges: [
          { axis: "water", native: "Bone-dry-tolerant; the backbone grass of the garrigue.", ornamental: "Thirsty in a Mediterranean summer, and seeds into wild ground." },
          { axis: "wildlife", native: "A larval host for several grass-feeding butterflies; cover for ground life.", ornamental: "Feeds little native." },
        ],
        basis: "INPN.",
      },
    ],
    "prunus-laurocerasus": [
      {
        plantId: "viburnum-tinus",
        why: "For a glossy evergreen hedge that flowers in winter, laurustinus carries dark leaves, pink-white flower from autumn to spring, and metallic-blue berries — a Mediterranean native that never needs the water cherry laurel drinks here.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Thirsty in the Mediterranean heat, and prone to scorch and shot-hole." },
          { axis: "wildlife", native: "Winter flower feeds early bees; berries feed birds.", ornamental: "Feeds little native, and struggles with the dry summer." },
        ],
        basis: "INPN; RHS.",
      },
      {
        plantId: "pistacia-lentiscus",
        why: "For a dense, aromatic, clip-able evergreen, mastic makes a glossy dark hedge that thrives on drought and sea wind — the maquis shrub that does laurel's job without a drop of extra water.",
        edges: [
          { axis: "water", native: "Bone-dry-tolerant; a true maquis native.", ornamental: "Needs regular water to survive a Mediterranean summer." },
          { axis: "wildlife", native: "Its resin and red-to-black fruit feed a long list of birds and insects.", ornamental: "Feeds little native here." },
        ],
        basis: "INPN.",
      },
    ],
    "carpobrotus-edulis": [
      {
        plantId: "dorycnium-pentaphyllum",
        why: "For a low, tough, sun-baked groundcover, badassi spreads into a soft grey-green cushion dotted with cream pea-flowers — a garrigue native that binds dry ground where ice plant only smothers it.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; wants poor, stony, dry ground.", ornamental: "Unwatered too — but a soil-loosening mat that slides off the slope." },
          { axis: "wildlife", native: "A legume: its flowers feed bees, and it hosts blue butterflies.", ornamental: "Smothers the coastal flora those insects need." },
        ],
        basis: "INPN; Conservatoire du littoral.",
      },
      {
        plantId: "helichrysum-stoechas",
        why: "For a silver, sun-loving mat on a dry bank, everlasting lays down aromatic grey foliage and curry-scented yellow flower — a coastal native that holds the sand ice plant sheds.",
        edges: [
          { axis: "water", native: "Thoroughly drought- and salt-proof.", ornamental: "A heavy shallow mat that loosens the dune it sits on." },
          { axis: "wildlife", native: "Its flowers feed bees and butterflies through the dry season.", ornamental: "A monoculture that feeds almost nothing native." },
        ],
        basis: "INPN; Conservatoire du littoral.",
      },
    ],
    "cupressocyparis-leylandii": [
      {
        plantId: "rhamnus-alaternus",
        why: "For a fast evergreen screen, Mediterranean buckthorn shoots up into a dense glossy wall that takes drought and clipping — the maquis native that does the Leyland's job and feeds the birds besides.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "Thirsty, and browns from the inside in the heat." },
          { axis: "wildlife", native: "Flowers feed bees; black berries feed warblers and other birds.", ornamental: "A dark screen that feeds almost nothing." },
        ],
        basis: "INPN.",
      },
      {
        plantId: "phillyrea-angustifolia",
        why: "For a narrow evergreen hedge, phillyrea makes a fine-leaved dark-green wall, easily clipped, that shrugs off the driest summer — a maquis native where the cypress needs help to survive one.",
        edges: [
          { axis: "water", native: "Bone-dry-tolerant; a true garrigue shrub.", ornamental: "Struggles and browns in prolonged Mediterranean drought." },
          { axis: "wildlife", native: "Flowers feed bees; blue-black fruit feeds birds.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "INPN.",
      },
    ],
    "platanus-x-hispanica": [
      {
        plantId: "quercus-ilex",
        why: "For a great evergreen shade tree, holm oak is the dark, broad, drought-proof canopy of the Mediterranean itself — the tree that belongs where the plane is only watered into place.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof once established.", ornamental: "A thirsty tree in a dry land." },
          { axis: "wildlife", native: "Hosts around 400 caterpillar species; its acorns feed a whole community.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "INPN; Morton Arboretum.",
      },
      {
        plantId: "quercus-pubescens",
        why: "For a deciduous shade tree with autumn warmth, downy oak spreads a broad drought-hardy crown that holds its russet leaves into winter — a hillside native carrying the region's richest food web.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; a dry-country native.", ornamental: "Thirsty, and prone to anthracnose." },
          { axis: "wildlife", native: "Hosts around 400 caterpillar species; acorns for jays, boar and mammals.", ornamental: "Feeds almost nothing native." },
        ],
        basis: "INPN; Morton Arboretum.",
      },
    ],
  },

  "france-alpine": {
    "lupinus-polyphyllus": [
      {
        plantId: "anthyllis-vulneraria",
        why: "For the cottage-lupin look in a mountain border — spikes of pea-flower over ferny leaves — kidney vetch gives it in gold, and unlike the garden lupine it belongs in the meadow instead of taking it over.",
        edges: [
          { axis: "wildlife", native: "The sole larval host of the small blue butterfly, and a favourite of mountain bees.", ornamental: "Nectar only, and it crowds out the very meadow flowers those insects need." },
          { axis: "care", native: "A meadow native that keeps its place.", ornamental: "Enriches the thin soil and spreads until the wildflowers are gone." },
        ],
        basis: "INPN; Xerces Society.",
      },
      {
        plantId: "lotus-corniculatus",
        why: "For low colour through a mountain meadow, bird's-foot trefoil scatters egg-yolk flowers all summer — a native legume that feeds the meadow rather than fertilising it into ruin.",
        edges: [
          { axis: "water", native: "Drought-tough and self-reliant on thin, poor ground.", ornamental: "Its nitrogen-fixing roots enrich soil the meadow needs poor." },
          { axis: "wildlife", native: "A larval host for the common blue and many other butterflies; heavy with bees.", ornamental: "Feeds adults, but replaces the flora the caterpillars depend on." },
        ],
        basis: "INPN; Xerces Society.",
      },
    ],
    "cotoneaster-horizontalis": [
      {
        plantId: "vaccinium-vitis-idaea",
        why: "For a low evergreen with red berries, cowberry makes a neat glossy mat with white bells and tart red fruit — a mountain native that stays put where cotoneaster jumps the wall into the hills.",
        edges: [
          { axis: "wildlife", native: "Flowers feed bees; berries feed birds and people.", ornamental: "Bird-spread into limestone screes, where it's a listed invader." },
          { axis: "care", native: "A slow, well-behaved evergreen groundcover.", ornamental: "Needs pulling from the wild ground it escapes into." },
        ],
        basis: "INPN.",
      },
      {
        plantId: "juniperus-communis",
        why: "For an evergreen with berries and structure, common juniper gives blue-black cones and a tough spiny frame that takes the hardest ground — the native that does cotoneaster's job without invading the mountain.",
        edges: [
          { axis: "water", native: "Thoroughly drought-proof; takes the poorest, most exposed ground.", ornamental: "A bird-spread invader of exactly that open habitat." },
          { axis: "wildlife", native: "Its cones feed birds; it hosts several specialist moths.", ornamental: "Feeds birds — which is how it spreads — and little else." },
        ],
        basis: "INPN.",
      },
    ],
    "salix-babylonica": [
      {
        plantId: "salix-caprea",
        why: "For a fast native in a mountain garden or by a stream, goat willow throws out the silver catkins of late winter that feed the valley's first bees — a keystone of the uplands, not a threat to the drains.",
        edges: [
          { axis: "wildlife", native: "Hosts around 350 caterpillar species; its early catkins are a vital first pollen source.", ornamental: "Feeds little native." },
          { axis: "disease", native: "A hardy native of cold country.", ornamental: "Greedy, drain-seeking roots; brittle and short-lived." },
        ],
        basis: "INPN; RHS.",
      },
    ],
  },
};
