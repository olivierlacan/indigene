### Fixed

- Every plant on the [Kantō Plain](https://indigene.app/regions/kanto) now
  shows a real photograph from iNaturalist instead of the placeholder drawing.
- Internal: `npm run hero:inat` had never been run after Kantō landed, so
  `inat-heroes.json` held none of its 59 plants. Re-ran it (plus
  `hero:colors`); three non-Kantō gaps filled on the way.
