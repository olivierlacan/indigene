// A tiny hand-drawn rendering engine for <canvas>: ink strokes that wobble and
// taper like a real nib, watercolor washes built from dozens of translucent
// deformed layers, handwritten annotations that write themselves on, a paper
// sheet with grain, and a camera. Everything is a pure function of time `t`,
// so the same frame renders identically in the live player and in the
// frame-by-frame capture.

export const W = 1920, H = 1080;

// ---------------------------------------------------------------- random
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hash(n) {
  n = Math.imul(n ^ 0x27d4eb2d, 0x165667b1);
  n ^= n >>> 15; n = Math.imul(n, 0x85ebca6b); n ^= n >>> 13;
  return ((n >>> 0) % 100000) / 100000;
}
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
// smooth 1-D value noise in [0,1]
export function noise1(seed, x) {
  const i = Math.floor(x), f = x - i;
  const a = hash(seed * 7919 + i), b = hash(seed * 7919 + i + 1);
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}
function gauss(r) { // Box-Muller
  let u = 0, v = 0;
  while (u === 0) u = r();
  while (v === 0) v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------------------------------------------------------------- easing
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = {
  linear: (x) => x,
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out: (x) => 1 - Math.pow(1 - x, 3),
  in: (x) => x * x * x,
  outQuart: (x) => 1 - Math.pow(1 - x, 4),
  inOutSine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  outBack: (x) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outElastic: (x) => x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -9 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3.2) + 1,
  // pen-like: quick start, gentle landing
  pen: (x) => 1 - Math.pow(1 - x, 1.8),
};
/** progress of a span [start, start+dur] at time t, eased */
export function span(t, start, dur, fn = ease.pen) {
  if (dur <= 0) return t >= start ? 1 : 0;
  return fn(clamp((t - start) / dur));
}

// ---------------------------------------------------------------- palette
// Taken from the app's styles.css / favicon, so the film and the product are
// visibly the same family.
export const C = {
  paper: "#f7f5ef",
  paper2: "#efece2",
  ink: "#14140f",
  inkSoft: "#3d3d34",
  line: "#cfcabb",
  brand: "#175e33",
  brandInk: "#0d3d20",
  brandBg: "#e2efe4",
  markBg: "#1f6b3b",
  markStem: "#7ac28c",
  markLeaf: "#a7e0b5",
  leafDark: "#7ec894",
  accent: "#7c430f",
  warnBg: "#fbe9d0",
  focus: "#1747b3",
  // bloom colours from components/size-viz.ts
  red: "#c62828", orange: "#ef6c00", yellow: "#f9a825", pink: "#d81b8c",
  purple: "#7b3fa0", lavender: "#9575cd", blue: "#3f51b5", white: "#e8e8e0",
  // naturalist extras, all muted to sit on paper
  lawn: "#8fbf5a", lawnPale: "#b5d68a", sky: "#cfe3ea", soil: "#8a6a4a",
  soilDark: "#5e4631", clay: "#b98a5e", bark: "#6b5440", skin1: "#e9b98f",
  skin2: "#a86f4c", skin3: "#6e4630", skin4: "#f1caa4", hair1: "#3b2a20",
  hair2: "#c9c4bb", sun: "#f6c445", monarch: "#e8741c",
};

// ---------------------------------------------------------------- path parsing
// Minimal SVG path parser → list of polylines (subpaths). Handles M L H V C S
// Q T Z and their relative forms, which is everything the drawings use.
export function parsePath(d, step = 3) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  const subs = [];
  let cur = null, x = 0, y = 0, sx = 0, sy = 0, cmd = "", i = 0;
  let lcx = null, lcy = null, lqx = null, lqy = null;
  const num = () => parseFloat(toks[i++]);
  const push = (px, py) => cur.push([px, py]);
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    const len = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2);
    const n = Math.max(4, Math.ceil(len / step));
    for (let k = 1; k <= n; k++) {
      const t = k / n, mt = 1 - t;
      push(mt * mt * mt * x + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3,
           mt * mt * mt * y + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3);
    }
    lcx = x2; lcy = y2; x = x3; y = y3;
  };
  const quad = (x1, y1, x2, y2) => {
    const len = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(4, Math.ceil(len / step));
    for (let k = 1; k <= n; k++) {
      const t = k / n, mt = 1 - t;
      push(mt * mt * x + 2 * mt * t * x1 + t * t * x2, mt * mt * y + 2 * mt * t * y1 + t * t * y2);
    }
    lqx = x1; lqy = y1; x = x2; y = y2;
  };
  const line = (nx, ny) => {
    const len = Math.hypot(nx - x, ny - y);
    const n = Math.max(1, Math.ceil(len / (step * 2)));
    for (let k = 1; k <= n; k++) push(x + ((nx - x) * k) / n, y + ((ny - y) * k) / n);
    x = nx; y = ny;
  };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case "M": {
        x = num() + ox; y = num() + oy; sx = x; sy = y;
        cur = [[x, y]]; subs.push(cur);
        cmd = rel ? "l" : "L"; lcx = lqx = null; break;
      }
      case "L": { const nx = num() + ox, ny = num() + oy; line(nx, ny); lcx = lqx = null; break; }
      case "H": { const nx = num() + ox; line(nx, y); lcx = lqx = null; break; }
      case "V": { const ny = num() + oy; line(x, ny); lcx = lqx = null; break; }
      case "C": {
        const a = num() + ox, b = num() + oy, c = num() + ox, d2 = num() + oy, e = num() + ox, f = num() + oy;
        cubic(a, b, c, d2, e, f); lqx = null; break;
      }
      case "S": {
        const a = lcx === null ? x : 2 * x - lcx, b = lcy === null ? y : 2 * y - lcy;
        const c = num() + ox, d2 = num() + oy, e = num() + ox, f = num() + oy;
        cubic(a, b, c, d2, e, f); lqx = null; break;
      }
      case "Q": { const a = num() + ox, b = num() + oy, c = num() + ox, d2 = num() + oy; quad(a, b, c, d2); lcx = null; break; }
      case "T": {
        const a = lqx === null ? x : 2 * x - lqx, b = lqy === null ? y : 2 * y - lqy;
        const c = num() + ox, d2 = num() + oy; quad(a, b, c, d2); lcx = null; break;
      }
      case "Z": { line(sx, sy); cur.closed = true; lcx = lqx = null; break; }
      default: i++;
    }
  }
  return subs;
}

// Useful generators -------------------------------------------------------
export function circlePts(cx, cy, r, n = 0, start = -Math.PI / 2, sweep = Math.PI * 2, ry = r) {
  n = n || Math.max(16, Math.ceil((Math.abs(sweep) * Math.max(r, ry)) / 3));
  const p = [];
  for (let k = 0; k <= n; k++) {
    const a = start + (sweep * k) / n;
    p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * ry]);
  }
  return p;
}
export function polyPts(pts, step = 3) {
  const out = [pts[0]];
  for (let k = 1; k < pts.length; k++) {
    const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let j = 1; j <= n; j++) out.push([x0 + ((x1 - x0) * j) / n, y0 + ((y1 - y0) * j) / n]);
  }
  return out;
}

// ---------------------------------------------------------------- global state
export const G = {
  t: 0,
  boil: 0,          // integer that ticks ~8×/s; re-seeds line jitter ("line boil")
  ink: 0,           // ink drawn this frame (for the pencil sound track)
  lastProgress: new Map(),
  soundOn: true,
};

// ---------------------------------------------------------------- ink stroke
const geomCache = new WeakMap();
function geom(pts) {
  let g = geomCache.get(pts);
  if (g) return g;
  const n = pts.length;
  const len = new Float32Array(n);
  const nx = new Float32Array(n), ny = new Float32Array(n);
  for (let k = 1; k < n; k++) len[k] = len[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  for (let k = 0; k < n; k++) {
    const a = pts[Math.max(0, k - 1)], b = pts[Math.min(n - 1, k + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    nx[k] = -dy / l; ny[k] = dx / l;
  }
  g = { len, nx, ny, total: len[n - 1] || 0 };
  geomCache.set(pts, g);
  return g;
}

let strokeId = 0;
const idCache = new WeakMap();

/**
 * Draw an ink line along `pts` (array of [x,y]).
 * o.w width, o.color, o.p progress 0..1, o.seed, o.wobble, o.alpha,
 * o.taper (0..1 how much the ends thin), o.pencil (grainy graphite look)
 */
export function ink(ctx, pts, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0 || pts.length < 2) return;
  const g = geom(pts);
  let id = idCache.get(pts);
  if (id === undefined) { id = strokeId++; idCache.set(pts, id); }
  const seed = (o.seed ?? id) + 1;
  // pencil sound: accumulate ink laid down since the previous frame
  if (G.soundOn && o.sound !== false) {
    const last = G.lastProgress.get(id) ?? 0;
    if (p > last) G.ink += (p - last) * g.total * (o.w || 3) ** 0.5;
    G.lastProgress.set(id, p);
  }
  const total = g.total, end = total * p;
  const w = (o.w ?? 3) * 1.12, wob = o.wobble ?? 1.7, taper = o.taper ?? 0.9;
  const tl = Math.min(total * 0.35, o.taperLen ?? w * 6 + 10);
  const boilAmp = o.boil ?? 0.7;
  const bs = G.boil;
  const L = [], R = [];
  const n = pts.length;
  for (let k = 0; k < n; k++) {
    const s = g.len[k];
    let x = pts[k][0], y = pts[k][1];
    let cut = false;
    if (s > end) {
      // interpolate the exact end point so the nib glides instead of stepping
      const s0 = g.len[k - 1], f = (end - s0) / (s - s0 || 1);
      x = pts[k - 1][0] + (x - pts[k - 1][0]) * f;
      y = pts[k - 1][1] + (y - pts[k - 1][1]) * f;
      cut = true;
    }
    const ss = cut ? end : s;
    const off = (noise1(seed, ss / 70) - 0.5) * 2 * wob + (noise1(seed * 31 + bs, ss / 22) - 0.5) * 2 * boilAmp;
    const ts = Math.min(1, ss / tl, (total - ss) / tl);
    const tipIn = Math.min(1, (end - ss) / (w * 1.2 + 2)); // round nib at the moving end
    let ww = w * (0.62 + 0.62 * noise1(seed + 11, ss / 38));
    ww *= 1 - taper + taper * Math.sqrt(Math.max(0, ts));
    if (p < 1) ww *= 0.55 + 0.45 * Math.max(0, tipIn);
    ww = Math.max(ww, w * 0.18);
    const cx = x + g.nx[k] * off, cy = y + g.ny[k] * off;
    L.push(cx + (g.nx[k] * ww) / 2, cy + (g.ny[k] * ww) / 2);
    R.push(cx - (g.nx[k] * ww) / 2, cy - (g.ny[k] * ww) / 2);
    if (cut) break;
  }
  ctx.save();
  ctx.globalAlpha *= o.alpha ?? 0.92;
  ctx.fillStyle = o.color || C.ink;
  ctx.beginPath();
  ctx.moveTo(L[0], L[1]);
  for (let k = 2; k < L.length; k += 2) ctx.lineTo(L[k], L[k + 1]);
  for (let k = R.length - 2; k >= 0; k -= 2) ctx.lineTo(R[k], R[k + 1]);
  ctx.closePath();
  ctx.fill();
  if (o.pencil) {
    // a second, broken graphite pass beside the first
    ctx.globalAlpha *= 0.35;
    ctx.beginPath();
    for (let k = 0; k < L.length; k += 2) {
      const brk = noise1(seed + 99 + bs, k / 9) > 0.62;
      const x = (L[k] + R[k]) / 2 + 1.4, y = (L[k + 1] + R[k + 1]) / 2 + 1.1;
      if (k === 0 || brk) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineWidth = Math.max(0.7, w * 0.35);
    ctx.strokeStyle = o.color || C.ink;
    ctx.stroke();
  }
  ctx.restore();
}

/** Parse (cached) + draw an SVG-path ink drawing; `p` spreads across subpaths in order. */
const pathCache = new Map();
export function P(d, step) {
  const key = d + "|" + (step || 3);
  let v = pathCache.get(key);
  if (!v) { v = parsePath(d, step); pathCache.set(key, v); }
  return v;
}
// Break a polyline at sharp corners and let each piece overshoot a little —
// the way a hand draws a box as four strokes that cross at the corners.
const roughCache = new Map();
function roughen(subs, key, over) {
  let v = roughCache.get(key);
  if (v) return v;
  v = [];
  for (const s of subs) {
    let cur = [s[0]];
    for (let k = 1; k < s.length - 1; k++) {
      cur.push(s[k]);
      const a = s[k - 1], b = s[k], c = s[k + 1];
      const a1 = Math.atan2(b[1] - a[1], b[0] - a[0]), a2 = Math.atan2(c[1] - b[1], c[0] - b[0]);
      let da = Math.abs(a2 - a1); if (da > Math.PI) da = 2 * Math.PI - da;
      if (da > 0.75 && cur.length > 2) { v.push(cur); cur = [b]; }
    }
    cur.push(s[s.length - 1]);
    v.push(cur);
  }
  const h = hashStr(key);
  v = v.map((s, i) => {
    if (s.length < 2) return s;
    const ext = (p0, p1, amt) => { const dx = p0[0] - p1[0], dy = p0[1] - p1[1], l = Math.hypot(dx, dy) || 1; return [p0[0] + (dx / l) * amt, p0[1] + (dy / l) * amt]; };
    const e1 = over * (0.3 + hash(h + i) * 0.9), e2 = over * (0.3 + hash(h + i + 77) * 0.9);
    return [ext(s[0], s[1], e1), ...s, ext(s[s.length - 1], s[s.length - 2], e2)];
  });
  roughCache.set(key, v);
  return v;
}
export function inkPath(ctx, d, o = {}) {
  let subs = typeof d === "string" ? P(d) : d;
  if (typeof d === "string" && o.rough !== false) subs = roughen(subs, d, o.over ?? 7);
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  // distribute progress by length so a multi-part drawing flows like one hand
  let total = 0;
  const lens = subs.map((s) => { const l = geom(s).total; total += l; return l; });
  let acc = 0;
  subs.forEach((s, k) => {
    const a = acc / total, b = (acc + lens[k]) / total;
    acc += lens[k];
    const lp = clamp((p - a) / (b - a || 1));
    if (lp > 0) ink(ctx, s, { ...o, p: lp, seed: (o.seed ?? 0) * 13 + k + 1 + (o.seed === undefined ? idOf(s) : 0) });
  });
}
function idOf(s) { let id = idCache.get(s); if (id === undefined) { id = strokeId++; idCache.set(s, id); } return id; }

// ---------------------------------------------------------------- watercolor
// Each wash is painted once into its own offscreen bitmap — dozens of
// translucent, randomly deformed layers (Tyler Hobbs' technique), pigment
// pooled at the edges, then granulated by lifting paint with a blotchy
// texture — and cached. Per frame we only composite the bitmap, clipped by a
// wet, noisy disc while it spreads.
const washCache = new Map();
const WASH_RES = 1.6; // bitmap px per world unit (camera zooms up to ~1.45)
function deform(poly, depth, varr, r) {
  let pts = poly.map((p, i) => [p[0], p[1], varr[i % varr.length]]);
  for (let d = 0; d < depth; d++) {
    const out = [];
    for (let k = 0; k < pts.length; k++) {
      const a = pts[k], b = pts[(k + 1) % pts.length];
      out.push(a);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const v = (a[2] + b[2]) / 2;
      const mx = (a[0] + b[0]) / 2 + gauss(r) * len * v * 0.5;
      const my = (a[1] + b[1]) / 2 + gauss(r) * len * v * 0.5;
      out.push([mx, my, v * (0.6 + r() * 0.5)]);
    }
    pts = out;
  }
  return pts;
}
function resamplePoly(pts, n) {
  // subdivide every edge (keeping the original corners) so long edges
  // deform like short ones and rectangles stay rectangles
  let per = 0;
  for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  const seg = Math.max(per / n, 30);
  const out = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length];
    const m = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg));
    for (let j = 0; j < m; j++) out.push([a[0] + ((b[0] - a[0]) * j) / m, a[1] + ((b[1] - a[1]) * j) / m]);
  }
  return out;
}
let granTex = null;
function granulation() {
  if (granTex) return granTex;
  const S = 512, c = new OffscreenCanvas(S, S), x = c.getContext("2d");
  const img = x.createImageData(S, S);
  const oct = (u, v, f, s) => {
    const fx = u * f, fy = v * f, ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy;
    const h = (a, b) => hash(s * 100003 + ((a % f) + f) % f * 1009 + ((b % f) + f) % f);
    const sx = ax * ax * (3 - 2 * ax), sy = ay * ay * (3 - 2 * ay);
    const a = h(ix, iy), b = h(ix + 1, iy), c2 = h(ix, iy + 1), d = h(ix + 1, iy + 1);
    return a + (b - a) * sx + (c2 - a) * sy + (a - b - c2 + d) * sx * sy;
  };
  const r = mulberry32(7);
  for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
    const u = xx / S, v = y / S;
    let n = oct(u, v, 6, 1) * 0.5 + oct(u, v, 16, 2) * 0.3 + oct(u, v, 48, 3) * 0.2;
    n = Math.pow(n, 1.6) + (r() - 0.5) * 0.12;
    const k = (y * S + xx) * 4;
    img.data[k] = img.data[k + 1] = img.data[k + 2] = 0;
    img.data[k + 3] = Math.max(0, Math.min(255, n * 255));
  }
  x.putImageData(img, 0, 0);
  granTex = c;
  return c;
}
function paintWash(poly, o, key) {
  const r = mulberry32(hashStr(key));
  const spread = o.spread ?? 0.06;
  const base = poly.length > 60 ? resamplePoly(poly.filter((_, i) => i % Math.ceil(poly.length / 60) === 0), 48) : resamplePoly(poly, 48);
  const varr = base.map(() => spread * (0.4 + r() * 1.2));
  const b1 = deform(base, 2, varr, r);
  const nL = o.layers ?? 24;
  const layers = [];
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  for (let k = 0; k < nL; k++) {
    const pts = deform(b1, 3, varr.map((x) => x * 0.9), r);
    for (const q of pts) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]); }
    layers.push(pts);
  }
  const pad = 6;
  minx -= pad; miny -= pad; maxx += pad; maxy += pad;
  let res = WASH_RES;
  const bw = maxx - minx, bh = maxy - miny;
  if (Math.max(bw, bh) * res > 3600) res = 3600 / Math.max(bw, bh);
  const cw = Math.ceil(bw * res), ch = Math.ceil(bh * res);
  const c = new OffscreenCanvas(Math.max(1, cw), Math.max(1, ch));
  const x = c.getContext("2d");
  x.setTransform(res, 0, 0, res, -minx * res, -miny * res);
  x.fillStyle = o.color;
  const la = (o.density ?? 2.3) / nL;
  for (const pts of layers) {
    const path = new Path2D();
    path.moveTo(pts[0][0], pts[0][1]);
    for (const q of pts) path.lineTo(q[0], q[1]);
    path.closePath();
    x.globalAlpha = la;
    x.fill(path);
    if (o.edge !== false) {
      x.globalAlpha = 0.07;
      x.strokeStyle = o.edgeColor || o.color;
      x.lineWidth = 1.6;
      x.stroke(path);
    }
  }
  // lift pigment unevenly: granulation
  x.setTransform(1, 0, 0, 1, 0, 0);
  const pat = x.createPattern(granulation(), "repeat");
  pat.setTransform(new DOMMatrix().translate(r() * 512, r() * 512).scale(0.9 + r() * 0.5));
  x.globalCompositeOperation = "destination-out";
  x.globalAlpha = o.gran ?? 0.42;
  x.fillStyle = pat;
  x.fillRect(0, 0, cw, ch);
  if (o.fade) {
    // fade toward one side (e.g. soil that dissolves into the page)
    const g = o.fade === "down" ? x.createLinearGradient(0, 0, 0, ch) : x.createLinearGradient(0, ch, 0, 0);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(o.fadeStart ?? 0.25, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    x.globalCompositeOperation = "destination-in";
    x.globalAlpha = 1;
    x.fillStyle = g;
    x.fillRect(0, 0, cw, ch);
  }
  return { bmp: c, bbox: [minx, miny, maxx, maxy] };
}
/**
 * Watercolor wash over polygon `poly`. o.key (required, stable), o.color,
 * o.p reveal 0..1, o.ox/oy reveal origin, o.alpha, o.layers, o.spread,
 * o.density, o.gran, o.fade ('down'|'up'), o.shift (misregistration px)
 */
export function wash(ctx, poly, o) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  const key = o.key;
  let v = washCache.get(key);
  if (!v) { v = paintWash(poly, o, key); washCache.set(key, v); }
  const [x0, y0, x1, y1] = v.bbox;
  ctx.save();
  if (p < 1) {
    const ox = o.ox ?? (x0 + x1) / 2, oy = o.oy ?? (y0 + y1) / 2;
    const maxR = Math.max(Math.hypot(ox - x0, oy - y0), Math.hypot(ox - x1, oy - y0), Math.hypot(ox - x0, oy - y1), Math.hypot(ox - x1, oy - y1));
    const rr = maxR * 1.12 * ease.out(p);
    const clip = new Path2D();
    const seed = hashStr(key) % 1000;
    for (let k = 0; k <= 64; k++) {
      const a = (k / 64) * Math.PI * 2;
      const rad = rr * (0.8 + 0.4 * noise1(seed, k * 0.45));
      const px = ox + Math.cos(a) * rad, py = oy + Math.sin(a) * rad;
      k ? clip.lineTo(px, py) : clip.moveTo(px, py);
    }
    ctx.clip(clip);
  }
  ctx.globalAlpha *= (o.alpha ?? 1) * (p < 1 ? 0.45 + 0.55 * p : 1);
  const sh = o.shift ?? 2.5;
  ctx.drawImage(v.bmp, x0 + sh, y0 + sh * 0.6, x1 - x0, y1 - y0);
  ctx.restore();
}

// ---------------------------------------------------------------- handwriting
export const FONT_HAND = "Caveat", FONT_UI = "Roboto";
/**
 * Handwritten text that writes itself on left→right.
 * o.size, o.color, o.p, o.align, o.rot (radians), o.weight
 */
export function hand(ctx, text, x, y, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  if (o.rot) ctx.rotate(o.rot);
  ctx.font = `${o.weight || 600} ${o.size || 44}px ${o.font || FONT_HAND}`;
  ctx.textBaseline = o.baseline || "alphabetic";
  const w = ctx.measureText(text).width;
  let sx = 0;
  if (o.align === "center") sx = -w / 2;
  else if (o.align === "right") sx = -w;
  if (p < 1) {
    ctx.beginPath();
    const h = (o.size || 44) * 1.6;
    ctx.rect(sx - 10, -h, (w + 20) * p, h * 2);
    ctx.clip();
    if (G.soundOn) {
      const hk = text + "|" + x + "|" + y;
      const last = G.lastProgress.get(hk) ?? 0;
      if (p > last) G.ink += (p - last) * w * 1.6;
      G.lastProgress.set(hk, p);
    }
  }
  ctx.fillStyle = o.color || C.ink;
  ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillText(text, sx, 0);
  ctx.restore();
  return w;
}
/** Set type (the app's UI face) with optional fade/slide. */
export function type(ctx, text, x, y, o = {}) {
  const a = o.alpha ?? 1;
  if (a <= 0) return 0;
  ctx.save();
  ctx.font = `${o.weight || 700} ${o.size || 64}px ${o.font || FONT_UI}`;
  ctx.textAlign = o.align || "left";
  ctx.textBaseline = o.baseline || "alphabetic";
  if (o.letterSpacing !== undefined) ctx.letterSpacing = o.letterSpacing + "px";
  ctx.globalAlpha *= a;
  ctx.fillStyle = o.color || C.ink;
  ctx.fillText(text, x, y + (o.dy || 0));
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

// ---------------------------------------------------------------- paper
let paperTex = null;
export function makePaper() {
  const S = 1024;
  const c = new OffscreenCanvas(S, S);
  const x = c.getContext("2d");
  const img = x.createImageData(S, S);
  const r = mulberry32(42);
  // layered value noise, tileable by wrapping the lattice
  const lat = (freq, seed) => {
    const g = new Float32Array((freq + 1) * (freq + 1));
    for (let k = 0; k < g.length; k++) g[k] = hash(seed * 1000 + k);
    for (let k = 0; k <= freq; k++) { g[k * (freq + 1) + freq] = g[k * (freq + 1)]; g[freq * (freq + 1) + k] = g[k]; }
    return (u, v) => {
      const fx = u * freq, fy = v * freq, ix = Math.floor(fx), iy = Math.floor(fy);
      const ax = fx - ix, ay = fy - iy, sx = ax * ax * (3 - 2 * ax), sy = ay * ay * (3 - 2 * ay);
      const i = iy * (freq + 1) + ix;
      const a = g[i], b = g[i + 1], cc = g[i + freq + 1], d = g[i + freq + 2];
      return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + d) * sx * sy;
    };
  };
  const n1 = lat(8, 1), n2 = lat(32, 2), n3 = lat(128, 3);
  for (let yy = 0; yy < S; yy++) for (let xx = 0; xx < S; xx++) {
    const u = xx / S, v = yy / S;
    const val = n1(u, v) * 0.45 + n2(u, v) * 0.3 + n3(u, v) * 0.25;
    const grain = r();
    const k = (yy * S + xx) * 4;
    const d = (val - 0.5) * 22 + (grain - 0.5) * 16;
    img.data[k] = 128 + d; img.data[k + 1] = 128 + d; img.data[k + 2] = 128 + d * 0.9; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  // a few long paper fibres
  x.globalAlpha = 0.18;
  for (let k = 0; k < 900; k++) {
    const px = r() * S, py = r() * S, a = r() * Math.PI, l = 6 + r() * 26;
    x.strokeStyle = r() > 0.5 ? "#9a9a9a" : "#dcdcdc";
    x.lineWidth = 0.6;
    x.beginPath(); x.moveTo(px, py);
    x.quadraticCurveTo(px + Math.cos(a) * l * 0.5 + r() * 4, py + Math.sin(a) * l * 0.5 + r() * 4, px + Math.cos(a) * l, py + Math.sin(a) * l);
    x.stroke();
  }
  paperTex = c;
  return c;
}
/** Grain multiplied over everything (so washes sink into the tooth). */
export function paperGrain(ctx, cam, strength = 1) {
  if (!paperTex) makePaper();
  const pat = ctx.createPattern(paperTex, "repeat");
  const m = new DOMMatrix().translate(W / 2, H / 2).scale(cam.z).translate(-cam.x, -cam.y).scale(1.2);
  pat.setTransform(m);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.8 * strength;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
export function vignette(ctx, strength = 1) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, "rgba(80,60,30,0)");
  g.addColorStop(1, `rgba(80,60,30,${0.2 * strength})`);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ---------------------------------------------------------------- camera
/** keys: [{t, x, y, z, e?}] — eased segments between consecutive keys */
export function camAt(keys, t) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let k = 1; k < keys.length; k++) {
    const a = keys[k - 1], b = keys[k];
    if (t <= b.t) {
      const f = (b.e || ease.inOut)(clamp((t - a.t) / (b.t - a.t)));
      // zoom interpolates in log space so zooms feel even
      const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), f));
      return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), z };
    }
  }
  return { ...keys[keys.length - 1] };
}

// ---------------------------------------------------------------- misc helpers
export function withT(ctx, x, y, s = 1, rot = 0, fn) {
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  if (s !== 1) ctx.scale(s, s);
  fn();
  ctx.restore();
}
/** A hand-drawn arrow from a to b with a curve bulge */
export function arrow(ctx, ax, ay, bx, by, o = {}) {
  const bend = o.bend ?? 0.2;
  const mx = (ax + bx) / 2 - (by - ay) * bend, my = (ay + by) / 2 + (bx - ax) * bend;
  const key = `arrow${ax},${ay},${bx},${by},${bend}`;
  const d = `M${ax} ${ay}Q${mx} ${my} ${bx} ${by}`;
  const p = o.p ?? 1;
  const body = clamp(p / 0.8);
  inkPath(ctx, d, { ...o, p: body, w: o.w ?? 3 });
  if (p > 0.8) {
    const hp = (p - 0.8) / 0.2;
    const ang = Math.atan2(by - my, bx - mx);
    const hl = o.head ?? 18;
    const l1 = [[bx, by], [bx - Math.cos(ang - 0.45) * hl, by - Math.sin(ang - 0.45) * hl]];
    const l2 = [[bx, by], [bx - Math.cos(ang + 0.45) * hl, by - Math.sin(ang + 0.45) * hl]];
    ink(ctx, cachePts(key + "a", () => polyPts(l1)), { ...o, p: hp, w: o.w ?? 3 });
    ink(ctx, cachePts(key + "b", () => polyPts(l2)), { ...o, p: hp, w: o.w ?? 3 });
  }
}
const ptsCache = new Map();
export function cachePts(key, fn) {
  let v = ptsCache.get(key);
  if (!v) { v = fn(); ptsCache.set(key, v); }
  return v;
}
/** A hand-drawn circle/ellipse stroke (slightly overshooting like a real loop) */
export function loop(ctx, cx, cy, r, o = {}) {
  const ry = o.ry ?? r;
  const pts = cachePts(`loop${cx},${cy},${r},${ry},${o.over ?? 0.12}`, () =>
    circlePts(cx, cy, r, 0, o.start ?? -2.2, Math.PI * 2 * (1 + (o.over ?? 0.12)), ry).map(([x, y], k, arr) => {
      const f = k / arr.length; // spiral slightly so the ends don't meet exactly
      return [cx + (x - cx) * (1 + f * 0.05), cy + (y - cy) * (1 + f * 0.05)];
    }));
  ink(ctx, pts, o);
}
export function blobPoly(cx, cy, rx, ry, n = 24, seed = 1, rough = 0.12) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    const f = 1 + (noise1(seed, k * 0.7) - 0.5) * 2 * rough;
    pts.push([cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f]);
  }
  return pts;
}
export function rectPoly(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
export function pathPoly(d) { return P(d, 6).flat(); }
