# One entry, one file

Your pull request's changelog entry goes here, in a file of its own, instead of
at the end of a section in `CHANGELOG.md`.

That's the whole reason for this directory: every pull request adds an entry,
and when every entry is appended to the same three sections, two branches are
always inserting at the same line. Git can only call that a conflict, so merging
any pull request left every other one needing a hand resolution of a file nobody
disagreed about. A branch that writes its own file collides with nothing.

## Writing one

Name the file after your branch or your change — anything unique, ending in
`.md`. Inside, write what you would have pasted under `## [Unreleased]`:

```markdown
### Fixed

- **A tab you come back to keeps its colours.** A page left open for a day could
  come back washed out, its greens gone until you reloaded. Indigene now spots
  that on the way back in and paints itself again.
- Internal: the restore path drops the palette; `lib/restore.ts` rebuilds it.
```

Section headings are Keep a Changelog's own — `Added`, `Changed`, `Fixed`,
`Removed`, `Deprecated`, `Security` — and a file may use more than one. Nothing
else belongs in here: no version heading, no prose between the bullets.

**The rules for the words are the ones at the top of [`CHANGELOG.md`](../CHANGELOG.md)**,
unchanged: plain and warm, because these are published verbatim to everyone; one
change per bullet, about 35 words and 50 at the outside; developer housekeeping
starts with `Internal:` and never reaches the page. `npm run release-notes`
compiles this directory along with the changelog, so a bullet that breaks a rule
fails the build in your pull request, not months later.

## What happens to it

Nothing, until a version is cut. Then `npm run changelog:fold` moves every file
here into `CHANGELOG.md` under Unreleased and deletes them — copied verbatim, in
filename order, for a human to read back and reorder before naming the release.
