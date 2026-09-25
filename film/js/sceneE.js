// fig. 5 — who it's for: a first-time gardener, a grandparent (with help),
// anyone with a window box — then plain words, and no account.
import { C, ink, inkPath, wash, hand, type, span, ease, clamp, cachePts, polyPts, loop, arrow, blobPoly, parsePath } from "./engine.js";
import { S, I, LANG } from "./i18n.js";
import { T } from "./timeline.js";
import { person, seedling, FLORA } from "./figures.js";

const GY = 620;
const X1 = 330, X2 = 960, X3 = 1590;

function backdrop(ctx, key, cx, color, p) {
  wash(ctx, cachePts(key + "P", () => blobPoly(cx, 430, 270, 250, 30, key.length * 7, 0.05)), { key, color, p, alpha: 0.55, spread: 0.05, oy: GY, ox: cx, shift: 0 });
}

export function drawE(ctx, t) {
  const tf = T.first;
  hand(ctx, S.fig5, 130, 100, { size: 40, color: C.inkSoft, p: span(t, tf - 0.3, 1.0), weight: 500 });

  // ------------------------------------------------ 1. first-time gardener
  backdrop(ctx, "E-bd1", X1, C.brandBg, span(t, tf - 0.2, 1.0));
  ink(ctx, cachePts("E-g1", () => polyPts([[X1 - 250, GY], [X1 + 250, GY]])), { w: 3, p: span(t, tf, 0.6) });
  wash(ctx, cachePts("E-mound", () => blobPoly(X1 + 110, GY, 70, 16, 16, 3, 0.06)), { key: "E-mound", color: C.soil, p: span(t, tf + 0.4, 0.5), alpha: 0.8 });
  person(ctx, X1 - 50, GY, 1.0, { key: "E-p1", pose: "kneel", skin: C.skin1, hair: "long", hairColor: "#8a4b2a", shirt: "#5f9a6a", pants: "#6b5b4b", t, face: "wonder", blinkOff: 1.3 }, span(t, tf + 0.05, 1.3, ease.inOut));
  // trowel in the right hand
  const trq = span(t, tf + 1.1, 0.4);
  inkPath(ctx, `M${X1 - 50 + 104} ${GY - 84} L${X1 - 50 + 126} ${GY - 50}`, { w: 5, p: trq, color: C.bark });
  wash(ctx, [[X1 + 72, GY - 52], [X1 + 90, GY - 44], [X1 + 96, GY - 16], [X1 + 80, GY - 24]], { key: "E-trowel", color: "#9aa0a6", p: trq, alpha: 1, spread: 0.01, shift: 0 });
  inkPath(ctx, `M${X1 + 72} ${GY - 52} L${X1 + 90} ${GY - 44} L${X1 + 96} ${GY - 16} L${X1 + 80} ${GY - 24} Z`, { w: 2, p: trq });
  seedling(ctx, X1 + 120, GY - 12, 1.6, "E-sd", span(t, tf + 0.7, 0.7));
  // a question that answers itself
  const qa = span(t, tf + 0.8, 0.3) * (1 - span(t, tf + 2.0, 0.3));
  if (qa > 0) hand(ctx, "?", X1 - 20, GY - 250 - Math.sin(t * 4) * 4, { size: 70, color: C.accent, weight: 700, alpha: qa });
  if (t > tf + 2.0) hand(ctx, "!", X1 - 14, GY - 250, { size: 70, color: C.brand, weight: 700, p: span(t, tf + 2.0, 0.2) });
  hand(ctx, S.firstTime, X1, GY + 96, { size: 46, color: C.brand, p: span(t, tf + 0.3, 0.9), weight: 700, align: "center" });

  // ------------------------------------------------ 2. a grandparent (and a helper)
  const tg = T.grand;
  backdrop(ctx, "E-bd2", X2, C.warnBg, span(t, tg - 0.3, 1.0));
  ink(ctx, cachePts("E-g2", () => polyPts([[X2 - 250, GY], [X2 + 250, GY]])), { w: 3, p: span(t, tg - 0.1, 0.6) });
  const gx = X2 - 110;
  person(ctx, gx, GY, 1.02, { key: "E-p2", pose: "water", skin: C.skin3, hair: "bun", hairColor: C.hair2, shirt: "#8f6aa0", pants: "#4a4a44", glasses: true, t, blinkOff: 0.7 }, span(t, tg, 1.3, ease.inOut));
  // watering can at the hand (~ gx+106, GY-171)
  const cq = span(t, tg + 0.9, 0.5);
  const can = `M${gx + 96} ${GY - 186} L${gx + 146} ${GY - 186} L${gx + 142} ${GY - 136} L${gx + 100} ${GY - 136} Z`;
  wash(ctx, cachePts("E-canP", () => parsePath(can, 4)[0]), { key: "E-can", color: "#6f9fb8", p: cq, alpha: 1, spread: 0.01, shift: 0 });
  inkPath(ctx, can, { w: 2.4, p: cq });
  inkPath(ctx, `M${gx + 142} ${GY - 150} L${gx + 186} ${GY - 186} M${gx + 180} ${GY - 194} L${gx + 194} ${GY - 180}`, { w: 3, p: cq });
  inkPath(ctx, `M${gx + 104} ${GY - 186} Q${gx + 121} ${GY - 214} ${gx + 138} ${GY - 186}`, { w: 2.4, p: cq });
  if (t > tg + 1.3) {
    ctx.save(); ctx.strokeStyle = "#5b86b0"; ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const ph = (t * 1.6 + i * 0.29) % 1;
      const x = gx + 192 + i * 3 + ph * 16, y = GY - 180 + ph * 130;
      ctx.globalAlpha = clamp((t - tg - 1.3) / 0.3) * (1 - ph) * 0.9;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2, y + 10); ctx.stroke();
    }
    ctx.restore();
  }
  FLORA[I.flora.grand](ctx, X2 + 105, GY, I.flora.grand === "fox" ? 170 : 120, "E-cf", span(t, tg + 0.5, 1.1), Math.sin(t * 1.5));
  person(ctx, X2 + 190, GY, 0.56, { key: "E-kid", pose: "stand", skin: C.skin3, hair: "curly", hairColor: C.hair1, shirt: "#e8b43c", pants: "#44607a", t, face: "wonder", blinkOff: 2.1 }, span(t, tg + 0.6, 1.0, ease.inOut));
  hand(ctx, S.grandparents, X2, GY + 96, { size: 46, color: "#8a5a12", p: span(t, tg + 0.2, 0.8), weight: 700, align: "center" });

  // ------------------------------------------------ 3. anyone with a patch of dirt
  const ta = T.anyone;
  backdrop(ctx, "E-bd3", X3, "#dbe7ee", span(t, ta - 0.3, 1.0));
  // a slice of apartment building
  const bq = span(t, ta - 0.1, 0.9, ease.inOut);
  wash(ctx, [[X3 - 210, 190], [X3 + 210, 190], [X3 + 210, GY], [X3 - 210, GY]], { key: "E-bldg", color: "#d9b99b", p: span(t, ta + 0.4, 0.9), alpha: 0.8, spread: 0.01, shift: 0 });
  inkPath(ctx, `M${X3 - 210} ${GY} L${X3 - 210} 190 L${X3 + 210} 190 L${X3 + 210} ${GY}`, { w: 3, p: bq });
  // brick hints
  inkPath(ctx, `M${X3 - 190} 230 l40 0 M${X3 + 140} 250 l40 0 M${X3 - 170} 560 l40 0 M${X3 + 130} 580 l44 0 M${X3 - 196} 250 l0 18 M${X3 + 160} 560 l0 20`, { w: 1.6, p: bq, color: "#9b6f4e", alpha: 0.7 });
  // the window, with someone at it
  const wx0 = X3 - 110, wx1 = X3 + 110, wy0 = 290, wy1 = 470;
  const wq = span(t, ta + 0.2, 0.6);
  wash(ctx, [[wx0, wy0], [wx1, wy0], [wx1, wy1], [wx0, wy1]], { key: "E-win", color: "#3d4b52", p: span(t, ta + 0.55, 0.6), alpha: 0.85, spread: 0.005, shift: 0 });
  ctx.save();
  ctx.beginPath(); ctx.rect(wx0, wy0, wx1 - wx0, wy1 - wy0); ctx.clip();
  person(ctx, X3, 650, 0.95, { key: "E-p3", pose: "lean", skin: C.skin4, hair: "short", hairColor: "#b9772f", shirt: "#c65d4a", pants: "#44607a", t, blinkOff: 0.2 }, span(t, ta + 0.4, 1.0, ease.inOut));
  ctx.restore();
  inkPath(ctx, `M${wx0} ${wy0} L${wx1} ${wy0} L${wx1} ${wy1} L${wx0} ${wy1} Z M${X3} ${wy0} L${X3} ${wy0 + 60}`, { w: 3.4, p: wq });
  // window box full of natives
  const bx = `M${wx0 - 20} ${wy1} L${wx1 + 20} ${wy1} L${wx1 + 10} ${wy1 + 44} L${wx0 - 10} ${wy1 + 44} Z`;
  wash(ctx, cachePts("E-boxP", () => parsePath(bx, 4)[0]), { key: "E-box", color: "#a0663e", p: span(t, ta + 0.5, 0.5), alpha: 0.95, spread: 0.01, shift: 0 });
  inkPath(ctx, bx, { w: 2.6, p: span(t, ta + 0.5, 0.5) });
  const sw = Math.sin(t * 1.6);
  const [wb1, wb2, wb3] = I.flora.windowBox;
  FLORA[wb1](ctx, wx0 + 20, wy1 + 2, 62, "E-as", span(t, ta + 0.9, 0.9), sw);
  FLORA[wb2](ctx, X3 + 64, wy1 + 2, 70, "E-cf3", span(t, ta + 1.0, 0.9), -sw);
  FLORA[wb3](ctx, wx1 + 2, wy1 + 2, 56, "E-gt", span(t, ta + 1.1, 0.8), sw);
  // and a sidewalk tree pit
  ink(ctx, cachePts("E-g3", () => polyPts([[X3 - 250, GY], [X3 + 250, GY]])), { w: 3, p: span(t, ta, 0.6) });
  hand(ctx, S.anyone, X3 - 20, GY + 96, { size: 40, color: "#2f5f86", p: span(t, ta + 0.3, 1.1), weight: 700, align: "center" });

  // ------------------------------------------------ plain words
  const tp = T.plain;
  ctx.save(); ctx.font = "600 54px Caveat"; const jw = ctx.measureText(S.jargon).width; ctx.restore();
  hand(ctx, S.jargon, 250, 880, { size: 54, color: C.inkSoft, p: span(t, tp, 0.5), weight: 600, align: "center" });
  inkPath(ctx, `M${250 - jw / 2 - 12} 866 C${250 - jw / 4} 872 ${250 + jw / 4} 858 ${250 + jw / 2 + 16} 862`, { w: 4.5, p: span(t, tp + 0.45, 0.35), color: C.red });
  arrow(ctx, 385, 866, 455, 866, { p: span(t, tp + 0.6, 0.35), w: 3, bend: 0, color: C.inkSoft, head: 14 });
  const pill = span(t, tp + 0.75, 0.4, ease.outBack);
  if (pill > 0) {
    ctx.save(); ctx.font = "600 30px Roboto"; const pw = ctx.measureText(S.plain).width + 70; ctx.restore();
    ctx.save(); ctx.translate(475 + pw / 2, 862); ctx.scale(pill, pill);
    ctx.fillStyle = C.brandBg; ctx.strokeStyle = C.brand; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(-pw / 2, -40, pw, 80, 40); ctx.fill(); ctx.stroke();
    type(ctx, S.plain, 0, 11, { size: 30, weight: 600, color: C.brandInk, align: "center" });
    ctx.restore();
  }
  hand(ctx, S.plainNote, 500, 960, { size: 38, color: C.inkSoft, p: span(t, tp + 1.0, 0.6), weight: 600 });

  // ------------------------------------------------ no account
  const tn = T.account;
  ctx.save(); ctx.font = "700 32px Roboto"; const cw = Math.max(ctx.measureText(S.noAccount1).width, 380) + 60; ctx.restore();
  const cx0 = 1840 - cw;            // the callout hugs the right margin
  const fdx = cx0 - 36 - 1344;      // the form sits just left of it
  // a sign-up form, scribbled out
  const fq = span(t, tn - 0.1, 0.5);
  ctx.save(); ctx.translate(fdx, 0);
  inkPath(ctx, "M1090 810 L1330 810 L1330 990 L1090 990 Z M1110 850 L1310 850 M1110 900 L1310 900 M1150 950 L1270 950", { w: 2.2, p: fq, color: C.inkSoft });
  hand(ctx, S.signUp, 1120, 840, { size: 26, color: C.inkSoft, p: fq, weight: 600 });
  hand(ctx, S.password, 1120, 890, { size: 26, color: C.inkSoft, p: fq, weight: 600 });
  inkPath(ctx, "M1080 820 L1344 984 M1344 820 L1080 984", { w: 5, p: span(t, tn + 0.35, 0.3), color: C.red });
  ctx.restore();
  const cp = span(t, tn + 0.5, 0.45, ease.outBack);
  if (cp > 0) {
    ctx.save(); ctx.translate(cx0 + cw / 2, 900); ctx.scale(cp, cp);
    ctx.fillStyle = C.brandBg; ctx.beginPath(); ctx.roundRect(-cw / 2, -70, cw, 140, 20); ctx.fill();
    type(ctx, S.noAccount1, -cw / 2 + 30, -12, { size: 32, weight: 700, color: C.brandInk });
    type(ctx, S.noAccount2, -cw / 2 + 30, 32, { size: 26, weight: 400, color: C.brandInk });
    ctx.restore();
  }
}
