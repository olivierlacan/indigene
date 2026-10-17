### Changed

- The [Pacific Northwest's worst invasives](https://indigene.app/invasives/in/pnw) now go ten deep, ranked by how much harm Washington's ecologists found each one does to wild habitat. Scotch broom, herb-robert and English ivy follow until those ecologists rate them.

### Added

- Invasives: Bohemian knotweed, English hawthorn, yellow flag iris and old man's beard each have a page on how to spot and remove them.
- Internal: PNW ties now carry WIRS (Washington Natural Heritage Program) Ecological Impact ranks as `impact` listings — High → transforms, Moderate → spreads — via a `wirs()` helper; broom, herb-robert and ivy keep their WA weed-board class until WIRS assesses them. `listings:check` reads WIRS's landing-page table (the per-species PDFs use glyph-coded fonts `pdfText` can't read). Region share cards now show the top five.
