// The propagation techniques as *pages* rather than as glossary entries.
//
// A plant page has always listed the methods that work for it, each glossed in
// plain words. What it could never answer is the question every one of those
// glosses provokes: **when?** "Nick the seed coat, then sow" and "sow the seed
// as-is" read as alternatives you could do on the same afternoon, and they are
// not — one is the last step before sowing whenever you sow, the other is a
// thing you do in October because that is when the seed falls.
//
// So each technique gets an address of its own — `#/planting/<slug>`,
// canonically `/planting/<slug>` — where the timing is the content: the window
// in the year, the cue to watch for rather than a date, how long until anything
// happens, and where it usually goes wrong. The index at `/planting` puts them
// side by side against the calendar, and names the resources the how-to comes
// from, because those are worth finding for their own sake.
//
// This module is the shape of that: which techniques exist, what each one's
// address is, and when in the year it happens. The *words* live in the locale
// files (`prop.<method>.when` / `.wait` / `.timing` / `.mistake`), like every
// other sentence in the app. Nothing here imports i18n on purpose — the
// prerenderer and the route check load this file from Node, where there is no
// browser to detect a language with.
import type { Plant, PropagationMethod } from "../types";
import { REGIONS, loadPlants } from "./plants";
import type { RegionDef } from "./plants";
import { mirrorMonth } from "./hemisphere";
import type { Hemisphere } from "./hemisphere";

/**
 * The four seasons, in the order a year runs them.
 *
 * Named, not dated: "spring" is September to November in Sydney and March to
 * May in Pennsylvania, and every window on the planting pages is written as a
 * season so it reads true on both sides of the equator. Only the "which season
 * is it now" question needs a hemisphere — see `seasonOfMonth`.
 */
export type Season = "spring" | "summer" | "fall" | "winter";

export const SEASONS: readonly Season[] = ["spring", "summer", "fall", "winter"] as const;

/** Which season a month (0-11, as `Date` counts them) belongs to. Meteorological
 *  seasons — whole months — because "spring starts on the equinox" is a fact
 *  about the sky and this is a question about soil. South of the equator the
 *  same month is six months further round the year. */
export function seasonOfMonth(month: number, hemisphere: Hemisphere = "north"): Season {
  const m = hemisphere === "south" ? mirrorMonth(month) : month;
  if (m <= 1 || m === 11) return "winter"; // Dec–Feb (Jun–Aug south)
  if (m <= 4) return "spring"; // Mar–May (Sep–Nov south)
  if (m <= 7) return "summer"; // Jun–Aug (Dec–Feb south)
  return "fall"; // Sep–Nov (Mar–May south)
}

/** The season it is right now, for the "what to do this season" card. */
export function currentSeason(hemisphere: Hemisphere = "north", now: Date = new Date()): Season {
  return seasonOfMonth(now.getMonth(), hemisphere);
}

/** Where the new plant comes from: seed you save, or the living plant itself.
 *  The same split the glossary in `plain.ts` uses, and the index's two groups. */
export type TechniqueFrom = "seed" | "plant";

export interface Technique {
  /** The propagation method this is the page for — the key everything else
   *  (the plant rows, the glossary, the locale strings) already uses. */
  method: PropagationMethod;
  /**
   * The address segment: `#/planting/scarification`, not `#/planting/seed-scarify`.
   *
   * A URL is read by people, and "scarification" is the word a reader will
   * recognise from a seed packet or type into a search bar. The method keys are
   * internal — grouped by their prefix so the data file sorts sensibly — and
   * they'd make a needlessly cryptic address. English in every language, like
   * every other route in the app: an address is an address.
   */
  slug: string;
  from: TechniqueFrom;
  /**
   * The months of the year this work actually happens in, as seasons. Drawn as
   * the strip on the card and the page, and what the "this season" grouping on
   * the index reads.
   *
   * Empty means the technique has no season of its own — see `anyTime`.
   */
  seasons: readonly Season[];
  /**
   * True when the calendar doesn't decide: scarification happens whenever you
   * are about to sow, so its window is the sowing's window, not one of its own.
   * A technique like this shows on every season's list rather than none.
   */
  anyTime?: boolean;
  /** Decorative — the label carries the meaning. */
  icon: string;
}

/**
 * Every technique, in the order the index shows them: from seed first (it's
 * what most people have), easiest first within each group.
 *
 * The order is deliberate and not alphabetical — direct sowing before double
 * dormancy, softwood cuttings before spores — so someone scanning the page top
 * to bottom meets the approachable ones first and the two-year waits last.
 */
export const TECHNIQUES: readonly Technique[] = [
  { method: "seed-direct", slug: "direct-sowing", from: "seed", seasons: ["fall", "spring"], icon: "🌱" },
  { method: "seed-warm", slug: "fresh-sowing", from: "seed", seasons: ["summer", "fall"], icon: "🌡️" },
  { method: "seed-cold-moist", slug: "cold-stratification", from: "seed", seasons: ["fall", "winter", "spring"], icon: "❄️" },
  { method: "seed-scarify", slug: "scarification", from: "seed", seasons: [], anyTime: true, icon: "🪒" },
  { method: "seed-surface-light", slug: "surface-sowing", from: "seed", seasons: ["winter", "spring", "fall"], icon: "☀️" },
  { method: "seed-double-dormant", slug: "double-dormancy", from: "seed", seasons: ["fall"], icon: "⏳" },

  { method: "division", slug: "division", from: "plant", seasons: ["fall", "spring"], icon: "🔪" },
  { method: "cuttings-softwood", slug: "softwood-cuttings", from: "plant", seasons: ["spring", "summer"], icon: "🌿" },
  { method: "cuttings-semi-hardwood", slug: "semi-hardwood-cuttings", from: "plant", seasons: ["summer", "fall"], icon: "🍃" },
  { method: "cuttings-hardwood", slug: "hardwood-cuttings", from: "plant", seasons: ["fall", "winter"], icon: "🪵" },
  { method: "layering", slug: "layering", from: "plant", seasons: ["spring", "fall"], icon: "🪢" },
  { method: "suckers", slug: "suckers", from: "plant", seasons: ["spring"], icon: "🌳" },
  { method: "runners", slug: "runners", from: "plant", seasons: ["summer", "fall"], icon: "🍓" },
  { method: "root-cuttings", slug: "root-cuttings", from: "plant", seasons: ["fall", "winter"], icon: "🥕" },
  { method: "spores", slug: "spores", from: "plant", seasons: ["summer", "fall"], icon: "💨" },
] as const;

const BY_METHOD = new Map(TECHNIQUES.map((tech) => [tech.method, tech]));
const BY_SLUG = new Map(TECHNIQUES.map((tech) => [tech.slug, tech]));

/** The technique page for a propagation method. Total: every method in the
 *  controlled vocabulary has one, and TypeScript would flag a new method the
 *  moment `TECHNIQUES` stopped covering it — see `techniquesAreComplete`. */
export function techniqueFor(method: PropagationMethod): Technique {
  return BY_METHOD.get(method) as Technique;
}

/** The technique an address asks for, or null when the slug isn't one of ours. */
export function techniqueBySlug(slug: string): Technique | null {
  return BY_SLUG.get(slug) ?? null;
}

/** A technique's address. The one place that knows the URL shape. */
export const techniqueHref = (tech: Technique): string => `#/planting/${tech.slug}`;

/**
 * A compile-time proof that every method in the vocabulary has a page.
 *
 * `PropagationMethod` is a closed union used by 200-odd plant rows; adding a
 * sixteenth method without adding it here would leave those rows linking to a
 * page that doesn't exist. This makes that a build error instead. It costs a
 * type and nothing at runtime.
 */
type CoveredMethod = (typeof TECHNIQUES)[number]["method"];
type MissingMethod = Exclude<PropagationMethod, CoveredMethod>;
// If this line errors, a propagation method has no entry in TECHNIQUES above.
// The tuple wrapper stops the conditional distributing over the union — bare
// `never extends never` resolves to `never`, which would make the check pass by
// accident in the one case it exists to catch.
export const techniquesAreComplete: [MissingMethod] extends [never] ? true : never = true;

/** Techniques worth doing in a given season — including the ones with no season
 *  of their own, which belong on every list because they belong to whatever
 *  sowing you're about to do. */
export function techniquesInSeason(season: Season): Technique[] {
  return TECHNIQUES.filter((tech) => tech.anyTime || tech.seasons.includes(season));
}

/** One plant that uses a technique, and a region it's native to — the link back
 *  out of a how-to and into the catalog. */
export interface PlantUsing {
  plant: Plant;
  region: RegionDef;
}

/**
 * Every plant in the catalog that lists this method, deduped across regions.
 *
 * A species native to two regions (live oak, goat willow) has a row in each and
 * one page, so the first region met wins the link — the plant page picks the
 * right regional row for the reader anyway.
 *
 * Built once per method and cached: the technique page asks on every render,
 * and the answer walks every region's whole roster.
 */
// One of the few places that really does want the whole catalog: "which plants
// can I take cuttings from?" is a question about all of them. So this fetches
// every region's list — on a page the reader chose to open, and once per visit.
const usedByCache = new Map<PropagationMethod, PlantUsing[]>();
export async function plantsUsing(method: PropagationMethod): Promise<PlantUsing[]> {
  const hit = usedByCache.get(method);
  if (hit) return hit;
  const seen = new Set<string>();
  const out: PlantUsing[] = [];
  for (const region of REGIONS) {
    for (const plant of await loadPlants(region)) {
      if (!plant.propagation.methods.includes(method) || seen.has(plant.id)) continue;
      seen.add(plant.id);
      out.push({ plant, region });
    }
  }
  usedByCache.set(method, out);
  return out;
}

/**
 * The published resources the how-to comes from — the second half of what the
 * `/planting` index is for.
 *
 * Every propagation note in the catalog cites one or more of these in its own
 * `basis`, but a citation at the foot of a plant page is a footnote; a reader
 * who wants to *learn to propagate* deserves to be handed the actual libraries.
 * All of them are free to read, and most are national or public-institution
 * resources that will still be there in ten years — which is exactly why they
 * are the ones we lean on.
 *
 * `what` is a locale key (`planting.src.<key>`), so the description is
 * translated while the name of the institution, being a proper noun, is not.
 */
/** Named rather than left as `string` so `planting.src.<key>` type-checks as a
 *  locale key: a source added here without its description written is then a
 *  compile error, not a blank paragraph on the page. */
export type PlantingSourceKey =
  | "npn"
  | "wpsm"
  | "wildflower"
  | "mobot"
  | "xerces"
  | "tela"
  | "inpn"
  | "rhs"
  | "nzpcn"
  | "sid";

export interface PlantingSource {
  key: PlantingSourceKey;
  name: string;
  url: string;
  /** Where its coverage is honest — the app spans two continents and no single
   *  one of these speaks for both. Also a locale key. */
  scope: "us" | "eu" | "nz" | "both" | "world";
}

export const PLANTING_SOURCES: readonly PlantingSource[] = [
  { key: "npn", name: "USFS Native Plant Network — Propagation Protocol Database", url: "https://npn.rngr.net/propagation/protocols", scope: "us" },
  { key: "wpsm", name: "Woody Plant Seed Manual (USDA Handbook 727)", url: "https://rngr.net/publications/wpsm", scope: "us" },
  { key: "wildflower", name: "Lady Bird Johnson Wildflower Center — Native Plant Database", url: "https://www.wildflower.org/plants/", scope: "us" },
  { key: "mobot", name: "Missouri Botanical Garden — Plant Finder", url: "https://www.missouribotanicalgarden.org/plantfinder/plantfindersearch.aspx", scope: "us" },
  { key: "xerces", name: "Xerces Society", url: "https://www.xerces.org/publications", scope: "both" },
  { key: "tela", name: "Tela Botanica", url: "https://www.tela-botanica.org/", scope: "eu" },
  { key: "inpn", name: "INPN — Inventaire national du patrimoine naturel", url: "https://inpn.mnhn.fr/", scope: "eu" },
  { key: "rhs", name: "Royal Horticultural Society — propagation guides", url: "https://www.rhs.org.uk/propagation", scope: "eu" },
  // Species pages carry "Propagation technique" and "Cultivation" sections —
  // the source behind every Auckland row.
  { key: "nzpcn", name: "New Zealand Plant Conservation Network — flora", url: "https://www.nzpcn.org.nz/flora/species/", scope: "nz" },
  // "SID is a compilation of seed biological trait data, with records derived
  // from measurements and observations on seed collections held in Royal
  // Botanic Garden Kew's Millennium Seed Bank and from other unpublished and
  // published sources" — the site's own description. Run by the Society for
  // Ecological Restoration since 2023.
  { key: "sid", name: "Seed Information Database (SER & Kew)", url: "https://ser-sid.org/", scope: "world" },
] as const;

/**
 * The specific pages the season plan's rules and the technique pages' "Learn
 * more" lean on. Each was opened and checked to say what it's cited for — the
 * quote is kept beside it, so the next person can check it again rather than
 * take our word. Names are the pages' own titles, not translated.
 */
export interface GuideRef {
  name: string;
  url: string;
}

export const GUIDE_REFS = {
  // "As a rough guide, seed is set about two months after flowering."
  seedCollect: { name: "RHS — Seed: collecting and storing", url: "https://www.rhs.org.uk/propagation/seed-collecting-storing" },
  // "Divide summer-flowering plants in spring (Mar-May) or autumn (Sep-Nov)";
  // "Many spring-flowering plants, such as irises, are best divided in summer
  // (Jun-Aug) after flowering"; "Most perennials benefit from division every
  // two to three years".
  divide: { name: "RHS — Perennials: dividing", url: "https://www.rhs.org.uk/plants/types/perennials/dividing" },
  // Each genus chapter's table gives "Minimum seed-bearing age (yrs)": white
  // oak 20, shagbark hickory 40, silky dogwood 3, blackhaw 8–10.
  woodySeed: { name: "USDA Woody Plant Seed Manual", url: "https://rngr.net/publications/wpsm" },
  // "the seed heads of coneflowers, black-eyed Susans, and other native
  // wildflowers provide a helpful food cache for birds."
  birds: { name: "Audubon — To Help Birds This Winter, Go Easy on Fall Yard Work", url: "https://www.audubon.org/magazine/help-birds-winter-go-easy-fall-yard-work" },

  // The technique pages' sources, one claim each (checked October 2026).
  //
  // "Spring is an ideal time for direct sowing many seeds, but some can be sown
  // during summer and autumn"; "follow the general rule of sowing at a depth of
  // about two or three times the size of the seed".
  sowOutdoors: { name: "RHS — How to sow seeds outdoors", url: "https://www.rhs.org.uk/propagation/how-to-sow-seeds-outdoors" },
  // "Place a piece of glass, propagator lid … to cover"; "stand pots or trays
  // in water to soak up moisture from below"; a watering can "to create a
  // gentle spray and avoid dislodging the seeds".
  sowIndoors: { name: "RHS — How to sow seeds indoors", url: "https://www.rhs.org.uk/propagation/how-to-sow-seeds-indoors" },
  // "Seedcoat dormancy … Members of the Leguminoseae … usually display this
  // characteristic"; "seedcoats can be scarified by hand with knives, files,
  // clippers, sandpaper"; "'Burned' seeds can be shipped or returned to storage
  // after treatment …, something that other scarification methods normally do
  // not allow"; "The usual procedure for stratification is to refrigerate fully
  // imbibed seeds at 1 to 5 °C for 1 to 6 months"; double dormancy "has been
  // reported for viburnums".
  seedBiology: { name: "USDA Woody Plant Seed Manual — Chapter 1: Seed Biology", url: "https://rngr.net/publications/wpsm/chapter1" },
  // "Fall-sowing has been used to allow seeds to stratify naturally over the
  // winter"; "seeds can be mixed with a moisture-retaining material such as
  // peat moss and placed in a plastic bag in a refrigerator"; "Stratifying
  // seeds are checked every few days to see if the seeds have split and
  // germination begun"; "The depth of seed covering is very critical—if it is
  // too deep, the seeds will not germinate … The recommended depth is 2 to 3
  // times the width of the seeds."
  nursery: { name: "USDA Woody Plant Seed Manual — Chapter 7: Nursery Practices", url: "https://rngr.net/publications/wpsm/chapter7" },
  // Quercus: "Acorns of the white oak group generally have little or no
  // dormancy and will germinate almost immediately after falling. These species
  // should usually be planted in the fall"; "Acorns can be stored in plastic
  // bags … as long as the containers are not completely sealed and the acorns
  // do not get too dry."
  oakSeed: { name: "USDA Woody Plant Seed Manual — Q (Quercus, oak)", url: "https://rngr.net/publications/wpsm/genera/q" },
  // Viburnum: "Seeds of the more northern forms need warm stratification for
  // development of the radicle, followed by cold stratification to break
  // dormancy in the epicotyl (shoot) … seeds of northern species seldom
  // germinate naturally until the second spring after they ripen."
  viburnumSeed: { name: "USDA Woody Plant Seed Manual — V (Viburnum)", url: "https://rngr.net/publications/wpsm/genera/v" },
  // "Sow seeds by hand … do not cover these seeds with soil, as they need light
  // to germinate"; "Water using a fine mist"; "Seal mixture into a
  // Ziploc-style bag … 1-2 months of moist cold stratification".
  lobelia: { name: "Native Plant Network — Propagation protocol for Lobelia cardinalis", url: "https://npn.rngr.net/renderNPNProtocolDetails?selectedProtocolIds=campanulaceae-lobelia-1536" },
  // "Softwood cuttings are taken from spring to early summer (Apr-Jun), using
  // material from the soft and flexible young shoot tips"; "Collect material
  // early in the day when it is full of water (turgid)"; "Store the bag of
  // material in the fridge if you cannot prepare the cuttings immediately";
  // "trim below a node to make a cutting about 5-10cm (2-4in) long"; "Ensure
  // the compost is moist until the cuttings are well-rooted which takes about 2
  // to 4 weeks".
  softwood: { name: "RHS — Cuttings: softwood", url: "https://www.rhs.org.uk/propagation/softwood-cuttings" },
  // "Semi ripe cuttings are taken from summer to mid-autumn (Jul-Sep) … The base
  // of the cutting is firm, while the tip is still soft"; "aim to pot the
  // cuttings within 12 hours"; "On large-leaved shrubs, cut the leaf in half to
  // reduce water loss"; "Hardy shrubs can also be rooted directly in the soil …
  // in cold frames, but may not root fully until late spring the following
  // year."
  semiRipe: { name: "RHS — Cuttings: semi-ripe", url: "https://www.rhs.org.uk/propagation/semi-ripe-cuttings" },
  // "Hardwood cutting are taken in the dormant season (mid-autumn until late
  // winter) after leaf fall … The ideal time is just after leaf fall or just
  // before bud-burst in spring"; "Cut into sections 15-30cm (6in-1ft) long … with a
  // sloping cut to shed water and as a reminder which end is the top"; "with
  // two-thirds of the cutting below the surface"; "the cut surface undergoes a
  // period of callusing over the winter from which roots will develop in the
  // spring"; "The following autumn the cuttings should have rooted and can be
  // planted out". Trees: "Populus (poplars) and Salix (willow)".
  hardwood: { name: "RHS — Hardwood cuttings", url: "https://www.rhs.org.uk/propagation/hardwood-cuttings" },
  // "Layering can be carried out in autumn or spring. Deciduous plants respond
  // well in either season, but evergreens respond better in spring"; "Roots
  // should develop within 12 months"; "Unlike cuttings, which have to survive
  // on their own, layered shoots are encouraged to form roots while still
  // attached to the parent plant."
  layering: { name: "RHS — Layering plants", url: "https://www.rhs.org.uk/propagation/layering" },
  // "Spring is the best time to propagate using suckers, as this is when plants
  // are coming into active growth"; "sever the sucker, making sure that it has
  // fibrous roots on the detached portion"; "Reduce long, leafy shoots by about
  // half to limit drying out"; "The roots are usually insufficient to sustain
  // the plant without careful watering for the first season."
  suckers: { name: "RHS — Propagating using suckers", url: "https://www.rhs.org.uk/propagation/suckers" },
  // "Strawberries can be propagated from runners … Late summer is an ideal time
  // to do this"; "insert individual runners into [pots]"; "Sever the new young
  // plants from the parent plant when rooted".
  runners: { name: "RHS — How to grow strawberries", url: "https://www.rhs.org.uk/fruit/strawberries/grow-your-own" },
  // "are best taken in mid-to-late autumn or early winter when plants are
  // dormant"; "Select young, vigorous roots, about the thickness of a pencil";
  // "Cut each root into 5-10cm (2-4in) lengths"; "place the pots in a cold
  // frame"; "Root cuttings should contain enough food reserves (carbohydrates)
  // … thin-rooted species therefore require longer root sections … Lay these
  // horizontally"; "In the following spring, pot up individually when the
  // cuttings show signs of growth and are well-rooted."
  rootCuttings: { name: "RHS — Root cuttings", url: "https://www.rhs.org.uk/propagation/root-cuttings" },
  // "collect fronds when indusium begins to lift"; "Fronds are placed spore
  // surface down on butcher paper … Spores will appear as a fine dust on the
  // paper after several days of drying"; "seal flats promptly after sowing with
  // clear plastic wrap"; "Spores germinate 10 to 20 days after sowing";
  // "Appearance of sporophytes occurred 5 months after spore germination."
  spores: { name: "Native Plant Network — Propagation protocol for Dryopteris carthusiana", url: "https://npn.rngr.net/renderNPNProtocolDetails?selectedProtocolIds=dryopteridaceae-dryopteris-89" },
} as const satisfies Record<string, GuideRef>;

/** The checked pages worth reading for one technique — specific ones only,
 *  never a page that doesn't cover it. Empty where we have none yet; the
 *  technique page then points at the reading list alone. */
export function techniqueRefs(method: PropagationMethod): GuideRef[] {
  const r = GUIDE_REFS;
  switch (method) {
    case "seed-direct": return [r.sowOutdoors, r.nursery, r.seedCollect];
    case "seed-warm": return [r.oakSeed, r.seedCollect];
    case "seed-cold-moist": return [r.seedBiology, r.nursery, r.lobelia];
    case "seed-scarify": return [r.seedBiology];
    case "seed-surface-light": return [r.lobelia, r.sowIndoors];
    case "seed-double-dormant": return [r.viburnumSeed, r.seedBiology];
    case "division": return [r.divide];
    case "cuttings-softwood": return [r.softwood];
    case "cuttings-semi-hardwood": return [r.semiRipe];
    case "cuttings-hardwood": return [r.hardwood];
    case "layering": return [r.layering];
    case "suckers": return [r.suckers];
    case "runners": return [r.runners];
    case "root-cuttings": return [r.rootCuttings];
    case "spores": return [r.spores];
  }
}
