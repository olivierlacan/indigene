### Fixed

- Spots: logging a planting no longer accepts "1.5" plants, a year like 1500, or 31 February. The count is a whole number, the year runs from 1900 to next year, and an impossible day is dropped while the month is kept.
- Internal: property tests (fast-check) for the observation-link, postcode, region-filter, backup-file and planting fields try a few hundred generated values per field on every `npm test`; `npm run fuzz` tries 20,000. The planting form's parsing moved to `lib/planting-input.ts` so it can be tested.
