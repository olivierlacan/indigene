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

/**
 * The four seasons, in the order a year runs them.
 *
 * Every region Indigene covers is north of the equator, so these mean what a
 * reader in Pennsylvania, Oregon, Florida or France means by them, and the
 * index says as much rather than assuming it. If a southern-hemisphere region
 * is ever added, this is the one place that has to learn to flip.
 */
export type Season = "spring" | "summer" | "fall" | "winter";

export const SEASONS: readonly Season[] = ["spring", "summer", "fall", "winter"] as const;

/** Which season a month (0-11, as `Date` counts them) belongs to. Meteorological
 *  seasons — whole months — because "spring starts on the equinox" is a fact
 *  about the sky and this is a question about soil. */
export function seasonOfMonth(month: number): Season {
  if (month <= 1 || month === 11) return "winter"; // Dec–Feb
  if (month <= 4) return "spring"; // Mar–May
  if (month <= 7) return "summer"; // Jun–Aug
  return "fall"; // Sep–Nov
}

/** The season it is right now, for the "what to do this season" card. */
export function currentSeason(now: Date = new Date()): Season {
  return seasonOfMonth(now.getMonth());
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
  { method: "cuttings-hardwood", slug: "hardwood-cuttings", from: "plant", seasons: ["winter"], icon: "🪵" },
  { method: "layering", slug: "layering", from: "plant", seasons: ["spring", "fall"], icon: "🪢" },
  { method: "suckers", slug: "suckers", from: "plant", seasons: ["winter", "spring"], icon: "🌳" },
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
  | "rhs";

export interface PlantingSource {
  key: PlantingSourceKey;
  name: string;
  url: string;
  /** Where its coverage is honest — the app spans two continents and no single
   *  one of these speaks for both. Also a locale key. */
  scope: "us" | "eu" | "both";
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
] as const;
