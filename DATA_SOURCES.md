# Data sources & licensing

The brief asked, explicitly, to check the licence on every upstream source
before depending on it and to say plainly what was found. Here is that audit as
of the Phase 1 build. **None of these are scraped**; each is a documented public
API or an openly licensed dataset. Where reuse terms are uncertain, that is
called out and the dependency is kept optional.

This document is the licensing audit, written for a developer. Its plain-language
companion — which of our numbers are counted, which are our own judgment, what
we're assuming, and where we think we're most likely wrong — is the in-app page
at [`#/sources`](https://indigene.app/#/sources)
(`app/src/steps/sources.ts`). Anything claimed here should be consistent with
what that page tells the public.

| Source | Used for | Access | Licence / terms | Verdict |
|---|---|---|---|---|
| **NOAA solar position algorithm** | Sun path & sun-hours, computed on-device | Reimplemented locally (`src/lib/solar.ts`) | Public-domain US Government work; the algorithm is published, not a service | ✅ Safe. No network, works offline. |
| **ISRIC SoilGrids** (`rest.isric.org`) | Soil texture, pH estimate | REST API, CORS-enabled, no key | CC BY 4.0 | ✅ Safe with attribution. Global coverage; presented as *coarse* (250 m grid). |
| **USGS 3DEP / EPQS** (`epqs.nationalmap.gov`) | Elevation, derived slope | REST point query, no key | US Government public domain | ✅ Safe. CORS can be flaky → treated as best-effort. |
| **Open-Meteo** (`archive-api.open-meteo.com`) | Rainfall + winter-low temp → hardiness zone | REST API, no key | CC BY 4.0; free for non-commercial and commercial use | ✅ Safe with attribution. |
| **Open-Meteo Geocoding** (`geocoding-api.open-meteo.com`) | Town/ZIP → coordinates (the no-GPS location fallback) | REST API, no key, CORS-enabled | CC BY 4.0 (GeoNames-backed) | ✅ Safe with attribution. Towns and postal codes only, not street addresses — which matches the pipeline: soil, climate, and ecoregion data are all coarser than an address anyway. |
| **OSM Nominatim reverse geocoding** (`nominatim.openstreetmap.org`) | Coordinates → nearest town name, shown instead of raw lat/lon | Free REST API, no key, CORS-enabled | Data ODbL, © OpenStreetMap contributors (already credited for the map tiles); [usage policy](https://operations.osmfoundation.org/policies/nominatim/) allows light use — this is one request per explicit user action, never autocomplete or polling | ✅ Display-only nicety, and not a new provider — the app already depends on OSM. No verdict, lookup, or stored datum depends on it; every caller falls back to coordinates when it fails. |
| **iNaturalist API** (`api.inaturalist.org`) | "Growing near you": real, research-grade photos of a recommended plant, observed close to the user *or* anywhere inside a region it's native to (`lib/inaturalist.ts`); and "See it near you" on a wildlife page: research-grade sightings of a native animal near the user *or* in a region it's found in (`lib/wildlife-sightings.ts`) | REST API, no key, CORS-enabled; called **directly from the browser** so iNaturalist sees the user's request and our app origin in the `Referer` (browsers forbid a custom `User-Agent` from `fetch`, so the referrer is our identification — a reason *not* to proxy it) | Content is contributor-owned; every observation and photo carries its own licence. [API terms](https://www.inaturalist.org/pages/api+recommended+practices) ask for attribution and light use | ✅ **Display-only, native-scoped, with per-item attribution, and rate-respecting by design.** We only ever ask about plants our own data vouches for. Two lookups, same guarantee: a **point** query (the user's spot + radius), and a **region** query bounded by an Indigene region's coverage box (`swlat/nelng/…`) so a plant can be looked up where it's native even when you're not there. Both are scoped to that region's native taxa (`taxon_id=…`), so a non-native garden escape or invasive is never fetched, cached, or shown — and the layer additionally drops anything not in our catalog. Outside a covered region, or for a plant our data doesn't list as native there, we showcase nothing rather than dress up a stray sighting as a local native. We keep only photos that carry an explicit CC licence (dropping "all rights reserved"), show each photo's observer + licence credit and a link to the record, and credit iNaturalist on the section. One request per area (per spot-cell or per region), then cached in IndexedDB (trimmed to taxon id + photo links) and indexed by taxon — so browsing many plants in one area is a single call, never per-plant polling. The wildlife layer works the same way and makes the same attribution and freshness promises, with one difference: the catalog carries no numeric id for an animal, so it identifies the creature by the scientific name already in the catalog, resolving it to a taxon id at request time (`resolveTaxon`, which follows iNaturalist's synonymy and fails safe — an unresolvable name shows nothing, never the wrong animal). The query is pinned to that one taxon, so only the asked-for creature is ever fetched, cached, or shown. No verdict or ranking depends on it. |
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
| **EPA Level III/IV Ecoregions** (Omernik) | Ecoregion label (Level III + finer Level IV) + US region selection | Live point query to the EPA ArcGIS service (`gispub.epa.gov/.../USEPA_Ecoregions_Level_III_and_IV`), best-effort | US Government public domain | ✅ **Integrated.** Real Level III/IV names on the confirm screen and used to refine region selection; falls back to the coarse box (marked "(broad)") offline/outside CONUS. See `docs/ecoregion-plan.md`. |
| **EEA Biogeographical Regions of Europe** (2016) | Ecoregion label + European region selection (Atlantic / Continental / Alpine / Mediterranean…) | Live point query to the EEA ArcGIS service (`bio.discomap.eea.europa.eu/.../BioRegions/BiogeographicalRegions_WM`), best-effort | **CC-BY 4.0** (© European Environment Agency; admin boundaries © EuroGeographics) | ✅ **Integrated.** The Europe-side analogue of EPA ecoregions: picks/refines the France region and labels the confirm screen; falls back to the coarse box offline. Attribution: "EEA Biogeographical Regions of Europe (CC BY 4.0)". Layer 0 + the `short_name` field are confirmed against the live service (`data/sources/eea-biogeographical-regions/probe.json`). See `docs/france-localization-plan.md`. |
| **Tela Botanica — BDTFX** (Base de Données des Trachéophytes de France métropolitaine) | Native status, accepted names & French vernacular names for the France seed data | Referenced for all four France lists (Atlantic, Continental, Mediterranean, Alps) | Reference taxonomy; individual facts are not copyrightable | ✅ Facts referenced. |
| **INPN — Inventaire national du patrimoine naturel (MNHN)** | French native/indigénat status, distribution, protection status, and the named plant↔insect ties on the French wildlife pages | Referenced for all four France lists | National inventory; individual distribution facts are not copyrightable | ✅ Facts referenced. Bluebell etc. bought as cultivated stock — never wild-dug where protected. |
| **European Lepidoptera–Plant matrix** (Gaytán et al. 2026, *Ecology & Evolution* [doi:10.1002/ece3.73004](https://doi.org/10.1002/ece3.73004)) | The European `hostLepCount` — Lepidoptera host-species counts per plant genus (the Tallamy/NWF equivalent for Europe) | Dataset downloaded from the DOI into `data/sources/eu-lep-plant-matrix/` (git-ignored) and reduced by `app/scripts/build-host-counts.mjs` to a committed `host-counts.json` | **CC-BY 4.0**, machine-readable | ✅ **Integrated.** 5,152 Lepidoptera × 3,275 plants, all Europe, species-level, and it records **larval hosts** (the dataset's README says so) — which is what `hostLepCount` claims. Counted at **genus** level, so European figures sit on the same scale as the US Tallamy ones and the shared `HOST_ANCHOR` (520) still holds — the top European count is 391, so **no US score moved**. Members are filtered to those growing in the region's European zone *and* native to Europe, so a native plant isn't credited with caterpillars recorded only on introduced ornamental relatives (native honeysuckle: 57, not 111). Both figures are kept in `host-counts.json` and named in each row's `basis` where they differ. Cleaner terms than NWF. See `docs/host-counts-plan.md`. |
| **DBIF v2** (CEH/BRC *Database of Insects and their Food Plants*) | GB cross-check for the European host counts — ships a per-plant "insect species richness" file | *Identified, not yet run* — the intended independent check on the Gaytán counts | **Open Government Licence** ("Contains data supplied by NERC") | ⏳ Safe with attribution, and still the open follow-up. Great Britain only, but the Atlantic-France flora overlaps almost entirely, so it can corroborate our genus counts without sharing the Gaytán dataset's assumptions. Deliberately deferred (`docs/host-counts-plan.md` §8): no shipped number depends on it. |
| **BRC DBIF / Southwood foliage-insect rankings** | Formerly the basis for the *interim* France host-count estimates | *No longer used for any shipped number* | Facts referenced, not prose | ✅ **Retired.** The France rows now carry counts computed from the Gaytán matrix above, so these rankings no longer stand behind any figure in the app. DBIF v2 (row above) remains the intended independent cross-check of those counts; it has not been run yet. |
| **RHS "Plants for Pollinators", Buglife, Plantlife, Woodland Trust, Butterfly Conservation** | Pollinator value, propagation, notable wildlife ties for the France seed data | Referenced for all four France lists | Publications © ; we use the factual associations, not the prose | ✅ Facts referenced. |
| **BONAP county distribution** | County-level native status | *Not yet integrated* | ⚠️ BONAP maps have restrictive reuse terms | ⛔ **Do not scrape or embed.** Phase 2 should use USDA PLANTS county data (public domain) for county resolution instead. Noted so we don't build on it by accident. |
| **Basemap tiles** (for the location map) | — | *Not used* | OSM/other tile terms + offline concerns | ⏳ Phase 1 uses a schematic metric grid instead of external tiles, to stay offline-first and avoid tile-usage terms. |

## Wildlife relationships (browse-by-wildlife)

The browse-by-wildlife feature names the specific **native** insects and animals
each plant supports and how (larval host vs. nectar/berries/seeds/shelter). Two
rules govern the data (`app/src/data/wildlife.ts`), both enforced by a dev-time
audit (`app/src/lib/wildlife.ts` → `auditSupport`):

1. **Every listed animal is itself native** (`Wildlife.native` is the literal
   type `true`, with a sourced `nativeBasis`). The introduced European honey bee
   (*Apis mellifera*) is deliberately excluded — the point is native plants
   feeding native wildlife.
2. **Every plant↔animal tie cites a reliable source** (`SupportLink.basis`); the
   audit rejects a tie with no source.

Each tie also records **how** the plant helps (`support`: larval host, nectar,
berries, seeds, shelter) and **how much the animal depends on it**
(`reliance`: `sole` = obligate/no substitute, like a monarch on milkweed or an
atala on coontie; `narrow` = a specialist with only a few options; `broad` =
one of many, the default). The make-or-break `sole` ties are surfaced first and
flagged in the UI, so "milkweed is the monarch's *only* host" reads differently
from "cherry is *one of* the tiger swallowtail's trees" — a distinction that
previously lived only in prose.

Both are shown in the UI, with authority names linked out
(`app/src/data/sources.ts`, rendered by `components/citation.ts`). As with the
plant data, we reference **factual ecological associations** (which animal uses
which plant), written in our own plain words — not any source's prose.

| Source | Used for | Access | Licence / terms | Verdict |
|---|---|---|---|---|
| **Butterflies and Moths of North America (BAMONA)** | Butterfly/moth identity, native status, host plants; the per-species **deep link** (`/species/Genus-species`) | Referenced; species URL built from the binomial | Records are user/expert-contributed; individual factual associations are not copyrightable | ✅ Facts referenced; deep-linked to the species page. |
| **Cornell Lab of Ornithology — All About Birds** | Bird identity, diet/food facts; the per-species **deep link** (`/guide/Common_Name`) for single-species entries | Referenced; guide URL built from the common name | Educational reference; individual food/diet facts are not copyrightable | ✅ Facts referenced; deep-linked where a single species exists (groups link to the site). |
| **Xerces Society** | Pollinator & specialist-bee associations, host records | Referenced | Publications © ; factual associations used, not prose | ✅ Facts referenced. |
| **Fowler & Droege — Pollen Specialist Bees of the U.S.** | Which native bees are pollen-specialists on which plant families | Referenced | Published dataset; factual associations used | ✅ Facts referenced. |
| **USGS Native Bee Inventory & Monitoring Lab** | Native-bee identity & status | Referenced | US Government public domain | ✅ Safe. |
| **NWF Native Plant Finder / Tallamy** | Lepidoptera host associations (same source as the host score) | Referenced | ⚠️ see the host-count row above | ⚠️ Factual associations, attributed. |
| **Lady Bird Johnson Wildflower Center** | Nectar/host/wildlife-value notes | Referenced | Facts referenced, not prose | ✅ Facts referenced. |
| **INPN — Inventaire national du patrimoine naturel (MNHN)** | The **European** side of this layer: butterfly/moth identity and native status, and their documented larval food plants (Cleopatra on buckthorn, two-tailed pasha on strawberry tree, large blue on wild thyme, small blue on kidney vetch…) | Referenced for the four France regions | National inventory; individual factual associations are not copyrightable | ✅ Facts referenced. The European counterpart to BAMONA above. |
| **Ligue pour la Protection des Oiseaux (LPO)** | French bird identity and diet/food facts behind the European bird ties (winter thrushes, Mediterranean warblers, conifer-seed finches, nutcracker, black grouse) | Referenced | Educational reference; diet facts are not copyrightable | ✅ Facts referenced. The European counterpart to the Cornell Lab row above. |
| **A checklist of European butterfly larval foodplants** (Dryad, [doi:10.5061/dryad.1vhhmgr12](https://doi.org/10.5061/dryad.1vhhmgr12)) | Cross-check for every European butterfly↔host-plant tie we assert | Referenced | Open data (Dryad) | ✅ Facts referenced. Distinct from the Gaytán matrix, which supplies the *counts*; this supplies the *named* butterfly ties. |
| **Observatoire des Galliformes de Montagne / Parc national de la Vanoise** | The black grouse↔bilberry dependence in the Alps list | Referenced | Monitoring programme publications; factual associations used | ✅ Facts referenced. |
| **Audubon (bird guide)** | Bird food & nectar associations | Referenced | Facts referenced | ✅ Facts referenced. |
| **UF/IFAS · Florida Native Plant Society · Florida Museum of Natural History** | Florida wildlife associations; the atala↔coontie relationship | Referenced | Facts referenced, not prose | ✅ Facts referenced. |
| **Monarch Joint Venture** | Monarch↔milkweed obligate relationship | Referenced | Facts referenced | ✅ Facts referenced. |
| **USDA PLANTS · USDA Silvics of North America** | Mast/berry wildlife value for trees & shrubs | Referenced | US Government public domain | ✅ Safe. |
| **USFWS · IUCN Red List · Smithsonian** | Native status of birds, mammals & the gopher tortoise | Referenced | Public-domain (USFWS) / factual status references | ✅ Facts referenced. |

**On the deep links.** Authority names link to each source's canonical page.
Species-level deep links use two well-established, deterministic schemes —
BAMONA `…/species/Genus-species` for insects and All About Birds
`…/guide/Common_Name` for single-species birds — built from the animal's own
name (`speciesRecordUrl`). These URL *paths* were **not machine-verified from
the build environment** (its egress policy blocks outbound web hosts); each site
returns a searchable page if a slug ever drifts. Group entries (e.g. "Jays,
turkeys & woodpeckers") and two-species entries have no single record and link
to the authority instead.

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
| **EPA Level III/IV Ecoregions** | U.S. | US Gov **public domain** | Real ecoregion boundaries that refine our coarse bounding boxes (integrated for US regions). |
| **EEA Biogeographical Regions of Europe** | Europe | **CC BY 4.0** | The Europe-side equivalent — integrated for the France region (Atlantic/Continental/Alpine/Mediterranean). |
| **RESOLVE / WWF Terrestrial Ecoregions of the World** | Global | CC BY 4.0 | Finer ecoregion context outside the U.S./Europe, if ever needed. |
| ~~BONAP county maps~~ | U.S. county | ⛔ restrictive | **Do not use** — reason unchanged (see table above). Use USDA PLANTS county data instead. |

**Wildlife-value inputs (the eco-score)**

| Source | Scope | Licence | Role |
|---|---|---|---|
| **European Lepidoptera–Plant matrix** (Gaytán et al. 2026) | Europe | **CC BY 4.0** | The Europe-wide Tallamy equivalent: species-level Lep×plant associations, aggregated to genus for `hostLepCount`. Canonical for European regions (integration pending). |
| **DBIF v2** (CEH/BRC) | Great Britain | **Open Government Licence** | Per-plant insect-richness cross-check for European counts; attribution "Contains data supplied by NERC". |
| **GloBI — Global Biotic Interactions** | Global | CC BY (aggregate; per-source) | Open API + full dumps aggregating HOSTS, DBIF and more — the programmatic route to host associations, with reconciliation to GBIF ids. |
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
  Pacific Northwest; north/central Florida; subtropical south Florida & the Keys;
  the Atlantic biogeographical region of metropolitan France), not "native to a
  continent." The app picks the list from your coordinates — refined by the spot's
  real ecoregion when online (EPA Omernik in the US, EEA biogeographical regions in
  Europe) — and refuses to show another region's plants for an uncovered spot. That
  refinement is what splits Florida cleanly along the Southern Florida Coastal Plain
  (76) seam and keeps a Mediterranean or Alpine French point out of the Atlantic
  list; see `docs/ecoregion-plan.md` and `docs/france-localization-plan.md`.
  County-level status via USDA PLANTS is a Phase 2 item.
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
