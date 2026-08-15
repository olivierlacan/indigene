# Working in this repo

## Every word is short by default

Indigene is a tool for someone with a goal — *what do I plant in this corner?*
— not an encyclopedia of native plants. Copy that answers the question and
stops is doing its job; copy that keeps going is charging the reader for our
enthusiasm. **Default to brevity and clarity. Length has to be earned, every
time.**

This applies to everything a person reads: buttons, headings, explanations,
plant and animal prose, empty states, error messages, and release notes.

- **Say the thing, then stop.** One idea per sentence, one point per paragraph.
  If a sentence survives being cut, it wasn't carrying anything.
- **Cut the run-up.** "It's worth knowing that…", "The way this works is…",
  "One consequence worth saying plainly:" — the reader wanted the sentence
  after those, not the sentence itself.
- **One example, not four.** A list of six species names becomes three; the
  second story illustrating the same point goes.
- **Don't re-explain what the page already says.** The surrounding heading,
  the card, the section title are all context you can lean on.
- **Put the depth where someone went looking for it.** A plant's own page is
  the right home for the yucca-moth story. A release note, a card, a tooltip
  is not.
- **A card shows the opening of the page, never a second copy of it.** The
  wildlife index prints the first sentence of the blurb the animal's page
  carries (`lead()` in `lib/prose.ts`), so there's one paragraph to write, one
  to translate, and nothing that can drift. Write the opening sentence to stand
  on its own; `npm run blurbs:check` keeps it card-sized in both languages.
- **A number belongs in a tile, not a sentence.** "3 native plants in Indigene
  support the hazel dormouse, 1 of them as a caterpillar host" is a paragraph
  doing a tile's job — slower to read, and a translation besides. `statTiles()`
  takes any page's figures.
- **Never name our own tooling.** The reader has no terminal and no checkout, so
  "Surfaced by `npm run candidates`" tells them nothing about whether to trust
  the line — it just asks them to take our word for it in a language they don't
  speak. Cite what the tool consulted instead: "Occurrence records in this
  region's box: 6,819 (GBIF)". Same for file paths, function names, workflow
  names and internal jargon. The script name belongs in the commit message, the
  code comment, or an `Internal:` changelog bullet.
- **Every word is also a translation.** French is written by hand from this
  English (`src/locales/`, `src/locales/prose.fr/`). A paragraph we didn't
  need is a paragraph somebody translates, reviews and maintains forever.

The exception is the same one the button rule makes: a term the reader can't
be expected to know still gets explained in place, and a number still gets its
source. Warmth isn't padding either — "plants nobody has chosen a picture for
yet keep the drawing" is worth its words. Trim the essay, keep the voice.

## Mobile-first UI: buttons stay on one line

This is a mobile-first PWA — assume a narrow phone (≈360 px wide) is the common
case, not the exception. **A button label should fit on a single line at that
width.** A control that wraps to two lines reads as broken, eats vertical space,
and grows/shrinks its own tap target as the label changes.

So, when adding or editing a button:

- **Keep the label short, and lean on context.** A button inside a "See it
  growing near you" card doesn't need the plant's name in it — `See it growing
  near me` beats `See white oak growing near me` (which also changes width per
  plant). Don't repeat what the surrounding heading already says.
- **Never interpolate a variable-length value into a label** (a plant common
  name, a place) if a context-carried pronoun would do — the longest value is
  the one that wraps.
- **Check it at ≈360 px**, not just at your editor width. A quick way: build,
  serve `dist/`, and measure — a button whose text spans more than one client
  rect at 360 px is wrapping.

The one allowed exception is a label that is an **irreducible proper name** —
a region like "Mid-Atlantic / Northeast Piedmont" has no honest shorter form, so
a wrap at the 360 px floor is acceptable there (it still fits at 390 px). That's
the bar for "we absolutely have to": a name we can't shorten without lying,
not a sentence we were too lazy to tighten.

## Shipping work: open a merge request at every natural stopping point

Always open a merge request (PR) when the work reaches a natural completion
point — a coherent, self-contained change — **even if it isn't perfect yet**.
Don't sit on finished-enough work waiting for polish; a reviewable MR at a
sensible boundary beats a sprawling one held back for days. If more is left to
do, say so in the description and keep going in follow-ups.

### Make the description clear, illustrative, and skimmable

The description should let a reviewer see what changed **at a glance**, without
reading the diff first:

- **Lead with the "what" and "why"** in a sentence or two — the problem this
  solves or the behavior it adds.
- **Show, don't just tell.** Use before/after tables, short lists, or example
  values for anything visible (copy changes, renamed labels, new URLs). When a
  change is visual, describe what the reader now sees.
- **Group the changes** by area or intent so the shape of the work is obvious.
- **Call out what's deliberately left out** — known gaps, follow-ups, or
  trade-offs — so "not perfect" is honest, not hidden.
- **Note how it was verified** (build/typecheck passing, the flow you walked)
  so the reader knows what's already been checked.

Keep it concise. The goal is that someone can read the description and know what
they'd be merging before they open a single file.

### Include before/after screenshots for anything visible

Whenever a change affects something the user can see — copy, layout, colors,
new UI — the MR description must show it, not just describe it. The procedure:

0. **Check the fonts first.** Screenshots must render with phone metrics, not
   the container's DejaVu fallback (~10% wider — it changes layout). The
   SessionStart hook (`.claude/hooks/session-start.sh`) sets this up in web
   sessions; verify with `fc-match system-ui`, which must answer Roboto. If
   it doesn't, run the hook once by hand:

   ```sh
   CLAUDE_CODE_REMOTE=true CLAUDE_PROJECT_DIR="$PWD" .claude/hooks/session-start.sh
   ```

1. **Build both versions.** Build the "after" from your branch as usual. For
   the "before", check out the base in a scratch worktree and build there:

   ```sh
   git fetch origin main
   git worktree add "$SCRATCH/before" origin/main
   cd "$SCRATCH/before/app" && npm install && npx vite build
   ```

2. **Serve both `dist/` folders** on different ports, e.g.
   `http-server -p 4173 -s` (before) and `-p 4174` (after).

3. **Capture with `app/scripts/shoot.mjs`** — phone viewport (390×844), real
   iPhone pixel density (3×), full-page — in both color schemes, for each
   affected route:

   ```sh
   cd app && node scripts/shoot.mjs \
     "http://127.0.0.1:4173/#/<route>" before-dark.png --scheme dark
   ```

   Repeat with `--scheme light` and against the after port. Use
   `--no-full-page` when the change is tiny (a viewport crop is kinder), and
   `--dpr 1` for very long pages (a results list or the release notes at 3×
   makes a 30k-pixel-tall bitmap — huge files, and Chromium may clip it).
   The script exists because the Playwright CLI can't set pixel ratio with
   chromium — its iPhone descriptors force WebKit, which isn't installed.

4. **Commit the images to the PR branch** under
   `docs/screenshots/pr-<number>/` with names like `before-dark.png` /
   `after-dark.png`. They ride along with the PR and serve as a visual
   changelog after merge.

5. **Embed them in the PR description** as a Before/After table, using raw
   URLs pinned to the commit SHA (not the branch name) so they keep rendering
   as the branch moves:

   ```markdown
   | Before | After |
   |---|---|
   | <img src="https://raw.githubusercontent.com/olivierlacan/indigene/<sha>/docs/screenshots/pr-<n>/before-dark.png" width="390"> | <img src="https://raw.githubusercontent.com/olivierlacan/indigene/<sha>/docs/screenshots/pr-<n>/after-dark.png" width="390"> |
   ```

Verify the screenshots actually show the change before embedding them — a
stale build or wrong port produces two identical images that look like proof.

Also verify each capture's pixel width **equals viewport width × DPR**
(1170 at the defaults; 390 with `--dpr 1`): full-page capture honors the
*document* width, so a wider file means some element overflows the viewport
sideways and the shot will show a dark right-edge gutter where the sticky
header ends. That gutter
is a page bug (`overflow-x: clip` on `body` should make it impossible) — if a
capture comes out wide, find and fix the overflowing element; don't publish
the shot.

## Every PR carries its changelog entry

`CHANGELOG.md` (Keep a Changelog format) is the single source of the public
**What's new** page at `/release-notes/` — the Pages deploy compiles it with
`npm run release-notes` on every push to `main`. That gives the changelog four
rules:

- **Add an entry in the same PR as the change**, under `## [Unreleased]`. The
  `Changelog` CI check reminds you; apply the `skip-changelog` label only when
  nothing notable changed (screenshots, CI plumbing, typos).
- **Write `Added` / `Changed` / `Fixed` bullets for everyone.** They're
  published verbatim to a general audience — including kids and grandparents —
  so use plain, warm words and explain any term of art in place. Reviewing the
  entry in the PR *is* reviewing the release notes. Developer-facing
  housekeeping goes in the same sections as a bullet starting with
  `Internal:` — the compiler cleans those out of the page, and the sections
  stay exactly Keep a Changelog's (no custom sections).
- **A bullet is one change, said once: aim for ~35 words, 50 is the hard
  ceiling.** `npm run release-notes` fails the build over it, so the
  `Changelog` check catches it in review — including bullets still sitting
  under `Unreleased`. What changed, who it's for, one example, done. If it
  won't fit, you're writing the feature's documentation: that belongs on the
  page itself, and the reasoning behind it belongs in an `Internal:` bullet
  (which is exempt — nobody outside the repo reads those). Two 35-word bullets
  beat one 70-word bullet when there really were two changes. See *Every word
  is short by default* at the top of this file; the notes drifted to a 65-word
  median once already.
- **Cut versions at feature boundaries, Maison-style.** When a coherent piece
  of the product has landed, retitle `Unreleased` to `## [0.x] - YYYY-MM-DD`,
  give it a bold one-line name on the next line, bump `app/package.json`'s
  `version` to match, add the compare link at the bottom, and start a fresh
  `Unreleased`. No fixed cadence, no conventional commits — the version number
  just increments when a feature ships.

Two more conventions the compiler understands:

- **Link what you describe.** When an entry mentions something with an
  address — a page, a section — link it with the full live URL
  (`https://indigene.app/wildlife`), so a reader who
  didn't know the feature existed can go straight to it. Use the **path** form,
  not the `#/` one: every shareable page has a real file behind it
  (`scripts/prerender.mjs`), and only that address previews as the page when
  someone passes the link on. Keep `#/` only for a sub-route that has no file
  of its own, like `https://indigene.app/#/wildlife/in/pnw`.
- **One thumbnail per release, no more.** A release may show a single square
  picture: make it from an existing PR screenshot with
  `cd app && node scripts/make-thumb.mjs ../docs/screenshots/pr-<n>/<shot>.png`
  (writes `thumb.png` beside the source — commit it), then reference it as a
  linked image on its own line right under the release's bold name, with
  Before/After as plain text links on the next line:

  ```markdown
  [![What the reader sees](docs/screenshots/pr-36/thumb.png)](docs/screenshots/pr-36/home-after-dark.png)
  [Before](docs/screenshots/pr-36/home-before-dark.png) · [After](docs/screenshots/pr-36/home-after-dark.png)
  ```

  The compiler fails on a second image — that's the don't-overcrowd rule, not
  a bug. Repo-relative paths render on GitHub as-is; on the published page the
  small thumbnail is copied into the build (so the page renders even before
  the file reaches `main`) while full-size screenshots are direct-linked from
  `raw.githubusercontent.com` — no copying multi-MB images into the deploy.
  The thumbnail and the Before/After links are one reel in the page's own
  picture viewer (‹ › / ← → / swipe), so keep them to the two lines above:
  they're what the reader pages through. `npm run notes:check` drives it.

Preview the page locally with `npm run release-notes` (writes
`app/dist/release-notes/index.html`); the script fails loudly if the changelog
doesn't parse, and the same check runs on every PR.

## Keep the bundle-size figure honest

Several docs quote the app's gzipped bundle size as a point of pride
(`README.md`, `PROJECT_BRIEF.md`, `app/README.md`, and as a comparison in
`docs/ecoregion-plan.md`). It's easy to let that number drift as the app grows —
it already did once, sitting at "~28 KB" long after the real bundle had tripled.

So: **whenever a change materially moves the bundle, re-measure and update every
mention in the same PR.** Measure from a production build and cite the JS gzip
figure Vite reports:

```sh
cd app && npm run build   # read the "gzip:" column for the JS chunk
```

"Materially" means a few KB or more — a new data file, a new dependency, a
feature that pulls in a previously tree-shaken module (importing the registry did
exactly this). Trivial edits don't need a re-measure. When you do update it,
keep the wording's intent (e.g. the ecoregion-plan comparison still has to read
as "polygons would dwarf the bundle") and use one consistent number across all
the docs.

## A map needs somewhere to stand

A map exists to answer *"does this include me?"* — and it can't if it's a shaded
shape with nothing named on it. A region drawn as a green blob on an unlabelled
coastline is not a map, it's decoration: the reader can't find themselves on it,
so it fails at the one job it had.

So **every map carries a handful of spatial references — major cities, at
least — enough to fix its edges (north, south, and the inland side).** For
region maps that's the `LANDMARKS` table in `scripts/build-region-maps.mjs`;
the builder now refuses to draw a region that declares fewer than three, so the
mistake can't ship silently. When you add or review a map, **look at the
rendered image** and check you can find a place you know on it — a size number
or a passing build is not that check.
