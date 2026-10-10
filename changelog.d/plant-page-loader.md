### Fixed

- Plants: a page that is still fetching no longer sits blank. A seedling grows while you wait — stem, leaves, then a flower — and steps aside the moment the page arrives.
- Internal: `components/page-loader.ts` holds the seedling in `main` while a step's render promise is pending; the boot screen in `index.html` draws the same plant.
