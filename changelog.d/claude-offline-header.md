### Added

- With no signal, the header turns grey and a small no-signal mark sits beside the name, for as long as you're offline. Want to see how that works before you're in the field? Switch on [Offline mode](https://indigene.app/#/settings/offline) in Settings.
- Internal: `lib/connection.ts` owns `isOnline()` (device offline *or* `indigene:offline` = `on`) and stamps `data-offline` on `<html>`; a head script in `index.html` does the same before first paint. While forced, `fetch` rejects cross-origin requests; same-origin files still load. The three `navigator.onLine` checks now call `isOnline()`.

### Fixed

- Going offline no longer pushes the menu onto a second row of the header with a big white "Offline" label.
