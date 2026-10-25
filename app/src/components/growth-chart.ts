// "Plants and animals over time": a quiet chart at the foot of a region's page,
// and of the Regions index for every region together. One thin step line per
// count, small multiples with a scale each, so the animals don't sit flat under
// a thousand plants. Pointing at it (or tapping it) reads out that day.
//
// The counts come from `virtual:growth`, worked out from git and the plant files
// at build time — never stored, so they can't drift from the list on the page.
// A build without history has no data, and the section is simply absent.
import growth from "virtual:growth";
import { el } from "../ui";
import { t, tn, fmtNumber, fmtDate, langTag } from "../lib/i18n";
import { latestChange, pointAt, stepPaths } from "../lib/growth";
import type { Series } from "../lib/growth";

const SVG = "http://www.w3.org/2000/svg";
const W = 300;
const H = 28;

type Count = "growth.plants" | "growth.animals" | "growth.regions";
type CountKey = "growth.plantCount" | "growth.animalCount" | "growth.regionCount";
const ROWS: Array<{ label: Count; unit: CountKey }> = [
  { label: "growth.plants", unit: "growth.plantCount" },
  { label: "growth.animals", unit: "growth.animalCount" },
  { label: "growth.regions", unit: "growth.regionCount" },
];

/** One region's chart, or nothing. */
export function regionGrowth(regionId: string): HTMLElement[] {
  const pts = growth?.regions[regionId];
  return pts ? growthSection(pts, t("growth.lede")) : [];
}

/** Every region's chart together, or nothing. */
export function allGrowth(): HTMLElement[] {
  return growth?.all.length ? growthSection(growth.all, t("growth.ledeAll")) : [];
}

function growthSection(raw: Array<[string, ...number[]]>, lede: string): HTMLElement[] {
  const points = raw.map(([at, ...v]) => [Date.parse(at), ...v] as [number, ...number[]]);
  const times = points.map((p) => p[0]);
  const start = times[0];
  const end = Math.max(Date.now(), times[times.length - 1]);
  const rows = ROWS.slice(0, points[0].length - 1);

  const cross: SVGLineElement[] = [];
  const grid = el("div", { class: "growth-grid" });
  rows.forEach((row, i) => {
    const series: Series = points.map((p) => [p[0], p[i + 1]]);
    const { line, area } = stepPaths(series, start, end, W, H);
    const svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "growth-plot");
    const fill = document.createElementNS(SVG, "path");
    fill.setAttribute("d", area);
    fill.setAttribute("class", "growth-area");
    const stroke = document.createElementNS(SVG, "path");
    stroke.setAttribute("d", line);
    stroke.setAttribute("class", "growth-line");
    const hair = document.createElementNS(SVG, "line");
    hair.setAttribute("y1", "0");
    hair.setAttribute("y2", String(H));
    hair.setAttribute("class", "growth-cross");
    cross.push(hair);
    svg.append(fill, stroke, hair);
    grid.append(
      el("span", { class: "growth-label" }, t(row.label)),
      svg,
      el("span", { class: "growth-value" }, fmtNumber(series[series.length - 1][1])),
    );
  });
  grid.append(
    el("span", {}),
    el("span", { class: "growth-axis" }, [
      el("span", {}, monthYear(start)),
      el("span", {}, t("growth.today")),
    ]),
    el("span", {}),
  );

  const counts = (vals: number[], signed: boolean): string =>
    vals
      .map((n, i) => (signed && !n ? "" : `${signed ? "+" : ""}${tn(rows[i].unit, n, { n: fmtNumber(n) })}`))
      .filter(Boolean)
      .join(", ");
  const change = latestChange(points);
  const resting = change
    ? t("growth.latest", { date: fmtDate(change[0]), changes: counts(change[1], true) })
    : t("growth.since", { date: fmtDate(start) });
  const readout = el("p", { class: "growth-readout", "aria-live": "polite" }, resting);

  // Point anywhere on a row: the hairline moves to that moment on every row,
  // and the readout says what the list held then.
  const show = (e: PointerEvent): void => {
    const box = (e.currentTarget as HTMLElement).querySelector(".growth-plot")!.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const i = pointAt(times, start + f * (end - start));
    const x = String(Math.round(f * W * 10) / 10);
    for (const c of cross) {
      c.setAttribute("x1", x);
      c.setAttribute("x2", x);
    }
    grid.classList.add("pointing");
    readout.textContent = `${fmtDate(times[i])}: ${counts(points[i].slice(1) as number[], false)}`;
  };
  const rest = (): void => {
    grid.classList.remove("pointing");
    readout.textContent = resting;
  };
  grid.addEventListener("pointermove", show);
  grid.addEventListener("pointerdown", show);
  grid.addEventListener("pointerleave", rest);

  return [
    el("section", { class: "growth" }, [
      el("h3", { class: "section-head" }, t("growth.title")),
      el("p", { class: "obs-section-lede" }, lede),
      grid,
      readout,
    ]),
  ];
}

const monthYear = (ms: number): string =>
  new Intl.DateTimeFormat(langTag(), { month: "short", year: "numeric" }).format(new Date(ms));
