# European Lepidoptera–plant interaction matrix (the host-count source)

- **Upstream:** Gaytán et al. 2026, *European Lepidoptera–Plant Associations: A
  Species-Level Interaction Matrix*, **Ecology & Evolution**,
  [doi:10.1002/ece3.73004](https://doi.org/10.1002/ece3.73004). 5,152 Lepidoptera
  × 3,275 vascular-plant species, all of Europe, species-level.
- **Licence:** CC-BY 4.0 (attribute Gaytán et al. 2026).
- **Cross-check:** DBIF v2 (CEH/BRC), Open Government Licence — "Contains data
  supplied by NERC" — a per-plant insect-richness file for Great Britain.

## What goes here (raw files git-ignored — large)

**Download page:** Zenodo record — https://zenodo.org/doi/10.5281/zenodo.16914288
(concept DOI; resolves to the latest version). Put the four downloaded files in
this folder:

| File | ~Size | Committed? | Role |
|---|---|---|---|
| `Lepidoptera–Plant Associations in Europe.csv` | 33.9 MB | **no** (`*.csv` ignored) | the association matrix — the host source |
| `Ecosystems.csv` | 120 kB | **no** (`*.csv` ignored) | habitat context (not needed for counts) |
| `Taxonomy.xlsx` | 313 kB | **no** (`*.xlsx` ignored) | name standardization crosswalk |
| `zenodo-readme.md` | 2 kB | yes | the dataset's own README — **rename from `Readme.md`** to avoid clashing with this file on case-insensitive filesystems; read it first for the column layout |
| `host-counts.by-genus.json` | small | **yes** | *generated* — the derived per-genus counts (provenance of the numbers we ship) |

The raw CSV/XLSX are git-ignored (see `../.gitignore`); only the tiny derived
`host-counts.by-genus.json` (and the dataset readme) are committed.

> Retrieval note: the build/agent sandbox can't reach Zenodo (egress 403), so run
> the build from a local machine that has the files.

## Consumed by — `app/scripts/build-host-counts.mjs`

Streams the matrix, maps each plant name to its genus, counts **distinct
Lepidoptera species per genus** for the genera our European region files use, and
writes `host-counts.by-genus.json` plus a current-vs-proposed review table. It
does **not** edit the region files — applying the numbers is a reviewed step.

Build brief / decisions baked into the script:
- **Same scale as the US regions:** `hostLepCount` is the *raw* count; the
  log-normalization lives in `app/src/lib/plants.ts` against the shared
  `HOST_ANCHOR` — do not pre-scale, and don't change the anchor, so US scores
  don't move.
- **Genus-level**, matching how the US counts are authored (both `Prunus avium`
  and `Prunus spinosa` take the Prunus count). A small `GENUS_ALIASES` map covers
  name mismatches (e.g. Frangula↔Rhamnus); the script prints any counted genus it
  couldn't place so the map can be extended.
- **Confirm before trusting** (two checks, both in the script header): that the
  matrix records **larval-host** (herbivory) associations, not adult nectar — set
  `ASSOC_TYPE_FILTER` if it mixes types; and that the format auto-detect picked
  the right axes (it prints them).

After running: review the printed table, update each France row's `hostLepCount`
to the proposed value, and swap its `basis` to cite the matrix + raise
`confidence` where now data-backed. See `docs/france-localization-plan.md` §4.3.
