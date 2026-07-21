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
  },
  {
    id: "queen-butterfly",
    common: "Queen butterfly",
    latin: "Danaus gilippus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The monarch's deep-mahogany southern cousin, common in Florida year-round. Like the monarch, its caterpillars feed only on milkweeds.",
  },
  {
    id: "eastern-black-swallowtail",
    common: "Black swallowtail",
    latin: "Papilio polyxenes",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A big dark swallowtail whose caterpillars eat plants in the carrot family — including native golden alexanders, not just the parsley in your garden.",
  },
  {
    id: "eastern-tiger-swallowtail",
    common: "Eastern tiger swallowtail",
    latin: "Papilio glaucus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The large yellow-and-black swallowtail of eastern yards. Its caterpillars grow up on the leaves of several native trees, especially wild cherry and birch.",
  },
  {
    id: "viceroy",
    common: "Viceroy butterfly",
    latin: "Limenitis archippus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The monarch look-alike — but its caterpillars grow up on willows, poplars, and cherries, overwintering rolled in a leaf they fasten to the twig.",
  },
  {
    id: "gulf-fritillary",
    common: "Gulf fritillary",
    latin: "Agraulis vanillae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A brilliant orange butterfly with silver-spangled underwings. Its caterpillars feed only on passionflower vines.",
  },
  {
    id: "zebra-longwing",
    common: "Zebra longwing",
    latin: "Heliconius charithonia",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "Florida's state butterfly — long black wings striped in pale yellow, drifting slowly through shady spots. Its caterpillars eat only passionflower vines; the adults are unusual in eating pollen, which lets them live for months.",
  },
  {
    id: "atala",
    common: "Atala butterfly",
    latin: "Eumaeus atala",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small jewel — velvet black with iridescent blue flecks and a scarlet belly — once thought extinct in Florida. It came back with its only host plant, the coontie. Plant coontie and you are quite literally rebuilding this butterfly.",
  },
  {
    id: "white-peacock",
    common: "White peacock",
    latin: "Anartia jatrophae",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A pale, low-flying butterfly of sunny damp openings in Florida. Its caterpillars feed on porterweed and water-hyssop.",
  },
  {
    id: "western-tiger-swallowtail",
    common: "Western tiger swallowtail",
    latin: "Papilio rutulus",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "The big yellow swallowtail of Pacific Northwest gardens and streamsides. Its caterpillars feed on the leaves of willows, cottonwoods, and bigleaf maple.",
  },
  {
    id: "pale-swallowtail",
    common: "Pale swallowtail",
    latin: "Papilio eurymedon",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A cream-and-black swallowtail of drier western slopes. Its caterpillars grow up on oceanspray and ceanothus.",
  },
  {
    id: "propertius-duskywing",
    common: "Propertius duskywing",
    latin: "Erynnis propertius",
    kind: "butterfly",
    icon: "🦋",
    blurb:
      "A small brown skipper tied to the West's Garry oak (Oregon white oak) prairies — its caterpillars eat only oak, and it fades as that rare habitat does.",
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
  },
  {
    id: "cecropia-moth",
    common: "Cecropia moth",
    latin: "Hyalophora cecropia",
    kind: "moth",
    icon: "🌙",
    blurb:
      "North America's largest native moth — a hand-sized, red-banded giant. Its caterpillars grow fat on the leaves of cherry, maple, birch, and other trees before spinning a big papery cocoon for winter.",
  },
  {
    id: "hummingbird-clearwing",
    common: "Hummingbird clearwing moth",
    latin: "Hemaris thysbe",
    kind: "moth",
    icon: "🌙",
    blurb:
      "A plump day-flying moth that hovers at flowers exactly like a tiny hummingbird, so most people never realize it's a moth. Its caterpillars feed on viburnum and honeysuckle; the adults sip nectar from tubular blooms.",
  },
  // ---------------- Bees & other pollinators ----------------
  {
    id: "bumble-bees",
    common: "Bumble bees",
    latin: "Bombus spp.",
    kind: "bee",
    icon: "🐝",
    blurb:
      "The big fuzzy bees that fly cold and early. They can \"buzz-pollinate\" — shaking pollen loose with a shiver of their flight muscles — which some native flowers depend on. They nest in the ground and in old grass tussocks, and a spring-to-frost run of flowers keeps a colony fed.",
  },
  {
    id: "sunflower-specialist-bees",
    common: "Sunflower-family specialist bees",
    latin: "Andrena, Melissodes & others",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Dozens of native bees collect pollen from only the sunflower family — asters, coneflowers, goldenrods, sunflowers. If those plants vanish from a yard, these bees have nothing else to raise their young on, no matter how many other flowers bloom.",
  },
  {
    id: "mason-bees",
    common: "Mason & mining bees",
    latin: "Osmia, Andrena spp.",
    kind: "bee",
    icon: "🐝",
    blurb:
      "Gentle, solitary early-spring bees — superb fruit pollinators — that emerge when the first native shrubs bloom. An early flower like red-flowering currant or willow is a lifeline the week they wake up.",
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
  },
  {
    id: "annas-rufous-hummingbird",
    common: "Anna's & rufous hummingbirds",
    latin: "Calypte anna, Selasphorus rufus",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The West's garden hummingbirds. The rufous times its spring migration to native currants and columbines coming into bloom, so an early red flower is fuel arriving exactly when it's needed.",
  },
  {
    id: "cedar-waxwing",
    common: "Cedar waxwing",
    latin: "Bombycilla cedrorum",
    kind: "bird",
    icon: "🐦",
    blurb:
      "A sleek, sociable bird that lives on fruit and roves in flocks, stripping a serviceberry or dogwood clean in an afternoon. Berry shrubs that hold fruit into winter are what keep them around.",
  },
  {
    id: "american-goldfinch",
    common: "American goldfinch",
    latin: "Spinus tristis",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The bright yellow \"wild canary\" that nests late, in summer, so it can feed its young the seeds of native asters and coneflowers. Leaving seed heads standing through fall and winter is its winter pantry.",
  },
  {
    id: "yellow-rumped-warbler",
    common: "Yellow-rumped warbler",
    latin: "Setophaga coronata",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The one warbler that can digest waxy bayberry fruit, which lets it winter far further north — and all across the Southeast — than other warblers. Wax myrtle is the plant behind that trick (its old name was \"myrtle warbler\").",
  },
  {
    id: "acorn-birds",
    common: "Jays, turkeys & woodpeckers",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The acorn eaters. Blue jays in particular carry off and bury far more acorns than they ever eat, and the forgotten ones grow — so a jay isn't just fed by an oak, it plants the next one.",
  },
  {
    id: "berry-songbirds",
    common: "Mockingbirds, cardinals & thrushes",
    kind: "bird",
    icon: "🐦",
    blurb:
      "The everyday songbirds that raise families on insects and then switch to fruit — beautyberry, wild coffee, holly, seagrape — to fatten up and get through the leaner months.",
  },
  // ---------------- Mammals & others ----------------
  {
    id: "acorn-mammals",
    common: "Squirrels, deer & other mammals",
    kind: "mammal",
    icon: "🐿️",
    blurb:
      "Acorns and fleshy fruit are the fall calories that carry squirrels, chipmunks, deer, foxes, and even black bears into winter. A single mature oak or wild cherry is a food bank for the whole neighborhood of mammals.",
  },
  {
    id: "gopher-tortoise",
    common: "Gopher tortoise",
    latin: "Gopherus polyphemus",
    kind: "mammal",
    icon: "🐢",
    blurb:
      "A keystone digger of Florida's dry uplands whose long burrows shelter hundreds of other species. It grazes low native growth — saw palmetto berries, sunshine mimosa, dune sunflower — in the open, sandy pine flatwoods it needs.",
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
      { wildlifeId: "viceroy", support: "host", note: "Cherries are among the willows-and-poplars family the viceroy also uses as a caterpillar host.", basis: "NWF Native Plant Finder." },
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
      { wildlifeId: "eastern-black-swallowtail", support: "host", note: "A native carrot-family plant and a true host for black swallowtail caterpillars — not just a nectar stop.", basis: "LBJ Wildflower Center; Xerces." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Early flat-topped yellow flowers are an accessible spring nectar source for emerging bees.", basis: "Xerces mid-Atlantic list." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", note: "A milkweed — one of the only plants monarch caterpillars can eat, and a favorite egg-laying choice.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "The bright orange flowers are a heavy nectar draw for bumble bees and many other pollinators.", basis: "Xerces Society." },
    ],
    "asclepias-incarnata": [
      { wildlifeId: "monarch", support: "host", note: "A milkweed of damp ground and a key monarch host and nectar plant.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Fragrant pink flower clusters are rich in nectar for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "echinacea-purpurea": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "A sunflower-family bloom whose pollen feeds the specialist bees that can use nothing else.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Left standing, the spent cones are a favorite winter seed head for goldfinches.", basis: "Cornell Lab; LBJ Wildflower Center." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "A long-blooming summer nectar source for bumble bees and butterflies.", basis: "Xerces Society." },
    ],
    "rudbeckia-fulgida": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "A composite whose pollen supports sunflower-family specialist bees.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Goldfinches work the dark seed heads through fall and winter.", basis: "Cornell Lab." },
    ],
    "monarda-fistulosa": [
      { wildlifeId: "ruby-throated-hummingbird", support: "nectar", note: "Tubular lavender flowers are a hummingbird favorite.", basis: "LBJ Wildflower Center; Audubon." },
      { wildlifeId: "hummingbird-clearwing", support: "nectar", note: "A top nectar flower for the hummingbird clearwing moth.", basis: "Xerces Society." },
      { wildlifeId: "bumble-bees", support: "nectar", note: "Long-tongued bumble bees are among its heaviest visitors.", basis: "Xerces Society." },
    ],
    "symphyotrichum-novae-angliae": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Asters host a suite of aster-specialist bees; this is one of the best.", basis: "Fowler & Droege, Pollen Specialist Bees." },
      { wildlifeId: "monarch", support: "nectar", note: "Late purple bloom is critical fall fuel for southbound monarchs.", basis: "Xerces Society; Monarch Joint Venture." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Fine seed heads feed goldfinches into winter.", basis: "Cornell Lab." },
    ],
    "solidago-rugosa": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Goldenrods carry more pollen-specialist bees than almost any other plant.", basis: "Fowler & Droege, Pollen Specialist Bees." },
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
      { wildlifeId: "hummingbird-clearwing", support: "host", note: "Viburnums are a documented larval host for the hummingbird clearwing moth.", basis: "NWF Native Plant Finder." },
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
      { wildlifeId: "propertius-duskywing", support: "host", note: "Garry (Oregon white) oak is the sole larval host for the propertius duskywing — no oak, no butterfly.", basis: "Xerces Society; Washington NHP oak-prairie work." },
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
      { wildlifeId: "pale-swallowtail", support: "host", note: "Oceanspray is a classic larval host for the pale swallowtail (and the Lorquin's admiral).", basis: "Xerces Society; NWF Native Plant Finder." },
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
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "A western sunflower-family bloom supporting the region's aster/sunflower pollen specialists.", basis: "Fowler & Droege, Pollen Specialist Bees (West)." },
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
  },

  "florida-central": {
    "quercus-virginiana": [
      { wildlifeId: "acorn-birds", support: "seeds", note: "Live oak acorns feed jays, turkeys, woodpeckers, and wintering ducks.", basis: "UF/IFAS; Cornell Lab." },
      { wildlifeId: "acorn-mammals", support: "seeds", note: "A major mast tree for squirrels, deer, and other mammals.", basis: "UF/IFAS." },
    ],
    "asclepias-tuberosa": [
      { wildlifeId: "monarch", support: "host", note: "A milkweed and monarch host; Florida sits on the monarch's migration and overwintering path.", basis: "Xerces Society; UF/IFAS." },
      { wildlifeId: "queen-butterfly", support: "host", note: "Milkweeds are also the sole caterpillar food of the monarch's cousin, the queen.", basis: "UF/IFAS; Florida Native Plant Society." },
    ],
    "passiflora-incarnata": [
      { wildlifeId: "gulf-fritillary", support: "host", note: "Passionvine is the gulf fritillary's caterpillar plant.", basis: "UF/IFAS; Florida Native Plant Society." },
      { wildlifeId: "zebra-longwing", support: "host", note: "The host vine for Florida's state butterfly, the zebra longwing.", basis: "UF/IFAS." },
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
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "A sunflower-family bloom supporting specialist bees.", basis: "Fowler & Droege." },
    ],
    "coreopsis-leavenworthii": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Florida's state wildflower group — its pollen feeds sunflower-family specialist bees.", basis: "Fowler & Droege; UF/IFAS." },
      { wildlifeId: "american-goldfinch", support: "seeds", note: "Wintering goldfinches take the small seeds.", basis: "Cornell Lab." },
    ],
    "helianthus-debilis": [
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "A true sunflower — a keystone pollen source for sunflower specialist bees.", basis: "Fowler & Droege." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "A low, open-ground plant of the sandy uplands gopher tortoises graze and dig in.", basis: "UF/IFAS; Florida gopher tortoise guidance." },
    ],
    "serenoa-repens": [
      { wildlifeId: "berry-songbirds", support: "berries", note: "Saw palmetto's fall fruit is eaten by many birds; its spring flowers are a legendary nectar and honey source.", basis: "UF/IFAS." },
      { wildlifeId: "gopher-tortoise", support: "shelter", note: "Saw palmetto scrub is core gopher tortoise habitat, and the berries are part of its diet.", basis: "UF/IFAS; Florida gopher tortoise guidance." },
    ],
  },

  "florida-south": {
    "zamia-integrifolia": [
      { wildlifeId: "atala", support: "host", note: "Coontie is the atala butterfly's only caterpillar plant — planting it is how the atala was brought back from near-extinction in South Florida.", basis: "UF/IFAS; Florida Museum of Natural History." },
    ],
    "passiflora-suberosa": [
      { wildlifeId: "zebra-longwing", support: "host", note: "Corkystem passionvine is a preferred host for the zebra longwing.", basis: "UF/IFAS." },
      { wildlifeId: "gulf-fritillary", support: "host", note: "A caterpillar host for the gulf fritillary as well.", basis: "UF/IFAS." },
    ],
    "stachytarpheta-jamaicensis": [
      { wildlifeId: "white-peacock", support: "host", note: "Blue porterweed is a larval host for the white peacock butterfly.", basis: "UF/IFAS; Florida Native Plant Society." },
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
      { wildlifeId: "sunflower-specialist-bees", support: "nectar", note: "Dune sunflower's pollen supports sunflower-family specialist bees along the coast.", basis: "Fowler & Droege; UF/IFAS." },
    ],
  },
};
