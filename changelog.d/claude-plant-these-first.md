### Added

- Matches: a new **Plant these first** list tops your plants. It shows four essential plants, each a different kind, because a second willow mostly feeds the same caterpillars as the first. Tell it how much room you have: small, medium or large.
- Spots: a saved spot now suggests **essential plants to add**, kinds it has nothing related to yet. A garden with a willow gets offered a cherry or an oak, not a second willow.
- Internal: `lib/first-picks.ts` takes one plant per genus from the reader's own ranking, keystones first, poor fits never. The room buttons set the existing spread filter to a ladder rung, so the card and the list stay in step. `missingEssentials` does the same for a spot, skipping genera already planted.
