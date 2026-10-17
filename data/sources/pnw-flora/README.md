# Flora of the Pacific Northwest Checklist (Burke Museum, University of Washington)

**Upstream:** <https://burkeherbarium.org/pnwflora/> (native status) and the
Consortium of Pacific Northwest Herbaria's
[county lists](https://www.pnwherbaria.org/data/countylists.php) (where it grows)
**Retrieve and reduce:** `cd app && npm run pnw:checklist` (`-- --fetch` to download again)
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

The raw ZIP and county list stay in the git-ignored `raw/`.

| Retrieved | Checklist last edited | Taxa | Not excluded | Native | Introduced | With a west-side specimen |
|---|---|---|---|---|---|---|
| 2026-10-17 | 2023-11-26 | 6,779 | 6,270 | 4,587 | 1,659 | 4,472 |

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

## Three limits

1. **The download is older than the site.** The ZIP is labelled "generated
   nightly" but its files are dated 2023-12-01; the site says it was last
   updated 2026-02-08. Names the herbaria have since adopted miss the join:
   specimens filed as *Rubus parviflorus* don't count toward the checklist's
   *Rubus nutkanus*, so thimbleberry shows 0 west-side counties.
2. **The flora's region isn't ours.** It runs east to western Montana and
   **leaves out southern Oregon** — the Klamath country (Jackson, Josephine,
   Curry) our region runs down to. Native here means native somewhere in the
   flora's region; `westCounties` says whether that includes our side.
3. **British Columbia has no county list.** The checklist covers it, but the
   west-side count is American only.

## Filling the gaps by hand: OregonFlora

[OregonFlora](https://oregonflora.org/pages/taxonomic-checklist.php) (Oregon
State University) publishes the Oregon Vascular Plant Checklist, native and
not, statewide including the south. Its `robots.txt` shuts out every agent but
the big search engines, so no script fetches it. A person downloads the
checklist from that page and drops it in `raw/`; reading it is the next step.

## What it says about our rows (2026-10-17)

100 of our 106 rows are native under the name we use, with a west-side
specimen. The other six:

| Our name | Checklist | For a person |
|---|---|---|
| *Sambucus nigra* subsp. *caerulea* | native, as *Sambucus cerulea* | name only |
| *Urtica gracilis* | native, as *U. dioica* ssp. *gracilis* | name only |
| *Rubus parviflorus* | not listed; the flora calls PNW thimbleberry *Rubus nutkanus* | name only |
| *Cornus sericea* | "ambiguous" — the name has meant more than one plant; red-osier dogwood is *Cornus stolonifera*, native | name only |
| *Achillea millefolium* | `both`: native and introduced strains | keep; say which to buy |
| *Sidalcea campestris* | **`introduced`, and also `endemic`** — a contradiction | likely a data error; OregonFlora should settle it |

## Terms

"Web site contents, including text, © Burke Museum; all rights reserved."
Native status and distribution are facts, not copyrightable; the CSV keeps
those and nothing the checklist wrote. Cite as: D.E. Giblin & B. Legler.
2023+. *Checklist of the Vascular Plants of the Pacific Northwest.* University
of Washington Herbarium. <https://burkeherbarium.org/pnwflora/>.
