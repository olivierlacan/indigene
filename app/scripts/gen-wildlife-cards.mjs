// Draws one share card per animal — the picture Messages, WhatsApp, Slack,
// Facebook and Google show beside an Indigene wildlife link.
//
//   node scripts/gen-wildlife-cards.mjs              # every animal
//   node scripts/gen-wildlife-cards.mjs monarch …    # just these, for a look
//   node scripts/gen-wildlife-cards.mjs --check       # report missing/stale
//
// Writes public/og/wildlife/<id>.jpg at 1200×630 — the size every unfurler
// expects, and crops toward the middle of when it wants something squarer, which
// is why the name and the creature sit centre-left and nothing that matters goes
// near an edge. The wildlife pages (`steps/wildlife.ts`) point at these through
// `scripts/prerender.mjs`; until now every animal shared the generic site card.
//
// ## What's on it
//
// The English common name, big; the scientific name under it in italics (an
// informal group like "Jays, turkeys & woodpeckers" has none, and the line is
// simply dropped); the animal's drawn kind glyph at hero size — the same
// butterfly, moth, bee, bird, mammal or tortoise silhouette the app shows for it
// (`components/wildlife-glyphs.ts`), drawn in a living pose rather than the flat
// specimen the OS emoji is, and a photograph can't ride a share card (see the
// licence note in gen-plant-cards.mjs); and up to four facts as an icon and a
// number, because a card is read in half a second and a sentence isn't.
//
// The facts are the animal's reach: how many of our regions it's native to, how
// many native plants support it, and the shape of that support — the plants it
// can breed on, the ones it takes nectar, berries or seeds from, and the ones it
// shelters in. `factsFor` below chooses them per animal in a fixed order of
// interest and never shows a number the animal hasn't got. The counts are the
// same ones the animal's own page prints (`plantsForWildlife`), so the preview
// can't drift from the page it opens.
//
// ## Words, and why they are English
//
// English for the same reason the prerendered metadata and the plant cards are:
// a query string can't pick a file, so `…/wildlife/<id>?lang=fr` is the same
// document and the same picture. A French reader still gets a French *app* the
// moment it boots.
//
// ## Cost, and why these are JPEGs
//
// The same reasoning as gen-plant-cards.mjs — no image library (Playwright is
// already here for the screenshots), the output is committed so a normal build
// never runs this, and JPEG at 90 keeps the brand wash from bloating a committed
// PNG while staying indistinguishable at 1:1. Re-run it when the design changes
// or an animal is added; `--check` reports what's missing or stale without
// drawing anything.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "wildlife");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

// ---------------------------------------------------------------------------
// What each card says
// ---------------------------------------------------------------------------

/** The kind label shown in the header pill — the app's own word for the group,
 *  singular. (The app pluralises for its section headings; a badge naming one
 *  creature wants the singular.) */
const KIND_LABEL = {
  butterfly: "Butterfly",
  moth: "Moth",
  bee: "Bee",
  bird: "Bird",
  mammal: "Mammal",
};

/**
 * Up to four facts, in a fixed order of interest, skipping whatever an animal
 * hasn't got.
 *
 * Regions lead — "where does it live, and does that include me?" is the first
 * question a share card can answer, and it's the one the reader asked for. The
 * plant count comes next: it's the promise of the page you're about to open,
 * the same number the page's lede prints. Then the shape of that support, in the
 * order the animal's page ranks it — the plants it can breed on first (a
 * caterpillar only becomes a butterfly on the right leaf), then what it eats
 * (nectar for the pollinators, berries and seeds for the birds), and last the
 * plants it shelters in.
 *
 * Every count here is a count of plant→animal ties across regions — one plant on
 * two region lists counts on each — which is exactly what the animal's own page
 * tiles and region headings count, so the card and the page never disagree.
 *
 * Labels are one or two short words and none wraps: four facts, a URL and
 * 1040 px is not a lot of room, and a label that breaks over two lines drags its
 * own number out of line with the rest. Only the two counting a whole plant get
 * a singular ("1 region", "1 plant"); the support words read the same at any
 * number.
 */
function factsFor(s) {
  const facts = [];
  if (s.regions > 0) {
    facts.push({ icon: "region", value: String(s.regions), label: s.regions === 1 ? "region" : "regions" });
  }
  if (s.plants > 0) {
    facts.push({ icon: "sprout", value: String(s.plants), label: s.plants === 1 ? "native plant" : "native plants" });
  }
  if (s.host > 0) facts.push({ icon: "caterpillar", value: String(s.host), label: "raise young" });
  if (s.nectar > 0) facts.push({ icon: "bloom", value: String(s.nectar), label: "give nectar" });
  if (s.berries > 0) facts.push({ icon: "berries", value: String(s.berries), label: "give berries" });
  if (s.seeds > 0) facts.push({ icon: "seeds", value: String(s.seeds), label: "give seeds" });
  if (s.shelter > 0) facts.push({ icon: "shelter", value: String(s.shelter), label: "shelter it" });
  return facts.slice(0, 4);
}

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

const BRAND = "#7ec894";

/** A circle written as two explicit arcs — see gen-plant-cards.mjs for why the
 *  shorthand form places shapes half a radius off. */
const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

/**
 * The fact icons, drawn rather than typed — the same reasoning as the plant
 * cards: one flat brand green on one dark ground reads at thumbnail size where a
 * row of full-colour emoji would be clutter competing with the hero. They follow
 * the plant glyphs' rules — one 48-unit box, filled masses, any stem stroked at
 * one weight, the same green as the creature above them.
 *
 * `caterpillar` and `bloom` are lifted straight from gen-plant-cards.mjs so the
 * two card families share one hand; the rest are drawn here to the same rules.
 */
const FACT_ICONS = {
  // A map pin: the teardrop with its hole punched out (even-odd), so it reads as
  // "a place on a map" — where the animal lives.
  region: {
    evenodd: true,
    marks: [
      {
        d:
          "M24 5C15.7 5 9 11.5 9 19.6C9 30.6 24 43 24 43C24 43 39 30.6 39 19.6C39 11.5 32.3 5 24 5Z" +
          circle(24, 19.3, 5.4),
      },
    ],
  },
  // A sprout: a short stroked stem with two leaves, one to each side — the plant
  // the animal depends on, at its smallest and most generic.
  sprout: {
    marks: [
      { d: "M24 42V22", stem: true, w: 3 },
      { d: "M23 26C17 26 12 22.5 9.5 15.5C16 14.5 22 17.5 23 26Z" },
      { d: "M25 24C31 24 36 20.5 38.5 13.5C32 12.5 26 15.5 25 24Z" },
    ],
  },
  // The perennial glyph's flower head, opened to fill the box — the same bloom
  // gen-plant-cards.mjs draws, and the plant's own silhouette wears.
  bloom: {
    scale: 1.35,
    marks: [
      { d: "M24 24.5C29.2 21.2 27.9 13.7 24 11.1C20.1 13.7 18.8 21.2 24 24.5Z" },
      { d: "M24 24.5C28.8 28.4 35.3 24.9 36.6 20.3C32.8 17.5 25.5 18.5 24 24.5Z" },
      { d: "M24 24.5C21.8 30.2 27.1 35.4 31.8 35.3C33.4 30.7 30.1 24.1 24 24.5Z" },
      { d: "M24 24.5C17.9 24.1 14.6 30.7 16.2 35.3C20.9 35.4 26.2 30.2 24 24.5Z" },
      { d: "M24 24.5C22.5 18.5 15.2 17.5 11.4 20.3C12.7 24.9 19.2 28.4 24 24.5Z" },
      { d: circle(24, 24.5, 4.9) },
    ],
  },
  // A humped grub in profile — lifted from gen-plant-cards.mjs, where the whole
  // reasoning for its size and arch lives. The eye is a counter (even-odd).
  caterpillar: {
    evenodd: true,
    marks: [
      { d: circle(8.5, 34.5, 5) },
      { d: circle(15.5, 31, 5.8) },
      { d: circle(22.5, 28.5, 6.2) },
      { d: circle(29.5, 29.5, 6) },
      { d: circle(37.5, 32, 7) + circle(39.6, 30.3, 2.2) },
      { d: "M38.2 24.8l1.2-5.6", stem: true, w: 2.8 },
      { d: "M42 26.6l3.9-3.7", stem: true, w: 2.8 },
    ],
  },
  // A cluster of three berries on a short stem — what a bird strips off a shrub.
  berries: {
    marks: [
      { d: "M24 8l-3 8", stem: true, w: 2.6 },
      { d: circle(17, 30, 8) },
      { d: circle(31, 30, 8) },
      { d: circle(24, 22, 7) },
    ],
  },
  // A grass seed head: a stalk with paired grains climbing it — what a finch
  // works over in autumn.
  seeds: {
    marks: [
      { d: "M24 44V16", stem: true, w: 2.6 },
      { d: "M24 16C21 12 17 11 14 12C15 16 19 18 24 16Z" },
      { d: "M24 16C27 12 31 11 34 12C33 16 29 18 24 16Z" },
      { d: "M24 24C21.5 20.5 18 19.5 15.5 20.5C16.5 24 20 26 24 24Z" },
      { d: "M24 24C26.5 20.5 30 19.5 32.5 20.5C31.5 24 28 26 24 24Z" },
      { d: "M24 32C22 28.5 19 27.5 17 28.5C18 32 21 33.5 24 32Z" },
      { d: "M24 32C26 28.5 29 27.5 31 28.5C30 32 27 33.5 24 32Z" },
    ],
  },
  // A house — the app's 🏠 for shelter, drawn flat: a roof over a body with a
  // door cut into it (even-odd), so "somewhere safe to be" reads without colour.
  shelter: {
    evenodd: true,
    marks: [
      {
        d:
          "M24 6L42 21H37V41H11V21H6Z" +
          "M21 41V30H27V41Z",
      },
    ],
  },
};

function iconMarkup(name, size) {
  const { marks, evenodd, scale } = FACT_ICONS[name];
  const parts = marks.map((m) =>
    m.stem
      ? `<path d="${m.d}" fill="none" stroke="${BRAND}" stroke-width="${m.w}" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="${m.d}" fill="${BRAND}"${evenodd ? ' fill-rule="evenodd"' : ""}/>`
  );
  const body = scale
    ? `<g transform="translate(24 24) scale(${scale}) translate(-24 -24)">${parts.join("")}</g>`
    : parts.join("");
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`;
}

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="46" height="46"');

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The name steps down in three sizes by length, measured in characters because
 * the card is one font at one weight — the same ladder the plant cards use, but
 * animal names run longer ("Eastern tiger swallowtail", "Jays, turkeys &
 * woodpeckers"), so the steps sit a touch smaller.
 */
function nameSize(name) {
  if (name.length <= 16) return 88;
  if (name.length <= 26) return 68;
  return 54;
}

function cardHtml({ name, latin, glyph, kind, facts }) {
  const chips = facts
    .map(
      (f) => `<li>
        ${iconMarkup(f.icon, 62)}
        <span class="ftext"><b>${esc(f.value)}</b><i>${esc(f.label)}</i></span>
      </li>`
    )
    .join("");

  return `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    /* The app's dark surface, so the card looks like the page it opens. */
    background: #14160f;
    color: #f2f1e8;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 80px 52px;
    position: relative;
    overflow: hidden;
  }
  /* The same brand wash the site-wide and plant cards carry — one family. */
  .wash {
    position: absolute; right: -120px; bottom: -300px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.6;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  .kind {
    margin-left: auto; font-size: 23px; font-weight: 700; color: #14160f;
    background: ${BRAND}; border-radius: 999px; padding: 9px 20px;
  }

  .mid { position: relative; display: flex; align-items: center; gap: 48px; }
  .names { min-width: 0; }
  h1 {
    font-weight: 800; letter-spacing: -0.025em; line-height: 1.04;
    font-size: ${nameSize(name)}px;
  }
  .latin {
    margin-top: 14px; font-size: 34px; font-style: italic;
    color: ${BRAND}; letter-spacing: -0.005em;
  }
  /* The drawn kind glyph at hero size — the same silhouette the app shows for
     this animal, in the brand green. Pushed right so an unfurler's square crop
     keeps both it and the name. */
  .creature { margin-left: auto; flex: none; line-height: 0; opacity: 0.95; }

  /* Four facts and an address share 1040 px, so nothing here may wrap. */
  ul { position: relative; display: flex; gap: 30px; list-style: none; align-items: center; }
  li { display: flex; align-items: center; gap: 11px; white-space: nowrap; }
  li > svg { flex: none; display: block; }
  .ftext { display: flex; flex-direction: column; }
  .ftext b { font-size: 38px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
  .ftext i { font-size: 20px; font-style: normal; color: #cdcdbd; margin-top: 4px; }
  .url { margin-left: auto; padding-left: 24px; font-size: 24px; font-weight: 650; color: ${BRAND}; }
</style>
<div class="wash"></div>
<header>
  ${mark}<span class="wordmark">Indigene</span>
  ${kind ? `<span class="kind">${esc(kind)}</span>` : ""}
</header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    ${latin ? `<div class="latin">${esc(latin)}</div>` : ""}
  </div>
  <div class="creature" aria-hidden="true">${glyph}</div>
</div>
<ul>${chips}<li class="url">indigene.app</li></ul>
`;
}

// ---------------------------------------------------------------------------

const loader = await openLoader();
let animals;
try {
  const [{ WILDLIFE }, { plantsForWildlife, regionsForWildlife }, { wildlifeGlyphMarkup, glyphKeyFor }] = await Promise.all([
    loader.load("/src/data/wildlife.ts"),
    loader.load("/src/lib/wildlife.ts"),
    loader.load("/src/components/wildlife-glyphs.ts"),
  ]);
  // The same counts the animal's own page shows: ties across regions, so a plant
  // native to two lists is counted on each — exactly what the page's region
  // headings and reach tiles count, so the card can't contradict the page.
  animals = [];
  for (const w of WILDLIFE) {
    const supports = await plantsForWildlife(w.id);
    const count = (kind) => supports.filter((s) => s.link.support === kind).length;
    animals.push({
      slug: w.id,
      name: w.common,
      latin: w.latin ?? "",
      glyph: wildlifeGlyphMarkup(glyphKeyFor(w.kind, w.inat?.iconic), 240, BRAND),
      kind: KIND_LABEL[w.kind] ?? "",
      facts: factsFor({
        regions: regionsForWildlife(w.id).length,
        plants: supports.length,
        host: count("host"),
        nectar: count("nectar"),
        berries: count("berries"),
        seeds: count("seeds"),
        shelter: count("shelter"),
      }),
    });
  }
} finally {
  await loader.close();
}

const wanted = only.size ? animals.filter((a) => only.has(a.slug)) : animals;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !animals.some((a) => a.slug === s));
  throw new Error(`gen-wildlife-cards: no such animal: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = animals.filter((a) => !have.has(a.slug)).map((a) => a.slug);
  const extra = [...have].filter((slug) => !animals.some((a) => a.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for an animal that no longer exists: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${animals.length} wildlife cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

/**
 * Measure the card before capturing it, and refuse to write a broken one — the
 * same guard the plant cards carry, and for the same reason: a name two
 * characters longer than the last can push the fact row into a second line or
 * slide the emoji off the edge with no warning, and once it's committed nobody
 * looks again.
 */
async function overflows() {
  return page.evaluate(() => {
    const bad = [];
    for (const [sel, what] of [["ul", "the fact row"], [".mid", "the name and the creature"]]) {
      const el = document.querySelector(sel);
      if (el.scrollWidth > el.clientWidth + 1) bad.push(`${what} is ${el.scrollWidth - el.clientWidth}px too wide`);
    }
    for (const el of document.querySelectorAll("li b, li i, .latin, h1")) {
      const lines = el.getClientRects().length;
      const allowed = el.tagName === "H1" ? 2 : 1; // only the name may take two
      if (lines > allowed) bad.push(`"${el.textContent}" wrapped onto ${lines} lines`);
    }
    return bad;
  });
}

let n = 0;
for (const card of wanted) {
  await page.setContent(cardHtml(card), { waitUntil: "load" });
  await page.waitForTimeout(30); // let the emoji font paint before measuring
  const bad = await overflows();
  if (bad.length) {
    await browser.close();
    throw new Error(`gen-wildlife-cards: ${card.name} doesn't fit its card — ${bad.join("; ")}`);
  }
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  // Only rewrite what changed, so a re-run doesn't churn the whole set in git.
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
  if (++n % 25 === 0) console.log(`  …${n}/${wanted.length}`);
}
await browser.close();

// A renamed or removed animal leaves a card behind; sweep it, but only on a
// full run, where `animals` is the whole catalog.
if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !animals.some((a) => `${a.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} wildlife cards into public/og/wildlife/ at ${W}×${H}`);
