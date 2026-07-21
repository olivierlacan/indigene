// Plain-language layer. The rule from the brief: never surface a term without
// explaining it inline, in words a 70-year-old who has never heard "keystone
// species" can act on. Everything jargon-y funnels through here.
import type { MoistureBand, PropagationMethod, SizeSnapshot, SupportKind, SupportReliance, WildlifeKind } from "../types";

/** The full audit of every dataset behind the numbers — linked wherever we
 * cite a figure (host counts especially) so claims stay checkable. */
export const DATA_SOURCES_URL =
  "https://github.com/olivierlacan/indigene/blob/main/DATA_SOURCES.md";

/** Where to ask for a new area to be covered — or contribute its plant list.
 * Linked wherever the app has to say "no list for your area yet", so the
 * dead end always comes with a door: open an issue with your ZIP/town, or
 * add a region yourself (a data file plus two registry lines). */
export const ISSUES_URL = "https://github.com/olivierlacan/indigene/issues";

/** The official USDA hardiness-zone map. Linked wherever a zone label (e.g.
 * "8b") is shown, so the term is never bare jargon — the rule is common
 * parlance first ("winters down to about 15°F"), the zone in parentheses. */
export const ZONE_INFO_URL = "https://planthardiness.ars.usda.gov/";

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
  return band === "dry" ? "dry" : band === "wet" ? "wet" : "evenly moist";
}

export function sunLabel(hours: number): string {
  if (hours >= 6) return "full sun";
  if (hours >= 4) return "part sun";
  if (hours >= 2) return "part shade";
  return "full shade";
}

export function sunPlain(hours: number): string {
  const label = sunLabel(hours);
  const rounded = Math.round(hours);
  const hrs = `${rounded} hour${rounded === 1 ? "" : "s"}`;
  const gloss: Record<string, string> = {
    "full sun": "direct sun most of the day",
    "part sun": "sun for a good chunk of the day, shade the rest",
    "part shade": "a few hours of direct sun, shade the rest",
    "full shade": "little or no direct sun",
  };
  return `about ${hrs} of direct sun a day — that's ${label} (${gloss[label]})`;
}

export function moisturePlain(band: MoistureBand): string {
  switch (band) {
    case "dry":
      return "dry — drains fast and stays on the dry side, like a sandy slope or a spot under a roof overhang";
    case "mesic":
      return "evenly moist — damp after rain but never soggy; the middle-of-the-road condition most yards have";
    case "wet":
      return "wet — stays damp, puddles after rain, or sits low where water collects";
  }
}

// Common parlance leads; the zone label sits in parentheses as the term
// plant tags use — never the other way around.
export function zonePlain(zone: string | null, minTempF: number | null): string {
  if (!zone) return "We couldn't pin down how cold your winters get.";
  const cold =
    minTempF != null
      ? `Your coldest winter nights get down to about ${minTempF}°F`
      : "This is how cold your winters get";
  return `${cold} — plant tags call that "USDA zone ${zone}". A plant is "hardy" here if it survives that cold.`;
}

export function phPlain(ph: number | null): string {
  if (ph == null) return "Soil acidity unknown.";
  if (ph < 5.6) return `pH ${ph.toFixed(1)} — acidic soil (think blueberries, pine woods)`;
  if (ph <= 7.3) return `pH ${ph.toFixed(1)} — close to neutral, which most plants are happy with`;
  return `pH ${ph.toFixed(1)} — alkaline/limey soil`;
}

export function texturePlain(texture: string | null): string {
  if (!texture) return "Soil texture unknown.";
  const t = texture.toLowerCase();
  if (t.includes("sand"))
    return `${texture} — gritty, drains fast, dries out quickly`;
  if (t.includes("clay"))
    return `${texture} — heavy and sticky when wet, holds water, can stay soggy`;
  if (t.includes("loam"))
    return `${texture} — the "just right" mix of sand, silt, and clay that most plants love`;
  if (t.includes("silt"))
    return `${texture} — smooth and floury when dry, holds moisture well`;
  return texture;
}

export function slopePlain(deg: number | null): string {
  if (deg == null) return "";
  if (deg < 3) return "basically flat";
  if (deg < 8) return "a gentle slope";
  if (deg < 15) return "a noticeable slope — erosion can be a concern here";
  return "a steep slope — holding the soil in place matters a lot here";
}

// Each ecosystem benefit carries one fixed icon (emoji — the app's icon
// idiom) so the benefit is recognizable at a glance anywhere it appears:
// score breakdowns, the re-rank sliders, everywhere. The caterpillar
// matches the stat-grid's host tile — same fact, same face. Render icons
// aria-hidden; the name is the accessible label.
export const scoreLabels: Record<string, { icon: string; name: string; plain: string }> = {
  host: {
    icon: "🐛",
    name: "Feeds baby butterflies & moths",
    plain:
      "How many kinds of caterpillars can eat this plant. Caterpillars are the food that baby birds are raised on, so this is the single biggest measure of how much life a plant supports.",
  },
  pollinator: {
    icon: "🐝",
    name: "Feeds bees & butterflies",
    plain: "Nectar and pollen for adult bees and butterflies, and how long it blooms.",
  },
  bird: {
    icon: "🐦",
    name: "Feeds & shelters birds",
    plain: "Berries, seeds, and places to nest — plus the caterpillars it raises.",
  },
  stormwater: {
    icon: "🌧️",
    name: "Soaks up rain",
    plain: "Deep roots that let rainwater sink in instead of running off.",
  },
  erosion: {
    icon: "⛰️",
    name: "Holds soil in place",
    plain: "Roots that grip a slope and stop it washing away.",
  },
  carbon: {
    icon: "🪵",
    name: "Stores carbon",
    plain:
      "Carbon pulled out of the air into wood and roots. Honestly small for one yard — included, but don't expect miracles.",
  },
  establishment: {
    icon: "🌵",
    name: "Survives on its own",
    plain: "How likely it is to make it with no watering or fuss after you plant it.",
  },
};

/**
 * The kinds of wildlife the app lets you browse by — the section headings and
 * the icon each group carries. Plain, everyday names; nobody has to know
 * "Lepidoptera" to look for butterflies. `blurb` heads each section.
 */
export const wildlifeKindLabels: Record<
  WildlifeKind,
  { title: string; icon: string; blurb: string }
> = {
  butterfly: {
    icon: "🦋",
    title: "Butterflies",
    blurb: "Choose a butterfly to see which natives raise its caterpillars or feed the adults.",
  },
  moth: {
    icon: "🌙",
    title: "Moths",
    blurb: "The night shift — including the giant silk moths, whose caterpillars are prime baby-bird food.",
  },
  bee: {
    icon: "🐝",
    title: "Bees & other pollinators",
    blurb: "Native bees, many of which can raise their young on only one family of flowers.",
  },
  bird: {
    icon: "🐦",
    title: "Birds",
    blurb: "The berries, seeds, nectar, and caterpillars behind the birds you want in the yard.",
  },
  mammal: {
    icon: "🐿️",
    title: "Mammals & others",
    blurb: "Acorns and fruit for the four-legged neighbors — and a reptile or two.",
  },
};

/**
 * How a plant supports an animal, glossed once. `term` is the one-word chip
 * ("Host", "Nectar") — kept to a single noun so it reads at a glance; `plain`
 * is the tap-to-open explanation, which is where a word like "Host" that a
 * beginner won't know gets unpacked. The `host` tie is the strongest, because
 * raising the next generation is a bigger promise than feeding a passing adult.
 */
export const supportLabels: Record<
  SupportKind,
  { term: string; icon: string; plain: string }
> = {
  host: {
    term: "Host",
    icon: "🐛",
    plain: "A host plant: caterpillars eat its leaves and grow up on it. This is the strongest kind of support — it's where the next generation of butterflies and moths comes from, and caterpillars are what nearly all baby songbirds are fed.",
  },
  nectar: {
    term: "Nectar",
    icon: "🌼",
    plain: "Nectar and pollen for the grown insects — food for the adults, not a nursery for their young.",
  },
  berries: {
    term: "Berries",
    icon: "🫐",
    plain: "Berries or fruit that birds and mammals eat, especially through fall and winter.",
  },
  seeds: {
    term: "Seeds",
    icon: "🌰",
    plain: "Seeds or nuts that birds and mammals eat — often what's left standing after the flowers fade.",
  },
  shelter: {
    term: "Shelter",
    icon: "🏠",
    plain: "Cover and habitat to nest, graze, roost, or ride out the season in.",
  },
};

/**
 * How much an animal depends on a plant, glossed once. `term` is the one-word
 * chip; `plain` is the tap-to-open meaning. Only the two notable levels get a
 * chip on screen — "Essential" (make-or-break) and "Specialist" (few options);
 * the generalist "broad" default shows none, so an unmarked tie simply means
 * "one of many". The `broad` entry is kept so that meaning can still be spelled
 * out in a dialog when needed.
 */
export const relianceLabels: Record<
  SupportReliance,
  { icon: string; term: string; plain: string }
> = {
  sole: {
    icon: "⭐",
    term: "Essential",
    plain: "This plant is the animal's only option — an obligate tie with no substitute. Lose it here and you lose the animal. These are the make-or-break relationships (a monarch needs milkweed; an atala needs coontie).",
  },
  narrow: {
    icon: "🎯",
    term: "Specialist",
    plain: "A specialist relationship: the animal can use only a small group of plants, and this is one of them. Important, with just a few alternatives.",
  },
  broad: {
    icon: "•",
    term: "One of many",
    plain: "Valuable, but the animal uses many plants — helpful without being make-or-break on its own. Tags like this are left off, so an unmarked plant means the animal has other options.",
  },
};

/**
 * Every propagation method, glossed once. `name` is the short "what you'd call
 * it" (the gardening term kept in parentheses, never bare); `plain` is the
 * "what you actually do" a first-timer can follow with kitchen-drawer tools.
 * The plant page shows only the methods a given plant lists, each with this
 * explanation, so the same term never gets described two different ways.
 */
export const propagationMethods: Record<
  PropagationMethod,
  { name: string; plain: string }
> = {
  "seed-direct": {
    name: "Sow the seed as-is (direct sowing)",
    plain:
      "The easy case: clean the seed, then sow it about as deep as it is wide in a pot or a cleared patch of ground and keep it damp. No tricks needed.",
  },
  "seed-cold-moist": {
    name: "Give the seed a cold, damp winter first (cold-moist stratification)",
    plain:
      "Many native seeds won't wake up until they've felt a real winter, so you fake one. Mix the seed with a handful of damp sand or a moist paper towel, seal it in a labeled zip bag, and leave it in the fridge for the number of weeks noted — then sow. Or skip the fridge entirely: sow it outdoors in a pot in fall and let actual winter do the job.",
  },
  "seed-double-dormant": {
    name: "Expect a two-winter wait (double dormancy)",
    plain:
      "The stubborn ones: the root comes out after one winter but the leaf shoot waits for a second. Sow in a pot outdoors, keep it in a shady, protected spot, don't give up when nothing shows the first spring, and stay patient — green usually appears in the second year.",
  },
  "seed-scarify": {
    name: "Nick or scuff the hard seed coat first (scarification)",
    plain:
      "Some seeds (beans and their relatives especially) are sealed in a waterproof shell that has to be breached before water can get in. Rub each seed a few strokes on fine sandpaper, or nick the coat with a knife, until you just see the paler inside — then soak overnight and sow. Careful scuffing, not crushing.",
  },
  "seed-surface-light": {
    name: "Press tiny seed on the surface — it needs light (surface sowing)",
    plain:
      "Dust-fine seed that must see daylight to sprout, so don't bury it. Scatter it on top of damp soil, press it down so it makes contact, and don't cover it. Keep the surface from drying out by misting or covering with clear plastic until it germinates.",
  },
  "seed-warm": {
    name: "Sow fresh and keep it warm (no chilling needed)",
    plain:
      "The warm-climate case: no winter chill required. Sow the fresh, cleaned seed and keep it warm and damp — it usually sprouts within a few weeks. Fresh matters; many of these lose the ability to sprout if the seed dries out and sits.",
  },
  "cuttings-softwood": {
    name: "Root a soft green shoot (softwood cutting)",
    plain:
      "In late spring or early summer, snip a 4–6 inch piece of soft, bendy new growth, strip the lower leaves, and push the cut end into damp potting mix or perlite. Keep it humid and out of harsh sun (a clear bag or bottle over the pot helps) until roots form in a few weeks.",
  },
  "cuttings-semi-hardwood": {
    name: "Root a firming-up shoot (semi-hardwood cutting)",
    plain:
      "Mid-to-late summer, take a 4–6 inch piece of this year's growth that has started to stiffen and turn woody at the base. Strip the lower leaves, set the cut end in damp mix, and keep it humid. Slower to root than soft cuttings but sturdier — good for many shrubs and broadleaf evergreens.",
  },
  "cuttings-hardwood": {
    name: "Root a bare winter twig (hardwood cutting)",
    plain:
      "The simplest cutting of all for willows, dogwoods and their kind: while the plant is leafless and dormant, cut pencil-thick pieces about a foot long, push the lower half into damp ground or a pot, and wait. Many root by spring with no fuss at all.",
  },
  division: {
    name: "Dig and split the clump (division)",
    plain:
      "For clump-forming perennials and grasses: in early spring or fall, dig up the whole plant, then pull or cut the crown into several pieces, each with its own roots and a few shoots. Replant the pieces right away at the same depth and water them in. Also rejuvenates a tired, hollow-centered clump.",
  },
  layering: {
    name: "Root a branch while it's still attached (layering)",
    plain:
      "A near-foolproof trick: bend a low, flexible branch down to the ground, scratch the bark where it touches, pin it down with a rock or wire, and mound soil over that spot. It grows roots there while the parent keeps it alive; a season or two later, cut it free and dig up your new plant.",
  },
  "root-cuttings": {
    name: "Grow new plants from root pieces (root cuttings)",
    plain:
      "For plants that sprout readily from their roots: in late fall or winter, dig and cut finger-length pieces of pencil-thick root, lay them horizontally in a tray of damp mix under about an inch of soil, and keep them warm. New shoots rise from the buried pieces.",
  },
  suckers: {
    name: "Dig up the shoots it sends up around itself (suckers)",
    plain:
      "Thicket-formers throw up new rooted shoots a short way from the trunk. In early spring, slice down between a sucker and the parent with a spade, lift the sucker with its own roots attached, and replant it. Free plants, and it tidies the clump.",
  },
  runners: {
    name: "Pot up the babies on its runners (stolons)",
    plain:
      "Strawberries and other creepers send out horizontal stems that root little plantlets along the way. Once a plantlet has its own roots, snip the runner connecting it to the parent, dig it up, and move it — or pin it into a small pot first, then cut it loose.",
  },
  spores: {
    name: "Sow the dust from the frond backs (spores)",
    plain:
      "Ferns make no seed — they scatter dust-fine spores from brown patches under mature fronds. Slower and fussier, but doable: lay a ripe frond on paper for a day to collect the brown dust, scatter it on the surface of damp sterile mix, cover with clear plastic, and keep it bright and moist. A green film appears first, then tiny ferns over months. Most gardeners find dividing an existing clump far easier.",
  },
};

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
  if (at3 >= 0.85) {
    return "Quick to settle in: expect close to this full size within about three years.";
  }
  if (atLast >= 0.85) {
    return `A steady grower: close to full size by year ${last.year}.`;
  }
  if (atLast >= 0.45) {
    return `In no hurry: about ${fracWord(atLast)} of its final height by year ${last.year}, still filling in for years after.`;
  }
  return `Slow and long-lived: roughly ${ftWord(last.heightFt)} by year ${last.year} on its way to ${ftWord(p.matureHeightFt)} — planted as much for the next generation as for you.`;
}

function fracWord(f: number): string {
  if (f >= 0.7) return "three-quarters";
  if (f >= 0.55) return "two-thirds";
  return "half";
}

function ftWord(v: number): string {
  if (v < 1) return `${Math.round(v * 12)} inches`;
  return `${v % 1 === 0 ? v : v.toFixed(1)} ft`;
}

export function confidencePlain(c: "high" | "medium" | "low"): string {
  switch (c) {
    case "high":
      return "We're fairly sure about this one — the numbers come from well-established data.";
    case "medium":
      return "Reasonably confident, but some numbers are estimated from close relatives.";
    case "low":
      return "Rougher estimate — treat as a starting point, not gospel.";
  }
}
