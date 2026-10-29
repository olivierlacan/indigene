### Fixed

- Conservation: animals with a hand-picked photo were never checked against the red lists. Now they are: the [Pacific Northwest's](https://indigene.app/#/wildlife/in/pnw?only=at-risk) at-risk list grows from one animal to three, led by the monarch, critically imperiled in Washington.
- Conservation: in French, a status now names its place with the right preposition — "au Michigan", "au Québec", not "en Michigan".
- Internal: `scripts/conservation.mjs` reads animal taxon ids from `wildlife-taxa.json` instead of `inat-heroes.json`, which has no row for the 47 animals with a reviewed photo. Table refreshed: 46 subjects (was 16), 11 of them animals (was 7). Band-tailed pigeon dropped off — PNW's sampled home place moved from Oregon to Washington. `placeInWords()` folds accents; French place entries carry their preposition.
