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
