### Added

- The [Scottish Lowlands](https://indigene.app/regions/scotland-lowlands) are on the map: 59 native plants from Glasgow and Edinburgh to Dundee, Ayrshire and the Borders. Each one is checked as native in the region's own countryside, not just somewhere in Britain.
- Regions: Scottish plants carry their Gaelic or Scots names where people use them — caorann for rowan, gean for wild cherry, blaeberry for bilberry.
- Internal: `npm run bsbi:check` asks the BSBI Plant Atlas 2020 whether each row is native in the region's own 10 km squares, and commits the counts to `data/sources/bsbi-plant-atlas/`. WCVP (`TDWG:GRB`) stays as the floor check under it.
