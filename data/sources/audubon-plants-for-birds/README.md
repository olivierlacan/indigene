# National Audubon Society — Plants for Birds

**Upstream:** <https://www.audubon.org/native-plants>
**Retrieve:** `cd app && npm run harvest:audubon`
**Reduce:** `cd app && npm run societies`
**Consumed by:** nothing in the app. This is an audit source, not a data source.

## What it is, and why we wanted it

Every gap report we had measured our lists against *occurrence data* — what GBIF
records growing inside a region's box (`npm run candidates`). That answers "does
it grow here". It has no opinion about whether anyone should plant it.

This is the first outside list of the same *kind* as ours: native plants,
chosen by a conservation society, addressed to somebody deciding what to put in
their garden. It makes two checks possible that occurrence data cannot support:

- **Their picks we don't carry** — a gap measured against curation, not density.
- **Our rows their flora has never heard of** — an independent check on our
  native claims, from a source that didn't help write them.

## Two tiers, and why they are never pooled

| Tier | What it is | Size | Fair to use for |
|---|---|---|---|
| `best-results` | Audubon's own picks for a ZIP | dozens | the gap comparison |
| `full-results` | every species BONAP records as native to that ZIP's county | hundreds | the native-status check only |

Diffing our 46 rows against their 434-species county flora would print a "gap"
of 390 that means nothing: one is a garden list, the other is a flora with a
postcode, down to apomictic *Rubus* microspecies nobody sells.

## What is committed here, and what is not

**`raw/` is git-ignored.** Audubon's plant data comes from BONAP's North
American Plant Atlas, and [`DATA_SOURCES.md`](../../DATA_SOURCES.md) carries a
standing ⛔ on BONAP — *"do not scrape or embed; BONAP maps have restrictive
reuse terms"*. Mirroring thousands of their county distribution rows into this
repo would walk into that whichever site we read them through.

So `<region>.json` — the committed file — holds only:

- counts on both sides,
- one line per plant **we** ship: did their curation pick it, does their flora
  list it here at all,
- the **genera** their curation carries that a region of ours never has.

That is a provenance snapshot about our own data, the same shape as
[`wcvp/`](../wcvp/) recording what Kew said about our rows. The species-level
shortlist of their picks is printed by `npm run societies` and deliberately not
stored — the same call [`candidates.mjs`](../../app/scripts/candidates.mjs)
makes, where a shortlist is working output for a human.

## Known limits of the source

Three, all found by running it, all of which bound what the comparison can claim:

1. **Western coverage is much weaker than eastern.** Their flora for Portland
   and Seattle omits Douglas-fir, ponderosa pine, red-flowering currant and
   red-osier dogwood — 38 of our 85 PNW rows are absent, against 1 of 46 in
   northern Michigan. In the West a miss is evidence about their list, not ours.
2. **The bird groups on a card are capped at five**, so that field is a sample
   and never a count. Anything that sorts on its length is measuring the cap.
3. **Generic limits differ.** We write `Berberis aquifolium`, they write
   `Mahonia aquifolium`. Untreated, Oregon grape scores as both a gap and a
   native-status flag. `societies.mjs` carries a small explicit synonym table
   and reports anything outside it rather than merging it.

## Sampling

One ZIP cannot stand for a region, and Audubon resolves a ZIP to a single
county. Each region is sampled at two or three ZIPs, chosen at the places the
region's own `reference` field names — the union is what we compare against, and
every plant records which ZIPs returned it.

## Terms

Plant data from BONAP's North American Plant Atlas; bird associations and the
curation are Audubon's. A one-time audit read of a public database, reduced to
findings about our own rows. Nothing is redistributed and nothing here is fetched
at page-view time.
