### Added

- Matches: a new **Plant these first** list tops your plants. It shows four essential plants, each a different kind, because a second willow mostly feeds the same caterpillars as the first. Tell it how much room you have: small, medium or large.
- Spots: a saved spot now suggests **essential plants to add**, kinds it has nothing related to yet. A garden with a willow gets offered a cherry or an oak, not a second willow.
- Spots: tell a saved spot roughly how big it is: small (a bed, ~100 ft²), medium (a backyard, ~1,000 ft²) or large (a big lot). Its suggestions stay a size that fits, so a bed gets goldenrod, not an oak.
- Spots: once you've said how big a spot is, each suggestion says how many to plant and how far apart, like "Plant 9, 6 ft apart" for blueberries in a backyard.
- Internal: `lib/first-picks.ts` takes one plant per genus from the reader's own ranking, keystones first, poor fits never. The room buttons set the existing spread filter to a ladder rung, so the card and the list stay in step. `missingEssentials` does the same for a spot, skipping genera already planted. `SavedSpot.room` stores the size; backups carry it, and opening the spot sets the list's spread cap to match. `howMany` shares the spot's area evenly among the suggestions, one mature spread squared per plant, clamped to 1–25.
