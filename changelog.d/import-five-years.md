### Changed

- Matches: importing from iNaturalist now reaches back five years instead of
  one, and only brings in your sightings within 35 km of the spot. iNaturalist
  is sent the spot rounded to about 1 km, so blurred sightings still turn up.
- Internal: `lib/inat-import.ts` asks with `lat`/`lng`/`radius` (35 km covers
  an obscured sighting's 0.2° cell plus the 1 km rounding) and `d1` five years
  back; page cap raised from 3 to 5 (1,000 sightings). The fetch is cached per
  username and rounded spot. Privacy copy updated in both languages.
