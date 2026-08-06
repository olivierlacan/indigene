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
//   --shoot-el sel        photograph just that element instead of the page —
//                         for a card whose whole point is how tall it is, and
//                         which a sticky panel would otherwise sit on top of
//   --unstick             drop every sticky element to static before shooting.
//                         Only for --shoot-el: capturing a tall element scrolls
//                         the page, and the header and control panels would be
//                         painted across the middle of the card — an artifact of
//                         the capture, not something a reader ever sees
//   --scroll-to sel       scroll the first match into view before shooting —
//                         for a viewport crop of something further down a page
//                         whose sticky panels a full-page capture would smear
//   --revisit ROUTE       after the walk, come back as a returning visitor:
//                         load ROUTE (a hash route, e.g. `#/settings`) and
//                         *reload* the document, so the in-memory draft is gone
//                         and only what the device actually remembers is left.
//                         The reload is the point — a goto that changes nothing
//                         but the hash doesn't reload, and the page would still
//                         be showing the walk's own state rather than a memory
//   --stop-at STEP        with --picks, stop the walk at `goals` (the step
//                         that asks what the list should be ranked for)
//                         instead of carrying on to the plants
//   --tap-pick            with --picks, tap the first plant in the ranked list
//                         and shoot the page it opens — the only way to reach
//                         a plant's page *from* a list, which is what puts the
//                         way back on it
//   --then HASH           with --picks, open this hash after the walk instead
//                         of stopping at the list. For the pages that read the
//                         reader's region: the walk is what makes the app know
//                         where "here" is, and this picks *which* page to then
//                         photograph knowing it
//   --photos DIR          answer iNaturalist photo requests from a local
//                         mirror instead of the network — see below
//
// ## --photos, and why the shots need it
//
// The plant page, the plants index, a region's roster and the region cards all
// show photographs now, and they come from iNaturalist's bucket rather than
// from `dist/`. That makes a screenshot depend on the network twice over: it
// can't be taken at all where outbound traffic is filtered (the sandbox these
// are usually captured in), and even with a good connection it races — a
// capture is a picture of whichever tiles happened to have landed.
//
// `--photos DIR` fixes both. It serves the photo hosts from a directory laid
// out exactly like their URLs, so `…/photos/12345/small.jpeg` is read from
// `DIR/photos/12345/small.jpeg`. The bytes are the real photograph's, so the
// shot is the truth; it is just fetched from disk, so it is the *same* truth
// every time. Mirror what you need with curl:
//
//   curl -sS --create-dirs -o "$DIR/photos/12345/small.jpeg" \
//     https://inaturalist-open-data.s3.amazonaws.com/photos/12345/small.jpeg
//
// A photo the mirror doesn't have is failed rather than fetched, so a missing
// file shows up as a missing picture instead of quietly going to the network
// and reintroducing the race.
//
// Exists because the Playwright CLI can't set device pixel ratio directly —
// its iPhone device descriptors force WebKit, which isn't installed here.
// The output width always equals viewport-width × dpr; anything else means
// the page overflows sideways (see CLAUDE.md — fix the page, don't publish).
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
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
const scrollTo = flag("--scroll-to", "");
const shootEl = flag("--shoot-el", "");
const unstick = has("--unstick");
const stopAt = flag("--stop-at", "");
const revisit = flag("--revisit", "");
const tapPick = has("--tap-pick");
const then = flag("--then", "");
const open = flag("--open", "");
const clicks = flags("--click");
const geo = flag("--geo", "");
const photos = flag("--photos", "");
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
  // With a mirror in hand, the service worker has to stay out of the way: once
  // it takes control it fetches photos itself, and a fetch made *by* a worker
  // never reaches `page.route`. The mirror would then answer only the handful
  // of requests made before the worker activated, and the rest would go to a
  // network that isn't there — a shot of a list with three photographs on it
  // and no error to say why.
  ...(photos ? { serviceWorkers: "block" } : {}),
  ...(geo
    ? { geolocation: { latitude: geoLat, longitude: geoLon }, permissions: ["geolocation"] }
    : {}),
});
const page = await context.newPage();

// The photo mirror. Same two hosts the service worker knows about
// (`public/sw.js`), and the same reasoning: a photo URL names one photo at one
// size forever, so a file on disk is a complete and permanent answer.
if (photos) {
  const root = resolve(photos);
  const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  for (const host of ["inaturalist-open-data.s3.amazonaws.com", "static.inaturalist.org"]) {
    await page.route(`https://${host}/**`, (route) => {
      const file = join(root, new URL(route.request().url()).pathname);
      if (!file.startsWith(root) || !existsSync(file)) return route.abort();
      route.fulfill({ body: readFileSync(file), contentType: TYPES[extname(file).toLowerCase()] ?? "image/jpeg" });
    });
  }
}
await page.goto(url, { waitUntil: "networkidle" });
if (picks) await walkToPicks(page, picks, stopAt);
if (tapPick) await tapFirstPick(page);
// After the walk the app knows the reader's region; this opens a page that
// depends on it, in the state a real reader would arrive with.
if (then) {
  await page.goto(new URL(then, url).href, { waitUntil: "networkidle" });
}

if (revisit) await comeBackLater(page, url, revisit);
// Clicked, not `open = true`: a details that was opened by assignment skips
// whatever its summary's click handler does.
if (open) await page.locator(open).first().locator("summary").click();
// Typed, not set: these fields listen for `input`, and assigning `.value`
// fires nothing — the shot would show a filled box over an unfiltered list.
if (fill) await page.locator(fillInto).first().pressSequentially(fill);
if (scrollTo) {
  await page.locator(scrollTo).first().evaluate((node) =>
    node.scrollIntoView({ block: "start" }));
}
// Taps, in the order given. Each gets the settle time of its own, because these
// tend to kick off a lookup whose answer is the thing being photographed.
for (const sel of clicks) {
  await page.locator(sel).first().click();
  await page.waitForTimeout(wait);
}
await page.waitForTimeout(wait);
if (unstick) {
  await page.addStyleTag({ content: "*{position:static !important}" });
  await page.waitForTimeout(200);
}
if (shootEl) await page.locator(shootEl).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`shot: ${url} → ${out} (${vw}x${vh} @${dpr}x, ${scheme}, ${locale}${picks ? ", ranked picks" : ""}${fullPage ? ", full-page" : ""})`);

/**
 * Walk the flow to the ranked plant list, which is the one page no URL can
 * reach: it needs a spot. The hand-picked-region path is the one that asks
 * nothing of the network or of geolocation permissions — pick the region whose
 * card matches `name`, take the defaults for sun and soil, and land on
 * `#/results` with that region's plants ranked.
 */
async function walkToPicks(page, name, stop = "") {
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
  // Then the goals step, which is where the ranking is chosen. Its own primary
  // button is the one that finally shows the plants — so a shot of the goals
  // step stops here, and everything else carries on with the defaults.
  await page.locator("button.btn-primary:visible").last().click();
  await page.waitForURL("**#/priorities");
  if (stop === "goals") return;
  await page.locator("button.btn-primary:visible").last().click();
  await page.waitForURL("**#/results");
}

/**
 * Come back to the app the way a person does the next day: same device, same
 * stored data, nothing left in memory.
 *
 * The reload is what makes it a *revisit* rather than a navigation. A `goto`
 * that differs from the current address only in its hash doesn't reload the
 * document, so the working draft — the coordinates, the sun answer, the
 * moisture just picked — would still be sitting in memory, and the page would
 * show those instead of what the device genuinely remembers. Which is exactly
 * the difference the shot is meant to prove.
 */
async function comeBackLater(page, base, route) {
  const hash = route.startsWith("#") ? route : `#${route}`;
  await page.goto(new URL(hash, base).href, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
}

/** Open the first plant in the ranked list, the way a reader does: by tapping
 *  its card. */
async function tapFirstPick(page) {
  await page.locator("article.plant-pick a.plant-pick-link").first().click();
  await page.waitForURL("**#/plants/**");
}
