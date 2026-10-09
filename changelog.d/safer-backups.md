### Changed

- Your spots file is now a full backup: spots, plantings, linked sightings with
  their photos, your iNaturalist username and your settings. Open it in a new
  browser and everything comes back.
- Bringing a copy into a browser that already has your spots adds what's new,
  like sightings linked on another device. Nothing already here is removed or
  overwritten.
- Your saved spots now ask the browser to keep them through a clean-up, and
  the spots file card says when you last saved a copy.
- Internal: spots file format v2 adds `lookups`, `sightings` (the `obs:<ref>`
  cache records) and `preferences`; v1 files still read. `planImport` in
  `lib/backup.ts` is the pure merge, pinned by `backup.test.ts` with
  `Required<>` fixtures. Settings that redraw the page apply via
  `Restore.finish()` so the import report survives. `saveSpot` calls
  `navigator.storage.persist()` once per load.
