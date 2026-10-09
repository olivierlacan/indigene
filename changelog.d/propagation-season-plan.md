### Added

- **A season plan for every saved spot.** It picks the plants you've had long
  enough to share, says what to do now — collect ripe seed, divide a clump —
  and puts the ones wildlife needs most first, linked to [the how-to](https://indigene.app/planting).
- Planting: the season plan can also suggest natives to add, for the animals
  photographed within 5 km of your spot this season. It asks iNaturalist when
  you tap to look, then remembers the answer for a month.
- Planting: your Saved spots open with the three most useful things to grow
  more of this season, across all of them.
- Planting: each technique page links to further reading, and the season plan
  names its sources (RHS, the USDA Woody Plant Seed Manual, Audubon) and says
  to leave some seed for the birds.
- Internal: `lib/grow-now.ts` holds the readiness, window and ranking rules
  (tested in `grow-now.test.ts`); `lib/season-sightings.ts` asks iNaturalist
  for one species-counts call with `month=`, only on a tap; a cached answer (30 days) shows without one.
- Internal: no seed prompts for trees, shrubs or vines. The Woody Plant Seed
  Manual's tables put first seed at 3–40 years by species (white oak 20), so an
  age by growth form would mislead. `GUIDE_REFS` keeps each source's quote.
