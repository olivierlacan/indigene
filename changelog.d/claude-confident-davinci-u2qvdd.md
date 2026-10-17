### Added

- **A map of every region.** The [regions page](https://indigene.app/regions) now opens on a world map, drawn in Equal Earth so every country shows at its true size. North America and Europe get a closer look, and each region's name opens it.
- Internal: `scripts/_coverage-map.mjs` draws the world (Equal Earth, centred on 150°E) and two insets from the coverage shapes `maps:build` already makes; `npm run maps:coverage` redraws them alone. Names are laid out in the browser (`placeLabels`) so French fits too.

### Fixed

- Regions: the shading on the French maps stays in France. Atlantic France's map no longer runs along England's south coast, nor into Belgium or Spain.
- Internal: region shading subtracts neighbouring countries' land (Natural Earth 1:50m, `offForeignLand`), with Ireland allowed Northern Ireland. The matching rule itself still uses the box; a follow-up.
