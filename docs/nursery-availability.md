# Where to buy it

*Status: research and a prototype. Nothing here is wired into the app.*

The question: once Indigene says *plant this*, who near the reader has it?

**Short answer: don't build a new system for it.** PlantAgents Collective
already tracks which of 528 US nurseries list which plant, and is actively
rebuilding it. Indigene should read that, link the regional finders, and offer
PlantAgents the one thing it lacks: whether a plant is **in stock**, and at
what price.

This replaces an earlier draft that proposed an open protocol ("Grove") with
its own discovery file and a demand loop. The survey below is why it was
dropped.

## What already exists

| Effort | Where | Per-plant sellers | In stock? | Open to other apps |
|---|---|---|---|---|
| **PlantAgents Collective** (feeds Choose Native Plants) | 528 nurseries, ~45 states | ✓ | ✗ listed or not | ✓ open endpoints, no CORS |
| **Calscape** (California Native Plant Society) | CA | ✓ | as each nursery posts it | ✗ behind a Cloudflare challenge |
| **PlantRealFlorida** (FANN) | FL | ✓ name, phone, city, pot size | ✗ "call for availability" | ✗ pages by numeric id |
| **Garden for Wildlife** (NWF, beside Tallamy's Native Plant Finder) | US, ships by ZIP | sells its own | ✓ its own | ✗ |
| **Xerces Society directory** + Milkweed Finder | Canada, US, Mexico | milkweeds only | ✗ | ✗ |
| **NYC Greenbelt Native Plant Center** | one nursery | ✓ | ✓ quantity | ✓ open dataset |
| Homegrown National Park, Wild Ones, Audubon, NPIN, state societies | US | ✗ businesses only | ✗ | ✗ |

Joey Santore's work (his channel, *Kill Your Lawn*, Thornscrub Sanctuary) has
no sourcing tool; he's an audience for this, not prior art.

Three findings change the plan:

- **PlantAgents is active and was rebuilt in 2026.** The public
  `retail-plant-catalog` repo is the old system. Since July 2026 Choose
  Native Plants syncs weekly from a newer PlantAgents database (not public):
  dated, human-approved inventory snapshots per nursery, a product link per
  offering, local vs. mail-order vendors. Zach Leahan made 33 commits to
  Choose Native Plants in July alone.
- **Its data is reachable, keyed the way we key.** `POST /get-vendors` with a
  ZIP and a scientific name returns nearby nurseries listing the plant;
  `/plants/<scientific name>` is the plant page; `/api/v1/plantagents-sync-status`
  reports freshness. None send a CORS header, so a browser can't call them.
- **Garden for Wildlife already runs the demand loop.** Fall pre-orders tell
  its regional growers what to grow. It's closed and one retailer's, but it
  shows the idea works without us.

## The gap that's left

1. **Stock and price.** An offering records that a nursery listed a plant,
   not whether it's on the bench or what it costs. The old crawler
   regex-counted names in pages, PDFs and spreadsheets; the new schema still
   has no stock or price field.
2. **Coverage and freshness.** See the GoNatives trial below. And the sync
   status read 2026-07-14 on 2026-10-13: three months without a successful
   weekly sync.
3. **Outside the US.** Nothing above covers Ireland, France, Auckland or
   Kantō. We haven't surveyed those countries' own tools yet.
4. **An open demand signal.** Only closed ones exist. Not worth building until
   the rest are settled; it needs a server and growers who want it.

## What Indigene should do

1. **Link the regional finders.** A "where to buy" line per region, the way
   `data/societies.ts` lists societies: Calscape for the two California
   regions, PlantRealFlorida for Florida, Choose Native Plants for the
   Mid-Atlantic. Choose Native Plants deep-links per plant by scientific name;
   PlantRealFlorida needs a name → id table; Calscape couldn't be checked.
2. **Read PlantAgents for US plants.** Ask first; it's their data and their
   server. Then call it from a server or snapshot it at build time.
3. **Offer stock and price upstream.** The readers below get both from the
   structured data storefronts already publish for Google. Added to
   PlantAgents' snapshots, every app using it would get them. The old repo is
   GPL-3.0; ask how the new one is licensed.

**Not doing:** a `/.well-known` discovery file (no nursery would publish it
for one app), a crawler or availability service of our own, or the demand
loop.

## The prototype

`app/src/lib/availability.ts`, tested by `availability.test.ts`. It reads three
shapes storefronts already emit, so one reader covers every store on a
platform:

| Platform | What it reads |
|---|---|
| Shopify | public `/products.json` (`available` per variant) |
| Lightspeed eCom | the Google Shopping feed (`g:availability`, `g:price`) |
| Ecwid, Square, hand-built | `schema.org/Product` + `Offer` JSON-LD on product pages |

Each listing resolves to a registry taxon (USDA `Symbol` and GBIF key) or is
reported with a reason — `cultivar`, `not-in-registry` (with the binomial it
saw), or `no-binomial` — so a nursery can fix a name instead of vanishing.

Run against the live GoNatives store (Ecwid, 398 products), the first pass
resolved **none**. Two fixes, both now pinned by tests:

- Ecwid stores stamp a "Made with Lightspeed" footer, so they were read as
  Lightspeed and sent to a Google feed they don't have. Ecwid is now detected
  first and read through its JSON-LD.
- GoNatives writes names as `Coneflower, Purple Echinacea purpurea 'Magnus'`,
  binomial last. The reader now pulls `Genus species` out of free text and
  accepts it only if the registry has that species.

Ecwid writes its JSON-LD only after the page's script runs, so a plain fetch
sees nothing; `npm run availability:live` renders pages in Chromium to read a
real store through the same code.

A 15-page sample on 2026-10-10 resolved 5 with stock and price, refused 2
cultivars and reported 8 species the registry lacks. Two misses are ours:
*Mahonia aquifolium* isn't matched to the registry's *Berberis aquifolium*
(no synonyms yet), and a lowercase genus ("sisyrinchium idahoense") is
reported as "Idaho blue-eyed".

## The GoNatives trial (2026-10-13)

The full catalog, 397 products, read through the readers and compared with
what PlantAgents returns for GoNatives (`/get-vendors`, ZIP 98177, 5 miles):

| | Count |
|---|---|
| Resolved to a registry species, with stock and price | 116 (74 in stock, 42 out) |
| Refused as cultivars | 42 |
| Real binomials the registry lacks | 211 |
| No binomial in the name | 13 |
| Pages that didn't render | 15 |
| Of the 116, PlantAgents lists GoNatives for | 14 |
| …of which the store says are out of stock | 2 (*Ribes sanguineum*, *Morella californica*) |
| In stock at GoNatives, not listed by PlantAgents | 62 |

PlantAgents links GoNatives' home page, not the product (`isDirectPlantLink:
false`). Some of the 62 may be species PlantAgents' plant list lacks; its own
sync reports 79 unmatched names.

