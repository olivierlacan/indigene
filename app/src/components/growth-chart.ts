// "Plants and animals over time": a quiet chart at the foot of a region's page,
// and of the Regions index for every region together. Plants and animals share
// one chart and one scale, so their heights compare: a step line each, in two
// hues, with the count at each line's end. Pointing at it (or tapping it)
// reads out that day.
//
// The counts come from `virtual:growth`, worked out from git and the plant files
// at build time — never stored, so they can't drift from the list on the page.
// A build without history has no data, and the section is simply absent.
import growth from "virtual:growth";
import { el } from "../ui";
import { t, tn, fmtNumber, fmtDate, langTag } from "../lib/i18n";
import { latestChange, pointAt, spreadLabels, stepPaths } from "../lib/growth";
import type { Series } from "../lib/growth";

const SVG = "http://www.w3.org/2000/svg";
const W = 300;
const H = 80;
/** Room an end label needs, as a fraction of the plot's height (`.growth-plot`
 *  is 4.5rem; a label is about 1.1rem). */
const LABEL_GAP = 0.25;

type CountKey = "growth.plantCount" | "growth.animalCount" | "growth.regionCount";
/** What each value in a point counts, in order. Regions are only read out:
 *  eighteen of them drawn beside a thousand plants would be a flat line. */
const UNITS: CountKey[] = ["growth.plantCount", "growth.animalCount", "growth.regionCount"];
const DRAWN = [
  { cls: "plants", unit: UNITS[0] },
  { cls: "animals", unit: UNITS[1] },
] as const;

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
  const peak = Math.max(1, ...points.flatMap((p) => DRAWN.map((_, i) => p[i + 1])));
  const latest = points[points.length - 1];
  const count = (unit: CountKey, n: number): string => tn(unit, n, { n: fmtNumber(n) });

  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "growth-plot");
  const paths = DRAWN.map((s, i) => {
    const series: Series = points.map((p) => [p[0], p[i + 1]]);
    return { ...s, ...stepPaths(series, start, end, W, H, peak) };
  });
  // Washes first, both under both lines, so neither line hides behind the
  // other's fill.
  for (const p of paths) svg.append(path(p.area, `growth-area ${p.cls}`));
  for (const p of paths) svg.append(path(p.line, `growth-line ${p.cls}`));
  const hair = document.createElementNS(SVG, "line");
  hair.setAttribute("y1", "0");
  hair.setAttribute("y2", String(H));
  hair.setAttribute("class", "growth-cross");
  svg.append(hair);

  // The hovered day's value on each line, as HTML so the dots stay round on a
  // plot that stretches.
  const dots = DRAWN.map((s) => el("span", { class: `growth-dot ${s.cls}` }));
  const plot = el("div", { class: "growth-plot-box" }, [svg, ...dots]);

  // Each line's count at its end, nudged apart when the two run close.
  const at = spreadLabels(DRAWN.map((_, i) => latest[i + 1]), peak, LABEL_GAP);
  const ends = el("div", { class: "growth-ends" }, DRAWN.map((s, i) =>
    el("span", { class: `growth-end ${s.cls}`, style: `top:${(at[i] * 100).toFixed(1)}%` },
      count(s.unit, latest[i + 1]))
  ));

  const chart = el("div", { class: "growth-chart" }, [
    plot,
    ends,
    el("span", { class: "growth-axis" }, [
      el("span", {}, monthYear(start)),
      el("span", {}, t("growth.today")),
    ]),
  ]);

  const counts = (vals: number[], signed: boolean): string =>
    vals
      .map((n, i) => (signed && !n ? "" : `${signed ? "+" : ""}${count(UNITS[i], n)}`))
      .filter(Boolean)
      .join(", ");
  const change = latestChange(points);
  const resting = change
    ? t("growth.latest", { date: fmtDate(change[0]), changes: counts(change[1], true) })
    : t("growth.since", { date: fmtDate(start) });
  const readout = el("p", { class: "growth-readout", "aria-live": "polite" }, resting);

  // Point anywhere on the plot: the hairline and the dots move to that moment,
  // and the readout says what the list held then.
  const show = (e: PointerEvent): void => {
    const box = svg.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const i = pointAt(times, start + f * (end - start));
    const x = String(Math.round(f * W * 10) / 10);
    hair.setAttribute("x1", x);
    hair.setAttribute("x2", x);
    DRAWN.forEach((_, k) => {
      dots[k].style.left = `${(f * 100).toFixed(1)}%`;
      dots[k].style.top = `${((1 - points[i][k + 1] / peak) * 100).toFixed(1)}%`;
    });
    chart.classList.add("pointing");
    readout.textContent = `${fmtDate(times[i])}: ${counts(points[i].slice(1) as number[], false)}`;
  };
  const rest = (): void => {
    chart.classList.remove("pointing");
    readout.textContent = resting;
  };
  plot.addEventListener("pointermove", show);
  plot.addEventListener("pointerdown", show);
  plot.addEventListener("pointerleave", rest);

  return [
    el("section", { class: "growth" }, [
      el("h3", { class: "section-head" }, t("growth.title")),
      el("p", { class: "obs-section-lede" }, lede),
      chart,
      readout,
    ]),
  ];
}

function path(d: string, cls: string): SVGPathElement {
  const p = document.createElementNS(SVG, "path");
  p.setAttribute("d", d);
  p.setAttribute("class", cls);
  return p;
}

const monthYear = (ms: number): string =>
  new Intl.DateTimeFormat(langTag(), { month: "short", year: "numeric" }).format(new Date(ms));
