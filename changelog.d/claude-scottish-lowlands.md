### Added

- The [Scottish Lowlands](https://indigene.app/regions/scotland-lowlands) are on the map: 59 native plants from Glasgow and Edinburgh to Dundee, Ayrshire and the Borders. Each one is checked as native in the region's own countryside, not just somewhere in Britain.
- Regions: Scottish plants carry their Gaelic or Scots names where people use them — caorann for rowan, gean for wild cherry, blaeberry for bilberry.
- Invasives: the Scottish Lowlands get their [most-wanted list](https://indigene.app/invasives/in/scotland-lowlands) — NatureScot's priorities, like giant hogweed and Himalayan balsam, plus giant rhubarb and two butterburs spreading from old gardens.
- Ireland and the Scottish Lowlands now read in French, every plant and every note.
- Internal: `npm run bsbi:check` asks the BSBI Plant Atlas 2020 whether each row is native in the region's own 10 km squares, and commits the counts to `data/sources/bsbi-plant-atlas/`. WCVP (`TDWG:GRB`) stays as the floor check under it.
- Internal: the region flag is `GB-SCT` (ISO 3166-2), drawn as the saltire; `flags.ts` names subdivisions itself.
- Internal: the coverage map now fails a region whose box runs off its continent's frame, in the builder and in `coverage-map.test.ts` (the frame is written into `coverage-map.ts`); `docs/adding-a-region.md` lists `maps:coverage` as a step.
