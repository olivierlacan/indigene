// Compile the repo's CHANGELOG.md into the public "What's new" page — a
// single, static, dependency-free HTML file styled like the app.
//
//   npm run release-notes            (writes dist/release-notes/index.html)
//   node scripts/build-release-notes.mjs --out <path>
//
// The changelog is the single source of truth. This script publishes the
// Added / Changed / Fixed / Removed / Deprecated / Security bullets of every
// *released* version verbatim, so those bullets must already read well for a
// general audience (that's the deal documented at the top of CHANGELOG.md).
// The `Unreleased` section and any `Internal` sections never leave the repo.
//
// It fails loudly on anything it can't parse — a malformed heading or an
// unknown section name breaks the Pages deploy rather than publishing a
// half-rendered page.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHANGELOG = resolve(HERE, "../../CHANGELOG.md");
const outFlag = process.argv.indexOf("--out");
const OUT =
  outFlag !== -1
    ? resolve(process.cwd(), process.argv[outFlag + 1])
    : resolve(HERE, "../dist/release-notes/index.html");

// Keep a Changelog section → public heading. `null` = kept out of the page.
const SECTIONS = {
  Added: "New",
  Changed: "Improved",
  Fixed: "Fixed",
  Removed: "Removed",
  Deprecated: "Going away",
  Security: "Security",
  Internal: null,
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fail(msg) {
  console.error(`build-release-notes: ${msg}`);
  process.exit(1);
}

// ---------- parse ----------

/** @returns {{version: string, date: string, name: string|null,
 *             sections: {title: string, items: string[]}[]}[]} */
function parseChangelog(text) {
  const releases = [];
  let release = null; // current release (null while in the preamble/Unreleased)
  let section = null; // current {title, items} within `release`
  let expectName = false; // next paragraph may be the release's bold name

  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");

    const h2 = line.match(/^## (.*)$/);
    if (h2) {
      section = null;
      if (h2[1] === "[Unreleased]") {
        release = null; // parsed but never published
        continue;
      }
      const m = h2[1].match(/^\[(\d+\.\d+(?:\.\d+)?)\] - (\d{4})-(\d{2})-(\d{2})$/);
      if (!m) fail(`unrecognized release heading: "${line}"`);
      const [, version, y, mo, d] = m;
      release = {
        version,
        date: `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`,
        name: null,
        sections: [],
      };
      releases.push(release);
      expectName = true;
      continue;
    }

    const h3 = line.match(/^### (.*)$/);
    if (h3) {
      expectName = false;
      if (release === null) {
        section = null; // Unreleased content: parsed, never published
        continue;
      }
      if (!(h3[1] in SECTIONS)) {
        fail(
          `unknown section "### ${h3[1]}" under ${release.version} — ` +
            `expected one of: ${Object.keys(SECTIONS).join(", ")}`,
        );
      }
      const title = SECTIONS[h3[1]];
      section = title === null ? null : { title, items: [] };
      if (section) release.sections.push(section);
      continue;
    }

    if (release && expectName) {
      const name = line.match(/^\*\*(.+)\*\*$/);
      if (name) {
        release.name = name[1];
        expectName = false;
        continue;
      }
      if (line !== "") expectName = false;
    }

    if (section) {
      if (/^- /.test(line)) section.items.push(line.slice(2));
      else if (/^\s+\S/.test(line) && section.items.length > 0) {
        // continuation of a wrapped bullet
        section.items[section.items.length - 1] += " " + line.trim();
      }
    }
  }

  if (releases.length === 0) fail("no released versions found in CHANGELOG.md");
  for (const r of releases) {
    if (r.sections.every((s) => s.items.length === 0)) {
      fail(`release ${r.version} has no publishable bullets`);
    }
  }
  return releases;
}

// ---------- render ----------

const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Minimal inline markdown: links, bold, italic, code. Applied post-escape. */
function inline(md) {
  return escapeHtml(md)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

const anchor = (version) => "v" + version.replaceAll(".", "-");

function renderRelease(r) {
  const parts = [];
  parts.push(`<article class="release" id="${anchor(r.version)}">`);
  parts.push(`<header>`);
  parts.push(
    `<h2><a class="permalink" href="#${anchor(r.version)}">Version ${escapeHtml(r.version)}</a></h2>`,
  );
  if (r.name) parts.push(`<p class="release-name">${inline(r.name)}</p>`);
  parts.push(`<p class="release-date">${escapeHtml(r.date)}</p>`);
  parts.push(`</header>`);
  for (const s of r.sections) {
    if (s.items.length === 0) continue;
    parts.push(`<h3>${escapeHtml(s.title)}</h3>`);
    parts.push(`<ul>`);
    for (const item of s.items) parts.push(`<li>${inline(item)}</li>`);
    parts.push(`</ul>`);
  }
  parts.push(`</article>`);
  return parts.join("\n");
}

function renderPage(releases) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>What's new — Indigene</title>
<meta name="description" content="Everything new in Indigene, the free native-plant finder, described in plain words.">
<style>
/* Tokens mirrored from app/src/styles.css so the page feels like the app. */
:root {
  --bg: #f7f5ef; --surface: #ffffff; --ink: #14140f; --ink-soft: #3d3d34;
  --line: #cfcabb; --brand: #175e33; --brand-ink: #0d3d20; --brand-bg: #e2efe4;
  --focus: #1747b3; --radius: 14px; --maxw: 34rem;
  color-scheme: light dark; font-size: 112.5%;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14160f; --surface: #1e2118; --ink: #f2f1e8; --ink-soft: #cdcdbd;
    --line: #3c4232; --brand: #7ec894; --brand-ink: #b9e6c6; --brand-bg: #1f3326;
    --focus: #8fb3ff;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}
main { max-width: var(--maxw); margin: 0 auto; padding: 1.5rem 1rem 3rem; }
h1 { line-height: 1.2; margin: 0.5rem 0; }
.lede { color: var(--ink-soft); margin: 0 0 0.75rem; }
.back { display: inline-block; margin: 0.25rem 0 1rem; color: var(--focus); }
a { color: var(--focus); }
a:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.release {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 1rem 1.25rem; margin: 1.25rem 0;
}
.release h2 { margin: 0; font-size: 1.3rem; }
.release h2 .permalink { color: var(--brand-ink); text-decoration: none; }
.release h2 .permalink:hover, .release h2 .permalink:focus-visible {
  text-decoration: underline;
}
.release-name { margin: 0.15rem 0 0; font-weight: 700; color: var(--ink); }
.release-date { margin: 0.1rem 0 0; color: var(--ink-soft); font-size: 0.9rem; }
.release h3 {
  display: inline-block; margin: 1rem 0 0.25rem; padding: 0.1rem 0.6rem;
  background: var(--brand-bg); color: var(--brand-ink);
  border-radius: 999px; font-size: 0.85rem; letter-spacing: 0.02em;
}
.release ul { margin: 0.35rem 0 0.5rem; padding-left: 1.2rem; }
.release li { margin: 0.45rem 0; color: var(--ink-soft); }
.release li strong, .release li em { color: var(--ink); }
code {
  background: var(--brand-bg); color: var(--brand-ink);
  padding: 0.05rem 0.3rem; border-radius: 6px; font-size: 0.9em;
}
footer { color: var(--ink-soft); margin-top: 2rem; font-size: 0.9rem; }
</style>
</head>
<body>
<main>
<h1>What&rsquo;s new in Indigene</h1>
<p class="lede">Indigene is a free app that finds the plants that naturally
belong where you live. This page lists everything new in the app, newest
first, in plain words. The app updates itself, so whatever you read here is
already yours.</p>
<a class="back" href="../">&larr; Open Indigene</a>
${releases.map(renderRelease).join("\n")}
<footer>
<p>Indigene is free, open source, and built on public data.
<a href="https://github.com/olivierlacan/indigene">See how it&rsquo;s made on GitHub</a>.</p>
</footer>
</main>
</body>
</html>
`;
}

const releases = parseChangelog(readFileSync(CHANGELOG, "utf8"));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, renderPage(releases));
console.log(
  `release notes: ${releases.length} versions (${releases[0].version} → ${releases[releases.length - 1].version}) → ${OUT}`,
);
