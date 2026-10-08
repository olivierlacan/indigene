### Added

- **A season plan for every saved spot.** It picks the plants you've had long
  enough to share, says what to do now — collect ripe seed, divide a clump —
  and puts the ones wildlife needs most first, linked to [the how-to](https://indigene.app/planting).
- Planting: the season plan also suggests natives to add, for the animals
  photographed within 5 km of your spot in this season's months, on iNaturalist.
- Planting: your Saved spots open with the three most useful things to grow
  more of this season, across all of them.
- Internal: `lib/grow-now.ts` holds the readiness, window and ranking rules
  (tested in `grow-now.test.ts`); `lib/season-sightings.ts` asks iNaturalist
  for one species-counts call with `month=`, behind the existing per-spot yes.
