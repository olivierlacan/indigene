// Draws an Instagram story (1080×1920) for the Indigenous Peoples' Day post:
// the site share card's look (dark ground, green wash, the mark) with the
// drawing from "Peoples and plants" in the middle.
//
//   node scripts/gen-story.mjs     # → docs/outreach/story-indigenous-peoples-day.png
//
// The drawing is the app's own (`components/people-art.ts`), bundled here with
// esbuild and coloured with the dark theme's tokens, so the story can't drift
// from the page. The words come from the locales and data/brand.json.
//
// Instagram covers roughly the top 250 px and bottom 340 px of a story with its
// own controls, so nothing that matters sits there, and the band under the
// drawing is left clear for the link stickers.
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { build } from "esbuild";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "..", "docs", "outreach", "story-indigenous-peoples-day.png");
mkdirSync(dirname(out), { recursive: true });

const W = 1080;
const H = 1920;

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="104" height="104"');

// The drawing and the words, from the app's own modules.
const bundle = await build({
  stdin: {
    contents: `
      import { peopleArt } from "./src/components/people-art.ts";
      import { en } from "./src/locales/en.ts";
      import BRAND from "./src/data/brand.json";
      window.STORY = { peopleArt, en, BRAND };
    `,
    resolveDir: root,
    loader: "ts",
  },
  bundle: true,
  format: "iife",
  write: false,
  logLevel: "silent",
});
const script = bundle.outputFiles[0].text;

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg: #14160f; --line: #3c4232; --line-strong: #727b5f;
    --brand: #7ec894; --brand-bg: #1f3326; --accent: #e2a86a;
  }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: var(--bg); color: #f2f1e8;
    padding: 250px 84px 350px;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }
  .wash {
    position: absolute; right: -320px; top: 760px;
    width: 1100px; height: 1100px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.55;
  }
  .row, .mid, .foot { position: relative; }
  .mid { margin-top: 84px; }
  /* Room for the two link stickers, between the words and the footer. */
  .foot { margin-top: auto; }
  .row { display: flex; align-items: center; gap: 26px; }
  .wordmark { font-size: 54px; font-weight: 800; letter-spacing: -0.02em; }
  .when { font-size: 34px; font-weight: 650; color: var(--brand); margin-bottom: 18px; }
  h1 { font-size: 86px; line-height: 1.04; font-weight: 800; letter-spacing: -0.03em; text-wrap: balance; }
  .art { margin: 44px 0 0; }
  .art svg { width: 100%; height: auto; display: block; }
  .people-art .pa-ground { fill: var(--brand-bg); }
  .people-art .pa-soil { fill: var(--line); opacity: 0.6; }
  .people-art .pa-leaf { fill: var(--brand); }
  .people-art .pa-leaf-soft { opacity: 0.7; }
  .people-art .pa-stalk { fill: none; stroke: var(--brand); stroke-width: 2.2; stroke-linecap: round; }
  .people-art .pa-flax-flower { fill: #e46a5e; }
  .people-art .pa-camas { fill: #9aa6f2; }
  .people-art .pa-basket { fill: var(--accent); }
  .people-art .pa-rim { fill: var(--accent); stroke: var(--bg); stroke-width: 1.5; }
  .people-art .pa-weave { fill: none; stroke: var(--bg); stroke-width: 1.4; opacity: 0.55; }
  .people-art .pa-lily { fill: #fffdf4; stroke: var(--line-strong); stroke-width: 1; }
  .lede { margin-top: 36px; font-size: 36px; line-height: 1.38; color: #cdcdbd; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; }
  .tagline { font-size: 32px; color: #cdcdbd; }
  .url { font-size: 32px; font-weight: 650; color: var(--brand); }
</style>
<div class="wash"></div>
<div class="row">${mark}<span class="wordmark" id="name"></span></div>
<div class="mid">
  <p class="when" id="when"></p>
  <h1 id="title"></h1>
  <div class="art" id="art"></div>
  <p class="lede" id="lede"></p>
</div>
<div class="foot"><span class="tagline" id="tagline"></span><span class="url">indigene.app</span></div>
<script>${script}</script>
<script>
  const { peopleArt, en, BRAND } = window.STORY;
  document.getElementById("name").textContent = BRAND.name;
  document.getElementById("when").textContent = en["posts.ipd2026.when"];
  document.getElementById("title").textContent = en["posts.ipd2026.title"];
  document.getElementById("art").append(peopleArt());
  document.getElementById("lede").textContent = en["people.lede"];
  const t = BRAND.tagline.en;
  document.getElementById("tagline").textContent = t.charAt(0).toUpperCase() + t.slice(1);
</script>
`;

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(existsSync(prebuilt) ? { executablePath: prebuilt } : {});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote ${out.replace(join(root, "..") + "/", "")} ${W}×${H}`);
