# Plan: real European host counts, and a page that invites checking

**Status:** designed, not yet built. The source data is **downloaded** to
`data/sources/eu-lep-plant-matrix/` (git-ignored) and has been validated against
our catalog — every check below was run against the real files, not assumed.
What's pending is the build script, the recomputed Atlantic France rows, and the
new `#/sources` page. Ships as **one PR**. This closes the gap
`docs/france-localization-plan.md` §4.3 left open.

Two things land together, because they're the same argument.

The first is a number. `hostLepCount` — how many butterfly and moth species
raise their caterpillars on a plant — is the strongest signal in the ranking. In
the US regions it comes from the Tallamy / NWF dataset. The 23 Atlantic France
rows shipped with **honest genus-level estimates** anchored on British
foliage-insect rankings, clearly flagged, because no European source was in hand.
One exists, it's openly licensed, and it's now on disk.

The second is a page. Replacing estimates with sourced counts makes Indigene's
numbers *better*, not *certain* — and the app has no single place that says which
numbers are measured, which are judgment, and where a careful reader should push
back first. `DATA_SOURCES.md` is a licensing audit written for a developer. A
public page at `#/sources` states the method and the assumptions in plain words
and asks to be challenged.

## 1. What the source is

Four files in `data/sources/eu-lep-plant-matrix/`, **git-ignored** (the matrix
alone is 34 MB) and re-fetched by hand from the DOI, per the convention in
`data/sources/README.md`:

| File | Contents |
|---|---|
| `Lepidoptera–Plant Associations in Europe.csv` | the matrix: 5,152 Lepidoptera rows × 3,275 plant columns, `;`-separated, binary `1`/`0` |
| `Ecosystems.csv` | per-plant occurrence across 9 European zones, plus a `Non-native` flag |
| `Taxonomy.xlsx` | `SPECIES → GENUS → FAMILY` for both Lepidoptera and plants, plus woody/herbaceous and life cycle |
| `Gaytán Readme.md` | the dataset's own description |

Gaytán et al. 2026, *Ecology & Evolution*,
[doi:10.1002/ece3.73004](https://doi.org/10.1002/ece3.73004). **CC-BY 4.0.**

**The §4.3 "verify before trusting" gate passes.** That section demanded we
confirm the matrix records *larval host* associations rather than adult nectar
visits, because `hostLepCount` claims "caterpillars that eat this leaf," which is
the stronger claim. The dataset's own README states it plainly: it documents
*"larval host-plant associations of European Lepidoptera."* The claim is honest
against this source.

The download also turned out to be **richer than §4.3 anticipated** — it assumed
the matrix alone. The ecosystem table and the taxonomy are what make the
filtering below possible at all.

### Checked against the real files before designing

- All 3,275 matrix columns appear in `Taxonomy.xlsx`. Exact coverage, no gaps.
- Splitting a binomial on whitespace disagrees with the authoritative `GENUS`
  column on exactly one column: `x Pyraria irregularis` → `Pyraria`.
- All 23 Atlantic France plants appear in the matrix by exact binomial. **No name
  reconciliation is needed** — the part of this work most likely to have been
  ugly simply isn't.
- All 23 carry the `Oceanic temperate` flag, so zone filtering never excludes a
  focal plant.
- 4 of 3,275 matrix columns are absent from `Ecosystems.csv`
  (*Eryngium bourgatii*, *Neillia spp*, *Ruta angustifolia*, *Sedum dasyphyllium*).
- 294 of 973 genera have no `Oceanic temperate` member at all (more once
  non-natives are excluded) — none of them ours.

## 2. The three decisions

**Aggregate to genus, not species.** The US regions carry genus-level Tallamy
figures (*Quercus alba* and *Q. rubra* both read 511). Species-level European
counts are far lower — *Quercus robur* alone is 121 — so mixing the two would
make French plants look impoverished beside American ones for reasons of method,
not ecology. Genus keeps one comparable scale, which is the whole point of a
shared anchor.

**Keep only relatives that grow in the region's zone, and only ones native to
Europe.** A genus count over all European congeners credits a plant with
Lepidoptera recorded on ornamental or American relatives. A member species counts
only if `Ecosystems.csv` flags it present in the region's zone *and* not
`Non-native`. Honeysuckle makes this concrete: three of the ten oceanic
*Lonicera* in the matrix are introduced ornamentals carrying ~54 Lepidoptera that
native woodbine wouldn't, so *Lonicera periclymenum* reads **57** rather than
111. Since the number is read as "caterpillars that eat this plant," and the app
exists to recommend natives, the narrower count is the honest one.

The cost is that a genus count becomes **region-dependent** — the same genus may
differ between Atlantic and Mediterranean France. The emitted lookup table
handles that by storing every zone.

**Both counts stay visible**, so the choice can be argued with rather than
discovered. `host-counts.json` carries the zone-only figure beside the
zone-and-native one, and where they differ the plant's `basis` names both. Five
rows differ:

| Plant | Zone only | Ships (zone + native) |
|---|---|---|
| Lonicera periclymenum | 111 | **57** |
| Quercus robur | 395 | **391** |
| Prunus avium / spinosa | 321 | **318** |
| Fragaria vesca | 53 | **50** |

**`HOST_ANCHOR` stays 520.** The highest European count is 391, so nothing clips
and **no US score moves** — the cross-region comparability §4.3 asked us to
protect holds without re-anchoring.

**Zone mapping**, EEA biogeographical region → Gaytán ecosystem column:

| EEA region | Gaytán zone |
|---|---|
| `atlantic` | Oceanic temperate |
| `continental` | Continental temperate |
| `alpine` | Mountain |
| `mediterranean` | Mediterranean |

## 3. `app/scripts/build-host-counts.mjs`

A build-time script in the shape of `build-registry.mjs`. It never runs in the
browser and adds nothing to the bundle.

**Inputs:** the three data files. **Fails loudly** if any is missing, naming the
source README's download instructions — a fresh clone or CI has none of them.

**Genus resolution** reads `Taxonomy.xlsx`'s `GENUS` column. Parsing xlsx means a
small built-in reader — `zlib.inflateRawSync` over the zip entries plus a regex
over the sheet XML, roughly 40 lines, **no new dependency**, keeping the app's
zero-dep stance. It asserts taxonomy covers every matrix column and fails if a
future refresh breaks that.

**Counting rule:** for a genus *G* and zone *Z*, the count is the number of
distinct Lepidoptera rows carrying a `1` against **any** plant column whose genus
is *G*, which is flagged present in *Z*, and which is **not** flagged
`Non-native`. Computed for all 973 genera × 9 zones. Each cell also records the
zone-only count and the all-Europe total, so the effect of each filter stays
inspectable rather than baked in.

**Output 1 — `data/sources/eu-lep-plant-matrix/host-counts.json`, committed.**
The reviewable artifact: the multi-MB CSV stays ignored, but every number that
reaches the app shows up in a diff. It carries the citation and DOI, the counting
rule in words, the generating script, per-genus per-zone counts in both variants
with the all-Europe total, member-species counts per zone, and the four plants
absent from `Ecosystems.csv`. This is exactly the "small snapshot committed,
bulk dataset ignored" split `data/sources/README.md` sets out. It's data, not app
code — no bundle impact.

**Output 2 — a stdout report**, not an in-place rewrite of `plants.*.ts`: for a
named region, current vs. proposed `hostLepCount` per row. The region files stay
hand-edited on purpose. Each row's `basis` prose and `confidence` are editorial
judgments, and those files exist to be auditable by a non-programmer; a codemod
would erode that.

### Two edge rules, both from cases that actually occur

- **A plant missing from `Ecosystems.csv`** counts as present in *no* zone.
  Conservative — it can only understate a count, never inflate one — and the
  affected names are listed in the JSON rather than silently dropped.
- **A genus with no member in the requested zone** yields `0`. For a genus we
  actually ship, the script **errors instead of emitting the 0**, because that
  means the zone mapping or the plant name is wrong, and a silent zero would
  quietly destroy a plant's ranking. No such case exists in Atlantic France.

## 4. The recomputed Atlantic France rows

`app/src/data/plants.france-atlantic.ts`, 23 rows:

| Plant | Now | After | | Plant | Now | After |
|---|---|---|---|---|---|---|
| Quercus robur | 280 | **391** | | Fragaria vesca | 30 | **50** |
| Salix caprea | 250 | **377** | | Cornus sanguinea | 30 | **42** |
| Prunus avium | 120 | **318** | | Primula veris | 6 | **35** |
| Prunus spinosa | 100 | **318** | | Sambucus nigra | 30 | **31** |
| Betula pendula | 230 | **306** | | Hedera helix | 20 | **18** |
| Crataegus monogyna | 150 | **200** | | Digitalis purpurea | 8 | **12** |
| Alnus glutinosa | 90 | **163** | | Succisa pratensis | 6 | **9** |
| Corylus avellana | 70 | **124** | | Ilex aquifolium | 12 | **7** |
| Sorbus aucuparia | 55 | **109** | | Dryopteris filix-mas | 2 | **5** |
| Carpinus betulus | 40 | **92** | | Hyacinthoides non-scripta | 3 | **2** |
| Deschampsia cespitosa | 25 | **62** | | | | |
| Lonicera periclymenum | 33 | **57** | | | | |

**The interim estimates were conservative almost everywhere.** Twenty of the 23
rise; only three fall, all slightly — holly (12→7), ivy (20→18) and bluebell
(3→2). Wild cherry and blackthorn move most (120→318, 100→318) and cowslip
nearly sixfold (6→35). This reorders results, so the PR carries before/after
screenshots per `CLAUDE.md`.

Alongside the numbers: each row's `basis` swaps from the Southwood/BRC estimate
wording to the Gaytán citation, and on the five rows where the filter variants
disagree it names both figures; `confidence` rises where a count is now
data-backed (six rows sit at `medium` purely because the number was estimated);
the file's header comment (lines 10–24) stops describing interim estimates and
describes the real method; and `REGION.note` drops its trailing "Host-insect
figures are interim genus-level estimates, pending a recompute."

## 5. `#/sources` — "Where our numbers come from"

A new `app/src/steps/sources.ts`, registered in `main.ts`'s `STEPS`, modeled on
`steps/privacy.ts` — one plain-language page, legible to kids and grandparents,
documenting real behavior rather than aspiration. No new dependencies; text and
existing components only.

Its job isn't to reassure. It's to make the work **checkable**, and to say out
loud where it's weakest.

1. **The short version** — which numbers are measured, which are judgment, and
   that we'd rather be corrected than confident.
2. **Every number, and where it comes from** — host count, the six eco-scores,
   size-over-time, hardiness, sun/soil/pH, ecoregion, wildlife ties. Each tagged
   *measured*, *derived*, or *informed estimate*.
3. **The assumptions we make**, stated plainly: a genus-level count applied to a
   single species; a coarse EEA region standing in for one garden; SoilGrids on a
   250 m grid; USDA zones computed from Open-Meteo rather than the official map;
   European counts drawn from all-Europe Lepidoptera records rather than French
   ones; and the two filters behind every European host count.
4. **What to challenge first**, ranked by where we're most likely wrong — the
   genus-for-species substitution; the hand-authored 0–100 eco-scores, the
   softest numbers in the app; the fact that regions differ in how rigorously
   they're sourced; small seed lists presented as "the" list for a region; and
   the US host counts, whose source has murkier reuse terms than the European
   one.
5. **How to challenge it** — the repo, the issues URL, `DATA_SOURCES.md`, and the
   `basis` line already visible on every plant.

**Reachable from** the welcome-screen footer beside Privacy, and from the `basis`
citation on plant pages.

## 6. Docs to update in the same PR

- `DATA_SOURCES.md` — the Gaytán row moves from *integration pending* to
  integrated, stating the genus + zone + native method; the interim-estimates ⚠️
  row for Southwood/BRC retires.
- `docs/france-localization-plan.md` §4.3 — the recompute landed; point here.
- `data/sources/eu-lep-plant-matrix/README.md` — all four files described (it
  currently anticipates one), the download, committed-vs-ignored, and the command
  that consumes them.
- `CHANGELOG.md` — an `Added` bullet for the sources page and a `Changed` bullet
  for the host counts in plain warm words, plus an `Internal:` bullet for the
  script.

## 7. How it gets verified

- `npm run build` and typecheck pass.
- The script's report reproduces the numbers in §4 exactly — they were computed
  from the real files during design, so a mismatch means the script is wrong.
- The script fails correctly with the source files absent.
- US region host counts confirmed **unchanged** (the diff touches only
  `plants.france-atlantic.ts`).
- Before/after screenshots at 390×844 in both schemes, for the Atlantic France
  results ranking and one moved plant page, each capture's width checked against
  viewport × DPR.
- Bundle size re-measured and the quoted figure updated everywhere if it moves
  materially.

## 8. Deliberately out of scope

- **No DBIF cross-check.** §4.3 names it as a sanity check and it stays worth
  doing, but it's a second source with its own reconciliation problem; the Gaytán
  numbers stand on their own and this PR is already wide.
- **No recompute for other European regions.** Continental, Alpine and
  Mediterranean France don't exist yet. `host-counts.json` ships every zone, so
  they need no re-fetch when they arrive.
- **No change to US counts or `HOST_ANCHOR`.**
- **No i18n.** The sources page ships in English like the rest of the UI;
  translation is Track 1 of the localization plan.
