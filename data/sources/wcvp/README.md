# WCVP — the World Checklist of Vascular Plants (Kew)

**Status: admitted as the native-status source for regions with no national
flora of our own.** `DATA_SOURCES.md` has named WCVP as the global backbone
since the scaling section was written; Ireland is the first region that actually
stands on it.

- Upstream: <https://powo.science.kew.org/> · reached through the GBIF checklist
  dataset `f382f0ce-323a-4091-bb9f-add557f3a9a2`
- Publisher: Royal Botanic Gardens, Kew
- Licence: **CC BY 4.0**. Attribution: "Native range from the World Checklist of
  Vascular Plants (WCVP), Royal Botanic Gardens Kew."
- Refresh: `cd app && npm run native:check -- --region ireland` → `ireland.json`

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

Through GBIF's species API, with an **exact** name filter:

```
/v1/species?datasetKey=<wcvp>&name=Crataegus%20monogyna
/v1/species/<key>/distributions
```

`search?q=` is not a substitute. It ranks and pages, so a common binomial sits
behind hundreds of fuzzy hits and reads as absent — the first version of this
lookup reported that hawthorn, foxglove, bramble, ribwort plantain and red
clover were unknown to WCVP. All five are in it.

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
