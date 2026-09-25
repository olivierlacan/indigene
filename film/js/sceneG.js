// The mark: the app's seedling icon, painted; the wordmark; the promise.
import { C, ink, inkPath, wash, hand, type, span, ease, clamp, cachePts, polyPts, parsePath, loop } from "./engine.js";
import { S } from "./i18n.js";
import { T } from "./timeline.js";
import { bee, FLORA, FLYERS } from "./figures.js";
import { I } from "./i18n.js";

const MX = 960, MY = 330, MS = 2.1; // mark centre, scale of the 100-unit favicon
const m = (x, y) => [MX + (x - 50) * MS, MY + (y - 50) * MS];
function rr(x, y, w, h, r) {
  return `M${x + r} ${y} L${x + w - r} ${y} Q${x + w} ${y} ${x + w} ${y + r} L${x + w} ${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} L${x + r} ${y + h} Q${x} ${y + h} ${x} ${y + h - r} L${x} ${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
const [bx, by] = m(0, 0);
const BOX = rr(bx, by, 100 * MS, 100 * MS, 22 * MS);
const tx = (d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, a, b) => { const [x, y] = m(+a, +b); return `${x.toFixed(1)} ${y.toFixed(1)}`; });
const STEM = tx("M50 86 C50 74 47 66 50 56");
const LEAF_R = tx("M50 56 Q70 55 76 27 Q52 29 50 56 Z");
const LEAF_L = tx("M50 65 Q31 63 23 41 Q45 42 50 65 Z");
const WORDS = S.tagline;
const WORD_T = S.taglineT;

export function drawG(ctx, t) {
  const t0 = T.logo - 0.25;
  // ---- the painted icon
  const bq = span(t, t0, 0.8, ease.inOut);
  wash(ctx, cachePts("G-boxP", () => parsePath(BOX, 6)[0]), { key: "G-box", color: C.markBg, p: span(t, t0 + 0.3, 0.9), alpha: 1, spread: 0.012, density: 3.2, gran: 0.3, shift: 0 });
  inkPath(ctx, BOX, { w: 3.4, p: bq, color: C.brandInk, rough: false });
  inkPath(ctx, STEM, { w: 14, p: span(t, t0 + 0.7, 0.5), color: C.markStem, taper: 0.2, wobble: 0.6, rough: false });
  for (const [d, k, st, base] of [[LEAF_R, "r", 1.0, m(50, 56)], [LEAF_L, "l", 1.15, m(50, 65)]]) {
    const q = span(t, t0 + st, 0.6, ease.outBack);
    if (q <= 0) continue;
    ctx.save(); ctx.translate(base[0], base[1]); ctx.scale(q, q); ctx.translate(-base[0], -base[1]);
    wash(ctx, cachePts("G-" + k, () => parsePath(d, 3)[0]), { key: "G-leaf" + k, color: C.markLeaf, alpha: 1, spread: 0.015, density: 3, gran: 0.25, shift: 0 });
    inkPath(ctx, d, { w: 2.2, color: "#2f7a47", rough: false, sound: false });
    ctx.restore();
  }
  // ---- wordmark
  const wm = span(t, T.logo + 0.05, 0.7, ease.out);
  type(ctx, "Indigene", MX, 640, { size: 132, weight: 700, align: "center", alpha: wm, dy: (1 - wm) * 24, letterSpacing: -1 });
  // ---- the promise, word by word as it's spoken
  ctx.save();
  ctx.font = "700 60px Roboto";
  const widths = WORDS.map((w) => ctx.measureText(w + " ").width);
  ctx.restore();
  const total = widths.reduce((a, b) => a + b, 0) - 15;
  let x = MX - total / 2;
  WORDS.forEach((w, i) => {
    const a = span(t, T.tagline + WORD_T[i], 0.35, ease.out);
    const accent = S.taglineAccent.includes(w);
    const col = accent ? C.brand : C.ink;
    type(ctx, w, x, 760, { size: 60, weight: 700, color: col, alpha: a, dy: (1 - a) * 14 });
    if (accent) inkPath(ctx, `M${x - 4} 778 C${x + widths[i] * 0.3} 772 ${x + widths[i] * 0.7} 784 ${x + widths[i] - (i === WORDS.length - 1 || !S.taglineAccent.includes(WORDS[i + 1]) ? 14 : -2)} 774`, { w: 6, p: span(t, T.tagline + WORD_T[i] + 0.35, 0.5), color: C.markStem, rough: false });
    x += widths[i];
  });
  const ua = span(t, T.voEnd + 0.1, 0.6, ease.out);
  type(ctx, "indigene.app", MX, 860, { size: 44, weight: 700, color: C.brand, align: "center", alpha: ua, dy: (1 - ua) * 10 });
  hand(ctx, S.perks, MX, 930, { size: 44, color: C.inkSoft, p: span(t, T.voEnd + 0.6, 1.0), weight: 600, align: "center" });

  // ---- a border of natives blooms along the bottom
  const gq = span(t, T.tagline - 0.2, 1.4, ease.inOut);
  ink(ctx, cachePts("G-ground", () => polyPts([[80, 1030], [1840, 1030]])), { w: 2.6, p: gq, color: C.inkSoft, alpha: 0.7 });
  const sw = Math.sin(t * 1.5);
  const XS = [150, 230, 310, 400, 500, 580, 1350, 1440, 1510, 1600, 1700, 1790];
  const HS = { fox: 150, trefoil: 55, clover: 70, hair: 70, grass: 70, gold: 125, cardinal: 130 };
  I.flora.border.forEach((kind, i) => FLORA[kind](ctx, XS[i], 1030, HS[kind] ?? 100, "G-b" + i, span(t, T.tagline + 0.2 + (i % 6) * 0.25, 1.2, ease.out), sw * (i % 2 ? 1 : -1)));

  // ---- a monarch drifts through, and a bee visits the icon
  const u = clamp((t - (T.tagline + 1.2)) / 7.5);
  if (u > 0 && u < 1) {
    const mx = -80 + u * 2100, my = 470 - Math.sin(u * Math.PI) * 280 + Math.sin(u * 14) * 22;
    FLYERS[I.flora.flyers[0]](ctx, mx, my, 0.7, "G-mon", t * 2.8, { rot: 0.35 + Math.sin(t * 2) * 0.15 });
  }
  const bu = t - (T.voEnd - 0.4);
  if (bu > 0) {
    const land = clamp(bu / 2.2);
    const e = ease.inOut(land);
    const bx3 = lerp2(1900, m(80, 18)[0], e) + (1 - e) * Math.sin(bu * 5) * 50;
    const by3 = lerp2(160, m(80, 18)[1] - 12, e) + (1 - e) * Math.cos(bu * 4) * 30 + (land >= 1 ? Math.sin(t * 6) * 2 : 0);
    bee(ctx, bx3, by3, 1.2, t, { flip: false, rot: land >= 1 ? 0.1 : Math.sin(bu * 5) * 0.2 });
  }
}
const lerp2 = (a, b, f) => a + (b - a) * f;
