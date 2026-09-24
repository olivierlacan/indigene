// Walk the built app in a real browser and fail on anything its
// Content-Security-Policy refuses (src/lib/csp.ts).
//
// The policy is only useful if it's exactly right: one host too few and a
// lookup silently stops working for every reader; one too many and the Privacy
// page's list is no longer the whole truth. Nothing in a build or a typecheck
// can tell those apart from a working app — only loading the pages can. So this
// does what a reader does: opens the main pages, finds a spot by GPS and by
// town (in North America and in Europe, which use different services), and goes
// through to the ranked plants, collecting every refusal on the way.
//
// It serves dist/ *as* https://indigene.app, the one host that loads the page
// count (lib/analytics.ts), so the counting script runs under the policy too.
// Everything else goes to the real services: a refusal is decided before any
// request leaves, but the later lookups only happen once the earlier ones
// answer.
//
//   npm run build && npm run csp:check
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dist = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
if (!existsSync(join(dist, "index.html"))) {
  console.error("csp:check: dist/ is missing — run `npm run build` first.");
  process.exit(1);
}

const ORIGIN = "https://indigene.app";
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".map": "application/json",
};

/** The file GitHub Pages would answer a path with, and its status. */
function resolveFile(pathname) {
  const file = join(dist, decodeURIComponent(pathname));
  if (!file.startsWith(dist)) return { file: join(dist, "404.html"), status: 404 };
  if (existsSync(file) && statSync(file).isFile()) return { file, status: 200 };
  const index = join(file, "index.html");
  if (existsSync(index)) return { file: index, status: 200 };
  return { file: join(dist, "404.html"), status: 404 };
}

const prebuilt = "/opt/pw-browsers/chromium";
// Behind a proxy (a sandboxed session), outside requests have to go through it.
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch({
  ...(existsSync(prebuilt) ? { executablePath: prebuilt } : {}),
  ...(proxy ? { proxy: { server: proxy } } : {}),
});

const refusals = [];
const unfinished = [];

async function visit(label, { path, geo, then }) {
  const context = await browser.newContext({
    // The worker would answer navigations from the real site, not this build.
    serviceWorkers: "block",
    ignoreHTTPSErrors: Boolean(proxy),
    viewport: { width: 390, height: 844 },
    ...(geo ? { geolocation: geo, permissions: ["geolocation"] } : {}),
  });
  await context.route(`${ORIGIN}/**`, (route) => {
    const { file, status } = resolveFile(new URL(route.request().url()).pathname);
    route.fulfill({ status, body: readFileSync(file), contentType: TYPES[extname(file)] ?? "application/octet-stream" });
  });
  await context.addInitScript(() => {
    window.__refused = [];
    document.addEventListener("securitypolicyviolation", (e) => {
      // The origin, not the whole address: a lookup's address carries the
      // test spot's coordinates, and the host is what the policy decides on.
      let where = e.blockedURI || "(inline)";
      try { where = new URL(where).origin; } catch {}
      window.__refused.push(`${e.effectiveDirective} ${where}`);
    });
  });
  const page = await context.newPage();
  // A refusal inside a worker or before the listener is up still logs here.
  const logged = [];
  // Which outside hosts the page actually reached — printed, so a pass that
  // never got as far as the lookups can't pass for one that did.
  const hosts = new Set();
  page.on("request", (req) => {
    const host = new URL(req.url()).hostname;
    if (host !== "indigene.app") hosts.add(host);
  });
  page.on("console", (msg) => {
    if (/Content Security Policy/i.test(msg.text())) logged.push(msg.text());
  });
  try {
    await page.goto(ORIGIN + path, { waitUntil: "networkidle", timeout: 30_000 });
    if (then) await then(page);
    await page.waitForTimeout(1500);
  } catch (err) {
    // A walk that stopped short checked less than it claims, so it fails too —
    // but after the other pages, so one stall doesn't hide a refusal elsewhere.
    unfinished.push(`${label}: ${err.message.split("\n")[0]}`);
  }
  const seen = await page.evaluate(() => window.__refused ?? []).catch(() => []);
  // The console only as a fallback: it repeats each refusal the event already
  // reported, but it also hears the ones the event can't (inside a worker).
  const all = [...new Set(seen.length ? seen : logged)];
  for (const r of all) refusals.push(`${label}: ${r}`);
  console.log(`${all.length ? "✗" : "✓"} ${label}${hosts.size ? ` — ${[...hosts].sort().join(", ")}` : ""}`);
  await context.close();
}

/** Tap on through the flow — sun, soil, goals — to the ranked plants. */
async function onToResults(page) {
  for (let i = 0; i < 6 && !page.url().includes("#/results"); i++) {
    const choice = page.locator("button.choice:visible").first();
    if (await choice.count()) await choice.click();
    await page.locator("button.btn-primary:visible").last().click();
    await page.waitForLoadState("networkidle");
  }
}

async function byGps(page) {
  await page.locator("button.btn-primary.btn-block").first().click();
  await page.waitForLoadState("networkidle");
  await onToResults(page);
}

function byTown(town) {
  return async (page) => {
    await page.locator("button.linklike[data-mode='zip']").first().click();
    await page.locator("#place-q").pressSequentially(town);
    await page.keyboard.press("Enter");
    await page.waitForLoadState("networkidle");
  };
}

const firstPlant = readdirSync(join(dist, "plants")).find((d) => d !== "index.html");
await visit("home", { path: "/" });
await visit("plants", { path: "/plants" });
await visit("a plant, with its photos", { path: `/plants/${firstPlant}` });
await visit("wildlife", { path: "/wildlife" });
await visit("look-alikes", { path: "/lookalikes" });
await visit("invasives", { path: "/invasives" });
await visit("an invasive's sightings, from iNaturalist", {
  path: "/invasives/ailanthus-altissima",
  then: async (page) => {
    await page.locator(".obs-elsewhere-row button").first().click();
    await page.waitForLoadState("networkidle");
  },
});
await visit("privacy", { path: "/privacy" });
await visit("an address that isn't ours", { path: "/no-such-page" });
await visit("a deep link through 404.html", { path: "/wildlife/in/pnw" });
await visit("GPS in Pennsylvania, to ranked plants", {
  path: "/#/location",
  geo: { latitude: 40.7934, longitude: -77.86 },
  then: byGps,
});
await visit("GPS in France, to ranked plants", {
  path: "/#/location",
  geo: { latitude: 47.2184, longitude: -1.5536 },
  then: byGps,
});
// South of the equator the ecoregion comes from a third service (RESOLVE).
await visit("GPS in Sydney", {
  path: "/#/location",
  geo: { latitude: -33.8688, longitude: 151.2093 },
  then: byGps,
});
await visit("town search", { path: "/#/location", then: byTown("Nantes") });

await browser.close();

if (unfinished.length) {
  console.error(`\n${unfinished.length} walk(s) didn't finish, so weren't fully checked:`);
  for (const u of unfinished) console.error(`  ${u}`);
}
if (refusals.length) {
  console.error(`\n${refusals.length} request(s) refused by the Content-Security-Policy:`);
  for (const r of refusals) console.error(`  ${r}`);
  console.error("\nIf the app needs it, add the host to src/lib/csp.ts and the Privacy page's list together.");
}
if (refusals.length || unfinished.length) process.exit(1);
console.log("\nNothing refused.");
