# RESOLVE Ecoregions 2017

**Status: wired, unconfirmed.** The ecoregion lookup for every point south of
the equator — where neither the EPA nor the EEA answers. No shipped region
declares it yet, so nothing selects on it today.

- Dataset: Dinerstein et al. 2017, "An Ecoregion-Based Approach to Protecting
  Half the Terrestrial Realm", *BioScience* 67(6). <https://ecoregions.appspot.com/>
- Service: Esri's hosted copy,
  `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Resolve_Ecoregions/FeatureServer/0`
- Licence: **CC BY 4.0**. Attribution: "RESOLVE Ecoregions 2017 (CC BY 4.0)".
- Refresh: `cd app && npm run probe:resolve` → `probe.json`

## What it is admitted for

**One claim: which ecoregion is this point in?** — the same job EPA Level III
does in the US and the EEA regions do in Europe. It is one flat level of 846
ecoregions; `code` is the numeric `ECO_ID`, and biome and realm are shown as
the roll-up above it.

It is coarser than either national scheme. Sydney's ecoregion runs from the
Hunter to Gippsland; the Cape's lowland fynbos is one polygon. So, as with the
EEA, the region's **box** does the fine work and the code keeps a list from
bleeding into the next ecoregion over.

## What is not yet known

The build sandbox's egress refuses `services.arcgis.com` (HTTP 403 from the
proxy, 2026-09-24), so four things are the published dataset's, not measured:

| Question | Assumed | Where it matters |
|---|---|---|
| Layer id | `0` | `site.ts`, `build-region-maps.mjs` |
| Field names | `ECO_ID`, `ECO_NAME`, `BIOME_NAME`, `REALM` (read case-insensitively) | `parseEcoregionResolve` |
| Browser access | CORS allowed, as on Esri's other hosted layers | whether the app can call it at all |
| Each city's `ECO_ID` | — | the first regions' `ecoregion.codes` |

`probe.json` in this folder is the unblocked run's answer. If CORS fails, the
fallback is the one `docs/region-queue.md` describes for Canada: bundle
simplified polygons for the southern boxes and test the point on-device.
