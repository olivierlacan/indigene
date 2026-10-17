# TAXREF — the French national reference, from its own download

**Status: the French names' authority, read from the file the Muséum
publishes.** `DATA_SOURCES.md` → *Vernacular names* says why TAXREF is the
list; this folder is how the check gets to read it without a mirror.

- Upstream: <https://inpn.mnhn.fr/telechargement/referentielEspece/referentielTaxo>
  — TAXREF v*N*, a zip holding `TAXREFv<N>.txt` (tab-separated, ~700,000 rows)
- Publisher: INPN / Muséum national d'Histoire naturelle
- Licence: **Licence Ouverte / Etalab**. Attribution: "TAXREF, INPN / MNHN."
- Refresh: download in a browser, unzip, put `TAXREFv<N>.txt` here (git-ignored),
  then `cd app && npm run taxref:extract` → `extract.json` (committed)

## Why a person downloads it

Both the TAXREF API and the download page sit behind a browser challenge that
refuses scripts — from this repo's checks, from GitHub's runners, from anywhere
without a browser. The quarterly check of 2026-10-15 made 797 requests to the
API and got 797 challenge pages. So the big table is fetched by hand, the way
the Gaytán matrix is, and what the repo keeps is the small part it depends on.

## What is committed

| File | Committed? | What |
|---|---|---|
| `TAXREFv<N>.txt` | no | the whole référentiel |
| `extract.json` | **yes** | for every scientific name the app shows: TAXREF's row (CD_NOM, accepted CD_REF, accepted name, rank) and the French names of the accepted taxon, in TAXREF's order |

`app/scripts/check-vernacular.mjs` reads `extract.json` when it exists and
GBIF's copy of TAXREF (checklist dataset `0e61f8fe-7d25-4f81-ada7-d970bbb2c6d6`)
when it doesn't; the snapshot's `taxrefVia` says which. The extract names its
TAXREF version and date, so "verified against TAXREF" always says against which.
