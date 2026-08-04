# The gap in the Pacific Northwest and Atlantic France

Two regions, measured rather than estimated. Every number below comes from
`npm run coverage` (`app/scripts/coverage.mjs`), which reads the shipped data
and the committed Gaytán host-count table — so it can be re-run, disagreed with,
and watched over time.

> **Status: measured, then closed.** The tables below are the state that
> prompted the work, kept as written so the before is legible. What has since
> landed:
>
> | | then | now |
> |---|---|---|
> | Pacific NW plants | 44 | **58** — every form ≥3, February closed |
> | Atlantic France plants | 23 | **46** — every form ≥3, every site cell ≥3 |
> | Atlantic France top-30 host genera | 9 of 30 (41%) | **29 of 30 (97%)** |
> | Atlantic France ties / larval hosts | 8 / **0** | see §4 |
>
> Still open, deliberately: the PNW's October bloom month (nothing on the
> candidate list honestly flowers then) and *Ceanothus*, the one keystone genus
> the region still lacks; Atlantic France's November and December; and
> *Taraxacum*, the only top-30 genus left out on plantability grounds.

## The short answer

| | Pacific NW | Atlantic France |
|---|---|---|
| Plants shipped | **44** | **23** |
| Short of the app's own floors (`docs/coverage-plan.md` §1) | **7 rows** | **8 rows** |
| Top-30 food-web genera we ship | *no bundled source* | **9 of 30** — 41% of the caterpillar records |
| Plants naming **no** animal | **9 of 44** | **18 of 23** |
| Larval-host ties (the strongest claim the app makes) | 12 | **0** |
| A published garden-scale list for the same ground | ~140 plants (Metro, Portland metro) | — |

Read the two columns differently, because they fail differently.

**The Pacific Northwest is not far off the bar and is thin at the edges.** Seven
rows clear every floor. Its real problem is shape: 14 trees and 13 shrubs
against 2 grasses, 1 vine, 2 groundcovers and 2 ferns — backwards for a small
garden, where nobody has room for a fifteenth tree.

**Atlantic France is short in the same way and is missing its food web.** Eight
rows clear the floors, but the list carries only 9 of the 30 genera that host
the most caterpillars in the Oceanic-temperate zone, and **not one plant in the
region is recorded as raising anybody's young.** Oak, willow, cherry, birch,
alder and hazel are all on the list — the six biggest larval hosts in Europe —
and all six say nothing about a single animal.

That last line is the finding. The wildlife gap is bigger than the plant gap,
and it is much cheaper to close.

---

## 1. What "missing" means — four denominators, in order of usefulness

"How many are we missing" has no single answer, because the target depends on
what the list is for. Four honest denominators, smallest first:

1. **The app's own floors** (`coverage-plan.md` §1): every form ≥3, every
   moisture × sun cell ≥3, ≥2 things in flower each month Feb–Oct. **PNW is 7
   rows short; Atlantic France is 8.** This is the only figure that means "we
   are currently failing a user outright", and it is small. Clearing it is
   two afternoons of writing.
2. **The food web** — the genera that carry the caterpillars. For Europe this
   is computable: **Atlantic France ships 9 of the top 30** Oceanic-temperate
   host genera, so **21 genera are missing**, and with them roughly 59% of the
   larval-host records the top of that ranking represents. Going to top-50, we
   ship 9 of 50. This is the number that matters most to the app's argument.
3. **A real regional native-plant list** — what a good local native nursery or
   an extension booklet actually offers. Portland's Metro publishes
   [*Native plants for Willamette Valley yards*](https://www.oregonmetro.gov/resources/native-plants-willamette-valley-yards-booklet)
   with **~140 plants** for exactly our PNW reference area. Against that,
   **we are ~96 short**. This is the honest medium-term target, and it matches
   coverage-plan's own test: *"a region's list should look like the answer to
   'what would a good local native-plant nursery stock?'"*
4. **The flora** — ~4,700 vascular taxa in Oregon
   ([OregonFlora](https://oregonflora.org/pages/tutorials.php)); ~4,982
   indigenous vascular species in metropolitan France
   ([INPN/MNHN](https://inpn2.mnhn.fr/informations/biodiversite/france)). **We
   are missing thousands, and always will be.** This denominator is listed only
   so nobody quotes it as a goal. Indigene is not a flora and should never try
   to be one.

So: **7–8 rows to stop failing anyone, ~20 rows to fix the food web in Atlantic
France, ~100 rows to look like a real regional list.**

---

## 2. Pacific Northwest — 44 plants

```
  forms          site types (moisture × sun)        in flower
    tree      14           shade  part   sun          Jan  1 ←
    shrub     13    dry        7    23    23          Feb  1 ←
    perennial 10    mesic     18    41    39          Oct  1 ←
    grass      2 ←  wet       10    22    20          Nov  0 ←
    vine       1 ←                                    Dec  0 ←
    groundcover 2 ←
    fern       2 ←
```

**What's actually wrong:** nothing catastrophic, and four thin drawers. No site
type is under-served — the region passes the site-cell test outright — so the
7-row shortfall is entirely forms and the February bloom gap.

**Missing genera worth a row.** We ship no machine-readable US host table (see
§5), so this list is judgment against the Tallamy/NWF keystone genera, and each
row still needs its own check before it's written:

| Candidate | Why it earns the row |
|---|---|
| ***Crataegus douglasii*** (black hawthorn) | A top-tier host genus with no PNW representative at all. |
| ***Betula papyrifera / occidentalis*** | Birch is a top-five host genus continent-wide and is entirely absent here. |
| ***Malus fusca*** (Pacific crabapple) | Keystone genus; also a wetland-edge tree, which is the region's stated biggest gap. |
| ***Ceanothus sanguineus / velutinus*** | Keystone shrub genus; Mid-Atlantic has its *Ceanothus* and PNW doesn't. |
| ***Frangula purshiana*** (cascara) | Butterfly host and a true small shade tree — a form the list is short of. |
| ***Spiraea douglasii*** | Fills the wetland/rain-garden hole the region is named for. |
| ***Oemleria cerasiformis*** (Indian plum) | Blooms in **February** — the one bloom gap, closed by the plant that is famous locally for closing it. |
| ***Carex obnupta / Juncus*** spp. | A sedge and a rush: grass count 2 → 4, and the wet-meadow palette the list has none of. |
| ***Viola*** spp. | The fritillaries' only larval host — the region has no obligate-host story except milkweed. |
| ***Lomatium*** spp. | The native larval host of the anise swallowtail; also a dry-prairie perennial. |
| ***Sedum oreganum***, ***Eriogonum*** spp. | Groundcover count 2 → 4, dry/sun, and both are host genera for blues and hairstreaks. |
| ***Adiantum aleuticum***, ***Woodwardia fimbriata*** | Ferns 2 → 4. |

Twelve rows would take the PNW from 44 to ~56, clear every floor with room to
spare, and fix the tree-heavy shape.

---

## 3. Atlantic France — 23 plants

```
  forms          site types (moisture × sun)        in flower
    tree       7           shade  part   sun          Jan  1 ←
    shrub      7    dry        6    12    12          Aug  2
    perennial  4    mesic     12    23    22          Sep  2
    grass      1 ←  wet        3     8     7          Oct  1 ←
    vine       2 ←                                    Nov  1 ←
    groundcover 1 ←                                   Dec  0 ←
    fern       1 ←
```

The same tree-and-shrub tilt, one notch worse, plus a **late-summer-into-autumn
nectar collapse** — August through November is where colonies starve, and the
list drops from 12 things in flower in May to two, two, one, one.

**The 21 top-30 host genera we don't ship**, with the Atlantic-France native
that would carry each. Ranked as the source ranks them, by Lepidoptera species
recorded on the genus in the Oceanic-temperate zone:

| Genus | Lep spp. | The plant to write | Also fixes |
|---|---|---|---|
| *Populus* | 258 | *Populus tremula* (tremble) | — |
| *Vaccinium* | 227 | *Vaccinium myrtillus* (myrtille) | shrub, acid shade, berries |
| *Rumex* | 192 | *Rumex acetosa* (oseille sauvage) | perennial |
| *Festuca* | 186 | *Festuca rubra* | **grass 1 → 2** |
| *Rubus* | 186 | *Rubus fruticosus* agg. (ronce) | Aug bloom, autumn berries |
| *Poa* | 173 | *Poa nemoralis* | **grass, and shade grass** |
| *Plantago* | 170 | *Plantago lanceolata* | groundcover-ish, long bloom |
| *Taraxacum* | 142 | *Taraxacum* agg. | early nectar (plantability caveat) |
| *Artemisia* | 132 | *Artemisia vulgaris* | **Aug–Sep** |
| *Galium* | 127 | *Galium verum* (caille-lait jaune) | **Jul–Sep**, groundcover |
| *Genista* | 127 | *Genista tinctoria* / *anglica* | the Atlantic heathland signature |
| *Ulmus* | 126 | *Ulmus glabra* | (flag the elm-disease caveat honestly) |
| *Calluna* | 118 | ***Calluna vulgaris*** (bruyère) | **Aug–Sep bloom + dry acid + shrub** |
| *Pyrus* | 116 | *Pyrus cordata* | an Atlantic-endemic tree |
| *Fagus* | 113 | *Fagus sylvatica* | already written for Continental — reuse |
| *Rosa* | 113 | *Rosa arvensis* / *canina* | autumn hips |
| *Cytisus* | 107 | *Cytisus scoparius* (genêt à balais) | the other heathland signature |
| *Lotus* | 106 | ***Lotus corniculatus*** | **groundcover 1 → 2, and two animals already in the catalog** |
| *Trifolium* | 105 | *Trifolium pratense* | — |
| *Tilia* | 100 | *Tilia cordata* | Jun–Jul nectar at scale |
| *Centaurea* | 88 | *Centaurea nigra* | **Jul–Oct** — the deepest gap |

Note how the ranking and the holes agree. **Calluna, Centaurea, Galium,
Artemisia and Rubus each fix the autumn nectar collapse *and* add a top-30 host
genus.** *Lotus corniculatus* adds a groundcover, a summer bloom, a top-30
genus, and two animals we have already written. Those six rows are the highest
value per row anywhere in the project right now.

---

## 4. The wildlife layer — the sharpest gap, and the cheapest

The named-animal layer (`app/src/data/wildlife.ts`) is 43 animals and 208 ties
across eight regions. It is badly lopsided:

- **Atlantic France: 8 ties, 5 plants of 23, and zero larval hosts.** The layer's
  own honesty stance says a larval host is the strongest tie there is; the
  region makes that claim about nothing.
- **PNW: 59 ties, 35 plants of 44, 12 of them hosts** — healthy by comparison.
  Its nine untied plants are the conifers and the ferns.

Neither gap needs a new plant. **The plants are already on the list; nobody has
written down who eats them.**

**Atlantic France — ties available today**, on rows we already ship:

| Plant (already shipped) | Animal | Tie |
|---|---|---|
| *Quercus robur* | purple hairstreak (*Favonius quercus*); jay | host; acorns |
| *Salix caprea* | purple emperor (*Apatura iris*); early bumblebees | host; the first pollen of the year |
| *Frangula alnus* | **brimstone** (*Gonepteryx rhamni*) | **sole host** — the strongest card in the deck |
| *Ilex aquifolium* | holly blue (*Celastrina argiolus*) | host (first brood) |
| *Corylus avellana* | **hazel dormouse** (*Muscardinus avellanarius*) | nuts — and the catalog has only two mammals |
| *Primula veris* | Duke of Burgundy (*Hamearis lucina*) | host |
| *Betula pendula* | siskin, redpoll | seeds |
| *Sorbus aucuparia* | winter thrushes *(already in the catalog)* | berries |
| *Deschampsia cespitosa* | grass skippers *(already in the catalog)* | host |
| *Digitalis purpurea* | bumble bees *(already in the catalog)* | nectar, long-tongued |
| *Sambucus nigra* | berry songbirds | berries |
| *Hyacinthoides non-scripta* | early solitary bees | nectar |

That is **~14 ties across 12 of the 18 silent plants**, needing about six new
catalog entries (purple hairstreak, purple emperor, brimstone, holly blue, hazel
dormouse, Duke of Burgundy). Four of the ties need nothing new at all.

Twelve animals already in the catalog are Europe-capable and unused in Atlantic
France — common blue, six-spot burnet, comma, grass skippers among them. Several
become usable the moment §3's rows land (*Lotus* brings the common blue and the
six-spot burnet with it).

**PNW — ties available today:** `conifer-seed-finches` is in the catalog, used
by the French Alps, and would fit *Pseudotsuga menziesii*, *Tsuga heterophylla*
and *Thuja plicata* — three of the nine silent plants — immediately.

One small correction to make while in there: `mediterranean-warblers` is tied to
*Hedera helix* in Atlantic France. Ivy berries do feed wintering *Sylvia*
warblers on the Atlantic coast, but the animal's name says otherwise, so either
the name or the tie should change.

---

## 5. How to fill it — in order

1. **Write the wildlife ties first.** Fourteen ties in Atlantic France, three in
   the PNW, roughly six new catalog animals. No new plant rows, no new data
   source, and it turns the region with the emptiest food-web story into one
   with an obligate-host headline (brimstone/*Frangula*). **Highest value per
   hour in the project.**
2. **Write the six double-duty Atlantic France rows** — *Calluna vulgaris*,
   *Lotus corniculatus*, *Centaurea nigra*, *Rubus fruticosus*, *Galium verum*,
   *Artemisia vulgaris*. Each closes a bloom gap **and** adds a top-30 host
   genus; together they take the region from 9/30 to 15/30 and end the autumn
   nectar collapse.
3. **Clear the PNW's twelve** from §2, starting with *Oemleria* (the February
   gap), the sedge and rush (the grass floor and the wetland hole), and
   *Crataegus*/*Betula* (the two absent keystone genera).
4. **Take Atlantic France down the rest of the top-30 list** — *Populus*,
   *Vaccinium*, *Rumex*, *Festuca*, *Poa*, *Plantago*, *Genista*, *Cytisus*,
   *Rosa*, *Tilia*, *Trifolium*, *Pyrus*, *Ulmus*, *Fagus*. That is the run from
   23 plants to ~40 and from 41% of the top-30 host records to ~85%.
5. **Find or build the US equivalent of the Gaytán table.** This is the real
   structural gap the exercise exposed: *we can rank Europe's next twenty plants
   mechanically and we cannot do the same for the United States.* Every US
   candidate above is judgment, and it shouldn't have to be. **Started** — the
   plan is [`docs/us-host-counts-plan.md`](us-host-counts-plan.md) and the probe
   is `app/scripts/probe-globi.mjs`, run by the *US host counts (GloBI probe)*
   workflow because the API refuses the build sandbox's egress. It ships
   nothing: the gate is whether GloBI can tell a caterpillar eating a leaf from
   an adult sipping at a flower, and that verdict comes back from a runner.
6. **Then the GBIF candidate generator** (`coverage-plan.md` §4 step 2). With
   §5 done, "which twenty plants next" becomes a query instead of a memory
   exercise, for every region at once.

Steps 1 and 2 are perhaps a week of writing between them and move the app's
central argument more than anything else on the board. Step 5 is the one that
stops this document needing to be written again by hand.

## 6. What this does not answer

- **Whether each candidate is plantable.** Coverage-plan §2 step 5 asks whether
  the regional nursery trade actually sells it; nothing here checks that, and
  *Taraxacum* and *Rubus fruticosus* in particular need a real decision about
  recommending a weedy aggregate to a beginner.
- **Whether each candidate is native at the spot**, as opposed to native in the
  region. That waits on USDA PLANTS county data and Kew WCVP.
- **Any US host count.** §5 exists because we genuinely cannot compute one today.
- **The other six regions.** `npm run coverage` prints all eight; the two
  Florida lists and Mediterranean France are in worse shape than either region
  here (Mediterranean France ships **2 of its top 30** host genera and has no
  wet site type at all).
