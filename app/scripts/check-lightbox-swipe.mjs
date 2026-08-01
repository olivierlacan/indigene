// Drive real touch gestures at the photo lightbox and check where they land:
// a swipe must page the reel exactly as the ‹ › buttons do, and a scroll or a
// twitch must leave it alone. Chromium's touch input produces genuine
// pointerType:"touch" events, so this exercises the real listeners.
//
//   npx http-server dist -p 4174 -s &
//   node scripts/check-lightbox-swipe.mjs [baseUrl]
//
// Exits non-zero if any check fails. iNaturalist is stubbed the same way
// scripts/shoot-sightings.mjs stubs it — the container has no route to the API
// or the photo CDN, and a fixed set of sightings makes the counts assertable.
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4174";
const PHOTO_COUNTS = [4, 4, 2, 1];
const OBSERVERS = ["plain_cherry", "benjaminmiles", "tomcoffin", "sandhill_jo"];

const results = PHOTO_COUNTS.map((n, o) => ({
  id: 1000 + o,
  taxon: { id: 48662, name: "Agraulis vanillae" },
  user: { login: OBSERVERS[o] },
  place_guess: "Lake County, FL, USA",
  observed_on: "2026-07-02",
  geojson: { coordinates: [-82.46 + o * 0.02, 27.95 + o * 0.02] },
  photos: Array.from({ length: n }, (_, p) => ({
    id: (o + 1) * 100 + p,
    url: `https://inaturalist-open-data.s3.amazonaws.com/photos/${(o + 1) * 100 + p}/square.jpg`,
    license_code: "cc-by-nc",
    attribution: `(c) ${OBSERVERS[o]}, some rights reserved (CC BY-NC)`,
  })),
}));

const placeholder = (id) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="hsl(${(id % 7) * 40} 40% 55%)"/>
  <text x="50" y="55" text-anchor="middle" font-size="10">${id}</text></svg>`;

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
// A page sitting on the wildlife section with `obs` as the sightings it found.
// Each call gets its own context: the app keeps what it fetched, so a reload
// would show the previous set.
async function openWildlifePage(obs) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
    isMobile: true,
    hasTouch: true,
    serviceWorkers: "block",
    geolocation: { latitude: 27.95, longitude: -82.46 },
    permissions: ["geolocation"],
  });
  await context.route("**/v1/taxa*", (r) => r.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ results: [{ id: 48662, name: "Agraulis vanillae", rank: "species", is_active: true }] }),
  }));
  await context.route("**/v1/observations*", (r) =>
    r.fulfill({ contentType: "application/json", body: JSON.stringify({ results: obs }) }));
  await context.route("**/photos/**", (r) => {
    const id = Number(r.request().url().match(/photos\/(\d+)\//)?.[1] ?? 100);
    r.fulfill({ contentType: "image/svg+xml", body: placeholder(id) });
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await page.goto(`${base}/#/wildlife/gulf-fritillary`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /My location/ }).click();
  await page.locator(".obs-tile").first().waitFor();
  await page.waitForTimeout(900);
  return { context, page, cdp };
}

let { context, page, cdp } = await openWildlifePage(results);

// A real finger: touchstart, a run of touchmoves, touchend. Chromium turns
// these into pointer events with pointerType "touch", which is what the
// lightbox listens for.
async function swipe({ from, to, y = 0, steps = 12, ms = 16 }) {
  const box = await page.locator(".lb-stage").boundingBox();
  const cy = box.y + box.height / 2;
  const pt = (x, dy = 0) => [{ x: box.x + x, y: cy + dy, id: 1 }];
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(from) });
  for (let i = 1; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    const dy = (y * i) / steps;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(x, dy) });
    await new Promise((r) => setTimeout(r, ms));
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [{ x: box.x + to, y: cy + y, id: 1 }],
  });
  await page.waitForTimeout(250);
}

const counter = () => page.locator(".lb-counter").innerText();

// Open on the second sighting's first photo: reel position 5 of 11.
await page.locator(".obs-tile").nth(4).tap(); // 5th photo overall: sighting 2, photo 1
await page.locator(".lb-stage").waitFor();
await page.waitForTimeout(500);

const checks = [];
const record = async (name, expect) => {
  const got = (await counter()).replace(/\s+/g, " ").trim();
  checks.push([name, expect, got, got.startsWith(expect)]);
};

await record("opened on the tapped photo", "5 / 11");

await swipe({ from: 300, to: 90 });          // long drag left
await record("swipe left → next", "6 / 11");

await swipe({ from: 90, to: 300 });          // long drag right
await record("swipe right → previous", "5 / 11");

await swipe({ from: 300, to: 265, steps: 4, ms: 8 }); // quick flick left, 35px
await record("quick flick left → next", "6 / 11");

await swipe({ from: 200, to: 190, steps: 6, ms: 40 }); // 10px, slow: no paging
await record("small slow drag stays put", "6 / 11");

await swipe({ from: 300, to: 120, y: 260 });  // mostly vertical: a scroll
await record("vertical drag stays put", "6 / 11");

// The buttons must still work under touch after all that.
await page.locator(".lb-next").tap();
await page.waitForTimeout(250);
await record("‹ › buttons still work", "7 / 11");

// Wrap-around, same as the buttons: swipe right from photo 1 lands on the last.
for (let i = 0; i < 6; i++) await swipe({ from: 90, to: 300 });
await record("swipe right wraps to the end", "1 / 11");
await swipe({ from: 90, to: 300 });
await record("…and past the start to the last", "11 / 11");

// Transform must be cleared after every gesture — no photo left off-centre.
const left = await page.locator(".lb-img").evaluate((n) => n.style.transform || "(none)");
checks.push(["photo re-centred after release", "(none)", left, left === "(none)"]);

// A reel of one: nothing to page to, so a swipe must leave the photo alone —
// same as the ‹ › buttons, which paint hidden.
await context.close();
({ context, page, cdp } = await openWildlifePage([results[3]]));
await page.locator(".obs-tile").first().tap();
await page.locator(".lb-stage").waitFor();
await page.waitForTimeout(500);
const solo = await page.locator(".lb-img").getAttribute("src");
await swipe({ from: 300, to: 90 });
const stillSolo = await page.locator(".lb-img").getAttribute("src");
const same = solo === stillSolo;
checks.push(["one photo: swipe does nothing", "same photo", same ? "same photo" : "changed!", same]);
const navHidden = await page.locator(".lb-next").isHidden();
checks.push(["one photo: › stays hidden", "hidden", navHidden ? "hidden" : "shown", navHidden]);

for (const [name, expect, got, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: expected ${expect}, got ${got}`);
}
await browser.close();
process.exit(checks.every((c) => c[3]) ? 0 : 1);
