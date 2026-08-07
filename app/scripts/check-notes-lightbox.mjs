// Drive the What's new page's picture viewer and check where each control
// lands: the Before/After links and the thumbnail must open the release's reel
// in place, the ‹ › buttons and the ← → keys must page it the same way, and
// Escape / the backdrop must put it away and give focus back.
//
//   npm run release-notes            (or a full `npm run build`)
//   npx http-server dist -p 4174 -s &
//   node scripts/check-notes-lightbox.mjs [baseUrl]
//
// Exits non-zero if any check fails. The pictures themselves are stubbed: they
// live on raw.githubusercontent.com, which the container can't reach, and what
// is being checked here is the viewer, not GitHub.
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4174";

const failures = [];
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  console.log(`  ${ok ? "ok  " : "FAIL"} ${label}`);
};

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
// One flat green pixel for every screenshot the page links to.
await page.route("https://raw.githubusercontent.com/**", (route) =>
  route.fulfill({
    contentType: "image/svg+xml",
    body: `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844"><rect width="390" height="844" fill="#175e33"/></svg>`,
  }),
);

const caption = () => page.locator(".lb-caption").textContent();
const counter = () => page.locator(".lb-counter").textContent();
const open = () => page.locator(".lb-overlay").count();

for (const [where, url] of [
  ["index", `${base}/release-notes/`],
  ["release page", `${base}/release-notes/0.24/`],
]) {
  console.log(`\n=== ${where} ===`);
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Every anchor is still a link to a picture — this page has to work with the
  // script switched off, which is the whole reason the reel lives in the markup.
  const hrefs = await page.locator("a[data-lb]").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  check("every reel link keeps an image href", hrefs.every((h) => /\.(png|jpe?g|webp)$/.test(h ?? "")), true);
  check("viewer starts closed", await open(), 0);

  const article = page.locator("article.release[data-version='0.24']");
  await article.locator("p.shots a").first().click();
  check("a Before link opens the viewer", await open(), 1);
  check("…on the picture it names", await caption(), "The region list before");
  check("…at the head of the reel", await counter(), "1 / 3");

  await page.keyboard.press("ArrowRight");
  check("→ pages on", await caption(), "and after");
  check("…and counts", await counter(), "2 / 3");

  await page.locator(".lb-next").click();
  check("› reaches the release's own picture", await counter(), "3 / 3");

  await page.keyboard.press("ArrowRight");
  check("→ wraps at the end", await counter(), "1 / 3");
  await page.locator(".lb-prev").click();
  check("‹ wraps at the start", await counter(), "3 / 3");

  await page.keyboard.press("Escape");
  check("Escape closes it", await open(), 0);
  check(
    "…and gives focus back to the link",
    await page.evaluate(() => document.activeElement?.getAttribute("data-lb-label")),
    "The region list before",
  );

  await article.locator("a.thumb").click();
  check("the thumbnail opens the viewer", await open(), 1);
  check("…at its own picture", await counter(), "3 / 3");
  // A click on the backdrop, away from the panel.
  await page.mouse.click(2, 2);
  check("the backdrop closes it", await open(), 0);
}

// 0.23's thumbnail *is* its "after" shot: one picture in the reel, not two.
console.log("\n=== a thumbnail that is also the after shot ===");
await page.goto(`${base}/release-notes/`, { waitUntil: "domcontentloaded" });
const v23 = page.locator("article.release[data-version='0.23']");
await v23.locator("a.thumb").click();
check("the reel holds it once", await counter(), "2 / 2");
check("…named as the shot, not the thumbnail", await caption(), "After");
await page.keyboard.press("Escape");

await browser.close();

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("\nAll picture-viewer checks passed.");
