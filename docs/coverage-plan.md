# Plan: how each region's list grows, and where the data comes from

Indigene's plant lists are hand-authored, and that is not going to change soon —
every row carries a size-over-time curve, seven eco-scores, honest care and
propagation notes, and a citable basis, and none of that falls out of a database.
But "hand-authored" has been doing too much work as an excuse for *ad hoc*. This
document answers two questions that keep coming up:

1. **Which plants should each region add next?** — a repeatable way to pick,
   rather than whichever species someone thought of.
2. **What open data can carry the load?** — which fields we can compute or
   verify from a source, and which will always be judgment.

It is a plan, not a shipped feature. Nothing here changes the app on its own.

---

## 1. What "enough" looks like for a region

A region's list is not trying to be a flora. It is trying to be the answer to
*"what should I plant in this spot?"* for the great majority of ordinary spots.
Concretely, a region is **complete enough** when:

| Test | Target | Why |
|---|---|---|
| **Every site type has ≥3 options** | dry/mesic/wet × sun/part/shade | A spot with no candidates is the one failure the app cannot talk its way out of. |
| **Every form is represented** | tree, shrub, perennial, grass, vine, groundcover, fern | A gardener who needs a groundcover is not served by fourteen trees. |
| **Every keystone genus present in the region is on the list** | see §2 | These are where most of the food-web value is. Missing one is missing the point. |
| **Every month of the growing season has something in flower** | ~Feb–Oct locally | Nectar gaps are what starve pollinators; the gap months are where a list is thinnest. |
| **Bloom colour and structure vary** | tubular / open / umbel | Different mouthparts. A list of only daisies feeds only short tongues. |
| **A monarch/blues/host analogue exists** | ≥1 obligate-host plant | The specialist relationships are the strongest reason to plant native at all. |

Those are all **computable from the data we already ship**, which means they can
become a script (`npm run coverage`) that prints each region's gaps rather than a
document someone has to re-read.

**That script now exists** — `app/scripts/coverage.mjs`, §4 step 1 below. It
prints the table in this section for every region, joins the European regions
against the committed Gaytán host counts to name the missing genera outright,
and censuses the wildlife layer. The first thing it was pointed at is written up
in [`docs/coverage-gap-pnw-france-atlantic.md`](coverage-gap-pnw-france-atlantic.md).

### Where the eight regions stand today

| Region | Plants | Thinnest categories | Biggest gap |
|---|---|---|---|
| Mid-Atlantic | 40 | ferns 1, vines 2, groundcovers 2 | shade-tolerant perennials |
| Pacific NW | **58** | *every form now ≥3* | October bloom (1); *Ceanothus*, the one absent keystone genus |
| Florida N & C | 23 | **ferns 0**, vines 1 | grasses, a second oak, more perennials |
| Florida S & Keys | 21 | **ferns 0**, perennials 2, vines 1 | perennials, and a real palm/understory set |
| Atlantic France | **46** | *every form now ≥3* | November/December bloom; the wildlife ties for the newest rows |
| Continental France | 22 | **ferns 0, groundcovers 0**, grasses 1 | ferns, groundcovers, wetland plants |
| Mediterranean France | 21 | **ferns 0**, grasses 1, vines 1, groundcovers 1 | shade plants for a north wall; bulbs |
| French Alps | 21 | **ferns 0, vines 0**, grasses 1 | wet-meadow perennials; scree specialists |

The pattern is the same everywhere and worth naming: **we over-index on trees and
shrubs** (they are the easy, charismatic, well-documented end) **and under-index
on grasses, ferns, groundcovers and wetland plants** — which is precisely
backwards from the point of view of a small garden, where almost nobody has room
for a fourteenth tree.

The two bold rows are the two that have since been worked on — see
[`docs/coverage-gap-pnw-france-atlantic.md`](coverage-gap-pnw-france-atlantic.md).
Both now clear every form floor and every site cell, and Atlantic France carries
29 of the top 30 Oceanic-temperate host genera where it carried 9. The other six
regions still read exactly as this table describes, and the Florida lists and
Mediterranean France are in worse shape than either of these two ever were.

---

## 2. How to prioritize the *next* twenty plants

Rank candidates by this, in order. It is deliberately food-web-first, because
that is the app's whole argument.

1. **Keystone genera first.** The National Wildlife Federation / Tallamy keystone
   lists (US, per ecoregion) and the Gaytán matrix's top genera (Europe) identify
   the handful of genera that carry a disproportionate share of the caterpillar
   biomass — oak, willow, cherry, birch, poplar, goldenrod, aster, sunflower,
   blueberry; in Europe add hawthorn, rose, and the trefoils. **If a region's
   list is missing a keystone genus that grows there, that is the next plant.**
   This is how the PNW's showy milkweed, goldenrod and Douglas aster got picked
   over prettier candidates.
2. **Obligate (`sole`) host relationships.** A plant that is the *only* food of a
   recognizable animal buys more ecological value per row than any generalist —
   and it is the most persuasive card in the app. Milkweed/monarch, kidney
   vetch/small blue, strawberry tree/two-tailed pasha, thyme/large blue.
3. **Fill the site-type holes from §1.** A dry-shade plant when the list has none
   beats a fourth sunny meadow perennial with a better host count, because the
   fourth perennial serves nobody the list wasn't already serving.
4. **Fill the bloom-calendar holes.** Late winter and late autumn are where
   nectar gaps kill colonies; they are also where lists are thinnest, because
   those plants are less showy.
5. **Plantability.** A plant nobody can buy, or that only survives in conditions
   a garden can't offer, is a worse row than a slightly less valuable plant
   someone can actually put in the ground. Check availability in the region's
   real nursery trade before writing the row.
6. **Charisma, last but not never.** One memorable plant per region carries the
   Explore page and gives someone a reason to care.

A useful sanity check on the whole exercise: **a region's list should look like
the answer to "what would a good local native-plant nursery stock?"**, not like a
county flora.

---

## 3. The data sources, field by field

This is the practical half. Which of the ~25 fields on a plant row can come from
a source, and which are irreducibly editorial?

### Already integrated (see `DATA_SOURCES.md` for licences and verdicts)

| Field | Source | Status |
|---|---|---|
| `hostLepCount` (US) | NWF Native Plant Finder / Tallamy, genus level | shipped |
| `hostLepCount` (Europe) | **Gaytán et al. 2026** European Lepidoptera–plant matrix, CC-BY, computed by `npm run host-counts` | shipped, computed |
| Native status (US) | USDA PLANTS, OregonFlora, Burke Herbarium (WTU), IRC | shipped, referenced |
| Native status (France) | Tela Botanica BDTFX, INPN (MNHN) | shipped, referenced |
| Ecoregion of a spot | EPA Omernik (US), EEA Biogeographical Regions (Europe) | shipped, live lookup |
| Identity / cross-ids | the registry: IPNI, WFO, GBIF, USDA, ITIS, iNaturalist, Wikidata | shipped |
| Named wildlife ties (US) | BAMONA, Cornell Lab, Xerces, Fowler & Droege | shipped, referenced |
| Named wildlife ties (Europe) | INPN, LPO, the Dryad European butterfly foodplant checklist | shipped, referenced |

### The high-value sources we have identified and **not yet used**

These are the ones worth the next chunk of effort, roughly in order of payoff:

1. **GBIF occurrence density** (CC-BY, machine-readable API).
   *Unlocks:* "is this plant actually common where the region says it is?" — a
   check we currently do by eye. A species with three records in the region is a
   flora entry, not a garden plant. It would also let us **rank candidate
   species automatically**: pull every taxon recorded in the ecoregion, join to
   the host-count table, and the top of that list is a shortlist for §2 step 1.
   This is the single biggest lever available, and it is entirely mechanical.
2. **USDA PLANTS county distributions** (public domain).
   *Unlocks:* county-level native status instead of region-level — the honest
   answer to "native *here*" rather than "native in this box". Explicitly *not*
   BONAP, whose terms forbid it.
3. **Kew WCVP / POWO** (CC BY 4.0) native-range polygons at TDWG level 3.
   *Unlocks:* a global native-status spine, so a ninth region doesn't need a new
   national flora for each row. Already the recommended backbone in
   `DATA_SOURCES.md`; the registry's IPNI anchor exists to make this join
   possible.
4. **DBIF v2** (CEH/BRC, Open Government Licence).
   *Unlocks:* an independent cross-check on the European host counts. Still the
   open item from `docs/host-counts-plan.md` §8 — no shipped number depends on
   it, which is exactly why it is worth running.
5. **GloBI — Global Biotic Interactions** (CC-BY, one big machine-readable
   interaction dump).
   *Unlocks:* the wildlife-ties layer at scale. Today every tie is hand-written;
   GloBI aggregates published plant↔animal interaction records with citations,
   which is the right shape for a *candidate generator* whose output a human
   still checks. It covers far more than Lepidoptera — bees, birds, mammals.
6. **Pollen-specialist bee lists** — Fowler & Droege for the US (already used
   for ties, not yet systematically), and the European equivalents from the
   national bee atlases.
   *Unlocks:* the `pollinator` score, which is currently the least defensible
   number we ship — an informed estimate rather than a derived one.
7. **iNaturalist observations** (CC, already used for the "see it near you"
   feature).
   *Unlocks:* phenology. Bloom start/end months are currently authored from
   floras; observation dates with photos give a real, local, checkable bloom
   window — and the bloom calendar is one of the §1 completeness tests.

### The fields that will stay editorial, and should

No open dataset gives these, and pretending otherwise would be the dishonest
kind of automation:

- **`size` over time and `matureHeightFt`/`matureSpreadFt`.** Nursery tags
  systematically understate mature size; the honest ceiling is a judgement made
  from silvics manuals and local observation. This is one of the app's
  differentiators and it is hand-made.
- **`careNote` / `givesNote` / `nativeNote`.** These are the writing. The whole
  product is "plain language the whole way", and a generated sentence reads like
  a generated sentence.
- **`scores` other than `host`.** Stormwater, erosion, carbon, establishment are
  informed estimates. They should be *labelled* as such (they are, via
  `confidence`) rather than dressed up.
- **`keystone`.** A boolean that means "this genus carries a disproportionate
  share of the food web here" — sourced from the keystone lists, but the call of
  whether a given species in a given region qualifies is ours.
- **The `featuredPlantId`.** An editorial pick, explicitly documented as one.

---

## 4. Suggested order of work

1. ~~**`npm run coverage`** — turn §1's table into a script that prints each
   region's gaps.~~ **Shipped** (`app/scripts/coverage.mjs`). It did make the
   later decisions obvious: see
   [`docs/coverage-gap-pnw-france-atlantic.md`](coverage-gap-pnw-france-atlantic.md),
   which found that the wildlife layer is a bigger and much cheaper gap than the
   plant lists — Atlantic France names an animal for 5 of its 23 plants and
   claims no larval host at all — and that the missing US host table (§3) is the
   one thing blocking step 2 from covering every region.
2. **GBIF candidate generator** — a script that proposes the next N species for a
   region by joining ecoregion occurrences to host counts, for a human to accept
   or reject. This is what makes list growth repeatable instead of heroic.
3. **Fill the thin categories** in the three Florida/France lists that need it
   most, using the ranking in §2.
4. **DBIF cross-check** of the European counts.
5. **GloBI-assisted wildlife ties**, so the browse-by-wildlife layer grows with
   the plant lists rather than lagging them.
6. **Phenology from iNaturalist** to replace authored bloom months.

Steps 1 and 2 are the ones that change the shape of the work. Everything after
them is the same hand-authoring we do now, aimed better.
