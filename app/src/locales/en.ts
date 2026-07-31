// English — the key set.
//
// This file defines every user-facing string in the app *and* the shape every
// other locale has to match: `Dict` is derived from it, so `fr.ts` cannot
// compile with a key missing, misspelt, or invented. There is no runtime
// "translation not found" state to discover on someone's phone.
//
// Conventions, so a translator knows what they're allowed to move:
//
//  - `{name}` is a value substituted at render time. Keep every placeholder a
//    string names, but move them wherever your language wants them.
//  - A key ending `.one` / `.other` is a plural pair, chosen by `tn()`.
//  - A string containing `{link}`, `{button}` etc. is rendered by `tx()` and
//    the placeholder is a real DOM node — so the sentence can wrap around it
//    however the language reads best.
//  - Units never appear baked into a sentence. "3 ft" comes from `units.ts`,
//    which the reader can switch independently of the language (see the note
//    at the top of `lib/units.ts`).
export const en = {
  // ---------------------------------------------------------------------
  // Unit words. The *system* is the reader's own setting; these are just the
  // words each unit is called in this language.
  // ---------------------------------------------------------------------
  "units.ft": "ft",
  "units.inches": "inches",
  "units.m": "m",
  "units.cm": "cm",
  "units.mm": "mm",

  // ---------------------------------------------------------------------
  // App chrome: the header, nav, footer and the progress rail.
  // ---------------------------------------------------------------------
  "app.title": "Indigene — native plants for exactly where you stand",
  "app.name": "Indigene",
  "app.skipToContent": "Skip to main content",
  "app.offline": "Offline — using saved data",
  "nav.sections": "Sections",
  "nav.regions": "Regions",
  "nav.plants": "Plants",
  "nav.wildlife": "Wildlife",
  "nav.menu": "Menu",
  "nav.savedLocations": "Saved locations",
  "nav.settings": "Settings",
  "nav.languageAndUnits": "Language & units",
  "footer.text":
    "Open-source (MIT), built on public scientific data — {sources}, and how sure we are of each one. {about}. {releaseNotes}. {privacy}.",
  "footer.about": "About",
  "footer.sources": "where our numbers come from",
  "footer.releaseNotes": "See what's new",
  "footer.privacy": "Privacy & safety",
  // The footer's two settings links. The whole phrase is one dictionary entry
  // rather than a label the code glues a colon onto, because the punctuation
  // around a colon is a language's own business — French wants a space before
  // it, English doesn't, and a `${label}: ${value}` in the code would quietly
  // impose English on every language we ever add.
  "footer.languageIs": "Language: {value}",
  "footer.unitsIs": "Units: {value}",
  "steps.progress": "Progress",
  "steps.start": "Start",
  "steps.spot": "Spot",
  "steps.sun": "Sun",
  "steps.soil": "Soil",
  "steps.plants": "Plants",
  "steps.saved": "Saved",
  "steps.browse": "Browse",
  "steps.explore": "Explore",
  "steps.wildlife": "Wildlife",
  "steps.privacy": "Privacy",
  "steps.sources": "Sources",
  "steps.about": "About",
  "steps.settings": "Settings",

  // ---------------------------------------------------------------------
  // Settings: language and units, deliberately two separate choices.
  // ---------------------------------------------------------------------
  "settings.title": "Settings",
  "settings.lede": "Two separate choices — pick the language you read in and the units you measure in, in any combination.",
  "settings.language": "Language",
  "settings.languageHelp": "Changes every word in the app. Plant and animal names switch too, where a national list gives us the name in your language.",
  "settings.units": "Units",
  "settings.unitsHelp": "Heights, rainfall and winter cold. Independent of the language — read in French and measure in feet if that's what your nursery uses.",
  "settings.units.auto": "Match my device",
  "settings.units.metric": "Metric",
  "settings.units.imperial": "Imperial",
  "settings.units.autoSub": "Whatever your phone's region uses — {resolved} right now.",
  "settings.units.metricSub": "Metres, centimetres, millimetres of rain, °C.",
  "settings.units.imperialSub": "Feet, inches, inches of rain, °F.",
  "settings.namesNote": "Plant and animal names come from each country's own national list, not from machine translation — {link}.",
  "settings.namesNoteLink": "see where each name comes from",
  "settings.done": "Done",

  // ---------------------------------------------------------------------
  // Welcome.
  // ---------------------------------------------------------------------
  "welcome.title": "Bring back birds & butterflies, here & now.",
  "welcome.lede1":
    "Most yards are green but lifeless: lawns, shrubs, and flowers that local wildlife can't survive on yet require constant watering, pesticides, and fertilizers.",
  "welcome.lede2":
    "Native plants evolved to feed and nurture birds, bees, and butterflies. Indigene helps you bring back the ecosystem they desperately need to survive & thrive.",
  "welcome.noAccount": "No account, no tracking. ",
  "welcome.noAccountRest": "Everything stays in your browser and works offline.",
  "welcome.start": "Start where you're standing",
  "welcome.ratherNot": "Rather not use your location? {link} instead.",
  "welcome.ratherNotLink": "Browse regions & native plants",
  "welcome.whyTitle": "Why native plants?",
  "welcome.why1":
    "Most caterpillars can only eat the plants they evolved with, and nearly every backyard bird raises its chicks on caterpillars. No natives, no caterpillars, no baby birds.",
  "welcome.why2": "Plant a native, and the food web is back in business that same season.",
  "welcome.savedTitle": "Your saved spots",
  "welcome.openSaved.one": "Open saved spot ({n})",
  "welcome.openSaved.other": "Open saved spots ({n})",

  // ---------------------------------------------------------------------
  // The header's Saved menu.
  // ---------------------------------------------------------------------
  "savedMenu.loading": "Loading…",
  "savedMenu.error": "Couldn't open saved spots. Closing other Indigene tabs may help.",
  "savedMenu.retry": "Try again",
  "savedMenu.empty": "No saved spots yet.",
  "savedMenu.findSpot": "📍 Find a spot to save",
  "savedMenu.seeAll": "See all {n} saved →",
  "savedMenu.manage": "Manage saved →",

  // ---------------------------------------------------------------------
  // Browse (the no-location entrance).
  // ---------------------------------------------------------------------
  "browse.title": "Browse regions & native plants",
  "browse.lede": "No location needed — start from a region or a standout plant instead.",
  "browse.regionsTitle.one": "Right now this covers one region",
  "browse.regionsTitle.other": "Regions covered so far",
  "browse.regionsLede": "Plant recommendations are tuned region by region — pick the one that matches where you'll plant:",
  "browse.outside": "Outside these areas, sun and soil readings still work — just no plant list yet. Want yours next? {link}.",
  "browse.outsideLink": "Suggest your area on GitHub",
  "browse.plantTitle": "Or start from a plant",
  "browse.plantLede": "Meet one standout native from each region, then see if it would thrive in your spot:",
  "browse.exploreBtn": "🌿 Explore the natives",
  "browse.home": "Home",
  "browse.startFromSpot": "Start from a spot instead",

  // ---------------------------------------------------------------------
  // Saved spots.
  // ---------------------------------------------------------------------
  "saved.title": "Your saved spots",
  "saved.empty": "Nothing saved yet. Find a spot and tap “Save this spot” to keep it here on your phone.",
  "saved.find": "Find a spot",
  "saved.sunUnknown": "Sun not recorded",
  "saved.open": "Open",
  "saved.deleteLabel": "Delete {label}",
  "saved.confirmDelete": "Delete “{label}”? This can't be undone.",
  "saved.deleted": "Deleted.",
  "saved.privacy": "These spots live on this device only — they never leave it, and we can't see them",
  "saved.findAnother": "Find another spot",

  // ---------------------------------------------------------------------
  // Explore (region cards).
  // ---------------------------------------------------------------------
  "explore.title": "Meet the natives",
  "explore.lede":
    "{plants} native plants across the {regions} regions Indigene covers so far. Open the one you live in to see its whole roster — or tap the plant on the front of a card to meet it.",
  "explore.byWildlife": "Or browse by wildlife → ",
  "explore.byWildlifeSub":
    "start from the monarch, hummingbird, or gopher tortoise you want, and find the plants that support it.",
  "explore.starring": "Starring",
  "explore.keystoneTitle": "Keystone plant — supports far more wildlife than most",
  "explore.keystoneLabel": "Keystone plant",
  "explore.caterpillarSpecies": "{n} caterpillar species",
  "explore.statPlants": "{n} native plants on Indigene's list for {region}",
  "explore.statKeystone.one": "{n} keystone plant — the ones local food webs lean on hardest",
  "explore.statKeystone.other": "{n} keystone plants — the ones local food webs lean on hardest",
  "explore.statWildlife": "{n} kinds of wildlife with a documented tie to these plants",

  // ---------------------------------------------------------------------
  // Location (step 1).
  // ---------------------------------------------------------------------
  "location.title": "Where are you standing?",
  "location.lede":
    "Get your location, then check the map — if the pin isn't where you're really standing, drag or tap to nudge it.",
  "location.whyTitle": "Why does the exact spot matter?",
  "location.why":
    "“Native” always means native to somewhere. Your coordinates pick which regional plant list applies and pull the soil, climate, and ecoregion records for this exact place — the same species can be a keystone in one region and a stranger in the next.",
  "location.use": "📍 Use my location",
  "location.update": "📍 Update my location",
  "location.locating": "Locating…",
  "location.none": "No location yet.",
  "location.privacy":
    "Your location is used only to find what grows here, only when you tap, and never leaves your device except as anonymous lookups",
  "location.mapLabel":
    "Map. The pin stays in the centre. Drag or tap to move the spot under it, or use the arrow keys to nudge it — hold Shift for bigger steps.",
  "location.osmAttribution": "© OpenStreetMap contributors",
  "location.gpsFix": "GPS fix",
  "location.accuracy": " · GPS accuracy ±{m} m",
  "location.nudged": " · nudged {m} m",
  "location.noGeolocation": "This device can't share location — try the town search instead.",
  "location.denied": "Location denied — try the town search instead.",
  "location.noFix": "Couldn't get a fix — try again, or switch to the town search.",
  "location.searchTitle": "No GPS? Search by town",
  "location.searchLabel": "Your town, city, or postal code",
  "location.searchPlaceholder": "e.g. State College, or 16801",
  "location.search": "Search",
  "location.searching": "Searching…",
  "location.searchNoResults":
    "Couldn't find that name. Try the town and region together — like “Springfield Pennsylvania” — or the postal code on your mail.",
  "location.searchOffline":
    "The place search needs a signal and we couldn't reach it. If GPS works, switch back to your location — or pick your region by hand instead.",
  "location.pinSet": "Pin set to the middle of {place}. ",
  "location.pinSetRest":
    "That's enough to pick your region, climate, and plant list — and the sun estimate comes from you in the next step, not from the map. Only the soil and slope lookups care about the exact spot, so if you're far from the middle of town, drag the pin roughly onto your yard.",
  "location.pinSetUncovered": "Pin set to the middle of {place} — but we don't have a plant list for this area yet.",
  "location.noListHere": "We don't have a plant list for this area yet.",
  "location.coverage":
    "Indigene's plant lists are tuned region by region, and this spot is outside all of them — so we'd have nothing honest to recommend here. The sun and soil readings still work. Meanwhile you can:",
  "location.coverageBrowse": "Browse the covered regions' native plants",
  "location.coverageBrowseRest": " to see the kind of recommendations Indigene gives.",
  "location.coverageAsk": "Ask for your area on GitHub",
  "location.coverageAskRest":
    " — open an issue with your postal code or town. Or add the region yourself: it's one plant-data file plus two registry lines.",
  "location.regionTitle": "🗺️ Pick your region",
  "location.regionLede":
    "If you already know which of our regions — or which ecoregion — you're in, you can skip the map. Fair warning: without a map point we can't look up your soil, rainfall, or winter cold, so you'll answer the sun and moisture questions yourself and the plant list leans on what you tell us.",
  "location.regionShowAll": "Not this one? Show all regions",
  "location.switchFromGps": "Don't want to use your location? {a} or {b} instead.",
  "location.switchFromOther": "Changed your mind? {a} or {b} instead.",
  "location.switchZip": "Search by town",
  "location.switchGps": "Use GPS location",
  "location.switchRegion": "pick a region",
  "location.pickFirst": "Pick a region first.",
  "location.usingList": "Using the {region} list — your pick.",
  "location.back": "Back",
  "location.next": "Next: measure the sun →",

  // ---------------------------------------------------------------------
  // Sun (step 2).
  // ---------------------------------------------------------------------
  "sun.title": "How much sun does this spot get?",
  "sun.ledeWithScan": "Pick the closest match — the sky scan below can sharpen it.",
  "sun.lede": "Pick the closest match.",
  "sun.whyTitle": "Why do we ask about sun first?",
  "sun.why":
    "Hours of direct sun decide more about what will thrive than anything else you can measure. And shade isn't a flaw — there's a native for every light level, from prairie flowers to forest-floor ferns. The light just decides which ones.",
  "sun.full": "Sunny most of the day",
  "sun.fullSub": "Direct sun for 6+ hours — open lawn, south side, no big trees close by.",
  "sun.half": "Sun for about half the day",
  "sun.halfSub": "A few hours of direct sun, shade the rest — near a building or scattered trees.",
  "sun.shade": "Mostly shady",
  "sun.shadeSub": "Little direct sun — under trees, north side, or hemmed in by walls.",
  "sun.thisSpotGets": "This spot gets ",
  "sun.bestGuess": "Best guess {hours} hours, likely somewhere between {low} and {high}.",
  "sun.fromScan": "Measured from your sky scan.",
  "sun.fromPickWithScan": "From your quick pick — scan the sky below for a sharper estimate.",
  "sun.fromPick": "From your quick pick.",
  "sun.next": "Next: check the soil & climate →",
  "sun.deciduous": "🍂 Trees overhead that go bare in winter?",
  "sun.deciduousSub": "Bare branches make spring and fall much sunnier — we'll account for it.",
  "sun.scanTitle": "📷 Scan the sky for a sharper estimate",
  "sun.scanLede":
    "Point your phone at the skyline and slowly turn all the way around. We'll trace how high the trees and rooftops rise and calculate the real sun hours for this exact spot. Needs camera and motion access — you can skip it entirely.",
  "sun.scanStart": "Start sky scan",
  "sun.back": "Back",

  // ---------------------------------------------------------------------
  // Sky scan (step 2b).
  // ---------------------------------------------------------------------
  "scan.title": "Scan your sky",
  "scan.lede":
    "Hold your phone up and aim the crosshair at the top of the trees, roofs, or fences around you. Slowly spin a full circle, keeping the crosshair on the skyline. We'll work out how much sun this spot really gets.",
  "scan.permissionNote": "Needs camera and motion access. It all stays on your phone — no video is saved or sent anywhere.",
  "scan.enable": "Enable camera & motion",
  "scan.skip": "Skip — I'll use the quick pick",
  "scan.hud": "Point at the skyline and turn slowly…",
  "scan.turnFirst": "Turn all the way around first…",
  "scan.keepTurning": "Keep turning… {pct}%",
  "scan.use": "Use this scan →",
  "scan.cancel": "Cancel scan",
  "scan.reading": "Facing {dir} ({deg}°) · skyline {up}° up · {pct}% of the circle scanned",
  "scan.compassWarn":
    "Heads up: this phone's compass is derived from motion sensors and can drift. If the sun estimate looks wrong, use the quick pick instead.",
  "scan.updated": "Sun estimate updated from your scan.",
  "scan.noCameraTitle": "Camera isn't available",
  "scan.noCamera":
    "We couldn't open the camera — it may be blocked, or this browser doesn't allow it. That's completely fine; the quick pick works just as well for most spots.",
  "scan.noMotionTitle": "Motion sensors aren't available",
  "scan.noMotion":
    "Your camera works, but this phone won't share its compass/motion, so we can't measure sun angles reliably. Rather than guess, use the quick pick — you know this spot better than a shaky sensor does.",
  "scan.useQuickPick": "Use the quick sun pick instead",
  "compass.N": "N",
  "compass.NE": "NE",
  "compass.E": "E",
  "compass.SE": "SE",
  "compass.S": "S",
  "compass.SW": "SW",
  "compass.W": "W",
  "compass.NW": "NW",

  // ---------------------------------------------------------------------
  // Confirm (step 3).
  // ---------------------------------------------------------------------
  "confirm.title": "Here's what we think about this spot",
  "confirm.loading": " Looking up soil, elevation, and climate…",
  "confirm.sun": "Sun: ",
  "confirm.sunRange": "(roughly {low}–{high} hours; {source}).",
  "confirm.sunFromScan": "measured by scan",
  "confirm.sunFromPick": "your quick pick",
  "confirm.changeSun": "Change the sun estimate",
  "confirm.noSiteOnline":
    "We couldn't reach the soil/climate services (no signal, or they're down). You can still get recommendations — just set the moisture below from what you can see, and we'll skip the parts we couldn't look up.",
  "confirm.noSiteManual":
    "You picked your region yourself, so there's no map point to look up soil, rainfall, or winter cold from. That's fine — set the moisture below from what you can see, and the ranking will lean on your sun and moisture answers.",
  "confirm.climateTitle": "Climate & land",
  "confirm.winterCold": "Winter cold",
  "confirm.zoneMapLink": "See the USDA zone map →",
  "confirm.rainfall": "Rainfall",
  "confirm.rainfallValue": "About {amount} of rain a year.",
  "confirm.elevation": "Elevation & slope",
  "confirm.elevationValue": "{height} up{slope}.",
  "confirm.elevationSlope": ", on {slope}",
  "confirm.region": "Region",
  "confirm.localArea": "Local area",
  "confirm.localAreaValue": "{name} (finer EPA Level IV).",
  "confirm.soilTitle": "Soil (from the map — worth checking)",
  "confirm.soilSays": "The soil map says",
  "confirm.soilNone": "We don't have a soil reading here — the 60-second check below tells you what you've got.",
  "confirm.acidity": "Acidity",
  "confirm.soilCoarse": "The soil map is coarse. ",
  "confirm.soilCoarseRest":
    "It can cover several acres and won't know that the strip by your driveway is packed clay fill. Do the 60-second check below and trust what you find over the map.",
  "confirm.moistureTitle": "How wet does this spot stay?",
  "confirm.moistureLede": "This is the single most useful thing you can correct. Pick what matches after a heavy rain.",
  "confirm.moistureWhyTitle": "Why not just improve the soil?",
  "confirm.moistureWhy":
    "Natives are already adapted to the soil you have — dry sand, heavy clay, soggy hollows all have their specialists. The trick is picking a plant to fit the soil, not hauling in amendments to fit the plant. Answer honestly and the right ones rise to the top.",
  "confirm.dry": "Dry",
  "confirm.mesic": "Evenly moist",
  "confirm.wet": "Wet",
  "confirm.deciduous": "Trees overhead that drop their leaves in winter (makes the spot sunnier in spring/fall).",
  "confirm.back": "Back",
  "confirm.next": "See my plants →",
  "confirm.kvLabel": "{k}: ",
  "confirm.ribbonTitle": "🤲 The 60-second soil check",
  "confirm.ribbon1": "Grab a small handful of soil and dampen it so it's moist but not dripping.",
  "confirm.ribbon2":
    "Squeeze and knead it into a ball. If it won't hold together at all and feels gritty, it's sandy → choose Dry above.",
  "confirm.ribbon3": "Press it out between your thumb and finger into a flat ribbon.",
  "confirm.ribbon4":
    "A short ribbon that breaks quickly and feels smooth = loam/silt → Evenly moist. A long, bendy, sticky ribbon = clay → often stays Wet.",
  "confirm.ribbonNote": "Whatever you find in your hand beats the map. Set the moisture below to match it.",

  // ---------------------------------------------------------------------
  // Plain-language vocabulary (lib/plain.ts). The thresholds stay in code;
  // only the words live here.
  // ---------------------------------------------------------------------
  "moisture.word.dry": "dry",
  "moisture.word.mesic": "evenly moist",
  "moisture.word.wet": "wet",
  "sun.label.full": "full sun",
  "sun.label.partSun": "part sun",
  "sun.label.partShade": "part shade",
  "sun.label.fullShade": "full shade",
  "sun.gloss.full": "direct sun most of the day",
  "sun.gloss.partSun": "sun for a good chunk of the day, shade the rest",
  "sun.gloss.partShade": "a few hours of direct sun, shade the rest",
  "sun.gloss.fullShade": "little or no direct sun",
  "sun.plain.one": "about {n} hour of direct sun a day — that's {label} ({gloss})",
  "sun.plain.other": "about {n} hours of direct sun a day — that's {label} ({gloss})",
  "moisture.plain.dry": "dry — drains fast and stays on the dry side, like a sandy slope or a spot under a roof overhang",
  "moisture.plain.mesic":
    "evenly moist — damp after rain but never soggy; the middle-of-the-road condition most yards have",
  "moisture.plain.wet": "wet — stays damp, puddles after rain, or sits low where water collects",
  "zone.unknown": "We couldn't pin down how cold your winters get.",
  "zone.coldWithTemp": "Your coldest winter nights get down to about {temp}",
  "zone.coldNoTemp": "This is how cold your winters get",
  "zone.plain": "{cold} — plant tags call that “USDA zone {zone}”. A plant is “hardy” here if it survives that cold.",
  "ph.unknown": "Soil acidity unknown.",
  "ph.acidic": "pH {v} — acidic soil (think blueberries, pine woods)",
  "ph.neutral": "pH {v} — close to neutral, which most plants are happy with",
  "ph.alkaline": "pH {v} — alkaline/limey soil",
  "texture.unknown": "Soil texture unknown.",
  "texture.sand": "{t} — gritty, drains fast, dries out quickly",
  "texture.clay": "{t} — heavy and sticky when wet, holds water, can stay soggy",
  "texture.loam": "{t} — the “just right” mix of sand, silt, and clay that most plants love",
  "texture.silt": "{t} — smooth and floury when dry, holds moisture well",
  "slope.flat": "basically flat",
  "slope.gentle": "a gentle slope",
  "slope.noticeable": "a noticeable slope — erosion can be a concern here",
  "slope.steep": "a steep slope — holding the soil in place matters a lot here",

  "score.host.name": "Feeds baby butterflies & moths",
  "score.host.plain":
    "How many kinds of caterpillars can eat this plant. Caterpillars are the food that baby birds are raised on, so this is the single biggest measure of how much life a plant supports.",
  "score.pollinator.name": "Feeds bees & butterflies",
  "score.pollinator.plain": "Nectar and pollen for adult bees and butterflies, and how long it blooms.",
  "score.bird.name": "Feeds & shelters birds",
  "score.bird.plain": "Berries, seeds, and places to nest — plus the caterpillars it raises.",
  "score.stormwater.name": "Soaks up rain",
  "score.stormwater.plain": "Deep roots that let rainwater sink in instead of running off.",
  "score.erosion.name": "Holds soil in place",
  "score.erosion.plain": "Roots that grip a slope and stop it washing away.",
  "score.carbon.name": "Stores carbon",
  "score.carbon.plain":
    "Carbon pulled out of the air into wood and roots. Honestly small for one yard — included, but don't expect miracles.",
  "score.establishment.name": "Survives on its own",
  "score.establishment.plain": "How likely it is to make it with no watering or fuss after you plant it.",

  "wildlifeKind.butterfly.title": "Butterflies",
  "wildlifeKind.butterfly.blurb": "Choose a butterfly to see which natives raise its caterpillars or feed the adults.",
  "wildlifeKind.moth.title": "Moths",
  "wildlifeKind.moth.blurb":
    "The night shift — including the giant silk moths, whose caterpillars are prime baby-bird food.",
  "wildlifeKind.bee.title": "Bees & other pollinators",
  "wildlifeKind.bee.blurb": "Native bees, many of which can raise their young on only one family of flowers.",
  "wildlifeKind.bird.title": "Birds",
  "wildlifeKind.bird.blurb": "The berries, seeds, nectar, and caterpillars behind the birds you want in the yard.",
  "wildlifeKind.mammal.title": "Mammals & others",
  "wildlifeKind.mammal.blurb": "Acorns and fruit for the four-legged neighbors — and a reptile or two.",

  "support.host.term": "Host",
  "support.host.plain":
    "A host plant: caterpillars eat its leaves and grow up on it. This is the strongest kind of support — it's where the next generation of butterflies and moths comes from, and caterpillars are what nearly all baby songbirds are fed.",
  "support.nectar.term": "Nectar",
  "support.nectar.plain":
    "Nectar and pollen for the grown insects — food for the adults, not a nursery for their young.",
  "support.berries.term": "Berries",
  "support.berries.plain": "Berries or fruit that birds and mammals eat, especially through fall and winter.",
  "support.seeds.term": "Seeds",
  "support.seeds.plain":
    "Seeds or nuts that birds and mammals eat — often what's left standing after the flowers fade.",
  "support.shelter.term": "Shelter",
  "support.shelter.plain": "Cover and habitat to nest, graze, roost, or ride out the season in.",

  "reliance.sole.term": "Essential",
  "reliance.sole.plain":
    "This plant is the animal's only option — an obligate tie with no substitute. Lose it here and you lose the animal. These are the make-or-break relationships (a monarch needs milkweed; an atala needs coontie).",
  "reliance.narrow.term": "Specialist",
  "reliance.narrow.plain":
    "A specialist relationship: the animal can use only a small group of plants, and this is one of them. Important, with just a few alternatives.",
  "reliance.broad.term": "One of many",
  "reliance.broad.plain":
    "Valuable, but the animal uses many plants — helpful without being make-or-break on its own. Tags like this are left off, so an unmarked plant means the animal has other options.",

  "prop.seed-direct.name": "Sow the seed as-is (direct sowing)",
  "prop.seed-direct.plain":
    "The easy case: clean the seed, then sow it about as deep as it is wide in a pot or a cleared patch of ground and keep it damp. No tricks needed.",
  "prop.seed-cold-moist.name": "Give the seed a cold, damp winter first (cold-moist stratification)",
  "prop.seed-cold-moist.plain":
    "Many native seeds won't wake up until they've felt a real winter, so you fake one. Mix the seed with a handful of damp sand or a moist paper towel, seal it in a labeled zip bag, and leave it in the fridge for the number of weeks noted — then sow. Or skip the fridge entirely: sow it outdoors in a pot in fall and let actual winter do the job.",
  "prop.seed-double-dormant.name": "Expect a two-winter wait (double dormancy)",
  "prop.seed-double-dormant.plain":
    "The stubborn ones: the root comes out after one winter but the leaf shoot waits for a second. Sow in a pot outdoors, keep it in a shady, protected spot, don't give up when nothing shows the first spring, and stay patient — green usually appears in the second year.",
  "prop.seed-scarify.name": "Nick or scuff the hard seed coat first (scarification)",
  "prop.seed-scarify.plain":
    "Some seeds (beans and their relatives especially) are sealed in a waterproof shell that has to be breached before water can get in. Rub each seed a few strokes on fine sandpaper, or nick the coat with a knife, until you just see the paler inside — then soak overnight and sow. Careful scuffing, not crushing.",
  "prop.seed-surface-light.name": "Press tiny seed on the surface — it needs light (surface sowing)",
  "prop.seed-surface-light.plain":
    "Dust-fine seed that must see daylight to sprout, so don't bury it. Scatter it on top of damp soil, press it down so it makes contact, and don't cover it. Keep the surface from drying out by misting or covering with clear plastic until it germinates.",
  "prop.seed-warm.name": "Sow fresh and keep it warm (no chilling needed)",
  "prop.seed-warm.plain":
    "The warm-climate case: no winter chill required. Sow the fresh, cleaned seed and keep it warm and damp — it usually sprouts within a few weeks. Fresh matters; many of these lose the ability to sprout if the seed dries out and sits.",
  "prop.cuttings-softwood.name": "Root a soft green shoot (softwood cutting)",
  "prop.cuttings-softwood.plain":
    "In late spring or early summer, snip a hand-length piece of soft, bendy new growth, strip the lower leaves, and push the cut end into damp potting mix or perlite. Keep it humid and out of harsh sun (a clear bag or bottle over the pot helps) until roots form in a few weeks.",
  "prop.cuttings-semi-hardwood.name": "Root a firming-up shoot (semi-hardwood cutting)",
  "prop.cuttings-semi-hardwood.plain":
    "Mid-to-late summer, take a hand-length piece of this year's growth that has started to stiffen and turn woody at the base. Strip the lower leaves, set the cut end in damp mix, and keep it humid. Slower to root than soft cuttings but sturdier — good for many shrubs and broadleaf evergreens.",
  "prop.cuttings-hardwood.name": "Root a bare winter twig (hardwood cutting)",
  "prop.cuttings-hardwood.plain":
    "The simplest cutting of all for willows, dogwoods and their kind: while the plant is leafless and dormant, cut pencil-thick pieces about a forearm long, push the lower half into damp ground or a pot, and wait. Many root by spring with no fuss at all.",
  "prop.division.name": "Dig and split the clump (division)",
  "prop.division.plain":
    "For clump-forming perennials and grasses: in early spring or fall, dig up the whole plant, then pull or cut the crown into several pieces, each with its own roots and a few shoots. Replant the pieces right away at the same depth and water them in. Also rejuvenates a tired, hollow-centered clump.",
  "prop.layering.name": "Root a branch while it's still attached (layering)",
  "prop.layering.plain":
    "A near-foolproof trick: bend a low, flexible branch down to the ground, scratch the bark where it touches, pin it down with a rock or wire, and mound soil over that spot. It grows roots there while the parent keeps it alive; a season or two later, cut it free and dig up your new plant.",
  "prop.root-cuttings.name": "Grow new plants from root pieces (root cuttings)",
  "prop.root-cuttings.plain":
    "For plants that sprout readily from their roots: in late fall or winter, dig and cut finger-length pieces of pencil-thick root, lay them horizontally in a tray of damp mix under a shallow layer of soil, and keep them warm. New shoots rise from the buried pieces.",
  "prop.suckers.name": "Dig up the shoots it sends up around itself (suckers)",
  "prop.suckers.plain":
    "Thicket-formers throw up new rooted shoots a short way from the trunk. In early spring, slice down between a sucker and the parent with a spade, lift the sucker with its own roots attached, and replant it. Free plants, and it tidies the clump.",
  "prop.runners.name": "Pot up the babies on its runners (stolons)",
  "prop.runners.plain":
    "Strawberries and other creepers send out horizontal stems that root little plantlets along the way. Once a plantlet has its own roots, snip the runner connecting it to the parent, dig it up, and move it — or pin it into a small pot first, then cut it loose.",
  "prop.spores.name": "Sow the dust from the frond backs (spores)",
  "prop.spores.plain":
    "Ferns make no seed — they scatter dust-fine spores from brown patches under mature fronds. Slower and fussier, but doable: lay a ripe frond on paper for a day to collect the brown dust, scatter it on the surface of damp sterile mix, cover with clear plastic, and keep it bright and moist. A green film appears first, then tiny ferns over months. Most gardeners find dividing an existing clump far easier.",

  "growth.quick": "Quick to settle in: expect close to this full size within about three years.",
  "growth.steady": "A steady grower: close to full size by year {year}.",
  "growth.slowish": "In no hurry: about {frac} of its final height by year {year}, still filling in for years after.",
  "growth.slow":
    "Slow and long-lived: roughly {now} by year {year} on its way to {mature} — planted as much for the next generation as for you.",
  "frac.threeQuarters": "three-quarters",
  "frac.twoThirds": "two-thirds",
  "frac.half": "half",
  "confidence.high": "We're fairly sure about this one — the numbers come from well-established data.",
  "confidence.medium": "Reasonably confident, but some numbers are estimated from close relatives.",
  "confidence.low": "Rougher estimate — treat as a starting point, not gospel.",

  // ---------------------------------------------------------------------
  // Taxon names. Shown when a language has no vernacular name for a species
  // and the scientific name has been promoted to the heading (see lib/names).
  // ---------------------------------------------------------------------
  "names.englishName": "English name: {name}",
  "names.untranslated":
    "Some of this plant's description is still in English — we translate the writing region by region, and haven't reached this one yet.",
  "names.partlyNamed":
    "{named} of these {total} plants have a name in your language from a national reference list; the rest show their scientific name, because inventing one would be worse than showing none.",

  // The size drawing.
  "sizeViz.you": "You",
  "sizeViz.year": "Yr {n}",

  // ---------------------------------------------------------------------
  // Plant card.
  // ---------------------------------------------------------------------
  "badge.keystone": "Keystone plant",
  "badge.keystoneTitle":
    "A keystone plant supports far more wildlife than most — losing it would unravel the local food web.",
  "badge.noWater": "Survives with no watering",
  "badge.noWaterTitle":
    "Expected to establish and survive with no watering after planting, in an average year.",
  "badge.needsWater": "Needs water to establish",
  "badge.petToxic": "Toxic if eaten",
  "badge.thorny": "Thorny",
  "badge.aggressive": "Spreads — give it room",
  "badge.deerResistant": "Deer tend to leave it alone",
  "match.good": "Good match for this spot",
  "match.ok": "Workable here",
  "match.poor": "Poor match — here's why",
  "card.sizeCaption":
    "Drawn to scale beside a {human} person. Eventually reaches about {height} tall and {spread} wide.",
  "card.weightedHigh": "★ (you're weighting this high)",
  "card.hostSpecies": "{n} species",
  "card.whyRanks": "🦋 Why it ranks here — eco value {score}/100",
  "card.bloomRange": "Blooms {from}–{to} ({color}).",
  "card.foliage": "Grown for foliage, not flowers.",
  "card.gives": "What it does for you & wildlife: ",
  "card.needs": "What it needs from you: ",
  "card.bloomMoisture": "Bloom & moisture: ",
  "card.prefersSoil": "Prefers soil that's {bands}.",
  "card.confidence": "Confidence: {level}. ",
  "card.source": "Source: ",
  "card.howSure": "How sure are we? →",
  "card.sizeAria": "Size of {name} over time — {parts}.",
  "card.sizeAriaPart": "year {year}: {height} tall",
  "confidence.word.high": "high",
  "confidence.word.medium": "medium",
  "confidence.word.low": "low",

  // ---------------------------------------------------------------------
  // Bloom colours. Enumerated rather than assembled from translated atoms:
  // adjective order and agreement don't survive word-by-word assembly.
  // ---------------------------------------------------------------------
  "color.blue": "blue",
  "color.blue-purple": "blue-purple",
  "color.blue-violet": "blue-violet",
  "color.brown": "brown",
  "color.coral-red": "coral red",
  "color.cream": "cream",
  "color.cream-pink": "cream and pink",
  "color.creamy-white": "creamy white",
  "color.green": "green",
  "color.greenish": "greenish",
  "color.greenish-white": "greenish white",
  "color.greenish-yellow": "greenish yellow",
  "color.lavender": "lavender",
  "color.mauve": "mauve",
  "color.orange": "orange",
  "color.orange-red": "orange-red",
  "color.orange-tan": "orange-tan",
  "color.pink": "pink",
  "color.pink-lavender": "pink-lavender",
  "color.pink-purple": "pink-purple",
  "color.pink-red": "pink-red",
  "color.pink-white": "pink and white",
  "color.pink-yellow": "pink and yellow",
  "color.purple": "purple",
  "color.purple-brown": "purple-brown",
  "color.purple-tan": "purple-tan",
  "color.red": "red",
  "color.red-yellow": "red and yellow",
  "color.silvery": "silvery",
  "color.tan": "tan",
  "color.white": "white",
  "color.white-pink": "white and pink",
  "color.yellow": "yellow",

  // ---------------------------------------------------------------------
  // Results.
  // ---------------------------------------------------------------------
  "results.title": "Plants for this spot",
  "results.regionTag": "📍 {region}",
  "results.regionTagPick": "📍 {region} — your pick, not measured from a location",
  "results.whyTitle": "How does this ranking work?",
  "results.why":
    "Each plant's wildlife value — caterpillars hosted, pollinators and birds fed, rain soaked up — is weighed against how well it fits this spot's sun, moisture, and winter cold. Nothing is a black box: every plant's score is broken out right on its card.",
  "results.count": "{n} native plants {fit} — {good} are a good or workable match. Best matches first.",
  "results.fitClimate": "fit this spot's climate",
  "results.fitList": "are in this region's list",
  "results.noneFiltered":
    "No plants in the {region} list pass every filter you set. Try loosening a filter — the size limits are the usual culprit.",
  "results.noneHardy": "No plants in the {region} seed list are hardy at this spot's winter temperature.",
  "results.showingTop": "Showing the top {n}. Adjust the sliders above to resurface the rest.",
  "results.filterAria": "Filter these picks by plant name",
  "results.filterPlaceholder": "Filter by name…",
  "results.filterCount.one": "{shown} of {total} plants match “{q}”.",
  "results.filterCount.other": "{shown} of {total} plants match “{q}”.",
  "results.filterNone": "Nothing here matches — ",
  "results.filterSearchAll": "search every region",
  "results.filterNoneRest": " instead.",
  "results.sliderAria": "Importance of: {name}",
  "results.weightsSummary": "⚖️ What matters most?",
  "results.done": "Done — show the plants",
  "results.resorted": "Re-sorted for: {name}",
  "results.matchedTo": "Matched to: ",
  "results.sunSummary": "{label} (~{hours} h of sun)",
  "results.mesicSoil": "evenly moist soil ({link} in plant guides)",
  "results.mesicTerm": "“mesic”",
  "results.soilBand": "{word} soil",
  "results.wintersTo": "winters to about {temp} ({link})",
  "results.zoneLink": "USDA zone {zone}",
  "results.nativeAll": ". Everything below is native to this region{hardy}.",
  "results.andHardy": " and hardy through your winters",
  "results.back": "Back",
  "results.save": "💾 Save this spot",
  "results.savePrompt": "Name this spot (e.g. “front strip by driveway”)",
  "results.defaultLabel": "Spot at {lat}, {lon}",
  "results.saved": "Saved to this device.",
  "results.privacy":
    "A saved spot stays on this device only — it never reaches a server, because there isn't one",
  "preset.balanced": "Balanced",
  "preset.butterflies": "Butterflies & moths",
  "preset.birds": "Birds",
  "preset.erosion": "Stop erosion",
  "preset.rain": "Soak up rain",
  "preset.easiest": "Easiest to grow",
  "filter.summary": "🔍 Filters",
  "filter.noWater": "🌾 Survives with zero watering (guerrilla mode)",
  "filter.deer": "🦌 Deer tend to leave it alone",
  "filter.thorns": "🚫 No thorns",
  "filter.petSafe": "🐕 Safe around pets",
  "filter.aggressive": "✋ No aggressive spreaders",
  "filter.size.lead": "Stays under",
  "filter.height.tail": "tall",
  "filter.spread.tail": "wide",
  "filter.height.aria": "Greatest height to allow",
  "filter.spread.aria": "Greatest width to allow",
  "noRegion.title": "No plant list for this area yet",
  "noRegion.lede":
    "Indigene measured the sun, soil and climate for this spot, but its plant recommendations are still tuned region by region — and this spot is outside the areas covered so far. Showing you another region's plants would be dishonest, so we don't.",
  "noRegion.whatTitle": "What you can still do",
  "noRegion.browse": "Browse the full catalog",
  "noRegion.browseRest":
    " from the covered regions — as examples of the recommendations Indigene gives, not as plants for this spot.",
  "noRegion.ask": "Ask for your area on GitHub",
  "noRegion.askRest":
    " — open an issue with your postal code or town so we know where to grow next. Or add the region yourself: it's one plant-data file plus two registry lines, and contributions are welcome.",
  "noRegion.regionsTitle": "Regions covered so far",
  "noRegion.regionsLede":
    "If you know your area actually matches one of these — say, you're just over a boundary — you can use its list. We'll mark it as your pick, and its plants should be treated as untested for your exact area.",
  "noRegion.pickDifferent": "Pick a different spot",

  // ---------------------------------------------------------------------
  // The at-a-glance stat tiles.
  // ---------------------------------------------------------------------
  "stat.glance": "{name} at a glance",
  "stat.tileAria": "{label}: {value}{sub}. Tap to learn what this means.",
  "stat.dialogSource": "Source: ",
  "stat.howSourced": "How every number is sourced →",
  "stat.gotIt": "Got it",
  "stat.sun.label": "Sun",
  "stat.sun.value": "{min}–{max} h/day",
  "stat.sun.range": "{lo} to {hi}",
  "stat.sun.explain":
    "The band of direct-sun hours per day this plant accepts. Sun is the single biggest factor in whether a plant thrives — and there's a native for every light level, so the goal is matching the hours your spot really gets, not fighting them.",
  "stat.moisture.label": "Moisture",
  "stat.moisture.sub": "soil it accepts",
  "stat.moisture.explain":
    "How wet the soil stays after rain — not how often you water. Natives specialize: a dry-slope plant rots in a wet hollow, and a swamp-edge plant crisps on sand. Match the moisture your spot already has and you replace a watering schedule with nothing. (Plant guides call evenly moist soil “mesic”.)",
  "stat.moisture.more": "More about moisture types →",
  "stat.moistureWord.dry": "Dry",
  "stat.moistureWord.mesic": "Moist",
  "stat.moistureWord.wet": "Wet",
  "stat.zones.label": "Hardy zones",
  "stat.zones.sub": "USDA winter cold",
  "stat.zones.explain":
    "USDA zones measure winter's coldest night in steps of {step}. If your zone falls inside this plant's range, normal winters won't kill it — and a plant native to your area is almost always comfortably inside its home zone. No blankets, no burlap.",
  "stat.zones.more": "Find your zone on the USDA map →",
  "stat.ph.label": "Soil pH",
  "stat.ph.explain":
    "How acidic or alkaline the soil is — 7 is neutral, lower is acidic, higher is alkaline. Natives evolved with the local bedrock and leaf litter, so a plant native nearby rarely quarrels with your soil's pH. Pick to fit and you never buy amendments.",
  "ph.word.acidic": "acidic",
  "ph.word.alkaline": "alkaline",
  "ph.word.acidicToAlkaline": "acidic to alkaline",
  "ph.word.neutral": "around neutral",
  "stat.size.label": "Full size",
  "stat.size.sub": "height × spread, eventually",
  "stat.size.explain":
    "The honest eventual size from our cited records — often far bigger than a nursery tag admits. Give a native room for its mature self from day one and it will never need shearing into submission; the drawing below shows the pace year by year.",
  "stat.year.label": "Year {n}",
  "stat.year.value": "{height} tall",
  "stat.year.explain":
    "The pace comes from typical field growth at years 1, 3, 5, and 10 in this plant's cited records — not nursery-tag optimism. Site, water, and luck all shift it.",
  "pace.quick": "quick to full size",
  "pace.steady": "steady grower",
  "pace.slow": "slow and long-lived",
  "stat.host.label": "Caterpillar hosts",
  "stat.host.value": "{n} species",
  "stat.host.subKeystone": "keystone plant",
  "stat.host.subValue": "food-web value",
  "stat.host.explain":
    "How many butterfly and moth species can raise their caterpillars on this plant. Caterpillars are what nearly all baby songbirds are fed, so this is the best single measure of how much life a plant supports — and it's exactly where non-native plants score near zero.",
  "stat.host.explainKeystone":
    "This one is a keystone: it hosts far more species than most, and local food webs lean on it.",
  "stat.bloom.label": "Bloom",
  "stat.bloom.explain":
    "When it flowers. Native bloom windows are timed to local pollinators — some bees emerge for exactly these weeks. Plant a few natives with staggered bloom times and something is serving nectar from early spring to frost.",
  "stat.foliage.value": "Foliage",
  "stat.foliage.sub": "grown for leaves, not flowers",
  "stat.foliage.explain":
    "This one is grown for foliage and structure rather than flowers — and that's still wildlife value. Leaves feed caterpillars, stems shelter overwintering insects, and cover matters year-round in ways nectar alone can't.",

  // ---------------------------------------------------------------------
  // Plant page.
  // ---------------------------------------------------------------------
  "plant.docTitle": "{name} ({latin}) — Indigene",
  "plant.more": "← More natives",
  "plant.sizeAria": "Size of {name} over time",
  "plant.nativeTo": "📍 Native to: ",
  "plant.whyBelongs": "Why it belongs here: ",
  // The accessible name of the share control; the icon carries the 🔗 itself.
  "plant.share": "Share this plant",
  // What the icon widens to show. Must stay a word or two — it opens inside
  // the "Native to:" row, which already has a region name in it.
  "plant.shareShort": "Share",
  "plant.shareTitle": "{name} — Indigene",
  "plant.shareText": "{name} ({latin}) — a native plant worth knowing. Check if your spot suits it:",
  "plant.linkCopied": "Link copied — paste it anywhere.",
  "plant.ecosystemTitle": "🦋 What it does for the ecosystem",
  "plant.wildlifeItBrings": "Wildlife it brings in: ",
  "plant.soleTie": "This plant is the only option {name} has — a make-or-break tie.",
  "plant.propagationTitle": "🪴 How to grow more",
  "plant.forThisPlant": "For this plant: ",
  "plant.howToSource": "How-to source: ",
  "plant.usfsLink": "USFS Native Plant Network →",
  "plant.checkSpotTitle": "Want to plant it? Check your spot",
  "plant.checkSpotLede":
    "Stand where you'd plant it (or search for your town below) and Indigene checks the soil, climate and region against what this plant needs — native to {region} and beyond, it still has to like your exact spot.",
  "plant.checkPrivacy":
    "Used only to check this spot, only when you tap — your location never leaves your device except as anonymous lookups",
  "plant.checkLocation": "📍 Check my location",
  "plant.noSpot": "No spot chosen yet.",
  "plant.checkingSpot": "{where} — checking soil & climate…",
  "plant.near": "Near {place}",
  "plant.sunQuestion": "How much sun does that spot get?",
  "plant.sunUnsure": "Not sure",
  "plant.sunFull": "☀️ Sunny most of the day",
  "plant.sunHalf": "⛅ Sun about half the day",
  "plant.sunShade": "🌳 Mostly shade",
  "plant.noGpsSearch": "🔎 No GPS? Search by town",
  "plant.noGeolocation": "This device can't share location — search for your town below.",
  "plant.denied": "Location denied — search for your town below instead.",
  "plant.noFix": "Couldn't get a fix — try again or search for your town below.",
  "plant.searchOffline":
    "The place search needs a signal and we couldn't reach it. If GPS works, use the location button above.",
  "plant.seeEverything": "See everything that thrives at this spot →",
  "plant.notFoundTitle": "We don't know that plant yet",
  "plant.notFoundLede":
    "Nothing in Indigene's regional lists matches “{slug}”. The lists are deliberately curated — every entry is checked for native status and honest numbers — so they grow carefully.",
  "plant.notFoundBrowse": "Browse the natives we do know",
  "ref.title": "🔎 Look it up elsewhere",
  "ref.lede":
    "Find {name} in the botanical and observation databases — the same plant, keyed by a shared identifier so you land on the right record.",
  "ref.powo": "Kew — accepted name & native range",
  "ref.ipni": "the nomenclatural record",
  "ref.wfo": "global taxon record",
  "ref.gbif": "where it's been recorded growing",
  "ref.usda": "U.S. native status & distribution",
  "ref.itis": "North American taxonomy",
  "ref.inaturalist": "photos & nearby sightings",
  "ref.wikidata": "cross-references & Wikipedia",
  "ref.identity": "Identity: ",
  "ref.identityRest": " — a persistent, global id (resolvable at identifiers.org).",

  // ---------------------------------------------------------------------
  // Wildlife.
  // ---------------------------------------------------------------------
  "wildlife.coverageNote":
    "These are the notable, well-documented wildlife ties we've mapped so far — not every insect a plant supports. A single oak is a caterpillar host to hundreds of moth species; here we name the ones worth choosing a plant for. Every tie shows its source, and the list grows as carefully as the plant lists do. The regions we name for an animal are the ones where we've mapped plants supporting it; its own range often reaches well past them.",
  "wildlife.indexDocTitle": "Browse native plants by the wildlife they support — Indigene",
  "wildlife.indexTitle": "Browse by wildlife",
  "wildlife.indexLede":
    "Pick the insect or animal you want in your yard, and see which native plants support it — and how. {n} creatures mapped so far, from monarchs to the gopher tortoise.",
  "wildlife.allNative": "🌿 Every animal here is itself native. ",
  "wildlife.allNativeRest":
    "That's the whole point — a native plant feeding native wildlife — so the introduced honey bee is left out. So instead of a “native” tag on every card, the 📍 figure counts the regions we've mapped a creature in — open it for their names.",
  "wildlife.browsePlants": "← Browse plants instead",
  "wildlife.browsePlantsShort": "Browse plants",
  "wildlife.startFromSpot": "Start from a spot",
  "wildlife.supportedBy.one": "{n} native plant in Indigene supports {animal}",
  "wildlife.supportedBy.other": "{n} native plants in Indigene support {animal}",
  "wildlife.supportedByInRegion.one": "{n} native plant on Indigene's {region} list supports {animal}",
  "wildlife.supportedByInRegion.other": "{n} native plants on Indigene's {region} list support {animal}",
  "wildlife.inRegions": "Native to {n} of Indigene's regions: {regions}. Open for links.",
  "wildlife.inRegionsTitle": "Native to {n} regions",
  "wildlife.inRegionsBody":
    "Indigene maps native plants supporting {animal} on {n} of its regional lists. Open one to see every creature those plants support.",
  "wildlife.nativeTo": "📍 Native to",
  "wildlife.regionPillTitle": "{region} — all the wildlife its natives support",
  "wildlife.docTitle": "Native plants that support {animal} — Indigene",
  "wildlife.allWildlife": "← All wildlife",
  "wildlife.aNativeAnimal": "A native animal. ",
  "wildlife.ofThemHosts.one": ", {n} of them as a caterpillar host — the strongest tie.",
  "wildlife.ofThemHosts.other": ", {n} of them as caterpillar hosts — the strongest tie.",
  "wildlife.cantLiveWithout.one": "⭐ It can't live without this plant. ",
  "wildlife.cantLiveWithout.other": "⭐ It can't live without these plants. ",
  "wildlife.onlyOption.one": "This is its only option — remove it and {animal} has nowhere to go.",
  "wildlife.onlyOption.other": "{n} of these are its only option — remove them and {animal} has nowhere to go.",
  "wildlife.speciesRecord": "See the species record: ",
  "wildlife.fullProfile": "{name} — full profile",
  "wildlife.allSources": "All sources & licensing →",
  "wildlife.rankForSpot": "Rank these for my spot",
  "wildlife.notFoundTitle": "We don't track that creature yet",
  "wildlife.notFoundLede":
    "Nothing in Indigene's wildlife list matches “{id}”. The list is curated — every tie is checked and sourced — so it grows carefully.",
  "wildlife.notFoundBrowse": "Browse the wildlife we do track",
  "wildlife.groupDocTitle": "Native plants for {group} — Indigene",
  "wildlife.groupLede": "{n} mapped so far. {blurb}",
  "wildlife.emptyGroup":
    "We haven't mapped any {group} yet — every tie is checked and sourced before it lands, so the list grows carefully.",
  "wildlife.allChip": "All ({n})",
  "wildlife.groupsNav": "Wildlife groups",
  "wildlife.filterAria": "Filter this list by animal name",
  "wildlife.filterPlaceholder": "Filter by name…",
  "wildlife.filterCount.one": "{shown} of {total} creatures match “{q}”.",
  "wildlife.filterCount.other": "{shown} of {total} creatures match “{q}”.",
  "wildlife.filterNoneGroup": "No {group} here match “{q}” — ",
  "wildlife.filterSeeAll": "see all the wildlife",
  "wildlife.filterNoneIndex": "No creature we've mapped matches “{q}” yet — ",
  "wildlife.filterSearchPlants": "search the plants",
  "wildlife.filterNoneRest": " instead.",
  // The region cut of the index — the other axis the group chips run on.
  "wildlife.regionDocTitle": "Wildlife the natives of {region} support — Indigene",
  "wildlife.groupInRegionDocTitle": "{group} of {region} — Indigene",
  "wildlife.indexLedeRegion":
    "{n} creatures the natives on Indigene's {region} list support. Pick one to see which of those plants raise or feed it — and how.",
  "wildlife.groupInRegionLede": "{n} on Indigene's {region} list. {blurb}",
  "wildlife.regionFilterLabel": "Show the wildlife of",
  "wildlife.regionFilterAll": "Every region ({n})",
  "wildlife.allWildlifePlain": "All wildlife",
  "wildlife.noSuchRegionTitle": "That's not a region we cover",
  "wildlife.noSuchRegionLede":
    "Nothing in Indigene matches the region “{id}”. Pick one of these instead:",

  // ---------------------------------------------------------------------
  // Region rosters.
  // ---------------------------------------------------------------------
  "form.tree": "Trees",
  "form.shrub": "Shrubs",
  "form.perennial": "Perennials & wildflowers",
  "form.grass": "Grasses & sedges",
  "form.vine": "Vines",
  "form.groundcover": "Groundcovers",
  "form.fern": "Ferns",
  "region.docTitle": "Natives of {region} — Indigene",
  "region.categoryDocTitle": "{label} native to {region} — Indigene",
  "region.lede": "Every native we know for {reference} — tap any plant for its full profile.",
  "region.noSuchRegion": "That link doesn't match any region Indigene covers.",
  "region.noSuchCategory": "“{slug}” isn't a plant category we know — try one of the groups below.",
  "region.featured": "← Featured natives",
  "region.elsewhere": "{label} in another region:",
  "region.categoryCount.one": "{n} native plant for {reference}",
  "region.categoryCount.other": "{n} native plants for {reference}",
  "region.tapAny": " — tap any for its full profile.",
  "region.emptyCategory":
    "Our {region} list has no {label} yet — the seed lists are curated and grow carefully. Try another category, or the same category in a region below.",
  "region.allOfRegion": "← All natives of this region",
  "region.allChip": "All ({n})",
  "region.categoriesNav": "Plant categories",
  "region.filterAria": "Filter this list by plant name",
  "region.filterPlaceholder": "Filter by name…",
  "region.filterCount.one": "{shown} of {total} plants match “{q}”.",
  "region.filterCount.other": "{shown} of {total} plants match “{q}”.",
  "region.filterNone": "Nothing here matches — ",
  "region.filterSearchAll": "search every region",
  "region.filterNoneRest": " instead.",
  "region.nothingHere": "Nothing at this address",
  "region.browseNatives": "Browse the natives",
  "regionStat.plants.label": "Native plants",
  "regionStat.plants.sub": "curated for this region",
  "regionStat.plants.explain":
    "The plants on this region's hand-built list, each checked as native to it against the sources cited on its profile. It's a curated starting lineup that grows carefully — not a census of everything that grows here.",
  "regionStat.hosts.label": "Caterpillar hosts",
  "regionStat.hosts.value": "up to {n}",
  "regionStat.hosts.sub": "species on {plant} alone",
  "regionStat.hosts.explain":
    "How many butterfly and moth species can raise their caterpillars on a single plant — {plant} tops this list at {n}. Caterpillars are what nearly all baby songbirds are fed, so this is the best single measure of how much life a planting supports. (Counts overlap between plants, so we don't add them up.)",
  "regionStat.wildlife.label": "Wildlife ties",
  "regionStat.wildlife.sub": "kinds of wildlife, documented",
  "regionStat.wildlife.explain":
    "{n} kinds of butterflies, moths, bees, birds, and mammals with a documented, citable tie to at least one plant on this list — each counted once, whether it's a single species like the monarch or a familiar group like the acorn-caching jays. These are the notable, nameable relationships — the real total is far larger; a single oak feeds more species than anyone could list.",
  "regionStat.wildlife.more": "Browse plants by the wildlife they support →",
  "regionStat.keystone.label": "Keystone plants",
  "regionStat.keystone.sub": "food webs lean on these",
  "regionStat.keystone.explain":
    "{n} of this region's plants are keystones — like the wedge at the crown of a stone arch, each supports far more wildlife than most, and losing one would unravel a food web far bigger than itself.",

  // ---------------------------------------------------------------------
  // The plants index (#/plants) — every native we know, searchable.
  // ---------------------------------------------------------------------
  "plants.title": "Native plants",
  "plants.lede":
    "Every plant Indigene knows, from every region. Type a name — common or scientific — to narrow the list, then open a plant for its full page.",
  "plants.label": "Plant name",
  "plants.placeholder": "e.g. milkweed, oak, or Asclepias",
  "plants.matchCount": "{n} of {total} native plants match “{q}”.",
  "plants.idle": "{total} native plants across {regions} regions.",
  "plants.alsoCalled": "Also called “",
  "plants.alsoCalledEnd": "”",
  "plants.noneLead":
    "No plant in Indigene's lists matches “{q}”. The lists are curated per region, so they grow carefully — ",
  "plants.noneLink": "browse the natives we know",
  "plants.noneEnd": ".",
  "plants.browseRegions": "Browse by region",

  // ---------------------------------------------------------------------
  // Privacy & safety. Written for everyone, including kids and grandparents.
  // ---------------------------------------------------------------------
  "privacy.docTitle": "Privacy & safety — Indigene",
  "privacy.title": "Privacy & safety",
  "privacy.lede":
    "Indigene is built to be safe and respectful for everyone who uses it — including children. Here's the whole story in plain words: what we ask for, what we never do, and where anything you share actually goes.",
  "privacy.shortVersion": "The short version. ",
  "privacy.short1": "No account, no sign-up, no password — nothing that identifies you.",
  "privacy.short2": "No ads. No tracking. No analytics watching what you tap. Nothing about you is sold or shared.",
  "privacy.short3": "Your saved spots stay on your device. There's no Indigene server for them to go to.",
  "privacy.short4": "You never have to share your exact location — a postal code or town works everywhere it's used.",
  "privacy.short5": "It's open source: anyone can read exactly what it does.",
  "privacy.locationTitle": "Your location: only when you ask",
  "privacy.location1":
    "Indigene asks for your location only when you tap a button for it — to work out which region you're in, look up your soil, climate, and sun, and find real plant and wildlife sightings nearby. It never reads your location in the background, and never when the app is closed.",
  "privacy.location2":
    "And you're never required to share it. Everywhere the app can use a location, you can instead type a {zip}, or just pick your region from a list. Sharing precise location is always your choice, never the price of using Indigene.",
  "privacy.zipOrTown": "postal code or town",
  "privacy.location3":
    "When you do share a spot, your device sends that coordinate straight to the specific public-science services that answer each question — and nowhere else. There's no Indigene server in the middle keeping a log of where you've been, because there's no Indigene server at all. The whole app runs in your browser.",
  "privacy.whereTitle": "Where your location goes, and what for",
  "privacy.whereLede":
    "So you can see exactly what happens: when a lookup needs your spot, your browser talks directly to these public services. Each sees only that one lookup, gets no name or account (there isn't one), and has its own privacy policy for that request.",
  "privacy.svc.sentWrap": "(it's sent {sent}).",
  "privacy.svc.inat.for": "photos of plants and animals seen near there",
  "privacy.svc.inat.sent": "a coordinate or a map area, plus the species being looked up",
  "privacy.svc.meteo.for": "your climate — rainfall and how cold winters get; and turning a postal code or town into a point on the map",
  "privacy.svc.meteo.sent": "a coordinate, or the place name you typed",
  "privacy.svc.osm.for": "the name of the nearest town (shown instead of raw numbers), and the map picture",
  "privacy.svc.osm.sent": "a coordinate",
  "privacy.svc.soil.for": "your soil type and acidity",
  "privacy.svc.soil.sent": "a coordinate",
  "privacy.svc.usgs.for": "your elevation and slope",
  "privacy.svc.usgs.sent": "a coordinate",
  "privacy.svc.epa.for": "the name of your ecoregion",
  "privacy.svc.epa.sent": "a coordinate",
  "privacy.whereFooter":
    "These are reputable public institutions — universities, government agencies, and a nonprofit naturalist community — not advertisers. On purpose, none of these lookups need your street address: a town, postal code, or a coarse grid is all the science uses. The full technical list, with links and licences, is in {link}.",
  "privacy.dataSourcesLink": "our public data-sources document",
  "privacy.savedTitle": "Saved locations stay on your device",
  "privacy.saveButton": "Save this spot",
  "privacy.saved":
    "When you tap {save}, it's kept in your browser's own storage, on that device only. It never leaves your device, never reaches a server (there is none), and we can never see it. It's yours: open or delete a saved spot anytime from the Saved menu, and clearing your browser's data for this site erases them for good.",
  "privacy.noAccountTitle": "No account, no tracking, no ads",
  "privacy.noAccount1": "No sign-up, email, or password — we never ask who you are.",
  "privacy.noAccount2": "No advertising, and nothing sold or shared. We hold no data about you to sell in the first place.",
  "privacy.noAccount3":
    "No analytics and no tracking cookies following what you do. The only things stored are your saved spots and a few settings — on your device, for you.",
  "privacy.childrenTitle": "Made for everyone, including children",
  "privacy.children1":
    "Plain language throughout — every gardening or science term is explained in words anyone can act on.",
  "privacy.children2": "Nothing to buy. There are no purchases or in-app payments of any kind.",
  "privacy.children3":
    "No chat, comments, messaging, or social features — so there's no way for a stranger to contact anyone through Indigene.",
  "privacy.children4": "We collect no personal information from anyone, of any age.",
  "privacy.children5":
    "The photos are research-grade community records from iNaturalist — verified pictures of plants and wildlife — always shown with credit to the person who took them. Links out go to trusted science and nature organizations.",
  "privacy.openTitle": "You don't have to take our word for it",
  "privacy.open":
    "Indigene is open source under the MIT licence. The entire app — every line, and every network request it can make — is public. If you want to verify anything on this page, you can read the code yourself: {link}.",
  "privacy.repoLink": "Indigene on GitHub",
  "privacy.questionsTitle": "Questions or concerns",
  "privacy.questions":
    "If anything here is unclear, or you think we can do better for safety or privacy, please tell us — {link}. Because the app is open source, the code is always the final, honest word on what it does.",
  "privacy.issueLink": "open an issue on GitHub",
  "privacy.home": "← Home",
  "privacy.findPlants": "Find plants for my spot",

  // ---------------------------------------------------------------------
  // Where our numbers come from.
  // ---------------------------------------------------------------------
  "sources.docTitle": "Where our numbers come from — Indigene",
  "sources.title": "Where our numbers come from",
  "sources.lede":
    "Indigene shows you numbers — how many caterpillars a tree feeds, how tall it gets, how well it holds a bank together. Some of those are counted from open science data. Others are our best judgment. This page tells you which is which, and where we'd bet we're wrong.",
  "sources.short1": "Nothing here is invented. Every number has a source, and every plant shows its own sources on its page.",
  "sources.short2": "Some numbers are counted from real datasets. Others are careful estimates — we label those honestly.",
  "sources.short3": "Our plant lists are starter lists, not the complete flora of anywhere.",
  "sources.short4": "We'd genuinely rather be corrected than believed. If a number looks wrong to you, it might be.",
  "sources.everyNumberTitle": "Every number, and how sure we are",
  "sources.everyNumberLede":
    "Every figure in the app comes to us in one of three ways, and they're not equally firm. Here they are grouped by which, firmest first.",
  "sources.counted": "Counted",
  "sources.countedMeaning": "Somebody tallied it in a published dataset, and we read it off. The firmest kind of number here.",
  "sources.calculated": "Calculated",
  "sources.calculatedMeaning":
    "Nobody published this figure for your spot, so the app works it out from measured numbers using a method someone else published. Same arithmetic every time — you could do it on paper and get what we got.",
  "sources.estimated": "Estimated",
  "sources.estimatedMeaning":
    "A person on our side weighed the evidence and picked a number. Useful, and the softest kind here — these are the ones to doubt first.",
  "sources.fig.host": "Caterpillar host count",
  "sources.fig.hostFrom":
    "— in Europe, from the Gaytán 2026 Lepidoptera–plant matrix; in the US, from the Tallamy / National Wildlife Federation figures.",
  "sources.fig.native": "Native or not",
  "sources.fig.nativeFrom":
    "— from the national botanical records: USDA PLANTS in the US, Tela Botanica and the INPN in France, plus regional floras.",
  "sources.fig.ecoregion": "Your ecoregion",
  "sources.fig.ecoregionFrom":
    "— the US EPA's ecoregion map, or the European Environment Agency's, asked about your exact point.",
  "sources.fig.soil": "Your soil and its acidity",
  "sources.fig.soilFrom":
    "— from SoilGrids, a global soil map. Coarse: it describes a 250-metre square, not your flower bed.",
  "sources.fig.climate": "Rain and winter cold",
  "sources.fig.climateFrom": "— from Open-Meteo's weather records for your area.",
  "sources.fig.elevation": "Elevation and slope",
  "sources.fig.elevationFrom": "— from national elevation data for your point.",
  "sources.fig.ties": "Which wildlife a plant feeds",
  "sources.fig.tiesFrom1":
    "— each plant-and-animal pairing cites a source, and the app refuses to show one that doesn't. How ",
  "sources.fig.tiesEm": "much",
  "sources.fig.tiesFrom2": " an animal depends on that plant is our reading of those sources.",
  "sources.fig.sun": "Hours of sun",
  "sources.fig.sunFrom":
    "— your device calculates where the sun goes over your spot across the year, using the standard NOAA method. No lookup, no network.",
  "sources.fig.zone": "Hardiness zone",
  "sources.fig.zoneFrom":
    "— from your recorded winter lows, using the published USDA zone definition, rather than reading an official map.",
  "sources.fig.size": "How big it gets, and how fast",
  "sources.fig.sizeFrom":
    "— typical growth on an average site, from floras and forestry references. Real plants vary enormously.",
  "sources.fig.scores": "The six 0–100 scores",
  "sources.fig.scoresFrom":
    "— pollinators, birds, soaking up rain, holding soil, storing carbon, ease of establishing. Informed by the sources on each plant's page, but these are judgments we made, on a scale we invented.",
  "sources.assumptionsTitle": "The assumptions behind them",
  "sources.assumptionsLede":
    "Every number above rests on something we decided. These are the decisions that would move the most if we got them wrong:",
  "sources.assume1": "We count caterpillars by plant family group, not by exact species. ",
  "sources.assume1Rest":
    "The host count on an English oak is really the count for oaks in general. We do it because the American and European datasets are only comparable at that level — but it means a species that hosts fewer insects than its relatives looks better than it is.",
  "sources.assume2": "For European counts, we only count relatives that grow wild in your zone. ",
  "sources.assume2Rest":
    "So native honeysuckle is credited with 57 moth and butterfly species, not the 111 you'd get by including introduced garden honeysuckles. Each plant's page says so where the two figures differ.",
  "sources.assume3": "European counts are European, not French. ",
  "sources.assume3Rest":
    "The dataset records which insects use a plant somewhere in Europe. An insect counted for your garden might not actually live near you.",
  "sources.assume4": "Your region is bigger than your garden. ",
  "sources.assume4Rest":
    "A region here can cover a third of a country. It's the right size for choosing a plant list, and far too coarse to describe your particular slope, shade and drainage — which is why the app asks you about those directly.",
  "sources.assume5": "Our plant lists are starter lists. ",
  "sources.assume5Rest":
    "Twenty to forty plants chosen to be reliable, available and genuinely useful to wildlife — never every native plant of a region. A plant missing from a list is not a plant we're advising against.",
  "sources.challengeTitle": "What we'd challenge first",
  "sources.challengeLede":
    "If you wanted to find a mistake here, this is where we'd tell you to look — roughly in order of how likely we are to be wrong:",
  "sources.chal1": "The six 0–100 scores. ",
  "sources.chal1Rest":
    "The softest numbers in the app by a distance. There's no dataset that says a shrub scores 78 for erosion control; that came from us reading sources and judging. If you know a plant well and a score looks off, you're probably right.",
  "sources.chal2": "Counting by family group instead of species. ",
  "sources.chal2Rest":
    "Defensible, and we'd defend it — but it is a real approximation, and it flatters the weaker members of a strong group.",
  "sources.chal3": "The regions aren't equally well sourced. ",
  "sources.chal3Rest":
    "Some plant lists rest on decades of regional botanical work; the newest ones are thinner. The confidence note on each plant is our honest read of that, plant by plant.",
  "sources.chal4": "The US caterpillar counts sit on shakier ground than the European ones. ",
  "sources.chal4Rest":
    "The European figures come from an openly licensed dataset we can point you at and recompute from scratch. The US figures come from published research whose database has no open licence — so they're harder for you to check than we'd like.",
  "sources.chal5": "Site data is coarser than it looks. ",
  "sources.chal5Rest":
    "Soil from a 250-metre grid square, and a hardiness zone we calculate rather than look up, both read as precise on screen. Trust your own eyes and hands over either.",
  "sources.tellUsTitle": "How to tell us we're wrong",
  "sources.tellUs":
    "Please do. The whole app is open source, so nothing here has to be taken on trust — you can read the data files, the counting script, and every line that turns a number into a recommendation: {repo}. If something looks wrong, {issue} — a correction with a source behind it is the most useful thing anyone can send us.",
  "sources.openIssue": "open an issue",
  "sources.fullList":
    "For the full technical list of every dataset, who publishes it, and what its licence allows, see {doc}. The European caterpillar counts come from {matrix}, published open-access under CC-BY 4.0 — you can download the same data we did and check our arithmetic.",
  "sources.dataDoc": "our data-sources document",

  // Where the plant and animal *names* come from — the same accounting the
  // numbers get, because a name is a claim too.
  "names.sourcesTitle": "Where the plant and animal names come from",
  "names.sourcesLede":
    "A plant's name in your language isn't a translation of its English name — it's the name the people who live with it gave it, recorded in a national reference list. So we look each one up rather than translating it:",
  "names.src.taxref":
    "the French national reference for the flora and fauna of France. The authority for anything that grows or flies here.",
  "names.src.bdtfx": "the flora of metropolitan France, with the vernacular names French botanists actually use.",
  "names.src.vascan":
    "the standard French names for North American plants — the gap the French list can't fill, because a Pacific Northwest native is unknown to it.",
  "names.src.wikidata": "the crosswalk of last resort, for species neither national list covers.",
  "names.sourcesGap":
    "Where no list has a name, we show the scientific name instead. Plenty of North American natives have simply never been named in French, and making one up would be exactly the confident invention we refuse to commit with a host count.",

  // ---------------------------------------------------------------------
  // Shared components: the location prompt, the sightings sections, chips.
  // ---------------------------------------------------------------------
  "privacy.howHandled": "How your data is handled",
  "term.tapToLearn": "{term}. Tap to learn what this means.",
  "zoneChip.approx":
    "Roughly USDA hardiness zones {range} — the American scale is a translation here, not the local convention, so treat it as a guide to winter cold.",
  "zoneChip.exact": "USDA hardiness zones {range} — the winter cold this region's plant list is tuned to.",
  "prompt.noGeolocation": "This device can't share a location — enter a postal code or town below instead.",
  "prompt.getting": "Getting your location…",
  "prompt.denied": "Location denied — that's fine; enter a postal code or town below instead.",
  "prompt.noFix": "Couldn't get your location. Try again, or enter a postal code or town below.",
  "prompt.placeholder": "e.g. 16801, or State College",
  "prompt.notFound":
    "Couldn't find that postal code or place. Try a nearby town with its region — like “State College Pennsylvania” — or a full postal code.",
  "prompt.offline":
    "The place search needs a signal and we couldn't reach it. If your device has GPS, use the location button above.",
  "prompt.or": "or",
  "prompt.label": "Enter a postal code or town",
  "prompt.privacy":
    "Whichever you choose, it's used only for this lookup and never leaves your device except as an anonymous request to iNaturalist",
  "obs.creditLead": "Sightings & photos from ",
  "obs.creditMid": ", each © its observer under the licence shown. ",
  "obs.fromCache": "Loaded from this device's cache — ",
  "obs.fetchedNow": "Fetched just now by your browser — ",
  "obs.creditEnd": "your browser calls iNaturalist directly, so they see your request, not ours.",
  "lightbox.prev": "Previous photo",
  "lightbox.next": "Next photo",
  "lightbox.close": "Close",
  "lightbox.viewer": "Photo viewer",
  "lightbox.viewOriginal": "View original sighting ↗",
  "lightbox.sightingOf": "sighting {i} of {n}",
  "nearby.useMyLocation": "Use my location",
  "nearby.asking": "Asking iNaturalist…",
  "nearby.unreachable":
    "We couldn't reach iNaturalist just now. It's called straight from your browser, so a flaky connection or a blocked request will stop it — try again later.",
  "nearby.nearPlace": "near {place}",
  "nearby.closeToYou": "close to you",
  "nearby.found": "Found {n} ",
  "nearby.foundNear": "Found {n} nearby ",
  "nearby.seeItGrowing": "See it growing near you",
  "nearby.seeItGrowingLede":
    "The drawing above is to scale, but nothing beats seeing a mature {name} in the ground. Share your location or enter a postal code and we'll pull real, community-verified photos of ones growing near there — or look it up in a region it's native to, even if you're not there. Either way the photos come live from iNaturalist, called by your own browser and credited to the people who took them.",
  "nearby.outsideYou":
    "You're outside the regions Indigene has native-plant data for, so we can't vouch for what's truly native there — and we won't dress up nearby sightings as local natives. The sun, soil and climate readings still work everywhere.",
  "nearby.outsidePlace":
    "{place} is outside the regions Indigene has native-plant data for, so we can't vouch for what's truly native there — and we won't dress up nearby sightings as local natives. The sun, soil and climate readings still work everywhere.",
  "nearby.noTaxonId":
    "We don't have an iNaturalist taxon id for {name} yet, so we can't match it to verified sightings.",
  "nearby.noneNear":
    "{name} is native to {region}, but no one has photographed and verified one {where} on iNaturalist yet. It's still worth planting — the local showcase just isn't there to point you to.",
  "nearby.noneInRegion":
    "No research-grade sightings of {name} with photos have been logged in {region} on iNaturalist yet. It's native there — the community just hasn't captured one.",
  "nearby.foundNearRest.one":
    "research-grade sighting — a real {name}, native to {region}, that someone verified and photographed {where}:",
  "nearby.foundNearRest.other":
    "research-grade sightings — real {name}, native to {region}, that someone verified and photographed {where}:",
  "nearby.foundRest.one":
    "research-grade sighting of {name} in {region} — verified and photographed by the iNaturalist community (you don't have to be there):",
  "nearby.foundRest.other":
    "research-grade sightings of {name} in {region} — verified and photographed by the iNaturalist community (you don't have to be there):",
  "nearby.notThereNative": "Not there right now? Look it up where it's native:",
  "nearby.nativeToList": "native to {list}",
  "nearby.nativeToOther": "native to another region",
  "nearby.nativeElsewhere":
    "Our data lists {name} as {belongs}, not {region}. It may turn up on iNaturalist there as a planted or escaped specimen, but we won't showcase it as a local native where it doesn't belong — that's the opposite of what Indigene is for.",
  "wlNearby.seeItNear": "See it near you",
  "wlNearby.seeItNearLede":
    "Nothing beats seeing a real {name}. Share your location or enter a postal code, and we'll pull community-verified iNaturalist photos of ones spotted near there — or look it up in a region where it's found, even if you're not there. Either way the photos come live from iNaturalist, called by your own browser and credited to the people who took them.",
  "wlNearby.outsideYou":
    "You're outside the regions Indigene covers, so we can't do a nearby lookup there. You can still look it up in a region where it's found, below.",
  "wlNearby.outsidePlace":
    "{place} is outside the regions Indigene covers, so we can't do a nearby lookup there. You can still look it up in a region where it's found, below.",
  "wlNearby.noneNear":
    "No one has photographed and verified a {name} {where} on iNaturalist yet — that just means the community hasn't logged one here, not that it's absent.",
  "wlNearby.noneInRegion":
    "No research-grade sightings of {name} with photos have been logged in {region} on iNaturalist yet — the community just hasn't captured one.",
  "wlNearby.foundNearRest.one": "research-grade sighting — a real {name} someone verified and photographed {where}:",
  "wlNearby.foundNearRest.other": "research-grade sightings — a real {name} someone verified and photographed {where}:",
  "wlNearby.foundRest.one":
    "research-grade sighting of {name} in {region} — verified and photographed by the iNaturalist community (you don't have to be there):",
  "wlNearby.foundRest.other":
    "research-grade sightings of {name} in {region} — verified and photographed by the iNaturalist community (you don't have to be there):",
  "wlNearby.notThereFound": "Not there right now? Look it up where it's found:",

  // ---------------------------------------------------------------------
  // Ecoregion labels. The EEA's eleven regions have a settled name in each
  // language; EPA Level III names are American place names and stay as they
  // are. The suffix, and the coarse offline guesses, are our own words.
  // ---------------------------------------------------------------------
  "ecoregion.suffixEea": "EEA biogeographical region",
  "ecoregion.suffixEpa": "EPA Level III ecoregion",
  "ecoregion.eea.alpine": "Alpine",
  "ecoregion.eea.atlantic": "Atlantic",
  "ecoregion.eea.black-sea": "Black Sea",
  "ecoregion.eea.boreal": "Boreal",
  "ecoregion.eea.continental": "Continental",
  "ecoregion.eea.mediterranean": "Mediterranean",
  "ecoregion.eea.pannonian": "Pannonian",
  "ecoregion.eea.steppic": "Steppic",
  "ecoregion.eea.arctic": "Arctic",
  "ecoregion.eea.anatolian": "Anatolian",
  "ecoregion.eea.macaronesia": "Macaronesia",
  "ecoregion.broad.marineWest": "Marine West Coast Forest (broad)",
  "ecoregion.broad.southFlorida": "Southern Florida Coastal Plain (broad)",
  "ecoregion.broad.southernCoastal": "Southern Coastal Plain (broad)",
  "ecoregion.broad.easternTemperate": "Eastern Temperate Forest (broad)",
  "ecoregion.broad.mediterranean": "Mediterranean (broad)",
  "ecoregion.broad.atlantic": "Atlantic (broad)",

  // ---------------------------------------------------------------------
  // About. The third of the "how does this work" pages: #/privacy says how we
  // treat you, #/sources says how much to trust the numbers, this one says why
  // the thing exists at all.
  // ---------------------------------------------------------------------
  "about.docTitle": "About Indigene",
  "about.title": "About Indigene",
  "about.lede":
    "An indigene is a native of a place. This app measures the sun where you're standing, looks up the soil and climate for those exact coordinates, and gives you back the plants that belong there — with plain words the whole way.",
  "about.hereEm": "here",
  "about.whyTitle": "Why this exists",
  "about.why1":
    "Most gardens are green and nearly lifeless. Lawns, and shrubs and flowers from other continents, look fine and feed almost nothing: the caterpillars that nearly every baby songbird is raised on can only eat the plants they evolved alongside. No native plants, no caterpillars, no baby birds — and that quiet subtraction is happening across whole countries at once, one tidy garden at a time.",
  "about.why2":
    "The remedy is unusually cheap and unusually fast. Plant one native and the food web restarts the same season. What was missing wasn't the will — it was a straight answer to “what should I plant {here}, in this actual corner of my actual garden?” that didn't require you to already speak the language of plant catalogues. That answer is what Indigene tries to be.",
  "about.forTitle": "Who it's for",
  "about.forLede": "It's built, deliberately, for people who are not experts:",
  "about.for1":
    "Beginners, who have never heard \"part shade\" or \"keystone species\" and shouldn't have to before getting a useful answer.",
  "about.for2":
    "Guerrilla gardeners, who get one shot with no aftercare and need to be told plainly what will survive alone.",
  "about.for3":
    "Older gardeners new to natives, who deserve to be met with \"here's what this does for you\" rather than with ideology.",
  "about.forEnd":
    "Which is why it works one-handed, outdoors, with dirty hands and a bad connection — and why every gardening term is explained in place, every time, instead of being assumed.",
  "about.stancesTitle": "What it refuses to do",
  "about.stancesLede":
    "These aren't values on a wall; each one is a decision you can see the app making, and the reason it behaves the way it does.",
  "about.stance.plain": "It never uses a term it hasn't explained.",
  "about.stance.plainBody":
    "Common words lead and the technical term follows in brackets — \"winters down to about −12 °C (USDA zone 8a)\", never the other way round. If a word would send you to a search engine, it has failed.",
  "about.stance.uncertain": "It shows you its error bars.",
  "about.stance.uncertainBody":
    "The sun estimate is a range, not a decimal, because sensors lie and the honest answer is a band. The soil reading is always framed as “the map says X — here's a 60-second check to see whether that's true where you're standing”, because a soil map square is bigger than your whole garden. Standing there, you know more than the map does, and the app is built to let you overrule it.",
  "about.stance.sourced": "Every number has to be traceable to somebody else.",
  "about.stance.sourcedBody":
    "Each plant carries its sources and a plain confidence note, and where a figure is our judgment rather than a count, the Sources page says so and names the ones we'd challenge first. Nothing is invented to fill a gap — a plant with no French name shows its scientific name rather than a plausible-sounding guess.",
  "about.stance.yours": "It doesn't want anything from you.",
  "about.stance.yoursBody":
    "No account, no sign-up, no advertising, no analytics, nothing sold. Saved spots stay in your browser on your device, because there is no server for them to go to. There is nothing to buy, and no way for a stranger to contact you through it.",
  "about.stance.offline": "It works where gardens are.",
  "about.stance.offlineBody":
    "Offline-first and installable, because the far end of a garden is exactly where a signal disappears. Everything but the live lookups keeps working with no connection at all.",
  "about.freeTitle": "Free, and free to reuse",
  "about.free":
    "Indigene is open source under the {licence}. That's a deliberate choice over a more restrictive licence: this is a civic tool built on public science, and a land trust, an extension office, a council or another app should be able to take it, adapt it, and run it without asking anyone's permission.",
  "about.mit": "MIT licence",
  "about.freeMoney":
    "There is no company here and nothing is monetised. That is also why the app is a single small download that runs in your browser rather than a service someone has to keep paying for.",
  "about.helpTitle": "Help make it better",
  "about.help":
    "The most useful thing you can send is a correction with a source behind it. All of it — the plant data, the scripts, every line that turns a number into a recommendation — is public at {repo}, and if something looks wrong you can {issue}. Asking for your own region to be covered is welcome too; that's how the map grows.",
} as const;

/** Every valid string key. Derived, so it can never drift from the strings. */
export type TKey = keyof typeof en;

/** The contract every other locale signs: exactly these keys, no more, no less. */
export type Dict = Record<TKey, string>;
