// Draws the film's share card — the English poster, cropped to 1200×630 — for
// `/film`'s link preview. A still from the film is the honest picture for a
// link that opens the film: most previews draw a play button over it.
//
//   node scripts/gen-film-card.mjs     # → public/og/film.jpg
//
// Re-run after refreshing the posters (film/README.md, "Publish a new cut").
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const poster = readFileSync(join(root, "public", "film", "poster-en.webp")).toString("base64");

// The container's preinstalled Chromium, when there is one (as the other card
// scripts do); otherwise Playwright's own.
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(
  `<style>html,body{margin:0}img{display:block;width:1200px;height:630px;object-fit:cover}</style>` +
    `<img src="data:image/webp;base64,${poster}">`
);
await page.waitForFunction(() => document.images[0].complete);
await page.screenshot({ path: join(root, "public", "og", "film.jpg"), type: "jpeg", quality: 88 });
await browser.close();
