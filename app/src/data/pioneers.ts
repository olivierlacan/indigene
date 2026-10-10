// Pavement pioneers — the natives that take a beating.
//
// Shape and reasoning live on `PioneerPressure` / `PioneerEntry` in `types.ts`.
// Two things to know before editing this file:
//
//   1. **A row is a claim about a region, not a species.** Silver birch is a
//      pioneer on a Breton building site and on an Alpine moraine, and the two
//      rows say different things because the hard part is different. A plant
//      that is merely easy-going in a region doesn't get a row there.
//
//   2. **Eight rows is plenty.** This is the short list a reader scans while
//      standing in front of a bad patch of ground — not a second roster. If a
//      ninth candidate is better than one already here, swap it; don't append.
//
// The nickname credits Joey Santore (Crime Pays But Botany Doesn't). The list
// is ours, and so is any mistake in it.
import type { PioneerEntry, PioneerPressure } from "../types";

/**
 * The pressures, in the order they're shown wherever several appear together.
 * Ground first, then air, then what gets done to the place — which is roughly
 * the order somebody looking at a bad patch notices them.
 */
export const PRESSURE_ORDER: PioneerPressure[] = [
  "compaction",
  "poor-soil",
  "crevice",
  "salt",
  "reflected-heat",
  "drought",
  "disturbance",
];

/** The emoji each pressure wears in a chip. The app's icon idiom. */
export const PRESSURE_ICON: Record<PioneerPressure, string> = {
  compaction: "👣",
  "poor-soil": "🪨",
  crevice: "🕳️",
  salt: "🧂",
  "reflected-heat": "🌡️",
  drought: "🏜️",
  disturbance: "🚜",
};

/**
 * The icon the list itself wears — in the roster's section heading, its chip
 * and the plant page's line.
 *
 * Deliberately not 🚧, which this app has already spent on the
 * translation-in-progress banner (`components/wip-banner.ts`): roadworks there
 * mean "we are still building this", and the same sign next to a plant would
 * read as a warning about the entry rather than about the ground.
 */
export const PIONEER_ICON = "🧱";

// ---- The rows: region → plant id → why it belongs ----
//
// Read a line as a sentence: in `mid-atlantic`, `schizachyrium-scoparium`
// (little bluestem) takes `poor-soil`, `drought` and `reflected-heat`,
// "because …", per `basis`.
export const PIONEERS: Record<string, Record<string, PioneerEntry>> = {
  "mid-atlantic": {
    "schizachyrium-scoparium": {
      pressures: ["poor-soil", "drought", "reflected-heat", "disturbance"],
      note: "The grass you see on railway ballast and the gravel shoulder of a road — it wants thin, starved ground, and in a fed bed it flops over instead.",
      basis: "USDA PLANTS; LBJ Wildflower Center; Missouri Botanical Garden.",
    },
    "asclepias-tuberosa": {
      pressures: ["poor-soil", "drought", "reflected-heat"],
      note: "A roadside bank plant with a deep taproot, at home in sand and gravel too poor for most things. It resents being moved once that root is down, so sow it where you want it.",
      basis: "LBJ Wildflower Center; Missouri Botanical Garden; USDA PLANTS.",
    },
    "rudbeckia-fulgida": {
      pressures: ["compaction", "disturbance", "poor-soil"],
      note: "One of the first things to appear on scraped ground, and it keeps flowering in the heavy clay of a verge that gets walked across.",
      basis: "Missouri Botanical Garden; LBJ Wildflower Center.",
    },
    "prunus-serotina": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "The tree that shows up in vacant lots and alleys without being planted — birds sow it, and it will start in rubble against a fence.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America.",
    },
    "betula-nigra": {
      pressures: ["compaction", "disturbance"],
      note: "Takes the thing that kills most street trees: ground that is waterlogged in March and baked hard by July. The one native birch that shrugs off heat here.",
      basis: "Morton Arboretum; Missouri Botanical Garden; USDA Silvics of North America.",
    },
    "panicum-virgatum": {
      pressures: ["salt", "compaction", "poor-soil"],
      note: "Salt-tolerant enough for the strip a snowplough throws grit onto, with roots deep enough to hold a bank while they're at it.",
      basis: "USDA PLANTS; Rutgers NJAES; Morton Arboretum.",
    },
    "ceanothus-americanus": {
      pressures: ["poor-soil", "drought", "reflected-heat"],
      note: "Makes its own nitrogen, so a dry sterile bank of subsoil is a reasonable offer. Deep-rooted and nearly impossible to transplant later.",
      basis: "LBJ Wildflower Center; Missouri Botanical Garden; USDA PLANTS.",
    },
    "parthenocissus-quinquefolia": {
      pressures: ["crevice", "poor-soil", "compaction", "drought"],
      note: "Climbs brick and chain-link from a crack at the bottom of a wall, with adhesive pads rather than the roots that damage mortar.",
      basis: "Missouri Botanical Garden; Penn State Extension; LBJ Wildflower Center.",
    },
  },

  "north-michigan": {
    "populus-tremuloides": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "The textbook pioneer: bare mineral soil after a fire or a bulldozer, and a clone spreading from root suckers within a few years.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America.",
    },
    "betula-papyrifera": {
      pressures: ["disturbance", "poor-soil"],
      note: "Seeds into raw sand and gravel where nothing is shading it yet — which is also why it fades out of a garden that has grown up around it.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America.",
    },
    "arctostaphylos-uva-ursi": {
      pressures: ["poor-soil", "drought", "salt", "reflected-heat"],
      note: "An evergreen mat that holds bare sand and road gravel, and takes the salt spray of a winter highway shoulder.",
      basis: "USDA PLANTS; Morton Arboretum; Missouri Botanical Garden.",
    },
    "schizachyrium-scoparium": {
      pressures: ["poor-soil", "drought", "reflected-heat", "disturbance"],
      note: "Thin sandy ground is where it wins — the old-field and railway-grade grass of the north, russet all winter.",
      basis: "USDA PLANTS; USFS Fire Effects Information System; LBJ Wildflower Center.",
    },
    "anaphalis-margaritacea": {
      pressures: ["disturbance", "poor-soil", "drought"],
      note: "Colonises road cuts and gravel pits almost as soon as they're made, in grey felted clumps that go on standing after they dry.",
      basis: "USFS Fire Effects Information System; USDA PLANTS.",
    },
    "campanula-rotundifolia": {
      pressures: ["crevice", "poor-soil", "drought"],
      note: "Roots in the seam of a dry stone wall and the thin grit of a rock ledge — a few inches of grit is a whole site to it.",
      basis: "USDA PLANTS; Missouri Botanical Garden; LBJ Wildflower Center.",
    },
    "rudbeckia-hirta": {
      pressures: ["disturbance", "compaction", "poor-soil", "reflected-heat"],
      note: "Flowers in its first or second year on ground that has just been dug or driven over, then reseeds itself into the next bare patch.",
      basis: "USFS Fire Effects Information System; Missouri Botanical Garden; USDA PLANTS.",
    },
    "salix-discolor": {
      pressures: ["disturbance", "compaction"],
      note: "Takes the roadside ditch that floods in spring and cracks in August, and roots from a cut twig pushed into wet ground.",
      basis: "USDA PLANTS; USFS Fire Effects Information System.",
    },
  },

  pnw: {
    "chamaenerion-angustifolium": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "The plant that follows machinery. It covered London's bomb sites under its other name, rosebay willowherb, and it does the same to a road cut here.",
      basis: "USFS Fire Effects Information System; Burke Herbarium (University of Washington).",
    },
    "alnus-rubra": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Makes its own nitrogen, so it starts on raw cut-and-fill subsoil with no topsoil at all and leaves the ground better than it found it.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America; Oregon State University.",
    },
    "populus-trichocarpa": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "A gravel-bar tree that reads a fill pile as a gravel bar. Fast, big, and brittle — give it room away from the roof.",
      basis: "USDA Silvics of North America; Burke Herbarium (University of Washington).",
    },
    "holodiscus-discolor": {
      pressures: ["poor-soil", "drought", "reflected-heat", "crevice"],
      note: "The shrub hanging off dry road cuts and rocky banks all through the Puget lowlands, flowering in cream plumes with its roots in rubble.",
      basis: "Burke Herbarium (University of Washington); Oregon State University; WSU Extension.",
    },
    "grindelia-integrifolia": {
      pressures: ["salt", "compaction", "poor-soil", "drought"],
      note: "A salt-marsh edge plant, which makes a salted kerbside and a windblown car park margin near the water ordinary conditions for it.",
      basis: "Burke Herbarium (University of Washington); USDA PLANTS.",
    },
    "sedum-oreganum": {
      pressures: ["crevice", "poor-soil", "drought", "reflected-heat"],
      note: "Lives on bare rock with no soil worth the name, so a wall top, a gravel seam or a shallow green roof suits it exactly.",
      basis: "Burke Herbarium (University of Washington); Oregon State University; WSU Extension.",
    },
    "arctostaphylos-uva-ursi": {
      pressures: ["poor-soil", "drought", "salt", "reflected-heat"],
      note: "The mat used on road shoulders and gravel banks because it takes the grit, the glare and the winter salt without irrigation.",
      basis: "Oregon State University; USDA PLANTS; WSU Extension.",
    },
    "achillea-millefolium": {
      pressures: ["compaction", "drought", "disturbance", "poor-soil"],
      note: "Grows in the mown verge and the trodden path edge, flat to the ground where it gets walked on and upright where it doesn't.",
      basis: "USFS Fire Effects Information System; Burke Herbarium (University of Washington); USDA PLANTS.",
    },
  },

  "ca-south-coast": {
    "baccharis-pilularis": {
      pressures: ["compaction", "poor-soil", "drought", "disturbance"],
      note: "The green thing on every freeway bank and graded lot in California. Cut slopes of raw subsoil are its best habitat, not its worst.",
      basis: "Calscape (California Native Plant Society); USFS Fire Effects Information System; Calflora.",
    },
    "eschscholzia-californica": {
      pressures: ["disturbance", "poor-soil", "reflected-heat", "drought"],
      note: "Sows itself into the gravel at the edge of a path and comes back each spring from its own seed, asking for nothing in between.",
      basis: "Calscape (California Native Plant Society); LBJ Wildflower Center; Calflora.",
    },
    "eriogonum-fasciculatum": {
      pressures: ["poor-soil", "drought", "reflected-heat", "disturbance"],
      note: "Standard planting for decomposed-granite road cuts — it holds a raw slope and then feeds more insects doing it than almost anything else here.",
      basis: "Calscape (California Native Plant Society); Xerces Society; Calflora.",
    },
    "encelia-californica": {
      pressures: ["poor-soil", "drought", "reflected-heat", "disturbance"],
      note: "A fast, short-lived shrub for a hot embankment, yellow for months and then dormant and grey through the worst of the drought.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
    "acmispon-glaber": {
      pressures: ["disturbance", "poor-soil", "drought"],
      note: "First onto bare ground after a fire or a grader, and a nitrogen fixer, so it's doing the soil's repair work while it covers it.",
      basis: "USFS Fire Effects Information System; Calscape (California Native Plant Society).",
    },
    "rhus-integrifolia": {
      pressures: ["salt", "drought", "poor-soil", "reflected-heat"],
      note: "Takes salt wind straight off the sea and the heat off a south wall, which is why it ended up on so many coastal freeway banks.",
      basis: "Calscape (California Native Plant Society); UC Agriculture & Natural Resources; Calflora.",
    },
    "muhlenbergia-rigens": {
      pressures: ["compaction", "drought", "reflected-heat", "poor-soil"],
      note: "The tough bunchgrass for a car park island — heavy soil, reflected heat, and an occasional car door, all survivable.",
      basis: "Calscape (California Native Plant Society); UC Agriculture & Natural Resources.",
    },
    "dudleya-pulverulenta": {
      pressures: ["crevice", "drought", "reflected-heat", "poor-soil"],
      note: "A chalk-white rosette growing sideways out of a rock face or a road cut. Planted level in soil it rots; planted in a crack it lives for years.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
  },

  "ca-central-coast": {
    "baccharis-pilularis": {
      pressures: ["compaction", "poor-soil", "drought", "disturbance"],
      note: "The first native back on a graded lot or a cut slope, and the one shrub that will knit raw subsoil together with no help at all.",
      basis: "Calscape (California Native Plant Society); USFS Fire Effects Information System; Calflora.",
    },
    "eschscholzia-californica": {
      pressures: ["disturbance", "poor-soil", "reflected-heat", "drought"],
      note: "Reseeds itself into path gravel and the gap behind a kerb, flowering before the dry season starts and then leaving seed behind.",
      basis: "Calscape (California Native Plant Society); Calflora; LBJ Wildflower Center.",
    },
    "erigeron-glaucus": {
      pressures: ["salt", "crevice", "poor-soil", "drought"],
      note: "A bluff-top plant that grows in sand and rock seams in the face of salt wind, so a windy coastal pavement edge is no hardship.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
    "heuchera-micrantha": {
      pressures: ["crevice", "poor-soil", "drought"],
      note: "Crevice alumroot is named for where it lives — a damp seam in a rock face or a shaded retaining wall, in next to no soil.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
    "stipa-pulchra": {
      pressures: ["compaction", "drought", "poor-soil", "disturbance"],
      note: "California's state grass holds on in heavy compacted clay that bakes solid in summer, with roots going down several feet to do it.",
      basis: "Calscape (California Native Plant Society); UC Agriculture & Natural Resources; Calflora.",
    },
    "epilobium-canum": {
      pressures: ["poor-soil", "drought", "reflected-heat", "crevice"],
      note: "Flowers scarlet in the hottest, driest weeks of late summer out of a rocky bank or a wall foot, exactly when the garden has given up.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
    "eriophyllum-staechadifolium": {
      pressures: ["salt", "drought", "poor-soil", "reflected-heat"],
      note: "A coastal-bluff shrub built for salt wind and loose sand, grey-woolly against the glare and flowering yellow most of the summer.",
      basis: "Calscape (California Native Plant Society); Calflora.",
    },
    "achillea-millefolium": {
      pressures: ["compaction", "drought", "disturbance", "poor-soil"],
      note: "Takes being trodden on and mown, in the packed ground of a verge or the strip beside a drive.",
      basis: "USFS Fire Effects Information System; Calscape (California Native Plant Society); USDA PLANTS.",
    },
  },

  "florida-central": {
    "sabal-palmetto": {
      pressures: ["compaction", "salt", "poor-soil", "drought"],
      note: "Florida's state tree is also its toughest street tree: packed fill, salt, flood, drought and hurricane wind, with no branches to lose.",
      basis: "UF/IFAS; Florida Native Plant Society; USDA Silvics of North America.",
    },
    "ilex-vomitoria": {
      pressures: ["compaction", "salt", "poor-soil", "drought"],
      note: "The shrub that survives car parks — compacted fill, reflected heat and salt, and it still fruits for the birds.",
      basis: "UF/IFAS; Florida Native Plant Society; LBJ Wildflower Center.",
    },
    "muhlenbergia-capillaris": {
      pressures: ["poor-soil", "drought", "reflected-heat", "salt"],
      note: "Wants the starved sand of a parking island, where it throws a pink haze of seed heads in October and asks for no water.",
      basis: "UF/IFAS; Florida Native Plant Society.",
    },
    "helianthus-debilis": {
      pressures: ["salt", "poor-soil", "reflected-heat", "drought"],
      note: "A dune plant, so bare hot sand and salt spray are its ordinary conditions — it will sprawl along a kerb edge all summer.",
      basis: "UF/IFAS; Florida Native Plant Society.",
    },
    "coreopsis-leavenworthii": {
      pressures: ["disturbance", "compaction", "poor-soil"],
      note: "The tickseed sown along Florida's highways: it comes up in mown, scraped roadside ground and reseeds itself before the mower returns.",
      basis: "Florida Wildflower Foundation; UF/IFAS.",
    },
    "callicarpa-americana": {
      pressures: ["poor-soil", "drought", "disturbance"],
      note: "Appears on its own along fence lines and disturbed edges, bird-sown, and fruits magenta whether or not anyone tends it.",
      basis: "UF/IFAS; Florida Native Plant Society; LBJ Wildflower Center.",
    },
    "tripsacum-dactyloides": {
      pressures: ["compaction", "disturbance"],
      note: "Built for the roadside swale that is a pond in August and concrete-hard in April — a big coarse clump that holds the bank either way.",
      basis: "UF/IFAS; USDA PLANTS.",
    },
  },

  "florida-south": {
    "coccoloba-uvifera": {
      pressures: ["salt", "poor-soil", "drought", "reflected-heat"],
      note: "Grows on the open beach in salt spray and shifting sand, which makes a hot limestone-fill verge an easy posting.",
      basis: "Institute for Regional Conservation; UF/IFAS; Florida Native Plant Society.",
    },
    "conocarpus-erectus": {
      pressures: ["salt", "compaction", "poor-soil", "drought"],
      note: "A mangrove-edge tree, so brackish water and packed limestone fill are both fine. It is already the standard Miami street tree for that reason.",
      basis: "Institute for Regional Conservation; UF/IFAS.",
    },
    "bursera-simaruba": {
      pressures: ["poor-soil", "drought", "reflected-heat", "salt"],
      note: "Roots into bare limestone rubble and holds in a hurricane by shedding branches rather than falling — a cut limb will even root where it lands.",
      basis: "Institute for Regional Conservation; UF/IFAS; Florida Native Plant Society.",
    },
    "morella-cerifera": {
      pressures: ["disturbance", "poor-soil", "compaction", "salt"],
      note: "Makes its own nitrogen and seeds itself into abandoned ground within a year or two, from scraped fill to a salted ditch bank.",
      basis: "USFS Fire Effects Information System; UF/IFAS; Institute for Regional Conservation.",
    },
    "chrysobalanus-icaco": {
      pressures: ["salt", "poor-soil", "compaction", "drought"],
      note: "The hedge behind half of South Florida's car parks, because it takes salt, limestone fill and shearing and keeps its leaves anyway.",
      basis: "Institute for Regional Conservation; UF/IFAS; Florida Native Plant Society.",
    },
    "stachytarpheta-jamaicensis": {
      pressures: ["disturbance", "poor-soil", "reflected-heat", "drought"],
      note: "Turns up in pavement cracks and roadside gravel of its own accord, and is one of the best butterfly plants in the region while it's there.",
      basis: "Institute for Regional Conservation; UF/IFAS; Florida Native Plant Society.",
    },
    "muhlenbergia-capillaris": {
      pressures: ["poor-soil", "drought", "reflected-heat", "salt"],
      note: "Thrives in the starved sand of a planting island and needs no watering once it has a season behind it.",
      basis: "UF/IFAS; Institute for Regional Conservation.",
    },
    "passiflora-suberosa": {
      pressures: ["disturbance", "poor-soil", "crevice", "drought"],
      note: "Scrambles up chain-link and alley hedges from a crack in the concrete, feeding three local butterflies as it goes.",
      basis: "Institute for Regional Conservation; Florida Museum of Natural History; UF/IFAS.",
    },
  },

  "st-lawrence": {
    "populus-tremuloides": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "The textbook pioneer: bare mineral soil after a fire or a bulldozer, and a clone spreading from root suckers within a few years.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America; Michigan Flora.",
    },
    "betula-papyrifera": {
      pressures: ["disturbance", "poor-soil"],
      note: "Seeds into raw sand and gravel where nothing is shading it yet — which is also why it fades out of a garden that has grown up around it.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America.",
    },
    "panicum-virgatum": {
      pressures: ["salt", "compaction", "poor-soil"],
      note: "Salt matters more here than almost anywhere: this takes the strip a plough throws grit onto, and holds the bank while it does.",
      basis: "USDA PLANTS; Rutgers NJAES; Morton Arboretum.",
    },
    "arctostaphylos-uva-ursi": {
      pressures: ["poor-soil", "drought", "salt", "reflected-heat"],
      note: "An evergreen mat for bare sand and road gravel that takes a winter of salt spray without irrigation.",
      basis: "USDA PLANTS; Morton Arboretum; Michigan Flora.",
    },
    "schizachyrium-scoparium": {
      pressures: ["poor-soil", "drought", "reflected-heat", "disturbance"],
      note: "The grass of railway ballast and thin dry shoulders — starved ground is where it wins, and a fed bed makes it flop.",
      basis: "USDA PLANTS; LBJ Wildflower Center; Michigan Flora.",
    },
    "anaphalis-margaritacea": {
      pressures: ["disturbance", "poor-soil", "drought"],
      note: "Colonises road cuts and gravel pits almost as soon as they are made, in grey felted clumps that stand after they dry.",
      basis: "USFS Fire Effects Information System; USDA PLANTS.",
    },
    "campanula-rotundifolia": {
      pressures: ["crevice", "poor-soil", "drought"],
      note: "Roots in the seam of a dry stone wall and the grit of a rock ledge. A few inches of grit is a whole site to it.",
      basis: "USDA PLANTS; Michigan Flora; Missouri Botanical Garden.",
    },
    "prunus-serotina": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Turns up in back lanes and vacant lots without being planted — birds sow it, and it will start in rubble against a fence.",
      basis: "USFS Fire Effects Information System; USDA Silvics of North America.",
    },
  },

  ireland: {
    "ulex-europaeus": {
      pressures: ["poor-soil", "disturbance", "drought", "salt"],
      note: "Gorse makes its own nitrogen, so a railway cutting or a bank of poor acid subsoil is a reasonable offer — and it flowers there in February.",
      basis: "BSBI Plant Atlas; National Biodiversity Data Centre; All-Ireland Pollinator Plan.",
    },
    "taraxacum-officinale": {
      pressures: ["compaction", "crevice", "disturbance", "poor-soil"],
      note: "The plant in the pavement crack. A taproot that gets through packed ground, and the first real pollen of the year for a lot of insects.",
      basis: "BSBI Plant Atlas; National Biodiversity Data Centre; All-Ireland Pollinator Plan.",
    },
    "betula-pubescens": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Appears by itself on cutaway bog, quarry floors and building sites — light seed, bare ground, and no help needed.",
      basis: "BSBI Plant Atlas; Woodland Trust; National Biodiversity Data Centre.",
    },
    "rosa-spinosissima": {
      pressures: ["crevice", "poor-soil", "salt", "drought"],
      note: "Burnet rose grows in the grikes of limestone pavement and in bare dune sand, low and thorny against the wind off the Atlantic.",
      basis: "BSBI Plant Atlas; National Biodiversity Data Centre.",
    },
    "hedera-helix": {
      pressures: ["crevice", "poor-soil", "drought", "compaction"],
      note: "Climbs a bare wall from a crack at its foot, in dry shade where nothing else will grow, and flowers in October when little else does.",
      basis: "BSBI Plant Atlas; Royal Horticultural Society; National Biodiversity Data Centre.",
    },
    "asplenium-scolopendrium": {
      pressures: ["crevice", "poor-soil"],
      note: "Lives in the mortar of a shaded wall, a well shaft or a basement area — damp lime and almost no soil, and green all winter.",
      basis: "BSBI Plant Atlas; British Pteridological Society; National Biodiversity Data Centre.",
    },
    "plantago-lanceolata": {
      pressures: ["compaction", "disturbance", "drought", "poor-soil"],
      note: "Grows flat in the middle of a trodden path and upright at its edge. One of the few plants that is genuinely better for being walked on.",
      basis: "BSBI Plant Atlas; National Biodiversity Data Centre.",
    },
    "festuca-rubra": {
      pressures: ["salt", "compaction", "poor-soil", "drought"],
      note: "The fine grass of salted verges and sea walls, tolerant enough of both to be a standard part of coastal and roadside mixes.",
      basis: "BSBI Plant Atlas; National Biodiversity Data Centre.",
    },
  },

  "nz-auckland": {
    "metrosideros-excelsa": {
      pressures: ["crevice", "salt", "poor-soil", "reflected-heat"],
      note: "Pōhutukawa grows out of bare sea cliffs and lava rock in the salt wind. A kerbside pit and a crack in a seawall are the same offer, gentler.",
      basis: "New Zealand Plant Conservation Network; Metcalf, The Cultivation of New Zealand Native Plants; Project Crimson.",
    },
    "leptospermum-scoparium": {
      pressures: ["poor-soil", "disturbance", "drought", "compaction"],
      note: "Mānuka is the first thing back on a slip, a cutting or a worked-out paddock, and it shelters whatever comes next.",
      basis: "New Zealand Plant Conservation Network; Manaaki Whenua – Landcare Research; Metcalf, The Cultivation of New Zealand Native Plants.",
    },
    "cordyline-australis": {
      pressures: ["compaction", "poor-soil", "drought", "salt"],
      note: "Tī kōuka stands in car park islands and roadside clay that is a puddle in winter and brick in February, and resprouts from the trunk if it is cut.",
      basis: "New Zealand Plant Conservation Network; Metcalf, The Cultivation of New Zealand Native Plants.",
    },
    "phormium-tenax": {
      pressures: ["compaction", "poor-soil", "salt", "disturbance"],
      note: "Harakeke takes heavy compacted fill, brackish ground and a hard chop, and holds a raw bank together with a mat of roots.",
      basis: "New Zealand Plant Conservation Network; Manaaki Whenua – Landcare Research.",
    },
    "muehlenbeckia-complexa": {
      pressures: ["crevice", "poor-soil", "drought", "reflected-heat"],
      note: "Pōhuehue scrambles over rubble, rock and chain-link in a wiry tangle, and keeps feeding copper butterflies while it does it.",
      basis: "New Zealand Plant Conservation Network; Manaaki Whenua – Landcare Research.",
    },
    "disphyma-australe": {
      pressures: ["crevice", "salt", "reflected-heat", "drought"],
      note: "Horokaka is a succulent mat off coastal rock and cliff seams — full salt, full glare, and no soil to speak of.",
      basis: "New Zealand Plant Conservation Network; Metcalf, The Cultivation of New Zealand Native Plants.",
    },
    "ficinia-nodosa": {
      pressures: ["poor-soil", "salt", "compaction", "drought"],
      note: "Wīwī holds bare dune sand and salted fill, which is why it keeps turning up in stormwater basins and street planters.",
      basis: "New Zealand Plant Conservation Network; Manaaki Whenua – Landcare Research.",
    },
    "coprosma-repens": {
      pressures: ["salt", "reflected-heat", "poor-soil", "drought"],
      note: "Taupata takes salt wind straight off the sea and the heat off a wall, glossy through all of it, and clips into a hedge.",
      basis: "New Zealand Plant Conservation Network; Metcalf, The Cultivation of New Zealand Native Plants.",
    },
  },

  kanto: {
    "zelkova-serrata": {
      pressures: ["compaction", "reflected-heat", "drought", "poor-soil"],
      note: "Keyaki already lines Tokyo's avenues, because it takes packed ground, reflected heat and a root space the size of a tree pit.",
      basis: "Morton Arboretum; Royal Horticultural Society; Kew Plants of the World Online.",
    },
    "artemisia-princeps": {
      pressures: ["disturbance", "poor-soil", "compaction", "drought"],
      note: "Yomogi is the plant of every Japanese vacant lot and riverbank path — and the one picked for mochi in spring.",
      basis: "Kew Plants of the World Online; Royal Horticultural Society.",
    },
    "celtis-sinensis": {
      pressures: ["disturbance", "poor-soil", "crevice", "compaction"],
      note: "Enoki seeds itself into shrine walls and roadside gaps, bird-sown, and its leaves feed the larvae of Japan's national butterfly.",
      basis: "Kew Plants of the World Online; Royal Horticultural Society.",
    },
    "parthenocissus-tricuspidata": {
      pressures: ["crevice", "poor-soil", "drought", "compaction"],
      note: "Tsuta climbs bare concrete from a crack at the bottom with adhesive pads rather than the roots that damage mortar.",
      basis: "Morton Arboretum; Royal Horticultural Society; Kew Plants of the World Online.",
    },
    "miscanthus-sinensis": {
      pressures: ["poor-soil", "disturbance", "drought", "reflected-heat"],
      note: "Susuki is the grass that takes an embankment or a bare cut slope and turns it silver by October.",
      basis: "Kew Plants of the World Online; Morton Arboretum; Royal Horticultural Society.",
    },
    "lespedeza-bicolor": {
      pressures: ["poor-soil", "disturbance", "drought", "reflected-heat"],
      note: "Yama-hagi fixes its own nitrogen, which is why it is sown on raw cut slopes — it covers the subsoil and feeds it at the same time.",
      basis: "USDA PLANTS; Kew Plants of the World Online; Royal Horticultural Society.",
    },
    "trachelospermum-asiaticum": {
      pressures: ["compaction", "reflected-heat", "drought", "crevice"],
      note: "Teikakazura is the evergreen mat used on Japanese road embankments and retaining walls: it roots as it runs and takes the glare.",
      basis: "Royal Horticultural Society; Kew Plants of the World Online.",
    },
    "ophiopogon-japonicus": {
      pressures: ["compaction", "drought", "poor-soil"],
      note: "Ryū-no-hige is the dark tufted edging of Japanese car parks and shrine paths, holding in packed dry ground and deep shade alike.",
      basis: "Royal Horticultural Society; Missouri Botanical Garden; Kew Plants of the World Online.",
    },
  },

  "france-atlantic": {
    "betula-pendula": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "The tree that turns up by itself in railway ballast, on a building site and on a neglected flat roof. Light seed, bare ground, no help needed.",
      basis: "Tela Botanica; BSBI Plant Atlas; Woodland Trust.",
    },
    "salix-caprea": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Colonises rubble and quarry spoil within a few seasons, and roots from a cutting pushed straight into the ground. Its March catkins are the first real meal of the year for queen bumblebees.",
      basis: "Tela Botanica; BSBI Plant Atlas; Woodland Trust.",
    },
    "artemisia-vulgaris": {
      pressures: ["disturbance", "poor-soil", "compaction", "drought"],
      note: "The tall grey-green plant on every patch of waste ground and pavement edge in Europe — it is the definition of ruderal here.",
      basis: "Sauvages de ma rue (MNHN & Tela Botanica); Tela Botanica; BSBI Plant Atlas.",
    },
    "plantago-lanceolata": {
      pressures: ["compaction", "disturbance", "drought", "poor-soil"],
      note: "Grows flat in the middle of a trodden path and upright at its edge. One of the few plants that is genuinely better for being walked on.",
      basis: "Sauvages de ma rue (MNHN & Tela Botanica); BSBI Plant Atlas; Tela Botanica.",
    },
    "rubus-fruticosus": {
      pressures: ["disturbance", "poor-soil", "compaction", "drought"],
      note: "Takes over rubble, fences and abandoned corners on its own. Worth siting deliberately rather than regretting — it does not stop where you put it.",
      basis: "Tela Botanica; BSBI Plant Atlas; Butterfly Conservation.",
    },
    "hedera-helix": {
      pressures: ["crevice", "poor-soil", "drought", "compaction"],
      note: "Climbs a bare wall from a crack at its foot, in dry shade where nothing else will grow, and flowers in October when little else does.",
      basis: "Tela Botanica; RHS; BSBI Plant Atlas.",
    },
    "asplenium-scolopendrium": {
      pressures: ["crevice", "poor-soil"],
      note: "Lives in the mortar of a shaded wall, a well shaft or a cellar light-well — damp lime and almost no soil, and green all winter.",
      basis: "Tela Botanica; BSBI Plant Atlas; Plantlife.",
    },
    "festuca-rubra": {
      pressures: ["salt", "compaction", "poor-soil", "drought"],
      note: "The fine grass of salted verges and sea walls, tolerant enough of both to be the standard component of coastal and roadside mixes.",
      basis: "Tela Botanica; BSBI Plant Atlas; INPN.",
    },
  },

  "france-continental": {
    "betula-pendula": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Seeds itself into railway ballast, gravel pits and cracked yard concrete, and is often the first tree on a site nobody planted.",
      basis: "Tela Botanica; Info Flora; Woodland Trust.",
    },
    "salix-caprea": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Starts on quarry spoil and roadside fill within a couple of seasons, and roots from a cutting pushed straight into the ground.",
      basis: "Tela Botanica; Info Flora; Woodland Trust.",
    },
    "prunus-mahaleb": {
      pressures: ["crevice", "poor-soil", "drought", "reflected-heat"],
      note: "Grows out of limestone walls and quarry rubble across eastern France — bird-sown into a mortar joint, then flowering there for decades.",
      basis: "Tela Botanica; Info Flora; INPN.",
    },
    "clematis-vitalba": {
      pressures: ["disturbance", "poor-soil", "compaction", "drought"],
      note: "Covers chain-link, railway embankments and limestone rubble in a season. Vigorous to a fault — give it something you want hidden.",
      basis: "Tela Botanica; Info Flora; BSBI Plant Atlas.",
    },
    "origanum-vulgare": {
      pressures: ["poor-soil", "drought", "reflected-heat", "crevice"],
      note: "A dry limy bank or a wall top is where it is happiest, and in August it is the busiest thing in the garden for bees and butterflies.",
      basis: "Tela Botanica; Info Flora; RHS Plants for Pollinators.",
    },
    "hedera-helix": {
      pressures: ["crevice", "poor-soil", "drought", "compaction"],
      note: "The one answer to a bare north wall and the dry shade under a hedge, rooting from a crack and flowering late for the autumn insects.",
      basis: "Tela Botanica; RHS; Info Flora.",
    },
    "asplenium-scolopendrium": {
      pressures: ["crevice", "poor-soil"],
      note: "Grows in old mortar in shade — a wall joint, a well, the shaded side of a bridge — and keeps its strap-shaped fronds through winter.",
      basis: "Tela Botanica; Info Flora; Plantlife.",
    },
    "plantago-lanceolata": {
      pressures: ["compaction", "disturbance", "drought", "poor-soil"],
      note: "Holds the packed, mown ground of a verge or a courtyard edge, and feeds the caterpillars of several fritillaries while it does.",
      basis: "Sauvages de ma rue (MNHN & Tela Botanica); Tela Botanica; Butterfly Conservation.",
    },
  },

  "france-mediterranean": {
    "asplenium-ceterach": {
      pressures: ["crevice", "reflected-heat", "drought", "poor-soil"],
      note: "Bakes on a south-facing wall top, curls up brown and apparently dead through the summer, and unrolls green again with the first autumn rain.",
      basis: "Tela Botanica; Conservatoire botanique national méditerranéen; INPN.",
    },
    "asplenium-trichomanes": {
      pressures: ["crevice", "poor-soil", "drought"],
      note: "Its French name means the fern of walls, and that is the whole habitat: a shaded mortar joint, with no soil at all.",
      basis: "Tela Botanica; Conservatoire botanique national méditerranéen; Plantlife.",
    },
    "celtis-australis": {
      pressures: ["compaction", "reflected-heat", "drought", "poor-soil"],
      note: "Already the shade tree of southern French squares, because it takes packed ground, reflected heat and no watering — and it seeds into walls on its own.",
      basis: "Tela Botanica; Conservatoire botanique national méditerranéen; ONF.",
    },
    "pistacia-lentiscus": {
      pressures: ["poor-soil", "drought", "reflected-heat", "salt"],
      note: "Evergreen on bare limestone rubble and salt wind, resprouting from the base after fire or a hard cut.",
      basis: "Conservatoire botanique national méditerranéen; Tela Botanica.",
    },
    "rhamnus-alaternus": {
      pressures: ["poor-soil", "drought", "reflected-heat", "crevice"],
      note: "Bird-sown into walls and the gaps behind kerbs, then evergreen there for years on nothing but rubble and winter rain.",
      basis: "Conservatoire botanique national méditerranéen; Tela Botanica; INPN.",
    },
    "cistus-albidus": {
      pressures: ["disturbance", "poor-soil", "drought", "reflected-heat"],
      note: "One of the first shrubs back after a fire, from seed that needed the heat — grey-leaved and short-lived on the rawest stony ground.",
      basis: "Conservatoire botanique national méditerranéen; Tela Botanica.",
    },
    "helichrysum-stoechas": {
      pressures: ["poor-soil", "drought", "reflected-heat", "salt"],
      note: "A silver cushion on bare sand and gravel, smelling of curry in the heat, at home on a road edge within sight of the sea.",
      basis: "Conservatoire botanique national méditerranéen; Tela Botanica.",
    },
    "salvia-rosmarinus": {
      pressures: ["poor-soil", "drought", "reflected-heat", "crevice"],
      note: "Grows out of a rubble bank or a wall foot with no summer water, and flowers through the mild part of winter when nothing else is open.",
      basis: "Tela Botanica; Conservatoire botanique national méditerranéen; RHS Plants for Pollinators.",
    },
  },

  "france-alpine": {
    "alnus-alnobetula": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Takes raw scree, avalanche tracks and road cuts above the treeline, fixing its own nitrogen into ground that has none.",
      basis: "Info Flora; Tela Botanica; INPN.",
    },
    "betula-pendula": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Seeds into gravel pits, ski-piste cuttings and valley-floor rubble, the first tree onto ground that was bare the year before.",
      basis: "Info Flora; Tela Botanica; Woodland Trust.",
    },
    "salix-caprea": {
      pressures: ["disturbance", "poor-soil", "compaction"],
      note: "Colonises spoil heaps and torrent gravel, and its early catkins matter more here than lower down — little else is open that early in the cold.",
      basis: "Info Flora; Tela Botanica.",
    },
    "dryas-octopetala": {
      pressures: ["poor-soil", "crevice", "drought", "disturbance"],
      note: "The pioneer of raw limestone moraine — a flat evergreen mat that fixes nitrogen and holds loose stone where there is no soil yet.",
      basis: "Info Flora; Tela Botanica; INPN.",
    },
    "anthyllis-vulneraria": {
      pressures: ["poor-soil", "drought", "disturbance", "reflected-heat"],
      note: "Used to re-green ski pistes and road verges in the Alps because it establishes in bare grit and makes its own nitrogen there.",
      basis: "Info Flora; Tela Botanica; INPN.",
    },
    "thymus-serpyllum": {
      pressures: ["compaction", "crevice", "drought", "poor-soil"],
      note: "A flat aromatic mat for a gravel path or a paving joint — it takes being stepped on, and smells better for it.",
      basis: "Info Flora; Tela Botanica; RHS Plants for Pollinators.",
    },
    "lotus-corniculatus": {
      pressures: ["compaction", "poor-soil", "drought", "disturbance"],
      note: "The yellow pea flower of packed road verges and gravel car parks, flowering on ground too poor and too hard for a lawn.",
      basis: "Info Flora; Tela Botanica; BSBI Plant Atlas.",
    },
    "asplenium-viride": {
      pressures: ["crevice", "poor-soil"],
      note: "Roots in damp limestone crevices and old mortar in the shade — a wall or a rock joint is the only place it grows at all.",
      basis: "Info Flora; Tela Botanica; INPN.",
    },
  },
};
