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
//   parts     [{id, heading, body, steps, list, after}] the guide's depth, for a
//             part of the app with more to it than a lede can carry. `body` and
//             `after` are a paragraph or a list of them, around optional
//             numbered `steps` and a bulleted `list`. Optional. Three or more
//             get a row of jump links at the top. Link another guide in the
//             words with `guide(id)`; `guideProblems()` refuses one that
//             doesn't exist.
//   related   [{id, why}] the guides this one meshes with, shown under "Goes
//             well with": `why` is the one line that tells a reader whether to
//             go — what that guide adds to this one, not what it is.
//   home      Where a changelog prefix naming this section links. Optional;
//             defaults to the first `visit` link.
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

/** The address of another guide, for linking one guide from another's words. */
export const guide = (id, anchor) => `${APP}/guide/${id}/${anchor ? `#${anchor}` : ""}`;

export const SECTIONS = [
  // Ordered the way a newcomer meets the app: find a spot, read the list, keep
  // the spot, then everything a plant or a place leads on to.
  {
    id: "find",
    label: "Matches",
    aliases: ["find", "finder", "finding plants"],
    emoji: "🌱",
    title: "Finding your plants",
    tagline: "Tell Indigene where you’ll plant. It finds the natives that suit that spot.",
    lede:
      "This is the heart of the app. You tell it where a patch of ground is and " +
      "how much sun it gets, and it ranks the plants that grew wild there before " +
      "the houses did: the ones the local insects, birds and soil already know. " +
      `[“Native”](${APP}/native) means just that: it evolved here.`,
    steps: [
      "On the home page, tap **Start where you’re standing**.",
      "Put the pin on your spot, say how much sun it gets, and check the soil.",
      "Pick what the spot is for, or keep the usual goal: feeding wildlife.",
      "Read your list. Best matches come first.",
    ],
    parts: [
      {
        id: "where",
        heading: "1. Where is the spot?",
        body:
          "There are three ways in, and you only need one:",
        list: [
          "**📍 Use my location**, if you’re standing on the spot. Your phone asks first.",
          "**Search by town**: type a town, city or postal code, then drag the pin roughly onto your garden.",
          "**🗺️ Pick your region**: skip the map entirely. The list still works, but without a point on the map Indigene can’t look up your soil, rain or winter cold, so it leans on your answers.",
        ],
        after: [
          "The map moves under a pin that stays in the middle. Press and hold the " +
            "map to open a magnifier and nudge the pin a few metres at a time. " +
            "Useful when the front and back of a house get different sun.",
          `Your location goes only to the public map, soil and weather services that ` +
            `look it up, never to us: there is no Indigene server. [Your privacy](${guide("privacy")}) has the full list.`,
        ],
      },
      {
        id: "sun",
        heading: "2. How much sun?",
        body:
          "Pick the closest of three: **sunny most of the day** (six hours or " +
          "more of direct sun), **about half the day**, or **mostly shady**. " +
          "Sun matters most because it decides what can grow at all.",
        list: [
          "Tick **trees overhead that go bare in winter** if that’s your spot: bare branches make spring much sunnier.",
          "Want a sharper answer? **Scan the sky** uses your phone’s camera to measure how much the buildings and trees around you block. It’s optional.",
        ],
      },
      {
        id: "soil",
        heading: "3. Soil and climate",
        body:
          "Indigene looks up your winter cold, rainfall, slope and soil from public " +
          "maps. Soil maps are coarse, so it asks you one thing: **how wet does the " +
          "spot stay?** Dry, evenly moist, or wet. The map’s guess is already " +
          "picked; change it if you know better. Not sure? Your hands can tell you " +
          "in a minute:",
        steps: [
          "Wet a small handful of soil until it’s damp, not dripping.",
          "Squeeze it into a ball. Won’t hold together and feels gritty? It’s sandy: pick **Dry**.",
          "Press it between thumb and finger into a flat ribbon.",
          "A short ribbon that breaks and feels smooth is loam or silt: **Evenly moist**. A long, sticky ribbon is clay, which often stays **Wet**.",
        ],
        after: "What you find in your hand beats the map.",
      },
      {
        id: "goals",
        heading: "4. What is the spot for?",
        body:
          "Every list is ranked for a goal: feeding the most wildlife, birds, " +
          "butterflies, stopping erosion, soaking up rain, or the easiest plants " +
          `to grow. [How the list is ranked](${guide("ranking")}) explains each one, ` +
          "and how to fine-tune it.",
      },
      {
        id: "list",
        heading: "5. Your list",
        body: [
          "The best 25 matches are shown, best first. Each card says how well the " +
            "plant suits the spot (**Good match**, **Workable here**, or **Poor " +
            "match** with the reason why) and how much it does for wildlife.",
          "Plants that can’t survive your winters are left off entirely. Tap any " +
            `plant for [its own page](${guide("plants")}). Tap **💾 Save this spot** ` +
            `to keep the list and start a [plant log](${guide("spots")}).`,
        ],
      },
    ],
    note:
      "You don’t need to know a single plant name to start. The list is the " +
      "answer, not the test.",
    visit: [
      { label: "Find plants for a spot", href: `${APP}/` },
      { label: "Browse without a location", href: `${APP}/browse` },
    ],
    related: [
      { id: "ranking", why: "Why a plant ranks where it does, and the filters that narrow the list." },
      { id: "spots", why: "Save the spot to keep its list, log what you plant, and see who visits." },
      { id: "regions", why: "Prefer not to share a location? Start from your region instead." },
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
    match: { segments: ["results", "location", "sun"] },
    published: true,
  },

  {
    id: "ranking",
    label: "Ranking",
    aliases: ["filters", "goals", "priorities", "ranked list"],
    emoji: "⚖️",
    title: "How your list is ranked and filtered",
    tagline: "Why one plant comes first, and how to narrow the list to what you need.",
    lede:
      "Your plant list isn’t random, and it isn’t only the “best” plants. It’s " +
      "the plants that suit your spot, sorted by what you said the spot is for. " +
      "Change the goal and the leaders change. Set a filter and plants that " +
      "don’t pass it leave the list.",
    parts: [
      {
        id: "order",
        heading: "What decides the order",
        body: "Two things, multiplied together:",
        list: [
          "**How well it suits the spot.** Sun counts most, then how wet the ground stays, then how acid the soil is. A poor fit doesn’t vanish, but it sinks.",
          "**How much it does for your goal.** Each plant is scored on seven things: feeding caterpillars, feeding bees and butterflies, feeding birds, soaking up rain, holding soil, storing carbon, and surviving on its own.",
        ],
        after:
          "One rule is absolute: a plant that can’t survive your winter cold is " +
          "left off the list, whatever its score.",
      },
      {
        id: "goals",
        heading: "Pick a goal",
        body:
          "On the **What matters most here?** step, or by tapping **Goal** at the " +
          "top of your list:",
        list: [
          "🐛 **Feed the most wildlife**: the usual goal. Caterpillars first, then bees and birds.",
          "⚖️ **A bit of everything**: wildlife, rain and easy care count about the same.",
          "🦋 **Butterflies & moths**: leaves their caterpillars can eat, flowers for the adults.",
          "🐦 **Birds**: berries, seeds, cover, and caterpillars to feed their chicks.",
          "⛰️ **Stop erosion**: deep roots for a slope or bank that washes away.",
          "🌧️ **Soak up rain**: for a wet corner, a downspout or a rain garden.",
          "🌵 **Easiest to grow**: the best odds of surviving with no watering and little fuss.",
        ],
        after:
          "Under **⚖️ Fine-tune it yourself**, seven sliders set how much each thing " +
          "counts, from “ignore it” to “counts most of all”. Move one and the goal " +
          "becomes “your own mix”. A preview shows the top three change as you go.",
      },
      {
        id: "cards",
        heading: "Reading a plant card",
        list: [
          "**Good match for this spot**, **Workable here** or **Poor match**, with reasons like “Wants more sun than this spot gets”.",
          "Its full-grown size and when it flowers.",
          "**Wildlife value**, out of 100, and **Counts most here**: the two things that lifted it highest for your goal.",
          `Labels such as **Essential** or **No watering**. [What each label means](${APP}/traits).`,
        ],
      },
      {
        id: "filters",
        heading: "Filters",
        body:
          "Tap **Filters** at the top of your list to keep only plants that pass:",
        list: [
          "🌾 **Survives with no watering** once it has settled in.",
          "🦌 **Deer tend to leave it alone.**",
          "🚫 **No thorns or stings**: nettles count as stings.",
          "🐕 **Safe around pets**: leaves out anything that can upset a stomach.",
          "✋ **No aggressive spreaders.**",
          "📏 **Stays under** a height, and ↔️ a width, when full-grown.",
        ],
        after: [
          "Filters stay set on this device and apply to every new list, saved " +
            "spots included, until you untick them. If a list comes up empty, a " +
            "size limit is the usual cause.",
          "The name box above the list searches all of it, not just the 25 shown. " +
            "Type “oak” to find an oak ranked 40th.",
        ],
      },
      {
        id: "labels",
        heading: "Filters and labels are the same facts",
        body:
          "Filters work on your ranked list only. On the list of every " +
          "plant, or a region’s plants, you can search by name and browse by " +
          "kind (trees, shrubs, grasses), but not filter. What you can do there is " +
          "read the labels on each plant’s page. Each one matches a filter:",
        list: [
          "🌾 **No watering** → Survives with no watering",
          "🦌 **Deer-resistant** → Deer tend to leave it alone",
          "🚫 **Thorny** or **Stings** → No thorns or stings",
          "🐕 **Inedible** → Safe around pets",
          "✋ **Spreads** → No aggressive spreaders",
          "📏 **Full size** → Stays under a height or width",
        ],
        after:
          "Found a plant you like while browsing? **Rank these for my spot**, at " +
          "the bottom of a region’s list or the plant list, takes you into the " +
          "ranked list, where the filters work.",
      },
    ],
    note:
      "A low wildlife score isn’t a bad plant. A grass that holds a slope may " +
      "feed few caterpillars and still be exactly right. That’s what the goals " +
      "are for.",
    visit: [
      { label: "Find plants for a spot", href: `${APP}/` },
      { label: "What the labels mean", href: `${APP}/traits` },
    ],
    related: [
      { id: "find", why: "The steps before the list: your spot, its sun and its soil." },
      { id: "plants", why: "Every label and figure on a card, explained on the plant’s page." },
      { id: "spots", why: "A saved spot keeps its goal, so the list comes back the way you set it." },
    ],
    learn: [
      {
        label: "Why caterpillars matter so much to birds",
        source: "Homegrown National Park",
        href: "https://homegrownnationalpark.org",
      },
    ],
    match: { segments: ["priorities", "traits"] },
    published: true,
  },

  {
    id: "spots",
    label: "Spots",
    aliases: ["spot", "saved spots", "saved spot", "season plan", "season plans", "plant log"],
    emoji: "🔖",
    title: "Saved spots",
    tagline: "A notebook for each patch of ground: what suits it, what you planted, who came.",
    lede:
      "A spot is one patch of ground: the strip by the driveway, a shady back " +
      "corner, a balcony box. Saving it keeps its plant list, and gives it a " +
      "page where you can log what you plant, see the wildlife it can feed, and " +
      "get a plan for each season. Most gardens have more than one spot, because " +
      "sun and soil change a few steps away.",
    steps: [
      "Find plants for a spot, then tap **💾 Save this spot** under the list and give it a name.",
      "When you plant something, tap **🌱 I planted one** on that plant’s page.",
      "Come back to **Saved spots** (in the ⚙️ menu, or on the home page) to see how it’s going.",
    ],
    parts: [
      {
        id: "save",
        heading: "Saving a spot",
        body: [
          "Save from the bottom of your plant list. The name is yours to choose; " +
            "the town is suggested. A spot needs a point on the map, so a list " +
            "started by picking a region can’t be saved. Put the pin down first.",
          "Saved spots live in this browser, on this device, and nowhere else. " +
            `That keeps them private, and it means you should [keep a copy](${guide("backup")}).`,
        ],
      },
      {
        id: "page",
        heading: "A spot’s page",
        body: "Tap a spot on **Saved spots** to open it. From the top:",
        list: [
          "**What’s growing here**: how many plants and kinds you’ve logged, and how many raise caterpillars.",
          "**Rename** or **Move**: move the pin if you saved it in the wrong place.",
          "The season plan, the wildlife, and your plant log, each explained below.",
          "**Plant more**: opens the spot’s ranked list again, with the goal you saved it with.",
        ],
        after:
          "To delete a spot, use 🗑 beside it on the Saved spots list. It removes " +
          "its plant log too, and can’t be undone.",
      },
      {
        id: "log",
        heading: "Logging what you plant",
        body:
          "On a plant’s page, **🌱 I planted one** asks which spot it went into " +
          "and opens that spot with the plant already chosen. You can also add " +
          "one from the spot page, under **Add a plant you’ve planted**. Then say:",
        list: [
          "**When it went in.** A year alone is fine: “2024” is enough.",
          "**How many.** Six milkweeds count as six.",
        ],
        after: [
          "Each row then shows how long it’s been in the ground and how big it " +
            "should be by now if it’s thriving, from the plant’s measured growth. " +
            "In the first year it says “First year is roots, not shoots”: most " +
            "natives grow down before they grow up.",
          `Photographed it on iNaturalist? You can link the photo to the row. [Linking iNaturalist](${guide("inaturalist")}) explains how.`,
        ],
      },
      {
        id: "wildlife",
        heading: "The wildlife at your spot",
        list: [
          "**Wildlife in the neighborhood**: the animals known to eat or shelter in what you’ve planted, and which of your plants each one uses. ⭐ means no other plant will do. It says they *can* use it, not that they’ve found it yet.",
          "**Spotted around here**: tap **Look on iNaturalist** to see photos of those animals taken within 5 km. A 👀 badge on an animal counts its sightings. iNaturalist gets a point rounded to about 1 km, never the spot itself.",
        ],
        after: `[The creatures your plants feed](${guide("wildlife")}) explains what “host” and “essential” mean.`,
      },
      {
        id: "season",
        heading: "The season plan",
        body:
          "Once plants are logged with a date, **Grow more this season** names " +
          "the ones old enough to share and what to do now: collect ripe seed, " +
          "divide a clump, take cuttings. Plants wildlife needs most come first. " +
          "Each task links to its how-to.",
        list: [
          "**See the whole season plan** adds what’s coming up next season.",
          "**Plant next, for the wildlife** looks up the animals seen near the spot at this time of year, and suggests natives you haven’t planted that would feed them.",
          "The **Saved spots** page shows the three most useful tasks across all your spots.",
        ],
        after:
          "Trees and shrubs wait until their kind is old enough to bear seed: a " +
          `white oak, about 20 years. [Growing more](${guide("planting")}) covers every technique.`,
      },
    ],
    note:
      "A spot has no web address anyone else can open. It exists only on your " +
      "device, which is the point.",
    visit: [
      { label: "Your saved spots", href: `${APP}/#/saved` },
      { label: "Find a spot", href: `${APP}/` },
    ],
    related: [
      { id: "backup", why: "Your spots live only on this device. A copy takes ten seconds." },
      { id: "inaturalist", why: "Bring your own plant and wildlife photos into a spot." },
      { id: "planting", why: "The how-to behind every task in the season plan." },
      { id: "wildlife", why: "Who the animals at your spot are, and what they need." },
    ],
    learn: [
      {
        label: "Turn a yard into habitat, step by step",
        source: "National Wildlife Federation",
        href: "https://www.nwf.org/Garden-for-Wildlife",
      },
    ],
    match: { segments: ["saved"] },
    published: true,
  },

  {
    id: "plants",
    label: "Plants",
    aliases: ["plant"],
    emoji: "🌾",
    title: "A plant’s own page",
    tagline: "Everything about one plant, in one place.",
    lede:
      "Every plant in Indigene has a page: what it needs, what it feeds, how to " +
      "grow more of it, and whether it would suit a spot of yours. You reach one " +
      "by tapping a plant anywhere in the app, or by searching for it.",
    parts: [
      {
        id: "search",
        heading: "Finding a plant by name",
        body: [
          "**Native plants** lists every plant Indigene knows. Type a common " +
            "name, in English or French, or the Latin one: “milkweed”, “oak”, " +
            "“Asclepias”.",
          "Search for a plant that isn’t native, like “butterfly bush”, and " +
            "if Indigene has a page about it, it offers that instead: an " +
            "[invasive](" + guide("invasives") + ") to remove, a " +
            "[look-alike](" + guide("lookalikes") + "), or a " +
            "[native swap](" + guide("alternatives") + ").",
        ],
      },
      {
        id: "top",
        heading: "At the top",
        list: [
          "**Native to**: the regions it’s on. If it’s on several, its figures can be read for each.",
          "**Labels**: Essential, No watering, Deer-resistant, Thorny and so on. Tap one for what it means.",
          "**Where it’s native**: and whether Kew’s World Checklist, a worldwide record of where plants grow wild, agrees. Where it doesn’t, the page says so.",
          `A [conservation note](${guide("conservation")}), on the few plants that are themselves at risk.`,
          "**Don’t confuse it with** and **Grow it instead of**: its look-alikes and the ornamentals it can replace.",
        ],
      },
      {
        id: "figures",
        heading: "The figures",
        body:
          "Tiles give its sun, moisture, winter hardiness, soil acidity (pH), full " +
          "size, growth, caterpillar count and flowering months. A chart shows its " +
          "height year by year. Beside them, a **Confidence** meter says [how sure " +
          `we are](${APP}/confidence) of these figures. [Where the numbers come from](${guide("sources")}).`,
      },
      {
        id: "below",
        heading: "Further down",
        list: [
          "**Growing needs**: how to look after it.",
          "**Ecosystem services**: the wildlife it brings in, each with its own page, and its seven scores in plain words.",
          "**See it growing near you**: real photos of it in the wild near you, from iNaturalist.",
          `**How to grow more**: the ways to propagate it, each linked to a [how-to](${guide("planting")}).`,
          "**Want to plant it? Check your spot**: see if it suits where you are.",
          "**Look it up elsewhere**: the same plant in Kew, GBIF, USDA PLANTS and other references.",
        ],
      },
      {
        id: "your-spots",
        heading: "When you have saved spots",
        body:
          "If one of your saved spots would suit the plant, the page says so and " +
          "links to it. Planted one? **🌱 I planted one** adds it to that spot’s " +
          `log. [Saved spots](${guide("spots")}) explains the log.`,
      },
    ],
    visit: [
      { label: "Browse the plants", href: `${APP}/plants` },
      { label: "What the labels mean", href: `${APP}/traits` },
    ],
    related: [
      { id: "ranking", why: "The same labels, used as filters on your ranked list." },
      { id: "wildlife", why: "The creatures a plant feeds, and why some can eat only one plant." },
      { id: "sources", why: "What the Confidence meter and the Kew check mean." },
    ],
    learn: [
      {
        label: "Where any plant grows wild, worldwide",
        source: "Plants of the World Online (Kew)",
        href: "https://powo.science.kew.org/",
      },
    ],
    match: { segments: ["plants"] },
    published: true,
  },

  {
    id: "planting",
    label: "Planting",
    aliases: ["how to plant", "propagation", "growing more"],
    emoji: "🪴",
    title: "Growing more",
    tagline: "Turn one native into several: from seed, or from the plant you have.",
    lede:
      "Native plants can be hard to find in shops, and one plant can become " +
      "many. **Ways to grow more** gathers fifteen techniques, from sowing seed " +
      "to splitting a clump, each with when to do it and what usually goes wrong.",
    parts: [
      {
        id: "two-ways",
        heading: "Two ways to start",
        list: [
          "**From seed you collect**: sow it as it is, give it a cold damp winter first (gardeners call that “stratification”), nick a hard seed coat, or press tiny seed onto the surface.",
          "**From the plant you already have**: split a clump, root a cutting, bend a branch down to root, or pot up the babies on its runners.",
        ],
      },
      {
        id: "now",
        heading: "What to do now",
        body:
          "The top of the page shows the techniques in season right now, from " +
          "your device’s date and your half of the world. Seasons, not dates: a " +
          "late spring is still spring.",
      },
      {
        id: "technique",
        heading: "A technique’s page",
        list: [
          "**What you actually do**, step by step.",
          "**Knowing the moment**: the sign that it’s time.",
          "**Where it usually goes wrong.**",
          "**Plants here that use it**, and the published guides it was checked against.",
        ],
      },
      {
        id: "links",
        heading: "From a plant, or from your spot",
        body:
          `Every [plant’s page](${guide("plants")}) has **How to grow more**: the ` +
          "methods that work for that plant, and when. And a saved spot’s season " +
          "plan picks the plants you’ve logged that are old enough to share, and " +
          `tells you which technique to use this season. See [Saved spots](${guide("spots", "season")}).`,
      },
    ],
    note:
      "Collect seed only from plants you own or have permission to take from, " +
      "and never dig a plant from the wild.",
    visit: [
      { label: "Ways to grow more", href: `${APP}/planting` },
      { label: "Your saved spots", href: `${APP}/#/saved` },
    ],
    related: [
      { id: "spots", why: "A season plan for the plants you’ve logged." },
      { id: "plants", why: "Each plant’s own methods, under How to grow more." },
    ],
    learn: [
      {
        label: "How to grow native plants, species by species",
        source: "Native Plant Network (U.S. Forest Service)",
        href: "https://npn.rngr.net/propagation/protocols",
      },
      {
        label: "Propagation techniques explained",
        source: "Royal Horticultural Society",
        href: "https://www.rhs.org.uk/propagation",
      },
    ],
    match: { segments: ["planting"] },
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
      "A native plant isn’t decoration. It’s the bottom of a food web. " +
      "Indigene names the butterflies, moths, bees, birds and small mammals " +
      "each plant supports, and gives many of them a page and a photograph. " +
      "Some are picky: a caterpillar that eats only one kind of leaf is a " +
      "“host” relationship, and losing that plant means losing that creature.",
    steps: [
      "Open **Wildlife** to meet the animals the app knows. Narrow it by group (butterflies, birds…) or by region.",
      "On any plant’s page, see which creatures it feeds.",
      "On an animal’s page, see the plants that keep it going, and photos of it near you.",
    ],
    parts: [
      {
        id: "start",
        heading: "Starting from an animal",
        body:
          "Want monarchs, or bluebirds? Open the animal, read **Plants that " +
          "support this animal**, then tap **Rank these for my spot** to see which " +
          `of them suit your garden. [How your list is ranked](${guide("ranking")}) ` +
          "has a goal for butterflies and one for birds.",
      },
      {
        id: "at-home",
        heading: "At your own spot",
        body:
          "Once you’ve logged what you planted, a saved spot shows the animals " +
          "those plants can feed, and can look for photos of them taken nearby. " +
          `See [Saved spots](${guide("spots", "wildlife")}).`,
      },
    ],
    note:
      `An [essential plant](${APP}/traits) (ecologists say “keystone”) feeds far more ` +
      "creatures than its neighbors. Plant one and you’ve done the work of ten.",
    visit: [
      { label: "Meet the wildlife", href: `${APP}/wildlife` },
      { label: "Butterflies and moths", href: `${APP}/wildlife/butterflies` },
    ],
    related: [
      { id: "spots", why: "See which animals your own plantings can feed." },
      { id: "inaturalist", why: "Where the wildlife photos come from, and how to add yours." },
      { id: "crops", why: "Will all those insects eat the vegetables? What farms measured." },
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
    id: "inaturalist",
    label: "iNaturalist",
    aliases: ["inat", "sightings"],
    emoji: "📷",
    title: "Linking iNaturalist",
    tagline: "Real photos from people near you, and your own if you like.",
    lede:
      "iNaturalist is a free nonprofit website and app where people photograph " +
      "plants and animals and help each other name them. Indigene uses it in " +
      "two ways: to show what grows and flies near you, which needs no account, " +
      "and to bring your own photos into your saved spots, which needs only your " +
      "username.",
    parts: [
      {
        id: "no-account",
        heading: "Without an account",
        list: [
          "**See it growing near you**, on a plant’s page: confirmed wild photos of it nearby.",
          "**See it near you**, on an animal’s page.",
          "**Spotted around here**, on a saved spot: photos of the animals your plants can feed, within 5 km.",
          "**Plant next, for the wildlife**, in a spot’s season plan.",
        ],
        after:
          "Nothing is asked until you tap. Confirmed means at least two people on " +
          "iNaturalist agreed on what it is.",
      },
      {
        id: "link",
        heading: "Linking your username",
        steps: [
          "In **Settings**, find **Your iNaturalist account**.",
          "Type your username (the name after /people/ in your profile’s address) and tap **Link**.",
        ],
        after:
          "There’s no password and no sign-in, so Indigene can only read what’s " +
          "already public. It can never post anything to your account.",
      },
      {
        id: "unlocks",
        heading: "What linking adds",
        list: [
          "**Import from iNaturalist**, on a saved spot: your plant photos from the past five years within 35 km of it. Tick the natives you planted and they join the log, dated by the photo. Invasives that others have confirmed can join the spot’s list of things to deal with.",
          "**Pick from your photos** when you log a plant: tap one and its date fills itself in.",
          "**Your wildlife sightings here**: your own animal photos within 1 km of the spot, and which of your plants might have drawn each one in, like “Feeds on your Oregon grape’s nectar”.",
        ],
      },
      {
        id: "privacy",
        heading: "What iNaturalist is told",
        list: [
          "Looking for wildlife near a spot: a point rounded to about 1 km, never the spot itself.",
          "Your own sightings: your username only, never a place. The distance is worked out on your device.",
          "Your username stays on this device, and goes only to iNaturalist.",
        ],
        after: `[Your privacy](${guide("privacy")}) covers every service Indigene talks to.`,
      },
    ],
    note:
      "The photos stay on iNaturalist. Indigene keeps only a link to each one.",
    visit: [
      { label: "Link your account", href: `${APP}/#/settings/inat` },
      { label: "Your saved spots", href: `${APP}/#/saved` },
    ],
    related: [
      { id: "spots", why: "Where your linked photos and sightings show up." },
      { id: "privacy", why: "Exactly what leaves your device, and where it goes." },
    ],
    learn: [
      {
        label: "Getting started on iNaturalist",
        source: "iNaturalist",
        href: "https://www.inaturalist.org/pages/getting+started",
      },
    ],
    match: { segments: ["import"] },
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
      "Plants don’t follow state lines. They follow climate, soil and " +
      "rainfall. So Indigene is built region by region: a stretch of country " +
      "where the same plants grow wild, from the Pacific Northwest to the " +
      "Mediterranean coast of France. Each region has its own plant list and its " +
      "own map, so you can see whether it includes you.",
    steps: [
      "Open **Regions** to see the places the app covers so far.",
      "Pick the one you live in, or the nearest. The map shows its edges.",
      "Browse its plants, or tap **Rank these for my spot** to sort them for your garden.",
    ],
    parts: [
      {
        id: "page",
        heading: "On a region’s page",
        list: [
          "Its plants, grouped by kind: trees, shrubs, wildflowers, grasses, vines, groundcovers, ferns. Tap a kind to see only those, or type a name to narrow the list.",
          "**Pavement pioneers**: the natives that grow where the ground is packed, salted or baking: a gap in the kerb, a car-park island.",
          `Its [worst invasives](${guide("invasives")}), [look-alikes](${guide("lookalikes")}) and [native swaps](${guide("alternatives")}).`,
          "The wildlife its plants feed, and further reading local experts recommend.",
        ],
      },
      {
        id: "zones",
        heading: "Ecoregions and hardiness zones",
        body: [
          "Two numbers describe where you are, and you’ll see both as small " +
            "capsules beside your spot.",
        ],
        list: [
          "**Ecoregion**, like **EPA 2**: an area with the same climate, soils and wild plants. Scientists draw them, and Indigene uses them to pick your plant list. In the US they come from the EPA; across the US–Canada border from the CEC, a three-country commission; in Europe from the European Environment Agency (EEA); south of the equator from RESOLVE, a conservation group.",
          "**Hardiness zone**, like **USDA 8b**: how cold your coldest winter nights get, in steps of 10 °F (about 5.5 °C). Plant tags use it. Indigene works it out for your exact spot from weather records (Open-Meteo), using the USDA’s steps, so no map is needed.",
        ],
        after:
          "A plant is “hardy” in your zone if it survives that cold. Plants that " +
          "aren’t are left off your list.",
      },
      {
        id: "no-location",
        heading: "No location needed",
        body:
          "You can find plants without sharing where you are: on the first step, " +
          "choose **🗺️ Pick your region**. The list then can’t account for your " +
          "soil or winter cold, so it leans on what you tell it. " +
          `[Finding your plants](${guide("find")}) explains the trade-off.`,
      },
    ],
    note:
      "Don’t see your region yet? The app grows one at a time, and what’s " +
      "here is chosen for depth over breadth. A region is added when its " +
      "plants and their wildlife can be named properly, not just listed.",
    visit: [
      { label: "See the regions", href: `${APP}/regions` },
      { label: "Further reading", href: `${APP}/reading` },
    ],
    related: [
      { id: "find", why: "From a region to a list ranked for your own garden." },
      { id: "invasives", why: "Each region’s five worst invasive plants, and how to remove them." },
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
    match: { segments: ["regions", "browse", "reading"] },
    published: true,
  },

  {
    id: "invasives",
    label: "Invasives",
    aliases: ["invasive", "worst invasives"],
    emoji: "🚩",
    title: "The worst invasives",
    tagline: "The few plants doing the most harm where you live, and how to remove them.",
    lede:
      "A few garden plants escape and do real damage: they smother woods, shade " +
      "out wildflowers and seed into wild places. Each region lists its worst " +
      "five, ranked by local experts' rating, then by how often each is seen " +
      "growing wild. Every plant on a list has a page: how to recognize it, and " +
      "how to remove it for good by hand.",
    steps: [
      "Open your region's list from its page, or from Worst invasives.",
      "Tap a plant for the three surest ways to recognize it.",
      "Follow the removal steps: the root piece that resprouts, the stump that suckers.",
      "Plant a native in the gap, so the bare ground doesn't invite the next seedling.",
    ],
    parts: [
      {
        id: "degrees",
        heading: "How bad is it here?",
        body:
          "Where the people who survey a region have rated a plant, the page shows " +
          "their rating in three steps:",
        list: [
          "**Takes over**: it changes the place itself; the natives go.",
          "**Gaining ground**: doing real damage, but not remaking the place.",
          "**In patches**: loose in the wild, and so far staying local.",
        ],
      },
      {
        id: "yours",
        heading: "Found one in your garden?",
        body:
          "If you’ve linked iNaturalist, importing your photos into a saved spot " +
          "can add the invasives others have confirmed there to a list on that " +
          `spot’s page. See [Linking iNaturalist](${guide("inaturalist")}).`,
      },
    ],
    note:
      `“Invasive” is about what a plant does, not where it's from: most plants ` +
      `moved to a new place never spread. [Why we say it that way](${APP}/native).`,
    visit: [
      { label: "See the worst invasives", href: `${APP}/invasives` },
      { label: "Before you pull a plant", href: `${APP}/removing` },
      { label: "What to grow instead", href: `${APP}/alternatives` },
    ],
    related: [
      { id: "alternatives", why: "Fill the gap with a native that does the same job." },
      { id: "lookalikes", why: "Make sure it is the invasive before you pull it." },
    ],
    learn: [
      {
        label: "Why invasive plants are a problem",
        source: "National Invasive Species Information Center",
        href: "https://www.invasivespeciesinfo.gov/subject/plants",
      },
      {
        label: "Report an invasive plant you've found",
        source: "EDDMapS (University of Georgia)",
        href: "https://www.eddmaps.org/",
      },
    ],
    match: { segments: ["invasives", "removing"] },
    published: true,
  },

  {
    id: "lookalikes",
    label: "Look-alikes",
    aliases: ["lookalikes", "look-alike"],
    emoji: "👀",
    title: "Telling look-alikes apart",
    tagline: "The native, and the impostor next to it.",
    lede:
      "You look a plant up because you're not sure what you're holding, and " +
      "often the plant on the nursery bench isn't quite the one on the label. " +
      "A garden center sells the invasive Callery pear beside the native " +
      "serviceberry. So for many natives we recommend, Indigene names the " +
      "plants it gets mistaken for, and how to tell them apart standing in " +
      "front of it: a smell, a thorn, a leaf stalk that bleeds white, not a " +
      "botanical key you'd need a magnifying lens for.",
    parts: [
      {
        id: "labels",
        heading: "Not every look-alike is a problem",
        body: "Each one is labelled:",
        list: [
          `**Invasive here**: one to [remove](${guide("invasives")}).`,
          "**Not from here**: harmless, but not the native you wanted.",
          "**Native here too**: a wild native, where the mix-up still matters.",
        ],
        after:
          "When you’re truly unsure, photograph it and post it to iNaturalist, where " +
          "real people will help name what you’ve found.",
      },
    ],
    visit: [
      { label: "See the look-alikes", href: `${APP}/lookalikes` },
      { label: "The worst invasives", href: `${APP}/invasives` },
    ],
    related: [
      { id: "invasives", why: "If it is the invasive, how to remove it for good." },
      { id: "plants", why: "A plant’s page lists its look-alikes under “Don’t confuse it with”." },
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
      "The usual answer at a nursery is a plant from somewhere else. Native " +
      "swaps start from the job you want done (a lawn, a hedge, a shade tree, " +
      "a plant “for butterflies”) and name the native that does it at least as " +
      "well, and usually better for wildlife and water.",
    parts: [
      {
        id: "compare",
        heading: "Side by side",
        body:
          "Each swap compares the two on what actually decides it: **water** (will " +
          "it want the hose all summer?), **disease**, **wildlife** and **upkeep**. " +
          "Where the native only ties, we say so. Where it wins (little bluestem " +
          "against a Bermuda-grass lawn, milkweed against the butterfly bush a " +
          "monarch can’t raise its young on), the page shows why.",
        after: "It's a better choice, freely made, not a scold.",
      },
    ],
    visit: [
      { label: "See the native swaps", href: `${APP}/alternatives` },
      { label: "Browse the plants", href: `${APP}/plants` },
    ],
    related: [
      { id: "invasives", why: "Some ornamentals escape. Here are the worst, and how to clear them." },
      { id: "ranking", why: "Have a job in mind? Rank your list for it: rain, erosion, birds." },
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
    id: "crops",
    label: "Vegetables",
    aliases: ["crops", "vegetable patch", "the vegetable patch", "kitchen garden"],
    emoji: "🥕",
    title: "Will native plants bring pests?",
    tagline: "Planting for wildlife, without losing the harvest.",
    lede:
      "Won’t all those bees and birds eat the fruit and vegetables? It’s the " +
      "commonest reason somebody likes the idea of native planting and doesn’t " +
      "do it. It is also one of the few garden arguments that has actually been " +
      "measured. Farms sowed wildflower strips along commercial fields, then " +
      "weighed the crop: more pollinators, more of the insects that eat pests, " +
      "and no more pests. Some natives go further and take a pest away, because " +
      "the worst ones lean on a plant that isn’t from here either: the " +
      `spotted lanternfly on [tree-of-heaven](${APP}/invasives/ailanthus-altissima), the soybean aphid wintering on ` +
      "buckthorn. The page carries the study behind every figure, and the ones " +
      "that argue the other way as well.",
    note:
      "A bee has no mouthparts for a fruit, and a caterpillar raised on oak " +
      "would starve on lettuce. The animals that eat vegetables are a different " +
      "crowd from the ones a flower border feeds.",
    visit: [
      { label: "Will native plants bring pests?", href: `${APP}/crops` },
      { label: "Meet the wildlife", href: `${APP}/wildlife` },
    ],
    related: [
      { id: "wildlife", why: "The insects and birds natives feed, and which plants they need." },
    ],
    learn: [
      {
        label: "What pollinators are and what they do for food crops",
        source: "U.S. Forest Service",
        href: "https://www.fs.usda.gov/wildflowers/pollinators/index.shtml",
      },
      {
        label: "Beneficial insects on a farm or in a garden, in depth",
        source: "The Xerces Society",
        href: "https://www.xerces.org/",
      },
      {
        label: "Keeping birds off fruit without harming them",
        source: "Oregon State University Extension",
        href: "https://extension.oregonstate.edu/catalog/em-9286-nonlethal-bird-deterrent-strategies",
      },
    ],
    match: { segments: ["crops"] },
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
      "Some plants and animals here carry a conservation rank: an expert's read " +
      "on how close it is to disappearing. A rank belongs to a place: a plant " +
      "can be everywhere in one state and nearly gone in the next, so Indigene " +
      "shows one only where it means something to you: worldwide, or in your " +
      "own region's state. The code is worth a glance: a letter for the scale " +
      "(G is the whole world, S a single state) and a number from 1 (most at " +
      "risk) to 5 (secure); the IUCN uses words like Endangered instead. A span " +
      "such as G3G4 means the assessor placed it between the two.",
    note:
      "Most of what you'll plant is doing fine. The note shows only on the few " +
      "pages where it isn't. Where it does: buy from a nursery, never dig one " +
      "from the wild; for an animal, planting what it needs is the help it can use.",
    // No page of its own in the app: a rank shows on the plant or animal it's
    // about, so the name links to the explanation instead.
    home: `${APP}/guide/conservation/`,
    visit: [{ label: "Browse the plants", href: `${APP}/plants` }],
    related: [
      { id: "plants", why: "Where a rank shows, near the top of a plant’s page." },
      { id: "wildlife", why: "For a rare animal, planting what it eats is the help it can use." },
    ],
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

  {
    id: "backup",
    label: "Backups",
    aliases: ["backup", "spots file", "export", "import", "restore"],
    emoji: "💾",
    title: "Keeping your spots safe",
    tagline: "Your spots live on your device, not with us. Keep a copy.",
    lede:
      "Indigene has no accounts and no server. Your saved spots, plantings, " +
      "linked sightings and settings live in one place: the browser you saved " +
      "them in. Nobody else can see them, so nobody else can bring them back " +
      "if that browser forgets them.",
    steps: [
      "In Settings, tap “Save a copy”. You get one small file holding all of it.",
      "Keep that file somewhere besides this phone: your email, a cloud drive, a computer.",
      "On a new phone, in another browser, or after clearing your data, tap “Bring a copy in” and pick the file. Everything comes back.",
      "Already have spots there? Nothing is overwritten. If a spot looks like one you have, you choose: combine them, or keep both.",
    ],
    note:
      "A browser forgets when you clear its data. On iPhone and iPad, Safari " +
      "also clears a site you haven’t opened in about a week of using Safari. " +
      "Added to your Home Screen, Indigene doesn’t have that limit, but it " +
      "starts empty there, so bring your copy in once.",
    visit: [
      { label: "Save or bring in a copy", href: `${APP}/#/settings/spots` },
      { label: "Privacy & safety", href: `${APP}/privacy` },
    ],
    related: [
      { id: "spots", why: "What a saved spot holds, and why it’s worth keeping." },
      { id: "privacy", why: "Why your spots stay on your device in the first place." },
    ],
    learn: [
      {
        label: "How Safari stores and clears website data",
        source: "WebKit, the team behind Safari",
        href: "https://webkit.org/blog/14403/updates-to-storage-policy/",
      },
    ],
    match: { segments: [] },
    published: true,
  },

  {
    id: "privacy",
    label: "Privacy",
    aliases: [],
    emoji: "🔒",
    title: "Your privacy",
    tagline: "No account, no server, and your location only when you tap.",
    lede:
      "Indigene has no accounts and no server of its own. What you save stays " +
      "in your browser. To answer your questions, your device asks a few public " +
      "services directly, and only the ones on a fixed list.",
    parts: [
      {
        id: "location",
        heading: "Your location",
        list: [
          "It’s used only when you tap for it, never in the background.",
          "You never have to share it: a town, a postal code or picking your region works everywhere.",
          "When you do, it goes straight from your device to public weather, soil and map services to look up your spot.",
        ],
      },
      {
        id: "stays",
        heading: "What stays on your device",
        body:
          "Your saved spots, plant logs, settings and iNaturalist username. That " +
          `also means only you can keep a copy. See [Keeping your spots safe](${guide("backup")}).`,
      },
      {
        id: "counting",
        heading: "Counting visits",
        body:
          "Indigene counts page visits, with no cookies and no profile of " +
          "you. You can turn it off in **Settings**, and it’s off " +
          "already if your browser asks sites not to track you.",
      },
    ],
    note:
      "Built for everyone, children included: no ads, no profile of you, and " +
      "nothing to sign up for.",
    visit: [
      { label: "Privacy & safety, in full", href: `${APP}/privacy` },
      { label: "Settings", href: `${APP}/#/settings` },
    ],
    related: [
      { id: "inaturalist", why: "What iNaturalist is told, and when." },
      { id: "backup", why: "Your data lives with you, so keep a copy." },
    ],
    learn: [],
    match: { segments: ["privacy"] },
    published: true,
  },

  {
    id: "sources",
    label: "Sources",
    aliases: ["data", "citations", "confidence"],
    emoji: "📚",
    title: "Where the numbers come from",
    tagline: "Public science, cited, with our confidence shown.",
    lede:
      "Every figure in Indigene comes from somewhere you can check: a herbarium " +
      "record, a published study, a national plant list. Where we had to " +
      "estimate, the page says so.",
    parts: [
      {
        id: "confidence",
        heading: "The Confidence meter",
        body:
          `Each plant’s page carries a meter of one to three bars, for [how sure we are](${APP}/confidence) ` +
          "of its figures. It rests mostly on how many kinds of caterpillar " +
          "the plant feeds, because that number drives the wildlife ranking:",
        list: [
          "**High**: counted from a dataset for its region, with a cited source for where it grows wild.",
          "**Medium**: a published figure for its genus (its closest group of related plants), or our estimate from a relative.",
          "**Low**: rough, or with nothing cited for where it grows wild.",
        ],
        after:
          "It rates our figures, not the plant. A plant rated low can be just as " +
          "good a choice.",
      },
      {
        id: "kew",
        heading: "Checked against Kew",
        body:
          "Kew’s World Checklist, kept by the Royal Botanic Gardens in London, " +
          "records where every plant grows wild. Each plant’s page says whether it " +
          "agrees the plant is native where you are, and when we checked: a green " +
          "check when it agrees, a caution mark when it doesn’t. Disagreement isn’t " +
          "a mistake on its own: Kew records whole states and provinces, and a " +
          `regional flora can know better. [What “native” means here](${APP}/native).`,
      },
    ],
    visit: [
      { label: "Where our numbers come from", href: `${APP}/sources` },
      { label: "How sure we are", href: `${APP}/confidence` },
    ],
    related: [
      { id: "plants", why: "Where the meter and the Kew check appear." },
      { id: "ranking", why: "How those figures turn into your ranked list." },
    ],
    learn: [
      {
        label: "World Checklist of Vascular Plants",
        source: "Royal Botanic Gardens, Kew",
        href: "https://powo.science.kew.org/",
      },
    ],
    match: { segments: ["sources", "confidence"] },
    published: true,
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

// The entry's leading prose prefix: the words before its first colon, as long
// as they're a plain label and not the start of a sentence with a link or
// emphasis in it. Kept short and bracket-free so a mid-sentence colon can never
// be read as a prefix. Tolerates a bold wrapper so `**Regions:**` works too.
export const PREFIX = /^(?:\*\*)?\s*([A-Za-z][A-Za-z ,&/-]{0,46}?)\s*:(?:\*\*)?\s+/;

/** Where a section's name links: its `home`, else its first way in. */
export const sectionHome = (s) => s.home ?? s.visit?.[0]?.href;

/**
 * Link an entry's section prefix to that part of the app — `Regions:` becomes
 * `[Regions](…/regions):` — so a reader who didn't know the part existed can
 * go there. Only for an entry that links nowhere else: one link per entry is
 * plenty, and the entry's own link is always the more specific one. A
 * multi-section prefix links each name (`Plants & Wildlife:`).
 */
export function linkPrefix(md) {
  if (/\]\(/.test(md)) return md;
  const m = md.match(PREFIX);
  if (!m || !matchLabels(m[1])) return md;
  const linked = m[1]
    .split(/(\s*[,&]\s*|\s+and\s+)/i)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      const href = sectionHome(SECTION_BY_ID.get(LABEL_TO_ID.get(normalize(part))));
      return href ? `[${part}](${href})` : part;
    })
    .join("");
  const at = m[0].indexOf(m[1]);
  return md.slice(0, at) + linked + md.slice(at + m[1].length);
}

/** The canonical prefix labels, for humans writing entries and for docs. */
export const SECTION_LABELS = SECTIONS.map((s) => s.label);

/**
 * Everything wrong with the catalog as a reader would meet it, as sentences:
 * a published guide with no lede, a "Goes well with" pointing at a guide that
 * doesn't exist (or isn't published, or is itself), and a link in a guide's
 * words to a guide page nobody can open. Empty means the guides mesh.
 */
export function guideProblems(sections = SECTIONS) {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const live = (id) => byId.get(id)?.published === true;
  const problems = [];
  for (const s of sections.filter((x) => x.published)) {
    if (!s.lede?.trim()) {
      problems.push(`section "${s.id}" is published but has no lede — write it or set published:false`);
    }
    for (const r of s.related ?? []) {
      if (r.id === s.id) problems.push(`section "${s.id}" lists itself under "Goes well with"`);
      else if (!live(r.id)) problems.push(`section "${s.id}" relates to "${r.id}", which isn't a published guide`);
      if (!r.why?.trim()) problems.push(`section "${s.id}" relates to "${r.id}" without saying why`);
    }
    for (const part of s.parts ?? []) {
      if (!part.heading?.trim()) problems.push(`section "${s.id}" has a part with no heading`);
    }
    const words = JSON.stringify([s.lede, s.steps, s.note, s.parts]);
    for (const m of words.matchAll(/indigene\.app\/guide\/([a-z0-9-]+)/g)) {
      if (!live(m[1])) problems.push(`section "${s.id}" links to /guide/${m[1]}/, which isn't a published guide`);
    }
  }
  return problems;
}
