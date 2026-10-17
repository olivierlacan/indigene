# Atlas of Florida Plants (USF Water Institute / Institute for Systematic Botany)

**Upstream:** <https://florida.plantatlas.usf.edu/>
**Retrieve:** by a person, in a browser. See below.
**Consumed by:** nothing in the app yet. The Florida native-status source
next to Kew.

## Why a person, not a script

The Atlas is the best native-status source for Florida: each taxon is called
native, not native or endemic, county by county, from herbarium vouchers. Its
`robots.txt` shuts out ClaudeBot and the other AI agents by name, and keeps
every script off `/plant/results?*` and exports. So nothing here fetches it.
A person runs the county search on the site and saves the results table as a
PDF into `raw/` (git-ignored). Only our own rows' verdicts get committed.

## The search

On the [plant search](https://florida.plantatlas.usf.edu/plant/search), search
by **County** and include these counties.

**North & Central Florida** — the 56 counties whose centre lies north of
27.2° N, the line the region's box draws (centroids: Census 2023 Gazetteer):

Alachua, Baker, Bay, Bradford, Brevard, Calhoun, Citrus, Clay, Columbia, Dixie,
Duval, Escambia, Flagler, Franklin, Gadsden, Gilchrist, Gulf, Hamilton, Hardee,
Hernando, Highlands, Hillsborough, Holmes, Indian River, Jackson, Jefferson,
Lafayette, Lake, Leon, Levy, Liberty, Madison, Manatee, Marion, Nassau,
Okaloosa, Okeechobee, Orange, Osceola, Pasco, Pinellas, Polk, Putnam,
Santa Rosa, Sarasota, Seminole, St. Johns, St. Lucie, Sumter, Suwannee, Taylor,
Union, Volusia, Wakulla, Walton, Washington

Six straddle the line: Sarasota, Highlands, Okeechobee and St. Lucie (centre
just north, included) and DeSoto and Martin (just south, left to South
Florida).

Save as `raw/florida-central.pdf`, with the date you ran it in the commit.
