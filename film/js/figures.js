// The cast: people, a chickadee, caterpillars, a monarch, bees, and the
// native plants — each a function that draws itself on at progress `p`.
import {
  C, ink, inkPath, wash, loop, span, clamp, lerp, ease, noise1, cachePts, circlePts, polyPts, blobPoly, G, hand,
} from "./engine.js";

const sub = (p, a, b) => clamp((p - a) / (b - a));

// ---------------------------------------------------------------- capsule limb
// A limb/garment tube along pts: flat colour fill + ink edges.
function offsetLine(pts, d) {
  const out = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(pts.length - 1, k + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    out.push([pts[k][0] - (dy / l) * d, pts[k][1] + (dx / l) * d]);
  }
  return out;
}
function smoothPts(ctrl, step = 3) {
  // Catmull-Rom through control points
  const out = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const n = Math.max(3, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
}
export function capsule(ctx, key, ctrl, w, fill, p = 1, o = {}) {
  if (p <= 0) return;
  const pts = cachePts("cap" + key, () => smoothPts(ctrl));
  const n = Math.max(2, Math.ceil(pts.length * p));
  const part = pts.slice(0, n);
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = fill; ctx.lineWidth = w; ctx.globalAlpha *= o.alpha ?? 0.92;
  ctx.beginPath(); part.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.restore();
  const L = cachePts("capL" + key, () => offsetLine(pts, w / 2));
  const R = cachePts("capR" + key, () => offsetLine(pts, -w / 2));
  const lw = o.lw ?? 2.4;
  ink(ctx, L, { w: lw, p, wobble: 0.8 });
  ink(ctx, R, { w: lw, p, wobble: 0.8 });
  if (o.cap !== false && p >= 1) {
    const e = pts[pts.length - 1], b = pts[pts.length - 2];
    const ang = Math.atan2(e[1] - b[1], e[0] - b[0]);
    const arc = cachePts("capE" + key, () => circlePts(e[0], e[1], w / 2, 10, ang - Math.PI / 2, Math.PI));
    ink(ctx, arc, { w: lw, wobble: 0.4, sound: false });
  }
}

// ---------------------------------------------------------------- people
// Poses are joint maps in "person units": feet at (0,0), about 300 tall.
const POSES = {
  stand: {
    head: [0, -262], neck: [0, -236], shL: [-34, -226], shR: [34, -226], hipL: [-19, -136], hipR: [19, -136],
    legL: [[-19, -136], [-21, -70], [-22, -6]], legR: [[19, -136], [21, -70], [22, -6]],
    armL: [[-34, -222], [-44, -170], [-40, -120]], armR: [[34, -222], [44, -170], [40, -120]],
    footL: [-28, -2], footR: [28, -2],
  },
  phone: { // standing, looking down at a phone held in both hands
    head: [0, -260], neck: [0, -234], shL: [-34, -226], shR: [34, -226], hipL: [-19, -136], hipR: [19, -136],
    legL: [[-19, -136], [-21, -70], [-22, -6]], legR: [[19, -136], [21, -70], [22, -6]],
    armL: [[-30, -220], [-38, -174], [-8, -168]], armR: [[30, -220], [40, -174], [14, -170]],
    footL: [-28, -2], footR: [28, -2], phone: [3, -172], tilt: 0.14,
  },
  kneel: {
    head: [8, -212], neck: [6, -186], shL: [-26, -178], shR: [36, -176], hipL: [-18, -92], hipR: [16, -92],
    legL: [[-18, -92], [-30, -12], [-86, -6]], legR: [[16, -92], [58, -64], [56, -6]],
    armL: [[-26, -174], [-6, -122], [30, -104]], armR: [[36, -172], [76, -128], [104, -84]],
    footL: [-92, -3], footR: [64, -2], tilt: 0.12,
  },
  water: { // standing, arm out holding a watering can
    head: [0, -258], neck: [0, -232], shL: [-32, -224], shR: [34, -222], hipL: [-18, -136], hipR: [18, -136],
    legL: [[-18, -136], [-22, -70], [-24, -6]], legR: [[18, -136], [24, -70], [28, -6]],
    armL: [[-32, -220], [-44, -168], [-38, -120]], armR: [[34, -218], [70, -186], [104, -168]],
    footL: [-30, -2], footR: [34, -2], tilt: 0.06,
  },
  lean: { // at a window sill, forearms resting
    head: [0, -258], neck: [0, -232], shL: [-36, -222], shR: [36, -222], hipL: [-20, -136], hipR: [20, -136],
    legL: [[-20, -136], [-21, -70], [-22, -6]], legR: [[20, -136], [21, -70], [22, -6]],
    armL: [[-36, -218], [-50, -164], [-12, -150]], armR: [[36, -218], [52, -166], [24, -152]],
    footL: [-28, -2], footR: [28, -2], tilt: 0.05,
  },
};

/**
 * o: {pose, skin, hair, hairColor, shirt, pants, shoe, glasses, key, face:'smile'|'wonder', t}
 */
export function person(ctx, x, y, s, o, p) {
  if (p <= 0) return;
  const J = POSES[o.pose || "stand"];
  const k = o.key;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  const legW = o.legW ?? 27, armW = o.armW ?? 18;
  // legs
  capsule(ctx, k + "legL", J.legL, legW, o.pants, sub(p, 0.0, 0.18));
  capsule(ctx, k + "legR", J.legR, legW, o.pants, sub(p, 0.06, 0.24));
  // shoes
  for (const [f, a] of [[J.footL, 0.2], [J.footR, 0.26]]) {
    const q = sub(p, a, a + 0.08);
    if (q > 0) {
      const dir = f[0] < 0 ? -1 : 1;
      const pts = cachePts(k + "shoe" + f, () => blobPoly(f[0] + dir * 6, f[1] - 7, 20, 9, 14, 3, 0.05));
      wash(ctx, pts, { key: k + "shoe" + f, color: o.shoe || C.inkSoft, p: q, alpha: 0.9, layers: 8, spread: 0.02 });
      ink(ctx, cachePts(k + "shoeL" + f, () => [...pts, pts[0]]), { w: 2.2, p: q, wobble: 0.5 });
    }
  }
  // torso (shirt): a soft trapezoid from shoulders to hips
  const tq = sub(p, 0.22, 0.44);
  if (tq > 0) {
    const [sL, sR, hL, hR] = [J.shL, J.shR, J.hipL, J.hipR];
    const d = `M${sL[0]} ${sL[1] + 4} Q${(sL[0] + sR[0]) / 2} ${sL[1] - 10} ${sR[0]} ${sR[1] + 4} Q${sR[0] + 6} ${(sR[1] + hR[1]) / 2} ${hR[0] + 8} ${hR[1] + 6} L${hL[0] - 8} ${hL[1] + 6} Q${sL[0] - 6} ${(sL[1] + hL[1]) / 2} ${sL[0]} ${sL[1] + 4}Z`;
    const poly = cachePts(k + "torsoP", () => polyPts(inkPathPts(d)));
    wash(ctx, poly, { key: k + "torso", color: o.shirt, p: tq, alpha: 0.95, layers: 12, spread: 0.02, oy: sL[1] });
    inkPath(ctx, d, { w: 2.6, p: tq, wobble: 0.8 });
    if (o.apron) {
      const ad = `M${hL[0] - 4} ${hL[1] - 40} L${hR[0] + 4} ${hR[1] - 40} L${hR[0] + 10} ${hR[1] + 30} L${hL[0] - 10} ${hL[1] + 30}Z`;
      wash(ctx, cachePts(k + "apronP", () => inkPathPts(ad)), { key: k + "apron", color: o.apron, p: tq, alpha: 0.9, layers: 8, spread: 0.02 });
      inkPath(ctx, ad, { w: 2, p: tq });
    }
  }
  // arms
  capsule(ctx, k + "armL", J.armL, armW, o.shirt, sub(p, 0.42, 0.56));
  capsule(ctx, k + "armR", J.armR, armW, o.shirt, sub(p, 0.46, 0.6));
  for (const [arm, a] of [[J.armL, 0.56], [J.armR, 0.6]]) {
    const q = sub(p, a, a + 0.06);
    if (q > 0) {
      const h = arm[arm.length - 1];
      wash(ctx, cachePts(k + "hand" + h, () => blobPoly(h[0], h[1] + 5, 10, 10, 12, 5, 0.05)), { key: k + "hand" + h, color: o.skin, p: q, layers: 6, spread: 0.02 });
      loop(ctx, h[0], h[1] + 5, 10, { w: 2, p: q, over: 0.05 });
    }
  }
  if (J.phone) {
    const q = sub(p, 0.62, 0.7);
    if (q > 0) {
      const [px, py] = J.phone;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-0.25);
      wash(ctx, [[-16, -26], [16, -26], [16, 26], [-16, 26]], { key: k + "ph", color: C.ink, p: q, alpha: 0.85, layers: 6, spread: 0.01 });
      wash(ctx, [[-11, -19], [11, -19], [11, 19], [-11, 19]], { key: k + "phs", color: C.markLeaf, p: q, alpha: 0.9, layers: 6, spread: 0.01 });
      ctx.restore();
    }
  }
  // neck + head
  const hq = sub(p, 0.62, 0.8);
  const [hx, hy] = J.head;
  if (hq > 0) {
    capsule(ctx, k + "neck", [J.neck, [J.neck[0], J.neck[1] + 12]], 16, o.skin, hq, { cap: false, lw: 1.6 });
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(J.tilt || 0);
    const R = 29;
    wash(ctx, cachePts(k + "headP", () => blobPoly(0, 0, R, R * 1.05, 24, 7, 0.03)), { key: k + "head", color: o.skin, p: hq, layers: 12, spread: 0.02 });
    loop(ctx, 0, 0, R, { ry: R * 1.05, w: 2.6, p: hq, start: -1.3 });
    ctx.restore();
  }
  const fq = sub(p, 0.78, 1);
  if (fq > 0) {
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(J.tilt || 0);
    hair(ctx, k, o.hair || "short", o.hairColor || C.hair1, fq);
    // face — looking slightly toward +x
    const blink = o.t !== undefined && ((o.t + (o.blinkOff || 0)) % 3.7) < 0.12;
    const ey = -2;
    ctx.fillStyle = C.ink;
    ctx.globalAlpha *= fq;
    for (const ex of [4, 18]) {
      ctx.beginPath();
      if (blink) ctx.ellipse(ex, ey, 3.2, 0.9, 0, 0, Math.PI * 2);
      else ctx.ellipse(ex, ey, 2.6, 3.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // blush
    wash(ctx, cachePts(k + "blush", () => blobPoly(22, 9, 6, 4, 10, 2, 0.1)), { key: k + "blush", color: "#e27d6a", alpha: 0.5, layers: 6, spread: 0.05 });
    // mouth
    if (o.face === "wonder") loop(ctx, 13, 13, 3.2, { w: 1.8, over: 0.05, sound: false });
    else ink(ctx, cachePts("smile", () => circlePts(12, 6, 8, 10, 0.5, 1.9)), { w: 2, wobble: 0.3, sound: false });
    if (o.glasses) {
      loop(ctx, 4, -2, 8, { w: 1.8, sound: false });
      loop(ctx, 20, -2, 8, { w: 1.8, sound: false });
    }
    ctx.restore();
  }
  ctx.restore();
}
function inkPathPts(d) {
  // polygon from an SVG path (first subpath)
  return parsePathLocal(d);
}
import { parsePath } from "./engine.js";
function parsePathLocal(d) { return parsePath(d, 5)[0]; }

function hair(ctx, k, style, color, q) {
  const shapes = {
    short: "M-29 -4 C-33 -30 -6 -44 14 -36 C28 -32 34 -18 30 -8 C22 -20 6 -24 -8 -18 C-14 -12 -20 -4 -29 -4Z",
    curly: "M-31 2 C-40 -14 -30 -34 -18 -36 C-12 -46 6 -48 14 -40 C26 -42 38 -30 32 -14 C26 -22 12 -26 -2 -22 C-12 -16 -20 -6 -31 2Z",
    bun: "M-29 -2 C-31 -28 -8 -40 12 -34 C26 -30 32 -18 30 -10 C20 -22 2 -24 -10 -18 C-18 -12 -22 -6 -29 -2Z",
    long: "M-30 34 C-40 0 -30 -34 -4 -38 C20 -40 34 -26 30 -8 C22 -20 6 -24 -8 -18 C-16 -8 -18 16 -22 38Z",
  };
  const d = shapes[style];
  const poly = cachePts(k + "hairP", () => parsePath(d, 4)[0]);
  wash(ctx, poly, { key: k + "hair", color, p: q, alpha: 0.95, layers: 10, spread: 0.02 });
  inkPath(ctx, d, { w: 2.3, p: q, wobble: 0.6 });
  if (style === "bun") {
    const b = cachePts(k + "bunP", () => blobPoly(-26, -30, 12, 11, 12, 4, 0.05));
    wash(ctx, b, { key: k + "bun", color, p: q, alpha: 0.95, layers: 6, spread: 0.02 });
    loop(ctx, -26, -30, 12, { ry: 11, w: 2.2, p: q, sound: false });
  }
}

// ---------------------------------------------------------------- caterpillar
/** A green caterpillar along a gentle curve. phase animates the inch-worm crawl. */
export function caterpillar(ctx, x, y, s, key, p, phase = 0, o = {}) {
  if (p <= 0) return;
  const n = o.segments ?? 9;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  const segs = [];
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);
    const hump = Math.max(0, Math.sin(phase * 2 * Math.PI - f * 3)) * 8;
    segs.push([f * 120 - 60, -Math.sin(f * Math.PI) * 6 - hump]);
  }
  const shown = Math.ceil(n * p);
  for (let i = 0; i < shown; i++) {
    const [sx, sy] = segs[i];
    const r = i === n - 1 ? 13 : 11.5;
    const col = i === n - 1 ? (o.head || "#5d8a2e") : (o.color || "#8cc152");
    ctx.save();
    ctx.globalAlpha *= 0.95;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(sx, sy - 11, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ink(ctx, cachePts(`cs${r}`, () => circlePts(0, 0, r, 18, -2, Math.PI * 2.1)).map(([a, b]) => [a + sx, b + sy - 11]), { w: 1.8, wobble: 0.3, sound: false, seed: i + 1 });
    // little legs
    if (i < n - 1) {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(sx, sy - 1); ctx.lineTo(sx + 1, sy + 4); ctx.stroke();
    }
    if (o.stripes && i < n - 1 && i % 1 === 0) {
      ctx.save(); ctx.strokeStyle = "#1b1b1b"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx - 3, sy - 20); ctx.lineTo(sx - 3, sy - 3); ctx.stroke();
      ctx.strokeStyle = "#f2d33b"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(sx + 3, sy - 20); ctx.lineTo(sx + 3, sy - 3); ctx.stroke();
      ctx.restore();
    }
  }
  if (shown >= n) {
    const [hx, hy] = segs[n - 1];
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.arc(hx + 5, hy - 14, 2.6, 0, Math.PI * 2); ctx.fill();
    if (o.munch !== undefined) {
      const m = Math.abs(Math.sin(o.munch * Math.PI * 2));
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(hx + 11, hy - 8); ctx.lineTo(hx + 13 + m * 3, hy - 5 + m * 2); ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- chickadee
// Black-capped chickadee, facing left. Origin at the feet. ~230 wide at s=1.
const BIRD = {
  body: "M-60 -86 C-78 -120 -58 -160 -18 -164 C18 -168 52 -150 70 -122 C92 -108 132 -94 176 -98 C150 -76 118 -66 86 -62 C60 -34 20 -26 -10 -34 C-40 -42 -54 -60 -60 -86Z",
  cap: "M-70 -120 C-66 -150 -40 -166 -12 -164 C10 -163 26 -154 30 -142 C10 -140 -8 -136 -24 -130 C-40 -126 -58 -122 -70 -120Z",
  cheek: "M-66 -114 C-50 -122 -20 -130 12 -134 C22 -122 16 -104 0 -98 C-22 -94 -46 -98 -62 -104Z",
  bib: "M-62 -104 C-54 -94 -44 -84 -30 -80 C-34 -92 -40 -100 -44 -102 C-50 -102 -56 -104 -62 -104Z",
  wing: "M-6 -118 C28 -128 64 -124 92 -104 C112 -92 134 -84 158 -84 C124 -70 86 -66 50 -70 C22 -74 0 -90 -6 -118Z",
  flank: "M-40 -60 C-20 -44 10 -38 40 -46 C58 -52 72 -60 80 -66 C56 -64 30 -60 6 -62 C-14 -62 -30 -62 -40 -60Z",
  beak: "M-72 -120 L-94 -114 L-72 -108",
  legs: "M-6 -34 L-12 -2 M10 -34 L14 -2",
  wingLines: "M40 -110 C70 -104 96 -94 120 -88 M30 -98 C60 -92 84 -84 110 -80",
};
export function chickadee(ctx, x, y, s, key, p, o = {}) {
  if (p <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  if (o.rot) ctx.rotate(o.rot);
  const q = (a, b) => sub(p, a, b);
  const pp = (name) => cachePts(key + name, () => parsePath(BIRD[name], 5)[0]);
  const col = o.colors || { body: "#b9b6ac", flank: "#e2b98a", wing: "#6f7470" };
  key += col.body;
  wash(ctx, pp("body"), { key: key + "body", color: col.body, p: q(0.1, 0.45), alpha: 0.75, layers: 12, spread: 0.04 });
  wash(ctx, pp("flank"), { key: key + "flank", color: col.flank, p: q(0.3, 0.6), alpha: 0.8, layers: 8, spread: 0.05 });
  wash(ctx, pp("wing"), { key: key + "wing", color: col.wing, p: q(0.3, 0.6), alpha: 0.8, layers: 10, spread: 0.04 });
  wash(ctx, pp("cheek"), { key: key + "cheek", color: "#fbfaf4", p: q(0.35, 0.6), alpha: 1, layers: 8, spread: 0.02 });
  wash(ctx, pp("cap"), { key: key + "cap", color: "#1c1c1a", p: q(0.3, 0.6), alpha: 0.95, layers: 10, spread: 0.02 });
  wash(ctx, pp("bib"), { key: key + "bib", color: "#1c1c1a", p: q(0.35, 0.6), alpha: 0.95, layers: 8, spread: 0.02 });
  if (col.belly) {
    // a great tit's black stripe from the bib down the belly
    const stripe = cachePts(key + "stripe", () => parsePath("M-50 -100 C-40 -80 -24 -62 4 -46 C10 -44 14 -42 16 -38 C-10 -40 -34 -56 -46 -76 C-50 -86 -52 -94 -50 -100 Z", 4)[0]);
    wash(ctx, stripe, { key: key + "stripe", color: col.belly, p: q(0.35, 0.6), alpha: 0.95, layers: 8, spread: 0.02 });
  }
  inkPath(ctx, BIRD.body, { w: 3, p: q(0, 0.4) });
  inkPath(ctx, BIRD.wing, { w: 2.4, p: q(0.25, 0.55) });
  inkPath(ctx, BIRD.wingLines, { w: 1.8, p: q(0.4, 0.6) });
  inkPath(ctx, BIRD.beak, { w: 3, p: q(0.4, 0.5) });
  inkPath(ctx, BIRD.legs, { w: 3, p: q(0.45, 0.6) });
  const e = q(0.55, 0.65);
  if (e > 0) {
    ctx.fillStyle = "#fff"; ctx.globalAlpha *= e;
    ctx.beginPath(); ctx.arc(-44, -132, 5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(-45, -132, 4, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-46.5, -133.5, 1.3, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- monarch
export function monarch(ctx, x, y, s, key, flap, o = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(o.rot || 0);
  ctx.scale(s, s);
  const open = 0.25 + 0.75 * Math.abs(Math.cos(flap * Math.PI));
  const fw = "M0 0 C-10 -30 -40 -58 -76 -54 C-86 -40 -70 -12 -44 4 C-28 12 -10 8 0 0Z";
  const hw = "M0 2 C-24 8 -50 22 -52 44 C-40 56 -16 44 -4 26 C0 16 2 8 0 2Z";
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.scale(side * open, 1);
    for (const [d, n] of [[fw, "f"], [hw, "h"]]) {
      const poly = cachePts("mon" + n, () => parsePath(d, 4)[0]);
      wash(ctx, poly, { key: "monw" + n, color: C.monarch, alpha: 1, layers: 8, spread: 0.02, edge: false });
      inkPath(ctx, d, { w: 5, wobble: 0.3, sound: false, color: "#1c1712" });
    }
    // veins
    inkPath(ctx, "M-4 -2 C-20 -20 -40 -36 -66 -48 M-6 2 C-24 -6 -44 -12 -60 -20 M-2 6 C-16 18 -30 30 -42 40", { w: 1.8, wobble: 0.2, sound: false, color: "#1c1712" });
    // white spots on the black border
    ctx.fillStyle = "#fff";
    for (const [sx, sy] of [[-70, -48], [-78, -38], [-60, -54], [-46, 42], [-36, 48]]) { ctx.beginPath(); ctx.arc(sx, sy, 2, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  // body
  ctx.fillStyle = "#1c1712";
  ctx.beginPath(); ctx.ellipse(0, 6, 4.5, 24, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -20, 6, 0, 7); ctx.fill();
  ctx.strokeStyle = "#1c1712"; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-2, -24); ctx.quadraticCurveTo(-8, -40, -14, -44); ctx.moveTo(2, -24); ctx.quadraticCurveTo(8, -40, 14, -44); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- bee
export function bee(ctx, x, y, s, t, o = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(o.rot || 0);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  const f = Math.sin(t * 90);
  // wings
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(-2, -14 - f * 2, 9, 13, -0.5 + f * 0.25, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(6, -13 - f * 2, 7, 11, 0.3 - f * 0.25, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#f2b632";
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 11, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 16, 11, 0, 0, 7); ctx.clip();
  ctx.fillStyle = "#1c1712";
  for (const sx of [-8, 0, 8]) ctx.fillRect(sx - 2.2, -12, 4.4, 24);
  ctx.restore();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, 16, 11, 0, 0, 7); ctx.stroke();
  ctx.fillStyle = "#1c1712"; ctx.beginPath(); ctx.arc(-17, -1, 6, 0, 7); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- plants
/** Purple coneflower: stem, leaves, drooping rays, domed cone. base at (x,y) */
export function coneflower(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.03);
  const stem = `M0 0 C4 ${-h * 0.35} -4 ${-h * 0.7} 0 ${-h}`;
  inkPath(ctx, stem, { w: 2.6, p: sub(p, 0, 0.5), color: C.brandInk });
  const lq = sub(p, 0.3, 0.6);
  if (lq > 0) {
    for (const [ly, dir] of [[-h * 0.25, -1], [-h * 0.45, 1]]) {
      const d = `M0 ${ly} C${dir * 18} ${ly - 18} ${dir * 42} ${ly - 14} ${dir * 52} ${ly - 30} C${dir * 36} ${ly - 4} ${dir * 16} ${ly + 2} 0 ${ly}Z`;
      wash(ctx, cachePts(key + "l" + ly, () => parsePath(d, 4)[0]), { key: key + "l" + ly, color: "#5f9a4a", p: lq, alpha: 0.9, layers: 6, spread: 0.03 });
      inkPath(ctx, d, { w: 1.8, p: lq, color: C.brandInk });
    }
  }
  const fq = sub(p, 0.55, 1);
  if (fq > 0) {
    ctx.save(); ctx.translate(0, -h);
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (0.05 + (i / 8) * 0.9);
      const len = 30 * fq;
      const ex = Math.cos(a) * len, ey = Math.sin(a) * len * 0.8 + 6;
      ctx.save();
      ctx.strokeStyle = "#b0569e"; ctx.globalAlpha = 0.95; ctx.lineWidth = 8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(ex * 0.6, ey * 0.2, ex, ey); ctx.stroke();
      ctx.restore();
    }
    wash(ctx, cachePts(key + "cone", () => blobPoly(0, -4, 13, 11, 12, 3, 0.08)), { key: key + "cone", color: "#b8641c", p: fq, alpha: 1, layers: 8, spread: 0.03 });
    loop(ctx, 0, -4, 13, { ry: 11, w: 2, p: fq, sound: false });
    ctx.restore();
  }
  ctx.restore();
}
/** Goldenrod: arching plume of yellow florets */
export function goldenrod(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.03);
  inkPath(ctx, `M0 0 C2 ${-h * 0.4} 0 ${-h * 0.8} 10 ${-h}`, { w: 2.6, p: sub(p, 0, 0.45), color: C.brandInk });
  for (let i = 0; i < 5; i++) {
    const ly = -h * (0.15 + i * 0.14), dir = i % 2 ? 1 : -1;
    const lq = sub(p, 0.2 + i * 0.06, 0.4 + i * 0.06);
    if (lq > 0) inkPath(ctx, `M0 ${ly} Q${dir * 14} ${ly - 10} ${dir * 30} ${ly - 8}`, { w: 3, p: lq, color: "#4f8a3a" });
  }
  const fq = sub(p, 0.5, 1);
  if (fq > 0) {
    const r = (k) => noise1(hashKey(key) + k, k * 1.7);
    for (let i = 0; i < 26; i++) {
      const f = i / 25;
      if (f > fq) break;
      const bx = 10 + Math.sin(f * 2.2) * 26 + (r(i) - 0.5) * 16, by = -h - f * h * 0.22 + (r(i + 50) - 0.5) * 12 + f * f * 30;
      ctx.fillStyle = i % 3 ? "#f2b92c" : "#e39b16";
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.arc(bx, by, 5 + r(i + 9) * 3, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function hashKey(k) { let h = 7; for (const c of k) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; }
/** New England aster: bushy clump with lavender daisies */
export function aster(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.02);
  for (let i = 0; i < 4; i++) {
    const a = -0.35 + i * 0.23;
    const q = sub(p, i * 0.08, 0.5 + i * 0.08);
    const ex = Math.sin(a) * h, ey = -Math.cos(a) * h;
    inkPath(ctx, `M0 0 Q${ex * 0.3} ${ey * 0.6} ${ex} ${ey}`, { w: 2.2, p: q, color: C.brandInk });
  }
  const fq = sub(p, 0.5, 1);
  if (fq > 0) {
    for (let i = 0; i < 9; i++) {
      const a = -0.5 + (i / 8) * 1.0;
      const fx = Math.sin(a) * h * (0.8 + (i % 2) * 0.2), fy = -Math.cos(a) * h * (0.85 + (i % 3) * 0.08);
      const s = fq * (0.8 + (i % 3) * 0.15);
      ctx.save(); ctx.translate(fx, fy); ctx.scale(s, s);
      ctx.fillStyle = "#8f78c9";
      for (let j = 0; j < 12; j++) {
        ctx.save(); ctx.rotate((j / 12) * Math.PI * 2);
        ctx.beginPath(); ctx.ellipse(0, -9, 2.6, 8, 0, 0, 7); ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "#f2b92c"; ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, 7); ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}
/** Swamp milkweed: tall stem, lance leaves, pink umbels (monarch host) */
export function milkweed(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.025);
  inkPath(ctx, `M0 0 C-3 ${-h * 0.4} 3 ${-h * 0.8} 0 ${-h}`, { w: 2.8, p: sub(p, 0, 0.45), color: C.brandInk });
  for (let i = 0; i < 4; i++) {
    const ly = -h * (0.2 + i * 0.17);
    const lq = sub(p, 0.25 + i * 0.06, 0.5 + i * 0.06);
    for (const dir of [-1, 1]) {
      const d = `M0 ${ly} C${dir * 14} ${ly - 14} ${dir * 36} ${ly - 20} ${dir * 50} ${ly - 30} C${dir * 30} ${ly - 8} ${dir * 12} ${ly + 2} 0 ${ly}Z`;
      if (lq > 0) {
        wash(ctx, cachePts(key + "l" + i + dir, () => parsePath(d, 4)[0]), { key: key + "l" + i + dir, color: "#5f9a4a", p: lq, alpha: 0.9, layers: 6, spread: 0.03 });
        inkPath(ctx, d, { w: 1.7, p: lq, color: C.brandInk });
      }
    }
  }
  const fq = sub(p, 0.55, 1);
  if (fq > 0) {
    for (const [ux, uy] of [[-14, -h - 4], [12, -h - 10], [0, -h - 20]]) {
      for (let j = 0; j < 9; j++) {
        const a = (j / 9) * Math.PI * 2;
        const bx = ux + Math.cos(a) * 10 * fq, by = uy + Math.sin(a) * 7 * fq;
        ctx.fillStyle = j % 2 ? "#d9669b" : "#c94f86";
        ctx.beginPath(); ctx.arc(bx, by, 4.2 * fq, 0, 7); ctx.fill();
      }
    }
  }
  ctx.restore();
}
/** Little bluestem tuft */
export function grassTuft(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y);
  for (let i = 0; i < 7; i++) {
    const a = -0.5 + (i / 6) * 1.0 + sway * 0.02;
    const q = sub(p, i * 0.05, 0.6 + i * 0.05);
    const ex = Math.sin(a) * h * (0.8 + (i % 2) * 0.25), ey = -Math.cos(a) * h * (0.8 + (i % 3) * 0.12);
    inkPath(ctx, `M${(i - 3) * 2} 0 Q${ex * 0.2} ${ey * 0.6} ${ex} ${ey}`, { w: 3.2, p: q, color: i % 2 ? "#7d8f6a" : "#a0785a" });
  }
  ctx.restore();
}
/** A small native tree drawn in the notebook style (used for serviceberry). hPx/spreadPx in px */
export function tree(ctx, x, y, hPx, spreadPx, key, p, o = {}) {
  if (p <= 0 || hPx <= 0) return;
  ctx.save(); ctx.translate(x, y);
  const trunkH = hPx * 0.42;
  const cw = Math.max(spreadPx, 8) / 2, ch = hPx - trunkH * 0.75;
  const cy = -hPx + ch / 2;
  const tq = sub(p, 0, 0.4);
  inkPath(ctx, `M-${Math.max(1.5, cw * 0.06)} 0 C-${cw * 0.05} ${-trunkH * 0.5} -${cw * 0.04} ${-trunkH * 0.8} -${cw * 0.12} ${-trunkH * 1.1}`, { w: Math.max(1.6, hPx * 0.012), p: tq, color: C.bark });
  inkPath(ctx, `M${Math.max(1.5, cw * 0.06)} 0 C${cw * 0.05} ${-trunkH * 0.5} ${cw * 0.06} ${-trunkH * 0.8} ${cw * 0.16} ${-trunkH * 1.05}`, { w: Math.max(1.6, hPx * 0.012), p: tq, color: C.bark });
  const cq = sub(p, 0.3, 1);
  if (cq > 0) {
    const poly = cachePts(key + "crown", () => blobPoly(0, cy, cw, ch / 2, 22, hashKey(key), 0.14));
    wash(ctx, poly, { key: key + "crown", color: o.leaf || "#6aa84f", p: cq, alpha: 0.85, layers: 14, spread: 0.06, oy: 0 });
    // scalloped crown outline
    const outline = cachePts(key + "crownL", () => {
      const pts = [];
      const n = 11;
      for (let i = 0; i <= n; i++) {
        const a0 = Math.PI * 0.95 + (i / n) * Math.PI * 1.1 * 2 * 0.5 * 2;
        pts.push(a0);
      }
      const out = [];
      for (let k = 0; k <= 120; k++) {
        const a = Math.PI * 0.5 + (k / 120) * Math.PI * 2;
        const bump = 1 + 0.07 * Math.abs(Math.sin(k / 120 * Math.PI * 9));
        out.push([Math.cos(a) * cw * bump, cy + Math.sin(a) * (ch / 2) * bump]);
      }
      return out;
    });
    ink(ctx, outline, { w: Math.max(1.4, Math.min(3, hPx * 0.01)), p: cq, color: C.brandInk });
    if (o.blossom && cq > 0.6) {
      const bq = (cq - 0.6) / 0.4;
      const r = (i) => noise1(hashKey(key) + i, i * 1.3);
      const nb = Math.round(Math.min(46, Math.max(4, cw * ch / 300)));
      for (let i = 0; i < nb * bq; i++) {
        const a = r(i) * Math.PI * 2, rr = Math.sqrt(r(i + 100)) * 0.85;
        const bx = Math.cos(a) * cw * rr, by = cy + Math.sin(a) * (ch / 2) * rr;
        ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.95;
        ctx.beginPath(); ctx.arc(bx, by, Math.max(1.6, hPx * 0.012), 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
}
/** Seedling (two leaves) — the app's mark in miniature */
export function seedling(ctx, x, y, s, key, p) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  inkPath(ctx, "M0 0 C0 -14 -3 -22 0 -34", { w: 3, p: sub(p, 0, 0.5), color: C.brandInk });
  const lq = sub(p, 0.4, 1);
  const R = "M0 -34 C6 -44 18 -50 30 -50 C28 -38 16 -30 0 -34Z";
  const L = "M0 -26 C-6 -34 -16 -38 -26 -36 C-22 -26 -12 -22 0 -26Z";
  for (const [d, n] of [[R, "r"], [L, "l"]]) {
    wash(ctx, cachePts(key + n, () => parsePath(d, 3)[0]), { key: key + n, color: "#7cc28b", p: lq, alpha: 1, layers: 6, spread: 0.02 });
    inkPath(ctx, d, { w: 2, p: lq, color: C.brandInk });
  }
  ctx.restore();
}

// ================================================================ more natives
// Each draws itself on at progress p from a base at (x, y), h tall, swaying.
const leafPair = (ctx, key, ly, dir, len, p, col = "#5f9a4a", w = 12) => {
  const d = `M0 ${ly} C${dir * len * 0.3} ${ly - w} ${dir * len * 0.75} ${ly - w * 1.1} ${dir * len} ${ly - w * 1.9} C${dir * len * 0.6} ${ly - w * 0.2} ${dir * len * 0.25} ${ly + 2} 0 ${ly}Z`;
  wash(ctx, cachePts(key + "l" + ly + dir, () => parsePath(d, 4)[0]), { key: key + "l" + ly + dir, color: col, p, alpha: 0.9, layers: 6, spread: 0.03 });
  inkPath(ctx, d, { w: 1.6, p, color: C.brandInk });
};
const stem = (ctx, h, p, bend = 4, w = 2.6) => inkPath(ctx, `M0 0 C${bend} ${-h * 0.35} ${-bend} ${-h * 0.7} 0 ${-h}`, { w, p, color: C.brandInk });

/** Black-eyed Susan: golden rays around a dark brown cone */
export function blackEyedSusan(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.03);
  stem(ctx, h, sub(p, 0, 0.45));
  inkPath(ctx, `M0 ${-h * 0.55} C12 ${-h * 0.7} 20 ${-h * 0.78} 30 ${-h * 0.82}`, { w: 2.2, p: sub(p, 0.25, 0.5), color: C.brandInk });
  leafPair(ctx, key, -h * 0.25, -1, 40, sub(p, 0.3, 0.6));
  leafPair(ctx, key, -h * 0.4, 1, 36, sub(p, 0.35, 0.65));
  const fq = sub(p, 0.55, 1);
  for (const [fx, fy, s] of [[0, -h, 1], [30, -h * 0.82, 0.8]]) {
    if (fq <= 0) break;
    ctx.save(); ctx.translate(fx, fy); ctx.scale(s * fq, s * fq);
    for (let i = 0; i < 13; i++) {
      ctx.save(); ctx.rotate((i / 13) * Math.PI * 2 + 0.2);
      ctx.fillStyle = i % 2 ? "#f2b01e" : "#e9a114";
      ctx.beginPath(); ctx.ellipse(0, -17, 5.2, 13, 0, 0, 7); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#3b2415"; ctx.beginPath(); ctx.arc(0, 0, 8.5, 0, 7); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
/** Butterfly weed: bushy, narrow leaves, flat-topped bright orange clusters (a monarch host) */
export function butterflyWeed(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.025);
  const tops = [[-26, -h * 0.88], [4, -h], [30, -h * 0.9]];
  tops.forEach(([tx, ty], i) => {
    const q = sub(p, i * 0.08, 0.5 + i * 0.08);
    inkPath(ctx, `M${(i - 1) * 3} 0 Q${tx * 0.3} ${ty * 0.5} ${tx} ${ty}`, { w: 2.4, p: q, color: C.brandInk });
    for (let k = 1; k < 4; k++) {
      const f = k / 4, lx = tx * f * 0.8, ly = ty * f;
      if (q > f) inkPath(ctx, `M${lx} ${ly} q${(k % 2 ? 1 : -1) * 16} -4 ${(k % 2 ? 1 : -1) * 28} -12`, { w: 4, p: sub(q, f, 1), color: "#4f8a3a" });
    }
  });
  const fq = sub(p, 0.55, 1);
  if (fq > 0) tops.forEach(([tx, ty], i) => {
    for (let j = 0; j < 14; j++) {
      const a = (j / 14) * Math.PI * 2, rr = j % 2 ? 13 : 7;
      ctx.fillStyle = j % 3 ? "#f07c1b" : "#f59a2e";
      ctx.beginPath(); ctx.arc(tx + Math.cos(a) * rr * fq, ty - 4 + Math.sin(a) * rr * 0.45 * fq, 4.6 * fq, 0, 7); ctx.fill();
    }
  });
  ctx.restore();
}
/** Cardinal flower: an upright stem ending in a spike of scarlet tubular blooms */
export function cardinalFlower(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.02);
  stem(ctx, h, sub(p, 0, 0.45), 2);
  for (let i = 0; i < 3; i++) leafPair(ctx, key, -h * (0.12 + i * 0.13), i % 2 ? 1 : -1, 30, sub(p, 0.2 + i * 0.06, 0.5 + i * 0.06), "#4e7f3c", 8);
  const fq = sub(p, 0.5, 1);
  for (let i = 0; i < 9; i++) {
    const f = i / 8;
    if (f > fq) break;
    const fy = -h * (0.55 + f * 0.45), dir = i % 2 ? 1 : -1, s = 1 - f * 0.35;
    ctx.save(); ctx.translate(0, fy); ctx.rotate(dir * 0.9); ctx.scale(s, s);
    ctx.fillStyle = "#c8102e";
    ctx.beginPath(); ctx.ellipse(0, -11, 3.6, 12, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-7, -27); ctx.lineTo(0, -23); ctx.lineTo(7, -27); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
/** Wild bergamot (and devil's-bit scabious): a pompom of lavender tubular florets */
export function pompom(ctx, x, y, h, key, p, sway = 0, o = {}) {
  if (p <= 0) return;
  const col = o.color || "#b58ac9", col2 = o.color2 || "#9a6fb4";
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.025);
  const heads = o.heads || [[0, -h, 1], [-24, -h * 0.8, 0.8]];
  heads.forEach(([hx, hy], i) => inkPath(ctx, `M${i * 3} 0 Q${hx * 0.4} ${hy * 0.55} ${hx} ${hy}`, { w: o.wiry ? 1.8 : 2.4, p: sub(p, i * 0.1, 0.5 + i * 0.1), color: C.brandInk }));
  if (!o.wiry) { leafPair(ctx, key, -h * 0.3, 1, 30, sub(p, 0.3, 0.6)); leafPair(ctx, key, -h * 0.3, -1, 30, sub(p, 0.32, 0.62)); }
  else leafPair(ctx, key, -h * 0.12, 1, 36, sub(p, 0.3, 0.6), "#5f8f4a", 7);
  const fq = sub(p, 0.55, 1);
  if (fq > 0) heads.forEach(([hx, hy, s]) => {
    ctx.save(); ctx.translate(hx, hy); ctx.scale(s * fq, s * fq);
    if (o.round) {
      for (let j = 0; j < 22; j++) {
        const a = (j / 22) * Math.PI * 2, rr = j % 2 ? 11 : 5;
        ctx.fillStyle = j % 3 ? col : col2;
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr * 0.85 - 4, 5, 0, 7); ctx.fill();
      }
    } else {
      for (let j = 0; j < 11; j++) {
        const a = -Math.PI * (0.05 + (j / 10) * 0.9);
        ctx.strokeStyle = j % 2 ? col : col2; ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6 - 2); ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 17 - 4); ctx.stroke();
      }
      ctx.fillStyle = "#8a9a5b"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill();
    }
    ctx.restore();
  });
  ctx.restore();
}
/** Foxglove (digitale pourpre): a tall one-sided spike of hanging pink bells */
export function foxglove(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.02);
  // basal rosette
  for (const dir of [-1, 1]) leafPair(ctx, key, -4, dir, 46, sub(p, 0.05, 0.35), "#5a8c47", 14);
  stem(ctx, h, sub(p, 0.1, 0.5), 2);
  const fq = sub(p, 0.45, 1);
  for (let i = 0; i < 11; i++) {
    const f = i / 10;
    if (f > fq) break;
    const fy = -h * (0.42 + f * 0.56), s = 1.45 - f * 0.7;
    ctx.save(); ctx.translate(3, fy); ctx.rotate(0.5); ctx.scale(s, s);
    ctx.fillStyle = "#c2569a";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(16, -4, 26, 6); ctx.quadraticCurveTo(28, 20, 16, 20); ctx.quadraticCurveTo(6, 14, 0, 0); ctx.fill();
    ctx.fillStyle = "#f3d6e6"; ctx.beginPath(); ctx.ellipse(21, 15, 5, 3.5, 0.6, 0, 7); ctx.fill();
    ctx.fillStyle = "#7a2356"; for (const [sx, sy] of [[19, 13], [22, 16], [18, 16]]) { ctx.beginPath(); ctx.arc(sx, sy, 0.9, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}
/** Common knapweed (centaurée noire): hard dark knobs crowned with purple tufts */
export function knapweed(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.025);
  const heads = [[0, -h], [-22, -h * 0.82], [20, -h * 0.76]];
  heads.forEach(([hx, hy], i) => inkPath(ctx, `M${i} 0 Q${hx * 0.3} ${hy * 0.5} ${hx} ${hy}`, { w: 2.2, p: sub(p, i * 0.08, 0.5 + i * 0.08), color: C.brandInk }));
  leafPair(ctx, key, -h * 0.28, -1, 32, sub(p, 0.3, 0.6), "#5f8f4a", 8);
  leafPair(ctx, key, -h * 0.42, 1, 28, sub(p, 0.34, 0.64), "#5f8f4a", 8);
  const fq = sub(p, 0.55, 1);
  if (fq > 0) heads.forEach(([hx, hy]) => {
    ctx.save(); ctx.translate(hx, hy); ctx.scale(fq, fq);
    ctx.strokeStyle = "#8e4a9e"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    for (let j = 0; j < 13; j++) {
      const a = -Math.PI * (0.08 + (j / 12) * 0.84);
      ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 15 - 6); ctx.stroke();
    }
    ctx.fillStyle = "#5b3a24"; ctx.beginPath(); ctx.ellipse(0, 0, 8, 9, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = "#2e1d12"; ctx.lineWidth = 1; for (let k = -4; k <= 4; k += 4) { ctx.beginPath(); ctx.moveTo(k - 3, -6); ctx.lineTo(k + 3, 6); ctx.stroke(); }
    ctx.restore();
  });
  ctx.restore();
}
/** Bird's-foot trefoil (lotier corniculé): low sprawl of yellow pea-flowers tipped red */
export function trefoil(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y);
  const tips = [[-34, -h * 0.7], [-8, -h], [22, -h * 0.85], [40, -h * 0.55]];
  tips.forEach(([tx, ty], i) => inkPath(ctx, `M0 0 Q${tx * 0.6} ${ty * 0.2} ${tx} ${ty}`, { w: 2, p: sub(p, i * 0.06, 0.45 + i * 0.06), color: C.brandInk }));
  const fq = sub(p, 0.5, 1);
  if (fq > 0) tips.forEach(([tx, ty], i) => {
    for (let j = 0; j < 5; j++) {
      const a = -Math.PI * (0.15 + (j / 4) * 0.7);
      ctx.save(); ctx.translate(tx + Math.cos(a) * 9 * fq, ty + Math.sin(a) * 8 * fq); ctx.rotate(a + Math.PI / 2); ctx.scale(fq, fq);
      ctx.fillStyle = "#f5c21b"; ctx.beginPath(); ctx.ellipse(0, 0, 5, 7.5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#d9541e"; ctx.beginPath(); ctx.ellipse(0, -5, 3.2, 2.6, 0, 0, 7); ctx.fill();
      ctx.restore();
    }
  });
  ctx.restore();
}
/** Red clover (trèfle des prés): three-part leaves and round pink heads */
export function redClover(ctx, x, y, h, key, p, sway = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway * 0.02);
  const heads = [[-12, -h * 0.85], [14, -h]];
  heads.forEach(([hx, hy], i) => inkPath(ctx, `M${i * 4} 0 Q${hx * 0.5} ${hy * 0.5} ${hx} ${hy}`, { w: 2.2, p: sub(p, i * 0.1, 0.5 + i * 0.1), color: C.brandInk }));
  const lq = sub(p, 0.3, 0.6);
  if (lq > 0) for (const [lx, ly] of [[-26, -h * 0.35], [26, -h * 0.5]]) {
    for (let k = 0; k < 3; k++) {
      const a = -Math.PI / 2 + (k - 1) * 0.9;
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(a); ctx.scale(lq, lq);
      ctx.fillStyle = "#5f9a4a"; ctx.beginPath(); ctx.ellipse(0, -9, 5.5, 9, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = "#e8efe0"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, -8, 3.5, 0.3, 2.8); ctx.stroke();
      ctx.restore();
    }
  }
  const fq = sub(p, 0.55, 1);
  if (fq > 0) heads.forEach(([hx, hy]) => {
    for (let j = 0; j < 20; j++) {
      const a = (j / 20) * Math.PI * 2, rr = j % 2 ? 9 : 4;
      ctx.fillStyle = j % 3 ? "#c75b8f" : "#e08ab2";
      ctx.beginPath(); ctx.ellipse(hx + Math.cos(a) * rr * fq, hy - 6 + Math.sin(a) * rr * fq, 3.2 * fq, 5 * fq, a, 0, 7); ctx.fill();
    }
  });
  ctx.restore();
}

// ================================================================ more butterflies
/** Brimstone (Citron): sulphur-yellow, leaf-shaped wings with an orange dot */
export function brimstone(ctx, x, y, s, key, flap, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const open = 0.25 + 0.75 * Math.abs(Math.cos(flap * Math.PI));
  const fw = "M0 0 C-8 -28 -34 -52 -70 -56 C-72 -34 -60 -10 -36 4 C-22 10 -8 6 0 0Z";
  const hw = "M0 2 C-22 6 -48 18 -58 40 C-44 54 -18 44 -6 26 C-1 16 1 8 0 2Z";
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side * open, 1);
    for (const [d, n] of [[fw, "f"], [hw, "h"]]) {
      wash(ctx, cachePts("brim" + n, () => parsePath(d, 4)[0]), { key: "brimw" + n, color: "#f0dd4a", alpha: 1, layers: 8, spread: 0.02, edge: false });
      inkPath(ctx, d, { w: 1.8, wobble: 0.3, sound: false, color: "#7a6a1a" });
    }
    ctx.fillStyle = "#e37b1c";
    ctx.beginPath(); ctx.arc(-34, -26, 3, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(-30, 26, 3.4, 0, 7); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#3a3320"; ctx.beginPath(); ctx.ellipse(0, 6, 4, 22, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -18, 5, 0, 7); ctx.fill();
  ctx.strokeStyle = "#3a3320"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-2, -22); ctx.quadraticCurveTo(-6, -38, -12, -42); ctx.moveTo(2, -22); ctx.quadraticCurveTo(6, -38, 12, -42); ctx.stroke();
  ctx.restore();
}
/** Common blue (Azuré commun): small violet-blue wings, dark edge, white fringe */
export function commonBlue(ctx, x, y, s, key, flap, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  const open = 0.25 + 0.75 * Math.abs(Math.cos(flap * Math.PI));
  const fw = "M0 0 C-6 -24 -28 -44 -54 -42 C-58 -24 -48 -6 -28 4 C-16 8 -6 5 0 0Z";
  const hw = "M0 2 C-18 6 -38 14 -42 32 C-30 44 -12 36 -4 22 C0 14 1 7 0 2Z";
  for (const side of [-1, 1]) {
    ctx.save(); ctx.scale(side * open, 1);
    for (const [d, n] of [[fw, "f"], [hw, "h"]]) {
      wash(ctx, cachePts("blue" + n, () => parsePath(d, 4)[0]), { key: "bluew" + n, color: "#6f86e0", alpha: 1, layers: 8, spread: 0.02, edge: false });
      inkPath(ctx, d, { w: 3, wobble: 0.3, sound: false, color: "#2b2f4a" });
    }
    ctx.restore();
  }
  ctx.fillStyle = "#2b2f4a"; ctx.beginPath(); ctx.ellipse(0, 6, 3.5, 18, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -14, 4.5, 0, 7); ctx.fill();
  ctx.restore();
}

/** Every plant the film can draw, by short name (see flora in i18n.js). */
export const FLORA = {
  cone: coneflower, gold: goldenrod, aster, milk: milkweed, grass: grassTuft,
  susan: blackEyedSusan, weed: butterflyWeed, cardinal: cardinalFlower,
  bergamot: (c, x, y, h, k, p, s) => pompom(c, x, y, h, k, p, s),
  scab: (c, x, y, h, k, p, s) => pompom(c, x, y, h, k, p, s, { color: "#7c7fc9", color2: "#6568b8", round: true, wiry: true, heads: [[0, -h, 1], [18, -h * 0.78, 0.8]] }),
  fox: foxglove, knap: knapweed, trefoil, clover: redClover,
  hair: (c, x, y, h, k, p, s) => grassTuft(c, x, y, h, k, p, s),
};
export const FLYERS = { monarch, brimstone, blue: commonBlue };
