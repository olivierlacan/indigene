// Writes a real HTML file for every shareable page, so a link previews as the
// thing it points at.
//
//   node scripts/prerender.mjs        # run automatically by `npm run build`
//
// ## Why this exists
//
// The app routes on the hash, and its canonical URLs are real paths
// (…/plants/asclepias-tuberosa — see `plantShareUrl`). Until this script, no
// such file existed: GitHub Pages answered every one of those addresses with
// public/404.html, **and with an HTTP 404 status**. So a plant link posted to
// iMessage, Slack, WhatsApp or Discord got a not-found response carrying the
// site-wide share card — the same generic title and picture for all 198 plants,
// when an unfurler agreed to show anything at all. Only the site root, the one
// address that is a real file, previewed properly.
//
// So: after Vite builds, copy the built shell to dist/<route>/index.html for
// every page worth sharing, and rewrite the head metadata of each copy to
// describe *that* page. Those addresses become real documents with a 200, and
// the card an unfurler builds says the plant's name, its Latin binomial and
// what it feeds.
//
// The body is untouched — these are the same single-page app, and `main.ts`
// reads the path as a route (`currentRoute`) the way it reads the hash.
// Nothing here renders the page's content; this is metadata, not server-side
// rendering.
//
// The app then *keeps* that address rather than folding it into the hash form
// (`syncAddressBar`), which is what makes these files worth writing: the URL a
// reader copies out of the address bar is the one with a file behind it, and so
// the one that previews as the page. A `#…` fragment is never sent to a server,
// so a hash address can only ever fetch the site root and show its card.
//
// public/404.html still matters, and still redirects: deep links below a page
// (…/plants/<slug>/ecosystem, …/wildlife/in/<region>) and the flow steps aren't
// prerendered, and a typo has to land somewhere.
//
// ## The picture
//
// A plant page carries its own: `scripts/gen-plant-cards.mjs` draws one card
// per plant and they're committed under public/og/plants/, so this build only
// points at them — it never renders anything. The propagation pages work the
// same way (`scripts/gen-planting-cards.mjs` → public/og/planting/), and there
// the index gets one too: its card is the year with every season lit, which is
// a true picture of a page about all fifteen techniques rather than a portrait
// of one of them.
//
// Every other page still shows the site-wide card, which is honest for a
// region and for a catalog: those pages are a list, and a drawing of one member
// of it would be a lie about the rest.
//
// ## What it does not do yet
//
// The metadata is English on every page, because a query string can't pick a
// file: …/plants/<slug>?lang=fr is the same document. A reader still gets
// French — the app reads `?lang=` as it boots — but a crawler that doesn't run
// JavaScript is served English. Real French URLs would be a second tree.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

// The origin is hardcoded for the same reason index.html hardcodes it: og:image
// and og:url must be absolute, and the site's address is pinned by public/CNAME.
const ORIGIN = "https://indigene.app";
const BASE = process.env.BASE_PATH || "/";
const CARD = `${ORIGIN}${BASE}og/share-card.png`;
const CARD_ALT = "Indigene — native plants for exactly where you stand";

/** A plant's own card, drawn by `scripts/gen-plant-cards.mjs` and committed
 *  under public/og/plants/. */
const plantCard = (slug) => `${ORIGIN}${BASE}og/plants/${slug}.jpg`;

/** A propagation technique's card — the year with its window filled in — drawn
 *  by `scripts/gen-planting-cards.mjs` and committed under public/og/planting/.
 *  The index has one too, under the reserved slug `index`. Everything else
 *  still shows the site-wide card, which is honest for a list. */
const plantingCard = (slug) => `${ORIGIN}${BASE}og/planting/${slug}.jpg`;

/** Locale-style `{name}` interpolation, matching `t()` in lib/i18n.ts. */
const fill = (s, vars = {}) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

/** Trim to something an unfurler will show whole, breaking on a word. */
function clip(text, max = 200) {
  const s = String(text).replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------------------------------------------------------------------------
// The head block each page gets, and the tags it replaces in the built shell.
// ---------------------------------------------------------------------------

/** Every tag identity this script emits. The strip step checks the shell
 *  against this list, so a tag added to index.html and forgotten here fails the
 *  build instead of silently vanishing from all 200-odd copies. */
const EMITTED = new Set([
  "title",
  "description",
  "canonical",
  "hreflang",
  "og:type",
  "og:site_name",
  "og:url",
  "og:title",
  "og:description",
  "og:image",
  "og:image:width",
  "og:image:height",
  "og:image:alt",
  "og:locale",
  "og:locale:alternate",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
]);

/**
 * Pull the shell's own head metadata out, and report what was taken.
 *
 * Attribute values never contain `>`, so `[^>]*` spans the multi-line tags in
 * index.html safely. Each pattern also swallows an HTML comment sitting
 * directly above the tag — index.html explains each block of these in a comment
 * right before it, and leaving those behind would strand a paragraph about
 * share cards above tags that are no longer there.
 */
function stripHeadMeta(html) {
  const found = new Set();
  // `(?!-->)` rather than a lazy `[\s\S]*?`: lazy backtracks straight through
  // the end of one comment into the next, so the favicon block sandwiched
  // between two of these comments got swallowed along with them.
  const LEAD = /(?:[ \t]*<!--(?:(?!-->)[\s\S])*-->\n)?[ \t]*/.source;
  const take = (source, name) => {
    html = html.replace(new RegExp(LEAD + source + /\n?/.source, "g"), (tag) => {
      found.add(typeof name === "function" ? name(tag) : name);
      return "";
    });
  };
  take(/<title>[\s\S]*?<\/title>/.source, "title");
  take(/<meta\s[^>]*name="description"[^>]*>/.source, "description");
  take(/<link\s[^>]*rel="canonical"[^>]*>/.source, "canonical");
  take(/<link\s[^>]*rel="alternate"[^>]*hreflang=[^>]*>/.source, "hreflang");
  take(/<meta\s[^>]*property="og:[^"]*"[^>]*>/.source, (t) => t.match(/property="(og:[^"]*)"/)[1]);
  take(/<meta\s[^>]*name="twitter:[^"]*"[^>]*>/.source, (t) => t.match(/name="(twitter:[^"]*)"/)[1]);
  // Whatever the removals left behind — a run of blank lines mid-head.
  html = html.replace(/\n{3,}/g, "\n\n");

  // The head holds more than share metadata, and a stray-greedy pattern above
  // would take it silently. Everything a page needs to *work* is checked here.
  const KEPT = [
    'rel="icon"',
    'rel="apple-touch-icon"',
    'rel="manifest"',
    'name="theme-color"',
    'name="viewport"',
    '<script type="module"',
    "</head>",
  ];
  const lost = KEPT.filter((needle) => !html.includes(needle));
  if (lost.length) throw new Error(`prerender: stripping took more than it should — lost ${lost.join(", ")}`);

  const missing = [...EMITTED].filter((k) => !found.has(k));
  const unknown = [...found].filter((k) => !EMITTED.has(k));
  if (missing.length || unknown.length) {
    throw new Error(
      "index.html's share metadata has drifted from scripts/prerender.mjs.\n" +
        (missing.length ? `  no longer in index.html: ${missing.join(", ")}\n` : "") +
        (unknown.length ? `  in index.html but never re-emitted: ${unknown.join(", ")}\n` : "") +
        "  Update EMITTED and headMeta() so every prerendered page keeps them."
    );
  }
  return html;
}

/** Says who wrote a file, so a re-run can tell its own output from Vite's. */
const MARKER = "<!-- Head metadata written by scripts/prerender.mjs. -->";

/** The per-page replacement for what `stripHeadMeta` took out. */
function headMeta({ title, description, path, image, imageAlt }) {
  const url = `${ORIGIN}${BASE}${path}`;
  const card = image ?? CARD;
  const alt = imageAlt ?? CARD_ALT;
  const tag = (s) => `    ${s}\n`;
  return (
    tag(MARKER) +
    tag(`<title>${esc(title)}</title>`) +
    tag(`<meta name="description" content="${esc(description)}" />`) +
    tag(`<link rel="canonical" href="${esc(url)}" />`) +
    // Now that each page is its own file, its alternates can name *it* rather
    // than the site root — which is all the site-wide tags in index.html could
    // honestly claim before this script existed.
    tag(`<link rel="alternate" hreflang="en" href="${esc(`${url}?lang=en`)}" />`) +
    tag(`<link rel="alternate" hreflang="fr" href="${esc(`${url}?lang=fr`)}" />`) +
    tag(`<link rel="alternate" hreflang="x-default" href="${esc(url)}" />`) +
    tag(`<meta property="og:type" content="website" />`) +
    tag(`<meta property="og:site_name" content="Indigene" />`) +
    tag(`<meta property="og:url" content="${esc(url)}" />`) +
    tag(`<meta property="og:title" content="${esc(title)}" />`) +
    tag(`<meta property="og:description" content="${esc(description)}" />`) +
    tag(`<meta property="og:image" content="${card}" />`) +
    tag(`<meta property="og:image:width" content="1200" />`) +
    tag(`<meta property="og:image:height" content="630" />`) +
    tag(`<meta property="og:image:alt" content="${esc(alt)}" />`) +
    tag(`<meta property="og:locale" content="en" />`) +
    tag(`<meta property="og:locale:alternate" content="fr" />`) +
    tag(`<meta name="twitter:card" content="summary_large_image" />`) +
    tag(`<meta name="twitter:title" content="${esc(title)}" />`) +
    tag(`<meta name="twitter:description" content="${esc(description)}" />`) +
    tag(`<meta name="twitter:image" content="${card}" />`)
  );
}

// ---------------------------------------------------------------------------
// The pages.
// ---------------------------------------------------------------------------

/**
 * Titles and descriptions come from the app's own English dictionary wherever
 * the page already has words for itself, so a share card can't drift from the
 * page it opens. Only the plant descriptions are assembled here, out of two
 * sentences the row already carries.
 */
async function collectPages(load) {
  const [{ en }, { REGIONS, loadPlants }, { WILDLIFE }, { KIND_ORDER, KIND_SLUGS }, { lookalikeIndex }, { TECHNIQUES }, { shareablePaths, PHOTOS_SEGMENT }] =
    await Promise.all([
      load("/src/locales/en.ts"),
      load("/src/lib/plants.ts"),
      load("/src/data/wildlife.ts"),
      load("/src/lib/wildlife.ts"),
      load("/src/lib/lookalikes.ts"),
      load("/src/lib/planting.ts"),
      load("/src/lib/routes.ts"),
    ]);

  const pages = [];
  const add = (path, title, description, extra) =>
    pages.push({ path, title, description: clip(description), ...extra });

  // --- the index pages ---
  // `#/search` is deliberately absent: it's the plants index's old address, and
  // main.ts folds it into `#/plants`. Giving it a file would give a retired
  // address a canonical page of its own; the 404.html bounce still redirects it.
  const totalPlants = REGIONS.reduce((n, r) => n + loadPlants(r).length, 0);
  add("plants", en["plants.docTitle"], en["plants.lede"]);
  add("regions", en["explore.docTitle"], fill(en["explore.lede"], {
    plants: totalPlants,
    regions: REGIONS.length,
  }));
  add("browse", en["browse.docTitle"], en["browse.lede"]);
  add("wildlife", en["wildlife.indexDocTitle"], fill(en["wildlife.indexLede"], { n: WILDLIFE.length }));
  const impostors = lookalikeIndex();
  add("lookalikes", en["lookalikes.indexDocTitle"], fill(en["lookalikes.indexLede"], { n: impostors.length }));
  add("planting", en["planting.docTitle"], en["planting.lede"], {
    image: plantingCard("index"),
    imageAlt: "Ways to grow more — the four seasons, and the count of techniques and sources behind the page",
  });
  add("privacy", en["privacy.docTitle"], en["privacy.lede"]);
  add("sources", en["sources.docTitle"], en["sources.lede"]);
  add("about", en["about.docTitle"], en["about.lede"]);

  // --- one page per region ---
  for (const region of REGIONS) {
    add(
      `regions/${region.meta.id}`,
      fill(en["region.docTitle"], { region: region.meta.name }),
      fill(en["region.lede"], { reference: region.meta.reference })
    );
  }

  // --- one page per plant ---
  // A species can be native to more than one covered region (live oak spans
  // both Florida lists) and the slug is shared, so the first region's row wins
  // — the same choice the profile itself makes (steps/plant.ts).
  const seen = new Set();
  for (const region of REGIONS) {
    for (const plant of loadPlants(region)) {
      if (seen.has(plant.id)) continue;
      seen.add(plant.id);
      // The one kind of page with a picture of its own. The alt text says what
      // the card actually shows, rather than repeating the title — a reader on
      // a screen reader gets the title from `og:title` either way.
      add(
        `plants/${plant.id}`,
        fill(en["plant.docTitle"], { name: plant.common, latin: plant.latin }),
        `${plant.nativeNote} ${plant.givesNote}`,
        {
          image: plantCard(plant.id),
          imageAlt: `${plant.common} (${plant.latin}) — a drawing of its form, with what it feeds and how big it grows`,
        }
      );
      // …and its gallery, which is its own page: the whole plant, its leaves,
      // its flowers and its fruit, plus the live "growing near you" lookup.
      // "Which one is it?" answered with pictures is a link people send, so it
      // gets a real file like every other shareable address.
      //
      // It carries the plant's card, not one of the photographs: a share card
      // has nowhere to put "© the observer, CC BY-NC", and four of the five
      // licences we accept require it (see docs/hero-photos.md). The drawing is
      // ours, so it can go anywhere.
      add(
        `plants/${plant.id}/${PHOTOS_SEGMENT}`,
        fill(en["photos.docTitle"], { name: plant.common }),
        fill(en["photos.shareLede"], { name: plant.common, latin: plant.latin }),
        {
          image: plantCard(plant.id),
          imageAlt: `${plant.common} (${plant.latin}) — a drawing of its form, with what it feeds and how big it grows`,
        }
      );
    }
  }

  // --- one page per animal, and one per group ---
  for (const w of WILDLIFE) {
    add(`wildlife/${w.id}`, fill(en["wildlife.docTitle"], { animal: w.common }), w.blurb);
  }
  // --- one page per impostor ---
  // Shareable for the same reason a plant is: "that tree in your yard is a
  // Callery pear, and here's how I know" is a link somebody sends someone.
  for (const row of impostors) {
    add(
      `lookalikes/${row.lookalike.id}`,
      fill(en["lookalikes.docTitle"], { name: row.lookalike.common }),
      `${row.lookalike.origin} ${row.lookalike.blurb}`
    );
  }

  // --- one page per propagation technique ---
  // Shareable in its own right: "here's how and when to take hardwood cuttings"
  // is a link someone sends a neighbour in January, with no plant attached.
  // The description is the window plus the wait, which is what the page is for.
  for (const tech of TECHNIQUES) {
    const name = en[`prop.${tech.method}.name`];
    const when = en[`prop.${tech.method}.when`];
    add(
      `planting/${tech.slug}`,
      fill(en["planting.techniqueDocTitle"], { name }),
      `${when} ${en[`prop.${tech.method}.plain`]}`,
      {
        image: plantingCard(tech.slug),
        // What the picture actually shows, rather than a repeat of the title —
        // the title reaches a screen reader through `og:title` either way.
        imageAlt: `${name} — which seasons of the year it belongs to. ${when}`,
      }
    );
  }

  for (const kind of KIND_ORDER) {
    add(
      `wildlife/${KIND_SLUGS[kind]}`,
      fill(en["wildlife.groupDocTitle"], { group: en[`wildlifeKind.${kind}.title`] }),
      en[`wildlifeKind.${kind}.blurb`]
    );
  }

  for (const p of pages) {
    if (!p.title || !p.description) throw new Error(`prerender: /${p.path} is missing title or description`);
  }

  // The addresses written here and the addresses the *app* puts in the address
  // bar have to be the same set, or a reader copies out a link with nothing
  // behind it. `lib/routes.ts` is where that set is decided; this file only
  // adds the words. So check the two agree before writing a single file —
  // failing the build beats shipping a page whose link answers 404, and it
  // beats finding out from a stranger who clicked one.
  const written = new Set(pages.map((p) => p.path));
  const expected = shareablePaths();
  const missing = expected.filter((p) => !written.has(p));
  const extra = [...written].filter((p) => !expected.includes(p));
  if (missing.length || extra.length) {
    throw new Error(
      "prerender: the pages written here have drifted from `shareablePaths()` in src/lib/routes.ts.\n" +
        (missing.length ? `  the app canonicalizes to these, but no file is written: ${missing.slice(0, 10).join(", ")}\n` : "") +
        (extra.length ? `  a file is written, but the app never hands the address out: ${extra.slice(0, 10).join(", ")}\n` : "") +
        "  Both lists come from the catalogs, so a mismatch means one of them has a rule the other doesn't."
    );
  }
  return pages;
}

// ---------------------------------------------------------------------------

const shellPath = join(dist, "index.html");
if (!existsSync(shellPath)) {
  throw new Error("dist/index.html is missing — run `vite build` before prerendering.");
}
const shell = stripHeadMeta(readFileSync(shellPath, "utf8"));
if (!shell.includes("</head>")) throw new Error("prerender: the built shell has no </head>");

const loader = await openLoader();
let pages;
try {
  pages = await collectPages(loader.load);
} finally {
  await loader.close();
}

for (const page of pages) {
  // A directory index, because GitHub Pages serves /plants/<slug>/index.html
  // for /plants/<slug> (redirecting to the trailing slash on the way). The
  // canonical URL stays the slash-less one the app hands out.
  const out = join(dist, page.path, "index.html");
  // Re-running over an earlier prerender is fine; clobbering something Vite or
  // the release-notes build put there is not — that would be a route name
  // colliding with a real asset directory, and it should stop the build.
  if (existsSync(out) && !readFileSync(out, "utf8").includes(MARKER)) {
    throw new Error(`prerender: /${page.path} would overwrite a built file`);
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, shell.replace(/[ \t]*<\/head>/, `${headMeta(page)}  </head>`));
}

console.log(`prerendered ${pages.length} pages into dist/`);
