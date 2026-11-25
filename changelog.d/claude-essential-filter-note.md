### Added

- Matches: when your filters hide [essential plants](https://indigene.app/plants/essential) that would suit your spot, the list says how many and names two, with a link to why they matter. Your filters stay as you set them.
- Internal: `hiddenEssentials()` in `lib/ranking.ts` re-ranks the essential plants without filters and keeps those that fit; `hidden-essentials.test.ts` pins it. The ranking itself is unchanged: measured across four regions in sun and shade, essential plants already lead (top 10 in Pacific Northwest sun; first one no lower than 6th even ranked for pollinators), so forcing them first would crowd out the mix.
