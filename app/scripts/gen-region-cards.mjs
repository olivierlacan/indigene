// Draws one share card per region — the picture an unfurler shows beside a
// "/regions/<id>" link. Until now every region page shared the generic site card.
//
//   node scripts/gen-region-cards.mjs                 # every region
//   node scripts/gen-region-cards.mjs pnw mid-atlantic
//   node scripts/gen-region-cards.mjs --check
//
// Writes public/og/regions/<id>.jpg at 1200×630, committed like the plant,
// planting, wildlife, look-alike and page cards; `scripts/prerender.mjs` points
// each region page at its own.
//
// ## What's on it, and the map
//
// A region is about *place*, so the card carries the region's own map — the same
// drawn SVG the page shows (`public/maps/<id>.svg`), which already carries a
// handful of named cities so a reader can find themselves on it (the rule in
// CLAUDE.md: a map needs somewhere to stand). The map is theme-aware, so the
// card is rendered in dark mode and the map paints its dark palette — a dim
// landmass, the region washed in brand green, and cream city labels with a dark
// halo that stay legible on the card's dark ground.
//
// Beside it: the region's name, the reference place its numbers are tuned to,
// and a figure line — how many native plants it lists, how many are keystones,
// and how many animals those plants support. English, like every other card.
//
// ## Cost / re-runs
//
// Same as the sibling generators — no image library (Playwright renders a small
// HTML page), committed output, JPEG 90. Re-run when the design changes, a
// region is added, or a region's roster/map changes; `--check` reports what's
// missing or stale.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "regions");
const mapsDir = join(root, "public", "maps");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const BRAND = "#7ec894";

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="46" height="46"');

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The region's map, scaled to fit the card's right column while keeping its
 *  aspect ratio. The file carries width/height and a viewBox; we swap the
 *  width/height for the fitted size and leave the viewBox to do the scaling. */
function mapSvg(id) {
  const raw = readFileSync(join(mapsDir, `${id}.svg`), "utf8");
  const vb = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(raw);
  const w = vb ? parseFloat(vb[1]) : 640;
  const h = vb ? parseFloat(vb[2]) : 640;
  const maxW = 400;
  const maxH = 380;
  const scale = Math.min(maxW / w, maxH / h);
  const dw = Math.round(w * scale);
  const dh = Math.round(h * scale);
  // Replace the leading width/height attributes with the fitted ones.
  return raw.replace(
    /<svg([^>]*?)width="[^"]*"([^>]*?)height="[^"]*"/,
    `<svg$1width="${dw}"$2height="${dh}"`
  );
}

/** The name steps down by length; region names are irreducible proper nouns
 *  ("Mid-Atlantic / Northeast Piedmont"), so they may take up to three lines. */
function nameSize(name) {
  if (name.length <= 16) return 62;
  if (name.length <= 28) return 50;
  return 40;
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function cardHtml({ name, reference, stat, map }) {
  return `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #14160f; color: #f2f1e8;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 52px 72px 48px; position: relative; overflow: hidden;
  }
  .wash {
    position: absolute; left: -200px; bottom: -280px;
    width: 820px; height: 820px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.5;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  .badge {
    margin-left: auto; font-size: 23px; font-weight: 700; color: #14160f;
    background: ${BRAND}; border-radius: 999px; padding: 9px 20px;
  }
  .mid { position: relative; display: flex; align-items: center; gap: 40px; flex: 1; min-height: 0; }
  .words { min-width: 0; flex: 1; }
  h1 { font-weight: 800; letter-spacing: -0.025em; line-height: 1.06; font-size: ${nameSize(name)}px; }
  .ref { margin-top: 16px; font-size: 28px; line-height: 1.3; color: ${BRAND}; max-width: 18ch; }
  .map { flex: none; display: grid; place-items: center; }
  .map svg { display: block; }
  .foot { position: relative; display: flex; align-items: baseline; }
  .stat { font-size: 26px; color: #cdcdbd; }
  .stat b { color: #f2f1e8; font-weight: 800; }
  .url { margin-left: auto; font-size: 24px; font-weight: 650; color: ${BRAND}; }
</style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Region</span></header>
<div class="mid">
  <div class="words">
    <h1>${esc(name)}</h1>
    <div class="ref">${esc(reference)}</div>
  </div>
  <div class="map" aria-hidden="true">${map}</div>
</div>
<div class="foot"><div class="stat">${stat}</div><div class="url">indigene.app</div></div>`;
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let regions;
try {
  const [{ REGIONS, loadPlants }, { wildlifeCountForRegion }] = await Promise.all([
    loader.load("/src/lib/plants.ts"),
    loader.load("/src/lib/wildlife.ts"),
  ]);
  regions = [];
  for (const r of REGIONS) {
    const plants = await loadPlants(r);
    const keystone = plants.filter((p) => p.keystone).length;
    const wildlife = wildlifeCountForRegion(r.meta.id);
    const parts = [`<b>${plants.length}</b> native plants`];
    if (keystone) parts.push(plural(`<b>${keystone}</b>`, "keystone", "keystones"));
    if (wildlife) parts.push(`<b>${wildlife}</b> wildlife`);
    regions.push({
      slug: r.meta.id,
      name: r.meta.name,
      reference: r.meta.reference,
      stat: parts.join(" · "),
      map: existsSync(join(mapsDir, `${r.meta.id}.svg`)) ? mapSvg(r.meta.id) : "",
    });
  }
} finally {
  await loader.close();
}

const wanted = only.size ? regions.filter((r) => only.has(r.slug)) : regions;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !regions.some((r) => r.slug === s));
  throw new Error(`gen-region-cards: no such region: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = regions.filter((r) => !have.has(r.slug)).map((r) => r.slug);
  const extra = [...have].filter((slug) => !regions.some((r) => r.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for a region that no longer exists: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${regions.length} region cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
// Dark scheme, so the theme-aware map paints its dark palette on the dark card.
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, colorScheme: "dark" });
const page = await context.newPage();

async function overflows() {
  return page.evaluate(() => {
    const bad = [];
    const mid = document.querySelector(".mid");
    if (mid && mid.scrollWidth > mid.clientWidth + 1) bad.push(`the name and map are ${mid.scrollWidth - mid.clientWidth}px too wide`);
    if (mid && mid.scrollHeight > mid.clientHeight + 1) bad.push(`the middle row is ${mid.scrollHeight - mid.clientHeight}px too tall`);
    for (const el of document.querySelectorAll("h1, .ref, .stat")) {
      const lines = el.getClientRects().length;
      const allowed = el.classList.contains("stat") ? 1 : 3;
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    return bad;
  });
}

let n = 0;
for (const card of wanted) {
  await page.setContent(cardHtml(card), { waitUntil: "load" });
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-region-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
  }
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
  n++;
}
await browser.close();

if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !regions.some((r) => `${r.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} region cards into public/og/regions/ at ${W}×${H}`);
