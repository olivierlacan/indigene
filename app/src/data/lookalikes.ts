// The "that isn't the one" dataset — the impostors that get planted, bought and
// admired in place of the natives on our lists, and how to tell them apart
// standing in front of them.
//
// Two parts, both auditable in this one file the way a plant row is:
//
//   1. LOOKALIKES — the catalog. Each impostor described once: what it is,
//      where it's really from, and why it keeps being mistaken for something
//      else. A Callery pear is a Callery pear in every region, so the catalog
//      is shared; only the ties differ.
//
//   2. CONFUSIONS — the ties, keyed by region id, then by *native* plant id,
//      then a list of links. Keyed by region because the same plant is not the
//      same story in two places: common ivy is a listed invasive in North
//      America and an ordinary native climber in Atlantic France, where it's on
//      our own roster. That's why `status` lives on the tie, not the catalog.
//
// What earns a row here:
//   - Real people really mix these two up — at a nursery bench, on a verge, in
//     their own garden. Not "a non-native plant we disapprove of".
//   - There is something you can *check*: a smell, a thorn, a hollow twig, a
//     leaf stalk that bleeds white. If the only difference needs a hand lens
//     and a key, it isn't a tell and it doesn't ship.
//   - A citable source stands behind both the tells and the plant's status.
//
// And what doesn't: a tone of moral panic. Japanese maple is not invasive
// anywhere near us, Douglas-fir is a magnificent tree at home in Oregon, and
// death camas is as native to a Cascade meadow as the camas beside it. The
// status word on each tie says which is which, so the section can be useful
// without being a sermon.
//
// Sources leaned on throughout (full licensing in DATA_SOURCES.md):
//   - Penn State Extension, Ohio State Extension, WSU Extension, Oregon State
//     University and UF/IFAS invasive-plant and plant-identification pages
//   - Missouri Botanical Garden and the Morton Arboretum plant finders
//   - Burke Herbarium (University of Washington) image collection & keys
//   - Washington State Noxious Weed Control Board; King County Noxious Weeds
//   - Florida Invasive Species Council; Florida Native Plant Society
//   - Xerces Society and Monarch Joint Venture (the milkweed story)
//   - Tela Botanica, INPN and the OFB Centre de ressources EEE (France)
//
// The two nearest things to a *structured* source, and the first place to look
// when proposing a new tie: CABI Compendium datasheets carry a "Similarities to
// Other Species/Conditions" field, and EPPO and the OFB fact sheets carry the
// same idea as « risque de confusion ». Per-species prose in a named field is
// as structured as this subject gets — see DATA_SOURCES.md.
import type { Lookalike, LookalikeLink } from "../types";

// ---- The catalog: the impostors themselves, described once ----
export const LOOKALIKES: Lookalike[] = [
  // ---------------- Trees ----------------
  {
    id: "pyrus-calleryana",
    common: "Callery pear (Bradford pear)",
    latin: "Pyrus calleryana",
    form: "tree",
    origin: "Native to China and Vietnam; planted across North America from the 1960s as a tidy, tough street tree.",
    blurb:
      "The tree that turns whole American streets white in the first warm week of spring. It was sold as a plant that couldn't set seed — and then the different varieties started crossing with each other. Their seedlings are thorny, fast and dense, and they now fill old fields, verges and woodland edges across the East. Several states have banned its sale.",
    originBasis: "Penn State Extension; Missouri Botanical Garden; Invasive Plant Atlas.",
  },
  {
    id: "cornus-kousa",
    common: "Kousa dogwood",
    latin: "Cornus kousa",
    form: "tree",
    origin: "Native to Japan, Korea and China.",
    blurb:
      "The dogwood most nurseries stock, because it shrugs off the fungal blight that troubles the native one. It's a lovely garden tree and nobody's idea of a menace — it simply isn't the tree the local caterpillars, and the birds that need them, grew up with.",
    originBasis: "Missouri Botanical Garden; Morton Arboretum.",
  },
  {
    id: "acer-platanoides",
    common: "Norway maple",
    latin: "Acer platanoides",
    form: "tree",
    origin: "Native to continental Europe and western Asia.",
    blurb:
      "Planted by the million as a street tree after Dutch elm disease emptied the avenues, and now seeding itself into eastern woodlands. Its shade is so dense and its roots so shallow that the ground beneath a mature one is usually bare. Several states have banned its sale.",
    originBasis: "Penn State Extension; Missouri Botanical Garden; Morton Arboretum.",
  },
  {
    id: "ailanthus-altissima",
    common: "Tree of heaven (ailante)",
    latin: "Ailanthus altissima",
    form: "tree",
    origin: "Native to China; planted across Europe and North America from the 1700s.",
    blurb:
      "The tree that comes up in every pavement crack and railway ballast. It grows absurdly fast, breaks in the first storm, releases a chemical that suppresses the plants around it, and sends up a forest of suckers from the roots when cut. In North America it is also the spotted lanternfly's favourite host.",
    originBasis: "Penn State Extension; OFB Centre de ressources EEE; EPPO.",
  },
  {
    id: "robinia-pseudoacacia",
    common: "Black locust (robinier faux-acacia)",
    latin: "Robinia pseudoacacia",
    form: "tree",
    origin: "Native to the Appalachian mountains of North America; planted in Europe since the 1600s.",
    blurb:
      "In France it's called \"acacia\", it makes the honey of that name, and it is one of the most widespread invasive trees on the continent. Every cut root throws up new shoots, and the nitrogen its roots add to poor soil changes the ground itself, so that nettles and brambles follow rather than the meadow that was there.",
    originBasis: "OFB Centre de ressources EEE; INPN; EPPO.",
  },
  {
    id: "acer-negundo",
    common: "Box elder (érable négundo)",
    latin: "Acer negundo",
    form: "tree",
    origin: "Native to North America; planted in Europe since the 1600s.",
    blurb:
      "The maple that doesn't look like one — its leaf is split into separate leaflets. Along French rivers it now forms whole young woods, growing fast, breaking easily, and taking the ground the willows and poplars of the bank should hold.",
    originBasis: "OFB Centre de ressources EEE; INPN.",
  },
  {
    id: "pseudotsuga-menziesii",
    common: "Douglas-fir (douglas)",
    latin: "Pseudotsuga menziesii",
    form: "tree",
    origin: "Native to western North America — it's on our own Pacific Northwest list.",
    blurb:
      "Planted across French uplands since the 1800s for its straight, quick timber, and now one of the commonest plantation trees in the country. At home in Oregon it grows with an entire forest that evolved alongside it; in an Alpine valley it is a crop, and the ground beneath a dense stand of it is quiet.",
    originBasis: "INPN; ONF; Tela Botanica.",
  },
  {
    id: "washingtonia-robusta",
    common: "Mexican fan palm",
    latin: "Washingtonia robusta",
    form: "tree",
    origin: "Native to Baja California and Sonora, in northwestern Mexico.",
    blurb:
      "The very tall, very thin palm on postcards of Miami and Los Angeles. In South Florida it seeds itself into hammocks and along canal banks, and it is the palm most often bought by someone who meant to buy a cabbage palm.",
    originBasis: "UF/IFAS; Florida Invasive Species Council.",
  },

  // ---------------- Shrubs ----------------
  {
    id: "lonicera-maackii",
    common: "Amur honeysuckle (bush honeysuckle)",
    latin: "Lonicera maackii",
    form: "shrub",
    origin: "Native to northeast Asia.",
    blurb:
      "The shrub that leafs out first in spring and stays green longest in autumn — which is exactly how it takes a woodland understorey. Birds do eat its red berries, but they are the junk food of the woods: far less fat than a native berry, at the season a bird most needs it.",
    originBasis: "Ohio State Extension; Missouri Botanical Garden; Invasive Plant Atlas.",
  },
  {
    id: "prunus-laurocerasus",
    common: "Cherry laurel (laurier-palme)",
    latin: "Prunus laurocerasus",
    form: "shrub",
    origin: "Native to the Balkans, Turkey and the Black Sea coasts.",
    blurb:
      "The default evergreen hedge of half of Europe. Birds carry its black fruit into woodland, where it grows into a dark, dense understorey that nothing comes up through. Crushed or shredded, its leaves give off cyanide — which is why hedge clippings of it shouldn't go anywhere near an animal.",
    originBasis: "OFB Centre de ressources EEE; INPN; Tela Botanica.",
  },
  {
    id: "ilex-aquifolium",
    common: "English holly",
    latin: "Ilex aquifolium",
    form: "shrub",
    origin: "Native to western Europe and North Africa — including Atlantic France, where it's on our own native list.",
    blurb:
      "The Christmas holly. Birds carry its berries far into Pacific Northwest forests, where it does something few plants can: grow steadily in deep conifer shade, then hold that ground for decades. Where it *is* native it's an ordinary, valuable part of the wood.",
    originBasis: "Washington State Noxious Weed Control Board; King County Noxious Weeds; Tela Botanica.",
  },
  {
    id: "buddleja-davidii",
    common: "Butterfly bush",
    latin: "Buddleja davidii",
    form: "shrub",
    origin: "Native to central China.",
    blurb:
      "Sold as *the* butterfly plant, and adult butterflies really do drink from it. But not one caterpillar here can eat its leaves, so it feeds the visitors and raises none of them. Along Pacific Northwest rivers it seeds into gravel bars thickly enough to be a listed noxious weed in both Oregon and Washington.",
    originBasis: "Xerces Society; Washington State Noxious Weed Control Board; Oregon Dept. of Agriculture.",
  },
  {
    id: "ardisia-crenata",
    common: "Coral ardisia (coral berry)",
    latin: "Ardisia crenata",
    form: "shrub",
    origin: "Native to East Asia.",
    blurb:
      "An old dooryard shrub with lacquer-red berries that birds carry into hammocks and floodplain woods. Seedlings come up beneath it so thickly that they carpet the ground — which is what turned a tidy garden plant into one of Florida's listed invasives.",
    originBasis: "UF/IFAS; Florida Invasive Species Council; Florida Native Plant Society.",
  },
  {
    id: "callicarpa-dichotoma",
    common: "Purple beautyberry (Japanese beautyberry)",
    latin: "Callicarpa dichotoma",
    form: "shrub",
    origin: "Native to East Asia.",
    blurb:
      "The neat, arching beautyberry sold for its lilac fruit. It behaves itself in a garden and does no harm — it simply carries a fraction of the fruit our own beautyberry does, on a plant half the size.",
    originBasis: "Missouri Botanical Garden; UF/IFAS.",
  },
  {
    id: "hamelia-patens-glabra",
    common: "African firebush (dwarf firebush)",
    latin: "Hamelia patens var. glabra",
    form: "shrub",
    origin: "A Central and South American variety of the same species as Florida's firebush — from a different continent's worth of range.",
    blurb:
      "Sold everywhere as \"firebush\" or \"dwarf firebush\" because it stays compact and flowers young. Its blooms are shorter and paler than the Florida plant's, and it is not the plant the hummingbird, zebra longwing and sphinx-moth records were made on.",
    originBasis: "Florida Native Plant Society; UF/IFAS.",
  },
  {
    id: "cycas-revoluta",
    common: "Sago palm",
    latin: "Cycas revoluta",
    form: "shrub",
    origin: "Native to southern Japan. Not a palm at all — a cycad, like coontie.",
    blurb:
      "Sold by the thousand across Florida as a tough, architectural foundation plant. Every part of it is poisonous and the seeds badly so: it is one of the commonest causes of fatal plant poisoning in dogs.",
    originBasis: "UF/IFAS; ASPCA Animal Poison Control; Florida Native Plant Society.",
  },
  {
    id: "acer-palmatum",
    common: "Japanese maple",
    latin: "Acer palmatum",
    form: "tree",
    origin: "Native to Japan, Korea and China.",
    blurb:
      "The small, finely cut maple of a thousand front gardens. It isn't invasive and it does nothing wrong — it is simply not the maple that grows in these woods, and the two get swapped in both directions.",
    originBasis: "Missouri Botanical Garden; Oregon State University.",
  },
  {
    id: "rubus-armeniacus",
    common: "Himalayan blackberry",
    latin: "Rubus armeniacus",
    form: "shrub",
    origin: "Native to Armenia and northern Iran, despite the name it was given.",
    blurb:
      "The bramble that ate the Pacific Northwest: canes as thick as a thumb, arching over everything and rooting where the tips touch down. The fruit is genuinely good. What's underneath the thicket is bare ground and old canes.",
    originBasis: "Washington State Noxious Weed Control Board; WSU Extension.",
  },

  // ---------------- Vines & climbers ----------------
  {
    id: "lonicera-japonica",
    common: "Japanese honeysuckle",
    latin: "Lonicera japonica",
    form: "vine",
    origin: "Native to East Asia.",
    blurb:
      "The sweet-smelling vine children pull the flowers from to taste the drop of nectar. It keeps its leaves through winter, twines tightly enough to strangle the stems it climbs, and blankets whole forest floors — one of the most widespread invasive vines in the eastern United States, and spreading in western Europe.",
    originBasis: "Penn State Extension; Invasive Plant Atlas; OFB Centre de ressources EEE.",
  },
  {
    id: "hedera-helix",
    common: "Common ivy (English ivy)",
    latin: "Hedera helix",
    form: "vine",
    origin: "Native to Europe, western Asia and North Africa — including Atlantic France, where it's on our own native list.",
    blurb:
      "Evergreen, shade-proof, and sold everywhere as ground cover. Away from home it climbs into tree crowns, adding weight and sail until a storm takes the limb, and shades the forest floor to bare soil. Where it *is* native it's an ordinary part of the wood — and one of the last nectar sources of the autumn.",
    originBasis: "Penn State Extension; King County Noxious Weeds; Tela Botanica.",
  },

  // ---------------- Herbs, grasses & bulbs ----------------
  {
    id: "asclepias-curassavica",
    common: "Tropical milkweed",
    latin: "Asclepias curassavica",
    form: "perennial",
    origin: "Native to tropical Central and South America.",
    blurb:
      "The red-and-orange milkweed sold as a monarch plant. It really is a milkweed — but where winters are mild it never dies back, so the parasite OE builds up on leaves that are never shed, and monarchs that should be flying to Mexico stay to breed on it instead.",
    originBasis: "Xerces Society; Monarch Joint Venture; UF/IFAS.",
  },
  {
    id: "ficaria-verna",
    common: "Lesser celandine (fig buttercup)",
    latin: "Ficaria verna",
    form: "perennial",
    origin: "Native to Europe and western Asia.",
    blurb:
      "A glossy yellow buttercup that carpets damp ground in early spring and is gone by June — leaving bare, easily washed soil where the spring wildflowers used to be. It travels as tiny bulbils that ride on boots, tyres and floodwater.",
    originBasis: "Penn State Extension; Maryland DNR; Invasive Plant Atlas.",
  },
  {
    id: "lythrum-salicaria",
    common: "Purple loosestrife",
    latin: "Lythrum salicaria",
    form: "perennial",
    origin: "Native to Europe and Asia.",
    blurb:
      "Tall magenta spikes along ditches and marsh edges, and genuinely beautiful. A single plant can set over a million seeds in a season, and a stand of it turns a varied wetland into one crop that very few native insects can use.",
    originBasis: "USFWS; Invasive Plant Atlas; Missouri Botanical Garden.",
  },
  {
    id: "miscanthus-sinensis",
    common: "Chinese silvergrass (maiden grass)",
    latin: "Miscanthus sinensis",
    form: "grass",
    origin: "Native to East Asia.",
    blurb:
      "The big fountain-shaped ornamental grass with silver plumes, on sale in every garden centre. Its seed carries on the wind into meadows, verges and burnt ground, and the standing dead clumps carry fire well.",
    originBasis: "Missouri Botanical Garden; Penn State Extension; Invasive Plant Atlas.",
  },
  {
    id: "stachytarpheta-cayennensis",
    common: "Nettleleaf porterweed",
    latin: "Stachytarpheta cayennensis",
    form: "perennial",
    origin: "Native to tropical America, but not to Florida.",
    blurb:
      "What most nurseries mean when the label says \"porterweed\". It's a good nectar plant in its own right, but it stands tall, seeds itself around, and has largely pushed Florida's own sprawling blue porterweed out of the trade.",
    originBasis: "UF/IFAS; Florida Native Plant Society.",
  },
  {
    id: "lavandula-x-intermedia",
    common: "Lavandin",
    latin: "Lavandula × intermedia",
    form: "perennial",
    origin: "A hybrid of true lavender and spike lavender — a plant made by people, propagated from cuttings and planted in rows.",
    blurb:
      "The lavender of the photographs: big round cushions in long purple lines across the plateaus of Provence. It yields several times the oil of true lavender, which is why it's grown — but it is a sterile hybrid of the fields, not a wild plant of the hillside.",
    originBasis: "Tela Botanica; Conservatoire botanique national méditerranéen.",
  },
  {
    id: "toxicoscordion-venenosum",
    common: "Meadow death camas",
    latin: "Toxicoscordion venenosum",
    form: "perennial",
    origin: "Native to the Pacific Northwest — it belongs in these meadows exactly as much as the camas does.",
    blurb:
      "A lily of the same wet spring meadows, with the same grassy leaves and a bulb that looks like a camas bulb. Its name means what it says: every part is poisonous, and it has killed both livestock and people. Out of flower, there is no safe way to tell the bulbs apart.",
    originBasis: "Burke Herbarium (University of Washington); Oregon State University; Washington Poison Center.",
  },
];

// ---- The ties: region → native plant id → the impostors it's mistaken for ----
//
// Read a line as a sentence: in `mid-atlantic`, `amelanchier-canadensis`
// (serviceberry) is mistaken for `pyrus-calleryana` (Callery pear), which is
// `invasive` here, "because …", and here is how you tell them apart.
export const CONFUSIONS: Record<string, Record<string, LookalikeLink[]>> = {
  "mid-atlantic": {
    "amelanchier-canadensis": [
      {
        lookalikeId: "pyrus-calleryana",
        status: "invasive",
        why: "Both are small trees smothered in white flowers in the same warm week of early spring, often in the same parking lot.",
        tells: [
          { feature: "Smell", native: "Almost none — you have to put your nose right in it.", lookalike: "A strong sour, fishy smell you can catch from across the road." },
          { feature: "Flowers", native: "Five narrow, strappy petals in a loose airy spray, opening alongside bronze-tinted new leaves.", lookalike: "Five short round petals packed into dense white balls, on bare twigs before any leaves." },
          { feature: "Thorns", native: "None, ever.", lookalike: "Wild seedlings carry stiff thorns; the grafted street trees don't, but their offspring do." },
          { feature: "Fruit", native: "Sweet red-to-purple berries in June that birds and people both eat.", lookalike: "Hard brown pellets the size of a pea, hanging on into winter." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden; LBJ Wildflower Center.",
      },
    ],
    "cornus-florida": [
      {
        lookalikeId: "cornus-kousa",
        status: "introduced",
        why: "Both hold four broad white \"petals\" — really bracts — around a small knot of true flowers, and the Asian one is what most nurseries sell.",
        tells: [
          { feature: "Bract tips", native: "Notched, as though a bite were taken out, often with a rusty-red stain at the notch.", lookalike: "Drawn out to a clean point." },
          { feature: "When it blooms", native: "April, on bare branches, before the leaves.", lookalike: "Late May or June, well after the leaves are out." },
          { feature: "Fruit", native: "A tight cluster of glossy red berries that birds strip in autumn.", lookalike: "A single pink-red ball like a small raspberry, dangling on its own stalk." },
          { feature: "Bark", native: "Broken into small square blocks, like alligator hide.", lookalike: "Smooth, flaking into a patchwork of grey, tan and brown." },
        ],
        basis: "Missouri Botanical Garden; Morton Arboretum; Penn State Extension.",
      },
    ],
    "acer-rubrum": [
      {
        lookalikeId: "acer-platanoides",
        status: "invasive",
        why: "Two big street maples with red-tinted new growth and paired winged seeds, planted along the same streets for the same reasons.",
        tells: [
          { feature: "Break a leaf stalk", native: "Clear sap.", lookalike: "A bead of milky white sap — no native maple here does this." },
          { feature: "Leaf", native: "Hand-sized at most, three main lobes with V-shaped notches, toothed edges, whitish underneath.", lookalike: "Broader than a hand, dark green, with long-drawn lobe tips and U-shaped notches." },
          { feature: "Seeds", native: "Paired keys hanging in a narrow V, ripening in spring.", lookalike: "Paired keys spread almost in a straight line, ripening in autumn." },
          { feature: "Autumn", native: "Turns scarlet early — often the first tree on the street to go.", lookalike: "Turns plain yellow, and holds its leaves for weeks longer." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden; Morton Arboretum.",
      },
    ],
    "lonicera-sempervirens": [
      {
        lookalikeId: "lonicera-japonica",
        status: "invasive",
        why: "Both are twining honeysuckles, and the Japanese one is on so many fences that people take it for the wild native.",
        tells: [
          { feature: "Flowers", native: "Long coral-red trumpets with an orange throat, clustered at the shoot tip, with barely any scent.", lookalike: "Flowers in pairs all along the stem, white turning butter-yellow, powerfully sweet." },
          { feature: "Top pair of leaves", native: "Fused into a single disc that the stem runs straight through.", lookalike: "Every leaf separate, all the way up." },
          { feature: "Berries", native: "Bright red, in a cluster at the shoot tip.", lookalike: "Shiny black, in pairs." },
          { feature: "In winter", native: "Bare, or nearly so.", lookalike: "Still green — a green vine in a leafless January wood is almost always this." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden; LBJ Wildflower Center.",
      },
    ],
    "viburnum-dentatum": [
      {
        lookalikeId: "lonicera-maackii",
        status: "invasive",
        why: "Two shrubs of the same height with paired leaves and dark berries, growing side by side along the same woodland edges.",
        tells: [
          { feature: "Snap a twig", native: "Solid white pith inside.", lookalike: "Hollow — a clean brown tube." },
          { feature: "Leaves", native: "Coarsely toothed all round, with straight veins running out to each tooth.", lookalike: "Smooth-edged, tapering to a long drawn-out point." },
          { feature: "Berries", native: "Blue-black, on red stalks.", lookalike: "Translucent red, in pairs." },
          { feature: "The seasons", native: "Leafs out with the woods and drops with them.", lookalike: "Green weeks before anything else in spring and weeks after in autumn — the giveaway from a car window." },
        ],
        basis: "Ohio State Extension; Penn State Extension; Missouri Botanical Garden.",
      },
    ],
    "packera-aurea": [
      {
        lookalikeId: "ficaria-verna",
        status: "invasive",
        why: "Both carpet damp ground with yellow flowers in April, and both spread sideways into one solid patch.",
        tells: [
          { feature: "The flower", native: "A daisy: a ring of about a dozen yellow rays around a yellow button, several to a stalk, held well up.", lookalike: "A buttercup: 8 to 12 narrow, shining petals, sitting low over the leaves." },
          { feature: "Leaves", native: "Rounded and scalloped, often purple underneath, in a flat rosette that stays green all winter.", lookalike: "Heart-shaped and fleshy on a long stalk, in a mat that dies away completely by June." },
          { feature: "At the base", native: "Nothing in particular.", lookalike: "Pale bulbils in the leaf angles and knobbly tubers underneath — how it rides on boots and floodwater." },
          { feature: "After it flowers", native: "Keeps its leaves and holds the soil all year.", lookalike: "Gone by midsummer, leaving bare ground the rain washes away." },
        ],
        basis: "Penn State Extension; Maryland DNR; LBJ Wildflower Center.",
      },
    ],
    "eutrochium-purpureum": [
      {
        lookalikeId: "lythrum-salicaria",
        status: "invasive",
        why: "Two tall mauve-purple flowers of damp ground, blooming at the same moment in high summer.",
        tells: [
          { feature: "Flower head", native: "A wide domed cloud of soft, fuzzy flowers on top of the stem.", lookalike: "A stiff upright spike packed with magenta flowers, each with six crinkled petals." },
          { feature: "Stem", native: "Round and hollow, usually purple-spotted or purple at the joints.", lookalike: "Square-edged and stiff, going woody at the base." },
          { feature: "Leaves", native: "In whorls of three to five around the stem, toothed.", lookalike: "In opposite pairs clasping the stem, untoothed." },
          { feature: "What happens next", native: "Stays roughly where you put it.", lookalike: "One plant can set over a million seeds; a stand of it takes the whole marsh." },
        ],
        basis: "USFWS; Missouri Botanical Garden; LBJ Wildflower Center.",
      },
    ],
    "parthenocissus-quinquefolia": [
      {
        lookalikeId: "hedera-helix",
        status: "invasive",
        why: "Both climb trunks and walls, and both get called \"the ivy on the house\".",
        tells: [
          { feature: "Leaf", native: "Five leaflets fanned out from one point, like fingers.", lookalike: "A single dark glossy leaf, lobed when young, plain oval on the old flowering growth." },
          { feature: "In winter", native: "Bare — it drops everything.", lookalike: "Evergreen; a tree trunk that's green in February is ivy." },
          { feature: "How it holds on", native: "Sticky pads at the tips of curling tendrils — it sits on the bark.", lookalike: "Short roots gripping along the whole stem, prising into bark and mortar." },
          { feature: "Autumn", native: "Turns scarlet before almost anything else, with dark blue berries on bright red stalks.", lookalike: "No autumn colour at all; black berries, and only high up on old growth." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden; LBJ Wildflower Center.",
      },
    ],
    "schizachyrium-scoparium": [
      {
        lookalikeId: "miscanthus-sinensis",
        status: "invasive",
        why: "Both are clumping ornamental grasses sold for the same border, and both go tawny and fluffy in autumn.",
        tells: [
          { feature: "Size", native: "Knee to waist high, in a clump about the size of a dinner plate.", lookalike: "Head high, in a clump you'd need both arms around." },
          { feature: "The blade", native: "Blue-green and plain, turning copper-orange in autumn.", lookalike: "Green with a silver-white stripe down the middle of every blade." },
          { feature: "Seed heads", native: "Small white tufts scattered up the stems, lit from behind by low sun.", lookalike: "One big fan-shaped silver plume held above the clump." },
          { feature: "In winter", native: "Stands copper-red until spring, full of small birds.", lookalike: "Fades to straw, and its seed blows out into meadows and verges." },
        ],
        basis: "LBJ Wildflower Center; Missouri Botanical Garden; Penn State Extension.",
      },
    ],
    "panicum-virgatum": [
      {
        lookalikeId: "miscanthus-sinensis",
        status: "invasive",
        why: "Two tall clumping grasses sold from the same bench for the same job — height, movement and winter structure.",
        tells: [
          { feature: "The blade", native: "Plain green or blue-green, with no stripe.", lookalike: "A silver-white stripe down the middle of every blade." },
          { feature: "Seed head", native: "An airy pink-tan cloud you can see the sky through.", lookalike: "A dense fan-shaped silver plume." },
          { feature: "The clump", native: "Upright and loose, opening out in the middle as it ages.", lookalike: "Tight and heavy, staying shut." },
          { feature: "Where the seed goes", native: "Into sparrows and juncos, all winter.", lookalike: "Into meadows, verges and burnt ground, where it comes up." },
        ],
        basis: "LBJ Wildflower Center; Missouri Botanical Garden; Penn State Extension.",
      },
    ],
    "asclepias-tuberosa": [
      {
        lookalikeId: "asclepias-curassavica",
        status: "introduced",
        why: "Two orange milkweeds sold side by side on the same bench, both labelled for monarchs — but only one of them dies back in winter.",
        tells: [
          { feature: "Flower colour", native: "One solid orange, sometimes leaning yellow.", lookalike: "Two-tone: red outer petals around a yellow-orange crown." },
          { feature: "Break a stem", native: "Clear watery sap — the one milkweed that doesn't bleed white.", lookalike: "Thick white latex." },
          { feature: "Leaves", native: "Narrow and hairy, set alternately up a stiff hairy stem.", lookalike: "Smooth and pointed, in opposite pairs." },
          { feature: "In winter", native: "Dies to the ground, and comes back later in spring than almost anything — don't dig it up.", lookalike: "Stays green wherever winter is mild, which is exactly the problem." },
        ],
        basis: "Xerces Society; Monarch Joint Venture; LBJ Wildflower Center.",
      },
      {
        lookalikeId: "buddleja-davidii",
        status: "introduced",
        why: "One word apart on the label — butterfly weed and butterfly bush — and both sold with a butterfly on the tag.",
        tells: [
          { feature: "What it is", native: "A milkweed: knee-high, dying back to the ground each winter.", lookalike: "A big arching shrub, head high in a single season." },
          { feature: "What it feeds", native: "Nectar for the adults, and leaves that monarch caterpillars can actually eat.", lookalike: "Nectar for the adults only — no caterpillar here can eat its leaves." },
          { feature: "Flowers", native: "Flat clusters of small orange stars.", lookalike: "Long cones of tiny purple, white or pink flowers." },
          { feature: "Where it ends up", native: "In its clump, where you planted it.", lookalike: "In river gravel — a listed noxious weed in Oregon and Washington." },
        ],
        basis: "Xerces Society; Washington State Noxious Weed Control Board; Oregon Dept. of Agriculture.",
      },
    ],
    "asclepias-incarnata": [
      {
        lookalikeId: "asclepias-curassavica",
        status: "introduced",
        why: "Both are milkweeds sold for monarchs, and in a pot at the nursery they look much the same.",
        tells: [
          { feature: "Flower colour", native: "Soft pink to mauve, in domed clusters.", lookalike: "Red and yellow, two-tone." },
          { feature: "Stance", native: "Chest high and straight, standing in wet ground.", lookalike: "Waist high and lax, happy anywhere warm." },
          { feature: "In winter", native: "Dies to the ground with the first frosts.", lookalike: "Stays green wherever winter is mild, and the OE parasite builds up on the old leaves." },
          { feature: "Leaves", native: "Long and narrow with a pale midrib, in opposite pairs.", lookalike: "Broader and thinner, tapering at both ends." },
        ],
        basis: "Xerces Society; Monarch Joint Venture; LBJ Wildflower Center.",
      },
    ],
  },

  pnw: {
    "berberis-aquifolium": [
      {
        lookalikeId: "ilex-aquifolium",
        status: "invasive",
        why: "Two glossy evergreens with spine-tipped, holly-shaped leaves — and the second word of one's Latin name is the other's.",
        tells: [
          { feature: "The leaf", native: "A compound leaf: five to nine spiny leaflets ranged along one stalk.", lookalike: "One spiny leaf at a time, thick and wavy." },
          { feature: "Berries", native: "Dusty blue-purple, in bunches like tiny grapes.", lookalike: "Bright red — and only on female plants." },
          { feature: "Flowers", native: "Loud yellow clusters in early spring, on the greyest day of the year.", lookalike: "Small, white and easy to miss." },
          { feature: "Under the bark", native: "Scratch a stem: the wood is vivid yellow.", lookalike: "Pale." },
        ],
        basis: "Burke Herbarium (University of Washington); King County Noxious Weeds; WSU Extension.",
      },
    ],
    "rubus-spectabilis": [
      {
        lookalikeId: "rubus-armeniacus",
        status: "invasive",
        why: "Two brambles in the same damp edges, both with arching prickly canes and berries you'd want to pick.",
        tells: [
          { feature: "Canes", native: "Slender, round and brown, with fine soft prickles you can grip through.", lookalike: "Thick as a thumb, five-sided in section, with broad-based hooked thorns." },
          { feature: "Leaves", native: "Three leaflets, green on both sides.", lookalike: "Usually five leaflets on the big canes, chalk-white underneath." },
          { feature: "Flowers and fruit", native: "Magenta flowers in March; soft salmon-to-red berries by June.", lookalike: "White-pink flowers in June; black berries in August." },
          { feature: "What it does next", native: "Makes an open thicket that other plants grow up through.", lookalike: "Roots wherever a cane tip touches down, until nothing else is left." },
        ],
        basis: "Burke Herbarium (University of Washington); WSU Extension; Washington State Noxious Weed Control Board.",
      },
    ],
    "camassia-quamash": [
      {
        lookalikeId: "toxicoscordion-venenosum",
        status: "native",
        why: "They grow in the same wet spring meadows, from bulbs that look alike, with the same grassy leaves — and one of them is deadly.",
        tells: [
          { feature: "Flower colour", native: "Deep blue-violet stars.", lookalike: "Creamy white to greenish, with a green gland at the base of each petal." },
          { feature: "The spike", native: "Tall and open, opening from the bottom upward.", lookalike: "Shorter, narrower and crowded, near the top of the stem." },
          { feature: "Out of bloom", native: "Not safely tellable from death camas. Mark where the blue flowers were and trust nothing else.", lookalike: "Not safely tellable either — and every part of it is poisonous, the bulb most of all." },
          { feature: "Why it matters", native: "A staple food plant of Northwest peoples for thousands of years, and a meadow keystone.", lookalike: "Has poisoned livestock and people. It's native here too — it just isn't the one." },
        ],
        basis: "Burke Herbarium (University of Washington); Oregon State University; Washington Poison Center.",
      },
    ],
    "acer-circinatum": [
      {
        lookalikeId: "acer-palmatum",
        status: "introduced",
        why: "Two small many-lobed maples that glow in autumn — the Japanese one in most gardens, the native one in most woods.",
        tells: [
          { feature: "Leaf shape", native: "Almost a circle, with seven to nine shallow lobes and a heart-shaped base.", lookalike: "A star, with five to nine lobes cut deep, often nearly to the centre." },
          { feature: "Flowers", native: "Small hanging flowers with white petals and dark red-purple sepals, in April.", lookalike: "Tiny reddish flowers, easily missed." },
          { feature: "Habit", native: "Sprawls and leans, several stems from the ground, layering where a branch meets soil.", lookalike: "One neat vase-shaped frame, usually kept that way by pruning." },
          { feature: "Where it is", native: "Wild, in the shade beneath conifers.", lookalike: "Planted, in a garden." },
        ],
        basis: "Burke Herbarium (University of Washington); Oregon State University; Missouri Botanical Garden.",
      },
    ],
  },

  "florida-central": {
    "asclepias-tuberosa": [
      {
        lookalikeId: "asclepias-curassavica",
        status: "introduced",
        why: "Both are orange milkweeds sold for monarchs — but in a Florida winter only one of them dies back.",
        tells: [
          { feature: "Flower colour", native: "One solid orange, sometimes leaning yellow.", lookalike: "Two-tone: red outer petals around a yellow-orange crown." },
          { feature: "Break a stem", native: "Clear watery sap — the one milkweed that doesn't bleed white.", lookalike: "Thick white latex." },
          { feature: "In winter", native: "Dies to the ground and rests.", lookalike: "Never stops. OE spores build up on leaves that are never shed, and monarchs stay to breed instead of migrating." },
          { feature: "If you already have it", native: "Nothing to do.", lookalike: "Cut it to the ground each autumn, or replace it with a native milkweed." },
        ],
        basis: "Xerces Society; Monarch Joint Venture; UF/IFAS.",
      },
    ],
    "callicarpa-americana": [
      {
        lookalikeId: "callicarpa-dichotoma",
        status: "introduced",
        why: "Two beautyberries sold under the same name, both carrying bright purple fruit in autumn.",
        tells: [
          { feature: "Where the fruit sits", native: "Packed into fat rings hugging the stem at each pair of leaves.", lookalike: "In small loose bunches held out from the stem on short stalks." },
          { feature: "Fruit colour", native: "Deep magenta.", lookalike: "Lilac to violet." },
          { feature: "Size", native: "Head high and arching wide.", lookalike: "Waist high and neat." },
          { feature: "Leaves", native: "Big, soft, felty underneath, coarsely toothed.", lookalike: "Smaller, thinner, smooth, toothed only above the middle." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society; Missouri Botanical Garden.",
      },
    ],
    "sabal-palmetto": [
      {
        lookalikeId: "washingtonia-robusta",
        status: "introduced",
        why: "Two fan palms on the same street — and the tall thin one on the postcard is not Florida's state tree.",
        tells: [
          { feature: "The fan", native: "The leaf stalk runs on into the fan and curves it, so the leaf folds like a taco.", lookalike: "The stalk stops where the fan begins; the leaf is flat." },
          { feature: "Threads", native: "Fine threads hang between the leaf segments.", lookalike: "No threads." },
          { feature: "Leaf stalk edge", native: "Smooth — no teeth.", lookalike: "Lined with hooked orange spines." },
          { feature: "Trunk", native: "Stout and grey, often still wearing crossed old leaf bases.", lookalike: "Slim, very tall and straight, usually with a skirt of dead brown fronds." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "hamelia-patens": [
      {
        lookalikeId: "hamelia-patens-glabra",
        status: "introduced",
        why: "Sold under the same name — firebush — from the same bench, and the compact one flowers younger in the pot.",
        tells: [
          { feature: "Flowers", native: "Long narrow tubes, red-orange throughout, in one-sided clusters.", lookalike: "Shorter, wider tubes, yellow-orange to pale red." },
          { feature: "Leaves and stems", native: "Softly hairy, usually in whorls of three, with red stalks and red new growth.", lookalike: "Smooth and glossy, usually in pairs, with green stalks." },
          { feature: "Habit", native: "Big and loose — it wants to be a small tree.", lookalike: "Low, dense and tidy; often labelled \"dwarf firebush\"." },
          { feature: "What it brings", native: "The plant the zebra longwing, the pluto sphinx moth and Florida's hummingbirds are recorded on.", lookalike: "Nectar — but not those records." },
        ],
        basis: "Florida Native Plant Society; UF/IFAS.",
      },
    ],
  },

  "florida-south": {
    "zamia-integrifolia": [
      {
        lookalikeId: "cycas-revoluta",
        status: "introduced",
        why: "Two cycads with the same stiff, palm-like rosette — and the sago is in half the front gardens in Florida.",
        tells: [
          { feature: "Leaflets", native: "Flat and soft-edged, rounded or slightly notched at the tip; you can run a hand along them.", lookalike: "Stiff, rolled at the edges and needle-sharp at the tip — they will draw blood." },
          { feature: "Where the stem is", native: "Underground: the leaves come straight out of the ground.", lookalike: "Above ground: a shaggy brown trunk that thickens over the years." },
          { feature: "Cones", native: "A small brown velvet cone low among the leaves.", lookalike: "A large cone, or a great woolly dome, sitting in the centre." },
          { feature: "Why it matters", native: "The only food the atala butterfly's caterpillars have.", lookalike: "Poisonous to people and pets; its seeds are a common cause of fatal poisoning in dogs." },
        ],
        basis: "UF/IFAS; Florida Museum of Natural History; ASPCA Animal Poison Control.",
      },
    ],
    "psychotria-nervosa": [
      {
        lookalikeId: "ardisia-crenata",
        status: "invasive",
        why: "Two shade shrubs of the same size with glossy leaves and red berries, often in the same hammock.",
        tells: [
          { feature: "Leaf surface", native: "Deeply quilted — the veins are pressed in, so the whole leaf looks corrugated.", lookalike: "Smooth and flat, with wavy, scalloped edges." },
          { feature: "Berries", native: "Dull red, in a small cluster at the shoot tip, gone as soon as the birds find them.", lookalike: "Lacquer-bright scarlet, in heavy drooping bunches that hang for months." },
          { feature: "Underneath the plant", native: "Ordinary leaf litter.", lookalike: "A carpet of seedlings — the surest sign of all." },
          { feature: "Flowers", native: "Small white clusters at the shoot tips.", lookalike: "Small pink-white flowers on hanging stalks." },
        ],
        basis: "UF/IFAS; Florida Invasive Species Council; Florida Native Plant Society.",
      },
    ],
    "stachytarpheta-jamaicensis": [
      {
        lookalikeId: "stachytarpheta-cayennensis",
        status: "introduced",
        why: "Both are \"porterweed\" on the label, and both carry the same little blue flowers walking up a spike.",
        tells: [
          { feature: "Habit", native: "Sprawls along the ground, knee high at most.", lookalike: "Stands upright, chest high or taller." },
          { feature: "Flower colour", native: "Pale sky-blue to lavender.", lookalike: "Deep blue-purple." },
          { feature: "Stems", native: "Softly hairy, often reddish, rooting where they touch the ground.", lookalike: "Smooth, and woody at the base." },
          { feature: "Leaves", native: "Rounded, thick, bluntly toothed.", lookalike: "Narrow, thin and sharply toothed — the \"nettleleaf\" of its name." },
        ],
        basis: "UF/IFAS; Florida Native Plant Society.",
      },
    ],
    "hamelia-patens": [
      {
        lookalikeId: "hamelia-patens-glabra",
        status: "introduced",
        why: "Sold under the same name — firebush — from the same bench, and the compact one flowers younger in the pot.",
        tells: [
          { feature: "Flowers", native: "Long narrow tubes, red-orange throughout, in one-sided clusters.", lookalike: "Shorter, wider tubes, yellow-orange to pale red." },
          { feature: "Leaves and stems", native: "Softly hairy, usually in whorls of three, with red stalks and red new growth.", lookalike: "Smooth and glossy, usually in pairs, with green stalks." },
          { feature: "Habit", native: "Big and loose — it wants to be a small tree.", lookalike: "Low, dense and tidy; often labelled \"dwarf firebush\"." },
          { feature: "What it brings", native: "The plant the zebra longwing, the pluto sphinx moth and Florida's hummingbirds are recorded on.", lookalike: "Nectar — but not those records." },
        ],
        basis: "Florida Native Plant Society; UF/IFAS.",
      },
    ],
    "sabal-palmetto": [
      {
        lookalikeId: "washingtonia-robusta",
        status: "invasive",
        why: "Two fan palms on the same street — and the tall thin one on the postcard is not Florida's state tree.",
        tells: [
          { feature: "The fan", native: "The leaf stalk runs on into the fan and curves it, so the leaf folds like a taco.", lookalike: "The stalk stops where the fan begins; the leaf is flat." },
          { feature: "Threads", native: "Fine threads hang between the leaf segments.", lookalike: "No threads." },
          { feature: "Leaf stalk edge", native: "Smooth — no teeth.", lookalike: "Lined with hooked orange spines." },
          { feature: "Trunk", native: "Stout and grey, often still wearing crossed old leaf bases.", lookalike: "Slim, very tall and straight, usually with a skirt of dead brown fronds." },
        ],
        basis: "UF/IFAS; Florida Invasive Species Council; Florida Native Plant Society.",
      },
    ],
  },

  "france-atlantic": {
    "sorbus-aucuparia": [
      {
        lookalikeId: "robinia-pseudoacacia",
        status: "invasive",
        why: "Both carry a leaf split into many small leaflets along one stalk, and both turn up on the same rough ground and roadsides.",
        tells: [
          { feature: "Leaflets", native: "Toothed all the way round, like a small saw blade.", lookalike: "Smooth-edged and oval, with a tiny notch at the tip." },
          { feature: "Thorns", native: "None.", lookalike: "A pair of short stiff thorns at the base of each leaf on young shoots." },
          { feature: "Flowers", native: "Flat creamy heads of many tiny flowers, in May.", lookalike: "Hanging chains of white pea-flowers, heavily scented, in late May." },
          { feature: "Fruit", native: "Bunches of orange-red berries that the thrushes strip in autumn.", lookalike: "Flat brown pods that rattle on the branches all winter." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
    "ilex-aquifolium": [
      {
        lookalikeId: "prunus-laurocerasus",
        status: "invasive",
        why: "Two glossy evergreens used for the same hedge — and cherry laurel is what most garden hedges are made of now.",
        tells: [
          { feature: "Leaf edge", native: "Hard and wavy, with sharp spines (the highest leaves often lose them).", lookalike: "Flat and leathery, finely toothed or plain — never spiny." },
          { feature: "Leaf size", native: "About as long as a thumb.", lookalike: "About as long as a hand." },
          { feature: "Crush a leaf", native: "No particular smell.", lookalike: "A sharp bitter-almond smell — that's cyanide." },
          { feature: "Fruit", native: "Scarlet berries in winter, on female trees.", lookalike: "Black cherries in late summer, along upright spikes." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
    "lonicera-periclymenum": [
      {
        lookalikeId: "lonicera-japonica",
        status: "invasive",
        why: "Two twining honeysuckles with cream flowers turning yellow and the same sweet evening scent.",
        tells: [
          { feature: "Where the flowers sit", native: "All together in one head at the tip of the shoot.", lookalike: "In pairs in the angle between leaf and stem, all the way along it." },
          { feature: "Flower colour", native: "Cream inside, flushed red-purple outside.", lookalike: "White turning butter-yellow, with no red." },
          { feature: "Fruit", native: "A tight cluster of red berries.", lookalike: "Black berries, in pairs." },
          { feature: "In winter", native: "Bare, or nearly so.", lookalike: "Still in leaf." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
  },

  "france-continental": {
    "acer-campestre": [
      {
        lookalikeId: "acer-negundo",
        status: "invasive",
        why: "Both are maples of hedgerows and riverbanks — but only one of them has a maple-shaped leaf.",
        tells: [
          { feature: "Leaf", native: "One leaf with five blunt rounded lobes; break the stalk and it bleeds milky white.", lookalike: "A leaf split into three to five separate leaflets, coarsely toothed, the end one often three-pointed." },
          { feature: "Twigs", native: "Often ridged with corky wings on older shoots.", lookalike: "Smooth, green to violet, under a waxy bloom you can rub off with a thumb." },
          { feature: "Seeds", native: "Paired keys spread out almost in a straight line.", lookalike: "Paired keys in a narrow V, hanging in long bunches." },
          { feature: "Where it grows", native: "In hedges and wood edges, especially on chalky ground.", lookalike: "In dense young thickets on river gravel and disturbed banks." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
  },

  "france-mediterranean": {
    "fraxinus-ornus": [
      {
        lookalikeId: "ailanthus-altissima",
        status: "invasive",
        why: "Two trees with long leaves split into many leaflets, both quick, both everywhere along Mediterranean roads and railways.",
        tells: [
          { feature: "How the leaves sit", native: "In opposite pairs on the twig.", lookalike: "Alternately, one after another." },
          { feature: "Leaflet edge", native: "Evenly toothed all round.", lookalike: "Smooth-edged, except for one or two blunt teeth near the base, each with a small gland underneath." },
          { feature: "Crush a leaf", native: "Not much of a smell.", lookalike: "A rank smell — burnt peanut butter is the usual description." },
          { feature: "Flowers and seeds", native: "Showy creamy scented plumes in spring; single winged seeds.", lookalike: "Greenish flowers, then great bunches of twisted red-brown winged seeds that hang on all winter." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
    "viburnum-tinus": [
      {
        lookalikeId: "prunus-laurocerasus",
        status: "invasive",
        why: "Two evergreen shrubs of the same size and gloss, both called \"laurier\" in French and both sold for hedging.",
        tells: [
          { feature: "Leaves", native: "In opposite pairs, thumb-length, with small tufts of hair where the veins meet underneath.", lookalike: "Alternate, hand-length, and hairless." },
          { feature: "Flowers", native: "Flat heads of pink-budded white flowers — in the middle of winter.", lookalike: "Upright white spikes, in spring." },
          { feature: "Fruit", native: "Oval and metallic blue-black.", lookalike: "Round black cherries." },
          { feature: "Crush a leaf", native: "No particular smell.", lookalike: "Bitter almonds — that's cyanide." },
        ],
        basis: "Tela Botanica; INPN; OFB Centre de ressources EEE.",
      },
    ],
    "lavandula-angustifolia": [
      {
        lookalikeId: "lavandula-x-intermedia",
        status: "introduced",
        why: "The lavender in the photographs of Provence is almost always the hybrid, not the wild one.",
        tells: [
          { feature: "Stems", native: "One flower spike per stem, and nothing else.", lookalike: "Three spikes per stem: one in the middle and two side branches." },
          { feature: "Shape", native: "A small, loose, uneven bush, knee high.", lookalike: "A big tight round cushion, waist high, in a dead-straight row." },
          { feature: "Where it grows", native: "Wild on dry stony slopes, high up.", lookalike: "Planted on the plateaus and plains, wherever a tractor can turn." },
          { feature: "Scent", native: "Sweet and soft — the perfumer's lavender.", lookalike: "Sharper, more camphorous; grown for the volume of oil." },
        ],
        basis: "Tela Botanica; Conservatoire botanique national méditerranéen.",
      },
    ],
  },

  "france-alpine": {
    "picea-abies": [
      {
        lookalikeId: "pseudotsuga-menziesii",
        status: "introduced",
        why: "Two tall dark conifers in the same valleys — one has been here since the ice, the other was planted for timber.",
        tells: [
          { feature: "Cones", native: "Long and smooth, hanging down, falling to the ground whole.", lookalike: "Also hanging — but with a three-pointed papery tongue sticking out under every scale, like the back half of a mouse." },
          { feature: "Needles", native: "Stiff and four-sided: roll one between finger and thumb and it turns.", lookalike: "Flat and soft: it won't roll." },
          { feature: "Crush a needle", native: "Resinous.", lookalike: "Sweet, of lemon or tangerine." },
          { feature: "Where a needle has fallen", native: "It leaves a tiny peg behind, so an old twig feels rough.", lookalike: "It leaves a smooth oval scar, so the twig stays smooth." },
        ],
        basis: "Tela Botanica; INPN; ONF.",
      },
    ],
  },
};
