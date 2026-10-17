### Changed

- Internal: `npm run taxref:extract` reduces the official TAXREF download
  (fetched in a browser, git-ignored) to the rows the app names; the French-name
  check reads that extract first and GBIF's copy only when it is absent.
