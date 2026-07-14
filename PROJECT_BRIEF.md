# Indigene — Project Brief & Decisions

> A mobile-first PWA: stand in a spot, and get native plants that will actually
> thrive there — ranked by ecosystem value, with honest mature-size-over-time.

This is the living brief. The vision is unchanged from the original kickoff; the
sections below record the decisions made and the Phase 1 status, and answer the
open questions the brief raised.

## The product in one sentence

Stand in a spot → the app measures sun exposure with the camera and compass,
pulls soil and climate data from your GPS coordinates, and returns local native
plants ranked by ecosystem services, each showing how big it will actually get
in 1, 3, 5, and 10 years.

## Who it's for (drives every decision)

Beginner gardeners, guerrilla gardeners (one shot, no aftercare, need plain
warnings), and older gardeners new to natives (met with "here's what it does for
you," never ideology). Plain language always; accessibility first-class;
one-handed, outdoors, dirty hands, bad connection; radically honest about
uncertainty; no gamification.

---

## Decisions made

| Question from the brief | Decision | Why |
|---|---|---|
| **Framework** | **None.** Vanilla TS + DOM + real web APIs, bundled by Vite. Zero runtime deps. | Per direction ("Do not use React… respect the DOM"). Keeps the bundle ~29 KB gzipped and the code legible. |
| **Sky scan tech** | `getUserMedia` + `DeviceOrientationEvent` on a `<canvas>` overlay — **not** WebXR. | WebXR doesn't work in iOS Safari. |
| **Sun math** | Local NOAA solar-position implementation (no API), integrated against the horizon mask. | Works fully offline; no dependency. |
| **License** | **MIT.** | A civic tool on public data should maximize reuse; AGPL's network-copyleft would deter the land trusts / extension offices / other apps we want integrating. |
| **Seed region** | **Mid-Atlantic / Northeast Piedmont** (Pennsylvania reference, zones 6b–7a). | Richest, best-checked open data — Tallamy/NWF host counts and the Wildflower Center records are centered here. |
| **Backend** | **Hanami 2.3** (newest), thin API. Phase 1: a server-side site-data proxy (CORS/keys). DB deferred. | The offline PWA needs no backend to work; the backend earns its place only where the browser can't (CORS, keys) and later for sync + a national catalog. |
| **"Point at the dirt to read soil"** | **Not built, on purpose.** | The camera cannot read soil texture. Users are routed to the 60-second ribbon test instead. |
| **Basemap** | Schematic metric grid, no external tiles (Phase 1). | Stays offline-first and sidesteps tile-usage terms. |

## Honesty stances (implemented)

- **Soil is coarse.** Always shown as "the soil map says X — here's a 60-second
  check to see if that's true where you're standing." Never measured fact.
- **Sun has error bars.** Shown as a range (`low`–`high`), not a false-precision
  decimal, derived from ±5° of scan/sensor uncertainty.
- **Deciduous trees change seasonally.** The app asks whether the canopy overhead
  drops its leaves and relaxes the horizon mask in the shoulder months.
- **Every plant shows its confidence and its basis.** The Lepidoptera host score
  is derived transparently from a raw, citable species count.
- **Sensors lie.** The manual sun picker is the primary path and is fully
  sufficient; the scan degrades to it whenever camera or compass is denied.

## Ranking (the heart)

Transparent and re-weightable. Final position = **eco-score × site-fit**:

- **Eco-score** = weighted blend of seven components stored separately and never
  hidden: caterpillar/moth host value (strongest food-web proxy; keystone
  species flagged), pollinator support, bird value, stormwater/infiltration,
  erosion/slope stability, carbon/biomass (honestly small), establishment
  resilience (survives with no water).
- **Site-fit** = how well the plant's sun/moisture/pH/hardiness needs match this
  exact spot. A great plant in the wrong place ranks low, and the card says why.
- **Filters** (not score components): deer resistance, thorniness, pet toxicity,
  aggressiveness, and a guerrilla "survives with zero watering" toggle.

## Phase 1 status — built & verified end-to-end

- [x] Geolocation → soil/climate/zone fetch → confirm screen
- [x] Sky-scan sun measurement, **with the manual fallback working first**
- [x] Region-aware plant catalog: the app selects the seed list from the spot's
      coordinates and says plainly when it has no list for an area yet
- [x] Four regional seed datasets with real size-over-time and ecosystem-service
      numbers — 40-plant Mid-Atlantic, 24-plant Pacific Northwest (west-of-Cascades),
      23-plant north/central Florida, and 21-plant south Florida & the Keys — for
      on-the-ground testing
- [x] Ranked results with the to-scale size visualization (human silhouette)
- [x] Re-weightable ranking sliders + presets
- [x] Offline + installable (hand-written service worker, web manifest, icons)
- [x] Saved spots in IndexedDB (local-first, no account)
- [x] Hanami site-data proxy API (optional; PWA works without it)

Explicitly **not** in Phase 1: accounts, sync, national catalog, plant ID from
photos, nurseries/e-commerce, bed-layout designer.

## Open questions / Phase 2

- **Canonical catalog backbone** for scaling past hand-authored lists: adopt
  Kew's **WCVP/POWO** (CC BY 4.0) as the global name + native-range spine,
  reconcile ids through the **GBIF backbone**, and key U.S. plants on the
  **USDA PLANTS** symbol (public domain). Full rationale and the source table are
  in `DATA_SOURCES.md` → "Scaling the catalog."
- **County-level native status** via USDA PLANTS (public domain) — *not* BONAP,
  whose maps have restrictive terms (see `DATA_SOURCES.md`).
- **Real EPA ecoregion** lookup (public domain) — *Phases A & B shipped*: the
  confirm screen shows real Omernik Level III/IV names, and region selection is
  refined by the spot's Level III ecoregion — so a spot east of the Cascade crest
  no longer gets the west-side list, and Florida splits along the Southern Florida
  Coastal Plain (76) seam into a temperate north/central list and a subtropical
  south/Keys list. Box fallback offline. Deliberately deferred: Mid-Atlantic
  ecoregion codes (box works; no edge bug) and bundled offline polygons (would
  fight the tiny-bundle ethos). See [`docs/ecoregion-plan.md`](docs/ecoregion-plan.md).
- **Real plant photos** (cards currently draw a form-based silhouette).
- **Host-count provenance**: re-source Lepidoptera counts from the primary
  literature if NWF asserts data terms (flagged, not assumed safe).
- **Database**: saved-spot sync + a national catalog, behind the Hanami app.

See `app/README.md`, `server/README.md`, and `DATA_SOURCES.md` for detail.
