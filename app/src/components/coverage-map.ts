// The pictures on the map page (`steps/map.ts`): the world, then each
// continent with a region in it (issue #254).
//
// They are drawn at build time (`scripts/_coverage-map.mjs`). The names are
// links laid over them from the generated table, so they translate with the
// app and each one opens its region. Same reasoning as the region maps: a
// plain <img>, no map library, nothing fetched from anyone else.
//
// **Where a name goes is worked out on the page**, not at build time. A name's
// width depends on the language and the font, and North America at 360 px has
// ten of them in three hundred pixels: "Nord-Ouest Pacifique" needs room that
// "Pacific Northwest" doesn't. So each name is measured where it will be read
// and tried on every side of its dot, and a line up or down beside it — the
// side the table prefers first — taking the first spot that stays in the
// picture and clear of every name and dot already placed. The same rule the
// region maps' cities follow.
import { el } from "../ui";
import { REGIONS } from "../lib/plants";
import { type CoverageMap, type LabelSide } from "../data/coverage-map";
import { regionShort } from "../lib/names";

export function coverageFrame(map: CoverageMap, alt: string): HTMLElement {
  const byId = new Map(REGIONS.map((r) => [r.meta.id, r.meta]));
  const labels = map.labels.flatMap((l) => {
    const meta = byId.get(l.id);
    if (!meta) return [];
    const node = el("a", { class: "coverage-label", href: `#/regions/${l.id}` }, regionShort(meta));
    return [{ ...l, node }];
  });
  const box = el("div", { class: "coverage-frame" }, [
    el("img", {
      src: `${import.meta.env.BASE_URL}maps/coverage-${map.id}.svg`,
      alt,
      width: String(map.w),
      height: String(map.h),
      loading: "lazy",
      decoding: "async",
    }),
    ...labels.map((l) => l.node),
  ]);
  const place = () => layout(box, map, labels);
  // Fires once the frame is on the page and again whenever its width changes;
  // the fonts can land after the first pass and change every width.
  new ResizeObserver(place).observe(box);
  document.fonts?.ready.then(place);
  return box;
}

type Rect = { x1: number; y1: number; x2: number; y2: number };
type Side = LabelSide | "ne" | "se" | "nw" | "sw" | "right-up" | "right-down" | "left-up" | "left-down";
const GAP = 5;
const DOT = 5;
const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)) *
  Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));

/** Top-left corner of a w×h label on `side` of the dot at (x, y). */
function at(side: Side, x: number, y: number, w: number, h: number): [number, number] {
  switch (side) {
    case "right": return [x + GAP, y - h / 2];
    case "left": return [x - GAP - w, y - h / 2];
    case "above": return [x - w / 2, y - GAP - h];
    case "below": return [x - w / 2, y + GAP];
    case "ne": return [x + 1, y - GAP - h + 2];
    case "se": return [x + 1, y + GAP - 2];
    case "nw": return [x - 1 - w, y - GAP - h + 2];
    case "sw": return [x - 1 - w, y + GAP - 2];
    // Beside the dot but slid a line up or down, for a crowded column.
    case "right-up": return [x + GAP, y - h * 1.2];
    case "right-down": return [x + GAP, y + h * 0.2];
    case "left-up": return [x - GAP - w, y - h * 1.2];
    case "left-down": return [x - GAP - w, y + h * 0.2];
  }
}

/**
 * Where each name goes, in pixels, on a W×H picture. Labels come in priority
 * order with their dot (x, y, in pixels), their measured size and the side
 * they'd like; each takes the first side that is clear, or failing that the
 * least crowded. Nothing ever leaves the picture.
 */
export function placeLabels(
  W: number,
  H: number,
  labels: { x: number; y: number; w: number; h: number; side: LabelSide }[],
): { left: number; top: number }[] {
  const dots = labels.map(({ x, y }) => ({ x1: x - DOT, y1: y - DOT, x2: x + DOT, y2: y + DOT }));
  const placed: Rect[] = [];
  return labels.map(({ x, y, w, h, side: preferred }, i) => {
    const sides: Side[] = [
      preferred, "right", "left", "above", "below", "ne", "se", "nw", "sw",
      "right-up", "right-down", "left-up", "left-down",
    ];
    let best: { r: Rect; cost: number } | null = null;
    for (const side of sides) {
      const [lx, ly] = at(side, x, y, w, h);
      // Kept inside the picture whatever happens; a clamped name may sit a
      // little off its dot, which beats running off the screen.
      const cx = Math.min(Math.max(lx, 0), W - w);
      const cy = Math.min(Math.max(ly, 0), H - h);
      const r = { x1: cx, y1: cy, x2: cx + w, y2: cy + h };
      const cost =
        placed.reduce((s, p) => s + overlap(r, p), 0) +
        dots.reduce((s, d, j) => s + (j === i ? 0 : overlap(r, d)), 0) +
        // Clamping is a small cost, so an unclamped spot wins a tie.
        (Math.abs(cx - lx) + Math.abs(cy - ly)) * 2;
      if (!best || cost < best.cost) best = { r, cost };
      if (cost === 0) break;
    }
    placed.push(best!.r);
    return { left: best!.r.x1, top: best!.r.y1 };
  });
}

function layout(
  box: HTMLElement,
  map: CoverageMap,
  labels: (CoverageMap["labels"][number] & { node: HTMLElement })[],
): void {
  const W = box.clientWidth;
  if (!W) return;
  const H = (W * map.h) / map.w;
  const spots = placeLabels(W, H, labels.map((l) => ({
    x: (l.x / 100) * W,
    y: (l.y / 100) * H,
    w: l.node.offsetWidth,
    h: l.node.offsetHeight,
    side: l.side,
  })));
  labels.forEach((l, i) => {
    l.node.style.left = `${spots[i].left}px`;
    l.node.style.top = `${spots[i].top}px`;
  });
}
