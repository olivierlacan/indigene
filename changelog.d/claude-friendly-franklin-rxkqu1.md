### Added

- [Essential plants](https://indigene.app/plants/essential) have a page of their own: why a few natives feed most of the caterpillars, why ecologists call them "keystone" plants, and each region's list, most caterpillars first.

### Changed

- Plants: "Essential" is now explained like a load-bearing wall, which takes much of a food web down with it, in place of the stone arch. Every Essential label leads to the new page.
- Internal: `plants/essential` and `plants/essential/<region>` are prerendered under the plants namespace (`ESSENTIAL_SEGMENT` in `lib/routes.ts`); a test fails if a plant slug ever takes the word.
