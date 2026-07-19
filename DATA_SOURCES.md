# Data sources & licensing

The brief asked, explicitly, to check the licence on every upstream source
before depending on it and to say plainly what was found. Here is that audit as
of the Phase 1 build. **None of these are scraped**; each is a documented public
API or an openly licensed dataset. Where reuse terms are uncertain, that is
called out and the dependency is kept optional.

| Source | Used for | Access | Licence / terms | Verdict |
|---|---|---|---|---|
| **NOAA solar position algorithm** | Sun path & sun-hours, computed on-device | Reimplemented locally (`src/lib/solar.ts`) | Public-domain US Government work; the algorithm is published, not a service | ✅ Safe. No network, works offline. |
| **ISRIC SoilGrids** (`rest.isric.org`) | Soil texture, pH estimate | REST API, CORS-enabled, no key | CC BY 4.0 | ✅ Safe with attribution. Global coverage; presented as *coarse* (250 m grid). |
| **USGS 3DEP / EPQS** (`epqs.nationalmap.gov`) | Elevation, derived slope | REST point query, no key | US Government public domain | ✅ Safe. CORS can be flaky → treated as best-effort. |
| **Open-Meteo** (`archive-api.open-meteo.com`) | Rainfall + winter-low temp → hardiness zone | REST API, no key | CC BY 4.0; free for non-commercial and commercial use | ✅ Safe with attribution. |
| **Open-Meteo Geocoding** (`geocoding-api.open-meteo.com`) | Town/ZIP → coordinates (the no-GPS location fallback) | REST API, no key, CORS-enabled | CC BY 4.0 (GeoNames-backed) | ✅ Safe with attribution. Towns and postal codes only, not street addresses — which matches the pipeline: soil, climate, and ecoregion data are all coarser than an address anyway. |
| **OSM Nominatim reverse geocoding** (`nominatim.openstreetmap.org`) | Coordinates → nearest town name, shown instead of raw lat/lon | Free REST API, no key, CORS-enabled | Data ODbL, © OpenStreetMap contributors (already credited for the map tiles); [usage policy](https://operations.osmfoundation.org/policies/nominatim/) allows light use — this is one request per explicit user action, never autocomplete or polling | ✅ Display-only nicety, and not a new provider — the app already depends on OSM. No verdict, lookup, or stored datum depends on it; every caller falls back to coordinates when it fails. |
| **USDA hardiness zones** | Zone label | *Derived locally* from Open-Meteo minimum temperatures using the USDA 10°F/zone definition | Zone *definition* is public; the official USDA GIS layer has its own terms | ✅ We compute the zone rather than depend on the map service, which sidesteps the licensing question. |
| **USDA PLANTS Database** | Native status, distribution | Referenced for the seed data | US Government public domain | ✅ Safe. |
| **Tallamy host-plant counts / NWF Native Plant Finder** | Lepidoptera host-species counts (the host score) | Used to populate the seed dataset by genus | ⚠️ The underlying research (Narango, Tallamy et al.) is published science; the NWF tool's database is not offered under an explicit open-data licence | ⚠️ **Facts, used at genus level, with attribution.** Host *counts* are factual figures from published ecology, cited in each row's `basis`. We do not copy NWF's database wholesale or mirror their tool. If NWF later asserts terms, the counts can be re-sourced from the primary literature. Flagged here rather than assumed safe. |
| **Lady Bird Johnson Wildflower Center** | Size, bloom, culture notes | Referenced for the seed data | Educational reference; individual facts (mature size, bloom month) are not copyrightable | ✅ Facts referenced, not text copied. |
| **USFS Native Plant Network — Propagation Protocol Database** (`npn.rngr.net`) | Propagation & seed-saving method per plant ("how to make more of it") | Referenced for the propagation notes | USDA Forest Service / RNGR resource; individual propagation facts (needs cold stratification, roots from hardwood cuttings) are not copyrightable | ✅ **The dependable propagation anchor.** Method facts referenced per row (`propagation.basis`), written in our own plain words; we don't copy any protocol's prose. Each method term is glossed inline in `lib/plain.ts`. |
| **USFS Woody Plant Seed Manual** (Agric. Handbook 727, Bonner & Karrfalt 2008) | Seed handling for trees & shrubs (stratification weeks, scarification, cleaning) | Referenced for the woody-plant propagation notes | US Government public domain | ✅ Safe. Public-domain federal handbook; the standard reference for woody-plant seed. |
| **OregonFlora / Oregon Flora Project** | PNW native status, range, culture (west-side dataset) | Referenced for the PNW seed data | Facts (native status, range, size) are not copyrightable; the site/text is | ✅ Facts referenced. |
| **Burke Herbarium Image Collection (WTU), U. of Washington** | PNW native status & distribution | Referenced for the PNW seed data | Herbarium records; individual factual data are not copyrightable | ✅ Facts referenced. |
| **E-Flora BC (UBC)** | PNW native status & range (northern edge) | Referenced for the PNW seed data | Facts referenced, not prose | ✅ Facts referenced. |
| **Atlas of Florida Plants (USF Institute for Systematic Botany)** | Florida native status & distribution | Referenced for the Florida seed data | The atlas is the standard FL source; individual distribution facts are not copyrightable | ✅ Facts referenced. |
| **Florida Native Plant Society (FNPS) / UF-IFAS / FANN** | Florida culture, native status, wildlife value | Referenced for the Florida seed data | Publications © ; we use the factual associations, not the prose | ✅ Facts referenced. |
| **Institute for Regional Conservation — "Natives For Your Neighborhood" (IRC)** | South-Florida native status, range & culture | Referenced for the south-Florida seed data | The largest south-FL native database; individual facts are not copyrightable | ✅ Facts referenced. |
| **Xerces Society regional lists (incl. Maritime NW)** | Pollinator / establishment context, both regions | Referenced | Publications are copyrighted; we use the factual associations, not the prose | ✅ Facts referenced. |
| **USFS Silvics / Fire Effects Information System (FEIS)** | Size / growth for trees (esp. PNW conifers) | Referenced | US Government public domain | ✅ Safe. |
| **EPA Level III/IV Ecoregions** (Omernik) | Ecoregion label (Level III + finer Level IV) | Live point query to the EPA ArcGIS service (`gispub.epa.gov/.../USEPA_Ecoregions_Level_III_and_IV`), best-effort | US Government public domain | ✅ **Integrated (Phase A, label only).** Real Level III/IV names shown on the confirm screen; falls back to the coarse bounding-box guess (marked "(broad)") when offline/outside CONUS. Using it for *region selection* is Phase B — see `docs/ecoregion-plan.md`. |
| **BONAP county distribution** | County-level native status | *Not yet integrated* | ⚠️ BONAP maps have restrictive reuse terms | ⛔ **Do not scrape or embed.** Phase 2 should use USDA PLANTS county data (public domain) for county resolution instead. Noted so we don't build on it by accident. |
| **Basemap tiles** (for the location map) | — | *Not used* | OSM/other tile terms + offline concerns | ⏳ Phase 1 uses a schematic metric grid instead of external tiles, to stay offline-first and avoid tile-usage terms. |

## Scaling the catalog: canonical taxonomy & distribution backbones

The seed lists are hand-authored today. To grow honestly to every U.S. region —
and eventually the world — we need a *canonical name spine* (so "the same plant"
means one thing across sources) and a *native-distribution source* (so "native
*here*" is a checkable fact, not our opinion). These are the sources to build on,
all either public domain or openly licensed with attribution:

**Taxonomic backbone (the name spine)**

| Source | Scope | Licence | Role |
|---|---|---|---|
| **World Checklist of Vascular Plants (WCVP)** / Plants of the World Online (POWO), Kew | Global | **CC BY 4.0** (downloadable via Kew FTP + GBIF as a Darwin Core Archive) | **The recommended global spine.** Accepted names + synonymy for all vascular plants, expert-reviewed. |
| **GBIF Backbone Taxonomy** | Global | CC BY 4.0 | Stable `usageKey`s to reconcile any source's names to one id; the practical crosswalk hub. |
| **ITIS** (Integrated Taxonomic Information System) | Global, N. America–strong | US Gov **public domain** | TSN identifiers; good North American coverage, easy to redistribute. |
| **USDA PLANTS Database** | U.S. + territories | US Gov **public domain** | U.S. spine: the `Symbol` code (e.g. `QUGA4`), accepted names, growth habit. |
| **World Flora Online (WFO)** | Global | CC BY | Consortium successor to The Plant List; alternate/cross-check backbone. |

**Native status & distribution (the "native *here*" fact)**

| Source | Scope | Licence | Role |
|---|---|---|---|
| **USDA PLANTS** | U.S., **state-level** native/introduced/invasive | **Public domain** | The backbone for U.S. regions. State resolution now; a Phase-2 path to county via its distribution data. |
| **WCVP native ranges** | Global, by TDWG "botanical country" (WGSRPD level 3) | **CC BY 4.0** | The global answer: native-vs-introduced range per region for essentially every species. |
| **GBIF occurrences** (incl. research-grade iNaturalist) | Global point observations | CC BY / CC0 (per record) | Validate that a species actually occurs at/near a spot; ground-truth the range polygons. |
| **EPA Level III/IV Ecoregions** | U.S. | US Gov **public domain** | Real ecoregion boundaries to replace our coarse bounding boxes (already flagged as Phase 2). |
| **RESOLVE / WWF Terrestrial Ecoregions of the World** | Global | CC BY 4.0 | Ecoregion context outside the U.S. |
| ~~BONAP county maps~~ | U.S. county | ⛔ restrictive | **Do not use** — reason unchanged (see table above). Use USDA PLANTS county data instead. |

**Wildlife-value inputs (the eco-score)**

| Source | Scope | Licence | Role |
|---|---|---|---|
| **HOSTS — a Database of the World's Lepidopteran Host Plants** (NHM London) | Global | Free for research use; attribute | Primary-literature host associations to re-source the Lepidoptera counts globally, reducing reliance on NWF's terms-uncertain figures. |
| **Tallamy / NWF Native Plant Finder** | U.S., by ZIP | ⚠️ terms uncertain (flagged above) | Cross-check only; counts are used as published facts at genus level, cited per row. |
| **Xerces Society** regional lists | U.S. regions | prose © / facts usable | Pollinator & establishment associations. |

**Recommended approach.** Adopt **WCVP/POWO (CC BY)** as the global name spine and
native-range source, reconcile identifiers through the **GBIF backbone**, and
prefer **USDA PLANTS (public domain)** for U.S. native status and its `Symbol`
as our per-plant key. Attribution for the CC BY sources (WCVP, GBIF, Open-Meteo,
SoilGrids, RESOLVE) is cheap and non-viral, so none of them can hold the app
hostage. This keeps every future region assembled from the same public backbones
the Phase-1 data already leans on, rather than from any single restrictive
provider.

## Principles applied

- **"Native" means native *here*.** Each seed dataset asserts native status at the
  state/ecoregion level for its own region (Pennsylvania / Mid-Atlantic; maritime
  Pacific Northwest; north/central Florida; subtropical south Florida & the Keys),
  not "native to North America." The app picks the list from your coordinates —
  refined by the spot's real EPA ecoregion when online — and refuses to show
  another region's plants for an uncovered spot. That ecoregion refinement is what
  splits Florida cleanly along the Southern Florida Coastal Plain (76) seam; see
  `docs/ecoregion-plan.md`. County-level status via USDA PLANTS is a Phase 2 item.
- **Facts vs. expression.** Mature sizes, bloom months, and host-species counts
  are facts and are cited per row (`basis` field). We reference them; we do not
  copy anyone's descriptive text or mirror a database.
- **When in doubt, it's optional.** Every live source degrades to `null` on
  failure, so no single dataset's terms can hold the app hostage.
- **Attribution.** SoilGrids and Open-Meteo (CC BY 4.0) are credited in-app on
  the welcome screen and here.

## Why MIT (not AGPL)

This is a civic/public-good tool built entirely on public data. The goal is the
widest possible reuse — by land trusts, extension offices, native-plant
societies, and other apps — with the least friction. AGPL's network-copyleft
would deter exactly those integrations. MIT maximizes adoption of a public good;
the data underneath is public, so the code should be too.
