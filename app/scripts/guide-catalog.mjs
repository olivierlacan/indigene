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
//   id        Stable slug. Its page is /guide/<id>/, and it is the name a
//             changelog bullet uses in a `<!-- guide: <id> -->` marker.
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
//   match     How the changelog finds this section:
//               segments  first path part of an indigene.app link in a bullet
//                         (a bullet linking …/wildlife/monarch is "wildlife").
//               A bullet with none of these still lands here if it carries an
//               explicit `<!-- guide: <id> -->` marker — that's the escape
//               hatch for the many bullets that link nowhere.
//   published Whether the guide renders a page for it yet. A section can be
//             declared here — so a changelog marker for it is valid and its
//             history accrues — before its prose is written. The index and the
//             page build skip the unpublished ones; nothing half-written ships.
//
// The live app lives at this address; the guide's in-app links are absolute so
// the compiled page works wherever it's opened from.
export const APP = "https://indigene.app";

export const SECTIONS = [
  {
    id: "find",
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

  // ---- Declared, not yet written -----------------------------------------
  //
  // These are real parts of the app. Listing them here makes a
  // `<!-- guide: <id> -->` marker for them valid *today*, so their history
  // starts accruing from the changelog before anyone sits down to write the
  // prose. Flip `published` to true once the lede and steps are filled in —
  // the index and the page build pick them up then, and not before.
  {
    id: "plants",
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
    emoji: "👀",
    title: "Telling look-alikes apart",
    tagline: "The native, and the impostor next to it.",
    lede: "",
    visit: [{ label: "Look-alikes", href: `${APP}/lookalikes` }],
    learn: [],
    match: { segments: ["lookalikes"] },
    published: false,
  },
  {
    id: "privacy",
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
