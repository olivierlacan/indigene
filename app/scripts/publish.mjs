// Publish the built site without GitHub Actions.
//
//   node scripts/publish.mjs cloudflare   # upload dist/ to Cloudflare Pages
//   node scripts/publish.mjs gh-pages     # push dist/ to the gh-pages branch
//   node scripts/publish.mjs --dry-run …  # build and report, publish nothing
//
// ## Why this exists
//
// The normal deploy is `.github/workflows/deploy.yml`, and it is fine right up
// until the moment it isn't. On 2026-08-06 the build job passed in 39 seconds
// and the *deploy* job never got a runner: it sat for fifteen minutes with no
// steps recorded and was cancelled, and two merges sat undeployed behind it.
// Nothing was wrong with the site. There was simply no way to publish it.
//
// So this is the way to publish it. It runs on a laptop, needs no runner, and
// takes the same `dist/` the workflow would have uploaded.
//
// ## The two targets, and why both
//
// **cloudflare** is the real backup: it takes GitHub out of the path entirely.
// A direct upload — no repository integration, no build on their side, nothing
// to keep in sync. It also leaves a permanent indigene.pages.dev serving the
// current build, which is a URL you can hand out during an outage without
// touching DNS at all.
//
// **gh-pages** is the escape hatch that keeps you on the same host: GitHub's
// own branch-based Pages pipeline builds it, not the hosted-runner pool that
// failed. That is a different subsystem, so it survives the failure above — it
// would not survive a Pages-wide incident, which is what the other target is
// for.
//
// Both serve `404.html` for unknown paths, which this app depends on far more
// than most: every deep link below a page (/plants/quercus-alba/ecosystem,
// /wildlife/in/pnw) and every flow step (/results) is bounced into its hash
// route by public/404.html. A host that answers those with its own error page
// breaks all of them silently. Check that before adding a third target.
//
// ## The one setting that isn't in this file
//
// GitHub Pages serves *either* a branch or an Actions artifact, never both, and
// the choice lives in the repo's Settings → Pages. Using the gh-pages target
// means flipping that switch by hand — see docs/publishing.md, which also
// explains why `enablement: true` had to come out of the workflow for the
// switch to stay flipped.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const DIST = join(APP, "dist");

const TARGETS = ["cloudflare", "gh-pages"];

/** The Cloudflare Pages project the direct upload lands in. */
const CF_PROJECT = "indigene";

/** The branch GitHub Pages serves in branch mode. Force-pushed, single commit:
 *  a deploy branch's history is noise, and 25 MB of it per publish is noise
 *  that costs something. */
const PAGES_BRANCH = "gh-pages";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const target = args.find((a) => !a.startsWith("--"));

if (!TARGETS.includes(target)) {
  console.error(
    `publish: say which target — ${TARGETS.join(" | ")}\n` +
      "  node scripts/publish.mjs cloudflare\n" +
      "  node scripts/publish.mjs gh-pages [--dry-run]"
  );
  process.exit(1);
}

/** Run a command, letting its output through to the terminal. A publish is a
 *  thing you watch, and a swallowed npm error is a thing you debug twice. */
function run(cmd, cmdArgs, opts = {}) {
  execFileSync(cmd, cmdArgs, { stdio: "inherit", cwd: APP, ...opts });
}

function capture(cmd, cmdArgs, opts = {}) {
  return execFileSync(cmd, cmdArgs, { encoding: "utf8", cwd: APP, ...opts }).trim();
}

/**
 * Build exactly what the workflow builds, in exactly its order.
 *
 * The order is not incidental: `npm run build` empties dist/ (Vite's
 * `emptyOutDir`) and then fills it, so compiling the What's new page first
 * would delete it. deploy.yml runs these two in this sequence for the same
 * reason; if that ever changes, change it here too.
 */
function build() {
  console.log("→ building (tsc, vite, prerender)…");
  run("npm", ["run", "build"]);
  console.log("→ compiling the What's new page from CHANGELOG.md…");
  run("npm", ["run", "release-notes"]);

  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("publish: the build produced no dist/index.html");
  }
  // The custom domain lives in public/CNAME and rides into dist/ with every
  // other public file. Without it a branch-mode Pages deploy answers on
  // <user>.github.io and drops indigene.app on the floor, which looks exactly
  // like a DNS problem and isn't one.
  if (!existsSync(join(DIST, "CNAME"))) {
    throw new Error("publish: dist/CNAME is missing — the custom domain would be dropped");
  }
  if (!existsSync(join(DIST, "404.html"))) {
    throw new Error("publish: dist/404.html is missing — every deep link would break");
  }
  const files = countFiles(DIST);
  console.log(`→ built ${files} files into dist/`);
}

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

/**
 * Upload dist/ straight to Cloudflare Pages.
 *
 * Authentication is wrangler's business, not ours: it reads CLOUDFLARE_API_TOKEN
 * when there is one and opens a browser when there isn't. Passing credentials
 * through this script would only add a place for them to leak.
 */
function publishCloudflare() {
  console.log(`→ uploading to Cloudflare Pages project "${CF_PROJECT}"…`);
  run("npx", [
    "--yes",
    "wrangler@latest",
    "pages",
    "deploy",
    "dist",
    "--project-name",
    CF_PROJECT,
    // Cloudflare treats one branch as production and the rest as previews.
    // A publish from here is always the real thing.
    "--branch",
    "main",
  ]);
}

/**
 * Force-push dist/ to the gh-pages branch.
 *
 * Built in a throwaway repository rather than a worktree or an orphan checkout,
 * because those both reach into the repository you are standing in — and the
 * one moment you run this is the moment you least want a publish script
 * rearranging your working tree. Nothing here touches it: a temp directory, a
 * fresh `git init`, one commit, one push, and the directory goes away.
 */
function publishGhPages() {
  const remote = capture("git", ["remote", "get-url", "origin"]);
  const sha = capture("git", ["rev-parse", "--short", "HEAD"]);
  const staging = mkdtempSync(join(tmpdir(), "indigene-pages-"));
  try {
    cpSync(DIST, staging, { recursive: true });
    // Without this, Pages runs the built output through Jekyll, which silently
    // drops anything whose name begins with an underscore.
    writeFileSync(join(staging, ".nojekyll"), "");

    const git = (...a) => run("git", a, { cwd: staging });
    git("init", "-q", "-b", PAGES_BRANCH);
    git("add", "-A");
    git(
      "-c", "user.name=publish.mjs",
      "-c", "user.email=publish@indigene.app",
      "commit", "-q", "-m", `Publish ${sha} without Actions`
    );
    console.log(`→ force-pushing ${PAGES_BRANCH} to origin…`);
    git("push", "--force", remote, `${PAGES_BRANCH}:${PAGES_BRANCH}`);
    console.log(
      `\n  Pushed. This is live only once Settings → Pages has\n` +
        `  Source = "Deploy from a branch", branch ${PAGES_BRANCH} / root.\n` +
        `  See docs/publishing.md before flipping it back.`
    );
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

build();
if (dryRun) {
  console.log(`\n  --dry-run: built only, nothing published to ${target}.`);
} else if (target === "cloudflare") {
  publishCloudflare();
} else {
  publishGhPages();
}
