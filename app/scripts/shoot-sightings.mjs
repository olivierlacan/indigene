// Screenshot the "See it near you" sightings section with iNaturalist stubbed.
// The container has no route to api.inaturalist.org (or to the photo CDN), so
// the API responses and the photos themselves are stand-ins — each placeholder
// says which sighting and which photo it is, which is exactly what the change
// is about.
//
//   node shoot-sightings.mjs <baseUrl> <out.png> [--scheme dark|light]
//        [--mode cards|lightbox] [--dpr 3] [--step N]
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args.splice(i, 2)[1];
};
const scheme = flag("--scheme", "dark");
const mode = flag("--mode", "cards");
const dpr = Number(flag("--dpr", "3"));
const step = Number(flag("--step", "0"));
const [base, out] = args;

// Four sightings, with 4 / 4 / 2 / 1 photos — the shape in the report: two
// clusters that overflow a row, then smaller ones.
const PHOTO_COUNTS = [4, 4, 2, 1];
const OBSERVERS = ["plain_cherry", "benjaminmiles", "tomcoffin", "sandhill_jo"];
const PLACES = [
  "17th Av @ 16th St, Tampa, FL 33605, USA",
  "Aurora Rd. / Avocado Rd NE Corner, Melbourne, FL 32935, USA",
  "Lake County, FL, USA",
  "Hillsborough River State Park, FL, USA",
];
const DATES = ["2026-07-02", "2026-07-09", "2026-07-14", "2026-06-28"];

const results = PHOTO_COUNTS.map((n, o) => ({
  id: 1000 + o,
  taxon: { id: 48662, name: "Agraulis vanillae" },
  user: { login: OBSERVERS[o] },
  place_guess: PLACES[o],
  observed_on: DATES[o],
  geojson: { coordinates: [-82.46 + o * 0.02, 27.95 + o * 0.02] },
  photos: Array.from({ length: n }, (_, p) => ({
    id: (o + 1) * 100 + p,
    url: `https://inaturalist-open-data.s3.amazonaws.com/photos/${(o + 1) * 100 + p}/square.jpg`,
    license_code: "cc-by-nc",
    attribution: `(c) ${OBSERVERS[o]}, some rights reserved (CC BY-NC)`,
  })),
}));

// A stand-in photo: green field, an orange butterfly-ish shape, and a label
// naming the sighting and photo so paging is legible in a screenshot.
function placeholder(id) {
  const o = Math.floor(id / 100) - 1;
  const p = (id % 100) + 1;
  const hue = 95 + o * 22;
  const cx = 40 + ((p * 17) % 40);
  const cy = 45 + ((p * 11) % 30);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 34% 62%)"/>
      <stop offset="1" stop-color="hsl(${hue} 30% 42%)"/>
    </linearGradient></defs>
    <rect width="100" height="100" fill="url(#g)"/>
    <ellipse cx="${cx - 8}" cy="${cy}" rx="9" ry="13" fill="#e08a2e" stroke="#3a2410" stroke-width="2"/>
    <ellipse cx="${cx + 8}" cy="${cy}" rx="9" ry="13" fill="#e08a2e" stroke="#3a2410" stroke-width="2"/>
    <rect x="${cx - 1.5}" y="${cy - 12}" width="3" height="24" rx="1.5" fill="#3a2410"/>
    <text x="50" y="93" text-anchor="middle" font-family="sans-serif" font-size="9"
      fill="#f6f5ec" opacity="0.92">sighting ${o + 1} · photo ${p}</text>
  </svg>`;
}

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: dpr,
  colorScheme: scheme,
  isMobile: true,
  hasTouch: true,
  serviceWorkers: "block",
  geolocation: { latitude: 27.95, longitude: -82.46 },
  permissions: ["geolocation"],
});

await context.route("**/v1/taxa*", (route) =>
  route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ results: [{ id: 48662, name: "Agraulis vanillae", rank: "species", is_active: true }] }),
  }));
await context.route("**/v1/observations*", (route) =>
  route.fulfill({ contentType: "application/json", body: JSON.stringify({ results }) }));
await context.route("**/photos/**", (route) => {
  const id = Number(route.request().url().match(/photos\/(\d+)\//)?.[1] ?? 100);
  route.fulfill({ contentType: "image/svg+xml", body: placeholder(id) });
});

const page = await context.newPage();
await page.goto(`${base}/#/wildlife/gulf-fritillary`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Use my location/ }).click();
await page.locator(".obs-card").first().waitFor();
await page.waitForTimeout(900);

if (mode === "lightbox") {
  // Open on the second sighting's first photo, then page forward `step` times.
  await page.locator(".obs-card").nth(1).locator(".obs-thumb").first().click();
  for (let i = 0; i < step; i++) {
    await page.locator(".lb-next").click();
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: out });
} else {
  // Park the list under the sticky header, with the "found N sightings" line
  // above it still in frame.
  const top = await page.locator(".obs-list").evaluate((n) => n.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 150), top);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out });
}
await browser.close();
console.log(`shot: ${base} → ${out} (${mode}, ${scheme})`);
