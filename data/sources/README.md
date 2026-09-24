# Retrieved source data & provenance

This folder holds data **retrieved from upstream services**, kept separate from
the hand-authored catalog in `app/src/data/`. Two kinds of thing live here:

1. **Verification / provenance snapshots** — small artifacts that record *what an
   upstream service returned, and when* (e.g. `probe.json` from the EEA ecoregion
   probe). These are **committed**, so upstream drift shows up in a diff.
2. **Raw source datasets** — the actual bulk downloads a build step consumes
   (e.g. the European Lepidoptera–plant matrix CSV). These are usually large and
   are **git-ignored** (see `.gitignore`); they're fetched on demand — by hand, by
   a retrieval script, or by CI — using the instructions in each subfolder's
   README.

## Layout

One subfolder per source. Each carries its own `README.md` with: the upstream
URL, the licence + required attribution, the command to (re)retrieve it, and what
in the app consumes it.

| Source | What's here | Licence | Refresh |
|---|---|---|---|
| [`eea-biogeographical-regions/`](eea-biogeographical-regions/) | `probe.json` — layer list + per-region point checks + detected field name for the live EEA ecoregion service | CC-BY 4.0 (EEA) | `node app/scripts/probe-eea.mjs` |
| [`eu-lep-plant-matrix/`](eu-lep-plant-matrix/) | the Gaytán 2026 European Lepidoptera–plant matrix, ecosystem table and taxonomy (raw, git-ignored) + `host-counts.json` — the per-genus, per-zone counts derived from them (committed) → feeds `hostLepCount` | CC-BY 4.0 | manual download from the DOI (see its README), then `cd app && npm run host-counts` |
| [`vernacular-names/`](vernacular-names/) | `fr.json` — per-taxon verification of the **fr-FR** plant & animal names against the French reference lists that supply them | Licence Ouverte (TAXREF) · CC BY-SA (Tela Botanica) · CC0 (Wikidata) | `node app/scripts/check-vernacular.mjs` |
| [`globi/`](globi/) | `probe.json` — six questions put to GloBI, and its answers: it **cannot** source US host counts (life stage is on ~8% of records) but it **can** name an animal on a plant and cite the study (100% of records). `wildlife-ties.json` — the animals it names on every plant we ship, with counts, life stages and source studies, behind the ties in `app/src/data/wildlife.ts` | CC0/CC-BY aggregate; contributed datasets carry their own terms | `npm run probe:globi` · `npm run wildlife -- --all` |
| [`vascan/`](vascan/) | `probe.json` — VASCAN's per-province `establishmentMeans` for every plant we ship (how much of a British Columbia or Québec list is **already written**), plus how many fr-FR `pending` names it can source for an fr-CA table | CC BY 4.0 (Canadensys) | `cd app && npm run probe:vascan` |
| [`cec-ecoregions/`](cec-ecoregions/) | `probe.json` — the open question: is there a live ecoregion point query that works north of the 49th parallel? The EPA service returns nothing in Canada, so this gates both Canadian regions | to confirm (CEC) | `cd app && npm run probe:cec` |
| [`resolve-ecoregions/`](resolve-ecoregions/) | `probe.json` — the live RESOLVE layer's answer for twelve southern cities (confirmed, CORS `*`). `index.json` — every ecoregion's id, name, biome, realm and bounding box. The 149 MB shapefile zip and the 27 MB simplified GeoJSON made from it are git-ignored | CC BY 4.0 (RESOLVE) | `cd app && npm run probe:resolve` · `npm run resolve:fetch` |
| [`plant-synz/`](plant-synz/) | `host-counts.json` — for every genus the NZ region ships, how many native moths and butterflies Plant-SyNZ records breeding on it (reliability ≥ 7), and which. Raw reports cached in the git-ignored `cache/` | © Landcare Research (derived counts, attributed) | `cd app && npm run host-counts:nz` |
| [`wcvp/`](wcvp/) | `<region>.json` — Kew's World Checklist of Vascular Plants re-asked about every row a region ships: is this plant native in this TDWG area? The native-status source for regions with no national flora of our own (Ireland is the first) | CC BY 4.0 (RBG Kew) | `cd app && npm run native:check -- --region ireland` |

## Why this exists / CI

Retrieval is currently manual because the build/agent sandbox's egress is
firewalled (several upstream hosts `403` automated fetchers). The retrieval
scripts are written to run from any unblocked machine, and the same scripts are
what a scheduled **CI job** would run to refresh these files — committing the
small snapshots makes any change in upstream data reviewable, and the git-ignored
raw datasets are re-fetched into the same paths the build steps already expect.

**Committed vs ignored:** keep provenance snapshots small and committed; never
commit multi-MB raw datasets — add their extension to `.gitignore` and document
the fetch in the subfolder README instead.

**Before adding a subfolder here**, the source has to have passed the tests in
[`DATA_SOURCES.md` → How a source gets in](../../DATA_SOURCES.md#how-a-source-gets-in):
what claim it's admitted for, which of the five jobs it holds, and what happens
when it goes quiet. The probe files in this folder are how the first of those
questions gets answered on the record.
