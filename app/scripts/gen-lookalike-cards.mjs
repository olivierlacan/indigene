// Draws one share card per look-alike (impostor), plus one for the index — the
// picture an unfurler shows beside a "/lookalikes" link.
//
//   node scripts/gen-lookalike-cards.mjs               # every impostor + index
//   node scripts/gen-lookalike-cards.mjs pyrus-calleryana index …
//   node scripts/gen-lookalike-cards.mjs --check        # report missing/stale
//
// Writes public/og/lookalikes/<id>.jpg (and index.jpg) at 1200×630 — the same
// committed-card pattern as the plant, planting and wildlife cards. The impostor
// pages point at these through `scripts/prerender.mjs`; until now they shared the
// generic site card.
//
// ## What's on it, and what deliberately isn't
//
// The English common name, big; the scientific name under it; where it's really
// from (the `origin` line — "Native to China and Vietnam"); the plant's drawn
// form silhouette, the same one its own card and the plant cards use; and two
// facts — how many of our native plants it gets mistaken for, and how many
// regions it turns up in.
//
// What is NOT on it is a status word. "Invasive" and "introduced" are facts
// about a plant *in a place*, never about the plant: a Norway maple is invasive
// in the Northeast and an ordinary street tree elsewhere, and a Douglas-fir is
// one of the Pacific Northwest's great trees. A share card spans regions, so it
// can't honestly print one — the same rule the app follows (`statusRegions` in
// lib/lookalikes.ts). The origin is the honest, placeless truth, and the card
// leads with it instead.
//
// ## The colour
//
// Natives are drawn in the brand green everywhere. An impostor is drawn in a
// warm amber instead — the app's own "look twice" tone (the look-alike index
// paints introduced ties amber). It says "check which one this is" without
// making the accusation a status word would, which several of these don't earn.
//
// ## Cost / words / fonts
//
// Same as the sibling generators: no image library (Playwright renders a small
// HTML page), committed output so a normal build never runs this, JPEG 90,
// English text (a query string can't pick a file). Re-run when the design
// changes or an impostor is added; `--check` reports what's missing or stale.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "lookalikes");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

// ---------------------------------------------------------------------------
// Colours and drawn fact icons
// ---------------------------------------------------------------------------

const BRAND = "#7ec894"; // natives, and the wordmark
const AMBER = "#e3b264"; // an impostor, and its facts

/** A circle as two explicit arcs — centred on (cx, cy). */
const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

// Two fact icons, drawn to the plant-glyph rules (48-unit box, filled masses,
// any stem stroked). Shared idiom with the wildlife cards.
const FACT_ICONS = {
  // A map pin with its hole punched out (even-odd) — where it turns up.
  region: {
    evenodd: true,
    marks: [{ d: "M24 5C15.7 5 9 11.5 9 19.6C9 30.6 24 43 24 43C24 43 39 30.6 39 19.6C39 11.5 32.3 5 24 5Z" + circle(24, 19.3, 5.4) }],
  },
  // A sprout — the native plants it's mistaken for.
  sprout: {
    marks: [
      { d: "M24 42V22", stem: true, w: 3 },
      { d: "M23 26C17 26 12 22.5 9.5 15.5C16 14.5 22 17.5 23 26Z" },
      { d: "M25 24C31 24 36 20.5 38.5 13.5C32 12.5 26 15.5 25 24Z" },
    ],
  },
};

function iconMarkup(name, size, color) {
  const { marks, evenodd } = FACT_ICONS[name];
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${marks
    .map((m) =>
      m.stem
        ? `<path d="${m.d}" fill="none" stroke="${color}" stroke-width="${m.w}" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<path d="${m.d}" fill="${color}"${evenodd ? ' fill-rule="evenodd"' : ""}/>`
    )
    .join("")}</svg>`;
}

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="46" height="46"');

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The common name without the second name some rows carry in brackets. */
const displayName = (common) => common.replace(/\s*\([^)]*\)\s*$/, "").trim();

/** Where it's really from, trimmed to the first clause so it sits on one line:
 *  "Native to China and Vietnam; planted across…" → "Native to China and
 *  Vietnam." */
function clipOrigin(origin) {
  const s = String(origin).replace(/\s+/g, " ").trim();
  const stop = s.search(/[;.]/);
  let out = stop >= 0 ? s.slice(0, stop) : s;
  if (out.length > 48) {
    const cut = out.slice(0, 47);
    out = cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,]+$/, "") + "…";
  }
  return out;
}

/** The name steps down in three sizes by length — the wildlife ladder. */
function nameSize(name) {
  if (name.length <= 16) return 88;
  if (name.length <= 26) return 68;
  return 54;
}

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

function factRow(facts) {
  return facts
    .map(
      (f) => `<li>
        ${iconMarkup(f.icon, 62, AMBER)}
        <span class="ftext"><b>${esc(f.value)}</b><i>${esc(f.label)}</i></span>
      </li>`
    )
    .join("");
}

const STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #14160f; color: #f2f1e8;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 80px 52px; position: relative; overflow: hidden;
  }
  /* An amber wash rather than the green one the native cards carry — the same
     "this is the other thing" signal, in depth instead of a photograph. */
  .wash {
    position: absolute; right: -120px; bottom: -300px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, #6b4a17 0%, rgba(107,74,23,0) 70%);
    opacity: 0.6;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  .badge {
    margin-left: auto; font-size: 23px; font-weight: 700; color: #14160f;
    background: ${AMBER}; border-radius: 999px; padding: 9px 20px;
  }
  .mid { position: relative; display: flex; align-items: center; gap: 48px; }
  .names { min-width: 0; }
  h1 { font-weight: 800; letter-spacing: -0.025em; line-height: 1.04; }
  .latin { margin-top: 12px; font-size: 34px; font-style: italic; color: ${AMBER}; letter-spacing: -0.005em; }
  .origin { margin-top: 14px; font-size: 27px; color: #cdcdbd; }
  .drawing { margin-left: auto; flex: none; line-height: 0; opacity: 0.95; }
  ul { position: relative; display: flex; gap: 30px; list-style: none; align-items: center; }
  li { display: flex; align-items: center; gap: 11px; white-space: nowrap; }
  li > svg { flex: none; display: block; }
  .ftext { display: flex; flex-direction: column; }
  .ftext b { font-size: 38px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
  .ftext i { font-size: 20px; font-style: normal; color: #cdcdbd; margin-top: 4px; }
  .url { margin-left: auto; padding-left: 24px; font-size: 24px; font-weight: 650; color: ${AMBER}; }
`;

function impostorHtml({ name, latin, origin, glyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: ${nameSize(name)}px; }</style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Look-alike</span></header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    <div class="latin">${esc(latin)}</div>
    ${origin ? `<div class="origin">${esc(origin)}</div>` : ""}
  </div>
  <div class="drawing" aria-hidden="true">${glyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

/** The index card: a native and its impostor side by side — green beside amber —
 *  because the whole page is "is that the real thing or just similar?". */
function indexHtml({ nativeGlyph, fakeGlyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: 74px; max-width: 15ch; }
  .pair { margin-left: auto; flex: none; display: flex; align-items: flex-end; gap: 8px; line-height: 0; }
  .pair .q { align-self: center; font-size: 90px; font-weight: 800; color: ${AMBER}; opacity: 0.8; margin: 0 4px; }
  </style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Look-alikes</span></header>
<div class="mid">
  <div class="names">
    <h1>Is it the real thing?</h1>
    <div class="origin">The plants that get bought and planted in place of a native.</div>
  </div>
  <div class="pair" aria-hidden="true">${nativeGlyph}<span class="q">≠</span>${fakeGlyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let cards;
try {
  const [{ lookalikeIndex }, { glyphMarkup }] = await Promise.all([
    loader.load("/src/lib/lookalikes.ts"),
    loader.load("/src/components/plant-glyphs.ts"),
  ]);
  const index = await lookalikeIndex();

  const impostors = index.map((row) => {
    const natives = new Set(row.natives.map((n) => n.plant.id)).size;
    const regions = row.regionIds.length;
    const facts = [
      { icon: "region", value: String(regions), label: regions === 1 ? "region" : "regions" },
      { icon: "sprout", value: String(natives), label: natives === 1 ? "native it mimics" : "natives it mimics" },
    ];
    return {
      slug: row.lookalike.id,
      name: displayName(row.lookalike.common),
      latin: row.lookalike.latin,
      origin: clipOrigin(row.lookalike.origin),
      glyph: glyphMarkup(row.lookalike.form, 240, AMBER),
      facts,
    };
  });

  // The index card, under the reserved slug "index" (as the planting cards do).
  const allNatives = new Set();
  const allRegions = new Set();
  for (const row of index) {
    for (const n of row.natives) {
      allNatives.add(n.plant.id);
      allRegions.add(n.region.meta.id);
    }
  }
  const indexCard = {
    slug: "index",
    index: true,
    nativeGlyph: glyphMarkup("shrub", 210, BRAND),
    fakeGlyph: glyphMarkup("shrub", 210, AMBER),
    facts: [
      { icon: "sprout", value: String(index.length), label: "look-alikes" },
      { icon: "region", value: String(allRegions.size), label: allRegions.size === 1 ? "region" : "regions" },
    ],
  };

  cards = [indexCard, ...impostors];
} finally {
  await loader.close();
}

const wanted = only.size ? cards.filter((c) => only.has(c.slug)) : cards;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !cards.some((c) => c.slug === s));
  throw new Error(`gen-lookalike-cards: no such look-alike: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = cards.filter((c) => !have.has(c.slug)).map((c) => c.slug);
  const extra = [...have].filter((slug) => !cards.some((c) => c.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for a look-alike that no longer exists: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${cards.length} look-alike cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

async function overflows() {
  return page.evaluate(() => {
    const bad = [];
    for (const [sel, what] of [["ul", "the fact row"], [".mid", "the name and the drawing"]]) {
      const el = document.querySelector(sel);
      if (el && el.scrollWidth > el.clientWidth + 1) bad.push(`${what} is ${el.scrollWidth - el.clientWidth}px too wide`);
    }
    for (const el of document.querySelectorAll("li b, li i, .latin, .origin, h1")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 1;
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    return bad;
  });
}

let n = 0;
for (const card of wanted) {
  await page.setContent(card.index ? indexHtml(card) : impostorHtml(card), { waitUntil: "load" });
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-lookalike-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
  }
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
  if (++n % 10 === 0) console.log(`  …${n}/${wanted.length}`);
}
await browser.close();

if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !cards.some((c) => `${c.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} look-alike cards into public/og/lookalikes/ at ${W}×${H}`);
