### Added

- Regions: a region whose native plants are checked against only one checklist now says so at the top of its page, until botanists who work there have checked them too.
- Sources: [Where our numbers come from](https://indigene.app/sources) now lists the bar each kind of fact clears before it appears, from native status and invasives to photos and names.
- Internal: `data/cross-checks.ts` names the regions with a second native-status check; `cross-checks.test.ts` holds each to a committed check covering every plant it ships, and pins the Atlas of Florida Plants' three disagreements.

### Fixed

- Internal: links in running text on the sources, about and privacy pages kept the bright link color; `.doc-body` now matches the quiet-link rule.
