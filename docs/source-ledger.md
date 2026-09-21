# Three sources, and not three of the same kind

A standard and a scoreboard: **every region should stand on at least three
independent sources, and they should not all be the same kind of thing.**

This exists because two turned out not to be enough, and the way they failed is
instructive. `npm run societies` measured our lists against Audubon and the
Wildflower Center — two sources, both **recommendation lists**. Neither could
settle whether a plant is native, because that is not the question a
recommendation list answers. Audubon carries a flora tier, so it looked like it
could; its flora for Portland has no Douglas-fir, so it could not.

Two sources that agree may simply share a blind spot. Three sources of
*different kinds* do not.

## The four kinds

| Kind | What it can settle | What it cannot |
|---|---|---|
| **Botanical authority** — a world or national checklist (Kew WCVP, Tela Botanica BDTFX, the CBN network) | Is this plant native in this place | Whether anybody should plant it |
| **Governmental** — USDA PLANTS, EPA ecoregions, EEA biogeographical regions, INPN, the OFB's Végétal local | Where a place *is*, and official status | Garden merit |
| **Academic / herbarium** — OregonFlora, the Burke Herbarium, the Atlas of Florida Plants, Jepson, land-grant extension, the Wildflower Center (UT Austin) | Regional detail a global checklist flattens | Global consistency |
| **Research** — the Gaytán 2026 European Lepidoptera–plant matrix, Tallamy/NWF host counts, GloBI | What eats it, with a citation | Native status, range |
| **Society / recommendation** — Audubon, CNPS, FNPS, WNPS, NPSO, the All-Ireland Pollinator Plan | What a gardener is actually told to plant | Anything about range |

A region wants at least one of the first row **and** at least one of the last,
plus a third from anywhere else.

## Where each region stands

"Machine-checked" means a script re-asks the source and commits the answer, so
upstream drift shows up in a diff. "Referenced" means a human consulted it and
cited it in a row's `basis` — real, but not re-askable.

| Region | Botanical authority | Governmental | Academic | Research | Society |
|---|---|---|---|---|---|
| Mid-Atlantic | **Kew WCVP** ✓ | USDA PLANTS · EPA | Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ |
| Northern Michigan | **Kew WCVP** ✓ | USDA PLANTS · EPA | Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ |
| Pacific Northwest | **Kew WCVP** ✓ | USDA PLANTS · EPA | OregonFlora · Burke Herbarium · Wildflower Center ✓ | Tallamy/NWF · Xerces | **Audubon** ✓ |
| Southern California | **Kew WCVP** ✓ | USDA PLANTS · EPA | Jepson · Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ |
| Central California Coast | **Kew WCVP** ✓ | USDA PLANTS · EPA | Jepson · Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ |
| North & Central Florida | **Kew WCVP** ✓ | USDA PLANTS · EPA | Atlas of Florida Plants · UF-IFAS · Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ · FNPS |
| South Florida | **Kew WCVP** ✓ | USDA PLANTS · EPA | Atlas of Florida Plants · IRC · Wildflower Center ✓ | Tallamy/NWF | **Audubon** ✓ · FNPS |
| Atlantic France | **Kew WCVP** ✓ · Tela Botanica BDTFX | INPN/MNHN · CBN Brest, Sud-Atlantique, Bassin parisien · EEA | — | **Gaytán 2026** ✓ | — |
| Continental France | **Kew WCVP** ✓ · BDTFX | INPN · CBN Franche-Comté, Bassin parisien · EEA | — | **Gaytán 2026** ✓ | — |
| Mediterranean France | **Kew WCVP** ✓ · BDTFX | INPN · CBN Porquerolles, Corse · EEA | — | **Gaytán 2026** ✓ | — |
| The French Alps | **Kew WCVP** ✓ · BDTFX | INPN · CBN alpin · EEA | — | **Gaytán 2026** ✓ | — |
| Ireland | **Kew WCVP** ✓ | National Biodiversity Data Centre · EEA | BSBI | **Gaytán 2026** ✓ | All-Ireland Pollinator Plan |

Every region now clears three kinds. The machine-checked count went from one
region (Ireland) to all twelve, because WCVP turned out to answer everywhere at
the same grain — it just had never been asked outside Ireland.

## What each region is still short of

- **The four French regions have no recommendation list**, and there isn't one
  to have: nobody in France publishes a regional "plant these natives" list for
  gardeners. Documented in
  [`society-list-comparison.md`](society-list-comparison.md).
- **California's botanical authority is the whole state.** TDWG's level-3 areas
  are states, so a `NATIVE` for California cannot tell cismontane coast from
  the Mojave. The two sources that would fix it — Calscape and Jepson — both
  decline automated access; USDA county data is the open route, and is
  described below.
- **The academic column is referenced, not machine-checked**, everywhere except
  the Wildflower Center — and *The academic column, checked* below is what
  happened when each candidate was tried.
- **USDA PLANTS is referenced, not re-asked** — but the endpoint has since been
  found, and it answers at **county** level. Details below; it is the best
  open move left.

## What the third source actually caught

Eleven flags over 578 rows in twelve regions — and the interesting part is that
the society lists agreed with us on several of them, which is exactly the
blind spot a third kind of source exists to find.

| Row | Region | What Kew says |
|---|---|---|
| ***Penstemon digitalis*** | Mid-Atlantic | **INTRODUCED in all ten states.** Kew puts its native range in the central US and treats the east as adventive. Both societies recommend it. The strongest finding here. |
| ***Achillea millefolium*** | PNW, both Californias | **ABSENT.** The old yarrow question: *A. millefolium* proper is Eurasian and the American plants are usually treated as var. *occidentalis*. Both societies recommend it in all three regions. |
| *Solidago speciosa*, *Campanula rotundifolia*, *Matteuccia struthiopteris* | Michigan | ABSENT. The ostrich fern is now flagged by **two** independent sources, which promotes it from "their gap" to "worth a human". |
| *Passiflora suberosa* | South Florida | ABSENT, against Florida sources that call it native. |
| *Sesleria caerulea* | French Alps | ABSENT; Kew may be treating the French plant as *S. albicans*. |
| *Andropogon gerardii* | Mid-Atlantic | Not a range finding — Kew's accepted spelling is ***gerardi***, one `i`. A name to reconcile. |
| *Sambucus nigra* subsp. *caerulea* | both Californias | **INCONCLUSIVE, and the script says so.** Kew has no such name; its accepted name for the American blue elder is *Sambucus cerulea*. Asking at species rank would have returned the *European* elder and a confident, wrong ABSENT. |

Nothing has been changed on the strength of these. They are editorial
questions, and a disagreement between Kew and a regional flora is a real thing
to weigh, not a bug to smooth over — the same call
[`wcvp/README.md`](../data/sources/wcvp/README.md) already records for Ireland's
Lusitanian element.

## The academic column, checked

The ledger listed OregonFlora, Jepson, Calflora, the Atlas of Florida Plants and
the Burke Herbarium as *referenced* and said each "would be a genuine third
opinion in the region that needs it most". They were checked on 2026-09-21.
Only one of them turned out to be both reachable and finer-grained than what we
already have, and it is not an academic source at all.

| Source | Reachable | Grain it offers | Verdict |
|---|---|---|---|
| **USDA PLANTS county distribution** | **yes** | **county** | **The one real upgrade.** Public domain, and already named in DATA_SOURCES as the intended answer |
| Calflora | yes | state | No finer than Kew. Its taxon page says "native to California" and stops; the counties on it are the map's clickable labels, not the plant's range |
| Atlas of Florida Plants | yes | county, with native/non-native/endemic per taxon | The right source for Florida, behind an ASP.NET search form — VIEWSTATE POSTs and no name→id route. Possible, not cheap |
| OregonFlora | yes, as a shell | — | A JavaScript application; the page is 3 KB of loader and the Symbiota API paths answer 404/403 |
| **Jepson eFlora** | **no — declines bots** | bioregion, the best grain in California | **Not attempted.** See below |
| Burke Herbarium | no | — | Unreachable from here even after the allowlist change |

### Jepson: asked us not to, in as many words

Jepson would have been the best of them — its bioregions (`CCo`, `SCo`, `SnFrB`)
are sub-state and land close to our two California regions. It sits behind a
Cloudflare Turnstile whose page says:

> Recent automated website traffic has affected the performance of the Jepson
> eFlora.

That is not an obstacle to route around; it is a herbarium telling us its
servers are hurting. Calscape said the same thing with a bare 403. Both are now
arguments for the outreach work in [`outreach/`](outreach/playbook.md) rather
than for a cleverer scraper — UC Berkeley and CNPS both publish contact
addresses, and a project that asks is likelier to get a data dump than one that
hammers a public endpoint.

### USDA PLANTS county distribution — found, not yet built

`DATA_SOURCES.md` has said since the BONAP row was written that "Phase 2 should
use USDA PLANTS county data (public domain) for county resolution". The endpoint
exists and answers; it is undocumented, and the key that unlocks it is
`masterId` — the numeric `Id` from a plant's profile, not its symbol:

```sh
# 1. symbol → id
curl 'https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=QUAL'   # → Id 70172
# 2. id → county distribution, as CSV
curl -X POST 'https://plantsservices.sc.egov.usda.gov/api/PlantProfile/getDownloadDistributionDocumentation' \
  -H 'content-type: application/json' -d '{"masterId":70172}'
# Symbol,Country,State,State FIP,County,County FIP  → 1,495 rows for white oak
```

Every other payload shape tried (`Symbol`, `plantId`, `Ids`, `symbols`) returns
the CSV header and no rows — which looks exactly like "this plant has no
distribution" and is why this is written down rather than rediscovered.

**What it would and would not settle.** It is a *distribution*, not a native
status: USDA records native status at lower-48 level, and the counties say where
the plant occurs. So it cannot tell a county where a plant is introduced. What
it can do is tighten the claim where our authority is weakest — "Kew says native
in California" plus "USDA records it in Los Angeles, Orange and San Diego
counties" is a far closer statement about a Los Angeles garden than the first
half alone, and the same for Florida.

**The work it needs** is a county list per region, written by hand, and an
honest note where a county straddles the line — San Bernardino and Riverside are
half cismontane and half desert, which is precisely the boundary the Southern
California region draws its box to exclude.

## The rule, going forward

A new region ships when it has **three kinds of source, one of them a botanical
authority that a script can re-ask.** `npm run native:check -- --region <id>` is
that check; a region absent from its `TDWG_AREA` table is a region standing on
sources nobody can re-ask.
