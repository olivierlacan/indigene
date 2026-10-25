// `npm run sw:check -- <old-dist> <new-dist>` — walk the service worker's
// release lifecycle in a real browser, against two real builds of the app.
//
// Unit tests can't see this: it lives in the browser's Cache Storage and in the
// moment one release's worker hands over to the next. So this serves the old
// build, then swaps in the new one at the same address, and checks what a
// reader actually gets:
//
//   1. an English reader never downloads French;
//   2. a French reader gets French, cached, and still French offline;
//   3. after a release, the new French and the new core are cached *before*
//      the old files are pruned, one shell cache is left, and the app opens
//      offline straight away in the new release's French;
//   4. an English reader who switches to French gets French.
//
// To make two builds that differ: `npm run build`, copy dist/ aside, change a
// French string (say `app.skipToContent` in src/locales/fr.ts), build again,
// and pass both folders. Check 3 reads the new string's "(v2)" marker, so add
// " (v2)" to it. Not in CI: it needs two builds and a browser.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const prebuilt = "/opt/pw-browsers/chromium";

const [relA, relB] = process.argv.slice(2);
if (!relA || !relB) {
  console.error("usage: npm run sw:check -- <old-dist> <new-dist>");
  process.exit(2);
}
let root = relA;
const fetched = [];
const types = { ".js": "text/javascript", ".css": "text/css", ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  fetched.push(p);
  let file = path.join(root, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) file = path.join(root, "index.html"); // SPA fallback like 404.html
  if (p.startsWith("/assets/") && !fs.existsSync(path.join(root, p))) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(4180);

const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) process.exitCode = 1; };
const skip = (page) => page.evaluate(() => document.querySelector(".skip-link, a[href='#main']")?.textContent?.trim() ?? document.body.innerText.slice(0, 80));
const cacheState = (page) => page.evaluate(async () => {
  const out = {};
  for (const k of await caches.keys()) out[k] = (await (await caches.open(k)).keys()).map((r) => new URL(r.url).pathname);
  return out;
});
const waitForSW = (page) => page.evaluate(async () => { await navigator.serviceWorker.ready; });

(async () => {
  const browser = await chromium.launch(fs.existsSync(prebuilt) ? { executablePath: prebuilt } : {});

  // --- 1. An English reader never downloads French.
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    fetched.length = 0;
    await page.goto("http://127.0.0.1:4180/");
    await waitForSW(page);
    await page.waitForTimeout(1500);
    ok(!fetched.some((f) => /\/assets\/(lang|prose)-fr-/.test(f)), "English reader: no French chunk fetched");
    const c = await cacheState(page);
    ok(!JSON.stringify(c).includes("-fr-"), "English reader: no French cached");
    await ctx.close();
  }

  // --- 2. A French reader: French loads, is cached, and works offline.
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { try { localStorage.setItem("indigene:lang", "fr"); } catch {} });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4180/");
  await waitForSW(page);
  await page.reload(); // now controlled by the worker
  await page.waitForTimeout(1500);
  const a1 = await skip(page);
  ok(/Aller au contenu principal/.test(a1) && !/v2/.test(a1), `French reader sees French: "${a1}"`);
  let c = await cacheState(page);
  const assetsA = c["indigene-assets"] || [];
  ok(assetsA.some((f) => /lang-fr-/.test(f)), "French chunk is cached on the device");

  await ctx.setOffline(true);
  await page.reload();
  await page.waitForTimeout(1500);
  ok(/Aller au contenu principal/.test(await skip(page)), "Offline reload still shows French");
  await ctx.setOffline(false);

  // --- 3. A new release: the worker updates, fetches the new French, prunes the old.
  root = relB;
  await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r.update(); });
  // The new worker installs, activates and prunes on its own: wait until its
  // release's shell cache is the only one.
  const buildB = fs.readFileSync(path.join(relB, "sw.js"), "utf8").match(/^const BUILD = "(.*)"; \/\/ stamped$/m)[1];
  await page.waitForFunction(async (want) => {
    const shells = (await caches.keys()).filter((k) => k.startsWith("indigene-shell-"));
    return shells.length === 1 && shells[0] === want;
  }, `indigene-shell-${buildB}`, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  c = await cacheState(page);
  const assetsB = c["indigene-assets"] || [];
  const newFr = JSON.parse(fs.readFileSync(path.join(relB, "sw.js"), "utf8").match(/^const FRENCH = (.*); \/\/ stamped$/m)[1]);
  const newCore = JSON.parse(fs.readFileSync(path.join(relB, "sw.js"), "utf8").match(/^const CORE = (.*); \/\/ stamped$/m)[1]);
  ok(newFr.every((f) => assetsB.includes(`/${f}`)), "After the update, the new release's French is already cached");
  ok(newCore.every((f) => assetsB.includes(`/${f}`)), "After the update, the new release's core is already cached");
  const oldOnly = assetsA.filter((f) => !assetsB.includes(f));
  ok(oldOnly.length > 0 && assetsB.every((f) => !oldOnly.includes(f)), `Old release files pruned (${oldOnly.length} dropped)`);
  ok(Object.keys(c).filter((k) => k.startsWith("indigene-shell-")).length === 1, `One shell cache left: ${Object.keys(c).join(", ")}`);

  // Offline straight after the update: the new release opens, in its new French.
  await ctx.setOffline(true);
  await page.reload();
  await page.waitForTimeout(1500);
  const b1 = await skip(page);
  ok(/\(v2\)/.test(b1), `Offline after update shows the new release's French: "${b1}"`);
  await ctx.setOffline(false);

  // --- 4. Switching an English reader to French online works.
  {
    const ctx2 = await browser.newContext();
    const p2 = await ctx2.newPage();
    await p2.goto("http://127.0.0.1:4180/");
    await p2.waitForTimeout(1000);
    await p2.evaluate(() => { localStorage.setItem("indigene:lang", "fr"); });
    await p2.reload();
    await p2.waitForTimeout(1500);
    ok(/Aller au contenu principal/.test(await skip(p2)), "English reader switching to French gets French");
    await ctx2.close();
  }

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
