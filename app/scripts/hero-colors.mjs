// Give every chosen hero photograph a colour to arrive from.
//
//   npm run hero:colors            # fill in the picks that don't have one
//   npm run hero:colors -- --force # recompute all of them
//
// ## Why
//
// The plant page's hero is the one photograph in the app with nothing behind
// it. In a list row the form drawing is already there and the photo fades in
// over it, so the slot is never empty. The hero has no drawing — it *replaces*
// the drawing — so until the JPEG lands the reader gets a pale green rectangle
// that has nothing to do with the plant, and then a picture appears in it.
//
// A single colour fixes that for about eight bytes per pick: the slot paints the
// photograph's own average colour immediately, and the photograph fades up out
// of it. Mossy greens for the ferns, grey-browns for winter bark, a wash of
// yellow under a goldenrod. It reads as the picture warming up rather than a
// hole waiting to be filled.
//
// ## How
//
// The same arrangement `_photo-quality.mjs` uses, and for the same reason: the
// repo has no runtime dependencies and Playwright is already a dev one, so
// Chromium does the decoding (JPEG, PNG, WebP, EXIF orientation and all) and
// Node does the fetching. The browser never needs network access of its own.
//
// Only the `square` rendition is downloaded — 7 or 8 KB per pick, ~1.5 MB for
// the whole file. An average is an average; it does not get more accurate from
// a 500 px source.
//
// Needs open internet (iNaturalist), like `hero:harvest` and `reconcile`. The
// `color` field is optional everywhere it's read, so a picks file that has never
// been through this script works exactly as it did — the slot just falls back to
// the app's own placeholder green.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { requireProxyAwareFetch } from "./_net.mjs";

requireProxyAwareFetch("hero:colors");

/** Claude Code web sessions pre-install Chromium outside Playwright's registry. */
const PREBUILT = "/opt/pw-browsers/chromium";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Every file of picks, and how deep the photograph sits in it.
 *
 *   flat    `id → region → pick`         — the plant heroes, the animal heroes
 *   angled  `id → region → angle → pick` — a plant's whole-plant/leaf/flower/
 *                                          fruit close-ups
 *
 * All three want the same treatment for the same reason, so they are walked by
 * one loop rather than by three scripts that would drift.
 */
const FILES = [
  { path: resolve(HERE, "../src/data/hero-photos.json"), shape: "flat" },
  { path: resolve(HERE, "../src/data/wildlife-photos.json"), shape: "flat" },
  { path: resolve(HERE, "../src/data/plant-photos.json"), shape: "angled" },
];

/** Analysis raster. Averaging 16×16 downscaled pixels rather than asking the
 *  browser for a single one: a one-pixel `drawImage` is not specified to be a
 *  box filter, and 256 samples costs nothing. */
const N = 16;

/** Keep the placeholder out of the two ranges where it stops reading as a
 *  colour and starts reading as a bug: a near-white flash before the photo
 *  lands, or a black hole the photo climbs out of. Averages this extreme are
 *  rare (a blown-out sky, a night shot) and always mean the average is a poor
 *  description of the picture anyway. */
const MIN_L = 0.18;
const MAX_L = 0.78;

/** iNaturalist asks API users to identify themselves; the photo bucket doesn't
 *  require it, but there's no reason to be anonymous about it. */
const UA =
  "IndigeneHeroPhotos/0.1 (https://github.com/olivierlacan/indigene; hi@olivierlacan.com)";

/** How many photos to hold in memory (and hand to the page) at a time. */
const BATCH = 40;

const force = process.argv.includes("--force");

const files = FILES.map((f) => {
  let picks = {};
  try {
    picks = JSON.parse(readFileSync(f.path, "utf8"));
  } catch {
    /* a picks file nobody has written yet simply has nothing to colour */
  }
  return { ...f, picks, dirty: false };
});

// One job per pick that still needs a colour. Each carries the pick object
// itself, so applying the answer is an assignment rather than a second walk
// down four levels of keys with the same chance of getting them wrong.
const jobs = [];
for (const file of files) {
  for (const [id, byRegion] of Object.entries(file.picks)) {
    for (const [regionId, value] of Object.entries(byRegion ?? {})) {
      const found = file.shape === "angled"
        ? Object.entries(value ?? {}).map(([angle, pick]) => ({ label: `${id}/${regionId}/${angle}`, pick }))
        : [{ label: `${id}/${regionId}`, pick: value }];
      for (const { label, pick } of found) {
        if (!pick?.thumbUrl) continue;
        if (pick.color && !force) continue;
        jobs.push({ file, label, pick, url: pick.thumbUrl });
      }
    }
  }
}

if (!jobs.length) {
  console.log("Every pick already has a colour. Nothing to do (--force to redo them).");
  process.exit(0);
}

console.log(`Averaging ${jobs.length} photo${jobs.length === 1 ? "" : "s"}…`);

const browser = await chromium.launch(existsSync(PREBUILT) ? { executablePath: PREBUILT } : {});
let done = 0;
let failed = 0;
try {
  const page = await browser.newPage();
  for (let at = 0; at < jobs.length; at += BATCH) {
    const batch = jobs.slice(at, at + BATCH);
    const payload = [];
    for (const [i, job] of batch.entries()) {
      try {
        const res = await fetch(job.url, { headers: { "User-Agent": UA } });
        if (!res.ok) throw new Error(String(res.status));
        const bytes = Buffer.from(await res.arrayBuffer());
        // The key is the position in this batch, not a path: a composite string
        // would have to be parsed back apart, and one id containing the
        // separator would put a colour on the wrong photograph.
        payload.push({ key: String(i), b64: bytes.toString("base64") });
      } catch (err) {
        failed++;
        console.warn(`  ${job.label}: ${err.message}`);
      }
    }
    if (!payload.length) continue;
    const results = await page.evaluate(averageAll, { items: payload, N, MIN_L, MAX_L });
    for (const { key, color, error } of results) {
      const job = batch[Number(key)];
      if (error) {
        failed++;
        console.warn(`  ${job.label}: ${error}`);
        continue;
      }
      job.pick.color = color;
      job.file.dirty = true;
      done++;
    }
    console.log(`  ${Math.min(at + BATCH, jobs.length)}/${jobs.length}`);
  }
} finally {
  await browser.close();
}

// Only the files that gained something are rewritten — an untouched picks file
// shouldn't show up in the diff with a changed trailing newline.
const written = files.filter((f) => f.dirty);
for (const file of written) writeFileSync(file.path, `${JSON.stringify(file.picks, null, 2)}\n`);
console.log(
  `Wrote ${done} colour${done === 1 ? "" : "s"}${failed ? `, ${failed} failed` : ""} → ` +
    (written.map((f) => f.path.split("/").pop()).join(", ") || "nothing"),
);

/**
 * Everything that touches pixels, in one function because it is serialised into
 * the page. Returns `#rrggbb` per item, or an `error` — one undecodable file
 * must not sink a run over hundreds.
 */
function averageAll({ items, N, MIN_L, MAX_L }) {
  const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const canvas = new OffscreenCanvas(N, N);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  return (async () => {
    const out = [];
    for (const { key, b64 } of items) {
      try {
        const bmp = await createImageBitmap(new Blob([bytes(b64)]));
        ctx.clearRect(0, 0, N, N);
        ctx.drawImage(bmp, 0, 0, N, N);
        const d = ctx.getImageData(0, 0, N, N).data;
        let r = 0;
        let g = 0;
        let b = 0;
        for (let i = 0; i < d.length; i += 4) {
          r += d[i];
          g += d[i + 1];
          b += d[i + 2];
        }
        const n = d.length / 4;
        out.push({ key, color: clampLightness(r / n / 255, g / n / 255, b / n / 255) });
      } catch (err) {
        out.push({ key, error: String(err && err.message ? err.message : err) });
      }
    }
    return out;
  })();

  /** Nudge a too-pale or too-dark average back into the readable band, keeping
   *  its hue and saturation, by scaling it toward white or black. */
  function clampLightness(r, g, b) {
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; // relative luminance
    let rgb = [r, g, b];
    if (l > MAX_L && l > 0) rgb = rgb.map((v) => v * (MAX_L / l));
    else if (l < MIN_L && l < 1) rgb = rgb.map((v) => v + (1 - v) * ((MIN_L - l) / (1 - l)));
    return `#${rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;
  }
}
