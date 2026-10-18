### Added

- Regions: sort a region's plants A–Z or by how many kinds of caterpillar each one raises, group them by plant type or not, and filter to the pioneers. Try it on [South Florida](https://indigene.app/regions/florida-south).
- Internal: `lib/roster-sort.ts` reads the view from `?sort=caterpillars`, `?group=type` and `?only=pioneers`. Uncounted plants sort last, never as 0. Named-wildlife ties aren't a sort: a hand-picked handful per plant ranks our writing, not the plant.

### Changed

- Regions: a region's plants now open as one list; the plant types appear once you group by them. Look-alikes and native swaps moved below the list, beside the worst invasives.
- Pioneers: their tags are now icons, with the name on hover and the explanation on tap. Each one's source moved to the plant's own page.
- Regions: sorting by caterpillars now answers "Won't they eat my plants?" in one tap: a little, and the birds eat most of them first, with the research behind it.
