# GloBI — Global Biotic Interactions

**Status: one gate failed, one passed, and the second one now ships.** GloBI
still cannot source `hostLepCount` (§2) — but it *can* name a specific animal on
a specific plant and cite the study that recorded it, which is the whole
deliverable of the wildlife-ties layer (§3). That is what
`app/scripts/wildlife-candidates.mjs` consumes.

## What this is for

`docs/coverage-gap-pnw-france-atlantic.md` §5 named the one structural hole the
coverage audit found: **Europe's next twenty plants can be ranked mechanically
and America's cannot.** The four French regions get `hostLepCount` computed from
the [Gaytán matrix](../eu-lep-plant-matrix/), so "Atlantic France is missing
*Populus*" is a fact. The Pacific Northwest, Mid-Atlantic and both Florida lists
carry genus-level estimates anchored on Tallamy/NWF, because no openly-licensed
US table exists in a form we can bundle. Every American candidate species is
therefore judgment, and it shouldn't have to be.

GloBI is the most promising fix: openly licensed, machine-readable, one
aggregated dump of published plant↔animal interaction records with citations,
covering far more than Lepidoptera (bees, birds, mammals).

- Upstream: <https://www.globalbioticinteractions.org> · API
  <https://api.globalbioticinteractions.org>
- Archived dumps: Zenodo, DOI [10.5281/zenodo.1145474](https://doi.org/10.5281/zenodo.1145474)
- Licence: the aggregate index is CC0/CC-BY; **individual contributed datasets
  carry their own terms**, which is the licensing question to settle before
  shipping — every record GloBI serves names its source study, so this is
  checkable rather than assumed. §3 checks it: it is true, and the study name is
  what lands in each tie's `basis`.

## What's here

| File | What it is | Committed? |
|---|---|---|
| `probe.json` | what GloBI answered, and when — the six questions in `app/scripts/probe-globi.mjs` | yes |
| `wildlife-ties.json` | per region, the animals GloBI names on the plants we ship, with record counts, life stages and source studies — what `app/scripts/wildlife-candidates.mjs` proposed and a human then curated | yes |

Refresh: `npm run probe:globi` and `npm run wildlife -- --all`, or run
`.github/workflows/us-host-counts.yml` from the Actions tab.

**They need open internet.** Run them as the `npm run …` forms — through a
proxy, those are the only forms that work, because Node's `fetch` ignores
`HTTPS_PROXY` without `NODE_USE_ENV_PROXY=1` (see `app/scripts/_net.mjs`).

## 1. The mode trap — read this before trusting any measurement below

`/interaction` answers in two modes, and they are not the same data.

- **Default.** Records are collapsed into distinct interactions. Every
  per-observation column — life stage, latitude, study citation — comes back
  `null`, because that shape has nowhere to put them.
- **`includeObservations=true`.** The observations themselves, with those
  columns filled in.

The first run of the probe (2026-08-06) sampled only the default mode and
concluded that GloBI "carries no life stage and no citations". **That was a
statement about the query, not about the data**, and it cost this repo a
shipped feature for as long as it stood. Both readings are now taken in both
modes and both are in `probe.json`, so nobody has to fall into it twice.

One real constraint survives the correction: the citation join is expensive.
Asked for every animal on a plant as heavily recorded as *Quercus alba* or
*Salix caprea*, GloBI times out inside itself and answers `500`. Any builder has
to read the cheap aggregated partner lists first and ask for citations **one
animal–plant pair at a time** — which is exactly what
`wildlife-candidates.mjs` does.

## 2. The host-count gate — is a larval host distinguishable from an adult nectaring?

`hostLepCount` claims **"this many butterflies and moths raise their
caterpillars on this plant"**. That is much stronger than "an adult was seen on
this flower", and `docs/host-counts-plan.md` §4.3 set the rule when the European
counts landed: *verify the source records the claim you intend to make, before
designing anything around it.* The Gaytán dataset passed because its own README
says it documents larval host-plant associations.

GloBI aggregates many studies with varying rigour, so the same question has to
be asked again, and the answer is not knowable from the documentation — it
depends on how many records actually carry a life stage. That is question Q2 of
the probe.

> **Verdict: it cannot. Q2 fails — measured 2026-08-06, re-measured correctly
> 2026-08-07, same answer for a better reason.**
>
> Life stage is present on **17 of 200** sampled observation records — `larva`,
> `Young`, `adult`. Not zero, as the first run reported, but nowhere near
> enough: a count built on this would blend caterpillars stripping a leaf with
> adults resting on one, so it cannot support the claim `hostLepCount` makes.
>
> Q5 is a second, independent reason. `bbox` filtering genuinely works — the
> Mid-Atlantic box returns 12 of the 1,202 worldwide `Lepidoptera eats Quercus`
> records, the Pacific Northwest box returns 0 — but 12 is not oak's regional
> host count (Tallamy says 511 for the same genus in the same place). Only
> **2 in 500** of those records carry a coordinate at all, so a localised figure
> would really be measuring which studies bothered to record a place.
>
> **Consequence.** American host counts stay genus-level estimates anchored on
> Tallamy/NWF, labelled as estimates in every row's `basis` — the fallback
> `PROJECT_BRIEF.md` already flags.

## 3. The wildlife-ties gate — does a record name the study it came from?

A tie in `app/src/data/wildlife.ts` makes a much smaller claim than a host
count: *this animal uses this plant, and here is who says so*. No number. So it
needs a different gate, and Q6 asks it — **does a record name its source
study?** — separately, because Q2 and Q6 have different answers.

> **Verdict: it does. Q6 passes — 2026-08-07.**
>
> In observation mode, **100 of 100** sampled records for *Asclepias tuberosa*
> name their source study, across 2 distinct contributing datasets. The
> citations are real ones — the NHM Interactions Bank, EDWIP, published papers
> with DOIs, individual iNaturalist observations — so a proposed tie arrives
> with something to put in `basis` rather than a bare "GloBI says so".
>
> The verdict rests on the one plant of three whose citation query came back;
> the other two are the heavy genera §1 describes, and they time out. That is a
> constraint on *how* to query, not on whether the data is there.
>
> **Consequence.** GloBI feeds `app/scripts/wildlife-candidates.mjs`, which
> proposes animals for the wildlife layer with the study behind each one. It
> proposes; it does not write. Every blurb, icon, support kind and reliance in
> the shipped catalog is still editorial.

### What it can't do, and what makes up for it

GloBI is **worldwide and not georeferenced**, so it cannot tell you that a moth
it records on birch lives in the Alps. Everything regional in a proposal comes
from iNaturalist instead: research-grade observations inside the region's own
coverage box, and the establishment means the region's places record. A
candidate never seen in the box, or called introduced by a place in it, is
dropped before it reaches the report — the catalog's `native: true` is a hard
invariant and a shortlist has no business proposing a candidate that breaks it.

## What consumes it

- `app/scripts/wildlife-candidates.mjs` → `docs/candidates/wildlife-<region>.md`
  and `wildlife-ties.json` → curated by hand into `app/src/data/wildlife.ts`.

And, kept for the record, what never will: had Q2 passed, the host-count builder
would have been `app/scripts/build-us-host-counts.mjs`, written to mirror
`build-host-counts.mjs` exactly — same genus-level aggregation, same
`host-counts.json` shape, same "a shipped plant must not take a silent zero"
guard — so that the American and European numbers stay on one scale and one
method.
