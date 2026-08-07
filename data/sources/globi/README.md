# GloBI — Global Biotic Interactions

**Status: gate failed, nothing shipped — and nothing will be.** The probe ran
on 2026-08-06 and GloBI cannot source `hostLepCount`. See §2. It stays valuable
for the wildlife-ties layer, where no count is involved.

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
  checkable rather than assumed.

## What's here

| File | What it is | Committed? |
|---|---|---|
| `probe.json` | what GloBI answered, and when — the five questions in `app/scripts/probe-globi.mjs` | yes |

Refresh: `node app/scripts/probe-globi.mjs`, or run
`.github/workflows/us-host-counts.yml` from the Actions tab.

**It needs open internet.** Run it as `npm run probe:globi` — through a proxy,
that npm script is the only form that works, because Node's `fetch` ignores
`HTTPS_PROXY` without `NODE_USE_ENV_PROXY=1` (see `app/scripts/_net.mjs`). Or
let `.github/workflows/us-host-counts.yml` run it on a runner.

## 2. The gate — is a larval host distinguishable from an adult nectaring?

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

> **Verdict: it is not. Q2 fails — 2026-08-06.**
>
> Both life-stage columns exist and both are empty. Zero of the probe's 25
> sampled records carried one; a follow-up over 500 `Lepidoptera eats Quercus`
> records found **0 with a life stage and 0 with coordinates**. A count built
> from this would blend caterpillars stripping a leaf with adults resting on one,
> so it cannot support the claim `hostLepCount` makes.
>
> Q5 is a second, independent reason. `bbox` filtering genuinely works — the
> Mid-Atlantic box returns 12 of the 1,202 worldwide `Lepidoptera eats Quercus`
> records, the Pacific Northwest box returns 0 — but 12 is not oak's regional
> host count (Tallamy says 511 for the same genus in the same place). A
> localised figure would rest on ~1% of the records and would really be
> measuring which studies bothered to record a place.
>
> **Consequence.** American host counts stay genus-level estimates anchored on
> Tallamy/NWF, labelled as estimates in every row's `basis` — the fallback
> `PROJECT_BRIEF.md` already flags. GloBI keeps its place in the *wildlife-ties*
> layer, where a named animal and a citation are the whole deliverable and no
> count is involved.
>
> Worth saying plainly: this is the probe working. It cost one run and no shipped
> number, which is the entire reason it was written before a builder.

## What would consume it

Nothing, and now nothing will — the gate failed. Kept for the record: had it
passed, the builder would have been
`app/scripts/build-us-host-counts.mjs`, written to mirror
`build-host-counts.mjs` exactly — same genus-level aggregation, same
`host-counts.json` shape, same "a shipped plant must not take a silent zero"
guard — so that the American and European numbers stay on one scale and one
method.
