// Plain-language layer. The rule from the brief: never surface a term without
// explaining it inline, in words a 70-year-old who has never heard "keystone
// species" can act on. Everything jargon-y funnels through here.
//
// Since localization, this file holds the *logic* — which bucket a number falls
// in, which gloss a band earns — and the words themselves live in `locales/*`.
// The thresholds are the part that must not vary by language (a six-hour spot
// is full sun in every language); the sentence about it is the part that must.
//
// One consequence worth knowing before you edit: everything language-dependent
// here is a **function**, never a module-level constant. A `Record` built at
// import time would freeze whatever language happened to be active on the first
// render and then quietly ignore the switch.
import type { MoistureBand, PropagationMethod, SizeSnapshot, SupportKind, SupportReliance, WildlifeKind } from "../types";
import { monthName, t, tn, tOptional } from "./i18n";
import { length, temperature } from "./units";

/** The full audit of every dataset behind the numbers — linked wherever we
 * cite a figure (host counts especially) so claims stay checkable. */
export const DATA_SOURCES_URL =
  "https://github.com/olivierlacan/indigene/blob/main/DATA_SOURCES.md";

/** The in-app plain-language companion to DATA_SOURCES_URL (`steps/sources.ts`):
 * which numbers are counted, which are our judgment, and what to challenge
 * first. Cited alongside a figure, it's the friendlier door of the two. */
export const SOURCES_ROUTE = "#/sources";

/** Where to ask for a new area to be covered — or contribute its plant list.
 * Linked wherever the app has to say "no list for your area yet", so the
 * dead end always comes with a door: open an issue with your postal code or
 * town, or add a region yourself (a data file plus two registry lines). */
export const ISSUES_URL = "https://github.com/olivierlacan/indigene/issues";

/** The official USDA hardiness-zone map. Linked wherever a zone label (e.g.
 * "8b") is shown, so the term is never bare jargon — the rule is common
 * parlance first ("winters down to about −9 °C"), the zone in parentheses. */
export const ZONE_INFO_URL = "https://planthardiness.ars.usda.gov/";

/** The official Level III/IV ecoregion maps — the EPA's own page, with a
 * printable map (and the GIS files) for every part of the country. Linked from
 * any US region's page, because those polygons are literally what decides which
 * plant list a spot gets: a reader asking "how far north does this go?"
 * deserves the boundary itself, not our paraphrase of it. */
export const EPA_ECOREGION_MAP_URL =
  "https://www.epa.gov/eco-research/level-iii-and-iv-ecoregions-epa-region";

/** The Europe-side equivalent: the EEA's Biogeographical Regions dataset page,
 * which previews the map and offers the download. Same job as the EPA link on a
 * European region's page. (Same item DATA_SOURCES.md cites for the live
 * lookup — one address for the layer, whether you're querying it or reading it.) */
export const EEA_BIOREGION_MAP_URL =
  "https://www.eea.europa.eu/en/datahub/datahubitem-view/11db8d14-f167-4cd5-9205-95638dfd9618";

/** Explainer for the moisture bands ("mesic" and its dry/wet siblings).
 * Same rule: say "evenly moist" first; "mesic" only ever in parentheses. */
export const MOISTURE_INFO_URL = "https://en.wikipedia.org/wiki/Mesic_habitat";

/** The dependable, species-by-species propagation source we lean on: the USDA
 * Forest Service's Native Plant Network Propagation Protocol Database. It's a
 * government resource written by the people who grow these plants for
 * restoration, so "how to make more of it" stays a checkable fact, not folklore.
 * Linked wherever propagation tips are shown, alongside each row's own `basis`. */
export const PROPAGATION_SOURCE_URL = "https://npn.rngr.net/propagation/protocols";

/** The common-parlance word for a moisture band. Use this — never the raw
 * band value — anywhere a person reads it; "mesic" means nothing at a garden
 * center. */
export function moistureWord(band: MoistureBand): string {
  return t(`moisture.word.${band}` as const);
}

/** The four light levels as thresholds. Language-independent on purpose: where
 *  full sun stops and part sun starts is a fact about plants, not about words. */
type SunKey = "full" | "partSun" | "partShade" | "fullShade";

function sunKey(hours: number): SunKey {
  if (hours >= 6) return "full";
  if (hours >= 4) return "partSun";
  if (hours >= 2) return "partShade";
  return "fullShade";
}

export function sunLabel(hours: number): string {
  return t(`sun.label.${sunKey(hours)}` as const);
}

export function sunPlain(hours: number): string {
  const key = sunKey(hours);
  return tn("sun.plain", Math.round(hours), {
    label: t(`sun.label.${key}` as const),
    gloss: t(`sun.gloss.${key}` as const),
  });
}

export function moisturePlain(band: MoistureBand): string {
  return t(`moisture.plain.${band}` as const);
}

// Common parlance leads; the zone label sits in parentheses as the term
// plant tags use — never the other way around. The temperature goes through
// `units`, so a French gardener reads −12 °C and an American reads 10°F from
// the one stored number.
export function zonePlain(zone: string | null, minTempF: number | null): string {
  if (!zone) return t("zone.unknown");
  const cold =
    minTempF != null
      ? t("zone.coldWithTemp", { temp: temperature(minTempF) })
      : t("zone.coldNoTemp");
  return t("zone.plain", { cold, zone });
}

export function phPlain(ph: number | null): string {
  if (ph == null) return t("ph.unknown");
  const v = ph.toFixed(1);
  if (ph < 5.6) return t("ph.acidic", { v });
  if (ph <= 7.3) return t("ph.neutral", { v });
  return t("ph.alkaline", { v });
}

export function texturePlain(texture: string | null): string {
  if (!texture) return t("texture.unknown");
  // The texture name itself arrives from the soil dataset in English ("silt
  // loam"). Which gloss it earns is decided here; the gloss is translated.
  const s = texture.toLowerCase();
  if (s.includes("sand")) return t("texture.sand", { t: texture });
  if (s.includes("clay")) return t("texture.clay", { t: texture });
  if (s.includes("loam")) return t("texture.loam", { t: texture });
  if (s.includes("silt")) return t("texture.silt", { t: texture });
  return texture;
}

export function slopePlain(deg: number | null): string {
  if (deg == null) return "";
  if (deg < 3) return t("slope.flat");
  if (deg < 8) return t("slope.gentle");
  if (deg < 15) return t("slope.noticeable");
  return t("slope.steep");
}

/**
 * A bloom colour in the reader's language.
 *
 * The catalog writes these as compound English slugs ("greenish-yellow",
 * "pink-lavender"). They're enumerated in the dictionary rather than assembled
 * from translated atoms, because adjective order and agreement don't survive
 * word-by-word assembly — "creamy-white" is *blanc crème* in French, not
 * *crémeux-blanc*. A colour a locale hasn't got yet falls back to the catalog's
 * own word, which is a small wart rather than a blank where a flower should be.
 */
export function bloomColorWord(color: string): string {
  return tOptional(`color.${color}`) ?? color;
}

/** Months that begin with a vowel sound. French contracts the preposition in
 *  front of them — *d'avril*, never *de avril* — and the dictionary carries two
 *  forms of the sentence so the choice is a translator's, not a regex's.
 *  English defines both forms identically and never notices. */
function startsWithVowel(word: string): boolean {
  return /^[aàâeéèêëiîïoôuùûü]/i.test(word);
}

/**
 * "Blooms April–May (green)." / "Fleurit d'avril à mai (vert)." — one sentence,
 * built here rather than at each call site so the elision rule lives in one
 * place. Plants grown for foliage get the no-flowers line instead.
 */
export function bloomSentence(bloom: { startMonth: number; endMonth: number; color: string } | null | undefined): string {
  if (!bloom) return t("card.foliage");
  const from = monthName(bloom.startMonth);
  return t(startsWithVowel(from) ? "card.bloomRangeVowel" : "card.bloomRange", {
    from,
    to: monthName(bloom.endMonth),
    color: bloomColorWord(bloom.color),
  });
}

/** The seven eco-score components, in the order they're shown. */
export const SCORE_KEYS = [
  "host",
  "pollinator",
  "bird",
  "stormwater",
  "erosion",
  "carbon",
  "establishment",
] as const;
export type ScoreKey = (typeof SCORE_KEYS)[number];

// Each ecosystem benefit carries one fixed icon (emoji — the app's icon idiom)
// so the benefit is recognizable at a glance anywhere it appears: score
// breakdowns, the re-rank sliders, everywhere. The caterpillar matches the
// stat-grid's host tile — same fact, same face. Icons don't translate, so they
// stay here beside the logic; the words come from the dictionary at read time.
const SCORE_ICONS: Record<ScoreKey, string> = {
  host: "🐛",
  pollinator: "🐝",
  bird: "🐦",
  stormwater: "🌧️",
  erosion: "⛰️",
  carbon: "🪵",
  establishment: "🌵",
};

/** A score component's icon, name and explanation in the reader's language. */
export function scoreLabel(key: ScoreKey): { icon: string; name: string; plain: string } {
  return {
    icon: SCORE_ICONS[key],
    name: t(`score.${key}.name` as const),
    plain: t(`score.${key}.plain` as const),
  };
}

/**
 * The kinds of wildlife the app lets you browse by — the section headings and
 * the icon each group carries. Plain, everyday names; nobody has to know
 * "Lepidoptera" to look for butterflies. `blurb` heads each section.
 */
const WILDLIFE_KIND_ICONS: Record<WildlifeKind, string> = {
  butterfly: "🦋",
  moth: "🌙",
  bee: "🐝",
  bird: "🐦",
  mammal: "🐿️",
};

export const WILDLIFE_KINDS = ["butterfly", "moth", "bee", "bird", "mammal"] as const;

export function wildlifeKindLabel(kind: WildlifeKind): { icon: string; title: string; blurb: string } {
  return {
    icon: WILDLIFE_KIND_ICONS[kind],
    title: t(`wildlifeKind.${kind}.title` as const),
    blurb: t(`wildlifeKind.${kind}.blurb` as const),
  };
}

/**
 * The same group, named for a pill rather than a heading: one word where the
 * language has one. A section heading can afford "Bees & other pollinators";
 * a chip in a row of five cannot, and a chip that wraps to two lines is the
 * one thing this shape must never do.
 */
export function wildlifeKindShort(kind: WildlifeKind): { icon: string; title: string } {
  return {
    icon: WILDLIFE_KIND_ICONS[kind],
    title: t(`wildlifeKind.${kind}.short` as const),
  };
}

/**
 * How a plant supports an animal, glossed once. `term` is the one-word chip
 * ("Host", "Nectar") — kept to a single noun so it reads at a glance; `plain`
 * is the tap-to-open explanation, which is where a word like "Host" that a
 * beginner won't know gets unpacked. The `host` tie is the strongest, because
 * raising the next generation is a bigger promise than feeding a passing adult.
 */
const SUPPORT_ICONS: Record<SupportKind, string> = {
  host: "🐛",
  nectar: "🌼",
  berries: "🫐",
  seeds: "🌰",
  shelter: "🏠",
};

export function supportLabel(kind: SupportKind): { term: string; icon: string; plain: string } {
  return {
    term: t(`support.${kind}.term` as const),
    icon: SUPPORT_ICONS[kind],
    plain: t(`support.${kind}.plain` as const),
  };
}

/**
 * How much an animal depends on a plant, glossed once. `term` is the one-word
 * chip; `plain` is the tap-to-open meaning. Only the two notable levels get a
 * chip on screen — "Vital" (make-or-break) and "Specialist" (few options);
 * the generalist "broad" default shows none, so an unmarked tie simply means
 * "one of many". The `broad` entry is kept so that meaning can still be spelled
 * out in a dialog when needed.
 */
const RELIANCE_ICONS: Record<SupportReliance, string> = {
  sole: "⭐",
  narrow: "🎯",
  broad: "•",
};

export function relianceLabel(r: SupportReliance): { icon: string; term: string; plain: string } {
  return {
    icon: RELIANCE_ICONS[r],
    term: t(`reliance.${r}.term` as const),
    plain: t(`reliance.${r}.plain` as const),
  };
}

/**
 * Every propagation method, glossed once. `name` is the short "what you'd call
 * it" (the gardening term kept in parentheses, never bare); `plain` is the
 * "what you actually do" a first-timer can follow with kitchen-drawer tools.
 * The plant page shows only the methods a given plant lists, each with this
 * explanation, so the same term never gets described two different ways.
 *
 * These used to give cutting sizes in inches ("a 4–6 inch piece"). They're now
 * body-scale comparisons — a hand's length, a forearm, the thickness of a
 * pencil — which need no unit conversion, read the same in both systems, and
 * are how a gardener actually judges a cutting: against their own hand, not a
 * ruler they didn't bring outside.
 *
 * The last four answer *when*, which the first two provoke and never used to
 * answer: `when` is the window in a line, `wait` how long before anything
 * happens, `timing` the cue to watch for rather than a date, and `mistake` the
 * one slip that wastes the attempt. The plant page shows `when` beside each
 * method; the rest is the technique's own page (`steps/planting.ts`).
 */
export function propagationMethod(m: PropagationMethod): {
  name: string;
  plain: string;
  when: string;
  wait: string;
  timing: string;
  mistake: string;
} {
  return {
    name: t(`prop.${m}.name` as const),
    plain: t(`prop.${m}.plain` as const),
    when: t(`prop.${m}.when` as const),
    wait: t(`prop.${m}.wait` as const),
    timing: t(`prop.${m}.timing` as const),
    mistake: t(`prop.${m}.mistake` as const),
  };
}

/**
 * Growth expectations derived from the plant's own size records (typical
 * field growth at years 1/3/5/10, from the sources cited in its `basis`) —
 * so "fast" and "slow" are claims the data can back, not nursery-tag optimism.
 */
export function growthPlain(p: {
  size: SizeSnapshot[];
  matureHeightFt: number;
}): string {
  const last = p.size[p.size.length - 1];
  if (!last || !p.matureHeightFt) return "";
  const y3 = p.size.find((s) => s.year === 3);
  const at3 = y3 ? y3.heightFt / p.matureHeightFt : 0;
  const atLast = last.heightFt / p.matureHeightFt;
  if (at3 >= 0.85) return t("growth.quick");
  if (atLast >= 0.85) return t("growth.steady", { year: last.year });
  if (atLast >= 0.45) {
    return t("growth.slowish", { frac: fracWord(atLast), year: last.year });
  }
  return t("growth.slow", {
    now: length(last.heightFt),
    year: last.year,
    mature: length(p.matureHeightFt),
  });
}

function fracWord(f: number): string {
  if (f >= 0.7) return t("frac.threeQuarters");
  if (f >= 0.55) return t("frac.twoThirds");
  return t("frac.half");
}

export function confidencePlain(c: "high" | "medium" | "low"): string {
  return t(`confidence.${c}` as const);
}

/**
 * A latitude and a longitude, each said as what it is.
 *
 * Two bare numbers with a minus sign in front of one of them is a notation, not
 * a sentence: nobody who hasn't met it before can tell which figure is which,
 * and "−75" doesn't announce itself as "three-quarters of the way west". So the
 * word comes with the number, and the direction is a letter rather than a sign.
 *
 * Kept to the four decimals a spot is actually known to (about 10 m — finer
 * than the soil grid, the climate normals or the ecoregion behind it), and the
 * decimal *point* in every language: a French "40,0379, −75,3557" would be four
 * numbers separated by commas.
 */
export function latPlain(lat: number): string {
  return t("coord.lat", {
    deg: Math.abs(lat).toFixed(4),
    hemi: t(lat < 0 ? "coord.south" : "coord.north"),
  });
}

export function lonPlain(lon: number): string {
  return t("coord.lon", {
    deg: Math.abs(lon).toFixed(4),
    hemi: t(lon < 0 ? "coord.west" : "coord.east"),
  });
}
