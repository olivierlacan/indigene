// Make a square thumbnail from a (usually very tall, full-page) screenshot,
// for the one-thumbnail-per-release slot on the What's new page (see the
// changelog rules in CLAUDE.md).
//
//   node scripts/make-thumb.mjs <screenshot.png> [out.png] [--crop <px>]
//
// Defaults to writing thumb.png next to the source. The crop is the top
// 480×480 of the image at its natural width — the top of a page screenshot is
// where the feature usually is. No image library: Playwright (already used
// for capturing the screenshots themselves) renders a one-image page and
// screenshots the square.
//
// --crop <px>: use only the leftmost <px> columns of the source. For older
// screenshots whose page overflowed the viewport (the pre-0.11 header bug),
// the capture is wider than the phone width and ends in a dark right gutter —
// cropping to the viewport width (390, or 780 at 2× DPR) removes it. A fresh
// capture should never need this: its width should equal the viewport width,
// and a wider one means the page overflows sideways (fix the page instead).
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SIZE = 480;

const args = process.argv.slice(2);
const cropFlag = args.indexOf("--crop");
const crop = cropFlag === -1 ? null : Number(args.splice(cropFlag, 2)[1]);
const src = args[0];
if (!src || !existsSync(src) || (crop !== null && !(crop > 0))) {
  console.error("usage: node scripts/make-thumb.mjs <screenshot.png> [out.png] [--crop <px>]");
  process.exit(1);
}
const out = resolve(args[1] ?? join(dirname(resolve(src)), "thumb.png"));

// PNG width from the IHDR chunk (bytes 16-19, big-endian).
const naturalWidth = readFileSync(src).readUInt32BE(16);
const shownWidth = crop === null ? naturalWidth : Math.min(crop, naturalWidth);

const dir = mkdtempSync(join(tmpdir(), "thumb-"));
const page = join(dir, "thumb.html");
// The leftmost `shownWidth` columns scaled to fill the square, cropped at the
// top; the viewport clips the rest.
writeFileSync(
  page,
  `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;overflow:hidden}
  img{width:${(SIZE * naturalWidth) / shownWidth}px;display:block}
</style>
<img src="${pathToFileURL(resolve(src))}">`,
);

try {
  execFileSync(
    "npx",
    ["playwright", "screenshot", `--viewport-size=${SIZE},${SIZE}`,
      "--wait-for-timeout=500", pathToFileURL(page).href, out],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`thumb: ${src} → ${out} (${SIZE}×${SIZE})`);
