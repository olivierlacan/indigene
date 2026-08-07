# Plan: real US host counts, or an honest admission that we can't have them

**Status: answered — GloBI cannot do it, and the wildlife-ties layer got it
instead.** The probe ran on 2026-08-06 and Q2, the gate, failed; it was re-run
correctly on 2026-08-07 and failed again, for a narrower and better-evidenced
reason. No host-count number has moved and none will from this source. The
verdict is in §2; the fallback is the Tallamy primary literature.

**One thing in the first run's verdict was wrong, and it mattered.** The 2026-08-06
run reported that GloBI's life-stage and citation columns were *empty*. They are
not — they are empty in the **default** `/interaction` response, which collapses
records into distinct interactions and drops every per-observation column on the
way. `includeObservations=true` fills them in. The gate's answer is unchanged
(life stage is on about an eighth of records, still far too few to count with),
but the *citation* answer flipped completely: every record names its source
study. That is what the wildlife-ties layer needed, and
`app/scripts/wildlife-candidates.mjs` now runs on it. The correction, and the
measurement in both modes, are in `data/sources/globi/probe.json`.

This is the European story again, in reverse. `docs/host-counts-plan.md`
replaced Atlantic France's estimated host counts with computed ones from the
Gaytán matrix. This document asks whether the same is possible for the four
American regions, and commits to saying so plainly if it isn't.

## 1. Why it matters more than it looks

`hostLepCount` is the strongest signal in the ranking. In the four French
regions it is *computed* — `genera[G].zones[Z].count` straight out of a
peer-reviewed, CC-BY matrix. In the Pacific Northwest, Mid-Atlantic and both
Florida lists it is a **genus-level estimate** anchored on Tallamy/NWF, flagged
as one in every row's `basis`, with `confidence` set accordingly.

Those estimates are honest. The problem isn't that they're wrong; it's what
they cost us downstream. `docs/coverage-gap-pnw-france-atlantic.md` found it by
accident:

> **We can rank Europe's next twenty plants mechanically and we cannot do the
> same for the United States.**

`npm run coverage` prints, for Atlantic France, the exact list of top-30
food-web genera the region doesn't ship — 21 of them, biggest first, each with
the number of Lepidoptera behind it. For the Pacific Northwest it prints an
apology and the region's own rows. So the French lists grow by working down a
ranking, and the American ones grow by whoever remembers hawthorn. That is the
difference this document is trying to close, and it will only widen as regions
are added.

It also blocks `coverage-plan.md` §4 step 2 — the GBIF candidate generator — for
every American region, since that design is *"join ecoregion occurrences to the
host-count table"* and there is no American host-count table to join to.

## 2. The gate — before designing anything

`hostLepCount` claims **"this many butterflies and moths raise their
caterpillars on this plant"**. `docs/host-counts-plan.md` §4.3 set the rule that
made the European numbers trustworthy: *verify the source records the claim you
intend to make, before designing anything around it.* Gaytán passed because the
dataset's own README says it documents larval host-plant associations.

GloBI aggregates many studies of varying rigour, and it records adult flower
visits alongside larval feeding. So the question has to be asked again, and
unlike Gaytán it **cannot be answered from the documentation** — it depends on
what fraction of records actually carry a life stage. That is Q2 of the probe,
and it is the only question that matters first:

> **Verdict: Q2 fails. GloBI cannot source `hostLepCount`.**
> Run 2026-08-06; re-measured correctly 2026-08-07. Snapshot in
> `data/sources/globi/probe.json`.
>
> The two life-stage columns — `source_specimen_life_stage` and
> `target_specimen_life_stage` — are populated on **17 of 200** sampled
> observation records (`larva`, `Young`, `adult`). Sparse, not empty: the
> first run's "empty" was an artifact of reading the aggregated response,
> which cannot carry the column at all. The corrected number is worse for the
> gate in the only way that counts — about one record in eight is not a basis
> for a species tally — and better for everything else, because a life stage
> that *is* recorded can corroborate a single named tie even when it can't
> support a count.
>
> So a GloBI count of "Lepidoptera that eat oak" mixes a caterpillar stripping a
> leaf with an adult resting on one, and there is no field to separate them.
> That is a different claim from the one `hostLepCount` makes, and shipping it
> would be the exact failure `host-counts-plan.md` §4.3 was written to prevent.
>
> **Q5 adds a second, independent reason.** `bbox` filtering does work — it is
> the server doing real work, not ignoring the parameter: the Mid-Atlantic box
> returns 12 `Lepidoptera eats Quercus` records and the Pacific Northwest box
> returns 0, out of 1,202 worldwide. But 12 is not a regional host count for oak;
> Tallamy's figure for the same genus in the same place is 511. So a localised
> count would rest on about one percent of the records and would read as an
> ecological claim while actually measuring which studies happened to record a
> place. Coordinates are on **2 of 500** records in observation mode, so there
> is effectively no way to audit where those 12 are.

Two outcomes, both fine:

- **Q2 passes.** Design `build-us-host-counts.mjs` as a mirror of
  `build-host-counts.mjs` — same genus-level aggregation, same output shape,
  same "a shipped plant must not take a silent zero" guard — so American and
  European numbers stay on one scale and one method. Then §4 below.
- **Q2 fails.** Say so here, and stop *building a count*. GloBI remains
  valuable for the **wildlife-ties** layer, where a named animal and a citation
  *are* the deliverable and no count is involved. That is no longer a promise:
  Q6 was added to the probe to ask the ties layer's own question — does a record
  name its source study? — and it passes at 100 of 100 sampled records, so
  `app/scripts/wildlife-candidates.mjs` proposes ties with the study behind each
  one. The count fallback is then the Tallamy primary literature, already
  flagged in `PROJECT_BRIEF.md` as a re-sourcing task.

  **The general lesson, worth more than the verdict.** A gate can fail for the
  wrong reason and still give the right answer, and that is a dangerous place to
  stop. Q2's conclusion survived re-measurement; the sentence next to it about
  citations did not, and it had been quietly closing off a whole feature for a
  day. When a probe reports that a field is empty, ask whether the *query shape*
  could produce that answer before concluding the *data* did.

## 3. What the probe asks

| | Question | Why it's on the list |
|---|---|---|
| Q1 | Is GloBI reachable, and what does it call its interaction types? | The vocabulary has moved between versions; don't hard-code a guess. |
| Q2 | **Larval host vs adult nectaring** | The gate. Everything else is moot. |
| Q3 | What fields does a record carry? | Sampled, never assumed — and now sampled in **both** response modes, because the default one blanks every per-observation column and the first run mistook those blanks for missing data. |
| Q4 | Does the method reproduce numbers we already trust? | Run the same query against genera where Gaytán's answer is committed. GloBI is worldwide and Gaytán's column is one European zone, so GloBI should be the larger of the two; an order of magnitude either way means the query is wrong. |
| Q5 | Can records be cut to a region? | A count with no locality is a continental count. A Pacific Northwest figure has to mean the Pacific Northwest, or say that it doesn't. **Answered: technically yes, usefully no** — see §2. (`lat`/`lng`, which the probe tried first, is not a filter at all: it returns an empty body, which the first run reported as a JSON error.) |
| Q6 | **Does a record name the study it came from?** | The wildlife-ties layer's own gate, and a different question from Q2 with a different answer. A tie is a named animal and a citation; without the citation there is nothing to put in `basis`. **Answered: yes, 100 of 100 sampled records** — see `data/sources/globi/README.md` §3. |

## 3b. What the answer costs, and what it doesn't

The gate failing does **not** block `coverage-plan.md` §4 step 2. That design
said *"join ecoregion occurrences to the host-count table"*, and America has no
such table — but the join was never the only ranking signal, and the four terms
that remain are all obtainable:

| Term | Source | Available? |
|---|---|---|
| Does it actually grow here, and commonly? | GBIF occurrence density in the region's box | **yes** |
| Is it native here rather than naturalised? | iNaturalist establishment means, per place | **yes** |
| Does it bring a genus the region's list lacks? | our own committed rows | **yes** |
| How much food web does that genus carry? | genus-level estimate, Tallamy/NWF | yes, *as an estimate* |

So the American generator ranks on a column that is honestly labelled an
estimate rather than a computed count. That is worse than France's and it is
still far better than memory, which is what it replaces. What the failed gate
costs is precision in the *fourth* term only.

GloBI is now doing the job it was always strongest at, where no count is
involved: the **wildlife-ties layer**, where a named animal plus a citation is
the whole deliverable. See `data/sources/globi/README.md` §3 and the per-region
shortlists in `docs/candidates/wildlife-*.md`.

## 4. If the gate had passed (kept for the record)

1. **Licensing first.** The GloBI aggregate is CC0/CC-BY, but individual
   contributed datasets carry their own terms. Every record names its source
   study, so this is checkable rather than assumed — and `DATA_SOURCES.md`'s
   standing verdict on BONAP is the precedent for walking away from a source
   with bad terms however useful it is.
2. **A committed derived file**, not a bundled dump — `host-counts.json` beside
   the European one. The 34 MB matrix is git-ignored and its 60 KB derivative is
   committed precisely so every number that reaches the app is reviewable in a
   diff. Same here.
3. **Recompute, don't overwrite blind.** `build-host-counts.mjs` has a
   `--region` reporting mode that shows `now` vs `next` per row and writes
   nothing. Do that first, read the diff, and expect the estimates to move —
   the western genus figures in `plants.pnw.ts` are deliberately lower than the
   eastern ones and some of them will be wrong.
4. **Then `npm run coverage` prints a real ranking for every region**, and the
   GBIF candidate generator becomes possible everywhere rather than in France
   only.

## 5. What this does not attempt

- **Replacing the other six `scores`.** Stormwater, erosion, carbon and
  establishment stay informed estimates, labelled as such. GloBI wouldn't help.
- **County-level native status.** That's USDA PLANTS, a separate open item.
- **Deciding `keystone`.** Sourced from the keystone lists, but whether a given
  species in a given region qualifies stays our call — `coverage-plan.md` §3.
