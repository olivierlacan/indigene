# GloBI — Global Biotic Interactions

**Status: probing, nothing shipped.** No number in the app comes from this
source yet, and none should until §2 below has a verdict written in it.

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

**It needs open internet, which the build sandbox does not have** —
`api.globalbioticinteractions.org` answers 403 to the agent egress. Same
arrangement as [`vernacular-names/`](../vernacular-names/) and the reconcile
job: run it from an unblocked machine, or let the runner do it.

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

> **Verdict: not yet run.** Fill this in from `probe.json` after the first run.
> If Q2 fails, GloBI cannot source `hostLepCount` on its own and the fallback is
> the Tallamy primary literature, as `PROJECT_BRIEF.md` already flags. It would
> still be useful for the *wildlife-ties* layer, where a citation and a named
> animal are the whole point and a count is not involved.

## What would consume it

Nothing yet. If the gate passes, the builder would be
`app/scripts/build-us-host-counts.mjs`, written to mirror
`build-host-counts.mjs` exactly — same genus-level aggregation, same
`host-counts.json` shape, same "a shipped plant must not take a silent zero"
guard — so that the American and European numbers stay on one scale and one
method.
