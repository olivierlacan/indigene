// Draws one share card per most-wanted invasive, one per region's list, plus
// one for the index — the picture an unfurler shows beside an "/invasives"
// link. A region's card (`in-<region>.jpg`, for `/invasives/in/<region>`) names
// the place and lists its five, ranked: the whole answer to "what should I be
// pulling round here?" before anyone taps.
//
//   node scripts/gen-invasive-cards.mjs               # every invasive + index
//   node scripts/gen-invasive-cards.mjs alliaria-petiolata index
//   node scripts/gen-invasive-cards.mjs --check
//
// Writes public/og/invasives/<id>.jpg (and index.jpg) at 1200×630, the same
// committed-card pattern as the swap and look-alike cards, and built from the
// swap cards' layout. The plant wears a warning red rather than the swaps'
// amber; the card carries its drawn form, its name and binomial, and two
// facts: how many regions have it on their most-wanted list, and the highest
// place it holds on one.
//
// Words are English, like every other card (a query string can't pick a file).
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "invasives");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const AMBER = "#ec8a7c"; // the invasive, and its facts (named for the layout it came from)

const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

// The same two fact icons the look-alike cards use — one hand across the
// non-native layer.
const FACT_ICONS = {
  region: {
    evenodd: true,
    marks: [{ d: "M24 5C15.7 5 9 11.5 9 19.6C9 30.6 24 43 24 43C24 43 39 30.6 39 19.6C39 11.5 32.3 5 24 5Z" + circle(24, 19.3, 5.4) }],
  },
  flag: {
    marks: [
      { d: "M13 43V7", stem: true, w: 3.5 },
      { d: "M14 8H38L32 16L38 24H14Z" },
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
    background: radial-gradient(circle, #6b2a20 0%, rgba(107,42,32,0) 70%);
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

function invasiveHtml({ name, latin, role, glyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: ${nameSize(name)}px; }</style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Pull first</span></header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    <div class="latin">${esc(latin)}</div>
    ${role ? `<div class="role">${esc(role)}</div>` : ""}
  </div>
  <div class="drawing" aria-hidden="true">${glyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

/** The index card: one drawn invasive in warning red. */
function indexHtml({ fakeGlyph, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: 74px; max-width: 15ch; }
  .pair { margin-left: auto; flex: none; display: flex; align-items: center; gap: 6px; line-height: 0; }
  </style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Pull first</span></header>
<div class="mid">
  <div class="names">
    <h1>Invasives to pull first</h1>
    <div class="role">Five for each region, and how to spot them.</div>
  </div>
  <div class="pair" aria-hidden="true">${fakeGlyph}</div>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

/** A region's card: the place, and its five in rank order beside it. */
function regionHtml({ name, ranked, facts }) {
  return `<!doctype html><meta charset="utf-8"><style>${STYLE}
  h1 { font-size: ${nameSize(name)}px; max-width: 11ch; }
  .rank { margin-left: auto; flex: none; list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .rank li { display: flex; align-items: center; gap: 16px; font-size: 30px; font-weight: 650; }
  .rank .n { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 999px;
    background: #3d1f1a; color: ${AMBER}; font-size: 26px; font-weight: 800; flex: none; }
  </style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span><span class="badge">Pull first</span></header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    <div class="role">The invasive plants to pull first</div>
  </div>
  <ol class="rank">${ranked.map((r, i) => `<li><span class="n">${i + 1}</span><span class="rname">${esc(r)}</span></li>`).join("")}</ol>
</div>
<ul>${factRow(facts)}<li class="url">indigene.app</li></ul>`;
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let cards;
try {
  const [{ INVASIVES }, { mappedInvasiveIds, wantedRowsFor, wantedRegionIds, mostWanted, regionIsRated }, { glyphMarkup }, { REGIONS }] = await Promise.all([
    loader.load("/src/data/invasives.ts"),
    loader.load("/src/lib/invasives.ts"),
    loader.load("/src/components/plant-glyphs.ts"),
    loader.load("/src/data/regions.ts"),
  ]);
  const ids = mappedInvasiveIds();
  const invasives = INVASIVES.filter((i) => ids.has(i.id)).map((inv) => {
    const places = wantedRowsFor(inv.id);
    const best = Math.min(...places.map((p) => p.row.rank));
    return {
      slug: inv.id,
      name: displayName(inv.common),
      latin: inv.latin,
      role: "An invasive plant to pull first",
      glyph: glyphMarkup(inv.form, 240, AMBER),
      facts: [
        { icon: "region", value: String(places.length), label: places.length === 1 ? "region wants it gone" : "regions want it gone" },
        { icon: "flag", value: `#${best}`, label: "on a pull-first list" },
      ],
    };
  });
  const indexCard = {
    slug: "index",
    index: true,
    fakeGlyph: glyphMarkup("perennial", 240, AMBER),
    facts: [
      { icon: "flag", value: String(invasives.length), label: "invasive plants" },
      { icon: "region", value: "5", label: "per region" },
    ],
  };
  const regionCards = wantedRegionIds().map((id) => {
    const region = REGIONS.find((r) => r.meta.id === id);
    const rows = mostWanted(id);
    return {
      slug: `in-${id}`,
      region: true,
      name: region.meta.short,
      ranked: rows.map((r) => displayName(r.invasive.common)),
      facts: [
        { icon: "flag", value: String(rows.length), label: "ranked worst first" },
        { icon: "region", value: regionIsRated(id) ? "Rated" : "Seen", label: regionIsRated(id) ? "by local experts" : "most often, wild" },
      ],
    };
  });
  cards = [indexCard, ...regionCards, ...invasives];
} finally {
  await loader.close();
}

const wanted = only.size ? cards.filter((c) => only.has(c.slug)) : cards;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !cards.some((c) => c.slug === s));
  throw new Error(`gen-invasive-cards: no such invasive: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = cards.filter((c) => !have.has(c.slug)).map((c) => c.slug);
  const extra = [...have].filter((slug) => !cards.some((c) => c.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for an invasive no longer listed: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${cards.length} most-wanted cards present`);
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
    for (const el of document.querySelectorAll("li b, li i, .latin, .role, .rname, h1")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 1;
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    return bad;
  });
}

let n = 0;
for (const card of wanted) {
  await page.setContent(card.index ? indexHtml(card) : card.region ? regionHtml(card) : invasiveHtml(card), { waitUntil: "load" });
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-invasive-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
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
console.log(`wrote ${wanted.length} most-wanted cards into public/og/invasives/ at ${W}×${H}`);
