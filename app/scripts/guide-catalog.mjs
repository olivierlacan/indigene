// The guide's catalog: one entry per part of Indigene worth a page of its own.
//
// This file is the *curated* half of the guide. The other half is the
// changelog — `build-guide.mjs` reads every reader-facing bullet in
// CHANGELOG.md and files it under the section it belongs to, so each page
// carries a plain-words history of how that part of the app grew. Here we
// write the part a history can't: what the thing is for, and how you use it.
//
// Voice (see ../../CLAUDE.md, "Every word is short by default"): write for a
// curious person who has never gardened and never coded — a child, a
// grandparent — without ever writing down to them. Say the thing and stop.
// Explain a word they can't be expected to know, in place. Never name our own
// tooling. When we can't explain something in full, we point at someone
// trustworthy who can, and we say who they are.
//
// ------------------------------------------------------------------ shape ---
//
// Each section is:
//
//   id        Stable slug. Its page is /guide/<id>/.
//   label     The word a changelog entry prefixes itself with to file here —
//             `- Regions: North Michigan is on the map.` This is prose, not
//             syntax: it reads as a sentence, it shows on the What's-new page
//             like any other words, and it only classifies because it matches a
//             name we defined. Same shape as Keep a Changelog 2.0's own
//             `**Breaking:**` lead-in and this changelog's `Internal:`.
//   aliases   Other words that file to the same section (a plural, a synonym),
//             matched case- and punctuation-insensitively.
//   emoji     One glyph for the card. Decorative — the title carries the name.
//   title     What this part of the app is called, in plain words.
//   tagline   One line. Shown on the card and under the page title.
//   lede      2–4 short sentences: what it is, and who it's for.
//   steps     How you actually use it, as a short numbered list. Optional.
//   note      One extra thing worth knowing. Optional.
//   visit     [{label, href}] deep links into the live app, so the guide is a
//             way *in*, not only a way to read about it.
//   learn     [{label, source, href}] trusted places to learn more, for the
//             things a garden app has no business explaining in full. `source`
//             names who runs it, because a link the reader is asked to trust
//             should say whose word it is.
//   match     How the changelog finds this section, two honest ways:
//               segments  first path part of an indigene.app link in an entry
//                         (an entry linking …/wildlife/monarch is "wildlife").
//                         Free — most section-relevant entries already link.
//               The `label`/`aliases` prefix above is the other way, for the
//               entries that link nowhere and for a change touching more than
//               one section: `- Regions & Wildlife: …`.
//   published Whether the guide renders a page for it yet. A section can be
//             declared here — so its prefix is a valid, known name and its
//             history accrues — before its prose is written. The index and the
//             page build skip the unpublished ones; nothing half-written ships.
//
// The live app lives at this address; the guide's in-app links are absolute so
// the compiled page works wherever it's opened from.
export const APP = "https://indigene.app";

export const SECTIONS = [
  {
    id: "find",
    label: "Matches",
    aliases: ["find", "finder", "finding plants", "spot"],
    emoji: "🌱",
    title: "Finding your plants",
    tagline: "Tell Indigene where you are. It finds the plants that belong there.",
    lede:
      "This is the heart of the app. You say where a spot is and how much sun " +
      "it gets, and Indigene shows the plants that grew there long before the " +
      "town did — the ones the local insects, birds and soil already know. " +
      "“Native” just means that: from here, not brought in from somewhere else.",
    steps: [
      "Share your location, or drop a pin on the map. Nothing about where you are leaves your phone.",
      "Say how much sun the spot gets — full sun, part shade, or full shade.",
      "Read the ranked list. The best matches for your spot come first.",
      "Save a spot to keep its list and jot down what you’ve planted there.",
    ],
    note:
      "You don’t need to know a single plant name to start. The list is the " +
      "answer, not the test.",
    visit: [
      { label: "Find plants for a spot", href: `${APP}/` },
      { label: "Your saved spots", href: `${APP}/#/saved` },
    ],
    learn: [
      {
        label: "Why native plants matter, and how to start",
        source: "National Wildlife Federation",
        href: "https://www.nwf.org/Garden-for-Wildlife/About/Native-Plants",
      },
      {
        label: "Native plants for your area, by ZIP code",
        source: "National Audubon Society",
        href: "https://www.audubon.org/native-plants",
      },
    ],
    match: { segments: ["saved"] },
    published: true,
  },

  {
    id: "wildlife",
    label: "Wildlife",
    aliases: ["creatures"],
    emoji: "🦋",
    title: "The creatures your plants feed",
    tagline: "Every plant here is somebody’s food, home, or nursery.",
    lede:
      "A native plant isn’t decoration — it’s the bottom of a food web. " +
      "Indigene names the butterflies, moths, bees, birds and small mammals " +
      "each plant supports, and gives many of them a page and a photograph. " +
      "Some are picky: a caterpillar that eats only one kind of leaf is a " +
      "“host” relationship, and losing that plant means losing that creature.",
    steps: [
      "Open Wildlife to meet the animals the app knows.",
      "On any plant’s page, see which creatures it feeds.",
      "On an animal’s page, see the plants that keep it going — and add one to your spot.",
    ],
    note:
      "A “keystone” plant is one that feeds far more creatures than its " +
      "neighbours — plant one and you’ve done the work of ten.",
    visit: [
      { label: "Meet the wildlife", href: `${APP}/wildlife` },
      { label: "Butterflies and moths", href: `${APP}/wildlife/butterflies` },
    ],
    learn: [
      {
        label: "What pollinators are and why they matter",
        source: "U.S. Forest Service",
        href: "https://www.fs.usda.gov/wildflowers/pollinators/index.shtml",
      },
      {
        label: "Identify and record the creatures you see",
        source: "iNaturalist",
        href: "https://www.inaturalist.org/",
      },
      {
        label: "Bees, butterflies and other invertebrates, in depth",
        source: "The Xerces Society",
        href: "https://www.xerces.org/",
      },
    ],
    match: { segments: ["wildlife"] },
    published: true,
  },

  {
    id: "regions",
    label: "Regions",
    aliases: ["region"],
    emoji: "🗺️",
    title: "Your region",
    tagline: "The app covers real places, one at a time.",
    lede:
      "Plants don’t follow state lines — they follow climate, soil and " +
      "rainfall. So Indigene is built region by region: a stretch of country " +
      "where the same plants belong, from the Pacific Northwest to the " +
      "Mediterranean coast of France. Each region has its own roster and its " +
      "own map, so you can see whether it includes you.",
    steps: [
      "Open Regions to see the places the app covers so far.",
      "Pick the one you live in, or the nearest — the map shows its edges.",
      "Browse its plants, or jump straight to finding plants for a spot inside it.",
    ],
    note:
      "Don’t see your region yet? The app grows one at a time, and what’s " +
      "here is chosen for depth over breadth — a region is added when its " +
      "plants and their wildlife can be named properly, not just listed.",
    visit: [
      { label: "See the regions", href: `${APP}/regions` },
      { label: "Pacific Northwest", href: `${APP}/regions/pnw` },
    ],
    learn: [
      {
        label: "Find your growing zone from your address",
        source: "USDA (Plant Hardiness Zone Map)",
        href: "https://planthardiness.ars.usda.gov/",
      },
      {
        label: "What an ecoregion is, and why plants follow them",
        source: "U.S. EPA",
        href: "https://www.epa.gov/eco-research/ecoregions",
      },
    ],
    match: { segments: ["regions"] },
    published: true,
  },

  {
    id: "conservation",
    label: "Conservation",
    aliases: ["vulnerability", "at risk", "in trouble", "status"],
    emoji: "🛟",
    title: "When something's in trouble",
    tagline: "A few natives we recommend are themselves at risk. Here's what that means.",
    lede:
      "Some plants and animals here carry a conservation rank — an expert's read " +
      "on how close it is to disappearing. A rank belongs to a place: a plant " +
      "can be everywhere in one state and nearly gone in the next, so Indigene " +
      "shows one only where it means something to you — worldwide, or in your " +
      "own region's state. The code is worth a glance: a letter for the scale " +
      "(G is the whole world, S a single state) and a number from 1 (most at " +
      "risk) to 5 (secure); the IUCN uses words like Endangered instead. A span " +
      "such as G3G4 means the assessor placed it between the two.",
    note:
      "Most of what you'll plant is doing fine — the note shows only on the few " +
      "pages where it isn't. Where it does: buy from a nursery, never dig one " +
      "from the wild; for an animal, planting what it needs is the help it can use.",
    visit: [{ label: "Browse the plants", href: `${APP}/plants` }],
    learn: [
      {
        label: "How NatureServe ranks a species (G, N, S · 1–5)",
        source: "NatureServe",
        href: "https://www.natureserve.org/nsexplorer/about-the-data/statuses/conservation-status-categories",
      },
      {
        label: "What the Red List categories mean (CR, EN, VU…)",
        source: "IUCN Red List",
        href: "https://www.iucnredlist.org/resources/categories-and-criteria",
      },
    ],
    match: { segments: [] },
    published: true,
  },

  // ---- Declared, not yet written -----------------------------------------
  //
  // These are real parts of the app. Listing them here makes their prefix a
  // known, valid name *today* — `- Plants: …` files, and its history starts
  // accruing — before anyone sits down to write the prose. Flip `published` to
  // true once the lede and steps are filled in; the index and the page build
  // pick them up then, and not before.
  {
    id: "plants",
    label: "Plants",
    aliases: ["plant"],
    emoji: "🌾",
    title: "A plant’s own page",
    tagline: "Everything about one plant, in one place.",
    lede: "",
    visit: [{ label: "Browse the plants", href: `${APP}/plants` }],
    learn: [],
    match: { segments: ["plants"] },
    published: false,
  },
  {
    id: "planting",
    label: "Planting",
    aliases: ["how to plant", "propagation"],
    emoji: "🪴",
    title: "Growing them",
    tagline: "How to start a native plant, and when.",
    lede: "",
    visit: [{ label: "Planting how-tos", href: `${APP}/planting` }],
    learn: [],
    match: { segments: ["planting"] },
    published: false,
  },
  {
    id: "lookalikes",
    label: "Look-alikes",
    aliases: ["lookalikes", "look-alike"],
    emoji: "👀",
    title: "Telling look-alikes apart",
    tagline: "The native, and the impostor next to it.",
    lede:
      "You look a plant up because you're not sure what you're holding — and " +
      "half the time the plant on the nursery bench isn't quite the one on the " +
      "label. A garden centre sells the invasive Callery pear beside the native " +
      "serviceberry; a hedge of cherry laurel reads as holly at a glance. So for " +
      "each native we recommend, we've written up the plants it gets mistaken " +
      "for, and — standing right in front of it — how to tell them apart: a " +
      "smell, a thorn, a leaf stalk that bleeds white, not a botanical key you'd " +
      "need a lens for. Not every look-alike is a villain, and the label on each " +
      "says which: invasive here, merely not from here, or a wild native the " +
      "mix-up still matters for. When you're truly unsure, photograph it and ask " +
      "iNaturalist — real people identify what you've found.",
    visit: [
      { label: "See the look-alikes", href: `${APP}/lookalikes` },
      { label: "Browse the plants", href: `${APP}/plants` },
    ],
    learn: [
      {
        label: "Identify a plant from a photo",
        source: "iNaturalist",
        href: "https://www.inaturalist.org",
      },
      {
        label: "Why invasive plants are a problem",
        source: "National Invasive Species Information Center",
        href: "https://www.invasivespeciesinfo.gov/subject/plants",
      },
    ],
    match: { segments: ["lookalikes"] },
    published: true,
  },
  {
    id: "alternatives",
    label: "Native swaps",
    aliases: ["alternatives", "swaps", "native swaps"],
    emoji: "🌿",
    title: "What to grow instead",
    tagline: "The native that does the ornamental's job, and gives more back.",
    lede:
      "Before you buy, the question is what to plant — and the usual answer at " +
      "the nursery is something that isn't from here. This is the other way " +
      "round. Start from the garden job you have — a lawn, a hedge, a shade " +
      "tree, a plant “for butterflies” — and find the native that does " +
      "it at least as well, and usually better: for the wildlife it feeds and " +
      "the water it saves. Each swap sets the two side by side on the things " +
      "that actually decide it: water (will it want the hose all summer?), " +
      "disease, and what it feeds. Where the native only ties the ornamental we " +
      "say so; where it wins — a Bermuda-grass lawn against little bluestem, a " +
      "butterfly bush against the milkweed a monarch actually needs — the page " +
      "shows you why. It's a positive list, not a scold: a better choice, freely " +
      "made.",
    visit: [
      { label: "See the native swaps", href: `${APP}/alternatives` },
      { label: "Browse the plants", href: `${APP}/plants` },
    ],
    learn: [
      {
        label: "Why a native feeds more than an ornamental",
        source: "Homegrown National Park",
        href: "https://homegrownnationalpark.org",
      },
      {
        label: "Find native plants for your area",
        source: "Lady Bird Johnson Wildflower Center",
        href: "https://www.wildflower.org/plants/",
      },
    ],
    match: { segments: ["alternatives"] },
    published: true,
  },
  {
    id: "privacy",
    label: "Privacy",
    aliases: [],
    emoji: "🔒",
    title: "Your privacy",
    tagline: "Where your location goes: nowhere.",
    lede: "",
    visit: [{ label: "Privacy & safety", href: `${APP}/privacy` }],
    learn: [],
    match: { segments: ["privacy"] },
    published: false,
  },
  {
    id: "sources",
    label: "Sources",
    aliases: ["data", "citations"],
    emoji: "📚",
    title: "Where the numbers come from",
    tagline: "Public science, cited, with our confidence shown.",
    lede: "",
    visit: [{ label: "Our sources", href: `${APP}/sources` }],
    learn: [],
    match: { segments: ["sources"] },
    published: false,
  },
];

// The id → section lookup the compiler and its check share.
export const SECTION_BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));

// segment → section id, built from each section's `match.segments`. This is
// how a bullet's link becomes a filing decision with no second list to keep.
export const SEGMENT_TO_ID = (() => {
  const m = new Map();
  for (const s of SECTIONS) {
    for (const seg of s.match?.segments ?? []) {
      if (m.has(seg) && m.get(seg) !== s.id) {
        throw new Error(
          `guide catalog: segment "${seg}" is claimed by both ` +
            `"${m.get(seg)}" and "${s.id}" — a link can only file one way`,
        );
      }
      m.set(seg, s.id);
    }
  }
  return m;
})();

// A prose prefix matches a section by its `label` or an alias, compared with
// case, spaces and hyphens ignored — so "Look-alikes", "lookalikes" and
// "look alikes" are one name, and "Regions" reads the same as "regions".
const normalize = (s) => s.toLowerCase().replace(/[\s-]+/g, "");
export const LABEL_TO_ID = (() => {
  const m = new Map();
  for (const s of SECTIONS) {
    for (const name of [s.label, ...(s.aliases ?? [])]) {
      if (!name) continue;
      const key = normalize(name);
      if (m.has(key) && m.get(key) !== s.id) {
        throw new Error(
          `guide catalog: label "${name}" is claimed by both ` +
            `"${m.get(key)}" and "${s.id}" — a prefix can only file one way`,
        );
      }
      m.set(key, s.id);
    }
  }
  return m;
})();

/**
 * Read a changelog entry's leading prose prefix as a list of section ids.
 *
 * `head` is the text before the entry's first colon (e.g. "Regions",
 * "Regions & Wildlife"). It's split on commas, ampersands and "and", and each
 * part must match a known label — that is the whole guard: a prefix files a
 * change only when every name in it is one we defined. If any part is unknown,
 * this returns null and the caller treats the colon as ordinary punctuation, so
 * "Fixed: …" or "Note: …" is never mistaken for a section.
 */
export function matchLabels(head) {
  const parts = head.split(/\s*[,&]\s*|\s+and\s+/i).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const ids = [];
  for (const p of parts) {
    const id = LABEL_TO_ID.get(normalize(p));
    if (!id) return null; // one unknown name → the whole prefix is just prose
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

/** The canonical prefix labels, for humans writing entries and for docs. */
export const SECTION_LABELS = SECTIONS.map((s) => s.label);
