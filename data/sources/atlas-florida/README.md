# Atlas of Florida Plants (USF Water Institute / Institute for Systematic Botany)

**Upstream:** <https://florida.plantatlas.usf.edu/>
**Retrieve:** by a person, in a browser. See below.
**Read by:** `cd app && npm run atlas`: checks every Florida row is native
here, and with `-- --candidates <region>` lists natives to add, joined with
the FNPS harvest and checked against Kew (`--no-kew` skips it). The academic corroboration for a Florida native-status
claim, next to FNPS and Kew.

## Why a person, not a script

The Atlas is the best native-status source for Florida: each taxon is called
native or not, county by county, from herbarium vouchers. Its `robots.txt`
shuts out ClaudeBot and the other AI agents by name, and keeps every script off
`/plant/results?*` and exports. So nothing here fetches it. A person runs the
search on the site and exports the table.

## What is committed

`<region>.csv` — one row per taxon recorded in the region's counties, native and
not, facts only:
name and authors, common name, family, native, endemic, state and federal
listing, wetland status (DEP, NWI), FLEPPC categories, and whether a specimen
backs it. `plant_id` is the Atlas's own id, kept for joining two exports, not
for linking.

**Linking to the Atlas** follows its own
[How to link](https://florida.plantatlas.usf.edu/howtolink) page: search by
name, never by id, so a link survives the Atlas renumbering.

| To link | URL |
|---|---|
| a species | `https://florida.plantatlas.usf.edu/plant/results?KeywordSearch=Acer+rubrum&KeywordCategory=Sci_Name` |
| a family | `https://florida.plantatlas.usf.edu/plant/results?KeywordCategory=family&KeywordSearch=Orchidaceae` |
| a genus | `https://florida.plantatlas.usf.edu/plant/results?KeywordCategory=genus&KeywordSearch=Myosotis` |
| a synonym | `https://florida.plantatlas.usf.edu/plant/results?KeywordCategory=sci_name&KeywordSearch=Apassalus+humistratus&SortBy=Synonym` |

The Atlas's own "Plant Notes" prose is left out, and the export itself stays
in the git-ignored `raw/`.

| File | Retrieved | Taxa | Native | Not native |
|---|---|---|---|---|
| `florida-central.csv` | 2026-10-17 | 4,283 | 3,010 | 1,269 |
| `florida-south.csv` | 2026-10-17 | 2,750 | 1,759 | 989 |

Non-natives are kept on purpose: `native: N` is the Atlas saying a plant is
**not** native here, which can overrule another source. A missing row only
means it has no record in those counties. (`native` is blank for 6 taxa.)

## The search

Search by **County**, **include** the region's counties (any of them, not all),
no nativity filter, accepted names, every result on one page. **Include, never
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
https://florida.plantatlas.usf.edu/plant/results?KeywordSearch=&SearchType=any&KeywordCategory=sci_name&IncludeAccepted=true&ResultPageSize=all&IncludeAllCounties=false&ExcludeAllCounties=false&CountiesInclude=Alachua&CountiesInclude=Baker&CountiesInclude=Bay&CountiesInclude=Bradford&CountiesInclude=Brevard&CountiesInclude=Calhoun&CountiesInclude=Citrus&CountiesInclude=Clay&CountiesInclude=Columbia&CountiesInclude=Dixie&CountiesInclude=Duval&CountiesInclude=Escambia&CountiesInclude=Flagler&CountiesInclude=Franklin&CountiesInclude=Gadsden&CountiesInclude=Gilchrist&CountiesInclude=Gulf&CountiesInclude=Hamilton&CountiesInclude=Hardee&CountiesInclude=Hernando&CountiesInclude=Highlands&CountiesInclude=Hillsborough&CountiesInclude=Holmes&CountiesInclude=Indian+River&CountiesInclude=Jackson&CountiesInclude=Jefferson&CountiesInclude=Lafayette&CountiesInclude=Lake&CountiesInclude=Leon&CountiesInclude=Levy&CountiesInclude=Liberty&CountiesInclude=Madison&CountiesInclude=Manatee&CountiesInclude=Marion&CountiesInclude=Nassau&CountiesInclude=Okaloosa&CountiesInclude=Okeechobee&CountiesInclude=Orange&CountiesInclude=Osceola&CountiesInclude=Pasco&CountiesInclude=Pinellas&CountiesInclude=Polk&CountiesInclude=Putnam&CountiesInclude=Santa+Rosa&CountiesInclude=Sarasota&CountiesInclude=Seminole&CountiesInclude=St.+Johns&CountiesInclude=St.+Lucie&CountiesInclude=Sumter&CountiesInclude=Suwannee&CountiesInclude=Taylor&CountiesInclude=Union&CountiesInclude=Volusia&CountiesInclude=Wakulla&CountiesInclude=Walton&CountiesInclude=Washington&IncludeSynonyms=false&IncludeExcluded=false
```

Query URL for `florida-south.csv`:

```
https://florida.plantatlas.usf.edu/plant/results?KeywordSearch=&SearchType=any&KeywordCategory=sci_name&IncludeAccepted=true&ResultPageSize=all&IncludeAllCounties=false&ExcludeAllCounties=false&CountiesInclude=Broward&CountiesInclude=Charlotte&CountiesInclude=Collier&CountiesInclude=DeSoto&CountiesInclude=Glades&CountiesInclude=Hendry&CountiesInclude=Lee&CountiesInclude=Martin&CountiesInclude=Miami-Dade&CountiesInclude=Monroe+Keys&CountiesInclude=Monroe+Mainland&CountiesInclude=Palm+Beach&IncludeSynonyms=false&IncludeExcluded=false
```

## What it says about our rows (2026-10-17)

Every Florida row we ship is on both lists, some at variety or subspecies
rank, and all but one are native. **_Salvia coccinea_ (tropical sage) is
`native: N` in both regions**, and its species page says "Not Native"
(Chapman, 1897, thought it escaped from cultivation). Kew calls it native in
Florida, so the two disagree. Our rule is that the Atlas must agree, so it
can't stay on either list.

## References

The Atlas lists the literature behind its calls on its
[References](https://florida.plantatlas.usf.edu/references) page, about 1,200
works. We link that page rather than copy it. The ones our rows lean on:

- Wunderlin, R.P. & B.F. Hansen. 2011. *Guide to the Vascular Plants of
  Florida*, 3rd ed. University Press of Florida. The flora behind the Atlas's
  native status.
- Wunderlin, R.P. & B.F. Hansen. 2000–2016. *Flora of Florida*, Vols. I–III.
  University Press of Florida.
- Chapman, A.W. 1897. *Flora of the Southern United States*, 3rd ed. Cited by
  the Atlas for *Salvia coccinea* as escaped from cultivation.

## Terms

Individual distribution facts are not copyrightable. The CSV keeps those and
nothing the Atlas wrote.
