### Added

- The [regions page](https://indigene.app/regions) has a search box. Type a
  state, country or town, like Illinois or Japan, and only the regions that
  match stay on the page.
- Regions: don't know which region is yours? Tap My location or type a postal
  code, and the page shows the region you're in, with a button to start
  planning from that spot.
- Internal: each region lists the states, provinces or prefectures it mostly
  covers (`RegionMeta.areas`, French in `locales/regions.fr.ts`), matched
  accent-blind by `lib/region-search.ts`. Postal codes go through the existing
  Open-Meteo geocoder and `regionsForCoords`; `gpsButton` is now shared from
  `location-prompt.ts`.
