### Fixed

- Plants: a plant's main photo is now the one iNaturalist itself chose for the
  species, or none. Before, some plants showed whatever free photo came next,
  like persimmon seeds that looked like bread. Those plants show their drawing
  until someone picks a photo.
- Internal: `inat-heroes.mjs` takes only `default_photo`, and a forced run now
  deletes picks the rule refuses instead of keeping them. 130 of 588 stored
  picks cleared across the four `inat-*.json` files; 18 swapped to iNaturalist's
  current choice. Rule and test in `_inat-hero-pick.mjs` /
  `inat-hero-pick.test.ts`.
- Internal: subjects left without a chosen photo are queued in
  `docs/hero-photos/needs-review.json`. The review page lists them first,
  `hero:harvest -- --queue` harvests just them (a narrowed harvest now merges
  instead of overwriting), and `inat-heroes.yml` pins a PR comment and warns
  whenever a PR adds to the queue.
