// fig. 3 — reading a spot: where you stand, the sun's path over your horizon,
// the soil under your feet, and the climate around you.
import { C, ink, inkPath, wash, hand, span, ease, clamp, cachePts, polyPts, circlePts, loop, noise1, arrow, blobPoly } from "./engine.js";
import { S, I, LANG } from "./i18n.js";
import { T } from "./timeline.js";
import { person, tree, grassTuft } from "./figures.js";

const GY = 700, CX = 960, R = 560;
const arcAt = (a) => [CX + Math.cos(a) * R, GY - Math.sin(a) * R];
// the neighbour's tree blocks the low morning sun (angles near π)
const SHADE0 = Math.PI * 0.8;

const dashes = (() => {
  const out = [];
  const n = 34;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI - (i / n) * Math.PI, a1 = a0 - (Math.PI / n) * 0.55;
    out.push(polyPts([arcAt(a0), arcAt((a0 + a1) / 2), arcAt(a1)], 3));
  }
  return out;
})();
const PIN = "M0 0 C-10 -22 -34 -40 -34 -64 C-34 -84 -18 -98 0 -98 C18 -98 34 -84 34 -64 C34 -40 10 -22 0 0 Z";

export function drawC(ctx, t) {
  const t0 = T.name - 0.6;
  hand(ctx, S.fig3, 130, 120, { size: 40, color: C.inkSoft, p: span(t, t0, 1.0), weight: 500 });

  // ---- soil cross-section (drawn under everything above ground)
  const ts = T.soil;
  const layers = [
    { y0: GY, y1: GY + 95, col: "#6b4c33", a: 0.75, name: S.topsoil },
    { y0: GY + 95, y1: GY + 215, col: "#b98a5e", a: 0.6, name: S.subsoil },
    { y0: GY + 215, y1: GY + 360, col: "#9d9486", a: 0.45, name: S.rock },
  ];
  layers.forEach((L, i) => {
    wash(ctx, [[120, L.y0], [1800, L.y0], [1800, L.y1], [120, L.y1]], { key: "C-soil" + i, color: L.col, p: span(t, ts + i * 0.25, 1.1), alpha: L.a, ox: CX, oy: GY, spread: 0.03, fade: i === 2 ? "down" : undefined, fadeStart: 0.1, shift: 0 });
    if (i > 0) ink(ctx, cachePts("C-sl" + i, () => polyPts([[130, L.y0], [1790, L.y0]])).map(([x, y]) => [x, y + Math.sin(x * 0.01 + i) * 6]), { w: 1.6, p: span(t, ts + 0.2 + i * 0.25, 1.0), color: C.soilDark, alpha: 0.6 });
    hand(ctx, L.name, 150, (L.y0 + L.y1) / 2 + 12, { size: 30, color: i === 0 ? "#f7f5ef" : C.soilDark, p: span(t, ts + 0.6 + i * 0.25, 0.6), weight: 600 });
  });
  // pebbles and a worm
  const sp = span(t, ts + 0.5, 0.8);
  if (sp > 0) {
    ctx.save(); ctx.globalAlpha = sp * 0.8;
    for (let i = 0; i < 46; i++) {
      const px = 160 + noise1(71, i * 2.7) * 1620, py = GY + 230 + noise1(72, i * 1.9) * 110;
      ctx.fillStyle = i % 3 ? "#7c7468" : "#5f584d";
      ctx.beginPath(); ctx.ellipse(px, py, 5 + noise1(73, i) * 9, 4 + noise1(74, i) * 6, i, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  const wormPts = cachePts("C-worm", () => { const p = []; for (let x = 0; x <= 130; x += 3) p.push([1200 + x, GY + 52 + Math.sin(x * 0.07) * 12]); return p; });
  ink(ctx, wormPts, { w: 13, p: span(t, ts + 0.8, 0.6), color: "#d9828b", wobble: 0.4, taper: 0.5, alpha: 1 });
  // the soil callout
  arrow(ctx, 1420, 905, 1180, 760, { p: span(t, ts + 0.5, 0.6), w: 2.4, bend: 0.2, color: C.accent });
  hand(ctx, S.soil1, 1390, 950, { size: 42, color: C.accent, p: span(t, ts + 0.7, 0.8), weight: 700 });
  hand(ctx, S.soil2, 1390, 995, { size: 34, color: C.inkSoft, p: span(t, ts + 1.2, 0.7), weight: 600 });

  // ---- ground
  wash(ctx, [[120, GY - 8], [1800, GY - 8], [1800, GY + 4], [120, GY + 4]], { key: "C-turf", color: "#8fb35e", p: span(t, t0 + 0.3, 1.0), alpha: 0.8, ox: CX, oy: GY, spread: 0.01 });
  ink(ctx, cachePts("C-ground", () => polyPts([[110, GY], [1810, GY]])), { w: 3.4, p: span(t, t0, 1.1) });
  [[380, 36], [560, 30], [760, 40], [1260, 34], [1420, 42], [1640, 30]].forEach(([x, h], i) =>
    grassTuft(ctx, x, GY, h, "C-g" + i, span(t, t0 + 0.4 + i * 0.08, 0.6)));

  // ---- the neighbour's tree (it shades the morning sun)
  tree(ctx, 250, GY, 330, 230, "C-tree", span(t, T.sun - 0.4, 1.2), { leaf: "#6e9c52" });

  // ---- sun path
  const tsun = T.sun;
  dashes.forEach((d, i) => {
    const a = Math.PI - (i / dashes.length) * Math.PI;
    const shaded = a > SHADE0;
    ink(ctx, d, { w: 2.6, p: span(t, tsun + i * 0.018, 0.12, ease.linear), color: shaded ? "#9a968a" : "#d9981a", alpha: shaded ? 0.8 : 1 });
  });
  hand(ctx, S.am, arcAt(Math.PI)[0] - 30, GY - 16, { size: 30, color: C.inkSoft, p: span(t, tsun + 0.3, 0.4), weight: 600, align: "right" });
  hand(ctx, S.pm, arcAt(0)[0] + 30, GY - 16, { size: 30, color: C.inkSoft, p: span(t, tsun + 0.9, 0.4), weight: 600 });
  hand(ctx, S.shade, 520, 340, { size: 30, color: "#8a867a", p: span(t, tsun + 1.2, 0.4), weight: 600, rot: -0.5 });
  // the sun itself travels the arc
  const sq = span(t, tsun + 0.2, 0.5, ease.outBack);
  if (sq > 0) {
    const u = clamp((t - (tsun + 0.2)) / 6.5);
    const a = Math.PI * (0.93 - 0.7 * ease.inOutSine(u)); // stops mid-afternoon, clear of the notes
    const [sx, sy] = arcAt(a);
    const inShade = a > SHADE0;
    ctx.save(); ctx.translate(sx, sy); ctx.scale(sq, sq);
    wash(ctx, cachePts("C-sunP", () => blobPoly(0, 0, 44, 44, 20, 5, 0.03)), { key: "C-sun", color: inShade ? "#d8c68e" : C.sun, alpha: 1, spread: 0.03, shift: 0 });
    loop(ctx, 0, 0, 44, { w: 2.6, color: "#b87c0a", sound: false });
    ctx.rotate(t * 0.4);
    for (let i = 0; i < 10; i++) {
      const ra = (i / 10) * Math.PI * 2;
      ink(ctx, cachePts("C-ray" + i, () => polyPts([[Math.cos(ra) * 56, Math.sin(ra) * 56], [Math.cos(ra) * 76, Math.sin(ra) * 76]], 2)), { w: 3, color: "#d9981a", sound: false });
    }
    ctx.restore();
  }
  hand(ctx, S.sunHours, 1250, 150, { size: 46, color: "#b0700a", p: span(t, tsun + 0.9, 0.9), weight: 700 });

  // ---- climate
  const tc = T.climate;
  const cloud = "M1560 330 C1540 300 1575 270 1605 285 C1615 245 1675 240 1695 275 C1730 262 1765 290 1750 322 C1775 330 1770 360 1745 362 L1580 362 C1555 362 1545 340 1560 330 Z";
  wash(ctx, cachePts("C-cloudP", () => polyPts(parsePts(cloud), 5)), { key: "C-cloud", color: "#aebfcb", p: span(t, tc + 0.3, 0.8), alpha: 0.9, spread: 0.04 });
  inkPath(ctx, cloud, { w: 2.6, p: span(t, tc, 0.8), color: "#4f6270", rough: false });
  if (t > tc + 0.6) {
    ctx.save(); ctx.strokeStyle = "#5b86b0"; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.globalAlpha = clamp((t - tc - 0.6) / 0.4);
    for (let i = 0; i < 9; i++) {
      const x = 1590 + i * 19, ph = ((t * 1.4 + i * 0.37) % 1);
      const y = 380 + ph * 120;
      ctx.globalAlpha = clamp((t - tc - 0.6) / 0.4) * (1 - ph);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 5, y + 16); ctx.stroke();
    }
    ctx.restore();
  }
  // a snowflake: winters get cold here
  const sf = span(t, tc + 0.5, 0.6);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI;
    ink(ctx, cachePts("C-sf" + i, () => polyPts([[1830 + Math.cos(a) * 26, 250 + Math.sin(a) * 26], [1830 - Math.cos(a) * 26, 250 - Math.sin(a) * 26]], 2)), { w: 3, p: sf, color: "#5b86b0" });
  }
  hand(ctx, S.climate1, 1500, 560, { size: 44, color: "#3e6a92", p: span(t, tc + 0.4, 0.8), weight: 700 });
  hand(ctx, S.climate2, 1500, 604, { size: 34, color: C.inkSoft, p: span(t, tc + 0.9, 0.7), weight: 600 });

  // ---- the person, and the pin where they stand
  person(ctx, CX, GY, 1.08, { key: "C-me", pose: "phone", skin: C.skin2, hair: "curly", hairColor: C.hair1, shirt: "#e0a458", pants: "#44607a", shoe: "#3b3a36", t, face: "smile" }, span(t, t0 + 0.2, 1.6, ease.inOut));
  const pinT = T.name;
  const drop = span(t, pinT, 0.55, ease.outBack);
  if (drop > 0) {
    const px = CX + 150, py = GY - (1 - drop) * 380;
    // ripples
    for (let k = 0; k < 3; k++) {
      const u = (t - pinT - 0.5 - k * 0.45);
      if (u > 0 && u < 1.6) {
        ctx.save(); ctx.strokeStyle = C.brand; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.6 * (1 - u / 1.6);
        ctx.beginPath(); ctx.ellipse(px, GY, 20 + u * 90, 6 + u * 22, 0, 0, 7); ctx.stroke(); ctx.restore();
      }
    }
    ctx.save(); ctx.fillStyle = "rgba(20,20,15,0.18)";
    ctx.beginPath(); ctx.ellipse(px, GY + 2, 18 * drop, 5 * drop, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(px, py);
    wash(ctx, cachePts("C-pinP", () => polyPts(parsePts(PIN), 4)), { key: "C-pin", color: C.brand, alpha: 1, spread: 0.01, shift: 0, gran: 0.25 });
    inkPath(ctx, PIN, { w: 2.6, color: C.brandInk, rough: false, sound: false });
    ctx.fillStyle = "#f7f5ef"; ctx.beginPath(); ctx.arc(0, -64, 13, 0, 7); ctx.fill();
    ctx.restore();
  }
  hand(ctx, S.here, CX + 230, GY - 150, { size: 40, color: C.brand, p: span(t, T.standing + 0.2, 0.7), weight: 700 });
  arrow(ctx, CX + 250, GY - 136, CX + 178, GY - 90, { p: span(t, T.standing + 0.6, 0.4), w: 2.4, bend: 0.3, color: C.brand, head: 14 });
}

import { parsePath } from "./engine.js";
function parsePts(d) { return parsePath(d, 4)[0]; }
