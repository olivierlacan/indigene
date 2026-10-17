### Added

- **A map of every region.** The new [map page](https://indigene.app/map) shows the world in Equal Earth, every country at its true size, then a map per continent with each region named. Tap a name to open it.
- Internal: `scripts/_coverage-map.mjs` draws the world (Equal Earth, centred on 150°E) and one map per continent from the coverage shapes `maps:build` already makes; `npm run maps:coverage` redraws them alone. Names are laid out in the browser (`placeLabels`) so French fits too.

### Fixed

- Regions: the shading on the French maps stays in France. Atlantic France's map no longer runs along England's south coast, nor into Belgium or Spain.
- Internal: region shading subtracts neighbouring countries' land (Natural Earth 1:50m, `offForeignLand`), with Ireland allowed Northern Ireland. The matching rule itself still uses the box; a follow-up.
