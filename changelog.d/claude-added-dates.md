### Added

- Regions: the foot of each [region's page](https://indigene.app/regions/pnw) shows how its plants and animals grew over time, one step for each day new ones arrived. The [Regions](https://indigene.app/regions) page shows every region together. Point at a step to see that day's counts.
- Internal: the growth charts come from `virtual:growth` (`scripts/_growth.mjs`, the `indigene-growth` plugin in `vite.config.ts`), worked out on every build from main's first-parent history and the plant files themselves, so nothing is stored that could drift. Dates are the merge into main. The deploy now checks out full history; shallow builds leave the charts out.
