// Reference check for the Grove availability adapters (`src/lib/availability.ts`).
//
// This repo has no test runner by design; integrity is enforced by small,
// runnable audits (see `lib/wildlife.ts`'s dev audit). This is that pattern for
// the availability adapters: feed each one a real-shaped fixture and assert the
// normalized output. Run it with Node's type stripping (Node >= 22.6):
//
//   node --experimental-strip-types app/scripts/check-availability.ts
//
// It exercises the three feed shapes a real nursery already publishes — a
// Lightspeed/Google Shopping XML feed, schema.org Product JSON-LD, and a
// Shopify products.json — and proves they collapse to one taxon-keyed record.

import {
  extractJsonLd,
  offersFromJsonLd,
  offersFromGoogleShoppingXml,
  offersFromShopifyProducts,
  resolveTaxon,
  detectPlatform,
  readerFor,
  type CanonicalOffer,
} from "../src/lib/availability.ts";

const ctx = { nurseryId: "gonatives", observedAt: "2026-07-21T00:00:00Z" };

let failures = 0;
function check(label: string, cond: boolean, detail?: unknown) {
  const mark = cond ? "  ok" : "FAIL";
  if (!cond) failures++;
  console.log(`${mark}  ${label}${cond ? "" : `  → ${JSON.stringify(detail)}`}`);
}

// --- Fixture 1: Google Shopping XML, as Lightspeed eCom emits (GoNatives) -----
const googleXml = `<?xml version="1.0"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
  <item>
    <g:id>1001</g:id>
    <g:title>Oregon White Oak</g:title>
    <g:mpn>Quercus garryana</g:mpn>
    <g:price>18.00 USD</g:price>
    <g:availability>in stock</g:availability>
    <g:size>1 gal</g:size>
    <g:link>https://gonatives.example/products/oregon-white-oak</g:link>
  </item>
  <item>
    <g:id>1002</g:id>
    <g:title>Dwarf Firebush</g:title>
    <g:price>12.00 USD</g:price>
    <g:availability>out of stock</g:availability>
    <g:link>https://gonatives.example/products/dwarf-firebush</g:link>
  </item>
</channel></rss>`;

const g = offersFromGoogleShoppingXml(googleXml, ctx);
check("google-xml: keeps the true species, drops the cultivar", g.length === 1, g);
check("google-xml: resolves binomial from g:mpn", g[0]?.taxon.scientificName === "Quercus garryana", g[0]);
check("google-xml: 'in stock' → in_stock", g[0]?.offer.availability === "in_stock", g[0]);
check("google-xml: price + form parsed", g[0]?.offer.priceUSD === 18 && g[0]?.offer.form === "1 gal", g[0]);
check("google-xml: high-confidence (explicit binomial)", g[0]?.match.confidence === "high", g[0]);

// --- Fixture 2: schema.org Product JSON-LD, as a product page embeds ----------
const productHtml = `<html><head>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Butterfly Weed",
 "url":"https://gonatives.example/products/butterfly-weed",
 "offers":{"@type":"Offer","price":"9.50","priceCurrency":"USD",
           "availability":"https://schema.org/InStock"}}
</script></head><body>…</body></html>`;

const j = offersFromJsonLd(extractJsonLd(productHtml), ctx);
check("json-ld: extracts one product offer", j.length === 1, j);
check("json-ld: common name → alias → binomial", j[0]?.taxon.scientificName === "Asclepias tuberosa", j[0]);
check("json-ld: schema.org/InStock → in_stock", j[0]?.offer.availability === "in_stock", j[0]);
check("json-ld: name-only match is medium confidence", j[0]?.match.confidence === "medium", j[0]);

// --- Fixture 3: Shopify public products.json ---------------------------------
const shopify = {
  products: [
    {
      title: "Coontie",
      vendor: "Zamia integrifolia",
      handle: "coontie",
      variants: [{ title: "1 gal", price: "22.00", available: true }],
    },
    {
      title: "Mystery Fern", // no alias, no binomial → must be dropped
      vendor: "",
      handle: "mystery-fern",
      variants: [{ title: "Default Title", price: "8.00", available: false }],
    },
  ],
};

const s = offersFromShopifyProducts(shopify, ctx);
check("shopify: drops the unresolvable listing", s.length === 1, s);
check("shopify: vendor binomial wins → high confidence", s[0]?.match.confidence === "high", s[0]);
check("shopify: available:true → in_stock", s[0]?.offer.availability === "in_stock", s[0]);

// --- Identity guardrails ------------------------------------------------------
check("identity: bare 'Firebush' resolves (species)", resolveTaxon({ commonName: "Firebush" }) !== null);
check("identity: 'Dwarf Firebush' refused (cultivar)", resolveTaxon({ commonName: "Dwarf Firebush" }) === null);
check("identity: cultivar epithet in binomial refused", resolveTaxon({ scientificName: "Hamelia patens 'Compacta'" }) === null);

// --- Platform detect → dispatch (one adapter per platform, no scraping) ------
check("detect: Shopify via products.json probe", detectPlatform({ productsJsonOk: true }) === "shopify");
check("detect: Lightspeed via CDN marker", detectPlatform({ html: '<link href="https://cdn.shoplightspeed.com/x.css">' }) === "lightspeed");
check("detect: WooCommerce via wp-json marker", detectPlatform({ html: "<link href='/wp-json/'>" }) === "woocommerce");
check("detect: unknown beats a wrong guess", detectPlatform({ html: "<html>hand-built</html>" }) === "unknown");
check("dispatch: Lightspeed → google-shopping-xml", readerFor("lightspeed").adapter === "google-shopping-xml");
check("dispatch: unknown → schema-jsonld floor (not scraping)", readerFor("unknown").adapter === "schema-jsonld");

// --- One-record shape (doc §4.2) ---------------------------------------------
const sample: CanonicalOffer | undefined = g[0];
check(
  "shape: every offer is taxon-keyed + dated",
  !!sample && !!sample.taxon.scientificName && !!sample.offer.observedAt && sample.nurseryId === "gonatives",
  sample,
);

console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}`);
process.exit(failures === 0 ? 0 : 1);
