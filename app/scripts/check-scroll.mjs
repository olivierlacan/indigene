// Use every control in a list's view panel — sort, group, each filter, each
// size cap — and fail if the page moves under the reader's finger.
//
// A tap on Sort, Group or a filter redraws the page it's on. The reader is
// partway down it, looking at the control they just tapped; it has to stay
// where it was while the list beside it changes (`restorePlace` in main.ts).
// When that goes wrong nothing errors and every page still renders — the page
// just lurches, sometimes hundreds of pixels, sometimes to the very top. Only
// tapping the controls in a browser shows it, so this does: it scrolls each
// control to mid-screen, uses it, follows the control frame by frame until the
// page settles, and reports any frame where it moved.
//
// It serves dist/ itself and refuses every outside request, so it needs no
// network: photos fall back to their drawings, which is the same layout.
//
//   npm run build && npm run scroll:check
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dist = resolve(fileURLToPath(new URL("../dist", import.meta.url)));
if (!existsSync(join(dist, "index.html"))) {
  console.error("scroll:check: dist/ is missing — run `npm run build` first.");
  process.exit(1);
}

const ORIGIN = "http://indigene.test";
/** Pages with a view panel, as a reader reaches them. */
const PAGES = ["/#/plants", "/#/regions/chicago", "/#/wildlife"];
/** A phone, and a laptop where the cards run three across. */
const WIDTHS = [390, 1100];
/** Where the control sits on screen when it's used. */
const AT = 400;
/** A pixel or two is rounding; more is the page moving. */
const SLACK = 2;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

function serve(pathname) {
  let file = join(dist, decodeURIComponent(pathname));
  if (!file.startsWith(dist)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) return null;
  return { body: readFileSync(file), contentType: TYPES[extname(file)] ?? "application/octet-stream" };
}

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});

const CONTROLS = ".roster-controls [data-keep]";

/** Open a page fresh, with its filter drawer open, ready to use a control. */
async function open(page, path) {
  await page.goto(ORIGIN + path);
  await page.waitForSelector(CONTROLS);
  await page.evaluate(() => document.querySelectorAll(".roster-drawer").forEach((d) => { d.open = true; }));
  // Fonts and the first masonry pass, so the page has stopped settling.
  await page.waitForTimeout(300);
}

/**
 * Put the control named `keep` at `AT`, run `act` on it in the page, and
 * return the worst distance it was ever drawn from there.
 */
async function measure(page, keep, act) {
  const ready = await page.evaluate(({ keep, AT }) => {
    const c = document.querySelector(`[data-keep="${keep}"]`);
    if (!c || !c.getClientRects().length) return false;
    window.scrollBy(0, c.getBoundingClientRect().top - AT);
    return Math.abs(c.getBoundingClientRect().top - AT) <= 1; // the page was tall enough to put it there
  }, { keep, AT });
  if (!ready) return null;
  await page.evaluate(({ keep, act }) => {
    window.__tops = [];
    const c = document.querySelector(`[data-keep="${keep}"]`);
    if (act === "click") c.click();
    else {
      c.selectedIndex = (c.selectedIndex + 1) % c.options.length;
      c.dispatchEvent(new Event("change", { bubbles: true }));
    }
    // After each paint: the worst frame is what the reader saw.
    const tick = () => {
      const now = document.querySelector(`[data-keep="${keep}"]`);
      window.__tops.push(now && now.getClientRects().length ? now.getBoundingClientRect().top : null);
      if (window.__tops.length < 20) requestAnimationFrame(() => setTimeout(tick, 0));
    };
    requestAnimationFrame(() => setTimeout(tick, 0));
  }, { keep, act });
  await page.waitForFunction(() => window.__tops.length >= 20, null, { timeout: 15000 });
  await page.waitForTimeout(200);
  const tops = await page.evaluate(() => window.__tops);
  if (tops.some((t) => t === null)) return Infinity; // it vanished or was hidden
  return Math.max(...tops.map((t) => Math.abs(t - AT)));
}

const failures = [];
let checked = 0;
for (const width of WIDTHS) {
  const context = await browser.newContext({ serviceWorkers: "block", viewport: { width, height: 844 } });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    const hit = serve(url.pathname) ?? serve("/index.html");
    return route.fulfill({ status: 200, body: hit.body, contentType: hit.contentType });
  });
  const page = await context.newPage();
  for (const path of PAGES) {
    await open(page, path);
    const controls = await page.$$eval(CONTROLS, (cs) =>
      cs.map((c) => ({ keep: c.dataset.keep, select: c.tagName === "SELECT", label: (c.getAttribute("aria-label") || c.textContent).trim().slice(0, 40) })));
    for (const c of controls) {
      await open(page, path);
      if (c.select) {
        // A size cap's select only works once its toggle is on.
        const toggle = c.keep.replace(/:cap$/, "");
        await page.evaluate((k) => document.querySelector(`[data-keep="${k}"]`).click(), toggle);
        await page.waitForTimeout(600);
        await page.evaluate(() => document.querySelectorAll(".roster-drawer").forEach((d) => { d.open = true; }));
      }
      const worst = await measure(page, c.keep, c.select ? "change" : "click");
      if (worst === null) continue; // too near the end of a short page to sit mid-screen
      checked++;
      const ok = worst <= SLACK;
      console.log(`${ok ? "ok  " : "FAIL"} ${String(width).padStart(4)}px ${path.padEnd(20)} ${c.label}${ok ? "" : ` — moved ${worst === Infinity ? "out of view" : `${Math.round(worst)}px`}`}`);
      if (!ok) failures.push(`${width}px ${path}: "${c.label}" moved ${worst === Infinity ? "out of view" : `${Math.round(worst)}px`}`);
    }
  }
  await context.close();
}
await browser.close();

if (!checked) {
  console.error("scroll:check: no controls were checked — did the view panel change?");
  process.exit(1);
}
if (failures.length) {
  console.error(`\nscroll:check: ${failures.length} control(s) moved the page:\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`\nscroll:check: ${checked} controls, none moved the page.`);
