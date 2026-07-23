// Reference check for the Grove availability adapters (`src/lib/availability.ts`).
//
// This repo has no test runner by design; integrity is enforced by small,
// runnable audits (see `lib/wildlife.ts`'s dev audit). This is that pattern for
// the availability adapters: feed each one a real-shaped fixture and assert the
// normalized output.
//
//   npm run check:availability
//
// Plain JS + Vite's ssrLoadModule (via _load-ts.mjs) so it runs on any Node
// version without native TypeScript support. It exercises the three feed shapes
// a real nursery already publishes — a Lightspeed/Google Shopping XML feed,
// schema.org Product JSON-LD, and a Shopify products.json — and proves they
// collapse to one taxon-keyed record.
import { openLoader } from "./_load-ts.mjs";

const loader = await openLoader();
const {
  extractJsonLd,
  extractBinomialCandidates,
  offersFromJsonLd,
  offersFromGoogleShoppingXml,
  offersFromShopifyProducts,
  resolveTaxon,
  detectPlatform,
  readerFor,
} = await loader.load("/src/lib/availability.ts");
// The registry validator that lets an adapter mine a binomial out of a
// storefront's free-text name safely (see the live-data section below).
const { taxonRefFor } = await loader.load("/src/lib/registry.ts");
await loader.close();

const ctx = { nurseryId: "gonatives", observedAt: "2026-07-21T00:00:00Z" };

let failures = 0;
function check(label, cond, detail) {
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

// --- Live GoNatives regression fixtures --------------------------------------
// Captured verbatim from https://gonativesnursery.company.site (an Ecwid Instant
// Site). These froze the two bugs a live test surfaced: the store was misfiled
// as Lightspeed (→ a Google feed it never emits), and its "Common, Qualifier
// Genus species" naming defeated the binomial resolver. This section proves the
// real pipeline: detect Ecwid, floor to JSON-LD, and resolve identity through
// the registry — reporting every miss instead of dropping it.

// Ecwid stamps a "Made with Lightspeed" footer, so it must be caught BEFORE the
// Lightspeed marker or it misroutes.
const ecwidHome = '<html id="ecwid_html"><meta name="generator" content="ec-instant-site">' +
  '<a href="https://lightspeedhq.com/">Made with Lightspeed</a><script src="//app.ecwid.com/script.js"></script></html>';
check("live/detect: Ecwid Instant Site (not Lightspeed)", detectPlatform({ html: ecwidHome }) === "ecwid", detectPlatform({ html: ecwidHome }));
check("live/dispatch: Ecwid → schema-jsonld floor", readerFor("ecwid").adapter === "schema-jsonld");

// Free-text name mining: the registry, not a regex, confirms the binomial.
check("live/extract: pulls trailing binomial from a common-name-led title",
  extractBinomialCandidates("Willow, Scouler's Salix scouleriana").includes("Salix scouleriana"));
check("live/extract: offers a hyphen-joined variant (uva ursi → uva-ursi)",
  extractBinomialCandidates("Kinnikinnick Arctostaphylos uva ursi").includes("Arctostaphylos uva-ursi"));
check("live/extract: a Title-Cased common name is not mistaken for a binomial",
  extractBinomialCandidates("Coyote Brush").length === 0);

// Real product JSON-LD, run through the JSON-LD adapter with the registry wired
// in. `name` is passed as both hint fields (as the adapter does) — the resolver
// must not let the doubled possessive ("Scouler's … Scouler's") trip the
// cultivar guard.
const liveUnresolved = [];
const liveCtx = {
  nurseryId: "gonatives",
  observedAt: "2026-07-22T00:00:00Z",
  resolveKnown: taxonRefFor,
  onUnresolved: (u) => liveUnresolved.push(u),
};
const liveProduct = (name, sku, price, url) => ({
  "@type": "Product", name, sku,
  offers: { "@type": "Offer", price, priceCurrency: "USD", availability: "http://schema.org/InStock", url },
});

// A species our seed catalog covers → resolves (registry-confirmed embedded binomial).
const salix = offersFromJsonLd(
  [liveProduct("Willow, Scouler's Salix scouleriana", "10631 - Base", "45.0", "/products/Willow-Scoulers-Salix-scouleriana-p794803653")],
  liveCtx);
check("live/resolve: registry-confirmed species resolves (not dropped as cultivar)", salix.length === 1, salix);
check("live/resolve: canonical taxon + in-stock + price", salix[0]?.taxon.scientificName === "Salix scouleriana" && salix[0]?.offer.availability === "in_stock" && salix[0]?.offer.priceUSD === 45, salix[0]);
check("live/resolve: mined-from-free-text is medium confidence", salix[0]?.match.confidence === "medium", salix[0]);

// A cultivar → dropped, and reported as such.
const magnus = offersFromJsonLd([liveProduct("Coneflower, Purple Echinacea purpurea 'Magnus'", "12050 - Base", "19.0", "/x")], liveCtx);
check("live/reconcile: cultivar is dropped", magnus.length === 0, magnus);
check("live/reconcile: cultivar drop is reported with reason", liveUnresolved.at(-1)?.reason === "cultivar", liveUnresolved.at(-1));

// A real binomial our small catalog doesn't cover → dropped, but reported with
// the parsed name so the nursery (or we) can reconcile it. This is the feedback
// loop, not a silent miss.
const vaccinium = offersFromJsonLd([liveProduct("Huckleberry, Evergreen Vaccinium ovatum", "10528 - Base", "39.0", "/y")], liveCtx);
check("live/reconcile: uncovered taxon is dropped", vaccinium.length === 0, vaccinium);
check("live/reconcile: reports not-in-registry + the binomial we saw",
  liveUnresolved.at(-1)?.reason === "not-in-registry" && liveUnresolved.at(-1)?.candidateBinomial === "Vaccinium ovatum",
  liveUnresolved.at(-1));

// --- One-record shape (doc §4.2) ---------------------------------------------
const sample = g[0];
check(
  "shape: every offer is taxon-keyed + dated",
  !!sample && !!sample.taxon.scientificName && !!sample.offer.observedAt && sample.nurseryId === "gonatives",
  sample,
);

console.log(`\n${failures === 0 ? "All checks passed." : failures + " check(s) failed."}`);
process.exit(failures === 0 ? 0 : 1);
