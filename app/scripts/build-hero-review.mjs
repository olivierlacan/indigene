// Build the page you pick hero photos on — stage three of docs/hero-photos.md.
//
//   npm run hero:review           # writes app/dist/hero-review/index.html
//   npm run hero:review -- --open # …and prints the file:// URL to open
//
// Reads the shortlists `harvest-hero-photos.mjs` produced and emits **one
// self-contained HTML file**: no server, no build step, no dependency. Open it
// from disk, click the photo you want for each plant, and press *Download
// picks*; drop the resulting `hero-photos.json` into `src/data/` and commit it.
//
// Two deliberate properties:
//
//   - **Your picks survive.** They're written to `localStorage` as you go, so
//     reviewing two hundred plants can happen over several sittings, or in
//     several tabs, without losing anything to a closed window.
//   - **It never writes to the repo itself.** A page opened from `file://`
//     can't, and shouldn't — the download-and-commit step is what puts a human
//     signature on the data. That's the whole point of the review.
//
// The photos load from iNaturalist's CDN, so reviewing needs a connection; the
// page itself doesn't.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const IN = resolve(HERE, "../../docs/hero-photos/candidates.json");
const OUT = resolve(HERE, "../dist/hero-review/index.html");

let data;
try {
  data = JSON.parse(readFileSync(IN, "utf8"));
} catch {
  console.error(`No candidates at ${IN}.\nRun \`npm run hero:harvest\` first (it needs network).`);
  process.exit(1);
}

const shortlists = (data.shortlists ?? []).filter((s) => s.candidates?.length);
if (!shortlists.length) {
  console.error("The candidates file has no shortlists with photos in it.");
  process.exit(1);
}

/** Escape for HTML text and attribute values alike. */
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const rows = shortlists
  .map((s) => {
    const tiles = s.candidates
      .map((c, i) => `
        <button class="cand" data-key="${esc(s.plantId + "|" + s.regionId)}"
                data-pick='${esc(JSON.stringify({
                  photoId: c.photoId, observationId: c.observationId, observer: c.observer,
                  license: c.license, attribution: c.attribution, observedOn: c.observedOn,
                  thumbUrl: c.thumbUrl, mediumUrl: c.mediumUrl, largeUrl: c.largeUrl,
                }))}'>
          <img src="${esc(c.mediumUrl)}" loading="lazy" alt="Candidate ${i + 1} for ${esc(s.name)}">
          <span class="meta">
            <b>${c.quality.score}</b>
            <span>iso ${(c.quality.centreDetail / Math.max(c.quality.edgeDetail, 1)).toFixed(1)}×</span>
            <span>♥ ${c.faves}</span>
          </span>
          <span class="who">© ${esc(c.observer ?? "unknown")} · ${esc(c.license.toUpperCase())}</span>
        </button>`)
      .join("");
    return `
      <section class="plant" id="${esc(s.plantId + "--" + s.regionId)}">
        <h2>${esc(s.name)} <small>${esc(s.plantId)} · ${esc(s.regionName)}</small>
          <span class="state" data-for="${esc(s.plantId + "|" + s.regionId)}">unpicked</span>
        </h2>
        <div class="strip">${tiles}</div>
      </section>`;
  })
  .join("");

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hero photo review — Indigene</title>
<style>
  :root { color-scheme: light dark; --line: color-mix(in srgb, currentColor 18%, transparent); }
  body { font: 16px/1.5 system-ui, sans-serif; margin: 0; padding: 1rem 1rem 6rem; }
  header { position: sticky; top: 0; z-index: 2; padding: .75rem 0; margin-bottom: .5rem;
           background: Canvas; border-bottom: 1px solid var(--line); }
  h1 { font-size: 1.15rem; margin: 0 0 .35rem; }
  .bar { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; font-size: .9rem; }
  button.act { font: inherit; padding: .4rem .8rem; border-radius: .5rem;
               border: 1px solid var(--line); background: Canvas; color: inherit; cursor: pointer; }
  button.act:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
  .plant { margin: 1.5rem 0; }
  .plant h2 { font-size: 1rem; margin: 0 0 .5rem; display: flex; gap: .5rem; align-items: baseline;
              flex-wrap: wrap; }
  .plant h2 small { font-weight: 400; opacity: .6; }
  .state { margin-left: auto; font-size: .8rem; opacity: .65; }
  .state.picked { opacity: 1; color: #12805c; font-weight: 650; }
  .strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: .6rem; }
  .cand { position: relative; padding: 0; border: 3px solid transparent; border-radius: .6rem;
          overflow: hidden; background: none; cursor: pointer; text-align: left; color: inherit; }
  .cand img { display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover;
              background: var(--line); }
  .cand[aria-pressed="true"] { border-color: #12805c; }
  .cand .meta { position: absolute; top: .3rem; left: .3rem; display: flex; gap: .4rem;
                padding: .1rem .4rem; border-radius: 99px; background: rgb(0 0 0 / .68);
                color: #fff; font-size: .72rem; }
  .cand .who { display: block; padding: .3rem .4rem; font-size: .72rem; opacity: .7; }
  footer { position: fixed; inset: auto 0 0 0; padding: .6rem 1rem; background: Canvas;
           border-top: 1px solid var(--line); display: flex; gap: .6rem; align-items: center;
           font-size: .9rem; }
</style>

<header>
  <h1>Hero photo review</h1>
  <div class="bar">
    <button class="act" id="jump">Next unpicked</button>
    <button class="act" id="clear">Clear all picks</button>
    <span id="count"></span>
  </div>
</header>

${rows}

<footer>
  <button class="act" id="download"><b>Download picks</b></button>
  <span>→ save as <code>app/src/data/hero-photos.json</code> and commit</span>
  <span id="count2" style="margin-left:auto"></span>
</footer>

<script>
const TOTAL = ${shortlists.length};
const STORE = "indigene-hero-picks";
const picks = JSON.parse(localStorage.getItem(STORE) || "{}");

function refresh() {
  for (const btn of document.querySelectorAll(".cand")) {
    const chosen = picks[btn.dataset.key];
    btn.setAttribute("aria-pressed",
      String(!!chosen && chosen.photoId === JSON.parse(btn.dataset.pick).photoId));
  }
  for (const s of document.querySelectorAll(".state")) {
    const done = !!picks[s.dataset.for];
    s.textContent = done ? "picked" : "unpicked";
    s.classList.toggle("picked", done);
  }
  const n = Object.keys(picks).length;
  const msg = n + " of " + TOTAL + " picked";
  count.textContent = msg;
  count2.textContent = msg;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".cand");
  if (!btn) return;
  const key = btn.dataset.key;
  const pick = JSON.parse(btn.dataset.pick);
  // Clicking the current pick again clears it — undo without a second control.
  if (picks[key] && picks[key].photoId === pick.photoId) delete picks[key];
  else picks[key] = pick;
  localStorage.setItem(STORE, JSON.stringify(picks));
  refresh();
});

jump.addEventListener("click", () => {
  const next = [...document.querySelectorAll(".state")].find((s) => !picks[s.dataset.for]);
  if (next) next.closest(".plant").scrollIntoView({ behavior: "smooth", block: "start" });
});

clear.addEventListener("click", () => {
  if (!confirm("Clear every pick?")) return;
  for (const k of Object.keys(picks)) delete picks[k];
  localStorage.setItem(STORE, JSON.stringify(picks));
  refresh();
});

download.addEventListener("click", () => {
  // Keyed "<plantId>|<regionId>" in the page (one pick per plant per region);
  // written out nested, which is the shape the app will read.
  const out = {};
  for (const [key, pick] of Object.entries(picks)) {
    const [plantId, regionId] = key.split("|");
    (out[plantId] ||= {})[regionId] = pick;
  }
  const blob = new Blob([JSON.stringify(out, null, 2) + "\\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hero-photos.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

refresh();
</script>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
const photos = shortlists.reduce((n, s) => n + s.candidates.length, 0);
console.log(`hero review: ${shortlists.length} shortlists · ${photos} candidates → ${OUT}`);
if (process.argv.includes("--open")) console.log(`\nOpen: file://${OUT}`);
