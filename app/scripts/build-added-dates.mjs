// When each native plant, and each animal, first reached each region — the date
// it shipped, so the app can show "new since your last visit" or sort a region
// by what arrived most recently.
//
//   npm run added            # refresh src/data/added.json
//   npm run added -- --dry-run
//
// ## Where the dates come from
//
// Git. A plant is "added" to a region on the day its row first appears in that
// region's `plants.<region>.ts` **on main** — the merge, not the commit that
// wrote it, because a reader can't see a plant before it deploys and a PR can
// sit open for a week. So this walks main's first-parent history oldest first
// and keeps the committer time (UTC, to the minute) of the first commit
// carrying each row. An animal
// is added to a region the first time any plant there names it in `SUPPORT`
// (`data/wildlife.ts`).
//
// ## Why the result is committed, not only computed
//
// The ledger is the record; git is only how it gets filled. Dates already in
// `added.json` are kept as they are and history only fills the gaps, so the
// dates survive a squashed import, a shallow clone, or a file moved under a
// name this script doesn't follow. Rows that left the data leave the ledger too.
// A row not yet on main (an open PR) gets no date until it merges.
//
// The deploy runs this with full history before building, so the live app
// always carries the merge date of everything it ships — no network involved,
// only the local repository.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DRY = process.argv.includes("--dry-run");
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const OUT = fileURLToPath(new URL("../src/data/added.json", import.meta.url));
const DATA = "app/src/data";

const git = (...args) =>
  execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
  console.error("added: this clone is shallow — run `git fetch --unshallow` first.");
  process.exit(1);
}

// main as the remote has it when we have it (a feature branch's own commits
// haven't shipped), else HEAD — the deploy checks out main itself.
const BRANCH = (() => {
  try {
    git("rev-parse", "--verify", "--quiet", "origin/main");
    return "origin/main";
  } catch {
    return "HEAD";
  }
})();

// File suffix → region id, read from today's region files: `plants.florida.ts`
// is the "florida-central" region. History is read through this one map, so a
// region renamed since keeps its dates under its current id.
const regionIdOf = (() => {
  const map = new Map();
  for (const name of git("ls-tree", "--name-only", "HEAD", `${DATA}/`).split("\n")) {
    const m = /\/region\.([a-z0-9-]+)\.ts$/.exec(name);
    if (!m) continue;
    const id = /\bid:\s*"([^"]+)"/.exec(readFileSync(`${ROOT}/${name}`, "utf8"));
    if (id) map.set(m[1], id[1]);
  }
  return (suffix) => map.get(suffix) ?? suffix;
})();

// A plant row's id sits at exactly four spaces of indent in `SEED_RAW`; deeper
// `id:`s belong to something nested in the row.
const plantIds = (src) => [...src.matchAll(/^ {4}id: "([^"]+)"/gm)].map((m) => m[1]);

// `SUPPORT` is keyed region → plant → links; a region key sits at two spaces.
function wildlifeByRegion(src) {
  const at = src.indexOf("export const SUPPORT");
  if (at < 0) return new Map();
  const out = new Map();
  let region = null;
  for (const line of src.slice(at).split("\n").slice(1)) {
    const key = /^ {2}"?([a-z0-9-]+)"?: \{/.exec(line);
    if (key) {
      region = key[1];
      if (!out.has(region)) out.set(region, new Set());
      continue;
    }
    if (/^\};/.test(line)) break;
    if (!region) continue;
    for (const m of line.matchAll(/wildlifeId: "([^"]+)"/g)) out.get(region).add(m[1]);
  }
  return out;
}

const show = (sha, path) => {
  try {
    return git("show", `${sha}:${path}`);
  } catch {
    return null;
  }
};

const commits = git(
  "log", "--first-parent", "--reverse", "--format=%H %ct", BRANCH, "--",
  `${DATA}/plants.*.ts`, `${DATA}/wildlife.ts`,
)
  .trim()
  .split("\n")
  .map((l) => {
    const [sha, secs] = l.split(" ");
    // To the minute, in UTC: "since your last visit" is a comparison with a
    // timestamp, and a day is too coarse for two visits on a merge day.
    return { sha, day: new Date(Number(secs) * 1000).toISOString().slice(0, 16) + "Z" };
  });

const found = { plants: {}, wildlife: {} };
const stamp = (book, region, id, day) => {
  book[region] ??= {};
  book[region][id] ??= day;
};

for (const { sha, day } of commits) {
  const files = git("ls-tree", "--name-only", sha, `${DATA}/`).split("\n");
  for (const name of files) {
    const m = /\/plants\.([a-z0-9-]+)\.ts$/.exec(name);
    if (!m) continue;
    const src = show(sha, name);
    if (src) for (const id of plantIds(src)) stamp(found.plants, regionIdOf(m[1]), id, day);
  }
  const wl = show(sha, `${DATA}/wildlife.ts`);
  if (wl) {
    for (const [region, ids] of wildlifeByRegion(wl)) {
      for (const id of ids) stamp(found.wildlife, region, id, day);
    }
  }
}

// What ships today: the working tree, so the ledger lists exactly the rows that
// exist, dated or not yet.
const current = { plants: new Map(), wildlife: new Map() };
for (const name of git("ls-files", `${DATA}/`).split("\n")) {
  const m = /\/plants\.([a-z0-9-]+)\.ts$/.exec(name);
  if (m) current.plants.set(regionIdOf(m[1]), plantIds(readFileSync(`${ROOT}/${name}`, "utf8")));
}
for (const [region, ids] of wildlifeByRegion(readFileSync(`${ROOT}/${DATA}/wildlife.ts`, "utf8"))) {
  current.wildlife.set(region, [...ids]);
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { plants: {}, wildlife: {} };

const sortObj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
const ledger = {};
const undated = [];
let kept = 0;
let filled = 0;
for (const kind of ["plants", "wildlife"]) {
  const book = {};
  for (const [region, ids] of current[kind]) {
    const row = {};
    for (const id of ids) {
      const day = previous[kind]?.[region]?.[id] ?? found[kind][region]?.[id];
      if (!day) {
        undated.push(`${kind} ${region}/${id}`);
        continue;
      }
      if (previous[kind]?.[region]?.[id]) kept++;
      else filled++;
      row[id] = day;
    }
    book[region] = sortObj(row);
  }
  ledger[kind] = sortObj(book);
}

const json = JSON.stringify(ledger, null, 2) + "\n";
console.log(`added: ${kept} dates kept, ${filled} filled from ${BRANCH} (${commits.length} commits).`);
if (undated.length) console.log(`added: ${undated.length} not on ${BRANCH} yet, left undated — e.g. ${undated.slice(0, 3).join(", ")}`);
if (DRY) process.exit(0);
writeFileSync(OUT, json);
console.log(`added: wrote ${OUT.replace(ROOT, "")}`);
