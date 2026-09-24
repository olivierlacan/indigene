# South of the equator: Australia, New Zealand, South Africa, South America

The goal: a first region on each of the four, live while the southern spring
is still news. This page says what the engine now handles, which four regions
come first, and what each still needs. Measured 2026-09-24.

---

## 1. What the engine now handles

Every shipped region is north of the equator, and a handful of things assumed
it without saying so. They now ask `lib/hemisphere.ts` instead:

| Assumption | Where | Now |
|---|---|---|
| "Spring" is March–May | `seasonOfMonth` / `currentSeason` in `lib/planting.ts` | Flips for a reader whose spot or picked region is south of the equator (`readerHemisphere()` in `state.ts`) |
| The growing season is April–October | sun-hours sampling in `lib/solar.ts` | October–April south of the equator. A Sydney scan was being averaged over its winter |
| The south side is the sunny one | manual sun picker (`sun.fullSub` / `sun.shadeSub`) | "North side" / "south side" swap |
| Technique windows named northern months | `prop.*.timing` (en + fr) | Seasons only ("mid-autumn", "the depth of winter") |
| Ecoregions come from the EPA or the EEA | `fetchEcoregion` in `lib/site.ts` | A third provider, `resolve-2017`, asked when `lat < 0` |
| Maps come from the EPA or the EEA | `build-region-maps.mjs` | Draws a `resolve-2017` region from the same layer |
| The bloom calendar's "growing season" is Feb–Oct | `coverage.mjs` | Aug–Apr for a southern region |

Already fine, checked: bloom months wrap the new year (`startMonth: 11,
endMonth: 2` reads "November to February"; nothing compares them as numbers),
coordinates print their hemisphere, hardiness zones come from minimum
temperature and so work anywhere (quote them with a "≈", as Europe does),
soil (SoilGrids), rain and elevation (Open-Meteo) are global.

## 2. The four first regions

| | Sydney Basin | Auckland & Northland | Cape fynbos lowlands | Buenos Aires pampas |
|---|---|---|---|---|
| Proposed id | `au-sydney` | `nz-auckland` | `za-cape` | `ar-pampas` |
| Reaches | Sydney, the Blue Mountains edge, Wollongong | Whangārei to Auckland; Hamilton is the south edge to check | Cape Peninsula, Cape Flats, Boland to Stellenbosch | Buenos Aires, La Plata, the Río de la Plata shore |
| RESOLVE ecoregion (`ECO_ID`, confirmed live) | 168 Eastern Australian temperate forests | 173 Northland temperate kauri forests | 90 Renosterveld shrubland, likely + 89 Fynbos shrubland | 576 Humid Pampas |
| WCVP area (native check) | `NSW` | `NZN` | `CPP` | `AGE` |
| Finer national flora | Australian Plant Census + NSW PlantNET | NZ Plant Conservation Network | SANBI (POSA) | Flora Argentina (Darwinion), by province |
| Language | English | English, with te reo Māori names | English | **Spanish** |
| Featured-plant candidates | Old man banksia (*Banksia serrata*) | Pōhutukawa (*Metrosideros excelsa*) | Pincushion / sugarbush (*Protea repens*) | Ceibo (*Erythrina crista-galli*) |

**Native status:** WCVP already knows all four regions. Ten or twelve likely
headline plants per region were checked against it: all 42 came back native in
their area. The areas are coarse, though: `CPP` is the whole Cape, Eastern
Cape included, and `AGE` runs from Buenos Aires to Misiones. WCVP rules plants
*out*. Each row still cites the national flora for "native *here*", the way
Ireland's rows cite WCVP and France's cite TAXREF.

## 3. The gates, in the order they bite

1. **Ecoregion lookup: done.** `npm run probe:resolve` confirmed the layer,
   fields and CORS, and the ECO_IDs above. `npm run resolve:fetch` keeps a
   local copy of the shapes, for maps and for checking a new box. Cape Town
   sits in renosterveld (90) while Table Mountain's fynbos is 89, so the Cape
   region probably claims both. Details: `data/sources/resolve-ecoregions/`.
2. **Host counts: New Zealand done, the rest open.** `hostLepCount` is the
   ranking's strongest signal. New Zealand's come from **Plant-SyNZ**
   (`npm run host-counts:nz`; `data/sources/plant-synz/`). The NHM's global
   **HOSTS** database (CC0) is fetched by `npm run hosts:fetch` and measured
   per area in `data/sources/hosts/`:
   - **Sydney: usable.** Eucalyptus 257, Acacia 118, Melaleuca 87, Banksia 34,
     as Australia-wide figures.
   - **Cape Town: too thin alone.** Protea 33, but Erica 1 and Pelargonium 1.
     Needs a South African source.
   - **Buenos Aires: not usable.** 235 records in all; Erythrina and
     Passiflora 0. Needs an Argentine source.

   Leads for the two gaps, not yet checked for data access or licence:
   - Cape: the southern African Lepidoptera–host database behind the
     Caterpillar Rearing Group (11,628 rearings, 2,826 species), published
     in *Metamorphosis*, the Lepidopterists' Society of Africa's journal.
   - Buenos Aires: Pastrana, *Los Lepidópteros argentinos: sus plantas
     hospedadoras y otros sustratos alimenticios* (Sociedad Entomológica
     Argentina, 2004). A book, so counts would need extracting from it.

   A host that refuses this sandbox can still be read by a GitHub Actions job
   or a script run locally. HOSTS turned out not to need either.

   Southern hosts are also less recorded, so counts will run low against
   `HOST_ANCHOR` (520). Ranking within a region still works. Keystone flags
   stay off unless a source says otherwise.
3. **Spanish** for Buenos Aires. The app speaks English and French, so
   `ar-pampas` can ship in English first, but a Spanish locale is what makes
   it a debut there, not a preview.
4. **Te reo Māori names** for Auckland. Pōhutukawa, kōwhai and harakeke are
   the everyday English names, not translations. Write them as `common`, with
   macrons.

Everything else is the ordinary checklist in `adding-a-region.md`: wildlife
ties (GloBI is global), map landmarks, iNaturalist photos, share cards,
record counts. None of it is hemisphere-specific.

## 4. Order

1. **Auckland.** English; one WCVP area that matches the region; the best
   single host source (Plant-SyNZ). **Shipped in 0.34** (PR #166) with 47
   plants, RESOLVE ecoregion 173 and Plant-SyNZ caterpillar counts.
2. **Sydney.** English; the most readers; host counts start from HOSTS.
3. **Cape Town.** English; the richest flora of the four, so the list is about
   choosing. Planting there is an autumn job (April–June, with the rains), so a
   spring debut gives readers time to plan.
4. **Buenos Aires.** Last only because of Spanish.

Each region is its own PR, like every region before it.
