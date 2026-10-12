# WCVP — the World Checklist of Vascular Plants (Kew)

**Status: the one native-status source every region can be re-asked against.**
`DATA_SOURCES.md` has named WCVP as the global backbone since the scaling
section was written. Ireland was the first region to stand on it; all twelve now
do.

Widening it was not the original plan. It happened because the lists we had
been measuring against are *recommendation* lists: they can show a gap and
cannot settle range, and the one with a flora tier has no Douglas-fir in
Portland. WCVP answers in Oregon exactly as well as in Ireland, at the same
grain, under the same licence, and it had simply never been asked. The rule it
now satisfies is `DATA_SOURCES.md` → *What "native here" means, exactly*.

## Scope, and where it is weaker

TDWG level-3 areas are **states** over the US and **countries** over Europe, so
the check is as fine as the region:

| Region | Areas | Strength |
|---|---|---|
| Mid-Atlantic | PEN NWJ DEL MRY VRG NWY CNT RHO MAS WVA | good — one native area is enough, and the breakdown is stored |
| Northern Michigan | MIC | good |
| Pacific Northwest | WAS ORE | good |
| Both Californias | CAL | **weak** — one area for deserts and coast alike |
| Both Floridas | FLA | **weak** — one area for the panhandle and the Keys |
| Ireland | IRE | good — the whole island, which is the claim |
| The four French regions | FRA (+ COR) | **floor check only** — it can catch a plant that is not French at all; it cannot tell Provence from Picardy. The rows' `basis` lines cite the CBN network and INPN for the finer claim |

A weak area still earns its place: it catches the plant that is not native to
the country or state at all, which is the error that matters most.

- Upstream: <https://powo.science.kew.org/> · reached through the GBIF checklist
  dataset `f382f0ce-323a-4091-bb9f-add557f3a9a2`
- Publisher: Royal Botanic Gardens, Kew
- Licence: **CC BY 4.0**. Attribution: "Native range from the World Checklist of
  Vascular Plants (WCVP), Royal Botanic Gardens Kew."
- Refresh: `cd app && npm run native:check -- --region <id>` → `<id>.json`, for any
  region in the script's `TDWG_AREA` table (all twelve)

## What it is admitted for

**One claim: is this plant native in this place?** WCVP records a native and
introduced range per TDWG level-3 botanical area — the standard the world's
floras are indexed on. For Ireland that area is `TDWG:IRE`, which covers the
whole island, Republic and Northern Ireland together, at exactly the resolution
a region needs.

It replaces nothing. The US regions keep USDA PLANTS and the French ones keep
TAXREF and Tela Botanica: a national flora beats a global checklist where one
exists, because it is maintained by the people who walk the ground. WCVP is what
makes a region *possible* where no such list is ours to use.

## How to query it, and the trap

Through GBIF's species API:

```
/v1/species?datasetKey=<wcvp>&name=Crataegus%20monogyna
/v1/species/<key>/distributions
```

**The trap is asking without pinning the rank.** A plain
`search?q=Crataegus+monogyna` returns twenty results and the species itself is
not among them — infraspecific taxa crowd it out — so a common binomial reads as
absent. The first version of this lookup duly reported that hawthorn, foxglove,
bramble, ribwort plantain and red clover were unknown to WCVP. All five are in
it, and the fault was in the question.

Two ways to ask it properly, both correct:

| | |
|---|---|
| `species?…&name=<binomial>` | an exact canonical-name filter. What this script uses. |
| `species/search?…&q=<binomial>&rank=SPECIES` | ranked search, pinned to species rank. What `candidates.mjs` uses. |

Measured 2026-09-20: without `rank=SPECIES`, hawthorn, foxglove and ribwort
plantain return 0 exact matches in the top 20; with it, 1 accepted match each.

Reading a distribution row:

| What the record says | Means |
|---|---|
| area present, `establishmentMeans` empty | **native** there |
| area present, `establishmentMeans: INTRODUCED` | introduced there |
| area not in the list at all | not recorded there |

## The measured result

`npm run native:check -- --region ireland`, run 2026-09-20: **all 67 rows come
back NATIVE.** The snapshot is `ireland.json`, committed so upstream drift shows
up in a diff.

Two things that verification caught while the list was being written, both
correct and both the kind of thing a person guesses wrong: **beech is introduced
in Ireland** (*Fagus sylvatica*, `INTRODUCED`), and **lime and hornbeam are not
there at all** (*Tilia cordata*, *Carpinus betulus*, `ABSENT`). Ireland's flora
is smaller than Britain's or France's because the sea closed behind the ice
before those species walked back north, and the checklist says so plainly.

## Where it disagrees with Irish botanical opinion

It disagrees in one specific, consistent place: **the Lusitanian element**.
WCVP records the Killarney strawberry tree (*Arbutus unedo*), Mackay's heath
(*Erica erigena*) and St Dabeoc's heath (*Daboecia cantabrica*) as **introduced**
in Ireland. Irish floras treat them as native relics of a warmer, wetter
Atlantic past — and they are the plants an Irish botanist would name first.

**The rows do not ship.** Not because WCVP is certainly right — this is a real
and long-running argument, and BSBI's *Plant Atlas 2020* would be the second
opinion worth having — but because a row whose own cited source calls it
introduced is a claim we cannot stand behind. That costs Ireland its most famous
tree, which is a genuine loss and the honest price.

If a second authority becomes reachable (BSBI, or the National Biodiversity Data
Centre), this is the first thing to re-open. Until then the absence is
deliberate and is recorded here rather than left as a gap somebody fills by
accident.

## Who else could answer, outside Europe and North America (2026-10-02)

Before a region is planned for Africa, South America or Asia, something has to
assert native status there. The candidates were asked directly, through the same
GBIF checklist API this file already uses.

| Continent | Candidate | Grain | Native vs introduced? | Verdict |
|---|---|---|---|---|
| South America | Flora e Funga do Brasil (JBRJ), CC BY 4.0 | **Brazilian state** (`BR-PR`, `BR-MG`, …) | yes, `NATIVE` per state | **Better than WCVP here.** The grain VASCAN gives Canada |
| Africa | South African National Plant Checklist (SANBI), CC BY 4.0 | province, as one comma-joined string | **no — nothing** | **Unusable alone** |
| Asia | GreenList 2.02rc (Japan), CC BY 4.0 | national | yes, by inclusion | A second opinion, not a finer one |
| anywhere | WCVP | TDWG level 3 | yes | The backbone, as before |

**Why SANBI's checklist cannot carry a native claim, in one example.** Asked for
*Acacia mearnsii* — Australian black wattle, among the worst invasive trees in
South Africa — it answers with six provinces and no establishment status, in a
record shaped exactly like the one it gives *Protea cynaroides*, a Cape endemic.
*Lantana camara* reads the same way. GBIF flags the distribution
`DISTRIBUTION_INVALID`, and there is no status on the taxon record or in its
species profile either. A region standing on it would have no way to keep black
wattle off a Cape Town list, which is the one thing `native: true` exists to
prevent.

WCVP, asked the same question, calls black wattle `INTRODUCED` in Cape Provinces,
Free State, KwaZulu-Natal and Northern Provinces, and native in its Australian
home states. **So Africa's native-status gate passes — on WCVP, not on the
national checklist.** Those four TDWG units are a real regional grain, not a
country-level lump.

**Asia's limit is grain, not status.** WCVP treats Japan as a single unit, and
mainland India as another, so a Tokyo list and a Sapporo list would be identical
however differently they grow. Japan's own GreenList — a checklist of *wild*
flowering plants, which simply omits black locust — confirms native status but
carries no sub-national locality either, so it cross-checks WCVP rather than
refining it. China is the exception: WCVP splits it into North-Central,
South-Central, Southeast, Manchuria and more.

That coarseness is not a blocker, because it is already the shipped norm:
`check-native.mjs` asserts Ireland at `TDWG:IRE`, the whole island, and Auckland
at `TDWG:NZN`, the whole North Island. A region's **box** does the fine work, as
it does for every region built on a code.
