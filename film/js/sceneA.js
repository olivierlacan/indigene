// fig. 1 — a typical yard (green but quiet), and fig. 6 — the same yard with
// natives: blooms, deep roots, and the food web back.
import { C, ink, inkPath, wash, hand, span, ease, clamp, cachePts, polyPts, blobPoly, loop, noise1, arrow, G } from "./engine.js";
import { S, I, LANG } from "./i18n.js";
import { T } from "./timeline.js";
import { tree, bee, chickadee, caterpillar, FLORA, FLYERS } from "./figures.js";

const GY = 720; // ground line

const house = {
  walls: "M150 720 L150 470 L520 470 L520 720",
  roof: "M118 486 L335 300 L552 486 Z",
  door: "M300 720 L300 624 Q335 604 370 624 L370 720",
  win1: "M186 540 L262 540 L262 606 L186 606 Z M224 540 L224 606 M186 573 L262 573",
  win2: "M408 540 L484 540 L484 606 L408 606 Z M446 540 L446 606 M408 573 L484 573",
  chimney: "M438 388 L438 330 L476 330 L476 418",
};
const fence = (() => {
  let d = "M560 652 L1860 652 M560 694 L1860 694";
  for (let x = 580; x < 1860; x += 64) d += ` M${x} 720 L${x} 628 L${x + 9} 616 L${x + 18} 628 L${x + 18} 720`;
  return d;
})();
const lawnBlades = (() => {
  const pts = [];
  for (let x = 560, i = 0; x <= 1860; x += 6.5, i++) pts.push([x, i % 2 ? GY - 16 - noise1(3, i * 0.9) * 3 : GY + 1]);
  return polyPts(pts, 2);
})();
const lawnRoots = (() => {
  let d = "";
  for (let x = 580; x < 1850; x += 22) d += ` M${x} ${GY + 4} q${(x % 3) - 1} 12 ${(x % 5) - 2} ${22 + (x % 7)}`;
  return d;
})();

// The natives that replace the lawn come from the locale: [kind, x, height, start offset]
const NATIVES = I.flora.yard;

function root(x, depth, seed) {
  let d = `M${x} ${GY + 2}`;
  let y = GY + 2, cx = x;
  const segs = 7;
  for (let i = 1; i <= segs; i++) {
    const ny = GY + (depth * i) / segs;
    const nx = x + (noise1(seed, i * 0.8) - 0.5) * 40;
    d += ` Q${(cx + nx) / 2 + (noise1(seed + 5, i) - 0.5) * 30} ${(y + ny) / 2} ${nx} ${ny}`;
    // side rootlets
    if (i % 2 === 0) d += ` M${nx} ${ny} q${(i % 4 ? 1 : -1) * 24} 10 ${(i % 4 ? 1 : -1) * 40} 34 M${nx} ${ny}`;
    cx = nx; y = ny;
  }
  return d;
}

export function drawA(ctx, t) {
  // ---- paper-level labels
  const gone = 1 - span(t, T.plant, 0.7, ease.inOut); // fig. 1's notes fade as fig. 6 arrives
  hand(ctx, S.fig1, 160, 130, { size: 40, color: C.inkSoft, p: span(t, 0.7, 1.2), weight: 500, alpha: gone });

  // ---- soil band (cross-section)
  const soilP = span(t, 0.6, 1.8);
  wash(ctx, [[40, GY], [1880, GY], [1880, 1200], [40, 1200]], { key: "A-soil", color: C.soil, p: soilP, alpha: 0.5, ox: 960, oy: GY, spread: 0.035, layers: 20, fade: "down", fadeStart: 0.05, shift: 0 });
  wash(ctx, [[40, GY], [1880, GY], [1880, GY + 70], [40, GY + 70]], { key: "A-topsoil", color: C.soilDark, p: soilP, alpha: 0.45, ox: 960, oy: GY, spread: 0.05, layers: 16, fade: "down", fadeStart: 0.1, shift: 0 });
  // pebbles in the cross-section
  if (soilP > 0.5) {
    ctx.save(); ctx.globalAlpha = (soilP - 0.5) * 2 * 0.55; ctx.fillStyle = C.soilDark;
    for (let i = 0; i < 70; i++) {
      const px = 70 + noise1(401, i * 3.1) * 1800, py = GY + 30 + Math.pow(noise1(402, i * 2.3), 1.3) * 380;
      ctx.beginPath(); ctx.ellipse(px, py, 3 + noise1(403, i) * 6, 2 + noise1(404, i) * 4, i, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  // a couple of pencil clouds, just to give the sky some air
  inkPath(ctx, "M700 250 C690 220 730 200 755 215 C765 185 815 180 830 210 C860 196 890 220 875 250 Z", { w: 2, p: span(t, 1.6, 1.2), color: C.inkSoft, alpha: 0.5 });
  inkPath(ctx, "M960 150 C955 128 985 115 1002 127 C1012 106 1048 104 1058 124 C1080 115 1100 135 1088 152 Z", { w: 1.8, p: span(t, 2.0, 1.0), color: C.inkSoft, alpha: 0.4 });
  // ground line
  ink(ctx, cachePts("A-ground", () => polyPts([[50, GY], [1870, GY]])), { w: 3.4, p: span(t, 0.15, 1.3) });

  // ---- house
  const hq = span(t, 0.5, 1.9);
  wash(ctx, [[150, 470], [520, 470], [520, 720], [150, 720]], { key: "A-wall", color: "#e7d9bf", p: span(t, 1.3, 1.2), alpha: 0.85 });
  wash(ctx, [[118, 486], [335, 300], [552, 486]], { key: "A-roof", color: "#b8745a", p: span(t, 1.4, 1.2), alpha: 0.8, oy: 300 });
  wash(ctx, [[300, 720], [300, 624], [335, 606], [370, 624], [370, 720]], { key: "A-door", color: C.brand, p: span(t, 1.8, 0.8), alpha: 0.8 });
  wash(ctx, [[186, 540], [262, 540], [262, 606], [186, 606]], { key: "A-w1", color: C.sky, p: span(t, 1.9, 0.8), alpha: 0.9 });
  wash(ctx, [[408, 540], [484, 540], [484, 606], [408, 606]], { key: "A-w2", color: C.sky, p: span(t, 2.0, 0.8), alpha: 0.9 });
  inkPath(ctx, house.roof, { w: 3.2, p: span(t, 0.5, 0.9) });
  inkPath(ctx, house.walls, { w: 3.2, p: span(t, 0.8, 0.8) });
  inkPath(ctx, house.chimney, { w: 3, p: span(t, 1.1, 0.5) });
  inkPath(ctx, house.door, { w: 2.6, p: span(t, 1.3, 0.5) });
  inkPath(ctx, house.win1, { w: 2.2, p: span(t, 1.4, 0.6) });
  inkPath(ctx, house.win2, { w: 2.2, p: span(t, 1.55, 0.6) });

  // ---- fence
  wash(ctx, [[560, 616], [1860, 616], [1860, 720], [560, 720]], { key: "A-fence", color: "#eee6d3", p: span(t, 2.2, 1.0), alpha: 0.6, ox: 560, oy: 680 });
  inkPath(ctx, fence, { w: 2, p: span(t, 1.3, 2.3, ease.inOut), color: C.inkSoft, over: 2.5 });

  // ---- ornamental "lollipop" tree and a clipped hedge
  wash(ctx, blobPolyC("A-lolly", 1450, 470, 92, 88), { key: "A-lolly", color: "#6f9f58", p: span(t, 2.4, 1.0), alpha: 0.9 });
  inkPath(ctx, "M1442 720 L1444 556 M1458 720 L1456 556", { w: 2.6, p: span(t, 1.8, 0.6), color: C.bark });
  loop(ctx, 1450, 470, 92, { ry: 88, w: 2.6, p: span(t, 2.0, 0.7) });
  wash(ctx, [[1150, 652], [1335, 652], [1335, 720], [1150, 720]], { key: "A-hedge", color: "#56804a", p: span(t, 2.6, 0.9), alpha: 0.95 });
  inkPath(ctx, "M1150 720 L1150 656 Q1150 648 1158 648 L1327 648 Q1335 648 1335 656 L1335 720", { w: 2.6, p: span(t, 2.2, 0.7) });

  // ---- the lawn: uniform, mown, green
  const lawnP = span(t, T.green - 0.1, 1.5, ease.inOut);
  wash(ctx, [[560, GY - 18], [1860, GY - 18], [1860, GY + 1], [560, GY + 1]], { key: "A-lawn", color: C.lawn, p: span(t, T.green + 0.2, 1.1), alpha: 0.95, ox: 560, oy: GY, spread: 0.01 });
  ink(ctx, lawnBlades, { w: 1.5, p: lawnP, wobble: 0.3, color: "#3f6b2a" });
  inkPath(ctx, lawnRoots, { w: 1.5, p: span(t, T.green + 0.8, 1.2), color: C.soilDark, alpha: 0.8 });
  hand(ctx, S.lawnRoots, 600, GY + 96, { size: 32, color: C.soilDark, p: span(t, T.green + 1.5, 0.9), weight: 500, alpha: gone });

  // ---- "…but strangely quiet": a flatlined birdsong meter
  const q0 = T.quiet;
  hand(ctx, S.birdsong, 1376, 196, { size: 38, color: C.inkSoft, p: span(t, q0, 0.5), weight: 600, align: "right" });
  ctx.save(); ctx.globalAlpha = gone;
  const meter = cachePts("A-meter", () => {
    const pts = [];
    for (let x = 1400; x <= 1780; x += 3) {
      const f = (x - 1400) / 380;
      const amp = 22 * Math.exp(-f * 9);
      pts.push([x, 186 + Math.sin(x * 0.35) * amp]);
    }
    return pts;
  });
  ink(ctx, meter, { w: 2.4, p: span(t, q0 + 0.25, 1.1, ease.linear), color: C.accent });
  hand(ctx, S.nothing, 1600, 244, { size: 34, color: C.accent, p: span(t, q0 + 1.0, 0.5), weight: 600 });
  ctx.restore();
  if (t > T.foodweb) {
    // the meter comes back to life
    const live = cachePts("A-meter2", () => {
      const pts = [];
      for (let x = 1400; x <= 1780; x += 2.5) {
        const f = (x - 1400) / 380;
        const burst = Math.pow(Math.abs(Math.sin(f * Math.PI * 3.2)), 2);
        pts.push([x, 186 + Math.sin(x * 0.42) * 26 * (0.35 + 0.65 * burst)]);
      }
      return pts;
    });
    ink(ctx, live, { w: 2.6, p: span(t, T.foodweb + 0.2, 1.2, ease.linear), color: C.brand });
    hand(ctx, S.singing, 1520, 250, { size: 34, color: C.brand, p: span(t, T.foodweb + 1.0, 0.7), weight: 700 });
  }

  // =============== fig. 6: the same yard, with natives ===============
  if (t < T.plant - 0.5) return;
  const t0 = T.plant + 0.15;
  hand(ctx, S.fig6, 160, 130, { size: 40, color: C.brand, p: span(t, t0 + 0.2, 1.1), weight: 600 });
  // meadow wash over the mown strip
  wash(ctx, [[560, GY - 60], [1860, GY - 60], [1860, GY + 2], [560, GY + 2]], { key: "A-meadow", color: "#c3cf7a", p: span(t, t0, 1.4), alpha: 0.55, ox: 1200, oy: GY });
  const sway = Math.sin(t * 1.7);
  NATIVES.forEach(([kind, x, h, off], i) => {
    const st = t0 + off * 1.8;
    const p = span(t, st, 1.4, ease.out);
    // roots run deep — drawn first, downward
    inkPath(ctx, root(x, 280 + (i % 4) * 45, i + 3), { w: 2, p: span(t, st - 0.1, 2.2, ease.out), color: "#6b4a2e", alpha: 0.85 });
    FLORA[kind](ctx, x, GY, h, "A-n" + i, p, sway * (i % 2 ? 1 : -1));
  });
  // a young serviceberry where the lawn used to be
  tree(ctx, 960, GY, 300, 190, "A-svc", span(t, t0 + 0.3, 1.6), { blossom: true, leaf: I.flora.tree.leaf });
  inkPath(ctx, root(960, 400, 99), { w: 2.6, p: span(t, t0 + 0.3, 2.4), color: "#6b4a2e", alpha: 0.85 });
  hand(ctx, S.deepRoots, 1250, 1000, { size: 36, color: "#6b4a2e", p: span(t, t0 + 1.2, 1.0), weight: 600 });

  // ---- the food web comes back: caterpillar, butterflies, bees, a singing chickadee
  const fw = T.foodweb;
  caterpillar(ctx, I.flora.host.x, GY - I.flora.host.h * 0.8 - 6, 0.36, "A-mcat", span(t, fw - 0.2, 0.6), t * 0.8, I.flora.host.cat);
  // monarchs drift in on lazy S-curves
  for (let i = 0; i < 3; i++) {
    const st = fw + 0.1 + i * 0.6;
    const u = clamp((t - st) / (5.5 + i * 0.8));
    if (u <= 0) continue;
    // three separate lanes, so they read as three butterflies, not a clump
    const x = 2000 - u * [1250, 900, 1500][i] + Math.sin(u * 7 + i) * 40;
    const y = [250, 430, 330][i] + Math.sin(u * 5 + i * 2) * 50 - u * 40;
    const kind = I.flora.flyers[i];
    FLYERS[kind](ctx, x, y, (0.62 - i * 0.08) * (kind === "blue" ? 0.8 : 1), "A-mon" + i, t * (kind === "blue" ? 3.4 : 2.6) + i * 0.3, { rot: -0.25 + Math.sin(t * 2 + i) * 0.15 });
  }
  for (let i = 0; i < 4; i++) {
    const st = fw + 0.3 + i * 0.25;
    if (t < st) continue;
    const u = t - st;
    const cx = [700, 1370, 1620, 830][i], cy = GY - [200, 240, 190, 160][i];
    const x = cx + Math.sin(u * 2.1 + i) * 60, y = cy + Math.sin(u * 3.3 + i * 2) * 26;
    // dotted flight trail
    ctx.save(); ctx.fillStyle = C.inkSoft; ctx.globalAlpha = 0.5;
    for (let k = 1; k < 9; k++) {
      const uu = u - k * 0.07;
      if (uu < 0) break;
      ctx.beginPath(); ctx.arc(cx + Math.sin(uu * 2.1 + i) * 60, cy + Math.sin(uu * 3.3 + i * 2) * 26, 1.8, 0, 7); ctx.fill();
    }
    ctx.restore();
    bee(ctx, x, y, 0.95, t + i, { flip: Math.cos(u * 2.1 + i) > 0, rot: Math.sin(u * 3) * 0.2 });
  }
  // chickadee lands on the fence post and sings
  const land = clamp((t - (fw + 0.4)) / 0.9);
  if (land > 0) {
    const e = ease.out(land);
    const bx = 1980 - (1980 - 1040) * e, by = 380 + (612 - 380) * e - Math.sin(e * Math.PI) * 60;
    chickadee(ctx, bx, by, 0.5, "A-bird", 1, { rot: (1 - e) * -0.2, colors: I.birdColors });
    if (land >= 1) {
      const s = (t - (fw + 1.3)) % 1.6;
      for (let k = 0; k < 2; k++) {
        const nt = s - k * 0.35;
        if (nt > 0 && nt < 1.1) {
          ctx.save();
          ctx.globalAlpha = Math.sin((nt / 1.1) * Math.PI);
          hand(ctx, k ? "♫" : "♪", 986 - nt * 50 - k * 30, 520 - nt * 70, { size: 44, color: C.inkSoft, weight: 700 });
          ctx.restore();
        }
      }
    }
  }
}
function blobPolyC(key, cx, cy, rx, ry) { return cachePts(key, () => blobPoly(cx, cy, rx, ry, 26, 17, 0.04)); }
