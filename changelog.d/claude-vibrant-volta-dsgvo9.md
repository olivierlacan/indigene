### Fixed

- Searching your town on the [location page](https://indigene.app/#/location) and pressing Next no longer sends you to Pittsburgh's plants. One match is used at once; with several, Next waits until you tap yours.
- Internal: `steps/location.ts` tracks whether the pin was placed (GPS, search pick, drag, tap or keys). The Pittsburgh fallback no longer counts as a spot, so Next asks for one instead.
