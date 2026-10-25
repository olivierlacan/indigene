// The arithmetic behind the growth charts (`components/growth-chart.ts`): a
// count series becomes a step line, and a moment on it becomes the point the
// reader is pointing at. DOM-free, so the unit test can hold it.

/** One count over time: `[when (epoch ms), value]`, oldest first. */
export type Series = Array<[number, number]>;

/**
 * The step line, and the area under it, in a `w × h` box: flat until the next
 * change, then straight up (or down) to it, and on to `end`. Each series gets
 * its own height, its peak at the top; zero sits on the bottom edge.
 */
export function stepPaths(series: Series, start: number, end: number, w: number, h: number): { line: string; area: string } {
  if (!series.length) return { line: "", area: "" };
  const peak = Math.max(1, ...series.map(([, v]) => v));
  const span = Math.max(1, end - start);
  const x = (t: number): number => round(((Math.min(Math.max(t, start), end) - start) / span) * w);
  const y = (v: number): number => round(h - (v / peak) * h);
  let line = `M${x(series[0][0])},${y(series[0][1])}`;
  for (let i = 1; i < series.length; i++) line += `H${x(series[i][0])}V${y(series[i][1])}`;
  line += `H${x(end)}`;
  const area = `${line}V${h}H${x(series[0][0])}Z`;
  return { line, area };
}

/** The index of the last point at or before `t` — what the line shows there. */
export function pointAt(times: number[], t: number): number {
  let i = 0;
  while (i + 1 < times.length && times[i + 1] <= t) i++;
  return i;
}

/** What the newest step added to each count: `[when, deltas…]`, or null for a
 *  list that has only ever had one size. */
export function latestChange(points: Array<[number, ...number[]]>): [number, number[]] | null {
  if (points.length < 2) return null;
  const [when, ...now] = points[points.length - 1];
  const [, ...before] = points[points.length - 2];
  return [when, now.map((v, i) => v - before[i])];
}

const round = (n: number): number => Math.round(n * 10) / 10;
