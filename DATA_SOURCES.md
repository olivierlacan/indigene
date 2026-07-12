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
| **USDA hardiness zones** | Zone label | *Derived locally* from Open-Meteo minimum temperatures using the USDA 10°F/zone definition | Zone *definition* is public; the official USDA GIS layer has its own terms | ✅ We compute the zone rather than depend on the map service, which sidesteps the licensing question. |
| **USDA PLANTS Database** | Native status, distribution | Referenced for the seed data | US Government public domain | ✅ Safe. |
| **Tallamy host-plant counts / NWF Native Plant Finder** | Lepidoptera host-species counts (the host score) | Used to populate the seed dataset by genus | ⚠️ The underlying research (Narango, Tallamy et al.) is published science; the NWF tool's database is not offered under an explicit open-data licence | ⚠️ **Facts, used at genus level, with attribution.** Host *counts* are factual figures from published ecology, cited in each row's `basis`. We do not copy NWF's database wholesale or mirror their tool. If NWF later asserts terms, the counts can be re-sourced from the primary literature. Flagged here rather than assumed safe. |
| **Lady Bird Johnson Wildflower Center** | Size, bloom, culture notes | Referenced for the seed data | Educational reference; individual facts (mature size, bloom month) are not copyrightable | ✅ Facts referenced, not text copied. |
| **Xerces Society regional lists** | Pollinator / establishment context | Referenced | Publications are copyrighted; we use the factual associations, not the prose | ✅ Facts referenced. |
| **EPA Level III/IV Ecoregions** | Ecoregion label | *Not yet integrated* — a coarse lat/lon bounding box is used as a placeholder | US Government public domain | ⏳ Deferred to Phase 2 (a real GetFeatureInfo call). Current label is clearly marked "(broad)". |
| **BONAP county distribution** | County-level native status | *Not yet integrated* | ⚠️ BONAP maps have restrictive reuse terms | ⛔ **Do not scrape or embed.** Phase 2 should use USDA PLANTS county data (public domain) for county resolution instead. Noted so we don't build on it by accident. |
| **Basemap tiles** (for the location map) | — | *Not used* | OSM/other tile terms + offline concerns | ⏳ Phase 1 uses a schematic metric grid instead of external tiles, to stay offline-first and avoid tile-usage terms. |

## Principles applied

- **"Native" means native *here*.** The seed dataset asserts native status at the
  state/ecoregion level (Pennsylvania / Mid-Atlantic), not "native to North
  America." County-level resolution via USDA PLANTS is a Phase 2 item.
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
