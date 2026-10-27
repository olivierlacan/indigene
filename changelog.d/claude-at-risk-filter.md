### Added

- Conservation: the [wildlife](https://indigene.app/wildlife) list and each region's plant list can now show only what's at risk — ranked vulnerable or worse — with the most threatened first, like the gopher tortoise.
- Internal: `threatLevel()` and `atRiskFirst()` in `lib/conservation.ts` (unit-tested) back both filters; the address takes `only=at-risk`, combinable as `only=sole,at-risk` or `only=pioneers,at-risk`. A new `switches` panel row keeps the wildlife index's two filters in view rather than in a drawer.
