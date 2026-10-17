### Fixed

- Tela Botanica, the second French name list, is checked again: the check had
  been asking it for a column its table doesn't have, and read the error it got
  back as "no name".

### Changed

- Internal: `npm run taxref:extract -- --fetch` takes the official TAXREF zip
  from PatriNat's asset host and reduces it to the rows the app names; the
  French-name check reads that extract first and GBIF's copy only when absent.

### Added

- 201 plants and animals that showed only their Latin name to French readers
  now have the French name the national reference lists give them, from
  *Érable à sucre* to *Sittelle à tête brune*.
