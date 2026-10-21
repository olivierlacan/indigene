### Added

- **The [plant list](https://indigene.app/plants) and each region's roster now take your spot's filters.** Safe around pets, no thorns, deer, no watering, spreaders and size sit in a Filter drawer that names the ones that are on, and a shared link keeps them.
- Internal: the filters live in `lib/filter-traits.ts`, shared by the ranking and both lists; the registry mirrors each taxon's traits, merged cautiously across regions, so the catalog filters without fetching a list. Main chunk +6 KB gzip.
