// Which region plant lists does each page actually download?
//
//   npm run chunks:check          # against a build already served on :4174
//   npm run chunks:check -- 4173  # or another port
//
// Each region's plant list is a separate file, fetched only when a page needs
// it (see `src/data/regions.ts`). That saving is easy to lose by accident: one
// ordinary `import` of a region's list from a shared module, or one page that
// walks `REGIONS` calling `loadPlants`, and the browser is back to downloading
// all nine — with nothing visibly wrong to notice in review.
//
// So the budgets below are the design, written down. A page listed at 0 must
// download no plant lists at all; a plant page gets the region (or two) that
// actually carries the plant, never more. When a number here has to go up, that
// is a real decision about what readers download, and it should be made on
// purpose rather than discovered later in a bundle report.
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const port = process.argv[2] ?? "4174";
const BASE = `http://127.0.0.1:${port}`;

/** `max` is how many region plant lists the page may fetch; `note` says why. */
const PAGES = [
  { label: "home", path: "/#/", max: 0 },
  { label: "explore (9 region cards)", path: "/#/regions", max: 0, note: "counts come from the registry" },
  { label: "browse", path: "/#/browse", max: 0 },
  { label: "all plants index", path: "/#/plants", max: 0, note: "the search index is the registry" },
  { label: "plant page (one region)", path: "/#/plants/baptisia-australis", max: 1 },
  { label: "plant page (one region)", path: "/#/plants/ribes-sanguineum", max: 1 },
  { label: "plant page (two regions)", path: "/#/plants/quercus-virginiana", max: 2, note: "native to both Florida lists" },
  { label: "region page", path: "/#/regions/pnw", max: 1 },
  { label: "wildlife index", path: "/#/wildlife", max: 0, note: "counted from the tie table" },
  { label: "wildlife page", path: "/#/wildlife/monarch", max: 4, note: "the regions that tie to it" },
  { label: "look-alikes index", path: "/#/lookalikes", max: 9, note: "resolves natives in every region" },
  { label: "propagation index", path: "/#/planting", max: 0 },
];

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});

let failures = 0;
for (const { label, path, max, note } of PAGES) {
  const ctx = await browser.newContext({ serviceWorkers: "block" });
  const page = await ctx.newPage();
  // Photos live on iNaturalist's buckets; this is about our own JavaScript, and
  // a sandbox with no route out would otherwise never let the page settle.
  await page.route((url) => url.hostname !== "127.0.0.1", (r) => r.abort());

  const chunks = new Set();
  const errors = [];
  page.on("request", (r) => {
    const m = /\/assets\/(plants\.[a-z-]+)-/.exec(r.url());
    if (m) chunks.add(m[1].slice("plants.".length));
  });
  page.on("console", (m) => {
    const text = m.text();
    if (m.type() === "error" && !/ERR_FAILED|ERR_CONNECTION/.test(text)) errors.push(text);
  });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1800);
  const drew = (await page.locator("body").innerText()).trim().length > 40;
  await ctx.close();

  const list = [...chunks].sort();
  const over = list.length > max;
  const bad = over || !drew || errors.length;
  if (bad) failures++;
  const got = list.length ? `${list.length}: ${list.join(", ")}` : "none";
  console.log(`  ${bad ? "FAIL" : "ok  "} ${label.padEnd(26)} ≤${max}  got ${got}${note && !bad ? `  (${note})` : ""}`);
  if (over) console.log(`       over budget — did something start reaching for every region?`);
  if (!drew) console.log(`       the page rendered almost nothing`);
  for (const e of errors.slice(0, 3)) console.log(`       console error: ${e.slice(0, 160)}`);
}

await browser.close();
console.log(
  failures === 0
    ? `\nchunks: every page downloads only the region lists it needs (${PAGES.length} pages).`
    : `\n${failures} page(s) outside their budget.`
);
process.exit(failures === 0 ? 0 : 1);
