// Every cue in film seconds. The voice-over starts at VO_OFFSET; each cue is
// the measured start of a spoken phrase (silence detection on the final take)
// plus that offset, so the drawing lands on the word.
import { ease } from "./engine.js";
import { I } from "./i18n.js";

export const VO_OFFSET = 1.8;
const v = (s) => +(s + VO_OFFSET).toFixed(2);

export const T = { ...Object.fromEntries(Object.entries(I.cues).map(([k, s]) => [k, v(s)])), end: 60 };

// World layout: each vignette is a 1920×1080 "page" on one big notebook sheet.
export const CELL = {
  A: [0, 0],        // the yard
  B: [2080, 0],     // who eats what
  C: [4160, 0],     // reading a spot
  D: [4160, 1240],  // ranked & to scale
  E: [2080, 1240],  // who it's for
  G: [0, 1240],     // the mark
};
const c = (k, dx = 960, dy = 540) => [CELL[k][0] + dx, CELL[k][1] + dy];

// Camera keys: {t, x, y, z}; `e` is the easing used to arrive at that key.
export const CAM = [
  { t: 0, x: c("A")[0] + 30, y: c("A")[1] + 24, z: 1.07 },
  { t: 6.1, x: c("A")[0], y: c("A")[1], z: 1.0, e: ease.inOutSine },
  // → B, pushed in on the leaves
  { t: 7.2, x: c("B", 660)[0], y: c("B", 0, 520)[1], z: 1.42 },
  { t: 11.2, x: c("B", 690)[0], y: c("B", 0, 530)[1], z: 1.36, e: ease.inOutSine },
  // widen to reveal the bird
  { t: 12.4, x: c("B")[0], y: c("B")[1], z: 1.0 },
  { t: 16.3, x: c("B")[0] + 20, y: c("B")[1], z: 1.02, e: ease.inOutSine },
  // → C
  { t: 17.3, x: c("C")[0], y: c("C", 0, 560)[1], z: 1.06 },
  { t: 20.0, x: c("C")[0], y: c("C", 0, 540)[1], z: 1.0, e: ease.inOutSine },
  { t: 26.0, x: c("C")[0], y: c("C", 0, 560)[1], z: 0.97, e: ease.inOutSine },
  // → D
  { t: 26.95, x: c("D")[0], y: c("D")[1], z: 1.0 },
  { t: 33.3, x: c("D")[0] + 20, y: c("D")[1], z: 1.01, e: ease.inOutSine },
  { t: 34.7, x: c("D")[0] + 40, y: c("D")[1], z: 1.0, e: ease.inOutSine },
  // → E
  { t: 35.75, x: c("E")[0], y: c("E")[1], z: 1.0 },
  { t: 44.3, x: c("E")[0] - 20, y: c("E")[1] + 10, z: 1.03, e: ease.inOutSine },
  // → back to the yard, rising over the notebook so the pages read as pages
  { t: 45.15, x: (c("E")[0] + c("A")[0]) / 2, y: (c("E")[1] + c("A")[1]) / 2, z: 0.68, e: ease.inOutSine },
  { t: 46.1, x: c("A")[0], y: c("A")[1] - 10, z: 1.0, e: ease.inOutSine },
  { t: 49.05, x: c("A")[0] - 10, y: c("A")[1] + 10, z: 1.04, e: ease.inOutSine },
  // → down through the roots to the mark
  { t: 50.05, x: c("G")[0], y: c("G")[1] - 20, z: 1.0 },
  { t: 60, x: c("G")[0], y: c("G")[1] - 20, z: 1.035, e: ease.inOutSine },
];
