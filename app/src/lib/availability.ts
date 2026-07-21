// Grove reference adapters — read the machine-readable stock a nursery already
// publishes (for Google/SEO) and normalize it to one taxon-keyed record.
//
// This is a *reference implementation* of the protocol proposed in
// `docs/nursery-availability-protocol.md`. It is intentionally dependency-free
// and DOM-free so the same code runs in the browser, in the optional Hanami
// server's future Node worker, and in the check script
// (`app/scripts/check-availability.ts`). Nothing here is wired into the app yet.
//
// Every adapter is a pure function `source text/JSON -> CanonicalOffer[]` and
// degrades to `[]` on any failure — the same best-effort contract every live
// source in `lib/site.ts` already honors, so a nursery's outage or format quirk
// can never break a plant page.

/** Normalized availability. `on_demand` = not stocked but contract-growable. */
export type Availability =
  | "in_stock"
  | "out_of_stock"
  | "preorder"
  | "on_demand"
  | "unknown";

/** The botanical spine — the same keys `DATA_SOURCES.md` picks for the catalog:
 *  USDA PLANTS `Symbol` (U.S., public domain) and GBIF `usageKey` (global). */
export interface TaxonRef {
  usdaSymbol?: string;
  gbifKey?: number;
  scientificName: string;
}

/** How a nursery listing was resolved to a taxon — freshness of the *identity*,
 *  reported honestly so a fuzzy name match never masquerades as an exact one. */
export interface MatchInfo {
  method: "sku-map" | "scientific-name" | "common-alias";
  confidence: "high" | "medium" | "low";
}

/** One nursery offer of one taxon, normalized. Mirrors doc §4.2. */
export interface CanonicalOffer {
  taxon: TaxonRef;
  nurseryId: string;
  offer: {
    availability: Availability;
    /** Container/size as sold, verbatim (e.g. "1 gal", "plug"). */
    form?: string;
    priceUSD?: number;
    url?: string;
    /** When we read it. Freshness is a fact, not a guess. */
    observedAt: string;
  };
  match: MatchInfo;
}

/** Context threaded into every adapter so records are attributable and dated. */
export interface AdapterContext {
  nurseryId: string;
  /** ISO timestamp the caller supplies (kept as a param so the code stays pure). */
  observedAt: string;
  /** Optional common-name → scientific-name aliases (the cultivar-trap table). */
  aliases?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Platform detection — the efficiency that avoids per-nursery scraping
// ---------------------------------------------------------------------------
//
// The point of Grove is that you don't scrape a nursery's HTML. Every storefront
// PLATFORM (Shopify, Lightspeed, WooCommerce, Square) imposes the SAME predictable
// structure on all its tenant stores and exposes a documented, structured surface
// (a JSON endpoint or a generated feed). So one adapter written against a platform
// covers *every* nursery on that platform. The job at each nursery collapses to:
// fingerprint the platform once, then dispatch to that platform's structured
// reader. A handful of adapters covers the long tail.

export type Platform = "shopify" | "lightspeed" | "woocommerce" | "square" | "unknown";

/** Evidence for fingerprinting — any subset a caller has cheaply on hand. */
export interface PlatformSignal {
  /** Storefront HTML (home or product page). */
  html?: string;
  /** Response headers, lowercased keys. */
  headers?: Record<string, string>;
  /** Whether `GET /products.json` returned a Shopify-shaped body (a cheap probe). */
  productsJsonOk?: boolean;
}

/**
 * Fingerprint the storefront platform from cheap signals. Deliberately
 * conservative: unknown beats a wrong guess, because a wrong platform means a
 * wrong (brittle) reader. These markers are stable platform tells, not scraped
 * content — they identify the *contract*, not the inventory.
 */
export function detectPlatform(sig: PlatformSignal): Platform {
  const html = (sig.html ?? "").toLowerCase();
  const hdr = sig.headers ?? {};
  const hval = Object.entries(hdr)
    .map(([k, v]) => `${k}:${String(v).toLowerCase()}`)
    .join("\n");

  if (sig.productsJsonOk || html.includes("cdn.shopify.com") || html.includes("shopify.theme") || hval.includes("x-shopify"))
    return "shopify";
  if (html.includes("shoplightspeed.com") || html.includes("lightspeedhq") || html.includes("lightspeed ecom"))
    return "lightspeed";
  if (html.includes("woocommerce") || html.includes("wp-content/plugins/woocommerce") || html.includes("/wp-json/"))
    return "woocommerce";
  if (html.includes("square-online") || html.includes("weeblycloud") || html.includes("editmysite.com"))
    return "square";
  return "unknown";
}

/** The structured (non-scraping) reader to use for a detected platform, and how
 *  to reach it. `jsonld` is the universal floor when nothing better exists. */
export function readerFor(platform: Platform): {
  adapter: "shopify-products-json" | "google-shopping-xml" | "woo-store-api" | "schema-jsonld";
  /** Path or manifest hint to fetch the structured surface. */
  via: string;
} {
  switch (platform) {
    case "shopify":
      return { adapter: "shopify-products-json", via: "/products.json" };
    case "lightspeed":
      // Lightspeed has no public products.json; its structured surface is the
      // merchant-generated Google Shopping feed URL (declared in the manifest).
      return { adapter: "google-shopping-xml", via: "manifest:inventory[].url" };
    case "woocommerce":
      return { adapter: "woo-store-api", via: "/wp-json/wc/store/v1/products" };
    case "square":
    case "unknown":
    default:
      // Fall back to reading published structured data, not brittle HTML scraping.
      return { adapter: "schema-jsonld", via: "product pages (schema.org JSON-LD)" };
  }
}

// ---------------------------------------------------------------------------
// Identity reconciliation
// ---------------------------------------------------------------------------

/**
 * A tiny seed alias table. In production this is a curated, MIT-licensed file
 * (and the SKU map in a nursery's manifest short-circuits it entirely). It's
 * here mainly to encode the trap the brief cares about: a *cultivar* is not the
 * straight species, and "Dwarf Firebush" is a different plant from "Firebush".
 */
export const DEFAULT_ALIASES: Record<string, string> = {
  firebush: "Hamelia patens",
  "oregon white oak": "Quercus garryana",
  "garry oak": "Quercus garryana",
  "butterfly weed": "Asclepias tuberosa",
  coontie: "Zamia integrifolia",
};

/** Cultivar/hybrid giveaways — a name carrying these can't be claimed as the
 *  straight native species without a human in the loop, so we refuse it. */
const CULTIVAR_MARKERS = /\bdwarf\b|'[^']+'|\bhybrid\b|\bcompacta\b|\bnana\b/i;

function normalizeName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Resolve a nursery listing to a taxon, best-confidence first (doc §4.2):
 * an explicit scientific name wins; otherwise a common-name alias at lower
 * confidence; a cultivar-marked name or no match returns null (dropped, never
 * guessed).
 */
export function resolveTaxon(
  hint: { scientificName?: string; commonName?: string },
  aliases: Record<string, string> = DEFAULT_ALIASES,
): { taxon: TaxonRef; match: MatchInfo } | null {
  const sci = hint.scientificName?.trim();
  if (sci && /^[A-Z][a-z]+ [a-z]/.test(sci)) {
    // A binomial is present. Cultivar epithets ("Hamelia patens 'Compacta'")
    // still disqualify — we only vouch for the straight species.
    if (CULTIVAR_MARKERS.test(sci)) return null;
    return {
      taxon: { scientificName: sci },
      match: { method: "scientific-name", confidence: "high" },
    };
  }

  const common = hint.commonName;
  if (common && !CULTIVAR_MARKERS.test(common)) {
    const hit = aliases[normalizeName(common)];
    if (hit) {
      return {
        taxon: { scientificName: hit },
        match: { method: "common-alias", confidence: "medium" },
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Availability normalization
// ---------------------------------------------------------------------------

/** Fold schema.org / Google / Shopify availability spellings into our enum. */
export function normalizeAvailability(raw: string | boolean | undefined): Availability {
  if (raw === true) return "in_stock";
  if (raw === false) return "out_of_stock";
  const v = String(raw ?? "").toLowerCase();
  if (!v) return "unknown";
  if (v.includes("instock") || v === "in stock" || v === "in_stock") return "in_stock";
  if (v.includes("outofstock") || v === "out of stock" || v === "out_of_stock")
    return "out_of_stock";
  if (v.includes("preorder") || v.includes("backorder")) return "preorder";
  if (v.includes("discontinued")) return "out_of_stock";
  return "unknown";
}

function toPriceUSD(raw: unknown): number | undefined {
  if (raw == null) return undefined;
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

// ---------------------------------------------------------------------------
// Adapter 1 — schema.org Product/Offer JSON-LD (the universal floor)
// ---------------------------------------------------------------------------

/** Pull every `<script type="application/ld+json">` payload out of an HTML
 *  string. Regex rather than DOMParser so the adapter runs outside a browser. */
export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
      /* skip malformed block */
    }
  }
  return out;
}

/** Walk parsed JSON-LD nodes (from `extractJsonLd`) and emit offers for any
 *  `Product` carrying an `Offer`. Handles `@graph` and array payloads. */
export function offersFromJsonLd(nodes: unknown[], ctx: AdapterContext): CanonicalOffer[] {
  const products: any[] = [];
  const visit = (n: any) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) return n.forEach(visit);
    if (Array.isArray(n["@graph"])) n["@graph"].forEach(visit);
    const t = n["@type"];
    if (t === "Product" || (Array.isArray(t) && t.includes("Product"))) products.push(n);
  };
  nodes.forEach(visit);

  const offers: CanonicalOffer[] = [];
  for (const p of products) {
    const resolved = resolveTaxon(
      { scientificName: p.name, commonName: p.name },
      ctx.aliases,
    );
    if (!resolved) continue;
    const rawOffer = Array.isArray(p.offers) ? p.offers[0] : p.offers;
    if (!rawOffer) continue;
    offers.push({
      taxon: resolved.taxon,
      nurseryId: ctx.nurseryId,
      offer: {
        availability: normalizeAvailability(rawOffer.availability),
        priceUSD: toPriceUSD(rawOffer.price),
        url: typeof rawOffer.url === "string" ? rawOffer.url : p.url,
        observedAt: ctx.observedAt,
      },
      match: resolved.match,
    });
  }
  return offers;
}

// ---------------------------------------------------------------------------
// Adapter 2 — Google Shopping RSS 2.0 XML (the Lightspeed answer)
// ---------------------------------------------------------------------------

function tag(item: string, name: string): string | undefined {
  const m = item.match(
    new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"),
  );
  if (!m) return undefined;
  return m[1].replace(/^<!\[CDATA\[|\]\]>$/g, "").trim();
}

/**
 * Parse a Google Merchant / Shopping feed (RSS 2.0, `xmlns:g`). Lightspeed eCom
 * generates exactly this and refreshes it ~every 5 h, so a Lightspeed nursery
 * like GoNatives can participate today with no new file to hand-maintain.
 * POC-grade string parsing (well-formed feeds only); a browser caller may swap
 * in DOMParser without changing the output shape.
 */
export function offersFromGoogleShoppingXml(
  xml: string,
  ctx: AdapterContext,
): CanonicalOffer[] {
  const offers: CanonicalOffer[] = [];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const item of items) {
    // Prefer an explicit binomial if the feed carries one; fall back to title.
    const resolved = resolveTaxon(
      {
        scientificName: tag(item, "g:mpn") || tag(item, "g:product_type"),
        commonName: tag(item, "g:title") || tag(item, "title"),
      },
      ctx.aliases,
    );
    if (!resolved) continue;
    offers.push({
      taxon: resolved.taxon,
      nurseryId: ctx.nurseryId,
      offer: {
        availability: normalizeAvailability(tag(item, "g:availability")),
        form: tag(item, "g:size"),
        priceUSD: toPriceUSD(tag(item, "g:price")),
        url: tag(item, "g:link") || tag(item, "link"),
        observedAt: ctx.observedAt,
      },
      match: resolved.match,
    });
  }
  return offers;
}

// ---------------------------------------------------------------------------
// Adapter 3 — Shopify public products.json (zero nursery effort where present)
// ---------------------------------------------------------------------------

/** Parse the public, no-auth `/products.json` a Shopify storefront exposes. */
export function offersFromShopifyProducts(
  json: unknown,
  ctx: AdapterContext,
): CanonicalOffer[] {
  const products: any[] = (json as any)?.products;
  if (!Array.isArray(products)) return [];
  const offers: CanonicalOffer[] = [];
  for (const p of products) {
    const resolved = resolveTaxon(
      // Shopify stores the botanical name in `vendor`/`title`/`tags` variably;
      // title is the reliable common-name surface, vendor sometimes the latin.
      { scientificName: p.vendor, commonName: p.title },
      ctx.aliases,
    );
    if (!resolved) continue;
    const v = Array.isArray(p.variants) ? p.variants[0] : undefined;
    offers.push({
      taxon: resolved.taxon,
      nurseryId: ctx.nurseryId,
      offer: {
        availability: normalizeAvailability(v ? Boolean(v.available) : undefined),
        form: v?.title && v.title !== "Default Title" ? v.title : undefined,
        priceUSD: toPriceUSD(v?.price),
        url: p.handle ? `/products/${p.handle}` : undefined,
        observedAt: ctx.observedAt,
      },
      match: resolved.match,
    });
  }
  return offers;
}
