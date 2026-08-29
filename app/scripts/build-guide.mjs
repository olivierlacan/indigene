// Compile Indigene's guide — a discovery tool and plain-words user guide —
// into static HTML styled like the app.
//
//   npm run guide                 (writes dist/guide/index.html + a page each)
//   node scripts/build-guide.mjs --out <dir>
//   node scripts/build-guide.mjs --check   (parse and classify, write nothing)
//
// The guide has two authors. `guide-catalog.mjs` holds the curated half —
// what each part of the app is for, how you use it, and where to learn more.
// CHANGELOG.md holds the other half: this script reads every reader-facing
// bullet and files it under the section it belongs to, so each page carries a
// plain history of how that part of the app grew, kept current by the same
// changelog the "What's new" page is built from.
//
// A bullet is filed two ways, both honest and neither guessed:
//   1. the indigene.app link it already carries (…/wildlife/monarch → wildlife);
//   2. an optional `<!-- guide: wildlife, regions -->` marker, invisible on
//      GitHub and on the published pages, for the many bullets that link
//      nowhere and for a change that touches more than one section.
// A bullet that matches neither is simply left out — no page claims a change
// it can't prove is theirs.
//
// Like the release-notes build, it fails loudly: an unknown section in a
// marker, or a malformed changelog heading, stops the build rather than
// shipping a half-filed page.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SECTIONS, SECTION_BY_ID, SEGMENT_TO_ID, APP } from "./guide-catalog.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const CHANGELOG = resolve(REPO, "CHANGELOG.md");

const CHECK = process.argv.includes("--check");
const outFlag = process.argv.indexOf("--out");
const OUT =
  outFlag !== -1
    ? resolve(process.cwd(), process.argv[outFlag + 1])
    : resolve(HERE, "../dist/guide");

// The Keep a Changelog change types, same as the release-notes build reads.
const SECTION_TYPES = ["Added", "Changed", "Fixed", "Removed", "Deprecated", "Security"];
// A bullet marked as developer housekeeping never reaches a reader.
const INTERNAL = /^\s*Internal:/;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
// The guide's own address, for the canonical links search engines read.
const SITE = `${APP}/guide/`;

function fail(msg) {
  console.error(`build-guide: ${msg}`);
  process.exit(1);
}

// ---------- read the changelog ----------
//
// Returns released versions newest-first, each with its bullets' raw markdown
// under the change type they sat in. Deliberately simpler than the
// release-notes parser: the guide wants the text and its links, not the
// thumbnails and picture reels.
function parseChangelog(text) {
  const releases = [];
  let release = null;
  let type = null;

  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");

    const h2 = line.match(/^## (.*)$/);
    if (h2) {
      type = null;
      if (h2[1] === "[Unreleased]") {
        release = null; // parsed by the release build; the guide skips it
        continue;
      }
      const m = h2[1].match(/^\[(\d+\.\d+(?:\.\d+)?)\] - (\d{4})-(\d{2})-(\d{2})$/);
      if (!m) fail(`unrecognized release heading: "${line}"`);
      const [, version, y, mo, d] = m;
      release = {
        version,
        date: `${MONTHS[Number(mo) - 1]} ${Number(d)}, ${y}`,
        name: null,
        expectName: true,
        items: [], // {type, md}
      };
      releases.push(release);
      continue;
    }

    const h3 = line.match(/^### (.*)$/);
    if (h3) {
      if (release) release.expectName = false;
      if (!SECTION_TYPES.includes(h3[1])) {
        fail(
          `unknown section "### ${h3[1]}" under ${release?.version ?? "Unreleased"} — ` +
            `expected one of: ${SECTION_TYPES.join(", ")}`,
        );
      }
      type = h3[1];
      continue;
    }

    if (!release) continue;

    if (release.expectName) {
      const name = line.match(/^\*\*(.+)\*\*$/);
      if (name) {
        release.name = name[1];
        release.expectName = false;
        continue;
      }
      if (line !== "") release.expectName = false;
    }

    if (type) {
      if (/^- /.test(line)) {
        release.items.push({ type, md: line.slice(2) });
      } else if (/^\s+\S/.test(line) && release.items.length > 0) {
        // continuation of a wrapped bullet
        release.items[release.items.length - 1].md += " " + line.trim();
      }
    }
  }

  if (releases.length === 0) fail("no released versions found in CHANGELOG.md");
  return releases;
}

// ---------- file each bullet under its sections ----------

const GUIDE_MARKER = /<!--\s*guide:\s*([^>]*?)\s*-->/gi;
// Any indigene.app or in-app link, reduced to its first path part. Matches
// both the shareable path form (indigene.app/wildlife) and the hash form
// (#/saved) the changelog uses for pages with no file of their own.
const APP_LINK = /\((?:https?:\/\/indigene\.app\/#?\/?|#\/)([a-z0-9-]+)/gi;

/** The set of section ids a bullet belongs to, and its display text. */
function classify(md, where) {
  const ids = new Set();

  // 1. Explicit markers — the deliberate, multi-section signal.
  for (const m of md.matchAll(GUIDE_MARKER)) {
    for (const id of m[1].split(/[,\s]+/).map((s) => s.trim()).filter(Boolean)) {
      if (!SECTION_BY_ID.has(id)) {
        fail(
          `${where}: guide marker names "${id}", which is not a section. ` +
            `Known sections: ${[...SECTION_BY_ID.keys()].join(", ")}.`,
        );
      }
      ids.add(id);
    }
  }

  // 2. The link the bullet already carries.
  for (const m of md.matchAll(APP_LINK)) {
    const id = SEGMENT_TO_ID.get(m[1].toLowerCase());
    if (id) ids.add(id);
  }

  // The markers are for the source; a reader never sees them.
  const text = md.replace(GUIDE_MARKER, "").replace(/\s{2,}/g, " ").trim();
  return { ids, text };
}

/**
 * Walk the changelog once and hand each published section its history,
 * newest-first, grouped by the release it landed in.
 */
function fileHistory(releases) {
  const byId = new Map(SECTIONS.map((s) => [s.id, []]));
  for (const r of releases) {
    for (const item of r.items) {
      if (INTERNAL.test(item.md)) continue;
      const { ids, text } = classify(item.md, `version ${r.version}`);
      for (const id of ids) {
        byId.get(id).push({ version: r.version, date: r.date, name: r.name, type: item.type, text });
      }
    }
  }
  return byId;
}

// ---------- render ----------

const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const resolveUrl = (url) => (url.startsWith("/") ? APP + url : url);

/** Minimal inline markdown: links, bold, italic, code. Applied post-escape. */
function inline(md) {
  return escapeHtml(md)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => `<a href="${resolveUrl(url)}">${text}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

// Month + year, from a section's newest history item — a quiet "still growing"
// signal on the card, in words a reader owns.
const monthYear = (date) => date.replace(/ \d+,/, "");

function shell({ title, description, canonical, body, root = "../" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
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

/* The discovery grid: one card per part of the app. */
.cards { display: grid; gap: 0.85rem; margin: 1.25rem 0; }
.card {
  display: flex; align-items: flex-start; gap: 0.85rem;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 1rem 1.1rem;
  color: inherit; text-decoration: none;
}
.card:hover { border-color: var(--brand); }
.card:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.card-emoji { font-size: 1.6rem; line-height: 1.4; flex: none; }
.card-body { min-width: 0; }
.card-body h2 { margin: 0; font-size: 1.15rem; color: var(--brand-ink); }
.card-body p { margin: 0.2rem 0 0; color: var(--ink-soft); font-size: 0.95rem; }
.card-updated { margin: 0.35rem 0 0; font-size: 0.8rem; color: var(--ink-soft); }
.card-arrow { margin-left: auto; align-self: center; color: var(--brand); flex: none; }

/* A single section's page. */
.doc {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 1.1rem 1.25rem; margin: 1.25rem 0;
}
.doc .lede { color: var(--ink); margin: 0 0 0.75rem; }
.doc h2 { margin: 1.1rem 0 0.4rem; font-size: 1.05rem; }
.doc ol { margin: 0.35rem 0 0.5rem; padding-left: 1.3rem; }
.doc ol li { margin: 0.4rem 0; color: var(--ink-soft); }
.doc .note {
  margin: 0.9rem 0 0; padding: 0.7rem 0.9rem; font-size: 0.95rem;
  background: var(--brand-bg); color: var(--brand-ink); border-radius: 10px;
}
.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.4rem 0 0; }
.chip {
  display: inline-block; padding: 0.4rem 0.85rem; border-radius: 999px;
  background: var(--brand); color: #fff; text-decoration: none;
  font-size: 0.9rem; font-weight: 600;
}
.chip.ghost { background: transparent; color: var(--focus); border: 1px solid var(--line); }
.chip:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.learn { margin: 0.35rem 0 0; padding-left: 1.2rem; }
.learn li { margin: 0.45rem 0; color: var(--ink-soft); }
.learn .src { color: var(--ink-soft); font-size: 0.85rem; }

/* "How this grew" — the changelog, filed. */
.history { margin: 1.5rem 0 0; }
.history > h2 { font-size: 1.15rem; margin: 0 0 0.25rem; }
.history > p { color: var(--ink-soft); margin: 0 0 0.75rem; font-size: 0.95rem; }
.rel { margin: 1rem 0 0; }
.rel h3 {
  display: inline-block; margin: 0 0 0.35rem; padding: 0.1rem 0.6rem;
  background: var(--brand-bg); color: var(--brand-ink);
  border-radius: 999px; font-size: 0.85rem; letter-spacing: 0.02em;
}
.rel .when { color: var(--ink-soft); font-size: 0.85rem; margin-left: 0.4rem; }
.rel ul { margin: 0.25rem 0 0.5rem; padding-left: 1.2rem; }
.rel li { margin: 0.45rem 0; color: var(--ink-soft); }
.rel li strong, .rel li em { color: var(--ink); }
.empty { color: var(--ink-soft); font-style: italic; }
code {
  background: var(--brand-bg); color: var(--brand-ink);
  padding: 0.05rem 0.3rem; border-radius: 6px; font-size: 0.9em;
}
footer { color: var(--ink-soft); margin-top: 2rem; font-size: 0.9rem; }
.privacy-line { margin-top: 0.6rem; }
</style>
</head>
<body>
<main>
${body}
<footer>
<p>Indigene is free, open source, and built on public data.
<a href="https://github.com/olivierlacan/indigene">See how it&rsquo;s made on GitHub</a>.</p>
<p class="privacy-line">Nothing on this page is watching you — no account, no
visit counter, nothing sent anywhere.
<a href="${root}#/privacy">How your privacy is handled, in full</a>.</p>
</footer>
</main>
</body>
</html>
`;
}

function renderHistory(items) {
  if (items.length === 0) {
    return `<div class="history">
<h2>How this grew</h2>
<p class="empty">Nothing filed here yet. As changes to this part of the app are
written up, they’ll appear here on their own.</p>
</div>`;
  }
  // Group the section's items by the release they landed in, keeping the
  // changelog's newest-first order.
  const groups = [];
  for (const it of items) {
    let g = groups[groups.length - 1];
    if (!g || g.version !== it.version) {
      g = { version: it.version, date: it.date, name: it.name, items: [] };
      groups.push(g);
    }
    g.items.push(it);
  }
  const rels = groups
    .map(
      (g) => `<div class="rel">
<h3>Version ${escapeHtml(g.version)}</h3><span class="when">${escapeHtml(g.date)}</span>
<ul>
${g.items.map((it) => `<li>${inline(it.text)}</li>`).join("\n")}
</ul>
</div>`,
    )
    .join("\n");
  return `<div class="history">
<h2>How this grew</h2>
<p>Every change to this part of the app, newest first — the same plain notes
that go out with each update.</p>
${rels}
</div>`;
}

function renderSectionPage(section, items) {
  const visit = (section.visit ?? [])
    .map((v) => `<a class="chip" href="${escapeHtml(v.href)}">${escapeHtml(v.label)}</a>`)
    .join("\n");
  const learn = (section.learn ?? [])
    .map(
      (l) =>
        `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a> ` +
        `<span class="src">— ${escapeHtml(l.source)}</span></li>`,
    )
    .join("\n");
  const steps = (section.steps ?? [])
    .map((s) => `<li>${inline(s)}</li>`)
    .join("\n");

  const doc = [`<div class="doc">`, `<p class="lede">${inline(section.lede)}</p>`];
  if (visit) doc.push(`<div class="chips">${visit}</div>`);
  if (steps) doc.push(`<h2>How you use it</h2>`, `<ol>${steps}</ol>`);
  if (section.note) doc.push(`<p class="note">${inline(section.note)}</p>`);
  if (learn) {
    doc.push(`<h2>Learn more</h2>`, `<ul class="learn">${learn}</ul>`);
  }
  doc.push(`</div>`);

  return shell({
    root: "../../",
    title: `${section.title} — Indigene guide`,
    description: section.tagline,
    canonical: `${SITE}${section.id}/`,
    body: `<a class="back" href="../">&larr; The guide</a>
<h1>${escapeHtml(section.title)}</h1>
<p class="lede">${escapeHtml(section.tagline)}</p>
${doc.join("\n")}
${renderHistory(items)}`,
  });
}

function renderIndex(published, historyById) {
  const cards = published
    .map((s) => {
      const items = historyById.get(s.id);
      const updated = items.length
        ? `<p class="card-updated">Last updated ${escapeHtml(monthYear(items[0].date))}</p>`
        : "";
      return `<a class="card" href="${s.id}/">
<span class="card-emoji" aria-hidden="true">${s.emoji}</span>
<span class="card-body">
<h2>${escapeHtml(s.title)}</h2>
<p>${escapeHtml(s.tagline)}</p>
${updated}
</span>
<span class="card-arrow" aria-hidden="true">&rarr;</span>
</a>`;
    })
    .join("\n");

  return shell({
    title: "Guide — Indigene",
    description:
      "A plain-words guide to Indigene, the free native-plant finder: what each " +
      "part is for and how to use it.",
    canonical: SITE,
    body: `<h1>How Indigene works</h1>
<p class="lede">Indigene finds the plants that naturally belong where you live.
This guide walks through each part of the app in plain words — what it’s for,
how to use it, and where to learn more. Start anywhere.</p>
<a class="back" href="../">&larr; Open Indigene</a>
<div class="cards">
${cards}
</div>
<p class="lede">Want the very latest? <a href="../release-notes/">See what’s
new</a>.</p>`,
  });
}

// ---------- run ----------

const releases = parseChangelog(readFileSync(CHANGELOG, "utf8"));
const historyById = fileHistory(releases);
const published = SECTIONS.filter((s) => s.published);

if (published.length === 0) fail("no published sections in the guide catalog");
for (const s of published) {
  if (!s.lede || !s.lede.trim()) {
    fail(`section "${s.id}" is published but has no lede — write it or set published:false`);
  }
}

if (CHECK) {
  const filed = [...historyById.values()].reduce((n, arr) => n + arr.length, 0);
  console.log(
    `guide check: ${published.length} published section(s), ${filed} changelog ` +
      `bullet(s) filed across ${SECTIONS.length} declared section(s). OK.`,
  );
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(resolve(OUT, "index.html"), renderIndex(published, historyById));
for (const s of published) {
  const dir = resolve(OUT, s.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, "index.html"), renderSectionPage(s, historyById.get(s.id)));
}

console.log(
  `guide: ${published.length} section(s) → ${OUT}` +
    `\nsections: ${published.map((s) => `${s.id}/ (${historyById.get(s.id).length})`).join("  ")}`,
);
