// The nursery stock readers: three feed shapes in, one taxon-keyed record out.
//
// Most of what these guard is identity. A reader that calls "Dwarf Firebush"
// firebush, or guesses a species from a bad parse, puts a wrong plant beside a
// nursery's name. So the cases are mostly about declining — a cultivar, a name
// nobody has — and about saying *why*, so the nursery can fix the listing.
//
// Like `registry-core.test.ts`, this builds its own small index instead of
// loading the real registry: the rules are under test, not the catalog. The
// GoNatives cases are real listings from a live Ecwid store, frozen here.
import { describe, it, expect } from "vitest";
import type { RegistryEntry } from "../types";
import { buildIndex, normalizeName, taxonRefFrom } from "./registry-core";
import {
  type AdapterContext,
  type UnresolvedListing,
  detectPlatform,
  extractBinomialCandidates,
  extractJsonLd,
  offersFromGoogleShoppingXml,
  offersFromJsonLd,
  offersFromShopifyProducts,
  readerFor,
  resolveTaxon,
} from "./availability";

function entry(scientificName: string, commonNames: string[], identifiers = {}): RegistryEntry {
  return {
    primaryId: null,
    family: "",
    form: "shrub",
    rank: "species",
    keystone: false,
    cultivarOf: null,
    regions: [],
    commonNames,
    aliases: [...commonNames, scientificName].map(normalizeName),
    identifiers,
    scientificName,
  } as RegistryEntry;
}

const index = buildIndex([
  entry("Salix scouleriana", ["Scouler's Willow"], { usda: "SASC", gbif: "5372513" }),
  entry("Arctostaphylos uva-ursi", ["Kinnikinnick"]),
]);
const resolveKnown = (name: string) => taxonRefFrom(index, name);

const ctx: AdapterContext = { nurseryId: "gonatives", observedAt: "2026-07-21T00:00:00Z" };

describe("Google Shopping XML (Lightspeed eCom)", () => {
  const xml = `<?xml version="1.0"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
  <item>
    <g:id>1001</g:id><g:title>Oregon White Oak</g:title><g:mpn>Quercus garryana</g:mpn>
    <g:price>18.00 USD</g:price><g:availability>in stock</g:availability><g:size>1 gal</g:size>
    <g:link>https://nursery.example/products/oregon-white-oak</g:link>
  </item>
  <item>
    <g:id>1002</g:id><g:title>Dwarf Firebush</g:title><g:price>12.00 USD</g:price>
    <g:availability>out of stock</g:availability>
  </item>
</channel></rss>`;
  const offers = offersFromGoogleShoppingXml(xml, ctx);

  it("keeps the species and drops the cultivar", () => {
    expect(offers).toHaveLength(1);
    expect(offers[0].taxon.scientificName).toBe("Quercus garryana");
  });

  it("reads stock, price and pot size", () => {
    expect(offers[0].offer).toMatchObject({ availability: "in_stock", priceUSD: 18, form: "1 gal" });
  });

  it("calls an explicit binomial high confidence, and dates the record", () => {
    expect(offers[0].match.confidence).toBe("high");
    expect(offers[0].offer.observedAt).toBe(ctx.observedAt);
  });
});

describe("schema.org Product JSON-LD", () => {
  const html = `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Product","name":"Butterfly Weed",
 "offers":{"@type":"Offer","price":"9.50","availability":"https://schema.org/InStock"}}
</script>`;
  const offers = offersFromJsonLd(extractJsonLd(html), ctx);

  it("resolves a common name through the alias table, at medium confidence", () => {
    expect(offers).toHaveLength(1);
    expect(offers[0].taxon.scientificName).toBe("Asclepias tuberosa");
    expect(offers[0].offer.availability).toBe("in_stock");
    expect(offers[0].match.confidence).toBe("medium");
  });
});

describe("Shopify products.json", () => {
  const offers = offersFromShopifyProducts(
    {
      products: [
        { title: "Coontie", vendor: "Zamia integrifolia", handle: "coontie", variants: [{ price: "22.00", available: true }] },
        { title: "Mystery Fern", vendor: "", handle: "mystery-fern", variants: [{ price: "8.00", available: false }] },
      ],
    },
    ctx,
  );

  it("drops a listing it can't name", () => {
    expect(offers.map((o) => o.taxon.scientificName)).toEqual(["Zamia integrifolia"]);
  });

  it("reads available:true as in stock", () => {
    expect(offers[0].offer.availability).toBe("in_stock");
    expect(offers[0].match.confidence).toBe("high");
  });
});

describe("resolveTaxon", () => {
  it("refuses a cultivar, by common name or by epithet", () => {
    expect(resolveTaxon({ commonName: "Firebush" })).not.toBeNull();
    expect(resolveTaxon({ commonName: "Dwarf Firebush" })).toBeNull();
    expect(resolveTaxon({ scientificName: "Hamelia patens 'Compacta'" })).toBeNull();
  });
});

describe("detectPlatform and readerFor", () => {
  it("fingerprints each platform, and says unknown rather than guess", () => {
    expect(detectPlatform({ productsJsonOk: true })).toBe("shopify");
    expect(detectPlatform({ html: '<link href="https://cdn.shoplightspeed.com/x.css">' })).toBe("lightspeed");
    expect(detectPlatform({ html: "<link href='/wp-json/'>" })).toBe("woocommerce");
    expect(detectPlatform({ html: "<html>hand-built</html>" })).toBe("unknown");
  });

  // Every Ecwid store stamps a "Made with Lightspeed" footer. Read as Lightspeed,
  // it routes to a Google feed the store never emits — the first live run found 0.
  it("catches Ecwid before its Lightspeed footer misfiles it", () => {
    const home =
      '<html id="ecwid_html"><meta name="generator" content="ec-instant-site">' +
      '<a href="https://lightspeedhq.com/">Made with Lightspeed</a></html>';
    expect(detectPlatform({ html: home })).toBe("ecwid");
    expect(readerFor("ecwid").adapter).toBe("schema-jsonld");
  });

  it("falls back to JSON-LD, never to scraping", () => {
    expect(readerFor("lightspeed").adapter).toBe("google-shopping-xml");
    expect(readerFor("unknown").adapter).toBe("schema-jsonld");
  });
});

describe("extractBinomialCandidates", () => {
  it("finds a binomial trailing a common name", () => {
    expect(extractBinomialCandidates("Willow, Scouler's Salix scouleriana")).toContain("Salix scouleriana");
  });

  it("offers the hyphenated epithet a nursery wrote with a space", () => {
    expect(extractBinomialCandidates("Kinnikinnick Arctostaphylos uva ursi")).toContain("Arctostaphylos uva-ursi");
  });

  it("doesn't take a Title-Cased common name for a binomial", () => {
    expect(extractBinomialCandidates("Coyote Brush")).toEqual([]);
  });
});

describe("live GoNatives listings, checked against the registry", () => {
  const unresolved: UnresolvedListing[] = [];
  const live: AdapterContext = { ...ctx, resolveKnown, onUnresolved: (u) => unresolved.push(u) };
  const product = (name: string, price = "45.0") => ({
    "@type": "Product",
    name,
    offers: { "@type": "Offer", price, availability: "http://schema.org/InStock" },
  });

  // The doubled possessive ("Scouler's … Scouler's", from `name` passed as both
  // hints) once read as a cultivar quote and dropped a real species.
  it("resolves a species the registry vouches for, with its ids", () => {
    const [offer] = offersFromJsonLd([product("Willow, Scouler's Salix scouleriana")], live);
    expect(offer.taxon).toEqual({ scientificName: "Salix scouleriana", usdaSymbol: "SASC", gbifKey: 5372513 });
    expect(offer.offer).toMatchObject({ availability: "in_stock", priceUSD: 45 });
    expect(offer.match.confidence).toBe("medium");
  });

  it("reports a cultivar instead of dropping it silently", () => {
    expect(offersFromJsonLd([product("Coneflower, Purple Echinacea purpurea 'Magnus'")], live)).toEqual([]);
    expect(unresolved.at(-1)?.reason).toBe("cultivar");
  });

  it("reports a binomial the registry doesn't have, with the name it saw", () => {
    expect(offersFromJsonLd([product("Huckleberry, Evergreen Vaccinium ovatum")], live)).toEqual([]);
    expect(unresolved.at(-1)).toMatchObject({ reason: "not-in-registry", candidateBinomial: "Vaccinium ovatum" });
  });

  it("reports a listing with no binomial at all", () => {
    expect(offersFromJsonLd([product("Fleabane, Wandering Erigeron Peregrinus")], live)).toEqual([]);
    expect(unresolved.at(-1)?.reason).toBe("no-binomial");
  });
});
