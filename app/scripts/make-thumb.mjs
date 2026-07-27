// Make a square thumbnail from a (usually very tall, full-page) screenshot,
// for the one-thumbnail-per-release slot on the What's new page (see the
// changelog rules in CLAUDE.md).
//
//   node scripts/make-thumb.mjs <screenshot.png> [out.png]
//
// Defaults to writing thumb.png next to the source. The crop is the top
// 480×480 of the image at its natural width — the top of a page screenshot is
// where the feature usually is. No image library: Playwright (already used
// for capturing the screenshots themselves) renders a one-image page and
// screenshots the square.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SIZE = 480;

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error("usage: node scripts/make-thumb.mjs <screenshot.png> [out.png]");
  process.exit(1);
}
const out = resolve(process.argv[3] ?? join(dirname(resolve(src)), "thumb.png"));

const dir = mkdtempSync(join(tmpdir(), "thumb-"));
const page = join(dir, "thumb.html");
writeFileSync(
  page,
  `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0}
  img{width:${SIZE}px;height:${SIZE}px;object-fit:cover;object-position:top;display:block}
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
