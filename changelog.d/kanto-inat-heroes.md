### Fixed

- Every plant on the [Kantō Plain](https://indigene.app/regions/kanto) now
  shows a real photograph from iNaturalist instead of the placeholder drawing.
- Internal: `npm run hero:inat` had never been run after Kantō landed, so
  `inat-heroes.json` held none of its 59 plants. Re-ran it (plus
  `hero:colors`); three non-Kantō gaps filled on the way.
- Internal: new `inat-heroes.yml` workflow runs `hero:inat` and `hero:colors`
  when the plant, wildlife, look-alike, ornamental or invasive lists change on
  `main` (and weekly), then opens a PR, so the next region can't ship without
  photos.
