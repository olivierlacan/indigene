// Draws one share card per plant — the picture Messages, WhatsApp, Slack,
// Facebook and Google show beside an Indigene plant link.
//
//   node scripts/gen-plant-cards.mjs                 # every plant
//   node scripts/gen-plant-cards.mjs quercus-alba …  # just these, for a look
//
// Writes public/og/plants/<slug>.jpg at 1200×630, the size every unfurler
// expects — and crops toward the middle of when it wants something squarer,
// which is why the name and the drawing sit centre-left and nothing that
// matters goes near an edge.
//
// ## What's on it
//
// The English common name, big; the scientific name under it in italics; the
// plant's own silhouette from the app's glyph set (`components/plant-glyphs.ts`
// — the same drawing the plant's card and page show, so the picture in the
// preview is the picture you land on); and up to four facts as an icon and a
// number, because a card is read in half a second and a sentence isn't.
//
// The facts are chosen per plant by `factsFor` below, in a fixed order of
// interest, and a plant only ever shows what it actually has. The icons beside
// them are drawn, not emoji — see `FACT_ICONS`.
//
// ## Words, and why they are English
//
// The card is English for the same reason the prerendered metadata is: a query
// string can't pick a file, so `…/plants/<slug>?lang=fr` is the same document
// and the same picture. A French reader still gets a French *app* the moment it
// boots. Real French cards would be a second tree of files and a second tree of
// pages to point at them.
//
// A common name carrying a second name in brackets — "Alpenrose (Rhododendron
// ferrugineux)", "Cabbage Palm (Sabal Palm)" — is trimmed to the first. Eighty-
// odd rows are written that way, the bracket is the part that makes a name too
// long to set large, and the scientific name is already on the next line.
//
// ## Cost, and why these are JPEGs
//
// Like gen-og-image.mjs and make-thumb.mjs there's no image library: Playwright
// is already a dev dependency, so each card is a small HTML page rendered and
// captured. The output is committed, so a normal build never runs this. Re-run
// it when the design changes, or when a plant is added — `--check` reports what
// is missing or stale without drawing anything.
//
// Two hundred-odd committed images have to be small, and PNG cannot make them
// small. The brand wash is a smooth radial gradient — thousands of
// near-identical colours no run-length coder can help with — and the type is
// large and antialiased. Measured on this card:
//
//   PNG, with the wash     224 KB    47 MB across the catalog
//   PNG, flat background    48 KB    10 MB
//   JPEG 95                 65 KB    14 MB
//   JPEG 90                 48 KB    10 MB
//   JPEG 85                 40 KB     9 MB
//   JPEG 78                 33 KB     7 MB
//
// Flattening the background buys nothing PNG-side, so the real choice is the
// quality number — and at 1:1, with the crops stacked, every one of those JPEGs
// is indistinguishable from the lossless original. Nothing on the card is a
// photograph or a fine gradient meeting a hard edge, which is where JPEG shows;
// it's flat colour and type. 90 is chosen with room to spare rather than at the
// edge of what survives, because these are the pictures strangers see first and
// they are cheap to be generous about. They're also fetched only by link
// unfurlers, never by anyone using the app, so the weight is a repository cost
// and not a page-load one.
const QUALITY = 90;
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { openLoader } from "./_load-ts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og", "plants");

const W = 1200;
const H = 630;

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const only = new Set(args.filter((a) => !a.startsWith("--")));

// ---------------------------------------------------------------------------
// What each card says
// ---------------------------------------------------------------------------

/** The English common name, without the second name some rows carry in
 *  brackets. `Beach / Dune Sunflower` keeps its slash — that's one name written
 *  two ways, not two names. */
const displayName = (common) => common.replace(/\s*\([^)]*\)\s*$/, "").trim();

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Feet big and metres small, because the catalog stores feet and half the
 *  regions are in France — neither reader should have to convert. Rounded
 *  hard: this is a glance, not a spec. Under ten feet a decimal earns its
 *  place in metres; above it, it doesn't. */
function height(ft) {
  const m = ft * 0.3048;
  return { value: `${ft} ft`, label: `${m < 10 ? Math.round(m * 10) / 10 : Math.round(m)} m tall` };
}

/**
 * Up to four facts, in a fixed order of interest, skipping whatever a plant
 * hasn't got.
 *
 * Host count leads wherever there is one, because it's the number the whole app
 * is built around — how many kinds of caterpillar this plant feeds, and so how
 * much of the food web it holds up. Named wildlife comes next: "6 creatures we
 * can name" is the promise of the page you're about to open. Then bloom, which
 * is what a gardener looks for, and last the mature size, which is the thing
 * that decides whether a plant fits at all.
 *
 * Every label is one or two short words and none of them wraps: four facts, a
 * URL and 1040 px of card is not a lot of room, and a label that breaks over
 * two lines drags the whole row out of alignment. Labels stay plural whatever
 * the number — "1 creatures" would be worse than the second of type it saves,
 * so the singular is spelled out where it happens.
 */
function factsFor(plant, wildlifeCount) {
  const facts = [];
  if (plant.hostLepCount > 0) {
    facts.push({ icon: "caterpillar", value: String(plant.hostLepCount), label: "caterpillars" });
  }
  if (wildlifeCount > 0) {
    facts.push({ icon: "butterfly", value: String(wildlifeCount), label: wildlifeCount === 1 ? "creature fed" : "creatures fed" });
  }
  if (plant.bloom) {
    const { startMonth: a, endMonth: b } = plant.bloom;
    facts.push({ icon: "bloom", value: a === b ? MONTHS[a] : `${MONTHS[a]}–${MONTHS[b]}`, label: "in bloom" });
  }
  facts.push({ icon: "height", ...height(plant.matureHeightFt) });
  return facts.slice(0, 4);
}

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

const BRAND = "#7ec894";

/**
 * The four fact icons, drawn rather than typed.
 *
 * The app writes these facts with emoji — 🐛, 🐝 — because that's its icon
 * idiom in running text, where a reader is already looking at words and a
 * familiar coloured glyph is the fastest thing to recognise. A share card is
 * the opposite situation: one flat green on one dark ground, seen at thumbnail
 * size in a chat list, and four full-colour emoji dropped into that read as
 * clutter competing with the plant.
 *
 * So they follow the plant glyphs' rules instead (`scripts/gen-form-glyphs.mjs`
 * sets them out): one 48-unit box, filled masses with any stem stroked at one
 * weight, roughly equal ink in each, and the same brand green as the silhouette
 * beside them. The height mark stands on the ground line at y≈40, which is
 * where every plant in the set stands too — that's the whole reason it reads as
 * "grows this tall" rather than as an arrow.
 *
 * They live here rather than in `components/plant-glyphs.ts` because nothing in
 * the app draws them; putting them there would ship four unused shapes in the
 * bundle. If the app ever wants them, that's where they should move.
 */
const FACT_ICONS = {
  // A grub in profile: four body segments scalloping down to the ground, then a
  // larger head with an eye punched out of it (hence the even-odd fill — the
  // second subpath winds the other way) and two antennae.
  caterpillar: {
    evenodd: true,
    marks: [
      { d: "M10.5 33.2a4.6 4.6 0 1 0 0-.01Z" },
      { d: "M17.4 30.6a5.1 5.1 0 1 0 0-.01Z" },
      { d: "M24.3 28.9a5.4 5.4 0 1 0 0-.01Z" },
      { d: "M31.2 29.3a5.4 5.4 0 1 0 0-.01Z" },
      { d: "M38.6 32.2a6.6 6.6 0 1 0 0-.01ZM40.6 29.6a1.9 1.9 0 1 1 0 .01Z" },
      { d: "M39.2 25.2l1.4-5.6", stem: true, w: 2.6 },
      { d: "M43.2 26.6l4.2-3.9", stem: true, w: 2.6 },
    ],
  },
  // Wings first, body over them, antennae behind the upper pair so they read as
  // a notch rather than two loose hairs at small sizes.
  butterfly: {
    marks: [
      { d: "M23 17L19 9.5", stem: true, w: 2.4 },
      { d: "M25 17L29 9.5", stem: true, w: 2.4 },
      { d: "M22 22C20 12.5 12.5 7 8.5 10.5C4.8 13.8 10 22.6 22 24Z" },
      { d: "M26 22C28 12.5 35.5 7 39.5 10.5C43.2 13.8 38 22.6 26 24Z" },
      { d: "M22 27C18.5 30 12 33 11 37C10.2 40.5 17 41 20 36.5C21.4 34.4 22.2 31 22 27Z" },
      { d: "M26 27C29.5 30 36 33 37 37C37.8 40.5 31 41 28 36.5C26.6 34.4 25.8 31 26 27Z" },
      { d: "M24 16c1.7 0 2.8 1.7 2.8 4.2v12c0 2.5-1.1 4.2-2.8 4.2s-2.8-1.7-2.8-4.2v-12C21.2 17.7 22.3 16 24 16Z" },
    ],
  },
  // The perennial glyph's own flower head — the same bloom the wildflower
  // silhouette wears, which is the point — opened up to fill the box on its
  // own, since here it isn't sitting on a stem with leaves under it.
  bloom: {
    scale: 1.26,
    marks: [
      { d: "M24 24.5C29.2 21.2 27.9 13.7 24 11.1C20.1 13.7 18.8 21.2 24 24.5Z" },
      { d: "M24 24.5C28.8 28.4 35.3 24.9 36.6 20.3C32.8 17.5 25.5 18.5 24 24.5Z" },
      { d: "M24 24.5C21.8 30.2 27.1 35.4 31.8 35.3C33.4 30.7 30.1 24.1 24 24.5Z" },
      { d: "M24 24.5C17.9 24.1 14.6 30.7 16.2 35.3C20.9 35.4 26.2 30.2 24 24.5Z" },
      { d: "M24 24.5C22.5 18.5 15.2 17.5 11.4 20.3C12.7 24.9 19.2 28.4 24 24.5Z" },
      { d: "M24 19.6a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 1 0 0-9.8Z" },
    ],
  },
  // Ground line, and a rise off it. Wider and heavier than it needs to be to
  // read, because it has to carry the same weight of ink as a butterfly.
  height: {
    marks: [
      { d: "M24 7l7.4 10.2H16.6Z" },
      { d: "M21.4 15.6h5.2v21.4h-5.2Z" },
      { d: "M8.5 36.8h31v3.7h-31Z" },
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
  // A group transform rather than rescaled path data: the geometry stays the
  // number it was drawn as, and "this shape wants to sit larger in the box" is
  // said once instead of being baked into every coordinate.
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
 * The name is the one thing that can't be allowed to overflow, and plant names
 * run from "Wild Rye" to "Mediterranean False Brome". Rather than shrink the
 * type until the longest name fits — which would leave every short name looking
 * timid — the size steps down in three stages, measured in characters because
 * the card is set in one font at one weight and nothing else varies.
 */
function nameSize(name) {
  if (name.length <= 14) return 96;
  if (name.length <= 20) return 80;
  return 66;
}

function cardHtml({ name, latin, glyph, keystone, facts }) {
  const chips = facts
    .map(
      (f) => `<li>
        ${iconMarkup(f.icon, 44)}
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
  /* The same brand wash the site-wide card carries, so the two are obviously
     from one place. It sits behind the drawing, which lifts the silhouette off
     the flat background without a photograph. */
  .wash {
    position: absolute; right: -120px; bottom: -300px;
    width: 900px; height: 900px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.6;
  }
  header { display: flex; align-items: center; gap: 16px; position: relative; }
  .wordmark { font-size: 30px; font-weight: 800; letter-spacing: -0.01em; }
  .keystone {
    margin-left: auto; display: flex; align-items: center; gap: 10px;
    font-size: 23px; font-weight: 700; color: #14160f;
    background: ${BRAND}; border-radius: 999px; padding: 9px 20px 9px 16px;
  }
  .keystone svg { width: 22px; height: 22px; }

  .mid { position: relative; display: flex; align-items: center; gap: 56px; }
  .names { min-width: 0; }
  h1 {
    font-weight: 800; letter-spacing: -0.025em; line-height: 1.04;
    font-size: ${nameSize(name)}px;
  }
  .latin {
    margin-top: 14px; font-size: 36px; font-style: italic;
    color: ${BRAND}; letter-spacing: -0.005em;
  }
  /* The drawing, at the size it was designed to hold: one 48-unit box, the
     plant standing on the ground line. Pushed right so an unfurler's square
     crop keeps both it and the name. */
  .drawing { margin-left: auto; flex: none; opacity: 0.95; }

  /* Four facts and an address share 1040 px, so nothing here may wrap: a label
     that breaks over two lines lifts its own number out of line with the rest
     and the row stops reading as a row. */
  ul { position: relative; display: flex; gap: 38px; list-style: none; align-items: center; }
  li { display: flex; align-items: center; gap: 12px; white-space: nowrap; }
  li > svg { flex: none; display: block; }
  .ftext { display: flex; flex-direction: column; }
  .ftext b { font-size: 38px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
  .ftext i { font-size: 20px; font-style: normal; color: #cdcdbd; margin-top: 4px; }
  .url { margin-left: auto; padding-left: 24px; font-size: 24px; font-weight: 650; color: ${BRAND}; }
</style>
<div class="wash"></div>
<header>
  ${mark}<span class="wordmark">Indigene</span>
  ${keystone ? `<span class="keystone">${keystoneSvg}Keystone</span>` : ""}
</header>
<div class="mid">
  <div class="names">
    <h1>${esc(name)}</h1>
    <div class="latin">${esc(latin)}</div>
  </div>
  <div class="drawing">${glyph}</div>
</div>
<ul>${chips}<li class="url">indigene.app</li></ul>
`;
}

/** The keystone arch, inlined from `components/keystone-icon.ts`. */
const keystoneSvg =
  '<svg viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M3 21v-6a9.5 9.5 0 0 1 4.6-8.1l1.7 2.8A6.3 6.3 0 0 0 6.2 15v6Z" fill="currentColor" opacity="0.5"/>' +
  '<path d="M21 21v-6a9.5 9.5 0 0 0-4.6-8.1l-1.7 2.8a6.3 6.3 0 0 1 3.1 5.3v6Z" fill="currentColor" opacity="0.5"/>' +
  '<path d="M8.5 2.8h7l-1.6 6.8h-3.8Z" fill="currentColor"/></svg>';

// ---------------------------------------------------------------------------

const loader = await openLoader();
let plants;
try {
  const [{ REGIONS, loadPlants }, { wildlifeForPlant }, { glyphMarkup }] = await Promise.all([
    loader.load("/src/lib/plants.ts"),
    loader.load("/src/lib/wildlife.ts"),
    loader.load("/src/components/plant-glyphs.ts"),
  ]);
  // A species native to more than one covered region shares one slug and one
  // card, so the first region's row wins — the same choice the profile page and
  // the prerenderer make. Its wildlife ties are counted across every region it
  // grows in, because the card names the plant, not the plant-in-a-place.
  const seen = new Map();
  for (const region of REGIONS) {
    for (const plant of loadPlants(region)) {
      const prev = seen.get(plant.id);
      const ties = wildlifeForPlant(region.meta.id, plant.id).length;
      if (prev) prev.wildlifeCount = Math.max(prev.wildlifeCount, ties);
      else seen.set(plant.id, { plant, wildlifeCount: ties });
    }
  }
  plants = [...seen.values()].map(({ plant, wildlifeCount }) => ({
    slug: plant.id,
    name: displayName(plant.common),
    latin: plant.latin,
    keystone: plant.keystone,
    facts: factsFor(plant, wildlifeCount),
    glyph: glyphMarkup(plant.form, 300, BRAND),
  }));
} finally {
  await loader.close();
}

const wanted = only.size ? plants.filter((p) => only.has(p.slug)) : plants;
if (only.size && wanted.length !== only.size) {
  const missing = [...only].filter((s) => !plants.some((p) => p.slug === s));
  throw new Error(`gen-plant-cards: no such plant: ${missing.join(", ")}`);
}

if (CHECK) {
  mkdirSync(outDir, { recursive: true });
  const have = new Set(readdirSync(outDir).filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
  const missing = plants.filter((p) => !have.has(p.slug)).map((p) => p.slug);
  const extra = [...have].filter((slug) => !plants.some((p) => p.slug === slug));
  if (missing.length) console.error(`missing a card: ${missing.join(", ")}`);
  if (extra.length) console.error(`card for a plant that no longer exists: ${extra.join(", ")}`);
  if (missing.length || extra.length) process.exit(1);
  console.log(`all ${plants.length} plant cards present`);
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

let n = 0;
for (const card of wanted) {
  await page.setContent(cardHtml(card), { waitUntil: "load" });
  const shot = await page.screenshot({ type: "jpeg", quality: QUALITY });
  const out = join(outDir, `${card.slug}.jpg`);
  // Only rewrite what changed, so a re-run doesn't churn 200-odd files in git.
  if (!existsSync(out) || !readFileSync(out).equals(shot)) writeFileSync(out, shot);
  if (++n % 25 === 0) console.log(`  …${n}/${wanted.length}`);
}
await browser.close();

// A renamed or removed plant leaves a card behind; sweep it, but only on a
// full run, where `plants` is the whole catalog.
if (!only.size) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".jpg") && !plants.some((p) => `${p.slug}.jpg` === f)) unlinkSync(join(outDir, f));
  }
}
console.log(`wrote ${wanted.length} plant cards into public/og/plants/ at ${W}×${H}`);
