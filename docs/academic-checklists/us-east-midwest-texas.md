# Native-status sources: Mid-Atlantic, Northern Michigan, Chicago, Central Texas

Researched 2026-10-17. Model: `data/sources/pnw-flora/` and `data/sources/atlas-florida/`.
Each source below was checked by fetching it, with a handful of requests per site. robots.txt was read first, and a path it shuts out was never fetched.
"By hand" means a person exports the data in a browser, the way the Florida Atlas and OregonFlora are already handled. Sources are ranked by quality, not by how easy they are to fetch. A source is rejected only if its terms forbid reusing the data itself.

Counts marked **(computed)** are mine, made from the downloaded file on the date above. Counts marked **(printed)** are quoted from the source.

---

## 1. Mid-Atlantic / Northeast Piedmont

Region box: 36.5–44.2° N, 83.5–71.0° W (`region.mid-atlantic.ts`), claiming EPA L3 58, 67, 70, 69, 60, 83, 59, 45, 61, 64, 62, 63, 65, 84, 66. That is all of PA, NJ, DE, MD, VA and WV; NY south of the Adirondacks; CT, RI and western MA; plus eastern Ohio (61, 70) and eastern Kentucky (69, 70). No single flora covers it, so the answer is a set of state floras. Pennsylvania is the reference state.

### 1a. Pennsylvania Vascular Plant List — PA Natural Heritage Program (DCNR / Western PA Conservancy) ★ recommended

- URL: <https://naturalheritage.dcnr.pa.gov/PlantChecklist.html>. Also served at naturalheritage.state.pa.us.
- **Grain:** statewide.
- **Status per taxon:** `Nativity` is `Native`, `Introduced` or `Uncertain`. An asterisk (`Native*`, `Introduced*`) marks complex cases, and the page explains each one. Every taxon "known to grow outside of cultivation in Pennsylvania" is listed.
- **Taxonomy:** FSUS (Weakley, *Flora of the Southeastern US*, 2023 PA edition). A `ConceptAlt` column maps each name to Rhoads & Block, *Plants of Pennsylvania* (2007).
- **Counts (computed), 3,586 taxa:**

  | Native | Native* | Introduced | Introduced* | Uncertain |
  |---|---|---|---|---|
  | 2,113 | 27 | 1,429 | 15 | 2 |

- **How to get it:** a single JSON file that the page's table loads, **<https://naturalheritage.dcnr.pa.gov/docs/PlantChecklist.txt>** (`{"data":[{Sciname, ConceptAlt, Comname, Nativity, Family}]}`, 559 KB, UTF-8 with BOM). The page also has DataTables CSV/Excel buttons.
- **robots.txt:** none (404 on both hosts), so a script may fetch it.
- **Licence:** none stated on the page. It is a state agency's list of facts.
- **Verdict: YES.** Academic-grade, since it is the state heritage program on FSUS, and it is the best-shaped file of any source here. **Pitfall:** statewide only. The page itself warns that "native anywhere within the bounds of Pennsylvania … [is] not a very ecologically meaningful" grain.
- The **old Pennsylvania Flora Database** (Morris Arboretum, paflora.org) is gone: the domain is a parked Bluehost page. Rhoads & Block survives only as a book and as this list's `ConceptAlt` column.

### 1b. Digital Atlas of the Virginia Flora — Virginia Botanical Associates ★ recommended

- URL: <https://vaplantatlas.org/>. It is the companion to *Flora of Virginia* (Weakley, Ludwig & Townsend, 2012).
- **Grain:** county and independent city, from herbarium vouchers (VPI, WILLI, US, GH, PH, NY and others; about 574,000 Virginia specimens).
- **Status per taxon:** `Native Status` is `N` or `I`. The species page reads "Native Status: Introduced". Status is curated by G.P. Fleming, and exotics by R.A.S. Wright and R. Simmons.
- **Counts:** the Atlas prints no statewide figure. *Flora of Virginia* treats **3,164 taxa (printed)**, "all native and well-established non-native". Fairfax County alone has **2,034 rows (computed): 1,448 N, 559 I, 27 blank**.
- **How to get it:** **a CSV per county.** <https://vaplantatlas.org/index.php?do=browse:county&letter=F> lists every county under that letter, each with a "Download Vascular Plants of County" link, for example `https://vaplantatlas.org/plant-output/98v.csv` (Fairfax; `b` is the bryophyte file). Columns: `ID, Scientific Name, Common Name, Native Status, County`. The numbers are the Atlas's own county IDs, not FIPS codes, so read them from the letter pages. That is about 135 downloads for the whole state, which is nearly all inside the region box.
- **robots.txt:** none (404); floraofvirginia.org has `Disallow:` (empty). So a script may fetch, slowly. The letter pages are large: F is 3.4 MB.
- **Licence:** "© 2026 Virginia Botanical Associates. All rights reserved." Cite as "Virginia Botanical Associates. (year). Digital Atlas of the Virginia Flora (https://www.vaplantatlas.org). c/o Virginia Botanical Associates, Blacksburg." Native status and county presence are facts.
- **Verdict: YES.** It is the closest Atlas of Florida analogue in the region, and scriptable. **Pitfalls:** some maps are still placeholders for taxa split after Atlas III. County presence comes from specimens, so a gap may only mean nobody collected there.

### 1c. New York Flora Atlas — New York Flora Association (with NYS Museum; built by USF Water Institute)

- URL: <https://newyork.plantatlas.usf.edu/>. Authors: Werier, Webster, Weldy, Nelson, Mitchell, Ingalls. It keeps Werier's *Catalogue of the Vascular Plants of New York State* (Mem. Torrey Bot. Soc. 27, 2017) current.
- **Grain:** county, vouchered only ("only plant populations vouchered by specimens in recognized Index Herbariorum herbaria are shown").
- **Status per taxon:** the User's Guide says "All taxa are listed as native or non-native in New York." Separate flags cover persisting and naturalized. Example from a species page: "Status: Not Persisting, Not Native, Unknown Naturalized Status, SNA".
- **Counts:** the 2017 Catalogue has **3,524 species, 134 infraspecific taxa and 264 hybrids, 3,922 taxa (printed)**. I found no printed native/non-native split.
- **robots.txt:** same USF platform as Florida, but ClaudeBot is **not** named here (GPTBot, ChatGPT-User and OAI-SearchBot are). `User-agent: *` is shut out of `/Results.aspx`, `/ViewAllPlants.aspx`, `/SpecimenResults.aspx` and every `*export*` path. `Plant.aspx` species pages are allowed.
- **By hand:** open <https://newyork.plantatlas.usf.edu/Search.aspx> (Advanced Search). Highlight the region's counties and press **Include**, choosing "any". Run the search, then press the **Export** button at the upper right of the results grid. It writes Excel. That is **one export per region**, or one per county if the multi-county grid is too large.
- **Licence:** "© 2026 New York Flora Association". No reuse terms are stated.
- **Verdict: BY HAND.** It is strong academically. New York is a large part of the box: ecoregions 58, 60, 62, 83 and 84.

### 1d. Maryland: Knapp & Naczi 2021 checklist + Maryland Plant Atlas

- **Checklist:** Knapp, W.M. & R.F.C. Naczi. 2021. *Vascular Plants of Maryland, USA*. Smithsonian Contributions to Botany 113. <https://doi.org/10.5479/si.14605674>. The PDF is on figshare (1.5 MB): <https://ndownloader.figshare.com/files/28039059>.
  - **Licence: CC BY-NC 4.0.**
  - **Counts (printed):** "3,525 taxa … 2,918 established taxa … 71.8% … native and 28.2% … introduced", which works out to about 2,095 native and 823 introduced. 324 taxa are excluded with reasons.
  - **Status per taxon:** native/introduced, statewide. **Pitfall:** it is a PDF, so the list has to be parsed out of the text.
- **Maryland Plant Atlas:** <https://www.marylandplantatlas.org/>, run by MD DNR, UMD Norton-Brown Herbarium and the Maryland Biodiversity Project, and synced to Knapp & Naczi.
  - **robots.txt:** `User-agent: * / Crawl-delay: 5`, so a script is allowed.
  - **County export:** the Advanced Search (`explore.php`) has a county filter and an **Export to CSV** button. The page posts to `services/getExplore.php`.
  - I could not confirm that the export carries nativity: the checklist pages render client-side, and their columns include "Category".
- **Maryland Biodiversity Project** (marylandbiodiversity.com) answered 403 behind Cloudflare. By hand only. It is not an academic source.
- **Verdict:** Knapp & Naczi **YES**, as the statewide academic authority, though it needs PDF parsing. The MPA county CSV is **probably YES**; its native field still needs checking.

### 1e. Regional FQA databases on universalFQA.org (both Midwest and East use these)

- **API:** <https://universalfqa.org/get/database/> returns the index as JSON, and `/get/database/<id>` returns one database. The R package `fqar` uses the same endpoints.
- **robots.txt:** none; the path returns the site's error page. **Licence:** the calculator is GPLv3. Each database is its authors' work and should be cited as listed in the index.
- **Status per taxon:** each row carries `native` or `non-native`, a C-value, wetness and physiognomy.

| id | Database | Native | Non-native | Note |
|---|---|---|---|---|
| 25 | Mid-Atlantic Piedmont Region (MAWWG 2012) | 2,029 | 0 | natives only, ecoregion grain |
| 23 | Delaware (McAvoy 2013, Flora of Delaware Online) | 1,598 | 708 | printed in the DB header |
| 157 | New Jersey (Walz et al. 2019, NJDEP) | 3,404 | 1,296 | includes mosses and genus-level rows |
| 204 / 206 | NatureServe 2021, ecoregions 84 / glaciated Allegheny Plateau | — | — | ecoregion grain; not fetched |
| 131 / 132 / 135 | NatureServe–NEIWPCC 2018, ecoregions 58 / 59 / 83 | — | — | 132 returned malformed JSON |
| 64 | West Virginia (WVNHP 2015) | — | — | API returned empty data |

- **Verdict:** **YES as a cross-check.** The Piedmont database is the only ready-made list at **ecoregion grain** for this region. **Pitfall:** an FQA list exists to score sites, not to be a flora. Coverage is wetland-leaning (MAWWG) and may lag taxonomy.

### 1f. Others checked

| Source | Finding | Verdict |
|---|---|---|
| **Mid-Atlantic Herbaria Consortium** (midatlanticherbaria.org, Symbiota) | robots.txt allows only Google, Bing, Slurp and DuckDuckGo; `User-agent: * Disallow: /` | **By hand.** Specimen county lists only, no native flag; useful only for "grows here" counts, like the PNW county list |
| **Go Botany** (Native Plant Trust) | robots allows all. Its map is "adapted from BONAP data": native/non-native per New England county. "All images and text © … All rights reserved." | No. Derived from BONAP, and New England is only an edge of the box |
| **BONAP** (Kartesz, NC Botanical Garden) | See §4b. County native/exotic for every US county | By hand; a strong independent cross-check |
| **Flora of Delaware Online** (DNREC, McAvoy) | Proxy refused delaware hosts; its FQA copy is above | Use the FQA copy (id 23) |
| **Connecticut** (Wagner / UConn) | Proxy refused cwagner.uconn.edu | Not checked |
| **FSUS** (Weakley, UNC Herbarium) | PA's list is built on it. Covers PA/NJ south; PDF and app | Not checked; the taxonomic backbone, not a table |

**Recommended for the Mid-Atlantic:**

1. **PNHP Pennsylvania Vascular Plant List**: one JSON file, scriptable, FSUS taxonomy.
2. **Digital Atlas of the Virginia Flora**: county CSVs, scriptable.
3. **New York Flora Atlas**, by hand.

Add the **Mid-Atlantic Piedmont FQA** (id 25) as the ecoregion-grain native list, and **Knapp & Naczi** for Maryland.

**Pitfalls:** every state uses a different taxonomy (FSUS, *Flora of Virginia*, Werier, Knapp & Naczi), so joins need synonyms. "Native to the state" includes the Appalachians and the coast.

---

## 2. Northern (Lower) Michigan

Region: 44.0–45.9° N, 86.7–83.3° W; EPA 50 and 51.

### 2a. Michigan Flora Online — University of Michigan Herbarium (Reznicek, Voss & Walters) ★ recommended

- URL: <https://michiganflora.net/>. It is a Vue app; its API host is `https://lsa-miflora1-p.lsait.lsa.umich.edu/`.
- **Grain:** county. Every Michigan county is searchable.
- **Status per taxon:** `na` is `N` (native) or `A` (adventive). Physiognomy carries the same split (`Nt Tree`, `Ad Tree`). Adventive taxa also print in capitals and have C-value `*`.
- **Counts (computed): 2,934 taxa statewide, 1,815 native, 1,119 adventive.**
  - Emmet County: 1,162 (836 N, 326 A).
  - Emmet + Cheboygan: 1,372. A comma-separated county list returns taxa from **any** of the counties.
- **How to get it:** a JSON API, used by the site itself.
  - The whole flora: `https://lsa-miflora1-p.lsait.lsa.umich.edu/api/v1.0/flora_search_sp?n_results=0`
  - By county: `…&county=Emmet,Cheboygan,Charlevoix,…`
  - Fields: `plant_id, scientific_name, author, family_name, c, w, wet, phys, na, st, acronym, common_name[]`.
  - **One request per region.**
- **robots.txt:** none. Both hosts answer `/robots.txt` with the app's HTML, so nothing is disallowed.
- **Licence:** the site's citation is "MICHIGAN FLORA ONLINE. A. A. Reznicek, E. G. Voss, & B. S. Walters. February 2011. University of Michigan. Web. <date>." No reuse terms are stated.
- **Verdict: YES**, the best-shaped source in this report. **Pitfall:** county presence comes from specimens (`locs_sp`). The county set is ours to choose: the box takes in roughly Emmet, Cheboygan, Presque Isle, Charlevoix, Antrim, Otsego, Montmorency, Alpena, Leelanau, Grand Traverse, Kalkaska, Crawford, Oscoda, Alcona, Benzie, Manistee, Wexford, Missaukee, Roscommon, Ogemaw, Iosco and Mason/Lake.

### 2b. Michigan Floristic Quality Assessment Database (2014) — U-M Herbarium + MNFI (MSU) ★ recommended as the second list

- universalFQA id **50**: Reznicek, Penskar, Walters & Slaughter 2014. `https://universalfqa.org/get/database/50`.
- **Grain:** statewide. Each row is `native` or `non-native`, with C-value.
- **Counts (printed in the DB header): 2,872 species, 1,810 native, 1,062 non-native.**
- **Verdict: YES**, but **it is not independent of 2a**: same herbarium, same lead author, a snapshot of the same flora. It catches drift between 2014 and today, nothing more.
- For an independent second opinion, use **BONAP** county maps (§4b), by hand, or Kew WCVP, which the repo already has.
- **MNFI** (mnfi.anr.msu.edu, robots allows all) tracks rare species and natural communities. It publishes no whole-flora native list. **No.**
- The later Michigan databases on universalFQA (ids 267, 312, 313) are consultants' edits (Merjent, Orbis). **No.**

---

## 3. Chicago & the Corn Belt Prairie

Region: 39.1–42.9° N, 90.6–86.2° W; EPA 54 only. That is mostly northern and central Illinois (Chicago south to Springfield and Champaign), plus a strip of NW Indiana. Wisconsin is barely in.
**Note:** the "Chicago Region" of the flora is 22 counties around the lake. Our region reaches much further south, to Springfield and Champaign, which the Chicago flora does not cover.

### 3a. Flora of the Chicago Region (Wilhelm & Rericha 2017, Indiana Academy of Science) via its FQA database ★ recommended

- universalFQA id **80**: "Flora of the Chicago Region UFQA Database. 2018. Kenneth Johnson. [As per … Wilhelm & Rericha 2017]". `https://universalfqa.org/get/database/80`.
- **Grain:** the 22-county Chicago Region, in IL, IN, WI and MI. No county column.
- **Status per taxon:** `native` or `non-native`, with C-value.
- **Counts (printed in the DB header, matching the book's press figures): 3,149 taxa, 1,876 native, 1,273 non-native.**
- **Verdict: YES**, the regional academic flora. **Pitfall:** it covers only the northern third of our box.
- Older options: id 1 (Swink & Wilhelm 1994), id 149 (USACE Chicago 2017).

### 3b. Illinois Plants — Illinois Natural History Survey (Prairie Research Institute, University of Illinois) ★ recommended

- URL: <https://inhs.illinois.edu/data/plantdb/>, which redirects to wwv.inhs.illinois.edu.
- **Grain:** county, with a confidence class per county record (high = vouchered; medium-high; medium = mostly Mohlenbrock & Ladd 1978; planted or introduced).
- **Status per taxon:** "Origin: Native", and a search filter for Native to Illinois / Not native to Illinois.
- **Counts (computed from search totals):**

  | Area | All | Native | Not native |
  |---|---|---|---|
  | Statewide | 3,259 | 2,107 | 850 |
  | Cook County | — | 1,362 | 481 |

  About 300 taxa statewide have no origin set.
- **How to get it:** the Advanced Search form (`/data/plantdb/searchform`) POSTs to `/data/plantdb/list` with `county[]=<id>` (multi-select, for example Cook=31, Champaign=19), `native=t|f|any` and `order_by=scientificName`. Results come 20 per page, paged by session (`/data/plantdb/list/20`, `/40`, …), so a script needs a cookie jar.
  - A region of about 20 counties is roughly 100–150 pages.
  - The "Download species information for these results" form is **broken**: its action is unrendered PHP (`<?echo "/$page_base/dump_ILPIN/"?>`).
- **robots.txt:** only `/wp-admin/` is disallowed, so a script may fetch, slowly.
- **Licence / terms:** the Terms of Use cover disclaimers and privacy only. They say nothing against reusing data. "Copyright © 2026. All Rights Reserved."
- **Verdict: YES.** It is the only source that covers the whole box at county grain. **Pitfall:** the medium-confidence county records are historical literature, not specimens. Keep the confidence class, or count only high and medium-high records.

### 3c. Others checked

| Source | Finding | Verdict |
|---|---|---|
| **Illinois FQA** (Taft et al. 1997; id 7, and id 162 with families added 2020) | statewide, `native` / `non-native` | **YES as a cross-check**; old taxonomy |
| **Indiana Plant Atlas** (Butler University Friesner Herbarium; Dolan & Moore) | Same USF platform and robots as New York: `/Results.aspx` and `*export*` disallowed. Species pages carry "C value 6, Status Native, OBL". | **By hand** for the NW Indiana counties (Lake, Porter, Newton, Jasper, Benton, Tippecanoe, …): Advanced Search, include counties, Export. One export. Indiana FQA (Rothrock 2004; id 14, updated as id 156 in 2019) is the scriptable cross-check |
| **Wisconsin State Herbarium** (UW–Madison) | `WI_taxa_Jan_2017.xlsx` (<https://herbarium.wisc.edu/research/keys-tools/>; robots allows). Column `WiscFound` = `W - Native` / `W - Introduced`, plus C-value. **Computed: 3,357 rows, 2,370 native, 968 introduced, 17 `?`.** Statewide. | YES if Wisconsin matters, but the region barely enters it. Wisflora (Symbiota) has county floras (project pid=7) but renders client-side; robots allows `/checklists/` |
| **illinoisplants.org** | The Illinois Native Plant Society's site, not a database | No |

**Recommended for Chicago:**

1. **INHS Illinois Plants** (county grain, the whole box).
2. **Flora of the Chicago Region FQA** (id 80, the regional authority).
3. **Indiana Plant Atlas**, by hand, for the Indiana strip.

---

## 4. Central Texas (Edwards Plateau 30, Blackland Prairies 32, Cross Timbers 29)

Texas has **no online county atlas with a native flag**, unlike Virginia, Michigan or Illinois. The academic floras are print or PDF.

### 4a. Shinners & Mahler's *Illustrated Flora of North Central Texas* (Diggs, Lipscomb & O'Kennon 1999; BRIT / Austin College) ★ recommended for DFW and the Cross Timbers

- **Free full-text PDFs** from the Fort Worth Botanic Garden | BRIT: <https://fwbg.org/research/brit-press/illustrated-flora-of-north-central-texas-online>. Nine PDFs; the intro is `FNCT_0001-0108-FrontMatter-Intro.pdf`, 5.8 MB.
- **robots.txt:** `/wp-admin/` disallowed, `Crawl-delay: 10`. A script may fetch.
- **Grain:** the North Central Texas region, "about the size of Kentucky": Cross Timbers, Grand Prairie and the northern Blackland, down to about Waco and the Lampasas Cut Plain. **Not** Austin, San Antonio or most of the Edwards Plateau.
- **Status per taxon:** the symbol **I** marks "taxa introduced to the United States". Unmarked taxa "are native to the continental United States".
- **Counts (printed):** "2,223 species … and 2,376 taxa"; "the 394 species introduced from outside the United States … make up 17.7 %". That leaves about 1,829 natives.
- **Licence:** "© 1999 BRIT and Austin College".
- **Verdict: YES**, but it means extracting a table from PDFs. **Pitfall:** "I" means introduced to the **US**, so a species that came to Texas from elsewhere in the US counts as native here. The book says so itself.

### 4b. BONAP — Biota of North America Program (Kartesz, North Carolina Botanical Garden) ★ recommended for county grain

- **TDC Query:** <https://bonap.net/tdc>. **NAPA county maps:** <http://bonap.net/napa>. Home: <http://bonap.org/>.
- **Grain:** county, for every US county, colour-coded native, exotic, adventive and so on.
- **Status per taxon:** the TDC has a "Nativity" filter (Continental Native / Exotic / State-level Adventive) and a county or ZIP selector.
- **Pitfall:** TDC's county query "**expanded to include taxa from the county selected plus adjacent counties**". Use the state-level query with the native filter, and the NAPA maps for county detail.
- **robots.txt:** none (404 on bonap.net; bonap.org disallows only `/cgi-bin/` and `/cgi/`). The site is slow, and it reset or answered 503 several times.
- **By hand:** at <https://bonap.net/tdc>, set the State-level query to **Texas**, set Nativity to **Native** (then **Exotic**), set Taxa per page to **10000**, and run the query. Save the result page or copy the table. That is **two queries per state**. For each county: pick the county in "Search by county", which includes the adjacent counties.
- **Licence:** not stated on the pages I fetched. A third-party catalogue lists "Use Constraints: None". The Customized Geographic Database (bonap.net/TDC/CGD) needs an account. **Ask Kartesz before republishing** BONAP-derived rows.
- **Verdict: BY HAND**, and the strongest independent cross-check for Texas (and every other region here). PLANTS' native-status data came from BONAP.

### 4c. Others checked

| Source | Finding | Verdict |
|---|---|---|
| **Atlas of the Vascular Plants of Texas** (Turner, Nichols, Denny & Doron 2003, Sida Bot. Misc. 24, BRIT) | County dot maps for about 6,000 native and naturalized taxa. **Print only** (BRIT Press store); not online. UT's Plant Resources Center follows its taxonomy. | **By hand, from the book.** The academic county authority, but data entry from a book |
| **TORCH portal** (Texas Oklahoma Regional Consortium of Herbaria; TEX-LL, BRIT…) | robots: `User-agent: * Disallow: /`; only the four search engines allowed. Symbiota county checklists are specimen-based; no native flag found. | **By hand**, for "grows here" counts only (Checklists, then a county checklist, then Download). Same for SERNEC (same robots) |
| **Texas Blackland Prairies FQA** (Reemts & Eidson 2019; universalFQA id 160) | 487 taxa: 453 native, 34 non-native. A tallgrass-prairie study list, not a flora | Cross-check only |
| **Lady Bird Johnson Wildflower Center** | Natives only, selective. Already in `data/sources/wildflower-center/`, which calls it "not a flora" | **No** for counting natives against non-natives |
| **Texas Plant Information Database** (tpid.tpwd.texas.gov), txplants.org | Proxy refused (502) | Not checked |
| Carr, *Annotated Checklist of the Vascular Plants of Travis County* (UT PRC) | The linked PDF (`w3.biosci.utexas.edu/prc/wrc/Carr_TravisCountyFlora2008.pdf`) is 404 | Not available |
| Jones, Wipff & Montgomery 1997, *Vascular Plants of Texas* (UT Press); Hatch et al. 1990 checklist | Statewide checklists with nativity; print. Hatch lists taxa by Texas vegetational area, which would be the right grain | By hand from the book, if found |

**Recommended for Central Texas:**

1. **BONAP**, by hand: county or state, native/exotic.
2. ***Illustrated Flora of North Central Texas***: free PDFs, regional, academic; covers DFW and the Cross Timbers half of the region.
3. **Turner et al. 2003 Atlas**, from the book, for the Hill Country and Austin–San Antonio.

Kew WCVP (already in the repo) stays the scriptable statewide check. **Gap:** nothing online and academic gives Edwards Plateau natives at county grain. Turner's book is the honest answer.

---

## Summary table

| Region | Source | Grain | Native flag | Obtain | Verdict |
|---|---|---|---|---|---|
| Mid-Atl | PNHP PA Vascular Plant List | state | Native / Introduced / Uncertain (+*) | JSON, 1 file | **YES** |
| Mid-Atl | Digital Atlas of the Virginia Flora | county | N / I | CSV per county (~135) | **YES** |
| Mid-Atl | New York Flora Atlas | county | Native / Not Native | Excel export | **By hand** |
| Mid-Atl | Knapp & Naczi 2021 (MD) | state | native / introduced | PDF, CC BY-NC | YES (parse) |
| Mid-Atl | Mid-Atlantic Piedmont FQA (id 25) | ecoregion | natives only | JSON | cross-check |
| Mid-Atl | DE FQA (id 23), NJ FQA (id 157) | state | native / non-native | JSON | cross-check |
| N Mich | Michigan Flora Online (U-M) | county | N / A (adventive) | JSON API, 1 call | **YES** |
| N Mich | Michigan FQA 2014 (id 50) | state | native / non-native | JSON | YES (same authors) |
| Chicago | INHS Illinois Plants | county (+confidence) | Native / Not native | POST search, paged | **YES** |
| Chicago | Flora of the Chicago Region FQA (id 80) | 22-county region | native / non-native | JSON | **YES** |
| Chicago | Indiana Plant Atlas (Butler) | county | Status Native… | Export | **By hand** |
| Chicago | Wisconsin State Herbarium xlsx | state | W - Native / Introduced | xlsx | YES (marginal) |
| C Texas | BONAP TDC / NAPA | county (+adjacent) / state | native / exotic / adventive | web query | **By hand** |
| C Texas | Flora of North Central Texas (BRIT) | region | "I" = introduced to US | PDFs | **YES** (extract) |
| C Texas | Turner et al. 2003 Atlas (BRIT) | county | native / naturalized | print | By hand (book) |
| C Texas | TORCH / SERNEC Symbiota | county (specimens) | none | checklist download | By hand, presence only |
