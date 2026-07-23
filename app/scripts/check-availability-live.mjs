// Live probe of the Grove availability adapters against a real storefront.
//
// Where `check-availability.mjs` runs frozen fixtures offline, this fetches an
// actual store and pushes it through the SAME `src/lib/availability.ts` code,
// so you can confirm the adapters still read a live catalog (and see what a
// nursery's reconciliation report would look like) after the store — or our
// code — changes.
//
//   npm run check:availability:live            # a 12-product sample
//   npm run check:availability:live -- 40      # a bigger sample
//   npm run check:availability:live -- all     # the whole catalog
//   npm run check:availability:live -- 12 https://some-other-store.example
//
// This needs a headless browser, and that is itself the finding this repo's
// live test surfaced: the target store (GoNatives) is an Ecwid Instant Site,
// which serves its `schema.org` Product/Offer JSON-LD only AFTER client-side
// hydration — a plain fetch of the product HTML carries none. So we render.
// Playwright is an *optional* dependency (never needed by `build`); if the
// browser isn't installed this script tells you the one command to run.
import { openLoader } from "./_load-ts.mjs";

const DEFAULT_STORE = "https://gonativesnursery.company.site";
const [, , limitArg, storeArg] = process.argv;
const store = (storeArg || DEFAULT_STORE).replace(/\/$/, "");
const limit = limitArg === "all" ? Infinity : Number.parseInt(limitArg ?? "12", 10) || 12;

// --- Load the real adapters + the registry validator -------------------------
const loader = await openLoader();
const { offersFromJsonLd, detectPlatform, readerFor } = await loader.load("/src/lib/availability.ts");
const { taxonRefFor } = await loader.load("/src/lib/registry.ts");
await loader.close();

// --- Playwright is optional; fail with a helpful message, not a stack trace --
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "This live check needs Playwright (an optional dependency).\n" +
      "Install it once:\n\n  npm install\n  npx playwright install chromium\n",
  );
  process.exit(2);
}

const log = (...a) => console.log(...a);

// --- 1. Fingerprint the storefront from its home page ------------------------
log(`Store: ${store}`);
const homeHtml = await (await fetch(store, { headers: { "user-agent": "GroveLiveCheck/0.1" } })).text();
const platform = detectPlatform({ html: homeHtml });
const reader = readerFor(platform);
log(`Platform: ${platform} → reader: ${reader.adapter} (${reader.via})\n`);

// --- 2. Enumerate products from the sitemap ----------------------------------
const sitemap = await (await fetch(`${store}/sitemap.xml`)).text();
const allUrls = [...sitemap.matchAll(/<loc>\s*([^<]*\/products\/[^<]+?)\s*<\/loc>/gi)].map((m) => m[1]);
if (allUrls.length === 0) {
  console.error("No product URLs found in sitemap.xml — is this the right store?");
  process.exit(1);
}
// Evenly spaced sample so a partial run still spans the whole catalog.
const step = Math.max(1, Math.floor(allUrls.length / Math.min(limit, allUrls.length)));
const urls = limit === Infinity ? allUrls : allUrls.filter((_, i) => i % step === 0).slice(0, limit);
log(`Catalog: ${allUrls.length} products; checking ${urls.length}.\n`);

// --- 3. Render each page, run its JSON-LD through the adapter -----------------
const observedAt = new Date().toISOString();
const unresolved = [];
const ctx = {
  nurseryId: platform === "unknown" ? "store" : new URL(store).hostname.split(".")[0],
  observedAt,
  resolveKnown: taxonRefFor,
  onUnresolved: (u) => unresolved.push(u),
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const resolved = [];
let errors = 0;
for (const url of urls) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector('script[type="application/ld+json"]', { state: "attached", timeout: 20000 });
    const blocks = await page.$$eval('script[type="application/ld+json"]', (els) =>
      els.map((e) => e.textContent),
    );
    const nodes = blocks.map((b) => JSON.parse(b));
    const offers = offersFromJsonLd(nodes, ctx);
    for (const o of offers) resolved.push(o);
  } catch (e) {
    errors++;
    log(`  err  ${url}  (${String(e).split("\n")[0]})`);
  }
}
await browser.close();

// --- 4. Report — resolved offers, then the reconciliation feedback -----------
log(`\n=== Resolved (${resolved.length}) ===`);
for (const o of resolved)
  log(`  ${o.taxon.scientificName}  [${o.offer.availability}, $${o.offer.priceUSD ?? "?"}, ${o.match.confidence}]`);

const byReason = unresolved.reduce((m, u) => ((m[u.reason] = (m[u.reason] ?? 0) + 1), m), {});
log(`\n=== Unresolved (${unresolved.length}) — the nursery-facing reconciliation report ===`);
log(`  by reason: ${Object.entries(byReason).map(([r, n]) => `${r}=${n}`).join("  ") || "(none)"}`);
for (const u of unresolved)
  log(`  [${u.reason}] "${u.name}"${u.candidateBinomial ? `  (saw: ${u.candidateBinomial})` : ""}`);

log(
  `\n${resolved.length}/${urls.length} pages resolved to an offer, ` +
    `${unresolved.length} reported, ${errors} render error(s).`,
);
// A live probe, not a gate: only a hard failure (unreachable store, no browser)
// is a nonzero exit. Zero resolutions is a finding to read, not a build break.
process.exit(errors === urls.length ? 1 : 0);
