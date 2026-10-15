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
// Michigan, Central Texas, Atlantic and Alpine France, Ireland — the five are
// plants the local authorities name as invasive, again taken by sightings, and
// the page says the order is sightings alone. Beech and sycamore turn up high in the French and
// Irish counts and are left out: native in France, and nobody's target in
// Ireland.
//
// Chicago's five come from Illinois' Exotic Weed Act list. That is a law about
// sale and planting, not a ranking of harm, so they carry no listing and are
// ordered by sightings like the others.
//
// The counts live in `invasive-counts.json` (`npm run invasives:count`), and
// `lib/invasives.ts` does the ranking at runtime, so a refreshed count can
// reorder a list without anybody editing this file. `npm run listings:check`
// asks each authority whether it still says what we print, here as for the
// look-alikes.
//
// **Getting rid of them.** Each plant's `removal` is what stops it coming back
// — the root piece that resprouts, the stump that suckers, the seed that waits
// five years — not just "pull it". Every step is mechanical: in France a home
// gardener may not use herbicides at all (loi Labbé, 2019), several of these
// plants are on French lists, and a hand, a spade and persistence work
// everywhere. Where a stand is past that, the step says so and names a
// professional.
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
      { part: "smell", feature: "Smell", text: "Crushed leaves smell rank, like burnt peanut butter." },
      { part: "leaf", feature: "Leaves", text: "Very long, with many leaflets, each with a notch and a bump near its base." },
      { part: "fruit", feature: "Seeds", text: "Papery, twisted wings in big hanging clusters." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings when the soil is moist, with the whole root: a root piece left behind resprouts." },
        { method: "girdle", text: "Don't fell a big tree — it answers with a thicket of root suckers. Cut a ring through the bark all round, leaving a thin strip the first year, and close the ring the next." },
        { method: "repeat", text: "Pull every sucker as it appears, for several years." },
      ],
      dispose: "Seed clusters and root pieces go in the bin, not the compost.",
      basis: "Penn State Extension; OFB Centre de ressources EEE.",
      // "Larger plants should be cut; two cuttings a year may be necessary, once
      // in the early growing season and once in the late growing season."
      window: {
        seasons: ["spring",  "summer"],
        cue: "Cut early in the season, and again late",
        source: { name: "Virginia DCR — Invasive Alien Plant Species of Virginia: Tree-of-Heaven", url: "https://www.dcr.virginia.gov/natural-heritage/document/fsaial.pdf" },
      },
    },
  },
  {
    id: "robinia-pseudoacacia",
    common: "Black locust",
    latin: "Robinia pseudoacacia",
    form: "tree",
    marks: [
      { part: "thorn", feature: "Thorns", text: "A pair of sharp thorns where each leaf meets the twig." },
      { part: "leaf", feature: "Leaves", text: "Feathery, with small rounded leaflets in pairs." },
      { part: "flower", feature: "Flowers", text: "Hanging clusters of white, scented pea-flowers in late spring." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings and suckers young, with the root." },
        { method: "girdle", text: "Don't fell a big tree — cutting it sets off suckers all around. Cut a ring through the bark, leaving a thin strip the first year, and close it the next." },
        { method: "repeat", text: "Pull the suckers that still come, for several years." },
      ],
      dispose: "The wood makes good firewood; root pieces go in the bin.",
      basis: "OFB Centre de ressources EEE; CBN Méditerranéen.",
      // "Spread of black locust can be hindered by repeated cutting during the
      // growing season"
      window: {
        seasons: ["spring",  "summer"],
        cue: "Cut every stem, again and again, while in leaf",
        source: { name: "Missouri Department of Conservation — Black Locust Control", url: "https://mdc.mo.gov/trees-plants/nuisance-native-plants/black-locust-control" },
      },
    },
  },
  {
    id: "melia-azedarach",
    common: "Chinaberry",
    latin: "Melia azedarach",
    form: "tree",
    marks: [
      { part: "fruit", feature: "Berries", text: "Round, marble-sized yellow berries that hang in bunches on the bare tree all winter." },
      { part: "leaf", feature: "Leaves", text: "Very large and lacy, cut twice into many toothed leaflets." },
      { part: "flower", feature: "Flowers", text: "Lilac, star-shaped and sweetly scented, in loose sprays in spring." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings when the ground is wet, with the whole root." },
        { method: "girdle", text: "Felling a big tree sets off suckers. Cut a ring through the bark all round instead, and let it die standing over a year." },
        { method: "repeat", text: "Pull the suckers and seedlings that follow for several years; the berries are poisonous, so wear gloves and keep children away." },
      ],
      dispose: "Bag the berries; the wood is fine to burn or chip.",
      basis: "Texas Invasive Species Institute; Texas A&M Forest Service.",
      // "prior to seed onset (spring)"
      window: {
        seasons: ["spring"],
        cue: "Before the seeds start to form",
        source: { name: "U.S. Army Corps of Engineers — Invasive Plant Species Best Management Practices: Chinaberry Tree", url: "https://corpslakes.erdc.dren.mil/employees/invasive/pdfs/M_azedarach.pdf" },
      },
    },
  },
  {
    id: "ligustrum-lucidum",
    common: "Glossy privet",
    latin: "Ligustrum lucidum",
    form: "tree",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Evergreen, thick and shiny, in opposite pairs, three to six inches long." },
      { part: "fruit", feature: "Berries", text: "Dense bunches of small blue-black berries all winter." },
      { part: "smell", feature: "Smell", text: "Creamy flower sprays in early summer with a heavy, sickly-sweet scent." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings by hand, or with a weed wrench up to wrist thickness, roots and all." },
        { method: "girdle", text: "A cut stump resprouts. Girdle bigger trunks — a ring through the bark all round — and leave them to die." },
        { method: "replant", text: "Plant a native evergreen in the gap, like yaupon, or birds will drop privet seed straight back in." },
      ],
      dispose: "Cut it before it fruits; bag any berries.",
      basis: "Texas Invasive Species Institute; Lady Bird Johnson Wildflower Center.",
      // "cream-colored flowers in early summer … Plants should be pulled as soon
      // as they are large enough to grasp but before they produce seeds"
      window: {
        seasons: ["spring",  "summer"],
        cue: "After rain, before it sets seed",
        source: { name: "UC Weed Research & Information Center — A Weed Report: Glossy privet", url: "https://ccfruitandnuts.ucanr.edu/sites/default/files/2020-05/326222.pdf" },
      },
    },
  },
  {
    id: "ilex-aquifolium",
    common: "English holly",
    latin: "Ilex aquifolium",
    form: "tree",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Thick, glossy and dark, with wavy, spiny edges." },
      { part: "fruit", feature: "Berries", text: "Red, in winter, on the female trees." },
      { part: "where", feature: "Where", text: "Seedlings in the shade of a wood, far from any garden." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings, root and all, when the ground is wet." },
        { method: "dig", text: "Cut bigger trees at the base and dig out the stump, or cut every resprout until it gives up." },
        { method: "repeat", text: "Check under nearby trees for bird-sown seedlings for a few years." },
      ],
      dispose: "Berried branches go in the bin, so birds can't carry the seeds on.",
      basis: "King County Noxious Weeds; WSU Extension.",
      // "prior to berry maturation … The berries are borne on female trees
      // during the fall and winter"
      window: {
        seasons: ["spring",  "summer"],
        cue: "Before the berries ripen",
        source: { name: "Metro Vancouver — Best Management Practices for English Holly", url: "https://metrovancouver.org/services/regional-planning/Documents/english-holly-best-management-practices.pdf" },
      },
    },
  },
  {
    id: "schinus-terebinthifolia",
    common: "Brazilian pepper",
    latin: "Schinus terebinthifolia",
    form: "tree",
    marks: [
      { part: "smell", feature: "Smell", text: "Crushed leaves smell of pepper and turpentine." },
      { part: "leaf", feature: "Leaves", text: "Leaflets in pairs, on a stalk that's often red." },
      { part: "fruit", feature: "Berries", text: "Bright red clusters through the winter." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings by hand, root and all." },
        { method: "dig", text: "Cut bigger ones down and dig or grind out the stump: it resprouts from the base." },
        { method: "gear", text: "Wear gloves — the sap irritates skin, like its cousin poison ivy — and never burn it." },
      ],
      dispose: "Bag the berries; don't compost them.",
      basis: "UF/IFAS Extension; Florida Invasive Species Council.",
      // "On 2 sites in Florida, cutting from June to October resulted in the
      // highest mortality rates for Brazilian pepper compared to cutting at
      // other times of the year."
      window: {
        seasons: ["summer",  "fall"],
        cue: "Cut in the warm months, when fewest survive",
        source: { name: "USDA Forest Service FEIS — Schinus terebinthifolius", url: "https://www.fs.usda.gov/database/feis/plants/shrub/schter/all.html" },
      },
    },
  },
  // ---------------- Shrubs ----------------
  {
    id: "elaeagnus-umbellata",
    common: "Autumn olive",
    latin: "Elaeagnus umbellata",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Silvery underneath, as if dusted with metal flakes." },
      { part: "fruit", feature: "Berries", text: "Small, red and speckled with silver, in autumn." },
      { part: "flower", feature: "Flowers", text: "Creamy, sweet-scented little trumpets in spring." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings and small shrubs root and all, ideally with a weed lever." },
        { method: "dig", text: "Don't just cut a big one: it resprouts thicker. Dig out the root crown, or cut every new shoot until it gives up." },
        { method: "timing", text: "Do it before autumn, before birds take the berries." },
      ],
      dispose: "Berried branches go in the bin.",
      basis: "Penn State Extension; Michigan Natural Features Inventory.",
      // "Seedlings are easiest to identify in early spring because autumn-olive
      // produces leaves earlier than most native shrubs"
      window: {
        seasons: ["spring"],
        cue: "Pull seedlings as it leafs out, before natives",
        source: { name: "USDA Forest Service FEIS — Elaeagnus umbellata", url: "https://www.fs.usda.gov/database/feis/plants/shrub/elaumb/all.html" },
      },
    },
  },
  {
    id: "lonicera-morrowii",
    common: "Morrow's honeysuckle",
    latin: "Lonicera morrowii",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Twigs", text: "Snap one: the middle is hollow. A native honeysuckle's is solid." },
      { part: "leaf", feature: "Leaves", text: "Soft and downy, in pairs, and among the first green in spring." },
      { part: "fruit", feature: "Berries", text: "Red, in pairs, in summer." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Lever out whole shrubs: the roots are shallow and come up easily in moist soil." },
        { method: "timing", text: "Go in early spring — it leafs out before the natives, so it's easy to find." },
        { method: "repeat", text: "Pull the seedlings that follow for a few years." },
      ],
      dispose: "Berried branches go in the bin.",
      basis: "Michigan Natural Features Inventory; Penn State Extension.",
      // "Generally two cuts per year are recommended, one in early spring
      // followed by one in the late summer or early autumn. Cuts made in the
      // winter while the plant is dormant will only encourage vigorous
      // resprouting."
      window: {
        seasons: ["spring",  "summer",  "fall"],
        cue: "Cut in early spring and late summer, never dormant",
        source: { name: "Virginia DCR — Invasive Alien Plant Species of Virginia: Bush Honeysuckles", url: "https://www.dcr.virginia.gov/natural-heritage/document/fslobe.pdf" },
      },
    },
  },
  {
    id: "nandina-domestica",
    common: "Nandina (heavenly bamboo)",
    latin: "Nandina domestica",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Lacy, bamboo-like, cut into many small pointed leaflets, flushing red in cold weather." },
      { part: "fruit", feature: "Berries", text: "Heavy bunches of bright red berries all winter." },
      { part: "stem", feature: "Stems", text: "Unbranched cane-like stems rising from the base." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut off every berry cluster before it ripens: the berries can poison cedar waxwings, and birds carry the seed into creek woods." },
        { method: "dig", text: "Dig the clump out with its yellow roots; small pieces left in the ground resprout." },
        { method: "repeat", text: "Dig out seedlings as they appear for a couple of years." },
      ],
      dispose: "Bag the berries; don't compost them.",
      basis: "Texas Invasive Species Institute; Lady Bird Johnson Wildflower Center.",
      // "develops clusters of red, two-seeded berries in late fall and winter …
      // it's best to do it before berries form"
      window: {
        seasons: ["spring",  "summer"],
        cue: "Before the berries form",
        source: { name: "Lewis Ginter Botanical Garden — Nandina: A “Dirty Dozen” Plant", url: "https://www.lewisginter.org/nandina/" },
      },
    },
  },
  {
    id: "rhamnus-cathartica",
    common: "Common buckthorn",
    latin: "Rhamnus cathartica",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Inner bark", text: "Scrape a twig: the layer under the bark is orange." },
      { part: "thorn", feature: "Twig tips", text: "Many end in a short sharp spine, between a pair of buds." },
      { part: "fruit", feature: "Berries", text: "Black, pea-sized, in clusters along the stems, hanging into winter." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings and lever out stems up to thumb-thick with a weed wrench, roots and all." },
        { method: "cover", text: "Cut bigger stems low and tie a black plastic bag over each stump for a year, so it can't resprout." },
        { method: "repeat", text: "Seedlings come up for about five years: pull them every spring." },
      ],
      dispose: "Berried branches go in the bin; bare wood can be chipped.",
      basis: "Morton Arboretum; Illinois Natural History Survey; Midwest Invasive Plant Network.",
      // "spring and summer treatments resulted in 4 to 8 times more common
      // buckthorn sprouts in July than when treatments were applied in either
      // fall or winter"
      window: {
        seasons: ["fall",  "winter"],
        cue: "Cut late in the year for fewer sprouts",
        source: { name: "USDA Forest Service FEIS — Rhamnus cathartica, R. davurica", url: "https://www.fs.usda.gov/database/feis/plants/shrub/rhaspp/all.html" },
      },
    },
  },
  {
    id: "lonicera-maackii",
    common: "Amur honeysuckle",
    latin: "Lonicera maackii",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Twigs", text: "Snap one: the middle is hollow. A native honeysuckle's is solid." },
      { part: "leaf", feature: "Leaves", text: "Pointed tips, in pairs — green before anything else in spring, and after everything else in fall." },
      { part: "fruit", feature: "Berries", text: "Translucent red, in pairs along the stem, lasting into winter." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull small shrubs and lever out bigger ones: the roots are shallow." },
        { method: "timing", text: "Go in early spring or late fall, when it's the only green in the woods." },
        { method: "repeat", text: "Pull the seedlings that follow for a few years." },
      ],
      dispose: "Berried branches go in the bin.",
      basis: "Morton Arboretum; Ohio State Extension; Midwest Invasive Plant Network.",
      // "Generally two cuts per year are recommended, one in early spring
      // followed by one in the late summer or early autumn. Cuts made in the
      // winter while the plant is dormant will only encourage vigorous
      // resprouting."
      window: {
        seasons: ["spring",  "summer",  "fall"],
        cue: "Cut in early spring and late summer, never dormant",
        source: { name: "Virginia DCR — Invasive Alien Plant Species of Virginia: Bush Honeysuckles", url: "https://www.dcr.virginia.gov/natural-heritage/document/fslobe.pdf" },
      },
    },
  },
  {
    id: "dipsacus-laciniatus",
    common: "Cut-leaved teasel",
    latin: "Dipsacus laciniatus",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flower heads", text: "Spiny egg-shaped heads with a ring of white flowers, on stalks taller than a person." },
      { part: "leaf", feature: "Leaves", text: "Deeply cut, in pairs fused around the stem into a cup that holds rainwater." },
      { part: "stem", feature: "Stems", text: "Ridged with rows of downward prickles." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out first-year rosettes with a spade, taking the top of the long taproot." },
        { method: "cut", text: "Cut flowering stalks at the base before the heads turn brown — later, they ripen seed on the ground." },
        { method: "repeat", text: "Its seed lasts a few years: keep at it every summer." },
      ],
      dispose: "Bag cut flower heads; don't leave them lying.",
      basis: "Illinois Natural History Survey; Morton Arboretum; Midwest Invasive Plant Network.",
      // "Mature plants can be cut in complete bud stage … July"
      window: {
        seasons: ["summer"],
        cue: "Cut stalks in full bud, before bloom",
        source: { name: "Wisconsin DNR — Cut-leaved teasel (Dipsacus laciniatus)", url: "https://dnr.wisconsin.gov/topic/Invasives/fact/CutLeavedTeasel" },
      },
    },
  },
  {
    id: "cytisus-scoparius",
    common: "Scotch broom",
    latin: "Cytisus scoparius",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Stems", text: "Green, ridged and nearly leafless — the plant looks like a broom." },
      { part: "flower", feature: "Flowers", text: "Bright yellow pea-flowers all along the stems in spring." },
      { part: "fruit", feature: "Pods", text: "Flat, turning black, and snapping open with a click in summer." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull small plants when the ground is wet." },
        { method: "cut", text: "Cut big ones at ground level in late summer, in dry weather: cut then, they seldom resprout." },
        { method: "repeat", text: "Its seed lasts decades in the soil, so pull seedlings every year and cover bare ground with plants or mulch." },
      ],
      dispose: "Bag plants carrying pods; plants without seed can be left to rot.",
      basis: "King County Noxious Weeds; Washington State Noxious Weed Control Board.",
      // "Lop plants to within 3 inches of the soil during the driest period only
      // (late July through early October). Lopping during moist periods will
      // stimulate vigorous sprouting."
      window: {
        seasons: ["summer",  "fall"],
        cue: "Cut only in the driest weeks",
        source: { name: "Oregon State University Extension — Invasive Weeds in Forest Land: Brooms (EC 1598)", url: "https://extension.oregonstate.edu/sites/extd8/files/documents/ec1598.pdf" },
      },
    },
  },
  {
    id: "spartium-junceum",
    common: "Spanish broom",
    latin: "Spartium junceum",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Stems", text: "Round, smooth and rush-like, with hardly a leaf." },
      { part: "flower", feature: "Flowers", text: "Large yellow pea-flowers, sweetly scented, spring into summer." },
      { part: "shape", feature: "Size", text: "Taller than a person, and taller than Scotch broom." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull small plants when the ground is wet." },
        { method: "cut", text: "Cut big ones at ground level in the dry season, and cut any resprouts." },
        { method: "repeat", text: "Pull seedlings every year: the seed lives long in the soil." },
      ],
      dispose: "Bag plants carrying pods.",
      basis: "California Invasive Plant Council.",
      // "Hand-pulling can be effective when shrubs are still small and the
      // entire root structure can be removed. ... The best time to hand-pull is
      // between July and September, especially when the soil is dry."
      window: {
        seasons: ["summer",  "fall"],
        cue: "Pull small shrubs when the soil is dry",
        source: { name: "Washington State Noxious Weed Control Board — Spanish broom", url: "https://www.nwcb.wa.gov/weeds/spanish-broom" },
      },
    },
  },
  {
    id: "genista-monspessulana",
    common: "French broom",
    latin: "Genista monspessulana",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Leafy stems, each leaf split into three small, hairy leaflets." },
      { part: "flower", feature: "Flowers", text: "Yellow pea-flowers in small clusters on short side shoots." },
      { part: "fruit", feature: "Pods", text: "Short and covered in silvery hairs." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull small plants when the ground is wet, with a weed lever for bigger ones." },
        { method: "cut", text: "Cut the biggest at ground level in the dry season, and cut any resprouts." },
        { method: "repeat", text: "Pull seedlings every year and cover bare ground: the seed lasts decades." },
      ],
      dispose: "Bag plants carrying pods.",
      basis: "California Invasive Plant Council.",
      // "Lop plants to within 3 inches of the soil during the driest period only
      // (late July through early October). Lopping during moist periods will
      // stimulate vigorous sprouting."
      window: {
        seasons: ["summer",  "fall"],
        cue: "Cut only in the driest weeks",
        source: { name: "Oregon State University Extension — Invasive Weeds in Forest Land: Brooms (EC 1598)", url: "https://extension.oregonstate.edu/sites/extd8/files/documents/ec1598.pdf" },
      },
    },
  },
  {
    id: "rubus-armeniacus",
    common: "Himalayan blackberry",
    latin: "Rubus armeniacus",
    form: "shrub",
    marks: [
      { part: "stem", feature: "Canes", text: "Thick, ridged and arching, with big hooked thorns." },
      { part: "leaf", feature: "Leaves", text: "Usually five leaflets, whitish underneath." },
      { part: "fruit", feature: "Fruit", text: "Large, sweet blackberries in late summer." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut the canes to the ground." },
        { method: "dig", text: "Dig out the root crowns — the knobbly base — or they send up new canes." },
        { method: "replant", text: "Cut new shoots as they come, and plant shade over the patch: it hates shade." },
      ],
      dispose: "Canes root where they touch soil: pile them on a tarp to dry out.",
      basis: "King County Noxious Weeds; California Invasive Plant Council.",
      // "Removal of top growth by mowing, cutting, or grazing with goats will
      // kill blackberry if done often (spring and fall) over several years."
      window: {
        seasons: ["spring",  "fall"],
        cue: "Cut back often, year after year",
        source: { name: "King County — Himalayan blackberry identification and control", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/himalayan-blackberry" },
      },
    },
  },
  {
    id: "urena-lobata",
    common: "Caesarweed",
    latin: "Urena lobata",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Maple-shaped, soft and hairy." },
      { part: "flower", feature: "Flowers", text: "Small pink flowers, like a tiny hibiscus." },
      { part: "fruit", feature: "Burs", text: "Little burs that cling to socks and fur." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it before the burs ripen; the roots come up easily." },
        { method: "gear", text: "Wear long sleeves: the burs cling." },
        { method: "repeat", text: "Pull the seedlings that follow for a season or two." },
      ],
      dispose: "Bag the burs.",
      basis: "UF/IFAS Extension.",
    },
  },
  {
    id: "ardisia-crenata",
    common: "Coral ardisia",
    latin: "Ardisia crenata",
    form: "shrub",
    marks: [
      { part: "fruit", feature: "Berries", text: "Bright red clusters hanging below the leaves, all year." },
      { part: "leaf", feature: "Leaves", text: "Dark and glossy, with small bumps along a wavy edge." },
      { part: "where", feature: "Where", text: "Knee-high carpets on the shady floor of a wood." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it by hand with the whole root: a broken root resprouts." },
        { method: "bag", text: "Strip and bag the berries first." },
        { method: "repeat", text: "Check the spot every year: the seed keeps sprouting." },
      ],
      dispose: "Bag the berries; don't compost them.",
      basis: "UF/IFAS Extension; Florida Invasive Species Council.",
      // "bright red berries fall and through winter … when fruit are not
      // present"
      window: {
        seasons: ["spring",  "summer"],
        cue: "When no red berries are on the plant",
        source: { name: "Bugwood Wiki (UGA Center for Invasive Species and Ecosystem Health) — Hen's Eyes, Coral Ardisia", url: "https://wiki.bugwood.org/Archive:MGIPSF/Hen%E2%80%99s_Eyes,_Coral_Ardisia" },
      },
    },
  },
  {
    id: "ardisia-elliptica",
    common: "Shoebutton ardisia",
    latin: "Ardisia elliptica",
    form: "shrub",
    marks: [
      { part: "fruit", feature: "Berries", text: "Red, then glossy black, like the buttons on an old boot." },
      { part: "leaf", feature: "Leaves", text: "Thick and leathery; new leaves come out pink." },
      { part: "flower", feature: "Flowers", text: "Pale pink stars in clusters under the leaves." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings and small plants with the whole root." },
        { method: "dig", text: "Cut bigger ones and dig out the stump: it resprouts." },
        { method: "bag", text: "Strip and bag the berries first, and recheck every year." },
      ],
      dispose: "Bag the berries; don't compost them.",
      basis: "UF/IFAS Extension; Florida Invasive Species Council.",
    },
  },
  {
    id: "ludwigia-peruviana",
    common: "Peruvian primrose-willow",
    latin: "Ludwigia peruviana",
    form: "shrub",
    marks: [
      { part: "flower", feature: "Flowers", text: "Big, bright yellow, with four round petals." },
      { part: "leaf", feature: "Leaves", text: "Hairy and lance-shaped." },
      { part: "where", feature: "Where", text: "Standing in water at lake edges, ditches and marshes." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull young plants from the mud, roots and all." },
        { method: "pro", text: "Stands in public water need a permit — ask the state's invasive-plant office." },
        { method: "repeat", text: "Come back for regrowth: every stem piece can root." },
      ],
      dispose: "Bag every fragment; don't leave any near water.",
      basis: "UF/IFAS Center for Aquatic and Invasive Plants.",
      // "Hand removal can occur from spring to autumn when plants are young"
      window: {
        seasons: ["spring",  "summer",  "fall"],
        cue: "Pull young plants, spring to autumn",
        source: { name: "Central West Local Land Services (NSW) — Peruvian primrose weed management guide", url: "https://www.narromine.nsw.gov.au/__media_downloads/weed-guides/12575849%20_PWCW_NSC_Peruvian%20Primrose_230427.pdf" },
      },
    },
  },
  {
    id: "agave-americana",
    common: "Century plant",
    latin: "Agave americana",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Huge, fleshy and blue-gray, tipped with a spine and edged with hooks." },
      { part: "flower", feature: "Flower", text: "One mast taller than a house, after many years — then the plant dies." },
      { part: "shape", feature: "Offsets", text: "Ringed by young rosettes rising from its roots." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out young offsets whole." },
        { method: "dig", text: "Cut big plants below the growing heart and dig out the base: roots left behind regrow." },
        { method: "gear", text: "Wear thick gloves and eye protection: the spines are sharp and the sap burns." },
      ],
      dispose: "Let the pieces dry out off the soil, then bin them.",
      basis: "CBN Méditerranéen; INVMED.",
      // "The flowering season is normally between May and June … Pulling should
      // be done before flowering"
      window: {
        seasons: ["spring"],
        cue: "Before the flower stalk rises",
        source: { name: "Invasoras.pt — Agave americana", url: "https://invasoras.pt/en/invasive-plant/agave-americana" },
      },
    },
  },
  {
    id: "buddleja-davidii",
    common: "Butterfly bush",
    latin: "Buddleja davidii",
    form: "shrub",
    marks: [
      { part: "flower", feature: "Flowers", text: "Long cones of purple or white, honey-scented flowers." },
      { part: "leaf", feature: "Leaves", text: "Long and pointed, felted white underneath." },
      { part: "where", feature: "Where", text: "Old walls, railroad ballast, gravel and riverbanks." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings: they come out easily." },
        { method: "dig", text: "Dig out the stump of a big one; a cut stump resprouts." },
        { method: "cut", text: "If you keep one, cut off every flower spike as it fades, before it seeds." },
      ],
      dispose: "Seed heads go in the bin.",
      basis: "OFB Centre de ressources EEE; RHS.",
      // "Flowers bloom between mid-summer and the first frost in Washington
      // State … Removal of butterfly bush is best when it first comes into
      // flower but has not yet produced seeds"
      window: {
        seasons: ["summer"],
        cue: "When it first flowers, before seeds",
        source: { name: "WSU Hortsense — Weeds: Butterfly bush (Buddleja davidii)", url: "https://hortsense.cahnrs.wsu.edu/fact-sheet/weeds-butterfly-bush-buddleja-davidii/" },
      },
    },
  },
  {
    id: "prunus-laurocerasus",
    common: "Cherry laurel",
    latin: "Prunus laurocerasus",
    form: "shrub",
    marks: [
      { part: "smell", feature: "Smell", text: "Crushed leaves smell of almonds — that's cyanide." },
      { part: "leaf", feature: "Leaves", text: "Big, glossy and bright green." },
      { part: "flower", feature: "Flowers", text: "Upright candles of small white flowers in spring." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings, root and all." },
        { method: "dig", text: "Dig out the stump of bigger ones: a cut stump sprouts back." },
        { method: "gear", text: "Wear gloves, and don't shred it indoors — the crushed leaves give off cyanide." },
      ],
      dispose: "Berried branches go in the bin.",
      basis: "OFB Centre de ressources EEE; National Biodiversity Data Centre.",
      // "undertaking manual control methods prior to fruit maturation is ideal …
      // form in clusters in mid-summer"
      window: {
        seasons: ["spring",  "summer"],
        cue: "Before the cherries ripen",
        source: { name: "Metro Vancouver — Best Management Practices for Cherry Laurel", url: "https://metrovancouver.org/services/regional-planning/Documents/cherry-laurel-best-management-practices.pdf" },
      },
    },
  },
  {
    id: "rhododendron-ponticum",
    common: "Pontic rhododendron",
    latin: "Rhododendron ponticum",
    form: "shrub",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Leathery, dark and evergreen, paler underneath." },
      { part: "flower", feature: "Flowers", text: "Big mauve trusses in early summer." },
      { part: "where", feature: "Where", text: "Dense thickets under oak woods, with bare ground beneath." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull seedlings and small bushes, root and all." },
        { method: "dig", text: "Cut big bushes at the base and dig out the stump, or cut every resprout until it gives up." },
        { method: "avoid", text: "Don't leave branches lying on soil: they take root." },
      ],
      dispose: "Pile cut branches off the ground to dry out.",
      basis: "National Biodiversity Data Centre; NatureScot.",
      // "This method should be avoided during the bird nesting season (March to
      // August in UK)"
      window: {
        seasons: ["fall",  "winter"],
        cue: "Cut outside the bird nesting season",
        source: { name: "GB Non-Native Species Secretariat — Rhododendron Toolkit: Methods of Control", url: "https://www.nonnativespecies.org/assets/Rhododendron-Toolkit_English_Methods-of-Control.pdf" },
      },
    },
  },
  // ---------------- Perennials ----------------
  {
    id: "alliaria-petiolata",
    common: "Garlic mustard",
    latin: "Alliaria petiolata",
    form: "perennial",
    marks: [
      { part: "smell", feature: "Smell", text: "Crush a leaf: it smells of garlic." },
      { part: "leaf", feature: "Leaves", text: "Kidney-shaped and scalloped low down; triangular and toothed up the stem." },
      { part: "flower", feature: "Flowers", text: "Small, white, four petals in a cross, in spring." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it in spring, before the seed forms, when the soil is moist — with the top of the root." },
        { method: "bag", text: "Bag plants already in flower: pulled, they can still ripen seed." },
        { method: "repeat", text: "Pull again every spring: the seed lasts about five years." },
      ],
      dispose: "Bag it; don't compost plants in flower or seed.",
      basis: "Penn State Extension; Michigan Natural Features Inventory.",
      // "Begin pulling garlic mustard when the plants are bolting in early
      // April. Flowering plants are most visible in late April to early May"
      window: {
        seasons: ["spring"],
        cue: "As flower stalks start to rise",
        source: { name: "King County Noxious Weed Control Program — Best Management Practices: Garlic Mustard", url: "https://www.nwcb.wa.gov/images/weeds/Garlic-Mustard-Control_King.pdf" },
      },
    },
  },
  {
    id: "rapistrum-rugosum",
    common: "Bastard cabbage",
    latin: "Rapistrum rugosum",
    form: "annual",
    marks: [
      { part: "flower", feature: "Flowers", text: "Small four-petalled yellow flowers on tall branching stems, in late winter and spring." },
      { part: "leaf", feature: "Leaves", text: "A flat rosette of rough, deeply lobed leaves in winter." },
      { part: "fruit", feature: "Seed pods", text: "Short pods pressed against the stem, each ending in a little beak." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull the winter rosettes before they bolt; the taproot comes out easily from moist soil." },
        { method: "timing", text: "Pull or mow before the first pods form in spring, or each plant leaves thousands of seeds." },
        { method: "replant", text: "Sow native wildflowers like bluebonnet and Engelmann daisy in autumn, so the bare ground isn't left for its seedlings." },
      ],
      dispose: "Bag plants that have started to set pods.",
      basis: "Lady Bird Johnson Wildflower Center; Texas Invasive Species Institute.",
      // "prior to early May … is flowering now and it will soon set seed"
      window: {
        seasons: ["spring"],
        cue: "While flowering, before the pods set",
        source: { name: "Lady Bird Johnson Wildflower Center — Is Early May OK for Roguing Bastard Cabbage?", url: "https://www.wildflower.org/expert/show.php?id=9136" },
      },
    },
  },
  {
    id: "reynoutria-japonica",
    common: "Japanese knotweed",
    latin: "Reynoutria japonica",
    form: "perennial",
    marks: [
      { part: "stem", feature: "Stems", text: "Hollow, jointed canes like bamboo, speckled purple." },
      { part: "leaf", feature: "Leaves", text: "Shield-shaped with a flat base, zigzagging up the stem." },
      { part: "flower", feature: "Flowers", text: "Sprays of tiny cream flowers in late summer." },
    ],
    removal: {
      steps: [
        { method: "avoid", text: "Don't dig, strim or mow it: a small piece of root grows a new plant." },
        { method: "cut", text: "Cut or pull every stem to the ground every few weeks through the growing season, for years, to starve the roots." },
        { method: "pro", text: "A big stand is a job for a professional." },
      ],
      dispose: "Never compost or dump it: dry the stems on a tarp until dead, then bin them.",
      basis: "OFB Centre de ressources EEE; Penn State Extension; National Biodiversity Data Centre.",
      // "CUT stems close to the ground TWICE A MONTH OR MORE between at least
      // April and August, and then once a month or more until the first frost"
      window: {
        seasons: ["spring",  "summer"],
        cue: "Cut to the ground twice a month",
        source: { name: "King County Noxious Weed Control Program — Best Management Practices: Invasive Knotweeds", url: "https://www.nwcb.wa.gov/images/weeds/Knotweed_King.pdf" },
      },
    },
  },
  {
    id: "lythrum-salicaria",
    common: "Purple loosestrife",
    latin: "Lythrum salicaria",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flowers", text: "Tall spikes of magenta flowers with crinkled petals." },
      { part: "stem", feature: "Stems", text: "Square, and woody at the base." },
      { part: "where", feature: "Where", text: "Wet ground: ditches, marsh edges, lake shores." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out young plants with the whole root crown." },
        { method: "cut", text: "Cut off the flower spikes before they seed: one plant makes millions of seeds." },
        { method: "pro", text: "A big wetland stand is a job for your local weed program." },
      ],
      dispose: "Bag the flower spikes.",
      basis: "Penn State Extension; Michigan Natural Features Inventory.",
      // "The best time to survey is in July and August when the plants are
      // flowering ... Dig up or pull small isolated patches."
      window: {
        seasons: ["summer"],
        cue: "When the purple flower spikes show",
        source: { name: "King County Noxious Weed Control Program — Best Management Practices: Purple Loosestrife", url: "https://www.nwcb.wa.gov/images/weeds/purple_loosestrife-control_King.pdf" },
      },
    },
  },
  {
    id: "centaurea-stoebe",
    common: "Spotted knapweed",
    latin: "Centaurea stoebe",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flower heads", text: "Pink-purple, like a thistle's, but with no prickles." },
      { part: "flower", feature: "Bracts", text: "The scales under each flower are black-tipped — the “spots”." },
      { part: "leaf", feature: "Leaves", text: "Gray-green, cut into narrow lobes." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it before it seeds, with the top of the taproot." },
        { method: "gear", text: "Wear gloves: the sap can irritate skin." },
        { method: "repeat", text: "Pull again every year: the seed lasts several years." },
      ],
      dispose: "Bag plants with flower heads.",
      basis: "Michigan Natural Features Inventory.",
      // "If soils are moist, plants can be pulled after they bolt but before
      // they flower. Typically this is from May to June."
      window: {
        seasons: ["spring",  "summer"],
        cue: "After it bolts, before it flowers",
        source: { name: "King County Noxious Weed Control Program — Best Management Practices: Spotted Knapweed", url: "https://www.nwcb.wa.gov/images/weeds/Spotted-Knapweed-control_King.pdf" },
      },
    },
  },
  {
    id: "centaurea-solstitialis",
    common: "Yellow star-thistle",
    latin: "Centaurea solstitialis",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flower heads", text: "Yellow, ringed by long stiff spines like a star." },
      { part: "stem", feature: "Stems", text: "Gray-green, cottony, with thin wings along them." },
      { part: "when", feature: "When", text: "Flowering in dry grassland in high summer, when little else does." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull or hoe it in late spring, before the spines and seeds form." },
        { method: "cut", text: "Or mow it at first flower, if no green leaves are left below the blade." },
        { method: "repeat", text: "Keep at it three years: most of the seed is spent by then." },
      ],
      dispose: "Bag plants with flower heads.",
      basis: "California Invasive Plant Council; UC IPM.",
      // "Pull or dig individual plants by hand in May–June, when plants are
      // bolting or as soon as possible afterwards."
      window: {
        seasons: ["spring",  "summer"],
        cue: "As the flower stems shoot up",
        source: { name: "Cal-IPC — How to Remove Bay Area Weeds: Yellow Starthistle", url: "https://www.cal-ipc.org/docs/ip/management/wwh/pdf/19644.pdf" },
      },
    },
  },
  {
    id: "geranium-robertianum",
    common: "Herb Robert",
    latin: "Geranium robertianum",
    form: "perennial",
    marks: [
      { part: "smell", feature: "Smell", text: "Crushed leaves smell bad, like burnt rubber." },
      { part: "leaf", feature: "Leaves", text: "Lacy and deeply cut, often flushed red." },
      { part: "flower", feature: "Flowers", text: "Small, pink, five petals, then a long beak-shaped pod." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it: the shallow roots come up easily." },
        { method: "timing", text: "Pull before the pods fling their seed." },
        { method: "repeat", text: "Repeat through the season, and each year after." },
      ],
      dispose: "Bag plants carrying pods.",
      basis: "King County Noxious Weeds.",
      // "appear from early spring to late fall … hand-pulling should be done
      // before flowering occurs"
      window: {
        seasons: ["winter",  "spring"],
        cue: "Before the first pink flowers open",
        source: { name: "Whatcom County Noxious Weed Control — Control Options for Herb Robert", url: "https://www.nwcb.wa.gov/images/weeds/HerbRobertControl_Whatcom.pdf" },
      },
    },
  },
  {
    id: "jacobaea-vulgaris",
    common: "Tansy ragwort",
    latin: "Jacobaea vulgaris",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flowers", text: "Flat-topped clusters of small yellow daisies." },
      { part: "leaf", feature: "Leaves", text: "Ragged and deeply cut." },
      { part: "wildlife", feature: "Caterpillars", text: "Often striped yellow and black: cinnabar moths, brought in to eat it." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull or dig it with gloves, getting the root crown, before it flowers." },
        { method: "dig", text: "Get every root piece: it resprouts from them." },
        { method: "avoid", text: "Keep it out of hay and pasture: it poisons horses and cattle, even dried." },
      ],
      dispose: "Bag it; never leave it where animals graze.",
      basis: "King County Noxious Weeds; Washington State Noxious Weed Control Board.",
      // "Seedlings and rosettes can be dug up as soon as they appear. This is
      // easiest in fall and spring when soils are softer but can be done
      // anytime."
      window: {
        seasons: ["spring",  "fall"],
        cue: "Dig rosettes while the soil is soft",
        source: { name: "King County — Tansy ragwort identification and control", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/tansy-ragwort" },
      },
    },
  },
  {
    id: "oncosiphon-pilulifer",
    common: "Stinknet",
    latin: "Oncosiphon pilulifer",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flowers", text: "Yellow buttons, no petals, like little balls." },
      { part: "smell", feature: "Smell", text: "Brush it and it smells sharp, like turpentine." },
      { part: "leaf", feature: "Leaves", text: "Finely cut and lacy." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull young plants before they flower, wearing gloves." },
        { method: "bag", text: "Bag them straight away: pulled plants still ripen seed." },
        { method: "repeat", text: "Pull again the next winter and spring." },
      ],
      dispose: "Bag it; don't compost it.",
      basis: "California Invasive Plant Council.",
      // "map an entire population in the spring when it is easy to detect, and
      // then remove that population the following fall or winter when a new crop
      // of stinknet plants germinate."
      window: {
        seasons: ["fall",  "winter"],
        cue: "When the new seedlings come up",
        source: { name: "UC Statewide IPM Program — Stinknet", url: "https://ipm.ucanr.edu/natural-area-pests/stinknet/" },
      },
    },
  },
  {
    id: "impatiens-glandulifera",
    common: "Himalayan balsam",
    latin: "Impatiens glandulifera",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flowers", text: "Pink, shaped like a policeman's helmet." },
      { part: "stem", feature: "Stems", text: "Thick, hollow, reddish and brittle, taller than a person." },
      { part: "fruit", feature: "Pods", text: "Burst open when touched, flinging the seeds." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it before it flowers: it comes up with almost no effort." },
        { method: "water", text: "Start upstream and work down: the seed travels with the water." },
        { method: "repeat", text: "Pull again for two or three years, until the seed runs out." },
      ],
      dispose: "Leave pulled plants in a heap off wet ground, or bag plants in flower.",
      basis: "OFB Centre de ressources EEE; National Biodiversity Data Centre.",
      // "Pull or dig up plants in the spring or early summer when the soil is
      // still soft. Make sure to do this before seed capsules form."
      window: {
        seasons: ["spring",  "summer"],
        cue: "Before the seed pods form",
        source: { name: "King County — Policeman's helmet identification and control", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/policemans-helmet" },
      },
    },
  },
  {
    id: "senecio-inaequidens",
    common: "Narrow-leaved ragwort",
    latin: "Senecio inaequidens",
    form: "perennial",
    marks: [
      { part: "flower", feature: "Flowers", text: "Yellow daisies from summer until the frosts." },
      { part: "leaf", feature: "Leaves", text: "Narrow, almost like grass blades." },
      { part: "where", feature: "Where", text: "Roadsides, railroads, vineyards and sunny waste ground." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it with gloves, getting the root crown, before it seeds." },
        { method: "bag", text: "Bag plants already in flower." },
        { method: "repeat", text: "Check again through the year: it flowers from spring until the frosts." },
      ],
      dispose: "Bag it; don't compost plants in flower.",
      basis: "OFB Centre de ressources EEE; CBN de Brest.",
      // "Période d’intervention : mai à novembre"
      window: {
        seasons: ["spring",  "summer",  "fall"],
        cue: "Pull by hand two or three times a year",
        source: { name: "Canton de Vaud — Fiche F4-10 Séneçon du Cap", url: "https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Bo%C3%AEte_%C3%A0_outils_pour_les_communes/FIche_F4-10.pdf" },
      },
    },
  },
  {
    id: "phytolacca-americana",
    common: "American pokeweed",
    latin: "Phytolacca americana",
    form: "perennial",
    marks: [
      { part: "stem", feature: "Stems", text: "Thick, smooth and magenta-red." },
      { part: "fruit", feature: "Berries", text: "Drooping clusters of shiny purple-black berries. Poisonous." },
      { part: "leaf", feature: "Leaves", text: "Big, smooth and oval." },
    ],
    removal: {
      steps: [
        { method: "bag", text: "Cut off the berry clusters first and bag them." },
        { method: "dig", text: "Dig out the whole thick taproot: a piece left behind regrows." },
        { method: "gear", text: "Wear gloves: every part is poisonous." },
      ],
      dispose: "Bag the berries; the rest can go in the bin.",
      basis: "OFB Centre de ressources EEE; CBN Alpin.",
      // "First-year plants can be hand removed, particularly early in the
      // growing season."
      window: {
        seasons: ["spring"],
        cue: "First-year plants, early in the season",
        source: { name: "Penn State Extension — Common Pokeweed Identification and Management", url: "https://extension.psu.edu/common-pokeweed-identification-and-management" },
      },
    },
  },
  {
    id: "gunnera-tinctoria",
    common: "Chilean rhubarb",
    latin: "Gunnera tinctoria",
    form: "perennial",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Enormous, like rhubarb, wider than an umbrella." },
      { part: "stem", feature: "Stalks", text: "Thick and covered in soft spines." },
      { part: "flower", feature: "Flowers", text: "A cone of tiny flowers like a bottle brush." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut off the flower spikes before they seed." },
        { method: "dig", text: "Dig out small plants with the whole rhizome — the thick crown at the base." },
        { method: "pro", text: "A big clump is a job for a professional." },
      ],
      dispose: "Don't dump pieces: they root.",
      basis: "National Biodiversity Data Centre; Invasive Species Ireland.",
      // "cutting off the flower heads each summer before they set seed"
      window: {
        seasons: ["summer"],
        cue: "Cut flower heads before they set seed",
        source: { name: "NatureScot — Public can help prevent spread of invasive aliens as ban comes into force", url: "https://presscentre.nature.scot/news/public-can-help-spread-of-invasive-aliens-as-ban-comes-into-force" },
      },
    },
  },
  // ---------------- Grasses ----------------
  {
    id: "sorghum-halepense",
    common: "Johnsongrass",
    latin: "Sorghum halepense",
    form: "grass",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Broad blades, up to an inch wide, with a bold white midrib." },
      { part: "flower", feature: "Seed heads", text: "Loose, open, reddish-purple plumes on stems up to head height." },
      { part: "root", feature: "Roots", text: "Thick white runners underground, that snap and regrow from every piece." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Fork out young clumps with all the white runners; every piece left resprouts." },
        { method: "cut", text: "Mow or cut big stands to the ground before they seed, again and again: it weakens the runners." },
        { method: "cover", text: "Smother a patch under thick cardboard and mulch for a full growing season." },
      ],
      dispose: "Bag seed heads and runners; don't compost them.",
      basis: "Texas A&M AgriLife Extension; Texas Invasive Species Institute.",
      // "Hand-pulling Johnsongrass usually leaves rhizome pieces behind in the
      // soil, stimulating sprouting. … Best results are obtained in early spring
      // when soil in moist and rhizomes are least likely to break"
      window: {
        seasons: ["spring"],
        cue: "In moist soil, before the rhizomes snap",
        source: { name: "USDA Forest Service FEIS — Sorghum halepense", url: "https://www.fs.usda.gov/database/feis/plants/graminoid/sorhal/all.html" },
      },
    },
  },
  {
    id: "arundo-donax",
    common: "Giant reed",
    latin: "Arundo donax",
    form: "grass",
    marks: [
      { part: "stem", feature: "Stems", text: "Thick canes like bamboo, far taller than a person." },
      { part: "leaf", feature: "Leaves", text: "Broad, gray-green blades hugging the cane all the way up." },
      { part: "flower", feature: "Plumes", text: "Big feathery plumes in late summer." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out small clumps with every piece of rhizome." },
        { method: "pro", text: "A big stand is a job for a professional." },
        { method: "water", text: "Never leave cut canes near a stream: pieces root in water." },
      ],
      dispose: "Dry the canes out well away from water, then bin them.",
      basis: "California Invasive Plant Council.",
    },
  },
  {
    id: "cortaderia-selloana",
    common: "Pampas grass",
    latin: "Cortaderia selloana",
    form: "grass",
    marks: [
      { part: "flower", feature: "Plumes", text: "Tall, silvery or pink, held high over the clump." },
      { part: "leaf", feature: "Leaves", text: "Long and arching, with edges that cut bare skin." },
      { part: "shape", feature: "Clump", text: "A dense fountain wider than your arm span." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut the plumes and bag them before they open." },
        { method: "dig", text: "Dig out the whole clump with a mattock: a cut clump regrows." },
        { method: "gear", text: "Wear gloves and long sleeves: the leaves cut." },
      ],
      dispose: "Bag the plumes; the leaves can go in the bin.",
      basis: "California Invasive Plant Council; OFB Centre de ressources EEE.",
      // "Cutting and removing or burning the inflorescence prior to seed
      // maturation in late summer may be important if seed production occurs in
      // escaped populations of pampas grass."
      window: {
        seasons: ["summer"],
        cue: "Cut the plumes before the seed ripens",
        source: { name: "Cal-IPC — IPCW Plant Report: Cortaderia selloana", url: "https://www.cal-ipc.org/resources/library/publications/ipcw/report35/" },
      },
    },
  },
  // ---------------- Vines ----------------
  {
    id: "celastrus-orbiculatus",
    common: "Asian bittersweet",
    latin: "Celastrus orbiculatus",
    form: "vine",
    marks: [
      { part: "fruit", feature: "Berries", text: "Yellow husks open on orange-red berries, all along the stem." },
      { part: "leaf", feature: "Leaves", text: "Round, glossy and finely toothed." },
      { part: "stem", feature: "Stems", text: "Twining around trees tightly enough to strangle them." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut every vine at the base, then pull the orange roots: they resprout." },
        { method: "avoid", text: "Don't pull vines down from a tree: cut them and let them die in place." },
        { method: "repeat", text: "Pull the seedlings birds bring back, every year." },
      ],
      dispose: "Berried vines go in the bin.",
      basis: "Penn State Extension.",
      // "Cutting can be done at any time of year."
      window: {
        seasons: [], anyTime: true,
        cue: "Cut any time of year",
        source: { name: "Penn State Extension — Oriental Bittersweet", url: "https://extension.psu.edu/oriental-bittersweet" },
      },
    },
  },
  {
    id: "hedera-helix",
    common: "English ivy",
    latin: "Hedera helix",
    form: "vine",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Evergreen, lobed on climbing stems, plain ovals on flowering ones." },
      { part: "stem", feature: "Stems", text: "Hairy rootlets glue it to bark and walls." },
      { part: "fruit", feature: "Berries", text: "Round clusters of black berries in late winter." },
    ],
    removal: {
      steps: [
        { method: "cut", text: "Cut every vine climbing a tree, at the base and at shoulder height; leave the top to die in place." },
        { method: "pull", text: "Pull the carpet on the ground by hand, rolling it up like a rug." },
        { method: "repeat", text: "Pull the regrowth for a year or two." },
      ],
      dispose: "Let it dry out off the soil before binning: stems root where they lie.",
      basis: "King County Noxious Weeds; Penn State Extension.",
      // "For ivy growing on the ground: Pull or dig up plants. Try to get as
      // much root as possible. Fall through spring is usually the best time for
      // this because the soil is less hard."
      window: {
        seasons: ["fall",  "winter",  "spring"],
        cue: "When the soil is soft",
        source: { name: "King County — Common ivy", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/common-ivy" },
      },
    },
  },
  {
    id: "abrus-precatorius",
    common: "Rosary pea",
    latin: "Abrus precatorius",
    form: "vine",
    marks: [
      { part: "fruit", feature: "Seeds", text: "Glossy scarlet with a black spot. Deadly if chewed." },
      { part: "leaf", feature: "Leaves", text: "Feathery, with many small leaflets in pairs." },
      { part: "stem", feature: "Stems", text: "Thin and twining over shrubs." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull the vines, following each one to its root." },
        { method: "bag", text: "Collect and bag every seed pod — keep them away from children and pets." },
        { method: "gear", text: "Wear gloves, and pull seedlings for a few years." },
      ],
      dispose: "Bag the seeds; never compost them.",
      basis: "UF/IFAS Extension.",
    },
  },
  {
    id: "dioscorea-bulbifera",
    common: "Air potato",
    latin: "Dioscorea bulbifera",
    form: "vine",
    marks: [
      { part: "fruit", feature: "Bulbils", text: "Potato-like lumps hanging from the vine." },
      { part: "leaf", feature: "Leaves", text: "Big and heart-shaped, with curved veins." },
      { part: "stem", feature: "Stems", text: "Twining right up to the tops of trees." },
    ],
    removal: {
      steps: [
        { method: "bag", text: "Collect every potato-like bulbil: each one grows a new vine." },
        { method: "dig", text: "Pull the vines and dig out the tuber underground." },
        { method: "repeat", text: "Repeat every year; Florida has also released beetles that eat it." },
      ],
      dispose: "Bag the bulbils; never compost them.",
      basis: "UF/IFAS Extension; Florida Invasive Species Council.",
      // "Plants become dormant in winter (during short day-length). Locating and
      // removing bulbils is easier during winter months when air potato and
      // other vegetation are not as dense."
      window: {
        seasons: ["winter"],
        cue: "When vines die back: gather the bulbils",
        source: { name: "UF/IFAS Extension — Invasive Plants in Natural Areas: Air Potato (Dioscorea bulbifera)", url: "https://ask.ifas.ufl.edu/publication/AG112" },
      },
    },
  },
  // ---------------- Groundcovers ----------------
  {
    id: "carpobrotus-edulis",
    common: "Highway ice plant",
    latin: "Carpobrotus edulis",
    form: "groundcover",
    marks: [
      { part: "leaf", feature: "Leaves", text: "Fat, fleshy and three-sided, like fingers." },
      { part: "flower", feature: "Flowers", text: "Big, yellow or pink, with many narrow petals." },
      { part: "shape", feature: "Habit", text: "Thick mats over dunes and cliffs, reddening in the sun." },
    ],
    removal: {
      steps: [
        { method: "pull", text: "Pull it by hand, rolling the mat up like a carpet." },
        { method: "bag", text: "Get every fragment: pieces root." },
        { method: "replant", text: "Replant the bare ground with natives, or it comes back." },
      ],
      dispose: "Bag it; don't leave pieces on sand or soil.",
      basis: "California Invasive Plant Council; Conservatoire du littoral.",
      // "Mechanical removal is effective at any time of year."
      window: {
        seasons: [], anyTime: true,
        cue: "Pull any time of year",
        source: { name: "Cal-IPC — IPCW Plant Report: Carpobrotus edulis", url: "https://www.cal-ipc.org/resources/library/publications/ipcw/report25/" },
      },
    },
  },
  {
    id: "securigera-varia",
    common: "Crown vetch",
    latin: "Securigera varia",
    form: "groundcover",
    marks: [
      { part: "flower", feature: "Flowers", text: "Pink-and-white pea-flowers in a round crown on a long stalk." },
      { part: "leaf", feature: "Leaves", text: "Many small leaflets in pairs, with no tendrils." },
      { part: "shape", feature: "Habit", text: "Sprawling mats over roadside banks and dunes." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out small patches, roots and all." },
        { method: "cut", text: "Cut or mow bigger patches before they flower, several times a year, for several years." },
        { method: "cover", text: "Or smother a patch under thick cardboard or a tarp for a season." },
      ],
      dispose: "Bag plants carrying seed pods.",
      basis: "Michigan Natural Features Inventory.",
      // "Mowing to control crownvetch spread may be most effective in the late
      // spring or at flower bud stage"
      window: {
        seasons: ["spring"],
        cue: "Mow at the flower-bud stage",
        source: { name: "USDA Forest Service FEIS — Securigera varia", url: "https://www.fs.usda.gov/database/feis/plants/forb/secvar/all.html" },
      },
    },
  },
  {
    id: "oxalis-pes-caprae",
    common: "Bermuda buttercup",
    latin: "Oxalis pes-caprae",
    form: "groundcover",
    marks: [
      { part: "flower", feature: "Flowers", text: "Bright yellow bells, in winter and spring." },
      { part: "leaf", feature: "Leaves", text: "Like clover: three heart-shaped leaflets, often spotted." },
      { part: "when", feature: "When", text: "Carpets the ground, then vanishes underground by summer." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out the little bulbs in winter, while it's green and easy to find." },
        { method: "dig", text: "Pulling the leaves leaves the bulbs: dig deep." },
        { method: "cover", text: "Cover dug patches with thick mulch." },
      ],
      dispose: "Bag the bulbs; don't compost them.",
      basis: "California Invasive Plant Council; CBN Méditerranéen.",
      // "It develops from bulbs that sprout and grow in the fall. … Flowers
      // appear in late winter or early spring. … Cut Bermuda buttercup before it
      // flowers and forms new bulbs."
      window: {
        seasons: ["fall",  "winter"],
        cue: "Before it flowers and forms new bulbs",
        source: { name: "UC IPM — Creeping Woodsorrel and Bermuda Buttercup", url: "https://ipm.ucanr.edu/home-and-landscape/creeping-woodsorrel-and-bermuda-buttercup/" },
      },
    },
  },
  // ---------------- Ferns ----------------
  {
    id: "nephrolepis-cordifolia",
    common: "Tuberous sword fern",
    latin: "Nephrolepis cordifolia",
    form: "fern",
    marks: [
      { part: "root", feature: "Roots", text: "Small round tubers on the roots, like beads." },
      { part: "leaf", feature: "Fronds", text: "Upright and narrow, with many small leaflets." },
      { part: "shape", feature: "Habit", text: "Dense colonies spreading on wiry runners." },
    ],
    removal: {
      steps: [
        { method: "dig", text: "Dig out the whole plant, with the round tubers." },
        { method: "dig", text: "Sift the soil: any tuber left behind grows back." },
        { method: "repeat", text: "Pull the regrowth for a season." },
      ],
      dispose: "Bag it; don't compost the tubers.",
      basis: "UF/IFAS Extension.",
    },
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
const IL = "Illinois Exotic Weed Act and its official list (Illinois DNR); Morton Arboretum; Midwest Invasive Plant Network.";
const MI = "Michigan Natural Features Inventory, Invasive Species Best Control Practices; Midwest Invasive Species Information Network.";
const WA = "Washington State Noxious Weed Control Board.";
const PACA = "INVMED — CBN Méditerranéen & CBN Alpin, liste des EVEE de Provence-Alpes-Côte d'Azur.";
const GE = "CBN Nord-Est, CBA & CBN Bassin parisien, liste catégorisée des EEE du Grand Est (2020).";
const FR_ATL = "CBN de Brest, liste des plantes vasculaires invasives de Bretagne; OFB Centre de ressources EEE.";
const FR_ALP = "CBN Alpin, espèces végétales exotiques envahissantes des Alpes; OFB Centre de ressources EEE.";
const TX = "Texas Invasive Species Institute, Invaders of Texas (texasinvasives.org).";
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
  chicago: [
    { invasiveId: "rhamnus-cathartica", basis: IL },
    { invasiveId: "lonicera-maackii", basis: IL },
    { invasiveId: "alliaria-petiolata", basis: IL },
    { invasiveId: "dipsacus-laciniatus", basis: IL },
    { invasiveId: "lythrum-salicaria", basis: IL },
  ],
  "north-michigan": [
    { invasiveId: "centaurea-stoebe", basis: MI },
    { invasiveId: "elaeagnus-umbellata", basis: MI },
    { invasiveId: "securigera-varia", basis: MI },
    { invasiveId: "lythrum-salicaria", basis: MI },
    { invasiveId: "lonicera-morrowii", basis: MI },
  ],
  "central-texas": [
    { invasiveId: "melia-azedarach", basis: TX },
    { invasiveId: "sorghum-halepense", basis: TX },
    { invasiveId: "rapistrum-rugosum", basis: TX },
    { invasiveId: "ligustrum-lucidum", basis: TX },
    { invasiveId: "nandina-domestica", basis: TX },
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
