### Changed

- Links in [What's new](https://indigene.app/release-notes/) are words you can tap, like a region's name or "a new page", instead of a web address printed after the sentence.
- Internal: every typed-out URL in CHANGELOG.md became a linked phrase, and both compilers now autolink a bare or `<…>` URL (`autolink()` in `scripts/_changelog.mjs`, `autolink.test.ts`), so one can't render dead again.
- Internal: an entry's section prefix (`Regions:`, `Plants & Wildlife:`) links that part of the app on What's new when the entry carries no link of its own (`linkPrefix()` and a section's optional `home` in `guide-catalog.mjs`, `changelog-prefix.test.ts`).
- Internal: `npm run release-notes` warns when a published bullet types out a URL instead of linking a word; CLAUDE.md and CHANGELOG.md's house rules now say to link the name.
