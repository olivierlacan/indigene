# Fewer LLM tokens: what the bill shows, and the rules that help

The reader-facing summary is on <https://indigene.app/llm>. This is the
working version, from `sessions.csv` and `floor.csv` (100 sessions with token
counts, as of 2026-10-07).

## What the bill shows

| Finding | Figure |
|---|---|
| Re-reading context (cache reads) | 98% of 6.7 billion tokens |
| Written by the model (output) | 0.3% |
| Sessions with more than ten requests | 17 of 100, **66% of tokens** |
| Tokens per request, long vs short session | 16 M vs 7.8 M (**2.1×**) |
| Ten biggest sessions | 68% of tokens |
| Two biggest (ecoregion prioritization, southern hemisphere) | 40% |

Every request re-reads everything the session holds, so cost tracks
**session length × context size**, not how much gets written. Shorter replies
barely move it; shorter sessions and smaller contexts do.

## Rules already written down

| Rule | Where | Why it saves tokens |
|---|---|---|
| Computable facts become a script, "rather than a document someone has to re-read" | [`docs/coverage-plan.md` §1](../coverage-plan.md#1-what-enough-looks-like-for-a-region), shipped in §4 | `npm run coverage` and `npm run candidates` do the counting and ranking; the model reads a short report instead of researching |
| Candidate lists are generated, "a shortlist, not a decision" | [`docs/candidates/*.md`](../candidates/) | GBIF ranking arrives as a file; no session re-derives it |
| A region's full checklist, with "Run it first and last" for `coverage` | [`docs/adding-a-region.md`](../adding-a-region.md) | The steps are read once, not rediscovered by trial and error |
| Upstream answers are committed snapshots, "so upstream drift shows up in a diff" | [`data/sources/README.md`](../../data/sources/README.md) | The next session reads a diff, not a re-fetch and re-analysis |
| Unit tests are offline and take about a second; check scripts are separate | [`app/README.md`](../../app/README.md), [`CLAUDE.md`](../../CLAUDE.md#two-kinds-of-check-and-knowing-which-one-you-need) | Fast, quiet verification loops; no live-service output to read on every run |
| Screenshots default to a focused crop | [`CLAUDE.md`](../../CLAUDE.md#include-beforeafter-screenshots-for-anything-visible) | An image the model reads back is tokens; a crop is a fraction of a full page |
| Every word is short; changelog bullets capped at 50 words, enforced by the build | [`CLAUDE.md`](../../CLAUDE.md#every-word-is-short-by-default) | Less to write, translate and re-read; the ceiling is a script, not a review round |
| Container setup is a script | [`.claude/hooks/session-start.sh`](../../.claude/hooks/session-start.sh) | Fonts and `npm install` happen before the first request, not through it |

## Not written down yet

These follow from the figures. None is a rule until it lands in a doc.

1. **One change per session.** Long sessions cost 2.1× per request. Start
   fresh when a PR is up, rather than carrying the context into the next task.
2. **Keep `CLAUDE.md` lean.** It is in the context of every request of every
   session (about 3,600 words today). A procedure only one task needs belongs
   in that task's doc (as `adding-a-region.md` does), linked from `CLAUDE.md`.
3. **Read large outputs by slice.** A big diff, log or JSON read whole stays in
   the context for the rest of the session. Grep, `head`, or a script that
   prints a summary.
4. **Delegate wide searches.** A sub-agent's file reads leave with it; only its
   conclusion enters the main session.
