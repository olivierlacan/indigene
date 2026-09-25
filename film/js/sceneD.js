// fig. 4 — ranked by what they feed, drawn to scale. The phone shows the
// app's real ranking for a Mid-Atlantic spot (host counts from the app's own
// catalog); the chart is the app's size-over-time drawing, redrawn by hand at
// one honest feet-per-pixel scale.
import { C, ink, inkPath, wash, hand, type, span, ease, clamp, cachePts, polyPts, loop, arrow, G } from "./engine.js";
import { S, I } from "./i18n.js";
import { T } from "./timeline.js";
import { tree, seedling } from "./figures.js";
import { parsePath } from "./engine.js";

// Plant-form glyphs, verbatim from app/src/components/plant-glyphs.ts
const GLYPH = {
  shrub: ["M8 40Q7.2 28.3 14.5 25.2Q16.5 11.7 24 19Q31.5 11.7 33.5 25.2Q40.8 28.3 40 40Z"],
  tree: ["M20.1 10.1Q24 3.9 27.9 10.1Q34.9 8.5 33.3 15.5Q39.5 19.4 33.3 23.3Q34.9 30.3 27.9 28.7Q24 34.9 20.1 28.7Q13.1 30.3 14.7 23.3Q8.5 19.4 14.7 15.5Q13.1 8.5 20.1 10.1Z", { s: "M24 30.5v9.5" }],
  perennial: [{ s: "M24 25v15" }, "M24 17C28 14.5 27 8.8 24 6.8C21 8.8 20 14.5 24 17Z", "M24 17C27.7 20 32.7 17.3 33.7 13.8C30.8 11.6 25.2 12.4 24 17Z", "M24 17C22.3 21.4 26.4 25.4 30 25.3C31.2 21.8 28.7 16.7 24 17Z", "M24 17C19.3 16.7 16.8 21.8 18 25.3C21.6 25.4 25.7 21.4 24 17Z", "M24 17C22.8 12.4 17.2 11.6 14.3 13.8C15.3 17.3 20.3 20 24 17Z", "M24 13.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 1 0 0-7.6Z", "M23.5 34C22 30 16.5 29.3 13.9 31.2C15.1 34.2 20.2 36.6 23.5 34Z"],
};
function glyph(ctx, form, x, y, size, alpha) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 48, size / 48); ctx.globalAlpha *= alpha;
  ctx.fillStyle = C.brand; ctx.strokeStyle = C.brand; ctx.lineWidth = 3.4; ctx.lineCap = "round";
  for (const m of GLYPH[form]) {
    if (typeof m === "string") ctx.fill(new Path2D(m.replace(/a3\.8 3\.8 0 1 0 0 7\.6 3\.8 3\.8 0 1 0 0-7\.6Z/, "m0 0")));
    else ctx.stroke(new Path2D(m.s));
  }
  if (form === "perennial") { ctx.beginPath(); ctx.arc(24, 17, 3.8, 0, 7); ctx.fill(); }
  ctx.restore();
}

// The rows, the plant drawn to scale and its units all come from i18n.js
const ROWS = I.rows;
const CH = I.chart;
const SIZES = CH.sizes;

const PX = 170, PY = 96, PW = 470, PH = 900; // phone
const GY = 880, FT = CH.px; // chart ground, px per unit (foot or metre)

function rr(x, y, w, h, r) {
  return `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}

export function drawD(ctx, t) {
  const t0 = T.shows - 0.3;
  hand(ctx, S.fig4, 700, 96, { size: 40, color: C.inkSoft, p: span(t, t0, 1.0), weight: 500 });

  // ---- the phone
  const fp = span(t, t0, 1.0, ease.inOut);
  wash(ctx, cachePts("D-bodyP", () => parsePath(rr(PX, PY, PW, PH, 58), 6)[0]), { key: "D-body", color: "#2a2c26", p: fp, alpha: 0.9, spread: 0.005, shift: 0, gran: 0.2 });
  wash(ctx, [[PX + 18, PY + 18], [PX + PW - 18, PY + 18], [PX + PW - 18, PY + PH - 18], [PX + 18, PY + PH - 18]], { key: "D-screen", color: "#f7f5ef", p: fp, alpha: 1, spread: 0.004, shift: 0, gran: 0.1, density: 4 });
  inkPath(ctx, rr(PX, PY, PW, PH, 58), { w: 3.4, p: fp, rough: false });
  // app header
  const hp = span(t, t0 + 0.5, 0.6);
  wash(ctx, [[PX + 18, PY + 18], [PX + PW - 18, PY + 18], [PX + PW - 18, PY + 120], [PX + 18, PY + 120]], { key: "D-hdr", color: C.brand, p: hp, alpha: 1, spread: 0.004, shift: 0, gran: 0.15, density: 4 });
  if (hp > 0.3) {
    const a = clamp((hp - 0.3) / 0.7);
    ctx.save(); ctx.globalAlpha = a;
    seedling(ctx, PX + 58, PY + 92, 0.95, "D-seed", 1);
    type(ctx, "Indigene", PX + 92, PY + 84, { size: 34, weight: 700, color: "#ffffff" });
    ctx.restore();
  }
  type(ctx, S.best, PX + 44, PY + 186, { size: S.best.length > 20 ? 29 : 32, weight: 700, alpha: span(t, t0 + 0.8, 0.4) });
  type(ctx, S.bestSub, PX + 44, PY + 220, { size: S.bestSub.length > 34 ? 19 : 21, weight: 400, color: C.inkSoft, alpha: span(t, t0 + 1.0, 0.4) });

  ROWS.forEach((r, i) => {
    const st = T.shows + 0.2 + i * 0.32;
    const a = span(t, st, 0.45, ease.out);
    if (a <= 0) return;
    const y = PY + 250 + i * 150 + (1 - a) * 26;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = "#ffffff"; ctx.strokeStyle = C.line; ctx.lineWidth = 2;
    const card = new Path2D(rr(PX + 36, y, PW - 72, 136, 16));
    ctx.fill(card); ctx.stroke(card);
    glyph(ctx, r.form, PX + 50, y + 16, 64, 1);
    type(ctx, r.name, PX + 128, y + 44, { size: r.name.length > 14 ? 22 : 26, weight: 600 });
    type(ctx, r.latin, PX + 128, y + 72, { size: 18, weight: 400, color: C.inkSoft, font: "Roboto" });
    // bar: caterpillar species fed
    const bp = span(t, T.ranked + 0.1 + i * 0.18, 0.7, ease.out);
    const bw = 220 * (r.n / I.maxN) * bp;
    ctx.fillStyle = C.line; ctx.fillRect(PX + 128, y + 96, 220, 12);
    ctx.fillStyle = C.brand; ctx.fillRect(PX + 128, y + 96, bw, 12);
    if (bp > 0) type(ctx, String(Math.round(r.n * bp)), PX + PW - 52, y + 108, { size: 24, weight: 700, color: C.brand, align: "right", alpha: Math.min(1, bp * 4) });
    ctx.restore();
    // hand-circled rank
    const rp = span(t, T.ranked + 0.3 + i * 0.18, 0.5);
    hand(ctx, String(i + 1), PX - 38, y + 84, { size: 58, color: C.accent, p: rp, weight: 700, align: "center" });
    loop(ctx, PX - 38, y + 66, 30, { w: 2.6, p: rp, color: C.accent, seed: 90 + i });
  });
  hand(ctx, S.feedsEach, PX + 20, PY + PH + 58, { size: 34, color: C.brand, p: span(t, T.ranked + 0.9, 0.8), weight: 700 });
  arrow(ctx, PX + PW + 30, PY + PH + 30, PX + PW + 8, PY + PH - 90, { p: span(t, T.ranked + 1.2, 0.5), w: 2.4, bend: 0.35, color: C.brand, head: 14 });

  // ---- size over time, to scale
  const ts = T.scale;
  const cols = [];
  let x = 796;
  const gap = 34;
  const human = { w: 50 };
  cols.push({ kind: "you", cx: x + human.w / 2 }); x += human.w + gap;
  SIZES.forEach((s) => { const w = Math.max(s.s * FT, 40); cols.push({ kind: "yr", s, cx: x + w / 2 }); x += w + gap; });

  hand(ctx, S.chartTitle, 790, 190, { size: 50, color: C.ink, p: span(t, ts - 0.1, 0.9), weight: 700 });
  arrow(ctx, PX + PW + 10, PY + 250 + 2 * 150 + 60, 800, 220, { p: span(t, ts, 0.6), w: 2.4, bend: -0.2, color: C.accent });
  // gridlines
  CH.grid.forEach((ft, i) => {
    const y = GY - ft * FT;
    const gp = span(t, ts + 0.3 + i * 0.12, 0.6, ease.inOut);
    ctx.save(); ctx.setLineDash([6, 8]); ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.globalAlpha = gp;
    ctx.beginPath(); ctx.moveTo(800, y); ctx.lineTo(800 + 1070 * gp, y); ctx.stroke(); ctx.restore();
    type(ctx, CH.fmt(ft), 788, y + 7, { size: 20, weight: 500, color: C.inkSoft, align: "right", alpha: gp });
  });
  ink(ctx, cachePts("D-ground", () => polyPts([[790, GY], [1880, GY]])), { w: 3, p: span(t, ts + 0.2, 0.8) });

  cols.forEach((c, i) => {
    const lp = span(t, ts + 0.4 + i * 0.1, 0.4);
    if (c.kind === "you") {
      drawHuman(ctx, c.cx, GY, CH.human * FT, span(t, ts + 0.5, 0.6));
      type(ctx, S.you, c.cx, GY + 32, { size: 22, weight: 700, align: "center", alpha: lp });
      type(ctx, S.youH, c.cx, GY + 58, { size: 20, weight: 400, align: "center", color: C.inkSoft, alpha: lp });
      return;
    }
    const gs = T.howbig + 0.05 + (i - 1) * 0.42;
    const g = span(t, gs, 0.75, ease.outQuart);
    if (g > 0) {
      ctx.save(); ctx.translate(c.cx, GY); ctx.scale(0.35 + 0.65 * g, g);
      tree(ctx, 0, 0, c.s.h * FT, c.s.s * FT, "D-t" + i, 1, { blossom: true, leaf: "#79ad5a" });
      ctx.restore();
    }
    type(ctx, S.year(c.s.y), c.cx, GY + 32, { size: 22, weight: 700, align: "center", alpha: lp });
    type(ctx, CH.fmt(c.s.h), c.cx, GY + 58, { size: 20, weight: 400, align: "center", color: C.inkSoft, alpha: g > 0 ? lp : lp * 0.35 });
  });
  arrow(ctx, ...CH.tallerArrow, { p: span(t, T.howbig + 1.6, 0.4), w: 2.2, bend: 0.2, color: C.accent, head: 12 });
  hand(ctx, S.taller, ...CH.tallerAt, { size: 36, color: C.accent, p: span(t, T.howbig + 1.4, 0.8), weight: 700, rot: -0.04 });
}

// The app's reference person, drawn solid in ink (same proportions as size-viz.ts)
function drawHuman(ctx, x, groundY, h, p) {
  if (p <= 0) return;
  const headR = h * 0.075, top = groundY - h;
  ctx.save();
  ctx.globalAlpha *= p;
  ctx.fillStyle = C.ink; ctx.strokeStyle = C.ink; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.arc(x, top + headR, headR, 0, 7); ctx.fill();
  const sh = top + headR * 2.4, hip = groundY - h * 0.47;
  ctx.beginPath();
  ctx.moveTo(x - headR * 1.05, sh); ctx.lineTo(x + headR * 1.05, sh); ctx.lineTo(x + headR * 0.62, hip); ctx.lineTo(x - headR * 0.62, hip); ctx.closePath(); ctx.fill();
  ctx.lineWidth = headR * 0.62;
  ctx.beginPath(); ctx.moveTo(x - headR * 1.0, sh + 2); ctx.lineTo(x - headR * 1.35, hip + h * 0.02); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + headR * 1.0, sh + 2); ctx.lineTo(x + headR * 1.35, hip + h * 0.02); ctx.stroke();
  ctx.lineWidth = headR * 0.7;
  ctx.beginPath(); ctx.moveTo(x - headR * 0.35, hip); ctx.lineTo(x - headR * 0.5, groundY - 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + headR * 0.35, hip); ctx.lineTo(x + headR * 0.5, groundY - 2); ctx.stroke();
  ctx.lineWidth = headR * 0.65;
  ctx.beginPath(); ctx.moveTo(x, top + headR * 1.7); ctx.lineTo(x, sh + 1); ctx.stroke();
  ctx.restore();
}
