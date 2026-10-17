### Fixed

- Regions: a region's plants now stop at its border. A spot in Brighton, Brussels or Geneva used to be offered a French list, because the region's box reached across. Those places now hear that there's no list for them yet.
- Internal: `regionsForCoords` drops a region when the spot is on another country's land (`lib/borders.ts`), from Natural Earth 1:10m outlines written by `npm run borders:build` (`src/data/region-borders.ts`, ~10 KB gzipped). Shared rule with the map trim (`scripts/_borders.mjs`).
