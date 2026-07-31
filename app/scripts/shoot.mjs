// Take a screenshot the way CLAUDE.md's procedure specifies: phone viewport,
// real-phone pixel density, phone fonts (the SessionStart hook sets those up).
//
//   node scripts/shoot.mjs <url> <out.png> [options]
//
//   --scheme dark|light   color scheme            (default: dark)
//   --dpr N               device pixel ratio      (default: 3, like an iPhone;
//                         use 1 for very long full-page records where a 3×
//                         bitmap would be enormous or exceed Chromium limits)
//   --viewport WxH        CSS viewport            (default: 390x844)
//   --no-full-page        viewport crop instead of the whole page
//   --wait ms             settle time after load  (default: 1500)
//   --locale TAG          browser locale          (default: en-US) — drives
//                         navigator.language, so it picks the app's default
//                         language *and* its default unit system, the same way
//                         a real phone in that region would
//   --fill text           type `text` into the page's first search box before
//                         shooting — for the pages whose interesting state only
//                         exists once something has been typed (the in-page
//                         filters, the search field)
//   --fill-into sel       type into the first match of `sel` instead
//   --open sel            open the <details> matching `sel` before shooting,
//                         for the panels whose content only exists once a
//                         reader has asked for it
//   --picks REGION        walk the flow to the ranked plant list before
//                         shooting, picking the region whose card matches
//                         REGION by hand (no geolocation, no network). That
//                         page has no URL of its own — it needs a spot — so
//                         this is the only way to photograph it. Point the
//                         URL at `#/location` and this takes it from there.
//   --click sel           click the first match of a Playwright selector before
//                         shooting, waiting for the page to settle after each.
//                         Repeatable, applied in order — for the states that
//                         only exist after a tap (the spot verdict, a sun pick)
//   --geo lat,lon         grant geolocation and answer it with this point, so
//                         a "use my location" button can be one of those clicks
//
// Exists because the Playwright CLI can't set device pixel ratio directly —
// its iPhone device descriptors force WebKit, which isn't installed here.
// The output width always equals viewport-width × dpr; anything else means
// the page overflows sideways (see CLAUDE.md — fix the page, don't publish).
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args.splice(i, 2)[1];
};
const has = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? false : (args.splice(i, 1), true);
};
/** Every occurrence of a repeatable flag, in the order they were written. */
const flags = (name) => {
  const out = [];
  for (let v = flag(name, null); v !== null; v = flag(name, null)) out.push(v);
  return out;
};

const scheme = flag("--scheme", "dark");
const dpr = Number(flag("--dpr", "3"));
const [vw, vh] = flag("--viewport", "390x844").split("x").map(Number);
const fullPage = !has("--no-full-page");
const wait = Number(flag("--wait", "1500"));
const locale = flag("--locale", "en-US");
const fill = flag("--fill", "");
const fillInto = flag("--fill-into", "input[type='search']");
const picks = flag("--picks", "");
const open = flag("--open", "");
const clicks = flags("--click");
const geo = flag("--geo", "");
const [url, out] = args;

if (!url || !out || !(dpr > 0) || !(vw > 0) || !(vh > 0)) {
  console.error("usage: node scripts/shoot.mjs <url> <out.png> [--scheme dark|light] [--dpr N] [--viewport WxH] [--no-full-page] [--wait ms] [--locale TAG]");
  process.exit(1);
}

// Claude Code web sessions pre-install the browser outside playwright's
// registry; elsewhere, playwright's own resolution applies.
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(
  existsSync(prebuilt) ? { executablePath: prebuilt } : {},
);
const [geoLat, geoLon] = geo.split(",").map(Number);
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: dpr,
  colorScheme: scheme,
  locale,
  isMobile: true,
  hasTouch: true,
  ...(geo
    ? { geolocation: { latitude: geoLat, longitude: geoLon }, permissions: ["geolocation"] }
    : {}),
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
if (picks) await walkToPicks(page, picks);
// Clicked, not `open = true`: a details that was opened by assignment skips
// whatever its summary's click handler does.
if (open) await page.locator(open).first().locator("summary").click();
// Typed, not set: these fields listen for `input`, and assigning `.value`
// fires nothing — the shot would show a filled box over an unfiltered list.
if (fill) await page.locator(fillInto).first().pressSequentially(fill);
// Taps, in the order given. Each gets the settle time of its own, because these
// tend to kick off a lookup whose answer is the thing being photographed.
for (const sel of clicks) {
  await page.locator(sel).first().click();
  await page.waitForTimeout(wait);
}
await page.waitForTimeout(wait);
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`shot: ${url} → ${out} (${vw}x${vh} @${dpr}x, ${scheme}, ${locale}${picks ? ", ranked picks" : ""}${fullPage ? ", full-page" : ""})`);

/**
 * Walk the flow to the ranked plant list, which is the one page no URL can
 * reach: it needs a spot. The hand-picked-region path is the one that asks
 * nothing of the network or of geolocation permissions — pick the region whose
 * card matches `name`, take the defaults for sun and soil, and land on
 * `#/results` with that region's plants ranked.
 */
async function walkToPicks(page, name) {
  // By `data-mode`, not by the button's words: this has to work under --locale,
  // and "pick a region" is "choisissez une région" in French.
  await page.locator("button.linklike[data-mode='region']").first().click();
  await page.locator("button.choice", { hasText: name }).first().click();
  // Sun, then soil: each step offers its choices, and the primary button
  // carries on. Taking the first choice keeps the shot reproducible.
  for (const step of ["#/sun", "#/confirm"]) {
    await page.locator("button.btn-primary:visible").last().click();
    await page.waitForURL(`**${step}`);
    await page.locator("button.choice:visible").first().click();
  }
  await page.locator("button.btn-primary:visible").last().click();
  await page.waitForURL("**#/results");
}
