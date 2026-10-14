### Added

- The [guide](https://indigene.app/guide/) explains saved spots in full: logging what you plant, the wildlife your spot can feed, and its season plan.
- Ranking: a [guide](https://indigene.app/guide/ranking/) to how your plant list is ordered — the goals, the filters, and how each filter matches a label on a plant's page.
- Guides for a plant's page, growing more, linking iNaturalist, privacy and where the numbers come from. Each guide now ends with the guides that go well with it.
- Your plant list, the goals step, Saved spots and the iNaturalist setting each link to the guide that explains them.

### Changed

- Ranking: your plant list opens with your spot's sun, soil and winter, using the same icons as before, then two rows you tap anywhere: your goal, and filters that say what they cover. The totals show as two figures.
- Shorter words in a few places: "📍 Pacific Northwest · your pick", one quiet link for how your iNaturalist username is handled, and a one-line note on counting visits.
- Each guide shows only its latest changes. The full history has its own page, so the explanation comes first.

### Fixed

- The guide no longer says your location never leaves your phone. It goes straight to the public map, soil and weather services, and never to us.
- Spots: a saved spot now remembers how wet you said it stays. Before, reopening it went back to the soil map's guess, so a spot you called wet was ranked as evenly moist.
- Short messages like "Saved to this device." now slide in from the top of the screen, like your phone's own notifications, instead of a narrow bubble at the bottom. Tap one to dismiss it.
- Internal: the Open/Close pill on folding panels was English-only CSS `content`; it now reads `data-open`/`data-close` set from the locale, and is sized like `.ranked-for .btn` (`box-sizing` was missing on `::after`). Goal and filter icons are SVG (`components/control-icons.ts`); the count is `statTiles()`. `privacyNote()` takes an empty lead for a link-only note.
- Internal: `results.ts` saved `soilOverride: null` unconditionally; `lib/soil-answer.ts` now writes the reader's moisture (tested). The toast was `left: 50%` + `translateX(-50%)`, which caps its shrink-to-fit width at half the viewport; it's now inset on both sides with `width: fit-content`, top-anchored on phones (bottom on ≥64rem), and slides via `.is-in` in `toast()` with a reduced-motion fallback.
- Internal: `guide-catalog.mjs` gains `parts`, `related`, `guide()` and `guideProblems()`; the builder renders them, caps history at two releases and writes `/guide/<id>/history/`. New sections `ranking` (prefix `Ranking`), `spots` (`Spots`, takes the `saved` segment and the `spot` alias from `find`) and `inaturalist` (`iNaturalist`); `plants`, `planting`, `privacy` and `sources` published. `components/guide-link.ts` links them from the app; `guide-link.test.ts` holds those links and the catalog's cross-links to published guides.
