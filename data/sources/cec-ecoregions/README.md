# CEC North American Terrestrial Ecoregions

**Status: answered — yes.** A point in Canada can be resolved to an ecoregion by
a live point query, the service allows CORS, and the data is CC BY 4.0. This was
the gate on both Canadian regions and it is open.

- Service: `https://services7.arcgis.com/oF9CDB4lUYF7Um9q/arcgis/rest/services/NA_Terrestrial_Ecoregions_Level_3/FeatureServer`
  — layer **3**, `NA_Terrestrial_Ecoregions_v2_level3`
- Publisher: Commission for Environmental Cooperation (CEC), on their own
  `CECAtlas` ArcGIS Online account
- Licence: **CC BY 4.0**, stated on the item. Required attribution, verbatim from
  the layer's `copyrightText`:

  > Commission for Environmental Cooperation (CEC). 2021. "North American
  > Environmental Atlas — Ecological Regions, Level III". Agriculture and
  > Agri-Food Canada, U.S. Environmental Protection Agency (EPA), Instituto
  > Nacional de Estadística y Geografía (INEGI). Ed. 2.0, Vector digital data
  > [1:10,000,000].

- Refresh / re-verify: `cd app && npm run probe:cec` → `probe.json`

## Why this URL and not the CEC's own server

**`gis.cec.org` returns 403.** Both service roots under it were tried with the
host allowlisted, and both refused — this is the service's own answer, not a
network policy. The probe's ArcGIS Online discovery step is what found the
working copy, and the copy it found is published by the CEC themselves, so
nothing is lost by going through it.

That is worth remembering the next time a plan names `gis.cec.org`: the atlas is
on ArcGIS Online, and the agency's own GIS host is not serving it.

## What the probe measured

| Place | Level III | Name |
|---|---|---|
| Victoria, BC | **7.1.7** | Strait of Georgia/Puget Lowland |
| **Seattle, WA** | **7.1.7** | *the same unit* |
| Squamish, BC | 7.1.6 | Pacific and Nass Ranges |
| Montréal · Québec City · Trois-Rivières | **8.1.1** | Eastern Great Lakes and Hudson Lowlands |
| Sherbrooke · Rimouski | 5.3.1 | Northern Appalachians and Atlantic Maritime Highlands |
| Portland, ME | 8.1.7 | — |

**Victoria and Seattle are the same ecoregion**, which is the claim
`docs/region-queue.md` made from the flora and could not then check. The source
agrees, and has named the unit after both sides of the border.

Squamish coming back 7.1.6 matters just as much in the other direction: the code
discriminates *inside* a coastal British Columbia box, which is the whole reason
to want it rather than the box alone.

## Three things to design around

**1. The codes are not EPA's.** Level III here is `7.1.7` — Level 1, Level 2 and
Level 3 nested — where `US_L3CODE` is a bare `1`–`84`. A Canadian region needs a
**third `EcoregionProvider` with its own code space**, not new codes in the EPA
one. The layer carries `LEVEL1`, `LEVEL2` and `LEVEL3` separately, so a region
can gate at whichever depth it means.

**2. Coastline points can miss.** Vancouver's downtown peninsula and Halifax
harbour both return no polygon at 1:10,000,000; Kitsilano, Burnaby, Richmond and
Surrey all resolve. `docs/ecoregion-plan.md` anticipated this ("coastline / water
points may intersect no polygon → fall back to box"), and `regionForSite`
already falls through to the coverage box when the lookup is null, so a downtown
Vancouver reader gets the box answer — which for a BC region is the right one
anyway. Nothing to fix; worth not being surprised by.

**3. It speaks French.** Every name field comes in three languages —
`NameL3_En`, `NameL3_Es`, `NameL3_Fr`. A Québec page can show *"Basses terres de
l'est des Grands Lacs et du Saint-Laurent"* from the service itself rather than
from a hand-written translation. Neither the EPA nor the EEA lookup offers that.

## CORS

`access-control-allow-origin: *`, confirmed against an `Origin: https://indigene.app`
request. The app can call this client-side like the EPA and EEA lookups, with no
need for the Hanami proxy that `server/app/site_fetcher.rb` provides as a
fallback.
