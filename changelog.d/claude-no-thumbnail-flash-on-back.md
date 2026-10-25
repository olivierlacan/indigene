### Fixed

- Plants: going back from a plant to a list no longer flashes the drawings before the photos — pictures you've already seen show straight away.
- Internal: `loadPhoto` remembers every photo it has revealed this session and shows those synchronously, skipping the observer, queue, decode and fade.
