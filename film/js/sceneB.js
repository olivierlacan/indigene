// fig. 2 — who eats what: a native oak leaf being eaten, an imported
// ornamental left alone, and a chickadee raising chicks on caterpillars.
import { C, ink, inkPath, wash, hand, span, ease, clamp, cachePts, polyPts, circlePts, loop, noise1, arrow } from "./engine.js";
import { S, I, LANG } from "./i18n.js";
import { T } from "./timeline.js";
import { caterpillar, chickadee } from "./figures.js";

// A white-oak leaf, built procedurally: rounded lobes, deep sinuses.
function oakLeaf(cx, baseY, len, rot) {
  const right = [], left = [];
  const N = 4.5;
  for (let i = 0; i <= 160; i++) {
    const f = i / 160;
    const env = Math.sin(Math.PI * Math.pow(f, 0.85)) * (0.36 + 0.1 * f) * len;
    const lobe = Math.pow(Math.abs(Math.sin(Math.PI * f * N + 0.4)), 0.55);
    const lobeL = Math.pow(Math.abs(Math.sin(Math.PI * f * N + 0.9)), 0.55);
    right.push([env * (0.3 + 0.7 * lobe), -f * len]);
    left.push([-env * (0.3 + 0.7 * lobeL), -f * len]);
  }
  const outline = [...right, ...left.reverse()];
  const c = Math.cos(rot), s = Math.sin(rot);
  const tf = ([x, y]) => [cx + x * c - y * s, baseY + x * s + y * c];
  const veins = [];
  for (let k = 0; k < 5; k++) {
    const f = (k + 0.35) / N;
    if (f > 0.95) break;
    for (const side of [1, -1]) {
      const env = Math.sin(Math.PI * Math.pow(f + 0.06, 0.85)) * (0.36 + 0.1 * f) * len;
      veins.push(polyPts([tf([0, -f * len]), tf([side * env * 0.85, -(f + 0.07) * len])], 3));
    }
  }
  return {
    outline: polyPts(outline.map(tf), 3),
    midrib: polyPts([tf([0, 40]), tf([0, -len * 0.97])], 3),
    veins,
    at: (f, side, k = 0.9) => {
      const env = Math.sin(Math.PI * Math.pow(f, 0.85)) * (0.36 + 0.1 * f) * len;
      const lobe = Math.pow(Math.abs(Math.sin(Math.PI * f * N + (side > 0 ? 0.4 : 0.9))), 0.55);
      return tf([side * env * (0.3 + 0.7 * lobe) * k, -f * len]);
    },
  };
}
const OAK = oakLeaf(420, 860, 560, 0.18);
const PEAR = {
  outline: "M930 820 C860 760 800 640 830 520 C850 440 910 380 960 350 C1010 400 1060 470 1070 560 C1080 680 1010 780 930 820 Z",
  midrib: "M925 880 C930 760 950 540 960 360",
  veins: "M934 740 C900 710 870 690 848 680 M936 740 C975 715 1010 690 1040 675 M942 640 C905 610 875 590 846 580 M944 640 C985 610 1020 585 1052 570 M950 540 C925 515 900 490 870 470 M952 540 C985 510 1010 485 1035 465",
};

export function drawB(ctx, t) {
  const tb = T.because;
  hand(ctx, S.fig2, 130, 120, { size: 40, color: C.inkSoft, p: span(t, tb - 0.2, 1.0), weight: 500 });

  // ---- native white oak leaf
  const lo = span(t, tb, 1.3, ease.inOut);
  wash(ctx, OAK.outline, { key: "B-oak", color: "#6ea24f", p: span(t, tb + 0.7, 1.2), alpha: 0.9, spread: 0.03, ox: 420, oy: 860 });
  ink(ctx, OAK.outline, { w: 3, p: lo, color: C.brandInk });
  ink(ctx, OAK.midrib, { w: 3, p: span(t, tb + 0.9, 0.8), color: C.brandInk });
  OAK.veins.forEach((v, i) => ink(ctx, v, { w: 1.8, p: span(t, tb + 1.1 + i * 0.05, 0.5), color: C.brandInk, alpha: 0.8 }));
  hand(ctx, S.oak, 150, 250, { size: 48, color: C.brand, p: span(t, T.cats + 0.2, 0.8), weight: 700, rot: -0.03 });
  hand(ctx, S.oakFeeds, 150, 300, { size: 34, color: C.inkSoft, p: span(t, T.cats + 0.9, 1.0), weight: 600, rot: -0.03 });

  // bites appear along the right edge as the caterpillar eats
  const bites = [[0.62, 1], [0.68, 1], [0.73, 1], [0.66, 1.2]];
  const eatStart = T.cats + 1.2;
  bites.forEach(([f, k], i) => {
    const b = span(t, eatStart + i * 0.55, 0.35, ease.out);
    if (b <= 0) return;
    const [bx, by] = OAK.at(f, 1, 1.02 * k);
    const r = 24 * b;
    ctx.save(); ctx.fillStyle = C.paper;
    ctx.beginPath(); ctx.arc(bx + 6, by, r, 0, 7); ctx.fill(); ctx.restore();
    ink(ctx, cachePts("bite" + i, () => circlePts(bx + 6, by, 24, 18, Math.PI * 0.55, Math.PI * 0.9)).map(([x, y]) => [bx + 6 + (x - bx - 6) * b, by + (y - by) * b]), { w: 2.4, color: C.brandInk, sound: false, seed: 40 + i });
  });
  // the caterpillar, clinging to the leaf edge and munching
  const [cx, cy] = OAK.at(0.56, 1, 0.9);
  const munch = t > eatStart ? t * 3.2 : undefined;
  caterpillar(ctx, cx - 40, cy + 36, 0.9, "B-cat", span(t, T.cats + 0.6, 0.6), t * 0.5, { munch });

  // ---- imported ornamental (Callery pear), untouched
  const tp = T.cats + 1.1;
  wash(ctx, cachePts("B-pearP", () => polyPts(inkPathPts(PEAR.outline), 4)), { key: "B-pear", color: "#3f7a45", p: span(t, tp + 0.6, 1.0), alpha: 0.95, spread: 0.02 });
  inkPath(ctx, PEAR.outline, { w: 3, p: span(t, tp, 1.0, ease.inOut), color: C.brandInk });
  inkPath(ctx, PEAR.midrib, { w: 2.6, p: span(t, tp + 0.6, 0.7), color: C.brandInk });
  inkPath(ctx, PEAR.veins, { w: 1.6, p: span(t, tp + 0.9, 0.8), color: C.brandInk, alpha: 0.8 });
  // glossy highlight
  inkPath(ctx, "M880 470 C900 440 920 420 940 405", { w: 6, p: span(t, tp + 1.3, 0.4), color: "#ffffff", alpha: 0.5, sound: false });
  hand(ctx, S.imported, 800, 250, { size: 48, color: C.accent, p: span(t, tp + 0.7, 0.8), weight: 700, rot: 0.02 });
  hand(ctx, S.importedNote, 800, 300, { size: 34, color: C.inkSoft, p: span(t, tp + 1.3, 1.0), weight: 600, rot: 0.02 });
  // a caterpillar that won't eat it
  const c2 = span(t, tp + 1.2, 0.5);
  caterpillar(ctx, 1010, 870, 0.8, "B-cat2", c2, t * 0.15, { flip: true });
  if (t > tp + 1.8) {
    const q = span(t, tp + 1.8, 0.5);
    inkPath(ctx, "M1072 780 L1106 814 M1106 780 L1072 814", { w: 4.5, p: q, color: C.red });
  }
  // the ground both leaves came from (a faint pencil line)

  // ---- the bird
  const tb2 = T.bird;
  inkPath(ctx, "M1880 500 C1760 520 1600 540 1440 548 C1380 552 1320 556 1250 566 M1650 530 C1690 500 1720 470 1770 452 M1500 545 C1520 520 1550 500 1580 490", { w: 5, p: span(t, tb2 - 0.2, 1.0), color: C.bark });
  wash(ctx, [[1250, 560], [1880, 494], [1880, 510], [1250, 574]], { key: "B-branch", color: C.bark, p: span(t, tb2 + 0.3, 0.8), alpha: 0.5, spread: 0.01 });
  // small leaves on the branch
  for (const [lx, ly, a] of [[1770, 452, -0.6], [1580, 490, -0.9], [1300, 560, 2.6], [1700, 515, 0.5]]) {
    const q = span(t, tb2 + 0.6, 0.6);
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(a);
    wash(ctx, [[0, 0], [22, -12], [48, 0], [22, 12]], { key: "B-lf" + lx, color: "#6ea24f", p: q, alpha: 0.9, spread: 0.02 });
    inkPath(ctx, "M0 0 C12 -14 34 -14 48 0 C34 14 12 14 0 0 Z", { w: 1.8, p: q, color: C.brandInk });
    ctx.restore();
  }
  const bp = span(t, tb2 + 0.1, 1.6, ease.inOut);
  chickadee(ctx, 1440, 548, 1.05, "B-bird", bp, { colors: I.birdColors });
  // caterpillar in its beak
  if (t > tb2 + 1.4) {
    ctx.save(); ctx.translate(1440 - 100, 548 - 118); ctx.rotate(1.2);
    caterpillar(ctx, 0, 0, 0.42, "B-beakcat", span(t, tb2 + 1.4, 0.4), 0.2, { segments: 7 });
    ctx.restore();
  }
  hand(ctx, S.bird, 1830, 250, { size: 40, color: C.inkSoft, p: span(t, tb2 + 0.6, 0.8), weight: 600, align: "right" });
  arrow(ctx, 660, 440, 1300, 400, { p: span(t, tb2 + 1.2, 0.8), w: 2.6, bend: -0.32, color: C.accent });

  // ---- the nest and its chicks
  const tc = T.chicks;
  const nq = span(t, tc - 0.1, 0.9);
  wash(ctx, cachePts("B-nestP", () => polyPts([[1470, 850], [1760, 850], [1720, 930], [1510, 930]])), { key: "B-nest", color: "#a07c50", p: span(t, tc + 0.4, 0.8), alpha: 0.85, spread: 0.06 });
  let nd = "";
  for (let i = 0; i < 9; i++) {
    const y = 852 + i * 9;
    nd += ` M${1466 + i * 5 + (i % 2) * 6} ${y} C${1540} ${y + 12 + (i % 3) * 3} ${1690} ${y + 10 - (i % 2) * 5} ${1764 - i * 5} ${y + (i % 2) * 3}`;
  }
  inkPath(ctx, nd, { w: 1.8, p: nq, color: "#5b4027", rough: false });
  // chicks: fuzzy heads, gaping yellow beaks, bobbing
  for (let i = 0; i < 3; i++) {
    const cq = span(t, tc + 0.3 + i * 0.15, 0.4, ease.outBack);
    if (cq <= 0) continue;
    const bob = Math.max(0, Math.sin(t * 7 + i * 1.7)) * 10;
    const hx = 1545 + i * 70, hy = 836 - bob - (i === 1 ? 14 : 0);
    ctx.save(); ctx.translate(hx, hy); ctx.scale(cq, cq);
    ctx.fillStyle = "#9d9a90"; ctx.globalAlpha = 0.95;
    ctx.beginPath(); ctx.arc(0, 0, 25, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
    loop(ctx, 0, 0, 25, { w: 2.2, sound: false, seed: 60 + i });
    // fuzz
    inkPath(ctx, "M-8 -24 L-12 -34 M0 -25 L1 -36 M8 -24 L13 -33", { w: 1.6, sound: false });
    const gape = 0.5 + 0.5 * Math.abs(Math.sin(t * 7 + i * 1.7));
    ctx.fillStyle = "#f5c542";
    ctx.beginPath(); ctx.moveTo(-8, -8); ctx.lineTo(-32, -26 - gape * 14); ctx.lineTo(-12, 2); ctx.lineTo(-32, 14 + gape * 10); ctx.lineTo(-6, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e0653a";
    ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(-28, -16 - gape * 10); ctx.lineTo(-14, 2); ctx.lineTo(-28, 8 + gape * 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(6, -6, 3.2, 0, 7); ctx.fill();
    ctx.restore();
  }
  arrow(ctx, 1420, 650, 1520, 790, { p: span(t, tc + 0.2, 0.6), w: 2.6, bend: 0.25, color: C.accent });
  hand(ctx, S.nest1, 1080, 1000, { size: 38, color: C.ink, p: span(t, tc + 0.8, 0.8), weight: 600 });
  hand(ctx, S.nest2, 1430, 1000, { size: 42, color: C.accent, p: span(t, tc + 1.4, 0.9), weight: 700 });
}

import { parsePath } from "./engine.js";
function inkPathPts(d) { return parsePath(d, 4)[0]; }
