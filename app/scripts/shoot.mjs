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
//   --tiles DIR           answer OpenStreetMap tile requests from a local
//                         mirror laid out like the URLs (DIR/<z>/<x>/<y>.png),
//                         for the same reason as --photos: the map pictures on
//                         the Saved and Settings pages otherwise race the
//                         network, and can't be captured at all in a sandbox
//                         with no way out
//   --photos DIR          answer iNaturalist photo requests from a local
//                         mirror instead of the network — see below
//   --api FILE            answer iNaturalist *API* requests from a local
//                         mirror, for the same reason and on the same terms as
//                         --photos: the bodies are real responses, saved with
//                         curl, so the shot is the truth — fetched from disk so
//                         it is the same truth every time, and capturable where
//                         the browser has no outbound network at all. FILE is a
//                         JSON array of `{ "match": ["substring", …], "file":
//                         "body.json" }` rules, tried in order against the full
//                         request URL; paths are relative to FILE. A request
//                         matching no rule is failed rather than fetched, so a
//                         missing rule shows up as the feature reporting no
//                         answer instead of quietly going to the network.
//   --home-screen         pretend the app was opened from an iOS Home Screen
//                         icon rather than in Safari — an iPhone user agent
//                         plus `navigator.standalone`, which is what
//                         lib/standalone.ts reads. The only way to photograph
//                         the things that exist solely in an installed app: the
//                         menu's Reload row, and the pull-down below
//   --pull PX             drag the page down PX pixels from the top and hold,
//                         without letting go, so the capture catches the
//                         pull-to-reload pill mid-gesture. Needs --home-screen
//                         (the gesture doesn't exist anywhere else)
//   --remember-spot lat,lon
//                         write the spot this device remembers, the way the app
//                         writes it when somebody gives one (`lib/sticky.ts`),
//                         then reload. For the pages that answer something
//                         about the reader's own ground without being asked —
//                         they only have anything to say once a spot has been
//                         given, and a spot given *last visit* is the state a
//                         URL can otherwise never reach
//   --seed-garden         put an example saved spot, planting log, last-spot
//                         memory and the town it was found in into the device's
//                         storage before shooting. The Saved list and
//                         a spot's own page only exist once somebody has one,
//                         and a log worth photographing has entries years old —
//                         which no walk through the app can produce in the
//                         second a capture takes. See `seedGarden` below for
//                         exactly what is written; it is the same shape the app
//                         itself writes, through the app's own database.
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
import { dirname, extname, join, resolve } from "node:path";
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
const seedGardenFlag = has("--seed-garden");
const rememberSpot = flag("--remember-spot", "");
const api = flag("--api", "");
const homeScreen = has("--home-screen");
const pull = Number(flag("--pull", "0"));
const tiles = flag("--tiles", "");
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
  // A mirror only works if the page's own requests are the ones intercepted.
  // The built app registers a service worker, and a service worker's fetches
  // are *its* requests, not the page's — Playwright's routing never sees them,
  // so a mirrored photo went to the real network behind our back and came back
  // empty in a sandbox with no way out. Blocked whenever a mirror is in use,
  // and only then: everywhere else the service worker is part of what is being
  // photographed.
  ...(photos || api || tiles ? { serviceWorkers: "block" } : {}),
  viewport: { width: vw, height: vh },
  deviceScaleFactor: dpr,
  colorScheme: scheme,
  locale,
  isMobile: true,
  hasTouch: true,
  // An installed app is a *Safari* window without its chrome, so the shot has
  // to be taken as Safari: the detection asks for iOS first (lib/standalone.ts)
  // and Chromium's own user agent would fail it before anything else was read.
  ...(homeScreen
    ? {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      }
    : {}),
  ...(geo
    ? { geolocation: { latitude: geoLat, longitude: geoLon }, permissions: ["geolocation"] }
    : {}),
});
// The other half of --home-screen: Safari's own "you are installed" flag. It is
// read-only and browser-set, so it has to be defined before the app's first
// line runs.
if (homeScreen) {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "standalone", { value: true, configurable: true });
  });
}

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
// The map-tile mirror, for the same reason and on the same terms as --photos:
// a tile URL names one square of the world at one zoom, so a file on disk is a
// complete and permanent answer, and it makes the map pictures capturable where
// the browser has no outbound network at all. Mirror what a shot needs with
// curl (tile.openstreetmap.org/<z>/<x>/<y>.png → DIR/<z>/<x>/<y>.png); a tile
// the mirror doesn't have is failed rather than fetched, so a missing file
// shows up as the schematic grid the app itself falls back to.
if (tiles) {
  const root = resolve(tiles);
  await page.route("https://tile.openstreetmap.org/**", (route) => {
    const file = join(root, new URL(route.request().url()).pathname);
    if (!file.startsWith(root) || !existsSync(file)) return route.abort();
    route.fulfill({ body: readFileSync(file), contentType: "image/png" });
  });
}
if (api) {
  const rulesPath = resolve(api);
  const root = dirname(rulesPath);
  const rules = JSON.parse(readFileSync(rulesPath, "utf8"));
  await page.route("https://api.inaturalist.org/**", (route) => {
    const target = route.request().url();
    const rule = rules.find((r) => r.match.every((m) => target.includes(m)));
    if (!rule) return route.abort();
    route.fulfill({ body: readFileSync(join(root, rule.file)), contentType: "application/json" });
  });
}
await page.goto(url, { waitUntil: "networkidle" });
if (seedGardenFlag) await seedGarden(page);
if (rememberSpot) await rememberDeviceSpot(page, rememberSpot);
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
if (pull) await holdPull(page, pull, vw);
if (unstick) {
  // Only what actually sticks. A blanket `*{position:static}` also flattens
  // every *absolutely* positioned child onto the end of its parent — which
  // silently dropped the pin and the OpenStreetMap credit off the map pictures,
  // photographing a card that no reader ever sees.
  await page.evaluate(() => {
    for (const node of document.querySelectorAll("*")) {
      const pos = getComputedStyle(node).position;
      if (pos === "sticky" || pos === "fixed") node.style.position = "static";
    }
  });
  await page.waitForTimeout(200);
}
if (shootEl) await page.locator(shootEl).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`shot: ${url} → ${out} (${vw}x${vh} @${dpr}x, ${scheme}, ${locale}${picks ? ", ranked picks" : ""}${fullPage ? ", full-page" : ""})`);

/**
 * Drag the page down from the top and stop there, finger still down.
 *
 * Playwright's touchscreen can tap and nothing else, so the three events go in
 * by hand. No `touchend`: letting go is what reloads the page, and the state
 * worth photographing is the one just before that.
 */
async function holdPull(page, distance, width) {
  await page.evaluate(
    ([x, distance]) => {
      const send = (type, y) => {
        const touch = new Touch({ identifier: 1, target: document.body, clientX: x, clientY: y });
        document.body.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: [touch],
            targetTouches: [touch],
            changedTouches: [touch],
          })
        );
      };
      const from = 180;
      send("touchstart", from);
      // In steps, because the first move is what decides the gesture's
      // direction and the rest is what follows it.
      for (let d = 10; d <= distance; d += 10) send("touchmove", from + d);
    },
    [Math.round(width / 2), distance]
  );
  await page.waitForTimeout(300);
}

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

/**
 * Give the device the memory of a spot, then reload so the app boots with it.
 *
 * The same record `rememberSpot` writes — coordinates together with the sun and
 * soil answers given for that ground — under the same `sticky` key. Sun and
 * moisture are left unanswered here: a spot is remembered from the moment its
 * coordinates are, and the readings that come with it are a different feature's
 * business.
 */
async function rememberDeviceSpot(page, at) {
  const [lat, lon] = at.split(",").map(Number);
  await page.evaluate(async ({ lat, lon }) => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("indigene");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const spot = {
      lat, lon,
      regionId: null,
      sun: null,
      horizon: null,
      deciduousOverhead: false,
      moisture: null,
      savedAt: Date.now(),
    };
    await new Promise((resolve, reject) => {
      const req = db.transaction("kv", "readwrite").objectStore("kv").put({ spot }, "sticky");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }, { lat, lon });
  await page.reload({ waitUntil: "networkidle" });
}

/**
 * Write one saved spot and a few dated plantings into the app's own database,
 * then reload so the app reads them the way it reads a returning visitor's.
 *
 * The first `goto` is what creates the database — the app opens it on boot —
 * so this opens it with no version of its own and simply puts records in the
 * stores that are there. A build that predates a store (the "before" half of a
 * comparison) is missing `plantings`, and that's fine: the spot still lands, so
 * both halves of the pair show a Saved list with something in it.
 *
 * The dates are what a walk through the app can't produce: a bed planted over
 * three years, so the log shows a plant past its first year beside one just in.
 */
async function seedGarden(page) {
  const spot = {
    id: "example-spot",
    createdAt: Date.UTC(2023, 3, 8),
    label: "Front bed, north side",
    lat: 40.0379,
    lon: -75.3557,
    site: null,
    sun: { hours: 4.5, low: 3.5, high: 5.5, label: "part shade", deciduousAdjusted: false, source: "manual" },
    horizon: null,
    soilOverride: null,
    deciduousOverhead: false,
    regionOverride: null,
    weights: { host: 3, pollinator: 2, bird: 2, stormwater: 1, erosion: 1, carbon: 1, establishment: 2 },
  };
  const plantings = [
    { id: "p1", spotId: spot.id, plantId: "cercis-canadensis", count: 1,
      planted: { year: 2023, month: 4 }, observations: [], createdAt: Date.UTC(2023, 3, 8) },
    // Two sightings the gardener posted of their own plant, linked back to the
    // row it belongs to — the feature that stands in for progress photos.
    { id: "p2", spotId: spot.id, plantId: "asclepias-tuberosa", count: 6,
      planted: { year: 2024, month: 5, day: 18 },
      // One linked by its number, one by the UUID iNaturalist copies for you.
      observations: ["373658728", "776ee855-bf3d-4030-8c45-4c8424b03a56"],
      createdAt: Date.UTC(2024, 4, 18) },
    { id: "p3", spotId: spot.id, plantId: "ilex-verticillata", count: 2,
      planted: { year: 2026 }, observations: [], createdAt: Date.UTC(2026, 2, 1) },
  ];
  await page.evaluate(async ({ spot, plantings }) => {
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open("indigene");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const put = (store, value) =>
      new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains(store)) return resolve();
        const req = db.transaction(store, "readwrite").objectStore(store).put(value);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    await put("spots", spot);
    for (const p of plantings) await put("plantings", p);
    // The town this device was told while the spot was being found, keyed the
    // way lib/places.ts keys it (one name per ~5 km cell). Without it the pages
    // show only coordinates — which is what they do for anyone who saved a spot
    // offline, but not what a screenshot of the feature should show.
    await new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains("kv")) return resolve();
      const cell = (v) => (Math.round(v / 0.05) * 0.05).toFixed(2);
      const req = db.transaction("kv", "readwrite").objectStore("kv").put(
        { [`${cell(spot.lat)},${cell(spot.lon)}`]: "Radnor, Pennsylvania" },
        "towns"
      );
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    // The same ground as the last spot the device remembers, so Settings'
    // "Your last spot" card has something to show. A walk through the app can
    // only leave a *region* there without a GPS fix, and a card whose whole
    // subject is a point on the ground needs a point.
    await new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains("kv")) return resolve();
      const req = db.transaction("kv", "readwrite").objectStore("kv").put({
        spot: {
          lat: spot.lat,
          lon: spot.lon,
          regionId: null,
          sun: spot.sun,
          horizon: null,
          deciduousOverhead: false,
          moisture: "dry",
          savedAt: spot.createdAt,
        },
      }, "sticky");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }, { spot, plantings });
  // A reload, not a `goto`: the address is already the page being photographed,
  // and a goto that changes nothing but the hash doesn't reload — the app would
  // still be showing the empty list it drew before the records landed.
  await page.reload({ waitUntil: "networkidle" });
}
