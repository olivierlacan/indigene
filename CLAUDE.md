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
