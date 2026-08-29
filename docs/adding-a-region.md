# Adding a region: the full accounting

`data/regions.ts` says adding a region is "write a `region.<id>.ts` and a
`plants.<id>.ts`, then add two lines here." That's what makes a region *load* —
it is not what makes a region reach **parity** with the ones already shipped. A
reader on a finished region gets a boundary map, share cards, wildlife names,
record counts and (eventually) photographs; none of those come from the two
lines. This is the checklist for the rest.

It is grouped by *when* each phase happens: what you author by hand, what you
generate and commit, what CI checks before merge, and what heals itself on a
schedule afterward. French is deliberately **out of scope here** — it's a
separate, hand-written pass (see the last section).

The one tool that tells you where a region actually stands is
`npm run coverage -- --region <id>`: it reports forms, site types, bloom months,
host genera and wildlife ties against the other regions, and it invents nothing.
Run it first and last.

---

## 1. Author the data (by hand)

| # | What | Where | Notes |
|---|------|-------|-------|
| 1 | Region description | `src/data/region.<id>.ts` | Bounds, ecoregion codes, `featuredPlantId` + `featuredHostLepCount`, `extent`/`note`/`zones`. The box is coarse; the codes refine it (see `data/region.ts`). |
| 2 | Seed plant list | `src/data/plants.<id>.ts` | Every field per row. Match the flora to the codes, not the box. |
| 3 | Register both | `src/data/regions.ts` | One import, one `REGIONS` entry. The plant list is reached by `import()` so it stays a separate download. |
| 4 | Ecoregion names | `src/data/ecoregions.ts` (US Omernik) or the locale (EEA slugs) | Add a name for any **new** L3 code the region cites, so the page can name the shape it draws. |
| 5 | **Wildlife ties** | `src/data/wildlife.ts` (the region → plant → animal support map) | **Parity feature.** Without these, the region page's "Featured wildlife" is empty. `coverage` lists catalog animals that already tie to plants you ship — most ties are reuse, not new animals. |
| 6 | Look-alikes (optional) | `src/data/lookalikes.ts` (region → native → impostor) | The "that isn't the one" layer. Optional per region, but every shipped region has some. |

## 2. Generate and commit artifacts

These produce files that are **committed with the PR** and that the merge checks
depend on. Run them after the data is written.

| # | Command | Produces | Gotcha |
|---|---------|----------|--------|
| 7 | `npm run registry:build` | `src/data/registry.ts` (+ `public/registry/…json`) | Required for `registry:check`. New taxa land with `primaryId: null` — the in-branch chain below (`reconcile` → rebuild) fills the external ids and the hero photos. |
| 8 | `npm run maps:build <id>` | `public/maps/<id>.svg` | **Network** (EPA + Natural Earth). First add the region to the `LANDMARKS` table in the script — a few major cities that fix its edges; the builder now **refuses** to draw a region with fewer than three, because a shape with no labelled places is a blob nobody can locate themselves on. A *partial* run prints the drawn size but leaves `src/data/region-maps.ts` untouched — add the `{ w, h }` entry it reports by hand. Then look at the rendered map and check you can find a place you know on it. |
| 9 | `node scripts/gen-plant-cards.mjs <slug…>` | `public/og/plants/<slug>.jpg` | The share/preview card for every new plant. `routes:check` fails without them. |
| 10 | CHANGELOG entry | `CHANGELOG.md` under `## [Unreleased]` | One warm `Added` bullet; developer notes as `Internal:`. |

### Populate the live-data tiers in-branch (recommended)

The three network jobs in §4 *can* be left to their schedules, but for a clean,
fully-populated PR — real photos, resolved links, real record counts on day one
— run them by hand in the branch. They have a **strict order**, because each
feeds the next:

1. `npm run reconcile -- --missing inat` — fill the new taxa's external ids
   (IPNI/GBIF/iNaturalist). **Do this first:** the next two both read the
   iNaturalist id it writes.
2. `npm run registry:build` — bake the reconciled ids into `registry.ts`.
3. `npm run hero:inat` then `npm run hero:colors` — pull each new plant's and
   animal's own iNaturalist photograph (the first that's CC-licensed, carried
   with its credit) into `inat-heroes.json`, and give each an average colour to
   fade up from. **This is what puts a real photo on a new plant or animal
   instead of the generic drawing — always run it when adding subjects.** The
   plant path needs the id from step 1, so a run *before* reconcile silently
   skips every new plant; animals resolve by name and don't. A subject whose
   whole gallery is all-rights-reserved keeps its drawing (honestly).
4. `npm run region-counts` — refresh per-region record counts; also reads the
   iNaturalist id, so it comes after reconcile too. It rewrites *every* region's
   counts, so expect the others' numbers to advance to today.

Commit the results: `registry.ts`, `registry.overrides.json`, the public
registry copy, `inat-heroes.json`, `region-counts.ts`, and any new share cards.
The screenshots won't show these photos (the headless capture can't load
external images), but they render in a real browser — check there, not in a
capture.

## 3. Validate before merge

CI gates (each is its own workflow, run on every PR):

- `npm run registry:check` — registry covers the catalog, keystone flags agree, `featuredHostLepCount` matches. *(Registry workflow.)*
- `npm run build && npm run routes:check` — every prerendered page has a file and a share card. *(Routes workflow.)*
- `npm run blurbs:check` — animal openings/blurbs stay card-sized. *(Blurbs workflow.)*
- `npm run release-notes` — the changelog still compiles, and no bullet is over length. *(Changelog workflow.)*

Local tools that are **not** CI-gated but should be run for a new region:

- `npm run coverage -- --region <id>` — the parity report. The point of the exercise.
- `npm run chunks:check -- <port>` (against a served `dist/`) — confirms the region list stays a separate download.
- `npm run prose:check` — reports locale coverage; the overlay is deliberately partial, so it never fails on a missing translation.
- `npm run lookalikes:check` — validates any look-alike ties (network); passes cleanly when a region declares none.

## 4. The schedule as a fallback (if you skip §2's chain)

The same jobs run on a schedule against `main` and open their own follow-up PRs.
Each iterates every region / the whole registry, so a merged region is **picked
up automatically** — no per-region code. If you ran §2's in-branch chain, these
are just the ongoing refresh; if you didn't, this is how the region eventually
reaches parity.

| Phase | Workflow / command | Fills |
|-------|--------------------|-------|
| Record counts | `region-counts` (`build-region-counts.mjs`) | `region-counts.ts` — "how common near you / across this region." |
| Identifier reconciliation | `reconcile` (`reconcile.mjs`) | Registry external ids (IPNI/GBIF/iNaturalist/…), so `primaryId` stops being null and external links resolve. |
| iNaturalist hero floor | `hero:inat` (in §2 above) — no scheduled job | `inat-heroes.json` — a real photo per subject. Run in-branch; there is no workflow that fills this for you. |

The one genuinely later step is the **reviewed** hero tier: `hero:harvest`
ranks CC candidates per region into a shortlist, and a person picks the winner
into `hero-photos.json`, which overrides the iNaturalist floor wherever a pick
exists. That review sitting is optional and can happen any time — the floor from
§2 means a new subject already shows a real photo until then.

## 5. French (separate pass — excluded here)

A region ships legibly without French: the locale entries are optional and fall
back to English. When you do the pass: `src/locales/regions.<lang>.ts` (name,
short, reference, note, extent), `src/locales/taxa.<lang>.ts` (each plant's
vernacular name, checked by `names:check` against that country's reference
list), and any `src/locales/prose.<lang>/` overlay. `npm run prose:check`
measures the coverage.

---

## Quick checklist

```
[ ] region.<id>.ts, plants.<id>.ts, regions.ts, ecoregions.ts
[ ] wildlife ties in wildlife.ts        (parity — region page names the wildlife)
[ ] look-alikes in lookalikes.ts        (optional)
[ ] npm run registry:build
[ ] npm run maps:build <id>             + region-maps.ts size entry
[ ] node scripts/gen-plant-cards.mjs <slugs>
[ ] CHANGELOG.md Unreleased bullet
— live-data tiers, IN ORDER (reconcile feeds the rest) —
[ ] npm run reconcile -- --missing inat   (external ids for the new taxa)
[ ] npm run registry:build                (bake the ids in)
[ ] npm run hero:inat && hero:colors      (real iNaturalist photo per new plant/animal)
[ ] npm run region-counts                 (record counts; rewrites every region)
[ ] typecheck · build · registry:check · routes:check · blurbs:check · release-notes
[ ] coverage -- --region <id>           (read the gaps)
[ ] chunks:check · prose:check · lookalikes:check
— optional, any time —
[ ] hero:harvest → review → hero-photos.json  (reviewed pick overrides the floor)
— separate pass —
[ ] French: regions.fr.ts · taxa.fr.ts · prose.fr/
```
