# Pacific Northwest checklists: Burke Museum (UW) and OregonFlora (OSU)

**Upstream:** <https://burkeherbarium.org/pnwflora/> (native status, the whole
region), the Consortium of Pacific Northwest Herbaria's
[county lists](https://www.pnwherbaria.org/data/countylists.php) (where it
grows), and [OregonFlora](https://oregonflora.org/pages/taxonomic-checklist.php)
(native status in Oregon, south included)
**Retrieve and reduce:** `cd app && npm run pnw:checklist` (`-- --fetch` to
download the first two again; OregonFlora's is put in `raw/oregonflora/` by hand)
**Consumed by:** nothing in the app yet. The academic native-status source for
the [Pacific Northwest](https://indigene.app/regions/pnw), next to Kew.

## Why this list

It is the checklist of *Flora of the Pacific Northwest*, 2nd ed. (Hitchcock &
Cronquist, revised by Giblin, Legler, Zika & Olmstead; UW Press, 2018), the
standard flora of the region, kept current by the Burke Museum herbarium. Every
taxon is called **native or introduced** by the people who wrote the flora, and
it crosses the border: British Columbia is in, to 51° N. It is the same
database the herbaria's specimen portal uses for names.

Both downloads are offered for programs: the checklist as a tab-delimited ZIP
"for ingestion by databases … or other programs", the county list as a
tab-delimited file. burkeherbarium.org has no `robots.txt`; pnwherbaria.org's
only keeps scripts off thumbnails. So a script fetches them, once per run, and
names Indigene in its user-agent.

## What is committed

`pnw-checklist.csv` — one row per species or infraspecies, facts only:

| Column | Meaning |
|---|---|
| `name` | the name the checklist prints |
| `family` | APG IV family |
| `origin` | `native`, `introduced`, `both` (native and introduced populations, like yarrow), or with a `?` where the checklist is unsure |
| `endemic`, `extirpated`, `waif`, `peripheral`, `excluded` | the checklist's flags, `Y` or blank. `excluded` is a name reported from the region that the flora rejects |
| `westCounties` | how many of the 37 counties below have a specimen, cultivated ones left out |
| `synonyms` | other names it has gone by, `;`-separated |

`oregonflora.csv` — one row per taxon OregonFlora accepts: `name`, `family`,
`origin` in its own words (`native`, `exotic, naturalized`, `exotic, not
naturalized`, `native and exotic`, `uncertain`), its taxonomic `note`, and
`synonyms`. Misapplied names are left out.

`ours.json` — what both say about each of our rows that isn't clean.

The downloads themselves stay in the git-ignored `raw/`.

| Retrieved | Checklist last edited | Taxa | Not excluded | Native | Introduced | With a west-side specimen |
|---|---|---|---|---|---|---|
| 2026-10-17 | 2023-11-26 | 6,779 | 6,270 | 4,587 | 1,659 | 4,472 |

| OregonFlora version | Accepted taxa | Native | Exotic, naturalized | Exotic, not naturalized | Native and exotic | Uncertain |
|---|---|---|---|---|---|---|
| 2.4, 2026-05-26 | 5,499 | 4,033 | 745 | 631 | 29 | 60 |

## The counties: west of the crest

The American side of the region's EPA ecoregions (1, 2, 3, 4, 78). Counties
that reach the crest from the west are in; those mostly east of it (Hood River,
Klickitat, Chelan) are out.

- **Washington (19):** Clallam, Clark, Cowlitz, Grays Harbor, Island,
  Jefferson, King, Kitsap, Lewis, Mason, Pacific, Pierce, San Juan, Skagit,
  Skamania, Snohomish, Thurston, Wahkiakum, Whatcom
- **Oregon (18):** Benton, Clackamas, Clatsop, Columbia, Coos, Curry, Douglas,
  Jackson, Josephine, Lane, Lincoln, Linn, Marion, Multnomah, Polk, Tillamook,
  Washington, Yamhill

The count comes from specimens, so a zero can mean nobody collected it there.
The county list's own "Origin" column is not read: it comes from specimen
labels and disagrees with itself (one taxon in five is blank in King County).

## Limits

1. **The Burke download is older than its site.** The ZIP is labelled
   "generated nightly" but its files are dated 2023-12-01; the site says it was
   last updated 2026-02-08. Names the herbaria have since adopted miss the
   join: specimens filed as *Rubus parviflorus* don't count toward the
   checklist's *Rubus nutkanus*, so thimbleberry shows 0 west-side counties.
2. **The flora's region isn't ours.** It runs east to western Montana and
   **leaves out southern Oregon** — the Klamath country (Jackson, Josephine,
   Curry) our region runs down to. OregonFlora covers that; `westCounties`
   says whether the rest includes our side of the crest.
3. **British Columbia has no county list.** The checklist covers it, but the
   west-side count is American only.
4. **OregonFlora is statewide.** Native in Oregon includes the dry east.

## OregonFlora, by hand

OregonFlora (Oregon State University) publishes the Oregon Vascular Plant
Checklist with the *Flora of Oregon*. Its `robots.txt` shuts out every agent but
the big search engines, so a person downloads it from the
[checklist page](https://oregonflora.org/pages/taxonomic-checklist.php) and
puts the files in `raw/oregonflora/`:

| File | What | Read |
|---|---|---|
| `Checklist_ForWeb.csv` | the whole checklist, every name with its status and the accepted taxon's origin | yes |
| `Natives_OregonFlora.csv` | the natives only; the same 4,033 taxa | no, a subset of the above |
| `CLrevisions.csv` | changes between versions | no |
| `glossary.pdf` | what the terms mean | the definitions below |

The export is Windows-1252, not UTF-8. Its glossary defines **native** as
"established in the landscape independently from direct or indirect human
intervention … prior to European settlement", and **exotic** as from "distant
parts of North America or from other continents" after it. **Naturalized** is
an exotic that has persisted 3–5 years and spread.

## What they say about our rows (2026-10-17)

99 of our 106 rows are native in both checklists under the name we use, with a
west-side specimen. The other seven:

| Our name | Burke (2023 download) | OregonFlora 2.4 | For a person |
|---|---|---|---|
| *Frangula purshiana* | native | native, as *Rhamnus purshiana* | name only |
| *Sambucus nigra* subsp. *caerulea* | native, as *S. cerulea* | native, as *S. mexicana* ssp. *cerulea* | name only |
| *Urtica gracilis* | native, as *U. dioica* ssp. *gracilis* | the same | name only |
| *Rubus parviflorus* | not listed; PNW thimbleberry is *R. nutkanus* | native | name only |
| *Cornus sericea* | "ambiguous": split between *C. occidentalis* and *C. stolonifera*, both native | native | name only |
| *Achillea millefolium* | both | native and exotic | keep; say which to buy |
| *Sidalcea campestris* | **introduced**, and also endemic | **native** | Burke's entry looks like a data error; OregonFlora is newer and agrees with Kew |

## Terms

"Web site contents, including text, © Burke Museum; all rights reserved."
Native status, names and distribution are facts, not copyrightable; the CSVs
keep those and nothing either checklist wrote. Cite as: D.E. Giblin & B. Legler.
2023+. *Checklist of the Vascular Plants of the Pacific Northwest.* University
of Washington Herbarium. <https://burkeherbarium.org/pnwflora/>. And:
OregonFlora. 2026. *Oregon Vascular Plant Checklist*, version 2.4. Oregon State
University. <https://oregonflora.org/pages/taxonomic-checklist.php>.
