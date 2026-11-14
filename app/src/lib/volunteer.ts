// The planting-day guides (`steps/volunteer.ts`): what each one says, in what
// order, and which sources back each section.
//
// No DOM here, so the router, the prerenderer and the tests can all read it.
// The words themselves are in the dictionaries (`volunteer.<guide>.<section>.…`);
// this file is the shape and the evidence.
//
// ## Two publishers per section
//
// These pages pass on field tips to people about to act on them with a spade,
// so every section names at least two sources from different publishers
// (`volunteer.test.ts` holds that). Checked 13 November 2026: each page below
// was opened and the words quoted beside its row found in it. Two tips heard
// in the field did not survive the check whole, and the pages say what did:
//
//   - "Wash all the pot soil off." Recommended by one WSU specialist, called
//     "experimental, controversial" by WSU's own fact sheet, and not borne out
//     by the one field trial. The page gives both sides and the conditions.
//   - "Knotweed can never go in yard waste." King County's rule is for roots
//     and crowns; fully dried stems may. The page keeps the simple rule (bag
//     it) and says who to ask.
import type { FigureName, SquareName } from "../components/page-art-svg.mjs";

export interface GuideSource {
  id: string;
  /** The page's own title and publisher; a proper noun, never translated. */
  name: string;
  url: string;
}

export const SOURCES: GuideSource[] = [
  // --- Planting from a pot ---------------------------------------------------
  // "Pot-bound plants possess circling roots and unless straightened these
  // roots will continue to circle, decreasing plant stability and increasing
  // the likelihood that girdling and death will eventually occur."
  { id: "wsuInstant", name: "Chalker-Scott — The Myth of Instant Landscaping (Washington State University)", url: "https://wpcdn.web.wsu.edu/wp-puyallup/uploads/sites/403/2015/03/instant-landscaping.pdf" },
  // "Inspect tree root ball for circling roots and straighten, cut, or remove
  // them."; "Holes should be 2–3 times wider than the root ball, but only as
  // deep as the root ball."; "Place a 2–3 inch (5–7.5 cm) layer of mulch".
  { id: "isa", name: "International Society of Arboriculture — Planting a Tree", url: "https://www.treesaregood.org/treeowner/plantingatree" },
  // The same guide, read as the 2022 PDF and on this page. Planting: "Cut or
  // straighten any roots encircling the root ball or growing upward."; "Make a
  // small cone of soil in the bottom of the hole. Arrange the roots around the
  // cone so they all point outward from the plant."; "use the native soil that
  // was dug out of the hole"; the mulch donut "with a 3-inch buffer of bare
  // soil around the stem"; "Incorporate a as much as one gallon of woodchips
  // or mulch with the local soil when planting conifer trees". Weeds: "Most
  // plants require at least three years of establishment care to ensure plant
  // survival."; "Volunteers are highly discouraged from removing knotweed
  // patches as disturbance promotes growth and dispersal."; poison hemlock:
  // "Removal of this plant is not appropriate for a volunteer event."; holly
  // "cuttings can easily re-root"; "Before leaving site, remove plants and mud
  // from boots with a stiff brush".
  { id: "gsp", name: "Green Seattle Partnership — Forest Steward Field Guide", url: "https://www.greenseattle.org/forest-steward-field-guide" },
  // "It is much better for root establishment to remove as much of the
  // container material as possible before the plant is installed."
  { id: "wsuFragile", name: "Chalker-Scott — The Myth of Fragile Roots (Washington State University)", url: "https://wpcdn.web.wsu.edu/wp-puyallup/uploads/sites/403/2015/03/fragile-roots.pdf" },
  // Root washing "is drastic, aggressive, and still being tested"; best "when
  // the plants are young and still dormant, during the cool weather of early
  // spring". Also: "Backfill using only native soil. Do not add any type of
  // organic matter."; "Gently firm the soil around the roots with your hands.
  // Do not compact the soil by stomping on the roots and soil".
  { id: "wsuFs047", name: "Ophardt & Hummel — Planting Trees and Shrubs in the Landscape, FS047E (WSU Extension)", url: "https://wpcdn.web.wsu.edu/wp-ecommerce/uploads/sites/2/product-4004-sku-FS047E.pdf" },
  // "Root biomass outside the original root-ball did not differ among root
  // modification treatments two years post-transplant."; "Nearly all trees
  // bare-rooted before planting in July had severe die-back."
  { id: "rouse", name: "Rouse & Cregg 2021 — Urban Forestry & Urban Greening (Michigan State University)", url: "https://www.canr.msu.edu/profiles/bert_cregg/Rouse%20and%20Cregg.pdf" },
  // "Dig a planting hole that is no deeper than the roots, but is ideally at
  // least three times the diameter of the root system."; "Firm the soil
  // gently, avoiding compacting the soil into a hard mass and water in."
  { id: "rhsPlanting", name: "RHS — Trees and shrubs: planting", url: "https://www.rhs.org.uk/plants/types/trees/planting-trees-shrubs" },
  // "Do not loosen the soil at the bottom of the hole, which will cause the
  // tree to settle over time."; "Avoid putting amendments such as fertilizers
  // and compost in the hole."
  { id: "seattleTrees", name: "City of Seattle, Trees for Seattle — Planting & Care", url: "https://seattle.gov/trees/planting-and-care" },
  // "the best method is to simply return the soil and let water settle it.
  // Avoid compacting the soil by walking or stamping on it."
  { id: "csuPlanting", name: "Colorado State University Extension — The Science of Planting Trees (GardenNotes 633)", url: "https://cmg.extension.colostate.edu/wp-content/uploads/sites/59/2024/10/2024-3-Science-of-Planting-Trees.pdf" },

  // --- Invasives on site -----------------------------------------------------
  // "without effective weed control during establishment and early life of the
  // planting, your RFB may never become a forest."
  { id: "psuBuffers", name: "Penn State — Riparian Forest Buffers (Wildland Weed Management)", url: "https://plantscience.psu.edu/research/projects/wildland-weed-management/publications/working-lands-factsheets/riparian-forest-buffers" },
  // "Getting the sap on your skin, followed by exposure to sunlight, can cause
  // severe burns with blistering and painful dermatitis."
  { id: "kcHogweed", name: "King County Noxious Weed Control Program — Giant hogweed", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/giant-hogweed" },
  // "It is best to bag and dispose of flowering and seeding plant parts, as the
  // compost doesn't get hot enough to kill all the seeds. Plants that spread
  // with fragments (for example, bindweed, knotweed) should also go in the
  // trash"; the rest "can also be left to compost on-site, take care to make
  // sure the plants are not touching the soil as they could re-root."
  { id: "kcPractices", name: "King County Noxious Weed Control Program — Weed control practices", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/weed-control-practices" },
  // "Plant parts that don't have flowers or seeds but may still spread
  // vegetatively should be left on tarps, pavement or other surfaces that
  // prevent them from taking root in the soil."; "Some city compost facilities
  // may be hot enough to kill noxious weed material."; "clean your shoes and
  // clothing of any seeds, plant parts and soil".
  { id: "nwcbDisposal", name: "Washington State Noxious Weed Control Board — Noxious weed disposal", url: "https://www.nwcb.wa.gov/pdfs/Noxious_weed_disposal_2012-1.pdf" },
  // "Do not compost roots, root crowns, or underground stems. Seal in a bag
  // and dispose in trash."; "Do not let cut stems root in moist soil or get
  // into waterways. Dried stems may be composted on site or put into yard
  // waste."
  { id: "kcKnotweed", name: "King County Noxious Weed Control Program — Invasive knotweed", url: "https://kingcounty.gov/en/dept/dnrp/nature-recreation/environment-ecology-conservation/noxious-weeds/identification-control/invasive-knotweed" },
  // "a new plant can grow from pieces of rhizome as small as 1cm"; contaminated
  // soil or plant material "may be classified as controlled waste."
  { id: "govukKnotweed", name: "Environment Agency (gov.uk) — How to stop Japanese knotweed from spreading", url: "https://www.gov.uk/guidance/prevent-japanese-knotweed-from-spreading" },
  // "Viability of seeds was zero within 7 and 15 d of composting for garlic
  // mustard and common buckthorn, respectively, in both years."
  { id: "vanRossum", name: "Van Rossum & Renz — Composting reduces seed viability of garlic mustard and common buckthorn (Invasive Plant Science and Management)", url: "https://www.cambridge.org/core/journals/invasive-plant-science-and-management/article/composting-reduces-seed-viability-of-garlic-mustard-alliaria-petiolata-and-common-buckthorn-rhamnus-cathartica/253CD2F1934682D15D92BC2277F76868" },
  // "REMOVE plants, seeds, animals, and mud from boots, gear, pets, and
  // vehicles. CLEAN gear before entering and leaving a recreation site."
  { id: "playCleanGo", name: "PlayCleanGo (North American Invasive Species Management Association)", url: "https://playcleango.org/" },
  // "People introduce Phytophthoras to new areas by planting diseased plants or
  // by spreading infested soil on equipment and shoes."
  { id: "osuPhytophthora", name: "Oregon State University Extension — How to Prevent Phytophthoras in Restoration Plantings (EM 9398)", url: "https://extension.oregonstate.edu/catalog/pub/em-9398-how-prevent-phytophthoras-restoration-plantings-your-woodlands" },

  // --- Digging among roots ---------------------------------------------------
  // "most of a tree's roots are within the top 18 inches of soil."; "Make all
  // necessary cuts to tree roots cleanly with sharp tools … A clean cut
  // encourages good wound closure and confines the spread of decay."
  { id: "osuTrees", name: "Oregon State University Extension — Protecting trees on construction and development sites (EM 8994)", url: "https://extension.oregonstate.edu/catalog/em-8994-protecting-trees-construction-development-sites" },
  // "Most roots will concentrate in the top 6 to 18 inches of topsoil."; "Most
  // trees replace at least one third of their feeder roots each year."
  { id: "iowaTrees", name: "Iowa State University Extension — Trees and Construction", url: "https://naturalresources.extension.iastate.edu/forestry/care_maintenance/construction.html" },
  // "Dig planting holes as small as possible."; "if you uncover a root two
  // inches or more in diameter, refill the hole and move to a new location.";
  // "Shovels or spades can nick roots or trunk bark".
  { id: "psuUnder", name: "Penn State Extension — Underplanting Trees: Respect the Roots", url: "https://extension.psu.edu/underplanting-trees-respect-the-roots" },
  // "select starter-sized plants and dig a hole just large enough to
  // accommodate the root ball."; "Don't cut or remove larger roots."
  { id: "uvmUnder", name: "University of Vermont Extension — Planting under trees", url: "https://www.uvm.edu/extension/news/planting-under-trees" },
  // "Don't cut roots over 25 mm in diameter, unless advice has been sought";
  // "Make a clean cut and leave as small a wound as possible."
  { id: "hauc", name: "HAUC (UK) — Street works near trees, NG1.10", url: "https://app.hauc-uk.org.uk/sroh-notes-operational-principles-trees" },
  // Black willow, rated good: "poor wound response can result in hollows in
  // the main stem". Weeping willow, rated fair.
  { id: "indianaDnr", name: "Indiana DNR — Tree species and their tolerance to construction stress", url: "https://www.in.gov/dnr/forestry/files/fo-TreesandtheirTolerancetoConstructionStress_08.pdf" },
  // "Push the spade down using leg muscle."; "Keep feet wide apart. Place
  // front foot close to shovel."
  { id: "ccohs", name: "Canadian Centre for Occupational Health and Safety — Shovelling", url: "https://www.ccohs.ca/oshanswers/ergonomics/shovel.html" },
  // "use a narrow-bladed shovel or trowel. Make a slit in the soil, levering
  // back and forth so that the plug will fit into the slit."; "Use a clean,
  // sharp pruner or hori-hori to sever girdling or overly matted roots."
  { id: "forterra", name: "Forterra — Forest Steward Field Guide (Green Shoreline Partnership)", url: "https://forterra.org/wp-content/uploads/2022/07/Forest-Steward-Field-Guide_Green-Shoreline.pdf" },
  // "Avoid working soils when they are too moist. … very moist soils are the
  // easiest to compact."
  { id: "udelCompaction", name: "University of Delaware Cooperative Extension — Combating Soil Compaction", url: "https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/combating-soil-compaction/" },
  // "people working by hand might lay down wooden boards to stand on in order
  // to spread and distribute their weight".
  { id: "dukeCompaction", name: "Duke Gardens — Preventing Soil Compaction", url: "https://gardens.duke.edu/garden-talk/preventing-soil-compaction/" },
  // "For permanent landscapes, however, they are not a long term solution and
  // in fact can hinder landscape plant health."; "Landscape plant roots can
  // also colonize fabrics, and they are damaged when the fabrics are removed."
  { id: "wsuFabric", name: "Chalker-Scott — The Myth of Landscape Fabric (Washington State University)", url: "https://s3.wp.wsu.edu/uploads/sites/403/2015/03/landscape-fabric.pdf" },
  // "small particles of soil or mulch can fill in the small pore spaces in the
  // landscape fabric, reducing the amount of water that reaches the soil".
  { id: "unhFabric", name: "University of New Hampshire Extension — Should I use landscape fabric?", url: "https://extension.unh.edu/blog/2019/05/should-i-use-landscape-fabric-keep-weeds-out-my-perennial-garden" },
  // Poplar is "this non-nodulated early successional pioneer plant species";
  // "it is not possible to accurately extrapolate from the data to whole-tree
  // estimates of N acquired through biological N2-fixation".
  { id: "doty", name: "Doty et al. 2016 — Variable Nitrogen Fixation in Wild Populus (PLOS ONE)", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0155979" },
  // The families that nodulate with Frankia: "Fagales (Betulaceae,
  // Casuarinaceae and Myricaceae), Rosales (Rosaceae, Eleagnaceae and
  // Rhamnaceae) and Cucurbitales". The willow family is not among them.
  { id: "santi", name: "Santi et al. 2013 — Biological nitrogen fixation in non-legume plants (Annals of Botany)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3631332" },
  // "Red alder also has root nodules that fix atmospheric nitrogen"; beside
  // alder, Douglas-fir's soil nitrogen and growth "were greater than in the
  // pure Douglas-fir stand."
  { id: "alderGtr", name: "USDA Forest Service — Red Alder: A State of Knowledge (PNW-GTR-669)", url: "https://www.fs.usda.gov/pnw/pubs/pnw_gtr669.pdf" },

  // --- What to bring ---------------------------------------------------------
  // "Wear clothing that you don't mind getting dirty, and closed toe shoes,
  // that are sturdy enough to protect you from blackberry thorns"; "Bring a
  // full water bottle and snacks."; "All necessary tools and materials,
  // including gloves, are provided for all events."
  { id: "gspJoin", name: "Green Seattle Partnership — Join Us", url: "https://greenseattle.org/get-involved/volunteer/" },
  // Required: "Long pants – we'll be working with tools, so no shorts!",
  // "Sturdy, close-toed shoes". Recommended: "Warm layers", "Rain gear".
  { id: "greenway", name: "Mountains to Sound Greenway Trust — What to Expect", url: "https://mtsgreenway.org/get-involved/volunteer/what-to-expect/" },
  // "Make sure to wear thick gloves and protective clothing when controlling
  // blackberry".
  { id: "nwcbBlackberry", name: "Washington State Noxious Weed Control Board — Himalayan blackberry", url: "https://www.nwcb.wa.gov/weeds/himalayan-blackberry" },
  // "There is a risk of tetanus if soil or manure containing bacteria gets into
  // a wound, such as a bite, burn or scratch."
  { id: "nhsTetanus", name: "NHS — Tetanus", url: "https://www.nhs.uk/conditions/tetanus/" },
  // "Adults are recommended to get a tetanus boosters dose every 10 years."
  { id: "cdcTetanus", name: "CDC — Tetanus vaccination", url: "https://www.cdc.gov/tetanus/vaccines/index.html" },
];

/** One piece of a section. Every `key` is a full dictionary key. */
export type GuideBlock =
  /** A paragraph; `links` fills `{slot}`s with links to other pages. */
  | { kind: "p"; key: string; links?: Record<string, { href: string; key: string }> }
  | { kind: "ol" | "ul"; keys: string[] }
  | { kind: "note"; tone: "warn" | "info"; title: string; key: string }
  | { kind: "figure"; name: FigureName; caption: string };

export interface GuideSection {
  /** Names the heading's key (`volunteer.<guide>.<id>.title`) and its anchor. */
  id: string;
  blocks: GuideBlock[];
  /** Ids from `SOURCES`: at least two, from different publishers. */
  sources: string[];
}

export interface Guide {
  slug: string;
  square: SquareName;
  sections: GuideSection[];
}

const p = (key: string, links?: Record<string, { href: string; key: string }>): GuideBlock => ({ kind: "p", key, links });
const fig = (name: FigureName, caption: string): GuideBlock => ({ kind: "figure", name, caption });
/** `n` keys ending 1…n: `list("ul", "volunteer.pots.loosen.li", 3)`. */
const list = (kind: "ol" | "ul", stem: string, n: number): GuideBlock =>
  ({ kind, keys: Array.from({ length: n }, (_, i) => `${stem}${i + 1}`) });
const note = (tone: "warn" | "info", stem: string): GuideBlock =>
  ({ kind: "note", tone, title: `${stem}Title`, key: stem });

/** The index's address, and a guide's. One place knows the URL shape. */
export const VOLUNTEER_HREF = "#/volunteer";
export const guideHref = (guide: Guide): string => `${VOLUNTEER_HREF}/${guide.slug}`;

export const GUIDES: Guide[] = [
  {
    slug: "pots",
    square: "pot",
    sections: [
      { id: "check", sources: ["wsuInstant", "isa"], blocks: [
        p("volunteer.pots.check.p1"),
        fig("rootbound", "volunteer.pots.check.fig"),
      ] },
      { id: "loosen", sources: ["gsp", "isa", "rhsPlanting"], blocks: [
        list("ul", "volunteer.pots.loosen.li", 3),
      ] },
      { id: "wash", sources: ["wsuFragile", "wsuFs047", "rouse"], blocks: [
        p("volunteer.pots.wash.p1"),
        fig("bucket", "volunteer.pots.wash.fig"),
        p("volunteer.pots.wash.p2"),
        note("warn", "volunteer.pots.wash.note"),
      ] },
      { id: "hole", sources: ["isa", "rhsPlanting", "gsp", "seattleTrees", "wsuFs047"], blocks: [
        fig("mound", "volunteer.pots.hole.fig"),
        list("ol", "volunteer.pots.hole.li", 4),
      ] },
      { id: "finish", sources: ["wsuFs047", "csuPlanting", "gsp", "isa"], blocks: [
        list("ul", "volunteer.pots.finish.li", 3),
        note("info", "volunteer.pots.finish.note"),
      ] },
    ],
  },
  {
    slug: "invasives",
    square: "bag",
    sections: [
      { id: "why", sources: ["gsp", "psuBuffers"], blocks: [
        p("volunteer.invasives.why.p1"),
      ] },
      { id: "ask", sources: ["gsp", "kcHogweed"], blocks: [
        p("volunteer.invasives.ask.p1", {
          removing: { href: "#/removing", key: "volunteer.invasives.ask.p1Link" },
        }),
        list("ul", "volunteer.invasives.ask.li", 3),
      ] },
      { id: "parts", sources: ["kcPractices", "nwcbDisposal", "gsp"], blocks: [
        p("volunteer.invasives.parts.p1"),
        list("ul", "volunteer.invasives.parts.li", 3),
        p("volunteer.invasives.parts.p2", {
          list: { href: "#/invasives", key: "volunteer.invasives.parts.p2Link" },
        }),
      ] },
      { id: "knotweed", sources: ["kcKnotweed", "govukKnotweed", "gsp"], blocks: [
        fig("bag", "volunteer.invasives.knotweed.fig"),
        p("volunteer.invasives.knotweed.p1", {
          knotweed: { href: "#/invasives/reynoutria-japonica", key: "volunteer.invasives.knotweed.p1Link" },
        }),
        p("volunteer.invasives.knotweed.p2"),
      ] },
      { id: "compost", sources: ["vanRossum", "nwcbDisposal", "kcPractices"], blocks: [
        p("volunteer.invasives.compost.p1"),
      ] },
      { id: "leave", sources: ["gsp", "playCleanGo", "osuPhytophthora"], blocks: [
        p("volunteer.invasives.leave.p1"),
      ] },
    ],
  },
  {
    slug: "roots",
    square: "spade",
    sections: [
      { id: "where", sources: ["osuTrees", "iowaTrees"], blocks: [
        p("volunteer.roots.where.p1"),
      ] },
      { id: "sizes", sources: ["psuUnder", "uvmUnder", "hauc", "osuTrees", "indianaDnr"], blocks: [
        fig("rootSizes", "volunteer.roots.sizes.fig"),
        list("ul", "volunteer.roots.sizes.li", 4),
        note("info", "volunteer.roots.sizes.note"),
      ] },
      { id: "small", sources: ["psuUnder", "uvmUnder"], blocks: [
        p("volunteer.roots.small.p1", {
          pots: { href: "#/volunteer/pots", key: "volunteer.roots.small.p1Link" },
        }),
      ] },
      { id: "spade", sources: ["ccohs", "forterra", "psuUnder"], blocks: [
        fig("spade", "volunteer.roots.spade.fig"),
        list("ol", "volunteer.roots.spade.li", 5),
      ] },
      { id: "mud", sources: ["udelCompaction", "dukeCompaction"], blocks: [
        p("volunteer.roots.mud.p1"),
      ] },
      { id: "fabric", sources: ["wsuFabric", "unhFabric"], blocks: [
        p("volunteer.roots.fabric.p1"),
        fig("fabric", "volunteer.roots.fabric.fig"),
        p("volunteer.roots.fabric.p2"),
      ] },
      { id: "nitrogen", sources: ["doty", "santi", "alderGtr"], blocks: [
        p("volunteer.roots.nitrogen.p1", {
          alder: { href: "#/plants/alnus-rubra", key: "volunteer.roots.nitrogen.p1Link" },
        }),
        p("volunteer.roots.nitrogen.p2"),
      ] },
    ],
  },
  {
    slug: "kit",
    square: "glove",
    sections: [
      { id: "wear", sources: ["gspJoin", "greenway", "nwcbBlackberry"], blocks: [
        fig("kit", "volunteer.kit.wear.fig"),
        list("ul", "volunteer.kit.wear.li", 4),
      ] },
      { id: "bring", sources: ["gspJoin", "greenway"], blocks: [
        list("ul", "volunteer.kit.bring.li", 4),
        p("volunteer.kit.bring.p1"),
      ] },
      { id: "tools", sources: ["forterra", "gspJoin"], blocks: [
        p("volunteer.kit.tools.p1"),
      ] },
      { id: "health", sources: ["nhsTetanus", "cdcTetanus"], blocks: [
        p("volunteer.kit.health.p1"),
      ] },
    ],
  },
];

export const guideBySlug = (slug: string): Guide | undefined => GUIDES.find((g) => g.slug === slug);

const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

/** A guide's sources, each once, in the order its sections lean on them. */
export function guideSources(guide: Guide): GuideSource[] {
  const ids = new Set(guide.sections.flatMap((s) => s.sources));
  return [...ids].map((id) => SOURCE_BY_ID.get(id)).filter((s): s is GuideSource => !!s);
}

/** Every dictionary key a guide reads, for the test that proves they exist. */
export function guideKeys(guide: Guide): string[] {
  const keys = [`volunteer.${guide.slug}.title`, `volunteer.${guide.slug}.line`, `volunteer.${guide.slug}.lede`, `volunteer.${guide.slug}.next`];
  for (const section of guide.sections) {
    keys.push(`volunteer.${guide.slug}.${section.id}.title`);
    for (const b of section.blocks) {
      if (b.kind === "p") keys.push(b.key, ...Object.values(b.links ?? {}).map((l) => l.key));
      else if (b.kind === "note") keys.push(b.title, b.key);
      else if (b.kind === "figure") keys.push(b.caption);
      else keys.push(...b.keys);
    }
  }
  for (const src of guideSources(guide)) keys.push(`volunteer.src.${src.id}`);
  return keys;
}
