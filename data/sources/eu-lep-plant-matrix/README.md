# European Lepidoptera–plant interaction matrix (the host-count source)

- **Upstream:** Gaytán et al. 2026, *European Lepidoptera–Plant Associations: A
  Species-Level Interaction Matrix*, **Ecology & Evolution**,
  [doi:10.1002/ece3.73004](https://doi.org/10.1002/ece3.73004). 5,152 Lepidoptera
  × 3,275 vascular-plant species, all of Europe, species-level.
- **Licence:** CC-BY 4.0 (attribute Gaytán et al. 2026).
- **It records larval hosts.** The dataset's own README says so — "larval
  host-plant associations of European Lepidoptera" — which is what `hostLepCount`
  claims ("caterpillars that eat this leaf"), not adult nectar visits. This was
  the gate `docs/france-localization-plan.md` §4.3 set before trusting any number
  here, and it passes.
- **Cross-check (not yet done):** DBIF v2 (CEH/BRC), Open Government Licence —
  "Contains data supplied by NERC" — a per-plant insect-richness file for Great
  Britain. Deliberately deferred; see `docs/host-counts-plan.md` §8.

## What's here

**Download page:** Zenodo record —
https://zenodo.org/doi/10.5281/zenodo.16914288 (concept DOI; resolves to the
latest version). Fetch the files by hand into this folder — the build step reads
them from exactly these names, accents included.

> **Fetch from a machine with open egress.** The build/agent sandbox gets a 403
> from Zenodo, the same way it does from the EEA and EPA services, so retrieval
> and the recompute both run locally. Nothing in CI depends on it: the derived
> `host-counts.json` is committed.

| File | Committed? | What it is |
|---|---|---|
| `Lepidoptera–Plant Associations in Europe.csv` | **no** — 32 MB | the matrix: one row per Lepidoptera species, one column per plant, `;`-separated, `1`/`0` |
| `Ecosystems.csv` | **no** | per-plant presence across 8 European zones, plus a `Non-native` flag |
| `Taxonomy.xlsx` | **no** | `SPECIES → GENUS → FAMILY` for both Lepidoptera and plants; the authority on genus |
| `zenodo-readme.md` | **yes** | the dataset's own description, as published — Zenodo serves it as `Readme.md`, so **rename it**: a space and an accent make it awkward to reference, and a bare `Readme.md` would collide with this file on a case-insensitive filesystem. It's the evidence for the larval-host claim above, which is why it's committed (CC-BY, attributed). |
| `host-counts.json` | **yes** | what we derived from the three above — see below |

The raw downloads are **git-ignored** (see `../.gitignore`): they're large, and
they're re-fetchable from the DOI. `host-counts.json` is the small derived
snapshot, and it *is* committed, following the convention in
`../README.md` — so every host count that reaches the app is reviewable in a
diff without anyone needing the 32 MB matrix.

## Consumed by

`app/scripts/build-host-counts.mjs` reads all three raw files and writes
`host-counts.json`:

```sh
cd app
npm run host-counts                                # write the lookup table
npm run host-counts -- --region france-atlantic    # …and report that region
```

It counts, for each of the 973 plant genera and each of the 8 European zones,
the distinct Lepidoptera recorded on any member of that genus which grows in the
zone and is native to Europe. It also keeps the count *without* the native
filter, wherever the two differ, so the choice stays arguable.

The report prints current vs. proposed `hostLepCount` for a region's rows and
**writes nothing to the region file** — each row's `basis` prose and `confidence`
are editorial judgments, and the plant files exist to be auditable by a
non-programmer. Run it after any data refresh: if the region file is already
correct it prints "0 of 23 rows would change", which makes it a regression check.

Two things will stop the script rather than let it guess: a plant column missing
from `Taxonomy.xlsx` (genus would be a guess), and a shipped plant whose genus
has no native member in its zone (a silent `0` would sink that plant's ranking).

Consumers of the numbers: `app/src/data/plants.france-atlantic.ts` today, and
every future European region. The shared `HOST_ANCHOR` in `app/src/lib/plants.ts`
stays at 520 so US scores don't move — the top European count is 391.

See `docs/host-counts-plan.md` for the decisions behind all of this.
