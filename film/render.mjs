// Render the film headlessly, frame by frame.
//   node render.mjs stills 3.5 12 20        → out/still-<t>.png
//   node render.mjs video [fps] [from] [to] → out/frames.mp4 (+ out/ink.json for the pencil track)
//   FILM_LANG=fr node render.mjs …           → the French version (out/ink.fr.json)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Borrow the app's Playwright install (cd app && npm install).
const { chromium } = require(process.env.PLAYWRIGHT_PATH || new URL("../app/node_modules/playwright", import.meta.url).pathname);

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, "out");
fs.mkdirSync(out, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".woff2": "font/woff2", ".m4a": "audio/mp4", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
  fs.readFile(p, (e, b) => {
    if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
    res.end(b);
  });
}).listen(0);
const port = server.address().port;

const [mode = "stills", ...rest] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--disable-gpu-vsync", "--disable-frame-rate-limit"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.error("[page]", m.text()); });
page.on("pageerror", (e) => console.error("[pageerror]", e.message));
const LANG = process.env.FILM_LANG || "en";
await page.goto(`http://127.0.0.1:${port}/index.html?capture=1&lang=${LANG}`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

const grab = async (t) => {
  const b64 = await page.evaluate((t) => {
    const ink = window.__render(t);
    window.__lastInk = ink;
    return document.getElementById("c").toDataURL("image/png").split(",")[1];
  }, t);
  return Buffer.from(b64, "base64");
};

if (mode === "stills") {
  for (const s of rest) {
    const t = parseFloat(s);
    // warm up line/stroke state by rendering a few preceding frames
    for (let k = 6; k > 0; k--) await page.evaluate((t) => window.__render(t), Math.max(0, t - k / 30));
    const png = await grab(t);
    const f = path.join(out, `still-${LANG === "en" ? "" : LANG + "-"}${t.toFixed(2)}.png`);
    fs.writeFileSync(f, png);
    console.log(f);
  }
} else if (mode === "video") {
  const fps = +(rest[0] || 30), from = +(rest[1] || 0), to = +(rest[2] || 60);
  const file = path.join(out, rest[3] || "frames.mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation", "-pix_fmt", "yuv420p", "-r", String(fps), file], { stdio: ["pipe", "inherit", "inherit"] });
  const inkTrack = [];
  const n = Math.round((to - from) * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const t = from + i / fps;
    const png = await grab(t);
    inkTrack.push(await page.evaluate(() => window.__lastInk));
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % 60 === 0) console.log(`frame ${i}/${n}  t=${t.toFixed(2)}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  fs.writeFileSync(path.join(out, LANG === "en" ? "ink.json" : `ink.${LANG}.json`), JSON.stringify({ fps, from, ink: inkTrack }));
  console.log("wrote", file);
}
await browser.close();
server.close();
