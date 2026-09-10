// Draws one share card per ornamental (native swap), plus one for the index —
// the picture an unfurler shows beside an "/alternatives" link. Until now these
// pages shared the generic site card.
//
//   node scripts/gen-alternative-cards.mjs               # every ornamental + index
//   node scripts/gen-alternative-cards.mjs cynodon-dactylon index
//   node scripts/gen-alternative-cards.mjs --check
//
// Writes public/og/alternatives/<id>.jpg (and index.jpg) at 1200×630, the same
// committed-card pattern as the plant, wildlife, look-alike, region and page
// cards. `scripts/prerender.mjs` points each page at its own.
//
// ## What's on it
//
// An ornamental is a plant people buy and plant that isn't from here — so it
// wears the same cautioning amber the look-alikes do, to read apart from the
// green natives. The card carries its drawn form, its name and binomial, the
// job people plant it *for* (its `role` — "Lawn / turf", "Evergreen hedge",
// which is what a native has to fill to be a real swap), and two facts: how many
// native swaps Indigene offers for it, and how many regions those hold in.
//
// The index card sets an amber ornamental beside a green native with an arrow —
// "grow this instead", the whole point of the page.
//
// Words are English, like every other card (a query string can't pick a file).
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "alternatives");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const BRAND = "#7ec894"; // the native swap, and the wordmark
const AMBER = "#e3b264"; // the ornamental, and its facts

const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

// The same two fact icons the look-alike cards use — one hand across the
// non-native layer.
const FACT_ICONS = {
  region: {
    evenodd: true,
    marks: [{ d: "M24 5C15.7 5 9 11.5 9 19.6C9 30.6 24 43 24 43C24 43 39 30.6 39 19.6C39 11.5 32.3 5 24 5Z" + circle(24, 19.3, 5.4) }],
  },
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

const displayName = (common) => common.replace(/\s*\([^)]*\)\s*$/, "").trim();

/** The role, trimmed to sit on one line. */
function clipRole(role) {
  const s = String(role).replace(/\s+/g, " ").trim();
  if (s.length <= 40) return s;
  const cut = s.slice(0, 39);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,]+$/, "") + "…";
}

function nameSize(name) {
  if (name.length <= 16) return 88;
  if (name.length <= 26) return 68;
  return 54;
}

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
  .role { margin-top: 14px; font-size: 27px; color: #cdcdbd; }
  .drawing { margin-left: auto; flex: none; line-height: 0; opacity: 0.95; }
  ul { position: relative; display: flex; gap: 30px; list-style: none; align-items: center; }
  li { display: flex; align-items: center; gap: 11px; white-space: nowrap; }
  li > svg { flex: none; display: block; }
  .ftext { display: flex; flex-direction: column; }
  .ftext b { font-size: 38px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
  .ftext i { font-size: 20px; font-style: normal; color: #cdcdbd; margin-top: 4px; }
  .url { margin-left: auto; padding-left: 24px; font-size: 24px; font-weight: 650; color: ${AMBER}; }
`;

function ornamentalHtml({ name, latin, role, glyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: ${nameSize(name)}px; }</style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Native swap</span></header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    <div class="latin">${esc(latin)}</div>
    ${role ? `<div class="role">Planted as ${esc(role.toLowerCase())}</div>` : ""}
  </div>
  <div class="drawing" aria-hidden="true">${glyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

/** The index card: the ornamental you'd buy (amber) with an arrow to the native
 *  to grow instead (green). */
function indexHtml({ fakeGlyph, nativeGlyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: 74px; max-width: 15ch; }
  .pair { margin-left: auto; flex: none; display: flex; align-items: center; gap: 6px; line-height: 0; }
  .pair .arrow { font-size: 84px; font-weight: 800; color: ${BRAND}; opacity: 0.85; margin: 0 2px; }
  </style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Native swaps</span></header>
<div class="mid">
  <div class="names">
    <h1>Grow this instead</h1>
    <div class="role">The plants people buy everywhere — and a native that does the same job.</div>
  </div>
  <div class="pair" aria-hidden="true">${fakeGlyph}<span class="arrow">→</span>${nativeGlyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let cards;
try {
  const [{ alternativeIndex }, { glyphMarkup }] = await Promise.all([
    loader.load("/src/lib/alternatives.ts"),
    loader.load("/src/components/plant-glyphs.ts"),
  ]);
  const index = await alternativeIndex();

  const ornamentals = index.map((row) => {
    const natives = new Set(row.natives.map((n) => n.plant.id)).size;
    const regions = row.regionIds.length;
    return {
      slug: row.ornamental.id,
      name: displayName(row.ornamental.common),
      latin: row.ornamental.latin,
      role: clipRole(row.ornamental.role),
      glyph: glyphMarkup(row.ornamental.form, 240, AMBER),
      facts: [
        { icon: "region", value: String(regions), label: regions === 1 ? "region" : "regions" },
        { icon: "sprout", value: String(natives), label: natives === 1 ? "native swap" : "native swaps" },
      ],
    };
  });

  const allRegions = new Set();
  for (const row of index) for (const id of row.regionIds) allRegions.add(id);
  const indexCard = {
    slug: "index",
    index: true,
    fakeGlyph: glyphMarkup("shrub", 210, AMBER),
    nativeGlyph: glyphMarkup("perennial", 210, BRAND),
    facts: [
      { icon: "sprout", value: String(index.length), label: "swaps" },
      { icon: "region", value: String(allRegions.size), label: allRegions.size === 1 ? "region" : "regions" },
    ],
  };

  cards = [indexCard, ...ornamentals];
} finally {
  await loader.close();
}

const wanted = only.size ? cards.filter((c) => only.has(c.slug)) : cards;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !cards.some((c) => c.slug === s));
  throw new Error(`gen-alternative-cards: no such ornamental: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = cards.filter((c) => !have.has(c.slug)).map((c) => c.slug);
  const extra = [...have].filter((slug) => !cards.some((c) => c.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for an ornamental no longer listed: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${cards.length} native-swap cards present`);
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
    for (const el of document.querySelectorAll("li b, li i, .latin, .role, h1")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 1;
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    return bad;
  });
}

let n = 0;
for (const card of wanted) {
  await page.setContent(card.index ? indexHtml(card) : ornamentalHtml(card), { waitUntil: "load" });
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-alternative-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
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
console.log(`wrote ${wanted.length} native-swap cards into public/og/alternatives/ at ${W}×${H}`);
