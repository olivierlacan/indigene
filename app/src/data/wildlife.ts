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
      "The big yellow swallowtail of Pacific Northwest gardens and streamsides. Its caterpillars feed on the leaves of willows, cottonwoods, and bigleaf maple.",
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
      "A small brown skipper tied to the West's Garry oak (Oregon white oak) prairies — its caterpillars eat only oak, and it fades as that rare habitat does.",
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
    nativeBasis: "Native grass-feeding butterflies (Hesperiidae and the satyr group of Nymphalidae). BAMONA; Xerces Society.",
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
      "The acorn eaters. Blue jays in particular carry off and bury far more acorns than they ever eat, and the forgotten ones grow — so a jay isn't just fed by an oak, it plants the next one.",
    native: true,
    nativeBasis: "Native birds (blue jay, wild turkey, woodpeckers). Cornell Lab of Ornithology.",
  },
  {
    id: "berry-songbirds",
    common: "Mockingbirds, cardinals & thrushes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The everyday songbirds that raise families on insects and then switch to fruit — beautyberry, wild coffee, holly, seagrape — to fatten up and get through the leaner months.",
    native: true,
    nativeBasis: "Native birds (northern mockingbird, northern cardinal, thrushes). Cornell Lab of Ornithology.",
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
