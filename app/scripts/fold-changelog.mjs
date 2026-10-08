// Fold the loose entries in `changelog.d/` into CHANGELOG.md's Unreleased
// section, and delete them.
//
//   npm run changelog:fold
//
// Run this when cutting a version — it's the first step of the procedure in
// CLAUDE.md, before Unreleased is retitled and `app/package.json` is bumped.
// Nothing else needs it: the What's new page compiles the fragments in memory
// on every build, so an unfolded entry is already checked and already counted.
//
// It does one job. Naming the release, dating it, bumping the version and
// ordering the bullets are editorial, and this leaves them to you — what it
// guarantees is that no wording is lost or re-wrapped on the way in.
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { foldFragments, readFragments, reportFragmentError } from "./_changelog.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const CHANGELOG = resolve(REPO, "CHANGELOG.md");

try {
  const fragments = readFragments(REPO);
  if (!fragments.length) {
    console.log("changelog: nothing loose to fold — Unreleased is already the whole story.");
    process.exit(0);
  }

  const folded = foldFragments(readFileSync(CHANGELOG, "utf8"), fragments);
  writeFileSync(CHANGELOG, folded);
  for (const f of fragments) unlinkSync(f.path);

  const bullets = fragments.reduce(
    (n, f) => n + f.sections.reduce((m, s) => m + s.lines.filter((l) => l.startsWith("- ")).length, 0),
    0,
  );
  console.log(
    `changelog: folded ${bullets} bullet(s) from ${fragments.length} file(s) into Unreleased:`,
  );
  for (const f of fragments) console.log(`  ${f.name}`);
  console.log("Read the section back before you cut the version — the order is yours to set.");
} catch (err) {
  reportFragmentError(err, "fold-changelog");
}
