### Changed

- Plants: a plant's page now sorts its wildlife by how each animal uses it — "Raise caterpillars on it", "Drink its nectar", "Shelter in it" — and an animal that uses it two ways is listed under both.
- Internal: `tiesByKind()` in `lib/wildlife.ts` groups a plant's ties by support kind (unit-tested); `wildlifeByKind()` draws the groups. Saved spots still use `bestTies()`, one strongest tie per animal.
