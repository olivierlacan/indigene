// Score a photograph on how well it shows its subject — the ranking half of the
// hero-photo pipeline (see docs/hero-photos.md).
//
// **Decoded by Chromium, not by a library.** Playwright is already a dev
// dependency and the repo has no runtime ones; a headless page can decode
// anything the browser can (JPEG, PNG, WebP, EXIF orientation and all) via
// `createImageBitmap`, and read pixels off a canvas. Node fetches the bytes and
// hands them over, so the browser never needs network access of its own.
//
// **What "good" means here, and why it isn't sharpness.** The obvious metric —
// variance of the Laplacian over the whole frame — is actively misleading for
// this job. Measured on real iNaturalist photos, a lovely close-up of a single
// mushroom against a soft background scored 361, while a cluttered snapshot of a
// scrubby hillside where the plant is somewhere in the middle scored 5731. Busy
// wins. Gravel, twigs and distant foliage are high-frequency detail everywhere,
// and a photograph that isolates its subject is *smooth* over most of its area
// by design.
//
// So the discriminating measure is not how much detail there is but **where it
// is**: a specimen photo is sharp in the middle and calm at the edges. That
// ratio — `isolation` — is the heart of the score, with exposure, contrast and
// colour acting mostly as disqualifiers for the washed-out, the near-black and
// the accidental grey blur.
//
// None of this understands plants. It cannot tell a fine photograph of a leaf
// from a fine photograph of the whole shrub, and it never will. It exists to
// turn a hundred candidates into a shortlist of ten that a person can look
// through in a few seconds — the choosing stays human.
import { chromium } from "playwright";
import { existsSync } from "node:fs";

/** Claude Code web sessions pre-install Chromium outside Playwright's registry. */
const PREBUILT = "/opt/pw-browsers/chromium";

/** Analysis resolution. The metrics are all relative, so a fixed small raster
 *  makes scores comparable between a 500 px thumbnail and a 4000 px original —
 *  and keeps the whole pass in the tens of milliseconds per image. */
const N = 256;

/**
 * The weights, in one place because they are the opinion this file encodes.
 * They sum to 1; each component is normalised to 0–1 before weighting.
 */
export const WEIGHTS = {
  isolation: 0.42, // subject sharp, surroundings calm — the specimen-photo signature
  detail: 0.22, // the subject is actually in focus, not just isolated
  exposure: 0.16, // not blown out, not a silhouette
  contrast: 0.12, // has tonal range; not flat haze
  colour: 0.08, // living things have colour; a grey smear doesn't
};

/**
 * Score a batch of images. `items` is `[{ key, bytes: Buffer|Uint8Array }]`;
 * the returned array preserves input order and carries the raw measurements
 * alongside the combined 0–100 `score`, so a reviewer can see *why* something
 * ranked where it did rather than being handed a number.
 *
 * An image that fails to decode comes back with `score: 0` and an `error`,
 * never throwing — one bad file must not sink a run over hundreds.
 */
export async function scoreImages(items) {
  if (!items.length) return [];
  const browser = await chromium.launch(
    existsSync(PREBUILT) ? { executablePath: PREBUILT } : {},
  );
  try {
    const page = await browser.newPage();
    const payload = items.map(({ key, bytes }) => ({
      key,
      b64: Buffer.from(bytes).toString("base64"),
    }));
    const measured = await page.evaluate(measureAll, { items: payload, N });
    return measured.map((m) => (m.error ? { ...m, score: 0 } : { ...m, score: combine(m) }));
  } finally {
    await browser.close();
  }
}

/** Turn raw measurements into one 0–100 number using `WEIGHTS`. Separate from
 *  the in-page measuring so the weighting can be re-tuned — or re-run over a
 *  stored candidates file — without re-downloading and re-decoding anything. */
export function combine(m) {
  // Isolation: centre detail over edge detail. 1.0 means "as busy at the edges
  // as in the middle" (a landscape); 4+ is a well-separated subject. Compressed
  // by a log so a freak ratio can't swamp everything else.
  const isolation = clamp(Math.log2(Math.max(m.centreDetail, 1) / Math.max(m.edgeDetail, 1)) / 3);

  // Detail: the subject is genuinely in focus. Log-scaled — the useful range
  // spans two orders of magnitude — and saturating, because past a point more
  // detail is just noise or clutter.
  const detail = clamp(Math.log10(Math.max(m.centreDetail, 1)) / 3.2);

  // Exposure: a triangle peaking at mid-grey, then a hard penalty for clipping.
  // A quarter of the frame pure white is a blown sky, not a bright photo.
  const exposure =
    clamp(1 - Math.abs(m.brightness - 118) / 100) * clamp(1 - (m.clipped - 0.02) / 0.18);

  // Contrast: healthy tonal range. Peaks around 60 and eases off either side —
  // flat haze is bad, and so is the crushed look of a hard-flash night shot.
  const contrast = clamp(1 - Math.abs(m.contrast - 60) / 55);

  // Colour: some saturation. Plants are green; a grey smear is a mistake.
  const colour = clamp(m.saturation / 0.42);

  const total =
    WEIGHTS.isolation * isolation +
    WEIGHTS.detail * detail +
    WEIGHTS.exposure * exposure +
    WEIGHTS.contrast * contrast +
    WEIGHTS.colour * colour;
  return Math.round(total * 1000) / 10;
}

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Everything that touches pixels, in one function because it is serialised into
 * the page. Measures, but does not judge: the weighting lives in `combine`.
 */
function measureAll({ items, N }) {
  const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const canvas = new OffscreenCanvas(N, N);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  return (async () => {
    const out = [];
    for (const { key, b64 } of items) {
      try {
        const bmp = await createImageBitmap(new Blob([bytes(b64)]));
        // Square-crop to the centre before scaling, so a panorama isn't
        // squashed into the analysis raster and judged on distorted detail.
        const side = Math.min(bmp.width, bmp.height);
        ctx.clearRect(0, 0, N, N);
        ctx.drawImage(
          bmp,
          (bmp.width - side) / 2, (bmp.height - side) / 2, side, side,
          0, 0, N, N,
        );
        const d = ctx.getImageData(0, 0, N, N).data;

        const lum = new Float64Array(N * N);
        let sum = 0, clipped = 0, satSum = 0;
        for (let i = 0, p = 0; i < N * N; i++, p += 4) {
          const r = d[p], g = d[p + 1], b = d[p + 2];
          const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          lum[i] = y;
          sum += y;
          if (y <= 4 || y >= 251) clipped++;
          const max = Math.max(r, g, b), min = Math.min(r, g, b);
          satSum += max === 0 ? 0 : (max - min) / max;
        }
        const brightness = sum / (N * N);
        let varSum = 0;
        for (let i = 0; i < N * N; i++) varSum += (lum[i] - brightness) ** 2;

        // Laplacian energy, split between the central half of the frame and the
        // border around it. The ratio is what separates a specimen from a scene.
        const lo = N * 0.25, hi = N * 0.75;
        let cSum = 0, cN = 0, eSum = 0, eN = 0;
        for (let y = 1; y < N - 1; y++) {
          for (let x = 1; x < N - 1; x++) {
            const i = y * N + x;
            const L = 4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - N] - lum[i + N];
            const e = L * L;
            if (x >= lo && x < hi && y >= lo && y < hi) { cSum += e; cN++; }
            else { eSum += e; eN++; }
          }
        }

        out.push({
          key,
          width: bmp.width,
          height: bmp.height,
          brightness: round(brightness),
          contrast: round(Math.sqrt(varSum / (N * N))),
          clipped: round(clipped / (N * N), 4),
          saturation: round(satSum / (N * N), 3),
          centreDetail: round(cSum / cN),
          edgeDetail: round(eSum / eN),
        });
        bmp.close?.();
      } catch (err) {
        out.push({ key, error: String(err && err.message ? err.message : err) });
      }
    }
    return out;

    function round(v, places = 2) {
      const f = 10 ** places;
      return Math.round(v * f) / f;
    }
  })();
}
