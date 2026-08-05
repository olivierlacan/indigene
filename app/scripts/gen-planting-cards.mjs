// Draws the share cards for the propagation pages — the picture Messages,
// WhatsApp, Slack, Facebook and Google show beside an Indigene technique link.
//
//   node scripts/gen-planting-cards.mjs                  # the index + all 15
//   node scripts/gen-planting-cards.mjs scarification …  # just these, for a look
//   node scripts/gen-planting-cards.mjs --check          # report what's missing
//
// Writes public/og/planting/index.jpg and public/og/planting/<slug>.jpg at
// 1200×630 — same size, same frame and same reasoning as the plant cards
// (`gen-plant-cards.mjs`, which documents the JPEG choice, the English-only
// rule and why the output is committed rather than built).
//
// ## What's on a technique card
//
// The name, split where the glossary already splits it: the plain-words half
// set large ("Nick or scuff the hard seed coat first") and the term of art from
// its brackets underneath in green ("scarification"). That's the same pairing
// the plant cards use for a common name and its binomial, and it means the card
// needs no words of its own — every string on it is one the page itself shows.
//
// Where a plant card puts four facts and a silhouette, this puts **the year**:
// four cells, the technique's window filled in. It is the one thing these pages
// exist to say, it survives being shrunk to a thumbnail in a chat list, and a
// link to "hardwood cuttings" that previews with only WINTER lit has already
// answered the question before anyone taps it.
//
// A technique with no season of its own (scarification follows whatever sowing
// it belongs to) lights all four, exactly as it does in the app — with the
// `when` line under the strip saying why.
//
// ## Fonts
//
// Set in the app's stack, which resolves to Roboto in this container (the
// SessionStart hook installs it). Without it the text falls back to DejaVu and
// sets ~10% wider, so the overflow guard below would start failing on the
// longest names. `fc-match system-ui` should say Roboto.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "planting");

const W = 1200;
const H = 630;
const BRAND = "#7ec894";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

/** The index's card is `index.jpg`; `index` is therefore not a legal slug for a
 *  technique. Nothing enforces that but arithmetic — no method is called it. */
const INDEX_SLUG = "index";

// ---------------------------------------------------------------------------
// What each card says
// ---------------------------------------------------------------------------

/**
 * Split a glossary name into its two halves: the plain-words instruction and
 * the term of art it carries in brackets.
 *
 * Every one of the fifteen is written this way — that's the app's rule about
 * never using a term it hasn't explained, applied to the names themselves — so
 * this reads the shape rather than inventing a second set of strings to
 * maintain. A name that ever stopped carrying brackets simply sets the whole
 * thing large and nothing breaks.
 */
function splitName(name) {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(name);
  return m ? { lead: m[1], term: m[2] } : { lead: name, term: "" };
}

/**
 * The lead can't be allowed to overflow, and it runs from "Sow the seed as-is"
 * to "Dig up the shoots it sends up around itself". Same device as the plant
 * cards: three steps measured in characters, rather than shrinking every card
 * to fit the longest one.
 */
function leadSize(lead) {
  if (lead.length <= 22) return 88;
  if (lead.length <= 34) return 72;
  return 58;
}

const SEASON_LABELS = { spring: "Spring", summer: "Summer", fall: "Autumn", winter: "Winter" };
const SEASON_ORDER = ["spring", "summer", "fall", "winter"];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="46" height="46"');

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

/** The frame both cards share: the app's dark surface, the brand wash, the
 *  wordmark at the top and the address at the bottom right. */
function frame({ pill, body, foot }) {
  return `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #14160f;
    color: #f2f1e8;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 80px 52px;
    position: relative;
    overflow: hidden;
  }
  /* The same wash as the site-wide and plant cards, so all three are obviously
     from one place. */
  .wash {
    position: absolute; right: -120px; bottom: -300px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.6;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  /* Where a plant card wears its keystone badge: which half of the index this
     technique lives in. */
  .pill {
    margin-left: auto; font-size: 23px; font-weight: 700; color: #14160f;
    background: ${BRAND}; border-radius: 999px; padding: 9px 22px;
  }
  .mid { position: relative; }
  h1 { font-weight: 800; letter-spacing: -0.025em; line-height: 1.05; }
  .term {
    margin-top: 16px; font-size: 34px; color: ${BRAND};
    letter-spacing: -0.005em; font-weight: 650;
  }
  /* The year. Four equal cells, the window filled — the whole point of the
     page, and the one thing that still reads when a chat list shrinks this to
     a thumbnail. */
  .year { display: flex; gap: 10px; }
  .year div {
    flex: 1; text-align: center; border-radius: 14px; padding: 22px 0;
    font-size: 30px; font-weight: 700; letter-spacing: -0.01em;
    background: #262a1e; color: #9a9a88;
  }
  .year div.on { background: ${BRAND}; color: #14160f; }
  .foot {
    position: relative; display: flex; align-items: baseline; gap: 28px;
    margin-top: 26px; font-size: 26px; color: #cdcdbd;
  }
  .foot .when { white-space: nowrap; }
  .url { margin-left: auto; font-size: 24px; font-weight: 650; color: ${BRAND}; white-space: nowrap; }
  .stats { display: flex; gap: 46px; }
  .stats b { color: #f2f1e8; font-weight: 800; }
</style>
<div class="wash"></div>
<header>${mark}<span class="wordmark">Indigene</span>${pill ? `<span class="pill">${esc(pill)}</span>` : ""}</header>
<div class="mid">${body}</div>
<div>${foot}</div>
`;
}

function techniqueCardHtml({ lead, term, seasons, when, from }) {
  const cells = SEASON_ORDER.map(
    (s) => `<div class="${seasons.includes(s) ? "on" : ""}">${SEASON_LABELS[s]}</div>`
  ).join("");
  return frame({
    pill: from === "seed" ? "From seed" : "From the plant",
    body: `<h1 style="font-size:${leadSize(lead)}px">${esc(lead)}</h1>${
      term ? `<div class="term">${esc(term)}</div>` : ""
    }`,
    foot: `<div class="year">${cells}</div>
<div class="foot"><span class="when">${esc(when)}</span><span class="url">indigene.app</span></div>`,
  });
}

/** The index's card. No single window to draw, so it lights the whole year and
 *  counts what's behind the page instead. */
function indexCardHtml({ techniques, sources }) {
  const cells = SEASON_ORDER.map((s) => `<div class="on">${SEASON_LABELS[s]}</div>`).join("");
  return frame({
    pill: "",
    body: `<h1 style="font-size:88px">Ways to grow more</h1>
<div class="term">every technique, and when in the year to do it</div>`,
    foot: `<div class="year">${cells}</div>
<div class="foot"><span class="stats"><span><b>${techniques}</b> techniques</span><span><b>${sources}</b> sources to read</span></span><span class="url">indigene.app</span></div>`,
  });
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let cards;
try {
  const [{ TECHNIQUES, PLANTING_SOURCES }, { en }] = await Promise.all([
    loader.load("/src/lib/planting.ts"),
    loader.load("/src/locales/en.ts"),
  ]);
  cards = [
    {
      slug: INDEX_SLUG,
      html: indexCardHtml({ techniques: TECHNIQUES.length, sources: PLANTING_SOURCES.length }),
    },
    ...TECHNIQUES.map((tech) => {
      const { lead, term } = splitName(en[`prop.${tech.method}.name`]);
      return {
        slug: tech.slug,
        html: techniqueCardHtml({
          lead,
          term,
          from: tech.from,
          // A technique with no season of its own belongs to every one of them,
          // which is what the app's own strip shows.
          seasons: tech.anyTime ? SEASON_ORDER : tech.seasons,
          when: en[`prop.${tech.method}.when`],
        }),
      };
    }),
  ];
} finally {
  await loader.close();
}

const wanted = only.size ? cards.filter((c) => only.has(c.slug)) : cards;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !cards.some((c) => c.slug === s));
  throw new Error(`gen-planting-cards: no such technique: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = cards.filter((c) => !have.has(c.slug)).map((c) => c.slug);
  const extra = [...have].filter((slug) => !cards.some((c) => c.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for a technique that no longer exists: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${cards.length} planting cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

/**
 * Measure before capturing, and refuse to write a broken card.
 *
 * Same rule as the plant cards, for the same reason: once a card is committed
 * nobody looks at it again, and one technique whose `when` line is four words
 * longer than the last would push the address off the edge with no warning.
 * Here the season labels matter too — a cell narrow enough to wrap "Spring"
 * turns the year into a ragged block.
 */
async function overflows() {
  return page.evaluate(() => {
    const bad = [];
    for (const [sel, what] of [[".foot", "the line under the year"], [".year", "the year"]]) {
      const el = document.querySelector(sel);
      if (el && el.scrollWidth > el.clientWidth + 1) {
        bad.push(`${what} is ${el.scrollWidth - el.clientWidth}px too wide`);
      }
    }
    // One client rect per element means one line. Two means it wrapped.
    for (const el of document.querySelectorAll(".year div, .term, .foot .when, .url, h1")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 1; // only the name may take two
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    // A name taking a line more than expected pushes the year and the address
    // off the bottom. Measured against the frame rather than `body.scrollHeight`
    // — the brand wash is parked outside the frame on purpose and clipped, so
    // the body "overflows" on every card by design.
    const foot = document.querySelector(".foot");
    const over = foot ? Math.round(foot.getBoundingClientRect().bottom) - 630 + 52 : 0;
    if (over > 0) bad.push(`the year and the address are ${over}px past the bottom edge`);
    return bad;
  });
}

for (const card of wanted) {
  await page.setContent(card.html, { waitUntil: "load" });
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-planting-cards: ${card.slug} doesn't fit its card — ${bad.join("; ")}`);
  }
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  // Only rewrite what changed, so a re-run doesn't churn the whole directory.
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
}
await browser.close();

// A renamed or retired technique leaves a card behind; sweep it, but only on a
// full run, where `cards` is the whole set.
if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !cards.some((c) => `${c.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} planting cards into public/og/planting/ at ${W}×${H}`);
