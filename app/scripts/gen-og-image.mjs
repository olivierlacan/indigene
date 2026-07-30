// Generates the social share card — the picture Slack, iMessage, WhatsApp,
// Twitter and Google show when someone posts an Indigene link.
//
//   node scripts/gen-og-image.mjs
//
// Writes public/og/share-card.png at 1200×630, the size every unfurler expects
// (and crops toward the centre of when it wants something squarer, which is
// why nothing important goes near the edges).
//
// Like scripts/make-thumb.mjs, there is no image library here: Playwright is
// already a dev dependency for the screenshots, so the card is a small HTML
// page rendered once and captured. The output is committed, so a normal build
// never runs this — re-run it by hand when the mark, the colours or the words
// change, and commit the new PNG.
//
// Fonts matter. The card is typeset in the app's own stack, which resolves to
// Roboto in this container (the SessionStart hook installs it); without it the
// text falls back to DejaVu and sets ~10% wider, so re-generate somewhere that
// has Roboto or the line breaks move. `fc-match system-ui` should say Roboto.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og");
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;

// The mark, inlined from the same file the browser uses as a favicon, so the
// card can never drift from the icon.
const mark = readFileSync(join(root, "public", "favicon.svg"), "utf8")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace("<svg", '<svg width="132" height="132"');

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    /* The app's dark surface, so the card looks like the thing it opens. */
    background: #14160f;
    color: #f2f1e8;
    /* space-between rather than centred: the wordmark sits at the top, the
       address at the bottom, and the headline takes the room in between. It
       keeps the URL out of the tagline's way whatever length the words are. */
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 74px 96px 62px;
    position: relative;
    overflow: hidden;
  }
  /* A soft brand wash bottom-right — depth without a photograph, and nothing
     an unfurler's centre-crop can cut into a meaningless smear. */
  .wash {
    position: absolute; right: -180px; bottom: -260px;
    width: 780px; height: 780px; border-radius: 50%;
    background: radial-gradient(circle, #1f6b3b 0%, rgba(31,107,59,0) 70%);
    opacity: 0.55;
  }
  .row { display: flex; align-items: center; gap: 28px; }
  .wordmark { font-size: 58px; font-weight: 800; letter-spacing: -0.02em; }
  h1 {
    font-size: 74px; line-height: 1.08; font-weight: 800;
    letter-spacing: -0.025em; max-width: 19ch;
  }
  h1 em { font-style: normal; color: #7ec894; }
  p {
    margin-top: 26px; font-size: 32px; line-height: 1.4;
    color: #cdcdbd; max-width: 34ch;
  }
  .url {
    font-size: 27px; font-weight: 650; color: #7ec894; letter-spacing: 0.01em;
  }
  /* Everything sits above the wash. */
  .row, .mid, .url { position: relative; }
</style>
<div class="wash"></div>
<div class="row">${mark}<span class="wordmark">Indigene</span></div>
<div class="mid">
  <h1>Native plants for <em>exactly</em> where you stand</h1>
  <p>Point at a spot and see what belongs there — ranked by what it feeds.</p>
</div>
<div class="url">indigene.app</div>
`;

const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(
  existsSync(prebuilt) ? { executablePath: prebuilt } : {},
);
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(300); // let the webfont-less layout settle
const out = join(outDir, "share-card.png");
await page.screenshot({ path: out });
await browser.close();
console.log(`wrote og/share-card.png ${W}×${H}`);
