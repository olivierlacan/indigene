### Added

- Finder: on the location map, press and hold to open a magnifier and nudge
  the pin a few metres at a time. The line under the map now says which way it
  moved, like "nudged 40 m northeast".

### Fixed

- Finder: on iPhone, holding a finger on the location map no longer starts
  selecting the text around it, so the map moves the way you'd expect.
- Internal: the map cancels `touchstart` (all but the attribution link) and
  sets `user-select: none`; the direction comes from `lib/compass.ts`, which
  has its own test.
