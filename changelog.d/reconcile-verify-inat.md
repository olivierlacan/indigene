### Fixed

- Internal: the registry reconcile now checks every iNaturalist taxon id Wikidata supplies against iNaturalist, and looks up by name any that are retired or point at a variety. Four stale ids slipped into the October gap-fill run (#210) this way.
