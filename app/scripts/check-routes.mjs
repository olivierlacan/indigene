// Proves that every address the app hands out is an address that exists.
//
//   npm run build && npm run routes:check
//
// ## What can go wrong, and why it's invisible
//
// The app puts a page's canonical path in the address bar — `/plants/ilex-opaca`,
// `/wildlife/monarch` — because that is the form a link preview can fetch. A
// `#…` fragment is never sent to a server, so a hash address can only ever ask
// for `/` and unfurl as the generic site card. Two lists have to agree for that
// to work: what `lib/routes.ts` says is a page, and what `scripts/prerender.mjs`
// wrote a file for.
//
// When they disagree, nothing looks broken. Adding a plant to a region, or a
// new animal, extends the first list automatically — and if the file didn't get
// written, the app still *shows* the plant perfectly well. It's only the
// stranger who receives the link who finds out: the address answers 404,
// previews as the site rather than the plant, and Google indexes nothing. There
// is no way to notice that from inside the app, which is exactly why it belongs
// in CI.
//
// So, five checks:
//
//   1. Every shareable address has a real file in `dist/`.
//   2. Every prerendered file is an address the app would actually hand out —
//      no dead pages nothing links to.
//   3. Each file's own metadata names *itself*: canonical link, `og:url` and a
//      title that isn't the shell's. A file that exists but kept the site-wide
//      head is a 200 that still previews as the generic card.
//   4. Every address round-trips: parse it back through the router's own
//      `parseRoute`, hand the result to `canonicalPath`, and get the same
//      address. This catches a slug the router can't reach (a step missing from
//      `PARAM_STEPS`) and one that encodes differently than it was written.
//   5. `public/404.html`'s `ROUTES` covers every step in `APP_STEPS`. That list
//      is a hand-kept copy — it has to be, it runs before any of the app loads
//      — and a step missing from it is served "we couldn't find that page"
//      instead of being bounced into the app. It had drifted four steps behind,
//      which is how `/settings/units` and `/settings/language` broke.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { openLoader } from "./_load-ts.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const ORIGIN = "https://indigene.app";
const BASE = process.env.BASE_PATH || "/";

/** The shell's own title, from index.html — a prerendered page that still has
 *  it never got its head rewritten. */
const SHELL_TITLE = /<title>([\s\S]*?)<\/title>/
  .exec(readFileSync(join(root, "index.html"), "utf8"))[1]
  .trim();

const problems = [];
const fail = (what, detail) => problems.push({ what, detail });

// ---------------------------------------------------------------------------

const loader = await openLoader();
let routes;
try {
  routes = await loader.load("/src/lib/routes.ts");
} finally {
  await loader.close();
}
const { APP_STEPS, canonicalPath, parseRoute, shareablePaths } = routes;

const expected = shareablePaths();
const dupes = expected.filter((p, i) => expected.indexOf(p) !== i);
if (dupes.length) fail("two pages claim the same address", [...new Set(dupes)].join(", "));

// --- 5. the 404 bounce list -------------------------------------------------
// Parsed rather than imported: it's a literal inside a <script> in an HTML file
// that never goes through the bundler.
const notFound = readFileSync(join(root, "public", "404.html"), "utf8");
const routesLiteral = /var ROUTES = \[([\s\S]*?)\]/.exec(notFound);
if (!routesLiteral) {
  fail("public/404.html", "no `var ROUTES = [...]` found — has the bounce script been rewritten?");
} else {
  const listed = new Set([...routesLiteral[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
  // "" is the welcome step, which is the site root and never a path segment.
  // "search" is the retired plants-index address, kept in 404.html on purpose.
  const missing = APP_STEPS.filter((s) => s && !listed.has(s));
  if (missing.length) {
    fail(
      "public/404.html's ROUTES has drifted from APP_STEPS",
      `missing ${missing.join(", ")} — a deep path under one of those (…/${missing[0]}/x) ` +
        `is served the not-found page instead of being bounced into the app`
    );
  }
}

// --- 1 & 4. every address exists, and the app would hand it out -------------
const missingFiles = [];
for (const path of expected) {
  const { step, param } = parseRoute(path);
  const round = canonicalPath(step, param);
  if (round !== path) {
    fail(
      `/${path} is not an address the app can produce`,
      `the router parses it as ${JSON.stringify({ step, param })} and canonicalizes that to ` +
        `${round === null ? "the hash form (no canonical path)" : `/${round}`}`
    );
  }
  if (!existsSync(join(dist, path, "index.html"))) missingFiles.push(path);
}
if (missingFiles.length) {
  const shown = missingFiles.slice(0, 12);
  fail(
    `${missingFiles.length} shareable page${missingFiles.length === 1 ? " has" : "s have"} no prerendered file`,
    `${shown.map((p) => `/${p}`).join(", ")}${missingFiles.length > shown.length ? ", …" : ""}\n` +
      "    Each of these answers 404 and previews as the generic site card. " +
      "Run `npm run build` — if they're still missing, scripts/prerender.mjs isn't producing them."
  );
}

// --- 2. no prerendered file for an address nothing hands out ----------------
/** Every directory under dist/ holding a page this script wrote. */
function prerendered(dir = dist) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    // Vite's own output and the release-notes build are not app routes.
    if (dir === dist && (name === "assets" || name === "og" || name === "release-notes" || name === "registry" || name === "icons")) continue;
    const index = join(full, "index.html");
    if (existsSync(index) && readFileSync(index, "utf8").includes("scripts/prerender.mjs")) {
      out.push(relative(dist, full).split(/[\\/]/).join("/"));
    }
    out.push(...prerendered(full));
  }
  return out;
}

if (existsSync(dist)) {
  const want = new Set(expected);
  const orphans = prerendered().filter((p) => !want.has(p));
  if (orphans.length) {
    fail(
      `${orphans.length} prerendered page${orphans.length === 1 ? "" : "s"} nothing links to`,
      `${orphans.slice(0, 12).map((p) => `/${p}`).join(", ")}\n` +
        "    Either the app should canonicalize to them (lib/routes.ts) or they shouldn't be written."
    );
  }
} else {
  fail("dist/ is missing", "run `npm run build` before this check");
}

// --- 3. each page's head names itself, and its picture exists ---------------
// The picture is checked the same way and for the same reason as the page. A
// plant's card is drawn by `scripts/gen-plant-cards.mjs` and *committed*, not
// built — so a plant added after the last run has a page whose og:image points
// at a file nobody ever drew. The page previews with a broken picture, or with
// no picture at all, and again the only person who finds out is the one who was
// sent the link.
const stale = [];
const noImage = [];
for (const path of expected) {
  const file = join(dist, path, "index.html");
  if (!existsSync(file)) continue; // already reported above
  const html = readFileSync(file, "utf8");
  const url = `${ORIGIN}${BASE}${path}`;
  const title = /<title>([\s\S]*?)<\/title>/.exec(html)?.[1].trim();
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const ogUrl = /<meta property="og:url" content="([^"]+)"/.exec(html)?.[1];
  if (canonical !== url || ogUrl !== url || !title || title === SHELL_TITLE) {
    stale.push(`/${path}${title === SHELL_TITLE ? " (still the shell's title)" : ` (canonical ${canonical}, og:url ${ogUrl})`}`);
  }

  const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
  const twitter = /<meta name="twitter:image" content="([^"]+)"/.exec(html)?.[1];
  if (!image || !image.startsWith(`${ORIGIN}${BASE}`)) {
    noImage.push(`/${path} — og:image is ${image ?? "missing"}, which isn't an address on this site`);
  } else if (!existsSync(join(dist, image.slice(`${ORIGIN}${BASE}`.length)))) {
    noImage.push(`/${path} — og:image points at ${image.slice(ORIGIN.length)}, and no such file was built`);
  } else if (twitter !== image) {
    noImage.push(`/${path} — og:image and twitter:image disagree (${image} vs ${twitter})`);
  }
}
if (stale.length) {
  fail(
    `${stale.length} page${stale.length === 1 ? "" : "s"} kept the shell's share metadata`,
    `${stale.slice(0, 8).join("\n    ")}\n    A 200 that still previews as the generic card is the bug this all exists to prevent.`
  );
}
if (noImage.length) {
  fail(
    `${noImage.length} page${noImage.length === 1 ? " has" : "s have"} a share picture that isn't there`,
    `${noImage.slice(0, 8).join("\n    ")}\n` +
      "    These cards are committed, not built — run `node scripts/gen-plant-cards.mjs` (plants) or\n" +
      "    `node scripts/gen-planting-cards.mjs` (the propagation pages) and commit what it writes."
  );
}

// ---------------------------------------------------------------------------

if (problems.length) {
  console.error("");
  for (const { what, detail } of problems) {
    console.error(`  ✗ ${what}`);
    console.error(`    ${detail}\n`);
  }
  console.error(`routes: ${problems.length} problem${problems.length === 1 ? "" : "s"}.`);
  process.exit(1);
}

console.log(
  `routes: ${expected.length} shareable pages, each with a file, its own share card, ` +
    `and an address the app hands out.`
);
