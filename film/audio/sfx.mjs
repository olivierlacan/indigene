// Foley and ambience, synthesized in plain JavaScript and written as a 48 kHz
// stereo WAV that lines up sample-for-sample with the picture.
//
//   node sfx.mjs ../out/ink.json sfx.wav
//   FILM_LANG=fr node sfx.mjs ../out/ink.fr.json sfx.fr.wav
//
// - pencil on paper, driven frame by frame by how much ink the renderer laid down
// - a distant lawnmower that cuts out on "…but strangely quiet."
// - paper slides under each camera move
// - chickadee "fee-bee" whistles, begging chicks, bees, rain, a watering can
// - a wooden tock when the pin lands, soft UI ticks, a small bell on the mark
import fs from "node:fs";
import { T, CAM } from "../js/timeline.js";
import { LANG } from "../js/i18n.js";

const SR = 48000, DUR = T.end + 0.5, N = Math.ceil(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;

function add(i, v, pan = 0) { // pan -1..1, equal power
  if (i < 0 || i >= N) return;
  const a = (pan + 1) * Math.PI / 4;
  L[i] += v * Math.cos(a); R[i] += v * Math.sin(a);
}
// RBJ biquad
function biquad(type, f, q = 0.707, gainDb = 0) {
  const w = 2 * Math.PI * f / SR, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q);
  let b0, b1, b2, a0, a1, a2;
  if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
  else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
  else { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; } // bandpass
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  const B0 = b0 / a0, B1 = b1 / a0, B2 = b2 / a0, A1 = a1 / a0, A2 = a2 / a0;
  return (x) => { const y = B0 * x + B1 * x1 + B2 * x2 - A1 * y1 - A2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}
const db = (d) => Math.pow(10, d / 20);
const S = (t) => Math.round(t * SR);

// ---------------------------------------------------------------- pencil
{
  const ink = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const fps = ink.fps, v = ink.ink;
  const sorted = [...v].filter((x) => x > 0).sort((a, b) => a - b);
  const p90 = sorted[Math.floor(sorted.length * 0.9)] || 1;
  const bp1 = biquad("bp", 2300, 0.7), bp2 = biquad("bp", 4600, 1.0), hp = biquad("hp", 900), plp = biquad("lp", 6500);
  let env = 0, grain = 0, gtarget = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR, f = Math.min(v.length - 1, Math.floor(t * fps));
    const target = Math.pow(Math.min(1.0, (v[f] || 0) / p90), 0.6);
    env += (target - env) * (target > env ? 0.004 : 0.0008);
    if (i % 480 === 0) gtarget = 0.35 + rnd() * 0.65; // tooth of the paper, ~100 Hz grain
    grain += (gtarget - grain) * 0.02;
    const n = noise();
    const s = plp(hp(bp1(n) * 0.8 + bp2(n) * 0.35)) * env * grain;
    add(i, s * db(-24) * (t > T.end - 5 ? Math.max(0, (T.end - 2 - t) / 3) : 1), Math.sin(t * 0.7) * 0.25);
  }
}

// ---------------------------------------------------------------- lawnmower, far away, until "quiet"
// A two-stroke engine heard over fences: broadband noise chopped by the
// firing pulses (no steady pitch, so it never reads as a tone), a little
// low body, all dulled by distance — then it sputters and winds down.
{
  const end = T.quiet + 0.15;
  const lp = biquad("lp", 650), lp2 = biquad("lp", 1100), body = biquad("lp", 140), hp = biquad("hp", 60);
  let ph = 0;
  for (let i = 0; i < S(end + 1.1); i++) {
    const t = i / SR;
    const wind = t < end ? 1 : Math.max(0.3, 1 - (t - end) / 1.0);
    const rate = (34 + Math.sin(t * 0.8) * 2 + (rnd() - 0.5) * 3) * wind; // firing pulses per second
    ph += rate / SR;
    const fire = Math.exp(-((ph % 1) * 9)); // sharp attack, quick decay each firing
    const n = noise();
    let s = lp(n) * (0.25 + fire * 0.9) + body(n) * fire * 2.2;
    s = hp(lp2(s));
    const g = Math.min(1, t / 1.2) * (t < end ? 1 : Math.max(0, 1 - (t - end) / 1.0));
    add(i, s * g * db(-22), -0.35);
  }
}

// ---------------------------------------------------------------- paper slides under camera moves
function whoosh(t0, t1, level = -26, pan = 0) {
  const bp = biquad("bp", 900, 0.6), lp = biquad("lp", 3000);
  const a = S(t0), b = S(t1);
  for (let i = a; i < b; i++) {
    const u = (i - a) / (b - a);
    const env = Math.pow(Math.sin(Math.PI * u), 1.6);
    const s = lp(bp(noise()) * 1.4 + noise() * 0.1);
    add(i, s * env * db(level), pan * (u * 2 - 1));
  }
}
for (let k = 1; k < CAM.length; k++) {
  const a = CAM[k - 1], b = CAM[k];
  const dist = Math.hypot(b.x - a.x, b.y - a.y) + Math.abs(Math.log(b.z / a.z)) * 800;
  if (dist > 300 && b.t - a.t < 2) whoosh(a.t - 0.05, b.t + 0.15, dist > 1500 ? -22 : -26, Math.sign(b.x - a.x) * 0.6);
}

// ---------------------------------------------------------------- chickadee "fee-bee"
function feebee(t0, level = -18, pan = 0.3, pitch = 1) {
  const notes = [[0, 0.34, 3950, 3900], [0.4, 0.3, 3420, 3300]];
  for (const [o, d, f0, f1] of notes) {
    let ph = 0;
    const a = S(t0 + o), n = S(d);
    for (let k = 0; k < n; k++) {
      const u = k / n;
      const f = (f0 + (f1 - f0) * u) * pitch * (1 + Math.sin(k / SR * 2 * Math.PI * 28) * 0.004);
      ph += f / SR;
      const env = Math.min(1, u / 0.12) * Math.min(1, (1 - u) / 0.25);
      add(a + k, Math.sin(2 * Math.PI * ph) * env * db(level), pan);
    }
  }
}
function chirp(t0, level = -30, pan = 0, f = 5200) { // a begging chick / small bird
  let ph = 0;
  const n = S(0.07), a = S(t0);
  for (let k = 0; k < n; k++) {
    const u = k / n;
    ph += (f * (1 + 0.25 * Math.sin(Math.PI * u))) / SR;
    add(a + k, Math.sin(2 * Math.PI * ph) * Math.sin(Math.PI * u) * db(level), pan);
  }
}
// In France the bird is a great tit: a bright, repeated two-note "ti-tu ti-tu ti-tu".
function titSong(t0, level = -20, pan = 0.3, pitch = 1) {
  for (let r = 0; r < 3; r++) {
    for (const [o, f0, f1] of [[0, 5200, 4900], [0.13, 3600, 3400]]) {
      let ph = 0;
      const a = S(t0 + r * 0.3 + o), n = S(0.1);
      for (let k = 0; k < n; k++) {
        const u = k / n, f = (f0 + (f1 - f0) * u) * pitch;
        ph += f / SR;
        add(a + k, Math.sin(2 * Math.PI * ph) * Math.min(1, u / 0.15) * Math.min(1, (1 - u) / 0.3) * db(level), pan);
      }
    }
  }
}
const song = LANG === "fr" ? titSong : feebee;
song(T.bird + 0.5, -21, 0.4);
for (let t = T.chicks + 0.4; t < T.chicks + 2.8; t += 0.16 + rnd() * 0.12) chirp(t, -40 + rnd() * 3, 0.45, 4300 + rnd() * 700);
// fig. 6: the yard sings again
const land = T.foodweb + 1.3;
for (let t = land; t < T.logo + 0.6; t += 1.6) song(t, -25, -0.2);
song(T.foodweb + 0.6, -31, 0.7, 1.06);
for (let t = T.foodweb + 0.3; t < T.logo + 0.4; t += 0.35 + rnd() * 0.9) chirp(t, -40, rnd() * 1.6 - 0.8, 4200 + rnd() * 2600);
// and one last song over the mark
song(T.voEnd + 1.6, -26, 0.5);

// ---------------------------------------------------------------- bees
function buzz(t0, t1, level = -30, pan = 0) {
  const lp = biquad("lp", 1400), bp = biquad("bp", 480, 1.5);
  let ph = 0;
  for (let i = S(t0); i < S(t1); i++) {
    const t = i / SR, u = (t - t0) / (t1 - t0);
    ph += (215 + Math.sin(t * 3.1) * 12) / SR;
    const saw = (ph % 1) * 2 - 1;
    const env = Math.min(1, u * 6) * Math.min(1, (1 - u) * 6) * (0.7 + 0.3 * Math.sin(t * 5.7));
    add(i, (lp(saw) * 0.6 + bp(saw) * 0.8) * env * db(level), pan + Math.sin(t * 1.3) * 0.3);
  }
}
buzz(T.foodweb + 0.3, T.logo - 0.8, -38, 0.2);
buzz(T.voEnd - 0.4, T.voEnd + 2.2, -38, 0.5);

// ---------------------------------------------------------------- rain on the climate beat
{
  const bp = biquad("bp", 1600, 0.5), lp = biquad("lp", 4200);
  const t0 = T.climate + 0.5, t1 = T.shows + 0.3;
  for (let i = S(t0); i < S(t1); i++) {
    const u = (i - S(t0)) / (S(t1) - S(t0));
    const env = Math.min(1, u * 5) * Math.min(1, (1 - u) * 4);
    let s = lp(bp(noise())) * 0.6;
    if (rnd() < 0.0009) s += (rnd() - 0.5) * 1.2; // individual drops
    add(i, s * env * db(-35), 0.6);
  }
}
// watering can
{
  const bp = biquad("bp", 3800, 0.9);
  const t0 = T.grand + 1.3, t1 = T.anyone + 0.2;
  for (let i = S(t0); i < S(t1); i++) {
    const u = (i - S(t0)) / (S(t1) - S(t0));
    const env = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
    add(i, bp(noise()) * env * db(-38), 0.1);
  }
}

// ---------------------------------------------------------------- tocks, ticks, bell
function tock(t0, f = 190, level = -16, pan = 0) {
  for (let k = 0; k < S(0.25); k++) {
    const tt = k / SR;
    const s = Math.sin(2 * Math.PI * f * tt) * Math.exp(-tt * 28) + Math.sin(2 * Math.PI * f * 2.7 * tt) * Math.exp(-tt * 60) * 0.4 + (k < 60 ? noise() * 0.5 * (1 - k / 60) : 0);
    add(S(t0) + k, s * db(level), pan);
  }
}
function tick(t0, level = -30, pan = 0) {
  for (let k = 0; k < S(0.05); k++) {
    const tt = k / SR;
    add(S(t0) + k, (Math.sin(2 * Math.PI * 2100 * tt) * 0.6 + noise() * 0.4) * Math.exp(-tt * 140) * db(level), pan);
  }
}
function bell(t0, f = 1318.5, level = -24, pan = 0) { // soft glockenspiel-ish partials
  const parts = [[1, 1, 2.6], [2.0, 0.18, 4], [3.0, 0.06, 7], [0.5, 0.25, 2.2]];
  for (let k = 0; k < S(2.8); k++) {
    const tt = k / SR;
    let s = 0;
    for (const [m, a, d] of parts) s += Math.sin(2 * Math.PI * f * m * tt) * a * Math.exp(-tt * d);
    add(S(t0) + k, s * Math.min(1, k / 40) * db(level), pan);
  }
}
tock(T.name + 0.33, 170, -15, 0.15);        // the pin lands
for (let i = 0; i < 4; i++) tick(T.shows + 0.3 + i * 0.32, -35, -0.4); // result cards
for (let i = 0; i < 4; i++) tick(T.ranked + 0.35 + i * 0.18, -37, -0.5); // ranks circled
for (let i = 0; i < 4; i++) tock(T.howbig + 0.1 + i * 0.42, 300 + i * 40, -34, 0.3); // trees pop up
tock(T.plain + 0.8, 360, -34, -0.2);          // the plain-words pill
tock(T.account + 0.55, 330, -34, 0.3);        // the no-account note
bell(T.logo - 0.05, 587.3, -29, 0);          // the mark (D6)
bell(T.logo + 0.35, 880, -34, 0.2);          // (A6)

// ---------------------------------------------------------------- paper at the very start
whoosh(0.0, 0.9, -28, 0);

// ---------------------------------------------------------------- write
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0); out.writeUInt32LE(36 + N * 4, 4); out.write("WAVE", 8);
out.write("fmt ", 12); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34);
out.write("data", 36); out.writeUInt32LE(N * 4, 40);
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = peak > 0.95 ? 0.95 / peak : 1;
for (let i = 0; i < N; i++) {
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * g * 32767))), 44 + i * 4);
  out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * g * 32767))), 46 + i * 4);
}
fs.writeFileSync(process.argv[3] || "sfx.wav", out);
console.log("sfx written; peak", peak.toFixed(3), "gain", g.toFixed(3));
