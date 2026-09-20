# What a society's own list says about ours

`npm run harvest:audubon`, `npm run harvest:wildflower`, then `npm run
societies`. Run 2026-09-20 against two lists: the **National Audubon Society**'s
Plants for Birds (ZIP-scoped, with a flora tier) and the **Lady Bird Johnson
Wildflower Center**'s Recommended Species by state (state-scoped, no flora
tier).

## Why this was worth doing

Our gap tooling measured us against occurrence data — what GBIF records growing
inside a region's box. That answers *does it grow here*, which is not the same
question as *would anybody recommend planting it*. Occurrence data has no
opinion.

These lists have one, and they are the same kind of artifact as ours: native
plants chosen by a conservation organization for somebody deciding what to put
in their garden.

## Why two sources

The first one only worked in half the country. Audubon has a flora tier, which
is the only thing that makes a native-status check possible — but its western
coverage is thin enough to be useless: its flora for Portland has no
Douglas-fir. The Wildflower Center covers the West properly and already splits
California and Florida, but it is a recommendation list with no flora tier, so
it can show a gap and can never settle native status.

Neither is authoritative and the report never averages them. Every block names
its source and what that source can be evidence of.

## The headline

| Region | Ours | Audubon picks | …we lack | Wildflower picks | …we lack | Ours absent from Audubon's flora |
|---|---|---|---|---|---|---|
| Mid-Atlantic | 44 | 159 | 124 | 212 | 180 | 2 |
| Northern Michigan | 46 | 109 | 75 | 157 | 123 | 1 |
| N & C Florida | 24 | 65 | 52 | **374** | **354** | 4 |
| South Florida | 21 | 26 | 18 | 118 | 106 | 5 |
| Pacific Northwest | 85 | 47 | 17 | 228 | 174 | 38 ⚠ |
| Southern California | 64 | 33 | 20 | 219 | 196 | 39 ⚠ |
| Central California Coast | 64 | 23 | 12 | **300** | **253** | 43 ⚠ |

⚠ = the script refuses these as a native-status check. A flora that cannot place
a quarter of a region's rows is not describing the same ground we are, so the
run prints *"not usable as a native-status check here"* and the number is about
Audubon's coverage, not our claims. It fires in exactly the three western
regions and nowhere else.

## Finding 1 — the gap is real, and bigger than one source suggested

Both lists recommend several times what we carry, everywhere:

- **North & Central Florida is furthest behind** — 24 rows against 374
  recommendations, 222 of them genera the region has never carried.
- **Central California Coast**: 64 against 300.
- **Pacific Northwest**: 85 against 228, and this is our longest list.
- **Mid-Atlantic**: 44 against 212, 98 new genera — hornbeam, hickory,
  hackberry, buttonbush, chokeberry, turtlehead.

This is not the list `npm run candidates` produces. Candidates ranks by
occurrence density and host-genus weight; these are plants an organization
decided to put in front of a gardener.

## Finding 2 — the validation

Where the benchmark holds, **80% of our Mid-Atlantic rows and 74% of Michigan's
are among Audubon's own curated picks.** We are not carrying a list of eccentric
choices; we chose much the same plants and stopped sooner.

## Finding 3 — the native-status check comes back almost clean

Against the sources that can actually answer it, **the Mid-Atlantic has zero
rows that no consulted list carries.** Michigan has one, and the Floridas two
and three.

| Row | Region | Read |
|---|---|---|
| *Matteuccia struthiopteris* | Michigan | Ostrich fern. Audubon's flora carries five ferns in total. Their gap. |
| *Zamia integrifolia*, *Myrcianthes fragrans* | N & C Florida | Coontie is a cycad; neither list handles those well. |
| *Zamia integrifolia*, *Rivina humilis*, *Passiflora suberosa* | South Florida | Their South Florida sample is effectively one ZIP — Key West returned nothing at all. |

**Correction to the first run of this report.** It flagged *Echinacea purpurea*
in the Mid-Atlantic as a native claim to re-check, on Audubon's flora alone. The
Wildflower Center **does** recommend it across PA, NJ, MD, DE and VA, and the
species is uncontroversially native to Virginia, which our region includes. Two
sources disagree and the region spans both answers, so it is not the finding it
looked like. *Andropogon gerardii*, flagged the same way, is likewise
recommended. Both are vouched; neither needs changing.

That is the honest result of the second source: it removed the only finding the
first one produced.

## Limits of this, stated once

- **Audubon is a bird organization.** Its curation over-weights fruit, nuts and
  seed and under-weights herbaceous pollinator plants.
- **The Wildflower Center is selective, not comprehensive** — 226
  recommendations for a state with thousands of natives. Snowberry, camas and
  black cottonwood are all absent from its Washington and Oregon lists. Nobody
  thinks those aren't native to Washington.
- **It is also state-scoped**, wider than any region we ship, so its gap column
  over-counts: Washington and Oregon both run east of the Cascade crest into
  country our list deliberately excludes.
- **And it is not fully independent.** We already cite the Center for size,
  bloom and culture notes. Only the *selection* is outside evidence.
- **Audubon's two tiers are never pooled.** Its curated picks are the gap
  comparison; its county flora is only ever used for native status. Diffing 44
  rows against a 652-species flora would print a gap of 600 that means nothing.
- **Generic limits differ, and California is the worst of it.** We write
  *Berberis aquifolium*, they write *Mahonia*; deerweed is *Acmispon glaber* to
  us and *Lotus scoparius* to them, where both halves of the name moved.
  `societies.mjs` carries an explicit genus table, a whole-name table for the
  cases where the epithet moved too, and reports anything outside them rather
  than merging it.

## What we could not get

- **Calscape** — CNPS's own garden database, and the one list that would settle
  California. It sits behind a Cloudflare bot challenge (`cf-mitigated:
  challenge`). That is CNPS deliberately declining automated access and it was
  not worked around. The right way to get it is to ask them, which is what
  [`outreach/playbook.md`](outreach/playbook.md) is for.
- **Ireland** — reachable now, and still not comparable. The All-Ireland
  Pollinator Plan's lists are *pollinator-friendly*, not native-only: they
  deliberately include garden exotics. Diffing a 67-row native list against them
  would measure the wrong thing, and the lists live in a PDF booklet rather than
  as data.
- **France** — unchanged, and not a network problem. The Conservatoires
  botaniques nationaux publish floras and Végétal local publishes nursery
  provenance lists. Nobody publishes a regional "plant these" list for
  gardeners, which is the artifact this compares. The outreach directory says
  the same thing from the other side.

## What this changes

Nothing shipped. No row was edited and no score moved; the committed artifacts
record what outside lists said about our rows, the way `wcvp/` records what Kew
said.

1. **No native-status finding survived.** The one the first run produced —
   *Echinacea purpurea* in the Mid-Atlantic — was withdrawn when the second
   source vouched for it. Adding a source removed a finding rather than adding
   one, which is the outcome worth having.
2. **The eastern and Florida regions are the ones to grow**, and the next
   several dozen species are now named by organizations outside this repo.
   North & Central Florida is furthest behind its own societies' lists by a wide
   margin: 24 rows against 374 recommendations.
3. **California needs a California source.** Both benchmarks are weakest exactly
   where our two California lists are longest, and the list that would fix it is
   the one we have to ask for.

It also gives the outreach initiative its opening line. The playbook's first ask
is *"here are the plants we list for your region — what did we get wrong?"* This
is that question answered by machine, twice. A chapter's horticulture chair
would answer it better, and in California they are the only ones who can.
