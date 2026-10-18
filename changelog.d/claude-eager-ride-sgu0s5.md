### Changed

- Plants: each plant page now has one [Sources](https://indigene.app/plants/alnus-rubra#sources) card listing every claim — native range, caterpillar count, how to grow more, toughness, each animal it feeds — beside the sources that back it.
- Internal: `parseBasis()` (`app/src/lib/basis.ts`, with a unit test) splits a plant's labelled `basis` prose into claims; unlabelled text stays as a "Profile" row. Identical source texts collapse into one row naming every claim. The old `#references` anchor still lands on the card.
