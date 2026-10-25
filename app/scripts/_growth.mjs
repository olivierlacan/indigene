// How each region's list grew: its plant and animal counts after every merge
// that changed them, read from git at build time.
//
// Nothing here is stored. The plant files are the only record of what a region
// holds, and git is the only record of when it got there, so the dates are
// worked out from the two on every build (the `indigene-growth` plugin in
// `vite.config.ts`) and can never disagree with the list on the page.
//
// A row's date is the **merge into main**, not the commit that wrote it: a
// reader can't see a plant before it deploys, and a PR can sit open for a week.
// So this walks main's first-parent history, oldest first. An animal reaches a
// region the first time a plant there names it in `SUPPORT` (`data/wildlife.ts`).
//
// The working tree is the last point, so the chart always ends on the list
// being built. On main, that point is the newest merge and adds nothing; on a
// branch with new rows it is "now".
//
// A shallow clone has no history to read, so it gets no chart rather than a
// wrong one. CI checkouts that build the real site fetch full history.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const DATA = "app/src/data";

/** `{ regions, all, added }`, or null with no usable history. */
export function readGrowth(root) {
  const git = (args, input) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 1 << 28,
      input,
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "ignore"],
    });
  try {
    if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") return null;
  } catch {
    return null; // not a git checkout at all
  }
  // The remote's main when we have it — a branch's own commits haven't shipped.
  let branch = "HEAD";
  try {
    git(["rev-parse", "--verify", "--quiet", "origin/main"]);
    branch = "origin/main";
  } catch {
    /* keep HEAD */
  }

  // File suffix → region id, from today's region files: `plants.florida.ts` is
  // "florida-central". History reads through this one map, so a renamed
  // region keeps its past.
  const ids = new Map();
  for (const name of git(["ls-files", `${DATA}/`]).split("\n")) {
    const m = /\/region\.([a-z0-9-]+)\.ts$/.exec(name);
    const id = m && /\bid:\s*"([^"]+)"/.exec(readFileSync(`${root}/${name}`, "utf8"));
    if (id) ids.set(m[1], id[1]);
  }
  const regionOf = (name) => {
    const m = /\/plants\.([a-z0-9-]+)\.ts$/.exec(name);
    return m ? (ids.get(m[1]) ?? m[1]) : null;
  };

  const log = git([
    "log", "--first-parent", "--reverse", "--format=%H %ct", branch, "--",
    `${DATA}/plants.*.ts`, `${DATA}/wildlife.ts`,
  ]).trim();
  if (!log) return null;
  const commits = log.split("\n").map((l) => {
    const [sha, secs] = l.split(" ");
    return { sha, at: minute(Number(secs) * 1000) };
  });

  // Each commit's tree, as blob ids. Most files don't change between commits,
  // so the same blob turns up again and again: read and parse each one once.
  const trees = commits.map(({ sha }) => {
    const files = [];
    for (const line of git(["ls-tree", sha, `${DATA}/`]).split("\n")) {
      const m = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(line);
      if (m && (regionOf(m[2]) || m[2].endsWith("/wildlife.ts"))) files.push({ blob: m[1], name: m[2] });
    }
    return files;
  });
  const blobs = readBlobs(git, [...new Set(trees.flat().map((f) => f.blob))]);

  const parsed = new Map();
  const parse = (f) => {
    if (!parsed.has(f.blob)) {
      const src = blobs.get(f.blob) ?? "";
      parsed.set(f.blob, regionOf(f.name) ? plantIds(src) : wildlifeByRegion(src));
    }
    return parsed.get(f.blob);
  };

  const snapshots = trees.map((files, i) => {
    const plants = new Map();
    let wildlife = new Map();
    for (const f of files) {
      if (regionOf(f.name)) plants.set(regionOf(f.name), parse(f));
      else wildlife = parse(f);
    }
    return { at: commits[i].at, plants, wildlife };
  });

  // The list being built, last.
  const plants = new Map();
  let wildlife = new Map();
  for (const name of git(["ls-files", `${DATA}/`]).split("\n")) {
    if (regionOf(name)) plants.set(regionOf(name), plantIds(readFileSync(`${root}/${name}`, "utf8")));
  }
  wildlife = wildlifeByRegion(readFileSync(`${root}/${DATA}/wildlife.ts`, "utf8"));
  snapshots.push({ at: minute(Date.now()), plants, wildlife });

  return summarise(snapshots);
}

/** Turn the per-commit snapshots into series, keeping only the points where a
 *  count moved, and each row's first appearance. Pure, for the unit test. */
export function summarise(snapshots) {
  const regions = {};
  const all = [];
  const added = { plants: {}, wildlife: {} };
  const last = snapshots[snapshots.length - 1];
  const stamp = (book, region, id, at) => {
    book[region] ??= {};
    book[region][id] ??= at;
  };
  const push = (series, point) => {
    const prev = series[series.length - 1];
    if (prev && prev.slice(1).every((v, i) => v === point[i + 1])) return;
    if (prev && prev[0] === point[0]) series.pop();
    series.push(point);
  };
  for (const { at, plants, wildlife } of snapshots) {
    let plantTotal = 0;
    let regionCount = 0;
    const animals = new Set();
    for (const [region, rows] of plants) {
      // A region whose plant file is gone has left the app; it stops counting.
      if (!last.plants.has(region)) continue;
      const wl = [...(wildlife.get(region) ?? [])];
      for (const id of rows) stamp(added.plants, region, id, at);
      for (const id of wl) stamp(added.wildlife, region, id, at);
      regions[region] ??= [];
      push(regions[region], [at, rows.length, wl.length]);
      plantTotal += rows.length;
      regionCount++;
      for (const id of wl) animals.add(id);
    }
    if (plantTotal) push(all, [at, plantTotal, animals.size, regionCount]);
  }
  // Rows that have left the data leave the dates too.
  for (const kind of ["plants", "wildlife"]) {
    for (const region of Object.keys(added[kind])) {
      const now = new Set(kind === "plants" ? last.plants.get(region) ?? [] : last.wildlife.get(region) ?? []);
      for (const id of Object.keys(added[kind][region])) if (!now.has(id)) delete added[kind][region][id];
    }
  }
  return { regions, all, added };
}

// A plant row's id sits at exactly four spaces of indent in `SEED_RAW`; deeper
// `id:`s belong to something nested in the row.
export const plantIds = (src) => [...src.matchAll(/^ {4}id: "([^"]+)"/gm)].map((m) => m[1]);

/** `SUPPORT` is keyed region → plant → links; a region key sits at two spaces. */
export function wildlifeByRegion(src) {
  const out = new Map();
  const at = src.indexOf("export const SUPPORT");
  if (at < 0) return out;
  let region = null;
  for (const line of src.slice(at).split("\n").slice(1)) {
    if (/^\};/.test(line)) break;
    const key = /^ {2}"?([a-z0-9-]+)"?: \{/.exec(line);
    if (key) {
      region = key[1];
      if (!out.has(region)) out.set(region, new Set());
    } else if (region) {
      for (const m of line.matchAll(/wildlifeId: "([^"]+)"/g)) out.get(region).add(m[1]);
    }
  }
  return out;
}

const minute = (ms) => new Date(ms).toISOString().slice(0, 16) + "Z";

/** Every blob in one `git cat-file --batch`, instead of a process per file. */
function readBlobs(git, ids) {
  const out = new Map();
  if (!ids.length) return out;
  const buf = Buffer.from(git(["cat-file", "--batch"], ids.join("\n") + "\n"), "utf8");
  let pos = 0;
  while (pos < buf.length) {
    const nl = buf.indexOf(10, pos);
    const [id, , size] = buf.toString("utf8", pos, nl).split(" ");
    const start = nl + 1;
    out.set(id, buf.toString("utf8", start, start + Number(size)));
    pos = start + Number(size) + 1;
  }
  return out;
}
