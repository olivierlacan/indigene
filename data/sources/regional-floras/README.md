# Regional checklists: a second native-status check

**Retrieve and check:** `cd app && npm run floras` (`-- --fetch` to download
every source again, `-- --region chicago` for one)
**Consumed by:** `npm run native-evidence` → the second line on each plant
page; `app/src/data/cross-checks.ts` → the region page drops its "Kew alone"
warning.

Kew's World Checklist sees whole states and countries. These are the lists the
region's own botanists keep. The plan and the reasoning for each choice are in
[`docs/academic-checklists/`](../../../docs/academic-checklists/README.md);
this folder is the part of it a script can do alone.

| Region | Sources | Grain |
|---|---|---|
| Northern Michigan | Michigan FQA (U-M Herbarium & MNFI, 2014) | state |
| Chicago | Flora of the Chicago Region (Wilhelm & Rericha 2017) · Illinois FQA (Taft et al. 1997) | 22 counties · state |
| Mid-Atlantic | Pennsylvania Vascular Plant List (PNHP) · New Jersey FQA (NJDEP 2019) | state · state |
| Ireland | BSBI Plant Atlas 2020 native statuses, `statusIE` | island |
| Auckland | Checklist of the New Zealand Flora 2026 (Allan Herbarium) · Auckland Council TR2025/6 | country · region |
| Atlantic France | Regional red lists of the ten old regions in the west (INPN BDC-Statuts v18) | old region |
| Continental France | Regional red lists of Alsace, Lorraine, Champagne-Ardenne, Bourgogne, Franche-Comté | old region |
| French Alps | Regional red lists of Rhône-Alpes and Provence-Alpes-Côte d'Azur | old region |

## What is committed

Only `<region>.json`, one per region, one line per row we ship: each
source's `verdict` (native, introduced, both, uncertain, absent) and the name
it was found `as`.

The downloads stay in the git-ignored `raw/`, and the script fetches any that
are missing. Nothing in the app reads the whole lists, so they aren't kept.

| Source | Retrieved | Taxa | Native | Introduced | Other |
|---|---|---|---|---|---|
| `mi-fqa` (universalFQA 50) | 2026-10-24 | 2,872 | 1,810 | 1,062 | |
| `chicago-fqa` (universalFQA 80) | 2026-10-24 | 3,149 | 1,876 | 1,273 | |
| `il-fqa` (universalFQA 162) | 2026-10-24 | 3,040 | 2,084 | 956 | |
| `nj-fqa` (universalFQA 157) | 2026-10-24 | 4,700 | 3,404 | 1,296 | mosses and genera included |
| `pa` (PNHP `PlantChecklist.txt`) | 2026-10-24 | 3,586 | 2,140 | 1,444 | 2 uncertain |
| `bsbi-ie` (Zenodo 11097371) | 2026-10-24 | 3,497 | 1,145 | 1,182 | 1,057 absent from Ireland, 113 uncertain or hybrid |
| `nz-checklist` (May 2026 TSVs) | 2026-10-24 | 6,015 | 2,798 | 3,210 | 5 extinct, 2 uncertain |
| `auckland` (TR2025/6 xlsx) | 2026-10-24 | 792 | 765 | — | 27 extinct in Auckland |
| `lrr-atlantic` (`BDC.zip`, LRR rows) | 2026-10-25 | 5,264 | 3,745 | 1,419 | 86 gone, 14 not evaluated |
| `lrr-continental` | 2026-10-25 | 4,433 | 3,135 | 1,093 | 55 gone, 150 not evaluated |
| `lrr-alpine` | 2026-10-25 | 3,289 | 3,173 | — | 23 gone, 93 not evaluated |

## How a name is matched

The name itself, then the source's synonyms, then — for a subspecies — its
species, and for a species its subspecies when they all agree. A source that
misses may know the name another source filed it under (the NZ checklist's
*Didymocheton spectabilis* is how Auckland's list finds kohekohe). Names
drawn differently still are in `REVIEWED` in `app/scripts/check-floras.mjs`,
each with a reason; a source that drops one fails the run.

## What they say about our rows (2026-10-24)

385 of 392 rows are native in every source. The seven that aren't ship as
they are, and the plant page says who said what:

| Region | Our row | Says | Note |
|---|---|---|---|
| Mid-Atlantic | *Echinacea purpurea* | PA: introduced · NJ: absent | Purple coneflower's range is farther west than the two states checked |
| Mid-Atlantic | *Penstemon digitalis* | PA: native · NJ: introduced | |
| Mid-Atlantic | *Baptisia australis* | PA: native · NJ: introduced | |
| Auckland | *Austroderia fulvida* | NZ: native · Auckland: absent | Auckland's list has *Austroderia* aff. *fulvida*, an unnamed toetoe, instead |
| Continental France | *Sorbus torminalis* | absent | Not in any red list in the file, under either name; TAXREF moved it to *Torminalis glaberrima* and the lists' rows didn't follow |
| French Alps | *Erica carnea* | absent | Not in the Rhône-Alpes list as loaded, though native in the Alps |
| French Alps | *Thymus serpyllum* | absent | Not in the Rhône-Alpes list; worth a botanist's look at which wild thyme the Alps have |

## Limits

1. **State lists, not the region.** Pennsylvania and New Jersey are two of the
   Mid-Atlantic's ten states; Illinois runs south past the region. A plant
   "absent" from one may be native elsewhere in the box.
2. **Michigan is one lineage.** The FQA comes from the same herbarium as
   Michigan Flora Online, which is the better source (county grain, current).
   Its API's certificate chain didn't verify on 2026-10-24, so the FQA stands in.
3. **Ireland is one lineage too.** The Glasnevin checklist is the independent
   second source, and it is a download by hand.
4. **The Illinois FQA is from 1997** and its taxonomy shows it.
5. **Auckland's list is natives only.** It can say "absent", never
   "introduced".
6. **A French red list scores only natives,** and NA marks the rest. Several
   lists were loaded with their native rows only, Hauts-de-France with its NA
   rows only, so "absent" there is a gap in the file as often as a finding.
   One list scoring a plant is enough for "native": the region is several old
   regions, and the question is the region. Mediterranean France isn't here:
   Provence's list holds threatened plants only and Languedoc never finished
   one. The Provence workbook, a download by hand, is what it waits on.

## Terms

The BSBI statuses, the NZ Checklist and Auckland Council's report are CC BY
4.0; BDC-Statuts is Licence Ouverte / Etalab. The FQA databases (universalFQA.org, GPLv3 calculator, each database its
authors') and the Pennsylvania list state no licence; native status is a fact,
and the snapshots keep only facts. Citations are in each `<region>.json` under
`sources`.
