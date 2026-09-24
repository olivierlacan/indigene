# HOSTS — the world's Lepidoptera host plants (NHM)

**Status: fetched and counted; usable for Australia, not yet used by a region.**

- Upstream: HOSTS — a Database of the World's Lepidopteran Hostplants, Natural
  History Museum, London, on the NHM Data Portal: doi:10.5519/havt50xw
- Licence: **CC0**.
- Refresh: `cd app && npm run hosts:fetch` → `genus-counts.json`

## What's here

| File | Committed? | What |
|---|---|---|
| `hosts-raw.json` | no (48 MB) | All 140,485 records: moth, host plant, location |
| `records/<area>.csv` | yes (~510 KB in all) | **The archive:** every HOSTS record for each candidate area, all of HOSTS' columns, sorted by host plant then moth |
| `genus-counts.json` | yes (26 KB) | For each area, distinct moth and butterfly species per host genus |

### The archive

| File | HOSTS locations | Records | For |
|---|---|---|---|
| `records/australia.csv` | Australia | 2,856 | Sydney |
| `records/southern-africa.csv` | South Africa, Southern Africa | 2,311 | Cape Town |
| `records/rio-de-la-plata.csv` | Argentina, Uruguay | 268 | Buenos Aires |
| `records/new-zealand.csv` | New Zealand | 357 | a cross-check on Plant-SyNZ |

It's kept so the evidence behind a count survives upstream edits and can be
read without the 48 MB download. HOSTS is CC0, so keeping it is fine. The counts
use fewer rows than the archive (2,635 for Australia): they skip rows with no
named host genus, like HOSTS' "Polyphagous" and "Detritophagous" categories.

Broad locations are left out on purpose: "Australasia", "Indo-Australian",
"Neotropical" and "East Africa" mix in records from New Guinea, the Amazon or
Kenya. `AREAS` in `app/scripts/fetch-hosts.mjs` is where to add one.

The Data Portal serves 1,000 records per request and refuses deep offsets, so
the script walks its `after` cursor. Its homepage returns 403 to scripts and so
does Python's default HTTP client, but the API answers Node and curl.

## What it can and can't do (measured 2026-09-24)

A HOSTS location is a country or a broad region ("Australia", "Southern
Africa", "Neotropical"), never a state or a city. Counts per host genus for
likely headline plants:

| Area | Records | Examples | Verdict |
|---|---|---|---|
| Australia | 2,635 | Eucalyptus 257 · Acacia 118 · Melaleuca 87 · Banksia 34 · Leptospermum 29 · Grevillea 18 | **Usable** for Sydney, as a national figure |
| South Africa + Southern Africa | 2,165 | Acacia 74 · Protea 33 · Rhus 33 · Diospyros 25 … Erica 1 · Pelargonium 1 | **Too thin alone** for the Cape: the fynbos genera are barely recorded |
| Argentina + Uruguay | 235 | Prosopis 12 · Eupatorium 5 … Erythrina 0 · Passiflora 0 | **Not usable** |
| New Zealand | 289 | Muehlenbeckia 3 · Leptospermum 2 | Plant-SyNZ records ten times more (pōhuehue 32) |

HOSTS doesn't say whether a moth is native where it was recorded, so a count
from it is "species recorded in this country". That's close to the Gaytán rule
for Europe, but looser than Plant-SyNZ's.
