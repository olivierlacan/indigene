// Draws the share card for the app's standing pages — the ones a person reaches
// from the footer or the top nav, not from a catalog: the guide, the What's-new
// notes, About, the sources page, Privacy, and the section indexes (plants,
// regions, wildlife, browse). Until now every one of these showed the generic
// site-wide card.
//
//   node scripts/gen-page-cards.mjs            # all of them
//   node scripts/gen-page-cards.mjs guide about
//   node scripts/gen-page-cards.mjs --check
//
// Writes public/og/pages/<slug>.jpg at 1200×630, committed like the plant,
// planting, wildlife and look-alike cards. `scripts/prerender.mjs` points the
// prerendered pages at them; the guide and the release notes are built by their
// own scripts (build-guide.mjs, build-release-notes.mjs), which reference these
// same files.
//
// These are landing pages, not a portrait of one plant or animal, so the card is
// type-forward — a title and a plain-words subtitle in the app's own voice, the
// brand mark alongside, and a figure or two where the page has one — the same
// shape the propagation index card set. The words are English for the same
// reason every other card is: a query string can't pick a file.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "pages");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const BRAND = "#7ec894";

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "");
const wordmarkSvg = mark.replace("<svg", '<svg width="46" height="46"');
const emblemSvg = mark.replace("<svg", '<svg width="230" height="230"');

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The title steps down by length — long page names ("Where our numbers come
 *  from") set smaller so they still fit on two lines beside the mark. */
function titleSize(t) {
  if (t.length <= 16) return 80;
  if (t.length <= 22) return 66;
  return 52;
}

/** A small deterministic generator, so the drawing comes out the same on every
 *  run and the committed card only changes when the code does. */
function seeded(seed) {
  let x = seed >>> 0;
  return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Homegrown National Park's picture: a neighborhood from above, five streets
 *  of five yards, each with its house. Half the yards are still mown lawn; the
 *  other half are native planting — the idea the page is about, drawn. */
function yardsSvg() {
  const rnd = seeded(7);
  const N = 5, LOT = 70, GAP = 12, S = N * LOT + (N - 1) * GAP;
  // Which yards went native: about half, scattered the way real streets are.
  const native = new Set([0, 3, 4, 6, 7, 10, 12, 13, 16, 19, 20, 22, 24]);
  const greens = ["#2f7d48", "#3f9459", "#5fae73", "#7ec894", "#256b3c"];
  const blooms = ["#f0c75e", "#d98bd8", "#f2f1e8", "#e98a6b"];
  let out = "";
  for (let i = 0; i < N * N; i++) {
    const x = (i % N) * (LOT + GAP), y = Math.floor(i / N) * (LOT + GAP);
    const clip = `lot${i}`;
    out += `<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${LOT}" height="${LOT}" rx="8"/></clipPath>`;
    if (native.has(i)) {
      out += `<rect x="${x}" y="${y}" width="${LOT}" height="${LOT}" rx="8" fill="#1b4a2b"/><g clip-path="url(#${clip})">`;
      for (let k = 0; k < 16; k++) {
        const r = 6 + rnd() * 9;
        out += `<circle cx="${(x + rnd() * LOT).toFixed(1)}" cy="${(y + rnd() * LOT).toFixed(1)}" r="${r.toFixed(1)}" fill="${greens[Math.floor(rnd() * greens.length)]}"/>`;
      }
      for (let k = 0; k < 7; k++) {
        out += `<circle cx="${(x + 4 + rnd() * (LOT - 8)).toFixed(1)}" cy="${(y + 4 + rnd() * (LOT - 8)).toFixed(1)}" r="2.6" fill="${blooms[Math.floor(rnd() * blooms.length)]}"/>`;
      }
      out += `</g>`;
    } else {
      out += `<g clip-path="url(#${clip})"><rect x="${x}" y="${y}" width="${LOT}" height="${LOT}" fill="#3c4733"/>`;
      for (let k = 0; k < LOT; k += 14) out += `<rect x="${x + k}" y="${y}" width="7" height="${LOT}" fill="#46523b"/>`;
      out += `</g>`;
    }
    // The house, always in the same corner of its lot: the yards are the subject.
    out += `<rect x="${x + 6}" y="${y + 6}" width="22" height="18" rx="3" fill="#cdc6b0"/><rect x="${x + 6}" y="${y + 6}" width="22" height="7" rx="3" fill="#a89f86"/>`;
  }
  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" aria-hidden="true">${out}</svg>`;
}

function cardHtml({ title, subtitle, stat, art, size }) {
  return `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #14160f; color: #f2f1e8;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 80px 52px; position: relative; overflow: hidden;
  }
  .wash {
    position: absolute; right: -120px; bottom: -300px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.6;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  .mid { position: relative; display: flex; align-items: center; gap: 48px; }
  .words { min-width: 0; }
  h1 { text-wrap: balance; font-weight: 800; letter-spacing: -0.025em; line-height: 1.05; font-size: ${size ?? titleSize(title)}px; }
  .sub { margin-top: 20px; font-size: 31px; line-height: 1.35; color: ${BRAND}; max-width: 22ch; }
  .art .sub { text-wrap: balance; max-width: 21ch; }
  .emblem { margin-left: auto; flex: none; line-height: 0; opacity: 0.9; }
  .foot { position: relative; display: flex; align-items: baseline; }
  .stat { font-size: 27px; color: #cdcdbd; }
  .stat b { color: #f2f1e8; font-weight: 800; }
  .url { margin-left: auto; font-size: 24px; font-weight: 650; color: ${BRAND}; }
</style>
<div class="wash"></div>
<header>${wordmarkSvg}<span class="wordmark">Indigene</span></header>
<div class="mid${art ? " art" : ""}">
  <div class="words">
    <h1>${esc(title)}</h1>
    <div class="sub">${esc(subtitle)}</div>
  </div>
  <div class="emblem" aria-hidden="true">${art ?? emblemSvg}</div>
</div>
<div class="foot">
  <div class="stat">${stat ?? ""}</div>
  <div class="url">indigene.app</div>
</div>`;
}

// ---------------------------------------------------------------------------
// The pages, with curated titles and short subtitles in the app's voice. Kept
// here rather than pulled from the locale because these are English-only card
// words (like the plant cards' facts), and a curated line reads better on a card
// than a clipped page lede — the same choice the propagation index card made.
// ---------------------------------------------------------------------------

const loader = await openLoader();
let pages;
try {
  const [{ REGIONS, loadPlants }, { WILDLIFE }, { SNAPSHOT, bill, round2 }] = await Promise.all([
    loader.load("/src/lib/plants.ts"),
    loader.load("/src/data/wildlife.ts"),
    loader.load("/src/lib/llm-bill.ts"),
  ]);
  const perRegion = await Promise.all(REGIONS.map((r) => loadPlants(r)));
  const totalPlants = perRegion.reduce((n, list) => n + list.length, 0);
  const nRegions = REGIONS.length;
  const nCreatures = WILDLIFE.length;
  const { READING, WORLD_READING, readingRegionIds } = await loader.load("/src/data/reading.ts");
  const nReadingRegions = readingRegionIds().length;
  const nReading = new Set([...WORLD_READING, ...Object.values(READING).flat()].map((r) => r.url)).size;
  // Read as text, not imported: the page module builds DOM. One `{ name: "…" }`
  // row per source in its SOURCES table.
  const nativeSources = (readFileSync(join(root, "src", "steps", "native.ts"), "utf8")
    .match(/^\s*\{ name: "/gm) ?? []).length;

  pages = [
    { slug: "guide", title: "The guide", subtitle: "every part of Indigene, in plain words" },
    { slug: "release-notes", title: "What’s new", subtitle: "every change to Indigene, in plain words" },
    { slug: "about", title: "About Indigene", subtitle: "a native of a place — and what this measures for yours" },
    { slug: "sources", title: "Where our numbers come from", subtitle: "what’s counted, what’s our judgment, and where we’d bet we’re wrong" },
    { slug: "reading", title: "Further reading", subtitle: "the ideas Indigene is built on, and each region’s own books", stat: `<b>${nReading}</b> picks · worldwide & <b>${nReadingRegions}</b> regions` },
    { slug: "confidence", title: "How sure we are", subtitle: "what each confidence level on a plant\u2019s page means" },
    { slug: "privacy", title: "Privacy & safety", subtitle: "what we ask for, what we never do — made safe for everyone" },
    { slug: "plants", title: "Native plants", subtitle: "every plant Indigene knows, from every region", stat: `<b>${totalPlants}</b> native plants · <b>${nRegions}</b> regions` },
    { slug: "regions", title: "Meet the natives", subtitle: "the regions Indigene covers, and their rosters", stat: `<b>${nRegions}</b> regions · <b>${totalPlants}</b> native plants` },
    { slug: "wildlife", title: "Browse by wildlife", subtitle: "pick a creature, see the natives that feed it", stat: `<b>${nCreatures}</b> creatures mapped so far` },
    { slug: "browse", title: "Browse", subtitle: "start from a region or a standout plant" },
    // The one card that leads with the question rather than the answer. It is
    // the sentence people actually say out loud, and a card that argued back at
    // them in 30 characters would be the advert the page refuses to be.
    { slug: "traits", title: "Plant traits", subtitle: "what each label and figure on a plant\u2019s page means" },
    // Counted from SOURCES in steps/native.ts — like the crops card, the figure
    // says the page brings its evidence, including the side that disagrees.
    { slug: "native", title: "Native plants, not nativism", subtitle: "where a plant evolved \u2014 never borders, never people", stat: `<b>${nativeSources}</b> sources \u00b7 both sides of the argument` },
    // The LLM bill's two headline figures, from the same module the page reads.
    { slug: "llm", title: "What building Indigene with an LLM cost", subtitle: "measured, estimated \u2014 and how the design pays it back", stat: `<b>${SNAPSHOT.sessions}</b> sessions \u00b7 <b>\u2248${round2(bill().kWh.mid)} kWh</b>` },
    // Drawn rather than marked: the idea is a picture — a street where half the
    // yards went native — and the figures are the page's own (40M acres of US
    // lawn, half of it habitat).
    { slug: "homegrown", title: "Homegrown National Park", subtitle: "half the lawn back to native plants \u2014 a park made of yards", stat: `<b>40 million</b> acres of US lawn \u00b7 <b>half</b> could be habitat`, art: yardsSvg(), size: 70 },
    { slug: "crops", title: "Will native plants bring pests to my yard?", subtitle: "no \u2014 and some of them take pests away", stat: `<b>25</b> studies \u00b7 the ones that disagree too` },
  ];
} finally {
  await loader.close();
}

const wanted = only.size ? pages.filter((p) => only.has(p.slug)) : pages;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !pages.some((p) => p.slug === s));
  throw new Error(`gen-page-cards: no such page: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = pages.filter((p) => !have.has(p.slug)).map((p) => p.slug);
  const extra = [...have].filter((slug) => !pages.some((p) => p.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for a page no longer listed: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${pages.length} page cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

async function overflows() {
  return page.evaluate(() => {
    const bad = [];
    const mid = document.querySelector(".mid");
    if (mid && mid.scrollWidth > mid.clientWidth + 1) bad.push(`the title and mark are ${mid.scrollWidth - mid.clientWidth}px too wide`);
    for (const el of document.querySelectorAll("h1, .sub")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 3;
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
    throw new Error(`gen-page-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
  }
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
  n++;
}
await browser.close();

if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !pages.some((p) => `${p.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} page cards into public/og/pages/ at ${W}×${H}`);
