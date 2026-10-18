### Added

- Plants: the [full plant list](https://indigene.app/plants) now sorts, groups and filters like a region's: A–Z or most caterpillars, by plant type or not, and pioneers only. Your search stays as you switch.
- Wildlife: the [wildlife list](https://indigene.app/wildlife) opens as one list you can sort by how many plants support each animal, group by animal type, or narrow to animals that need one particular plant, like the monarch.
- Internal: the registry now carries each taxon's caterpillar count, the highest any region's list documents, so the catalog can sort without downloading every region. `registry:check` pins it. The Sort / Group / Filter panel moved to `components/roster-controls.ts`, shared with the region roster and the wildlife index, whose view lives in `lib/wildlife-view.ts`.

### Changed

- Wildlife: the top of the page is now a heading and one sentence, so the first animals show up without scrolling.
