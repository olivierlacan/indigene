# Plan: real EPA ecoregions (Phase 2)

**Status:** Phase A (real ecoregion *labels*) and Phase B (ecoregion-refined
region *selection*) are **implemented**, including the Florida split. `fetchEcoregion`
in `app/src/lib/site.ts` (mirrored in `server/app/site_fetcher.rb`) queries the
live EPA service; the confirm screen shows the real Level III/IV names; and
`regionForSite` refines the bounding-box match by the spot's Level III code. PNW,
north/central Florida and south Florida declare their ecoregions; Florida is now
two regions split along the Southern Florida Coastal Plain (76) seam. Everything
falls back to the box offline. **Deliberately deferred:** Level III codes for the
Mid-Atlantic (its box works and has no edge bug) and Phase C offline polygons
(they fight the tiny-bundle, service-worker-based offline model). Details below. This replaces the coarse lat/lon bounding boxes
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

### 2. Make region selection ecoregion-based (the real win) — implemented
Add an `ecoregionsL3` field to `RegionMeta` listing the EPA Level III codes each
seed list represents, and upgrade `regionForSite(lat, lon, site?)` to refine the
box match by that code.

**Implemented rule — box *then* code, not code alone.** The original sketch here
matched on code first and returned "no list" for any known-but-uncovered code.
That breaks down because several L3 ecoregions span multiple regions' turf — e.g.
75 (Southern Coastal Plain) covers peninsular Florida *and* coastal Georgia/the
Carolinas — so a bare code match would let Florida's frost-tender list claim a
Savannah spot. The shipped rule keeps the box as the gate and uses the code only
to *refine within it*:

```ts
export function regionForSite(lat, lon, site?): RegionDef | null {
  const boxed = regionForCoords(lat, lon);        // boxes never overlap → ≤1 candidate
  if (!boxed) return null;
  const codes = boxed.meta.ecoregionsL3;
  const l3 = site?.ecoregionInfo?.l3Code ?? null;
  if (l3 && codes && codes.length) {
    return codes.includes(l3) ? boxed : null;     // in box, wrong ecoregion → no list
  }
  return boxed;                                    // offline / region has no codes → box decides
}
```

This still delivers the target fix (a point in the PNW box but ecoregion 9,
east of the crest, falls through to "no list") without the cross-region bleed.
`renderResults` already has `store.draft.site` by the time it runs (the site
fetch is kicked off at location-confirm), so it passes it straight in; with no
resolved site the box decides, so nothing regresses offline.

Declared code sets: **PNW** = 1/2/3/4/78 (excludes 9, the eastern Cascades);
**north/central Florida** = 65/75; **south Florida & the Keys** = 75/76.
**Mid-Atlantic** is intentionally left box-only — its box has no known edge bug,
and enumerating its ~dozen Appalachian/Piedmont/coastal L3 codes correctly is its
own task with real regression risk (a missed code would send valid points to "no
list"); omitting the field means the box decides, exactly as before.

**The Florida split (done).** Florida is two regions divided at a ~27.2° N seam
(roughly Lake Okeechobee, the base of the subtropical zone) with abutting,
non-overlapping boxes: `florida` (north/central, codes 65/75) and `florida-south`
(south & Keys, codes 75/76, its own subtropical seed list — gumbo limbo, seagrape,
cocoplum, coontie/Atala host, corkystem passionvine, etc.). Both claim 75, so the
peninsula's Southern Coastal Plain is partitioned north/south by the box seam,
while 76 (Southern Florida Coastal Plain) is unique to the south list and 65 to
the north. Online the ecoregion decides; offline the lat seam is the coarse
fallback, matching the conventional "South Florida" line.

Shipped L3 code sets (in the region data files):
- **PNW west-side** (`pnw`): Coast Range (1), Puget Lowland (2), Willamette
  Valley (3), Cascades (4), Klamath Mountains (78) — *excludes* Eastern Cascades
  Slopes & Foothills (9), so Bend correctly stops resolving to PNW.
- **North/central Florida** (`florida`): Southeastern Plains (65), Southern
  Coastal Plain (75).
- **South Florida & the Keys** (`florida-south`): Southern Coastal Plain (75),
  Southern Florida Coastal Plain (76).
- **Mid-Atlantic** (`mid-atlantic`): none declared — box-only (see above). The
  reference set if it's ever added: Piedmont (45), Northern Piedmont (64), Blue
  Ridge (66), Ridge and Valley (67), Central Appalachians (69), North Central
  Appalachians (62), Northeastern Highlands (58), Northeastern Coastal Zone (59),
  Middle Atlantic Coastal Plain (63), Atlantic Coastal Pine Barrens (84), plus
  the Allegheny Plateau/Great Lakes fringes — verify against the atlas before use.

### 3. Fully-offline accurate selection — deferred by decision
The live query is online-only. Ecoregion-accurate selection with no signal would
mean bundling a **simplified TopoJSON of the L3 polygons overlapping covered
regions** and doing point-in-polygon on-device. Even scoped and simplified that
adds hundreds of KB, against the ~96 KB-gzipped, service-worker-based offline
model, and the box fallback already gives correct-enough offline selection. So
this is **deferred as a deliberate decision**, not pending work — revisit only on
a concrete need. The shipped product is §1 (labels) + §2 (selection).

## Phasing
- **A — display only:** ✅ **done.** `fetchEcoregion` + richer `SiteData`
  (`ecoregionInfo`), real L3/L4 names on confirm, box fallback retained. Pure
  parser (`parseEcoregion`) is unit-tested; the live HTTP path could not be
  exercised from the build sandbox (outbound to `gispub.epa.gov` is blocked
  there) and should be smoke-tested in a real browser.
- **B — selection:** ✅ **done.** `ecoregionsL3` on regions; `regionForSite`
  refines the box match by L3 code (box gate + code refine), box fallback
  retained offline. PNW and both Florida regions declare codes; the Florida
  split ships. Selection logic is unit-tested (online refine, offline fallback,
  cross-region bleed, the Bend/east-of-Cascades fix, the FL north/south seam).
- **C — offline polygons:** ⛔ **deferred by decision, not a to-do.** Bundling
  even simplified L3 polygons adds hundreds of KB, against the ~96 KB-gzipped,
  service-worker-based offline model. The box fallback already gives correct-
  enough offline selection. Revisit only if a concrete need appears; if so, scope
  it to just the covered regions' polygons, not all 84.
- **Follow-up (optional):** Mid-Atlantic L3 codes — only worth doing with the
  full, verified code list, since the box already works there.

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
