// The "grow this instead" dataset — the common non-native ornamentals people
// buy and plant, and the natives on our lists that do the same job at least as
// well, on the traits that decide whether a swap is worth making: water,
// disease, and what it feeds.
//
// Two parts, both auditable in this one file the way a plant row is:
//
//   1. ORNAMENTALS — the catalog. Each commonly-planted non-native described
//      once: what it's planted *for* (`role`), where it's really from, and the
//      weakness a native beats. Bermuda grass is Bermuda grass everywhere, so
//      the catalog is shared; only the swaps differ by region.
//
//   2. ALTERNATIVES — the ties, keyed by region id, then by *ornamental* id,
//      then a list of the natives that stand in for it there. Keyed by region
//      because the right swap is a local question: the lawn grass that shrugs
//      off a Mid-Atlantic summer is not the one for a Florida one.
//
// What earns a row here:
//   - Real people really plant the ornamental for a real garden job — a lawn, a
//     hedge, a shade tree, a "butterfly plant" — and a native genuinely does
//     that job. "A wildflower meadow instead of a lawn" is an honest answer for
//     a border, not for the strip a child plays football on, and the `why` says
//     which.
//   - There is something you can *point to* on water, disease or wildlife where
//     the native equals or beats the ornamental. Where it doesn't, we don't
//     claim it — the edge is simply left off. A citable source stands behind
//     the swap.
//
// And what doesn't: a tone of moral panic. Butterfly bush is a lovely shrub and
// a real nectar bar; the honest case for a native beside it is that it feeds
// the caterpillars too, not that the gardener sinned. The point is a better
// choice, freely made — not a scold.
//
// Sources leaned on throughout (full licensing in DATA_SOURCES.md):
//   - Penn State Extension, Rutgers NJAES, Missouri Botanical Garden and the
//     Morton Arboretum plant finders
//   - Lady Bird Johnson Wildflower Center; Xerces Society; Mt. Cuba Center
//   - Connecticut Agricultural Experiment Station (the barberry–tick work)
//   - USDA PLANTS; the mid-Atlantic native-plant societies
//
// The native side is not editorial: `noWaterEstablish`, `moisture` and the
// eco-scores on each plant row are where the water and wildlife edges come
// from. Disease and the "what it's planted for" framing are editorial, and
// cited.
import type { AlternativeLink, Ornamental } from "../types";

// ---- The catalog: the ornamentals themselves, described once ----
export const ORNAMENTALS: Ornamental[] = [
  // ---------------- Lawn & groundcover ----------------
  {
    id: "cynodon-dactylon",
    common: "Bermuda grass",
    latin: "Cynodon dactylon",
    form: "grass",
    role: "Lawn / turf",
    origin: "Native to the warm grasslands of Africa and Eurasia; the South's default warm-season lawn.",
    blurb:
      "The green that comes out of a hose. It makes a tough, fine lawn in full sun — but only while it's watered and fed, browns off the moment the heat comes or the tap stops, and runs by the yard into every bed it can reach. Its roots are shallow, so the ground under it sheds water instead of drinking it.",
    originBasis: "USDA PLANTS; Missouri Botanical Garden.",
  },
  {
    id: "hedera-helix",
    common: "English ivy",
    latin: "Hedera helix",
    form: "vine",
    role: "Evergreen groundcover / wall cover",
    origin: "Native to Europe and western Asia; planted for dry shade nothing else will fill.",
    blurb:
      "The evergreen carpet for the difficult corner. It does cover dry shade — and then it doesn't stop, smothering the ground flora and climbing whatever it reaches, trees included, until the weight and the shade bring them down. It feeds almost nothing here.",
    originBasis: "Penn State Extension; Missouri Botanical Garden.",
  },
  // ---------------- Shrubs ----------------
  {
    id: "berberis-thunbergii",
    common: "Japanese barberry",
    latin: "Berberis thunbergii",
    form: "shrub",
    role: "Thorny hedge / colour shrub",
    origin: "Native to Japan; sold for its red or gold leaves and its animal-proof thorns.",
    blurb:
      "A neat, thorny, deer-proof shrub in every foundation planting — and a seed factory for the woods behind it. Its low, dense, humid canopy is the microclimate black-legged (deer) ticks thrive in, and barberry thickets carry markedly more Lyme-infected ticks than woods without it.",
    originBasis: "Penn State Extension; Connecticut Agricultural Experiment Station.",
  },
  {
    id: "buddleja-davidii",
    common: "Butterfly bush",
    latin: "Buddleja davidii",
    form: "shrub",
    role: "Nectar shrub for a sunny border",
    origin: "Native to China; sold, by the name, as the plant that brings butterflies.",
    blurb:
      "It does bring butterflies — its summer spikes are a genuine nectar bar. But nectar is the easy half: not one native caterpillar can eat its leaves, so it feeds the adults and raises none of the next generation. It's a diner, not a nursery, and it seeds itself into open ground besides.",
    originBasis: "Xerces Society; Mt. Cuba Center.",
  },
  // ---------------- Trees ----------------
  {
    id: "acer-platanoides",
    common: "Norway maple",
    latin: "Acer platanoides",
    form: "tree",
    role: "Fast street / shade tree",
    origin: "Native to continental Europe and western Asia; planted by the million after Dutch elm disease.",
    blurb:
      "The fast, tidy shade tree that filled the avenues — and then seeded into the woods. Its shade is so dense and its roots so greedy and shallow that the ground beneath a mature one is bare, and it's prone to girdling roots and verticillium wilt as it ages.",
    originBasis: "Penn State Extension; Morton Arboretum.",
  },
  {
    id: "pyrus-calleryana",
    common: "Callery pear (Bradford pear)",
    latin: "Pyrus calleryana",
    form: "tree",
    role: "Spring-flowering ornamental tree",
    origin: "Native to China and Vietnam; sold from the 1960s as a tidy, quick street tree.",
    blurb:
      "The tree that turns whole streets white for one week in spring — and splits apart in the first real storm, its branches too crowded to hold. The varieties cross and their thorny seedlings fill old fields and verges; several states have now banned its sale.",
    originBasis: "Penn State Extension; Missouri Botanical Garden.",
  },
];

// ---- The ties: region → ornamental id → the natives that stand in for it ----
//
// Read a line as a sentence: in `mid-atlantic`, for `cynodon-dactylon` (Bermuda
// grass), grow `schizachyrium-scoparium` (little bluestem) instead, "because …",
// and here is how the two compare on water, disease and wildlife.
export const ALTERNATIVES: Record<string, Record<string, AlternativeLink[]>> = {
  "mid-atlantic": {
    "cynodon-dactylon": [
      {
        plantId: "schizachyrium-scoparium",
        why: "For a lawn you look at more than you walk on, a meadow of little bluestem holds a sunny slope with no hose and no mower, and turns copper all winter.",
        edges: [
          { axis: "water", native: "None once established — roots plunge five feet and it stays blue-green through a drought.", ornamental: "Browns off in summer heat without regular irrigation." },
          { axis: "disease", native: "A native bunchgrass with no turf diseases to speak of.", ornamental: "Prone to spring dead spot, dollar spot and other turf diseases when stressed." },
          { axis: "wildlife", native: "Hosts skipper butterflies and shelters ground-nesting birds through winter.", ornamental: "Feeds nothing native; a green surface and no more." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
      {
        plantId: "carex-pensylvanica",
        why: "For the part you do walk on, in sun to part shade, Pennsylvania sedge makes a soft, fine, ankle-high lawn you can mow a few times a year or leave to flop.",
        edges: [
          { axis: "water", native: "Drought-tough once knit together; no summer watering.", ornamental: "Needs watering to stay green in the heat." },
          { axis: "wildlife", native: "A larval host for several skippers and cover for small ground life.", ornamental: "Feeds nothing native." },
        ],
        basis: "Mt. Cuba Center; Lady Bird Johnson Wildflower Center.",
      },
    ],
    "hedera-helix": [
      {
        plantId: "parthenocissus-quinquefolia",
        why: "For a wall or a bank, Virginia creeper does exactly ivy's job — climbs by itself, covers fast — then blazes scarlet in autumn and drops berries the birds strip.",
        edges: [
          { axis: "water", native: "Establishes and holds a dry bank with no supplemental water.", ornamental: "Tolerant of dry shade, but offers nothing back." },
          { axis: "wildlife", native: "Host to several sphinx moths; its berries feed dozens of bird species.", ornamental: "Smothers the ground flora and feeds almost nothing here." },
        ],
        basis: "Missouri Botanical Garden; Xerces Society.",
      },
      {
        plantId: "fragaria-virginiana",
        why: "For a flat patch of open ground, wild strawberry runs into a low green mat, flowers white in spring, and hands out small sweet berries — a groundcover that gives instead of only spreading.",
        edges: [
          { axis: "water", native: "Drought-tough once it has knit together.", ornamental: "Holds dry shade but crowds out everything else." },
          { axis: "wildlife", native: "Feeds pollinators in spring and birds, mammals and people in summer.", ornamental: "Little to no wildlife value here." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Rutgers NJAES.",
      },
    ],
    "berberis-thunbergii": [
      {
        plantId: "physocarpus-opulifolius",
        why: "For a tough, deer-tolerant hedge with coloured leaves, ninebark gives you the gold and burgundy the barberry cultivars sell — as a full-size native shrub, thorns and tick-thickets not included.",
        edges: [
          { axis: "water", native: "Drought-proof once set; takes poor soil and neglect.", ornamental: "Undemanding too — but that toughness is the problem, not the point." },
          { axis: "disease", native: "An open, airy shrub with no association with tick-borne disease.", ornamental: "Its dense low canopy shelters more Lyme-infected ticks than woods without it." },
          { axis: "wildlife", native: "Feeds specialist bees and hosts native moths; spent flower heads feed birds.", ornamental: "Little native wildlife value." },
        ],
        basis: "Penn State Extension; Connecticut Agricultural Experiment Station.",
      },
      {
        plantId: "ceanothus-americanus",
        why: "For a low, mounded shrub in a hot dry spot, New Jersey tea holds barberry's size and place and covers itself in white flowers alive with bees.",
        edges: [
          { axis: "water", native: "Deep-rooted and thoroughly drought-proof; thrives on poor, dry ground.", ornamental: "Tolerates dry soil but earns its keep by nothing." },
          { axis: "wildlife", native: "A pollinator magnet and larval host to spring azure and other butterflies.", ornamental: "Feeds nothing native." },
        ],
        basis: "Lady Bird Johnson Wildflower Center; Xerces Society.",
      },
    ],
    "buddleja-davidii": [
      {
        plantId: "asclepias-tuberosa",
        why: "If the point was butterflies, butterfly weed is the plant that was actually named for the job: blazing orange nectar the adults mob — and the milkweed a monarch caterpillar has to have.",
        edges: [
          { axis: "water", native: "A deep taproot makes it thoroughly drought-proof; it wants dry, poor soil.", ornamental: "Drought-tolerant too, once established." },
          { axis: "wildlife", native: "Feeds adult butterflies *and* raises the next brood — a monarch host, not just a nectar stop.", ornamental: "A nectar bar only: not one native caterpillar can eat its leaves." },
        ],
        basis: "Xerces Society; Monarch Joint Venture.",
      },
      {
        plantId: "monarda-fistulosa",
        why: "For the same long summer show of nectar in a sunny border, wild bergamot throws up a haze of lavender heads that bees, butterflies and hummingbirds work all day.",
        edges: [
          { axis: "water", native: "Drought-tough once established; takes lean, dry soil.", ornamental: "Drought-tolerant, but deadhead it or it seeds around." },
          { axis: "wildlife", native: "Nectar for a long roll-call of pollinators, and a larval host for several moths.", ornamental: "Feeds the adults; hosts no native caterpillars." },
        ],
        basis: "Mt. Cuba Center; Xerces Society.",
      },
    ],
    "acer-platanoides": [
      {
        plantId: "acer-rubrum",
        why: "Red maple is the native the Norway maple was standing in for all along: the same quick shade and clean shape, with scarlet autumn colour and a food web underneath instead of bare ground.",
        edges: [
          { axis: "water", native: "Establishes and holds with no supplemental water once rooted.", ornamental: "Tough too — but its greed and shade are the cost." },
          { axis: "disease", native: "Broadly trouble-free; no milky sap, no bare circle of dead ground beneath it.", ornamental: "Prone to girdling roots and verticillium wilt with age." },
          { axis: "wildlife", native: "Hosts hundreds of caterpillar species — the birds' summer larder.", ornamental: "Casts shade so dense the ground beneath it is usually bare." },
        ],
        basis: "Penn State Extension; Morton Arboretum.",
      },
    ],
    "pyrus-calleryana": [
      {
        plantId: "amelanchier-canadensis",
        why: "For that week of white spring blossom, serviceberry gives it — earlier, in an airy spray — then June berries the birds and you both eat, and a tree whose branches actually hold together.",
        edges: [
          { axis: "disease", native: "Sound branch structure; no habit of splitting apart in storms.", ornamental: "Weak, crowded branching that shears off in the first real wind; fire-blight prone." },
          { axis: "wildlife", native: "Sweet berries feed dozens of bird species; a larval host for many moths.", ornamental: "Hard little pellets of low value, and thorny invasive seedlings." },
        ],
        basis: "Penn State Extension; Missouri Botanical Garden.",
      },
      {
        plantId: "cornus-florida",
        why: "For the same small flowering tree in dappled shade, flowering dogwood carries broad white spring bracts, glossy red autumn berries and a tidy layered shape — none of it prone to snapping.",
        edges: [
          { axis: "disease", native: "Structurally sound; no storm-splitting habit.", ornamental: "Notorious for shearing apart as it matures; fire-blight prone." },
          { axis: "wildlife", native: "Red autumn berries stripped by migrating birds; hosts spring azure and many moths.", ornamental: "Little wildlife value, and it spreads." },
        ],
        basis: "Missouri Botanical Garden; Penn State Extension.",
      },
    ],
  },
};
