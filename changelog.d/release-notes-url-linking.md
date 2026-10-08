### Changed

- Links in [What's new](https://indigene.app/release-notes/) are words you can tap, like a region's name or "a new page", instead of a web address printed after the sentence.
- Internal: every typed-out URL in CHANGELOG.md became a linked phrase, and both compilers now autolink a bare or `<…>` URL (`autolink()` in `scripts/_changelog.mjs`, `autolink.test.ts`), so one can't render dead again.
