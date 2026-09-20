# Lady Bird Johnson Wildflower Center — Recommended Species

**Upstream:** <https://www.wildflower.org/collections/>
**Retrieve:** `cd app && npm run harvest:wildflower`
**Reduce:** `cd app && npm run societies`
**Consumed by:** nothing in the app. An audit source, not a data source.

## Why a second society list

The first one ([`audubon-plants-for-birds/`](../audubon-plants-for-birds/))
turned out to be trustworthy in the East and unusable in the West: its flora for
Portland has no Douglas-fir, and 38 of our 85 PNW rows are absent from it. A
comparison that cannot run where our lists are longest is not much of a
comparison.

The Wildflower Center's per-state Recommended Species lists cover the West
properly — 226 species for Washington, 300 for northern California — and they
already split the two states where a state is plainly too coarse: California
into Northern and Southern, Florida into North, Central and South.

## The three things it is not

1. **Not a flora.** There is no second tier here. Absence means *they did not
   recommend it*, never *it is not native*. The native-status check in
   `npm run societies` leans on Audubon's flora tier, and the report says which
   source each number came from.
2. **Not region-scoped.** A state is bigger than anything we ship — Washington
   and Oregon both run east of the Cascade crest into country our PNW list
   deliberately excludes. "Their picks we lack" is an over-count here in a way
   it is not for a ZIP-scoped source.
3. **Not fully independent of us.** [`DATA_SOURCES.md`](../../DATA_SOURCES.md)
   already lists the Wildflower Center as a reference for size, bloom and
   culture notes in our seed data. What *is* independent is the **selection**:
   nobody consulted their state list when deciding which species a region of
   ours carries. So a gap here is evidence; an agreement on a bloom month is
   not.

Their lists are also **selective**, not comprehensive: 226 recommendations for a
state with thousands of natives. Snowberry, camas and black cottonwood are all
absent from the Washington and Oregon lists. Nobody thinks those aren't native
to Washington — they just aren't on this list.

## Region → collection codes

| Region | Codes | Note |
|---|---|---|
| Mid-Atlantic | `PA` `NJ` `MD` `DE` `VA` | NY and New England are inside our box but left out: nine states' recommendations inflate the gap with specialties this Pennsylvania-referenced list never claimed |
| Northern Michigan | `MI` | whole state, including the warmer south we exclude |
| Pacific Northwest | `WA` `OR` | both run east of the Cascade crest; we do not |
| Southern California | `CA_south` | |
| Central California Coast | `CA_north` | |
| North & Central Florida | `FL_central` `FL_north` | |
| South Florida | `FL_south` | |

## What is committed here

`raw/` is git-ignored; `<region>.json` holds counts, the verdict on each row
**we** ship, and the genera their list carries that we never have. Their species
list is printed by `npm run societies` and not stored — the same call
[`candidates.mjs`](../../app/scripts/candidates.mjs) makes, where a shortlist is
working output for a human.

## Upstream quirks found by running it

- **Their result count is off by one.** Washington's page claims 226 results and
  serves 225, the first page carrying 99 rows rather than 100. The harvester
  tolerates a discrepancy of two and prints it; anything larger fails the run.
- **Each plant is linked twice** (thumbnail and name), so rows are deduplicated
  by plant id. An earlier parser matched link and name in one regex and lost 25
  of Washington's 226 without complaint — hence the strict count check.
- **The plain `CA` collection is broken upstream**: it answers 200 with an empty
  shell and no result count. `CA_north` and `CA_south` work, and the harvester
  fails loudly on a missing count rather than recording an empty list.

## Terms

A one-time audit read of a public database, reduced to findings about our own
rows. Individual facts (which species a state list names) are not copyrightable;
nothing is redistributed and nothing here is fetched at page-view time.
