# Where to buy it

*Status: research and a prototype. Nothing here is wired into the app.*

The question: once Indigene says *plant this*, who near the reader has it?

**Short answer: don't build a new system for it.** Mature efforts already
answer "who sells this plant" in California, Florida, Pennsylvania and
Alabama, and one of them publishes open JSON keyed by scientific name. Indigene should link and read those, and
offer the one thing they lack — reading whether a plant is **in stock** — to
the open-source one, rather than run a parallel service.

This replaces an earlier draft that proposed an open protocol ("Grove") with
its own discovery file and a demand loop. The survey below is why it was
dropped.

## What already exists

| Effort | Where | Per-plant sellers | In stock? | Open to other apps |
|---|---|---|---|---|
| **Retail Plant Catalog** (Plant Agents Collective; runs Choose Native Plants) | PA, AL, and online stores | ✓ | ✗ name on site only | ✓ open JSON, and a keyed API |
| **Calscape** (California Native Plant Society) | CA | ✓ | as each nursery posts it | ✗ behind a Cloudflare challenge |
| **PlantRealFlorida** (FANN) | FL | ✓ name, phone, city, pot size | ✗ "call for availability" | ✗ pages by numeric id |
| **Garden for Wildlife** (NWF, beside Tallamy's Native Plant Finder) | US, ships by ZIP | sells its own | ✓ its own | ✗ |
| **Xerces Society directory** + Milkweed Finder | Canada, US, Mexico | milkweeds only | ✗ | ✗ |
| **NYC Greenbelt Native Plant Center** | one nursery | ✓ | ✓ quantity | ✓ open dataset |
| Homegrown National Park, Wild Ones, Audubon, NPIN, state societies | US | ✗ businesses only | ✗ | ✗ |

Joey Santore's work (his channel, *Kill Your Lawn*, Thornscrub Sanctuary) has
no sourcing tool; he's an audience for this, not prior art.

Two findings change the plan:

- **Choose Native Plants already has the read Indigene wants, keyed the way
  we key.** `choosenativeplants.com/api/v1/plants/<scientific name>` is open
  JSON with the USDA symbol, the local nurseries carrying the plant, and
  online stores with links to the product page (*Asclepias tuberosa*: 23
  local, 5 online). The plant page is `/plants/<scientific name>`. It sends no
  CORS header, so the browser can't call it; a build-time snapshot or
  `server/` can. Behind it, Retail Plant Catalog's keyed API answers "vendors
  near this ZIP" (`FindVendorsForPlantName`).
- **Garden for Wildlife already runs the demand loop.** Fall pre-orders tell
  its regional growers what to grow, so they aren't left with unsold plants.
  It's closed and one retailer's, but it shows the idea works without us.

## The gap that's left

1. **Stock, not mentions.** Retail Plant Catalog's crawler regex-counts plant
   names in a nursery's pages, PDFs and spreadsheets (`SavvyCrawler/`,
   `TermCounter.cs`). A sold-out plant, or one named in a blog post, counts
   the same as one on the bench. It also can't tell a cultivar from the
   species.
2. **Most of Indigene's regions.** Nothing above covers the Pacific Northwest,
   North Michigan, the St. Lawrence, Ireland, France, Auckland or Kantō. We
   haven't surveyed those countries' own tools yet; do that before building
   anything for them.
3. **An open demand signal.** Only closed ones exist. Not worth building until
   1 and 2 are settled; it needs a server and growers who want it.

## What Indigene should do

1. **Link the regional finders.** A "where to buy" line per region, the way
   `data/societies.ts` lists societies: Calscape for the two California
   regions, PlantRealFlorida for Florida, Choose Native Plants for the
   Mid-Atlantic. Choose Native Plants deep-links per plant by scientific name;
   PlantRealFlorida needs a name → id table; Calscape couldn't be checked.
2. **Read Choose Native Plants for US plants.** Ask Plant Agents Collective
   first — it's their data and their server. Then snapshot the per-plant
   record at build time, or call it (or their keyed ZIP API) from `server/`.
3. **Offer the stock readers upstream.** The prototype below reads stock from
   the structured data storefronts already publish for Google. Ported into
   Retail Plant Catalog's crawler, it would give every app using it "in stock",
   not just "mentioned". The repo has no license file yet; ask about that
   before sharing code.

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
