# HOSTS — the world's Lepidoptera host plants (NHM)

**Status: fetched and counted; usable for Australia, India, Japan, Brazil and
East Africa — not yet used by a region.** The first pass measured four candidate
areas and two of them were the thinnest HOSTS has. Four better-recorded ones were
added 2026-10-02; Japan and India are the strongest non-Western areas in the
database.

- Upstream: HOSTS — a Database of the World's Lepidopteran Hostplants, Natural
  History Museum, London, on the NHM Data Portal: doi:10.5519/havt50xw
- Licence: **CC0**.
- Refresh: `cd app && npm run hosts:fetch` → `genus-counts.json`

## What's here

| File | Committed? | What |
|---|---|---|
| `hosts-raw.json` | no (48 MB) | All 140,485 records: moth, host plant, location |
| `records/<area>.csv` | **four of eight** (~500 KB) | **The archive:** every HOSTS record for an area, all of HOSTS' columns, sorted by host plant then moth |
| `genus-counts.json` | yes (76 KB) | For each area, distinct moth and butterfly species per host genus |

### The archive

| File | HOSTS locations | Records | For |
|---|---|---|---|
| `records/australia.csv` | Australia | 2,856 | Sydney |
| `records/southern-africa.csv` | South Africa, Southern Africa | 2,311 | Cape Town |
| `records/rio-de-la-plata.csv` | Argentina, Uruguay | 268 | Buenos Aires |
| `records/new-zealand.csv` | New Zealand | 357 | a cross-check on Plant-SyNZ |
| *not committed* | India | 10,023 | a Deccan or Himalayan foothill region |
| *not committed* | East Africa, Kenya, Tanzania, Uganda | 6,737 | Nairobi |
| *not committed* | Japan | 4,986 | Tokyo |
| *not committed* | Brazil | 3,994 | São Paulo / Rio |

It's kept so the evidence behind a count survives upstream edits and can be
read without the 48 MB download. HOSTS is CC0, so keeping it is fine. The counts
use fewer rows than the archive (2,635 for Australia): they skip rows with no
named host genus, like HOSTS' "Polyphagous" and "Detritophagous" categories.

**Why four and not eight.** Those last four areas are 2.2 MB of rows between
them — 4.5 times the size the `!hosts/records/*.csv` exception in
`data/sources/.gitignore` was written for, and nine tenths of the diff that added
them. They were measured to answer one question, *does a usable source exist on
this continent?*, and `genus-counts.json` answers it: every genus, its count, and
the date retrieved. So an area **surveyed** keeps its counts; an area a region is
**built on** earns its rows, which `npm run hosts:fetch` writes in a couple of
minutes. The four above predate the rule and stay.

The cost, plainly: if the NHM edits HOSTS, a survey count can no longer be shown
row by row — only the count and its date. Same trade the gitignore makes for the
48 MB raw file, and `resolve-ecoregions` for its 27 MB of shapes.

Broad locations are left out on purpose: "Australasia", "Indo-Australian" and
"Neotropical" mix in records from New Guinea or the Amazon. `AREAS` in
`app/scripts/fetch-hosts.mjs` is where to add one.

**"East Africa" is the one broad label kept**, because the region it would serve
is the Acacia-Commiphora bushland, which spans Kenya, Tanzania and Uganda. The
label sits at that region's own grain rather than above it. The three countries
are listed beside it because HOSTS files some records under each.

The Data Portal serves 1,000 records per request and refuses deep offsets, so
the script walks its `after` cursor. Its homepage returns 403 to scripts and so
does Python's default HTTP client, but the API answers Node and curl.

## What it can and can't do (first four areas 2026-09-24, next four 2026-10-02)

A HOSTS location is a country or a broad region ("Australia", "Southern
Africa", "Neotropical"), never a state or a city. Counts per host genus for
likely headline plants:

| Area | Records | Examples | Verdict |
|---|---|---|---|
| India | 9,402 | Shorea 140 · Terminalia 124 · Acacia 93 · Ficus 89 · Dalbergia 68 · Tectona 66 | **Usable, and the broadest area in HOSTS**: 176 genera reach 10 species, 83 reach 20 |
| East Africa | 6,357 | Acacia 186 · Albizia 63 · Ficus 61 · Hibiscus 54 · Capparis 43 · Combretum 41 | **Usable** for a savanna region: 124 genera reach 10, three times southern Africa |
| Japan | 4,873 | Quercus 561 · Castanea 174 · Prunus 105 · Fagus 99 · Acer 69 · Salix 62 | **Usable, and the best-shaped**: a temperate food web with oak on top, like the Nearctic |
| Brazil | 3,607 | Erythroxylum 38 · Cassia 32 · Inga 32 · Qualea 28 · Senna 28 · Schinus 27 | **Usable but crop-led** — see below |
| Australia | 2,635 | Eucalyptus 257 · Acacia 118 · Melaleuca 87 · Banksia 34 · Leptospermum 29 · Grevillea 18 | **Usable** for Sydney, as a national figure |
| South Africa + Southern Africa | 2,165 | Acacia 74 · Protea 33 · Rhus 33 · Diospyros 25 … Erica 1 · Pelargonium 1 | **Too thin alone** for the Cape: the fynbos genera are barely recorded |
| Argentina + Uruguay | 235 | Prosopis 12 · Eupatorium 5 … Erythrina 0 · Passiflora 0 | **Not usable** |
| New Zealand | 289 | Muehlenbeckia 3 · Leptospermum 2 | Plant-SyNZ records ten times more (pōhuehue 32) |

### How much of a count is crops

A big record count can be a big agricultural-entomology literature, which is no
use to a native-plant list. Counting crop and plantation genera in each area's
top fourteen:

| Area | Crops in top 14 | What leads once they're dropped |
|---|---|---|
| Japan | 3 | Quercus, Castanea, Prunus, Fagus — native forest trees all the way down |
| India | 5 | Shorea (sal), Terminalia, Acacia, Ficus, Dalbergia, Tectona (teak) |
| Southern Africa | 5 | Acacia, Combretum, Brachystegia, Rhus, Protea |
| Australia | 7 | Acacia, Melaleuca, Banksia, Leptospermum |
| East Africa | 8 | Acacia, Albizia, Ficus, Hibiscus, Capparis, Combretum |
| Brazil | 9 | Erythroxylum, Cassia, Inga, Qualea, Senna |

So Japan and India carry a wild-plant literature; Brazil's and East Africa's
rest more on crops, and a region built on either should expect its headline
plants to be ranked from fewer records than the totals suggest. Brazil's numbers
also sit far below what Atlantic Forest entomology actually describes — *Inga*
at 32 against the hundreds Janzen's tropical work implies — so a Brazilian count
is a floor, not an estimate.

### One calibration worth keeping

Japanese *Quercus* comes to **561** distinct Lepidoptera. Tallamy's figure for
American oaks, which four shipped regions already quote, is **511**. Two
independent sources, two continents, the same order of magnitude for the same
genus — which is the closest thing to a check on either number that exists.

HOSTS doesn't say whether a moth is native where it was recorded, so a count
from it is "species recorded in this country". That's close to the Gaytán rule
for Europe, but looser than Plant-SyNZ's.
