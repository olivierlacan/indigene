### Added

- Regions: a region's plant list can now be read with the plants that raise the most kinds of caterpillar first, each row showing its count. Try it on the [Pacific Northwest](https://indigene.app/regions/pnw).
- Internal: `lib/roster-sort.ts` orders the roster by `hostLepCount` (uncounted last, never as 0), read from `?sort=caterpillars`. Named-wildlife ties aren't offered as a sort: they're a hand-picked handful per plant, so their count ranks our writing, not the plant.
