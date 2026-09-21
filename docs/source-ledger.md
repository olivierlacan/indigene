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
  the Mojave. Calscape would fix this and sits behind a Cloudflare bot
  challenge; Jepson is reachable and not yet harvested.
- **The academic column is referenced, not machine-checked**, everywhere except
  the Wildflower Center. OregonFlora, Jepson and the Atlas of Florida Plants are
  all reachable and would each be a genuine third opinion in the region that
  needs it most.
- **USDA PLANTS is referenced, not re-asked.** Its API answers per-plant
  profiles but the state-level distribution endpoint did not respond to the
  obvious shapes; the governmental column is the weakest machine-checked one.

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

## The rule, going forward

A new region ships when it has **three kinds of source, one of them a botanical
authority that a script can re-ask.** `npm run native:check -- --region <id>` is
that check; a region absent from its `TDWG_AREA` table is a region standing on
sources nobody can re-ask.
