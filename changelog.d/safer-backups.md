### Changed

- Bringing a copy of your spots into a browser that already has them now adds
  the sightings and invasives you linked on the other device, instead of
  skipping the spot. Nothing already here is removed or overwritten.
- Your saved spots now ask the browser to keep them through a clean-up, and
  the spots file card says when you last saved a copy.
- Internal: `planImport` in `lib/backup.ts` is the pure merge (union of
  `observations` and `invasives`, note filled only when missing), with
  `backup.test.ts` pinning the round trip via `Required<SavedSpot>`. `saveSpot`
  calls `navigator.storage.persist()` once per load; the last copy's date is
  kept in kv as `backup-saved-at`.
