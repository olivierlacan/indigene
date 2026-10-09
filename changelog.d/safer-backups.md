### Added

- Backups: when a spot you bring in looks like one you already have (same
  name nearby, or the same patch of ground), you choose whether to combine
  them or keep both. Nothing comes in until you've chosen.
- [Keeping your spots safe](https://indigene.app/guide/backup/) explains where
  your spots live, what can erase them, and how to save and restore a copy.

### Fixed

- Choosing metric units in Settings is now remembered even when metric was
  already showing, so restoring a copy from an imperial device won't switch it.

### Changed

- Backups: your spots file now holds everything — spots, plantings, linked
  sightings with their photos, your iNaturalist username and your settings.
  Open it in a new browser and it all comes back.
- Backups: bringing a copy into a browser that already has your spots adds
  what's new, like sightings linked on another device. Nothing already there
  is removed or overwritten.
- Backups: saved spots now ask the browser not to clear them when space runs
  low, and Settings shows when you last saved a copy. On iPhone, it explains
  Safari's one-week limit.
- Internal: spots file format v2 adds `lookups`, `sightings` (the `obs:<ref>`
  cache records) and `preferences`; v1 files still read. `planImport` is the
  pure merge and `likelySameSpots` the matcher (same name ≤ 1 km, or ≤ 30 m;
  suggests combine for same name ≤ 250 m); combined ids persist in kv
  `spot-aliases`. Settings that redraw the page apply via `Restore.finish()`.
  New guide section `backup` (prefix `Backups`).
- Internal: `lib/backup.roundtrip.test.ts` runs save → file text → restore on
  simulated devices (fake-indexeddb, a fresh module copy each), covering full
  restore, idempotence, copies of copies, diverged devices merging both ways,
  stale copies, deleted spots, combine/keep-both across repeat imports, damaged
  and v1 files. `setUnitPref` now stores an unchanged pick.
