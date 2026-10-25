### Changed

- Indigene opens a little faster in English: the French edition now downloads only for readers who use it. Once fetched, French stays on your device and works offline, and each update brings the new French with it.
- Internal: `locales/fr.ts` is a chunk of its own, loaded by `loadLanguage()` before anything renders (main chunk 637 → 560 KB gzipped). The service worker is stamped per release (`scripts/stamp-sw.mjs`): hashed files are cache-first and pruned to the release's list, unhashed ones live in a per-release cache, and a device with French cached prefetches the new French on install. A tab whose chunk vanished reloads once. `npm run sw:check` walks the lifecycle across two builds.
