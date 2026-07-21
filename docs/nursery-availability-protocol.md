# Nursery availability: an open protocol proposal

*Status: design proposal / prototype. Nothing here is wired into the app yet.
It exists to answer one question — "how does a local nursery tell Indigene
users it has (or will grow) the plants on our lists?" — and to propose a way to
do it that any app, not just Indigene, can share.*

## The short answer

**There is no open, machine-readable protocol for native-plant availability
today.** There is one open-source aggregator worth building *with* rather than
around — **Plant Agents Collective's Retail Plant Catalog** — but it reads
whatever a nursery happens to post (a PDF, a spreadsheet, a web page) and
normalizes it centrally. It is a scraper-aggregator, not a standard the
storefront emits. And nothing anywhere closes the loop the other direction:
there is no open way for a would-be buyer's *demand* ("I want an Oregon white
oak, I'm in 97214") to reach a grower who could contract-grow it.

Good news, and the reason this is tractable: **nurseries already publish
machine-readable stock — they just publish it for Google, not for us.** Almost
every storefront platform emits a product feed (for Google Shopping / Merchant
Center) and structured `schema.org/Product` + `Offer` data (for search rich
results) that carries the two facts we need: *what plant* and *in stock or not*.
The work is not to make nurseries hand-maintain a new file. It is to define a
thin, discoverable **profile** over data they already produce, plus a botanical
identity key so "the same plant" means one thing across a hundred storefronts.

This document proposes that protocol. Working name: **Grove**.

---

## 1. What exists today

### Directories (human-readable, no live stock)
- **FANN / PlantRealFlorida** — the Florida Association of Native Nurseries runs
  a plant finder and a nursery/service directory; clicking a plant shows which
  member nurseries carry it. It's the best regional example in the country, but
  it's Florida-only, member-scoped, and its own maintainers describe the sites
  as "old and fragile." No open feed out. (This is the "FAAN" the brief
  mentioned; the org's initialism is **FANN**, and it's already a citation
  source for our Florida seed data — see `DATA_SOURCES.md`.)
- **Audubon Native Plants Database** — ZIP-code → bird-friendly natives, with a
  "find local nurseries near you" list. The nursery list is a directory of
  businesses, not their inventories; the site tells you to *call ahead to verify
  availability*. That caveat is the whole problem in one sentence.
- **PlantNative, Homegrown National Park, Grow Native Massachusetts, and dozens
  of state native-plant societies** — all publish nursery *directories*. None
  publish live stock.

### The one real open-source effort
- **Plant Agents Collective — Retail Plant Catalog**
  (`github.com/CodeForPhilly/retail-plant-catalog`, a 501(c)(3), C#/.NET crawler
  + Vue frontend). It ingests a nursery's inventory in *whatever form it's
  posted* — Excel, Google Sheet, PDF, or a web page — so long as it lives at a
  stable URL, normalizes it centrally, and serves it to consuming apps. It
  already powers **ChooseNativePlants.com** (Pennsylvania, ~24 all-native
  nurseries) and **Choose Native Plants AL** (Alabama). This is the closest
  thing to prior art, and the right project to align with.

  Its limitation is architectural: because it accepts *anything at a URL*, the
  hard, brittle work (parsing, name-matching, freshness) is all centralized and
  per-nursery-bespoke. There's no contract the storefront honors, so every new
  nursery is a new scraping problem, and "in stock right now" is only as fresh
  as the last crawl of a hand-updated PDF.

### Contract growing (grow-on-demand) — entirely manual
Many native nurseries (Archewild, American Native Plants, Carolina Native,
Dropseed, Pure Air Natives…) offer **contract growing**: commit to a quantity
with a 3–24 month lead time and they'll grow it. This is exactly the mechanism
that would let a small buyer get a plant no one stocks — but today it's a phone
call and a spreadsheet, nursery by nursery. **No system aggregates demand across
buyers to make a grow decision economic.** This is the biggest open gap, and the
most ambitious thing worth building.

### The takeaway
```
                     live stock feed   identity key   demand → grower
FANN / PlantReal FL        ✗ (site)         ✗               ✗
Audubon                    ✗ (directory)    ✗               ✗
Retail Plant Catalog       ~ (crawled)      ~ (names)       ✗
Grove (this proposal)      ✓ (emitted)      ✓ (USDA/GBIF)   ✓
```

---

## 2. Why it's hard (the three real problems)

1. **Identity.** Nurseries list plants by common name ("Firebush", "Dwarf
   Firebush") and sometimes a genus. "The same plant" has to resolve to one
   stable key or matchmaking is guesswork. Indigene has *already* chosen the
   answer for its own catalog scaling (`DATA_SOURCES.md` → "Scaling the
   catalog"): **USDA PLANTS `Symbol`** (e.g. `QUGA4`) as the U.S. per-plant key
   and **GBIF `usageKey`** as the global reconciliation hub. The protocol keys
   on the same spine, so a nursery offer and an Indigene plant are the same
   object by construction.

2. **Heterogeneous storefronts.** GoNatives runs **Lightspeed**; the next
   nursery runs Shopify, the next WooCommerce, the next Square, the next a
   hand-built HTML page. A protocol that requires one platform is dead on
   arrival. Grove must meet each where it already is (§3).

3. **Direction.** Every existing effort is supply → seeker (find who has it).
   The valuable, missing half is seeker → grower (tell growers what people
   near them want, so grow-on-demand becomes a data-driven decision). Grove
   defines both.

---

## 3. The key insight: nurseries already emit machine-readable stock

You looked at GoNatives on Lightspeed and (correctly) saw no obvious RSS or JSON
catalog. But "no obvious feed on the page" is not "no feed." Here's what each
common platform *already* produces, with zero new work from the nursery:

| Platform | Already-machine-readable surface | Effort for nursery |
|---|---|---|
| **Shopify** | Public `/{store}/products.json` and `/collections/<h>/products.json` — no auth, full variants + `available` boolean. Plus `Product`/`Offer` JSON-LD on every product page. | **None.** It's already on. |
| **Lightspeed eCom** (GoNatives) | A **Google Shopping XML feed** the merchant generates in-admin (a stable URL, regenerated ~every 5 h) carrying `g:id`, `g:title`, `g:price`, `g:availability`. Plus `Product`/`Offer` JSON-LD on product pages. | One-time: turn on the feed, paste its URL into `/.well-known/native-plants.json`. |
| **WooCommerce** | Store API (`/wp-json/wc/store/v1/products`) and any Google-feed plugin's XML. Plus JSON-LD. | Low. |
| **Square Online** | `Product`/`Offer` JSON-LD in product pages; `sitemap.xml` enumerates them. | Low. |
| **Hand-built site / PDF** | `schema.org/Product` JSON-LD if present; else fall back to the Retail-Plant-Catalog approach (crawl the posted list). | Low–medium. |

**The universal floor is `schema.org/Product` + `Offer` JSON-LD**, because
storefronts emit it for Google's rich results whether or not they expose a JSON
API. `availability` is a normalized enum (`https://schema.org/InStock`,
`OutOfStock`, `PreOrder`, `BackOrder`, `Discontinued`). Google Shopping's feed
carries the same fact as `g:availability`. So there are two things almost every
nursery already publishes that we can read: a **feed** (Shopping XML or Shopify
JSON) and **per-page JSON-LD**. Grove standardizes *discovery and reconciliation
over those*, rather than inventing a format nurseries must maintain by hand.

### 3.1 One adapter per *platform*, not per *nursery* — the way out of scraping

The Retail Plant Catalog scrapes because it accepts input per *nursery* (this
one posts a PDF, that one a Google Sheet). That's the trap: N nurseries means N
brittle, hand-tuned parsers, and "in stock" is only as fresh as the last crawl
of a document a human remembered to update. It is, as you put it, doomed to be
out of date.

The escape is that nurseries don't have N structures — they have a handful.
**Every store on a given platform shares that platform's structure**, because the
platform generates it. So the unit of integration is the *platform*, and the
counts invert in our favor:

```
scraping model:            Grove model:
  nursery A  → parser A       Shopify     → 1 adapter → every Shopify nursery
  nursery B  → parser B       Lightspeed  → 1 adapter → every Lightspeed nursery
  nursery C  → parser C       WooCommerce → 1 adapter → every Woo nursery
  …            …              Square/rest → JSON-LD floor → the long tail
  (grows with nurseries)      (fixed, ~4 adapters cover the field)
```

Concretely, three tiers of "read", none of them HTML scraping:

1. **Structured platform endpoint (best).** A documented, stable machine
   contract the platform maintains: Shopify `/products.json`, WooCommerce Store
   API, a Lightspeed-generated Google Shopping feed. Reading these is API
   consumption, not scraping — the platform *intends* them to be read, versions
   them, and keeps them live in sync with the real catalog (Shopify's `available`
   flips the instant stock changes; Lightspeed regenerates ~every 5 h).
2. **Published structured data (floor).** `schema.org/Product` + `Offer` JSON-LD
   embedded for Google. Also a machine contract (Google enforces that it match
   the visible price/stock), present even on hand-built sites. We read the
   `<script type="application/ld+json">` block, never the page chrome.
3. **Posted-list crawl (last resort).** Only for a nursery with no storefront at
   all — the Retail-Plant-Catalog behavior, kept as an explicit fallback so
   Grove degrades to the current state of the art rather than below it.

**The dispatch is: fingerprint the platform once, then use its structured
reader.** Platform fingerprints are stable tells (`cdn.shopify.com`, an
`x-shopify-*` header, `cdn.shoplightspeed.com`, `/wp-json/`), not scraped
content — they identify the *contract*, not the inventory. The reference module
implements this as `detectPlatform()` → `readerFor()`, and `readerFor("unknown")`
returns the JSON-LD floor rather than ever falling to HTML scraping.

The efficiency you were hoping for is real and compounding: onboarding the first
Shopify nursery writes the adapter; the 50th Shopify nursery is a one-line
registry entry. The predictable shared structure is the whole leverage.

---

## 4. Grove, the protocol

Three parts: **discover** the source, **normalize** it to one record, **match**
it both directions.

### 4.1 Discovery — one small well-known file

A nursery (or the platform, or a volunteer on the nursery's behalf) publishes a
manifest at a conventional path:

```
https://gonatives.example/.well-known/native-plants.json
```

```jsonc
{
  "grove": "0.1",
  "nursery": {
    "name": "Go Natives",
    "url": "https://gonatives.example",
    "geo": { "lat": 45.52, "lon": -122.68 },      // coarse, for distance ranking
    "serves": { "radiusMi": 60, "ship": true, "pickup": true }
  },
  "attribution": "Availability © Go Natives; shared for public reuse (CC BY 4.0).",
  "consent": "aggregate-demand",                   // opt-in to the demand loop (§4.3)
  "inventory": [
    {
      "type": "google-shopping-xml",               // adapter to use
      "url": "https://gonatives.example/feeds/google.xml",
      "refresh": "PT5H"                             // how fresh the source is
    }
  ],
  "identity": {
    // Optional but hugely valuable: the nursery's own SKU → botanical key map.
    // When present, matching is exact and instant. When absent, Grove infers
    // it from names (§4.2) at lower confidence.
    "map": "https://gonatives.example/feeds/grove-identity.csv"
  },
  "onDemand": {                                     // the grow-on-demand offer (§4.3)
    "contractGrow": true,
    "leadTimeDays": 180,
    "minQty": 24,
    "contact": "grow@gonatives.example"
  }
}
```

Discovery is also advertised two cheaper ways, so a nursery that can't add a
file to `/.well-known/` can still participate:
- `<link rel="native-plant-inventory" type="application/json" href="…">` in the
  site `<head>`; and
- a `<url>` extension in `sitemap.xml`.

A central, forkable **registry** (a plain JSON/CSV list, MIT, like the Retail
Plant Catalog's nursery list) maps regions → manifest URLs, so an app doesn't
have to discover the whole world — it fetches the manifests for nurseries near
the user's spot. This is where Grove and the Retail Plant Catalog converge: the
registry *is* their nursery list, extended with a manifest URL column.

### 4.2 Normalization — one canonical availability record

Every adapter (§5) reduces its source to the same shape, keyed on the botanical
spine Indigene already uses:

```jsonc
{
  "taxon": {
    "usdaSymbol": "QUGA4",                 // U.S. per-plant key (public domain)
    "gbifKey": 2880539,                    // global reconciliation key (CC BY)
    "scientificName": "Quercus garryana"
  },
  "nurseryId": "gonatives",
  "offer": {
    "availability": "in_stock",            // in_stock | out_of_stock | preorder | on_demand | unknown
    "form": "1 gal",                       // container/size as sold, verbatim
    "priceUSD": 18,                        // optional
    "url": "https://gonatives.example/products/oregon-white-oak",
    "observedAt": "2026-07-20T14:00:00Z"   // when we read it — freshness is honest
  },
  "fulfillment": ["pickup", "ship"],
  "match": { "method": "sku-map", "confidence": "high" }  // how we resolved identity
}
```

**Identity reconciliation pipeline**, best-confidence first:
1. **SKU map** (`identity.map` in the manifest) → exact, `high`.
2. **Scientific name** in the feed/JSON-LD → GBIF backbone match → `high`.
3. **Common name** → curated alias table (our own, MIT) → `medium`, and the
   "dwarf firebush ≠ firebush" cultivar traps get encoded here once.
4. **No confident match** → dropped, never guessed. (Same rule the rest of the
   app lives by: `DATA_SOURCES.md`, "when in doubt it's optional.")

### 4.3 Matchmaking — both directions

**Supply → seeker (retail, available today).** On an Indigene plant page, for
the user's coordinates, fetch nearby manifests, normalize, and show *"Available
now within N miles"* with links straight to the product and an honest
`observedAt` freshness stamp. This is the Retail-Plant-Catalog experience, but
sourced from feeds the storefront emits rather than a central crawl of posted
PDFs.

**Seeker → grower (grow-on-demand, the ambitious half).** This is the piece no
one has built. When a user wants a plant that *no nearby nursery stocks*,
Indigene offers a one-tap, **opt-in, anonymized** "I'd plant this" signal:

```jsonc
// A demand pledge. No account, no PII. Coarse location only.
{
  "taxon": { "usdaSymbol": "QUGA4" },
  "geohash": "c20f",            // ~± 20 km cell — enough to route, not to identify
  "qty": 1,
  "form": "any",
  "pledgedAt": "2026-07-21"
}
```

Pledges aggregate into a **demand map** — "37 people within this ecoregion want
*Asclepias tuberosa* this fall" — that any grower with `consent:
aggregate-demand` can subscribe to. Now a nursery's contract-grow decision is a
data-driven one, and the classic native-plant chicken-and-egg ("nobody grows it
because nobody asks; nobody asks because nobody grows it") gets a feedback loop.
This is the part worth pioneering, and it's a natural fit for the optional
Hanami server (`server/`), which is the only place in the stack that would hold
any shared state.

Privacy is load-bearing and matches the app's ethos: pledges are opt-in, carry
no identity, coarsen location to a geohash cell before they ever leave the
device, and expire. The demand map is public and aggregate — a public good for
growers, not a lead list.

---

## 5. Adapters (the interop layer)

Each adapter is a pure function `source → CanonicalOffer[]`, selected by
`detectPlatform()` → `readerFor()` (§3.1) so a nursery is read through its
platform's structured surface, never scraped. A reference implementation of the
first three adapters plus the platform detector lives in
`app/src/lib/availability.ts` and is exercised by
`app/scripts/check-availability.ts` against real-shaped fixtures
(`node --experimental-strip-types app/scripts/check-availability.ts`).

| Adapter | Reads | Notes |
|---|---|---|
| `schema-jsonld` | `schema.org/Product`+`Offer` JSON-LD from a product page | **The universal floor.** Works on Shopify, Lightspeed, Square, Woo, hand-built. |
| `google-shopping-xml` | RSS 2.0 feed with `xmlns:g` (`g:availability`, `g:price`, `g:link`) | **The Lightspeed answer** — GoNatives can emit this today. |
| `shopify-products-json` | public `/products.json` (`variants[].available`) | Zero nursery effort where present. |
| `woo-store-api` | `/wp-json/wc/store/v1/products` | WooCommerce. |
| `posted-list` (future) | crawl a PDF/sheet/page at a URL | The Retail-Plant-Catalog fallback, for nurseries with no storefront. |

All adapters run best-effort and degrade to `[]` on any failure, so no nursery's
outage or format quirk can break a plant page — the same contract every live
source in `lib/site.ts` already honors.

---

## 6. How Indigene consumes it

- **Attach point:** the plant detail page (`app/src/steps/plant.ts`) already has
  deep-linkable sections (`ecosystem`, `propagation`, `spot`); a `where-to-get`
  section slots in beside them, registered in that file's `SECTIONS` array.
- **Offline-first:** the section is additive and optional. Offline or with no
  manifests nearby, it simply doesn't render — the core "what to plant here"
  flow never depends on it.
- **CORS / keys:** browser fetches of third-party feeds will hit CORS. The
  optional **Hanami server** (`server/`) already exists precisely to proxy
  third-party data server-side (it does this for site data today); it's the
  natural home for the manifest fetcher, the demand-map store, and a nightly
  normalize job.
- **Licensing:** MIT for the spec and code, matching the repo's rationale
  (`DATA_SOURCES.md`, "Why MIT") — the point is the widest possible reuse by
  land trusts, native-plant societies, and other apps, including the Retail
  Plant Catalog itself.

---

## 7. Relationship to prior art — extend, don't compete

The honest move is not to launch a rival directory. It's to contribute two
things upstream to **Plant Agents Collective / Retail Plant Catalog**, which
already has nurseries, apps, and a nonprofit behind it:

1. **The discovery + emission convention** (`/.well-known/native-plants.json` +
   the `schema.org`/Shopping-feed adapters), so their catalog can ingest a
   *contract the storefront honors* instead of scraping a posted PDF — fresher
   data, less bespoke parsing per nursery.
2. **The demand loop** (§4.3), which nobody has, and which turns a find-it
   catalog into a grow-it network.

Grove is the protocol; their catalog can be a reference server and registry for
it. Indigene is one client.

---

## 8. Phased plan

- **P0 — spec + reference adapters (this doc + `availability.ts`).** Prove the
  three feed shapes normalize to one record. *Done in this branch.*
- **P1 — read-only retail, one nursery.** Hand-write a manifest for one willing
  nursery (a Lightspeed Google-feed URL is enough), proxy it through `server/`,
  render "available nearby" on one plant page behind a flag.
- **P2 — registry + a handful of nurseries per shipped region**, reusing / merging
  with the Retail Plant Catalog nursery list.
- **P3 — the demand loop.** Opt-in pledges, an aggregate public demand map,
  grower subscriptions. Pilot with contract-growers who already do grow-on-demand.
- **P4 — upstream the convention** to Plant Agents Collective and native-plant
  societies as an open standard.

---

## Sources

- Plant Agents Collective / Retail Plant Catalog — https://www.plantagents.org/ ·
  https://github.com/CodeForPhilly/retail-plant-catalog · https://choosenativeplants.com
- FANN / Plant Real Florida — https://www.fann.org/plants/ · https://www.plantrealflorida.org/
- Audubon Native Plants Database — https://www.audubon.org/native-plants
- Lightspeed eCom Google Shopping feed — https://ecom-support.lightspeedhq.com/hc/en-us/articles/220662827-Google-Shopping
- Shopify public `products.json` — https://shopify.dev/docs/api/admin-rest/latest/resources/product
- schema.org Product/Offer availability — https://schema.org/InStock · https://developers.google.com/search/docs/appearance/structured-data/product
- Google Merchant Center RSS 2.0 feed spec — https://support.google.com/merchants/answer/14987622
- Contract growing (grow-on-demand) — https://archewild.com/native-plant-nurseries/contract-growing/
