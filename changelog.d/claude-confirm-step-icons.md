### Changed

- Matches: the soil and climate step shows each fact with an icon (❄️ winter, 🌧️ rain, ⛰️ slope), and dry, evenly moist and wet each get a drawn drop. The one-minute soil check moved to [the guide](https://indigene.app/guide/find/#soil).
- Ranking: each goal has its own icon, on the goals step and at the top of your plant list. The leading three show as a gold, silver and bronze podium.
- Ranking: your plant list stops at the plants that suit your spot, 25 at a time with "Show the next 25". Poor matches stay out unless you type their name.
- Ranking: plant cards show size, flowering months and wildlife value as small chips. Tap or hover a label like Essential to see what it means.
- Regions: your spot's ecoregion and hardiness zone show as small tags. Tapping one opens [a guide](https://indigene.app/guide/regions/#zones) on what they are and where the numbers come from.
- Plants: Kew's check on a plant's native status shows a green tick or a caution mark, with a link to what the check means. "Where it's native" is now "Habitat", which is what it describes.
- Matches: steps you've finished are links, so tapping "Sun" takes you back to change it.
- Plants: "How to grow more" gives each method room to breathe, and a plant's identity code has a copy button.
- Many short texts across the app are shorter, and none use long dashes any more.

### Fixed

- Ranking: the goal and filter rows no longer stay pinned over the plant list as you scroll.
- Internal: 351 em-dash UI strings rewritten in both locales (page titles now use " · Indigene"; `brand.ts` likewise). New `components/moisture-icon.ts`, `badge-tip.ts`; `zone-chip.ts` gains `scaleChip()`/`ecoregionChip()`; `native-evidence.ts` draws its verdict mark; `Preset` carries an `icon`. `zonePlain()` and the ribbon-test strings are gone; the test lives in the guide.
