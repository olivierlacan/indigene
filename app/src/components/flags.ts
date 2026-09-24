// Small country flags beside a region's name, so a list of regions can be
// scanned by country before it is read.
//
// Drawn as inline SVG rather than emoji: Windows ships no flag emoji and shows
// the two code letters instead ("US", "FR"), which reads as a typo beside a
// region name. Six simple drawings cost about 2 KB and look the same
// everywhere. They are simplified for their size (about 20 px wide): the US
// flag keeps its stripes and canton but not its stars, New Zealand's Southern
// Cross is four red dots. Enough to recognise, which is the whole job.
//
// A region lists every country it reaches (`RegionMeta.countries`), so the
// Pacific Northwest shows two flags and Ireland's island-wide list shows two.
// The row is one image to assistive tech, named in the reader's language by
// the browser's own `Intl.DisplayNames`: nothing here to translate.
import { langTag } from "../lib/i18n";

const NS = "http://www.w3.org/2000/svg";
type Shape = [tag: string, attrs: Record<string, string | number>];

/** Every flag is drawn in a 30 × 20 box and scaled by CSS. */
const W = 30;
const H = 20;

const rect = (x: number, y: number, w: number, h: number, fill: string): Shape =>
  ["rect", { x, y, width: w, height: h, fill }];

/** The Union Flag in a w × h box at (x, y), clipped to it. Its proportions
 *  (white saltire 6/30 of the height, red 2/30, white cross 10/30, red 6/30)
 *  are the real ones; the red saltire's counterchange is dropped at this size. */
function unionFlag(x: number, y: number, w: number, h: number, clipId: string): Shape[] {
  const s = h / 30;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const diag = (stroke: string, width: number): Shape[] => [
    ["line", { x1: x, y1: y, x2: x + w, y2: y + h, stroke, "stroke-width": width, "clip-path": `url(#${clipId})` }],
    ["line", { x1: x, y1: y + h, x2: x + w, y2: y, stroke, "stroke-width": width, "clip-path": `url(#${clipId})` }],
  ];
  return [
    rect(x, y, w, h, "#012169"),
    ...diag("#fff", 6 * s),
    ...diag("#C8102E", 2 * s),
    rect(x, cy - 5 * s, w, 10 * s, "#fff"),
    rect(cx - 5 * s, y, 10 * s, h, "#fff"),
    rect(x, cy - 3 * s, w, 6 * s, "#C8102E"),
    rect(cx - 3 * s, y, 6 * s, h, "#C8102E"),
  ];
}

/** A simplified maple leaf, centred in the flag. */
const MAPLE =
  "M15 3.2l1.1 2.1 1.3-.6-.4 3.3 1.8-1.8.4 1.1 2.1-.4-.8 2.3 1 .5-3.4 2.8.4 1.2-3.2-.4.1 3.3h-.8l.1-3.3-3.2.4.4-1.2-3.4-2.8 1-.5-.8-2.3 2.1.4.4-1.1 1.8 1.8-.4-3.3 1.3.6z";

/** Each flag as shapes, given a clip-path id unique to this drawing. */
const FLAGS: Record<string, (clip: string) => Shape[]> = {
  FR: () => [rect(0, 0, 10, H, "#0055A4"), rect(10, 0, 10, H, "#fff"), rect(20, 0, 10, H, "#EF4135")],
  IE: () => [rect(0, 0, 10, H, "#169B62"), rect(10, 0, 10, H, "#fff"), rect(20, 0, 10, H, "#FF883E")],
  US: () => [
    rect(0, 0, W, H, "#fff"),
    ...Array.from({ length: 7 }, (_, i): Shape => rect(0, (i * 2 * H) / 13, W, H / 13, "#B31942")),
    rect(0, 0, 12, (7 * H) / 13, "#0A3161"),
  ],
  CA: () => [
    rect(0, 0, W, H, "#fff"),
    rect(0, 0, 7.5, H, "#D52B1E"),
    rect(22.5, 0, 7.5, H, "#D52B1E"),
    ["path", { d: MAPLE, fill: "#D52B1E" }],
  ],
  GB: (clip) => unionFlag(0, 0, W, H, clip),
  NZ: (clip) => [
    rect(0, 0, W, H, "#012169"),
    ...unionFlag(0, 0, W / 2, H / 2, clip),
    // The Southern Cross: four red stars edged in white, as dots.
    ...[[22.5, 4.5, 1.3], [19.5, 9.5, 1.3], [25.5, 9, 1.1], [22.5, 16, 1.5]].map(([cx, cy, r]): Shape =>
      ["circle", { cx, cy, r, fill: "#C8102E", stroke: "#fff", "stroke-width": 0.6 }]),
  ],
};

let clipSeq = 0;

function flagSvg(code: string): SVGSVGElement | null {
  const draw = FLAGS[code];
  if (!draw) return null;
  const clip = `flag-clip-${++clipSeq}`;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "flag");
  svg.setAttribute("aria-hidden", "true");
  const defs = document.createElementNS(NS, "defs");
  const clipPath = document.createElementNS(NS, "clipPath");
  clipPath.setAttribute("id", clip);
  const box = document.createElementNS(NS, "rect");
  box.setAttribute("width", String(W));
  box.setAttribute("height", String(H));
  clipPath.append(box);
  defs.append(clipPath);
  svg.append(defs);
  for (const [tag, attrs] of draw(clip)) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    svg.append(node);
  }
  return svg;
}

/** "United States", "États-Unis" — the browser's own country names. */
function countryNames(codes: readonly string[]): string {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([langTag()], { type: "region" });
  } catch {
    /* an old browser: fall back to the codes */
  }
  const list = codes.map((c) => names?.of(c) ?? c);
  try {
    return new Intl.ListFormat([langTag()], { type: "conjunction" }).format(list);
  } catch {
    return list.join(", ");
  }
}

/** The flags of every country a region reaches, as one labelled image. */
export function flagRow(codes: readonly string[]): HTMLElement | null {
  const svgs = codes.map(flagSvg).filter((s): s is SVGSVGElement => s !== null);
  if (!svgs.length) return null;
  const label = countryNames(codes);
  const row = document.createElement("span");
  row.className = "flags";
  row.setAttribute("role", "img");
  row.setAttribute("aria-label", label);
  row.title = label;
  row.append(...svgs);
  return row;
}
