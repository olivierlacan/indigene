// Further reading: the books, websites and channels to turn to after the list.
//
// The societies (`data/societies.ts`) are who to *meet*; these are what to
// *read and watch* — the field guide a local botanist wrote, the nursery's
// planting videos, the state database a reader will use for years. Every pick
// passed the same two tests, and the evidence for both sits on the entry so a
// reviewer can check it without re-doing the search:
//
//   1. **Who stands behind it** (`backer`) — a working botanist or ecologist, a
//      society, a university or extension service, an agency, a botanic garden,
//      a native-plant nursery, a designer who plants natives for a living.
//   2. **Who already relies on it** (`vouched`, `audience`, `award`) — the
//      strongest is a recommendation from one of the region's own authorities,
//      which is the cross-reference: a book the Native Plant Society of Oregon
//      puts on its own reading list. Audience counts and awards come next.
//
// Never a person without a public body of work, never a page that frames
// plants from elsewhere — or people — as invaders (CLAUDE.md, "Native plants,
// not nativism"). Kept short for the same reason the societies are: a page of
// sixty links is a directory, and the reader came here to avoid one.
//
// The research behind each pick, with the pages it was checked against, is in
// `docs/outreach/further-reading.md`. Audience counts are a snapshot (`asOf`)
// and drift; they are shown rounded and dated, never as live figures.

export type ReadingKind = "book" | "site" | "video" | "social";

/** Who stands behind a pick. Translated via `reading.backer.<key>`. */
export type Backer =
  | "botanist"
  | "ecologist"
  | "society"
  | "university"
  | "agency"
  | "garden"
  | "nursery"
  | "designer"
  | "naturalist";

export interface Voucher {
  /** As the organization writes it. A proper name, not translated. */
  name: string;
  /** The page on which they recommend it — the evidence, not their home page. */
  url: string;
}

export interface Reading {
  kind: ReadingKind;
  /** As published. A proper name, not translated. */
  title: string;
  /** Author(s) or organization, as published. */
  by: string;
  /** Books: the latest edition's year. */
  year?: number;
  url: string;
  /** The language it is written or spoken in (BCP 47), shown when it differs
   *  from the reader's. */
  lang: string;
  backer: Backer;
  /** Regional authorities that recommend it, each with the page that does. */
  vouched?: Voucher[];
  /** How many people follow, subscribe, belong or take part, as of a date
   *  (`YYYY-MM` or `YYYY-MM-DD`). Shown rounded, with its year. */
  audience?: { count: number; unit: AudienceUnit; asOf: string };
  /** An award, as the award is named. `toAuthor` when it honored the author
   *  rather than this title — said so on the row, never passed off as the book's. */
  award?: { name: string; toAuthor?: boolean };
  /** Editions published: a book kept in print through revisions is one people
   *  kept buying. */
  editions?: number;
}

/** Translated via `reading.audience.<unit>`. */
export type AudienceUnit = "subscribers" | "followers" | "members" | "gardens";

// --- Shared picks: one book or site that serves several regions is written
// once, so its evidence can't drift between copies.

const UC_ANR_LIST: Voucher = {
  name: "UC Agriculture and Natural Resources",
  url: "https://ucanr.edu/sites/default/files/2026-04/Habitat_CA_Native_Resources_2026.pdf",
};

const CA_NATIVES_FOR_THE_GARDEN: Reading = {
  kind: "book",
  title: "California Native Plants for the Garden",
  by: "Carol Bornstein, David Fross and Bart O'Brien",
  year: 2005,
  url: "https://cnpsslo.org/shop/california-native-plants-for-the-garden/",
  lang: "en",
  backer: "garden",
  vouched: [UC_ANR_LIST, { name: "CNPS Santa Clara Valley", url: "https://cnps-scv.org/education/books" }],
  award: { name: "American Horticultural Society Book Award 2006" },
};

const CALSCAPE: Reading = {
  kind: "site",
  title: "Calscape",
  by: "California Native Plant Society",
  url: "https://calscape.org/",
  lang: "en",
  backer: "society",
  vouched: [UC_ANR_LIST],
};

const EP348: Voucher = { name: "UF/IFAS Extension", url: "https://ask.ifas.ufl.edu/publication/EP348" };

const HUEGEL: Reading = {
  kind: "book",
  title: "Native Plant Landscaping for Florida Wildlife",
  by: "Craig N. Huegel",
  year: 2010,
  url: "https://floridapress.org/9780813034942/native-plant-landscaping-for-florida-wildlife",
  lang: "en",
  backer: "ecologist",
  vouched: [EP348],
};

const NELSON: Reading = {
  kind: "book",
  title: "Florida's Best Native Landscape Plants",
  by: "Gil Nelson",
  year: 2003,
  url: "https://floridapress.org/9780813026442/floridas-best-native-landscape-plants",
  lang: "en",
  backer: "botanist",
  vouched: [{ name: "Florida Native Plant Society", url: "https://www.fnps.org/plant/tripsacum-dactyloides" }],
};

const NORTHERN_GARDENERS_GUIDE: Reading = {
  kind: "book",
  title: "A Northern Gardener's Guide to Native Plants and Pollinators",
  by: "Lorraine Johnson and Sheila Colla",
  year: 2023,
  url: "https://press.princeton.edu/books/paperback/9781642832990/a-northern-gardeners-guide-to-native-plants-and-pollinators",
  lang: "en",
  backer: "ecologist",
  vouched: [
    { name: "Wild Ones Ann Arbor", url: "https://annarborarea.wildones.org/?p=7547" },
    { name: "Wild Ones River City", url: "https://rivercitygrandrapids.wildones.org/?p=11454" },
  ],
};

// France's national garden network, the one French pick with an audience.
const JARDINS_DE_NOE: Reading = {
  kind: "site",
  title: "Jardins de Noé",
  by: "Noé",
  url: "https://jardinsdenoe.org/",
  lang: "fr",
  backer: "society",
  audience: { count: 4500, unit: "gardens", asOf: "2023-01" },
};

// Written with the two conservatories that decide what is native in the
// south-east — the cross-reference is their name on the cover.
const PLANTONS_LOCAL_SUD: Reading = {
  kind: "site",
  title: "Plantons local",
  by: "ARBE Région Sud",
  year: 2023,
  url: "https://www.arbe-regionsud.org/32157-plantons-local.html",
  lang: "fr",
  backer: "agency",
  vouched: [{
    name: "Conservatoires botaniques nationaux alpin et méditerranéen",
    url: "https://www.arbe-regionsud.org/32157-plantons-local.html",
  }],
};

export const READING: Record<string, Reading[]> = {
  "mid-atlantic": [
    {
      kind: "book",
      title: "Bringing Nature Home",
      by: "Douglas W. Tallamy",
      year: 2009,
      url: "https://www.hachettebookgroup.com/titles/douglas-w-tallamy/bringing-nature-home/9780881929928/",
      lang: "en",
      backer: "ecologist",
      vouched: [{ name: "Plant Virginia Natives", url: "https://www.plantvirginianatives.org/plantswvanatives/recommended-reading" }],
      award: { name: "Garden Writers Association Silver Medal 2008" },
    },
    {
      kind: "book",
      title: "Maryland Native Plant Guide for the Piedmont Region",
      by: "University of Maryland Extension",
      year: 2025,
      url: "https://extension.umd.edu/programs/environment-natural-resources/program-areas/maryland-native-plants-program/native-plant-guides",
      lang: "en",
      backer: "university",
      vouched: [{
        name: "Maryland Native Plant Society",
        url: "https://www.extension.umd.edu/news-events/news/new-native-plant-guide-piedmont-region-now-available",
      }],
    },
    {
      kind: "book",
      title: "Garden Revolution",
      by: "Larry Weaner and Thomas Christopher",
      year: 2016,
      url: "https://www.hbgacademic.com/titles/larry-weaner/garden-revolution/9781604697490",
      lang: "en",
      backer: "designer",
      vouched: [{
        name: "Penn State Extension Master Gardeners",
        url: "https://abe.psu.edu/programs/master-gardener/counties/york/native-plants/fact-sheets/useful-native-plant-references",
      }],
      award: { name: "American Horticultural Society Book Award 2017" },
    },
    {
      kind: "book",
      title: "The Living Landscape",
      by: "Rick Darke and Douglas W. Tallamy",
      year: 2014,
      url: "https://www.hachettebookgroup.com/titles/rick-darke/the-living-landscape/9781604694086/",
      lang: "en",
      backer: "designer",
      vouched: [{ name: "Heritage Conservancy", url: "https://heritageconservancy.org/reading-recs-for-this-holiday-season/" }],
    },
    {
      kind: "site",
      title: "Mt. Cuba Center",
      by: "Mt. Cuba Center",
      url: "https://mtcubacenter.org/",
      lang: "en",
      backer: "garden",
      vouched: [{ name: "Fine Gardening", url: "https://finegardening.com/article/mid-atlantic-natives-on-trial-at-the-mt-cuba-center" }],
    },
    {
      kind: "book",
      title: "Native Plants for Northern Virginia",
      by: "Plant NOVA Natives",
      year: 2022,
      url: "https://www.plantvirginianatives.org/nova-natives-guide-book",
      lang: "en",
      backer: "agency",
      vouched: [{ name: "Virginia Native Plant Society", url: "https://vnps.org/virginia-native-plant-guides/" }],
    },
  ],
  "north-michigan": [
    {
      kind: "book",
      title: "Landscaping with Native Plants of Michigan",
      by: "Lynn M. Steiner",
      year: 2006,
      url: "https://quarto.com/books/9780760325384/landscaping-with-native-plants-of-michigan",
      lang: "en",
      backer: "naturalist",
      vouched: [
        { name: "Wildflower Association of Michigan", url: "https://wildflowersmich.org/keep-learning/" },
        { name: "Wild Ones River City", url: "https://rivercitygrandrapids.wildones.org/?p=11609" },
      ],
      award: { name: "Michigan Notable Book 2007" },
    },
    NORTHERN_GARDENERS_GUIDE,
    {
      kind: "site",
      title: "Native Plants and Ecosystem Services",
      by: "Michigan State University Extension",
      url: "https://www.canr.msu.edu/nativeplants/",
      lang: "en",
      backer: "university",
      vouched: [{ name: "Wild Ones Central Upper Peninsula", url: "https://centralupperpeninsula.wildones.org/?p=49" }],
    },
    {
      kind: "site",
      title: "Michigan Flora Online",
      by: "University of Michigan Herbarium",
      url: "https://michiganflora.net/",
      lang: "en",
      backer: "botanist",
      award: { name: "Michigan Botanical Club Lifetime Achievement Award", toAuthor: true },
    },
  ],
  "st-lawrence": [
    {
      kind: "book",
      title: "100 Easy-to-Grow Native Plants for Canadian Gardens",
      by: "Lorraine Johnson",
      year: 2017,
      url: "https://douglas-mcintyre.com/products/9781771621441",
      lang: "en",
      backer: "naturalist",
      vouched: [{
        name: "Fondation David Suzuki",
        url: "https://fr.davidsuzuki.org/wp-content/uploads/sites/3/2026/08/Ressources-Jardins-habitat.pdf",
      }],
    },
    {
      kind: "book",
      title: "Arbres et arbustes indigènes pour les jardins du Québec",
      by: "Bertrand Dumont",
      year: 2024,
      url: "https://ssr.fidelio.ca/en/Catalog/Details/9782896547838",
      lang: "fr",
      backer: "designer",
      award: { name: "Prix Henry-Teuscher 2016", toAuthor: true },
    },
    {
      kind: "site",
      title: "FloraQuebeca",
      by: "FloraQuebeca",
      url: "https://floraquebeca.qc.ca/",
      lang: "fr",
      backer: "society",
      vouched: [{
        name: "Fondation David Suzuki",
        url: "https://fr.davidsuzuki.org/wp-content/uploads/sites/3/2026/08/Ressources-Jardins-habitat.pdf",
      }],
    },
    NORTHERN_GARDENERS_GUIDE,
    {
      kind: "book",
      title: "Flore laurentienne",
      by: "Frère Marie-Victorin",
      year: 1995,
      url: "https://florelaurentienne.com/",
      lang: "fr",
      backer: "botanist",
      editions: 3,
    },
  ],
  pnw: [
    {
      kind: "book",
      title: "Gardening with Native Plants of the Pacific Northwest",
      by: "Arthur R. Kruckeberg and Linda Chalker-Scott",
      year: 2019,
      url: "https://www.npsoregon.org/wp/gardening-with-native-plants-of-the-pacific-northwest-third-edition/",
      lang: "en",
      backer: "botanist",
      vouched: [
        { name: "Native Plant Society of Oregon", url: "https://www.npsoregon.org/wp/gardening-with-native-plants-of-the-pacific-northwest-third-edition/" },
        { name: "Elisabeth C. Miller Library", url: "https://depts.washington.edu/hortlib/pal/native-plant-resources" },
      ],
      editions: 3,
    },
    {
      kind: "book",
      title: "Real Gardens Grow Natives",
      by: "Eileen M. Stark",
      year: 2014,
      url: "https://www.mountaineers.org/books/mission/books/real-gardens-grow-natives-design-plant-and-enjoy-a-healthy-northwest-garden",
      lang: "en",
      backer: "designer",
      vouched: [{ name: "Elisabeth C. Miller Library", url: "https://depts.washington.edu/hortlib/book/book-review-229/" }],
    },
    {
      kind: "site",
      title: "King County Native Plant Guide",
      by: "King County",
      url: "https://green2.kingcounty.gov/gonative/index.aspx",
      lang: "en",
      backer: "agency",
      vouched: [{ name: "Elisabeth C. Miller Library", url: "https://depts.washington.edu/hortlib/website/northwest-native-plant-landscape-guide" }],
    },
    {
      kind: "book",
      title: "Landscaping for Wildlife in the Pacific Northwest",
      by: "Russell Link",
      year: 1999,
      url: "https://wdfw.wa.gov/news/new-book-helps-gardeners-go-wild",
      lang: "en",
      backer: "agency",
      vouched: [{ name: "Elisabeth C. Miller Library", url: "https://depts.washington.edu/hortlib/resources/booklists_data/native.pdf" }],
    },
  ],
  "ca-south-coast": [
    {
      kind: "book",
      title: "The California Native Landscape",
      by: "Greg Rubin and Lucy Warren",
      year: 2013,
      url: "https://www.hbglibrary.com/titles/greg-rubin/the-california-native-landscape/9781604692327",
      lang: "en",
      backer: "designer",
      vouched: [
        UC_ANR_LIST,
        {
          name: "CNPS San Diego",
          url: "https://cnpssd.org/2018/11/13/2018-11-12-how-to-keep-your-california-native-garden-long-lasting-a-brief-q-amp-a-with-lucy-warren-and-greg-rubin/",
        },
      ],
    },
    CA_NATIVES_FOR_THE_GARDEN,
    CALSCAPE,
    {
      kind: "site",
      title: "Plant guides",
      by: "Theodore Payne Foundation",
      url: "https://theodorepayne.org/learn/guides/",
      lang: "en",
      backer: "nursery",
      vouched: [UC_ANR_LIST],
    },
  ],
  "ca-central-coast": [
    {
      kind: "book",
      title: "California Native Gardening: A Month-by-Month Guide",
      by: "Helen Popper",
      year: 2012,
      url: "https://cnpsslo.org/shop/california-native-gardening-a-month-by-month-guide/",
      lang: "en",
      backer: "naturalist",
      vouched: [
        { name: "CNPS San Luis Obispo", url: "https://cnpsslo.org/shop/california-native-gardening-a-month-by-month-guide/" },
        { name: "CNPS Santa Clara Valley", url: "https://cnps-scv.org/education/books" },
        UC_ANR_LIST,
      ],
    },
    {
      kind: "book",
      title: "Native Treasures: Gardening with the Plants of California",
      by: "M. Nevin Smith",
      year: 2006,
      url: "https://baynature.org/article/book-review-native-treasures-gardening-with-the-plants-of-california",
      lang: "en",
      backer: "nursery",
      vouched: [{ name: "Bay Nature", url: "https://baynature.org/article/book-review-native-treasures-gardening-with-the-plants-of-california" }],
    },
    {
      kind: "book",
      title: "California Plants: A Guide to Our Iconic Flora",
      by: "Matt Ritter",
      year: 2018,
      url: "https://cnpsslo.org/shop/california-plants-a-guide-to-our-iconic-flora/",
      lang: "en",
      backer: "botanist",
      vouched: [
        { name: "CNPS San Luis Obispo", url: "https://cnpsslo.org/shop/california-plants-a-guide-to-our-iconic-flora/" },
        UC_ANR_LIST,
      ],
    },
    CA_NATIVES_FOR_THE_GARDEN,
    CALSCAPE,
    {
      kind: "site",
      title: "Gardening resources",
      by: "Santa Barbara Botanic Garden",
      url: "https://www.sbbotanicgarden.org/grow/gardening-resources/",
      lang: "en",
      backer: "garden",
      vouched: [UC_ANR_LIST],
    },
  ],
  "florida-central": [
    HUEGEL,
    NELSON,
    {
      kind: "site",
      title: "Florida-Friendly Landscaping",
      by: "UF/IFAS Extension",
      url: "https://ffl.ifas.ufl.edu/",
      lang: "en",
      backer: "university",
      vouched: [EP348],
    },
  ],
  "florida-south": [
    {
      kind: "site",
      title: "Natives For Your Neighborhood",
      by: "Institute for Regional Conservation",
      url: "https://regionalconservation.org/beta/nfyn/about.asp",
      lang: "en",
      backer: "society",
      vouched: [{ name: "Florida Wildflower Foundation", url: "https://regionalconservation.org/beta/nfyn/about.asp" }],
    },
    {
      kind: "book",
      title: "Attracting Hummingbirds and Butterflies in Tropical Florida",
      by: "Roger L. Hammer",
      year: 2015,
      url: "https://floridapress.org/9780813060248/attracting-hummingbirds-and-butterflies-in-tropical-florida",
      lang: "en",
      backer: "naturalist",
      award: { name: "FNPS Green Palmetto Award", toAuthor: true },
    },
    NELSON,
    HUEGEL,
  ],
  kanto: [
    {
      kind: "site",
      title: "植栽時における在来種選定ガイドライン",
      by: "東京都環境局",
      year: 2014,
      url: "https://www.kankyo.metro.tokyo.lg.jp/nature/green/green_biodiv/ns_guidelines",
      lang: "ja",
      backer: "agency",
      vouched: [{
        name: "緑化計画の手引",
        url: "https://www.kankyo.metro.tokyo.lg.jp/documents/d/kankyo/plan_system-guide-files-r07midori_tebiki_all",
      }],
    },
    {
      kind: "book",
      title: "鎮守の森",
      by: "宮脇昭",
      year: 2007,
      url: "https://www.shinchosha.co.jp/book/603572/",
      lang: "ja",
      backer: "ecologist",
      award: { name: "Blue Planet Prize 2006", toAuthor: true },
    },
  ],
  "france-continental": [
    {
      kind: "site",
      title: "Plantons local en Île-de-France",
      by: "ARB Île-de-France",
      year: 2019,
      url: "https://www.arb-idf.fr/nos-travaux/publications/plantons-local-en-ile-de-france-2019/",
      lang: "fr",
      backer: "agency",
      vouched: [{
        name: "Conservatoire botanique national du Bassin parisien",
        url: "https://www.arb-idf.fr/nos-travaux/publications/plantons-local-en-ile-de-france-2019/",
      }],
    },
    {
      kind: "site",
      title: "Planter local en Centre-Val de Loire",
      by: "ARB Centre-Val de Loire",
      year: 2024,
      url: "https://www.biodiversite-centrevaldeloire.fr/sites/default/files/content/ressources/pdf/2025-01/ARB_Guideplanterlocal_V2025web_planche.pdf",
      lang: "fr",
      backer: "agency",
      vouched: [{
        name: "Conservatoire botanique national du Bassin parisien",
        url: "https://www.biodiversite-centrevaldeloire.fr/sites/default/files/content/ressources/pdf/2021-11/fascicule-plantons-local-VF.pdf",
      }],
    },
    JARDINS_DE_NOE,
  ],
  "france-atlantic": [JARDINS_DE_NOE],
  "france-mediterranean": [
    PLANTONS_LOCAL_SUD,
    {
      kind: "book",
      title: "Flore de la France méditerranéenne continentale",
      by: "Jean-Marc Tison, Philippe Jauzein et Henri Michaud",
      year: 2014,
      url: "https://www.nhbs.com/en/flore-de-la-france-mediterraneenne-continentale-flora-of-mediterranean-continental-france-book",
      lang: "fr",
      backer: "botanist",
      vouched: [{
        name: "Euro+Med PlantBase",
        url: "https://www.europlusmed.org/cdm_dataportal/taxon/a1bee98f-96a5-45d4-bece-fdd3d001e1c7",
      }],
    },
    JARDINS_DE_NOE,
  ],
  "france-alpine": [
    {
      kind: "site",
      title: "Gentiana",
      by: "Gentiana, société botanique dauphinoise",
      url: "https://gentiana.org/",
      lang: "fr",
      backer: "society",
      audience: { count: 555, unit: "members", asOf: "2023-10" },
    },
    PLANTONS_LOCAL_SUD,
    JARDINS_DE_NOE,
  ],
  ireland: [
    {
      kind: "book",
      title: "We Are the ARK",
      by: "Mary Reynolds",
      year: 2022,
      url: "https://www.hachettebookgroup.com/titles/mary-reynolds/we-are-the-ark/9781643261782/",
      lang: "en",
      backer: "designer",
      vouched: [{ name: "Irish Wildlife Trust", url: "https://iwt.ie/be-plant-wise-let-nature-lead-plant-native/" }],
    },
    {
      kind: "video",
      title: "Réabhlóid ar Chúl an Tí",
      by: "TG4",
      year: 2026,
      url: "https://www.tg4.ie/en/player/online-boxsets/?series=R%C3%A9abhl%C3%B3id%20ar%20Ch%C3%BAl%20an%20T%C3%AD&genre=Faisneis",
      lang: "ga",
      backer: "designer",
      vouched: [{ name: "Irish Wildlife Trust", url: "https://iwt.ie/be-plant-wise-let-nature-lead-plant-native/" }],
    },
    {
      kind: "book",
      title: "Gardening for Biodiversity",
      by: "Juanita Browne",
      year: 2020,
      url: "https://www.heritagecouncil.ie/publications/education-training",
      lang: "en",
      backer: "agency",
      vouched: [{ name: "Laois County Council", url: "https://laois.ie/departments/heritage/biodiversity/gardening-for-biodiversity" }],
    },
    {
      kind: "book",
      title: "The Wildflowers of Ireland",
      by: "Zoë Devlin",
      year: 2021,
      url: "https://iwt.ie/product/the-wildflowers-of-ireland-2/",
      lang: "en",
      backer: "naturalist",
      vouched: [{ name: "Irish Wildlife Trust", url: "https://iwt.ie/product/the-wildflowers-of-ireland-2/" }],
      editions: 2,
    },
  ],
  "nz-auckland": [
    {
      kind: "site",
      title: "Te Haumanu Taiao",
      by: "Auckland Council and Ngā Iwi Mana Whenua o Tāmaki Makaurau",
      url: "https://tiakitamakimakaurau.nz/protect-and-restore-our-environment/te-haumanu-taiao-restoring-natural-environment",
      lang: "en",
      backer: "agency",
      vouched: [{ name: "NZ Institute of Landscape Architects", url: "https://www.nzila.co.nz/news/2023/11/te-haumanu-taiao" }],
    },
    {
      kind: "book",
      title: "100 Best Native Plants for New Zealand Gardens",
      by: "Fiona Eadie",
      year: 2014,
      url: "https://www.unitybooks.co.nz/products/100-best-native-plants-for-nz-gardens",
      lang: "en",
      backer: "botanist",
      editions: 3,
    },
    {
      kind: "book",
      title: "The Cultivation of New Zealand Trees and Shrubs",
      by: "Lawrie Metcalf",
      year: 2011,
      url: "https://search.worldcat.org/oclc/753700257",
      lang: "en",
      backer: "botanist",
      award: { name: "RHS Veitch Memorial Medal", toAuthor: true },
      editions: 2,
    },
  ],
};

/** A region's picks, or an empty list where none are researched yet — which is
 *  a missing section, never a heading over nothing. */
export function readingFor(regionId: string): Reading[] {
  return READING[regionId] ?? [];
}

/** The regions that have a list, in the order they were written. */
export function readingRegionIds(): string[] {
  return Object.keys(READING).filter((id) => READING[id].length > 0);
}
