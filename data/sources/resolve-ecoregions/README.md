# RESOLVE Ecoregions 2017

**Status: integrated.** The ecoregion lookup for every point south of the
equator, where neither the EPA nor the EEA answers. Auckland & Northland
selects on it (ECO_ID 173).

- Dataset: Dinerstein et al. 2017, "An Ecoregion-Based Approach to Protecting
  Half the Terrestrial Realm", *BioScience* 67(6). <https://ecoregions.appspot.com/>
- Licence: **CC BY 4.0**. Attribution: "RESOLVE Ecoregions 2017 (CC BY 4.0)".
- Live service (the app, one point at a time): Esri's hosted copy,
  `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Resolve_Ecoregions/FeatureServer/0`
- Shapes (the build): the publisher's own shapefile,
  `https://storage.googleapis.com/teow2016/Ecoregions2017.zip` (149 MB)

## What's in this folder

| File | Committed? | What it is | Made by |
|---|---|---|---|
| `probe.json` | yes | The live layer's answer for twelve southern cities, its fields, and its CORS header | `cd app && npm run probe:resolve` |
| `index.json` | yes | One line per ecoregion: `id`, `name`, `biome`, `realm`, `bbox` (139 KB) | `npm run resolve:fetch` |
| `Ecoregions2017.zip` | no | The raw download, kept so a re-run doesn't fetch it again | `npm run resolve:fetch` |
| `ecoregions-2017.geojson` | no | All 847 shapes, simplified to ~500 m, coordinates to 4 decimals (27 MB; 8.5 MB gzipped) | `npm run resolve:fetch` |

`resolve:fetch` takes about 20 seconds after the download. It needs no
dependencies: it reads the zip with Node's zlib and parses the shapefile and
its attribute table by hand. `--tolerance 0.01` makes a coarser, smaller file.

The GeoJSON is git-ignored because it can be rebuilt from a pinned public URL in
seconds, and 27 MB of coordinates in the history would outweigh the rest of the
repo. `index.json` is what a reviewer needs: the ECO_ID a region file cites,
spelled out.

## Using it

- **Which ecoregion is a place in?** `scripts/_resolve.mjs` → `ecoregionAt(lat, lon)`.
  On the probe's twelve cities it agrees with the live service on all twelve. It
  can miss a point right on the shore, where simplification moved the coast
  inland (Cape Reinga, Thames); ask the live layer for those.
- **Draw a region:** `maps:build` reads the shapes of a `resolve-2017` region's
  codes from here, so a map build doesn't wait on a remote service.

## What it answered (2026-09-24)

| City | ECO_ID | Ecoregion |
|---|---|---|
| Sydney, Blue Mountains, Wollongong | 168 | Eastern Australian temperate forests |
| Auckland, Whangārei, Hamilton | 173 | Northland temperate kauri forests |
| Cape Town, Stellenbosch | 90 | Renosterveld shrubland |
| Port Elizabeth | 89 | Fynbos shrubland |
| Buenos Aires, La Plata | 576 | Humid Pampas |
| Montevideo | 574 | Uruguayan savanna |

It is coarser than the national schemes. Sydney's ecoregion runs far up and
down the coast, and Hamilton shares Auckland's. As with the EEA, the region's
**box** does the fine work, and the code keeps a list from spilling into the
next ecoregion over.
