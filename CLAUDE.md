# Working in this repo

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

1. **Build both versions.** Build the "after" from your branch as usual. For
   the "before", check out the base in a scratch worktree and build there:

   ```sh
   git fetch origin main
   git worktree add "$SCRATCH/before" origin/main
   cd "$SCRATCH/before/app" && npm install && npx vite build
   ```

2. **Serve both `dist/` folders** on different ports, e.g.
   `http-server -p 4173 -s` (before) and `-p 4174` (after).

3. **Capture with Playwright's CLI** at a phone viewport (this is a
   mobile-first PWA), in both color schemes, for each affected route:

   ```sh
   playwright screenshot --viewport-size=390,844 --color-scheme=dark \
     --full-page --wait-for-timeout=2500 \
     "http://127.0.0.1:4173/#/<route>" before-dark.png
   ```

   Repeat with `--color-scheme=light` and against the after port. Use
   `--full-page` unless the change is tiny; then a viewport crop is kinder.

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
