### Added

- Plants: each plant page now says who checked that it is native where you are,
  and when — and says so plainly on the nine plants a world checklist couldn't
  confirm for a region we list them in.
  https://indigene.app/plants/quercus-alba
- Internal: `npm run native:check` covers every region WCVP can answer for, not
  just Ireland — a region takes several TDWG areas and one native area wins.
  `npm run native-evidence` reduces those snapshots to the 2.8 KB the page
  reads, storing only the rows that were *not* confirmed. DATA_SOURCES.md now
  states the native rule in one place.
