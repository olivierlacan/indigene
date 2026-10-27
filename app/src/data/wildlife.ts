// The "who does this feed" dataset — the specific insects and animals a native
// plant supports, so the app can be browsed by wildlife ("show me the plants
// that bring monarchs / hummingbirds / fireflies") and not only by the plant.
//
// Two parts, both auditable in this one file the way a plant row is:
//
//   1. WILDLIFE — the catalog. Each recognizable creature described once, in
//      plain words, with the animal's own name and (where it has one) its Latin
//      binomial. A "monarch" is a monarch everywhere, so the catalog is shared
//      across regions; only the plant ties differ by region.
//
//      **The blurb's first sentence is the card.** The index shows the opening
//      of this paragraph (`lead()` in `lib/prose.ts`) rather than a second,
//      shorter description written by hand — one that would have to be
//      translated and kept in step forever. So open with what the creature
//      *is*, in a sentence that stands on its own, and let the story follow.
//      `npm run blurbs:check` holds both ends: the opening card-sized, the
//      paragraph a paragraph (it was a 51-word median and a 101-word worst).
//
//   2. SUPPORT — the ties, keyed by region id, then by plant id, then a list of
//      links. Keyed by region because the same plant id can appear in two
//      regions (live oak spans both Florida lists) with a different local story.
//
// Honesty stance (same as everywhere else in Indigene):
//   - This is NOT every insect a plant supports. An oak alone is a larval host
//     to hundreds of moth species; the raw tally lives in `hostLepCount`. This
//     layer is the *notable, nameable, well-documented* relationships a gardener
//     would actually choose a plant for. The UI says so plainly.
//   - Every tie carries a `basis` — a dependable, citable source — and the app
//     shows it, so a claim like "milkweed is the monarch's only host" stays a
//     checkable fact, not folklore.
//   - `support` distinguishes raising the young (a larval `host` — the strongest
//     tie) from feeding or sheltering the adult, because they are not the same
//     promise and the app should never blur them.
//
// Sources leaned on throughout (full licensing in DATA_SOURCES.md):
//   - Xerces Society regional pollinator & specialist-bee lists
//   - NWF Native Plant Finder / Tallamy (Lepidoptera host records)
//   - Lady Bird Johnson Wildflower Center species pages
//   - Jarrod Fowler & Sam Droege, "Pollen Specialist Bees of the U.S."
//   - UF/IFAS & Florida Native Plant Society (Florida ties)
//   - Audubon & Cornell Lab of Ornithology (bird food records)
import type { SupportLink, Wildlife } from "../types";

// ---- The catalog: the animals themselves, described once ----
export const WILDLIFE: Wildlife[] = [
  // ---------------- Butterflies ----------------
  {
    id: "monarch",
    common: "Monarch butterfly",
    latin: "Danaus plexippus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The famous orange-and-black migrant. Its caterpillars can eat only one thing — milkweed — so no milkweed means no monarchs, full stop. The adults also refuel on many fall flowers on their long trip south.",
    native: true,
    nativeBasis: "Native across North America. Xerces Society; Butterflies and Moths of North America (BAMONA).",
    inat: { name: "Danaus plexippus", iconic: "Insecta" },
  },
  {
    id: "queen-butterfly",
    common: "Queen butterfly",
    latin: "Danaus gilippus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The monarch's deep-mahogany southern cousin, common in Florida year-round. Like the monarch, its caterpillars feed only on milkweeds.",
    native: true,
    nativeBasis: "Native to the southern US and southward. BAMONA; UF/IFAS.",
    inat: { name: "Danaus gilippus", iconic: "Insecta" },
  },
  {
    id: "eastern-black-swallowtail",
    common: "Black swallowtail",
    latin: "Papilio polyxenes",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big dark swallowtail whose caterpillars eat plants in the carrot family — including native golden alexanders, not just the parsley in your garden.",
    native: true,
    nativeBasis: "Native to North America. BAMONA.",
    inat: { name: "Papilio polyxenes", iconic: "Insecta" },
  },
  {
    id: "karner-blue",
    common: "Karner blue",
    latin: "Plebejus samuelis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small silver-blue butterfly of sandy oak-and-pine barrens whose caterpillars eat wild lupine and nothing else. Michigan is one of its last strongholds — lose the lupine and this endangered jewel goes with it.",
    native: true,
    nativeBasis: "Native to Great Lakes and northeastern sand barrens; federally endangered, with Michigan its stronghold. USFWS; Michigan Natural Features Inventory.",
    inat: { name: "Plebejus samuelis", iconic: "Insecta" },
  },
  {
    id: "eastern-tiger-swallowtail",
    common: "Eastern tiger swallowtail",
    latin: "Papilio glaucus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The large yellow-and-black swallowtail of eastern yards. Its caterpillars grow up on the leaves of several native trees, especially wild cherry and birch.",
    native: true,
    nativeBasis: "Native to eastern North America. BAMONA.",
    inat: { name: "Papilio glaucus", iconic: "Insecta" },
  },
  {
    id: "hackberry-emperor",
    common: "Hackberry emperor",
    latin: "Asterocampa celtis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A tawny-and-gray butterfly that lands on people to sip the salt in their sweat. Its caterpillars eat hackberry leaves and nothing else, so it lives wherever hackberry does.",
    native: true,
    nativeBasis: "Native to the eastern and central US. BAMONA.",
    inat: { name: "Asterocampa celtis", iconic: "Insecta" },
  },
  {
    id: "viceroy",
    common: "Viceroy butterfly",
    latin: "Limenitis archippus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The monarch look-alike — but its caterpillars grow up on willows, poplars, and cherries, overwintering rolled in a leaf they fasten to the twig.",
    native: true,
    nativeBasis: "Native to North America. BAMONA.",
    inat: { name: "Limenitis archippus", iconic: "Insecta" },
  },
  {
    id: "gulf-fritillary",
    common: "Gulf fritillary",
    latin: "Agraulis vanillae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brilliant orange butterfly with silver-spangled underwings. Its caterpillars feed only on passionflower vines.",
    native: true,
    nativeBasis: "Native and resident in the southern US. BAMONA; UF/IFAS.",
    inat: { name: "Agraulis vanillae", iconic: "Insecta" },
  },
  {
    id: "zebra-longwing",
    common: "Zebra longwing",
    latin: "Heliconius charithonia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Florida's state butterfly — long black wings striped in pale yellow, drifting slowly through shady spots. Its caterpillars eat only passionflower vines; the adults are unusual in eating pollen, which lets them live for months.",
    native: true,
    nativeBasis: "Native and resident in Florida — the designated state butterfly. UF/IFAS; BAMONA.",
    inat: { name: "Heliconius charithonia", iconic: "Insecta" },
  },
  {
    id: "atala",
    common: "Atala butterfly",
    latin: "Eumaeus atala",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small jewel — velvet black with iridescent blue flecks and a scarlet belly — once thought extinct in Florida. It came back with its only native host plant, the coontie. Plant coontie and you are quite literally rebuilding this butterfly.",
    native: true,
    nativeBasis: "Native to southeastern Florida. Florida Museum of Natural History; UF/IFAS.",
    inat: { name: "Eumaeus atala", iconic: "Insecta" },
  },
  {
    id: "white-peacock",
    common: "White peacock",
    latin: "Anartia jatrophae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A pale, low-flying butterfly of sunny damp openings in Florida. Its caterpillars feed on porterweed and water-hyssop.",
    native: true,
    nativeBasis: "Native and resident in the southern US and tropics. BAMONA; UF/IFAS.",
    inat: { name: "Anartia jatrophae", iconic: "Insecta" },
  },
  {
    id: "western-tiger-swallowtail",
    common: "Western tiger swallowtail",
    latin: "Papilio rutulus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The big yellow swallowtail of western gardens and streamsides, from British Columbia to San Diego. Its caterpillars feed on the leaves of willows, cottonwoods, sycamores, and bigleaf maple.",
    native: true,
    nativeBasis: "Native to western North America. BAMONA.",
    inat: { name: "Papilio rutulus", iconic: "Insecta" },
  },
  {
    id: "pale-swallowtail",
    common: "Pale swallowtail",
    latin: "Papilio eurymedon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A cream-and-black swallowtail of drier western slopes. Its caterpillars grow up on oceanspray and ceanothus.",
    native: true,
    nativeBasis: "Native to western North America. BAMONA.",
    inat: { name: "Papilio eurymedon", iconic: "Insecta" },
  },
  {
    id: "echo-azure",
    common: "Echo azure",
    latin: "Celastrina echo",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small powder-blue butterfly, one of the first on the wing in spring. Its caterpillars aren't fussy — they eat the flower buds of many native shrubs, oceanspray and ceanothus among the favorites.",
    native: true,
    nativeBasis: "Native to western North America. Washington Butterfly Association; Butterflies and Moths of North America (BAMONA).",
    inat: { name: "Celastrina echo", iconic: "Insecta" },
  },
  {
    id: "clodius-parnassian",
    common: "Clodius parnassian",
    latin: "Parnassius clodius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A ghostly white, black-spotted butterfly that drifts low through Northwest woods and meadows. Its caterpillars eat only bleeding heart, whose alkaloids make both the young and the adult distasteful to birds.",
    native: true,
    nativeBasis: "Native to western North America. Butterflies and Moths of North America (BAMONA); PSU Garden Ecology.",
    inat: { name: "Parnassius clodius", iconic: "Insecta" },
  },
  {
    id: "propertius-duskywing",
    common: "Propertius duskywing",
    latin: "Erynnis propertius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown skipper of the West's oak country — the Garry oak (Oregon white oak) prairies in the north, coast live oak woodland in California. Its caterpillars eat only oak, and it fades as those habitats do.",
    native: true,
    nativeBasis: "Native to the West's oak habitats. Xerces Society; BAMONA.",
    inat: { name: "Erynnis propertius", iconic: "Insecta" },
  },
  {
    id: "american-lady",
    common: "American lady",
    latin: "Vanessa virginiensis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "An orange-and-black butterfly with two big blue eyespots underneath. Its caterpillars eat everlastings and pussytoes, hiding in the woolly leaves and their own silk.",
    native: true,
    nativeBasis: "Native across North America. BAMONA; Xerces Society.",
    inat: { name: "Vanessa virginiensis", iconic: "Insecta" },
  },
  {
    id: "red-admiral",
    common: "Red admiral",
    latin: "Vanessa atalanta",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Black wings slashed with a scarlet band, and unusually bold — it will land on your arm. Its caterpillars live folded inside a nettle leaf, sewn shut with silk, which is why a patch of nettles left standing in a corner is worth more than it looks.",
    native: true,
    nativeBasis:
      "Native across North America, Europe and North Africa — one of the few butterflies at home on both sides of the Atlantic. BAMONA; INPN.",
    inat: { name: "Vanessa atalanta", iconic: "Insecta" },
  },
  {
    id: "silver-spotted-skipper",
    common: "Silver-spotted skipper",
    latin: "Epargyreus clarus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big brown skipper with one bright silver patch under each hind wing, flashing as it flies. It feeds fast and often, and its caterpillars grow up on native legumes inside a leaf they fold over themselves.",
    native: true,
    nativeBasis: "Native across eastern and central North America. BAMONA; Xerces Society.",
    inat: { name: "Epargyreus clarus", iconic: "Insecta" },
  },
  {
    id: "spicebush-swallowtail",
    common: "Spicebush swallowtail",
    latin: "Papilio troilus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A dark swallowtail dusted with blue-green, at home wherever spicebush and sassafras grow. Its caterpillar is one of the strangest things in an eastern garden: bright green with two huge false eyespots, hiding by day in a leaf it has rolled into a tube.",
    native: true,
    nativeBasis: "Native to eastern North America. BAMONA; Xerces Society.",
    inat: { name: "Papilio troilus", iconic: "Insecta" },
  },
  {
    id: "lorquins-admiral",
    common: "Lorquin's admiral",
    latin: "Limenitis lorquini",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A black butterfly with a white band and orange wingtips, and the habit of coming out to meet you. It will chase a bird, or a person, off its patch of streamside, then glide straight back to the same twig.",
    native: true,
    nativeBasis: "Native to the Pacific states and British Columbia. BAMONA; Xerces Society.",
    inat: { name: "Limenitis lorquini", iconic: "Insecta" },
  },
  {
    id: "anise-swallowtail",
    common: "Anise swallowtail",
    latin: "Papilio zelicaon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The yellow-and-black swallowtail of Californian hillsides, often seen circling the very top of a hill — the males gather on summits to wait for females. Its caterpillars eat carrot-family plants, and rear up to flick out a forked orange horn when something bothers them.",
    native: true,
    nativeBasis: "Native to western North America. BAMONA; Xerces Society.",
    inat: { name: "Papilio zelicaon", iconic: "Insecta" },
  },
  {
    id: "grass-skippers",
    common: "Skippers & wood nymphs",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The small orange skippers that dart around a meadow, and the soft brown wood nymphs and ringlets that drift through it. Their caterpillars eat grasses and sedges, and they spend the winter tucked down inside a native bunchgrass.",
    members: [
      "Cercyonis pegala",
      "Anatrytone logan",
      "Problema byssus",
      "Ochlodes sylvanoides",
      "Hylephila phyleus",
      "Aphantopus hyperantus",
      "Maniola jurtina",
      "Thymelicus sylvestris",
      "Ochlodes sylvanus",
      "Lethe diana",
      "Neope goschkevitschii",
      "Thoressa varia",
      "Lethe anthedon",
      "Coenonympha pamphilus",
    ],
    native: true,
    nativeBasis:
      "Native grass-feeding butterflies (Hesperiidae and the satyr group of Nymphalidae), in North America, Europe and Japan. BAMONA; Xerces Society; INPN (MNHN); European butterfly foodplant checklist (Dryad).",
  },
  {
    id: "greater-fritillaries",
    common: "Fritillaries & silverspots",
    latin: "Argynnis spp.",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The big orange butterflies of western meadows, their undersides spangled with silver. Every one of them grows up on violets and nothing else — and the female lays in late summer, on dry ground where the violets have already died back, for caterpillars that sleep out the winter before they eat.",
    members: ["Argynnis cybele", "Argynnis zerene", "Argynnis callippe", "Argynnis hydaspe"],
    native: true,
    nativeBasis:
      "Native greater fritillaries of North America (Argynnis, long known as Speyeria). Xerces Society; BAMONA; US Fish & Wildlife Service (Oregon silverspot recovery plan).",
    // A genus scope, like the bumble bees: "greater fritillaries near me" honestly
    // means the whole genus, not one arbitrary member of it.
    inat: { name: "Argynnis", iconic: "Insecta" },
  },
  {
    id: "mosses-elfin",
    common: "Moss's elfin",
    latin: "Callophrys mossii",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small gray-brown butterfly, easy to walk straight past, that flies in the first warm weeks of spring around rock outcrops, road cuts and bluffs. Its caterpillars eat native stonecrop and essentially nothing else, so it lives exactly where the stonecrop lives — a skin of soil over rock — and nowhere in between.",
    native: true,
    nativeBasis: "Native to western North America. Xerces Society; BAMONA.",
    inat: { name: "Callophrys mossii", iconic: "Insecta" },
  },
  {
    id: "buckwheat-butterflies",
    common: "Blues & hairstreaks",
    latin: "Icaricia, Callophrys & others",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The small butterflies of hot dry ground — thumbnail-sized blues, and green hairstreaks most people take for moths. A whole run of them raise their caterpillars on native buckwheats, several on nothing else, so a patch on a poor sunny bank is worth more than a border full of nectar.",
    members: ["Icaricia acmon", "Callophrys sheridanii", "Euphilotes enoptes", "Euphilotes battoides"],
    native: true,
    nativeBasis:
      "Native western blues and hairstreaks (acmon blue, Sheridan's green hairstreak and their relatives). Xerces Society; BAMONA.",
  },
  {
    id: "juniper-hairstreak",
    common: "Juniper & cypress hairstreaks",
    latin: "Callophrys gryneus",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "A butterfly the exact green of the foliage it sits on, which is why almost nobody sees one. Its caterpillars eat cypress and juniper and nothing else, so each race is stuck to its own tree — and the one on Tecate cypress has one of the smallest ranges of any butterfly in the country.",
    native: true,
    nativeBasis:
      "Native to North America. The southern-California races are the loki juniper hairstreak, on California juniper, and Thorne's hairstreak, on Tecate cypress. Xerces Society; BAMONA; US Fish & Wildlife Service (Thorne's hairstreak 12-month finding).",
    inat: { name: "Callophrys gryneus", iconic: "Insecta" },
  },
  {
    id: "pipevine-swallowtail",
    common: "Pipevine swallowtail",
    latin: "Battus philenor",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "A big butterfly whose upper wings flash iridescent blue-black in the sun and look plain the moment it lands in shade. Its caterpillars eat California pipevine and nothing else, take up the vine's poison and keep it \u2014 which is why they are scarlet, unhurried, and eaten by almost nothing.",
    native: true,
    nativeBasis:
      "Native to North America; the race on this coast is Battus philenor hirsuta, which lives where California pipevine grows and nowhere else. Xerces Society; BAMONA.",
    inat: { name: "Battus philenor", iconic: "Insecta" },
  },
  {
    id: "lupine-blues",
    common: "Lupine blues",
    latin: "Icaricia icarioides",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "Small silver-blue butterflies that live wherever the right lupines do, and nowhere in between. Around San Francisco Bay one of them is the mission blue, down to a few hills; its caterpillars feed on lupine leaves and then sleep out the whole dry summer at the base of the plant.",
    native: true,
    nativeBasis:
      "Native to western North America \u2014 Boisduval's blue and its local races, including the endangered mission blue (Icaricia icarioides missionensis) of the San Francisco Bay hills. Xerces Society; BAMONA; US Fish & Wildlife Service.",
    inat: { name: "Icaricia icarioides", iconic: "Insecta" },
  },
  {
    id: "painted-lady",
    common: "Painted lady",
    latin: "Vanessa cardui",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The most widespread butterfly on earth, and the one that crosses southern California in millions after a wet winter — a front of orange and black heading north. Its caterpillars live in little silk tents on mallows, thistles and lupines.",
    native: true,
    nativeBasis: "Native to North America, Europe, Japan and nearly everywhere else. BAMONA; Xerces Society.",
    inat: { name: "Vanessa cardui", iconic: "Insecta" },
  },
  {
    id: "california-dogface",
    common: "California dogface butterfly",
    latin: "Zerene eurydice",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "California's state butterfly, and one almost nobody has seen. The male's yellow forewing carries a dark poodle's-head marking — hence the name — over a wash of purple. It is fast and high-flying, and its caterpillars eat one shrub: California false indigo.",
    native: true,
    nativeBasis: "Endemic to California. Xerces Society; BAMONA; California Native Plant Society.",
    inat: { name: "Zerene eurydice", iconic: "Insecta" },
  },
  {
    id: "sonoran-blue",
    common: "Sonoran blue",
    latin: "Philotes sonorensis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A thumbnail-sized butterfly, blue above with two orange spots, that flies along southern California rock faces in February — among the year's earliest anywhere in the state. Its caterpillars burrow into the fleshy leaves of dudleyas, so it lives where those silver rosettes cling to a cliff.",
    native: true,
    nativeBasis: "Native to California and northern Baja California. Xerces Society; BAMONA.",
    inat: { name: "Philotes sonorensis", iconic: "Insecta" },
  },
  {
    id: "variable-checkerspot",
    common: "Variable checkerspot",
    latin: "Euphydryas chalcedona",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A chequered black, cream and brick-red butterfly of western hillsides, and a reliable garden visitor where sticky monkeyflower grows. The spiny black caterpillars feed together in a silk shelter, then rest out the dry summer half-grown and finish the following spring.",
    native: true,
    nativeBasis: "Native to western North America. Xerces Society; BAMONA.",
    inat: { name: "Euphydryas chalcedona", iconic: "Insecta" },
  },
  {
    id: "mourning-cloak",
    common: "Mourning cloak",
    latin: "Nymphalis antiopa",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A dark chocolate butterfly edged in ragged cream, with a line of blue spots inside the border. It is often the first butterfly of the year here, because it never left: it winters as an adult behind loose bark, out before a single flower opens. Its caterpillars feed on willow, cottonwood and birch.",
    native: true,
    nativeBasis:
      "Native across North America and Europe, where it is called the Camberwell beauty. BAMONA; Xerces Society; INPN (MNHN).",
    inat: { name: "Nymphalis antiopa", iconic: "Insecta" },
  },
  // ---- European butterflies (the France regions) ----
  {
    id: "brimstone",
    common: "Brimstone",
    latin: "Gonepteryx rhamni",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The big lemon-yellow butterfly that is, across most of France, the first one anybody sees each year. It winters as an adult — wings closed and shaped exactly like a leaf, tucked into ivy or holly — and its caterpillars eat buckthorns and nothing else.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Gonepteryx rhamni", iconic: "Insecta" },
  },
  {
    id: "cleopatra",
    common: "Cleopatra",
    latin: "Gonepteryx cleopatra",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The brimstone's southern sister — the same lemon yellow, with a burnt-orange flash across the forewing. Often the first thing flying in a southern French February, because the adults sleep through winter. Like the brimstone, its caterpillars eat only buckthorns.",
    native: true,
    nativeBasis: "Native to the Mediterranean basin, including southern France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Gonepteryx cleopatra", iconic: "Insecta" },
  },
  {
    id: "purple-hairstreak",
    common: "Purple hairstreak",
    latin: "Favonius quercus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small butterfly that lives its whole life in the top of an oak. It drinks the honeydew aphids leave on the leaves rather than visiting flowers, so hardly anyone notices it — look up under a big oak on a still July evening.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Favonius quercus", iconic: "Insecta" },
  },
  {
    id: "purple-emperor",
    common: "Purple emperor",
    latin: "Apatura iris",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big woodland butterfly whose males burn electric purple from one angle and plain brown from the next. It spends its days in the crowns of the tallest trees and ignores flowers completely, coming down for damp ground and oozing sap. Its caterpillar winters flat against a sallow twig, the exact color of the bark.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Apatura iris", iconic: "Insecta" },
  },
  {
    id: "holly-blue",
    common: "Holly blue",
    latin: "Celastrina argiolus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The pale silvery-blue butterfly flying high round a hedge or a wall in April, weeks before any other blue is out. Its two broods use different plants — holly in spring, ivy in summer — which is why it does well in towns.",
    native: true,
    nativeBasis: "Native across Europe and temperate Asia, Japan included. INPN (MNHN); European butterfly foodplant checklist (Dryad); HOSTS (Robinson et al., NHM) for Japan.",
    inat: { name: "Celastrina argiolus", iconic: "Insecta" },
  },
  {
    id: "duke-of-burgundy",
    common: "Duke of Burgundy",
    latin: "Hamearis lucina",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small chequered orange-and-brown butterfly that looks like a miniature fritillary without being one — it is Europe's only member of an otherwise tropical family. It has fallen away as meadows were tidied, and it is particular: the females lay only on cowslips and primroses.",
    native: true,
    nativeBasis: "Native across Europe, including France, and in long-term decline. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Hamearis lucina", iconic: "Insecta" },
  },
  {
    id: "two-tailed-pasha",
    common: "Two-tailed pasha",
    latin: "Charaxes jasius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The biggest butterfly in Europe and the most tropical-looking — brown with an orange border and two tails on each hindwing. It lives in the southern maquis, feeds on fallen fruit rather than flowers, and its caterpillars eat one plant only: the strawberry tree.",
    native: true,
    nativeBasis: "Native to the Mediterranean maquis, including Provence, the Var and Corsica. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Charaxes jasius", iconic: "Insecta" },
  },
  {
    id: "nettle-tree-butterfly",
    common: "Nettle-tree butterfly",
    latin: "Libythea celtis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown butterfly with wings cut into sharp notches and a long snout, so a resting one looks exactly like a dead leaf on a twig. It is one of Europe's longest-lived butterflies — nearly a year as an adult — and its caterpillars eat only the southern nettle tree.",
    native: true,
    nativeBasis: "Native to southern Europe, including Mediterranean France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Libythea celtis", iconic: "Insecta" },
  },
  {
    id: "orange-tip",
    common: "Orange-tip",
    latin: "Anthocharis cardamines",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "The male has bright orange wingtips and is unmistakable; the female has none and gets taken for a cabbage white all spring. Both settle with their wings shut, and the mottled green underside makes them vanish against a flower head \u2014 which is exactly where the female is laying.",
    native: true,
    nativeBasis:
      "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Anthocharis cardamines", iconic: "Insecta" },
  },
  {
    id: "marsh-fritillary",
    common: "Marsh fritillary",
    latin: "Euphydryas aurinia",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "A small, brilliantly chequered orange, cream and brown butterfly of damp unimproved grassland, and the only insect in Ireland protected by law. Its caterpillars hatch together on devil's-bit scabious, spin a silk tent over the plant, and spend the winter inside it in a black huddle.",
    native: true,
    nativeBasis:
      "Native across Ireland, Britain and continental Europe; listed on Annex II of the EU Habitats Directive and protected in Ireland. National Parks & Wildlife Service (Ireland); National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Euphydryas aurinia", iconic: "Insecta" },
  },
  {
    id: "cryptic-wood-white",
    common: "Cryptic wood white",
    latin: "Leptidea juvernica",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "A small, weak-flying white butterfly that drifts along hedge banks and roadsides rather than flying across them. It was only recognized as its own species in 2011, and in Britain and Ireland it lives only in Ireland \u2014 which makes it the closest thing the island has to a butterfly of its own.",
    native: true,
    nativeBasis:
      "Native to Ireland and eastern Europe; in these islands found only in Ireland. National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad); Butterfly Conservation.",
    inat: { name: "Leptidea juvernica", iconic: "Insecta" },
  },
  {
    id: "peacock-butterfly",
    common: "Peacock butterfly",
    latin: "Aglais io",
    kind: "butterfly",
    icon: "\u{1F98B}",
    blurb:
      "Four huge blue-and-black eyespots on a deep red wing, and a near-black underside so it disappears the moment it closes up. It winters as an adult in sheds and hollow trees, and hisses by rubbing its wings together if something disturbs it. Its caterpillars eat nettle and nothing else.",
    native: true,
    nativeBasis:
      "Native across Ireland, Britain and Europe. National Biodiversity Data Centre (Ireland); INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Aglais io", iconic: "Insecta" },
  },
  {
    id: "comma",
    common: "Comma butterfly",
    latin: "Polygonia c-album",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Ragged-edged and orange, with a small white comma mark underneath. It winters as an adult on a twig, where the torn outline makes it a dead leaf. Its caterpillars grow up on hops, nettles and elms.",
    native: true,
    nativeBasis: "Native across Europe and temperate Asia to Japan, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Polygonia c-album", iconic: "Insecta" },
  },
  {
    id: "common-blue",
    common: "Common blue",
    latin: "Polyommatus icarus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The small violet-blue butterfly of every French meadow and roadside — the male bright blue, the female brown with orange spots. Its caterpillars eat bird's-foot trefoil and its relatives, and ants often guard them for the sweet drops they give off.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Polyommatus icarus", iconic: "Insecta" },
  },
  {
    id: "large-blue",
    common: "Large blue",
    latin: "Phengaris arion",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A protected butterfly with one of the strangest lives in Europe. Its caterpillar eats wild thyme for a few weeks, then drops to the ground and is carried into a red ants' nest, where it spends ten months eating the ants' own young.",
    native: true,
    nativeBasis: "Native to Europe; protected in France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Phengaris arion", iconic: "Insecta" },
  },
  {
    id: "small-blue",
    common: "Small blue",
    latin: "Cupido minimus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "One of Europe's smallest butterflies — a sooty-brown thing the size of a fingernail, dusted with blue. Its caterpillars live inside the flower heads of kidney vetch, eating the developing seeds, and in Britain and Ireland they use no other plant.",
    native: true,
    nativeBasis: "Native across Europe, including France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Cupido minimus", iconic: "Insecta" },
  },
  {
    id: "small-copper",
    common: "Small copper",
    latin: "Lycaena phlaeas",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A little butterfly the color of a new coin — forewings burnished orange, edged in dark brown. It picks one warm stone and comes back to it all afternoon, launching at anything that flies over. Its caterpillars eat sorrels and docks, so it belongs to rough corners rather than tidy beds.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Lycaena phlaeas", iconic: "Insecta" },
  },
  {
    id: "white-letter-hairstreak",
    common: "White-letter hairstreak",
    latin: "Satyrium w-album",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small dark butterfly with a thin white W scrawled across the underwing, which is where its name comes from. It lives in the top of an elm and comes down so seldom that most people never learn it is there. It fell away with the elms, and comes back only where they do.",
    native: true,
    nativeBasis:
      "Native across Europe, including France, and in long-term decline with its host tree. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Satyrium w-album", iconic: "Insecta" },
  },
  {
    id: "green-hairstreak",
    common: "Green hairstreak",
    latin: "Callophrys rubi",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Europe's commonest green butterfly — and it never shows you the top of its wings. It rests with them shut, and the bright leaf-green underside makes it disappear against a shrub the instant it lands. Look on a sunny heath in April.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Callophrys rubi", iconic: "Insecta" },
  },
  {
    id: "silver-studded-blue",
    common: "Silver-studded blue",
    latin: "Plebejus argus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small blue butterfly of open heath, named for the tiny metallic flecks along its underwing. Its whole life runs through an ant: black ants drink the sweet liquid the caterpillar gives off, and carry and guard it in return. So it needs heather, ants, and the warm bare ground they nest in.",
    native: true,
    nativeBasis:
      "Native across Europe, including France; a heathland specialist in decline. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Plebejus argus", iconic: "Insecta" },
  },
  {
    id: "glanville-fritillary",
    common: "Glanville fritillary",
    latin: "Melitaea cinxia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "An orange-and-black chequered butterfly of warm rough grassland, at its best near the western coast. Its caterpillars live as a family: they hatch together on ribwort plantain, spin a shared silk tent, and spend the winter inside it as a huddle.",
    native: true,
    nativeBasis:
      "Native across Europe, including western France. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Melitaea cinxia", iconic: "Insecta" },
  },
  // ---------------- Moths ----------------
  {
    id: "luna-moth",
    common: "Luna moth",
    latin: "Actias luna",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The pale-green, long-tailed giant that seems too beautiful to be real. The adults never eat — they live about a week on the reserves the caterpillar stored eating tree leaves like birch, walnut, and hickory.",
    native: true,
    nativeBasis: "Native to eastern North America. BAMONA.",
    inat: { name: "Actias luna", iconic: "Insecta" },
  },
  {
    id: "rattlesnake-master-borer",
    common: "Rattlesnake-master borer moth",
    latin: "Papaipema eryngii",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A rare prairie moth whose caterpillars tunnel inside rattlesnake master and eat nothing else. It survives in a handful of old prairies, so every new patch of its plant counts.",
    native: true,
    nativeBasis: "Native to tallgrass prairie; endangered in Illinois. Illinois Natural History Survey; Illinois Endangered Species Protection Board.",
    inat: { name: "Papaipema eryngii", iconic: "Insecta" },
  },
  {
    id: "cecropia-moth",
    common: "Cecropia moth",
    latin: "Hyalophora cecropia",
    kind: "moth",
    icon: "🌙",
    blurb:
      "North America's largest native moth — a hand-sized, red-banded giant. Its caterpillars fatten on cherry, maple and birch before spinning a papery cocoon for winter.",
    native: true,
    nativeBasis: "Native to eastern and central North America. BAMONA.",
    inat: { name: "Hyalophora cecropia", iconic: "Insecta" },
  },
  {
    id: "hummingbird-clearwing",
    common: "Hummingbird clearwing moth",
    latin: "Hemaris thysbe",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A plump day-flying moth that hovers at flowers exactly like a tiny hummingbird, so most people never realize it's a moth. Its caterpillars feed on viburnum and honeysuckle; the adults sip nectar from tubular blooms.",
    native: true,
    nativeBasis: "Native to North America. BAMONA.",
    inat: { name: "Hemaris thysbe", iconic: "Insecta" },
  },
  {
    id: "california-yucca-moth",
    common: "California yucca moth",
    latin: "Tegeticula maculata",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A small pale moth that does something almost no other insect does: it pollinates on purpose. A female carries a ball of yucca pollen to another flower, lays her eggs there, and packs the pollen onto the stigma — making the seeds her caterpillars will eat. The yucca has no other pollinator.",
    native: true,
    nativeBasis: "Native to California and northern Baja California, on Hesperoyucca whipplei. Xerces Society; the yucca-moth literature (Pellmyr).",
    inat: { name: "Tegeticula maculata", iconic: "Insecta" },
  },
  {
    id: "ceanothus-silkmoth",
    common: "Ceanothus silkmoth",
    latin: "Hyalophora euryalus",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The West's great silkmoth — red-brown, as wide as a hand, with a white crescent on each wing. It flies at dusk in spring and never feeds as an adult: it has no working mouth, and lives a week or two on what the caterpillar stored on ceanothus and manzanita.",
    native: true,
    nativeBasis: "Native to western North America. BAMONA; Xerces Society.",
    inat: { name: "Hyalophora euryalus", iconic: "Insecta" },
  },
  // ---- European moths (the France regions) ----
  {
    id: "privet-hawk-moth",
    common: "Privet hawk-moth",
    latin: "Sphinx ligustri",
    kind: "moth",
    icon: "🌙",
    blurb:
      "One of France's biggest hawk-moths — pink-and-black barred, the size of a palm — that flies at dusk and hovers at scented flowers. Its caterpillar is just as startling: a fat bright-green thing with lilac stripes and a horn on its tail, grown fat on privet.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Sphinx ligustri", iconic: "Insecta" },
  },
  {
    id: "six-spot-burnet",
    common: "Six-spot burnet",
    latin: "Zygaena filipendulae",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A day-flying moth, glossy blue-black with six scarlet spots, drifting slowly over summer meadows. It has nothing to fear: it makes cyanide from the bird's-foot trefoil its caterpillars eat, and everything knows it.",
    native: true,
    nativeBasis: "Native across Europe, including France. INPN (MNHN).",
    inat: { name: "Zygaena filipendulae", iconic: "Insecta" },
  },
  {
    id: "poplar-hawk-moth",
    common: "Poplar hawk-moth",
    latin: "Laothoe populi",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The commonest big hawk-moth in France, and the strangest at rest: it holds its hindwings out in front of the forewings. A moth on a wall reads as a gray dead leaf put together wrong. The adult never eats: everything it needs it took in as a caterpillar, off poplar and willow leaves.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Laothoe populi", iconic: "Insecta" },
  },
  {
    id: "elephant-hawk-moth",
    common: "Elephant hawk-moth",
    latin: "Deilephila elpenor",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Pink and olive-green, like something from a much warmer country, hovering at honeysuckle after dark. The caterpillar is where the name comes from: a fat gray-brown thing as long as a finger, with a trunk-like snout it pulls in when touched — which swells four eyespots and makes it a small snake.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Deilephila elpenor", iconic: "Insecta" },
  },
  {
    id: "hummingbird-hawk-moth",
    common: "Hummingbird hawk-moth",
    latin: "Macroglossum stellatarum",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The moth everyone has seen and almost nobody believes: it hovers at a flower in broad daylight and gets reported every summer as a baby hummingbird. Its tongue is longer than its body, and it comes back to a good patch of flowers at the same hour the next day.",
    native: true,
    nativeBasis: "Native across Europe and the Mediterranean, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Macroglossum stellatarum", iconic: "Insecta" },
  },
  {
    id: "emperor-moth",
    common: "Emperor moth",
    latin: "Saturnia pavonia",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The heathland's silk moth — soft gray and pink, with a big eyespot on each of its four wings. The male flies fast in the April sunshine on feathered antennae that pick up a female's scent a kilometer away; she flies only at night.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Saturnia pavonia", iconic: "Insecta" },
  },
  // ---------------- Bees & other pollinators ----------------
  // Every bee here is a NATIVE bee. The introduced European honey bee
  // (Apis mellifera) is deliberately left out — the point is native plants
  // feeding native pollinators, not propping up a managed non-native.
  {
    id: "bumble-bees",
    common: "Bumble bees",
    latin: "Bombus spp.",
    kind: "bee",
    icon: "🐝",
    blurb:
      "The big fuzzy bees that fly cold and early. They shake pollen loose with a shiver of their flight muscles, which some native flowers depend on. They nest in the ground and in old grass tussocks, and a spring-to-frost run of flowers keeps a colony fed.",
    members: [
      "Bombus impatiens",
      "Bombus griseocollis",
      "Bombus bimaculatus",
      "Bombus vosnesenskii",
      "Bombus melanopygus",
      "Bombus pascuorum",
      "Bombus terrestris",
      "Bombus lapidarius",
      "Bombus pratorum",
      "Bombus pensylvanicus",
      "Bombus diversus",
      "Bombus ardens",
      "Bombus hypocrita",
    ],
    native: true,
    nativeBasis: "Native bumble bees (Bombus) — unlike the managed honey bee. Xerces Society; USGS Native Bee Inventory; INPN (MNHN) for Europe.",
    // A genus scope: iNaturalist returns every Bombus species, so "bumble bees
    // near you" honestly means the whole genus, not one arbitrary member.
    inat: { name: "Bombus", iconic: "Insecta" },
  },
  {
    id: "sunflower-specialist-bees",
    common: "Sunflower-family specialist bees",
    latin: "Andrena, Melissodes & others",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Dozens of native bees collect pollen from only the sunflower family — asters, coneflowers, goldenrods, sunflowers. If those plants vanish from a yard, these bees have nothing else to raise their young on, no matter how many other flowers bloom.",
    members: [
      "Andrena helianthi",
      "Andrena asteris",
      "Melissodes agilis",
      "Melissodes denticulatus",
      "Svastra obliqua",
      "Colletes daviesanus",
      "Heriades truncorum",
    ],
    native: true,
    nativeBasis: "Native solitary bees. Fowler & Droege, Pollen Specialist Bees; USGS Native Bee Inventory; INPN (MNHN) for the European members.",
  },
  {
    id: "mallow-specialist-bees",
    common: "Mallow specialist bees",
    latin: "Diadasia",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Fast, solitary ground-nesting bees that gather pollen from almost nothing but mallows. In the Willamette Valley one, Diadasia nigrifrons, rides on the native checkermallows — no checkermallow, no bee.",
    members: ["Diadasia nigrifrons", "Diadasia diminuta", "Diadasia enavata"],
    native: true,
    nativeBasis: "Native solitary bees; Diadasia are New World mallow specialists. Xerces Society; USDA Plant Guide (Sidalcea).",
    inat: { name: "Diadasia", iconic: "Insecta" },
  },
  {
    id: "mason-bees",
    common: "Mason & mining bees",
    latin: "Osmia, Andrena spp.",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Gentle, solitary early-spring bees — superb fruit pollinators — that emerge when the first native shrubs bloom. An early flower like red-flowering currant or willow is a lifeline the week they wake up.",
    members: [
      "Osmia lignaria",
      "Osmia bicornis",
      "Osmia cornuta",
      "Andrena erigeniae",
      "Andrena distans",
      "Andrena fulva",
      "Andrena clarkella",
      "Colletes hederae",
      "Andrena tarsata",
      "Andrena erythronii",
    ],
    native: true,
    nativeBasis: "Native Osmia and Andrena. Xerces Society; USGS Native Bee Inventory; BWARS and INPN (MNHN) for the European members.",
  },
  {
    id: "eastern-carpenter-bee",
    common: "Eastern carpenter bee",
    latin: "Xylocopa virginica",
    kind: "bee",
    icon: "🐝",
    blurb:
      "The big shiny-backed bee that looks like a bumble bee with a bald patch. It nests in dead wood rather than the ground, and it is strong enough to force open flowers most bees can't — or to bite a hole in the side of one too deep even for it.",
    native: true,
    nativeBasis: "Native to eastern North America. Xerces Society; USGS Native Bee Inventory.",
    inat: { name: "Xylocopa virginica", iconic: "Insecta" },
  },
  // ---------------- Birds ----------------
  {
    id: "ruby-throated-hummingbird",
    common: "Ruby-throated hummingbird",
    latin: "Archilochus colubris",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The East's only breeding hummingbird, drawn to red and orange tubular flowers it can reach and most insects can't. A succession of these blooms from spring through fall fuels both nesting and the long migration.",
    native: true,
    nativeBasis: "Native to eastern North America. Cornell Lab of Ornithology.",
    inat: { name: "Archilochus colubris", iconic: "Aves" },
  },
  {
    id: "chestnut-backed-chickadee",
    common: "Chestnut-backed chickadee",
    latin: "Poecile rufescens",
    kind: "bird",
    icon: "\u{1F426}",
    blurb:
      "A tiny bird with a chestnut back and a voice like a rusty hinge, tied to the damp conifer and oak country of this coast. It hunts caterpillars along the undersides of leaves all spring, and one nesting pair needs thousands of them to get a brood away.",
    native: true,
    nativeBasis:
      "Native to the Pacific coast from Alaska to central California. Cornell Lab of Ornithology; Audubon California.",
    inat: { name: "Poecile rufescens", iconic: "Aves" },
  },
  {
    id: "band-tailed-pigeon",
    common: "Band-tailed pigeon",
    latin: "Patagioenas fasciata",
    kind: "bird",
    icon: "🕊️",
    blurb:
      "The Northwest's native forest pigeon — bigger and wilder than a city pigeon, with a white half-collar. Flocks roam the canopy after fruit, and in western Oregon they live largely on elderberry and cascara.",
    native: true,
    nativeBasis: "Native to western North America. Washington Dept. of Fish & Wildlife; Cornell Lab of Ornithology.",
    inat: { name: "Patagioenas fasciata", iconic: "Aves" },
  },
  {
    id: "annas-rufous-hummingbird",
    common: "Anna's & rufous hummingbirds",
    latin: "Calypte anna, Selasphorus rufus",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The West's garden hummingbirds. The rufous times its migration to native currants coming into bloom, so an early red flower is fuel arriving when it's needed.",
    members: ["Calypte anna", "Selasphorus rufus"],
    native: true,
    nativeBasis: "Native to western North America. Cornell Lab of Ornithology.",
  },
  {
    id: "cedar-waxwing",
    common: "Cedar waxwing",
    latin: "Bombycilla cedrorum",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A sleek, sociable bird that lives on fruit and roves in flocks, stripping a serviceberry or dogwood clean in an afternoon. Berry shrubs that hold fruit into winter are what keep them around.",
    native: true,
    nativeBasis: "Native to North America. Cornell Lab of Ornithology.",
    inat: { name: "Bombycilla cedrorum", iconic: "Aves" },
  },
  {
    id: "american-goldfinch",
    common: "American goldfinch",
    latin: "Spinus tristis",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The bright yellow \"wild canary\" that nests late, in summer, so it can feed its young the seeds of native asters and coneflowers. Leaving seed heads standing through fall and winter is its winter pantry.",
    native: true,
    nativeBasis: "Native to North America. Cornell Lab of Ornithology.",
    inat: { name: "Spinus tristis", iconic: "Aves" },
  },
  {
    id: "yellow-rumped-warbler",
    common: "Yellow-rumped warbler",
    latin: "Setophaga coronata",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The one warbler that can digest waxy bayberry fruit, which lets it winter far further north — and all across the Southeast — than other warblers. Wax myrtle is the plant behind that trick (its old name was \"myrtle warbler\").",
    native: true,
    nativeBasis: "Native to North America. Cornell Lab of Ornithology.",
    inat: { name: "Setophaga coronata", iconic: "Aves" },
  },
  {
    id: "bushtit",
    common: "Bushtit",
    latin: "Psaltriparus minimus",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A gray scrap of a bird, about as heavy as five paperclips, that travels in chattering flocks of twenty and works a shrub over from the inside. Its nest is a soft hanging sock of lichen and spider silk, a foot long, that takes the pair a month to build.",
    native: true,
    nativeBasis: "Native to the western US and Mexico, resident year-round. Cornell Lab of Ornithology.",
    inat: { name: "Psaltriparus minimus", iconic: "Aves" },
  },
  {
    id: "lesser-goldfinch",
    common: "Lesser goldfinch",
    latin: "Spinus psaltria",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A tiny black-backed, lemon-bellied finch that lives on seed almost entirely — including the seed of the sages and sunflowers a dry-garden border is full of. Leave the spent flower heads standing and they will find them.",
    native: true,
    nativeBasis: "Native to the western US, Mexico and south to Peru. Cornell Lab of Ornithology.",
    inat: { name: "Spinus psaltria", iconic: "Aves" },
  },
  {
    id: "brown-headed-nuthatch",
    common: "Brown-headed nuthatch",
    latin: "Sitta pusilla",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A tiny gray-and-brown nuthatch that squeaks like a rubber duck and lives its whole life in southern pines. It is one of the very few birds that uses a tool — it will pick up a flake of bark and lever other bark off with it to get at the insects underneath.",
    native: true,
    nativeBasis:
      "Native to the pine woods of the southeastern US, and almost never found away from them. Cornell Lab of Ornithology; USFWS.",
    inat: { name: "Sitta pusilla", iconic: "Aves" },
  },
  {
    id: "acorn-birds",
    common: "Jays, turkeys & woodpeckers",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The acorn eaters, jays above all: blue jays in the east, scrub-jays in the west. A jay buries far more acorns than it ever eats, and the forgotten ones grow — so it doesn't just live off an oak, it plants the next one.",
    members: [
      "Cyanocitta cristata",
      "Aphelocoma californica",
      "Melanerpes formicivorus",
      "Meleagris gallopavo",
      "Aphelocoma coerulescens",
    ],
    native: true,
    nativeBasis: "Native birds (blue jay, California and Florida scrub-jays, acorn woodpecker, wild turkey). Cornell Lab of Ornithology.",
  },
  {
    id: "berry-songbirds",
    common: "Mockingbirds, cardinals & thrushes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The everyday songbirds that raise families on insects and then switch to fruit — beautyberry, elderberry, toyon, holly — to fatten up and get through the leaner months.",
    members: [
      "Mimus polyglottos",
      "Cardinalis cardinalis",
      "Turdus migratorius",
      "Catharus guttatus",
      "Dumetella carolinensis",
    ],
    native: true,
    nativeBasis: "Native birds (northern mockingbird, northern cardinal, thrushes). Cornell Lab of Ornithology.",
  },
  {
    id: "california-quail",
    common: "California quail",
    latin: "Callipepla californica",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The plump gray bird with a teardrop plume nodding off its forehead, running along the ground in a family party rather than flying. It lives in the bottom three feet of the world: low dense cover to hide in, bare ground to dust-bathe in, seeds within walking distance.",
    native: true,
    nativeBasis: "Native to California and the west coast. Cornell Lab of Ornithology; Audubon California.",
    inat: { name: "Callipepla californica", iconic: "Aves" },
  },
  {
    id: "california-gnatcatcher",
    common: "California gnatcatcher",
    latin: "Polioptila californica",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A tiny gray bird with a long black tail and a call like a kitten mewing, which lives in coastal sage scrub and nowhere else. It doesn't migrate, so it needs that habitat every day of its life — and most of the scrub is now houses.",
    native: true,
    nativeBasis: "Native to coastal southern California and Baja California; federally listed as threatened. US Fish & Wildlife Service; Cornell Lab of Ornithology.",
    inat: { name: "Polioptila californica", iconic: "Aves" },
  },
  // ---- European birds (the France regions) ----
  {
    id: "winter-thrushes",
    common: "Fieldfares, redwings & blackbirds",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The thrushes that arrive from the north each autumn and spend the winter roving in flocks, stripping one hedge and moving to the next. A hedge of haws, hips, sloes and rowan berries is what carries them — and the resident blackbirds and mistle thrushes — from November to March.",
    members: ["Turdus pilaris", "Turdus iliacus", "Turdus merula", "Turdus viscivorus", "Turdus torquatus"],
    native: true,
    nativeBasis: "Native European birds (fieldfare, redwing, blackbird, mistle thrush, ring ouzel). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    // Renamed from "mediterranean-warblers": the same birds winter on ivy and
    // elder along the Atlantic coast, so a Mediterranean name made an honest
    // Atlantic tie read as a mistake. The displayed name never changed.
    id: "blackcaps-warblers",
    common: "Blackcaps & warblers",
    kind: "bird",
    icon: "🐦",
    blurb:
      "Small insect-eating birds that switch to fruit for the autumn journey south, and then live on it all winter. That means ivy and holly on an Atlantic hedge, mastic and myrtle on a Mediterranean hillside — and a blackcap will hold one fruiting bush against every other bird for weeks.",
    members: ["Sylvia atricapilla", "Curruca melanocephala", "Sylvia borin", "Erithacus rubecula"],
    native: true,
    nativeBasis: "Native European birds (blackcap, Sardinian warbler, garden warbler, robin). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    id: "conifer-seed-finches",
    common: "Crossbills, siskins & redpolls",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The finches that live on tree seed right through the winter — crossbills, siskins and redpolls. The crossbill is the specialist: its beak crosses at the tip, a tool for prying a closed cone apart. The others take the smaller seed of hemlock, alder and birch.",
    members: ["Loxia curvirostra", "Spinus spinus", "Spinus pinus", "Acanthis flammea", "Acanthis cabaret"],
    native: true,
    nativeBasis: "Native seed-eating finches of the conifer forests of both Europe and North America (common/red crossbill, Eurasian and pine siskins, redpolls). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO); Cornell Lab of Ornithology.",
  },
  {
    id: "hawfinch",
    common: "Hawfinch",
    latin: "Coccothraustes coccothraustes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A heavy, shy finch with a bill so big it looks like a mistake. It isn't one: half the bird's head is the muscle that works it, and it splits a cherry stone clean open for the kernel. What you usually find is a scatter of halved stones under the tree.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
    inat: { name: "Coccothraustes coccothraustes", iconic: "Aves" },
  },
  {
    id: "goldfinches-linnets",
    common: "Goldfinches & linnets",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The small finches that live on the seed of wild flowers — goldfinches hanging upside down off a knapweed head, linnets and greenfinches going over in twittering parties. What they need is seed left standing through the winter: cut everything down in September and they go elsewhere.",
    members: ["Carduelis carduelis", "Linaria cannabina", "Chloris chloris", "Spinus spinus"],
    native: true,
    nativeBasis:
      "Native European finches (European goldfinch, common linnet, greenfinch, Eurasian siskin). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    id: "eurasian-jay",
    common: "Eurasian jay",
    latin: "Garrulus glandarius",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The pink-and-gray crow with a patch of barred sky-blue on its wing, heard screeching far more often than it is seen. Every autumn one jay buries a few thousand acorns, often hundreds of meters from the tree, and never comes back for them all — which is how oak woods climb hills.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
    inat: { name: "Garrulus glandarius", iconic: "Aves" },
  },
  {
    id: "spotted-nutcracker",
    common: "Spotted nutcracker",
    latin: "Nucifraga caryocatactes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A dark, white-speckled crow of the high Alpine forest, with one job. Each autumn it buries tens of thousands of arolla pine seeds across the mountainside, and the ones it forgets become the next forest — the seeds have no wings and cannot travel any other way.",
    native: true,
    nativeBasis: "Native to the Alps and the boreal conifer forests. INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
    inat: { name: "Nucifraga caryocatactes", iconic: "Aves" },
  },
  {
    id: "black-grouse",
    common: "Black grouse",
    latin: "Lyrurus tetrix",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The lyre-tailed bird of the Alpine treeline, whose males gather at dawn in spring to bubble and spar on the same ground their ancestors used. It is in trouble across the Alps, and its life runs through one plant: bilberry.",
    native: true,
    nativeBasis: "Native to the Alps and northern Europe; in decline and monitored in France. INPN (MNHN); Observatoire des Galliformes de Montagne.",
    inat: { name: "Lyrurus tetrix", iconic: "Aves" },
  },
  // ---------------- Mammals & others ----------------
  {
    id: "acorn-mammals",
    common: "Squirrels, deer & other mammals",
    kind: "mammal",
    icon: "🐿️",
    blurb:
      "Acorns and fleshy fruit are the fall calories that carry squirrels, chipmunks, deer, foxes, and even black bears into winter. A single mature oak or wild cherry is a food bank for the whole neighborhood of mammals.",
    members: [
      "Sciurus carolinensis",
      "Sciurus griseus",
      "Tamias striatus",
      "Odocoileus virginianus",
      "Urocyon cinereoargenteus",
      "Ursus americanus",
    ],
    native: true,
    nativeBasis: "Native mammals (tree squirrels, white-tailed deer, foxes, black bear). IUCN Red List; Smithsonian.",
  },
  {
    id: "hazel-dormouse",
    common: "Hazel dormouse",
    latin: "Muscardinus avellanarius",
    kind: "mammal",
    icon: "🐿️",
    blurb:
      "A golden, furry-tailed little climber with enormous black eyes that sleeps through more of the year than it is awake. It almost never crosses open ground, so it needs hedges and woodland edges joined up, and it fattens on hazelnuts. What you find is the shell it opened: a neat round hole.",
    native: true,
    nativeBasis: "Native to western and central Europe, including France, where it is a protected species. INPN (MNHN); IUCN Red List.",
    inat: { name: "Muscardinus avellanarius", iconic: "Mammalia" },
  },
  {
    id: "gopher-tortoise",
    common: "Gopher tortoise",
    latin: "Gopherus polyphemus",
    kind: "mammal",
    icon: "🐢",
    blurb:
      "A keystone digger of Florida's dry uplands whose long burrows shelter hundreds of other species. It grazes low native growth — saw palmetto berries, sunshine mimosa, dune sunflower — in the open, sandy pine flatwoods it needs.",
    native: true,
    nativeBasis: "Native to the southeastern US; a state-protected keystone species. USFWS; IUCN Red List.",
    // Kind is "mammal" (it browses under "Mammals & others"), but it's a reptile —
    // hence the explicit Reptilia iconic taxon, which `kind` can't supply.
    inat: { name: "Gopherus polyphemus", iconic: "Reptilia" },
  },
  // ---------------- New Zealand ----------------
  // The first animals south of the equator. Each is native (most found nowhere
  // else); the silvereye flew in from Australia on its own in the 1850s, which
  // is why New Zealand counts it as native.
  {
    id: "tui",
    common: "Tūī",
    latin: "Prosthemadera novaeseelandiae",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A glossy blue-black honeyeater with a white tuft at its throat, and the loudest voice in a New Zealand garden. Its brush-tipped tongue is built for nectar, so it follows the flowering — kōwhai in spring, flax and pōhutukawa in summer — pollinating as it goes.",
    native: true,
    nativeBasis: "Endemic to New Zealand. New Zealand Birds Online (Te Papa; Birds New Zealand).",
    inat: { name: "Prosthemadera novaeseelandiae", iconic: "Aves" },
  },
  {
    id: "kereru",
    common: "Kererū",
    latin: "Hemiphaga novaeseelandiae",
    kind: "bird",
    icon: "🐦",
    blurb:
      "New Zealand's big native pigeon, whose wingbeats you hear before you see it. It is the last bird left that can swallow the largest native fruits whole, so karaka, pūriri and tawa now depend on it to spread their seed.",
    native: true,
    nativeBasis: "Endemic to New Zealand. New Zealand Birds Online (Te Papa; Birds New Zealand).",
    inat: { name: "Hemiphaga novaeseelandiae", iconic: "Aves" },
  },
  {
    id: "tauhou",
    common: "Tauhou (silvereye)",
    latin: "Zosterops lateralis",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A small olive bird with a white ring round each eye, which crossed the Tasman on its own in the 1850s. Flocks work through gardens for nectar, berries and insects, and it is New Zealand's commonest native bird.",
    native: true,
    nativeBasis: "Self-introduced from Australia around 1856, and classed as native. New Zealand Birds Online (Te Papa; Birds New Zealand).",
    inat: { name: "Zosterops lateralis", iconic: "Aves" },
  },
  {
    id: "puriri-moth",
    common: "Pūriri moth",
    latin: "Aenetus virescens",
    kind: "moth",
    icon: "🌙",
    blurb:
      "New Zealand's largest moth, bright green and as wide as a hand. It spends up to six years as a caterpillar tunneling inside a living tree and a day or two as an adult; the sign is a neat hole in the trunk, hidden under a web of chewed bark.",
    native: true,
    nativeBasis: "Endemic to the North Island. Manaaki Whenua – Landcare Research; Te Ara – the Encyclopedia of New Zealand.",
    inat: { name: "Aenetus virescens", iconic: "Insecta" },
  },
  {
    id: "kawakawa-looper",
    common: "Kawakawa looper",
    latin: "Cleora scriptaria",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The moth whose caterpillars make the round holes in almost every kawakawa leaf. The caterpillar loops along like an inchworm and hides so well on the stem that the holes are usually all you see.",
    native: true,
    nativeBasis: "Endemic to New Zealand. Manaaki Whenua – Landcare Research.",
    inat: { name: "Cleora scriptaria", iconic: "Insecta" },
  },
  {
    id: "kowhai-moth",
    common: "Kōwhai moth",
    latin: "Uresiphita maorialis",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A brown moth whose green, black-spotted caterpillars feed in loose webs on kōwhai leaves. They can strip a young tree in late summer; it almost always leafs out again, and the caterpillars feed birds while they last.",
    native: true,
    nativeBasis: "Endemic to New Zealand. Manaaki Whenua – Landcare Research.",
    inat: { name: "Uresiphita maorialis", iconic: "Insecta" },
  },
  {
    id: "nz-coppers",
    common: "New Zealand coppers",
    latin: "Lycaena",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Small, quick, fire-colored butterflies found nowhere else, which raise their caterpillars on pōhuehue and its wiry relatives. Plant the vine on a sunny bank and the coppers find it.",
    members: ["Lycaena salustius", "Lycaena boldenarum", "Lycaena rauparaha", "Lycaena feredayi"],
    native: true,
    nativeBasis: "New Zealand's Lycaena coppers are all endemic. Manaaki Whenua – Landcare Research; Gibbs, New Zealand Butterflies.",
    inat: { name: "Lycaena", iconic: "Insecta" },
  },
  {
    id: "nz-native-bees",
    common: "New Zealand native bees",
    kind: "bee",
    icon: "🐝",
    blurb:
      "About two dozen kinds of small bees, almost all found nowhere else, that nest alone in bare, sunny soil. Mānuka, kānuka and hebe are their mainstays, and a patch of bare clay bank helps them as much as a flower.",
    members: ["Leioproctus fulvescens", "Lasioglossum sordidum", "Hylaeus relegatus", "Leioproctus maritimus"],
    native: true,
    nativeBasis: "Native bees of the genera Leioproctus, Lasioglossum, Hylaeus and relatives. Donovan, Fauna of New Zealand 57 (Apoidea); Manaaki Whenua – Landcare Research.",
  },
  // ---------------- Central Texas ----------------
  {
    id: "american-snout",
    common: "American snout",
    latin: "Libytheana carinenta",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown-and-orange butterfly with a long beak-like snout, which makes a resting one look like a dead leaf. Its caterpillars eat only hackberry, and in a wet year millions stream across Texas at once.",
    native: true,
    nativeBasis: "Native to the southern US and south into South America. BAMONA; Texas Parks and Wildlife.",
    inat: { name: "Libytheana carinenta", iconic: "Insecta" },
  },
  {
    id: "phaon-crescent",
    common: "Phaon crescent",
    latin: "Phyciodes phaon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small orange-and-black butterfly that skims low over lawns and ditches across the South. Its caterpillars eat frogfruit, so where a lawn is left a little wild, phaons follow.",
    native: true,
    nativeBasis: "Native to the southern US, Mexico and the Caribbean. BAMONA.",
    inat: { name: "Phyciodes phaon", iconic: "Insecta" },
  },
  {
    id: "black-chinned-hummingbird",
    common: "Black-chinned hummingbird",
    latin: "Archilochus alexandri",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The hummingbird that nests in the Texas Hill Country, from March to September, the male flashing a purple band under a black chin. It lives on red and orange tubular flowers and the small insects it catches between them.",
    native: true,
    nativeBasis: "Native to western North America, nesting east to the Texas Hill Country. Cornell Lab of Ornithology.",
    inat: { name: "Archilochus alexandri", iconic: "Aves" },
  },
  // ---- Auckland, from Plant-SyNZ's moth records ----
  {
    id: "forest-semilooper",
    common: "Forest semilooper",
    latin: "Declana floccosa",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A grey moth patterned so like lichen that it vanishes against the bark of a native tree. Its caterpillars eat the leaves of many trees and shrubs, and look like a twig or a bird dropping while they do.",
    native: true,
    nativeBasis: "Endemic to New Zealand. Manaaki Whenua – Landcare Research (Plant-SyNZ); iNaturalist's New Zealand checklist.",
    inat: { name: "Declana floccosa", iconic: "Insecta" },
  },
  // ---- The Kantō Plain ----
  // Chosen from the caterpillar–host records HOSTS (Robinson et al., NHM)
  // holds for Japan, ranked by how many of the Kantō plants each one uses,
  // and kept to animals a gardener there could name and find.
  {
    id: "great-purple-emperor",
    common: "Great purple emperor",
    latin: "Sasakia charonda",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Japan's national butterfly, a big gliding emperor whose males flash violet in the sun. Its caterpillars eat only hackberry leaves, and spend the winter in the leaf litter at the foot of the tree.",
    native: true,
    nativeBasis: "Native to Japan, Korea and China. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Sasakia charonda", iconic: "Insecta" },
  },
  {
    id: "chinese-windmill",
    common: "Chinese windmill",
    latin: "Byasa alcinous",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A black swallowtail with a red-spotted body that flies slowly and doesn't hide. Its caterpillars eat birthwort and take up its poison, so birds learn to leave the adults alone.",
    native: true,
    nativeBasis: "Native to Japan, Korea and China. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Byasa alcinous", iconic: "Insecta" },
  },
  {
    id: "pallas-sailer",
    common: "Pallas' sailer",
    latin: "Neptis sappho",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small black-and-white butterfly that sails along woodland edges in a few flaps and a long glide. Its caterpillars grow up on pea-family shrubs and vines like wisteria and bush clover.",
    native: true,
    nativeBasis: "Native from eastern Europe to Japan. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Neptis sappho", iconic: "Insecta" },
  },
  {
    id: "japanese-oak-silkmoth",
    common: "Japanese oak silkmoth",
    latin: "Antheraea yamamai",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A big yellow-brown silk moth with a clear window in each wing. Its caterpillars feed on oak and chestnut and spin a green cocoon, once gathered for a rare, pale-green silk.",
    native: true,
    nativeBasis: "Native to Japan, Korea and China. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Antheraea yamamai", iconic: "Insecta" },
  },
  {
    id: "squeaking-silkmoth",
    common: "Squeaking silkmoth",
    latin: "Rhodinia fugax",
    kind: "moth",
    icon: "🌙",
    blurb:
      "An autumn silk moth whose caterpillar squeaks when you touch it. It eats oak, chestnut and cherry leaves, then hangs a bright green cocoon from a twig.",
    native: true,
    nativeBasis: "Native to Japan, Korea, China and the Russian Far East. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Rhodinia fugax", iconic: "Insecta" },
  },
  {
    id: "oak-hairstreaks",
    common: "Oak hairstreaks",
    latin: "Japonica, Favonius & others",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Small, jewel-bright hairstreaks that live up in the oak canopy and fly at dusk in early summer. Their caterpillars eat only oak buds and leaves, so a stand of konara oak keeps a whole set of them.",
    native: true,
    nativeBasis: "Native hairstreaks of Japan's oak woods (orange hairstreak, Favonius and Antigius hairstreaks). Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    members: ["Japonica lutea", "Japonica saepestriata", "Favonius orientalis", "Antigius attilia"],
  },
  {
    id: "chinese-bushbrown",
    common: "Chinese bushbrown",
    latin: "Mycalesis gotama",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brown butterfly with a row of eyespots that keeps to shady grass at the woodland edge. Its caterpillars eat grasses, Japanese silver grass among them.",
    native: true,
    nativeBasis: "Native from India to Japan. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Mycalesis gotama", iconic: "Insecta" },
  },
  {
    id: "california-sister",
    common: "California sister",
    latin: "Adelpha californica",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big dark butterfly with a white band and an orange patch at each wingtip, gliding high around live oaks. Its caterpillars eat only oak leaves, mostly of the evergreen live oaks, and look like tiny green dragons.",
    native: true,
    nativeBasis: "Native to California, southern Oregon, western Nevada and Baja California. BAMONA.",
    inat: { name: "Adelpha californica", iconic: "Insecta" },
  },
  {
    id: "mournful-duskywing",
    common: "Mournful duskywing",
    latin: "Erynnis tristis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A dark brown skipper with a bright white fringe on its hind wings, flying around oaks almost all year in California. Its caterpillars eat oak leaves inside a folded shelter they stitch with silk.",
    native: true,
    nativeBasis: "Native from California and the Southwest south to Central America. BAMONA.",
    inat: { name: "Erynnis tristis", iconic: "Insecta" },
  },
  {
    id: "behrs-metalmark",
    common: "Behr's metalmark",
    latin: "Apodemia virgulti",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small checkered butterfly of orange, black and white that perches with wings spread on California buckwheat. Its caterpillars eat buckwheat leaves and hide by day in a silk shelter at the base of the plant.",
    native: true,
    nativeBasis: "Native to southern California and Baja California. BAMONA; Butterflies of America.",
    inat: { name: "Apodemia virgulti", iconic: "Insecta" },
  },
  {
    id: "tawny-emperor",
    common: "Tawny emperor",
    latin: "Asterocampa clyton",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A warm-orange cousin of the hackberry emperor whose caterpillars also eat only hackberry. They hatch in clusters and feed side by side, then spend the winter as small caterpillars curled in a dead leaf.",
    native: true,
    nativeBasis: "Native to the eastern and central US and northern Mexico. BAMONA.",
    inat: { name: "Asterocampa clyton", iconic: "Insecta" },
  },
  {
    id: "horaces-duskywing",
    common: "Horace's duskywing",
    latin: "Erynnis horatius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A dusky brown skipper that rarely strays far from oaks, where its caterpillars eat the leaves. It flies from early spring to fall, often stopping to bask with its wings spread flat.",
    native: true,
    nativeBasis: "Native across the eastern and southern US, Florida and Texas included. BAMONA.",
    inat: { name: "Erynnis horatius", iconic: "Insecta" },
  },
  {
    id: "bordered-patch",
    common: "Bordered patch",
    latin: "Chlosyne lacinia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small black butterfly with a bold band of orange or cream across its wings, common in Texas summers. Its caterpillars feed in groups on sunflowers and their kin.",
    native: true,
    nativeBasis: "Native from the southwestern US through Mexico to Argentina. BAMONA.",
    inat: { name: "Chlosyne lacinia", iconic: "Insecta" },
  },
  {
    id: "ceraunus-blue",
    common: "Ceraunus blue",
    latin: "Hemiargus ceraunus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A tiny blue butterfly of sunny dry ground in Texas and Florida. Its caterpillars eat the flower buds and young pods of plants in the pea family, from mesquite to partridge pea.",
    native: true,
    nativeBasis: "Native to the southern US, Mexico and the Caribbean. BAMONA.",
    inat: { name: "Hemiargus ceraunus", iconic: "Insecta" },
  },
  {
    id: "red-banded-hairstreak",
    common: "Red-banded hairstreak",
    latin: "Calycopis cecrops",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small gray hairstreak with a red-orange stripe under each wing, common in southern woods and yards. Its caterpillars crawl through the fallen leaves under sumac and wax myrtle, eating them where they lie — so leave the leaf litter.",
    native: true,
    nativeBasis: "Native to the southeastern US, west to Texas. BAMONA.",
    inat: { name: "Calycopis cecrops", iconic: "Insecta" },
  },
  {
    id: "henrys-elfin",
    common: "Henry's elfin",
    latin: "Callophrys henrici",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown butterfly of early spring, one of the first on the wing. Its caterpillars eat the flowers and young fruit of redbud and, in the Hill Country, Texas persimmon and Mexican buckeye.",
    native: true,
    nativeBasis: "Native to eastern North America, west to central Texas. BAMONA.",
    inat: { name: "Callophrys henrici", iconic: "Insecta" },
  },
  {
    id: "soapberry-hairstreak",
    common: "Soapberry hairstreak",
    latin: "Phaeostrymon alcestis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small gray-brown hairstreak whose caterpillars eat only western soapberry. Where there are no soapberry trees, there are no soapberry hairstreaks.",
    native: true,
    nativeBasis: "Native to the south-central and southwestern US and northern Mexico. BAMONA.",
    inat: { name: "Phaeostrymon alcestis", iconic: "Insecta" },
  },
  {
    id: "theona-checkerspot",
    common: "Theona checkerspot",
    latin: "Thessalia theona",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small checkered orange-and-cream butterfly of dry Texas brush. Its caterpillars eat cenizo and paintbrushes, and it flies in waves after summer rains, just when cenizo blooms.",
    native: true,
    nativeBasis: "Native to Texas, the desert Southwest and Mexico. BAMONA.",
    inat: { name: "Thessalia theona", iconic: "Insecta" },
  },
  {
    id: "zebra-swallowtail",
    common: "Zebra swallowtail",
    latin: "Eurytides marcellus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A pale swallowtail striped black and white, with long sword-like tails. Its caterpillars eat only pawpaws, so it lives where pawpaws grow.",
    native: true,
    nativeBasis: "Native to the eastern US, Florida included. BAMONA; UF/IFAS.",
    inat: { name: "Eurytides marcellus", iconic: "Insecta" },
  },
  {
    id: "palamedes-swallowtail",
    common: "Palamedes swallowtail",
    latin: "Papilio palamedes",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big dark swallowtail of southern swamps, with a yellow band across its wings. Its caterpillars feed on redbay and its kin, and the adults crowd buttonbush and pickerelweed for nectar.",
    native: true,
    nativeBasis: "Native to the southeastern US coastal plain. BAMONA; UF/IFAS.",
    inat: { name: "Papilio palamedes", iconic: "Insecta" },
  },
  {
    id: "io-moth",
    common: "Io moth",
    latin: "Automeris io",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A yellow silk moth that flashes two big eyespots on its hind wings when disturbed. Its spiny green caterpillars sting, and they eat the leaves of many trees, red maple and willow among them.",
    native: true,
    nativeBasis: "Native to eastern North America, Florida included. BAMONA; UF/IFAS.",
    inat: { name: "Automeris io", iconic: "Insecta" },
  },
  {
    id: "southeastern-blueberry-bee",
    common: "Southeastern blueberry bee",
    latin: "Habropoda laboriosa",
    kind: "bee",
    icon: "🐝",
    blurb:
      "A fast, fuzzy native bee that collects pollen almost only from blueberry flowers. It buzzes the pollen loose in early spring and lives only a few weeks, timed to the bloom.",
    native: true,
    nativeBasis: "Native to the southeastern US. Fowler & Droege, Pollen Specialist Bees of the U.S.; USDA ARS.",
    inat: { name: "Habropoda laboriosa", iconic: "Insecta" },
  },
  {
    id: "cloudless-sulphur",
    common: "Cloudless sulphur",
    latin: "Phoebis sennae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big, bright lemon-yellow butterfly that sails fast and high across Florida gardens all year. Its caterpillars eat sennas and partridge pea, and turn yellow or green to match the flowers or leaves they feed on.",
    native: true,
    nativeBasis: "Native from the southern US to South America. BAMONA; UF/IFAS.",
    inat: { name: "Phoebis sennae", iconic: "Insecta" },
  },
  {
    id: "long-tailed-skipper",
    common: "Long-tailed skipper",
    latin: "Urbanus proteus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brown skipper with a shimmering blue-green back and two long tails. Its caterpillars fold leaves of wild beans and butterfly pea into shelters and feed inside.",
    native: true,
    nativeBasis: "Native from the southern US to Argentina. BAMONA; UF/IFAS.",
    inat: { name: "Urbanus proteus", iconic: "Insecta" },
  },
  {
    id: "common-buckeye",
    common: "Common buckeye",
    latin: "Junonia coenia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brown butterfly with big eyespots on every wing, often seen basking on bare ground. Its caterpillars eat low plants such as wild petunias and plantains.",
    native: true,
    nativeBasis: "Native across the southern US, Florida included. BAMONA; UF/IFAS.",
    inat: { name: "Junonia coenia", iconic: "Insecta" },
  },
  {
    id: "spanish-moth",
    common: "Spanish moth",
    latin: "Xanthopastis regnatrix",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A moth with pink and black wings flecked with gold, like a flamenco dress. Its black-and-yellow-banded caterpillars eat the leaves of native swamp lilies and spider lilies.",
    native: true,
    nativeBasis: "Native to Florida, the Caribbean and Central and South America. UF/IFAS Featured Creatures.",
    inat: { name: "Xanthopastis regnatrix", iconic: "Insecta" },
  },
  {
    id: "polka-dot-wasp-moth",
    common: "Polka-dot wasp moth",
    latin: "Syntomeida epilais",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A metallic blue-black moth with white dots and a red-tipped body, which flies by day like a wasp. Its caterpillars ate native devil's potato long before oleander arrived.",
    native: true,
    nativeBasis: "Native to Florida and the Caribbean. UF/IFAS Featured Creatures.",
    inat: { name: "Syntomeida epilais", iconic: "Insecta" },
  },
  {
    id: "red-squirrel",
    common: "Red squirrel",
    latin: "Sciurus vulgaris",
    kind: "mammal",
    icon: "🐿️",
    blurb:
      "Europe's own tree squirrel, russet to nearly black, with tufted ears in winter. It lives on tree seed: it strips a pine or spruce cone to a bare core, scale by scale, and buries nuts it partly forgets — planting trees as it goes.",
    native: true,
    nativeBasis: "Native across Europe and northern Asia, including all of metropolitan France, where it is protected. INPN (MNHN); IUCN Red List.",
    inat: { name: "Sciurus vulgaris", iconic: "Mammalia" },
  },
  {
    id: "pine-hawk-moth",
    common: "Pine hawk-moth",
    latin: "Sphinx pinastri",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A big ash-gray hawk-moth of conifer woods, streaked with black, that rests by day flat against pine bark and all but disappears. Its caterpillar is striped green and white like a pine needle, and feeds on pine, spruce and larch.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN).",
    inat: { name: "Sphinx pinastri", iconic: "Insecta" },
  },
  {
    id: "tau-emperor",
    common: "Tau emperor",
    latin: "Aglia tau",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A tawny-orange silk moth with a white T inside a blue-black eyespot on each wing. Males race through beech woods on April mornings looking for the females, which wait on the trunks. The caterpillars feed mostly on beech.",
    native: true,
    nativeBasis: "Native to the broadleaf woods of Europe, including France. INPN (MNHN).",
    inat: { name: "Aglia tau", iconic: "Insecta" },
  },
  {
    id: "apollo",
    common: "Apollo",
    latin: "Parnassius apollo",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big white butterfly of sunny Alpine slopes, its wings marked with black and with red, black-ringed spots. It is protected across Europe, and its caterpillars eat only stonecrops and houseleeks growing on warm rock and scree.",
    native: true,
    nativeBasis: "Native to the mountains of Europe, including the French Alps, Massif Central and Pyrenees; protected in France and listed on Annex IV of the EU Habitats Directive. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Parnassius apollo", iconic: "Insecta" },
  },
  {
    id: "sea-buckthorn-hawk-moth",
    common: "Sea-buckthorn hawk-moth",
    latin: "Hyles hippophaes",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A rare olive-and-pink hawk-moth of the gravel beds of Alpine rivers, where sea buckthorn grows. Its caterpillar eats sea buckthorn and nothing else, so the moth lives only where a river still floods, shifts its gravel and lets the shrub take hold.",
    native: true,
    nativeBasis: "Native from southeastern France and northern Italy eastward into Asia; in France found mainly along Alpine rivers, and protected by law. INPN (MNHN); EU Habitats Directive, Annex IV.",
    inat: { name: "Hyles hippophaes", iconic: "Insecta" },
  },
  {
    id: "coal-crested-tits",
    common: "Coal & crested tits",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The small tits of the mountain conifer forest — the coal tit with its white nape patch, the crested tit with its pointed black-and-white crest. They live in the canopy all year, picking insects off the needles and hiding conifer seed in bark cracks for winter.",
    members: ["Periparus ater", "Lophophanes cristatus"],
    native: true,
    nativeBasis: "Native European birds of conifer forest (coal tit, crested tit), including the French Alps. INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    id: "white-admiral",
    common: "White admiral",
    latin: "Limenitis camilla",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A black woodland butterfly with a bold white band across each wing, gliding through dappled shade with barely a wingbeat. Its caterpillars eat honeysuckle growing in shade, and spend the winter rolled inside a single leaf tied to the stem.",
    native: true,
    nativeBasis: "Native across temperate Europe and Asia to Japan, including northern, western and eastern France. INPN (MNHN); Butterfly Conservation; HOSTS (Robinson et al., NHM) for its Japanese food plants.",
    inat: { name: "Limenitis camilla", iconic: "Insecta" },
  },
  {
    id: "brown-hairstreak",
    common: "Brown hairstreak",
    latin: "Thecla betulae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brown-and-orange butterfly of blackthorn hedges that flies late in summer and is seldom seen. The easier thing to find is its egg: a tiny white dot in the fork of a blackthorn twig, waiting there all winter.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Thecla betulae", iconic: "Insecta" },
  },
  {
    id: "black-veined-white",
    common: "Black-veined white",
    latin: "Aporia crataegi",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A large white butterfly whose wings are drawn over in fine black veins, like tracing paper. Its caterpillars spend the winter together in a silk tent on hawthorn or blackthorn, and the adults gather on thistles and damp ground in June.",
    native: true,
    nativeBasis: "Native across Europe, including most of France (now gone from Britain). INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Aporia crataegi", iconic: "Insecta" },
  },
  {
    id: "chalkhill-blue",
    common: "Chalkhill blue",
    latin: "Lysandra coridon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A pale, milky-blue butterfly of short chalk and limestone grassland, sometimes in hundreds on one slope. Its caterpillars eat horseshoe vetch and nothing else, and ants tend them through the night for the sweet drops they give off.",
    native: true,
    nativeBasis: "Native across Europe on limestone and chalk, including northern and eastern France. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Lysandra coridon", iconic: "Insecta" },
  },
  {
    id: "marbled-white",
    common: "Marbled white",
    latin: "Melanargia galathea",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A black-and-white chequered butterfly of tall summer grassland, and despite its looks a cousin of the browns. Its caterpillars eat grasses, and the adults feed on purple flowers — knapweed, scabious, thistles.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad).",
    inat: { name: "Melanargia galathea", iconic: "Insecta" },
  },
  {
    id: "large-scabious-mining-bee",
    common: "Large scabious mining bee",
    latin: "Andrena hattorfiana",
    kind: "bee",
    icon: "🐝",
    blurb:
      "A big solitary bee that raises its young only on scabious pollen. The female often carries a dusting of pink pollen, and some females have a red belly. No scabious in the meadow, no bee.",
    native: true,
    nativeBasis: "Native across Europe, including France; in decline with flower-rich meadows. INPN (MNHN); BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018).",
    inat: { name: "Andrena hattorfiana", iconic: "Insecta" },
  },
  {
    id: "dark-green-fritillary",
    common: "Dark green fritillary",
    latin: "Argynnis aglaja",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big, fast orange fritillary of open hillsides, dunes and rough grassland. Underneath, its hindwings are washed green and spotted with silver. Its caterpillars eat violets, and the adults stop mostly at thistles and knapweed.",
    native: true,
    nativeBasis: "Native across Ireland, Britain, Europe and temperate Asia. Butterfly Conservation; National Biodiversity Data Centre (Ireland).",
    inat: { name: "Argynnis aglaja", iconic: "Insecta" },
  },
  {
    id: "silver-washed-fritillary",
    common: "Silver-washed fritillary",
    latin: "Argynnis paphia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A large orange fritillary of sunny woodland rides, gliding between bramble flowers in July. Its underside is washed with silver-green streaks. The female lays on tree bark beside violets, and the caterpillars climb down to them in spring.",
    native: true,
    nativeBasis: "Native across Ireland, Britain, Europe and temperate Asia. Butterfly Conservation; National Biodiversity Data Centre (Ireland).",
    inat: { name: "Argynnis paphia", iconic: "Insecta" },
  },
  {
    id: "small-tortoiseshell",
    common: "Small tortoiseshell",
    latin: "Aglais urticae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A bright orange butterfly edged with blue spots, often the first one out on a warm spring day. It winters as an adult in sheds and houses, and its caterpillars eat only nettles.",
    native: true,
    nativeBasis: "Native across Ireland, Britain, Europe and temperate Asia. Butterfly Conservation; National Biodiversity Data Centre (Ireland).",
    inat: { name: "Aglais urticae", iconic: "Insecta" },
  },
  {
    id: "winter-moths",
    common: "Winter moths",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Small moths that fly in Japan's coldest months, when few birds or bats are hunting. The females have no working wings and climb the trunk to lay; the caterpillars hatch with the spring leaves.",
    members: ["Inurois punctigera", "Inurois fletcheri", "Inurois tenuis", "Inurois fumosa", "Alsophila japonensis", "Erannis golda"],
    native: true,
    nativeBasis: "Native winter-flying geometer moths of Japan (Inurois, Alsophila, Erannis). Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records their Japanese food plants.",
  },
  {
    id: "pale-oak-beauty",
    common: "Pale oak beauty",
    latin: "Hypomecis punctinalis",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A grey-brown moth patterned like bark, which spends the day pressed flat against a trunk. Its looper caterpillars eat the leaves of many broadleaf trees, from oak and maple to zelkova.",
    native: true,
    nativeBasis: "Native from Europe to Japan. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Hypomecis punctinalis", iconic: "Insecta" },
  },
  {
    id: "feathered-thorn",
    common: "Feathered thorn",
    latin: "Colotois pennaria",
    kind: "moth",
    icon: "🌙",
    blurb:
      "An orange-brown moth of late autumn whose males have feathery antennae and come to lit windows on cold nights. Its caterpillars look like twigs and eat maple, oak and viburnum leaves in spring.",
    native: true,
    nativeBasis: "Native from Europe to Japan. Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records its Japanese food plants.",
    inat: { name: "Colotois pennaria", iconic: "Insecta" },
  },
  {
    id: "alder-hairstreak",
    common: "Alder hairstreak",
    latin: "Neozephyrus japonicus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small hairstreak whose males shine metallic green, living wherever alders grow in wet lowland woods. Its caterpillars eat alder leaves, and it is Saitama's prefectural butterfly.",
    native: true,
    nativeBasis: "Native to Japan, Korea, China and the Russian Far East. Not in GRIIS Japan's register of introductions; Saito et al. 2016, Larval host records of butterflies in Japan.",
    inat: { name: "Neozephyrus japonicus", iconic: "Insecta" },
  },
  {
    id: "indian-fritillary",
    common: "Indian fritillary",
    latin: "Argynnis hyperbius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "An orange fritillary whose female has black wingtips crossed by a white band. Its caterpillars eat only violets, and it has spread north into the Kantō as winters have warmed.",
    native: true,
    nativeBasis: "Native from Africa and southern Asia to Japan. Not in GRIIS Japan's register of introductions; Saito et al. 2016, Larval host records of butterflies in Japan.",
    inat: { name: "Argynnis hyperbius", iconic: "Insecta" },
  },
  {
    id: "common-bluebottle",
    common: "Common bluebottle",
    latin: "Graphium sarpedon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A fast black butterfly with a band of bright turquoise panes across each wing — a swallowtail without the tails. Its caterpillars eat camphor and other laurel-family trees, so street trees raise it in central Tokyo.",
    native: true,
    nativeBasis: "Native from India and Australia to Japan. Not in GRIIS Japan's register of introductions; Saito et al. 2016, Larval host records of butterflies in Japan.",
    inat: { name: "Graphium sarpedon", iconic: "Insecta" },
  },
  {
    id: "japanese-white-eye",
    common: "Japanese white-eye (mejiro)",
    latin: "Zosterops japonicus",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A small olive-green songbird with a bright white ring round each eye, common in Japanese parks and gardens. In winter it drinks from camellia and plum flowers, carrying their pollen, and it eats berries the rest of the year.",
    native: true,
    nativeBasis: "Native to Japan, Korea and eastern China. Not in GRIIS Japan's register of introductions; Cornell Lab of Ornithology, Birds of the World.",
    inat: { name: "Zosterops japonicus", iconic: "Aves" },
  },
  {
    id: "brown-eared-bulbul",
    common: "Brown-eared bulbul (hiyodori)",
    latin: "Hypsipetes amaurotis",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A noisy grey bird with a long tail and a chestnut patch on each cheek, at home in every Japanese town. It eats fruit and nectar all year, and spreads the seeds of many native trees.",
    native: true,
    nativeBasis: "Native to Japan, Korea and Taiwan. Not in GRIIS Japan's register of introductions; Cornell Lab of Ornithology, Birds of the World.",
    inat: { name: "Hypsipetes amaurotis", iconic: "Aves" },
  },
  {
    id: "spindle-ermines",
    common: "Spindle ermine moths",
    latin: "Yponomeuta spp.",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Small white moths dotted with black like ermine fur, whose caterpillars live together in shared silk tents. A tent can wrap a whole spindle bush in early summer; the bush leafs out again afterwards.",
    members: ["Yponomeuta tokyonella", "Yponomeuta kanaiella", "Yponomeuta polystigmellus", "Yponomeuta menkeni", "Yponomeuta yanagawana"],
    native: true,
    nativeBasis: "Native ermine moths of Japan, among them the Tokyo ermine (Yponomeuta tokyonella). Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records their Japanese food plants.",
    inat: { name: "Yponomeuta", iconic: "Insecta" },
  },
  {
    id: "moon-moths",
    common: "Moon moths",
    latin: "Actias spp.",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Big pale-green silk moths with long trailing tails on their hindwings. Their caterpillars eat cherry, alder, chestnut and oak, and the adults live about a week without eating.",
    members: ["Actias artemis", "Actias gnoma"],
    native: true,
    nativeBasis: "Native moon moths of Japan (Actias artemis/aliena and the alder moon moth, Actias gnoma). Not in GRIIS Japan's register of introductions; HOSTS (Robinson et al., NHM) records their food plants.",
    inat: { name: "Actias", iconic: "Insecta" },
  },
  {
    id: "red-spotted-admiral",
    common: "Red-spotted admiral",
    latin: "Limenitis arthemis",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A blue-black forest butterfly of eastern North America, close kin of the viceroy. In the south it mimics the bitter-tasting pipevine swallowtail; in the north it wears a broad white band and is called the white admiral. Its caterpillars, dressed as bird droppings, eat cherry, birch and poplar leaves.",
    native: true,
    nativeBasis: "Native to eastern and northern North America; the white admiral is its northern form. BAMONA.",
    inat: { name: "Limenitis arthemis", iconic: "Insecta" },
  },
  {
    id: "spring-azures",
    common: "Spring & summer azures",
    latin: "Celastrina spp.",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Small sky-blue butterflies, among the first out each spring, often before the leaves. Their caterpillars eat the flower buds of dogwoods and viburnums, and ants tend them for the sugary drops they give off.",
    members: ["Celastrina ladon", "Celastrina lucia", "Celastrina neglecta"],
    native: true,
    nativeBasis: "Native to eastern and northern North America. BAMONA; Wagner, Caterpillars of Eastern North America.",
    inat: { name: "Celastrina", iconic: "Insecta" },
  },
  {
    id: "eastern-pine-elfin",
    common: "Eastern pine elfin",
    latin: "Callophrys niphon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown butterfly patterned like pine bark, flying in April and May. Its caterpillars eat only the new needles of pines, so a stand of young pines can hold a colony nobody notices.",
    native: true,
    nativeBasis: "Native to eastern North America, from Nova Scotia and the Great Lakes to Florida. BAMONA.",
    inat: { name: "Callophrys niphon", iconic: "Insecta" },
  },
  {
    id: "banded-hairstreak",
    common: "Banded hairstreak",
    latin: "Satyrium calanus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small dark-brown butterfly with thin tails and fine white-edged bands, perched on sunny leaves at the edge of oak woods in early summer. Its caterpillars eat the new leaves of oaks, hickories and walnuts.",
    native: true,
    nativeBasis: "Native to eastern North America. BAMONA.",
    inat: { name: "Satyrium calanus", iconic: "Insecta" },
  },
  {
    id: "baltimore-checkerspot",
    common: "Baltimore checkerspot",
    latin: "Euphydryas phaeton",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A black, orange and white butterfly of wet meadows, named for the colors on Lord Baltimore's coat of arms. Its caterpillars grow up together in silk webs on turtlehead, then spend the winter in the leaf litter below it.",
    native: true,
    nativeBasis: "Native to eastern North America. BAMONA; Xerces Society.",
    inat: { name: "Euphydryas phaeton", iconic: "Insecta" },
  },
  {
    id: "kirtlands-warbler",
    common: "Kirtland's warbler",
    latin: "Setophaga kirtlandii",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A gray-and-yellow songbird that nests on the ground under young jack pines, mostly in northern Lower Michigan. Once down to under 200 singing males, it recovered as jack pine was replanted and burned, and left the endangered list in 2019.",
    native: true,
    nativeBasis: "Native to North America: breeds in Michigan, Wisconsin and Ontario, winters in the Bahamas. US Fish & Wildlife Service; Cornell Lab of Ornithology.",
    inat: { name: "Setophaga kirtlandii", iconic: "Aves" },
  },
  {
    id: "magpie-moth",
    common: "Magpie moth",
    latin: "Nyctemera annulata",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A black-and-white moth with an orange-ringed body that flies by day, found only in New Zealand. Its hairy caterpillars, the woolly bears, feed on groundsels and their relatives.",
    native: true,
    nativeBasis: "Endemic to New Zealand. Manaaki Whenua – Landcare Research (Plant-SyNZ); iNaturalist's New Zealand checklist.",
    inat: { name: "Nyctemera annulata", iconic: "Insecta" },
  },
  {
    id: "nz-leafrollers",
    common: "Native leafroller moths",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Small brown moths whose caterpillars roll a leaf into a silk tube and feed inside it. Many native plants feed them, from hebes to tree ferns, and the caterpillars in turn feed insect-eating birds.",
    members: ["Ctenopseustis obliquana", "Ctenopseustis herana", "Ctenopseustis servana", "Planotortrix excessana", "Planotortrix octo", "Pyrgotis plagiatana", "Harmologa oblongana", "Epalxiphora axenana"],
    native: true,
    nativeBasis: "Endemic leafrollers of New Zealand (Ctenopseustis, Planotortrix, Pyrgotis and relatives). Manaaki Whenua – Landcare Research (Plant-SyNZ).",
  },
  {
    id: "fern-loopers",
    common: "Fern loopers",
    latin: "Ischalis",
    kind: "moth",
    icon: "🌙",
    blurb:
      "Moths found only in New Zealand whose looper caterpillars eat fern fronds, tree ferns included. A fern-filled shady corner is a home for them.",
    members: ["Ischalis variabilis", "Ischalis gallaria", "Ischalis nelsonaria"],
    native: true,
    nativeBasis: "Ischalis is endemic to New Zealand. Manaaki Whenua – Landcare Research (Plant-SyNZ).",
    inat: { name: "Ischalis", iconic: "Insecta" },
  },
  {
    id: "pine-white",
    common: "Pine white",
    latin: "Neophasia menapia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A white butterfly with black-edged wings that lives high in the conifers, drifting around the crowns in late summer. Its caterpillars eat needles — pine above all, Douglas-fir and grand fir too — then lower themselves on silk threads to pupate.",
    native: true,
    nativeBasis: "Native to western North America, from British Columbia to California. BAMONA; Pyle, Butterflies of Cascadia.",
    inat: { name: "Neophasia menapia", iconic: "Insecta" },
  },
  {
    id: "douglas-squirrel",
    common: "Douglas squirrel",
    latin: "Tamiasciurus douglasii",
    kind: "mammal",
    icon: "🐿️",
    blurb:
      "A small, loud red-brown squirrel of the Northwest's conifer forests that scolds anyone who comes near its tree. It cuts green cones all autumn, stores them in damp piles, and lives on the seed all winter.",
    native: true,
    nativeBasis: "Native to the Pacific Northwest, from southwestern British Columbia to northern California. IUCN Red List; Washington Department of Fish & Wildlife.",
    inat: { name: "Tamiasciurus douglasii", iconic: "Mammalia" },
  },
  {
    id: "polyphemus-moth",
    common: "Polyphemus moth",
    latin: "Antheraea polyphemus",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A huge tan silkmoth with a see-through eyespot on each hind wing, flashed at anything that disturbs it. Its caterpillars grow fat and green on oak, maple, willow and birch; the adult has no working mouth and lives about a week.",
    native: true,
    nativeBasis: "Native across North America from southern Canada to Mexico, including the Pacific Northwest. BAMONA; Pacific Northwest Moths (Western Washington University).",
    inat: { name: "Antheraea polyphemus", iconic: "Insecta" },
  },
  {
    id: "california-tortoiseshell",
    common: "California tortoiseshell",
    latin: "Nymphalis californica",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "An orange butterfly with black spots and dark borders, famous for boom years when swarms of them pour across mountain passes. Its caterpillars eat ceanothus and little else, and the adults winter tucked under bark or in rock crevices.",
    native: true,
    nativeBasis: "Native to western North America, from British Columbia to Baja California. BAMONA; Pyle, Butterflies of Cascadia.",
    inat: { name: "Nymphalis californica", iconic: "Insecta" },
  },
  {
    id: "west-coast-lady",
    common: "West Coast lady",
    latin: "Vanessa annabella",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "An orange-and-black butterfly, the painted lady's smaller western cousin, that stays put instead of migrating. Its caterpillars eat mallows — checkermallow, bush mallow — inside a little tent of silk and leaf.",
    native: true,
    nativeBasis: "Native to western North America, from British Columbia to Mexico. BAMONA.",
    inat: { name: "Vanessa annabella", iconic: "Insecta" },
  },
  {
    id: "gray-hairstreak",
    common: "Gray hairstreak",
    latin: "Strymon melinus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small blue-gray butterfly with thin tails and an orange spot on each hind wing. It rubs the tails together so a bird strikes a fake head, and its caterpillars eat the flowers and seeds of many plants, mallows and peas above all.",
    native: true,
    nativeBasis: "Native across North America, from southern Canada to South America. BAMONA.",
    inat: { name: "Strymon melinus", iconic: "Insecta" },
  },
  {
    id: "white-lined-sphinx",
    common: "White-lined sphinx",
    latin: "Hyles lineata",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A fast, heavy hawk moth with a pink band on each hind wing, often seen hovering at flowers at dusk like a hummingbird. Its big caterpillars eat fireweeds, evening primroses and many other plants.",
    native: true,
    nativeBasis: "Native across North America and south to Central America. BAMONA.",
    inat: { name: "Hyles lineata", iconic: "Insecta" },
  },
  {
    id: "small-pearl-bordered-fritillary",
    common: "Small pearl-bordered fritillary",
    latin: "Boloria selene",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small orange fritillary of damp, flowery grassland, bracken slopes and woodland clearings, flying low in June. Its caterpillars eat violets. It is still widespread in Scotland, while it declines fast further south.",
    native: true,
    nativeBasis: "Native across Britain, Europe, temperate Asia and North America; absent from Ireland. Butterfly Conservation.",
    inat: { name: "Boloria selene", iconic: "Insecta" },
  },
  {
    id: "scotch-argus",
    common: "Scotch argus",
    latin: "Erebia aethiops",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A dark chocolate-brown butterfly with orange-ringed eyespots, flying over tall, wet grassland in August. In Britain it lives almost only in Scotland. Its caterpillars eat purple moor-grass, and the adults fly only when the sun is out.",
    native: true,
    nativeBasis: "Native to Scotland, two sites in northern England, and the hills and mountains of Europe; absent from Ireland. Butterfly Conservation.",
    inat: { name: "Erebia aethiops", iconic: "Insecta" },
  },
  {
    id: "coral-hairstreak",
    common: "Coral hairstreak",
    latin: "Satyrium titus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown butterfly with no tails and a row of coral-red spots under each hind wing. Its caterpillars eat wild cherry and plum, feeding at night, and the adults crowd onto milkweed flowers in July.",
    native: true,
    nativeBasis: "Native across much of the United States and southern Canada. BAMONA.",
    inat: { name: "Satyrium titus", iconic: "Insecta" },
  },
];

// ---- The ties: region → plant id → the animals that plant supports ----
//
// Read a line as a sentence: in `mid-atlantic`, `asclepias-tuberosa` (butterfly
// weed) is a `host` for the `monarch`, "because …", per `basis`.
export const SUPPORT: Record<string, Record<string, SupportLink[]>> = {
  "mid-atlantic": {
    "cercis-canadensis": [
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", reliance: "narrow", note: "Redbud flowers open before the leaves and are shaped to be pushed apart by something heavy. The carpenter bee is heavy enough — and where it isn't bothered, it bites a slit in the base and drinks through that instead.", basis: "GloBI — iNaturalist observation records, Symbiota Collections of Arthropods Network (SCAN); Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A redbud in April is one of the first big meals of the year for queens that have just come out of hibernation with a nest to start.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "silver-spotted-skipper", support: "nectar", note: "Buttonbush's flower is a pincushion of long white tubes, and a skipper can work one sphere for a full minute without moving.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records; Xerces Society." },
      { wildlifeId: "red-admiral", support: "nectar", note: "In July a buttonbush on a pond edge holds more butterflies at once than anything else in a wet garden.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records." },
      { wildlifeId: "spicebush-swallowtail", support: "nectar", note: "Big swallowtails feed at it with their wings still beating, working round the sphere as they go.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in the mid-summer gap when spring is over and the goldenrod hasn't started.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "hamamelis-virginiana": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Witch hazel leaves feed the caterpillars of North America's largest moth — a green giant as thick as a thumb by the time it spins up.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Hale et al. 2024 (Phil. Trans. R. Soc. B); NWF Native Plant Finder." },
      { wildlifeId: "luna-moth", support: "host", note: "Luna moth caterpillars take witch hazel too, one of a short list of trees they'll accept.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NWF Native Plant Finder." },
    ],
    "physocarpus-opulifolius": [
      { wildlifeId: "red-admiral", support: "nectar", note: "Ninebark's little domed flower clusters come out in June and are worked over by butterflies, beetles and small bees at the same time.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow open flowers, so a short-tongued solitary bee gets at the nectar as easily as a long-tongued one.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "ceanothus-americanus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "New Jersey tea flowers in the heat of early July, in froths of white that bees find from a long way off.", basis: "GloBI — iNaturalist observation records, Thessen 2014 associations from the Encyclopedia of Life; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its nectar sits out in the open on a tiny cup, which is why so many small solitary bees and wasps can use it.", basis: "GloBI — Thessen 2014, associations text-mined from the Encyclopedia of Life; Xerces Society." },
    ],
    "geranium-maculatum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "One mining bee, Andrena distans, collects pollen from wild geranium and very little else — it flies for the few weeks the geranium is out, and then it is gone for the year.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville, Snow Entomological Museum (University of Kansas); Fowler & Droege." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An early woodland-edge flower, out while the trees are still bare and the light still reaches the ground.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "packera-aurea": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Golden ragwort is a sunflower-family bloom in April, months before the asters and goldenrods — which makes it one of the few early sources for the bees that can only use that family's pollen.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Fowler & Droege." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small mining and mason bees work the flat yellow heads while they are provisioning their spring nests.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "schizachyrium-scoparium": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Little bluestem is what the wood nymphs and several skippers grow up eating, and the caterpillars spend the winter down inside the tussock. Cut it flat in autumn and you cut next summer's butterflies with it.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), HOSTS (Robinson et al., NHM); Xerces Society." },
    ],
    "andropogon-gerardii": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Big bluestem is the byssus skipper's caterpillar grass — a butterfly that has followed the tallgrass prairie into whatever is left of it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "panicum-virgatum": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Switchgrass raises the Delaware skipper — a small orange butterfly whose caterpillars live in a tube of grass blade sewn together with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Virginia creeper's blue-black berries hang on their scarlet stalks long after the leaves have gone, and a waxwing flock will clear a wall of them in an afternoon.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Hale et al. 2024 (Phil. Trans. R. Soc. B); Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and woodpeckers take them too, through the autumn and into the winter.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Cornell Lab." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild strawberries are tiny and intensely sweet, and robins and thrushes get to almost all of them before anyone else does.", basis: "GloBI — Hurlbert et al. 2021 Avian Diet Database, Hale et al. 2024 (Phil. Trans. R. Soc. B); Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "White five-petaled flowers low to the ground, open from April, and among the first things a bumble bee queen can reach.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "quercus-alba": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Sweet white-oak acorns are prime food for wild turkeys, wood ducks, and acorn-caching blue jays.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "One of the best mast trees there is — squirrels, deer, and bears fatten on the autumn acorn drop.", basis: "USDA Silvics of North America." },
      { wildlifeId: "luna-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths; oak is a dependable luna host.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "quercus-rubra": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Heavy acorn crops feed jays, turkeys, and woodpeckers through fall and winter.", basis: "USDA Silvics of North America." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Reliable acorn mast for squirrels, deer, and other mammals.", basis: "USDA Silvics of North America." },
      { wildlifeId: "cecropia-moth", support: "host", note: "Oaks are among the many trees whose leaves feed cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "prunus-serotina": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Wild cherry is one of the tiger swallowtail's main larval trees.", basis: "NWF Native Plant Finder; LBJ Wildflower Center." },
      { wildlifeId: "cecropia-moth", support: "host", note: "A classic host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Besides willows and poplars, viceroy caterpillars sometimes use cherries.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer cherries are devoured by dozens of songbirds, from thrushes to catbirds.", basis: "Cornell Lab; LBJ Wildflower Center." },
      { wildlifeId: "red-spotted-admiral", support: "host", note: "Wild cherry is one of the red-spotted admiral's favorite hosts.", basis: "GloBI — iNaturalist observation records; Wagner, Caterpillars of Eastern North America." },
    ],
    "betula-nigra": [
      { wildlifeId: "luna-moth", support: "host", note: "Birch is a favored luna moth caterpillar tree.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Among the birches and other trees the tiger swallowtail's caterpillars accept.", basis: "NWF Native Plant Finder." },
    ],
    "acer-rubrum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Maples are a staple host for cecropia caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "zizia-aurea": [
      { wildlifeId: "eastern-black-swallowtail", support: "host", reliance: "narrow", note: "A native carrot-family plant and a true host for black swallowtail caterpillars — not just a nectar stop.", basis: "LBJ Wildflower Center; Xerces." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flat-topped yellow flowers are an accessible spring nectar source for emerging bees.", basis: "Xerces mid-Atlantic list." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed — one of the only plants monarch caterpillars can eat, and a favorite egg-laying choice.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The bright orange flowers are a heavy nectar draw for bumble bees and many other pollinators.", basis: "Xerces Society." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of damp ground and a key monarch host and nectar plant.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flower clusters are rich in nectar for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "echinacea-purpurea": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A sunflower-family bloom whose pollen feeds the specialist bees that can use nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Left standing, the spent cones are a favorite winter seed head for goldfinches.", basis: "Cornell Lab; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long-blooming summer nectar source for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "rudbeckia-fulgida": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A composite whose pollen supports sunflower-family specialist bees.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the dark seed heads through fall and winter.", basis: "Cornell Lab." },
    ],
    "monarda-fistulosa": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a bee and butterfly favorite; hummingbirds visit now and then.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "A top nectar flower for the hummingbird clearwing moth.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees are among its heaviest visitors.", basis: "Xerces Society." },
    ],
    "symphyotrichum-novae-angliae": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters host a suite of aster-specialist bees; this is one of the best.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Late purple bloom is critical fall fuel for southbound monarchs.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Fine seed heads feed goldfinches into winter.", basis: "Cornell Lab." },
    ],
    "solidago-rugosa": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrods carry more pollen-specialist bees than almost any other plant.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "A powerhouse of late-season nectar for migrating monarchs.", basis: "Xerces Society." },
    ],
    "eutrochium-purpureum": [
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "Tall mauve flower heads are a magnet for clearwing moths and butterflies.", basis: "Xerces Society; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big domed clusters are heavily worked by bumble bees.", basis: "Xerces Society." },
    ],
    "aquilegia-canadensis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Red nodding spurs bloom in spring exactly as ruby-throats arrive; a classic hummingbird flower.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "lobelia-cardinalis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Vivid red tubes are shaped for a hummingbird's bill and are one of its most important native nectar plants.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "penstemon-digitalis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "White tubular flowers are a strong late-spring nectar and pollen source for bumble bees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its bloom overlaps the season solitary mason and mining bees are provisioning nests.", basis: "Xerces Society." },
    ],
    "baptisia-australis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big blue pea flowers are worked mainly by strong bumble bees able to trip them open; it also hosts several sulphur and duskywing caterpillars.", basis: "LBJ Wildflower Center; Xerces." },
    ],
    "amelanchier-canadensis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Early-summer serviceberries are a top waxwing food — flocks can clear a tree in a day.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, catbirds, and cardinals all take the sweet June fruit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first tree-shrubs to bloom, feeding early solitary bees.", basis: "Xerces Society." },
    ],
    "cornus-florida": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "High-fat red fall drupes are prized by waxwings and migrating songbirds.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Dogwood fruit is among the richest fall foods for thrushes and other songbirds.", basis: "Cornell Lab." },
      { wildlifeId: "spring-azures", support: "host", note: "Spring azure caterpillars eat the flower buds of flowering dogwood.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
    ],
    "cornus-sericea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "White fall berries are eagerly eaten by waxwings and other fruit-loving birds.", basis: "Cornell Lab." },
    ],
    "ilex-verticillata": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Scarlet berries cling into deep winter, feeding waxwings and robins when little else is left.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "A winter-long larder for bluebirds, robins, and mockingbirds.", basis: "Cornell Lab." },
    ],
    "viburnum-dentatum": [
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Viburnums are a documented larval host for the hummingbird clearwing moth.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Blue-black fall fruit is a favorite of waxwings and thrushes.", basis: "Cornell Lab." },
    ],
    "vaccinium-corymbosum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blueberry flowers are buzz-pollinated, so bumble bees are their best pollinators; native mason and mining bees work them too.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer berries feed catbirds, thrushes, and many other birds — if you leave them any.", basis: "Cornell Lab." },
    ],
    "lonicera-sempervirens": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Coral tubular flowers over a long season are one of the best hummingbird vines there is.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "corylus-americana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Hazelnuts are sought out by squirrels, chipmunks, and jays in fall.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "fagus-grandifolia": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Beechnuts are small but rich, and squirrels, chipmunks, black bears and deer all fatten on a good year's crop.", basis: "USDA Silvics of North America." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Blue jays and wild turkeys take the nuts as they fall, and jays carry them off to bury.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "tilia-americana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Basswood flowers in June and smells like honey; a big tree in bloom hums with bumble bees from a distance.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "red-spotted-admiral", support: "host", note: "Basswood is one of the trees red-spotted admiral caterpillars eat, alongside cherries and birches.", basis: "GloBI — Ferrer-Paris et al. 2013 butterfly–host plant associations; BAMONA." },
    ],
    "tsuga-canadensis": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Hemlock's tiny cones hang on all winter, and siskins and redpolls hang upside down to pull the seeds out.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "pinus-strobus": [
      { wildlifeId: "eastern-pine-elfin", support: "host", note: "Pine elfin caterpillars eat the soft new needles of white pine in late spring.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "White pine seeds are a staple for crossbills, siskins and chickadees in a good cone year.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Red squirrels cut the green cones and stash them for winter.", basis: "USDA Silvics of North America." },
    ],
    "celtis-occidentalis": [
      { wildlifeId: "hackberry-emperor", support: "host", reliance: "sole", note: "Hackberry emperor caterpillars eat hackberry leaves and nothing else.", basis: "GloBI — Ecdysis arthropod occurrence portal; BAMONA." },
      { wildlifeId: "american-snout", support: "host", reliance: "narrow", note: "The snout's caterpillars also feed only on hackberry, so a hackberry is the one place to look for them.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed in groups on hackberry, as they do on elms and willows.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The small dark fruits stay on the twigs well into winter, when waxwings and robins come for them.", basis: "Cornell Lab of Ornithology." },
    ],
    "quercus-palustris": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Pin oak's small acorns are just the size a blue jay can swallow whole and carry off to bury; wood ducks eat them in flooded woods.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and deer feed on the acorns from fall right through winter.", basis: "USDA Silvics of North America." },
      { wildlifeId: "banded-hairstreak", support: "host", note: "Banded hairstreak caterpillars eat the new oak leaves in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "quercus-phellos": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Willow oak bears small acorns nearly every year, eaten by blue jays, turkeys and woodpeckers.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "A dependable acorn crop for squirrels and deer.", basis: "USDA Silvics of North America." },
      { wildlifeId: "banded-hairstreak", support: "host", note: "Banded hairstreak caterpillars feed on oaks in spring, willow oak included.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "juniperus-virginiana": [
      { wildlifeId: "juniper-hairstreak", support: "host", reliance: "narrow", note: "Here the juniper hairstreak lives on eastern red cedar and almost nothing else, sitting unseen in the green foliage.", basis: "GloBI — NHM Interactions Bank (Natural History Museum); BAMONA." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The waxwing is named for this tree: flocks strip its blue berries in winter.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "One of the few warblers that stays north in winter, living partly on red cedar berries.", basis: "GloBI — iNaturalist observation records; Cornell Lab of Ornithology." },
    ],
    "carpinus-caroliniana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "The little nutlets hang in leafy clusters into fall, and gray squirrels and chipmunks gather them.", basis: "USDA Fire Effects Information System." },
    ],
    "acer-saccharum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Sugar maple leaves feed cecropia caterpillars, the giants of eastern moths.", basis: "NWF Native Plant Finder / Tallamy; BAMONA." },
    ],
    "betula-alleghaniensis": [
      { wildlifeId: "red-spotted-admiral", support: "host", note: "Birches are a favorite of red-spotted admiral caterpillars, which overwinter in a rolled leaf.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "luna-moth", support: "host", note: "Luna caterpillars eat birch leaves, one of the trees they take most often in the north.", basis: "BAMONA; NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redpolls and siskins pick seeds from yellow birch catkins all winter.", basis: "Cornell Lab of Ornithology." },
    ],
    "pinus-rigida": [
      { wildlifeId: "eastern-pine-elfin", support: "host", note: "Pitch pine barrens are classic pine elfin country; the caterpillars eat the new needles.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Pitch pine cones can stay on the tree for years, a slow seed supply for crossbills.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "lindera-benzoin": [
      { wildlifeId: "spicebush-swallowtail", support: "host", reliance: "narrow", note: "The butterfly is named for this shrub. Its caterpillars fold a leaf into a tent and hide inside, showing a pair of fake snake eyes.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries are rich in fat, just what thrushes need before migrating in fall.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Cornell Lab." },
    ],
    "sambucus-canadensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Elderberries ripen in late summer, and catbirds, robins and thrushes clear the heavy clusters fast.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks find ripe elderberries fast and strip a shrub in an afternoon.", basis: "Cornell Lab of Ornithology." },
    ],
    "kalmia-latifolia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each mountain laurel flower holds its stamens bent back like springs; a landing bumble bee sets them off and gets dusted with pollen.", basis: "Xerces Society." },
    ],
    "aronia-melanocarpa": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black berries are sour and stay on the branch into winter, eaten when better food runs out.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small white flowers in May are worked by mining bees and other small spring bees.", basis: "Xerces Society." },
    ],
    "viburnum-prunifolium": [
      { wildlifeId: "spring-azures", support: "host", note: "Spring azure caterpillars eat blackhaw's flower buds in spring.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Hummingbird clearwing caterpillars feed on viburnum leaves, blackhaw among them.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue-black fruits sweeten after frost, and waxwings and robins take them.", basis: "Cornell Lab of Ornithology." },
    ],
    "rhododendron-periclymenoides": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "nectar", note: "Its long stamens reach out beyond the petals and brush the wings of the big swallowtails that feed here.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pinxterbloom flowers in spring, when bumble bee queens need early meals.", basis: "Xerces Society." },
    ],
    "clethra-alnifolia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Sweet pepperbush flowers in late summer, scented spikes that keep bees busy for weeks.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "rhus-typhina": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The fuzzy red fruit clusters last all winter, and robins and bluebirds eat them in late winter when little else is left.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The greenish flower spikes in June draw bees of many sizes.", basis: "Xerces Society." },
    ],
    "erythronium-americanum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The trout lily mining bee, Andrena erythronii, collects pollen almost only from trout lilies, and flies only while they bloom.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "chelone-glabra": [
      { wildlifeId: "baltimore-checkerspot", support: "host", reliance: "narrow", note: "Turtlehead is the Baltimore checkerspot's main host here. The caterpillars spin a group web over the leaves in late summer.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Only a bumble bee is strong enough to push into the closed flower and drink.", basis: "Xerces Society." },
    ],
    "pycnanthemum-muticum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Mountain mint is in flower for weeks in midsummer, covered in bees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its tiny open flowers suit small solitary bees.", basis: "Xerces Society." },
    ],
    "phlox-divaricata": [
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "Only long tongues reach the nectar in phlox's narrow tubes, and the clearwing hovers to drink.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "nectar", note: "Swallowtails visit the blue spring flowers in woodland gaps.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
    ],
    "mertensia-virginica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens are the bluebells' main visitors, hanging under each bell to reach the nectar.", basis: "Xerces Society." },
    ],
    "solidago-caesia": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A goldenrod for shade, so specialist bees can find late pollen at the woodland edge too.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
      { wildlifeId: "monarch", support: "nectar", note: "Migrating monarchs fuel up on goldenrods in September.", basis: "Xerces Society." },
    ],
    "vernonia-noveboracensis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "The ironweed longhorn bee, Melissodes denticulatus, gathers pollen almost only from ironweeds.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
      { wildlifeId: "monarch", support: "nectar", note: "The purple heads in late summer are a favorite of monarchs and swallowtails.", basis: "Xerces Society." },
    ],
    "eurybia-divaricata": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "An aster for dry shade, flowering in late summer when aster specialists are flying.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "carex-pensylvanica": [
      { wildlifeId: "grass-skippers", support: "host", note: "Some wood nymphs and skippers raise their caterpillars on low woodland sedges like this one.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "sorghastrum-nutans": [
      { wildlifeId: "grass-skippers", support: "host", note: "Indian grass feeds the caterpillars of several grass skippers.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA; Xerces Society." },
    ],
    "elymus-hystrix": [
      { wildlifeId: "grass-skippers", support: "host", note: "Bottlebrush grass is a host of the northern pearly-eye, a shade-loving brown butterfly of woods.", basis: "Iftner, Shuey & Calhoun, Butterflies and Skippers of Ohio; BAMONA." },
    ],
    "clematis-virginiana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Virgin's bower covers fences in white flowers in late summer, visited by bees of many sizes.", basis: "Xerces Society." },
    ],
    "campsis-radicans": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "The orange trumpets are made for hummingbirds, which visit them all summer.", basis: "Cornell Lab of Ornithology." },
    ],
    "gaultheria-procumbens": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Wintergreen berries last under the snow and feed chipmunks, mice, deer and foxes in late winter.", basis: "USDA Fire Effects Information System." },
    ],
    "mitchella-repens": [
      { wildlifeId: "acorn-birds", support: "berries", note: "Wild turkeys pick the red berries off the forest floor in winter.", basis: "USDA Fire Effects Information System." },
    ],
    "antennaria-plantaginifolia": [
      { wildlifeId: "american-lady", support: "host", reliance: "narrow", note: "Pussytoes is one of the American lady's main hosts. The caterpillar ties leaves together with silk and hides inside.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
    ],
  },

  "st-lawrence": {
    "amelanchier-laevis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Early-summer serviceberries are a top waxwing food — a flock can strip a tree in a day.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, catbirds and cardinals all take the sweet June fruit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first small trees to bloom, feeding early solitary bees.", basis: "Xerces Society." },
    ],
    "tilia-americana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A basswood in full flower in July hums so loudly with bees you can hear it from below — one of the great nectar trees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The fragrant cream flowers feed solitary bees as well as bumble bees.", basis: "Xerces Society." },
    ],
    "fagus-grandifolia": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Beechnuts are prime fall mast — bears, deer, squirrels and chipmunks fatten on a good beech year.", basis: "USDA Silvics of North America." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Blue jays, turkeys and woodpeckers all work the nuts out of the prickly husks.", basis: "Cornell Lab." },
    ],
    "prunus-serotina": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Wild cherry is one of the tiger swallowtail's main larval trees.", basis: "NWF Native Plant Finder; LBJ Wildflower Center." },
      { wildlifeId: "cecropia-moth", support: "host", note: "A classic host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Cherries are among the trees the viceroy also uses as a caterpillar host.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer cherries are devoured by dozens of songbirds, from thrushes to catbirds.", basis: "Cornell Lab." },
    ],
    "tsuga-canadensis": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Hemlock's tiny cones feed siskins, crossbills and redpolls, and its dense shade shelters them from the cold.", basis: "Cornell Lab." },
    ],
    "pinus-strobus": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "White pine seeds are winter food for crossbills, siskins and redpolls — flocks that drift down out of the boreal forest and work the cones over.", basis: "Cornell Lab; NWF." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Red squirrels cut and cache the green cones by the bushel, and the seed feeds chipmunks and mice through the snow.", basis: "USDA Silvics of North America." },
    ],
    "quercus-rubra": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Heavy acorn crops feed jays, turkeys and woodpeckers through fall and winter.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Reliable acorn mast for squirrels, deer, bears and other mammals.", basis: "USDA Silvics of North America." },
      { wildlifeId: "cecropia-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths, cecropia among them.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "thuja-occidentalis": [
      { wildlifeId: "acorn-mammals", support: "shelter", note: "A cedar swamp is a 'deer yard' — where whitetails crowd in winter for the shelter of the dense evergreen canopy and browse the foliage within reach.", basis: "USDA Silvics of North America; Michigan DNR." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "The small seeds feed pine siskins and redpolls late into winter.", basis: "Cornell Lab." },
    ],
    "betula-papyrifera": [
      { wildlifeId: "luna-moth", support: "host", note: "Birch is a favored luna moth caterpillar tree — the pale-green giant of the northern woods.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed in groups on birch, and the adult overwinters to be the first butterfly out over the snow.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redpolls and siskins swing from the catkins all winter, shaking out the tiny seeds.", basis: "Cornell Lab." },
    ],
    "populus-tremuloides": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Aspen is one of the willow-and-poplar family the viceroy's caterpillars grow up on.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Poplars and aspens are core mourning cloak hosts — the butterfly that hibernates and flies the first warm day of spring.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Aspen is among the trees the tiger swallowtail's caterpillars accept.", basis: "NWF Native Plant Finder." },
    ],
    "acer-rubrum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "A dependable host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Red maple's red flowers open before almost anything else, giving a bumble bee queen pollen in a still-bare woods.", basis: "Xerces Society." },
    ],
    "amelanchier-canadensis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Early-summer serviceberries are a top waxwing food — flocks can clear a tree in a day.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, catbirds, and cardinals all take the sweet June fruit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first tree-shrubs to bloom, feeding early solitary bees.", basis: "Xerces Society." },
    ],
    "acer-saccharum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Maple leaves are a staple food of cecropia caterpillars, the largest moth on the continent.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "quercus-alba": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Sweet white-oak acorns are prime food for wild turkeys, wood ducks, and acorn-caching blue jays.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "One of the best mast trees there is — squirrels, deer, and bears fatten on the autumn acorn drop.", basis: "USDA Silvics of North America." },
      { wildlifeId: "luna-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths; oak is a dependable luna host.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "corylus-americana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Hazelnuts are sought out by squirrels, chipmunks, and jays in fall.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "viburnum-dentatum": [
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Viburnums are a documented larval host for the hummingbird clearwing moth.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Blue-black fall fruit is a favorite of waxwings and thrushes.", basis: "Cornell Lab." },
    ],
    "corylus-cornuta": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and chipmunks hunt out the hazelnuts in late summer, often before they are fully ripe.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Blue jays and woodpeckers take the nuts too, prying them from the beaked husks.", basis: "Cornell Lab." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "silver-spotted-skipper", support: "nectar", note: "Buttonbush's flower is a pincushion of long white tubes, and a skipper can work one sphere for a full minute without moving.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records; Xerces Society." },
      { wildlifeId: "red-admiral", support: "nectar", note: "In July a buttonbush on a pond edge holds more butterflies at once than anything else in a wet garden.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in the mid-summer gap when spring is over and the goldenrod hasn't started.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "vaccinium-corymbosum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blueberry flowers are buzz-pollinated, so bumble bees are their best pollinators; native mason and mining bees work them too.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer berries feed catbirds, thrushes, and many other birds — if you leave them any.", basis: "Cornell Lab." },
    ],
    "vaccinium-angustifolium": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blueberry flowers are buzz-pollinated, so bumble bees are their best pollinators; native mining and mason bees work them too.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The sweet berries feed thrushes, catbirds and many other birds — if you leave them any.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Black bears and chipmunks work the low bushes hard when the fruit ripens in July.", basis: "USDA PLANTS; Michigan DNR." },
    ],
    "viburnum-lentago": [
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Viburnums are a documented larval host for the hummingbird clearwing, the bumblebee-sized day-flying moth.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Blue-black fall fruit hangs into winter and is a favorite of waxwings and thrushes.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes and cardinals take the sweet dark berries.", basis: "Cornell Lab." },
    ],
    "ceanothus-americanus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "New Jersey tea flowers in the heat of early July in froths of white that bees find from far off.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its nectar sits out in the open, which is why so many small solitary bees and wasps can use it.", basis: "Xerces Society." },
    ],
    "physocarpus-opulifolius": [
      { wildlifeId: "red-admiral", support: "nectar", note: "Ninebark's little domed flower clusters in June draw butterflies, beetles and small bees at once.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow open flowers, so a short-tongued solitary bee reaches the nectar as easily as anything.", basis: "Xerces Society." },
    ],
    "diervilla-lonicera": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "The little yellow trumpets are built for bumble bees, but a hummingbird will work them too.", basis: "LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are its steadiest visitors in dry, shady ground where few other flowers are open.", basis: "Xerces Society." },
    ],
    "salix-discolor": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Willows are the viceroy's heartland host — the orange monarch-mimic grows up on them.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow is a core mourning cloak host, and its early catkins also feed the freshly-woken adults.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pussy willow catkins are the first pollen of the year — a lifeline for bumble bee queens starting a nest in the cold.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early solitary mining bees crowd the catkins for pollen weeks before most flowers open.", basis: "Xerces Society." },
    ],
    "sambucus-racemosa": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The bright red berry clusters are stripped within days by waxwings and other early-summer birds.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and grosbeaks all take the fruit as it ripens.", basis: "Cornell Lab." },
    ],
    "cornus-sericea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "White fall berries are eagerly taken by waxwings and other fruit-loving birds.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and catbirds fuel fall migration on the fatty white fruit.", basis: "Cornell Lab." },
    ],
    "ilex-verticillata": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Scarlet berries cling into deep winter, feeding waxwings and robins when little else is left.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "A winter-long larder for bluebirds, robins and mockingbirds.", basis: "Cornell Lab." },
    ],
    "hamamelis-virginiana": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Witch hazel leaves feed cecropia caterpillars, thumb-thick green giants by the time they spin up.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "luna-moth", support: "host", note: "Luna moth caterpillars take witch hazel too, one of a short list of trees they accept.", basis: "NWF Native Plant Finder." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed — one of the only plants a monarch caterpillar can eat, and a favorite for laying eggs.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The blazing orange flowers are a heavy nectar draw for bumble bees and butterflies alike.", basis: "Xerces Society." },
    ],
    "lobelia-cardinalis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Vivid red tubes are shaped for a hummingbird's bill and are one of its most important native nectar plants.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "zizia-aurea": [
      { wildlifeId: "eastern-black-swallowtail", support: "host", reliance: "narrow", note: "A native carrot-family plant and a true black swallowtail host — not just a nectar stop.", basis: "LBJ Wildflower Center; Xerces." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flat-topped yellow flowers are easy nectar for bees emerging in late spring.", basis: "Xerces Society." },
    ],
    "campanula-rotundifolia": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees shelter and feed inside the nodding blue bells on dry, sunny banks.", basis: "Xerces Society." },
    ],
    "symphyotrichum-novae-angliae": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters carry a suite of pollen-specialist bees, and this is one of the best of them.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Late purple bloom is critical fall fuel for monarchs heading south.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Fine seed heads feed goldfinches into winter.", basis: "Cornell Lab." },
    ],
    "anaphalis-margaritacea": [
      { wildlifeId: "american-lady", support: "host", reliance: "narrow", note: "Pearly everlasting is the American lady's main caterpillar plant — the young feed in a silk-and-leaf nest at the stem tips.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "painted-lady", support: "host", note: "Painted lady caterpillars use it too, one of the many plants that restless wanderer accepts.", basis: "NWF Native Plant Finder; BAMONA." },
    ],
    "eutrochium-maculatum": [
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "Tall mauve flower heads are a magnet for clearwing moths and butterflies.", basis: "Xerces Society; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big domed clusters are worked hard by bumble bees in late summer.", basis: "Xerces Society." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of damp ground and a key monarch host and nectar plant.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flower clusters are rich in nectar for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "monarda-fistulosa": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a bee and butterfly favorite; hummingbirds visit now and then.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "A top nectar flower for the hummingbird clearwing, which hovers at it like a tiny hummingbird.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees are among its heaviest visitors.", basis: "Xerces Society." },
    ],
    "aquilegia-canadensis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Red nodding spurs bloom in spring exactly as ruby-throats arrive north; a classic hummingbird flower.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "geranium-maculatum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "One mining bee, Andrena distans, collects pollen from wild geranium and very little else — it flies for the few weeks the geranium is out, and then it is gone for the year.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville, Snow Entomological Museum (University of Kansas); Fowler & Droege." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An early woodland-edge flower, out while the trees are still bare and the light still reaches the ground.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "solidago-rugosa": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrods carry more pollen-specialist bees than almost any other plant.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "A powerhouse of late-season nectar for migrating monarchs.", basis: "Xerces Society." },
    ],
    "andropogon-gerardii": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Big bluestem is the byssus skipper's caterpillar grass — a butterfly that has followed the tallgrass prairie into whatever is left of it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "schizachyrium-scoparium": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Little bluestem raises the wood nymphs and several skippers, whose caterpillars winter down inside the tussock — so leave it standing until spring.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "carex-pensylvanica": [
      { wildlifeId: "grass-skippers", support: "host", note: "Woodland sedges are the caterpillar food of many little skippers and the wood-nymph satyrs of shady ground.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "panicum-virgatum": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Switchgrass raises the Delaware skipper — a small orange butterfly whose caterpillars live in a tube of grass blade sewn together with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "vitis-riparia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild grapes are among the most important fall fruits there are — dozens of songbirds and game birds eat them.", basis: "Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings and robins strip the small blue grapes from the tangles they climb.", basis: "Cornell Lab." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "mason-bees", support: "nectar", note: "The little pink spring bells feed early solitary and bumble bees on bare, sandy ground.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries hang on into winter for thrushes and other birds when little else is left.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "The name is the story: bears and other mammals eat the mealy red 'bearberries'.", basis: "USDA PLANTS." },
    ],
    "cornus-canadensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Clusters of red bunchberries feed thrushes and other birds of cool northern woods; chipmunks take them too.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "packera-aurea": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Golden ragwort is a sunflower-family bloom in April, months before the asters and goldenrods — which makes it one of the few early sources for the bees that can only use that family's pollen.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Fowler & Droege." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small mining and mason bees work the flat yellow heads while they are provisioning their spring nests.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild strawberries are tiny and intensely sweet, and robins and thrushes reach almost all of them first.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "White five-petaled flowers low to the ground open in spring, among the first a bumble bee queen can reach.", basis: "Xerces Society." },
    ],
    "celastrus-scandens": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The orange capsules split in October and the scarlet seed hangs on through the snow — food in February, when the dogwoods and viburnums are long stripped.", basis: "Cornell Lab; USFS Woody Plant Seed Manual." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings work the winter vines in flocks, taking the seed whole and dropping it in hedgerows where the next one grows.", basis: "Cornell Lab." },
    ],
    "clematis-virginiana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A froth of small white flowers in August and September, when the spring shrubs are finished and a late bumble bee queen is still laying in fat for winter.", basis: "Xerces Society." },
    ],
    "quercus-macrocarpa": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Bur oak's big fringed acorns feed blue jays, turkeys and woodpeckers.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels, chipmunks and deer eat and bury the acorns each fall.", basis: "USDA Silvics of North America." },
      { wildlifeId: "banded-hairstreak", support: "host", note: "Banded hairstreak caterpillars eat the new leaves of oaks, bur oak among them.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "carya-ovata": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Shagbark nuts are among the sweetest in the woods, and squirrels and chipmunks carry off nearly all of them.", basis: "USDA Silvics of North America." },
      { wildlifeId: "luna-moth", support: "host", note: "Hickories are a regular luna moth host.", basis: "BAMONA; NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "banded-hairstreak", support: "host", note: "Banded hairstreak caterpillars feed on hickory leaves as well as oak.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "carpinus-caroliniana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "The little nutlets hang in leafy clusters into fall, and squirrels and chipmunks gather them.", basis: "USDA Fire Effects Information System." },
    ],
    "larix-laricina": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Tamarack seeds are a favorite of white-winged crossbills and redpolls in winter.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "cornus-alternifolia": [
      { wildlifeId: "spring-azures", support: "host", note: "Azure caterpillars eat pagoda dogwood's flower buds in spring.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The blue-black berries on red stalks ripen in midsummer and are eaten within days by thrushes and catbirds.", basis: "Cornell Lab of Ornithology." },
    ],
    "rhus-typhina": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The fuzzy red fruit clusters last all winter, eaten by robins, bluebirds and grouse when little else is left.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The greenish flower spikes in June draw bees of many sizes.", basis: "Xerces Society." },
    ],
    "spiraea-alba": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Meadowsweet's fluffy white spikes flower through midsummer and are worked over by bumble bees, including the red-belted bumble bee.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "rubus-odoratus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Its big pink rose-like flowers open all summer, a steady meal for bumble bees.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The soft red berries are eaten by catbirds, robins and thrushes.", basis: "Cornell Lab of Ornithology." },
    ],
    "alnus-incana": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redpolls and siskins pick the seeds out of alder cones in winter.", basis: "Cornell Lab of Ornithology." },
    ],
    "prunus-virginiana": [
      { wildlifeId: "coral-hairstreak", support: "host", reliance: "narrow", note: "Chokecherry is one of the coral hairstreak's few hosts; the caterpillars feed on it at night.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "red-spotted-admiral", support: "host", note: "White admiral caterpillars feed on chokecherry, as they do on other wild cherries.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Tiger swallowtail caterpillars grow up on wild cherry leaves, chokecherry included.", basis: "BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The dark cherries are eaten by robins, thrushes and grosbeaks as soon as they ripen.", basis: "Cornell Lab of Ornithology." },
    ],
    "iris-versicolor": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each blue flag flower is a landing pad: a bumble bee follows the veined lines in and brushes the pollen on its way.", basis: "Xerces Society." },
    ],
    "erythronium-americanum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The trout lily mining bee, Andrena erythronii, collects pollen almost only from trout lilies, and flies only while they bloom.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "maianthemum-racemosum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The speckled berries turn red in late summer and are eaten by thrushes and grouse.", basis: "USDA Fire Effects Information System." },
    ],
    "eupatorium-perfoliatum": [
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs and other late-summer butterflies sip from boneset's flat white heads.", basis: "Xerces Society." },
    ],
    "sanguinaria-canadensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bloodroot opens for only a few days in April, and small mining and sweat bees gather its pollen.", basis: "Xerces Society." },
    ],
    "anemone-canadensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small bees and flies collect pollen from its open white flowers.", basis: "Xerces Society." },
    ],
    "symphyotrichum-cordifolium": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "An aster for shade, flowering in fall when aster-specialist bees are still flying.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Clouds of small lavender flowers feed late bumble bees before winter.", basis: "Xerces Society." },
    ],
    "chelone-glabra": [
      { wildlifeId: "baltimore-checkerspot", support: "host", reliance: "narrow", note: "Turtlehead is the Baltimore checkerspot's main host. The caterpillars spin a group web over the leaves in late summer.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Only a bumble bee is strong enough to push into the closed flower and drink.", basis: "Xerces Society." },
    ],
    "verbena-hastata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The thin blue spikes flower a few rings at a time, so there's nectar all summer.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees work the tiny flowers right through summer.", basis: "Xerces Society." },
    ],
    "trillium-grandiflorum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens visit the big white flowers in early spring.", basis: "Xerces Society." },
    ],
    "elymus-hystrix": [
      { wildlifeId: "grass-skippers", support: "host", note: "Bottlebrush grass is a host of the northern pearly-eye, a shade-loving brown butterfly of woods.", basis: "Iftner, Shuey & Calhoun, Butterflies and Skippers of Ohio; BAMONA." },
    ],
    "gaultheria-procumbens": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Wintergreen berries last under the snow and feed chipmunks, mice, deer and foxes in late winter.", basis: "USDA Fire Effects Information System." },
    ],
    "parthenocissus-vitacea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue-black berries on red stalks draw waxwing flocks in fall.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, robins and woodpeckers eat them too.", basis: "Cornell Lab of Ornithology." },
    ],
  },
  chicago: {
    "quercus-macrocarpa": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Big fringed acorns that jays, woodpeckers and wild turkeys carry off and cache.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and deer fatten on the fall acorn drop; a lone savanna oak feeds a whole neighborhood of them.", basis: "USDA Silvics of North America." },
    ],
    "quercus-alba": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Sweet white-oak acorns are prime food for wild turkeys, wood ducks, and acorn-caching blue jays.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "One of the best mast trees there is — squirrels, deer and wild turkeys fatten on the autumn acorn drop.", basis: "USDA Silvics of North America." },
      { wildlifeId: "luna-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths; oak is a dependable luna host.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "quercus-bicolor": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Sweet acorns that wood ducks, jays and woodpeckers take from the river bottoms.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Low in bitterness, so squirrels and deer eat them early in fall.", basis: "USDA Silvics of North America." },
    ],
    "quercus-rubra": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Heavy acorn crops feed jays, turkeys and woodpeckers through fall and winter.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Reliable acorn mast for squirrels, deer and other mammals.", basis: "USDA Silvics of North America." },
      { wildlifeId: "cecropia-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths, cecropia among them.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "carya-ovata": [
      { wildlifeId: "luna-moth", support: "host", note: "Hickory is one of the luna moth's favored caterpillar trees.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and chipmunks work the sweet nuts all fall and bury the rest — planting the next hickories.", basis: "USDA Silvics of North America." },
    ],
    "prunus-serotina": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Wild cherry is one of the tiger swallowtail's main larval trees.", basis: "NWF Native Plant Finder; LBJ Wildflower Center." },
      { wildlifeId: "cecropia-moth", support: "host", note: "A classic host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Cherries are among the trees the viceroy also uses as a caterpillar host.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer cherries are devoured by dozens of songbirds, from thrushes to catbirds.", basis: "Cornell Lab." },
    ],
    "tilia-americana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A basswood in full flower in July hums so loudly with bees you can hear it from below — one of the great nectar trees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The fragrant cream flowers feed solitary bees as well as bumble bees.", basis: "Xerces Society." },
    ],
    "acer-saccharum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Maple leaves are a staple food of cecropia caterpillars, the largest moth on the continent.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "celtis-occidentalis": [
      { wildlifeId: "hackberry-emperor", support: "host", reliance: "sole", note: "Its caterpillars eat hackberry leaves and nothing else.", basis: "BAMONA; Illinois Natural History Survey." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Hackberry is one of the trees mourning cloak caterpillars feed on in groups.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The sweet, dry berries hang on into winter, when waxwings and robins strip them.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, cardinals and thrushes eat the berries through the cold months.", basis: "Cornell Lab; Morton Arboretum." },
    ],
    "malus-ioensis": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Wild crab apple is among the trees cecropia caterpillars feed on.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink blossoms in May feed bumble bee queens building their first nests.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Mason and mining bees work the open apple blossoms for pollen.", basis: "Xerces Society." },
    ],
    "amelanchier-laevis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Early-summer serviceberries are a top waxwing food — a flock can strip a tree in a day.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, catbirds and cardinals all take the sweet June fruit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first small trees to bloom, feeding early solitary bees.", basis: "Xerces Society." },
    ],
    "corylus-americana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Hazelnuts are sought out by squirrels, chipmunks, and jays in fall.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "physocarpus-opulifolius": [
      { wildlifeId: "red-admiral", support: "nectar", note: "Ninebark's little domed flower clusters in June draw butterflies, beetles and small bees at once.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow open flowers, so a short-tongued solitary bee reaches the nectar as easily as anything.", basis: "Xerces Society." },
    ],
    "ceanothus-americanus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "New Jersey tea flowers in the heat of early July in froths of white that bees find from far off.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its nectar sits out in the open, which is why so many small solitary bees and wasps can use it.", basis: "Xerces Society." },
    ],
    "amorpha-canescens": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The purple flower spikes draw bumble bees through June and July.", basis: "Illinois Wildflowers; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Leafcutter and mining bees collect the orange pollen.", basis: "Illinois Wildflowers; Xerces Society." },
    ],
    "cornus-racemosa": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The white berries go fast: thrushes, catbirds and cardinals take them in late summer.", basis: "Cornell Lab; Morton Arboretum." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings strip the red-stalked clusters in a single visit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Flat white flower clusters feed small native bees in June.", basis: "Xerces Society." },
    ],
    "viburnum-lentago": [
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Viburnums are a documented larval host for the hummingbird clearwing, the bumblebee-sized day-flying moth.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Blue-black fall fruit hangs into winter and is a favorite of waxwings and thrushes.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes and cardinals take the sweet dark berries.", basis: "Cornell Lab." },
    ],
    "rosa-setigera": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees shake pollen from the big single flowers in July, after other roses are done.", basis: "Illinois Wildflowers; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red hips hold into winter for robins, cardinals and mockingbirds.", basis: "Cornell Lab." },
    ],
    "rhus-glabra": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The fuzzy red fruit lasts all winter — a late food when robins and bluebirds return in March.", basis: "Cornell Lab; Morton Arboretum." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small greenish flowers that native bees crowd in early summer.", basis: "Xerces Society." },
    ],
    "salix-discolor": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Willows are the viceroy's heartland host — the orange monarch-mimic grows up on them.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow is a core mourning cloak host, and its early catkins also feed the freshly-woken adults.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pussy willow catkins are the first pollen of the year — a lifeline for bumble bee queens starting a nest in the cold.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early solitary mining bees crowd the catkins for pollen weeks before most flowers open.", basis: "Xerces Society." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "silver-spotted-skipper", support: "nectar", note: "Buttonbush's flower is a pincushion of long white tubes, and a skipper can work one sphere for a full minute without moving.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records; Xerces Society." },
      { wildlifeId: "red-admiral", support: "nectar", note: "In July a buttonbush on a pond edge holds more butterflies at once than anything else in a wet garden.", basis: "GloBI — Hale et al. 2024 terrestrial-herbivory food web (Phil. Trans. R. Soc. B), iNaturalist observation records." },
      { wildlifeId: "spicebush-swallowtail", support: "nectar", note: "Big swallowtails feed at it with their wings still beating, working round the sphere as they go.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in the mid-summer gap when spring is over and the goldenrod hasn't started.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "andropogon-gerardii": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Big bluestem is the byssus skipper's caterpillar grass — a butterfly that has followed the tallgrass prairie into whatever is left of it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "schizachyrium-scoparium": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Little bluestem raises the wood nymphs and several skippers, whose caterpillars winter down inside the tussock — so leave it standing until spring.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "sorghastrum-nutans": [
      { wildlifeId: "grass-skippers", support: "host", note: "Indiangrass feeds the caterpillars of several grass skippers and the common wood nymph.", basis: "BAMONA; Xerces Society." },
    ],
    "panicum-virgatum": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Switchgrass raises the Delaware skipper — a small orange butterfly whose caterpillars live in a tube of grass blade sewn together with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "carex-pensylvanica": [
      { wildlifeId: "grass-skippers", support: "host", note: "Woodland sedges are the caterpillar food of many little skippers and the wood-nymph satyrs of shady ground.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "silphium-laciniatum": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Long-horned bees that collect only sunflower-family pollen work the big yellow heads.", basis: "Illinois Wildflowers; Fowler & Droege." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches pick the flat seeds from the heads in fall.", basis: "Illinois Wildflowers; Cornell Lab." },
    ],
    "silphium-terebinthinaceum": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Late yellow heads for the specialist bees that collect only sunflower-family pollen.", basis: "Illinois Wildflowers; Fowler & Droege." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches perch on the tall stalks to pull out the seed.", basis: "Illinois Wildflowers." },
    ],
    "eryngium-yuccifolium": [
      { wildlifeId: "rattlesnake-master-borer", support: "host", reliance: "sole", note: "The moth's caterpillars live inside the stem and root of this one plant.", basis: "Illinois Natural History Survey; Illinois Endangered Species Protection Board." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The white globes are covered in small bees, wasps and beetles in July.", basis: "Illinois Wildflowers." },
    ],
    "echinacea-pallida": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "An early sunflower-family flower for the specialist bees that need that pollen.", basis: "Fowler & Droege; Illinois Wildflowers." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches strip the spiny seed heads from late summer.", basis: "Cornell Lab." },
    ],
    "liatris-pycnostachya": [
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs crowd the purple spikes in July and August.", basis: "Xerces Society; Illinois Wildflowers." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work each spike from the top down as it opens.", basis: "Illinois Wildflowers." },
    ],
    "asclepias-syriaca": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "The milkweed most Midwestern monarchs grow up on.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The scented pink balls hum with bumble bees in June and July.", basis: "Xerces Society." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed — one of the only plants a monarch caterpillar can eat, and a favorite for laying eggs.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The blazing orange flowers are a heavy nectar draw for bumble bees and butterflies alike.", basis: "Xerces Society." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of damp ground and a key monarch host and nectar plant.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flower clusters are rich in nectar for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "monarda-fistulosa": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a bee and butterfly favorite; hummingbirds visit now and then.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "A top nectar flower for the hummingbird clearwing, which hovers at it like a tiny hummingbird.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees are among its heaviest visitors.", basis: "Xerces Society." },
    ],
    "baptisia-lactea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Only bumble bees are strong enough to pry open the white pea flowers.", basis: "Illinois Wildflowers." },
    ],
    "dalea-purpurea": [
      { wildlifeId: "mason-bees", support: "nectar", note: "A long list of small native bees visits the purple flower rings.", basis: "Illinois Wildflowers; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the cones through midsummer.", basis: "Xerces Society." },
    ],
    "ratibida-pinnata": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Sunflower-family specialist bees collect the pollen from July on.", basis: "Illinois Wildflowers; Fowler & Droege." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches eat the seed from the gray cones.", basis: "Illinois Wildflowers." },
    ],
    "solidago-rigida": [
      { wildlifeId: "monarch", support: "nectar", note: "Fall nectar for monarchs heading south.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Late flat-topped flowers that bumble bees fatten on before winter.", basis: "Xerces Society." },
    ],
    "symphyotrichum-novae-angliae": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters carry a suite of pollen-specialist bees, and this is one of the best of them.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Late purple bloom is critical fall fuel for monarchs heading south.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Fine seed heads feed goldfinches into winter.", basis: "Cornell Lab." },
    ],
    "symphyotrichum-laeve": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A late aster whose pollen feeds the specialist bees that can use nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Its sky-blue September flowers help fuel the last monarchs of the year.", basis: "Xerces Society." },
    ],
    "pycnanthemum-virginianum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Draws more kinds of small native bees and wasps than almost any garden flower.", basis: "Xerces Society; Illinois Wildflowers." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the white flower heads through August.", basis: "Xerces Society." },
    ],
    "zizia-aurea": [
      { wildlifeId: "eastern-black-swallowtail", support: "host", reliance: "narrow", note: "A native carrot-family plant and a true black swallowtail host — not just a nectar stop.", basis: "LBJ Wildflower Center; Xerces." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flat-topped yellow flowers are easy nectar for bees emerging in late spring.", basis: "Xerces Society." },
    ],
    "rudbeckia-hirta": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A composite whose pollen supports sunflower-family specialist bees.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the dark seed heads through fall and winter.", basis: "Cornell Lab." },
    ],
    "penstemon-digitalis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "White tubular flowers are a strong late-spring nectar and pollen source for bumble bees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its bloom overlaps the season solitary mason and mining bees are provisioning nests.", basis: "Xerces Society." },
    ],
    "tradescantia-ohiensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees gather the golden pollen in the morning, before the flowers close.", basis: "Illinois Wildflowers." },
    ],
    "primula-meadia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens buzz the pollen loose — few other insects can reach it.", basis: "Illinois Wildflowers." },
    ],
    "verbena-hastata": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small native bees, including a vervain specialist, work the spikes from the bottom up.", basis: "Illinois Wildflowers; Xerces Society." },
    ],
    "lobelia-siphilitica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees push into the blue flowers from August to frost.", basis: "Illinois Wildflowers." },
    ],
    "eutrochium-maculatum": [
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "Tall mauve flower heads are a magnet for clearwing moths and butterflies.", basis: "Xerces Society; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big domed clusters are worked hard by bumble bees in late summer.", basis: "Xerces Society." },
    ],
    "geranium-maculatum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "One mining bee, Andrena distans, collects pollen from wild geranium and very little else — it flies for the few weeks the geranium is out, and then it is gone for the year.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville, Snow Entomological Museum (University of Kansas); Fowler & Droege." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An early woodland-edge flower, out while the trees are still bare and the light still reaches the ground.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "aquilegia-canadensis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Red nodding spurs bloom in spring exactly as ruby-throats arrive north; a classic hummingbird flower.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "allium-tricoccum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small native bees visit the white flower balls in early summer.", basis: "Illinois Wildflowers." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild strawberries are tiny and intensely sweet, and robins and thrushes reach almost all of them first.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "White five-petaled flowers low to the ground open in spring, among the first a bumble bee queen can reach.", basis: "Xerces Society." },
    ],
    "packera-aurea": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Golden ragwort is a sunflower-family bloom in April, months before the asters and goldenrods — which makes it one of the few early sources for the bees that can only use that family's pollen.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Fowler & Droege." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small mining and mason bees work the flat yellow heads while they are provisioning their spring nests.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Virginia creeper's blue-black berries hang on scarlet stalks after the leaves drop, and a waxwing flock clears them fast.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and woodpeckers take them through fall and into winter.", basis: "Cornell Lab." },
    ],
    "clematis-virginiana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A froth of small white flowers in August and September, when the spring shrubs are finished and a late bumble bee queen is still laying in fat for winter.", basis: "Xerces Society." },
    ],
    "vitis-riparia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild grapes are among the most important fall fruits there are — dozens of songbirds and game birds eat them.", basis: "Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings and robins strip the small blue grapes from the tangles they climb.", basis: "Cornell Lab." },
    ],
    "juglans-nigra": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Fox and gray squirrels bury black walnuts by the hundred each fall, and the ones they forget become new trees.", basis: "USDA Silvics of North America." },
      { wildlifeId: "luna-moth", support: "host", note: "Walnuts are among the luna moth's regular hosts.", basis: "BAMONA; NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "banded-hairstreak", support: "host", note: "Banded hairstreak caterpillars eat walnut leaves as well as oak and hickory.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "platanus-occidentalis": [
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Sycamore seed balls break apart over winter, and goldfinches and other finches pick the seeds out.", basis: "USDA Fire Effects Information System; Cornell Lab of Ornithology." },
    ],
    "cercis-canadensis": [
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", reliance: "narrow", note: "Redbud's flowers are built to be pried open by a heavy bee, and the carpenter bee is its most common visitor here.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens feed on redbud in April, one of the first big meals of their year.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "lindera-benzoin": [
      { wildlifeId: "spicebush-swallowtail", support: "host", reliance: "narrow", note: "The butterfly is named for this shrub. Its caterpillars fold a leaf into a tent and hide inside, showing a pair of fake snake eyes.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries are rich in fat, just what thrushes need before migrating in fall.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Cornell Lab." },
    ],
    "sambucus-canadensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Elderberries ripen in late summer, and catbirds, robins and thrushes clear the heavy clusters fast.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks find ripe elderberries fast and strip a shrub in an afternoon.", basis: "Cornell Lab of Ornithology." },
    ],
    "rubus-occidentalis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Black raspberries ripen in July and are eaten by catbirds, robins and cardinals.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The small white flowers in late spring are busy with bumble bees and smaller bees.", basis: "GloBI — Thessen 2014, associations text-mined from the Encyclopedia of Life; Xerces Society." },
    ],
    "cornus-sericea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The white berries ripen in late summer, and waxwings and other birds strip them fast.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and catbirds eat the berries on their way south.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "spring-azures", support: "host", note: "Azure caterpillars feed on dogwood flower buds, red osier among them.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
    ],
    "hamamelis-virginiana": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Witch hazel leaves feed the caterpillars of the cecropia, North America's largest moth.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (NHM); NWF Native Plant Finder." },
    ],
    "aronia-melanocarpa": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black berries are sour and stay on the branch into winter, eaten when better food runs out.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small white flowers in May are worked by mining bees and other small spring bees.", basis: "Xerces Society." },
    ],
    "lupinus-perennis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Only a bee heavy enough to push down the lower petals reaches the pollen, so lupine is a bumble bee flower.", basis: "Xerces Society." },
    ],
    "lespedeza-capitata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The fuzzy flower heads in late summer are visited by bumble bees and leafcutter bees.", basis: "Illinois Wildflowers (John Hilty); Xerces Society." },
    ],
    "podophyllum-peltatum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Mayapple's single nodding flower has no nectar, but bumble bee queens visit it for pollen.", basis: "Xerces Society." },
    ],
    "mertensia-virginica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens are the bluebells' main visitors, hanging under each bell to reach the nectar.", basis: "Xerces Society." },
    ],
    "sanguinaria-canadensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bloodroot opens for only a few days in April, and small mining and sweat bees gather its pollen.", basis: "Xerces Society." },
    ],
    "claytonia-virginica": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The spring beauty mining bee, Andrena erigeniae, collects pollen only from spring beauty and flies only while it blooms.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "erythronium-albidum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The trout lily mining bee, Andrena erythronii, collects pollen almost only from trout lilies, white trout lily included.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "viola-sororia": [
      { wildlifeId: "greater-fritillaries", support: "host", reliance: "narrow", note: "Great spangled fritillary caterpillars eat only violets. They hatch in fall, sleep through winter, then feed on the new leaves at night.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
    ],
    "antennaria-neglecta": [
      { wildlifeId: "american-lady", support: "host", reliance: "narrow", note: "Pussytoes is one of the American lady's main hosts. The caterpillar ties leaves together with silk and hides inside.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Its little pink bells open in early spring, when mason and mining bees are just out.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries last through winter on the dunes, eaten by grouse and songbirds.", basis: "USDA Fire Effects Information System." },
    ],
    "celastrus-scandens": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The orange-and-red fruit capsules hang on into winter, eaten by robins, bluebirds and grouse.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings take the fruit in winter, when there is little else.", basis: "Cornell Lab of Ornithology." },
    ],
  },
  "north-michigan": {
    "pinus-strobus": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "White pine seeds are winter food for crossbills, siskins and redpolls — flocks that drift down out of the boreal forest and work the cones over.", basis: "Cornell Lab; NWF." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Red squirrels cut and cache the green cones by the bushel, and the seed feeds chipmunks and mice through the snow.", basis: "USDA Silvics of North America." },
    ],
    "acer-saccharum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Maple leaves are a staple food of cecropia caterpillars, the largest moth on the continent.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "acer-rubrum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "A dependable host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Red maple's red flowers open before almost anything else, giving a bumble bee queen pollen in a still-bare woods.", basis: "Xerces Society." },
    ],
    "betula-papyrifera": [
      { wildlifeId: "luna-moth", support: "host", note: "Birch is a favored luna moth caterpillar tree — the pale-green giant of the northern woods.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed in groups on birch, and the adult overwinters to be the first butterfly out over the snow.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redpolls and siskins swing from the catkins all winter, shaking out the tiny seeds.", basis: "Cornell Lab." },
    ],
    "fagus-grandifolia": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Beechnuts are prime fall mast — bears, deer, squirrels and chipmunks fatten on a good beech year.", basis: "USDA Silvics of North America." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Blue jays, turkeys and woodpeckers all work the nuts out of the prickly husks.", basis: "Cornell Lab." },
    ],
    "quercus-rubra": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Heavy acorn crops feed jays, turkeys and woodpeckers through fall and winter.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Reliable acorn mast for squirrels, deer, bears and other mammals.", basis: "USDA Silvics of North America." },
      { wildlifeId: "cecropia-moth", support: "host", note: "Among the oaks' hundreds of caterpillar species are the giant silk moths, cecropia among them.", basis: "NWF Native Plant Finder / Tallamy." },
    ],
    "tsuga-canadensis": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Hemlock's tiny cones feed siskins, crossbills and redpolls, and its dense shade shelters them from the cold.", basis: "Cornell Lab." },
    ],
    "thuja-occidentalis": [
      { wildlifeId: "acorn-mammals", support: "shelter", note: "A cedar swamp is a 'deer yard' — where whitetails crowd in winter for the shelter of the dense evergreen canopy and browse the foliage within reach.", basis: "USDA Silvics of North America; Michigan DNR." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "The small seeds feed pine siskins and redpolls late into winter.", basis: "Cornell Lab." },
    ],
    "populus-tremuloides": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Aspen is one of the willow-and-poplar family the viceroy's caterpillars grow up on.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Poplars and aspens are core mourning cloak hosts — the butterfly that hibernates and flies the first warm day of spring.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Aspen is among the trees the tiger swallowtail's caterpillars accept.", basis: "NWF Native Plant Finder." },
    ],
    "prunus-serotina": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Wild cherry is one of the tiger swallowtail's main larval trees.", basis: "NWF Native Plant Finder; LBJ Wildflower Center." },
      { wildlifeId: "cecropia-moth", support: "host", note: "A classic host for cecropia and other giant silk moth caterpillars.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Cherries are among the trees the viceroy also uses as a caterpillar host.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer cherries are devoured by dozens of songbirds, from thrushes to catbirds.", basis: "Cornell Lab." },
    ],
    "tilia-americana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A basswood in full flower in July hums so loudly with bees you can hear it from below — one of the great nectar trees.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The fragrant cream flowers feed solitary bees as well as bumble bees.", basis: "Xerces Society." },
    ],
    "amelanchier-laevis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Early-summer serviceberries are a top waxwing food — a flock can strip a tree in a day.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, catbirds and cardinals all take the sweet June fruit.", basis: "Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first small trees to bloom, feeding early solitary bees.", basis: "Xerces Society." },
    ],
    "salix-discolor": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Willows are the viceroy's heartland host — the orange monarch-mimic grows up on them.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow is a core mourning cloak host, and its early catkins also feed the freshly-woken adults.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pussy willow catkins are the first pollen of the year — a lifeline for bumble bee queens starting a nest in the cold.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early solitary mining bees crowd the catkins for pollen weeks before most flowers open.", basis: "Xerces Society." },
    ],
    "vaccinium-angustifolium": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blueberry flowers are buzz-pollinated, so bumble bees are their best pollinators; native mining and mason bees work them too.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The sweet berries feed thrushes, catbirds and many other birds — if you leave them any.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Black bears and chipmunks work the low bushes hard when the fruit ripens in July.", basis: "USDA PLANTS; Michigan DNR." },
    ],
    "cornus-sericea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "White fall berries are eagerly taken by waxwings and other fruit-loving birds.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and catbirds fuel fall migration on the fatty white fruit.", basis: "Cornell Lab." },
    ],
    "physocarpus-opulifolius": [
      { wildlifeId: "red-admiral", support: "nectar", note: "Ninebark's little domed flower clusters in June draw butterflies, beetles and small bees at once.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow open flowers, so a short-tongued solitary bee reaches the nectar as easily as anything.", basis: "Xerces Society." },
    ],
    "corylus-cornuta": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and chipmunks hunt out the hazelnuts in late summer, often before they are fully ripe.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Blue jays and woodpeckers take the nuts too, prying them from the beaked husks.", basis: "Cornell Lab." },
    ],
    "hamamelis-virginiana": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Witch hazel leaves feed cecropia caterpillars, thumb-thick green giants by the time they spin up.", basis: "NWF Native Plant Finder / Tallamy." },
      { wildlifeId: "luna-moth", support: "host", note: "Luna moth caterpillars take witch hazel too, one of a short list of trees they accept.", basis: "NWF Native Plant Finder." },
    ],
    "ilex-verticillata": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Scarlet berries cling into deep winter, feeding waxwings and robins when little else is left.", basis: "Cornell Lab; Audubon." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "A winter-long larder for bluebirds, robins and mockingbirds.", basis: "Cornell Lab." },
    ],
    "viburnum-lentago": [
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Viburnums are a documented larval host for the hummingbird clearwing, the bumblebee-sized day-flying moth.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Blue-black fall fruit hangs into winter and is a favorite of waxwings and thrushes.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes and cardinals take the sweet dark berries.", basis: "Cornell Lab." },
    ],
    "diervilla-lonicera": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "The little yellow trumpets are built for bumble bees, but a hummingbird will work them too.", basis: "LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are its steadiest visitors in dry, shady ground where few other flowers are open.", basis: "Xerces Society." },
    ],
    "sambucus-racemosa": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The bright red berry clusters are stripped within days by waxwings and other early-summer birds.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and grosbeaks all take the fruit as it ripens.", basis: "Cornell Lab." },
    ],
    "ceanothus-americanus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "New Jersey tea flowers in the heat of early July in froths of white that bees find from far off.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its nectar sits out in the open, which is why so many small solitary bees and wasps can use it.", basis: "Xerces Society." },
    ],
    "aquilegia-canadensis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Red nodding spurs bloom in spring exactly as ruby-throats arrive north; a classic hummingbird flower.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "lupinus-perennis": [
      { wildlifeId: "karner-blue", support: "host", reliance: "sole", note: "Wild lupine is the only plant a Karner blue caterpillar can eat. No lupine, no Karner blue — and Michigan is one of its last strongholds.", basis: "USFWS; Michigan Natural Features Inventory; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Strong bumble bees are heavy enough to trip open the blue pea flowers and reach the pollen inside.", basis: "Xerces Society." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed — one of the only plants a monarch caterpillar can eat, and a favorite for laying eggs.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The blazing orange flowers are a heavy nectar draw for bumble bees and butterflies alike.", basis: "Xerces Society." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of damp ground and a key monarch host and nectar plant.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flower clusters are rich in nectar for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "monarda-fistulosa": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a bee and butterfly favorite; hummingbirds visit now and then.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "A top nectar flower for the hummingbird clearwing, which hovers at it like a tiny hummingbird.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees are among its heaviest visitors.", basis: "Xerces Society." },
    ],
    "symphyotrichum-novae-angliae": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters carry a suite of pollen-specialist bees, and this is one of the best of them.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Late purple bloom is critical fall fuel for monarchs heading south.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Fine seed heads feed goldfinches into winter.", basis: "Cornell Lab." },
    ],
    "symphyotrichum-laeve": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A late aster whose pollen feeds the specialist bees that can use nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Its sky-blue September flowers help fuel the last monarchs of the year.", basis: "Xerces Society." },
    ],
    "solidago-speciosa": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrods carry more pollen-specialist bees than almost any other plant.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "A powerhouse of late-season nectar for migrating monarchs.", basis: "Xerces Society." },
    ],
    "rudbeckia-hirta": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A composite whose pollen supports sunflower-family specialist bees.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the dark seed heads through fall and winter.", basis: "Cornell Lab." },
    ],
    "campanula-rotundifolia": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees shelter and feed inside the nodding blue bells on dry, sunny banks.", basis: "Xerces Society." },
    ],
    "lobelia-cardinalis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Vivid red tubes are shaped for a hummingbird's bill and are one of its most important native nectar plants.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "zizia-aurea": [
      { wildlifeId: "eastern-black-swallowtail", support: "host", reliance: "narrow", note: "A native carrot-family plant and a true black swallowtail host — not just a nectar stop.", basis: "LBJ Wildflower Center; Xerces." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flat-topped yellow flowers are easy nectar for bees emerging in late spring.", basis: "Xerces Society." },
    ],
    "eutrochium-maculatum": [
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "Tall mauve flower heads are a magnet for clearwing moths and butterflies.", basis: "Xerces Society; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big domed clusters are worked hard by bumble bees in late summer.", basis: "Xerces Society." },
    ],
    "anaphalis-margaritacea": [
      { wildlifeId: "american-lady", support: "host", reliance: "narrow", note: "Pearly everlasting is the American lady's main caterpillar plant — the young feed in a silk-and-leaf nest at the stem tips.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "painted-lady", support: "host", note: "Painted lady caterpillars use it too, one of the many plants that restless wanderer accepts.", basis: "NWF Native Plant Finder; BAMONA." },
    ],
    "schizachyrium-scoparium": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Little bluestem raises the wood nymphs and several skippers, whose caterpillars winter down inside the tussock — so leave it standing until spring.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "carex-pensylvanica": [
      { wildlifeId: "grass-skippers", support: "host", note: "Woodland sedges are the caterpillar food of many little skippers and the wood-nymph satyrs of shady ground.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Virginia creeper's blue-black berries hang on scarlet stalks after the leaves drop, and a waxwing flock clears them fast.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and woodpeckers take them through fall and into winter.", basis: "Cornell Lab." },
    ],
    "vitis-riparia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild grapes are among the most important fall fruits there are — dozens of songbirds and game birds eat them.", basis: "Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings and robins strip the small blue grapes from the tangles they climb.", basis: "Cornell Lab." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild strawberries are tiny and intensely sweet, and robins and thrushes reach almost all of them first.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "White five-petaled flowers low to the ground open in spring, among the first a bumble bee queen can reach.", basis: "Xerces Society." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "mason-bees", support: "nectar", note: "The little pink spring bells feed early solitary and bumble bees on bare, sandy ground.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries hang on into winter for thrushes and other birds when little else is left.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "The name is the story: bears and other mammals eat the mealy red 'bearberries'.", basis: "USDA PLANTS." },
    ],
    "cornus-canadensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Clusters of red bunchberries feed thrushes and other birds of cool northern woods; chipmunks take them too.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "larix-laricina": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Tamarack seeds are a favorite of white-winged crossbills and redpolls in winter.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "pinus-resinosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Red pine seeds feed crossbills and siskins in good cone years.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Red squirrels cut and store the cones for winter.", basis: "USDA Silvics of North America." },
    ],
    "pinus-banksiana": [
      { wildlifeId: "kirtlands-warbler", support: "shelter", reliance: "sole", note: "Kirtland's warbler nests only in young jack pine stands, on the ground under branches that still reach the soil. When the pines grow tall, the birds move on.", basis: "US Fish & Wildlife Service; Cornell Lab of Ornithology." },
      { wildlifeId: "eastern-pine-elfin", support: "host", note: "Pine elfin caterpillars eat the new needles of jack pine.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Crossbills pry seeds from jack pine cones, which can stay shut on the tree for years.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "spiraea-alba": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Meadowsweet's fluffy white spikes flower through midsummer and are worked over by bumble bees.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "rhus-typhina": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The fuzzy red fruit clusters last all winter, eaten by robins and bluebirds when little else is left.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Sweat bees and other small bees crowd the flower spikes in June.", basis: "GloBI — Digital Bee Collections Network; Xerces Society." },
    ],
    "prunus-virginiana": [
      { wildlifeId: "coral-hairstreak", support: "host", reliance: "narrow", note: "Chokecherry is one of the coral hairstreak's few hosts; the caterpillars feed on it at night.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "red-spotted-admiral", support: "host", note: "White admiral caterpillars feed on chokecherry, as they do on other wild cherries.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Tiger swallowtail caterpillars grow up on wild cherry leaves, chokecherry included.", basis: "BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The dark cherries are eaten by robins, thrushes and grosbeaks as soon as they ripen.", basis: "Cornell Lab of Ornithology." },
    ],
    "juniperus-communis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue berry-like cones take two years to ripen and feed waxwings through winter.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins and grouse eat them when snow covers other food.", basis: "USDA Fire Effects Information System." },
    ],
    "rubus-parviflorus": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The soft red berries are eaten by thrushes, catbirds and grouse.", basis: "USDA Fire Effects Information System." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Its big white flowers feed bumble bees all early summer.", basis: "Xerces Society." },
    ],
    "viburnum-acerifolium": [
      { wildlifeId: "spring-azures", support: "host", note: "Azure caterpillars eat viburnum flower buds in spring.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "hummingbird-clearwing", support: "host", reliance: "narrow", note: "Hummingbird clearwing caterpillars feed on viburnum leaves, maple-leaf viburnum among them.", basis: "Wagner, Caterpillars of Eastern North America; BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black berries hang on into winter, eaten by thrushes and grouse.", basis: "USDA Fire Effects Information System." },
    ],
    "allium-tricoccum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Ramps flower in early summer, after the leaves die back, and small bees visit the white heads.", basis: "Xerces Society." },
    ],
    "trillium-grandiflorum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens visit the big white flowers in early spring.", basis: "Xerces Society." },
    ],
    "dicentra-cucullaria": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Only a bumble bee queen is strong enough to pry open the 'breeches' and reach the nectar.", basis: "Xerces Society." },
    ],
    "asclepias-syriaca": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "Common milkweed is the monarch's main host in the north; its caterpillars eat milkweed and nothing else.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The sweet-smelling balls of flowers draw bees and butterflies all July.", basis: "Xerces Society." },
    ],
    "symphyotrichum-cordifolium": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "An aster for shade, flowering in fall when aster-specialist bees are still flying.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Clouds of small lavender flowers feed late bumble bees before winter.", basis: "Xerces Society." },
    ],
    "solidago-flexicaulis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A goldenrod for shade, so specialist bees can find late pollen at the woodland edge too.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
    ],
    "iris-versicolor": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each blue flag flower is a landing pad: a bumble bee follows the veined lines in and brushes the pollen on its way.", basis: "Xerces Society." },
    ],
    "geranium-maculatum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "One mining bee, Andrena distans, collects pollen almost only from wild geranium.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Fowler & Droege." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An early flower of woodland edges, out while the trees are still bare.", basis: "Xerces Society." },
    ],
    "maianthemum-racemosum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The speckled berries turn red in late summer and are eaten by thrushes and grouse.", basis: "USDA Fire Effects Information System." },
    ],
    "verbena-hastata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The thin blue spikes flower a few rings at a time, so there's nectar all summer.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees work the tiny flowers right through summer.", basis: "Xerces Society." },
    ],
    "coreopsis-lanceolata": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Bright yellow sunflower-family heads in early summer, before most of the family is in bloom.", basis: "Fowler & Droege, Pollen Specialist Bees of the Eastern U.S." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches pick the seeds from the dry heads in late summer.", basis: "Cornell Lab of Ornithology." },
    ],
    "andropogon-gerardii": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Big bluestem feeds the caterpillars of several grass skippers and the common wood nymph.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA; Xerces Society." },
    ],
    "lonicera-dioica": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Its yellow-to-red tubes are shaped for hummingbirds, which visit through June.", basis: "Cornell Lab of Ornithology." },
    ],
    "clematis-virginiana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Virgin's bower covers fences in white flowers in late summer, visited by bees of many sizes.", basis: "Xerces Society." },
    ],
    "juniperus-horizontalis": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue berry-like cones on the ground-hugging mats are eaten by waxwings and other birds.", basis: "USDA Fire Effects Information System." },
    ],
    "gaultheria-procumbens": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Wintergreen berries last under the snow and feed chipmunks, mice, deer and foxes in late winter.", basis: "USDA Fire Effects Information System." },
    ],
  },

  pnw: {
    "rubus-parviflorus": [
      { wildlifeId: "echo-azure", support: "host", note: "Thimbleberry is one of the many native shrubs the echo azure lays on — its caterpillars chew the flower buds and young fruit.", basis: "Washington Butterfly Association; BAMONA." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "The soft scarlet raspberries ripen through summer and are a favorite of band-tailed pigeons, which travel the canopy after exactly this kind of fruit.", basis: "WDFW; Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes and tanagers strip the berries as fast as they color.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big open white flowers through late spring, an easy landing pad heavy with pollen for bumble and mason bees.", basis: "Xerces Society." },
    ],
    "berberis-nervosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Upright yellow spikes open in a shaded, early-season gap, feeding bumble bee queens when the forest floor has little else.", basis: "Xerces Society." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "The dusty-blue berries are taken by band-tailed pigeons, robins and waxwings.", basis: "WDFW; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and waxwings work the tart blue fruit in late summer.", basis: "Cornell Lab." },
    ],
    "aruncus-dioicus": [
      { wildlifeId: "mason-bees", support: "nectar", note: "The great cream plumes are a broad, open table of tiny flowers — easy nectar and pollen for solitary bees, in the shade where few big flowers grow.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees and hoverflies work the plumes through early summer.", basis: "Xerces Society." },
    ],
    "sidalcea-campestris": [
      { wildlifeId: "mallow-specialist-bees", support: "nectar", reliance: "narrow", note: "Diadasia nigrifrons collects pollen from Willamette Valley checkermallows and almost nothing else — lose the checkermallow and this bee goes with it.", basis: "USDA Plant Guide (Sidalcea campestris); Xerces Society; Fowler & Droege." },
      { wildlifeId: "painted-lady", support: "host", note: "A mallow, so its leaves are a caterpillar food for the painted lady and West Coast lady.", basis: "USDA Plant Guide; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The pink flower spikes are a heavy summer draw for bumble bees.", basis: "Xerces Society." },
      { wildlifeId: "west-coast-lady", support: "host", note: "West Coast lady caterpillars fold checkermallow leaves into silk tents and eat from inside them.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
      { wildlifeId: "gray-hairstreak", support: "host", note: "Gray hairstreak caterpillars feed on mallow flowers and young seeds, and checkermallow is one they use.", basis: "BAMONA." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Tufted hairgrass raises wood nymphs and several skippers, whose caterpillars overwinter deep in the tussock — reason enough to leave it standing until spring.", basis: "Xerces Society; NWF Native Plant Finder." },
    ],
    "dicentra-formosa": [
      { wildlifeId: "clodius-parnassian", support: "host", reliance: "sole", note: "Bleeding heart is the only thing a Clodius parnassian caterpillar eats — the alkaloids it takes from the leaves make the butterfly itself distasteful to birds.", basis: "BAMONA; PSU Garden Ecology; butterfliesoforegon.com." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Dangling pink hearts from early spring are worked by bumble bee queens strong enough to push into them.", basis: "Xerces Society." },
    ],
    "quercus-garryana": [
      { wildlifeId: "lorquins-admiral", support: "shelter", note: "An oak in a Garry oak meadow is where a Lorquin's admiral sits to watch its patch, dropping off the branch to chase anything that flies through.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "Garry (Oregon white) oak is the sole larval host for the propertius duskywing — no oak, no butterfly.", basis: "Xerces Society; Washington NHP oak-prairie work." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Its acorns feed acorn woodpeckers, jays, and band-tailed pigeons in the West's oak country.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Oak mast is fall food for squirrels, deer, and other mammals.", basis: "USDA PLANTS." },
      { wildlifeId: "polyphemus-moth", support: "host", note: "Oak is a favorite polyphemus food, and Garry oak woodland is one of the places to find this giant silkmoth here.", basis: "BAMONA; Pacific Northwest Moths (Western Washington University)." },
    ],
    "salix-scouleriana": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willows are a primary larval host for the western tiger swallowtail.", basis: "NWF Native Plant Finder; Xerces." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Willow catkins are one of the earliest, richest pollen sources for spring mason and mining bees.", basis: "Xerces Society." },
      { wildlifeId: "polyphemus-moth", support: "host", note: "Willow leaves feed polyphemus caterpillars too, so a willow thicket can raise one of the biggest moths around.", basis: "BAMONA; Pacific Northwest Moths (Western Washington University)." },
    ],
    "salix-lasiandra": [
      { wildlifeId: "lorquins-admiral", support: "host", note: "Streamside willows are one of Lorquin's admiral's caterpillar plants, alongside cottonwood.", basis: "BAMONA; Washington Butterfly Association." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed in groups on willow leaves, and the adults overwinter nearby.", basis: "BAMONA." },
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willows are a main caterpillar plant for the western tiger swallowtail.", basis: "NWF Native Plant Finder; Xerces." },
    ],
    "salix-hookeriana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The furry catkins open in March, among the first pollen a bumble bee queen can find.", basis: "Xerces Society." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed in groups on willow leaves.", basis: "BAMONA." },
    ],
    "salix-sitchensis": [
      { wildlifeId: "lorquins-admiral", support: "host", note: "Sitka willow is one of the willows Lorquin's admiral raises its caterpillars on.", basis: "BAMONA; Washington Butterfly Association." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early catkins feed mason and mining bees in spring.", basis: "Xerces Society." },
    ],
    "populus-trichocarpa": [
      { wildlifeId: "lorquins-admiral", support: "host", reliance: "narrow", note: "Cottonwood is Lorquin's admiral's caterpillar tree. The young larva looks like a bird dropping and overwinters rolled in a leaf it has fastened to the twig so it can't fall.", basis: "GloBI — iNaturalist observation records carrying a larval life stage; BAMONA." },
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Cottonwood is a favored caterpillar tree for the western tiger swallowtail.", basis: "NWF Native Plant Finder." },
    ],
    "acer-macrophyllum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Bigleaf maple is among the trees the western tiger swallowtail's caterpillars use.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its heavy early flower clusters feed newly emerged bees before most plants bloom.", basis: "Xerces Society." },
      { wildlifeId: "polyphemus-moth", support: "host", note: "Bigleaf maple is a polyphemus host; the caterpillars spin a tough cocoon wrapped in a leaf, which falls with it in autumn.", basis: "BAMONA; Pacific Northwest Moths (Western Washington University)." },
    ],
    "holodiscus-discolor": [
      { wildlifeId: "echo-azure", support: "host", note: "Oceanspray is a documented echo azure host — eggs turn up on the flower buds in early spring, and the caterpillars feed on the buds and developing seed.", basis: "Washington Butterfly Association; Xerces Society." },
      { wildlifeId: "variable-checkerspot", support: "nectar", note: "Ocean spray's cream plumes are a checkerspot's refueling stop through the dry part of summer.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "pale-swallowtail", support: "host", reliance: "narrow", note: "Oceanspray is a classic larval host for the pale swallowtail (and the Lorquin's admiral).", basis: "Xerces Society; NWF Native Plant Finder." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Foaming cream flower plumes are covered in bees in early summer.", basis: "Xerces Society." },
    ],
    "ribes-sanguineum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Red spring flowers bloom just as rufous hummingbirds migrate through — a famous, well-timed pairing.", basis: "Audubon; WSU Extension." },
      { wildlifeId: "mason-bees", support: "nectar", note: "An early nectar and pollen source for emerging mason and bumble bee queens.", basis: "Xerces Society." },
    ],
    "aquilegia-formosa": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Nodding red-and-yellow spurs are a hummingbird flower, matched to their spring arrival.", basis: "Audubon; LBJ Wildflower Center." },
    ],
    "lonicera-ciliosa": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Orange trumpet flowers are one of the West's best native hummingbird vines.", basis: "Audubon; WSU Extension." },
    ],
    "penstemon-serrulatus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Blue-purple tubular flowers are heavily worked by bumble bees.", basis: "Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Also visited by hummingbirds probing the deeper flowers.", basis: "WSU Extension." },
    ],
    "camassia-quamash": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Blue spring spikes of camas are a major early nectar and pollen source in western prairies.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Blooms during the solitary-bee nesting window in oak-prairie habitat.", basis: "Xerces Society." },
    ],
    "achillea-millefolium": [
      { wildlifeId: "painted-lady", support: "nectar", note: "Yarrow is a butterfly table: a flat plate of tiny flowers, all reachable at once, and painted ladies stay on one head for minutes.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "variable-checkerspot", support: "nectar", note: "One of the checkerspot's most-recorded nectar plants anywhere in its range.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Flat flower heads are an easy landing pad worked by many small native bees and beneficial insects.", basis: "Xerces Society." },
    ],
    "eriophyllum-lanatum": [
      { wildlifeId: "painted-lady", support: "host", note: "Oregon sunshine is one of the plants painted lady caterpillars grow up on — they live under a tent of silk drawn over the woolly leaves.", basis: "GloBI — iNaturalist observation records carrying a larval life stage; Xerces Society." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A western sunflower-family bloom supporting the region's aster/sunflower pollen specialists.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
    ],
    "arbutus-menziesii": [
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Madrone berries are a signature fall-and-winter food of band-tailed pigeons, which move through the canopy in flocks to strip a laden tree.", basis: "WDFW; Audubon." },
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Madrone leaves feed the silkmoth's caterpillars, which is a rare thing — very little eats an evergreen leaf that tough.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Its little urn-shaped flowers come out in spring and are worked by butterflies as well as bees.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "acorn-birds", support: "berries", note: "Madrone berries are a signature fall-winter food of band-tailed pigeons and are taken by robins and waxwings.", basis: "Audubon; USDA PLANTS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Urn-shaped spring flowers feed bumble bees and other native bees.", basis: "Xerces Society." },
    ],
    "amelanchier-alnifolia": [
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Serviceberry is on the short list of shrubs the big silkmoth will lay on.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Saskatoon serviceberries are a top summer fruit for waxwings and many western songbirds.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, and grosbeaks all take the sweet berries.", basis: "Cornell Lab." },
    ],
    "symphoricarpos-albus": [
      { wildlifeId: "variable-checkerspot", support: "host", reliance: "narrow", note: "Snowberry is one of the few shrubs the variable checkerspot's caterpillars will eat, and they feed in a group inside a web they spin over the shoot.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "The white berries hang on through the winter, and a yellow-rumped warbler is one of the few birds that will take them.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Small pink bell flowers are a summer hummingbird nectar source; the white berries persist for winter birds.", basis: "Audubon; USDA PLANTS." },
      { wildlifeId: "hummingbird-clearwing", support: "host", note: "Snowberry is a clearwing host: its caterpillars eat the leaves, and the adults hover at flowers by day like small hummingbirds.", basis: "GloBI — Hale et al. 2024, terrestrial herbivory food web (Phil. Trans. R. Soc. B); BAMONA." },
    ],
    "gaultheria-shallon": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Salal's dark berries are eaten by robins, thrushes, and grouse — and its flowers feed bees.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "morella-californica": [
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "The waxy berries are a winter staple for yellow-rumped warblers on the coast — few other birds can digest the wax.", basis: "Cornell Lab; USDA NRCS Plant Guide." },
    ],
    "euonymus-occidentalis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Scarlet-coated seeds hang from the split capsules in fall for thrushes and other songbirds.", basis: "OregonFlora; USDA PLANTS." },
    ],
    "taxus-brevifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes swallow the red flesh around each seed in fall; the seed inside passes through.", basis: "USFS FEIS; Cornell Lab." },
    ],
    "sambucus-nigra-caerulea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks strip a fruiting blue elderberry in late summer.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Band-tailed pigeons travel to elderberry crops in late summer.", basis: "WDFW; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Grosbeaks, tanagers and thrushes crowd into it when the berries ripen.", basis: "Cornell Lab." },
    ],
    "arctostaphylos-columbiana": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Anna's hummingbirds work the white bells in early spring, when few other flowers are open.", basis: "Audubon; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens just out of winter feed on the early flowers.", basis: "Xerces Society." },
    ],
    "garrya-elliptica": [
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Female plants carry purple fruit that band-tailed pigeons and thrushes take.", basis: "USFS FEIS; Calscape (CNPS)." },
    ],
    "philadelphus-lewisii": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The scented white flowers in June are worked all day by bumble bees.", basis: "Xerces Society." },
    ],
    "rosa-gymnocarpa": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and grouse eat the small red hips into winter.", basis: "USFS FEIS; Cornell Lab." },
    ],
    "euthamia-occidentalis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Late yellow flowers feed bumble bees into October, when little else is blooming.", basis: "Xerces Society." },
    ],
    "symphyotrichum-chilense": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the last big nectar sources of the year for bumble bees.", basis: "Xerces Society." },
    ],
    "iris-tenax": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees push into the flowers in spring and come out dusted with pollen.", basis: "Xerces Society." },
    ],
    "lilium-columbianum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Rufous hummingbirds feed at the nodding orange flowers in early summer.", basis: "USFS Celebrating Wildflowers." },
      { wildlifeId: "western-tiger-swallowtail", support: "nectar", note: "Swallowtails are among its main pollinators, carrying pollen on their wings.", basis: "USFS Celebrating Wildflowers." },
    ],
    "plectritis-congesta": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A spring meadow of sea blush is busy with bumble bees and small native bees.", basis: "Xerces Society." },
    ],
    "urtica-gracilis": [
      { wildlifeId: "red-admiral", support: "host", note: "Red admiral caterpillars live folded inside nettle leaves, sewn shut with silk.", basis: "BAMONA; Washington Butterfly Association." },
    ],
    "berberis-aquifolium": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bright yellow late-winter flowers are among the very first bee food of the year.", basis: "Xerces Society." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue \"grape\" berries feed waxwings, robins, and towhees.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "asclepias-speciosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "The West's common milkweed, and milkweeds are all a monarch caterpillar can eat — the western monarch population has fallen far enough that every patch counts.", basis: "Xerces Society Western Monarch Count; USDA PLANTS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Heavy pink flower domes are one of the richest nectar sources of high summer for bumble bees.", basis: "Xerces Society." },
    ],
    "prunus-emarginata": [
      { wildlifeId: "lorquins-admiral", support: "host", note: "Bitter cherry is the other tree the admiral will lay on where there is no willow or cottonwood.", basis: "GloBI — Ferrer-Paris et al. 2013 butterfly–host plant associations; BAMONA." },
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Wild cherries are among the western tiger swallowtail's main caterpillar trees.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "pale-swallowtail", support: "host", note: "Bitter cherry is one of the pale swallowtail's larval hosts alongside oceanspray and ceanothus.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The small bitter cherries — inedible to us — are taken by robins, thrushes, and band-tailed pigeons.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "acer-circinatum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Maples are caterpillar trees for the western tiger swallowtail, and vine maple is the one that fits a small garden.", basis: "NWF Native Plant Finder." },
    ],
    "alnus-rubra": [
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Red alder feeds silkmoth caterpillars alongside the finches it feeds in winter — the same tree, two entirely different meals.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Alder's little cone-like catkins hold seed that goldfinches and pine siskins strip through winter.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "rubus-spectabilis": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Magenta flowers open in March, and rufous hummingbirds time their northward arrival to them.", basis: "Audubon; WSU Extension." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "A heavy early crop of orange-to-red berries for thrushes, tanagers, and robins.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "sambucus-racemosa": [
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "In western Oregon, band-tailed pigeons feed heavily on red elderberry — one of the two or three fruits they lean on most through the season.", basis: "WDFW; USFS FEIS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The June avalanche of scarlet berries is stripped by waxwings and band-tailed pigeons within days.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Tanagers, grosbeaks, and thrushes all crowd into a fruiting red elderberry.", basis: "Cornell Lab." },
    ],
    "vaccinium-ovatum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Huckleberry flowers are buzz-pollinated — bumble bees are what actually sets the fruit, with mason and mining bees helping.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Late black berries feed thrushes, towhees, and grouse well into autumn.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "physocarpus-capitatus": [
      { wildlifeId: "variable-checkerspot", support: "nectar", note: "Ninebark's flat white clusters are easy landing for a butterfly, and checkerspots use them heavily in June.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Dense white flower domes in early summer are worked hard by bumble bees and other native bees.", basis: "Xerces Society." },
    ],
    "lonicera-involucrata": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Paired yellow tube flowers run from April into July — a long-season hummingbird nectar plant.", basis: "Audubon; WSU Extension." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Scarlet bracts flag the twin black berries for thrushes, tanagers, and waxwings.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "corylus-cornuta": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Hazelnuts are autumn calories for squirrels and chipmunks, who usually get there first.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Steller's jays and band-tailed pigeons take the nuts — and the jays bury more than they eat.", basis: "Cornell Lab." },
    ],
    "cornus-nuttallii": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Clusters of scarlet fruit are emptied by waxwings and band-tailed pigeons in early autumn.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, and grosbeaks feed heavily on Pacific dogwood fruit.", basis: "Cornell Lab." },
    ],
    "solidago-lepida": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrod is the classic late-season plant for the bees that can only use aster-family pollen.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The late-summer bloom is the biggest single nectar event of the year for bumble bee queens fattening up for winter.", basis: "Xerces Society." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Seed heads left standing carry goldfinches through winter.", basis: "Cornell Lab." },
    ],
    "symphyotrichum-subspicatum": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters and goldenrods are what the aster-family pollen specialists depend on to finish the season.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The last big meal before frost for bumble bees and migrating butterflies.", basis: "Xerces Society." },
    ],
    "lupinus-polyphyllus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Blue spires that bumble bees work all day — lupine flowers only open for an insect heavy enough to trip them.", basis: "Xerces Society." },
    ],
    "anaphalis-margaritacea": [
      { wildlifeId: "american-lady", support: "host", reliance: "narrow", note: "Pearly everlasting is a main caterpillar plant for the American lady, whose young wrap themselves in the woolly leaves and silk.", basis: "BAMONA; Xerces Society." },
    ],
    "elymus-glaucus": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Native bunchgrass is both the caterpillar food and the winter shelter for grass skippers and wood nymphs — a lawn gives them neither.", basis: "Xerces Society; BAMONA." },
    ],
    "festuca-roemeri": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Roemer's fescue is a prairie bunchgrass the grass-feeding butterflies use, in the same oak-prairie habitat the propertius duskywing needs.", basis: "Xerces Society; Washington NHP oak-prairie work." },
    ],
    "pseudotsuga-menziesii": [
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Douglas-fir is one of the trees the ceanothus silkmoth's caterpillars accept — a palm-sized moth with no mouth, which spends its whole adult life on what it ate as a larva here.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Red crossbills are tied to Douglas-fir here more closely than to any other tree — whole populations have their own bill size and their own flight call for its cones, and a flock working the crown of one big fir is a Pacific Northwest sound.", basis: "Cornell Lab; USDA Silvics of North America." },
      { wildlifeId: "pine-white", support: "host", note: "Pine white caterpillars eat Douglas-fir needles as well as pine, so a big fir can raise them too.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
      { wildlifeId: "douglas-squirrel", support: "seeds", note: "The squirrel is named for the same botanist as the tree, and lives on its cones; heaps of stripped scales mark its favorite perch.", basis: "Smith 1970, pine squirrels and conifers (Ecological Monographs); Washington Department of Fish & Wildlife." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Chickadees forage along Douglas-fir branches all year, gleaning insects from the needles.", basis: "GloBI — iNaturalist observation records; Cornell Lab of Ornithology." },
    ],
    "tsuga-heterophylla": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Hemlock cones are barely an inch long, so it is the small finches that get the most out of them — pine siskins work the drooping branch tips all winter, with chickadees following on behind.", basis: "Cornell Lab; USDA Silvics of North America." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Western hemlock forest is this chickadee's heartland; it feeds in the drooping branch tips, often hanging upside down.", basis: "GloBI — iNaturalist observation records; Cornell Lab of Ornithology." },
    ],
    "thuja-plicata": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redcedar's little seed cones are fine work for siskins and other small finches, and the tree gives them the other half of what they need too: dense evergreen cover to sit out a wet winter in.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink bell flowers in earliest spring feed emerging bumble bee queens and mason bees before much else is open.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Red berries hang on into winter for grouse, robins, and towhees when little else is left.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "viola-adunca": [
      { wildlifeId: "greater-fritillaries", support: "host", reliance: "sole", note: "Violets are the only thing a greater fritillary caterpillar can eat — the hydaspe, the zerene, the great spangled, and the threatened Oregon silverspot on the coast. And the way they use the plant is unusual enough to change how you garden for them: the female lays in late summer on dry ground beside violets that have already withered, so she is not choosing a plant in leaf, she is choosing a place she has found violets before. The caterpillar hatches, eats nothing, and spends the whole winter in the litter — then goes looking for violet leaves the following spring. So it is not enough for the patch to flower once. It has to still be there in April, in the same square meter.", basis: "Xerces Society; BAMONA; US Fish & Wildlife Service Oregon silverspot recovery plan." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The little purple spring flowers are shallow and open early, which suits the small solitary bees out before most shrubs bloom.", basis: "Xerces Society." },
    ],
    "crataegus-douglasii": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The dark haws hang on well past the leaves, so a black hawthorn is still feeding waxwings and robins in the weeks when the summer fruit is long gone.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "shelter", note: "Thorns are the point: a thicket of them is one of the few places a small bird can build where a cat, a jay, or a crow can't easily follow.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Heavy May blossom, flat and open, feeds mason and mining bees at the height of the nest-provisioning season.", basis: "Xerces Society." },
    ],
    "malus-fusca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Crabapple blossom is what orchardists rent mason bees for — an April crowd of white-pink flowers arriving exactly as the bees emerge.", basis: "Xerces Society." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The little tart apples soften rather than drop, and waxwings work them through the first hard weather.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, grosbeaks, and thrushes take the fruit; foxes and bears clean up what falls.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "betula-papyrifera": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins fall apart over the winter into seed so fine that only the small finches bother with it — pine siskins and redpolls hang upside down along the outer twigs to get at it, usually in one noisy party.", basis: "Cornell Lab; USDA Silvics of North America." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Birch is one of the handful of trees a mourning cloak will lay on, and it lays in a band round a twig so the caterpillars feed as a black spiny crowd. The butterfly that comes out of it is the one flying in February, having spent the winter behind loose bark.", basis: "BAMONA; Xerces Society." },
    ],
    "oemleria-cerasiformis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A bumble bee queen comes up out of the ground on the first warm day of February with her winter fat nearly gone, and she has days — not weeks — to find sugar before she can start a nest at all. Osoberry is what is open. That single fact is the whole reason this plant is on the list.", basis: "Xerces Society; WSU Extension." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Mason and mining bees work the dangling bells too, along with the first hoverflies — the earliest solitary-bee food in the region other than hazel.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small blue-black plums ripen in June for robins, waxwings, and towhees, usually before a person gets to taste one.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "sedum-oreganum": [
      { wildlifeId: "mosses-elfin", support: "host", reliance: "sole", note: "Moss's elfin caterpillars eat native stonecrops and nothing else, and they eat the flowers and developing seed rather than the fleshy leaves. It is a butterfly of rock — a wall, an outcrop, a gravel roof — so this is one of the few plants that turns genuinely hostile ground into habitat.", basis: "Xerces Society; BAMONA." },
    ],
    "eriogonum-umbellatum": [
      { wildlifeId: "buckwheat-butterflies", support: "host", reliance: "narrow", note: "Buckwheats carry a whole cast of small butterflies almost nobody notices — the blues and the green hairstreaks — and several of them will lay on buckwheat and nothing else. A patch on a hot poor bank does more for them than a bed of nectar flowers would.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flat cream-to-rust flower heads run right through the driest part of summer, when a dry slope has almost nothing else open on it.", basis: "Xerces Society." },
    ],
    "carex-obnupta": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Several of the small brown skippers and satyrs grow up on sedges rather than grasses, and they spend the winter as caterpillars down inside the clump. A mown edge gives them neither the food nor the place to sit out the cold.", basis: "Xerces Society; BAMONA." },
    ],
    "spiraea-douglasii": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The rose-pink spires stand up through July and August — the thinnest stretch of the nectar year here — and bumble bees work them from first light.", basis: "Xerces Society." },
    ],
    "rubus-ursinus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The white spring flowers are open, shallow, and everywhere at once, which makes trailing blackberry one of the easiest big meals of the year for bumble bees and small native bees alike.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Towhees, thrushes, and jays take the small dark berries, and the low prickly tangle underneath is where a ground-nesting bird can actually get away with nesting.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "clematis-ligusticifolia": [
      { wildlifeId: "annas-rufous-hummingbird", support: "shelter", note: "After flowering it goes silvery with feathery seed plumes, and hummingbirds pull them off to line the inside of a nest the size of a walnut. Bushtits and warblers take them too. It is the rare plant that is worth more to a bird after the flowers are finished than during them.", basis: "Audubon; WSU Extension." },
    ],
    "cornus-sericea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The white late-summer berries are high-fat fruit arriving exactly as the songbirds start moving south — waxwing flocks can empty a thicket in an afternoon.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, and flickers all feed on red-osier fruit, and the thicket itself is nesting cover on a wet edge where little else grows.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "fraxinus-latifolia": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Oregon ash is one of the western tiger swallowtail's caterpillar trees, alongside the willows and cottonwoods it grows beside on a floodplain.", basis: "BAMONA; NWF Native Plant Finder." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Ash hangs its papery seed keys in bunches well into winter, and goldfinches, siskins, and grosbeaks work them off the bare branches.", basis: "Cornell Lab; USDA Silvics of North America." },
    ],
    "rosa-nutkana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A wild rose is a single open bowl with the pollen in plain reach, so a bee can actually use it — which a double garden rose, for an insect, is not.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The fat hips hold on through the winter for robins, towhees, and grouse, and the thorny thicket is deep nesting cover.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "ceanothus-sanguineus": [
      { wildlifeId: "echo-azure", support: "host", note: "Ceanothus is a favorite of the echo azure too; its little caterpillars feed among the frothy flower clusters.", basis: "Washington Butterfly Association; BAMONA." },
      { wildlifeId: "pale-swallowtail", support: "host", reliance: "narrow", note: "Ceanothus is the pale swallowtail's classic caterpillar plant, and this is the west side's own species of it.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "ceanothus-silkmoth", support: "host", reliance: "narrow", note: "The West's giant silkmoth is named after this shrub: the fat green caterpillars grow up on ceanothus and spin their cocoons in it.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Foaming white flower clusters in late spring, worked steadily by mason and mining bees.", basis: "Xerces Society." },
      { wildlifeId: "california-tortoiseshell", support: "host", reliance: "narrow", note: "Redstem ceanothus is a main host here; in boom years its caterpillars strip whole shrubs, which leaf out again.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
    ],
    "vaccinium-parvifolium": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small translucent red huckleberries through late summer for thrushes, towhees and grouse — and for anyone who gets there first.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Nodding pink-green bells open in April, while the solitary bees are provisioning and most shrubs are still bare.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Blueberry-family flowers need a bumble bee's buzz to shake the pollen loose, which is why she is the one you see on them.", basis: "Xerces Society; USDA NRCS." },
    ],
    "frangula-purshiana": [
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Cascara is the other pillar of the band-tailed pigeon's Northwest diet — its berries taken as they blacken in late summer.", basis: "WDFW; USFS FEIS." },
      { wildlifeId: "pale-swallowtail", support: "host", note: "Cascara is one of the pale swallowtail's caterpillar trees, alongside oceanspray and ceanothus.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Berries turn red then black in late summer and are stripped by band-tailed pigeons, robins and thrushes — which is how cascara seedlings arrive in a garden.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Small green flowers that look like nothing and are covered in bees, hoverflies and predatory wasps.", basis: "Xerces Society." },
    ],
    "pinus-ponderosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Big pine seeds are what crossbills, nuthatches and siskins work a cone for.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-birds", support: "shelter", note: "Furrowed bark is where brown creepers wedge their nests, and an old ponderosa snag is woodpecker country for decades.", basis: "Cornell Lab; USFS Silvics." },
      { wildlifeId: "pine-white", support: "host", note: "Ponderosa pine is the pine white's main tree; in some summers its caterpillars are so many they brown whole stands.", basis: "BAMONA; USDA Forest Service." },
    ],
    "grindelia-integrifolia": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "It flowers from July into October, weeks after the rest of the region has finished — the last full meal of the year for the bees that collect sunflower-family pollen and nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the gummy seed heads through the winter if the stems are left standing.", basis: "Cornell Lab." },
    ],
    "chamaenerion-angustifolium": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the great northern honey plants: the spike opens from the bottom upward through July and August, so a single plant feeds bees for weeks.", basis: "Xerces Society; USDA NRCS." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds work the magenta spires in high summer, after the spring currants are done.", basis: "Audubon; Cornell Lab." },
      { wildlifeId: "white-lined-sphinx", support: "host", note: "Fireweed is a white-lined sphinx host; its big striped caterpillars feed in the open on the leaves.", basis: "BAMONA." },
    ],
    "trillium-ovatum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early bumble bee queens and beetles work the March flowers, when a forest floor has almost nothing else open.", basis: "Xerces Society." },
    ],
    "erythronium-oregonum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Among the first real nectar on the west side, timed for the queen bumble bees just out of hibernation.", basis: "Xerces Society." },
    ],
    "tiarella-trifoliata": [
      { wildlifeId: "mason-bees", support: "nectar", note: "A long shade bloom from May into August for the small solitary bees and hoverflies that have little else under a closed canopy.", basis: "Xerces Society." },
    ],
    "heracleum-maximum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A landing platform the size of a plate, held at chest height — hoverflies, soldier beetles, small solitary bees and the parasitic wasps that keep aphids down all use it.", basis: "Xerces Society; UC ANR IPM." },
      { wildlifeId: "anise-swallowtail", support: "host", note: "Carrot-family leaves are what anise swallowtail caterpillars eat, and this is the biggest native umbel on the west side.", basis: "BAMONA." },
    ],
    "maianthemum-dilatatum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Speckled red berries in late summer for thrushes and towhees working a forest floor.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small white flower spikes for the little solitary bees and hoverflies of deep shade.", basis: "Xerces Society." },
    ],
    "linnaea-borealis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Paired, faintly vanilla-scented bells held at exactly the height that suits the very small bees of a shaded forest floor.", basis: "Xerces Society." },
    ],
    "fragaria-chiloensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "White spring flowers low to the ground, opening with the first solitary bees and easy for a small one to work.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small deep-red strawberries in summer for towhees, robins, and sparrows — and for whoever gets there first.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "rhododendron-macrophyllum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower is built to be pushed apart by something heavy, and in these woods that something is a bumble bee queen — she is the main pollinator of the wild rhododendron.", basis: "Xerces Society; OSU Extension." },
    ],
    "pinus-contorta": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Small cones that stay on the tree, which is what suits a crossbill: it works them where they hang rather than waiting for them to drop.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "pine-white", support: "host", note: "Shore pine's short needles feed pine white caterpillars, and the butterflies drift around it in late summer.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
    ],
    "picea-sitchensis": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Papery spruce seed is winter food for siskins and crossbills, and the deep furrowed bark of an old coastal spruce is where brown creepers wedge a nest.", basis: "Cornell Lab; USFS Silvics of North America." },
      { wildlifeId: "douglas-squirrel", support: "seeds", note: "On the coast, Sitka spruce cones are a main winter food, cut and stored by the squirrel each autumn.", basis: "Smith 1970, pine squirrels and conifers (Ecological Monographs); Washington Department of Fish & Wildlife." },
    ],
    "viola-glabella": [
      { wildlifeId: "greater-fritillaries", support: "host", reliance: "sole", note: "Violets are the only thing a greater fritillary caterpillar can eat, and this is the one for damp shade — a violet patch under trees reaches a part of a garden the dry-meadow violet never will.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow yellow flowers that open early and stay open in shade, which suits the small solitary bees out before the shrubs bloom.", basis: "Xerces Society." },
    ],
    "petasites-frigidus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in February on bare stalks, in the weeks when a queen out of hibernation has to feed before she can start a colony at all.", basis: "Xerces Society Maritime Northwest planting guide." },
    ],
    "danthonia-californica": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "A prairie bunchgrass is caterpillar food and winter shelter at once: skippers and wood-nymphs feed on the blades and sit out the cold inside the tuft.", basis: "Xerces Society; BAMONA." },
    ],
    "koeleria-macrantha": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Small native bunchgrasses on dry ground are where several skippers lay; the caterpillars live in rolled leaf shelters at the base.", basis: "Xerces Society; BAMONA." },
    ],
    "calamagrostis-nutkaensis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "A coastal tussock that stays green all year, so grass-feeding caterpillars have food and cover on a bluff where little else grows.", basis: "Xerces Society; BAMONA." },
    ],
    "carex-pansa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Some skippers and satyrs grow up on sedges rather than grasses. A sedge lawn left a little long gives them a place to feed and overwinter that turf never does.", basis: "Xerces Society; BAMONA." },
    ],
    "carex-densa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Sedge-feeding skippers and satyrs overwinter as caterpillars down in the clump, so leave it standing until spring.", basis: "Xerces Society; BAMONA." },
    ],
    "vancouveria-hexandra": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Tiny white flowers on wiry stems in late spring, for the small solitary bees of shady woods.", basis: "Xerces Society." },
    ],
    "clinopodium-douglasii": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small white mint flowers from June into September, for small native bees and hoverflies at the woodland edge.", basis: "Xerces Society." },
    ],
    "cornus-unalaschkensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Clusters of bright red berries in late summer, low enough for thrushes and grouse working the forest floor.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers in April and May, low and easy for the smallest solitary bees.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Tiny, very sweet strawberries in early summer for towhees, robins and sparrows.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "pinus-monticola": [
      { wildlifeId: "pine-white", support: "host", note: "Pine white caterpillars feed on the soft blue-green needles, and the white butterflies flutter around the crown in late summer.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
      { wildlifeId: "douglas-squirrel", support: "seeds", note: "The long cones are a Douglas squirrel staple: it cuts them green, buries them in damp piles, and eats the seed through winter.", basis: "Smith 1970, pine squirrels and conifers (Ecological Monographs); USFS Fire Effects Information System." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Crossbills and pine siskins pry the winged seed out of open cones high in the tree.", basis: "USFS Fire Effects Information System; Cornell Lab of Ornithology." },
    ],
    "abies-grandis": [
      { wildlifeId: "pine-white", support: "host", note: "Grand fir is one of the few non-pines the pine white lays on; its caterpillars eat the flat, glossy needles.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
      { wildlifeId: "douglas-squirrel", support: "seeds", note: "Fir cones fall apart on the branch, so the squirrel races to cut them while green and stores them before the seed is gone.", basis: "Smith 1970, pine squirrels and conifers (Ecological Monographs); USFS Fire Effects Information System." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Chickadees work the dense fir boughs year-round for insects, and the tree's shelter carries them through cold rain.", basis: "Cornell Lab of Ornithology." },
    ],
    "acer-glabrum": [
      { wildlifeId: "polyphemus-moth", support: "host", note: "Maple leaves are among the polyphemus caterpillar's foods; look for a fat green caterpillar the size of a finger in late summer.", basis: "BAMONA; Pacific Northwest Moths (Western Washington University)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small greenish-yellow flowers open with the leaves in spring, visited by mining bees.", basis: "GloBI — Ecdysis arthropod occurrence portal; Xerces Society." },
    ],
    "lonicera-hispidula": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Clusters of pink tubes in early summer, worked by hummingbirds through the day.", basis: "Audubon; Cornell Lab of Ornithology." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Translucent red berries in autumn for thrushes and robins.", basis: "Cornell Lab of Ornithology." },
      { wildlifeId: "hummingbird-clearwing", support: "host", note: "Honeysuckle is a clearwing host, so this vine can raise the moth as well as feed hummingbirds.", basis: "BAMONA." },
    ],
    "vaccinium-ovalifolium": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Black bears fatten on huckleberries in late summer, and deer browse the shrubs.", basis: "USFS Fire Effects Information System." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and robins strip the dusty-blue berries as they ripen.", basis: "USFS Fire Effects Information System; Cornell Lab of Ornithology." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens shake pollen out of the pink bells in early spring, which also sets the fruit.", basis: "Xerces Society." },
    ],
    "vaccinium-membranaceum": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Black huckleberry is one of the most important late-summer foods for black bears in the Cascades.", basis: "USFS Fire Effects Information System." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and grouse take the sweet purple-black berries.", basis: "USFS Fire Effects Information System; Cornell Lab of Ornithology." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees buzz-pollinate the small bell flowers; without them, few berries set.", basis: "Xerces Society; USFS Fire Effects Information System." },
    ],
    "rubus-leucodermis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The dark berries go fast to robins, thrushes and towhees.", basis: "Cornell Lab of Ornithology; USDA PLANTS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees and mining bees work the white flowers in late spring.", basis: "Xerces Society." },
    ],
    "tellima-grandiflora": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Tall spikes of fringed bells in spring shade, visited by small native bees.", basis: "Xerces Society." },
    ],
    "geum-macrophyllum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small yellow saucers through summer in damp shade, open for small bees and hoverflies.", basis: "Xerces Society." },
    ],
    "primula-hendersonii": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Shooting stars hold their pollen locked inside; a bumble bee hangs on and buzzes to shake it out. Few other insects can.", basis: "Xerces Society; USDA Forest Service, Celebrating Wildflowers." },
    ],
    "heuchera-micrantha": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Sprays of tiny white flowers held above the leaves, sized for small solitary bees on a shaded bank.", basis: "Xerces Society." },
    ],
    "lomatium-utriculatum": [
      { wildlifeId: "anise-swallowtail", support: "host", note: "Lomatiums are the anise swallowtail's wild hosts here; its caterpillars eat the lacy leaves in spring.", basis: "BAMONA; Pyle, Butterflies of Cascadia." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early yellow flower heads feed mining bees, including some that collect pollen mostly from lomatiums.", basis: "Xerces Society; Oregon Bee Atlas." },
    ],
    "oxalis-oregana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink-veined flowers on the forest floor for months, feeding small bees that live in the shade.", basis: "Xerces Society." },
    ],
    "claytonia-sibirica": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink-striped flowers from spring into summer, visited by small bees and hoverflies in damp shade.", basis: "Xerces Society." },
    ],
  },

  "ca-central-coast": {
    "quercus-agrifolia": [
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "The propertius duskywing lays on oak and nothing else, and its caterpillars overwinter rolled up in the fallen leaves — which is the argument for leaving the litter where it falls under the tree.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "A chickadee pair works the new oak leaves from dawn all through spring, because a brood of nestlings needs thousands of caterpillars and an oak is where they are.", basis: "Cornell Lab; Tallamy, caterpillar-provisioning research." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Acorn woodpeckers drill storage granaries full of them and scrub-jays bury thousands each autumn, planting the next generation of oaks by forgetting where.", basis: "Cornell Lab; UC Oak Woodland Management." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Ground squirrels, dusky-footed woodrats and deer all live off the acorn crop through the autumn.", basis: "USDA PLANTS; UC ANR." },
      { wildlifeId: "bushtit", support: "shelter", note: "Coast live oak is the bushtit's tree above all others: it feeds in the canopy and hangs its long woven sock of a nest from an outer branch.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "california-sister", support: "host", reliance: "narrow", note: "Coast live oak is a main host: the spiny green caterpillars eat its leathery leaves, and the adults sail around the canopy.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); BAMONA." },
      { wildlifeId: "mournful-duskywing", support: "host", reliance: "narrow", note: "Mournful duskywing caterpillars live in folded live-oak leaves, and the butterflies fly here in almost every month.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); BAMONA." },
      { wildlifeId: "band-tailed-pigeon", support: "seeds", note: "Band-tailed pigeons swallow acorns whole, and flocks move from oak to oak through autumn and winter.", basis: "Cornell Lab of Ornithology." },
    ],
    "quercus-lobata": [
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "Oak leaves and nothing else, on the valley oak just as on the live oak — and the caterpillars spend the winter in the leaf litter underneath.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "The long pointed acorns are the ones the jays and acorn woodpeckers want most; a single old valley oak can feed a neighborhood of them.", basis: "Cornell Lab; UC Oak Woodland Management." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Woodrats, ground squirrels and deer take the crop, and an old hollow trunk becomes a woodrat house in its own right.", basis: "UC ANR; USFS FEIS." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Chickadees and titmice hunt caterpillars through the new leaves in spring and nest in the cavities an old valley oak accumulates.", basis: "Cornell Lab." },
      { wildlifeId: "mournful-duskywing", support: "host", reliance: "narrow", note: "Valley oak feeds mournful duskywing caterpillars too; they hide in leaves they fold shut with silk.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "band-tailed-pigeon", support: "seeds", note: "The big acorns are a fall feast for band-tailed pigeons, which swallow them whole.", basis: "Cornell Lab of Ornithology." },
    ],
    "sequoia-sempervirens": [
      { wildlifeId: "band-tailed-pigeon", support: "shelter", note: "Band-tailed pigeons perch and roost high in redwood crowns and drop down to feed elsewhere — the tree is the safe place, not the food.", basis: "Cornell Lab; Audubon California." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "This is the chickadee's home forest: it forages along the sprays of foliage all year and nests in soft rotten wood in a dead limb.", basis: "Cornell Lab; Audubon California." },
    ],
    "pseudotsuga-menziesii": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Red crossbills are tied to Douglas-fir more closely than to any other tree — a flock working the crown of one big fir is a sound of these coast ranges.", basis: "Cornell Lab; USDA Silvics of North America." },
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Douglas-fir is one of the trees the ceanothus silkmoth's caterpillars accept — a palm-sized moth with no mouth, which lives its whole adult life on what it ate as a larva.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Chickadees work the needle sprays for insects right through the winter, hanging upside-down at the branch tips where nothing heavier can reach.", basis: "Cornell Lab." },
    ],
    "hesperocyparis-sargentii": [
      { wildlifeId: "juniper-hairstreak", support: "host", reliance: "sole", note: "The juniper hairstreak's caterpillars eat cypress and juniper foliage and nothing else. It is the same green as the leaves and sits dead still on them, so the way to find one is to tap a branch and watch what flies out.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "The little round cones break down into fine seed the goldfinches pick out on the branch, hanging sideways to reach it.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bushtit", support: "shelter", note: "Dense evergreen foliage on a hot poor slope is roosting and nesting cover a grassland otherwise has none of.", basis: "Cornell Lab." },
    ],
    "arbutus-menziesii": [
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Madrone berries in autumn are a band-tailed pigeon staple — a fruiting tree pulls flocks in from a long way off and they strip it in days.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings, robins and varied thrushes work the same orange-red crop, usually arriving after the pigeons have had the best of it.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Urn-shaped spring flowers a bumble bee has to buzz to shake the pollen loose from — a trick the honey bee cannot do.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds take the hanging urns too, working up a spray from underneath.", basis: "Audubon California." },
    ],
    "umbellularia-californica": [
      { wildlifeId: "pale-swallowtail", support: "host", note: "California bay is one of the handful of trees the pale swallowtail's caterpillars grow up on — the big pale-and-black butterfly patrolling a canyon in early summer came off one of these.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "The olive-like fruits are a staple: band-tailed pigeons will cross a valley for a bay tree in fruit and strip it.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, robins and jays take the fruits through autumn, and the dense evergreen canopy is a favorite winter roost.", basis: "Cornell Lab." },
    ],
    "aesculus-californica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Foot-long candles of flower in May and June, at the exact moment the spring shrubs have finished and the summer ones have not started — the native bees that evolved with it work it hard.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "pale-swallowtail", support: "nectar", note: "Big swallowtails feed at the flower spikes with their wings still beating, working up one candle and on to the next.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "anise-swallowtail", support: "nectar", note: "A hilltopping swallowtail comes down to a buckeye in flower between patrols, and stays a while.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and woodrats take the big glossy seeds, which is most of how a buckeye gets anywhere, since they are far too heavy to blow.", basis: "USFS FEIS; UC ANR." },
    ],
    "acer-macrophyllum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Bigleaf maple is one of the main caterpillar trees of the big yellow swallowtail you see sailing along a creek in summer.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Hanging chains of yellow-green flowers in March are early, rich and easy to reach — mason bees and mining bees are all over them.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Maple carries one of the West's heaviest caterpillar loads, which is exactly what a chickadee is hunting through the canopy in spring.", basis: "Cornell Lab." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches and grosbeaks work the winged seeds as they ripen in late summer.", basis: "Cornell Lab." },
    ],
    "alnus-rhombifolia": [
      { wildlifeId: "lorquins-admiral", support: "host", note: "Lorquin's admiral — the brown butterfly with white bands that patrols a creek and chases everything that passes — grows up on willow and alder along the water.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Pine siskins swarm a fruiting alder in winter, hanging upside-down off the little woody cones for the seed inside.", basis: "Cornell Lab." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Goldfinches work the same cones alongside the siskins, and both come back to the same tree day after day.", basis: "Cornell Lab; GloBI — iNaturalist observation records." },
    ],
    "salix-lasiolepis": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willow is the main caterpillar tree of the big yellow swallowtail of these creeks.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed together in a spiny black huddle on willow — and the adults overwinter here rather than migrating, so they are the first butterfly of the year.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "lorquins-admiral", support: "host", note: "The other creek-side admiral: it lays on willow, and the adults spend the summer defending a stretch of stream bank.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "February catkins are the richest early pollen in the region, opening exactly when the solitary bees come out.", basis: "Xerces Society." },
    ],
    "sambucus-nigra-caerulea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "A waxwing flock finds an elderberry in fruit and takes the crop in an afternoon, passing berries down the line to each other as they go.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, grosbeaks, orioles and mockingbirds are on it from midsummer — around forty bird species take elderberry across its range.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The huge flat flower heads feed bumble bees, hoverflies, beetles and dozens of small native bee species at once.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "ceanothus-thyrsiflorus": [
      { wildlifeId: "ceanothus-silkmoth", support: "host", reliance: "narrow", note: "The moth is named after this shrub and the connection is real: its caterpillars grow up on ceanothus, spin a papery cocoon on a stem, and emerge as a palm-sized moth with no mouth and about a week to find a mate.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); Xerces Society." },
      { wildlifeId: "echo-azure", support: "host", note: "The echo azure lays on the flower buds, so its caterpillars eat the blossom rather than the leaves — which is why the butterfly appears exactly when the shrub turns blue.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "For three weeks in spring the whole shrub hums: bumble bees, mining bees, hoverflies and beetles at once, and nothing else in the garden comes close.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The flowers are tiny and shallow, which suits the small solitary bees that cannot reach into anything deeper.", basis: "Xerces Society." },
      { wildlifeId: "california-quail", support: "shelter", note: "A dense young ceanothus is exactly the low thick cover a quail covey will cross open ground to reach.", basis: "Cornell Lab; Audubon California." },
      { wildlifeId: "california-tortoiseshell", support: "host", reliance: "narrow", note: "Blueblossom is a California tortoiseshell host; its spiny black caterpillars feed in groups on the leaves.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly–host plant associations; BAMONA." },
    ],
    "arctostaphylos-manzanita": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "It flowers from Christmas into March, which on this coast is when Anna's hummingbird is already nesting — a big manzanita is a territory a bird will hold against all comers.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The first bumble bee queens out of hibernation go straight to manzanita, because in February there is very little else.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The little apple-like fruits go to thrashers, robins and towhees, and what they miss the foxes and coyotes take.", basis: "USFS FEIS; Cornell Lab." },
      { wildlifeId: "bushtit", support: "shelter", note: "Bushtits and wrentits nest in the branch structure and work through it all year after insects.", basis: "Cornell Lab." },
    ],
    "heteromeles-arbutifolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Toyon holds its red berries until midwinter and then a waxwing flock arrives and strips the shrub in a day.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, mockingbirds and band-tailed pigeons work the same crop from December onward — the reason it was ever called Christmas berry.", basis: "Cornell Lab." },
      { wildlifeId: "american-lady", support: "nectar", note: "Toyon's white flower heads open in the hottest weeks of summer, when a butterfly has few other options.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Midsummer flower heads carry bees and beetles through the thinnest weeks of the year.", basis: "Xerces Society." },
    ],
    "frangula-californica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flowers look like nothing and are covered from May onward in native bees, hoverflies and the tiny wasps that keep garden pests down.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "pale-swallowtail", support: "host", note: "Coffeeberry is one of the plants the pale swallowtail's caterpillars accept, along with the bay and the ceanothus it grows among.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Berries turn red then black through autumn for robins, thrashers, jays and mockingbirds, on a shrub dense enough for them to nest inside.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "ribes-sanguineum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hanging pink tassels from January — on this coast that is exactly when Anna's is nesting and the rufous hummingbirds are arriving from the south, and for a few weeks this shrub is most of what they have.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Early solitary bees work the tassels alongside the hummingbirds, weeks before the orchard trees open.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The blue-black berries in summer go to thrushes, robins and towhees.", basis: "Cornell Lab." },
    ],
    "ribes-speciosum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Rows of red tubes hanging under every arching branch in January and February, built for a hummingbird and used by little else. Anna's will defend a big one.", basis: "Audubon California; Xerces Society." },
      { wildlifeId: "bushtit", support: "shelter", note: "The spiny thicket is safe nesting cover for bushtits, wrentits and towhees.", basis: "Cornell Lab." },
    ],
    "baccharis-pilularis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The thing that matters is *when*: coyote brush flowers from September to December, after everything else has finished, and a big one in October is louder than any spring shrub.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs heading for the overwintering groves along this coast in autumn feed on coyote brush on the way — it is often the last full meal available.", basis: "Xerces Society (Western Monarch Count); Cornell Lab." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Painted ladies and other late butterflies crowd onto the flat cream flower heads through the autumn.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "california-quail", support: "shelter", note: "A stand of coyote brush is the cover a quail covey lives in — dense at the bottom, open enough underneath to run through.", basis: "Cornell Lab; Audubon California." },
    ],
    "diplacus-aurantiacus": [
      { wildlifeId: "variable-checkerspot", support: "host", reliance: "narrow", note: "The variable checkerspot lays on a short list of plants and monkeyflower is one of the main ones here — the spiny black caterpillars feed in a group and are easy to find once you know the leaf.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower is a tube a bumble bee has to force its way into, and it is open from March to August.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds take it too, working along a bank of monkeyflower flower by flower.", basis: "Audubon California." },
    ],
    "vaccinium-ovatum": [
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "Huckleberry carries one of the heaviest caterpillar loads of any shrub in the West, which is what the chickadees are working over in a coastal hedge all spring.", basis: "Cornell Lab; Tallamy/NWF keystone lists." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bell-shaped flowers a bumble bee buzzes to shake the pollen out of — a trick honey bees cannot do.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Band-tailed pigeons come to huckleberry in late summer and take the fruit whole.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins and thrushes work the same crop into autumn, and generally beat you to it.", basis: "Cornell Lab." },
    ],
    "gaultheria-shallon": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Rows of little pink urns in spring, which a bumble bee works hanging upside-down underneath.", basis: "Xerces Society." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Salal berries in late summer are a staple for band-tailed pigeons in the fog-belt forests.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes and towhees take the dark fruit, and the thicket underneath is where they nest.", basis: "Cornell Lab." },
    ],
    "corylus-cornuta": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Jays and woodpeckers take the nuts as soon as they fill, usually well before you get to them.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels and woodrats cache hazelnuts, and the ones they forget are how a hazel gets planted.", basis: "USFS FEIS." },
      { wildlifeId: "chestnut-backed-chickadee", support: "shelter", note: "A heavy caterpillar plant, so a chickadee works a hazel thoroughly in spring — soft leaves, plenty on them.", basis: "Cornell Lab." },
    ],
    "holodiscus-discolor": [
      { wildlifeId: "echo-azure", support: "host", note: "The echo azure lays on the flower buds of oceanspray, so the caterpillars eat the blossom — one of the reasons the butterfly appears exactly when the plumes open.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "variable-checkerspot", support: "host", note: "Oceanspray is one of the woody plants the variable checkerspot's caterpillars will take, alongside the monkeyflower and the bee plant.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "In late June the plumes are solid with small native bees and hoverflies, at the point in summer when the spring shrubs have finished.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the plumes too, and the dry seed heads left standing carry insects through the winter.", basis: "Xerces Society." },
    ],
    "symphoricarpos-albus": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Small pink bells in summer that hummingbirds work along a shaded fence line.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are the main visitors — the flower is deep and narrow and suits a long tongue.", basis: "Xerces Society." },
      { wildlifeId: "variable-checkerspot", support: "host", note: "Snowberry is one of the plants the checkerspot's caterpillars accept, which is a lot to ask of a shrub that also grows in dry shade.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "california-quail", support: "berries", note: "The white berries hang on through the winter as the emergency ration — quail, robins and waxwings take them in late winter when everything better has gone.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "garrya-elliptica": [
      { wildlifeId: "bushtit", support: "shelter", note: "Dense evergreen structure on a wind-scoured slope, which is winter shelter and nesting cover when little else there is thick enough.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The purple fruits on the female plants go to thrushes and band-tailed pigeons in late summer.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "rosa-californica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Open single flowers all summer, worked for pollen by bumble bees and dozens of smaller native bees — a garden rose with a packed double flower gives them nothing.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Leafcutter bees cut neat semicircles out of rose leaves to line their nest cells — the notches are a sign the garden is working, not a pest.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The hips hold into midwinter and waxwings, robins and quail work through them when the softer fruit has gone.", basis: "Cornell Lab." },
      { wildlifeId: "california-quail", support: "shelter", note: "A rose thicket is where the small birds nest and the quail run — thorny enough that almost nothing follows them in.", basis: "Cornell Lab; Audubon California." },
    ],
    "lupinus-albifrons": [
      { wildlifeId: "lupine-blues", support: "host", reliance: "sole", note: "The lupine blues lay on lupines and their caterpillars eat lupine leaves and nothing else. On the hills around San Francisco Bay that includes the mission blue, which survives on a handful of hillsides and needs exactly this plant to be there.", basis: "US Fish & Wildlife Service (mission blue recovery documents); Xerces Society; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lupine flower has to be levered open, which a bumble bee is strong enough to do and most smaller bees are not.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "painted-lady", support: "host", note: "Painted lady caterpillars live in little silk tents on lupines as well as on thistles and mallows.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "gray-hairstreak", support: "host", note: "Lupine buds and young pods feed gray hairstreak caterpillars, which are hard to spot among the flowers.", basis: "BAMONA." },
    ],
    "eriophyllum-staechadifolium": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Flat yellow daisy heads from May to September on ground where nothing else flowers — and a run of native bees collect pollen from the sunflower family and nothing else at all.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "buckwheat-butterflies", support: "nectar", note: "The small blues and hairstreaks of the bluff tops feed here, because on an exposed headland this is most of the nectar there is.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Painted ladies coming up the coast in spring stop on it, sometimes in numbers.", basis: "GloBI — iNaturalist observation records; BAMONA." },
    ],
    "salvia-spathacea": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Whorls of magenta flowers stacked up a stem at exactly hummingbird height, from March to June — Allen's hummingbird arrives on this coast in February to breed, just as it starts.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the same whorls from below, pushing up into each flower in turn.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "iris-douglasiana": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower is a landing platform with a tunnel behind it, sized for a big bee to crawl in and out past the pollen.", basis: "Xerces Society." },
    ],
    "eschscholzia-californica": [
      { wildlifeId: "mason-bees", support: "nectar", note: "A poppy offers no nectar at all — everything on it is there for pollen, and the small solitary bees roll around in the middle of the flower to collect it.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work poppies for pollen from February, weeks before most of the garden opens.", basis: "Xerces Society." },
    ],
    "erigeron-glaucus": [
      { wildlifeId: "buckwheat-butterflies", support: "nectar", note: "The coastal blues and hairstreaks feed at seaside daisy through the summer — flat open flowers with no depth to reach into suit a small butterfly exactly.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Five months of daisies on a bluff, for the bees that collect sunflower-family pollen and nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the steadiest nectar sources on the immediate coast, in flower from April into autumn.", basis: "Xerces Society." },
    ],
    "asclepias-speciosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "Monarch caterpillars eat milkweed and nothing else. This is the broad-leaved one of the inland valleys — plant it over the hills rather than in the fog belt, and plant it instead of the evergreen tropical milkweed, which keeps monarchs breeding when they should be moving on.", basis: "Xerces Society (Western Monarch Call to Action); US Fish & Wildlife Service." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A milkweed in flower is the busiest square foot in the garden — bumble bees, wasps, beetles and butterflies all at once.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "western-tiger-swallowtail", support: "nectar", note: "The big swallowtails feed at milkweed heads through midsummer.", basis: "GloBI — iNaturalist observation records; BAMONA." },
    ],
    "asclepias-fascicularis": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "The milkweed that grows on the coast side of the hills, and the one to plant here. The western monarchs that winter in the groves along this coast are down to a fraction of their old numbers, and milkweeds are all their caterpillars can eat.", basis: "Xerces Society (Western Monarch Count); US Fish & Wildlife Service." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower heads feed native bees, wasps and hoverflies right through the driest months.", basis: "Xerces Society." },
    ],
    "sidalcea-malviflora": [
      { wildlifeId: "mallow-specialist-bees", support: "nectar", reliance: "narrow", note: "A small group of native bees collect pollen from mallows and almost nothing else, so a patch of checkerbloom is the difference between them nesting in your garden or not.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "painted-lady", support: "host", note: "Painted lady and west coast lady caterpillars eat mallow leaves, spinning themselves a little silk tent to feed inside.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees and skippers work the pink cups through the spring.", basis: "Xerces Society." },
      { wildlifeId: "west-coast-lady", support: "host", note: "West Coast lady caterpillars fold checkerbloom leaves into silk tents and eat from inside them.", basis: "BAMONA." },
      { wildlifeId: "gray-hairstreak", support: "host", note: "Gray hairstreak caterpillars feed on mallow flowers and young seeds, checkerbloom among them.", basis: "BAMONA." },
    ],
    "scrophularia-californica": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Those dull little jug-shaped flowers hold some of the richest nectar in the whole California flora, and they are open from February to July — the plant is called the bee plant for a reason.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "variable-checkerspot", support: "host", reliance: "narrow", note: "One of the short list of plants the variable checkerspot's caterpillars will eat, along with monkeyflower.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds work the maroon jugs too, which is easier to believe once you have seen how much nectar is in one.", basis: "Audubon California." },
    ],
    "achillea-millefolium": [
      { wildlifeId: "mason-bees", support: "nectar", note: "A flat head packed with hundreds of tiny flowers is exactly what a short-tongued solitary bee needs — no depth to reach into, hundreds of sips in one place.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Yarrow is in the sunflower family, so the bees that collect only that family's pollen use it through the summer.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "american-lady", support: "host", note: "American lady caterpillars grow up on the silver-leaved daisies, yarrow among them, wrapping themselves in leaves and their own silk while they eat.", basis: "BAMONA; Xerces Society." },
    ],
    "solidago-velutina-californica": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrod flowers from July to October when the region is at its driest, and several native bees collect goldenrod pollen and nothing else — miss this and their year has a hole in it.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs moving down the coast to the overwintering groves in autumn refuel on goldenrod.", basis: "Xerces Society (Western Monarch Count)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The last big nectar source of the year for bumble bee colonies trying to raise next spring's queens.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Leave the seed heads standing and the goldfinches work them all winter.", basis: "Cornell Lab." },
    ],
    "symphyotrichum-chilense": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Aster pollen is what a run of native bees collect and nothing else will do, and this one flowers from June into November.", basis: "Fowler & Droege, Pollen Specialist Bees (West); Xerces Society." },
      { wildlifeId: "monarch", support: "nectar", note: "The other half of the autumn pair with goldenrod, feeding monarchs and everything else at the end of the season.", basis: "Xerces Society." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Late butterflies crowd onto aster after the first autumn rains, when it starts again.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches take the seed through the winter from stems left standing.", basis: "Cornell Lab." },
    ],
    "epilobium-canum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Scarlet tubes from August to November, precisely when the hummingbirds need to put weight on and everything else has finished — for Anna's, which stays here all year, this bridges summer and the winter currants.", basis: "Audubon California; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees cannot reach down the tube, so they bite through it from the side and drink from there — worth watching for.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "The fine seed and its silk go to goldfinches, for food and for nest lining.", basis: "Cornell Lab." },
      { wildlifeId: "white-lined-sphinx", support: "host", note: "California fuchsia is in the fireweed family, a white-lined sphinx host; the big caterpillars eat the leaves.", basis: "BAMONA." },
    ],
    "heuchera-micrantha": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Sprays of tiny white flowers held above the leaves, sized for the small solitary bees and hoverflies of a shaded bank.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "aquilegia-formosa": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Nodding red flowers with long spurs — a hummingbird shape, and hummingbirds hover underneath and reach up into them.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees get in the front way; the short-tongued ones bite through the spur from outside, which you can watch happening on the same plant.", basis: "Xerces Society." },
    ],
    "sisyrinchium-bellum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small blue flowers with a yellow eye, open in the morning and shut by afternoon — the very small solitary bees that bigger flowers are no use to work them for pollen.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "artemisia-douglasiana": [
      { wildlifeId: "american-lady", support: "host", note: "Mugwort is one of the silver-leaved plants the American lady's caterpillars grow up on, hidden in a shelter of leaves and silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); BAMONA." },
      { wildlifeId: "california-quail", support: "shelter", note: "A mugwort patch on a damp bank is dense cover a quail covey can move through unseen.", basis: "Cornell Lab; Audubon California." },
    ],
    "viola-adunca": [
      { wildlifeId: "greater-fritillaries", support: "host", reliance: "sole", note: "The fritillaries lay on violets and their caterpillars eat violet leaves and nothing else. On this coast that includes Myrtle's silverspot, which hangs on at a handful of sites around Point Reyes because that is where the violets still are.", basis: "US Fish & Wildlife Service (Myrtle's silverspot recovery documents); Xerces Society; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees and small solitary bees take the early spring flowers, before the plant switches to making seed from closed flowers at ground level.", basis: "Xerces Society." },
    ],
    "stipa-pulchra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The skippers — small fast orange butterflies that hold their wings half open — raise their caterpillars on native bunchgrasses, each rolled into a leaf it sews shut behind itself.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "california-quail", support: "seeds", note: "Quail work through a bunchgrass stand for seed and use the tussocks as cover between runs.", basis: "Cornell Lab; Audubon California." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Goldfinches and sparrows strip the seed heads in early summer.", basis: "Cornell Lab." },
    ],
    "festuca-californica": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Native bunchgrasses are what skipper caterpillars eat, and this is the one that grows in the shade under an oak where the others will not.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "california-quail", support: "shelter", note: "A big evergreen tussock is cover at exactly the height a quail lives at, and it stays that way all winter.", basis: "Cornell Lab; Audubon California." },
    ],
    "danthonia-californica": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Another of the coastal prairie grasses the skippers grow up on — and the bunched habit, with bare soil between tufts, is what the ground-nesting bees of that habitat need too.", basis: "Xerces Society; BAMONA." },
    ],
    "elymus-glaucus": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Blue wildrye is a caterpillar grass for the skippers, and it is the one that will grow in shade where the others will not.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Sparrows, juncos and goldfinches work the heavy seed heads into autumn.", basis: "Cornell Lab." },
    ],
    "carex-tumulicola": [
      { wildlifeId: "grass-skippers", support: "host", note: "Sedges are the caterpillar plants for several skippers, and this one keeps its leaves all year for them.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "california-quail", support: "seeds", note: "Quail and juncos pick seed out of a sedge meadow and scratch through the litter beneath it.", basis: "Cornell Lab." },
    ],
    "juncus-patens": [
      { wildlifeId: "california-quail", support: "shelter", note: "A damp rush stand is cover and a drinking place at once, which is why a garden with a wet corner gets birds a dry one never will.", basis: "Cornell Lab; Audubon California." },
    ],
    "aristolochia-californica": [
      { wildlifeId: "pipevine-swallowtail", support: "host", reliance: "sole", note: "This vine is the whole world of the pipevine swallowtail: its caterpillars eat pipevine and nothing else on earth, take up the plant's poison and keep it, and are bright red and entirely unhurried because nothing will touch them. Plant one and the butterflies find it, sometimes within a season.", basis: "Xerces Society; BAMONA; UC ANR." },
    ],
    "vitis-californica": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small purple grapes in autumn that robins, thrushes, jays and mockingbirds all take — and the tangled growth is some of the safest nesting cover a garden can offer.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Band-tailed pigeons come down to a fruiting grape in flocks and clear it.", basis: "Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings take grapes late, after the softer fruit has gone.", basis: "Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Foxes, coyotes and raccoons eat wild grapes in quantity, which is how the seed gets moved along a creek.", basis: "USFS FEIS." },
    ],
    "lonicera-hispidula": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Whorls of pink tubes in early summer, worked by hummingbirds through the day and by hawk moths at dusk — a honeysuckle at twilight is the best place here to see one hovering.", basis: "Audubon California; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Translucent red berries in autumn for thrushes, towhees and robins.", basis: "Cornell Lab." },
      { wildlifeId: "bushtit", support: "shelter", note: "The loose tangle it makes through a shrub is nesting cover for bushtits and wrentits.", basis: "Cornell Lab." },
    ],
    "rubus-ursinus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Spring blossom that bumble bees, mining bees and butterflies work hard — and unlike the introduced Himalayan bramble beside it, this one belongs here.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, jays and towhees take the berries through summer, and foxes and coyotes finish what is left.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "california-quail", support: "shelter", note: "A blackberry thicket is the safest nesting cover in the garden — towhees, wrentits and sparrows all use it, and a quail covey lives under it.", basis: "Cornell Lab; Audubon California." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees work the open flowers, and some of them nest in the pithy center of a cut cane afterwards.", basis: "Xerces Society." },
    ],
    "fragaria-chiloensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers over a long spring, shallow enough for the smallest solitary bees and the hoverflies to use.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The small fruits go to towhees, robins and sparrows working the mat at ground level.", basis: "Cornell Lab." },
    ],
    "clinopodium-douglasii": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Small white flowers scattered through the shade from spring to autumn, worked by the little solitary bees and hoverflies that bigger flowers are no use to.", basis: "Xerces Society." },
    ],
    "oxalis-oregana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink-veined flowers on the forest floor for months, feeding the small bees and hoverflies that live in the shade rather than the sun.", basis: "Xerces Society." },
    ],
    "symphoricarpos-mollis": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Little pink bells in early summer in dry shade, which is not a place a hummingbird usually finds anything.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the bells — deep and narrow, and suited to a long tongue.", basis: "Xerces Society." },
      { wildlifeId: "california-quail", support: "berries", note: "White berries hold into winter, and the low tangle is exactly the cover ground-feeding birds need to cross a garden safely.", basis: "Cornell Lab; USFS FEIS." },
    ],
  },
  "ca-south-coast": {
    "hesperocyparis-forbesii": [
      { wildlifeId: "juniper-hairstreak", support: "host", reliance: "sole", note: "Thorne's hairstreak eats Tecate cypress and nothing else, and flies around Otay Mountain and nowhere else on earth \u2014 one of the smallest ranges of any butterfly in the country. A tree planted in a Los Angeles garden will not bring one; the wild groves are what hold the butterfly. It is still the reason this tree matters more than its size suggests.", basis: "US Fish & Wildlife Service (Thorne's hairstreak 12-month finding); Xerces Society; BAMONA." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "The little round cones break down into fine seed, and the goldfinches pick it out on the branch, hanging sideways to reach.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bushtit", support: "shelter", note: "Dense evergreen foliage is where a bushtit flock roosts and hangs its long woven sock of a nest \u2014 cover a chaparral garden otherwise has none of.", basis: "Cornell Lab." },
    ],
    "pinus-torreyana": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "The seeds are far too heavy for the wind, so the pine depends on scrub-jays to carry and bury them \u2014 the ones a jay forgets are how a grove moves at all.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Dusky-footed and desert woodrats take so much of the crop that on the bluffs they are most of what stands between a cone and a seedling.", basis: "USFS FEIS." },
      { wildlifeId: "bushtit", support: "shelter", note: "Bushtit flocks work through the needles all winter after the small insects living in them.", basis: "Cornell Lab." },
    ],
    "pinus-coulteri": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "White-headed and acorn woodpeckers work the huge cones, and scrub-jays haul the big oily seeds off to bury \u2014 the only way a seed that heavy gets anywhere.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Western gray squirrels live on Coulter pine seed the year round, storing what they can't eat.", basis: "USFS FEIS." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Big pine seeds are what a crossbill's crossed bill is a tool for; the siskins and nuthatches follow on behind for what it drops.", basis: "Cornell Lab." },
    ],
    "juniperus-californica": [
      { wildlifeId: "juniper-hairstreak", support: "host", reliance: "sole", note: "The loki juniper hairstreak lays on California juniper and nothing else, in the dry inland country at this region's eastern edge. It is the same green as the foliage and sits dead still on it, so the way to find one is to tap a branch and watch what flies out.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The dusty-blue berries take two years to ripen and then hang on \u2014 one of the very few winter fruits in a dry inland garden. A mockingbird will hold one bush against every other bird for weeks.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "lesser-goldfinch", support: "berries", note: "Goldfinches, mourning doves and Scott's orioles all take the berries, and the seed comes out the far end scarified and ready to grow.", basis: "USFS FEIS; Cornell Lab." },
    ],
    "artemisia-douglasiana": [
      { wildlifeId: "american-lady", support: "host", note: "Mugwort is one of the silver-leaved plants the American lady's caterpillars grow up on, wrapping themselves in the leaves and their own silk to hide while they eat.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), NHM Interactions Bank, Ferrer-Paris et al. 2013; BAMONA." },
    ],
    "quercus-agrifolia": [
      { wildlifeId: "bushtit", support: "shelter", note: "Coast live oak is the bushtit's tree above all others: it feeds in the canopy and hangs its long sock of a nest from an outer branch.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "In southern California the propertius duskywing lays on coast live oak and on nothing else — the caterpillars overwinter rolled up in the fallen leaves, which is a good reason to leave the litter under the tree.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Acorn woodpeckers drill storage granaries full of them and California scrub-jays bury thousands each autumn, planting the next generation of oaks as they forget where.", basis: "Cornell Lab; UC Oak Woodland Management." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Ground squirrels, dusky-footed woodrats and mule deer all live on the acorn crop through the autumn.", basis: "USDA PLANTS; UC ANR." },
      { wildlifeId: "california-sister", support: "host", reliance: "narrow", note: "Coast live oak is a main host: the spiny green caterpillars eat its leathery leaves, and the adults sail around the canopy.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); BAMONA." },
      { wildlifeId: "mournful-duskywing", support: "host", reliance: "narrow", note: "Mournful duskywing caterpillars live in folded live-oak leaves, and the butterflies fly here in almost every month.", basis: "BAMONA." },
      { wildlifeId: "band-tailed-pigeon", support: "seeds", note: "Band-tailed pigeons swallow acorns whole, and flocks come down from the mountains to oak canyons in autumn.", basis: "Cornell Lab of Ornithology." },
    ],
    "salix-lasiolepis": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willow is the main caterpillar tree of the big yellow swallowtail you see patrolling a creek in summer.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed together in a spiny black huddle on willow — and the adults overwinter here rather than migrating, so they are the first butterfly of the year.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Willow catkins in February are the richest early pollen in the region, opening exactly when the solitary bees emerge.", basis: "Xerces Society." },
      { wildlifeId: "lorquins-admiral", support: "host", note: "Arroyo willow is a main Lorquin's admiral host; the caterpillars look like bird droppings on the leaves.", basis: "GloBI — iNaturalist observation records; BAMONA." },
    ],
    "populus-fremontii": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Cottonwood is a favored caterpillar tree for the western tiger swallowtail.", basis: "BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Cottonwood and willow are what mourning cloak caterpillars grow up on along a southwestern creek.", basis: "BAMONA." },
      { wildlifeId: "lorquins-admiral", support: "host", note: "Cottonwood leaves feed Lorquin's admiral caterpillars along streams, alongside the willows.", basis: "BAMONA." },
    ],
    "platanus-racemosa": [
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Sycamore seed balls break apart through the winter, and the goldfinches take them a fluff at a time.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "yellow-rumped-warbler", support: "shelter", note: "A creekside sycamore is where the warblers spend the winter — its peeling bark and dead twigs hold the insects they live on.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Sycamore is one of the three trees — with willow and cottonwood — that raise most of this butterfly in southern California.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "acorn-birds", support: "shelter", note: "Old sycamores rot into cavities faster than any other tree here, which is where acorn woodpeckers, kestrels and screech owls nest.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "prunus-ilicifolia": [
      { wildlifeId: "pale-swallowtail", support: "host", note: "Hollyleaf cherry is one of the pale swallowtail's caterpillar plants, alongside ceanothus and coffeeberry.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The big dark cherries in autumn are taken by jays, grosbeaks, thrashers — and by coyotes and foxes, which is how the seed gets planted.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "band-tailed-pigeon", support: "berries", note: "Pigeons gulp the big red-to-purple cherries whole and carry the pits off to new ground.", basis: "GloBI — Fricke & Svenning 2020 frugivory network; Cornell Lab of Ornithology." },
    ],
    "umbellularia-californica": [
      { wildlifeId: "pale-swallowtail", support: "host", note: "California bay is a larval host for the pale swallowtail in the canyons where both grow.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Band-tailed pigeons and thrushes take the fatty purple fruits in autumn — a high-energy crop right before winter.", basis: "Cornell Lab." },
    ],
    "juglans-californica": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Ground squirrels and woodrats work the walnut crop hard, and burying what they don't eat is how walnut woodland spreads.", basis: "USDA PLANTS; UC ANR." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Acorn woodpeckers and scrub-jays crack and cache the nuts alongside acorns.", basis: "Cornell Lab." },
    ],
    "sambucus-nigra-caerulea": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "A flock of waxwings can strip an elderberry in an afternoon — it is one of the highest-value summer fruits in the state.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Orioles, grosbeaks, mockingbirds and thrashers all come to the blue berries; dozens of bird species are recorded on this one plant.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The huge flat flower heads in late spring are a landing platform for bumble bees, small solitary bees, beetles and hoverflies at once.", basis: "Xerces Society." },
    ],
    "aesculus-californica": [
      { wildlifeId: "anise-swallowtail", support: "nectar", note: "A buckeye in May is a candelabra of nectar, and the big swallowtails are on it all day.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "american-lady", support: "nectar", note: "Its flower spikes hold enough nectar to be worth a butterfly's whole morning.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Candles of flower in May, mobbed by bumble bees and native solitary bees — and genuinely poisonous to the introduced honey bee, which tells you which pollinators the tree was built for.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds work the flower spikes steadily through late spring.", basis: "Audubon California." },
    ],
    "ceanothus-crassifolius": [
      { wildlifeId: "pale-swallowtail", support: "host", reliance: "narrow", note: "Ceanothus is the classic caterpillar plant of the pale swallowtail across the West.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "ceanothus-silkmoth", support: "host", reliance: "narrow", note: "The West's giant silkmoth is named after this shrub: the fat green caterpillars grow up on ceanothus and spin their cocoons in it.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "It flowers in January, which for an emerging solitary bee is the difference between a season and no season at all.", basis: "Xerces Society." },
    ],
    "arctostaphylos-glauca": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Manzanita's little pink urns open around the new year — with the gooseberry, this is what carries Anna's hummingbird through midwinter.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "ceanothus-silkmoth", support: "host", note: "Manzanita is one of the silkmoth's caterpillar shrubs alongside ceanothus and coffeeberry.", basis: "BAMONA." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The dry \"little apples\" the name refers to are eaten by band-tailed pigeons, mockingbirds, foxes and coyotes.", basis: "Cornell Lab; USFS FEIS." },
    ],
    "frangula-californica": [
      { wildlifeId: "pale-swallowtail", support: "host", reliance: "narrow", note: "Coffeeberry, ceanothus and hollyleaf cherry are the three plants this swallowtail's caterpillars grow on here.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrashers, jays and mockingbirds take the berries as they turn from red to black in autumn.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flowers look like nothing and are covered in native bees, hoverflies and the tiny wasps that control garden pests.", basis: "Xerces Society." },
    ],
    "heteromeles-arbutifolia": [
      { wildlifeId: "american-lady", support: "nectar", note: "Toyon's white summer flower heads pull in butterflies months before the berries pull in birds.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Toyon's red berry clusters hold on until midwinter and then a waxwing flock arrives and strips the shrub in a day.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, mockingbirds and band-tailed pigeons work the same crop from December onward — the reason it was ever called Christmas berry.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Midsummer flower heads carry bees and beetles in the hottest, thinnest weeks of the year.", basis: "Xerces Society." },
    ],
    "rhus-integrifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Sticky red fruits through the summer for thrashers, towhees and mockingbirds, on a shrub dense enough for them to nest inside.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink flowers in February and March, at the very start of the solitary-bee season.", basis: "Xerces Society." },
    ],
    "eriogonum-fasciculatum": [
      { wildlifeId: "anise-swallowtail", support: "nectar", note: "California buckwheat carries flowers for months on end, and a hilltopping swallowtail comes down to them between patrols.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "american-lady", support: "nectar", note: "Its flat clusters of tiny flowers suit a small butterfly perfectly — no depth to reach into, hundreds of sips in one place.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bushtit", support: "shelter", note: "A flock of bushtits works right through the middle of a buckwheat, hanging upside-down after the insects in it.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "buckwheat-butterflies", support: "host", reliance: "narrow", note: "California buckwheat is the single most important larval plant for the region's blues and hairstreaks — several will lay on buckwheat and nothing else.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers from May until the rains return, which makes it the most dependable nectar in the garden through the whole dry season.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "behrs-metalmark", support: "host", reliance: "narrow", note: "California buckwheat is this metalmark's main host; the butterflies rarely stray far from a stand of it.", basis: "BAMONA; Butterflies of America." },
    ],
    "eriogonum-parvifolium": [
      { wildlifeId: "buckwheat-butterflies", support: "host", reliance: "narrow", note: "The El Segundo blue lays its eggs in these flower heads and nowhere else — it survives on a few dune remnants beside Los Angeles airport, and this plant is the whole of its habitat.", basis: "US Fish & Wildlife Service (El Segundo blue recovery); Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long summer-to-autumn bloom on bare sand, where almost nothing else is flowering.", basis: "Xerces Society." },
      { wildlifeId: "behrs-metalmark", support: "host", reliance: "narrow", note: "Near the coast, seacliff buckwheat feeds the metalmark's caterpillars as well.", basis: "BAMONA; Butterflies of America." },
    ],
    "artemisia-californica": [
      { wildlifeId: "california-gnatcatcher", support: "shelter", reliance: "narrow", note: "California sagebrush *is* the gnatcatcher's habitat — it forages, nests and spends its whole non-migratory life in it, which is why the bird went on the threatened list as the scrub was built over.", basis: "US Fish & Wildlife Service; Cornell Lab." },
      { wildlifeId: "california-quail", support: "shelter", note: "The dense low growth is exactly the cover a quail covey needs to move around a garden without being taken by a hawk.", basis: "Cornell Lab; Audubon California." },
    ],
    "salvia-mellifera": [
      { wildlifeId: "buckwheat-butterflies", support: "nectar", note: "Black sage is where the small blues and hairstreaks feed — the gray hairstreak most of all, which is on it whenever it is in flower.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Black sage flowers earlier than the other sages, so it feeds the bumble bee queens that come out first in spring.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "california-gnatcatcher", support: "shelter", note: "With California sagebrush, this is the other half of the coastal sage scrub the gnatcatcher lives in.", basis: "US Fish & Wildlife Service." },
    ],
    "salvia-clevelandii": [
      { wildlifeId: "anise-swallowtail", support: "nectar", note: "Cleveland sage's stacked purple whorls give a butterfly a ladder of flowers to work up.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The whorls of purple flowers are worked all day by bumble bees, carpenter bees and dozens of smaller native species.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds take the same spikes from below, and will defend a big plant as a territory.", basis: "Audubon California." },
    ],
    "salvia-apiana": [
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Leave white sage's spent flower stalks standing and the lesser goldfinches come for the seed — they will hang sideways off a bare stem to reach it.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "bushtit", support: "shelter", note: "Bushtit flocks move through a stand of white sage picking insects off the undersides of the leaves.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "\"Apiana\" means of the bees, and the tall white wands earn it — carpenter bees and bumble bees work them from April into July.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds work the flower wands through late spring.", basis: "Audubon California." },
    ],
    "encelia-californica": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Months of open daisies from February, feeding the native bees that collect sunflower-family pollen and nothing else, at the season they emerge.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An easy, open landing pad worked by bumble bees and butterflies right through spring.", basis: "Xerces Society." },
    ],
    "baccharis-pilularis": [
      { wildlifeId: "monarch", support: "nectar", note: "Coyote brush flowers in October, when western monarchs are moving to their overwintering groves along this coast — it is one of the last real meals of the year.", basis: "Xerces Society Western Monarch Count." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The autumn bloom is the single busiest insect plant of the California year: bees, hoverflies, beneficial wasps and beetles, all at once, when nothing else is open.", basis: "Xerces Society; UC ANR." },
    ],
    "isocoma-menziesii": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Flowers from August to November, carrying the sunflower-family specialist bees through the end of their season.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Late yellow bloom on a hot bank, at the leanest time of the year for nectar.", basis: "Xerces Society." },
    ],
    "diplacus-aurantiacus": [
      { wildlifeId: "variable-checkerspot", support: "host", reliance: "narrow", note: "Sticky monkeyflower is the main larval plant of the variable checkerspot — the spiny black caterpillars feed on it in groups, then rest out the dry summer half-grown.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "An apricot trumpet built for a hummingbird's bill, with a stigma that snaps shut behind the bird so the pollen can't be taken back.", basis: "Audubon California; UC ANR." },
    ],
    "amorpha-californica": [
      { wildlifeId: "california-dogface", support: "host", reliance: "sole", note: "The California dogface — the state butterfly — raises its caterpillars on this shrub and essentially nothing else. Planting it is the only way to invite one.", basis: "Xerces Society; CNPS; BAMONA." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Dark purple spikes with orange anthers, worked by bumble bees through early summer shade.", basis: "Xerces Society." },
      { wildlifeId: "silver-spotted-skipper", support: "host", note: "False indigo is a silver-spotted skipper host; each caterpillar folds a leaflet into a shelter and feeds from it.", basis: "GloBI — iNaturalist observation records; BAMONA." },
    ],
    "ribes-speciosum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Crimson fuchsia-like flowers in January and February — Anna's hummingbird nests in the middle of winter here, and this is what feeds it while it does.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Bristly red berries for thrashers and towhees, inside a thorny tangle they can nest in safely.", basis: "Cornell Lab." },
    ],
    "asclepias-fascicularis": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A monarch caterpillar can eat milkweed and nothing else, and this is the milkweed of California's valleys. The western monarch population is down by more than ninety percent since the 1980s, so each patch counts for more than it should have to.", basis: "Xerces Society Western Monarch Count; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower domes feed a long list of bees, wasps and butterflies — milkweed nectar is rich and heavily worked.", basis: "Xerces Society." },
    ],
    "epilobium-canum": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Scarlet trumpets from August to October, precisely the stretch when a dry-summer garden has nothing else and hummingbirds are feeding fledglings.", basis: "Audubon California; Cornell Lab." },
      { wildlifeId: "white-lined-sphinx", support: "host", note: "California fuchsia is in the fireweed family, a white-lined sphinx host; the big caterpillars eat the leaves.", basis: "BAMONA." },
    ],
    "solidago-velutina-californica": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrods carry more specialist bees than almost any other genus — a run of native bees collect goldenrod pollen and nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "monarch", support: "nectar", note: "Autumn goldenrod is fuel for monarchs on their way to the overwintering groves.", basis: "Xerces Society." },
    ],
    "symphyotrichum-chilense": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Asters, like goldenrods, feed a set of native bees that will collect nothing else — and they do it at the end of the season.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "monarch", support: "nectar", note: "Late lavender bloom for migrating monarchs and painted ladies.", basis: "Xerces Society." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the seed heads through the winter if the stems are left standing.", basis: "Cornell Lab." },
    ],
    "achillea-millefolium": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Flat white heads are the easiest landing pad in the garden for short-tongued native bees, hoverflies and the parasitic wasps that keep aphids down.", basis: "Xerces Society; UC ANR IPM." },
    ],
    "eschscholzia-californica": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Poppies offer pollen and no nectar at all, so everything you see in one is collecting pollen — including solitary bees that emerge exactly when it opens.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
    ],
    "penstemon-spectabilis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Open blue trumpets sized for a carpenter bee to shoulder into — penstemons are one of the great western bee genera.", basis: "UC Berkeley Urban Bee Lab." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds work the spires through late spring.", basis: "Audubon California." },
    ],
    "dudleya-pulverulenta": [
      { wildlifeId: "sonoran-blue", support: "host", reliance: "sole", note: "The Sonoran blue's caterpillars burrow inside dudleya leaves and eat them from within — no dudleya on a cliff means no Sonoran blue on it either.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Arching red-pink flower stalks in spring, held out from the rosette at hummingbird height.", basis: "Audubon California." },
    ],
    "romneya-coulteri": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Enormous pollen-rich bowls that carpenter bees and bumble bees wallow in — visible, and worth flying to, from streets away.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "heuchera-maxima": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Sprays of small cream flowers held above the leaves for months, and one of very few hummingbird plants that works in full shade.", basis: "Audubon California; Theodore Payne Foundation." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Small solitary bees and hoverflies work the flower sprays from late winter onward.", basis: "Xerces Society." },
    ],
    "sisyrinchium-bellum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blue stars that open in the morning sun for small solitary bees at the very start of the season.", basis: "Xerces Society." },
    ],
    "stipa-pulchra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Skipper and wood-nymph caterpillars eat grass and nothing else, and a native bunchgrass is also where they and the queen bumble bees spend the winter — which a mown lawn never is.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "california-quail", support: "seeds", note: "Quail take the seed and use the tussocks as cover between one patch of shrubs and the next.", basis: "Cornell Lab; Audubon California." },
    ],
    "muhlenbergia-rigens": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Deergrass blades are caterpillar food for the skippers, and the dense clump is winter shelter for a long list of insects.", basis: "Xerces Society." },
      { wildlifeId: "california-quail", support: "shelter", note: "A row of deergrass is the cover a quail covey moves along — low, dense and continuous.", basis: "Audubon California." },
    ],
    "leymus-condensatus": [
      { wildlifeId: "california-quail", support: "shelter", note: "A stand of wild rye is head-high cover a quail can live inside, which is exactly what a garden of lawn and clipped shrubs never offers.", basis: "Cornell Lab; Audubon California." },
      { wildlifeId: "grass-skippers", support: "host", note: "Its blades feed skipper caterpillars like the other native bunchgrasses.", basis: "Xerces Society." },
    ],
    "carex-praegracilis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Sedges are the larval food of the ringlets and wood nymphs — a mown sedge lawn still feeds them in a way a fescue lawn cannot.", basis: "Xerces Society; BAMONA." },
    ],
    "vitis-girdiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild grapes are among the most-eaten fruits in a California canyon: orioles, mockingbirds, thrashers, finches and foxes all take them.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks work a fruiting grape hard in late summer.", basis: "Cornell Lab." },
    ],
    "keckiella-cordifolia": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Long red-orange tubes in the hot months, in shade — hopeless for most insects to reach, which is why the nectar is still there when the bird arrives.", basis: "Audubon California; Theodore Payne Foundation." },
    ],
    "clematis-lasiantha": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Cream flowers in early spring for solitary bees and hoverflies; afterwards, hummingbirds and bushtits pull the silky seed plumes apart to line their nests.", basis: "Xerces Society; Cornell Lab." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Low white flowers in shade, opening with the first solitary bees and easy for a small one to work.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Tiny intense strawberries for towhees, thrashers and sparrows — whoever finds them first.", basis: "Cornell Lab." },
    ],
    "symphoricarpos-mollis": [
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Small pink bells in late spring, in the dry shade under oaks where little else flowers.", basis: "Audubon California." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The waxy white berries hang on into winter for thrushes, robins and quail, long after the good fruit has gone.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "clinopodium-douglasii": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Tiny white mint flowers at ground level in shade, over a long season, for the smallest solitary bees and hoverflies.", basis: "Xerces Society." },
    ],
    "malosma-laurina": [
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "Laurel sumac's dry little fruit is winter food, and a yellow-rumped warbler is one of the few birds that digests waxy fruit well enough to live on it.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "california-gnatcatcher", support: "shelter", note: "Dense evergreen cover on a coastal hillside is where gnatcatchers, wrentits and towhees nest and shelter year-round.", basis: "US Fish & Wildlife Service; Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small white fruits in autumn for thrashers, mockingbirds and towhees — and for the coyotes that carry the seed uphill.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big cream flower plumes in early summer, worked by bees, beetles and the predatory wasps that keep garden pests down.", basis: "Xerces Society." },
    ],
    "rosa-californica": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Rose hips hang on well past midwinter, which is exactly when a roving waxwing flock needs something left on a branch.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrashers, robins and quail all take the hips, and the thorny thicket underneath is safe nesting cover.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A single wild rose lets a bee reach the pollen — a double garden rose has replaced those stamens with petals and offers almost nothing.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "hesperoyucca-whipplei": [
      { wildlifeId: "california-yucca-moth", support: "host", reliance: "sole", note: "As close a partnership as nature has: the moth pollinates the yucca deliberately and lays its eggs in the flower, and its caterpillars eat some of the seeds that result. Neither species has another partner — no yucca, no moth, and no moth, no yucca seed.", basis: "Xerces Society; the yucca-moth literature (Pellmyr)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The ten-foot flower spike also draws bees, beetles and hummingbirds, though only the moth actually pollinates it.", basis: "Xerces Society." },
    ],
    "malacothamnus-fasciculatus": [
      { wildlifeId: "painted-lady", support: "host", reliance: "narrow", note: "Mallows are one of the painted lady's main caterpillar plants — the butterfly that arrives in millions across southern California in the spring after a wet winter.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Open pink mallow flowers over months, worked by bumble bees and by the native bees that specialize on the mallow family.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "west-coast-lady", support: "host", note: "West Coast lady caterpillars fold bush mallow leaves into silk tents and eat from inside them.", basis: "BAMONA." },
      { wildlifeId: "gray-hairstreak", support: "host", note: "Gray hairstreak caterpillars feed on mallow flowers and seeds, and bush mallow is one they use.", basis: "BAMONA." },
    ],
    "acmispon-glaber": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Small yellow pea flowers from March into August — one of the longest bloom seasons in the list, at the season bees most need it.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its early flowers open while the solitary bees are still provisioning nests.", basis: "Xerces Society." },
      { wildlifeId: "buckwheat-butterflies", support: "host", note: "Deerweed is a favorite host of the acmon blue, which lays on its flower buds.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "gray-hairstreak", support: "host", note: "Gray hairstreak caterpillars feed on the flowers and young pods of deerweed and other peas.", basis: "BAMONA." },
    ],
    "lupinus-albifrons": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lupine flower has to be forced open by a bee heavy enough to trip it, which is why bumble bees and carpenter bees are the ones you see on it.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "painted-lady", support: "host", note: "Lupines are among the painted lady's caterpillar plants alongside the mallows and thistles.", basis: "BAMONA." },
      { wildlifeId: "lupine-blues", support: "host", note: "Silver bush lupine is a host for Boisduval's blue, whose caterpillars eat its leaves in spring.", basis: "BAMONA; Xerces Society." },
    ],
    "eriophyllum-confertiflorum": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Gold flower heads from April into August, feeding the native bees that collect sunflower-family pollen and nothing else — right through the gap after the spring shrubs finish.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "An easy flat landing pad worked by bumble bees and small butterflies all summer.", basis: "Xerces Society." },
    ],
    "dipterostemon-capitatus": [
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first real nectar sources of the year — it opens in February, when the early solitary bees and bee flies are out and almost nothing else is.", basis: "Xerces Society." },
    ],
  },

  "florida-central": {
    "quercus-geminata": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Sand live oak is one of the scrub oaks the Florida scrub-jay lives on: it buries thousands of the acorns each fall and plants the next thicket.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Deer, raccoons and squirrels take the acorns that fall in the sand.", basis: "UF/IFAS." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "One of the scrub oaks Horace's duskywing raises its caterpillars on.", basis: "BAMONA." },
    ],
    "quercus-laevis": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Wild turkeys and jays feed on turkey oak acorns under the longleaf pines.", basis: "UF/IFAS; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "A staple for the sandhill fox squirrel and for deer in fall.", basis: "UF/IFAS." },
    ],
    "pinus-elliottii": [
      { wildlifeId: "brown-headed-nuthatch", support: "shelter", note: "Brown-headed nuthatches work slash pine bark for insects and nest in its dead snags.", basis: "Cornell Lab of Ornithology." },
    ],
    "liquidambar-styraciflua": [
      { wildlifeId: "luna-moth", support: "host", note: "Sweetgum is one of the luna moth's main caterpillar trees in the Deep South.", basis: "NWF Native Plant Finder; UF/IFAS." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Wintering goldfinches pick the tiny seeds out of the spiky balls.", basis: "Cornell Lab of Ornithology." },
    ],
    "sambucus-canadensis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, catbirds, cardinals and bluebirds strip the berry clusters as fast as they ripen.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks drop in and empty a bush in an afternoon.", basis: "Cornell Lab of Ornithology." },
    ],
    "baccharis-halimifolia": [
      { wildlifeId: "monarch", support: "nectar", note: "It blooms in fall, just as monarchs pass through Florida on their way south.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "gulf-fritillary", support: "nectar", note: "Gulf fritillaries feed on the late flowers once the passionvine season winds down.", basis: "GloBI — iNaturalist observation records." },
    ],
    "vaccinium-myrsinites": [
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the low-hanging berries in the sandhills and flatwoods they share.", basis: "UF/IFAS; Florida gopher tortoise guidance." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, thrashers and towhees take the small berries in spring.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
    ],
    "lyonia-lucida": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Its bells open in late winter, when bumble bee queens need food and little else is blooming.", basis: "FNPS; Xerces Society." },
    ],
    "pontederia-cordata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the blue spikes from spring to fall along the water's edge.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "white-peacock", support: "nectar", note: "White peacocks feed at the flower spikes all through the warm months.", basis: "GloBI — iNaturalist observation records." },
    ],
    "euthamia-caroliniana": [
      { wildlifeId: "monarch", support: "nectar", note: "Fall nectar for monarchs moving south through Florida.", basis: "Xerces Society; FNPS." },
      { wildlifeId: "white-peacock", support: "nectar", note: "White peacocks crowd the flat yellow heads in fall.", basis: "GloBI — iNaturalist observation records." },
    ],
    "vitis-rotundifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, thrashers and catbirds eat the grapes that split on the vine.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Foxes, raccoons, opossums, deer and black bears feed on the fallen grapes.", basis: "UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the muscadines that fall within reach.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, mockingbirds and woodpeckers take the berries through fall and winter.", basis: "Cornell Lab of Ornithology." },
    ],
    "phyla-nodiflora": [
      { wildlifeId: "phaon-crescent", support: "host", reliance: "sole", note: "Frogfruit is the phaon crescent's caterpillar food: leave a patch unmown and they will find it.", basis: "GloBI — iNaturalist observation records; BAMONA; UF/IFAS." },
      { wildlifeId: "white-peacock", support: "host", note: "One of the white peacock's caterpillar plants in Florida.", basis: "UF/IFAS; BAMONA." },
    ],
    "pinus-palustris": [
      { wildlifeId: "brown-headed-nuthatch", support: "shelter", reliance: "narrow", note: "The brown-headed nuthatch lives in longleaf pine and almost nowhere else — working the bark for insects, and excavating its nest in a dead pine snag. Leave the standing deadwood and you keep the bird.", basis: "GloBI — iNaturalist observation records; Cornell Lab of Ornithology." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Wild turkeys work the ground under longleaf for fallen seed, and woodpeckers work the trunks above it.", basis: "GloBI — iNaturalist observation records; Cornell Lab of Ornithology." },
    ],
    "taxodium-distichum": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Cypress is one of the trees the cecropia moth's caterpillars will accept — an odd choice for a giant silk moth, and a documented one.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), NHM Interactions Bank; NWF Native Plant Finder." },
    ],
    "sabal-palmetto": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "A cabbage palm in fruit is a bird feeder the size of a tree — robins, catbirds, mockingbirds and vireos take the black drupes for weeks.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Muñoz et al. 2018 animal–plant synthesis; Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks drop into a fruiting palm and strip a frond's worth of drupes in minutes.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Raccoons, deer and black bears all take palm fruit, which is one reason a cabbage palm hammock feeds so much at once.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); UF/IFAS." },
    ],
    "magnolia-grandiflora": [
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", note: "A magnolia flower is an ancient design — no nectar guides, no landing platform, just a bowl of pollen. An old flower built for beetles; carpenter bees come for the pollen too.", basis: "GloBI — National Database of Plant Pollinators (Center for Plant Conservation), iNaturalist observation records; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "The cone breaks open in autumn to hang its scarlet seeds out on threads, and gray and fox squirrels come for them.", basis: "GloBI — iNaturalist observation records; UF/IFAS." },
    ],
    "chionanthus-virginicus": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Fringetree feeds the caterpillars of the big native sphinx and silk moths — the waved sphinx among them, whose larva is the color of the leaf it sits under.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NWF Native Plant Finder." },
    ],
    "mimosa-strigillosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Sunshine mimosa's pink powder-puffs sit flat on a lawn you can walk on, and the bumble bees work them all summer between mowings.", basis: "GloBI — iNaturalist observation records; UF/IFAS." },
      { wildlifeId: "grass-skippers", support: "nectar", note: "Fiery skippers and little yellows come down to it constantly — it is one of the few nectar plants that survives being walked over.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Gopher tortoises graze the leaves and pink puffball flowers.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "tripsacum-dactyloides": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Eastern gamagrass raises the byssus skipper — a big orange skipper whose caterpillar lives in a tube of leaf blade fastened with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Grasses rarely feed bees, but gamagrass's big shedding anthers are worked by bumble bees for pollen.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "quercus-virginiana": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Live oak acorns feed jays, turkeys, woodpeckers, and wintering ducks.", basis: "UF/IFAS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "A major mast tree for squirrels, deer, and other mammals.", basis: "UF/IFAS." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "Horace's duskywing caterpillars eat live oak leaves inside folded leaf shelters.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed and monarch host; Florida sits on the monarch's migration and overwintering path.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Milkweeds are also the sole caterpillar food of the monarch's cousin, the queen.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "passiflora-incarnata": [
      { wildlifeId: "gulf-fritillary", support: "host", reliance: "sole", note: "Passionvine is the gulf fritillary's caterpillar plant.", basis: "UF/IFAS; Florida Native Plant Society." },
      { wildlifeId: "zebra-longwing", support: "host", reliance: "sole", note: "The host vine for Florida's state butterfly, the zebra longwing.", basis: "UF/IFAS." },
    ],
    "salvia-coccinea": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Scarlet tubular flowers bloom nearly year-round in Florida — reliable hummingbird fuel.", basis: "UF/IFAS; Audubon." },
    ],
    "hamelia-patens": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Firebush's orange-red tubes are a hummingbird and butterfly magnet all season.", basis: "UF/IFAS; Florida Native Plant Society." },
      { wildlifeId: "zebra-longwing", support: "nectar", note: "A heavy nectar source for zebra longwings and gulf fritillaries.", basis: "UF/IFAS." },
    ],
    "callicarpa-americana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Beautyberry's magenta clusters are devoured by mockingbirds, cardinals, and thrushes in fall.", basis: "UF/IFAS; Cornell Lab." },
    ],
    "ilex-vomitoria": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Yaupon's translucent red berries persist into winter for mockingbirds, robins, and cedar waxwings.", basis: "UF/IFAS; Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Winter-persistent fruit draws roving waxwing flocks.", basis: "Cornell Lab." },
    ],
    "viburnum-obovatum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small dark drupes feed songbirds; the early flowers feed pollinators.", basis: "UF/IFAS." },
    ],
    "myrcianthes-fragrans": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Simpson's stopper's orange-red berries are a favorite of mockingbirds and other fruit-eaters.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "monarda-punctata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Spotted beebalm is one of the single best nectar plants for bees and wasps in the Southeast.", basis: "UF/IFAS; Xerces." },
    ],
    "liatris-gracilis": [
      { wildlifeId: "monarch", support: "nectar", note: "Purple blazing-star spikes are prime fall nectar for migrating monarchs.", basis: "UF/IFAS; Xerces." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A sunflower-family bloom supporting specialist bees.", basis: "Fowler & Droege." },
    ],
    "coreopsis-leavenworthii": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Florida's state wildflower group — its pollen feeds sunflower-family specialist bees.", basis: "Fowler & Droege; UF/IFAS." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Wintering goldfinches take the small seeds.", basis: "Cornell Lab." },
    ],
    "helianthus-debilis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A true sunflower — a keystone pollen source for sunflower specialist bees.", basis: "Fowler & Droege." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "A low, open-ground plant of the sandy uplands gopher tortoises graze and dig in.", basis: "UF/IFAS; Florida gopher tortoise guidance." },
    ],
    "serenoa-repens": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Saw palmetto's fall fruit is eaten by many birds; its spring flowers are a legendary nectar and honey source.", basis: "UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Saw palmetto scrub is core gopher tortoise habitat, and the berries are part of its diet.", basis: "UF/IFAS; Florida gopher tortoise guidance." },
    ],
    "diospyros-virginiana": [
      { wildlifeId: "luna-moth", support: "host", note: "Persimmon is one of the luna moth's main caterpillar trees in the Deep South, where it uses persimmon and sweetgum more than the birches it takes up north.", basis: "NWF Native Plant Finder; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Ripe persimmons drop in late fall and are taken by foxes, raccoons, opossums, deer and black bears.", basis: "USDA PLANTS; UF/IFAS." },
    ],
    "celtis-laevigata": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The small sweet berries hang on into winter, when mockingbirds, robins and woodpeckers work the tree for them.", basis: "Cornell Lab; UF/IFAS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Wintering waxwing flocks strip sugarberry along with the hollies and cedars.", basis: "Cornell Lab." },
      { wildlifeId: "american-snout", support: "host", reliance: "sole", note: "Hackberry is the snout's only caterpillar food.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "hackberry-emperor", support: "host", reliance: "narrow", note: "Its caterpillars eat hackberry leaves and nothing else.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "tawny-emperor", support: "host", reliance: "narrow", note: "Tawny emperor caterpillars feed only on hackberries; they winter as tiny caterpillars in the fallen leaves below.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "magnolia-virginiana": [
      { wildlifeId: "eastern-tiger-swallowtail", support: "host", note: "Sweetbay is one of the tiger swallowtail's caterpillar trees, and in Florida one of its most used.", basis: "NWF Native Plant Finder; UF/IFAS." },
      { wildlifeId: "palamedes-swallowtail", support: "host", note: "Redbay is the palamedes' main host, but sweetbay is a recorded one too — useful now that disease is killing redbay.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; UF/IFAS." },
    ],
    "vaccinium-arboreum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Native bees work the small white bells in spring, including blueberry specialists.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black berries ripen in fall and last into winter for thrushes, mockingbirds and bluebirds.", basis: "Cornell Lab; UF/IFAS." },
      { wildlifeId: "southeastern-blueberry-bee", support: "nectar", reliance: "narrow", note: "Sparkleberry is a blueberry, so its spring flowers feed the blueberry bee.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
    ],
    "juniperus-virginiana": [
      { wildlifeId: "juniper-hairstreak", support: "host", reliance: "sole", note: "Florida's juniper hairstreaks raise their caterpillars on red cedar and nothing else.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The waxwing is named for this tree: flocks strip the blue cones in winter.", basis: "Cornell Lab." },
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "Wintering yellow-rumped warblers take the cones along with wax myrtle berries.", basis: "Cornell Lab." },
    ],
    "morella-cerifera": [
      { wildlifeId: "yellow-rumped-warbler", support: "berries", reliance: "narrow", note: "Yellow-rumped warblers can digest the wax on these berries, which few birds can, and it carries them through the Florida winter.", basis: "Cornell Lab; UF/IFAS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Tree swallows, bluebirds and catbirds take the waxy berries too.", basis: "Cornell Lab." },
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "Red-banded hairstreak caterpillars eat the fallen wax myrtle leaves on the ground.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "spicebush-swallowtail", support: "nectar", note: "Big swallowtails feed at it with their wings still beating, working round the sphere as they go.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers through the hottest months, when little else on a pond edge does.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "palamedes-swallowtail", support: "nectar", note: "Palamedes swallowtails crowd the round white flower heads in summer.", basis: "UF/IFAS; BAMONA." },
    ],
    "erythrina-herbacea": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Coral bean flowers in spring as ruby-throats come north, and its long red tubes are built for their bills.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "rhus-copallinum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Sumac fruit is a winter fallback for bluebirds, mockingbirds and thrushes when richer berries are gone.", basis: "Cornell Lab; UF/IFAS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The small summer flowers are worked by many native bees and wasps.", basis: "Xerces Society." },
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "Its caterpillars eat dead sumac leaves in the litter below.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
    ],
    "lobelia-cardinalis": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Vivid red tubes are shaped for a hummingbird's bill and are one of its most important native nectar plants.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "rudbeckia-hirta": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A sunflower-family bloom whose pollen feeds specialist bees.", basis: "Fowler & Droege." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Wintering goldfinches pick the seed from the dry cones.", basis: "Cornell Lab." },
    ],
    "helianthus-angustifolius": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A true sunflower, and late — a pollen source for specialist bees at the end of the season.", basis: "Fowler & Droege." },
      { wildlifeId: "monarch", support: "nectar", note: "October bloom feeds monarchs moving south through Florida.", basis: "Xerces Society; UF/IFAS." },
    ],
    "gelsemium-sempervirens": [
      { wildlifeId: "mason-bees", support: "nectar", note: "One of the first flowers of the year, worked by early native bees.", basis: "UF/IFAS; Xerces Society." },
    ],
    "lonicera-sempervirens": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Coral tubular flowers over a long season make it one of the best hummingbird vines there is.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "host", note: "Honeysuckle is a documented caterpillar plant of the hummingbird clearwing moth.", basis: "NWF Native Plant Finder." },
    ],
    "bignonia-capreolata": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Its orange-red trumpets open as the first ruby-throats arrive in spring.", basis: "UF/IFAS; LBJ Wildflower Center." },
    ],
    "wisteria-frutescens": [
      { wildlifeId: "silver-spotted-skipper", support: "host", note: "One of the legumes its caterpillars eat, folding a leaflet into a shelter to feed in.", basis: "Butterflies and Moths of North America; UF/IFAS." },
    ],
    "campsis-radicans": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Long orange trumpets that open all summer, shaped to a hummingbird's bill.", basis: "Cornell Lab; UF/IFAS." },
    ],
    "quercus-myrtifolia": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Myrtle oak acorns are a mainstay of the Florida scrub-jay, which buries them by the thousand.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Deer, squirrels and raccoons eat the small acorns in the scrub.", basis: "UF/IFAS." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "Like other oaks, myrtle oak feeds Horace's duskywing caterpillars.", basis: "BAMONA." },
    ],
    "acer-rubrum": [
      { wildlifeId: "io-moth", support: "host", note: "Red maple is one of the trees io moth caterpillars eat.", basis: "GloBI — Hale et al. 2024; Wagner, Caterpillars of Eastern North America." },
      { wildlifeId: "cecropia-moth", support: "host", note: "Red maple is one of the cecropia caterpillar's main trees.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "vaccinium-corymbosum": [
      { wildlifeId: "southeastern-blueberry-bee", support: "nectar", reliance: "narrow", note: "The blueberry bee buzzes pollen from these bell-shaped flowers in early spring.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S.; USDA ARS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Catbirds, mockingbirds and thrushes eat the berries as they ripen.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
    ],
    "vaccinium-stamineum": [
      { wildlifeId: "southeastern-blueberry-bee", support: "nectar", reliance: "narrow", note: "Deerberry is a blueberry too, and its open bells feed blueberry specialist bees.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds take the greenish berries in late summer.", basis: "UF/IFAS." },
    ],
    "asimina-reticulata": [
      { wildlifeId: "zebra-swallowtail", support: "host", reliance: "narrow", note: "Zebra swallowtail caterpillars eat only pawpaws, and this scrub pawpaw is one of Florida's.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the flowers and the fallen fruit.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "zamia-integrifolia": [
      { wildlifeId: "atala", support: "host", reliance: "sole", note: "Coontie is the atala's only native host, and the butterfly is spreading north again as people plant it.", basis: "Florida Native Plant Society; UF/IFAS." },
    ],
    "ruellia-caroliniensis": [
      { wildlifeId: "common-buckeye", support: "host", note: "Wild petunia is a caterpillar food for the common buckeye.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "white-peacock", support: "host", note: "White peacock caterpillars eat wild petunia leaves too.", basis: "BAMONA; UF/IFAS." },
    ],
    "dyschoriste-oblongifolia": [
      { wildlifeId: "common-buckeye", support: "host", note: "This low groundcover is a caterpillar food for the common buckeye.", basis: "Florida Wildflower Foundation; UF/IFAS." },
    ],
    "stokesia-laevis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the big blue flower heads in early summer.", basis: "UF/IFAS; Xerces Society." },
    ],
    "asclepias-perennis": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of wet ground, so monarch caterpillars can grow up on it.", basis: "Monarch Watch; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Queen caterpillars also feed only on milkweeds, this one included.", basis: "BAMONA; UF/IFAS." },
    ],
    "conoclinium-coelestinum": [
      { wildlifeId: "queen-butterfly", support: "nectar", note: "Queens are drawn to mistflower more than to almost anything else.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "monarch", support: "nectar", note: "Blue flowers into fall, when monarchs are on the move.", basis: "UF/IFAS." },
    ],
    "tradescantia-ohiensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flowers offer pollen, not nectar, and bumble bees buzz it loose in the morning.", basis: "Xerces Society." },
    ],
    "solidago-odora": [
      { wildlifeId: "monarch", support: "nectar", note: "Goldenrod is a classic fall nectar plant for monarchs.", basis: "Monarch Watch; Xerces Society." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrod pollen feeds bees that collect only from the sunflower family.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
    ],
    "liatris-spicata": [
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs stop at the purple spikes in late summer.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the spikes from the top down.", basis: "Xerces Society." },
    ],
    "coreopsis-lanceolata": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A coreopsis, so its pollen feeds the sunflower-family specialists.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches pick the seed from the dry heads.", basis: "Cornell Lab of Ornithology." },
    ],
    "penstemon-multiflorus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees climb into the white tubes for nectar.", basis: "Xerces Society." },
    ],
    "iris-virginica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are the right size to push past the petals to the nectar.", basis: "Xerces Society." },
    ],
    "chamaecrista-fasciculata": [
      { wildlifeId: "cloudless-sulphur", support: "host", reliance: "narrow", note: "Partridge pea is one of the few plants cloudless sulphur caterpillars eat.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "ceraunus-blue", support: "host", note: "Ceraunus blue caterpillars eat the flower buds and young pods.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees shake the pollen out of the yellow flowers.", basis: "Xerces Society." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Tortoises graze partridge pea, one of the native legumes they seek out.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "sorghastrum-secundum": [
      { wildlifeId: "grass-skippers", support: "host", note: "Indiangrasses are caterpillar food for several skippers.", basis: "BAMONA." },
    ],
    "centrosema-virginianum": [
      { wildlifeId: "long-tailed-skipper", support: "host", note: "Long-tailed skipper caterpillars fold butterfly pea leaves into shelters and feed inside.", basis: "Florida Native Plant Society; BAMONA." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Tortoises graze butterfly pea, one of the native legumes they seek out.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "mitchella-repens": [
      { wildlifeId: "acorn-birds", support: "berries", note: "Wild turkeys pick the red berries off the forest floor in winter.", basis: "USDA Fire Effects Information System." },
    ],
    "aristida-stricta": [
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Wiregrass is a staple of the tortoise's grazing, and the groundcover that carries the fires keeping its sandhills open.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "pityopsis-graminifolia": [
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Silkgrass is one of the low plants tortoises graze in open, sunny sand.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
  },

  "florida-south": {
    "serenoa-repens": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "sole", note: "The palmetto skipper's caterpillars eat saw palmetto and nothing else, living in a rolled-up section of frond. Clear the palmetto out of a scrub and the butterfly goes with it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "A saw palmetto in flower is one of the most-visited plants in Florida — dozens of native solitary bee species have been recorded on it, several of which are found on little else.", basis: "GloBI — GBIF-US bee occurrence datasets, iNaturalist observation records; Florida Native Plant Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black autumn fruit feeds robins, mockingbirds, raccoons, foxes and bears in turn.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the fallen fruit in palmetto flatwoods.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "sabal-palmetto": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "A fruiting cabbage palm feeds catbirds, mockingbirds, robins and vireos at once, for weeks.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Muñoz et al. 2018 animal–plant synthesis; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Raccoons climb for the fruit and deer take what drops — one palm supports a surprising amount of traffic.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); UF/IFAS." },
    ],
    "bursera-simaruba": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Gumbo limbo fruits in late winter, exactly when the migrant flycatchers and vireos are moving through and there is little else ripe.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Institute for Regional Conservation." },
      { wildlifeId: "atala", support: "nectar", note: "Atalas come to its small greenish flowers — the coontie raises them, but they still have to eat as adults.", basis: "GloBI — iNaturalist observation records; Florida Museum of Natural History." },
    ],
    "conocarpus-erectus": [
      { wildlifeId: "grass-skippers", support: "nectar", note: "Buttonwood's little cone-flowers are worked by the mangrove and hammock skippers and the big daggerwings — the butterflies of the coastal edge.", basis: "GloBI — iNaturalist observation records; Institute for Regional Conservation." },
      { wildlifeId: "berry-songbirds", support: "seeds", note: "Painted buntings take the seed heads, and the dense salt-tolerant crown is nesting cover where little else will grow.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
    ],
    "sophora-tomentosa-truncata": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Necklacepod's yellow pea flowers have to be forced open, and on a coastal dune the insects heavy enough to do it are mostly bumble bees.", basis: "GloBI — GBIF-US bee occurrence datasets, iNaturalist observation records; Institute for Regional Conservation." },
    ],
    "rivina-humilis": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Rougeplant's translucent red berries hang on the stem for months, and cardinals work along a row of them in the shade of a hammock.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); UF/IFAS." },
      { wildlifeId: "white-peacock", support: "nectar", note: "Its tiny white flowers are open all year, which is what a butterfly on the wing in January needs.", basis: "GloBI — iNaturalist observation records; Florida Native Plant Society." },
    ],
    "tripsacum-dactyloides": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Gamagrass is what the byssus skipper's caterpillars eat, rolled inside a blade of it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "zamia-integrifolia": [
      { wildlifeId: "atala", support: "host", reliance: "sole", note: "Coontie is the atala butterfly's only native caterpillar plant — planting it is how the atala was brought back from near-extinction in South Florida.", basis: "UF/IFAS; Florida Museum of Natural History." },
    ],
    "passiflora-suberosa": [
      { wildlifeId: "zebra-longwing", support: "host", reliance: "sole", note: "Corkystem passionvine is a preferred host for the zebra longwing.", basis: "UF/IFAS." },
      { wildlifeId: "gulf-fritillary", support: "host", reliance: "sole", note: "A caterpillar host for the gulf fritillary as well.", basis: "UF/IFAS." },
    ],
    "stachytarpheta-jamaicensis": [
      { wildlifeId: "white-peacock", support: "host", reliance: "narrow", note: "Blue porterweed is a larval host for the white peacock butterfly.", basis: "UF/IFAS; Florida Native Plant Society." },
      { wildlifeId: "zebra-longwing", support: "nectar", note: "Its long blue flower spikes are a top nectar source for longwings and many other butterflies.", basis: "UF/IFAS." },
    ],
    "salvia-coccinea": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Scarlet sage blooms nearly year-round in South Florida — steady hummingbird fuel.", basis: "UF/IFAS; Audubon." },
    ],
    "hamelia-patens": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Firebush is a premier hummingbird and butterfly nectar shrub in the subtropics.", basis: "UF/IFAS." },
      { wildlifeId: "zebra-longwing", support: "nectar", note: "Constant orange-red bloom feeds zebra longwings and gulf fritillaries.", basis: "UF/IFAS." },
    ],
    "morella-cerifera": [
      { wildlifeId: "yellow-rumped-warbler", support: "berries", note: "Wax myrtle's waxy berries are the food that lets yellow-rumped (\"myrtle\") warblers winter across the South.", basis: "Cornell Lab; UF/IFAS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Its fruit also feeds tree swallows, catbirds, and other wintering birds.", basis: "Cornell Lab." },
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "Red-banded hairstreak caterpillars eat the fallen wax myrtle leaves on the ground.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
    ],
    "psychotria-nervosa": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild coffee's red berries are taken by mockingbirds, cardinals, and catbirds; its flowers feed butterflies.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "coccoloba-uvifera": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Seagrape's ripe purple fruit is eaten by mockingbirds and other coastal birds (and people).", basis: "UF/IFAS." },
    ],
    "coccoloba-diversifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Pigeon plum's dark fruit is a favorite of white-crowned pigeons and other fruit-eating birds.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "chrysobalanus-icaco": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Cocoplum's fruit feeds birds and mammals along the subtropical coast.", basis: "UF/IFAS." },
    ],
    "myrcianthes-fragrans": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Simpson's stopper berries are a favorite of mockingbirds and other songbirds.", basis: "UF/IFAS." },
    ],
    "quercus-virginiana": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Live oak acorns feed jays, woodpeckers, and ducks in South Florida too.", basis: "UF/IFAS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Mast for squirrels and other mammals.", basis: "UF/IFAS." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "Horace's duskywing caterpillars eat live oak leaves inside folded leaf shelters.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "helianthus-debilis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Dune sunflower's pollen supports sunflower-family specialist bees along the coast.", basis: "Fowler & Droege; UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Gopher tortoises graze dune sunflower on coastal sand and open uplands.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "andropogon-glomeratus": [
      { wildlifeId: "grass-skippers", support: "host", note: "Bluestems are caterpillar grass for several skippers, which hide in rolled-up blades and winter down in the clump.", basis: "NWF Native Plant Finder; Xerces Society." },
    ],
    "canavalia-rosea": [
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", note: "Carpenter bees are heavy enough to force open its pea flowers, and they're its main visitors on the dune.", basis: "Institute for Regional Conservation; Xerces Society." },
    ],
    "vitis-rotundifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, thrashers and catbirds eat the grapes that split on the vine.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Foxes, raccoons, opossums and deer feed on the fallen grapes.", basis: "UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the muscadines that fall within reach.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "symphyotrichum-carolinianum": [
      { wildlifeId: "monarch", support: "nectar", note: "It flowers in winter here, when Florida's resident monarchs have little else to feed on.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "nectar", note: "Queens crowd its fragrant flowers through the dry season.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "phyla-nodiflora": [
      { wildlifeId: "phaon-crescent", support: "host", reliance: "sole", note: "Frogfruit is the phaon crescent's caterpillar food: leave a patch unmown and they will find it.", basis: "GloBI — iNaturalist observation records; BAMONA; UF/IFAS." },
      { wildlifeId: "white-peacock", support: "host", note: "One of the white peacock's caterpillar plants, and it flowers in every month the butterfly flies here.", basis: "UF/IFAS; BAMONA." },
    ],
    "mimosa-strigillosa": [
      { wildlifeId: "grass-skippers", support: "nectar", note: "Fiery skippers come down to it constantly — one of the few nectar plants that survives being walked over.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Gopher tortoises graze the leaves and pink puffball flowers.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "pontederia-cordata": [
      { wildlifeId: "white-peacock", support: "nectar", note: "White peacocks feed at the flower spikes most of the year along south-Florida canals.", basis: "GloBI — iNaturalist observation records." },
    ],
    "coreopsis-leavenworthii": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Florida's state wildflower group — its pollen feeds sunflower-family specialist bees, here nearly all year.", basis: "Fowler & Droege; UF/IFAS." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of wet ground and a monarch host; in south Florida some monarchs breed all year.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Queen caterpillars, the monarch's cousin, also eat only milkweeds.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "solidago-stricta": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Goldenrods carry more pollen-specialist bees than almost any other plant.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Prime fall nectar for the monarchs that winter in south Florida.", basis: "Xerces Society; UF/IFAS." },
    ],
    "ruellia-caroliniensis": [
      { wildlifeId: "white-peacock", support: "host", note: "Carolina wild petunia is one of the white peacock's caterpillar plants.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "liatris-gracilis": [
      { wildlifeId: "monarch", support: "nectar", note: "Its purple spikes are prime fall nectar for the monarchs that winter in south Florida.", basis: "UF/IFAS; Xerces." },
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A sunflower-family bloom supporting specialist bees.", basis: "Fowler & Droege." },
    ],
    "melanthera-nivea": [
      { wildlifeId: "zebra-longwing", support: "nectar", note: "Its white flowers, open all year, are a favorite nectar of the zebra longwing.", basis: "GloBI — iNaturalist observation records; Institute for Regional Conservation." },
    ],
    "pinus-elliottii": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Fox and gray squirrels strip the cones for their seeds.", basis: "USDA Silvics of North America." },
    ],
    "salix-caroliniana": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Willows are the viceroy's main caterpillar food, and coastal plain willow is the one in Florida's wetlands.", basis: "GloBI — Ecdysis arthropod records; BAMONA." },
      { wildlifeId: "io-moth", support: "host", note: "Willow is one of the many leaves io moth caterpillars eat.", basis: "Wagner, Caterpillars of Eastern North America; UF/IFAS." },
    ],
    "acer-rubrum": [
      { wildlifeId: "io-moth", support: "host", note: "Red maple is one of the trees io moth caterpillars eat.", basis: "GloBI — Hale et al. 2024; Wagner, Caterpillars of Eastern North America." },
    ],
    "ilex-cassine": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Catbirds, robins and mockingbirds eat the red berries through winter.", basis: "GloBI — Fricke & Svenning 2020 frugivory network; Cornell Lab of Ornithology." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks strip dahoon berries when they arrive in late winter.", basis: "Cornell Lab of Ornithology; UF/IFAS." },
    ],
    "taxodium-distichum": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels pull apart the round cones for the seeds inside.", basis: "USDA Silvics of North America." },
    ],
    "annona-glabra": [
      { wildlifeId: "acorn-mammals", support: "berries", note: "Raccoons and other swamp animals eat the big fallen fruit.", basis: "UF/IFAS." },
    ],
    "chrysophyllum-oliviforme": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds eat the small dark-purple fruit.", basis: "UF/IFAS." },
    ],
    "vaccinium-myrsinites": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds take the small blue berries in spring.", basis: "UF/IFAS; Cornell Lab of Ornithology." },
      { wildlifeId: "gopher-tortoise", support: "berries", note: "Gopher tortoises eat the low berries in the pine flatwoods.", basis: "UF/IFAS." },
    ],
    "callicarpa-americana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Purple berries eaten by mockingbirds, catbirds and thrashers in fall and winter.", basis: "UF/IFAS; Cornell Lab of Ornithology." },
    ],
    "rhus-copallinum": [
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "Its caterpillars eat dead sumac leaves in the litter below.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red seed clusters stay on into winter, food for birds when little else is left.", basis: "UF/IFAS; Cornell Lab of Ornithology." },
    ],
    "ilex-glabra": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Black berries that hang on into winter for birds.", basis: "UF/IFAS." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "palamedes-swallowtail", support: "nectar", note: "Palamedes swallowtails crowd the round white flower heads in summer.", basis: "UF/IFAS; BAMONA." },
    ],
    "erythrina-herbacea": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Red tubes in spring, as ruby-throats pass through.", basis: "UF/IFAS; Cornell Lab of Ornithology." },
    ],
    "myrsine-cubana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small black fruit packed along the stems, eaten by birds.", basis: "UF/IFAS." },
    ],
    "eugenia-axillaris": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds eat the black berries in the hammocks.", basis: "UF/IFAS." },
    ],
    "forestiera-segregata": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds eat the small dark fruit in spring.", basis: "UF/IFAS." },
    ],
    "crinum-americanum": [
      { wildlifeId: "spanish-moth", support: "host", note: "Spanish moth caterpillars eat swamp lily leaves, often down to the stalk; the plant grows back.", basis: "UF/IFAS Featured Creatures." },
    ],
    "hymenocallis-latifolia": [
      { wildlifeId: "spanish-moth", support: "host", note: "Spider lilies are a caterpillar food for the Spanish moth.", basis: "UF/IFAS Featured Creatures." },
    ],
    "asclepias-perennis": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "A milkweed of wet ground, so monarch caterpillars can grow up on it.", basis: "Monarch Watch; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Queen caterpillars also feed only on milkweeds, this one included.", basis: "BAMONA; UF/IFAS." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "Butterfly weed is a milkweed, so monarch caterpillars can grow up on it.", basis: "Monarch Watch; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Queen caterpillars eat it too.", basis: "BAMONA; UF/IFAS." },
    ],
    "conoclinium-coelestinum": [
      { wildlifeId: "queen-butterfly", support: "nectar", note: "Queens are drawn to mistflower more than to almost anything else.", basis: "BAMONA; UF/IFAS." },
      { wildlifeId: "monarch", support: "nectar", note: "Blue flowers into fall, when monarchs are on the move.", basis: "UF/IFAS." },
    ],
    "tradescantia-ohiensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flowers offer pollen, not nectar, and bumble bees buzz it loose in the morning.", basis: "Xerces Society." },
    ],
    "solidago-odora": [
      { wildlifeId: "monarch", support: "nectar", note: "Goldenrod is a classic fall nectar plant for monarchs.", basis: "Monarch Watch; Xerces Society." },
    ],
    "liatris-spicata": [
      { wildlifeId: "monarch", support: "nectar", note: "Monarchs stop at the purple spikes in late summer.", basis: "Xerces Society; UF/IFAS." },
    ],
    "penstemon-multiflorus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees climb into the white tubes for nectar.", basis: "Xerces Society." },
    ],
    "tripsacum-floridanum": [
      { wildlifeId: "grass-skippers", support: "host", note: "Gamagrasses are the byssus skipper's caterpillar food.", basis: "BAMONA." },
    ],
    "centrosema-virginianum": [
      { wildlifeId: "long-tailed-skipper", support: "host", note: "Long-tailed skipper caterpillars fold butterfly pea leaves into shelters and feed inside.", basis: "Florida Native Plant Society; BAMONA." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Tortoises graze butterfly pea, one of the native legumes they seek out.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
    "echites-umbellatus": [
      { wildlifeId: "polka-dot-wasp-moth", support: "host", reliance: "narrow", note: "Devil's potato is the moth's native host, the vine its caterpillars ate before oleander.", basis: "UF/IFAS Featured Creatures." },
    ],
    "pentalinon-luteum": [
      { wildlifeId: "polka-dot-wasp-moth", support: "host", note: "Polka-dot wasp moth caterpillars eat wild allamanda leaves too.", basis: "Florida Native Plant Society; UF/IFAS." },
    ],
    "pityopsis-graminifolia": [
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Silkgrass is one of the low plants tortoises graze in open, sunny sand.", basis: "FWC Gopher Tortoise Management Plan; UF/IFAS." },
    ],
  },

  // ---- France. Sources are the French/European equivalents of the American
  // ones above: the INPN (Muséum national d'Histoire naturelle) for species and
  // their food plants, the LPO for birds, and the open European butterfly
  // larval-foodplant checklist (Dryad, doi:10.5061/dryad.1vhhmgr12). The plant
  // rows' own hostLepCount figures come from the Gaytán matrix; these ties are
  // the named, recognizable relationships behind those numbers.
  "france-atlantic": {
    "quercus-robur": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Purple hairstreak caterpillars eat oak and nothing else. The whole butterfly happens up in the canopy — eggs on the buds, caterpillars on the new leaves, adults circling the crown — so an old oak in a hedge is a colony nobody on the ground ever notices.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay carries off and buries a few thousand acorns each autumn and forgets enough of them that it is the main reason oak woods spread at all. Plant one oak and the jays plant the rest.", basis: "LPO; INPN." },
    ],
    "betula-pendula": [
      { wildlifeId: "mourning-cloak", support: "host", note: "Birch leaves feed the mourning cloak's spiny black caterpillars, which stay in a group on one branch until they are nearly grown.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024), records carrying a larval life stage; INPN." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins crumble apart through the winter into seed so fine that only the small finches bother with it — siskins and redpolls hang upside down along the outer twigs to get at it, usually in one noisy party.", basis: "LPO; INPN." },
    ],
    "salix-caprea": [
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow is the mourning cloak's other caterpillar tree — and the adult, which overwinters, is often the first butterfly anyone sees in February.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024), records carrying a larval life stage; INPN." },
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "The purple emperor lays on sallows, and goat willow is the one it picks most often. Its caterpillar spends the winter pressed flat against a twig, colored exactly like the bark, and turns green again with the leaves.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A bumble bee queen comes out of hibernation in February with nothing in reserve and has to found a whole colony alone, and for that she needs pollen — protein for the first grubs — not just sugar. Goat willow catkins are the first real supply of it in the year, which is why a sallow in flower in late winter is audible from across the garden.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "sorbus-aucuparia": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "A rowan in fruit is the loudest tree of the French autumn — redwings and fieldfares come off the northern migration straight into it and can strip it bare in two days.", basis: "LPO; INPN." },
    ],
    "alnus-glutinosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Alder's little woody cones hold their seed all winter, and siskins and redpolls work them hanging upside down in chattering flocks — the classic January sight along a French river.", basis: "LPO; INPN." },
    ],
    "crataegus-monogyna": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "A hedge of haws is what carries fieldfares and redwings through a French winter — they arrive in flocks and strip one hedge at a time.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The May froth of hawthorn blossom is one of the biggest single nectar events of the hedgerow year.", basis: "INPN; French pollinator surveys." },
    ],
    "prunus-spinosa": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Sloes hang on long after other fruit is gone, which is exactly when the winter thrushes need them.", basis: "LPO; INPN." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Blackthorn flowers on bare wood in March, before its own leaves — an early meal for solitary bees just emerging.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "brown-hairstreak", support: "host", reliance: "narrow", note: "The brown hairstreak lays on young blackthorn growth and the egg sits there all winter. Cut the hedge hard every year and you cut off the eggs.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "corylus-avellana": [
      { wildlifeId: "hazel-dormouse", support: "seeds", reliance: "narrow", note: "A dormouse has to roughly double its weight before it sleeps for six months, and hazelnuts are what it does that on. It opens each one with a neat round hole, toothmarks angled round the rim — often the only proof anyone has that dormice are living in a hedge at all.", basis: "INPN (MNHN); Woodland Trust." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Hazel is wind-pollinated and needs no insect at all, but its lamb's-tail catkins shed pollen in January and February and the earliest solitary bees collect it anyway — usually the first pollen of the year, a trickle before the willows open.", basis: "INPN; French pollinator surveys; Buglife." },
    ],
    "ilex-aquifolium": [
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The spring brood of the holly blue lays on holly flower buds, and the caterpillars eat the developing berries. The summer brood then moves to ivy, so a garden with both plants keeps the butterfly right through the season.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Holly holds its berries longer than anything else in the hedge, and a mistle thrush will guard a single bush against every other bird through the hardest weeks of the winter.", basis: "LPO; INPN." },
    ],
    "cornus-sanguinea": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Dogwood berries are small, black and very oily — the high-fat kind of fruit a warbler puts weight on with — and they ripen in September, exactly as the birds start moving south.", basis: "LPO; INPN." },
    ],
    "sambucus-nigra": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The late-summer elderberry crop is migration fuel: blackcaps, garden warblers and whitethroats pile into a fruiting elder and eat little else while it lasts.", basis: "LPO; INPN." },
    ],
    "frangula-alnus": [
      { wildlifeId: "brimstone", support: "host", reliance: "sole", note: "Buckthorns are the only thing a brimstone caterpillar can eat, and alder buckthorn is the buckthorn for damp, acid Atlantic ground. A searching female will find one small bush in a whole hedge — so a single shrub genuinely does put the first butterfly of spring in a garden.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation; Buglife." },
    ],
    "hyacinthoides-non-scripta": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bluebells flower in the few weeks between the ground warming and the canopy closing over — which is exactly when the spring solitary bees are stocking their nests. Mining bees work them all morning, and the furry brown hairy-footed flower bee hovers at each bell to reach the bottom.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "digitalis-purpurea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A foxglove is built for one animal: the spotted throat is a landing strip and a set of directions, and the tube is deep enough that only a long-tongued bumble bee reaches the end. Watch one climb right inside and reverse out dusted in pollen.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "primula-veris": [
      { wildlifeId: "duke-of-burgundy", support: "host", reliance: "sole", note: "The Duke of Burgundy lays only on cowslips and primroses — and only on plants sitting in the right amount of shelter, tucked into longer grass or the edge of scrub rather than out in a close-mown sward. Having the plant matters; so does when you cut around it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
    ],
    "succisa-pratensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Devil's-bit scabious flowers in late summer when the meadow is otherwise over — a last big meal for bumble bees and butterflies.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "marsh-fritillary", support: "host", reliance: "narrow", note: "The marsh fritillary lays its eggs in a batch under a devil's-bit scabious leaf, and the caterpillars winter together in a silk tent on the plant.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The browns and skippers that get up out of the grass as you walk a damp French meadow have eaten nothing but grass all their lives, and they spend the winter as caterpillars down inside a tussock like this one. A mown lawn offers them neither the food nor the shelter.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "lonicera-periclymenum": [
      { wildlifeId: "privet-hawk-moth", support: "nectar", note: "Honeysuckle opens at dusk and pours out scent for exactly one audience: the long-tongued hawk-moths that hover at it after dark.", basis: "INPN." },
      { wildlifeId: "white-admiral", support: "host", reliance: "narrow", note: "White admiral caterpillars eat honeysuckle trailing in shade, not in full sun. Leave it climbing through a woodland hedge.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "hazel-dormouse", support: "shelter", note: "The dormouse strips honeysuckle's papery bark to weave its summer nest.", basis: "INPN (MNHN); People's Trust for Endangered Species." },
    ],
    "hedera-helix": [
      { wildlifeId: "nettle-tree-butterfly", support: "nectar", note: "Ivy flowers in October, when nothing else does, and it is what the butterflies that overwinter as adults fill up on before they go to sleep.", basis: "GloBI — iNaturalist observation records; INPN." },
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The summer brood of the holly blue lays on ivy flower buds — the same plant whose October flowers feed the adults and whose evergreen tangle they shelter in. Ivy is half the reason this is the blue butterfly that thrives in towns.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Ivy berries ripen in late winter, the leanest moment of the year, and blackcaps and robins live on them.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Ivy flowers in October, the last nectar of the year, and a wall of it in flower is loud with late bees and butterflies.", basis: "INPN; French pollinator surveys." },
    ],
    "populus-tremula": [
      { wildlifeId: "poplar-hawk-moth", support: "host", reliance: "narrow", note: "Aspen and the other poplars are what the poplar hawk-moth grows up on, along with willow. It is the big hawk-moth people actually find — on a wall by a porch light in June, sitting in that wrong-looking way with its hindwings pushed out in front — and every one of them ate poplar leaves to get there.", basis: "INPN (MNHN)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Aspen is wind-pollinated and asks nothing of an insect, but it throws out an enormous amount of pollen in March and the early solitary bees collect it anyway — a free meal at the point in spring when there is very little else.", basis: "INPN; French pollinator surveys; Buglife." },
    ],
    "prunus-avium": [
      { wildlifeId: "hawfinch", support: "seeds", note: "Everything else takes the flesh of a wild cherry and drops the stone. The hawfinch does the opposite: it drops the flesh and splits the stone with a bill that can put fifty kilos on the seam, then eats the kernel. Wild cherry in July is the classic place to find one — or rather, to find the halved stones scattered under the tree after it has gone.", basis: "LPO; INPN (MNHN)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Cherry blossom opens in April in one great white flush, wide open and shallow, which is what a newly emerged mason or mining bee can actually work.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "ulmus-glabra": [
      { wildlifeId: "white-letter-hairstreak", support: "host", reliance: "sole", note: "Elm is the only thing this butterfly's caterpillars eat, and it lays on flower buds high in the crown, so a colony can sit over a hedge for years without anyone below noticing. It went down with the elms and comes back with them — which is the honest argument for planting one even knowing the disease is still out there.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "comma", support: "host", note: "Elm is one of the comma's caterpillar plants, alongside hop and nettle — the ragged-edged butterfly that spends the winter clamped to a twig looking exactly like a dead leaf.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "fagus-sylvatica": [
      { wildlifeId: "hawfinch", support: "seeds", note: "Beechmast is a hawfinch's winter staple, and in a heavy mast year the birds gather in the tops of beeches in numbers you never otherwise see them in — then are gone by spring.", basis: "LPO; INPN (MNHN)." },
    ],
    "carpinus-betulus": [
      { wildlifeId: "hawfinch", support: "seeds", reliance: "narrow", note: "Hornbeam seed is what carries hawfinches through a European winter more than any other tree. The little ribbed nuts sit in papery three-pointed wings and stay on the twigs long after the leaves have gone brown and hung on, and the birds work through them right into March.", basis: "LPO; INPN (MNHN)." },
    ],
    "pyrus-pyraster": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Wild pear blossoms in early April, a good two weeks ahead of the hawthorn, filling the gap after the blackthorn is over — which is precisely when solitary bees are provisioning their nests.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The little pears are rock-hard and inedible until frost softens them, and that is the point: they come good in December, when the hedge has nothing left, and the thrushes and blackbirds come to the ground for them.", basis: "LPO; INPN." },
    ],
    "tilia-cordata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lime in flower at the end of June is audible from the other side of the garden. It comes at the flattest moment of the year — the hedgerow blossom finished, the late flowers not started — and for two weeks it is the biggest single meal available to bumble bees for miles.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "rubus-fruticosus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bramble flowers right through August and September, when the meadows have dried off and the hedgerow blossom is a memory. A bank of it in flower is the busiest thing in a French garden at that point in the year.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackberries ripen a few at a time over weeks rather than all at once, which is exactly what a warbler putting on migration fat needs — a supply, not a glut.", basis: "LPO; INPN." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "A dormouse eats bramble flowers in summer and the berries in autumn, and it uses the tangle as a road: it will not cross open ground, so a bramble edge running along a hedge is how it gets anywhere at all.", basis: "INPN (MNHN); Woodland Trust." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "painted-lady", support: "nectar", note: "An August heath is where the painted ladies feed before turning south — some of them will reach North Africa.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "silver-studded-blue", support: "host", reliance: "narrow", note: "Heather is this butterfly's plant, and black ants are the other half of it — they find the caterpillar, feed on the sweet liquid it gives off, and guard it in return, often taking the chrysalis into their own nest. Which is why it wants young heather with warm bare ground between the plants, not a closed carpet of it.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "emperor-moth", support: "host", note: "The emperor moth's caterpillars grow up on heather, and the males hunt for females low over it on sunny April afternoons — a fast zigzagging orange-brown moth, flying by day, that most people take for a butterfly.", basis: "INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "When the meadows have been cut and the hedge flowers are long over, an August heather slope is the last great nectar source of the year — this is the plant heather honey comes from.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "cytisus-scoparius": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Broom is one of the green hairstreak's main caterpillar plants, along with gorse, dyer's greenweed and bilberry — Europe's commonest green butterfly, and one you find by watching a sunny scrubby bank rather than a flower bed.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Broom flowers are spring-loaded and stay shut until something heavy enough lands on them: a bumble bee trips the catch, the stamens fly up and slap pollen onto her back, and the flower is done. Worth crouching down to watch once.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The black pods crack open with an audible snap on a hot July afternoon and fling the seed a couple of meters — and linnets, which love a broomy bank, work the ground and the bushes for it.", basis: "LPO; INPN." },
    ],
    "genista-tinctoria": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Dyer's greenweed is one of the pea-family shrubs the green hairstreak lays on, in the same rough sunny scrub as the broom and the gorse.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Another spring-loaded pea flower, too stiff for a small bee to open — it takes the weight of a bumble bee to trip it.", basis: "INPN; French pollinator surveys." },
    ],
    "vaccinium-myrtillus": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Bilberry is one of the green hairstreak's caterpillar plants, and on Atlantic heath and open woodland it is often the main one.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Little pink bells in April, hanging mouth-down so nothing but a bee that will hold on upside down can get in.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The July berry crop feeds blackbirds, thrushes and ring ouzels — and dormice and foxes, if you have not got there first.", basis: "LPO; INPN." },
    ],
    "rosa-arvensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A single wild rose is an open dish with the pollen sitting in plain reach, so a bee can actually use it. A double garden rose has bred that away — for an insect it is scenery.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Hips hang on into December for fieldfares, redwings and blackbirds, at the point in winter when a hedge has been stripped of everything softer.", basis: "LPO; INPN." },
    ],
    "humulus-lupulus": [
      { wildlifeId: "comma", support: "host", note: "Hop is the comma's classic caterpillar plant, along with nettle and elm. The caterpillar is white-splashed down the back so that on a leaf it reads as a bird dropping, which is a good deal more useful to it than being green.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", reliance: "narrow", note: "Bird's-foot trefoil is the common blue's main caterpillar plant — and ants often stand over the caterpillars, guarding them for the sweet drops they give off. If a meadow has lost its blue butterflies, this is usually what it has lost.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "host", reliance: "narrow", note: "The burnet moth's caterpillars take cyanide compounds out of trefoil leaves and keep them for life — which is why the adult can afford to fly slowly in broad daylight in scarlet and black, and why nothing eats it.", basis: "INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long season of small yellow-and-orange flowers, May right through to September, worked constantly by bumble bees.", basis: "INPN; French pollinator surveys." },
    ],
    "trifolium-pratense": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower tube of red clover is too deep for a honeybee to empty, so the nectar at the bottom belongs to the long-tongued bumble bees, which is one reason several of them have declined along with this plant.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "plantago-lanceolata": [
      { wildlifeId: "glanville-fritillary", support: "host", reliance: "narrow", note: "Ribwort plantain is what the Glanville fritillary lays on, and it lays the whole batch in one place: the caterpillars hatch together, spin a silk tent over the plant, and spend the winter inside it as a huddle. On the first warm days of spring they come out and bask on top of the web in a black knot — the easiest way anyone ever finds them.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The little brown drumstick heads fill with seed from midsummer on, and goldfinches and linnets strip them — provided they are still standing, which in a lawn mown every two weeks they never are.", basis: "LPO; INPN." },
    ],
    "rumex-acetosa": [
      { wildlifeId: "small-copper", support: "host", reliance: "sole", note: "The small copper lays on sorrels and docks and its caterpillars eat nothing else. They feed on the underside of a leaf and graze it down to a translucent window rather than chewing through, so the damage looks like a pale patch, not a hole — that is what to look for on a plant in a rough corner in June.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The rusty seed spikes hold together well into winter and finches take them apart standing on the stem.", basis: "LPO; INPN." },
    ],
    "galium-verum": [
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "Bedstraws are the elephant hawk-moth's main caterpillar plant, along with willowherb. What you find is the caterpillar, not the moth: a gray-brown thing the length of a finger that pulls its snout in when touched and swells up four eyespots, and does a convincing enough snake to make a grown adult step back.", basis: "INPN (MNHN)." },
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The hummingbird hawk-moth — the day-flying one people report as a baby hummingbird — also raises its caterpillars on bedstraws. Growing lady's bedstraw is how you get the whole animal, not just an adult passing through on its way north.", basis: "INPN (MNHN)." },
    ],
    "centaurea-nigra": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the deepest nectar wells of any French wildflower, and it keeps going long after the meadow has been cut and the brambles are over — bumble bees, the meadow browns and the big fritillaries all work it into the autumn.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "A knapweed head gone over is a goldfinch's favorite thing in the garden — they hang off it upside down and take it apart all autumn. Cut the stems down in September and you have thrown the winter food away.", basis: "LPO; INPN." },
      { wildlifeId: "marbled-white", support: "nectar", note: "Marbled whites feed on purple flowers, and knapweed is their favorite in July.", basis: "Butterfly Conservation; INPN (MNHN)." },
    ],
    "artemisia-vulgaris": [
      { wildlifeId: "mason-bees", support: "shelter", note: "Mugwort's flowers feed nobody — they are wind-pollinated. What it gives is the dead stems: hollow, standing, and full of small solitary bees, ladybugs and lacewings spending the winter inside them. Which is the whole argument for leaving them up until spring instead of tidying in October.", basis: "INPN; Buglife; French pollinator surveys." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches and linnets take the fine seed off the standing stems through the winter.", basis: "LPO; INPN." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers held just above the ground from April onwards — shallow enough that the smallest mining bees can work them, which most spring flowers are not.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "festuca-rubra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The meadow brown, the gatekeeper, the ringlet, the marbled white and the skippers have all eaten nothing but grass their whole caterpillar lives, and fine grasses like this one are what they choose. They also spend the winter down inside the tussock — so a lawn mown every two weeks feeds none of them, and a lawn left to flower feeds all of them.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Left to flower and seed, a fescue lawn feeds finches and buntings in late summer — the same patch of ground, doing two jobs, for the price of not cutting it.", basis: "LPO; INPN." },
      { wildlifeId: "marbled-white", support: "host", note: "Red fescue is one of the main grasses marbled white caterpillars eat; leave a strip uncut until late summer.", basis: "Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "poa-nemoralis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "This is the shady half of the grass food web. The ringlet and the speckled wood — the brown butterfly patrolling the sun-flecks along a woodland path — lay on grasses like this, and their caterpillars feed at night down among the blades. Shade that is currently bare soil offers them nothing at all.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "acer-campestre": [
      { wildlifeId: "hawfinch", support: "seeds", note: "Field maple's winged seeds hang on into winter, and the hawfinch cracks them where smaller finches give up.", basis: "LPO; INPN." },
    ],
    "malus-sylvestris": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Crab apples fall and soften in the grass, and fieldfares and blackbirds come back to them all winter.", basis: "LPO; INPN." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Crab apple blossom in late April feeds mason bees, which pollinate it far better than any honey bee.", basis: "INPN; French pollinator surveys." },
    ],
    "quercus-petraea": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Sessile oak suits the purple hairstreak as well as pedunculate oak: eggs on the buds in winter, caterpillars on the new leaves in May.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay buries thousands of acorns each autumn and forgets enough of them to plant the next oaks.", basis: "LPO; INPN." },
    ],
    "euonymus-europaeus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The orange seeds inside spindle's pink capsules are a robin's food in autumn, poisonous to us but not to it.", basis: "LPO; INPN." },
    ],
    "viburnum-opulus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Guelder rose berries are left until late winter, then eaten by thrushes when better fruit has run out.", basis: "LPO; INPN." },
    ],
    "ligustrum-vulgare": [
      { wildlifeId: "privet-hawk-moth", support: "host", note: "Wild privet is the plant this hawk-moth is named for: its big green caterpillar feeds on it in late summer.", basis: "INPN (MNHN)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The black privet berries stay on through winter, eaten by blackbirds and thrushes.", basis: "LPO; INPN." },
    ],
    "ulex-europaeus": [
      { wildlifeId: "silver-studded-blue", support: "host", note: "On the Atlantic heaths gorse is a silver-studded blue caterpillar plant — its French name, Azuré de l'Ajonc, means gorse blue.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "shelter", note: "Linnets nest deep in gorse, where the spines keep cats and magpies out.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Gorse flowers in almost every month, so a bumble bee queen waking early always finds something.", basis: "INPN; French pollinator surveys." },
    ],
    "erica-cinerea": [
      { wildlifeId: "silver-studded-blue", support: "host", note: "Bell heather is one of the silver-studded blue's caterpillar plants on dry heath, alongside common heather and gorse.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bell heather flowers from June, weeks before common heather, and bumble bees work it all summer.", basis: "INPN; French pollinator surveys." },
    ],
    "rosa-canina": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Rose hips soften after the first frosts, and blackbirds and fieldfares eat them then.", basis: "LPO; INPN." },
    ],
    "primula-vulgaris": [
      { wildlifeId: "duke-of-burgundy", support: "host", reliance: "narrow", note: "The Duke of Burgundy lays only on primroses and cowslips, choosing big leaves in light shade at a wood edge.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "brimstone", support: "nectar", note: "A brimstone waking in March finds almost nothing open. Primroses on a bank are one of the few flowers it can feed on.", basis: "INPN (MNHN); Butterfly Conservation." },
    ],
    "silene-dioica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Red campion flowers from April onward on shady banks, and bumble bees are its main visitors.", basis: "INPN; French pollinator surveys." },
    ],
    "filipendula-ulmaria": [
      { wildlifeId: "emperor-moth", support: "host", note: "Meadowsweet is one of the emperor moth's caterpillar plants away from the heath, so a damp meadow can raise one.", basis: "INPN (MNHN); Butterfly Conservation." },
    ],
    "lythrum-salicaria": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Purple loosestrife flowers for weeks along wet ditches in high summer, and long-tongued bumble bees work every spike.", basis: "INPN; French pollinator surveys." },
    ],
    "iris-pseudacorus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A bumble bee has to push in under the yellow flag's petal to reach the nectar, and comes out dusted with pollen.", basis: "INPN; French pollinator surveys." },
    ],
    "leucanthemum-vulgare": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Small resin bees that collect pollen only from daisy-family flowers use ox-eye daisy all summer.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "knautia-arvensis": [
      { wildlifeId: "large-scabious-mining-bee", support: "nectar", reliance: "narrow", note: "Field scabious is this bee's main pollen plant. Mow the meadow before it flowers and the bee has nothing to raise its young on.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Field scabious flowers all summer in rough grass and is busy with bumble bees the whole time.", basis: "INPN; French pollinator surveys." },
    ],
    "origanum-vulgare": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A patch of wild marjoram in flower draws bumble bees, butterflies and hoverflies all through August.", basis: "INPN; French pollinator surveys." },
    ],
    "achillea-millefolium": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "One small solitary bee, Colletes daviesanus, feeds its young almost only on yarrow and tansy pollen.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "eupatorium-cannabinum": [
      { wildlifeId: "peacock-butterfly", support: "nectar", note: "Hemp-agrimony is a late-summer magnet for peacocks fattening up before they hibernate.", basis: "Butterfly Conservation; INPN (MNHN)." },
      { wildlifeId: "red-admiral", support: "nectar", note: "Red admirals feed on its dusty-pink heads along damp lanes in August and September.", basis: "Butterfly Conservation; INPN (MNHN)." },
    ],
    "malva-moschata": [
      { wildlifeId: "painted-lady", support: "host", note: "Mallows are among the painted lady's caterpillar plants, along with thistles and nettles.", basis: "Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Musk mallow's open pink flowers feed bumble bees through the summer.", basis: "INPN; French pollinator surveys." },
    ],
    "teucrium-scorodonia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Wood sage flowers on dry, shady banks in high summer, and bumble bees are its main visitors.", basis: "INPN; French pollinator surveys." },
    ],
    "cardamine-pratensis": [
      { wildlifeId: "orange-tip", support: "host", reliance: "narrow", note: "The orange-tip lays one egg on a flower stem, and the caterpillar eats the seed pods. Leave the damp corner uncut until July.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "echium-vulgare": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Viper's bugloss refills its nectar through the day, so bumble bees keep coming back from June to September.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "hummingbird-hawk-moth", support: "nectar", note: "The hummingbird hawk-moth hovers at the blue flowers on a sunny afternoon, working along the spike.", basis: "INPN (MNHN)." },
    ],
    "hypericum-perforatum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "St John's wort has no nectar, but bumble bees buzz its pollen loose all summer.", basis: "INPN; French pollinator surveys." },
    ],
    "clematis-vitalba": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Old man's beard flowers in late summer over a hedge top, a mass of pollen for bees after the hedgerow blossom is over.", basis: "INPN; French pollinator surveys." },
    ],
    "ajuga-reptans": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bugle's blue spikes in spring woodland rides feed bumble bee queens setting up their nests.", basis: "INPN; French pollinator surveys." },
    ],
    "prunella-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Selfheal flowers low in the lawn all summer; leave it unmown and bumble bees will find it.", basis: "INPN; French pollinator surveys." },
    ],
    "glechoma-hederacea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Ground ivy flowers in March and April under hedges, when bumble bee queens badly need nectar.", basis: "INPN; French pollinator surveys." },
    ],
  },

  "france-continental": {
    "salix-caprea": [
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "The purple emperor lays on goat willow and nothing else. The males spend their lives in the tops of tall trees and come down only for damp ground — so the butterfly needs the willow in the wood, not the oak everyone plants for it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "The big green caterpillar with the blunt tail horn feeds on willow and poplar; the adult rests by day with its hind wings pushed out in front, looking like a heap of dead leaves.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Camberwell beauty caterpillars feed together on willow in a spiny black mass, and the adults overwinter as adults, so they are the first big butterfly of the eastern spring.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "March catkins are the first serious pollen of the year, opening exactly when the solitary bees come out of their tubes.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A goat willow in flower in March is where the newly-woken bumble bee queens go, and there is very little competition for their attention that early.", basis: "INPN; European pollinator literature." },
    ],
    "betula-pendula": [
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars feed on birch among a short list of shrubs and trees; the adult male has false eyes on all four wings and flies by day in April looking for females by scent.", basis: "INPN (MNHN)." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Birch is the Camberwell beauty's other tree, and a group of birches on rough ground is where you are most likely to meet one.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Siskins and redpolls hang in flocks off the hanging catkins all winter, working out seed that is barely bigger than the wind.", basis: "INPN; LPO." },
    ],
    "populus-tremula": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Aspen is one of the poplar hawk-moth's main trees; the caterpillars are on it through the summer and pupate in the soil beneath.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "purple-emperor", support: "host", note: "Aspen is the purple emperor's second tree after goat willow, and an aspen stand in a wood is where the whole colony is.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "alnus-glutinosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "A wet alder wood in January is a siskin wood: flocks working the little cones upside-down, calling constantly.", basis: "INPN; LPO." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches take the same seed alongside the siskins, and both return to the same trees day after day.", basis: "INPN; LPO." },
    ],
    "corylus-avellana": [
      { wildlifeId: "hazel-dormouse", support: "seeds", reliance: "narrow", note: "The dormouse is named after this plant in English, German and Latin, and the hazelnuts are what it fattens on before hibernating. A nut opened by a dormouse has a smooth round hole with tooth marks angled around the rim — the way to know it is there at all.", basis: "INPN (MNHN); European dormouse survey methods (nut-hunt protocol)." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays carry hazelnuts off and bury them singly, and the ones they forget are how a hazel gets planted somewhere new.", basis: "INPN; LPO." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Hazel catkins in January are the very first pollen of the eastern year, on a warm afternoon when almost nothing is flying.", basis: "INPN; European pollinator literature." },
    ],
    "rubus-fruticosus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Months of open flower, and a bramble in July has more insects on it at once than anything else in the garden — bumble bees, solitary bees, hoverflies and beetles.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Europe's commonest green butterfly lays on bramble among the other shrubs of rough ground, and rests with its wings shut on a sunny bank looking exactly like a leaf.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "Dormice work brambles for the fruit in late summer and travel along the canes, which is why a hedge with bramble in it is a corridor and a clipped one is a wall.", basis: "INPN (MNHN); European dormouse ecology." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackberries are what a warbler puts on weight with before going south, and the thorny mass is where it nested in June.", basis: "INPN; LPO." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Fieldfares and redwings clear whatever fruit is left when they arrive from the north in October.", basis: "INPN; LPO." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "silver-studded-blue", support: "host", reliance: "narrow", note: "The silver-studded blue lives on heathland and nowhere else, lays on heather, and its caterpillars are tended underground by ants that milk them for sugar — lose the heath and you lose the whole arrangement.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "emperor-moth", support: "host", note: "The emperor moth is a heathland insect above all, and heather is the plant its green ringed caterpillars are usually found on.", basis: "INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Heather flowers from July into October, which is precisely the gap when a bumble bee colony is trying to raise next year's queens and everything else has finished.", basis: "INPN; European beekeeping and pollinator literature." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Meadow browns, ringlets and skippers all raise their caterpillars on grass tussocks like this one, each caterpillar hidden in a leaf it has sewn shut behind itself.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "carex-sylvatica": [
      { wildlifeId: "grass-skippers", support: "host", note: "Sedges feed a long list of small brown butterflies and moths, and a shaded sedge patch is where they get through the year.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "plantago-lanceolata": [
      { wildlifeId: "glanville-fritillary", support: "host", reliance: "narrow", note: "The Glanville fritillary lays a batch of eggs on ribwort plantain, and the caterpillars spend the entire winter together in a silk web spun on the plant — which is why an autumn cut takes the whole brood.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches and linnets work the seed spikes from late summer on, one head at a time along a path edge.", basis: "INPN; LPO." },
    ],
    "galium-verum": [
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The day-flying moth that everyone takes for a tiny hummingbird lays on bedstraw — so a patch in rough grass turns a visitor into a resident.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "The elephant hawk-moth's gray caterpillar, with the false eyes it puffs up when alarmed, feeds on bedstraw and willowherb in late summer.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers over a long spring, shallow enough for the smallest solitary bees and hoverflies to use — which the deep garden flowers are not.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "Dormice take wild strawberries where the runners reach into a hedge bottom, along with everything else soft and sweet in a hedgerow summer.", basis: "INPN (MNHN); European dormouse ecology." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Warblers, robins and blackbirds all take the fruit off the ground layer, which is one of the few crops down at their level.", basis: "INPN; LPO." },
    ],
    "hedera-helix": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The ivy bee is a mining bee whose entire year is timed to this plant: it emerges in September as the ivy opens and is finished by the time the flowers are. Nothing else it can use is out then.", basis: "INPN; European pollinator literature (Colletes hederae)." },
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The holly blue alternates between two plants across its two broods a year — holly in spring, ivy buds in late summer. A garden needs both if it wants to keep the butterfly.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "red-admiral", support: "nectar", note: "Red admirals crowd onto ivy flowers in October, and are often the last butterflies anyone sees before the winter.", basis: "INPN (MNHN); European butterfly literature." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Ivy berries ripen in late winter, long after everything else has gone, which makes them what carries thrushes and wood pigeons through February.", basis: "INPN; LPO." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackcaps that now stay for the winter rather than going south depend heavily on that late crop.", basis: "INPN; LPO." },
    ],
    "quercus-petraea": [
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay carries acorns off in its throat and buries them one at a time, spread across the whole wood — thousands in an autumn. The ones it never comes back for are how an oak wood walks uphill.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "hazel-dormouse", support: "seeds", note: "Acorns are what a dormouse puts its winter weight on in October, in the last days before it curls up and sleeps for seven months.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Sessile oak suits the purple hairstreak as well as pedunculate oak: eggs on the buds in winter, caterpillars on the new leaves in May.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "fagus-sylvatica": [
      { wildlifeId: "hawfinch", support: "seeds", reliance: "narrow", note: "A hawfinch's beak shuts hard enough to crack a cherry stone. Beech mast is easy work by comparison, and in a mast year the wood fills with them.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "hazel-dormouse", support: "seeds", note: "Beechnuts are oil-rich and they fall in exactly the weeks a dormouse has to double its weight.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays bury beechnuts the same way they bury acorns — and plant the next generation of both by forgetting where.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "carpinus-betulus": [
      { wildlifeId: "hawfinch", support: "seeds", reliance: "narrow", note: "Hornbeam seed hangs on in papery bunches all winter, and it is the food a flock of hawfinches will stay in one wood for.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Another of the nuts a jay stores for winter and half-forgets.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "tilia-cordata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lime in flower in July is audible from across the garden — the whole crown hums, and it goes on for two weeks.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), DoPI (Balfour et al. 2022); INPN." },
      { wildlifeId: "hummingbird-hawk-moth", support: "nectar", note: "Lime gives up most of its nectar towards evening, which is when the hovering hawk-moths arrive at it.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024)." },
      { wildlifeId: "eurasian-jay", support: "shelter", note: "Nothing eats a lime's seed much, but the dense summer crown is a standard jay nest site.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "acer-campestre": [
      { wildlifeId: "holly-blue", support: "nectar", note: "Field maple's small green flowers open before almost anything else in the hedge, and the first holly blues of April work them.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024)." },
      { wildlifeId: "hawfinch", support: "seeds", note: "Winged maple keys are winter seed, and a hawfinch splits them where a smaller finch gives up.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "sorbus-torminalis": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "The brown 'chequers' are hard and sour until the first frosts soften them — which is exactly when the song thrushes and blackbirds want them.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), trophiCH (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "hawfinch", support: "seeds", note: "Hawfinches take the pips out of the fallen fruit, stone and all.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "cornus-mas": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Cornelian cherries drop scarlet and sharp in August, and blackbirds and thrushes take them off the ground under the bush.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), trophiCH (Reji Chacko et al. 2024); LPO." },
    ],
    "viburnum-lantana": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "The berries ripen unevenly — red and black in the same bunch — so a blackbird can work over one bush for weeks instead of stripping it in a day.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), trophiCH (Reji Chacko et al. 2024); LPO." },
    ],
    "euonymus-europaeus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Spindle's shocking-pink cases split in October to show orange seeds inside. They are poisonous to us and go quickly to robins and blackbirds, which carry the seed away and drop it elsewhere.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), trophiCH (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "Dormice take spindle fruit too, working along the thin branches at night.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
    ],
    "salvia-pratensis": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "A meadow clary flower is a lever. A bumble bee pushing in for nectar tips a hidden arm that taps pollen onto its back — the mechanism is sized for an insect that heavy, and most others can't work it.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "hummingbird-hawk-moth", support: "nectar", note: "A hovering hawk-moth drinks from the front of the flower without ever tripping the lever — all of the nectar, none of the work.", basis: "GloBI — iNaturalist observation records; trophiCH (Reji Chacko et al. 2024)." },
    ],
    "knautia-arvensis": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The large scabious mining bee gathers pollen from field scabious and hardly anything else — you can tell one in flight by the lilac-gray load on its legs.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A pincushion of florets means a bee can feed a long time without flying, which is why scabious is worked so hard in August.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "glanville-fritillary", support: "nectar", note: "One of the fritillaries' favorite refueling flowers in a dry meadow.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024)." },
      { wildlifeId: "large-scabious-mining-bee", support: "nectar", reliance: "narrow", note: "Field scabious is this bee's main pollen plant. Mow the meadow before it flowers and the bee has nothing to raise its young on.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "clematis-vitalba": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Traveler's joy flowers late and holds its nectar in the open, so the small solitary bees still flying in September can all reach it.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), Redhead et al. 2018 plant–pollinator interactions (CEH); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Whole hedges of it come into flower at once, which is worth a great deal in the thin weeks before the ivy opens.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "crataegus-laevigata": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Red haws hold on into the hard weather for fieldfares, redwings and blackbirds.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Heavy May blossom feeds bumble bees, solitary bees, hoverflies and beetles all at once.", basis: "INPN; French pollinator surveys." },
    ],
    "ligustrum-vulgare": [
      { wildlifeId: "privet-hawk-moth", support: "host", reliance: "narrow", note: "Wild privet is the classic caterpillar plant of one of France's biggest hawk-moths — the enormous green, lilac-striped larva grows up on these leaves.", basis: "INPN." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The black berries carry thrushes and blackcaps through winter.", basis: "LPO; INPN." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", reliance: "narrow", note: "Bird's-foot trefoil is the common blue's main caterpillar plant — and ants often guard the caterpillars for the sweet drops they give off.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "host", reliance: "narrow", note: "The burnet moth's caterpillars take cyanide compounds from trefoil leaves and keep them — which is why the adult can afford to fly slowly in scarlet and black.", basis: "INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long season of small yellow flowers, May to September, worked constantly by bumble bees.", basis: "INPN; French pollinator surveys." },
    ],
    "humulus-lupulus": [
      { wildlifeId: "comma", support: "host", note: "Hop is one of the comma's caterpillar plants, along with nettle and elm.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "origanum-vulgare": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "In late summer a patch of wild marjoram carries more butterflies and bees at once than anything else in a chalk meadow.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "large-blue", support: "host", reliance: "narrow", note: "In eastern France the large blue often lays on marjoram rather than thyme, so a warm slope of it can hold the butterfly.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "centaurea-scabiosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A deep nectar well that only long-tongued insects can reach — bumble bees, big fritillaries and burnet moths.", basis: "INPN; French pollinator surveys." },
    ],
    "prunus-mahaleb": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Small bitter black cherries in late summer, taken by blackcaps and warblers fattening up for the journey south.", basis: "LPO; INPN." },
    ],
    "rosa-canina": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Hips are December food for fieldfares, redwings and blackbirds when the hedge has nothing else left.", basis: "LPO; INPN." },
    ],
    "pinus-sylvestris": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Pine seed is the winter staple of crossbills and siskins — the crossbill's beak is a tool built for exactly this cone.", basis: "LPO; INPN." },
    ],
    "brachypodium-pinnatum": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The browns, skippers and marbled whites that make a June chalk meadow move are eating this grass, and they winter down inside its tussocks.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "marbled-white", support: "host", note: "Tor-grass is a marbled white caterpillar plant on chalk downland.", basis: "Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "quercus-robur": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Purple hairstreak caterpillars eat oak leaves and nothing else, and the whole butterfly lives in the crown. An old oak in a hedge can hold a colony nobody notices.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay buries thousands of acorns each autumn and forgets enough of them to plant the next oaks.", basis: "LPO; INPN." },
    ],
    "prunus-avium": [
      { wildlifeId: "hawfinch", support: "seeds", note: "Under a wild cherry in summer you find cherry stones split clean in half. That is the hawfinch, which wants the kernel, not the fruit.", basis: "LPO; INPN." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Wild cherry blossoms in April, when mason and mining bees are out and fruit flowers are their main food.", basis: "INPN; European pollinator literature." },
    ],
    "malus-sylvestris": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Crab apples fall and soften in the grass, and fieldfares and blackbirds come back to them all winter.", basis: "LPO; INPN." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Crab apple blossom in late April feeds mason bees, which pollinate it far better than any honey bee.", basis: "INPN; European pollinator literature." },
    ],
    "acer-platanoides": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Norway maple's yellow-green flowers open in March before the leaves, an early meal for mining bees just out of the ground.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "hawfinch", support: "seeds", note: "The winged maple seeds stay on the tree into winter, and the hawfinch cracks them where smaller finches give up.", basis: "LPO; INPN." },
    ],
    "prunus-spinosa": [
      { wildlifeId: "brown-hairstreak", support: "host", reliance: "narrow", note: "The brown hairstreak lays on young blackthorn growth and the egg sits there all winter. Cut the hedge hard every year and you cut off the eggs.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "black-veined-white", support: "host", note: "Black-veined white caterpillars feed on blackthorn and winter in a shared silk tent on its twigs.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Sloes hang on long after other fruit is gone, which is exactly when the winter thrushes need them.", basis: "LPO; INPN." },
    ],
    "crataegus-monogyna": [
      { wildlifeId: "black-veined-white", support: "host", note: "Hawthorn is the black-veined white's main caterpillar plant, and the species is named after it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Haws are the staple of a hedge in winter: fieldfares and redwings strip one hedge, then move to the next.", basis: "LPO; INPN." },
    ],
    "cornus-sanguinea": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Dogwood's black berries ripen in September, just as blackcaps and garden warblers fatten up for the trip south.", basis: "LPO; INPN." },
    ],
    "sambucus-nigra": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Elderberries are a favorite of blackcaps in late summer; a bush can be full of them for a week.", basis: "LPO; INPN." },
    ],
    "viburnum-opulus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Guelder rose berries are left until late winter, then eaten by thrushes when better fruit has run out.", basis: "LPO; INPN." },
    ],
    "rhamnus-cathartica": [
      { wildlifeId: "brimstone", support: "host", reliance: "narrow", note: "Buckthorn is one of the brimstone's only two caterpillar plants. Plant one in a sunny hedge and the yellow butterfly will find it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The black berries are eaten by blackbirds and thrushes in autumn.", basis: "LPO; INPN." },
    ],
    "lonicera-xylosteum": [
      { wildlifeId: "white-admiral", support: "host", reliance: "narrow", note: "Fly honeysuckle is the white admiral's other caterpillar plant in eastern France, so a shady woodland edge with this shrub can raise one.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "lonicera-periclymenum": [
      { wildlifeId: "white-admiral", support: "host", reliance: "narrow", note: "White admiral caterpillars eat honeysuckle trailing in shade, not in full sun. Leave it climbing through a woodland hedge.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "hazel-dormouse", support: "shelter", note: "The dormouse strips honeysuckle's papery bark to weave its summer nest.", basis: "INPN (MNHN); People's Trust for Endangered Species." },
    ],
    "juniperus-communis": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Juniper's blue berries take two years to ripen and stay on the bush, food for mistle thrushes and fieldfares in a hard winter.", basis: "LPO; INPN." },
    ],
    "leucanthemum-vulgare": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Small resin bees that collect pollen only from daisy-family flowers use ox-eye daisy all summer.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "achillea-millefolium": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "One small solitary bee, Colletes daviesanus, feeds its young almost only on yarrow and tansy pollen.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "aster-amellus": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Flowering in late summer, the Italian aster feeds the daisy-family specialist bees after most meadows are cut.", basis: "BWARS; Westrich, Die Wildbienen Deutschlands (2018)." },
    ],
    "centaurea-jacea": [
      { wildlifeId: "marbled-white", support: "nectar", note: "Marbled whites feed on purple flowers, and brown knapweed is one of their favorites in July.", basis: "Butterfly Conservation; INPN (MNHN)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Leave the seed heads standing and goldfinches will pick them apart into winter.", basis: "LPO; INPN." },
    ],
    "primula-veris": [
      { wildlifeId: "duke-of-burgundy", support: "host", reliance: "narrow", note: "The Duke of Burgundy lays only on cowslips and primroses, choosing big leaves in light shade.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
    "lythrum-salicaria": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Purple loosestrife flowers for weeks along wet ditches in high summer, and long-tongued bumble bees work every spike.", basis: "INPN; European pollinator literature." },
    ],
    "filipendula-ulmaria": [
      { wildlifeId: "emperor-moth", support: "host", note: "Meadowsweet is one of the emperor moth's caterpillar plants away from the heath, so a damp meadow can raise one.", basis: "INPN (MNHN); Butterfly Conservation." },
    ],
    "eupatorium-cannabinum": [
      { wildlifeId: "peacock-butterfly", support: "nectar", note: "Hemp-agrimony is a late-summer magnet for peacocks fattening up before they hibernate.", basis: "Butterfly Conservation; INPN (MNHN)." },
    ],
    "hypericum-perforatum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "St John's wort has no nectar, but bumble bees buzz its pollen loose all summer.", basis: "INPN; European pollinator literature." },
    ],
    "campanula-rotundifolia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees climb right inside the hanging bells for nectar on dry, thin grassland.", basis: "INPN; European pollinator literature." },
    ],
    "geranium-sanguineum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bloody crane's-bill flowers from June into August on warm limestone, and bumble bees visit it steadily.", basis: "INPN; European pollinator literature." },
    ],
    "scabiosa-columbaria": [
      { wildlifeId: "large-scabious-mining-bee", support: "nectar", reliance: "narrow", note: "This bee collects pollen only from scabious flowers, and small scabious on chalk grassland is one it uses.", basis: "BWARS (Bees, Wasps & Ants Recording Society); Westrich, Die Wildbienen Deutschlands (2018)." },
      { wildlifeId: "chalkhill-blue", support: "nectar", note: "On a chalk slope in August, chalkhill blues settle on small scabious to feed.", basis: "Butterfly Conservation; INPN (MNHN)." },
    ],
    "silene-dioica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Red campion flowers from April onward on shady banks, and bumble bees are its main visitors.", basis: "INPN; European pollinator literature." },
    ],
    "malva-moschata": [
      { wildlifeId: "painted-lady", support: "host", note: "Mallows are among the painted lady's caterpillar plants, along with thistles and nettles.", basis: "Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Musk mallow's open pink flowers feed bumble bees through the summer.", basis: "INPN; European pollinator literature." },
    ],
    "succisa-pratensis": [
      { wildlifeId: "marsh-fritillary", support: "host", reliance: "narrow", note: "The marsh fritillary lays its eggs in a batch under a devil's-bit scabious leaf, and the caterpillars winter together in a silk tent on the plant.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers into October, after nearly everything else, when bumble bee colonies are raising next year's queens.", basis: "INPN; European pollinator literature." },
    ],
    "pulsatilla-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pasque flower opens in March on bare chalk, one of the first meals for a bumble bee queen just out of hibernation.", basis: "INPN; European pollinator literature." },
    ],
    "bromus-erectus": [
      { wildlifeId: "marbled-white", support: "host", note: "Upright brome is one of the grasses marbled white caterpillars eat, so a lightly grazed limestone slope raises them.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "grass-skippers", support: "host", note: "Meadow browns lay on upright brome, and the caterpillars feed on it at night through the winter.", basis: "European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
    ],
    "thymus-pulegioides": [
      { wildlifeId: "large-blue", support: "host", reliance: "narrow", note: "The large blue lays on thyme flowers, and the young caterpillar eats them before the ants carry it off.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A mat of wild thyme in flower hums with bumble bees on a warm July afternoon.", basis: "INPN; European pollinator literature." },
    ],
    "ajuga-reptans": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bugle's blue spikes in spring woodland rides feed bumble bee queens setting up their nests.", basis: "INPN; European pollinator literature." },
    ],
    "hippocrepis-comosa": [
      { wildlifeId: "chalkhill-blue", support: "host", reliance: "sole", note: "Chalkhill blue caterpillars eat horseshoe vetch and nothing else. Where the vetch grows on short chalk turf, the butterfly can follow.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
    ],
  },

  "france-mediterranean": {
    "salix-alba": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "The poplar hawk-moth's fat green caterpillar grows up on willow and poplar; the adult sits by day looking exactly like a bundle of dead leaves, hind wings pushed out in front of the fore wings.", basis: "INPN (MNHN); European butterfly and moth foodplant checklists." },
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "The purple emperor lays on willow and nothing else, high in the canopy — the male spends its life in the tree tops and only comes down for the puddles and the carrion nobody wants to talk about.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "mourning-cloak", support: "host", note: "The Camberwell beauty's spiny black caterpillars feed in a group on willow, and the adults hibernate through the winter rather than migrating, so they are among the first butterflies flying in a southern spring.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "March catkins are the first real pollen of the year on a Mediterranean river, and the solitary bees emerge to meet them.", basis: "INPN; European pollinator literature." },
    ],
    "populus-nigra": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Poplar is the moth's other tree, and a black poplar along a river is where you find the caterpillars — big, green, and armed with a single blunt horn at the tail.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Camberwell beauty caterpillars take poplar as readily as willow, feeding together in a conspicuous black huddle before scattering to pupate.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "blackcaps-warblers", support: "shelter", note: "A riverside poplar is where the warblers nest and feed on the way through — the caterpillar load in the canopy is the reason they stop.", basis: "INPN; Ligue pour la Protection des Oiseaux (LPO)." },
    ],
    "alnus-glutinosa": [
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "A fruiting alder in winter carries goldfinches and siskins hanging upside-down off the little cones, working the seed out one at a time.", basis: "INPN; Ligue pour la Protection des Oiseaux (LPO)." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Siskins and redpolls swarm alder catkins from November onward, and a stand beside water will hold a flock all winter.", basis: "INPN; LPO." },
    ],
    "prunus-spinosa": [
      { wildlifeId: "brimstone", support: "nectar", note: "The brimstone comes out of hibernation in February looking for the first flower there is, and in a southern hedge that is blackthorn — the yellow butterfly on the white blossom is the start of the year.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars — green, ringed with black and studded with orange warts — feed on blackthorn among a short list of shrubs, and the adult male flies by day looking for females by scent alone.", basis: "INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "February blossom on bare wood is what a bumble bee queen coming out of the ground needs, and there is very little else open that early.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Sloes hang on the bush long after everything softer has gone, which is why the winter thrushes work a blackthorn hedge in January.", basis: "INPN; LPO." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackcaps take the sloes too, and the thorny tangle underneath is some of the safest nesting cover in a southern hedge.", basis: "INPN; LPO." },
    ],
    "rubus-ulmifolius": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Months of open flower from May, and a bramble in the sun is the loudest plant in a southern garden — bumble bees, solitary bees, hoverflies and beetles all at once.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "green-hairstreak", support: "host", note: "The green hairstreak — Europe's commonest green butterfly, and one you find by watching a sunny scrubby bank rather than a flower bed — lays on bramble among several other shrubs of rough ground.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Painted ladies arriving up the coast in spring feed heavily at bramble, sometimes a dozen on one bush.", basis: "INPN; European butterfly literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackberries from August are what a warbler puts weight on for the journey south, and the thorny mass is where it nested in June.", basis: "INPN; LPO." },
    ],
    "poa-nemoralis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The meadow browns, marbled whites and skippers all raise their caterpillars on grasses, and this is the one that grows in the shade where those butterflies come to rest out of the afternoon heat.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "plantago-lanceolata": [
      { wildlifeId: "glanville-fritillary", support: "host", reliance: "narrow", note: "The Glanville fritillary lays a batch of eggs on ribwort plantain and the caterpillars spend the whole winter together inside a silk web spun on the plant — so a mown verge in autumn takes the entire brood with it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches and linnets strip the seed spikes from late summer on, working along a path edge one head at a time.", basis: "INPN; LPO." },
    ],
    "galium-verum": [
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The moth everybody mistakes for a tiny hummingbird lays on bedstraw — so a patch in the rough grass is the difference between watching one at the lavender and having them breed with you.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "The elephant hawk-moth's caterpillar — enormous, gray, with false eyes it inflates when alarmed — turns up on bedstraw in late summer and is the most startling thing in a French garden.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Hundreds of tiny flowers with no depth to them, which is exactly what the smallest solitary bees and hoverflies can use.", basis: "INPN; European pollinator literature." },
    ],
    "centaurea-scabiosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Knapweed flowers through the worst of the summer, when the garrigue has shut down and a bumble bee colony still has mouths to feed.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Big butterflies work knapweed heads for minutes at a time — painted ladies, fritillaries and the marbled whites of a dry meadow.", basis: "INPN; European butterfly literature." },
      { wildlifeId: "six-spot-burnet", support: "nectar", note: "The red-spotted day-flying burnet moths gather on knapweed in numbers, several to a head, in the full heat of the afternoon.", basis: "INPN (MNHN)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Leave the seed heads standing and the goldfinches take them apart through the autumn.", basis: "INPN; LPO." },
    ],
    "carex-flacca": [
      { wildlifeId: "grass-skippers", support: "host", note: "Sedges are the caterpillar plants of a long list of the small brown butterflies and moths, and a damp sedge patch is where they get through a Mediterranean summer.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "salvia-rosmarinus": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Rosemary flowers from November to April — right through the Mediterranean winter — so on a mild January afternoon it is very nearly the only thing a bumble bee queen can find open.", basis: "INPN; French beekeeping literature." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The earliest solitary bees emerge to rosemary, weeks before the almond blossom that usually gets the credit.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "cleopatra", support: "nectar", note: "The cleopatra — the brimstone's southern cousin, with an orange flush across the forewing — feeds at rosemary on warm days all winter.", basis: "INPN (MNHN)." },
    ],
    "scabiosa-columbaria": [
      { wildlifeId: "six-spot-burnet", support: "nectar", note: "Scabious heads are where the burnet moths sit out the afternoon, several to a flower, wings closed and in no hurry.", basis: "INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Five months of flat open flower heads on poor dry ground, which is where a bumble bee colony gets through the late summer here.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Butterflies of every size work scabious at exactly the height they like it — marbled whites, blues and skippers alongside the painted ladies.", basis: "INPN; European butterfly literature." },
    ],
    "lonicera-implexa": [
      { wildlifeId: "privet-hawk-moth", support: "nectar", note: "The long cream tubes open at dusk and smell strongest then, because they are built for a hawk moth's tongue — the big privet and convolvulus hawk-moths work a honeysuckle in the last light of a June evening.", basis: "INPN (MNHN); European pollinator literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Red berries in autumn for warblers and blackcaps, on an evergreen tangle they will also nest in.", basis: "INPN; LPO." },
    ],
    "hedera-helix": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The ivy bee is a mining bee whose whole year is built around this one plant: it emerges in September as the ivy opens, and is gone by the time the flowers are over. Nothing else it could use is flowering then.", basis: "INPN; European pollinator literature (Colletes hederae)." },
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The holly blue has two broods a year and swaps plants between them — the spring one lays on holly, the summer one on ivy buds. A garden needs both to keep it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "red-admiral", support: "nectar", note: "Red admirals crowd onto ivy in October — often the last butterflies of the year, feeding on the last flowers of the year.", basis: "INPN (MNHN); European butterfly literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Ivy berries ripen in late winter, months after everything else, which makes them the food that carries blackcaps through February.", basis: "INPN; LPO." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Thrushes and wood pigeons take the same late crop, and the evergreen cover is where half the garden's birds roost on a cold night.", basis: "INPN; LPO." },
    ],
    "arum-italicum": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "The spike of red berries stands on bare ground in late summer after the leaves have gone, and blackbirds and thrushes strip it — which is how arum moves along a hedge.", basis: "INPN; LPO." },
    ],
    "quercus-ilex": [
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Holm-oak acorns are a jay's winter store. It buries them singly, all over the hillside, and the ones it never returns for come up as seedlings under the scrub that hid them.", basis: "GloBI — interaction records via the Encyclopedia of Life (Thessen 2014) and Groom et al. 2020; LPO." },
      { wildlifeId: "blackcaps-warblers", support: "shelter", note: "An evergreen oak keeps its cover all winter, which is why so many small birds roost in one when the mistral is up.", basis: "GloBI — Groom et al. 2020, interactions extracted from literature; LPO." },
    ],
    "quercus-pubescens": [
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Downy-oak acorns are bigger and sweeter than the holm oak's, and the jays take them first.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "pinus-halepensis": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", reliance: "narrow", note: "Aleppo pine cones can hang shut on the tree for years. A crossbill's crossed beak is the tool that opens them, and siskins take what falls.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024), iNaturalist observation records; LPO." },
    ],
    "acer-monspessulanum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Montpellier maple flowers in March with the leaves still coming, and the mining bees are on it straight away.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the first real nectar trees of the garrigue year.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
    ],
    "fraxinus-ornus": [
      { wildlifeId: "privet-hawk-moth", support: "host", note: "The privet hawk-moth's huge green caterpillar grows up on ash as readily as on privet — manna ash is one of the trees it takes in the south.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
    ],
    "phillyrea-angustifolia": [
      { wildlifeId: "blackcaps-warblers", support: "berries", reliance: "narrow", note: "Blackcaps eat the small blue-black fruit and drop the seed elsewhere, which is largely how phillyrea gets about — the bird is the plant's transport.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Groom et al. 2020; LPO." },
    ],
    "myrtus-communis": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Myrtle berries hang on into December, blue-black and resinous, and are among the last things a wintering blackcap can count on.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Groom et al. 2020; LPO." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The white summer flowers are a mass of stamens with the pollen out in the open, so a bee can load up without working for it.", basis: "GloBI — Barberis et al. 2025, Mediterranean insect–flower citizen-science dataset (LIFE 4 Pollinators); INPN." },
    ],
    "helichrysum-stoechas": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "Everlasting flowers through the worst of the summer drought, when almost nothing else in the garrigue has anything left, and a long list of small solitary bees works it for exactly that reason.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), Web of Life network database; INPN." },
    ],
    "clematis-flammula": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A curtain of small scented white flowers in August — heavily worked, and easy to smell before you see it.", basis: "GloBI — Groom et al. 2020, interactions extracted from literature; INPN." },
      { wildlifeId: "grass-skippers", support: "nectar", note: "The meadow browns and graylings that own a dry August hillside refuel on it.", basis: "GloBI — Groom et al. 2020, interactions extracted from literature; INPN." },
    ],
    "dorycnium-pentaphyllum": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "Badassi is a pea flower, so it has to be pushed open — and the bees strong enough to do it are mostly the leafcutters, mason bees and mining bees, which come to it in numbers.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work it too, and a bank of it in June is never quiet.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "rhamnus-alaternus": [
      { wildlifeId: "cleopatra", support: "host", reliance: "sole", note: "Buckthorn is the Cleopatra's only caterpillar plant — the butterflies overwinter as adults and lay on it as it comes into leaf, which is why they are flying in February.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Black berries for blackcaps, Sardinian warblers and thrushes.", basis: "LPO; INPN." },
    ],
    "arbutus-unedo": [
      { wildlifeId: "two-tailed-pasha", support: "host", reliance: "sole", note: "The strawberry tree is the only caterpillar plant of Europe's biggest butterfly — no arbutus in the maquis means no pasha.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in November, when nothing else does, so it feeds the last bumble bees and butterflies of the year.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Its red fruit ripens through the winter for blackcaps, robins and thrushes.", basis: "LPO; INPN." },
    ],
    "celtis-australis": [
      { wildlifeId: "nettle-tree-butterfly", support: "host", reliance: "sole", note: "The nettle tree is the sole food of the nettle-tree butterfly, which is why one of Europe's longest-lived butterflies is confined to where this tree grows.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Small sweet dark berries for blackcaps, blackbirds and thrushes in autumn.", basis: "LPO; INPN." },
    ],
    "pistacia-lentiscus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", reliance: "narrow", note: "Mastic's oily fruit ripens exactly as the warblers move through, and several migrant species time their passage to fruit like this — it is among the most important wild bird foods in the Mediterranean.", basis: "LPO; INPN; Mediterranean frugivory literature." },
    ],
    "thymus-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Thyme in flower on a garrigue hillside is one of the great bee sights of France — honey-scented and audible from yards away.", basis: "INPN; French pollinator surveys." },
    ],
    "lavandula-angustifolia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Weeks of high-summer nectar for bumble bees, solitary bees and butterflies.", basis: "INPN; French pollinator surveys." },
    ],
    "euphorbia-characias": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Spurge nectar sits out in the open rather than down a tube, so it feeds a very wide crowd of early bees, wasps and hoverflies in February.", basis: "INPN; French pollinator surveys." },
    ],
    "cistus-albidus": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "Cistus flowers open at dawn and drop by afternoon, and a group of solitary bees works little else for pollen.", basis: "INPN; French pollinator surveys." },
    ],
    "viburnum-tinus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Metallic blue-black berries for blackcaps and thrushes, on a shrub that flowers right through the winter.", basis: "LPO; INPN." },
    ],
    "juniperus-oxycedrus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Juniper berry-cones are winter food for mistle thrushes and blackcaps, and the prickly interior is one of the safest nest sites in open garrigue.", basis: "LPO; INPN." },
    ],
    "brachypodium-retusum": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The browns, graylings and skippers that flicker over a June hillside spend their caterpillar lives — and their winters — down inside these tufts.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "crataegus-monogyna": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "A hedge of haws is what carries the thrushes and blackcaps through a southern winter — they arrive off the mountains in flocks and strip one hedge at a time.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The April froth of hawthorn is the biggest single nectar event of the garrigue year, and it is over in two weeks.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Hawthorn is one of the green hairstreak's many caterpillar plants, and the butterfly — the commonest green one here — is easiest to find on a sunny hedge edge in April.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "pyrus-spinosa": [
      { wildlifeId: "mason-bees", support: "nectar", note: "An open, shallow pear flower in March is one a small solitary bee can actually use, weeks before the cistus opens.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The small hard pears hang until frost softens them, which is exactly when the thrushes want them.", basis: "LPO; INPN." },
    ],
    "sorbus-domestica": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Brown pear-shaped fruit in autumn, taken by blackbirds and mistle thrushes once it has gone soft on the tree.", basis: "LPO; INPN." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Flat heads of cream flowers — a landing platform rather than a tube, which is what the short-tongued solitary bees and hoverflies need.", basis: "INPN; French pollinator surveys." },
    ],
    "artemisia-alba": [
      { wildlifeId: "painted-lady", support: "nectar", note: "In a painted lady year, when millions come up from North Africa in one summer, the August-flowering wormwoods are among the few things still open on a burnt hillside.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "genista-scorpius": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Brooms are the green hairstreak's main caterpillar plants in the garrigue. The adult shuts its wings the instant it lands and disappears against the foliage.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower is a trap set for a heavy bee: her weight trips the keel and the stamens spring up and strike pollen onto her back. Too light an insect gets nothing and gives nothing.", basis: "INPN; French pollinator surveys." },
    ],
    "cytisus-villosus": [
      { wildlifeId: "green-hairstreak", support: "host", note: "The acid-ground broom of the Maures and the Esterel, and the same caterpillar plant story as the limestone brooms across the valley.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Thornless, unlike most of the maquis, so a bumble bee can work it without fighting the shrub.", basis: "INPN; French pollinator surveys." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "emperor-moth", support: "host", reliance: "narrow", note: "Heather is the emperor moth's plant on the acid maquis. The male flies by day in spring, fast and low over the heather, following the female's scent from a mile away — the only big day-flying moth most people here will see.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers from July into October, when the garrigue has shut down for the drought and there is almost nothing else open. A hillside of it in September is the last big meal of the year.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Heather joins the brooms on the green hairstreak's list — plant any two of them and you have made a heath the butterfly can use.", basis: "European butterfly foodplant checklist (Dryad)." },
    ],
    "corylus-avellana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Hazel is wind-pollinated and needs no insect at all, but the catkins shed pollen in January and the earliest solitary bees collect it anyway — the first pollen of the Mediterranean year.", basis: "INPN; French pollinator surveys; Buglife." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays take hazelnuts as readily as acorns and bury them along the wood edge, which is how a hazel thicket climbs a shaded slope.", basis: "LPO; INPN." },
      { wildlifeId: "hazel-dormouse", support: "seeds", note: "In the hill woods, hazelnuts are what the dormouse fattens on before it sleeps. A nut it has opened shows a smooth round hole.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN (MNHN)." },
    ],
    "rumex-acetosella": [
      { wildlifeId: "small-copper", support: "host", reliance: "narrow", note: "The small copper lays on sorrels and docks, and sheep's sorrel is the one for the dry acid ground of the Maures. It is the little flashing orange butterfly of a southern verge, and fiercely territorial for something the size of a thumbnail.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The rusty seed heads feed linnets and serins through the summer if they are left standing.", basis: "LPO; INPN." },
    ],
    "trifolium-pratense": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A tube deep enough that only a long-tongued bumble bee reaches the bottom, open from April to September — five months of nectar in a region whose flowers mostly finish in June.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", reliance: "narrow", note: "Bird's-foot trefoil is the common blue's caterpillar plant, and the butterfly is common only where the plant is — which means short, hungry, unfertilized turf rather than a watered lawn.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "host", reliance: "sole", note: "The burnet moths eat bird's-foot trefoil and little else. They take cyanide compounds out of the plant and keep them — which is what the scarlet spots are advertising, and why they fly slowly in broad daylight without being eaten.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "rosa-sempervirens": [
      { wildlifeId: "mason-bees", support: "nectar", note: "A single open rose is full of pollen a solitary bee can reach, which a double garden rose is not. They roll in it.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Small red hips that hold into winter, on an evergreen scramble that gives cover at the same time — which is why warblers work a hedge with this rose in it.", basis: "LPO; INPN." },
    ],
    "festuca-ovina": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The browns and skippers that drift over a southern hillside in June eat nothing but grasses like this, and they overwinter as small caterpillars down inside the tussock. That is why a mown slope has none of them.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
  },

  "france-alpine": {
    "hedera-helix": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The ivy bee's whole year is timed to this plant: it emerges in September as the flowers open on a warm valley wall and is done when they are. Nothing else it can use is out that late.", basis: "INPN; European pollinator literature (Colletes hederae)." },
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The holly blue swaps plants between its two broods — holly in spring, ivy buds in late summer — so a garden needs both to keep it.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "red-admiral", support: "nectar", note: "Red admirals coming down off the passes in autumn feed on ivy flowers, and are usually the last butterflies of the year.", basis: "INPN (MNHN); European butterfly literature." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Ivy berries ripen in late winter, after everything else has been stripped, which is what carries thrushes through the hardest weeks.", basis: "INPN; LPO." },
    ],
    "prunus-padus": [
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars take bird cherry among the short list of shrubs and trees they accept, in the valleys below the conifer belt.", basis: "INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long drooping racemes of scented white flower in May, at the moment the alpine year properly opens and the bumble bee queens are founding nests.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Black cherries in August, taken by fieldfares, blackbirds and ring ouzels — and by pine martens, which climb for them.", basis: "INPN; LPO." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Warblers feeding up for the journey south work a bird cherry hard in late summer.", basis: "INPN; LPO." },
      { wildlifeId: "hawfinch", support: "seeds", note: "The hawfinch cracks bird-cherry stones for the kernel and leaves the split halves under the tree.", basis: "GloBI — Fricke & Svenning 2020 frugivory network; LPO." },
    ],
    "populus-tremula": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Aspen is one of the poplar hawk-moth's main trees; the caterpillar is big, green and blunt-horned, and pupates in the soil beneath.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Camberwell beauty caterpillars feed together on aspen and willow, and the adults hibernate as adults, so they are among the first butterflies on the wing in an alpine spring.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "black-grouse", support: "shelter", note: "A suckering aspen thicket on an old avalanche track is exactly the low broken cover a black grouse brood needs, and the buds are winter food.", basis: "INPN; LPO; alpine game-bird ecology." },
    ],
    "corylus-avellana": [
      { wildlifeId: "hazel-dormouse", support: "seeds", reliance: "narrow", note: "The dormouse is named after this plant in English, German and Latin, and hazelnuts are what it fattens on before it hibernates. A nut opened by a dormouse has a smooth round hole with tooth marks angled round the rim, which is how surveyors find out it is there at all.", basis: "INPN (MNHN); European dormouse survey methods (nut-hunt protocol)." },
      { wildlifeId: "spotted-nutcracker", support: "seeds", note: "The nutcracker caches tens of thousands of nuts and seeds each autumn and remembers most of them under a meter of snow; the ones it forgets are how hazel and pine both get uphill.", basis: "INPN; LPO; alpine seed-caching studies." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Catkins in February, weeks before anything else in the valley opens, for the first solitary bees out on a warm afternoon.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "red-squirrel", support: "seeds", note: "A red squirrel splits a hazelnut cleanly in two; the dormouse gnaws a neat round hole instead.", basis: "INPN (MNHN); European mammal literature." },
    ],
    "rubus-idaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A raspberry patch in June has bumble bees on it from first light — one of the best nectar plants of the whole mountain summer.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Europe's commonest green butterfly lays on raspberry among the other shrubs of rough clearings, and rests on a sunny bank with its wings shut, indistinguishable from a leaf.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Warblers and thrushes work a raspberry thicket in August, and the canes are dense enough that they nest there too.", basis: "INPN; LPO." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "Dormice travel along bramble and raspberry canes and feed on the fruit — a hedge with them in it is a corridor, a clipped one is a wall.", basis: "INPN (MNHN); European dormouse ecology." },
    ],
    "rosa-pendulina": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A single open rose is one a bee can actually get into — a packed double garden rose gives it nothing at all.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Leafcutter bees cut neat semicircles from rose leaves to line their nest cells; the notches are a sign the garden is working.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Long red hips hang on the bush into the winter, which is what fieldfares and redwings come down to when the snow has covered the ground.", basis: "INPN; LPO." },
    ],
    "daphne-mezereum": [
      { wildlifeId: "brimstone", support: "nectar", note: "The brimstone hibernates as an adult and comes out on the first warm February afternoon looking for anything at all in flower — in an alpine wood that is mezereon, and almost nothing else.", basis: "INPN (MNHN); European butterfly literature." },
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "February flower in a mountain wood is very nearly a monopoly: a bumble bee queen out of hibernation early has this or she has nothing.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The red berries that would poison us are taken safely by blackcaps and thrushes in July, which is how the plant moves through a wood.", basis: "INPN; LPO." },
    ],
    "erica-carnea": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Winter heath flowers from January into April, often up through the snow, and on the first mild day of the mountain year it is what the bumble bee queens are on because nothing else is open.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "silver-studded-blue", support: "host", note: "The heath blues lay on Erica and Calluna, and their caterpillars are tended by ants that milk them for sugar in exchange for protection.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "The earliest solitary bees work winter heath in March, well before the meadows have anything to offer.", basis: "INPN; European pollinator literature." },
    ],
    "trifolium-pratense": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "A red clover head is deep, so only the long-tongued bumble bees can reach the nectar — the garden bumble bee and the great yellow among them. Short-tongued bees are locked out, which is why clover-rich meadows and long-tongued bumble bees have declined together.", basis: "INPN; Xerces Society; European pollinator literature." },
      { wildlifeId: "common-blue", support: "host", note: "The common blue's caterpillars eat clovers and trefoils, and a hay meadow that has not been fertilized is where the butterfly still is.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "nectar", note: "The red-spotted day-flying burnets gather on clover heads in the afternoon, several to a flower.", basis: "INPN (MNHN)." },
    ],
    "colchicum-autumnale": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers in September and October when the mountain meadow is finished, and the last bumble bees and hoverflies of the year come to it because there is nothing else left open.", basis: "INPN; European pollinator literature." },
    ],
    "cardamine-pratensis": [
      { wildlifeId: "orange-tip", support: "host", reliance: "narrow", note: "The orange-tip lays a single egg on a flower stem and the caterpillar eats the seed pods as they form. Cut the damp corner in June and the whole brood goes with it; leave it until August and you keep the butterfly.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early nectar in a wet spring meadow, at the point when bumble bee queens are still founding their nests.", basis: "INPN; European pollinator literature." },
    ],
    "sesleria-caerulea": [
      { wildlifeId: "grass-skippers", support: "host", note: "The mountain browns and skippers raise their caterpillars on grasses like this, each one hidden inside a leaf it has sewn shut.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "carex-sempervirens": [
      { wildlifeId: "grass-skippers", support: "host", note: "Sedge turf above the treeline is the caterpillar ground of the small mountain browns and skippers, which is most of what flies up there.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "black-grouse", support: "shelter", note: "A tussocky sedge sward is where a black grouse hen puts her nest and where the chicks find the insects they need in their first weeks.", basis: "INPN; LPO; alpine game-bird ecology." },
    ],
    "clematis-alpina": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Nodding bells that a bumble bee has to climb right inside, which is exactly what they are shaped for — in May, on a rock face where little else is out.", basis: "INPN; European pollinator literature." },
    ],
    "humulus-lupulus": [
      { wildlifeId: "comma", support: "host", reliance: "narrow", note: "The comma — the butterfly with the ragged wing edges, which overwinters looking exactly like a dead leaf — lays on hop and nettle, and its caterpillar disguises itself as a bird dropping.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Shallow open flowers through the mountain summer for the small solitary bees and hoverflies that deeper flowers exclude.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "hazel-dormouse", support: "berries", note: "Dormice take wild strawberries at the hedge bottom along with everything else soft and sweet in an alpine summer.", basis: "INPN (MNHN); European dormouse ecology." },
    ],
    "galium-verum": [
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The moth people mistake for a tiny hummingbird lays on bedstraw, so a patch in the rough grass is what turns a visitor into a resident.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "The elephant hawk-moth's huge gray caterpillar, with the false eyes it inflates when startled, feeds on bedstraw in late summer.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "acer-pseudoplatanus": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Sycamore flowers in May at an altitude where there is almost nothing else out, and a single old tree can carry a whole valley's bumble bee queens through the week they most need it.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024), Redhead et al. 2018 (CEH); INPN." },
    ],
    "betula-pendula": [
      { wildlifeId: "emperor-moth", support: "host", note: "Birch is one of the emperor moth's caterpillar trees — the big green larva with its pink-and-black studs feeds openly on the leaves through the summer.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins shatter into thousands of tiny seeds, and redpolls hang upside-down in the twigs all winter working through them.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "tau-emperor", support: "host", note: "Birch is one of the tau emperor's caterpillar trees after beech.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "salix-caprea": [
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "Goat willow is what a purple emperor caterpillar eats, and it is the reason a butterfly that spends its life in the tops of oaks needs a scruffy willow in the clearing below.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow leaves feed the mourning cloak's spiny black caterpillars, which live in a group on one branch until they are nearly full-grown.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The gray catkins open before the snow has finished going, and they are the first pollen a bumble bee queen finds all year.", basis: "GloBI — trophiCH (Reji Chacko et al. 2024), Redhead et al. 2018 plant–pollinator interactions (CEH); INPN." },
    ],
    "vaccinium-vitis-idaea": [
      { wildlifeId: "black-grouse", support: "berries", note: "Cowberry keeps its leaves and its red fruit through the winter under the snow, which is why a black grouse can find something to eat in February.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "emperor-moth", support: "host", note: "The emperor moth's caterpillars graze the tough little evergreen leaves alongside bilberry's.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "green-hairstreak", support: "nectar", note: "One of the flowers the green hairstreak comes down to when the cowberry is in bloom in June.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024), Web of Life network database; INPN." },
    ],
    "rhododendron-ferrugineum": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Alpenrose flowers are deep tubes, so most of what visits them cannot reach the bottom. A long-tongued bumble bee can, and a slope of alpenrose in July belongs almost entirely to them.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024), EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "gentiana-lutea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A great yellow gentian stands taller than the meadow around it and flowers in whorls up the stem, so a bumble bee can work its way up one plant for a long time.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024); INPN." },
    ],
    "trollius-europaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A globeflower never really opens — the petals close over the top into a lantern, and an insect has to push in through the gap. Its real partners are tiny flies that breed inside the flower; bumble bees push in too.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "dryas-octopetala": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Mountain avens turns its white saucer to follow the sun, and the warm dish is where the high-altitude solitary bees sit out a cold morning.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
    ],
    "vaccinium-myrtillus": [
      { wildlifeId: "black-grouse", support: "shelter", reliance: "sole", note: "Bilberry is the black grouse's whole world: insects taken off it feed the chicks, the berries and leaves feed the adults, and its low thickets are where they shelter under the snow.", basis: "INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pink bell flowers in May, at an altitude where early nectar is scarce.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The August berry crop feeds ring ouzels, thrushes and blackbirds — and foxes and martens.", basis: "LPO; INPN." },
    ],
    "pinus-cembra": [
      { wildlifeId: "spotted-nutcracker", support: "seeds", reliance: "sole", note: "The arolla pine's seeds have no wings and cannot travel on their own; the nutcracker buries tens of thousands each autumn, and the forgotten ones become the next forest. Neither species manages without the other.", basis: "INPN; Alpine forest ecology literature." },
    ],
    "picea-abies": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", reliance: "narrow", note: "The crossbill's crossed beak is a tool for one job — prying a spruce cone apart — and siskins and coal tits take what it drops.", basis: "LPO; INPN." },
      { wildlifeId: "black-grouse", support: "shelter", note: "The low, snow-laden branches of old spruce are where black grouse and capercaillie sit out the mountain winter.", basis: "INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "red-squirrel", support: "seeds", note: "Spruce seed is the red squirrel's staple in the mountain forest; stripped cones pile up under its favorite feeding stumps.", basis: "INPN (MNHN); European mammal literature." },
      { wildlifeId: "pine-hawk-moth", support: "host", note: "Spruce is the pine hawk-moth's other main tree in the Alps.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "coal-crested-tits", support: "seeds", note: "Coal tits store thousands of spruce seeds in bark and moss each autumn and live on them through the winter.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "larix-decidua": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Larch seed feeds crossbills and siskins, and its caterpillar flushes feed an explosion of birds every eight or nine years.", basis: "LPO; INPN." },
      { wildlifeId: "pine-hawk-moth", support: "host", note: "Larch is among the conifers the pine hawk-moth's caterpillars eat.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "thymus-serpyllum": [
      { wildlifeId: "large-blue", support: "host", reliance: "sole", note: "The large blue's caterpillar eats thyme flowers for a few weeks, then must be adopted by a red ant colony to survive the winter — so the butterfly needs both the thyme and the right ant, and has vanished wherever either went.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the best nectar mats at altitude, and it flowers through the short mountain summer.", basis: "INPN; French pollinator surveys." },
    ],
    "anthyllis-vulneraria": [
      { wildlifeId: "small-blue", support: "host", reliance: "sole", note: "One of Europe's smallest butterflies lives inside kidney vetch flower heads as a caterpillar, eating the developing seeds; in Britain and Ireland it uses no other plant.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", reliance: "narrow", note: "The Alps have more kinds of blue butterfly than anywhere in Europe, and trefoil is what most of them grow up on.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "host", reliance: "narrow", note: "Burnet moth caterpillars take cyanide compounds from trefoil and keep them for life.", basis: "INPN." },
    ],
    "helianthemum-nummularium": [
      { wildlifeId: "common-blue", support: "host", note: "Rock-rose is one of the plants the mountain blues and the green hairstreak raise their caterpillars on.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "sorbus-aucuparia": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Its French name means 'the fowler's sorb' — no mountain tree pulls in fieldfares, redwings and ring ouzels like a rowan in fruit.", basis: "LPO; INPN." },
    ],
    "alnus-alnobetula": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Green alder's little woody catkins hold seed that redpolls and siskins work through the winter.", basis: "LPO; INPN." },
    ],
    "juniperus-communis": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Juniper's blue-black cones — three years in the ripening — feed ring ouzels, mistle thrushes and fieldfares, and its spines make one of the few safe nest sites on an open slope.", basis: "LPO; INPN." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "When the meadows have been cut and the flowers are gone, an August heather slope is the last great nectar source of the mountain year.", basis: "INPN; French pollinator surveys." },
    ],
    "festuca-nigrescens": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The Alps' cast of brown butterflies — ringlets, graylings, marbled whites — eat nothing but grasses like this, and overwinter inside the tussocks.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
    ],
    "fagus-sylvatica": [
      { wildlifeId: "tau-emperor", support: "host", note: "Beech is the tau emperor's main tree. Its caterpillars feed high in the leaves all summer, and the males come looking for females on the trunks in April.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays carry beechnuts off and bury them in autumn, and the ones they forget become seedlings well away from the parent tree.", basis: "INPN; LPO." },
      { wildlifeId: "red-squirrel", support: "seeds", note: "In a good mast year, beechnuts are what red squirrels fatten on before winter.", basis: "INPN (MNHN); European mammal literature." },
    ],
    "abies-alba": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Fir cones break up on the branch in autumn, and siskins and crossbills take the seed before it falls.", basis: "LPO; INPN." },
      { wildlifeId: "coal-crested-tits", support: "shelter", note: "Dense fir boughs are where coal and crested tits feed through the winter, picking insects off the needles and nesting in the old trunks.", basis: "LPO; INPN." },
      { wildlifeId: "red-squirrel", support: "seeds", note: "Red squirrels cut fir cones and pull out the seed; a pile of stripped scales at the foot of a trunk is the sign.", basis: "INPN (MNHN); European mammal literature." },
    ],
    "pinus-sylvestris": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Scots pine cones hold their seed tight, and the crossbill is built to pry them open — its crossed beak twists each scale aside.", basis: "LPO; INPN." },
      { wildlifeId: "pine-hawk-moth", support: "host", note: "Scots pine is the pine hawk-moth's main tree; its striped caterpillar is hard to spot among the needles.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "red-squirrel", support: "seeds", note: "A pine cone stripped by a red squirrel is left as a bare core with a tuft of scales at the tip.", basis: "INPN (MNHN); European mammal literature." },
      { wildlifeId: "coal-crested-tits", support: "seeds", note: "The crested tit is a pine-wood bird, and both tits take pine seed and store it in bark cracks for winter.", basis: "LPO; INPN." },
    ],
    "laburnum-alpinum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each pea-flower opens only for a bee heavy enough to press it down, and bumble bees work the long yellow chains in June.", basis: "INPN; European pollinator literature." },
    ],
    "alnus-incana": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Gray alder's little woody cones hold seed all winter, and siskins and redpolls hang upside down to work it out.", basis: "LPO; INPN." },
    ],
    "taxus-baccata": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Thrushes and blackbirds eat the red flesh around the seed and pass the poisonous seed unharmed, which is how yew spreads.", basis: "LPO; INPN." },
    ],
    "sambucus-racemosa": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Red elder fruits in July, early for a mountain shrub, and blackcaps, garden warblers and robins strip it fast.", basis: "LPO; INPN." },
    ],
    "amelanchier-ovalis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "White flowers in April on warm rocky slopes, when the first solitary bees are out.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The small blue-black fruits ripen in summer and are taken by warblers and thrushes.", basis: "LPO; INPN." },
    ],
    "lonicera-alpigena": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The paired red-brown flowers in May are visited mostly by bumble bees.", basis: "INPN; European pollinator literature." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Shiny red twin berries in late summer, eaten by warblers and thrushes in the mountain woods.", basis: "LPO; INPN." },
    ],
    "ribes-alpinum": [
      { wildlifeId: "comma", support: "host", note: "Currants are one of the comma's caterpillar plants, along with nettle and hop.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Small red berries in summer for warblers and robins.", basis: "LPO; INPN." },
    ],
    "hippophae-rhamnoides": [
      { wildlifeId: "sea-buckthorn-hawk-moth", support: "host", reliance: "sole", note: "This rare hawk-moth lays only on sea buckthorn, on the gravel bars of Alpine rivers. No sea buckthorn, no moth.", basis: "INPN (MNHN); European foodplant checklists." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Orange berries stay on the branches into winter, and fieldfares and blackbirds come back to them when the snow has covered everything else.", basis: "LPO; INPN." },
    ],
    "pinus-mugo": [
      { wildlifeId: "black-grouse", support: "shelter", note: "Low mountain-pine thickets at the treeline are classic black grouse ground: cover for the brood, and shelter in winter.", basis: "INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Crossbills and siskins work the small cones for seed at altitudes where few trees grow.", basis: "LPO; INPN." },
      { wildlifeId: "pine-hawk-moth", support: "host", note: "The pine hawk-moth's caterpillars feed on mountain pine as well as on Scots pine.", basis: "INPN (MNHN); European foodplant checklists." },
    ],
    "cotoneaster-integerrimus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Red berries on bare rock in autumn, taken by ring ouzels and blackbirds.", basis: "LPO; INPN." },
    ],
    "gentiana-acaulis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The deep blue trumpet is big enough for a bumble bee to climb right inside, and bumble bees are its main pollinators.", basis: "INPN; European pollinator literature." },
    ],
    "astrantia-major": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Each head is a small crowd of tiny flowers, open to short-tongued solitary bees, hoverflies and beetles all summer.", basis: "INPN; RHS Plants for Pollinators." },
    ],
    "geranium-sylvaticum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Violet flowers across the mountain hay meadows in June, worked by bumble bees.", basis: "INPN; European pollinator literature." },
    ],
    "lilium-martagon": [
      { wildlifeId: "hummingbird-hawk-moth", support: "nectar", note: "The nectar sits at the base of curled-back petals, and the hummingbird hawk-moth hovers in front to reach it.", basis: "INPN (MNHN); European pollinator literature." },
      { wildlifeId: "elephant-hawk-moth", support: "nectar", note: "The scent gets stronger at dusk, which is when hawk-moths like this one come to it.", basis: "INPN (MNHN); European pollinator literature." },
    ],
    "aquilegia-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nectar is at the end of long hooked spurs, so only long-tongued bumble bees reach it the proper way.", basis: "INPN; European pollinator literature." },
    ],
    "primula-veris": [
      { wildlifeId: "duke-of-burgundy", support: "host", reliance: "narrow", note: "The Duke of Burgundy lays only on cowslips and primroses, choosing big leaves in light shade.", basis: "GloBI — Ferrer-Paris et al. 2013 butterfly–host plant associations; INPN (MNHN)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Cowslip nectar sits deep in the tube, so long-tongued bumble bee queens are its April visitors.", basis: "INPN; European pollinator literature." },
    ],
    "knautia-arvensis": [
      { wildlifeId: "large-scabious-mining-bee", support: "nectar", reliance: "narrow", note: "This big mining bee feeds its young on scabious pollen and almost nothing else. No scabious, no bee.", basis: "INPN; European pollinator literature (Andrena hattorfiana)." },
      { wildlifeId: "six-spot-burnet", support: "nectar", note: "Burnet moths gather on scabious heads in July, often several to a flower.", basis: "INPN (MNHN)." },
      { wildlifeId: "apollo", support: "nectar", note: "Apollos come down to mauve flowers like scabious to feed on summer afternoons.", basis: "INPN (MNHN); European butterfly literature." },
    ],
    "campanula-scheuchzeri": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees climb into the nodding bells, and on a cold day may shelter in one overnight.", basis: "INPN; European pollinator literature." },
    ],
    "digitalis-grandiflora": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A foxglove's tube is shaped to fit a bumble bee, which walks right in and comes out dusted with pollen.", basis: "INPN; European pollinator literature." },
    ],
    "salvia-pratensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "When a bumble bee pushes in, a hinged lever swings the stamens down onto its back — a pollination trick made for big bees.", basis: "INPN; European pollinator literature." },
    ],
    "origanum-vulgare": [
      { wildlifeId: "large-blue", support: "host", note: "Where thyme is scarce, the large blue lays on wild marjoram instead, and its caterpillar starts life in the flower heads.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Marjoram flowers for weeks in late summer and is one of the busiest plants on a dry slope.", basis: "INPN; European pollinator literature." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", note: "Tufted hair-grass is a caterpillar plant for the ringlet and other brown butterflies of damp meadows.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "black-grouse", support: "berries", note: "Bearberry keeps its red fruit through the winter, one of the few things a grouse can find when the ground is frozen.", basis: "INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Small pink bells in spring, worked by early bumble bee queens.", basis: "INPN; European pollinator literature." },
    ],
    "sempervivum-arachnoideum": [
      { wildlifeId: "apollo", support: "host", reliance: "narrow", note: "The Apollo's caterpillars eat houseleeks and stonecrops on hot rock. A sunny rock garden with these plants can hold the butterfly.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
  },
  // Ireland. Almost every animal here is reused from the European catalog the
  // French regions built — the birds and bees of an Irish hedge are the birds
  // and bees of a Breton one. What needed care was the other direction: the
  // coverage report happily offers ties for animals that are **not in Ireland**,
  // because it matches on plants rather than on range. Hazel dormouse, purple
  // emperor, white-letter hairstreak, silver-studded blue, Glanville fritillary,
  // black grouse, spotted nutcracker and hawfinch all tie to plants this region
  // ships and none of them lives here, so none of them is tied. Ireland's own
  // three — the marsh fritillary, the cryptic wood white and the peacock — are
  // new to the catalog.
  ireland: {
    "quercus-petraea": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Purple hairstreak caterpillars eat oak and nothing else. The entire butterfly happens in the canopy — eggs on the buds, caterpillars in the opening leaves, adults circling the crown on a July evening — so an old oak in an Irish hedge is usually a colony nobody standing under it has ever noticed.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay buries a few thousand acorns each autumn and forgets enough of them that it is the main reason oak woods move at all. Plant one oak; the jays will plant the rest of the wood.", basis: "BirdWatch Ireland; National Biodiversity Data Centre (Ireland)." },
    ],
    "quercus-robur": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Either native oak will do — the hairstreak is after oak leaves, not a particular species of oak.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "The long-stalked acorns of this oak are the ones you most often find wedged in a lawn, dropped by a jay in a hurry.", basis: "BirdWatch Ireland." },
    ],
    "betula-pubescens": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins crumble all winter into seed so fine only the small finches bother — siskins and redpolls hang upside down along the outer twigs, usually in one noisy party.", basis: "BirdWatch Ireland; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars — fat, green, ringed with black and studded with orange warts — feed on birch as readily as on heather, and are one of the more startling things to find on a bog-edge sapling in July.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
    ],
    "alnus-glutinosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Alder's small woody cones hold their seed all winter, and siskins and redpolls work them upside down in chattering flocks — the classic January sight along an Irish river.", basis: "BirdWatch Ireland." },
    ],
    "salix-caprea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A bumble bee queen comes out of hibernation in March with nothing in reserve and has to found a whole colony alone — for that she needs pollen, protein for the first grubs, not just sugar. Sallow catkins are the first real supply of it in an Irish year, which is why a sally in flower is audible from across the garden.", basis: "All-Ireland Pollinator Plan; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "The poplar hawk-moth lays on willows as often as poplars. Its caterpillar is thumb-thick, apple-green, with a blue-gray horn at the tail, and it rests holding its head up in a sphinx pose — which is where the whole family's name comes from.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
    ],
    "rosa-spinosissima": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Burnet rose is the only rose here with black hips rather than red, and the thrushes take them late — after the dog-rose hips on the same dune have gone.", basis: "BirdWatch Ireland." },
    ],
    "salix-cinerea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Gray willow is the commonest sallow in the country, so in most of Ireland it is *this* plant doing the March pollen job rather than its taller cousin.", basis: "All-Ireland Pollinator Plan." },
    ],
    "populus-tremula": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Aspen is the moth's namesake tree. The adult rests with its hindwings pushed forward past the forewings, which no other moth here does, and looks exactly like a clump of dead leaves for it.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
    ],
    "prunus-avium": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Blackbirds and mistle thrushes strip a wild cherry in July, weeks before anyone gets a ladder to it.", basis: "BirdWatch Ireland." },
      { wildlifeId: "mason-bees", support: "nectar", note: "An open, shallow cherry flower is one solitary bees can actually use — a red mason bee can reach the nectar in a flower a bumble bee would have to force.", basis: "All-Ireland Pollinator Plan." },
    ],
    "prunus-padus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Small bitter black cherries in August that blackbirds and thrushes take once the sweeter fruit is gone.", basis: "BirdWatch Ireland." },
    ],
    "sorbus-aucuparia": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "A rowan in fruit is the loudest tree of the Irish autumn: redwings and fieldfares come off the Scandinavian crossing straight into it and can have it bare in two days. A mistle thrush will try to hold one against the whole flock and lose.", basis: "BirdWatch Ireland; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Flat open heads of cream flowers in May — a landing platform rather than a tube, which is what short-tongued solitary bees and hoverflies need.", basis: "All-Ireland Pollinator Plan." },
    ],
    "taxus-baccata": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "The red flesh around a yew seed is the one part of the tree that is not poisonous, and blackbirds and mistle thrushes eat it through the winter, passing the seed on unharmed. The tree and the bird have that arrangement worked out.", basis: "BirdWatch Ireland; Royal Horticultural Society." },
    ],
    "ilex-aquifolium": [
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The spring brood of the holly blue lays on holly flower buds and the caterpillars eat the developing berries; the summer brood then moves to ivy. A garden with both keeps the butterfly right through the year, which is why it is one of the few Irish butterflies that is genuinely a garden species.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Holly holds its berries longer than anything else in the hedge, and a mistle thrush will guard a single bush against every other bird through the hardest weeks of the year.", basis: "BirdWatch Ireland." },
    ],
    "malus-sylvestris": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Apple blossom is the classic red mason bee flower — one bee visits several hundred in a morning and pollinates far more effectively than a honeybee doing the same round.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Crab apples hang on after the leaves drop and go soft with the first frosts, which is exactly when fieldfares want them.", basis: "BirdWatch Ireland." },
    ],
    "corylus-avellana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Hazel is wind-pollinated and needs no insect at all, but its lamb's-tail catkins shed pollen in January and February and the earliest solitary bees collect it anyway — the first trickle of the year, before the sallows open.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays take and bury hazelnuts as well as acorns. The hazel dormouse isn't native to Ireland — a small introduced population turned up in 2010 — so in an Irish hedge it is jays, wood mice and red squirrels that the nuts are feeding.", basis: "BirdWatch Ireland; National Biodiversity Data Centre (Ireland)." },
    ],
    "crataegus-monogyna": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "A hedge of haws is what carries fieldfares and redwings through an Irish winter — they arrive in flocks and strip one hedge at a time.", basis: "BirdWatch Ireland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The May froth of whitethorn is the single biggest nectar event of the hedgerow year here, and it is over in two weeks.", basis: "All-Ireland Pollinator Plan." },
    ],
    "prunus-spinosa": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Blackthorn flowers on bare black wood in March, before its own leaves and before almost anything else — an early meal for solitary bees just out of the ground.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Sloes hang on long after the other fruit is gone, which is exactly when the winter thrushes need them.", basis: "BirdWatch Ireland." },
      { wildlifeId: "emperor-moth", support: "host", note: "Blackthorn is one of the emperor moth's main caterpillar plants away from the bog, so a thorny hedge and a heather bank feed the same spectacular moth.", basis: "National Biodiversity Data Centre (Ireland)." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "emperor-moth", support: "host", reliance: "narrow", note: "Heather is the emperor moth's plant on Irish bog and mountain. The male flies by day in April, fast and low over the heather, following the female's scent from a mile off — the only big day-flying moth most people here will see.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "When the meadows are cut and the hedge flowers are finished, an August heather hill is the last great nectar source of the Irish year. Heather honey comes from these three weeks.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Green hairstreak caterpillars feed on heather, gorse, broom and bilberry — the whole heath, effectively. The adult is the only green butterfly in Ireland and it shuts its wings and disappears the moment it lands.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "erica-cinerea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bell heather opens in June, a month before ling, and bridges the gap between the hedge blossom and the August heather — a genuinely important few weeks for bumblebee colonies at full size.", basis: "All-Ireland Pollinator Plan." },
    ],
    "erica-tetralix": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The heather of wet ground, and so the nectar source on blanket bog where nothing else is flowering at all.", basis: "All-Ireland Pollinator Plan." },
    ],
    "vaccinium-myrtillus": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Bilberry is one of the green hairstreak's main caterpillar plants on Irish hillsides — look for the butterfly basking on a bilberry leaf on the first warm days of May.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bilberry's small pink bells open in April, early enough to matter, and are shaped for a bumble bee to hang under and reach up into.", basis: "All-Ireland Pollinator Plan." },
    ],
    "rubus-fruticosus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackberries in late summer are migration fuel: blackcaps, whitethroats and garden warblers pile into a fruiting bramble and eat little else while it lasts.", basis: "BirdWatch Ireland." },
      { wildlifeId: "red-admiral", support: "nectar", note: "A sunny bramble in September is where you find the red admirals — they feed on the overripe fruit as much as the flowers, and it is the last big meal before they head south or try to overwinter.", basis: "National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Bramble is on the green hairstreak's long list of caterpillar plants, which is part of why it turns up on hedge banks as well as open heath.", basis: "European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "silver-washed-fritillary", support: "nectar", note: "Bramble in a sunny ride is the silver-washed fritillary's favorite flower; in July several often share one bush.", basis: "Butterfly Conservation." },
    ],
    "rosa-canina": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Hips hold on the bush into January, long after the haws and sloes are gone — the reserve tank of an Irish hedge.", basis: "BirdWatch Ireland." },
      { wildlifeId: "mason-bees", support: "nectar", note: "A single open rose is full of accessible pollen, which is exactly what a double garden rose is not. Solitary bees roll in it.", basis: "All-Ireland Pollinator Plan." },
    ],
    "frangula-alnus": [
      { wildlifeId: "brimstone", support: "host", reliance: "sole", note: "Buckthorns are the only thing a brimstone caterpillar can eat, and alder buckthorn is the one for damp, acid Irish ground. The brimstone has been spreading west across Ireland for decades and this shrub is what it is following — so a single bush is a specific, traceable contribution rather than a general good deed. The adult hibernates in ivy and is usually the first butterfly of the Irish spring.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
    ],
    "euonymus-europaeus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Shocking pink capsules split in October to show orange seed, and robins and blackbirds take them straight away.", basis: "BirdWatch Ireland." },
    ],
    "viburnum-opulus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Translucent red berries that hang late — bullfinches and blackcaps take them once the sweeter fruit has gone.", basis: "BirdWatch Ireland." },
    ],
    "ulex-europaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A bumble bee out on a mild January day in Ireland is almost certainly on gorse. Nothing else is open, and that coconut-scented pollen is what gets an early queen through to the sallows.", basis: "All-Ireland Pollinator Plan; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Gorse is a main caterpillar plant for the green hairstreak, and a gorse bank in May is the best place in the country to look for one.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "cytisus-scoparius": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Broom joins gorse, heather and bilberry on the green hairstreak's list — plant any two of them and you have made a heath the butterfly can use.", basis: "European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower is a trap set for a heavy bee: her weight trips the keel, the stamens spring up and slap pollen onto her back. Too light an insect gets nothing and gives nothing.", basis: "All-Ireland Pollinator Plan." },
    ],
    "sambucus-nigra": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The August elderberry crop is what blackcaps and garden warblers put on weight with before flying south — a fruiting elder holds them for two weeks.", basis: "BirdWatch Ireland." },
    ],
    "juniperus-communis": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Juniper cones take three years to ripen and then feed ring ouzels, mistle thrushes and fieldfares, and the spines make one of very few safe nest sites on an open Irish hillside.", basis: "BirdWatch Ireland." },
    ],
    "myrica-gale": [
      { wildlifeId: "emperor-moth", support: "host", note: "Bog myrtle is one of the emperor moth's bog plants, alongside the heather it shares the ground with.", basis: "National Biodiversity Data Centre (Ireland)." },
    ],
    "succisa-pratensis": [
      { wildlifeId: "marsh-fritillary", support: "host", reliance: "sole", note: "This is the whole story of Ireland's only protected insect. A female marsh fritillary lays her entire batch of eggs under one devil's-bit scabious leaf; the caterpillars hatch together, spin a silk tent over the plant, and spend the winter inside it in a black huddle. On the first warm days of spring they come out and bask on top of the web in a knot, which is how anyone ever finds them. No devil's-bit, no marsh fritillary — and the plant only persists on damp ground that is neither fertilized nor cut in summer, which is why the butterfly went when the meadows did.", basis: "National Parks & Wildlife Service (Ireland) species action plan; National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "It flowers from July into October, after nearly everything else has finished, which is exactly when a bumblebee colony is producing next year's queens and needs the most food it will need all year.", basis: "All-Ireland Pollinator Plan." },
    ],
    "digitalis-purpurea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A foxglove is built for one animal. The spotted throat is a landing strip and a set of directions, and the tube is deep enough that only a long-tongued bumble bee reaches the end. Watch one climb right inside and reverse out dusted along the back.", basis: "All-Ireland Pollinator Plan." },
    ],
    "primula-vulgaris": [
      { wildlifeId: "brimstone", support: "nectar", note: "A brimstone coming out of hibernation in March finds almost nothing open. Primroses on a ditch bank are one of the few things it can feed on before the blossom starts.", basis: "National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Primrose flowers in February on a sheltered Irish bank, weeks ahead of most of Europe, and the first solitary bees of the year work them.", basis: "All-Ireland Pollinator Plan." },
    ],
    "hyacinthoides-non-scripta": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bluebells flower in the weeks between the ground warming and the canopy closing — exactly when the spring solitary bees are stocking their nests. Mining bees work them all morning.", basis: "All-Ireland Pollinator Plan." },
    ],
    "anemone-nemorosa": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Wood anemone offers pollen rather than nectar, and pollen is what an early solitary bee is actually collecting — protein to stock a nest cell, not sugar for herself.", basis: "All-Ireland Pollinator Plan." },
    ],
    "allium-ursinum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Acres of white in deep shade in May, and one of the few good nectar sources in Irish woodland once the canopy has closed over.", basis: "All-Ireland Pollinator Plan." },
    ],
    "filipendula-ulmaria": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Meadowsweet offers pollen and no nectar at all, which sounds like a poor deal until you watch the hoverflies and short-tongued bees on it — pollen is precisely what they came for.", basis: "All-Ireland Pollinator Plan." },
    ],
    "lythrum-salicaria": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Three months of flowering on wet ground, worked by bumblebees from the bottom of the spike upward — it is one of the longest-serving nectar plants an Irish pond edge can carry.", basis: "All-Ireland Pollinator Plan." },
    ],
    "caltha-palustris": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Big open gold cups in late March, exactly when the first mining bees emerge and have essentially nothing else to work.", basis: "All-Ireland Pollinator Plan." },
    ],
    "centaurea-nigra": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Knapweed comes near the top of every Irish nectar survey, and it keeps going into September when the summer flowers have gone over.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Leave the dead heads standing and goldfinches take them apart through the autumn, hanging sideways off the stems.", basis: "BirdWatch Ireland." },
      { wildlifeId: "painted-lady", support: "nectar", note: "In a painted lady year — when millions arrive from North Africa in one summer — knapweed and thistles are what they feed on across Irish grassland.", basis: "National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "dark-green-fritillary", support: "nectar", note: "Knapweed is where a dark green fritillary stops long enough to be seen; the rest of the time it is a fast orange blur.", basis: "Butterfly Conservation." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", reliance: "narrow", note: "Bird's-foot trefoil is the common blue's caterpillar plant, and the butterfly is common only where the plant is. It needs the trefoil in short, hungry, unfertilized turf — which is to say a lawn nobody has fed, and a verge nobody has sprayed.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "six-spot-burnet", support: "host", reliance: "sole", note: "The six-spot burnet is the scarlet-spotted, metallic-green day-flying moth of Irish dunes in July, and its caterpillars eat bird's-foot trefoil and nothing else. It takes cyanide compounds out of the plant and keeps them — which is what the red spots are advertising.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
    ],
    "rumex-acetosa": [
      { wildlifeId: "small-copper", support: "host", reliance: "narrow", note: "The small copper lays on sorrels and docks. It is the little flashing orange butterfly of Irish roadsides, dunes and bare sunny ground, and it is fiercely territorial for something the size of a thumbnail — a male will chase off anything that crosses his patch, including birds.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The rusty seed heads feed linnets and goldfinches through the autumn if they are left standing.", basis: "BirdWatch Ireland." },
    ],
    "urtica-dioica": [
      { wildlifeId: "peacock-butterfly", support: "host", reliance: "sole", note: "Peacock caterpillars eat nettle and nothing else. They hatch in a batch of a hundred or more, live together under a shared web of silk on the growing tips, and are jet black with white flecks and spines — a mass of them on a nettle patch is unmistakable. The butterfly then overwinters as an adult in a shed or a hollow tree and comes out in March.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "red-admiral", support: "host", reliance: "sole", note: "Red admiral caterpillars are nettle-only too, but they live alone rather than in a huddle, each one folding a single leaf over itself and stitching it shut with silk.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "comma", support: "host", note: "The comma is a recent arrival in Ireland — first recorded here in 2000 and now spreading north — and nettle is one of the main plants it lays on. Its caterpillar is disguised as a bird dropping, white on black, which is a good enough trick to be worth looking for.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "small-tortoiseshell", support: "host", reliance: "narrow", note: "Small tortoiseshell caterpillars eat nettles and nothing else, living together in a silk web on young shoots in full sun.", basis: "Butterfly Conservation; National Biodiversity Data Centre (Ireland)." },
    ],
    "taraxacum-officinale": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The single most useful thing in an Irish garden in April, and it is the thing most people are trying to kill. A queen bumblebee founding a colony that month has dandelions or she has nothing.", basis: "All-Ireland Pollinator Plan; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "mason-bees", support: "nectar", note: "A flat open disc packed with pollen, at ground level, in the weeks when solitary bees are emerging — there is no better shape for them.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches take dandelion clocks apart seed by seed, hovering at them like tiny parrots.", basis: "BirdWatch Ireland." },
    ],
    "teucrium-scorodonia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Wood sage flowers in late summer on dry shaded banks where almost nothing else is in flower at all, and long-tongued bumblebees work it hard for that reason.", basis: "All-Ireland Pollinator Plan." },
    ],
    "silene-dioica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Seven months of flowers on a hedge bank, from April to October — very few native perennials keep going that long, and the bumblebees find it at both ends of the season.", basis: "All-Ireland Pollinator Plan." },
    ],
    "geranium-sanguineum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big open magenta flowers on dry limestone through midsummer — on the Burren it is one of the main nectar plants over bare rock.", basis: "All-Ireland Pollinator Plan." },
    ],
    "festuca-rubra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Ireland's cast of brown butterflies — meadow brown, ringlet, speckled wood, wall brown — eat nothing but grasses like this, and overwinter as small caterpillars down inside the tussock. That is the real reason a close-mown lawn has no butterflies in it.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "poa-trivialis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The damp-ground, part-shade grass of the same story — which is why speckled woods, the butterflies of dappled hedge shade, turn up where this grass is and not where the fescue is.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "molinia-caerulea": [
      { wildlifeId: "grass-skippers", support: "host", note: "Purple moor-grass is the bog's own grass butterfly plant, and the large heath — a bog specialist in serious decline — is one of the browns that depends on tussocky wet grassland like this.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", note: "An old hair-grass tussock is a whole winter habitat — grass-feeding caterpillars, spiders and beetles all sit it out inside one.", basis: "European butterfly foodplant checklist (Dryad)." },
    ],
    "hedera-helix": [
      { wildlifeId: "red-admiral", support: "nectar", note: "Ivy flowers in October, when a red admiral trying to survive an Irish winter or fly south has nothing else at all. An ivy-covered wall in autumn sunshine is the busiest thing in the garden, and most of it is insects nobody expected to still be flying.", basis: "All-Ireland Pollinator Plan; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "holly-blue", support: "host", reliance: "narrow", note: "The summer brood of the holly blue lays on ivy, having spent the spring on holly. Both plants in one garden gives you the butterfly twice a year.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Ivy berries ripen in February, the hungriest month, when the haws and hips are long gone. Blackbirds and wood pigeons live on them.", basis: "BirdWatch Ireland." },
      { wildlifeId: "comma", support: "nectar", note: "Commas feed up on ivy flowers before hibernating as adults on a twig, where their torn outline passes for a dead leaf all winter.", basis: "National Biodiversity Data Centre (Ireland)." },
    ],
    "lonicera-periclymenum": [
      { wildlifeId: "hummingbird-hawk-moth", support: "nectar", note: "Honeysuckle is pale so it shows at dusk, opens in the evening, and throws its scent for yards — all of that is advertising to moths with long tongues. A hummingbird hawk-moth hovering at one at nine on a July evening is the thing it was designed for.", basis: "National Biodiversity Data Centre (Ireland); All-Ireland Pollinator Plan." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Clusters of red berries in autumn that warblers and thrushes take on the way south.", basis: "BirdWatch Ireland." },
    ],
    "vicia-cracca": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Tufted vetch is near the top of Irish nectar rankings — the one-sided violet spires are worked by long-tongued bumblebees all summer.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "cryptic-wood-white", support: "host", note: "Vetches are among the handful of plants the cryptic wood white lays on. It flies weakly along a hedge bank rather than across a field, so a strip of vetch in rough grass is a corridor as much as a meal.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad)." },
    ],
    "lathyrus-pratensis": [
      { wildlifeId: "cryptic-wood-white", support: "host", reliance: "narrow", note: "Meadow vetchling is the main caterpillar plant of a butterfly that exists, in Britain and Ireland, only here — and that was not even recognized as its own species until 2011. It lives on roadsides, railroad banks and rough damp grassland, which are exactly the places that get tidied. Leaving a strip uncut until September is the whole intervention.", basis: "National Biodiversity Data Centre (Ireland); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A yellow pea flower needs a bee heavy enough to trip it, so this is bumblebee food rather than something a hoverfly can use.", basis: "All-Ireland Pollinator Plan." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers from April at ankle height — easy landing for mining bees working a sunny bank.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Tiny, intense berries that robins and blackcaps find long before anyone with a bowl does.", basis: "BirdWatch Ireland." },
    ],
    "galium-verum": [
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "Elephant hawk-moth caterpillars feed on bedstraws and willowherbs. The caterpillar is the size of a finger, gray-brown, with four eyespots it inflates when alarmed until the front end looks like a small snake — the single most startling thing an Irish garden produces. The adult is pink and olive and feeds at honeysuckle after dark.", basis: "National Biodiversity Data Centre (Ireland); Butterfly Conservation." },
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The hummingbird hawk-moth lays on bedstraws too. It arrives in Ireland as a migrant from the south, hovers at flowers in full daylight with an audible hum, and is reported to BirdWatch Ireland every summer by people certain they have seen a hummingbird.", basis: "National Biodiversity Data Centre (Ireland)." },
    ],
    "plantago-lanceolata": [
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Linnets and goldfinches strip the seed spikes through late summer. Leave a strip of lawn unmown from April and this is one of the plants that pays for it.", basis: "BirdWatch Ireland; All-Ireland Pollinator Plan." },
    ],
    "trifolium-repens": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Among the highest-ranked nectar plants in Irish surveys, and it is already in the lawn. Raise the mower blade and cut every six weeks instead of every two weeks and it flowers — the cheapest, least effortful thing you can do for bees.", basis: "All-Ireland Pollinator Plan." },
    ],
    "thymus-praecox": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A thyme mat in July is audible from a few feet away. Per square foot it is one of the densest nectar sources you can plant.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Short tubes at ground level, which is what the small solitary bees of dry limestone and dune sand can actually reach into.", basis: "All-Ireland Pollinator Plan." },
    ],
    "betula-pendula": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Silver birch is rarer in Ireland than downy birch, but its catkins feed the same winter parties of siskins and redpolls, hanging upside down along the twigs.", basis: "BirdWatch Ireland." },
    ],
    "salix-pentandra": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Poplar hawk-moth caterpillars eat willows as well as poplars and aspen, and a bay willow in a wet hollow will do.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bay willow flowers late, in May and June, with its leaves already out — willow food for bees after the sallows are long over.", basis: "All-Ireland Pollinator Plan; Stace, New Flora of the British Isles." },
    ],
    "salix-aurita": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "Clarke's mining bee collects willow pollen and nothing else, and is out in March for the first catkins. Eared willow on a wet heath suits it well.", basis: "BWARS (Bees, Wasps & Ants Recording Society); National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Another willow on the poplar hawk-moth's list. The big green caterpillars, horned at the tail, lie pressed along a twig and are hard to spot.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
    ],
    "rubus-idaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Raspberry flowers hang downward, which suits bumble bees: they hold on underneath to drink. A wild patch hums all June.", basis: "All-Ireland Pollinator Plan." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Robins and blackcaps take the soft fruit in July and August, and the canes are thick enough to nest in.", basis: "BirdWatch Ireland." },
    ],
    "iris-pseudacorus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each flower has three landing pads marked with nectar guides. A bumble bee pushes in under the style to drink and backs out dusted with pollen.", basis: "All-Ireland Pollinator Plan; Sutherland 1990, Biological Flora of the British Isles: Iris pseudacorus." },
    ],
    "viola-riviniana": [
      { wildlifeId: "dark-green-fritillary", support: "host", reliance: "narrow", note: "Common dog-violet is the main caterpillar plant of the dark green fritillary, which lays on violets in rough grassland, dunes and open hillsides.", basis: "Butterfly Conservation; National Biodiversity Data Centre (Ireland)." },
      { wildlifeId: "silver-washed-fritillary", support: "host", reliance: "narrow", note: "The silver-washed fritillary lays on bark just above the violets, and the tiny caterpillars climb down to them in spring. Violets at a wood edge are what it needs.", basis: "Butterfly Conservation; National Biodiversity Data Centre (Ireland)." },
    ],
    "cardamine-pratensis": [
      { wildlifeId: "orange-tip", support: "host", reliance: "narrow", note: "The orange-tip lays one egg on a flower stalk, and the caterpillar eats the seed pods as they form. Leave the damp corner uncut until July and you keep the butterfly.", basis: "Butterfly Conservation; National Biodiversity Data Centre (Ireland)." },
    ],
    "silene-flos-cuculi": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nectar sits at the bottom of a narrow tube, so ragged-robin feeds long-tongued bumble bees and butterflies in a wet June meadow.", basis: "All-Ireland Pollinator Plan." },
    ],
    "knautia-arvensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each pincushion head is dozens of small flowers, so a bee can feed a long time without flying. Bumble bees work it from July into September.", basis: "All-Ireland Pollinator Plan." },
    ],
    "primula-veris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nectar is deep in the tube, so cowslips feed long-tongued bumble bee queens just out of hibernation in April.", basis: "All-Ireland Pollinator Plan; Bumblebee Conservation Trust." },
    ],
    "geum-rivale": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nodding bells hang face-down, a shape that suits bumble bees, which cling on underneath to drink.", basis: "Taylor 1997, Biological Flora of the British Isles: Geum rivale." },
    ],
    "potentilla-erecta": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The tormentil mining bee collects pollen from tormentil and almost nothing else. It is scarce now, living where tormentil still flowers in unfertilized grass and heath.", basis: "BWARS (Bees, Wasps & Ants Recording Society); National Biodiversity Data Centre (Ireland)." },
    ],
  },
  // Lowland Scotland. Every animal is reused from the European catalog, and
  // each was checked against its Scottish range rather than assumed from
  // Ireland's: hazel dormouse, brimstone and the purple emperor tie to plants
  // this list ships and none of them lives here. Black grouse does, on the
  // moor edges of the Southern Uplands, and Ireland lacks it.
  "scotland-lowlands": {
    "primula-vulgaris": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Early nectar for the first solitary bees of spring.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "quercus-petraea": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Its caterpillars eat only oak, and the adults spend their lives in the canopy. Scotland's colonies are mostly in the western oakwoods.", basis: "Butterfly Conservation Scotland; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay buries thousands of acorns each autumn and forgets enough to plant the next wood.", basis: "RSPB Scotland." },
    ],
    "quercus-robur": [
      { wildlifeId: "purple-hairstreak", support: "host", reliance: "sole", note: "Either native oak will do: the hairstreak is after oak leaves, not one species.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "eurasian-jay", support: "seeds", note: "The long-stalked acorns are the ones jays carry off and bury.", basis: "RSPB Scotland." },
    ],
    "betula-pendula": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Siskins and redpolls hang upside down from the catkins all winter.", basis: "RSPB Scotland." },
      { wildlifeId: "black-grouse", support: "shelter", note: "Birch scrub at the moor edge is where black grouse feed on buds in winter. The Southern Uplands hold some of the birds' last lowland strongholds.", basis: "RSPB Scotland; Game & Wildlife Conservation Trust, Scottish black grouse surveys." },
    ],
    "betula-pubescens": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "The same winter finch flocks as silver birch, on the wetter ground.", basis: "RSPB Scotland." },
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars feed on birch as well as heather.", basis: "Butterfly Conservation Scotland." },
    ],
    "alnus-glutinosa": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Siskins and redpolls work the small cones along lowland rivers in January.", basis: "RSPB Scotland." },
    ],
    "salix-caprea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Sallow catkins are the first big pollen supply for queen bumblebees in March.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "The poplar hawk-moth lays on willows as often as poplars.", basis: "Butterfly Conservation Scotland." },
    ],
    "salix-cinerea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The commonest sallow in wet ground, doing the same March pollen job as goat willow.", basis: "Bumblebee Conservation Trust." },
    ],
    "populus-tremula": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Aspen is one of the moth's main food plants.", basis: "Butterfly Conservation Scotland." },
    ],
    "sorbus-aucuparia": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Flat heads of open flowers that short-tongued solitary bees can use.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Redwings and fieldfares arriving from Scandinavia can strip a rowan in two days.", basis: "RSPB Scotland." },
    ],
    "prunus-padus": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Blackbirds and thrushes take the small black cherries in late summer.", basis: "RSPB Scotland." },
    ],
    "prunus-avium": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Blackbirds and mistle thrushes strip a gean in July.", basis: "RSPB Scotland." },
    ],
    "ilex-aquifolium": [
      { wildlifeId: "holly-blue", support: "host", note: "Spring caterpillars of the holly blue feed on holly flowers and berries. The butterfly has spread into the Central Belt in recent years.", basis: "Butterfly Conservation Scotland; Butterflies for the New Millennium." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Thrushes turn to holly berries once the rowans are bare.", basis: "RSPB Scotland." },
    ],
    "crataegus-monogyna": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Haws feed redwings, fieldfares and blackbirds well into winter.", basis: "RSPB Scotland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "May blossom on every hedge, at the time worker bees are multiplying.", basis: "Bumblebee Conservation Trust." },
    ],
    "prunus-spinosa": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open blossom in April, when mining bees are first out.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars also feed on blackthorn.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Sloes left on the bush feed thrushes after a frost.", basis: "RSPB Scotland." },
    ],
    "rosa-spinosissima": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Its black hips are taken late, after the dog-rose hips have gone.", basis: "RSPB Scotland." },
    ],
    "rosa-canina": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Hips last on the bush into the new year.", basis: "RSPB Scotland." },
    ],
    "juniperus-communis": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Thrushes and other birds take the blue-black berries in winter.", basis: "RSPB Scotland." },
    ],
    "sambucus-nigra": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Blackcaps and other warblers fatten on elderberries before migrating.", basis: "RSPB Scotland." },
    ],
    "viburnum-opulus": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Birds take the red berries late, once sweeter fruit is gone.", basis: "RSPB Scotland." },
    ],
    "lonicera-periclymenum": [
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "The red berries feed warblers and thrushes in autumn.", basis: "RSPB Scotland." },
    ],
    "hedera-helix": [
      { wildlifeId: "holly-blue", support: "host", note: "The holly blue's second brood lays on ivy flower buds in late summer.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "red-admiral", support: "nectar", note: "Ivy blossom in October is the red admiral's last big meal of the year.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "Ripe in late winter, when little other fruit is left.", basis: "RSPB Scotland." },
    ],
    "calluna-vulgaris": [
      { wildlifeId: "emperor-moth", support: "host", note: "The emperor moth's main food plant on Scottish moors.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "green-hairstreak", support: "host", note: "Green hairstreak caterpillars feed on heather on moorland edges.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "August heather is the last big flush of nectar for moorland bumblebees.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "black-grouse", support: "shelter", note: "Black grouse nest in tall heather and feed on its shoots.", basis: "RSPB Scotland; Game & Wildlife Conservation Trust." },
    ],
    "erica-cinerea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Flowers a month before heather, bridging the gap for moorland bees.", basis: "Bumblebee Conservation Trust." },
    ],
    "vaccinium-myrtillus": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Green hairstreaks lay on blaeberry as well as heather.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flowers for queen bumblebees on acid ground.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "black-grouse", support: "berries", note: "Blaeberry shoots and berries are a staple for black grouse, and its caterpillars feed the chicks.", basis: "RSPB Scotland; Game & Wildlife Conservation Trust." },
    ],
    "cytisus-scoparius": [
      { wildlifeId: "green-hairstreak", support: "host", note: "Green hairstreak caterpillars also feed on broom.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumblebees force open the flowers and get dusted with pollen.", basis: "Bumblebee Conservation Trust." },
    ],
    "myrica-gale": [
      { wildlifeId: "emperor-moth", support: "host", note: "Emperor moth caterpillars feed on bog myrtle on wet heath.", basis: "Butterfly Conservation Scotland." },
    ],
    "succisa-pratensis": [
      { wildlifeId: "marsh-fritillary", support: "host", reliance: "sole", note: "The marsh fritillary's caterpillars eat only devil's-bit scabious. Scotland's colonies are in the south-west, in Dumfries and Galloway and Argyll.", basis: "Butterfly Conservation Scotland; NatureScot." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Late nectar into October.", basis: "Bumblebee Conservation Trust." },
    ],
    "centaurea-nigra": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the best late-summer bumblebee flowers.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches pick the seed from the dry heads in autumn.", basis: "RSPB Scotland." },
      { wildlifeId: "painted-lady", support: "nectar", note: "Painted ladies arriving from the south feed on knapweed in summer.", basis: "Butterfly Conservation Scotland." },
    ],
    "digitalis-purpurea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Built for bumblebees: they climb right inside the bells.", basis: "Bumblebee Conservation Trust." },
    ],
    "lotus-corniculatus": [
      { wildlifeId: "common-blue", support: "host", note: "The common blue's main food plant in Scotland.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "six-spot-burnet", support: "host", note: "Six-spot burnet caterpillars feed on it on dunes and verges.", basis: "Butterfly Conservation Scotland." },
    ],
    "thymus-praecox": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A low carpet of nectar bees work all summer.", basis: "Bumblebee Conservation Trust." },
    ],
    "teucrium-scorodonia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumblebees work its pale spikes in late summer.", basis: "Bumblebee Conservation Trust." },
    ],
    "silene-dioica": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long season of flowers for bumblebees.", basis: "Bumblebee Conservation Trust." },
    ],
    "geranium-sanguineum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bees visit the open flowers all summer.", basis: "Bumblebee Conservation Trust." },
    ],
    "corylus-avellana": [
      { wildlifeId: "eurasian-jay", support: "seeds", note: "Jays cache hazelnuts as they do acorns.", basis: "RSPB Scotland." },
    ],
    "salix-pentandra": [
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Poplar hawk-moth caterpillars eat willows as well as poplars and aspen; a bay willow by a burn will do.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bay willow flowers late, in May and June, with its leaves out — willow food for bees after the other willows are over.", basis: "Bumblebee Conservation Trust; Stace, New Flora of the British Isles." },
    ],
    "salix-aurita": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "Clarke's mining bee collects willow pollen and nothing else, and is out in March for the first catkins.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
      { wildlifeId: "poplar-hawk-moth", support: "host", note: "Another willow on the poplar hawk-moth's list. The big green caterpillars lie pressed along a twig and are hard to spot.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
    ],
    "erica-tetralix": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The heather of wet ground, flowering from June on bog and wet heath where little else does.", basis: "Bumblebee Conservation Trust." },
    ],
    "rubus-idaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Raspberry flowers hang downward, which suits bumble bees: they hold on underneath to drink.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Robins and blackcaps take the soft fruit in late summer, and the canes are thick enough to nest in.", basis: "RSPB Scotland." },
    ],
    "vicia-cracca": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees work the one-sided violet spires all summer.", basis: "Bumblebee Conservation Trust." },
    ],
    "lathyrus-pratensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A yellow pea flower needs a bee heavy enough to open it, so this is bumble bee food.", basis: "Bumblebee Conservation Trust." },
    ],
    "knautia-arvensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each pincushion head is dozens of small flowers, so a bee can feed a long time without flying.", basis: "Bumblebee Conservation Trust." },
    ],
    "geranium-sylvaticum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Wood crane's-bill fills upland hay meadows and verges in June, and bumble bees work along the whole stand.", basis: "Bumblebee Conservation Trust." },
    ],
    "primula-veris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nectar is deep in the tube, so cowslips feed long-tongued bumble bee queens just out of hibernation.", basis: "Bumblebee Conservation Trust." },
    ],
    "filipendula-ulmaria": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Meadowsweet offers pollen and no nectar, which is exactly what short-tongued bees and hoverflies come for.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "iris-pseudacorus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Each flower has three landing pads marked with nectar guides. A bumble bee pushes in under the style and backs out dusted with pollen.", basis: "Sutherland 1990, Biological Flora of the British Isles: Iris pseudacorus." },
    ],
    "caltha-palustris": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Big open gold cups in early spring, when the first mining bees emerge and have little else to work.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "geum-rivale": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nodding bells hang face-down, a shape that suits bumble bees, which cling on underneath to drink.", basis: "Taylor 1997, Biological Flora of the British Isles: Geum rivale." },
    ],
    "campanula-rotundifolia": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Small bumble bees climb right up inside the hanging bells to reach the nectar.", basis: "Bumblebee Conservation Trust." },
    ],
    "hyacinthoides-non-scripta": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bee queens work bluebell woods in May. Short-tongued ones often bite through the base of the bell to steal the nectar.", basis: "Bumblebee Conservation Trust; Plantlife." },
    ],
    "armeria-maritima": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Cushions of pink on cliffs and salt marsh, in flower for months; bumble bees work it all along the coast.", basis: "Bumblebee Conservation Trust." },
    ],
    "trollius-europaeus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A globeflower never fully opens, so an insect has to push in through the gap at the top. Its main partners are tiny flies; bumble bees push in too.", basis: "Bumblebee Conservation Trust; Pellmyr 1989, Oecologia (globeflower flies)." },
    ],
    "cirsium-heterophyllum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Big purple heads in upland meadows in July, worked by bumble bees for weeks.", basis: "Bumblebee Conservation Trust." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Leave the heads standing and goldfinches pull out the downy seed through late summer.", basis: "RSPB Scotland." },
      { wildlifeId: "dark-green-fritillary", support: "nectar", note: "Thistles are where a dark green fritillary stops long enough to be seen; the rest of the time it is a fast orange blur.", basis: "Butterfly Conservation Scotland." },
    ],
    "anemone-nemorosa": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Wood anemone offers pollen rather than nectar, and pollen is what an early solitary bee is collecting for its nest.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "allium-ursinum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Sheets of white in shady woods in May, one of the few good flowers there once the canopy closes.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "viola-riviniana": [
      { wildlifeId: "small-pearl-bordered-fritillary", support: "host", reliance: "narrow", note: "Common dog-violet is the small pearl-bordered fritillary's main caterpillar plant, in damp grassland, bracken and woodland clearings.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "dark-green-fritillary", support: "host", reliance: "narrow", note: "The dark green fritillary lays on violets too, on drier, more open ground: grassy hillsides and dunes.", basis: "Butterfly Conservation Scotland." },
    ],
    "cardamine-pratensis": [
      { wildlifeId: "orange-tip", support: "host", reliance: "narrow", note: "The orange-tip lays one egg on a flower stalk, and the caterpillar eats the seed pods. It has spread across Scotland in recent decades.", basis: "Butterfly Conservation Scotland." },
    ],
    "silene-flos-cuculi": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The nectar sits at the bottom of a narrow tube, so ragged-robin feeds long-tongued bumble bees and butterflies.", basis: "Bumblebee Conservation Trust." },
    ],
    "rhinanthus-minor": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Yellow rattle's hooded flower opens only for a bee strong enough to force it — bumble bees, mostly.", basis: "Westbury 2004, Biological Flora of the British Isles: Rhinanthus minor; Bumblebee Conservation Trust." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers from April at ankle height — easy landing for mining bees on a sunny bank.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
      { wildlifeId: "blackcaps-warblers", support: "berries", note: "Tiny, intense berries that robins and blackcaps find long before anyone with a bowl does.", basis: "RSPB Scotland." },
    ],
    "galium-verum": [
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "Elephant hawk-moth caterpillars feed on bedstraws and willowherbs. When alarmed, the finger-sized caterpillar swells four eyespots and looks like a small snake.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The hummingbird hawk-moth lays on bedstraws too. It reaches Scotland from the south in warm summers and hovers at flowers in full daylight.", basis: "UK Moths; Waring & Townsend, Field Guide to the Moths of Great Britain and Ireland." },
    ],
    "ajuga-reptans": [
      { wildlifeId: "small-pearl-bordered-fritillary", support: "nectar", note: "Bugle flowers just as the small pearl-bordered fritillary emerges, and is one of its favorite nectar plants in a woodland clearing.", basis: "Butterfly Conservation Scotland." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Blue spikes in damp shade in May, worked by bumble bee queens.", basis: "Bumblebee Conservation Trust." },
    ],
    "potentilla-erecta": [
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The tormentil mining bee collects pollen from tormentil and almost nothing else. It is scarce now, living where tormentil still flowers in unfertilized grass and moor.", basis: "BWARS (Bees, Wasps & Ants Recording Society)." },
    ],
    "prunella-vulgaris": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Low purple heads in short grass all summer, worked by bumble bees even where the lawn is mown.", basis: "Bumblebee Conservation Trust." },
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", note: "The ringlet lays on coarse grasses like tufted hair-grass in damp, shady corners, and its caterpillars feed on mild winter nights.", basis: "Butterfly Conservation Scotland." },
    ],
    "festuca-rubra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Meadow browns and small heaths lay on fine grasses like red fescue, and the caterpillars winter low in the tussock. Mow it all short and they have nowhere to go.", basis: "Butterfly Conservation Scotland." },
    ],
    "molinia-caerulea": [
      { wildlifeId: "scotch-argus", support: "host", reliance: "narrow", note: "In Scotland, Scotch argus caterpillars feed on purple moor-grass and little else, so a tall, unmown stand on wet ground is the whole habitat.", basis: "Butterfly Conservation Scotland." },
    ],
  },

  // The Kantō Plain. Every tie here is a caterpillar host from HOSTS' Japan
  // records (data/sources/hosts/records/japan.csv), which
  // wildlife-hosts.test.ts re-reads.
  kanto: {
    "celtis-sinensis": [
      { wildlifeId: "great-purple-emperor", support: "host", reliance: "narrow", note: "Hackberry is the great purple emperor's food plant. Plant one and the caterpillars may winter in the leaves beneath it, so leave those where they fall.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "aristolochia-debilis": [
      { wildlifeId: "chinese-windmill", support: "host", reliance: "narrow", note: "Birthwort is what the windmill's caterpillars eat, and where its poison comes from. A patch at a sunny edge is enough to bring the butterfly in.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "wisteria-floribunda": [
      { wildlifeId: "pallas-sailer", support: "host", note: "Wisteria leaves raise Pallas' sailer caterpillars, which hide on the leaf they're eating.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are strong enough to open wisteria's pea flowers, and pollinate them.", basis: "GloBI — Inoue et al. 1990, insect–flower survey of Kibune forest, Kyoto (Web of Life)." },
    ],
    "quercus-serrata": [
      { wildlifeId: "japanese-oak-silkmoth", support: "host", note: "Konara oak is a main food tree for the oak silkmoth's caterpillars.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "oak-hairstreaks", support: "host", reliance: "narrow", note: "Konara oak feeds several canopy hairstreaks whose caterpillars eat nothing but oak.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "squeaking-silkmoth", support: "host", note: "Its leaves feed the squeaking silkmoth's caterpillars in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "holly-blue", support: "host", note: "Holly blue caterpillars eat the flower buds and young leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "winter-moths", support: "host", note: "Konara oak is a main food tree for winter moth caterpillars.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "moon-moths", support: "host", note: "Moon moth caterpillars eat konara oak leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "quercus-acutissima": [
      { wildlifeId: "japanese-oak-silkmoth", support: "host", note: "Sawtooth oak feeds the oak silkmoth's caterpillars too.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "oak-hairstreaks", support: "host", reliance: "narrow", note: "One of the oaks the canopy hairstreaks lay their eggs on, in the buds.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "squeaking-silkmoth", support: "host", note: "A food tree for the squeaking silkmoth.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "holly-blue", support: "host", note: "Holly blue caterpillars take its buds and young leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "moon-moths", support: "host", note: "Sawtooth oak feeds the alder moon moth's caterpillars too.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "quercus-myrsinifolia": [
      { wildlifeId: "japanese-oak-silkmoth", support: "host", note: "An evergreen oak the silkmoth's caterpillars also eat.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "quercus-glauca": [
      { wildlifeId: "japanese-oak-silkmoth", support: "host", note: "Ring-cupped oak feeds the oak silkmoth's caterpillars.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "oak-hairstreaks", support: "host", reliance: "narrow", note: "An evergreen oak some of the hairstreaks use.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "castanea-crenata": [
      { wildlifeId: "japanese-oak-silkmoth", support: "host", note: "Chestnut is an oak relative, and the silkmoth's caterpillars eat it as readily.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "squeaking-silkmoth", support: "host", note: "Chestnut is one of the squeaking silkmoth's food trees.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "holly-blue", support: "host", note: "Holly blue caterpillars feed on its flower spikes.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "winter-moths", support: "host", note: "Chestnut feeds winter moth caterpillars in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "moon-moths", support: "host", note: "Both moon moths raise their caterpillars on chestnut.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "miscanthus-sinensis": [
      { wildlifeId: "chinese-bushbrown", support: "host", note: "Silver grass feeds the bushbrown's caterpillars; leave a clump uncut at a shady edge.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "castanopsis-sieboldii": [
      { wildlifeId: "holly-blue", support: "host", note: "Holly blue caterpillars eat the flower buds and young leaves of this evergreen chinquapin.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
    ],
    "zelkova-serrata": [
      { wildlifeId: "winter-moths", support: "host", note: "Several winter moths raise their caterpillars on zelkova, so a tree in a park can have their wingless females climbing its trunk in January.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "pale-oak-beauty", support: "host", note: "Pale oak beauty caterpillars eat zelkova leaves; the bark-colored adult rests on the trunk by day.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "comma", support: "host", note: "In Japan the comma raises its caterpillars on zelkova as well as elm.", basis: "GloBI — NHM Interactions Bank, Natural History Museum." },
      { wildlifeId: "squeaking-silkmoth", support: "host", note: "The squeaking silkmoth's caterpillars eat zelkova leaves too.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NHM Interactions Bank." },
    ],
    "prunus-jamasakura": [
      { wildlifeId: "brown-eared-bulbul", support: "berries", note: "Bulbuls swallow the small black cherries in early summer and spread the stones through the woods.", basis: "GloBI — Noma 1997, fruit-eating birds of a warm-temperate forest on Yakushima (Web of Life)." },
      { wildlifeId: "moon-moths", support: "host", note: "Wild cherry is one of the trees the moon moth's big green caterpillars eat.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM)." },
    ],
    "acer-palmatum": [
      { wildlifeId: "winter-moths", support: "host", note: "Japanese maple is one of the trees winter moth caterpillars hatch onto as its leaves open.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "pale-oak-beauty", support: "host", note: "Pale oak beauty caterpillars eat maple leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "feathered-thorn", support: "host", note: "Feathered thorn caterpillars eat maple leaves in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "carpinus-laxiflora": [
      { wildlifeId: "winter-moths", support: "host", note: "Hornbeam feeds winter moth caterpillars in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "pale-oak-beauty", support: "host", note: "Pale oak beauty caterpillars eat hornbeam leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "machilus-thunbergii": [
      { wildlifeId: "common-bluebottle", support: "host", note: "Tabunoki is a laurel, and the bluebottle's caterpillars eat its tender new leaves.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research); HOSTS (Robinson et al., NHM)." },
      { wildlifeId: "japanese-white-eye", support: "berries", note: "White-eyes eat the dark purple fruit in early summer.", basis: "GloBI — Noma 1997, fruit-eating birds of a warm-temperate forest on Yakushima, via Fricke & Svenning 2020 frugivory network (Nature)." },
      { wildlifeId: "brown-eared-bulbul", support: "berries", note: "Bulbuls swallow the fruit whole and carry the seeds off.", basis: "GloBI — Noma 1997, fruit-eating birds of a warm-temperate forest on Yakushima, via Fricke & Svenning 2020 frugivory network (Nature)." },
    ],
    "alnus-japonica": [
      { wildlifeId: "alder-hairstreak", support: "host", reliance: "narrow", note: "Alder is what the alder hairstreak's caterpillars eat, so a wet corner with alders is where it lives.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
      { wildlifeId: "moon-moths", support: "host", note: "The alder moon moth is named for this tree, which its caterpillars eat.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NHM Interactions Bank." },
      { wildlifeId: "winter-moths", support: "host", note: "Alder leaves feed winter moth caterpillars in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "styrax-japonicus": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the hanging white bells in early summer.", basis: "GloBI — Kato et al. 1990, insect–flower survey of the Ashu beech forest, Kyoto (Web of Life)." },
    ],
    "camellia-japonica": [
      { wildlifeId: "japanese-white-eye", support: "nectar", note: "White-eyes drink from camellias in winter, when few insects fly, and are the flowers' main pollinators.", basis: "Kunitake et al. 2004, Plant Species Biology — white-eyes and camellia pollination." },
    ],
    "hydrangea-macrophylla": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees visit the small fertile flowers in the middle of each head; the showy outer ones hold nothing.", basis: "GloBI — Kato et al. 1990 and Inoue et al. 1990, insect–flower surveys in Kyoto (Web of Life)." },
    ],
    "lespedeza-bicolor": [
      { wildlifeId: "pallas-sailer", support: "host", note: "Bush clover raises Pallas' sailer caterpillars, as wisteria does.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research); Ferrer-Paris et al. 2013." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees push into the purple pea flowers in late summer.", basis: "GloBI — Kato et al. 1990 and Yamazaki & Kato 2003, insect–flower surveys in Japan (Web of Life)." },
    ],
    "viburnum-dilatatum": [
      { wildlifeId: "feathered-thorn", support: "host", note: "Feathered thorn caterpillars eat viburnum leaves in spring.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "rhododendron-indicum": [
      { wildlifeId: "winter-moths", support: "host", note: "Winter moth caterpillars eat satsuki azalea leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "euonymus-alatus": [
      { wildlifeId: "spindle-ermines", support: "host", reliance: "narrow", note: "Several ermine moths raise their caterpillars on winged spindle, sometimes in tents of silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NHM Interactions Bank." },
    ],
    "salix-gracilistyla": [
      { wildlifeId: "winter-moths", support: "host", note: "A winter moth raises its caterpillars on this riverside willow.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "lindera-umbellata": [
      { wildlifeId: "common-bluebottle", support: "host", note: "Kuromoji is a laurel-family shrub the bluebottle's caterpillars eat.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
      { wildlifeId: "pale-oak-beauty", support: "host", note: "Pale oak beauty caterpillars eat kuromoji leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "eurya-japonica": [
      { wildlifeId: "japanese-white-eye", support: "berries", note: "White-eyes eat the small black berries.", basis: "GloBI — Noma 1997, fruit-eating birds of a warm-temperate forest on Yakushima, via Fricke & Svenning 2020 frugivory network (Nature)." },
      { wildlifeId: "brown-eared-bulbul", support: "berries", note: "Bulbuls take the berries too, and spread the seeds.", basis: "GloBI — Noma 1997, fruit-eating birds of a warm-temperate forest on Yakushima, via Fricke & Svenning 2020 frugivory network (Nature)." },
    ],
    "rosa-multiflora": [
      { wildlifeId: "pale-oak-beauty", support: "host", note: "Pale oak beauty caterpillars eat multiflora rose leaves.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
      { wildlifeId: "holly-blue", support: "host", note: "Holly blue caterpillars feed on the flower buds.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
    ],
    "lonicera-japonica": [
      { wildlifeId: "white-admiral", support: "host", reliance: "narrow", note: "Honeysuckle is the white admiral's caterpillar food, so a tangle at a shady edge can raise it.", basis: "HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM) — Japan records." },
    ],
    "cornus-kousa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees visit the small green flowers at the heart of the white bracts.", basis: "GloBI — Yamazaki & Kato 2003, insect–flower survey at Mt. Yufu (Web of Life)." },
    ],
    "artemisia-princeps": [
      { wildlifeId: "painted-lady", support: "host", note: "In Japan painted lady caterpillars feed on mugwort, in a silk tent among the leaves.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
    ],
    "viola-grypoceras": [
      { wildlifeId: "indian-fritillary", support: "host", reliance: "narrow", note: "Violets are the only food of the Indian fritillary's caterpillars, and this common wild violet is one.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research); HOSTS (Robinson et al., NHM)." },
    ],
    "cirsium-japonicum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees visit the purple thistle heads from spring into summer.", basis: "GloBI — Kato et al. 1990 and Yamazaki & Kato 2003, insect–flower surveys in Japan (Web of Life)." },
    ],
    "hosta-sieboldii": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees crawl right inside the pale purple bells.", basis: "GloBI — Kato & Miura 1996, insect–flower survey of the Nakaikemi marsh, Tsuruga (Web of Life)." },
    ],
    "sasa-veitchii": [
      { wildlifeId: "grass-skippers", support: "host", note: "Bamboo grass feeds the caterpillars of several brown woodland butterflies and a skipper.", basis: "GloBI — Saito et al. 2016, Larval host records of butterflies in Japan (Ecological Research)." },
    ],
  },
  "nz-auckland": {
    "myoporum-laetum": [
      { wildlifeId: "puriri-moth", support: "host", note: "Pūriri moth caterpillars tunnel into ngaio stems as well as pūriri, and live there for years.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "pomaderris-kumeraho": [
      { wildlifeId: "puriri-moth", support: "host", note: "Kūmarahou is one of the smaller trees the pūriri moth's caterpillars bore into.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "pseudopanax-arboreus": [
      { wildlifeId: "kawakawa-looper", support: "host", note: "The looper's caterpillars eat five-finger as well as kawakawa.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
      { wildlifeId: "forest-semilooper", support: "host", note: "Five-finger leaves feed the semilooper's twig-like caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "pseudopanax-lessonii": [
      { wildlifeId: "kawakawa-looper", support: "host", note: "Houpara is a five-finger relative the looper's caterpillars eat too.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
      { wildlifeId: "forest-semilooper", support: "host", note: "The semilooper's caterpillars feed on houpara leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "melicope-ternata": [
      { wildlifeId: "kawakawa-looper", support: "host", note: "Wharangi is another of the looper's food plants.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "dodonaea-viscosa": [
      { wildlifeId: "kawakawa-looper", support: "host", note: "The looper's caterpillars eat akeake leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "myrsine-australis": [
      { wildlifeId: "forest-semilooper", support: "host", note: "Māpou leaves feed the semilooper's caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "coprosma-lucida": [
      { wildlifeId: "forest-semilooper", support: "host", note: "The semilooper's caterpillars eat coprosma leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "coprosma-propinqua": [
      { wildlifeId: "forest-semilooper", support: "host", note: "A coprosma the semilooper's caterpillars feed on.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "coprosma-acerosa": [
      { wildlifeId: "forest-semilooper", support: "host", note: "Even sand coprosma's tiny leaves feed the semilooper's caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "agathis-australis": [
      { wildlifeId: "forest-semilooper", support: "host", note: "Kauri is one of the trees the semilooper's caterpillars eat.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "metrosideros-perforata": [
      { wildlifeId: "forest-semilooper", support: "host", note: "The semilooper's caterpillars eat rātā leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "metrosideros-fulgens": [
      { wildlifeId: "forest-semilooper", support: "host", note: "Climbing rātā leaves feed the semilooper's caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "metrosideros-excelsa": [
      { wildlifeId: "tui", support: "nectar", note: "A flowering pōhutukawa in December is the loudest tree in Auckland: tūī defend it from each other and from everything else, and carry its pollen tree to tree.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "tauhou", support: "nectar", note: "Silvereyes work the crimson brushes in flocks, taking what the tūī leave.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Native bees gather pollen from the open brushes on warm summer days.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "sophora-chathamica": [
      { wildlifeId: "tui", support: "nectar", note: "Kōwhai flowers in early spring, when tūī have little else, and the curved yellow bells fit the tūī's bill.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "kowhai-moth", support: "host", reliance: "narrow", note: "The kōwhai moth's caterpillars feed on kōwhai and a few related legumes. A webbed, chewed kōwhai in late summer is theirs.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "vitex-lucens": [
      { wildlifeId: "puriri-moth", support: "host", reliance: "narrow", note: "Pūriri is the pūriri moth's namesake and main host: its caterpillar tunnels in the living trunk for years without harming the tree.", basis: "Manaaki Whenua – Landcare Research." },
      { wildlifeId: "kereru", support: "berries", note: "Pūriri fruits through winter, when most trees are bare of it, and kererū depend on it then.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "tui", support: "nectar", note: "Its pink flowers open in every month, so a pūriri is a tūī's year-round stop.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "corynocarpus-laevigatus": [
      { wildlifeId: "kereru", support: "berries", reliance: "narrow", note: "The orange karaka fruit is too big for any other bird left in New Zealand to swallow; the kererū carries the seed away.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "knightia-excelsa": [
      { wildlifeId: "tui", support: "nectar", note: "Rewarewa's red flowers are brushes of nectar in late spring, and tūī work them from the treetop down.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "dysoxylum-spectabile": [
      { wildlifeId: "tui", support: "nectar", note: "Kohekohe flowers in midwinter, straight from the trunk — one of the few nectar sources tūī have in June.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "alectryon-excelsus": [
      { wildlifeId: "puriri-moth", support: "host", note: "Tītoki is one of the pūriri moth's best-recorded hosts after pūriri itself: the caterpillar bores into the trunk and lives there for years.", basis: "Plant-SyNZ (Manaaki Whenua – Landcare Research), reliability 10." },
      { wildlifeId: "kereru", support: "berries", note: "Kererū and tūī take the scarlet, fleshy cups around tītoki seeds in summer.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "podocarpus-totara": [
      { wildlifeId: "kereru", support: "berries", note: "The sweet red seed stalks on female tōtara are autumn food for kererū.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes pick over the small red stalks in flocks.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "dacrycarpus-dacrydioides": [
      { wildlifeId: "kereru", support: "berries", note: "A fruiting kahikatea stand feeds kererū for weeks in autumn.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "hoheria-populnea": [
      { wildlifeId: "puriri-moth", support: "host", note: "Pūriri moth caterpillars also tunnel into houhere, and lacebark is small enough for a garden where a pūriri isn't.", basis: "Plant-SyNZ (Manaaki Whenua – Landcare Research), reliability 10." },
    ],
    "cordyline-australis": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes strip the small pale berries of cabbage trees in late summer.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "nz-native-bees", support: "nectar", note: "The scented flower sprays in late spring hum with native bees.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "kunzea-robusta": [
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Kānuka in flower is a mainstay for New Zealand's native bees, which gather its pollen in early summer.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "leptospermum-scoparium": [
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Mānuka is one of the native bees' main pollen plants, from spring into summer.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "coprosma-repens": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes take taupata's orange berries in autumn.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "coprosma-robusta": [
      { wildlifeId: "tauhou", support: "berries", note: "Karamū's heavy crops of orange berries are autumn food for silvereyes and other birds.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
      { wildlifeId: "kereru", support: "berries", note: "Kererū eat karamū berries too, and spread its seed.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "veronica-stricta": [
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Koromiko flowers all summer, and native bees work its spikes.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "melicytus-ramiflorus": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes eat the violet berries on the stems in autumn.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "piper-excelsum": [
      { wildlifeId: "kawakawa-looper", support: "host", reliance: "narrow", note: "The kawakawa looper's caterpillars feed almost only on kawakawa; the round holes in the leaves are theirs.", basis: "Manaaki Whenua – Landcare Research." },
      { wildlifeId: "kereru", support: "berries", note: "Kererū eat the ripe orange fruit spikes in summer.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "phormium-tenax": [
      { wildlifeId: "tui", support: "nectar", note: "Harakeke flowers are dark red tubes full of nectar; a tūī comes away with a forehead dusted orange with its pollen.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "phormium-cookianum": [
      { wildlifeId: "tui", support: "nectar", note: "Tūī feed on the greenish flowers of mountain flax the way they do on harakeke.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand)." },
    ],
    "muehlenbeckia-complexa": [
      { wildlifeId: "nz-coppers", support: "host", reliance: "narrow", note: "Pōhuehue and its relatives are the coppers' native caterpillar food plants, so a sunny bank of it is where they breed.", basis: "Manaaki Whenua – Landcare Research." },
    ],
    "rhopalostylis-sapida": [
      { wildlifeId: "kereru", support: "berries", note: "Kererū feast on the bright red nīkau berries, which ripen a few at a time over many months.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand); GloBI — Peralta et al. 2020 New Zealand frugivory data." },
    ],
    "pittosporum-tenuifolium": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes pick the sticky black seeds from kōhūhū's split capsules.", basis: "GloBI — Williams & Karl 1996 (NZ Journal of Ecology), via Fricke & Svenning 2020 frugivory network." },
      { wildlifeId: "nz-leafrollers", support: "host", note: "Kōhūhū leaves feed several native leafroller caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "pittosporum-crassifolium": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes take the sticky seeds from karo's open capsules.", basis: "GloBI — Anderson 1997, via Peralta et al. 2020 New Zealand frugivory data." },
      { wildlifeId: "nz-leafrollers", support: "host", note: "Native leafroller caterpillars feed on karo leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "brachyglottis-repanda": [
      { wildlifeId: "magpie-moth", support: "host", note: "Rangiora is a groundsel relative, and magpie moth caterpillars eat its big soft leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "geniostoma-ligustrifolium": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes eat hangehange's small seeds with their sticky orange coat.", basis: "GloBI — Garcia et al. 2014 and Burns 2013, via Fricke & Svenning 2020 frugivory network." },
      { wildlifeId: "tui", support: "berries", note: "Tūī eat the seeds too, and spread them through the bush.", basis: "GloBI — Garcia et al. 2014 and Burns 2013, via Fricke & Svenning 2020 frugivory network." },
      { wildlifeId: "nz-leafrollers", support: "host", note: "Leafroller caterpillars feed on hangehange leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "veronica-macrocarpa": [
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Native bees work the long white spikes of this hebe.", basis: "Manaaki Whenua – Landcare Research." },
      { wildlifeId: "nz-coppers", support: "nectar", note: "Common coppers come to hebe flowers for nectar.", basis: "GloBI — Primack 1983, Insect pollination in the New Zealand mountain flora (NZ Journal of Botany), via Web of Life." },
      { wildlifeId: "nz-leafrollers", support: "host", note: "Hebe leaves feed several native leafroller caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "corokia-buddleioides": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "A native leafroller raises its caterpillars on korokio.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "ozothamnus-leptophyllus": [
      { wildlifeId: "nz-coppers", support: "nectar", note: "Coppers feed on tauhinu's tiny white flowers in early summer.", basis: "GloBI — Primack 1983, Insect pollination in the New Zealand mountain flora (NZ Journal of Botany), via Web of Life." },
      { wildlifeId: "nz-native-bees", support: "nectar", note: "Native bees gather pollen from tauhinu.", basis: "GloBI — Primack 1983, Insect pollination in the New Zealand mountain flora (NZ Journal of Botany), via Web of Life." },
      { wildlifeId: "nz-leafrollers", support: "host", note: "Leafroller caterpillars feed among tauhinu's small leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "astelia-banksii": [
      { wildlifeId: "kereru", support: "berries", note: "Kererū eat the coastal astelia's green-to-purple berries.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand); GloBI — McEwen 1978 (NZ Journal of Ecology), via Peralta et al. 2020." },
    ],
    "arthropodium-cirratum": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "Rengarenga leaves feed native leafroller caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "senecio-lautus": [
      { wildlifeId: "magpie-moth", support: "host", note: "Shore groundsel is a magpie moth food plant; the hairy caterpillars feed in plain sight.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "clematis-paniculata": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "Leafroller caterpillars feed on puawānanga leaves.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "passiflora-tetrandra": [
      { wildlifeId: "tauhou", support: "berries", note: "Silvereyes open the orange fruit for its red-coated seeds.", basis: "GloBI — Wyman 2017, via Fricke & Svenning 2020 frugivory network." },
      { wildlifeId: "tui", support: "berries", note: "Tūī eat the pulp and seeds of kōhia fruit.", basis: "GloBI — Wyman 2017, via Fricke & Svenning 2020 frugivory network." },
      { wildlifeId: "kereru", support: "berries", note: "Kererū eat kōhia fruit too.", basis: "New Zealand Birds Online (Te Papa; Birds New Zealand); GloBI — McEwen 1978 (NZ Journal of Ecology), via Peralta et al. 2020." },
    ],
    "parsonsia-heterophylla": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "Kaihua leaves feed native leafroller caterpillars.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "cyathea-dealbata": [
      { wildlifeId: "fern-loopers", support: "host", note: "Fern looper caterpillars eat ponga fronds.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "cyathea-medullaris": [
      { wildlifeId: "fern-loopers", support: "host", note: "Fern looper caterpillars feed on mamaku's huge fronds.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "dicksonia-squarrosa": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "Leafroller caterpillars feed on whekī fronds.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "dicksonia-fibrosa": [
      { wildlifeId: "nz-leafrollers", support: "host", note: "Leafroller caterpillars feed on whekī-ponga fronds.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "blechnum-novae-zelandiae": [
      { wildlifeId: "fern-loopers", support: "host", note: "Kiokio is a fern looper food plant.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
    "microsorum-pustulatum": [
      { wildlifeId: "fern-loopers", support: "host", note: "Fern looper caterpillars eat hound's tongue fern.", basis: "Plant-SyNZ, Manaaki Whenua – Landcare Research (records for the genus)." },
    ],
  },
  "central-texas": {
    "quercus-fusiformis": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Live oak acorns are sweet and drop every autumn, feeding jays, turkeys and woodpeckers through winter.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Deer, squirrels and raccoons fatten on the acorns; in the Hill Country they are a mainstay of the whitetail's autumn.", basis: "Texas Parks and Wildlife; USDA Silvics of North America." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "Live oak leaves feed Horace's duskywing caterpillars, which hide in folded leaf shelters.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "quercus-buckleyi": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Small bitter acorns that jays and woodpeckers cache and come back to all winter.", basis: "Cornell Lab; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "One of the oaks Horace's duskywing raises its caterpillars on.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "quercus-shumardii": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "A heavy acorn crop most years, worked by jays, turkeys and red-headed woodpeckers.", basis: "USDA Silvics of North America; Cornell Lab." },
      { wildlifeId: "horaces-duskywing", support: "host", note: "Shumard oak leaves are food for Horace's duskywing caterpillars.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "quercus-macrocarpa": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "The biggest acorns on the continent, a feast for deer and squirrels in autumn.", basis: "USDA Silvics of North America." },
    ],
    "quercus-stellata": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Sweet white-oak acorns that deer and squirrels take first, before the bitter red-oak ones.", basis: "USDA Silvics of North America; Texas Parks and Wildlife." },
    ],
    "carya-illinoinensis": [
      { wildlifeId: "luna-moth", support: "host", note: "Pecan and its hickory kin are among the luna moth's main caterpillar trees in Texas.", basis: "NWF Native Plant Finder / Tallamy; BAMONA." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels, raccoons and foxes harvest the nuts before you can — plant one for them.", basis: "Texas A&M AgriLife Extension; USDA Silvics of North America." },
    ],
    "ulmus-crassifolia": [
      { wildlifeId: "mourning-cloak", support: "host", note: "Elms are core mourning cloak hosts; the caterpillars feed in groups on the leaves.", basis: "NWF Native Plant Finder; BAMONA." },
    ],
    "celtis-laevigata": [
      { wildlifeId: "american-snout", support: "host", reliance: "sole", note: "Hackberries are the snout's only caterpillar food — no hackberry, no snouts.", basis: "BAMONA; Texas Parks and Wildlife." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Hackberry is one of the trees mourning cloak caterpillars grow up on.", basis: "BAMONA." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwing flocks strip the sweet berries in winter.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, robins and cardinals eat the berries from autumn until they are gone.", basis: "Cornell Lab; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "hackberry-emperor", support: "host", reliance: "narrow", note: "Hackberry is the only tree its caterpillars eat, and sugar hackberry is the one in Hill Country creek bottoms.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
      { wildlifeId: "tawny-emperor", support: "host", reliance: "narrow", note: "Tawny emperor caterpillars feed only on hackberries; they winter as tiny caterpillars in the fallen leaves below.", basis: "HOSTS, the world Lepidoptera hostplant database (NHM); BAMONA." },
    ],
    "salix-nigra": [
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Willows are the viceroy's main caterpillar food, so creekside black willow is where they breed.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow is a core mourning cloak host.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Catkins in March give early solitary bees their first pollen of the year.", basis: "Xerces Society." },
    ],
    "prunus-mexicana": [
      { wildlifeId: "mason-bees", support: "nectar", note: "White blossom in February, when early solitary bees have almost nothing else.", basis: "Xerces Society; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "Foxes, raccoons and deer take the fallen plums in late summer.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "cercis-canadensis": [
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", reliance: "narrow", note: "The pea-shaped flowers open to bees heavy enough to push them apart, and carpenter bees are first in line.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Among the first flowers of the year for small native bees.", basis: "Xerces Society; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "henrys-elfin", support: "host", note: "Henry's elfin caterpillars eat redbud's flowers and young pods in early spring.", basis: "BAMONA." },
    ],
    "ungnadia-speciosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flowers in March that bumble bee queens visit as they start their nests.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
      { wildlifeId: "henrys-elfin", support: "host", note: "In the Hill Country, Henry's elfin lays its eggs on Mexican buckeye flowers.", basis: "BAMONA." },
    ],
    "dermatophyllum-secundiflorum": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The grape-scented flowers are one of the first big meals for bumble bees in late winter.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "ilex-decidua": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Red berries that hang on the bare branches into late winter, when waxwings arrive hungry.", basis: "Cornell Lab; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, bluebirds and mockingbirds come for the berries once other fruit is gone.", basis: "Cornell Lab." },
    ],
    "ilex-vomitoria": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Winter berries that waxwing flocks strip in a morning.", basis: "Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "shelter", note: "Dense evergreen cover where cardinals and mockingbirds nest and roost.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
    ],
    "cornus-drummondii": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "White berries in late summer, eaten by dozens of songbirds fuelling up for migration.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Waxwings take dogwood fruit wherever they find it.", basis: "Cornell Lab." },
    ],
    "callicarpa-americana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Purple berries eaten by mockingbirds, thrashers and cardinals in autumn and winter.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
    ],
    "berberis-trifoliolata": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Yellow flowers in February, among the first pollen of the Hill Country year.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The red berries feed mockingbirds and other birds in early summer, under spiny cover.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "ehretia-anacua": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds, cardinals and thrashers strip the orange fruit as it ripens.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "rhus-lanceolata": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Red seed clusters that stay on through winter, a reserve birds come back to when food is short.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "Red-banded hairstreak caterpillars eat the fallen sumac leaves on the ground below.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Blue berries on red stems in autumn, taken by thrushes, mockingbirds and woodpeckers.", basis: "Cornell Lab." },
    ],
    "cephalanthus-occidentalis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The pincushion flowers hum with bumble bees through the heat of summer.", basis: "Xerces Society." },
    ],
    "asclepias-asperula": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "The milkweed monarchs lay on as they arrive from Mexico each spring; Texas raises the first generation of the year.", basis: "Monarch Watch; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "queen-butterfly", support: "host", reliance: "sole", note: "Queen caterpillars also feed only on milkweeds, this one included.", basis: "BAMONA." },
    ],
    "helianthus-maximiliani": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Sunflower specialist bees collect only this family's pollen, and autumn sunflowers are a main source.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
      { wildlifeId: "monarch", support: "nectar", note: "In flower as monarchs funnel south through Texas in October.", basis: "Monarch Watch; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches hang on the heads in winter to pick out the seed.", basis: "Cornell Lab." },
      { wildlifeId: "bordered-patch", support: "host", note: "Bordered patch caterpillars feed in groups on sunflower leaves, this one included.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "verbesina-virginica": [
      { wildlifeId: "monarch", support: "nectar", note: "One of the main nectar stops for monarchs crossing Texas in autumn.", basis: "Monarch Watch; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "queen-butterfly", support: "nectar", note: "Queens crowd the white flower heads alongside the monarchs.", basis: "Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "bordered-patch", support: "host", note: "Frostweed is a crownbeard, one of the sunflower kin bordered patch caterpillars eat.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "symphyotrichum-oblongifolium": [
      { wildlifeId: "monarch", support: "nectar", note: "Late-autumn flowers for the last monarchs heading south.", basis: "Monarch Watch; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work it until the first freeze.", basis: "Xerces Society." },
    ],
    "solidago-nemoralis": [
      { wildlifeId: "monarch", support: "nectar", note: "Goldenrod is a classic autumn nectar plant on the monarch's route.", basis: "Monarch Watch; Xerces Society." },
    ],
    "conoclinium-coelestinum": [
      { wildlifeId: "queen-butterfly", support: "nectar", note: "Queens are drawn to mistflowers more than to almost anything else.", basis: "BAMONA; Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "monarch", support: "nectar", note: "Autumn flowers on the monarchs' route south.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "passiflora-incarnata": [
      { wildlifeId: "gulf-fritillary", support: "host", reliance: "narrow", note: "Gulf fritillary caterpillars eat only passionflower vines, and maypop is the native one here.", basis: "BAMONA; Lady Bird Johnson Wildflower Center." },
    ],
    "phyla-nodiflora": [
      { wildlifeId: "phaon-crescent", support: "host", reliance: "sole", note: "Frogfruit is the phaon crescent's caterpillar food — leave a patch unmown and they will find it.", basis: "BAMONA." },
    ],
    "malvaviscus-arboreus": [
      { wildlifeId: "black-chinned-hummingbird", support: "nectar", note: "Red flowers from May to frost, right through the nesting season.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "A fuel stop for ruby-throats passing through in autumn.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "salvia-greggii": [
      { wildlifeId: "black-chinned-hummingbird", support: "nectar", note: "Flowers spring to frost, so a nesting pair has food all season.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
    ],
    "salvia-roemeriana": [
      { wildlifeId: "black-chinned-hummingbird", support: "nectar", note: "Red flowers in shade, timed for the hummingbirds' return in spring.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "anisacanthus-quadrifidus": [
      { wildlifeId: "black-chinned-hummingbird", support: "nectar", note: "Orange tubes all through the hottest months, when little else is flowering.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "bignonia-capreolata": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Trumpets that open as ruby-throats arrive back from Mexico in March.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab." },
    ],
    "callirhoe-involucrata": [
      { wildlifeId: "mallow-specialist-bees", support: "nectar", reliance: "narrow", note: "Winecup is one of the mallows whose pollen these specialist bees collect, and they sleep in the closed cups.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S.; Xerces Society." },
    ],
    "pavonia-lasiopetala": [
      { wildlifeId: "mallow-specialist-bees", support: "nectar", reliance: "narrow", note: "A mallow, so its pollen feeds the mallow specialists.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
    ],
    "lupinus-texensis": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees are heavy enough to trip the flowers open and reach the pollen.", basis: "Xerces Society; Lady Bird Johnson Wildflower Center." },
    ],
    "monarda-citriodora": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees and many smaller bees work the tiered flowers all day.", basis: "Xerces Society." },
    ],
    "penstemon-cobaea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The wide bells are sized for bumble bees, which climb all the way in.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
    ],
    "schizachyrium-scoparium": [
      { wildlifeId: "grass-skippers", support: "host", note: "Several skippers raise their caterpillars on little bluestem's leaves.", basis: "BAMONA; Xerces Society." },
    ],
    "bouteloua-curtipendula": [
      { wildlifeId: "grass-skippers", support: "host", note: "A host for several prairie skippers.", basis: "BAMONA." },
    ],
    "chasmanthium-latifolium": [
      { wildlifeId: "grass-skippers", support: "host", note: "Shade-loving skippers lay on its broad leaves along creeks.", basis: "BAMONA." },
    ],
    "prosopis-glandulosa": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Sweet pods that deer, coyotes and other mammals eat in summer.", basis: "USDA PLANTS; Texas Parks and Wildlife." },
      { wildlifeId: "ceraunus-blue", support: "host", note: "Ceraunus blue caterpillars eat mesquite's flower buds and young pods.", basis: "GloBI — Ferrer-Paris et al. 2013, butterfly host plants; BAMONA." },
    ],
    "diospyros-texana": [
      { wildlifeId: "henrys-elfin", support: "host", note: "One of the Hill Country hosts of Henry's elfin, whose caterpillars eat the flowers and young fruit.", basis: "BAMONA." },
      { wildlifeId: "acorn-mammals", support: "berries", note: "The black fruit is sweet when ripe, and deer, raccoons, foxes and coyotes eat what falls.", basis: "Lady Bird Johnson Wildflower Center." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Mockingbirds and other birds take the fruit off the branch in late summer.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "rhus-virens": [
      { wildlifeId: "red-banded-hairstreak", support: "host", note: "A sumac, so its dropped leaves feed red-banded hairstreak caterpillars in the litter underneath.", basis: "BAMONA; Wagner, Caterpillars of Eastern North America." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small red fruit in fall that birds pick off the evergreen branches.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "sapindus-drummondii": [
      { wildlifeId: "soapberry-hairstreak", support: "host", reliance: "sole", note: "Western soapberry is the soapberry hairstreak's only caterpillar food.", basis: "BAMONA." },
    ],
    "taxodium-distichum": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Squirrels pull apart the round cones for the seeds inside.", basis: "USDA Silvics of North America." },
    ],
    "platanus-occidentalis": [
      { wildlifeId: "american-goldfinch", support: "seeds", note: "The seed balls hang on all winter, and goldfinches pick them apart.", basis: "USDA Silvics of North America; Cornell Lab of Ornithology." },
    ],
    "viburnum-rufidulum": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Blue-black fruit in fall, eaten by thrushes, mockingbirds and other birds.", basis: "Lady Bird Johnson Wildflower Center; Cornell Lab of Ornithology." },
    ],
    "leucophyllum-frutescens": [
      { wildlifeId: "theona-checkerspot", support: "host", reliance: "narrow", note: "Cenizo is one of the theona checkerspot's few caterpillar foods.", basis: "BAMONA." },
    ],
    "lantana-urticoides": [
      { wildlifeId: "monarch", support: "nectar", note: "Flowers right through fall, when monarchs cross Texas heading south.", basis: "Lady Bird Johnson Wildflower Center; Monarch Watch." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Birds eat the shiny black fruit — which is poisonous to people.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "frangula-caroliniana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "The berries turn red, then black, and birds eat them at both stages.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "engelmannia-peristenia": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A spring daisy whose pollen feeds bees that collect only from the sunflower family.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S.; Lady Bird Johnson Wildflower Center." },
    ],
    "salvia-farinacea": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Bumble bees work the blue spikes from spring to frost.", basis: "Lady Bird Johnson Wildflower Center; Xerces Society." },
      { wildlifeId: "lesser-goldfinch", support: "seeds", note: "Lesser goldfinches cling to the spent stems to pick out the seed.", basis: "GloBI — iNaturalist observations; Cornell Lab of Ornithology." },
    ],
    "ratibida-columnifera": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A coneflower, so its pollen feeds the bees that raise their young only on the sunflower family.", basis: "Fowler & Droege, Pollen Specialist Bees of the U.S." },
    ],
    "glandularia-bipinnatifida": [
      { wildlifeId: "grass-skippers", support: "nectar", note: "Skippers sip from the flat purple flower heads from spring into summer.", basis: "Lady Bird Johnson Wildflower Center." },
    ],
    "sorghastrum-nutans": [
      { wildlifeId: "grass-skippers", support: "host", note: "Indiangrass is a caterpillar food for several prairie skippers.", basis: "BAMONA; Xerces Society." },
    ],
    "bouteloua-dactyloides": [
      { wildlifeId: "grass-skippers", support: "host", note: "Buffalograss lawns can raise skippers, including the green skipper.", basis: "BAMONA." },
    ],
  },
};
