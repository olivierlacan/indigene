// Take a screenshot the way CLAUDE.md's procedure specifies: phone viewport,
// real-phone pixel density, phone fonts (the SessionStart hook sets those up).
//
//   node scripts/shoot.mjs <url> <out.png> [options]
//
//   --scheme dark|light   color scheme            (default: dark)
//   --dpr N               device pixel ratio      (default: 3, like an iPhone;
//                         use 1 for very long full-page records where a 3×
//                         bitmap would be enormous or exceed Chromium limits)
//   --viewport WxH        CSS viewport            (default: 390x844)
//   --no-full-page        viewport crop instead of the whole page
//   --wait ms             settle time after load  (default: 1500)
//   --locale TAG          browser locale          (default: en-US) — drives
//                         navigator.language, so it picks the app's default
//                         language *and* its default unit system, the same way
//                         a real phone in that region would
//
// Exists because the Playwright CLI can't set device pixel ratio directly —
// its iPhone device descriptors force WebKit, which isn't installed here.
// The output width always equals viewport-width × dpr; anything else means
// the page overflows sideways (see CLAUDE.md — fix the page, don't publish).
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args.splice(i, 2)[1];
};
const has = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? false : (args.splice(i, 1), true);
};

const scheme = flag("--scheme", "dark");
const dpr = Number(flag("--dpr", "3"));
const [vw, vh] = flag("--viewport", "390x844").split("x").map(Number);
const fullPage = !has("--no-full-page");
const wait = Number(flag("--wait", "1500"));
const locale = flag("--locale", "en-US");
const [url, out] = args;

if (!url || !out || !(dpr > 0) || !(vw > 0) || !(vh > 0)) {
  console.error("usage: node scripts/shoot.mjs <url> <out.png> [--scheme dark|light] [--dpr N] [--viewport WxH] [--no-full-page] [--wait ms] [--locale TAG]");
  process.exit(1);
}

// Claude Code web sessions pre-install the browser outside playwright's
// registry; elsewhere, playwright's own resolution applies.
const prebuilt = "/opt/pw-browsers/chromium";
const browser = await chromium.launch(
  existsSync(prebuilt) ? { executablePath: prebuilt } : {},
);
const context = await browser.newContext({
  viewport: { width: vw, height: vh },
  deviceScaleFactor: dpr,
  colorScheme: scheme,
  locale,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(wait);
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`shot: ${url} → ${out} (${vw}x${vh} @${dpr}x, ${scheme}, ${locale}${fullPage ? ", full-page" : ""})`);
