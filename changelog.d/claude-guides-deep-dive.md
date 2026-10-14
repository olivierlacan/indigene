### Added

- The [guide](https://indigene.app/guide/) explains saved spots in full: logging what you plant, the wildlife your spot can feed, and its season plan.
- Ranking: a [guide](https://indigene.app/guide/ranking/) to how your plant list is ordered — the goals, the filters, and how each filter matches a label on a plant's page.
- Guides for a plant's page, growing more, linking iNaturalist, privacy and where the numbers come from. Each guide now ends with the guides that go well with it.
- Your plant list, the goals step, Saved spots and the iNaturalist setting each link to the guide that explains them.

### Changed

- Each guide shows only its latest changes. The full history has its own page, so the explanation comes first.

### Fixed

- The guide no longer says your location never leaves your phone. It goes straight to the public map, soil and weather services, and never to us.
- Internal: `guide-catalog.mjs` gains `parts`, `related`, `guide()` and `guideProblems()`; the builder renders them, caps history at two releases and writes `/guide/<id>/history/`. New sections `ranking` (prefix `Ranking`), `spots` (`Spots`, takes the `saved` segment and the `spot` alias from `find`) and `inaturalist` (`iNaturalist`); `plants`, `planting`, `privacy` and `sources` published. `components/guide-link.ts` links them from the app; `guide-link.test.ts` holds those links and the catalog's cross-links to published guides.
