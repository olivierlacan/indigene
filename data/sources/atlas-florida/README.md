# Atlas of Florida Plants (USF Water Institute / Institute for Systematic Botany)

**Upstream:** <https://florida.plantatlas.usf.edu/>
**Retrieve:** by a person, in a browser. See below.
**Consumed by:** nothing in the app yet. The academic corroboration for a
Florida native-status claim, next to FNPS and Kew.

## Why a person, not a script

The Atlas is the best native-status source for Florida: each taxon is called
native or not, county by county, from herbarium vouchers. Its `robots.txt`
shuts out ClaudeBot and the other AI agents by name, and keeps every script off
`/plant/results?*` and exports. So nothing here fetches it. A person runs the
search on the site and exports the table.

## What is committed

`<region>.csv` — one row per native taxon the search returned, facts only:
name and authors, common name, family, native, endemic, state and federal
listing, wetland status (DEP, NWI), FLEPPC category, and whether a specimen
backs it. `plant_id` is the Atlas's own id, so
`https://florida.plantatlas.usf.edu/plant/species/<plant_id>` opens the taxon.
The Atlas's own "Plant Notes" prose is left out, and the export itself stays
in the git-ignored `raw/`.

| File | Retrieved | Taxa | Search |
|---|---|---|---|
| `florida-central.csv` | 2026-10-17 | 3,010 | the 56 North & Central counties below, native only |
| `florida-south.csv` | 2026-10-17 | 1,759 | the 11 South Florida counties below, native only |

## The search

Search by **County**, **include** the region's counties (any of them, not all),
Nativity: native, accepted names, every result on one page. **Include, never
exclude:** excluding the South Florida counties drops every plant recorded in
them, which is most of the north's flora too — that search returned 5 of our 39
rows.

**North & Central Florida** — the 56 counties whose centre lies north of
27.2° N, the line the region's box draws (centroids: Census 2023 Gazetteer):

Alachua, Baker, Bay, Bradford, Brevard, Calhoun, Citrus, Clay, Columbia, Dixie,
Duval, Escambia, Flagler, Franklin, Gadsden, Gilchrist, Gulf, Hamilton, Hardee,
Hernando, Highlands, Hillsborough, Holmes, Indian River, Jackson, Jefferson,
Lafayette, Lake, Leon, Levy, Liberty, Madison, Manatee, Marion, Nassau,
Okaloosa, Okeechobee, Orange, Osceola, Pasco, Pinellas, Polk, Putnam,
Santa Rosa, Sarasota, Seminole, St. Johns, St. Lucie, Sumter, Suwannee, Taylor,
Union, Volusia, Wakulla, Walton, Washington

**South Florida** — the other 11: Broward, Charlotte, Collier, DeSoto, Glades,
Hendry, Lee, Martin, Miami-Dade, Monroe (the Atlas splits it into Keys and
Mainland), Palm Beach. DeSoto and Martin straddle the line with their centres
just south of it.

Query URL for `florida-central.csv`:

```
https://florida.plantatlas.usf.edu/plant/results?KeywordSearch=&SearchType=any&KeywordCategory=sci_name&IncludeAccepted=true&ResultPageSize=all&IncludeAllCounties=false&ExcludeAllCounties=false&CountiesInclude=Alachua&CountiesInclude=Baker&CountiesInclude=Bay&CountiesInclude=Bradford&CountiesInclude=Brevard&CountiesInclude=Calhoun&CountiesInclude=Citrus&CountiesInclude=Clay&CountiesInclude=Columbia&CountiesInclude=Dixie&CountiesInclude=Duval&CountiesInclude=Escambia&CountiesInclude=Flagler&CountiesInclude=Franklin&CountiesInclude=Gadsden&CountiesInclude=Gilchrist&CountiesInclude=Gulf&CountiesInclude=Hamilton&CountiesInclude=Hardee&CountiesInclude=Hernando&CountiesInclude=Highlands&CountiesInclude=Hillsborough&CountiesInclude=Holmes&CountiesInclude=Indian+River&CountiesInclude=Jackson&CountiesInclude=Jefferson&CountiesInclude=Lafayette&CountiesInclude=Lake&CountiesInclude=Leon&CountiesInclude=Levy&CountiesInclude=Liberty&CountiesInclude=Madison&CountiesInclude=Manatee&CountiesInclude=Marion&CountiesInclude=Nassau&CountiesInclude=Okaloosa&CountiesInclude=Okeechobee&CountiesInclude=Orange&CountiesInclude=Osceola&CountiesInclude=Pasco&CountiesInclude=Pinellas&CountiesInclude=Polk&CountiesInclude=Putnam&CountiesInclude=Santa+Rosa&CountiesInclude=Sarasota&CountiesInclude=Seminole&CountiesInclude=St.+Johns&CountiesInclude=St.+Lucie&CountiesInclude=Sumter&CountiesInclude=Suwannee&CountiesInclude=Taylor&CountiesInclude=Union&CountiesInclude=Volusia&CountiesInclude=Wakulla&CountiesInclude=Walton&CountiesInclude=Washington&IncludeSynonyms=false&IncludeExcluded=false&StatusOptions=Nativity%7CY
```

Query URL for `florida-south.csv`:

```
https://florida.plantatlas.usf.edu/plant/results?KeywordSearch=&SearchType=any&KeywordCategory=sci_name&IncludeAccepted=true&ResultPageSize=all&IncludeAllCounties=false&ExcludeAllCounties=false&CountiesInclude=Broward&CountiesInclude=Charlotte&CountiesInclude=Collier&CountiesInclude=DeSoto&CountiesInclude=Glades&CountiesInclude=Hendry&CountiesInclude=Lee&CountiesInclude=Martin&CountiesInclude=Miami-Dade&CountiesInclude=Monroe+Keys&CountiesInclude=Monroe+Mainland&CountiesInclude=Palm+Beach&IncludeSynonyms=false&IncludeExcluded=false&StatusOptions=Nativity%7CY
```

## What it says about our rows (2026-10-17)

36 of the 39 North & Central Florida rows are on it. Two more are there at a
finer rank: *Muhlenbergia capillaris* and *Helianthus debilis* appear only as
their varieties and subspecies. **_Salvia coccinea_ (tropical sage) is not on
it** — a question for a person: the Atlas may not call it native, or may file
it under another name.

South Florida: 20 of 21 rows are on it, two of them at a finer rank. The one
missing is again **_Salvia coccinea_**, which both lists carry.

## Terms

Individual distribution facts are not copyrightable. The CSV keeps those and
nothing the Atlas wrote.
