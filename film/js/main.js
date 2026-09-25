import { W, H, C, G, camAt, paperGrain, vignette, makePaper, clamp } from "./engine.js";
import { CAM, CELL, T } from "./timeline.js";
import { drawA } from "./sceneA.js";
import { LANG } from "./i18n.js";

const scenes = [
  { cell: "A", draw: drawA, h: 1240 },
];
const lazy = [
  ["B", "./sceneB.js", "drawB"],
  ["C", "./sceneC.js", "drawC"],
  ["D", "./sceneD.js", "drawD"],
  ["E", "./sceneE.js", "drawE"],
  ["G", "./sceneG.js", "drawG"],
];
for (const [cell, url, fn] of lazy) {
  try {
    const m = await import(url);
    scenes.push({ cell, draw: m[fn], h: 1080 });
  } catch (e) { console.warn("scene", cell, "missing", e.message); }
}

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
await document.fonts.load("600 40px Caveat");
await document.fonts.load("700 40px Roboto");
await document.fonts.load("400 40px Roboto");
makePaper();

export function render(t) {
  G.t = t;
  G.boil = Math.floor(t * 8);
  G.ink = 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  const cam = camAt(CAM, t);
  // a breath of hand-held drift so the page never feels frozen
  cam.x += Math.sin(t * 0.37) * 3; cam.y += Math.cos(t * 0.29) * 2;
  const vx0 = cam.x - W / 2 / cam.z, vx1 = cam.x + W / 2 / cam.z;
  const vy0 = cam.y - H / 2 / cam.z, vy1 = cam.y + H / 2 / cam.z;
  for (const s of scenes) {
    const [ox, oy] = CELL[s.cell];
    if (ox > vx1 || ox + 1920 < vx0 || oy > vy1 || oy + s.h < vy0) continue;
    ctx.setTransform(cam.z, 0, 0, cam.z, W / 2 - cam.x * cam.z + ox * cam.z, H / 2 - cam.y * cam.z + oy * cam.z);
    s.draw(ctx, t);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  paperGrain(ctx, cam, 1);
  vignette(ctx, 1);
  // fade up from / down to paper-dark
  const fin = clamp(1 - t / 0.5), fout = clamp((t - (T.end - 0.8)) / 0.8);
  const f = Math.max(fin, fout);
  if (f > 0) { ctx.fillStyle = `rgba(20,22,15,${f})`; ctx.fillRect(0, 0, W, H); }
  return G.ink;
}

// ---------------------------------------------------------------- modes
const params = new URLSearchParams(location.search);
if (params.has("capture")) {
  document.body.classList.add("capture");
  window.__render = (t) => render(t);
  window.__ready = true;
} else {
  const audio = document.getElementById("audio");
  document.documentElement.lang = LANG;
  if (LANG !== "en") audio.src = `assets/soundtrack.${LANG}.m4a`;
  const scrub = document.getElementById("scrub");
  const time = document.getElementById("time");
  const btn = document.getElementById("play");
  const start = document.getElementById("start");
  scrub.max = T.end;
  let playing = false, t0 = 0, base = 0, useAudio = true;
  audio.addEventListener("error", () => { useAudio = false; });
  const now = () => (playing ? (useAudio && !audio.paused ? audio.currentTime : base + (performance.now() - t0) / 1000) : base);
  const setPlaying = (on) => {
    playing = on;
    document.body.classList.toggle("paused", !on);
    btn.textContent = on ? "Pause" : "Play";
    if (on) {
      if (base >= T.end) base = 0;
      t0 = performance.now();
      if (useAudio) { audio.currentTime = base; audio.play().catch(() => { useAudio = false; }); }
    } else {
      base = now();
      audio.pause();
    }
  };
  btn.onclick = () => setPlaying(!playing);
  start.onclick = () => { start.remove(); setPlaying(true); };
  scrub.oninput = () => { base = +scrub.value; t0 = performance.now(); if (useAudio) audio.currentTime = base; if (!playing) render(base); };
  addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); start.isConnected && start.remove(); setPlaying(!playing); } });
  const frame = () => {
    let t = now();
    if (t >= T.end) { t = T.end; if (playing) { base = T.end; setPlaying(false); } }
    render(t);
    scrub.value = t;
    time.textContent = `${t.toFixed(2)} / ${T.end.toFixed(2)}`;
    requestAnimationFrame(frame);
  };
  const t = +(params.get("t") || 0);
  base = t;
  frame();
}
