# European Lepidoptera–plant interaction matrix (the host-count source)

- **Upstream:** Gaytán et al. 2026, *European Lepidoptera–Plant Associations: A
  Species-Level Interaction Matrix*, **Ecology & Evolution**,
  [doi:10.1002/ece3.73004](https://doi.org/10.1002/ece3.73004). 5,152 Lepidoptera
  × 3,275 vascular-plant species, all of Europe, species-level.
- **Licence:** CC-BY 4.0 (attribute Gaytán et al. 2026).
- **Cross-check:** DBIF v2 (CEH/BRC), Open Government Licence — "Contains data
  supplied by NERC" — a per-plant insect-richness file for Great Britain.

## What goes here (git-ignored — large)

The raw matrix file(s) from the DOI landing page (journal supplement / Dryad /
Zenodo). Save as e.g. `matrix.csv` in this folder. It is **git-ignored** (see
`../.gitignore`) — do not commit the multi-thousand-row dataset; re-fetch it here
when needed.

**Download page:** Zenodo record — https://zenodo.org/doi/10.5281/zenodo.16914288
(concept DOI; resolves to the latest version). As of 2026-07-28 this URL was
returning **HTTP 504** (Zenodo gateway timeout) — deferred; retry later. Once it's
reachable, grab the CSV here manually, or add a `fetch` step (like
`app/scripts/probe-eea.mjs`) that writes into this folder once the direct file
URL is known.

## Consumed by (planned)

`scripts/build-host-counts.mjs` will read this matrix, resolve plant names to our
registry genera, count distinct Lepidoptera per genus, and emit `hostLepCount`
for the European region files — replacing the interim genus-level estimates.
Keep the shared `HOST_ANCHOR` in `app/src/lib/plants.ts` so US scores don't move.
Before trusting a raw count, confirm the matrix records **larval host** (herbivory)
associations, not adult nectar. See `docs/france-localization-plan.md` §4.3.
