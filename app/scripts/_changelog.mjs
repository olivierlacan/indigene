// One entry, one file: reading the loose changelog entries in `changelog.d/`
// and folding them into CHANGELOG.md's Unreleased section.
//
// ## Why they're loose
//
// Every pull request carries a changelog entry, and every entry used to be
// appended to the end of the same three sections under `## [Unreleased]`. Two
// branches appending there is two insertions at one line boundary, which Git
// can only call a conflict — so merging any pull request left every other one
// needing a hand resolution of a file nobody actually disagreed about. It was
// in all of the last twenty merges.
//
// A branch that writes its own file collides with nothing. The entries are
// gathered back into one list when they're compiled, and physically folded into
// the changelog when a version is cut (`npm run changelog:fold`).
//
// ## What a fragment looks like
//
// Exactly what you would have pasted under `## [Unreleased]` — Keep a
// Changelog's own section headings, and bullets under them:
//
//     ### Fixed
//
//     - **The header keeps its green.** …
//     - Internal: …
//
// Nothing else is allowed in one: no version heading, no prose between the
// bullets, no section name outside Keep a Changelog's six. The rules for the
// words themselves don't change and aren't repeated here — they're at the top
// of CHANGELOG.md, and the compiler enforces the length ceiling on a fragment
// exactly as it does on a bullet already in the file.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Keep a Changelog's change types — the only headings a fragment may use.
 *  Mirrors SECTIONS in build-release-notes.mjs; both sides fail loudly on
 *  anything else, so a new heading can't quietly appear in one and not the
 *  other. */
export const SECTIONS = ["Added", "Changed", "Fixed", "Removed", "Deprecated", "Security"];

/** The directory of loose entries, relative to the repo root. */
export const FRAGMENT_DIR = "changelog.d";

/** Everything in there is a fragment except the note explaining what they are. */
const NOT_A_FRAGMENT = new Set(["README.md"]);

class FragmentError extends Error {}

/**
 * Read one fragment into `[{ title, lines }]`, in the order its sections
 * appear.
 *
 * `lines` are kept verbatim — a bullet and the indented lines that continue it
 * — so folding a fragment into the changelog is a copy, never a re-wrap.
 */
export function parseFragment(text, name) {
  const sections = [];
  let section = null;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (line === "") continue;

    const heading = line.match(/^### (.*)$/);
    if (heading) {
      if (!SECTIONS.includes(heading[1])) {
        throw new FragmentError(
          `${name}: unknown section "### ${heading[1]}" — expected one of: ${SECTIONS.join(", ")}`,
        );
      }
      section = sections.find((s) => s.title === heading[1]);
      if (!section) {
        section = { title: heading[1], lines: [] };
        sections.push(section);
      }
      continue;
    }

    if (/^## /.test(line)) {
      throw new FragmentError(
        `${name}: "${line}" — a fragment holds bullets, not a version. Versions are ` +
          `cut in CHANGELOG.md itself.`,
      );
    }

    if (!section) {
      throw new FragmentError(
        `${name}: "${line}" comes before any section — open the file with one of: ` +
          SECTIONS.map((s) => `### ${s}`).join(", "),
      );
    }

    if (/^- /.test(line) || (/^\s+\S/.test(line) && section.lines.length > 0)) {
      section.lines.push(line);
      continue;
    }

    throw new FragmentError(
      `${name}: "${line}" is neither a bullet nor the continuation of one. A fragment ` +
        `is section headings and "- " bullets, nothing else.`,
    );
  }

  if (!sections.length) throw new FragmentError(`${name}: no entries in it`);
  return sections;
}

/**
 * Every fragment on disk, oldest name first.
 *
 * Sorted by filename rather than by mtime: a checkout has no useful timestamps,
 * and two machines compiling the same commit have to produce the same page.
 * Within one release the order is editorial anyway — the fold is where a human
 * sees the list and can move a line.
 */
export function readFragments(repoRoot) {
  const dir = join(repoRoot, FRAGMENT_DIR);
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return []; // no directory yet — nothing to fold, which is not an error
  }
  return names
    .filter((n) => n.endsWith(".md") && !NOT_A_FRAGMENT.has(n))
    .sort()
    .map((name) => ({
      name,
      path: join(dir, name),
      sections: parseFragment(readFileSync(join(dir, name), "utf8"), `${FRAGMENT_DIR}/${name}`),
    }));
}

/**
 * Put the fragments' bullets into the changelog's Unreleased section and hand
 * back the whole file.
 *
 * The compiler runs this in memory on every build, so a fragment is checked —
 * for its length, its sections, its shape — in the pull request that writes it
 * rather than months later when the version is cut. `npm run changelog:fold`
 * runs the same thing and writes the result to disk.
 *
 * Only the Unreleased block is rebuilt, and only from what was parsed out of
 * it, so released versions and the file's header come through untouched.
 */
export function foldFragments(changelog, fragments) {
  if (!fragments.length) return changelog;

  const lines = changelog.split("\n");
  const start = lines.findIndex((l) => l === "## [Unreleased]");
  if (start === -1) fail("CHANGELOG.md has no `## [Unreleased]` heading to fold into");
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;

  // What's already there. Anything that isn't a heading, a bullet, or blank
  // would be silently reformatted by the re-emit below, so it's an error
  // instead — Unreleased is a list, and the release's own prose (its name, its
  // thumbnail) is written when the version is cut.
  const sections = [];
  let section = null;
  for (let i = start + 1; i < end; i++) {
    const line = lines[i].replace(/\s+$/, "");
    if (line === "") continue;
    const heading = line.match(/^### (.*)$/);
    if (heading) {
      if (!SECTIONS.includes(heading[1])) {
        fail(`unknown section "### ${heading[1]}" under Unreleased`);
      }
      section = { title: heading[1], lines: [] };
      sections.push(section);
      continue;
    }
    if (!section || !(/^- /.test(line) || /^\s+\S/.test(line))) {
      fail(`Unreleased holds something that isn't a bullet: "${line}"`);
    }
    section.lines.push(line);
  }

  for (const fragment of fragments) {
    for (const from of fragment.sections) {
      let into = sections.find((s) => s.title === from.title);
      if (!into) {
        into = { title: from.title, lines: [] };
        // Keep a Changelog's order, so a section that appears for the first
        // time lands where a reader expects it rather than at the bottom.
        const at = sections.findIndex(
          (s) => SECTIONS.indexOf(s.title) > SECTIONS.indexOf(from.title),
        );
        if (at === -1) sections.push(into);
        else sections.splice(at, 0, into);
      }
      into.lines.push(...from.lines);
    }
  }

  const rebuilt = ["## [Unreleased]"];
  for (const s of sections) rebuilt.push("", `### ${s.title}`, "", ...s.lines);
  rebuilt.push("");
  return [...lines.slice(0, start), ...rebuilt, ...lines.slice(end)].join("\n");
}

function fail(msg) {
  throw new FragmentError(msg);
}

/** Report a fragment problem the way every script here reports one: the reason,
 *  and a non-zero exit. */
export function reportFragmentError(err, script) {
  if (!(err instanceof FragmentError)) throw err;
  console.error(`${script}: ${err.message}`);
  process.exit(1);
}
