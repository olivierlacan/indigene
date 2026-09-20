# What a society's own list says about ours

`npm run harvest:audubon` then `npm run societies`. Run 2026-09-20 against the
National Audubon Society's Plants for Birds database, sampled at two or three
ZIP codes per region.

## Why this was worth doing

Our gap tooling measured us against occurrence data — what GBIF records growing
inside a region's box. That answers *does it grow here*, which is not the same
question as *would anybody recommend planting it*. Occurrence data has no
opinion.

Audubon's database has one, and it is the same kind of artifact as ours: native
plants, chosen by a conservation society, addressed to somebody deciding what to
put in their garden. Holding the two lists side by side answers two things at
once — what they recommend and we don't carry, and whether our native claims
survive a source that didn't help write them.

## The headline

| Region | Ours | Their picks | Ours among their picks | Their picks we lack | …new genera | Ours absent from their flora |
|---|---|---|---|---|---|---|
| Mid-Atlantic | 44 | 159 | 35 (80%) | **124** | 71 | 2 |
| Northern Michigan | 46 | 109 | 34 (74%) | **75** | 49 | 1 |
| N & C Florida | 24 | 65 | 13 (54%) | **52** | 39 | 4 |
| South Florida | 21 | 26 | 8 (38%) | 18 | 17 | 5 |
| Pacific Northwest | 85 | 47 | 30 (35%) | 17 | 9 | **38** |
| Southern California | 64 | 33 | 13 (20%) | 20 | 13 | **39** |
| Central California Coast | 64 | 23 | 11 (17%) | 12 | 8 | **43** |

Read the last column first, because it decides whether the rest of the row means
anything.

**The comparison works in the East and breaks in the West.** In the Mid-Atlantic
and Michigan, 1–2 of our plants are missing from Audubon's flora — the two lists
are describing the same ground. West of the Rockies, 38 to 43 of ours are
missing, and the missing ones are Douglas-fir, ponderosa pine, red-flowering
currant, snowberry and red-osier dogwood. Nobody thinks those aren't native to
Portland. That is their coverage failing, not ours, and it means **no western
row in this table is evidence about Indigene.** Their Key West sample returned
nothing at all.

So there are two findings, not one.

## Finding 1 — in the East, the gap is real and large

Where the benchmark holds, they recommend two to three times what we carry:

- **Mid-Atlantic: 124 of their 159 picks we don't have**, 71 of them genera this
  region's list has never carried — hornbeam, hickory, hackberry, buttonbush,
  chokeberry, turtlehead, sea oats, nodding onion.
- **North & Central Florida is our thinnest region against theirs** — 24 rows
  against 65 picks, missing 39 genera including persimmon, coralbean, crossvine,
  Carolina jessamine and blanketflower.
- **Michigan: 75 missing, 49 new genera** — balsam fir, hickory, hornbeam,
  buttonbush, yarrow.

This is not the same list `npm run candidates` produces. Candidates ranks by
occurrence density and host-genus weight; these are plants a society decided to
put in front of a gardener. Where the two agree, the case for adding is about as
strong as it gets from a desk.

## Finding 2 — the validation is the better news

Of our Mid-Atlantic rows, **80% are among Audubon's own curated picks**; Michigan
74%. We are not carrying a list of eccentric choices. Where we and they cover
the same ground, we mostly chose the same plants — we just stopped sooner.

## What to actually look at

Five rows where a flora that didn't help write our data doesn't list our plant on
our ground. Most look like gaps in *their* database. One does not:

| Row | Region | Read |
|---|---|---|
| **Echinacea purpurea** | Mid-Atlantic | **Check this one.** Our own note hedges — "widely native in the East/Midwest" — and the flora puts its native range in the Ohio Valley and Southeast, with the Northeast as introduced. Purple coneflower is one of the most recommended perennials we carry. |
| *Andropogon gerardii* | Mid-Atlantic | Big bluestem in Pennsylvania is not in doubt; likelier their sampling. Worth one look. |
| *Matteuccia struthiopteris* | Michigan | Their flora carries five ferns in total. Their gap. |
| *Zamia integrifolia*, *Bursera simaruba* | Florida | Coontie is a cycad and gumbo limbo is our South Florida featured plant. Their gap — and their South Florida sample is a single ZIP. |

## Limits of this, stated once

- **Audubon is a bird organization.** Its curation over-weights fruit, nuts and
  seed and under-weights herbaceous pollinator plants. A plant it skips is not
  thereby unimportant.
- **Their two tiers are different kinds of list** and are never pooled here. The
  curated picks are the comparison; the county flora is only ever used to check
  native status. Diffing our 44 against their 652-species flora would print a
  "gap" of 600 that means nothing.
- **A ZIP is a county.** Our regions are much bigger, so each is sampled at two
  or three points and the union is compared.
- **Generic limits differ.** We write *Berberis aquifolium*, they write
  *Mahonia*. `societies.mjs` carries an explicit synonym table and reports what
  falls outside it rather than merging it.

## France and Ireland: no comparison possible

Not for want of trying. **No equivalent artifact exists.** France's botanical
bodies publish floras (Conservatoires botaniques nationaux, Tela Botanica's
BDTFX) and nursery provenance lists (Végétal local) — nobody publishes a
regional "plant these" list for gardeners, which is the thing this compares.
Ireland's All-Ireland Pollinator Plan publishes short themed lists ("top 10 for
a hedgerow"), which is closer in intent but far too small to diff a 67-row
region against.

Both are also unreachable from this sandbox. That is the lesser problem: even
with full network access, there is nothing of the right shape to fetch. The
outreach directory in [`outreach/`](outreach/native-plant-societies.md) says the
same thing from the other direction — these countries have no native plant
society in the US sense, and the function is split across bodies that each do
one part of it.

## What this changes

Nothing shipped. No row was edited and no score moved on the strength of this;
the committed artifact records what an outside list said about our rows, the way
`wcvp/` records what Kew said. Two follow-ups it argues for:

1. **Re-check *Echinacea purpurea* for the Mid-Atlantic** against USDA PLANTS.
2. **The eastern regions are the ones to grow**, and for the first time the next
   forty species are named by somebody outside this repo. Mid-Atlantic and North
   & Central Florida are furthest behind their own society's recommendations.

It also gives the outreach initiative its opening line. The playbook's first ask
is *"here are the plants we list for your region — what did we get wrong?"* This
is that question answered by machine for one organization. A chapter's
horticulture chair would answer it better.
