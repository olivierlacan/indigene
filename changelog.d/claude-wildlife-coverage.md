### Added

- **The Kantō Plain names its wildlife.** Japan's national butterfly, the great purple emperor, raises its caterpillars on hackberry; the oak silkmoth and a set of canopy hairstreaks live on konara oak. Seven new animals, 18 ties. [Kantō](https://indigene.app/regions/kanto)
- Regions: thirteen more Auckland plants now name the moths they feed, among them the lichen-grey forest semilooper.
- Internal: `wildlife-gaps.json` lists every plant that names no animal, with a reason; `wildlife-gaps.test.ts` fails a PR that adds an untied plant without listing it (`npm run wildlife:gaps`). `wildlife-hosts.test.ts` re-reads HOSTS' Japan records and Plant-SyNZ's moth lists for every tie that cites them, offline. Kantō joins `wildlife:native` (iNaturalist Japan, GRIIS Japan).

### Fixed

- Wildlife: European, New Zealand and Japanese butterflies, moths and birds no longer link to North American field guides that don't list them.
