# VASCAN — Database of Vascular Plants of Canada

**Status: admitted for two new claims, and still refused for the one it was
refused for.** `DATA_SOURCES.md` turned VASCAN down once, and that refusal
stands: its *noms français normalisés* are Canadian French, and `taxa.fr.ts` is
French of France. The type system enforces it — `FrenchSource` doesn't include
`vascan`, so a Canadian name in the fr-FR table is a compile error.

This probe put two **different** claims to it, the ones a British Columbia or
Québec list would rest on. Both pass.

- Upstream: <https://data.canadensys.net/vascan/> · API
  <https://data.canadensys.net/vascan/api/0.1/search.json?q=Acer+saccharum>
- Publisher: Canadensys (Université de Montréal Biodiversity Centre)
- Licence: **CC BY 4.0**. Attribution: "Data from VASCAN, the Database of
  Vascular Plants of Canada."
- Refresh: `cd app && npm run probe:vascan` → `probe.json` (committed; the
  archive it reads is git-ignored)

## Read the archive, not the API

The obvious approach — one `search.json` call per plant — is wrong, and quietly
so. **VASCAN records distribution on the taxon that has it**, which for a species
with named varieties is the *variety*, not the species. `?q=Pseudotsuga
menziesii` returns an accepted species with an empty `distribution`, and the
first version of this probe duly concluded that Douglas-fir is not native to
British Columbia. Garry oak, red-flowering currant and camas failed the same way.

So the probe reads the Darwin Core Archive and rolls each species up over its own
infraspecific taxa and synonyms. The corrected numbers are roughly **double** the
broken ones. A second API trap, for anyone tempted back: repeated `q=` parameters
are joined into one comma-separated search term rather than treated as a batch,
so a "batched" call quietly returns one result for a nonsense name.

## Q1 — "native here", by province

VASCAN gives every taxon an `establishmentMeans` per province, keyed on ISO
3166-2 (`CA-QC`, `CA-BC`, …). That is the Canadian equivalent of the state-level
USDA PLANTS status our American regions already assert from, at the same
resolution, from a national authority, openly licensed.

Measured against the 420 distinct plants the catalog ships today:

| Province | Catalog plants VASCAN records as native |
|---|---|
| British Columbia | **130** |
| Ontario | 96 |
| Québec | **82** |
| New Brunswick | 70 |
| Alberta | 69 |
| Saskatchewan | 64 |
| Nova Scotia | 62 |
| Manitoba | 60 |
| Prince Edward Island | 52 |

156 of the 420 have no VASCAN entry at all — the Florida subtropicals, the
southern-California chaparral and the French flora. That is the expected shape
and a good sign the join is real rather than fuzzy.

The number that decides a work queue is the per-list one: **81 of the Pacific
Northwest's 85 rows are native in British Columbia**, and **40 of Northern Lower
Michigan's 46 are native in Québec**. Those rows already carry a size curve,
seven scores, care and propagation notes, wildlife ties, a photograph and a
French name. See `docs/region-queue.md` for what that does to the ordering.

**The resolution caveat, which matters most for British Columbia.** This is
*provincial* status, and a province is not an ecoregion. USDA PLANTS has the same
limitation at state level and we live with it, but British Columbia spans the
Pacific coast, a dry interior and the boreal north — so "native in BC" is a much
weaker claim there than in Prince Edward Island. It is a floor for the candidate
list, not the native assertion a region's rows make. That is one more reason the
ecoregion gate in `../cec-ecoregions/` comes first.

**How to read a name, and the bug that came of not doing it.** VASCAN records
distribution on the taxon that *has* it, so a species with named varieties
carries an empty distribution and the varieties carry the real one — and a
rollup that misses one of those quietly reports a plant as not native. This one
did, twice, and the second time it said Sitka spruce is not native to British
Columbia. The rollup now lives in one place, `app/scripts/_vascan.mjs`, shared
by the probe and by `npm run vascan:check`, so the two can no longer disagree.

## Q2 — a name for the rows fr-FR can't source

`taxa.fr.ts` carries 87 rows marked `pending`: shown on screen, but with no
fr-FR reference list behind them. They are mostly North American plants TAXREF
and Tela Botanica have no reason to cover.

VASCAN names **74 of the 87**. On 56 it says exactly what we already display; on
**18 it says something else** — "cornouiller hart-rouge" where we show
"cornouiller stolonifère", "belle asclépiade" where we show "asclépiade
voyante". The full list is in `probe.json`.

Those 18 are the point. They are the fr-FR/fr-CA split showing up as data, which
is the case for a **second table** (`taxa.fr-ca.ts`, typed `NameTable<QuebecSource>`)
rather than a reason to doubt either list. `lib/names.ts` already reserved
`QuebecSource = "vascan"` for exactly this.

**What it does not cover:** VASCAN is vascular plants only. The animals on a
Québec wildlife page would need their own fr-CA authority.

