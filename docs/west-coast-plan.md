# Plan: the whole West Coast — Oregon and California, region by region

Indigene already covers the wet, green quarter of the West Coast: the Pacific
Northwest list runs from the Canadian border down to the Oregon–California line,
west of the Cascade crest. Everything south and east of that is blank. A gardener
in Los Angeles, San Diego, Sacramento, Bend or Palm Springs gets the same honest
shrug: *we don't have a list for here yet.*

That is a big blank. California alone is 39 million people, the most botanically
diverse state in the country, and the place where "plant natives" is least
optional — a Mediterranean climate with a five-month rainless summer punishes a
garden built out of plants from somewhere wetter. It's also the hardest state to
cover honestly, because **there is no such thing as "California native"** in any
sense a gardener can act on: a redwood-belt plant and a Joshua Tree plant share a
state and nothing else.

So this document says how the coast gets carved up, in what order, and what each
piece claims. It's the same shape as [`docs/coverage-plan.md`](coverage-plan.md)
— that one says how a region's list *grows*; this one says which regions there
are going to be.

---

## 1. The rule: one list per flora, not one per state

A region in Indigene is a **seed plant list plus the box it applies to**, refined
by real EPA (Omernik) Level III ecoregion codes. The rule for drawing one has
been the same since the Pacific Northwest: **a region is as big as one honest
answer to "what should I plant here?"** — no bigger. Where the honest answer
changes, the region ends.

Two consequences worth stating plainly, because they're what makes the map below
look the way it does:

- **A state line is never a flora line.** Western Oregon belongs with western
  Washington (it's already one list); eastern Oregon belongs with the Great Basin;
  the Klamath–Siskiyou straddles the Oregon–California line and belongs to
  neither state's stereotype.
- **Mountains are the boundary, not the coastline.** Every split below happens
  at a crest — the Cascades, the Sierra, the Transverse and Peninsular ranges —
  because that is where the rain stops and the flora changes over a few miles.

---

## 2. The map: eight regions to fill Oregon and California

Six of these are new. The first column is the region id, which is also the URL
(`indigene.app/regions/ca-south-coast`) and the plant-list cache key.

| Region | Where | Omernik Level III | Reference / zones | Status |
|---|---|---|---|---|
| `pnw` | Western OR & WA, west of the Cascade crest | 1, 2, 3, 4, 78 | Portland–Seattle, 8a–9a | **shipped** |
| `ca-south-coast` | LA, Orange, San Diego, Inland Empire, Santa Barbara — cismontane southern California | 6, 8, 85 | LA–San Diego coastal plain, 9b–10b | **this PR** |
| `ca-central-coast` | Sonoma & the Bay Area south to Big Sur and the Salinas Valley | 6 | San Francisco Bay, 9a–10a | next |
| `ca-north-coast` | Del Norte to Mendocino, plus the Klamath–Siskiyou (spilling into SW Oregon) | 1, 78 | Humboldt Bay redwood belt, 9a–9b | next |
| `ca-valley` | The Central Valley floor and the Sierra foothill oak woodland | 7, and the low edge of 5 | Sacramento–Fresno, 9a–9b | after |
| `ca-sierra` | The Sierra Nevada above the foothills, plus the Southern Cascades | 5, 9 (CA portion) | Tahoe basin & the west slope, 6b–8a | after |
| `or-east` | Oregon east of the Cascade crest — high desert, Columbia Plateau, Blue Mountains | 9, 10, 11, 12, 80 | Bend & the Columbia Basin, 5b–7a | after |
| `ca-desert` | Mojave and Colorado (Sonoran) deserts — Palm Springs, Joshua Tree, Anza-Borrego | 14, 81 | Coachella Valley, 9a–10b | last |

Two things this table quietly settles.

**The Klamath–Siskiyou is already half-claimed.** Omernik 78 is in the PNW
region's code list, because the Rogue and Umpqua valleys are genuinely part of the
west-side story. `ca-north-coast` will claim 78 as well, and the two boxes will
overlap across the state line — exactly the situation France's four regions
already handle: overlapping boxes, resolved by the live ecoregion code, with
smallest-box-first as the offline tiebreak. Nothing new has to be built for it.

**The deserts go last, and that is a real decision, not neglect.** They're the
hardest lists to author responsibly (a desert planting either has irrigation or it
has one shot at a wet winter, and the honest care notes are unlike anything the
app says today) and they serve the fewest people. Until `ca-desert` ships, a
Palm Springs spot correctly gets *no list* rather than a chaparral list that would
cook. That's what the boxes below are drawn to guarantee.

---

## 3. The boxes, and why they stop where they do

Selection is a coarse lat/lon box, refined by the ecoregion code when a live
lookup answers. Offline — or outside EPA's coverage — **the box alone decides**,
so a box has to be defensible on its own. That means each one is drawn to the
mountain crest that ends the flora, not to a convenient rectangle around a metro
area.

| Region | Box (minLat, maxLat, minLon, maxLon) | The edge that matters |
|---|---|---|
| `pnw` | 42.0, 49.0, −124.9, −120.5 | East edge is the Cascade crest. Bend (−121.3, ecoregion 9) is inside the box and *falls through* on the code. |
| `ca-south-coast` | 32.5, 35.2, −120.8, −116.6 | East edge is the crest of the Transverse and Peninsular ranges. Palm Springs (−116.55) sits **outside** it, so a desert spot gets no list even offline. |
| `ca-central-coast` | 35.0, 38.9, −123.6, −120.4 | East edge is the Diablo/Gabilan crest, before the Central Valley floor. |
| `ca-north-coast` | 38.5, 42.6, −124.6, −122.4 | Reaches north over the state line for the Klamath–Siskiyou; overlaps `pnw`, resolved on the code. |
| `ca-valley` | 34.8, 40.6, −122.5, −119.6 | The valley floor plus the foothill oak belt, stopping below the Sierra conifers. |
| `ca-sierra` | 35.4, 41.5, −121.5, −117.8 | Elevation is the real boundary and a box can't say elevation; the ecoregion code does the work here, so this box is the one that leans hardest on the live lookup. |
| `or-east` | 41.9, 46.3, −121.6, −116.4 | West edge is the Cascade crest from the other side. |
| `ca-desert` | 32.5, 37.5, −118.0, −114.1 | Overlaps `ca-sierra` and `ca-south-coast` at their eastern edges; the code decides. |

Boxes overlap. That's fine and has been since France — see `regionsForCoords` in
`app/src/data/regions.ts`. What we don't allow is a box that claims a flora it
can't serve *when the code is unavailable*, which is why the southern California
box stops at −116.6 instead of running to the Colorado River.

---

## 4. What each new region has to bring with it

A region is not just a plant file. The Pacific Northwest shipped without
iNaturalist ids and without wildlife ties, and both gaps were invisible from
inside the app — the "see it growing near you" panel simply had nothing to show.
So the checklist for each region below is:

1. **The plant list** — clearing the floors in
   [`coverage-plan.md`](coverage-plan.md) §1: every form ≥3, every
   moisture × sun cell ≥3, something in flower every month of the local growing
   season. `npm run coverage` prints the gaps.
2. **Wildlife ties** — at least the region's headline relationships, with a
   `basis` each. The catalog is shared, so the West already has monarch, the
   western tiger and pale swallowtails, the buckwheat blues, the bumble and mason
   bees, and Anna's/rufous hummingbirds to tie to.
3. **Look-alikes** — the local version of "the nursery sold me the wrong thing".
   In California that is dominated by three: tropical milkweed, the fountain and
   pampas grasses, and the blue-gum eucalyptus.
4. **The registry** — `npm run registry:build`, then the *Reconcile registry
   identifiers* workflow with scope `missing-inat`, or the sightings panel ships
   empty.
5. **A French metadata entry** in `locales/regions.fr.ts` (the prose overlay can
   follow later; it falls back to English by design).

---

## 5. Order of work, and why

1. **`ca-south-coast`** — 23 million people, the flora least like anything we
   already ship (coastal sage scrub and chaparral), and the strongest version of
   the app's argument: a garden here either drinks imported water all summer or is
   planted with things that expect the drought.
2. **`ca-central-coast`** — the next 8 million, and the cheapest file to write
   after the first two: it shares oak woodland and coastal scrub with the south,
   and redwood-edge and riparian species with the PNW.
3. **`ca-north-coast`** — closest kin to the existing PNW list, so it's mostly a
   matter of subtracting what stops at the Oregon line and adding the redwood
   belt.
4. **`ca-valley`** — valley oak, vernal-pool edges and the native bunchgrass
   prairie almost nobody has seen intact. The most agricultural landscape in the
   country, and the one where a garden hedgerow does the most measurable good.
5. **`or-east`** — sagebrush steppe. Finishes Oregon, and gives the app its first
   cold-winter, low-rainfall list.
6. **`ca-sierra`** — mountain lists are elevation-banded in a way a box can't
   express; worth doing after `ca-valley` so the foothill/conifer boundary is
   drawn once, from both sides.
7. **`ca-desert`** — last, for the reasons in §2.

Each is a PR of its own, with its own before/after screenshots and its own
changelog entry.

---

## 6. Sources for the West Coast lists

Beyond the ones already in [`DATA_SOURCES.md`](../DATA_SOURCES.md):

| Source | What it carries | Licence / terms |
|---|---|---|
| **Calflora** | Occurrence and county distribution for every California taxon | Free for non-commercial use; cite. Used for native-status checks, not redistributed. |
| **Jepson eFlora (UC Berkeley)** | The authority on California plant identity, range and habitat | Free to consult; text is © the Regents — we cite it, never copy it. |
| **Calscape (CNPS)** | The nursery-facing view: what's actually sold, and where a species is native at ZIP-code resolution | CNPS; cite. This is the honest answer to "can anyone buy this?" |
| **CNPS Rare Plant Inventory** | Whether a species is rare enough that we shouldn't send people looking for it | CNPS; cite. |
| **US Forest Service FEIS** | Fire ecology, silvics, mature size, sprouting behaviour | Public domain. Load-bearing for chaparral, where "how it responds to fire" is a care note. |
| **Xerces Society — western monarch & specialist bees** | The wildlife ties, and the western monarch's decline | Xerces; cite. |
| **EPA Omernik Level III/IV** | The ecoregion codes every region above is defined by | Public domain. Already integrated. |

Host counts remain the weakest number in the West. There is no western equivalent
of the Gaytán matrix, and the NWF/Tallamy figures are ecoregion-specific in a way
our genus-level rows flatten. Every western row therefore carries a `basis` saying
the count is a rounded genus-level estimate — the same stance the Pacific
Northwest list already takes, and the reason
[`docs/us-host-counts-plan.md`](us-host-counts-plan.md) exists.

---

## 7. What this plan does not promise

- **Not a flora.** Each list is what a good local native-plant nursery would
  stock, not what grows in the county.
- **Not elevation-aware.** A box and an ecoregion code can't tell 500 ft from
  5,000 ft. Mountain regions will lean on `zones` in each row and say so in the
  region note.
- **Not a claim about the deserts until `ca-desert` ships.** Uncovered is a real
  answer, and the app gives it.
