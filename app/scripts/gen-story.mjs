// Draws an Instagram story (1080×1920) for a post: the site share card's look
// (dark ground, green wash, the mark), the post's occasion, date and title, a
// drawing, and a line of text.
//
//   node scripts/gen-story.mjs                       # the newest post, in English
//   node scripts/gen-story.mjs <post-slug>           # → docs/outreach/story-<slug>.png
//   node scripts/gen-story.mjs <post-slug> --lang fr # → docs/outreach/story-<slug>-fr.png
//   node scripts/gen-story.mjs <post-slug> --feed    # → docs/outreach/post-<slug>.png, 1080×1350
//
// Everything comes from the app: the post from data/posts.ts, its words from
// the locales, the tagline from data/brand.json, and the drawing from the
// app's own components (bundled with esbuild, coloured with the dark theme's
// tokens), so a story can't drift from the page it links to. The date is
// written the way the pages write it in that language ("October 12, 2026",
// "12 octobre 2026").
//
// STORIES says, per post, which drawing to use and which line to set under it.
// A post with no entry gets its own lede and no drawing.
//
// Instagram covers roughly the top 250 px and bottom 340 px of a story with its
// own controls, so nothing that matters sits there, and the band under the
// words is left clear for link stickers. A feed post (`--feed`, 4:5 portrait,
// the tallest the grid allows) has no controls over it, so it keeps an even
// margin all round instead.
//
// A drawing is either the peoples page's basket (`people`) or one of the
// page drawings by name (`page:<name>`, from `page-art-svg.mjs`).
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { build } from "esbuild";
import { chromium } from "playwright";
import { PAGE_ART_RULES, PAGE_ART_DARK } from "../src/components/page-art-svg.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Per post key: the drawing (a key of `art` in the bundle) and the locale key
 *  of the line under it. */
const STORIES = {
  ipd2026: { art: "people", line: "people.lede" },
  halloween2026: { art: "page:killYourLawn", line: "posts.halloween2026.lede" },
};

/** The app's modules, bundled twice: for the page (iife) and for this script
 *  (esm, to pick the post and name the file). */
const ENTRY = `
  import { peopleArt } from "./src/components/people-art.ts";
  import { en } from "./src/locales/en.ts";
  import { fr } from "./src/locales/fr.ts";
  import { POSTS } from "./src/data/posts.ts";
  import BRAND from "./src/data/brand.json";
  import { pageArtSvg } from "./src/components/page-art-svg.mjs";
  export const art = { people: peopleArt };
  export { pageArtSvg };
  export const dicts = { en, fr };
  export { POSTS, BRAND };
`;
const bundle = (format) =>
  build({
    stdin: { contents: ENTRY, resolveDir: root, loader: "ts" },
    bundle: true, format, globalName: "STORY", write: false, logLevel: "silent",
  }).then((r) => r.outputFiles[0].text);

const [pageScript, esm] = await Promise.all([bundle("iife"), bundle("esm")]);
const { POSTS } = await import("data:text/javascript;base64," + Buffer.from(esm).toString("base64"));

/** Locale per language: the dictionary key and how dates are written. */
const LANGS = { en: "en-US", fr: "fr-FR" };
const args = process.argv.slice(2);
const langAt = args.indexOf("--lang");
const lang = langAt >= 0 ? args.splice(langAt, 2)[1] : "en";
const feedAt = args.indexOf("--feed");
const feed = feedAt >= 0;
if (feed) args.splice(feedAt, 1);
const W = 1080;
const H = feed ? 1350 : 1920;
if (!LANGS[lang]) {
  console.error(`No language "${lang}". Languages: ${Object.keys(LANGS).join(", ")}`);
  process.exit(1);
}
const slug = args[0] ?? POSTS[0].slug;
const post = POSTS.find((p) => p.slug === slug);
if (!post) {
  console.error(`No post "${slug}". Posts: ${POSTS.map((p) => p.slug).join(", ")}`);
  process.exit(1);
}
const story = STORIES[post.key] ?? { line: `posts.${post.key}.lede` };
const [y, m, d] = post.date.split("-").map(Number);
const date = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(LANGS[lang], {
  year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
}).replace(/(\d) (\p{L})/u, "$1\u00a0$2");

const out = join(root, "..", "docs", "outreach", `${feed ? "post" : "story"}-${post.slug}${lang === "en" ? "" : `-${lang}`}.png`);
mkdirSync(dirname(out), { recursive: true });

const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="104" height="104"');

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
    padding: ${feed ? "84px 84px 84px" : "250px 84px 350px"};
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
  .mid { margin-top: ${feed ? 56 : 84}px; }
  /* Room for the link stickers, between the words and the footer. */
  .foot { margin-top: auto; }
  .row { display: flex; align-items: center; gap: 26px; }
  .wordmark { font-size: 54px; font-weight: 800; letter-spacing: -0.02em; }
  .when { font-size: 34px; font-weight: 650; color: var(--brand); margin-bottom: 18px; }
  /* The date sits back from the occasion: lighter, smaller, even numerals. */
  .when .date { font-weight: 400; font-size: 31px; color: #cdcdbd; font-variant-numeric: tabular-nums; }
  h1 { font-size: 86px; line-height: 1.04; font-weight: 800; letter-spacing: -0.03em; text-wrap: balance; }
  .art { margin: 44px 0 0; }
  .art:empty { display: none; }
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
  ${PAGE_ART_RULES}
  .page-art { ${PAGE_ART_DARK} }
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
<script>${pageScript}</script>
<script>
  const { art, dicts, BRAND } = STORY;
  const lang = ${JSON.stringify(lang)};
  const en = dicts[lang];
  document.documentElement.lang = lang;
  const key = ${JSON.stringify(post.key)};
  const story = ${JSON.stringify(story)};
  document.getElementById("name").textContent = BRAND.name;
  const when = document.getElementById("when");
  const d = document.createElement("span");
  d.className = "date";
  d.textContent = ${JSON.stringify(date)};
  when.append(en["posts." + key + ".occasion"] + " · ", d);
  document.getElementById("title").textContent = en["posts." + key + ".title"];
  if (story.art?.startsWith("page:")) document.getElementById("art").innerHTML = STORY.pageArtSvg(story.art.slice(5));
  else if (story.art) document.getElementById("art").append(art[story.art]());
  document.getElementById("lede").textContent = en[story.line];
  const t = BRAND.tagline[lang];
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
