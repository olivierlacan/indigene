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
| [`globi/`](globi/) | `probe.json` — what GloBI answered when asked whether it can source **US** host counts the way the Gaytán matrix sources European ones. **Nothing shipped depends on it**; the gate is whether a larval host is distinguishable from an adult nectaring | CC0/CC-BY aggregate; contributed datasets carry their own terms | `node app/scripts/probe-globi.mjs` |

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
