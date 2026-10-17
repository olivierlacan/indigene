# TAXREF — the French national reference, from its own download

**Status: the French names' authority, read from the file the Muséum
publishes.** `DATA_SOURCES.md` → *Vernacular names* says why TAXREF is the
list; this folder is how the check gets to read it without a mirror.

- Upstream: <https://inpn.mnhn.fr/telechargement/referentielEspece/referentielTaxo>
  — TAXREF v*N*, a zip holding `TAXREFv<N>.txt` (tab-separated, ~700,000 rows)
- Publisher: INPN / Muséum national d'Histoire naturelle
- Licence: **Licence Ouverte / Etalab**. Attribution: "TAXREF, INPN / MNHN."
- Refresh: `cd app && npm run taxref:extract -- --fetch` → `extract.json`
  (committed); the zip and `TAXREFv<N>.txt` it unpacks stay here, git-ignored.
  `.github/workflows/vernacular.yml` does the same each quarter before the check.

## Where the file comes from

Both the TAXREF API and the INPN download page sit behind a browser challenge
that refuses scripts — from this repo's checks, from GitHub's runners, from
anywhere without a browser. The quarterly check of 2026-10-15 made 797 requests
to the API and got 797 challenge pages.

Since the MNHN's 2025 outage, PatriNat serves the same release from a plain
asset host, listed on its
[temporary download page](https://www.patrinat.fr/fr/page-temporaire-de-telechargement-des-referentiels-de-donnees-lies-linpn-7353):
`https://assets.patrinat.fr/files/referentiel/TAXREF_v18_2025.zip` (60 MB;
`TAXREFv18.txt` inside is 317 MB, 708,685 rows). That is what `--fetch` takes,
and `TAXREF_ZIP` in `app/scripts/taxref-extract.mjs` is where the file name is
bumped when v19 appears. Should that host go away too, the fallback is the one
the script's error message gives: download from the INPN page in a browser and
put the `.txt` here. Either way the repo keeps only the small part it depends
on, the way it does with the Gaytán matrix.

Measured 2026-10-17 against v18: 435 of the 797 names the app shows are in
TAXREF (15 of them under a synonym), 395 of those with a French name. The rest
are North American and Pacific taxa the référentiel has no row for, which is
what Wikidata is the fallback for.

## What is committed

| File | Committed? | What |
|---|---|---|
| `TAXREFv<N>.txt` | no | the whole référentiel |
| `extract.json` | **yes** | for every scientific name the app shows: TAXREF's row (CD_NOM, accepted CD_REF, accepted name, rank) and the French names of the accepted taxon, in TAXREF's order |

`app/scripts/check-vernacular.mjs` reads `extract.json` when it exists and
GBIF's copy of TAXREF (checklist dataset `0e61f8fe-7d25-4f81-ada7-d970bbb2c6d6`)
when it doesn't; the snapshot's `taxrefVia` says which. The extract names its
TAXREF version and date, so "verified against TAXREF" always says against which.
