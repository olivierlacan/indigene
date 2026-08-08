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
      "A small jewel — velvet black with iridescent blue flecks and a scarlet belly — once thought extinct in Florida. It came back with its only host plant, the coontie. Plant coontie and you are quite literally rebuilding this butterfly.",
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
      "A dark swallowtail dusted blue-green. Its caterpillar is one of the strangest things in an eastern garden: bright green with two huge false eyespots, hiding by day in a leaf it has rolled into a tube.",
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
      "A black butterfly with a white band and orange wingtips, and the habit of coming out to meet you — it will chase a bird, or a person, off its patch of streamside and then glide straight back to the same twig.",
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
      "The small orange skippers that dart around a meadow, and the soft brown wood nymphs and ringlets that drift through it. Their caterpillars eat nothing but grass, and they spend the winter tucked down inside a native bunchgrass — which is why a mown lawn has none of them.",
    native: true,
    nativeBasis:
      "Native grass-feeding butterflies (Hesperiidae and the satyr group of Nymphalidae), on both continents. BAMONA; Xerces Society; INPN (MNHN); European butterfly foodplant checklist (Dryad).",
  },
  {
    id: "greater-fritillaries",
    common: "Fritillaries & silverspots",
    latin: "Argynnis spp.",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The big orange butterflies of western meadows, their undersides spangled with silver. Every one of them grows up on violets and nothing else — and the female lays in late summer, on dry ground where the violets have already died back, for caterpillars that sleep out the winter before they eat.",
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
      "A small grey-brown butterfly, easy to walk straight past, that flies in the first warm weeks of spring around rock outcrops, road cuts and bluffs. Its caterpillars eat native stonecrop and essentially nothing else, so it lives exactly where the stonecrop lives — a skin of soil over rock — and nowhere in between.",
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
    native: true,
    nativeBasis:
      "Native western blues and hairstreaks (acmon blue, Sheridan's green hairstreak and their relatives). Xerces Society; BAMONA.",
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
    nativeBasis: "Native to North America and nearly everywhere else. BAMONA; Xerces Society.",
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
    nativeBasis: "Native across North America. BAMONA; Xerces Society.",
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
      "A big woodland butterfly whose males burn electric purple from one angle and plain brown from the next. It spends its days in the crowns of the tallest trees and ignores flowers completely, coming down for damp ground and oozing sap. Its caterpillar winters flat against a sallow twig, the exact colour of the bark.",
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
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
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
    id: "comma",
    common: "Comma butterfly",
    latin: "Polygonia c-album",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Ragged-edged and orange, with a small white comma mark underneath. It winters as an adult on a twig, where the torn outline makes it a dead leaf. Its caterpillars grow up on hops, nettles and elms.",
    native: true,
    nativeBasis: "Native across Europe, including all of metropolitan France. INPN (MNHN); European butterfly foodplant checklist (Dryad).",
    inat: { name: "Polygonia c-album", iconic: "Insecta" },
  },
  {
    id: "common-blue",
    common: "Common blue",
    latin: "Polyommatus icarus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The small violet-blue butterfly of every French meadow and verge — the male bright blue, the female brown with orange spots. Its caterpillars eat bird's-foot trefoil and its relatives, and ants often guard them for the sweet drops they give off.",
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
      "Europe's smallest butterfly — a sooty-brown thing the size of a fingernail, dusted with blue. Its caterpillars live inside the flower heads of kidney vetch, eating the developing seeds, and they can use no other plant.",
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
      "A little butterfly the colour of a new coin — forewings burnished orange, edged in dark brown. It picks one warm stone and comes back to it all afternoon, launching at anything that flies over. Its caterpillars eat sorrels and docks, so it belongs to rough corners rather than tidy beds.",
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
      "The only green butterfly in Europe — and it never shows you the top of its wings. It rests with them shut, and the bright leaf-green underside makes it disappear against a shrub the instant it lands. Look on a sunny heath in April.",
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
      "The largest moth in France — pink-and-black barred, the size of a palm — that flies at dusk and hovers at scented flowers. Its caterpillar is just as startling: a fat bright-green thing with lilac stripes and a horn on its tail, grown fat on privet.",
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
      "The commonest big hawk-moth in France, and the strangest at rest: it holds its hindwings out in front of the forewings. A moth on a wall reads as a grey dead leaf put together wrong. The adult never eats: everything it needs it took in as a caterpillar, off poplar and willow leaves.",
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
      "Pink and olive-green, like something from a much warmer country, hovering at honeysuckle after dark. The caterpillar is where the name comes from: a fat grey-brown thing as long as a finger, with a trunk-like snout it pulls in when touched — which swells four eyespots and makes it a small snake.",
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
      "The heathland's silk moth — soft grey and pink, with a big eyespot on each of its four wings. The male flies fast in the April sunshine on feathered antennae that pick up a female's scent a kilometre away; she flies only at night.",
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
    native: true,
    nativeBasis: "Native bumble bees (Bombus) — unlike the introduced honey bee. Xerces Society; USGS Native Bee Inventory.",
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
    native: true,
    nativeBasis: "Native solitary bees. Fowler & Droege, Pollen Specialist Bees; USGS Native Bee Inventory.",
  },
  {
    id: "mason-bees",
    common: "Mason & mining bees",
    latin: "Osmia, Andrena spp.",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Gentle, solitary early-spring bees — superb fruit pollinators — that emerge when the first native shrubs bloom. An early flower like red-flowering currant or willow is a lifeline the week they wake up.",
    native: true,
    nativeBasis: "Native Osmia and Andrena. Xerces Society; USGS Native Bee Inventory.",
  },
  {
    id: "eastern-carpenter-bee",
    common: "Eastern carpenter bee",
    latin: "Xylocopa virginica",
    kind: "bee",
    icon: "🐝",
    blurb:
      "The big shiny-backed bee that looks like a bumble bee with a bald patch. It nests in dead wood rather than the ground, and it is strong enough to force open flowers most bees can't — or, when a flower is too deep even for it, to bite a hole in the side and drink through that.",
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
    id: "annas-rufous-hummingbird",
    common: "Anna's & rufous hummingbirds",
    latin: "Calypte anna, Selasphorus rufus",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The West's garden hummingbirds. The rufous times its migration to native currants coming into bloom, so an early red flower is fuel arriving when it's needed.",
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
      "A grey scrap of a bird, barely heavier than two paperclips, that travels in chattering flocks of twenty and works a shrub over from the inside. Its nest is the strangest thing in a Californian garden: a soft hanging sock of lichen and spider silk, a foot long, that takes the pair a month to build.",
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
      "A tiny grey-and-brown nuthatch that squeaks like a rubber duck and lives its whole life in southern pines. It is one of the very few birds that uses a tool — it will pick up a flake of bark and lever other bark off with it to get at the insects underneath.",
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
    native: true,
    nativeBasis: "Native birds (blue jay, California scrub-jay, acorn woodpecker, wild turkey). Cornell Lab of Ornithology.",
  },
  {
    id: "berry-songbirds",
    common: "Mockingbirds, cardinals & thrushes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The everyday songbirds that raise families on insects and then switch to fruit — beautyberry, elderberry, toyon, holly — to fatten up and get through the leaner months.",
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
      "The plump grey bird with a teardrop plume nodding off its forehead, running along the ground in a family party rather than flying. It lives in the bottom three feet of the world: low dense cover to hide in, bare ground to dust-bathe in, seeds within walking distance.",
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
      "A tiny grey bird with a long black tail and a call like a kitten mewing, which lives in coastal sage scrub and nowhere else. It doesn't migrate, so it needs that habitat every day of its life — and most of the scrub is now houses.",
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
    native: true,
    nativeBasis: "Native European birds (blackcap, Sardinian warbler, garden warbler, robin). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    id: "conifer-seed-finches",
    common: "Crossbills, siskins & redpolls",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The finches that live on tree seed right through the winter — crossbills, siskins and redpolls. The crossbill is the specialist: its beak crosses at the tip, a tool for prising a closed cone apart. The others take the smaller seed of hemlock, alder and birch.",
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
      "The pink-and-grey crow with a patch of barred sky-blue on its wing, heard screeching far more often than it is seen. Every autumn one jay buries a few thousand acorns, often hundreds of metres from the tree, and never comes back for them all — which is how oak woods climb hills.",
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
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Switchgrass raises the Delaware and broad-winged skippers — small orange butterflies whose caterpillars live in a tube of grass blade sewn together with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
    ],
    "parthenocissus-quinquefolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Virginia creeper's blue-black berries hang on their scarlet stalks long after the leaves have gone, and a waxwing flock will clear a wall of them in an afternoon.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature), Hale et al. 2024 (Phil. Trans. R. Soc. B); Cornell Lab." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Thrushes, catbirds and woodpeckers take them too, through the autumn and into the winter.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); Cornell Lab." },
    ],
    "fragaria-virginiana": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Wild strawberries are tiny and intensely sweet, and robins and thrushes get to almost all of them before anyone else does.", basis: "GloBI — Hurlbert et al. 2021 Avian Diet Database, Hale et al. 2024 (Phil. Trans. R. Soc. B); Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "White five-petalled flowers low to the ground, open from April, and among the first things a bumble bee queen can reach.", basis: "GloBI — Robertson 1929 flower visitors of Carlinville (via Miller); Xerces Society." },
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
      { wildlifeId: "viceroy", support: "host", reliance: "narrow", note: "Cherries are among the willows-and-poplars family the viceroy also uses as a caterpillar host.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer cherries are devoured by dozens of songbirds, from thrushes to catbirds.", basis: "Cornell Lab; LBJ Wildflower Center." },
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
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a hummingbird favorite.", basis: "LBJ Wildflower Center; Audubon." },
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
      { wildlifeId: "mason-bees", support: "nectar", note: "Blueberry flowers are buzz-pollinated; native mason and mining bees (and bumble bees) are their best pollinators.", basis: "Xerces Society; Fowler & Droege." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Summer berries feed catbirds, thrushes, and many other birds — if you leave them any.", basis: "Cornell Lab." },
    ],
    "lonicera-sempervirens": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Coral tubular flowers over a long season are one of the best hummingbird vines there is.", basis: "LBJ Wildflower Center; Audubon." },
    ],
    "corylus-americana": [
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Hazelnuts are sought out by squirrels, chipmunks, and jays in fall.", basis: "USDA PLANTS; Cornell Lab." },
    ],
  },

  pnw: {
    "quercus-garryana": [
      { wildlifeId: "lorquins-admiral", support: "shelter", note: "An oak in a Garry oak meadow is where a Lorquin's admiral sits to watch its patch, dropping off the branch to chase anything that flies through.", basis: "GloBI — iNaturalist observation records; BAMONA." },
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "Garry (Oregon white) oak is the sole larval host for the propertius duskywing — no oak, no butterfly.", basis: "Xerces Society; Washington NHP oak-prairie work." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Its acorns feed acorn woodpeckers, jays, and band-tailed pigeons in the West's oak country.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Oak mast is fall food for squirrels, deer, and other mammals.", basis: "USDA PLANTS." },
    ],
    "salix-scouleriana": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willows are a primary larval host for the western tiger swallowtail.", basis: "NWF Native Plant Finder; Xerces." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Willow catkins are one of the earliest, richest pollen sources for spring mason and mining bees.", basis: "Xerces Society." },
    ],
    "populus-trichocarpa": [
      { wildlifeId: "lorquins-admiral", support: "host", reliance: "narrow", note: "Cottonwood is Lorquin's admiral's caterpillar tree. The young larva looks like a bird dropping and overwinters rolled in a leaf it has fastened to the twig so it can't fall.", basis: "GloBI — iNaturalist observation records carrying a larval life stage; BAMONA." },
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Cottonwood is a favored caterpillar tree for the western tiger swallowtail.", basis: "NWF Native Plant Finder." },
    ],
    "acer-macrophyllum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Bigleaf maple is among the trees the western tiger swallowtail's caterpillars use.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its heavy early flower clusters feed newly emerged bees before most plants bloom.", basis: "Xerces Society." },
    ],
    "holodiscus-discolor": [
      { wildlifeId: "variable-checkerspot", support: "nectar", note: "Ocean spray's cream plumes are a checkerspot's refuelling stop through the dry part of summer.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
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
    ],
    "gaultheria-shallon": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Salal's dark berries are eaten by robins, thrushes, and grouse — and its flowers feed bees.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "berberis-aquifolium": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Bright yellow late-winter flowers are among the very first bee food of the year.", basis: "Xerces Society." },
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The blue \"grape\" berries feed waxwings, robins, and towhees.", basis: "USDA PLANTS; Cornell Lab." },
    ],
    "asclepias-speciosa": [
      { wildlifeId: "monarch", support: "host", reliance: "sole", note: "The West's common milkweed, and the only thing a monarch caterpillar can eat — the western monarch population has fallen far enough that every patch counts.", basis: "Xerces Society Western Monarch Count; USDA PLANTS." },
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
      { wildlifeId: "cedar-waxwing", support: "berries", note: "The June avalanche of scarlet berries is stripped by waxwings and band-tailed pigeons within days.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Tanagers, grosbeaks, and thrushes all crowd into a fruiting red elderberry.", basis: "Cornell Lab." },
    ],
    "vaccinium-ovatum": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Huckleberry flowers are buzz-pollinated — mason, mining, and bumble bees are what actually sets the fruit.", basis: "Xerces Society; Fowler & Droege." },
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
    ],
    "tsuga-heterophylla": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Hemlock cones are barely an inch long, so it is the small finches that get the most out of them — pine siskins work the drooping branch tips all winter, with chickadees following on behind.", basis: "Cornell Lab; USDA Silvics of North America." },
    ],
    "thuja-plicata": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Redcedar's little seed cones are fine work for siskins and other small finches, and the tree gives them the other half of what they need too: dense evergreen cover to sit out a wet winter in.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "arctostaphylos-uva-ursi": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink bell flowers in earliest spring feed emerging bumble bee queens and mason bees before much else is open.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Red berries hang on into winter for grouse, robins, and towhees when little else is left.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "viola-adunca": [
      { wildlifeId: "greater-fritillaries", support: "host", reliance: "sole", note: "Violets are the only thing a greater fritillary caterpillar can eat — the hydaspe, the zerene, the great spangled, and the threatened Oregon silverspot on the coast. And the way they use the plant is unusual enough to change how you garden for them: the female lays in late summer on dry ground beside violets that have already withered, so she is not choosing a plant in leaf, she is choosing a place she has found violets before. The caterpillar hatches, eats nothing, and spends the whole winter in the litter — then goes looking for violet leaves the following spring. So it is not enough for the patch to flower once. It has to still be there in April, in the same square metre.", basis: "Xerces Society; BAMONA; US Fish & Wildlife Service Oregon silverspot recovery plan." },
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
    "fragaria-chiloensis": [
      { wildlifeId: "mason-bees", support: "nectar", note: "White spring flowers low to the ground, opening with the first solitary bees and easy for a small one to work.", basis: "Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Small deep-red strawberries in summer for towhees, robins, and sparrows — and for whoever gets there first.", basis: "Cornell Lab; USDA PLANTS." },
    ],
  },

  "ca-south-coast": {
    "artemisia-douglasiana": [
      { wildlifeId: "american-lady", support: "host", note: "Mugwort is one of the silver-leaved plants the American lady's caterpillars grow up on, wrapping themselves in the leaves and their own silk to hide while they eat.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), NHM Interactions Bank, Ferrer-Paris et al. 2013; BAMONA." },
    ],
    "quercus-agrifolia": [
      { wildlifeId: "bushtit", support: "shelter", note: "Coast live oak is the bushtit's tree above all others: it feeds in the canopy and hangs its long sock of a nest from an outer branch.", basis: "GloBI — iNaturalist observation records; Cornell Lab." },
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "In southern California the propertius duskywing lays on coast live oak and on nothing else — the caterpillars overwinter rolled up in the fallen leaves, which is a good reason to leave the litter under the tree.", basis: "Xerces Society; BAMONA." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Acorn woodpeckers drill storage granaries full of them and California scrub-jays bury thousands each autumn, planting the next generation of oaks as they forget where.", basis: "Cornell Lab; UC Oak Woodland Management." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Ground squirrels, dusky-footed woodrats and mule deer all live on the acorn crop through the autumn.", basis: "USDA PLANTS; UC ANR." },
    ],
    "salix-lasiolepis": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willow is the main caterpillar tree of the big yellow swallowtail you see patrolling a creek in summer.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Mourning cloak caterpillars feed together in a spiny black huddle on willow — and the adults overwinter here rather than migrating, so they are the first butterfly of the year.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Willow catkins in February are the richest early pollen in the region, opening exactly when the solitary bees emerge.", basis: "Xerces Society." },
    ],
    "populus-fremontii": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Cottonwood is a favoured caterpillar tree for the western tiger swallowtail.", basis: "BAMONA." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Cottonwood and willow are what mourning cloak caterpillars grow up on along a southwestern creek.", basis: "BAMONA." },
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
    ],
    "eriogonum-parvifolium": [
      { wildlifeId: "buckwheat-butterflies", support: "host", reliance: "narrow", note: "The El Segundo blue lays its eggs in these flower heads and nowhere else — it survives on a few dune remnants beside Los Angeles airport, and this plant is the whole of its habitat.", basis: "US Fish & Wildlife Service (El Segundo blue recovery); Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long summer-to-autumn bloom on bare sand, where almost nothing else is flowering.", basis: "Xerces Society." },
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
      { wildlifeId: "california-yucca-moth", support: "host", reliance: "sole", note: "The completest partnership in this list: the moth pollinates the yucca deliberately and lays its eggs in the flower, and its caterpillars eat some of the seeds that result. Neither species has another partner — no yucca, no moth, and no moth, no yucca seed.", basis: "Xerces Society; the yucca-moth literature (Pellmyr)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The ten-foot flower spike also draws bees, beetles and hummingbirds, though only the moth actually pollinates it.", basis: "Xerces Society." },
    ],
    "malacothamnus-fasciculatus": [
      { wildlifeId: "painted-lady", support: "host", reliance: "narrow", note: "Mallows are one of the painted lady's main caterpillar plants — the butterfly that arrives in millions across southern California in the spring after a wet winter.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Open pink mallow flowers over months, worked by bumble bees and by the native bees that specialise on the mallow family.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
    ],
    "acmispon-glaber": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Small yellow pea flowers from March into August — one of the longest bloom seasons in the list, at the season bees most need it.", basis: "Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its early flowers open while the solitary bees are still provisioning nests.", basis: "Xerces Society." },
    ],
    "lupinus-albifrons": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lupine flower has to be forced open by a bee heavy enough to trip it, which is why bumble bees and carpenter bees are the ones you see on it.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "painted-lady", support: "host", note: "Lupines are among the painted lady's caterpillar plants alongside the mallows and thistles.", basis: "BAMONA." },
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
      { wildlifeId: "eastern-carpenter-bee", support: "nectar", note: "A magnolia flower is an ancient design — no nectar guides, no landing platform, just a bowl of pollen. Big clumsy beetles and carpenter bees are exactly what it evolved for.", basis: "GloBI — National Database of Plant Pollinators (Center for Plant Conservation), iNaturalist observation records; UF/IFAS." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "The cone breaks open in autumn to hang its scarlet seeds out on threads, and grey and fox squirrels come for them.", basis: "GloBI — iNaturalist observation records; UF/IFAS." },
    ],
    "chionanthus-virginicus": [
      { wildlifeId: "cecropia-moth", support: "host", note: "Fringetree feeds the caterpillars of the big native sphinx and silk moths — the waved sphinx among them, whose larva is the colour of the leaf it sits under.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM); NWF Native Plant Finder." },
    ],
    "mimosa-strigillosa": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "Sunshine mimosa's pink powder-puffs sit flat on a lawn you can walk on, and the bumble bees work them all summer between mowings.", basis: "GloBI — iNaturalist observation records; UF/IFAS." },
      { wildlifeId: "grass-skippers", support: "nectar", note: "Fiery skippers and little yellows come down to it constantly — it is one of the few nectar plants that survives being walked over.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "tripsacum-dactyloides": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "Eastern gamagrass raises the byssus skipper — a big orange skipper whose caterpillar lives in a tube of leaf blade fastened with silk.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Grasses rarely feed bees, but gamagrass's big shedding anthers are worked by bumble bees for pollen.", basis: "GloBI — iNaturalist observation records; Xerces Society." },
    ],
    "quercus-virginiana": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Live oak acorns feed jays, turkeys, woodpeckers, and wintering ducks.", basis: "UF/IFAS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "A major mast tree for squirrels, deer, and other mammals.", basis: "UF/IFAS." },
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
  },

  "florida-south": {
    "serenoa-repens": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "sole", note: "The palmetto skipper's caterpillars eat saw palmetto and nothing else, living in a rolled-up section of frond. Clear the palmetto out of a scrub and the butterfly goes with it.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), Ferrer-Paris et al. 2013; Xerces Society." },
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "A saw palmetto in flower is one of the most-visited plants in Florida — dozens of native solitary bee species have been recorded on it, several of which are found on little else.", basis: "GloBI — GBIF-US bee occurrence datasets, iNaturalist observation records; Florida Native Plant Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The black autumn fruit feeds robins, mockingbirds, raccoons, foxes and bears in turn.", basis: "GloBI — Fricke & Svenning 2020 plant–frugivore network (Nature); UF/IFAS." },
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
      { wildlifeId: "atala", support: "host", reliance: "sole", note: "Coontie is the atala butterfly's only caterpillar plant — planting it is how the atala was brought back from near-extinction in South Florida.", basis: "UF/IFAS; Florida Museum of Natural History." },
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
    ],
    "helianthus-debilis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "Dune sunflower's pollen supports sunflower-family specialist bees along the coast.", basis: "Fowler & Droege; UF/IFAS." },
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
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "The purple emperor lays on sallows, and goat willow is the one it picks most often. Its caterpillar spends the winter pressed flat against a twig, coloured exactly like the bark, and turns green again with the leaves.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
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
    ],
    "deschampsia-cespitosa": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The browns and skippers that get up out of the grass as you walk a damp French meadow have eaten nothing but grass all their lives, and they spend the winter as caterpillars down inside a tussock like this one. A mown lawn offers them neither the food nor the shelter.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
    "lonicera-periclymenum": [
      { wildlifeId: "privet-hawk-moth", support: "nectar", note: "Honeysuckle opens at dusk and pours out scent for exactly one audience: the long-tongued hawk-moths that hover at it after dark.", basis: "INPN." },
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
      { wildlifeId: "hawfinch", support: "seeds", note: "Everything else takes the flesh of a wild cherry and drops the stone. The hawfinch does the opposite: it swallows the fruit for the stone, splits it with a bill that can put fifty kilos on the seam, and eats the kernel. Wild cherry in July is the classic place to find one — or rather, to find the halved stones scattered under the tree after it has gone.", basis: "LPO; INPN (MNHN)." },
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
      { wildlifeId: "mason-bees", support: "nectar", note: "Wild pear blossoms in early April, a good fortnight ahead of the hawthorn, filling the gap after the blackthorn is over — which is precisely when solitary bees are provisioning their nests.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The little pears are rock-hard and inedible until frost softens them, and that is the point: they come good in December, when the hedge has nothing left, and the thrushes and blackbirds come to the ground for them.", basis: "LPO; INPN." },
    ],
    "tilia-cordata": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lime in flower at the end of June is audible from the other side of the garden. It comes at the flattest moment of the year — the hedgerow blossom finished, the late flowers not started — and for a fortnight it is the biggest single meal available to bumble bees for miles.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
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
      { wildlifeId: "green-hairstreak", support: "host", note: "Broom is one of the green hairstreak's main caterpillar plants, along with gorse, dyer's greenweed and bilberry — Europe's only green butterfly, and one you find by watching a sunny scrubby bank rather than a flower bed.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Broom flowers are spring-loaded and stay shut until something heavy enough lands on them: a bumble bee trips the catch, the stamens fly up and slap pollen onto her back, and the flower is done. Worth crouching down to watch once.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The black pods crack open with an audible snap on a hot July afternoon and fling the seed a couple of metres — and linnets, which love a broomy bank, work the ground and the bushes for it.", basis: "LPO; INPN." },
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
      { wildlifeId: "bumble-bees", support: "nectar", note: "The flower tube of red clover is too deep for a honeybee to empty, so the nectar at the bottom belongs to the long-tongued bumble bees — the garden bumblebee and the common carder — which is one reason those species and this plant have declined together.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "plantago-lanceolata": [
      { wildlifeId: "glanville-fritillary", support: "host", reliance: "narrow", note: "Ribwort plantain is what the Glanville fritillary lays on, and it lays the whole batch in one place: the caterpillars hatch together, spin a silk tent over the plant, and spend the winter inside it as a huddle. On the first warm days of spring they come out and bask on top of the web in a black knot — the easiest way anyone ever finds them.", basis: "INPN (MNHN); Butterfly Conservation; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The little brown drumstick heads fill with seed from midsummer on, and goldfinches and linnets strip them — provided they are still standing, which in a fortnightly-mown lawn they never are.", basis: "LPO; INPN." },
    ],
    "rumex-acetosa": [
      { wildlifeId: "small-copper", support: "host", reliance: "sole", note: "The small copper lays on sorrels and docks and its caterpillars eat nothing else. They feed on the underside of a leaf and graze it down to a translucent window rather than chewing through, so the damage looks like a pale patch, not a hole — that is what to look for on a plant in a rough corner in June.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad); Butterfly Conservation." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "The rusty seed spikes hold together well into winter and finches take them apart standing on the stem.", basis: "LPO; INPN." },
    ],
    "galium-verum": [
      { wildlifeId: "elephant-hawk-moth", support: "host", reliance: "narrow", note: "Bedstraws are the elephant hawk-moth's main caterpillar plant, along with willowherb. What you find is the caterpillar, not the moth: a grey-brown thing the length of a finger that pulls its snout in when touched and swells up four eyespots, and does a convincing enough snake to make a grown adult step back.", basis: "INPN (MNHN)." },
      { wildlifeId: "hummingbird-hawk-moth", support: "host", reliance: "narrow", note: "The hummingbird hawk-moth — the day-flying one people report as a baby hummingbird — also raises its caterpillars on bedstraws. Growing lady's bedstraw is how you get the whole animal, not just an adult passing through on its way north.", basis: "INPN (MNHN)." },
    ],
    "centaurea-nigra": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the deepest nectar wells of any French wildflower, and it keeps going long after the meadow has been cut and the brambles are over — bumble bees, the meadow browns and the big fritillaries all work it into the autumn.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "A knapweed head gone over is a goldfinch's favourite thing in the garden — they hang off it upside down and take it apart all autumn. Cut the stems down in September and you have thrown the winter food away.", basis: "LPO; INPN." },
    ],
    "artemisia-vulgaris": [
      { wildlifeId: "mason-bees", support: "shelter", note: "Mugwort's flowers feed nobody — they are wind-pollinated and the row says so. What it gives is the dead stems: hollow, standing, and full of small solitary bees, ladybirds and lacewings spending the winter inside them. Which is the whole argument for leaving them up until spring instead of tidying in October.", basis: "INPN; Buglife; French pollinator surveys." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Goldfinches and linnets take the fine seed off the standing stems through the winter.", basis: "LPO; INPN." },
    ],
    "fragaria-vesca": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Open white flowers held just above the ground from April onwards — shallow enough that the smallest mining bees can work them, which most spring flowers are not.", basis: "INPN; French pollinator surveys; RHS Plants for Pollinators." },
    ],
    "festuca-rubra": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "The meadow brown, the gatekeeper, the ringlet, the marbled white and the skippers have all eaten nothing but grass their whole caterpillar lives, and fine grasses like this one are what they choose. They also spend the winter down inside the tussock — so a lawn mown every fortnight feeds none of them, and a lawn left to flower feeds all of them.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "goldfinches-linnets", support: "seeds", note: "Left to flower and seed, a fescue lawn feeds finches and buntings in late summer — the same patch of ground, doing two jobs, for the price of not cutting it.", basis: "LPO; INPN." },
    ],
    "poa-nemoralis": [
      { wildlifeId: "grass-skippers", support: "host", reliance: "narrow", note: "This is the shady half of the grass food web. The ringlet and the speckled wood — the brown butterfly patrolling the sun-flecks along a woodland path — lay on grasses like this, and their caterpillars feed at night down among the blades. Shade that is currently bare soil offers them nothing at all.", basis: "INPN (MNHN); European butterfly foodplant checklist (Dryad)." },
    ],
  },

  "france-continental": {
    "quercus-petraea": [
      { wildlifeId: "eurasian-jay", support: "seeds", note: "A jay carries acorns off in its throat and buries them one at a time, spread across the whole wood — thousands in an autumn. The ones it never comes back for are how an oak wood walks uphill.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
      { wildlifeId: "hazel-dormouse", support: "seeds", note: "Acorns are what a dormouse puts its winter weight on in October, in the last days before it curls up and sleeps for seven months.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
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
      { wildlifeId: "bumble-bees", support: "nectar", note: "A lime in flower in July is audible from across the garden — the whole crown hums, and it goes on for a fortnight.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), DoPI (Balfour et al. 2022); INPN." },
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
      { wildlifeId: "mason-bees", support: "nectar", reliance: "narrow", note: "The large scabious mining bee gathers pollen from field scabious and hardly anything else — you can tell one in flight by the lilac-grey load on its legs.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A pincushion of florets means a bee can feed a long time without flying, which is why scabious is worked so hard in August.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "glanville-fritillary", support: "nectar", note: "One of the fritillaries' favourite refuelling flowers in a dry meadow.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024)." },
    ],
    "clematis-vitalba": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Traveller's joy flowers late and holds its nectar in the open, so the small solitary bees still flying in September can all reach it.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), Redhead et al. 2018 plant–pollinator interactions (CEH); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Whole hedges of it come into flower at once, which is worth a great deal in the thin weeks before the ivy opens.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "crataegus-laevigata": [
      { wildlifeId: "winter-thrushes", support: "berries", note: "Red haws hold on into the hard weather for fieldfares, redwings and blackbirds.", basis: "LPO; INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Heavy May blossom feeds bumble bees, solitary bees, hoverflies and beetles all at once.", basis: "INPN; French pollinator surveys." },
    ],
    "ligustrum-vulgare": [
      { wildlifeId: "privet-hawk-moth", support: "host", reliance: "narrow", note: "Wild privet is the classic caterpillar plant of France's largest moth — the enormous green, lilac-striped larva grows up on these leaves.", basis: "INPN." },
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
    ],
  },

  "france-mediterranean": {
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
  },

  "france-alpine": {
    "acer-pseudoplatanus": [
      { wildlifeId: "bumble-bees", support: "nectar", reliance: "narrow", note: "Sycamore flowers in May at an altitude where there is almost nothing else out, and a single old tree can carry a whole valley's bumble bee queens through the week they most need it.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025), trophiCH (Reji Chacko et al. 2024), Redhead et al. 2018 (CEH); INPN." },
    ],
    "betula-pendula": [
      { wildlifeId: "emperor-moth", support: "host", note: "Birch is one of the emperor moth's caterpillar trees — the big green larva with its pink-and-black studs feeds openly on the leaves through the summer.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins shatter into thousands of tiny seeds, and redpolls hang upside-down in the twigs all winter working through them.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); LPO." },
    ],
    "salix-caprea": [
      { wildlifeId: "purple-emperor", support: "host", reliance: "narrow", note: "Goat willow is what a purple emperor caterpillar eats, and it is the reason a butterfly that spends its life in the tops of oaks needs a scruffy willow in the clearing below.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "mourning-cloak", support: "host", note: "Willow leaves feed the mourning cloak's spiny black caterpillars, which live in a group on one branch until they are nearly full-grown.", basis: "GloBI — HOSTS, the world Lepidoptera hostplant database (Robinson et al., NHM), trophiCH (Reji Chacko et al. 2024); INPN." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The grey catkins open before the snow has finished going, and they are the first pollen a bumble bee queen finds all year.", basis: "GloBI — trophiCH (Reji Chacko et al. 2024), Redhead et al. 2018 plant–pollinator interactions (CEH); INPN." },
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
      { wildlifeId: "bumble-bees", support: "nectar", note: "A globeflower never really opens — the petals close over the top into a lantern, and an insect has to push in through the gap. Bumble bees are among the few big enough to bother.", basis: "GloBI — EuPPollNet (Lanuza et al. 2025); INPN." },
    ],
    "dryas-octopetala": [
      { wildlifeId: "mason-bees", support: "nectar", note: "Mountain avens turns its white saucer to follow the sun, and the warm dish is where the high-altitude solitary bees sit out a cold morning.", basis: "GloBI — trophiCH food web for Switzerland (Reji Chacko et al. 2024); INPN." },
    ],
    "vaccinium-myrtillus": [
      { wildlifeId: "black-grouse", support: "shelter", reliance: "sole", note: "Bilberry is the black grouse's whole world: insects taken off it feed the chicks, the berries and leaves feed the adults, and its low thickets are where they shelter under the snow.", basis: "INPN; Observatoire des Galliformes de Montagne." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Pink bell flowers in May, at an altitude where early nectar is scarce.", basis: "INPN; French pollinator surveys." },
      { wildlifeId: "winter-thrushes", support: "berries", note: "The August berry crop feeds ring ouzels, thrushes and blackbirds — and foxes, martens and bears.", basis: "LPO; INPN." },
    ],
    "pinus-cembra": [
      { wildlifeId: "spotted-nutcracker", support: "seeds", reliance: "sole", note: "The arolla pine's seeds have no wings and cannot travel on their own; the nutcracker buries tens of thousands each autumn, and the forgotten ones become the next forest. Neither species manages without the other.", basis: "INPN; Alpine forest ecology literature." },
    ],
    "picea-abies": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", reliance: "narrow", note: "The crossbill's crossed beak is a tool for one job — prising a spruce cone apart — and siskins and coal tits take what it drops.", basis: "LPO; INPN." },
      { wildlifeId: "black-grouse", support: "shelter", note: "The low, snow-laden branches of old spruce are where black grouse and capercaillie sit out the mountain winter.", basis: "INPN; Observatoire des Galliformes de Montagne." },
    ],
    "larix-decidua": [
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Larch seed feeds crossbills and siskins, and its caterpillar flushes feed an explosion of birds every eight or nine years.", basis: "LPO; INPN." },
    ],
    "thymus-serpyllum": [
      { wildlifeId: "large-blue", support: "host", reliance: "sole", note: "The large blue's caterpillar eats thyme flowers for a few weeks, then must be adopted by a red ant colony to survive the winter — so the butterfly needs both the thyme and the right ant, and has vanished wherever either went.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "One of the best nectar mats at altitude, and it flowers through the short mountain summer.", basis: "INPN; French pollinator surveys." },
    ],
    "anthyllis-vulneraria": [
      { wildlifeId: "small-blue", support: "host", reliance: "sole", note: "Europe's smallest butterfly lives inside kidney vetch flower heads as a caterpillar, eating the developing seeds, and can use no other plant.", basis: "INPN; European butterfly foodplant checklist (Dryad)." },
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
  },
};
