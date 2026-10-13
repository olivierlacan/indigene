### Changed

- [Posts](https://indigene.app/posts) write their date the common way in English, "October 12, 2026", and keep "12 octobre 2026" in French.
- Internal: a post's date line is its occasion (`posts.<key>.occasion`) plus the date from `data/posts.ts`, so the date is typed once. `scripts/gen-story.mjs <slug>` draws an Instagram story for any post from the same data.
