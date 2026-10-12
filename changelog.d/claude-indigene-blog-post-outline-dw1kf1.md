### Added

- [Plants that fed people first](https://indigene.app/posts/indigenous-peoples-day-2026): for Indigenous Peoples' Day, five native plants and the peoples who ate, wove and tended them, from camas to hollyleaf cherry. It's Indigene's first post.
- [Peoples and plants](https://indigene.app/people): the plant pages that say who tended each plant, and sources published by the nations themselves, from the Myaamia Center to Te Haumanu Taiao.
- Internal: `posts/<slug>` pages (`data/posts.ts`, `steps/posts.ts`) and `steps/people.ts`, prerendered with share cards. Every claim in the post was checked against a quoted source; the research is in `docs/outreach/indigenous-plant-history-sources.md` and PR #234.

### Changed

- Indigene's title and share picture now say "native plants for where you stand", shorter and the same everywhere a link to it appears.
- Internal: the name and tagline live in `src/data/brand.json`. `index.html` fills them through `vite.config.ts`, `404.html` and the manifest through `prerender.mjs`, the cards through their generators; `brand.test.ts` fails on any copy typed out elsewhere.

### Fixed

- Plants: karaka's page now says Māori planted it for its kernels, which are food only after long cooking and soaking, not for its fruit. Harakeke is the main plant of Māori weaving, not the only one.
