// Build the page you pick photographs on — stage three of docs/hero-photos.md.
//
//   npm run hero:review           # writes app/dist/hero-review/index.html
//   npm run hero:review -- --open # …and prints the file:// URL to open
//
// Reads the shortlists `harvest-hero-photos.mjs` produced and emits **one
// self-contained HTML file**: no server, no build step, no dependency. Open it
// from disk, choose a photograph for each slot, and press *Download picks*; drop
// the resulting files into `src/data/` and commit them.
//
// ## What a "slot" is
//
// A plant has five: the **hero** that its profile and every list show, and four
// angles — the whole plant, the leaves, the flowers, the fruit — that fill its
// photo page (`#/plants/<slug>/photos`). An animal has one, the hero. Pick the
// slot you're filling, then click photographs; the page moves on to the next
// empty slot by itself, so filling all five is five clicks, not five clicks and
// five menu choices.
//
// The strip re-sorts itself to the slot you're on, putting the candidates the
// machine thinks belong there first (see `_photo-angle.mjs` for how weak that
// guess is, and why it only ever re-orders rather than filters). *Only likely
// ones* hides the rest when a pool is mostly leaves and you're after a berry.
//
// ## Three deliberate properties
//
//   - **It opens knowing what has already been chosen.** The committed picks are
//     baked into the page, so a re-review starts from today's answers rather
//     than a blank grid — and downloading after changing one plant gives back a
//     complete file, not a file with one plant in it.
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

/** The committed picks, baked into the page as its starting state. Each is
 *  `subjectId → regionId → pick` (or `→ { angle: pick }` for the plant angles);
 *  a file that doesn't exist yet simply seeds nothing. */
const SEED_FILES = {
  hero: resolve(HERE, "../src/data/hero-photos.json"),
  angles: resolve(HERE, "../src/data/plant-photos.json"),
  wildlife: resolve(HERE, "../src/data/wildlife-photos.json"),
};

/** The slots, in the order they're offered. `hero` is every subject's; the four
 *  angles are a plant's, and match `PHOTO_ANGLES` in src/lib/plant-photos.ts. */
const SLOTS = [
  { key: "hero", label: "Hero", icon: "🖼️", plantsOnly: false },
  { key: "habit", label: "Whole plant", icon: "🌳", plantsOnly: true },
  { key: "leaf", label: "Leaves", icon: "🍃", plantsOnly: true },
  { key: "flower", label: "Flowers", icon: "🌸", plantsOnly: true },
  { key: "fruit", label: "Fruit", icon: "🫐", plantsOnly: true },
];

let data;
try {
  data = JSON.parse(readFileSync(IN, "utf8"));
} catch {
  console.error(`No candidates at ${IN}.\nRun \`npm run hero:harvest\` first (it needs network).`);
  process.exit(1);
}

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
};
const seedHero = readJson(SEED_FILES.hero);
const seedAngles = readJson(SEED_FILES.angles);
const seedWildlife = readJson(SEED_FILES.wildlife);

// `id`/`subject` arrived with the wildlife harvest; a candidates file written
// before that only has `plantId`, and is still perfectly reviewable.
const shortlists = (data.shortlists ?? [])
  .map((s) => ({ ...s, id: s.id ?? s.plantId, subject: s.subject ?? "plant" }))
  .filter((s) => s.candidates?.length);
if (!shortlists.length) {
  console.error("The candidates file has no shortlists with photos in it.");
  process.exit(1);
}

/** The page's starting picks, flattened to the same `subject|id|region|slot`
 *  keys the page itself uses. Only for subjects the shortlists cover — a pick
 *  for a plant this harvest didn't touch stays in the file untouched, because
 *  the download merges over the seed rather than replacing it. */
const seed = {};
for (const [plantId, byRegion] of Object.entries(seedHero)) {
  for (const [regionId, pick] of Object.entries(byRegion)) {
    seed[`plant|${plantId}|${regionId}|hero`] = pick;
  }
}
for (const [plantId, byRegion] of Object.entries(seedAngles)) {
  for (const [regionId, set] of Object.entries(byRegion)) {
    for (const [angle, pick] of Object.entries(set ?? {})) {
      seed[`plant|${plantId}|${regionId}|${angle}`] = pick;
    }
  }
}
for (const [wildlifeId, byRegion] of Object.entries(seedWildlife)) {
  for (const [regionId, pick] of Object.entries(byRegion)) {
    seed[`wildlife|${wildlifeId}|${regionId}|hero`] = pick;
  }
}

/** Escape for HTML text and attribute values alike. */
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** The order a tile takes under each slot: best first. Rendered into the tile as
 *  data attributes so switching slots is a style change, not a re-layout of the
 *  DOM — a strip of forty photographs shouldn't reload because you clicked a
 *  chip. Quality decides the hero slot; the angle fit decides the other four,
 *  with quality breaking ties. */
function tileOrders(c, rank) {
  const orders = { hero: rank };
  for (const { key } of SLOTS.slice(1)) {
    const fit = c.angleFit?.[key] ?? 0;
    orders[key] = Math.round((1 - fit) * 1000) + rank;
  }
  return orders;
}

const rows = shortlists
  .map((s) => {
    const base = `${s.subject}|${s.id}|${s.regionId}`;
    const tiles = s.candidates
      .map((c, i) => {
        const orders = tileOrders(c, i);
        const iso = c.quality ? (c.quality.centreDetail / Math.max(c.quality.edgeDetail, 1)).toFixed(1) : "—";
        // What the machine thinks it's a picture of, and — far more usefully —
        // what the community annotated the observation as.
        const tag = c.phenology
          ? `<span class="tag tag-said">${esc(c.phenology)}</span>`
          : c.angle
            ? `<span class="tag">${esc(c.angle)}?</span>`
            : "";
        return `
        <button class="cand" data-base="${esc(base)}"
                data-angle="${esc(c.angle ?? "")}"
                ${Object.entries(orders).map(([k, v]) => `data-order-${k}="${v}"`).join(" ")}
                data-pick='${esc(JSON.stringify({
                  photoId: c.photoId, observationId: c.observationId, observer: c.observer,
                  license: c.license, attribution: c.attribution, observedOn: c.observedOn,
                  place: c.place, taxonName: c.taxonName,
                  thumbUrl: c.thumbUrl, mediumUrl: c.mediumUrl, largeUrl: c.largeUrl,
                }))}'>
          <img src="${esc(c.mediumUrl)}" loading="lazy" alt="Candidate ${i + 1} for ${esc(s.name)}">
          <span class="meta">
            <b>${c.quality?.score ?? "—"}</b>
            <span>iso ${iso}×</span>
            <span>♥ ${c.faves ?? 0}</span>
          </span>
          <span class="who">© ${esc(c.observer ?? "unknown")} · ${esc(String(c.license).toUpperCase())}</span>
          <span class="tags">${tag}</span>
          <span class="chosen"></span>
        </button>`;
      })
      .join("");
    const slots = SLOTS.filter((slot) => !slot.plantsOnly || s.subject === "plant")
      .map((slot) => `
        <button class="slot" data-base="${esc(base)}" data-slot="${esc(slot.key)}">
          <span aria-hidden="true">${slot.icon}</span> ${esc(slot.label)}
          <span class="slot-state">·</span>
        </button>`)
      .join("");
    return `
      <section class="subject ${esc(s.subject)}" id="${esc(`${s.id}--${s.regionId}`)}"
               data-base="${esc(base)}" data-active="hero">
        <h2>
          <span class="kind" aria-hidden="true">${s.subject === "wildlife" ? "🦋" : "🌿"}</span>
          ${esc(s.name)}
          <small>${esc(s.id)} · ${esc(s.regionName)}</small>
        </h2>
        <div class="slots">${slots}</div>
        <div class="strip">${tiles}</div>
      </section>`;
  })
  .join("");

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Photo review — Indigene</title>
<style>
  :root { color-scheme: light dark; --line: color-mix(in srgb, currentColor 18%, transparent);
          --picked: #12805c; }
  body { font: 16px/1.5 system-ui, sans-serif; margin: 0; padding: 1rem 1rem 6rem; }
  header { position: sticky; top: 0; z-index: 2; padding: .75rem 0; margin-bottom: .5rem;
           background: Canvas; border-bottom: 1px solid var(--line); }
  h1 { font-size: 1.15rem; margin: 0 0 .35rem; }
  .bar { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; font-size: .9rem; }
  button.act { font: inherit; padding: .4rem .8rem; border-radius: .5rem;
               border: 1px solid var(--line); background: Canvas; color: inherit; cursor: pointer; }
  button.act:hover { background: color-mix(in srgb, currentColor 8%, transparent); }
  label.opt { display: inline-flex; gap: .3rem; align-items: center; }
  .subject { margin: 1.75rem 0; }
  .subject h2 { font-size: 1rem; margin: 0 0 .4rem; display: flex; gap: .4rem; align-items: baseline;
                flex-wrap: wrap; }
  .subject h2 small { font-weight: 400; opacity: .6; }
  /* The slots, and which one you're filling. The state dot after each label is
     the whole progress display: a section with five filled dots is done. */
  .slots { display: flex; gap: .35rem; flex-wrap: wrap; margin-bottom: .5rem; }
  .slot { font: inherit; font-size: .85rem; padding: .25rem .6rem; border-radius: 99px;
          border: 1px solid var(--line); background: Canvas; color: inherit; cursor: pointer; }
  .slot[aria-current="true"] { border-color: var(--picked); box-shadow: inset 0 0 0 1px var(--picked); }
  .slot-state { opacity: .45; }
  .slot.filled .slot-state { opacity: 1; color: var(--picked); font-weight: 700; }
  .strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: .6rem; }
  .cand { position: relative; padding: 0; border: 3px solid transparent; border-radius: .6rem;
          overflow: hidden; background: none; cursor: pointer; text-align: left; color: inherit; }
  .cand img { display: block; width: 100%; aspect-ratio: 4/3; object-fit: cover;
              background: var(--line); }
  .cand[aria-pressed="true"] { border-color: var(--picked); }
  /* Chosen for a *different* slot: still visible, so you can see the set you're
     building without leaving the strip you're working in. */
  .cand.elsewhere { border-color: color-mix(in srgb, var(--picked) 45%, transparent); }
  .cand .meta { position: absolute; top: .3rem; left: .3rem; display: flex; gap: .4rem;
                padding: .1rem .4rem; border-radius: 99px; background: rgb(0 0 0 / .68);
                color: #fff; font-size: .72rem; }
  .cand .tags { position: absolute; top: .3rem; right: .3rem; display: flex; gap: .25rem; }
  .tag { padding: .1rem .4rem; border-radius: 99px; font-size: .68rem;
         background: rgb(0 0 0 / .68); color: #fff; }
  /* An annotation is somebody's word for what the observation shows; a bare
     guess is ours. They don't get to look the same. */
  .tag-said { background: var(--picked); }
  .cand .chosen { position: absolute; bottom: 1.6rem; left: .3rem; font-size: .7rem;
                  padding: .1rem .4rem; border-radius: 99px; background: var(--picked);
                  color: #fff; display: none; }
  .cand.elsewhere .chosen, .cand[aria-pressed="true"] .chosen { display: block; }
  .cand .who { display: block; padding: .3rem .4rem; font-size: .72rem; opacity: .7; }
  body.only-likely .cand.unlikely { display: none; }
  footer { position: fixed; inset: auto 0 0 0; padding: .6rem 1rem; background: Canvas;
           border-top: 1px solid var(--line); display: flex; gap: .6rem; align-items: center;
           flex-wrap: wrap; font-size: .9rem; }
</style>

<header>
  <h1>Photo review</h1>
  <div class="bar">
    <button class="act" id="jump">Next unfilled</button>
    <label class="opt"><input type="checkbox" id="likely"> Only likely ones</label>
    <button class="act" id="clear">Clear all picks</button>
    <span id="count"></span>
  </div>
</header>

${rows}

<footer>
  <button class="act" id="dl-hero"><b>Download hero picks</b></button>
  <button class="act" id="dl-angles"><b>Download plant angles</b></button>
  <button class="act" id="dl-wildlife"><b>Download wildlife picks</b></button>
  <span>→ <code>app/src/data/</code>, then commit</span>
  <span id="count2" style="margin-left:auto"></span>
</footer>

<script>
const SLOTS = ${JSON.stringify(SLOTS.map((s) => s.key))};
const SEED = ${JSON.stringify(seed)};
const STORE = "indigene-hero-picks";

// The committed picks first, then whatever this browser has been doing since —
// so a fresh tab opens on today's answers and a half-finished sitting still wins
// where it disagrees.
const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
const picks = Object.assign({}, SEED, saved);

// Every colour we already know, by photo id. Re-picking a photograph that has
// been through \`npm run hero:colors\` keeps its colour instead of sending the
// script back to iNaturalist for a value it already has.
const colours = {};
for (const pick of Object.values(SEED)) if (pick && pick.color) colours[pick.photoId] = pick.color;

const slotsInSection = (section) =>
  [...section.querySelectorAll(".slot")].map((b) => b.dataset.slot);

function save() {
  // Only what differs from the committed state, so localStorage doesn't grow a
  // copy of the whole repo — and so clearing it really does mean "back to what
  // is committed".
  const diff = {};
  for (const [key, pick] of Object.entries(picks)) {
    if (JSON.stringify(SEED[key]) !== JSON.stringify(pick)) diff[key] = pick;
  }
  localStorage.setItem(STORE, JSON.stringify(diff));
}

function refresh() {
  let filled = 0;
  let total = 0;
  for (const section of document.querySelectorAll(".subject")) {
    const base = section.dataset.base;
    const active = section.dataset.active;
    for (const slot of section.querySelectorAll(".slot")) {
      const has = !!picks[base + "|" + slot.dataset.slot];
      total++;
      if (has) filled++;
      slot.classList.toggle("filled", has);
      slot.querySelector(".slot-state").textContent = has ? "●" : "·";
      slot.setAttribute("aria-current", String(slot.dataset.slot === active));
    }
    const chosenHere = picks[base + "|" + active];
    for (const btn of section.querySelectorAll(".cand")) {
      const pick = JSON.parse(btn.dataset.pick);
      const isHere = !!chosenHere && chosenHere.photoId === pick.photoId;
      btn.setAttribute("aria-pressed", String(isHere));
      // Where else this photograph is being used, if anywhere.
      const others = slotsInSection(section)
        .filter((s) => s !== active && picks[base + "|" + s] && picks[base + "|" + s].photoId === pick.photoId);
      btn.classList.toggle("elsewhere", !isHere && others.length > 0);
      btn.querySelector(".chosen").textContent = isHere ? active : others.join(" · ");
      btn.style.order = btn.dataset["order" + active[0].toUpperCase() + active.slice(1)] || 0;
      // "Likely" means the machine put it in this bucket — or, on the hero slot,
      // that it isn't hiding anything, because every candidate is a candidate
      // for the hero.
      btn.classList.toggle("unlikely", active !== "hero" && btn.dataset.angle !== active);
    }
  }
  const msg = filled + " of " + total + " slots filled";
  count.textContent = msg;
  count2.textContent = msg;
}

document.addEventListener("click", (e) => {
  const slot = e.target.closest(".slot");
  if (slot) {
    slot.closest(".subject").dataset.active = slot.dataset.slot;
    refresh();
    return;
  }
  const btn = e.target.closest(".cand");
  if (!btn) return;
  const section = btn.closest(".subject");
  const base = section.dataset.base;
  const active = section.dataset.active;
  const key = base + "|" + active;
  const pick = JSON.parse(btn.dataset.pick);
  // Clicking the current pick again clears it — undo without a second control.
  if (picks[key] && picks[key].photoId === pick.photoId) {
    delete picks[key];
  } else {
    if (colours[pick.photoId]) pick.color = colours[pick.photoId];
    picks[key] = pick;
    // On to the next empty slot in this section, so filling a plant's five is
    // five clicks. Staying put when they're all full is right: the last thing
    // you did was probably a correction.
    const next = slotsInSection(section).find((s) => !picks[base + "|" + s]);
    if (next) section.dataset.active = next;
  }
  save();
  refresh();
});

likely.addEventListener("change", () => {
  document.body.classList.toggle("only-likely", likely.checked);
});

jump.addEventListener("click", () => {
  const next = [...document.querySelectorAll(".subject")].find((section) =>
    slotsInSection(section).some((s) => !picks[section.dataset.base + "|" + s]));
  if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
});

clear.addEventListener("click", () => {
  if (!confirm("Clear every pick made in this browser? Committed picks stay.")) return;
  for (const key of Object.keys(picks)) delete picks[key];
  Object.assign(picks, SEED);
  localStorage.removeItem(STORE);
  refresh();
});

/** Gather one file's worth of picks and hand it to the browser as a download. */
function download(name, build) {
  const out = build();
  const blob = new Blob([JSON.stringify(out, null, 2) + "\\n"], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Every pick, split back out of the flat keys: subject, id, region, slot. */
function* entries() {
  for (const [key, pick] of Object.entries(picks)) {
    const [subject, id, regionId, slot] = key.split("|");
    if (pick) yield { subject, id, regionId, slot, pick };
  }
}

// Keyed "<subject>|<id>|<region>|<slot>" in the page; written out nested, which
// is the shape the app reads. Three files because they have three lifetimes: the
// heroes are in every list, the angles are fetched only by a photo page, and the
// animals are their own catalog.
document.getElementById("dl-hero").addEventListener("click", () =>
  download("hero-photos.json", () => {
    const out = {};
    for (const { subject, id, regionId, slot, pick } of entries()) {
      if (subject !== "plant" || slot !== "hero") continue;
      (out[id] ||= {})[regionId] = pick;
    }
    return sortKeys(out);
  }));

document.getElementById("dl-angles").addEventListener("click", () =>
  download("plant-photos.json", () => {
    const out = {};
    for (const { subject, id, regionId, slot, pick } of entries()) {
      if (subject !== "plant" || slot === "hero") continue;
      ((out[id] ||= {})[regionId] ||= {})[slot] = pick;
    }
    return sortKeys(out);
  }));

document.getElementById("dl-wildlife").addEventListener("click", () =>
  download("wildlife-photos.json", () => {
    const out = {};
    for (const { subject, id, regionId, slot, pick } of entries()) {
      if (subject !== "wildlife" || slot !== "hero") continue;
      (out[id] ||= {})[regionId] = pick;
    }
    return sortKeys(out);
  }));

/** Sorted by id, so the committed file's diff shows what changed rather than
 *  the order two review sittings happened to happen in. */
function sortKeys(obj) {
  const out = {};
  for (const key of Object.keys(obj).sort()) out[key] = obj[key];
  return out;
}

refresh();
</script>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);
const photos = shortlists.reduce((n, s) => n + s.candidates.length, 0);
const animals = shortlists.filter((s) => s.subject === "wildlife").length;
console.log(
  `photo review: ${shortlists.length} shortlists (${animals} of them animals) · ` +
    `${photos} candidates · ${Object.keys(seed).length} picks already made → ${OUT}`,
);
if (process.argv.includes("--open")) console.log(`\nOpen: file://${OUT}`);
