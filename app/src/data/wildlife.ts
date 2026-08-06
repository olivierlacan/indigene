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
      "An orange-and-black butterfly with two big blue eyespots underneath. Its caterpillars eat the silver-leaved everlastings and pussytoes, wrapping themselves in the woolly leaves and their own silk to hide.",
    native: true,
    nativeBasis: "Native across North America. BAMONA; Xerces Society.",
    inat: { name: "Vanessa virginiensis", iconic: "Insecta" },
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
      "The big orange butterflies of western meadows and forest openings, their undersides spangled with silver — the hydaspe, the zerene, the great spangled, and the coastal Oregon silverspot that sits on the federal threatened list. Older books call the whole group Speyeria. Every one of them grows up on violets and on nothing else, and they do it in a strange order: the female lays in late summer on dry ground where the violets have already shrivelled away, the caterpillar hatches, eats nothing at all, and sleeps out the winter waiting for the leaves to come back.",
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
      "The small butterflies of hot dry ground — thumbnail-sized blues, and green hairstreaks that most people take for moths if they notice them at all. A whole run of them raise their caterpillars on native buckwheats, and several will lay on nothing else, which is why a patch of buckwheat on a poor sunny bank is worth more to them than a border full of nectar.",
    native: true,
    nativeBasis:
      "Native western blues and hairstreaks (acmon blue, Sheridan's green hairstreak and their relatives). Xerces Society; BAMONA.",
  },
  {
    id: "california-dogface",
    common: "California dogface butterfly",
    latin: "Zerene eurydice",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "California's state butterfly, and one almost nobody has seen. The male's yellow forewing carries a dark marking shaped like a poodle's head in profile — which is where the name comes from — over a wash of purple that only shows at the right angle. It lives in the foothills, it is fast and high-flying, and its caterpillars eat one shrub: California false indigo. No false indigo in a valley means no dogface in it either.",
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
      "A butterfly the size of a thumbnail, blue above with two orange spots, that flies in February and March along southern California rock faces and road cuts — one of the earliest butterflies of the year anywhere in the state. Its caterpillars burrow into the fleshy leaves of dudleyas and eat them from the inside, so it lives only where those silver rosettes cling to a cliff.",
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
      "A chequered black, cream and brick-red butterfly of western hillsides, and a reliable garden visitor where its caterpillars' food grows — sticky monkeyflower above all, with penstemons and their relatives as alternatives. The spiny black caterpillars feed together in a little silk shelter, then rest out the dry summer half-grown and finish the following spring.",
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
      "A dark chocolate butterfly edged in ragged cream, with a line of blue spots set inside the border. It is often the first butterfly anyone sees in a year here, because it never went anywhere — it spends the winter as an adult wedged behind loose bark or down in a woodpile, and comes out on a warm late-winter afternoon before a single flower is open. Its caterpillars feed in a black spiny huddle on willow, cottonwood and birch.",
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
      "The big lemon-yellow butterfly that is, across most of France, the first one anybody sees each year. It spends the winter as an adult — wings closed and shaped exactly like a leaf, tucked into ivy or holly — and comes out on the first warm February day looking impossibly bright against a bare hedge. It lives longer than almost any other European butterfly, nearly a year on the wing, and its caterpillars eat buckthorns and nothing else.",
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
      "The brimstone's southern sister — the same lemon yellow with a burnt-orange flash across the forewing, and often the first thing flying in a southern French February, because the adults sleep through winter and wake on the first warm day. Like the brimstone, its caterpillars eat only buckthorns.",
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
      "A small butterfly that lives its whole life in the top of an oak. It rarely visits a flower — it drinks the sticky honeydew aphids leave on the leaves instead — so hardly anyone notices it. Stand under a big oak on a still July evening and look up: the specks flickering round the crown, catching purple as they turn, are these.",
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
      "A big woodland butterfly whose males burn electric purple from one angle and go plain brown from the next, depending on how the light hits the wing. It spends its days in the crowns of the tallest trees and ignores flowers completely, coming down only for damp ground, oozing sap and things far less polite. Its caterpillar is a green slug-like thing with two horns that spends the winter pressed flat against a sallow twig, the exact colour of the bark.",
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
      "The pale silvery-blue butterfly flying high round a hedge, a wall or a churchyard yew in April, weeks before any other blue is out. It has two broods a year and each one uses a different plant — the spring brood lays on holly, the summer brood on ivy — which is why it is the blue that does well in towns.",
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
      "A small chequered orange-and-brown butterfly that looks like a miniature fritillary and is not related to one — it is Europe's only member of an otherwise tropical family. It has fallen away badly as meadows were tidied and coppiced woods abandoned, and it is particular: the females lay only on cowslips and primroses, and only on plants sitting in the right amount of shelter.",
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
      "Ragged-edged and orange, with a small white comma mark underneath. It spends the winter as an adult clamped to a twig, where the torn wing outline makes it a dead leaf. Its caterpillars grow up on hops, nettles and elms.",
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
      "A protected butterfly with one of the strangest lives in Europe. Its caterpillar eats wild thyme flowers for a few weeks, then drops to the ground and is carried into a red ants' nest — it smells and even sounds like an ant grub — where it spends ten months eating the ants' own young. It needs the thyme and the right ant, or it needs nothing.",
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
      "A little butterfly the colour of a new coin — forewings burnished orange, edged in dark brown. It picks one warm stone or bare patch of path and comes back to it all afternoon, launching at anything that flies over and settling again in the same spot. Its caterpillars eat sorrels and docks and nothing else, which is why it belongs to rough corners rather than tidy beds.",
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
      "A small dark butterfly with a thin white W scrawled across the underwing, which is where it gets its name. It spends its life in the top of an elm and comes down so seldom — for bramble flowers and thistles in July — that most people with one overhead never learn it is there. It fell away with the elms when Dutch elm disease came through, and it only comes back where elms do.",
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
      "The only green butterfly in Europe — and it never shows you the top of its wings. It rests with them shut, and the underside is a hard bright leaf-green that makes it disappear against a shrub the instant it lands. Look in April and May on a sunny heath or a scrubby bank: two of them spiralling up together and dropping back to the same twig is usually how you find one.",
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
      "A small blue butterfly of open heath, named for the tiny metallic flecks along the rim of its underwing. Its whole life runs through an ant: black ants find the caterpillar, drink the sweet liquid it gives off, and in return carry it about, guard it, and often see the chrysalis through inside their own nest. So it needs the heather, the bare warm ground the ants nest in, and the ants themselves — lose any one and the butterfly goes.",
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
      "An orange-and-black chequered butterfly of warm rough grassland, at its best near the western coast. Its caterpillars live as a family: they hatch together on ribwort plantain, spin a shared silk tent over it, spend the winter inside as a huddle, and on the first properly sunny days of spring come out and bask on top of the web in a black knot you can spot from the path.",
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
      "North America's largest native moth — a hand-sized, red-banded giant. Its caterpillars grow fat on the leaves of cherry, maple, birch, and other trees before spinning a big papery cocoon for winter.",
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
    id: "ceanothus-silkmoth",
    common: "Ceanothus silkmoth",
    latin: "Hyalophora euryalus",
    kind: "moth",
    icon: "🌙",
    blurb:
      "The West's great silkmoth — a red-brown moth as wide as a hand, with a white crescent on each wing, that flies at dusk in spring and never feeds at all as an adult: it has no working mouth, and lives a week or two on what the caterpillar stored. The caterpillar is a fat green thing with orange knobs, and it grows up on ceanothus, manzanita and coffeeberry.",
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
      "The largest moth in France — pink-and-black barred, the size of a palm — that flies at dusk and hovers at scented flowers on wings too fast to see. Its caterpillar is just as startling: a fat bright-green thing with lilac stripes and a horn on its tail, grown fat on privet leaves.",
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
      "A day-flying moth, glossy blue-black with six scarlet spots, that drifts slowly over summer meadows because it has nothing to fear — it makes cyanide from the bird's-foot trefoil its caterpillars eat, and everything knows it.",
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
      "The commonest big hawk-moth in France, and the strangest-looking at rest: it holds its hindwings out in front of the forewings, so a moth sitting on a wall reads as a grey dead leaf that somebody has put together wrong. The adult has no working mouthparts and never eats a thing — everything it needs it took in as a caterpillar, off poplar and willow leaves.",
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
      "Pink and olive-green, like something that belongs in a much warmer country, hovering at honeysuckle after dark. The caterpillar is where the name comes from, and where a good many alarmed phone calls come from: a fat grey-brown thing as long as a finger, with a trunk-like snout it pulls back in when touched — which swells up four big eyespots and makes it look, briefly and very convincingly, like a small snake.",
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
      "The moth everyone has seen and almost nobody believes: a plump grey-and-orange thing that hovers at a flower in broad daylight with its wings a blur, uncoiling a tongue longer than its own body — and gets reported every summer as a baby hummingbird. It flies up across France in spring, and it learns a good patch of flowers well enough to come back to it at the same time the next day.",
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
      "The heathland's silk moth — soft grey and pink, with a big eyespot on each of its four wings. The male flies fast in the April sunshine, zigzagging low over the heather on feathered antennae that can pick up a female's scent from a kilometre away; she sits still all day and flies only at night. The caterpillar is worth finding too: bright green, ringed with black and studded with orange warts.",
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
      "The big fuzzy bees that fly cold and early. They can \"buzz-pollinate\" — shaking pollen loose with a shiver of their flight muscles — which some native flowers depend on. They nest in the ground and in old grass tussocks, and a spring-to-frost run of flowers keeps a colony fed.",
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
      "The West's garden hummingbirds. The rufous times its spring migration to native currants and columbines coming into bloom, so an early red flower is fuel arriving exactly when it's needed.",
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
    id: "acorn-birds",
    common: "Jays, turkeys & woodpeckers",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The acorn eaters. Jays in particular — blue jays in the east, scrub-jays in the west — carry off and bury far more acorns than they ever eat, and the forgotten ones grow, so a jay isn't just fed by an oak, it plants the next one.",
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
      "The plump grey bird with a teardrop plume nodding off its forehead, running along the ground in a family party rather than flying. It is California's state bird, and it lives its whole life in the bottom three feet of the world: it needs low dense cover to hide in, bare ground to dust-bathe in, and seeds within walking distance. A garden of lawn and clipped shrubs offers none of the three, which is why quail have quietly gone from so many neighbourhoods.",
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
      "A tiny grey bird with a long black tail and a call like a kitten mewing, which lives in coastal sage scrub and essentially nowhere else. It picks insects off California sagebrush and the sages all year — it doesn't migrate, so it needs that habitat every day of its life. Most of that scrub is now houses, and the bird is federally listed as threatened, which makes a garden of sagebrush and sage more than decorative.",
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
      "Small insect-eating birds that switch to fruit for the autumn journey south — and then live on it all winter, whether that means ivy and holly on an Atlantic hedge or mastic and myrtle on a Mediterranean hillside. Oily berries are the fuel, and they are worth fighting over: a blackcap will hold one fruiting bush against every other bird for weeks. More and more of them now skip the sea crossing altogether and spend the whole winter in western France on exactly this food.",
    native: true,
    nativeBasis: "Native European birds (blackcap, Sardinian warbler, garden warbler, robin). INPN (MNHN); Ligue pour la Protection des Oiseaux (LPO).",
  },
  {
    id: "conifer-seed-finches",
    common: "Crossbills, siskins & redpolls",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The finches that live on tree seed through the winter. The crossbill is the specialist — its beak crosses at the tip, a tool for prising a closed cone apart, and in the Pacific Northwest whole populations have their own bill size and their own call for the cone they work. Siskins and redpolls take the smaller seed of hemlock, larch, alder and birch, usually hanging upside down to do it.",
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
      "A heavy, shy finch, warm orange-brown with a black bib and a bill so big it looks like a mistake. It isn't one: half the bird's head is the muscle that works it, and it can put something like fifty kilos of pressure on a cherry stone and split it clean open for the kernel inside. Nothing else in a French garden can do that. It feeds high in the canopy and slips off before you spot it, so what you usually find is the evidence — a scatter of neatly halved stones under the tree.",
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
      "The small finches that live on the seed of wild flowers — goldfinches with their red faces and gold wing-bars hanging upside down off a knapweed head, linnets and greenfinches going over in twittering parties. What they need is seed left standing through autumn and winter, which is exactly what a tidied garden hasn't got: cut everything down in September and they simply go somewhere else.",
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
      "The pink-and-grey crow with a patch of barred sky-blue on its wing, heard screeching far more often than it is seen. Every autumn one jay carries and buries a few thousand acorns, a couple at a time and often hundreds of metres from the tree, and it never comes back for all of them. That is how oak woods cross open ground and climb hills — the bird doesn't just live off an oak, it plants the next one.",
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
      "A dark, white-speckled crow of the high Alpine forest with one job: each autumn it buries tens of thousands of arolla pine seeds across the mountainside, and the ones it forgets become the next forest. The pine's seeds have no wings and cannot travel any other way — the bird and the tree cannot do without each other.",
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
      "The lyre-tailed bird of the Alpine treeline, whose males gather at dawn in spring to bubble and spar on the same patch of ground their ancestors used. It is in trouble across the Alps, and its life runs through one plant: bilberry — insects off it for the chicks, berries and leaves for the adults, and its low thickets to hide in under the snow.",
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
      "A golden, furry-tailed little climber with enormous black eyes that sleeps through more of the year than it is awake — six months curled up in a nest the size of a tennis ball, and a good deal of the summer too when the weather turns poor. It almost never crosses open ground, so it needs hedges and woodland edges joined up to get anywhere, and it fattens in autumn on hazelnuts. You will probably never see one. What you find is the shell it opened: a neat round hole, with the toothmarks angled around the rim like a tiny lathe.",
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
      { wildlifeId: "propertius-duskywing", support: "host", reliance: "sole", note: "Garry (Oregon white) oak is the sole larval host for the propertius duskywing — no oak, no butterfly.", basis: "Xerces Society; Washington NHP oak-prairie work." },
      { wildlifeId: "acorn-birds", support: "seeds", note: "Its acorns feed acorn woodpeckers, jays, and band-tailed pigeons in the West's oak country.", basis: "USDA PLANTS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "Oak mast is fall food for squirrels, deer, and other mammals.", basis: "USDA PLANTS." },
    ],
    "salix-scouleriana": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Willows are a primary larval host for the western tiger swallowtail.", basis: "NWF Native Plant Finder; Xerces." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Willow catkins are one of the earliest, richest pollen sources for spring mason and mining bees.", basis: "Xerces Society." },
    ],
    "populus-trichocarpa": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Cottonwood is a favored caterpillar tree for the western tiger swallowtail.", basis: "NWF Native Plant Finder." },
    ],
    "acer-macrophyllum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Bigleaf maple is among the trees the western tiger swallowtail's caterpillars use.", basis: "NWF Native Plant Finder." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Its heavy early flower clusters feed newly emerged bees before most plants bloom.", basis: "Xerces Society." },
    ],
    "holodiscus-discolor": [
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
      { wildlifeId: "bumble-bees", support: "nectar", note: "Flat flower heads are an easy landing pad worked by many small native bees and beneficial insects.", basis: "Xerces Society." },
    ],
    "eriophyllum-lanatum": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", reliance: "narrow", note: "A western sunflower-family bloom supporting the region's aster/sunflower pollen specialists.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
    ],
    "arbutus-menziesii": [
      { wildlifeId: "acorn-birds", support: "berries", note: "Madrone berries are a signature fall-winter food of band-tailed pigeons and are taken by robins and waxwings.", basis: "Audubon; USDA PLANTS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Urn-shaped spring flowers feed bumble bees and other native bees.", basis: "Xerces Society." },
    ],
    "amelanchier-alnifolia": [
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Saskatoon serviceberries are a top summer fruit for waxwings and many western songbirds.", basis: "Cornell Lab; USDA PLANTS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, thrushes, and grosbeaks all take the sweet berries.", basis: "Cornell Lab." },
    ],
    "symphoricarpos-albus": [
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
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Wild cherries are among the western tiger swallowtail's main caterpillar trees.", basis: "NWF Native Plant Finder; BAMONA." },
      { wildlifeId: "pale-swallowtail", support: "host", note: "Bitter cherry is one of the pale swallowtail's larval hosts alongside oceanspray and ceanothus.", basis: "BAMONA; Xerces Society." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "The small bitter cherries — inedible to us — are taken by robins, thrushes, and band-tailed pigeons.", basis: "Cornell Lab; USDA PLANTS." },
    ],
    "acer-circinatum": [
      { wildlifeId: "western-tiger-swallowtail", support: "host", note: "Maples are caterpillar trees for the western tiger swallowtail, and vine maple is the one that fits a small garden.", basis: "NWF Native Plant Finder." },
    ],
    "alnus-rubra": [
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
    "quercus-agrifolia": [
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
      { wildlifeId: "cedar-waxwing", support: "berries", note: "Toyon's red berry clusters hold on until midwinter and then a waxwing flock arrives and strips the shrub in a day.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "berry-songbirds", support: "berries", note: "Robins, mockingbirds and band-tailed pigeons work the same crop from December onward — the reason it was ever called Christmas berry.", basis: "Cornell Lab." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Midsummer flower heads carry bees and beetles in the hottest, thinnest weeks of the year.", basis: "Xerces Society." },
    ],
    "rhus-integrifolia": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Sticky red fruits through the summer for thrashers, towhees and mockingbirds, on a shrub dense enough for them to nest inside.", basis: "Cornell Lab; USFS FEIS." },
      { wildlifeId: "mason-bees", support: "nectar", note: "Pink flowers in February and March, at the very start of the solitary-bee season.", basis: "Xerces Society." },
    ],
    "eriogonum-fasciculatum": [
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
      { wildlifeId: "bumble-bees", support: "nectar", note: "Black sage flowers earlier than the other sages, so it feeds the bumble bee queens that come out first in spring.", basis: "Xerces Society; UC Berkeley Urban Bee Lab." },
      { wildlifeId: "california-gnatcatcher", support: "shelter", note: "With California sagebrush, this is the other half of the coastal sage scrub the gnatcatcher lives in.", basis: "US Fish & Wildlife Service." },
    ],
    "salvia-clevelandii": [
      { wildlifeId: "bumble-bees", support: "nectar", note: "The whorls of purple flowers are worked all day by bumble bees, carpenter bees and dozens of smaller native species.", basis: "UC Berkeley Urban Bee Lab; Xerces Society." },
      { wildlifeId: "annas-rufous-hummingbird", support: "nectar", note: "Hummingbirds take the same spikes from below, and will defend a big plant as a territory.", basis: "Audubon California." },
    ],
    "salvia-apiana": [
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
  },

  "florida-central": {
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
      { wildlifeId: "conifer-seed-finches", support: "seeds", note: "Birch catkins crumble apart through the winter into seed so fine that only the small finches bother with it — siskins and redpolls hang upside down along the outer twigs to get at it, usually in one noisy party.", basis: "LPO; INPN." },
    ],
    "salix-caprea": [
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
