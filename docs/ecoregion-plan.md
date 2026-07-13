# Plan: real EPA ecoregions (Phase 2)

**Status:** planned, not built. This replaces the coarse lat/lon bounding boxes
that currently (a) label a spot's ecoregion on the confirm screen and (b) decide
which region's plant list applies. Boxes are honest but blunt: a point just east
of the Cascade crest still resolves to the Pacific Northwest west-side list, and
the Florida list can't tell the temperate panhandle from the subtropical
peninsula. Real ecoregions fix both by making region membership *ecological*
rather than rectangular.

## What EPA offers

- **Dataset:** Omernik Level III (84 ecoregions, CONUS) and Level IV (967)
  ecoregions. **US Government public domain** — safe to query, cache, or bundle.
- **Live service (ArcGIS REST):**
  `https://gispub.epa.gov/arcgis/rest/services/ORD/USEPA_Ecoregions_Level_III_and_IV/MapServer`
  - Layer **11** = Level III polygons, Layer **7** = Level IV polygons.
  - Point-in-polygon via a layer `query` (cleaner than `identify`, which needs a
    map extent):
    ```
    …/MapServer/11/query
      ?geometry=<lon>,<lat>&geometryType=esriGeometryPoint&inSR=4326
      &spatialRel=esriSpatialRelIntersects
      &outFields=US_L3CODE,US_L3NAME,NA_L2NAME,NA_L1NAME
      &returnGeometry=false&f=json
    ```
  - Confirm the exact field names against the live layer at build time
    (expected: `US_L3CODE`, `US_L3NAME`, `US_L4CODE`, `US_L4NAME`, plus the North
    America roll-ups `NA_L1NAME`, `NA_L2NAME`).
- **Bulk data:** per-state and per-region shapefiles from
  epa.gov/eco-research (for the offline option below).

**Coverage caveat:** this service is the **conterminous US only**. Alaska,
Hawaii, and territories have separate EPA products, and going global would need
the CEC North America ecoregions or RESOLVE/WWF ecoregions (CC BY) — see
`DATA_SOURCES.md`. Handle CONUS first; treat non-CONUS as "no ecoregion, fall
back to box."

## Design

### 1. Fetch real ecoregion data (best-effort, like elevation)
Replace `ecoregionGuess()` in `app/src/lib/site.ts` (and the mirror in
`server/app/site_fetcher.rb`) with `fetchEcoregion(lat, lon)` that queries the
service and returns structured data, keeping the bounding-box guess as the
offline/failure fallback so nothing regresses when there's no signal.

```ts
interface Ecoregion {
  l3Code: string;      // "3"  (Willamette Valley)
  l3Name: string;      // "Willamette Valley"
  l2Name: string | null;
  l1Name: string | null;
  l4Code?: string; l4Name?: string; // Level IV, for display only
  source: "epa-live" | "box-fallback";
}
```

Widen `SiteData.ecoregion` from `string | null` to `Ecoregion | null` (or add a
parallel field and keep the string label derived for display). The confirm
screen then shows the real name — "Willamette Valley (EPA Level III)" — instead
of the current "(broad)" label.

- **CORS risk:** ArcGIS 10.x enables CORS by default and gispub generally allows
  it, but this is unverified. Mitigate exactly as the app already does for keys
  and flaky CORS: route the call through the **existing Hanami server proxy**
  (`server/app/site_fetcher.rb` → `site/show`), with an optional direct
  client-side attempt first. Treat it as best-effort (the EPQS elevation call is
  already documented as "CORS can be flaky").
- **Cache** the result with the saved spot so an offline reopen keeps the label.

### 2. Make region selection ecoregion-based (the real win)
Add an `ecoregions` field to `RegionMeta` listing the EPA Level III codes each
seed list actually represents, and upgrade `regionForSite` to prefer a code
match, falling back to the bounding box when ecoregion data is absent (offline,
non-CONUS, or a coastline point that hits no polygon):

```ts
interface RegionMeta {
  …
  bounds: RegionBounds;      // kept as the offline fallback
  ecoregionsL3?: string[];   // e.g. PNW west-side: ["1","2","3"] (+ parts of 78)
}

function regionForSite(lat, lon, site?): RegionDef | null {
  const code = site?.ecoregion?.l3Code;
  if (code) {
    const byEco = REGIONS.find(r => r.meta.ecoregionsL3?.includes(code));
    if (byEco) return byEco;          // ecologically real match
    return null;                       // known ecoregion, not one we cover → honest "no list"
  }
  return regionForCoords(lat, lon);    // no ecoregion data → box fallback
}
```

`renderResults` already has `store.draft.site` by the time it runs (the site
fetch is kicked off at location-confirm), so this stays synchronous in the happy
path; if the site promise hasn't resolved, await it or fall back to the box.

Draft L3 code sets to fill in at build time (verify against the atlas):
- **PNW west-side:** Coast Range (1), Puget Lowland (2), Willamette Valley (3),
  and the west slope of the Cascades (part of 4/78) — *excludes* Eastern
  Cascades Slopes & Foothills (9), which is why Bend would correctly stop
  resolving to PNW.
- **Mid-Atlantic / Piedmont:** Piedmont (45), Northern Piedmont (64), Blue Ridge
  (66), Ridge and Valley (67), Northeastern Coastal Zone (59), Middle Atlantic
  Coastal Plain (63), Atlantic Coastal Pine Barrens (84), Northeastern Highlands
  (58).
- **Florida:** Southern Coastal Plain (75) and Southern Florida Coastal Plain
  (76). This is also the natural seam to later **split Florida** into a temperate
  panhandle list and a subtropical south-Florida list — the current single list's
  honesty caveat becomes a clean ecoregion boundary.

### 3. (Optional, later) Fully-offline accurate selection
The live query is online-only. If we want ecoregion-accurate selection with no
signal, bundle a **simplified TopoJSON of only the L3 polygons overlapping
covered regions** (not all 84) and do point-in-polygon on-device. Scoped and
simplified, this can stay small, but it still fights the ~35 KB bundle ethos, so
it's an enhancement to weigh per-region, not a default. First cut ships §1+§2
(live + box fallback).

## Phasing
- **A — display only:** `fetchEcoregion` + richer `SiteData`, show the real L3/L4
  name on confirm. No selection change. Low risk, immediately useful.
- **B — selection:** add `ecoregionsL3` to regions, upgrade `regionForSite`, box
  fallback retained. Fixes the east-of-Cascades and panhandle edge cases.
- **C — optional offline:** bundled simplified polygons for covered regions.

## Testing
- Known-point → expected L3: Portland→Willamette Valley (3), Seattle→Puget
  Lowland (2), Bend→Eastern Cascades (9, uncovered), Philadelphia→Northern
  Piedmont (64), Orlando→Southern Coastal Plain (75), Miami→Southern Florida
  Coastal Plain (76).
- Unit-test the L3-code→region mapping with a **mocked** ArcGIS response so CI
  stays offline and deterministic.
- Assert the box fallback still selects correctly when `site.ecoregion` is null.

## Risks / notes
- Field names and layer IDs must be confirmed against the live service.
- Input SR is WGS84 (4326); pass `inSR=4326` explicitly.
- Use **Level III** for selection; Level IV is too fine (EPA says don't use L4
  below multi-county scale) — keep L4 for display only.
- Coastline / water points may intersect no polygon → fall back to box or nearest.
- Attribution: EPA ecoregions are public domain; still credit "EPA / Omernik
  ecoregions" in the in-app data credits and `DATA_SOURCES.md`.
```
