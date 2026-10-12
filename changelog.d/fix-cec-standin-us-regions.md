### Fixed

- Regions: a spot just outside a US region no longer gets its list when a map service we ask is down — it gets the same answer it would on a good day.
- Internal: US regions declare `cec-na` codes as `standIn` sets, so a CEC fallback answer inside CONUS is tested instead of left to the box; stand-ins never draw maps. `selection:check` reruns every US place CEC-only.
